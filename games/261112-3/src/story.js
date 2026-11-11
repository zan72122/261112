// story.js — 客・店長・補助店員の手・お手本の手・一日の進行
import * as THREE from 'three';
import * as T from './tex.js';
import { Game, V, clamp, lerp, ease, BASE, SLOT, defaultState } from './core.js';
import { L } from './models.js';
import { PEG_X, PEG_Y } from './bagsim.js';
import { makePerson, makeSleeveArm } from './people.js';

const P = Game.prototype;
const std = (o) => new THREE.MeshStandardMaterial(o);

P.buildActors = function () {
  const M = this.M, sc = this.scene;
  const skin = std({ color: 0xe6b596, roughness: 0.6 }), skin2 = std({ color: 0xd9a583, roughness: 0.6 });
  const white = std({ color: 0xf3f1ea, roughness: 0.85, bumpMap: M.fab, bumpScale: 0.5 }), blue = std({ color: 0x7fa6c9, roughness: 0.85, bumpMap: M.fab, bumpScale: 0.5 });
  const green = std({ color: 0x3f7f5d, roughness: 0.8, bumpMap: M.fab, bumpScale: 0.6 });
  this.hintArm = makeSleeveArm(skin, white, white, 0.75, true); this.hintArm.visible = false; sc.add(this.hintArm); this.hint = null;
  this.assistArm = makeSleeveArm(skin2, blue, blue, 0.8, true); this.assistArm.visible = false; sc.add(this.assistArm); this.assist = { q: [], cur: null, home: V(1.75, 1.55, 0.5) };
  const mkActor = (o, x, z) => { const Pn = makePerson(o); Pn.group.visible = false; sc.add(Pn.group); return { P: Pn, x, z, rot: 0, path: [], state: 'away', seq: 0, speed: 1.25 }; };
  this.cust = mkActor({ height: 1.64, skin, top: std({ color: 0xc9a35e, roughness: 0.9, bumpMap: M.fab, bumpScale: 0.8 }), bottom: std({ color: 0x4a6384, roughness: 0.85, bumpMap: M.fab, bumpScale: 0.6 }), hair: std({ color: 0x3a2a20, roughness: 0.55 }), bob: true, hairLen: 0.6, shoe: 0xe9e6df }, 3.4, -5.4);
  this.mgr = mkActor({ height: 1.72, skin: skin2, top: white, bottom: std({ color: 0x2f3338, roughness: 0.85 }), hair: std({ color: 0x1f1b19, roughness: 0.5 }), apron: green, hairLen: 0.5 }, 4.8, -4.8);
  // はなまるカード
  this.cardCv = T.canvas(256, 176); T.drawCard(this.cardCv, 0);
  this.cardTex = T.tex(this.cardCv);
  this.card = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.0015), [0, 0, 0, 0, 1, 0].map((f) => std({ color: f ? 0xffffff : 0xf4f1e8, map: f ? this.cardTex : null, roughness: 0.6 })));
  this.card.visible = false; this.card.castShadow = true; sc.add(this.card);
  this.stamp = new THREE.Group(); const sw = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.06, 12), M.wood); sw.position.y = 0.04; const sr = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.014, 14), std({ color: 0xc9302a, roughness: 0.6 })); sr.position.y = 0.007; this.stamp.add(sw, sr); this.stamp.visible = false; sc.add(this.stamp);
  this.playerArm = makeSleeveArm(skin, white, white, 0.6, true); this.playerArm.visible = false; this.camera.add(this.playerArm);
  this.cardHome = new THREE.Group(); this.camera.add(this.cardHome);
};
P.restoreActors = function () {
  const S = this.S, c = this.cust, m = this.mgr;
  for (const it of this.list) if (it.st.loc === 'basket' && it.st.sc) it.st.loc = 'tray';
  c.seq++; m.seq++; c.path = []; m.path = []; c.P.armT = [null, null]; c.P.bow = 0;
  if (S.phase === 'open' && (S.basket === 'reg' || S.paid)) { const p = S.paid ? L.custBag : L.custReg; c.x = p.x; c.z = p.z; c.rot = 0; c.state = S.paid ? 'atBag' : 'atReg'; c.P.group.visible = true; }
  else { c.state = 'away'; c.P.group.visible = false; }
  m.state = 'away'; m.P.group.visible = false; this.card.visible = false; this.stamp.visible = false; this.playerArm.visible = false;
  if (this.station === 4) { if (S.carded) this.showCardHeld(true); else this.managerCome(); }
};
function walkTo(a, pts, done, keepRot) { a.path = pts.map((p) => ({ x: p[0], z: p[1] })); a.done = done; a.keepRot = keepRot; }
function local(Pn, x, y, z) { return Pn.body.localToWorld(V(x, y, z)); }
P.reach = function (Pn, i, t) { const sh = Pn.arms[i].sh.clone().applyMatrix4(Pn.body.matrixWorld); return sh.distanceTo(t) < 0.5 * Pn.k; };
P.grip = function (Pn, i, out) { const h = Pn.arms[i].hand; h.updateWorldMatrix(true, false); return out.set(0, 0.072, -0.03).applyMatrix4(h.matrixWorld); };

