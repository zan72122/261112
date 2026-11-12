// Persistence: versioned, range-checked; any storage failure just means playing from memory.
import { L } from './world.js';
import { clamp } from './util.js';

const KEY = 'gf-261112-1-sentaku', VER = 3;
const q = (arr) => Array.from(arr, (v) => Math.round(clamp(v, 0, 1) * 50));

export function saveState(G) {
  if (G.dead) return false;
  try {
    const cloths = {};
    for (const c of G.list) {
      let loc = c.loc; if (loc === 'held') loc = c.rod ? 'rod' : 'basket'; if (loc === 'person') loc = 'flat';
      const o = { loc, wf: q(c.wetF), wb: q(c.wetB), d: q(c.dirt), inv: !!c.inverted, wrap: c.wrap ? c.wrap.k : -1, spun: !!(c.wrap && c.wrap.spun) };
      if (loc === 'rod' && c.rod) o.rod = { id: c.rod.id, s: c.rod.s, zr: c.rod.zr, row: c.rod.row, holds: c.rod.holds.map((h) => ({ k: h.k, dz: h.dz, pinned: !!h.pinned })) };
      if (loc === 'flat' && c.flat) o.flat = { where: c.flat.where === 'drawer' ? 'drawer' : 'top', ox: c.flat.ox, oz: c.flat.oz, rot: c.flat.rot ? 1 : 0, folds: c.flat.folds.map((f) => ({ ax: f.ax, c: f.c, side: f.side })), order: Math.max(0, G.fold.order.indexOf(c)) };
      cloths[c.id] = o;
    }
    const P = G.progress;
    const s = { v: VER, station: G.station, basket: { station: G.basket.station, shelf: !!G.basket.shelf }, standZ: G.dry.stand.z, drawer: G.fold.drawer.open > 0.5 ? 1 : 0,
      progress: { washed: !!P.washed, spun: !!P.spun, hung: !!P.hung, bal: !!P.bal, fold: !!P.fold, dried: !!P.dried, card: !!P.card, washCount: P.washCount | 0, rainFor: P.rainFor | 0 }, cloths };
    localStorage.setItem(KEY, JSON.stringify(s)); G.saveOK = true; return true;
  } catch (e) { G.saveOK = false; return false; }
}

const num = (v, a, b) => typeof v === 'number' && isFinite(v) && v >= a && v <= b;
const stn = (v) => v === 'wash' || v === 'bal' || v === 'fold';
export function loadState() {
  let s;
  try { const raw = localStorage.getItem(KEY); if (!raw) return null; s = JSON.parse(raw); } catch (e) { return null; }
  try {
    if (!s || s.v !== VER || !stn(s.station) || !s.basket || !stn(s.basket.station) || !num(s.standZ, L.standZ[0], L.standZ[1]) || !s.progress || !s.cloths) return null;
    if (!num(s.progress.washCount, 0, 1e6) || !num(s.progress.rainFor, -1, 1e6)) return null;
    for (const id of ['shirt', 'towel', 'sockA', 'sockB']) {
      const c = s.cloths[id]; if (!c || !['basket', 'drum', 'rod', 'flat'].includes(c.loc)) return null;
      for (const a of [c.wf, c.wb, c.d]) { if (!Array.isArray(a) || a.length > 400) return null; for (const v of a) if (!num(v, 0, 50)) return null; }
      if (c.loc === 'rod') { const r = c.rod; if (!r || (r.id !== 0 && r.id !== 1) || !num(r.s, -1, 40) || !num(r.zr, -2, 2) || !num(r.row, 0, 40) || !Array.isArray(r.holds) || r.holds.length > 8) return null; for (const h of r.holds) if (!num(h.k, 0, 400) || !num(h.dz, -2, 2)) return null; }
      if (c.loc === 'flat') { const f = c.flat; if (!f || !num(f.ox, -5, 5) || !num(f.oz, -5, 5) || !Array.isArray(f.folds) || f.folds.length > 4) return null; for (const d of f.folds) if ((d.ax !== 0 && d.ax !== 1) || !num(d.c, -2, 2) || (d.side !== 1 && d.side !== -1)) return null; }
      if (!num(c.wrap, -1, 400)) return null;
    }
    return s;
  } catch (e) { return null; }
}

