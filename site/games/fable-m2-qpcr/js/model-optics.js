// 光学ヘッドと XY スキャン機構。
// ヘッド: 励起 LED →（フィルターホイール内の励起フィルタ・ダイクロイック）→ 対物レンズ → ウェル
//         → 対物レンズ →（蛍光フィルタ）→ 結像レンズ → 検出器。ホイールは 遮光＋4 色 の 5 ポジション。
(function () {
  'use strict';
  const B = QP.build;
  const D = QP.D;
  const M = QP.mat;

  const BEAM_DZ = -4.2; // 光軸から見た梁の位置
  const WHEEL_DZ = 2.2; // 光軸から見たホイール軸の位置（= フィルタ円の半径）

  QP.model.optics = function (root) {
    const out = { wheelStep: (Math.PI * 2) / 5 };
    const yg = D.yGantry;
    const rx = D.railX;
    const z0 = 0.6;
    const z1 = 17.2;

    // ---- 固定側: Y レールとブラケット ---------------------------------------
    const gantry = B.part('gantry', 'XYスキャン機構', [0, 1, 0], 0);
    root.add(gantry);
    const gb = new B.Batch();
    for (const sx of [-1, 1]) {
      gb.add(M.steel, B.cyl(0.4, z1 - z0, 14), sx * rx, yg, (z0 + z1) / 2, Math.PI / 2);
      for (const z of [z0, z1]) gb.add(M.alu, B.rbox(4.6, 1.5, 1.4, 0.12), sx * (rx + 1.35), yg, z);
      gb.add(M.belt, B.box(0.12, 0.5, z1 - z0 - 2), sx * (rx + 1.0), yg + 1.0, (z0 + z1) / 2);
    }
    gb.add(M.plastic, B.rbox(2.4, 2.4, 2.4, 0.15), -rx - 1.0, yg + 1.2, z0 - 0.4); // Y モーター
    gb.add(M.alu, B.cyl(0.55, 0.5, 12), -rx - 1.0, yg + 1.2, z0 + 1.0, Math.PI / 2);
    gb.into(gantry);

    // ---- X 梁（Z 方向に動く） -----------------------------------------------
    const beam = new THREE.Group();
    beam.name = 'beamMech';
    root.add(beam);
    out.beam = beam;
    out.beamDz = BEAM_DZ;
    const xbeam = B.part('xbeam', 'スキャン梁（X軸）', [0, 1, 0], 0);
    beam.add(xbeam);
    const bb = new B.Batch();
    bb.add(M.alu, B.rbox(rx * 2 + 1.6, 1.8, 1.6, 0.1), 0, yg, 0);
    bb.add(M.steel, B.box(rx * 2 - 3, 0.55, 0.3), 0, yg + 0.2, 0.9);
    bb.add(M.belt, B.box(rx * 2 - 2, 0.12, 0.5), 0, yg + 1.0, 0.2);
    for (const sx of [-1, 1]) bb.add(M.aluBlack, B.rbox(2.3, 1.7, 2.6, 0.12), sx * rx, yg - 0.05, 0);
    bb.add(M.plastic, B.rbox(2.4, 2.4, 2.4, 0.15), rx - 2.4, yg + 2.1, -0.1); // X モーター
    bb.add(M.alu, B.cyl(0.55, 0.4, 12), rx - 2.4, yg + 1.0, -0.1);
    bb.into(xbeam);

    // ---- ヘッド（X 方向に動く）。原点は光軸上 ---------------------------------
    const head = new THREE.Group();
    head.name = 'headMech';
    head.position.z = -BEAM_DZ;
    beam.add(head);
    out.head = head;

    const body = B.part('head', '光学ヘッド', [0, 0, -1], 0);
    head.add(body);
    const hb = new B.Batch();
    const yb0 = D.yHead;
    const yb1 = 29.1;
    hb.add(M.aluBlack, B.rbox(6, yb1 - yb0, 4.8, 0.18), 0, (yb0 + yb1) / 2, -0.6);
    hb.add(M.alu, B.box(5.2, 8.4, 0.42), 0, 27.1, -3.2); // 背板（梁のスライダへ）
    hb.add(M.aluBlack, B.rbox(4.4, 2.4, 0.5, 0.08), 0, yg + 0.1, -3.0);
    // 側面の放熱スリット
    for (let k = 0; k < 4; k++) hb.add(M.plastic, B.box(0.06, 0.22, 3.2), 3.01, 26.4 + k * 0.6, -0.6);
    hb.into(body);

    // 対物レンズ
    const obj = B.part('objective', '対物レンズ', [0, -1, 0], 0.9);
    head.add(obj);
    const ob = new B.Batch();
    ob.add(M.aluBlue, B.cyl(1.15, 1.05, 28), 0, yb0 - 0.52, 0);
    ob.add(M.aluBlack, B.cone(0.82, 1.15, 0.36, 28), 0, D.yObj + 0.18, 0);
    ob.add(M.steel, B.cyl(1.18, 0.12, 28), 0, yb0 - 0.3, 0);
    ob.into(obj);
    const lensGeo = new THREE.SphereGeometry(0.9, 20, 8, 0, Math.PI * 2, Math.PI * 0.72, Math.PI * 0.28);
    const lens = new THREE.Mesh(lensGeo, M.lens);
    lens.position.set(0, D.yObj + 0.78, 0);
    obj.add(lens);

    // 励起 LED モジュール（左側面）
    const led = B.part('led', '励起LED', [-1, 0, 0], 1.6);
    head.add(led);
    const yl = 24.2;
    const lb2 = new B.Batch();
    lb2.add(M.aluBlack, B.cyl(0.95, 1.5, 22), -4.15, yl, 0, 0, 0, Math.PI / 2);
    for (let k = 0; k < 4; k++) lb2.add(M.aluBlack, B.cyl(1.12, 0.12, 22), -3.7 - k * 0.32, yl, 0, 0, 0, Math.PI / 2);
    lb2.add(M.aluRed, B.cyl(1.0, 0.16, 22), -3.36, yl, 0, 0, 0, Math.PI / 2);
    lb2.add(M.plastic, B.cyl(0.4, 0.25, 12), -5.0, yl, 0, 0, 0, Math.PI / 2);
    lb2.into(led);
    out.ledMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const emitter = new THREE.Mesh(B.cyl(0.66, 0.3, 20).rotateZ(Math.PI / 2), out.ledMat);
    emitter.position.set(-3.14, yl, 0);
    led.add(emitter);
    out.ledY = yl;

    // フィルターホイール（5 ポジション）
    const wheel = B.part('wheel', 'フィルターホイール', [0, 0, 1], 2.4);
    head.add(wheel);
    const rotor = new THREE.Group();
    rotor.position.set(0, yl, WHEEL_DZ);
    wheel.add(rotor);
    out.wheelRotor = rotor;
    const wb = new B.Batch();
    const wr = 3.4;
    const wt = 1.3;
    const disc = new THREE.Shape();
    disc.absarc(0, 0, wr, 0, Math.PI * 2, false);
    out.filterMats = [];
    for (let k = 0; k < 5; k++) {
      const a = k * out.wheelStep;
      const fxp = Math.sin(a) * WHEEL_DZ;
      const fzp = -Math.cos(a) * WHEEL_DZ;
      disc.holes.push(B.circleHole(fxp, -fzp, 0.86));
      const ch = QP.CHANNELS[k];
      if (k === 0) {
        wb.add(M.rubber, B.cyl(0.86, wt * 0.9, 18), fxp, 0, fzp); // 遮光プラグ
      } else {
        const em = M.filterGlass(ch.em);
        const ex = M.filterGlass(ch.ex);
        out.filterMats[k] = { em, ex };
        wb.add(em, B.cyl(0.84, 0.3, 18), fxp, wt / 2 - 0.2, fzp);
        wb.add(ex, B.cyl(0.84, 0.3, 18), fxp, -wt / 2 + 0.2, fzp);
        // 縁の色窓（どの色のポジションか外から分かる）
        wb.add(em, B.box(0.9, 0.5, 0.12), Math.sin(a) * (wr + 0.01), 0, -Math.cos(a) * (wr + 0.01), 0, -a, 0);
      }
    }
    wb.add(M.aluBlack, B.extrudeY(disc, wt, { seg: 18 }), 0, -wt / 2, 0);
    wb.add(M.steel, B.cyl(0.5, wt + 0.5, 14), 0, 0, 0);
    wb.into(rotor);
    // ホイール用モーター（固定側）
    const wm = new B.Batch();
    wm.add(M.plastic, B.cyl(0.95, 1.9, 18), 0, yl + wt / 2 + 1.2, WHEEL_DZ);
    wm.add(M.alu, B.cyl(1.05, 0.2, 18), 0, yl + wt / 2 + 0.3, WHEEL_DZ);
    wm.into(wheel);

    // 検出器（結像レンズ＋カメラ）
    const det = B.part('detector', '検出器（カメラ）', [0, 1, 0], 1.8);
    head.add(det);
    const db = new B.Batch();
    db.add(M.aluBlue, B.cyl(0.95, 0.5, 22), 0, yb1 + 0.25, 0);
    db.add(M.aluBlack, B.cyl(0.85, 0.7, 22), 0, yb1 + 0.8, 0);
    db.add(M.aluBlack, B.rbox(3.2, 2.5, 3.2, 0.2), 0, yb1 + 2.35, 0);
    for (let k = 0; k < 5; k++) db.add(M.aluBlack, B.box(2.6, 0.35, 0.14), 0, yb1 + 3.75, -1.1 + k * 0.55);
    db.add(M.plastic, B.box(1.6, 0.7, 0.5), 0, yb1 + 2.0, -1.8);
    db.into(det);
    out.detTop = yb1 + 3.6;

    out.wheelDz = WHEEL_DZ;
    return out;
  };
})();
