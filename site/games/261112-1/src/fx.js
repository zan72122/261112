// Lifetime particles: water drops (falling / sliding on glass), rain streaks.
import * as THREE from 'three';

export class Drops {
  constructor(scene, max) {
    this.max = max; this.n = 0;
    this.d = new Float32Array(max * 9); // x y z vx vy vz life size mode
    this.floor = new Float32Array(max);
    const g = new THREE.SphereGeometry(1, 7, 5);
    const m = new THREE.MeshStandardMaterial({ color: 0xeaf5fb, roughness: 0.05, transparent: true, opacity: 0.55, depthWrite: false, envMapIntensity: 2 });
    this.mesh = new THREE.InstancedMesh(g, m, max); this.mesh.frustumCulled = false; this.mesh.count = 0; this.mesh.renderOrder = 7;
    scene.add(this.mesh); this.onHit = null; this.cx = 0; this.cy = 0.45; this.rmax = 0.15; this._vy = 0; this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._s = new THREE.Vector3(); this._p = new THREE.Vector3(); this._v = new THREE.Vector3(); this._up = new THREE.Vector3(0, 1, 0);
  }
  spawn(x, y, z, vx, vy, vz, life, size, mode = 0, floor = 0) {
    if (this.n >= this.max) return;
    const a = this.n * 9, d = this.d; d[a] = x; d[a + 1] = y; d[a + 2] = z; d[a + 3] = vx; d[a + 4] = vy; d[a + 5] = vz; d[a + 6] = life; d[a + 7] = size; d[a + 8] = mode; this.floor[this.n] = floor; this.n++;
  }
  update(dt) {
    const d = this.d;
    for (let i = 0; i < this.n; i++) {
      const a = i * 9;
      d[a + 6] -= dt;
      let dead = d[a + 6] <= 0;
      if (d[a + 8] === 1) {            // sliding on the round window: spiral outward around its centre
        const cx = this.cx, cy = this.cy, rx = d[a] - cx, ry = d[a + 1] - cy, r = Math.hypot(rx, ry) || 1e-3, w = d[a + 5], vr = d[a + 4];
        const an = Math.atan2(ry, rx) + w * dt, nr = r + vr * dt;
        const nx = cx + Math.cos(an) * nr, ny = cy + Math.sin(an) * nr - 0.02 * dt;
        d[a + 3] = (nx - d[a]) / dt; this._vy = (ny - d[a + 1]) / dt; d[a] = nx; d[a + 1] = ny; if (nr > this.rmax) dead = true;
      } else { d[a + 4] -= 9.8 * dt; d[a] += d[a + 3] * dt; d[a + 1] += d[a + 4] * dt; d[a + 2] += d[a + 5] * dt; }
      if (d[a + 8] === 0 && d[a + 1] < this.floor[i]) { dead = true; if (this.onHit) this.onHit(d[a], this.floor[i], d[a + 2], d[a + 7]); }
      if (dead) { const b = (this.n - 1) * 9; for (let k = 0; k < 9; k++) d[a + k] = d[b + k]; this.floor[i] = this.floor[this.n - 1]; this.n--; i--; continue; }
      const m1 = d[a + 8] === 1, vx = d[a + 3], vy = m1 ? this._vy : d[a + 4], vz = m1 ? 0 : d[a + 5];
      const sp = Math.hypot(vx, vy, vz), s = d[a + 7];
      this._p.set(d[a], d[a + 1], d[a + 2]);
      if (sp > 0.05) { this._v.set(vx / sp, vy / sp, vz / sp); this._q.setFromUnitVectors(this._up, this._v); } else this._q.identity();
      this._s.set(s, s * (1 + Math.min(3.5, sp * (d[a + 8] ? 3 : 0.35))), s);
      this._m.compose(this._p, this._q, this._s); this.mesh.setMatrixAt(i, this._m);
    }
    this.mesh.count = this.n; this.mesh.instanceMatrix.needsUpdate = true;
  }
}

export class Rain {
  constructor(scene, n, box) { // box: {x0,x1,z0,z1,top}
    this.n = n; this.box = box; this.p = new Float32Array(n * 6); this.s = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) this._reset(i, true);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(this.p, 3).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.LineBasicMaterial({ color: 0xe4edf5, transparent: true, opacity: 0, depthWrite: false });
    this.mesh = new THREE.LineSegments(g, this.mat); this.mesh.frustumCulled = false; this.mesh.visible = false; this.mesh.renderOrder = 8; scene.add(this.mesh);
  }
  _reset(i, any) { const b = this.box; this.s[i * 3] = b.x0 + Math.random() * (b.x1 - b.x0); this.s[i * 3 + 1] = any ? Math.random() * b.top : b.top + Math.random() * 0.6; this.s[i * 3 + 2] = b.z0 + Math.random() * (b.z1 - b.z0); }
  update(dt, k, windX) {
    this.mat.opacity = 0.42 * k; this.mesh.visible = k > 0.01; if (!this.mesh.visible) return;
    const p = this.p, s = this.s;
    for (let i = 0; i < this.n; i++) {
      s[i * 3 + 1] -= 7.5 * dt; s[i * 3] += windX * 0.35 * dt;
      if (s[i * 3 + 1] < 0) this._reset(i, false);
      const a = i * 6; p[a] = s[i * 3]; p[a + 1] = s[i * 3 + 1]; p[a + 2] = s[i * 3 + 2];
      p[a + 3] = s[i * 3] - windX * 0.006; p[a + 4] = s[i * 3 + 1] + 0.13; p[a + 5] = s[i * 3 + 2];
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
  }
}
