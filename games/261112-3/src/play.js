// play.js — 指一本の操作 (運ぶ / かざす / 押す / 袋へ出し入れ / 持ち手 / シャッター)
import * as THREE from 'three';
import { Game, V, clamp, lerp, ease, BASE, LANELEN, QY, QZ, SLOT } from './core.js';
import { L } from './models.js';
import { PEG_X, PEG_Y } from './bagsim.js';

const P = Game.prototype;
const dist = (a, x, y) => Math.hypot(a.x - x, a.y - y);
const NAV = [
  new THREE.Box3(V(-1.65, 0.0, -0.5), V(-0.65, 1.75, 0.6)), new THREE.Box3(V(-0.15, 0.6, -0.35), V(1.1, 1.3, 0.35)),
  new THREE.Box3(V(1.25, 0.6, -0.3), V(2.15, 1.5, 0.3)), new THREE.Box3(V(0.1, 0, L.frontZ - 0.3), V(3.0, 2.7, L.frontZ + 0.1)),
];

P.pickItem = function (x, y, filter) {
  let best = null, bs = 1e9; const a = {}, b = {}, up = V();
  for (const it of this.list) {
    if (it.st.loc === 'sold' || it.mode === 'held' || it.mode === 'carried' || !filter(it)) continue;
    const h = it.obj.userData.h * 0.5 - 0.02; up.set(0, 1, 0).applyQuaternion(it.q);
    this.screen(this.tmp2.copy(it.pos).addScaledVector(up, h), a); this.screen(this.tmp2.copy(it.pos).addScaledVector(up, -h), b);
    const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1, t = clamp(((x - a.x) * dx + (y - a.y) * dy) / l2, 0, 1);
    const d = Math.hypot(x - a.x - dx * t, y - a.y - dy * t), r = Math.max(34, it.obj.userData.r * this.pxPerM(it.pos) * 1.05);
    if (d < r && d + a.z * 20 < bs) { bs = d + a.z * 20; best = it; }
  }
  return best;
};
P.hitBox = function (x, y, c, hx, hy, hz, pad) {
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; const s = {};
  for (let i = 0; i < 8; i++) { this.screen(this.tmp2.set(c.x + (i & 1 ? hx : -hx), c.y + (i & 2 ? hy : -hy), c.z + (i & 4 ? hz : -hz)), s); x0 = Math.min(x0, s.x); x1 = Math.max(x1, s.x); y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y); }
  return x > x0 - pad && x < x1 + pad && y > y0 - pad && y < y1 + pad;
};
P.hitBasket = function (x, y) { return this.hitBox(x, y, this.tmp.copy(this.basketPos).add(V(0, 0.16, 0)), 0.2, 0.17, 0.14, 12); };
// かごの手前の面 (ここは中の品物より「かごをつかむ」を優先)
P.hitBasketFront = function (x, y) { return this.hitBox(x, y, this.tmp.copy(this.basketPos).add(V(0, 0.09, 0.13)), 0.19, 0.085, 0.005, 4); };
P.basketCount = function () { return this.list.filter((i) => i.st.loc === 'basket').length; };
P.unread = function () { return this.list.filter((i) => i.st.loc === 'basket' && !i.st.sc); };
P.trayItems = function () { return this.list.filter((i) => i.st.loc === 'tray'); };
P.bagItems = function () { return this.list.filter((i) => i.st.loc === 'bag'); };
P.bagPoint = function (x, y) { const p = this.onPlaneZ(x, y, L.rack.z + this.bagZ, V()); p.x -= L.rack.x; p.y -= L.counterY; return p; };

