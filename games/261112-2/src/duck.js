// あひるの親子: 材質(羽・産毛・水滴)、姿勢、浮力、濡れと泡
import * as THREE from 'three';
import { SHAPES, buildDuckGeometry, buildBillGeometry, buildFootGeometry } from './duckmesh.js';
import { makeFeatherMaps, makeFurNoise } from './textures.js';
import { L, ground, clampToTub, inTub, inBed } from './layout.js';
import { clamp, sat, damp, lerp, rng, angDiff, smooth } from './util.js';

const VERT_COMMON = `
attribute vec3 aBend; attribute vec4 aPart;
uniform vec4 uPose; uniform vec3 uP1; uniform vec3 uP2; uniform vec3 uPT; uniform vec4 uWet; uniform float uShell; uniform float uFurLen;
varying float vWet; varying vec3 vRest; varying vec3 vRestN;
vec3 dkRZ(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x*c - v.y*s, v.x*s + v.y*c, v.z); }
vec3 dkRY(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x*c + v.z*s, v.y, -v.x*s + v.z*c); }
vec3 dkDir(vec3 n){ n = dkRY(dkRZ(n, -uPose.y*aBend.y), uPose.z*aBend.y); n = dkRZ(n, -uPose.x*aBend.x); return dkRY(n, uPose.w*aBend.z); }
vec3 dkPos(vec3 p){ p = uP2 + dkRY(dkRZ(p - uP2, -uPose.y*aBend.y), uPose.z*aBend.y); p = uP1 + dkRZ(p - uP1, -uPose.x*aBend.x); return uPT + dkRY(p - uPT, uPose.w*aBend.z); }
`;

function hook(mat, U, opt = {}) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uPose = U.pose; sh.uniforms.uWet = U.wet; sh.uniforms.uP1 = U.P1; sh.uniforms.uP2 = U.P2; sh.uniforms.uPT = U.PT; sh.uniforms.uShell = { value: opt.shell || 0 }; sh.uniforms.uFurLen = U.furLen;
    sh.uniforms.uAxisY = U.axisY; sh.uniforms.uXR = U.xr; sh.uniforms.uFurTex = U.furTex; sh.uniforms.uFurScale = U.furScale; sh.uniforms.uWetTint = U.wetTint;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + VERT_COMMON)
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvRestN = objectNormal; objectNormal = dkDir(objectNormal);')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vRest = position; vWet = dot(aPart, uWet); transformed = dkPos(transformed);
${opt.shell ? 'float fl = uFurLen * uShell * (1.0 - 0.74 * vWet); transformed += dkDir(normal) * fl; transformed.y -= fl * uShell * 0.45;' : ''}`);
    if (opt.depth) return;
    let fs = sh.fragmentShader.replace('#include <common>', `#include <common>
