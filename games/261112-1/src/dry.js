// Balcony: drying stand with two rods, clothespins, wind (with shadowing between cloths),
// per-face drying, one passing shower outside the eaves.
import * as THREE from 'three';
import { L } from './world.js';
import { H } from './sim.js';
import { Rain } from './fx.js';
import { clamp, lerp, n1 } from './util.js';

const CW = 3.0, DRY = 0.013;

export class Dry {
  constructor(G) {
    this.G = G; const W = G.W;
    this.stand = { z: L.standZ0, tz: null, slideT: 0 };
    this.pins = [];
    for (let i = 0; i < 6; i++) { const mesh = W.makePin(); mesh.scale.setScalar(1.25); G.scene.add(mesh); this.pins.push({ i, mesh, state: 'tray', cloth: null, hold: null, pos: new THREE.Vector3(), fly: null, wig: 0 }); }
    this.simT = 0; this.windBase = 1.6; this.frame = 0;
    this.rainS = { state: 'idle', t: 0, k: 0 }; this.wetFloor = 0;
    this.rain = new Rain(G.scene, G.low ? 150 : 340, { x0: 0.3, x1: 4.6, z0: L.parapetZ - 1.2, z1: L.eaveZ - 0.06, top: 3.3 });
    this._v = new THREE.Vector3(); this._a = {};
  }
  rodZ0(c) { return this.stand.z + c.rod.zr; }

