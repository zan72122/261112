/* views.js (late) — the four ways of looking at the same machine state:
   写実 (as built), 分解 (parts spread out), 光路 (schematic light path), 走査 (stage and tiles linked).
   View-specific objects are created when a view is entered and disposed when it is left. */
(function () {
  'use strict';
  const SS = window.SS, U = SS.util, C = SS.cfg, S = SS.S, mech = SS.mech, sim = SS.sim, ax = S.ax, T = THREE;
  const A = SS.app, M = SS.m, OX = C.OX, TT = C.tiles;
  const Vw = {};

  /* ---------- 分解: how far every part travels ---------- */
  const EX = {
    base: [0, -3.5, 0], cover: [0, 5, -33], column: [0, 0, -9], knob: [4, 0, -9], zScrew: [-4.5, 13, 0], zMotor: [-4.5, 16, 0],
    collector: [0, 1.3, 0], condenser: [0, 2.7, 0], tube: [0, 20, 0], tubeLens: [5, 20, 0], camera: [0, 29, 0], sensor: [0, 25.5, 0],
    stand: [0, 0, 7], board: [7, 0, -6], elevator: [11, 0, 0], elevScrew: [11, 0, 3.5], trayRail: [0, -1.5, 5], armPost: [0, 0, 0],
    clip: [0, 1.6, 0], xMotor: [-3, 0, 0], limitX: [0, 0, 2.5], limitY: [-3, 0, 0], yMotor: [0, 0, -4],
    obj0: [0, -1.4, 0], obj1: [0, -1.4, 0], obj2: [0, -1.4, 0],
  };
  const GEX = { gY: [0, 5.2, 0], gX: [0, 3.4, 0], gZ: [0, 14, 0], gT: [0, -2.6, 0], gArm: [0, 6.5, 0], gTray: [0, 1.5, 5], gRack: [6.5, 0, 0], fA: [0, 0, 1.1], fB: [0, 0, -1.1] };
  for (const id in EX) if (M.parts[id]) M.parts[id].userData.mv.ex.fromArray(EX[id]);
  for (const k in GEX) M.mv[k].ex.fromArray(GEX[k]);

  /* ---------- 光路 ---------- */
  let path = null, dim = 0;
  const bgA = new T.Color(0xdfe6ec), bgB = new T.Color(0x131921);
  const SEG = 20;
  function makePath() {
    const NS = 10; // stations along the axis
    const cone = new T.BufferGeometry();
    cone.setAttribute('position', new T.BufferAttribute(new Float32Array(NS * (SEG + 1) * 3), 3));
    cone.setAttribute('color', new T.BufferAttribute(new Float32Array(NS * (SEG + 1) * 3), 3));
    const idx = [];
    for (let s = 0; s < NS - 1; s++) for (let k = 0; k < SEG; k++) { const a = s * (SEG + 1) + k, b = a + SEG + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    cone.setIndex(idx);
    const coneMat = new T.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false, depthTest: false, side: T.DoubleSide });
    const coneMesh = new T.Mesh(cone, coneMat); coneMesh.renderOrder = 20; coneMesh.frustumCulled = false;
    const lines = new T.BufferGeometry();
    lines.setAttribute('position', new T.BufferAttribute(new Float32Array(5 * (NS - 1) * 2 * 3), 3));
    lines.setAttribute('color', new T.BufferAttribute(new Float32Array(5 * (NS - 1) * 2 * 3), 3));
    const lineMat = new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95, depthTest: false });
    const lineMesh = new T.LineSegments(lines, lineMat); lineMesh.renderOrder = 21; lineMesh.frustumCulled = false;
    const NP = 60, pts = new T.BufferGeometry();
    pts.setAttribute('position', new T.BufferAttribute(new Float32Array(NP * 3), 3));
    const ptMat = new T.PointsMaterial({ color: 0xffffff, size: 5 * SS.dpr, sizeAttenuation: false, transparent: true, opacity: 0.95, depthTest: false });
    const ptMesh = new T.Points(pts, ptMat); ptMesh.renderOrder = 22; ptMesh.frustumCulled = false;
    const spotGeo = new T.CircleGeometry(1, 24); spotGeo.rotateX(-Math.PI / 2);
    const spotMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false, side: T.DoubleSide });
    const spot = new T.Mesh(spotGeo, spotMat); spot.renderOrder = 23;
    const g = new T.Group(); g.add(coneMesh, lineMesh, ptMesh, spot); M.root.add(g);
    path = { g, cone, lines, pts, spot, NS, NP, st: [], disposables: [cone, coneMat, lines, lineMat, pts, ptMat, spotGeo, spotMat], phase: 0 };
    for (let i = 0; i < NS; i++) path.st.push({ y: 0, r: 0, c: [1, 1, 1], on: true });
  }
  function killPath() {
    if (!path) return;
    M.root.remove(path.g); path.disposables.forEach((d) => d.dispose()); path = null;
  }
  const TIP = [-3.25, -4.0, -4.06];
  function updatePath(dt) {
    const p = path, L = S.lamp.level, o = mech.objective(), ob = C.objectives[o];
    const dz = ax.z.pos * C.z.vis, mv = M.mv, ex = M.explode;
    // heights follow the parts, also when the machine is exploded
    const yOf = (id, y) => y + (M.parts[id].position.y - M.parts[id].userData.mv.base.y);
    const zY = mv.gZ.node.position.y, tY = mv.gT.node.position.y - mv.gT.base.y;
    const stageY = mv.gY.node.position.y + mv.gX.node.position.y;
    const what = mech.beamAt(), i = S.stageSlide;
    const turning = Math.abs(ax.tur.pos - Math.round(ax.tur.pos)) > 0.04;
    let defocus = 0;
    if (i >= 0) defocus = ax.z.pos + ob.par - (SS.pattern.slides[i].zs - (S.slides[i].flipped ? C.flipDepth : 0));
    const white = [1.0, 0.93, 0.72], tint = [1, 1, 1];
    if (what === 'glass') { const c = new T.Color(SS.pattern.slides[i].glass); tint[0] = 0.55 + 0.45 * c.r; tint[1] = 0.55 + 0.45 * c.g; tint[2] = 0.55 + 0.45 * c.b; }
    const ySens = yOf('sensor', 29.12), yTL = yOf('tubeLens', 23.4);
    const yImg = ySens - U.clamp(defocus * 0.012, -4.2, 4.2);
    const rb = 0.55, ro = [0.26, 0.32, 0.36][o];
    const blockedAt = what === 'plate' || what === 'label' ? 5 : turning ? 6 : 99;
    const def = [
      [yOf('lamp', 5.7), 0.12, white], [yOf('collector', 7.9), 1.05, white], [yOf('condenser', 11.6), 1.05, white],
      [14.06 + stageY - 0.01, 0.07, white], [14.06 + stageY, 0.07, tint],
      [19.3 + zY + tY + TIP[o] + ex * -1.4, ro, tint], [19.9 + zY, rb, tint], [yTL, rb, tint],
      [Math.min(yImg, ySens), yImg < ySens ? 0.02 : (rb * (yImg - ySens)) / Math.max(0.5, yImg - yTL), tint],
      [ySens, yImg < ySens ? (rb * (ySens - yImg)) / Math.max(0.5, yImg - yTL) : (rb * (yImg - ySens)) / Math.max(0.5, yImg - yTL), tint],
    ];
    const pos = p.cone.attributes.position.array, col = p.cone.attributes.color.array;
    for (let s = 0; s < p.NS; s++) {
      const st = p.st[s]; st.y = def[s][0]; st.r = def[s][1]; st.on = s < blockedAt;
      const k = st.on ? L : 0;
      for (let q = 0; q <= SEG; q++) {
        const a = (q / SEG) * 6.2832, o3 = (s * (SEG + 1) + q) * 3;
        pos[o3] = OX + Math.cos(a) * st.r; pos[o3 + 1] = st.y; pos[o3 + 2] = Math.sin(a) * st.r;
        col[o3] = def[s][2][0] * k; col[o3 + 1] = def[s][2][1] * k; col[o3 + 2] = def[s][2][2] * k;
      }
    }
    p.cone.attributes.position.needsUpdate = true; p.cone.attributes.color.needsUpdate = true;
    // marginal rays in two planes plus the axis
    const lp = p.lines.attributes.position.array, lc = p.lines.attributes.color.array; let w = 0;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [0, 0]];
    for (let d = 0; d < 5; d++) for (let s = 0; s < p.NS - 1; s++) {
      const a = p.st[s], b = p.st[s + 1], on = b.on ? Math.min(1, L * 1.2) : 0;
      // after the image point the rays have crossed over
      const fa = 1, fb = s === p.NS - 2 && yImg < ySens ? -1 : 1;
      lp[w] = OX + dirs[d][0] * a.r * fa; lp[w + 1] = a.y; lp[w + 2] = dirs[d][1] * a.r * fa;
      lp[w + 3] = OX + dirs[d][0] * b.r * fb; lp[w + 4] = b.y; lp[w + 5] = dirs[d][1] * b.r * fb;
      for (let q = 0; q < 2; q++) { const c = def[s + q][2], k = d === 4 ? on * 0.55 : on; lc[w + q * 3] = c[0] * k; lc[w + q * 3 + 1] = c[1] * k; lc[w + q * 3 + 2] = c[2] * k; }
      w += 6;
    }
    p.lines.attributes.position.needsUpdate = true; p.lines.attributes.color.needsUpdate = true;
    // little packets of light travelling along the rays
    p.phase = (p.phase + dt * 0.22) % 1;
    const pp = p.pts.attributes.position.array, y0 = p.st[0].y, y1 = p.st[p.NS - 1].y;
    for (let n = 0; n < p.NP; n++) {
      const d = dirs[n % 4], u = (p.phase + n / p.NP * 3.0) % 1, y = y0 + (y1 - y0) * u;
      let s = 0; while (s < p.NS - 2 && y > p.st[s + 1].y) s++;
      const a = p.st[s], b = p.st[s + 1], f = (y - a.y) / Math.max(1e-4, b.y - a.y);
      const flip = s === p.NS - 2 && yImg < ySens ? -1 : 1, r = a.r + (b.r * flip - a.r) * f;
      const vis = b.on && L > 0.03;
      pp[n * 3] = OX + d[0] * r; pp[n * 3 + 1] = vis ? y : -999; pp[n * 3 + 2] = d[1] * r;
    }
    p.pts.attributes.position.needsUpdate = true;
    // the spot on the sensor: a point when in focus, a disc when not
    const rs = Math.max(0.045, p.st[p.NS - 1].r), lit = p.st[p.NS - 1].on ? L : 0;
    p.spot.position.set(OX, ySens - 0.02, 0); p.spot.scale.setScalar(rs);
    p.spot.material.opacity = U.clamp((lit * 0.045) / (rs * rs) + 0.12 * lit, 0, 0.95);
    p.spot.material.color.setRGB(tint[0], tint[1], tint[2]);
  }

  /* ---------- 走査: tile plan on the slide and link lines to the picture ---------- */
  let scanV = null;
  const HIDE = ['cover', 'column', 'knob', 'tube', 'tubeLens', 'camera', 'sensor', 'zScrew', 'zMotor'];
  const lx = (px) => OX + (px - C.pat.w / 2) * 0.1, lz = (py) => (py - C.pat.h / 2) * 0.1;
  function makeScan() {
    HIDE.forEach((id) => { M.parts[id].visible = false; }); M.gZ.visible = false;
    const g = new T.Group(), disp = [];
    const pts = [];
    for (let i = 0; i <= TT.nx; i++) pts.push(lx(i * TT.step), 0, lz(0), lx(i * TT.step), 0, lz(C.pat.h));
    for (let j = 0; j <= TT.ny; j++) pts.push(lx(0), 0, lz(j * TT.step), lx(C.pat.w), 0, lz(j * TT.step));
    const gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
    const gm = new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false });
    const grid = new T.LineSegments(gg, gm); grid.renderOrder = 6;
    const pp = [];
    for (let j = 0; j < TT.ny; j++) for (let q = 0; q < TT.nx; q++) { const i = j % 2 ? TT.nx - 1 - q : q; pp.push(lx((i + 0.5) * TT.step), 0.005, lz((j + 0.5) * TT.step)); }
    const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.Float32BufferAttribute(pp, 3));
    const pm = new T.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.9, depthWrite: false });
    const pathLine = new T.Line(pg, pm); pathLine.renderOrder = 7;
    const qg = new T.PlaneGeometry(TT.step * 0.1 * 0.9, TT.step * 0.1 * 0.9); qg.rotateX(-Math.PI / 2);
    const qm = new T.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.38, depthWrite: false });
    const done = new T.InstancedMesh(qg, qm, TT.nx * TT.ny); done.count = 0; done.renderOrder = 6; done.frustumCulled = false;
    g.add(grid, pathLine, done); g.position.y = 14.135; M.gX.add(g);
    // the camera's field of view, fixed on the optical axis
    const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.Float32BufferAttribute([-0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5], 3));
    const fm = new T.LineBasicMaterial({ color: 0xffd23f, depthTest: false, transparent: true });
    const fov = new T.LineLoop(fg, fm); fov.renderOrder = 9; fov.position.set(OX, 14.15, 0); M.root.add(fov);
    disp.push(gg, gm, pg, pm, qg, qm, fg, fm);
    scanV = { g, done, fov, disp, shown: -1, slide: -2 };
  }
  function killScan() {
    if (!scanV) return;
    HIDE.forEach((id) => { M.parts[id].visible = true; }); M.gZ.visible = true;
    M.gX.remove(scanV.g); M.root.remove(scanV.fov); scanV.done.dispose(); scanV.disp.forEach((d) => d.dispose()); scanV = null;
    clearFx();
  }
  const fx = document.querySelector('#fx'), fctx = fx.getContext('2d');
  let fxDirty = false;
  function clearFx() { if (fxDirty) { fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.clearRect(0, 0, fx.width, fx.height); fxDirty = false; } }
  const _d = new T.Object3D(), _v = new T.Vector3(), _a = { x: 0, y: 0 }, _b = { x: 0, y: 0, ok: false };
  function updateScan() {
    const v = scanV, sc = S.scan, n = sc ? sc.tiles.length : 0;
    if (v.shown !== n) {
      for (let k = 0; k < n; k++) { const t = sc.tiles[k]; _d.position.set(lx(t.nx), 0.002, lz(t.ny)); _d.updateMatrix(); v.done.setMatrixAt(k, _d.matrix); }
      v.done.count = n; v.done.instanceMatrix.needsUpdate = true; v.shown = n;
    }
    const f = C.objectives[mech.objective()].fov * 0.1; v.fov.scale.set(f, 1, f);
    v.fov.position.y = 14.15 + M.mv.gY.node.position.y + M.mv.gX.node.position.y;
    v.fov.material.opacity = 0.5 + 0.5 * S.lamp.level;
    // link lines: the spot on the slide and the tile it became
    clearFx();
    const scr = SS.screen;
    if (!scr || !scr.visible() || !n) return;
    const d = SS.dpr; fctx.setTransform(d, 0, 0, d, 0, 0); fxDirty = true;
    const link = (t, alpha, strong) => {
      _v.set(lx(t.nx), 14.14, lz(t.ny)); M.gX.localToWorld(_v); A.toScreen(_v, _a); scr.toPage(t.nx + t.ex, t.ny + t.ey, _b);
      const mx = (_a.x + _b.x) / 2, my = Math.min(_a.y, _b.y) - 50;
      fctx.strokeStyle = 'rgba(34,211,238,' + alpha + ')'; fctx.lineWidth = strong ? 2.5 : 1.3;
      fctx.beginPath(); fctx.moveTo(_a.x, _a.y); fctx.quadraticCurveTo(mx, my, _b.x, _b.y); fctx.stroke();
      fctx.fillStyle = 'rgba(34,211,238,' + alpha + ')';
      fctx.beginPath(); fctx.arc(_a.x, _a.y, strong ? 4.5 : 2.5, 0, 6.2832); fctx.arc(_b.x, _b.y, strong ? 4.5 : 2.5, 0, 6.2832); fctx.fill();
    };
    if (S.busy === 'scan' && sc.phase === 'capture') { for (let k = Math.max(0, n - 6); k < n; k++) link(sc.tiles[k], 0.15 + 0.85 * Math.pow((k - (n - 6)) / 5, 2), k === n - 1); }
    else {
      const c = mech.cam(), i = U.clamp(Math.floor(c.cx / TT.step), 0, TT.nx - 1), j = U.clamp(Math.floor(c.cy / TT.step), 0, TT.ny - 1), t = sc.grid[j * TT.nx + i];
      if (t && c.cx > -1 && c.cx < C.pat.w + 1 && c.cy > -1 && c.cy < C.pat.h + 1) link(t, 0.95, true);
    }
  }

  /* ---------- switching ---------- */
  function enter(name) { if (name === 'path') makePath(); else if (name === 'scan') makeScan(); }
  function leave(name) { if (name === 'path') killPath(); else if (name === 'scan') killScan(); }
  SS.on('view', (name, prev) => { leave(prev); enter(name); });
  enter(S.view);
  const baseLight = { hemi: A.hemi.intensity, sun: A.sun.intensity, env: A.scene.environmentIntensity, cover: M.mats.cover.opacity };
  SS.late.add({
    frame(dt) {
      const e = S.view === 'explode' ? 1 : 0;
      if (M.explode !== e) { M.explode = U.damp(M.explode, e, 5, dt); if (Math.abs(M.explode - e) < 0.002) M.explode = e; }
      const dg = S.view === 'path' ? 1 : 0;
      if (dim !== dg) {
        dim = U.damp(dim, dg, 6, dt); if (Math.abs(dim - dg) < 0.004) dim = dg;
        A.hemi.intensity = U.lerp(baseLight.hemi, 0.13, dim); A.sun.intensity = U.lerp(baseLight.sun, 0.3, dim);
        A.scene.environmentIntensity = U.lerp(baseLight.env, 0.16, dim); M.mats.cover.opacity = U.lerp(baseLight.cover, 0.035, dim);
        A.scene.background.copy(bgA).lerp(bgB, dim); M.shadow.material.opacity = 1 - dim;
        document.body.style.background = dim > 0.5 ? '#131921' : '#dfe6ec';
      }
      if (path) updatePath(dt);
      if (scanV) updateScan();
    },
  });
  SS.provide('views', Vw);
})();
