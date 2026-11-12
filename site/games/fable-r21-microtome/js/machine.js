/* Procedural geometry of the rotary microtome and its kinematic pose.
   Units are millimetres. X = right, Y = up, Z = towards the operator. */
(function () {
  'use strict';
  const MT = window.MT;
  const T = THREE;
  const DEG = Math.PI / 180;

  // ---- kinematic constants (shared with the simulation) -------------------
  const K = (MT.K = {
    R: 30,                 // crank radius -> 60 mm vertical stroke
    yE: 150, zE: 195,      // blade edge (world)
    bw: 30, bh: 24,        // block face
    W0: 8, Wmin: 0.8,      // wax depth: new / safety stop
    tau: 22 * DEG,         // blade tilt from vertical
    wheel: [134, 195, 40], // handwheel centre (inner face)
    coarsePerRev: 2.0,     // mm of feed per coarse-wheel turn
    gear: 50 / 41,         // coarse shaft : feed spindle
    retract: 0.04,         // specimen retraction on the return stroke (mm)
    Pchunk: 0.03,          // above this a cut is a chunk, not a section (mm)
    Pmax: 2.0,             // deepest bite the coarse feed allows (mm)
    Fmin: -3,
    feedA0: 300 * DEG, feedA1: 350 * DEG,
    guardOpen: 61 * DEG,
    guardPivot: [110, 220],
  });
  // blade frame: s runs down the blade face from the edge, n is the outward normal
  const dY = -Math.cos(K.tau), dZ = Math.sin(K.tau), nY = Math.sin(K.tau), nZ = Math.cos(K.tau);
  K.d = [dY, dZ]; K.n = [nY, nZ];
  const bladePt = (s, n) => [K.zE + dZ * s + nZ * n, K.yE + dY * s + nY * n];   // -> [z, y]

  // Surface the ribbon slides on, as a height profile y(z) (see ribbon.js).
  K.profile = (function () {
    const a = bladePt(3.5, 0.3), b = bladePt(10, 7.25), c = bladePt(40, 7.25);
    return [
      [150, 58.5], [194.6, 58.5], [194.9, 149.2], [K.zE, K.yE],
      a, b, c, [244.1, 92.4], [245.7, 90.4], [246.6, 58.5],
      [397.4, 58.5], [398.4, 74.8], [403, 74.8], [403.6, 0], [470, 0],
    ];
  })();

  // ---- geometry helpers ---------------------------------------------------
  const BGU = T.BufferGeometryUtils;
  const crease = (g, deg) => BGU.toCreasedNormals(g, (deg || 40) * DEG);
  function M(geo, mat, x, y, z) {
    const m = new T.Mesh(geo, mat);
    m.castShadow = true; m.receiveShadow = true;
    if (x !== undefined) m.position.set(x, y, z);
    return m;
  }
  function rbox(w, h, d, r, seg) {
    return MT.projUV(new T.RoundedBoxGeometry(w, h, d, seg || 3, Math.min(r, w / 2 - 0.01, h / 2 - 0.01, d / 2 - 0.01)));
  }
  function orient(g, axis) {
    if (axis === 'x') g.rotateZ(-Math.PI / 2);
    else if (axis === 'z') g.rotateX(Math.PI / 2);
    return g;
  }
  function cyl(r, len, axis, seg, open) {
    return orient(new T.CylinderGeometry(r, r, len, seg || 40, 1, !!open), axis);
  }
  // Lathe from [[radius, axial], ...]; order: axis -> outside -> axis for outward normals.
  function lathe(pts, axis, seg) {
    const g = new T.LatheGeometry(pts.map(p => new T.Vector2(Math.max(p[0], 0.0001), p[1])), seg || 56);
    return orient(crease(g, 38), axis);
  }
  function uvScale(g, su, sv) {
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
    return g;
  }
  // polygon with filleted corners: [[x, y, r], ...] -> [[x, y], ...]
  function rpoly(c, segs) {
    segs = segs || 6;
    const out = [], n = c.length;
    for (let i = 0; i < n; i++) {
      const p = c[i], a = c[(i + n - 1) % n], b = c[(i + 1) % n], r = p[2] || 0;
      if (r <= 0) { out.push([p[0], p[1]]); continue; }
      let ax = a[0] - p[0], ay = a[1] - p[1], bx = b[0] - p[0], by = b[1] - p[1];
      const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
      ax /= la; ay /= la; bx /= lb; by /= lb;
      const half = Math.acos(Math.max(-1, Math.min(1, ax * bx + ay * by))) / 2;
      const d = Math.min(r / Math.tan(half), la * 0.49, lb * 0.49);
      const rr = d * Math.tan(half);
      let mx = ax + bx, my = ay + by; const ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
      const cd = rr / Math.sin(half), cx = p[0] + mx * cd, cy = p[1] + my * cd;
      const a0 = Math.atan2(p[1] + ay * d - cy, p[0] + ax * d - cx);
      let da = Math.atan2(p[1] + by * d - cy, p[0] + bx * d - cx) - a0;
      while (da > Math.PI) da -= 2 * Math.PI;
      while (da < -Math.PI) da += 2 * Math.PI;
      for (let k = 0; k <= segs; k++) { const t = a0 + (da * k) / segs; out.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]); }
    }
    return out;
  }
  function shapeOf(pts) {
    const s = new T.Shape();
    pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
    s.closePath();
    return s;
  }
  // Extrude a 2D outline, centred along the extrusion; bevel keeps the outline size.
  function extrude(pts, depth, bevel, holes, mode) {
    const s = pts instanceof T.Shape ? pts : shapeOf(pts);
    if (holes) holes.forEach(h => s.holes.push(h instanceof T.Path ? h : new T.Path(h.map(p => new T.Vector2(p[0], p[1])))));
    bevel = bevel || 0;
    const g = new T.ExtrudeGeometry(s, {
      depth: depth - 2 * bevel, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel,
      bevelOffset: -bevel, bevelSegments: bevel > 2 ? 4 : 2, curveSegments: 20, steps: 1,
    });
    g.translate(0, 0, -(depth - 2 * bevel) / 2);
    if (mode === 'side') g.rotateY(-Math.PI / 2);        // outline given as (z, y), extruded along X
    else if (mode === 'plan') g.rotateX(-Math.PI / 2);   // outline given as (x, -z), extruded along Y
    return MT.projUV(crease(g, 34));
  }
  function gearPts(teeth, rRoot, rTip, saw) {
    const p = [];
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2, st = (Math.PI * 2) / teeth;
      const q = (r, f) => p.push([r * Math.cos(a + st * f), r * Math.sin(a + st * f)]);
      if (saw) { q(rTip, 0); q(rRoot, 0.12); }
      else { q(rRoot, 0); q(rTip, 0.2); q(rTip, 0.5); q(rRoot, 0.7); }
    }
    return p;
  }
  function circlePath(cx, cy, r) { const p = new T.Path(); p.absarc(cx, cy, r, 0, Math.PI * 2, true); return p; }

  // ---- build ----------------------------------------------------------------
  MT.buildMachine = function () {
    const Mat = MT.Mat;
    const root = new T.Group();
    const parts = {};
    const refs = {};
    function part(id, name, desc, ex, hint, parent) {
      const g = new T.Group(); g.name = id;
      parts[id] = { id, name, desc, g, ex: new T.Vector3(ex[0], ex[1], ex[2]), k: 0, target: 0, hint: hint || '', anchor: null, hot: null };
      (parent || root).add(g);
      return g;
    }
    function anchor(id, parent, x, y, z, key) {
      const o = new T.Object3D(); o.position.set(x, y, z); parent.add(o);
      parts[id][key || 'anchor'] = o;
      return o;
    }
    function tag(obj, id) { obj.traverse(o => { if (o.isMesh && !o.userData.part) o.userData.part = id; }); }

    const upper = new T.Group(); root.add(upper); refs.upper = upper;

    // ===== base =============================================================
    const base = part('base', 'ベース', '重い鋳鉄の土台。振動をおさえる', [0, 0, 0]);
    base.add(M(extrude(rpoly([[-150, 125, 30], [150, 125, 30], [150, -345, 30], [-150, -345, 30]], 8), 34, 4, null, 'plan'), Mat.paintBase, 0, 25, 0));
    base.add(M(extrude(rpoly([[-143, 118, 24], [143, 118, 24], [143, -338, 24], [-143, -338, 24]], 8), 8, 2.5, null, 'plan'), Mat.paintBase, 0, 46, 0));
    for (const fx of [-112, 112]) for (const fz of [-88, 308])
      base.add(M(lathe([[0, 0], [17, 0], [20, 2.5], [20, 8.5], [0, 8.5]], 'y', 32), Mat.rubber, fx, 0, fz));
    for (const rx of [-34, 34]) base.add(M(rbox(16, 6, 208, 1), Mat.steelGround, rx, 53, 233));
    base.add(M(rbox(52, 1.2, 208, 0.4), Mat.anod, 0, 50.5, 233));
    anchor('base', base, -150, 34, 250);
    tag(base, 'base');

    // ===== housing (cover) ===================================================
    const housing = part('housing', '本体カバー', '上下動と送りの機構が入っている', [0, 172, 0], '', upper);
    housing.add(M(extrude(rpoly([[-112, 50, 3], [118, 50, 3], [118, 240, 14], [90, 285, 24], [-84, 285, 26], [-112, 256, 26]], 8), 240, 9, null, 'side'), Mat.paintBody));
    // slot bezel + bellows
    housing.add(M(extrude(rpoly([[-36, 78, 9], [36, 78, 9], [36, 228, 9], [-36, 228, 9]]), 6, 1.5,
      [rpoly([[-27, 86, 5], [27, 86, 5], [27, 220, 5], [-27, 220, 5]])]), Mat.anod, 0, 0, 121));
    {
      const g = new T.PlaneGeometry(56, 136); uvScale(g, 1, 4.2);
      const m = M(g, Mat.bellows, 0, 153, 119.4); m.castShadow = false; housing.add(m);
    }
    // name plate, status lamp
    { const m = M(new T.PlaneGeometry(64, 16), Mat.plate, -78, 208, 118.35); m.castShadow = false; housing.add(m); }
    housing.add(M(lathe([[0, 0], [7.5, 0], [7.5, 1.6], [5.6, 2.6], [0, 2.6]], 'z', 32), Mat.chrome, -78, 178, 118));
    refs.lampMat = Mat.lampOff.clone();
    housing.add(M(new T.SphereGeometry(4.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2), refs.lampMat, -78, 178, 120));
    // rubber mat on top, cover screws, wheel bearing boss
    housing.add(M(rbox(150, 2.4, 118, 1), Mat.rubber, -20, 285.4, 2));
    for (const sx of [-1, 1]) for (const p of [[-96, 70], [102, 70], [102, 222], [-96, 240]])
    { const m = M(lathe([[0, 0], [4.2, 0], [4.2, 1.2], [2.6, 2.6], [0, 2.8]], 'x', 20), Mat.steelGround, sx * 120, p[1], p[0]); m.rotation.z = sx < 0 ? Math.PI : 0; housing.add(m); }
    housing.add(M(lathe([[0, 0], [31, 0], [31, 5], [25, 12], [0, 12]], 'x', 48), Mat.paintBody, 120, K.wheel[1], K.wheel[2]));
    anchor('housing', housing, -112, 78, 112);

    // --- thickness dial (on the cover) ---
    const dial = part('dial', '厚さダイヤル', '1回転ごとの送り量を 1〜20 µm で決める', [0, 0, 46], 'drag', housing);
    {
      const o = new T.Group(); o.position.set(80, 196, 118); dial.add(o);
      o.add(M(lathe([[0, 0], [31, 0], [31, 2.2], [29, 3.4], [0, 3.4]], 'z', 64), Mat.steelGround));
      const rot = new T.Group(); o.add(rot); refs.dialRot = rot;
      rot.add(M(lathe([[0, 3.4], [27.5, 3.4], [27.5, 8], [26, 9.4], [0, 9.4]], 'z', 64), Mat.anod));
      const face = M(new T.RingGeometry(14, 26.2, 72, 1), Mat.dialFace, 0, 0, 9.55); face.castShadow = false; rot.add(face);
      rot.add(M(uvScale(lathe([[0, 9.4], [15, 9.4], [15, 26], [13.4, 28], [0, 28]], 'z', 64), 12, 2), Mat.anodKnurl));
      rot.add(M(lathe([[0, 28], [9, 28], [9, 28.8], [0, 29]], 'z', 32), Mat.chrome));
      // fixed index mark
      const tri = new T.Shape(); tri.moveTo(-4.5, 8); tri.lineTo(4.5, 8); tri.lineTo(0, 0); tri.closePath();
      const idx = M(new T.ShapeGeometry(tri), new T.MeshLambertMaterial({ color: 0xe02a20, emissive: 0x5a0a06 }), 0, 31.5, 0.5);
      idx.castShadow = false; o.add(idx);
      anchor('dial', o, 0, 30, 14); anchor('dial', o, 0, 0, 30, 'hot');
    }
    tag(dial, 'dial');

    // --- coarse advance wheel (on the cover) ---
    const coarse = part('coarse', '粗送りホイール', '試料を大きく前後させる。回しすぎ注意', [0, 0, 42], 'drag', housing);
    {
      const o = new T.Group(); o.position.set(78, 104, 118); coarse.add(o);
      o.add(M(lathe([[0, 0], [16, 0], [16, 3], [0, 3]], 'z', 40), Mat.steelGround));
      const rot = new T.Group(); o.add(rot); refs.coarseRot = rot;
      rot.add(M(lathe([[0, 3], [32.4, 3], [32.4, 15], [29.5, 16.6], [21, 16.6], [19.5, 14.2], [10, 14.2], [10, 18.5], [0, 18.5]], 'z', 64), Mat.anod));
      rot.add(M(uvScale(cyl(33, 10.5, 'z', 64, true), 22, 1.3), Mat.steelKnurl, 0, 0, 9));
      rot.add(M(lathe([[0, 18.5], [4, 18.5], [4, 19.5], [0, 19.6]], 'z', 24), Mat.chrome));
      rot.add(M(lathe([[0, 16.6], [3, 16.6], [3, 19], [6.4, 20], [6.8, 31], [5.2, 33.4], [0, 33.6]], 'z', 32), Mat.plastic, 0, 23, 0));
      anchor('coarse', o, 0, 34, 14); anchor('coarse', o, 0, 0, 34, 'hot');
    }
    tag(coarse, 'coarse');

    // --- handwheel lock (brake lever on the cover, above the rim) ---
    const lock = part('lock', 'ハンドルロック', 'ホイールを固定して動かなくする', [0, 34, 0], 'toggle', housing);
    {
      lock.add(M(rbox(26, 32, 30, 5), Mat.paintBody, 112, 297, 40));
      lock.add(M(rbox(54, 12, 30, 4.5), Mat.paintBody, 143, 312, 40));
      const shoe = new T.Group(); lock.add(shoe); refs.lockShoe = shoe;
      shoe.add(M(rbox(21, 6, 22, 1.6), Mat.rubber, 147, 299.6, 40));
      shoe.add(M(cyl(4, 8, 'y', 20), Mat.steelGround, 147, 305, 40));
      for (const ex of [-8.5, 8.5]) lock.add(M(rbox(3, 12, 14, 1), Mat.steelGround, 147 + ex, 322, 40));
      const lev = new T.Group(); lev.position.set(147, 323, 40); lock.add(lev); refs.lockLever = lev;
      lev.add(M(cyl(6.5, 14, 'x', 28), Mat.chrome));
      lev.add(M(cyl(3.2, 34, 'y', 20), Mat.chrome, 0, 20, 0));
      lev.add(M(lathe([[0, 30], [5, 30], [8, 36], [8.6, 50], [6.5, 58], [0, 60]], 'y', 32), Mat.plasticRed));
      anchor('lock', lock, 147, 352, 40); anchor('lock', lev, 0, 48, 0, 'hot');
    }
    tag(lock, 'lock');
    tag(housing, 'housing');

    // ===== handwheel ==========================================================
    const wheel = part('wheel', 'ハンドホイール', '1回転で試料が1往復し、1枚切れる', [62, 0, 0], 'drag', upper);
    {
      const rot = new T.Group(); rot.position.set(K.wheel[0], K.wheel[1], K.wheel[2]); wheel.add(rot); refs.wheelRot = rot;
      rot.add(M(cyl(9, 74, 'x', 32), Mat.steelGround, -27, 0, 0));
      rot.add(M(lathe([[0, 0], [26, 0], [26, 10], [20, 14], [20, 30], [17, 34], [0, 34]], 'x', 56), Mat.steelGround));
      rot.add(M(lathe([[0, 34], [7, 34], [7, 36.5], [5, 38], [0, 38]], 'x', 24), Mat.chrome));
      // web with lightening holes
      const web = new T.Shape(); web.absarc(0, 0, 87, 0, Math.PI * 2, false);
      const holes = [];
      for (let i = 0; i < 5; i++) { const a = (i + 0.5) / 5 * Math.PI * 2 + Math.PI / 2; holes.push(circlePath(Math.cos(a) * 55, Math.sin(a) * 55, 16.5)); }
      rot.add(M(extrude(web, 8, 1.6, holes, 'side'), Mat.paintWheel, 13, 0, 0));
      // machined rim
      const rp = rpoly([[85, 0, 3], [100, 0, 4.5], [100, 26, 4.5], [85, 26, 3]], 5); rp.push(rp[0]);
      rot.add(M(lathe(rp, 'x', 96), Mat.steelGround));
      // counterweight pad opposite the handle
      {
        const pts = [];
        for (let i = 0; i <= 16; i++) { const a = (-90 - 42 + (84 * i) / 16) * DEG; pts.push([Math.cos(a) * 82, Math.sin(a) * 82]); }
        for (let i = 16; i >= 0; i--) { const a = (-90 - 34 + (68 * i) / 16) * DEG; pts.push([Math.cos(a) * 36, Math.sin(a) * 36]); }
        rot.add(M(extrude(pts, 7, 2, null, 'side'), Mat.paintWheel, 20, 0, 0));
      }
      // revolving handle
      const hg = new T.Group(); hg.position.set(17, 70, 0); rot.add(hg); refs.handle = hg;
      hg.add(M(cyl(5, 12, 'x', 20), Mat.chrome, 5, 0, 0));
      hg.add(M(lathe([[0, 9], [8.5, 9], [11.5, 12], [13.6, 30], [13.6, 48], [11.6, 64], [8, 70], [0, 71]], 'x', 40), Mat.plastic));
      hg.add(M(lathe([[0, 71], [5, 71], [5, 72.2], [0, 72.4]], 'x', 20), Mat.chrome));
      hg.add(M(new T.BoxGeometry(0.6, 8.4, 1.5), Mat.dark, 72.3, 0, 0));
      anchor('wheel', hg, 44, 16, 0); anchor('wheel', hg, 44, 0, 0, 'hot');
      refs.wheelCenter = new T.Vector3(K.wheel[0] + 13, K.wheel[1], K.wheel[2]);
    }
    tag(wheel, 'wheel');

    // ===== internal mechanism (visible when the cover is lifted) =============
    const mech = new T.Group(); upper.add(mech); refs.mech = mech; mech.visible = false;
    const threadMat = Mat.steelGround.clone(); if (!MT.lite) { threadMat.normalMap = MT.Tex.bellowsN; threadMat.normalScale = new T.Vector2(0.9, 0.9); } threadMat.name = 'thread';
    const crank = part('crank', 'クランクとヨーク', 'ホイールの回転を上下の往復に変える', [0, 0, 0], '', mech);
    {
      const rot = new T.Group(); rot.position.set(0, K.wheel[1], K.wheel[2]); crank.add(rot); refs.crankRot = rot;
      rot.add(M(lathe([[0, 60], [44, 60], [44, 72], [0, 72]], 'x', 56), Mat.steelGround));
      rot.add(M(cyl(5, 16, 'x', 20), Mat.steelGround, 53, K.R, 0));
      rot.add(M(cyl(9.3, 9, 'x', 28), Mat.brass, 53, K.R, 0));
      crank.add(M(rbox(26, 162, 34, 3), Mat.paintBase, 97, 131, K.wheel[2]));
      crank.add(M(cyl(15, 30, 'x', 32), Mat.steelGround, 97, K.wheel[1], K.wheel[2]));
      for (const gx of [-38, 38]) crank.add(M(cyl(7, 212, 'y', 28), Mat.chrome, gx, 156, 84));
      crank.add(M(rbox(100, 8, 22, 2), Mat.paintBase, 0, 262, 84));
      crank.add(M(rbox(100, 10, 26, 2), Mat.paintBase, 0, 55, 84));
      const car = new T.Group(); crank.add(car); refs.carriage = car;
      car.add(M(rbox(100, 94, 40, 4), Mat.paintWheel, 0, -25, 84));
      for (const gx of [-38, 38]) car.add(M(cyl(11, 98, 'y', 28), Mat.brass, gx, -25, 84));
      const slot = rpoly([[-2, -9.8, 9.7], [82, -9.8, 9.7], [82, 9.8, 9.7], [-2, 9.8, 9.7]], 8);
      car.add(M(extrude(rpoly([[-12, -18, 5], [106, -18, 5], [106, 18, 5], [-12, 18, 5]]), 6, 1, [slot], 'side'), Mat.steelGround, 53, 0, 0));
      anchor('crank', rot, 66, 0, 0);
    }
    tag(crank, 'crank');
    const feed = part('feed', '送りねじとラチェット', '1回転ごとに設定した厚さだけ試料を前へ送る', [0, 0, 0], '', mech);
    {
      const mv = new T.Group(); feed.add(mv); refs.feedMove = mv;
      const sp = new T.Group(); sp.position.set(0, K.yE, 0); mv.add(sp); refs.spindleRot = sp;
      sp.add(M(uvScale(cyl(6, 108, 'z', 24), 1, 14), threadMat, 0, 0, -16));
      sp.add(M(extrude(gearPts(41, 38.6, 43), 8, 0.6, [circlePath(0, 0, 6)]), Mat.steelGround, 0, 0, -58));
      sp.add(M(extrude(gearPts(72, 31, 34, true), 6, 0, [circlePath(0, 0, 6)]), Mat.brass, 0, 0, -40));
      mv.add(M(rbox(30, 86, 6, 1.5), Mat.steelGround, 0, K.yE, 41));
      feed.add(M(rbox(40, 40, 28, 3), Mat.brass, 0, K.yE, 8));
      feed.add(M(rbox(36, 82, 24, 2), Mat.paintBase, 0, 91, 8));
      feed.add(M(rbox(30, 112, 10, 2), Mat.paintBase, 0, 106, -74));
      // coarse shaft + gear
      const cs = new T.Group(); cs.position.set(78, 104, 0); feed.add(cs); refs.coarseShaft = cs;
      cs.add(M(cyl(5, 182, 'z', 20), Mat.steelGround, 0, 0, 27));
      cs.add(M(extrude(gearPts(50, 47.6, 52), 18, 0.6, [circlePath(0, 0, 5)]), Mat.brass, 0, 0, -58));
      feed.add(M(rbox(18, 62, 12, 2), Mat.paintBase, 78, 81, 0));
      // pawl
      feed.add(M(cyl(4, 132, 'y', 16), Mat.steelGround, -46, 116, -40));
      const pw = new T.Group(); pw.position.set(-46, 180, -40); feed.add(pw); refs.pawl = pw;
      pw.add(M(rbox(30, 6, 5, 1.5), Mat.steelGround, 13, 0, 0));
      pw.add(M(cyl(5.5, 8, 'z', 20), Mat.brass));
      anchor('feed', feed, 0, 190, -40);
    }
    tag(feed, 'feed');

    // ===== specimen head =======================================================
    const head = part('head', '試料ヘッド', '上下に動き、1回転ごとに刃へ近づく', [0, 52, 0], '', upper);
    const hm = new T.Group(); head.add(hm); refs.headMove = hm;      // y = arm height, z = feed
    {
      hm.add(M(cyl(19, 98, 'z', 48), Mat.steelGround, 0, 0, 99));
      hm.add(M(new T.SphereGeometry(5, 20, 14), Mat.brass, 0, 0, 48));
      hm.add(M(cyl(28, 3, 'z', 48), Mat.rubber, 0, 0, 121.5));
      hm.add(M(new T.TorusGeometry(20, 2, 12, 48), Mat.chrome, 0, 0, 147));
      hm.add(M(lathe([[0, 148], [24, 148], [27, 151], [27, 165], [24, 168], [0, 168]], 'z', 56), Mat.anod));
      const ts = () => uvScale(lathe([[0, 0], [3, 0], [3, 5], [7, 5], [7, 15.5], [5.6, 17], [0, 17]], 'y', 32), 6, 1.2);
      hm.add(M(ts(), Mat.steelKnurl, 0, 25.5, 158));
      const t2 = M(ts(), Mat.steelKnurl, 25.5, 0, 158); t2.rotation.z = -Math.PI / 2; hm.add(t2);
      hm.add(M(cyl(3, 16, 'x', 16), Mat.chrome, -33, 0, 158));
      hm.add(M(new T.SphereGeometry(5.5, 20, 14), Mat.plastic, -42, 0, 158));
      anchor('head', hm, 0, 30, 136);
    }
    // --- orienting clamp ---
    const clamp = part('clamp', 'オリエンテーションクランプ', 'ブロックをつかみ、向きを合わせる', [-64, 0, 0], 'toggle', hm);
    {
      clamp.add(M(rbox(72, 58, 9, 3), Mat.anod, 0, 0, 172.5));
      clamp.add(M(rbox(68, 9, 8.5, 1.2), Mat.steelGround, 0, -18.5, 181.25));
      const jaw = new T.Group(); clamp.add(jaw); refs.jaw = jaw;
      jaw.add(M(rbox(68, 9, 8.5, 1.2), Mat.steelGround, 0, 18.5, 181.25));
      for (const px of [-29.5, 29.5]) clamp.add(M(cyl(2.3, 52, 'y', 16), Mat.chrome, px, 2, 181.25));
      const lev = new T.Group(); lev.position.set(-39, 21, 181); clamp.add(lev); refs.clampLever = lev;
      lev.add(M(cyl(5, 9, 'z', 20), Mat.chrome));
      const rod = M(cyl(2.6, 30, 'y', 16), Mat.chrome, 0, 15, 0); lev.add(rod);
      lev.add(M(new T.SphereGeometry(6.5, 24, 16), Mat.plastic, 0, 32, 0));
      lev.rotation.z = 0.5;
      anchor('clamp', clamp, -30, 34, 181); anchor('clamp', lev, 0, 32, 0, 'hot');
    }
    // --- test block ---
    const block = part('block', 'テストブロック', '目盛りと文字入りの色つきワックス', [0, 46, 0], '', clamp);
    {
      const slide = new T.Group(); block.add(slide); refs.blockSlide = slide;
      slide.add(M(rbox(40, 28, 10, 1.6), Mat.plasticIvory, 0, 0, 182));
      const geo = new T.BoxGeometry(K.bw, 1, 1);
      refs.waxL = M(geo, null); refs.waxU = M(geo, null);
      slide.add(refs.waxL, refs.waxU);
      anchor('block', slide, 15, 12, 190);
    }
    tag(block, 'block'); tag(clamp, 'clamp'); tag(head, 'head');

    // ===== knife holder ========================================================
    const knife = part('knife', 'ナイフホルダー', '刃を決まった角度でしっかり固定する', [0, 0, 52], '', upper);
    refs.knifeEx = knife;
    {
      knife.add(M(rbox(124, 30, 42, 4), Mat.anod, 0, 71, 219));
      knife.add(M(rbox(50, 6, 40, 1), Mat.steelGround, 0, 53, 219));
      knife.add(M(cyl(3.5, 20, 'x', 16), Mat.chrome, 72, 68, 222));
      knife.add(M(lathe([[0, 80], [5, 80], [7.5, 84], [7.5, 94], [5.5, 97], [0, 97]], 'x', 28), Mat.plastic, 0, 68, 222));
      const b4 = bladePt(40, 0.3);
      knife.add(M(extrude([[196.5, 86], [196.5, 143], [197.4, 145], [b4[0], b4[1]], [214.6, 113.2], [247, 86]], 112, 0.8, null, 'side'), Mat.anod));
      for (const sx of [-1, 1]) {
        knife.add(M(extrude(rpoly([[196.5, 86, 2], [196.5, 128, 3], [203, 141, 5], [226, 119, 10], [245, 93, 4], [241, 86, 2]]), 6, 1.2, null, 'side'), Mat.anod, sx * 59, 0, 0));
        const pb = M(lathe([[0, 0], [5.5, 0], [5.5, 1.5], [3.5, 2.8], [0, 3]], 'x', 24), Mat.chrome, sx * 62, K.guardPivot[0], K.guardPivot[1]); pb.rotation.z = sx < 0 ? Math.PI : 0; knife.add(pb);
      }
      // pressure plate (brushed steel) and apron the ribbon slides down
      knife.add(M(extrude([bladePt(3.5, 0.3), bladePt(10, 7.25), bladePt(40, 7.25), bladePt(40, 0.3)], 104, 0.5, null, 'side'), Mat.steel));
      const c = bladePt(40, 7.25);
      knife.add(M(extrude(rpoly([[c[0], c[1], 0], [244.1, 92.4, 1.6], [245.8, 90.2, 1.2], [243.9, 88.6, 0], [214.6, 113.2, 0]], 4), 100, 0.4, null, 'side'), Mat.steel));
      // blade clamp lever + angle scale
      knife.add(M(cyl(3, 16, 'x', 16), Mat.chrome, 69, 127, 211));
      knife.add(M(lathe([[0, 76], [4.5, 76], [6.5, 79], [6.5, 88], [4.6, 90.5], [0, 90.5]], 'x', 24), Mat.plastic, 0, 127, 211));
      const sc = M(new T.PlaneGeometry(26, 6.5), Mat.angleScale, 62.2, 100, 216); sc.rotation.y = Math.PI / 2; sc.castShadow = false; knife.add(sc);
      anchor('knife', knife, -62, 122, 226);
    }
    const blade = part('blade', '替刃', '使い捨てのとても鋭い刃。刃先に触れない', [0, 30, -12], '', knife);
    {
      blade.add(M(extrude([bladePt(0, 0), bladePt(1.9, 0.3), bladePt(10.5, 0.3), bladePt(10.5, -0.3), bladePt(1.9, -0.3)], 80, 0, null, 'side'), Mat.blade));
      anchor('blade', blade, -36, K.yE, K.zE);
    }
    tag(blade, 'blade');
    const guard = part('guard', 'ブレードガード', '刃先をおおう安全カバー。切るときは開ける', [0, 26, 22], 'toggle', knife);
    {
      const pv = new T.Group(); pv.position.set(0, K.guardPivot[0], K.guardPivot[1]); guard.add(pv); refs.guardPivot = pv;
      const armDir = new T.Group(); armDir.rotation.x = -Math.atan2(26, 43); pv.add(armDir);
      for (const sx of [-1, 1]) armDir.add(M(rbox(4, 58, 9, 1.6), Mat.chrome, sx * 66.5, 25, 0));
      const bar = new T.Group(); bar.position.set(0, 43, -26); bar.rotation.x = -K.tau; pv.add(bar);
      bar.add(M(rbox(141, 11, 13, 5), Mat.plasticRed));
      bar.add(M(rbox(12, 17, 6, 2), Mat.plasticRed, 58, 9, 0));
      anchor('guard', bar, 40, 12, 0); anchor('guard', bar, 58, 14, 0, 'hot');
    }
    tag(guard, 'guard'); tag(knife, 'knife');

    // ===== waste tray ============================================================
    const tray = part('tray', 'くず受けトレイ', '切りくずとリボンを受ける。引き出すと空になる', [0, 0, 84], '', upper);
    {
      tray.add(M(rbox(208, 1.5, 218, 0.6), Mat.anodTray, 0, 57.75, 293));
      tray.add(M(rbox(208, 17.5, 2.5, 1), Mat.anodTray, 0, 66, 400.75));
      tray.add(M(rbox(208, 17.5, 2.5, 1), Mat.anodTray, 0, 66, 185.25));
      for (const sx of [-1, 1]) tray.add(M(rbox(2.5, 17.5, 218, 1), Mat.anodTray, sx * 102.75, 66, 293));
      tray.add(M(rbox(64, 4, 9, 1.8), Mat.anodTray, 0, 73, 405));
      anchor('tray', tray, 96, 76, 392);
    }
    tag(tray, 'tray');

    // ---- wax block view ---------------------------------------------------
    const patt = MT.makePatternTexture(false);
    const lineTex = (vertical) => {
      const c = MT.mkCanvas(vertical ? 600 : 8, vertical ? 8 : 480), g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      if (vertical) for (let mm = 0; mm <= 30; mm++) { g.fillStyle = mm % 5 === 0 ? 'rgba(18,32,44,0.6)' : 'rgba(18,32,44,0.22)'; g.fillRect(mm * 20 - 1, 0, mm % 5 === 0 ? 3 : 1.4, 8); }
      else for (let mm = 3; mm <= 22; mm++) { g.fillStyle = (mm - 2) % 5 === 0 ? 'rgba(18,32,44,0.6)' : 'rgba(18,32,44,0.22)'; g.fillRect(0, mm * 20 - 1, 8, (mm - 2) % 5 === 0 ? 3 : 1.4); }
      const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
    };
    const sideTex = lineTex(false), topTex = lineTex(true);
    const wax = {};
    function waxSet(hex) {
      const mk = (map) => { const m = MT.makeWax(hex); m.transparent = false; m.opacity = 1; if (map) { map.needsUpdate = true; m.map = map; } return m; };
      const old = wax.all;
      wax.frontL = mk(patt.clone()); wax.frontU = mk(patt.clone());
      wax.sideL = mk(sideTex.clone()); wax.sideU = mk(sideTex.clone());
      wax.top = mk(topTex);
      wax.all = [wax.frontL, wax.frontU, wax.sideL, wax.sideU, wax.top];
      refs.waxL.material = [wax.sideL, wax.sideL, wax.top, wax.top, wax.frontL, wax.top];
      refs.waxU.material = [wax.sideU, wax.sideU, wax.top, wax.top, wax.frontU, wax.top];
      if (old) old.forEach(m => { if (m.map && m.map !== topTex) m.map.dispose(); m.dispose(); });
    }
    function setBlock(W, p, u) {
      const h = K.bh, hl = h * u, hu = h * (1 - u), dl = Math.max(0.02, W - p), du = Math.max(0.02, W);
      refs.waxL.visible = hl > 0.02; refs.waxU.visible = hu > 0.02;
      refs.waxL.scale.set(1, Math.max(hl, 0.01), dl); refs.waxL.position.set(0, -h / 2 + hl / 2, 187 + dl / 2);
      refs.waxU.scale.set(1, Math.max(hu, 0.01), du); refs.waxU.position.set(0, h / 2 - hu / 2, 187 + du / 2);
      for (const m of [wax.frontL, wax.sideL]) { m.map.repeat.y = Math.max(u, 0.001); m.map.offset.y = 0; }
      for (const m of [wax.frontU, wax.sideU]) { m.map.repeat.y = Math.max(1 - u, 0.001); m.map.offset.y = u; }
    }

    // ---- pose ---------------------------------------------------------------
    // s: { theta, F, retract, um, guard (0 closed..1 open), lock (0..1), clamp (0..1 open), slide (mm), W, cutP, cutU }
    function pose(s) {
      const th = s.theta, armY = K.yE + K.R * Math.cos(th);
      refs.wheelRot.rotation.x = th;
      refs.handle.rotation.x = -th;
      refs.crankRot.rotation.x = th;
      refs.carriage.position.y = K.wheel[1] + K.R * Math.cos(th);
      hm.position.set(0, armY, s.F - s.retract);
      const coarseA = (s.F / K.coarsePerRev) * Math.PI * 2;
      refs.coarseRot.rotation.z = -coarseA;
      refs.coarseShaft.rotation.z = -coarseA;
      refs.spindleRot.rotation.z = coarseA * K.gear;
      refs.feedMove.position.z = s.F;
      // pawl rocks while the feed zone is passed
      const ph = ((th % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const f = Math.max(0, Math.min(1, (ph - K.feedA0) / (K.feedA1 - K.feedA0)));
      refs.pawl.rotation.z = -0.2 - Math.sin(f * Math.PI) * 0.16 * (0.3 + s.um / 20);
      refs.dialRot.rotation.z = -MT.dialAngle(s.um);
      refs.guardPivot.rotation.x = s.guard * K.guardOpen;
      refs.lockLever.rotation.x = -0.25 + s.lock * 1.85;
      refs.lockShoe.position.y = 1.5 - s.lock * 1.9;
      refs.clampLever.rotation.z = 0.5 + s.clamp * 0.9;
      refs.jaw.position.y = s.clamp * 5;
      refs.blockSlide.position.x = -s.slide;
      refs.blockSlide.visible = s.slide < 118;
      setBlock(s.W, s.cutP, s.cutU);
    }

    const seen = new Map();
    root.traverse(o => {
      if (!o.isMesh || o === refs.waxL || o === refs.waxU) return;
      let g = seen.get(o.geometry);
      if (!g) { g = o.geometry.index ? o.geometry : BGU.mergeVertices(o.geometry, 1e-4); seen.set(o.geometry, g); if (g !== o.geometry) o.geometry.dispose(); }
      o.geometry = g;
    });
    return { root, parts, refs, pose, waxSet, wax, bladePt };
  };
})();
