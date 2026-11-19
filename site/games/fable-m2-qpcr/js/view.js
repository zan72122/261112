// モデルを組み立て、毎フレーム「機構の状態 S → 3D の姿勢・色」を反映する。
// ここには演出は置かない（発光・陽炎・湯気などは fx.js）。
(function () {
  'use strict';
  const { clamp, lerp, smooth, easeInOut } = QP.util;
  const D = QP.D;

  const V = (QP.view = { k: 0 }); // k: 0 = 実機表示, 1 = 体験モード（徐々に切り替わる）

  const _p0 = new THREE.Vector3();
  const _p1 = new THREE.Vector3();
  const _q0 = new THREE.Quaternion();
  const _q1 = new THREE.Quaternion();
  const _s = new THREE.Vector3();
  const _m = new THREE.Matrix4();
  const _c = new THREE.Color();
  const COLD = new THREE.Color(0.06, 0.28, 1.0);
  const HOT = new THREE.Color(1.0, 0.2, 0.03);
  const WARM = new THREE.Color(1.0, 0.42, 0.08);

  V.build = function (scene) {
    const root = new THREE.Group();
    root.name = 'instrument';
    scene.add(root);
    V.root = root;
    V.bench = QP.model.bench(scene);
    V.chassis = QP.model.chassis(root);
    V.thermal = QP.model.thermal(root);
    V.lid = QP.model.lid(root);
    V.optics = QP.model.optics(root);
    V.housing = QP.model.housing(root);
    V.items = QP.model.plate(scene);

    V.housing.displayMat.emissiveMap = QP.screen.texture;

    // 各パーツの基準位置を記録（分解アニメーションの原点）
    for (const id in QP.build.parts) {
      const g = QP.build.parts[id];
      g.userData.part.base.copy(g.position);
    }

    // チャンネル色（線形 RGB）を先に計算
    V.em = QP.CHANNELS.map((c) => new THREE.Color(c.em));
    V.ex = QP.CHANNELS.map((c) => new THREE.Color(c.ex));
    return root;
  };

  // 温度 → 色。60℃ 付近は青、95℃ は赤橙。室温では無色。
  function heatColor(out, T, gain) {
    const amount = smooth((T - 30) / 22);
    const t = clamp((T - 58) / 37, 0, 1);
    out.copy(COLD).lerp(HOT, smooth(t));
    return out.multiplyScalar(amount * (0.35 + 0.85 * t) * gain);
  }

  function poseOf(key, p, q) {
    const it = V.items;
    if (key === 'bench') {
      p.copy(it.benchPlate.p);
      q.copy(it.benchPlate.q);
      return;
    }
    V.thermal.seat.updateWorldMatrix(true, false);
    V.thermal.seat.matrixWorld.decompose(p, q, _s);
    if (key === 'skew') {
      p.add(it.skewLocal.p);
      q.multiply(it.skewLocal.q);
    }
  }

  // 「いまは動かせない」ときの小さな跳ね
  const nope = { id: null, t: 0 };
  QP.bus.on('nope', (id) => { nope.id = id; nope.t = 0.4; });

  let curlShown = -1;
  let levelSum = -1;

  V.update = function (dt) {
    const S = QP.machine.S;
    const k = V.k;
    const th = V.thermal;
    const T = S.temp;

    // ---- ドロワー（熱モジュールごと動く） ----------------------------------
    const jolt = S.jolt > 0 ? Math.sin(S.jolt * 34) * S.jolt * 0.13 : 0;
    const dz = S.drawer.pos * D.travel + jolt;
    th.drawer.position.z = dz;
    th.railMid.position.z = dz * 0.5;
    th.pinion.rotation.x = dz / th.pinionR;

    // ---- リッド: キャリアが下がり、最後はばねが縮んで押さえ込む -------------
    const L = V.lid;
    const shake = S.strain > 0 ? Math.sin(S.t * 95) * 0.035 : 0;
    const c = lerp(D.lidTravel, -0.3, easeInOut(S.lid.pos)) + shake;
    L.carrier.position.y = c;
    L.plate.position.y = Math.max(c, 0);
    L.springs.scale.y = clamp((L.springGap + Math.min(c, 0)) / L.springGap, 0.2, 1);
    for (const s of L.screws) s.rotation.y = S.lid.pos * 38 + shake * 4;
    L.matLid.emissive.copy(WARM).multiplyScalar(smooth((T.lid - 35) / 70) * (0.05 + 0.5 * k));
    L.fogMat.opacity = S.fog * 0.85;
    L.fog.visible = S.fog > 0.01;
    L.fogTopMat.opacity = S.fog * 0.75;
    L.fogTop.visible = S.fog > 0.01;
    QP.mat.lens.opacity = 0.42 + S.fog * 0.4; // 対物レンズも曇る
    QP.mat.lens.roughness = 0.03 + S.fog * 0.5;

    // ---- 光学ヘッド ---------------------------------------------------------
    const O = V.optics;
    O.beam.position.z = D.cz + S.head.z + O.beamDz;
    O.head.position.x = S.head.x;
    O.wheelRotor.rotation.y = S.wheel.angle;
    const lit = S.led.level;
    O.ledMat.color.copy(V.ex[S.filter]).multiplyScalar(lit * 5.0 + 0.02);

    // ---- ファン -------------------------------------------------------------
    th.fanRotor.rotation.x = S.fan.angle;

    // ---- 温度の色づけ（体験モードで強く） -----------------------------------
    const gain = 0.04 + 0.96 * k;
    heatColor(th.matBlock.emissive, T.block, gain * 1.1);
    const u = T.drive;
    const hotSide = _c.copy(HOT).multiplyScalar(Math.abs(u) * gain * 0.9);
    const coldSide = _p0.set(COLD.r, COLD.g, COLD.b).multiplyScalar(Math.abs(u) * gain * 0.9);
    if (u >= 0) {
      th.matPeltTop.emissive.copy(hotSide);
      th.matPeltBot.emissive.setRGB(coldSide.x, coldSide.y, coldSide.z);
    } else {
      th.matPeltBot.emissive.copy(hotSide);
      th.matPeltTop.emissive.setRGB(coldSide.x, coldSide.y, coldSide.z);
    }
    th.matSink.emissive.copy(WARM).multiplyScalar(smooth((T.sink - 27) / 16) * gain * 0.26);

    // ---- 状態ライトと開閉ボタン ---------------------------------------------
    const pulse = 0.5 + 0.5 * Math.sin(S.t * 5);
    const st = th.statusMat.color;
    if (S.error) st.setRGB(1, 0.12, 0.08).multiplyScalar(Math.sin(S.t * 16) > 0 ? 3 : 0.2);
    else if (S.run.active) {
      if (S.run.phase === 'scan') st.copy(V.em[S.filter]).multiplyScalar(1.6 + pulse);
      else if (u > 0.15) st.setRGB(1, 0.42, 0.1).multiplyScalar(2.2);
      else if (u < -0.15) st.setRGB(0.15, 0.6, 1).multiplyScalar(2.2);
      else st.setRGB(1, 1, 1).multiplyScalar(1.2);
    } else if (S.run.done) st.setRGB(0.3, 1, 0.5).multiplyScalar(1.2 + 0.6 * pulse);
    else st.setRGB(1, 1, 1).multiplyScalar(0.55);
    const ring = V.housing.ringMat.color;
    if (S.error === 'lock') ring.setRGB(1, 0.1, 0.06).multiplyScalar(Math.sin(S.t * 22) > 0 ? 4 : 0.3);
    else if (S.run.active) ring.setRGB(1, 0.35, 0.1).multiplyScalar(0.9);
    else ring.setRGB(1, 1, 1).multiplyScalar(0.8 + (V.hint === 'eject' ? 1.4 * pulse : 0));
    V.housing.buttonCap.position.z = S.jolt > 0.6 ? -0.08 : 0;

    // ---- プレート -----------------------------------------------------------
    const it = V.items;
    const P = S.plate;
    if (P.t < 1) {
      poseOf(P.prev, _p0, _q0);
      poseOf(P.pose, _p1, _q1);
      const e = easeInOut(P.t);
      const far = P.prev === 'bench' || P.pose === 'bench';
      it.plate.position.lerpVectors(_p0, _p1, e);
      it.plate.position.y += Math.sin(Math.PI * e) * (far ? 10 : 1.0);
      it.plate.quaternion.slerpQuaternions(_q0, _q1, e);
    } else {
      poseOf(P.pose, it.plate.position, it.plate.quaternion);
      if (P.pose === 'skew' && S.drawer.moving) it.plate.position.y += Math.sin(S.t * 70) * 0.03; // カタカタ
    }
    if (nope.t > 0) {
      nope.t = Math.max(0, nope.t - dt);
      if (nope.id === 'plate' && P.pose === 'bench') {
        const e = nope.t / 0.4;
        it.plate.position.y += Math.sin(Math.PI * e) * 1.1;
        it.plate.position.x += Math.sin(e * 28) * 0.12 * e;
      }
    }
    it.plate.updateMatrixWorld(true);

    // ---- フィルム（貼ると平らに、ベンチでは角が反る） -------------------------
    const F = S.film;
    _m.copy(it.plate.matrixWorld);
    _m.decompose(_p1, _q1, _s);
    _p1.add(_p0.set(0, it.filmOnPlateY, 0).applyQuaternion(_q1));
    const e = easeInOut(F.t);
    const a = F.on ? e : 1 - e; // 0 = ベンチ, 1 = プレート上
    it.film.position.lerpVectors(it.benchFilm.p, _p1, a);
    if (F.t < 1) it.film.position.y += Math.sin(Math.PI * e) * 8;
    it.film.quaternion.slerpQuaternions(it.benchFilm.q, _q1, a);
    if (nope.t > 0 && nope.id === 'film') {
      const e2 = nope.t / 0.4;
      it.film.position.x += Math.sin(e2 * 28) * 0.18 * e2;
      it.film.position.y += Math.sin(Math.PI * e2) * 0.5;
    }
    const curl = Math.round((1 - a) * 20) / 20;
    if (curl !== curlShown) {
      it.setCurl(curl);
      curlShown = curl;
    }

    // ---- 液量（蒸発） ---------------------------------------------------------
    let sum = 0;
    for (let i = 0; i < 96; i++) sum += S.wells[i].level;
    if (Math.abs(sum - levelSum) > 0.05) {
      levelSum = sum;
      for (const w of QP.build.wells) {
        _m.makeScale(1, S.wells[w.i].level, 1).setPosition(w.x, it.liquidBaseY, w.z);
        it.liquid.setMatrixAt(w.i, _m);
      }
      it.liquid.instanceMatrix.needsUpdate = true;
    }
  };

  // 影の更新が要るか（動いているものがあるときだけ影を描き直す）
  V.moving = function () {
    const S = QP.machine.S;
    return S.drawer.moving || S.lid.moving || S.plate.t < 1 || S.film.t < 1 || S.jolt > 0 || S.strain > 0 || nope.t > 0;
  };
})();
