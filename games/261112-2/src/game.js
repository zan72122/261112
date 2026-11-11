// 遊びの中核: 指の入力、つかむ対象、場面と段階、お手本の指、寝かしつけとはなまる
import * as THREE from 'three';
import { L, ground, insideDist, clampToTub, inBed } from './layout.js';
import { clamp, sat, damp, lerp } from './util.js';
import { saveState } from './save.js';

const T = L.TOWEL, B = L.BED;
export class Game {
  constructor(G) {
    this.G = G; this.stage = 1; this.cardDone = false; this.cardT = 0; this.cycles = 0; this.drag = null; this.ptr = { x: 0, y: 0 }; this.idle = 0; this.hint = null; this.hintWait = 4; this.hintCount = 0;
    this.strokeDist = 0; this.strokeSp = 0; this.kidFloatT = 0; this.parentCarried = false; this.bedT = 0; this.stamp = null; this.dirty = false; this.saveT = 0; this.dripT = 2.5; this.patT = 1.5; this.sloshT = 0; this.towelWig = 0; this.autoScene = null; this.deckSeen = false; this.madeBase = 0;
    this.ray = new THREE.Raycaster(); this.v = new THREE.Vector3(); this.v2 = new THREE.Vector3(); this.v3 = new THREE.Vector3(); this.ndc = new THREE.Vector2();
    this.hand = document.getElementById('hand'); this.disc = {}; this.time = 0;
    const c = G.canvas; const opt = { passive: false };
    c.addEventListener('pointerdown', (e) => this.onDown(e), opt); c.addEventListener('pointermove', (e) => this.onMove(e), opt);
    const up = (e) => this.onUp(e, false), cancel = (e) => this.onUp(e, true);
    c.addEventListener('pointerup', up, opt); c.addEventListener('pointercancel', cancel, opt); c.addEventListener('lostpointercapture', cancel, opt);
    for (const ev of ['contextmenu', 'gesturestart', 'gesturechange', 'gestureend', 'selectstart', 'dragstart']) document.addEventListener(ev, (e) => { if (e.cancelable) e.preventDefault(); }, opt);
    document.addEventListener('touchmove', (e) => { if (e.cancelable) e.preventDefault(); }, opt); document.addEventListener('touchstart', (e) => { if (e.touches.length > 1 && e.cancelable) e.preventDefault(); }, opt);
    let lastTap = 0; document.addEventListener('touchend', (e) => { const n = performance.now(); if (n - lastTap < 350 && e.cancelable) e.preventDefault(); lastTap = n; }, opt);
    document.addEventListener('wheel', (e) => { if (e.cancelable) e.preventDefault(); }, opt);
  }

  // ---- 座標変換 ----
  project(p, out) { const G = this.G; this.v3.copy(p).project(G.camera); out.x = (this.v3.x * 0.5 + 0.5) * G.w; out.y = (-this.v3.y * 0.5 + 0.5) * G.h; out.z = this.v3.z; return out; }
  pxPerM(p) { const G = this.G; const a = this.project(p, {}); this.v2.copy(p); this.v2.x += 0.1; const b = this.project(this.v2, {}); return Math.hypot(b.x - a.x, b.y - a.y) * 10; }
  setRay(x, y) { const G = this.G; this.ndc.set((x / G.w) * 2 - 1, -(y / G.h) * 2 + 1); this.ray.setFromCamera(this.ndc, G.camera); return this.ray.ray; }
  planeY(x, y, py, out) { const r = this.setRay(x, y); if (Math.abs(r.direction.y) < 1e-5) return null; const t = (py - r.origin.y) / r.direction.y; if (t < 0) return null; return out.copy(r.origin).addScaledVector(r.direction, t); }
  planeZ(x, y, pz, out) { const r = this.setRay(x, y); if (Math.abs(r.direction.z) < 1e-5) return null; const t = (pz - r.origin.z) / r.direction.z; if (t < 0) return null; return out.copy(r.origin).addScaledVector(r.direction, t); }

