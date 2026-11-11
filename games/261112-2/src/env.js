// 浴室の静的な造形: 浴槽・タイル・デッキ・窓・蛇口・寝床・カード
import * as THREE from 'three';
import { L, ground, groundNormal, floorBase } from './layout.js';
import { makeTiles, makeStone, makeWeave, makeWicker, makeCaustics, makeWindow, makeCard } from './textures.js';
import { clamp } from './util.js';

// 水中のコースティクス/泡の影を材質へ差し込む共有ユニフォーム
export const waterU = {
  uLevel: { value: -0.08 }, uCaus: { value: null }, uWaveTex: { value: null }, uT: { value: 0 }, uCausInt: { value: 1.0 },
};

export function addCaustics(mat) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, waterU);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vWPos; uniform float uLevel; uniform sampler2D uCaus; uniform sampler2D uWaveTex; uniform float uT; uniform float uCausInt;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{ vec2 tu = (vWPos.xz - vec2(-0.5, -0.3)) / vec2(1.0, 0.6);
  if (tu.x > -0.02 && tu.x < 1.02 && tu.y > -0.03 && tu.y < 1.03) {
    float dep = uLevel - vWPos.y;
    if (dep > 0.0) {
      vec2 cu = vWPos.xz + vec2(-0.25, 0.42) * dep;
      vec4 wv = texture2D(uWaveTex, (cu - vec2(-0.5, -0.3)) / vec2(1.0, 0.6));
      float c1 = texture2D(uCaus, cu * 2.9 + uT * vec2(0.021, 0.013)).r;
      float c2 = texture2D(uCaus, cu * 3.6 - uT * vec2(0.017, 0.023) + 0.37).r;
      float c = min(c1, c2) * 2.2 + c1 * c2 * 1.4;
      float foc = clamp(0.35 + (wv.r - 0.5) * 3.2, 0.0, 2.2);
      float sh = 1.0 - wv.g * 0.8;
      float fade = smoothstep(0.0, 0.03, dep) * (0.55 + 0.45 * smoothstep(0.02, 0.2, dep));
      totalEmissiveRadiance += vec3(0.95, 1.0, 0.93) * (c * (0.5 + foc) + max(foc - 0.6, 0.0) * 0.25) * uCausInt * fade * sh * 0.32;
      diffuseColor.rgb *= mix(vec3(1.0), vec3(0.80, 0.94, 0.93), smoothstep(0.0, 0.3, dep)) * (1.0 - wv.g * 0.3 * fade);
    }
  } }`);
  };
  return mat;
}

function contourSamples() {
  const r = L.CORNER, hx = L.HX, hz = L.HZ; const out = [];
  const straight = (x0, z0, x1, z1, nx, nz, n) => { for (let i = 0; i < n; i++) { const t = i / n; out.push({ x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, nx, nz }); } };
  const arc = (cx, cz, a0, n) => { for (let i = 0; i < n; i++) { const a = a0 + (i / n) * Math.PI / 2; const nx = Math.cos(a), nz = Math.sin(a); out.push({ x: cx + nx * r, z: cz + nz * r, nx, nz }); } };
  const nL = 84, nS = 44, nA = 14;
  straight(-(hx - r), -hz, hx - r, -hz, 0, -1, nL); arc(hx - r, -(hz - r), -Math.PI / 2, nA);
  straight(hx, -(hz - r), hx, hz - r, 1, 0, nS); arc(hx - r, hz - r, 0, nA);
  straight(hx - r, hz, -(hx - r), hz, 0, 1, nL); arc(-(hx - r), hz - r, Math.PI / 2, nA);
  straight(-hx, hz - r, -hx, -(hz - r), -1, 0, nS); arc(-(hx - r), -(hz - r), Math.PI, nA);
  return out;
}

function buildTub(ceramic) {
  const cs = contourSamples(); const N = cs.length;
  // 断面: 外側のふち→傾いた縁→口元の丸み→内壁→底
  const prof = [];
  for (let k = 0; k <= 5; k++) { const t = 1 - k / 5; prof.push({ d: -(L.RIM + 0.014 * t), y: (L.RIM_RISE + 0.004) * Math.sqrt(Math.max(0, 1 - t * t)) - 0.004 }); }
  for (let k = 1; k <= 7; k++) { const d = -L.RIM + (L.RIM - 0.009) * (k / 7); prof.push({ d, y: L.RIM_RISE * Math.sin((-d / L.RIM) * Math.PI / 2) }); }
  const A = { d: -0.009, y: L.RIM_RISE * Math.sin((0.009 / L.RIM) * Math.PI / 2) };
  for (let k = 1; k <= 6; k++) prof.push({ lip: k / 6 });
  for (let k = 1; k <= 20; k++) { const u = k / 20; prof.push({ d: 0.003 + (L.CORNER - 0.003) * Math.pow(u, 1.15), wall: true }); }
  const M = prof.length; const P = new Float32Array(N * M * 3);
  for (let i = 0; i < N; i++) {
    const c = cs[i];
    const bx = c.x - c.nx * 0.003, bz = c.z - c.nz * 0.003; const By = ground(bx, bz);
    for (let j = 0; j < M; j++) {
      const p = prof[j]; let d, y;
      if (p.lip !== undefined) { const t = p.lip, a = (1 - t) * (1 - t), b = 2 * t * (1 - t), cc = t * t; d = a * A.d + b * 0.0012 + cc * 0.003; y = a * A.y + b * 0.0016 + cc * By; }
      else if (p.wall) { d = p.d; y = ground(c.x - c.nx * d, c.z - c.nz * d); }
      else { d = p.d; y = p.y; }
      const o = (i * M + j) * 3; P[o] = c.x - c.nx * d; P[o + 1] = y; P[o + 2] = c.z - c.nz * d;
    }
  }
  const Nrm = new Float32Array(N * M * 3); const a = new THREE.Vector3(), b = new THREE.Vector3(), n = new THREE.Vector3();
  const gp = (i, j, v) => { i = (i + N) % N; j = clamp(j, 0, M - 1); const o = (i * M + j) * 3; return v.set(P[o], P[o + 1], P[o + 2]); };
  const t1 = new THREE.Vector3(), t2 = new THREE.Vector3();
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
    a.copy(gp(i + 1, j, t1)).sub(gp(i - 1, j, t2)); b.copy(gp(i, j + 1, t1)).sub(gp(i, j - 1, t2));
    n.crossVectors(b, a); if (n.lengthSq() < 1e-14) n.set(0, 1, 0); n.normalize(); if (n.y < -0.2) n.negate();
    const o = (i * M + j) * 3; Nrm[o] = n.x; Nrm[o + 1] = n.y; Nrm[o + 2] = n.z;
  }
  // 向きの検算: 内壁の法線は内側を向く
  const idx = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < M - 1; j++) { const i1 = (i + 1) % N; const p0 = i * M + j, p1 = i1 * M + j, p2 = i1 * M + j + 1, p3 = i * M + j + 1; idx.push(p0, p2, p1, p0, p3, p2); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.BufferAttribute(Nrm, 3)); g.setIndex(idx);
  const ring = new THREE.Mesh(g, ceramic); ring.receiveShadow = true; ring.castShadow = false;
  // 底(段つき)
  const fx = L.HX - L.CORNER, fz = L.HZ - L.CORNER; const fg = new THREE.PlaneGeometry(fx * 2, fz * 2, 130, 6); fg.rotateX(-Math.PI / 2);
  const fp = fg.attributes.position, fn = fg.attributes.normal; const nn = [0, 0, 0];
  for (let i = 0; i < fp.count; i++) { const x = fp.getX(i), z = fp.getZ(i); fp.setY(i, floorBase(x)); const e = 0.002; const dx = (floorBase(x + e) - floorBase(x - e)) / (2 * e); const il = 1 / Math.sqrt(dx * dx + 1); fn.setXYZ(i, -dx * il, il, 0); }
  const floor = new THREE.Mesh(fg, ceramic); floor.receiveShadow = true;
  const grp = new THREE.Group(); grp.add(ring, floor); return grp;
}

function roundedRectPath(path, hx, hz, r) {
  path.moveTo(-(hx - r), -hz); path.lineTo(hx - r, -hz); path.absarc(hx - r, -(hz - r), r, -Math.PI / 2, 0, false);
  path.lineTo(hx, hz - r); path.absarc(hx - r, hz - r, r, 0, Math.PI / 2, false);
  path.lineTo(-(hx - r), hz); path.absarc(-(hx - r), hz - r, r, Math.PI / 2, Math.PI, false);
  path.lineTo(-hx, -(hz - r)); path.absarc(-(hx - r), -(hz - r), r, Math.PI, Math.PI * 1.5, false);
}

function worldUV(geo, mesh, scale, axes) {
  mesh.updateMatrixWorld(true); const p = geo.attributes.position, uv = geo.attributes.uv; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(mesh.matrixWorld); uv.setXY(i, v[axes[0]] * scale, v[axes[1]] * scale); }
  uv.needsUpdate = true;
}

export function buildEnv(scene) {
  const env = { handle: null, mats: {}, update: null };
  waterU.uCaus.value = makeCaustics(256);

  const ceramic = addCaustics(new THREE.MeshPhysicalMaterial({ color: 0xf3f1ec, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.9 }));
  const chrome = new THREE.MeshStandardMaterial({ color: 0xe9ecee, metalness: 1, roughness: 0.07, envMapIntensity: 1.25 });
  const chromeSoft = new THREE.MeshStandardMaterial({ color: 0xdfe2e4, metalness: 1, roughness: 0.22 });
  env.mats.ceramic = ceramic; env.mats.chrome = chrome; env.mats.chromeSoft = chromeSoft;

  scene.add(buildTub(ceramic));

  // 排水口
  const drain = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.0045, 10, 32), chrome); drain.rotation.x = Math.PI / 2; drain.position.set(L.DRAIN.x, L.DEEP + 0.002, L.DRAIN.z); scene.add(drain);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.024, 28), new THREE.MeshStandardMaterial({ color: 0x1b1d1f, roughness: 0.5, metalness: 0.6 })); hole.rotation.x = -Math.PI / 2; hole.position.set(L.DRAIN.x, L.DEEP + 0.0012, L.DRAIN.z); scene.add(hole);

  // デッキ(浴槽の穴あき)
  const stone = makeStone(21, 512, [203, 190, 170], 0.12);
  const deckMat = new THREE.MeshStandardMaterial({ map: stone.map, normalMap: stone.normalMap, normalScale: new THREE.Vector2(0.25, 0.25), roughness: 0.42, envMapIntensity: 0.8 });
  stone.map.repeat.set(1.7, 1.7); stone.normalMap.repeat.set(1.7, 1.7);
  const sh = new THREE.Shape(); sh.moveTo(-L.SIDE_X, -0.5); sh.lineTo(L.SIDE_X, -0.5); sh.lineTo(L.SIDE_X, -L.WALL_Z); sh.lineTo(-L.SIDE_X, -L.WALL_Z); sh.closePath();
  const hp = new THREE.Path(); roundedRectPath(hp, L.HX + L.RIM + 0.006, L.HZ + L.RIM + 0.006, L.CORNER + L.RIM + 0.006); sh.holes.push(hp);
  const deck = new THREE.Mesh(new THREE.ShapeGeometry(sh, 24), deckMat); deck.rotation.x = -Math.PI / 2; deck.position.y = 0; deck.receiveShadow = true; scene.add(deck);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(L.SIDE_X * 2, -L.FLOOR_Y), deckMat); front.position.set(0, L.FLOOR_Y / 2, 0.5); front.receiveShadow = true; scene.add(front); worldUV(front.geometry, front, 1, ['x', 'y']);
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, L.SIDE_X * 2, 8), deckMat); nose.rotation.z = Math.PI / 2; nose.position.set(0, -0.006, 0.494); scene.add(nose);

  // 床
  const fst = makeStone(5, 256, [176, 170, 160], 0.16); fst.map.repeat.set(3, 3); fst.normalMap.repeat.set(3, 3);
  const floorM = new THREE.Mesh(new THREE.PlaneGeometry(L.SIDE_X * 2, 1.6), new THREE.MeshStandardMaterial({ map: fst.map, normalMap: fst.normalMap, roughness: 0.5 }));
  floorM.rotation.x = -Math.PI / 2; floorM.position.set(0, L.FLOOR_Y, 0.5 + 0.8); floorM.receiveShadow = true; scene.add(floorM);

  // タイル壁
  const tiles = makeTiles(9, 8, 8, 128, [169, 192, 181], 0.05, '#d6d4c8');
  const tileMat = new THREE.MeshPhysicalMaterial({ map: tiles.map, normalMap: tiles.normalMap, roughnessMap: tiles.roughnessMap, roughness: 1, normalScale: new THREE.Vector2(0.9, 0.9), clearcoat: 0.6, clearcoatRoughness: 0.08, envMapIntensity: 0.85 });
  env.mats.tile = tileMat;
  const TS = 1 / 0.8;
  const wallPiece = (w, h, x, y, z, ry, axes) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), tileMat); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; scene.add(m); worldUV(m.geometry, m, TS, axes); return m; };
  const WX0 = -0.34, WX1 = 0.78, WY0 = 0.6, WY1 = 1.3, TOP = 1.7, REC = 0.09;
  wallPiece(L.SIDE_X * 2, WY0, 0, WY0 / 2, L.WALL_Z, 0, ['x', 'y']);
  wallPiece(L.SIDE_X * 2, TOP - WY1, 0, (TOP + WY1) / 2, L.WALL_Z, 0, ['x', 'y']);
  wallPiece(WX0 + L.SIDE_X, WY1 - WY0, (WX0 - L.SIDE_X) / 2, (WY0 + WY1) / 2, L.WALL_Z, 0, ['x', 'y']);
  wallPiece(L.SIDE_X - WX1, WY1 - WY0, (WX1 + L.SIDE_X) / 2, (WY0 + WY1) / 2, L.WALL_Z, 0, ['x', 'y']);
  wallPiece(2.2, TOP - L.FLOOR_Y, -L.SIDE_X, (TOP + L.FLOOR_Y) / 2, L.WALL_Z + 1.1, Math.PI / 2, ['z', 'y']);
  wallPiece(2.2, TOP - L.FLOOR_Y, L.SIDE_X, (TOP + L.FLOOR_Y) / 2, L.WALL_Z + 1.1, -Math.PI / 2, ['z', 'y']);
  // 窓のくぼみと枠
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.45 });
  const sill = new THREE.Mesh(new THREE.BoxGeometry(WX1 - WX0 + 0.04, 0.02, REC + 0.03), white); sill.position.set((WX0 + WX1) / 2, WY0 - 0.01, L.WALL_Z - REC / 2 + 0.015); sill.receiveShadow = true; scene.add(sill);
  const rv = (w, h, d, x, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), white); m.position.set(x, y, L.WALL_Z - REC / 2); scene.add(m); };
  rv(0.02, WY1 - WY0, REC, WX0 - 0.01, (WY0 + WY1) / 2); rv(0.02, WY1 - WY0, REC, WX1 + 0.01, (WY0 + WY1) / 2); rv(WX1 - WX0 + 0.04, 0.02, REC, (WX0 + WX1) / 2, WY1 + 0.01);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(WX1 - WX0, WY1 - WY0), new THREE.MeshBasicMaterial({ map: makeWindow(4), color: new THREE.Color(5.2, 5.3, 5.2) }));
  glass.position.set((WX0 + WX1) / 2, (WY0 + WY1) / 2, L.WALL_Z - REC + 0.004); scene.add(glass); env.glass = glass;
  const bar = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.03), white); m.position.set(x, y, L.WALL_Z - REC + 0.02); scene.add(m); };
  bar(0.03, WY1 - WY0, (WX0 + WX1) / 2, (WY0 + WY1) / 2); bar(WX1 - WX0, 0.03, (WX0 + WX1) / 2, WY0 + 0.015); bar(WX1 - WX0, 0.03, (WX0 + WX1) / 2, WY1 - 0.015); bar(0.03, WY1 - WY0, WX0 + 0.015, (WY0 + WY1) / 2); bar(0.03, WY1 - WY0, WX1 - 0.015, (WY0 + WY1) / 2);

  // 蛇口
  const F = L.FAUCET; const fg = new THREE.Group(); fg.position.set(F.x, 0, F.z); scene.add(fg);
  const lathe = (pts, seg = 40) => new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), seg);
  const col = new THREE.Mesh(lathe([[0, 0], [0.046, 0], [0.047, 0.006], [0.04, 0.012], [0.031, 0.02], [0.029, 0.06], [0.0285, 0.17], [0.03, 0.188], [0.03, 0.2], [0.024, 0.204], [0, 0.204]]), chrome); col.castShadow = true; fg.add(col);
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.1, 0.015), new THREE.Vector3(0, 0.142, 0.07), new THREE.Vector3(0, 0.166, 0.16), new THREE.Vector3(0, 0.166, 0.25), new THREE.Vector3(0, 0.146, 0.305), new THREE.Vector3(0, 0.122, 0.325), new THREE.Vector3(0, 0.106, 0.33)]);
  const spout = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.0185, 20, false), chrome); spout.castShadow = true; fg.add(spout);
  const aer = new THREE.Mesh(lathe([[0, 0], [0.0165, 0], [0.0205, 0.003], [0.0205, 0.018], [0.0185, 0.021], [0, 0.021]], 24), chromeSoft); aer.position.set(0, 0.09, 0.33); fg.add(aer);
  env.outlet = new THREE.Vector3(F.x, 0.09, F.z + 0.33);
  const handle = new THREE.Group(); handle.position.set(0, 0.204, 0); fg.add(handle);
  const hub = new THREE.Mesh(lathe([[0, 0], [0.027, 0], [0.028, 0.004], [0.027, 0.026], [0.02, 0.036], [0.008, 0.04], [0, 0.04]], 32), chrome); hub.castShadow = true; handle.add(hub);
  // レバー: 根元が細く先が平たい握り
  const lv = new THREE.Shape(); lv.moveTo(0, -0.008); lv.bezierCurveTo(0.05, -0.008, 0.075, -0.015, 0.105, -0.017); lv.bezierCurveTo(0.142, -0.019, 0.142, 0.019, 0.105, 0.017); lv.bezierCurveTo(0.075, 0.015, 0.05, 0.008, 0, 0.008); lv.closePath();
  const lvg = new THREE.ExtrudeGeometry(lv, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 4, curveSegments: 20 });
  lvg.rotateX(-Math.PI / 2); const lever = new THREE.Mesh(lvg, chrome); lever.position.set(0.012, 0.016, 0); lever.rotation.z = 0.1; lever.castShadow = true; handle.add(lever);
  env.handle = handle; env.handleTip = new THREE.Vector3(0.118, 0.035, 0); env.faucetGroup = fg;

  // オーバーフロー口
  const ov = new THREE.Group(); const oy = -0.041; const on = [0, 0, 0]; groundNormal(L.OVERFLOW.x, -0.2975, on);
  ov.position.set(L.OVERFLOW.x, oy, -0.2965); ov.lookAt(L.OVERFLOW.x + on[0], oy + on[1], -0.2965 + on[2]);
  const ovd = new THREE.Mesh(lathe([[0, 0.006], [0.02, 0.006], [0.027, 0.004], [0.03, 0], [0, 0]], 36), chrome); ovd.rotation.x = Math.PI / 2; ov.add(ovd);
  const slotM = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.6 });
  const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.006), slotM); slot.position.set(0, 0.012, 0.0066); ov.add(slot);
  scene.add(ov); env.overflowPos = new THREE.Vector3(L.OVERFLOW.x, oy + 0.012, -0.29);

  // タオル掛け
  const T = L.TOWEL; const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, T.x1 - T.x0 + 0.1, 16), chrome); rail.rotation.z = Math.PI / 2; rail.position.set((T.x0 + T.x1) / 2, T.railY, T.railZ); rail.castShadow = true; scene.add(rail);
  for (const x of [T.x0 - 0.04, T.x1 + 0.04]) { const post = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.01, T.railZ - L.WALL_Z, 12), chrome); post.rotation.x = Math.PI / 2; post.position.set(x, T.railY, (T.railZ + L.WALL_Z) / 2); scene.add(post); const cap = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 8), chrome); cap.position.set(x, T.railY, T.railZ); scene.add(cap); }

  // 寝床: 籐かごと綿の敷き布
  const B = L.BED; const wick = makeWicker(31, 512); wick.map.repeat.set(5, 1); wick.normalMap.repeat.set(5, 1);
  const bask = new THREE.Mesh(lathe([[0.0, 0.004], [0.17, 0.004], [0.192, 0.012], [0.204, 0.04], [0.21, 0.066], [0.213, 0.074], [0.209, 0.079], [0.203, 0.076], [0.197, 0.06], [0.19, 0.03]], 64),
    new THREE.MeshStandardMaterial({ map: wick.map, normalMap: wick.normalMap, normalScale: new THREE.Vector2(1.4, 1.4), roughness: 0.62, side: THREE.DoubleSide }));
  bask.scale.set(B.rx / 0.2, 1, B.rz / 0.2); bask.position.set(B.x, 0, B.z); bask.castShadow = true; bask.receiveShadow = true; scene.add(bask);
  const weave = makeWeave(12, 256, 48); weave.map.repeat.set(5, 5); weave.normalMap.repeat.set(5, 5);
  const sheetGeo = new THREE.BufferGeometry(); { const RS = 14, AS = 56; const pos = [], uv = [], idx = [];
    for (let j = 0; j <= RS; j++) for (let i = 0; i <= AS; i++) { const rr = j / RS, a = (i / AS) * Math.PI * 2; const x = Math.cos(a) * rr * 0.98 * B.rx, z = Math.sin(a) * rr * 0.98 * B.rz;
      const fold = Math.sin(a * 5 + rr * 3) * 0.004 * rr + Math.sin(a * 9 + 1.3) * 0.002 * rr * rr;
      const y = 0.034 + 0.03 * Math.pow(rr, 2.2) + fold + (rr > 0.93 ? (rr - 0.93) * 0.2 : 0); pos.push(x, y, z); uv.push(x / 0.5 + 0.5, z / 0.5 + 0.5); }
    for (let j = 0; j < RS; j++) for (let i = 0; i < AS; i++) { const p0 = j * (AS + 1) + i, p1 = p0 + 1, p2 = p0 + AS + 1, p3 = p2 + 1; idx.push(p0, p2, p1, p1, p2, p3); }
    sheetGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sheetGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); sheetGeo.setIndex(idx); sheetGeo.computeVertexNormals(); }
  const stainData = new Uint8Array(64 * 64); const stainTex = new THREE.DataTexture(stainData, 64, 64, THREE.RedFormat); stainTex.magFilter = THREE.LinearFilter; stainTex.minFilter = THREE.LinearFilter; stainTex.needsUpdate = true;
  const sheetMat = new THREE.MeshStandardMaterial({ color: 0xf1e9da, map: weave.map, normalMap: weave.normalMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.92 });
  sheetMat.onBeforeCompile = (s) => {
    s.uniforms.uStain = { value: stainTex };
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vSt;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvSt = vec2(position.x / 0.5 + 0.5, position.z / 0.5 + 0.5);');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vSt; uniform sampler2D uStain;')
      .replace('#include <map_fragment>', '#include <map_fragment>\nfloat stn = smoothstep(0.02, 0.5, texture2D(uStain, vSt).r); diffuseColor.rgb *= mix(vec3(1.0), vec3(0.6, 0.65, 0.7), stn);')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.55, stn);');
  };
  const sheet = new THREE.Mesh(sheetGeo, sheetMat); sheet.position.set(B.x, 0, B.z); sheet.receiveShadow = true; scene.add(sheet);
  env.stain = { data: stainData, tex: stainTex, size: 64, span: 0.5 };

  // はなまるカード(壁に貼った無地の紙)
  const card = makeCard(); const cm = new THREE.Mesh(new THREE.PlaneGeometry(0.135, 0.135), new THREE.MeshStandardMaterial({ map: card.tex, roughness: 0.85 }));
  cm.position.set(B.x + 0.02, 0.4, L.WALL_Z + 0.004); cm.rotation.z = -0.045; cm.rotation.x = -0.02; scene.add(cm);
  const tape = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.016), new THREE.MeshStandardMaterial({ color: 0xe8dcae, roughness: 0.6, transparent: true, opacity: 0.86 })); tape.position.set(B.x + 0.023, 0.467, L.WALL_Z + 0.0052); tape.rotation.z = 0.06; scene.add(tape);
  env.card = card; env.cardMesh = cm;

  // 生活感: ポンプボトルと石けん
  const amber = new THREE.MeshPhysicalMaterial({ color: 0x6b3a14, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 });
  const b1 = new THREE.Mesh(lathe([[0, 0], [0.03, 0], [0.033, 0.004], [0.033, 0.105], [0.028, 0.122], [0.013, 0.13], [0.013, 0.145], [0, 0.145]], 32), amber); b1.position.set(-0.36, 0, -0.75); b1.castShadow = true; scene.add(b1);
  const pump = new THREE.Mesh(lathe([[0, 0], [0.015, 0], [0.015, 0.012], [0.005, 0.014], [0.005, 0.04], [0.012, 0.042], [0.012, 0.05], [0, 0.05]], 20), new THREE.MeshStandardMaterial({ color: 0x24211f, roughness: 0.4 })); pump.position.set(-0.36, 0.145, -0.75); scene.add(pump);
  const noz = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.007, 0.011), pump.material); noz.position.set(-0.345, 0.191, -0.75); noz.rotation.y = 0.5; scene.add(noz);
  const b2 = new THREE.Mesh(lathe([[0, 0], [0.036, 0], [0.039, 0.005], [0.037, 0.08], [0.03, 0.092], [0.016, 0.097], [0.016, 0.112], [0, 0.112]], 32), new THREE.MeshPhysicalMaterial({ color: 0xe9e4d8, roughness: 0.35, clearcoat: 0.4 })); b2.position.set(-0.27, 0, -0.78); b2.castShadow = true; scene.add(b2);
  const dish = new THREE.Mesh(lathe([[0, 0.004], [0.04, 0.004], [0.052, 0.012], [0.054, 0.016], [0.05, 0.016], [0.04, 0.009], [0, 0.008]], 32), ceramic); dish.scale.set(1.25, 1, 0.85); dish.position.set(-0.7, 0, -0.52); scene.add(dish);
  const soapG = new THREE.SphereGeometry(0.03, 20, 14); soapG.scale(1.25, 0.42, 0.8); const soap = new THREE.Mesh(soapG, new THREE.MeshPhysicalMaterial({ color: 0xf3ead2, roughness: 0.5, sheen: 0.4 })); soap.position.set(-0.7, 0.022, -0.52); soap.rotation.y = 0.3; soap.castShadow = true; scene.add(soap);

  return env;
}