// ---------- pointer ----------
P.onDown = function (x, y) {
  this.sound.start(); this.idle = 0; this.hideHint(); this.hintDone = false; this.inputs = (this.inputs || 0) + 1;
  if (this.drag) return;
  this.lx = this.downX = x; this.ly = this.downY = y; this.moved = 0;
  const n = this.station; let d = null;
  if (this.fade > 0.2 || this.cam.via.length) d = { kind: 'none' };
  else if (n === 0) d = this.downShelf(x, y); else if (n === 1) d = this.downReg(x, y); else if (n === 2) d = this.downBag(x, y); else d = this.downShutter(x, y);
  this.drag = d || { kind: n === 4 ? 'none' : 'pan' };
  this.onMove(x, y);
};
P.onMove = function (x, y) {
  const d = this.drag; if (!d) return;
  this.moved += Math.hypot(x - this.lx, y - this.ly); this.lx = x; this.ly = y; this.idle = 0;
  if (d.kind === 'item') { this.onPlaneZ(x, y, d.z, d.goal); d.goal.y += 0.05; d.goal.y = Math.max(d.goal.y, 0.3); }
  else if (d.kind === 'basket') {
    const has = this.basketCount() > 0;
    this.carryT = clamp(d.t0 + (x - this.downX) / (this.vw * 0.62), 0, has ? 1 : 0.2);
  } else if (d.kind === 'stack') { d.u = clamp(d.u0 + (y - this.downY) / (this.vh * 0.2), 0, 1); }
  else if (d.kind === 'scan') { this.onPlaneZ(x, y, 0.17, d.goal); d.goal.y = Math.max(d.goal.y + 0.05, L.counterY + 0.1); d.goal.x = clamp(d.goal.x, -0.3, 1.25); }
  else if (d.kind === 'body') { const p = this.bagPoint(x, y); d.b.tx = clamp(p.x, -0.75, 0.7); d.b.ty = clamp(p.y + 0.04, 0.03, 0.98); }
  else if (d.kind === 'handle') {
    const p = this.bagPoint(x, y), sim = this.sim, pin = d.side ? sim.pinR : sim.pinL;
    if (d.mode === 'side' && p.y > PEG_Y + 0.085 && this.moved > 12) { d.mode = 'lift'; this.bagWhere = 'held'; this.sound.swish(); }
    if (d.mode === 'side') { pin.tx = clamp(p.x, d.side ? 0.05 : -0.27, d.side ? 0.27 : -0.05); pin.ty = clamp(p.y, PEG_Y - 0.012, PEG_Y + 0.06); }
    else { const fx = clamp(p.x, -0.3, 0.42), fy = clamp(p.y + 0.02, PEG_Y - 0.12, 0.86); sim.pinL.tx = fx - 0.013; sim.pinR.tx = fx + 0.013; sim.pinL.ty = sim.pinR.ty = fy; this.liftX = fx; this.liftY = fy; }
    this.simAwake = 2;
  } else if (d.kind === 'shutter') {
    const py = this.onPlaneZ(x, y, L.frontZ - 0.12, this.tmp2).y, H = L.openH - 0.06;
    const v = 1 - clamp(py - d.off, 0, H) / H; d.sp = Math.abs(v - this.S.shutter); d.acc = (d.acc || 0) + d.sp;
    if ((v >= 1 && this.S.shutter < 1) || (v <= 0 && this.S.shutter > 0)) this.sound.clank(0.8);
    this.setShutter(v);
  } else if (d.kind === 'pan') { this.cam.pan = clamp(-(x - this.downX) / this.pxPerM(this.cam.tgt), -0.7, 0.7); }
};
P.onUp = function (x, y, cancel) {
  const d = this.drag; if (!d) return; this.drag = null; this.idle = 0;
  const S = this.S;
  if (d.kind === 'item') this.dropShelfItem(d);
  else if (d.kind === 'basket') {
    const has = this.basketCount() > 0, to = d.t0 < 0.5 ? (has && this.carryT > 0.33 ? 1 : 0) : (this.carryT < 0.67 ? 0 : 1);
    this.finishCarry(to);
  } else if (d.kind === 'stack') {
    const to = this.moved < 10 && !cancel ? (d.u0 < 0.5 ? 1 : 0) : d.u > 0.4 ? 1 : 0; this.finishStack(d, to);
  } else if (d.kind === 'scan') { this.scanHeld = false; const a = this.scanPos.clone(); this.tween(0.3, (k) => { this.scanPos.lerpVectors(a, this.scanHome, k); this.scanAim = 1 - k; }, () => this.sound.tap(0.5)); }
  else if (d.kind === 'body') this.releaseBody(d.it);
  else if (d.kind === 'handle') {
    const sim = this.sim;
    if (d.mode === 'side') {
      const pin = d.side ? sim.pinR : sim.pinL, opts = d.side ? [2, 3] : [0, 1];
      const k = Math.abs(pin.tx - PEG_X[opts[0]]) < Math.abs(pin.tx - PEG_X[opts[1]]) ? opts[0] : opts[1];
      S.pegs[d.side] = k; pin.tx = PEG_X[k]; pin.ty = PEG_Y; this.sound.hook(); this.simAwake = 2;
    } else if (!cancel && this.customerReady() && this.liftX > 0.17 && this.bagItems().length > 0) this.handOver();
    else this.hangBag();
  } else if (d.kind === 'shutter') {
    this.sound.setShutter(0);
    if (this.station === 3 && S.shutter > 0.955) { this.setShutter(1); this.sound.clank(1); this.closeShop(); }
    else if (this.station === 4 && S.shutter < 0.2) this.reopen();
  } else if (d.kind === 'pan') {
    const dx = x - this.downX, order = S.phase === 'close' ? [0, 1, 2, 3] : [0, 1, 2], i = order.indexOf(this.station);
    if (!cancel && Math.abs(dx) > this.vw * 0.18) { const j = i + (dx < 0 ? 1 : -1); if (order[j] !== undefined) this.goStation(order[j]); }
    else if (!cancel && this.moved < 10) {
      const r = this.setRay(x, y); let best = -1, bd = 1e9;
      NAV.forEach((b, k) => { if (k === this.station || (k === 3 && S.phase !== 'close')) return; const h = r.intersectBox(b, this.tmp2); if (h) { const dd = h.distanceTo(r.origin); if (dd < bd) { bd = dd; best = k; } } });
      if (best >= 0) this.goStation(best);
    }
    const p0 = this.cam.pan; this.tween(0.25, (k) => { if (!this.drag) this.cam.pan = p0 * (1 - k); });
  }
  this.save();
};
P.cancelDrag = function () { if (this.drag) this.onUp(this.lx, this.ly, true); };

