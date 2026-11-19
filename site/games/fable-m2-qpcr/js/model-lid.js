// 加熱リッドと昇降機構。4 本のガイド柱＋左右の送りねじでキャリアを下ろし、
// ばねを介してリッド板をシール済みプレートへ押し付ける。
(function () {
  'use strict';
  const B = QP.build;
  const D = QP.D;
  const M = QP.mat;

  QP.model.lid = function (root) {
    const out = {};
    const cz = D.cz;
    const cx = D.lidColX;
    const yTopBar = 25.5;

    // ---- 固定側: ガイド柱、上部バー、昇降モーター ----------------------------
    const lift = B.part('lift', 'リッド昇降機構', [0, 1, 0], 0);
    root.add(lift);
    const lb = new B.Batch();
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) lb.add(M.steel, B.cyl(0.45, yTopBar - 2.6, 14), sx * cx, (yTopBar + 2.6) / 2, cz + sz * D.lidColZ);
      lb.add(M.alu, B.rbox(1.7, 1.0, 10.6, 0.12), sx * cx, yTopBar + 0.5, cz);
      lb.add(M.plastic, B.rbox(2.2, 2.2, 2.2, 0.15), sx * cx, yTopBar + 2.1, cz);
      lb.add(M.alu, B.box(2.2, 0.25, 2.2), sx * cx, yTopBar + 1.1, cz);
    }
    lb.into(lift);
    // 送りねじ（回転が見えるよう縞模様）
    out.screws = [];
    for (const sx of [-1, 1]) {
      const s = new THREE.Mesh(B.cyl(0.3, yTopBar - 15.2, 12), M.thread);
      s.position.set(sx * cx, (yTopBar + 15.2) / 2, cz);
      s.castShadow = true;
      lift.add(s);
      out.screws.push(s);
    }

    // ---- 可動側: キャリアとリッド板 -----------------------------------------
    const mech = new THREE.Group(); // position.y をシミュレーションが動かす（0 = 押さえ込み位置）
    mech.name = 'lidMech';
    root.add(mech);
    out.mech = mech;
    const lid = B.part('lid', '加熱リッド', [0, 1, 0], 2.2);
    mech.add(lid);

    const yLid = D.yLidDown; // リッド下面（押さえ込み時）
    const yLidTop = yLid + D.lidT;
    const gap = 0.5; // ばねの自由長
    const yCar = yLidTop + gap; // キャリア下面

    const carrier = new THREE.Group();
    lid.add(carrier);
    out.carrier = carrier;
    const cb = new B.Batch();
    for (const sx of [-1, 1]) {
      cb.add(M.alu, B.rbox(1.7, 1.4, 10.8, 0.15), sx * cx, yCar + 0.7, cz);
      for (const sz of [-1, 1]) cb.add(M.brass, B.cyl(0.62, 1.9, 14), sx * cx, yCar + 0.7, cz + sz * D.lidColZ);
      cb.add(M.brass, B.cyl(0.55, 1.7, 12), sx * cx, yCar + 0.7, cz);
    }
    for (const sz of [-1, 1]) cb.add(M.alu, B.rbox(cx * 2 - 1.7, 1.0, 1.0, 0.12), 0, yCar + 0.5, cz + sz * 5.25);
    cb.into(carrier);

    // リッド板（キャリアに対して上下にわずかに逃げる）
    const plate = new THREE.Group();
    lid.add(plate);
    out.plate = plate;
    out.matLid = M.clone(M.aluLid);
    const pb = new B.Batch();
    pb.add(M.silicone, B.holedPlate(12.9, 8.7, 0.3, 0.33, 0.09, 8), 0, yLid, cz);
    pb.add(out.matLid, B.holedPlate(14.2, 10.0, 0.45, 0.3, D.lidT - 0.09, 10), 0, yLid + 0.09, cz);
    pb.add(M.heater, B.holedPlate(13.2, 8.9, 0.3, 0.36, 0.04, 8), 0, yLidTop, cz);
    // ヒーターのリード
    pb.add(M.wireRed, B.cyl(0.09, 2.2, 6), 5.6, yLidTop + 0.1, cz - 5.6, Math.PI / 2);
    pb.add(M.wireBlack, B.cyl(0.09, 2.2, 6), 6.0, yLidTop + 0.1, cz - 5.6, Math.PI / 2);
    pb.into(plate);

    // ばね（縮みは scale.y で表現）
    const springs = new THREE.Group();
    springs.position.y = yLidTop;
    plate.add(springs);
    const sb = new B.Batch();
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) sb.add(M.steel, B.cyl(0.34, gap, 10).translate(0, gap / 2, 0), sx * 5.6, 0, cz + sz * 4.85);
    sb.into(springs, { cast: false });
    out.springs = springs;
    out.springGap = gap;

    // リッド下面の曇り（未シール時に白くなる）
    out.fogMat = new THREE.MeshBasicMaterial({ color: 0xdfe8ee, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    const fog = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 9.4).rotateX(-Math.PI / 2), out.fogMat);
    fog.position.set(0, yLid - 0.015, cz);
    fog.visible = false;
    plate.add(fog);
    out.fog = fog;
    // 上面側の曇り（穴から上がった湯気がヒーター面で白く見える）
    out.fogTopMat = new THREE.MeshBasicMaterial({
      color: 0xe6eef4, map: QP.tex.softDot, transparent: true, opacity: 0, depthWrite: false,
    });
    const fogTop = new THREE.Mesh(new THREE.PlaneGeometry(17, 12).rotateX(-Math.PI / 2), out.fogTopMat);
    fogTop.position.set(0, yLidTop + 0.07, cz);
    fogTop.visible = false;
    fogTop.renderOrder = 12;
    plate.add(fogTop);
    out.fogTop = fogTop;

    out.yLidTop = yLidTop;
    return out;
  };
})();
