// あひるの造形: 距離関数(楕円体・円錐の滑らかな合成)から Surface Nets で面を起こす
import * as THREE from 'three';
import { clamp, smooth, sat, rng } from './util.js';

function sdEll(px, py, pz, c, r) {
  const x = (px - c[0]) / r[0], y = (py - c[1]) / r[1], z = (pz - c[2]) / r[2]; const k0 = Math.sqrt(x * x + y * y + z * z);
  const x2 = x / r[0], y2 = y / r[1], z2 = z / r[2]; const k1 = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2); return k1 < 1e-9 ? -Math.min(r[0], r[1], r[2]) : k0 * (k0 - 1) / k1;
}
function sdCone(px, py, pz, a, b, r1, r2, zs) {
  pz = pz * zs; const bax = b[0] - a[0], bay = b[1] - a[1], baz = (b[2] - a[2]) * zs; const l2 = bax * bax + bay * bay + baz * baz; const rr = r1 - r2; const a2 = l2 - rr * rr; const il2 = 1 / l2;
  const pax = px - a[0], pay = py - a[1], paz = pz - a[2] * zs; const y = pax * bax + pay * bay + paz * baz; const z = y - l2;
  const qx = pax * l2 - bax * y, qy = pay * l2 - bay * y, qz = paz * l2 - baz * y; const x2 = qx * qx + qy * qy + qz * qz; const y2 = y * y * l2, z2 = z * z * l2; const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2; if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1; return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
function smin(a, b, k) { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; }

function evalPrims(prims, x, y, z) {
  let d = 1e9;
  for (let i = 0; i < prims.length; i++) { const p = prims[i]; const v = p.t === 'e' ? sdEll(x, y, z, p.c, p.r) : sdCone(x, y, z, p.a, p.b, p.r1, p.r2, p.zs || 1); d = i === 0 ? v : smin(d, v, p.k); }
  return d;
}

// Surface Nets
function surfaceNets(sdf, min, max, cs) {
  const nx = Math.ceil((max[0] - min[0]) / cs), ny = Math.ceil((max[1] - min[1]) / cs), nz = Math.ceil((max[2] - min[2]) / cs);
  const sx = nx + 1, sy = ny + 1, sz = nz + 1; const val = new Float32Array(sx * sy * sz);
  for (let k = 0; k < sz; k++) for (let j = 0; j < sy; j++) for (let i = 0; i < sx; i++) val[(k * sy + j) * sx + i] = sdf(min[0] + i * cs, min[1] + j * cs, min[2] + k * cs);
  const cellIdx = new Int32Array(nx * ny * nz).fill(-1); const verts = []; const quads = [];
  const co = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]; const cv = new Float32Array(8);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    let mask = 0; for (let c = 0; c < 8; c++) { const v = val[((k + co[c][2]) * sy + j + co[c][1]) * sx + i + co[c][0]]; cv[c] = v; if (v < 0) mask |= 1 << c; }
    if (mask === 0 || mask === 255) continue; let ax = 0, ay = 0, az = 0, n = 0;
    for (let e = 0; e < 12; e++) { const a = edges[e][0], b = edges[e][1]; if ((cv[a] < 0) === (cv[b] < 0)) continue; const t = cv[a] / (cv[a] - cv[b]); ax += co[a][0] + (co[b][0] - co[a][0]) * t; ay += co[a][1] + (co[b][1] - co[a][1]) * t; az += co[a][2] + (co[b][2] - co[a][2]) * t; n++; }
    cellIdx[(k * ny + j) * nx + i] = verts.length / 3; verts.push(min[0] + (i + ax / n) * cs, min[1] + (j + ay / n) * cs, min[2] + (k + az / n) * cs);
  }
  const ci = (i, j, k) => cellIdx[(k * ny + j) * nx + i];
  for (let k = 1; k < nz; k++) for (let j = 1; j < ny; j++) for (let i = 1; i < nx; i++) {
    const v0 = val[(k * sy + j) * sx + i];
    // x方向の辺
    { const v1 = val[(k * sy + j) * sx + i + 1]; if ((v0 < 0) !== (v1 < 0)) { const a = ci(i, j - 1, k - 1), b = ci(i, j, k - 1), c = ci(i, j, k), d = ci(i, j - 1, k); if (a >= 0 && b >= 0 && c >= 0 && d >= 0) { if (v0 < 0) quads.push(a, b, c, d); else quads.push(a, d, c, b); } } }
    { const v1 = val[(k * sy + j + 1) * sx + i]; if ((v0 < 0) !== (v1 < 0)) { const a = ci(i - 1, j, k - 1), b = ci(i, j, k - 1), c = ci(i, j, k), d = ci(i - 1, j, k); if (a >= 0 && b >= 0 && c >= 0 && d >= 0) { if (v0 < 0) quads.push(a, d, c, b); else quads.push(a, b, c, d); } } }
    { const v1 = val[((k + 1) * sy + j) * sx + i]; if ((v0 < 0) !== (v1 < 0)) { const a = ci(i - 1, j - 1, k), b = ci(i, j - 1, k), c = ci(i, j, k), d = ci(i - 1, j, k); if (a >= 0 && b >= 0 && c >= 0 && d >= 0) { if (v0 < 0) quads.push(a, b, c, d); else quads.push(a, d, c, b); } } }
  }
  const pos = new Float32Array(verts); const nrm = new Float32Array(pos.length); const e = cs * 0.5;
  for (let i = 0; i < pos.length; i += 3) {
    let x = pos[i], y = pos[i + 1], z = pos[i + 2]; let gx = 0, gy = 0, gz = 0;
    for (let it = 0; it < 3; it++) { const d = sdf(x, y, z); gx = sdf(x + e, y, z) - sdf(x - e, y, z); gy = sdf(x, y + e, z) - sdf(x, y - e, z); gz = sdf(x, y, z + e) - sdf(x, y, z - e); const gl = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1; gx /= gl; gy /= gl; gz /= gl; if (it < 2) { x -= gx * d * 0.9; y -= gy * d * 0.9; z -= gz * d * 0.9; } }
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z; nrm[i] = gx; nrm[i + 1] = gy; nrm[i + 2] = gz;
  }
  const idx = new Uint32Array(quads.length / 4 * 6);
  for (let q = 0, t = 0; q < quads.length; q += 4) { const a = quads[q], b = quads[q + 1], c = quads[q + 2], d = quads[q + 3]; idx[t++] = a; idx[t++] = b; idx[t++] = c; idx[t++] = a; idx[t++] = c; idx[t++] = d; }
  // 面の向きを法線に合わせる
  { const a = idx[0] * 3, b = idx[1] * 3, c = idx[2] * 3; const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx; if (fx * nrm[a] + fy * nrm[a + 1] + fz * nrm[a + 2] < 0) for (let t = 0; t < idx.length; t += 3) { const s = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = s; } }
  return { pos, nrm, idx };
}

