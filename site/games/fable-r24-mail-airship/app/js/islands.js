// islands.js (late) - the four islands and the friends who receive the mail.
//   bear   : plush island, a huge teddy bear (the hat is far too big)
//   mill   : windmill island, a wooden robot that needs its wind-up key
//   turtle : the island IS a giant turtle with a little house on its shell (a parasol opens)
//   light  : rainbow lighthouse with a penguin keeper (the lamp lights up)
// Each island has a "base" (silhouette, always present, readable from far away) and a
// "detail" group that is built when the ship comes close and disposed when it leaves.
(function () {
  'use strict';
  var T = THREE, MA = window.MA, P = MA.pal, Geo = MA.Geo;
  var TAU = MA.TAU, sstep = MA.sstep, damp = MA.damp, clamp = MA.clamp, ease = MA.ease;
  var islands = [];

  // ---------- helpers ----------
  var US = [0.2, 0.38, 0.55, 0.7, 0.83, 0.93, 1.0, 1.1];
  function prof(o, u) {
    if (u > 1) return (-5 * (u - 1)) / 0.1;
    return o.H * (1 - sstep(o.flat || 0.25, 1, u)) + 0.5 * (1 - u);
  }
  function outline(o, ang) { return o.R * (1 + (o.amp === undefined ? 0.12 : o.amp) * MA.ringNoise(ang, o.seed)); }
  // Radial island ground with a wobbly outline + a white foam strip. Returns nothing; use heightOf().
  function terrain(g, o) {
    var segs = o.segs || 28, pos = [0, prof(o, 0), 0], idx = [], r, s;
    for (r = 0; r < US.length; r++) for (s = 0; s < segs; s++) {
      var ang = (s / segs) * TAU, d = US[r] * outline(o, ang);
      pos.push(Math.sin(ang) * d, prof(o, US[r]), Math.cos(ang) * d);
    }
    for (s = 0; s < segs; s++) idx.push(0, 1 + s, 1 + ((s + 1) % segs));
    for (r = 0; r < US.length - 1; r++) for (s = 0; s < segs; s++) {
      var a = 1 + r * segs + s, b = 1 + r * segs + ((s + 1) % segs), c = a + segs, e = b + segs;
      idx.push(a, c, e, a, e, b);
    }
    var bg = new T.BufferGeometry();
    bg.setAttribute('position', new T.BufferAttribute(new Float32Array(pos), 3));
    bg.setIndex(idx);
    g.add(bg, o.color, null, true);
    foam(g, function (ang) { return outline(o, ang); }, segs);
  }
  function foam(g, radiusAt, segs) {
    var pos = [], idx = [], s;
    for (s = 0; s < segs; s++) {
      var ang = (s / segs) * TAU, R = radiusAt(ang), w = 2.2 + Math.sin(ang * 7) * 0.8;
      pos.push(Math.sin(ang) * (R - 1.2), 0.22, Math.cos(ang) * (R - 1.2), Math.sin(ang) * (R + w), 0.22, Math.cos(ang) * (R + w));
    }
    for (s = 0; s < segs; s++) {
      var a = s * 2, b = ((s + 1) % segs) * 2;
      idx.push(a, a + 1, b + 1, a, b + 1, b);
    }
    var bg = new T.BufferGeometry();
    bg.setAttribute('position', new T.BufferAttribute(new Float32Array(pos), 3));
    bg.setIndex(idx);
    g.add(bg, P.white, null, true);
  }
  function heightOf(o, x, z) {
    var d = Math.sqrt(x * x + z * z), u = d / outline(o, Math.atan2(x, z));
    return u >= 1 ? 0 : prof(o, u);
  }
  function tree(g, x, y, z, s, c1, c2) {
    g.cyl(P.woodDark, 0.35 * s, 0.5 * s, 2.4 * s, [x, y + 1.2 * s, z], null, 5);
    g.ico(c1, 2.1 * s, [x, y + 3.6 * s, z], [1, 0.9, 1], 1);
    g.ico(c2, 1.5 * s, [x + 0.5 * s, y + 5.2 * s, z - 0.3 * s], null, 1);
  }
  function part(parent, g, x, y, z, material) {
    var m = g.mesh(material);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function pulse(t, period, len) { // 0..1 bump of length len every period seconds
    var k = (t % period) / len;
    return k < 1 ? Math.sin(k * Math.PI) : 0;
  }

  // ====================================================================== BEAR
  var BEAR = { R: 58, H: 9, seed: 1.7, flat: 0.3, amp: 0.07 };
  var QUILT = [0xffc4de, 0xdccbff, 0xc6f1dd, 0xfff1ba, 0xffd9c2];
  BEAR.color = function (x, y, z) {
    if (y < 0.9) return P.cream;
    var a = Math.atan2(x, z) + Math.PI, d = Math.sqrt(x * x + z * z);
    return QUILT[(Math.floor((a / TAU) * 14) + Math.floor(d / 11) * 2) % 5];
  };
  var BROWN = 0xc68a4e, BROWN2 = 0xb07840;
  var defBear = {
    o: BEAR, target: [0, BEAR.H + 16.5 + 12.6, 0.6], obstacle: { x: 0, z: 0, r: 13, h: BEAR.H + 34 }, seaR: 58,
    base: function (isl, grp) {
      var g = new Geo(), y0 = BEAR.H, s;
      terrain(g, BEAR);
      g.sph(BROWN, 9, [0, y0 + 8.2, 0], [1, 1.02, 0.92], 14, 10);
      g.sph(P.cream, 6, [0, y0 + 7.6, 4.7], [1, 1.05, 0.6], 10, 8);
      g.sph(BROWN, 2, [0, y0 + 3, -8.4], null, 7, 5);
      for (s = -1; s <= 1; s += 2) {
        g.sph(BROWN, 3.6, [s * 5.6, y0 + 3.2, 8], [1, 0.95, 1.7], 10, 7);
        g.sph(P.cream, 2.3, [s * 5.6, y0 + 3.4, 13.5], [1, 1, 0.35], 8, 6);
      }
      grp.add(g.mesh());
      // head (wobbles), with ears and face
      g = new Geo();
      g.sph(BROWN, 6.8, [0, 5.6, 0.6], [1, 0.95, 0.95], 14, 10);
      for (s = -1; s <= 1; s += 2) {
        g.sph(BROWN, 2.5, [s * 5.3, 10.6, 0.3], null, 8, 6);
        g.sph(P.cream, 1.5, [s * 5.3, 10.6, 1.7], [1, 1, 0.5], 7, 5);
        g.sph(P.ink, 0.8, [s * 2.6, 7.2, 6.4], null, 7, 5);
        g.sph(0xff9fb8, 1.1, [s * 4.5, 4.7, 5.3], [1, 0.7, 0.4], 7, 5);
      }
      g.sph(P.cream, 3, [0, 4.2, 6.2], [1.1, 0.85, 0.9], 10, 7);
      g.sph(P.ink, 1.0, [0, 5.2, 8.7], [1.2, 0.8, 0.8], 7, 5);
      var head = part(grp, g, 0, y0 + 16.5, 0);
      var arms = [];
      for (s = -1; s <= 1; s += 2) {
        g = new Geo();
        g.sph(BROWN2, 2.7, [0, -4.2, 0.6], [1, 2.0, 1], 9, 7);
        g.sph(P.cream, 1.5, [0, -8.6, 1.5], [1, 0.6, 1], 7, 5);
        var arm = part(grp, g, s * 8.2, y0 + 14.5, 1.5);
        arm.userData.s = s;
        arms.push(arm);
      }
      isl.parts = { head: head, arms: arms, hat: null };
      if (isl.delivered) defBear.giveHat(isl);
    },
    giveHat: function (isl) {
      var g = new Geo();
      // local to the head centre: a sun hat far too big, it drops right over the eyes
      g.cyl(P.yellow, 8.3, 9.3, 11, [0, 6.1, 0], null, 16);
      g.cyl(0xff7fb5, 9.25, 9.5, 2.2, [0, 2.4, 0], null, 16, true);
      g.lathe(0xffdf6e, [[9.2, 0.5], [15, -0.9], [15.3, -0.4], [9.2, 1.3]], [0, 0.2, 0], null, 18);
      g.sph(0xff5f93, 1.5, [0, 2.6, 9.4], [1, 1, 0.5], 7, 5);
      g.sph(P.white, 0.7, [0, 2.6, 10.0], null, 6, 4);
      var hat = part(isl.parts.head, g, 0, 5.6, 0.6);
      isl.parts.hat = hat;
    },
    detail: function (isl, grp) {
      var g = new Geo(), rnd = MA.rng(31), i, a, d, y, x, z;
      // toy blocks
      var cols = [0xff7fb5, 0x4bc0f2, 0xffd24a, 0x3fcf8e, 0x7f7bff, 0xff9a2e];
      var stacks = [[26, 12], [-30, 4], [-18, 30], [34, -14]];
      for (i = 0; i < stacks.length; i++) {
        x = stacks[i][0]; z = stacks[i][1]; y = heightOf(BEAR, x, z);
        g.box(cols[i], [5, 5, 5], [x, y + 2.3, z], [0, rnd(), 0]);
        g.box(cols[i + 1], [5, 5, 5], [x + 5.4, y + 2.3, z + 1], [0, rnd(), 0]);
        g.box(cols[i + 2], [4.4, 4.4, 4.4], [x + 2.6, y + 7, z + 0.4], [0, rnd(), 0]);
      }
      // beach balls
      for (i = 0; i < 5; i++) {
        a = rnd() * TAU; d = 22 + rnd() * 20; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(BEAR, x, z);
        var r = 2 + rnd() * 1.6, c = cols[i];
        g.sph((function (cx, cz, c) { return function (px, py, pz) { return Math.floor((Math.atan2(px - cx, pz - cz) + Math.PI) / TAU * 6) % 2 ? c : P.white; }; })(x, z, c), r, [x, y + r * 0.9, z], null, 12, 8);
      }
      // lollipop trees
      for (i = 0; i < 9; i++) {
        a = i * 0.7 + 0.4; d = 30 + rnd() * 16; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(BEAR, x, z);
        g.cyl(P.white, 0.3, 0.3, 6, [x, y + 3, z], null, 5);
        g.sph(cols[i % 6], 2.4, [x, y + 7.6, z], [1, 1, 0.45], 10, 7, [0, a, 0]);
        g.sph(P.white, 1.2, [x, y + 7.6, z], [1, 1, 0.55], 8, 5, [0, a, 0]);
      }
      // little rabbits looking up at the bear
      for (i = 0; i < 3; i++) {
        a = [0.9, -0.8, 2.6][i]; d = 20; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(BEAR, x, z);
        var c2 = [P.white, 0xffd6e6, 0xd9ecff][i];
        g.sph(c2, 2, [x, y + 1.9, z], [1, 1.1, 1], 9, 7);
        g.sph(c2, 1.5, [x, y + 4.6, z], null, 9, 7);
        g.sph(c2, 0.5, [x - 0.7, y + 6.6, z], [1, 2.8, 1], 6, 5);
        g.sph(c2, 0.5, [x + 0.7, y + 6.6, z], [1, 2.8, 1], 6, 5);
        g.sph(P.ink, 0.2, [x - 0.5 + Math.sin(a) * 1.3, y + 4.9, z + Math.cos(a) * 1.3], null, 5, 4);
        g.sph(P.ink, 0.2, [x + 0.5 + Math.sin(a) * 1.3, y + 4.9, z + Math.cos(a) * 1.3], null, 5, 4);
      }
      // big sewn buttons on the quilt
      for (i = 0; i < 6; i++) {
        a = i * 1.05 + 0.2; d = 44; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(BEAR, x, z);
        g.cyl(cols[(i + 2) % 6], 2.2, 2.2, 0.6, [x, y + 0.5, z], [0.12, 0, 0.1], 10);
      }
      grp.add(g.mesh());
    },
    update: function (isl, dt, t) {
      var p = isl.parts, head = p.head, near = isl.near, k, i;
      var sway = Math.sin(t * 0.8) * 0.05;
      if (!isl.delivered) {
        head.rotation.set(near * -0.22, 0, sway + near * Math.sin(t * 2.2) * 0.07);
        for (i = 0; i < 2; i++) {
          var s = p.arms[i].userData.s;
          // waves one arm when the ship is close
          p.arms[i].rotation.z = s * (0.45 + (s > 0 ? near * (1.5 + Math.sin(t * 6) * 0.45) : 0));
        }
        return;
      }
      if (!p.hat) defBear.giveHat(isl);
      var tr = isl.tR, hat = p.hat;
      // hat falls on, squashes, then sits over the eyes
      k = clamp(tr / 0.7, 0, 1);
      var drop = (1 - ease.outBack(k)) * 16;
      var party = 1 - sstep(4, 6.5, tr);
      // now and then the bear tips the hat back to peek, and it flops down again
      var peek = tr > 7 ? pulse(tr - 7, 7.5, 1.8) : 0;
      hat.position.y = 5.6 + drop + peek * 1.2;
      hat.rotation.x = -peek * 0.42;
      hat.scale.y = 1 + (k < 1 ? 0 : Math.sin(clamp((tr - 0.7) / 0.5, 0, 1) * Math.PI) * -0.18);
      head.rotation.set(-0.05 - peek * 0.1, 0, sway + party * Math.sin(tr * 7) * 0.16);
      for (i = 0; i < 2; i++) {
        s = p.arms[i].userData.s;
        var up = party * clamp(tr / 0.5, 0, 1) * (2.0 + Math.sin(tr * 9 + i * 2) * 0.25) + peek * 1.9;
        p.arms[i].rotation.z = s * (0.45 + up);
      }
      if (isl.say(0.8) || isl.say(2.6)) MA.audio.sfx('bear');
    },
  };

  // ====================================================================== MILL
  var MILL = { R: 62, H: 12, seed: 4.2, flat: 0.34 };
  MILL.color = function (x, y, z) {
    if (y < 1.3) return P.sand;
    var n = Math.sin(x * 0.21) * Math.sin(z * 0.17);
    return n > 0.25 ? P.grassDark : n < -0.4 ? 0x9bdc74 : P.grass;
  };
  var ROBOT = [15, 0, 17], ROBOT_S = 1.3, HUB = [0, MILL.H + 28, -2.4];
  ROBOT[1] = heightOf(MILL, ROBOT[0], ROBOT[2]) + 1.2;
  var defMill = {
    o: MILL, target: [ROBOT[0], ROBOT[1] + 9.2 * ROBOT_S, ROBOT[2]], obstacle: { x: 0, z: -4, r: 15, h: MILL.H + 51 }, seaR: 62,
    base: function (isl, grp) {
      var g = new Geo(), y0 = MILL.H, k;
      terrain(g, MILL);
      // tower
      g.lathe(P.cream, [[6.6, 0], [6.0, 8], [5.1, 18], [4.4, 27], [4.4, 30.5]], [0, y0, -8], null, 14);
      g.cyl(0xf0b24a, 6.15, 6.3, 1.6, [0, y0 + 5, -8], null, 14, true);
      g.cone(0xd9573f, 5.6, 7, [0, y0 + 34, -8], null, 12);
      g.sph(P.yellow, 0.8, [0, y0 + 37.8, -8], null, 6, 5);
      g.cyl(P.wood, 7.4, 7.4, 0.5, [0, y0 + 9, -8], null, 14);
      g.box(P.woodDark, [2.6, 4.4, 0.5], [0, y0 + 2.2, -1.55]);
      g.box(0x6fb7e8, [1.6, 2, 0.5], [0, y0 + 14, -2.7]);
      g.box(0x6fb7e8, [1.4, 1.8, 0.5], [0, y0 + 21.5, -3.35]);
      g.cyl(P.woodDark, 0.6, 0.6, 5, [0, HUB[1], -4.6], [Math.PI / 2, 0, 0], 6);
      grp.add(g.mesh());
      // sails
      g = new Geo();
      g.sph(P.red, 1.7, [0, 0, 0.3], null, 8, 6);
      for (k = 0; k < 4; k++) {
        g.base = MA.mat4(null, [0, 0, (k * Math.PI) / 2]);
        g.box(P.woodDark, [0.55, 21, 0.45], [0, 10.5, 0]);
        g.box(P.cream, [4.4, 13.6, 0.25], [2.4, 11.4, 0.1]);
        g.box(P.red, [4.4, 2.4, 0.3], [2.4, 19.4, 0.1]);
        g.box(0xf0b24a, [4.4, 1.2, 0.3], [2.4, 4.0, 0.1]);
      }
      g.base = null;
      var sails = part(grp, g, HUB[0], HUB[1], HUB[2]);
      isl.parts = { sails: sails, spin: 0.35 };
    },
    detail: function (isl, grp) {
      var g = new Geo(), rnd = MA.rng(77), i, a, d, x, y, z;
      // round stage for the robot
      g.cyl(0xdcae6e, 5.6, 6, 1.3, [ROBOT[0], ROBOT[1] - 0.65, ROBOT[2]], null, 12);
      for (i = 0; i < 12; i++) {
        a = 0.3 + i * 0.5; d = 34 + rnd() * 16; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(MILL, x, z);
        if (Math.hypot(x - ROBOT[0], z - ROBOT[2]) < 9) continue;
        tree(g, x, y, z, 1.2 + rnd() * 0.8, i % 3 ? 0x4fb86a : 0x6cc75a, 0x8fdc6c);
      }
      // hay bales, sheep, flowers
      for (i = 0; i < 4; i++) {
        a = 3.6 + i * 0.5; d = 21; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(MILL, x, z);
        g.cyl(0xf3cf6a, 1.8, 1.8, 2.4, [x, y + 1.7, z], [Math.PI / 2, 0, a], 9);
      }
      for (i = 0; i < 5; i++) {
        a = 1.5 + i * 0.42; d = 20 + (i % 2) * 6; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(MILL, x, z);
        g.ico(P.white, 1.7, [x, y + 2, z], [1.25, 1, 1], 1);
        g.sph(P.ink, 0.8, [x + Math.sin(a + 1.6) * 2, y + 2.3, z + Math.cos(a + 1.6) * 2], null, 6, 5);
        g.box(P.ink, [1.6, 1.2, 1.2], [x, y + 0.6, z]);
      }
      var fc = [0xff7fb5, 0xffd24a, 0xffffff, 0xff9a2e];
      for (i = 0; i < 40; i++) {
        a = rnd() * TAU; d = 8 + rnd() * 42; x = Math.sin(a) * d; z = Math.cos(a) * d; y = heightOf(MILL, x, z);
        if (y < 1.6) continue;
        g.ico(fc[i % 4], 0.55, [x, y + 0.5, z]);
      }
      // fence in front
      for (i = 0; i < 10; i++) {
        a = -0.5 + i * 0.11; x = Math.sin(a) * 27; z = Math.cos(a) * 27; y = heightOf(MILL, x, z);
        if (Math.hypot(x - ROBOT[0], z - ROBOT[2]) < 8) continue;
        g.box(P.cream, [0.4, 2.2, 0.4], [x, y + 1.1, z]);
        g.box(P.cream, [3.2, 0.3, 0.25], [x, y + 1.7, z], [0, a + Math.PI / 2, 0]);
      }
      grp.add(g.mesh());

      // --- the wooden robot ---
      var rb = new T.Group(), s;
      rb.position.set(ROBOT[0], ROBOT[1], ROBOT[2]);
      rb.scale.setScalar(ROBOT_S);
      grp.add(rb);
      g = new Geo();
      for (s = -1; s <= 1; s += 2) {
        g.box(P.woodDark, [1.1, 1.8, 1.3], [s * 0.95, 0.9, 0]);
        g.box(P.wood, [1.5, 0.6, 2.0], [s * 0.95, 0.3, 0.3]);
        g.sph(P.yellow, 0.22, [s * 0.6, 3.2, 1.5], null, 5, 4);
      }
      g.box(P.wood, [4, 4, 2.8], [0, 3.9, 0]);
      g.box(P.woodDark, [4.06, 0.26, 2.86], [0, 2.3, 0]);
      g.box(P.cream, [2.4, 2.0, 0.2], [0, 4.3, 1.42]);
      g.sph(P.red, 0.55, [0, 4.4, 1.6], null, 7, 5);
      rb.add(g.mesh());
      g = new Geo();
      g.box(0xdcae6e, [3.4, 2.6, 2.8], [0, 1.5, 0]);
      g.box(P.ink, [1.4, 0.2, 0.1], [0, 0.75, 1.42]);
      for (s = -1; s <= 1; s += 2) g.cyl(P.red, 0.5, 0.5, 0.5, [s * 1.9, 1.5, 0], [0, 0, Math.PI / 2], 8);
      g.cyl(P.ink, 0.08, 0.08, 1.2, [0, 3.4, 0], null, 4);
      g.sph(P.red, 0.42, [0, 4.1, 0], null, 6, 5);
      var head = part(rb, g, 0, 6.1, 0);
      var eg = new Geo();
      for (s = -1; s <= 1; s += 2) eg.sph(P.white, 0.52, [s * 0.8, 1.8, 1.42], [1, 1, 0.3], 8, 5);
      var eyeMat = new T.MeshBasicMaterial({ color: 0x7f8c99 });
      var eyes = new T.Mesh(eg.build(), eyeMat);
      head.add(eyes);
      var arms = [];
      for (s = -1; s <= 1; s += 2) {
        g = new Geo();
        g.cyl(P.woodDark, 0.45, 0.45, 2.6, [0, -1.3, 0], null, 6);
        g.sph(0xdcae6e, 0.78, [0, -2.9, 0], null, 7, 5);
        var arm = part(rb, g, s * 2.45, 5.4, 0);
        arm.userData.s = s;
        arms.push(arm);
      }
      g = new Geo();
      g.cyl(P.red, 0.2, 0.2, 1.6, [0, 0, -0.8], [Math.PI / 2, 0, 0], 6);
      g.tor(P.red, 0.7, 0.22, [-0.75, 0, -1.7], null, 5, 10);
      g.tor(P.red, 0.7, 0.22, [0.75, 0, -1.7], null, 5, 10);
      var key = part(rb, g, 0, 4.3, -1.4);
      key.visible = isl.delivered;
      isl.d = { rb: rb, head: head, eyeMat: eyeMat, arms: arms, key: key };
    },
    update: function (isl, dt, t) {
      var p = isl.parts, d = isl.d, tr = isl.tR, near = isl.near, i, s;
      var want = isl.delivered ? (tr < 7 ? 3.4 : 1.1) : 0.35;
      p.spin = damp(p.spin, want, 1.5, dt);
      p.sails.rotation.z -= p.spin * dt;
      if (isl.delivered && tr < 7 && MA.late.fx && Math.random() < dt * 14) {
        var a = Math.random() * TAU, w = _v.set(HUB[0] + Math.sin(a) * 20, HUB[1] + Math.cos(a) * 20, HUB[2] + 1);
        isl.group.localToWorld(w);
        MA.late.fx.emit(w.x, w.y, w.z, 0, 2, 0, MA.late.fx.RAINBOW[Math.floor(Math.random() * 7)], 2.2, 1.2, -1);
      }
      if (!d) return;
      if (!isl.delivered) {
        // run down: head hangs, eyes dim; a little twitch now and then, a slow wave when the ship is near
        var tw = pulse(t, 4.5, 0.5);
        d.head.rotation.set(0.5 - tw * 0.22 - near * 0.2, 0, 0);
        d.eyeMat.color.setHex(tw > 0.5 ? 0xd9c36a : 0x7f8c99);
        for (i = 0; i < 2; i++) {
          s = d.arms[i].userData.s;
          d.arms[i].rotation.set(0, 0, s > 0 ? near * (0.7 + Math.sin(t * 2.5) * 0.25) : 0);
        }
        d.key.visible = false;
        return;
      }
      d.key.visible = true;
      var pop = ease.outBack(clamp(tr / 0.5, 0, 1));
      d.key.scale.setScalar(pop);
      d.key.rotation.z += dt * (tr < 7 ? 7 : 2.2);
      var party = 1 - sstep(5.5, 7.5, tr), wake = sstep(0.3, 1.2, tr);
      d.eyeMat.color.setHex(wake > 0.5 ? 0xffe84a : 0x7f8c99);
      d.head.rotation.set((1 - wake) * 0.5, party * wake * tr * 5.5 + (1 - party) * Math.sin(t * 1.3) * 0.5, 0);
      d.rb.position.y = ROBOT[1] + party * wake * Math.abs(Math.sin(tr * 7)) * 1.4;
      for (i = 0; i < 2; i++) {
        s = d.arms[i].userData.s;
        var sw = party * (2.3 + Math.sin(tr * 10 + i * Math.PI) * 0.6) + (1 - party) * (0.5 + near * (s > 0 ? 1.6 + Math.sin(t * 6) * 0.4 : 0));
        d.arms[i].rotation.set(0, 0, s * wake * sw);
      }
      if (isl.say(0.9) || isl.say(2.4)) MA.audio.sfx('mill');
    },
  };

  // ====================================================================== TURTLE
  var TUR = { rx: 44, rz: 50, H: 17 };
  function turH(x, z) {
    var q = 1 - (x * x) / (TUR.rx * TUR.rx) - (z * z) / (TUR.rz * TUR.rz);
    return q <= 0 ? 0 : TUR.H * Math.sqrt(q);
  }
  var HOUSE = [0, TUR.H - 0.4, -9], PARASOL = [7, 0, 9], TURT = [-1, 0, 9];
  PARASOL[1] = turH(PARASOL[0], PARASOL[2]);
  TURT[1] = turH(TURT[0], TURT[2]);
  var SHELL = [0x39b877, 0x2fa56c, 0x4ccb86];
  var defTurtle = {
    floor: turH, target: [TURT[0], TURT[1] + 5, TURT[2]], obstacle: { x: 2, z: 1, r: 15, h: TUR.H + 21 }, seaR: 50,
    base: function (isl, grp) {
      var g = new Geo(), s;
      // shell: scutes are patches of slightly different greens, pale rim
      g.add(new T.SphereGeometry(1, 20, 6, 0, TAU, 0, Math.PI / 2), function (x, y, z) {
        var u = y / TUR.H;
        if (u < 0.22) return 0xcdeb8a;
        var a = Math.atan2(x, z) + Math.PI, ring = u > 0.8 ? 2 : u > 0.5 ? 1 : 0;
        return SHELL[(Math.floor((a / TAU) * (ring === 2 ? 4 : 10) + ring * 0.5) + ring) % 3];
      }, MA.mat4(null, null, [TUR.rx, TUR.H, TUR.rz]), true);
      foam(g, function (ang) {
        var sx = Math.sin(ang) / (TUR.rx + 0.8), cz = Math.cos(ang) / (TUR.rz + 0.8);
        return 1 / Math.sqrt(sx * sx + cz * cz);
      }, 24);
      // flippers and tail
      for (s = -1; s <= 1; s += 2) {
        g.sph(0xa6e07a, 9, [s * 42, 0.4, 28], [1.5, 0.22, 0.85], 9, 5, [0, s * 0.7, 0]);
        g.sph(0xa6e07a, 7, [s * 40, 0.4, -34], [1.4, 0.22, 0.8], 9, 5, [0, -s * 0.8, 0]);
      }
      g.cone(0xa6e07a, 4, 12, [0, 0.6, -54], [-Math.PI / 2, 0, 0], 6);
      // neck
      g.cyl(0xa6e07a, 6.5, 7.5, 14, [0, 2.5, 50], [Math.PI / 2 - 0.2, 0, 0], 10);
      // the house on top: cream walls, round teal roof, chimney
      var hx = HOUSE[0], hy = HOUSE[1], hz = HOUSE[2];
      g.cyl(P.cream, 6.2, 6.6, 6.5, [hx, hy + 3.2, hz], null, 12);
      g.dome(0x2bb5b0, 8.4, [hx, hy + 6.2, hz], [1, 0.82, 1], 12, 5);
      g.cyl(0x239a96, 8.6, 8.6, 0.6, [hx, hy + 6.3, hz], null, 12);
      g.box(0xd9573f, [1.6, 4.6, 1.6], [hx + 3.6, hy + 11.2, hz - 2]);
      g.box(P.cream, [2, 0.6, 2], [hx + 3.6, hy + 13.6, hz - 2]);
      g.box(0xc0703a, [2.6, 4.2, 0.5], [hx, hy + 2.1, hz + 6.35]);
      g.cyl(0xc0703a, 1.3, 1.3, 0.5, [hx, hy + 4.2, hz + 6.35], [Math.PI / 2, 0, 0], 10);
      for (s = -1; s <= 1; s += 2) g.cyl(0x8fd6f5, 1.1, 1.1, 0.5, [hx + s * 4, hy + 3.6, hz + 4.75], [Math.PI / 2, 0, -s * 0.7], 10);
      grp.add(g.mesh());
      // head (bobs and looks up)
      g = new Geo();
      g.sph(0xa6e07a, 9, [0, 0, 0], [1, 0.86, 1.15], 14, 10);
      for (s = -1; s <= 1; s += 2) {
        g.sph(P.white, 2.6, [s * 4.6, 4.2, 5.2], null, 9, 7);
        g.sph(P.ink, 1.3, [s * 5.0, 4.9, 7.0], null, 7, 5);
        g.sph(0xff9fb8, 1.6, [s * 6.6, 0.2, 6.2], [0.6, 0.7, 1], 7, 5);
      }
      g.tor(P.ink, 3.4, 0.3, [0, 0.4, 8.9], [0.25, 0, Math.PI], 4, 10, Math.PI);
      var head = part(grp, g, 0, 5.2, 60);
      isl.parts = { head: head, parasol: null, open: 0 };
      if (isl.delivered) { defTurtle.giveParasol(isl); isl.parts.open = 1; }
    },
    giveParasol: function (isl) {
      var grp = new T.Group(), g = new Geo(), i;
      grp.position.set(PARASOL[0], PARASOL[1], PARASOL[2]);
      g.cyl(P.cream, 0.35, 0.45, 17, [0, 8.5, 0], null, 6);
      g.sph(P.yellow, 0.9, [0, 17.6, 0], null, 7, 5);
      grp.add(g.mesh());
      g = new Geo();
      g.add(new T.ConeGeometry(15, 5, 12, 1, true), function (x, y, z) {
        return Math.floor(((Math.atan2(x, z) + Math.PI) / TAU) * 12 + 0.001) % 2 ? P.white : 0x3fcf8e;
      }, MA.mat4([0, -2.5, 0]));
      for (i = 0; i < 12; i++) {
        var a = ((i + 0.5) / 12) * TAU;
        g.sph(i % 2 ? 0x3fcf8e : P.white, 1.3, [Math.sin(a) * 14.4, -5, Math.cos(a) * 14.4], [1, 0.8, 1], 6, 4);
      }
      var canopy = part(grp, g, 0, 17, 0, MA.mat.lambertDouble);
      isl.group.add(grp);
      isl.parts.parasol = grp;
      isl.parts.canopy = canopy;
    },
    detail: function (isl, grp) {
      var g = new Geo(), rnd = MA.rng(5), i, a, d, x, y, z, s;
      // palms
      var palms = [[-20, 16], [22, -12], [-16, -26], [26, 22]];
      for (i = 0; i < palms.length; i++) {
        x = palms[i][0]; z = palms[i][1]; y = turH(x, z);
        for (s = 0; s < 4; s++) g.cyl(0xc79a5b, 0.7 - s * 0.08, 0.8 - s * 0.08, 2.8, [x + s * s * 0.25, y + 1.2 + s * 2.6, z], [0, 0, -s * 0.12], 6);
        for (s = 0; s < 6; s++) {
          a = (s / 6) * TAU;
          g.sph(s % 2 ? 0x4fb86a : 0x6cc75a, 1, [x + 2.3 + Math.sin(a) * 2.6, y + 11.2, z + Math.cos(a) * 2.6], [0.9, 0.25, 3.2], 6, 4, [0.45, a, 0]);
        }
        g.sph(0xc0703a, 0.7, [x + 2.3, y + 10.6, z + 0.6], null, 5, 4);
      }
      // picnic blanket + the little turtle's cushion
      for (i = 0; i < 16; i++) {
        x = TURT[0] - 3 + (i % 4) * 2; z = TURT[2] - 3 + Math.floor(i / 4) * 2;
        g.box((i + Math.floor(i / 4)) % 2 ? P.white : 0xff8fa8, [2, 0.2, 2], [x, turH(x, z) + 0.12, z], [-0.1, 0, 0]);
      }
      // flowers and shells on the shell
      var fc = [0xff7fb5, 0xffd24a, 0xffffff, 0xff9a2e];
      for (i = 0; i < 26; i++) {
        a = rnd() * TAU; d = 14 + rnd() * 24; x = Math.sin(a) * d; z = Math.cos(a) * d * 1.1; y = turH(x, z);
        if (Math.hypot(x - TURT[0], z - TURT[2]) < 5 || Math.hypot(x - HOUSE[0], z - HOUSE[2]) < 9) continue;
        g.ico(fc[i % 4], 0.6, [x, y + 0.5, z]);
        g.cyl(0x4fb86a, 0.1, 0.1, 0.6, [x, y + 0.1, z], null, 4);
      }
      // mailbox, stepping stones, smoke
      g.cyl(P.cream, 0.2, 0.2, 2.6, [-7, turH(-7, 2) + 1.3, 2], null, 5);
      g.box(P.red, [1.4, 1.1, 2], [-7, turH(-7, 2) + 3, 2]);
      for (i = 0; i < 4; i++) g.cyl(0xe8e2d0, 1.1, 1.2, 0.3, [0.4 * (i % 2), turH(0, 1 + i * 2.2) + 0.1, 0.5 + i * 2.2], null, 7);
      for (i = 0; i < 3; i++) g.ico(P.white, 1 + i * 0.5, [HOUSE[0] + 3.6 + i * 0.9, HOUSE[1] + 15.5 + i * 2.4, HOUSE[2] - 2], null, 1);
      // baby turtles paddling next to the big head
      for (i = 0; i < 3; i++) {
        x = [-22, 24, 30][i]; z = [62, 58, 44][i];
        g.dome(0x2fa56c, 2.6, [x, 0.1, z], [1, 0.7, 1.15], 8, 3);
        g.sph(0xa6e07a, 1.1, [x, 0.5, z + 3.3], null, 6, 4);
      }
      grp.add(g.mesh());

      // --- the little turtle who lives here ---
      var tt = new T.Group();
      tt.position.set(TURT[0], TURT[1], TURT[2]);
      tt.scale.setScalar(1.25);
      grp.add(tt);
      g = new Geo();
      g.dome(0x2fa56c, 2.3, [0, 0.9, 0], [1, 0.95, 1.1], 10, 4);
      g.cyl(0xcdeb8a, 2.35, 2.2, 0.7, [0, 0.75, 0], null, 10);
      for (s = -1; s <= 1; s += 2) {
        g.sph(0xa6e07a, 0.7, [s * 1.9, 0.5, 1.5], [1, 0.7, 1.3], 6, 4);
        g.sph(0xa6e07a, 0.7, [s * 1.9, 0.5, -1.4], [1, 0.7, 1.3], 6, 4);
      }
      tt.add(g.mesh());
      g = new Geo();
      g.cyl(0xa6e07a, 0.6, 0.7, 1.6, [0, 0.6, 0.3], [0.5, 0, 0], 6);
      g.sph(0xa6e07a, 1.15, [0, 1.8, 0.9], [1, 0.95, 1.1], 9, 7);
      for (s = -1; s <= 1; s += 2) {
        g.sph(P.ink, 0.2, [s * 0.5, 2.15, 1.85], null, 5, 4);
        g.sph(0xff9fb8, 0.26, [s * 0.85, 1.7, 1.6], [1, 0.7, 0.5], 5, 4);
      }
      var th = part(tt, g, 0, 1.4, 2.0);
      isl.d = { tt: tt, head: th };
    },
    update: function (isl, dt, t) {
      var p = isl.parts, d = isl.d, tr = isl.tR, near = isl.near;
      var happy = isl.delivered ? 1 - sstep(5, 8, tr) : 0;
      // the big head bobs in the swell and looks up at the ship when it is close
      p.head.position.y = 5.2 + Math.sin(t * 0.7) * 0.7 + happy * 2.5 * Math.abs(Math.sin(tr * 3));
      p.head.rotation.set(-0.12 - near * 0.3 - happy * 0.2, Math.sin(t * 0.4) * 0.22, Math.sin(t * 0.55) * 0.05);
      if (isl.delivered) {
        if (!p.parasol) defTurtle.giveParasol(isl);
        // pole grows, then the canopy springs open
        var up = ease.outCubic(clamp(tr / 0.6, 0, 1)), open = clamp((tr - 0.6) / 0.9, 0, 1);
        var e = ease.outElastic(open);
        p.parasol.scale.set(1, Math.max(up, 0.01), 1);
        p.canopy.scale.set(0.07 + 0.93 * e, 2.4 - 1.4 * Math.min(e, 1), 0.07 + 0.93 * e);
        p.canopy.rotation.y = tr > 1.5 ? Math.sin(t * 0.5) * 0.25 : open * 3;
        if (isl.say(0.6)) MA.audio.sfx('pop');
        if (isl.say(1.5) || isl.say(3.4)) MA.audio.sfx('turtle');
      }
      if (!d) return;
      var nod = isl.delivered ? happy * Math.sin(tr * 6) * 0.35 + (1 - happy) * Math.sin(t * 1.2) * 0.1 : Math.sin(t * 0.9) * 0.06;
      d.head.rotation.set(-near * 0.5 * (1 - happy) + nod - happy * 0.3, Math.sin(t * 0.6) * 0.3, 0);
      d.head.position.z = 2.0 + (isl.delivered ? 0.5 : near * 0.4);
      d.tt.position.y = TURT[1] + happy * Math.abs(Math.sin(tr * 6)) * 0.7;
    },
  };

  // ====================================================================== LIGHTHOUSE
  var LIG = { R: 40, H: 10, seed: 8.8, flat: 0.3, amp: 0.16 };
  LIG.color = function (x, y, z) {
    if (y > 8.6) return 0x9bdc74;
    var n = Math.sin(x * 0.4 + z * 0.23) + Math.sin(z * 0.37 - x * 0.11);
    return n > 0.6 ? 0xc9c3da : n < -0.7 ? 0xa39cba : P.rock;
  };
  var BANDS = [0xf2594b, 0xff9a2e, 0xffd24a, 0x3fcf8e, 0x4bc0f2, 0x7f7bff, 0xc77dff];
  var TOWER_H = 40, LAMP_Y = LIG.H + TOWER_H + 4.2, PENG = [11, 0, 13], PENG_S = 1.35;
  PENG[1] = heightOf(LIG, PENG[0], PENG[2]) + 1.0;
  var defLight = {
    o: LIG, target: [PENG[0], PENG[1] + 7.5 * PENG_S, PENG[2]], obstacle: { x: 0, z: 0, r: 8.5, h: LIG.H + 54 }, seaR: 42,
    base: function (isl, grp) {
      var g = new Geo(), y0 = LIG.H, i, a;
      terrain(g, LIG);
      for (i = 0; i < 9; i++) {
        a = i * 0.7 + 0.3;
        var d = LIG.R * (0.72 + (i % 3) * 0.1);
        g.ico(i % 2 ? 0xa39cba : P.rock, 4 + (i % 3) * 1.6, [Math.sin(a) * d, 1.5, Math.cos(a) * d], [1, 0.8, 1], 0, [i, i * 2, 0]);
      }
      g.cyl(P.white, 6.2, 6.6, 2.2, [0, y0 + 1.1, 0], null, 14);
      // tower: seven rainbow bands
      var pts = [];
      for (i = 0; i <= 7; i++) pts.push([5.3 - (i / 7) * 1.7, (i / 7) * TOWER_H]);
      g.lathe(function (x, y, z) { return BANDS[clamp(Math.floor(((y - y0 - 2) / TOWER_H) * 7), 0, 6)]; }, pts, [0, y0 + 2, 0], null, 14);
      g.cyl(P.white, 5.6, 4.6, 1.0, [0, y0 + TOWER_H + 2.3, 0], null, 14);
      for (i = 0; i < 10; i++) {
        a = (i / 10) * TAU;
        g.box(P.white, [0.25, 1.6, 0.25], [Math.sin(a) * 5.3, y0 + TOWER_H + 3.5, Math.cos(a) * 5.3]);
      }
      g.tor(P.white, 5.3, 0.14, [0, y0 + TOWER_H + 4.3, 0], [Math.PI / 2, 0, 0], 4, 14);
      for (i = 0; i < 6; i++) {
        a = (i / 6) * TAU;
        g.box(P.ink, [0.3, 5.2, 0.3], [Math.sin(a) * 3.2, y0 + TOWER_H + 5.4, Math.cos(a) * 3.2]);
      }
      g.cone(P.red, 4.4, 4.2, [0, y0 + TOWER_H + 10.1, 0], null, 12);
      g.sph(P.yellow, 0.8, [0, y0 + TOWER_H + 12.5, 0], null, 6, 5);
      g.box(0x7f5a3a, [2.4, 4.2, 0.6], [0, y0 + 4.2, 5.25]);
      grp.add(g.mesh());
      // lamp: dark until the star arrives
      var lampMat = new T.MeshBasicMaterial({ color: 0xcfd8e2 });
      var lamp = new T.Mesh(new T.SphereGeometry(2.7, 10, 8), lampMat);
      lamp.position.set(0, LAMP_Y + 1.2, 0);
      grp.add(lamp);
      isl.parts = { lamp: lamp, lampMat: lampMat, beams: null, star: null, on: 0 };
      if (isl.delivered) { defLight.light(isl); isl.parts.on = 1; }
    },
    // two rainbow beams sweeping round
    light: function (isl) {
      var p = isl.parts;
      if (p.beams) return;
      var geo = new T.ConeGeometry(12, 130, 14, 1, true), n = geo.attributes.position.count, col = new Float32Array(n * 3), i;
      geo.translate(0, -65, 0); // apex at the origin
      for (i = 0; i < n; i++) {
        var c = MA.col(BANDS[clamp(Math.floor(((Math.atan2(geo.attributes.position.getX(i), geo.attributes.position.getZ(i)) + Math.PI) / TAU) * 7), 0, 6)]);
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      }
      geo.rotateZ(Math.PI / 2 + 0.34); // pointing along +x and up into the sky, above the usual flying height
      geo.setAttribute('color', new T.BufferAttribute(col, 3));
      var mat = new T.ShaderMaterial({
        uniforms: { op: { value: 0 } },
        vertexShader: 'attribute vec3 color; varying vec3 vC; varying float vT; void main(){ vC = color; vT = length(position) / 131.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader:
          'precision highp float; uniform float op; varying vec3 vC; varying float vT;\n' +
          'void main(){ float a = (1.0 - vT) * op; gl_FragColor = vec4(vC, a);\n' +
          '  #include <colorspace_fragment>\n}',
        transparent: true, depthWrite: false, side: T.DoubleSide, fog: false,
      });
      var beams = new T.Group(), b1 = new T.Mesh(geo, mat), b2 = new T.Mesh(geo, mat);
      b2.rotation.y = Math.PI;
      beams.add(b1, b2);
      beams.position.set(0, LAMP_Y + 1.2, 0);
      b1.renderOrder = b2.renderOrder = 4;
      isl.group.add(beams);
      p.beams = beams;
      p.beamMat = mat;
      // a soft halo round the lamp
      var halo = new T.Mesh(new T.SphereGeometry(5.5, 10, 8), new T.MeshBasicMaterial({ color: 0xfff3a0, transparent: true, opacity: 0.3, depthWrite: false, fog: false }));
      halo.position.copy(beams.position);
      isl.group.add(halo);
      p.halo = halo;
    },
    detail: function (isl, grp) {
      var g = new Geo(), i, s, x, z, y;
      // deck for the keeper, cottage, rowing boat
      g.cyl(0xdcae6e, 5, 5.4, 1.1, [PENG[0], PENG[1] - 0.55, PENG[2]], null, 10);
      x = -13; z = 10; y = heightOf(LIG, x, z);
      g.box(P.white, [8, 5, 6], [x, y + 2.3, z], [0, 0.5, 0]);
      g.cyl(0x4b8fe0, 0.1, 5.2, 4, [x, y + 6.6, z], [0, 0.5 + Math.PI / 4, 0], 4);
      g.box(0x7f5a3a, [1.6, 2.8, 0.4], [x + 1.5, y + 1.4, z + 2.75], [0, 0.5, 0]);
      g.box(0x8fd6f5, [1.4, 1.4, 0.4], [x - 1.2, y + 3, z + 4.2], [0, 0.5, 0]);
      g.sph(0xd9573f, 3.2, [26, 0.3, 30], [0.6, 0.45, 1.5], 8, 5, [0, 0.6, 0]);
      g.box(P.cream, [2.6, 0.3, 0.9], [26, 1.2, 30], [0, 0.6, 0]);
      // flags on a line from the gallery down to the rocks
      var cols = BANDS;
      for (i = 0; i < 9; i++) {
        var u = (i + 0.5) / 9;
        g.cone(cols[i % 7], 0.8, 1.7, [MA.lerp(-5, -24, u), MA.lerp(LIG.H + TOWER_H + 1, 6, u) - Math.sin(u * Math.PI) * 5, MA.lerp(0, -18, u)], [Math.PI, 0.4, 0], 3);
      }
      // grass tufts and gulls resting on the rocks
      for (i = 0; i < 10; i++) {
        var a = i * 0.63, d = 9 + (i % 4) * 2.2;
        g.cone(0x6cc75a, 0.7, 1.6, [Math.sin(a) * d, heightOf(LIG, Math.sin(a) * d, Math.cos(a) * d) + 0.7, Math.cos(a) * d], null, 4);
      }
      for (i = 0; i < 3; i++) {
        a = 2.4 + i * 1.3; d = LIG.R * 0.78;
        g.sph(P.white, 1.1, [Math.sin(a) * d, 5.6, Math.cos(a) * d], [0.8, 0.8, 1.3], 7, 5);
        g.sph(P.white, 0.6, [Math.sin(a) * d, 6.6, Math.cos(a) * d + 1], null, 6, 4);
        g.cone(P.yellow, 0.2, 0.7, [Math.sin(a) * d, 6.5, Math.cos(a) * d + 1.7], [Math.PI / 2, 0, 0], 4);
      }
      grp.add(g.mesh());

      // --- the penguin keeper ---
      var NAVY = 0x33508a, pg = new T.Group();
      pg.position.set(PENG[0], PENG[1], PENG[2]);
      pg.scale.setScalar(PENG_S);
      grp.add(pg);
      g = new Geo();
      g.sph(NAVY, 1.9, [0, 2.3, 0], [1, 1.25, 0.95], 10, 8);
      g.sph(P.white, 1.6, [0, 2.1, 0.6], [0.85, 1.15, 0.75], 9, 7);
      g.sph(NAVY, 1.35, [0, 4.9, 0], null, 10, 8);
      g.cone(0xff9a2e, 0.42, 1.1, [0, 4.6, 1.55], [Math.PI / 2, 0, 0], 6);
      g.tor(P.red, 1.25, 0.34, [0, 3.85, 0], [Math.PI / 2, 0, 0], 5, 10);
      g.box(P.red, [0.6, 1.6, 0.3], [0.9, 3.1, 1.1], [0.2, 0, -0.2]);
      for (s = -1; s <= 1; s += 2) {
        g.sph(P.white, 0.75, [s * 0.5, 4.95, 0.75], [1, 1, 0.6], 7, 5);
        g.sph(P.ink, 0.2, [s * 0.5, 5.1, 1.22], null, 5, 4);
        g.sph(0xff9a2e, 0.7, [s * 0.8, 0.2, 0.5], [1, 0.35, 1.5], 6, 4);
      }
      var body = part(pg, g, 0, 0, 0);
      var flips = [];
      for (s = -1; s <= 1; s += 2) {
        g = new Geo();
        g.sph(NAVY, 0.6, [0, -1.25, 0], [0.45, 2.2, 1], 6, 5);
        var f = part(pg, g, s * 1.8, 3.6, 0);
        f.userData.s = s;
        flips.push(f);
      }
      // the star lamp that floats up to the lantern
      g = new Geo();
      g.sph(0xfff7b0, 1.0, [0, 0, 0], [1, 1, 0.7], 8, 6);
      for (i = 0; i < 5; i++) {
        var sa = (i / 5) * TAU;
        g.cone(0xffe14a, 0.62, 1.7, [Math.sin(sa) * 1.35, Math.cos(sa) * 1.35, 0], [0, 0, -sa], 4);
      }
      var star = part(grp, g, 0, 0, 0, MA.mat.basic);
      star.scale.setScalar(1.5);
      star.visible = false;
      isl.d = { pg: pg, body: body, flips: flips, star: star };
    },
    update: function (isl, dt, t) {
      var p = isl.parts, d = isl.d, tr = isl.tR, near = isl.near, i;
      var RISE0 = 0.5, RISE1 = 2.4;
      if (isl.delivered) {
        if (tr >= RISE1 || !d) { if (!p.beams) { defLight.light(isl); MA.audio.sfx('land'); } }
        if (p.beams) {
          p.on = damp(p.on, 1, 2, dt);
          p.lampMat.color.setHex(0xfff7a0);
          p.beams.rotation.y += dt * 0.45;
          p.beamMat.uniforms.op.value = 0.34 * p.on;
          p.halo.scale.setScalar(1 + Math.sin(t * 3) * 0.08 + (1 - p.on) * 1.5);
        }
        if (isl.say(0.3) || isl.say(2.9)) MA.audio.sfx('light');
      }
      if (!d) return;
      var hop = 0, flap = Math.sin(t * 1.5) * 0.08 + near * (0.9 + Math.sin(t * 9) * 0.5);
      if (isl.delivered) {
        var party = 1 - sstep(5, 7.5, tr);
        hop = party * Math.abs(Math.sin(tr * 6.5)) * 1.6;
        flap = party * (1.3 + Math.sin(tr * 20) * 0.6) + (1 - party) * flap;
        // star floats from the keeper up to the lantern
        if (tr > RISE0 && tr < RISE1) {
          var u = ease.inOut((tr - RISE0) / (RISE1 - RISE0));
          d.star.visible = true;
          d.star.position.set(MA.lerp(PENG[0], 0, u) + Math.sin(u * Math.PI) * 5, MA.lerp(PENG[1] + 9, LAMP_Y + 1.2, u), MA.lerp(PENG[2], 0, u) + Math.sin(u * Math.PI) * 5);
          d.star.rotation.y = isl.yaw * -1 + MA.ship.yaw + Math.PI;
          d.star.rotation.z = tr * 3;
          if (MA.late.fx && Math.random() < dt * 30) {
            var w = isl.group.localToWorld(_v.copy(d.star.position));
            MA.late.fx.emit(w.x, w.y, w.z, (Math.random() - 0.5) * 3, -2, (Math.random() - 0.5) * 3, 0xfff27a, 1.6, 0.9, -2);
          }
        } else d.star.visible = false;
      }
      d.pg.position.y = PENG[1] + hop;
      d.pg.rotation.z = Math.sin(t * 2.2) * 0.07;
      d.body.rotation.x = -near * 0.25;
      for (i = 0; i < 2; i++) d.flips[i].rotation.z = d.flips[i].userData.s * flap;
    },
  };

  var DEFS = { bear: defBear, mill: defMill, turtle: defTurtle, light: defLight };
  var _v = new T.Vector3();

  function makeIsland(scene, i) {
    var D = MA.dest[i], def = DEFS[D.id];
    var yaw = Math.atan2(-D.p.x, -D.p.z); // local +z looks back towards the port
    var cs = Math.cos(yaw), sn = Math.sin(yaw);
    var grp = new T.Group();
    grp.position.set(D.p.x, 0, D.p.z);
    grp.rotation.y = yaw;
    var isl = {
      i: i, id: D.id, def: def, group: grp, x: D.p.x, z: D.p.z, yaw: yaw,
      delivered: false, tR: 0, tPrev: 0, near: 0, hello: false, parts: null, d: null,
      target: new T.Vector3(),
      // true exactly once, when the reaction clock passes time s
      say: function (s) { return this.tPrev < s && this.tR >= s; },
      receive: function () { this.delivered = true; this.tR = 0; this.tPrev = -1; },
    };
    def.base(isl, grp);
    scene.add(grp);
    grp.updateMatrixWorld(true);
    isl.target.set(def.target[0], def.target[1], def.target[2]).applyMatrix4(grp.matrixWorld);
    // world hooks: ground height, soft obstacle, shallow water tint
    var floor = def.floor || function (x, z) { return heightOf(def.o, x, z); };
    MA.world.floors.push(function (wx, wz) {
      var dx = wx - D.p.x, dz = wz - D.p.z;
      if (dx * dx + dz * dz > 6400) return 0;
      return floor(dx * cs - dz * sn, dx * sn + dz * cs);
    });
    var ob = def.obstacle;
    MA.world.obstacles.push({ x: D.p.x + ob.x * cs + ob.z * sn, z: D.p.z - ob.x * sn + ob.z * cs, r: ob.r, h: ob.h });
    MA.sky.seaIslands[i].set(D.p.x, D.p.z, def.seaR, 0);
    // near details
    var place = {
      id: D.id, x: D.p.x, z: D.p.z, detail: null, building: false,
      buildDetail: function () {
        var g = new T.Group();
        g.position.copy(grp.position);
        g.rotation.y = yaw;
        def.detail(isl, g);
        return g;
      },
      dropDetail: function () { isl.d = null; },
    };
    MA.world.places.push(place);
    isl.place = place;
    islands[i] = isl;
  }

  MA.late.islands = {
    ready: false,
    list: islands,
    init: function (scene) {
      MA.mat.lambertDouble = new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide });
      MA.mat.lambertDouble.shared = true;
      for (var i = 0; i < 4; i++) MA.defer((function (i) { return function () { makeIsland(scene, i); }; })(i));
    },
    update: function (dt) {
      var t = MA.uni.time.value, p = MA.ship.pos;
      for (var i = 0; i < islands.length; i++) {
        var isl = islands[i];
        if (!isl) continue;
        var d = Math.hypot(p.x - isl.x, p.z - isl.z);
        isl.near = damp(isl.near, MA.state !== 'port' && d < 190 ? 1 : 0, 2.5, dt);
        if (isl.delivered) { isl.tPrev = isl.tR; isl.tR += dt; }
        // a hello when the ship arrives
        if (d < 170 && !isl.hello && MA.state === 'fly') { isl.hello = true; MA.audio.sfx(isl.id); }
        if (d > 300) isl.hello = false;
        if (d < 1300) isl.def.update(isl, dt, t);
      }
    },
  };
})();
