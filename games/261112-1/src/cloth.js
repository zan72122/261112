// Cloth: few PBD particles on a (masked) grid + Catmull-Rom subdivided double-shell render mesh.
// Per-particle state that travels through all five scenes: position, wetness of each face, dirt.
import * as THREE from 'three';
import { clamp } from './util.js';

export function clothMaterial(map, normalMap, o = {}) {
  const m = new THREE.MeshStandardMaterial({
    map, normalMap, roughness: o.roughness ?? 0.92, metalness: 0,
    normalScale: new THREE.Vector2(o.ns ?? 0.8, o.ns ?? 0.8),
    alphaTest: o.alpha ? 0.5 : 0, side: THREE.FrontSide,
  });
  if (normalMap) { normalMap.repeat.set(o.nrep?.[0] ?? 8, o.nrep?.[1] ?? 8); }
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aWet;\nattribute float aDirt;\nvarying float vWet;\nvarying float vDirt;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWet = aWet; vDirt = aDirt;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vWet;\nvarying float vDirt;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float wv = clamp(vWet, 0.0, 1.0);
        float wedge = smoothstep(0.0, 0.25, wv);
        diffuseColor.rgb *= mix(vec3(1.0), vec3(0.52, 0.55, 0.60), wedge * (0.55 + 0.45 * wv));
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.60, 0.50, 0.38), clamp(vDirt, 0.0, 1.0) * 0.85);`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.36, wv * 0.9);');
  };
  m.customProgramCacheKey = () => 'clothwet';
  return m;
}

const CR = (f) => [(-0.5 * f + 1.0) * f * f - 0.5 * f, (1.5 * f - 2.5) * f * f + 1.0, (-1.5 * f + 2.0) * f * f + 0.5 * f, (0.5 * f - 0.5) * f * f];

export class Cloth {
  constructor(o) {
    Object.assign(this, { id: o.id, kind: o.kind, nx: o.nx, ny: o.ny, cell: o.cell, thick: o.thick, sub: o.sub, rad: o.rad ?? 0.018 });
    const n = this.n = o.nx * o.ny;
    this.active = new Uint8Array(n);
    for (let j = 0; j < o.ny; j++) for (let i = 0; i < o.nx; i++) this.active[j * o.nx + i] = o.mask ? (o.mask(i, j) ? 1 : 0) : 1;
    this.p = new Float32Array(n * 3); this.q = new Float32Array(n * 3); this.ext = new Float32Array(n * 3);
    this.nrm = new Float32Array(n * 3);
    this.kin = new Uint8Array(n);
    this.wetF = new Float32Array(n); this.wetB = new Float32Array(n); this.dirt = new Float32Array(n);
    this.shade = new Float32Array(n).fill(1);   // wind exposure (1 = full wind)
    this.covF = new Uint8Array(n); this.covB = new Uint8Array(n); // face covered by another layer
    this.bendK = o.bendK ?? 0.12; this.wetMean = 0;
    this.frame = null;            // THREE.Matrix4 or null (identity): sim-space -> world
    this.loc = 'basket';          // basket | drum | held | rod | flat | person
    this.sleep = 0; this.grab = -1;
    this._buildConstraints(); this._buildMesh(o);
  }
  idx(i, j) { return j * this.nx + i; }
  on(i, j) { return i >= 0 && j >= 0 && i < this.nx && j < this.ny && this.active[j * this.nx + i] === 1; }

  _buildConstraints() {
    const a = [], b = [], r = [], k = [];
    const add = (i0, j0, i1, j1, kk) => { if (this.on(i0, j0) && this.on(i1, j1)) { a.push(this.idx(i0, j0)); b.push(this.idx(i1, j1)); r.push(Math.hypot(i1 - i0, j1 - j0) * this.cell); k.push(kk); } };
    for (let j = 0; j < this.ny; j++) for (let i = 0; i < this.nx; i++) {
      add(i, j, i + 1, j, 1); add(i, j, i, j + 1, 1);
      add(i, j, i + 1, j + 1, 0.55); add(i + 1, j, i, j + 1, 0.55);
      add(i, j, i + 2, j, -1); add(i, j, i, j + 2, -1);       // bend (k filled from bendK)
    }
    this.ca = Int16Array.from(a); this.cb = Int16Array.from(b); this.cr = Float32Array.from(r); this.ck = Float32Array.from(k);
  }

  // ---- simulation ----
  integrate(h, gx, gy, gz, damp, vmax = 4) {
    const p = this.p, q = this.q, e = this.ext, h2 = h * h, lim = vmax * h;
    for (let k = 0; k < this.n; k++) {
      if (!this.active[k] || this.kin[k]) continue;
      const a = k * 3;
      let vx = (p[a] - q[a]) * damp + (gx + e[a]) * h2, vy = (p[a + 1] - q[a + 1]) * damp + (gy + e[a + 1]) * h2, vz = (p[a + 2] - q[a + 2]) * damp + (gz + e[a + 2]) * h2;
      const s = Math.hypot(vx, vy, vz); if (s > lim) { const f = lim / s; vx *= f; vy *= f; vz *= f; }
      q[a] = p[a]; q[a + 1] = p[a + 1]; q[a + 2] = p[a + 2];
      p[a] += vx; p[a + 1] += vy; p[a + 2] += vz;
    }
    e.fill(0);
  }
  solve() {
    const p = this.p, ca = this.ca, cb = this.cb, cr = this.cr, ck = this.ck, kin = this.kin;
    const stretch = 1 + 0.035 * this.wetMean, bend = this.bendK * (1 - 0.55 * clamp(this.wetMean, 0, 1));
    for (let c = 0; c < ca.length; c++) {
      const a = ca[c] * 3, b = cb[c] * 3;
      let dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2];
      const d = Math.hypot(dx, dy, dz); if (d < 1e-7) continue;
      let kk = ck[c], rest = cr[c] * stretch;
      if (kk < 0) { kk = bend; if (d > rest) continue; }  // bend rods only resist compression (folding)
      const wa = kin[ca[c]] ? 0 : 1, wb = kin[cb[c]] ? 0 : 1, ws = wa + wb; if (!ws) continue;
      const f = (d - rest) / d * kk / ws;
      dx *= f; dy *= f; dz *= f;
      if (wa) { p[a] += dx; p[a + 1] += dy; p[a + 2] += dz; }
      if (wb) { p[b] -= dx; p[b + 1] -= dy; p[b + 2] -= dz; }
    }
  }
  setPos(k, x, y, z, hard = true) { const a = k * 3; this.p[a] = x; this.p[a + 1] = y; this.p[a + 2] = z; if (hard) { this.q[a] = x; this.q[a + 1] = y; this.q[a + 2] = z; } }
  translate(dx, dy, dz) { const p = this.p, q = this.q; for (let a = 0; a < this.n * 3; a += 3) { p[a] += dx; q[a] += dx; p[a + 1] += dy; q[a + 1] += dy; p[a + 2] += dz; q[a + 2] += dz; } }
  stop() { this.q.set(this.p); }
  speed2() { let m = 0; const p = this.p, q = this.q; for (let a = 0; a < this.n * 3; a += 3) { if (!this.active[a / 3]) continue; const d = (p[a] - q[a]) ** 2 + (p[a + 1] - q[a + 1]) ** 2 + (p[a + 2] - q[a + 2]) ** 2; if (d > m) m = d; } return m; }
  center(out) { let x = 0, y = 0, z = 0, c = 0; for (let k = 0; k < this.n; k++) if (this.active[k]) { x += this.p[k * 3]; y += this.p[k * 3 + 1]; z += this.p[k * 3 + 2]; c++; } out.set(x / c, y / c, z / c); return out; }
  // apply rigid matrix to sim coordinates (frame changes)
  transform(m) { const e = m.elements, f = (arr) => { for (let a = 0; a < this.n * 3; a += 3) { const x = arr[a], y = arr[a + 1], z = arr[a + 2]; arr[a] = e[0] * x + e[4] * y + e[8] * z + e[12]; arr[a + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]; arr[a + 2] = e[2] * x + e[6] * y + e[10] * z + e[14]; } }; f(this.p); f(this.q); }
  updateWetMean() { let s = 0, c = 0; for (let k = 0; k < this.n; k++) if (this.active[k]) { s += this.wetF[k] + this.wetB[k]; c += 2; } this.wetMean = s / c; let d = 0; for (let k = 0; k < this.n; k++) if (this.active[k]) d += this.dirt[k]; this.dirtMean = d / (c / 2); return this.wetMean; }
  setWet(v) { this.wetF.fill(v); this.wetB.fill(v); this.wetMean = v; }

  computeNormals() {
    const p = this.p, nr = this.nrm, nx = this.nx;
    for (let j = 0; j < this.ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i; if (!this.active[k]) continue;
      const l = this.on(i - 1, j) ? k - 1 : k, r = this.on(i + 1, j) ? k + 1 : k, u = this.on(i, j - 1) ? k - nx : k, d = this.on(i, j + 1) ? k + nx : k;
      const ux = p[r * 3] - p[l * 3], uy = p[r * 3 + 1] - p[l * 3 + 1], uz = p[r * 3 + 2] - p[l * 3 + 2];
      const vx = p[d * 3] - p[u * 3], vy = p[d * 3 + 1] - p[u * 3 + 1], vz = p[d * 3 + 2] - p[u * 3 + 2];
      let x = vy * uz - vz * uy, y = vz * ux - vx * uz, z = vx * uy - vy * ux;
      const il = 1 / (Math.hypot(x, y, z) || 1);
      nr[k * 3] = x * il; nr[k * 3 + 1] = y * il; nr[k * 3 + 2] = z * il;
    }
  }

  // ---- flat / folded layout (table, drawer, hands) ----
  // folds: [{ax:0|1, c, side}] in cloth-local metres: x = i*cell, z = j*cell
  foldedXZ(k, out, upto = 1e9) {
    let x = (k % this.nx) * this.cell, z = ((k / this.nx) | 0) * this.cell, lay = 0, maxLay = 0;
    const F = this.flat.folds;
    for (let m = 0; m < F.length && m < upto; m++) {
      const f = F[m], co = f.ax ? z : x;
      if ((co - f.c) * f.side > 0) { if (f.ax) z = 2 * f.c - z; else x = 2 * f.c - x; lay = 2 * maxLay + 1 - lay; }
      maxLay = 2 * maxLay + 1;
    }
    out[0] = x; out[1] = z; out[2] = lay; return out;
  }
  flatPoint(k, out, upto) { this.foldedXZ(k, out, upto); if (this.flat.rot) { const x = out[0]; out[0] = out[1]; out[1] = -x; } return out; }
  flatBBox(upto) {
    const t = [0, 0, 0]; let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, ml = 0;
    for (let k = 0; k < this.n; k++) if (this.active[k]) { this.flatPoint(k, t, upto); if (t[0] < x0) x0 = t[0]; if (t[0] > x1) x1 = t[0]; if (t[1] < z0) z0 = t[1]; if (t[1] > z1) z1 = t[1]; if (t[2] > ml) ml = t[2]; }
    return { x0, x1, z0, z1, layers: ml + 1 };
  }
  // extent along a fold-space axis (0: i direction, 1: j direction)
  foldExtent(ax, upto) { const t = [0, 0, 0]; let lo = 1e9, hi = -1e9; for (let k = 0; k < this.n; k++) if (this.active[k]) { this.foldedXZ(k, t, upto); if (t[ax] < lo) lo = t[ax]; if (t[ax] > hi) hi = t[ax]; } return [lo, hi]; }
  // write particle positions for the flat layout: origin (flat.ox, flat.oz), bottom at flat.y
  layoutFlat(blend = 1, lift = 0, zoff = 0) {
    const t = [0, 0, 0], bb = this.flatBBox(), fl = this.flat, th = this.thick * 1.1;
    fl.bb = bb; fl.h = bb.layers * th;
    fl.wbb = { x0: fl.ox + bb.x0, x1: fl.ox + bb.x1, z0: fl.oz + zoff + bb.z0, z1: fl.oz + zoff + bb.z1 };
    const p = this.p;
    for (let k = 0; k < this.n; k++) {
      if (!this.active[k]) continue;
      this.flatPoint(k, t);
      const X = fl.ox + t[0], Y = fl.y + lift + th * (0.5 + t[2]) + (Math.sin(k * 1.31) + Math.sin(k * 0.37 + t[2])) * 0.0011, Z = fl.oz + zoff + t[1], a = k * 3;
      if (blend >= 1) { p[a] = X; p[a + 1] = Y; p[a + 2] = Z; }
      else { p[a] += (X - p[a]) * blend; p[a + 1] += (Y - p[a + 1]) * blend; p[a + 2] += (Z - p[a + 2]) * blend; }
    }
    this.q.set(p);
  }

  // ---- render mesh ----
  _buildMesh(o) {
    const s = this.sub, nx = this.nx, ny = this.ny, RX = (nx - 1) * s + 1, RY = (ny - 1) * s + 1;
    const cellOn = (i, j) => this.on(i, j) && this.on(i + 1, j) && this.on(i, j + 1) && this.on(i + 1, j + 1);
    const vid = new Int32Array(RX * RY).fill(-1);
    const wStart = [0], wIdx = [], wW = [], bIdx = [], bW = [], uv = [];
    let NV = 0;
    for (let rj = 0; rj < RY; rj++) for (let ri = 0; ri < RX; ri++) {
      const ci = [Math.min(Math.floor(ri / s), nx - 2)], cj = [Math.min(Math.floor(rj / s), ny - 2)];
      if (ri % s === 0 && ri / s - 1 >= 0) ci.push(ri / s - 1);
      if (rj % s === 0 && rj / s - 1 >= 0) cj.push(rj / s - 1);
      let i0 = -1, j0 = -1;
      for (const a of ci) for (const b of cj) if (i0 < 0 && cellOn(a, b)) { i0 = a; j0 = b; }
      if (i0 < 0) continue;
      const fu = ri / s - i0, fv = rj / s - j0, wu = CR(fu), wv = CR(fv);
      const acc = new Map();
      const put = (k, w) => acc.set(k, (acc.get(k) || 0) + w);
      for (let b = 0; b < 4; b++) for (let a = 0; a < 4; a++) {
        const w = wu[a] * wv[b]; if (w === 0) continue;
        const ti = i0 - 1 + a, tj = j0 - 1 + b;
        if (this.on(ti, tj)) { put(this.idx(ti, tj), w); continue; }
        const ac = clamp(ti, i0, i0 + 1), bc = clamp(tj, j0, j0 + 1);
        if (ti !== ac && this.on(ac, tj) && this.on(2 * ac - ti, tj)) { put(this.idx(ac, tj), 2 * w); put(this.idx(2 * ac - ti, tj), -w); }
        else if (tj !== bc && this.on(ti, bc) && this.on(ti, 2 * bc - tj)) { put(this.idx(ti, bc), 2 * w); put(this.idx(ti, 2 * bc - tj), -w); }
        else put(this.idx(ac, bc), w);
      }
      for (const [k, w] of acc) { wIdx.push(k); wW.push(w); }
      wStart.push(wIdx.length);
      bIdx.push(this.idx(i0, j0), this.idx(i0 + 1, j0), this.idx(i0, j0 + 1), this.idx(i0 + 1, j0 + 1));
      bW.push((1 - fu) * (1 - fv), fu * (1 - fv), (1 - fu) * fv, fu * fv);
      uv.push(ri / (RX - 1), 1 - rj / (RY - 1));
      vid[rj * RX + ri] = NV++;
    }
    this.NV = NV; this.wStart = Int32Array.from(wStart); this.wIdx = Int16Array.from(wIdx); this.wW = Float32Array.from(wW);
    this.bIdx = Int16Array.from(bIdx); this.bW = Float32Array.from(bW);
    // neighbours for normals
    const nb = new Int32Array(NV * 4);
    for (let rj = 0; rj < RY; rj++) for (let ri = 0; ri < RX; ri++) {
      const v = vid[rj * RX + ri]; if (v < 0) continue;
      const g = (a, b) => (a >= 0 && b >= 0 && a < RX && b < RY && vid[b * RX + a] >= 0) ? vid[b * RX + a] : v;
      nb[v * 4] = g(ri - 1, rj); nb[v * 4 + 1] = g(ri + 1, rj); nb[v * 4 + 2] = g(ri, rj - 1); nb[v * 4 + 3] = g(ri, rj + 1);
    }
    this.nb = nb;
    // indices
    const front = [], back = [], rim = [];
    const quad = (ri, rj) => { if (ri < 0 || rj < 0 || ri >= RX - 1 || rj >= RY - 1) return false; const A = vid[rj * RX + ri], B = vid[rj * RX + ri + 1], C = vid[(rj + 1) * RX + ri], D = vid[(rj + 1) * RX + ri + 1]; if (A < 0 || B < 0 || C < 0 || D < 0) return false; return cellOn(Math.floor(ri / s), Math.floor(rj / s)); };
    for (let rj = 0; rj < RY - 1; rj++) for (let ri = 0; ri < RX - 1; ri++) {
      if (!quad(ri, rj)) continue;
      const A = vid[rj * RX + ri], B = vid[rj * RX + ri + 1], C = vid[(rj + 1) * RX + ri], D = vid[(rj + 1) * RX + ri + 1];
      front.push(A, C, B, B, C, D); back.push(A + NV, B + NV, C + NV, B + NV, D + NV, C + NV);
      const edge = (a, b) => rim.push(a, b, a + NV, b, b + NV, a + NV);
      if (!quad(ri, rj - 1)) edge(B, A); if (!quad(ri, rj + 1)) edge(C, D); if (!quad(ri - 1, rj)) edge(A, C); if (!quad(ri + 1, rj)) edge(D, B);
    }
    const geo = new THREE.BufferGeometry();
    this.gp = new Float32Array(NV * 6); this.gn = new Float32Array(NV * 6);
    const guv = new Float32Array(NV * 4); guv.set(uv, 0); guv.set(uv, NV * 2);
    this.gw = new Float32Array(NV * 2); this.gd = new Float32Array(NV * 2);
    geo.setAttribute('position', new THREE.BufferAttribute(this.gp, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('normal', new THREE.BufferAttribute(this.gn, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('uv', new THREE.BufferAttribute(guv, 2));
    geo.setAttribute('aWet', new THREE.BufferAttribute(this.gw, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aDirt', new THREE.BufferAttribute(this.gd, 1).setUsage(THREE.DynamicDrawUsage));
    const useRim = o.rim !== false;
    const idx = front.concat(useRim ? rim : [], back);
    geo.setIndex(idx);
    const nf = front.length + (useRim ? rim.length : 0);
    geo.addGroup(0, nf, 0); geo.addGroup(nf, back.length, 1);
    this.geo = geo; this.mid = new Float32Array(NV * 3);
    this.mesh = new THREE.Mesh(geo, [o.matFront, o.matBack]);
    this.mesh.frustumCulled = false; this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.mesh.matrixAutoUpdate = false;
    if (o.matFront.alphaTest > 0) {
      this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: o.matFront.map, alphaTest: 0.5 });
    }
  }
  setMaterials(f, b) { this.mesh.material = [f, b]; if (this.mesh.customDepthMaterial) this.mesh.customDepthMaterial.map = f.map; }

  updateMesh() {
    const NV = this.NV, p = this.p, mid = this.mid, ws = this.wStart, wi = this.wIdx, ww = this.wW;
    for (let v = 0; v < NV; v++) {
      let x = 0, y = 0, z = 0;
      for (let c = ws[v]; c < ws[v + 1]; c++) { const k = wi[c] * 3, w = ww[c]; x += p[k] * w; y += p[k + 1] * w; z += p[k + 2] * w; }
      mid[v * 3] = x; mid[v * 3 + 1] = y; mid[v * 3 + 2] = z;
    }
    const nb = this.nb, gp = this.gp, gn = this.gn, t = this.thick * 0.5, gw = this.gw, gd = this.gd, bi = this.bIdx, bw = this.bW;
    const wf = this.wetF, wb = this.wetB, dr = this.dirt;
    for (let v = 0; v < NV; v++) {
      const l = nb[v * 4] * 3, r = nb[v * 4 + 1] * 3, u = nb[v * 4 + 2] * 3, d = nb[v * 4 + 3] * 3;
      const ux = mid[r] - mid[l], uy = mid[r + 1] - mid[l + 1], uz = mid[r + 2] - mid[l + 2];
      const vx = mid[d] - mid[u], vy = mid[d + 1] - mid[u + 1], vz = mid[d + 2] - mid[u + 2];
      let x = vy * uz - vz * uy, y = vz * ux - vx * uz, z = vx * uy - vy * ux;
      const il = 1 / (Math.hypot(x, y, z) || 1); x *= il; y *= il; z *= il;
      const a = v * 3, b = (v + NV) * 3;
      gp[a] = mid[a] + x * t; gp[a + 1] = mid[a + 1] + y * t; gp[a + 2] = mid[a + 2] + z * t;
      gp[b] = mid[a] - x * t; gp[b + 1] = mid[a + 1] - y * t; gp[b + 2] = mid[a + 2] - z * t;
      gn[a] = x; gn[a + 1] = y; gn[a + 2] = z; gn[b] = -x; gn[b + 1] = -y; gn[b + 2] = -z;
      const c = v * 4, w0 = bw[c], w1 = bw[c + 1], w2 = bw[c + 2], w3 = bw[c + 3], k0 = bi[c], k1 = bi[c + 1], k2 = bi[c + 2], k3 = bi[c + 3];
      gw[v] = wf[k0] * w0 + wf[k1] * w1 + wf[k2] * w2 + wf[k3] * w3;
      gw[v + NV] = wb[k0] * w0 + wb[k1] * w1 + wb[k2] * w2 + wb[k3] * w3;
      gd[v] = gd[v + NV] = dr[k0] * w0 + dr[k1] * w1 + dr[k2] * w2 + dr[k3] * w3;
    }
    const at = this.geo.attributes;
    at.position.needsUpdate = true; at.normal.needsUpdate = true; at.aWet.needsUpdate = true; at.aDirt.needsUpdate = true;
    if (this.frame) this.mesh.matrix.copy(this.frame); else this.mesh.matrix.identity();
    this.mesh.matrixWorldNeedsUpdate = true;
  }
  // world position of particle k
  wpos(k, out) { out.set(this.p[k * 3], this.p[k * 3 + 1], this.p[k * 3 + 2]); if (this.frame) out.applyMatrix4(this.frame); return out; }
}
