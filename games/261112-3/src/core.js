// core.js — 状態・保存・品物の姿勢・カメラ・毎フレーム更新
import * as THREE from 'three';
import * as T from './tex.js';
import { L, makeMats, makeMilk, makeApple, makeBerryPack, makeBread, makeBasket, makeTray, makeScanner, buildStore, buildExterior } from './models.js';
import { BagSim, makeShape, PEG_X, PEG_Y } from './bagsim.js';
import { BagView } from './bagview.js';

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => t * t * (3 - 2 * t);
const QX = (a) => new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), a), QY = (a) => new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), a), QZ = (a) => new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), a);
const AX = V(1, 0, 0), AZ = V(0, 0, 1);

export const IDS = ['milk1', 'milk2', 'apple1', 'apple2', 'berry', 'bread'];
export const TYPE = { milk1: 'milk', milk2: 'milk', apple1: 'apple', apple2: 'apple', berry: 'berry', bread: 'bread' };
export const BASE = { milk: 0.108, apple: 0.038, berry: 0.0275, bread: 0.2 };
export const LANELEN = { apple: 0.088, berry: 0.172 };
const MASS = { milk: 1.03, apple: 0.3, berry: 0.35, bread: 0.28 };
const SHAPES = {
  milk: makeShape('box', { hx: 0.035, hy: 0.108, r: 0.005, hz: 0.036 }), apple: makeShape('circle', { r: 0.04, zs: 1 }),
  berry: makeShape('box', { hx: 0.0825, hy: 0.0275, r: 0.008, hz: 0.058 }), bread: makeShape('capsule', { hl: 0.168, r: 0.03, zs: 0.92 }),
};
const SLOT = {
  crate: { milk1: [-0.12, 0.075, 0.02], milk2: [-0.045, 0.075, 0.02], apple1: [0.145, 0.107, -0.06], apple2: [0.145, 0.107, 0.045], berry: [0.045, 0.107, 0] },
  basket: { milk1: [-0.12, 0.008, -0.065], milk2: [-0.04, 0.008, -0.065], apple1: [0.06, 0.008, 0.065], apple2: [0.07, 0.008, -0.04], berry: [-0.07, 0.008, 0.05], bread: [0.15, 0.008, 0] },
  tray: { milk1: [-0.125, 0, -0.075], milk2: [-0.045, 0, -0.075], apple1: [0.045, 0, -0.07], apple2: [0.13, 0, -0.065], berry: [-0.07, 0, 0.015], bread: [0, 0, 0.1] },
};
const LOCS = ['crate', 'shelf', 'lane', 'bin', 'basket', 'tray', 'bag', 'sold'];
const SAVE_KEY = 'gf-261112-3:save';

