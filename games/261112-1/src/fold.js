// Counter: lay flat, fold by stroking an edge inward (crease follows the finger), drawer packing,
// handing the towel to a family member, hanamaru card.
import * as THREE from 'three';
import { L } from './world.js';
import * as TX from './tex.js';
import { clamp, lerp, smooth } from './util.js';

const C = L.counter, D = L.drawer;
const TOP = { x0: C.x0 + 0.03, x1: C.x1 - 0.03, z0: C.z0 + 0.04, z1: C.z1 - 0.005, y: C.top };
const DRW = { x0: D.x0 + 0.045, x1: D.x1 - 0.045, z0: D.zFront - 0.02 - D.depth + 0.012, z1: D.zFront - 0.028, y: D.y0 };

export class Fold {
  constructor(G) {
    this.G = G; this.drawer = { open: 0, target: 0 }; this.drawerWig = 0; this.order = [];
    this.handM = new THREE.Matrix4(); this.P = { state: 'away', t: 0, k: 0, hands: 0, cheek: 0, give: 0 };
    this._v = new THREE.Vector3(); this._v2 = new THREE.Vector3(); this._m2 = new THREE.Matrix4(); this.cardT = -1;
    this._buildPerson();
  }
  get drawerOff() { return this.drawer.open * D.travel; }
  zoff(c) { return c.flat.where === 'drawer' ? this.drawerOff : 0; }

  // ---------- flat placement ----------
  bounds(where) { return where === 'drawer' ? DRW : TOP; }
  fits(c, where) { const bb = c.flatBBox(), b = this.bounds(where); return bb.x1 - bb.x0 <= b.x1 - b.x0 + 0.01 && bb.z1 - bb.z0 <= b.z1 - b.z0 + 0.01; }
  centerAt(c, X, Z) { const bb = c.flatBBox(), fl = c.flat; fl.ox = X - (bb.x0 + bb.x1) / 2; fl.oz = Z - (bb.z0 + bb.z1) / 2; }
  clampIn(c) {
    const fl = c.flat, b = this.bounds(fl.where), bb = c.flatBBox(), w = bb.x1 - bb.x0, d = bb.z1 - bb.z0;
    if (w > b.x1 - b.x0) fl.ox = (b.x0 + b.x1) / 2 - (bb.x0 + bb.x1) / 2; else fl.ox = clamp(fl.ox, b.x0 - bb.x0, b.x1 - bb.x1);
    if (d > b.z1 - b.z0) fl.oz = (b.z0 + b.z1) / 2 - (bb.z0 + bb.z1) / 2; else fl.oz = clamp(fl.oz, b.z0 - bb.z0, b.z1 - bb.z1);
  }
  toTopOrder(c) { const i = this.order.indexOf(c); if (i >= 0) this.order.splice(i, 1); this.order.push(c); }
  restack() {
    this.order = this.order.filter((c) => c.loc === 'flat' && c.flat);
    for (let n = 0; n < this.order.length; n++) {
      const c = this.order[n], fl = c.flat, base = this.bounds(fl.where).y; c.layoutFlat(0, 0, this.zoff(c)); let y = base;
      for (let m = 0; m < n; m++) { const o = this.order[m], of = o.flat; if (of.where !== fl.where) continue; const a = fl.wbb, b = of.wbb; if (a.x0 < b.x1 - 0.01 && a.x1 > b.x0 + 0.01 && a.z0 < b.z1 - 0.01 && a.z1 > b.z0 + 0.01) y = Math.max(y, of.y + of.h); }
      fl.y = y; if (!fl.anim || fl.anim >= 1) c.layoutFlat(1, 0, this.zoff(c));
    }
  }
  placeFlat(c, where, X, Z, keep) {
    const G = this.G;
    if (!keep) c.flat = { folds: [], rot: c.kind === 'shirt' ? 0 : 1, where, ox: 0, oz: 0, y: this.bounds(where).y, anim: 0 };
    else { c.flat.where = where; c.flat.anim = 0.5; }
    c.loc = 'flat'; c.site = 'fold'; c.frame = null; c.rod = null; c.homing = 0; c.kin.fill(0); c.wrap = null;
    if (where === 'drawer' && !this.fits(c, 'drawer')) { c.flat.where = where = 'top'; const hm = TOP; X = clamp(X, hm.x0, hm.x1); Z = (hm.z0 + hm.z1) / 2; G.audio.play('wiggle'); }
    this.centerAt(c, X, Z - this.zoff(c)); this.clampIn(c); this.toTopOrder(c); this.restack();
    G.audio.play('fold'); G.markDirty();
  }
  dropTarget(c, sx, sy) {
    const G = this.G, b = G.basket, R = G.pickR();
    if (c.kind === 'towel' && this.P.state === 'wait' && this.P.k > 0.9) { const h = this.handMid(this._v); if (G.sdist(sx, sy, h.x, h.y, h.z) < R * 2.4) return { to: 'hands' }; }
    if (G.sdist(sx, sy, b.x, b.y + 0.2, b.z) < R * 2.2) return { to: 'basket' };
    const t = G.hitY(sx, sy, TOP.y + 0.03, this._v2);
    if (t.x > TOP.x0 - 0.05 && t.x < TOP.x1 + 0.05 && t.z > TOP.z0 - 0.3 && t.z < TOP.z1 + 0.02) return { to: 'top', x: t.x, z: t.z };
    if (this.drawer.open > 0.5) { const d = G.hitY(sx, sy, DRW.y + 0.05, this._v2), o = this.drawerOff; if (d.x > DRW.x0 - 0.06 && d.x < DRW.x1 + 0.06 && d.z > Math.max(C.z1, DRW.z0 + o) - 0.02 && d.z < DRW.z1 + o + 0.08) return { to: 'drawer', x: d.x, z: d.z }; }
    return { to: 'top', x: clamp(t.x, TOP.x0, TOP.x1), z: clamp(t.z, TOP.z0, TOP.z1) };
  }
  // physics cloth carried from the basket
  dragTarget(c, sx, sy) { this.G.hitZ(sx, sy, 0.52, c.gt); c.gt.y = Math.max(0.06, c.gt.y); }
  release(c, sx, sy) {
    const G = this.G, t = this.dropTarget(c, sx, sy);
    if (t.to === 'basket') { G.toBasket(c); return; }
    if (t.to === 'hands') { this.placeFlat(c, 'top', TOP.x0 + 0.3, 0); this.give(c); return; }
    this.placeFlat(c, t.to, t.x, t.z);
  }

