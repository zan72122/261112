// 光路の小窓: LED → 励起フィルタ → ダイクロイック → 対物レンズ → ウェル → 蛍光フィルタ → 結像レンズ → 検出器。
// 寸法も光束も誇張した模式図（画面に「誇張表示」と明記）。本体と同じ機構状態 S に連動し、
// カメラは光のパルスを追って動く。本体シーンとは別の小さなシーンなので負荷は軽い。
(function () {
  'use strict';
  const { clamp, damp } = QP.util;

  const I = (QP.inset = {});

  // 光路の要所（小窓内の座標）
  const P = {
    led: [-4.4, 1.0], l1: [-3.0, 1.0], exf: [-1.75, 1.0], dic: [0, 1.0],
    obj: [0, -0.7], well: [0, -3.2], emf: [0, 2.55], l3: [0, 3.55], det: [0, 4.85],
  };
  const BW = 0.46; // 平行光束の半幅
  const PLUG = new THREE.Color(0x101012); // 遮光位置のフィルタ色

  // 折れ線（点と半幅）から、十字に交差する 2 枚の帯を作る。aT = 経路長、aSide = 幅方向 -1..1
  function ribbon(pts) {
    const pos = [];
    const aT = [];
    const aSide = [];
    let len = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy);
      const nx = -dy / l;
      const ny = dx / l;
      for (const plane of [0, 1]) {
        const ox = plane ? 0 : nx;
        const oy = plane ? 0 : ny;
        const oz = plane ? 1 : 0;
        const v = (p, w, s, t) => {
          pos.push(p[0] + ox * w * s, p[1] + oy * w * s, oz * w * s);
          aT.push(t);
          aSide.push(s);
        };
        v(a, a[2], -1, len); v(a, a[2], 1, len); v(b, b[2], 1, len + l);
        v(a, a[2], -1, len); v(b, b[2], 1, len + l); v(b, b[2], -1, len + l);
      }
      len += l;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.Float32BufferAttribute(aT, 1));
    g.setAttribute('aSide', new THREE.Float32BufferAttribute(aSide, 1));
    g.userData.len = len;
    return g;
  }

  function beamMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color() }, uGain: { value: 0 }, uTime: { value: 0 },
        uCut: { value: 1e3 }, uHero: { value: -10 },
      },
      vertexShader: `attribute float aT; attribute float aSide; varying float vT; varying float vS;
        void main(){ vT = aT; vS = aSide; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uGain; uniform float uTime; uniform float uCut; uniform float uHero;
        varying float vT; varying float vS;
        void main(){
          float edge = 1.0 - vS * vS;
          float flow = 0.55 + 0.45 * sin(vT * 5.0 - uTime * 9.0);   // 流れる縞 = 光の進む向き
          float hero = exp(-pow((vT - uHero) * 1.9, 2.0)) * 2.6;     // カメラが追うパルス
          float cut = 1.0 - smoothstep(uCut - 0.12, uCut, vT);
          float a = edge * (flow * 0.42 + hero * 0.6) * cut * uGain;
          gl_FragColor = vec4(uColor * a, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    });
  }

  I.build = function (renderer) {
    I.renderer = renderer;
    I.el = document.getElementById('inset');
    const scene = (I.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x07090d);
    scene.environment = QP.scene.environment;
    scene.environmentIntensity = 0.75;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 0.7));
    I.cam = new THREE.PerspectiveCamera(34, 0.8, 0.5, 80);
    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(3, 6, 8);
    scene.add(light);

    const M = QP.mat;
    const B = QP.build;
    const add = (geo, mat, x, y, z, rz) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z || 0);
      if (rz) m.rotation.z = rz;
      scene.add(m);
      return m;
    };
    const lensGeo = new THREE.SphereGeometry(0.72, 20, 12);
    const lens = (p, horizontal) => {
      const m = add(lensGeo, M.lens, p[0], p[1], 0);
      m.scale.set(horizontal ? 1 : 0.28, horizontal ? 0.28 : 1, 1);
      const ring = add(new THREE.TorusGeometry(0.76, 0.07, 8, 28), M.aluBlue, p[0], p[1], 0);
      ring.rotation.set(horizontal ? Math.PI / 2 : 0, horizontal ? 0 : Math.PI / 2, 0);
    };

    // LED
    add(B.rbox(1.0, 1.1, 1.1, 0.12), M.alu, P.led[0] - 0.55, P.led[1], 0);
    I.ledMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    add(new THREE.SphereGeometry(0.3, 14, 10), I.ledMat, P.led[0], P.led[1], 0);
    for (let k = 0; k < 3; k++) add(B.box(0.08, 1.4, 1.4), M.alu, P.led[0] - 0.75 - k * 0.22, P.led[1], 0);
    lens(P.l1, false);
    // 励起フィルタ / 蛍光フィルタ（選んだ色に変わる）。遮光位置では黒い栓になる。
    I.exMat = M.filterGlass(0xffffff);
    I.emMat = M.filterGlass(0xffffff);
    add(B.box(0.16, 1.5, 1.5), I.exMat, P.exf[0], P.exf[1], 0);
    add(B.box(1.5, 0.16, 1.5), I.emMat, P.emf[0], P.emf[1], 0);
    for (const [p, h] of [[P.exf, false], [P.emf, true]]) {
      const fr = add(new THREE.TorusGeometry(0.98, 0.06, 6, 4), M.alu, p[0], p[1], 0);
      fr.rotation.set(h ? Math.PI / 2 : 0, h ? 0 : Math.PI / 2, Math.PI / 4);
    }
    // ダイクロイックミラー（45°）
    add(B.box(2.0, 0.07, 1.5), new THREE.MeshPhysicalMaterial({
      color: 0xd8c8ff, roughness: 0.03, metalness: 0.2, transparent: true, opacity: 0.4, clearcoat: 1, envMapIntensity: 2.5, depthWrite: false,
    }), P.dic[0], P.dic[1], 0, -Math.PI / 4);
    lens(P.obj, true);
    lens(P.l3, true);
    // ウェル（透明チューブ）と色素
    add(new THREE.CylinderGeometry(0.62, 0.2, 2.2, 20, 1, true), new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.2, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.5,
    }), P.well[0], P.well[1] - 0.2, 0);
    I.dyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    I.dye = add(new THREE.CylinderGeometry(0.4, 0.16, 1.3, 18), I.dyeMat, P.well[0], P.well[1] - 0.65, 0); // チューブより少し細く（面の重なりによるちらつき防止）
    add(B.rbox(3.0, 0.14, 1.6, 0.05), new THREE.MeshStandardMaterial({ color: 0x8d9298, roughness: 0.6 }), P.well[0], P.well[1] + 0.92, 0);
    // 検出器
    add(B.rbox(1.7, 0.9, 1.5, 0.1), M.alu, P.det[0], P.det[1] + 0.45, 0);
    I.detMat = new THREE.MeshBasicMaterial({ color: 0x0a1018 });
    add(B.box(0.9, 0.08, 0.9), I.detMat, P.det[0], P.det[1] - 0.03, 0);

    // 光束
    const exPts = [
      [P.led[0], P.led[1], 0.05], [P.l1[0], P.l1[1], BW], [P.dic[0], P.dic[1], BW], [P.obj[0], P.obj[1], BW], [P.well[0], P.well[1] - 0.5, 0.1],
    ];
    const emPts = [
      [P.well[0], P.well[1] - 0.5, 0.1], [P.obj[0], P.obj[1], BW * 0.86], [P.l3[0], P.l3[1], BW * 0.86], [P.det[0], P.det[1], 0.04],
    ];
    const scPts = [[P.well[0], P.well[1] - 0.5, 0.08], [P.obj[0], P.obj[1], BW * 0.5], [P.emf[0], P.emf[1] - 0.08, BW * 0.5]];
    const mk = (pts) => {
      const g = ribbon(pts);
      const m = new THREE.Mesh(g, beamMaterial());
      m.frustumCulled = false;
      m.renderOrder = 10;
      scene.add(m);
      m.userData.len = g.userData.len;
      return m;
    };
    I.ex = mk(exPts);
    I.em = mk(emPts);
    I.sc = mk(scPts); // 蛍光フィルタで止められる散乱励起光
    I.exCut = Math.hypot(P.exf[0] - P.led[0], P.exf[1] - P.led[1]);

    // カメラが追う経路（励起 → 蛍光）
    I.path = exPts.map((p) => [p[0], p[1]]).concat(emPts.slice(1).map((p) => [p[0], p[1]]));
    I.pathLen = [0];
    for (let i = 1; i < I.path.length; i++) {
      I.pathLen.push(I.pathLen[i - 1] + Math.hypot(I.path[i][0] - I.path[i - 1][0], I.path[i][1] - I.path[i - 1][1]));
    }
    I.exLen = I.ex.userData.len;
    I.total = I.pathLen[I.pathLen.length - 1];
    I.hero = 0;
    I.look = new THREE.Vector3(-1.2, 0.8, 0);
    I.emGain = 0;
    I.exGain = 0;
    I.lastDye = 1;
    I.t = 0;
    I.rect = null;
    I.layout();
  };

  I.layout = function () {
    if (!I.el) return;
    const r = I.el.getBoundingClientRect();
    I.rect = { x: r.left, y: window.innerHeight - r.bottom, w: r.width, h: r.height };
    if (I.cam && r.width > 0) {
      I.cam.aspect = r.width / r.height;
      I.cam.updateProjectionMatrix();
    }
  };

  function pathPoint(s, out) {
    const L = I.pathLen;
    let i = 1;
    while (i < L.length - 1 && L[i] < s) i++;
    const f = clamp((s - L[i - 1]) / (L[i] - L[i - 1]), 0, 1);
    out.set(I.path[i - 1][0] + (I.path[i][0] - I.path[i - 1][0]) * f, I.path[i - 1][1] + (I.path[i][1] - I.path[i - 1][1]) * f, 0);
  }
  const _p = new THREE.Vector3();

  I.render = function (dt, rt) {
    const k = QP.view.k;
    if (k < 0.5 || !I.rect || I.rect.w < 2) return;
    const S = QP.machine.S;
    I.t += dt;

    // ---- 状態を反映 ---------------------------------------------------------
    const ch = S.filter;
    const wheelOpen = !S.wheel.moving && S.wheel.index > 0;
    const exC = QP.view.ex[ch];
    const emC = QP.view.em[ch];
    const lit = S.led.level;
    I.ledMat.color.copy(exC).multiplyScalar(0.05 + lit * 2.6);
    I.exMat.color.copy(wheelOpen ? exC : PLUG);
    I.exMat.emissive.copy(I.exMat.color);
    I.exMat.opacity = wheelOpen ? 0.7 : 0.97;
    I.emMat.color.copy(wheelOpen ? emC : PLUG);
    I.emMat.emissive.copy(I.emMat.color);
    I.emMat.opacity = wheelOpen ? 0.7 : 0.97;

    const hasPlate = S.plate.pose !== 'bench';
    const w = S.run.well >= 0 ? S.wells[S.run.well] : null;
    if (w) I.lastDye = w.dye;
    const dyeC = QP.view.em[I.lastDye];
    const match = !!(w && hasPlate && wheelOpen && w.dye === S.wheel.index);
    const lum = w ? w.lum : 0;
    I.dye.visible = hasPlate;

    I.exGain = damp(I.exGain, lit, 14, dt);
    I.emGain = damp(I.emGain, match ? 0.28 + lum * 1.2 : 0, 16, dt);
    I.dyeMat.color.copy(dyeC).multiplyScalar(0.22 + I.emGain * 1.5);
    I.detMat.color.copy(emC).multiplyScalar(I.emGain * 2.2).addScalar(0.02);

    // パルス（カメラが追う点）
    const active = I.exGain > 0.05;
    if (active) I.hero = (I.hero + dt * 6.2) % (I.total + 2.5);
    else I.hero = damp(I.hero, 0, 3, dt);
    const u = I.ex.material.uniforms;
    u.uColor.value.copy(exC);
    u.uGain.value = I.exGain * 0.8;
    u.uTime.value = I.t;
    u.uCut.value = wheelOpen ? 1e3 : I.exCut;
    u.uHero.value = I.hero;
    const e = I.em.material.uniforms;
    e.uColor.value.copy(emC);
    e.uGain.value = I.emGain * 0.85;
    e.uTime.value = I.t;
    e.uHero.value = I.hero - I.exLen;
    const s = I.sc.material.uniforms;
    s.uColor.value.copy(exC);
    s.uGain.value = I.exGain * (wheelOpen && hasPlate ? 0.32 : 0);
    s.uTime.value = I.t;
    s.uHero.value = -10;

    // ---- カメラ: パルスを追い、止まっているときは全体を見せる --------------------
    if (active) pathPoint(Math.min(I.hero, I.total), _p);
    else _p.set(-1.3, 0.75, 0);
    const follow = active ? 0.4 : 0;
    _p.set(-1.3 + (_p.x + 1.3) * follow, 0.75 + (_p.y - 0.75) * follow, 0);
    I.look.x = damp(I.look.x, _p.x, 3.2, dt);
    I.look.y = damp(I.look.y, _p.y, 3.2, dt);
    const fitH = 5.9 / Math.tan((I.cam.fov * Math.PI) / 360);
    const fitW = 3.5 / (Math.tan((I.cam.fov * Math.PI) / 360) * I.cam.aspect);
    const dist = Math.max(fitH, fitW) * (active ? 0.9 : 1.0);
    I.dist = damp(I.dist || dist, dist, 2.5, dt);
    const sway = Math.sin(I.t * 0.5) * 0.22 + 0.3;
    I.cam.position.set(I.look.x + Math.sin(sway) * I.dist, I.look.y + 1.2, Math.cos(sway) * I.dist);
    I.cam.lookAt(I.look);

    // ---- 描画（本体と同じ HDR ターゲットの一角へ） ------------------------------
    const r = I.renderer;
    const R = I.rect;
    if (rt) {
      const sc = rt.width / window.innerWidth;
      const x = Math.round(R.x * sc);
      const y = Math.round(R.y * sc);
      const wv = Math.round(R.w * sc);
      const hv = Math.round(R.h * sc);
      rt.viewport.set(x, y, wv, hv);
      rt.scissor.set(x, y, wv, hv);
      rt.scissorTest = true;
      r.setRenderTarget(rt);
      r.render(I.scene, I.cam);
      rt.viewport.set(0, 0, rt.width, rt.height);
      rt.scissor.set(0, 0, rt.width, rt.height);
      rt.scissorTest = false;
    } else {
      r.setViewport(R.x, R.y, R.w, R.h);
      r.setScissor(R.x, R.y, R.w, R.h);
      r.setScissorTest(true);
      r.render(I.scene, I.cam);
      r.setScissorTest(false);
      r.setViewport(0, 0, window.innerWidth, window.innerHeight);
    }
  };
})();
