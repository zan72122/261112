/* App: renderer, lighting, interaction, modes, labels and the frame loop. */
(function () {
  'use strict';
  const MT = window.MT, T = THREE, K = MT.K, Sim = MT.Sim, S = Sim.S, Audio = MT.Audio;
  const $ = id => document.getElementById(id);
  const canvas = $('gl');
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const TAU = Math.PI * 2;

  // ---------------------------------------------------------------- renderer
  // Quality tier: 'high' on a GPU, 'lite' when WebGL is software-rendered (e.g. headless
  // SwiftShader). Override with ?q=high or ?q=lite (or #q=high / #q=lite).
  const opt = (location.search + '&' + location.hash).toLowerCase();
  function softwareGL() {
    try {
      const c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) return false;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
    } catch (e) { return false; }
  }
  const lite = /q=lite/.test(opt) ? true : /q=high/.test(opt) ? false : softwareGL();
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: !lite, powerPreference: 'high-performance' });
  } catch (e) {
    $('boot').innerHTML = '<p style="font-size:14px;opacity:.8">WebGL を利用できません</p>';
    return;
  }
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const maxPR = Math.min(window.devicePixelRatio || 1, 2);
  const prOpt = (/pr=([0-9.]+)/.exec(opt) || [])[1];        // ?pr=1 pins the render scale (no adaptation)
  let pixelRatio = prOpt ? clamp(+prOpt, 0.3, 3) : lite ? Math.min(maxPR, 0.7) : maxPR;
  renderer.setPixelRatio(pixelRatio);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 30, 14000);
  const HOME = { pos: new T.Vector3(600, 392, 850), target: new T.Vector3(46, 152, 150) };
  camera.position.copy(HOME.pos);

  MT.buildTextures();
  MT.buildMaterials(lite);
  const machine = MT.buildMachine();
  const parts = machine.parts, refs = machine.refs;
  scene.add(machine.root);

  // bench + grounding shadow
  const bench = new T.Mesh(new T.CircleGeometry(4200, 72).rotateX(-Math.PI / 2), MT.Mat.bench);
  bench.receiveShadow = !lite; scene.add(bench);
  {
    const uv = bench.geometry.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 3, uv.getY(i) * 3);
    const blob = new T.Mesh(new T.PlaneGeometry(700, 900).rotateX(-Math.PI / 2), MT.Mat.blob);
    blob.position.set(0, 0.6, 115); blob.renderOrder = 1; scene.add(blob);
  }

  // lights
  const key = new T.DirectionalLight(0xfff3e4, 2.5);
  key.position.set(430, 800, 560); key.target.position.set(0, 110, 130);
  key.castShadow = true; key.shadow.mapSize.set(lite ? 1024 : 2048, lite ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -440, right: 440, top: 430, bottom: -330, near: 200, far: 2000 });
  key.shadow.bias = -0.0005; key.shadow.normalBias = 1.4; key.shadow.radius = 4;
  const hemi = new T.HemisphereLight(0xdfe8ff, 0x3b3731, 0.3);
  const rim = new T.DirectionalLight(0xcfe0ff, 0.7); rim.position.set(-640, 190, -520);
  const rim2 = new T.DirectionalLight(0xff7fb4, 0); rim2.position.set(640, 150, -460);
  scene.add(key, key.target, hemi);
  if (!lite) scene.add(rim);
  scene.fog = new T.Fog(0x2f3236, 2200, 6400);

  // ---------------------------------------------------------------- controls
  const controls = new T.OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.085;
  controls.rotateSpeed = 0.75; controls.zoomSpeed = 0.9; controls.panSpeed = 0.7;
  controls.minDistance = 190; controls.maxDistance = 2600;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.copy(HOME.target);
  controls.addEventListener('change', () => {       // keep the target near the machine and above the bench
    const t = controls.target;
    t.x = clamp(t.x, -260, 300); t.y = clamp(t.y, 20, 360); t.z = clamp(t.z, -220, 460);
  });

  // ---------------------------------------------------------------- wax + ribbon
  const WAX = [0x18c9b4, 0xff7650, 0x8f7dff, 0xf4c22e, 0x4fb4ff];
  let waxIdx = 0, waxLin = [0, 0, 0], waxS = [0, 0, 0];
  function setWax(i) {
    waxIdx = i % WAX.length;
    const hex = WAX[waxIdx], c = new T.Color(hex);
    waxLin = [c.r, c.g, c.b];
    waxS = [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
    machine.waxSet(hex);
  }
  setWax(0);
  const ribbon = MT.RibbonSim();
  const ribbonView = MT.RibbonView(ribbon, refs.knifeEx, { map: MT.makePatternTexture(true) });
  const debris = MT.Debris(ribbon, refs.knifeEx);
  const inset = MT.Inset($('inset'));
  parts.ribbon = { id: 'ribbon', name: 'リボン', desc: '切片が1枚ずつつながってできた帯', g: null, ex: new T.Vector3(), k: 0, target: 0, hint: '', anchor: new T.Object3D(), hot: null };
  refs.knifeEx.add(parts.ribbon.anchor);

  // ---------------------------------------------------------------- modes
  const MODES = {
    real: { bg: 0x2f3236, exposure: 1.0, envI: 0.95, key: [0xfff3e4, 2.5], rim: [0xcfe0ff, 0.7], rim2: 0, hemi: 0.3, accent: 0xffffff, glow: 0.05, bench: 0xffffff },
    play: { bg: 0x141b2c, exposure: 1.05, envI: 1.0, key: [0xfff0dc, 2.6], rim: [0x9fe2ff, 0.6], rim2: 0.2, hemi: 0.28, accent: 0xffd23f, glow: 0.22, bench: 0xa4abc6 },
  };
  const envs = {};
  let mode = /real/.test(location.hash) ? 'real' : 'play';
  const accent = new T.Color();
  function applyMode(m) {
    mode = m;
    const c = MODES[m];
    if (!lite) {         // image-based lighting only in the high tier (the lite tier uses matcaps on metals)
      if (!envs[m]) envs[m] = MT.buildEnvironment(renderer, m);
      scene.environment = envs[m]; scene.environmentIntensity = c.envI;
    }
    scene.background = new T.Color(c.bg); scene.fog.color.set(c.bg);
    renderer.toneMappingExposure = c.exposure;
    key.color.set(c.key[0]); key.intensity = c.key[1];
    rim.color.set(c.rim[0]); rim.intensity = c.rim[1]; rim2.intensity = c.rim2; hemi.intensity = lite ? 1.9 : c.hemi;
    if (lite) { hemi.color.set(m === 'play' ? 0xe6ecff : 0xffffff); hemi.groundColor.set(m === 'play' ? 0x6f7690 : 0x8d8a84); key.intensity = c.key[1] * 1.15; }
    if (!lite) { if (c.rim2 > 0) scene.add(rim2); else scene.remove(rim2); }
    MT.Mat.bench.color.set(c.bench); if (lite) MT.Mat.bench.color.multiplyScalar(0.62);
    accent.set(c.accent);
    ribbonView.glow.value = c.glow;
    outlineMat.uniforms.uC.value.copy(accent);
    hl.mats.forEach(mm => { if (mm.emissive) mm.emissive.copy(accent); });
    document.body.classList.toggle('play', m === 'play');
    document.body.classList.toggle('real', m === 'real');
    document.documentElement.style.background = '#' + new T.Color(c.bg).getHexString();
    needShadow = true;
  }

  // ---------------------------------------------------------------- selection / highlight / explode
  const outlineMat = new T.ShaderMaterial({
    side: T.BackSide, uniforms: { uC: { value: new T.Color(0xffffff) }, uW: { value: 1.5 } },
    vertexShader: 'uniform float uW; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vec3 n = normalize(normalMatrix * normal); mv.xyz += n * uW * (-mv.z) * 0.0011; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 uC; void main(){ gl_FragColor = vec4(uC, 1.0); }',
  });
  const hl = { mats: new Map(), outlines: [] };
  let selected = null, needShadow = true;
  function hlMat(m) {
    let c = hl.mats.get(m);
    if (!c) {
      c = m.clone();
      if (c.emissive) { c.emissive = accent.clone(); c.emissiveIntensity = 0.1; c.emissiveMap = null; }
      hl.mats.set(m, c);
    }
    return c;
  }
  function highlight(id, on) {
    if (id === 'ribbon') return;
    const list = [];
    machine.root.traverse(o => { if (o.isMesh && o.userData.part === id) list.push(o); });
    for (const o of list) {
      if (on) {
        o.userData.om = o.material;
        o.material = Array.isArray(o.material) ? o.material.map(hlMat) : hlMat(o.material);
        const ol = new T.Mesh(o.geometry, outlineMat);
        ol.raycast = () => {}; ol.castShadow = false; ol.frustumCulled = o.frustumCulled;
        o.add(ol); hl.outlines.push(ol);
      } else if (o.userData.om) { o.material = o.userData.om; o.userData.om = null; }
    }
    if (!on) {
      hl.outlines.forEach(ol => ol.parent && ol.parent.remove(ol)); hl.outlines.length = 0;
      hl.mats.forEach(m => m.dispose()); hl.mats.clear();
    }
  }
  const HINT = { drag: 'ドラッグで動かす', toggle: 'もう一度タップで操作' };
  function select(id, silent) {
    if (selected === id) return;
    if (selected) { parts[selected].target = 0; highlight(selected, false); }
    selected = id;
    if (id) {
      parts[id].target = 1; highlight(id, true);
      if (!silent) Audio.pop();
      showLabel(id);
      if (id === 'tray') emptyTray();
      if (id === 'housing' || id === 'crank' || id === 'feed') refs.mech.visible = true;
    } else { hideLabel(); if (!silent) Audio.unpop(); }
    needShadow = true;
  }
  function emptyTray() { ribbon.clearSettled(); debris.clear(); inset.breakRibbon(); Audio.whoosh(); goodRun = 0; }

  // ---------------------------------------------------------------- labels
  const labelEl = $('label'), toastEl = $('toast'), leadEl = $('lead'), leadLine = $('leadLine'), leadDot = $('leadDot');
  let labelPart = null, toast = null;
  const flashLog = [];
  const v3 = new T.Vector3();
  function showLabel(id) {
    const p = parts[id]; labelPart = id;
    labelEl.children[0].textContent = p.name; labelEl.children[1].textContent = p.desc; labelEl.children[2].textContent = HINT[p.hint] || '';
    labelEl.classList.add('on'); leadEl.classList.add('on');
  }
  function hideLabel() { labelPart = null; labelEl.classList.remove('on'); leadEl.classList.remove('on'); }
  function flash(id, text, ms) {
    const p = parts[id]; if (!p) return;
    toast = { obj: p.hot || p.anchor, until: performance.now() + (ms || 1500) };
    toastEl.textContent = text; toastEl.classList.add('on');
    flashLog.push(text); if (flashLog.length > 40) flashLog.shift();
  }
  function project(obj, out) {
    obj.getWorldPosition(v3); v3.project(camera);
    out.x = (v3.x * 0.5 + 0.5) * innerWidth; out.y = (-v3.y * 0.5 + 0.5) * innerHeight; out.ok = v3.z < 1 && v3.z > -1;
    return out;
  }
  const sp = { x: 0, y: 0, ok: true };
  function updateLabels(now) {
    if (labelPart) {
      const p = parts[labelPart];
      if (labelPart === 'ribbon') placeRibbonAnchor();
      project(p.anchor, sp);
      const w = labelEl.offsetWidth, h = labelEl.offsetHeight;
      let bx = sp.x + 46, by = sp.y - h - 38;
      if (bx + w > innerWidth - 10) bx = sp.x - 46 - w;
      if (by < 54) by = Math.min(innerHeight - h - 10, sp.y + 40);
      bx = clamp(bx, 10, innerWidth - w - 10); by = clamp(by, 10, innerHeight - h - 10);
      labelEl.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px)';
      const ex = clamp(sp.x, bx, bx + w), ey = clamp(sp.y, by, by + h);
      leadLine.setAttribute('x1', sp.x); leadLine.setAttribute('y1', sp.y); leadLine.setAttribute('x2', ex); leadLine.setAttribute('y2', ey);
      leadDot.setAttribute('cx', sp.x); leadDot.setAttribute('cy', sp.y);
      labelEl.style.visibility = leadEl.style.visibility = sp.ok ? 'visible' : 'hidden';
    }
    if (toast) {
      if (now > toast.until) { toast = null; toastEl.classList.remove('on'); }
      else {
        project(toast.obj, sp);
        const w = toastEl.offsetWidth, h = toastEl.offsetHeight;
        const bx = clamp(sp.x - w / 2, 8, innerWidth - w - 8), by = clamp(sp.y - h - 30, 8, innerHeight - h - 8);
        toastEl.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px)';
      }
    }
  }
  function placeRibbonAnchor() {
    const ss = ribbon.strands; if (!ss.length) return;
    const s = ss[ss.length - 1], i = Math.max(0, Math.floor(s.n * 0.5));
    parts.ribbon.anchor.position.set(0, s.y[i], s.z[i]);
  }

  // ---------------------------------------------------------------- hotspots (beginner mode)
  const hot = {};
  for (const id of ['wheel', 'dial', 'coarse', 'lock', 'guard', 'clamp']) {
    const m = new T.SpriteMaterial({ map: MT.Tex.ring, color: 0xffd23f, transparent: true, depthTest: false, depthWrite: false, opacity: 0 });
    const s = new T.Sprite(m); s.renderOrder = 30; s.raycast = () => {};
    parts[id].hot.add(s);
    hot[id] = { s, used: false, a: 0, size: id === 'wheel' ? 40 : 26, ph: Math.random() * 6 };
  }
  const arcMat = new T.MeshBasicMaterial({ map: MT.Tex.arc, color: 0xffd23f, transparent: true, depthWrite: false, opacity: 0, side: T.DoubleSide });
  const arc = new T.Mesh(new T.PlaneGeometry(250, 250).rotateY(Math.PI / 2), arcMat);
  arc.scale.z = -1; arc.position.set(K.wheel[0] + 34, K.wheel[1], K.wheel[2]); arc.renderOrder = 29; arc.raycast = () => {};
  parts.wheel.g.add(arc);
  function use(id) { if (hot[id]) hot[id].used = true; }

  // ---------------------------------------------------------------- animated state
  const A = { guard: 1, lock: 0, clamp: 0, slide: 0 };   // eased towards the sim state
  let goodRun = 0, shake = 0, lampT = 0;
  let reload = null;       // block-change sequence
  const events = [];
  const cool = {};
  function coolDown(k, ms, now) { if (cool[k] && now - cool[k] < ms) return false; cool[k] = now; return true; }

  function operated() {    // any real operation puts exploded working parts back
    if (selected && selected !== 'housing' && selected !== 'crank' && selected !== 'feed' && selected !== 'base') select(null, true);
  }
  function toggle(id) {
    operated(); use(id);
    if (id === 'lock') Sim.toggleLock(events);
    else if (id === 'guard') Sim.toggleGuard(events);
    else if (id === 'clamp') startReload();
  }
  function startReload() {
    if (reload) return;
    if (!Sim.canReload()) { flash('clamp', '刃からはなしてから交換', 1700); Audio.limit(); return; }
    S.busy = true; S.omega = 0;
    reload = { t: 0, f0: S.F, swapped: false, s: 0 };
    Audio.clampClick(true);
  }
  function stepReload(dt) {
    const r = reload; r.t += dt;
    const t = r.t;
    const seg = (a, b) => clamp((t - a) / (b - a), 0, 1), ez = x => x * x * (3 - 2 * x);
    A.clamp = t < 1.5 ? ez(seg(0, 0.22)) : 1 - ez(seg(1.5, 1.72));
    A.slide = t < 0.95 ? ez(seg(0.2, 0.58)) * 120 : (1 - ez(seg(1.1, 1.5))) * 120;
    if (r.s === 0 && t > 0.2) { r.s = 1; Audio.slide(); }
    if (r.s === 1 && t > 0.58) { r.s = 2; Audio.zip(0.36); }
    if (t > 0.58 && !r.swapped) S.F = r.f0 + (S.um * 0.001 - r.f0) * ez(seg(0.58, 0.95));
    if (!r.swapped && t >= 0.98) {
      r.swapped = true;
      Sim.finishReload(); setWax(waxIdx + 1); inset.breakRibbon(); ribbon.detach(); goodRun = 0;
    }
    if (r.s === 2 && t > 1.1) { r.s = 3; Audio.slide(); }
    if (r.s === 3 && t > 1.5) { r.s = 4; Audio.clampClick(false); }
    if (t > 1.75) { reload = null; S.busy = false; A.clamp = 0; A.slide = 0; flash('block', '新しいテストブロック', 1400); }
    needShadow = true;
  }

  // ---------------------------------------------------------------- sim events -> sound, ribbon, feedback
  let cutLevel = 0, cutKind = 'section';
  function handleEvents(now) {
    for (const e of events) {
      switch (e.t) {
        case 'ratchet': Audio.ratchet(); break;
        case 'dial': Audio.dial(); break;
        case 'coarseClick': Audio.coarse(); break;
        case 'cutStart':
          ribbon.beginSection({ um: e.p * 1000, mm: e.p, kind: e.kind, color: waxLin });
          Audio.setCutTone(e.p * 1000);
          if (e.kind === 'chunk') { Audio.crack(); flash('blade', '厚すぎ! かたまりになった', 1900); shake = 1; goodRun = 0; }
          break;
        case 'cutProg':
          ribbon.feed(e.u); cutKind = e.kind;
          cutLevel = Math.max(cutLevel, e.kind === 'chunk' ? 0.5 : clamp(0.1 + e.speed * 0.035, 0.1, 0.5) * (0.6 + Math.min(e.p * 1000, 20) / 30));
          if (e.kind === 'chunk' && Math.random() < 0.5) debris.burst(1, K.yE - 1, K.zE + 2, waxLin, 70, K.bw, 1.4);
          break;
        case 'crumple':
          ribbon.markCrumple(); Audio.crumple(); flash('blade', '速すぎ! リボンがくしゃくしゃ', 1900); shake = 0.7; goodRun = 0;
          break;
        case 'cutEnd': {
          const brokeOff = e.kind === 'chunk' || e.crumple;
          const jam = ribbon.endSection(brokeOff);
          inset.addSection(e.p, waxS, e.crumple, e.kind === 'chunk');
          if (brokeOff || jam) { inset.breakRibbon(); Audio.tear(); if (jam) flash('blade', 'リボンが切れた', 1400); }
          if (e.kind === 'chunk') debris.burst(10, K.yE - 2, K.zE + 3, waxLin, 90, K.bw, 1.5);
          else if (e.crumple) debris.burst(6, K.yE - 2, K.zE + 3, waxLin, 80, K.bw, 0.9);
          else { goodRun++; Audio.good(goodRun - 1); if (mode === 'play') debris.burst(2, K.yE - 1, K.zE + 2, waxLin, 50, K.bw, 0.6); }
          break;
        }
        case 'scrape':
          Audio.scrape(); debris.burst(e.p > 0.03 ? 14 : 5, K.yE + 2, K.zE - 1, waxLin, 60, K.bw, e.p > 0.03 ? 1.4 : 0.7);
          if (coolDown('scrape', 1500, now)) flash('blade', '逆まわし: 刃でこすった', 1600);
          goodRun = 0;
          break;
        case 'lockClunk': Audio.clunk(); shake = Math.max(shake, 0.5); if (coolDown('lock', 900, now)) flash('lock', 'ロック中! 回らない', 1500); break;
        case 'lockOn': Audio.lock(true); flash('lock', 'ロック', 900); break;
        case 'lockOff': Audio.lock(false); flash('lock', '解除', 900); break;
        case 'guardThud': Audio.thud(); shake = Math.max(shake, 0.35); if (coolDown('guard', 900, now)) flash('guard', 'ガードが閉じていて切れない', 1700); break;
        case 'guardClose': Audio.snap(false); flash('guard', 'ガード 閉', 900); break;
        case 'guardOpen': Audio.snap(true); flash('guard', 'ガード 開', 900); break;
        case 'guardRefuse': Audio.thud(); flash('guard', 'ブロックがじゃまで閉じない', 1500); break;
        case 'coarseBlocked': if (coolDown('cb', 700, now)) { Audio.limit(); flash('coarse', '刃の前では送れない', 1500); } break;
        case 'coarseLimit': if (coolDown('cl', 700, now)) { Audio.limit(); flash('coarse', S.F <= K.Fmin + 1e-6 ? 'これ以上もどせない' : 'これ以上は送れない', 1500); } break;
        case 'blockOut':
          Audio.blockOut(); flash('clamp', 'ブロック終了 ― 安全停止', 4200); hot.clamp.used = false; shake = 0.6;
          break;
      }
    }
    events.length = 0;
  }

  // ---------------------------------------------------------------- pointer interaction
  const OPER = { wheel: 'drag', dial: 'drag', coarse: 'drag', lock: 'toggle', guard: 'toggle', clamp: 'toggle' };
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  const pickables = [];
  machine.root.traverse(o => { if (o.isMesh && o.userData.part && o.userData.part !== 'ribbon') pickables.push(o); });
  const pickAll = pickables.concat([ribbonView.mesh, ribbonView.cmesh]);
  function shown(o) { for (; o; o = o.parent) if (!o.visible) return false; return true; }
  function pick(x, y, all) {
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(all ? pickAll : pickables, false);
    for (const h of hits) if (shown(h.object)) return h;
    return null;
  }
  let press = null, pointers = 0;
  const wc = new T.Vector3(), tmp = new T.Vector3(), tmp2 = new T.Vector3();
  const plane = new T.Plane();
  function wheelAngle(x, y, px) {  // angle of the pointer around the hub, in the plane through the grabbed point
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    refs.wheelRot.getWorldPosition(wc); wc.x = px;
    plane.setFromNormalAndCoplanarPoint(tmp.set(1, 0, 0), wc);
    if (Math.abs(ray.ray.direction.x) < 0.3) return null;
    if (!ray.ray.intersectPlane(plane, tmp)) return null;
    return Math.atan2(tmp.z - wc.z, tmp.y - wc.y);
  }
  function wheelTangent() {        // screen px per radian at the rim point nearest the camera
    refs.wheelRot.getWorldPosition(wc); wc.x += 13;
    const ph = Math.atan2(camera.position.z - wc.z, camera.position.y - wc.y), R = 96;
    tmp.set(wc.x, wc.y + R * Math.cos(ph), wc.z + R * Math.sin(ph));
    tmp2.set(wc.x, wc.y + R * Math.cos(ph + 0.05), wc.z + R * Math.sin(ph + 0.05));
    tmp.project(camera); tmp2.project(camera);
    return [((tmp2.x - tmp.x) * innerWidth * 0.5) / 0.05, ((tmp.y - tmp2.y) * innerHeight * 0.5) / 0.05];
  }
  function beginWheel(e, hit) {
    const px = hit ? hit.point.x : K.wheel[0] + 13;
    const a = wheelAngle(e.clientX, e.clientY, px);
    press.wheel = { a, acc: 0, t0: S.theta, px };
    S.drag = { target: S.theta, slip: 0, clunked: false };
  }
  function moveWheel(e) {
    const w = press.wheel;
    const a = wheelAngle(e.clientX, e.clientY, w.px);
    if (a !== null && w.a !== null) {
      let d = a - w.a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
      w.acc += d;
    } else {
      const tg = wheelTangent(), l2 = tg[0] * tg[0] + tg[1] * tg[1];
      if (l2 > 4) w.acc += ((e.clientX - press.lx) * tg[0] + (e.clientY - press.ly) * tg[1]) / l2;
    }
    w.a = a;
    if (S.drag) S.drag.target = w.t0 + w.acc;
  }
  const active = new Set();
  const release = e => { active.delete(e.pointerId); pointers = active.size; };
  window.addEventListener('pointerup', release, true);
  window.addEventListener('pointercancel', release, true);
  window.addEventListener('blur', () => { active.clear(); pointers = 0; cancelPress(); });
  canvas.addEventListener('pointerdown', e => {
    Audio.resume();
    active.add(e.pointerId); pointers = active.size;
    if (pointers > 1 || (e.pointerType === 'mouse' && e.button !== 0)) { cancelPress(); return; }
    const h = pick(e.clientX, e.clientY, true);
    const id = h ? h.object.userData.part : null;
    press = { id, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), moved: false, op: null, pid: e.pointerId, um0: S.um, done: false };
    if (id && OPER[id] && !S.busy) {
      press.op = id; controls.enabled = false;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointers */ }
      if (id === 'wheel') beginWheel(e, h);
      canvas.style.cursor = 'grabbing';
    }
  }, true);
  function cancelPress() {
    if (press && press.op === 'wheel') S.drag = null;
    press = null; controls.enabled = true;
  }
  canvas.addEventListener('pointermove', e => {
    if (!press || press.pid !== e.pointerId) { if (pointers === 0) hover(e); return; }
    const dx = e.clientX - press.x, dy = e.clientY - press.y;
    if (!press.moved && Math.hypot(dx, dy) > 5) {
      press.moved = true;
      if (press.op) { operated(); use(press.op); }
    }
    if (press.moved && press.op) {
      const id = press.op;
      if (id === 'wheel') moveWheel(e);
      else if (id === 'dial') Sim.setUm(press.um0 + Math.round((dx - dy) / 15), events);
      else if (id === 'coarse') Sim.coarse(((e.clientX - press.lx) - (e.clientY - press.ly)) * 0.02, events);
      else if (!press.done && Math.hypot(dx, dy) > 14) { press.done = true; toggle(id); }
    }
    press.lx = e.clientX; press.ly = e.clientY;
  }, true);
  function endPointer(e) {
    active.delete(e.pointerId); pointers = active.size;
    if (!press || press.pid !== e.pointerId) { if (pointers === 0) controls.enabled = true; return; }
    const p = press;
    if (p.op === 'wheel') S.drag = null;
    press = null; controls.enabled = true; canvas.style.cursor = '';
    if (e.type === 'pointerup' && !p.moved && performance.now() - p.t < 650) click(p.id);
  }
  canvas.addEventListener('pointerup', endPointer, true);
  canvas.addEventListener('pointercancel', endPointer, true);
  canvas.addEventListener('lostpointercapture', e => { if (press && press.pid === e.pointerId) endPointer(e); });
  function click(id) {
    if (!id) { select(null); return; }
    if (selected === id) {
      if (OPER[id] === 'toggle') toggle(id); else select(null);
      return;
    }
    select(id);
  }
  let hoverT = 0, hoverId = null;
  function hover(e) {
    const now = performance.now();
    if (now - hoverT < 45) return; hoverT = now;
    const h = pick(e.clientX, e.clientY, false);
    hoverId = h ? h.object.userData.part : null;
    canvas.style.cursor = hoverId && OPER[hoverId] ? (OPER[hoverId] === 'drag' ? 'grab' : 'pointer') : hoverId ? 'pointer' : '';
  }
  // wheel over a control operates it instead of zooming
  canvas.addEventListener('wheel', e => {
    const h = pick(e.clientX, e.clientY, false), id = h ? h.object.userData.part : null;
    if (!id || OPER[id] !== 'drag' || S.busy) return;
    e.preventDefault(); e.stopImmediatePropagation();
    Audio.resume(); operated(); use(id);
    const dir = e.deltaY > 0 ? 1 : -1;
    if (id === 'dial') Sim.setUm(S.um - dir, events);
    else if (id === 'coarse') Sim.coarse(-dir * 0.314, events);
    else if (!S.lock) S.omega = clamp(S.omega + dir * 2.2, -30, 30);
    else events.push({ t: 'lockClunk' });
  }, { capture: true, passive: false });
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  // keyboard (no visible UI): arrows turn / set thickness, L lock, G guard, B new block, M mode, S sound, F fullscreen
  window.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    Audio.resume();
    const k = e.key.toLowerCase();
    if (k === 'arrowright' || k === ' ') { operated(); use('wheel'); if (S.lock) events.push({ t: 'lockClunk' }); else if (!S.busy) S.omega = clamp(S.omega + 1.6, -30, 30); e.preventDefault(); }
    else if (k === 'arrowleft') { operated(); if (S.lock) events.push({ t: 'lockClunk' }); else if (!S.busy) S.omega = clamp(S.omega - 1.6, -30, 30); e.preventDefault(); }
    else if (k === 'arrowup') { use('dial'); Sim.setUm(S.um + 1, events); e.preventDefault(); }
    else if (k === 'arrowdown') { use('dial'); Sim.setUm(S.um - 1, events); e.preventDefault(); }
    else if (k === 'l') toggle('lock');
    else if (k === 'g') toggle('guard');
    else if (k === 'b') toggle('clamp');
    else if (k === 'm') applyMode(mode === 'play' ? 'real' : 'play');
    else if (k === 's') setSound(!Audio.enabled);
    else if (k === 'f') fullscreen();
    else if (k === 'escape') select(null);
    else if (k === 'h') { camera.position.copy(homePos()); controls.target.copy(HOME.target); }
  });

  // ---------------------------------------------------------------- fixed UI buttons
  function setSound(on) { Audio.setEnabled(on); document.body.classList.toggle('mute', !on); }
  function fullscreen() {
    const d = document, el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else { const f = el.requestFullscreen || el.webkitRequestFullscreen; if (f) { const r = f.call(el); if (r && r.catch) r.catch(() => {}); } }
  }
  $('bMode').addEventListener('click', () => { Audio.resume(); applyMode(mode === 'play' ? 'real' : 'play'); Audio.pop(); });
  $('bSound').addEventListener('click', () => { setSound(!Audio.enabled); Audio.dial(); });
  $('bFull').addEventListener('click', fullscreen);

  // ---------------------------------------------------------------- resize / quality
  function homePos() {
    const asp = innerWidth / innerHeight, k = asp < 1.25 ? clamp(1.25 / asp, 1, 2.3) : 1;
    return HOME.pos.clone().sub(HOME.target).multiplyScalar(k).add(HOME.target);
  }
  function resize() {
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  camera.position.copy(homePos());
  resize();

  const stats = { frames: 0, fps: 0, ms: 16, pixelRatio, lowT: 0, highT: 0, lite };
  function govern(dtMs) {
    stats.ms += (dtMs - stats.ms) * 0.06;
    stats.fps = 1000 / stats.ms; stats.pixelRatio = pixelRatio;
    if (stats.frames < 12 || prOpt) return;
    if (stats.ms > 30) { stats.lowT += dtMs; stats.highT = 0; } else if (stats.ms < 13) { stats.highT += dtMs; stats.lowT = 0; } else { stats.lowT = stats.highT = 0; }
    if (stats.lowT > 700 && pixelRatio > 0.5) {
      pixelRatio = Math.max(0.5, pixelRatio * 0.8); stats.lowT = 0; resize();
      if (pixelRatio < 0.8 && key.shadow.mapSize.x > 1024) { key.shadow.mapSize.set(1024, 1024); if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; } needShadow = true; }
    } else if (stats.highT > 4000 && pixelRatio < maxPR) { pixelRatio = Math.min(maxPR, pixelRatio * 1.15); stats.highT = 0; resize(); }
  }

  // ---------------------------------------------------------------- frame loop
  const poseState = { theta: 0, F: 0, retract: 0, um: 5, guard: 1, lock: 0, clamp: 0, slide: 0, W: K.W0, cutP: 0, cutU: 0 };
  const insetState = { theta: 0, um: 5, W: K.W0, pEff: 0, retract: 0, cut: null, col: waxS, blockOut: false, guardClosed: false, sections: 0 };
  let last = performance.now(), tickAcc = 0, auto = null, time = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const rawMs = now - last; last = now;
    stats.frames++;
    govern(rawMs);
    update(clamp(rawMs / 1000, 0.001, 0.1), now);
    draw(now);
  }
  let dirty = true;
  function update(dt, now) {
    time += dt;

    // scripted turning (used by the self-test; goes through the same path as a drag)
    if (auto) {
      if (auto.done) { if (!auto.coast) S.omega = 0; auto = null; S.drag = null; }
      else {
        if (!S.drag) S.drag = { target: S.theta, slip: 0, clunked: false };
        const d = Math.sign(auto.left) * Math.min(Math.abs(auto.left), auto.speed * dt);
        S.drag.target += d; auto.left -= d;
        if (Math.abs(auto.left) < 1e-6) auto.done = true;     // released on the next frame, after the wheel has caught up
      }
    }

    S.knifeAway = parts.knife.k > 0.02 || parts.blade.k > 0.02 || parts.head.k > 0.02 || parts.clamp.k > 0.02 || parts.block.k > 0.02;
    const th0 = S.theta;
    if (reload) stepReload(dt);
    Sim.step(dt, events);
    const dth = S.theta - th0;
    tickAcc += Math.abs(dth);
    while (tickAcc > 0.5236) { tickAcc -= 0.5236; Audio.tick(); }
    cutLevel *= Math.exp(-dt * 14);
    handleEvents(now);
    Audio.setCut(S.cut ? cutLevel : cutLevel * 0.5, cutKind);
    Audio.setWheel(dth / dt);

    // eased levers
    const e1 = 1 - Math.exp(-dt * 16);
    const gT = S.guardClosed ? 0 : 1, lT = S.lock ? 1 : 0;
    const moving = Math.abs(dth) > 1e-5 || Math.abs(A.guard - gT) > 0.002 || Math.abs(A.lock - lT) > 0.002;
    A.guard += (gT - A.guard) * e1; A.lock += (lT - A.lock) * e1;

    // explode
    let exploding = false;
    for (const id in parts) {
      const p = parts[id];
      if (Math.abs(p.target - p.k) > 0.0008) { p.k += (p.target - p.k) * (1 - Math.exp(-dt * (p.target ? 9 : 15))); exploding = true; }
      else p.k = p.target;
      if (p.g && id !== 'base') { const s = p.k * p.k * (3 - 2 * p.k); p.g.position.set(p.ex.x * s, p.ex.y * s, p.ex.z * s); }
    }
    { const k = parts.base.k, s = k * k * (3 - 2 * k); refs.upper.position.y = s * 34; }
    refs.mech.visible = parts.housing.k > 0.004 || selected === 'crank' || selected === 'feed';
    if (selected === 'crank' || selected === 'feed') { parts.housing.target = 1; } else if (selected !== 'housing') parts.housing.target = 0;

    // pose
    const ph = Sim.wrap(S.theta);
    poseState.theta = S.theta + S.wiggle; poseState.F = S.F; poseState.retract = Sim.retractAt(ph); poseState.um = S.um;
    poseState.guard = A.guard; poseState.lock = A.lock; poseState.clamp = A.clamp; poseState.slide = A.slide; poseState.W = S.W;
    poseState.cutP = S.cut ? S.cut.p : 0; poseState.cutU = S.cut ? S.cut.u : 0;
    machine.pose(poseState);

    // ribbon + debris
    ribbon.step(dt);
    ribbonView.update();
    const debrisMoving = debris.update(dt);

    // feedback: lamp, shake, hotspots
    lampT += dt;
    if (S.blockOut) { refs.lampMat.emissive.setHex(0xff2a18); refs.lampMat.emissiveIntensity = 1.2 + 1.6 * (Math.sin(lampT * 9) > 0 ? 1 : 0); }
    else if (S.lock) { refs.lampMat.emissive.setHex(0xffb020); refs.lampMat.emissiveIntensity = 1.8; }
    else { refs.lampMat.emissive.setHex(0x18c85a); refs.lampMat.emissiveIntensity = 1.6; }
    if (shake > 0.01 && mode === 'play') { machine.root.position.set((Math.random() - 0.5) * shake * 2.2, (Math.random() - 0.5) * shake * 1.2, 0); shake *= Math.exp(-dt * 13); }
    else { machine.root.position.set(0, 0, 0); shake = 0; }
    const pulse = 0.5 + 0.5 * Math.sin(time * 4.2);
    for (const id in hot) {
      const h = hot[id];
      const want = mode === 'play' && !h.used && !reload ? 1 : 0;
      h.a += (want - h.a) * (1 - Math.exp(-dt * 5));
      const pp = 0.5 + 0.5 * Math.sin(time * 4.2 + h.ph);
      h.s.material.opacity = h.a * (0.35 + 0.55 * pp); h.s.scale.setScalar(h.size * (0.85 + 0.3 * pp)); h.s.visible = h.a > 0.01;
    }
    arcMat.opacity = hot.wheel.a * (0.55 + 0.35 * pulse); arc.visible = arcMat.opacity > 0.01; arc.rotation.x = time * 1.1;
    hl.mats.forEach(m => { if (m.emissive) m.emissiveIntensity = 0.05 + 0.08 * pulse; });

    if (moving || exploding || needShadow || reload || debrisMoving || ribbonAwake()) { dirty = true; needShadow = false; }
  }
  function draw(now) {
    controls.update();
    if (dirty && (!lite || (stats.frames & 1) === 0)) { renderer.shadowMap.needsUpdate = true; dirty = false; }
    renderer.render(scene, camera);
    updateLabels(now);

    // inset
    if (mode === 'play') {
      insetState.theta = S.theta; insetState.um = S.um; insetState.W = S.W; insetState.pEff = Sim.pEff(); insetState.retract = poseState.retract;
      insetState.cut = S.cut; insetState.col = waxS; insetState.blockOut = S.blockOut; insetState.guardClosed = S.guardClosed; insetState.sections = S.sections;
      inset.draw(insetState);
    }
  }
  function ribbonAwake() { for (const s of ribbon.strands) if (!s.sleep && s.kind === 'chunk') return true; return false; }

  // ---------------------------------------------------------------- start
  applyMode(mode);
  machine.pose(poseState);
  renderer.compile(scene, camera);
  requestAnimationFrame(t => { last = t; frame(t); setTimeout(() => $('boot').classList.add('done'), 60); });

  // hooks for the automated self-test (tools/verify.cjs); not used by the UI
  MT.debug = {
    S, Sim, ribbon, parts, stats, camera, controls, renderer,
    turn(revs, revPerSec, coast) { auto = { left: revs * TAU, speed: Math.abs(revPerSec || 0.6) * TAU, coast: !!coast }; },
    // run the simulation for a while without waiting for real time (deterministic tests / screenshots)
    advance(sec) { const n = Math.round(sec * 60); for (let i = 0; i < n; i++) update(1 / 60, performance.now()); dirty = true; },
    get turning() { return !!auto; },
    select, toggle, applyMode, setSound, events, flashLog,
    get mode() { return mode; }, get selected() { return selected; },
    coarse(a) { Sim.coarse(a, events); },
    stop() { auto = null; S.drag = null; S.omega = 0; },
    setUm(v) { Sim.setUm(v, events); },
    // a screen pixel that really hits the given part (for synthetic pointer tests)
    screenOf(id) {
      const box = new T.Box3(), b2 = new T.Box3();
      machine.root.updateMatrixWorld(true);
      machine.root.traverse(o => { if (o.isMesh && o.userData.part === id && shown(o)) { b2.setFromObject(o); box.union(b2); } });
      if (box.isEmpty()) return null;
      let best = null;
      for (let i = 0; i < 9 && !best; i++) for (let j = 0; j < 9 && !best; j++) for (let k = 0; k < 3 && !best; k++) {
        v3.set(box.min.x + (box.max.x - box.min.x) * (0.5 + (i - 4) * 0.11), box.min.y + (box.max.y - box.min.y) * (0.5 + (j - 4) * 0.11), box.min.z + (box.max.z - box.min.z) * (k * 0.5)).project(camera);
        const x = (v3.x * 0.5 + 0.5) * innerWidth, y = (-v3.y * 0.5 + 0.5) * innerHeight;
        if (x < 2 || y < 2 || x > innerWidth - 2 || y > innerHeight - 2) continue;
        const h = pick(x, y, true);
        if (h && h.object.userData.part === id) best = { x, y };
      }
      return best;
    },
  };
})();
