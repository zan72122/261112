// Scene graph nodes, the material library and small part-building helpers.
(function () {
  'use strict';
  const S = window.SCOPE;
  const { M, GEO, Geo, hex } = S;
  const RAD = Math.PI / 180;

  class Node {
    constructor(name, parent, base) {
      this.name = name; this.parent = parent || null;
      this.base = base || M.create();
      this.offset = [0, 0, 0];           // extra translation in the node's own (base) frame, used for "explode"
      this.spinAxis = [0, 1, 0]; this.spin = 0;
      this.local = M.create(); this.world = M.create();
      this.version = 0; this.dirty = true; this.children = [];
      if (parent) parent.children.push(this);
    }
    setOffset(x, y, z) {
      const o = this.offset;
      if (Math.abs(o[0] - x) + Math.abs(o[1] - y) + Math.abs(o[2] - z) > 1e-5) { o[0] = x; o[1] = y; o[2] = z; this.dirty = true; }
    }
    setSpin(a) { if (Math.abs(a - this.spin) > 1e-6) { this.spin = a; this.dirty = true; } }
    // returns true when anything below changed
    update(parentChanged) {
      let changed = this.dirty || parentChanged;
      if (changed) {
        let l = this.base;
        const o = this.offset;
        if (o[0] || o[1] || o[2]) l = M.multiply(new Float32Array(16), l, M.translation(o[0], o[1], o[2]));
        if (this.spin) l = M.multiply(new Float32Array(16), l, M.rotation(this.spinAxis, this.spin));
        this.local = l;
        this.world = this.parent ? M.multiply(new Float32Array(16), this.parent.world, l) : M.copy(l);
        this.version++; this.dirty = false;
      }
      let any = changed;
      for (const c of this.children) any = c.update(changed) || any;
      return any;
    }
  }

  // ---------- materials (linear colour, metal/rough PBR) ----------
  function materials() {
    return {
      floor: { color: hex('#a9a7a3'), rough: 0.9, finish: 7 },
      paint: { color: hex('#e7e4dd'), rough: 0.42, coat: 0.42, coatRough: 0.13, finish: 1, bump: 0.045 },
      paintDark: { color: hex('#59626c'), rough: 0.46, coat: 0.30, coatRough: 0.2, finish: 1, bump: 0.045 },
      anod: { color: hex('#131417'), metal: 0.9, rough: 0.40, finish: 2 },
      anodSatin: { color: hex('#1d1e22'), metal: 0.9, rough: 0.52, finish: 2 },
      blackTex: { color: hex('#18191c'), rough: 0.72, finish: 5, bump: 0.22 },
      stageTop: { color: hex('#1b1c1f'), rough: 0.34, coat: 0.28, coatRough: 0.22 },
      chrome: { color: [0.94, 0.94, 0.95], metal: 1, rough: 0.07 },
      chromeSoft: { color: [0.92, 0.92, 0.93], metal: 1, rough: 0.16, finish: 2 },
      steel: { color: [0.78, 0.79, 0.80], metal: 1, rough: 0.30, finish: 2 },
      brass: { color: [0.90, 0.73, 0.40], metal: 1, rough: 0.25, finish: 2 },
      blade: { color: [0.16, 0.17, 0.20], metal: 1, rough: 0.34, keep: true },
      mirror: { color: [0.97, 0.97, 0.98], metal: 1, rough: 0.02, keep: true },
      rubber: { color: hex('#111112'), rough: 0.86, finish: 5, bump: 0.16 },
      knobGrey: { color: hex('#25272b'), rough: 0.58 },
      plasticGrey: { color: hex('#2b2d32'), rough: 0.55 },
      knurl: { color: hex('#16171a'), metal: 0.9, rough: 0.42, finish: 3, bump: 0.9 },
      knurlChrome: { color: [0.88, 0.88, 0.89], metal: 1, rough: 0.24, finish: 3, bump: 0.9 },
      ribs: { color: hex('#1e1f23'), rough: 0.62, finish: 4, bump: 0.9 },
      camBody: { color: hex('#28303b'), metal: 0.85, rough: 0.38, finish: 2 },
      white: { color: hex('#f1f0ec'), rough: 0.5 },
      led: { color: [0.02, 0.02, 0.02], rough: 0.4, emissive: [0.4, 6.0, 1.6], cast: false, keep: true },
      lampGlow: { color: [0.02, 0.02, 0.02], rough: 1, emissive: [9.5, 7.6, 5.0], cast: false, keep: true },
      lampCore: { color: [0.02, 0.02, 0.02], rough: 1, emissive: [26, 20, 12], cast: false, keep: true },
      lens: { type: 'glass', tint: [0.95, 0.99, 0.975], refr: 0.10, coating: [0.50, 0.38, 0.85], f0: 0.03, body: 0.5 },
      lensGreen: { type: 'glass', tint: [0.96, 0.99, 0.97], refr: 0.10, coating: [0.40, 0.85, 0.55], f0: 0.03, body: 0.5 },
      window: { type: 'glass', tint: [0.97, 0.99, 0.98], refr: 0.03, coating: [0.8, 0.8, 1.0], f0: 0.05, body: 0.3 },
      prism: { type: 'glass', tint: [0.88, 0.96, 1.0], refr: 0.07, coating: [0.7, 0.85, 1.0], f0: 0.07, body: 1.0 },
      slideGlass: { type: 'glass', tint: [0.93, 0.985, 0.955], refr: 0.006, coating: [1, 1, 1], f0: 0.05, body: 1.0 },
    };
  }
  const layerOf = (m) => (m.type === 'glass' ? 'glass' : m.type === 'decal' ? 'decal' : m.type === 'beam' ? 'beam' : 'opaque');

  // ---------- small geometry helpers ----------
  const AXIS = {
    px: M.rotZ(-Math.PI / 2), nx: M.rotZ(Math.PI / 2),   // lathe axis (+Y) -> +X / -X
    pz: M.rotX(Math.PI / 2), nz: M.rotX(-Math.PI / 2),   // -> +Z / -Z
  };
  // knurled ring: uv prepared for the diamond-knurl / rib shader finishes
  function knurlTube(ro, ri, h, opts = {}) {
    const teeth = Math.max(12, Math.round((2 * Math.PI * ro) / (opts.pitch || 1.15)));
    const g = GEO.tube(ro, ri, h, { bevel: opts.bevel === undefined ? 0.6 : opts.bevel, seg: opts.seg || 64 });
    g.uvScale(teeth, teeth / (2 * Math.PI * ro));
    return g;
  }
  // cylindrical band carrying a text texture; the texture centre faces local +Z, top of the image is +Y
  function band(r, y0, h, seg = 64, r1) {
    const g = GEO.lathe([[r, y0], [r1 === undefined ? r : r1, y0 + h]], { seg });
    const len = Math.hypot(h, (r1 === undefined ? r : r1) - r);
    for (let k = 0; k < g.uv.length; k += 2) { g.uv[k] = 0.75 - g.uv[k]; g.uv[k + 1] = 1 - g.uv[k + 1] / len; }
    return g;
  }
  // lens: radius r, edge thickness e, sagitta of the lower / upper surface (0 = flat). Centred on y = 0.
  function lensGeo(r, e, sagLo, sagHi, seg = 40) {
    const pts = [];
    const cap = (sag, sign) => {
      const out = [];
      if (sag < 1e-3) { out.push([0, sign * e / 2], [r, sign * e / 2]); return out; }
      const Rs = (r * r + sag * sag) / (2 * sag), tm = Math.asin(Math.min(1, r / Rs)), n = 8;
      for (let k = 0; k <= n; k++) { const t = (tm * k) / n; out.push([Rs * Math.sin(t), sign * (e / 2 + sag - Rs * (1 - Math.cos(t)))]); }
      return out;
    };
    pts.push(...cap(sagLo, -1));
    pts.push(...cap(sagHi, 1).reverse());
    return GEO.lathe(pts, { seg, crease: 40 });
  }
  // flat two-sided annular sector in the XZ plane (iris blade)
  function sector(r0, r1, a0, a1, n = 14) {
    const g = new Geo();
    for (const ny of [1, -1]) {
      const base = g.vcount;
      for (let k = 0; k <= n; k++) {
        const a = a0 + ((a1 - a0) * k) / n, c = Math.cos(a), s = Math.sin(a);
        g.vert(r0 * c, 0, r0 * s, 0, ny, 0, k / n, 0); g.vert(r1 * c, 0, r1 * s, 0, ny, 0, k / n, 1);
      }
      for (let k = 0; k < n; k++) g.quad(base + k * 2, base + k * 2 + 1, base + k * 2 + 3, base + k * 2 + 2);
    }
    return g;
  }

  // ---------- model builder context ----------
  class Builder {
    constructor(R) {
      this.R = R; this.items = []; this.parts = {}; this.nodes = [];
      this.root = new Node('root', null);
      this.MAT = materials();
    }
    tex(canvas, opts) { return this.R.texture(canvas, Object.assign({ srgb: true }, opts || {})); }
    part(id, info) {
      const p = Object.assign({ id, tops: [], items: [], t: 0, hi: 0, xray: 0, inner: false, explode: 1 }, info);
      this.parts[id] = p;
      return p;
    }
    // node that belongs to a part; `ex` = explode vector in the node's own frame (only for the part's top nodes)
    node(part, name, parent, base, ex) {
      const n = new Node(name, parent || this.root, base);
      this.nodes.push(n);
      if (part && ex) part.tops.push({ node: n, ex });
      return n;
    }
    batch(part, node) { return new Batch(this, part, node); }
  }
  class Batch {
    constructor(b, part, node) { this.b = b; this.part = part; this.node = node; this.map = new Map(); }
    add(mat, geo, m) {
      let g = this.map.get(mat);
      if (!g) { g = new Geo(); this.map.set(mat, g); }
      g.add(geo, m);
      return this;
    }
    done() {
      const out = [];
      for (const [mat, g] of this.map) {
        if (!g.i.length) continue;
        const mesh = this.b.R.mesh(g.build());
        const layer = layerOf(mat), p = this.part;
        const it = {
          mesh, material: mat, node: this.node, part: p ? p.id : null, layer, visible: true,
          cast: mat.cast !== false && layer === 'opaque', xray: 0, hi: 0,
          canXray: !!(p && p.xray) && layer === 'opaque' && !mat.keep,
          inner: !!(p && p.inner), version: -1,
          world: this.node.world, normalMat: new Float32Array(9), center: [0, 0, 0],
          lc: [(mesh.min[0] + mesh.max[0]) / 2, (mesh.min[1] + mesh.max[1]) / 2, (mesh.min[2] + mesh.max[2]) / 2],
        };
        this.b.items.push(it);
        if (p) p.items.push(it);
        out.push(it);
      }
      this.map.clear();
      return out;
    }
  }

  // Iris diaphragm made of N pivoting blades. set(a) = clear aperture radius in mm.
  function buildIris(b, part, parent, y, R0, W, N) {
    const Rp = R0 + W / 2, PHI = 118 * RAD, blades = [];
    for (let k = 0; k < N; k++) {
      const th = (k / N) * Math.PI * 2;
      const pv = [Rp * Math.cos(th), 0, Rp * Math.sin(th)];
      const n = b.node(part, 'blade', parent, M.translation(pv[0], y + (k % 5) * 0.06 + (k % 2) * 0.03, pv[2]));
      b.batch(part, n).add(b.MAT.blade, sector(R0, R0 + W, th - 12 * RAD, th + PHI), M.translation(-pv[0], 0, -pv[2])).done();
      blades.push(n);
    }
    // rotating about the pivot by -beta swings the blade towards the axis (see README / REPORT)
    return {
      R0, blades,
      set(a) {
        const beta = 2 * Math.asin(Math.min(1, Math.max(0, (R0 - a) / (2 * Rp))));
        for (const n of blades) n.setSpin(-beta);
      },
    };
  }

  S.Node = Node; S.Builder = Builder;
  S.build = { AXIS, knurlTube, band, lensGeo, sector, buildIris, layerOf, RAD };
})();
