/* Core namespace, math helpers, layout constants.
   Units: 1 scene unit = 1 cm. x right, y up, z toward the viewer. Bench top is y = 0. */
(function () {
  'use strict';
  const EC = (window.EC = {});
  const T = window.THREE;

  // ---- URL params (debug / capture helpers, never required) ----
  const q = {};
  (location.search || '').replace(/^\?/, '').split('&').forEach(function (kv) {
    if (!kv) return;
    const i = kv.indexOf('=');
    q[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = i < 0 ? '1' : decodeURIComponent(kv.slice(i + 1));
  });
  EC.params = q;

  const ua = navigator.userAgent || '';
  EC.isTouch = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window;
  EC.isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  EC.isMobile = EC.isIOS || /Android/.test(ua) || (EC.isTouch && Math.min(screen.width, screen.height) < 820);

  // ---- math ----
  const U = (EC.U = {});
  U.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  U.sat = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.smooth = function (a, b, v) { const t = U.sat((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  U.damp = function (cur, target, lambda, dt) { return cur + (target - cur) * (1 - Math.exp(-lambda * dt)); };
  U.rad = function (d) { return (d * Math.PI) / 180; };
  U.wrapPi = function (a) { a = (a + Math.PI) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI; return a - Math.PI; };
  U.rng = function (seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  U.easeOutBack = function (t) { const c = 1.70158; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; };
  U.easeOutCubic = function (t) { t = 1 - U.sat(t); return 1 - t * t * t; };
  U.easeInOut = function (t) { t = U.sat(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  /* Critically damped spring toward a target; state {x, v}. */
  U.spring = function (st, target, omega, dt) {
    const f = 1 + 2 * dt * omega;
    const oo = omega * omega;
    const hoo = dt * oo;
    const hhoo = dt * hoo;
    const detInv = 1 / (f + hhoo);
    const detX = f * st.x + dt * st.v + hhoo * target;
    const detV = st.v + hoo * (target - st.x);
    st.x = detX * detInv;
    st.v = detV * detInv;
    return st.x;
  };

  // ---- tiny event bus ----
  const handlers = {};
  EC.on = function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); };
  EC.emit = function (name, a, b, c, d, e, f) {
    const l = handlers[name];
    if (l) for (let i = 0; i < l.length; i++) l[i](a, b, c, d, e, f);
  };

  // ---- global state ----
  EC.state = {
    play: false,      // beginner (operate) mode
    time: 0,
    dt: 0.016,
    shadowDirty: true,
  };
  EC.updaters = [];   // functions(dt, time) called each frame, in registration order
  EC.touchShadow = function () { EC.state.shadowDirty = true; };

  // ---- layout (cm) ----
  EC.D = {
    bench: { x0: -96, x1: 112, z0: -46, z1: 62 },
    unit: { x0: -30, x1: 30, z0: -30, z1: 28, feet: 1.0 },
    deckY: 11,
    tower: { z1: 2, y1: 34 },
    plate: { x0: -12, x1: 12, z0: 3.5, z1: 21.5, y: 11.6 },
    grille: { x0: -6, x1: 6, z0: 18.5, z1: 20.7 },
    chamber: { x0: -28, x1: -15, z0: 3, z1: 21.5, floorY: 7.0, rimY: 11.36 },
    wells: { x0: 15.5, x1: 27.5, z0: 4, z1: 10.5, topY: 12.4 },
    dish: { x: 21.5, z: 17.2, w: 11, d: 8, floorY: 11.16 },
    nozzle: { x: 0, y: 17.8, z: 10.5 },
    lever: { pivotY: 19.3, pivotZ: 8.6, len: 7.2, maxAngle: 0.16 },
    head: { x0: -5, x1: 5, y0: 19.5, y1: 27.5, z0: 1.5, z1: 13.5 },
    tank: { x0: -14, x1: 14, z0: -26, z1: -3.5, floorY: 21, y0: 22, y1: 32.6 },
    cold: { x0: 34, x1: 62, z0: -6, z1: 26, topY: 12.4, plate: { x0: 36.5, x1: 59.5, z0: -2.5, z1: 21.5, y: 13.0 } },
    pedal: { x: -17, z: 43, yaw: 0.2 },
    cup: { x: -45, z: 13 },
  };

  // ---- thermal constants (degC) ----
  EC.K = {
    Tm: 57,          // wax melting point
    Tres: 62,        // reservoir set point
    Tplate: 63,      // heated work surface
    Tchamber: 60,
    Twell: 68,
    Tcold: -5,
    Tamb: 23,
  };

  EC.V3 = function (x, y, z) { return new T.Vector3(x, y, z); };
})();
