// main.js — 起動・描画ループ・入力・解像度制御・代替画面
import * as THREE from 'three';
import { Game } from './core.js';
import './play.js';
import './story.js';
import { Sound } from './audio.js';
import { buildEnvScene, L } from './models.js';
import { PEG_X, PEG_Y, NC, NR } from './bagsim.js';

function boot() {
  const canvas = document.getElementById('c'), fb = document.getElementById('fb'), fadeEl = document.getElementById('fade'), sa = document.getElementById('sa');
  const q = new URLSearchParams(location.search);
  const dbg = (window.__gf = { failed: false, ready: false });
  const fail = () => { fb.style.display = 'block'; canvas.style.display = 'none'; dbg.failed = true; };
  let gl = null;
  try {
    const attrs = { antialias: q.get('aa') !== '0' && q.get('low') !== '1', alpha: false, stencil: false, powerPreference: 'high-performance' };
    gl = canvas.getContext('webgl2', attrs);
  } catch (e) { gl = null; }
  if (!gl) { fail(); return; }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true }); } catch (e) { fail(); return; }
  let low = q.get('low') === '1' || (q.get('low') !== '0' && (navigator.hardwareConcurrency || 4) <= 2);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.localClippingEnabled = true;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xdfe7ee);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.08, 120); scene.add(camera);
  const makeEnv = () => { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(buildEnvScene(), 0.03).texture; pm.dispose(); };
  makeEnv(); scene.environmentIntensity = 0.32;
  // 朝の日ざし (通り側から差し込む)
  const sun = new THREE.DirectionalLight(0xfff0d8, 7.5); const sdir = new THREE.Vector3(0.09, -0.46, 0.865).normalize();
  sun.castShadow = !low; sun.shadow.mapSize.set(2048, 2048); if (low) sun.intensity = 3.0;
  const sc = sun.shadow.camera; sc.left = -4.2; sc.right = 4.2; sc.top = 4.2; sc.bottom = -4.2; sc.near = 1; sc.far = 30; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02; sc.updateProjectionMatrix();
  scene.add(sun, sun.target);
  // 天井灯: 真上寄りの柔らかい主光。品物の真下に接触影を落とす
  const key = new THREE.DirectionalLight(0xfff4e4, 3.0); const kdir = new THREE.Vector3(-0.12, -1, -0.36).normalize();
  key.castShadow = true; key.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048); key.shadow.radius = 5;
  const kc = key.shadow.camera; kc.left = -1.7; kc.right = 1.7; kc.top = 1.7; kc.bottom = -1.7; kc.near = 0.5; kc.far = 9; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.008; kc.updateProjectionMatrix();
  scene.add(key, key.target);
  const hemi = new THREE.HemisphereLight(0xe6eef8, 0xb9a88e, 0.35); scene.add(hemi);
  scene.fog = new THREE.Fog(0xeef3f6, 6.5, 30);
  const sound = new Sound();
  const game = new Game({ scene, camera, renderer, sound, low, sun });
  game.fadeEl = fadeEl;
  // 日なたのほこり (粒子数に上限)
  const MAXP = low ? 14 : 44, pg = new THREE.BufferGeometry(), pp = new Float32Array(MAXP * 3), pv = [];
  for (let i = 0; i < MAXP; i++) { pp[i * 3] = -2 + Math.random() * 4.5; pp[i * 3 + 1] = 0.5 + Math.random() * 1.6; pp[i * 3 + 2] = -2.6 + Math.random() * 2.8; pv.push([(Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.02]); }
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xfff2d0, size: 0.012, transparent: true, opacity: 0.5, depthWrite: false, sizeAttenuation: true })); dust.frustumCulled = false; scene.add(dust);

  // ---------- 大きさ・向き・Safe Area ----------
  let scale = 1, W = 1, H = 1, capDpr = low ? 1.5 : 2;
  const applyRes = () => { const budget = low ? 1.5e6 : 3.3e6; let pr = Math.min(window.devicePixelRatio || 1, capDpr) * scale; pr = Math.min(pr, Math.sqrt(budget / Math.max(1, W * H))); const rs = parseFloat(q.get('rs')); if (rs > 0) pr = rs; renderer.setPixelRatio(Math.max(rs > 0 ? 0.1 : 0.5, pr)); renderer.setSize(W, H, false); dbg.pixelRatio = renderer.getPixelRatio(); };
  const resize = () => {
    W = Math.max(1, window.innerWidth); H = Math.max(1, window.innerHeight);
    const cs = getComputedStyle(sa), ins = [parseFloat(cs.paddingTop) || 0, parseFloat(cs.paddingRight) || 0, parseFloat(cs.paddingBottom) || 0, parseFloat(cs.paddingLeft) || 0];
    camera.aspect = W / H; camera.updateProjectionMatrix(); applyRes(); game.resize(W, H, ins); game.cam.snap = true;
  };
  window.addEventListener('resize', resize); window.addEventListener('orientationchange', () => setTimeout(resize, 60));
  resize();

  // ---------- 入力 (指1本だけを追う) ----------
  let active = null;
  const xy = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', (e) => {
    if (e.cancelable) e.preventDefault(); if (active !== null) return; active = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* */ }
    const p = xy(e); game.onDown(p[0], p[1]);
  });
  canvas.addEventListener('pointermove', (e) => { if (e.pointerId !== active) return; if (e.cancelable) e.preventDefault(); const p = xy(e); game.onMove(p[0], p[1]); });
  const up = (e) => { if (e.pointerId !== active) return; active = null; const p = xy(e); game.onUp(p[0], p[1], e.type !== 'pointerup'); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('lostpointercapture', (e) => { if (e.pointerId === active) { active = null; game.cancelDrag(); } });
  for (const ev of ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'contextmenu', 'dblclick', 'selectstart', 'dragstart']) document.addEventListener(ev, (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
  document.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });

  // ---------- 描画ループ ----------
  let raf = 0, last = 0, ema = 16.7, perfT = 0, slowT = 0, frames = 0, lost = false, lostT = 0, shadowTick = 0, expo = 1;
  sun.shadow.autoUpdate = false; key.shadow.autoUpdate = false;
  const stats = (dbg.perf = { fps: 0, ms: 0, frames: 0, scale: 1, low, samples: [] });
  const setLow = (v) => { if (low === v) return; low = v; stats.low = v; capDpr = v ? 1.5 : 2; game.low = v; sun.castShadow = !v; sun.intensity = v ? 3.0 : 7.5; applyRes(); };
  const frame = (t) => {
    raf = requestAnimationFrame(frame);
    if (lost) { if (performance.now() - lostT > 4000) { cancelAnimationFrame(raf); fail(); } return; }
    let raw = t - last; last = t; if (raw > 3000 || raw <= 0) raw = 16.7; // 復帰直後の大きな時間差は捨てる
    // 遅い端末でも遊びの速さは保つ: 1フレームで最大4回まで論理を進める (それ以上の遅れは捨てる)
    let rem = Math.min(raw / 1000, 0.2), dt = Math.min(rem, 1 / 20);
    while (rem > 1e-4) { const h = Math.min(rem, 1 / 20); game.update(h); rem -= h; }
    // 光: カメラの居場所に合わせる
    const outside = camera.position.z < L.frontZ - 0.3, S = game.S;
    const tg = outside ? new THREE.Vector3(1.5, 0, -4.2) : new THREE.Vector3(0.4, 0, -0.9);
    sun.target.position.copy(tg); sun.position.copy(tg).addScaledVector(sdir, -14);
    const kt = outside ? new THREE.Vector3(1.6, 0.8, -4.6) : new THREE.Vector3(game.cam.tgt.x, 0.9, game.cam.tgt.z < -1 ? -1.4 : 0.05);
    key.target.position.copy(kt); key.position.copy(kt).addScaledVector(kdir, -5);
    const warm = S.phase === 'close' ? 1 : 0; sun.color.setRGB(1, 0.94 - warm * 0.08, 0.85 - warm * 0.2);
    const dim = outside ? 0 : S.shutter;
    scene.environmentIntensity = outside ? 0.7 : 0.32 - dim * 0.12; hemi.intensity = outside ? 0.9 : 0.35 - dim * 0.12; key.intensity = outside ? 0.4 : 3.0 - dim * 0.6;
    expo += ((outside ? 0.5 : 0.9 + dim * 0.1) - expo) * Math.min(1, dt * 4); renderer.toneMappingExposure = expo;
    for (let i = 0; i < MAXP; i++) { const v = pv[i]; pp[i * 3] += v[0] * dt; pp[i * 3 + 1] += v[1] * dt + Math.sin(t * 0.0006 + i) * 0.0004; pp[i * 3 + 2] += v[2] * dt; if (pp[i * 3 + 1] > 2.2 || pp[i * 3 + 1] < 0.4) v[1] = -v[1]; if (Math.abs(pp[i * 3] - 0.3) > 2.4) v[0] = -v[0]; if (pp[i * 3 + 2] > 0.3 || pp[i * 3 + 2] < -2.7) v[2] = -v[2]; }
    pg.attributes.position.needsUpdate = true; dust.visible = !outside;
    shadowTick++; if (shadowTick % (low ? 2 : 1) === 0) key.shadow.needsUpdate = true; if (shadowTick % (low ? 8 : 2) === 0) sun.shadow.needsUpdate = true;
    renderer.render(scene, camera);
    if (game.moveT) { const l = performance.now() - game.moveT; game.moveT = 0; stats.inputMs = +l.toFixed(1); stats.inputMax = Math.max(stats.inputMax || 0, stats.inputMs); stats.inputN = (stats.inputN || 0) + 1; stats.inputSum = +((stats.inputSum || 0) + l).toFixed(1); }
    // 動的解像度
    frames++; stats.frames = frames; ema += (raw - ema) * 0.08; perfT += raw;
    if (perfT > 600) {
      perfT = 0; stats.ms = +ema.toFixed(2); stats.fps = +(1000 / ema).toFixed(1); stats.scale = scale; if (stats.samples.length < 600) stats.samples.push(stats.fps);
      if (q.get('fixed') !== '1') {
        if (ema > 38 && scale > 0.5) { scale = Math.max(0.5, scale - 0.1); applyRes(); }
        else if (ema < 21 && scale < 1) { scale = Math.min(1, scale + 0.05); applyRes(); }
        if (ema > 40 && scale <= 0.5) { slowT += 0.6; if (slowT > 2.4 && !low && q.get('low') !== '0') setLow(true); } else slowT = 0;
      }
    }
  };
  const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; if (active !== null) { active = null; } game.hidden(); sound.suspend(); dbg.hiddenCount = (dbg.hiddenCount || 0) + 1; }
    else { sound.resume(); start(); }
  });
  window.addEventListener('pagehide', () => game.flush());
  window.addEventListener('blur', () => { if (active !== null) { active = null; game.cancelDrag(); } });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; lostT = performance.now(); game.cancelDrag(); });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; try { makeEnv(); } catch (e) { /* 次の描画で再試行 */ } sun.shadow.needsUpdate = true; key.shadow.needsUpdate = true; last = performance.now(); });
  start();

  // ---------- 検証用の読み取り専用の窓 (状態は変更しない) ----------
  if (q.get('dev') === '1') dbg._dev = { scene, renderer, game, camera, sun, key };
  const scr = (v) => { const s = game.screen(v, {}); return { x: Math.round(s.x), y: Math.round(s.y) }; };
  const bagW = (x, y) => new THREE.Vector3(L.rack.x + x, L.counterY + y, L.rack.z + game.bagZ);
  Object.assign(dbg, {
    ready: true,
    state: () => JSON.parse(JSON.stringify(game.S)),
    info: () => ({ station: game.station, drag: game.drag ? game.drag.kind + (game.drag.mode ? ':' + game.drag.mode : '') : null, bagWhere: game.bagWhere, trayAt: game.trayAt, carryT: +game.carryT.toFixed(3), cust: game.cust.state, mgr: game.mgr.state, saveOK: game.saveOK, loadRejected: !!game.loadRejected, audio: sound.ok, audioState: sound.ctx ? sound.ctx.state : 'none', sounds: sound.count, reads: game.readCount || 0, pays: game.payCount || 0, presses: game.presses || 0, hints: game.hintCount || 0, hint: !!game.hint, hands: game.handCount || 0, returns: game.returnCount || 0, blocked: game.blockedCount || 0, cards: game.cardCount || 0, fade: game.fade, idle: +game.idle.toFixed(2), assist: game.assistBusy(), flash: game.lastFlash || null, strong: game.strongFlashes || 0, weak: game.weakFlashes || 0, autos: game.autoCount || 0, spills: game.spills || 0, time: +game.time.toFixed(2), via: game.cam.via.length, low, lanes: game.lanes.map((l) => l.map((i) => i.id)) }),
    item: (id) => { const it = game.items[id]; return Object.assign(scr(it.pos), { mode: it.mode, loc: it.st.loc, w: [+it.pos.x.toFixed(3), +it.pos.y.toFixed(3), +it.pos.z.toFixed(3)], lanePos: +it.lanePos.toFixed(3) }); },
    pt: (x, y, z) => scr(new THREE.Vector3(x, y, z)),
    basket: () => scr(game.basketPos.clone().add(new THREE.Vector3(0, 0.28, 0.02))), basketGrip: () => scr(game.basketPos.clone().add(new THREE.Vector3(0, 0.09, 0.13))),
    scanner: () => scr(game.scanPos), button: () => scr(L.button.clone().add(new THREE.Vector3(0, 0.05, 0))),
    shelfSlot: (k) => scr(new THREE.Vector3(L.milkX[k], L.shelfTopY + 0.11, L.milkZ)), lane: (k) => scr(new THREE.Vector3(L.laneX[k], 0.9, -0.09)),
    bin: () => scr(new THREE.Vector3(L.bin.x, L.bin.y + 0.2, L.bin.z)), stack: () => scr(L.stack.clone().add(new THREE.Vector3(0, 0.42, 0))),
    bag: (x, y) => scr(bagW(x, y)),
    handle: (side) => { const s = game.sim, h = side ? s.hR : s.hL; return scr(bagW(s.px[h[2]], s.py[h[2]] - 0.012)); },
    peg: (k) => scr(bagW(PEG_X[k], PEG_Y)),
    sim: () => { const s = game.sim; return { bottoms: Array.from({ length: NC }, (_, c) => +(s.py[s.idx(c, NR - 1)] * 100).toFixed(2)), strainL: +s.strainL.toFixed(4), strainR: +s.strainR.toFixed(4), mouth: [+s.px[s.cornerL].toFixed(3), +s.px[s.cornerR].toFixed(3), +s.py[s.cornerL].toFixed(3)], pins: [+s.pinL.x.toFixed(3), +s.pinL.y.toFixed(3), +s.pinR.x.toFixed(3), +s.pinR.y.toFixed(3)], band: [+(s.pinL.x + 0.01).toFixed(3), +(s.pinR.x - 0.01).toFixed(3)], rustle: +s.rustle.toFixed(3), com: (() => { const c = s.contents(); return [+c.x.toFixed(3), +c.y.toFixed(3), +c.mass.toFixed(2)]; })(), bodies: s.bodies.map((b) => ({ id: b.id, x: +b.x.toFixed(3), y: +b.y.toFixed(3), a: +b.a.toFixed(3), in: s.anyInside(b), all: s.allInside(b), held: b.held, reach: game.reachable(b) })) }; },
    shutterBar: () => scr(new THREE.Vector3(1.55, (1 - game.S.shutter) * (L.openH - 0.06) + 0.05, L.frontZ - 0.12)),
    custHand: () => { const v = new THREE.Vector3(); game.grip(game.cust.P, 0, v); return { x: +(v.x - L.rack.x).toFixed(3), y: +(v.y - L.counterY).toFixed(3), z: +v.z.toFixed(3), bow: +game.cust.P.bow.toFixed(3), lean: +game.cust.P.lean.toFixed(3), support: !!game.cust.support, arm1: !!game.cust.P.armT[1] }; },
    cardScreen: () => { const v = new THREE.Vector3(); game.card.getWorldPosition(v); return Object.assign(scr(v), { visible: game.card.visible }); },
    tris: () => renderer.info.render.triangles, calls: () => renderer.info.render.calls,
    bench: (n) => { const t0 = performance.now(); for (let i = 0; i < n; i++) { renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera); } gl.finish(); return (performance.now() - t0) / n; },
    lights: (a, b) => { sun.castShadow = !!a; key.castShadow = !!b; },
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