  // ---------- fold / carry gesture on a flat piece ----------
  toFold(c, X, Z, out) { const fl = c.flat, xr = X - fl.ox, zr = Z - fl.oz - this.zoff(c); if (fl.rot) { out[0] = -zr; out[1] = xr; } else { out[0] = xr; out[1] = zr; } return out; }
  flatDrag(c, sx, sy, carryOnly) {
    const G = this.G, fl = c.flat, py = fl.y + fl.h, h0 = G.hitY(sx, sy, py).clone(), f0 = this.toFold(c, h0.x, h0.z, [0, 0]);
    const d = { kind: 'flat', c, sx, sy, mode: null, moved: 0 }, ox0 = fl.ox, oz0 = fl.oz;
    this.toTopOrder(c);
    d.move = (x, y) => {
      d.sx2 = x; d.sy2 = y; d.moved = Math.max(d.moved, Math.hypot(x - sx, y - sy));
      const h = G.hitY(x, y, py, this._v), f = this.toFold(c, h.x, h.z, [0, 0]);
      if (!d.mode) {
        if (d.moved < 12) return;
        const ax = Math.abs(f[0] - f0[0]) >= Math.abs(f[1] - f0[1]) ? 0 : 1, ds = Math.sign(f[ax] - f0[ax]) || 1;
        const [lo, hi] = c.foldExtent(ax), e0 = clamp(f0[ax], lo, hi), fromBorder = ds > 0 ? e0 - lo : hi - e0;
        d.mode = 'carry';
        if (!carryOnly && fromBorder < clamp(0.3 * (hi - lo), 0.05, 0.14) && hi - lo > 0.1) {
          const F = fl.folds, last = F[F.length - 1]; let edit = false;
          if (last && last.ax === ax && ds === last.side) { const [plo, phi] = c.foldExtent(ax, F.length - 1), free = last.side > 0 ? 2 * last.c - phi : 2 * last.c - plo; if (Math.abs(free - (ds > 0 ? lo : hi)) < 0.04) edit = true; }
          if (edit) { d.mode = 'edit'; d.fold = last; d.e0 = 2 * last.c - e0; d.g0 = e0; }
          else if (F.length < 4) { d.mode = 'new'; d.fold = { ax, c: e0, side: -ds }; d.e0 = e0; d.g0 = e0; d.added = false; }
          d.ax = ax; d.f0 = f0[ax];
          if (d.mode !== 'carry') G.audio.play('fold');
        }
        if (d.mode === 'carry') { G.audio.play('grab'); }
      }
      if (d.mode === 'carry') { fl.ox = ox0 + h.x - h0.x; fl.oz = oz0 + h.z - h0.z; c.layoutFlat(1, 0.06, this.zoff(c)); return; }
      const cur = d.g0 + (f[d.ax] - d.f0), F = fl.folds, cn = (d.e0 + cur) / 2, ok = (d.e0 - cn) * d.fold.side > 0.012;
      if (d.mode === 'new') { if (ok && !d.added) { F.push(d.fold); d.added = true; } else if (!ok && d.added) { F.pop(); d.added = false; } }
      else if (d.mode === 'edit') { if (!ok && !d.removed) { F.pop(); d.removed = true; } else if (ok && d.removed) { F.push(d.fold); d.removed = false; } }
      d.fold.c = cn; c.layoutFlat(1, 0, this.zoff(c));
    };
    d.up = (x, y, cancel) => {
      if (d.mode === 'carry' && !cancel) {
        const t = this.dropTarget(c, x, y);
        if (t.to === 'hands') { this.give(c); return; }
        if (t.to === 'basket') { c.layoutFlat(1, 0.06, this.zoff(c)); c.flat = null; this.order = this.order.filter((o) => o !== c); this.restack(); G.toBasket(c); G.audio.play('grab'); return; }
        this.placeFlat(c, t.to, t.x, t.z, true); return;
      }
      if (!d.mode && d.moved < 8) G.audio.play('soft', 0.5);
      if (c.flat.where === 'drawer' && !this.fits(c, 'drawer')) { c.flat.where = 'top'; this.centerAt(c, clamp(c.flat.wbb.x0 + 0.3, TOP.x0, TOP.x1), 0); G.audio.play('wiggle'); }
      this.clampIn(c); this.restack(); G.audio.play('fold', 0.6); G.markDirty();
    };
    return d;
  }
  drawerDrag(sx, sy) {
    const G = this.G, dr = this.drawer, z0 = G.hitY(sx, sy, 0.6).z, o0 = dr.open, d = { kind: 'drawer', sx, sy, moved: 0 };
    dr.target = null;
    d.move = (x, y) => { d.moved = Math.max(d.moved, Math.hypot(x - sx, y - sy)); const z = G.hitY(x, y, 0.6, this._v).z, no = clamp(o0 + (z - z0) / D.travel, 0, 1); if (Math.abs(no - dr.open) > 0.002) { dr.open = no; this.relayoutDrawer(); if (G.time - (dr.sl || 0) > 0.3) { dr.sl = G.time; G.audio.play('slide', 0.5); } } };
    d.up = () => { if (d.moved < 8) { dr.target = o0 > 0.5 ? 0 : 1; G.audio.play('slide'); } else dr.target = dr.open > 0.45 ? 1 : 0; G.markDirty(); };
    return d;
  }
  relayoutDrawer() { for (const c of this.order) if (c.flat && c.flat.where === 'drawer') c.layoutFlat(1, 0, this.drawerOff); }
  pick(sx, sy, cand, clothDrag) {
    const G = this.G;
    const np = G.nearParticle(sx, sy, (c) => c.site === 'fold' && c.loc === 'basket');
    if (np) cand(np.d, 0, () => clothDrag(np.c, np.k, sx, sy));
    const fp = G.nearParticle(sx, sy, (c) => c.loc === 'flat' && c.flat.anim >= 1 && (c.flat.where !== 'drawer' || this.drawer.open > 0.4), true);
    if (fp) cand(fp.dn, 12, () => this.flatDrag(fp.c, sx, sy));       // a touch right on a piece means the piece, even next to the handle
    const t = G.cl.towel;
    if (t.loc === 'person' && (this.P.state === 'hold')) { const h = this.handMid(this._v); cand(G.sdist(sx, sy, h.x, h.y, h.z) * 0.6, 0, () => { this.takeBack(t); return this.flatDrag(t, sx, sy, true); }); }
    G.W.drawerHandle.getWorldPosition(this._v); for (const dx of [0, -0.08, 0.08]) cand(G.sdist(sx, sy, this._v.x + dx, this._v.y, this._v.z + 0.02), 3, () => this.drawerDrag(sx, sy));
  }

