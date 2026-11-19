// 電動ドロワーと熱モジュール（96 穴ブロック / ペルチェ / ヒートシンク）、冷却ファン、内部フレーム。
// ドロワーは熱モジュールごと前へ出る構造。座標はすべて「閉位置」で定義し、drawer.position.z で動かす。
(function () {
  'use strict';
  const B = QP.build;
  const D = QP.D;
  const M = QP.mat;

  QP.model.thermal = function (root) {
    const out = {};
    const cz = D.cz;

    // ---- ドロワー機構グループ ----------------------------------------------
    const drawer = new THREE.Group();
    drawer.name = 'drawerMech';
    root.add(drawer);
    out.drawer = drawer;

    // 前面パネル（濃色、状態ライトつき）
    const fascia = B.part('fascia', '電動ドロワー', [0, 0, 1], 3);
    drawer.add(fascia);
    const fb = new B.Batch();
    const fw = D.openHX * 2 - 0.4;
    const fh = D.openY1 - D.openY0 - 0.4;
    const fy = (D.openY0 + D.openY1) / 2;
    fb.add(M.paintDark, B.rbox(fw, fh, 1.0, 0.28, 3), 0, fy, D.zFront - 0.48);
    fb.add(M.plastic, B.rbox(fw - 1.2, fh - 1.2, 0.5, 0.2), 0, fy, D.zFront - 1.2);
    fb.add(M.plastic, B.rbox(fw - 3, 0.42, 0.3, 0.14), 0, D.openY1 - 1.7, D.zFront - 0.08); // 指掛かりの溝
    fb.into(fascia);
    out.fasciaMeshes = fascia.children.slice();
    out.fasciaLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(fw, fh, 1.0)).translate(0, fy, D.zFront - 0.48), QP.mat.ghostLine);
    out.fasciaLines.visible = false;
    out.fasciaLines.renderOrder = 31;
    fascia.add(out.fasciaLines);
    // 状態ライト（細い発光ライン）
    out.statusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const status = new THREE.Mesh(B.rbox(11, 0.16, 0.08, 0.04), out.statusMat);
    status.position.set(0, D.openY0 + 1.5, D.zFront + 0.03);
    fascia.add(status);

    // そり（板金トレー）、ラック、テレスコピックレールの内側メンバ、プレート枠
    const sled = B.part('sled', 'ドロワー台', [0, -1, 0], 1.6);
    drawer.add(sled);
    const sb = new B.Batch();
    sb.add(M.zinc, B.box(16, 0.2, 20.6), 0, 6.4, 10.7);
    sb.add(M.zinc, B.box(0.2, 1.2, 4.4), 7.9, 7.0, 18.8);
    sb.add(M.zinc, B.box(0.2, 1.2, 4.4), -7.9, 7.0, 18.8);
    sb.add(M.steel, B.box(0.8, 0.34, 19.2), 0, 6.13, 10.6); // ラック
    for (const sx of [-1, 1]) sb.add(M.steel, B.box(0.3, 1.0, 17.5), sx * 8.45, 6.6, 11.5);
    // ヒートシンクを支えるスタンドオフ
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) sb.add(M.steel, B.cyl(0.32, 5.5, 10), sx * 7.9, 9.25, cz + sz * 5.9);
    // ブロックを囲むプレート枠と、前面パネルまでの上面カバー
    const frame = B.rrShape(15.6, 11.6, 0.7);
    frame.holes.push(B.roundRect(new THREE.Path(), 0, 0, 13.9, 9.9, 0.3));
    sb.add(M.plasticGrey, B.extrudeY(frame, 0.45, { seg: 5 }), 0, D.yBlockUp, cz);
    sb.add(M.plasticGrey, B.rbox(15.6, 0.3, 5.4, 0.1), 0, D.yBlockUp + 0.3, cz + 8.55);
    sb.add(M.plasticGrey, B.box(0.3, 7.6, 0.3), 7.5, 10.4, 20.4);
    sb.add(M.plasticGrey, B.box(0.3, 7.6, 0.3), -7.5, 10.4, 20.4);
    sb.into(sled);

    // ---- 熱モジュール ------------------------------------------------------
    out.matBlock = M.clone(M.aluBlock);
    out.matSink = M.clone(M.aluSink);
    out.matPeltTop = M.clone(M.ceramic);
    out.matPeltBot = M.clone(M.ceramic);

    const sink = B.part('sink', 'ヒートシンク', [0, -1, 0], 2.2);
    drawer.add(sink);
    const hb = new B.Batch();
    hb.add(out.matSink, B.box(15, D.yPelt - D.ySink, 11.4), 0, (D.yPelt + D.ySink) / 2, cz);
    const nFin = 17;
    for (let i = 0; i < nFin; i++) {
      hb.add(out.matSink, B.box(15, D.ySink - D.yFin0, 0.2), 0, (D.ySink + D.yFin0) / 2, cz - 5.6 + (11.2 * i) / (nFin - 1));
    }
    hb.into(sink);

    const pelt = B.part('peltier', 'ペルチェ素子', [0, 1, 0], 0.9, { also: [{ id: 'block', k: 0.85 }] });
    drawer.add(pelt);
    const pb = new B.Batch();
    const pt = D.yBlock - D.yPelt;
    for (const px of [-4.15, 0, 4.15]) {
      for (const pz of [-2.1, 2.1]) {
        pb.add(out.matPeltBot, B.box(4, 0.09, 4), px, D.yPelt + 0.045, cz + pz);
        pb.add(M.pellet, B.box(3.8, pt - 0.18, 3.8), px, D.yPelt + pt / 2, cz + pz);
        pb.add(out.matPeltTop, B.box(4, 0.09, 4), px, D.yBlock - 0.045, cz + pz);
        // リード線（後方へ）
        pb.add(M.wireRed, B.cyl(0.07, 2.6, 6), px - 0.5, D.yPelt + 0.2, cz + pz - (pz < 0 ? 3.2 : 7.4) + 0.2, Math.PI / 2);
        pb.add(M.wireBlack, B.cyl(0.07, 2.6, 6), px + 0.5, D.yPelt + 0.2, cz + pz - (pz < 0 ? 3.2 : 7.4) + 0.2, Math.PI / 2);
      }
    }
    pb.into(pelt);

    const block = B.part('block', '96穴アルミブロック', [0, 1, 0], 2.4);
    drawer.add(block);
    const kb = new B.Batch();
    kb.add(out.matBlock, B.rbox(13.6, D.yBlockUp - D.yBlock, 9.6, 0.12), 0, (D.yBlock + D.yBlockUp) / 2, cz);
    kb.add(out.matBlock, B.holedPlate(11.4, 7.8, 0.35, 0.3, D.yBlockTop - D.yBlockUp, 10), 0, D.yBlockUp, cz);
    kb.into(block);
    // 穴の底（暗い円）: 空のブロックを覗いたときの奥行き
    const bore = new THREE.InstancedMesh(new THREE.CircleGeometry(0.3, 10).rotateX(-Math.PI / 2), M.inner, 96);
    const m4 = new THREE.Matrix4();
    for (const w of B.wells) bore.setMatrixAt(w.i, m4.makeTranslation(w.x, D.yBlockUp + 0.25, cz + w.z));
    bore.castShadow = false;
    block.add(bore);
    out.block = block;

    // プレートの着座位置（ブロックに追従する基準点）
    const seat = new THREE.Object3D();
    seat.position.set(0, D.yPlate, cz);
    block.add(seat);
    out.seat = seat;

    // ---- 固定側: レール外側・駆動モーター -----------------------------------
    const rails = new THREE.Group();
    root.add(rails);
    const rb = new B.Batch();
    for (const sx of [-1, 1]) {
      rb.add(M.zinc, B.box(0.3, 1.5, 19), sx * 9.05, 6.6, 11.5);
      rb.add(M.zinc, B.box(0.5, 4.0, 1.2), sx * 9.15, 4.6, 4);
      rb.add(M.zinc, B.box(0.5, 4.0, 1.2), sx * 9.15, 4.6, 19);
    }
    rb.into(rails);
    // 中間メンバ（ドロワーの半分だけ動く）
    out.railMid = new THREE.Group();
    root.add(out.railMid);
    const mb = new B.Batch();
    for (const sx of [-1, 1]) mb.add(M.steel, B.box(0.28, 1.25, 17.5), sx * 8.75, 6.6, 11.5);
    mb.into(out.railMid);

    const drive = B.part('drive', 'ドロワー駆動モーター', [0, -0.2, 1], 2.4);
    root.add(drive);
    const db = new B.Batch();
    db.add(M.plastic, B.rbox(2.2, 2.2, 2.2, 0.15), -3.2, 4.4, 19.6);
    db.add(M.alu, B.box(0.3, 2.2, 2.2), -2.05, 4.4, 19.6);
    db.add(M.steel, B.cyl(0.14, 2.6, 8), -0.9, 5.0, 19.6, 0, 0, Math.PI / 2);
    db.add(M.zinc, B.box(2.6, 1.6, 0.25), -3.2, 3.2, 19.6);
    db.into(drive);
    // ピニオン（歯車）: ドロワー移動に合わせて回る
    const gear = new THREE.Shape();
    const teeth = 14;
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2;
      const r = i % 2 ? 0.86 : 0.64;
      const a2 = a + (Math.PI / teeth) * 0.55;
      if (i === 0) gear.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else gear.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      gear.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
    }
    gear.closePath();
    const pinion = new THREE.Mesh(B.extrudeX(gear, -0.3, 0.3), M.brass);
    pinion.position.set(0, 5.0, 19.6);
    pinion.castShadow = true;
    drive.add(pinion);
    out.pinion = pinion;
    out.pinionR = 0.75;

    // ---- 冷却ファン（右側面の内側に固定） ------------------------------------
    const fan = B.part('fan', '冷却ファン', [1, 0, 0], 4.5);
    root.add(fan);
    const fx = 15.75;
    const fyc = 9.5;
    const fbt = new B.Batch();
    const fshape = B.rrShape(9.2, 9.2, 0.9);
    fshape.holes.push(B.circleHole(0, 0, 4.3));
    fbt.add(M.plastic, B.extrudeX(fshape, fx - 1.25, fx + 1.25, { seg: 20 }), 0, fyc, cz);
    // 固定側ハブと支柱（内側）
    fbt.add(M.plastic, B.cyl(1.55, 0.5, 20), fx - 1.0, fyc, cz, 0, 0, Math.PI / 2);
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + 0.5;
      fbt.add(M.plastic, B.box(0.3, 0.28, 4.4), fx - 1.05, fyc + Math.sin(a) * 2.2, cz + Math.cos(a) * 2.2, -a);
    }
    // ヒートシンクへ風を導くシュラウド（板金 4 枚）
    function quad(p0, p1, p2, p3) {
      const g = new THREE.BufferGeometry();
      const v = [p0, p1, p2, p0, p2, p3].flat();
      g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(12), 2));
      g.computeVertexNormals();
      return g;
    }
    const xa = 11.3;
    const xb = fx - 1.25;
    const A = { y0: 6.7, y1: 12.2, z0: cz - 5.7, z1: cz + 5.7 };
    const F = { y0: fyc - 4.6, y1: fyc + 4.6, z0: cz - 4.6, z1: cz + 4.6 };
    out.matShroud = new THREE.MeshStandardMaterial({ color: 0x4a4e55, roughness: 0.5, metalness: 0.9, side: THREE.DoubleSide });
    fbt.add(out.matShroud, quad([xa, A.y1, A.z0], [xb, F.y1, F.z0], [xb, F.y1, F.z1], [xa, A.y1, A.z1]));
    fbt.add(out.matShroud, quad([xa, A.y0, A.z1], [xb, F.y0, F.z1], [xb, F.y0, F.z0], [xa, A.y0, A.z0]));
    fbt.add(out.matShroud, quad([xa, A.y0, A.z0], [xb, F.y0, F.z0], [xb, F.y1, F.z0], [xa, A.y1, A.z0]));
    fbt.add(out.matShroud, quad([xa, A.y1, A.z1], [xb, F.y1, F.z1], [xb, F.y0, F.z1], [xa, A.y0, A.z1]));
    fbt.into(fan);

    // 回転部（ハブ＋ 7 枚の後退翼）
    const rotor = new THREE.Group();
    rotor.position.set(fx + 0.15, fyc, cz);
    fan.add(rotor);
    const rbt = new B.Batch();
    rbt.add(M.plastic, B.cyl(1.5, 1.7, 24), 0, 0, 0, 0, 0, Math.PI / 2);
    rbt.add(M.alu, B.cyl(1.1, 0.06, 24), 0.86, 0, 0, 0, 0, Math.PI / 2); // ハブの銘板
    rbt.add(M.ceramic, B.box(0.05, 0.3, 0.9), 0.9, 0, 0.55); // 回転が分かる白い目印
    const nb = 7;
    for (let k = 0; k < nb; k++) {
      const g = new THREE.PlaneGeometry(1, 1, 5, 3);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i) + 0.5; // 半径方向 0..1
        const v = pos.getY(i); // 翼弦方向 -0.5..0.5
        const r = 1.45 + u * 2.7;
        const ang = (k / nb) * Math.PI * 2 + u * 0.75 + v * (0.95 - u * 0.35);
        const ax = v * (1.25 - u * 0.25) + Math.sin(u * 2.2) * 0.12;
        pos.setXYZ(i, ax, Math.sin(ang) * r, Math.cos(ang) * r);
      }
      g.computeVertexNormals();
      rbt.add(M.fanBlade || (M.fanBlade = new THREE.MeshStandardMaterial({ color: 0x2b2e33, roughness: 0.42, side: THREE.DoubleSide })), g);
    }
    rbt.into(rotor, { cast: false });
    out.fanRotor = rotor;
    out.fanPos = new THREE.Vector3(fx, fyc, cz);

    return out;
  };

  // ---- 内部フレーム・電源・制御基板 -------------------------------------------
  QP.model.chassis = function (root) {
    const out = {};
    const g = B.part('chassis', '内部フレーム', [0, 0, -1], 0);
    root.add(g);
    const cb = new B.Batch();
    cb.add(M.zinc, B.box(34, 0.4, 44.4), 0, 2.4, -1); // 底板
    const zf = 0.6; // 中間の柱（ガントリ後端）
    const zb = -21.6;
    const px = 15.6;
    for (const sx of [-1, 1]) {
      cb.add(M.alu, B.box(1.6, 35.4, 1.6), sx * px, 20.3, zf);
      cb.add(M.alu, B.box(1.6, 35.4, 1.6), sx * px, 20.3, zb);
      cb.add(M.alu, B.box(1.6, 1.6, zf - zb - 1.6), sx * px, 37.2, (zf + zb) / 2);
      cb.add(M.alu, B.box(1.6, 1.6, zf - zb - 1.6), sx * px, 20.0, (zf + zb) / 2);
    }
    cb.add(M.alu, B.box(px * 2 - 1.6, 1.6, 1.6), 0, 37.2, zb);
    cb.add(M.alu, B.box(px * 2 - 1.6, 1.6, 1.6), 0, 37.2, zf);
    // ガントリ前端を受ける短い柱（傾斜面の下に収まる高さ）
    for (const sx of [-1, 1]) cb.add(M.alu, B.box(1.6, 28.6, 1.6), sx * px, 16.9, 17.2);
    cb.into(g);

    // 電源ユニット（後方左）
    const psu = B.part('psu', '電源ユニット', [0, 0, -1], 4);
    root.add(psu);
    const pb = new B.Batch();
    pb.add(M.perf, B.box(13, 6.4, 17), -7.2, 5.9, -13.4);
    pb.add(M.zinc, B.box(13.2, 0.3, 17.2), -7.2, 2.75, -13.4);
    pb.add(M.plastic, B.box(3, 2.2, 0.6), -11, 5.5, -22.2);
    pb.into(psu);

    // 制御基板（後方、水平に配置）
    const pcb = B.part('pcb', '制御基板', [0, 1, 0], 3);
    root.add(pcb);
    const kb = new B.Batch();
    kb.add(M.pcb, B.box(26, 0.18, 15), 0, 21.2, -12.5);
    kb.add(M.plastic, B.box(3.6, 0.5, 3.6), -4, 21.55, -12);
    kb.add(M.alu, B.box(3.2, 1.2, 3.2), 5, 21.9, -10);
    kb.add(M.plastic, B.box(2.2, 0.35, 1.4), -9.5, 21.5, -8.5);
    kb.add(M.plastic, B.box(1.4, 0.35, 2.2), 0.5, 21.5, -16.5);
    kb.add(M.plastic, B.box(1.2, 0.35, 1.2), 9.5, 21.5, -15.5);
    kb.add(M.ceramic, B.box(5.5, 0.9, 0.8), -8, 21.75, -18.6);
    kb.add(M.ceramic, B.box(4.2, 0.9, 0.8), 8.4, 21.75, -6.2);
    for (let i = 0; i < 5; i++) kb.add(M.aluBlue, B.cyl(0.5, 1.5, 12), -11 + i * 1.5, 22.05, -14.5);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) kb.add(M.brass, B.cyl(0.25, 1.2, 8), sx * 12.4, 20.6, -12.5 + sz * 6.8);
    kb.into(pcb);
    return out;
  };
})();