// 親(成鳥)と子(ひな)の形の定義。x=前, y=上, z=右。原点は腹のいちばん下
export const SHAPES = {
  parent: {
    cs: 0.0058, min: [-0.235, -0.012, -0.1], max: [0.225, 0.345, 0.1],
    body: [
      { t: 'e', c: [-0.012, 0.07, 0], r: [0.138, 0.07, 0.074] },
      { t: 'e', c: [0.072, 0.078, 0], r: [0.078, 0.07, 0.064], k: 0.04 },
      { t: 'e', c: [-0.118, 0.09, 0], r: [0.072, 0.042, 0.05], k: 0.04 },
      { t: 'c', a: [-0.15, 0.1, 0], b: [-0.212, 0.138, 0], r1: 0.027, r2: 0.007, zs: 0.62, k: 0.035 },
      { t: 'e', c: [-0.035, 0.092, 0.058], r: [0.118, 0.046, 0.027], k: 0.016 },
      { t: 'e', c: [-0.035, 0.092, -0.058], r: [0.118, 0.046, 0.027], k: 0.016 },
    ],
    neck: [
      { t: 'c', a: [0.094, 0.11, 0], b: [0.126, 0.196, 0], r1: 0.039, r2: 0.0262 },
      { t: 'c', a: [0.126, 0.196, 0], b: [0.143, 0.262, 0], r1: 0.0262, r2: 0.0245, k: 0.02 },
      { t: 'e', c: [0.157, 0.292, 0], r: [0.045, 0.037, 0.0345], k: 0.022 },
      { t: 'e', c: [0.176, 0.282, 0], r: [0.027, 0.027, 0.03], k: 0.03 },
    ],
    blend: 0.04,
    P1: [0.096, 0.118, 0], P2: [0.14, 0.258, 0], PT: [-0.125, 0.095, 0], axisY: 0.078, x0: -0.215, x1: 0.15,
    neckA: [0.094, 0.11], neckB: [0.157, 0.292],
    eye: [0.178, 0.3, 0.03], eyeR: 0.0064,
    bill: { cs: 0.0017, min: [0.178, 0.25, -0.03], max: [0.275, 0.312, 0.03], prims: [
      { t: 'e', c: [0.224, 0.279, 0], r: [0.043, 0.0115, 0.0195] }, { t: 'e', c: [0.248, 0.2755, 0], r: [0.021, 0.009, 0.0218], k: 0.01 }, { t: 'e', c: [0.199, 0.287, 0], r: [0.022, 0.0155, 0.017], k: 0.012 }],
      mouthY: (x) => 0.2765 - (x - 0.2) * 0.06, nostril: [0.211, 0.291, 0.0066], nail: [0.266, 0.2755] },
    hip: [-0.012, 0.022, 0.04], legLen: 0.07, legR: 0.0062, footL: 0.062, draft: 0.042, radius: 0.105, len: 0.15, wid: 0.08,
    dispMax: 0.0165, furLen: 0.0045,
  },
  kid: {
    cs: 0.0037, min: [-0.1, -0.008, -0.052], max: [0.108, 0.162, 0.052],
    body: [
      { t: 'e', c: [-0.002, 0.041, 0], r: [0.062, 0.041, 0.042] },
      { t: 'e', c: [0.03, 0.046, 0], r: [0.04, 0.039, 0.036], k: 0.025 },
      { t: 'e', c: [-0.048, 0.05, 0], r: [0.032, 0.026, 0.028], k: 0.025 },
      { t: 'c', a: [-0.062, 0.057, 0], b: [-0.086, 0.07, 0], r1: 0.014, r2: 0.005, zs: 0.75, k: 0.02 },
      { t: 'e', c: [-0.008, 0.052, 0.036], r: [0.034, 0.019, 0.0115], k: 0.012 },
      { t: 'e', c: [-0.008, 0.052, -0.036], r: [0.034, 0.019, 0.0115], k: 0.012 },
    ],
    neck: [
      { t: 'c', a: [0.04, 0.064, 0], b: [0.058, 0.105, 0], r1: 0.026, r2: 0.022 },
      { t: 'e', c: [0.066, 0.123, 0], r: [0.0335, 0.0305, 0.0295], k: 0.02 },
      { t: 'e', c: [0.078, 0.116, 0], r: [0.02, 0.02, 0.0245], k: 0.02 },
    ],
    blend: 0.03,
    P1: [0.04, 0.068, 0], P2: [0.056, 0.102, 0], PT: [-0.05, 0.052, 0], axisY: 0.045, x0: -0.09, x1: 0.075,
    neckA: [0.04, 0.064], neckB: [0.066, 0.123],
    eye: [0.0815, 0.1295, 0.0238], eyeR: 0.0046,
    bill: { cs: 0.001, min: [0.082, 0.098, -0.017], max: [0.122, 0.132, 0.017], prims: [
      { t: 'e', c: [0.1, 0.1145, 0], r: [0.019, 0.0068, 0.0112] }, { t: 'e', c: [0.109, 0.113, 0], r: [0.0095, 0.0054, 0.0118], k: 0.006 }, { t: 'e', c: [0.091, 0.1185, 0], r: [0.011, 0.009, 0.0105], k: 0.007 }],
      mouthY: (x) => 0.1135 - (x - 0.09) * 0.05, nostril: [0.096, 0.1205, 0.0042], nail: [0.117, 0.113] },
    hip: [-0.006, 0.012, 0.02], legLen: 0.03, legR: 0.0034, footL: 0.03, draft: 0.019, radius: 0.052, len: 0.068, wid: 0.045,
    dispMax: 0.0016, furLen: 0.0085,
  },
};

