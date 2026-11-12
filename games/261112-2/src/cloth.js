// タオル: 少数質点のVerlet布。羽の水滴を受け取り、濡れ色が広がる
import * as THREE from 'three';
import { L, inBed } from './layout.js';
import { makeTerry } from './textures.js';
import { clamp, sat } from './util.js';

const CW = 15, CH = 23;
export class Towel {
  constructor(G) {
    this.G = G; const T = L.TOWEL; this.sx = (T.x1 - T.x0) / (CW - 1); this.sy = 0.0282; const n = CW * CH; this.n = n;
    this.p = new Float32Array(n * 3); this.q = new Float32Array(n * 3); this.wet = new Float32Array(n); this.grab = -1; this.target = new THREE.Vector3(); this.rub = 0; this.contact = 0; this.acc = 0;
    this.reset();
    // 拘束(構造+せん断)
    const cons = []; const id = (i, j) => j * CW + i;
    for (let j = 0; j < CH; j++) for (let i = 0; i < CW; i++) { if (i < CW - 1) cons.push(id(i, j), id(i + 1, j), this.sx); if (j < CH - 1) cons.push(id(i, j), id(i, j + 1), this.sy); if (i < CW - 1 && j < CH - 1) { const d = Math.hypot(this.sx, this.sy); cons.push(id(i, j), id(i + 1, j + 1), d, id(i + 1, j), id(i, j + 1), d); } }
    this.cons = cons;
    const geo = new THREE.BufferGeometry(); const uv = new Float32Array(n * 2); const idx = [];
    for (let j = 0; j < CH; j++) for (let i = 0; i < CW; i++) { uv[(j * CW + i) * 2] = i / (CW - 1); uv[(j * CW + i) * 2 + 1] = j / (CH - 1); }
    for (let j = 0; j < CH - 1; j++) for (let i = 0; i < CW - 1; i++) { const a = id(i, j), b = id(i + 1, j), c = id(i, j + 1), d = id(i + 1, j + 1); idx.push(a, c, b, b, c, d); }
    this.posAttr = new THREE.BufferAttribute(new Float32Array(n * 3), 3); this.posAttr.setUsage(THREE.DynamicDrawUsage); this.wetAttr = new THREE.BufferAttribute(new Float32Array(n), 1); this.wetAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setAttribute('aWet', this.wetAttr); geo.setIndex(idx); this.geo = geo;
    const terry = makeTerry(17, 128); terry.repeat.set(9, 14);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xd98a72, roughness: 0.95, normalMap: terry, normalScale: new THREE.Vector2(1.1, 1.1), sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(1, 0.86, 0.8), side: THREE.DoubleSide });
    mat.onBeforeCompile = (s) => {
      s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nattribute float aWet; varying float vTw; varying vec2 vTuv;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvTw = aWet; vTuv = uv;');
      s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vTw; varying vec2 vTuv;')
        .replace('#include <color_fragment>', `#include <color_fragment>
float band = smoothstep(0.855, 0.862, vTuv.y) * (1.0 - smoothstep(0.885, 0.892, vTuv.y)) + smoothstep(0.915, 0.92, vTuv.y) * (1.0 - smoothstep(0.932, 0.937, vTuv.y));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.94, 0.9, 0.84), band * 0.85);
float tw = smoothstep(0.03, 0.75, vTw); diffuseColor.rgb *= mix(vec3(1.0), vec3(0.5, 0.47, 0.52), tw);`)
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.6, smoothstep(0.03, 0.75, vTw));');
    };
    this.mesh = new THREE.Mesh(geo, mat); this.mesh.castShadow = true; this.mesh.receiveShadow = true; this.mesh.frustumCulled = false; G.scene.add(this.mesh);
    // 竿の向こう側へ垂れる分(動かない)
    const back = new THREE.Mesh(new THREE.PlaneGeometry(T.x1 - T.x0, 0.16, 1, 1), mat); back.position.set((T.x0 + T.x1) / 2, T.railY - 0.075, T.railZ - 0.012); back.rotation.y = Math.PI; back.geometry.setAttribute('aWet', new THREE.BufferAttribute(new Float32Array(4), 1)); G.scene.add(back);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, T.x1 - T.x0, 10, 1, true, 0, Math.PI), mat); cap.rotation.z = Math.PI / 2; cap.rotation.y = 0; cap.position.set((T.x0 + T.x1) / 2, T.railY, T.railZ); cap.geometry.setAttribute('aWet', new THREE.BufferAttribute(new Float32Array(cap.geometry.attributes.position.count), 1)); G.scene.add(cap);
    this.sph = []; for (let i = 0; i < 6; i++) this.sph.push(new THREE.Vector4());
    for (let i = 0; i < 90; i++) this.step(1 / 60);
    this.sync();
  }
  reset() {
    const T = L.TOWEL; const hang = Math.floor((T.railY - 0.01) / this.sy);
    for (let j = 0; j < CH; j++) for (let i = 0; i < CW; i++) { const k = (j * CW + i) * 3; const x = T.x0 + i * this.sx; let y, z; if (j <= hang) { y = T.railY - j * this.sy; z = T.railZ + 0.014 + j * 0.0012; } else { y = 0.008; z = T.railZ + 0.03 + (j - hang) * this.sy; } this.p[k] = this.q[k] = x; this.p[k + 1] = this.q[k + 1] = y; this.p[k + 2] = this.q[k + 2] = z; }
  }
  corner(side, out) { const k = ((CH - 1) * CW + (side ? CW - 1 : 0)) * 3; return out.set(this.p[k], this.p[k + 1], this.p[k + 2]); }
  grabCorner(side) { this.grab = side; this.corner(side, this.target); }
  moveGrab(x, y, z) {
    const T = L.TOWEL; const ax = this.grab ? T.x1 : T.x0; x = clamp(x, T.x0 - 0.32, L.BED.x + 0.2); z = clamp(z, L.WALL_Z + 0.03, -0.37); y = clamp(y, 0.03, 0.34);
    // 竿からの届く長さへ収める
    const dx = x - ax, dy = y - T.railY, dz = z - T.railZ; const d = Math.hypot(dx, dy, dz), max = (CH - 1) * this.sy * 1.0; if (d > max) { const k = max / d; x = ax + dx * k; y = T.railY + dy * k; z = T.railZ + dz * k; }
    this.target.set(x, y, z);
  }
  release() { this.grab = -1; }

  step(dt) {
    const p = this.p, q = this.q, n = this.n; const g = -9.8 * 0.55 * dt * dt; const G = this.G; const B = L.BED;
    for (let i = CW; i < n; i++) { const k = i * 3; const vx = (p[k] - q[k]) * 0.975, vy = (p[k + 1] - q[k + 1]) * 0.975, vz = (p[k + 2] - q[k + 2]) * 0.975; q[k] = p[k]; q[k + 1] = p[k + 1]; q[k + 2] = p[k + 2]; p[k] += vx; p[k + 1] += vy + g; p[k + 2] += vz; }
    // あひるの球
    let ns = 0; const ducks = G.ducks || [];
    for (const d of ducks) { if (d.mode === 'held' || d.z > -0.3) continue; d.spheres([this.sph[ns], this.sph[ns + 1], this.sph[ns + 2]]); ns += 3; }
    const gi = this.grab >= 0 ? (CH - 1) * CW + (this.grab ? CW - 1 : 0) : -1; const cons = this.cons; let contact = 0, rub = 0;
    for (let it = 0; it < 6; it++) {
      for (let c = 0; c < cons.length; c += 3) { const a = cons[c] * 3, b = cons[c + 1] * 3, rest = cons[c + 2]; const dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2]; const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6; const f = (d - rest) / d * 0.5; const wa = cons[c] < CW ? 0 : 1, wb = cons[c + 1] < CW ? 0 : 1; const sum = wa + wb; if (!sum) continue; const fa = f * 2 * wa / sum, fb = f * 2 * wb / sum; p[a] += dx * fa; p[a + 1] += dy * fa; p[a + 2] += dz * fa; p[b] -= dx * fb; p[b + 1] -= dy * fb; p[b + 2] -= dz * fb; }
      if (gi >= 0) { const k = gi * 3; p[k] = this.target.x; p[k + 1] = this.target.y; p[k + 2] = this.target.z; }
      for (let i = CW; i < n; i++) { const k = i * 3; let x = p[k], y = p[k + 1], z = p[k + 2];
        if (z < L.WALL_Z + 0.007) z = L.WALL_Z + 0.007;
        let minY = z < L.DECK_Z0 ? 0.007 : z < -L.HZ ? 0.018 : -0.03;
        if (inBed(x, z, 0.02)) { const ex = (x - B.x) / B.rx, ez = (z - B.z) / B.rz; const e = Math.sqrt(ex * ex + ez * ez); minY = e > 0.8 ? 0.086 : 0.052; }
        if (y < minY) { y = minY; if (i !== gi) { p[k] = x = q[k] + (x - q[k]) * 0.55; p[k + 2] = z = q[k + 2] + (z - q[k + 2]) * 0.55; } }
        for (let s = 0; s < ns; s++) { const sp = this.sph[s]; const dx = x - sp.x, dy = y - sp.y, dz = z - sp.z; const rr = sp.w + 0.006; const d2 = dx * dx + dy * dy + dz * dz; if (d2 < rr * rr) { const d = Math.sqrt(d2) || 1e-5; const k2 = rr / d; x = sp.x + dx * k2; y = sp.y + dy * k2; z = sp.z + dz * k2; } }
        p[k] = x; p[k + 1] = y; p[k + 2] = z; }
    }
    // 羽の水滴を布へ渡す
    if (ns) for (let i = CW; i < n; i++) { const k = i * 3; const x = p[k], y = p[k + 1], z = p[k + 2];
      for (let s = 0; s < ns; s++) { const sp = this.sph[s]; const dx = x - sp.x, dy = y - sp.y, dz = z - sp.z; const rr = sp.w + 0.016; if (dx * dx + dy * dy + dz * dz < rr * rr) { const duck = this.duckOf(s); const part = s % 3 === 2 ? 0 : duck.partAt(x, y, z);
          const sp2 = Math.hypot(p[k] - q[k], p[k + 1] - q[k + 1], p[k + 2] - q[k + 2]) / dt; contact++; rub += sp2;
          const w = duck.wet[part]; const room = 1 - this.wet[i]; let hand = 0; if (gi >= 0) { const gc = this.grab ? CW - 1 : 0; const dc = Math.abs((i % CW) - gc), dr = CH - 1 - Math.floor(i / CW); hand = 1 - sat((Math.hypot(dc, dr) - 2.0) / 2.2); } // 指で押さえている端の近くだけがよく拭ける
          if (w > 0.002 && room > 0.02) { const amt = Math.min(w, dt * (0.0015 + hand * sat((sp2 - 0.03) / 0.3) * (duck.kind === 'kid' ? 0.3 : 0.2)) * room); duck.wet[part] = w - amt; this.wet[i] = Math.min(1, this.wet[i] + amt * (duck.kind === 'kid' ? 2.4 : 4.2)); duck.wiped = (duck.wiped || 0) + amt; if (w > 0.06 && duck.wet[part] <= 0.06) { duck.wag = 0.9; duck.shake = 0.5; G.audio.voice(duck.kind, 0.6); } }
          if (duck.foam[part] > 0) duck.foam[part] = Math.max(0, duck.foam[part] - dt * 0.25);
          break; } } }
    this.contact = contact; this.rub = contact ? rub / contact : 0;
    // 濡れは布の中をゆっくり広がり、ごくゆっくり乾く
    this.acc += dt; if (this.acc > 0.1) { const w = this.wet, a = this.acc; this.acc = 0; for (let j = 0; j < CH; j++) for (let i = 0; i < CW; i++) { const k = j * CW + i; let s = 0, c = 0; if (i > 0) { s += w[k - 1]; c++; } if (i < CW - 1) { s += w[k + 1]; c++; } if (j > 0) { s += w[k - CW]; c++; } if (j < CH - 1) { s += w[k + CW]; c++; } w[k] += (s / c - w[k]) * Math.min(0.5, a * 0.16); w[k] = Math.max(0, w[k] - a * 0.0012); }
      // 湯に浸かった端は濡れる
      const lv = G.water ? G.water.level : -1; for (let i = CW; i < n; i++) { const k = i * 3; if (p[k + 2] > -L.HZ && p[k + 1] < lv + 0.004) w[i] = Math.min(1, w[i] + a * 2); } }
  }
  duckOf(s) { let k = 0; for (const d of this.G.ducks) { if (d.mode === 'held' || d.z > -0.3) continue; if (s < k + 3) return d; k += 3; } return this.G.ducks[0]; }
  moving() { let m = 0; const p = this.p, q = this.q; for (let i = CW * 3; i < p.length; i += 9) m += Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]); return m > 0.002; }
  sync() { this.posAttr.array.set(this.p); this.posAttr.needsUpdate = true; this.wetAttr.array.set(this.wet); this.wetAttr.needsUpdate = true; this.geo.computeVertexNormals(); }
  wetMean() { let s = 0; for (let i = 0; i < this.n; i++) s += this.wet[i]; return s / this.n; }
}
export const CLOTH = { CW, CH };
