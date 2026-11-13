/* Helpers and receivers: little robots, plush animals, wooden dolls (no humans), plus their gestures. */
(function () {
'use strict';
const T = THREE, C = GF.C, U = GF.U, E = U.ease;

function finish(Z, rig, eyeMat, eyes, er) {
  rig.eyes = eyes.map(p => { const m = new T.Mesh(GF.geoEye, eyeMat); m.position.set(p[0], p[1], p[2]); m.scale.set(er, er, er * .6); rig.head.add(m); return m; });
  rig.er = er; rig.t = Math.random() * 9; rig.jy = 0; rig.blinkT = U.rand(1, 4); rig.blink = 0; rig.wide = 0; rig.sleep = false; rig.busy = false;
  rig.update = function (dt) {
    this.t += dt; this.blinkT -= dt;
    let ey = this.sleep ? .12 : 1;
    if (this.blinkT < 0) { this.blinkT = U.rand(2, 5); this.blink = .12; }
    if (this.blink > 0) { this.blink -= dt; ey = .1; }
    if (this.wide > 0) { this.wide -= dt; ey = 1.5; }
    for (const e of this.eyes) e.scale.y += (ey * this.er - e.scale.y) * Math.min(1, dt * 25);
    this.inner.position.y = this.jy + (this.hover ? Math.sin(this.t * 2.3) * .12 + .15 : 0);
    this.inner.scale.y = 1 + Math.sin(this.t * 2.1) * .015;
    if (!this.busy) {
      this.head.rotation.z = Math.sin(this.t * 1.1) * (this.sleep ? .1 : .05);
      if (this.sleep) this.head.rotation.x = .25 + Math.sin(this.t * .9) * .06;
    }
  };
  rig.say = function (mood) { GF.audio.voice(this.pitch, mood); };
  Z.group.add(rig.g); Z.rigs.push(rig);
  // soft blob shadow
  if (!rig.hover) { const sh = new T.Mesh(GF.geoShadow, GF.shadowMat); sh.scale.set(1.5, 1, 1.5); sh.position.y = .03; rig.g.add(sh); }
  return rig;
}
function base(o) {
  const g = new T.Group(), inner = new T.Group(); g.add(inner); g.scale.setScalar(o.s || 1);
  if (o.at) g.position.set(o.at[0], o.at[1], o.at[2]);
  if (o.ry) g.rotation.y = o.ry;
  return { g: g, inner: inner, pitch: o.pitch || 1, hover: !!o.hover };
}

GF.rig = {
  robot(Z, o) {
    o = o || {}; const c = o.c || C.blue, c2 = o.c2 || C.cream, rig = base(o);
    Z.part(q => {
      q.cyl(.5, .62, .95, c, 0, .85, 0, 0, 0, 0, 12).sph(.5, c, 0, 1.32, 0, 1, .45, 1, 12, 6).box(.52, .32, .1, c2, 0, .9, .57)
        .sph(.06, C.yellow, -.14, .92, .63).sph(.06, C.red, .02, .92, .63).sph(.06, C.green, .17, .92, .63);
      if (o.hover) q.cone(.45, .5, C.dark, 0, .2, 0, Math.PI, 0, 0, 12).tor(.5, .07, C.yellow, 0, .42, 0, Math.PI / 2, 0, 0, 5, 14);
      else q.cyl(.27, .27, .2, C.dark, -.5, .27, 0, 0, 0, Math.PI / 2, 12).cyl(.27, .27, .2, C.dark, .5, .27, 0, 0, 0, Math.PI / 2, 12).box(.8, .2, .5, C.steel, 0, .4, 0);
    }, rig.inner);
    rig.head = Z.pivot(0, 1.56, 0, rig.inner);
    Z.part(q => {
      q.box(.96, .66, .72, c2, 0, .33, 0).box(.76, .36, .06, C.night, 0, .36, .35).cyl(.03, .03, .3, C.steel, 0, .8, 0, 0, 0, 0, 6).sph(.09, C.red, 0, .98, 0, 1, 1, 1, 8, 6)
        .cyl(.13, .13, .12, c, -.52, .33, 0, 0, 0, Math.PI / 2, 10).cyl(.13, .13, .12, c, .52, .33, 0, 0, 0, Math.PI / 2, 10);
    }, rig.head);
    const ar = o.strong ? 1.5 : 1;
    rig.armL = Z.pivot(-.7, 1.25, 0, rig.inner); rig.armR = Z.pivot(.7, 1.25, 0, rig.inner);
    for (const a of [rig.armL, rig.armR]) Z.part(q => q.cyl(.1 * ar, .1 * ar, .62, C.steel, 0, -.31, 0, 0, 0, 0, 8).sph(.17 * ar, c, 0, -.68, 0, 1, 1, 1, 8, 6).sph(.14 * ar, c, 0, 0, 0, 1, 1, 1, 8, 6), a);
    return finish(Z, rig, GF.eyeGlow, [[-.19, .36, .385], [.19, .36, .385]], .1);
  },
  plush(Z, o) {
    o = o || {}; const c = o.c || C.wood, c2 = o.c2 || C.cream, kind = o.kind || 'bear', rig = base(o);
    Z.part(q => {
      q.sph(.6, c, 0, .62, 0, 1, 1, .9, 12, 8).sph(.4, c2, 0, .6, .3, 1, 1, .6, 10, 7)
        .sph(.22, c, -.33, .16, .32, 1, .8, 1.3, 8, 6).sph(.22, c, .33, .16, .32, 1, .8, 1.3, 8, 6);
      if (kind === 'cat') q.cyl(.07, .05, .8, c, .0, .5, -.55, .9, 0, 0, 6);
      if (kind === 'bunny') q.sph(.16, C.white, 0, .35, -.55, 1, 1, 1, 8, 6);
    }, rig.inner);
    rig.head = Z.pivot(0, 1.2, 0, rig.inner);
    Z.part(q => {
      q.sph(.5, c, 0, .32, 0, 1, .95, .95, 12, 8).sph(.2, c2, 0, .22, .4, 1, .8, .8, 8, 6).sph(.07, C.night, 0, .28, .57, 1, .8, 1, 6, 5);
      if (kind === 'bear') q.sph(.17, c, -.38, .7, 0, 1, 1, .6, 8, 6).sph(.17, c, .38, .7, 0, 1, 1, .6, 8, 6);
      if (kind === 'bunny') q.sph(.13, c, -.2, 1.05, 0, 1, 3.2, .7, 8, 6).sph(.13, c, .2, 1.05, 0, 1, 3.2, .7, 8, 6).sph(.07, C.pink, -.2, 1.05, .07, 1, 3.6, .5, 6, 5).sph(.07, C.pink, .2, 1.05, .07, 1, 3.6, .5, 6, 5);
      if (kind === 'cat') q.cone(.19, .34, c, -.3, .8, 0, 0, 0, .25, 6).cone(.19, .34, c, .3, .8, 0, 0, 0, -.25, 6);
      q.sph(.07, C.pink, -.3, .2, .36, 1, .7, .5, 6, 5).sph(.07, C.pink, .3, .2, .36, 1, .7, .5, 6, 5);
    }, rig.head);
    rig.armL = Z.pivot(-.55, 1.02, 0, rig.inner); rig.armR = Z.pivot(.55, 1.02, 0, rig.inner);
    for (const a of [rig.armL, rig.armR]) Z.part(q => q.sph(.17, c, 0, -.26, 0, 1, 1.9, 1, 8, 6), a);
    rig.armL.rotation.z = -.5; rig.armR.rotation.z = .5;
    return finish(Z, rig, GF.eyeDark, [[-.18, .4, .43], [.18, .4, .43]], .075);
  },
  doll(Z, o) {
    o = o || {}; const c = o.c || C.red, c2 = o.c2 || C.yellow, rig = base(o);
    Z.part(q => {
      q.cyl(.34, .56, 1.2, c, 0, .68, 0, 0, 0, 0, 14).cyl(.6, .6, .1, C.wood, 0, .05, 0, 0, 0, 0, 14)
        .tor(.5, .05, c2, 0, .32, 0, Math.PI / 2, 0, 0, 5, 16).tor(.42, .05, c2, 0, .7, 0, Math.PI / 2, 0, 0, 5, 16)
        .sph(.06, c2, 0, 1.0, .37).sph(.06, c2, 0, .85, .41);
    }, rig.inner);
    rig.head = Z.pivot(0, 1.22, 0, rig.inner);
    Z.part(q => {
      q.sph(.42, C.wood, 0, .4, 0, 1, 1, 1, 12, 8).cyl(.3, .45, .26, c2, 0, .76, 0, 0, 0, 0, 12).sph(.1, c, 0, .95, 0, 1, 1, 1, 8, 6)
        .sph(.07, C.pink, -.22, .3, .34, 1, .7, .5, 6, 5).sph(.07, C.pink, .22, .3, .34, 1, .7, .5, 6, 5);
    }, rig.head);
    rig.armL = Z.pivot(-.44, 1.1, 0, rig.inner); rig.armR = Z.pivot(.44, 1.1, 0, rig.inner);
    for (const a of [rig.armL, rig.armR]) Z.part(q => q.cyl(.07, .07, .55, C.wood, 0, -.27, 0, 0, 0, 0, 6).sph(.1, C.wood, 0, -.56, 0, 1, 1, 1, 6, 5), a);
    rig.armL.rotation.z = -.25; rig.armR.rotation.z = .25;
    return finish(Z, rig, GF.eyeDark, [[-.15, .44, .385], [.15, .44, .385]], .06);
  }
};

/* what hides inside the boxes */
GF.toyGeo = [
  q => q.sph(.4, C.red, 0, 0, 0, 1, 1, 1, 12, 8).tor(.4, .05, C.white, 0, 0, 0, Math.PI / 2, 0, 0, 5, 16).sph(.1, C.yellow, 0, .38, 0),
  q => { q.sph(.2, C.yellow, 0, 0, 0, 1, 1, .6); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; q.cone(.17, .4, C.yellow, Math.sin(a) * .3, Math.cos(a) * .3, 0, 0, 0, -a, 4); } },
  q => q.sph(.32, C.yellow, 0, -.1, 0, 1.15, .9, 1).sph(.22, C.yellow, .12, .28, 0).cone(.08, .2, C.orange, .38, .26, 0, 0, 0, -Math.PI / 2, 6).sph(.04, C.night, .22, .34, .17).sph(.04, C.night, .22, .34, -.17),
  q => q.box(.8, .25, .42, C.blue, 0, -.05, 0).box(.42, .22, .38, C.sky, -.05, .18, 0).cyl(.13, .13, .46, C.night, -.25, -.2, 0, Math.PI / 2, 0, 0, 8).cyl(.13, .13, .46, C.night, .25, -.2, 0, Math.PI / 2, 0, 0, 8),
  q => q.sph(.24, C.pink, -.17, .12, 0, 1, 1, .7).sph(.24, C.pink, .17, .12, 0, 1, 1, .7).cone(.37, .5, C.pink, 0, -.2, 0, Math.PI, 0, 0, 4),
  q => q.sph(.34, 0xd9a066, 0, 0, 0).sph(.13, 0xd9a066, -.27, .28, 0).sph(.13, 0xd9a066, .27, .28, 0).sph(.14, C.cream, 0, -.06, .28, 1, .8, .7).sph(.04, C.night, -.12, .08, .31).sph(.04, C.night, .12, .08, .31)
];
/* a little stage that pops up the toy for a moment */
GF.toyShow = function (Z, x, y, z) {
  const toys = GF.toyGeo.map(f => { const m = Z.part(f, null, x, y, z); m.scale.setScalar(.001); m.visible = false; return m; });
  let tok = 0;
  return function (idx, lx, ly, lz) {
    const m = toys[idx % toys.length], my = ++tok;
    toys.forEach(t => { t.visible = false; });
    if (lx !== undefined) m.position.set(lx, ly, lz);
    const y0 = m.position.y; m.visible = true; GF.audio.sparkle();
    Z.run(function* () {
      yield* GF.tween(.35, t => { if (tok === my) { m.scale.setScalar(Math.max(.001, t * 1.25)); m.rotation.y = t * 6; m.position.y = y0 + .5 * t; } }, E.back);
      let t = 0; while (t < 1.5 && tok === my) { t += GF.dt; m.rotation.y += GF.dt * 3; yield; }
      yield* GF.tween(.25, t => { if (tok === my) m.scale.setScalar(Math.max(.001, 1.25 * (1 - t))); }, E.in);
      if (tok === my) { m.visible = false; } m.position.y = y0;
    }());
  };
};

/* gestures (generators) */
GF.act = {
  hop: function* (r, h) {
    h = h || .45; let t = 0;
    while (t < 1) { t = Math.min(1, t + GF.dt / .34); r.jy = 4 * h * t * (1 - t); yield; }
    r.jy = 0;
  },
  cheer: function* (r) {
    r.say('yay'); const l0 = r.armL.rotation.z, r0 = r.armR.rotation.z;
    r.armL.rotation.z = -2.6; r.armR.rotation.z = 2.6;
    yield* GF.act.hop(r, .6); yield* GF.act.hop(r, .45);
    yield* GF.tween(.25, t => { r.armL.rotation.z = U.lerp(-2.6, l0, t); r.armR.rotation.z = U.lerp(2.6, r0, t); });
  },
  shake: function* (r) {
    r.busy = true;
    yield* GF.tween(.7, t => { r.head.rotation.y = Math.sin(t * Math.PI * 4) * .45 * (1 - t); r.head.rotation.z = .2 * Math.sin(t * Math.PI); }, E.lin);
    r.head.rotation.y = 0; r.busy = false;
  },
  wave: function* (r) {
    const r0 = r.armR.rotation.z;
    yield* GF.tween(.9, t => { r.armR.rotation.z = 2.5 + Math.sin(t * Math.PI * 6) * .35; }, E.lin);
    yield* GF.tween(.2, t => { r.armR.rotation.z = U.lerp(2.5, r0, t); });
  },
  spin: function* (r, turns, dur) {
    const a0 = r.inner.rotation.y;
    yield* GF.tween(dur || .5, t => { r.inner.rotation.y = a0 + t * Math.PI * 2 * (turns || 1); }, E.io);
    r.inner.rotation.y = a0;
  },
  startle: function* (r) { r.wide = .8; r.say('wow'); yield* GF.act.hop(r, .5); },
  tapped: function* (r) { r.say(U.pick(['happy', 'yay', 'wow'])); yield* GF.all(GF.act.hop(r, .5), GF.act.wave(r)); }
};
/* make a rig react to taps */
GF.rigHit = function (Z, rig, r, fn) {
  return Z.hit(rig.g, r || .95, () => { if (fn) fn(); else Z.run(GF.act.tapped(rig)); }, { dy: 1 });
};
})();