// ---------- 客 ----------
P.customerCome = function () {
  const c = this.cust; if (c.state !== 'away') return;
  c.state = 'walk'; c.x = 3.3; c.z = -5.3; c.P.group.visible = true; this.sound.pop();
  walkTo(c, [[1.9, -3.9], [1.1, -2.2], [L.custReg.x, L.custReg.z]], () => { c.state = this.S.paid ? 'atReg' : 'atReg'; c.faceTo = 0; if (this.S.paid) this.customerTo('bag'); });
};
P.customerTo = function (where) {
  const c = this.cust; if (c.state === 'away') { this.customerCome(); return; }
  if (c.state !== 'atReg' && c.state !== 'atBag') return;
  const p = where === 'bag' ? L.custBag : L.custReg; if (Math.hypot(c.x - p.x, c.z - p.z) < 0.05) { c.state = where === 'bag' ? 'atBag' : 'atReg'; return; }
  c.state = 'walk'; walkTo(c, [[p.x, p.z]], () => { c.state = where === 'bag' ? 'atBag' : 'atReg'; c.faceTo = 0; });
};
P.customerNod = function () { const c = this.cust.P; this.tween(0.6, (k) => { c.headPitch = Math.sin(k * Math.PI) * 0.4; }); };
P.customerReady = function () { return this.S.paid && this.S.phase === 'open' && this.cust.state === 'atBag'; };
P.handOver = function () {
  const c = this.cust, S = this.S, sim = this.sim; ++c.seq; S.handed = 1; this.bagWhere = 'cust'; c.state = 'holding'; this.handCount = (this.handCount || 0) + 1;
  const info = sim.contents(), ctr = sim.center();
  c.off = clamp(info.x - ctr.x, -0.1, 0.1); c.heavy = info.mass > 1.25; c.mass = info.mass;
  // 袋は指を離した場所にとどまり、客の手のほうが迎えに来る
  c.pin = V(L.rack.x + this.liftX, L.counterY + this.liftY, L.rack.z); c.ht = c.pin.clone(); c.attached = false; c.attT = 0; c.offv = V();
  c.gap = 0.026; c.dyL = 0; c.dyR = 0; c.local = null; c.support = false; sim.pinSpeed = 1.3;
  walkTo(c, [[clamp(c.pin.x + 0.25, 2.3, 2.6), -0.5]], null, true);
  this.save();
};
P.holdSequence = function () {
  const c = this.cust, sim = this.sim, id = c.seq, ok = () => c.seq === id;
  c.P.arms[0].hand.userData.pose(0.95, 0.8); this.sound.hook();
  const y0 = c.ht.y, x0 = c.ht.x, dip = 0.02 + 0.03 * Math.min(1, c.mass / 2), off = c.off;
  this.tween(0.3, (k) => { if (ok()) c.ht.y = y0 - dip * k; }, () => {
    if (!ok()) return; // 重い側を持ち直す
    this.tween(0.5, (k) => { if (!ok()) return; c.ht.y = y0 - dip * (1 - k); c.gap = lerp(0.026, 0.014, k); c.dyL = Math.max(0, -off) * 0.45 * k; c.dyR = Math.max(0, off) * 0.45 * k; c.ht.x = x0 + off * 0.4 * k; }, () => { if (ok() && c.heavy) { c.supDrop = (sim.pinL.y + sim.pinR.y) / 2 - sim.bottomY(); c.support = true; } });
  });
  this.after(1.1, () => { if (!ok()) return; const a = c.P.group.worldToLocal(c.ht.clone()), b = V(-0.15, Math.max(1.43, a.y), 0.33); c.local = a.clone(); this.tween(0.9, (k) => { if (ok()) c.local.lerpVectors(a, b, k); }); });
  this.after(2.1, () => { if (!ok()) return; sim.groundY = -2; walkTo(c, [[c.x + 0.02, c.z - 0.26]], null, true); const y1 = c.local.y; this.tween(0.9, (k) => { if (ok() && c.local) c.local.y = lerp(y1, 1.3, k); }); });
  this.after(2.9, () => { if (!ok()) return; this.tween(1.5, (k) => { if (ok()) { c.P.bow = Math.sin(k * Math.PI) * 0.36; c.P.headPitch = Math.sin(k * Math.PI) * 0.2; } }); });
  this.after(7.8, () => { if (!ok()) return; c.state = 'leaving'; c.support = false; walkTo(c, [[1.75, -2.4], [1.95, -4.3], [4.6, -5.2]], () => { if (ok()) this.finalizeSale(); }); });
};
P.returnBag = function () {
  const c = this.cust, sim = this.sim; if (c.state !== 'holding') return; const id = ++c.seq, ok = () => c.seq === id; c.state = 'returning'; c.support = false; this.returnCount = (this.returnCount || 0) + 1;
  this.sound.tap(0.6); c.P.bow = 0; c.P.headPitch = 0;
  if (!c.attached) { c.attached = true; c.offv.set(0, 0, 0); }
  if (!c.local) c.local = c.P.group.worldToLocal(c.ht.clone());
  const a0 = c.local.clone(), b0 = V(-0.14, 1.47, 0.36);
  this.tween(0.5, (k) => { if (ok()) c.local.lerpVectors(a0, b0, k); }, () => {
    if (!ok()) return;
    walkTo(c, [[2.12, -0.5]], () => {
      if (!ok()) return; sim.groundY = 0; const a = c.P.group.localToWorld(c.local.clone()), b = V(L.rack.x + 0.02, L.counterY + PEG_Y + 0.035, L.rack.z + 0.01); c.local = null; c.ht.copy(a);
      this.tween(0.7, (k) => { if (ok()) { c.ht.lerpVectors(a, b, k); c.P.bow = 0.38 * k; } }, () => {
        if (!ok()) return; this.S.handed = 0; c.P.armT[0] = null; c.P.armT[1] = null; c.P.arms[0].hand.userData.pose(0.25); sim.support = null;
        this.hangBag(); const z0 = this.bagZ; this.tween(0.35, (k) => { this.bagZ = z0 * (1 - k); c.P.bow = 0.38 * (1 - k); }, () => { sim.pinSpeed = 3.5; });
        walkTo(c, [[L.custBag.x, L.custBag.z]], () => { c.state = 'atBag'; c.faceTo = 0; }, true); this.save();
      });
    }, true);
  });
};
P.finalizeSale = function () {
  const S = this.S, sim = this.sim, c = this.cust; c.seq++;
  for (const it of this.list) if (it.st.loc === 'bag') { this.dropBody(it); it.st.loc = 'sold'; it.mode = 'rest'; }
  for (const it of this.list) if (it.st.loc === 'shelf') it.st.tidy = 0;
  sim.groundY = 0; sim.support = null; sim.pinSpeed = 3.5; sim.pinL.x = sim.pinL.tx = PEG_X[1]; sim.pinR.x = sim.pinR.tx = PEG_X[2]; sim.pinL.y = sim.pinL.ty = sim.pinR.y = sim.pinR.ty = PEG_Y; sim.resetShape();
  this.bagZ = 0; this.bagWhere = 'rack'; this.simAwake = 2;
  S.handed = 0; S.phase = 'close'; S.pegs = [1, 2]; S.basket = 'stand';
  c.state = 'away'; c.P.group.visible = false; c.P.armT = [null, null]; c.P.arms[0].hand.userData.pose(0.25);
  const a = this.carryT; this.carrying = true; this.tween(0.9, (k) => { this.carryT = a * (1 - k); }, () => { this.carrying = false; this.sound.koton('basket', 0.6); });
  this.goStation(0); this.save(true);
};

