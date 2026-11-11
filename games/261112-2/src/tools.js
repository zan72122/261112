// 道具: 蛇口の取っ手、シャワー、栓と鎖
import * as THREE from 'three';
import { L, ground } from './layout.js';
import { clamp, sat, damp, rng, lerp } from './util.js';

export class Tools {
  constructor(G) {
    this.G = G; const scene = G.scene, env = G.env; const chrome = env.mats.chrome; this.rand = rng(99);
    // --- 蛇口 ---
    this.open = 0; this.openTarget = null; this.flow = 0; this.handleWiggle = 0;
    // --- シャワー ---
    const R = L.SHOWER_REST; this.sh = { held: false, pos: new THREE.Vector3(R.x, R.y, R.z), dir: new THREE.Vector3(0.62, 0, 0.78), on: 0, wiggle: 0, used: 0, hit: new THREE.Vector3(), hitKind: 0 };
    const white = new THREE.MeshPhysicalMaterial({ color: 0xf1f0ec, roughness: 0.25, clearcoat: 0.6 });
    const g = new THREE.Group(); this.shG = g; scene.add(g);
    const lathe = (pts, seg = 28) => new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), seg);
    const grip = new THREE.Mesh(lathe([[0, -0.075], [0.011, -0.075], [0.0125, -0.07], [0.0135, -0.02], [0.012, 0.03], [0.0105, 0.06], [0, 0.062]]), white); grip.castShadow = true; g.add(grip);
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, 0.014, 16), chrome); nut.position.y = -0.08; g.add(nut);
    const head = new THREE.Group(); head.position.set(0, 0.07, -0.012); head.rotation.x = -1.69; g.add(head); // 面は握りに対しておよそ97度
    const cup = new THREE.Mesh(lathe([[0, 0.02], [0.015, 0.02], [0.03, 0.012], [0.045, 0.002], [0.047, -0.004], [0.044, -0.008], [0, -0.008]], 36), white); cup.castShadow = true; head.add(cup);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.041, 32), new THREE.MeshStandardMaterial({ color: 0xc9cdd0, metalness: 0.9, roughness: 0.3 })); face.rotation.x = Math.PI / 2; face.position.y = -0.0085; head.add(face);
    this.shHead = head; this.shFace = new THREE.Vector3(0, -0.012, 0);
    // 受け
    const br = new THREE.Group(); br.position.set(R.x, R.y - 0.05, L.WALL_Z); scene.add(br);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.008, 24), chrome); plate.rotation.x = Math.PI / 2; plate.position.z = 0.004; br.add(plate);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.05, 12), chrome); arm.rotation.x = Math.PI / 2; arm.position.z = 0.03; br.add(arm);
    const cupH = new THREE.Mesh(new THREE.TorusGeometry(0.017, 0.005, 10, 24), chrome); cupH.rotation.x = Math.PI / 2; cupH.position.set(0, 0, 0.06); br.add(cupH);
    // ホース
    this.hoseA = new THREE.Vector3(-0.76, 0.1, L.WALL_Z + 0.01); const hs = 22, hr = 7; this.hoseSeg = hs; this.hoseRad = hr; const hp = new Float32Array((hs + 1) * hr * 3); const hi = [];
    for (let i = 0; i < hs; i++) for (let j = 0; j < hr; j++) { const a = i * hr + j, b = i * hr + (j + 1) % hr, c = a + hr, d = b + hr; hi.push(a, c, b, b, c, d); }
    const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.BufferAttribute(hp, 3)); hg.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(hp.length), 3)); hg.setIndex(hi);
    this.hose = new THREE.Mesh(hg, new THREE.MeshStandardMaterial({ color: 0xd8dadb, metalness: 0.85, roughness: 0.32 })); this.hose.frustumCulled = false; this.hose.castShadow = true; scene.add(this.hose);
    const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.012, 16), chrome); outlet.rotation.x = Math.PI / 2; outlet.position.copy(this.hoseA); scene.add(outlet);
    this.restQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.42, 0.5, 0)); this.shQ = this.restQ.clone(); this.hoseDirty = true;
    // 飛ぶ泡
    this.fly = []; this.flyMesh = new THREE.InstancedMesh(G.water.foamGeo, G.water.foamMat, 14); this.flyMesh.count = 0; this.flyMesh.frustumCulled = false; scene.add(this.flyMesh);
    // --- 栓と鎖 ---
    this.ringH = 0; this.ringTarget = null; this.ringWiggle = 0;
    const RG = L.RING; const guide = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0028, 8, 16), chrome); guide.position.set(RG.x, 0.016, RG.z); guide.rotation.y = Math.PI / 2; scene.add(guide);
    const gb = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.012, 0.004, 16), chrome); gb.position.set(RG.x, 0.0135, RG.z); scene.add(gb);
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(0.023, 0.0034, 12, 36), chrome); this.ring.castShadow = true; scene.add(this.ring);
    this.plug = new THREE.Group(); const rubber = new THREE.MeshStandardMaterial({ color: 0x2a2c2e, roughness: 0.55 });
    const pb = new THREE.Mesh(lathe([[0, 0], [0.021, 0], [0.027, 0.006], [0.0275, 0.012], [0.02, 0.016], [0, 0.016]], 28), rubber); pb.castShadow = true; this.plug.add(pb); const pe = new THREE.Mesh(new THREE.TorusGeometry(0.005, 0.0016, 6, 12), chrome); pe.position.y = 0.02; this.plug.add(pe); scene.add(this.plug);
    this.beadN = 120; this.beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0026, 7, 5), env.mats.chromeSoft, this.beadN); this.beads.frustumCulled = false; scene.add(this.beads);
    this._m = new THREE.Matrix4(); this._v = new THREE.Vector3(); this._v2 = new THREE.Vector3(); this._q = new THREE.Quaternion(); this._s = new THREE.Vector3(1, 1, 1); this._X = new THREE.Vector3(); this._Y = new THREE.Vector3(); this._Z = new THREE.Vector3(); this._mat = new THREE.Matrix4();
    this.sph = [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()];
    this.updateChain(); this.updateHose();
  }

  // ---- 位置の問い合わせ(当たり判定とお手本用) ----
  handleTip(out, open = this.open) { const a = open * 1.75; return out.set(L.FAUCET.x + Math.cos(a) * 0.105, 0.245, L.FAUCET.z + Math.sin(a) * 0.105); }
  ringPos(out) { return out.set(L.RING.x, 0.016 + 0.026 + this.ringH, L.RING.z); }
  showerGrip(out) { return out.copy(this.sh.pos); }

  // ---- 蛇口 ----
  setOpen(v) { this.open = clamp(v, 0, 1); this.openTarget = null; }
  tapFaucet() { this.openTarget = this.open < 0.12 ? 0.42 : 0; }
  // ---- 栓 ----
  setRing(h) { this.ringH = clamp(h, 0, 0.15); this.ringTarget = null; }
  tapRing() { this.ringTarget = this.ringH < 0.03 ? 0.09 : 0; }
  // ---- シャワー ----
  grabShower() { this.sh.held = true; this.sh.trail = null; }
  moveShower(x, z, dt) {
    const s = this.sh; x = clamp(x, -0.74, 0.72); z = clamp(z, -0.5, 0.5);
    // 向きは「少し遅れて付いてくる点」から決める(指の報告間隔に左右されない)
    if (!s.trail) s.trail = new THREE.Vector3(s.pos.x, 0, s.pos.z);
    s.pos.x = x; s.pos.z = z; s.pos.y = damp(s.pos.y, 0.3, 12, dt); const k = 1 - Math.exp(-2.6 * dt); s.trail.x += (x - s.trail.x) * k; s.trail.z += (z - s.trail.z) * k;
    const dx = x - s.trail.x, dz = z - s.trail.z, l = Math.hypot(dx, dz); if (l > 0.03) { const q = Math.min(1, dt * 9); s.dir.x += (dx / l - s.dir.x) * q; s.dir.z += (dz / l - s.dir.z) * q; const n = Math.hypot(s.dir.x, s.dir.z) || 1; s.dir.x /= n; s.dir.z /= n; }
    this.hoseDirty = true;
  }
  releaseShower() { this.sh.held = false; }

  update(dt, time) {
    const G = this.G, W = G.water, s = this.sh;
    if (this.openTarget !== null) { this.open = damp(this.open, this.openTarget, 9, dt); if (Math.abs(this.open - this.openTarget) < 0.004) { this.open = this.openTarget; this.openTarget = null; } }
    this.flow = damp(this.flow, this.open, 7, dt); if (this.flow < 0.004 && this.open === 0) this.flow = 0; W.faucet = this.flow;
    this.handleWiggle = Math.max(0, this.handleWiggle - dt); G.env.handle.rotation.y = -this.open * 1.75 + Math.sin(time * 30) * 0.03 * sat(this.handleWiggle * 3);
    if (this.ringTarget !== null) { this.ringH = damp(this.ringH, this.ringTarget, 8, dt); if (Math.abs(this.ringH - this.ringTarget) < 0.002) { this.ringH = this.ringTarget; this.ringTarget = null; } this.chainDirty = true; }
    W.drain = sat(this.ringH / 0.11);
    this.ringWiggle = Math.max(0, this.ringWiggle - dt); if (this.chainDirty || this.ringWiggle > 0) this.updateChain(time);
    // シャワー
    s.wiggle = Math.max(0, s.wiggle - dt);
    if (!s.held) { const R = L.SHOWER_REST; if (s.pos.distanceToSquared(R) > 1e-6) { s.pos.x = damp(s.pos.x, R.x, 6, dt); s.pos.y = damp(s.pos.y, R.y, 6, dt); s.pos.z = damp(s.pos.z, R.z, 6, dt); this.hoseDirty = true; } s.on = Math.max(0, s.on - dt * 6); this.shQ.slerp(this.restQ, Math.min(1, dt * 6)); }
    else {
      s.on = Math.min(1, s.on + dt * 5);
      const h = this._Y.set(s.dir.x * 0.5, 0.86, s.dir.z * 0.5).normalize(); const sp = this._v.set(s.dir.x * 0.8, -0.6, s.dir.z * 0.8).normalize(); const Z = this._Z.copy(sp).multiplyScalar(-1).addScaledVector(h, sp.dot(h)).normalize(); const X = this._X.crossVectors(h, Z).normalize();
      this._mat.makeBasis(X, h, Z); this._q.setFromRotationMatrix(this._mat); this.shQ.slerp(this._q, Math.min(1, dt * 12));
    }
    this.shG.position.copy(s.pos); this.shG.quaternion.copy(this.shQ); if (s.wiggle > 0) this.shG.rotateZ(Math.sin(time * 28) * 0.12 * sat(s.wiggle * 3));
    if (this.hoseDirty) { this.updateHose(); this.hoseDirty = false; }
    s.hitKind = 0;
    if (s.on > 0.3 && s.held) this.spray(dt, time);
    this.updateFly(dt);
  }

  spray(dt, time) {
    const G = this.G, W = G.water, s = this.sh; this.shG.updateMatrixWorld(true); const o = this._v.copy(this.shFace).applyMatrix4(this.shHead.matrixWorld);
    const dhx = s.dir.x, dhz = s.dir.z, Vh = 1.85; let vy = -1.38; s.used += dt;
    // 水流の進む線の上で、最初に出会う羽(頭か胴)を探す。高さは水流の角度が少し合わせる
    let hitT = -1, hitDuck = null, hitPart = 0, px = 0, py = 0, pz = 0, best = 9;
    for (const dk of G.ducks) { if (dk.mode === 'held') continue; const sp = dk.spheres(dk._sph || (dk._sph = [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()]));
      for (let k = 0; k < 3; k++) { const q = sp[k]; const rx = q.x - o.x, rz = q.z - o.z; const along = rx * dhx + rz * dhz; if (along < 0.06 || along > 0.62) continue; const perp = Math.abs(rx * dhz - rz * dhx); const rad = q.w + (k === 2 ? 0.055 : 0.02); if (perp > rad) continue;
        const ent = along - Math.sqrt(rad * rad - perp * perp) * 0.8; if (ent < best) { best = ent; hitDuck = dk; hitPart = k === 2 ? 0 : -1; px = o.x + dhx * ent; pz = o.z + dhz * ent; py = q.y + (k === 2 ? q.w * 0.3 : q.w * 0.5); } } }
    if (hitDuck) { hitT = Math.max(0.04, best / Vh); vy = clamp((py - o.y + 4.9 * hitT * hitT) / hitT, -2.9, 0.4); py = o.y + vy * hitT - 4.9 * hitT * hitT; if (hitPart < 0) hitPart = hitDuck.partAt(px, py, pz); }
    else { for (let i = 1; i <= 30; i++) { const t = i * 0.012; px = o.x + dhx * Vh * t; py = o.y + vy * t - 4.9 * t * t; pz = o.z + dhz * Vh * t; const inT = Math.abs(px) < L.HX && Math.abs(pz) < L.HZ; const gy = inT ? Math.max(ground(px, pz), W.level + W.hAt(px, pz)) : 0.005; if (py < gy) { hitT = t; py = gy; break; } } if (hitT < 0) hitT = 0.36; }
    s.hit.set(px, py, pz);
    // 水滴の列
    const n = G.low ? 2 : 4; for (let i = 0; i < n; i++) { const jx = (this.rand() - 0.5) * 0.16, jy = (this.rand() - 0.5) * 0.12, jz = (this.rand() - 0.5) * 0.16; W.drop(o.x + (this.rand() - 0.5) * 0.05, o.y, o.z + (this.rand() - 0.5) * 0.05, dhx * Vh + jx, vy + jy, dhz * Vh + jz, 0.0022, hitDuck ? hitT * (0.92 + this.rand() * 0.16) : 0.7); }
    const inTub = Math.abs(px) < L.HX && Math.abs(pz) < L.HZ; const d = this._v2.set(dhx, 0, dhz);
    // 親は近くにシャワーが来ると頭を下げる
    for (const dk of G.ducks) { if (dk.mode === 'held') continue; if (Math.hypot(dk.x - px, dk.z - pz) < 0.32) dk.showerT = time; }
    if (hitDuck) { s.hitKind = 2; s.hitPart = hitPart; const off = hitDuck.showerHit(hitPart, dt);
      if (this.rand() < dt * 14) W.drop(px, py, pz, (this.rand() - 0.5) * 0.6 + d.x * 0.3, 0.4 + this.rand() * 0.5, (this.rand() - 0.5) * 0.6 + d.z * 0.3, 0.0025, 0.4);
      if (off > 0) { hitDuck._slid = (hitDuck._slid || 0) + off; while (hitDuck._slid > 0.055) { hitDuck._slid -= 0.055; this.launchFoam(hitDuck, hitPart, px, py, pz, d); } }
    } else if (inTub && W.level > ground(px, pz) + 0.004) { s.hitKind = 1; W.impulse(px + (this.rand() - 0.5) * 0.03, pz + (this.rand() - 0.5) * 0.03, -(0.6 + this.rand() * 0.8), 0.03); W.push(px, pz, d.x * 0.34, d.z * 0.34, 0.075, Math.min(1, dt * 9)); }
  }
  launchFoam(src, part, x, y, z, d) {
    if (this.fly.length >= 14) return; const o = src.other; let vx = d.x * (0.42 + this.rand() * 0.3), vz = d.z * (0.42 + this.rand() * 0.3);
    // 流れの先に相手の背があれば、少しだけそちらへ寄る
    if (o && o.mode !== 'held') { const ex = o.x - x, ez = o.z - z, dist = Math.hypot(ex, ez); if (this.rand() < 0.55 && dist < 0.36 && dist > 0.02 && (ex * d.x + ez * d.z) / dist > 0.35) { const tt = 0.22; vx = lerp(vx, ex / tt, 0.6); vz = lerp(vz, ez / tt, 0.6); } }
    this.fly.push({ x, y: y + 0.01, z, vx, vy: 0.35 + this.rand() * 0.25, vz, s: (src.kind === 'kid' ? 0.011 : 0.017) * (0.8 + this.rand() * 0.4), src, t: 0, rot: this.rand() * 6.28 });
    this.G.audio.plink(1.5, 0.3);
  }
  updateFly(dt) {
    const G = this.G, W = G.water; const m = this._m; let n = 0;
    for (let i = this.fly.length - 1; i >= 0; i--) { const f = this.fly[i]; f.t += dt; f.vy -= 9.8 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.z += f.vz * dt; let done = false;
      for (const dk of G.ducks) { if (dk === f.src || dk.mode === 'held' || f.vy > 0) continue; const top = dk.y + dk.S.axisY * 2; const h = dk.hull(); const ex = f.x - h.x, ez = f.z - h.z; const lx = ex * h.c + ez * h.s, lz = -ex * h.s + ez * h.c; const e = (lx * lx) / ((h.a + 0.03) * (h.a + 0.03)) + (lz * lz) / ((h.b + 0.03) * (h.b + 0.03));
        if (e < 1 && f.y < top + 0.012) { dk.foam[1] = Math.min(1, dk.foam[1] + (dk.kind === 'kid' ? 0.17 : 0.1)); dk.wag = 0.5; G.onFoamPass && G.onFoamPass(f.src, dk); done = true; break; } }
      if (!done && f.vy < 0) { const inT = Math.abs(f.x) < L.HX - 0.01 && Math.abs(f.z) < L.HZ - 0.01; const gy = inT ? Math.max(ground(f.x, f.z), W.level + W.hAt(f.x, f.z)) : 0.004;
        if (f.y < gy) { done = true; if (inT) { W.addFoam(f.x, f.z, f.s * 0.95, 60 + this.rand() * 60, false, f.vx * 0.3, f.vz * 0.3); if (W.level > ground(f.x, f.z) + 0.004) W.impulse(f.x, f.z, -0.5, 0.025); } } }
      if (done || f.t > 2) { this.fly.splice(i, 1); continue; }
      this._q.setFromAxisAngle(this._Y.set(0, 1, 0), f.rot + f.t * 6); this._s.set(f.s, f.s * 0.8, f.s); m.compose(this._v.set(f.x, f.y, f.z), this._q, this._s); this.flyMesh.setMatrixAt(n++, m); }
    this._s.set(1, 1, 1); this.flyMesh.count = n; this.flyMesh.instanceMatrix.needsUpdate = true;
  }

  updateHose() {
    const s = this.sh; const a = this.hoseA; const b = this._v.set(0, -0.088, 0).applyQuaternion(this.shQ).add(s.pos); const down = this._v2.set(0, -1, 0).applyQuaternion(this.shQ);
    const dist = a.distanceTo(b); const sag = Math.max(0.06, 0.5 - dist * 0.45); const c1x = a.x + 0.02, c1y = a.y - sag * 0.6, c1z = a.z + 0.16; const c2x = b.x + down.x * 0.14, c2y = b.y + down.y * 0.14 - sag * 0.25, c2z = b.z + down.z * 0.14;
    const pos = this.hose.geometry.attributes.position, nrm = this.hose.geometry.attributes.normal; const N = this.hoseSeg, R = this.hoseRad; const pts = [];
    for (let i = 0; i <= N; i++) { const t = i / N, u = 1 - t; pts.push([u * u * u * a.x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * b.x, u * u * u * a.y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * b.y, u * u * u * a.z + 3 * u * u * t * c1z + 3 * u * t * t * c2z + t * t * t * b.z]); }
    const T = this._X, Nn = this._Y, Bn = this._Z; const ref = new THREE.Vector3(1, 0, 0);
    for (let i = 0; i <= N; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(N, i + 1)]; T.set(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]).normalize(); Nn.crossVectors(T, ref); if (Nn.lengthSq() < 1e-4) Nn.set(0, 0, 1); Nn.normalize(); Bn.crossVectors(T, Nn);
      for (let j = 0; j < R; j++) { const an = (j / R) * Math.PI * 2, cs = Math.cos(an), sn = Math.sin(an); const nx = Nn.x * cs + Bn.x * sn, ny = Nn.y * cs + Bn.y * sn, nz = Nn.z * cs + Bn.z * sn; const k = i * R + j; pos.setXYZ(k, pts[i][0] + nx * 0.0068, pts[i][1] + ny * 0.0068, pts[i][2] + nz * 0.0068); nrm.setXYZ(k, nx, ny, nz); } }
    pos.needsUpdate = true; nrm.needsUpdate = true;
  }

  updateChain(time = 0) {
    this.chainDirty = false; const RG = L.RING, D = L.DRAIN; const H = this.ringH; const lift = H * 0.42; const wob = this.ringWiggle > 0 ? Math.sin(time * 30) * 0.004 * sat(this.ringWiggle * 3) : 0;
    this.ring.position.set(RG.x + wob, 0.016 + 0.026 + H, RG.z); this.ring.rotation.set(0, 0.25, 0);
    this.plug.position.set(D.x + lift * 0.25, L.DEEP + 0.002 + lift, D.z); this.plug.rotation.z = lift * 4.5;
    // 経路: 輪の下端→ガイド→口元→壁沿い→栓
    const pts = [[RG.x + wob, 0.019 + H, RG.z], [RG.x, 0.017, RG.z], [0.515, 0.006, RG.z], [0.497, -0.012, RG.z]]; const px = D.x + lift * 0.25, py = L.DEEP + 0.024 + lift;
    const sagX = 0.478 - lift * 0.4, sagY = lerp(L.DEEP + 0.03, L.DEEP + 0.16, sat(lift / 0.06)); for (let i = 1; i <= 16; i++) { const t = i / 16, u = 1 - t; pts.push([u * u * 0.497 + 2 * u * t * sagX + t * t * px, u * u * -0.012 + 2 * u * t * sagY + t * t * py, RG.z + (D.z - RG.z) * t]); }
    const m = this._m; let n = 0; const sp = 0.0056; let carry = 0;
    for (let i = 0; i < pts.length - 1 && n < this.beadN; i++) { const a = pts[i], b = pts[i + 1]; const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); let d = carry; while (d < len && n < this.beadN) { const t = d / len; m.makeTranslation(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t); this.beads.setMatrixAt(n++, m); d += sp; } carry = d - len; }
    this.beads.count = n; this.beads.instanceMatrix.needsUpdate = true;
  }
}
