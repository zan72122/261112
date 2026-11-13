// airship.js - the mail airship: model, gentle flight model, soft world limits, blob shadow.
// There is no way to crash: the ground lifts the ship, tall things slide it aside,
// and far out a soft wind turns it back home.
(function () {
  'use strict';
  var T = THREE, MA = window.MA, P = MA.pal;
  var clamp = MA.clamp, damp = MA.damp, sstep = MA.sstep;

  var CRUISE = 20, MAX_TURN = 0.72, MAX_CLIMB = 10.5;
  var MIN_ALT = 9, MAX_ALT = 135, CLEARANCE = 8.5, BOUND_R = 640;

  // ---- world registry: islands add height functions and soft obstacles when they load ----
  MA.world = {
    floors: [], // fn(x, z) -> ground height (sea = 0)
    obstacles: [], // {x, z, r, h}: tall things the ship slides around
    groundAt: function (x, z) {
      var h = 0;
      for (var i = 0; i < this.floors.length; i++) {
        var v = this.floors[i](x, z);
        if (v > h) h = v;
      }
      return h;
    },
    BOUND_R: BOUND_R,
    // Places (port + islands): the silhouette is always there, small details are built
    // when the ship comes close and disposed again when it leaves.
    places: [],
    updateLOD: function (scene, p) {
      for (var i = 0; i < this.places.length; i++) {
        var pl = this.places[i], dx = p.x - pl.x, dz = p.z - pl.z, d2 = dx * dx + dz * dz;
        pl.dist = Math.sqrt(d2);
        if (!pl.detail && !pl.building && pl.dist < 340) {
          pl.building = true;
          MA.defer((function (pl) {
            return function () {
              pl.detail = pl.buildDetail();
              scene.add(pl.detail);
              pl.building = false;
            };
          })(pl));
        } else if (pl.detail && pl.dist > 440) {
          if (pl.dropDetail) pl.dropDetail();
          MA.dispose(pl.detail);
          pl.detail = null;
        }
      }
    },
  };

  function buildHull() {
    var g = new MA.Geo();
    // envelope: plump lathe along Z with balloon-gore stripes
    var prof = [[0, -4.7], [0.95, -4.3], [1.85, -3.4], [2.45, -2.1], [2.75, -0.5], [2.75, 0.9], [2.45, 2.3], [1.85, 3.4], [0.95, 4.2], [0, 4.6]];
    g.lathe(function (x, y, z) {
      if (z > 3.4 || z < -3.4) return P.yellow;
      var a = Math.atan2(y, x) + Math.PI;
      return Math.floor((a / MA.TAU) * 8 + 0.02) % 2 === 0 ? P.red : P.cream;
    }, prof, [0, 0, 0], [Math.PI / 2, 0, 0], 16);
    // tail fins
    var fin = function (rz) {
      g.box(P.yellow, [0.22, 2.3, 2.0], [-Math.sin(rz) * 2.3, Math.cos(rz) * 2.3, -3.3], [0.35, 0, rz]);
      g.box(P.red, [0.24, 0.7, 2.0], [-Math.sin(rz) * 3.5, Math.cos(rz) * 3.5, -3.72], [0.35, 0, rz]);
    };
    fin(0); fin(Math.PI * 0.5); fin(-Math.PI * 0.5);
    // envelope emblem: a little letter with a heart seal on both sides
    for (var s = -1; s <= 1; s += 2) {
      g.box(P.white, [0.12, 1.3, 1.9], [s * 2.74, 0.55, 0.4], [0, 0, s * 0.18]);
      g.box(P.red, [0.14, 0.42, 0.42], [s * 2.8, 0.55, 0.4], [Math.PI / 4, 0, s * 0.18]);
    }
    // gondola
    g.box(P.wood, [1.9, 1.25, 4.0], [0, -3.95, 0.6]);
    g.box(P.woodDark, [2.02, 0.22, 4.12], [0, -3.4, 0.6]);
    g.box(P.woodDark, [1.5, 0.3, 3.4], [0, -4.68, 0.6]);
    g.dome(P.cream, 1.0, [0, -3.3, 0.6], [0.95, 0.45, 2.05], 10, 4);
    g.sph(P.yellow, 0.34, [0, -3.9, 2.72]); // headlamp
    for (s = -1; s <= 1; s += 2) {
      for (var k = 0; k < 3; k++) g.box(0x7fd0ff, [0.08, 0.5, 0.6], [s * 0.96, -3.85, -0.4 + k * 1.0]);
      g.cyl(P.woodDark, 0.07, 0.07, 1.3, [s * 0.75, -2.85, 1.9], [0, 0, s * 0.12], 5);
      g.cyl(P.woodDark, 0.07, 0.07, 1.3, [s * 0.75, -2.85, -0.7], [0, 0, s * 0.12], 5);
      // side engine pods
      g.box(P.woodDark, [1.1, 0.14, 0.3], [s * 1.4, -4.05, 0.7]);
      g.sph(P.red, 0.42, [s * 2.0, -4.05, 0.7], [1, 1, 1.7], 8, 6);
    }
    // cargo rack behind the gondola
    g.box(P.woodDark, [2.8, 0.18, 1.5], [0, -4.68, -2.35]);
    g.box(P.wood, [2.8, 0.5, 0.12], [0, -4.4, -3.08]);
    for (s = -1; s <= 1; s += 2) g.box(P.wood, [0.12, 0.5, 1.5], [s * 1.4, -4.4, -2.35]);
    return g.mesh();
  }

  function buildProp(r, blades) {
    var g = new MA.Geo();
    g.cone(P.yellow, r * 0.2, r * 0.42, [0, 0, -r * 0.12], [-Math.PI / 2, 0, 0], 8);
    for (var i = 0; i < blades; i++) {
      var a = (i / blades) * MA.TAU;
      g.box(P.white, [r * 0.3, r * 0.82, r * 0.05], [-Math.sin(a) * r * 0.5, Math.cos(a) * r * 0.5, 0], [0, 0, a]);
      g.box(P.red, [r * 0.3, r * 0.16, r * 0.055], [-Math.sin(a) * r * 0.94, Math.cos(a) * r * 0.94, 0], [0, 0, a]);
    }
    return g.mesh();
  }

  MA.buildShip = function (scene) {
    var group = new T.Group(), model = new T.Group();
    group.add(model);
    model.add(buildHull());
    var prop = buildProp(2.0, 3);
    prop.position.set(0, 0, -4.95);
    model.add(prop);
    var side = [];
    for (var s = -1; s <= 1; s += 2) {
      var sp = buildProp(0.75, 2);
      sp.position.set(s * 2.0, -4.05, -0.15);
      model.add(sp);
      side.push(sp);
    }
    // glow ring behind the main propeller, used as a "touch me" cue in the port
    var glow = new T.Mesh(
      new T.TorusGeometry(2.25, 0.16, 6, 28),
      new T.MeshBasicMaterial({ color: 0xfff6a8, transparent: true, opacity: 0, depthWrite: false, fog: false })
    );
    glow.position.set(0, 0, -5.0);
    glow.visible = false;
    model.add(glow);

    // soft blob shadow on the sea / ground: helps judge where the ship is
    var shadow = new T.Mesh(
      new T.CircleGeometry(1, 20),
      new T.ShaderMaterial({
        uniforms: { op: { value: 0.3 } },
        vertexShader: 'varying vec2 vU; void main(){ vU = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader:
          'precision highp float; uniform float op; varying vec2 vU;\n' +
          'void main(){ float r = length(vU); float a = (1.0 - smoothstep(0.25, 1.0, r)) * op; gl_FragColor = vec4(0.05, 0.12, 0.25, a); }',
        transparent: true,
        depthWrite: false,
        fog: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.renderOrder = 1;
    scene.add(group, shadow);

    var ship = (MA.ship = {
      group: group, model: model, prop: prop, glow: glow, shadow: shadow,
      pos: group.position,
      yaw: 0, turn: 0, climb: 0,
      speed: 0, // current forward speed
      speedK: 1, // 0..1 multiplier (slows down while a parcel is on its way)
      propSpin: 0, // rad/s of the big propeller
      roll: 0, pitch: 0, bob: 0,
      windK: 0, // 0..1 how hard the homeward wind is steering
      slideK: 0,
      CRUISE: CRUISE, MIN_ALT: MIN_ALT, MAX_ALT: MAX_ALT,
      // parcel slots on the rear rack, in model space
      slots: [new T.Vector3(-0.66, -4.02, -2.4), new T.Vector3(0.66, -4.02, -2.4), new T.Vector3(-0.66, -2.92, -2.4), new T.Vector3(0.66, -2.92, -2.4)],
      forward: new T.Vector3(0, 0, 1),

      // Free flight. ix: -1..1 (right positive), iy: -1..1 (up positive).
      fly: function (dt, ix, iy) {
        var W = MA.world, p = this.pos;
        var turnT = -ix * MAX_TURN, climbT = iy * MAX_CLIMB;

        // far from home a gentle wind turns the ship back
        var r = Math.sqrt(p.x * p.x + p.z * p.z);
        var wk = 0;
        if (r > BOUND_R) {
          var diff = MA.wrapPi(Math.atan2(-p.x, -p.z) - this.yaw);
          wk = sstep(BOUND_R, BOUND_R + 150, r) * sstep(0.25, 1.1, Math.abs(diff));
          var windTurn = clamp(diff * 1.4, -1, 1) * MAX_TURN * 0.85;
          turnT = MA.lerp(turnT, windTurn, wk);
        }
        this.windK = damp(this.windK, wk, 3, dt);

        this.turn = damp(this.turn, turnT, 3.2, dt);
        this.yaw = MA.wrapPi(this.yaw + this.turn * dt);
        var fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
        this.forward.set(fx, 0, fz);

        // altitude: ground and ceiling are soft
        var floor = Math.max(W.groundAt(p.x, p.z), W.groundAt(p.x + fx * 16, p.z + fz * 16), W.groundAt(p.x + fx * 34, p.z + fz * 34) - 3);
        var lo = Math.max(MIN_ALT, floor + CLEARANCE);
        if (climbT > 0) climbT *= clamp((MAX_ALT - p.y) / 14, 0, 1);
        if (climbT < 0) climbT *= clamp((p.y - lo) / 10, 0, 1);
        if (p.y < lo) climbT = Math.max(climbT, Math.min((lo - p.y) * 1.6, MAX_CLIMB * 1.3));
        this.climb = damp(this.climb, climbT, 3.2, dt);
        p.y += this.climb * dt;

        this.speed = damp(this.speed, CRUISE * this.speedK, 2.4, dt);
        p.x += fx * this.speed * dt;
        p.z += fz * this.speed * dt;

        // tall things (windmill, lighthouse, the bear...) nudge the ship sideways
        var slide = 0;
        for (var i = 0; i < W.obstacles.length; i++) {
          var o = W.obstacles[i], dx = p.x - o.x, dz = p.z - o.z, R = o.r + 7;
          var d2 = dx * dx + dz * dz;
          if (d2 > R * R || p.y > o.h + 7) continue;
          var d = Math.sqrt(d2) + 0.001, k = (1 - d / R) * clamp((o.h + 7 - p.y) / 8, 0, 1);
          var nx = dx / d, nz = dz / d;
          var tx = -nz, tz = nx, sgn = tx * fx + tz * fz >= 0 ? 1 : -1;
          var push = k * 46 * dt;
          p.x += (nx * 0.65 + tx * sgn * 0.35) * push;
          p.z += (nz * 0.65 + tz * sgn * 0.35) * push;
          // and turn the nose along the way round (tangent direction)
          var want = Math.atan2(tx * sgn, tz * sgn);
          this.yaw = MA.wrapPi(this.yaw + clamp(MA.wrapPi(want - this.yaw), -1, 1) * k * 1.6 * dt);
          slide = Math.max(slide, k);
        }
        this.slideK = slide;
        this.propSpin = damp(this.propSpin, 15 + 5 * this.speedK, 2, dt);
        this.pose(dt);
      },

      // Visual-only pose: bank into turns, tilt with climb, gentle bobbing. The camera never follows this.
      pose: function (dt) {
        var t = MA.uni.time.value;
        this.roll = damp(this.roll, clamp(-this.turn / MAX_TURN, -1, 1) * 0.24, 4, dt);
        this.pitch = damp(this.pitch, clamp(-this.climb / MAX_CLIMB, -1, 1) * 0.13, 4, dt);
        model.rotation.set(this.pitch + Math.sin(t * 0.9) * 0.012, 0, this.roll + Math.sin(t * 0.7 + 1) * 0.015);
        model.position.y = Math.sin(t * 1.3) * 0.22;
        group.rotation.y = this.yaw;
        prop.rotation.z += this.propSpin * dt;
        side[0].rotation.z -= this.propSpin * 1.4 * dt;
        side[1].rotation.z += this.propSpin * 1.4 * dt;
        // shadow sits on whatever is below
        var gy = MA.world.groundAt(this.pos.x, this.pos.z);
        var hgt = Math.max(this.pos.y - gy, 0);
        var sc = 5.5 + hgt * 0.035;
        shadow.position.set(this.pos.x, gy + 0.25, this.pos.z);
        shadow.scale.set(sc, sc * 1.25, 1);
        shadow.rotation.z = this.yaw;
        shadow.material.uniforms.op.value = 0.34 * (1 - sstep(40, 150, hgt) * 0.65);
      },
    });
    return ship;
  };
})();
