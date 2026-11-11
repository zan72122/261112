// people.js — 袖につながる手と、距離のある全身
import * as THREE from 'three';
import { rbox, mergeStatic } from './models.js';

const std = (o) => new THREE.MeshStandardMaterial(o);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);

// 手: 手首が原点、指は +y、手のひらは -z 向き。right=true で親指が +x。
export function makeHand(skin, right = true) {
  const g = new THREE.Group(), s = right ? 1 : -1;
  const palm = new THREE.Mesh(rbox(0.082, 0.092, 0.03, 0.014, 3), skin); palm.position.set(0, 0.05, 0); palm.castShadow = true;
  const heel = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), skin); heel.position.set(s * 0.02, 0.022, -0.006); heel.scale.set(1.2, 1.3, 0.8);
  g.add(palm, heel);
  const fingers = [];
  const mkFinger = (x, y, lens, r, splay) => {
    const base = new THREE.Group(); base.position.set(x, y, 0); base.rotation.z = splay; g.add(base);
    let parent = base; const joints = [];
    lens.forEach((ln, i) => {
      const j = new THREE.Group(); parent.add(j); if (i > 0) j.position.y = lens[i - 1];
      const rr = r * (1 - i * 0.1);
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(rr, ln, 4, 10), skin); m.position.y = ln / 2; m.castShadow = true; j.add(m);
      joints.push(j); parent = j;
    });
    fingers.push(joints); return joints;
  };
  mkFinger(s * 0.03, 0.094, [0.04, 0.024, 0.019], 0.0088, -s * 0.07);
  mkFinger(s * 0.01, 0.098, [0.044, 0.027, 0.02], 0.009, -s * 0.02);
  mkFinger(-s * 0.011, 0.095, [0.04, 0.025, 0.019], 0.0085, s * 0.04);
  mkFinger(-s * 0.03, 0.086, [0.031, 0.019, 0.016], 0.0075, s * 0.11);
  // 親指
  const tb = new THREE.Group(); tb.position.set(s * 0.036, 0.03, -0.004); tb.rotation.set(0, 0, -s * 0.75); g.add(tb);
  const t0 = new THREE.Group(); tb.add(t0);
  const tm0 = new THREE.Mesh(new THREE.CapsuleGeometry(0.0115, 0.034, 4, 10), skin); tm0.position.y = 0.017; tm0.castShadow = true; t0.add(tm0);
  const t1 = new THREE.Group(); t1.position.y = 0.036; t0.add(t1);
  const tm1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.0098, 0.026, 4, 10), skin); tm1.position.y = 0.013; t1.add(tm1);
  g.userData.pose = (curl, thumb = curl, index = curl) => {
    fingers.forEach((j, i) => { const c = i === 0 ? index : curl; j[0].rotation.x = -c * 1.25; j[1].rotation.x = -c * 1.45; j[2].rotation.x = -c * 0.9; });
    t0.rotation.x = -thumb * 0.9; t0.rotation.z = s * thumb * 0.35; t1.rotation.x = -thumb * 0.7;
  };
  g.userData.pose(0.25);
  return g;
}
// 袖つきの腕(前腕のみ)。hand の手首から -y 方向へ伸びる。
export function makeSleeveArm(skin, cloth, cuff, len = 0.6, right = true) {
  const g = new THREE.Group(), hand = makeHand(skin, right);
  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.028, 0.04, 14), skin); wrist.position.y = -0.012; wrist.scale.z = 0.8;
  const cf = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.05, 18), cuff); cf.position.y = -0.05; cf.scale.z = 0.86; cf.castShadow = true;
  const sl = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04 + len * 0.045, len, 18, 4), cloth); sl.position.y = -0.075 - len / 2; sl.scale.z = 0.9; sl.castShadow = true;
  g.add(hand, wrist, cf, sl); g.userData.hand = hand; g.userData.pose = hand.userData.pose;
  // 手のひら中心が target に来るよう配置し、腕を from 方向へ伸ばす
  const m = new THREE.Matrix4(), yv = V(), zv = V(), xv = V();
  g.userData.place = (target, from, palmDir) => {
    yv.copy(target).sub(from).normalize(); // 指先方向
    zv.copy(palmDir).multiplyScalar(-1); zv.addScaledVector(yv, -zv.dot(yv)).normalize();
    xv.crossVectors(yv, zv); m.makeBasis(xv, yv, zv); g.quaternion.setFromRotationMatrix(m);
    g.position.copy(target).addScaledVector(yv, -0.06);
  };
  return g;
}

