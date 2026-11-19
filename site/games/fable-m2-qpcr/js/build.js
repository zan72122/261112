// 形状づくりの共通道具。
// ・Batch: 同じマテリアルの形状を 1 メッシュにまとめ、描画コール数を抑える（モバイル向け）
// ・part(): 「クリックで少し分解＋日本語ラベル」の単位になるグループを作る
(function () {
  'use strict';

  const B = (QP.build = {});
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _e = new THREE.Euler();
  const _p = new THREE.Vector3();
  const _s = new THREE.Vector3(1, 1, 1);

  class Batch {
    constructor() {
      this.byMat = new Map();
    }
    // 形状を (x,y,z) へ置き、オイラー角 (rx,ry,rz) で回して登録する
    add(mat, geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
      let g = geo.index ? geo.toNonIndexed() : geo.clone();
      if (!g.attributes.uv) {
        g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      }
      for (const k of Object.keys(g.attributes)) {
        if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
      }
      _m.compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s);
      g.applyMatrix4(_m);
      if (!this.byMat.has(mat)) this.byMat.set(mat, []);
      this.byMat.get(mat).push(g);
      return this;
    }
    // マテリアルごとに結合して group へ追加
    into(group, opts) {
      const cast = !opts || opts.cast !== false;
      const receive = !opts || opts.receive !== false;
      for (const [mat, list] of this.byMat) {
        const geo = list.length === 1 ? list[0] : THREE.BufferGeometryUtils.mergeGeometries(list, false);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = cast;
        mesh.receiveShadow = receive;
        group.add(mesh);
      }
      this.byMat.clear();
      return group;
    }
  }
  B.Batch = Batch;

  // ---- 基本形状 -----------------------------------------------------------
  B.box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  B.rbox = (w, h, d, r, seg) => new THREE.RoundedBoxGeometry(w, h, d, seg || 2, Math.min(r, w / 2, h / 2, d / 2) * 0.999);
  B.cyl = (r, h, seg, open) => new THREE.CylinderGeometry(r, r, h, seg || 24, 1, !!open);
  B.cone = (r0, r1, h, seg, open) => new THREE.CylinderGeometry(r1, r0, h, seg || 24, 1, !!open); // r0=下, r1=上

  // 角丸長方形（中心基準）を Shape / Path に描く
  B.roundRect = (path, cx, cy, w, h, r) => {
    const x = cx - w / 2;
    const y = cy - h / 2;
    r = Math.min(r, w / 2, h / 2);
    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    path.lineTo(x + w, y + h - r);
    path.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    path.lineTo(x + r, y + h);
    path.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    path.lineTo(x, y + r);
    path.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return path;
  };
  B.rrShape = (w, h, r) => B.roundRect(new THREE.Shape(), 0, 0, w, h, r);
  B.circleHole = (x, y, r) => new THREE.Path().absarc(x, y, r, 0, Math.PI * 2, true);
  B.slotHole = (cx, cy, w, h) => B.roundRect(new THREE.Path(), cx, cy, w, h, Math.min(w, h) / 2);

  // 押し出し 3 方向。Shape の (u,v) がどの軸に対応するかだけが違う。
  //   extrudeZ: (u,v)=(x,y) を +Z へ / extrudeY: (u,v)=(x,-z) を +Y へ / extrudeX: (u,v)=(z,y) を x0→x1 へ
  function ext(shape, depth, o) {
    o = o || {};
    return new THREE.ExtrudeGeometry(shape, {
      depth,
      curveSegments: o.seg || 10,
      bevelEnabled: !!o.bevel,
      bevelThickness: o.bevel || 0,
      bevelSize: o.bevel || 0,
      bevelSegments: o.bevelSeg || 2,
    });
  }
  B.extrudeZ = (shape, depth, o) => ext(shape, depth, o);
  B.extrudeY = (shape, depth, o) => ext(shape, depth, o).rotateX(-Math.PI / 2);
  B.extrudeX = (shape, x0, x1, o) => ext(shape, x1 - x0, o).rotateY(-Math.PI / 2).translate(x1, 0, 0);

  // 96 ウェル位置の配列 [{i, c, r, x, z}]
  B.wells = (function () {
    const D = QP.D;
    const list = [];
    for (let r = 0; r < D.rows; r++) {
      for (let c = 0; c < D.cols; c++) list.push({ i: r * D.cols + c, c, r, x: D.wellX(c), z: D.wellZ(r) });
    }
    return list;
  })();

  // 96 個の穴が開いた角丸板（上向き押し出し）。穴の縁まで本物の形状にする。
  B.holedPlate = (w, d, r, holeR, thick, seg) => {
    const shape = B.rrShape(w, d, r);
    for (const wl of B.wells) shape.holes.push(B.circleHole(wl.x, -wl.z, holeR));
    return B.extrudeY(shape, thick, { seg: seg || 10 });
  };

  // ---- 分解ラベル付きパーツ ------------------------------------------------
  // dir: 分解方向（親のローカル座標）、dist: 距離、also: 一緒に動かす他パーツ [{id, k}]
  B.parts = {};
  B.part = (id, label, dir, dist, extra) => {
    const g = new THREE.Group();
    g.name = id;
    g.userData.part = Object.assign({
      id, label,
      dir: new THREE.Vector3(dir[0], dir[1], dir[2]).normalize(),
      dist,
      base: new THREE.Vector3(),
      cur: 0, // 現在の分解量 0..1
      target: 0,
    }, extra || {});
    B.parts[id] = g;
    return g;
  };
})();
