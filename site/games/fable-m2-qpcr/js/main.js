// 起動・描画ループ・画質の自動調整・表示モード切り替え。
(function () {
  'use strict';
  const { clamp, lerp, damp } = QP.util;
  const V = QP.view;
  const FX = QP.fx;
  const params = QP.params;

  const canvas = document.getElementById('gl');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  } catch (e) {
    document.body.classList.add('nogl');
    return;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 6, 1600);

  // ---- 環境光: 手作りのスタジオ（ソフトボックス数枚）を PMREM 化 ------------------
  (function makeEnvironment() {
    const env = new THREE.Scene();
    const lightMat = (v, tint) => {
      const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      m.color.setRGB(v * (tint ? tint[0] : 1), v * (tint ? tint[1] : 1), v * (tint ? tint[2] : 1));
      return m;
    };
    const room = new THREE.Mesh(new THREE.BoxGeometry(60, 34, 60), lightMat(0.5));
    room.material.side = THREE.BackSide;
    room.position.y = 12;
    env.add(room);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), lightMat(0.6));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.9;
    env.add(floor);
    const panel = (w, h, v, pos, rot, tint) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), lightMat(v, tint));
      m.position.set(pos[0], pos[1], pos[2]);
      m.rotation.set(rot[0], rot[1], rot[2]);
      env.add(m);
    };
    panel(30, 22, 9, [-4, 28.5, 4], [Math.PI / 2, 0, 0]); // 天井の大きなソフトボックス
    panel(10, 26, 6, [-29, 10, 6], [0, Math.PI / 2, 0], [1, 0.97, 0.92]); // 左のストリップ
    panel(8, 22, 3.6, [29, 9, -6], [0, -Math.PI / 2, 0], [0.9, 0.95, 1]); // 右のストリップ
    panel(30, 9, 2.2, [0, 9, 29], [0, Math.PI, 0]); // 手前のフィル
    panel(48, 17, 4.6, [0, 21, -29.5], [0, 0, 0]); // 奥上の大きな面光源（上向きの艶面に映り込む）
    panel(40, 16, 5.5, [0, 28.6, -18], [Math.PI / 2, 0, 0]); // 天井の奥側
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.03).texture;
    pmrem.dispose();
  })();

  // ---- 背景（上下グラデーション） ---------------------------------------------
  const bgMat = new THREE.ShaderMaterial({
    uniforms: { uTop: { value: new THREE.Color() }, uBot: { value: new THREE.Color() } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 uTop; uniform vec3 uBot; varying vec3 vDir;
      void main(){ float t = smoothstep(-0.18, 0.55, normalize(vDir).y); gl_FragColor = vec4(mix(uBot, uTop, t), 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, depthWrite: false,
  });
  const bg = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 12), bgMat);
  bg.renderOrder = -10;
  bg.frustumCulled = false;
  scene.add(bg);
  const BG = {
    top0: new THREE.Color(0.62, 0.645, 0.68), bot0: new THREE.Color(0.2, 0.21, 0.23),
    top1: new THREE.Color(0.018, 0.022, 0.032), bot1: new THREE.Color(0.006, 0.007, 0.01),
  };

  // ---- 照明 -------------------------------------------------------------------
  const key = new THREE.DirectionalLight(0xfff3e6, 3.0);
  key.position.set(-40, 80, 55);
  key.target.position.set(0, 10, 8);
  key.castShadow = true;
  const sc = key.shadow.camera;
  sc.left = -64; sc.right = 64; sc.top = 64; sc.bottom = -64; sc.near = 20; sc.far = 220;
  key.shadow.radius = 5;
  key.shadow.blurSamples = 10;
  key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xd8e6ff, 0.55);
  fill.position.set(50, 36, -30);
  scene.add(fill);
  // ブロックの熱が周囲を照らす（体験モードのみ）
  const heatLight = new THREE.PointLight(0xff5a1a, 0, 28, 1.6);
  scene.add(heatLight);

  // ---- モデルと演出 -----------------------------------------------------------
  V.build(scene);
  FX.build(scene);
  QP.scene = scene;
  QP.camera = camera;
  QP.renderer = renderer;

  // three r163 以降、scene.environment を使うとマテリアル個別の envMapIntensity は無視される。
  // 金属や艶のある面だけ映り込みを強めたいので、環境マップを各マテリアルへ明示的に渡し、強さはここで一括管理する。
  const envMats = [];
  scene.traverse((o) => {
    const m = o.material;
    if (m && m.isMeshStandardMaterial && m.userData.envBase == null) {
      m.userData.envBase = m.envMapIntensity;
      m.envMap = scene.environment;
      envMats.push(m);
    }
  });

  let postOk = QP.post.init(renderer);
  if (QP.inset) QP.inset.build(renderer);

  const mode = { beginner: params.mode === 'beginner', kTarget: 0 };

  // ---- カメラ操作 -------------------------------------------------------------
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.085;
  controls.rotateSpeed = 0.85;
  controls.zoomSpeed = 0.9;
  controls.panSpeed = 0.8;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = 1.5;
  controls.screenSpacePanning = true;
  QP.controls = controls;
  // 既定の視点: 実機表示は正面寄り、体験モードは機構が見える斜め上から
  const HOME = { target: new THREE.Vector3(3, 16.5, 9) };
  // 縦持ちでは横幅が足りないので、より正面寄りから見て装置を大きく映す
  const ANGLE = {
    wide: { real: { az: 0.52, pol: 1.2 }, beginner: { az: 0.84, pol: 1.0 } },
    tall: { real: { az: 0.3, pol: 1.18 }, beginner: { az: 0.46, pol: 0.98 } },
  };
  const angle = () => ANGLE[camera.aspect < 0.8 ? 'tall' : 'wide'][mode.beginner ? 'beginner' : 'real'];
  const view = { dist: 150 };

  // 装置・開いたドロワー・ベンチ上の小物がすべて画面に収まる距離を二分探索で求める（縦持ちでも横持ちでも）
  const FIT = [];
  for (const x of [-18, 18]) {
    FIT.push([x, 0, -24], [x, 41, -24], [x, 41, 13], [x, 23.5, 22], [x, 0, 22]);
    FIT.push([x * 0.57, 4, 40.5], [x * 0.57, 19, 40.5]);
  }
  FIT.push([24.5, 1.5, 38], [15, 0, 38], [32, 0.5, 12], [32, 0.5, 25]); // ベンチ上のプレートとフィルム
  const _probe = new THREE.PerspectiveCamera();
  const _fp = new THREE.Vector3();
  function fitDistance() {
    const a = angle();
    _probe.fov = camera.fov;
    _probe.aspect = camera.aspect;
    _probe.near = 1;
    _probe.far = 4000;
    _probe.updateProjectionMatrix();
    // 画面端の固定コントロールと小窓のぶんだけ余白をとる
    const mx = 0.93;
    const my = camera.aspect < 0.8 ? 0.8 : 0.9;
    let lo = 40;
    let hi = 900;
    for (let i = 0; i < 18; i++) {
      const d = (lo + hi) / 2;
      _probe.position.setFromSphericalCoords(d, a.pol, a.az).add(HOME.target);
      _probe.lookAt(HOME.target);
      _probe.updateMatrixWorld(true);
      let ok = true;
      for (const q of FIT) {
        _fp.set(q[0], q[1], q[2]).project(_probe);
        if (Math.abs(_fp.x) > mx || Math.abs(_fp.y) > my) { ok = false; break; }
      }
      if (ok) hi = d; else lo = d;
    }
    return hi;
  }
  function goHome(instant) {
    view.dist = fitDistance();
    controls.minDistance = 16;
    controls.maxDistance = view.dist * 1.5;
    const a = angle();
    const to = new THREE.Vector3().setFromSphericalCoords(view.dist, a.pol, a.az).add(HOME.target);
    if (instant) {
      camera.position.copy(to);
      controls.target.copy(HOME.target);
      controls.update();
    } else flyTo(HOME.target, to);
  }
  // カメラをなめらかに移動（ダブルタップの注視・ホーム復帰）
  let fly = null;
  function flyTo(target, position) {
    fly = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1: position.clone(), t1: target.clone() };
  }
  QP.flyTo = flyTo;
  QP.goHome = goHome;
  QP.focusOn = function (point, radius) {
    const dir = camera.position.clone().sub(controls.target).normalize();
    const vf = (camera.fov * Math.PI) / 360;
    const hf = Math.atan(Math.tan(vf) * camera.aspect);
    const d = clamp((radius / Math.sin(Math.min(vf, hf))) * 1.5, controls.minDistance, controls.maxDistance);
    flyTo(point, point.clone().add(dir.multiplyScalar(d)));
  };
  // タッチパネルの正面へ寄る（スマホでは画面が小さいので、まず近づいてから操作する）
  QP.faceScreen = function () {
    const disp = V.housing.display;
    const gp = disp.geometry.parameters;
    const c = disp.getWorldPosition(new THREE.Vector3());
    const n = new THREE.Vector3(0, 0, 1).transformDirection(disp.matrixWorld);
    const vf = (camera.fov * Math.PI) / 360;
    const d = Math.max(gp.width / 2 / (Math.tan(vf) * camera.aspect * 0.84), gp.height / 2 / (Math.tan(vf) * 0.62));
    flyTo(c, c.clone().addScaledVector(n, d));
  };
  // タッチパネルが画面上で何ピクセル幅に見えているか
  QP.screenPixels = function () {
    const disp = V.housing.display;
    const gp = disp.geometry.parameters;
    const a = disp.localToWorld(new THREE.Vector3(-gp.width / 2, 0, 0)).project(camera);
    const b = disp.localToWorld(new THREE.Vector3(gp.width / 2, 0, 0)).project(camera);
    return Math.hypot((a.x - b.x) * 0.5 * window.innerWidth, (a.y - b.y) * 0.5 * window.innerHeight);
  };
  controls.addEventListener('start', () => { fly = null; if (QP.interact) QP.interact.autoZoom = false; });
  // パンで迷子にならないよう注視点を装置の周囲に留める
  const LIMIT = new THREE.Box3(new THREE.Vector3(-30, 2, -28), new THREE.Vector3(30, 44, 48));
  let camMoved = 0; // 視点が動いた直後の数フレームは必ず描く
  controls.addEventListener('change', () => {
    controls.target.clamp(LIMIT.min, LIMIT.max);
    camMoved = 4;
  });

  // ---- 画質段階（重いと判断したら自動で下げる） ---------------------------------
  const TIERS = [
    { px: 2.6e6, dpr: 2, samples: 4, bloom: true, shadow: 2048 },
    { px: 1.8e6, dpr: 2, samples: 4, bloom: true, shadow: 1024 },
    { px: 1.25e6, dpr: 1.6, samples: 2, bloom: true, shadow: 1024 },
    { px: 0.85e6, dpr: 1.3, samples: 0, bloom: true, shadow: 1024 },
    { px: 0.55e6, dpr: 1, samples: 0, bloom: false, shadow: 512 },
  ];
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  let tier = params.q != null ? clamp(parseInt(params.q, 10) || 0, 0, TIERS.length - 1) : coarse ? 1 : 0;
  const gov = { locked: params.q != null, ema: 16, slow: 0, warm: 0, probe: null };

  function resize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    const t = TIERS[tier];
    const pr = Math.min(window.devicePixelRatio || 1, t.dpr, Math.sqrt(t.px / (w * h)));
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 34 : 30;
    camera.updateProjectionMatrix();
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const samples = Math.min(t.samples, renderer.capabilities.maxSamples || 0);
    if (postOk) QP.post.setSize(size.x, size.y, samples);
    QP.post.bloom = t.bloom;
    if (key.shadow.mapSize.x !== t.shadow) {
      key.shadow.mapSize.set(t.shadow, t.shadow);
      if (key.shadow.map) {
        key.shadow.map.dispose();
        key.shadow.map = null;
      }
      if (key.shadow.mapPass) {
        key.shadow.mapPass.dispose();
        key.shadow.mapPass = null;
      }
    }
    FX.shadowDirty = true;
    const d = fitDistance();
    controls.minDistance = 16;
    controls.maxDistance = d * 1.5;
    view.dist = d;
    if (QP.inset) QP.inset.layout();
  }

  function govern(dt) {
    if (gov.locked || document.hidden) return;
    gov.warm += dt;
    if (gov.warm < 2.5) return;
    const ms = dt * 1000;
    gov.ema += (ms - gov.ema) * 0.06;
    if (gov.probe) {
      // 段を下げても速くならないなら、表示側の上限（省電力の 30fps など）と判断して戻す
      gov.probe.n++;
      if (gov.probe.n > 70) {
        if (gov.ema > gov.probe.before * 0.88) {
          tier = gov.probe.from;
          gov.locked = true;
          resize();
        }
        gov.probe = null;
        gov.slow = 0;
      }
      return;
    }
    gov.slow = gov.ema > 22.5 ? gov.slow + 1 : 0;
    if (gov.slow > 50 && tier < TIERS.length - 1) {
      gov.probe = { from: tier, before: gov.ema, n: 0 };
      tier++;
      resize();
    }
  }
  QP.quality = () => ({ tier, ema: gov.ema, locked: gov.locked });

  // ---- 表示モード -------------------------------------------------------------
  function setMode(beginner) {
    mode.beginner = beginner;
    mode.kTarget = beginner ? 1 : 0;
    document.body.classList.toggle('beginner', beginner);
    if (QP.ready) {
      goHome(false);
      QP.bus.emit('mode', beginner);
    }
  }
  QP.setMode = setMode;
  // カメラ移動とモード切り替えが落ち着いたか（検証スクリプトが待ち合わせに使う）
  QP.settled = () => !fly && V.k === mode.kTarget;
  QP.isBeginner = () => mode.beginner;

  function applyMode(k) {
    bgMat.uniforms.uTop.value.copy(BG.top0).lerp(BG.top1, k);
    bgMat.uniforms.uBot.value.copy(BG.bot0).lerp(BG.bot1, k);
    key.intensity = lerp(3.0, 1.25, k);
    fill.intensity = lerp(0.5, 0.3, k);
    const env = lerp(0.29, 0.17, k);
    scene.environmentIntensity = env;
    for (let i = 0; i < envMats.length; i++) envMats[i].envMapIntensity = envMats[i].userData.envBase * env;
    renderer.toneMappingExposure = lerp(1.0, 0.96, k);
    V.bench.blob.material.opacity = lerp(0.5, 0.25, k);
  }

  // ---- ガチャン・ゴトンの小さな画面揺れ（カメラ操作には影響させない） -----------------
  const shake = { amp: 0, off: new THREE.Vector3() };
  const bump = (a) => { shake.amp = Math.max(shake.amp, a); };
  QP.bus.on('refuse', () => bump(0.5));
  QP.bus.on('lid:jam', () => bump(0.42));
  QP.bus.on('drawer:end', (open) => bump(open ? 0.1 : 0.2));
  QP.bus.on('lid:end', (down) => bump(down ? 0.16 : 0.05));
  QP.bus.on('plate:land', (pose) => bump(pose === 'skew' ? 0.1 : 0.05));

  // ---- ループ -----------------------------------------------------------------
  let last = performance.now();
  let frames = 0;
  let ticks = 0;
  let shadowTimer = 0;
  const _hp = new THREE.Vector3();

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (dt <= 0) return;
    const S = QP.machine.S;

    QP.machine.update(dt);

    if (Math.abs(V.k - mode.kTarget) > 0.0005) {
      V.k = damp(V.k, mode.kTarget, 3.6, dt);
      if (Math.abs(V.k - mode.kTarget) < 0.004) V.k = mode.kTarget;
      FX.shadowDirty = true;
    }
    applyMode(V.k);

    if (fly) {
      fly.t = Math.min(1, fly.t + dt / 0.75);
      const e = QP.util.easeInOut(fly.t);
      camera.position.lerpVectors(fly.p0, fly.p1, e);
      controls.target.lerpVectors(fly.t0, fly.t1, e);
      if (fly.t >= 1) fly = null;
    }
    controls.update();

    if (QP.interact) QP.interact.update(dt);
    V.update(dt);
    FX.update(dt, camera);
    QP.screen.update(dt);
    if (QP.audio) QP.audio.update(dt);

    // 熱の照り返し
    const hot = QP.util.smooth((S.temp.block - 45) / 50);
    heatLight.intensity = V.k * (hot * 46 + (S.temp.block > 35 ? 6 : 0));
    heatLight.color.setRGB(1, 0.2 + 0.25 * (1 - hot), 0.04 + 0.9 * (1 - hot) * (1 - hot));
    V.thermal.block.getWorldPosition(_hp);
    heatLight.position.set(_hp.x, _hp.y + QP.D.yBlockTop + 1.5, _hp.z + QP.D.cz);

    // 影: 何かが動いたときだけ描き直す（走査中は間引く）
    shadowTimer += dt;
    const scanning = V.k > 0.5 && S.run.phase === 'scan';
    if (FX.shadowDirty || V.moving() || (QP.interact && QP.interact.animating) || (scanning && shadowTimer > 0.1)) {
      renderer.shadowMap.needsUpdate = true;
      FX.shadowDirty = false;
      shadowTimer = 0;
    }

    // 何も動いていないときは 1 フレームおきに描く（電池と発熱の節約。操作や運転が始まれば即フルレート）
    ticks++;
    const lively = S.run.active || V.moving() || S.fan.rpm > 0.02 || S.wheel.moving || fly || camMoved > 0
      || V.k !== mode.kTarget || (QP.interact && QP.interact.animating) || shake.amp > 0.002
      || FX.steam.mesh.visible || S.errorT > 0 || S.temp.block > 32 || frames < 4;
    if (camMoved > 0) camMoved--;
    if (!lively && ticks % 2) {
      govern(dt);
      return;
    }

    const time = now / 1000;
    if (shake.amp > 0.002) {
      shake.off.set(Math.sin(time * 91), Math.sin(time * 113 + 1), Math.sin(time * 77 + 2)).multiplyScalar(shake.amp * 0.5);
      camera.position.add(shake.off);
      camera.updateMatrixWorld();
      shake.amp *= Math.exp(-dt * 9);
    } else shake.off.set(0, 0, 0);
    if (postOk) {
      renderer.setRenderTarget(QP.post.rt);
      renderer.render(scene, camera);
      if (QP.inset) QP.inset.render(dt, QP.post.rt);
      QP.post.finish(time, {
        bloom: lerp(0.3, 0.62, V.k),
        threshold: lerp(1.7, 1.15, V.k),
        shimmer: FX.shimmerOn ? 1 : 0,
      });
    } else {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
      if (QP.inset) QP.inset.render(dt, null);
    }

    camera.position.sub(shake.off);

    frames++;
    if (frames === 2) {
      document.body.classList.add('ready');
      QP.ready = true;
    }
    QP.frames = frames;
    govern(dt);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 250));
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
  canvas.addEventListener('webglcontextrestored', () => { FX.shadowDirty = true; resize(); });

  resize();
  if (postOk) postOk = QP.post.validate();
  FX.shimmerEnabled = postOk;
  goHome(true);
  setMode(mode.beginner);
  if (mode.beginner) V.k = 1;
  if (QP.interact) QP.interact.init(canvas, camera);
  if (QP.ui) QP.ui.init();
  requestAnimationFrame(frame);
})();
