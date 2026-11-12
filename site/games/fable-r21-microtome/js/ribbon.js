/* Section ribbon: a position-based chain per strand in the Y-Z plane, sliding on
   the knife-holder profile and piling up in the tray (ordered height field for
   self-stacking). Also thick "chunks" and small wax debris.
   The simulation part has no THREE dependency (it is unit-tested under Node). */
(function () {
  'use strict';
  const MT = window.MT, K = MT.K;

  const SEG = 2.5;            // node spacing (mm)
  const CAP = 1536;           // nodes per strand
  const MAXN = 3000;          // nodes kept in total
  const ZMIN = 150, ZMAX = 470, NB = ZMAX - ZMIN;
  const G = 2400;             // effective gravity for a very light film (mm/s^2)
  const SUB = 1 / 240;
  const ITER = 8;
  const LAG = 4;              // nodes of arc before a strand may rest on itself

  const P = K.profile, NP = P.length;
  // profile segment normals
  const segN = [];
  for (let i = 0; i < NP - 1; i++) {
    const dz = P[i + 1][0] - P[i][0], dy = P[i + 1][1] - P[i][1], l = Math.hypot(dz, dy) || 1;
    segN.push([-dy / l, dz / l]);      // [nz, ny] pointing up/out
  }
  let hintSeg = 0;
  function profAt(z) {                 // sets hintSeg, returns height
    if (z <= P[0][0]) { hintSeg = 0; return P[0][1]; }
    if (z >= P[NP - 1][0]) { hintSeg = NP - 2; return P[NP - 1][1]; }
    let i = hintSeg;
    if (!(z >= P[i][0] && z <= P[i + 1][0])) { i = 0; while (z > P[i + 1][0]) i++; hintSeg = i; }
    const a = P[i], b = P[i + 1];
    return a[1] + ((b[1] - a[1]) * (z - a[0])) / (b[0] - a[0] || 1e-6);
  }

  const base = new Float32Array(NB);
  for (let b = 0; b < NB; b++) base[b] = profAt(ZMIN + b + 0.5);

  function hash(n) { n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d); n = Math.imul(n ^ (n >>> 12), 0x297a2d39); return ((n ^ (n >>> 15)) >>> 0) / 4294967296; }

  // thickness (µm) -> look and stiffness of a section
  function sectionParams(um) {
    const t = Math.max(0.5, Math.min(30, um));
    return {
      comp: 0.70 + 0.25 * (1 - Math.exp(-t / 5)),            // length compression
      alpha: 0.34 + 0.65 * (1 - Math.exp(-t / 4.2)),         // opacity
      kb: 0.012 + 0.2 * Math.pow(t / 20, 1.3),               // bending stiffness (soft spring)
      kap: 0.003 + 0.034 * Math.pow(t / 20, 2),              // rest curvature (1/mm)
      wr: Math.exp(-t / 4),                                  // wrinkles
      drag: 6.5 - 3.2 * Math.min(1, t / 20),                 // air drag (1/s)
      wander: 4.5 - 3 * Math.min(1, t / 20),
    };
  }

  function Strand(kind) {
    const f = () => new Float32Array(CAP);
    return {
      kind, n: 0, fz: 0, attached: true, sleep: false, still: 0, fade: 1, dead: false, age: 0,
      y: f(), z: f(), py: f(), pz: f(), L: f(), kb: f(), kap: f(), a: f(), cr: f(), cg: f(), cb: f(),
      wr: f(), v: f(), xo: f(), xr: f(), th: f(), fl: f(), drag: 5, loft: 0.4, mu: 0.22,
    };
  }

  function RibbonSim() {
    const E = [K.yE, K.zE], D = K.d;
    const strands = [];
    const pile = new Float32Array(NB), dyn = new Float32Array(NB);
    let cur = null;          // strand attached to the blade
    let sec = null;          // section being cut
    let nodeCounter = 1, secCounter = 0, layout = 0, emitQueue = 0;
    const ph1 = Math.random() * 6.28, ph2 = Math.random() * 6.28;

    function setNode(s, i, y, z) { s.y[i] = s.py[i] = y; s.z[i] = s.pz[i] = z; }
    function attrs(s, i) {
      const p = sec.p, m = nodeCounter++;
      s.kb[i] = p.kb; s.kap[i] = p.kap + p.wr * (hash(m * 13 + 5) - 0.5) * 0.2; s.a[i] = p.alpha; s.wr[i] = p.wr; s.th[i] = sec.th;
      s.cr[i] = sec.col[0]; s.cg[i] = sec.col[1]; s.cb[i] = sec.col[2];
      s.v[i] = sec.index + sec.frac;
      s.xo[i] = p.wander * (Math.sin(m * 0.045 + ph1) + 0.55 * Math.sin(m * 0.113 + ph2)) * 0.6;
      s.xr[i] = 0;
      // the free leading end of a ribbon curls up a little, as cut wax does
      if (s.kind === 'film' && i < 8 && sec.kind !== 'chunk') { s.kap[i] += 0.17 * (1 - i / 8); if (s.kb[i] < 0.07) s.kb[i] = 0.07; }
      if (sec.crumple) crumpleNode(s, i, m);
    }
    function crumpleNode(s, i, m) {
      s.kb[i] = 0.3; s.kap[i] = (m % 2 ? 1 : -1) * (0.28 + 0.3 * hash(m * 7 + 3));
      s.wr[i] = 1.6; s.a[i] = Math.min(1, s.a[i] * 1.5 + 0.2);
      const w = 0.25; s.cr[i] += (1 - s.cr[i]) * w; s.cg[i] += (1 - s.cg[i]) * w; s.cb[i] += (1 - s.cb[i]) * w;
    }
    function pushNode(s) {     // new free node at the edge; the head stays last
      const h = s.n - 1, n = s.n;
      if (n >= CAP) return false;
      for (const k of ['y', 'z', 'py', 'pz', 'kb', 'kap', 'a', 'cr', 'cg', 'cb', 'wr', 'v', 'xo', 'xr', 'th']) s[k][n] = s[k][h];
      s.L[n - 1] = 0;
      s.n = n + 1; layout++;
      return true;
    }
    function newStrand(kind) {
      const s = Strand(kind);
      setNode(s, 0, E[0], E[1]); setNode(s, 1, E[0], E[1]);
      s.n = 2; s.L[0] = 0;
      strands.push(s); layout++;
      return s;
    }
    function detach() {
      if (!cur) return;
      cur.attached = false;
      // give the freed end a little slack so it does not snag on the edge
      const h = cur.n - 1; cur.z[h] += 0.4; cur.pz[h] = cur.z[h];
      cur = null;
    }

    // --- public: cutting interface -------------------------------------------
    // opts: { um, mm, kind: 'section'|'chunk', color: [r,g,b] }
    function beginSection(opts) {
      const chunk = opts.kind === 'chunk';
      if (cur && (chunk || cur.kind === 'chunk' || cur.n > CAP - 40)) detach();
      const p = sectionParams(chunk ? 30 : opts.um);
      if (chunk) { p.comp = 0.62; p.alpha = 1; p.kb = 0.5; p.kap = 0.055 + 0.02 * Math.random(); p.wr = 0.5; p.drag = 1.6; p.wander = 1; }
      sec = { p, um: opts.um, th: chunk ? opts.mm : opts.um * 0.001, col: opts.color, frac: 0, emitted: 0, len: K.bh * p.comp, index: secCounter++, crumple: false, kind: opts.kind };
      if (!cur) { cur = newStrand(chunk ? 'chunk' : 'film'); attrs(cur, 0); attrs(cur, 1); }
      else { const h = cur.n - 1; attrs(cur, h); }
      cur.drag = p.drag; cur.loft = chunk ? opts.mm * 0.5 + 0.35 : 0.34 + 0.3 * p.wr;
      cur.mu = chunk ? 0.3 : 0.2;
      emitQueue = 0;
    }
    function feed(frac) {
      if (!sec || !cur) return;
      frac = Math.min(1, frac);
      if (frac <= sec.frac) return;
      let len = sec.len;
      if (sec.crumple) len *= 0.42;
      emitQueue += (frac - sec.frac) * len;
      sec.frac = frac;
    }
    function markCrumple() {
      if (!sec || sec.crumple || sec.kind === 'chunk') return;
      sec.crumple = true;
      if (cur) for (let i = Math.max(0, cur.n - 3); i < cur.n; i++) crumpleNode(cur, i, nodeCounter++);
    }
    function endSection(detachAfter) {
      if (!sec || !cur) { sec = null; return; }
      emitNow(emitQueue); emitQueue = 0;
      let broke = !!detachAfter;
      if (!broke && cur.n > 14) {       // bunched up at the blade (cannot slide away): it tears off
        let l = 0, L = 0;
        for (let i = cur.n - 13; i < cur.n - 2; i++) { l += Math.hypot(cur.y[i] - cur.y[i + 1], cur.z[i] - cur.z[i + 1]); L += cur.L[i]; }
        const chord = Math.hypot(cur.y[cur.n - 13] - cur.y[cur.n - 2], cur.z[cur.n - 13] - cur.z[cur.n - 2]);
        if (l < L * 0.7 || chord < L * 0.55) broke = true;
        // or it has lifted off the holder in a loop instead of sliding down
        for (let i = Math.max(0, cur.n - 70); i < cur.n - 3 && !broke; i++) if (cur.z[i] < 243 && cur.y[i] - profAt(cur.z[i]) > 9) broke = true;
      }
      const h = cur.n - 1;
      cur.v[h] = sec.index + 1;
      if (cur.L[h - 1] > 0.25 && pushNode(cur)) { /* node exactly at the seam */ }
      // seams act as hinges
      const j = cur.n - 2; if (j > 0) cur.kb[j] *= 0.22;
      sec = null;
      if (broke) detach();
      return broke && !detachAfter;
    }
    function emitNow(dl) {
      const s = cur; if (!s || dl <= 0) return;
      while (dl > 1e-6) {
        const h = s.n - 1, a = h - 1;
        const room = SEG - s.L[a], d = Math.min(room, dl);
        s.L[a] += d; dl -= d;
        s.y[a] += D[0] * d; s.z[a] += D[1] * d;
        if (sec) { s.v[h] = sec.index + sec.frac; }
        if (s.L[a] >= SEG - 1e-6) {
          if (!pushNode(s)) { detach(); return; }
          if (sec) attrs(s, s.n - 1);
        }
      }
    }

    // --- physics -----------------------------------------------------------
    function stampSeg(s, j, lo) {
      // let later (newer) material rest on node j..j+1 if that part lies low
      const y0 = s.y[j], y1 = s.y[j + 1];
      if (y0 - s.fl[j] > 1.6 || y1 - s.fl[j + 1] > 1.6) return;
      let za = s.z[j], zb = s.z[j + 1];
      if (za > zb) { const t = za; za = zb; zb = t; }
      const b0 = Math.max(0, Math.floor(za - ZMIN)), b1 = Math.min(NB - 1, Math.floor(zb - ZMIN));
      const h = (y0 > y1 ? y0 : y1) + lo;
      for (let b = b0; b <= b1; b++) if (dyn[b] < h) dyn[b] = h;
    }
    function collide(s, i, frozen) {
      let z = s.z[i];
      // the ribbon never gets behind the blade: the cut face of the block is there
      if (z < K.zE + 0.03 && s.y[i] < K.yE + 0.6) { z = s.z[i] = K.zE + 0.03; }
      let f = profAt(z);
      const sg = hintSeg;
      const b = Math.floor(z - ZMIN);
      const hd = b >= 0 && b < NB ? dyn[b] : -1e9;
      let nz = segN[sg][0], ny = segN[sg][1], mu = s.mu, r = s.loft * 0.5, onPile = false;
      // resting on older material. The settled heap (pile) is solid; the strand's own
      // moving layers (dyn) only support what arrives from above, never pop it up from inside.
      const hp = b >= 0 && b < NB ? pile[b] : -1e9;
      let soft = false;
      if (hd > f + 0.05 && (s.y[i] > hd - 1.4 || hp > f + 0.05)) {
        const top = s.y[i] > hd - 1.4 ? hd : hp;
        const b0 = b > 1 ? b - 2 : 0, b1 = b < NB - 2 ? b + 2 : NB - 1;
        const ha = dyn[b0] > base[b0] ? dyn[b0] : base[b0], hb = dyn[b1] > base[b1] ? dyn[b1] : base[b1];
        let sl = (hb - ha) / (b1 - b0); if (sl > 0.6) sl = 0.6; else if (sl < -0.6) sl = -0.6;
        const l = Math.sqrt(1 + sl * sl);
        soft = s.y[i] < top - 1.4;
        f = top; nz = -sl / l; ny = 1 / l; mu = 0.5; r = 0; onPile = true;
      }
      s.fl[i] = ny > 0.6 ? f : 1e9;      // steep faces are not a floor to pile on
      if (frozen) return;
      let pen = (f + r - s.y[i]) * ny;
      if (pen > 0) {
        if (soft) {           // buried in the settled heap: rise gently, without gaining speed
          pen = Math.min(pen, 0.12);
          s.y[i] += pen; s.py[i] = s.y[i]; s.pz[i] = s.z[i];
          return;
        }
        s.y[i] += pen * ny; s.z[i] += pen * nz;
        // Coulomb friction on the tangential part of this step's motion
        const ty = -nz, tz = ny;
        const vt = (s.y[i] - s.py[i]) * ty + (s.z[i] - s.pz[i]) * tz;
        const lim = mu * pen, av = Math.abs(vt);
        const k = av <= lim ? 1 : lim / av;
        s.y[i] -= ty * vt * k; s.z[i] -= tz * vt * k;
        // contacts never add outward speed
        const vn = (s.y[i] - s.py[i]) * ny + (s.z[i] - s.pz[i]) * nz;
        if (vn > 0.02) { const e = vn - 0.02; s.py[i] += ny * e; s.pz[i] += nz * e; }
      }
      void onPile;
    }
    function bendPass(s) {
      const n = s.n, i0 = s.fz;
      // soft bending spring towards the rest curvature (once per substep)
      const last = s.attached ? n - 2 : n - 1;
      for (let i = Math.max(1, i0 + 1); i < last; i++) {
        const kb = s.kb[i]; if (kb <= 0) continue;
        if (s.L[i] < SEG * 0.5) continue;
        let ty = s.y[i + 1] - s.y[i - 1], tz = s.z[i + 1] - s.z[i - 1];
        const tl = Math.hypot(ty, tz); if (tl < 1e-5) continue;
        ty /= tl; tz /= tl;
        const sag = s.kap[i] * SEG * SEG * 0.5;
        const ey = s.y[i] - (s.y[i - 1] + s.y[i + 1]) * 0.5 + sag * -tz;
        const ez = s.z[i] - (s.z[i - 1] + s.z[i + 1]) * 0.5 + sag * ty;
        s.y[i] -= ey * kb * 0.5; s.z[i] -= ez * kb * 0.5;
        if (i - 1 >= i0) { s.y[i - 1] += ey * kb * 0.25; s.z[i - 1] += ez * kb * 0.25; }
        if (!(s.attached && i + 1 === n - 1)) { s.y[i + 1] += ey * kb * 0.25; s.z[i + 1] += ez * kb * 0.25; }
      }
    }
    function substep(dt, emit) {
      if (cur && emit > 0) emitNow(emit);
      // integrate
      for (const s of strands) {
        if (s.sleep) continue;
        const damp = Math.exp(-s.drag * dt), g = G * dt * dt;
        const i0 = s.fz, i1 = s.attached ? s.n - 1 : s.n;
        for (let i = i0; i < i1; i++) {
          let vy = (s.y[i] - s.py[i]) * damp, vz = (s.z[i] - s.pz[i]) * damp;
          const sp = Math.abs(vy) + Math.abs(vz);
          if (sp > 3.5) { const q = 3.5 / sp; vy *= q; vz *= q; }
          s.py[i] = s.y[i]; s.pz[i] = s.z[i];
          s.y[i] += vy - g; s.z[i] += vz;
        }
        if (s.attached) { const h = s.n - 1; s.y[h] = s.py[h] = E[0]; s.z[h] = s.pz[h] = E[1]; }
      }
      for (const s of strands) if (!s.sleep) bendPass(s);
      for (let it = 0; it < ITER; it++) {
        dyn.set(pile);
        for (const s of strands) {
          const n = s.n;
          if (s.sleep) continue;
          const i0 = s.fz;
          // distance constraints, swept from the blade end outwards
          const wa = s.attached ? 0.22 : 0.5;
          for (let i = n - 2; i >= i0 - 1 && i >= 0; i--) {
            const dy = s.y[i] - s.y[i + 1], dz = s.z[i] - s.z[i + 1];
            const l = Math.hypot(dy, dz), L = s.L[i];
            if (l < 1e-6) { continue; }
            const c = (l - L) / l;
            const wi = i < i0 ? 0 : 1 - wa, wj = (s.attached && i + 1 === n - 1) ? 0 : wa;
            const sum = wi + wj; if (sum <= 0) continue;
            const ki = wi / sum, kj = wj / sum;
            s.y[i] -= dy * c * ki; s.z[i] -= dz * c * ki;
            s.y[i + 1] += dy * c * kj; s.z[i + 1] += dz * c * kj;
          }
          // keep the emerging end flat on the blade face
          if (s.attached && n >= 2) {
            let acc = 0;
            for (let q = 1; q <= 3 && n - 1 - q >= i0; q++) {
              const i = n - 1 - q; acc += s.L[i];
              const w = q === 1 ? 0.7 : q === 2 ? 0.3 : 0.12;
              s.y[i] += (E[0] + D[0] * acc - s.y[i]) * w; s.z[i] += (E[1] + D[1] * acc - s.z[i]) * w;
            }
          }
        }
        // collisions, oldest material first so newer layers rest on older ones
        for (const s of strands) {
          const n = s.n;
          if (s.sleep) continue;
          const i0 = s.fz, i1 = s.attached ? n - 1 : n;
          hintSeg = 0;
          for (let i = 0; i < i1; i++) {
            collide(s, i, i < i0);
            if (i - LAG - 1 >= 0) stampSeg(s, i - LAG - 1, s.loft);
          }
        }
      }
      // lateral drift progress, sleeping
      for (const s of strands) {
        if (s.sleep) continue;
        s.age += dt;
        let vmax = 0;
        const i1 = s.attached ? s.n - 1 : s.n;
        for (let i = 0; i < i1; i++) {
          if (s.xr[i] < 1 && s.z[i] > 226) s.xr[i] = Math.min(1, s.xr[i] + dt * 0.8);
          const v = Math.abs(s.y[i] - s.py[i]) + Math.abs(s.z[i] - s.pz[i]);
          if (v > vmax) vmax = v;
        }
        if (s.attached) {
          // far, settled tail: stop simulating it (only material that rests on the tray or heap)
          while (s.fz < s.n - 260 && s.fl[s.fz] < 1e8 && s.y[s.fz] - s.fl[s.fz] < 1.2 && Math.abs(s.y[s.fz] - s.py[s.fz]) + Math.abs(s.z[s.fz] - s.pz[s.fz]) < 0.004) s.fz++;
        } else {
          s.still = vmax < 0.012 ? s.still + dt : 0;
          s.free = (s.free || 0) + dt;
          if (s.still > 0.9 || s.free > 12) {
            s.sleep = true;
            for (let j = 0; j < s.n - 1; j++) { stampInto(pile, s, j); }
            smoothPile();
          }
          // fell off the tray / bench: retire
          if (s.y[0] < 2 && s.z[0] > 404) s.dead = true;
        }
      }
    }
    function stampInto(arr, s, j) {
      let za = s.z[j], zb = s.z[j + 1];
      if (za > zb) { const t = za; za = zb; zb = t; }
      const b0 = Math.max(0, Math.floor(za - ZMIN)), b1 = Math.min(NB - 1, Math.floor(zb - ZMIN));
      const h = Math.max(s.y[j], s.y[j + 1]) + s.loft;
      for (let b = b0; b <= b1; b++) if (arr[b] < h) arr[b] = h;
    }
    function rebuildPile() {
      for (let b = 0; b < NB; b++) pile[b] = -1e9;
      for (const s of strands) if (s.sleep && !s.dead) for (let j = 0; j < s.n - 1; j++) stampInto(pile, s, j);
      smoothPile();
    }
    const tmpPile = new Float32Array(NB);
    function smoothPile() {      // round off single-bin steps so later layers do not snag
      tmpPile.set(pile);
      for (let b = 1; b < NB - 1; b++) {
        const c = tmpPile[b]; if (c < -1e8) { const m = Math.max(tmpPile[b - 1], tmpPile[b + 1]); if (m > -1e8 && tmpPile[b - 1] > -1e8 && tmpPile[b + 1] > -1e8) pile[b] = m; continue; }
        const l = tmpPile[b - 1] > -1e8 ? tmpPile[b - 1] : c, r = tmpPile[b + 1] > -1e8 ? tmpPile[b + 1] : c;
        pile[b] = Math.max(c, (l + r) * 0.5);
      }
    }
    rebuildPile();

    let acc = 0;
    function step(dt) {
      acc += Math.min(dt, 0.1);
      let n = Math.floor(acc / SUB);
      if (n > 14) { n = 14; acc = n * SUB; }
      const per = n > 0 ? emitQueue / n : 0;
      for (let i = 0; i < n; i++) { substep(SUB, per); }
      if (n > 0) emitQueue = 0;
      acc -= n * SUB;
      // housekeeping
      let total = 0, removed = false;
      for (const s of strands) total += s.n;
      for (let i = 0; i < strands.length && total > MAXN; i++) {
        const s = strands[i];
        if (s !== cur && !s.dead) { s.fadeOut = true; }
        total -= s.n;
      }
      for (let i = strands.length - 1; i >= 0; i--) {
        const s = strands[i];
        if (s.fadeOut) { s.fade -= dt * 2.2; if (s.fade <= 0) s.dead = true; }
        if (s.dead) { strands.splice(i, 1); removed = true; if (s === cur) cur = null; }
      }
      if (removed) { rebuildPile(); layout++; }
    }
    function clearSettled() {       // tray emptied
      for (const s of strands) if (s !== cur) s.fadeOut = true;
      if (cur) { detach(); for (const s of strands) s.fadeOut = true; }
    }
    function floorAt(z) {
      const f = profAt(z), b = Math.floor(z - ZMIN);
      return b >= 0 && b < NB && pile[b] > f ? pile[b] : f;
    }
    return {
      strands, beginSection, feed, markCrumple, endSection, detach, step, clearSettled, floorAt,
      get layout() { return layout; }, get current() { return cur; }, get section() { return sec; },
      profAt, SEG,
    };
  }
  MT.RibbonSim = RibbonSim;
  MT.sectionParams = sectionParams;

  // ======================= rendering (THREE) ================================
  MT.RibbonView = function (sim, parent, opts) {
    const T = THREE;
    const AC = 5, W = K.bw;
    const maxV = (MAXN + 600) * AC;
    const pos = new Float32Array(maxV * 3), nor = new Float32Array(maxV * 3), uv = new Float32Array(maxV * 2), col = new Float32Array(maxV * 4);
    const idx = new Uint32Array((MAXN + 600) * (AC - 1) * 6);
    const geo = new T.BufferGeometry();
    const aPos = new T.BufferAttribute(pos, 3), aNor = new T.BufferAttribute(nor, 3), aUv = new T.BufferAttribute(uv, 2), aCol = new T.BufferAttribute(col, 4);
    [aPos, aNor, aCol, aUv].forEach(a => a.setUsage(T.DynamicDrawUsage));
    geo.setAttribute('position', aPos); geo.setAttribute('normal', aNor); geo.setAttribute('uv', aUv); geo.setAttribute('color', aCol);
    const aIdx = new T.BufferAttribute(idx, 1); aIdx.setUsage(T.DynamicDrawUsage); geo.setIndex(aIdx);
    geo.boundingSphere = new T.Sphere(new T.Vector3(0, 100, 300), 400);
    const mat = MT.lite
      ? new T.MeshPhongMaterial({ map: opts.map, vertexColors: true, transparent: true, side: T.DoubleSide, depthWrite: false, shininess: 70, specular: 0x555555 })
      : new T.MeshPhysicalMaterial({
        map: opts.map, vertexColors: true, transparent: true, side: T.DoubleSide, depthWrite: false,
        roughness: 0.42, metalness: 0, sheen: 0.5, sheenRoughness: 0.4, sheenColor: new T.Color(0xffffff),
        clearcoat: 0.25, clearcoatRoughness: 0.4,
      });
    mat.name = 'ribbon';
    const glow = { value: 0.12 };
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uGlow = glow;
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uGlow;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * uGlow;');
    };
    const mesh = new T.Mesh(geo, mat);
    mesh.renderOrder = 5; mesh.frustumCulled = false; mesh.userData.part = 'ribbon';
    parent.add(mesh);

    // ---- chunks (thick slabs) ----
    const CMAX = 700;
    const cpos = new Float32Array(CMAX * 8 * 3), cnor = new Float32Array(CMAX * 8 * 3), ccol = new Float32Array(CMAX * 8 * 3), cuv = new Float32Array(CMAX * 8 * 2);
    const cidx = new Uint32Array(CMAX * 24 + 240);
    const cgeo = new T.BufferGeometry();
    const caP = new T.BufferAttribute(cpos, 3), caN = new T.BufferAttribute(cnor, 3), caC = new T.BufferAttribute(ccol, 3), caU = new T.BufferAttribute(cuv, 2);
    [caP, caN, caC, caU].forEach(a => a.setUsage(T.DynamicDrawUsage));
    cgeo.setAttribute('position', caP); cgeo.setAttribute('normal', caN); cgeo.setAttribute('color', caC); cgeo.setAttribute('uv', caU);
    const caI = new T.BufferAttribute(cidx, 1); cgeo.setIndex(caI);
    cgeo.boundingSphere = geo.boundingSphere;
    const cmat = MT.lite ? new T.MeshPhongMaterial({ map: opts.map, vertexColors: true, shininess: 40, specular: 0x333333, side: T.DoubleSide })
      : new T.MeshPhysicalMaterial({ map: opts.map, vertexColors: true, roughness: 0.5, metalness: 0, sheen: 0.5, sheenRoughness: 0.5, side: T.DoubleSide });
    cmat.name = 'chunk';
    const cmesh = new T.Mesh(cgeo, cmat); cmesh.castShadow = true; cmesh.receiveShadow = true; cmesh.frustumCulled = false; cmesh.userData.part = 'ribbon';
    parent.add(cmesh);

    let lastLayout = -1, lastV = 0, lastCi = 0;
    function update() {
      let v = 0, ii = 0, cv = 0, ci = 0;
      const hw = W / 2;
      for (const s of sim.strands) {
        const n = s.n;
        if (n < 2) continue;
        if (s.kind === 'chunk') {
          // top (0,1), bottom (2,3), left (4,5), right (6,7) per node
          const base = cv;
          for (let i = 0; i < n && cv + 8 <= CMAX * 8; i++) {
            const a = i > 0 ? i - 1 : i, b = i < n - 1 ? i + 1 : i;
            let ty = s.y[b] - s.y[a], tz = s.z[b] - s.z[a]; const tl = Math.hypot(ty, tz) || 1; ty /= tl; tz /= tl;
            const ny = -tz, nz = ty;
            const x0 = s.xo[i] * s.xr[i] * 0.4, th = s.th[i] * (0.86 + 0.28 * hash(i * 31 + n)) * 0.5;
            const y = s.y[i], z = s.z[i], vv = s.v[i];
            const P8 = [[-hw, th, 0, 1], [hw, th, 0, 1], [-hw, -th, 0, -1], [hw, -th, 0, -1], [-hw, th, -1, 0], [-hw, -th, -1, 0], [hw, th, 1, 0], [hw, -th, 1, 0]];
            for (let q = 0; q < 8; q++) {
              const e = P8[q], o = cv * 3;
              cpos[o] = x0 + e[0]; cpos[o + 1] = y + ny * e[1]; cpos[o + 2] = z + nz * e[1];
              cnor[o] = e[2]; cnor[o + 1] = ny * e[3]; cnor[o + 2] = nz * e[3];
              const wtn = q >= 2 ? 0.3 : 0.08;
              ccol[o] = (s.cr[i] + (1 - s.cr[i]) * wtn) * s.fade; ccol[o + 1] = (s.cg[i] + (1 - s.cg[i]) * wtn) * s.fade; ccol[o + 2] = (s.cb[i] + (1 - s.cb[i]) * wtn) * s.fade;
              cuv[cv * 2] = q < 2 ? (e[0] + hw) / W : 0.02; cuv[cv * 2 + 1] = q < 2 ? vv : 0.02;
              cv++;
            }
          }
          const cnt = (cv - base) / 8;
          for (let i = 0; i < cnt - 1; i++) {
            const a = base + i * 8, b = a + 8;
            const quad = (p, q, r, t) => { cidx[ci++] = p; cidx[ci++] = q; cidx[ci++] = r; cidx[ci++] = q; cidx[ci++] = t; cidx[ci++] = r; };
            quad(a, a + 1, b, b + 1); quad(a + 3, a + 2, b + 3, b + 2); quad(a + 5, a + 4, b + 5, b + 4); quad(a + 6, a + 7, b + 6, b + 7);
          }
          if (cnt > 1) {  // end caps
            const a = base, z2 = base + (cnt - 1) * 8;
            cidx[ci++] = a; cidx[ci++] = a + 2; cidx[ci++] = a + 1; cidx[ci++] = a + 1; cidx[ci++] = a + 2; cidx[ci++] = a + 3;
            cidx[ci++] = z2; cidx[ci++] = z2 + 1; cidx[ci++] = z2 + 2; cidx[ci++] = z2 + 1; cidx[ci++] = z2 + 3; cidx[ci++] = z2 + 2;
          }
          continue;
        }
        const base = v;
        for (let i = 0; i < n; i++) {
          const a = i > 0 ? i - 1 : i, b = i < n - 1 ? i + 1 : i;
          let ty = s.y[b] - s.y[a], tz = s.z[b] - s.z[a]; const tl = Math.hypot(ty, tz) || 1; ty /= tl; tz /= tl;
          const ny = -tz, nz = ty;
          const xr = s.xr[i], sm = xr * xr * (3 - 2 * xr);
          const x0 = s.xo[i] * sm, wr = s.wr[i], al = s.a[i] * s.fade;
          const y = s.y[i], z = s.z[i], vv = s.v[i];
          const hk = Math.floor(vv * 97.13) + i * 7;
          for (let q = 0; q < AC; q++) {
            const f = q / (AC - 1), o = v * 3;
            const h1 = hash(hk * 5 + q) - 0.5, h2 = hash(hk * 11 + q * 3 + 1) - 0.5;
            const lift = wr * h1 * 0.5;
            pos[o] = x0 + (f - 0.5) * W * (1 - 0.04 * wr * Math.abs(h2));
            pos[o + 1] = y + ny * lift; pos[o + 2] = z + nz * lift;
            // wrinkled normal
            let nx = wr * h2 * 0.9, my = ny + ty * wr * h1 * 0.8, mz = nz + tz * wr * h1 * 0.8;
            const nl = Math.hypot(nx, my, mz) || 1;
            nor[o] = nx / nl; nor[o + 1] = my / nl; nor[o + 2] = mz / nl;
            uv[v * 2] = f; uv[v * 2 + 1] = vv;
            const c4 = v * 4; col[c4] = s.cr[i]; col[c4 + 1] = s.cg[i]; col[c4 + 2] = s.cb[i]; col[c4 + 3] = al;
            v++;
          }
        }
        {
          for (let i = 0; i < n - 1; i++) {
            const a = base + i * AC, b = a + AC;
            if (Math.abs(s.y[i] - s.y[i + 1]) + Math.abs(s.z[i] - s.z[i + 1]) > 9) continue;   // never draw a torn link
            for (let q = 0; q < AC - 1; q++) {
              idx[ii++] = a + q; idx[ii++] = a + q + 1; idx[ii++] = b + q;
              idx[ii++] = a + q + 1; idx[ii++] = b + q + 1; idx[ii++] = b + q;
            }
          }
        }
      }
      lastLayout = sim.layout;
      if (v > 0 || lastV > 0) {
        aPos.needsUpdate = aNor.needsUpdate = aUv.needsUpdate = aCol.needsUpdate = aIdx.needsUpdate = true;
        aPos.clearUpdateRanges(); aPos.addUpdateRange(0, Math.max(v, 1) * 3); aNor.clearUpdateRanges(); aNor.addUpdateRange(0, Math.max(v, 1) * 3);
        aUv.clearUpdateRanges(); aUv.addUpdateRange(0, Math.max(v, 1) * 2); aCol.clearUpdateRanges(); aCol.addUpdateRange(0, Math.max(v, 1) * 4);
        aIdx.clearUpdateRanges(); aIdx.addUpdateRange(0, Math.max(ii, 1));
      }
      lastV = v;
      geo.setDrawRange(0, ii);
      mesh.visible = ii > 0;
      if (ci > 0 || lastCi > 0) {
        caP.needsUpdate = caN.needsUpdate = caC.needsUpdate = caU.needsUpdate = caI.needsUpdate = true;
        for (const [a, m] of [[caP, 3], [caN, 3], [caC, 3], [caU, 2]]) { a.clearUpdateRanges(); a.addUpdateRange(0, Math.max(cv, 1) * m); }
        caI.clearUpdateRanges(); caI.addUpdateRange(0, Math.max(ci, 1));
      }
      lastCi = ci;
      cgeo.setDrawRange(0, ci);
      cmesh.visible = ci > 0;
    }
    return { mesh, cmesh, update, mat, glow };
  };

  // ======================= wax debris ========================================
  MT.Debris = function (sim, parent) {
    const T = THREE, N = 260;
    const geo = new T.BoxGeometry(1, 1, 1);
    const mat = MT.lite ? new T.MeshLambertMaterial() : new T.MeshStandardMaterial({ roughness: 0.55, metalness: 0 });
    const im = new T.InstancedMesh(geo, mat, N);
    im.instanceMatrix.setUsage(T.DynamicDrawUsage);
    im.castShadow = false; im.receiveShadow = true; im.frustumCulled = false; im.userData.part = 'ribbon';
    const p = [], dummy = new T.Object3D(), c = new T.Color();
    for (let i = 0; i < N; i++) { p.push({ on: false, rest: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, rx: 0, ry: 0, rz: 0, wx: 0, wz: 0, sx: 1, sy: 1, sz: 1, life: 0 }); dummy.position.set(0, -999, 0); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); im.setColorAt(i, c.setRGB(1, 1, 1)); }
    parent.add(im);
    let next = 0, dirty = true;
    function burst(n, y, z, col, speed, spreadX, size) {
      for (let k = 0; k < n; k++) {
        const q = p[next]; const id = next; next = (next + 1) % N;
        q.on = true; q.rest = false; q.life = 0;
        q.x = (Math.random() - 0.5) * (spreadX || K.bw); q.y = y + Math.random() * 1.5; q.z = z + (Math.random() - 0.3) * 2;
        const sp = speed || 60;
        q.vx = (Math.random() - 0.5) * sp * 0.8; q.vy = Math.random() * sp * 0.9; q.vz = (Math.random() * 0.9 + 0.1) * sp;
        q.rx = Math.random() * 6; q.ry = Math.random() * 6; q.rz = Math.random() * 6; q.wx = (Math.random() - 0.5) * 20; q.wz = (Math.random() - 0.5) * 20;
        const s = (size || 1) * (0.5 + Math.random());
        q.sx = s * (0.8 + Math.random() * 1.4); q.sy = s * (0.12 + Math.random() * 0.4); q.sz = s * (0.6 + Math.random());
        const w = 0.15 + Math.random() * 0.3;
        im.setColorAt(id, c.setRGB(col[0] + (1 - col[0]) * w, col[1] + (1 - col[1]) * w, col[2] + (1 - col[2]) * w));
      }
      im.instanceColor.needsUpdate = true; dirty = true;
    }
    function update(dt) {
      let any = false;
      for (let i = 0; i < N; i++) {
        const q = p[i]; if (!q.on) continue;
        if (!q.rest) {
          any = true;
          q.life += dt;
          q.vy -= 2600 * dt; const dmp = Math.exp(-2.2 * dt); q.vx *= dmp; q.vy *= dmp; q.vz *= dmp;
          q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt; q.rx += q.wx * dt; q.rz += q.wz * dt;
          const f = sim.floorAt(q.z) + q.sy * 0.5 + 0.2;
          if (q.y < f) {
            const slope = (sim.floorAt(q.z + 1) - sim.floorAt(q.z - 1)) * 0.5;
            q.y = f;
            if (Math.abs(slope) > 0.45) { q.vz += -slope * 300 * dt; q.vy = 0; q.vx *= 0.9; q.wx *= 0.8; }
            else { q.vx *= 0.5; q.vz *= 0.5; q.vy = Math.abs(q.vy) > 60 ? -q.vy * 0.25 : 0; q.wx *= 0.5; q.wz *= 0.5;
              if (Math.abs(q.vx) + Math.abs(q.vz) + Math.abs(q.vy) < 6) { q.rest = true; q.rx = 0; q.rz = 0; } }
          }
          if (q.life > 8) q.rest = true;
        }
        if (!q.rest || dirty) {
          dummy.position.set(q.x, q.y, q.z); dummy.rotation.set(q.rx, q.ry, q.rz); dummy.scale.set(q.sx, q.sy, q.sz); dummy.updateMatrix();
          im.setMatrixAt(i, dummy.matrix);
        }
      }
      if (any || dirty) { im.instanceMatrix.needsUpdate = true; }
      dirty = false;
      return any;
    }
    function clear() {
      for (let i = 0; i < N; i++) { p[i].on = false; dummy.position.set(0, -999, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); }
      im.instanceMatrix.needsUpdate = true;
    }
    return { mesh: im, burst, update, clear };
  };
})();