// ---------- 補助店員の手 ----------
P.assistBusy = function () { return this.assist.q.length > 0 || !!this.assist.cur; };
P.assistMove = function (it) { this.assist.q.push(it); };
P.updateAssist = function (dt) {
  const A = this.assist, arm = this.assistArm;
  if (!A.cur && A.q.length) { const it = A.q.shift(); if (it.st.loc !== 'basket') return; A.cur = { it, t: 0, ph: 0, palm: A.home.clone() }; arm.visible = true; arm.userData.pose(0.2); }
  const c = A.cur; if (!c) { arm.visible = false; return; }
  const it = c.it, top = BASE[it.type] * (it.type === 'bread' ? 0.4 : 1) + 0.012; c.t += dt;
  if (c.ph === 0) { const k = Math.min(1, c.t / 0.32); c.palm.lerpVectors(A.home, this.tmp.copy(it.pos).add(V(0, top, 0)), ease(k)); if (k >= 1) { c.ph = 1; c.t = 0; it.mode = 'carried'; it.st.loc = 'tray'; c.p0 = it.pos.clone(); c.q0 = it.q.clone(); arm.userData.pose(0.6); this.sound.tap(0.3); } }
  else if (c.ph === 1) {
    const k = Math.min(1, c.t / 0.55), e = ease(k), p = V(), q = new THREE.Quaternion(); this.poseOf(it, p, q);
    it.pos.lerpVectors(c.p0, p, e); it.pos.y += Math.sin(Math.PI * k) * 0.16; it.q.slerpQuaternions(c.q0, q, e);
    it.obj.position.copy(it.pos); it.obj.quaternion.copy(it.q); c.palm.copy(it.pos).add(V(0, top, 0));
    if (k >= 1) { c.ph = 2; c.t = 0; it.mode = 'rest'; this.sound.koton(it.type, 0.8); arm.userData.pose(0.2); c.p1 = c.palm.clone(); this.save(); }
  } else { const k = Math.min(1, c.t / 0.3); c.palm.lerpVectors(c.p1, A.home, ease(k)); if (k >= 1) { A.cur = null; arm.visible = false; return; } }
  arm.userData.place(c.palm, this.tmp.copy(c.palm).add(V(0.55, 0.3, 0.35)), V(0, -1, -0.2));
};

