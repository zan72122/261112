// ぷかぷか！あひるちゃんのおふろ — 起動、描画ループ、負荷調整、復帰処理
import * as THREE from 'three';
import { buildEnv, waterU } from './env.js';
import { CameraRig } from './camera.js';
import { Water } from './water.js';
import { Duck, makeDuckShared } from './duck.js';
import { Tools } from './tools.js';
import { Towel } from './cloth.js';
import { Audio } from './audio.js';
import { Game } from './game.js';
import { L, clampToTub } from './layout.js';
import { loadState, saveState, decodeInto } from './save.js';
import { clamp } from './util.js';

const Q = new URLSearchParams(location.search);
const canvas = document.getElementById('gl');
const G = (window.__duckbath = { ready: false, frame: 0, canvas });
const STEP = 1 / 60;

function fallback() { const f = document.getElementById('fb'); if (window.__FALLBACK_IMG) f.src = window.__FALLBACK_IMG; f.style.display = 'block'; canvas.style.display = 'none'; document.getElementById('veil').style.opacity = 0; G.fallback = true; }

function boot() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }); } catch (e) { return fallback(); }
  if (!renderer || !renderer.getContext() || (renderer.getContext().isContextLost && renderer.getContext().isContextLost())) return fallback();
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.02; renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !Q.get('lite'); renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xe6e1d8);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 12); const rig = new CameraRig(camera);
  G.renderer = renderer; G.scene = scene; G.camera = camera; G.rig = rig; G.low = Q.get('q') === 'low'; G.lite = !!Q.get('lite'); // lite: 検証を速く回すための描画省略(産毛の層と影)。状態や操作の経路は同じ
  const env = (G.env = buildEnv(scene));
  // 窓からの自然光と、部屋の照り返し
  const key = new THREE.DirectionalLight(0xfff0de, 3.3); key.position.set(0.75, 1.9, -1.35); key.target.position.set(0, 0, -0.1); scene.add(key, key.target);
  key.castShadow = true; key.shadow.mapSize.set(G.low ? 1024 : 2048, G.low ? 1024 : 2048); const sc = key.shadow.camera; sc.left = -1.15; sc.right = 1.15; sc.top = 1.0; sc.bottom = -1.0; sc.near = 0.4; sc.far = 4.5; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.012; key.shadow.radius = 3.5;
  const hemi = new THREE.HemisphereLight(0xf4f6f8, 0xcfc6b8, 1.6); scene.add(hemi);
  const fill = new THREE.DirectionalLight(0xfff6ec, 0.85); fill.position.set(-0.6, 1.4, 1.8); scene.add(fill);
  // 室内の映り込みを一度だけ焼く
  const crt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: false }); const cc = new THREE.CubeCamera(0.05, 6, crt); cc.position.set(0, 0.3, 0.1); scene.add(cc);
  const closeBox = new THREE.Mesh(new THREE.BoxGeometry(1.72, 2.4, 2.4), new THREE.MeshStandardMaterial({ color: 0xe9e4da, side: THREE.BackSide, roughness: 0.9 })); closeBox.position.set(0, 0.6, 0.3); scene.add(closeBox);
  cc.update(renderer, scene); scene.remove(closeBox, cc); closeBox.geometry.dispose();
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromCubemap(crt.texture).texture; pm.dispose(); crt.dispose(); hemi.intensity = 0.3; env.glass.material.color.setRGB(1.12, 1.12, 1.1); env.glass.material.toneMapped = false;

  G.audio = new Audio();
  const water = (G.water = new Water(scene, { low: G.low })); water.outletY = env.outlet.y;
  G.duckShared = makeDuckShared(G.low);
  const parent = new Duck('parent', G, 101), kid = new Duck('kid', G, 202); parent.other = kid; kid.other = parent; G.ducks = [parent, kid];
  const towel = (G.towel = new Towel(G)); const tools = (G.tools = new Tools(G));
  const stain = env.stain;
  G.stainAdd = (wx, wz, rad, amt) => { const n = stain.size; const cu = ((wx - L.BED.x) / 0.5 + 0.5) * n, cv = ((wz - L.BED.z) / 0.5 + 0.5) * n; const rr = (rad / 0.5) * n; const d = stain.data;
    for (let j = Math.max(0, Math.floor(cv - rr)); j <= Math.min(n - 1, Math.ceil(cv + rr)); j++) for (let i = Math.max(0, Math.floor(cu - rr)); i <= Math.min(n - 1, Math.ceil(cu + rr)); i++) { const q = ((i - cu) * (i - cu) + (j - cv) * (j - cv)) / (rr * rr); if (q < 1) { const k = j * n + i; const add = amt * 255 * (1 - q) * 1.6; d[k] = Math.min(255, d[k] + Math.floor(add) + (Math.random() < add - Math.floor(add) ? 1 : 0)); } } stain.tex.needsUpdate = true; };
  G.stainSum = () => { let s = 0; for (let i = 0; i < stain.data.length; i++) s += stain.data[i]; return s / 255; };
  const game = (G.game = new Game(G));

  // ---- 記憶の復元 ----
  const saved = Q.get('fresh') ? null : loadState(); G.loaded = !!saved;
  if (saved) {
    game.stage = saved.stage; water.vol = saved.vol; tools.ringH = saved.ring; tools.chainDirty = true; game.cycles = saved.cycles | 0;
    saved.ducks.forEach((s, i) => { const d = G.ducks[i]; let x = s.x, z = s.z; if (s.m === 'tub') { const q = clampToTub(x, z, d.S.wid + 0.02); x = q[0]; z = q[1]; } else if (s.m === 'deck') { x = clamp(x, L.TOWEL.x0 + 0.04, L.TOWEL.x1 - 0.04); z = clamp(z, -0.72, -0.48); } else { x = clamp(x, L.BED.x - L.BED.rx * 0.6, L.BED.x + L.BED.rx * 0.6); z = clamp(z, L.BED.z - L.BED.rz * 0.55, L.BED.z + L.BED.rz * 0.55); }
      d.mode = s.m; d.x = x; d.z = z; d.heading = s.h; d.wet = s.wet.slice(); d.foam = s.foam.slice(); });
    for (let i = 0; i < saved.foam.length; i += 3) water.addFoam(saved.foam[i] / 1000, saved.foam[i + 1] / 1000, clamp(saved.foam[i + 2] / 10000, 0.006, 0.03), 120 + Math.random() * 220, false);
    decodeInto(saved.towel, towel.wet, towel.n, 1); const tmp = new Float32Array(stain.data.length); if (decodeInto(saved.bed, tmp, tmp.length, 1)) { for (let i = 0; i < tmp.length; i++) stain.data[i] = tmp[i] * 255; stain.tex.needsUpdate = true; }
    const both = G.ducks.every((d) => d.mode === 'bed'); if (saved.card && both) { game.cardDone = true; env.card.draw(1); for (const d of G.ducks) { d.asleep = 1; d.sleepy = true; } game.bedT = 5; }
    water.level = water.levelAt(water.vol); for (const d of G.ducks) d.y = d.restY();
    rig.setScene(both ? 5 : saved.scene, true);
  } else {
    water.seedFoam(); parent.place('tub', -0.375, -0.11, 0.62); kid.place('tub', -0.3, 0.13, -0.25); rig.setScene(1, true);
  }
  if (Q.get('scene')) rig.setScene(parseInt(Q.get('scene')), true);

  // ---- 大きさ・Safe Area・負荷 ----
  const probe = document.createElement('div'); probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)'; document.body.appendChild(probe);
  const perf = (G.perf = { scale: parseFloat(Q.get('rs')) || 1, ema: 16, slowT: 0, fastT: 0, mode: Q.get('q') === 'high' || Q.get('q') === 'low' || Q.get('rs') ? 'lock' : 'auto', fps: 60, frames: 0, t0: performance.now(), minScale: 0.55, log: [] });
  function applyScale() { const cap = G.low ? 1.25 : 1.5; renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap) * perf.scale); renderer.setSize(G.w, G.h, false); }
  function resize() {
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight); G.w = w; G.h = h; let safe = { t: 0, r: 0, b: 0, l: 0 };
    try { const cs = getComputedStyle(probe); safe = { t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0 }; } catch (e) { /* 0のまま */ }
    applyScale(); rig.resize(w, h, safe); game.endDrag(true);
  }
  window.addEventListener('resize', resize); window.addEventListener('orientationchange', () => setTimeout(resize, 60)); resize();
  function setLow(low) {
    if (G.low === low) return; G.low = low; G.duckShared.low = low; water.setLow(low); for (const d of G.ducks) d.setShells(low);
    key.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048); if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; } water.FCAP = low ? 230 : water.fx.length; applyScale(); perf.log.push({ t: +(performance.now() / 1000).toFixed(1), low });
  }
  G.setLow = setLow;
  function perfTick(ms, dt) {
    if (ms > 400) return; perf.ema += (ms - perf.ema) * 0.06; perf.frames++; const el = performance.now() - perf.t0; if (el > 1000) { perf.fps = (perf.frames * 1000) / el; perf.frames = 0; perf.t0 = performance.now(); }
    if (perf.mode !== 'auto' || G.frame < 20) return;
    if (perf.ema > 36) perf.slowT += dt; else perf.slowT = Math.max(0, perf.slowT - dt); if (perf.ema < 21) perf.fastT += dt; else perf.fastT = 0;
    if (perf.slowT > 1.5) { perf.slowT = 0; if (perf.scale > perf.minScale + 0.01) { perf.scale = Math.max(perf.minScale, perf.scale - 0.12); applyScale(); perf.log.push({ t: +(performance.now() / 1000).toFixed(1), scale: +perf.scale.toFixed(2) }); } else if (!G.low) setLow(true); }
    if (perf.fastT > 4 && perf.scale < 1) { perf.fastT = 0; perf.scale = Math.min(1, perf.scale + 0.08); applyScale(); }
  }

  // ---- ループ ----
  let running = true, last = performance.now(), acc = 0, simT = 0, raf = 0; const simCap = parseFloat(Q.get('simcap')) || 0.1;
  function simStep(dt) {
    simT += dt; game.step(dt); tools.update(dt, simT);
    water.obst.length = 0; let disp = 0; for (const d of G.ducks) { if (d.mode === 'tub' && d.subm > 0) { { const fr = Math.min(1, d.subm / d.S.draft); disp += d.S.dispMax * fr * fr; } if (d.kind === 'parent' && d.subm > 0.012) water.obst.push(d.hull()); } } water.disp = disp;
    water.update(dt, simT); for (const d of G.ducks) d.update(dt, simT); towel.step(dt);
  }
  let stainT = 0;
  function frame(now) {
    if (!running) return; raf = requestAnimationFrame(frame);
    let real = (now - last) / 1000; const ms = now - last; last = now; if (real > 0.5 || real < 0) real = STEP; // 長い中断は物理へ渡さない
    const tA = performance.now(); acc += Math.min(real, simCap); let n = 0; while (acc >= STEP && n < 40) { simStep(STEP); acc -= STEP; n++; } if (acc > STEP * 2) acc = 0; const tB = performance.now();
    waterU.uT.value = simT; water.render(simT, real); towel.sync();
    stainT += real; if (stainT > 1) { stainT = 0; let any = false; const d = stain.data; for (let i = 0; i < d.length; i++) if (d[i] > 0 && Math.random() < 0.012) { d[i]--; any = true; } if (any) stain.tex.needsUpdate = true; }
    rig.update(real);
    if (Q.get('cam')) { const c = Q.get('cam').split(',').map(Number); camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]); camera.updateMatrixWorld(); }
    if (G.low) { renderer.shadowMap.autoUpdate = false; if (G.frame % 2 === 0) renderer.shadowMap.needsUpdate = true; } else renderer.shadowMap.autoUpdate = true;
    const tC = performance.now(); renderer.render(scene, camera); const tD = performance.now(); G.frame++; G.ft = ms; perfTick(ms, real); G.prof2 = { sim: tB - tA, steps: n, prep: tC - tB, render: tD - tC, frame: ms, calls: renderer.info.render.calls, tris: renderer.info.render.triangles };
    if (G.frame === 3) { G.ready = true; document.getElementById('veil').style.opacity = 0; }
  }
  raf = requestAnimationFrame(frame);

  // ---- 非表示・復帰・描画喪失 ----
  function pause() { if (!running) return; running = false; cancelAnimationFrame(raf); game.endDrag(true); G.audio.suspend(); saveState(G); }
  function resume() { if (running) return; running = true; last = performance.now(); acc = 0; game.endDrag(true); game.idle = 0; G.audio.resume(); raf = requestAnimationFrame(frame); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else resume(); });
  window.addEventListener('pagehide', () => { game.endDrag(true); saveState(G); }); window.addEventListener('blur', () => game.endDrag(true));
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); document.getElementById('veil').style.opacity = 1; }); canvas.addEventListener('webglcontextrestored', () => { document.getElementById('veil').style.opacity = 0; });
  G.isRunning = () => running;

  // ---- 検証用の覗き窓(状態は読むだけ。操作は実際のPointer Eventで行う) ----
  const tv = new THREE.Vector3();
  G.debug = {
    toScreen(x, y, z) { const s = game.project(tv.set(x, y, z), {}); return { x: s.x, y: s.y }; },
    targets() { const o = {}; for (const t of game.targets()) o[t.name] = { x: t.x, y: t.y, r: t.r, locked: t.locked }; return o; },
    state() { return { stage: game.stage, scene: rig.scene, camMoving: rig.moving(), level: water.level, vol: water.vol, open: tools.open, flow: tools.flow, ring: tools.ringH, drainQ: water.drainQ, overQ: water.overQ, spill: water.spill, spillPeak: water.spillPeak, foam: water.longFoam(), foamAll: water.fn, sucked: water.sucked, made: water.made || 0, gamma: water.gamma,
      ducks: G.ducks.map((d) => ({ kind: d.kind, mode: d.mode, x: d.x, y: d.y, z: d.z, h: d.heading, floating: d.floating, subm: d.subm, wet: d.wet.slice(), foam: d.foam.slice(), asleep: d.asleep, walking: !!d.walk, neck: d.pose.neck, head: d.headWorld.toArray() })),
      towelWet: towel.wetMean(), stain: G.stainSum(), card: game.cardDone, cycles: game.cycles, hint: game.hint ? game.hint.plan.kind : null, handOn: !!game._handOn, drag: game.drag ? game.drag.kind : null, low: G.low, scale: perf.scale, fps: perf.fps, ema: perf.ema, audio: G.audio.ok ? G.audio.ctx.state : (G.audio.failed ? 'failed' : 'none'), running, simT, shower: { held: tools.sh.held, hit: tools.sh.hit.toArray(), kind: tools.sh.hitKind, part: tools.sh.hitPart, used: tools.sh.used }, disc: game.disc, perfLog: perf.log }; },
    foamList() { const o = []; for (let k = 0; k < water.fn; k++) if (!water.ftmp[k]) o.push([+water.fx[k].toFixed(3), +water.fz[k].toFixed(3)]); return o; },
    flowAt(x, z) { const o = [0, 0]; water.flowAt(x, z, o); return o; }, waveAt(x, z) { return water.hAt(x, z); },
    towelStats() { let mx = 0; const w = towel.wet; let left = 0, right = 0; for (let i = 0; i < w.length; i++) { mx = Math.max(mx, w[i]); if (i % 15 < 7) left += w[i]; else if (i % 15 > 7) right += w[i]; } return { max: mx, left, right, mean: towel.wetMean() }; },
    stainCentroid() { const n = stain.size; let sx = 0, sz = 0, s = 0; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const v = stain.data[j * n + i]; s += v; sx += v * i; sz += v * j; } return s ? { x: L.BED.x + (sx / s / n - 0.5) * 0.5, z: L.BED.z + (sz / s / n - 0.5) * 0.5, sum: s / 255 } : null; },
    setQuality(o) { perf.mode = 'lock'; if (o.lite !== undefined && o.lite !== G.lite) { G.lite = o.lite; renderer.shadowMap.enabled = !o.lite; scene.traverse((m) => { if (m.material) m.material.needsUpdate = true; }); for (const d of G.ducks) d.setShells(G.low); } if (o.low !== undefined) setLow(o.low); if (o.scale) { perf.scale = o.scale; applyScale(); } },
    save() { return saveState(G); },
  };
}
boot();
