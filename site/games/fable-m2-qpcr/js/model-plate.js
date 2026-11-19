// 色素テストプレート（96 ウェル）とシールフィルム。
// ウェルの中身は「着色した蛍光色素」だけ。発光は内蔵のデモ信号で決まる（fx.js が色を書き込む）。
(function () {
  'use strict';
  const B = QP.build;
  const D = QP.D;
  const M = QP.mat;

  const TUBE_DEPTH = 1.42;
  const LIQ_H = 1.02; // 満量時の液面高さ（チューブ底から）

  QP.model.plate = function (scene) {
    const out = {};

    // ---- プレート ----------------------------------------------------------
    const plate = B.part('plate', '色素テストプレート', [0, 1, 0], 0);
    scene.add(plate);
    out.plate = plate;
    const pb = new B.Batch();
    const deckT = 0.15;
    pb.add(M.plate, B.holedPlate(D.plateW, D.plateD, 0.4, D.wellR, deckT, 12), 0, D.plateH - deckT, 0);
    const skirt = B.rrShape(D.plateW, D.plateD, 0.4);
    skirt.holes.push(B.roundRect(new THREE.Path(), 0, 0, D.plateW - 0.24, D.plateD - 0.24, 0.3));
    pb.add(M.plate, B.extrudeY(skirt, D.plateH - deckT, { seg: 5 }), 0, 0, 0);
    // 列・行の目印になる小さな突起（文字の代わり）
    for (let c = 0; c < D.cols; c++) pb.add(M.plate, B.box(0.12, 0.03, 0.22), D.wellX(c), D.plateH + 0.015, -D.plateD / 2 + 0.3);
    pb.into(plate);

    const m4 = new THREE.Matrix4();
    // チューブ内面（上から覗くと見える白い円錐）
    const tubeGeo = B.cone(0.11, D.wellR, TUBE_DEPTH, 12, true).translate(0, -TUBE_DEPTH / 2, 0);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xeceeeb, roughness: 0.55, side: THREE.BackSide });
    const tubes = new THREE.InstancedMesh(tubeGeo, tubeMat, 96);
    // チューブの壁を中の色素の色でうっすら染める（斜めから見ても何色のウェルか分かる）
    const tint = new THREE.Color();
    const white = new THREE.Color(1, 1, 1);
    for (const w of B.wells) {
      tubes.setMatrixAt(w.i, m4.makeTranslation(w.x, D.plateH - 0.02, w.z));
      tubes.setColorAt(w.i, tint.set(QP.CHANNELS[QP.machine.S.wells[w.i].dye].em).lerp(white, 0.5));
    }
    tubes.castShadow = false;
    tubes.receiveShadow = false;
    plate.add(tubes);

    // 色素（液）。高さは蒸発で下がる。色は fx が毎フレーム書き込む（HDR 可）
    const liqGeo = new THREE.CylinderGeometry(0.225, 0.11, LIQ_H, 10, 1, false).translate(0, LIQ_H / 2, 0);
    const liqMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const liquid = new THREE.InstancedMesh(liqGeo, liqMat, 96);
    liquid.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const col = new THREE.Color(0x222222);
    for (const w of B.wells) {
      liquid.setMatrixAt(w.i, m4.makeTranslation(w.x, D.plateH - TUBE_DEPTH, w.z));
      liquid.setColorAt(w.i, col);
    }
    liquid.instanceColor.setUsage(THREE.DynamicDrawUsage);
    liquid.castShadow = false;
    liquid.receiveShadow = false;
    liquid.frustumCulled = false;
    plate.add(liquid);
    out.liquid = liquid;
    out.liquidBaseY = D.plateH - TUBE_DEPTH;
    out.liquidTopY = D.plateH - TUBE_DEPTH + LIQ_H;

    // ---- シールフィルム ------------------------------------------------------
    const film = B.part('film', 'シールフィルム', [0, 1, 0], 0);
    scene.add(film);
    out.film = film;
    const fw = D.plateW - 0.3;
    const fd = D.plateD - 0.3;
    const fgeo = new THREE.PlaneGeometry(fw, fd, 14, 9).rotateX(-Math.PI / 2);
    const fmesh = new THREE.Mesh(fgeo, M.film);
    fmesh.renderOrder = 6;
    fmesh.castShadow = false;
    film.add(fmesh);
    out.filmMesh = fmesh;
    const base = fgeo.attributes.position.array.slice();
    // 角のめくれ（0 = 平ら、1 = ベンチ置きのときの反り）
    out.setCurl = (k) => {
      const p = fgeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = base[i * 3];
        const z = base[i * 3 + 2];
        const d = Math.max(0, (x / fw + 0.5) * 0.6 + (z / fd + 0.5) * 0.6 - 0.72);
        p.setY(i, k * (d * d * 9.5 + 0.03 * Math.sin(x * 1.3) * Math.sin(z * 1.7)));
      }
      p.needsUpdate = true;
      fgeo.computeVertexNormals();
    };
    out.setCurl(1);

    // 剥離紙（ベンチに残る）
    const liner = new THREE.Mesh(B.box(fw + 0.8, 0.03, fd + 0.8), M.liner);
    liner.receiveShadow = true;
    scene.add(liner);
    out.liner = liner;

    // ---- 置き場所 ----------------------------------------------------------
    const pose = (x, y, z, ry, rz) => ({
      p: new THREE.Vector3(x, y, z),
      q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry || 0, rz || 0)),
    });
    // どちらも装置の右手前に置く（既定の視点はどれも右前からなので、開いたドロワーに隠れない）
    out.benchPlate = pose(19.4, 0, 31.2, 1.36);
    out.benchFilm = pose(27.2, 0.06, 18.2, 1.47);
    liner.position.set(27.2, 0.02, 18.2);
    liner.rotation.y = 1.47;
    // 着座位置からの相対姿勢（斜め置き: 片側が枠に乗り上げる）
    out.seatLocal = pose(0, 0, 0, 0);
    out.skewLocal = pose(0.5, 0.42, 0.25, 0.115, 0.062);
    out.filmOnPlateY = D.plateH + 0.045;
    return out;
  };
})();
