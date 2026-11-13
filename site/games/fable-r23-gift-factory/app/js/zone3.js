/* Area 3: the big present warehouse. A stacker lift files presents onto the shelves; when the
   lamps above the big shutter are all lit, it rolls up and the parade marches out. */
(function () {
'use strict';
const T = THREE, C = GF.C, U = GF.U, E = U.ease, V = GF.V;
GF.defs[3] = function (Z) {
  const g = Z.geo(), S = Z.S, A = GF.audio;
  if (!S.cells) S.cells = [null, null, null, null, null, null, null, null, null];
  if (!S.pile) { S.pile = []; for (let k = 0; k < 6; k++) { const d = GF.newDesc(true); d.size = .86; S.pile.push(d); } }
  if (S.target === undefined) S.target = -1;
  const CX = [-9.7, -7.5, -5.3], CY = [2.3, 4.2, 6.1];

  /* walls */
  GF.deco.window(g, 10.6, 8.0, 1.0); GF.deco.window(g, 7.4, 8.4, .7);
  for (let k = 0; k < 12; k++) g.cone(.28, .5, GF.boxColors[k % 7], -5.2 + k * .95, 9.0 - Math.sin(k / 11 * Math.PI) * .5, -15.7, Math.PI, 0, 0, 4);

  /* shelves */
  for (const x of [-10.8, -8.6, -6.4, -4.2]) g.box(.18, 8.2, 1.3, C.blue, x, 4.1, -14.7);
  CY.forEach(y => g.box(6.8, .14, 1.4, C.wood, -7.5, y - .07, -14.7));
  g.box(6.8, .2, 1.4, C.blue, -7.5, 8.2, -14.7);
  const cells = [null, null, null, null, null, null, null, null, null];
  const cellPos = c => V(CX[c % 3], CY[(c / 3) | 0], -14.6);
  const cellLamp = [];
  for (let c = 0; c < 9; c++) {
    const p = cellPos(c); cellLamp.push(Z.lamp(new T.SphereGeometry(.09, 6, 5), 0x9aa5b5, p.x, p.y - .07, -13.95));
    Z.hit(V(p.x, p.y + .6, p.z), .85, () => { S.target = c; A.pon(.7); GF.fx.emit('spark', Z.world(V(p.x, p.y + .6, p.z + .5)), 4); }, { on: () => !cells[c], pri: .1 });
  }

  /* belt + stacker lift */
  const belt = Z.belt([[-13.4, 1.2, -13.4], [-11.7, 1.2, -10.6], [-4.8, 1.2, -10.2]], { speed: 1.2, color: C.green });
  g.box(8.6, .1, .6, C.dark, -7.3, .05, -12.5);
  const mast = Z.pivot(-4.8, 0, -12.5);
  Z.part(q => q.box(.22, 8.3, .22, C.orange, -.8, 4.15, -.3).box(.22, 8.3, .22, C.orange, .8, 4.15, -.3).box(1.9, .5, .4, C.orange, 0, 8.4, -.3).box(1.2, .28, .06, C.night, 0, 8.4, -.08)
    .box(2.0, .4, 1.0, C.dark, 0, .25, 0).cyl(.2, .2, 2.1, C.night, 0, .2, .35, 0, 0, Math.PI / 2, 8), mast);
  for (const x of [-.3, .3]) { const e = new T.Mesh(GF.geoEye, GF.eyeGlow); e.scale.set(.09, .09, .05); e.position.set(x, 8.4, -.04); mast.add(e); }
  const fork = Z.part(q => q.box(1.3, .12, 1.2, C.yellow, 0, -.06, .1).box(1.4, .7, .12, C.yellow, 0, .3, -.45), mast, 0, 1.2, 0);
  const st = { busy: false, hold: null };
  function nextCell() { if (S.target >= 0 && !cells[S.target]) return S.target; for (let c = 0; c < 9; c++) if (!cells[c]) return c; return -1; }
  const count = () => cells.filter(c => c).length;
  function* store(b, c) {
    st.busy = true; b.owner = 'st'; cells[c] = b; b.stored = false; if (S.target === c) S.target = -1;
    yield* GF.fly(b, V(mast.position.x, fork.position.y, -12.4), .5, .32); A.katan(); st.hold = b;
    const p = cellPos(c);
    A.servo(1.1, 1); yield* GF.all(GF.to(mast.position, { x: p.x }, 1.1), GF.to(fork.position, { y: p.y }, 1.1));
    st.hold = null; yield* GF.to(b.pos, { z: p.z }, .3, E.out); A.katan(); b.gy = p.y; b.stored = true;
    A.ding(); GF.fx.emit('spark', Z.world(V(p.x, p.y + .9, p.z + .4)), 5); Z.run(GF.act.hop(keeper, .3));
    yield* GF.all(GF.to(mast.position, { x: -4.8 }, .9), GF.to(fork.position, { y: 1.2 }, .9));
    st.busy = false;
  }
  belt.onEnd = b => { if (st.busy || lock) return false; const c = nextCell(); if (c < 0) return false; Z.run(store(b, c)); return true; };
  S.cells.forEach((d, c) => { if (d) { const b = Z.box(d); b.pos.copy(cellPos(c)); b.gy = b.pos.y; b.owner = 'st'; b.stored = true; cells[c] = b; } });
  Z.hit(mast, 1.3, () => { A.servo(.6, 1.2); Z.run(function* () { if (st.busy) return; st.busy = true; yield* GF.to(fork.position, { y: 4.5 }, .35, E.out); yield* GF.to(fork.position, { y: 1.2 }, .45, E.bounce); A.katan(); st.busy = false; }()); }, { dy: 3 });

  /* big shutter with lamps */
  g.box(.7, 7.2, .9, C.red, -3.9, 3.6, -15.6).box(.7, 7.2, .9, C.red, 3.9, 3.6, -15.6).box(8.5, 1.0, .9, C.red, 0, 7.3, -15.6).box(7.2, 6.8, .1, C.night, 0, 3.4, -15.98);
  for (const x of [-1.7, -1.0, 1.1, 1.8]) { const e = new T.Mesh(GF.geoEye, GF.eyeGlow); e.scale.set(.12, .12, .05); e.position.set(x, 1.9 + (x > 0 ? .5 : 0), -15.9); Z.group.add(e); }
  const door = Z.part(q => { for (let k = 0; k < 8; k++) q.box(7.2, .86, .16, k % 2 ? 0xfff3c4 : C.yellow, 0, -.43 - k * .85, 0); q.box(7.3, .2, .3, C.steel, 0, -6.78, 0); }, null, 0, 6.85, -15.72);
  const lamps = []; for (let k = 0; k < 9; k++) lamps.push(Z.lamp(new T.SphereGeometry(.2, 8, 6), 0x9aa5b5, -3.2 + k * .8, 7.3, -15.1));
  function showLamps() {
    const n = count();
    lamps.forEach((l, k) => l.material.color.set(k < n ? (n === 9 && Math.sin(GF.time * 8 + k) > 0 ? 0xffffff : 0xffd84a) : 0x9aa5b5));
    cellLamp.forEach((l, c) => l.material.color.set(cells[c] ? 0x4dff88 : (S.target === c && Math.sin(GF.time * 8) > 0 ? 0xfff27a : 0x9aa5b5)));
  }
  let lock = false, readyT = 0, opening = false;
  const keeper = GF.rig.doll(Z, { c: C.green, c2: C.red, at: [5.0, 0, -13.6], ry: -.3, pitch: .9 });
  GF.rigHit(Z, keeper);
  g.cyl(.03, .03, 4, C.steel, 4.45, 5.3, -15.2, 0, 0, 0, 5).tor(.16, .04, C.red, 4.45, 3.2, -15.2, 0, 0, 0, 5, 10);
  function* openSeq() {
    lock = true; opening = true; GF.attention(-1);
    Z.run(GF.tween(.8, t => { keeper.armL.rotation.z = -.25 - 2.3 * Math.sin(t * Math.PI); }, E.lin));
    A.fanfare(); yield .5; A.shutter(2.2);
    yield* GF.tween(2.2, t => { door.scale.y = 1 - .96 * t; });
    GF.parade.start(cells.map(b => b.d));
    for (let c = 8; c >= 0; c--) {
      const b = cells[c]; cells[c] = null;
      GF.fx.emit('puff', Z.world(V(b.pos.x, b.pos.y + .5, b.pos.z + .3)), 3, 0xfff3c4); A.pon(.5); Z.layer.remove(b); yield .16;
    }
    opening = false;
    while (GF.parade.active && !GF.parade.out) yield .3;
    A.shutter(1.6); yield* GF.tween(1.6, t => { door.scale.y = .04 + .96 * t; });
    lock = false; readyT = 0;
  }
  Z.hit(V(0, 3.3, -15.6), 3.0, () => {
    if (lock) return;
    if (count() === 9 && !st.busy && GF.parade && !GF.parade.active) { Z.run(openSeq()); return; }
    A.shutter(.5); Z.run(function* () { lock = true; yield* GF.tween(.7, t => { door.scale.y = 1 - .16 * Math.sin(t * Math.PI); }, E.lin); door.scale.y = 1; lock = false; }());
  }, { pri: .35 });
  GF.debugParade = () => { for (let c = 0; c < 9; c++) if (!cells[c]) { const b = Z.box(GF.newDesc(true)); b.pos.copy(cellPos(c)); b.gy = b.pos.y; b.owner = 'st'; b.stored = true; cells[c] = b; } };

  /* play pile: tap to tumble, the robot rebuilds it with great pride */
  const PP = V(6.3, .3, -9.7);
  g.cyl(2.0, 2.0, .06, C.dark, PP.x, .03, PP.z, 0, 0, 0, 20).box(3.3, .24, 1.5, C.purple, PP.x, .18, PP.z);
  const SL = [[-.96, 0], [0, 0], [.96, 0], [-.48, 1], [.48, 1], [0, 2]];
  const slot = k => V(PP.x + SL[k][0], PP.y + SL[k][1] * .87, PP.z);
  const pile = { boxes: [], busy: false };
  S.pile.forEach((d, k) => { const b = Z.box(d); b.pos.copy(slot(k)); b.gy = b.pos.y; b.owner = pile; pile.boxes.push(b); });
  const bot = GF.rig.robot(Z, { c: C.orange, c2: C.cream, at: [9.0, 0, -11.9], ry: -.4, strong: true, pitch: .75 });
  GF.rigHit(Z, bot);
  let carry = null;
  function* drive(v, spd) {
    const p = bot.g.position, p0 = p.clone(), dur = Math.max(.2, p0.distanceTo(v) / (spd || 5));
    bot.g.rotation.y = Math.atan2(v.x - p0.x, v.z - p0.z);
    yield* GF.tween(dur, t => { p.lerpVectors(p0, v, t); });
  }
  function* restack(list) {
    yield .7; bot.say('yay'); let first = true;
    for (const b of list) {
      yield* drive(V(b.pos.x + .9, 0, b.pos.z + .2), 6);
      bot.g.rotation.y = -Math.PI / 2; A.clack(); b.tok++; b.sc.set(1, 1, 1); b.hop = 0; b.rot.set(0, 0, 0);
      bot.armL.rotation.z = -2.9; bot.armR.rotation.z = 2.9; carry = b; b.gy = null;
      if (first) {                                   // a tiny box, a gigantic effort
        first = false; bot.say('effort');
        yield* GF.tween(1.0, t => { bot.inner.rotation.z = Math.sin(t * Math.PI * 5) * .22; bot.jy = -.12 * Math.sin(t * Math.PI); }, E.lin);
        bot.inner.rotation.z = 0; bot.jy = 0; Z.run(GF.act.hop(bot, .4));
      }
      const k = pile.boxes.length, s = slot(k);
      yield* drive(V(s.x, 0, PP.z + 1.7), 6); bot.g.rotation.y = Math.PI;
      carry = null; pile.boxes.push(b); b.owner = pile;
      yield* GF.fly(b, s, .8, .3); A.katan(); bot.armL.rotation.z = 0; bot.armR.rotation.z = 0; if (k % 2) bot.say('happy');
    }
    pile.busy = false; bot.g.rotation.y = 0;
    yield* GF.all(GF.act.cheer(bot), GF.act.spin(bot, 2, .8));
    yield* drive(V(9.0, 0, -11.9), 4); bot.g.rotation.y = -.4;
  }
  function topple() {
    pile.busy = true; A.crash(); Z.run(GF.act.startle(bot));
    const list = pile.boxes.slice(); pile.boxes.length = 0;
    list.forEach(b => {
      b.owner = 'floor'; const to = V(PP.x + U.rand(-2.2, 1.6), 0, PP.z + U.rand(1.1, 2.3));
      Z.run(function* () { yield* GF.fly(b, to, U.rand(.8, 1.8), U.rand(.45, .7), U.pick([-1, 1])); A.katan(.6); if (b.d.bouncy) GF.reveal(Z, b, true); }());
    });
    Z.run(restack(list));
  }

  const bunny = GF.rig.plush(Z, { kind: 'bunny', c: 0xffe9a8, c2: C.cream, at: [-2.7, 0, -8.2], ry: .3, pitch: 1.45 });
  GF.rigHit(Z, bunny);
  const showToy = GF.toyShow(Z, 0, 0, 0);

  Z.layer.onTap = b => {
    if (b.owner === pile) { if (!pile.busy && pile.boxes.length === 6) topple(); return; }
    if (b === carry || b === st.hold) return;
    GF.reveal(Z, b);
    if (b.stored && !lock) showToy(b.d.toy, b.pos.x, b.pos.y + b.s + .45, b.pos.z + .5);
  };
  Z.save = () => {
    S.cells = cells.map(b => (b && b.stored && !opening) ? b.d : null);
    if (opening) S.cells = S.cells.map(() => null);
  };

  let spT = 1.5;
  for (const d of [3.5]) belt.add(Z.box(GF.pipe[3].shift() || GF.newDesc(true)), d);
  Z.onUpdate(dt => {
    spT -= dt;
    if (spT <= 0 && belt.free(1) && belt.boxes.length < 5) { spT = U.rand(4.2, 5.2); const d = GF.pipe[3].shift() || GF.newDesc(true); d.wrapped = true; d.bow = true; belt.add(Z.box(d), 0); }
    if (st.hold) st.hold.pos.set(mast.position.x, fork.position.y, -12.4);
    if (carry) carry.pos.set(bot.g.position.x, 2.45 + bot.inner.position.y, bot.g.position.z);
    showLamps();
    if (count() === 9 && !lock && !st.busy && cells.every(b => b.stored)) {
      if (GF.facing === 3 && GF.parade && !GF.parade.active) { readyT += dt; if (readyT > 2.2) Z.run(openSeq()); }
      else if (GF.facing !== 3 && GF.parade && !GF.parade.active) GF.attention(3);
    }
  });
  Z.hints.push(() => count() === 9 && !lock ? V(0, 3.4, -15.2) : null);
  Z.hints.push(() => { const c = cells.findIndex((b, k) => !b && k !== S.target && k > 2); return c >= 0 ? V(CX[c % 3], CY[(c / 3) | 0] + .6, -14.2) : null; });
  Z.hints.push(() => !pile.busy && pile.boxes.length === 6 ? V(PP.x, 2.6, PP.z) : null);
  Z.hints.push(() => { const b = cells.find(x => x && x.stored); return b ? V(b.pos.x, b.pos.y + .6, b.pos.z + .5) : null; });
};
})();