export function buildDuckGeometry(S, seed, palette) {
  const bodyF = (x, y, z) => evalPrims(S.body, x, y, z), neckF = (x, y, z) => evalPrims(S.neck, x, y, z);
  const sdf = (x, y, z) => smin(bodyF(x, y, z), neckF(x, y, z), S.blend);
  const m = surfaceNets(sdf, S.min, S.max, S.cs); const n = m.pos.length / 3;
  const bend = new Float32Array(n * 3), part = new Float32Array(n * 4), uv = new Float32Array(n * 2), col = new Float32Array(n * 3);
  const nax = S.neckB[0] - S.neckA[0], nay = S.neckB[1] - S.neckA[1], nl2 = nax * nax + nay * nay; const r = rng(seed);
  const marks = palette.marks || [];
  for (let i = 0; i < n; i++) {
    const x = m.pos[i * 3], y = m.pos[i * 3 + 1], z = m.pos[i * 3 + 2];
    const db = bodyF(x, y, z), dn = neckF(x, y, z); const wnh = smooth(-S.blend * 0.6, S.blend * 0.6, db - dn);
    const t = clamp(((x - S.neckA[0]) * nax + (y - S.neckA[1]) * nay) / nl2, 0, 1.3);
    const w1 = wnh * smooth(0.0, 0.5, t), w2 = wnh * smooth(0.5, 0.82, t); const wt = smooth(S.PT[0] + 0.01, S.PT[0] - 0.05, x) * (1 - wnh);
    bend[i * 3] = w1; bend[i * 3 + 1] = w2; bend[i * 3 + 2] = wt;
    const head = wnh * smooth(0.3, 0.6, t); const ang = Math.atan2(z, y - S.axisY); const back = smooth(1.15, 0.6, Math.abs(ang)); const side = 1 - back; const right = smooth(-S.wid * 0.12, S.wid * 0.12, z);
    part[i * 4] = head; part[i * 4 + 1] = (1 - head) * back; part[i * 4 + 2] = (1 - head) * side * (1 - right); part[i * 4 + 3] = (1 - head) * side * right;
    uv[i * 2] = ang / (Math.PI * 2) + 0.5; uv[i * 2 + 1] = clamp((x - S.x0) / (S.x1 - S.x0), 0, 1);
    // 頂点色: 腹は明るく、個体の斑
    let c = palette.base(x, y, z, S);
    for (const mk of marks) { const dx = (x - mk.p[0]) / mk.r[0], dy = (y - mk.p[1]) / mk.r[1], dz = (z - mk.p[2]) / mk.r[2]; const d = dx * dx + dy * dy + dz * dz; if (d < 1) { const k = smooth(1, 0.35, d) * mk.a; c = [c[0] + (mk.c[0] - c[0]) * k, c[1] + (mk.c[1] - c[1]) * k, c[2] + (mk.c[2] - c[2]) * k]; } }
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(m.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(m.nrm, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('aBend', new THREE.BufferAttribute(bend, 3)); g.setAttribute('aPart', new THREE.BufferAttribute(part, 4)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(new THREE.BufferAttribute(m.idx, 1));
  g.computeBoundingSphere(); g.boundingSphere.radius *= 1.6;
  // 円筒UVの継ぎ目(腹側)をまたぐ三角形は u を寄せる
  return { geo: g, sdf, n };
}

export function buildBillGeometry(S, colors) {
  const B = S.bill; const sdf = (x, y, z) => evalPrims(B.prims, x, y, z); const m = surfaceNets(sdf, B.min, B.max, B.cs); const n = m.pos.length / 3; const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const x = m.pos[i * 3], y = m.pos[i * 3 + 1], z = m.pos[i * 3 + 2]; let c = colors.bill.slice();
    const my = B.mouthY(x); const side = Math.abs(m.nrm[i * 3 + 1]) < 0.75; const dm = Math.abs(y - my); if (side && dm < B.cs * 1.4) { const k = 1 - dm / (B.cs * 1.4); c = c.map((v, q) => v + (colors.mouth[q] - v) * k * 0.75); }
    const dn = Math.hypot(x - B.nostril[0], y - B.nostril[1], Math.abs(z) - B.nostril[2]); if (dn < B.cs * 2.2) { const k = 1 - dn / (B.cs * 2.2); c = c.map((v, q) => v + (colors.mouth[q] * 0.6 - v) * k); }
    const dl = Math.hypot(x - B.nail[0], (y - B.nail[1]) * 1.5, z * 1.3); if (dl < B.cs * 7) { const k = smooth(B.cs * 7, B.cs * 3, dl); c = c.map((v, q) => v + (colors.nail[q] - v) * k * 0.6); }
    if (y < my) c = c.map((v) => v * 0.9);
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(m.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(m.nrm, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(new THREE.BufferAttribute(m.idx, 1)); return g;
}

// 水かきのある足
export function buildFootGeometry(len) {
  const s = new THREE.Shape(); const w = len * 0.52;
  s.moveTo(-len * 0.18, 0); s.quadraticCurveTo(-len * 0.05, w * 0.3, len * 0.72, w); s.quadraticCurveTo(len * 0.86, w * 0.98, len * 0.84, w * 0.8);
  s.quadraticCurveTo(len * 0.78, w * 0.42, len * 1.0, w * 0.06); s.quadraticCurveTo(len * 1.04, 0, len * 1.0, -w * 0.06); s.quadraticCurveTo(len * 0.78, -w * 0.42, len * 0.84, -w * 0.8);
  s.quadraticCurveTo(len * 0.86, -w * 0.98, len * 0.72, -w); s.quadraticCurveTo(-len * 0.05, -w * 0.3, -len * 0.18, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: len * 0.05, bevelEnabled: true, bevelThickness: len * 0.03, bevelSize: len * 0.03, bevelSegments: 2, curveSegments: 8 });
  g.rotateX(Math.PI / 2); g.translate(0, len * 0.08, 0); // 上が+y、つま先が+x
  // 指の筋を少し盛り上げる
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = p.getY(i); if (y > len * 0.03) { const a = Math.atan2(z, x + len * 0.18); const ridge = Math.max(Math.cos(a * 3.4), 0); p.setY(i, y + ridge * ridge * len * 0.05 * sat(x / len + 0.2)); } }
  g.computeVertexNormals(); return g;
}