// ---------- お手本の手 (約4秒の放置で一度だけ) ----------
P.hideHint = function () { if (this.hint) { this.hint = null; this.hintArm.visible = false; } };
P.suggest = function () {
  const S = this.S, n = this.station, up = V(0, 0.02, 0);
  if (n === 0) {
    if (S.phase === 'open') {
      const milk = this.list.find((i) => i.type === 'milk' && i.st.loc === 'crate'), free = [0, 1, 2].find((k) => !this.list.some((o) => o.st.loc === 'shelf' && o.st.slot === k));
      if (!S.intro && milk && free !== undefined) return { a: milk.pos.clone(), b: V(L.milkX[free], L.shelfTopY + 0.12, L.milkZ + 0.1), it: milk };
      if (S.basket === 'stand' && !this.carrying) {
        if (this.basketCount() === 0) { const it = this.list.find((i) => ['shelf', 'lane', 'crate', 'bin'].includes(i.st.loc)); if (it) return { a: it.pos.clone(), b: this.basketPos.clone().add(V(0, 0.2, 0)), it }; }
        else return { a: this.basketPos.clone().add(V(0, 0.33, 0)), b: this.basketPos.clone().add(V(0.42, 0.42, 0)) };
      }
    } else {
      const un = this.list.find((i) => i.st.loc === 'shelf' && !i.st.tidy); if (un) return { a: un.pos.clone().add(V(0, 0, 0.05)), b: un.pos.clone().add(V(0, 0, 0.14)), it: un };
      if (S.basket === 'stand') return { a: this.basketPos.clone().add(V(0, 0.33, 0)), b: this.stackTop().clone().add(V(0, 0.33, 0)) };
    }
  } else if (n === 1 && S.basket === 'reg') {
    const un = this.unread();
    if (un.length) return { a: this.scanPos.clone(), b: un[0].pos.clone().add(V(0.02, 0.1, 0.1)) };
    if (!S.paid && this.trayItems().length && !this.assistBusy()) return { a: L.button.clone().add(V(0, 0.17, 0)), b: L.button.clone().add(V(0, 0.07, 0)), point: 1 };
  } else if (n === 2 && this.bagWhere === 'rack') {
    const sim = this.sim, tr = this.trayItems();
    if (this.time - (this.blockedT || -99) < 8) { const side = S.pegs[1] === 2 ? 1 : 0, h = side ? sim.hR : sim.hL; const a = V(L.rack.x + sim.px[h[2]], L.counterY + sim.py[h[2]], L.rack.z + 0.03); return { a, b: a.clone().add(V(side ? 0.09 : -0.09, 0, 0)) }; }
    if (tr.length && this.trayAt === 'bag') { const it = tr[0]; return { a: it.pos.clone(), b: V(L.rack.x, L.counterY + PEG_Y - 0.1, L.rack.z + 0.05), it }; }
    if (this.bagItems().length && this.customerReady()) { const a = V(L.rack.x + sim.px[sim.hR[2]], L.counterY + PEG_Y, L.rack.z + 0.03); return { a, b: a.clone().add(V(0.2, 0.17, 0)) }; }
  } else if (n === 3) { const y = (1 - S.shutter) * (L.openH - 0.06) + 0.05; return { a: V(1.55, y, L.frontZ + 0.1), b: V(1.55, Math.max(0.3, y - 0.9), L.frontZ + 0.1) }; }
  else if (n === 4 && S.carded) { return { a: V(1.55, 0.12, L.frontZ - 0.35), b: V(1.55, 1.0, L.frontZ - 0.35), out: 1 }; }
  void up; return null;
};
P.updateHint = function (dt) {
  const arm = this.hintArm;
  if (!this.hint) {
    const quiet = !this.drag && this.fade === 0 && !this.cam.via.length && !this.carrying && !this.assistBusy() && this.cust.state !== 'walk' && this.cust.state !== 'holding' && this.cust.state !== 'leaving' && this.cust.state !== 'returning' && this.mgr.state !== 'busy';
    if (!quiet) { this.idle = Math.min(this.idle, 2.5); return; }
    if (this.idle > 4 && !this.hintDone) { this.hintDone = true; const s = this.suggest(); if (s) { this.hint = { s, t: 0 }; this.hintCount = (this.hintCount || 0) + 1; if (s.it) s.it.wig = 0.5; arm.userData.pose(s.point ? 0.9 : 0.55, 0.5, s.point ? 0.05 : 0.55); } }
    return;
  }
  const h = this.hint, s = h.s; h.t += dt;
  const cam = this.camera, right = V(1, 0, 0).applyQuaternion(cam.quaternion), upv = V(0, 1, 0).applyQuaternion(cam.quaternion), fw = V(0, 0, -1).applyQuaternion(cam.quaternion);
  const off = V().addScaledVector(right, 0.28).addScaledVector(upv, -0.5).addScaledVector(fw, -0.25);
  let p = V(); const t = h.t;
  if (t < 0.4) p.copy(s.a).addScaledVector(off, (1 - ease(t / 0.4)) * 0.9);
  else if (t < 1.5) p.lerpVectors(s.a, s.b, ease((t - 0.4) / 1.1));
  else if (t < 1.9) p.copy(s.b).addScaledVector(off, ease((t - 1.5) / 0.4) * 0.9);
  else { this.hideHint(); return; }
  p.addScaledVector(fw, -0.04);
  arm.visible = true; arm.userData.place(p, this.tmp.copy(p).add(off), fw);
};

