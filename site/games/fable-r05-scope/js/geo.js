// Procedural solid geometry: lathe, bevelled extrusion, rounded boxes, pipes ...
// All dimensions are millimetres. Every builder returns a Geo (positions / normals / uvs / indices).
(function () {
  'use strict';
  const S = window.SCOPE;
  const { V, M } = S;
  const RAD = Math.PI / 180;

  class Geo {
    constructor() {
      this.p = []; this.n = []; this.uv = []; this.i = [];
    }
    get vcount() { return this.p.length / 3; }
    vert(px, py, pz, nx, ny, nz, u, v) {
      this.p.push(px, py, pz); this.n.push(nx, ny, nz); this.uv.push(u || 0, v || 0);
      return this.p.length / 3 - 1;
    }
    // Triangles are auto-oriented so that their winding agrees with the vertex normals.
    tri(a, b, c) {
      const p = this.p, n = this.n;
      const ax = p[a * 3], ay = p[a * 3 + 1], az = p[a * 3 + 2];
      const e1x = p[b * 3] - ax, e1y = p[b * 3 + 1] - ay, e1z = p[b * 3 + 2] - az;
      const e2x = p[c * 3] - ax, e2y = p[c * 3 + 1] - ay, e2z = p[c * 3 + 2] - az;
      const cx = e1y * e2z - e1z * e2y, cy = e1z * e2x - e1x * e2z, cz = e1x * e2y - e1y * e2x;
      if (cx * cx + cy * cy + cz * cz < 1e-14) return;
      const sx = n[a * 3] + n[b * 3] + n[c * 3], sy = n[a * 3 + 1] + n[b * 3 + 1] + n[c * 3 + 1], sz = n[a * 3 + 2] + n[b * 3 + 2] + n[c * 3 + 2];
      if (cx * sx + cy * sy + cz * sz >= 0) this.i.push(a, b, c);
      else this.i.push(a, c, b);
    }
    quad(a, b, c, d) { this.tri(a, b, c); this.tri(a, c, d); }
    add(g, m) {
      const base = this.vcount;
      if (!m) {
        for (let k = 0; k < g.p.length; k++) { this.p.push(g.p[k]); this.n.push(g.n[k]); }
      } else {
        const nm = M.normalMatrix(m);
        for (let k = 0; k < g.p.length; k += 3) {
          const x = g.p[k], y = g.p[k + 1], z = g.p[k + 2];
          this.p.push(m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]);
          const nx = g.n[k], ny = g.n[k + 1], nz = g.n[k + 2];
          let ox = nm[0] * nx + nm[3] * ny + nm[6] * nz, oy = nm[1] * nx + nm[4] * ny + nm[7] * nz, oz = nm[2] * nx + nm[5] * ny + nm[8] * nz;
          const l = Math.hypot(ox, oy, oz) || 1;
          this.n.push(ox / l, oy / l, oz / l);
        }
      }
      for (let k = 0; k < g.uv.length; k++) this.uv.push(g.uv[k]);
      const det = m ? m[0] * (m[5] * m[10] - m[6] * m[9]) - m[4] * (m[1] * m[10] - m[2] * m[9]) + m[8] * (m[1] * m[6] - m[2] * m[5]) : 1;
      if (det >= 0) for (let k = 0; k < g.i.length; k++) this.i.push(g.i[k] + base);
      else for (let k = 0; k < g.i.length; k += 3) this.i.push(g.i[k] + base, g.i[k + 2] + base, g.i[k + 1] + base);
      return this;
    }
    xf(m) {
      const g = new Geo();
      g.add(this, m);
      return g;
    }
    at(x, y, z) { return this.xf(M.translation(x, y, z)); }
    uvScale(su, sv) {
      for (let k = 0; k < this.uv.length; k += 2) { this.uv[k] *= su; this.uv[k + 1] *= sv; }
      return this;
    }
    build() {
      const positions = new Float32Array(this.p), normals = new Float32Array(this.n), uvs = new Float32Array(this.uv);
      const indices = new Uint32Array(this.i);
      const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
      for (let k = 0; k < positions.length; k += 3) {
        for (let a = 0; a < 3; a++) {
          const v = positions[k + a];
          if (v < min[a]) min[a] = v;
          if (v > max[a]) max[a] = v;
        }
      }
      return { positions, normals, uvs, indices, min, max };
    }
  }

  // ---------- profile helpers (2D) ----------
  // points on a circular arc; angles in degrees, measured from +X towards +Y
  function arc(cx, cy, r, a0, a1, n) {
    const out = [];
    n = n || Math.max(2, Math.ceil(Math.abs(a1 - a0) / 15));
    for (let k = 0; k <= n; k++) {
      const a = (a0 + ((a1 - a0) * k) / n) * RAD;
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return out;
  }

  // ---------- lathe ----------
  // pts: [[r, y], ...]. Walk the profile so that the outside is on the right hand side
  // (outer walls go up, inner bores go down). Corners sharper than `crease` stay crisp.
  function lathe(pts, opts = {}) {
    const seg = opts.seg || 48, crease = (opts.crease || 32) * RAD;
    const a0 = opts.a0 || 0, a1 = opts.a1 === undefined ? Math.PI * 2 : opts.a1;
    const P = [];
    for (const p of pts) {
      const q = P[P.length - 1];
      if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6) P.push(p);
    }
    const nseg = P.length - 1;
    const sn = [];
    for (let k = 0; k < nseg; k++) {
      const dr = P[k + 1][0] - P[k][0], dy = P[k + 1][1] - P[k][1], l = Math.hypot(dr, dy) || 1;
      sn.push([dy / l, -dr / l]);
    }
    const closed = Math.hypot(P[0][0] - P[nseg][0], P[0][1] - P[nseg][1]) < 1e-6;
    // per profile point: normal for the incoming segment and for the outgoing segment
    const nin = [], nout = [];
    const blend = (a, b) => {
      const d = a[0] * b[0] + a[1] * b[1];
      if (Math.acos(Math.max(-1, Math.min(1, d))) < crease) {
        const x = a[0] + b[0], y = a[1] + b[1], l = Math.hypot(x, y) || 1;
        return [[x / l, y / l], [x / l, y / l]];
      }
      return [a, b];
    };
    for (let k = 0; k <= nseg; k++) {
      let a = k > 0 ? sn[k - 1] : closed ? sn[nseg - 1] : sn[0];
      let b = k < nseg ? sn[k] : closed ? sn[0] : sn[nseg - 1];
      const r = blend(a, b);
      nin.push(r[0]); nout.push(r[1]);
    }
    const g = new Geo();
    const len = [0];
    for (let k = 0; k < nseg; k++) len.push(len[k] + Math.hypot(P[k + 1][0] - P[k][0], P[k + 1][1] - P[k][1]));
    const ring = (k, nrm) => {
      const base = g.vcount;
      for (let j = 0; j <= seg; j++) {
        const t = a0 + ((a1 - a0) * j) / seg, c = Math.cos(t), s = Math.sin(t);
        g.vert(P[k][0] * c, P[k][1], P[k][0] * s, nrm[0] * c, nrm[1], nrm[0] * s, j / seg, len[k]);
      }
      return base;
    };
    for (let k = 0; k < nseg; k++) {
      if (P[k][0] < 1e-6 && P[k + 1][0] < 1e-6) continue;
      const A = ring(k, nout[k]), B = ring(k + 1, nin[k + 1]);
      for (let j = 0; j < seg; j++) g.quad(A + j, A + j + 1, B + j + 1, B + j);
    }
    return g;
  }

  // closed tube / ring with optional edge chamfer `b`
  function tube(ro, ri, h, opts = {}) {
    const b = Math.min(opts.bevel || 0, (ro - ri) / 2 - 1e-3, h / 2 - 1e-3);
    let pts;
    if (b > 0.01) {
      pts = [[ri, 0], [ro - b, 0], ...arc(ro - b, b, b, -90, 0, 3), ...arc(ro - b, h - b, b, 0, 90, 3), [ri, h], [ri, 0]];
    } else pts = [[ri, 0], [ro, 0], [ro, h], [ri, h], [ri, 0]];
    if (ri <= 1e-6) pts.pop();
    return lathe(pts, opts);
  }
  // solid cylinder along +Y from y=0..h, rounded edges
  function cyl(r, h, opts = {}) {
    return tube(r, 0, h, opts);
  }
  function sphere(r, opts = {}) {
    return lathe(arc(0, 0, r, -90, 90, opts.rings || 16), opts);
  }
  function torus(R, r, opts = {}) {
    return lathe(arc(R, 0, r, -180, 180, opts.rings || 14), opts);
  }

  // ---------- outlines (2D polygons with normals) ----------
  // corners: [[x, y, radius], ...] counter-clockwise. Returns [{x, y, nx, ny}, ...]
  function roundedPoly(corners, q = 6) {
    const n = corners.length, out = [];
    for (let i = 0; i < n; i++) {
      const P0 = corners[(i + n - 1) % n], P1 = corners[i], P2 = corners[(i + 1) % n];
      let d0 = [P1[0] - P0[0], P1[1] - P0[1]], d1 = [P2[0] - P1[0], P2[1] - P1[1]];
      const l0 = Math.hypot(d0[0], d0[1]), l1 = Math.hypot(d1[0], d1[1]);
      d0 = [d0[0] / l0, d0[1] / l0]; d1 = [d1[0] / l1, d1[1] / l1];
      const n0 = [d0[1], -d0[0]], n1 = [d1[1], -d1[0]];
      const phi = Math.atan2(d0[0] * d1[1] - d0[1] * d1[0], d0[0] * d1[0] + d0[1] * d1[1]);
      let r = P1[2] || 0;
      if (Math.abs(phi) < 1e-4) { out.push({ x: P1[0], y: P1[1], nx: n0[0], ny: n0[1] }); continue; }
      const tmax = Math.min(l0, l1) * 0.499;
      let t = r * Math.tan(Math.abs(phi) / 2);
      if (t > tmax) { t = tmax; r = t / Math.tan(Math.abs(phi) / 2); }
      if (r < 1e-4) {
        out.push({ x: P1[0], y: P1[1], nx: n0[0], ny: n0[1] });
        out.push({ x: P1[0], y: P1[1], nx: n1[0], ny: n1[1] });
        continue;
      }
      const sg = phi > 0 ? 1 : -1;
      const A = [P1[0] - d0[0] * t, P1[1] - d0[1] * t];
      const C = [A[0] - sg * r * n0[0], A[1] - sg * r * n0[1]];
      const steps = Math.max(1, Math.ceil((Math.abs(phi) / (Math.PI / 2)) * q));
      for (let k = 0; k <= steps; k++) {
        const a = (phi * k) / steps, c = Math.cos(a), s = Math.sin(a);
        const nx = n0[0] * c - n0[1] * s, ny = n0[0] * s + n0[1] * c;
        out.push({ x: C[0] + sg * r * nx, y: C[1] + sg * r * ny, nx, ny });
      }
    }
    return out;
  }
  function roundedRect(w, h, r, q) {
    const x = w / 2, y = h / 2;
    return roundedPoly([[-x, -y, r], [x, -y, r], [x, y, r], [-x, y, r]], q);
  }
  // outline from a polar function r(theta); normals by finite differences
  function polarOutline(fn, n) {
    const pts = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2, r = fn(a);
      pts.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    return pts.map((p, k) => {
      const a = pts[(k + n - 1) % n], b = pts[(k + 1) % n];
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      return { x: p[0], y: p[1], nx: dy / l, ny: -dx / l };
    });
  }

  // ear clipping; pts: [[x,y],...] CCW, returns index triples
  function triangulate(pts) {
    const n = pts.length, idx = [];
    for (let k = 0; k < n; k++) idx.push(k);
    const out = [];
    const area = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const inside = (a, b, c, p) => area(a, b, p) >= -1e-9 && area(b, c, p) >= -1e-9 && area(c, a, p) >= -1e-9;
    let guard = 0;
    while (idx.length > 3 && guard++ < 20000) {
      let cut = false;
      for (let k = 0; k < idx.length; k++) {
        const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length];
        const a = pts[i0], b = pts[i1], c = pts[i2];
        const ar = area(a, b, c);
        if (ar < 1e-9) { if (ar > -1e-9) { idx.splice(k, 1); cut = true; break; } continue; }
        let ok = true;
        for (let m = 0; m < idx.length; m++) {
          const im = idx[m];
          if (im === i0 || im === i1 || im === i2) continue;
          const p = pts[im];
          if ((p[0] === a[0] && p[1] === a[1]) || (p[0] === b[0] && p[1] === b[1]) || (p[0] === c[0] && p[1] === c[1])) continue;
          if (inside(a, b, c, p)) { ok = false; break; }
        }
        if (ok) { out.push(i0, i1, i2); idx.splice(k, 1); cut = true; break; }
      }
      if (!cut) { idx.splice(0, 1); }
    }
    if (idx.length === 3) out.push(idx[0], idx[1], idx[2]);
    return out;
  }

  // ---------- bevelled extrusion ----------
  // hole outline helpers: clockwise loops whose normals point into the hole (away from the solid)
  function circleHole(cx, cy, r, n = 48) {
    const out = [];
    for (let k = 0; k < n; k++) {
      const a = -(k / n) * Math.PI * 2;
      out.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), nx: -Math.cos(a), ny: -Math.sin(a) });
    }
    return out;
  }
  function polyHole(corners, q) {
    let a = 0;
    for (let k = 0; k < corners.length; k++) { const p = corners[k], c = corners[(k + 1) % corners.length]; a += p[0] * c[1] - c[0] * p[1]; }
    return roundedPoly(a > 0 ? corners.slice().reverse() : corners, q);
  }
  // splice a hole loop into an outer loop through a zero-width bridge (for cap triangulation)
  function bridge(poly, hole) {
    let hi = 0;
    for (let k = 1; k < hole.length; k++) if (hole[k][0] > hole[hi][0]) hi = k;
    const H = hole[hi];
    const same = (p, q) => Math.abs(p[0] - q[0]) < 1e-7 && Math.abs(p[1] - q[1]) < 1e-7;
    const orient = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    const cross = (p1, p2, p3, p4) => {
      const d1 = orient(p3, p4, p1), d2 = orient(p3, p4, p2), d3 = orient(p1, p2, p3), d4 = orient(p1, p2, p4);
      return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
    };
    const segs = [];
    for (let k = 0; k < poly.length; k++) segs.push([poly[k], poly[(k + 1) % poly.length]]);
    for (let k = 0; k < hole.length; k++) segs.push([hole[k], hole[(k + 1) % hole.length]]);
    let best = -1, bd = Infinity;
    for (let k = 0; k < poly.length; k++) {
      const P = poly[k], d = (P[0] - H[0]) * (P[0] - H[0]) + (P[1] - H[1]) * (P[1] - H[1]);
      if (d >= bd) continue;
      let ok = true;
      for (const [u, v] of segs) {
        if (same(u, P) || same(v, P) || same(u, H) || same(v, H)) continue;
        if (cross(H, P, u, v)) { ok = false; break; }
      }
      if (ok) { bd = d; best = k; }
    }
    if (best < 0) best = 0;
    const out = poly.slice(0, best + 1);
    for (let k = 0; k <= hole.length; k++) out.push(hole[(hi + k) % hole.length]);
    out.push(poly[best]);
    for (let k = best + 1; k < poly.length; k++) out.push(poly[k]);
    return out;
  }

  // outline in the XY plane (CCW), solid spans z = 0..depth. bevel = rounded edge radius.
  // opts.holes: array of clockwise hole outlines (see circleHole / polyHole).
  function extrude(outline, depth, opts = {}) {
    const g = new Geo();
    const bF = opts.bevelFront === undefined ? opts.bevel || 0 : opts.bevelFront;
    const bB = opts.bevelBack === undefined ? opts.bevel || 0 : opts.bevelBack;
    const bs = opts.bevelSeg || 3;
    const loops = [outline, ...(opts.holes || [])];
    for (const L of loops) {
      const N = L.length;
      const per = [0];
      for (let k = 0; k < N; k++) {
        const a = L[k], b = L[(k + 1) % N];
        per.push(per[k] + Math.hypot(b.x - a.x, b.y - a.y));
      }
      const rings = [];
      const addRing = (z, off, psi) => {
        const c = Math.cos(psi), s = Math.sin(psi), base = g.vcount;
        for (let k = 0; k <= N; k++) {
          const o = L[k % N];
          g.vert(o.x - o.nx * off, o.y - o.ny * off, z, o.nx * c, o.ny * c, s, per[k], z);
        }
        rings.push(base);
      };
      if (bB > 1e-4) for (let k = 0; k <= bs; k++) { const psi = (-90 + (90 * k) / bs) * RAD; addRing(bB + bB * Math.sin(psi), bB * (1 - Math.cos(psi)), psi); }
      else addRing(0, 0, 0);
      if (bF > 1e-4) for (let k = 0; k <= bs; k++) { const psi = ((90 * k) / bs) * RAD; addRing(depth - bF + bF * Math.sin(psi), bF * (1 - Math.cos(psi)), psi); }
      else addRing(depth, 0, 0);
      for (let r = 0; r < rings.length - 1; r++) {
        const A = rings[r], B = rings[r + 1];
        for (let k = 0; k < N; k++) g.quad(A + k, A + k + 1, B + k + 1, B + k);
      }
    }
    const cap = (z, off, nz) => {
      const lp = loops.map((L) => {
        const pts = [];
        for (let k = 0; k < L.length; k++) {
          const o = L[k], x = o.x - o.nx * off, y = o.y - o.ny * off;
          const q = pts[pts.length - 1];
          if (q && Math.hypot(q[0] - x, q[1] - y) < 1e-5) continue;
          pts.push([x, y]);
        }
        if (pts.length > 1 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 1e-5) pts.pop();
        return pts;
      });
      let poly = lp[0];
      const maxX = (h) => h.reduce((m, p) => Math.max(m, p[0]), -Infinity);
      for (const h of lp.slice(1).sort((u, v) => maxX(v) - maxX(u))) poly = bridge(poly, h);
      const base = g.vcount;
      for (const p of poly) g.vert(p[0], p[1], z, 0, 0, nz, p[0], p[1]);
      const t = triangulate(poly);
      for (let k = 0; k < t.length; k += 3) g.tri(base + t[k], base + t[k + 1], base + t[k + 2]);
    };
    if (opts.capBack !== false) cap(0, bB, -1);
    if (opts.capFront !== false) cap(depth, bF, 1);
    return g;
  }

  // rounded box centred on the origin; r rounds all 12 edges
  function rbox(w, h, d, r = 1, q = 4) {
    r = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
    const g = extrude(roundedRect(w, h, r, q), d, { bevel: r, bevelSeg: Math.max(2, Math.round(q * 0.75)) });
    return g.at(0, 0, -d / 2);
  }
  // sharp box
  function box(w, h, d) {
    return extrude(roundedRect(w, h, 0), d, {}).at(0, 0, -d / 2);
  }
  // extrusion of an XZ plan outline upwards (Y), from y0 to y0+h. Plan given as corners [[x,z,r],...]
  // (counter-clockwise when seen from above with +Z towards the viewer is NOT required: it is auto-fixed).
  function slab(corners, y0, h, opts = {}) {
    // map plan (x, z) -> outline (x, -z) so that +Z extrusion becomes +Y after rotating -90deg about X
    let pts = corners.map((c) => [c[0], -c[1], c[2] || 0]);
    let a = 0;
    for (let k = 0; k < pts.length; k++) { const p = pts[k], q = pts[(k + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
    if (a < 0) pts.reverse();
    const o2 = Object.assign({}, opts);
    // holes: [{ circle: [x, z, r] }] or corner lists [[x, z, r], ...] in plan coordinates
    if (opts.holes) o2.holes = opts.holes.map((hl) => (hl.circle ? circleHole(hl.circle[0], -hl.circle[1], hl.circle[2], hl.n || 48) : polyHole(hl.map((c) => [c[0], -c[1], c[2] || 0]), opts.q || 6)));
    const g = extrude(roundedPoly(pts, opts.q || 6), h, o2);
    return g.xf(M.mul(M.translation(0, y0, 0), M.rotX(-Math.PI / 2)));
  }
  // extrusion of a side profile given in the (z, y) plane along X, centred on x = 0 (width w)
  function sideExtrude(corners, w, opts = {}) {
    // outline coordinates (u, v) = (-z, y); extruded along +Z then rotated so that outline-u -> -Z world... :
    let pts = corners.map((c) => [-c[0], c[1], c[2] || 0]);
    let a = 0;
    for (let k = 0; k < pts.length; k++) { const p = pts[k], q = pts[(k + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
    if (a < 0) pts.reverse();
    const o2 = Object.assign({}, opts);
    if (opts.holes) o2.holes = opts.holes.map((hl) => (hl.circle ? circleHole(-hl.circle[0], hl.circle[1], hl.circle[2], hl.n || 48) : polyHole(hl.map((c) => [-c[0], c[1], c[2] || 0]), opts.q || 6)));
    const g = extrude(roundedPoly(pts, opts.q || 6), w, o2);
    // local (u, v, e) -> world (x = e - w/2, y = v, z = -u)
    const m = M.create();
    m[0] = 0; m[1] = 0; m[2] = -1;
    m[4] = 0; m[5] = 1; m[6] = 0;
    m[8] = 1; m[9] = 0; m[10] = 0;
    m[12] = -w / 2;
    return g.xf(m);
  }

  // knob with straight grooves (flutes); axis +Y, y = 0..h
  function fluted(r, h, flutes, depth, opts = {}) {
    const n = flutes * 6;
    const o = polarOutline((a) => {
      const t = (a * flutes) / (Math.PI * 2);
      const f = t - Math.floor(t);
      const groove = Math.pow(Math.max(0, Math.cos((f - 0.5) * Math.PI * 2) * 0.5 + 0.5), 1.6);
      return r - depth * groove;
    }, n);
    const g = extrude(o, h, { bevel: opts.bevel === undefined ? Math.min(1.2, h * 0.2) : opts.bevel, bevelSeg: 2 });
    return g.xf(M.rotX(-Math.PI / 2));
  }

  // pipe along a smoothed polyline (Catmull-Rom), capped
  function pipe(points, r, opts = {}) {
    const seg = opts.seg || 10, sub = opts.sub || 8;
    const P = [];
    const cr = (p0, p1, p2, p3, t) => {
      const t2 = t * t, t3 = t2 * t;
      return [0, 1, 2].map((a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3));
    };
    for (let k = 0; k < points.length - 1; k++) {
      const p0 = points[Math.max(0, k - 1)], p1 = points[k], p2 = points[k + 1], p3 = points[Math.min(points.length - 1, k + 2)];
      for (let s = 0; s < sub; s++) P.push(cr(p0, p1, p2, p3, s / sub));
    }
    P.push(points[points.length - 1]);
    const g = new Geo();
    let nrm = null, prevT = null, dist = 0;
    const rings = [];
    for (let k = 0; k < P.length; k++) {
      const t = V.norm(V.sub(P[Math.min(P.length - 1, k + 1)], P[Math.max(0, k - 1)]));
      if (!nrm) {
        nrm = V.norm(V.cross(t, Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
      } else {
        nrm = V.norm(V.sub(nrm, V.scale(t, V.dot(nrm, t))));
      }
      prevT = t;
      const b = V.cross(t, nrm);
      if (k > 0) dist += V.len(V.sub(P[k], P[k - 1]));
      const base = g.vcount;
      for (let j = 0; j <= seg; j++) {
        const a = (j / seg) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
        const nx = nrm[0] * c + b[0] * s, ny = nrm[1] * c + b[1] * s, nz = nrm[2] * c + b[2] * s;
        g.vert(P[k][0] + nx * r, P[k][1] + ny * r, P[k][2] + nz * r, nx, ny, nz, j / seg, dist);
      }
      rings.push(base);
    }
    for (let k = 0; k < rings.length - 1; k++) for (let j = 0; j < seg; j++) g.quad(rings[k] + j, rings[k] + j + 1, rings[k + 1] + j + 1, rings[k + 1] + j);
    // flat caps
    const capAt = (k, sign) => {
      const t = V.scale(V.norm(V.sub(P[Math.min(P.length - 1, k + 1)], P[Math.max(0, k - 1)])), sign);
      const c = g.vert(P[k][0], P[k][1], P[k][2], t[0], t[1], t[2], 0, 0);
      const base = g.vcount;
      for (let j = 0; j <= seg; j++) {
        const q = rings[k] + j;
        g.vert(g.p[q * 3], g.p[q * 3 + 1], g.p[q * 3 + 2], t[0], t[1], t[2], 0, 0);
      }
      for (let j = 0; j < seg; j++) g.tri(c, base + j, base + j + 1);
    };
    capAt(0, -1); capAt(P.length - 1, 1);
    return g;
  }

  // flat rectangle in the XZ plane facing +Y, uv 0..1 (u along +X, v along -Z so text reads from the front)
  function plane(w, d) {
    const g = new Geo();
    const a = g.vert(-w / 2, 0, d / 2, 0, 1, 0, 0, 1), b = g.vert(w / 2, 0, d / 2, 0, 1, 0, 1, 1);
    const c = g.vert(w / 2, 0, -d / 2, 0, 1, 0, 1, 0), e = g.vert(-w / 2, 0, -d / 2, 0, 1, 0, 0, 0);
    g.quad(a, b, c, e);
    return g;
  }
  // flat disc / annulus facing +Y
  function disc(ro, ri = 0, seg = 48) {
    const g = new Geo();
    for (let j = 0; j <= seg; j++) {
      const a = (j / seg) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      g.vert(ri * c, 0, ri * s, 0, 1, 0, 0.5 + (ri / ro) * 0.5 * c, 0.5 + (ri / ro) * 0.5 * s);
      g.vert(ro * c, 0, ro * s, 0, 1, 0, 0.5 + 0.5 * c, 0.5 + 0.5 * s);
    }
    for (let j = 0; j < seg; j++) g.quad(j * 2, j * 2 + 1, j * 2 + 3, j * 2 + 2);
    return g;
  }

  // n copies of g around the Y axis
  function ringOf(g, n, phase = 0) {
    const out = new Geo();
    for (let k = 0; k < n; k++) out.add(g, M.rotY(phase + (k / n) * Math.PI * 2));
    return out;
  }
  function merge(...gs) {
    const out = new Geo();
    for (const g of gs) if (g) out.add(g);
    return out;
  }

  S.Geo = Geo;
  S.GEO = { arc, lathe, tube, cyl, sphere, torus, roundedPoly, roundedRect, polarOutline, circleHole, polyHole, extrude, rbox, box, slab, sideExtrude, fluted, pipe, plane, disc, ringOf, merge, triangulate };
})();
