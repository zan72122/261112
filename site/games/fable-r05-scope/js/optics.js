// Optics numbers (all computed, nothing typed in) and the animated light path.
//
//   field of view on the slide   = FN / M_objective                 (FN = 26.5 mm)
//   camera frame on the slide    = sensor / (adapter * M_objective)  (13.2 x 8.8 mm sensor, 0.63x adapter)
//   illumination aperture        NA_c = 0.04 .. 0.90 from the aperture diaphragm
//   working aperture             NA_eff = min(NA_c, NA_objective)
//   light cone half angle        theta = asin(NA)
//   resolution (550 nm)          d = 1.22 * lambda / (NA_objective + NA_eff)
//   depth of field               dz = lambda / NA^2 + e / (M * NA)   (e = 10 um)
//   image brightness             B ~ (NA_eff / M)^2, shown relative to the 4x objective wide open
//   defocus blur radius          r = |dz| * tan(asin(NA_objective))
(function () {
  'use strict';
  const S = window.SCOPE;
  const { M, V, Geo, clamp, lerp } = S;
  const FN = 26.5, LAMBDA = 0.55;
  const CAMERA = { w: 13.2, h: 8.8, adapter: 0.63 };

  function compute(st) {
    const o = S.OBJECTIVES[st.obj];
    const naCond = 0.04 + st.aperture * 0.86;
    const naEff = Math.min(naCond, o.na);
    const rel = Math.pow(naEff / o.mag, 2) / Math.pow(0.10 / 4, 2);
    const glare = clamp((naCond - o.na) / (0.9 - o.na), 0, 1);
    return {
      o, mag: o.mag, total: o.mag * 10, na: o.na, naCond, naEff,
      fov: FN / o.mag,
      camW: CAMERA.w / CAMERA.adapter / o.mag, camH: CAMERA.h / CAMERA.adapter / o.mag,
      res: (1.22 * LAMBDA) / (o.na + naEff),
      dof: LAMBDA / (o.na * o.na) + 10 / (o.mag * o.na),
      rel, brightness: Math.min(1, Math.sqrt(rel)),
      contrast: 1 - 0.45 * glare,
      fieldDia: 0.3 + 8.2 * st.field * st.field,     // diameter of the field-diaphragm image on the slide (mm)
      coneDeg: (Math.asin(naEff) * 180) / Math.PI, acceptDeg: (Math.asin(o.na) * 180) / Math.PI,
      blur: Math.abs(st.focus) * Math.tan(Math.asin(o.na)),
    };
  }

  // ---------- light path ----------
  const COL = { warm: [1.0, 0.70, 0.28], img: [0.26, 0.78, 1.0], cam: [1.0, 0.34, 0.70] };

  function frustum(g, a, b, ra, rb, s0, s1, seg = 28) {
    const ax = V.norm(V.sub(b, a));
    let u = V.cross(ax, Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]);
    u = V.norm(u);
    const v = V.cross(ax, u), base = g.vcount;
    for (let j = 0; j <= seg; j++) {
      const t = (j / seg) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
      const d = [u[0] * c + v[0] * s, u[1] * c + v[1] * s, u[2] * c + v[2] * s];
      g.vert(a[0] + d[0] * ra, a[1] + d[1] * ra, a[2] + d[2] * ra, d[0], d[1], d[2], j / seg, s0);
      g.vert(b[0] + d[0] * rb, b[1] + d[1] * rb, b[2] + d[2] * rb, d[0], d[1], d[2], j / seg, s1);
    }
    for (let j = 0; j < seg; j++) g.i.push(base + j * 2, base + j * 2 + 1, base + j * 2 + 3, base + j * 2, base + j * 2 + 3, base + j * 2 + 2);
    return { a, b, ra, rb, s0, s1, u, v };
  }
  function spot(g, c, r, s, seg = 32) {
    const base = g.vcount;
    g.vert(c[0], c[1], c[2], 0, 1, 0, 0, s);
    for (let j = 0; j <= seg; j++) { const t = (j / seg) * Math.PI * 2; g.vert(c[0] + r * Math.cos(t), c[1], c[2] + r * Math.sin(t), 0, 1, 0, j / seg, s); }
    for (let j = 0; j < seg; j++) g.i.push(base, base + 1 + j, base + 2 + j);
  }

  class LightPath {
    constructor(R, model) {
      this.R = R; this.model = model;
      const mk = (name, color, intensity, soft) => {
        const empty = new Geo();
        empty.vert(0, 0, 0, 0, 1, 0, 0, 0); empty.vert(0, 0, 0, 0, 1, 0, 0, 0); empty.vert(0, 0, 0, 0, 1, 0, 0, 0); empty.i.push(0, 1, 2);
        const it = {
          mesh: R.mesh(empty.build(), true), material: { type: 'beam', color, intensity, soft }, node: model.root, part: null, layer: 'beam',
          visible: false, cast: false, xray: 0, hi: 0, gain: 1, version: -1, world: model.root.world, normalMat: M.normalMatrix(model.root.world), center: [0, 250, 0], lc: [0, 250, 0],
        };
        model.items.push(it);
        return it;
      };
      this.items = {
        lamp: mk('lamp', COL.warm, 1.25, 1.35), cond: mk('cond', COL.warm, 1.5, 1.2),
        img: mk('img', COL.img, 1.55, 1.25), cam: mk('cam', COL.cam, 1.6, 1.25), accept: mk('accept', COL.img, 0.22, 2.6),
      };
      this.N = 170;
      this.seed = new Float32Array(this.N * 4);
      let s = 4242;
      const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
      for (let i = 0; i < this.N; i++) { this.seed[i * 4] = rnd(); this.seed[i * 4 + 1] = Math.sqrt(rnd()) * 0.92; this.seed[i * 4 + 2] = rnd() * Math.PI * 2; this.seed[i * 4 + 3] = rnd(); }
      this.buf = new Float32Array(this.N * 8);
      this.chains = [[], [], []];
      this.maxLen = 800;
    }
    setVisible(v) { for (const k in this.items) this.items[k].visible = v; }

    // st: {obj, field, aperture, focus}
    rebuild(st) {
      const D = S.DIM, op = compute(st), o = op.o, dz = st.focus;
      const yb = D.Y_BASE_AXIS, rPre = 16;
      const rF = lerp(2.2, 16, st.field), rA = lerp(1.5, 15, st.aperture), rS = op.fieldDia / 2;
      const yAD = D.Y_AD + dz, yCL = D.Y_COND_LENS + dz, yS = D.Y_OBJ + dz;
      const rPar = [3.8, 6, 6, 6][st.obj];
      const h = rPar / Math.tan(Math.asin(o.na));
      const rB = Math.max(0.45, h * Math.tan(Math.asin(op.naEff)));
      const yOP = yS + h;
      const P0 = D.P0, d = D.DIR;
      const al = (t, x) => [P0[0] + (x || 0), P0[1] + d[1] * t, P0[2] + d[2] * t];
      const gl = new Geo(), gc = new Geo(), gi = new Geo(), gk = new Geo(), ga = new Geo();
      const main = [], eyeL = [], eyeR = [], cam = [];
      let s = 0;
      const add = (g, list, a, b, ra, rb, col, gain) => {
        const len = V.len(V.sub(b, a));
        const sg = frustum(g, a, b, ra, rb, s, s + len);
        sg.col = col; sg.gain = gain;
        list.push(sg);
        s += len;
        return sg;
      };
      const gA = 0.30 + 0.70 * Math.pow(st.aperture, 0.8);          // light passed by the aperture diaphragm
      const gI = (0.25 + 0.75 * op.brightness);                     // image-side brightness
      // illumination: lamp -> collector -> mirror -> field diaphragm -> aperture diaphragm -> condenser -> slide
      add(gl, main, [0, yb, D.Z_LAMP], [0, yb, D.Z_COLL], 2, rPre, COL.warm, 1);
      add(gl, main, [0, yb, D.Z_COLL], [0, yb, 0], rPre, rPre, COL.warm, 1);
      add(gl, main, [0, yb, 0], [0, D.Y_FD, 0], rPre, rPre, COL.warm, 1);
      add(gl, main, [0, D.Y_FD, 0], [0, yAD, 0], rF, Math.min(rA, rF * 1.15 + 3), COL.warm, 1);
      add(gc, main, [0, yAD, 0], [0, yCL, 0], Math.min(rA, rF * 1.15 + 3), rA, COL.warm, gA);
      add(gc, main, [0, yCL, 0], [0, yS, 0], rA, rS, COL.warm, gA);
      spot(gc, [0, yS + 0.06, 0], rS, s);
      // imaging: slide -> objective (cone) -> parallel beam -> tube lens -> prism
      const sCone = s;
      add(gi, main, [0, yS, 0], [0, yOP, 0], 0.35, rB, COL.img, gI);
      frustum(ga, [0, yS, 0], [0, yOP, 0], 0.35, rPar, sCone, sCone + h);
      frustum(ga, [0, yOP, 0], [0, yOP + 10, 0], rPar, rPar, sCone + h, sCone + h + 10);
      add(gi, main, [0, yOP, 0], [0, D.Y_TUBELENS, 0], rB, rB, COL.img, gI);
      add(gi, main, [0, D.Y_TUBELENS, 0], P0, rB, rB * 0.86, COL.img, gI);
      const sP = s;
      // camera branch (straight up to the sensor)
      add(gk, cam, P0, [0, D.Y_SENSOR, 0], rB * 0.86, 0.5, COL.cam, gI);
      // binocular branch: along the inclined tube axis, split sideways, down each eyepiece
      s = sP;
      const b1 = add(gi, eyeL, P0, al(D.T_SPLIT), rB * 0.86, rB * 0.74, COL.img, gI);
      eyeR.push(b1);
      const sB = s;
      for (const [sx, list] of [[-1, eyeL], [1, eyeR]]) {
        s = sB;
        add(gi, list, al(D.T_SPLIT), al(D.T_SPLIT, sx * D.EYE_X), rB * 0.74, rB * 0.66, COL.img, gI);
        add(gi, list, al(D.T_SPLIT, sx * D.EYE_X), al(D.T_FACE + 60, sx * D.EYE_X), rB * 0.66, 0.5, COL.img, gI);
        add(gi, list, al(D.T_FACE + 60, sx * D.EYE_X), al(D.T_FACE + 85, sx * D.EYE_X), 0.5, 3.2, COL.img, gI);
        add(gi, list, al(D.T_FACE + 85, sx * D.EYE_X), al(D.T_FACE + 109, sx * D.EYE_X), 3.2, 1.3, COL.img, gI);
      }
      this.R.updateMesh(this.items.lamp.mesh, gl.build());
      this.R.updateMesh(this.items.cond.mesh, gc.build());
      this.R.updateMesh(this.items.img.mesh, gi.build());
      this.R.updateMesh(this.items.cam.mesh, gk.build());
      this.R.updateMesh(this.items.accept.mesh, ga.build());
      this.items.cond.gain = gA; this.items.img.gain = gI; this.items.cam.gain = gI; this.items.accept.gain = 1;
      this.chains = [main.concat(cam), main.concat(eyeL), main.concat(eyeR)];
      this.maxLen = Math.max(...this.chains.map((c) => c[c.length - 1].s1));
      this.op = op;
      return op;
    }

    // moving "photons": returns the number of points written
    particles(time, front, strength) {
      const buf = this.buf, seed = this.seed;
      let n = 0;
      for (let i = 0; i < this.N; i++) {
        const chain = this.chains[i % 3];
        if (!chain.length) continue;
        const L = chain[chain.length - 1].s1;
        const sp = (seed[i * 4] * L + time * (215 + 60 * seed[i * 4 + 3])) % L;
        if (sp > front) continue;
        let sg = chain[0];
        for (let k = 0; k < chain.length; k++) if (sp <= chain[k].s1) { sg = chain[k]; break; }
        const f = clamp((sp - sg.s0) / Math.max(1e-6, sg.s1 - sg.s0), 0, 1);
        const r = (sg.ra + (sg.rb - sg.ra) * f) * seed[i * 4 + 1];
        const c = Math.cos(seed[i * 4 + 2]), sn = Math.sin(seed[i * 4 + 2]);
        const o = n * 8;
        buf[o] = sg.a[0] + (sg.b[0] - sg.a[0]) * f + (sg.u[0] * c + sg.v[0] * sn) * r;
        buf[o + 1] = sg.a[1] + (sg.b[1] - sg.a[1]) * f + (sg.u[1] * c + sg.v[1] * sn) * r;
        buf[o + 2] = sg.a[2] + (sg.b[2] - sg.a[2]) * f + (sg.u[2] * c + sg.v[2] * sn) * r;
        buf[o + 3] = 3.4 + 1.6 * seed[i * 4 + 3];
        const tw = 0.6 + 0.4 * Math.sin(time * 7 + i * 1.7);
        buf[o + 4] = sg.col[0]; buf[o + 5] = sg.col[1]; buf[o + 6] = sg.col[2];
        buf[o + 7] = 2.6 * tw * sg.gain * strength;
        n++;
      }
      return n;
    }
  }

  S.optics = { FN, LAMBDA, CAMERA, compute, COL };
  S.LightPath = LightPath;
})();
