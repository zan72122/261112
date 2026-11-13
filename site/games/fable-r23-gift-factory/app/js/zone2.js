/* Area 2: the ribbon-whirl wrapping machine. Sparkle washer drum -> toy peek arch ->
   ribbon whirler -> bow stamper. Colour buttons pick the ribbon. */
(function () {
'use strict';
const T = THREE, C = GF.C, U = GF.U, E = U.ease, V = GF.V;
GF.defs[2] = function (Z) {
  const g = Z.geo(), S = Z.S, A = GF.audio;
  if (S.rib === undefined) S.rib = 0;
  if (!S.n) S.n = 0;

  /* walls: ribbon rolls on a shelf */
  GF.deco.window(g, 10.2, 7.8, 1.0); GF.deco.window(g, -11.5, 8.0, .8);
  g.box(7, .2, .9, C.white, 1.5, 7.0, -15.5);
  GF.ribColors.concat([0x55bfee, 0xff9ecb]).forEach((c, k) => { g.cyl(.55, .55, .5, c, -1.3 + k * 1.15, 7.65, -15.5, Math.PI / 2, 0, 0, 14).cyl(.2, .2, .54, C.cream, -1.3 + k * 1.15, 7.65, -15.5, Math.PI / 2, 0, 0, 8); });
  GF.deco.pipe(g, [[-14, 6.2, -15.6], [-6.4, 6.2, -15.6], [-6.4, 4, -15.6], [-6.4, 4, -12.2]], .16, C.pink);

  /* belts */
  const bA = Z.belt([[-13.4, 1.2, -13.4], [-10.9, 1.2, -11.2], [-8.3, 1.2, -10.7]], { speed: 1.2, color: C.blue });
  const bB = Z.belt([[-4.5, 1.2, -10.6], [-1.5, 1.2, -10.6]], { speed: 1.2, color: C.green });
  const bC = Z.belt([[1.5, 1.2, -10.6], [4.6, 1.2, -10.6]], { speed: 1.2, color: C.orange });
  const bD = Z.belt([[6.7, 1.2, -10.6], [10.6, 1.2, -11.7], [13.4, 1.2, -13.4]], { speed: 1.2, color: C.pink });
  bD.onEnd = b => { GF.pushPipe(3, b.d); Z.layer.remove(b); A.katan(.4); return true; };

  /* sparkle washer */
  const WX = -6.4, WZ = -10.8;
  g.box(3.5, 3.7, .3, C.white, WX, 1.95, -12.05).box(3.5, .3, 2.7, C.white, WX, 3.75, WZ).box(3.5, .95, 2.7, C.white, WX, .475, WZ)
    .box(.72, 2.85, .2, C.white, WX - 1.39, 2.375, -9.55).box(.72, 2.85, .2, C.white, WX + 1.39, 2.375, -9.55).box(2.1, .55, .2, C.white, WX, 3.52, -9.55)
    .box(.2, 1.4, 2.5, C.white, WX - 1.65, 3.0, WZ).box(.2, 1.4, 2.5, C.white, WX + 1.65, 3.0, WZ)
    .box(3.3, 2.7, .1, C.night, WX, 2.35, -11.85).tor(1.05, .15, C.mint, WX, 2.25, -9.45, 0, 0, 0, 6, 24)
    .cyl(.22, .22, .15, C.red, WX - 1.2, 3.55, -9.42, Math.PI / 2, 0, 0, 10).sph(.1, C.yellow, WX + 1.0, 3.55, -9.45).sph(.1, C.green, WX + 1.3, 3.55, -9.45)
    .cyl(.3, .4, .7, C.steel, WX + .9, 4.25, -11.2, 0, 0, 0, 10);
  const drum = Z.part(q => { q.tor(1.12, .09, C.steel, 0, 0, .55, 0, 0, 0, 5, 20).tor(1.12, .09, C.steel, 0, 0, -.55, 0, 0, 0, 5, 20); for (let k = 0; k < 3; k++) { const a = k * Math.PI * 2 / 3; q.box(.24, .24, 1.3, k === 0 ? C.pink : C.blue, Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0, 0, 0, a); } }, null, WX, 2.25, WZ);
  const wash = { busy: false, spin: .6, boost: 0 };
  function* washSeq(b) {
    wash.busy = true; b.owner = 'wash'; b.gy = null;
    yield* GF.to(b.pos, { x: WX, y: 1.7, z: WZ }, .5);
    A.whir(2.2); wash.spin = 9; let t = 0;
    while (t < 2.2) {
      t += GF.dt * (wash.boost > 0 ? 2 : 1); const a = t * 7;
      b.pos.set(WX + Math.cos(a) * .32, 1.8 + Math.sin(a) * .32, WZ); b.rot.z = a * 1.5;
      if (Math.random() < .25) GF.fx.emit('bubble', Z.world(V(WX + .9, 4.6, -11.2)), 1);
      yield;
    }
    wash.spin = .6; b.rot.z = 0; b.col.lerp(new T.Color(0xffffff), .2); A.ding(); GF.fx.emit('spark', Z.world(V(WX, 2.6, -9.3)), 6);
    yield* GF.to(b.pos, { x: -4.5, y: 1.2, z: -10.6 }, .4);
    while (!bB.free(b.s)) yield .1;
    bB.add(b, 0); wash.busy = false;
  }
  bA.onEnd = b => { if (wash.busy) return false; Z.run(washSeq(b)); return true; };
  Z.hit(V(WX, 2.25, -9.6), 1.5, () => { wash.boost = 1.6; A.whir(1.4); GF.fx.emit('bubble', Z.world(V(WX, 3.2, -9.2)), 10); Z.run(GF.act.hop(bear)); }, { pri: .1 });
  const bear = GF.rig.plush(Z, { kind: 'bear', c: 0xfff0f5, c2: C.pink, at: [WX - .7, 3.9, -11.0], s: .7, pitch: 1.4 });
  GF.rigHit(Z, bear, .8);

  /* toy peek arch */
  g.cyl(.08, .08, 2.9, C.steel, -3, 1.45, -9.75, 0, 0, 0, 6).cyl(.08, .08, 2.9, C.steel, -3, 1.45, -11.45, 0, 0, 0, 6).box(.5, .25, 2.0, C.purple, -3, 2.95, -10.6).cyl(.6, .7, .25, C.yellow, -3, 3.2, -10.6, 0, 0, 0, 14);
  const peekLamp = Z.lamp(new T.SphereGeometry(.14, 8, 6), 0x7a8799, -3, 2.95, -9.55);
  const showToy = GF.toyShow(Z, -3, 3.75, -10.6);

  /* ribbon whirler */
  g.cyl(.2, .3, 1.1, C.steel, 0, .55, -10.6, 0, 0, 0, 10).box(.3, 4.2, .3, C.purple, 0, 2.1, -12.65).box(.3, .3, 2.5, C.purple, 0, 4.2, -11.55).cyl(.08, .08, 1.0, C.steel, 0, 3.6, -10.6, 0, 0, 0, 6);
  const pad = Z.part(q => q.cyl(.62, .62, .1, C.cream, 0, 0, 0, 0, 0, 0, 16).box(1.0, .03, .14, C.pink, 0, .05, 0).box(.14, .03, 1.0, C.pink, 0, .05, 0), null, 0, 1.14, -10.6);
  const hoop = Z.pivot(0, 1.8, -10.6);
  Z.part(q => q.tor(1.32, .12, C.red, 0, 0, 0, 0, 0, -Math.PI / 4, 6, 26, Math.PI * 1.5).sph(.16, C.red, -.93, -.93, 0), hoop);
  const spool = Z.lamp(new T.CylinderGeometry(.24, .24, .4, 12), GF.ribColors[S.rib], .93, -.93, 0, hoop);
  const tank = Z.lamp(new T.SphereGeometry(.5, 12, 8), GF.ribColors[S.rib], 0, 4.75, -10.6);
  g.cyl(.3, .4, .3, C.white, 0, 4.4, -10.6, 0, 0, 0, 10);
  const wrap = { busy: false, spin: .5, boost: 0, n: 0 };
  function* wrapSeq(b) {
    wrap.busy = true; b.owner = 'wrap';
    yield* GF.to(b.pos, { x: 0, y: 1.2, z: -10.6 }, .35);
    b.rib.set(GF.ribColors[S.rib]); b.d.rib = GF.ribColors[S.rib]; b.wrapK = .9; A.whir(1.8); wrap.spin = 9;
    let t = 0;
    while (t < 1.8) { t += GF.dt * (wrap.boost > 0 ? 1.8 : 1); b.rot.y -= GF.dt * 5; b.wrapK = .9 + .1 * Math.min(1, t / 1.8); b.rib.set(GF.ribColors[S.rib]); yield; }
    b.d.rib = GF.ribColors[S.rib]; b.d.wrapped = true; wrap.spin = .5; A.pon();
    yield* GF.tween(.3, t2 => { b.wrapK = 1 + .14 * Math.sin(t2 * Math.PI); b.rot.y *= (1 - t2); }, E.lin);
    b.wrapK = 1; b.rot.y = 0; wrap.n++;
    if (wrap.n % 3 === 2) Z.run(ribbonGag());
    yield* GF.to(b.pos, { x: 1.5 }, .3);
    while (!bC.free(b.s)) yield .1;
    bC.add(b, 0); wrap.busy = false;
  }
  bB.onEnd = b => { if (wrap.busy) return false; Z.run(wrapSeq(b)); return true; };
  Z.hit(V(0, 2.6, -10.6), 1.3, () => { wrap.boost = 1.5; A.whir(1.2); }, { pri: .2 });

  /* bow stamper */
  g.box(.26, 4.4, .26, C.yellow, 4.6, 2.2, -11.6).box(.26, 4.4, .26, C.yellow, 6.6, 2.2, -11.6).box(2.4, .6, 1.8, C.yellow, 5.6, 4.4, -10.9).box(1.3, .2, 1.3, C.steel, 5.6, 1.1, -10.6).cyl(.14, .2, 1.0, C.steel, 5.6, .5, -10.6, 0, 0, 0, 8);
  const piston = Z.part(q => q.cyl(.17, .17, 2.0, C.steel, 0, 1.1, 0, 0, 0, 0, 8).box(.95, .26, .95, C.red, 0, .13, 0), null, 5.6, 3.3, -10.6);
  const stamp = { busy: false };
  function* bowSeq(b) {
    stamp.busy = true; b.owner = 'bow';
    yield* GF.to(b.pos, { x: 5.6 }, .3);
    Z.run(GF.tween(.5, t => { doll.armR.rotation.z = .25 + 2.2 * Math.sin(t * Math.PI); }, E.lin));
    A.servo(.18, 1.6); yield* GF.to(piston.position, { y: 1.2 + b.s + .16 }, .16, E.in);
    A.pon(); b.d.bow = true; GF.fx.emit('star', Z.world(V(5.6, 2.3, -10.4)), 5); GF.fx.emit('confetti', Z.world(V(5.6, 2.3, -10.4)), 6);
    Z.run(GF.tween(.4, t => { b.bowK = t * (1 + .5 * Math.sin(t * Math.PI)); b.sc.set(1 + .2 * (1 - t), 1 - .25 * (1 - t), 1 + .2 * (1 - t)); }, E.out));
    yield* GF.to(piston.position, { y: 3.3 }, .35, E.out);
    b.bowK = 1; b.sc.set(1, 1, 1); Z.run(GF.act.hop(doll, .3));
    yield* GF.to(b.pos, { x: 6.7 }, .3);
    while (!bD.free(b.s)) yield .1;
    bD.add(b, 0); stamp.busy = false;
  }
  bC.onEnd = b => { if (stamp.busy) return false; Z.run(bowSeq(b)); return true; };
  const doll = GF.rig.doll(Z, { c: C.blue, c2: C.yellow, at: [8.3, 0, -8.6], ry: -.5, s: .85, pitch: 1.0 });
  GF.rigHit(Z, doll);

  /* helper robot: sometimes the ribbon winds around it and spins it free again */
  const bot = GF.rig.robot(Z, { c: C.blue, c2: C.cream, at: [2.4, 0, -8.7], ry: -.2, s: .8, pitch: 1.15 });
  const pts = []; for (let k = 0; k <= 40; k++) { const a = k / 40 * Math.PI * 8; pts.push(new T.Vector3(Math.cos(a) * .66, .2 + k / 40 * 1.45, Math.sin(a) * .66)); }
  const helix = Z.lamp(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 72, .07, 5), 0xffffff, 2.4, 0, -8.7); helix.visible = false;
  let gagBusy = false;
  function* ribbonGag() {
    if (gagBusy) return; gagBusy = true;
    helix.material.color.set(GF.ribColors[S.rib]); helix.visible = true; bot.wide = 1.2; bot.say('wow'); A.whoosh();
    yield* GF.tween(1.2, t => { helix.scale.set(1, Math.max(.01, t), 1); helix.rotation.y = -t * 12; bot.inner.rotation.y = t * Math.PI * 4; });
    bot.say('dizzy'); yield .5; A.whoosh();
    yield* GF.tween(1.3, t => { helix.scale.set(1 + t * .6, Math.max(.01, 1 - t), 1 + t * .6); helix.rotation.y = -12 + t * 12; bot.inner.rotation.y = (1 - t) * Math.PI * 4; });
    helix.visible = false; helix.scale.set(1, 1, 1); bot.inner.rotation.y = 0;
    yield* GF.tween(.9, t => { bot.inner.rotation.z = Math.sin(t * Math.PI * 4) * .25 * (1 - t); }, E.lin);
    bot.inner.rotation.z = 0; yield* GF.act.cheer(bot); gagBusy = false;
  }
  GF.rigHit(Z, bot, 1, () => { if (!gagBusy) Z.run(ribbonGag()); });

  /* ribbon colour buttons */
  const BX = [-3.6, -1.2, 1.2, 3.6], BZ = [-7.3, -6.6, -6.6, -7.3];
  const btns = BX.map((x, i) => {
    const m = GF.deco.button(Z, x, BZ[i], GF.ribColors[i], .5);
    Z.hit(V(x, 1.1, BZ[i]), .9, () => {
      S.rib = i; spool.material.color.set(GF.ribColors[i]); tank.material.color.set(GF.ribColors[i]);
      Z.run(GF.deco.press(m, 1.0)); A.pon(); A.clack(); wrap.boost = .8; GF.fx.emit('spark', Z.world(V(0, 4.8, -10.6)), 5);
    });
    return m;
  });

  /* inlet */
  let spT = 1;
  for (const d of [2, 4.8]) bA.add(Z.box(GF.pipe[2].shift() || GF.newDesc(false)), d);
  Z.layer.onTap = b => GF.reveal(Z, b);
  Z.onUpdate(dt => {
    spT -= dt; if (spT <= 0 && bA.free(1)) { spT = U.rand(4.4, 5.6); bA.add(Z.box(GF.pipe[2].shift() || GF.newDesc(false)), 0); }
    if (wash.boost > 0) wash.boost -= dt; if (wrap.boost > 0) wrap.boost -= dt;
    drum.rotation.z -= dt * (wash.spin + (wash.boost > 0 ? 9 : 0));
    const ws = wrap.spin + (wrap.boost > 0 ? 8 : 0);
    hoop.rotation.y += dt * ws; pad.rotation.y -= dt * ws * .6;
    btns.forEach((m, i) => { const k = i === S.rib ? 1.18 + Math.sin(GF.time * 4) * .05 : 1; m.scale.set(k, k, k); });
    for (const b of bB.boxes) if (!b.peeked && b.bd > 1.4) { b.peeked = true; showToy(b.d.toy); peekLamp.material.color.set(0xfff27a); Z.run(function* () { yield 2; peekLamp.material.color.set(0x7a8799); }()); }
  });
  Z.hints.push(() => { const i = (S.rib + 1 + Math.floor(GF.time / 8)) % 4; return V(BX[i], 1.5, BZ[i]); });
  Z.hints.push(() => V(WX, 2.3, -9.4));
  Z.hints.push(() => gagBusy ? null : V(2.4, 2.0, -8.7));
};
})();
