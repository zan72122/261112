/* Gift Factory core: renderer, camera ring, input, coroutines, geometry builder,
   boxes, belts, particles, hints, zone lifecycle. Everything hangs off window.GF. */
(function () {
'use strict';
const T = THREE, V3 = T.Vector3;
const GF = window.GF = {};
GF.mobile = navigator.maxTouchPoints > 1;          // iPad reports a Mac UA
GF.time = 0; GF.dt = 0.016; GF.lastTouch = -99;
GF.defs = [];                                       // zone builders, filled by zone scripts
GF.zones = [null, null, null, null];
GF.state = { z: [{}, {}, {}, {}], demoDone: false, giants: 0, parades: 0 };
GF.pipe = [[], [], [], []];                         // boxes travelling between zones
GF.pushPipe = function (k, d) { const p = GF.pipe[k]; if (p.length < 6) p.push(d); };

const C = GF.C = {
  red: 0xff6b6b, orange: 0xffa24d, yellow: 0xffd84a, green: 0x5fd39a, mint: 0x9be8c8,
  blue: 0x55bfee, navy: 0x3d5a80, purple: 0xb39cf0, pink: 0xff9ecb, cream: 0xfff3dc,
  wood: 0xe2b27c, steel: 0xb9c6d2, dark: 0x4a5568, white: 0xffffff, gold: 0xffc933,
  sky: 0xbfe9ff, night: 0x2b3350
};
GF.boxColors = [0xff7b7b, 0xffb057, 0xffe066, 0x74dba8, 0x66c7f4, 0xb9a3f5, 0xff9fd0];
GF.ribColors = [0xff4f6d, 0xffd23f, 0x35c9a5, 0x8f6bf0];

/* ---------- small utils ---------- */
const U = GF.U = {
  clamp: (v, a, b) => v < a ? a : v > b ? b : v,
  lerp: (a, b, t) => a + (b - a) * t,
  rand: (a, b) => a + Math.random() * (b - a),
  irand: n => Math.floor(Math.random() * n),
  pick: a => a[Math.floor(Math.random() * a.length)],
  mod: (a, n) => ((a % n) + n) % n,
  ease: {
    lin: t => t,
    in: t => t * t,
    out: t => 1 - (1 - t) * (1 - t),
    io: t => t < .5 ? 2 * t * t : 1 - (2 - 2 * t) * (2 - 2 * t) / 2,
    back: t => { const c = 1.70158, u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; },
    bounce: t => {
      const n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375;
      return n * (t -= 2.625 / d) * t + .984375;
    }
  }
};
GF.V = (x, y, z) => new V3(x, y, z);

/* ---------- coroutines (generators) ---------- */
function step(co, dt) {
  co.w -= dt;
  while (co.w <= 0) {
    let r;
    try { r = co.g.next(); } catch (e) { console.error(e); co.dead = true; return; }
    if (r.done) { co.dead = true; return; }
    if (typeof r.value === 'number' && r.value > 0) co.w += r.value; else { co.w = 0; return; }
  }
}
class Runner {
  constructor() { this.list = []; }
  run(g) { const co = { g: g, w: 0, dead: false }; this.list.push(co); return co; }
  update(dt) {
    const l = this.list;
    for (let i = 0; i < l.length; i++) if (!l[i].dead) step(l[i], dt);
    for (let i = l.length - 1; i >= 0; i--) if (l[i].dead) l.splice(i, 1);
  }
  clear() { this.list.length = 0; }
}
GF.Runner = Runner;
GF.runner = new Runner();
GF.tween = function* (dur, fn, ease) {
  ease = ease || U.ease.io; let t = 0;
  while (t < dur) { t += GF.dt; fn(ease(Math.min(1, t / dur))); yield; }
};
GF.to = function* (obj, props, dur, ease) {
  const s = {}; for (const k in props) s[k] = obj[k];
  yield* GF.tween(dur, t => { for (const k in props) obj[k] = s[k] + (props[k] - s[k]) * t; }, ease);
};
GF.all = function* () {
  const cs = Array.prototype.map.call(arguments, g => ({ g: g, w: 0, dead: false }));
  for (;;) {
    let any = false;
    for (const c of cs) if (!c.dead) { step(c, GF.dt); if (!c.dead) any = true; }
    if (!any) return;
    yield;
  }
};

/* ---------- geometry builder: merges coloured primitives into one buffer ---------- */
const _m = new T.Matrix4(), _q = new T.Quaternion(), _e = new T.Euler(), _v = new V3(), _s = new V3(),
  _n = new V3(), _nm = new T.Matrix3(), _c = new T.Color(), _v2 = new V3(), _up = new V3(0, 1, 0), _q2 = new T.Quaternion();
class Geo {
  constructor() { this.p = []; this.n = []; this.c = []; this.i = []; this.count = 0; this.base = null; }
  at(x, y, z, ry) {                                   // base transform for following adds
    if (x === undefined) { this.base = null; return this; }
    this.base = new T.Matrix4().compose(new V3(x, y, z), new T.Quaternion().setFromEuler(new T.Euler(0, ry || 0, 0)), new V3(1, 1, 1));
    return this;
  }
  add(g, col, x, y, z, rx, ry, rz, sx, sy, sz) {
    _m.compose(_v.set(x || 0, y || 0, z || 0), _q.setFromEuler(_e.set(rx || 0, ry || 0, rz || 0)),
      _s.set(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz));
    return this.addM(g, col, _m);
  }
  addM(g, col, m) {
    if (this.base) m.premultiply(this.base);
    _nm.getNormalMatrix(m); _c.set(col);
    const P = g.attributes.position, N = g.attributes.normal, base = this.count;
    for (let i = 0; i < P.count; i++) {
      _v.fromBufferAttribute(P, i).applyMatrix4(m); this.p.push(_v.x, _v.y, _v.z);
      _n.fromBufferAttribute(N, i).applyMatrix3(_nm);
      const l = _n.length(); if (l > 1e-8) _n.multiplyScalar(1 / l); else _n.set(0, 1, 0);
      this.n.push(_n.x, _n.y, _n.z); this.c.push(_c.r, _c.g, _c.b);
    }
    if (g.index) { const I = g.index; for (let i = 0; i < I.count; i++) this.i.push(base + I.getX(i)); }
    else for (let i = 0; i < P.count; i++) this.i.push(base + i);
    this.count += P.count; g.dispose(); return this;
  }
  box(w, h, d, col, x, y, z, rx, ry, rz) { return this.add(new T.BoxGeometry(w, h, d), col, x, y, z, rx, ry, rz); }
  cyl(rt, rb, h, col, x, y, z, rx, ry, rz, seg) { return this.add(new T.CylinderGeometry(rt, rb, h, seg || 12), col, x, y, z, rx, ry, rz); }
  cone(r, h, col, x, y, z, rx, ry, rz, seg) { return this.add(new T.ConeGeometry(r, h, seg || 10), col, x, y, z, rx, ry, rz); }
  sph(r, col, x, y, z, sx, sy, sz, ws, hs) { return this.add(new T.SphereGeometry(r, ws || 10, hs || 7), col, x, y, z, 0, 0, 0, sx, sy, sz); }
  tor(R, r, col, x, y, z, rx, ry, rz, rs, ts, arc) { return this.add(new T.TorusGeometry(R, r, rs || 6, ts || 16, arc || Math.PI * 2), col, x, y, z, rx, ry, rz); }
  disc(r, col, x, y, z, rx, ry, rz, seg) { return this.add(new T.CircleGeometry(r, seg || 18), col, x, y, z, rx, ry, rz); }
  between(p0, p1, w, h, col) {                       // box stretched from p0 to p1
    const len = p0.distanceTo(p1); if (len < 1e-4) return this;
    _m.lookAt(p0, p1, _up); _q.setFromRotationMatrix(_m);
    _m.compose(_v.copy(p0).add(p1).multiplyScalar(.5), _q, _s.set(1, 1, 1));
    return this.addM(new T.BoxGeometry(w, h, len), col, _m);
  }
  tube(p0, p1, r, col, seg) {                        // cylinder from p0 to p1
    const len = p0.distanceTo(p1); if (len < 1e-4) return this;
    _v2.copy(p1).sub(p0).multiplyScalar(1 / len); _q.setFromUnitVectors(_up, _v2);
    _m.compose(_v.copy(p0).add(p1).multiplyScalar(.5), _q, _s.set(1, 1, 1));
    return this.addM(new T.CylinderGeometry(r, r, len, seg || 8), col, _m);
  }
  gear(R, teeth, th, col, x, y, z) {                 // axis along z
    this.cyl(R, R, th, col, x, y, z, Math.PI / 2, 0, 0, 16);
    this.cyl(R * .3, R * .3, th * 1.4, C.dark, x, y, z, Math.PI / 2, 0, 0, 8);
    for (let i = 0; i < teeth; i++) {
      const a = i / teeth * Math.PI * 2;
      this.box(R * .34, R * .3, th, col, x + Math.cos(a) * R * 1.05, y + Math.sin(a) * R * 1.05, z, 0, 0, a + Math.PI / 2);
    }
    return this;
  }
  build() {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new T.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new T.Float32BufferAttribute(this.c, 3));
    g.setIndex(this.i);
    g.computeBoundingSphere();
    return g;
  }
  mesh(mat) { return new T.Mesh(this.build(), mat || GF.mat); }
}
GF.Geo = Geo;

/* ---------- shared materials / geometries (never disposed) ---------- */
function shared(g) { g.userData.shared = true; return g; }
GF.initShared = function () {
  GF.mat = new T.MeshLambertMaterial({ vertexColors: true });
  GF.shadowMat = new T.MeshBasicMaterial({ color: 0x1a2030, transparent: true, opacity: .2, depthWrite: false });
  GF.eyeDark = new T.MeshBasicMaterial({ color: 0x2a2f45 });
  GF.eyeGlow = new T.MeshBasicMaterial({ color: 0x8ff6ff });
  GF.fxMat = new T.MeshBasicMaterial({ color: 0xffffff });
  let g = new Geo();
  g.box(1, .8, 1, 0xffffff, 0, -.1, 0).box(1.07, .24, 1.07, 0xe2e2e2, 0, .38, 0);
  GF.geoBox = shared(g.build());
  g = new Geo();
  g.box(.2, 1.05, 1.1, 0xffffff, 0, 0, 0).box(1.1, 1.05, .2, 0xffffff, 0, 0, 0);
  GF.geoBand = shared(g.build());
  g = new Geo();
  g.sph(.22, 0xffffff, -.2, .13, 0, 1, .62, .7, 8, 6).sph(.22, 0xffffff, .2, .13, 0, 1, .62, .7, 8, 6)
    .sph(.1, 0xf0f0f0, 0, .1, 0, 1, 1, 1, 6, 5).box(.1, .03, .3, 0xffffff, -.12, .02, .16, 0, .5, 0).box(.1, .03, .3, 0xffffff, .12, .02, .16, 0, -.5, 0);
  GF.geoBow = shared(g.build());
  GF.geoShadow = shared(new T.CircleGeometry(.5, 14).rotateX(-Math.PI / 2));
  GF.geoEye = shared(new T.SphereGeometry(1, 8, 6));
};
GF.lamp = function (geo, hex) {                      // mesh with its own unlit material
  const m = new T.Mesh(geo, new T.MeshBasicMaterial({ color: hex }));
  m.material.userData.own = true; return m;
};

/* ---------- boxes ---------- */
GF.newDesc = function (wrapped) {
  return {
    color: U.pick(GF.boxColors), rib: U.pick(GF.ribColors), wrapped: !!wrapped, bow: !!wrapped,
    size: U.rand(.72, .92), rings: Math.random() < .5, bouncy: Math.random() < .5,
    pitch: U.rand(.8, 1.35), toy: U.irand(6)
  };
};
class Box {
  constructor(d) {
    this.d = d; this.s = d.size; this.pos = new V3(); this.rot = new T.Euler(); this.sc = new V3(1, 1, 1);
    this.hop = 0; this.gy = null; this.vis = true; this.held = false; this.owner = null; this.bd = 0;
    this.col = new T.Color(d.color); this.rib = new T.Color(d.rib);
    this.wrapK = d.wrapped ? 1 : 0; this.bowK = d.bow ? 1 : 0; this.tok = 0;
  }
}
class BoxLayer {
  constructor(parent, cap) {
    this.cap = cap; this.boxes = [];
    const mk = (geo, mat) => {
      const m = new T.InstancedMesh(geo, mat, cap);
      m.instanceMatrix.setUsage(T.DynamicDrawUsage); m.frustumCulled = false; m.count = 0; parent.add(m); return m;
    };
    this.body = mk(GF.geoBox, GF.mat); this.band = mk(GF.geoBand, GF.mat); this.bow = mk(GF.geoBow, GF.mat);
    this.shadow = mk(GF.geoShadow, GF.shadowMat);
    _c.set(0xffffff); this.body.setColorAt(0, _c); this.band.setColorAt(0, _c); this.bow.setColorAt(0, _c);
    this.onTap = null; this.canDrag = null;
  }
  add(d) { const b = new Box(d); if (this.boxes.length < this.cap) this.boxes.push(b); else b.vis = false; return b; }
  remove(b) { const i = this.boxes.indexOf(b); if (i >= 0) this.boxes.splice(i, 1); b.gone = true; }
  update() {
    let n = 0, nb = 0, nw = 0, ns = 0;
    for (const b of this.boxes) {
      if (!b.vis) continue;
      const s = b.s, hy = s * b.sc.y * .5;
      _q.setFromEuler(b.rot);
      _v.set(b.pos.x, b.pos.y + b.hop + hy, b.pos.z);
      _m.compose(_v, _q, _s.set(s * b.sc.x, s * b.sc.y, s * b.sc.z));
      this.body.setMatrixAt(n, _m); this.body.setColorAt(n, b.col); n++;
      if (b.wrapK > 0.01) {
        const k = b.wrapK;
        _m.compose(_v, _q, _s.set(s * b.sc.x * k, s * b.sc.y * k, s * b.sc.z * k));
        this.band.setMatrixAt(nb, _m); this.band.setColorAt(nb, b.rib); nb++;
      }
      if (b.bowK > 0.01) {
        _v2.set(0, hy, 0).applyQuaternion(_q);
        _v.set(b.pos.x + _v2.x, b.pos.y + b.hop + hy + _v2.y, b.pos.z + _v2.z);
        _m.compose(_v, _q, _s.setScalar(s * b.bowK));
        this.bow.setMatrixAt(nw, _m); this.bow.setColorAt(nw, b.rib); nw++;
      }
      if (b.gy !== null) {
        const h = Math.max(0, b.pos.y + b.hop - b.gy), k = s * 1.5 * Math.max(.45, 1 - h * .12);
        _m.compose(_v.set(b.pos.x, b.gy + .03, b.pos.z), _q.identity(), _s.set(k, 1, k));
        this.shadow.setMatrixAt(ns, _m); ns++;
      }
    }
    this.body.count = n; this.band.count = nb; this.bow.count = nw; this.shadow.count = ns;
    for (const m of [this.body, this.band, this.bow, this.shadow]) {
      m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
  }
}
GF.BoxLayer = BoxLayer;

/* arc flight of a box to a point (the point may move) */
GF.fly = function* (b, to, h, dur, spin) {
  const p0 = b.pos.clone(), r0 = b.rot.y; let t = 0;
  while (t < 1) {
    t = Math.min(1, t + GF.dt / dur);
    b.pos.lerpVectors(p0, to, t); b.pos.y += 4 * h * t * (1 - t);
    if (spin) b.rot.y = r0 + spin * t * Math.PI * 2;
    yield;
  }
  b.pos.copy(to); b.gy = to.y; if (spin) b.rot.y = r0;
};
/* touching a box shows what kind it is: jingle / hush, boing / flop */
GF.reveal = function (Z, b, quiet) {
  const tok = ++b.tok, A = GF.audio, wp = Z.world(b.pos); wp.y += b.s + b.hop;
  if (b.d.rings) { A.chirin(b.d.pitch); GF.fx.emit('spark', wp, b.d.gold ? 16 : 8); GF.fx.emit('note', wp, 2); }
  else { if (!quiet) A.shiin(); GF.fx.emit('puff', wp, 3); }
  Z.run(function* () {
    const E = U.ease;
    if (b.d.bouncy) {
      A.boyon(b.d.giant ? .6 : 1);
      const hs = [1.5, .8, .35];
      for (let k = 0; k < hs.length; k++) {
        const h = hs[k], dur = .22 + h * .2;
        yield* GF.tween(.07, t => { if (b.tok === tok) b.sc.set(1 + .25 * t, 1 - .3 * t, 1 + .25 * t); }, E.out);
        if (b.tok !== tok) return;
        let t = 0;
        while (t < 1) {
          t = Math.min(1, t + GF.dt / dur); if (b.tok !== tok) return;
          b.hop = 4 * h * t * (1 - t); const st = Math.sin(t * Math.PI) * .12;
          b.sc.set(1 - st, 1 + st * 1.6, 1 - st); yield;
        }
        b.hop = 0;
      }
      yield* GF.tween(.12, t => { if (b.tok === tok) b.sc.set(1 + .15 * (1 - t), 1 - .2 * (1 - t), 1 + .15 * (1 - t)); });
    } else {
      A.petan();
      yield* GF.tween(.1, t => { if (b.tok === tok) { b.hop = .18 * Math.sin(t * Math.PI); } }, E.lin);
      if (b.tok !== tok) return;
      yield* GF.tween(.1, t => { if (b.tok === tok) b.sc.set(1 + .35 * t, 1 - .45 * t, 1 + .35 * t); }, E.out);
      yield .35;
      yield* GF.tween(.5, t => { if (b.tok === tok) b.sc.set(1.35 - .35 * t, .55 + .45 * t, 1.35 - .35 * t); }, E.io);
    }
    if (b.tok === tok) { b.sc.set(1, 1, 1); b.hop = 0; }
  }());
};

/* ---------- belts ---------- */
class Belt {
  constructor(Z, pts, o) {
    o = o || {};
    this.Z = Z; this.pts = pts.map(p => new V3(p[0], p[1], p[2]));
    this.speed = o.speed || 1.3; this.w = o.w || 1.3; this.kind = o.kind || 'slat'; this.roll = o.roll || 0;
    this.gap = o.gap === undefined ? .22 : o.gap; this.boxes = []; this.onEnd = null; this.onStop = null; this.run = true;
    this.len = []; this.total = 0; this.quat = [];
    for (let i = 0; i < this.pts.length - 1; i++) {
      const l = this.pts[i].distanceTo(this.pts[i + 1]); this.len.push(l); this.total += l;
      _m.lookAt(this.pts[i], this.pts[i + 1], _up); this.quat.push(new T.Quaternion().setFromRotationMatrix(_m));
    }
    this.phase = 0;
    const g = Z.geo(), col = o.color || C.blue, w = this.w;
    for (let i = 0; i < this.pts.length - 1; i++) {
      const a = this.pts[i], b = this.pts[i + 1];
      const dir = b.clone().sub(a).normalize(), side = new V3().crossVectors(dir, _up).normalize().multiplyScalar(w / 2 + .05);
      const dn = new V3(0, -.13, 0);
      g.between(a.clone().add(dn), b.clone().add(dn), w, .14, this.kind === 'slide' ? col : C.dark);
      const upv = new V3(0, this.kind === 'slide' ? .12 : .02, 0);
      g.between(a.clone().add(side).add(upv), b.clone().add(side).add(upv), .1, this.kind === 'slide' ? .34 : .22, this.kind === 'slide' ? C.white : col);
      g.between(a.clone().sub(side).add(upv), b.clone().sub(side).add(upv), .1, this.kind === 'slide' ? .34 : .22, this.kind === 'slide' ? C.white : col);
      if (i > 0) g.sph(.09, this.kind === 'slide' ? C.white : col, a.x + side.x, a.y + upv.y, a.z + side.z).sph(.09, this.kind === 'slide' ? C.white : col, a.x - side.x, a.y + upv.y, a.z - side.z);
    }
    if (o.legs !== false) {
      for (let d = .4; d < this.total; d += 2.6) {
        const p = this.posAt(d, new V3());
        if (p.y > .5) g.cyl(.08, .1, p.y - .2, C.steel, p.x, (p.y - .2) / 2, p.z, 0, 0, 0, 6);
      }
    }
    if (this.kind !== 'slide') {
      const roller = this.kind === 'roller';
      this.sp = roller ? .5 : .46; this.n = Math.max(1, Math.floor(this.total / this.sp));
      const sg = new Geo();
      if (roller) { sg.cyl(.13, .13, w - .1, C.steel, 0, -.05, 0, 0, 0, Math.PI / 2, 8); sg.box(w - .3, .05, .09, col, 0, .07, 0); }
      else sg.box(w - .12, .05, .34, 0x6b7a90, 0, -.03, 0);
      this.mesh = new T.InstancedMesh(sg.build(), GF.mat, this.n);
      this.mesh.frustumCulled = false; this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage); Z.group.add(this.mesh);
      this.updateVis();
    }
    Z.belts.push(this);
  }
  seg(d) { let i = 0; while (i < this.len.length - 1 && d > this.len[i]) { d -= this.len[i]; i++; } this._d = d; return i; }
  posAt(d, out) { d = U.clamp(d, 0, this.total); const i = this.seg(d); return out.lerpVectors(this.pts[i], this.pts[i + 1], this.len[i] > 0 ? this._d / this.len[i] : 0); }
  updateVis() {
    if (!this.mesh) return;
    const roller = this.kind === 'roller', q2 = _q2;
    for (let k = 0; k < this.n; k++) {
      const d = roller ? (k + .5) * this.sp : U.mod(k * this.sp + this.phase, this.n * this.sp);
      const i = this.seg(Math.min(d, this.total - .001)); _v.lerpVectors(this.pts[i], this.pts[i + 1], this._d / this.len[i]);
      _q.copy(this.quat[i]);
      if (roller) { q2.setFromAxisAngle(_v2.set(1, 0, 0), this.phase * 5); _q.multiply(q2); }
      _m.compose(_v, _q, _s.set(1, 1, 1)); this.mesh.setMatrixAt(k, _m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
  free(sz) { const l = this.boxes[this.boxes.length - 1]; return !l || l.bd - l.s * .5 > (sz || .9) * .5 + this.gap + .1; }
  add(b, d) {
    b.owner = this; b.bd = d || 0; b.atMax = false;
    let i = 0; while (i < this.boxes.length && this.boxes[i].bd > b.bd) i++;
    this.boxes.splice(i, 0, b); this.posAt(b.bd, b.pos); b.gy = b.pos.y;
  }
  remove(b) { const i = this.boxes.indexOf(b); if (i >= 0) this.boxes.splice(i, 1); }
  update(dt) {
    if (!this.run) return;
    this.phase += this.speed * dt; this.updateVis();
    let limit = Infinity;
    for (let i = 0; i < this.boxes.length; i++) {
      const b = this.boxes[i];
      let nd = b.bd + this.speed * dt;
      const maxd = limit - b.s * .5 - this.gap;
      if (nd > maxd) nd = Math.max(b.bd, maxd);
      if (b.maxD !== undefined && nd >= b.maxD) {
        nd = b.maxD; if (!b.atMax) { b.atMax = true; if (this.onStop) this.onStop(b); }
      }
      if (nd >= this.total) {
        nd = this.total;
        if (this.onEnd && this.onEnd(b) !== false) { this.boxes.splice(i, 1); i--; continue; }
      }
      b.bd = nd; const ox = b.pos.x;
      this.posAt(nd, b.pos); b.gy = b.pos.y;
      if (this.roll) b.rot.z -= (b.pos.x - ox) * this.roll;
      limit = b.bd - b.s * .5;
    }
  }
}
GF.Belt = Belt;

/* ---------- particles ---------- */
GF.fx = {
  list: [], cap: 220,
  init(scene) {
    this.mesh = new T.InstancedMesh(shared(new T.OctahedronGeometry(.5, 0)), GF.fxMat, this.cap);
    this.mesh.frustumCulled = false; this.mesh.count = 0; this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    this.mesh.setColorAt(0, _c.set(0xffffff)); scene.add(this.mesh);
  },
  emit(type, p, n, col) {
    for (let i = 0; i < n; i++) {
      if (this.list.length >= this.cap) this.list.shift();
      const o = { p: p.clone(), v: new V3(), life: 0, max: 1, size: .15, grav: 0, col: new T.Color(), spin: U.rand(-6, 6), grow: 0, flat: 1 };
      if (type === 'spark') { o.v.set(U.rand(-1.6, 1.6), U.rand(1.5, 3.6), U.rand(-1.6, 1.6)); o.grav = -5; o.max = U.rand(.5, .9); o.size = U.rand(.1, .2); o.col.set(U.pick([0xfff27a, 0xffffff, 0xffc933])); }
      else if (type === 'puff') { o.v.set(U.rand(-.5, .5), U.rand(.4, .9), U.rand(-.5, .5)); o.max = U.rand(.7, 1.1); o.size = U.rand(.2, .32); o.grow = .5; o.col.set(col || 0xe6ecf5); o.spin = 0; }
      else if (type === 'confetti') { o.v.set(U.rand(-3, 3), U.rand(3, 7), U.rand(-3, 3)); o.grav = -6; o.max = U.rand(1.4, 2.4); o.size = U.rand(.14, .24); o.col.set(U.pick(GF.boxColors)); o.flat = .3; }
      else if (type === 'rain') { o.p.x += U.rand(-5, 5); o.p.z += U.rand(-5, 5); o.v.set(U.rand(-.5, .5), U.rand(-2.5, -1.2), U.rand(-.5, .5)); o.max = U.rand(2.5, 4); o.size = U.rand(.16, .26); o.col.set(U.pick(GF.boxColors)); o.flat = .3; }
      else if (type === 'note') { o.v.set(U.rand(-.6, .6), U.rand(1.6, 2.2), 0); o.max = 1.1; o.size = .22; o.col.set(U.pick([0xff9ecb, 0x55bfee, 0xffd84a])); }
      else if (type === 'star') { o.v.set(U.rand(-2.5, 2.5), U.rand(1, 3), U.rand(-1, 2)); o.grav = -4; o.max = .7; o.size = .26; o.col.set(0xfff27a); }
      else if (type === 'bubble') { o.v.set(U.rand(-.6, .6), U.rand(1, 2.2), U.rand(-.2, .6)); o.max = U.rand(.9, 1.5); o.size = U.rand(.14, .3); o.col.set(U.pick([0xffffff, 0xd6f3ff, 0xffe3f3])); o.spin = 0; }
      this.list.push(o);
    }
  },
  update(dt) {
    const l = this.list; let n = 0;
    for (let i = l.length - 1; i >= 0; i--) { l[i].life += dt; if (l[i].life >= l[i].max) l.splice(i, 1); }
    for (const o of l) {
      o.v.y += o.grav * dt; o.p.addScaledVector(o.v, dt);
      const k = o.life / o.max, s = o.size * (1 + o.grow * k * 3) * Math.min(1, (1 - k) * 4) * Math.min(1, k * 12 + .3);
      _q.setFromEuler(_e.set(o.life * o.spin, o.life * o.spin * .7, 0));
      _m.compose(o.p, _q, _s.set(s, s, s * o.flat)); this.mesh.setMatrixAt(n, _m); this.mesh.setColorAt(n, o.col); n++;
    }
    this.mesh.count = n; this.mesh.instanceMatrix.needsUpdate = true; if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
};

/* ---------- zones ---------- */
class Zone {
  constructor(k) {
    this.k = k; this.S = GF.state.z[k];
    this.group = new T.Group(); this.group.rotation.y = -k * Math.PI / 2; GF.scene.add(this.group); this.group.updateMatrixWorld(true);
    this.runner = new Runner(); this.hits = []; this.belts = []; this.ups = []; this.rigs = []; this.hints = [];
    this._geo = new Geo(); this.speed = 1; this.dragY = 2.6; this.save = null;
    this.layer = new BoxLayer(this.group, 80);
  }
  geo() { return this._geo; }
  finish() { if (this._geo.count) { this.group.add(this._geo.mesh()); } this._geo = null; this.group.updateMatrixWorld(true); }
  part(fn, parent, x, y, z) {
    const g = new Geo(); fn(g); const m = g.mesh(); (parent || this.group).add(m);
    if (x !== undefined) m.position.set(x, y, z); return m;
  }
  pivot(x, y, z, parent) { const p = new T.Group(); p.position.set(x, y, z); (parent || this.group).add(p); return p; }
  lamp(geo, hex, x, y, z, parent) { const m = GF.lamp(geo, hex); m.position.set(x, y, z); (parent || this.group).add(m); return m; }
  belt(pts, o) { return new Belt(this, pts, o); }
  box(d) { return this.layer.add(d); }
  run(g) { return this.runner.run(g); }
  onUpdate(fn) { this.ups.push(fn); }
  hit(target, r, tap, o) { const h = Object.assign({ target: target, r: r, tap: tap, dy: 0 }, o || {}); this.hits.push(h); return h; }
  world(v) { return v.clone().applyMatrix4(this.group.matrixWorld); }
  update(dt) {
    this.runner.update(dt);
    const bdt = dt * this.speed;
    for (const b of this.belts) b.update(bdt);
    for (const f of this.ups) f(dt);
    for (const r of this.rigs) r.update(dt);
    this.layer.update();
  }
  dispose() {
    if (this.save) this.save();
    this.runner.clear(); GF.scene.remove(this.group);
    this.group.traverse(o => {
      if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose();
      if (o.material && o.material.userData.own) o.material.dispose();
      if (o.isInstancedMesh) o.dispose();
    });
  }
}
GF.Zone = Zone;
GF.ensure = function (k) {
  if (GF.zones[k] || !GF.defs[k]) return;
  const Z = new Zone(k); GF.zones[k] = Z;
  try { GF.defs[k](Z); } catch (e) { console.error('zone build', k, e); }
  Z.finish();
};
GF.drop = function (k) { if (GF.zones[k]) { GF.zones[k].dispose(); GF.zones[k] = null; } };
GF.syncZones = function () {                         // keep facing zone and its two neighbours, free the one behind
  const f = GF.facing;
  for (let k = 0; k < 4; k++) {
    const d = U.mod(k - f, 4);
    if (d === 2) GF.drop(k); else if (GF.lazy || k === f) GF.ensure(k);
  }
};

/* ---------- camera ring ---------- */
const cam = GF.cam = { yaw: 0, idx: 0, drag: false };
GF.facing = 0;
GF.go = function (dir) { cam.idx += dir; GF.onFacing(); };
GF.onFacing = function () {
  const f = U.mod(cam.idx, 4);
  if (f !== GF.facing) { GF.facing = f; GF.syncZones(); GF.hint.until = 0; GF.updateNav(); if (GF.audio) GF.audio.whoosh(.5); }
};
function updateCamera(dt) {
  if (!cam.drag) cam.yaw += (-cam.idx * Math.PI / 2 - cam.yaw) * (1 - Math.exp(-dt * 5.5));
  const a = cam.yaw, s = Math.sin(a), c = Math.cos(a);
  GF.camera.position.set(9 * s, 7.4, 9 * c);
  GF.camera.lookAt(-10 * s, 2.5, -10 * c);
  GF.lightRig.rotation.y = a;
}
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  GF.renderer.setSize(w, h, true);
  const asp = w / Math.max(1, h);
  GF.camera.aspect = asp;
  GF.camera.fov = U.clamp(2 * Math.atan(Math.tan(29.7 * Math.PI / 180) / asp) * 180 / Math.PI, 40, 78);
  GF.camera.updateProjectionMatrix();
}

/* ---------- picking / input ---------- */
const ray = new T.Raycaster(), ndc = new T.Vector2(), _w = new V3(), plane = new T.Plane();
function setRay(x, y) { ndc.set(x / window.innerWidth * 2 - 1, -(y / window.innerHeight) * 2 + 1); ray.setFromCamera(ndc, GF.camera); }
function testSphere(c, r) {
  const o = ray.ray.origin, d = ray.ray.direction;
  _v.copy(c).sub(o); const t = _v.dot(d); if (t < 0) return -1;
  const d2 = _v.lengthSq() - t * t; if (d2 > r * r) return -1;
  return Math.sqrt(Math.max(0, d2)) / r + t * .004;
}
function pick(x, y) {
  setRay(x, y);
  let best = null, bs = 9;
  const fat = GF.mobile ? 1.25 : 1.1;
  const scan = (Z, hits, layer) => {
    if (layer) for (const b of layer.boxes) {
      if (!b.vis || b.noTap || !layer.onTap) continue;
      _w.set(b.pos.x, b.pos.y + b.hop + b.s * .5, b.pos.z); if (Z) _w.applyMatrix4(Z.group.matrixWorld);
      const sc = testSphere(_w, b.s * .78 * fat) - .15;
      if (sc > -1 && sc < bs) { bs = sc; best = { Z: Z, box: b, layer: layer }; }
    }
    for (const h of hits) {
      if (h.on && !h.on()) continue;
      const tg = typeof h.target === 'function' ? h.target() : h.target; if (!tg) continue;
      if (tg.isObject3D) tg.getWorldPosition(_w); else { _w.copy(tg); if (Z) _w.applyMatrix4(Z.group.matrixWorld); }
      _w.y += h.dy;
      const sc = testSphere(_w, h.r * fat) + (h.pri || 0);
      if (sc > -1 && sc < bs) { bs = sc; best = { Z: Z, h: h }; }
    }
  };
  for (const Z of GF.zones) if (Z) scan(Z, Z.hits, Z.layer);
  if (GF.parade && GF.parade.active) scan(null, GF.parade.hits, GF.parade.layer);
  return best;
}
function initInput(cv) {
  const ptrs = new Map(); let camPtr = null;
  const startCam = (e, p) => { camPtr = e.pointerId; p.mode = 'cam'; p.yaw0 = cam.yaw; p.cx = e.clientX; cam.drag = true; };
  cv.addEventListener('pointerdown', e => {
    e.preventDefault(); if (GF.audio) GF.audio.unlock(); GF.lastTouch = GF.time; GF.hint.until = 0;
    const p = { x0: e.clientX, y0: e.clientY, mode: 'tap', hit: pick(e.clientX, e.clientY) };
    const hit = p.hit;
    if (hit) {
      if (hit.box) { hit.layer.onTap(hit.box); if (hit.layer.canDrag && hit.layer.canDrag(hit.box)) p.mode = 'maybe'; }
      else hit.h.tap(hit.h);
    } else if (camPtr === null) startCam(e, p);
    ptrs.set(e.pointerId, p);
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  cv.addEventListener('pointermove', e => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    GF.lastTouch = GF.time;
    const dx = e.clientX - p.x0, dy = e.clientY - p.y0;
    if (p.mode === 'maybe' && dx * dx + dy * dy > 100) {
      const L = p.hit.layer, b = p.hit.box;
      if (L.canDrag(b)) { p.mode = 'drag'; L.dragStart(b); } else p.mode = 'tap';
    }
    if (p.mode === 'tap' && Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.5 && camPtr === null) startCam(e, p);
    if (p.mode === 'drag') {
      const Z = p.hit.Z; setRay(e.clientX, e.clientY);
      plane.set(_up, -Z.dragY);
      if (ray.ray.intersectPlane(plane, _w)) { Z.group.worldToLocal(_w); p.hit.layer.dragMove(p.hit.box, _w); }
    } else if (p.mode === 'cam') {
      cam.yaw = p.yaw0 + (e.clientX - p.cx) / window.innerWidth * 1.15;
    }
  });
  const up = e => {
    const p = ptrs.get(e.pointerId); if (!p) return; ptrs.delete(e.pointerId);
    if (p.mode === 'drag') p.hit.layer.dragEnd(p.hit.box);
    if (p.mode === 'cam') {
      camPtr = null; cam.drag = false;
      const d = cam.yaw - p.yaw0;
      if (Math.abs(d) > .16) cam.idx = Math.round(-p.yaw0 / (Math.PI / 2)) + (d > 0 ? -1 : 1);
      GF.onFacing();
    }
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  const stop = e => e.preventDefault();
  document.addEventListener('touchmove', stop, { passive: false });
  document.addEventListener('gesturestart', stop); document.addEventListener('contextmenu', stop);
  document.addEventListener('dblclick', stop);
  for (const ev of ['touchend', 'pointerup', 'click', 'keydown']) document.addEventListener(ev, () => { if (GF.audio) GF.audio.unlock(); }, { passive: true });
  const nav = (id, dir) => {
    const el = document.getElementById(id);
    el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (GF.audio) GF.audio.unlock(); GF.lastTouch = GF.time; GF.go(dir); });
  };
  nav('navL', -1); nav('navR', 1);
}
GF.attn = -1;                                         // zone that wants a visit (parade ready)
GF.updateNav = function () {
  const L = document.getElementById('navL'), R = document.getElementById('navR');
  const d = GF.attn < 0 ? 0 : U.mod(GF.attn - GF.facing, 4);
  L.classList.toggle('glow', d === 3); R.classList.toggle('glow', d === 1 || d === 2);
};
GF.attention = function (k) { if (GF.attn !== k) { GF.attn = k; GF.updateNav(); } };

/* ---------- "touch here" hint: pulsing ring + bobbing arrow ---------- */
GF.hint = {
  until: 0, get: null, next: 6, idx: 0,
  init(scene) {
    const m = new T.MeshBasicMaterial({ color: 0xfff27a, transparent: true, opacity: .9, depthTest: false, depthWrite: false });
    this.g = new T.Group(); this.g.visible = false; scene.add(this.g);
    this.ring = new T.Mesh(shared(new T.TorusGeometry(.8, .07, 6, 28)), m); this.ring.renderOrder = 50; this.g.add(this.ring);
    this.arrow = new T.Mesh(shared(new T.ConeGeometry(.28, .6, 10).rotateX(Math.PI)), m); this.arrow.renderOrder = 50; this.g.add(this.arrow);
    this.mat = m;
  },
  at(get, dur) { this.get = get; this.until = GF.time + dur; },
  update() {
    const idle = GF.time - GF.lastTouch, Z = GF.zones[GF.facing];
    if (GF.time > this.until && idle > 7 && GF.time > this.next && Z && Z.hints.length && !cam.drag) {
      for (let k = 0; k < Z.hints.length; k++) {
        const fn = Z.hints[(this.idx + k) % Z.hints.length], p = fn();
        if (p) { this.idx = (this.idx + k + 1) % Z.hints.length; this.at(() => { const q = fn(); return q ? Z.world(q) : null; }, 3.6); break; }
      }
      this.next = GF.time + 7.5;
    }
    let p = null;
    if (GF.time < this.until && this.get) p = this.get();
    this.g.visible = !!p; if (!p) return;
    this.g.position.copy(p);
    const k = (GF.time * 1.4) % 1;
    this.ring.quaternion.copy(GF.camera.quaternion); this.ring.scale.setScalar(.7 + k * .9); this.mat.opacity = .95 - k * .6;
    this.arrow.position.y = 1.5 + Math.abs(Math.sin(GF.time * 5)) * .4;
  }
};

/* ---------- wall decoration helpers ---------- */
GF.deco = {
  window(g, x, y, r) {
    r = r || 1.1;
    g.cyl(r, r, .12, C.sky, x, y, -15.72, Math.PI / 2, 0, 0, 20).tor(r, .13, C.white, x, y, -15.66, 0, 0, 0, 6, 20)
      .box(.08, r * 2, .08, C.white, x, y, -15.64).box(r * 2, .08, .08, C.white, x, y, -15.64);
  },
  pipe(g, pts, r, col) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = new V3(pts[i][0], pts[i][1], pts[i][2]), b = new V3(pts[i + 1][0], pts[i + 1][1], pts[i + 1][2]);
      g.tube(a, b, r, col); g.sph(r * 1.25, col, b.x, b.y, b.z, 1, 1, 1, 8, 6);
    }
  },
  button(Z, x, z, col, r) {                           // pedestal + pressable dome, returns the dome
    r = r || .55;
    Z.geo().cyl(r * 1.05, r * 1.3, .9, C.steel, x, .45, z, 0, 0, 0, 14).cyl(r * 1.2, r * 1.2, .12, C.dark, x, .92, z, 0, 0, 0, 14);
    return Z.part(q => q.sph(r, col, 0, 0, 0, 1, .62, 1, 14, 8), null, x, 1.0, z);
  },
  press: function* (m, y0) {
    yield* GF.tween(.07, t => { m.position.y = y0 - .14 * t; }, U.ease.out);
    yield* GF.tween(.22, t => { m.position.y = y0 - .14 * (1 - t); }, U.ease.back);
  }
};

/* ---------- the room shared by all four areas ---------- */
function buildShell() {
  const g = new Geo(), wallCols = [0xffe9a8, 0xbff0dc, 0xffd0e4, 0xc5e4ff];
  for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) {
    const x = -16 + i * 2 + 1, z = -16 + j * 2 + 1;
    g.add(new T.PlaneGeometry(2, 2), (i + j) % 2 ? 0xfff6e6 : 0xffe6c7, x, 0, z, -Math.PI / 2, 0, 0);
  }
  g.tor(4, .22, 0xffc2d9, 0, .02, 0, Math.PI / 2, 0, 0, 4, 40).cyl(1.6, 1.6, .04, 0xffd98a, 0, .02, 0, 0, 0, 0, 24).cyl(1.1, 1.1, .05, 0xfff3c4, 0, .03, 0, 0, 0, 0, 5);
  for (let k = 0; k < 4; k++) {
    g.at(0, 0, 0, -k * Math.PI / 2);
    g.box(32, 13, .5, wallCols[k], 0, 6.5, -16.25).box(32, .6, .7, C.white, 0, .3, -16.1).box(32, .35, .6, C.white, 0, 10.6, -16.15);
    const col = k === 2 ? 0xffb86b : C.purple;                    // corner tower to the right of area k
    g.cyl(2.7, 2.7, 13, k === 3 ? 0xffc46b : 0xc9b6f7, 15, 6.5, -15, 0, 0, 0, 20).cyl(2.9, 2.9, .5, C.white, 15, 10.6, -15, 0, 0, 0, 20);
    if (k === 3) {                                               // parade gate
      g.cyl(2.2, 2.2, .2, C.night, 13.05, 0, -13.05, 0, Math.PI / 4, Math.PI / 2, 20);
      g.tor(2.2, .22, C.red, 13.0, 0, -13.0, 0, -Math.PI / 4, 0, 6, 24);
    } else {
      g.cyl(1.25, 1.25, .2, C.night, 13.15, 1.75, -13.15, 0, Math.PI / 4, Math.PI / 2, 16);
      g.tor(1.25, .16, col, 13.1, 1.75, -13.1, 0, -Math.PI / 4, 0, 6, 20);
    }
  }
  g.at();
  const m = g.mesh(); GF.scene.add(m); GF.shell = m;
}

/* one simulation step (also used by the smoke test to fast-forward) */
GF.sim = function (dt) {
  GF.dt = dt; GF.time += dt;
  updateCamera(dt);
  for (const Z of GF.zones) if (Z) { if (GF.audio) GF.audio.far(Z.k !== GF.facing); Z.update(dt); }
  if (GF.audio) GF.audio.far(false);
  GF.runner.update(dt);
  if (GF.parade) GF.parade.update(dt);
  GF.fx.update(dt); GF.hint.update();
  if (GF.audio) GF.audio.update(dt);
};

/* ---------- boot ---------- */
GF.init = function () {
  const cv = document.getElementById('c');
  const r = GF.renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, stencil: false, powerPreference: 'high-performance' });
  GF.dpr = GF.mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  r.setPixelRatio(GF.dpr); r.setClearColor(0xd9f1ff);
  GF.scene = new T.Scene();
  GF.camera = new T.PerspectiveCamera(46, 1.33, .5, 90);
  GF.lightRig = new T.Group(); GF.scene.add(GF.lightRig);
  GF.scene.add(new T.HemisphereLight(0xffffff, 0xffe2c2, 2.0));
  const dl = new T.DirectionalLight(0xfff4e0, 2.1); dl.position.set(-6, 14, 10); GF.lightRig.add(dl); GF.lightRig.add(dl.target);
  GF.initShared(); GF.fx.init(GF.scene); GF.hint.init(GF.scene);
  buildShell();
  resize(); window.addEventListener('resize', resize); window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  initInput(cv);
  GF.ensure(0); GF.updateNav();
  let last = performance.now(), first = true;
  function frame(now) {
    requestAnimationFrame(frame);
    let dt = (now - last) / 1000; last = now; if (!(dt > 0)) dt = .016; if (dt > .05) dt = .05;
    GF.frames = (GF.frames || 0) + 1;
    GF.sim(dt);
    r.render(GF.scene, GF.camera);
    if (first) { first = false; GF.firstFrameMs = performance.now() - (window.__t0 || 0); setTimeout(GF.lazyLoad, 60); }
  }
  requestAnimationFrame(frame);
};
/* after the first frame: fetch the other areas' scripts and build the neighbours in the background */
GF.lazyLoad = function () {
  const files = ['js/zone1.js', 'js/zone3.js', 'js/parade.js', 'js/zone2.js']; let i = 0;
  const next = () => {
    if (i >= files.length) { GF.lazy = true; stepBuild(); return; }
    const s = document.createElement('script'); s.src = files[i++]; s.onload = () => setTimeout(next, 30);
    s.onerror = () => { console.error('load failed', s.src); setTimeout(next, 30); };
    document.head.appendChild(s);
  };
  const stepBuild = () => {                           // one neighbour per tick to avoid a long frame
    const f = GF.facing, order = [f, U.mod(f + 1, 4), U.mod(f + 3, 4)];
    const k = order.find(z => !GF.zones[z] && GF.defs[z]);
    if (k === undefined) { GF.ready = true; return; }
    GF.ensure(k); setTimeout(stepBuild, 120);
  };
  next();
};
})();