  // ---------- pointer targets ----------
  dragTarget(c, sx, sy) {
    const G = this.G; let plane = 3.05; c.near = -1;
    if (c.rod) plane = L.rods[c.rod.id].x + 0.035;
    else {
      let bd = 0.17;
      for (let r = 0; r < 2; r++) { const p = G.hitX(sx, sy, L.rods[r].x + 0.035, this._v), d = Math.abs(p.y - L.rods[r].y); if (d < bd && Math.abs(p.z - this.stand.z) < L.rodHalf + 0.1) { bd = d; c.near = r; } }
      if (c.near >= 0) plane = L.rods[c.near].x + 0.035;
    }
    G.hitX(sx, sy, plane, c.gt); c.gt.y = Math.max(0.05, c.gt.y); c.gt.z = clamp(c.gt.z, L.parapetZ + 0.2, -0.65);
    if (c.rod) this.tension(c);
  }
  tension(c) {
    const rod = c.rod, r = L.rods[rod.id], g = c.grab; if (g < 0) return;
    const ig = g % c.nx, jg = (g / c.nx) | 0, cell = c.cell, F = c.gt, z0 = this.rodZ0(c);
    let anchorZ, Lm;
    if (rod.s >= 0) { anchorZ = z0 - ig * cell; Lm = Math.abs(jg - rod.s) * cell; }
    else {
      let best = null, bd = 1e9; for (const h of rod.holds) { const d = Math.hypot((h.k % c.nx) - ig, ((h.k / c.nx) | 0) - jg); if (d < bd) { bd = d; best = h; } }
      if (!best) { this.detach(c); return; }
      anchorZ = z0 + best.dz; Lm = bd * cell;
    }
    const dz = F.z - anchorZ, allow = 0.6 * Lm + 0.05;
    if (Math.abs(dz) > allow) { const sh = dz - Math.sign(dz) * allow; rod.zr += sh; this.clampSpan(c); anchorZ += sh; }
    const dist = Math.hypot(F.x - r.x, F.y - r.y, F.z - anchorZ), over = dist - (Lm * 1.05 + 0.025);
    if (over <= 0) return;
    const pinned = rod.holds.some((h) => h.pinned);
    if (pinned) { if (over > 0.17) { for (const h of rod.holds.slice()) if (h.pin) this.detachPin(h.pin, true); this.G.audio.play('pop'); } return; }
    if (rod.s >= 0) {
      const dir = jg > rod.s + 0.01 ? -1 : jg < rod.s - 0.01 ? 1 : 0;
      if (dir) { const ns = clamp(rod.s + dir * Math.min(over / cell, 0.22), 0, c.ny - 1); if (ns !== rod.s) { rod.s = ns; return; } }
      if (over > 0.26) this.detach(c);
    } else if (over > 0.2) { rod.holds.length = 0; this.detach(c); }
  }
  clampSpan(c) {
    const rod = c.rod, row = rod.s >= 0 ? Math.round(rod.s) : rod.row; let i0 = 99, i1 = -1;
    for (let i = 0; i < c.nx; i++) if (c.on(i, row)) { i0 = Math.min(i0, i); i1 = Math.max(i1, i); }
    rod.zr = clamp(rod.zr, -L.rodHalf + 0.03 + i1 * c.cell, L.rodHalf - 0.03 + i0 * c.cell);
  }
  detach(c) { for (const h of c.rod.holds) { if (h.pin) this.freePin(h.pin); c.kin[h.k] = 0; } if (c.grab >= 0) c.kin[c.grab] = 1; c.rod = null; c.loc = 'held'; this.G.audio.play('grab'); }
  hang(c, rodId, k, fz) {
    const G = this.G, r = L.rods[rodId], ig = k % c.nx, jg = (k / c.nx) | 0;
    c.loc = 'rod'; c.site = 'bal'; c.homing = 0;
    c.rod = { id: rodId, s: jg, zr: fz + ig * c.cell - this.stand.z, row: jg, holds: [] };
    this.clampSpan(c);
    const a = k * 3, z0 = this.rodZ0(c);
    c.translate(r.x - c.p[a], r.y + 0.02 - c.p[a + 1], z0 - ig * c.cell - c.p[a + 2]);
    G.audio.play('thud', 0.45); G.onProgress('hung');
  }
  release(c, sx, sy) {
    const G = this.G, k = c.lastGrab;
    if (c.loc === 'held') {
      const b = G.basket, F = c.gt, nearBasket = G.sdist(sx, sy, b.x, b.y + 0.25, b.z) < G.pickR() * 2.6 || F.y < 0.6;
      if (c.near >= 0) this.hang(c, c.near, k, F.z);
      else if (nearBasket) G.toBasket(c);
      else { const p0 = G.hitX(sx, sy, L.rods[0].x, this._v).y, d0 = Math.abs(p0 - L.rods[0].y), p1 = G.hitX(sx, sy, L.rods[1].x, this._v).y, d1 = Math.abs(p1 - L.rods[1].y); this.hang(c, d0 < d1 ? 0 : 1, k, clamp(F.z, this.stand.z - L.rodHalf, this.stand.z + L.rodHalf)); }
      return;
    }
    if (!c.rod || k < 0) return;
    const rod = c.rod, r = L.rods[rod.id], a = k * 3, near = Math.hypot(c.p[a] - r.x, c.p[a + 1] - r.y) < 0.1, jg = (k / c.nx) | 0, ig = k % c.nx;
    if (!near) return;
    if (rod.s < 0) { if (!rod.holds.some((h) => h.k === k)) rod.holds.push({ k, dz: clamp(c.p[a + 2], this.stand.z - L.rodHalf, this.stand.z + L.rodHalf) - this.rodZ0(c), pinned: false, pin: null }); }
    else if (!rod.holds.length && Math.abs(jg - rod.s) >= 1) { rod.s = jg; rod.row = jg; rod.zr = c.p[a + 2] + ig * c.cell - this.stand.z; this.clampSpan(c); }
  }

