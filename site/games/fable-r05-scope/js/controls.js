// Smooth orbit camera (damped spherical coordinates) and CPU ray picking.
(function () {
  'use strict';
  const S = window.SCOPE;
  const { M, V, clamp, damp } = S;
  const RAD = Math.PI / 180;

  class Orbit {
    constructor() {
      this.fov = 30 * RAD; this.near = 30; this.far = 9000;
      this.homeTarget = [0, 238, -28];
      this.cur = { az: 35 * RAD, el: 12 * RAD, dist: 1250, target: this.homeTarget.slice() };
      this.goal = { az: 35 * RAD, el: 12 * RAD, dist: 1250, target: this.homeTarget.slice() };
      this.aspect = 16 / 9;
    }
    homeDist() { return 1220 * Math.max(1, 1.02 / this.aspect); }
    home(snap) {
      this.goal.az = 35 * RAD; this.goal.el = 12 * RAD; this.goal.dist = this.homeDist(); this.goal.target = this.homeTarget.slice();
      if (snap) this.snap();
    }
    snap() { const g = this.goal; this.cur = { az: g.az, el: g.el, dist: g.dist, target: g.target.slice() }; }
    rotate(dx, dy) {
      this.goal.az -= dx * 0.0052;
      this.goal.el = clamp(this.goal.el + dy * 0.0042, -8 * RAD, 86 * RAD);
    }
    zoom(f) { this.goal.dist = clamp(this.goal.dist * f, 140, 2600); }
    pan(dx, dy, viewH) {
      const k = (2 * this.goal.dist * Math.tan(this.fov / 2)) / viewH;
      const m = this.matrices();
      const right = [m.view[0], m.view[4], m.view[8]], up = [m.view[1], m.view[5], m.view[9]];
      const t = this.goal.target;
      for (let a = 0; a < 3; a++) t[a] = t[a] - right[a] * dx * k + up[a] * dy * k;
      t[0] = clamp(t[0], -260, 260); t[1] = clamp(t[1], 10, 520); t[2] = clamp(t[2], -320, 260);
    }
    // returns true while the camera is still moving
    update(dt) {
      const c = this.cur, g = this.goal, r = 9.5;
      const before = c.az + c.el + c.dist * 0.001 + (c.target[0] + c.target[1] + c.target[2]) * 0.01;
      c.az = damp(c.az, g.az, r, dt); c.el = damp(c.el, g.el, r, dt); c.dist = damp(c.dist, g.dist, r, dt);
      for (let a = 0; a < 3; a++) c.target[a] = damp(c.target[a], g.target[a], r * 0.7, dt);
      const after = c.az + c.el + c.dist * 0.001 + (c.target[0] + c.target[1] + c.target[2]) * 0.01;
      return Math.abs(after - before) > 2e-5;
    }
    eye() {
      const c = this.cur;
      return [c.target[0] + c.dist * Math.cos(c.el) * Math.sin(c.az), c.target[1] + c.dist * Math.sin(c.el), c.target[2] + c.dist * Math.cos(c.el) * Math.cos(c.az)];
    }
    matrices() {
      const eye = this.eye(), t = this.cur.target;
      const view = M.lookAt(eye, t, [0, 1, 0]);
      const proj = M.perspective(this.fov, this.aspect, this.near, this.far);
      const viewProj = M.mul(proj, view);
      return { view, proj, viewProj, eye, forward: V.norm(V.sub(t, eye)) };
    }
  }

  // world-space ray through a point given in normalised device coordinates
  function rayFromNdc(viewProj, nx, ny) {
    const inv = M.inverse(viewProj);
    const a = M.point(inv, [nx, ny, -1]), b = M.point(inv, [nx, ny, 1]);
    return { o: a, d: V.norm(V.sub(b, a)) };
  }

  function hitMesh(mesh, o, d, best) {
    // slab test against the local bounding box
    let t0 = 0, t1 = best;
    for (let a = 0; a < 3; a++) {
      const inv = 1 / (Math.abs(d[a]) < 1e-12 ? 1e-12 : d[a]);
      let n = (mesh.min[a] - 0.01 - o[a]) * inv, f = (mesh.max[a] + 0.01 - o[a]) * inv;
      if (n > f) { const s = n; n = f; f = s; }
      if (n > t0) t0 = n;
      if (f < t1) t1 = f;
      if (t0 > t1) return best;
    }
    const P = mesh.positions, I = mesh.indices;
    for (let k = 0; k < I.length; k += 3) {
      const i0 = I[k] * 3, i1 = I[k + 1] * 3, i2 = I[k + 2] * 3;
      const ax = P[i0], ay = P[i0 + 1], az = P[i0 + 2];
      const e1x = P[i1] - ax, e1y = P[i1 + 1] - ay, e1z = P[i1 + 2] - az;
      const e2x = P[i2] - ax, e2y = P[i2 + 1] - ay, e2z = P[i2 + 2] - az;
      const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x;
      const det = e1x * px + e1y * py + e1z * pz;
      if (det > -1e-10 && det < 1e-10) continue;
      const id = 1 / det, tx = o[0] - ax, ty = o[1] - ay, tz = o[2] - az;
      const u = (tx * px + ty * py + tz * pz) * id;
      if (u < 0 || u > 1) continue;
      const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
      const v = (d[0] * qx + d[1] * qy + d[2] * qz) * id;
      if (v < 0 || u + v > 1) continue;
      const t = (e2x * qx + e2y * qy + e2z * qz) * id;
      if (t > 1e-4 && t < best) best = t;
    }
    return best;
  }

  // nearest hit among items accepted by `accept(item)`; returns { item, t } or null
  function raycast(items, ray, accept) {
    let best = Infinity, hit = null;
    for (const it of items) {
      if (!it.part || !it.visible || it.layer === 'beam' || it.layer === 'decal') continue;
      if (accept && !accept(it)) continue;
      if (it.invVersion !== it.node.version) { it.inv = M.inverse(it.node.world); it.invVersion = it.node.version; }
      if (!it.inv) continue;
      const o = M.point(it.inv, ray.o), d = M.dir(it.inv, ray.d);
      const t = hitMesh(it.mesh, o, d, best);
      if (t < best) { best = t; hit = it; }
    }
    return hit ? { item: hit, t: best } : null;
  }

  S.Orbit = Orbit; S.rayFromNdc = rayFromNdc; S.raycast = raycast;
})();
