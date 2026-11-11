// 水: heightfieldの波、粗い流速場、水位と体積、泡粒子、しぶき
import * as THREE from 'three';
import { L, ground, insideDist } from './layout.js';
import { waterU } from './env.js';
import { makeRipple, makeBubbles } from './textures.js';
import { clamp, sat, rng, lerp } from './util.js';

const NX = 96, NZ = 60, GX = 48, GZ = 30;
const X0 = -L.HX, Z0 = -L.HZ, SX = L.HX * 2, SZ = L.HZ * 2;
const DX = SX / (NX - 1), DZ = SZ / (NZ - 1), FDX = SX / GX, FDZ = SZ / GZ;
export const CELL_AREA = DX * DZ;
const Q_IN = 0.0042, K_OVER = 0.8;

export class Water {
  constructor(scene, opts) {
    this.low = !!opts.low; this.rand = rng(1234);
    this.h = new Float32Array(NX * NZ); this.v = new Float32Array(NX * NZ); this.mask = new Uint8Array(NX * NZ); this.c2 = new Float32Array(NX * NZ); this.calm = new Float32Array(NX * NZ);
    this.g = new Float32Array(NX * NZ); this.inside = new Uint8Array(NX * NZ);
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { const x = X0 + i * DX, z = Z0 + j * DZ; this.g[j * NX + i] = ground(x, z); this.inside[j * NX + i] = insideDist(x, z) > 0.001 ? 1 : 0; }
    // 体積表(水位→体積)
    this.tabL0 = L.DEEP; this.tabStep = 0.0005; this.tab = new Float32Array(Math.ceil((0.03 - L.DEEP) / this.tabStep) + 1);
    for (let k = 0; k < this.tab.length; k++) { const lv = this.tabL0 + k * this.tabStep; let s = 0; for (let i = 0; i < this.g.length; i++) if (this.inside[i] && lv > this.g[i]) s += lv - this.g[i]; this.tab[k] = s * CELL_AREA; }
    this.vol = this.volAt(L.STEP + 0.034); this.disp = 0; this.level = this.levelAt(this.vol); this.maskLevel = 99;
    this.faucet = 0; this.drain = 0; this.drainQ = 0; this.overQ = 0; this.gamma = 0; this.spill = 0; this.spillPeak = 0; this.energy = 0;
    this.obst = []; // 波と流れを遮る物(親)
    // 流速場
    this.u = new Float32Array(GX * GZ); this.w = new Float32Array(GX * GZ); this.u2 = new Float32Array(GX * GZ); this.w2 = new Float32Array(GX * GZ);
    this.p = new Float32Array(GX * GZ); this.div = new Float32Array(GX * GZ); this.solid = new Uint8Array(GX * GZ); this.fg = new Float32Array(GX * GZ); this.dens = new Float32Array(GX * GZ);
    for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) this.fg[j * GX + i] = ground(X0 + (i + 0.5) * FDX, Z0 + (j + 0.5) * FDZ);
    this.flowAcc = 0;
    // 泡
    this.FCAP = this.low ? 230 : 420; this.fx = new Float32Array(this.FCAP); this.fz = new Float32Array(this.FCAP); this.fvx = new Float32Array(this.FCAP); this.fvz = new Float32Array(this.FCAP);
    this.fs = new Float32Array(this.FCAP); this.fage = new Float32Array(this.FCAP); this.flife = new Float32Array(this.FCAP); this.fseed = new Float32Array(this.FCAP); this.ftmp = new Uint8Array(this.FCAP); this.fn = 0;
    this.sucked = 0;
    this.buildMeshes(scene);
    this.rimFilm = new Float32Array(this.rimN);
  }
  volAt(lv) { const f = clamp((lv - this.tabL0) / this.tabStep, 0, this.tab.length - 1.001); const k = Math.floor(f); return lerp(this.tab[k], this.tab[k + 1], f - k); }
  levelAt(vol) { let lo = 0, hi = this.tab.length - 1; if (vol <= 0) return this.tabL0; if (vol >= this.tab[hi]) return this.tabL0 + hi * this.tabStep; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (this.tab[m] > vol) hi = m; else lo = m; } const t = (vol - this.tab[lo]) / Math.max(1e-9, this.tab[hi] - this.tab[lo]); return this.tabL0 + (lo + t) * this.tabStep; }

  buildMeshes(scene) {
    const geo = new THREE.PlaneGeometry(SX, SZ, NX - 1, NZ - 1); geo.rotateX(-Math.PI / 2);
    this.geo = geo; this.pos = geo.attributes.position; this.nrm = geo.attributes.normal; this.pos.setUsage(THREE.DynamicDrawUsage); this.nrm.setUsage(THREE.DynamicDrawUsage);
    const ripple = makeRipple(3, 256); ripple.repeat.set(5, 3); this.ripple = ripple;
    this.matFull = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, roughness: 0.03, ior: 1.33, thickness: 0.09, attenuationColor: new THREE.Color(0.62, 0.88, 0.86), attenuationDistance: 0.42, normalMap: ripple, normalScale: new THREE.Vector2(0.1, 0.1), envMapIntensity: 1.5, specularIntensity: 1 });
    this.matLow = new THREE.MeshStandardMaterial({ color: 0xd3ecea, transparent: true, opacity: 0.42, roughness: 0.04, metalness: 0, normalMap: ripple, normalScale: new THREE.Vector2(0.05, 0.05), envMapIntensity: 1.6, depthWrite: false });
    this.mesh = new THREE.Mesh(geo, this.low ? this.matLow : this.matFull); this.mesh.renderOrder = 2; this.mesh.frustumCulled = false; scene.add(this.mesh);
    // 波/泡の影テクスチャ
    this.waveData = new Uint8Array(NX * NZ * 4); this.waveTex = new THREE.DataTexture(this.waveData, NX, NZ, THREE.RGBAFormat); this.waveTex.magFilter = THREE.LinearFilter; this.waveTex.minFilter = THREE.LinearFilter; this.waveTex.needsUpdate = true; waterU.uWaveTex.value = this.waveTex;
    // 泡の塊
    // 泡の塊: 大小の気泡が寄り集まった形
    const parts = [[0, 0, 0, 1, 1], [0.62, 0.16, 0.2, 0.56, 0], [-0.5, 0.2, 0.42, 0.6, 0], [0.1, 0.2, -0.64, 0.58, 0], [-0.38, 0.24, -0.46, 0.5, 0], [0.46, 0.3, -0.36, 0.44, 0], [0.04, 0.6, 0.08, 0.5, 0], [-0.62, 0.1, -0.04, 0.46, 0], [0.3, 0.12, 0.66, 0.48, 0], [-0.1, 0.42, 0.5, 0.36, 0], [0.5, 0.48, 0.1, 0.33, 0]];
    const P = [], NR = [], UV = [], I = []; let base = 0;
    for (const pt of parts.slice(0, this.low ? 7 : 11)) { const g0 = new THREE.IcosahedronGeometry(1, pt[4] ? 2 : 1); const gi = g0.index ? g0 : (() => { g0.setIndex([...Array(g0.attributes.position.count).keys()]); return g0; })(); const pp = gi.attributes.position, uu = gi.attributes.uv;
      for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i); P.push(pt[0] + x * pt[3], pt[1] + y * pt[3], pt[2] + z * pt[3]); NR.push(x, y, z); UV.push(uu.getX(i) * pt[3] + pt[0], uu.getY(i) * pt[3] + pt[2]); }
      const ix = gi.index.array; for (let i = 0; i < ix.length; i++) I.push(ix[i] + base); base += pp.count; g0.dispose(); }
    const ig = new THREE.BufferGeometry(); ig.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); ig.setAttribute('normal', new THREE.Float32BufferAttribute(NR, 3)); ig.setAttribute("uv", new THREE.Float32BufferAttribute(UV, 2)); ig.setIndex(I);
    const bub = makeBubbles(5, 256); bub.repeat.set(2.2, 2.2);
    this.foamMat = new THREE.MeshStandardMaterial({ color: 0xf3f6f7, roughness: 0.36, normalMap: bub, normalScale: new THREE.Vector2(0.7, 0.7), emissive: 0xeef4f6, emissiveIntensity: 0.1, envMapIntensity: 1.15 });
    this.foamGeo = ig; this.bubTex = bub;
    this.foamMesh = new THREE.InstancedMesh(ig, this.foamMat, this.FCAP); this.foamMesh.frustumCulled = false; this.foamMesh.castShadow = false; this.foamMesh.count = 0; scene.add(this.foamMesh);
    // 縁に乗る水の膜
    const N = 96; this.rimN = N; const pos = [], idx = []; const col = new Float32Array(N * 3 * 4);
    const pt = (s, d) => { // 周長パラメータ→縁の上の点
      const r = L.CORNER, hx = L.HX, hz = L.HZ; const per = 2 * (2 * (hx - r) + 2 * (hz - r)) + 2 * Math.PI * r; let t = s * per; let x, z, nx, nz;
      const segs = [[2 * (hx - r), 0], [Math.PI * r / 2, 1], [2 * (hz - r), 0], [Math.PI * r / 2, 1], [2 * (hx - r), 0], [Math.PI * r / 2, 1], [2 * (hz - r), 0], [Math.PI * r / 2, 1]];
      let k = 0; while (k < 7 && t > segs[k][0]) { t -= segs[k][0]; k++; } const f = t / segs[k][0];
      const cxs = [0, hx - r, 0, hx - r, 0, -(hx - r), 0, -(hx - r)], czs = [0, -(hz - r), 0, hz - r, 0, hz - r, 0, -(hz - r)];
      if (k === 0) { x = -(hx - r) + f * 2 * (hx - r); z = -hz; nx = 0; nz = -1; } else if (k === 2) { x = hx; z = -(hz - r) + f * 2 * (hz - r); nx = 1; nz = 0; }
      else if (k === 4) { x = hx - r - f * 2 * (hx - r); z = hz; nx = 0; nz = 1; } else if (k === 6) { x = -hx; z = hz - r - f * 2 * (hz - r); nx = -1; nz = 0; }
      else { const a = [-Math.PI / 2, 0, Math.PI / 2, Math.PI][(k - 1) / 2] + f * Math.PI / 2; nx = Math.cos(a); nz = Math.sin(a); x = cxs[k] + nx * r; z = czs[k] + nz * r; }
      return [x + nx * d, L.RIM_RISE * Math.sin(clamp(d / L.RIM, 0, 1) * Math.PI / 2) + 0.0016, z + nz * d, x, z];
    };
    this.rimPts = [];
    for (let i = 0; i < N; i++) { const s = i / N; for (let k = 0; k < 3; k++) { const d = [-0.004, 0.045, 0.098][k]; const p = pt(s, d); pos.push(p[0], p[1] - (k === 0 ? 0.004 : 0), p[2]); if (k === 0) this.rimPts.push([p[3], p[4]]); } }
    for (let i = 0; i < N; i++) { const a = i * 3, b = ((i + 1) % N) * 3; idx.push(a, b, a + 1, b, b + 1, a + 1, a + 1, b + 1, a + 2, b + 1, b + 2, a + 2); }
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); rg.setAttribute('color', new THREE.BufferAttribute(col, 4)); rg.setIndex(idx); rg.computeVertexNormals();
    this.rimGeo = rg; this.rimMesh = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, vertexColors: true, roughness: 0.02, metalness: 0, envMapIntensity: 2.2, depthWrite: false })); this.rimMesh.renderOrder = 3; this.rimMesh.visible = false; scene.add(this.rimMesh);
    // 蛇口の水柱
    const sg = new THREE.CylinderGeometry(1, 0.8, 1, 14, 10, true); sg.translate(0, -0.5, 0);
    this.streamMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: this.low ? 0 : 1, transparent: this.low, opacity: this.low ? 0.5 : 1, roughness: 0.08, ior: 1.33, thickness: 0.02, normalMap: ripple.clone(), normalScale: new THREE.Vector2(0.5, 0.5), envMapIntensity: 1.6 });
    this.streamMat.normalMap.repeat.set(1, 3); this.streamMat.normalMap.needsUpdate = true;
    this.stream = new THREE.Mesh(sg, this.streamMat); this.stream.visible = false; this.stream.renderOrder = 4; scene.add(this.stream);
    // しぶき/シャワーの水滴
    this.DCAP = this.low ? 110 : 220; this.dp = new Float32Array(this.DCAP * 3); this.dv = new Float32Array(this.DCAP * 3); this.dl = new Float32Array(this.DCAP); this.ds = new Float32Array(this.DCAP); this.dn = 0;
    const dg = new THREE.SphereGeometry(1, 6, 5);
    this.dropMesh = new THREE.InstancedMesh(dg, new THREE.MeshStandardMaterial({ color: 0xf2fbff, roughness: 0.05, transparent: true, opacity: 0.62, envMapIntensity: 2.0, depthWrite: false }), this.DCAP); this.dropMesh.frustumCulled = false; this.dropMesh.count = 0; this.dropMesh.renderOrder = 5; scene.add(this.dropMesh);
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._s = new THREE.Vector3(); this._p = new THREE.Vector3(); this._up = new THREE.Vector3(0, 1, 0); this._d = new THREE.Vector3();
  }
  setLow(low) { if (low === this.low) return; this.low = low; this.mesh.material = low ? this.matLow : this.matFull; this.streamMat.transmission = low ? 0 : 1; this.streamMat.transparent = low; this.streamMat.opacity = low ? 0.5 : 1; this.streamMat.needsUpdate = true; }

  // ---- 取り出し ----
  cellOf(x, z) { const i = clamp(Math.round((x - X0) / DX), 0, NX - 1), j = clamp(Math.round((z - Z0) / DZ), 0, NZ - 1); return j * NX + i; }
  hAt(x, z) { const fx = clamp((x - X0) / DX, 0, NX - 1.001), fz = clamp((z - Z0) / DZ, 0, NZ - 1.001); const i = Math.floor(fx), j = Math.floor(fz); const a = fx - i, b = fz - j; const k = j * NX + i; const h = this.h; return (h[k] * (1 - a) + h[k + 1] * a) * (1 - b) + (h[k + NX] * (1 - a) + h[k + NX + 1] * a) * b; }
  slopeAt(x, z, out) { const e = DX * 1.5; out[0] = (this.hAt(x + e, z) - this.hAt(x - e, z)) / (2 * e); out[1] = (this.hAt(x, z + e) - this.hAt(x, z - e)) / (2 * e); return out; }
  surfaceAt(x, z) { return this.level + this.hAt(x, z); }
  depthAt(x, z) { return this.level + this.hAt(x, z) - ground(x, z); }
  flowAt(x, z, out) {
    const fx = clamp((x - X0) / FDX - 0.5, 0, GX - 1.001), fz = clamp((z - Z0) / FDZ - 0.5, 0, GZ - 1.001); const i = Math.floor(fx), j = Math.floor(fz); const a = fx - i, b = fz - j; const k = j * GX + i;
    let ux = (this.u[k] * (1 - a) + this.u[k + 1] * a) * (1 - b) + (this.u[k + GX] * (1 - a) + this.u[k + GX + 1] * a) * b;
    let wz = (this.w[k] * (1 - a) + this.w[k + 1] * a) * (1 - b) + (this.w[k + GX] * (1 - a) + this.w[k + GX + 1] * a) * b;
    if (this.drainQ > 1e-6 || Math.abs(this.gamma) > 1e-4) { // 排水口への吸い込みと渦
      const dx = x - L.DRAIN.x, dz = z - L.DRAIN.z; const r = Math.max(0.035, Math.sqrt(dx * dx + dz * dz)); const dep = Math.max(0.05, this.level - L.DEEP);
      const vr = Math.min(0.5, 2.6 * this.drainQ / (6.283 * r * dep)); const vt = clamp(this.gamma / (6.283 * r), -0.45, 0.45) * sat(this.drainQ / 0.003) * Math.exp(-Math.max(0, r - 0.12) / 0.2); // 渦は排水口の近くだけ
      ux += (-dx * vr - dz * vt) / r; wz += (-dz * vr + dx * vt) / r;
    }
    out[0] = ux; out[1] = wz; return out;
  }

  // ---- 働きかけ ----
  impulse(x, z, amp, rad) { // 水面を押し下げ/持ち上げる
    const ri = Math.ceil(rad / DX); const ci = Math.round((x - X0) / DX), cj = Math.round((z - Z0) / DZ); let wsum = 0;
    for (let j = cj - ri; j <= cj + ri; j++) { if (j < 0 || j >= NZ) continue; for (let i = ci - ri; i <= ci + ri; i++) { if (i < 0 || i >= NX) continue; const k = j * NX + i; if (this.mask[k]) continue; const dx = (i - ci) * DX, dz = (j - cj) * DZ; const d2 = (dx * dx + dz * dz) / (rad * rad); if (d2 < 1) { const wgt = (1 - d2) * (1 - d2); this.v[k] += amp * wgt; wsum += wgt; } } }
    this.energy += Math.abs(amp) * 0.02;
  }
  dipole(x, z, dx, dz, amp, rad) { const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l; this.impulse(x + dx * rad * 0.6, z + dz * rad * 0.6, amp, rad); this.impulse(x - dx * rad * 0.6, z - dz * rad * 0.6, -amp, rad); }
  push(x, z, vx, vz, rad, gain) { // 流れを足す
    const ri = Math.ceil(rad / FDX); const ci = Math.floor((x - X0) / FDX), cj = Math.floor((z - Z0) / FDZ);
    for (let j = cj - ri; j <= cj + ri; j++) { if (j < 0 || j >= GZ) continue; for (let i = ci - ri; i <= ci + ri; i++) { if (i < 0 || i >= GX) continue; const k = j * GX + i; if (this.solid[k]) continue; const ddx = (i + 0.5) * FDX + X0 - x, ddz = (j + 0.5) * FDZ + Z0 - z; const d2 = (ddx * ddx + ddz * ddz) / (rad * rad); if (d2 < 1) { const wgt = (1 - d2) * gain; this.u[k] += (vx - this.u[k]) * wgt; this.w[k] += (vz - this.w[k]) * wgt; } } }
  }
  addFoam(x, z, size, life, tmp, vx = 0, vz = 0) {
    if (this.fn >= this.FCAP) { // 一時的な気泡を優先的に入れ替える
      let rep = -1; for (let t = 0; t < 8; t++) { const k = (this.rand() * this.fn) | 0; if (this.ftmp[k]) { rep = k; break; } } if (rep < 0) { if (tmp) return -1; rep = (this.rand() * this.fn) | 0; }
      this.setFoam(rep, x, z, size, life, tmp, vx, vz); return rep;
    }
    this.setFoam(this.fn, x, z, size, life, tmp, vx, vz); return this.fn++;
  }
  setFoam(k, x, z, size, life, tmp, vx, vz) { this.fx[k] = x; this.fz[k] = z; this.fvx[k] = vx; this.fvz[k] = vz; this.fs[k] = size; this.fage[k] = 0; this.flife[k] = life; this.ftmp[k] = tmp ? 1 : 0; this.fseed[k] = this.rand(); }
  killFoam(k) { const n = --this.fn; if (k !== n) { this.fx[k] = this.fx[n]; this.fz[k] = this.fz[n]; this.fvx[k] = this.fvx[n]; this.fvz[k] = this.fvz[n]; this.fs[k] = this.fs[n]; this.fage[k] = this.fage[n]; this.flife[k] = this.flife[n]; this.ftmp[k] = this.ftmp[n]; this.fseed[k] = this.fseed[n]; } }
  longFoam() { let c = 0; for (let k = 0; k < this.fn; k++) if (!this.ftmp[k]) c++; return c; }
  // 範囲内の泡を最大n個取り除き、取れた数を返す
  takeFoam(x, z, rad, n) { let got = 0; for (let k = this.fn - 1; k >= 0 && got < n; k--) { if (this.ftmp[k]) continue; const dx = this.fx[k] - x, dz = this.fz[k] - z; if (dx * dx + dz * dz < rad * rad) { this.killFoam(k); got++; } } return got; }
  foamNear(x, z, rad) { let c = 0; for (let k = 0; k < this.fn; k++) { if (this.ftmp[k]) continue; const dx = this.fx[k] - x, dz = this.fz[k] - z; if (dx * dx + dz * dz < rad * rad) c++; } return c; }
  drop(x, y, z, vx, vy, vz, size, life) { if (this.dn >= this.DCAP) return; const k = this.dn++; this.dp[k * 3] = x; this.dp[k * 3 + 1] = y; this.dp[k * 3 + 2] = z; this.dv[k * 3] = vx; this.dv[k * 3 + 1] = vy; this.dv[k * 3 + 2] = vz; this.ds[k] = size; this.dl[k] = life; }
  splash(x, z, power) { // 着水のしぶき
    const y = this.surfaceAt(x, z); const n = Math.round((this.low ? 5 : 9) * power);
    for (let i = 0; i < n; i++) { const a = this.rand() * 6.283, s = (0.25 + this.rand() * 0.55) * Math.sqrt(power); this.drop(x + Math.cos(a) * 0.03, y + 0.005, z + Math.sin(a) * 0.03, Math.cos(a) * s * 0.6, 0.6 + this.rand() * 1.1 * Math.sqrt(power), Math.sin(a) * s * 0.6, 0.004 + this.rand() * 0.004, 0.7); }
  }

  // ---- 更新 ----
  rebuildMask() {
    const lv = this.level; const ob = this.obst;
    for (let j = 0; j < NZ; j++) { const z = Z0 + j * DZ; for (let i = 0; i < NX; i++) { const k = j * NX + i; let m = 0; const dep = lv - this.g[k];
      let calm = 0; if (!this.inside[k] || dep < 0.004) m = 1; else { for (let o = 0; o < ob.length; o++) { const b = ob[o]; const dx = X0 + i * DX - b.x, dz = z - b.z; const lx = dx * b.c + dz * b.s, lz = -dx * b.s + dz * b.c; const e = (lx * lx) / (b.a * b.a) + (lz * lz) / (b.b * b.b); if (e < 1) { m = 1; break; } if (e < 4.4) calm = Math.max(calm, 1 - (e - 1) / 3.4); } }
      this.calm[k] = calm; // 親の体のまわりは波が静まる
      this.mask[k] = m; const c = 0.62 * Math.sqrt(clamp(dep / 0.16, 0.12, 1)); this.c2[k] = (c * c) / (DX * DX); } }
    for (let j = 0; j < GZ; j++) { const z = Z0 + (j + 0.5) * FDZ; for (let i = 0; i < GX; i++) { const k = j * GX + i; const x = X0 + (i + 0.5) * FDX; let s = 0; if (insideDist(x, z) < 0.006 || lv - this.fg[k] < 0.008) s = 1; else { for (let o = 0; o < ob.length; o++) { const b = ob[o]; const dx = x - b.x, dz = z - b.z; const lx = dx * b.c + dz * b.s, lz = -dx * b.s + dz * b.c; if ((lx * lx) / (b.a * b.a) + (lz * lz) / (b.b * b.b) < 1) { s = 1; break; } } } this.solid[k] = s; if (s) { this.u[k] = 0; this.w[k] = 0; } } }
  }
  isSolid(x, z) { const i = Math.floor((x - X0) / FDX), j = Math.floor((z - Z0) / FDZ); if (i < 0 || i >= GX || j < 0 || j >= GZ) return true; return this.solid[j * GX + i] === 1; }

  stepWaves(dt) {
    const h = this.h, v = this.v, m = this.mask, c2 = this.c2, calm = this.calm; const dmp = Math.exp(-1.05 * dt);
    for (let j = 0; j < NZ; j++) { const row = j * NX; for (let i = 0; i < NX; i++) { const k = row + i; if (m[k]) { v[k] = 0; h[k] *= 0.9; continue; } const hc = h[k];
      const l = i > 0 && !m[k - 1] ? h[k - 1] : hc, r = i < NX - 1 && !m[k + 1] ? h[k + 1] : hc, u = j > 0 && !m[k - NX] ? h[k - NX] : hc, d = j < NZ - 1 && !m[k + NX] ? h[k + NX] : hc;
      v[k] = (v[k] + c2[k] * (l + r + u + d - 4 * hc) * dt) * dmp * (1 - Math.min(0.5, calm[k] * dt * 9)); } }
    let sum = 0, cnt = 0, en = 0; for (let k = 0; k < h.length; k++) { if (m[k]) continue; let nh = h[k] + v[k] * dt; if (nh > 0.05) nh = 0.05; else if (nh < -0.05) nh = -0.05; h[k] = nh; sum += nh; cnt++; en += v[k] * v[k]; }
    if (cnt) { const mean = sum / cnt * 0.2; for (let k = 0; k < h.length; k++) if (!m[k]) h[k] -= mean; this.waveEnergy = en / cnt; }
  }

  stepFlow(dt) {
    const u = this.u, w = this.w, u2 = this.u2, w2 = this.w2, s = this.solid; const dmp = Math.exp(-0.24 * dt);
    // 自己移流
    for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) { const k = j * GX + i; if (s[k]) { u2[k] = 0; w2[k] = 0; continue; }
      const fx = clamp(i - u[k] * dt / FDX, 0, GX - 1.001), fz = clamp(j - w[k] * dt / FDZ, 0, GZ - 1.001); const i0 = Math.floor(fx), j0 = Math.floor(fz), a = fx - i0, b = fz - j0, q = j0 * GX + i0;
      u2[k] = ((u[q] * (1 - a) + u[q + 1] * a) * (1 - b) + (u[q + GX] * (1 - a) + u[q + GX + 1] * a) * b) * dmp; w2[k] = ((w[q] * (1 - a) + w[q + 1] * a) * (1 - b) + (w[q + GX] * (1 - a) + w[q + GX + 1] * a) * b) * dmp; }
    // 波の勾配が流れを押す
    for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) { const k = j * GX + i; if (s[k]) continue; const wi = clamp(Math.round((i + 0.5) * FDX / DX), 1, NX - 2), wj = clamp(Math.round((j + 0.5) * FDZ / DZ), 1, NZ - 2), q = wj * NX + wi;
      u2[k] -= (this.h[q + 1] - this.h[q - 1]) / (2 * DX) * 0.6 * dt; w2[k] -= (this.h[q + NX] - this.h[q - NX]) / (2 * DZ) * 0.6 * dt; }
    // 非圧縮化(壁と親を避けて回り込む)
    const p = this.p, div = this.div;
    for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) { const k = j * GX + i; if (s[k]) { div[k] = 0; p[k] = 0; continue; }
      const ur = i < GX - 1 && !s[k + 1] ? u2[k + 1] : -u2[k], ul = i > 0 && !s[k - 1] ? u2[k - 1] : -u2[k], wd = j < GZ - 1 && !s[k + GX] ? w2[k + GX] : -w2[k], wu = j > 0 && !s[k - GX] ? w2[k - GX] : -w2[k];
      div[k] = 0.5 * (ur - ul + wd - wu); p[k] *= 0.6; }
    for (let it = 0; it < 14; it++) for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) { const k = j * GX + i; if (s[k]) continue; const pc = p[k];
      const pr = i < GX - 1 && !s[k + 1] ? p[k + 1] : pc, pl = i > 0 && !s[k - 1] ? p[k - 1] : pc, pd = j < GZ - 1 && !s[k + GX] ? p[k + GX] : pc, pu = j > 0 && !s[k - GX] ? p[k - GX] : pc; p[k] = (pr + pl + pd + pu - div[k]) * 0.25; }
    let circ = 0, cn = 0;
    for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) { const k = j * GX + i; if (s[k]) { u[k] = 0; w[k] = 0; continue; } const pc = p[k];
      const pr = i < GX - 1 && !s[k + 1] ? p[k + 1] : pc, pl = i > 0 && !s[k - 1] ? p[k - 1] : pc, pd = j < GZ - 1 && !s[k + GX] ? p[k + GX] : pc, pu = j > 0 && !s[k - GX] ? p[k - GX] : pc;
      let nu = u2[k] - 0.5 * (pr - pl), nw = w2[k] - 0.5 * (pd - pu);
      if ((i === GX - 1 || s[k + 1]) && nu > 0) nu = 0; if ((i === 0 || s[k - 1]) && nu < 0) nu = 0; if ((j === GZ - 1 || s[k + GX]) && nw > 0) nw = 0; if ((j === 0 || s[k - GX]) && nw < 0) nw = 0;
      const sp = nu * nu + nw * nw; if (sp > 0.49) { const f = 0.7 / Math.sqrt(sp); nu *= f; nw *= f; } u[k] = nu; w[k] = nw;
      const dx = (i + 0.5) * FDX + X0 - L.DRAIN.x, dz = (j + 0.5) * FDZ + Z0 - L.DRAIN.z; const r2 = dx * dx + dz * dz; if (r2 > 0.004 && r2 < 0.05) { const r = Math.sqrt(r2); circ += (-dz * nu + dx * nw) / r * r; cn++; } }
    const gTarget = cn ? (circ / cn) * 6.283 * 2.2 : 0; this.gamma += (gTarget - this.gamma) * Math.min(1, dt * 2.5);
  }

  stepFoam(dt, agitate) {
    const f = [0, 0], sl = [0, 0]; const dens = this.dens; dens.fill(0);
    for (let k = 0; k < this.fn; k++) { const i = clamp(Math.floor((this.fx[k] - X0) / FDX), 0, GX - 1), j = clamp(Math.floor((this.fz[k] - Z0) / FDZ), 0, GZ - 1); dens[j * GX + i] += 1; }
    const draining = this.drainQ > 1e-5; const longN = this.longFoam(); this.spawnBudget = Math.min(3, (this.spawnBudget || 0) + dt * 3.5);
    for (let k = this.fn - 1; k >= 0; k--) {
      let x = this.fx[k], z = this.fz[k]; this.fage[k] += dt * (longN > this.FCAP * 0.8 && !this.ftmp[k] ? 2.5 : 1);
      if (this.fage[k] > this.flife[k]) { this.killFoam(k); continue; }
      const dep = this.level - ground(x, z);
      if (dep < 0.004) { this.fvx[k] = 0; this.fvz[k] = 0; continue; } // 水が引いたら底に残る
      this.flowAt(x, z, f); this.slopeAt(x, z, sl);
      const i = clamp(Math.floor((x - X0) / FDX), 1, GX - 2), j = clamp(Math.floor((z - Z0) / FDZ), 1, GZ - 2), c = j * GX + i;
      // 混みすぎた所から押し出す
      const cap = 2.2; let rx = 0, rz = 0; if (dens[c] > cap) { rx = (dens[c - 1] - dens[c + 1]) * 0.012 + (this.fseed[k] - 0.5) * 0.02; rz = (dens[c - GX] - dens[c + GX]) * 0.012 + ((this.fseed[k] * 7.3) % 1 - 0.5) * 0.02; }
      const tvx = f[0] - sl[0] * 0.55 + rx, tvz = f[1] - sl[1] * 0.55 + rz; const kk = Math.min(1, dt * 7);
      this.fvx[k] += (tvx - this.fvx[k]) * kk; this.fvz[k] += (tvz - this.fvz[k]) * kk;
      let nx = x + this.fvx[k] * dt, nz = z + this.fvz[k] * dt;
      if (this.isSolid(nx, nz) || this.level - ground(nx, nz) < 0.004) { if (!this.isSolid(nx, z) && this.level - ground(nx, z) >= 0.004) { nz = z; this.fvz[k] *= -0.2; } else if (!this.isSolid(x, nz) && this.level - ground(x, nz) >= 0.004) { nx = x; this.fvx[k] *= -0.2; } else { nx = x; nz = z; this.fvx[k] *= -0.3; this.fvz[k] *= -0.3; if (this.isSolid(x, z)) { // 親の下に入ったら外へ逃がす
          for (const b of this.obst) { const dx = x - b.x, dz = z - b.z; const l = Math.hypot(dx, dz) || 1; nx = x + dx / l * 0.012; nz = z + dz / l * 0.012; } } } }
      this.fx[k] = nx; this.fz[k] = nz;
      if (draining) { const dx = nx - L.DRAIN.x, dz = nz - L.DRAIN.z; if (dx * dx + dz * dz < 0.0018) { this.killFoam(k); this.sucked++; continue; } }
      // かき混ぜると泡が増える
      if (!this.ftmp[k] && agitate && longN < this.FCAP * 0.8) { const sp = Math.hypot(this.fvx[k], this.fvz[k]) + Math.abs(this.v[this.cellOf(nx, nz)]) * 0.5; if (sp > 0.11 && this.spawnBudget > 0 && this.rand() < dt * sat((sp - 0.11) / 0.3) * 0.9) { this.spawnBudget -= 1; const a = this.rand() * 6.283; this.addFoam(nx + Math.cos(a) * 0.02, nz + Math.sin(a) * 0.02, 0.013 + this.rand() * 0.013, 70 + this.rand() * 90, false, this.fvx[k], this.fvz[k]); this.made = (this.made || 0) + 1; } }
    }
  }

  update(dt, time) {
    // 体積の出入り
    const dvIn = this.faucet * Q_IN; this.vol += dvIn * dt;
    const depD = this.level - L.DEEP; this.drainQ = this.drain > 0.01 ? this.drain * (0.0052 + 0.0026 * Math.sqrt(sat(depD / 0.3))) * sat(depD / 0.012) : 0; this.vol -= this.drainQ * dt;
    const tgt0 = this.levelAt(this.vol + this.disp);
    this.overQ = tgt0 > L.OVER_Y ? Math.min(K_OVER * (tgt0 - L.OVER_Y), 0.0047) : 0; this.vol -= this.overQ * dt; if (this.vol < 0) this.vol = 0;
    const tgt = Math.min(0.006, this.levelAt(this.vol + this.disp)); this.level += (tgt - this.level) * (1 - Math.exp(-9 * dt));
    waterU.uLevel.value = this.level;
    this.rebuildMask();
    // 蛇口の落水
    const S = L.STREAM; const sy = this.surfaceAt(S.x, S.z); const gy = ground(S.x, S.z); this.streamHitY = Math.max(sy, gy);
    if (this.faucet > 0.01) { const fl = this.faucet; const wet = this.level - gy > 0.004;
      if (wet) { this.impulse(S.x + (this.rand() - 0.5) * 0.03, S.z + (this.rand() - 0.5) * 0.03, (this.rand() - 0.56) * 3.4 * fl, 0.028 + 0.016 * fl);
        const a = this.rand() * 6.283; this.push(S.x + Math.cos(a) * 0.045, S.z + Math.sin(a) * 0.045, Math.cos(a) * 0.24 * fl, Math.sin(a) * 0.24 * fl, 0.06, 0.3);
        if (this.rand() < dt * 26 * fl) { const b = this.rand() * 6.283, rr = 0.015 + this.rand() * 0.035; const soap = this.foamNear(S.x, S.z, 0.22) > 3; const keep = this.rand() < (soap ? 0.07 : 0.025) && this.longFoam() < this.FCAP * 0.45;
          this.addFoam(S.x + Math.cos(b) * rr, S.z + Math.sin(b) * rr, keep ? 0.014 + this.rand() * 0.012 : 0.007 + this.rand() * 0.009, keep ? 60 + this.rand() * 80 : 0.8 + this.rand() * 2.2, !keep, Math.cos(b) * 0.1, Math.sin(b) * 0.1); } }
      if (this.rand() < dt * 30 * fl) { const a2 = this.rand() * 6.283; this.drop(S.x, this.streamHitY + 0.004, S.z, Math.cos(a2) * (0.15 + this.rand() * 0.3), 0.4 + this.rand() * 0.7 * fl, Math.sin(a2) * (0.15 + this.rand() * 0.3), 0.003 + this.rand() * 0.003, 0.5); }
    }
    // 排水口のくぼみ
    if (this.drainQ > 1e-5 && depD > 0.01) this.impulse(L.DRAIN.x, L.DRAIN.z, -sat(this.drainQ / 0.008) * (0.4 + 0.8 * sat(0.12 / depD)) * (1 + Math.min(2, Math.abs(this.gamma) * 4)), 0.04);
    this.stepWaves(dt * 0.5); this.stepWaves(dt * 0.5);
    this.flowAcc += dt; if (this.flowAcc >= 1 / 30) { this.stepFlow(Math.min(this.flowAcc, 0.05)); this.flowAcc = 0; }
    this.stepFoam(dt, true);
    this.updateRim(dt); this.updateDrops(dt);
  }

  updateRim(dt) {
    let any = 0, peak = 0;
    for (let i = 0; i < this.rimN; i++) { const p = this.rimPts[i]; const cx = clamp(p[0], X0 + DX * 2, -X0 - DX * 2), cz = clamp(p[1], Z0 + DZ * 2, -Z0 - DZ * 2); const top = this.level + this.hAt(cx * 0.97, cz * 0.96) * 1.25;
      const want = sat((top - L.SPILL_Y) / 0.012); const cur = this.rimFilm[i]; this.rimFilm[i] = want > cur ? cur + (want - cur) * Math.min(1, dt * 14) : Math.max(want, cur - dt * 0.55); any = Math.max(any, this.rimFilm[i]); peak = Math.max(peak, want); }
    this.spill = any; this.spillPeak = peak;
    this.rimMesh.visible = any > 0.01;
    if (this.rimMesh.visible) { const c = this.rimGeo.attributes.color; const N = this.rimN; for (let i = 0; i < N; i++) { const a = (this.rimFilm[(i + N - 1) % N] + this.rimFilm[i] * 2 + this.rimFilm[(i + 1) % N]) * 0.25; c.setXYZW(i * 3, 1, 1, 1, Math.min(0.5, a * 0.75)); c.setXYZW(i * 3 + 1, 1, 1, 1, Math.min(0.42, a * 0.6) * sat(a * 2.2)); c.setXYZW(i * 3 + 2, 1, 1, 1, 0); } c.needsUpdate = true; }
  }

  updateDrops(dt) {
    for (let k = this.dn - 1; k >= 0; k--) { const o = k * 3; this.dl[k] -= dt; this.dv[o + 1] -= 9.8 * dt; this.dp[o] += this.dv[o] * dt; this.dp[o + 1] += this.dv[o + 1] * dt; this.dp[o + 2] += this.dv[o + 2] * dt;
      let dead = this.dl[k] <= 0; const x = this.dp[o], z = this.dp[o + 2];
      if (!dead && this.dv[o + 1] < 0) { if (insideDist(x, z) > 0) { const sy = Math.max(this.level + this.hAt(x, z), ground(x, z)); if (this.dp[o + 1] < sy) { dead = true; if (this.level > ground(x, z) + 0.004) this.impulse(x, z, -0.25, 0.018); } } else if (this.dp[o + 1] < 0.005) dead = true; }
      if (dead) { const n = --this.dn; if (k !== n) { for (let q = 0; q < 3; q++) { this.dp[o + q] = this.dp[n * 3 + q]; this.dv[o + q] = this.dv[n * 3 + q]; } this.dl[k] = this.dl[n]; this.ds[k] = this.ds[n]; } } }
  }

  render(time, dt) {
    // 水面メッシュ
    const pos = this.pos.array, nrm = this.nrm.array, h = this.h, lv = Math.min(this.level, 0.004); const ex = 1.25;
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { const k = j * NX + i, o = k * 3; pos[o + 1] = Math.min(lv + h[k], 0.011);
      const hl = h[i > 0 ? k - 1 : k], hr = h[i < NX - 1 ? k + 1 : k], hu = h[j > 0 ? k - NX : k], hd = h[j < NZ - 1 ? k + NX : k]; const nx = -(hr - hl) / (2 * DX) * ex, nz = -(hd - hu) / (2 * DZ) * ex; const il = 1 / Math.sqrt(nx * nx + nz * nz + 1); nrm[o] = nx * il; nrm[o + 1] = il; nrm[o + 2] = nz * il;
      const lap = hl + hr + hu + hd - 4 * h[k]; const w4 = k * 4; this.waveData[w4] = clamp(128 - lap * 26000, 0, 255); this.waveData[w4 + 1] = 0; }
    this.pos.needsUpdate = true; this.nrm.needsUpdate = true;
    this.mesh.visible = this.level > L.DEEP + 0.003;
    this.ripple.offset.x = time * 0.011; this.ripple.offset.y = time * 0.007;
    // 泡
    const m = this._m, q = this._q, s = this._s, p = this._p; let n = 0; const wd = this.waveData;
    for (let k = 0; k < this.fn; k++) { const x = this.fx[k], z = this.fz[k]; const gy = ground(x, z); const sy = Math.max(this.level + this.hAt(x, z), gy); const grounded = this.level - gy < 0.004;
      const lifeT = this.fage[k] / this.flife[k]; const fade = sat(this.fage[k] * 6) * sat((1 - lifeT) * (this.ftmp[k] ? 4 : 14)); const sz = this.fs[k] * fade * (grounded ? 0.8 : 1); if (sz < 0.0015) continue;
      const sd = this.fseed[k]; p.set(x, sy + sz * (this.ftmp[k] ? 0.02 : 0.06), z); q.setFromAxisAngle(this._up, sd * 6.283); s.set(sz * (1.15 + sd * 0.3), sz * (0.4 + ((sd * 5.1) % 1) * 0.22), sz * (1.25 - sd * 0.2)); m.compose(p, q, s); this.foamMesh.setMatrixAt(n++, m);
      if (!this.ftmp[k]) { const ci = clamp(Math.round((x - X0) / DX), 1, NX - 2), cj = clamp(Math.round((z - Z0) / DZ), 1, NZ - 2); const c4 = (cj * NX + ci) * 4; const add = 90 * fade; wd[c4 + 1] = Math.min(255, wd[c4 + 1] + add); wd[c4 + 5] = Math.min(255, wd[c4 + 5] + add * 0.6); wd[c4 - 3] = Math.min(255, wd[c4 - 3] + add * 0.6); wd[c4 + NX * 4 + 1] = Math.min(255, wd[c4 + NX * 4 + 1] + add * 0.6); wd[c4 - NX * 4 + 1] = Math.min(255, wd[c4 - NX * 4 + 1] + add * 0.6); } }
    this.foamMesh.count = n; this.foamMesh.instanceMatrix.needsUpdate = true; this.waveTex.needsUpdate = true;
    // 水柱
    const fl = this.faucet; this.stream.visible = fl > 0.012;
    if (this.stream.visible) { const top = this.outletY, len = Math.max(0.01, top - this.streamHitY); const rr = 0.0045 + 0.0085 * Math.sqrt(fl); this.stream.position.set(L.STREAM.x, top, L.STREAM.z); this.stream.scale.set(rr, len, rr); this.streamMat.normalMap.offset.y = time * 2.6; this.streamMat.normalMap.offset.x = Math.sin(time * 7) * 0.03; }
    // 水滴
    n = 0; for (let k = 0; k < this.dn; k++) { const o = k * 3; this._d.set(this.dv[o], this.dv[o + 1], this.dv[o + 2]); const sp = this._d.length(); p.set(this.dp[o], this.dp[o + 1], this.dp[o + 2]); if (sp > 1e-4) q.setFromUnitVectors(this._up, this._d.multiplyScalar(1 / sp)); else q.identity(); const sz = this.ds[k]; s.set(sz, sz * (1 + Math.min(4, sp * 1.4)), sz); m.compose(p, q, s); this.dropMesh.setMatrixAt(n++, m); }
    this.dropMesh.count = n; this.dropMesh.instanceMatrix.needsUpdate = true;
  }

  seedFoam() { // 最初の少量の泡(奥の壁ぎわ)
    const r = rng(77); for (let i = 0; i < 42; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 0.085; this.addFoam(0.05 + Math.cos(a) * d * 1.35, -0.215 + Math.sin(a) * d * 0.6, 0.014 + r() * 0.014, 240 + r() * 300, false); }
  }
}
export const WGRID = { NX, NZ, X0, Z0, DX, DZ };
