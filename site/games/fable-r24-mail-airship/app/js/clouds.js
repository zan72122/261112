// clouds.js (late) - all clouds are flat, camera-facing cards drawn in one instanced call:
// far cloud banks, a low "sea of clouds", cumulus clumps to fly through, and cloud rings.
// Flying through a ring rings a chime and a cloud chick pops out to follow the ship.
(function () {
  'use strict';
  var T = THREE, MA = window.MA;
  var MAXN = 480, n = 0, RN = 14; // RN: puffs per cloud ring
  var iPos = new Float32Array(MAXN * 3), iPar = new Float32Array(MAXN * 4);
  var clumps = [], rings = [], mesh = null, parAttr = null;
  var seaC = { x: 0, z: 0, r: 0 };
  var prev = new T.Vector3(), havePrev = false, whooshCd = 0, veil = 0;

  function puffTexture() {
    // 2x2 atlas of soft puffs; only the alpha channel is used
    var S = 256, c = document.createElement('canvas');
    c.width = c.height = S;
    var g = c.getContext('2d'), rnd = MA.rng(11);
    for (var k = 0; k < 4; k++) {
      var ox = (k % 2) * 128, oy = Math.floor(k / 2) * 128;
      var blobs = [[64, 70, 40]];
      var m = 5 + k;
      for (var i = 0; i < m; i++) {
        var a = (i / m) * MA.TAU + rnd(), rr = 16 + rnd() * 14;
        blobs.push([64 + Math.cos(a) * (26 + rnd() * 6), 68 + Math.sin(a) * 15 - 4, rr]);
      }
      for (i = 0; i < blobs.length; i++) {
        var b = blobs[i], r = Math.min(b[2], b[0] - 3, 125 - b[0], b[1] - 3, 125 - b[1]);
        var gr = g.createRadialGradient(ox + b[0], oy + b[1], 0, ox + b[0], oy + b[1], r);
        gr.addColorStop(0, 'rgba(255,255,255,1)');
        gr.addColorStop(0.55, 'rgba(255,255,255,0.8)');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr;
        g.fillRect(ox, oy, 128, 128);
      }
    }
    var t = new T.CanvasTexture(c);
    t.minFilter = T.LinearMipmapLinearFilter;
    t.magFilter = T.LinearFilter;
    return t;
  }

  function add(x, y, z, w, h, atlas, gold) {
    if (n >= MAXN) return -1;
    iPos[n * 3] = x; iPos[n * 3 + 1] = y; iPos[n * 3 + 2] = z;
    iPar[n * 4] = w; iPar[n * 4 + 1] = h; iPar[n * 4 + 2] = atlas; iPar[n * 4 + 3] = gold || 0;
    return n++;
  }

  function layout() {
    var rnd = MA.rng(2024), i, k, a, r, D = MA.dest;
    // 1) far cloud banks on the horizon
    for (i = 0; i < 34; i++) {
      a = (i / 34) * MA.TAU + rnd() * 0.15;
      r = 1500 + rnd() * 700;
      var s = 380 + rnd() * 320;
      add(Math.sin(a) * r, 40 + rnd() * 130 + s * 0.12, Math.cos(a) * r, s, s * 0.55, i % 4);
    }
    // 2) low mist hugging the sea far away: the cloud sea reaches the horizon
    for (i = 0; i < 46; i++) {
      a = rnd() * MA.TAU;
      r = 820 + rnd() * 620;
      s = 170 + rnd() * 150;
      add(Math.sin(a) * r, 8 + rnd() * 14, Math.cos(a) * r, s, s * 0.34, i % 4);
    }
    // 3) a sea of clouds to skim, between the bear and the windmill
    a = (-38 * Math.PI) / 180;
    seaC.x = Math.sin(a) * 300; seaC.z = Math.cos(a) * 300; seaC.r = 150;
    for (i = 0; i < 76; i++) {
      var aa = rnd() * MA.TAU, rr = Math.sqrt(rnd()) * seaC.r;
      s = 44 + rnd() * 30;
      add(seaC.x + Math.cos(aa) * rr, 7 + rnd() * 8, seaC.z + Math.sin(aa) * rr, s, s * 0.5, i % 4);
    }
    // 4) cumulus clumps at flying height (kept off the landmarks)
    var made = 0, tries = 0;
    while (made < 25 && tries++ < 400) {
      a = rnd() * MA.TAU;
      r = 110 + rnd() * 560;
      var cx = Math.sin(a) * r, cz = Math.cos(a) * r, cy = 42 + rnd() * 78, ok = true;
      for (k = 0; k < 4; k++) if (Math.hypot(cx - D[k].p.x, cz - D[k].p.z) < 105 && cy < 85) ok = false;
      for (k = 0; k < clumps.length; k++) if (Math.hypot(cx - clumps[k].x, cz - clumps[k].z) < 95) ok = false;
      if (!ok) continue;
      var big = 26 + rnd() * 20, m = 5 + Math.floor(rnd() * 3);
      for (k = 0; k < m; k++) {
        s = big * (0.7 + rnd() * 0.6);
        add(cx + (rnd() - 0.5) * big * 1.7, cy + (rnd() - 0.5) * big * 0.35, cz + (rnd() - 0.5) * big * 1.7, s * 1.5, s * 0.9, (made + k) % 4);
      }
      clumps.push({ x: cx, y: cy, z: cz, r: big * 1.05 });
      made++;
    }
    // 5) cloud rings along the natural routes
    var mid = function (p, q, u, alt) {
      var x = MA.lerp(p.x, q.x, u), z = MA.lerp(p.z, q.z, u), dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1;
      return { x: x, y: alt, z: z, nx: dx / l, nz: dz / l };
    };
    var O = { x: 0, z: 0 };
    var defs = [mid(O, D[0].p, 0.36, 44), mid(O, D[1].p, 0.5, 62), mid(O, D[2].p, 0.5, 46), mid(O, D[3].p, 0.46, 70),
      mid(D[0].p, D[1].p, 0.5, 84), mid(D[1].p, D[3].p, 0.5, 52), mid(D[3].p, D[2].p, 0.5, 66), mid(D[2].p, D[0].p, 0.5, 56)];
    for (i = 0; i < defs.length; i++) {
      var rg = defs[i];
      rg.R = 15; rg.first = n; rg.pulse = 0; rg.cd = 0; rg.tw = rnd() * 3;
      for (k = 0; k < RN; k++) {
        a = (k / RN) * MA.TAU;
        var sx = Math.cos(a) * rg.R, sy = Math.sin(a) * rg.R;
        add(rg.x + rg.nz * sx, rg.y + sy, rg.z - rg.nx * sx, 14, 12, k % 4, 1);
      }
      rings.push(rg);
    }
  }

  MA.late.clouds = {
    ready: false,
    rings: rings,
    init: function (scene) {
      MA.defer(layout);
      MA.defer(function () {
        var g = new T.InstancedBufferGeometry();
        g.setAttribute('position', new T.BufferAttribute(new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0]), 3));
        g.setAttribute('uv', new T.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2));
        g.setIndex([0, 1, 2, 0, 2, 3]);
        g.setAttribute('iPos', new T.InstancedBufferAttribute(iPos.subarray(0, n * 3), 3));
        parAttr = new T.InstancedBufferAttribute(iPar.subarray(0, n * 4), 4);
        parAttr.setUsage(T.DynamicDrawUsage);
        g.setAttribute('iPar', parAttr);
        g.instanceCount = n;
        mesh = new T.Mesh(g, new T.ShaderMaterial({
          uniforms: {
            map: { value: puffTexture() }, time: MA.uni.time,
            fogColor: MA.uni.fogColor, fogDensity: MA.uni.fogDensity,
            cTop: { value: new T.Color(0xffffff) }, cBot: { value: new T.Color(0xbfdcf6) },
          },
          vertexShader:
            'attribute vec3 iPos; attribute vec4 iPar; uniform float time;\n' +
            'varying vec2 vUv; varying vec2 vL; varying float vDist; varying float vGold;\n' +
            'void main(){\n' +
            '  vec4 mv = viewMatrix * vec4(iPos, 1.0);\n' +
            '  float breathe = 1.0 + 0.035 * sin(time * 0.45 + iPos.x * 0.05 + iPos.z * 0.07);\n' +
            '  mv.xy += position.xy * iPar.xy * breathe;\n' +
            '  gl_Position = projectionMatrix * mv;\n' +
            '  float idx = floor(iPar.z + 0.5);\n' +
            '  vUv = (uv * 0.96 + 0.02 + vec2(mod(idx, 2.0), floor(idx * 0.5))) * 0.5;\n' +
            '  vL = uv; vDist = -mv.z; vGold = iPar.w;\n' +
            '}',
          fragmentShader:
            'precision highp float;\n' +
            'uniform sampler2D map; uniform vec3 cTop, cBot;\n' +
            MA.glslFog +
            'varying vec2 vUv; varying vec2 vL; varying float vDist; varying float vGold;\n' +
            'void main(){\n' +
            '  float a = texture2D(map, vUv).a * smoothstep(3.0, 30.0, vDist);\n' + // melt away right at the camera
            '  if (a < 0.012) discard;\n' +
            '  vec3 col = mix(cBot, cTop, smoothstep(0.15, 0.7, vL.y));\n' +
            '  col = mix(col, vec3(1.0, 0.93, 0.72), vGold * 0.4);\n' +
            '  col = mix(col, fogColor, fogAmount(max(vDist, 0.0) * 0.42) * 0.9);\n' +
            '  gl_FragColor = vec4(col, a * 0.96);\n' +
            '  #include <colorspace_fragment>\n' +
            '}',
          transparent: true, depthWrite: false, fog: false,
        }));
        mesh.frustumCulled = false;
        mesh.renderOrder = 10;
        scene.add(mesh);
      });
    },
    update: function (dt) {
      if (!mesh) return;
      var s = MA.ship, p = s.pos, i, k, L = MA.late, t = MA.uni.time.value;
      // --- inside a cloud? soft white-out + wind ---
      var v = 0;
      for (i = 0; i < clumps.length; i++) {
        var c = clumps[i], d = Math.hypot(p.x - c.x, (p.y - c.y) * 1.8, p.z - c.z);
        if (d < c.r) v = Math.max(v, 1 - d / c.r);
      }
      var ds = Math.hypot(p.x - seaC.x, p.z - seaC.z);
      if (ds < seaC.r && p.y < 19) v = Math.max(v, MA.clamp((19 - p.y) / 9, 0, 1) * MA.clamp((seaC.r - ds) / 30, 0, 1) * 0.7);
      v = MA.state === 'fly' ? Math.min(v * 1.6, 1) : 0;
      whooshCd -= dt;
      if (v > 0.3 && veil <= 0.3 && whooshCd < 0) { MA.audio.sfx('whoosh'); whooshCd = 2.5; }
      veil = MA.damp(veil, v, 3, dt);
      MA.veil = veil;

      // --- cloud rings ---
      var dirty = false;
      for (i = 0; i < rings.length; i++) {
        var r = rings[i];
        r.cd -= dt;
        if (havePrev && r.cd < 0) {
          var s0 = (prev.x - r.x) * r.nx + (prev.z - r.z) * r.nz, s1 = (p.x - r.x) * r.nx + (p.z - r.z) * r.nz;
          if (s0 * s1 < 0) {
            var u = s0 / (s0 - s1), hx = MA.lerp(prev.x, p.x, u) - r.x, hy = MA.lerp(prev.y, p.y, u) - r.y, hz = MA.lerp(prev.z, p.z, u) - r.z;
            if (hx * hx + hy * hy + hz * hz < (r.R + 2) * (r.R + 2)) {
              r.cd = 4; r.pulse = 1;
              MA.audio.sfx('chime', i);
              if (L.fx) L.fx.burst(r, 0xfff0a0, 26, 13, 1.5, 1.6, -2);
              if (L.friends && L.friends.ready) L.friends.spawnChick(r);
            }
          }
        }
        // a few golden twinkles so rings catch the eye from far away
        var dd = Math.hypot(p.x - r.x, p.z - r.z);
        if (dd < 420 && L.fx && Math.random() < dt * 5) {
          var a = Math.random() * MA.TAU, q = Math.random() * r.R * 0.85;
          L.fx.emit(r.x + r.nz * Math.cos(a) * q, r.y + Math.sin(a) * q, r.z - r.nx * Math.cos(a) * q, 0, 0.6, 0, 0xfff0a0, 0.9 + dd * 0.009, 1.2, 0);
        }
        if (r.pulse > 0) {
          r.pulse = Math.max(0, r.pulse - dt * 1.2);
          var sc = 1 + Math.sin(r.pulse * Math.PI) * 0.7;
          for (k = 0; k < RN; k++) { iPar[(r.first + k) * 4] = 14 * sc; iPar[(r.first + k) * 4 + 1] = 12 * sc; }
          dirty = true;
        }
      }
      if (dirty) parAttr.needsUpdate = true;
      prev.copy(p);
      havePrev = true;
    },
  };
})();