  // ---- つかめる物 ----
  targets() {
    const G = this.G, t = G.tools, list = []; const add = (name, pos, r, locked) => { const s = this.project(pos, {}); list.push({ name, x: s.x, y: s.y, r, locked: !!locked }); };
    add('handle', t.handleTip(this.v), 48, false); add('ring', t.ringPos(this.v), 46, this.stage < 4); add('shower', t.showerGrip(this.v), 50, this.stage < 3);
    for (const side of [0, 1]) { G.towel.corner(side, this.v); add('towel' + side, this.v, 46, this.stage < 4); }
    for (const d of G.ducks) { const ppm = this.pxPerM(d.center); add(d.kind, d.center, Math.max(40, d.S.len * 1.05 * ppm), false); }
    return list;
  }
  pick(x, y) {
    let best = null, bs = 1; for (const c of this.targets()) { const s = Math.hypot(c.x - x, c.y - y) / c.r * (c.name === 'parent' || c.name === 'kid' ? 0.85 : 1); if (s < bs) { bs = s; best = c; } }
    if (best) return best;
    const W = this.G.water; const p = this.planeY(x, y, W.level, this.v); if (p && insideDist(p.x, p.z) > 0.012 && W.level > ground(p.x, p.z) + 0.004) return { name: 'water', wx: p.x, wz: p.z };
    return null;
  }
  duckBy(name) { return this.G.ducks[name === 'parent' ? 0 : 1]; }

  // ---- ポインタ ----
  onDown(e) {
    if (e.cancelable) e.preventDefault(); const G = this.G; G.audio.start(); this.touched(); if (this.stamp) return;
    if (this.drag) return; // 二本目の指は無視
    const x = e.clientX, y = e.clientY; this.ptr.x = x; this.ptr.y = y; const hit = this.pick(x, y); if (!hit) return;
    if (hit.locked) { // まだ先の道具は小さく揺れるだけ
      if (hit.name === 'ring') G.tools.ringWiggle = 0.5; else if (hit.name === 'shower') G.tools.sh.wiggle = 0.5; else this.towelWig = 0.4; G.audio.tok(); return; }
    try { G.canvas.setPointerCapture(e.pointerId); } catch (err) { /* 続行 */ }
    const d = (this.drag = { kind: hit.name, id: e.pointerId, x0: x, y0: y, lx: x, ly: y, t0: this.time, moved: 0 });
    if (hit.name === 'handle') { this.scene(1); G.audio.squeak(); }
    else if (hit.name === 'ring') { const p = this.planeZ(x, y, L.RING.z, this.v); d.off = p ? p.y - G.tools.ringH : 0; this.scene(4); G.audio.squeak(); }
    else if (hit.name === 'shower') { G.tools.grabShower(); this.scene(3); }
    else if (hit.name === 'towel0' || hit.name === 'towel1') { G.towel.grabCorner(hit.name === 'towel1' ? 1 : 0); this.scene(5); }
    else if (hit.name === 'parent' || hit.name === 'kid') { const dk = this.duckBy(hit.name); dk.prevMode = dk.mode; d.from = dk.mode; dk.grab(); if (d.from === 'tub' && this.stage >= 3) this.scene(this.rigScene() >= 4 ? 4 : 3); this.dragDuck(dk, 0.016); }
    else if (hit.name === 'water') { const W = G.water; W.impulse(hit.wx, hit.wz, -2.4, 0.04); G.audio.plink(0.9, 0.2); d.wx = hit.wx; d.wz = hit.wz; if (this.stage >= 2) this.scene(2); }
  }
  onMove(e) {
    const d = this.drag; if (!d || e.pointerId !== d.id) return; if (e.cancelable) e.preventDefault(); const x = e.clientX, y = e.clientY; const dx = x - d.lx, dy = y - d.ly; d.moved += Math.hypot(dx, dy); this.ptr.x = x; this.ptr.y = y; this.touched();
    const G = this.G;
    if (d.kind === 'handle') { const lp = Math.max(60, this.pxPerM(G.tools.handleTip(this.v)) * 0.105); const o0 = G.tools.open; G.tools.setOpen(o0 + (-dx + dy * 0.5) / (lp * 1.6)); if (Math.abs(G.tools.open - o0) > 0.002 && Math.random() < 0.15) G.audio.squeak(); }
    else if (d.kind === 'ring') { const p = this.planeZ(x, y, L.RING.z, this.v); if (p) { G.tools.setRing(p.y - d.off); G.tools.chainDirty = true; } }
    d.lx = x; d.ly = y;
  }
  onUp(e, cancelled) {
    const d = this.drag; if (!d || e.pointerId !== d.id) return; this.endDrag(cancelled);
  }
  // つかみを離す(復帰時や回転時にも使う)
  endDrag(cancelled) {
    const d = this.drag; if (!d) return; this.drag = null; const G = this.G; try { G.canvas.releasePointerCapture(d.id); } catch (err) { /* 続行 */ }
    const tap = !cancelled && this.time - d.t0 < 0.35 && d.moved < 10;
    if (d.kind === 'handle') { if (tap) G.tools.tapFaucet(); if (this.stage >= 3) this.auto(this.stage >= 4 ? 4 : 3, 2.2); }
    else if (d.kind === 'ring') { if (tap) G.tools.tapRing(); }
    else if (d.kind === 'shower') { G.tools.releaseShower(); }
    else if (d.kind === 'towel0' || d.kind === 'towel1') G.towel.release();
    else if (d.kind === 'parent' || d.kind === 'kid') this.dropDuck(this.duckBy(d.kind), d);
    this.dirty = true;
  }
  touched() { this.idle = 0; if (this.hint) this.hint.stop = true; }

