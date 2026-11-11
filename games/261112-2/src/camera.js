// 場面ごとの画角: 見せたい点の集合を画面へ収める位置を解く
import * as THREE from 'three';
import { L } from './layout.js';
import { damp } from './util.js';

const T = L.TOWEL, B = L.BED;
// 場面で必ず見せる点
const FRAMES = {
  1: { pitch: [44, 47], pts: [[-0.57, 0, 0.37], [-0.57, 0.02, -0.4], [0.2, 0, 0.37], [0.2, 0.02, -0.4], [-0.1, 0.34, -0.5], [0.06, 0.3, -0.5], [-0.3, 0.3, -0.1]] },
  2: { pitch: [52, 54], pts: [[-0.57, 0, 0.36], [0.59, 0, 0.36], [-0.57, 0, -0.38], [0.59, 0, -0.38], [-0.1, 0.33, -0.5], [0, 0.26, 0], [0.56, 0.2, 0.1]] },
  3: { pitch: [45, 48], pts: [[-0.63, 0, 0.42], [0.63, 0, 0.42], [-0.66, 0.0, -0.45], [0.63, 0.0, -0.45], [-0.6, 0.5, -0.84], [-0.1, 0.27, -0.5], [0, 0.3, 0]] },
  4: { pitch: [43, 45], pts: [[-0.62, 0, 0.42], [0.63, 0, 0.42], [-0.62, 0.0, -0.45], [0.86, 0.0, -0.5], [T.x0 - 0.06, T.railY + 0.06, L.WALL_Z], [T.x1 + 0.05, T.railY + 0.06, L.WALL_Z], [B.x + B.rx, 0.1, B.z], [0.58, 0.2, 0.1], [B.x + 0.1, 0.48, L.WALL_Z]] },
  5: { pitch: [44, 48], vb: 0.2, pts: [[T.x0 - 0.2, 0, -0.36], [B.x + B.rx + 0.03, 0, -0.36], [T.x0 - 0.14, T.railY + 0.05, L.WALL_Z], [B.x + 0.1, 0.5, L.WALL_Z], [B.x + B.rx + 0.02, 0.12, B.z], [T.x0 - 0.2, 0.3, -0.55]] },
};

export class CameraRig {
  constructor(camera) {
    this.cam = camera; this.scene = 1; this.pos = new THREE.Vector3(0, 1.5, 1.6); this.pitch = 50 * Math.PI / 180; this.tPos = new THREE.Vector3(); this.tPitch = this.pitch;
    this.aspect = 1; this.first = true; this.safe = { t: 0, r: 0, b: 0, l: 0 }; this.w = 1; this.h = 1; this.shake = 0;
  }
  resize(w, h, safe) { this.w = w; this.h = h; this.aspect = w / h; this.safe = safe; this.cam.aspect = this.aspect; this.cam.fov = this.aspect > 1 ? 30 : 36; this.cam.updateProjectionMatrix(); this.solve(); }
  setScene(n, snap) { if (n !== this.scene || snap) { this.scene = n; this.solve(); } if (snap) this.first = true; }
  solve() {
    const fr = FRAMES[this.scene]; const portrait = this.aspect < 1; const pitch = (portrait ? fr.pitch[1] : fr.pitch[0]) * Math.PI / 180;
    const tv = Math.tan(this.cam.fov * Math.PI / 360), th = tv * this.aspect;
    // 余白(Safe Area を含む)
    const mL = 0.035 + this.safe.l / this.w, mR = 0.035 + this.safe.r / this.w, mT = 0.03 + this.safe.t / this.h, mB = 0.03 + this.safe.b / this.h;
    const F = new THREE.Vector3(0, -Math.sin(pitch), -Math.cos(pitch)), U = new THREE.Vector3(0, Math.cos(pitch), -Math.sin(pitch));
    const pr = fr.pts.map((p) => ({ r: p[0], u: p[1] * U.y + p[2] * U.z, f: p[1] * F.y + p[2] * F.z }));
    const solve1 = (key, tanA, tanB) => { // 片側ごとに余白の違う錐台
      let lo = Infinity, hi = -Infinity; for (const p of pr) { lo = Math.min(lo, p[key]); hi = Math.max(hi, p[key]); }
      const fn = (c) => { let m = Infinity; for (const p of pr) { const d = p[key] - c; const lim = d >= 0 ? tanB : tanA; m = Math.min(m, p.f - Math.abs(d) / lim); } return m; };
      for (let i = 0; i < 40; i++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (fn(a) < fn(b)) lo = a; else hi = b; }
      const c = (lo + hi) / 2; return [c, fn(c)];
    };
    const [cr, fH] = solve1('r', th * (1 - 2 * mL), th * (1 - 2 * mR)); const [cu, fV] = solve1('u', tv * (1 - 2 * mB), tv * (1 - 2 * mT));
    const cf = Math.min(fH, fV);
    // 余った方向は「奥を多めに見せる」側へ寄せる
    const range = (key, tanA, tanB) => { let lo = -Infinity, hi = Infinity; for (const p of pr) { const dd = p.f - cf; lo = Math.max(lo, p[key] - dd * tanB); hi = Math.min(hi, p[key] + dd * tanA); } return [lo, hi]; };
    const [ulo, uhi] = range('u', tv * (1 - 2 * mB), tv * (1 - 2 * mT)); const [rlo, rhi] = range('r', th * (1 - 2 * mL), th * (1 - 2 * mR));
    const cu2 = uhi >= ulo ? ulo + (uhi - ulo) * (fr.vb === undefined ? (portrait ? 0.93 : 0.6) : fr.vb) : cu; const cr2 = rhi >= rlo ? (rlo + rhi) / 2 : cr;
    this.tPos.set(cr2, 0, 0).addScaledVector(U, cu2).addScaledVector(F, cf); this.tPitch = pitch;
  }
  update(dt) {
    if (this.first) { this.pos.copy(this.tPos); this.pitch = this.tPitch; this.first = false; }
    const k = 1 - Math.exp(-3.2 * dt); this.pos.lerp(this.tPos, k); this.pitch = damp(this.pitch, this.tPitch, 3.2, dt);
    this.cam.position.copy(this.pos); this.cam.rotation.set(-this.pitch, 0, 0, 'YXZ'); this.cam.updateMatrixWorld();
  }
  moving() { return this.pos.distanceToSquared(this.tPos) > 1e-5; }
}
