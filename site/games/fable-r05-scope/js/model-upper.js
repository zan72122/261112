// Microscope model, upper half: revolving nosepiece with 4x/10x/20x/40x objectives, trinocular head,
// two 10x eyepieces, camera port with C-mount adapter and camera, tube lens and beam-splitting prisms.
(function () {
  'use strict';
  const S = window.SCOPE;
  const { M, V, GEO, hex } = S;
  const { AXIS, knurlTube, band, lensGeo, RAD } = S.build;
  const T = M.translation;

  // Plan-achromat style teaching objectives (magnification, numerical aperture, working distance in mm,
  // colour band following the usual magnification colour code).
  const OBJECTIVES = (S.OBJECTIVES = [
    { mag: 4, na: 0.10, wd: 18.5, color: '#d2262b', ringY: -19.8, textY: -15.5,
      prof: [[0, -26], [6, -26], [6, -26.5], [9, -26.5], [9.6, -25.9], [12.6, -20.4], [12.6, -3.4], [0, -3.4]], lens: 6 },
    { mag: 10, na: 0.25, wd: 10.6, color: '#e9c21c', ringY: -22.6, textY: -17.5,
      prof: [[0, -33.9], [4.2, -33.9], [4.2, -34.4], [7, -34.4], [7.6, -33.8], [12.6, -25], [12.6, -3.4], [0, -3.4]], lens: 4.2 },
    { mag: 20, na: 0.40, wd: 1.2, color: '#1e9a50', ringY: -23.8, textY: -18.5,
      prof: [[0, -43.3], [2.7, -43.3], [2.7, -43.8], [5.2, -43.8], [5.8, -43.2], [12.6, -30], [12.6, -3.4], [0, -3.4]], lens: 2.7 },
    { mag: 40, na: 0.65, wd: 0.6, color: '#46a6e4', ringY: -23.8, textY: -18.5,
      prof: [[0, -43.9], [1.7, -43.9], [1.7, -44.4], [4.2, -44.4], [4.7, -43.9], [4.7, -38.6], [6.4, -38.2], [12.6, -31], [12.6, -3.4], [0, -3.4]], lens: 1.7 },
  ]);

  S.modelUpper = function (b) {
    const MAT = b.MAT, P = S.pattern, DIM = S.DIM, ref = {};
    const A = DIM.ALPHA, Ls = DIM.SEAT_R / Math.sin(A), Lsph = Ls - 2.4;
    const C = [0, DIM.Y_OBJ + DIM.PARFOCAL + Ls, 0];

    // ---------- revolving nosepiece ----------
    const nose = b.part('nosepiece', {});
    const nNose = b.node(nose, 'nosepiece', null, M.mul(T(C[0], C[1], C[2]), M.rotX(A)), [0, 22 * Math.sin(A), 22 * Math.cos(A)]);
    b.batch(nose, nNose).add(MAT.anod, GEO.cyl(30, 21, { seg: 56 }).at(0, -99, 0)).add(MAT.anod, GEO.cyl(36, 4, { bevel: 1, seg: 56 }).at(0, -82, 0)).done();
    const nTurret = b.node(nose, 'turret', nNose, null);
    ref.turret = nTurret;
    const tm = Math.asin(50 / Lsph), yRim = -Lsph * Math.cos(tm);
    const dome = [];
    for (let k = 0; k <= 12; k++) { const t = (tm * k) / 12; dome.push([Lsph * Math.sin(t), -Lsph * Math.cos(t)]); }
    const tb = b.batch(nose, nTurret);
    tb.add(MAT.anod, GEO.lathe([...dome, [50, yRim + 9.4], [46.5, yRim + 12.4], [22, yRim + 17.4], [22, yRim + 19.9], [0, yRim + 19.9]], { seg: 72 }));
    tb.add(MAT.knurl, knurlTube(50.6, 44, 9.2, { bevel: 0.7, seg: 72 }).at(0, yRim + 0.1, 0));
    tb.add(MAT.chrome, GEO.cyl(8, 1.3, { bevel: 0.5, seg: 28 }).at(0, -Lsph - 1.0, 0));

    ref.objectives = [];
    OBJECTIVES.forEach((o, k) => {
      const phi = Math.PI / 2 + (k * Math.PI) / 2;
      const dir = [Math.sin(A) * Math.cos(phi), -Math.cos(A), Math.sin(A) * Math.sin(phi)];
      const frame = M.alignY(V.scale(dir, -1), V.scale(dir, Ls), [Math.sin(phi), 0, -Math.cos(phi)]);
      tb.add(MAT.anod, GEO.cyl(14.4, 2.9, { seg: 40 }), frame);     // threaded seat on the turret
      const part = b.part('obj' + k, { xray: 1, objective: k });
      const n = b.node(part, 'objective' + o.mag, nTurret, frame, [0, 0, 22]);
      const ob = b.batch(part, n);
      const len = DIM.PARFOCAL - o.wd;
      ob.add(MAT.brass, GEO.cyl(10, 3.4, { seg: 32 }));
      ob.add(MAT.knurlChrome, knurlTube(14, 0, 3.4, { bevel: 0.5, seg: 56 }).at(0, -3.4, 0));
      ob.add(MAT.chrome, GEO.lathe(o.prof, { seg: 56 }));
      ob.add({ color: hex(o.color), rough: 0.36, coat: 0.3, coatRough: 0.15 }, GEO.tube(12.95, 12, 2.2, { bevel: 0.3, seg: 56 }).at(0, o.ringY, 0));
      ob.add(Object.assign({}, MAT.chrome, { map: b.tex(P.objectiveBand(o.mag, o.na), { repeat: true }), mapMode: 1 }), band(12.63, o.textY, 10, 56));
      ob.add(MAT.lens, lensGeo(o.lens, 0.5, 0.5, 0, 28).at(0, -len + 0.6, 0));
      ob.done();
      ref.objectives.push({ part, node: n, spec: o, len });
    });
    tb.done();

    // ---------- trinocular head ----------
    const P0 = DIM.P0, d = DIM.DIR;
    const along = (t, x) => [P0[0] + d[0] * t + (x || 0), P0[1] + d[1] * t, P0[2] + d[2] * t];
    const tilt = M.rotX(-Math.PI / 6);     // local y -> up the inclined face, local z -> along the eyepiece tubes
    const head = b.part('head', { xray: 1 });
    const nHead = b.node(head, 'head', null, null, [0, 30, 0]);
    const hb = b.batch(head, nHead);
    hb.add(MAT.anod, GEO.tube(34, 22, 8.5, { bevel: 1, seg: 64 }).at(0, 322, 0));
    hb.add(MAT.paint, GEO.sideExtrude([[-50, 330, 10], [46, 330, 10], [46, 384, 12], [-50, 384, 14]], 108, { bevel: 8, bevelSeg: 4, q: 8 }));
    const c58 = along(58), c78 = along(78.6);
    hb.add(MAT.paint, GEO.rbox(112, 46, 40, 8, 6), M.mul(T(c58[0], c58[1], c58[2]), tilt));
    hb.add(MAT.anodSatin, GEO.rbox(104, 38, 1.6, 4), M.mul(T(c78[0], c78[1], c78[2]), tilt));
    ref.eyeFrames = [];
    for (const sx of [-1, 1]) {
      const F = M.alignY(d, along(DIM.T_FACE, sx * DIM.EYE_X), [1, 0, 0]);
      hb.add(MAT.anod, GEO.cyl(17.5, 30, { bevel: 1, seg: 48 }).at(0, -2, 0), F);
      hb.add(MAT.knurl, knurlTube(19.2, 0, 7, { seg: 56 }).at(0, 28, 0), F);
      hb.add(MAT.anod, GEO.tube(18, 15.2, 15, { bevel: 0.6, seg: 48 }).at(0, 35, 0), F);
      ref.eyeFrames.push(F);
    }
    hb.add(MAT.chrome, GEO.cyl(3, 16, { seg: 16 }), M.mul(T(53, 352, -24), AXIS.px));
    hb.add(MAT.knobGrey, GEO.cyl(6.5, 9, { bevel: 2, seg: 24 }), M.mul(T(69, 352, -24), AXIS.px));
    hb.done();

    // tube lens and prisms (inside the head, visible when the shell is ghosted)
    const tl = b.part('tubelens', { inner: true });
    const nTl = b.node(tl, 'tubelens', nHead, T(0, DIM.Y_TUBELENS, 0), [0, 0, 0]);
    b.batch(tl, nTl).add(MAT.lens, lensGeo(13, 1.6, 2.6, 2.6)).add(MAT.anod, GEO.tube(16, 13, 4, { bevel: 0.5, seg: 40 }).at(0, -2, 0)).done();
    const pr = b.part('prism', { inner: true });
    const nPr = b.node(pr, 'prism', nHead, null, [0, 0, 0]);
    const cs = along(DIM.T_SPLIT);
    b.batch(pr, nPr).add(MAT.prism, GEO.rbox(22, 22, 22, 0.6).at(P0[0], P0[1], P0[2])).add(MAT.prism, GEO.rbox(60, 14, 14, 0.5), M.mul(T(cs[0], cs[1], cs[2]), tilt)).done();

    // eyepieces 10x / FN 26.5
    const eye = b.part('eyepiece', {});
    const eyeTextMat = Object.assign({}, MAT.anod, { map: b.tex(P.eyepieceBand(), { repeat: true }), mapMode: 1 });
    ref.eyepieces = [];
    for (const sx of [-1, 1]) {
      const n = b.node(eye, 'eyepiece', nHead, M.alignY(d, along(DIM.T_FACE + 50, sx * DIM.EYE_X), [1, 0, 0]), [0, 30, 0]);
      b.batch(eye, n)
        .add(MAT.chromeSoft, GEO.cyl(15, 16, { seg: 40 }).at(0, -13, 0))
        .add(MAT.anod, GEO.lathe([[15.4, 2], [19.5, 4.2], [19.5, 21], [20.5, 23], [0, 23]], { seg: 56 }))
        .add(eyeTextMat, band(19.56, 8, 9, 56))
        .add(MAT.rubber, GEO.lathe([[19.4, 22], [22.4, 25], [22.8, 36.5], [21.4, 38.8], [17.2, 38.8], [15.6, 36.2], [12.6, 34.6], [0, 34.6]], { seg: 56 }))
        .add(MAT.lens, lensGeo(12.6, 0.8, 0, 3.0, 32).at(0, 35.0, 0)).done();
      ref.eyepieces.push(n);
    }

    // camera port (photo tube + C-mount adapter)
    const port = b.part('camport', { xray: 1 });
    const nPort = b.node(port, 'camport', nHead, T(0, 384, 0), [0, 20, 0]);
    const adapterMat = Object.assign({}, MAT.anod, { map: b.tex(P.adapterBand(), { repeat: true }), mapMode: 1 });
    b.batch(port, nPort)
      .add(MAT.paint, GEO.cyl(25, 5, { bevel: 1.2, seg: 56 })).add(MAT.paint, GEO.cyl(21, 24, { seg: 56 }).at(0, 4, 0))
      .add(MAT.knurl, knurlTube(23.5, 0, 8, { seg: 64 }).at(0, 28, 0)).add(MAT.knurl, knurlTube(3.4, 0, 9, { seg: 18, bevel: 0.5 }), M.mul(T(22, 32, 0), AXIS.px))
      .add(MAT.anod, GEO.lathe([[0, 36], [20, 36], [20, 44], [16.2, 60], [16.2, 66], [0, 66]], { seg: 56 })).add(adapterMat, band(20.05, 37, 6, 56))
      .add(MAT.chromeSoft, GEO.cyl(17, 3, { bevel: 0.5, seg: 48 }).at(0, 66, 0)).done();

    // camera
    const cam = b.part('camera', { xray: 1 });
    const nCam = b.node(cam, 'camera', nPort, T(0, 69, 0), [0, 30, 0]);
    const kb = b.batch(cam, nCam);
    kb.add(MAT.camBody, GEO.rbox(54, 40, 54, 5).at(0, 20, 0));
    for (let k = 0; k < 5; k++) kb.add(MAT.camBody, GEO.rbox(58, 2.2, 44, 0.8).at(0, 8 + k * 6, 0));
    kb.add(MAT.led, GEO.sphere(1.3, { seg: 12, rings: 8 }).at(17, 33, 27.1));
    // cable leaves the back of the camera and drapes down behind the arm to the table
    kb.add(MAT.plasticGrey, GEO.rbox(14, 9, 7, 1).at(0, 22, -29.5)).add(MAT.rubber, GEO.cyl(3.6, 9, { seg: 16 }), M.mul(T(0, 22, -32), AXIS.nz));
    const y0 = 384 + 69;
    const cable = [[0, 475, -40], [0, 475, -58], [3, 462, -100], [10, 410, -176], [20, 320, -234], [28, 170, -262], [34, 50, -296], [58, 2.6, -332], [140, 2.6, -398], [300, 2.6, -470]];
    kb.add(MAT.rubber, GEO.pipe(cable.map((p) => [p[0], p[1] - y0, p[2]]), 2.3, { seg: 10 }));
    kb.done();

    ref.C = C; ref.Ls = Ls; ref.head = nHead; ref.along = along;
    return ref;
  };

  // ---------- assemble ----------
  S.buildModel = function (R) {
    const b = new S.Builder(R);
    const lo = S.modelLower(b), up = S.modelUpper(b);
    for (const id in b.parts) Object.assign(b.parts[id], S.LABELS[id.startsWith('obj') ? 'objective' : id] || {});
    b.root.update(true);
    return { root: b.root, items: b.items, parts: b.parts, nodes: b.nodes, MAT: b.MAT, ref: Object.assign({}, lo, up) };
  };
})();
