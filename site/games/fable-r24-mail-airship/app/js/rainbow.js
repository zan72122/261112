// rainbow.js (late) - the finale. When the last parcel has arrived, a rainbow arch draws itself
// across the whole sky in front of the ship. It can be flown through again and again
// (sparkles and a fanfare each time) and the flight simply goes on afterwards.
(function () {
  'use strict';
  var T = THREE, MA = window.MA;
  var A = 135, B = 104, W = 13, D = 4; // half width, height, band half-width, half-depth
  var AHEAD = 320; // far enough that the whole arch fits in view when it appears
  var mesh = null, mat = null, on = false, tStart = 0, cd = 0, trailT = 0;
  var c = new T.Vector3(), nx = 0, nz = 1, prevS = 0, havePrev = false, _v = new T.Vector3();

  function build() {
    var SA = 56, SB = 10, pos = [], aT = [], aBand = [], idx = [], i, j;
    for (i = 0; i <= SA; i++) {
      var a = (i / SA) * Math.PI, ca = Math.cos(a), sa = Math.sin(a);
      for (j = 0; j <= SB; j++) {
        var b = (j / SB) * MA.TAU, cb = Math.cos(b), sb = Math.sin(b);
        pos.push(-ca * A - ca * W * cb, sa * B + sa * W * cb, D * sb);
        aT.push(i / SA);
        aBand.push(0.5 + 0.5 * cb);
      }
    }
    for (i = 0; i < SA; i++) for (j = 0; j < SB; j++) {
      var p = i * (SB + 1) + j, q = p + SB + 1;
      idx.push(p, q, p + 1, p + 1, q, q + 1);
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aT', new T.BufferAttribute(new Float32Array(aT), 1));
    g.setAttribute('aBand', new T.BufferAttribute(new Float32Array(aBand), 1));
    g.setIndex(idx);
    var pal = MA.late.fx.RAINBOW.map(function (h) { return new T.Color(h); }).reverse(); // red on the outside
    mat = new T.ShaderMaterial({
      uniforms: { time: MA.uni.time, rev: { value: 0 }, pal: { value: pal } },
      vertexShader:
        'attribute float aT; attribute float aBand; varying float vT; varying float vBand; varying float vY;\n' +
        'void main(){ vT = aT; vBand = aBand; vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader:
        'precision highp float; uniform float time, rev; uniform vec3 pal[7]; varying float vT; varying float vBand; varying float vY;\n' +
        'void main(){\n' +
        '  float f = clamp(vBand, 0.0, 0.999) * 7.0;\n' +
        '  int k = int(floor(f));\n' +
        '  vec3 col = pal[0];\n' +
        '  for (int i = 1; i < 7; i++) { if (i == k) col = pal[i]; }\n' +
        '  col += 0.07 * sin(time * 2.0 + vT * 60.0);\n' +
        '  float a = 0.84 * smoothstep(1.0, 26.0, vY) * (1.0 - smoothstep(rev - 0.04, rev, vT));\n' +
        '  if (a < 0.01) discard;\n' +
        '  gl_FragColor = vec4(col, a);\n' +
        '  #include <colorspace_fragment>\n' +
        '}',
      transparent: true, depthWrite: false, side: T.DoubleSide, fog: false,
    });
    mesh = new T.Mesh(g, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
    return mesh;
  }

  MA.late.rainbow = {
    ready: false,
    active: function () { return on; },
    init: function () {},
    start: function () {
      if (on) return;
      var ship = MA.ship, fx = Math.sin(ship.yaw), fz = Math.cos(ship.yaw);
      // Straight ahead of the ship, so it is seen at once and can be reached by just flying on.
      // If that would be beyond the edge of the sky, slide it back inside (it still faces her).
      nx = fx; nz = fz;
      c.set(ship.pos.x + fx * AHEAD, 0, ship.pos.z + fz * AHEAD);
      var r = Math.hypot(c.x, c.z), lim = MA.world.BOUND_R - 40;
      if (r > lim) c.multiplyScalar(lim / r);
      MA.scene.add(build());
      mesh.position.copy(c);
      mesh.rotation.y = Math.atan2(nx, nz);
      on = true;
      tStart = MA.uni.time.value;
      havePrev = false;
      MA.audio.sfx('rainbow');
    },
    update: function (dt) {
      if (!on) return;
      var ship = MA.ship, L = MA.late, t = MA.uni.time.value - tStart, p = ship.pos;
      var rev = MA.clamp(t / 5.5, 0, 1) * 1.05;
      mat.uniforms.rev.value = rev;
      // sparkles at the tip while the arch is being drawn
      if (rev < 1 && L.fx) {
        var a = rev * Math.PI;
        _v.set(-Math.cos(a) * A, Math.sin(a) * B, 0);
        mesh.localToWorld(_v);
        for (var i = 0; i < 3; i++) L.fx.emit(_v.x, _v.y, _v.z, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, L.fx.RAINBOW[Math.floor(Math.random() * 7)], 5, 1.2, -3);
      }
      // flying through the arch
      cd -= dt;
      var s = (p.x - c.x) * nx + (p.z - c.z) * nz;
      if (havePrev && s * prevS < 0 && cd < 0 && t > 1) {
        var lx = (p.x - c.x) * nz - (p.z - c.z) * nx, q = 1 - (lx * lx) / (A * A);
        if (q > 0 && p.y < B * Math.sqrt(q) + W) {
          cd = 3;
          trailT = 14;
          MA.audio.sfx('through');
          if (L.fx) L.fx.burst(p, 'rainbow', 70, 22, 2.6, 2.4, -3);
          if (L.friends && L.friends.ready) L.friends.cheer();
        }
      }
      prevS = s;
      havePrev = true;
      // rainbow sparkles stream from the propeller for a while afterwards
      if (trailT > 0 && L.fx) {
        trailT -= dt;
        if (Math.random() < dt * 45) {
          ship.prop.getWorldPosition(_v);
          L.fx.emit(_v.x + (Math.random() - 0.5) * 2, _v.y + (Math.random() - 0.5) * 2, _v.z + (Math.random() - 0.5) * 2, 0, 0.5, 0, L.fx.RAINBOW[Math.floor(Math.random() * 7)], 1.7, 1.6, -0.6);
        }
      }
    },
  };
})();