  // ---------- the family member ----------
  _buildPerson() {
    const G = this.G, W = G.W, std = (o) => new THREE.MeshStandardMaterial(o);
    const root = this.root = new THREE.Group(); root.visible = false; G.scene.add(root); root.rotation.y = -0.62;
    const knit = TX.ribNormal(); knit.repeat.set(9, 5);
    const sweater = std({ color: 0x8aa2b0, roughness: 0.96, normalMap: knit, normalScale: new THREE.Vector2(0.75, 0.75) });
    const weave = TX.weaveNormal(); weave.repeat.set(6, 10);
    const pants = std({ color: 0xcbbda3, roughness: 0.92, normalMap: weave, normalScale: new THREE.Vector2(0.45, 0.45) });
    const skin = std({ color: 0xe9bb9c, roughness: 0.62 }), hair = std({ color: 0x3a2a22, roughness: 0.42 }), dark = std({ color: 0x4a342b, roughness: 0.6 });
    const add = (g, m, x, y, z, p = root) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; p.add(o); return o; };
    this.legs = [];
    for (const s of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(0, 0.88, s * 0.092); root.add(leg); this.legs.push(leg);
      add(new THREE.CylinderGeometry(0.086, 0.064, 0.8, 16), pants, 0, -0.42, 0, leg);
      const f = add(new THREE.CapsuleGeometry(0.046, 0.15, 4, 10), std({ color: 0xece5d6, roughness: 0.95 }), 0.055, -0.84, 0, leg); f.rotation.z = Math.PI / 2; f.scale.set(1, 1, 1.15);
    }
    const prof = [[0.0, 0.79], [0.14, 0.79], [0.163, 0.81], [0.17, 0.86], [0.172, 0.98], [0.176, 1.12], [0.19, 1.26], [0.18, 1.34], [0.12, 1.405], [0.066, 1.43], [0.0, 1.43]].map((p) => new THREE.Vector2(p[0], p[1]));
    const torso = add(new THREE.LatheGeometry(prof, 28), sweater, 0, 0, 0); torso.scale.set(0.68, 1, 1);
    for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.068, 16, 12), sweater, 0, 1.335, s * 0.172);
    add(new THREE.CylinderGeometry(0.047, 0.054, 0.09, 16), skin, 0.004, 1.445, 0);
    const col = add(new THREE.TorusGeometry(0.058, 0.017, 8, 22), sweater, 0.003, 1.425, 0); col.rotation.x = Math.PI / 2;
    const head = this.head = new THREE.Group(); head.position.set(0.012, 1.468, 0); root.add(head);
    const sk = add(new THREE.SphereGeometry(0.1, 28, 20), skin, 0, 0.1, 0, head); sk.scale.set(0.93, 1.12, 0.88);
    const nose = add(new THREE.SphereGeometry(0.013, 10, 8), skin, 0.093, 0.085, 0, head); nose.scale.set(1, 1.3, 0.9);
    for (const s of [-1, 1]) {
      const ear = add(new THREE.SphereGeometry(0.02, 10, 8), skin, -0.005, 0.095, s * 0.087, head); ear.scale.set(0.7, 1.2, 0.5);
      const eye = add(new THREE.TorusGeometry(0.0125, 0.0022, 6, 12, Math.PI), dark, 0.0855, 0.112, s * 0.034, head); eye.rotation.y = Math.PI / 2 - s * 0.38; eye.castShadow = false;
      const brow = add(new THREE.CapsuleGeometry(0.0026, 0.02, 3, 6), dark, 0.0845, 0.142, s * 0.035, head); brow.rotation.set(Math.PI / 2 - s * 0.12, -s * 0.38, 0); brow.castShadow = false;
      const sd = add(new THREE.SphereGeometry(0.07, 18, 12), hair, -0.02, 0.07, s * 0.068, head); sd.scale.set(0.95, 1.3, 0.42);
    }
    const mouth = add(new THREE.TorusGeometry(0.016, 0.0022, 6, 12, Math.PI * 0.7), std({ color: 0xb86a62, roughness: 0.6 }), 0.088, 0.055, 0, head); mouth.rotation.set(0, Math.PI / 2, Math.PI * 1.15); mouth.castShadow = false;
    const hr = add(new THREE.SphereGeometry(0.108, 28, 20), hair, -0.02, 0.122, 0, head); hr.scale.set(0.98, 1.04, 0.93);
    const bk = add(new THREE.SphereGeometry(0.095, 18, 12), hair, -0.058, 0.04, 0, head); bk.scale.set(0.6, 1.25, 0.92);
    const fr = add(new THREE.SphereGeometry(0.08, 18, 10), hair, 0.05, 0.178, 0, head); fr.scale.set(0.75, 0.36, 1.0);
    // arms (two-bone IK each frame)
    this.arms = [];
    for (const s of [-1, 1]) {
      const up = add(new THREE.CylinderGeometry(0.047, 0.056, 1, 14), sweater, 0, 0, 0), lo = add(new THREE.CylinderGeometry(0.04, 0.046, 1, 14), sweater, 0, 0, 0);
      const elb = add(new THREE.SphereGeometry(0.047, 14, 10), sweater, 0, 0, 0), cuff = add(new THREE.SphereGeometry(0.041, 12, 8), sweater, 0, 0, 0);
      const hand = new THREE.Group(); root.add(hand);
      const palm = add(new THREE.SphereGeometry(0.04, 14, 10), skin, 0.03, 0, 0, hand); palm.scale.set(1.15, 0.42, 0.95);
      for (let q = 0; q < 4; q++) { const fg = add(new THREE.CapsuleGeometry(0.0085, 0.045, 3, 8), skin, 0.092, -0.006, (q - 1.5) * 0.019, hand); fg.rotation.z = Math.PI / 2 - 0.25; }
      const th = add(new THREE.CapsuleGeometry(0.0105, 0.035, 3, 8), skin, 0.045, 0.004, -s * 0.045, hand); th.rotation.set(0, s * 0.7, Math.PI / 2);
      this.arms.push({ s, up, lo, elb, cuff, hand, sh: new THREE.Vector3(0, 1.33, s * 0.2), tgt: new THREE.Vector3(), el: new THREE.Vector3() });
    }
    this.blob = W.shadowBlob(0, 0, 0.75, 0.62, 0.7, 0.004, root);
    root.position.set(L.person.x, 0, L.person.z + 2.4); root.updateMatrixWorld(true);
  }
  handMid(out) { const a = this.arms[0].tgt, b = this.arms[1].tgt; out.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); this.root.updateMatrixWorld(); return out.applyMatrix4(this.root.matrixWorld); }
  finaleView() { const s = this.P.state; return s === 'receive' || s === 'nuzzle' || s === 'card'; }
  give(c) {
    const G = this.G, fl = c.flat;
    // a big sheet is folded over once or twice by the receiving hands
    for (let n = 0; n < 3; n++) { const bb = c.flatBBox(); const w = bb.x1 - bb.x0, d = bb.z1 - bb.z0; if (Math.max(w, d) <= 0.5 || fl.folds.length >= 4) break; const ax = (w >= d) === !fl.rot ? 0 : 1, e = c.foldExtent(ax); fl.folds.push({ ax, c: (e[0] + e[1]) / 2, side: 1 }); }
    this.order = this.order.filter((o) => o !== c); this.restack();
    fl.where = 'hands'; fl.y = 0; fl.anim = 1; this.centerAt(c, 0, 0); c.loc = 'person'; c.frame = this.handM; c.layoutFlat(1, 0, 0);
    this.P.state = 'receive'; this.P.t = 0; G.audio.play('soft'); G.markDirty();
  }
  takeBack(c) {
    const G = this.G, h = this.handMid(this._v);
    c.frame = null; c.loc = 'flat'; c.flat.where = 'top'; c.flat.y = TOP.y; this.centerAt(c, clamp(h.x, TOP.x0, TOP.x1), 0); this.clampIn(c); this.toTopOrder(c); this.restack();
    this.P.state = 'wait'; this.P.t = 0; G.markDirty();
  }

  update(dt) {
    const G = this.G, W = G.W, dr = this.drawer, P = this.P, t = G.cl.towel;
    if (dr.target !== null && dr.target !== undefined && dr.open !== dr.target) { dr.open = clamp(dr.open + Math.sign(dr.target - dr.open) * dt * 2.4, 0, 1); if (Math.abs(dr.open - dr.target) < 0.01) { dr.open = dr.target; G.audio.play('thud', 0.4); } this.relayoutDrawer(); }
    this.drawerWig *= Math.exp(-dt * 7);
    W.drawer.position.z = this.drawerOff + Math.sin(G.time * 36) * this.drawerWig * 0.008;
    for (const c of this.order) { const fl = c.flat; if (fl && fl.anim < 1) { fl.anim = Math.min(1, fl.anim + dt / 0.28); c.layoutFlat(fl.anim >= 1 ? 1 : 0.3, 0, this.zoff(c)); } }

    // person
    const want = G.station === 'fold' && (t.loc === 'flat' || t.loc === 'person');
    P.t += dt;
    if (P.state === 'away') { if (want) { P.state = 'arrive'; P.t = 0; this.root.visible = true; } }
    else if (P.state === 'arrive') { P.k = Math.min(1, P.k + dt / 1.3); if (P.k >= 1) { P.state = 'wait'; P.t = 0; } }
    else if (P.state === 'wait') { if (!want) { P.away = (P.away || 0) + dt; if (P.away > 3 || G.station !== 'fold') { P.state = 'leave'; P.t = 0; } } else P.away = 0; }
    else if (P.state === 'leave') { P.k = Math.max(0, P.k - dt / 1.2); if (P.k <= 0) { P.state = 'away'; this.root.visible = false; } if (want) { P.state = 'arrive'; } }
    else if (P.state === 'receive') { if (P.t > 0.55) { P.state = 'nuzzle'; P.t = 0; G.audio.play('nuzzle'); } }
    else if (P.state === 'nuzzle') { if (P.t > 3.0) { P.state = 'card'; P.t = 0; this.cardT = 0; G.audio.play('chime'); } }
    else if (P.state === 'card') { if (P.t > 3.2) { P.state = 'hold'; P.t = 0; G.onProgress('card'); } }
    else if (P.state === 'hold') { if (t.loc !== 'person') { P.state = 'wait'; P.t = 0; } }
    const e = P.k * P.k * (3 - 2 * P.k), root = this.root;
    const walking = P.k > 0 && P.k < 1, ph = P.k * Math.PI * 4;
    root.position.set(L.person.x, walking ? Math.abs(Math.sin(ph)) * 0.014 : 0, L.person.z + (1 - e) * 2.4);
    this.legs[0].rotation.z = walking ? Math.sin(ph) * 0.3 : 0; this.legs[1].rotation.z = walking ? -Math.sin(ph) * 0.3 : 0;
    // hand pose blend: 0 rest, offer, cheek, chest
    const offerT = (P.state === 'wait' || P.state === 'receive') ? 1 : 0, cheekT = P.state === 'nuzzle' ? smooth(0, 0.9, P.t) * (1 - smooth(2.3, 3.0, P.t)) : 0;
    const chestT = (P.state === 'card' || P.state === 'hold' || (P.state === 'nuzzle' && P.t > 2.3)) ? 1 : 0;
    P.hands = lerp(P.hands, Math.max(offerT, chestT, cheekT > 0 ? 1 : 0), 1 - Math.exp(-dt * 5)); P.cheek = cheekT; P.chest = lerp(P.chest || 0, chestT, 1 - Math.exp(-dt * 4));
    const rub = P.state === 'nuzzle' ? Math.sin(P.t * 5.5) * 0.012 * cheekT : 0, br = Math.sin(G.time * 1.6) * 0.004;
    const mid = this._v.set(lerp(0.05, lerp(0.36, 0.25, P.chest), P.hands), lerp(0.82, lerp(1.0, 1.1, P.chest), P.hands) + br, 0.0);
    mid.x = lerp(mid.x, 0.165, cheekT); mid.y = lerp(mid.y, 1.525 + rub, cheekT); mid.z = lerp(mid.z, 0.085, cheekT);
    const spread = lerp(0.22, lerp(0.12, 0.075, cheekT), P.hands);
    this.head.rotation.set(lerp(0, 0.34, cheekT) + rub * 2, lerp(0, -0.25, cheekT), lerp(0, -0.12, cheekT));
    let cardHand = 0;
    if (P.state === 'card') cardHand = smooth(0.1, 0.7, P.t) * (1 - smooth(2.2, 3.0, P.t));
    for (const a of this.arms) {
      a.tgt.set(mid.x, mid.y, mid.z + a.s * spread);
      if (a.s > 0 && cardHand > 0) { a.tgt.x = lerp(a.tgt.x, 0.4, cardHand); a.tgt.y = lerp(a.tgt.y, 1.18, cardHand); a.tgt.z = lerp(a.tgt.z, 0.3, cardHand); }
      this._ik(a);
    }
    // towel carried in the hands
    const tilt = lerp(0, 1.25, cheekT);
    root.updateMatrixWorld(true); const a0 = this.arms[0].tgt, a1 = this.arms[1].tgt;
    this._m2.makeRotationZ(tilt).setPosition((a0.x + a1.x) / 2 + lerp(0.03, 0.0, cheekT), (a0.y + a1.y) / 2 + lerp(0.014, -0.03, cheekT), (a0.z + a1.z) / 2 - cardHand * 0.07);
    this.handM.multiplyMatrices(root.matrixWorld, this._m2);
    // hanamaru card
    const card = W.card;
    if (P.state === 'card') {
      card.visible = true; const h = this.arms[1].tgt, fly = smooth(2.1, 3.1, P.t), up = smooth(0.1, 0.7, P.t);
      const hw = this._v2.set(h.x + 0.06, h.y + 0.075, h.z).applyMatrix4(root.matrixWorld), hx = hw.x, hy = hw.y, hz = hw.z;
      card.position.set(lerp(hx, CARD.x, fly), lerp(hy, CARD.y, fly) + Math.sin(fly * Math.PI) * 0.12, lerp(hz, CARD.z, fly));
      card.rotation.set(lerp(-0.2, CARD.rx, fly), lerp(0.35, 0, fly), 0); card.scale.setScalar(lerp(0.2, 1, up));
    } else if (G.progress.card) { card.visible = true; card.position.set(CARD.x, CARD.y, CARD.z); card.rotation.set(CARD.rx, 0, 0); card.scale.setScalar(1); }
    else card.visible = false;
  }
  _ik(a) {
    const A = a.sh, T = a.tgt, l1 = 0.27, l2 = 0.25, d = this._v2.copy(T).sub(A); let len = d.length(); const mx = l1 + l2 - 0.005; if (len > mx) { d.multiplyScalar(mx / len); len = mx; }
    const c = (l1 * l1 + len * len - l2 * l2) / (2 * l1 * len), along = l1 * c, h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
    const dir = d.clone().normalize(), pole = new THREE.Vector3(-0.3, -1, a.s * 0.75), perp = pole.sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    a.el.copy(A).addScaledVector(dir, along).addScaledVector(perp, h);
    const hp = A.clone().add(d);
    const seg = (m, p0, p1) => { const v = p1.clone().sub(p0), l = v.length(); m.position.copy(p0).addScaledVector(v, 0.5); m.quaternion.setFromUnitVectors(UP, v.normalize()); m.scale.set(1, l, 1); };
    seg(a.up, A, a.el); seg(a.lo, a.el, hp); a.elb.position.copy(a.el); a.cuff.position.copy(hp);
    // hand continues the forearm, palm up when offering
    const fd = hp.clone().sub(a.el).normalize();
    a.hand.position.copy(hp).addScaledVector(fd, 0.012); a.hand.quaternion.setFromUnitVectors(XA, fd);
  }
  debug() { const P = this.P; return { drawer: this.drawer.open, person: P.state, pk: P.k, order: this.order.map((c) => c.id), hands: (() => { const h = this.handMid(new THREE.Vector3()); return [h.x, h.y, h.z]; })() }; }
}
const UP = new THREE.Vector3(0, 1, 0), XA = new THREE.Vector3(1, 0, 0);
const CARD = { x: C.x0 + 0.2, y: C.top + 0.073, z: C.z0 + 0.045, rx: -0.2 };
