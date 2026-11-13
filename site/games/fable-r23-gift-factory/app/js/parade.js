/* The present parade: robots, plush animals, wooden dolls and floats march out of the warehouse
   shutter, once around the middle of the factory, and leave through the corner gate by the entrance. */
(function () {
'use strict';
const T = THREE, C = GF.C, U = GF.U, V = GF.V;
const path = [], plen = [];
(function () {
  path.push(V(-17.5, 0, 0)); path.push(V(-4, 0, 0));
  for (let a = Math.PI + .12; a <= Math.PI * 3.25 + .001; a += .12) path.push(V(4 * Math.cos(a), 0, 4 * Math.sin(a)));
  path.push(V(-12.6, 0, -12.6)); path.push(V(-15.5, 0, -15.5));
  let d = 0; plen.push(0);
  for (let i = 1; i < path.length; i++) { d += path[i].distanceTo(path[i - 1]); plen.push(d); }
})();
const total = plen[plen.length - 1];
function at(d, out) {
  d = U.clamp(d, 0, total - .001); let i = 1; while (plen[i] < d) i++;
  const k = (d - plen[i - 1]) / (plen[i] - plen[i - 1]);
  out.lerpVectors(path[i - 1], path[i], k);
  return Math.atan2(path[i].x - path[i - 1].x, path[i].z - path[i - 1].z);
}
const P = GF.parade = {
  active: false, out: false, hits: [], layer: null, lead: 0,
  start(descs) {
    if (this.active) return;
    const Z = this.Z = new GF.Zone(0); Z.S = {};
    this.layer = Z.layer; this.hits = Z.hits; this.members = []; this.lead = 0; this.out = false; this.followed = false; this.conf = 0;
    Z.layer.onTap = b => GF.reveal(Z, b);
    const add = (obj, off, o) => { const m = Object.assign({ obj: obj, off: off, yaw: Math.PI / 2 }, o || {}); obj.visible = false; this.members.push(m); return m; };
    const walker = (rig, off) => { add(rig.g, off, { rig: rig }); GF.rigHit(Z, rig, 1); return rig; };
    const lead = walker(GF.rig.robot(Z, { c: C.red, c2: C.cream, pitch: 1 }), 0);
    Z.part(q => q.cyl(.04, .04, 1.1, C.white, 0, -1.1, 0, 0, 0, 0, 6).sph(.14, C.gold, 0, -1.7, 0), lead.armR);
    lead.baton = true;
    walker(GF.rig.plush(Z, { kind: 'bunny', c: 0xfff0f5, c2: C.pink, pitch: 1.5 }), 2.3);
    const float = (off, col, ds, big) => {
      const g = new T.Group(); Z.group.add(g); const w = big ? 2.9 : 2.2;
      Z.part(q => {
        q.box(w, .3, w * .68, col, 0, .58, 0).box(w + .1, .16, w * .68 + .1, C.white, 0, .4, 0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) q.cyl(.3, .3, .16, C.night, sx * (w / 2 - .1), .3, sz * w * .25, 0, 0, Math.PI / 2, 10).cyl(.12, .12, .2, C.yellow, sx * (w / 2 - .1), .3, sz * w * .25, 0, 0, Math.PI / 2, 6);
        q.cyl(.04, .04, 2.4, C.steel, -w / 2 + .15, 1.9, -w * .3, 0, 0, 0, 5).sph(.34, U.pick(GF.boxColors), -w / 2 + .15, 3.3, -w * .3, 1, 1.15, 1).cyl(.04, .04, 2.0, C.steel, w / 2 - .15, 1.7, -w * .3, 0, 0, 0, 5).sph(.3, U.pick(GF.boxColors), w / 2 - .15, 2.9, -w * .3, 1, 1.15, 1);
      }, g);
      const m = add(g, off, { boxes: [] });
      const lay = big ? [[0, .73, 0]] : [[-.5, .73, 0], [.5, .73, 0], [0, .73 + Math.max(ds[0].size, ds[1] ? ds[1].size : 0), 0]];
      ds.forEach((d, k) => { const b = Z.box(d); b.vis = false; m.boxes.push({ b: b, o: lay[k] }); });
      return m;
    };
    const cols = [C.pink, C.blue, C.green];
    for (let k = 0; k < 3; k++) {
      const ds = descs.slice(k * 3, k * 3 + 3).map(d => Object.assign({}, d, { wrapped: true, bow: true }));
      while (ds.length < 3) ds.push(GF.newDesc(true));
      float(4.9 + k * 5.1, cols[k], ds);
      if (k === 0) walker(GF.rig.doll(Z, { c: C.blue, c2: C.yellow, pitch: .95 }), 7.6);
      if (k === 1) walker(GF.rig.plush(Z, { kind: 'bear', c: 0xd9a066, c2: C.cream, pitch: 1.3 }), 12.7);
    }
    let tail = 17.9;
    if (GF.state.giants > 0) {
      GF.state.giants = 0; const d = GF.newDesc(true); d.size = 2.0; d.giant = true; d.pitch = .55;
      float(tail + 1.2, C.yellow, [d], true); tail += 4.4;
    }
    walker(GF.rig.robot(Z, { c: C.green, c2: C.cream, s: .75, pitch: 1.4 }), tail);
    this.tail = tail; Z.finish();
    this.active = true; GF.audio.music(true);
  },
  update(dt) {
    if (!this.active) return;
    const Z = this.Z, p = new T.Vector3();
    this.lead += dt * 2.1;
    for (const m of this.members) {
      const d = this.lead - m.off, vis = d > 0 && d < total;
      m.obj.visible = vis;
      if (m.boxes) for (const e of m.boxes) e.b.vis = vis;
      if (!vis) continue;
      const yaw = at(d, p); let dy = yaw - m.yaw; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
      m.yaw += dy * Math.min(1, dt * 5);
      m.obj.position.copy(p); m.obj.rotation.y = m.yaw;
      const ph = GF.time * 7 + m.off;
      if (m.rig) {
        const r = m.rig; r.jy = Math.abs(Math.sin(ph)) * .16;
        r.armL.rotation.x = Math.sin(ph) * .7;
        if (r.baton) { r.armR.rotation.z = 2.6; r.armR.rotation.x = Math.sin(ph * 2) * .25; } else r.armR.rotation.x = -Math.sin(ph) * .7;
      } else {
        m.obj.rotation.z = Math.sin(ph * .5) * .03;
        const s = Math.sin(m.yaw), c = Math.cos(m.yaw);
        for (const e of m.boxes) { e.b.pos.set(p.x + e.o[0] * c + e.o[2] * s, e.o[1] + Math.abs(Math.sin(ph * .5 + e.o[0])) * .08, p.z - e.o[0] * s + e.o[2] * c); e.b.rot.y = m.yaw; }
      }
    }
    Z.update(dt);
    this.conf -= dt;
    if (this.conf < 0) { this.conf = .35; at(Math.max(0, this.lead - this.tail * .5), p); p.y = 8; GF.fx.emit('rain', p, 5); }
    if (this.lead - this.tail > 3.2) this.out = true;
    if (!this.followed && this.lead > 19) { this.followed = true; if (GF.facing === 3 && GF.time - GF.lastTouch > 2.5 && !GF.cam.drag) { GF.cam.idx += 1; GF.onFacing(); } }
    if (this.lead - this.tail > total + .5) {
      this.active = false; GF.audio.music(false); Z.dispose(); this.Z = null; this.layer = null; this.hits = []; GF.state.parades++;
    }
  }
};
})();