// ---------- 店じまいと店長 ----------
P.onStation = function (n) { if (n === 4 && !this.S.carded) this.managerCome(); };
P.closeShop = function () {
  this.fadeGoal = 1; this.closeCount = (this.closeCount || 0) + 1;
  this.after(0.5, () => { this.station = 4; this.S.station = 4; this.cam.snap = true; this.cam.pan = 0; this.fadeGoal = 0; this.hintDone = false; this.idle = 0; this.managerCome(); this.save(true); });
};
P.managerCome = function () {
  const m = this.mgr, id = ++m.seq, Pn = m.P; if (this.S.carded) return;
  const ok = () => m.seq === id && this.station === 4;
  m.state = 'busy'; m.x = 5.0; m.z = -4.9; Pn.group.visible = true; T.drawCard(this.cardCv, 0); this.cardTex.needsUpdate = true;
  this.card.visible = true; this.stamp.visible = true; this.scene.add(this.card); this.card.scale.setScalar(1);
  m.hold = { card: V(0.1, 0.34, 0.3), stamp: V(-0.14, 0.52, 0.26), show: 0 };
  walkTo(m, [[2.45, -4.75]], () => {
    if (!ok()) return; m.faceTo = Math.PI;
    this.after(0.5, () => { if (!ok()) return; const a = m.hold.stamp.clone(), b = V(0.08, 0.385, 0.3); this.tween(0.28, (k) => { if (ok()) m.hold.stamp.lerpVectors(a, b, k * k); }, () => {
      if (!ok()) return; this.sound.stamp(); this.tween(0.5, (k) => { T.drawCard(this.cardCv, k); this.cardTex.needsUpdate = true; }, () => { this.sound.chime(); });
      this.after(0.25, () => { if (ok()) this.tween(0.35, (k) => { m.hold.stamp.lerpVectors(b, V(-0.2, 0.2, 0.12), k); }, () => { this.stamp.visible = false; Pn.armT[0] = null; m.hold.stamp = null; }); });
    }); });
    this.after(1.9, () => { if (!ok()) return; walkTo(m, [[2.0, -6.3]], () => { if (!ok()) return; m.faceTo = Math.PI; this.tween(0.5, (k) => { if (ok()) { m.hold.card.set(lerp(0.1, 0.0, k), lerp(0.34, 0.5, k), lerp(0.3, 0.46, k)); m.hold.show = k; } }, () => { if (ok()) this.after(0.7, () => { if (ok()) this.giveCard(); }); }); }); });
  });
};
P.giveCard = function () {
  const m = this.mgr, cam = this.camera, card = this.card;
  this.S.carded = 1; this.cardCount = (this.cardCount || 0) + 1; this.save(true); m.hold = null; m.P.armT[1] = null;
  cam.attach(card); const p0 = card.position.clone(), q0 = card.quaternion.clone(), a = this.vw / this.vh, th = Math.tan((cam.fov * Math.PI) / 360);
  const p1 = V(-th * a * 0.42 * 0.55, -th * 0.55 * 0.5, -0.55), q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.15, 0.2, 0.1));
  this.sound.pop();
  this.tween(0.7, (k) => { card.position.lerpVectors(p0, p1, k); card.quaternion.slerpQuaternions(q0, q1, k); }, () => { this.showCardHeld(false); });
  m.state = 'wave'; m.waveT = 0;
  this.after(0.6, () => { walkTo(m, [[2.55, -4.7]], () => { m.faceTo = Math.PI; }, true); });
};
P.showCardHeld = function (instant) {
  const cam = this.camera, card = this.card, a = this.vw / this.vh, th = Math.tan((cam.fov * Math.PI) / 360), m = this.mgr;
  if (instant) { T.drawCard(this.cardCv, 1); this.cardTex.needsUpdate = true; cam.add(card); card.visible = true; card.position.set(-th * a * 0.42 * 0.55, -th * 0.55 * 0.5, -0.55); card.quaternion.setFromEuler(new THREE.Euler(-0.15, 0.2, 0.1)); m.x = 2.55; m.z = -4.7; m.rot = Math.PI; m.faceTo = Math.PI; m.state = 'idle'; m.P.group.visible = true; this.stamp.visible = false; }
  const arm = this.playerArm; arm.visible = true; arm.userData.pose(0.5, 0.2);
  const tp = card.position.clone().add(V(-0.02, -0.075, 0.012));
  arm.userData.place(tp, tp.clone().add(V(0.02, -0.6, 0.12)), V(0, 0, -1));
};
P.reopen = function () {
  const S = this.S, v0 = S.shutter; this.reopenCount = (this.reopenCount || 0) + 1;
  this.mgr.seq++; this.mgr.state = 'away'; this.card.visible = false; this.playerArm.visible = false; this.stamp.visible = false;
  this.sound.setShutter(0.5); this.tween(0.5, (k) => this.setShutter(v0 * (1 - k)), () => { this.sound.setShutter(0); this.sound.clank(0.7); });
  this.newDay();
  this.cam.via = [{ pos: V(1.55, 1.5, -5.2), tgt: V(1.2, 1.1, 0) }, { pos: V(1.2, 1.45, -1.3), tgt: V(-0.9, 0.9, 0.4) }];
  this.station = 0; S.station = 0; this.cam.pan = 0; this.hintDone = false; this.idle = 0;
  this.after(1.6, () => { this.mgr.P.group.visible = false; });
  this.save(true);
};
P.newDay = function () {
  const S = this.S; S.day += 1; S.phase = 'open'; S.paid = 0; S.handed = 0; S.carded = 0; S.basket = 'stand'; S.pegs = [1, 2]; this.carryT = 0;
  for (const it of this.list) {
    const st = it.st; st.sc = 0; st.paid = 0; st.tidy = 1;
    if (['sold', 'bag', 'tray', 'basket'].includes(st.loc)) { this.dropBody(it); it.mode = 'rest'; st.loc = it.type === 'bread' ? 'bin' : 'crate'; st.slot = 0; }
  }
  this.trayAt = 'reg'; this.trayPos.copy(L.trayReg); this.basketPos.copy(L.stand);
  this.sim.groundY = 0; this.sim.support = null; this.bagWhere = 'rack'; this.bagZ = 0; this.simAwake = 2;
  this.cust.state = 'away'; this.cust.P.group.visible = false;
};
P.resetAll = function () { this.S = defaultState(); this.restore(); this.save(true); };