// 全身の人物。原点は足もと。+z が正面。
export function makePerson(o) {
  const g = new THREE.Group(), k = o.height / 1.65;
  const skin = o.skin, top = o.top, bottom = o.bottom, hairM = o.hair, shoe = std({ color: o.shoe || 0x3a3a3c, roughness: 0.6 });
  const cap = (r, l, m) => { const x = new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 6, 14), m); x.castShadow = true; return x; };
  const hipY = 0.86 * k;
  const body = new THREE.Group(); body.position.y = hipY; g.add(body); // 腰で前傾
  const pelvis = cap(0.13 * k, 0.1 * k, bottom); pelvis.rotation.z = Math.PI / 2; pelvis.scale.set(1, 1, 0.78); pelvis.position.y = 0.02; body.add(pelvis);
  const torso = cap(0.138 * k, 0.27 * k, top); torso.position.y = 0.3 * k; torso.scale.set(1.0, 1, 0.74); body.add(torso);
  const shoulders = cap(0.066 * k, 0.2 * k, top); shoulders.rotation.z = Math.PI / 2; shoulders.position.y = 0.5 * k; shoulders.scale.set(1, 1, 0.9); body.add(shoulders);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.043 * k, 0.05 * k, 0.09 * k, 12), skin); neck.position.y = 0.59 * k; body.add(neck);
  const head = new THREE.Group(); head.position.y = 0.7 * k; body.add(head);
  const hp = [[0.001, -0.115], [0.04, -0.108], [0.066, -0.075], [0.08, -0.03], [0.088, 0.02], [0.085, 0.06], [0.066, 0.095], [0.035, 0.112], [0.001, 0.116]].map((p) => new THREE.Vector2(p[0] * k, p[1] * k));
  const skull = new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(hp).getPoints(18), 22), skin); skull.scale.z = 1.08; skull.castShadow = true; head.add(skull);
  // 髪: 顔の窓を残して頭を包む殻 + 前髪
  const hr = 0.103 * k, fw = o.bob ? 0.8 : 0.95;
  const hair = new THREE.Mesh(new THREE.SphereGeometry(hr, 26, 16, Math.PI / 2 + fw, Math.PI * 2 - fw * 2, 0, Math.PI * (o.bob ? 0.74 : 0.5)), hairM); hair.position.set(0, 0.012 * k, -0.004 * k); hair.scale.set(1, 1.08, 1.1); hair.castShadow = true; head.add(hair);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(hr, 16, 10, Math.PI / 2 - fw - 0.05, fw * 2 + 0.1, 0, Math.PI * (o.bob ? 0.3 : 0.24)), hairM); fringe.position.copy(hair.position); fringe.scale.copy(hair.scale); head.add(fringe);
  for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.016 * k, 8, 8), skin); e.position.set(sx * 0.086 * k, -0.008 * k, 0.004); e.scale.set(0.45, 1, 0.75); head.add(e); }
  // 顔: 遠景用の控えめな造形 (やわらかく閉じた目・小さな鼻と口)
  const dk = std({ color: 0x3a2c25, roughness: 0.6 }), lip = std({ color: 0xb9705f, roughness: 0.65 });
  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.0095 * k, 0.0021 * k, 5, 10, Math.PI), dk); eye.position.set(sx * 0.03 * k, 0.006 * k, 0.0885 * k); eye.rotation.y = sx * 0.32; head.add(eye);
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.002 * k, 0.017 * k, 3, 6), hairM); brow.position.set(sx * 0.031 * k, 0.028 * k, 0.089 * k); brow.rotation.set(0, sx * 0.3, Math.PI / 2 + sx * 0.1); head.add(brow);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.011 * k, 10, 8), skin); nose.position.set(0, -0.014 * k, 0.094 * k); nose.scale.set(0.8, 1.15, 0.9); head.add(nose);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.013 * k, 0.0024 * k, 5, 10, Math.PI), lip); mouth.position.set(0, -0.041 * k, 0.086 * k); mouth.rotation.z = Math.PI; head.add(mouth);
  if (o.apron) {
    const ap = new THREE.Mesh(rbox(0.3 * k, 0.62 * k, 0.03, 0.012, 2), o.apron); ap.position.set(0, 0.1 * k, 0.108 * k); ap.castShadow = true; body.add(ap);
    const bib = new THREE.Mesh(rbox(0.2 * k, 0.2 * k, 0.03, 0.012, 2), o.apron); bib.position.set(0, 0.42 * k, 0.103 * k); body.add(bib);
    const pk = new THREE.Mesh(rbox(0.13 * k, 0.09 * k, 0.012, 0.004, 1), o.apron); pk.position.set(0, 0.02 * k, 0.127 * k); body.add(pk);
  }
  const headRot = head; body.remove(head); mergeStatic(head, { cast: true }); mergeStatic(body, { cast: true }); body.add(headRot);
  // 脚
  const legs = [];
  for (const sx of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(sx * 0.085 * k, hipY - 0.02, 0); g.add(hip);
    const th = cap(0.07 * k, 0.3 * k, bottom); th.position.y = -0.2 * k; hip.add(th);
    const knee = new THREE.Group(); knee.position.y = -0.41 * k; hip.add(knee);
    const sn = cap(0.055 * k, 0.3 * k, bottom); sn.position.y = -0.19 * k; knee.add(sn);
    const sh = new THREE.Mesh(rbox(0.09 * k, 0.07 * k, 0.24 * k, 0.03 * k, 2), shoe); sh.position.set(0, -0.41 * k, 0.04 * k); sh.castShadow = true; knee.add(sh);
    knee.userData.dynamic = true; mergeStatic(knee, { cast: true }); legs.push({ hip, knee });
  }
  // 腕 (2ボーンIK)
  const arms = [];
  const UA = 0.27 * k, FA = 0.25 * k;
  for (const sx of [-1, 1]) {
    const a = { sx, sh: V(sx * 0.165 * k, 0.5 * k, 0), target: null, cur: V(sx * 0.05, 0.0, 0.17), rest: V(sx * 0.045, -0.01, 0.165) };
    a.upper = cap(0.043 * k, UA - 0.05, top); a.fore = cap(0.037 * k, FA - 0.05, top); a.elbow = new THREE.Mesh(new THREE.SphereGeometry(0.042 * k, 10, 8), top);
    a.hand = new THREE.Group(); const ho = makeHand(skin, sx > 0), hg = makeHand(skin, sx > 0); ho.userData.pose(0.22, 0.15); hg.userData.pose(0.92, 0.75); mergeStatic(ho, { cast: true }); mergeStatic(hg, { cast: true }); hg.visible = false; a.hand.add(ho, hg);
    a.hand.userData.pose = (c) => { ho.visible = c < 0.6; hg.visible = !ho.visible; }; a.hand.scale.setScalar(k * 0.98);
    a.cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.037 * k, 0.039 * k, 0.03, 12), o.cuff || top);
    body.add(a.upper, a.fore, a.elbow, a.hand, a.cuff); arms.push(a);
  }
  const q = new THREE.Quaternion(), d1 = V(), d2 = V(), el = V(), mid = V(), tmp = V(), mB = new THREE.Matrix4(), xa = V(), za = V();
  function solveArm(a, t, palm) {
    // t: body ローカルの手首目標
    d1.copy(t).sub(a.sh); let dist = d1.length(); const mx = UA + FA - 0.005;
    if (dist > mx) { d1.multiplyScalar(mx / dist); dist = mx; }
    const wr = tmp.copy(a.sh).add(d1);
    const c = (UA * UA + dist * dist - FA * FA) / (2 * UA * dist), h = Math.sqrt(Math.max(0, 1 - c * c)) * UA;
    d2.copy(d1).normalize();
    const pole = V(a.sx * 0.6, -0.5, -0.65); pole.addScaledVector(d2, -pole.dot(d2)).normalize();
    el.copy(a.sh).addScaledVector(d2, UA * c).addScaledVector(pole, h);
    a.elbow.position.copy(el);
    mid.copy(a.sh).add(el).multiplyScalar(0.5); a.upper.position.copy(mid); a.upper.quaternion.setFromUnitVectors(UP, d2.copy(el).sub(a.sh).normalize());
    const fd = d2.copy(wr).sub(el).normalize();
    mid.copy(el).add(wr).multiplyScalar(0.5); a.fore.position.copy(mid); a.fore.quaternion.setFromUnitVectors(UP, fd);
    a.cuff.position.copy(wr).addScaledVector(fd, -0.02); a.cuff.quaternion.copy(a.fore.quaternion);
    // 手: 指は前腕方向、手のひらは palm 方向
    za.copy(palm || V(-a.sx, 0, 0)).multiplyScalar(-1); za.addScaledVector(fd, -za.dot(fd)).normalize();
    xa.crossVectors(fd, za); mB.makeBasis(xa, fd, za); a.hand.quaternion.setFromRotationMatrix(mB);
    a.hand.position.copy(wr);
  }
  const P = { group: g, body, head, arms, legs, k, walk: 0, bow: 0, lean: 0, headPitch: 0, phase: 0, armT: [null, null], palm: [null, null] };
  const inv = new THREE.Matrix4(), wt = V();
  P.update = (dt) => {
    P.phase += dt * 7.2 * P.walk;
    const sw = Math.sin(P.phase) * 0.5 * P.walk;
    legs[0].hip.rotation.x = sw; legs[1].hip.rotation.x = -sw;
    legs[0].knee.rotation.x = Math.max(0, -Math.sin(P.phase - 0.6)) * 0.7 * P.walk; legs[1].knee.rotation.x = Math.max(0, Math.sin(P.phase - 0.6)) * 0.7 * P.walk;
    body.position.y = hipY + Math.abs(Math.cos(P.phase)) * 0.018 * P.walk;
    body.rotation.x = P.bow; body.rotation.z = P.lean; head.rotation.x = P.headPitch;
    g.updateMatrixWorld(true); inv.copy(body.matrixWorld).invert();
    arms.forEach((a, i) => {
      const t = P.armT[i];
      if (t) { wt.copy(t).applyMatrix4(inv); a.cur.lerp(wt, Math.min(1, dt * 9)); }
      else { wt.copy(a.rest); if (P.walk > 0.3) { wt.set(a.sx * 0.21 * k, -0.02, 0.03 + (i ? sw : -sw) * 0.35); } a.cur.lerp(wt, Math.min(1, dt * 7)); }
      let pd = null; if (P.palm[i]) { pd = V().copy(P.palm[i]).transformDirection(inv); }
      solveArm(a, a.cur, pd);
    });
  };
  P.handWorld = (i, out) => { arms[i].hand.updateWorldMatrix(true, false); return out.setFromMatrixPosition(arms[i].hand.matrixWorld); };
  return P;
}
