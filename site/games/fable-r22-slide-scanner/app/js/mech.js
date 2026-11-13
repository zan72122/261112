/* mech.js — the machine as a simulation: axes, loader hand-offs, stage, lamp, what the
   camera sees. The 3D model is only a display of this state (apply()). */
(function () {
  'use strict';
  const SS = window.SS, U = SS.util, C = SS.cfg, T = THREE, Axis = SS.Axis, sim = SS.sim;
  const PI = Math.PI, TRAY = 1.5 * PI, STAGE = PI, UP = 1.8, OPEN = 0.35;
  const SLOT = [1, 2, 3]; // rack slot of each slide
  const Yax = new T.Vector3(0, 1, 0);

  const S = (SS.S = {
    step: 'load', view: 'real', busy: '', // busy: '', 'load', 'unload', 'af', 'scan', 'stitch', 'goto'
    stageSlide: -1, want: -1,
    lamp: { on: false, level: 0, set: 0.75, ref: 0.75, held: false },
    exposure: 1 / 0.75,
    zOff: 0, zHeld: false, zBase: 0, // user offset on top of the machine's focus position while scanning
    car: { x: 0, y: 0 }, bump: { x: 0, y: 0, vx: 0, vy: 0 }, nudge: { x: 0, y: 0, held: false },
    pos: { x: 0, y: 0 }, // true stage position (mm)
    slides: SS.pattern.slides.map((p, i) => ({ i, flipped: false, where: 'table' })),
    focus: { ok: false, z: 0, samples: [] },
    scan: null, job: null, zServo: false, camRev: 1,
  });
  const ax = (S.ax = {
    x: new Axis({ pos: 0, min: C.stage.xmin, max: C.stage.xmax, vmax: 60, acc: 420 }),
    y: new Axis({ pos: 0, min: C.stage.ymin, max: C.stage.ymax, vmax: 45, acc: 360 }),
    z: new Axis({ pos: 0, min: C.z.min, max: C.z.max, vmax: 420, acc: 5000, eps: 0.01 }),
    tur: new Axis({ pos: C.scanObjective, min: -1e6, max: 1e6, vmax: 2.2, acc: 10 }),
    elev: new Axis({ pos: 0, min: -4.2, max: 0, vmax: 5.5, acc: 34 }),
    tray: new Axis({ pos: 0, min: 0, max: 6.5, vmax: 10, acc: 60 }),
    arm: new Axis({ pos: TRAY, min: STAGE, max: TRAY, vmax: 2.4, acc: 10 }),
    lift: new Axis({ pos: UP, min: 0, max: UP, vmax: 4.5, acc: 36 }),
    grip: new Axis({ pos: OPEN, min: 0, max: OPEN, vmax: 1.6, acc: 24 }),
    clip: new Axis({ pos: 0.3, min: 0, max: 0.3, vmax: 1.4, acc: 20 }),
  });
  const mech = (SS.mech = {});
  let M = null;

  /* ---------- free-flying tweens (slides in the user's hand or gliding home) ---------- */
  const tweens = [];
  function fly(obj, pos, quat, dur, hop) {
    for (let i = tweens.length - 1; i >= 0; i--) if (tweens[i].obj === obj) tweens.splice(i, 1);
    return new Promise((res) => tweens.push({ obj, p0: obj.position.clone(), q0: obj.quaternion.clone(), p1: pos.clone(), q1: quat.clone(), t: 0, dur, hop: hop || 0, res }));
  }
  function stepTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const w = tweens[i]; w.t += dt / w.dur;
      const k = U.smooth(w.t);
      w.obj.position.lerpVectors(w.p0, w.p1, k); w.obj.position.y += Math.sin(k * PI) * w.hop;
      w.obj.quaternion.slerpQuaternions(w.q0, w.q1, k);
      if (w.t >= 1) { tweens.splice(i, 1); w.res(); }
    }
  }

  /* ---------- slides: where they are and who holds them ---------- */
  const _p = new T.Vector3(), _q = new T.Quaternion();
  function hold(i, a) { // attach slide i rigidly to an anchor
    const r = M.slides[i].root; a.parent.add(r); r.position.copy(a.pos); r.quaternion.setFromAxisAngle(Yax, a.yaw);
  }
  function anchorWorld(a, outP, outQ) {
    a.parent.updateWorldMatrix(true, false);
    outP.copy(a.pos).applyMatrix4(a.parent.matrixWorld);
    a.parent.getWorldQuaternion(outQ); outQ.multiply(_q2.setFromAxisAngle(Yax, a.yaw));
  }
  const _q2 = new T.Quaternion();
  function free(i) { M.root.attach(M.slides[i].root); }

  mech.flip = function (i) { // turn a slide over on the desk
    const s = S.slides[i]; if (s.where !== 'table') return;
    s.flipped = !s.flipped; s.flipT = 0; SS.emit('slide:flip', i);
  };
  mech.toTable = function (i, dur) {
    const s = S.slides[i], spot = M.tableSpot(i);
    free(i); s.where = 'fly';
    return fly(M.slides[i].root, spot.pos, spot.quat, dur || 0.7, 4).then(() => { if (s.where === 'fly') s.where = 'table'; });
  };
  // dragging by the user
  mech.dragStart = function (i) {
    const s = S.slides[i]; if (s.where !== 'table') return false;
    s.where = 'drag'; free(i);
    for (let k = tweens.length - 1; k >= 0; k--) if (tweens[k].obj === M.slides[i].root) tweens.splice(k, 1);
    return true;
  };
  mech.rackWorld = function (i, outP, outQ) { anchorWorld(M.anchorRack(SLOT[i]), outP, outQ); };
  mech.dragTo = function (i, p, near) { // p: wanted world position, near: 0..1 closeness to the rack
    const r = M.slides[i].root, spot = M.tableSpot(i);
    mech.rackWorld(i, _p, _q);
    const k = U.smooth((near - 0.45) / 0.55);
    r.position.lerp(_p2.copy(p).lerp(_p, k * 0.85), 0.5);
    r.quaternion.slerp(_q2.copy(spot.quat).slerp(_q, U.smooth(near * 1.4)), 0.35);
  };
  const _p2 = new T.Vector3();
  mech.dragEnd = function (i, intoRack) {
    const s = S.slides[i]; if (s.where !== 'drag') return;
    if (!intoRack) return mech.toTable(i, 0.45);
    s.where = 'fly';
    mech.rackWorld(i, _p, _q);
    // slide in from the open side of the rack
    fly(M.slides[i].root, _p, _q, 0.32, 0).then(() => {
      s.where = 'rack'; hold(i, M.anchorRack(SLOT[i]));
      SS.emit('slide:racked', i);
      mech.request(i);
    });
  };

  /* ---------- loader: rack -> tray -> arm -> stage, and back ---------- */
  const all = (list) => Promise.all(list);
  async function load(i) {
    const k = SLOT[i], s = S.slides[i];
    S.busy = 'load'; SS.emit('busy');
    S.lamp.on = false; S.focus.ok = false;
    await all([ax.x.moveTo(C.stage.loadX), ax.y.moveTo(0), ax.z.moveTo(250), ax.clip.moveTo(0.3), ax.lift.moveTo(UP), ax.grip.moveTo(OPEN), ax.elev.moveTo(-k * 0.9)]);
    await ax.arm.moveTo(TRAY);
    await ax.tray.moveTo(6.5); // fork goes under the slide
    await ax.elev.moveTo(-k * 0.9 - 0.3); // rack lowers until the slide rests on the tray
    hold(i, M.anchorTray); s.where = 'tray'; SS.emit('click');
    await ax.elev.moveTo(-k * 0.9 - 0.6);
    await ax.tray.moveTo(0);
    await ax.lift.moveTo(0);
    await ax.grip.moveTo(0); hold(i, M.anchorGrip); s.where = 'grip'; SS.emit('click');
    await ax.lift.moveTo(UP);
    await ax.arm.moveTo(STAGE);
    await ax.lift.moveTo(0);
    hold(i, M.anchorStage); s.where = 'stage'; S.stageSlide = i;
    await ax.grip.moveTo(OPEN); SS.emit('click');
    await ax.lift.moveTo(UP);
    await all([ax.arm.moveTo(TRAY), ax.clip.moveTo(0), ax.elev.moveTo(0)]);
    S.lamp.on = true;
    S.zOff = 0;
    await all([ax.x.moveTo(0), ax.y.moveTo(0), ax.z.moveTo(0)]);
    S.busy = ''; SS.emit('busy'); SS.emit('loaded', i);
  }
  async function unload() {
    const i = S.stageSlide, k = SLOT[i], s = S.slides[i];
    S.busy = 'unload'; SS.emit('busy');
    S.lamp.on = false; S.focus.ok = false; S.zOff = 0;
    S.nudge.x = S.nudge.y = 0;
    await all([ax.x.moveTo(C.stage.loadX), ax.y.moveTo(0), ax.z.moveTo(250), ax.lift.moveTo(UP), ax.grip.moveTo(OPEN), ax.tray.moveTo(0), ax.elev.moveTo(-k * 0.9 - 0.6)]);
    await all([ax.arm.moveTo(STAGE), ax.clip.moveTo(0.3)]);
    await ax.lift.moveTo(0);
    await ax.grip.moveTo(0); hold(i, M.anchorGrip); s.where = 'grip'; S.stageSlide = -1; SS.emit('click');
    await ax.lift.moveTo(UP);
    await ax.arm.moveTo(TRAY);
    await ax.lift.moveTo(0);
    hold(i, M.anchorTray); s.where = 'tray';
    await ax.grip.moveTo(OPEN); SS.emit('click');
    await ax.lift.moveTo(UP);
    await ax.tray.moveTo(6.5);
    await ax.elev.moveTo(-k * 0.9 - 0.3); // rack rises and lifts the slide off the tray
    hold(i, M.anchorRack(k)); s.where = 'rack'; SS.emit('click');
    await ax.elev.moveTo(-k * 0.9);
    await ax.tray.moveTo(0);
    await all([ax.elev.moveTo(0), ax.x.moveTo(0), ax.z.moveTo(0)]);
    S.busy = ''; SS.emit('busy'); SS.emit('unloaded', i);
  }
  // keeps the machine consistent with what the user asked for (S.want)
  let managing = false;
  async function manage() {
    if (managing) return;
    managing = true;
    try {
      for (;;) {
        // slides waiting in the rack that are no longer wanted glide back to the desk
        S.slides.forEach((s) => { if (s.where === 'rack' && s.i !== S.want) mech.toTable(s.i); });
        if (S.stageSlide >= 0 && S.want !== S.stageSlide) { mech.cancelJob(); await unload(); continue; }
        if (S.want >= 0 && S.stageSlide < 0 && S.slides[S.want].where === 'rack') { await load(S.want); continue; }
        break;
      }
    } finally { managing = false; }
  }
  mech.request = function (i) { S.want = i; mech.cancelJob(); manage(); };
  mech.eject = function () { S.want = -1; mech.cancelJob(); manage(); };
  mech.loaderBusy = () => managing;

  /* ---------- cancellable jobs (autofocus, scan, stitching, go-to) ---------- */
  mech.startJob = function (name, fn) {
    mech.cancelJob();
    const tok = { cancelled: false, name };
    S.job = tok; S.busy = name; SS.emit('busy');
    const done = () => { if (S.job === tok) { S.job = null; if (!managing) S.busy = ''; SS.emit('busy'); } };
    return fn(tok).then(done, (e) => { done(); if (!(e instanceof SS.Cancel)) { console.error(e); throw e; } });
  };
  mech.cancelJob = function () {
    if (S.job) { S.job.cancelled = true; S.job = null; S.zOff = 0; S.zServo = false; SS.emit('job:cancel'); }
  };

  /* ---------- user actions on the machine ---------- */
  mech.objective = () => (((Math.round(ax.tur.pos) % 3) + 3) % 3);
  mech.turretStep = function (d) { if (S.busy === 'scan' || S.busy === 'stitch' || S.busy === 'af') return; ax.tur.set(Math.round(ax.tur.target) + d); SS.emit('turret'); };
  mech.setObjective = function (k, tok) {
    const cur = Math.round(ax.tur.target), d = ((k - cur) % 3 + 4) % 3 - 1; // shortest way: -1, 0, +1
    return ax.tur.moveTo(cur + d, tok);
  };
  // dial: delta in µm
  mech.focusBy = function (d) {
    if (S.busy === 'load' || S.busy === 'unload') return 0;
    if (S.busy === 'scan' || S.busy === 'stitch') { S.zOff = U.clamp(S.zOff + d, -150, 150); return 0; }
    if (S.busy === 'af') mech.cancelJob();
    S.focus.ok = false;
    return ax.z.set(ax.z.target + d);
  };
  // jog: delta in mm; while scanning it only disturbs the stage, which springs back
  mech.jogBy = function (dx, dy) {
    if (S.busy === 'load' || S.busy === 'unload') return 0;
    if (S.busy === 'scan' || S.busy === 'stitch') {
      S.nudge.x = U.clamp(S.nudge.x + dx, -1.6, 1.6); S.nudge.y = U.clamp(S.nudge.y + dy, -1.6, 1.6); return 0;
    }
    if (S.busy === 'af' || S.busy === 'goto') mech.cancelJob();
    const lx = ax.x.set(ax.x.target + dx), ly = ax.y.set(ax.y.target + dy);
    if (lx || ly) SS.emit('limit', lx ? 'limitX' : 'limitY');
    return lx || ly;
  };
  mech.poke = function (ix, iy) { S.bump.vx += ix; S.bump.vy += iy; SS.emit('poke'); };

  /* ---------- what the camera sees ---------- */
  // aperture of the stage plate in pattern millimetres
  const AP = { x0: -5, x1: 48, y0: -0.5, y1: 24.5 };
  mech.cam = function () {
    const o = C.objectives[mech.objective()];
    const i = S.stageSlide, sl = i >= 0 ? SS.pattern.slides[i] : null, st = i >= 0 ? S.slides[i] : null;
    const cx = C.pat.w / 2 - S.pos.x, cy = C.pat.h / 2 - S.pos.y;
    let blur = 0;
    if (sl) {
      const zStar = sl.zs - (st.flipped ? C.flipDepth : 0);
      blur = o.c * Math.max(0, Math.abs(ax.z.pos + o.par - zStar) - o.dof / 2);
    }
    const turning = Math.abs(ax.tur.pos - Math.round(ax.tur.pos)) > 0.04;
    return { sl, flipped: st ? st.flipped : false, cx, cy, fov: o.fov, blur, gain: turning ? 0 : S.lamp.level * S.exposure, mag: o.mag };
  };
  // paint the camera image (square, n px) at dx,dy; cs may be a stored capture state
  mech.render = function (ctx, n, dx, dy, cs, crop) {
    cs = cs || mech.cam();
    const fov = cs.fov * (crop || 1), s = n / fov, x0 = cs.cx - fov / 2, y0 = cs.cy - fov / 2;
    if (cs.gain <= 0.004) { ctx.fillStyle = '#000'; ctx.fillRect(dx, dy, n, n); return; }
    SS.pattern.capture(ctx, cs.sl, x0, y0, s, n, n, dx, dy, cs.blur, cs.gain, cs.flipped);
    // the stage plate around the aperture is opaque
    ctx.fillStyle = '#000';
    const ax0 = (AP.x0 - x0) * s, ax1 = (AP.x1 - x0) * s, ay0 = (AP.y0 - y0) * s, ay1 = (AP.y1 - y0) * s;
    if (ax0 > 0) ctx.fillRect(dx, dy, Math.min(n, ax0), n);
    if (ax1 < n) ctx.fillRect(dx + Math.max(0, ax1), dy, n - Math.max(0, ax1), n);
    if (ay0 > 0) ctx.fillRect(dx, dy, n, Math.min(n, ay0));
    if (ay1 < n) ctx.fillRect(dx, dy + Math.max(0, ay1), n, n - Math.max(0, ay1));
  };
  // what is in the beam at the optical axis: 'air' | 'glass' | 'label' | 'plate'
  mech.beamAt = function () {
    const cx = C.pat.w / 2 - S.pos.x, cy = C.pat.h / 2 - S.pos.y;
    if (cx < AP.x0 || cx > AP.x1 || cy < AP.y0 || cy > AP.y1) return 'plate';
    return S.stageSlide >= 0 ? SS.pattern.materialAt(cx, cy) : 'air';
  };

  /* ---------- per-frame update ---------- */
  mech.init = function (model) {
    M = model;
    // registry used to compose base + dynamic motion + exploded-view offset
    M.movers = [];
    const reg = (node) => { const r = { node, base: node.position.clone(), dyn: new T.Vector3(), ex: new T.Vector3() }; node.userData.mv = r; M.movers.push(r); return r; };
    for (const id in M.parts) reg(M.parts[id]);
    M.mv = { gY: reg(M.gY), gX: reg(M.gX), gZ: reg(M.gZ), gRack: reg(M.gRack), gTray: reg(M.gTray), gLift: reg(M.gLift), fA: reg(M.fingerA), fB: reg(M.fingerB), gArm: reg(M.gArm), gT: reg(M.gTurret) };
    M.mv.clip = M.clip.userData.mv;
    M.explode = 0;
    mech.apply();
  };
  let dirty = true, lastSig = '';
  mech.update = function (dt) {
    let moved = 0;
    for (const k in ax) moved += Math.abs(ax[k].update(dt));
    // backlash: the nut has play, the carriage follows the screw only after the play is used up
    const h = C.stage.backlash / 2;
    if (ax.x.pos - S.car.x > h) S.car.x = ax.x.pos - h; else if (ax.x.pos - S.car.x < -h) S.car.x = ax.x.pos + h;
    S.car.y = ax.y.pos;
    // a knock: damped spring
    const b = S.bump;
    if (b.x || b.y || b.vx || b.vy) {
      // small fixed steps keep the spring stable at any frame rate
      const n = Math.ceil(dt / 0.004), h = dt / n;
      for (let q = 0; q < n; q++) { b.vx += (-900 * b.x - 26 * b.vx) * h; b.vy += (-900 * b.y - 26 * b.vy) * h; b.x += b.vx * h; b.y += b.vy * h; }
    }
    if (Math.abs(b.x) + Math.abs(b.y) + Math.abs(b.vx) + Math.abs(b.vy) < 1e-4) b.x = b.y = b.vx = b.vy = 0;
    // disturbances made while scanning ease back by themselves
    if (!S.nudge.held) { S.nudge.x = U.damp(S.nudge.x, 0, 7, dt); S.nudge.y = U.damp(S.nudge.y, 0, 7, dt); if (Math.abs(S.nudge.x) + Math.abs(S.nudge.y) < 1e-3) S.nudge.x = S.nudge.y = 0; }
    const scanning = S.busy === 'scan' || S.busy === 'stitch';
    if (scanning) {
      if (!S.zHeld) { S.zOff = U.damp(S.zOff, 0, 3.5, dt); if (Math.abs(S.zOff) < 0.3) S.zOff = 0; }
      if (S.zServo) ax.z.set(S.zBase + S.zOff);
      if (!S.lamp.held && S.lamp.set !== S.lamp.ref) { S.lamp.set = U.damp(S.lamp.set, S.lamp.ref, 2.5, dt); if (Math.abs(S.lamp.set - S.lamp.ref) < 0.004) S.lamp.set = S.lamp.ref; SS.emit('lamp'); }
    }
    S.pos.x = S.car.x + b.x + S.nudge.x; S.pos.y = S.car.y + b.y + S.nudge.y;
    const L = S.lamp; L.level = U.damp(L.level, L.on ? L.set : 0, 9, dt); if (Math.abs(L.level - (L.on ? L.set : 0)) < 0.002) L.level = L.on ? L.set : 0;
    stepTweens(dt);
    // flipping animation of slides on the desk
    for (let i = 0; i < 3; i++) {
      const s = S.slides[i], body = M.slides[i].body, goal = s.flipped ? PI : 0;
      if (body.rotation.x !== goal) {
        s.flipT = Math.min(1, (s.flipT || 0) + dt / 0.45);
        body.rotation.x = U.lerp(s.flipped ? 0 : PI, goal, U.smooth(s.flipT));
        body.position.y = Math.sin(s.flipT * PI) * 1.6;
        if (s.flipT >= 1) { body.rotation.x = goal; body.position.y = 0; }
      }
    }
    mech.apply();
    const sig = S.pos.x.toFixed(3) + S.pos.y.toFixed(3) + ax.z.pos.toFixed(1) + L.level.toFixed(3) + ax.tur.pos.toFixed(3) + S.stageSlide + S.exposure.toFixed(3);
    if (sig !== lastSig) { lastSig = sig; S.camRev++; }
    mech.moved = moved;
  };
  const TAU = 2 * PI;
  mech.apply = function () {
    const mv = M.mv, mm = C.MM;
    mv.gY.dyn.z = S.pos.y * mm; mv.gX.dyn.x = S.pos.x * mm;
    mv.gZ.dyn.y = ax.z.pos * C.z.vis;
    mv.gRack.dyn.y = ax.elev.pos; mv.gTray.dyn.x = ax.tray.pos; mv.gLift.dyn.y = ax.lift.pos;
    mv.fA.dyn.z = ax.grip.pos; mv.fB.dyn.z = -ax.grip.pos; mv.clip.dyn.x = ax.clip.pos;
    const k = M.explode;
    for (let i = 0; i < M.movers.length; i++) { const r = M.movers[i]; r.node.position.set(r.base.x + r.dyn.x + r.ex.x * k, r.base.y + r.dyn.y + r.ex.y * k, r.base.z + r.dyn.z + r.ex.z * k); }
    M.xScrew.rotation.x = (-TAU * ax.x.pos * mm) / 0.8;
    M.yScrew.rotation.z = (-TAU * ax.y.pos * mm) / 0.8;
    M.zScrew.rotation.y = (-TAU * ax.z.pos * C.z.vis) / 0.5;
    M.eScrew.rotation.y = (-TAU * ax.elev.pos) / 0.6;
    M.knob.rotation.x = (ax.z.pos / C.z.turn) * TAU;
    M.gTurret.rotation.y = (-ax.tur.pos * TAU) / 3;
    M.gArm.rotation.y = ax.arm.pos;
    const lv = S.lamp.level;
    M.led.material.color.setRGB(0.25 + 1.0 * lv, 0.2 + 0.95 * lv, 0.12 + 0.7 * lv);
  };
  mech.TRAY = TRAY; mech.STAGE = STAGE; mech.SLOT = SLOT;
})();