  // ---- あひるを運ぶ ----
  dragDuck(dk, dt) {
    const G = this.G; const over = dk.z < -0.34; const baseY = (over ? 0.085 : Math.max(G.water.level, -0.02) + 0.075) + dk.S.legLen * 0.5; const p = this.planeY(this.ptr.x, this.ptr.y, baseY + dk.S.axisY * 0.6, this.v); if (!p) return;
    let x = clamp(p.x, -0.72, 0.8), z = clamp(p.z - dk.S.axisY * 0.25, -0.78, 0.4);
    // 蛇口をよける
    const F = L.FAUCET; const cz = clamp(z, F.z - 0.02, F.z + 0.34), ex = x - F.x, ez = z - cz, dd = Math.hypot(ex, ez), min = 0.05 + dk.S.wid; if (dd < min) { const k = min / (dd || 0.001); x = F.x + (dd ? ex : 1) * k; z = cz + ez * k; }
    dk.moveHeld(x, baseY, z, dt);
    // 画面の端へ運ぶと、その先の場所が見える
    const fy = this.ptr.y / G.h; const rs = this.rigScene();
    if (this.stage >= 4) { if (rs < 4 && (fy < 0.3 || z < -0.3)) this.scene(4); else if (rs === 5 && fy > 0.74) this.scene(4); }
  }
  dropDuck(dk, d) {
    const G = this.G; let x = dk.x, z = dk.z, mode = 'tub';
    const deckSide = z < -0.345 && x > T.x0 - 0.2;
    if (this.stage >= 5 && (inBed(x, z, 0.08) || (deckSide && x > (T.x1 + B.x - B.rx) / 2 + 0.02))) { mode = 'bed'; const ex = (x - B.x) / (B.rx * 0.5), ez = (z - B.z) / (B.rz * 0.45); const e = Math.hypot(ex, ez); if (e > 1) { x = B.x + (x - B.x) / e; z = B.z + (z - B.z) / e; } }
    else if (this.stage >= 4 && deckSide) { mode = 'deck'; x = clamp(x, T.x0 + 0.04, T.x1 - 0.04); z = clamp(z, -0.72, -0.48); }
    else { const q = clampToTub(x, z, dk.S.wid + 0.02); x = q[0]; z = q[1]; }
    dk.release(mode, x, z);
    if (mode === 'tub') { if (dk.kind === 'parent' && this.stage === 2) this.parentCarried = true; if (this.cardDone) { this.cardDone = false; this.G.env.card.draw(0); } if (this.stage >= 3) this.scene(3); }
    else { G.audio.pat(dk.kind === 'kid' ? 1.5 : 1, false); dk.wag = 0.7; const inTubN = G.ducks.filter((q) => q.mode === 'tub').length; this.scene(inTubN ? 4 : 5); }
    G.audio.voice(dk.kind, 0.6);
  }
  rigScene() { return this.G.rig.scene; }
  scene(n) { this.autoScene = null; this.G.rig.setScene(n); }

