// fx.js (late) - one pooled Points cloud for every sparkle, puff and confetti in the game.
(function () {
  'use strict';
  var T = THREE, MA = window.MA;
  var N = 520;
  var pos, col, dat, vel = new Float32Array(N * 3), life = new Float32Array(N), life0 = new Float32Array(N);
  var size = new Float32Array(N), grav = new Float32Array(N), head = 0, points = null, alive = 0, gusting = false;
  var CONFETTI = [0xff7fb5, 0xff9a2e, 0x3fcf8e, 0x7f7bff, 0xffd24a, 0x4bc0f2, 0xffffff];
  var RAINBOW = [0xf2594b, 0xff9a2e, 0xffd24a, 0x3fcf8e, 0x4bc0f2, 0x7f7bff, 0xc77dff];

  var fx = (MA.late.fx = {
    ready: false,
    RAINBOW: RAINBOW,
    init: function (scene) {
      MA.defer(function () {
        var g = new T.BufferGeometry();
        pos = new T.BufferAttribute(new Float32Array(N * 3), 3);
        col = new T.BufferAttribute(new Float32Array(N * 3), 3);
        dat = new T.BufferAttribute(new Float32Array(N * 2), 2);
        pos.setUsage(T.DynamicDrawUsage); col.setUsage(T.DynamicDrawUsage); dat.setUsage(T.DynamicDrawUsage);
        g.setAttribute('position', pos);
        g.setAttribute('aColor', col);
        g.setAttribute('aData', dat);
        points = new T.Points(g, new T.ShaderMaterial({
          uniforms: { uScale: { value: 600 } },
          vertexShader:
            'attribute vec3 aColor; attribute vec2 aData; uniform float uScale; varying vec3 vC; varying float vA;\n' +
            'void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;\n' +
            '  gl_PointSize = min(aData.x * uScale / max(-mv.z, 1.0), 110.0); vC = aColor; vA = aData.y; }',
          fragmentShader:
            'precision highp float; varying vec3 vC; varying float vA;\n' +
            'void main(){ vec2 c = gl_PointCoord * 2.0 - 1.0; float r = dot(c, c); if (r > 1.0 || vA <= 0.0) discard;\n' +
            '  float d = 1.0 - r; float star = max(0.0, 1.0 - abs(c.x * c.y) * 12.0) * d;\n' +
            '  float a = max(d * d, star); vec3 k = mix(vC, vec3(1.0), d * d * 0.75);\n' +
            '  gl_FragColor = vec4(k, a * vA);\n' +
            '  #include <colorspace_fragment>\n' +
            '}',
          transparent: true, depthWrite: false, fog: false,
        }));
        points.frustumCulled = false;
        points.renderOrder = 20;
        scene.add(points);
      });
    },
    emit: function (x, y, z, vx, vy, vz, hex, sz, lf, gr) {
      if (!points) return;
      var i = head;
      head = (head + 1) % N;
      pos.array[i * 3] = x; pos.array[i * 3 + 1] = y; pos.array[i * 3 + 2] = z;
      vel[i * 3] = vx; vel[i * 3 + 1] = vy; vel[i * 3 + 2] = vz;
      var c = MA.col(hex);
      col.array[i * 3] = c.r; col.array[i * 3 + 1] = c.g; col.array[i * 3 + 2] = c.b;
      life[i] = life0[i] = lf;
      size[i] = sz;
      grav[i] = gr || 0;
      col.needsUpdate = true;
    },
    // n sparkles flying outward from p. hex may be 'confetti' or 'rainbow'.
    burst: function (p, hex, n, speed, sz, lf, gr) {
      for (var i = 0; i < n; i++) {
        var a = Math.random() * MA.TAU, u = Math.random() * 2 - 1, s = Math.sqrt(1 - u * u), v = speed * (0.4 + Math.random() * 0.6);
        var c = hex === 'confetti' ? CONFETTI[i % CONFETTI.length] : hex === 'rainbow' ? RAINBOW[i % RAINBOW.length] : hex;
        this.emit(p.x, p.y, p.z, Math.cos(a) * s * v, Math.abs(u) * v * 1.1 + speed * 0.2, Math.sin(a) * s * v, c,
          (sz || 1.1) * (0.6 + Math.random() * 0.8), (lf || 1.4) * (0.6 + Math.random() * 0.7), gr === undefined ? -6 : gr);
      }
    },
    update: function (dt) {
      if (!points) return;
      var P = pos.array, D = dat.array, n = 0;
      for (var i = 0; i < N; i++) {
        if (life[i] <= 0) continue;
        life[i] -= dt;
        var j = i * 3, k = life[i] / life0[i];
        if (life[i] <= 0) { D[i * 2] = 0; D[i * 2 + 1] = 0; continue; }
        vel[j + 1] += grav[i] * dt;
        var drag = 1 - 1.2 * dt;
        vel[j] *= drag; vel[j + 1] *= drag; vel[j + 2] *= drag;
        P[j] += vel[j] * dt; P[j + 1] += vel[j + 1] * dt; P[j + 2] += vel[j + 2] * dt;
        D[i * 2] = size[i] * (0.5 + 0.5 * Math.min(1, (1 - k) * 8)) * (0.75 + 0.25 * Math.sin(life[i] * 18 + i));
        D[i * 2 + 1] = Math.min(1, k * 2.5);
        n++;
      }
      if (n || alive) { pos.needsUpdate = true; dat.needsUpdate = true; }
      alive = n;
      points.visible = n > 0;
      var cam = MA.cam;
      points.material.uniforms.uScale.value = (MA.renderer.domElement.height * 0.5) / Math.tan((cam.fov * Math.PI) / 360);

      // soft white streaks (and a gust) when the homeward wind is blowing
      var s = MA.ship;
      if (s.windK > 0.3 && !gusting) { gusting = true; MA.audio.sfx('gust'); } else if (s.windK < 0.08) gusting = false;
      if (s.windK > 0.08 && Math.random() < s.windK * 0.9) {
        var a = Math.atan2(-s.pos.x, -s.pos.z), sx = Math.sin(a), sz = Math.cos(a);
        var ox = (Math.random() - 0.5) * 50, oy = (Math.random() - 0.5) * 24, oz = (Math.random() - 0.5) * 50;
        this.emit(s.pos.x + ox - sx * 20, s.pos.y + oy, s.pos.z + oz - sz * 20, sx * 42, 0, sz * 42, 0xffffff, 0.8, 1.1, 0);
      }
    },
  });
})();