// ---------- 毎フレーム ----------
P.updateActors = function (dt) {
  this.updateAssist(dt);
  for (const a of [this.cust, this.mgr]) {
    const Pn = a.P; if (!Pn.group.visible) continue;
    let moving = 0;
    if (a.path.length) {
      const t = a.path[0], dx = t.x - a.x, dz = t.z - a.z, d = Math.hypot(dx, dz), st = a.speed * dt * (a.keepRot ? 0.5 : a.state === 'leaving' ? 0.8 : 1);
      if (d <= st) { a.x = t.x; a.z = t.z; a.path.shift(); if (!a.path.length) { const f = a.done; a.done = null; f && f(); } }
      else { a.x += (dx / d) * st; a.z += (dz / d) * st; if (!a.keepRot) { const want = Math.atan2(dx, dz); let dr = want - a.rot; while (dr > Math.PI) dr -= 6.2832; while (dr < -Math.PI) dr += 6.2832; a.rot += clamp(dr, -dt * (a.state === 'leaving' ? 2.2 : 7), dt * (a.state === 'leaving' ? 2.2 : 7)); } moving = 1; }
      if (moving && Math.sin(Pn.phase) * Math.sin(Pn.phase - dt * 7.2) < 0 && this.station !== 0) this.sound.step();
    } else if (a.faceTo !== undefined) { let dr = a.faceTo - a.rot; while (dr > Math.PI) dr -= 6.2832; while (dr < -Math.PI) dr += 6.2832; a.rot += clamp(dr, -dt * 5, dt * 5); }
    Pn.walk = lerp(Pn.walk, moving, Math.min(1, dt * 8));
    Pn.group.position.set(a.x, 0, a.z); Pn.group.rotation.y = a.rot;
  }
  // 客: 受け取りの構えと保持
  const c = this.cust, Pc = c.P, sim = this.sim;
  if (Pc.group.visible) {
    if (c.state === 'atBag' && this.bagWhere === 'held') {
      const k = clamp((this.liftX - 0.02) / 0.22, 0, 1), info = sim.contents(), ctr = sim.center();
      const bread = this.items.bread.body; let avoid = 0;
      if (bread && sim.anyInside(bread) && !sim.allInside(bread)) { const tipX = bread.x - Math.sin(bread.a) * 0.17 * Math.sign(Math.cos(bread.a) || 1); if (tipX > ctr.x + 0.015) avoid = 1; }
      c.avoid = lerp(c.avoid || 0, avoid, Math.min(1, dt * 5));
      if (k > 0.1) {
        const t = V(L.rack.x + this.liftX + 0.035 + clamp(info.x - ctr.x, -0.05, 0.05) - c.avoid * 0.03, Math.min(1.5, L.counterY + this.liftY + 0.035) + c.avoid * 0.05, L.rack.z - 0.035);
        Pc.armT[0] = t; Pc.palm[0] = V(-0.4, -0.8, 0.3); Pc.arms[0].hand.userData.pose(0.3, 0.1);
        const t1 = V(L.rack.x + info.x + 0.05, Math.max(L.counterY + 0.04, L.counterY + sim.bottomY() - 0.05), L.rack.z - 0.05);
        if (info.mass > 1.25 && this.reach(Pc, 1, t1)) { Pc.armT[1] = t1; Pc.palm[1] = V(0, 1, 0); } else Pc.armT[1] = null;
      } else { Pc.armT[0] = null; Pc.armT[1] = null; }
      Pc.bow = lerp(Pc.bow, 0.42 * k, Math.min(1, dt * 6)); Pc.lean = lerp(Pc.lean, c.avoid * 0.12 * k, Math.min(1, dt * 5));
    } else if (c.state === 'atBag' || c.state === 'atReg') { if (this.bagWhere !== 'cust') { Pc.armT[0] = null; Pc.armT[1] = null; Pc.bow = lerp(Pc.bow, 0, Math.min(1, dt * 5)); Pc.lean = lerp(Pc.lean, 0, Math.min(1, dt * 5)); } }
    if (this.bagWhere === 'cust') {
      if (!c.attached) c.ht.copy(c.pin); else if (c.local) c.ht.copy(Pc.group.localToWorld(this.tmp.copy(c.local)));
      Pc.armT[0] = this.tmp2.copy(c.ht).add(V(0.03, 0.005, -0.07)).clone(); Pc.palm[0] = V(-0.5, -0.6, 0.4);
      if (!c.attached) Pc.bow = lerp(Pc.bow, 0.4, Math.min(1, dt * 5));
      if (c.support) { const info = sim.contents(), by = (sim.pinL.y + sim.pinR.y) / 2 - c.supDrop, t1 = V(L.rack.x + info.x + 0.04, L.counterY + by - 0.04, L.rack.z + this.bagZ - 0.02); if (this.reach(Pc, 1, t1)) { Pc.armT[1] = t1; Pc.palm[1] = V(0, 1, 0); } else Pc.armT[1] = null; }
      else if (c.state !== 'returning') Pc.armT[1] = null;
    }
  }
  if (Pc.group.visible) Pc.update(dt);
  if (this.bagWhere === 'cust') {
    const g = this.grip(Pc, 0, V()); let pc = g;
    if (!c.attached) {
      pc = c.pin; c.attT += dt;
      if (g.distanceTo(c.pin) < 0.045 || c.attT > 1.3) { c.attached = true; c.offv.copy(c.pin).sub(g); this.holdSequence(); }
    } else { c.offv.multiplyScalar(Math.exp(-dt * 3)); pc = g.clone().add(c.offv); }
    sim.pinL.tx = pc.x - L.rack.x - c.gap / 2; sim.pinR.tx = pc.x - L.rack.x + c.gap / 2; sim.pinL.ty = pc.y - L.counterY + c.dyL; sim.pinR.ty = pc.y - L.counterY + c.dyR;
    this.bagZ = lerp(this.bagZ, pc.z - L.rack.z, Math.min(1, dt * 8));
    // 添え手: 実際に底の近くまで手が届いているときだけ、底をそっと支える (持ち上げすぎない)
    if (c.support) { const hw = this.grip(Pc, 1, V()), hx = hw.x - L.rack.x, hy = hw.y - L.counterY + 0.012, by = (sim.pinL.y + sim.pinR.y) / 2 - c.supDrop, ct = sim.contents(); if (Math.abs(hx - ct.x) < 0.14 && hy > by - 0.08 && Math.abs(hw.z - (L.rack.z + this.bagZ)) < 0.2) sim.support = { x0: hx - 0.085, x1: hx + 0.085, y: Math.min(hy, by + 0.014) }; else sim.support = null; } else sim.support = null;
    this.simAwake = 1;
  }
  // 店長
  const m = this.mgr, Pm = m.P;
  if (Pm.group.visible) {
    if (m.hold) {
      Pm.group.updateMatrixWorld(true);
      const cw = local(Pm, m.hold.card.x, m.hold.card.y, m.hold.card.z); Pm.armT[1] = cw.clone().add(V(0, -0.03, 0)); Pm.palm[1] = V(0, 1, 0);
      this.card.position.copy(cw).add(V(0, 0.012 + m.hold.show * 0.06, 0)); this.card.rotation.set(-Math.PI / 2 + m.hold.show * (Math.PI / 2 - 0.2), m.rot + Math.PI * 0, 0, 'YXZ'); this.card.rotation.y = m.rot;
      if (m.hold.stamp) { const sw = local(Pm, m.hold.stamp.x, m.hold.stamp.y, m.hold.stamp.z); Pm.armT[0] = sw.clone().add(V(0, 0.09, 0)); Pm.palm[0] = V(0, -1, 0); this.stamp.position.copy(sw); }
    } else if (m.state === 'wave') { m.waveT += dt; Pm.group.updateMatrixWorld(true); Pm.armT[0] = local(Pm, -0.3 + Math.sin(m.waveT * 9) * 0.07, 0.78, 0.12); Pm.palm[0] = V(0, 0, -1); Pm.arms[0].hand.userData.pose(0.05, 0); if (m.waveT > 2.4) { m.state = 'idle'; Pm.armT[0] = null; } }
    Pm.update(dt);
  }
};