P.updateDrag = function (dt) {
  const d = this.drag;
  if (d && (d.kind === 'handle' || d.kind === 'body') && Math.abs(this.cam.lift - (this.bagWhere === 'held' ? 1 : 0)) > 0.01) this.onMove(this.lx, this.ly); // カメラが動いても指の下に保つ
  // かごの位置
  const st = L.stand, rg = L.regBasket, k = ease(this.carryT);
  if (this.S.basket !== 'stack' && !this.stacking) { this.basketPos.lerpVectors(st, rg, k); this.basketPos.y += Math.sin(Math.PI * this.carryT) * 0.2; }
  this.handleK = lerp(this.handleK || 0, (d && (d.kind === 'basket' || d.kind === 'stack')) || this.carrying ? 1 : 0, Math.min(1, dt * 12));
  this.basket.userData.setHandle(this.handleK);
  if (d && d.kind === 'stack') { this.basketPos.lerpVectors(L.stand, this.stackTop(), d.u); }
  if (d && d.kind === 'item') {
    const it = d.it, pv = it.pos.x;
    it.pos.lerp(d.goal, 1 - Math.exp(-dt * 38));
    it.sway = lerp(it.sway, clamp((it.pos.x - pv) / Math.max(dt, 1e-3) * 0.22, -0.4, 0.4), Math.min(1, dt * 10));
    it.q.copy(QZ(-it.sway - (it.type === 'bread' ? 0.1 : 0)));
    const tg = this.nearestTarget(it); d.target = tg; it.supY = tg.sy;
  }
  // スキャナー
  const sc = this.scanner; let aim = null, ad = 1e9;
  if (d && d.kind === 'scan') {
    this.scanHeld = true; this.scanPos.lerp(d.goal, 1 - Math.exp(-dt * 34)); d.s0 = this.screen(this.scanPos, d.s0 || {}); d.s1 = d.s1 || {}; d.ppm = this.pxPerM(this.scanPos);
    for (const it of this.list) {
      if (!(it.st.loc === 'basket' && this.S.basket === 'reg') && !(it.st.loc === 'tray' && this.trayAt === 'reg')) continue;
      if (it.mode === 'carried' || it.mode === 'tween') continue;
      this.screen(it.pos, d.s1); const dd = Math.hypot(d.s1.x - d.s0.x, d.s1.y - d.s0.y) / d.ppm + (it.st.sc ? 0.05 : 0);
      if (dd < ad) { ad = dd; aim = it; }
    }
    this.scanAim = lerp(this.scanAim || 0, aim && ad < 0.36 ? 1 : 0.35, Math.min(1, dt * 10));
    if (aim && ad < 0.36) { this.tmp.copy(aim.pos).sub(this.scanPos); d.yaw = Math.atan2(this.tmp.x, this.tmp.z); d.pitch = -Math.asin(clamp(this.tmp.y / this.tmp.length(), -1, 1)); } else { d.yaw = Math.PI; d.pitch = 0.5; }
    if (aim && ad < (aim.st.sc ? 0.12 : 0.13) && this.scanCool <= 0) {
      if (!aim.st.sc) this.readItem(aim);
      else if ((aim.confirmT || 0) < this.time) { aim.confirmT = this.time + 1.4; this.flashAt(aim, 0.45); this.scanCool = 0.2; }
    }
    sc.rotation.y = d.yaw; sc.rotation.x = lerp(0.5, d.pitch, this.scanAim);
  } else if (!this.scanHeld) { const a = this.scanAim || 0; sc.rotation.y = lerp(Math.PI * 0.93, sc.rotation.y, a * 0.9); sc.rotation.x = lerp(0.95, sc.rotation.x, a * 0.9); }
  if (d && d.kind === 'shutter') { this.sound.setShutter(clamp((d.acc || 0) / Math.max(dt, 0.008) * 0.55, 0, 1)); if ((d.acc || 0) > 0.012 && this.time - (d.ct || 0) > 0.11) { d.ct = this.time; this.sound._burst(1400 + Math.random() * 500, 5, 0.03, 0.12); } d.acc = 0; }
};

