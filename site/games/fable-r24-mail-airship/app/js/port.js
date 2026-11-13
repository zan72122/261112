// port.js - the first scene: a harbour on stilts with a giant red postbox for a post office,
// four parcels on the dock, and the "load, then spin the propeller" opening play.
(function () {
  'use strict';
  var T = THREE, MA = window.MA, P = MA.pal;

  // The four destinations. Each has its own colour: parcel, parachute and guiding light all share it.
  function at(deg, r) { var a = (deg * Math.PI) / 180; return { x: Math.sin(a) * r, z: Math.cos(a) * r }; }
  MA.dest = [
    { id: 'bear', color: 0xff7fb5, light: 0xffc4dd, p: at(8, 345) },
    { id: 'mill', color: 0xff9a2e, light: 0xffd9a0, p: at(-84, 375) },
    { id: 'turtle', color: 0x3fcf8e, light: 0xb4f2d2, p: at(97, 355) },
    { id: 'light', color: 0x7f7bff, light: 0xcdcbff, p: at(196, 400) },
  ];

  var BOX = { x: -21, z: 11 };
  var DECK_Y = 5.2, DOCK = { x: 0, y: DECK_Y + 5.25, z: 0 };
  MA.DOCK = DOCK;

  // Parcel: coloured box, white ribbon, and a tiny model of its island on top.
  MA.buildParcelGeo = function (i) {
    var d = MA.dest[i], g = new MA.Geo(), c = d.color;
    g.box(c, [1, 1, 1], [0, 0, 0]);
    g.box(P.white, [1.04, 1.04, 0.2], [0, 0, 0]);
    g.box(P.white, [0.2, 1.04, 1.04], [0, 0, 0]);
    if (d.id === 'bear') {
      g.sph(0xb9783f, 0.3, [0, 0.74, 0], null, 8, 6);
      g.sph(0xb9783f, 0.13, [-0.24, 0.98, 0], null, 6, 4);
      g.sph(0xb9783f, 0.13, [0.24, 0.98, 0], null, 6, 4);
    } else if (d.id === 'mill') {
      g.cyl(P.cream, 0.1, 0.16, 0.5, [0, 0.74, 0], null, 6);
      for (var k = 0; k < 4; k++) {
        var a = (k * Math.PI) / 2 + 0.4;
        g.box(P.red, [0.14, 0.42, 0.04], [-Math.sin(a) * 0.24, 0.98 + Math.cos(a) * 0.24, 0.16], [0, 0, a]);
      }
    } else if (d.id === 'turtle') {
      g.dome(0x2fae6e, 0.34, [0, 0.5, 0], [1, 0.8, 1], 8, 3);
      g.sph(0xa6e07a, 0.14, [0, 0.62, 0.38], null, 6, 4);
    } else {
      var cols = [0xf2594b, 0xffd24a, 0x4bc0f2];
      for (var s = 0; s < 3; s++) g.cyl(cols[s], 0.15 - s * 0.012, 0.17 - s * 0.012, 0.2, [0, 0.6 + s * 0.2, 0], null, 6);
      g.sph(0xfff3a0, 0.15, [0, 1.2, 0], null, 6, 4);
    }
    return g.build();
  };

  function buildBase() {
    var g = new MA.Geo(), i, k;
    // deck planks
    for (i = 0; i < 16; i++) g.box(i % 2 ? 0xd9a868 : 0xcb9858, [2, 0.8, 32], [-35 + i * 2, DECK_Y - 0.4, 1]);
    g.box(P.woodDark, [32.6, 0.5, 32.6], [-20, DECK_Y - 0.95, 1]);
    // stilts
    for (i = 0; i < 4; i++) for (k = 0; k < 4; k++) g.cyl(P.woodDark, 0.55, 0.65, 9, [-34 + i * 9.4, 0.6, -13 + k * 9.4], null, 6);
    // the post office: a giant red postbox
    var bx = BOX.x, bz = BOX.z;
    g.cyl(0xc23a34, 6.4, 6.6, 1.4, [bx, DECK_Y + 0.7, bz], null, 16);
    g.cyl(P.red, 6, 6, 12, [bx, DECK_Y + 7.4, bz], null, 16);
    g.cyl(P.cream, 6.12, 6.12, 0.9, [bx, DECK_Y + 11.4, bz], null, 16);
    g.dome(P.red, 6.5, [bx, DECK_Y + 13.4, bz], [1, 0.62, 1], 16, 5);
    g.cyl(0xc23a34, 6.7, 6.7, 0.5, [bx, DECK_Y + 13.4, bz], null, 16);
    g.sph(P.yellow, 0.9, [bx, DECK_Y + 17.6, bz], null, 8, 6);
    // slot + door facing the dock (+x / -z corner)
    var fa = Math.atan2(1, -0.75);
    g.box(P.ink, [3.6, 0.7, 0.5], [bx + Math.sin(fa) * 5.85, DECK_Y + 9.4, bz + Math.cos(fa) * 5.85], [0, fa, 0]);
    g.box(P.cream, [3.0, 4.6, 0.4], [bx + Math.sin(fa) * 5.9, DECK_Y + 3.0, bz + Math.cos(fa) * 5.9], [0, fa, 0]);
    g.cyl(P.cream, 1.5, 1.5, 0.4, [bx + Math.sin(fa) * 5.9, DECK_Y + 5.3, bz + Math.cos(fa) * 5.9], [Math.PI / 2, 0, -fa], 12);
    // mooring mast with a striped windsock
    g.cyl(P.cream, 0.28, 0.4, 15, [-6, DECK_Y + 7.5, 15.5], null, 6);
    g.sph(P.red, 0.6, [-6, DECK_Y + 15.2, 15.5], null, 6, 5);
    for (i = 0; i < 4; i++) g.cyl(i % 2 ? P.white : 0xff9a2e, 0.95 - i * 0.17, 0.78 - i * 0.17, 1.1, [-6, DECK_Y + 13.6, 16.5 + i * 1.08], [Math.PI / 2, 0, 0], 8, true);
    // loading pad under the parcels
    g.box(0xfff4dc, [4.2, 0.12, 13], [-7.6, DECK_Y + 0.06, -3.8]);
    return g.mesh();
  }

  function buildDetail() {
    var g = new MA.Geo(), i, rnd = MA.rng(7);
    // crates and barrels
    var spots = [[-30, -9, 2.4], [-27, -10.5, 1.8], [-30, -6, 1.6], [-29, 13, 2], [-26, 14, 1.5], [-32, 14, 2.2]];
    for (i = 0; i < spots.length; i++) {
      var s = spots[i];
      g.box(i % 2 ? P.wood : 0xdcae6e, [s[2], s[2], s[2]], [s[0], DECK_Y + s[2] / 2, s[1]], [0, rnd() * 1.5, 0]);
      g.box(P.woodDark, [s[2] * 1.03, s[2] * 0.14, s[2] * 1.03], [s[0], DECK_Y + s[2] * 0.75, s[1]], [0, 0, 0]);
    }
    g.cyl(0x4bc0f2, 1, 1, 2.2, [-20, DECK_Y + 1.1, -11], null, 8);
    g.cyl(P.yellow, 1, 1, 2.2, [-22.4, DECK_Y + 1.1, -11.6], null, 8);
    // lamp posts
    var lamps = [[-5.2, 5.5], [-34, -13], [-34, 15], [-22, -13.5]];
    for (i = 0; i < lamps.length; i++) {
      g.cyl(P.ink, 0.14, 0.2, 5, [lamps[i][0], DECK_Y + 2.5, lamps[i][1]], null, 5);
      g.sph(0xfff3a0, 0.55, [lamps[i][0], DECK_Y + 5.3, lamps[i][1]], null, 7, 5);
    }
    // bunting from the postbox to the mast
    var cols = [0xff7fb5, 0xff9a2e, 0x3fcf8e, 0x7f7bff, 0xffd24a, 0x4bc0f2];
    for (i = 0; i < 12; i++) {
      var u = (i + 0.5) / 12, x = MA.lerp(BOX.x + 2, -6, u), z = MA.lerp(BOX.z + 2, 15.5, u), y = DECK_Y + 16.6 - Math.sin(u * Math.PI) * 2.6 - u * 1.6;
      g.cone(cols[i % 6], 0.55, 1.2, [x, y - 0.6, z], [Math.PI, 0.3, 0], 3);
    }
    // railing along the back edges
    for (i = 0; i < 9; i++) {
      g.box(P.cream, [0.3, 1.6, 0.3], [-36 + 0.3, DECK_Y + 0.8, -14 + i * 3.8]);
      g.box(P.cream, [0.3, 1.6, 0.3], [-35 + i * 3.6, DECK_Y + 0.8, 16.7]);
    }
    g.box(P.red, [0.2, 0.25, 31], [-35.7, DECK_Y + 1.6, 1.2]);
    g.box(P.red, [29.5, 0.25, 0.2], [-21, DECK_Y + 1.6, 16.7]);
    // the postmaster: a pelican with a mail cap, sitting on top of the postbox
    var px = BOX.x, py = DECK_Y + 18.3, pz = BOX.z;
    g.sph(P.white, 1.5, [px, py + 1.3, pz], [1, 1.1, 1.15], 9, 7);
    g.sph(P.white, 0.85, [px + 0.4, py + 3.3, pz - 0.5], null, 8, 6);
    g.cone(0xff9a2e, 0.5, 2.4, [px + 1.25, py + 2.9, pz - 1.45], [Math.PI / 2 + 0.55, 0, -0.75 + Math.PI], 6);
    g.sph(P.ink, 0.13, [px + 0.95, py + 3.55, pz - 0.35], null, 5, 4);
    g.sph(P.ink, 0.13, [px + 0.25, py + 3.55, pz - 1.2], null, 5, 4);
    g.cyl(0x3b6fd6, 0.7, 0.75, 0.5, [px + 0.4, py + 4.15, pz - 0.5], null, 8);
    g.box(0x3b6fd6, [0.9, 0.1, 0.8], [px + 0.95, py + 3.95, pz - 1.1], [0, 0.65, 0]);
    return g.mesh();
  }

  MA.buildPort = function (scene) {
    var base = buildBase();
    scene.add(base);
    var place = {
      id: 'port', x: -20, z: 1, base: base, detail: null, building: false,
      buildDetail: buildDetail,
    };
    place.detail = buildDetail();
    scene.add(place.detail);
    MA.world.places.push(place);
    // the deck is "ground" for the ship and its shadow; the postbox is a soft obstacle
    MA.world.floors.push(function (x, z) {
      var dx = Math.max(Math.abs(x + 20) - 16, 0), dz = Math.max(Math.abs(z - 1) - 16, 0);
      var d = Math.sqrt(dx * dx + dz * dz);
      return d > 10 ? 0 : DECK_Y * (1 - MA.sstep(0, 10, d));
    });
    MA.world.obstacles.push({ x: BOX.x, z: BOX.z, r: 8, h: DECK_Y + 21 });

    // parcels on the dock
    var cargo = (MA.cargo = []);
    var order = [1, 0, 3, 2];
    for (var i = 0; i < 4; i++) {
      var di = order[i];
      var mesh = new T.Mesh(MA.buildParcelGeo(di), MA.mat.lambert);
      mesh.geometry.shared = true; // lives for the whole session
      var home = new T.Vector3(-7.6, DECK_Y + 1.12, -8.2 + i * 2.95);
      mesh.position.copy(home);
      mesh.scale.setScalar(1.9);
      mesh.rotation.y = -0.5;
      scene.add(mesh);
      cargo[di] = { dest: di, mesh: mesh, state: 'dock', t: 0, home: home, slot: -1, wob: i * 1.7 };
    }

    var port = (MA.port = {
      place: place,
      phase: 'load', // load -> spin -> (takeoff handled by main)
      loaded: 0, misses: 0, energy: 0, idle: 0,
      camPos: new T.Vector3(-13.2, 14.6, -21.5),
      camLook: new T.Vector3(-4.6, 8.9, -1.2),
      next: function () { // next parcel still on the dock, nearest to the ship's rack first
        for (var i = 0; i < 4; i++) { var c = cargo[order[i]]; if (c.state === 'dock') return c; }
        return null;
      },
      load: function (c) {
        if (!c || c.state !== 'dock') return;
        c.state = 'hop';
        c.t = 0;
        c.slot = this.loaded++;
        MA.audio.sfx('load', c.slot);
      },
      // returns true when the tap was used
      tap: function (x, y) {
        if (this.phase === 'load') {
          var best = null, bd = 1e9, v = new T.Vector3();
          for (var i = 0; i < 4; i++) {
            var c = cargo[i];
            if (c.state !== 'dock') continue;
            var s = MA.project(v.copy(c.mesh.position));
            var d = Math.hypot(s.x - x, s.y - y);
            if (d < bd) { bd = d; best = c; }
          }
          var reach = Math.max(70, Math.min(innerWidth, innerHeight) * 0.11);
          if (best && bd < reach) this.load(best);
          else if (++this.misses > 2) this.load(this.next()); // tapping anywhere works too, after a few tries
          else { MA.ship.propSpin += 7; MA.audio.sfx('putt'); }
          this.idle = 0;
        } else if (this.phase === 'spin') this.addSpin(1.15);
        return true;
      },
      addSpin: function (e) {
        if (this.phase !== 'spin') return;
        this.energy = Math.min(this.energy + e, 3.6);
        this.idle = 0;
        MA.audio.sfx('putt');
      },
      update: function (dt) {
        var ship = MA.ship, t = MA.uni.time.value, i, c;
        this.idle += dt;
        for (i = 0; i < 4; i++) {
          c = cargo[i];
          if (c.state === 'dock') {
            // waiting parcels wiggle; the next one hops to say "me first"
            var isNext = c === this.next() && this.phase === 'load';
            var hop = isNext ? Math.abs(Math.sin(t * 3.2)) * 0.5 : 0;
            c.mesh.position.y = c.home.y + hop;
            c.mesh.rotation.y = -0.5 + Math.sin(t * 1.4 + c.wob) * 0.12;
            c.mesh.rotation.z = isNext ? Math.sin(t * 6.4) * 0.06 : 0;
          } else if (c.state === 'hop') {
            c.t += dt / 0.75;
            var u = Math.min(c.t, 1), e = MA.ease.inOut(u);
            var to = ship.model.localToWorld(_v.copy(ship.slots[c.slot]));
            c.mesh.position.lerpVectors(c.home, to, e);
            c.mesh.position.y += Math.sin(u * Math.PI) * 4.2;
            c.mesh.scale.setScalar(MA.lerp(1.9, 1.0, e));
            c.mesh.rotation.set(0, -0.5 + e * (MA.TAU + 0.5), 0);
            if (u >= 1) {
              c.state = 'ship';
              ship.model.add(c.mesh);
              c.mesh.position.copy(ship.slots[c.slot]);
              c.mesh.rotation.set(0, 0, 0);
              c.mesh.scale.setScalar(1);
              ship.bobKick = 1;
              MA.audio.sfx('thud');
              if (MA.late.fx) MA.late.fx.burst(to, MA.dest[c.dest].color, 10, 4);
            }
          }
        }
        if (this.phase === 'load') {
          var all = true;
          for (i = 0; i < 4; i++) if (cargo[i].state !== 'ship') all = false;
          if (all) { this.phase = 'spin'; this.idle = 0; ship.glow.visible = true; MA.audio.sfx('ready'); }
          ship.propSpin = MA.damp(ship.propSpin, 0, 1.5, dt);
        } else if (this.phase === 'spin') {
          this.energy = Math.max(0, this.energy - dt * 0.12);
          ship.propSpin = MA.damp(ship.propSpin, this.energy * 7, 4, dt);
          ship.glow.material.opacity = (0.55 + 0.45 * Math.sin(t * 5)) * MA.clamp(1.2 - this.energy * 0.3, 0, 1);
          ship.glow.scale.setScalar(1 + 0.12 * Math.sin(t * 5));
          if (this.energy >= 3) { this.phase = 'go'; MA.startTakeoff(); }
        }
        // the ship tugs at its mooring a little more with every bit of spin
        ship.bobKick = MA.damp(ship.bobKick || 0, 0, 4, dt);
        ship.pos.set(DOCK.x, DOCK.y + this.energy * 0.28 - ship.bobKick * 0.35 * Math.sin(ship.bobKick * 9), DOCK.z);
        ship.pose(dt);
      },
      // where the "touch here" hint should point (screen px), or null
      hintTarget: function () {
        if (this.phase === 'load') {
          var c = this.next();
          if (!c || this.idle < 2.2) return null;
          return MA.project(_v.copy(c.home).setY(c.home.y + 0.4));
        }
        if (this.phase === 'spin') {
          if (this.idle < 1.2) return null;
          return MA.project(MA.ship.prop.getWorldPosition(_v));
        }
        return null;
      },
      // Coming home: whenever the ship returns from far away, the post office greets it
      // with bells and confetti (a bigger shower once every parcel has been delivered).
      away: false,
      welcome: function () {
        var p = MA.ship.pos, d = Math.hypot(p.x - BOX.x, p.z - BOX.z), L = MA.late;
        if (d > 260) this.away = true;
        else if (d < 105 && this.away) {
          this.away = false;
          var done = L.delivery && L.delivery.count >= 4;
          MA.audio.sfx(done ? 'land' : 'ready');
          if (L.fx) L.fx.burst(_v.set(BOX.x, DECK_Y + 22, BOX.z), 'confetti', done ? 60 : 24, done ? 20 : 13, 2.2, 2.4, -7);
        }
      },
      // leaving the port scene: the cue ring is no longer needed
      leave: function () {
        var gl = MA.ship.glow;
        gl.geometry.dispose();
        gl.material.dispose();
        MA.ship.model.remove(gl);
        MA.ship.glow = null;
      },
    });
    return port;
  };
  var _v = new T.Vector3();
})();
