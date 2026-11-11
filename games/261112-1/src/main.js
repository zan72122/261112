// せんたくびより！くるくるドラムとおひさま — boot, renderer, camera, input, main loop.
import * as THREE from 'three';
import { buildWorld, L } from './world.js';
import { Cloth, clothMaterial } from './cloth.js';
import * as TX from './tex.js';
import { Sound } from './audio.js';
import { Drops } from './fx.js';
import { Washer, tether } from './washer.js';
import { Dry } from './dry.js';
import { Fold } from './fold.js';
import { Hint } from './hint.js';
import { saveState, loadState, restore } from './save.js';
import * as SIM from './sim.js';
import { clamp, lerp, smooth } from './util.js';

const qs = new URLSearchParams(location.search);
const G = { time: 0, low: qs.get('low') === '1', list: [], cl: {}, station: 'wash', drag: null, idle: 0, dirty: false, sunK: 1,
  progress: { washed: false, spun: false, hung: false, bal: false, fold: false, dried: false, card: false, washCount: 0, rainFor: -1 }, fps: 60, frames: 0 };
window.__G = G;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const canvas = document.getElementById('c');

// ---------- renderer (with still-image fallback) ----------
function fallback() { document.getElementById('fb').style.display = 'block'; canvas.style.display = 'none'; G.dead = true; }
let renderer;
try {
  // probe first so that a missing WebGL shows the still picture quietly
  const probe = document.createElement('canvas'), gl = probe.getContext('webgl2') || probe.getContext('webgl');
  if (!gl) throw new Error('no gl');
  const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  if (!renderer.getContext()) throw new Error('no gl');
} catch (e) { fallback(); }

if (!G.dead) boot();