// ---------- 場面1: 棚 ----------
P.downShelf = function (x, y) {
  const S = this.S;
  const front = S.basket !== 'reg' && !this.carrying && S.intro && this.hitBasketFront(x, y);
  const it = front ? null : this.pickItem(x, y, (i) => ['crate', 'shelf', 'lane', 'bin'].includes(i.st.loc) || (i.st.loc === 'basket' && S.basket === 'stand' && !this.carrying));
  if (it) {
    if (!S.intro && it.type !== 'milk') { it.wig = 1; this.sound.tap(); return { kind: 'none' }; }
    if (it.st.loc === 'lane') { const l = this.lanes[it.st.slot], i = l.indexOf(it); if (i >= 0) l.splice(i, 1); this.syncLaneOrd(); }
    it.mode = 'held'; it.tw = null; this.sound.tap(0.4);
    return { kind: 'item', it, z: 0.2, goal: it.pos.clone(), org: { loc: it.st.loc, slot: it.st.slot } };
  }
  if (S.basket !== 'reg' && !this.carrying && this.hitBasket(x, y)) {
    if (!S.intro) { this.wobbleBasket(); return { kind: 'none' }; }
    if (S.phase === 'close') return { kind: 'stack', u0: S.basket === 'stack' ? 1 : 0, u: S.basket === 'stack' ? 1 : 0 };
    return { kind: 'basket', t0: 0 };
  }
  return null;
};
P.wobbleBasket = function () { this.sound.tap(); const b = this.basket; this.tween(0.35, (k) => { b.rotation.z = Math.sin(k * 18) * 0.04 * (1 - k); }); };
P.nearestTarget = function (it) {
  const S = this.S, t = it.type, c = [], s = {}, me = this.screen(it.pos, {});
  const add = (loc, slot, x, y, z, sy) => { this.screen(this.tmp2.set(x, y, z), s); c.push({ loc, slot, d: Math.hypot(s.x - me.x, s.y - me.y), sy }); };
  if (t === 'milk') for (let k = 0; k < 3; k++) { if (this.list.some((o) => o !== it && o.st.loc === 'shelf' && o.st.slot === k)) continue; add('shelf', k, L.milkX[k], L.shelfTopY + BASE.milk, L.milkZ, L.shelfTopY); }
  if (t === 'apple' || t === 'berry') for (let l = 0; l < 3; l++) { if (this.laneUsed(l, it) + LANELEN[t] > L.laneLen + 1e-6) continue; add('lane', l, L.laneX[l], 0.9, -0.09, 0.84); }
  if (t === 'bread') add('bin', 0, L.bin.x, L.bin.y + 0.2, L.bin.z, L.bin.y);
  if (t !== 'bread') { const q = SLOT.crate[it.id]; add('crate', 0, L.crate.x + q[0], L.crate.y + q[1] + BASE[t], L.crate.z + q[2], L.crate.y + q[1]); }
  if (S.basket === 'stand' && S.phase === 'open' && S.intro && !this.carrying) { const q = SLOT.basket[it.id]; add('basket', 0, this.basketPos.x + q[0] * 0.5, this.basketPos.y + 0.12, this.basketPos.z + q[2] * 0.5, this.basketPos.y); }
  c.sort((a, b) => a.d - b.d);
  return c[0] || { loc: 'crate', slot: 0, sy: L.crate.y };
};
P.dropShelfItem = function (d) {
  const it = d.it, S = this.S, tg = this.moved < 6 ? { loc: d.org.loc, slot: d.org.slot } : this.nearestTarget(it);
  it.st.loc = tg.loc; it.st.slot = tg.slot; it.st.tidy = 1;
  if (tg.loc === 'lane') { const l = this.lanes[tg.slot]; it.lanePos = Math.max(this.laneUsed(tg.slot, it), L.laneLen - LANELEN[it.type]); it.laneVel = 0; if (!l.includes(it)) l.push(it); this.syncLaneOrd(); }
  if (tg.loc === 'shelf' && !S.intro) { S.intro = 1; }
  this.tweenTo(it, 0.24, 0.025, () => { this.sound.koton(it.type); this.save(); });
};
P.finishCarry = function (to) {
  const S = this.S, a = this.carryT; this.carrying = true;
  this.tween(Math.max(0.15, Math.abs(to - a) * 0.6), (k) => { this.carryT = lerp(a, to, k); }, () => {
    this.carrying = false; const was = S.basket; S.basket = to ? 'reg' : 'stand';
    if (was !== S.basket || Math.abs(to - a) > 0.15) this.sound.koton('basket', 0.8);
    if (to) { this.goStation(1); this.customerCome(); } else this.goStation(0);
    this.save();
  });
};
P.stackTop = function () { return this.tmp.copy(L.stack).add(V(0, 0.1, 0)); };
P.finishStack = function (d, to) {
  const S = this.S, a = this.basketPos.clone(), b = to ? this.stackTop().clone() : L.stand.clone(); this.stacking = true;
  this.tween(0.3, (k) => { this.basketPos.lerpVectors(a, b, k); }, () => {
    this.stacking = false; const was = S.basket; S.basket = to ? 'stack' : 'stand'; this.carryT = 0;
    if (was !== S.basket) { to ? this.sound.clack() : this.sound.koton('basket', 0.7); }
    if (to && was !== 'stack') this.after(1.0, () => { if (this.S.basket === 'stack' && this.station === 0 && !this.drag) this.goStation(3); });
    this.save();
  });
};