export function defaultState() {
  const it = (loc, slot = 0, ord = 0) => ({ loc, slot, ord, sc: 0, paid: 0, bx: 0, by: 0.2, ba: 0, tidy: 1 });
  return { v: 1, day: 1, intro: 0, phase: 'open', station: 0, basket: 'stand', paid: 0, handed: 0, pegs: [1, 2], shutter: 0, carded: 0,
    items: { milk1: it('crate'), milk2: it('shelf', 1), apple1: it('lane', 0, 0), apple2: it('lane', 0, 1), berry: it('crate'), bread: it('bin') } };
}
export function validState(s) {
  try {
    if (!s || typeof s !== 'object' || s.v !== 1) return false;
    if (!Number.isInteger(s.day) || s.day < 1 || s.day > 99999) return false;
    if (s.phase !== 'open' && s.phase !== 'close') return false;
    if (![0, 1, 2, 3, 4].includes(s.station)) return false;
    if (!['stand', 'reg', 'stack'].includes(s.basket)) return false;
    if (!Array.isArray(s.pegs) || s.pegs.length !== 2 || ![0, 1].includes(s.pegs[0]) || ![2, 3].includes(s.pegs[1])) return false;
    if (typeof s.shutter !== 'number' || !(s.shutter >= 0 && s.shutter <= 1)) return false;
    for (const k of ['intro', 'paid', 'handed', 'carded']) if (s[k] !== 0 && s[k] !== 1) return false;
    if (!s.items || typeof s.items !== 'object' || Object.keys(s.items).length !== IDS.length) return false;
    const shelf = new Set(), lanes = [[], [], []];
    for (const id of IDS) {
      const i = s.items[id]; if (!i || !LOCS.includes(i.loc)) return false;
      for (const k of ['sc', 'paid', 'tidy']) if (i[k] !== 0 && i[k] !== 1) return false;
      for (const k of ['bx', 'by', 'ba']) if (typeof i[k] !== 'number' || !isFinite(i[k]) || Math.abs(i[k]) > 50) return false;
      if (!Number.isInteger(i.slot) || !Number.isInteger(i.ord) || i.slot < 0 || i.slot > 2 || i.ord < 0 || i.ord > 5) return false;
      const t = TYPE[id];
      if (i.loc === 'shelf') { if (t !== 'milk' || shelf.has(i.slot)) return false; shelf.add(i.slot); }
      if (i.loc === 'lane') { if (t !== 'apple' && t !== 'berry') return false; lanes[i.slot].push(id); }
      if (i.loc === 'bin' && t !== 'bread') return false;
      if (i.loc === 'crate' && t === 'bread') return false;
      if (i.loc === 'basket' && s.basket === 'stack') return false;
      if (i.loc === 'tray' && !i.sc) return false;
      if ((i.loc === 'bag' || i.loc === 'sold') && !s.paid) return false;
      if (i.paid && !s.paid) return false;
    }
    for (const l of lanes) { let len = 0; for (const id of l) len += LANELEN[TYPE[id]]; if (len > L.laneLen + 0.001) return false; }
    if (s.phase === 'close' && !s.paid) return false;
    if (s.carded && s.phase !== 'close') return false;
    return true;
  } catch (e) { return false; }
}

