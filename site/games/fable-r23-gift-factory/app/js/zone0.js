/* Area 0: the rumbling box entrance. Hatch -> zig-zag roller chute -> belt -> lever picks
   the straight belt or the lift + long slide. A sleepy robot sits by the lever. */
(function () {
'use strict';
const T = THREE, C = GF.C, U = GF.U, E = U.ease, V = GF.V;
GF.defs[0] = function (Z) {
  const g = Z.geo(), S = Z.S, A = GF.audio;
  if (S.lever === undefined) S.lever = 0;

  /* walls */
  GF.deco.window(g, -3.4, 7.4); GF.deco.window(g, 1.2, 7.9, .8); GF.deco.window(g, 10.6, 8.2, .9);
  GF.deco.pipe(g, [[-14, 9.4, -15.6], [-5, 9.4, -15.6], [-5, 10.4, -15.6]], .16, C.orange);
  const gearA = Z.part(q => q.gear(1.0, 10, .25, C.orange, 0, 0, 0), null, 5.2, 8.0, -15.6);
  const gearB = Z.part(q => q.gear(.65, 7, .25, C.blue, 0, 0, 0), null, 6.95, 7.75, -15.6);

  /* hatch + zig-zag roller chute */
  g.box(2.8, 2.6, 1.0, C.purple, -9, 6.6, -15.4).box(2.1, 1.9, .1, C.night, -9, 6.6, -14.86).box(3.1, .3, 1.2, C.white, -9, 8.0, -15.4);
  const flap = Z.pivot(-9, 7.5, -14.8); Z.part(q => q.box(2.1, 1.9, .12, C.yellow, 0, -.95, 0).sph(.14, C.red, 0, -1.5, .1), flap);
  const chute = Z.belt([[-9, 5.7, -14.4], [-10.9, 4.6, -13.2], [-6.8, 3.4, -12.5], [-9.2, 2.2, -11.4], [-8.2, 1.3, -10.3]], { kind: 'roller', speed: 2.1, roll: 1.5, w: 1.35, color: C.orange });
  const main = Z.belt([[-8.2, 1.2, -10.2], [-1.2, 1.2, -10.2]], { speed: 1.25, color: C.blue });
  const low = Z.belt([[-1.2, 1.2, -10.2], [7.4, 1.2, -10.2], [11, 1.2, -12.3], [13.4, 1.2, -13.4]], { speed: 1.25, color: C.green });
  const slide = Z.belt([[-.3, 5.2, -12.9], [3, 4.7, -14.3], [8, 3.5, -14.3], [11.4, 2.7, -13.7], [13.5, 2.4, -13.6]], { kind: 'slide', speed: 3, color: C.pink, w: 1.25 });
  const out = b => { GF.pushPipe(1, b.d); Z.layer.remove(b); A.katan(.4); return true; };
  low.onEnd = out; slide.onEnd = out;

  /* lift */
  g.cyl(.1, .1, 6.6, C.steel, -2.0, 3.3, -13.3, 0, 0, 0, 8).cyl(.1, .1, 6.6, C.steel, -.4, 3.3, -13.3, 0, 0, 0, 8).box(2.2, .3, .5, C.red, -1.2, 6.6, -13.3).box(2.2, .3, 1.6, C.dark, -1.2, .15, -12.7);
  const plat = Z.part(q => q.box(1.5, .16, 1.4, C.yellow, 0, -.08, 0).box(1.7, .3, .2, C.red, 0, 0, -.75), null, -1.2, 1.2, -12.5);
  let liftBusy = false;
  function* liftSeq(b) {
    liftBusy = true; b.owner = null;
    yield* GF.fly(b, V(-1.2, 1.2, -12.5), .5, .32); A.katan();
    A.servo(1.3, 1);
    yield* GF.tween(1.3, t => { plat.position.y = U.lerp(1.2, 5.2, t); b.pos.y = plat.position.y; b.gy = b.pos.y; });
    A.ding(); yield .12;
    yield* GF.fly(b, V(-.3, 5.2, -12.9), .25, .25); slide.add(b, 0); A.whoosh();
    yield* GF.tween(1.0, t => { plat.position.y = U.lerp(5.2, 1.2, t); });
    liftBusy = false;
  }

  /* lever + route lamps */
  const LX = .1, LZ = -8.0;
  g.box(.9, .5, .7, C.dark, LX, .25, LZ).box(1.0, .12, .8, C.yellow, LX, .56, LZ);
  const stick = Z.pivot(LX, .5, LZ); Z.part(q => q.cyl(.07, .07, 1.3, C.steel, 0, .65, 0, 0, 0, 0, 8).sph(.24, C.red, 0, 1.35, 0, 1, 1, 1, 10, 7), stick);
  g.cyl(.07, .07, 2.2, C.steel, -.2, 2.2, -11.2, 0, 0, 0, 6).box(1.5, .7, .12, C.white, -.2, 3.4, -11.2);
  const lampLow = Z.lamp(new T.ConeGeometry(.22, .45, 10).rotateZ(-Math.PI / 2), 0x7a8799, .2, 3.4, -11.1);
  const lampUp = Z.lamp(new T.ConeGeometry(.22, .45, 10), 0x7a8799, -.6, 3.4, -11.1);
  function showLever(anim) {
    const to = S.lever ? -.55 : .55;
    if (anim) Z.run(GF.to(stick.rotation, { z: to }, .18, E.back)); else stick.rotation.z = to;
    lampLow.material.color.set(S.lever ? 0x7a8799 : 0x4dff88); lampUp.material.color.set(S.lever ? 0x4dff88 : 0x7a8799);
  }
  function setLever(v) { S.lever = v; showLever(true); A.clack(); }
  showLever(false);
  Z.hit(V(LX, 1.2, LZ), 1.0, () => setLever(1 - S.lever));

  /* sleepy robot: a box bonks it awake and it flips the lever in a hurry */
  const bot = GF.rig.robot(Z, { c: C.purple, c2: C.cream, at: [1.7, 0, -7.9], s: .8, pitch: .8 });
  bot.sleep = true; let botBusy = false, wakeT = U.rand(14, 20), snoreT = 2;
  function* wake() {
    bot.sleep = false; bot.busy = true; bot.head.rotation.x = 0;
    yield* GF.act.startle(bot);
    A.voice(bot.pitch, 'dizzy');
    yield* GF.tween(.16, t => { bot.inner.rotation.z = .35 * t; bot.armL.rotation.z = -1.9 * t; }, E.out);
    setLever(1 - S.lever);
    yield* GF.tween(.3, t => { bot.inner.rotation.z = .35 * (1 - t); bot.armL.rotation.z = -1.9 * (1 - t); });
    bot.busy = false; yield* GF.act.shake(bot);
    yield 2.2; bot.say('sleepy'); yield .8; bot.sleep = true;
  }
  function* bonk(b) {
    botBusy = true; b.owner = null;
    yield* GF.fly(b, V(1.7, 1.95, -7.9), 1.6, .45, 1); A.pon();
    const wp = Z.world(V(1.7, 2.3, -7.9)); GF.fx.emit('star', wp, 6);
    Z.run(wake());
    yield* GF.fly(b, V(-1.2, 1.2, -10.2), 1.2, .45, -1); A.katan();
    yield .5;
    while (!route(b)) yield .2;
    yield 5; botBusy = false; wakeT = U.rand(20, 30);
  }
  GF.rigHit(Z, bot, 1, () => { if (!botBusy) { botBusy = true; Z.run(function* () { yield* wake(); botBusy = false; wakeT = U.rand(20, 30); }()); } else Z.run(GF.act.hop(bot)); });

  function route(b) {
    if (S.lever === 0) { if (low.free(b.s)) { low.add(b, 0); return true; } return false; }
    if (!liftBusy) { Z.run(liftSeq(b)); return true; }
    return false;
  }
  main.onEnd = b => {
    if (wakeT <= 0 && !botBusy) { Z.run(bonk(b)); return true; }
    return route(b);
  };
  chute.onEnd = b => { if (!main.free(b.s)) return false; b.rot.set(0, 0, 0); main.add(b, 0); A.katan(.7); return true; };

  /* big button: more boxes tumble out */
  const btn = GF.deco.button(Z, -4.0, -7.4, C.red, .62);
  let flapA = 0, burst = 0, spT = .6;
  function spawn() {
    const b = Z.box(GF.newDesc(false)); chute.add(b, 0); flapA = 1; A.pon(.6);
  }
  Z.hit(V(-4.0, 1.1, -7.4), 1.0, () => { Z.run(GF.deco.press(btn, 1.0)); A.clack(); burst = Math.min(4, burst + 3); Z.run(GF.act.cheer(teddy)); });

  /* teddy who loves the button */
  const teddy = GF.rig.plush(Z, { kind: 'bear', c: 0xd9a066, c2: C.cream, at: [-5.7, 0, -8.5], ry: .3, pitch: 1.3 });
  GF.rigHit(Z, teddy);

  /* crank: everything runs fast for a moment */
  g.cyl(.14, .2, 1.4, C.steel, 4.7, .7, -7.9, 0, 0, 0, 8).box(.5, .5, .4, C.blue, 4.7, 1.5, -7.9);
  const crank = Z.pivot(4.7, 1.5, -7.6); Z.part(q => q.tor(.55, .08, C.yellow, 0, 0, 0, 0, 0, 0, 6, 18).box(1.1, .08, .06, C.yellow, 0, 0, 0).box(.08, 1.1, .06, C.yellow, 0, 0, 0).cyl(.08, .08, .3, C.red, .55, 0, .18, Math.PI / 2, 0, 0, 8), crank);
  let crankT = 0;
  Z.hit(V(4.7, 1.5, -7.7), .95, () => { if (crankT <= 0) A.whir(2.4); crankT = 2.4; });

  /* some boxes are already on their way */
  for (const d of [1.5, 4.2]) main.add(Z.box(GF.newDesc(false)), d);
  low.add(Z.box(GF.newDesc(false)), 5);
  chute.add(Z.box(GF.newDesc(false)), 6);

  Z.layer.onTap = b => GF.reveal(Z, b);
  Z.onUpdate(dt => {
    gearA.rotation.z += dt * .5 * Z.speed; gearB.rotation.z -= dt * .5 * Z.speed * (10 / 7);
    if (crankT > 0) { crankT -= dt; crank.rotation.z -= dt * 9; Z.speed = 2.6; } else Z.speed = 1;
    spT -= dt * Z.speed;
    if ((spT <= 0 || burst > 0) && chute.free(1)) { if (spT > 0) burst--; else spT = U.rand(3.2, 4.4); spawn(); }
    if (flapA > 0) { flapA = Math.max(0, flapA - dt * 2.2); flap.rotation.x = -Math.sin(flapA * Math.PI) * 1.1; }
    if (!botBusy) wakeT -= dt;
    if (bot.sleep) { snoreT -= dt; if (snoreT < 0) { snoreT = 2.6; if (GF.facing === 0) A.snore(); GF.fx.emit('puff', Z.world(V(2.1, 2.1, -7.7)), 1, 0xcfd8ff); } }
  });
  Z.hints.push(() => V(-4.0, 1.5, -7.4));
  Z.hints.push(() => { const b = main.boxes[0]; return b ? V(b.pos.x, b.pos.y + 1, b.pos.z) : null; });
  Z.hints.push(() => V(LX, 1.9, LZ));
  Z.hints.push(() => V(4.7, 1.6, -7.7));
};
})();
