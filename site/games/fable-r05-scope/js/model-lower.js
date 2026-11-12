// Microscope model, lower half: floor, base with illuminator, field diaphragm, arm, focus knobs,
// mechanical stage with slide, Abbe condenser with aperture diaphragm. All sizes in millimetres.
//
// Reference dimensions (generic BX-class upright frame, not a copy of a specific product):
//   base 194 x 323 mm, 51 mm high      overall height with camera ~500 mm
//   stage top 190 mm above the table   stage plate 176 x 146 mm, slide 76 x 26 x 1.1 mm
//   parfocal distance 45 mm            nosepiece tilt 15 deg, 4 positions on a 34 mm radius
//   eyepiece tubes inclined 30 deg, 60 mm apart, field number 26.5
(function () {
  'use strict';
  const S = window.SCOPE;
  const { M, GEO } = S;
  const { AXIS, knurlTube, band, lensGeo, buildIris, RAD } = S.build;
  const T = M.translation;

  const DIM = (S.DIM = {
    Y_STAGE: 190, Y_OBJ: 191.2, PARFOCAL: 45, ALPHA: 15 * RAD, SEAT_R: 34,
    Y_BASE_AXIS: 38, Z_LAMP: -246, Z_COLL: -160, Y_FD: 76, Y_AD: 142.6, Y_COND_LENS: 152, Y_COND_TOP: 188.7,
    Y_TUBELENS: 337, P0: [0, 356, 0], DIR: [0, 0.5, Math.sqrt(3) / 2], T_SPLIT: 30, T_FACE: 78, EYE_X: 30, Y_SENSOR: 463,
    FD_R0: 20.5, AD_R0: 16,
  });

  S.modelLower = function (b) {
    const MAT = b.MAT, P = S.pattern, ref = {};

    // ---------- studio floor ----------
    b.batch(null, b.root).add(MAT.floor, GEO.disc(4500, 0, 72)).done();

    // ---------- base ----------
    const base = b.part('base', { xray: 1 });
    const nBase = b.node(base, 'base', null, null, [0, 0, 26]);
    const bb = b.batch(base, nBase);
    bb.add(MAT.paint, GEO.slab([[-97, -218, 16], [97, -218, 16], [97, 105, 48], [-97, 105, 48]], 7, 51, { bevelFront: 7, bevelBack: 1.5, bevelSeg: 4, q: 10 }));
    bb.add(MAT.plasticGrey, GEO.slab([[-93, -214, 13], [93, -214, 13], [93, 101, 45], [-93, 101, 45]], 3.2, 5, {}));
    for (const [x, z] of [[-78, -196], [78, -196], [-66, 70], [66, 70]]) bb.add(MAT.rubber, GEO.cyl(11, 4.2, { bevel: 1, seg: 28 }).at(x, 0, z));
    bb.add(MAT.paintDark, GEO.tube(47, 36, 1.4, { bevel: 0.5, seg: 64 }).at(0, 57.6, 0));
    const badgeMat = { color: [1, 1, 1], map: b.tex(P.badge()), mapMode: 2, rough: 0.38, metal: 0.3, keep: true };
    bb.add(badgeMat, GEO.plane(58, 11), M.mul(T(0, 31, 105.25), M.rotX(Math.PI / 2)));
    // brightness dial + power rocker + pilot LED on the right flank
    bb.add(MAT.knurl, knurlTube(13, 0, 7, { seg: 40 }), M.mul(T(96.5, 30, 34), AXIS.px));
    const dialMat = { color: [1, 1, 1], map: b.tex(P.dial()), mapMode: 2, rough: 0.5, keep: true };
    bb.add(dialMat, GEO.disc(11.5, 0, 32), M.mul(T(103.62, 30, 34), AXIS.px));
    bb.add(MAT.plasticGrey, GEO.rbox(5, 22, 13, 1.6).at(97.6, 30, -30));
    bb.add(MAT.knobGrey, GEO.rbox(4, 16, 9, 1.4), M.mul(T(100.6, 30.5, -30), M.rotZ(0.14)));
    bb.add(MAT.led, GEO.sphere(1.7, { seg: 12, rings: 8 }).at(97.4, 30, -52));
    bb.done();

    // ---------- lamp housing (rear) with the LED emitter ----------
    const lamp = b.part('lamp', { xray: 1 });
    const nLamp = b.node(lamp, 'lamp', null, M.mul(T(0, DIM.Y_BASE_AXIS, -216), AXIS.nz), [0, 28, 0]);
    const lb = b.batch(lamp, nLamp);
    lb.add(MAT.anod, GEO.cyl(27, 6, { seg: 48 }));
    lb.add(MAT.blackTex, GEO.cyl(31, 46, { bevel: 3, seg: 56 }).at(0, 5, 0));
    for (let k = 0; k < 6; k++) lb.add(MAT.anod, GEO.tube(34.5, 30, 2.6, { bevel: 0.8, seg: 56 }).at(0, 11 + k * 6.6, 0));
    lb.add(MAT.anod, GEO.cyl(27, 6, { bevel: 1.5, seg: 48 }).at(0, 51, 0));
    lb.add(MAT.rubber, GEO.cyl(5.5, 9, { bevel: 1, seg: 20 }).at(0, 57, 0));
    // power cable (world path converted into the housing frame: local = (x, -(z + 216), y - 38))
    const cable = [[0, 38, -281], [0, 35, -300], [-4, 15, -318], [-20, 2.9, -336], [-70, 2.9, -372], [-170, 2.9, -396], [-330, 2.9, -380]];
    lb.add(MAT.rubber, GEO.pipe(cable.map((p) => [p[0], -(p[2] + 216), p[1] - 38]), 2.7, { seg: 10 }));
    // emitter + reflector (seen in the beginner mode through the ghosted shell)
    lb.add(MAT.lampCore, GEO.sphere(4.2, { seg: 20, rings: 12 }).at(0, 30, 0));
    lb.add(MAT.mirror, GEO.lathe([[6, 37], [20, 27], [21.2, 27.4], [7, 38.6], [6, 37]], { seg: 40 }));
    lb.done();

    // ---------- collector lens + folding mirror inside the base ----------
    const coll = b.part('collector', { inner: true });
    const nColl = b.node(coll, 'collector', null, M.mul(T(0, DIM.Y_BASE_AXIS, DIM.Z_COLL), AXIS.pz), [0, 0, -12]);
    b.batch(coll, nColl).add(MAT.lens, lensGeo(15, 2, 3.6, 3.6)).add(MAT.anod, GEO.tube(18, 15, 5, { bevel: 0.6, seg: 48 }).at(0, -2.5, 0)).done();
    const mir = b.part('mirror', { inner: true });
    const nMir = b.node(mir, 'mirror', null, M.mul(T(0, DIM.Y_BASE_AXIS, 0), M.rotX(-Math.PI / 4)), [0, -10, 0]);
    b.batch(mir, nMir).add(MAT.mirror, GEO.rbox(40, 2.4, 50, 0.6)).add(MAT.anod, GEO.rbox(34, 6, 40, 1).at(0, -4.3, 0)).done();

    // ---------- field diaphragm on the light exit ----------
    const field = b.part('field', { xray: 1 });
    const nField = b.node(field, 'field', null, T(0, 58, 0), [0, 24, 0]);
    const fb = b.batch(field, nField);
    fb.add(MAT.paint, GEO.tube(37, 21.5, 9, { bevel: 1.5, seg: 64 }));
    fb.add(MAT.anod, GEO.lathe([[22.2, 20], [38, 20], [38, 22.5], [35.5, 25], [25, 25], [22.2, 23.2], [22.2, 20]], { seg: 64 }));
    fb.add(MAT.window, lensGeo(22.2, 1.2, 0, 2.4).at(0, 22.2, 0));
    fb.add(MAT.blackTex, GEO.tube(21.8, 21.0, 19, { seg: 48 }).at(0, 1.5, 0));
    fb.add(MAT.lampGlow, GEO.disc(21, 0, 40).at(0, 1.2, 0));
    fb.done();
    const nFieldRing = b.node(field, 'fieldRing', nField, T(0, 9, 0));
    b.batch(field, nFieldRing).add(MAT.knurl, knurlTube(40, 21.8, 11, { bevel: 1 })).add(MAT.white, GEO.rbox(1.6, 5, 1.4, 0.3).at(0, 5.5, 40.1)).done();
    ref.fieldRing = nFieldRing;
    ref.fieldIris = buildIris(b, field, nField, DIM.Y_FD - 58, DIM.FD_R0, 17, 10);

    // ---------- arm ----------
    const arm = b.part('arm', { xray: 1 });
    const nArm = b.node(arm, 'arm', null, null, [0, 0, -24]);
    const ab = b.batch(arm, nArm);
    ab.add(MAT.paint, GEO.sideExtrude([[-102, 50, 0], [-102, 280, 26], [62, 280, 9], [66, 322, 16], [-212, 322, 80], [-212, 50, 0]], 104, { bevel: 6, bevelSeg: 4, q: 10 }));
    for (const sx of [-1, 1]) {
      ab.add(MAT.paintDark, GEO.sideExtrude([[-196, 128, 14], [-118, 128, 14], [-118, 292, 14], [-196, 292, 14]], 1.4, { bevel: 0.5, bevelSeg: 2 }).at(sx * 52.5, 0, 0));
      ab.add(MAT.paint, GEO.cyl(34, 7, { bevel: 2, seg: 56 }), M.mul(T(sx * 51.5, 96, -157), sx > 0 ? AXIS.px : AXIS.nx));
    }
    ab.add(MAT.knurl, knurlTube(5.5, 0, 12, { seg: 24, bevel: 0.8 }), M.mul(T(51, 311, 8), AXIS.px));
    ab.add(MAT.anodSatin, GEO.rbox(40, 126, 5, 1.5).at(0, 150, -100.5));
    ab.done();

    // ---------- coarse / fine focus knobs (coaxial, both sides) ----------
    const coarse = b.part('coarse', {}), fine = b.part('fine', {});
    const ticksMat = Object.assign({}, MAT.anod, { map: b.tex(P.ticksBand(1024, 64, 100, '#e6e7ea'), { repeat: true }), mapMode: 1 });
    ref.coarse = []; ref.fine = [];
    for (const sx of [-1, 1]) {
      const ax = sx > 0 ? AXIS.px : AXIS.nx;
      const nC = b.node(coarse, 'coarse', null, M.mul(T(sx * 58.5, 96, -157), ax), [0, 24, 0]);
      b.batch(coarse, nC).add(MAT.knobGrey, GEO.fluted(27, 20, 44, 1.2, { bevel: 1.6 })).add(MAT.anodSatin, GEO.cyl(22, 0.8, { seg: 40 }).at(0, 19.6, 0)).done();
      const nF = b.node(fine, 'fine', null, M.mul(T(sx * 78.5, 96, -157), ax), [0, 42, 0]);
      b.batch(fine, nF).add(ticksMat, band(17, 0.4, 4.6)).add(MAT.anod, GEO.cyl(16.9, 5.4, { seg: 48 }))
        .add(MAT.knurl, knurlTube(15.2, 0, 13, { bevel: 0.8 }).at(0, 5, 0)).add(MAT.chromeSoft, GEO.cyl(9.5, 1.6, { bevel: 0.6, seg: 32 }).at(0, 18, 0)).done();
      nC.sign = sx; nF.sign = sx;
      ref.coarse.push(nC); ref.fine.push(nF);
    }

    // ---------- everything that rides on the focus drive ----------
    const nStageG = b.node(null, 'stageGroup', null, null);
    ref.stageGroup = nStageG;

    // stage
    const stage = b.part('stage', {});
    const nStage = b.node(stage, 'stage', nStageG, null, [0, 0, 34]);
    const sb = b.batch(stage, nStage);
    sb.add(MAT.anod, GEO.rbox(62, 78, 16, 2).at(0, 143, -94));
    for (const sx of [-1, 1]) sb.add(MAT.anod, GEO.rbox(12, 12, 80, 2).at(sx * 50, 170, -46));
    sb.add(MAT.anod, GEO.rbox(112, 10, 12, 2).at(0, 171, -80));
    sb.add(MAT.stageTop, GEO.slab([[-88, -72, 6], [88, -72, 6], [88, 74, 6], [-88, 74, 6]], 176, 14, { bevel: 1.4, bevelSeg: 2, holes: [{ circle: [0, 0, 15], n: 48 }] }));
    sb.add(MAT.steel, GEO.tube(18.5, 15.1, 0.5, { seg: 48 }).at(0, 189.56, 0));
    sb.add(MAT.anod, GEO.rbox(150, 7, 16, 1.4).at(-5, 193.5, -52));
    const scaleMat = Object.assign({}, MAT.anodSatin, { map: b.tex(P.scaleStrip(100, '#e8e9ec')), mapMode: 1 });
    sb.add(scaleMat, GEO.plane(100, 6).at(-10, 197.06, -52));
    // slide holder: rear bar, bridge to the rail, fixed jaw, sprung finger
    sb.add(MAT.chromeSoft, GEO.rbox(118, 2.2, 7.7, 0.6).at(-8, 191.2, -17.15));
    sb.add(MAT.chromeSoft, GEO.rbox(26, 2.2, 28, 0.6).at(-50, 191.25, -31));
    sb.add(MAT.chromeSoft, GEO.rbox(7, 2.2, 22, 0.6).at(41.9, 191.2, -6.5));
    const seg = (p, q) => {
      const dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz);
      sb.add(MAT.chromeSoft, GEO.rbox(len + 4, 2.0, 4.4, 0.6), M.mul(T((p[0] + q[0]) / 2, 191.15, (p[1] + q[1]) / 2), M.rotY(-Math.atan2(dz, dx))));
    };
    seg([-60, -18], [-50, -3]); seg([-50, -3], [-40.6, 3.5]);
    sb.add(MAT.chrome, GEO.cyl(3.4, 3.2, { bevel: 0.6, seg: 20 }).at(-60, 190.1, -18));
    sb.add(MAT.chrome, GEO.cyl(2.6, 2.4, { bevel: 0.4, seg: 16 }).at(-40.6, 190.1, 3.5));
    sb.done();

    // coaxial X/Y stage drive hanging below the right rear corner
    const sk = b.part('stageKnob', {});
    const nSk = b.node(sk, 'stageKnob', nStage, T(80, 0, -52), [22, 0, 0]);
    b.batch(sk, nSk).add(MAT.anod, GEO.cyl(10, 26, { bevel: 1.5, seg: 32 }).at(0, 150, 0)).add(MAT.steel, GEO.cyl(4.5, 48, { seg: 20 }).at(0, 104, 0))
      .add(MAT.knurl, knurlTube(15, 0, 20, { seg: 48 }).at(0, 128, 0)).add(MAT.knurl, knurlTube(11.5, 0, 18, { seg: 40 }).at(0, 108, 0))
      .add(MAT.chromeSoft, GEO.cyl(6.5, 3, { bevel: 1, seg: 24 }).at(0, 102.5, 0)).done();

    // glass slide with the printed test pattern
    const slide = b.part('slide', {});
    const nSlide = b.node(slide, 'slide', nStage, null, [0, 0, 30]);
    const slideMat = { type: 'decal', color: [1, 1, 1], map: b.tex(P.slideCanvas()), mapMode: 3, rough: 0.35 };
    b.batch(slide, nSlide).add(MAT.slideGlass, GEO.rbox(76, 1.1, 26, 0.18).at(0, 190.65, 0)).add(slideMat, GEO.plane(76, 26).at(0, 191.23, 0)).done();

    // Abbe condenser in its substage holder
    const cond = b.part('condenser', { xray: 1 });
    const nCond = b.node(cond, 'condenser', nStageG, null, [0, -20, 0]);
    const cb = b.batch(cond, nCond);
    cb.add(MAT.anod, GEO.rbox(40, 60, 8, 1.5).at(0, 140, -82));
    cb.add(MAT.anod, GEO.rbox(30, 9, 50, 2).at(0, 152, -53));
    cb.add(MAT.anod, GEO.tube(32, 25.6, 12, { bevel: 1.2, seg: 64 }).at(0, 146, 0));
    for (const a of [-40 * RAD, 40 * RAD]) cb.add(MAT.knurlChrome, knurlTube(3.6, 0, 12, { seg: 20, bevel: 0.5 }), M.alignY([Math.sin(a), 0, Math.cos(a)], [31 * Math.sin(a), 152, 31 * Math.cos(a)]));
    cb.add(MAT.knurl, knurlTube(4.6, 0, 14, { seg: 20, bevel: 0.6 }), M.alignY([1, 0, 0], [31, 152, 0], [0, 0, 1]));
    cb.add(MAT.knurl, knurlTube(9, 0, 10, { seg: 32 }), M.mul(T(-20, 128, -82), AXIS.nx));
    cb.add(MAT.anod, GEO.lathe([[17.5, 148], [25.4, 148], [25.4, 170], [23.6, 173], [14.2, 185.4], [14.2, 187.6], [10.9, 187.6], [10.9, 186.9], [0, 186.9]], { seg: 64 }));
    const condTextMat = Object.assign({}, MAT.anod, { map: b.tex(P.condenserBand(), { repeat: true }), mapMode: 1 });
    cb.add(condTextMat, band(25.47, 160, 9.5));
    cb.add(MAT.lensGreen, lensGeo(10.9, 1.7, 0, 0).at(0, 187.85, 0));
    cb.done();

    // aperture diaphragm (ring + iris) under the condenser
    const ap = b.part('aperture', { xray: 1 });
    const nAp = b.node(ap, 'aperture', nCond, T(0, 138, 0), [0, -15, 0]);
    b.batch(ap, nAp).add(MAT.lens, lensGeo(17.4, 1.2, 1.8, 0).at(0, 2.2, 0)).add(MAT.blackTex, GEO.tube(17.8, 17.2, 7, { seg: 40 }).at(0, 2.5, 0)).done();
    const nApRing = b.node(ap, 'apertureRing', nAp, null);
    const la = 30 * RAD, ld = [Math.sin(la), 0, Math.cos(la)];
    b.batch(ap, nApRing).add(MAT.knurl, knurlTube(28, 17.6, 10, { bevel: 0.8 }))
      .add(MAT.chrome, GEO.cyl(1.8, 12, { seg: 14 }), M.alignY(ld, [27 * ld[0], 5, 27 * ld[2]]))
      .add(MAT.knobGrey, GEO.sphere(3.1, { seg: 16, rings: 10 }).at(39.5 * ld[0], 5, 39.5 * ld[2])).done();
    ref.apertureRing = nApRing;
    ref.apertureIris = buildIris(b, ap, nAp, DIM.Y_AD - 138, DIM.AD_R0, 9, 10);

    return ref;
  };
})();
