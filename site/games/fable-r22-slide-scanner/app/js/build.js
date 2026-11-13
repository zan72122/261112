/* build.js — the scanner as procedural geometry.
   Every named part is one Group holding at most a matte mesh and a metal mesh with
   vertex colours (merged geometry), so the whole machine is a few dozen draw calls.
   Geometry is authored in "home" world coordinates (cm); moving assemblies are Groups
   whose position/rotation is driven by the simulation. */
(function () {
  'use strict';
  const SS = window.SS, C = SS.cfg, T = THREE;
  const OX = C.OX;

  /* ---------- geometry accumulator ---------- */
  const _m = new T.Matrix4(), _n = new T.Matrix3(), _v = new T.Vector3(), _c = new T.Color();
  const _q = new T.Quaternion(), _e = new T.Euler(), _s = new T.Vector3(1, 1, 1);
  class Geo {
    constructor() { this.p = []; this.n = []; this.c = []; this.i = []; this.count = 0; }
    // append geometry g transformed by matrix m (or identity), painted with hex colour
    add(g, m, hex) {
      const pos = g.attributes.position, nor = g.attributes.normal, idx = g.index;
      _c.set(hex);
      if (m) _n.getNormalMatrix(m);
      const base = this.count;
      for (let k = 0; k < pos.count; k++) {
        _v.fromBufferAttribute(pos, k); if (m) _v.applyMatrix4(m);
        this.p.push(_v.x, _v.y, _v.z);
        _v.fromBufferAttribute(nor, k); if (m) _v.applyMatrix3(_n);
        const l = _v.length();
        if (l > 1e-8) this.n.push(_v.x / l, _v.y / l, _v.z / l); else this.n.push(0, 1, 0); // never a zero normal
        this.c.push(_c.r, _c.g, _c.b);
      }
      if (idx) for (let k = 0; k < idx.count; k++) this.i.push(base + idx.getX(k));
      else for (let k = 0; k < pos.count; k++) this.i.push(base + k);
      this.count += pos.count;
      g.dispose();
      return this;
    }
    at(x, y, z, rx, ry, rz) { _e.set(rx || 0, ry || 0, rz || 0); _q.setFromEuler(_e); _v.set(x, y, z); return _m.compose(_v, _q, _s); }
    box(w, h, d, x, y, z, hex, ry) { return this.add(new T.BoxGeometry(w, h, d), this.at(x, y, z, 0, ry || 0, 0), hex); }
    // box given by its min/max corners
    bb(x0, x1, y0, y1, z0, z1, hex) { return this.box(x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, hex); }
    // cylinder/cone centred at x,y,z along axis 'x' | 'y' | 'z'
    cyl(rt, rb, h, x, y, z, hex, axis, seg) {
      const g = new T.CylinderGeometry(rt, rb, h, seg || 20);
      return this.add(g, this.at(x, y, z, axis === 'z' ? Math.PI / 2 : 0, 0, axis === 'x' ? -Math.PI / 2 : 0), hex);
    }
    // flat ring (washer / lens holder) along y
    ring(ri, ro, h, x, y, z, hex, seg) {
      const pts = [new T.Vector2(ri, -h / 2), new T.Vector2(ro, -h / 2), new T.Vector2(ro, h / 2), new T.Vector2(ri, h / 2), new T.Vector2(ri, -h / 2)];
      const g = new T.LatheGeometry(pts, seg || 24); g.computeVertexNormals();
      return this.add(flat(g), this.at(x, y, z), hex);
    }
    // horizontal plate from a 2D outline in (x,z) with optional holes; top face at y1
    plate(shape, y0, y1, hex) {
      const g = new T.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, curveSegments: 16 });
      // shape plane is (x, z'): extrude along +y after rotating so that shape y -> world z
      _m.makeRotationX(Math.PI / 2); _m.setPosition(0, y1, 0);
      return this.add(g, _m.clone(), hex);
    }
    build() {
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(this.p, 3));
      g.setAttribute('normal', new T.Float32BufferAttribute(this.n, 3));
      g.setAttribute('color', new T.Float32BufferAttribute(this.c, 3));
      g.setIndex(this.count > 65535 ? new T.Uint32BufferAttribute(this.i, 1) : new T.Uint16BufferAttribute(this.i, 1));
      g.computeBoundingSphere();
      this.p = this.n = this.c = this.i = null;
      return g;
    }
  }
  // flat-shaded copy helper for lathe rings (hard edges look better on washers)
  function flat(g) { const f = g.toNonIndexed(); f.computeVertexNormals(); g.dispose(); return f; }

  function rectShape(x0, x1, z0, z1, r) {
    const s = new T.Shape();
    r = r || 0;
    if (!r) { s.moveTo(x0, z0); s.lineTo(x1, z0); s.lineTo(x1, z1); s.lineTo(x0, z1); s.closePath(); return s; }
    s.moveTo(x0 + r, z0); s.lineTo(x1 - r, z0); s.quadraticCurveTo(x1, z0, x1, z0 + r);
    s.lineTo(x1, z1 - r); s.quadraticCurveTo(x1, z1, x1 - r, z1); s.lineTo(x0 + r, z1);
    s.quadraticCurveTo(x0, z1, x0, z1 - r); s.lineTo(x0, z0 + r); s.quadraticCurveTo(x0, z0, x0 + r, z0);
    return s;
  }
  function rectHole(x0, x1, z0, z1) { const h = new T.Path(); h.moveTo(x0, z0); h.lineTo(x0, z1); h.lineTo(x1, z1); h.lineTo(x1, z0); h.closePath(); return h; }
  function circHole(x, z, r) { const h = new T.Path(); h.absarc(x, z, r, 0, Math.PI * 2, true); return h; }

  // threaded rod: a circle whose centre spirals around the axis, so rotation is visible
  function screwGeo(len, r, pitch, axis) {
    const seg = 10, rings = Math.max(8, Math.round((len / pitch) * 6)), pos = [], idx = [];
    for (let a = 0; a <= rings; a++) {
      const s = (a / rings - 0.5) * len;
      for (let b = 0; b < seg; b++) {
        const th = (b / seg) * Math.PI * 2;
        const rr = r * (1 + 0.2 * Math.cos(th - (2 * Math.PI * s) / pitch));
        const x = s, y = Math.cos(th) * rr, z = Math.sin(th) * rr;
        if (axis === 'y') pos.push(z, x, y); else if (axis === 'z') pos.push(y, z, x); else pos.push(x, y, z);
      }
    }
    for (let a = 0; a < rings; a++) for (let b = 0; b < seg; b++) {
      const p0 = a * seg + b, p1 = a * seg + ((b + 1) % seg), p2 = p0 + seg, p3 = p1 + seg;
      idx.push(p0, p2, p1, p1, p2, p3);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx); g.computeVertexNormals();
    return g;
  }

  /* ---------- colours ---------- */
  const K = {
    base: 0x3a4250, body: 0xe7eaee, dark: 0x262a31, mid: 0x8b939d, steel: 0xdfe3e8, brass: 0xd0a646,
    X: 0xe9694b, Y: 0x3d8fdb, Z: 0xf0b429, load: 0x8f6fdc, optic: 0x25b3a2, pcb: 0x1f8a55, red: 0xe5483a,
    wood: 0xd9c7a8, rubber: 0x1b1d21, copper: 0xc77b3b,
  };
  SS.colors = K;

  SS.build = function (scene) {
    const mats = {
      matte: new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.58, metalness: 0.05 }),
      metal: new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.9 }),
      lens: new T.MeshStandardMaterial({ color: 0xc9ecff, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.5, depthWrite: false }),
      cover: new T.MeshStandardMaterial({ color: 0xd8ecf7, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.1, depthWrite: false, side: T.DoubleSide }),
    };
    const M = (SS.m = { parts: {}, mats, slides: [], pickables: [] });
    const root = (M.root = new T.Group()); scene.add(root);
    const grp = (parent, x, y, z) => { const g = new T.Group(); g.position.set(x || 0, y || 0, z || 0); parent.add(g); return g; };

    /* part(id, parent, fn, pivot): fn(m, s) fills the matte and metal accumulators.
       Geometry is authored in the parent's coordinates; with a pivot it is shifted so the
       node can rotate about that point. */
    function part(id, parent, fn, pivot) {
      const node = new T.Group(); node.userData.part = id;
      const m = new Geo(), s = new Geo();
      fn(m, s);
      const px = pivot ? pivot[0] : 0, py = pivot ? pivot[1] : 0, pz = pivot ? pivot[2] : 0;
      [[m, mats.matte], [s, mats.metal]].forEach(([geo, mat]) => {
        if (!geo.count) return;
        const g = geo.build(); if (pivot) g.translate(-px, -py, -pz);
        const mesh = new T.Mesh(g, mat); mesh.userData.part = id; node.add(mesh); M.pickables.push(mesh);
      });
      node.position.set(px, py, pz);
      parent.add(node); M.parts[id] = node;
      return node;
    }
    function addLens(node, r, sy, x, y, z, id) {
      const g = new T.SphereGeometry(r, 20, 10); g.scale(1, sy, 1);
      const mesh = new T.Mesh(g, mats.lens); mesh.position.set(x - node.position.x, y - node.position.y, z - node.position.z);
      mesh.userData.part = id || node.userData.part; mesh.renderOrder = 2; node.add(mesh); M.pickables.push(mesh);
      return mesh;
    }
    function screw(id, parent, len, r, pitch, axis, x, y, z) {
      const node = new T.Group(); node.userData.part = id; node.position.set(x, y, z);
      const mesh = new T.Mesh(screwGeo(len, r, pitch, axis), mats.metalPlain || (mats.metalPlain = new T.MeshStandardMaterial({ color: K.steel, roughness: 0.28, metalness: 0.92 })));
      mesh.userData.part = id; node.add(mesh); M.pickables.push(mesh);
      node.userData.axis = axis; node.userData.pitch = pitch;
      parent.add(node); M.parts[id] = node; return node;
    }
    // stepper motor: black body, silver caps, coupling towards +axis or -axis
    function motor(m, s, x, y, z, axis, sz, dir) {
      const L = sz * 1.25, a = axis;
      const bx = a === 'x' ? L : sz, by = a === 'y' ? L : sz, bz = a === 'z' ? L : sz;
      m.box(bx, by, bz, x, y, z, K.dark);
      const cap = (o) => s.box(a === 'x' ? 0.18 : sz * 1.04, a === 'y' ? 0.18 : sz * 1.04, a === 'z' ? 0.18 : sz * 1.04,
        x + (a === 'x' ? o : 0), y + (a === 'y' ? o : 0), z + (a === 'z' ? o : 0), K.steel);
      cap(L / 2); cap(-L / 2);
      const o = dir * (L / 2 + 0.3);
      s.cyl(0.42, 0.42, 0.6, x + (a === 'x' ? o : 0), y + (a === 'y' ? o : 0), z + (a === 'z' ? o : 0), K.brass, a, 12);
    }

    const gBase = grp(root);

    /* ----- base, column, cover ----- */
    part('base', gBase, (m, s) => {
      m.plate(rectShape(-22.5, 19.5, -15, 15, 1.4), 0, 2, K.base);
      m.plate(rectShape(-21.6, 18.6, -14.1, 14.1, 1), 2, 2.12, 0x465061);
      for (const [x, z] of [[-20, -12.5], [17, -12.5], [-20, 12.5], [17, 12.5]]) m.cyl(1.1, 1.2, 0.3, x, -0.1, z, K.rubber);
      // status light on the front edge
      m.box(3.2, 0.5, 0.2, -17, 1.2, 15.02, K.dark);
    });
    part('column', gBase, (m, s) => {
      m.plate(rectShape(-11.2, -4.8, -14, -9.6, 0.5), 2, 26.6, K.body);
      m.bb(-9.6, -6.4, 24.6, 26.2, -9.7, -1.3, K.body); // head arm
      m.bb(-9.9, -6.1, 25.15, 25.65, -1.9, -1.1, K.mid); // clamp to the cage rods
      s.bb(-8.7, -7.3, 15.8, 24.4, -9.62, -9.2, K.steel); // focus guide rail
      m.bb(-12.9, -10.9, 23.9, 24.2, -9.6, -7.0, K.mid); // focus motor bracket
      m.bb(-12.6, -11.0, 16.0, 16.5, -9.6, -7.2, K.mid); // lower screw bearing
    });
    const cover = part('cover', root, (m, s) => {
      const p = [[-22, -14.6], [-22, 14.6], [10.6, -14.6], [10.6, 14.6]];
      for (const [x, z] of p) s.box(0.45, 34.5, 0.45, x, 19.25, z, K.steel);
      s.bb(-22.2, 10.8, 36.3, 36.75, -14.8, -14.35, K.steel); s.bb(-22.2, 10.8, 36.3, 36.75, 14.35, 14.8, K.steel);
      s.bb(-22.2, -21.75, 36.3, 36.75, -14.8, 14.8, K.steel); s.bb(10.35, 10.8, 36.3, 36.75, -14.8, 14.8, K.steel);
    });
    {
      // acrylic panels: left, back, front, top (right side stays open towards the loader)
      const g = new Geo();
      const pl = (w, h, x, y, z, rx, ry) => g.add(new T.PlaneGeometry(w, h), g.at(x, y, z, rx, ry, 0), 0xffffff);
      pl(29.2, 34.3, -22, 19.15, 0, 0, Math.PI / 2); pl(32.6, 34.3, -5.7, 19.15, -14.6, 0, 0);
      pl(32.6, 34.3, -5.7, 19.15, 14.6, 0, 0); pl(32.6, 29.2, -5.7, 36.5, 0, Math.PI / 2, 0);
      const mesh = new T.Mesh(g.build(), mats.cover); mesh.userData.part = 'cover'; mesh.renderOrder = 5;
      cover.add(mesh); M.pickables.push(mesh); M.coverGlass = mesh;
    }

    /* ----- illumination: lamp, collector, condenser ----- */
    part('lamp', gBase, (m, s) => {
      m.cyl(1.9, 2.0, 3.4, OX, 3.8, 0, K.dark);
      for (let k = 0; k < 4; k++) s.cyl(2.25, 2.25, 0.14, OX, 2.7 + k * 0.6, 0, K.mid, 'y', 24);
      s.ring(0.7, 1.9, 0.25, OX, 5.6, 0, K.steel);
      m.bb(OX + 1.8, OX + 4.2, 2.1, 2.5, -0.35, 0.35, K.dark); // cable
    });
    {
      const led = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 0.12, 20), new T.MeshBasicMaterial({ color: 0x554422 }));
      led.position.set(OX, 5.62, 0); led.userData.part = 'lamp'; M.parts.lamp.add(led); M.led = led; M.pickables.push(led);
    }
    const col = part('collector', gBase, (m, s) => {
      for (let k = 0; k < 3; k++) { const a = k * 2.0944 + 0.5; s.cyl(0.12, 0.12, 4.2, OX + Math.cos(a) * 1.55, 7.7, Math.sin(a) * 1.55, K.steel, 'y', 8); }
      m.ring(1.15, 1.85, 0.5, OX, 7.9, 0, K.optic);
    });
    addLens(col, 1.15, 0.3, OX, 7.9, 0);
    const cond = part('condenser', gBase, (m, s) => {
      m.cyl(1.6, 1.6, 1.3, OX, 10.85, 0, K.dark, 'y', 24);
      m.cyl(0.95, 1.6, 1.05, OX, 12.03, 0, K.dark, 'y', 24);
      m.ring(1.0, 1.72, 0.22, OX, 11.45, 0, K.optic);
      m.bb(OX + 1.5, OX + 2.5, 10.5, 10.75, -0.15, 0.15, K.red); // aperture lever
      m.bb(-8.7, -7.3, 10.0, 10.55, -9.7, -1.5, K.body); // bracket from the column
    });
    addLens(cond, 0.85, 0.35, OX, 12.5, 0);

    /* ----- Y axis (front-back), fixed to the base ----- */
    part('yRail', gBase, (m, s) => {
      for (const x of [-16, 3.8]) {
        for (const z of [-6.2, 6.2]) m.box(1.2, 8.3, 1.2, x, 6.15, z, K.mid);
        m.bb(x - 0.6, x + 0.6, 10.3, 10.9, -7, 7, K.mid);
        for (const z of [-6.8, 6.8]) m.box(1.0, 0.95, 0.5, x, 11.35, z, K.dark);
        s.cyl(0.3, 0.3, 14, x, 11.55, 0, K.steel, 'z', 12);
      }
    });
    part('yMotor', gBase, (m, s) => {
      motor(m, s, -1, 11.4, -8.9, 'z', 2.2, 1);
      m.bb(-1.6, -0.4, 2, 10.3, -9.5, -8.3, K.mid);
      m.bb(-1.6, -0.4, 2, 10.8, 6.5, 7.3, K.mid); m.box(1.3, 1.3, 0.7, -1, 11.4, 6.9, K.dark);
    });
    M.yScrew = screw('yScrew', gBase, 14.2, 0.28, 0.8, 'z', -1, 11.4, -0.2);
    part('limitY', gBase, (m, s) => {
      for (const z of [-6.95, 6.95]) { m.box(0.9, 0.6, 0.5, -14.7, 11.3, z, K.dark); m.box(0.25, 0.75, 0.12, -14.7, 11.75, z - Math.sign(z) * 0.3, K.red); m.box(0.5, 1.0, 0.4, -14.95, 10.75, z, K.mid); }
    });

    /* ----- Y carriage with the X axis on top ----- */
    const gY = (M.gY = grp(root));
    part('yStage', gY, (m, s) => {
      const sh = rectShape(-17.5, 5.2, -4.75, 4.75, 0.5); sh.holes.push(rectHole(-10.7, -5.3, -4.3, 4.3));
      m.plate(sh, 12.0, 12.7, K.Y);
      for (const x of [-16, 3.8]) for (const z of [-3.1, 3.1]) m.box(1.5, 0.95, 2.0, x, 11.52, z, K.dark);
      s.bb(-1.65, -0.35, 10.75, 12.0, -0.6, 0.6, K.brass); // nut
    });
    part('xRail', gY, (m, s) => {
      for (const z of [-2.2, 2.2]) {
        s.cyl(0.25, 0.25, 21.8, -6.1, 13.02, z, K.steel, 'x', 12);
        for (const x of [-16.9, 4.7]) m.box(0.5, 0.7, 0.9, x, 13.05, z, K.dark);
      }
    });
    part('xMotor', gY, (m, s) => {
      motor(m, s, -19.1, 13.02, -3.9, 'x', 2.1, 1);
      m.bb(-20.6, -17.3, 11.75, 12.0, -5.0, -2.8, K.mid); m.bb(-17.75, -17.3, 12.0, 12.6, -5.0, -2.8, K.mid);
      m.box(0.7, 1.2, 1.2, 4.6, 13.02, -3.9, K.dark); // far bearing
    });
    M.xScrew = screw('xScrew', gY, 21.6, 0.27, 0.8, 'x', -6.35, 13.02, -3.9);
    part('limitX', gY, (m, s) => {
      for (const [x, d] of [[-17.05, 1], [4.85, -1]]) { m.box(0.5, 0.6, 0.9, x, 13.0, 3.6, K.dark); m.box(0.12, 0.75, 0.25, x + d * 0.3, 13.25, 3.3, K.red); }
    });

    /* ----- X carriage: the slide holder ----- */
    const gX = (M.gX = grp(gY));
    part('xStage', gX, (m, s) => {
      const sh = rectShape(-14.1, -3.1, -3.0, 3.0, 0.4); sh.holes.push(rectHole(-10.3, -5.0, -1.25, 1.25));
      m.plate(sh, 13.4, 14.0, K.X);
      for (const x of [-12.6, -4.6]) for (const z of [-2.2, 2.2]) m.box(1.6, 0.66, 1.1, x, 13.08, z, K.dark);
      s.bb(-12.6, -11.4, 12.62, 13.45, -4.5, -3.0, K.brass); // nut bracket
      // fences that locate the slide
      m.bb(-12.62, -12.44, 14.0, 14.3, -1.35, 1.35, K.dark); m.bb(-12.44, -9.0, 14.0, 14.3, -1.53, -1.34, K.dark);
      m.bb(-7.4, -4.9, 14.0, 14.3, -1.53, -1.34, K.dark);
    });
    M.clip = part('clip', gX, (m, s) => {
      s.bb(-4.74, -4.2, 14.0, 14.22, 0.5, 1.9, K.steel); s.bb(-4.2, -3.5, 14.0, 14.5, 1.4, 1.9, K.steel);
      s.bb(-10.5, -6.5, 14.0, 14.22, 1.36, 1.6, K.steel);
    });
    // where the slide sits on the stage (slide centre, home position)
    M.anchorStage = { parent: gX, pos: new T.Vector3(OX - 0.6, 14.06, 0), yaw: 0 };

    /* ----- focus: Z carriage, turret, objectives ----- */
    const gZ = (M.gZ = grp(root));
    part('zStage', gZ, (m, s) => {
      m.plate(rectShape(-10.4, -5.6, -9.2, -6.6, 0.3), 18.0, 23.0, K.Z);
      const sh = rectShape(-10.2, -5.8, -6.7, 1.5, 0.6); sh.holes.push(circHole(OX, 0, 0.95));
      m.plate(sh, 19.7, 20.4, K.Z);
      m.bb(-12.5, -10.4, 20.0, 20.8, -8.6, -7.4, K.brass);
      s.cyl(0.5, 0.5, 1.0, OX, 20.7, -2.6, K.steel, 'y', 12);
    });
    const gT = (M.gTurret = grp(gZ, OX, 19.3, -2.6));
    part('turret', gT, (m, s) => {
      m.cyl(3.9, 3.9, 0.8, 0, 0, 0, K.dark, 'y', 36);
      for (let k = 0; k < 18; k++) { const a = (k / 18) * 6.2832; m.box(0.35, 0.82, 0.25, Math.sin(a) * 3.88, 0, Math.cos(a) * 3.88, 0x3a3f48, a); }
    });
    const objSpec = [{ r: 1.0, y1: -2.0, tip: -3.25, tr: 0.55 }, { r: 0.85, y1: -2.6, tip: -4.0, tr: 0.36 }, { r: 0.8, y1: -2.9, tip: -4.06, tr: 0.28 }];
    C.objectives.forEach((o, k) => {
      const a = (k * 2 * Math.PI) / 3, x = Math.sin(a) * 2.6, z = Math.cos(a) * 2.6, sp = objSpec[k];
      const node = part('obj' + k, gT, (m, s) => {
        s.cyl(sp.r, sp.r, -sp.y1 - 0.4, x, (sp.y1 - 0.4) / 2, z, K.steel, 'y', 20);
        s.cyl(sp.r, sp.tr, sp.y1 - sp.tip, x, (sp.y1 + sp.tip) / 2, z, K.steel, 'y', 20);
        m.cyl(sp.r + 0.04, sp.r + 0.04, 0.3, x, -1.1, z, o.ring, 'y', 20);
        m.cyl(sp.r + 0.03, sp.r + 0.03, 0.12, x, -1.5, z, K.dark, 'y', 20);
      });
      addLens(node, sp.tr * 0.8, 0.4, x, sp.tip, z);
    });
    M.zScrew = screw('zScrew', gBase, 7.4, 0.22, 0.5, 'y', -11.9, 20.2, -8.0);
    part('zMotor', gBase, (m, s) => { motor(m, s, -11.9, 25.4, -8.0, 'y', 1.8, -1); });
    M.knob = part('knob', gBase, (m, s) => {
      m.cyl(1.6, 1.6, 0.9, -4.3, 8.5, -11.8, K.dark, 'x', 28);
      m.cyl(0.95, 0.95, 0.7, -3.5, 8.5, -11.8, K.Z, 'x', 20);
      for (let k = 0; k < 16; k++) { const a = (k / 16) * 6.2832; m.box(0.92, 0.2, 0.2, -4.3, 8.5 + Math.cos(a) * 1.58, -11.8 + Math.sin(a) * 1.58, 0x3a3f48); }
      m.box(0.2, 0.3, 0.3, -3.1, 8.5 + 0.55, -11.8, K.body);
    }, [-4.3, 8.5, -11.8]);

    /* ----- imaging: tube lens in a cage, camera, sensor ----- */
    const cagePlate = (m, y, hex) => { const sh = rectShape(OX - 1.75, OX + 1.75, -1.75, 1.75, 0.3); sh.holes.push(circHole(OX, 0, 1.05)); m.plate(sh, y, y + 0.4, hex); };
    part('tube', gBase, (m, s) => {
      for (const dx of [-1.3, 1.3]) for (const dz of [-1.3, 1.3]) s.cyl(0.14, 0.14, 7.0, OX + dx, 25.1, dz, K.steel, 'y', 8);
      cagePlate(m, 21.6, K.dark); cagePlate(m, 28.2, K.dark);
    });
    const tl = part('tubeLens', gBase, (m, s) => { cagePlate(m, 23.2, K.optic); });
    addLens(tl, 1.05, 0.32, OX, 23.4, 0);
    part('camera', gBase, (m, s) => {
      m.plate(rectShape(OX - 2.3, OX + 2.3, -2.3, 2.3, 0.5), 29.6, 33.6, K.dark);
      m.bb(OX - 2.34, OX + 2.34, 32.4, 32.8, -2.34, 2.34, K.optic);
      for (let k = 0; k < 5; k++) s.bb(OX - 1.8, OX + 1.8, 30.0 + k * 0.45, 30.2 + k * 0.45, -2.6, -2.3, K.mid);
      for (const dx of [-1.3, 1.3]) for (const dz of [-1.3, 1.3]) s.cyl(0.18, 0.18, 1.0, OX + dx, 29.1, dz, K.steel, 'y', 8);
      m.cyl(0.3, 0.3, 2.4, OX + 1.2, 34.0, -1.2, K.rubber, 'y', 8); // cable
    });
    part('sensor', gBase, (m, s) => {
      m.bb(OX - 1.25, OX + 1.25, 29.3, 29.45, -1.25, 1.25, K.pcb);
      s.bb(OX - 0.75, OX + 0.75, 29.12, 29.3, -0.75, 0.75, 0x4a3fa8);
    });

    /* ----- loader: transfer arm, tray, rack and its elevator ----- */
    part('armPost', gBase, (m, s) => {
      s.cyl(0.7, 0.7, 17.6, 7, 10.8, 0, K.steel, 'y', 16);
      m.cyl(1.7, 1.9, 0.8, 7, 2.4, 0, K.mid, 'y', 20);
      m.box(2.0, 2.4, 2.0, 7, 4.0, 0, K.dark); s.box(2.08, 0.18, 2.08, 7, 5.2, 0, K.steel);
    });
    const gArm = (M.gArm = grp(root, 7, 0, 0));
    const gLift = (M.gLift = grp(gArm));
    part('arm', gLift, (m, s) => {
      m.cyl(1.25, 1.25, 2.1, 0, 16.45, 0, K.load, 'y', 20);
      m.bb(0.8, 9.1, 16.4, 17.1, -0.7, 0.7, K.load);
      s.cyl(0.9, 0.9, 0.2, 0, 17.6, 0, K.steel, 'y', 16);
    });
    part('gripper', gLift, (m, s) => {
      m.bb(7.7, 9.3, 15.6, 16.4, -1.9, 1.9, K.dark);
      s.bb(8.0, 9.0, 15.9, 16.1, -2.2, 2.2, K.steel);
    });
    const finger = (sgn) => {
      const g = grp(gLift);
      const node = part(sgn > 0 ? 'fingerA' : 'fingerB', g, (m, s) => {
        s.bb(7.6, 9.4, 14.02, 15.6, sgn * 1.31, sgn * 1.46, K.steel);
        m.bb(7.6, 9.4, 14.02, 14.2, sgn * 1.2, sgn * 1.46, K.rubber);
      });
      node.userData.alias = 'gripper';
      return g;
    };
    M.fingerA = finger(1); M.fingerB = finger(-1);
    M.anchorGrip = { parent: gLift, pos: new T.Vector3(8.5, 14.06, 0), yaw: Math.PI };

    const gTray = (M.gTray = grp(root));
    part('tray', gTray, (m, s) => {
      s.bb(5.4, 8.6, 13.85, 14.0, 5.6, 11.4, K.steel);
      s.bb(2.0, 5.4, 13.85, 14.0, 7.7, 9.3, K.steel);
      m.bb(1.8, 3.6, 13.0, 13.85, 7.5, 9.5, K.load);
      for (const x of [5.4, 8.45]) m.bb(x, x + 0.15, 14.0, 14.2, 7.3, 9.7, K.load);
    });
    M.anchorTray = { parent: gTray, pos: new T.Vector3(7, 14.06, 8.5), yaw: Math.PI / 2 };
    part('trayRail', gBase, (m, s) => {
      s.bb(1.5, 10.4, 12.6, 13.0, 8.0, 9.0, K.steel);
      for (const x of [2.3, 9.6]) m.box(0.9, 10.6, 0.9, x, 7.3, 8.5, K.mid);
      motor(m, s, 0.6, 12.5, 8.5, 'x', 1.7, 1);
      m.box(1.0, 9.6, 1.0, 0.6, 6.8, 8.5, K.mid);
    });

    const gRack = (M.gRack = grp(root));
    part('rack', gRack, (m, s) => {
      const W = 0xb79cf0;
      // open frame: two end combs with a ledge for every slot, so the slides inside stay visible
      for (const [z0, z1, zl0, zl1] of [[3.9, 4.2, 4.2, 5.2], [12.8, 13.1, 11.8, 12.8]]) {
        for (const x of [11.7, 14.9]) m.bb(x, x + 0.4, 13.5, 19.0, z0, z1, K.load);
        m.bb(11.7, 15.3, 19.0, 19.25, z0, z1, K.load);
        for (let k = 0; k < 5; k++) m.bb(11.8, 15.2, 14.18 + k * 0.9, 14.3 + k * 0.9, zl0, zl1, W);
      }
      m.bb(11.7, 15.3, 13.2, 13.5, 3.9, 13.1, K.load); // floor
      m.bb(15.2, 15.5, 13.2, 19.25, 7.7, 9.3, K.load); // spine
      m.bb(15.2, 15.5, 19.0, 19.25, 3.9, 13.1, K.load);
      m.bb(15.5, 16.3, 15.2, 17.0, 7.6, 9.4, K.dark); // carriage block to the elevator
      s.bb(15.5, 17.75, 15.7, 16.4, 9.4, 11.5, K.brass); // nut arm on the elevator screw
    });
    M.anchorRack = (k) => ({ parent: gRack, pos: new T.Vector3(13.5, 14.36 + k * 0.9, 8.5), yaw: Math.PI / 2 });
    part('elevator', gBase, (m, s) => {
      m.plate(rectShape(16.3, 18.3, 7.2, 9.8, 0.3), 2, 21.5, K.body);
      s.bb(16.22, 16.32, 9.0, 20.5, 8.0, 9.0, K.steel);
      motor(m, s, 17.3, 6.3, 11.0, 'y', 1.8, 1);
      m.bb(16.6, 18.0, 2, 5.0, 10.3, 11.7, K.mid);
      m.bb(16.8, 17.8, 20.3, 20.8, 9.8, 11.4, K.mid);
    });
    M.eScrew = screw('elevScrew', gBase, 12.6, 0.22, 0.6, 'y', 17.3, 13.9, 11.0);
    M.parts.elevScrew.userData.alias = 'elevator';

    part('board', gBase, (m, s) => {
      m.bb(9.5, 17.5, 2.7, 2.85, -12.6, -5.4, K.pcb);
      for (const [x, z] of [[10, -12.1], [17, -12.1], [10, -5.9], [17, -5.9]]) s.cyl(0.18, 0.18, 0.6, x, 2.42, z, K.brass, 'y', 8);
      m.box(2.2, 0.35, 2.2, 12.2, 3.03, -9.6, K.dark); m.box(1.2, 0.3, 2.8, 15.4, 3.0, -8.2, K.dark);
      for (let k = 0; k < 4; k++) s.cyl(0.32, 0.32, 0.9, 10.6 + k * 0.9, 3.3, -6.6, 0x2b4a8a, 'y', 10);
      m.box(2.6, 0.9, 0.8, 15.6, 3.3, -11.8, K.body);
      for (let k = 0; k < 3; k++) m.box(0.5, 0.25, 0.9, 10.4 + k * 0.8, 2.98, -11.6, K.copper);
    });

    /* ----- desk stand where the three slides wait ----- */
    const tilt = 0.42;
    part('stand', gBase, (m, s) => {
      const sh = new T.Shape(); // side profile (z, y), extruded along x
      sh.moveTo(17.2, 0); sh.lineTo(26.6, 0); sh.lineTo(26.6, 0.7); sh.lineTo(17.2, 0.7 + 9.4 * Math.tan(tilt)); sh.closePath();
      const g = new T.ExtrudeGeometry(sh, { depth: 17, bevelEnabled: false });
      _m.makeRotationY(-Math.PI / 2); _m.setPosition(18.5, 0, 0);
      m.add(g, _m.clone(), K.wood);
    });
    M.tableSpot = (i) => {
      // slide lies on the sloped face, label end towards the user
      const z = 21.9, y = 0.7 + (26.6 - z) * Math.tan(tilt) + 0.09;
      const q = new T.Quaternion().setFromEuler(new T.Euler(tilt, Math.PI / 2, 0, 'XYZ'));
      return { pos: new T.Vector3(4.6 + i * 5.2, y, z), quat: q };
    };

    /* ----- bolts: one InstancedMesh per carrier ----- */
    const boltGeo = new T.CylinderGeometry(0.2, 0.2, 0.14, 8);
    const boltMat = new T.MeshStandardMaterial({ color: 0x3a3f48, roughness: 0.35, metalness: 0.8 });
    M.shared = [boltGeo, boltMat];
    function bolts(parent, list, id) {
      const im = new T.InstancedMesh(boltGeo, boltMat, list.length), d = new T.Object3D();
      list.forEach((p, k) => { d.position.set(p[0], p[1], p[2]); d.updateMatrix(); im.setMatrixAt(k, d.matrix); });
      im.userData.part = id; im.raycast = () => {}; parent.add(im);
    }
    bolts(gY, [[-17, 12.76, -4.2], [-17, 12.76, 4.2], [4.7, 12.76, -4.2], [4.7, 12.76, 4.2], [-11.4, 12.76, 4.2], [-4.6, 12.76, 4.2], [-11.4, 12.76, -4.2], [-4.6, 12.76, -4.2], [-14, 12.76, 0], [0.5, 12.76, 0]], 'yStage');
    bolts(gX, [[-13.6, 14.06, -2.5], [-13.6, 14.06, 2.5], [-3.6, 14.06, -2.5], [-3.6, 14.06, 2.5], [-8.6, 14.06, -2.5], [-8.6, 14.06, 2.5]], 'xStage');
    bolts(gBase, [[-21, 2.18, -13.3], [18, 2.18, -13.3], [-21, 2.18, 13.3], [18, 2.18, 13.3], [-1.5, 2.18, -13.3], [-1.5, 2.18, 13.3], [-21, 2.18, 0], [18, 2.18, 0]], 'base');

    /* ----- the three mock slides ----- */
    const glassGeo = new T.BoxGeometry(C.slide.L * 0.1, 0.12, C.slide.W * 0.1);
    const planeGeo = new T.PlaneGeometry(C.slide.L * 0.1, C.slide.W * 0.1); planeGeo.rotateX(-Math.PI / 2);
    M.shared.push(glassGeo, planeGeo);
    SS.pattern.slides.forEach((sl, i) => {
      const rootS = new T.Group(), body = new T.Group(); rootS.add(body);
      const glass = new T.Mesh(glassGeo, new T.MeshStandardMaterial({ color: sl.glass, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.4, depthWrite: false }));
      const tex = new T.CanvasTexture(SS.pattern.slideTexture(sl)); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
      const plane = new T.Mesh(planeGeo, new T.MeshBasicMaterial({ map: tex, transparent: true, side: T.DoubleSide, depthWrite: false }));
      plane.position.y = 0.064; glass.renderOrder = 3; plane.renderOrder = 4;
      glass.userData.slide = plane.userData.slide = i; glass.userData.part = plane.userData.part = 'slide';
      body.add(glass, plane); M.pickables.push(glass);
      root.add(rootS);
      const spot = M.tableSpot(i); rootS.position.copy(spot.pos); rootS.quaternion.copy(spot.quat);
      M.slides.push({ root: rootS, body, glass, plane, tex });
    });

    /* ----- soft contact shadow and floor ----- */
    {
      const cv = document.createElement('canvas'); cv.width = cv.height = 128;
      const x = cv.getContext('2d'), g = x.createRadialGradient(64, 64, 8, 64, 64, 64);
      g.addColorStop(0, 'rgba(20,28,40,0.55)'); g.addColorStop(0.55, 'rgba(20,28,40,0.28)'); g.addColorStop(1, 'rgba(20,28,40,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      const tex = new T.CanvasTexture(cv);
      const sh = new T.Mesh(new T.PlaneGeometry(74, 62), new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      sh.rotation.x = -Math.PI / 2; sh.position.set(-1.5, 0.02, 3); sh.renderOrder = -1; scene.add(sh); M.shadow = sh;
    }
    return M;
  };
})();
