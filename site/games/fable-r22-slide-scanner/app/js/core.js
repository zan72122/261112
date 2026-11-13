/* core.js — namespace, constants, small utilities, simulation clock, axes.
   Everything hangs off the global SS so the app works as classic scripts from file://. */
(function () {
  'use strict';
  const SS = (window.SS = window.SS || {});
  SS.perf = { t0: performance.now() };

  // iPad Safari reports a Mac user agent, so touch points decide "mobile".
  SS.mobile = navigator.maxTouchPoints > 1;
  SS.dpr = SS.mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

  /* ---------- utilities ---------- */
  const U = (SS.util = {
    clamp: (v, a, b) => (v < a ? a : v > b ? b : v),
    lerp: (a, b, t) => a + (b - a) * t,
    smooth: (t) => { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); },
    // exponential approach that is frame-rate independent
    damp: (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt)),
    // deterministic hash of two integers and a seed -> [0,1)
    hash: (i, j, k) => {
      let h = (i * 374761393 + j * 668265263 + (k | 0) * 2147483647) | 0;
      h = (h ^ (h >>> 13)) * 1274126177;
      h = h ^ (h >>> 16);
      return (h >>> 0) / 4294967296;
    },
    rng: (seed) => () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  });

  /* ---------- event bus ---------- */
  const handlers = {};
  SS.on = (ev, fn) => { (handlers[ev] = handlers[ev] || []).push(fn); };
  SS.emit = (ev, a, b) => {
    const l = handlers[ev];
    if (l) for (let i = 0; i < l.length; i++) l[i](a, b);
  };

  /* ---------- constants (mm in the simulation, cm in the 3D scene) ---------- */
  SS.cfg = {
    MM: 0.1, // 1 mm = 0.1 scene units
    OX: -8, OZ: 0, // optical axis in the scene
    slide: { L: 76, W: 26, T: 1.2, patX: 26, patY: 1 }, // pattern origin inside the slide
    pat: { w: 36, h: 24 }, // printed scan area (mm)
    tiles: { nx: 12, ny: 8, step: 3, fov: 3.5, px: 112 }, // 112 px / 3.5 mm = 32 px/mm
    nativePx: 2048, // "real" camera pixels across one tile
    stage: { xmin: -26, xmax: 76, ymin: -20, ymax: 20, loadX: 71, backlash: 0.16 },
    z: { min: -300, max: 300, vis: 0.003, turn: 100 }, // µm, scene units per µm, µm per dial turn
    flipDepth: 670, // apparent depth of the print when the slide is upside down (µm)
    objectives: [
      { mag: 4, fov: 8.75, c: 0.0005, dof: 40, par: 9, ring: 0xd8423a },
      { mag: 10, fov: 3.5, c: 0.0012, dof: 8, par: 0, ring: 0xf2c230 },
      { mag: 20, fov: 1.75, c: 0.0024, dof: 3, par: -6, ring: 0x3aa655 },
    ],
    scanObjective: 1,
  };

  /* ---------- simulation clock with awaitable waits ---------- */
  class Cancel extends Error { constructor() { super('cancel'); } }
  SS.Cancel = Cancel;
  const sim = (SS.sim = { time: 0, scale: 1, waits: [], n: 0 });
  // resolves when cond() becomes true; rejects with Cancel if the token is cancelled
  sim.until = (cond, tok) =>
    new Promise((res, rej) => {
      if (tok && tok.cancelled) return rej(new Cancel());
      if (cond()) return res();
      sim.waits.push({ cond, tok, res, rej });
    });
  sim.wait = (sec, tok) => { const t = sim.time + sec; return sim.until(() => sim.time >= t, tok); };
  // resolves on the next simulation step (never in the same step)
  sim.next = (tok) => { const n = sim.n; return sim.until(() => sim.n > n, tok); };
  sim.pump = () => {
    sim.n++;
    const w = sim.waits;
    for (let i = w.length - 1; i >= 0; i--) {
      const q = w[i];
      if (q.tok && q.tok.cancelled) { w.splice(i, 1); q.rej(new Cancel()); }
      else if (q.cond()) { w.splice(i, 1); q.res(); }
    }
  };
  // run an async job; a Cancel is a normal way for it to end
  SS.run = (fn) => fn().catch((e) => { if (!(e instanceof Cancel)) { console.error(e); throw e; } });

  /* ---------- an actuator axis: target following with speed and acceleration limits ---------- */
  class Axis {
    constructor(o) {
      this.pos = o.pos || 0; this.target = this.pos; this.vel = 0;
      this.min = o.min; this.max = o.max; this.vmax = o.vmax; this.acc = o.acc || o.vmax * 8;
      this.eps = o.eps || 1e-4; this.limit = 0; // -1/+1 while a command is clipped by an end stop
    }
    set(t) {
      this.limit = t < this.min ? -1 : t > this.max ? 1 : 0;
      this.target = U.clamp(t, this.min, this.max);
      return this.limit;
    }
    get moving() { return this.pos !== this.target; }
    update(dt) {
      const d = this.target - this.pos;
      if (d === 0) { this.vel = 0; return 0; }
      const ad = Math.abs(d), dir = d > 0 ? 1 : -1;
      const vDes = dir * Math.min(this.vmax, Math.sqrt(2 * this.acc * ad));
      const a = this.acc * dt; // speed up gently, brake twice as hard
      this.vel += dir > 0 ? U.clamp(vDes - this.vel, -2 * a, a) : U.clamp(vDes - this.vel, -a, 2 * a);
      let step = this.vel * dt;
      if (Math.abs(step) >= ad || (ad < this.eps * 20 && Math.abs(this.vel) < this.acc * dt * 2)) {
        step = d; this.vel = 0;
      }
      this.pos += step;
      return step;
    }
    moveTo(t, tok) { this.set(t); return sim.until(() => this.pos === this.target, tok); }
  }
  SS.Axis = Axis;

  // late modules register themselves here; callers can wait for them
  const lateWait = {};
  SS.provide = (name, mod) => {
    SS[name] = mod;
    if (lateWait[name]) { lateWait[name].forEach((f) => f(mod)); delete lateWait[name]; }
  };
  SS.need = (name) => new Promise((res) => {
    if (SS[name]) res(SS[name]); else (lateWait[name] = lateWait[name] || []).push(res);
  });
})();