  // ---------- pins ----------
  pinWorld(pin, out) {
    if (pin.state === 'on') { const c = pin.cloth, r = L.rods[c.rod.id]; return out.set(r.x, r.y + 0.004, this.rodZ0(c) + pin.hold.dz); }
    if (pin.state === 'tray') { const a = pin.i / 6 * 6.283 + 0.4; return out.set(3.09 + Math.cos(a) * 0.05, 0.545 + (pin.i % 2) * 0.006, this.stand.z + Math.sin(a) * 0.055); }
    return out.copy(pin.pos);
  }
  freePin(pin) { pin.cloth = null; pin.hold = null; pin.state = 'fly'; pin.fly = { t: 0, from: pin.pos.clone() }; }
  detachPin(pin, toTray) {
    const c = pin.cloth; if (!c || !c.rod) { pin.cloth = null; pin.hold = null; return; }
    this.pinWorld(pin, pin.pos);
    const rod = c.rod, h = pin.hold, i = rod.holds.indexOf(h); if (i >= 0) rod.holds.splice(i, 1);
    c.kin[h.k] = c.grab === h.k ? 1 : 0;
    if (rod.s < 0 && rod.holds.length === 0) { rod.s = rod.row; rod.zr = this.rodZ0(c) - this.stand.z; }   // rests over the rod again
    pin.cloth = null; pin.hold = null;
    if (toTray) { pin.state = 'fly'; pin.fly = { t: 0, from: pin.pos.clone() }; }
    this.G.markDirty();
  }
  pinTarget(pos) {
    let best = null, bd = 0.16;
    for (const c of this.G.list) {
      if (!c.rod) continue; const rod = c.rod, r = L.rods[rod.id], z0 = this.rodZ0(c), row = rod.s >= 0 ? clamp(Math.round(rod.s), 0, c.ny - 1) : rod.row;
      const dy = Math.abs(pos.y - r.y), dx = Math.abs(pos.x - r.x); if (dy > 0.15 || dx > 0.25) continue;
      let i = Math.round((z0 - pos.z) / c.cell), bi = -1, bdi = 99;
      for (let q = 0; q < c.nx; q++) if (c.on(q, row) && Math.abs(q - i) < bdi) { bdi = Math.abs(q - i); bi = q; }
      if (bi < 0) continue; const d = Math.abs(z0 - bi * c.cell - pos.z) * 0.8 + dy + dx * 0.3;
      if (bdi <= 1.2 && d < bd) { bd = d; best = { c, i: bi, row }; }
    }
    return best;
  }
  attachPin(pin, t) {
    const c = t.c, rod = c.rod, k = c.idx(t.i, t.row);
    let h = rod.holds.find((q) => q.k === k);
    if (h && h.pin && h.pin !== pin) { this.freePin(pin); return; }
    if (!h) { h = { k, dz: -t.i * c.cell, pinned: true, pin }; rod.holds.push(h); } else { h.pinned = true; h.pin = pin; h.dz = -t.i * c.cell; }
    pin.state = 'on'; pin.cloth = c; pin.hold = h;
    if (rod.s >= 0 && (rod.s < 0.6 || rod.s > c.ny - 1.6)) { rod.row = t.row; rod.s = -1; }       // hung by its edge: only pins hold it now
    this.G.audio.play('pin'); this.G.markDirty();
  }
  pinDrag(pin, sx, sy) {
    const G = this.G, d = { kind: 'pin', sx, sy, moved: 0 }, wasOn = pin.state === 'on';
    this.pinWorld(pin, pin.pos);
    const start = () => { if (pin.state === 'on') this.detachPin(pin, false); pin.state = 'held'; pin.fly = null; G.audio.play('click', 0.5); };
    if (!wasOn) start();
    d.move = (x, y) => {
      d.moved = Math.max(d.moved, Math.hypot(x - sx, y - sy)); if (pin.state === 'on') { if (d.moved < 14) return; start(); }
      let plane = 3.0, bd = 0.16; for (let r = 0; r < 2; r++) { const p = G.hitX(x, y, L.rods[r].x + 0.02, this._v), dd = Math.abs(p.y - L.rods[r].y); if (dd < bd) { bd = dd; plane = L.rods[r].x + 0.02; } }
      G.hitX(x, y, plane, pin.pos); pin.pos.y = Math.max(0.06, pin.pos.y);
    };
    d.up = () => {
      if (pin.state === 'on') { pin.wig = 1; G.audio.play('wiggle'); return; }
      const t = this.pinTarget(pin.pos);
      if (t) this.attachPin(pin, t); else { this.freePin(pin); G.audio.play('click', 0.4); }
    };
    return d;
  }
  standDrag(sx, sy) {
    const G = this.G, st = this.stand, z0 = st.z, a = G.project(2.65, 1.1, st.z, {}), b = G.project(2.65, 1.1, st.z - 1, {}), ppm = Math.max(20, Math.abs(b.x - a.x));
    const d = { kind: 'stand', sx, sy, moved: 0 };
    d.move = (x) => { d.moved = Math.max(d.moved, Math.abs(x - sx)); st.tz = null; const nz = clamp(z0 - (x - sx) / ppm / 0.5, L.standZ[0], L.standZ[1]); if (Math.abs(nz - st.z) > 0.002 && G.time - st.slideT > 0.28) { st.slideT = G.time; G.audio.play('slide', 0.6); } st.z = nz; };
    d.up = () => { if (d.moved < 8) { st.tz = st.z < -1.9 ? -1.3 : -2.5; G.audio.play('slide'); } G.markDirty(); };
    return d;
  }
  pick(sx, sy, cand, clothDrag) {
    const G = this.G;
    const np = G.nearParticle(sx, sy, (c) => c.site === 'bal' && (c.loc === 'basket' || c.loc === 'rod'));
    if (np) cand(np.d, 0, () => clothDrag(np.c, np.k, sx, sy));
    for (const pin of this.pins) { if (pin.state === 'fly') continue; const p = this.pinWorld(pin, this._v); cand(G.sdist(sx, sy, p.x, p.y, p.z), pin.state === 'on' ? 16 : 8, () => this.pinDrag(pin, sx, sy)); }
    for (const s of [-1, 1]) for (const t of [0.25, 0.5, 0.75]) cand(G.sdist(sx, sy, lerp(2.52, 2.78, t), lerp(1.25, 1.07, t), this.stand.z + s * L.rodHalf), 4, () => this.standDrag(sx, sy));
  }

