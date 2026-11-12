/* Marble physics core (K1).
 * One fixed-step, deterministic simulation shared by play, the solver, the
 * generator and the tests. No DOM, no Math.random, no wall-clock time.
 * Loads in a browser (classic script) and in node (require). */
(function (root) {
  'use strict';
  var MG = root.MG = root.MG || {};

  var C = MG.C = {
    W: 1600, H: 1000,
    DT: 1 / 120,          // fixed step, seconds
    STEP_MS: 1000 / 120,
    G: 1650,              // gravity, world units / s^2
    R: 20,                // marble radius
    GX0: 150, GY0: 200, GS: 100, COLS: 14, ROWS: 6,   // peg lattice
    SPOUT_Y: 60,          // spout mouth; marble appears just below
    FLOOR_Y: 836,         // below this the marble has left the board
    MAX_AGE: 1200,        // 10 s: a marble that never settles goes home
    VMAX: 2100
  };

  /* ---------- seeded randomness ---------- */
  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash2(a, b) {
    var h = (Math.imul(a | 0, 0x9E3779B1) ^ Math.imul((b | 0) + 0x7F4A7C15, 0x85EBCA6B)) >>> 0;
    h ^= h >>> 15; h = Math.imul(h, 0x2C1B3C6D) >>> 0; h ^= h >>> 12;
    return h >>> 0;
  }
  MG.rng = mulberry32;
  MG.hash2 = hash2;

  /* ---------- materials ---------- */
  // e: restitution, mu: friction, rr: rolling resistance (1/s), dry: constant rolling decel
  var MATS = MG.MATS = {
    wood:   { id: 1, name: 'wood',   e: 0.36, mu: 0.45, rr: 0.35, dry: 26 },
    rubber: { id: 2, name: 'rubber', e: 0.0,  mu: 0.15, rr: 0.6,  dry: 30 },
    slide:  { id: 3, name: 'slide',  e: 0.12, mu: 0.45, rr: 0.15, dry: 10 },
    stone:  { id: 4, name: 'stone',  e: 0.30, mu: 0.40, rr: 0.5,  dry: 30 },
    cup:    { id: 5, name: 'cup',    e: 0.10, mu: 0.60, rr: 3.0,  dry: 60 }
  };

  /* ---------- piece kinds ---------- */
  function arcSegs(cx, cy, rad, a0, a1, n) {
    var out = [], i, pa = a0, pb;
    for (i = 1; i <= n; i++) {
      pb = a0 + (a1 - a0) * i / n;
      out.push([cx + rad * Math.cos(pa), cy + rad * Math.sin(pa), cx + rad * Math.cos(pb), cy + rad * Math.sin(pb)]);
      pa = pb;
    }
    return out;
  }
  // sym: number of distinct 30-degree orientations; rstep: 30-degree steps per turn of the handle
  var KINDS = MG.KINDS = {
    plank:   { segs: [[-90, 0, 90, 0]], rad: 9, mat: 'wood', sym: 6, rstep: 1, reach: 100, movable: true },
    bouncer: { segs: [[-58, 0, 58, 0]], rad: 12, mat: 'rubber', sym: 6, rstep: 1, reach: 72, movable: true },
    // quarter slide: a marble falling down the peg's column lands 10 units inside the lip and
    // leaves along the peg's row
    // (the simulation uses the exact arc; the polyline is for drawing and hit tests)
    curve:   { segs: arcSegs(61, -61, 100, Math.PI, Math.PI / 2, 9), arc: { cx: 61, cy: -61, rho: 100, a0: Math.PI / 2, a1: Math.PI },
               rad: 9, mat: 'slide', sym: 12, rstep: 3, reach: 112, movable: true },
    cup:     { segs: [[-63, -45, -52, 45], [-52, 45, 52, 45], [52, 45, 63, -45]], rad: 8, mat: 'cup', sym: 1, rstep: 0, reach: 85, movable: false },
    bell:    { segs: [], rad: 0, mat: 'wood', sym: 1, rstep: 0, reach: 30, movable: false, sensor: 27 },
    block:   { segs: [], rad: 6, mat: 'stone', sym: 1, rstep: 0, reach: 0, movable: false }
  };
  MG.canonRot = function (k, r) {
    var s = KINDS[k].sym; if (s <= 1) return 0;
    r = ((r % s) + s) % s;
    if (k === 'curve') r = Math.round(r / 3) * 3 % 12;
    return r;
  };
  var ROT_COS = [], ROT_SIN = [];
  (function () { for (var i = 0; i < 12; i++) { ROT_COS.push(Math.cos(i * Math.PI / 6)); ROT_SIN.push(Math.sin(i * Math.PI / 6)); } })();

  /** World-space capsule list [ax,ay,bx,by] for an item {k,x,y,r,(w,h)}. */
  MG.itemSegs = function (it) {
    var K = KINDS[it.k], out = [], i, s, c, sn, r;
    if (it.k === 'block') {
      var hw = it.w / 2 - K.rad, hh = it.h / 2 - K.rad;
      out.push([it.x - hw, it.y - hh, it.x + hw, it.y - hh]);
      out.push([it.x + hw, it.y - hh, it.x + hw, it.y + hh]);
      out.push([it.x + hw, it.y + hh, it.x - hw, it.y + hh]);
      out.push([it.x - hw, it.y + hh, it.x - hw, it.y - hh]);
      return out;
    }
    r = (((it.r || 0) % 12) + 12) % 12;
    c = ROT_COS[r]; sn = ROT_SIN[r];
    for (i = 0; i < K.segs.length; i++) {
      s = K.segs[i];
      out.push([it.x + s[0] * c - s[1] * sn, it.y + s[0] * sn + s[1] * c,
                it.x + s[2] * c - s[3] * sn, it.y + s[2] * sn + s[3] * c]);
    }
    return out;
  };

  /** Squared distance from point to segment. */
  function segDist2(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    var t = l2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    var ex = px - ax - dx * t, ey = py - ay - dy * t;
    return ex * ex + ey * ey;
  }
  MG.segDist2 = segDist2;

  /** Distance from a point to the visible shape of an item (0 when inside). */
  MG.itemDist = function (it, px, py) {
    var K = KINDS[it.k], segs, i, best = 1e9, d;
    if (it.k === 'bell') { d = Math.hypot(px - it.x, py - it.y) - 30; return d < 0 ? 0 : d; }
    if (it.k === 'cup') {
      if (Math.abs(px - it.x) <= 66 && Math.abs(py - it.y) <= 52) return 0;
    }
    if (it.k === 'block') {
      var qx = Math.max(Math.abs(px - it.x) - it.w / 2, 0), qy = Math.max(Math.abs(py - it.y) - it.h / 2, 0);
      return Math.hypot(qx, qy);
    }
    segs = MG.itemSegs(it);
    for (i = 0; i < segs.length; i++) {
      d = segDist2(px, py, segs[i][0], segs[i][1], segs[i][2], segs[i][3]);
      if (d < best) best = d;
    }
    d = Math.sqrt(best) - K.rad;
    return d < 0 ? 0 : d;
  };

  /* ---------- world ---------- */
  function World(spec) {
    this.spoutX = spec.spoutX;
    this.step = 0;
    this.events = [];
    this.marbles = [];
    this.nextMarbleId = 0;
    this.setItems(spec.items || []);
  }

  World.prototype.setItems = function (items) {
    var segs = [], cups = [], bells = [], i, j, it, K, list, s, dx, dy, l2, len, pad, mat;
    this.items = items;
    for (i = 0; i < items.length; i++) {
      it = items[i]; K = KINDS[it.k];
      if (it.k === 'cup') cups.push({ oi: i, x: it.x, y: it.y });
      if (it.k === 'bell') { bells.push({ oi: i, x: it.x, y: it.y }); continue; }
      mat = MATS[K.mat];
      if (K.arc) {
        var rr0 = (((it.r || 0) % 12) + 12) % 12, ca = ROT_COS[rr0], sa = ROT_SIN[rr0];
        var acx = it.x + K.arc.cx * ca - K.arc.cy * sa, acy = it.y + K.arc.cx * sa + K.arc.cy * ca;
        var b0 = K.arc.a0 + rr0 * Math.PI / 6, b1 = K.arc.a1 + rr0 * Math.PI / 6;
        pad = K.arc.rho + K.rad + C.R + 1;
        segs.push({
          arc: true, cx: acx, cy: acy, rho: K.arc.rho,
          e0x: Math.cos(b0), e0y: Math.sin(b0), e1x: Math.cos(b1), e1y: Math.sin(b1),
          ax: 0, ay: 0, dx: 0, dy: 0, il2: 0, nx: 0, ny: -1,
          rad: K.rad, mat: mat, oi: i,
          minx: acx - pad, maxx: acx + pad, miny: acy - pad, maxy: acy + pad
        });
        continue;
      }
      list = MG.itemSegs(it);
      for (j = 0; j < list.length; j++) {
        s = list[j]; dx = s[2] - s[0]; dy = s[3] - s[1]; l2 = dx * dx + dy * dy; len = Math.sqrt(l2);
        pad = K.rad + C.R + 1;
        segs.push({
          ax: s[0], ay: s[1], dx: dx, dy: dy, il2: l2 > 0 ? 1 / l2 : 0,
          nx: len > 0 ? -dy / len : 0, ny: len > 0 ? dx / len : -1,
          rad: K.rad, mat: mat, oi: i,
          minx: Math.min(s[0], s[2]) - pad, maxx: Math.max(s[0], s[2]) + pad,
          miny: Math.min(s[1], s[3]) - pad, maxy: Math.max(s[1], s[3]) + pad
        });
      }
    }
    this.segs = segs; this.cups = cups; this.bells = bells;
    for (i = 0; i < this.marbles.length; i++) this._bind(this.marbles[i]);
  };

  World.prototype._bind = function (m) {
    var n = this.segs.length, i;
    m.lastC = new Int32Array(n);
    for (i = 0; i < n; i++) m.lastC[i] = -100000;
    m.bellLast = new Int32Array(this.bells.length);
    for (i = 0; i < this.bells.length; i++) m.bellLast[i] = -100000;
    // keep touch bookkeeping keyed by item id so live edits (sandbox) stay coherent
  };

  /** Add a marble under the spout. dx is only used by the solver's tolerance check. */
  World.prototype.addMarble = function (dx) {
    var m = {
      id: this.nextMarbleId++, x: this.spoutX + (dx || 0), y: C.SPOUT_Y + C.R + 6,
      vx: 0, vy: 40, w: 0, ang: 0, state: 1, age: 0,
      rest: 0, cup: 0, cupOi: -1, rollV: 0, rollMat: 0, inContact: false,
      touched: [], touchLast: {}, bells: [], lastC: null, bellLast: null, born: this.step
    };
    this._bind(m);
    this.marbles.push(m);
    this.events.push({ s: this.step, t: 'spawn', m: m.id, o: '', v: 0, x: m.x, y: m.y });
    return m;
  };

  World.prototype.stepOnce = function () {
    var segs = this.segs, ns = segs.length, ms = this.marbles, R = C.R, DT = C.DT;
    var items = this.items, ev = this.events, stepN = this.step;
    var i, j, m, s, pass, hit, px, py, t, ex, ey, d2, rr, d, nx, ny, vn, vt, tx, ty, e, out, jn, u, J, maxJ, mat, k, sp2, id, vin, f;
    for (i = 0; i < ms.length; i++) {
      m = ms[i];
      if (m.state !== 1 && m.state !== 2) continue;
      m.age++;
      m.vy += C.G * DT;
      m.vx *= 0.9998; m.vy *= 0.9998;
      sp2 = m.vx * m.vx + m.vy * m.vy;
      if (sp2 > C.VMAX * C.VMAX) { k = C.VMAX / Math.sqrt(sp2); m.vx *= k; m.vy *= k; }
      m.x += m.vx * DT; m.y += m.vy * DT;
      m.ang += m.w * DT;
      m.inContact = false; m.rollV = 0; m.rollMat = 0;
      for (pass = 0; pass < 3; pass++) {
        hit = false;
        for (j = 0; j < ns; j++) {
          s = segs[j];
          if (m.x < s.minx || m.x > s.maxx || m.y < s.miny || m.y > s.maxy) continue;
          if (s.arc) {
            px = m.x - s.cx; py = m.y - s.cy;
            if (s.e0x * py - s.e0y * px >= 0 && px * s.e1y - py * s.e1x >= 0) {
              d = Math.sqrt(px * px + py * py);
              if (d < 1e-6) continue;
              t = 1 - s.rho / d; ex = px * t; ey = py * t;
            } else {
              ex = px - s.e0x * s.rho; ey = py - s.e0y * s.rho;
              px = px - s.e1x * s.rho; py = py - s.e1y * s.rho;
              if (px * px + py * py < ex * ex + ey * ey) { ex = px; ey = py; }
            }
          } else {
            px = m.x - s.ax; py = m.y - s.ay;
            t = (px * s.dx + py * s.dy) * s.il2;
            if (t < 0) t = 0; else if (t > 1) t = 1;
            ex = px - s.dx * t; ey = py - s.dy * t;
          }
          d2 = ex * ex + ey * ey; rr = R + s.rad;
          if (d2 >= rr * rr) continue;
          d = Math.sqrt(d2);
          if (d > 1e-6) { nx = ex / d; ny = ey / d; } else { nx = s.nx; ny = s.ny; d = 0; }
          m.x += nx * (rr - d); m.y += ny * (rr - d);
          hit = true; m.inContact = true;
          mat = s.mat;
          id = items[s.oi].id;
          if (m.touchLast[id] === undefined) m.touched.push(id);
          m.touchLast[id] = stepN;
          vn = m.vx * nx + m.vy * ny;
          if (vn < 0) {
            vin = -vn;
            tx = -ny; ty = nx;
            vt = m.vx * tx + m.vy * ty;
            if (mat.id === 2) { // rubber drum: lively but bounded and monotone
              out = vin > 110 ? Math.min(Math.max(0.72 * vin + 270, 430), 940) : 0;
            } else {
              out = vin > 85 ? mat.e * vin : 0;
            }
            jn = out + vin;
            u = vt - m.w * R;                 // slip speed at the contact point
            J = -u / 3.5;                     // impulse that would give pure rolling (solid ball)
            maxJ = mat.mu * jn;
            if (J > maxJ) J = maxJ; else if (J < -maxJ) J = -maxJ;
            vt += J; m.w -= 2.5 * J / R;
            if (out === 0) {                  // resting / rolling contact
              f = 1 - mat.rr * DT;
              vt *= f; m.w *= f;
              k = mat.dry * DT;
              if (vt > k) { vt -= k; m.w -= k / R; } else if (vt < -k) { vt += k; m.w += k / R; } else { vt = 0; m.w *= 0.9; }
              if (Math.abs(vt) > m.rollV) { m.rollV = Math.abs(vt); m.rollMat = mat.id; }
            }
            m.vx = out * nx + vt * tx; m.vy = out * ny + vt * ty;
            if (vin > 95 && stepN - m.lastC[j] > 8) {
              ev.push({ s: stepN, t: 'hit', m: m.id, o: id, v: vin, x: m.x - nx * R, y: m.y - ny * R, mat: mat.name, nx: nx, ny: ny });
            }
          }
          m.lastC[j] = stepN;
        }
        if (!hit) break;
      }
    }
    // marble-marble
    var a, b, dist, ov, rvn;
    for (i = 0; i < ms.length; i++) {
      a = ms[i]; if (a.state !== 1 && a.state !== 2) continue;
      for (j = i + 1; j < ms.length; j++) {
        b = ms[j]; if (b.state !== 1 && b.state !== 2) continue;
        ex = b.x - a.x; ey = b.y - a.y; d2 = ex * ex + ey * ey;
        if (d2 >= 4 * R * R) continue;
        dist = Math.sqrt(d2);
        if (dist > 1e-6) { nx = ex / dist; ny = ey / dist; } else { nx = 0; ny = -1; dist = 0; }
        ov = (2 * R - dist) / 2;
        a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov;
        rvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rvn < 0) {
          e = rvn < -80 ? 0.8 : 0;
          J = -(1 + e) * rvn / 2;
          a.vx -= J * nx; a.vy -= J * ny; b.vx += J * nx; b.vy += J * ny;
          if (rvn < -110) ev.push({ s: stepN, t: 'clack', m: a.id, o: 'm' + b.id, v: -rvn, x: a.x + nx * R, y: a.y + ny * R, mat: 'glass', nx: nx, ny: ny });
        }
      }
    }
    // sensors, goals, exits
    var bells = this.bells, cups = this.cups, bl, cp, inCup;
    for (i = 0; i < ms.length; i++) {
      m = ms[i];
      if (m.state !== 1) continue;
      for (j = 0; j < bells.length; j++) {
        bl = bells[j];
        ex = m.x - bl.x; ey = m.y - bl.y;
        if (ex * ex + ey * ey < (R + 27) * (R + 27)) {
          if (stepN - m.bellLast[j] > 45) {
            id = items[bl.oi].id;
            if (m.bells.indexOf(id) < 0) m.bells.push(id);
            ev.push({ s: stepN, t: 'bell', m: m.id, o: id, v: Math.sqrt(m.vx * m.vx + m.vy * m.vy), x: bl.x, y: bl.y, mat: 'metal', nx: 0, ny: 0 });
          }
          m.bellLast[j] = stepN;
        }
      }
      inCup = -1;
      for (j = 0; j < cups.length; j++) {
        cp = cups[j];
        if (Math.abs(m.x - cp.x) < 46 && m.y > cp.y - 36 && m.y < cp.y + 28) { inCup = j; break; }
      }
      if (inCup >= 0) {
        if (m.cupOi !== inCup) { m.cupOi = inCup; m.cup = 0; }
        m.cup++;
        if (m.cup >= 34 && m.vx * m.vx + m.vy * m.vy < 240 * 240) {
          m.state = 2;
          ev.push({ s: stepN, t: 'caught', m: m.id, o: items[cups[inCup].oi].id, v: 0, x: m.x, y: m.y, mat: 'cup', nx: 0, ny: 0 });
          continue;
        }
      } else { m.cup = 0; m.cupOi = -1; }
      if (m.y > C.FLOOR_Y + R || m.x < -70 || m.x > C.W + 70 || m.y < -900) {
        m.state = 3;
        ev.push({ s: stepN, t: 'out', m: m.id, o: '', v: Math.abs(m.vy), x: m.x, y: m.y, mat: '', nx: 0, ny: 0 });
        continue;
      }
      if (m.inContact && m.vx * m.vx + m.vy * m.vy < 14 * 14) m.rest++; else m.rest = 0;
      if (m.rest > 84) {
        m.state = 4;
        ev.push({ s: stepN, t: 'rest', m: m.id, o: '', v: 0, x: m.x, y: m.y, mat: '', nx: 0, ny: 0 });
        continue;
      }
      if (m.age > C.MAX_AGE) {
        m.state = 5;
        ev.push({ s: stepN, t: 'timeout', m: m.id, o: '', v: 0, x: m.x, y: m.y, mat: '', nx: 0, ny: 0 });
      }
    }
    this.step++;
  };

  MG.World = World;

  var END = { 1: 'running', 2: 'caught', 3: 'out', 4: 'rest', 5: 'timeout' };
  MG.END = END;

  /** Run one marble to its end. Used by the solver, the generator, hints and tests. */
  MG.simRun = function (spec, opt) {
    opt = opt || {};
    var w = new World(spec), m = w.addMarble(opt.dx || 0), path = opt.path ? [] : null;
    while (m.state === 1) {
      w.stepOnce();
      if (path && (w.step & 1) === 0) path.push(m.x, m.y);
    }
    return {
      ok: m.state === 2, end: END[m.state], steps: w.step, touched: m.touched, touchLast: m.touchLast,
      bells: m.bells, path: path, events: w.events, x: m.x, y: m.y, vx: m.vx, vy: m.vy
    };
  };

  /** Order-sensitive digest of an event list + marbles, for determinism checks. */
  MG.digest = function (world) {
    var h = 2166136261 >>> 0, i, e, m, str;
    function mix(s) { for (var k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619) >>> 0; } }
    for (i = 0; i < world.events.length; i++) {
      e = world.events[i];
      mix(e.s + '|' + e.t + '|' + e.m + '|' + e.o + '|' + e.v + '|' + e.x + '|' + e.y + ';');
    }
    for (i = 0; i < world.marbles.length; i++) {
      m = world.marbles[i];
      str = m.id + ':' + m.state + ':' + m.x + ':' + m.y + ':' + m.vx + ':' + m.vy + ':' + m.w + ';';
      mix(str);
    }
    return ('00000000' + h.toString(16)).slice(-8) + '/' + world.events.length + '/' + world.step;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MG;
})(typeof globalThis !== 'undefined' ? globalThis : this);
