// Washing machine: program driven by one plain knob, rotating-frame drum cloth physics,
// heightfield water with ripples, suds, window drops, water extraction.
import * as THREE from 'three';
import { L } from './world.js';
import { H, ITER, repel } from './sim.js';
import { clamp, lerp } from './util.js';

const NXW = 26, NZW = 6, YS0 = -L.drum.R, WDEPTH = 0.19;
export const ZONES = { off: 0.07, wash: 0.40, rinse: 0.56 };

export class Washer {
  constructor(G) {
    this.G = G; const W = G.W;
    this.door = 1; this.doorTarget = 1; this.latched = false;
    this.knob = 0; this.knobVis = 0; this.omega = 0; this.theta = 0; this.water = 0;
    this.rinsed = true; this.rinseT = 0; this.suds = 0; this.murk = 0; this.reqOpen = false; this.zone = 'off';
    this.fillRate = 0; this.drainRate = 0; this.extract = 0; this.wiggle = 0; this.handleWig = 0; this.tickV = 0;
    this.frame = new THREE.Matrix4(); this.inv = new THREE.Matrix4();
    // water heightfield
    this.h = new Float32Array(NXW * NZW); this.v = new Float32Array(NXW * NZW);
    const nv = NXW * NZW + NXW * 2, pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = [];
    for (let j = 0; j < NZW - 1; j++) for (let i = 0; i < NXW - 1; i++) { const a = j * NXW + i; idx.push(a, a + NXW, a + 1, a + 1, a + NXW, a + NXW + 1); }
    const o = NXW * NZW; for (let i = 0; i < NXW - 1; i++) { const a = o + i * 2; idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage)); g.setIndex(idx);
    this.wmat = new THREE.MeshStandardMaterial({ color: 0x9cc4d6, roughness: 0.06, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.6 });
    this.wmesh = new THREE.Mesh(g, this.wmat); this.wmesh.frustumCulled = false; this.wmesh.visible = false; this.wmesh.renderOrder = 5; G.scene.add(this.wmesh);
    this.wpos = pos; this.wnor = nor;
    // suds
    this.NB = G.low ? 70 : 150;
    this.bub = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18, transparent: true, opacity: 0.86, envMapIntensity: 1.5 }), this.NB);
    this.bub.frustumCulled = false; this.bub.count = 0; this.bub.renderOrder = 5; G.scene.add(this.bub);
    this.bd = new Float32Array(this.NB * 5); for (let i = 0; i < this.NB; i++) this._bubble(i, true);
    this._m = new THREE.Matrix4(); this._v = new THREE.Vector3(); this._s = new THREE.Vector3(); this._q = new THREE.Quaternion();
  }
  _bubble(i, init) { const d = this.bd, a = i * 5; d[a] = Math.random() * 2 - 1; d[a + 1] = Math.random() < 0.55 ? 1 : Math.random(); d[a + 2] = 0.004 + Math.random() * 0.009; d[a + 3] = Math.random(); d[a + 4] = init ? Math.random() * 3 : 1.5 + Math.random() * 3; }

  get locked() { return this.latched; }
  running() { return this.latched && (this.zone !== 'off' || Math.abs(this.omega) > 0.05 || this.water > 0.01); }

  // ---- user actions ----
  turnKnob(dv) {
    if (!this.latched || this.reqOpen) { this.wiggle = clamp(this.wiggle + dv, -0.05, 0.06); return false; }
    const old = this.knob; this.knob = clamp(this.knob + dv, 0, 1);
    if (Math.floor(this.knob * 22) !== Math.floor(old * 22)) this.G.audio.play('tick');
    return true;
  }
  pressHandle() {
    const G = this.G;
    if (this.door > 0.5 && this.doorTarget === 1) { this.closeDoor(); return; }
    if (this.latched) { this.reqOpen = true; G.audio.play('click'); }
  }
  closeDoor() {
    const G = this.G; this.doorTarget = 0; G.audio.play('soft');
    // anything still on its way in is tucked inside
    for (const c of G.list) if (c.loc === 'drum') { c.insert = 0; c.stuck = 0; for (let k = 0; k < c.n; k++) if (c.active[k] && (c.p[k * 3 + 2] > L.drum.zf - 0.03 || Math.hypot(c.p[k * 3] - L.drum.cx, c.p[k * 3 + 1] - L.drum.cy) > L.drum.R)) c.setPos(k, (Math.random() - 0.5) * 0.2, L.drum.cy - 0.12 + Math.random() * 0.06, -0.05 + Math.random() * 0.15); }
  }
  _latch() {
    const G = this.G; this.latched = true; G.audio.play('clack');
    this.inv.makeRotationZ(-this.theta).multiply(new THREE.Matrix4().makeTranslation(-L.drum.cx, -L.drum.cy, 0));
    for (const c of G.list) if (c.loc === 'drum') { c.transform(this.inv); c.frame = this.frame; c.stickT = 0; c.onWall = false; }
    G.onProgress('closed');
  }
  _unlatch() {
    const G = this.G; this.latched = false; this._frame();
    for (const c of G.list) if (c.loc === 'drum' && c.frame) { c.transform(this.frame); c.frame = null; c.stop(); if (c.stickT > 1.2) { c.stuck = 1; c.stuckPos = c.p.slice(); } }
    G.audio.play('clack'); G.onProgress('opened');
  }
  _frame() { this.frame.makeRotationZ(this.theta); this.frame.elements[12] = L.drum.cx; this.frame.elements[13] = L.drum.cy; }

  // ---- per-frame ----
  update(dt) {
    const G = this.G, W = G.W, au = G.audio;
    // door
    const prevDoor = this.door;
    if (this.door !== this.doorTarget) {
      if (this.doorTarget === 1 && this.latched) this._unlatch();
      this.door = clamp(this.door + Math.sign(this.doorTarget - this.door) * dt * 1.6, 0, 1);
      if (this.door === 0 && prevDoor > 0) this._latch();
    }
    const e = this.door * this.door * (3 - 2 * this.door);
    W.door.rotation.y = e * 2.0;
    this.handleWig *= Math.exp(-dt * 8);
    W.handle.rotation.z = Math.sin(G.time * 40) * this.handleWig * 0.25;

    // program
    const k = this.knob; let zone = 'off';
    if (this.latched) zone = k < ZONES.off ? 'off' : k < ZONES.wash ? 'wash' : k < ZONES.rinse ? 'rinse' : 'spin';
    if (this.reqOpen) zone = 'stop';
    if (zone !== this.zone) { if (zone === 'rinse' && this.zone === 'wash') this.rinseT = 0; if (zone === 'wash') G.onProgress('washing'); if (zone === 'spin') G.onProgress('spin'); this.zone = zone; }
    let omT = 0; this.fillRate = 0; this.drainRate = 0; let spray = false;
    if (zone === 'wash') { this.rinsed = false; if (this.water < 1) { this.fillRate = 0.26; } omT = 4.6; }
    else if (zone === 'rinse') { omT = 3.4; if (!this.rinsed) { if (this.water > 0.0005) { this.rinseT += dt; if (this.rinseT < 1.7) spray = true; else this.drainRate = 0.5; } else { this.rinsed = true; this.water = 0; } } }
    else if (zone === 'spin') { if (this.water > 0.0005) { this.drainRate = 0.6; omT = 3.4; } else { this.rinsed = true; this.water = 0; omT = lerp(5.3, 14, (k - ZONES.rinse) / (1 - ZONES.rinse)); } }
    else if (zone === 'stop') {
      omT = 0; if (this.water > 0) this.drainRate = 0.8;
      this.knob = Math.max(0, this.knob - dt * 0.9);
      if (Math.abs(this.omega) < 0.12 && this.water <= 0.001 && this.knob <= 0.001) { this.reqOpen = false; this.doorTarget = 1; this.rinsed = true; }
    }
    this.water = clamp(this.water + (this.fillRate - this.drainRate) * dt, 0, 1);
    if (spray) { this.suds = Math.max(0, this.suds - dt * 0.7); this.murk = Math.max(0, this.murk - dt * 0.7); }
    if (this.drainRate > 0) { this.suds = Math.max(0, this.suds - dt * 0.25); }
    if (this.water <= 0.001) { this.murk = 0; this.suds = Math.max(0, this.suds - dt * 0.6); }
    const acc = omT > this.omega ? 5.0 : 4.2;
    this.omega += clamp(omT - this.omega, -acc * dt, acc * dt);
    this.theta += this.omega * dt; if (this.theta > 1e4) this.theta -= Math.PI * 2 * 1000;
    W.drum.rotation.z = this.theta; this._frame();
    W.led.material.emissiveIntensity = this.latched && zone !== 'off' ? 2.2 : 0;

    // knob visual
    this.wiggle *= Math.exp(-dt * 9);
    this.knobVis = this.knob + this.wiggle;
    W.knob.rotation.z = 2.44 - this.knobVis * 4.88;

    // cloth <-> water / spin
    let extracted = 0, removed = 0, agit = 0;
    const ys = YS0 + this.water * WDEPTH, sn = Math.sin(this.theta), cs = Math.cos(this.theta), om = Math.abs(this.omega);
    const fl = om > 6 ? lerp(0.85, 0.3, clamp((om - 6) / 8, 0, 1)) : 2, rate = 0.35 + 0.13 * Math.max(0, om - 6);
    for (const c of G.list) {
      if (c.loc !== 'drum' || !c.frame) continue;
      let wall = 0, cnt = 0;
      for (let i = 0; i < c.n; i++) {
        if (!c.active[i]) continue; cnt++;
        const a = i * 3, x = c.p[a], y = c.p[a + 1], yw = x * sn + y * cs;
        if (Math.hypot(x, y) > L.drum.R - 0.075) wall++;
        if (this.water > 0.03 && yw < ys + 0.01) {
          if (c.wetF[i] < 1) { c.wetF[i] = Math.min(1, c.wetF[i] + dt * 5); c.wetB[i] = Math.min(1, c.wetB[i] + dt * 5); }
          if (zone === 'wash' && om > 2 && c.dirt[i] > 0) { const d = Math.min(c.dirt[i], dt * 0.2); c.dirt[i] -= d; removed += d; }
          const sp = Math.hypot(c.p[a] - c.q[a], c.p[a + 1] - c.q[a + 1]) / H;
          if (Math.abs(yw - ys) < 0.03 && sp > 0.6 && agit < 5) { agit++; this.poke((x * cs - y * sn), c.p[a + 2], -sp * 0.012); }
        } else if (this.water > 0.03 && zone === 'wash' && c.wetF[i] > 0.5 && c.dirt[i] > 0) { const d = Math.min(c.dirt[i], dt * 0.06); c.dirt[i] -= d; removed += d; }
        if (this.water < 0.03 && om > 6) {
          if (c.wetF[i] > fl) { const d = (c.wetF[i] - fl) * rate * dt; c.wetF[i] -= d; extracted += d; }
          if (c.wetB[i] > fl) { const d = (c.wetB[i] - fl) * rate * dt; c.wetB[i] -= d; extracted += d; }
        }
      }
      const onWall = wall > cnt * 0.72 && om > 5.5;
      if (onWall) c.stickT = (c.stickT || 0) + dt; else if (om < 5) c.stickT = Math.max(0, (c.stickT || 0) - dt * 0.6);
      if (c.onWall && wall < cnt * 0.45) { c.onWall = false; au.play('wetthud', 0.6); }
      else if (!c.onWall && onWall) c.onWall = true;
      c.updateWetMean();
      if (c.wrap && this.water < 0.03 && om > 6) c.wrap.spun = true;
    }
    if (zone === 'wash' && this.water > 0.4) { this.suds = Math.min(1, this.suds + dt * 0.11); }
    this.murk = clamp(this.murk + removed * 0.02, 0, 1);
    this.extract = lerp(this.extract, extracted / Math.max(dt, 1e-3), 0.2);
    if (agit > 0 && this.water > 0.2 && Math.random() < 0.08) au.play('splash', 0.35);

    // window drops while spinning / stream while filling
    const D = G.drops, P = L.port;
    if (this.water < 0.03 && om > 5.5 && this.latched) {
      let nsp = Math.min(6, this.extract * 0.6 * dt * 60 * (G.low ? 0.5 : 1) + (om > 8 ? 0.15 : 0));
      while (nsp > 0) { if (nsp < 1 && Math.random() > nsp) break; nsp--; const a = Math.random() * 6.283, r = 0.02 + Math.random() * 0.09, vt = Math.sign(this.omega) * (0.12 + om * 0.022), vr = 0.07 + Math.random() * 0.09; D.spawn(P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 0.205 + 0.05 * (r / 0.14), 0, vr, vt / 0.1, 0.6 + Math.random() * 0.6, 0.003 + Math.random() * 0.0025, 1); }
    }
    if ((this.fillRate > 0 || spray) && this.latched) {
      for (let i = 0; i < (G.low ? 1 : 2); i++) D.spawn(-0.07 + Math.random() * (spray ? 0.2 : 0.03), L.drum.cy + 0.17, 0.06 + Math.random() * 0.05, (Math.random() - 0.5) * (spray ? 0.5 : 0.1), -0.6, 0, 1, 0.006, 0, L.drum.cy + ys);
      if (Math.random() < 0.3) this.poke(-0.06 + Math.random() * 0.03, 0.08, -0.05);
    }
    // sounds
    au.level('water', (this.fillRate > 0 ? 0.16 : 0) + (spray ? 0.2 : 0));
    au.level('slosh', this.water > 0.1 ? Math.min(0.22, om * 0.035) : 0);
    au.level('motor', om > 0.2 ? 0.035 + Math.min(0.05, om * 0.004) : 0, 34 + om * 13);
    au.level('whoosh', om > 5 ? Math.min(0.3, (om - 5) * 0.03) : 0, 300 + om * 85);
    au.level('drain', this.drainRate > 0 && this.water > 0.01 ? 0.22 : 0, 240 + Math.sin(G.time * 9) * 60);

    this._water(dt, ys, om);
  }

  poke(xw, z, amt) {
    const a = this._chord || 0.1, i = Math.round(clamp((xw / a * 0.5 + 0.5), 0, 1) * (NXW - 1)), j = Math.round(clamp((z - L.drum.zb) / (L.drum.zf - L.drum.zb), 0, 1) * (NZW - 1));
    this.v[j * NXW + i] += amt * 6;
  }

  _water(dt, ys, om) {
    const vis = this.water > 0.012 && (this.latched || this.door < 0.99);
    this.wmesh.visible = vis; if (!vis) { this.bub.count = 0; return; }
    const R = L.drum.R, a = Math.sqrt(Math.max(1e-4, R * R - ys * ys)); this._chord = a;
    const h = this.h, v = this.v, sub = 2, sdt = Math.min(dt, 0.033) / sub;
    const tilt = clamp(this.omega * 0.006, -0.03, 0.03);
    for (let s = 0; s < sub; s++) {
      for (let j = 0; j < NZW; j++) for (let i = 0; i < NXW; i++) {
        const k = j * NXW + i, l = h[j * NXW + Math.max(0, i - 1)], r = h[j * NXW + Math.min(NXW - 1, i + 1)], u = h[Math.max(0, j - 1) * NXW + i], d = h[Math.min(NZW - 1, j + 1) * NXW + i];
        const tgt = tilt * (i / (NXW - 1) * 2 - 1);
        v[k] += ((l + r + u + d) * 0.25 - h[k]) * 900 * sdt + (tgt - h[k]) * 14 * sdt; v[k] *= 1 - 2.2 * sdt;
      }
      if (om > 0.5) for (let n = 0; n < 2; n++) v[(Math.random() * NXW * NZW) | 0] += (Math.random() - 0.5) * om * 0.012;
      for (let k = 0; k < NXW * NZW; k++) h[k] = clamp(h[k] + v[k] * sdt, -0.035, 0.035);
    }
    const pos = this.wpos, nor = this.wnor, cx = L.drum.cx, cy = L.drum.cy, z0 = L.drum.zb + 0.004, z1 = L.drum.zf - 0.014;
    for (let j = 0; j < NZW; j++) for (let i = 0; i < NXW; i++) {
      const k = j * NXW + i, x = (i / (NXW - 1) * 2 - 1) * a, o = k * 3;
      pos[o] = cx + x; pos[o + 1] = cy + ys + h[k]; pos[o + 2] = lerp(z0, z1, j / (NZW - 1));
      const dx = h[j * NXW + Math.min(NXW - 1, i + 1)] - h[j * NXW + Math.max(0, i - 1)], dz = h[Math.min(NZW - 1, j + 1) * NXW + i] - h[Math.max(0, j - 1) * NXW + i];
      const nx = -dx * 22, nz = -dz * 6, il = 1 / Math.hypot(nx, 1, nz); nor[o] = nx * il; nor[o + 1] = il; nor[o + 2] = nz * il;
    }
    const base = NXW * NZW;
    for (let i = 0; i < NXW; i++) {
      const x = (i / (NXW - 1) * 2 - 1) * a, o = (base + i * 2) * 3, top = cy + ys + h[(NZW - 1) * NXW + i], bot = cy - Math.sqrt(Math.max(0, R * R - x * x));
      pos[o] = cx + x; pos[o + 1] = Math.max(top, bot); pos[o + 2] = z1; pos[o + 3] = cx + x; pos[o + 4] = bot; pos[o + 5] = z1;
      nor[o] = 0; nor[o + 1] = 0; nor[o + 2] = 1; nor[o + 3] = 0; nor[o + 4] = 0; nor[o + 5] = 1;
    }
    const at = this.wmesh.geometry.attributes; at.position.needsUpdate = true; at.normal.needsUpdate = true;
    this.wmat.color.setRGB(lerp(0.33, 0.47, this.murk), lerp(0.56, 0.5, this.murk), lerp(0.68, 0.44, this.murk));
    this.wmat.opacity = 0.42 + 0.22 * this.murk + 0.1 * this.suds;
    // suds bubbles ride the surface; most gather at the window as a foam line
    const nb = Math.floor(this.NB * clamp(this.suds * 1.15, 0, 1)), bd = this.bd;
    for (let i = 0; i < nb; i++) {
      const b = i * 5; bd[b + 4] -= dt; if (bd[b + 4] <= 0) this._bubble(i, false);
      const u = bd[b], ii = clamp((u * 0.5 + 0.5) * (NXW - 1), 0, NXW - 1) | 0, jj = clamp(Math.round(bd[b + 1] * (NZW - 1)), 0, NZW - 1);
      const sz = bd[b + 2] * Math.min(1, bd[b + 4] * 3);
      this._v.set(cx + u * a * 0.96, cy + ys + h[jj * NXW + ii] + sz * 0.3 + bd[b + 3] * 0.03 * this.suds * (bd[b + 1] === 1 ? 1 : 0.3), lerp(z0, z1, bd[b + 1]) - (bd[b + 1] === 1 ? 0.004 : 0));
      const lim = Math.sqrt(Math.max(0, R * R - (this._v.y - cy) ** 2)) - sz; if (Math.abs(this._v.x - cx) > lim) this._v.x = cx + Math.sign(u) * lim;
      this._s.set(sz, sz, sz); this._m.compose(this._v, this._q, this._s); this.bub.setMatrixAt(i, this._m);
    }
    this.bub.count = nb; this.bub.instanceMatrix.needsUpdate = true;
  }

  // ---- drum-frame cloth substep ----
  stepDrum(drumCloths) {
    const G = this.G, om = this.omega, th = this.theta, sn = Math.sin(th), cs = Math.cos(th);
    const gx = -9.8 * sn, gy = -9.8 * cs, R = L.drum.R, ys = YS0 + this.water * WDEPTH, wet = this.water > 0.03;
    const corK = clamp(1 - (Math.abs(om) - 5) / 3, 0, 1), om2 = om * om;
    for (const c of drumCloths) {
      const p = c.p, q = c.q, e = c.ext, rr = c.rad * 0.7, adh = (c.adh || 1) * clamp(c.wetMean, 0, 1) * (Math.abs(om) > 4 ? 1 : 0);
      for (let i = 0; i < c.n; i++) {
        if (!c.active[i]) continue; const a = i * 3, x = p[a], y = p[a + 1];
        const vx = (x - q[a]) / H, vy = (y - q[a + 1]) / H, vz = (p[a + 2] - q[a + 2]) / H;
        e[a] += om2 * x + 2 * om * vy * corK; e[a + 1] += om2 * y - 2 * om * vx * corK;
        const r = Math.hypot(x, y);
        if (adh > 0 && r > R - rr - 0.014) { e[a] += x / r * adh; e[a + 1] += y / r * adh; }
        if (wet && x * sn + y * cs < ys) {
          e[a] -= gx * 0.6; e[a + 1] -= gy * 0.6;
          e[a] += (om * y * 0.7 - vx) * 5; e[a + 1] += (-om * x * 0.7 - vy) * 5; e[a + 2] -= vz * 5;
        }
      }
      c.integrate(H, gx, gy, 0, 0.994, 6);
    }
    for (let it = 0; it < ITER; it++) {
      for (const c of drumCloths) {
        c.solve();
        if (c.wrap) tether(c, c.wrap);
        const p = c.p, q = c.q, rr = c.rad * 0.7, zb = L.drum.zb + rr;
        for (let i = 0; i < c.n; i++) {
          if (!c.active[i]) continue; const a = i * 3, x = p[a], y = p[a + 1], r = Math.hypot(x, y);
          if (r > R - rr) { const f = (R - rr) / r; p[a] = x * f; p[a + 1] = y * f; q[a] += (p[a] - q[a]) * 0.55; q[a + 1] += (p[a + 1] - q[a + 1]) * 0.55; q[a + 2] += (p[a + 2] - q[a + 2]) * 0.3; }
          const zf = L.drum.zf - rr - (r < 0.17 ? 0.075 * (1 - (r / 0.17) ** 2) : 0);
          if (p[a + 2] > zf) p[a + 2] = zf; else if (p[a + 2] < zb) p[a + 2] = zb;
        }
      }
    }
    if (drumCloths.length) repel(drumCloths, 0.03, 0.05);
  }
}

// keep a wrapped sock inside the towel fold
export function tether(sock, wrap) {
  const t = wrap.towel, k = wrap.k * 3, p = sock.p, tx = t.p[k], ty = t.p[k + 1], tz = t.p[k + 2];
  for (let i = 0; i < sock.n; i++) {
    const a = i * 3, dx = p[a] - tx, dy = p[a + 1] - ty, dz = p[a + 2] - tz, d = Math.hypot(dx, dy, dz);
    if (d > 0.07) { const f = 0.07 / d; p[a] = tx + dx * f; p[a + 1] = ty + dy * f; p[a + 2] = tz + dz * f; }
  }
}
