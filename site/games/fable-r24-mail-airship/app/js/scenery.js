// scenery.js (late) - small things to discover while roaming, all cheap:
//   far rocky islets on the horizon (never reachable, just depth), hot-air balloons that
//   bob out of the way with a "boing", little sailing boats, and a whale that jumps and spouts.
(function () {
  'use strict';
  var T = THREE, MA = window.MA, P = MA.pal;
  var balloons = [], boats = [], bMesh, boatMesh, whale = null, tail = null;
  var _m = new T.Matrix4(), _q = new T.Quaternion(), _e = new T.Euler(), _s = new T.Vector3(), _p = new T.Vector3();
  var WH = { cx: 215, cz: 185, r: 62, a: 0, jump: 5, jt: -1, spout: 2 };
  var BCOL = [0xff7fb5, 0xffd24a, 0x4bc0f2, 0xff9a2e, 0x7f7bff, 0x3fcf8e];

  function farIslets(scene) {
    var g = new MA.Geo(), rnd = MA.rng(99), i, k;
    for (i = 0; i < 11; i++) {
      var a = (i / 11) * MA.TAU + rnd() * 0.3, r = 1050 + rnd() * 520, x = Math.sin(a) * r, z = Math.cos(a) * r;
      var n = 1 + Math.floor(rnd() * 3);
      for (k = 0; k < n; k++) {
        var h = 36 + rnd() * 70, w = 60 + rnd() * 70;
        g.cone(k % 2 ? 0x8fbfae : 0x9fb2d2, w, h, [x + (rnd() - 0.5) * 120, h * 0.5 - 4, z + (rnd() - 0.5) * 120], [0, rnd() * 3, 0], 7);
      }
    }
    var m = g.mesh();
    scene.add(m);
  }

  function balloonGeo() {
    var g = new MA.Geo();
    // white and grey gores: the instance colour tints them into two shades
    g.lathe(function (x, y, z) {
      return Math.floor(((Math.atan2(x, z) + Math.PI) / MA.TAU) * 10 + 0.001) % 2 ? 0xffffff : 0xb8b8b8;
    }, [[1.2, -5.2], [3.4, -2.6], [5.2, 0.6], [5.4, 2.6], [4.4, 4.9], [2.4, 6.3], [0, 6.8]], [0, 0, 0], null, 10);
    g.cyl(0xd8c0a0, 1.25, 1.0, 1.5, [0, -8.2, 0], null, 6);
    for (var i = 0; i < 4; i++) {
      var a = (i / 4) * MA.TAU + 0.5;
      g.cyl(0xffffff, 0.05, 0.05, 2.6, [Math.sin(a) * 1.1, -6.3, Math.cos(a) * 1.1], null, 3);
    }
    return g.build();
  }
  function boatGeo() {
    var g = new MA.Geo();
    g.sph(0xffffff, 2.2, [0, 0.2, 0], [0.55, 0.4, 1.4], 8, 5);
    g.cyl(0xd8c0a0, 0.09, 0.09, 5, [0, 2.9, 0.3], null, 4);
    g.cone(0xffffff, 1.9, 4.2, [0, 3.2, -0.5], [0, Math.PI / 4, 0], 3);
    return g.build();
  }

  MA.late.scenery = {
    ready: false,
    init: function (scene) {
      MA.defer(function () { farIslets(scene); });
      MA.defer(function () {
        var rnd = MA.rng(404), i;
        bMesh = new T.InstancedMesh(balloonGeo(), MA.mat.lambert, 6);
        var spots = [[-150, 78, 150], [170, 96, 250], [270, 70, -180], [-40, 104, -230], [-290, 88, -150], [120, 64, 70]];
        for (i = 0; i < 6; i++) {
          balloons.push({ x: spots[i][0], y: spots[i][1], z: spots[i][2], ox: 0, oy: 0, oz: 0, vx: 0, vy: 0, vz: 0, ph: rnd() * 6, cd: 0 });
          bMesh.setColorAt(i, MA.col(BCOL[i]));
        }
        boatMesh = new T.InstancedMesh(boatGeo(), MA.mat.lambert, 5);
        var bs = [[120, -150, 40], [-230, 120, 55], [60, 215, 35], [-90, -220, 45], [300, 110, 50]];
        for (i = 0; i < 5; i++) {
          boats.push({ cx: bs[i][0], cz: bs[i][1], r: bs[i][2], a: rnd() * 6, w: (0.05 + rnd() * 0.04) * (i % 2 ? 1 : -1) });
          boatMesh.setColorAt(i, MA.col([0xffffff, 0xffd9e8, 0xfff0b0, 0xd9f0ff, 0xffffff][i]));
        }
        [bMesh, boatMesh].forEach(function (m) {
          m.instanceMatrix.setUsage(T.DynamicDrawUsage);
          m.frustumCulled = false;
          scene.add(m);
        });
      });
      MA.defer(function () {
        var g = new MA.Geo(), s;
        g.sph(function (x, y, z) { return y < -1.2 ? 0xcfe6fa : 0x4f93dc; }, 6, [0, 0, 0], [1, 0.78, 2.3], 12, 8);
        for (s = -1; s <= 1; s += 2) {
          g.sph(P.white, 0.7, [s * 4.6, 0.6, 8], null, 6, 5);
          g.sph(P.ink, 0.4, [s * 4.95, 0.7, 8.3], null, 5, 4);
          g.sph(0x4f93dc, 2.4, [s * 5.6, -2.4, 3], [1.5, 0.25, 0.8], 7, 4, [0, 0, s * 0.5]);
        }
        whale = g.mesh();
        g = new MA.Geo();
        g.sph(0x4f93dc, 2, [0, 0, -2.6], [0.7, 0.6, 2.2], 7, 5);
        for (s = -1; s <= 1; s += 2) g.sph(0x4f93dc, 2.6, [s * 2.4, 0, -6.4], [1.3, 0.22, 0.8], 7, 4, [0, s * 0.5, 0]);
        tail = g.mesh();
        tail.position.set(0, 0.4, -11.5);
        whale.add(tail);
        scene.add(whale);
      });
    },
    update: function (dt) {
      if (!whale) return;
      var ship = MA.ship, t = MA.uni.time.value, i, fx = MA.late.fx;
      // --- balloons: bob gently; nudge away with a boing when the ship brushes past ---
      for (i = 0; i < balloons.length; i++) {
        var b = balloons[i];
        var px = b.x + b.ox, py = b.y + b.oy + Math.sin(t * 0.6 + b.ph) * 2.2, pz = b.z + b.oz;
        var dx = px - ship.pos.x, dy = py - ship.pos.y, dz = pz - ship.pos.z, d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        b.cd -= dt;
        if (d < 13 && MA.state === 'fly') {
          var k = (13 - d) * 9 / (d + 0.01);
          b.vx += dx * k * dt; b.vy += (dy * k + 20) * dt; b.vz += dz * k * dt;
          if (b.cd < 0) { b.cd = 1.5; MA.audio.sfx('boing'); if (fx) fx.burst(_p.set(px, py, pz), BCOL[i], 10, 8, 1.4, 1.2, -3); }
        }
        // spring back to its place
        b.vx += (-b.ox * 1.2 - b.vx * 1.6) * dt; b.vy += (-b.oy * 1.2 - b.vy * 1.6) * dt; b.vz += (-b.oz * 1.2 - b.vz * 1.6) * dt;
        b.ox += b.vx * dt; b.oy += b.vy * dt; b.oz += b.vz * dt;
        _e.set(MA.clamp(b.vz * 0.03, -0.4, 0.4) + Math.sin(t * 0.5 + b.ph) * 0.04, t * 0.08 + b.ph, MA.clamp(-b.vx * 0.03, -0.4, 0.4));
        _m.compose(_p.set(px, py, pz), _q.setFromEuler(_e), _s.set(1.5, 1.5, 1.5));
        bMesh.setMatrixAt(i, _m);
      }
      bMesh.instanceMatrix.needsUpdate = true;
      // --- sailing boats going round in lazy circles ---
      for (i = 0; i < boats.length; i++) {
        var o = boats[i];
        o.a += o.w * dt;
        _e.set(Math.sin(t * 1.1 + i) * 0.06, -o.a + (o.w > 0 ? 0 : Math.PI), Math.sin(t * 0.9 + i * 2) * 0.08);
        _m.compose(_p.set(o.cx + Math.cos(o.a) * o.r, 0.3 + Math.sin(t * 1.3 + i) * 0.2, o.cz + Math.sin(o.a) * o.r), _q.setFromEuler(_e), _s.set(1.6, 1.6, 1.6));
        boatMesh.setMatrixAt(i, _m);
      }
      boatMesh.instanceMatrix.needsUpdate = true;
      // --- the whale: cruises at the surface, spouts, and sometimes leaps ---
      WH.a += dt * 0.11;
      var wx = WH.cx + Math.cos(WH.a) * WH.r, wz = WH.cz + Math.sin(WH.a) * WH.r, wy = -2.2 + Math.sin(t * 0.8) * 0.5, pitch = 0;
      WH.jump -= dt;
      if (WH.jump < 0 && WH.jt < 0) { WH.jt = 0; WH.jump = 13 + Math.random() * 8; }
      if (WH.jt >= 0) {
        var u0 = WH.jt / 2.6;
        WH.jt += dt;
        var u = WH.jt / 2.6;
        wy += Math.sin(Math.min(u, 1) * Math.PI) * 13;
        pitch = Math.cos(Math.min(u, 1) * Math.PI) * -0.75;
        if (fx && ((u0 < 0.08 && u >= 0.08) || (u0 < 0.92 && u >= 0.92))) {
          fx.burst(_p.set(wx, 1, wz), 0xffffff, 26, 13, 2.4, 1.3, -14);
          if (Math.hypot(ship.pos.x - wx, ship.pos.z - wz) < 260) MA.audio.sfx('splash');
        }
        if (u >= 1) WH.jt = -1;
      } else {
        WH.spout -= dt;
        if (WH.spout < 0 && fx) {
          WH.spout = 4 + Math.random() * 3;
          for (i = 0; i < 12; i++) fx.emit(wx, 2.5, wz, (Math.random() - 0.5) * 3, 9 + Math.random() * 6, (Math.random() - 0.5) * 3, 0xffffff, 1.8, 1.3, -9);
        }
      }
      whale.position.set(wx, wy, wz);
      whale.rotation.set(pitch, -WH.a, 0, 'YXZ');
      tail.rotation.x = Math.sin(t * 2.2) * 0.35 + pitch * 0.4;
    },
  };
})();
