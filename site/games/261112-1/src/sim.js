// World-frame cloth collisions and helpers.
import { L } from './world.js';

export const H = 1 / 120, ITER = 4, GRAV = -9.8;

export function collideFloor(c, y0) {
  const p = c.p, q = c.q, r = c.rad * 0.6;
  for (let k = 0; k < c.n; k++) {
    if (!c.active[k] || c.kin[k]) continue; const a = k * 3;
    if (p[a + 1] < y0 + r) { p[a + 1] = y0 + r; q[a] += (p[a] - q[a]) * 0.5; q[a + 2] += (p[a + 2] - q[a + 2]) * 0.5; q[a + 1] = p[a + 1]; }
  }
}

export function collideBox(c, x0, x1, y0, y1, z0, z1) {
  const p = c.p, q = c.q, r = c.rad * 0.7;
  x0 -= r; x1 += r; y0 -= r; y1 += r; z0 -= r; z1 += r;
  for (let k = 0; k < c.n; k++) {
    if (!c.active[k] || c.kin[k]) continue; const a = k * 3, x = p[a], y = p[a + 1], z = p[a + 2];
    if (x <= x0 || x >= x1 || y <= y0 || y >= y1 || z <= z0 || z >= z1) continue;
    const d0 = x - x0, d1 = x1 - x, d2 = y - y0, d3 = y1 - y, d4 = z - z0, d5 = z1 - z;
    const m = Math.min(d0, d1, d2, d3, d4, d5);
    if (m === d3) p[a + 1] = y1; else if (m === d0) p[a] = x0; else if (m === d1) p[a] = x1; else if (m === d4) p[a + 2] = z0; else if (m === d5) p[a + 2] = z1; else p[a + 1] = y0;
    q[a] += (p[a] - q[a]) * 0.45; q[a + 1] += (p[a + 1] - q[a + 1]) * 0.45; q[a + 2] += (p[a + 2] - q[a + 2]) * 0.45;
  }
}

// basket: open box at b = {x,y,z}. Particles inside stay inside, outside stay outside, rim supports what lies across.
export function collideBasket(c, b, homing) {
  const p = c.p, q = c.q, B = L.basket, hw = B.w / 2, hd = B.d / 2, t = 0.016, r = c.rad * 0.7;
  const rim = b.y + B.h, bot = b.y + B.floor;
  for (let k = 0; k < c.n; k++) {
    if (!c.active[k] || c.kin[k]) continue; const a = k * 3;
    const y = p[a + 1]; if (y > rim + r || y < b.y - 0.02) continue;
    const dx = p[a] - b.x, dz = p[a + 2] - b.z, ax = Math.abs(dx), az = Math.abs(dz);
    if (ax < hw && az < hd) {
      const ex = ax - (hw - t - r), ez = az - (hd - t - r), up = rim + r - y;
      let hit = false;
      if (ex > 0 || ez > 0) {
        if (up < 0.022 && up < Math.max(ex, ez) + 0.004) { p[a + 1] = rim + r; }
        else if (ex > ez) p[a] = b.x + Math.sign(dx) * (hw - t - r); else p[a + 2] = b.z + Math.sign(dz) * (hd - t - r);
        hit = true;
      }
      if (p[a + 1] < bot + r) { p[a + 1] = bot + r; hit = true; }
      if (hit) { q[a] += (p[a] - q[a]) * 0.5; q[a + 1] += (p[a + 1] - q[a + 1]) * 0.5; q[a + 2] += (p[a + 2] - q[a + 2]) * 0.5; }
    } else if (!homing) {
      const ox = ax - hw, oz = az - hd;
      if (ox < r && oz < r) {
        if (ox > oz) p[a] = b.x + Math.sign(dx) * (hw + r); else p[a + 2] = b.z + Math.sign(dz) * (hd + r);
        q[a] += (p[a] - q[a]) * 0.35; q[a + 1] += (p[a + 1] - q[a + 1]) * 0.35; q[a + 2] += (p[a + 2] - q[a + 2]) * 0.35;
      }
    }
  }
}

// pull a released cloth into the basket (soft funnel)
export function homeForces(c, b, k) {
  const p = c.p, e = c.ext, B = L.basket, hw = B.w / 2 - 0.05, hd = B.d / 2 - 0.05, rim = b.y + B.h;
  let out = 0;
  for (let i = 0; i < c.n; i++) {
    if (!c.active[i]) continue; const a = i * 3;
    const dx = p[a] - b.x, dz = p[a + 2] - b.z, inside = Math.abs(dx) < hw && Math.abs(dz) < hd;
    if (inside && p[a + 1] > b.y) continue;
    out++;
    const ty = rim + 0.2, d = Math.hypot(dx, dz) || 1, hk = Math.min(1, d / 0.25);
    e[a] += -dx / d * 13 * k * hk; e[a + 2] += -dz / d * 13 * k * hk;
    if (p[a + 1] < ty) e[a + 1] += 9.8 + 9 * k * Math.min(1, (ty - p[a + 1]) / 0.15);
    // damp
    e[a] -= (p[a] - c.q[a]) / H * 3.5; e[a + 1] -= (p[a + 1] - c.q[a + 1]) / H * 2.0; e[a + 2] -= (p[a + 2] - c.q[a + 2]) / H * 3.5;
  }
  return out;
}