  // ---- 毎ステップ ----
  step(dt) {
    const G = this.G, W = G.water, d = this.drag, tl = G.tools; this.time += dt;
    if (d) {
      if (d.kind === 'parent' || d.kind === 'kid') this.dragDuck(this.duckBy(d.kind), dt);
      else if (d.kind === 'shower') { const p = this.planeY(this.ptr.x, this.ptr.y, 0.3, this.v); if (p) tl.moveShower(p.x, p.z, dt); }
      else if (d.kind === 'towel0' || d.kind === 'towel1') { const p = this.planeY(this.ptr.x, this.ptr.y, 0.12, this.v); if (p) G.towel.moveGrab(p.x, 0.12, p.z); }
      else if (d.kind === 'water') { const p = this.planeY(this.ptr.x, this.ptr.y, W.level, this.v);
        if (p && insideDist(p.x, p.z) > 0.004) { // なめらかに追う点の速さで水を押す(指の報告間隔に左右されない)
          const k = 1 - Math.exp(-16 * dt); const nx = d.wx + (p.x - d.wx) * k, nz = d.wz + (p.z - d.wz) * k; const vx = clamp((nx - d.wx) / dt, -1.3, 1.3), vz = clamp((nz - d.wz) / dt, -1.3, 1.3); const sp = Math.hypot(vx, vz);
          if (sp > 0.02 && W.level > ground(nx, nz) + 0.004) { W.push(nx, nz, vx * 0.85, vz * 0.85, 0.085, Math.min(1, dt * 22)); W.dipole(nx, nz, vx, vz, Math.min(2.6, sp * 3.2), 0.034); this.strokeDist += sp * dt; }
          this.strokeSp = damp(this.strokeSp, sp, 12, dt); d.wx = nx; d.wz = nz; } }
    }
    if (!d || d.kind !== 'water') this.strokeSp = damp(this.strokeSp, 0, 8, dt);
    if (this.towelWig > 0) { this.towelWig -= dt; const tw = G.towel; const k = ((CLOTH_LAST(tw)) + 0) * 3; tw.p[k + 1] += Math.sin(this.time * 40) * 0.0015; }
    this.progress(dt);
  }

  progress(dt) {
    const G = this.G, W = G.water, [parent, kid] = G.ducks, tl = G.tools;
    // 段階の解放(時間ではなく、起きた事で進む)
    if (this.stage === 1) { if (kid.floating && kid.mode === 'tub') this.kidFloatT += dt; if (this.kidFloatT > 0.6) { this.setStage(2); this.auto(2, 0.6); } }
    else if (this.stage === 2) { if (this.strokeDist > 1.1 || (W.made || 0) - this.madeBase > 14 || this.parentCarried) { this.setStage(3); this.auto(3, 0.5); } }
    else if (this.stage === 3) { if (tl.sh.used > 2.0) { this.setStage(4); this.auto(4, 0.8); } }
    else if (this.stage === 4) { if (G.ducks.some((q) => q.mode === 'deck')) this.setStage(5); }
    if (this.autoScene && !this.drag) { this.autoScene.t -= dt; if (this.autoScene.t <= 0) { const n = this.autoScene.n; this.autoScene = null; G.rig.setScene(n); } }
    // 発見の記録(検証と保存用。採点には使わない)
    const D = this.disc;
    if (kid.floating && kid.x < L.STEP_X0) D.floatOnStep = true; if (D.floatOnStep && !kid.floating && kid.mode === 'tub' && kid.x < L.STEP_X0 && W.drainQ > 0) D.standAgain = true;
    if (W.spill > 0.3) D.spill = true; if (W.sucked > 0) D.sucked = true;
    // 寝かしつけ
    const both = parent.mode === 'bed' && kid.mode === 'bed'; this.bedT = both ? this.bedT + dt : 0;
    for (const q of G.ducks) { q.sleepy = both && this.bedT > 1.8; q.asleep = damp(q.asleep, q.sleepy ? 1 : 0, q.sleepy ? 0.9 : 6, dt); }
    if (both && this.bedT > 0.3 && this.rigScene() !== 5 && !this.drag) G.rig.setScene(5);
    if (both && parent.asleep > 0.93 && !this.cardDone && !this.stamp && !this.drag) { this.stamp = { t: 0 }; this.cardDone = true; this.cycles++; this.dirty = true; }
    if (this.stamp) { const s = this.stamp; s.t += dt; if (s.t > 0.9 && !s.rung) { s.rung = true; G.audio.chime(); } const k = sat((s.t - 0.9) / 1.3); if (s.t > 0.9 && k !== s.k) { s.k = k; if (!s.last || k - s.last > 0.04 || k === 1) { s.last = k; G.env.card.draw(k); } } if (s.t > 3.1) this.stamp = null; }
    // 水が縁へ乗る音
    this.sloshT -= dt; if (W.spillPeak > 0.35 && this.sloshT <= 0) { G.audio.slosh(W.spillPeak); this.sloshT = 1.6; }
    // 最初のひと押し: 蛇口のしずくと、子の足ぶみ
    if (this.stage === 1 && tl.open < 0.02) { this.dripT -= dt; if (this.dripT < 0) { this.dripT = 3.2 + Math.random() * 1.5; W.drop(G.env.outlet.x, G.env.outlet.y - 0.004, G.env.outlet.z, 0, 0, 0, 0.0042, 1); this.dripSound = 0.21; } }
    if (this.dripSound > 0) { this.dripSound -= dt; if (this.dripSound <= 0) G.audio.plink(1.3, 0.14); }
    if (this.stage === 1 && kid.mode === 'tub' && !kid.floating && !kid.walk) { this.patT -= dt; if (this.patT < 0) { this.patT = 2.6 + Math.random() * 1.8; kid.patter = 0.7; this.patN = 4; this.patC = 0; } if (kid.patter > 0) { this.patC -= dt; if (this.patC <= 0 && this.patN > 0) { this.patC = 0.16; this.patN--; G.audio.pat(1.7, true); W.impulse(kid.x, kid.z, -0.5, 0.025); } } }
    G.lookAt = this.stage === 1 ? tl.handleTip(this._look || (this._look = new THREE.Vector3())) : null;
    // 音の連続成分
    const A = G.audio; if (A.ok) { const fl = tl.flow; const dep = sat((W.level - L.DEEP) / 0.34); A.set('faucet', fl * fl * 0.22 + fl * 0.05, 1200 + fl * 900); A.set('fill', fl * 0.16, 300 + dep * 520);
      A.set('shower', tl.sh.held ? tl.sh.on * 0.11 : 0); A.set('drain', sat(W.drainQ / 0.009) * 0.3, 200 + (1 - dep) * 260); A.set('over', sat(W.overQ / 0.004) * 0.07); A.set('swish', sat(this.strokeSp / 0.8) * 0.2, 600 + this.strokeSp * 700);
      A.set('rub', G.towel.grab >= 0 && G.towel.contact > 0 ? sat(G.towel.rub / 0.5) * 0.09 : 0); A.set('breath', parent.asleep > 0.6 ? (0.5 + 0.5 * Math.sin(this.time * 1.9)) * 0.035 : 0); }
    // 保存
    this.saveT += dt; if (this.dirty && this.saveT > 2.5 && !this.drag) { this.saveT = 0; this.dirty = false; saveState(G); } if (this.saveT > 12) { this.saveT = 0; saveState(G); }
    // お手本の指
    this.idle += dt; this.updateHint(dt);
  }
  setStage(n) { if (n > this.stage) { this.stage = n; this.dirty = true; this.hintWait = 4; this.hintCount = 0; if (n === 2) { this.madeBase = this.G.water.made || 0; this.strokeDist = 0; } if (n === 3) this.G.tools.sh.wiggle = 0.6; if (n === 4) { this.G.tools.ringWiggle = 0.7; } } }
  auto(n, t) { this.autoScene = { n, t }; }

