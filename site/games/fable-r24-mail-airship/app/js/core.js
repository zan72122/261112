// core.js - shared namespace, math helpers, the merged-geometry builder and the background task queue.
// Everything in the game hangs off window.MA. Files are classic scripts so index.html opens from file://.
(function () {
  'use strict';
  var T = THREE;
  var MA = (window.MA = { T: T });

  // iPadOS Safari reports a Mac user agent, so touch points are the only reliable signal.
  MA.mobile = navigator.maxTouchPoints > 1;

  MA.TAU = Math.PI * 2;
  MA.clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  MA.lerp = function (a, b, t) { return a + (b - a) * t; };
  MA.sstep = function (a, b, x) {
    var t = MA.clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  // Frame-rate independent approach of cur towards target.
  MA.damp = function (cur, target, rate, dt) { return cur + (target - cur) * (1 - Math.exp(-rate * dt)); };
  MA.wrapPi = function (a) {
    a = (a + Math.PI) % MA.TAU;
    if (a < 0) a += MA.TAU;
    return a - Math.PI;
  };
  MA.ease = {
    outBack: function (t) { var c = 1.70158; t = t - 1; return 1 + (c + 1) * t * t * t + c * t * t; },
    outCubic: function (t) { t = 1 - t; return 1 - t * t * t; },
    inOut: function (t) { return t * t * (3 - 2 * t); },
    outElastic: function (t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return Math.pow(2, -9 * t) * Math.sin((t * 8 - 0.75) * (MA.TAU / 3)) + 1;
    },
  };
  // Small seeded PRNG so the world is the same on every launch.
  MA.rng = function (seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  // Smooth periodic noise on an angle (for island outlines).
  MA.ringNoise = function (ang, seed) {
    return (
      Math.sin(ang * 2 + seed) * 0.5 +
      Math.sin(ang * 3 + seed * 2.3) * 0.3 +
      Math.sin(ang * 5 + seed * 4.1) * 0.2
    );
  };

  // ---- shared uniforms / colours -------------------------------------------------------------
  MA.FOG_DENSITY = 0.00105;
  MA.pal = {
    skyTop: 0x2f8fe8,
    skyMid: 0x7cc4fb,
    horizon: 0xd4eeff,
    seaDeep: 0x2a86d0,
    seaLight: 0x49aee6,
    seaShallow: 0x86e6d6,
    foam: 0xffffff,
    sun: 0xfff3d0,
    grass: 0x86d46a,
    grassDark: 0x5dbb62,
    sand: 0xffe9ae,
    rock: 0xb9b2cc,
    wood: 0xc08a4e,
    woodDark: 0x94602f,
    cream: 0xfff4dc,
    white: 0xffffff,
    red: 0xf2594b,
    yellow: 0xffd24a,
    ink: 0x3b3340,
  };
  MA.uni = {
    time: { value: 0 },
    fogColor: { value: new T.Color(MA.pal.horizon) },
    fogDensity: { value: MA.FOG_DENSITY },
    sunDir: { value: new T.Vector3(-0.34, 0.8, -0.5).normalize() },
  };
  // GLSL shared by custom shaders: exp2 fog that matches scene.fog. dist is always >= 0.
  MA.glslFog =
    'uniform vec3 fogColor; uniform float fogDensity;\n' +
    'float fogAmount(float dist){ float k = fogDensity * dist; return 1.0 - exp(-k * k); }\n';

  var colCache = {};
  MA.col = function (hex) {
    return colCache[hex] || (colCache[hex] = new T.Color(hex));
  };

  // ---- geometry builder: many coloured primitives -> one non-indexed BufferGeometry ------------
  var _m = new T.Matrix4(), _q = new T.Quaternion(), _e = new T.Euler(), _p = new T.Vector3(), _s = new T.Vector3();
  function mat(pos, rot, scl) {
    _p.set(pos ? pos[0] : 0, pos ? pos[1] : 0, pos ? pos[2] : 0);
    _e.set(rot ? rot[0] : 0, rot ? rot[1] : 0, rot ? rot[2] : 0);
    _q.setFromEuler(_e);
    if (typeof scl === 'number') _s.set(scl, scl, scl);
    else if (scl) _s.set(scl[0], scl[1], scl[2]);
    else _s.set(1, 1, 1);
    return _m.compose(_p, _q, _s);
  }

  function Geo() {
    this.p = [];
    this.n = [];
    this.c = [];
    this.base = null; // optional Matrix4 applied on top of every part (used to place sub-models)
  }
  Geo.prototype = {
    // color: hex number, or function(x, y, z) -> hex evaluated after transform, per triangle
    // (default) or per vertex when the function has .perVertex = true (smooth gradients).
    add: function (g, color, m, flat) {
      if (g.index) {
        var g2 = g.toNonIndexed();
        g.dispose();
        g = g2;
      }
      if (m) g.applyMatrix4(m);
      if (this.base) g.applyMatrix4(this.base);
      if (flat) g.computeVertexNormals();
      var P = g.attributes.position.array, N = g.attributes.normal.array;
      var p = this.p, n = this.n, c = this.c, i, k;
      if (typeof color === 'function' && color.perVertex) {
        for (i = 0; i < P.length; i += 3) {
          k = MA.col(color(P[i], P[i + 1], P[i + 2]));
          p.push(P[i], P[i + 1], P[i + 2]);
          n.push(N[i], N[i + 1], N[i + 2]);
          c.push(k.r, k.g, k.b);
        }
      } else if (typeof color === 'function') {
        // one colour per triangle (sampled at its centre) keeps stripes and patches crisp
        for (i = 0; i < P.length; i += 9) {
          k = MA.col(color((P[i] + P[i + 3] + P[i + 6]) / 3, (P[i + 1] + P[i + 4] + P[i + 7]) / 3, (P[i + 2] + P[i + 5] + P[i + 8]) / 3));
          for (var j = i; j < i + 9; j += 3) {
            p.push(P[j], P[j + 1], P[j + 2]);
            n.push(N[j], N[j + 1], N[j + 2]);
            c.push(k.r, k.g, k.b);
          }
        }
      } else {
        k = MA.col(color);
        for (i = 0; i < P.length; i += 3) {
          p.push(P[i], P[i + 1], P[i + 2]);
          n.push(N[i], N[i + 1], N[i + 2]);
          c.push(k.r, k.g, k.b);
        }
      }
      g.dispose();
      return this;
    },
    box: function (c, size, pos, rot) {
      return this.add(new T.BoxGeometry(size[0], size[1], size[2]), c, mat(pos, rot));
    },
    sph: function (c, r, pos, scl, ws, hs, rot) {
      return this.add(new T.SphereGeometry(r, ws || 10, hs || 7), c, mat(pos, rot, scl));
    },
    ico: function (c, r, pos, scl, detail, rot) {
      return this.add(new T.IcosahedronGeometry(r, detail || 0), c, mat(pos, rot, scl), true);
    },
    cyl: function (c, rt, rb, h, pos, rot, seg, open) {
      return this.add(new T.CylinderGeometry(rt, rb, h, seg || 10, 1, !!open), c, mat(pos, rot));
    },
    cone: function (c, r, h, pos, rot, seg) {
      return this.add(new T.ConeGeometry(r, h, seg || 10), c, mat(pos, rot));
    },
    tor: function (c, R, r, pos, rot, rs, ts, arc, scl) {
      return this.add(new T.TorusGeometry(R, r, rs || 6, ts || 16, arc || MA.TAU), c, mat(pos, rot, scl));
    },
    // pts: [[radius, y], ...] bottom to top.
    lathe: function (c, pts, pos, rot, seg, scl, flat) {
      var v = [];
      for (var i = 0; i < pts.length; i++) v.push(new T.Vector2(Math.max(pts[i][0], 0.0001), pts[i][1]));
      return this.add(new T.LatheGeometry(v, seg || 12), c, mat(pos, rot, scl), flat);
    },
    // Half sphere (dome), open at the bottom.
    dome: function (c, r, pos, scl, ws, hs, rot) {
      return this.add(new T.SphereGeometry(r, ws || 12, hs || 5, 0, MA.TAU, 0, Math.PI / 2), c, mat(pos, rot, scl));
    },
    tris: function () { return this.p.length / 9; },
    build: function () {
      var g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(new Float32Array(this.p), 3));
      g.setAttribute('normal', new T.BufferAttribute(new Float32Array(this.n), 3));
      g.setAttribute('color', new T.BufferAttribute(new Float32Array(this.c), 3));
      g.computeBoundingSphere();
      this.p = this.n = this.c = null;
      return g;
    },
    mesh: function (material) {
      return new T.Mesh(this.build(), material || MA.mat.lambert);
    },
  };
  MA.Geo = Geo;
  MA.mat4 = function (pos, rot, scl) { return mat(pos, rot, scl).clone(); };

  // ---- shared materials (few programs = fast first frame) --------------------------------------
  MA.mat = {
    lambert: new T.MeshLambertMaterial({ vertexColors: true }),
    basic: new T.MeshBasicMaterial({ vertexColors: true, fog: false }),
  };
  MA.mat.lambert.shared = MA.mat.basic.shared = true;

  // Dispose everything under obj that is not marked shared, then detach it.
  MA.dispose = function (obj) {
    if (!obj) return;
    obj.traverse(function (o) {
      if (o.geometry && !o.geometry.shared) o.geometry.dispose();
      var m = o.material;
      if (m && !m.shared) {
        if (m.map && !m.map.shared) m.map.dispose();
        m.dispose();
      }
    });
    if (obj.parent) obj.parent.remove(obj);
  };

  // ---- background work queue: run after the frame is drawn, a few ms at a time -----------------
  var queue = [];
  MA.defer = function (fn) { queue.push(fn); };
  MA.runDeferred = function (budgetMs) {
    var t0 = performance.now();
    while (queue.length && performance.now() - t0 < budgetMs) {
      var fn = queue.shift();
      fn();
    }
  };
  MA.pendingWork = function () { return queue.length; };

  // Loads classic scripts one after another (works on file://). Used for everything
  // that is not needed for the first frame.
  MA.loadScripts = function (list, done) {
    var i = 0;
    (function next() {
      if (i >= list.length) return done && done();
      var s = document.createElement('script');
      s.src = list[i++];
      s.onload = next;
      s.onerror = function () { console.error('failed to load ' + s.src); next(); };
      document.head.appendChild(s);
    })();
  };

  MA.late = {}; // modules loaded after the first frame register here
})();