  // ---------- physics hooks ----------
  wind(y, z, t, out) {
    const b = this.windBase, l = b * (0.68 + 0.64 * n1(t * 1.7 + z * 1.6 + y * 0.9, 9));
    out.x = l; out.z = -0.3 * l + (n1(t * 0.7 + y * 2.1, 11) - 0.5) * 1.5 * b * 0.5; out.y = (n1(t * 1.1 + z * 1.3, 13) - 0.5) * 0.6 * b * 0.5; return out;
  }
  forces(c) {
    if (c.loc === 'basket' || c.loc === 'flat') return;
    c.computeNormals(); const p = c.p, q = c.q, e = c.ext, n = c.nrm, t = this.simT, w = this._a; let sp = 0, cnt = 0;
    for (let k = 0; k < c.n; k++) {
      if (!c.active[k]) continue; const a = k * 3;
      this.wind(p[a + 1], p[a + 2], t, w);
      const vx = (p[a] - q[a]) / H, vy = (p[a + 1] - q[a + 1]) / H, vz = (p[a + 2] - q[a + 2]) / H;
      const f = ((w.x - vx) * n[a] + (w.y - vy) * n[a + 1] + (w.z - vz) * n[a + 2]) * CW * c.shade[k] / (1 + 2.6 * (c.wetF[k] + c.wetB[k]) * 0.5);
      e[a] += n[a] * f; e[a + 1] += n[a + 1] * f; e[a + 2] += n[a + 2] * f;
      sp += Math.hypot(vx, vy, vz); cnt++;
    }
    c._sp = (c._sp || 0) * 0.98 + sp / cnt * 0.02; c.swingSlow = (c.swingSlow || 0) * 0.9983 + sp / cnt * 0.0017;
  }
  constrain(c) {
    const rod = c.rod, r = L.rods[rod.id], z0 = this.rodZ0(c), cell = c.cell, p = c.p, nx = c.nx;
    const yTop = r.y + L.rodR + c.thick * 0.5 + 0.002;
    if (rod.s >= 0) {
      const s = rod.s, jf = Math.min(Math.floor(s), c.ny - 2), al = s - jf;
      for (let i = 0; i < nx; i++) {
        const k0 = jf * nx + i, k1 = k0 + nx, a0 = c.active[k0] && !c.kin[k0], a1 = c.active[k1] && !c.kin[k1], tz = z0 - i * cell;
        let w0 = a0 ? 1 - al : 0, w1 = a1 ? al : 0;
        if (!c.active[k0] && a1) w1 = 1; if (!c.active[k1] && a0) w0 = 1;
        const den = w0 * w0 + w1 * w1; if (den < 1e-4) continue;
        const ws = w0 + w1, cx = (p[k0 * 3] * w0 + p[k1 * 3] * w1) / ws, cy = (p[k0 * 3 + 1] * w0 + p[k1 * 3 + 1] * w1) / ws, cz = (p[k0 * 3 + 2] * w0 + p[k1 * 3 + 2] * w1) / ws;
        const dx = (r.x - cx) * ws / den, dy = (yTop - cy) * ws / den, dz = (tz - cz) * ws / den;
        if (w0) { p[k0 * 3] += dx * w0; p[k0 * 3 + 1] += dy * w0; p[k0 * 3 + 2] += dz * w0; }
        if (w1) { p[k1 * 3] += dx * w1; p[k1 * 3 + 1] += dy * w1; p[k1 * 3 + 2] += dz * w1; }
      }
      // the cloth turns tightly over the rod
      for (let dj = 1; dj <= 2; dj++) for (const sg of [-1, 1]) {
        const j = sg > 0 ? Math.ceil(s + 0.01) + dj - 1 : Math.floor(s - 0.01) - dj + 1; if (j < 0 || j >= c.ny) continue;
        for (let i = 0; i < nx; i++) { const k = j * nx + i; if (!c.active[k] || c.kin[k]) continue; const a = k * 3, lim = 0.014 + dj * 0.008; if (p[a + 1] < r.y + 0.03) { if (sg > 0 && p[a] > r.x + lim) p[a] = r.x + lim; else if (sg < 0 && p[a] < r.x - lim) p[a] = r.x - lim; } }
      }
      // keep the two hanging layers apart and in order (front half toward the viewer)
      for (let j = Math.ceil(s + 0.3); j < c.ny; j++) {
        const jm = Math.round(2 * s - j);
        for (let i = 0; i < nx; i++) {
          const k = j * nx + i; if (!c.active[k] || c.kin[k]) continue; const a = k * 3;
          if (jm >= 0 && jm < s - 0.3 && c.active[jm * nx + i]) {
            const b = (jm * nx + i) * 3, gap = p[a] - p[b] - 0.022;
            if (gap < 0) { if (c.kin[jm * nx + i]) p[a] -= gap; else { p[a] -= gap * 0.5; p[b] += gap * 0.5; } }
          } else if (jm < 0 && p[a + 1] > r.y - 0.06 && p[a] < r.x + 0.012) p[a] = r.x + 0.012;
        }
      }
      for (let j = 0; j < s - 0.3; j++) { const jm = Math.round(2 * s - j); if (jm < c.ny) continue; for (let i = 0; i < nx; i++) { const k = j * nx + i; if (!c.active[k] || c.kin[k]) continue; const a = k * 3; if (p[a + 1] > r.y - 0.06 && p[a] > r.x - 0.012) p[a] = r.x - 0.012; } }
    } else {
      for (const h of rod.holds) {
        const a = h.k * 3, ty = r.y - 0.016, tz = z0 + h.dz;
        if (h.pinned) { c.kin[h.k] = 1; p[a] = r.x; p[a + 1] = ty; p[a + 2] = tz; c.q[a] = r.x; c.q[a + 1] = ty; c.q[a + 2] = tz; }
        else if (c.grab !== h.k) { p[a] += (r.x - p[a]) * 0.4; p[a + 1] += (ty + 0.02 - p[a + 1]) * 0.4; p[a + 2] += (tz - p[a + 2]) * 0.25; }
      }
    }
  }