  // ---- お手本 ----
  hintPlan() {
    const G = this.G, W = G.water, tl = G.tools, [parent, kid] = G.ducks; const mk = (kind, pts, scene) => ({ kind, pts, scene });
    if (this.stamp) return null; const inTub = G.ducks.filter((q) => q.mode === 'tub'), onDeck = G.ducks.filter((q) => q.mode === 'deck'), inBedN = G.ducks.filter((q) => q.mode === 'bed').length;
    const wet = (q) => q.wetTotal() > 0.12;
    if (inBedN === 2) return this.idle > 14 && this.cardDone ? mk('duck', [parent.center.clone(), new THREE.Vector3(0.1, 0.1, 0.0)], 4) : null;
    if (this.stage === 1 || (inTub.length && W.level < L.STEP - 0.02 && tl.open < 0.05 && tl.ringH < 0.02 && this.stage < 4)) { const a = [], o = tl.open; for (let i = 0; i <= 6; i++) a.push(tl.handleTip(new THREE.Vector3(), o < 0.5 ? o + i / 6 * 0.5 : o - i / 6 * 0.5)); return mk('handle', a, 1); }
    if (this.stage === 2) { let cx = 0, cz = 0, n = 0; for (let k = 0; k < W.fn; k++) if (!W.ftmp[k]) { cx += W.fx[k]; cz += W.fz[k]; n++; } if (n) { cx /= n; cz /= n; } else { cx = 0.1; cz = -0.1; } const y = W.level; cx = clamp(cx, -0.1, 0.36);
      return mk('water', [new THREE.Vector3(cx + 0.1, y, Math.min(0.2, cz + 0.22)), new THREE.Vector3(cx + 0.09, y, cz + 0.08), new THREE.Vector3(cx + 0.07, y, -0.25)], 2); }
    if (this.stage === 3) { const p = parent.mode === 'tub' ? parent : kid; const tx = clamp(p.x + 0.3, -0.3, 0.5); return mk('shower', [tl.showerGrip(new THREE.Vector3()), new THREE.Vector3(tx + 0.15, 0.3, p.z - 0.1), new THREE.Vector3(tx, 0.3, p.z + 0.02)], 3); }
    if (this.stage >= 4) {
      if (inTub.length && W.level > L.DEEP + 0.07 && tl.ringH < 0.03 && this.stage === 4) { const a = tl.ringPos(new THREE.Vector3()); return mk('ring', [a, a.clone().setY(a.y + 0.1)], 4); }
      if (onDeck.length && onDeck.some(wet) && this.hintCount < 2) { const q = onDeck.find(wet); const side = q.x > T.cx ? 1 : 0; const c = G.towel.corner(side, new THREE.Vector3()); return mk('towel', [c, new THREE.Vector3(q.x, q.y + 0.2, q.z + 0.05), new THREE.Vector3(q.x + (side ? -0.1 : 0.1), q.y + 0.16, q.z - 0.08)], 5); }
      if (onDeck.length && this.stage >= 5) { const q = onDeck[0]; return mk('duck', [q.center.clone(), new THREE.Vector3(B.x - 0.03, 0.12, B.z + 0.02)], 5); }
      if (inTub.length) { const q = inTub.includes(kid) ? kid : parent; return mk('duck', [q.center.clone(), new THREE.Vector3(T.cx, 0.12, T.cz)], 4); }
    }
    return null;
  }
  updateHint(dt) {
    const G = this.G; const hand = this.hand;
    if (this.stamp) { // はなまるを押す手
      const s = this.stamp; const c = this.project(this.v.copy(G.env.cardMesh.position), {}); const a = sat(s.t / 0.25) * sat((3.1 - s.t) / 0.4); const k = sat(s.t / 0.9); const e = 1 - Math.pow(1 - k, 3);
      const sx = lerp(G.w * 0.5, c.x, e), sy = lerp(G.h * 1.05, c.y, e); const press = s.t > 0.75 && s.t < 1.1 ? 0.88 : 1; const wob = s.t > 0.9 && s.t < 2.2 ? Math.sin((s.t - 0.9) * 9) * 9 : 0;
      this.setHand(sx + wob, sy + (s.t > 0.9 && s.t < 2.2 ? Math.cos((s.t - 0.9) * 9) * 6 : 0), a, press); return; }
    if (!this.hint) {
      if (this.drag || this.idle < this.hintWait || G.rig.moving()) { this.setHand(0, 0, 0, 1); return; }
      const plan = this.hintPlan(); if (!plan) { this.setHand(0, 0, 0, 1); return; }
      if (plan.scene && plan.scene !== this.rigScene()) { G.rig.setScene(plan.scene); return; }
      this.hint = { plan, t: 0, stop: false }; this.hintCount++;
    }
    const h = this.hint; h.t += dt; const dur = 2.1; const u = sat((h.t - 0.35) / 1.3); const e = u * u * (3 - 2 * u); const pts = h.plan.pts; const f = e * (pts.length - 1); const i = Math.min(pts.length - 2, Math.floor(f)); this.v.lerpVectors(pts[i], pts[i + 1], f - i);
    const s = this.project(this.v, {}); let a = sat(h.t / 0.3) * sat((dur - h.t) / 0.35); if (h.stop) { h.fade = (h.fade === undefined ? a : h.fade) - dt * 6; a = Math.max(0, h.fade); }
    this.setHand(s.x, s.y, a * 0.92, h.t > 0.3 && h.t < 1.75 ? 0.92 : 1);
    if (h.t > dur || (h.stop && a <= 0)) { this.hint = null; this.idle = 0; this.hintWait = h.stop ? 4 : 7.5; }
  }
  setHand(x, y, a, sc) { const st = this.hand.style; if (a <= 0.001) { if (this._handOn) { st.opacity = 0; this._handOn = false; } return; } this._handOn = true; st.opacity = a.toFixed(3); st.transform = `translate(${(x - 30).toFixed(1)}px,${(y - 8).toFixed(1)}px) rotate(-12deg) scale(${sc})`; }
}
function CLOTH_LAST(tw) { return tw.n - 1; }