varying float vWet; varying vec3 vRest; varying vec3 vRestN; uniform float uAxisY; uniform vec2 uXR; uniform sampler2D uFurTex; uniform float uFurScale; uniform float uShell; uniform vec3 uWetTint;`);
    if (opt.cyl) {
      fs = fs.replace('void main() {', `void main() {
float dua = atan(vRest.z, vRest.y - uAxisY) / 6.2831853 + 0.5; float dub = fract(dua + 0.5) - 0.5;
vec2 duckUv = vec2(fwidth(dua) <= fwidth(dub) ? dua : dub, clamp((vRest.x - uXR.x) / (uXR.y - uXR.x), 0.0, 1.0));`)
        .replace('#include <map_fragment>', THREE.ShaderChunk.map_fragment.replace(/vMapUv/g, 'duckUv'))
        .replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace(/vNormalMapUv/g, 'duckUv'))
        .replace('#include <normal_fragment_maps>', THREE.ShaderChunk.normal_fragment_maps.replace(/vNormalMapUv/g, 'duckUv'));
    }
    fs = fs.replace('#include <color_fragment>', `#include <color_fragment>
${opt.shell ? `{ vec3 an = abs(vRestN); vec2 fu = (an.y > an.x && an.y > an.z) ? vRest.xz : (an.x > an.z ? vRest.zy : vRest.xy);
  vec4 fnz = texture2D(uFurTex, fu * uFurScale); float strand = mix(fnz.r, fnz.g * 0.9 + fnz.r * 0.1, vWet * 0.85);
  if (strand < uShell * 0.96) discard; diffuseColor.rgb *= mix(0.6, 1.06, uShell); }` : ''}
diffuseColor.rgb *= mix(vec3(1.0), uWetTint, vWet);`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.36, vWet * 0.85);');
    sh.fragmentShader = fs;
  };
  mat.customProgramCacheKey = () => 'dk' + (opt.shell ? 'S' : 'B') + (opt.cyl ? 'C' : '') + (opt.depth ? 'D' : '');
  return mat;
}

const PAL = {
  parent: {
    base: (x, y, z, S) => { const b = smooth(0.0, 0.09, y); return [0.93 + 0.07 * b, 0.92 + 0.07 * b, 0.88 + 0.09 * b]; },
    bill: { bill: [0.93, 0.5, 0.1], mouth: [0.42, 0.16, 0.04], nail: [0.98, 0.8, 0.55] }, leg: 0xe9822a, wetTint: new THREE.Color(0.8, 0.8, 0.79),
  },
  kid: {
    base: (x, y, z, S) => { const b = smooth(0.005, 0.075, y); return [0.98, 0.86 - 0.1 * b, 0.42 - 0.24 * b]; },
    bill: { bill: [0.86, 0.47, 0.3], mouth: [0.36, 0.14, 0.08], nail: [0.95, 0.72, 0.6] }, leg: 0xd9773a, wetTint: new THREE.Color(0.7, 0.62, 0.5),
  },
};

export function makeDuckShared(low) {
  return { furTex: makeFurNoise(41, 256), dropGeo: (() => { const g = new THREE.SphereGeometry(1, 7, 5); g.scale(1, 0.62, 1); return g; })(),
    dropMat: new THREE.MeshStandardMaterial({ color: 0xc9d6dc, roughness: 0.02, transparent: true, opacity: 0.2, envMapIntensity: 5.5, depthWrite: false }), low };
}

export class Duck {
  constructor(kind, G, seed) {
    this.kind = kind; this.G = G; const S = (this.S = SHAPES[kind]); const P = PAL[kind]; const sh = G.duckShared; const r = (this.rand = rng(seed));
    this.mode = 'tub'; this.x = 0; this.z = 0; this.y = 0; this.heading = 0; this.vx = 0; this.vz = 0; this.wet = [0, 0, 0, 0]; this.foam = [0, 0, 0, 0];
    this.floating = false; this.subm = 0; this.pose = { neck: 0, head: 0, yaw: 0, tail: 0 }; this.tp = { neck: 0, head: 0, yaw: 0 }; this.roll = 0; this.pitch = 0; this.bob = 0;
    this.blink = 0; this.blinkT = 2 + r() * 3; this.lookT = 1; this.dabT = 6 + r() * 5; this.dab = 0; this.wag = 0; this.walk = null; this.stepPh = 0; this.asleep = 0; this.sleepy = false; this.idle = 0; this.showerT = -99; this.fluff = 0; this.held = false;
    this.patter = 0; this.wasFloating = false; this.groundedT = 0; this.shake = 0; this.other = null; this.lastQuack = -9; this.legPh = r() * 6; this.bedT = 0; this.dropT = 9;
    // 個体の模様
    let marks = [], fmarks = [];
    if (kind === 'kid') marks = [{ p: [0.06, 0.155, 0.004], r: [0.03, 0.026, 0.026], c: [0.5, 0.36, 0.14], a: 0.8 }, { p: [-0.035, 0.085, -0.012], r: [0.035, 0.022, 0.03], c: [0.55, 0.4, 0.15], a: 0.7 }, { p: [0.075, 0.13, 0.03], r: [0.012, 0.008, 0.008], c: [0.45, 0.32, 0.12], a: 0.5 }];
    else fmarks = [{ u: 0.61, v: 0.4, ru: 0.06, rv: 0.13, dens: 0.75, col: (rr) => `rgb(${190 + rr() * 25 | 0},${160 + rr() * 22 | 0},${120 + rr() * 22 | 0})` }, { u: 0.44, v: 0.18, ru: 0.035, rv: 0.07, dens: 0.6, col: (rr) => `rgb(${170 + rr() * 30 | 0},${140 + rr() * 22 | 0},${105 + rr() * 22 | 0})` }];
    const tA = performance.now(); const built = buildDuckGeometry(S, seed, { base: P.base, marks }); const geo = (this.geo = built.geo); (G.prof = G.prof || {})[kind + 'Geo'] = performance.now() - tA; G.prof[kind + 'Verts'] = geo.attributes.position.count;
    const U = (this.U = { pose: { value: new THREE.Vector4() }, wet: { value: new THREE.Vector4() }, P1: { value: new THREE.Vector3(...S.P1) }, P2: { value: new THREE.Vector3(...S.P2) }, PT: { value: new THREE.Vector3(...S.PT) }, furLen: { value: S.furLen },
      axisY: { value: S.axisY }, xr: { value: new THREE.Vector2(S.x0, S.x1) }, furTex: { value: sh.furTex }, furScale: { value: kind === 'kid' ? 12 : 8 }, wetTint: { value: P.wetTint } });
    this.group = new THREE.Group(); this.tilt = new THREE.Group(); this.group.add(this.tilt); G.scene.add(this.group);
    let bodyMat;
    if (kind === 'parent') {
      const tB = performance.now(); const fm = makeFeatherMaps(seed, { base: '#fbf9f3', bump: 1.6, feather: (rr, u, v, wing) => { const c = 247 + rr() * 8, w = wing * rr() * 10; return `rgb(${c | 0},${c - 1 - w * 0.4 | 0},${c - 5 - rr() * 5 - w | 0})`; } });
      G.prof.feather = performance.now() - tB;
      bodyMat = hook(new THREE.MeshPhysicalMaterial({ map: fm.map, normalMap: fm.normalMap, normalScale: new THREE.Vector2(0.55, 0.55), vertexColors: true, roughness: 0.7, sheen: 0.9, sheenRoughness: 0.5, sheenColor: new THREE.Color(1, 0.98, 0.94), envMapIntensity: 0.9 }), U, { cyl: true });
      this.shellMat = (s) => hook(new THREE.MeshStandardMaterial({ map: fm.map, vertexColors: true, roughness: 0.8, envMapIntensity: 0.9 }), U, { shell: s, cyl: true });
    } else {
      bodyMat = hook(new THREE.MeshStandardMaterial({ vertexColors: true, color: 0xb9a070, roughness: 0.85 }), U, {});
      this.shellMat = (s) => hook(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, envMapIntensity: 0.85 }), U, { shell: s });
    }
    this.body = new THREE.Mesh(geo, bodyMat); this.body.castShadow = true; this.body.receiveShadow = true; this.body.frustumCulled = false;
    this.body.customDepthMaterial = hook(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }), U, { depth: true }); this.tilt.add(this.body);
    this.shells = []; this.setShells(G.low);
    // 頭に付く物
    this.headG = new THREE.Group(); this.headG.matrixAutoUpdate = false; this.tilt.add(this.headG);
    const tC = performance.now(); const billGeo = buildBillGeometry(S, P.bill); G.prof[kind + 'Bill'] = performance.now() - tC;
    const bill = new THREE.Mesh(billGeo, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.3 })); bill.castShadow = true; this.headG.add(bill);
    const eyeMat = new THREE.MeshPhysicalMaterial({ color: 0x0b0806, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.0 }); const lidMat = new THREE.MeshStandardMaterial({ color: kind === 'kid' ? 0xe9bb4c : 0xf1eee6, roughness: 0.85 });
    this.lids = [];
    { let z = 0.0; while (built.sdf(S.eye[0], S.eye[1], z) < 0 && z < 0.1) z += 0.0004; this.eyeZ = z - S.eyeR * 0.42; }
    for (const sgn of [1, -1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(S.eyeR, 14, 10), eyeMat); e.position.set(S.eye[0], S.eye[1], this.eyeZ * sgn); this.headG.add(e);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(S.eyeR * 0.98, S.eyeR * 0.2, 6, 16), lidMat); ring.position.set(S.eye[0], S.eye[1], (this.eyeZ + S.eyeR * 0.3) * sgn); this.headG.add(ring);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(S.eyeR * 1.16, 12, 8), lidMat); lid.position.copy(e.position); lid.scale.set(1, 0.001, 1); lid.visible = false; this.headG.add(lid); this.lids.push(lid); }
    // 脚
    this.legs = []; const legMat = new THREE.MeshPhysicalMaterial({ color: P.leg, roughness: 0.5, clearcoat: 0.2 }); const legLen = S.legLen + S.hip[1]; const footG = buildFootGeometry(S.footL);
    for (const sgn of [1, -1]) { const lg = new THREE.Group(); lg.position.set(S.hip[0], S.hip[1], S.hip[2] * sgn); const bone = new THREE.Mesh(new THREE.CylinderGeometry(S.legR * 1.15, S.legR, legLen, 8), legMat); bone.position.y = -legLen / 2; bone.castShadow = true; lg.add(bone);
      const foot = new THREE.Group(); foot.position.y = -legLen; const fm = new THREE.Mesh(footG, legMat); fm.rotation.y = sgn * -0.22; fm.castShadow = true; foot.add(fm); lg.add(foot); this.tilt.add(lg); this.legs.push({ g: lg, foot, sgn, a: 0, lift: 0 }); }
    // 水滴と泡の付き場所を面から拾う
    const pos = geo.attributes.position, nrm = geo.attributes.normal, bend = geo.attributes.aBend, part = geo.attributes.aPart; const n = pos.count;
    const pick = (cnt, test) => { const out = []; let guard = 0; while (out.length < cnt && guard++ < cnt * 400) { const i = (r() * n) | 0; if (!test(i)) continue; let p = 0, best = 0; for (let k = 0; k < 4; k++) if (part.getComponent(i, k) > best) { best = part.getComponent(i, k); p = k; } out.push({ p: new THREE.Vector3().fromBufferAttribute(pos, i), n: new THREE.Vector3().fromBufferAttribute(nrm, i), part: p, th: r(), s: 0.6 + r() * 0.8, rot: r() * 6.28 }); } return out; };
    const rigid = (i) => bend.getX(i) < 0.04 && bend.getZ(i) < 0.04, headV = (i) => bend.getY(i) > 0.97 && pos.getX(i) < S.eye[0] + 0.004;
    const dN = sh.low ? 60 : 110; this.dropsB = pick(kind === 'kid' ? dN * 0.6 : dN, (i) => rigid(i) && nrm.getY(i) > -0.55); this.dropsH = pick(kind === 'kid' ? 14 : 22, (i) => headV(i) && nrm.getY(i) > -0.3);
    const dsz = kind === 'kid' ? 0.0021 : 0.003;
    this.dropMeshB = new THREE.InstancedMesh(sh.dropGeo, sh.dropMat, this.dropsB.length); this.dropMeshH = new THREE.InstancedMesh(sh.dropGeo, sh.dropMat, this.dropsH.length); this.dropMeshB.frustumCulled = this.dropMeshH.frustumCulled = false; this.tilt.add(this.dropMeshB); this.headG.add(this.dropMeshH); this.dropSize = dsz; this.wetShown = [-1, -1, -1, -1];
    // 泡: 頭の帽子・背・左右
    const fsz = kind === 'kid' ? 0.0085 : 0.013;
    this.foamH = pick(kind === 'kid' ? 10 : 16, (i) => headV(i) && nrm.getY(i) > 0.45); this.foamB = pick(kind === 'kid' ? 26 : 44, (i) => rigid(i) && (nrm.getY(i) > 0.5 || (Math.abs(nrm.getZ(i)) > 0.6 && pos.getY(i) > S.draft * 0.8 && pos.getY(i) < S.draft * 2.4)));
    for (const f of this.foamB) f.part = f.n.y > 0.5 ? 1 : f.p.z < 0 ? 2 : 3; for (const f of this.foamH) f.part = 0;
    this.foamMeshB = new THREE.InstancedMesh(G.water.foamGeo, G.water.foamMat, this.foamB.length); this.foamMeshH = new THREE.InstancedMesh(G.water.foamGeo, G.water.foamMat, this.foamH.length); this.foamMeshB.frustumCulled = this.foamMeshH.frustumCulled = false; this.foamMeshB.count = 0; this.foamMeshH.count = 0; this.tilt.add(this.foamMeshB); this.headG.add(this.foamMeshH); this.foamSize = fsz; this.foamShown = [-1, -1, -1, -1];
    this._m = new THREE.Matrix4(); this._m2 = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._v = new THREE.Vector3(); this._s = new THREE.Vector3(); this._zAxis = new THREE.Vector3(0, 0, 1); this._up = new THREE.Vector3(0, 1, 0); this._sl = [0, 0]; this._fl = [0, 0];
    this.headWorld = new THREE.Vector3(); this.center = new THREE.Vector3();
  }
  setShells(low) {
    for (const s of this.shells) { this.tilt.remove(s); s.material.dispose(); } this.shells = [];
    const n = this.G.lite ? 0 : this.kind === 'kid' ? (low ? 6 : 11) : (low ? 0 : 3);
    for (let i = 1; i <= n; i++) { const m = new THREE.Mesh(this.geo, this.shellMat(i / n)); m.frustumCulled = false; m.castShadow = false; m.receiveShadow = true; this.tilt.add(m); this.shells.push(m); }
  }

  // ---- 状態 ----
  place(mode, x, z, heading) { this.mode = mode; this.x = x; this.z = z; if (heading !== undefined) this.heading = heading; this.vx = this.vz = 0; this.y = this.restY(); this.walk = null; }
  restY() {
    const S = this.S, W = this.G.water;
    if (this.mode === 'tub') { const g = ground(this.x, this.z); const st = g + S.legLen; const fl = W.level > g + 0.004 ? W.surfaceAt(this.x, this.z) - S.draft : -9; return Math.max(st, fl); }
    if (this.mode === 'deck') return 0.006 + S.legLen;
    if (this.mode === 'bed') { const dx = (this.x - L.BED.x) / L.BED.rx, dz = (this.z - L.BED.z) / L.BED.rz; return 0.036 + 0.03 * Math.pow(Math.min(1, Math.sqrt(dx * dx + dz * dz)), 2.2) - S.draft * 0.25; }
    return this.y;
  }
  grab() { this.held = true; this.trail = null; this.mode = 'held'; this.walk = null; this.asleep = 0; this.sleepy = false; this.idle = 0; this.G.audio.voice(this.kind, 0.8); }
  moveHeld(x, y, z, dt) {
    if (!this.trail) this.trail = { x: this.x, z: this.z }; const tr = this.trail; const k = 1 - Math.exp(-3 * dt); tr.x += (x - tr.x) * k; tr.z += (z - tr.z) * k;
    const dx = x - tr.x, dz = z - tr.z, l = Math.hypot(dx, dz); if (l > 0.035) this.heading += angDiff(this.heading, Math.atan2(dz, dx)) * Math.min(1, dt * 7);
    this.vx = (x - this.x) / Math.max(dt, 0.001); this.vz = (z - this.z) / Math.max(dt, 0.001); this.x = damp(this.x, x, 30, dt); this.z = damp(this.z, z, 30, dt); this.y = damp(this.y, y, 14, dt);
  }
  release(mode, x, z) {
    const W = this.G.water; this.held = false; this.mode = mode; this.x = x; this.z = z; this.vx = this.vz = 0; this.dropT = 0; this.idle = 0; this.bedT = 0;
    if (mode === 'tub') this.wasFloating = false;
  }
  hull() { const c = Math.cos(this.heading), s = Math.sin(this.heading); return { x: this.x + c * this.S.len * 0.08, z: this.z + s * this.S.len * 0.08, c, s, a: this.S.len * 1.02, b: this.S.wid * 1.02 }; }
  // 布との当たり判定用の球(ワールド座標)
  spheres(out) {
    const S = this.S, c = Math.cos(this.heading), s = Math.sin(this.heading); const by = this.y + S.axisY; const k = this.kind === 'kid' ? 1 : 1;
    out[0].set(this.x + c * S.len * 0.42, by, this.z + s * S.len * 0.42, S.wid * 0.98); out[1].set(this.x - c * S.len * 0.38, by, this.z - s * S.len * 0.38, S.wid * 0.95);
    out[2].set(this.headWorld.x, this.headWorld.y, this.headWorld.z, S.wid * 0.62); return out;
  }
  // ワールド座標の点がどの部位か(0頭 1背 2左 3右)
  partAt(wx, wy, wz) { if (wy > this.y + this.S.P2[1] - this.S.wid * 0.3 && Math.hypot(wx - this.headWorld.x, wz - this.headWorld.z) < this.S.wid) return 0; const dx = wx - this.x, dz = wz - this.z; const lz = -dx * Math.sin(this.heading) + dz * Math.cos(this.heading); if (wy > this.y + this.S.axisY * 1.55 && Math.abs(lz) < this.S.wid * 0.62) return 1; return lz < 0 ? 2 : 3; }
  wetTotal() { return (this.wet[0] + this.wet[1] + this.wet[2] + this.wet[3]) / 4; }

  update(dt, time) {
    const S = this.S, G = this.G, W = G.water, o = this.other; this.idle += dt; this.dropT += dt;
    if (this.mode === 'tub') this.updateTub(dt, time);
    else if (this.mode === 'deck') { this.floating = false; this.subm = -1; this.y = damp(this.y, this.restY(), 9, dt); this.roll = damp(this.roll, 0, 6, dt); this.pitch = damp(this.pitch, 0, 6, dt); this.sepLand(dt, o); }
    else if (this.mode === 'bed') this.updateBed(dt, time);
    else { this.floating = false; this.subm = -1; this.pitch = damp(this.pitch, clamp(-Math.hypot(this.vx, this.vz) * 0.25, -0.25, 0), 6, dt); this.roll = damp(this.roll, Math.sin(time * 5.3) * 0.04, 6, dt); }
    // 泡: 水に浸かれば落ち、浮いていれば少しずつ付く
    this.updateFoamWet(dt, time);
    this.animate(dt, time);
  }

  updateTub(dt, time) {
    const S = this.S, W = this.G.water, o = this.other; const g = ground(this.x, this.z); const hasW = W.level > g + 0.004; const surf = hasW ? W.surfaceAt(this.x, this.z) : -9;
    const st = g + S.legLen, fl = surf - S.draft; const target = Math.max(st, fl); const was = this.floating; this.floating = fl > st + 0.0015; this.subm = hasW ? surf - this.y : -1;
    const falling = this.y > target + 0.004; this.y = damp(this.y, target, falling ? 8 : 12, dt);
    if (this.dropT < 0.6 && !this._splashed && this.y - target < 0.02 && hasW) { this._splashed = true; const pw = this.kind === 'parent' ? 1 : 0.35; W.impulse(this.x, this.z, -7.5 * pw - 1.2, S.len * 0.9); W.splash(this.x, this.z, pw * (this.floating ? 1.6 : 0.6)); this.G.audio.plop(pw, this.floating); this.wag = 0.9; if (this.floating) { this.wet[2] = Math.max(this.wet[2], 0.6); this.wet[3] = Math.max(this.wet[3], 0.6); } }
    if (this.dropT > 0.6) this._splashed = false; if (this.dropT < 0.05) this._splashed = false;
    if (this.floating) {
      this.groundedT = 0; this.wasFloating = true; W.flowAt(this.x, this.z, this._fl); W.slopeAt(this.x, this.z, this._sl);
      const k = Math.min(1, dt * (this.kind === 'kid' ? 3.2 : 1.7)); this.vx += (this._fl[0] * 0.92 - this._sl[0] * 0.35 - this.vx) * k; this.vz += (this._fl[1] * 0.92 - this._sl[1] * 0.35 - this.vz) * k;
      // 子は離れすぎたらゆっくり寄る(置いた関係はすぐ崩さない)
      if (this.kind === 'kid' && o && o.mode === 'tub' && this.idle > 14 && o.idle > 6) { const dx = o.x - this.x, dz = o.z - this.z, d = Math.hypot(dx, dz); if (d > 0.46) { this.vx += dx / d * 0.012 * dt * 8; this.vz += dz / d * 0.012 * dt * 8; this.heading += angDiff(this.heading, Math.atan2(dz, dx)) * dt * 0.8; this.paddle = 1; } }
      this.x += this.vx * dt; this.z += this.vz * dt;
      const sp = Math.hypot(this.vx, this.vz); if (sp > 0.05) this.heading += angDiff(this.heading, Math.atan2(this.vz, this.vx)) * Math.min(1, dt * 0.5 * sat(sp / 0.2));
      const c = Math.cos(this.heading), s = Math.sin(this.heading); const fwd = this._sl[0] * c + this._sl[1] * s, lat = -this._sl[0] * s + this._sl[1] * c;
      this.pitch = damp(this.pitch, clamp(fwd * 0.9, -0.3, 0.3), 7, dt); this.roll = damp(this.roll, clamp(lat * 1.3, -0.35, 0.35), 7, dt);
      if (sp > 0.03 && this.rand() < dt * 6) W.impulse(this.x - c * S.len * 0.8, this.z - s * S.len * 0.8, 0.25 * sat(sp / 0.2), 0.03);
    } else {
      this.vx = damp(this.vx, 0, 10, dt); this.vz = damp(this.vz, 0, 10, dt); this.pitch = damp(this.pitch, 0, 8, dt);
      if (was && !this.floating) { this.groundedT = 0; }
      this.groundedT += dt;
      // 水が引いて足がついたら、とことこ歩く
      if (this.wasFloating && this.groundedT > 0.5 && !this.walk && (!hasW || (W.level - g < S.legLen * 0.75 && W.drainQ > 1e-5))) { this.wasFloating = false; this.startWaddle(); }
      this.updateWalk(dt, time);
    }
    const p = clampToTub(this.x, this.z, S.wid + 0.012); if (p[0] !== this.x || p[1] !== this.z) { this.x = p[0]; this.z = p[1]; this.vx *= 0.4; this.vz *= 0.4; }
    // 二羽の間合い
    if (o && o.mode === 'tub') { const dx = this.x - o.x, dz = this.z - o.z; const d = Math.hypot(dx, dz) || 0.001; const min = (S.len + o.S.len) * 0.62; if (d < min) { const push = (min - d) * (this.kind === 'kid' ? 0.8 : 0.2); this.x += dx / d * push; this.z += dz / d * push; } }
  }
  startWaddle() {
    const o = this.other; const onStep = this.x < L.STEP_X0 - 0.01; let gx, gz;
    if (o && o.mode === 'tub' && (o.x < L.STEP_X0 - 0.01) === onStep && this.kind === 'kid') { gx = o.x; gz = o.z; } else { gx = onStep ? -0.34 : 0.1; gz = -0.1; }
    let dx = gx - this.x, dz = gz - this.z; const d = Math.hypot(dx, dz) || 1; const len = Math.min(d - (this.kind === 'kid' ? 0.15 : 0), 0.2); if (len < 0.03) { this.wag = 1; return; }
    let tx = this.x + dx / d * len, tz = this.z + dz / d * len; if (onStep) tx = Math.min(tx, L.STEP_X0 - 0.04); else tx = Math.max(tx, L.STEP_X1 + 0.06);
    const q = clampToTub(tx, tz, 0.11); this.walk = { x: q[0], z: q[1], t: 0 };
  }
  updateWalk(dt, time) {
    if (!this.walk) { this.roll = damp(this.roll, 0, 8, dt); return; }
    const w = this.walk; const dx = w.x - this.x, dz = w.z - this.z; const d = Math.hypot(dx, dz); w.t += dt;
    if (d < 0.012 || w.t > 6) { this.walk = null; this.wag = 1; this.G.audio.voice(this.kind, 0.5); return; }
    const sp = this.kind === 'kid' ? 0.085 : 0.07; this.heading += angDiff(this.heading, Math.atan2(dz, dx)) * Math.min(1, dt * 6); this.x += dx / d * sp * dt; this.z += dz / d * sp * dt;
    const f = this.kind === 'kid' ? 5.2 : 3.4; const ph0 = this.stepPh; this.stepPh += dt * f * Math.PI * 2; this.roll = Math.sin(this.stepPh) * 0.12;
    if (Math.floor(ph0 / Math.PI) !== Math.floor(this.stepPh / Math.PI)) { this.G.audio.pat(this.kind === 'kid' ? 1.6 : 1, this.G.water.level > ground(this.x, this.z) + 0.003); if (this.G.water.level > ground(this.x, this.z) + 0.003) this.G.water.impulse(this.x, this.z, -0.5, 0.025); }
  }
  sepLand(dt, o) { if (o && o.mode === this.mode) { const dx = this.x - o.x, dz = this.z - o.z; const d = Math.hypot(dx, dz) || 0.001; const min = (this.S.len + o.S.len) * 0.6; if (d < min) { const push = (min - d) * (this.kind === 'kid' ? 0.85 : 0.15); this.x += (dx / d) * push; this.z += (dz / d) * push; } }
    if (this.mode === 'deck') { const T = L.TOWEL; this.x = clamp(this.x, T.x0 + 0.03, T.x1 - 0.03); this.z = clamp(this.z, -0.74, -0.47); } }
  updateBed(dt, time) {
    const S = this.S, o = this.other, B = L.BED; this.floating = false; this.subm = -1; this.bedT += dt; this.roll = damp(this.roll, 0, 5, dt); this.pitch = damp(this.pitch, 0, 5, dt);
    // 寝床の中へ収め、二羽なら寄り添う
    const lim = Math.max(0.12, 1 - (S.len * 1.05) / B.rx); let dx = (this.x - B.x) / B.rx, dz = (this.z - B.z) / B.rz; const rr = Math.hypot(dx, dz); if (rr > lim) { dx *= lim / rr; dz *= lim / rr; this.x = damp(this.x, B.x + dx * B.rx, 8, dt); this.z = damp(this.z, B.z + dz * B.rz, 8, dt); }
    if (o && o.mode === 'bed') { const ex = this.x - o.x, ez = this.z - o.z; const d = Math.hypot(ex, ez) || 0.001; const want = (S.wid + o.S.wid) * 1.02; const k = this.kind === 'kid' ? 0.8 : 0.2; const mv = (want - d) * k * Math.min(1, dt * (d < want ? 8 : 1.4)); this.x += ex / d * mv; this.z += ez / d * mv; }
    this.y = damp(this.y, this.restY(), 8, dt);
    // 濡れた側が触れた布へ水が移る
    const st = this.G.env.stain; const c = Math.cos(this.heading), s = Math.sin(this.heading);
    for (const side of [2, 3]) { const w = this.wet[side]; if (w < 0.02) continue; const amt = Math.min(w, dt * 0.16 * (0.4 + w)); this.wet[side] -= amt; const lz = (side === 2 ? -1 : 1) * S.wid * 0.62; const wx = this.x - s * lz, wz = this.z + c * lz; this.G.stainAdd(wx, wz, S.wid * 0.95, amt * (this.kind === 'kid' ? 2.6 : 2.0)); }
  }

  updateFoamWet(dt, time) {
    const S = this.S, W = this.G.water;
    if (this.mode === 'tub' && this.subm > S.draft * 0.5) {
      this.wet[2] = Math.min(1, this.wet[2] + dt * 0.9); this.wet[3] = Math.min(1, this.wet[3] + dt * 0.9);
      // 水面の泡が体に付く(前寄りは頭へ)
      if (this.floating && this.rand() < dt * 2.2) { const h = this.hull(); for (let k = W.fn - 1; k >= 0; k--) { if (W.ftmp[k]) continue; const dx = W.fx[k] - h.x, dz = W.fz[k] - h.z; const lx = dx * h.c + dz * h.s, lz = -dx * h.s + dz * h.c; const e = (lx * lx) / ((h.a + 0.025) * (h.a + 0.025)) + (lz * lz) / ((h.b + 0.025) * (h.b + 0.025));
          if (e < 1) { const part = lx > h.a * 0.55 ? 0 : (Math.abs(lz) < h.b * 0.35 ? 1 : lz < 0 ? 2 : 3); const cap = part === 0 ? 0.75 : 0.55; if (this.foam[part] < cap) { this.foam[part] = Math.min(1, this.foam[part] + (this.kind === 'kid' ? 0.11 : 0.09)); W.killFoam(k); } break; } } }
    }
    // 湯から上がると泡は少しずつはじけて消える
    if (this.mode === 'deck' || this.mode === 'bed') for (let k = 0; k < 4; k++) this.foam[k] = Math.max(0, this.foam[k] - dt * 0.035);
  }

  // シャワーが当たった: 濡れて、泡はその部位だけ滑り落ちる。落ちた量を返す
  showerHit(part, dt) { this.wet[part] = Math.min(1, this.wet[part] + dt * 2.2); if (part === 0) this.wet[1] = Math.min(1, this.wet[1] + dt * 0.5); const f = this.foam[part]; if (f <= 0.001) return 0; const d = Math.min(f, dt * 0.55); this.foam[part] = f - d; return d; }

  animate(dt, time) {
    const S = this.S, G = this.G, p = this.pose, tp = this.tp;
    // まばたき・見回し
    this.blinkT -= dt; if (this.blinkT < 0) { this.blink = 0.16; this.blinkT = 2.2 + this.rand() * 4; } this.blink = Math.max(0, this.blink - dt);
    this.lookT -= dt; if (this.lookT < 0) { this.lookT = 1.6 + this.rand() * 3; tp.yaw = (this.rand() - 0.5) * 1.1; if (G.lookAt && this.kind === 'kid' && this.rand() < 0.75) { const a = Math.atan2(G.lookAt.z - this.z, G.lookAt.x - this.x); tp.yaw = clamp(-angDiff(this.heading, a), -1.2, 1.2); } }
    let neck = 0, head = 0, yaw = tp.yaw;
    const showered = time - this.showerT < 2.6;
    if (this.asleep > 0.02) { neck = (this.kind === 'kid' ? 0.55 : 0.85) * this.asleep; head = 0.7 * this.asleep; yaw = lerp(yaw, -Math.sign(Math.cos(this.heading) || 1) * 0.95, this.asleep); }
    else if (showered) { neck = this.kind === 'parent' ? 0.95 : 0.6; head = 0.25; yaw *= 0.2; }
    else if (this.held) { neck = -0.12; head = -0.1; }
    else if (this.floating && this.kind === 'parent') { this.dabT -= dt; if (this.dabT < 0) { this.dab = 1.5; this.dabT = 7 + this.rand() * 6; } }
    if (this.dab > 0) { this.dab -= dt; const k = Math.sin(sat(this.dab / 1.5) * Math.PI); neck = Math.max(neck, 1.35 * k); head = Math.max(head, 0.5 * k); yaw *= 1 - k;
      if (this.dab < 0.8 && !this._dabbed && this.floating) { this._dabbed = true; const hw = this.headWorld; G.water.impulse(hw.x, hw.z, -1.6, 0.03); G.audio.plink(1.1); this.wet[0] = Math.min(1, this.wet[0] + 0.35); if (G.water.takeFoam(hw.x, hw.z, 0.09, 3) > 0) this.foam[0] = Math.min(0.9, this.foam[0] + 0.45); } } else this._dabbed = false;
    p.neck = damp(p.neck, neck, 5, dt); p.head = damp(p.head, head, 6, dt); p.yaw = damp(p.yaw, yaw, 4, dt);
    this.wag = Math.max(0, this.wag - dt); const wagA = this.wag > 0 ? Math.sin(time * 34) * 0.42 * sat(this.wag * 2) : 0; p.tail = wagA;
    this.shake = Math.max(0, this.shake - dt);
    this.U.pose.value.set(p.neck, p.head, p.yaw, p.tail); this.U.wet.value.set(this.wet[0], this.wet[1], this.wet[2], this.wet[3]);
    // 寝息
    const breath = this.asleep > 0.5 ? Math.sin(time * (this.kind === 'kid' ? 2.7 : 1.9)) * 0.018 : 0;
    // 体の位置
    const pat = this.patter > 0 ? Math.abs(Math.sin(time * 19)) * 0.0025 : 0; this.patter = Math.max(0, this.patter - dt);
    this.group.position.set(this.x, this.y + pat, this.z); this.group.rotation.y = -this.heading;
    this.tilt.rotation.set(this.roll + (this.shake > 0 ? Math.sin(time * 40) * 0.06 * sat(this.shake * 3) : 0), 0, -this.pitch); this.tilt.scale.set(1, 1 + breath, 1 + breath * 0.6);
    // 頭の剛体行列
    const m = this._m, m2 = this._m2; m.makeTranslation(S.P1[0], S.P1[1], S.P1[2]); m.multiply(m2.makeRotationZ(-p.neck)); m.multiply(m2.makeTranslation(S.P2[0] - S.P1[0], S.P2[1] - S.P1[1], 0)); m.multiply(m2.makeRotationY(p.yaw)); m.multiply(m2.makeRotationZ(-p.head)); m.multiply(m2.makeTranslation(-S.P2[0], -S.P2[1], -S.P2[2]));
    if (Math.abs(p.tail) > 1e-4) { m2.makeTranslation(0, 0, 0); } this.headG.matrix.copy(m); this.headG.matrixWorldNeedsUpdate = true;
    this.group.updateMatrixWorld(true); this.headWorld.set(S.eye[0] - S.eyeR * 2, S.eye[1] + S.eyeR, 0).applyMatrix4(this.headG.matrixWorld); this.center.set(0, S.axisY, 0).applyMatrix4(this.tilt.matrixWorld);
    // まぶた
    const closed = Math.max(this.asleep, this.blink > 0 ? 1 : 0); for (const l of this.lids) { l.visible = closed > 0.02; l.scale.y = Math.max(0.001, closed); }
    // 脚
    const g = this.mode === 'tub' ? ground(this.x, this.z) : 0; const clear = this.mode === 'tub' ? this.y - (g + S.legLen) : this.mode === 'held' ? 1 : 0;
    this.legPh += dt * (this.held ? 7 : this.floating ? (Math.hypot(this.vx, this.vz) > 0.03 || this.paddle ? 9 : 2.2) : 0); this.paddle = 0;
    for (const lg of this.legs) { let a = 0, vis = 1;
      if (this.mode === 'bed') vis = 0; else if (this.held) a = -0.35 + Math.sin(this.legPh + (lg.sgn > 0 ? 0 : Math.PI)) * 0.4;
      else if (clear > 0.002) { const k = sat(clear / (S.legLen * 0.6)); a = -(0.95 * k) + Math.sin(this.legPh + (lg.sgn > 0 ? 0 : Math.PI)) * 0.32 * k; }
      else if (this.walk) a = Math.sin(this.stepPh + (lg.sgn > 0 ? 0 : Math.PI)) * 0.5; else if (this.patter > 0) a = Math.max(0, Math.sin(time * 19 + (lg.sgn > 0 ? 0 : Math.PI))) * -0.5;
      lg.a = damp(lg.a, a, 14, dt); lg.g.rotation.z = lg.a; lg.foot.rotation.z = -lg.a * (clear > 0.002 || this.held ? 0.25 : 1) + this.pitch; lg.g.visible = vis > 0; }
    this.refreshDrops(); this.refreshFoam();
  }
  refreshDrops() {
    let ch = false; for (let k = 0; k < 4; k++) if (Math.abs(this.wet[k] - this.wetShown[k]) > 0.012) ch = true; if (!ch) return; for (let k = 0; k < 4; k++) this.wetShown[k] = this.wet[k];
    const m = this._m2, q = this._q, v = this._v, s = this._s;
    for (const [arr, mesh] of [[this.dropsB, this.dropMeshB], [this.dropsH, this.dropMeshH]]) { let n = 0; for (const d of arr) { const w = this.wet[d.part]; const k = sat((w - d.th * 0.8) / 0.2); if (k <= 0.02) continue; const sz = this.dropSize * d.s * (0.55 + 0.45 * k); q.setFromUnitVectors(this._up, d.n); v.copy(d.p).addScaledVector(d.n, sz * 0.25 + (this.kind === 'kid' ? this.S.furLen * 0.3 * (1 - w * 0.7) : 0.0006)); s.set(sz, sz, sz * (1 + d.th * 0.5)); m.compose(v, q, s); mesh.setMatrixAt(n++, m); } mesh.count = n; mesh.instanceMatrix.needsUpdate = true; }
  }
  refreshFoam() {
    let ch = false; for (let k = 0; k < 4; k++) if (Math.abs(this.foam[k] - this.foamShown[k]) > 0.008) ch = true; if (!ch) return; for (let k = 0; k < 4; k++) this.foamShown[k] = this.foam[k];
    const m = this._m2, q = this._q, v = this._v, s = this._s;
    for (const [arr, mesh] of [[this.foamB, this.foamMeshB], [this.foamH, this.foamMeshH]]) { let n = 0; for (const d of arr) { const f = this.foam[d.part]; const k = sat((f - d.th * 0.55) / 0.3); if (k <= 0.03) continue; const sz = this.foamSize * (0.7 + d.s * 0.5) * (0.45 + 0.55 * k) * (d.part === 0 ? 1.15 : 1); q.setFromUnitVectors(this._up, d.n); v.copy(d.p).addScaledVector(d.n, sz * 0.35); s.set(sz * 1.15, sz * 0.75, sz * 1.15); m.compose(v, q, s); mesh.setMatrixAt(n++, m); } mesh.count = n; mesh.instanceMatrix.needsUpdate = true; }
  }
}
