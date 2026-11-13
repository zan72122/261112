// friends.js (late) - company in the sky.
//   * cloud chicks: pop out of cloud rings and flutter along on both sides of the ship
//   * gulls: a small flock that glides around and joins the ship in a V for a while
// Both are drawn with InstancedMesh (bodies + wings), a handful of draw calls in total.
(function () {
  'use strict';
  var T = THREE, MA = window.MA, P = MA.pal;
  var MAXC = 7, NB = 6;
  var chicks = [], birds = [], chickBody, chickWing, birdBody, birdWing;
  var _p = new T.Vector3(), _q = new T.Quaternion(), _s = new T.Vector3(), _e = new T.Euler(0, 0, 0, 'YXZ');
  var _m = new T.Matrix4(), _w = new T.Matrix4();
  var flock = { mode: 'roam', t: 0, cd: 6, ax: 60, az: 150, ang: 0, cx: 0, cy: 60, cz: 0, call: 3 };
  var hop = 0;

  // a yellow chick sitting in its own little puff of cloud
  function chickGeo() {
    var g = new MA.Geo(), Y = 0xffe066, i, s;
    for (i = 0; i < 6; i++) {
      var a = (i / 6) * MA.TAU;
      g.sph(P.white, 0.62, [Math.sin(a) * 0.85, -0.62, Math.cos(a) * 0.85], [1, 0.8, 1], 6, 5);
    }
    g.sph(P.white, 0.8, [0, -0.75, 0], [1, 0.7, 1], 6, 5);
    g.sph(Y, 0.88, [0, 0.15, 0], [1, 0.95, 1.05], 10, 8);
    g.sph(Y, 0.64, [0, 1.08, 0.3], null, 9, 7);
    g.cone(Y, 0.3, 0.8, [0, 0.35, -1.0], [-Math.PI / 2 - 0.5, 0, 0], 5);
    g.cone(0xff9a2e, 0.2, 0.5, [0, 1.02, 1.0], [Math.PI / 2, 0, 0], 5);
    g.cone(Y, 0.14, 0.4, [0, 1.8, 0.25], [0.3, 0, 0], 4);
    for (s = -1; s <= 1; s += 2) {
      g.sph(P.ink, 0.11, [s * 0.28, 1.22, 0.82], null, 5, 4);
      g.sph(0xffa9b9, 0.16, [s * 0.46, 1.0, 0.72], [1, 0.7, 0.5], 5, 4);
    }
    return g.build();
  }
  function birdGeo() {
    var g = new MA.Geo();
    g.sph(P.white, 0.7, [0, 0, 0], [0.8, 0.7, 2.0], 8, 6);
    g.sph(P.white, 0.45, [0, 0.25, 1.35], null, 7, 5);
    g.cone(P.yellow, 0.16, 0.6, [0, 0.2, 1.95], [Math.PI / 2, 0, 0], 5);
    g.box(0xc9d3df, [0.7, 0.08, 0.8], [0, 0, -1.6]);
    g.sph(P.ink, 0.08, [0.28, 0.38, 1.6], null, 4, 3);
    g.sph(P.ink, 0.08, [-0.28, 0.38, 1.6], null, 4, 3);
    return g.build();
  }
  function wingGeo(len, wide, tip, col) {
    var g = new MA.Geo();
    g.sph(col || P.white, 0.5, [len * 0.5, 0, 0], [len, 0.1, wide], 7, 4);
    if (tip) g.sph(tip, 0.5, [len * 0.92, 0.02, -wide * 0.12], [len * 0.42, 0.11, wide * 0.7], 6, 4);
    return g.build();
  }
  // body matrix in _m; then two wings hinged at (+-px, py, pz), flapping by phi
  function setWings(mesh, idx, px, py, pz, phi) {
    for (var s = -1; s <= 1; s += 2) {
      _w.makeRotationZ(s > 0 ? phi : -phi);
      if (s < 0) _w.multiply(_t2.makeRotationY(Math.PI));
      _w.setPosition(s * px, py, pz);
      _w.premultiply(_m);
      mesh.setMatrixAt(idx * 2 + (s > 0 ? 0 : 1), _w);
    }
  }
  var _t2 = new T.Matrix4();

  var fr = (MA.late.friends = {
    ready: false,
    init: function (scene) {
      MA.defer(function () {
        chickBody = new T.InstancedMesh(chickGeo(), MA.mat.lambert, MAXC);
        chickWing = new T.InstancedMesh(wingGeo(0.95, 0.9, null, 0xffe066), MA.mat.lambert, MAXC * 2);
        birdBody = new T.InstancedMesh(birdGeo(), MA.mat.lambert, NB);
        birdWing = new T.InstancedMesh(wingGeo(2.6, 1.3, 0xb9c6d6), MA.mat.lambert, NB * 2);
        [chickBody, chickWing, birdBody, birdWing].forEach(function (m) {
          m.instanceMatrix.setUsage(T.DynamicDrawUsage);
          m.frustumCulled = false;
          scene.add(m);
        });
        chickBody.count = 0;
        chickWing.count = 0;
        for (var i = 0; i < NB; i++) birds.push({ p: new T.Vector3(60 + i * 4, 60, 150 + i * 3), yaw: 0, roll: 0, ph: i * 1.3, glide: 0 });
      });
    },
    chickCount: function () { return chicks.length; },
    spawnChick: function (at) {
      if (!chickBody) return;
      if (chicks.length >= MAXC) { this.cheer(); return; }
      chicks.push({ p: new T.Vector3(at.x, at.y, at.z), yaw: MA.ship.yaw, born: 0, ph: Math.random() * 6, cheep: 0.2 + Math.random() });
      chickBody.count = chicks.length;
      chickWing.count = chicks.length * 2;
      MA.audio.sfx('cheep', 1);
    },
    // everyone does a happy hop
    cheer: function () {
      hop = 1;
      if (chicks.length) MA.audio.sfx('cheep', 1.1);
      if (flock.mode === 'follow') MA.audio.sfx('gull');
    },
    update: function (dt) {
      if (!chickBody) return;
      var ship = MA.ship, t = MA.uni.time.value, i, rank, back;
      hop = Math.max(0, hop - dt * 0.7);

      // ---- cloud chicks ----
      for (i = 0; i < chicks.length; i++) {
        var c = chicks[i];
        c.born += dt;
        // a loose little flock on both sides of the ship (they lag a few metres on their own)
        rank = Math.floor(i / 2) + 1;
        var fwx = Math.sin(ship.yaw), fwz = Math.cos(ship.yaw), ahead = 3.4 - rank * 1.4;
        var side = (i % 2 ? 1 : -1) * (5.2 + rank * 1.9) + Math.sin(t * 1.1 + c.ph) * 0.7;
        _p.set(ship.pos.x + fwx * ahead + fwz * side, ship.pos.y - 1.6 + rank * 0.35 + Math.sin(t * 2.3 + c.ph) * 0.6 + Math.abs(Math.sin((hop * 3 + i * 0.25) * Math.PI)) * hop * 2, ship.pos.z + fwz * ahead - fwx * side);
        var dx = _p.x - c.p.x, dz = _p.z - c.p.z;
        if (dx * dx + dz * dz < 9) { dx = fwx; dz = fwz; }
        var rate = c.born < 1.5 ? 1.6 : 4.5;
        c.p.x = MA.damp(c.p.x, _p.x, rate, dt); c.p.y = MA.damp(c.p.y, _p.y, rate, dt); c.p.z = MA.damp(c.p.z, _p.z, rate, dt);
        c.yaw += MA.wrapPi(Math.atan2(dx, dz) - c.yaw) * Math.min(1, dt * 5);
        var sc = 0.85 * MA.ease.outBack(MA.clamp(c.born / 0.5, 0, 1));
        // a happy twirl shows their faces to the camera
        _e.set(Math.sin(t * 2.3 + c.ph) * 0.12, c.yaw + MA.ease.inOut(hop) * MA.TAU, Math.sin(t * 3.1 + c.ph) * 0.15);
        _m.compose(c.p, _q.setFromEuler(_e), _s.set(sc, sc, sc));
        chickBody.setMatrixAt(i, _m);
        setWings(chickWing, i, 0.75, 0.3, 0, Math.sin(t * 22 + c.ph) * 0.7 + 0.2);
        c.cheep -= dt;
        if (c.cheep < 0) { c.cheep = 5 + Math.random() * 9; MA.audio.sfx('cheep', 0.9 + (i % 3) * 0.12); }
      }
      if (chicks.length) { chickBody.instanceMatrix.needsUpdate = true; chickWing.instanceMatrix.needsUpdate = true; }

      // ---- gulls ----
      flock.t += dt;
      flock.cd -= dt;
      var fx = Math.sin(ship.yaw), fz = Math.cos(ship.yaw);
      if (flock.mode === 'roam') {
        flock.ang += dt * 0.22;
        flock.cx = flock.ax + Math.cos(flock.ang) * 55;
        flock.cz = flock.az + Math.sin(flock.ang) * 55;
        flock.cy = 58 + Math.sin(flock.ang * 1.7) * 12;
        if (MA.state === 'fly' && flock.cd < 0 && Math.hypot(ship.pos.x - flock.cx, ship.pos.z - flock.cz) < 130) {
          flock.mode = 'follow'; flock.t = 0;
          MA.audio.sfx('gull');
        }
      } else if (flock.t > 45) {
        // wave goodbye: glide off to a new place ahead and wait there
        flock.mode = 'roam'; flock.cd = 22;
        var a = ship.yaw + (Math.random() - 0.5) * 2.4, r = 190;
        flock.ax = MA.clamp(ship.pos.x + Math.sin(a) * r, -480, 480);
        flock.az = MA.clamp(ship.pos.z + Math.cos(a) * r, -480, 480);
        flock.ang = Math.atan2(ship.pos.z - flock.az, ship.pos.x - flock.ax);
      }
      flock.call -= dt;
      if (flock.call < 0 && flock.mode === 'follow') { flock.call = 7 + Math.random() * 8; MA.audio.sfx('gull'); }
      for (i = 0; i < NB; i++) {
        var b = birds[i], sd = i % 2 ? 1 : -1;
        rank = Math.floor(i / 2) + 1;
        if (flock.mode === 'follow') {
          // V formation beside and a little ahead of the ship (right = (-fz, fx))
          var lat = sd * (8 + rank * 4.2);
          back = rank * 3.4 - 12;
          _p.set(ship.pos.x - fz * lat - fx * back, ship.pos.y + 1.5 + rank * 0.7 + Math.sin(t * 1.3 + b.ph) * 0.6 + hop * Math.abs(Math.sin(hop * 9 + i)) * 1.5, ship.pos.z + fx * lat - fz * back);
        } else {
          var a2 = flock.ang + 0.9 - rank * 0.09;
          _p.set(flock.ax + Math.cos(a2) * (55 + sd * rank * 3), flock.cy + Math.sin(t * 0.8 + b.ph), flock.az + Math.sin(a2) * (55 + sd * rank * 3));
        }
        var ddx = _p.x - b.p.x, ddy = _p.y - b.p.y, ddz = _p.z - b.p.z, dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
        if (dist > 0.01) {
          var step = Math.min(dist * 1.6, 44) * dt / dist;
          b.p.x += ddx * step; b.p.y += ddy * step; b.p.z += ddz * step;
          var wantYaw = dist > 3 ? Math.atan2(ddx, ddz) : flock.mode === 'follow' ? ship.yaw : b.yaw;
          var dy = MA.wrapPi(wantYaw - b.yaw) * Math.min(1, dt * 3);
          b.yaw += dy;
          b.roll = MA.damp(b.roll, MA.clamp(-dy / Math.max(dt, 0.001) * 0.35, -0.6, 0.6), 4, dt);
        }
        _e.set(MA.clamp(-ddy * 0.02, -0.3, 0.3), b.yaw, b.roll);
        _m.compose(b.p, _q.setFromEuler(_e), _s.set(1.05, 1.05, 1.05));
        birdBody.setMatrixAt(i, _m);
        // flap, with short glides
        var fl = Math.sin(t * 7.5 + b.ph), gl = Math.sin(t * 0.6 + b.ph * 2) > 0.55 ? 0.15 : 1;
        setWings(birdWing, i, 0.4, 0.15, 0.2, fl * 0.55 * gl + 0.12);
      }
      birdBody.instanceMatrix.needsUpdate = true;
      birdWing.instanceMatrix.needsUpdate = true;
    },
  });
})();
