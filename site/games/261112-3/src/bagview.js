// bagview.js — 48質点の膜を補間して描く袋メッシュ (前後の薄膜 + 持ち手)
import * as THREE from 'three';
import { NC, NR, BAG_W, BAG_H } from './bagsim.js';

const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export class BagView {
  constructor(sim, crinkle, low) {
    this.sim = sim;
    const NU = (this.NU = low ? 15 : 23), NV = (this.NV = low ? 17 : 27), N = NU * NV;
    this.fx = new Float32Array(N); this.fy = new Float32Array(N); this.T = new Float32Array(N); this.Ti = new Float32Array(N); this.Tt = new Float32Array(N);
    // Catmull-Rom の重み
    this.taps = [];
    const cr = (t) => [(-t + 2 * t * t - t * t * t) / 2, (2 - 5 * t * t + 3 * t * t * t) / 2, (t + 4 * t * t - 3 * t * t * t) / 2, (-t * t + t * t * t) / 2];
    for (let iv = 0; iv < NV; iv++) for (let iu = 0; iu < NU; iu++) {
      const gu = (iu / (NU - 1)) * (NC - 1), gv = (iv / (NV - 1)) * (NR - 1);
      const cu = Math.min(NC - 2, Math.floor(gu)), cv = Math.min(NR - 2, Math.floor(gv)), wu = cr(gu - cu), wv = cr(gv - cv), tp = [];
      for (let b = 0; b < 4; b++) for (let a = 0; a < 4; a++) {
        const c = Math.min(NC - 1, Math.max(0, cu - 1 + a)), r = Math.min(NR - 1, Math.max(0, cv - 1 + b));
        tp.push(r * NC + c, wu[a] * wv[b]);
      }
      this.taps.push(tp);
    }
    const geo = (this.geo = new THREE.BufferGeometry());
    this.pos = new Float32Array(N * 2 * 3); const uv = new Float32Array(N * 2 * 2), idx = [];
    for (let iv = 0; iv < NV; iv++) for (let iu = 0; iu < NU; iu++) { const i = iv * NU + iu; uv[i * 2] = iu / (NU - 1); uv[i * 2 + 1] = 1 - iv / (NV - 1); uv[(N + i) * 2] = 1 - iu / (NU - 1) + 0.37; uv[(N + i) * 2 + 1] = 1 - iv / (NV - 1) + 0.21; }
    // 材質グループ: 0=口の縁, 1=手前の膜, 2=奥の膜とまち
    const quadF = (iv, iu) => { const a = iv * NU + iu, b = a + 1, c = a + NU, d = c + 1; idx.push(a, c, b, b, c, d); };
    const quadB = (iv, iu) => { const a = iv * NU + iu, b = a + 1, c = a + NU, d = c + 1; idx.push(N + a, N + b, N + c, N + b, N + d, N + c); };
    for (let iu = 0; iu < NU - 1; iu++) { quadF(0, iu); quadB(0, iu); }
    const g0 = idx.length;
    for (let iv = 1; iv < NV - 1; iv++) for (let iu = 0; iu < NU - 1; iu++) quadF(iv, iu);
    const g1 = idx.length;
    for (let iv = 1; iv < NV - 1; iv++) for (let iu = 0; iu < NU - 1; iu++) quadB(iv, iu);
    for (let iv = 0; iv < NV - 1; iv++) { // 側面(まち)
      let a = iv * NU, c = a + NU; idx.push(N + a, N + c, a, a, N + c, c);
      a = iv * NU + NU - 1; c = a + NU; idx.push(a, c, N + a, N + a, c, N + c);
    }
    for (let iu = 0; iu < NU - 1; iu++) { const a = (NV - 1) * NU + iu, b = a + 1; idx.push(a, N + a, b, b, N + a, N + b); }
    geo.addGroup(0, g0, 0); geo.addGroup(g0, g1 - g0, 1); geo.addGroup(g1, idx.length - g1, 2);
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx);
    const frag = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `#include <opaque_fragment>
        float fr = pow(1.0 - abs(dot(normalize(vViewPosition), normal)), 2.0);
        float sp = dot(reflectedLight.directSpecular + reflectedLight.indirectSpecular * 0.6, vec3(0.333));
        gl_FragColor.a = clamp(diffuseColor.a + fr * 0.55 + sp * 0.9, 0.0, 0.97);`);
    };
    const mk = (op) => { const m = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: op, roughness: 0.3, metalness: 0, side: THREE.DoubleSide, depthWrite: false, bumpMap: crinkle, bumpScale: 1.6, envMapIntensity: 2.2 }); m.onBeforeCompile = frag; return m; };
    const mat = (this.mat = mk(0.2)), matRim = mk(0.7), matBack = mk(0.42);
    this.mesh = new THREE.Mesh(geo, [matRim, mat, matBack]); this.mesh.renderOrder = 5; this.mesh.frustumCulled = false; this.mesh.castShadow = false;
    // 影は薄く: 影用マテリアルは別 (半透明の膜なので弱い影)
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.5 });
    this.group = new THREE.Group(); this.group.add(this.mesh);
    // 持ち手 (左右 × 前後の帯)
    const HS = (this.HS = 9);
    this.hpos = new Float32Array(4 * HS * 2 * 3); const hidx = [], huv = new Float32Array(4 * HS * 2 * 2);
    for (let r = 0; r < 4; r++) for (let i = 0; i < HS; i++) {
      const o = (r * HS + i) * 2; huv[o * 2] = 0; huv[o * 2 + 1] = i / HS * 0.4; huv[o * 2 + 2] = 0.2; huv[o * 2 + 3] = i / HS * 0.4;
      if (i < HS - 1) hidx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2);
    }
    const hg = (this.hgeo = new THREE.BufferGeometry()); hg.setAttribute('position', new THREE.BufferAttribute(this.hpos, 3)); hg.setAttribute('uv', new THREE.BufferAttribute(huv, 2)); hg.setIndex(hidx);
    const hm = mk(0.6);
    this.hmesh = new THREE.Mesh(hg, hm); this.hmesh.renderOrder = 6; this.hmesh.frustumCulled = false; this.hmesh.castShadow = false;
    this.group.add(this.hmesh);
    this.t = 0;
  }
  update(dt) {
    const { sim, NU, NV, fx, fy, T, Ti, Tt, taps, pos } = this, N = NU * NV, px = sim.px, py = sim.py;
    this.t += dt;
    for (let i = 0; i < N; i++) { const tp = taps[i]; let x = 0, y = 0; for (let k = 0; k < 32; k += 2) { x += px[tp[k]] * tp[k + 1]; y += py[tp[k]] * tp[k + 1]; } fx[i] = x; fy[i] = y; }
    const open = Math.min(1.25, Math.max(0.25, (px[sim.cornerR] - px[sim.cornerL]) / BAG_W));
    const bodies = sim.bodies.filter((b) => sim.anyInside(b));
    for (let iv = 0; iv < NV; iv++) for (let iu = 0; iu < NU; iu++) {
      const i = iv * NU + iu, u = iu / (NU - 1), v = iv / (NV - 1);
      const t0 = 0.004 + 0.03 * Math.pow(Math.sin(Math.PI * u), 0.8) * (1 - v * 0.8) * open * (1 - sstep(0.9, 1, v) * 0.6);
      let ti = 0;
      for (const b of bodies) {
        if (Math.abs(fx[i] - b.x) > b.shape.bound + 0.02 || Math.abs(fy[i] - b.y) > b.shape.bound + 0.02) continue;
        const d = sim.sdfWorld(b, fx[i], fy[i]), sh = b.shape; let h = 0;
        if (sh.type === 'box') h = sh.hz * sstep(0.004, -0.008, d);
        else if (d < 0) { const rr = sh.r + d; h = Math.sqrt(Math.max(0, sh.r * sh.r - rr * rr)) * (sh.zs || 1); }
        if (h > ti) ti = h;
      }
      Ti[i] = ti > 0 ? ti + 0.0025 : 0; T[i] = Math.max(t0, Ti[i]);
    }
    for (let p = 0; p < 2; p++) { // 品物に張った膜のなだらかさ
      for (let iv = 0; iv < NV; iv++) for (let iu = 0; iu < NU; iu++) {
        const i = iv * NU + iu, l = iu > 0 ? T[i - 1] : T[i], r = iu < NU - 1 ? T[i + 1] : T[i], a = iv > 0 ? T[i - NU] : T[i], b = iv < NV - 1 ? T[i + NU] : T[i];
        Tt[i] = Math.max(Ti[i], (T[i] * 2 + l + r + a + b) / 6);
      }
      T.set(Tt);
    }
    const du0 = BAG_W / (NU - 1), dv0 = BAG_H / (NV - 1), tt = this.t;
    for (let iv = 0; iv < NV; iv++) for (let iu = 0; iu < NU; iu++) {
      const i = iv * NU + iu, u = iu / (NU - 1), v = iv / (NV - 1);
      const il = iu > 0 ? i - 1 : i, ir = iu < NU - 1 ? i + 1 : i, ia = iv > 0 ? i - NU : i, ib = iv < NV - 1 ? i + NU : i;
      const cu = Math.max(0, 1 - Math.hypot(fx[ir] - fx[il], fy[ir] - fy[il]) / (du0 * (ir - il))), cv = Math.max(0, 1 - Math.hypot(fx[ib] - fx[ia], fy[ib] - fy[ia]) / (dv0 * ((ib - ia) / NU)));
      const edge = Math.sin(Math.PI * u), free = Ti[i] > 0 ? 0.35 : 1;
      const w1 = Math.sin(u * 37 + 3.1 * Math.sin(v * 5.3 + 1.7)) * 0.016 * Math.sqrt(Math.min(0.4, cu)) * free;
      const w2 = Math.sin(v * 41 + 2.6 * Math.sin(u * 6.1)) * 0.013 * Math.sqrt(Math.min(0.4, cv)) * free;
      const base = Math.sin(u * 19 + v * 7) * Math.sin(v * 13 - u * 5) * 0.0022 * edge * free;
      const zf = T[i] + (w1 + w2) * edge + base, zb = -T[i] * 0.92 + (w1 - w2) * edge * 0.8 - base;
      pos[i * 3] = fx[i]; pos[i * 3 + 1] = fy[i]; pos[i * 3 + 2] = zf;
      const j = (N + i) * 3; pos[j] = fx[i]; pos[j + 1] = fy[i]; pos[j + 2] = Math.min(zb, zf - 0.002);
    }
    this.geo.attributes.position.needsUpdate = true; this.geo.computeVertexNormals();
    // 持ち手
    const HS = this.HS, hp = this.hpos;
    const strip = (r, c0, c1, h, zs) => {
      const i0 = sim.idx(c0, 0), i1 = sim.idx(c1, 0), fu0 = Math.round((c0 / (NC - 1)) * (NU - 1)), fu1 = Math.round((c1 / (NC - 1)) * (NU - 1));
      const z0 = (zs > 0 ? pos[fu0 * 3 + 2] : pos[(N + fu0) * 3 + 2]), z1 = (zs > 0 ? pos[fu1 * 3 + 2] : pos[(N + fu1) * 3 + 2]);
      for (let k = 0; k < HS; k++) {
        const t = k / (HS - 1), a = (1 - t) * (1 - t), b = 2 * t * (1 - t), c = t * t;
        // 2次ベジェ: 根元 → 中間質点(制御点を外挿) → 支点
        const ax = px[i0], ay = py[i0], mx = 2 * px[h[0]] - (ax + px[h[2]]) / 2, my = 2 * py[h[0]] - (ay + py[h[2]]) / 2;
        const bx = px[i1], by = py[i1], nx = 2 * px[h[1]] - (bx + px[h[2]]) / 2, ny = 2 * py[h[1]] - (by + py[h[2]]) / 2;
        const o = (r * HS + k) * 6, zt = zs * 0.004;
        hp[o] = a * ax + b * mx + c * (px[h[2]] - 0.004); hp[o + 1] = a * ay + b * my + c * py[h[2]]; hp[o + 2] = z0 * (1 - t) * (1 - t) + zt;
        hp[o + 3] = a * bx + b * nx + c * (px[h[2]] + 0.004); hp[o + 4] = a * by + b * ny + c * py[h[2]]; hp[o + 5] = z1 * (1 - t) * (1 - t) + zt;
      }
    };
    strip(0, 0, 1, sim.hL, 1); strip(1, 0, 1, sim.hL, -1); strip(2, NC - 1, NC - 2, sim.hR, 1); strip(3, NC - 1, NC - 2, sim.hR, -1);
    this.hgeo.attributes.position.needsUpdate = true; this.hgeo.computeVertexNormals();
  }
}