export class Game {
  constructor(env) {
    Object.assign(this, env); // scene, camera, renderer, sound, low, sun
    this.M = makeMats();
    this.time = 0; this.idle = 0; this.busy = 0; this.btnDown = 0; this.timers = []; this.tweens = [];
    this.saveOK = true; this.saveDirty = false; this.saveT = 0; this.memSave = null;
    this.S = this.load();
    this.vw = 1; this.vh = 1; this.insets = [0, 0, 0, 0];
    this.ray = new THREE.Raycaster(); this.tmp = V(); this.tmp2 = V();
    this.build();
    this.restore();
  }
  // ---------- 保存 ----------
  load() {
    let raw = null;
    try { raw = window.localStorage.getItem(SAVE_KEY); } catch (e) { this.saveOK = false; }
    if (raw) { try { const s = JSON.parse(raw); if (validState(s)) return s; } catch (e) { /* 破損 → 標準配置 */ } this.loadRejected = true; }
    return defaultState();
  }
  save(now) { this.saveDirty = true; if (now) this.flush(); }
  flush() {
    if (!this.saveDirty) return; this.saveDirty = false;
    this.syncBagState();
    const s = JSON.stringify(this.S); this.memSave = s;
    if (!this.saveOK) return;
    try { window.localStorage.setItem(SAVE_KEY, s); } catch (e) { this.saveOK = false; }
  }
  // ---------- 構築 ----------
  build() {
    const sc = this.scene, M = this.M;
    const store = buildStore(M); sc.add(store.group); this.refs = store.refs;
    const ext = buildExterior(M); sc.add(ext.group); this.shutterObj = ext.refs.shutter;
    this.basket = makeBasket(); sc.add(this.basket); this.basketPos = V().copy(L.stand); this.carryT = 0;
    this.tray = makeTray(); sc.add(this.tray); this.trayPos = V().copy(L.trayReg);
    this.scanner = makeScanner(M); sc.add(this.scanner); this.scanPos = V().copy(L.scanner); this.scanHome = V().copy(L.scanner); this.scanQ = new THREE.Quaternion(); this.scanCool = 0;
    this.scanner.rotation.order = 'YXZ';
    // スキャナーのコード
    this.cableGeo = new THREE.BufferGeometry(); this.cable = new THREE.Mesh(this.cableGeo, M.rubber); this.cable.frustumCulled = false; sc.add(this.cable); this.cableDirty = true;
    // 読み取り光
    this.beam = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xff2a1a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    this.beam.visible = false; sc.add(this.beam); this.beamT = 0;
    this.glow = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.05), new THREE.MeshBasicMaterial({ map: T.blobTex(), color: 0xff3020, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false }));
    this.glow.visible = false; this.glow.renderOrder = 20; sc.add(this.glow);
    // 品物
    this.items = {}; this.list = [];
    const mk = { milk1: () => makeMilk(101), milk2: () => makeMilk(101), apple1: () => makeApple(0), apple2: () => makeApple(1), berry: () => makeBerryPack(31), bread: () => makeBread(57) };
    for (const id of IDS) {
      const obj = mk[id](); sc.add(obj);
      const it = { id, type: TYPE[id], obj, st: this.S.items[id], mode: 'rest', pos: V(), q: new THREE.Quaternion(), tw: null, body: null, lanePos: 0, laneVel: 0, zOff: 0, wig: 0, nudge: 0, supY: 0, vel: V(), sway: 0 };
      this.items[id] = it; this.list.push(it);
    }
    this.lanes = [[], [], []];
    // 袋
    this.sim = new BagSim(); this.bagView = new BagView(this.sim, T.crinkleBump(), this.low);
    this.bagGroup = this.bagView.group; this.bagGroup.position.copy(L.rack); sc.add(this.bagGroup);
    this.bagZ = 0; this.bagWhere = 'rack'; this.bagLift = 0;
    this.simAwake = 2;
    // カメラ
    this.cam = { pos: V(), tgt: V(), gpos: V(), gtgt: V(), pan: 0, via: [], snap: true, lift: 0 };
    this.fade = 0; this.fadeGoal = 0;
    this.buildActors();
  }
  restore() {
    const S = this.S;
    if (S.handed) { for (const it of this.list) if (it.st.loc === 'bag') it.st.loc = 'sold'; S.handed = 0; S.phase = 'close'; if (S.basket === 'reg') S.basket = 'stand'; if (S.station < 3) S.station = 0; }
    if (S.station === 4 && !(S.phase === 'close' && S.shutter > 0.9)) S.station = S.phase === 'close' ? 3 : 0;
    if (S.station === 3 && S.phase !== 'close') S.station = 0;
    this.rebuildLanes();
    this.basketPos.copy(S.basket === 'stand' ? L.stand : S.basket === 'reg' ? L.regBasket : V().copy(L.stack).add(V(0, 0.1, 0)));
    this.carryT = S.basket === 'reg' ? 1 : 0;
    const trayAtBag = S.paid && S.station !== 1; this.trayPos.copy(trayAtBag ? L.trayBag : L.trayReg); this.trayAt = trayAtBag ? 'bag' : 'reg';
    this.sim.pinL.tx = this.sim.pinL.x = PEG_X[S.pegs[0]]; this.sim.pinR.tx = this.sim.pinR.x = PEG_X[S.pegs[1]];
    for (let i = 0; i < 90; i++) this.sim.step(1 / 60);
    for (const it of this.list) {
      it.st = S.items[it.id]; it.mode = 'rest'; it.obj.visible = it.st.loc !== 'sold';
      if (it.st.loc === 'bag') { this.addBody(it, clamp(it.st.bx, -0.3, 0.3), clamp(it.st.by, 0.03, 0.8), it.st.ba); it.mode = 'body'; }
    }
    for (let i = 0; i < 120; i++) this.sim.step(1 / 60);
    for (const it of this.list) this.applyRest(it, true);
    this.station = S.station; this.cam.snap = true;
    this.setShutter(S.shutter);
    this.restoreActors();
  }
  rebuildLanes() {
    this.lanes = [[], [], []];
    const arr = this.list.filter((i) => i.st.loc === 'lane').sort((a, b) => a.st.ord - b.st.ord);
    for (const it of arr) { const l = this.lanes[it.st.slot]; let p = 0; for (const o of l) p += LANELEN[o.type]; it.lanePos = p; it.laneVel = 0; l.push(it); }
    this.syncLaneOrd();
  }
  syncLaneOrd() { for (const l of this.lanes) l.forEach((it, i) => { it.st.ord = i; }); }
  laneUsed(l, except) { let s = 0; for (const o of this.lanes[l]) if (o !== except) s += LANELEN[o.type]; return s; }
  // ---------- 物理ボディ ----------
  addBody(it, x, y, a) { if (it.body) return it.body; it.body = this.sim.addBody(it.id, SHAPES[it.type], MASS[it.type], x, y, a); this.simAwake = 3; return it.body; }
  dropBody(it) { if (it.body) { this.sim.removeBody(it.body); it.body = null; } }
  syncBagState() { for (const it of this.list) if (it.body && it.st.loc === 'bag') { it.st.bx = +it.body.x.toFixed(4); it.st.by = +it.body.y.toFixed(4); it.st.ba = +(((it.body.a % 6.2832) + 6.2832) % 6.2832).toFixed(4); } }
  // ---------- 姿勢 ----------
  poseOf(it, p, q) {
    const st = it.st, t = it.type; q.identity();
    if (st.loc === 'shelf') { p.set(L.milkX[st.slot], L.shelfTopY + BASE.milk, L.milkZ - (st.tidy ? 0 : 0.085)); if (!st.tidy) q.copy(QY(0.5 - st.slot * 0.45)); }
    else if (st.loc === 'crate') { const s = SLOT.crate[it.id]; p.set(L.crate.x + s[0], L.crate.y + s[1] + BASE[t], L.crate.z + s[2]); if (t === 'berry') q.copy(QY(Math.PI / 2)); if (t === 'milk') q.copy(QY(it.id === 'milk1' ? 0.25 : -0.1)); }
    else if (st.loc === 'lane') {
      const d = it.lanePos + LANELEN[t] / 2 + 0.006, b = BASE[t];
      p.copy(L.laneFront).addScaledVector(L.laneDir, d); p.x = L.laneX[st.slot]; p.y += 0.954 * b; p.z += 0.298 * b;
      const sl = Math.atan2(0.298, 0.954);
      if (t === 'apple') q.copy(QX(-it.lanePos / 0.038)).multiply(QZ(0.3)); else q.copy(QX(sl)).multiply(QY(Math.PI / 2));
    }
    else if (st.loc === 'bin') { p.set(L.bin.x + 0.01, L.bin.y + 0.2, L.bin.z + 0.01); q.copy(QZ(-0.13)).multiply(QX(-0.1)); }
    else if (st.loc === 'basket') { const s = SLOT.basket[it.id]; p.set(this.basketPos.x + s[0], this.basketPos.y + s[1] + BASE[t], this.basketPos.z + s[2] + it.nudge * 0.035); if (t === 'bread') q.copy(QZ(-0.24)); if (t === 'milk') q.copy(QY(Math.PI / 2)); }
    else if (st.loc === 'tray') { const s = SLOT.tray[it.id]; p.set(this.trayPos.x + s[0], this.trayPos.y + s[1] + (t === 'bread' ? 0.031 : BASE[t]), this.trayPos.z + s[2]); if (t === 'bread') q.copy(QZ(Math.PI / 2)); if (t === 'milk') q.copy(QY(Math.PI / 2)); }
    else if (st.loc === 'bag' && it.body) { this.bodyPose(it, p, q); }
    else p.set(0, -5, 0);
    return p;
  }
  bodyPose(it, p, q) { const b = it.body; p.set(L.rack.x + b.x, L.counterY + b.y, L.rack.z + this.bagZ + it.zOff); q.setFromAxisAngle(AZ, b.a); if (it.type === 'milk') q.multiply(QY(Math.PI / 2)); }
  supportY(it) {
    const l = it.st.loc;
    return l === 'shelf' ? L.shelfTopY : l === 'crate' ? L.crate.y + SLOT.crate[it.id][1] : l === 'bin' ? L.bin.y : l === 'basket' ? this.basketPos.y + 0.008 : l === 'tray' ? this.trayPos.y : l === 'lane' ? it.pos.y - BASE[it.type] : L.counterY;
  }
  applyRest(it, snap) { this.poseOf(it, it.pos, it.q); it.obj.position.copy(it.pos); it.obj.quaternion.copy(it.q); }
  tweenTo(it, dur, arc, done) {
    it.mode = 'tween'; it.tw = { t: 0, dur, arc, done, p0: it.pos.clone(), q0: it.q.clone() };
  }
  // ---------- 時間の道具 ----------
  after(sec, fn) { const t = { t: sec, fn }; this.timers.push(t); return t; }
  tween(dur, fn, done, ez = ease) { const t = { t: 0, dur, fn, done, ez }; this.tweens.push(t); fn(0); return t; }
  // ---------- 投影 ----------
  screen(v, out) { const p = this.tmp.copy(v).project(this.camera); out = out || {}; out.x = (p.x * 0.5 + 0.5) * this.vw; out.y = (-p.y * 0.5 + 0.5) * this.vh; out.z = p.z; return out; }
  setRay(x, y) { this.ray.setFromCamera(new THREE.Vector2((x / this.vw) * 2 - 1, -(y / this.vh) * 2 + 1), this.camera); return this.ray.ray; }
  onPlaneZ(x, y, z, out) { const r = this.setRay(x, y), t = (z - r.origin.z) / r.direction.z; return out.copy(r.origin).addScaledVector(r.direction, t); }
  pxPerM(v) { const d = this.tmp.copy(v).sub(this.camera.position).length(); return this.vh / (2 * Math.tan((this.camera.fov * Math.PI) / 360) * d); }
  // ---------- カメラ ----------
  stationPose(n, pos, tgt) {
    const a = this.vw / this.vh, th = Math.tan((this.camera.fov * Math.PI) / 360);
    const ins = this.insets, sx = 1 - (ins[1] + ins[3]) / this.vw, sy = 1 - (ins[0] + ins[2]) / this.vh;
    const D = [
      { c: [-1.15, 0.84, 0.12], hw: 0.5, hh: 0.84, el: 0.2, dmin: 1.9 },
      { c: [0.4, 0.99, 0.02], hw: 0.53, hh: 0.36, el: 0.5, dmin: 1.55 },
      { c: [1.68, 1.2, 0], hw: 0.44, hh: 0.47, el: 0.13, dmin: 1.5 },
      { c: [1.55, 1.22, L.frontZ], hw: 1.32, hh: 1.3, el: 0.04, dmin: 3, dmax: 5.7 },
      { c: [1.55, 1.3, L.frontZ - 0.2], hw: 1.75, hh: 1.55, el: 0.03, dmin: 4.5, dmax: 7.5, out: 1 },
    ][n];
    let hw = D.hw, cx = D.c[0], cy = D.c[1];
    if (n === 2) { cx += 0.27 * this.cam.lift; hw += 0.13 * this.cam.lift; cy += 0.07 * this.cam.lift; }
    let d = Math.max(D.hh / (th * sy), hw / (th * a * sx), D.dmin); if (D.dmax) d = Math.min(d, D.dmax);
    if (a < 0.8) cy += n === 1 ? 0.05 : n === 2 ? 0.03 : 0; // 縦長では少し上を見せる
    tgt.set(cx, cy, D.c[2]);
    pos.set(cx, cy + d * Math.sin(D.el), D.c[2] + (D.out ? -1 : 1) * d * Math.cos(D.el));
  }
  updateCamera(dt) {
    const c = this.cam, n = this.station;
    c.lift += (((this.bagWhere === 'held' || this.bagWhere === 'cust') && n === 2 ? 1 : 0) - c.lift) * Math.min(1, dt * 3);
    this.stationPose(n, c.gpos, c.gtgt);
    if (n <= 1 && this.carryT > 0 && this.carryT < 1 && this.carrying) { const p = V(), t = V(); this.stationPose(0, c.gpos, c.gtgt); this.stationPose(1, p, t); const k = ease(this.carryT); c.gpos.lerp(p, k); c.gtgt.lerp(t, k); }
    c.gpos.x += c.pan; c.gtgt.x += c.pan;
    let gp = c.gpos, gt = c.gtgt;
    if (c.via.length) { gp = c.via[0].pos; gt = c.via[0].tgt; if (c.pos.distanceTo(gp) < 0.25) c.via.shift(); }
    if (c.snap) { c.pos.copy(gp); c.tgt.copy(gt); c.snap = false; }
    else { const k = 1 - Math.exp(-dt * (c.via.length ? 2.6 : 4.2)); c.pos.lerp(gp, k); c.tgt.lerp(gt, k); }
    this.camera.position.copy(c.pos); this.camera.lookAt(c.tgt);
    this.camera.updateMatrixWorld();
  }
  goStation(n, opt = {}) {
    if (n === this.station && !opt.force) return;
    this.cancelDrag && this.cancelDrag();
    this.station = n; this.S.station = n; this.cam.pan = 0; this.idle = 0; this.hintDone = false;
    if (this.S.paid && this.S.phase === 'open' && (n === 1 || n === 2)) this.slideTray(n === 1 ? 'reg' : 'bag');
    this.onStation && this.onStation(n);
    this.save();
  }
  slideTray(where) {
    if (this.trayAt === where) return; this.trayAt = where;
    const a = this.trayPos.clone(), b = where === 'bag' ? L.trayBag : L.trayReg;
    this.sound.swish();
    this.tween(0.8, (k) => { this.trayPos.lerpVectors(a, b, k); });
  }
  setShutter(v) {
    this.S.shutter = clamp(v, 0, 1);
    if (this.shutterObj) this.shutterObj.position.y = (1 - this.S.shutter) * (L.openH - 0.06);
  }
  // ---------- 毎フレーム ----------
  update(dt) {
    this.time += dt; this.idle += dt; if (this.busy > 0) this.busy -= dt;
    for (let i = this.timers.length - 1; i >= 0; i--) { const t = this.timers[i]; t.t -= dt; if (t.t <= 0) { this.timers.splice(i, 1); t.fn(); } }
    for (let i = this.tweens.length - 1; i >= 0; i--) { const t = this.tweens[i]; t.t += dt / t.dur; const k = Math.min(1, t.t); t.fn(t.ez(k), k); if (k >= 1) { this.tweens.splice(i, 1); t.done && t.done(); } }
    this.updateDrag && this.updateDrag(dt);
    this.updateLanes(dt);
    this.updateBag(dt);
    this.updateItems(dt);
    this.updateProps(dt);
    this.updateActors(dt);
    this.updateCamera(dt);
    this.updateHint(dt);
    if (this.fade !== this.fadeGoal) { this.fade += clamp(this.fadeGoal - this.fade, -dt * 2.6, dt * 2.6); this.fadeEl && (this.fadeEl.style.opacity = this.fade.toFixed(3)); }
    if (this.saveDirty) { this.saveT += dt; if (this.saveT > 0.4) { this.saveT = 0; this.flush(); } }
  }
  updateLanes(dt) {
    let roll = 0;
    for (let l = 0; l < 3; l++) {
      const arr = this.lanes[l]; let floor = 0;
      for (const it of arr) {
        if (it.mode === 'rest' || it.mode === 'lane') {
          if (it.lanePos > floor + 0.0005) {
            it.mode = 'lane'; const acc = it.type === 'apple' ? 1.5 : 0.75;
            it.laneVel += acc * dt; it.lanePos -= it.laneVel * dt;
            if (it.type === 'apple') roll = Math.max(roll, it.laneVel); else roll = Math.max(roll, it.laneVel * 0.5);
            if (it.lanePos <= floor) { it.lanePos = floor; if (it.laneVel > 0.12) { this.sound.koton(it.type, clamp(it.laneVel * 1.6, 0.25, 1)); if (it.type === 'apple' && it.laneVel > 0.3) { it.laneVel = -it.laneVel * 0.22; it.lanePos = floor + 0.001; } else it.laneVel = 0; } else it.laneVel = 0; }
          } else if (it.mode === 'lane') { if (it.laneVel < 0) { it.lanePos -= it.laneVel * dt; it.laneVel += 2.5 * dt; } else { it.lanePos = floor; it.laneVel = 0; it.mode = 'rest'; this.save(); } }
          else it.lanePos = floor;
        }
        floor += LANELEN[it.type];
      }
    }
    this.sound.setRoll(roll * 0.5);
  }
  updateItems(dt) {
    const p = this.tmp2, q = new THREE.Quaternion();
    for (const it of this.list) {
      if (it.st.loc === 'sold') { it.obj.visible = false; continue; }
      it.obj.visible = true;
      if (it.wig > 0) it.wig = Math.max(0, it.wig - dt * 2.4);
      if (it.nudge > 0) it.nudge = Math.max(0, it.nudge - dt * 0.9);
      if (it.mode === 'rest' || it.mode === 'lane') this.poseOf(it, it.pos, it.q);
      else if (it.mode === 'tween') {
        const tw = it.tw; tw.t += dt / tw.dur; const k = Math.min(1, tw.t), e = ease(k);
        this.poseOf(it, p, q); it.pos.lerpVectors(tw.p0, p, e); it.pos.y += Math.sin(Math.PI * k) * tw.arc; it.q.slerpQuaternions(tw.q0, q, e);
        if (k >= 1) { it.mode = 'rest'; it.tw = null; tw.done && tw.done(); }
      } else if (it.mode === 'body') { const zt = this.sim.anyInside(it.body) || this.overMouth(it.body) || this.bagWhere !== 'rack' ? 0 : 0.11; it.zOff += (zt - it.zOff) * Math.min(1, dt * 10); this.bodyPose(it, it.pos, it.q); }
      it.obj.position.copy(it.pos); it.obj.quaternion.copy(it.q);
      if (it.wig > 0) { it.obj.rotateZ(Math.sin(this.time * 34) * 0.07 * it.wig); it.obj.position.y += Math.abs(Math.sin(this.time * 17)) * 0.006 * it.wig; }
    }
  }
  updateProps(dt) {
    this.basket.position.copy(this.basketPos); this.tray.position.copy(this.trayPos);
    this.scanner.position.copy(this.scanPos);
    if (this.scanCool > 0) this.scanCool -= dt;
    if (this.beamT > 0) { this.beamT -= dt; const k = Math.max(0, this.beamT / 0.28); this.beam.material.opacity = k * 0.85; this.glow.material.opacity = k; this.scanner.userData.win.material.emissiveIntensity = 0.25 + k * 3; if (this.beamT <= 0) { this.beam.visible = false; this.glow.visible = false; } }
    if (this.btnDown > 0) { this.btnDown -= dt; } const cap = this.refs.btnCap; cap.position.y = 0.052 - (this.btnDown > 0 ? 0.012 : 0) * Math.min(1, this.btnDown * 20 + 0.2);
    // コード
    const a = V(L.scanner.x, L.counterY + 0.012, L.scanner.z - 0.05), b = this.scanner.localToWorld(V(0, -0.14, -0.045));
    if (!this.cableEnd || this.cableEnd.distanceToSquared(b) > 1e-6) {
      this.cableEnd = b.clone(); const pts = [], slack = Math.max(0.02, 0.2 - a.distanceTo(b) * 0.25);
      for (let i = 0; i <= 10; i++) { const t = i / 10, p = V().lerpVectors(a, b, t); p.y -= Math.sin(Math.PI * t) * slack; p.y = Math.max(p.y, L.counterY + 0.006); const cw = Math.sin(t * 40) * 0.006 * Math.sin(Math.PI * t); p.x += cw; pts.push(p); }
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0035, 5); this.cable.geometry.dispose(); this.cable.geometry = g;
    }
  }
  updateBag(dt) {
    const sim = this.sim, held = this.sim.bodies.some((b) => b.held);
    if (this.simAwake > 0 || held || this.bagWhere !== 'rack' || this.drag) {
      sim.step(dt); this.simAwake -= dt;
      if (sim.rustle > 0.03) this.simAwake = Math.max(this.simAwake, 0.8);
      for (const b of sim.bodies) if (Math.hypot(b.vx, b.vy) > 0.02) { this.simAwake = Math.max(this.simAwake, 0.6); break; }
      this.bagView.update(dt);
      this.sound.setRustle(clamp((sim.rustle - 0.06) * 0.35, 0, 0.2));
      if (sim.thump > 0.9 && this.time - (this.lastThump || 0) > 0.12) { this.lastThump = this.time; this.sound.koton('apple', clamp(sim.thump * 0.16, 0.1, 0.6)); }
      this.afterBagStep(dt);
    } else this.sound.setRustle(0);
    this.bagGroup.position.set(L.rack.x, L.rack.y, L.rack.z + this.bagZ);
    this.bagGroup.visible = this.bagWhere !== 'gone';
  }
  hidden() { this.cancelDrag && this.cancelDrag(); this.flush(); this.sound.quiet(); }
  resize(w, h, insets) { this.vw = w; this.vh = h; this.insets = insets; this.cancelDrag && this.cancelDrag(); }
}
export { QX, QY, QZ, SLOT, SHAPES };
