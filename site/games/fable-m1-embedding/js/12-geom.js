/* Geometry helpers: rounded boxes, lofted rounded-rect rings, filleted prisms, merging. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const G = (EC.geom = {});

  function finish(pos, nor, uv, idx) {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    if (nor) g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    if (!nor) g.computeVertexNormals();
    return g;
  }

  /* Box with every edge rounded by radius r. UVs are planar per face in cm. */
  G.rbox = function (w, h, d, r, n) {
    n = n === undefined ? 3 : n;
    r = Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4);
    const half = [w / 2, h / 2, d / 2];
    const pos = [], nor = [], uv = [], idx = [];
    function axisSamples(a) {
      const out = [];
      if (r <= 0 || n === 0) return [-a, a];
      for (let i = 0; i <= n; i++) out.push(-a + (r * i) / n);
      for (let i = 0; i <= n; i++) out.push(a - r + (r * i) / n);
      return out;
    }
    // faces: [fixed axis, sign, u axis, v axis]
    const faces = [[0, 1, 2, 1], [0, -1, 2, 1], [1, 1, 0, 2], [1, -1, 0, 2], [2, 1, 0, 1], [2, -1, 0, 1]];
    for (let f = 0; f < 6; f++) {
      const fa = faces[f][0], s = faces[f][1], ua = faces[f][2], va = faces[f][3];
      const us = axisSamples(half[ua]), vs = axisSamples(half[va]);
      const base = pos.length / 3;
      for (let j = 0; j < vs.length; j++) for (let i = 0; i < us.length; i++) {
        const p = [0, 0, 0];
        p[fa] = s * half[fa]; p[ua] = us[i]; p[va] = vs[j];
        const qx = Math.max(-half[0] + r, Math.min(half[0] - r, p[0]));
        const qy = Math.max(-half[1] + r, Math.min(half[1] - r, p[1]));
        const qz = Math.max(-half[2] + r, Math.min(half[2] - r, p[2]));
        let nx = p[0] - qx, ny = p[1] - qy, nz = p[2] - qz;
        const l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        nx /= l; ny /= l; nz /= l;
        if (r <= 0) { nx = ny = nz = 0; if (fa === 0) nx = s; else if (fa === 1) ny = s; else nz = s; pos.push(p[0], p[1], p[2]); }
        else pos.push(qx + nx * r, qy + ny * r, qz + nz * r);
        nor.push(nx, ny, nz);
        uv.push(us[i], vs[j]);
      }
      const nu = us.length, nv = vs.length;
      // winding: make it face outward
      const flip = (fa === 0 && s > 0) || (fa === 1 && s > 0) || (fa === 2 && s < 0);
      for (let j = 0; j < nv - 1; j++) for (let i = 0; i < nu - 1; i++) {
        const a = base + j * nu + i, b = a + 1, c = a + nu, e = c + 1;
        if (flip) idx.push(a, c, b, b, c, e); else idx.push(a, b, c, b, e, c);
      }
    }
    return finish(pos, nor, uv, idx);
  };

  /* Outline of a rounded rectangle in the XZ plane, counter-clockwise seen from +y. */
  function rrOutline(hx, hz, r, k) {
    r = Math.max(0, Math.min(r, hx, hz));
    const pts = [];
    const cs = [[hx - r, hz - r, 0], [-(hx - r), hz - r, Math.PI / 2], [-(hx - r), -(hz - r), Math.PI], [hx - r, -(hz - r), Math.PI * 1.5]];
    for (let c = 0; c < 4; c++) for (let i = 0; i <= k; i++) {
      const a = cs[c][2] + (i / k) * (Math.PI / 2);
      // +x toward +z first: angle measured from +x axis toward +z
      pts.push([cs[c][0] + Math.cos(a) * r, cs[c][1] + Math.sin(a) * r]);
    }
    return pts;
  }
  G.rrOutline = rrOutline;

  /* Loft through rings {y, hx, hz, r, x?, z?, sharp?}. Rings go bottom->top for an outward-facing
     skin; pass inward:true for cavities. capBottom/capTop close the ends. */
  G.loft = function (rings, o) {
    o = o || {};
    const k = o.k || 4, M = 4 * (k + 1);
    const pos = [], uv = [], idx = [];
    const first = [], last = [];
    let vAcc = 0;
    for (let i = 0; i < rings.length; i++) {
      const R = rings[i];
      const out = rrOutline(R.hx, R.hz, R.r === undefined ? 0.3 : R.r, k);
      if (i > 0) {
        const P = rings[i - 1];
        vAcc += Math.hypot(R.y - P.y, R.hx - P.hx, R.hz - P.hz);
      }
      const dup = R.sharp && i > 0 && i < rings.length - 1 ? 2 : 1;
      for (let dd = 0; dd < dup; dd++) {
        const base = pos.length / 3;
        let per = 0;
        for (let m = 0; m <= M; m++) {
          const p = out[m % M];
          if (m > 0) { const pp = out[(m - 1) % M]; per += Math.hypot(p[0] - pp[0], p[1] - pp[1]); }
          pos.push(p[0] + (R.x || 0), R.y, p[1] + (R.z || 0));
          uv.push(per, vAcc);
        }
        if (dd === 0) first[i] = base;
        last[i] = base;
      }
    }
    const inward = !!o.inward;
    for (let i = 0; i < rings.length - 1; i++) {
      const a0 = last[i], b0 = first[i + 1];
      for (let m = 0; m < M; m++) {
        const a = a0 + m, b = a0 + m + 1, c = b0 + m, e = b0 + m + 1;
        if (inward) idx.push(a, b, c, b, e, c); else idx.push(a, c, b, b, c, e);
      }
    }
    function cap(ring, up) {
      const out = rrOutline(ring.hx, ring.hz, ring.r === undefined ? 0.3 : ring.r, k);
      const base = pos.length / 3;
      pos.push(ring.x || 0, ring.y, ring.z || 0); uv.push(0, 0);
      for (let m = 0; m < M; m++) { pos.push(out[m][0] + (ring.x || 0), ring.y, out[m][1] + (ring.z || 0)); uv.push(out[m][0], out[m][1]); }
      for (let m = 0; m < M; m++) {
        const a = base + 1 + m, b = base + 1 + ((m + 1) % M);
        if (up) idx.push(base, b, a); else idx.push(base, a, b);
      }
    }
    if (o.capBottom) cap(rings[0], !!inward);
    if (o.capTop) cap(rings[rings.length - 1], !inward);
    return finish(pos, null, uv, idx);
  };

  /* Prism: closed profile [[z,y],...] (counter-clockwise looking from +x toward -x is not required;
     orientation is detected) extruded along x over [x0,x1]. Corners get fillets of radius r
     (per-point override with a third element). skip: array of segment indices left open. */
  G.prism = function (profile, x0, x1, r, o) {
    o = o || {};
    const n = profile.length;
    let area = 0;
    for (let i = 0; i < n; i++) { const a = profile[i], b = profile[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
    const ccw = area > 0;
    const skip = o.skip || [];
    const seg = o.seg || 5;
    // build filleted outline, tagging which original segment each piece belongs to
    const out = []; // {z,y,segIndex}  segIndex = index of the segment *starting* at this vertex (or -1 inside a fillet)
    for (let i = 0; i < n; i++) {
      const p = profile[i], a = profile[(i - 1 + n) % n], b = profile[(i + 1) % n];
      const rad = p[2] === undefined ? r : p[2];
      const v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]];
      const l1 = Math.hypot(v1[0], v1[1]), l2 = Math.hypot(v2[0], v2[1]);
      v1[0] /= l1; v1[1] /= l1; v2[0] /= l2; v2[1] /= l2;
      const dot = v1[0] * v2[0] + v1[1] * v2[1];
      const ang = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (rad <= 0 || ang > Math.PI - 0.02) { out.push({ z: p[0], y: p[1], s: i, e: (i - 1 + n) % n }); continue; }
      const t = Math.min(rad / Math.tan(ang / 2), l1 * 0.45, l2 * 0.45);
      const rr = t * Math.tan(ang / 2);
      const bis = [v1[0] + v2[0], v1[1] + v2[1]];
      const bl = Math.hypot(bis[0], bis[1]);
      const cdist = rr / Math.sin(ang / 2);
      const c = [p[0] + (bis[0] / bl) * cdist, p[1] + (bis[1] / bl) * cdist];
      const s = [p[0] + v1[0] * t, p[1] + v1[1] * t], e = [p[0] + v2[0] * t, p[1] + v2[1] * t];
      let a0 = Math.atan2(s[1] - c[1], s[0] - c[0]), a1 = Math.atan2(e[1] - c[1], e[0] - c[0]);
      let da = a1 - a0;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      for (let j = 0; j <= seg; j++) {
        const aa = a0 + (da * j) / seg;
        out.push({ z: c[0] + Math.cos(aa) * rr, y: c[1] + Math.sin(aa) * rr, s: j === seg ? i : -1, e: j === 0 ? (i - 1 + n) % n : -1 });
      }
    }
    const pos = [], uv = [], idx = [];
    const m = out.length;
    let acc = 0;
    // strip: one pair of vertices per outline point; skipped segments are not connected
    for (let i = 0; i <= m; i++) {
      const p = out[i % m];
      if (i > 0) { const pp = out[(i - 1) % m]; acc += Math.hypot(p.z - pp.z, p.y - pp.y); }
      pos.push(x0, p.y, p.z, x1, p.y, p.z);
      uv.push(x0, acc, x1, acc);
    }
    for (let i = 0; i < m; i++) {
      const p = out[i];
      if (p.s >= 0 && skip.indexOf(p.s) >= 0) continue;
      const a = i * 2, b = a + 1, c = a + 2, e = a + 3;
      if (ccw) idx.push(a, b, c, b, e, c); else idx.push(a, c, b, b, c, e);
    }
    const side = finish(pos, null, uv, idx);
    if (o.noCaps) return side;
    // end caps
    const shape = new T.Shape(out.map(function (p) { return new T.Vector2(p.z, p.y); }));
    const sg = new T.ShapeGeometry(shape);
    const caps = [];
    [x0, x1].forEach(function (xx, k) {
      const g = sg.clone();
      const pa = g.getAttribute('position');
      const np = new Float32Array(pa.count * 3), nn = new Float32Array(pa.count * 3), nu = new Float32Array(pa.count * 2);
      for (let i = 0; i < pa.count; i++) {
        np[i * 3] = xx; np[i * 3 + 1] = pa.getY(i); np[i * 3 + 2] = pa.getX(i);
        nn[i * 3] = k === 0 ? -1 : 1;
        nu[i * 2] = pa.getX(i); nu[i * 2 + 1] = pa.getY(i);
      }
      const id = Array.from(g.getIndex().array);
      // ShapeGeometry is CCW in (z,y); seen from +x that is clockwise -> flip for the +x cap
      const wantFlip = k === 1;
      if (wantFlip) for (let i = 0; i < id.length; i += 3) { const t = id[i]; id[i] = id[i + 2]; id[i + 2] = t; }
      const cg = new T.BufferGeometry();
      cg.setAttribute('position', new T.BufferAttribute(np, 3));
      cg.setAttribute('normal', new T.BufferAttribute(nn, 3));
      cg.setAttribute('uv', new T.BufferAttribute(nu, 2));
      cg.setIndex(id);
      caps.push(cg);
    });
    return G.merge([side, caps[0], caps[1]]);
  };

  /* Horizontal rectangle at height y with rounded-rect holes [{x0,x1,z0,z1,r}]. Faces +y. */
  G.deckWithHoles = function (x0, x1, z0, z1, y, holes) {
    const sh = new T.Shape();
    sh.moveTo(x0, -z0); sh.lineTo(x1, -z0); sh.lineTo(x1, -z1); sh.lineTo(x0, -z1); sh.closePath();
    (holes || []).forEach(function (h) {
      const p = new T.Path();
      const r = h.r || 0.01, a = h.x0, b = h.x1, c = -h.z1, d = -h.z0;
      p.moveTo(a + r, c); p.lineTo(b - r, c); p.quadraticCurveTo(b, c, b, c + r);
      p.lineTo(b, d - r); p.quadraticCurveTo(b, d, b - r, d);
      p.lineTo(a + r, d); p.quadraticCurveTo(a, d, a, d - r);
      p.lineTo(a, c + r); p.quadraticCurveTo(a, c, a + r, c);
      sh.holes.push(p);
    });
    const g = new T.ShapeGeometry(sh, 6);
    // shape is in (x, -z): rotate to lie in XZ facing +y
    const pa = g.getAttribute('position'), ua = g.getAttribute('uv'), na = g.getAttribute('normal');
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), yy = pa.getY(i);
      pa.setXYZ(i, x, y, -yy);
      na.setXYZ(i, 0, 1, 0);
      ua.setXY(i, x, -yy);
    }
    const id = g.getIndex().array;
    // ensure upward winding
    const a = new T.Vector3().fromBufferAttribute(pa, id[0]), b = new T.Vector3().fromBufferAttribute(pa, id[1]), c = new T.Vector3().fromBufferAttribute(pa, id[2]);
    const nrm = b.sub(a).cross(c.sub(a));
    if (nrm.y < 0) for (let i = 0; i < id.length; i += 3) { const t = id[i]; id[i] = id[i + 2]; id[i + 2] = t; }
    return g;
  };

  /* Merge indexed geometries (position, normal, uv). Entries may be geometry or {g, m:Matrix4}. */
  G.merge = function (list) {
    let nv = 0, ni = 0;
    const items = list.map(function (e) { return e.isBufferGeometry ? { g: e } : e; });
    items.forEach(function (e) {
      if (!e.g.getIndex()) {
        const c = e.g.getAttribute('position').count, id = new Array(c);
        for (let i = 0; i < c; i++) id[i] = i;
        e.g.setIndex(id);
      }
      if (!e.g.getAttribute('normal')) e.g.computeVertexNormals();
      nv += e.g.getAttribute('position').count; ni += e.g.getIndex().count;
    });
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
    const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
    let vo = 0, io = 0;
    const v = new T.Vector3(), nm = new T.Matrix3();
    items.forEach(function (e) {
      const p = e.g.getAttribute('position'), n = e.g.getAttribute('normal'), u = e.g.getAttribute('uv');
      if (e.m) nm.getNormalMatrix(e.m);
      const flip = e.m && e.m.determinant() < 0;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i); if (e.m) v.applyMatrix4(e.m);
        pos[(vo + i) * 3] = v.x; pos[(vo + i) * 3 + 1] = v.y; pos[(vo + i) * 3 + 2] = v.z;
        v.fromBufferAttribute(n, i); if (e.m) v.applyMatrix3(nm).normalize();
        nor[(vo + i) * 3] = v.x; nor[(vo + i) * 3 + 1] = v.y; nor[(vo + i) * 3 + 2] = v.z;
        if (u) { uv[(vo + i) * 2] = u.getX(i); uv[(vo + i) * 2 + 1] = u.getY(i); }
      }
      const id = e.g.getIndex().array;
      for (let i = 0; i < id.length; i += 3) {
        idx[io + i] = id[i] + vo;
        idx[io + i + 1] = id[flip ? i + 2 : i + 1] + vo;
        idx[io + i + 2] = id[flip ? i + 1 : i + 2] + vo;
      }
      vo += p.count; io += id.length;
    });
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('normal', new T.BufferAttribute(nor, 3));
    g.setAttribute('uv', new T.BufferAttribute(uv, 2));
    g.setIndex(new T.BufferAttribute(idx, 1));
    return g;
  };

  /* Collects geometry per material and emits one merged mesh per material into a group. */
  function Builder(group) {
    this.group = group;
    this.bins = new Map();
    this.m = new T.Matrix4();
    this.q = new T.Quaternion();
    this.e = new T.Euler();
  }
  Builder.prototype.add = function (mat, geom, x, y, z, rx, ry, rz, sx, sy, sz) {
    const m = new T.Matrix4();
    this.e.set(rx || 0, ry || 0, rz || 0);
    this.q.setFromEuler(this.e);
    m.compose(new T.Vector3(x || 0, y || 0, z || 0), this.q, new T.Vector3(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz));
    let bin = this.bins.get(mat);
    if (!bin) { bin = []; this.bins.set(mat, bin); }
    bin.push({ g: geom, m: m });
    return this;
  };
  Builder.prototype.box = function (mat, w, h, d, x, y, z, r, rx, ry, rz) {
    return this.add(mat, G.rbox(w, h, d, r === undefined ? 0.15 : r, r === 0 ? 0 : 2), x, y, z, rx, ry, rz);
  };
  Builder.prototype.cyl = function (mat, rt, rb, h, x, y, z, rx, ry, rz, seg) {
    return this.add(mat, new T.CylinderGeometry(rt, rb, h, seg || 20), x, y, z, rx, ry, rz);
  };
  Builder.prototype.done = function (o) {
    o = o || {};
    const group = this.group, meshes = [];
    this.bins.forEach(function (bin, mat) {
      const mesh = new T.Mesh(G.merge(bin), mat);
      mesh.castShadow = o.cast !== false && !mat.transparent;
      mesh.receiveShadow = o.receive !== false;
      group.add(mesh);
      meshes.push(mesh);
    });
    this.bins.clear();
    return meshes;
  };
  G.Builder = Builder;

  /* Tapered blade along +y (0..len): width w0->w1 (x), thickness t (z). */
  G.blade = function (len, w0, w1, t0, t1) {
    const g = new T.BoxGeometry(1, 1, 1, 1, 6, 1);
    const p = g.getAttribute('position');
    for (let i = 0; i < p.count; i++) {
      const f = p.getY(i) + 0.5;
      const w = w0 + (w1 - w0) * f, t = t0 + (t1 - t0) * f;
      p.setXYZ(i, p.getX(i) * w, f * len, p.getZ(i) * t);
    }
    g.computeVertexNormals();
    return g;
  };
})();