// ---------- 場面2: レジ ----------
P.downReg = function (x, y) {
  const S = this.S, s = {};
  this.screen(this.scanPos, s);
  if (dist(s, x, y) < Math.max(54, 0.1 * this.pxPerM(this.scanPos)) && !this.scanHeld) return { kind: 'scan', goal: this.scanPos.clone(), yaw: Math.PI, pitch: 0.5 };
  this.screen(this.tmp2.copy(L.button).add(V(0, 0.05, 0)), s);
  if (dist(s, x, y) < Math.max(46, 0.075 * this.pxPerM(L.button))) { this.pressButton(); return { kind: 'none' }; }
  const canBack = !S.paid && S.basket === 'reg' && !this.carrying && !this.assistBusy();
  if (canBack && this.hitBasketFront(x, y)) return { kind: 'basket', t0: 1 };
  const it = this.pickItem(x, y, (i) => (i.st.loc === 'basket' && S.basket === 'reg') || (i.st.loc === 'tray' && this.trayAt === 'reg'));
  if (it) { it.wig = 1; this.sound.tap(); return { kind: 'none' }; }
  if (canBack && this.hitBasket(x, y)) return { kind: 'basket', t0: 1 };
  return null;
};
P.flashAt = function (it, k) {
  const c = it.obj.localToWorld(it.obj.userData.code.clone()); this.tmp.copy(this.camera.position).sub(c).normalize();
  this.glow.position.copy(c).addScaledVector(this.tmp, 0.01); this.glow.quaternion.copy(this.camera.quaternion); this.glow.visible = true; this.glow.material.color.setHex(k < 1 ? 0xffb090 : 0xff3020);
  this.beamT = 0.28 * k; this.lastFlash = { id: it.id, strong: k >= 1, t: this.time };
};
P.readItem = function (it) {
  it.st.sc = 1; this.scanCool = 0.42; this.readCount = (this.readCount || 0) + 1;
  this.flashAt(it, 1); this.sound.beep();
  this.assistMove(it); this.save();
};
P.pressButton = function () {
  const S = this.S; this.btnDown = 0.2; this.sound.click(); this.presses = (this.presses || 0) + 1;
  const un = this.unread(), tray = this.trayItems();
  if (!S.paid) {
    if (un.length) { for (const it of un) { it.nudge = 1; it.wig = 0.6; } this.sound.tap(0.8); }
    else if (tray.length && !this.assistBusy() && S.basket === 'reg') this.pay();
  } else if (S.phase === 'open' && this.trayAt === 'reg' && !this.paying) { this.paying = true; this.after(0.35, () => { this.paying = false; if (this.station === 1) this.goStation(2); }); }
};
P.pay = function () {
  const S = this.S; S.paid = 1; this.payCount = (this.payCount || 0) + 1; this.paying = true;
  for (const it of this.trayItems()) it.st.paid = 1;
  this.sound.bell(); this.customerNod(); this.save(true);
  this.after(0.7, () => { this.paying = false; this.goStation(2); this.customerTo('bag'); });
};