  // ---------- per frame ----------
  update(dt) {
    const G = this.G, W = G.W, st = this.stand, au = G.audio, onBal = G.station === 'bal'; this.frame++;
    this.simT += dt;
    if (st.tz !== null) { st.z += clamp(st.tz - st.z, -dt * 1.3, dt * 1.3); if (Math.abs(st.tz - st.z) < 0.002) st.tz = null; }
    W.stand.position.z = st.z;
    const t = this.simT; this.windBase = 0.8 + 2.1 * n1(t * 0.27, 3) + 1.1 * n1(t * 1.05, 5);
    // pins
    for (const pin of this.pins) {
      if (pin.state === 'fly') { const f = pin.fly; f.t = Math.min(1, f.t + dt * 2.6); pin.state = 'tray'; const dst = this.pinWorld(pin, this._v); pin.state = 'fly'; pin.pos.lerpVectors(f.from, dst, f.t * f.t * (3 - 2 * f.t)); pin.pos.y += Math.sin(f.t * Math.PI) * 0.12; if (f.t >= 1) { pin.state = 'tray'; au.play('click', 0.4); } }
      else if (pin.state !== 'held') this.pinWorld(pin, pin.pos);
      pin.wig *= Math.exp(-dt * 8);
      const m = pin.mesh; m.position.copy(pin.pos);
      if (pin.state === 'tray') m.rotation.set(Math.PI / 2, 0, pin.i * 1.9); else m.rotation.set(0, Math.PI / 2, Math.sin(G.time * 40) * pin.wig * 0.3 + (pin.state === 'on' ? 0.12 : 0));
    }
    // rain: passes once per wash while laundry is out
    const R = this.rainS, anyRod = G.list.some((c) => c.rod);
    if (R.state === 'idle') { if (onBal && anyRod && G.progress.rainFor !== G.progress.washCount) { R.t += dt; if (R.t > 15) { R.state = 'rain'; R.t = 0; } } }
    else if (R.state === 'rain') { R.t += dt; R.k = Math.min(1, R.t / 2.5) * clamp((17 - R.t) / 3.5, 0, 1); if (R.t >= 17) { R.state = 'idle'; R.t = 0; R.k = 0; G.progress.rainFor = G.progress.washCount; G.markDirty(); } }
    G.sunK = 1 - 0.42 * R.k;
    this.wetFloor = R.k > 0.05 ? Math.min(1, this.wetFloor + dt * 0.35 * R.k) : Math.max(0, this.wetFloor - dt * 0.03);
    W.wetFloor.opacity = this.wetFloor * 0.5;
    this.rain.box.x1 = G.camera.position.x - 1.1; this.rain.update(dt, R.k, this.windBase);
    if (R.k > 0.2 && onBal && Math.random() < R.k * 0.5) G.drops.spawn(1.5 + Math.random() * 3, 0.02, L.parapetZ + Math.random() * (L.eaveZ - L.parapetZ), (Math.random() - 0.5) * 0.5, 0.7 + Math.random() * 0.5, (Math.random() - 0.5) * 0.5, 0.25, 0.004, 0, -0.01);
    au.level('wind', onBal ? 0.03 + this.windBase * 0.028 : 0.006, 300 + this.windBase * 90);
    au.level('rain', onBal ? R.k * 0.22 : R.k * 0.04);

    // wind shadow + face coverage between hanging layers
    const rodCloths = G.list.filter((c) => c.rod);
    if (this.frame % 5 === 0 && rodCloths.length) {
      for (const c of rodCloths) for (let k = 0; k < c.n; k++) {
        if (!c.active[k]) continue; const a = k * 3, px = c.p[a], py = c.p[a + 1], pz = c.p[a + 2], nxv = c.nrm[a], ki = k % c.nx, kj = (k / c.nx) | 0;
        let up = false, cf = 0, cb = 0;
        for (const d of rodCloths) for (let m = 0; m < d.n; m++) {
          if (!d.active[m]) continue; const b = m * 3, dy = d.p[b + 1] - py; if (dy > 0.08 || dy < -0.08) continue; const dz = d.p[b + 2] - pz; if (dz > 0.08 || dz < -0.08) continue;
          if (c === d && Math.abs((m % c.nx) - ki) + Math.abs(((m / c.nx) | 0) - kj) < 3) continue;
          const dx = d.p[b] - px, r2 = dy * dy + dz * dz;
          if (dx < -0.015 && r2 < 0.0064) up = true;
          if (Math.abs(dx) < 0.09 && r2 < 0.0042) { const sd = dx * nxv; if (sd > 0.003) cf = 1; else if (sd < -0.003) cb = 1; }
        }
        c.shade[k] += ((up ? 0.13 : 1) - c.shade[k]) * 0.5; c.covF[k] = cf; c.covB[k] = cb;
      }
    }
    for (const c of G.list) if (!c.rod && c.loc !== 'flat') { if (c.shade[0] !== 1 || c.covF[0]) { c.shade.fill(1); c.covF.fill(0); c.covB.fill(0); } }

    // drying, rain wetting, drips
    let allDry = rodCloths.length > 0;
    for (const c of G.list) {
      if (c.frame || c.loc === 'flat' || c.loc === 'person') continue;
      const bal = c.site === 'bal', exposed = bal && (c.rod || c.loc === 'held'), wetK = R.k;
      if (exposed) {
        const vent = (0.35 + 0.65 * clamp(this.windBase / 2.4, 0, 1.3));
        for (let k = 0; k < c.n; k++) {
          if (!c.active[k]) continue; const z = c.p[k * 3 + 2];
          if (wetK > 0.15 && z < L.eaveZ - 0.01) { const add = 0.5 * wetK * dt; c.wetF[k] = Math.min(1, c.wetF[k] + add * (c.covF[k] ? 0.35 : 1)); c.wetB[k] = Math.min(1, c.wetB[k] + add * (c.covB[k] ? 0.35 : 1)); c.rained = (c.rained || 0) + add; continue; }
          const sh = 0.3 + 0.7 * c.shade[k], d = DRY * vent * sh * (0.75 + 0.25 * G.sunK) * dt;
          if (c.wetF[k] > 0) c.wetF[k] = Math.max(0, c.wetF[k] - d * (c.covF[k] ? 0.06 : 1));
          if (c.wetB[k] > 0) c.wetB[k] = Math.max(0, c.wetB[k] - d * (c.covB[k] ? 0.06 : 1));
        }
      }
      c.updateWetMean();
      if (c.rod && c.wetMean > 0.07) allDry = false;
      c.swing = c._sp || 0;
      // drips from the lowest wet hems
      if (c.wetMean > 0.5 && (c.rod || c.grab >= 0) && !c.stuck) {
        for (let n = 0; n < 3; n++) {
          const k = (Math.random() * c.n) | 0; if (!c.active[k]) continue; const w = (c.wetF[k] + c.wetB[k]) * 0.5; if (w < 0.55) continue;
          const i = k % c.nx, j = (k / c.nx) | 0, y = c.p[k * 3 + 1]; let low = true;
          for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (c.on(i + di, j + dj) && c.p[c.idx(i + di, j + dj) * 3 + 1] < y - 0.001) low = false;
          if (!low || Math.random() > (w - 0.45) * dt * 40) continue;
          G.drops.spawn(c.p[k * 3], y - 0.012, c.p[k * 3 + 2], 0, -0.1, 0, 2.5, 0.0045 + Math.random() * 0.002, 0, c.site === 'bal' ? -0.01 : 0.001);
          c.wetF[k] = Math.max(0.5, c.wetF[k] - 0.012); c.wetB[k] = Math.max(0.5, c.wetB[k] - 0.012); c.dripped = (c.dripped || 0) + 1;
        }
      }
    }
    if (allDry && !G.progress.dried) { G.progress.dried = true; G.markDirty(); }
    if (!rodCloths.length && G.progress.dried && G.list.some((c) => c.wetMean > 0.3)) G.progress.dried = false;
  }
  debug() { return { standZ: this.stand.z, rain: this.rainS.state, rainK: this.rainS.k, rainT: this.rainS.t, wind: this.windBase, pins: this.pins.map((p) => ({ state: p.state, cloth: p.cloth ? p.cloth.id : null, k: p.hold ? p.hold.k : -1 })) }; }
}
