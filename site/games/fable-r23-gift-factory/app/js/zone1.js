/* Area 1: the spinning sorting plaza. Boxes ride onto a turntable; tapping a friend (or dragging
   the box) sends it down that friend's slide. Four friends: bell (jingly), moon (quiet),
   spring (bouncy), cushion (floppy). Nothing is ever "wrong": a strong hover-robot re-carries. */
(function () {
'use strict';
const T = THREE, C = GF.C, U = GF.U, E = U.ease, V = GF.V;
GF.defs[1] = function (Z) {
  const g = Z.geo(), S = Z.S, A = GF.audio;
  if (!S.piles) S.piles = [[], [], [], []];
  if (!S.n) S.n = 0;
  const TT = V(0, 1.3, -11.4);
  const P = [V(-6.6, .4, -8.8), V(-2.7, .4, -7.2), V(2.7, .4, -7.2), V(6.6, .4, -8.8)];
  const RULE = [d => d.rings, d => !d.rings, d => d.bouncy, d => !d.bouncy];
  const RC = [C.yellow, C.purple, C.green, C.pink];
  const good = d => [d.rings ? 0 : 1, d.bouncy ? 2 : 3];

  /* walls */
  GF.deco.window(g, -11, 7.6, .9); GF.deco.window(g, -7.5, 8.2, .7);
  GF.deco.pipe(g, [[-14, 3.2, -15.6], [-4, 3.2, -15.6], [-4, 2.2, -15.6], [-.5, 2.2, -15.6]], .15, C.blue);

  /* belts */
  const inbound = Z.belt([[-13.4, 1.2, -13.4], [-10.6, 1.2, -12.4], [-1.9, 1.2, -11.6]], { speed: 1.2, color: C.blue });
  const exitBelt = Z.belt([[7.4, 1.2, -13], [11, 1.2, -12.8], [13.4, 1.2, -13.4]], { speed: 1.3, color: C.orange });
  exitBelt.onEnd = b => { if (b.d.giant) GF.state.giants = Math.min(2, GF.state.giants + 1); else GF.pushPipe(2, b.d); Z.layer.remove(b); A.katan(.4); return true; };

  /* turntable + aim ring */
  g.cyl(1.15, 1.35, 1.1, C.steel, TT.x, .55, TT.z, 0, 0, 0, 16).cyl(1.5, 1.5, .1, C.dark, TT.x, 1.12, TT.z, 0, 0, 0, 20);
  const disc = Z.part(q => { q.cyl(1.42, 1.42, .1, C.cream, 0, 0, 0, 0, 0, 0, 24); for (let k = 0; k < 6; k++) q.box(1.3, .03, .22, k % 2 ? C.pink : C.blue, Math.cos(k * Math.PI / 3) * .7, .05, -Math.sin(k * Math.PI / 3) * .7, 0, k * Math.PI / 3, 0); }, null, TT.x, 1.23, TT.z);
  const aimP = Z.part(q => q.tor(1.72, .09, C.dark, 0, 0, 0, Math.PI / 2, 0, 0, 5, 28).cone(.3, .6, C.red, 2.05, .05, 0, 0, 0, -Math.PI / 2, 10).box(.28, .5, 1.0, C.red, -1.6, .3, 0), null, TT.x, 1.2, TT.z);
  const ang = P.map(p => Math.atan2(-(p.z - TT.z), p.x - TT.x));
  const dirs = P.map(p => V(p.x - TT.x, 0, p.z - TT.z).normalize());
  const chStart = dirs.map(d => V(TT.x + d.x * 1.9, 1.2, TT.z + d.z * 1.9));
  const chutes = P.map((p, i) => Z.belt([[chStart[i].x, 1.2, chStart[i].z], [p.x - dirs[i].x * 1.55, .95, p.z - dirs[i].z * 1.55]], { kind: 'slide', speed: 3.2, w: 1.15, color: RC[i], legs: false }));
  let aimBusy = false, ttBox = null, ttBusy = false, ttT = 0, discA = 0;
  aimP.rotation.y = ang[0];
  function* aimTo(i) {
    if (aimBusy) return; aimBusy = true;
    const a0 = aimP.rotation.y; let d = ang[i] - a0;
    if (Math.abs(d) > .02) { A.servo(.4, 1.2); yield* GF.tween(.4, t => { aimP.rotation.y = a0 + d * t; }); }
    aimBusy = false;
  }
  function* sendTo(i) {
    const b = ttBox; if (!b || ttBusy) return; ttBusy = true;
    while (aimBusy) yield;
    yield* aimTo(i);
    A.pon(); ttBox = null; b.owner = 'fly';
    yield* GF.tween(.24, t => {
      b.pos.lerpVectors(TT, chStart[i], t); b.pos.y = U.lerp(TT.y, 1.2, t);
      const k = Math.sin(t * Math.PI) * .5; aimP.position.set(TT.x + dirs[i].x * k, 1.2, TT.z + dirs[i].z * k);
    }, E.in);
    aimP.position.set(TT.x, 1.2, TT.z);
    b.rot.y = 0; chutes[i].add(b, 0); A.whoosh(); ttBusy = false;
  }

  /* tester mallet on an arch behind the turntable */
  g.cyl(.1, .1, 3.8, C.steel, -2.0, 1.9, -13.1, 0, 0, 0, 8).cyl(.1, .1, 3.8, C.steel, 2.0, 1.9, -13.1, 0, 0, 0, 8).box(4.4, .3, .3, C.blue, 0, 3.8, -13.1);
  const mallet = Z.pivot(0, 3.7, -12.95); Z.part(q => q.box(.14, .14, 1.5, C.steel, 0, 0, .75).sph(.27, C.red, 0, 0, 1.55, 1, 1, 1, 10, 7), mallet);
  mallet.rotation.x = -.9; let malletBusy = false;
  function* malletTap() {
    if (malletBusy) return; malletBusy = true;
    yield* GF.to(mallet.rotation, { x: .72 }, .16, E.in); yield* GF.to(mallet.rotation, { x: -.9 }, .4, E.back);
    malletBusy = false;
  }

  /* receivers: platform + pile + icon lamp + friend */
  const recv = [
    GF.rig.plush(Z, { kind: 'bunny', c: 0xfff0f5, c2: C.pink, at: [-8.7, 0, -10.4], ry: .5, pitch: 1.5 }),
    GF.rig.plush(Z, { kind: 'cat', c: 0xc9b6f7, c2: C.cream, at: [-.95, 0, -6.1], s: .85, pitch: 1.2 }),
    GF.rig.robot(Z, { c: C.green, c2: C.cream, at: [.95, 0, -6.1], s: .8, pitch: 1.05 }),
    GF.rig.doll(Z, { c: C.pink, c2: C.yellow, at: [8.7, 0, -10.4], ry: -.5, pitch: .95 })
  ];
  const piles = [], icons = [], lamps = [], iconT = [0, 0, 0, 0], guards = [];
  const iconGeo = [
    q => q.sph(.42, C.gold, 0, .08, 0, 1, 1.05, 1, 12, 7).cyl(.5, .58, .16, C.gold, 0, -.3, 0, 0, 0, 0, 14).sph(.13, C.orange, 0, -.46, 0).sph(.1, C.gold, 0, .55, 0),
    q => q.tor(.42, .17, 0xfff3a0, 0, 0, 0, 0, 0, .9, 8, 16, Math.PI * 1.25).sph(.12, C.white, .42, .34, 0, 1, 1, .5, 6, 5),
    q => { for (let k = 0; k < 5; k++) q.tor(.3, .065, k % 2 ? 0x35c98a : 0x8ff0c4, 0, -.42 + k * .21, 0, Math.PI / 2 + .22, 0, 0, 5, 14); },
    q => q.sph(.5, 0xff8fc0, 0, 0, 0, 1.25, .5, 1, 12, 7).sph(.09, C.white, 0, .2, .2).box(1.0, .06, .06, C.white, 0, .0, .47)
  ];
  P.forEach((p, i) => {
    g.cyl(1.75, 1.75, .06, C.dark, p.x, .03, p.z, 0, 0, 0, 20);
    const plat = Z.part(q => q.box(2.4, .24, 1.5, RC[i], 0, 0, 0).box(2.5, .1, 1.6, C.white, 0, -.1, 0), null, p.x, p.y - .12, p.z);
    piles.push({ i: i, boxes: [], busy: false, plat: plat });
    g.cyl(.07, .07, 3.6, C.steel, p.x, 1.8, p.z - 1.05, 0, 0, 0, 6);
    lamps.push(Z.lamp(new T.CircleGeometry(.82, 22), 0x8a93a6, p.x, 4.1, p.z - 1.03));
    g.tor(.86, .09, C.white, p.x, 4.1, p.z - 1.0, 0, 0, 0, 5, 22);
    icons.push(Z.part(iconGeo[i], null, p.x, 4.1, p.z - .85));
    // guard arm
    g.cyl(.08, .1, 3.0, C.steel, p.x + 1.5, 1.5, p.z - .45, 0, 0, 0, 6);
    const ga = Z.pivot(p.x + 1.5, 2.6, p.z - .45); Z.part(q => q.box(.5, .12, .12, C.steel, -.25, 0, 0).sph(.2, C.red, -.55, 0, 0, 1, 1, 1, 8, 6).sph(.14, C.dark, 0, 0, 0), ga);
    ga.rotation.y = -1.5; guards.push(ga);
    Z.hit(V(p.x, 1.3, p.z), 1.5, () => tapRecv(i), { pri: .1 });
    Z.hit(V(p.x, 4.1, p.z - .9), .85, () => tapRecv(i));
    GF.rigHit(Z, recv[i], .9, () => tapRecv(i));
  });
  function flash(i, dur) { iconT[i] = Math.max(iconT[i], dur || 1.3); }
  function slotPos(pl, idx, out) {
    const col = idx % 2, row = (idx / 2) | 0; let y = pl.plat.position.y + .12;
    for (let r = 0; r < row; r++) { const bb = pl.boxes[r * 2 + col]; y += bb ? bb.s : .85; }
    return out.set(P[pl.i].x + (col ? .5 : -.5), y, P[pl.i].z);
  }
  function settle(pl) {
    pl.boxes.forEach((b, k) => {
      const to = slotPos(pl, k, V(0, 0, 0));
      if (b.pos.distanceTo(to) > .05) Z.run(function* () { yield* GF.fly(b, to, .1, .22); A.katan(.5); }());
    });
  }
  const pileOf = b => piles.find(p => p.boxes.indexOf(b) >= 0);
  S.piles.forEach((ds, i) => ds.forEach(d => { const b = Z.box(d), pl = piles[i]; pl.boxes.push(b); b.owner = pl; slotPos(pl, pl.boxes.length - 1, b.pos); b.gy = b.pos.y; }));
  Z.save = () => { S.piles = piles.map(p => p.boxes.map(b => b.d)); };

  function tapRecv(i) {
    flash(i, .8); Z.run(GF.act.hop(recv[i], .3));
    if (ttBox && !ttBusy && GF.state.demoDone) Z.run(sendTo(i)); else if (!ttBusy) Z.run(aimTo(i));
  }
  function* place(i, b) {
    const pl = piles[i]; pl.boxes.push(b); b.owner = pl; b.rot.set(0, 0, 0);
    yield* GF.fly(b, slotPos(pl, pl.boxes.length - 1, V(0, 0, 0)), .7, .32);
    A.katan(); judge(pl, b);
  }
  function judge(pl, b) {
    const rc = recv[pl.i], idx = pl.boxes.indexOf(b);
    if (idx < 0) return;
    if (RULE[pl.i](b.d)) {
      Z.run(GF.act.hop(rc)); rc.say('happy'); flash(pl.i);
      Z.run(function* () {
        if ((idx === 3 || idx === 5) && Math.random() < .55) yield* guardGag(pl, b);
        if (pl.boxes.length >= 6 && !pl.busy) yield* fullSeq(pl);
      }());
    } else { Z.run(GF.act.shake(rc)); rc.say('hm'); jobs.push({ type: 'fix', i: pl.i, b: b }); }
  }
  /* a wobbling box is steadied by the little guard arm */
  function* guardGag(pl, b) {
    const ga = guards[pl.i]; ga.position.y = b.pos.y + b.s * .55;
    yield* GF.tween(.5, t => { b.rot.z = -.32 * t + Math.sin(t * 20) * .04; }, E.in);
    if (pl.busy || pl.boxes.indexOf(b) < 0) { b.rot.z = 0; return; }
    A.servo(.18, 1.6); yield* GF.to(ga.rotation, { y: 0 }, .14, E.out); A.pon(.6);
    yield* GF.tween(.25, t => { b.rot.z = -.32 * (1 - t); }, E.back); b.rot.z = 0;
    recv[pl.i].wide = .6; recv[pl.i].say('wow');
    yield .5; yield* GF.to(ga.rotation, { y: -1.5 }, .4);
  }
  /* a full pile rides the platform lift down and comes out on the exit lift */
  const exitQ = [];
  function* fullSeq(pl) {
    pl.busy = true; jobs = jobs.filter(j => !(j.type === 'fix' && j.i === pl.i));
    Z.run(GF.act.cheer(recv[pl.i])); A.sparkle(); GF.fx.emit('confetti', Z.world(V(P[pl.i].x, 3, P[pl.i].z)), 22);
    yield 1.0; A.servo(1.4, .7);
    const y0 = pl.plat.position.y, ys = pl.boxes.map(b => b.pos.y);
    yield* GF.tween(1.4, t => { pl.plat.position.y = y0 - 4.4 * t; pl.boxes.forEach((b, k) => { b.pos.y = ys[k] - 4.4 * t; b.gy = null; }); }, E.in);
    for (const b of pl.boxes) { if (exitQ.length < 12) exitQ.push(b.d); Z.layer.remove(b); }
    pl.boxes.length = 0; yield .3;
    yield* GF.tween(1.0, t => { pl.plat.position.y = y0 - 4.4 * (1 - t); }, E.out);
    A.katan(); pl.busy = false;
  }
  g.box(1.9, .12, 1.9, C.dark, 6.4, .06, -13).cyl(.08, .08, 2.6, C.steel, 5.6, 1.3, -13.8, 0, 0, 0, 6).cyl(.08, .08, 2.6, C.steel, 7.2, 1.3, -13.8, 0, 0, 0, 6).box(1.9, .25, .25, C.orange, 6.4, 2.6, -13.8);
  const lift = Z.part(q => q.box(1.4, .14, 1.4, C.yellow, 0, -.07, 0), null, 6.4, -1.3, -13);
  Z.run(function* () {
    for (;;) {
      if (exitQ.length && !giant.busy && exitBelt.free(1)) {
        const b = Z.box(exitQ.shift()); b.pos.set(6.4, -1.3, -13); A.servo(.7, 1.3);
        yield* GF.tween(.7, t => { lift.position.y = U.lerp(-1.3, 1.2, t); b.pos.y = lift.position.y; }, E.out);
        A.ding(); yield .12;
        yield* GF.fly(b, V(7.4, 1.2, -13), .25, .25); exitBelt.add(b, 0);
        yield* GF.tween(.5, t => { lift.position.y = U.lerp(1.2, -1.3, t); });
      } else yield .3;
    }
  }());

  /* tap a tall pile: it tumbles and the robot happily rebuilds it */
  function topple(pl) {
    pl.busy = true; jobs = jobs.filter(j => !(j.type === 'fix' && j.i === pl.i));
    A.crash(); Z.run(GF.act.startle(recv[pl.i]));
    const list = pl.boxes.slice(); pl.boxes.length = 0;
    list.forEach(b => {
      b.owner = 'floor'; const to = V(P[pl.i].x * .82 + U.rand(-1.3, 1.3), 0, P[pl.i].z + U.rand(1.0, 2.0));
      Z.run(function* () { yield* GF.fly(b, to, U.rand(.8, 1.8), U.rand(.45, .7), U.pick([-1, 1])); A.katan(.6); if (b.d.bouncy) GF.reveal(Z, b, true); }());
    });
    jobs.push({ type: 'restack', pl: pl, list: list });
  }

  /* strong hover robot */
  const car = GF.rig.robot(Z, { c: C.red, c2: C.cream, hover: true, strong: true, at: [0, 4.5, -12.7], pitch: .7, s: .9 });
  const HOME = V(0, 4.5, -12.7); let hold = null, jobs = [], atHome = true;
  GF.rigHit(Z, car, 1, () => { Z.run(GF.act.spin(car, 1, .5)); car.say('happy'); });
  function* arcTo(v, H, spd) {
    const p = car.g.position, p0 = p.clone(), dur = Math.max(.25, p0.distanceTo(v) / (spd || 7));
    yield* GF.tween(dur, t => { p.lerpVectors(p0, v, t); p.y += Math.sin(t * Math.PI) * H; });
  }
  function* turn(a, dur) { yield* GF.to(car.g.rotation, { y: a }, dur || .3); }
  function* approach(b) { yield* GF.all(arcTo(V(b.pos.x, Math.max(.1, b.pos.y - .15), b.pos.z + .8), 1.4, 8), turn(Math.PI, .3)); }
  function arms(a) { car.armL.rotation.x = car.armR.rotation.x = a; }
  function attach(b) { hold = b; b.owner = 'car'; b.tok++; b.sc.set(1, 1, 1); b.hop = 0; b.rot.set(0, 0, 0); arms(-1.35); A.clack(); }
  function* heave() {                                 // big effort for a small box
    car.say('effort'); const y0 = car.g.position.y;
    yield* GF.tween(.8, t => { car.inner.rotation.z = Math.sin(t * Math.PI * 5) * .24; car.g.position.y = y0 - .3 * Math.sin(t * Math.PI / 2); }, E.lin);
    yield* GF.tween(.35, t => { car.inner.rotation.z = 0; car.g.position.y = y0 - .3 + 1.5 * t; }, E.back);
  }
  function release(pl, b) {
    hold = null; pl.boxes.push(b); b.owner = pl; slotPos(pl, pl.boxes.length - 1, b.pos); b.rot.set(0, 0, 0); b.gy = b.pos.y; arms(0); A.katan();
  }
  function* doFix(j) {
    const pl = piles[j.i], b = j.b;
    if (pl.boxes.indexOf(b) < 0 || pl.busy) return;
    yield* approach(b);
    if (pl.boxes.indexOf(b) < 0 || pl.busy || b.gone) return;
    pl.boxes.splice(pl.boxes.indexOf(b), 1); attach(b); settle(pl);
    yield* heave();
    A.whoosh(); yield* GF.tween(.45, t => { car.g.rotation.y = Math.PI + t * Math.PI; }); car.g.rotation.y = 0;   // whirl around
    const want = good(b.d); let dest = null, wait = 0;
    while (!dest) {
      const ok = want.filter(k => !piles[k].busy && piles[k].boxes.length < 6);
      if (ok.length) dest = piles[ok[0]]; else { yield .3; wait += .3; if (wait > 12) dest = piles[want[0]]; }
    }
    const s0 = slotPos(dest, dest.boxes.length, V(0, 0, 0));
    yield* arcTo(V(s0.x, s0.y - .15, s0.z + .8), 1.5, 6.5); yield* turn(Math.PI, .25);
    while (dest.busy || dest.boxes.length >= 6) yield .3;
    const s1 = slotPos(dest, dest.boxes.length, V(0, 0, 0)); car.g.position.set(s1.x, s1.y - .15, s1.z + .8);
    release(dest, b); flash(dest.i); Z.run(GF.act.cheer(recv[dest.i])); car.say('happy');
    yield .2; yield* turn(0, .25);
    if (dest.boxes.length >= 6 && !dest.busy) Z.run(fullSeq(dest));
  }
  function* doRestack(j) {
    const pl = j.pl; let n = 0;
    yield .5; car.say('yay');
    for (const b of j.list) {
      if (b.gone) continue;
      yield* approach(b); attach(b);
      const s = slotPos(pl, pl.boxes.length, V(0, 0, 0));
      yield* arcTo(V(s.x, s.y - .15, s.z + .8), 1.1, 9);
      release(pl, b); if (++n % 2) car.say('happy');
    }
    pl.busy = false;
    yield* GF.all(arcTo(V(P[pl.i].x, 3.2, P[pl.i].z + 1.6), .3, 6), turn(0, .2));
    car.say('yay'); Z.run(GF.act.cheer(recv[pl.i])); yield* GF.act.spin(car, 2, .7);
    if (pl.boxes.length >= 6) Z.run(fullSeq(pl));
  }
  Z.run(function* () {
    for (;;) {
      const j = jobs.shift();
      if (!j) { if (!atHome) { yield* GF.all(arcTo(HOME, .5, 6), turn(0, .3)); atHome = true; } yield .25; continue; }
      atHome = false;
      if (j.type === 'fix') yield* doFix(j); else yield* doRestack(j);
      if (hold) { hold = null; arms(0); }
    }
  }());

  /* giant box: three ceiling arms carry it together */
  g.box(23, .3, .4, C.red, 1.5, 9.2, -11.75).box(.3, .3, 4.4, C.red, -9.8, 9.2, -13.9).box(.3, .3, 4.4, C.red, 12.8, 9.2, -13.9);
  const tro = Z.pivot(-3.4, 9, -11.75); Z.part(q => q.box(2.4, .4, .9, C.dark, 0, 0, 0).cyl(.18, .18, 1.0, C.yellow, -1, 0, 0, Math.PI / 2, 0, 0, 10).cyl(.18, .18, 1.0, C.yellow, 1, 0, 0, Math.PI / 2, 0, 0, 10), tro);
  const armsG = [-.72, 0, .72].map(dx => {
    const a = { len: 1.3, rod: null, claw: null };
    a.rod = Z.part(q => q.cyl(.08, .08, 1, C.steel, 0, -.5, 0, 0, 0, 0, 8), tro, dx, 0, 0);
    a.claw = Z.part(q => q.box(.6, .14, .5, C.red, 0, 0, 0).box(.1, .4, .5, C.red, -.27, -.22, 0).box(.1, .4, .5, C.red, .27, -.22, 0), tro, dx, -1.3, 0);
    return a;
  });
  const setLen = (a, l) => { a.len = l; a.rod.scale.y = l; a.claw.position.y = -l; };
  armsG.forEach(a => setLen(a, 1.3));
  const giant = { busy: false, box: null, n: 0, t: 0, att: false };
  inbound.onStop = b => { giant.box = b; giant.n = 0; giant.t = 1.5; giant.busy = true; A.thud(); tro.position.x = b.pos.x; };
  function attachNext() {
    if (!giant.box || giant.n >= 3 || giant.att) return; giant.att = true; giant.t = 0;
    Z.run(function* () {
      const a = armsG[giant.n], b = giant.box, L = 9 - (b.pos.y + b.s);
      A.servo(.6, .9); yield* GF.tween(.6, t => setLen(a, U.lerp(1.3, L, t)), E.io);
      A.clack(); GF.fx.emit('spark', Z.world(V(tro.position.x + a.rod.position.x, b.pos.y + b.s, b.pos.z)), 5);
      giant.n++; giant.att = false;
      if (giant.n === 3) yield* carry(b);
    }());
  }
  function* carry(b) {
    car.say('wow'); yield .3; inbound.remove(b); b.owner = 'arms'; b.gy = null; A.servo(1.2, .6);
    const L0 = armsG[0].len, follow = () => { b.pos.set(tro.position.x, 9 - armsG[0].len - b.s, tro.position.z); };
    yield* GF.tween(1.2, t => { armsG.forEach(a => setLen(a, U.lerp(L0, 2.1, t))); follow(); });
    A.whir(2.6);
    yield* GF.tween(2.8, t => { tro.position.x = U.lerp(-3.4, 10, t); tro.position.z = U.lerp(-11.75, -12.86, t); follow(); b.rot.z = Math.sin(t * Math.PI * 4) * .05; });
    b.rot.z = 0;
    while (exitBelt.boxes.length) yield .2;
    A.servo(1.0, .6); yield* GF.tween(1.0, t => { armsG.forEach(a => setLen(a, U.lerp(2.1, 9 - 1.2 - b.s, t))); follow(); });
    A.thud(); exitBelt.add(b, 2.6); giant.box = null;
    GF.fx.emit('confetti', Z.world(V(10, 3, -12.8)), 16);
    yield* GF.tween(.8, t => armsG.forEach(a => setLen(a, U.lerp(9 - 1.2 - b.s, 1.3, t))));
    yield* GF.tween(1.6, t => { tro.position.x = U.lerp(10, -3.4, t); tro.position.z = U.lerp(-12.86, -11.75, t); });
    giant.busy = false;
  }
  Z.hit(tro, 1.4, attachNext, { dy: -1 });

  /* secret gear: opens the hidden golden belt in the wall */
  g.box(9.6, 2.5, .3, C.night, 5.2, 5.7, -15.6).box(9.6, .25, 1.5, C.purple, 5.2, 4.5, -15.0).box(9.8, .3, 1.6, C.purple, 5.2, 6.95, -15.0);
  const hid = Z.belt([[9.5, 4.9, -15], [1.0, 4.9, -15]], { speed: 1.5, w: 1.0, color: C.gold, legs: false }); hid.run = false;
  const panels = [0, 1, 2].map(k => Z.part(q => q.box(3.12, 2.1, .14, k % 2 ? 0x8fdcc0 : 0xa8ead2, 0, -1.05, 0).box(3.12, .12, .2, C.white, 0, -2.04, 0), null, 2.08 + k * 3.12, 6.8, -14.3));
  const sgear = Z.part(q => q.gear(.62, 8, .22, C.gold, 0, 0, 0), null, 10.75, 5.7, -14.5);
  const sec = { busy: false, tw: 4 };
  function* secret() {
    sec.busy = true; A.ratchet();
    yield* GF.tween(1.1, t => { sgear.rotation.z = t * Math.PI * 4; }, E.io);
    A.servo(.9, .8); GF.fx.emit('spark', Z.world(V(5.2, 6, -14.2)), 14);
    yield* GF.tween(.9, t => panels.forEach((p, k) => { p.scale.y = 1 - .95 * U.clamp(t * 1.6 - k * .3, 0, 1); }));
    hid.run = true; A.sparkle();
    for (let k = 0; k < 3; k++) {
      hid.add(Z.box({ color: 0xffd23f, rib: 0xff4f6d, wrapped: false, bow: false, size: .8, rings: true, bouncy: true, pitch: 1.5, toy: U.irand(6), gold: true }), 0);
      A.pon(); yield 1.2;
    }
    while (hid.boxes.length) { sgear.rotation.z += GF.dt * 3; yield; }
    yield 1.2; hid.run = false; A.servo(.8, .7);
    yield* GF.tween(.8, t => panels.forEach(p => { p.scale.y = .05 + .95 * t; }));
    sec.busy = false;
  }
  hid.onEnd = b => {
    Z.run(function* () {
      b.owner = 'fly'; const d = inbound.total - 4.6;
      yield* GF.fly(b, inbound.posAt(d, V(0, 0, 0)), 1.0, .6, 1); inbound.add(b, d); A.katan(); GF.fx.emit('spark', Z.world(b.pos), 6);
    }());
    return true;
  };
  Z.hit(V(10.75, 5.7, -14.5), 1.0, () => { if (!sec.busy) Z.run(secret()); });

  /* inlet */
  let spT = 1.2;
  function spawnIn() {
    S.n++;
    if (S.n % 8 === 5 && !giant.busy) {
      const d = GF.newDesc(true); d.size = 2.3; d.giant = true; d.pitch = .55;
      const b = Z.box(d); b.maxD = inbound.total - 1.5; inbound.add(b, 0); return;
    }
    inbound.add(Z.box(GF.pipe[1].shift() || GF.newDesc(false)), 0);
  }
  inbound.onEnd = b => {
    if (ttBox || ttBusy) return false; ttBusy = true;
    Z.run(function* () { b.owner = 'fly'; yield* GF.fly(b, TT, .3, .3); A.katan(); ttBox = b; b.owner = 'tt'; ttT = 0; ttBusy = false; }());
    return true;
  };
  for (const d of [3, 6.5]) inbound.add(Z.box(GF.newDesc(false)), d);

  /* the machine shows the very first box by itself */
  function* demo(b) {
    ttBusy = true; yield .6;
    for (let k = 0; k < 2; k++) {
      Z.run(malletTap()); yield .16; GF.reveal(Z, b); flash(b.d.rings ? 0 : 1, 2.2); yield 1.5;
    }
    const i = b.d.rings ? 0 : 1; flash(i, 2.5); GF.hint.at(() => Z.world(V(P[i].x, 4.1, P[i].z - .9)), 2);
    yield .9; ttBusy = false;
    yield* sendTo(i); GF.state.demoDone = true;
  }

  /* touch + drag */
  function onReveal(b) { flash(b.d.rings ? 0 : 1); flash(b.d.bouncy ? 2 : 3); }
  Z.layer.onTap = b => {
    if (b.d.giant) { if (b === giant.box) { if (giant.n === 0 && !giant.att) GF.reveal(Z, b); attachNext(); } else if (b.owner === exitBelt) GF.reveal(Z, b); return; }
    if (b.owner === 'car' || b.owner === 'fly') return;
    const pl = pileOf(b);
    if (pl) {
      if (ttBox && !ttBusy && GF.state.demoDone) { tapRecv(pl.i); return; }
      if (pl.boxes.length >= 3 && !pl.busy) { topple(pl); return; }
    }
    GF.reveal(Z, b); onReveal(b);
    if (b === ttBox && !ttBusy) Z.run(malletTap());
  };
  Z.layer.canDrag = b => GF.state.demoDone && !b.d.giant && !b.held && ((b === ttBox && !ttBusy) || b.owner === inbound);
  Z.layer.dragStart = b => { if (b === ttBox) ttBox = null; else inbound.remove(b); b.owner = 'hand'; b.held = true; b.rot.set(0, 0, 0); b.gy = .02; };
  Z.layer.dragMove = (b, pt) => {
    b.pos.x += (U.clamp(pt.x, -9.5, 9.5) - b.pos.x) * .6; b.pos.z += (U.clamp(pt.z, -13, -5.2) - b.pos.z) * .6; b.pos.y += (Z.dragY - b.pos.y) * .3;
    let best = -1, bd = 3;
    P.forEach((p, i) => { const d = Math.hypot(p.x - b.pos.x, p.z - b.pos.z); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) flash(best, .15);
  };
  Z.layer.dragEnd = b => {
    b.held = false; let best = -1, bd = 3;
    P.forEach((p, i) => { const d = Math.hypot(p.x - b.pos.x, p.z - b.pos.z); if (d < bd && !piles[i].busy && piles[i].boxes.length < 6) { bd = d; best = i; } });
    if (best >= 0) { A.whoosh(); Z.run(place(best, b)); return; }
    Z.run(function* () {
      if (!ttBox && !ttBusy) { ttBusy = true; b.owner = 'fly'; yield* GF.fly(b, TT, 1, .4); A.katan(); ttBox = b; b.owner = 'tt'; ttT = 0; ttBusy = false; }
      else { const d = inbound.total - 3.4; b.owner = 'fly'; yield* GF.fly(b, inbound.posAt(d, V(0, 0, 0)), 1, .4); inbound.add(b, d); A.katan(); }
    }());
  };
  chutes.forEach((c, i) => { c.onEnd = b => { const pl = piles[i]; if (pl.busy || pl.boxes.length >= 6) return false; Z.run(place(i, b)); return true; }; });

  Z.onUpdate(dt => {
    discA += dt * 1.1; disc.rotation.y = discA;
    if (ttBox && !ttBusy && !ttBox.held) {
      ttBox.pos.copy(TT); ttBox.gy = TT.y; ttBox.rot.y = discA; ttT += dt;
      if (!GF.state.demoDone) { if (GF.facing === 1) Z.run(demo(ttBox)); }
      else if (ttT > 7.5) {
        const w = good(ttBox.d), all = [0, 1, 2, 3].filter(k => !piles[k].busy && piles[k].boxes.length < 6);
        const ok = all.filter(k => w.indexOf(k) >= 0), bad = all.filter(k => w.indexOf(k) < 0);
        const pickFrom = (Math.random() < .72 && ok.length) ? ok : (bad.length ? bad : ok);
        if (pickFrom.length) Z.run(sendTo(U.pick(pickFrom))); else ttT = 5;
      }
    }
    spT -= dt;
    if (spT <= 0 && inbound.free(2.4)) { spT = U.rand(4.2, 5.4); spawnIn(); }
    if (giant.box && giant.n < 3) { giant.t += dt; if (giant.t > 3.2) attachNext(); }
    for (let i = 0; i < 4; i++) {
      if (iconT[i] > 0) { iconT[i] -= dt; lamps[i].material.color.set(0xfff27a); icons[i].scale.setScalar(1 + .22 * Math.abs(Math.sin(GF.time * 9))); icons[i].rotation.z = Math.sin(GF.time * 14) * (i === 0 ? .3 : .08); }
      else { lamps[i].material.color.set(0x8a93a6); icons[i].scale.setScalar(1); icons[i].rotation.z = 0; }
    }
    sec.tw -= dt;
    if (sec.tw < 0 && !sec.busy) { sec.tw = U.rand(7, 11); GF.fx.emit('spark', Z.world(V(10.75, 5.9, -14.3)), 3); Z.run(GF.tween(.5, t => { sgear.rotation.z = Math.sin(t * Math.PI * 2) * .4; }, E.lin)); }
  });
  Z.hints.push(() => giant.box && giant.n < 3 ? V(giant.box.pos.x, giant.box.pos.y + 2.6, giant.box.pos.z) : null);
  Z.hints.push(() => ttBox && !ttBusy ? V(TT.x, TT.y + 1.2, TT.z) : null);
  Z.hints.push(() => { if (!ttBox || ttBusy) return null; const i = good(ttBox.d)[Math.floor(GF.time / 4) % 2]; flash(i, .3); return V(P[i].x, 4.1, P[i].z - .9); });
  Z.hints.push(() => sec.busy ? null : V(10.75, 5.7, -14.4));
};
})();