// ---------- 場面3: 袋 ----------
P.downBag = function (x, y) {
  const sim = this.sim, s = {};
  if (this.bagWhere === 'cust') { if (this.hitBox(x, y, this.tmp.set(L.rack.x + sim.center().x, L.counterY + sim.center().y - 0.14, L.rack.z + this.bagZ), 0.2, 0.3, 0.08, 16)) { this.returnBag(); return { kind: 'none' }; } return null; }
  if (this.bagWhere !== 'rack') return null;
  const p = this.bagPoint(x, y), ppm = this.pxPerM(L.rack);
  let hs = -1, hd = 1e9;
  for (const side of [0, 1]) {
    const h = side ? sim.hR : sim.hL;
    for (const k of [h[2], h[0], h[1]]) { this.screen(this.tmp2.set(L.rack.x + sim.px[k], L.counterY + sim.py[k], L.rack.z), s); const d = dist(s, x, y); if (d < hd) { hd = d; hs = side; } }
  }
  const b = sim.bodyAt(p.x, p.y, Math.max(0.012, 26 / ppm));
  if (hd < Math.max(38, 0.05 * ppm) && (!b || hd < 24 || sim.sdfWorld(b, p.x, p.y) > 0.004)) return { kind: 'handle', side: hs, mode: 'side' };
  if (b) {
    const it = this.items[b.id];
    if (sim.allInside(b) && !this.reachable(b)) { b.va += (Math.random() - 0.5) * 6; b.vy += 0.25; it.wig = 0.5; this.simAwake = 1; this.sound.tap(0.6); this.blockedT = this.time; this.blockedCount = (this.blockedCount || 0) + 1; return { kind: 'none' }; }
    it.auto = false; sim.grab(b, p.x, p.y); it.mode = 'body'; this.simAwake = 2; this.sound.tap(0.4);
    return { kind: 'body', it, b };
  }
  const it = this.pickItem(x, y, (i) => i.st.loc === 'tray' && this.trayAt === 'bag' && i.mode === 'rest');
  if (it) {
    const a = it.type === 'bread' ? Math.PI / 2 : 0, bx = it.pos.x - L.rack.x, by = it.pos.y - L.counterY;
    const body = this.addBody(it, bx, by, a); it.zOff = it.pos.z - (L.rack.z + this.bagZ); it.mode = 'body';
    sim.grab(body, clamp(p.x, bx - 0.15, bx + 0.15), clamp(p.y, by - 0.09, by + 0.09)); this.sound.tap(0.4);
    return { kind: 'body', it, b: body };
  }
  return null;
};
P.overMouth = function (b) {
  const sim = this.sim, lx = sim.px[sim.cornerL], rx = sim.px[sim.cornerR], my = Math.min(sim.py[sim.cornerL], sim.py[sim.cornerR]);
  return b.x > lx - 0.03 && b.x < rx + 0.03 && b.y > my - 0.02;
};
P.reachable = function (b) {
  const sim = this.sim; if (!sim.allInside(b)) return true;
  const lx = sim.px[sim.cornerL], ly = sim.py[sim.cornerL], rx = sim.px[sim.cornerR], ry = sim.py[sim.cornerR];
  for (let k = 0; k <= 8; k++) {
    const t = 0.05 + (0.9 * k) / 8, mx = lerp(lx, rx, t), my = lerp(ly, ry, t); let clear = true;
    for (let s = 1; s <= 12 && clear; s++) {
      const u = s / 13, x = lerp(mx, b.x, u), y = lerp(my, b.y, u);
      if (sim.sdfWorld(b, x, y) < 0) break;
      for (const o of sim.bodies) if (o !== b && sim.sdfWorld(o, x, y) < 0.004) { clear = false; break; }
    }
    if (clear) return true;
  }
  return false;
};
P.releaseBody = function (it) {
  const b = it.body; if (!b) return; this.sim.release(b); this.simAwake = 2;
  const sim = this.sim;
  if (sim.anyInside(b) || this.overMouth(b)) { it.st.loc = 'bag'; return; }
  const lx = sim.px[sim.cornerL], rx = sim.px[sim.cornerR], my = Math.min(sim.py[sim.cornerL], sim.py[sim.cornerR]);
  if (this.bagWhere === 'rack' && b.x > lx - 0.05 && b.x < rx + 0.05 && b.y < my + 0.05) {
    // 袋の手前で離した: いちばん近い支え = 袋。口の上へ持ち上げてから落とす
    sim.grab(b, b.x, b.y); b.tx = clamp(b.x, lx + 0.05, rx - 0.05); b.ty = my + b.shape.bound * 0.55 + 0.09; it.auto = true; this.autoCount = (this.autoCount || 0) + 1;
    this.after(0.38, () => { if (it.auto && it.body === b && !(this.drag && this.drag.it === it)) { it.auto = false; sim.release(b); it.st.loc = 'bag'; this.simAwake = 2; this.save(); } });
    return;
  }
  this.parkToTray(it);
};
P.parkToTray = function (it) {
  this.bodyPose(it, it.pos, it.q); this.dropBody(it); it.st.loc = 'tray'; it.zOff = 0;
  if (this.trayAt !== 'bag') { this.trayAt = 'bag'; this.trayPos.copy(L.trayBag); }
  this.tweenTo(it, 0.3, 0.05, () => { this.sound.koton(it.type, 0.8); this.save(); });
};
P.afterBagStep = function () {
  if (this.bagWhere !== 'rack') { // 運搬中にこぼれた品は袋の中へ戻す (失敗なし)
    const sim = this.sim, c = sim.center(), by = sim.bottomY();
    for (const it of this.list) { const b = it.body; if (!b || b.held || it.st.loc !== 'bag' || sim.anyInside(b)) continue; if (b.y < by - 0.12 || Math.hypot(b.x - c.x, b.y - c.y) > 0.6) { b.x = b.px = c.x; b.y = b.py = Math.max(by + 0.08, c.y - 0.22); b.vx = b.vy = b.va = 0; sim.initFlags(b); for (let k = 0; k < b.inside.length; k++) b.inside[k] = 1; this.spills = (this.spills || 0) + 1; } }
    return;
  }
  for (const it of this.list) {
    const b = it.body; if (!b || b.held || it.auto || it.mode !== 'body') continue;
    if (this.sim.anyInside(b)) { if (it.st.loc !== 'bag') { it.st.loc = 'bag'; this.save(); } }
    else if (!this.overMouth(b)) this.parkToTray(it);
  }
};
P.hangBag = function () {
  const sim = this.sim, S = this.S; S.pegs = [1, 2];
  sim.pinL.tx = PEG_X[1]; sim.pinR.tx = PEG_X[2]; sim.pinL.ty = sim.pinR.ty = PEG_Y; this.bagWhere = 'moving'; this.simAwake = 3;
  this.after(0.4, () => { if (this.bagWhere === 'moving') { this.bagWhere = 'rack'; this.sound.hook(); } });
};

// ---------- 場面4: シャッター ----------
P.downShutter = function (x, y) {
  const S = this.S, s0 = {}, s1 = {}, sb = {}, z = L.frontZ - 0.12, yb = (1 - S.shutter) * (L.openH - 0.06);
  if (S.phase !== 'close') return null;
  this.screen(this.tmp2.set(L.openX0, yb + 0.05, z), s0); this.screen(this.tmp2.set(L.openX1, yb + 0.05, z), s1); this.screen(this.tmp2.set(1.55, L.openH, z), sb);
  const xa = Math.min(s0.x, s1.x) - 16, xb = Math.max(s0.x, s1.x) + 16;
  if (x < xa || x > xb || y > s0.y + 70 || y < Math.min(sb.y, s0.y - 70)) return null;
  if (this.station === 4 && !S.carded) { this.sound.clank(0.4); return { kind: 'none' }; }
  return { kind: 'shutter', off: this.onPlaneZ(x, y, z, this.tmp2).y - yb };
};