export function restore(G, s) {
  const b = G.basket, B = L.basket;
  Object.assign(G.progress, s.progress); G.progress.washing = false;
  G.station = s.station; b.station = s.basket.station; b.shelf = !!s.basket.shelf && b.station === 'fold';
  const hm = b.shelf ? L.stShelf : b.station === 'wash' ? L.stWash : b.station === 'bal' ? L.stBal : L.stFold;
  b.x = hm.x; b.y = hm.y; b.z = hm.z;
  G.dry.stand.z = s.standZ; G.fold.drawer.open = s.drawer ? 1 : 0; G.fold.drawer.target = G.fold.drawer.open;
  let nb = 0, nd = 0; const flats = [];
  for (const c of G.list) {
    const o = s.cloths[c.id];
    if (o.wf.length !== c.n || o.wb.length !== c.n || o.d.length !== c.n) throw new Error('size');
    for (let k = 0; k < c.n; k++) { c.wetF[k] = o.wf[k] / 50; c.wetB[k] = o.wb[k] / 50; c.dirt[k] = o.d[k] / 50; }
    c.updateWetMean(); c.kin.fill(0); c.snag = -1; c.rod = null; c.flat = null; c.frame = null; c.wrap = null; c.stuck = 0;
    if (c.kind === 'sock') { c.inverted = !!o.inv; G.setSockLook(c); }
    c.loc = o.loc;
    if (o.loc === 'basket') {
      c.site = b.station; const lay = nb++;
      for (let j = 0; j < c.ny; j++) for (let i = 0; i < c.nx; i++) { if (!c.on(i, j)) continue; const f = j / Math.max(1, c.ny - 1) * 2.4, tri = Math.abs(((f + 1) % 2) - 1); c.setPos(c.idx(i, j), b.x + (i / (c.nx - 1) - 0.5) * Math.min(0.34, c.nx * c.cell * 0.6) + (lay % 2) * 0.03, b.y + B.floor + 0.05 + lay * 0.06 + Math.floor(f + 0.5) * 0.02, b.z - 0.1 + tri * 0.2); }
    } else if (o.loc === 'drum') {
      c.site = 'wash'; const lay = nd++;
      for (let j = 0; j < c.ny; j++) for (let i = 0; i < c.nx; i++) { if (!c.on(i, j)) continue; const f = j / Math.max(1, c.ny - 1) * 2.2, tri = Math.abs(((f + 1) % 2) - 1); c.setPos(c.idx(i, j), L.drum.cx + (i / (c.nx - 1) - 0.5) * 0.22, L.drum.cy - 0.17 + lay * 0.03 + Math.floor(f + 0.5) * 0.015, -0.15 + tri * 0.22); }
    } else if (o.loc === 'rod') {
      c.site = 'bal'; const r = o.rod, rr = L.rods[r.id];
      if (r.row >= c.ny || r.s > c.ny - 1) throw new Error('row');
      c.rod = { id: r.id, s: r.s, zr: r.zr, row: r.row, holds: [] };
      const s0 = r.s >= 0 ? r.s : r.row, z0 = G.dry.stand.z + r.zr;
      for (let j = 0; j < c.ny; j++) for (let i = 0; i < c.nx; i++) if (c.on(i, j)) c.setPos(c.idx(i, j), rr.x + (j > s0 ? 0.013 : -0.013), rr.y - Math.abs(j - s0) * c.cell, z0 - i * c.cell);
      for (const h of r.holds) { if (h.k >= c.n || !c.active[h.k]) throw new Error('hold'); const hold = { k: h.k, dz: h.dz, pinned: !!h.pinned, pin: null }; if (hold.pinned) { const pin = G.dry.pins.find((p) => p.state === 'tray'); if (pin) { pin.state = 'on'; pin.cloth = c; pin.hold = hold; hold.pin = pin; } else hold.pinned = false; } c.rod.holds.push(hold); }
      if (c.rod.s < 0 && !c.rod.holds.length) c.rod.s = c.rod.row;
    } else {
      c.site = 'fold'; const f = o.flat;
      c.flat = { folds: f.folds.map((d) => ({ ax: d.ax, c: d.c, side: d.side })), rot: f.rot ? 1 : 0, where: f.where === 'drawer' ? 'drawer' : 'top', ox: f.ox, oz: f.oz, y: 0, anim: 1 };
      flats.push([f.order | 0, c]);
    }
  }
  flats.sort((a, c) => a[0] - c[0]); G.fold.order = flats.map((f) => f[1]);
  for (const c of G.fold.order) { c.flat.y = G.fold.bounds(c.flat.where).y; G.fold.clampIn(c); }
  G.fold.restack();
  for (const c of G.list) { const o = s.cloths[c.id]; if (c.kind === 'sock' && o.wrap >= 0 && c.loc === G.cl.towel.loc && (c.loc === 'drum' || c.loc === 'basket') && o.wrap < G.cl.towel.n) c.wrap = { towel: G.cl.towel, k: o.wrap, spun: !!o.spun }; }
}