// washer with the door open, world frame: front panel with round hole, drum interior
export function collideWasher(c) {
  const p = c.p, q = c.q, r = c.rad * 0.7, P = L.port, D = L.drum;
  for (let k = 0; k < c.n; k++) {
    if (!c.active[k] || c.kin[k]) continue; const a = k * 3;
    const x = p[a], y = p[a + 1], z = p[a + 2];
    if (z > P.z + r || x < -0.3 - r || x > 0.3 + r || y > 0.86 + r) continue;
    const dx = x - D.cx, dy = y - D.cy, dr = Math.hypot(dx, dy) || 1e-6;
    let hit = false;
    if (z <= D.zf - r) {                         // drum interior
      if (dr > D.R - r) { const f = (D.R - r) / dr; p[a] = D.cx + dx * f; p[a + 1] = D.cy + dy * f; hit = true; }
      if (z < D.zb + r) { p[a + 2] = D.zb + r; hit = true; }
    } else if (dr > P.r - r * 0.5) {             // in the wall zone, outside the hole
      const rin = dr - (P.r - r * 0.5);
      if (z > 0.235) { const fz = P.z + r - z; if (rin < fz && rin < 0.03) { const f = (P.r - r * 0.5) / dr; p[a] = D.cx + dx * f; p[a + 1] = D.cy + dy * f; } else p[a + 2] = P.z + r; }
      else { const bz = z - (D.zf - r); if (rin < bz && rin < 0.03) { const f = (P.r - r * 0.5) / dr; p[a] = D.cx + dx * f; p[a + 1] = D.cy + dy * f; } else p[a + 2] = D.zf - r; }
      hit = true;
    }
    if (hit) { q[a] += (p[a] - q[a]) * 0.4; q[a + 1] += (p[a + 1] - q[a + 1]) * 0.4; q[a + 2] += (p[a + 2] - q[a + 2]) * 0.4; }
  }
}

// particle-particle repulsion among cloth piles (sweep along x). items: cloth list in the same frame.
const _ord = [];
export function repel(items, dSelf, dist) {
  let n = 0;
  for (let ci = 0; ci < items.length; ci++) { const c = items[ci]; for (let k = 0; k < c.n; k++) if (c.active[k]) { let o = _ord[n]; if (!o) o = _ord[n] = { c: null, k: 0, x: 0 }; o.c = c; o.k = k; o.x = c.p[k * 3]; n++; } }
  // insertion sort (nearly sorted frame to frame is not guaranteed, n is small)
  for (let i = 1; i < n; i++) { const o = _ord[i]; let j = i - 1; while (j >= 0 && _ord[j].x > o.x) { _ord[j + 1] = _ord[j]; j--; } _ord[j + 1] = o; }
  for (let i = 0; i < n; i++) {
    const A = _ord[i], ca = A.c, a = A.k * 3;
    for (let j = i + 1; j < n; j++) {
      const Bo = _ord[j]; if (Bo.x - A.x > dist) break;
      const cb = Bo.c, b = Bo.k * 3;
      let lim = dist;
      if (ca === cb) { const di = Math.abs((A.k % ca.nx) - (Bo.k % ca.nx)), dj = Math.abs(((A.k / ca.nx) | 0) - ((Bo.k / ca.nx) | 0)); if (di + dj < 3) continue; lim = dSelf; }
      const dx = cb.p[b] - ca.p[a], dy = cb.p[b + 1] - ca.p[a + 1], dz = cb.p[b + 2] - ca.p[a + 2];
      const dd = dx * dx + dy * dy + dz * dz; if (dd >= lim * lim || dd < 1e-10) continue;
      const d = Math.sqrt(dd), wa = ca.kin[A.k] ? 0 : 1, wb = cb.kin[Bo.k] ? 0 : 1, ws = wa + wb; if (!ws) continue;
      const f = (lim - d) / d * 0.5 / ws;
      if (wa) { ca.p[a] -= dx * f; ca.p[a + 1] -= dy * f; ca.p[a + 2] -= dz * f; }
      if (wb) { cb.p[b] += dx * f; cb.p[b + 1] += dy * f; cb.p[b + 2] += dz * f; }
    }
  }
}

// move the grabbed particle toward its target (kinematic, speed-limited)
export function driveGrab(c, tx, ty, tz, maxStep) {
  const k = c.grab; if (k < 0) return; const a = k * 3, p = c.p;
  let dx = tx - p[a], dy = ty - p[a + 1], dz = tz - p[a + 2]; const d = Math.hypot(dx, dy, dz);
  if (d > maxStep) { const f = maxStep / d; dx *= f; dy *= f; dz *= f; }
  c.q[a] = p[a]; c.q[a + 1] = p[a + 1]; c.q[a + 2] = p[a + 2];
  p[a] += dx; p[a + 1] += dy; p[a + 2] += dz;
}
