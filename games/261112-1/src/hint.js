// After ~4 s without input, one short finger demonstration per step (never a permanent arrow or label).
import * as THREE from 'three';
import { L } from './world.js';
import { fingerCanvas } from './tex.js';
import { clamp, lerp, smooth } from './util.js';

export class Hint {
  constructor(G) {
    this.G = G; this.shown = {}; this.act = null; this.count = 0;
    const el = this.el = document.getElementById('hint'), c = fingerCanvas();
    el.width = c.width; el.height = c.height; el.getContext('2d').drawImage(c, 0, 0);
    this.a = new THREE.Vector3(); this.b = new THREE.Vector3();
  }
  cancel() { this.act = null; this.el.style.opacity = 0; }
  current() {
    const G = this.G, st = G.station, m = G.washer, P = G.progress, b = G.basket, a = this.a, t = this.b, W = G.W;
    const inB = G.list.filter((c) => c.loc === 'basket' && c.site === st), cen = (c, o) => c.center(o);
    const drag = (key) => ({ key, kind: 'drag' }), tap = (key) => ({ key, kind: 'tap' });
    if (st === 'wash') {
      const inD = G.list.filter((c) => c.loc === 'drum');
      if (!m.latched && m.door > 0.9) {
        if (inD.length && P.washed && inD.some((c) => c.wetMean > 0.1)) { cen(inD[0], a); t.set(b.x, b.y + 0.36, b.z); return drag('takeout'); }
        if (inB.length && !P.washed) {
          const s = G.cl.shirt; if (s.loc === 'basket' && s.snag >= 0) s.wpos(s.idx(1, 1), a); else cen(inB[0], a).y += 0.03;
          t.set(L.port.x, L.port.y, L.port.z); return drag(inD.length ? 'load' + inB.length : 'load');
        }
        if (inD.length && !P.washed) { W.handle.getWorldPosition(a); return tap('close'); }
        if (P.washed && !inD.length && inB.some((c) => c.wetMean > 0.15)) { a.set(b.x, b.y + 0.05, b.z + 0.21); t.set(0.95, 0.05, 0.2); return drag('carrybal'); }
        if (P.hung && inB.length && inB.every((c) => c.wetMean < 0.1)) { a.set(b.x, b.y + 0.05, b.z + 0.21); t.set(b.x - 0.75, 0.05, b.z + 0.21); return drag('carryfold'); }
      } else if (m.latched && !m.reqOpen) {
        if (m.zone === 'off') { if (inD.some((c) => c.wetMean < 0.05) || !inD.length) return { key: 'knob1', kind: 'arc', v0: m.knob, v1: 0.26 }; W.handle.getWorldPosition(a); return tap('open'); }
        if ((m.zone === 'wash' && m.water > 0.95 && inD.every((c) => c.dirtMean < 0.03)) || m.zone === 'rinse') return { key: 'knob2', kind: 'arc', v0: m.knob, v1: 0.82 };
        if (m.zone === 'spin' && Math.abs(m.omega) > 8 && inD.every((c) => c.wetMean < 0.5)) { W.handle.getWorldPosition(a); return tap('open'); }
      }
    } else if (st === 'bal') {
      const D = G.dry, rods = G.list.filter((c) => c.rod), z = D.stand.z;
      if (D.rainS.k > 0.4 && z < -1.75 && rods.length) { a.set(2.65, 1.16, z + L.rodHalf); t.set(2.65, 1.16, z + L.rodHalf + 0.7); return drag('stand'); }
      if (inB.length && !rods.length) { cen(inB[0], a).y += 0.04; t.set(L.rods[0].x, L.rods[0].y, z + 0.1); return drag('hang'); }
      if (rods.length && !D.pins.some((p) => p.state === 'on')) { const c = rods[0], r = L.rods[c.rod.id]; D.pinWorld(D.pins[0], a); t.set(r.x, r.y, D.rodZ0(c) - (c.nx > 10 ? 6 : 1) * c.cell); return drag('pin'); }
      if (inB.length) { cen(inB[0], a).y += 0.04; t.set(L.rods[1].x, L.rods[1].y, z - 0.25); return drag('hang2'); }
      if (rods.length && P.dried) { cen(rods[0], a); t.set(b.x, b.y + 0.36, b.z); return drag('takein'); }
      if (!rods.length && inB.length && P.hung) { a.set(b.x + 0.3, b.y + 0.05, b.z); t.set(1.7, 0.05, -1.0); return drag('carryroom'); }
    } else {
      const F = G.fold, flats = G.list.filter((c) => c.loc === 'flat'), tw = G.cl.towel;
      if (inB.length) { cen(inB[0], a).y += 0.04; t.set(-1.95, L.counter.top + 0.05, -0.05); return drag('tocounter'); }
      const un = flats.find((c) => c.flat.folds.length === 0 && c.flat.where === 'top' && c.flat.anim >= 1);
      if (un) { const w = un.flat.wbb; a.set(w.x1 - 0.03, un.flat.y + 0.02, (w.z0 + w.z1) / 2); t.set((w.x0 + w.x1) / 2 - 0.05, un.flat.y + 0.02, (w.z0 + w.z1) / 2); return drag('fold'); }
      if (tw.loc === 'flat' && F.P.state === 'wait') { const w = tw.flat.wbb; a.set((w.x0 + w.x1) / 2, tw.flat.y + 0.03, (w.z0 + w.z1) / 2 + F.zoff(tw) * 0); F.handMid(t); return drag('give'); }
      const other = flats.find((c) => c !== tw && c.flat.where === 'top');
      if (other && F.drawer.open < 0.5) { W.drawerHandle.getWorldPosition(a); t.copy(a); t.z += 0.32; return drag('drawer'); }
      if (other) { const w = other.flat.wbb; a.set((w.x0 + w.x1) / 2, other.flat.y + 0.03, (w.z0 + w.z1) / 2); t.set((L.drawer.x0 + L.drawer.x1) / 2, L.drawer.y0 + 0.04, 0.45); return drag('store'); }
      if (!b.shelf && !inB.length && P.card) { a.set(b.x, b.y + 0.05, b.z + 0.21); t.set(L.stShelf.x, 0.16, 0.15); return drag('shelf'); }
    }
    return null;
  }
  update(dt) {
    const G = this.G, el = this.el;
    if (!this.act) {
      if (G.idle < 4 || G.drag || G.cam.transit || G.basket.tween) return;
      const h = this.current(); if (!h || this.shown[h.key]) return;
      this.shown[h.key] = true; this.count++; this.act = h; h.t = 0; h.a = this.a.clone(); h.b = this.b.clone(); this.lastKey = h.key;
    }
    const h = this.act; h.t += dt; const T = h.kind === 'tap' ? 1.9 : 2.5;
    if (h.t > T) { this.cancel(); G.idle = 0; return; }
    let x, y, press = 0;
    if (h.kind === 'arc') {
      const c = G.project(L.knob.x, L.knob.y, L.knob.z + 0.03, {}), e = G.project(L.knob.x + L.knob.r, L.knob.y, L.knob.z + 0.03, {}), r = Math.abs(e.x - c.x) * 0.85;
      const u = smooth(0.5, 1.9, h.t), ang = 2.44 - lerp(h.v0, h.v1, u) * 4.88;   // same mapping as the knob
      x = c.x - Math.sin(ang) * r; y = c.y - Math.cos(ang) * r; press = smooth(0.25, 0.45, h.t);
    } else {
      const A = G.project(h.a.x, h.a.y, h.a.z, {});
      if (h.kind === 'tap') { x = A.x; y = A.y; press = Math.max(0, Math.sin((h.t - 0.4) * 9)) * (h.t > 0.4 && h.t < 1.45 ? 1 : 0); }
      else { const B = G.project(h.b.x, h.b.y, h.b.z, {}), u = smooth(0.55, 1.85, h.t); x = lerp(A.x, B.x, u); y = lerp(A.y, B.y, u) - Math.sin(u * Math.PI) * 14; press = smooth(0.25, 0.45, h.t) * (1 - smooth(1.95, 2.15, h.t)); }
    }
    const s = clamp(Math.min(G.vw, G.vh) / 640, 0.6, 1.05) * (1.08 - 0.1 * press);
    el.style.opacity = clamp(Math.min(h.t / 0.25, (T - h.t) / 0.3), 0, 1) * 0.92;
    el.style.transform = `translate(${x - 48 * s}px,${y - 12 * s}px) scale(${s}) rotate(-16deg)`;
  }
}