function boot() {
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = G.scene = new THREE.Scene(); scene.background = new THREE.Color(0xdfe7ea);
  const camera = G.camera = new THREE.PerspectiveCamera(38, 1, 0.08, 200);
  G.renderer = renderer; G.audio = new Sound();

  // image-based light from two tiny procedural environments
  const pm = new THREE.PMREMGenerator(renderer);
  const envRoom = (() => {
    const s = new THREE.Scene(), bm = (c, i) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), side: THREE.BackSide });
    s.add(new THREE.Mesh(new THREE.BoxGeometry(8, 3, 7), [bm(0xf3ede2, 0.42), bm(0xf3ede2, 0.36), bm(0xffffff, 0.7), bm(0xc59a6a, 0.22), bm(0xf3ede2, 0.42), bm(0xf3ede2, 0.3)]));
    const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xeaf3ff).multiplyScalar(7) })); win.position.set(1.6, 0, -3.45); s.add(win);
    const win2 = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff4e2).multiplyScalar(2.0), side: THREE.DoubleSide })); win2.position.set(-1, 0.3, 3.45); win2.rotation.y = Math.PI; s.add(win2);
    return pm.fromScene(s, 0.04).texture;
  })();
  const envSky = (() => {
    const s = new THREE.Scene(), g = new THREE.SphereGeometry(10, 32, 16), col = new Float32Array(g.attributes.position.count * 3), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i) / 10, t = clamp(y, 0, 1); const c = y < 0 ? [0.5, 0.45, 0.38] : [lerp(1.5, 0.42, Math.pow(t, 0.5)), lerp(1.55, 0.72, Math.pow(t, 0.5)), lerp(1.6, 1.3, Math.pow(t, 0.5))]; col.set(c, i * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    s.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff2d8).multiplyScalar(40) })); sun.position.set(3, 6.2, -7.2); s.add(sun);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xece6da).multiplyScalar(0.9) })); wall.position.set(0, 1, 6); wall.rotation.y = Math.PI; s.add(wall);
    return pm.fromScene(s, 0.03).texture;
  })();
  G.env = { room: envRoom, sky: envSky }; scene.environment = envRoom;

  const S = G.sunDir = V(0.30, 0.62, -0.72).normalize();
  const sun = G.sun = new THREE.DirectionalLight(0xfff0d6, 3.4); sun.castShadow = true;
  const sm = G.low ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.018; sun.shadow.radius = 2.5;
  scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight(0xe6ecff, 0.42); fill.position.set(-2.5, 3.2, 4); scene.add(fill); G.fill = fill;
  const hemi = new THREE.HemisphereLight(0xe9f0ff, 0x9a876c, 0.22); scene.add(hemi); G.hemi = hemi;

  const W = G.W = buildWorld(scene, G.low);
  G.drops = new Drops(scene, G.low ? 90 : 190);
  G.drops.onHit = (x, y, z, s) => { if (Math.random() < 0.5) G.audio.play('plink', 0.7); };

  // ---------- the laundry: same four pieces through every scene ----------
  const sT = TX.shirtTextures(), tT = TX.towelTextures(), kT = TX.sockTextures();
  const jer = TX.jerseyNormal(), ter = TX.terryNormal(), rib = TX.ribNormal();
  const mk = (id, kind, spec, o) => { const c = new Cloth(Object.assign({ id, kind }, spec, o)); scene.add(c.mesh); G.list.push(c); G.cl[id] = c; c.snag = -1; c.homing = 0; c.insert = 0; c.stuck = 0; c.wrap = null; c.rod = null; c.flat = null; c.site = 'wash'; return c; };
  const SH = TX.SHIRT;
  mk('shirt', 'shirt', SH, { thick: 0.0028, sub: G.low ? 2 : 3, rad: 0.018, bendK: 0.06, mask: (i, j) => j < SH.sleeveRows || (i >= SH.b0 && i <= SH.b1),
    matFront: clothMaterial(sT.front, jer, { alpha: true, nrep: [18, 11], ns: 0.5 }), matBack: clothMaterial(sT.back, jer, { alpha: true, nrep: [18, 11], ns: 0.5 }) }).adh = 1.4;
  mk('towel', 'towel', TX.TOWEL, { thick: 0.007, sub: G.low ? 2 : 3, rad: 0.02, bendK: 0.16,
    matFront: clothMaterial(tT.front, ter, { nrep: [7, 13], ns: 0.75, roughness: 1 }), matBack: clothMaterial(tT.back, ter, { nrep: [7, 13], ns: 0.75, roughness: 1 }) }).adh = 2.6;
  G.sockMat = { out: clothMaterial(kT.out, rib, { alpha: true, nrep: [1, 3], ns: 0.9 }), inside: clothMaterial(kT.inside, ter, { alpha: true, nrep: [1.5, 3], ns: 1.4 }) };
  for (const id of ['sockA', 'sockB']) { const c = mk(id, 'sock', TX.SOCK, { thick: 0.011, sub: 4, rad: 0.017, bendK: 0.5, matFront: G.sockMat.out, matBack: G.sockMat.out }); c.adh = 0.5; c.inverted = false; }
  G.setSockLook = (c) => { const m = c.inverted ? G.sockMat.inside : G.sockMat.out; c.setMaterials(m, m); };

  G.basket = { x: L.stWash.x, y: 0, z: L.stWash.z, station: 'wash', shelf: false, tween: null, wig: 0 };
  G.washer = new Washer(G); G.dry = new Dry(G); G.fold = new Fold(G); G.hint = new Hint(G);

  // ---------- helpers ----------
  const ray = new THREE.Ray(), ndc = new THREE.Vector3(), tmp = V(0, 0, 0), tmp2 = V(0, 0, 0);
  G.vw = 1; G.vh = 1;
  G.ray = (sx, sy) => { ndc.set(sx / G.vw * 2 - 1, -(sy / G.vh) * 2 + 1, 0.5).unproject(camera); ray.origin.copy(camera.position); ray.direction.copy(ndc).sub(camera.position).normalize(); return ray; };
  G.hitX = (sx, sy, x, out) => { const r = G.ray(sx, sy), t = (x - r.origin.x) / (r.direction.x || 1e-6); return (out || tmp).copy(r.direction).multiplyScalar(t).add(r.origin); };
  G.hitY = (sx, sy, y, out) => { const r = G.ray(sx, sy), t = (y - r.origin.y) / (r.direction.y || 1e-6); return (out || tmp).copy(r.direction).multiplyScalar(t).add(r.origin); };
  G.hitZ = (sx, sy, z, out) => { const r = G.ray(sx, sy), t = (z - r.origin.z) / (r.direction.z || 1e-6); return (out || tmp).copy(r.direction).multiplyScalar(t).add(r.origin); };
  const pv = V(0, 0, 0);
  G.project = (x, y, z, out) => { pv.set(x, y, z).project(camera); out = out || {}; out.x = (pv.x * 0.5 + 0.5) * G.vw; out.y = (-pv.y * 0.5 + 0.5) * G.vh; out.z = pv.z; return out; };
  G.sdist = (sx, sy, x, y, z) => { const o = G.project(x, y, z, _po); return o.z > 1 ? 1e9 : Math.hypot(o.x - sx, o.y - sy); };
  const _po = {};
  G.pickR = () => Math.max(30, Math.min(G.vw, G.vh) * 0.05);
  // nearest cloth particle in screen space
  const wp = V(0, 0, 0);
  G.nearParticle = (sx, sy, filter, preferHigh) => {
    let best = null, bd = 1e9; const R = G.pickR() * 1.25;
    for (let pass = 0; pass < (preferHigh ? 2 : 1); pass++) {
      const lim = pass ? bd + 10 : R; let by = -1e9;       // second pass: the topmost piece right under the finger
      for (const c of G.list) {
        if (!filter(c)) continue;
        for (let k = 0; k < c.n; k++) {
          if (!c.active[k]) continue; c.wpos(k, wp);
          const o = G.project(wp.x, wp.y, wp.z, _po); if (o.z > 1) continue;
          const d = Math.hypot(o.x - sx, o.y - sy); if (d > lim) continue;
          if (!pass) { if (d < bd) { bd = d; best = { c, k, d, dn: d }; } }
          else if (wp.y > by + 0.002) { by = wp.y; best = { c, k, d, dn: bd }; }
        }
      }
      if (!best) break;
    }
    return best;
  };
  G.markDirty = () => { G.dirty = true; };
  G.onProgress = (ev) => {
    const P = G.progress;
    if (ev === 'washing') { if (!P.washing) { P.washing = true; P.washCount++; } }
    if (ev === 'spin') P.spunNow = true;
    if (ev === 'opened') { if (P.washing) { P.washed = true; P.washing = false; } if (P.spunNow) { P.spun = true; P.spunNow = false; } }
    if (ev === 'hung') P.hung = true;
    if (ev === 'card') P.card = true;
    G.markDirty();
  };

  // ---------- initial layout / restore ----------
  G.resetLaundry = () => {
    const b = G.basket, B = L.basket, bot = b.y + B.floor, rim = b.y + B.h;
    const t = G.cl.towel, s = G.cl.shirt, r = (a) => (Math.sin(a * 12.9898) * 43758.5453) % 1;
    for (const c of G.list) { c.loc = 'basket'; c.site = b.station; c.frame = null; c.rod = null; c.flat = null; c.wrap = null; c.kin.fill(0); c.grab = -1; c.stuck = 0; c.homing = 0; c.insert = 0; c.setWet(0); c.dirt.fill(0); }
    // towel folded in three along its length at the bottom
    for (let j = 0; j < t.ny; j++) for (let i = 0; i < t.nx; i++) {
      const fz = j * t.cell / 0.34, tz = Math.abs(((fz + 1) % 2) - 1), lz = Math.floor(fz + 0.5);
      t.setPos(t.idx(i, j), b.x - 0.24 + i * t.cell, bot + 0.03 + lz * 0.024 + Math.sin(i * 1.7 + j) * 0.003, b.z - 0.17 + tz * 0.34);
    }
    const top = rim + 0.02;
    // shirt on top, along the front of the basket; its right sleeve drops over the front rim next to the washer
    const fz = b.z + B.d / 2, xs = b.x + B.w / 2 - 0.1;
    for (let j = 0; j < s.ny; j++) for (let i = 0; i < s.nx; i++) {
      if (!s.on(i, j)) continue; let x, y, z;
      if (i <= 3) { const o = 3 - i; x = xs + (j - 1) * 0.036; z = fz + (o ? 0.028 : 0.012); y = o ? rim + 0.015 - o * 0.04 : rim + 0.02; }
      else {
        const jj = j <= 5 ? j : 10 - j; z = fz - 0.05 - jj * s.cell; x = i <= 12 ? xs - (i - 4) * s.cell * 0.96 : xs - 8 * s.cell * 0.96 + (i - 12) * s.cell;
        if (i > 12) z -= 0.1 + (i - 12) * 0.012;
        y = top + 0.02 + (i > 12 ? 0.03 : 0) - (j > 5 ? 0.03 : 0) + Math.sin(i * 1.3 + j) * 0.005; if (i === 4 && j < 3) { y = rim + 0.022; z = fz - 0.035; x = xs + (j - 1) * 0.036; }
      }
      s.setPos(s.idx(i, j), x, y, z);
    }
    s.snag = s.idx(3, 1); s.kin[s.snag] = 1; s.kin[s.idx(3, 0)] = 1; s.kin[s.idx(3, 2)] = 1; s.snag2 = [s.idx(3, 0), s.idx(3, 2)];
    const a = G.cl.sockA, bb = G.cl.sockB;
    for (let j = 0; j < a.ny; j++) for (let i = 0; i < a.nx; i++) { a.setPos(a.idx(i, j), b.x - 0.22 + i * 0.04, top + 0.05 + j * 0.004, b.z + 0.06 - j * 0.04); bb.setPos(bb.idx(i, j), b.x - 0.12 + j * 0.036, top + 0.07 + i * 0.004, b.z - 0.02 - i * 0.04 - j * 0.012); }
    a.inverted = bb.inverted = false; G.setSockLook(a); G.setSockLook(bb);
    // everyday marks to wash away
    const dab = (c, list) => { for (const [i, j, v] of list) for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) if (c.on(i + di, j + dj)) c.dirt[c.idx(i + di, j + dj)] = Math.max(c.dirt[c.idx(i + di, j + dj)], v * (di || dj ? 0.45 : 1)); };
    dab(s, [[8, 5, 0.9], [14, 1, 0.8], [6, 8, 0.6], [2, 1, 0.7]]); dab(t, [[3, 4, 0.8], [6, 11, 0.9], [2, 13, 0.5]]); dab(a, [[1, 4, 1]]); dab(bb, [[1, 4, 1], [1, 2, 0.6]]);
    for (const c of G.list) c.updateWetMean();
  };

  // ---------- camera ----------
  const cam = G.cam = { pos: V(0, 1.4, 3), tgt: V(0, 0.5, 0), fov: 38, transit: null, first: true };
  const view = { pos: V(0, 0, 0), tgt: V(0, 0, 0), fov: 38 };
  function fit(cx, cy, cz, w, h, yaw, pitch) {
    const asp = G.vw / G.vh, fov = asp >= 1 ? 36 : lerp(36, 48, clamp((1 - asp) / 0.42, 0, 1));
    const tv = Math.tan(fov * Math.PI / 360), th = tv * asp, d = Math.max(h / 2 / tv, w / 2 / th) * 1.04 * (G.safeScale || 1);
    const y = yaw * Math.PI / 180, p = pitch * Math.PI / 180, fx = Math.sin(y) * Math.cos(p), fy = Math.sin(p), fz = -Math.cos(y) * Math.cos(p);
    view.tgt.set(cx, cy, cz); view.pos.set(cx - fx * d, cy - fy * d, cz - fz * d); view.fov = fov; return view;
  }
  G.viewName = '';
  function desiredView() {
    const st = G.station, m = G.washer, asp = G.vw / G.vh, port = asp < 0.9;
    const carrying = G.drag && G.drag.kind === 'basket';
    if (st === 'wash') {
      if (carrying) { G.viewName = 'wash-wide'; return fit(-0.35, 0.62, 0.3, 3.5, 1.3, 0, -16); }
      if (m.latched && m.doorTarget === 0) {
        if (m.zone === 'spin' || (m.zone === 'stop' && m.knob > 0.3)) { G.viewName = 'wash-spin'; return fit(0.03, 0.535, 0.28, 0.6, 0.72, 0, -5); }
        G.viewName = 'wash-run'; return fit(0, 0.5, 0.28, 0.92, 0.9, 0, -9);
      }
      G.viewName = 'wash-load'; return port ? fit(-0.26, 0.4, 0.48, 1.42, 1.5, 33, -29) : fit(-0.2, 0.36, 0.46, 1.96, 0.98, 4, -22);
    }
    if (st === 'bal') {
      const zc = G.dry.stand.z * 0.55 + L.stBal.z * 0.45;
      if (carrying) { G.viewName = 'bal-wide'; const wv = fit(2.5, 0.85, -1.75, 3.1, 1.75, -110, -9); if (wv.pos.z < -3.5) wv.pos.z = -3.5; return wv; }
      G.viewName = 'bal'; const bv = port ? fit(2.72, 0.9, zc + 0.05, 2.05, 1.7, -107, -19) : fit(2.82, 0.52, zc + 0.05, 2.3, 2.1, -107, -21); if (bv.pos.z < -3.5) bv.pos.z = -3.5; return bv;
    }
    if (carrying) { G.viewName = 'fold-wide'; return fit(-1.35, 0.55, 0.4, 3.2, 1.3, 0, -24); }
    if (G.fold.finaleView()) { G.viewName = 'fold-finale'; return fit(-2.86, 1.16, 0.0, 1.15, 1.2, -12, -10); }
    G.viewName = 'fold'; return port ? fit(-2.1, 0.62, 0.22, 2.1, 1.6, 0, -40) : fit(-2.1, 0.72, 0.42, 2.36, 2.12, 0, -30);
  }
  const stationFocus = { wash: [0.2, 0.6, 0.3, 2.7], bal: [2.7, 0.8, -2.0, 3.1], fold: [-1.9, 0.6, 0.3, 2.6] };
  function applyStationLook(st) {
    scene.environment = st === 'bal' ? G.env.sky : G.env.room; G.lookStation = st;
    const f = stationFocus[st]; sun.target.position.set(f[0], f[1], f[2]); sun.position.copy(sun.target.position).addScaledVector(S, 12);
    const c = sun.shadow.camera; c.left = -f[3]; c.right = f[3]; c.top = f[3]; c.bottom = -f[3]; c.near = 0.5; c.far = 30; c.updateProjectionMatrix();
    G.exposureT = st === 'bal' ? 0.6 : 1.0; G.shadowDirty = true;
  }
  function updateCamera(dt) {
    const v = desiredView();
    if (cam.first) { cam.pos.copy(v.pos); cam.tgt.copy(v.tgt); cam.fov = v.fov; cam.first = false; applyStationLook(G.station); renderer.toneMappingExposure = G.exposureT; }
    if (cam.transit) {
      const tr = cam.transit; tr.t = Math.min(1, tr.t + dt / tr.dur); const e = tr.t * tr.t * (3 - 2 * tr.t);
      tr.pts[tr.pts.length - 1].copy(v.pos); tr.curve.getPoint(e, cam.pos); cam.tgt.lerpVectors(tr.tgt0, v.tgt, smooth(0.15, 1, tr.t)); cam.fov = lerp(tr.fov0, v.fov, e);
      if (tr.t > 0.5 && G.lookStation !== G.station) applyStationLook(G.station);
      if (tr.t >= 1) cam.transit = null;
    } else { const k = 1 - Math.exp(-dt * 4.2); cam.pos.lerp(v.pos, k); cam.tgt.lerp(v.tgt, k); cam.fov = lerp(cam.fov, v.fov, k); }
    camera.position.copy(cam.pos); camera.lookAt(cam.tgt); if (Math.abs(camera.fov - cam.fov) > 0.01) { camera.fov = cam.fov; camera.updateProjectionMatrix(); }
    camera.updateMatrixWorld();
    renderer.toneMappingExposure = lerp(renderer.toneMappingExposure, (G.exposureT || 1) * (0.9 + 0.1 * G.sunK), 1 - Math.exp(-dt * 3));
    sun.intensity = 3.4 * G.sunK;
  }
  // move the viewpoint (and optionally the basket with its laundry) to another station
  G.goStation = (st, withBasket) => {
    if (st === G.station || cam.transit) return;
    const from = G.station, mids = [];
    if ((from === 'wash' && st === 'bal') || (from === 'fold' && st === 'bal')) mids.push(V(1.0, 1.3, 1.5), V(0.95, 1.25, -1.3));
    if (from === 'bal') mids.push(V(1.6, 1.3, -1.6), V(0.95, 1.25, -0.9), V(0.9, 1.3, 1.2));
    if (st === 'bal') mids.push(V(3.6, 1.3, -1.9));
    G.station = st; G.progress[st] = true;
    const v = desiredView(), pts = [cam.pos.clone(), ...mids, v.pos.clone()];
    cam.transit = { t: 0, dur: mids.length ? 2.1 : 1.2, pts, curve: new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4), tgt0: cam.tgt.clone(), fov0: cam.fov };
    G.audio.play('whoosh', 0.6);
    if (withBasket) {
      const b = G.basket, dst = st === 'wash' ? L.stWash : st === 'bal' ? L.stBal : L.stFold, bp = [V(b.x, b.y, b.z)];
      if (from !== 'bal' && st === 'bal') bp.push(V(0.9, 0.12, 0.35), V(0.9, 0.12, -0.9));
      if (from === 'bal') bp.push(V(0.95, 0.12, -0.9), V(0.9, 0.12, 0.4));
      bp.push(V(dst.x, dst.y, dst.z));
      b.tween = { t: 0, dur: cam.transit.dur * 0.92, curve: new THREE.CatmullRomCurve3(bp, false, 'catmullrom', 0.3) }; b.station = st; b.shelf = false;
      for (const c of G.list) if (c.loc === 'basket') { c.site = st; c.homing = 0; }
    }
    G.idle = 0; G.markDirty();
  };
  G.moveBasket = (x, y, z) => { const b = G.basket, dx = x - b.x, dy = y - b.y, dz = z - b.z; b.x = x; b.y = y; b.z = z; for (const c of G.list) if (c.loc === 'basket' && c.grab < 0) c.translate(dx, dy, dz); };
  function updateBasket(dt) {
    const b = G.basket;
    if (b.tween) { const t = b.tween; t.t = Math.min(1, t.t + dt / t.dur); const e = t.t * t.t * (3 - 2 * t.t), p = t.curve.getPoint(e, tmp2); G.moveBasket(p.x, p.y + Math.sin(e * Math.PI) * 0.1, p.z); if (t.t >= 1) { b.tween = null; G.audio.play('thud', 0.5); } }
    b.wig *= Math.exp(-dt * 7);
    W.basket.position.set(b.x, b.y, b.z); W.basket.rotation.z = Math.sin(G.time * 34) * b.wig * 0.06;
    W.basketBlob.material.opacity = b.y < 0.03 ? 0.8 : 0.25;
  }

  // ---------- grabbing cloth (physics mode) ----------
  G.startGrab = (c, k, sx, sy) => {
    c.grab = k; c.kin[k] = 1; c.homing = 0; c.insert = 0; c.sleepT = 0; c.grabSeq = (G.grabSeq = (G.grabSeq || 0) + 1);
    if (c.snag >= 0) { c.kin[c.snag] = 0; for (const s of c.snag2) c.kin[s] = 0; c.kin[k] = 1; c.snag = -1; }
    if (c.stuck) { c.stuck = 0; G.audio.play('peel'); }
    if (c.loc === 'basket') c.loc = 'held';
    c.wpos(k, wp); c.gt = c.gt || V(0, 0, 0); c.gt.copy(wp); c.gt.y += 0.035;   // lifts at once
    c.gz0 = clamp(wp.z, 0.4, 0.95);                                              // stays at its own depth until the finger nears the port
    G.audio.play('grab');
  };
  G.endGrab = (c) => { if (c.grab >= 0) { c.lastGrab = c.grab; c.kin[c.grab] = 0; c.grab = -1; } };
  G.toBasket = (c) => { c.stuck = 0; c.loc = 'basket'; c.site = G.basket.station; c.homing = 3.2; c.rod = null; c.flat = null; c.frame = null; G.markDirty(); };
  const portScreen = { x: 0, y: 0, r: 1 };
  function portInfo() { const a = G.project(L.port.x, L.port.y, L.port.z), b = G.project(L.port.x + L.port.r, L.port.y, L.port.z, {}); portScreen.x = a.x; portScreen.y = a.y; portScreen.r = Math.abs(b.x - a.x); return portScreen; }
  function washDragTarget(c, sx, sy) {
    const ps = portInfo(), d = Math.hypot(sx - ps.x, sy - ps.y) / ps.r, k = smooth(1.3, 0.75, d), open = G.washer.door > 0.9 ? 1 : 0;
    const z = lerp(c.gz0 === undefined ? 0.44 : c.gz0, 0.03, k * open), p = G.hitZ(sx, sy, z, c.gt);
    if (z < L.port.z + 0.03) { const dx = p.x - L.port.x, dy = p.y - L.port.y, r = Math.hypot(dx, dy), m = 0.125; if (r > m) { p.x = L.port.x + dx / r * m; p.y = L.port.y + dy / r * m; } }
    p.y = Math.max(p.y + 0.03 * (1 - k * open), 0.04); return d;    // held a little above the pile
  }
  function clothDrag(c, k, sx, sy) {
    G.startGrab(c, k, sx, sy);
    const st = G.station, d = { kind: 'cloth', c, sx, sy };
    d.move = (x, y) => { d.sx = x; d.sy = y; };
    d.tick = () => {
      if (st === 'wash') { d.pd = washDragTarget(c, d.sx, d.sy); if (c.kind === 'towel') for (const s of G.list) if (s.wrap && s.wrap.towel === c && s.loc === 'drum' && c.p[s.wrap.k * 3 + 2] > L.port.z + 0.03) popSock(s, s.wrap.spun && !G.list.some((o) => o !== s && o.kind === 'sock' && o.poppedWith === c.grabSeq)), s.poppedWith = c.grabSeq; }
      else if (st === 'bal') G.dry.dragTarget(c, d.sx, d.sy);
      else G.fold.dragTarget(c, d.sx, d.sy);
    };
    d.up = (x, y) => {
      d.tick(); G.endGrab(c);
      if (st === 'wash') {
        if (d.pd < 1.08 && G.washer.door > 0.9) { c.loc = 'drum'; c.site = 'wash'; c.insert = 4; c.insertK = k; c.settle = 0; G.audio.play('bonk', 0.6); }
        else { releaseFromDrum(c); G.toBasket(c); }
      } else if (st === 'bal') G.dry.release(c, x, y);
      else G.fold.release(c, x, y);
      G.markDirty();
    };
    d.tick(); return d;
  }
  function releaseFromDrum(c) {
    // a sock wrapped in this towel pops out as the towel leaves
    if (c.kind === 'towel') { let first = true; for (const s of G.list) if (s.wrap && s.wrap.towel === c) { popSock(s, s.wrap.spun && first); first = false; } }
    if (c.wrap) { c.wrap = null; }
  }
  function popSock(s, flip) {
    const w = s.wrap; s.wrap = null; if (s.loc !== 'drum') return; s.stuck = 0;
    if (flip) { s.inverted = !s.inverted; G.setSockLook(s); G.audio.play('koron'); G.koron = (G.koron || 0) + 1; } else G.audio.play('pop');
    const cx = L.port.x + (Math.random() - 0.5) * 0.06, cy = L.port.y - 0.02, cz = L.port.z + 0.06;
    for (let j = 0; j < s.ny; j++) for (let i = 0; i < s.nx; i++) { const k = s.idx(i, j), a = k * 3; s.p[a] = cx + (i - 1) * 0.03; s.p[a + 1] = cy + Math.sin(j * 1.1) * 0.03; s.p[a + 2] = cz + j * 0.012; s.q[a] = s.p[a] + 0.006; s.q[a + 1] = s.p[a + 1] - (flip ? 0.022 : 0.008); s.q[a + 2] = s.p[a + 2] - 0.012; }
    s.frame = null; G.toBasket(s); s.tumble = flip ? 1 : 0;
  }
  G.popSock = popSock;

  // which part of the basket's visible wall a screen point is on: 'upper' (near the rim), 'lower', or null
  G.basketZone = (sx, sy) => {
    const b = G.basket, B = L.basket, bal = G.station === 'bal', c0 = bal ? [b.x + B.w / 2, b.z + B.d / 2] : [b.x - B.w / 2, b.z + B.d / 2], c1 = bal ? [b.x + B.w / 2, b.z - B.d / 2] : [b.x + B.w / 2, b.z + B.d / 2];
    const t0 = G.project(c0[0], b.y + B.h, c0[1], {}), t1 = G.project(c1[0], b.y + B.h, c1[1], {}), f0 = G.project(c0[0], b.y, c0[1], {}), f1 = G.project(c1[0], b.y, c1[1], {});
    const rimY = (x) => t0.y + (t1.y - t0.y) * clamp((x - t0.x) / ((t1.x - t0.x) || 1), 0, 1), bot = Math.max(f0.y, f1.y);
    let zone = null;
    if (b.station === G.station && sx > Math.min(t0.x, t1.x) && sx < Math.max(t0.x, t1.x) && sy > rimY(sx) + 4 && sy < bot) zone = sy < rimY(sx) + 0.5 * (bot - rimY(sx)) ? 'upper' : 'lower';
    return { zone, rimY };
  };
  // ---------- picking ----------
  function pick(sx, sy) {
    const st = G.station, R = G.pickR(), m = G.washer; let best = null, bd = 1e9;
    const cand = (d, bias, make) => { if (d - bias < bd && d < R * 1.3) { bd = d - bias; best = make; } };
    if (cam.transit && cam.transit.t < 0.85) return null;
    if (st === 'wash') {
      const np = G.nearParticle(sx, sy, (c) => c.site === 'wash' && (c.loc === 'basket' || (c.loc === 'drum' && !c.frame && m.door > 0.9)));
      if (np) cand(np.d, 0, () => clothDrag(np.c, np.k, sx, sy));
      cand(G.sdist(sx, sy, L.knob.x, L.knob.y, L.knob.z + 0.03), 12, () => knobDrag(sx, sy));
      W.handle.getWorldPosition(tmp2); cand(G.sdist(sx, sy, tmp2.x, tmp2.y, tmp2.z), 10, () => tapDrag(sx, sy, () => { m.pressHandle(); m.handleWig = 1; }, null));
      if (m.door > 0.9 && m.doorTarget === 1) {      // the open door itself can be pushed shut, not only its small handle
        const dv = V(0, 0, 0); for (const [lx, ly] of [[-0.245, 0], [-0.245, 0.16], [-0.245, -0.16], [-0.4, 0.08], [-0.4, -0.08], [-0.1, 0.08], [-0.1, -0.08]]) { dv.set(lx, ly, 0.03); W.door.localToWorld(dv); cand(G.sdist(sx, sy, dv.x, dv.y, dv.z), 2, () => tapDrag(sx, sy, () => { m.pressHandle(); m.handleWig = 1; }, null)); }
      }
      if (m.door < 0.1) { const ps = portInfo(); const dd = Math.hypot(sx - ps.x, sy - ps.y); if (dd < ps.r * 1.3) cand(Math.min(dd, R), -R * 0.5, () => tapDrag(sx, sy, () => { m.handleWig = 1; G.audio.play('wiggle'); }, null)); }
    }
    if (st === 'bal') G.dry.pick(sx, sy, cand, clothDrag);
    if (st === 'fold') G.fold.pick(sx, sy, cand, clothDrag);
    // basket
    const b = G.basket, B = L.basket;
    if (b.station === st && !b.tween) {
      let d = Math.min(G.sdist(sx, sy, b.x, b.y + 0.11, b.z + B.d / 2), G.sdist(sx, sy, b.x - 0.17, b.y + 0.12, b.z + B.d / 2), G.sdist(sx, sy, b.x + 0.17, b.y + 0.12, b.z + B.d / 2), G.sdist(sx, sy, b.x, b.y + 0.2, b.z + B.d / 2));
      if (st === 'bal') d = Math.min(d, G.sdist(sx, sy, b.x + B.w / 2, b.y + 0.12, b.z), G.sdist(sx, sy, b.x + B.w / 2, b.y + 0.12, b.z - 0.12), G.sdist(sx, sy, b.x + B.w / 2, b.y + 0.12, b.z + 0.12));
      // a touch on the visible wall (below the rim) means the basket itself, not the laundry heaped above it —
      // unless a piece hangs out over that wall there, or a piece lies completely hidden behind it (then it is fished out)
      // the leather grips always mean the basket
      const hd = Math.min(G.sdist(sx, sy, b.x, b.y + B.h - 0.03, b.z + B.d / 2 + 0.012), G.sdist(sx, sy, b.x, b.y + B.h - 0.03, b.z - B.d / 2 - 0.012));
      if (hd < R * 0.75) { best = () => basketDrag(sx, sy); bd = -2e6; }
      const zone = hd < R * 0.75 ? { zone: null } : G.basketZone(sx, sy), rimY = zone.rimY;
      if (zone.zone) {
        let hangs = false, fish = null, fd = R * 1.6;
        for (const c of G.list) {
          if (c.loc !== 'basket' || c.site !== st) continue; let hidden = true, near = -1, nd = fd;
          for (let k = 0; k < c.n; k++) {
            if (!c.active[k]) continue; const a = k * 3, o = G.project(c.p[a], c.p[a + 1], c.p[a + 2], _po), ds = Math.hypot(o.x - sx, o.y - sy);
            const inside = Math.abs(c.p[a] - b.x) < B.w / 2 && Math.abs(c.p[a + 2] - b.z) < B.d / 2;
            if (!inside) { hidden = false; if (ds < R) hangs = true; } else if (o.y < rimY(o.x) - 2) hidden = false;
            if (ds < nd) { nd = ds; near = k; }
          }
          if (hidden && near >= 0) { fd = nd; fish = { c, k: near }; }
        }
        const upper = zone.zone === 'upper';
        // near the rim: reach for the laundry lying there (seen or hidden); lower down: the basket itself
        if (upper && !hangs) { const np2 = fish || G.nearParticle(sx, sy, (c) => c.loc === 'basket' && c.site === st); if (np2) { best = () => clothDrag(np2.c, np2.k, sx, sy); bd = -1e6; } else { best = () => basketDrag(sx, sy); bd = -1e6; } }
        else if (!hangs) { best = () => basketDrag(sx, sy); bd = -1e6; }
      }
      cand(d, -6, () => basketDrag(sx, sy));
    }
    if (best) return best();
    // navigation by door / neighbouring furniture (viewpoint only)
    const inRect = (x0, y0, z0, x1, y1, z1) => { const a = G.project(x0, y0, z0, {}), c = G.project(x1, y1, z1, {}); return a.z < 1 && c.z < 1 && sx > Math.min(a.x, c.x) - 8 && sx < Math.max(a.x, c.x) + 8 && sy > Math.min(a.y, c.y) - 8 && sy < Math.max(a.y, c.y) + 8; };
    if (st !== 'bal' && inRect(L.door.x0, 0.05, L.wallZ, L.door.x1, 2.0, L.wallZ)) return tapDrag(sx, sy, () => { if (G.progress.bal) G.goStation('bal', false); else { G.doorWig = 1; G.audio.play('wiggle'); } }, null);
    if (st === 'bal' && inRect(L.door.x0, 0.0, L.extZ, L.door.x1, 2.0, L.extZ)) return tapDrag(sx, sy, () => G.goStation('wash', false), null);
    // the counter seen from the washer only answers with a small rattle: the basket is what takes you there (and back)
    if (st === 'wash' && inRect(L.counter.x0, 0.05, L.counter.z1, L.counter.x1, 0.75, L.counter.z1)) return tapDrag(sx, sy, () => { G.fold.drawerWig = 1; G.audio.play('wiggle'); }, null);
    return null;
  }
  function tapDrag(sx, sy, onTap, onDrag) {
    const d = { kind: 'tap', sx, sy, moved: 0 };
    d.move = (x, y) => { d.moved = Math.max(d.moved, Math.hypot(x - sx, y - sy)); if (onDrag) onDrag(x, y, d); };
    d.up = (x, y, cancel) => { if (!cancel && !d.used) onTap(); };
    return d;
  }
  G.tapDrag = tapDrag;
  function knobDrag(sx, sy) {
    const c = G.project(L.knob.x, L.knob.y, L.knob.z + 0.03, {}), m = G.washer;
    const d = { kind: 'knob', px: sx, py: sy };
    const ang = (x, y) => Math.atan2(x - c.x, -(y - c.y));
    d.move = (x, y) => {
      const r = Math.hypot(x - c.x, y - c.y), dx = x - d.px, dy = y - d.py;
      let dv;
      const tx = -(y - c.y) / (r || 1), ty = (x - c.x) / (r || 1), tang = dx * tx + dy * ty, rad = (dx * (x - c.x) + dy * (y - c.y)) / (r || 1);
      if (r > 16 && Math.abs(tang) > Math.abs(rad) * 0.8) { let da = ang(x, y) - ang(d.px, d.py); if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2; dv = da / 4.88; }
      else dv = dx / Math.max(150, Math.min(G.vw, G.vh) * 0.32);
      m.turnKnob(dv); d.px = x; d.py = y;
    };
    d.up = () => { if (!m.latched) G.audio.play('wiggle'); G.markDirty(); };
    return d;
  }
  function basketDrag(sx, sy) {
    const b = G.basket, st = G.station, P = G.progress, gy = 0.14;
    const canBal = P.washed, canFold = P.hung;
    const d = { kind: 'basket', sx, sy, moved: 0, px: sx, py: sy };
    const home = () => b.shelf ? L.stShelf : (st === 'wash' ? L.stWash : st === 'bal' ? L.stBal : L.stFold);
    const hA = V(0, 0, 0), hB = V(0, 0, 0);
    d.move = (x, y) => {
      if (d.done) return; d.moved = Math.max(d.moved, Math.hypot(x - sx, y - sy));
      // step by the finger's motion under the current camera, so a moving viewpoint cannot drag the basket along
      G.hitY(d.px, d.py, gy, hA); G.hitY(x, y, gy, hB); d.px = x; d.py = y;
      let nx = b.x + clamp(hB.x - hA.x, -0.4, 0.4), nz = b.z + clamp(hB.z - hA.z, -0.4, 0.4), ny = 0.03;
      if (st === 'wash') {
        if (!canBal && !canFold && !G.progress.bal) { const hm = home(); nx = clamp(nx, hm.x - 0.05, hm.x + 0.05); nz = clamp(nz, hm.z - 0.03, hm.z + 0.05); b.wig = 1; }
        nx = clamp(nx, -1.75, 1.3); nz = clamp(nz, nx > 0.42 ? 0.0 : 0.56, 1.5); if (nx > -0.38 && nx < 0.42) nz = Math.max(nz, 0.62);
        if (!canFold && !P.fold) nx = Math.max(nx, -1.0);
        G.moveBasket(nx, ny, nz);
        d.zone = (canBal || P.bal) && nx > 0.6 && nz < 0.45 ? 'bal' : (canFold || P.fold) && nx < -1.25 ? 'fold' : null;
      } else if (st === 'bal') {
        nx = clamp(nx, 1.2, 4.6); nz = clamp(nz, -3.3, -0.9);
        G.moveBasket(nx, ny, nz);
        d.zone = nx < 2.15 && nz > -1.5 ? 'wash' : null;
      } else {
        nx = clamp(nx, -2.5, -0.55); nz = clamp(nz, -0.05, 1.5);
        const inCub = nx > -1.9 && nx < -1.22; if (nz < 0.5 && !inCub) nz = 0.5;
        if (nz < 0.3) { nx = clamp(nx, -1.66, -1.46); ny = L.stShelf.y; nz = Math.max(nz, L.stShelf.z); }
        G.moveBasket(nx, ny, nz); b.shelf = false;
        d.zone = nx > -0.9 ? 'wash' : null;
      }
      if (!d.zone) d.dwell = 0;
    };
    // the basket has to be brought to the doorway and kept there a moment (or put down there): passing by is not enough
    d.tick = (dt) => { if (d.done || !d.zone) return; d.dwell = (d.dwell || 0) + (dt || 0); if (d.dwell > 0.45) { d.done = true; G.goStation(d.zone, true); } };
    d.up = (x, y, cancel) => {
      if (d.done) return;
      if (d.zone && !cancel) { d.done = true; G.goStation(d.zone, true); return; }
      if (st === 'fold' && b.z < 0.42 && b.x > -1.9 && b.x < -1.22) { b.shelf = true; G.audio.play('slide'); }
      const hm = home(); b.tween = { t: 0, dur: 0.35, curve: new THREE.LineCurve3(V(b.x, b.y, b.z), V(hm.x, hm.y, hm.z)) };
      if (d.moved < 8) { b.wig = 1; G.audio.play('wiggle'); }
      G.markDirty();
    };
    G.audio.play('grab'); return d;
  }

  // ---------- input: one finger owns everything ----------
  let activeId = null;
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault(); G.audio.start(); G.idle = 0; G.hint.cancel();
    if (activeId !== null) return;
    activeId = e.pointerId; try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    const [x, y] = pos(e); G.drag = pick(x, y); G.lastTouch = { x, y, hit: G.drag ? G.drag.kind : null };
  }, { passive: false });
  canvas.addEventListener('pointermove', (e) => { if (e.pointerId !== activeId) return; e.preventDefault(); G.idle = 0; const [x, y] = pos(e); if (G.drag) G.drag.move(x, y); }, { passive: false });
  const end = (e, cancel) => {
    if (e.pointerId !== activeId) return; activeId = null; G.idle = 0;
    try { canvas.releasePointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    const [x, y] = pos(e); const d = G.drag; G.drag = null; if (d) d.up(x, y, cancel);
  };
  canvas.addEventListener('pointerup', (e) => end(e, false)); canvas.addEventListener('pointercancel', (e) => end(e, true));
  canvas.addEventListener('lostpointercapture', (e) => { if (e.pointerId === activeId) end(e, true); });
  for (const ev of ['contextmenu', 'gesturestart', 'gesturechange', 'dblclick', 'selectstart', 'dragstart']) document.addEventListener(ev, (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
  for (const ev of ['touchstart', 'touchmove']) document.addEventListener(ev, (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
  G.releaseAll = () => { if (G.drag) { const d = G.drag; G.drag = null; d.up(d.sx || 0, d.sy || 0, true); } activeId = null; };

  // ---------- size / quality ----------
  let dprCap = G.low ? 1.5 : 2, resScale = 1, ftAvg = 16, slowChecks = 0;
  function resize(ev) {
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
    G.vw = w; G.vh = h; camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap) * resScale); renderer.setSize(w, h, false);
    const cs = getComputedStyle(document.getElementById('safe')), ins = Math.max(parseFloat(cs.paddingLeft) || 0, parseFloat(cs.paddingRight) || 0) * 2 / w, inv = ((parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)) / h;
    G.safeScale = 1 + Math.max(ins, inv) * 0.9;
    if (ev && G.drag) G.releaseAll();     // a real rotation / resize lets go of whatever is held
  }
  window.addEventListener('resize', resize); window.addEventListener('orientationchange', () => setTimeout(() => resize(true), 60));
  G.setLow = (on) => { if (G.low === on) return; G.low = on; dprCap = on ? 1.5 : 2; if (on) { sun.shadow.mapSize.set(1024, 1024); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } G.drops.max = Math.min(G.drops.max, 90); G.washer.NB = Math.min(G.washer.NB, 70); } resize(); };
  function quality(ft) {
    ftAvg = lerp(ftAvg, ft, 0.05); G.fps = 1000 / ftAvg;
    if (G.frames % 45 !== 44) return;
    if (ftAvg > 36 && resScale > 0.55) { resScale = Math.max(0.55, resScale - 0.12); resize(); }
    else if (ftAvg < 21 && resScale < 1) { resScale = Math.min(1, resScale + 0.06); resize(); }
    if (ftAvg > 42 && resScale <= 0.56) { if (++slowChecks >= 3 && !G.low) G.setLow(true); } else slowChecks = 0;
    G.resScale = resScale;
  }

  // ---------- physics for world-frame cloth ----------
  const C = L.counter;
  function stepWorld() {
    const b = G.basket, m = G.washer, world = [];
    for (const c of G.list) {
      if (c.loc === 'flat' || c.loc === 'person' || c.frame) continue;
      world.push(c);
      let damp = 0.992;
      if ((G.frames + c.n) % 40 === 0 && c.grab < 0 && c.center(tmp2).y < -0.25) {      // safety net: nothing may ever be lost under the floor
        const a0 = c.p[0], a1 = c.p[1], a2 = c.p[2]; c.translate(b.x - a0, b.y + 0.45 - a1, b.z - a2); c.stop(); c.rod = null; c.loc = 'basket'; c.site = b.station; c.stuck = 0; c.homing = 2;
      }
      if (c.loc === 'basket' && c.homing <= 0 && c.grab < 0 && (G.frames + c.n) % 150 === 0 && c.snag < 0) { const cc = c.center(tmp2); if (Math.abs(cc.x - b.x) > L.basket.w / 2 + 0.03 || Math.abs(cc.z - b.z) > L.basket.d / 2 + 0.03) c.homing = 3.2; }   // a piece that slid off beside the basket hops back in
      if (c.homing > 0) { c.homing -= SIM.H; const out = SIM.homeForces(c, b, 1); damp = 0.97; if (out === 0 && c.homing < 2.6) c.homing = 0; }
      if (c.loc === 'drum') {
        if (c.insert > 0) {       // slips over the lip into the drum
          c.insert -= SIM.H; let out = 0; const p = c.p, e = c.ext, k = Math.min(1, (4 - c.insert) * 0.8 + 0.3);
          for (let i = 0; i < c.n; i++) { if (!c.active[i]) continue; const a = i * 3; if (p[a + 2] > L.drum.zf - 0.03) { out++; const dx = L.port.x - p[a], dy = L.port.y + 0.04 - p[a + 1], dz = 0.2 - p[a + 2], d = Math.hypot(dx, dy, dz) || 1, r = Math.hypot(dx, dy); const pull = 15 * k; if (r < 0.14 && p[a + 2] < 0.36) { e[a + 2] -= 16 * k; e[a + 1] += 6; } else { e[a] += dx / d * pull; e[a + 1] += dy / d * pull + 9.8; e[a + 2] += dz / d * pull; } e[a] -= (p[a] - c.q[a]) / SIM.H * 2.5; e[a + 1] -= (p[a + 1] - c.q[a + 1]) / SIM.H * 2.5; e[a + 2] -= (p[a + 2] - c.q[a + 2]) / SIM.H * 2.5; } }
          if (out === 0 || c.insert <= 0) { if (out > 0) for (let i = 0; i < c.n; i++) if (c.active[i] && c.p[i * 3 + 2] > L.drum.zf - 0.03) c.setPos(i, (Math.random() - 0.5) * 0.16, L.drum.cy - 0.1, 0.02 + Math.random() * 0.1); c.insert = 0; c.settle = 0.5; G.audio.play('thud', 0.6); }
        }
        if (c.settle > 0) { c.settle -= SIM.H; if (c.settle <= 0 && c.kind === 'sock') tryWrap(c); }
        if (c.stuck && c.grab < 0) { const p = c.p, s = c.stuckPos; for (let a = 0; a < c.n * 3; a++) { p[a] += (s[a] - p[a]) * 0.5; } c.q.set(p); continue; }
      }
      if (c.site === 'bal') G.dry.forces(c);
      if (c.tumble > 0) { c.tumble -= SIM.H * 0.8; }
      c.integrate(SIM.H, 0, SIM.GRAV, 0, damp);
    }
    for (let it = 0; it < SIM.ITER; it++) {
      for (const c of world) {
        if (c.stuck && c.loc === 'drum') continue;
        if (c.grab >= 0) SIM.driveGrab(c, c.gt.x, c.gt.y, c.gt.z, 0.05 / SIM.ITER * 2.2);
        c.solve();
        if (c.wrap && !c.wrap.towel.frame) tether(c, c.wrap);
        if (c.rod) G.dry.constrain(c);
        if (c.site === b.station) SIM.collideBasket(c, b, c.homing > 0 || c.grab >= 0 && false);
        if (c.site === 'wash') SIM.collideWasher(c);
        else if (c.site === 'fold') { SIM.collideBox(c, C.x0, C.x1, 0, C.top, C.z0, C.z1); }
        SIM.collideFloor(c, c.site === 'bal' ? -0.012 : 0);
      }
    }
    const pile = world.filter((c) => !c.rod && !(c.stuck && c.loc === 'drum'));
    if (pile.length) SIM.repel(pile, 0.03, 0.05);
  }
  function tryWrap(sock) {
    const t = G.cl.towel; if (t.loc !== 'drum' || t.insert > 0 || sock.wrap) return;
    const cc = sock.center(tmp2); let bk = -1, bdist = 0.12;
    for (let k = 0; k < t.n; k++) { const d = Math.hypot(t.p[k * 3] - cc.x, t.p[k * 3 + 1] - cc.y, t.p[k * 3 + 2] - cc.z); if (d < bdist) { bdist = d; bk = k; } }
    if (bk < 0) return;
    sock.wrap = { towel: t, k: bk, spun: false };
    // the nearest fold of the towel flops over the sock
    const bi = bk % t.nx, bj = (bk / t.nx) | 0;
    for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { if (!t.on(bi + di, bj + dj) || (!di && !dj)) continue; const k = t.idx(bi + di, bj + dj) * 3; t.p[k] += (cc.x - t.p[k]) * 0.55; t.p[k + 1] += (cc.y + 0.05 - t.p[k + 1]) * 0.55; t.p[k + 2] += (cc.z - t.p[k + 2]) * 0.55; }
    G.audio.play('soft'); G.markDirty();
  }
  G.tryWrap = tryWrap;

  // ---------- main loop ----------
  let last = 0, acc = 0; const dtMax = clamp(parseFloat(qs.get('dtmax') || '0.05') || 0.05, 0.02, 0.2), maxSteps = clamp(parseInt(qs.get('steps') || '5', 10) || 5, 1, 24);
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) { last = now; return; }
    if (!last) last = now;
    const raw = now - last; last = now;
    const dt = Math.min(raw / 1000, dtMax); if (dt <= 0) return;
    G.time += dt; G.frames++; G.idle += dt; quality(raw);
    if (G.drag && G.drag.tick) G.drag.tick(dt);
    G.washer.update(dt); G.dry.update(dt); G.fold.update(dt); updateBasket(dt);
    acc = Math.min(acc + dt, SIM.H * maxSteps); const drumCloths = G.list.filter((c) => c.loc === 'drum' && c.frame);
    while (acc >= SIM.H) { acc -= SIM.H; stepWorld(); if (drumCloths.length) G.washer.stepDrum(drumCloths); }
    for (const c of G.list) c.updateMesh();
    G.drops.update(dt);
    G.doorWig = (G.doorWig || 0) * Math.exp(-dt * 7); W.doorPanel.position.x = 1.53 + Math.sin(G.time * 38) * G.doorWig * 0.012;
    updateCamera(dt); G.hint.update(dt);
    if (G.dirty && G.time - (G.savedAt || 0) > 1.5) { G.dirty = false; G.savedAt = G.time; saveState(G); }
    renderer.render(scene, camera);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { G.releaseAll(); saveState(G); G.audio.suspend(true); } else { last = 0; acc = 0; G.audio.suspend(false); } });
  window.addEventListener('pagehide', () => saveState(G));
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); });

  G.resetLaundry();
  const saved = qs.get('fresh') === '1' ? null : loadState();
  if (saved) { try { restore(G, saved); } catch (e) { G.resetLaundry(); G.basket.station = 'wash'; G.station = 'wash'; } }
  resize();
  // let the initial pile settle before the first frame
  for (let i = 0; i < 110; i++) stepWorld();
  for (const c of G.list) c.stop();
  requestAnimationFrame(frame);

  // test hooks: read-only state for locating things on screen; all actions still go through pointer events
  window.__T = {
    pt: (x, y, z) => G.project(x, y, z, {}),
    zone: (x, y) => G.basketZone(x, y).zone,
    zoom: (x, y, w, h) => { if (w) camera.setViewOffset(G.vw, G.vh, x, y, w, h); else camera.clearViewOffset(); },
    part: (id, k) => { const c = G.cl[id]; c.wpos(k, wp); return G.project(wp.x, wp.y, wp.z, {}); },
    wpart: (id, k) => { const c = G.cl[id]; c.wpos(k, wp); return [wp.x, wp.y, wp.z]; },
    state: () => ({ station: G.station, view: G.viewName, transit: !!cam.transit, fps: G.fps, low: G.low, res: G.resScale, time: G.time, frames: G.frames, progress: Object.assign({}, G.progress), koron: G.koron || 0,
      audio: G.audio.ok ? G.audio.ctx.state : (G.audio.failed ? 'failed' : 'none'),
      basket: Object.assign({}, G.basket, { tween: !!G.basket.tween }),
      m: { door: m_().door, latched: m_().latched, knob: m_().knob, zone: m_().zone, omega: m_().omega, water: m_().water, suds: m_().suds },
      dry: G.dry.debug(), fold: G.fold.debug(),
      cloths: Object.fromEntries(G.list.map((c) => [c.id, { loc: c.loc, site: c.site, wet: c.wetMean, dirt: c.dirtMean, stuck: c.stuck, wrap: !!c.wrap, inv: !!c.inverted, onWall: !!c.onWall, grab: c.grab, insert: c.insert, homing: c.homing, rod: c.rod ? { id: c.rod.id, s: c.rod.s, zr: c.rod.zr, row: c.rod.row, holds: c.rod.holds.map((h) => ({ k: h.k, pinned: h.pinned })) } : null, flat: c.flat ? { where: c.flat.where, folds: c.flat.folds.length, bb: c.flat.wbb } : null, swing: c.swing || 0, swingSlow: c.swingSlow || 0, cen: c.center(V(0, 0, 0)).toArray() }])) }),
  };
  function m_() { return G.washer; }
}
