// models.js — 店と商品のジオメトリ (すべて手続き生成)
import * as THREE from 'three';
import * as T from './tex.js';
import { PEG_X, PEG_Y } from './bagsim.js';

export const L = {
  counterY: 0.88, counterX0: -0.3, counterX1: 2.6, counterZ: 0.32,
  shelfX: -0.8, shelfTopY: 1.14, milkX: [-1.11, -1.0, -0.89], milkZ: -0.1,
  laneX: [-0.98, -0.8, -0.62], laneFront: new THREE.Vector3(0, 0.815, 0.03), laneDir: new THREE.Vector3(0, 0.298, -0.954), laneLen: 0.31,
  bin: new THREE.Vector3(-0.58, 1.14, -0.13),
  crate: new THREE.Vector3(-1.05, 0.27, 0.4), stand: new THREE.Vector3(-0.55, 0.4, 0.4), stack: new THREE.Vector3(-0.55, 0.075, 0.4),
  regBasket: new THREE.Vector3(0.14, 0.88, 0.06), trayReg: new THREE.Vector3(0.67, 0.892, 0.04), trayBag: new THREE.Vector3(1.24, 0.892, 0.1),
  scanner: new THREE.Vector3(0.41, 1.0, -0.19), button: new THREE.Vector3(0.41, 0.88, 0.235),
  rack: new THREE.Vector3(1.62, 0.88, 0), custReg: new THREE.Vector3(0.5, 0, -1.0), custBag: new THREE.Vector3(2.28, 0, -0.56),
  winX0: -2.1, winX1: -0.3,
  frontZ: -3.4, openX0: 0.1, openX1: 3.0, openH: 2.4, wallH: 3.0,
};

const std = (o) => new THREE.MeshStandardMaterial(o);
const phys = (o) => new THREE.MeshPhysicalMaterial(o);
export function rbox(w, h, d, r, seg = 3) {
  const g = new THREE.BoxGeometry(w, h, d, seg + 1, seg + 1, seg + 1), p = g.attributes.position, n = g.attributes.normal;
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r, v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); c.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)));
    v.sub(c); if (v.lengthSq() < 1e-12) { v.fromBufferAttribute(n, i); } v.normalize();
    n.setXYZ(i, v.x, v.y, v.z); p.setXYZ(i, c.x + v.x * r, c.y + v.y * r, c.z + v.z * r);
  }
  return g;
}
// 動かない部品を材質ごとに1メッシュへ結合し、描画コールを減らす
export function mergeStatic(root, opt = {}) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), buckets = new Map(), gone = [];
  const dyn = (o) => { for (let p = o; p && p !== root; p = p.parent) if (p.userData.dynamic) return true; return false; };
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o === root || dyn(o) || Array.isArray(o.material)) return;
    const cast = opt.cast !== undefined ? opt.cast : o.castShadow;
    const key = o.material.uuid + (cast ? 'c' : '') + (o.receiveShadow ? 'r' : '') + o.renderOrder;
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, cast, recv: o.receiveShadow, ro: o.renderOrder, P: [], N: [], U: [] });
    const b = buckets.get(key), g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry, m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld), nm = new THREE.Matrix3().getNormalMatrix(m);
    const p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m); b.P.push(v.x, v.y, v.z);
      if (n) { v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize(); b.N.push(v.x, v.y, v.z); } else b.N.push(0, 1, 0);
      if (u) b.U.push(u.getX(i), u.getY(i)); else b.U.push(0, 0);
    }
    gone.push(o);
  });
  for (const o of gone) o.parent.remove(o);
  for (const b of buckets.values()) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(b.P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(b.N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(b.U, 2));
    const mm = new THREE.Mesh(g, b.mat); mm.castShadow = b.cast; mm.receiveShadow = b.recv; mm.renderOrder = b.ro; root.add(mm);
  }
  return root;
}
function mesh(g, m, x = 0, y = 0, z = 0, sh = 3) { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = !!(sh & 1); o.receiveShadow = !!(sh & 2); return o; }
function box(w, h, d, m, x, y, z, sh = 3) { return mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, sh); }
function tubeAlong(pts, r, m, seg = 24, rs = 8) { const o = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, rs), m); o.castShadow = true; return o; }

export function makeMats() {
  const bump = T.noiseBump(3, 24, 4), fab = T.fabricBump(), brushed = T.brushedTex();
  return {
    bump, fab,
    steel: std({ color: 0xc9ccd0, metalness: 1, roughness: 0.32, roughnessMap: brushed }),
    chrome: std({ color: 0xe6e8ea, metalness: 1, roughness: 0.14 }),
    white: std({ color: 0xeeece6, roughness: 0.5, metalness: 0.05 }),
    dark: std({ color: 0x25272b, roughness: 0.45 }),
    rubber: std({ color: 0x1b1b1d, roughness: 0.85 }),
    wood: std({ map: T.woodTex(), roughness: 0.42, bumpMap: bump, bumpScale: 0.4 }),
    blob: new THREE.MeshBasicMaterial({ map: T.blobTex(), transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 }),
  };
}

// ---------- 商品 ----------
export function makeMilk(seed) {
  const g = new THREE.Group(), w = 0.07, hb = 0.195, hg = 0.036, r = 0.006, H = 0.243;
  const map = T.milkTex(seed);
  const mat = phys({ map, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35 });
  // 胴: 角丸の正方形断面を押し出し。面の並び: 前(+z) → 右(+x) → 後 → 左
  const ring = [];
  const corner = (cx, cz, a0) => { for (let i = 0; i <= 3; i++) { const a = a0 + (i / 3) * Math.PI / 2; ring.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r, Math.cos(a), Math.sin(a)]); } };
  const k = w / 2 - r;
  corner(-k, k, Math.PI / 2); corner(-k, -k, Math.PI); corner(k, -k, Math.PI * 1.5); corner(k, k, 0);
  // 周長パラメータ: 左前の角の中心から反時計回り → u を面に合わせる
  const pos = [], nor = [], uv = [], idx = [];
  const n = ring.length; let per = 0; const acc = [0];
  for (let i = 0; i < n; i++) { const a = ring[i], b = ring[(i + 1) % n]; per += Math.hypot(a[0] - b[0], a[1] - b[1]); acc.push(per); }
  // 前面中心が u=0.125 になるようにずらす (角0は前面の左端 = u 0 付近)
  for (let j = 0; j <= 1; j++) for (let i = 0; i <= n; i++) {
    const a = ring[i % n]; const u = 1 - acc[i] / per;
    pos.push(a[0], j * hb, a[1]); nor.push(a[2], 0, a[3]); uv.push(u, (j * hb) / H);
  }
  for (let i = 0; i < n; i++) { const a = i, b = i + 1, c = n + 1 + i, d = n + 2 + i; idx.push(a, c, b, b, c, d); }
  const body = new THREE.BufferGeometry();
  body.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); body.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); body.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); body.setIndex(idx);
  // 屋根 (切妻) と折り目
  const P = [], U = [], q = (a, b, c, d, ua, ub, uc, ud) => { P.push(...a, ...b, ...c, ...a, ...c, ...d); U.push(...ua, ...ub, ...uc, ...ua, ...uc, ...ud); };
  const t3 = (a, b, c, ua, ub, uc) => { P.push(...a, ...b, ...c); U.push(...ua, ...ub, ...uc); };
  const h2 = w / 2, yt = hb, yr = hb + hg, yf = hb + hg + 0.012, v0 = hb / H, v1 = (hb + hg) / H, v2 = 1;
  q([-h2, yt, h2], [h2, yt, h2], [h2, yr, 0.002], [-h2, yr, 0.002], [0, v0], [0.25, v0], [0.25, v1], [0, v1]); // 前斜面
  q([h2, yt, -h2], [-h2, yt, -h2], [-h2, yr, -0.002], [h2, yr, -0.002], [0.5, v0], [0.75, v0], [0.75, v1], [0.5, v1]); // 後斜面
  q([-h2, yr, 0.002], [h2, yr, 0.002], [h2, yf, 0.002], [-h2, yf, 0.002], [0, v1], [0.25, v1], [0.25, v2], [0, v2]); // 上のひれ
  q([h2, yr, -0.002], [-h2, yr, -0.002], [-h2, yf, -0.002], [h2, yf, -0.002], [0.5, v1], [0.75, v1], [0.75, v2], [0.5, v2]);
  q([-h2, yf, 0.002], [h2, yf, 0.002], [h2, yf, -0.002], [-h2, yf, -0.002], [0, v2], [0.25, v2], [0.25, v2], [0, v2]);
  for (const s of [1, -1]) { // 側面の折り込み三角
    const x = s * h2, xi = s * (h2 - 0.02), ua = s > 0 ? 0.25 : 0.75, a = [x, yt, s * h2], b = [x, yt, -s * h2], ap = [xi, yr - 0.004, 0], rt = [x, yr, 0];
    t3(a, b, ap, [ua, v0], [ua + 0.25, v0], [ua + 0.125, v1]);
    t3(a, ap, rt, [ua, v0], [ua + 0.125, v1], [ua, v1]); t3(ap, b, rt, [ua + 0.125, v1], [ua + 0.25, v0], [ua + 0.25, v1]);
  }
  q([-h2, 0, -h2], [h2, 0, -h2], [h2, 0, h2], [-h2, 0, h2], [0.02, 0.99], [0.03, 0.99], [0.03, 1], [0.02, 1]); // 底
  const top = new THREE.BufferGeometry(); top.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); top.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); top.computeVertexNormals();
  const m1 = mesh(body, mat), m2 = mesh(top, mat); m2.material = mat.clone(); m2.material.side = THREE.DoubleSide;
  g.add(m1, m2); m1.position.y = m2.position.y = -0.108;
  g.userData = { base: 0.108, h: 0.236, r: 0.05, code: new THREE.Vector3(0.036, 0.0, 0) };
  return g;
}
export function makeApple(variant) {
  const pr = [[0.0005, -0.027], [0.012, -0.033], [0.026, -0.036], [0.036, -0.026], [0.0405, -0.006], [0.039, 0.012], [0.032, 0.028], [0.021, 0.036], [0.011, 0.035], [0.005, 0.029], [0.0005, 0.024]];
  const cv = new THREE.SplineCurve(pr.map((p) => new THREE.Vector2(p[0], p[1])));
  const geo = new THREE.LatheGeometry(cv.getPoints(26), 36);
  const p = geo.attributes.position, v = new THREE.Vector3(), r = T.rng(11 + variant * 7), ph = r() * 6, ax = 0.9 + r() * 0.12;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const a = Math.atan2(v.z, v.x), low = Math.max(0, -v.y / 0.036);
    const k = 1 + 0.035 * Math.cos(a * 5 + ph) * low + 0.02 * Math.cos(a * 2 + ph);
    p.setXYZ(i, v.x * k, v.y * (1 + 0.04 * Math.cos(a + ph)), v.z * k * ax);
  }
  geo.computeVertexNormals();
  const g = new THREE.Group();
  const m = mesh(geo, phys({ map: T.appleTex(variant), roughness: 0.34, clearcoat: 0.5, clearcoatRoughness: 0.3 }));
  const stem = tubeAlong([new THREE.Vector3(0, 0.022, 0), new THREE.Vector3(0.002, 0.034, 0.001), new THREE.Vector3(0.007, 0.047, 0.002)], 0.0016, std({ color: 0x4a3420, roughness: 0.8 }), 6, 5);
  // 小さな丸シール(縞)
  const sc = T.canvas(64, 64), sg = sc.getContext('2d'); sg.fillStyle = '#fff'; sg.beginPath(); sg.arc(32, 32, 31, 0, 7); sg.fill(); T.barcode(sg, 12, 20, 40, 24, 40 + variant);
  const st = new THREE.Mesh(new THREE.CircleGeometry(0.011, 16), std({ map: T.tex(sc), roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -3 }));
  st.position.set(0, 0.004, 0.0405 * ax); g.add(m, stem, st);
  g.userData = { base: 0.038, h: 0.075, r: 0.045, code: new THREE.Vector3(0, 0.004, 0.04) };
  return g;
}
function makeBerry(map, leaf, r) {
  const pr = [[0.0005, -0.019], [0.006, -0.0175], [0.0125, -0.008], [0.0165, 0.004], [0.0155, 0.013], [0.009, 0.0185], [0.0005, 0.0195]];
  const geo = new THREE.LatheGeometry(new THREE.SplineCurve(pr.map((p) => new THREE.Vector2(p[0], p[1]))).getPoints(12), 14);
  const g = new THREE.Group(); g.add(mesh(geo, map, 0, 0, 0, 0));
  const lg = new THREE.ConeGeometry(0.0045, 0.014, 4);
  for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(lg, leaf); const a = (i / 6) * 6.283 + r() * 0.4; l.position.set(Math.cos(a) * 0.007, 0.0195, Math.sin(a) * 0.007); l.rotation.set(Math.sin(a) * 1.25, 0, -Math.cos(a) * 1.25); l.scale.z = 0.35; g.add(l); }
  return g;
}
export function makeBerryPack(seed) {
  const g = new THREE.Group(), W = 0.165, Hh = 0.055, D = 0.115, r = T.rng(seed);
  const pet = phys({ color: 0xffffff, transparent: true, opacity: 0.22, roughness: 0.06, metalness: 0, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.6 });
  const tray = mesh(rbox(W, Hh, D, 0.012, 3), pet, 0, 0, 0, 1); tray.renderOrder = 2; g.add(tray);
  const bm = std({ map: T.strawberryTex(), roughness: 0.4 }), leaf = std({ color: 0x3f7d2c, roughness: 0.7 });
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
    const b = makeBerry(bm, leaf, r); b.position.set(-0.057 + i * 0.038 + (r() - 0.5) * 0.006, -0.004 + r() * 0.004, -0.034 + j * 0.034 + (r() - 0.5) * 0.005);
    b.rotation.set((r() - 0.5) * 0.9, r() * 6, (r() - 0.5) * 0.9 + Math.PI); b.scale.setScalar(0.95 + r() * 0.2); g.add(b);
  }
  // 帯ラベル (上面と前面にまたがる紙帯)
  const lm = std({ map: T.labelTex(seed), roughness: 0.6 });
  const top = mesh(new THREE.PlaneGeometry(W * 0.96, 0.042), lm, 0, Hh / 2 + 0.0008, 0.012, 0); top.rotation.x = -Math.PI / 2;
  const fr = mesh(new THREE.PlaneGeometry(W * 0.96, 0.03), lm, 0, 0.004, D / 2 + 0.0008, 0);
  g.add(top, fr); mergeStatic(g);
  g.userData = { base: 0.0275, h: 0.055, r: 0.075, code: new THREE.Vector3(0.05, 0.004, D / 2) };
  return g;
}
export function makeBread(seed) {
  const g = new THREE.Group(), Ln = 0.4, R = 0.031;
  const pts = []; for (let i = 0; i <= 28; i++) { const t = i / 28; pts.push(new THREE.Vector2(Math.max(0.0005, R * Math.pow(Math.sin(Math.PI * (0.03 + t * 0.94)), 0.42)), (t - 0.5) * Ln)); }
  const geo = new THREE.LatheGeometry(pts, 28);
  const p = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const u = uv.getX(i), vv = uv.getY(i), sl = T.slashMask(u, vv);
    const rr = Math.hypot(v.x, v.z) || 1e-6, k = 1 + 0.07 * Math.min(1, sl * 3) * (1 - Math.min(1, sl * 1.4)) * 2 - 0.05 * Math.min(1, sl * 2) + 0.03 * (T.fbm(u * 6, vv * 12, 3, 3, 6) - 0.5);
    p.setXYZ(i, (v.x / rr) * rr * k, v.y, (v.z / rr) * rr * k * 0.92);
  }
  geo.computeVertexNormals();
  // LatheGeometry の u=0.25 は +x 方向。正面(+z)へ向ける
  const loaf = mesh(geo, std({ map: T.breadTex(), bumpMap: T.breadBump(), bumpScale: 1.4, roughness: 0.72 })); loaf.rotation.y = -Math.PI / 2 + Math.PI; g.add(loaf);
  const sp = []; for (let i = 0; i <= 10; i++) { const t = i / 10; const y = -Ln / 2 - 0.004 + t * 0.19; sp.push(new THREE.Vector2(i === 0 ? 0.004 : R * (0.6 + 0.5 * Math.min(1, t * 5)) + 0.003 + (i === 10 ? 0.002 : 0), y)); }
  const sgeo = new THREE.LatheGeometry(sp, 20);
  const sleeve = mesh(sgeo, std({ map: T.sleeveTex(seed), roughness: 0.82, side: THREE.DoubleSide, bumpMap: T.noiseBump(8, 10, 3), bumpScale: 0.8 })); sleeve.scale.z = 0.95; sleeve.rotation.y = Math.PI / 2; g.add(sleeve);
  g.userData = { base: 0.03, h: Ln, r: 0.05, code: new THREE.Vector3(0, -0.11, 0.034) };
  return g;
}

// ---------- 什器 ----------
let basketMats = null;
export function makeBasket(colr = '#2f8f5b') {
  const g = new THREE.Group(), wt = 0.4, dt = 0.28, wb = 0.34, db = 0.23, h = 0.2;
  if (!basketMats) basketMats = { side: std({ map: T.latticeTex(colr), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.45 }), solid: std({ color: colr, roughness: 0.45 }), hm: std({ color: 0x2a2c30, roughness: 0.5 }) };
  const side = basketMats.side, solid = basketMats.solid;
  const quad = (a, b, c, d, rep) => { const ge = new THREE.BufferGeometry(); ge.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3)); ge.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, rep, 0, rep, 1, 0, 1], 2)); ge.setIndex([0, 1, 2, 0, 2, 3]); ge.computeVertexNormals(); const m = mesh(ge, side); return m; };
  const A = [-wb / 2, 0, db / 2], B = [wb / 2, 0, db / 2], C = [wb / 2, 0, -db / 2], D = [-wb / 2, 0, -db / 2];
  const E = [-wt / 2, h, dt / 2], F = [wt / 2, h, dt / 2], G = [wt / 2, h, -dt / 2], Hh = [-wt / 2, h, -dt / 2];
  g.add(quad(A, B, F, E, 1.5), quad(B, C, G, F, 1), quad(C, D, Hh, G, 1.5), quad(D, A, E, Hh, 1));
  g.add(mesh(rbox(wb, 0.008, db, 0.003, 1), solid, 0, 0.004, 0));
  for (const [w, d, x, z] of [[wt + 0.016, 0.018, 0, dt / 2], [wt + 0.016, 0.018, 0, -dt / 2], [0.018, dt, wt / 2, 0], [0.018, dt, -wt / 2, 0]]) g.add(mesh(rbox(w, 0.018, d, 0.006, 1), solid, x, h, z));
  const hm = basketMats.hm;
  const mkH = (s) => {
    const piv = new THREE.Group(); piv.position.set(0, h, s * dt / 2); piv.userData.dynamic = true;
    const hw = wt / 2 - 0.03, t = tubeAlong([new THREE.Vector3(-hw, 0, 0), new THREE.Vector3(-hw, 0.1, 0), new THREE.Vector3(-hw + 0.04, 0.15, 0), new THREE.Vector3(hw - 0.04, 0.15, 0), new THREE.Vector3(hw, 0.1, 0), new THREE.Vector3(hw, 0, 0)], 0.007, hm, 24, 6);
    piv.add(t); g.add(piv); return piv;
  };
  const h1 = mkH(1), h2 = mkH(-1);
  g.userData.setHandle = (k) => { h1.rotation.x = (1 - k) * 2.86 - k * 0.42; h2.rotation.x = -(1 - k) * 2.86 + k * 0.42; };
  g.userData.setHandle(0); mergeStatic(g);
  return g;
}
export function makeTray() {
  const g = new THREE.Group(), m = std({ color: 0x7c8794, roughness: 0.5 });
  g.add(mesh(rbox(0.37, 0.012, 0.27, 0.005, 1), m, 0, -0.006, 0));
  for (const [w, d, x, z] of [[0.37, 0.012, 0, 0.129], [0.37, 0.012, 0, -0.129], [0.012, 0.27, 0.179, 0], [0.012, 0.27, -0.179, 0]]) g.add(mesh(rbox(w, 0.022, d, 0.005, 1), m, x, 0.004, z));
  const mat = mesh(new THREE.PlaneGeometry(0.34, 0.24), std({ color: 0x59626e, roughness: 0.9 }), 0, 0.0006, 0, 2); mat.rotation.x = -Math.PI / 2; g.add(mat); mergeStatic(g);
  return g;
}
export function makeScanner(M) {
  const g = new THREE.Group(), body = std({ color: 0x2e3136, roughness: 0.38 }), acc = std({ color: 0xb9bec4, roughness: 0.4 });
  const head = mesh(rbox(0.066, 0.05, 0.1, 0.016, 3), body, 0, 0.0, 0.0);
  const win = mesh(new THREE.PlaneGeometry(0.046, 0.028), std({ color: 0x5a0d0d, roughness: 0.1, emissive: 0xff2010, emissiveIntensity: 0.25 }), 0, 0, 0.0505, 0);
  const grip = mesh(rbox(0.04, 0.12, 0.044, 0.014, 3), body, 0, -0.07, -0.03); grip.rotation.x = -0.35;
  const trig = mesh(rbox(0.016, 0.03, 0.014, 0.005, 1), acc, 0, -0.035, 0.004, 0);
  const band = mesh(rbox(0.068, 0.012, 0.03, 0.005, 1), acc, 0, 0.022, 0.03, 0);
  win.userData.dynamic = true; g.add(head, win, grip, trig, band); g.userData.win = win; mergeStatic(g);
  return g;
}

function products(group, M, rows, seedN) {
  // rows: {x0,x1,y,z,depthDir, axis:'x'|'z', fixed}
  const r = T.rng(seedN), ptex = T.productTex();
  const boxG = new THREE.BoxGeometry(1, 1, 1), cylG = new THREE.CylinderGeometry(0.5, 0.5, 1, 14);
  const pal = [0xd9442f, 0xf0b63a, 0x3f8f57, 0x2f6fb5, 0xf2efe6, 0xe07a3a, 0x8a5fb0, 0x5fb3c4, 0xc94f7c, 0x6b4a32];
  const items = [];
  for (const row of rows) {
    let a = row.a0;
    while (a < row.a1 - 0.05) {
      const cyl = r() > 0.55, w = cyl ? 0.06 + r() * 0.03 : 0.07 + r() * 0.09, h = Math.min(row.h || 0.3, 0.1 + r() * 0.17), n = 1 + Math.floor(r() * 3), c = pal[Math.floor(r() * pal.length)], tI = Math.floor(r() * 4);
      for (let k = 0; k < n && a < row.a1 - w; k++) { items.push({ cyl, w, h, a: a + w / 2, row, c, tI, d: cyl ? w : 0.05 + r() * 0.08 }); a += w + 0.006; }
      a += 0.012 + r() * 0.03;
    }
  }
  for (const cyl of [false, true]) {
    const list = items.filter((i) => i.cyl === cyl); if (!list.length) continue;
    const mat = std({ map: ptex, roughness: cyl ? 0.3 : 0.55, metalness: cyl ? 0.3 : 0 });
    const im = new THREE.InstancedMesh(cyl ? cylG : boxG, mat, list.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
    list.forEach((it, i) => {
      const row = it.row, pos = new THREE.Vector3();
      if (row.axis === 'x') pos.set(it.a, row.y + it.h / 2, row.c); else pos.set(row.c, row.y + it.h / 2, it.a);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (row.axis === 'x' ? 0 : Math.PI / 2) + (row.flip ? Math.PI : 0));
      m4.compose(pos, q, new THREE.Vector3(it.w, it.h, it.d)); im.setMatrixAt(i, m4); im.setColorAt(i, col.setHex(it.c));
    });
    im.castShadow = false; im.receiveShadow = true; group.add(im);
  }
}

export function buildStore(M) {
  const g = new THREE.Group(), R = {};
  const Y = L.counterY;
  // 床
  const floor = mesh(new THREE.PlaneGeometry(7, 7), std({ map: T.floorTex(), roughnessMap: T.floorRough(), roughness: 1, metalness: 0.0, envMapIntensity: 0.9 }), 0.2, 0, 0, 2); floor.rotation.x = -Math.PI / 2; g.add(floor);
  // 壁と天井
  const wallM = std({ map: T.plasterTex([0.84, 0.8, 0.72]), roughness: 0.92 }), wallW = std({ map: T.plasterTex([0.8, 0.74, 0.62]), roughness: 0.92 });
  const fz = L.frontZ - 0.1, H = L.wallH;
  const seg = (x0, x1, y0, y1) => g.add(box(x1 - x0, y1 - y0, 0.2, wallM, (x0 + x1) / 2, (y0 + y1) / 2, fz));
  const wx0 = L.winX0, wx1 = L.winX1, wc = (wx0 + wx1) / 2, ww = wx1 - wx0;
  seg(-3.3, wx0, 0, H); seg(wx0, wx1, 0, 0.9); seg(wx0, wx1, 2.6, H); seg(wx1, L.openX0, 0, H); seg(L.openX0, L.openX1, L.openH, H); seg(L.openX1, 3.7, 0, H);
  g.add(box(0.2, H, 7, wallW, -3.4, H / 2, 0), box(0.2, H, 7, wallW, 3.8, H / 2, 0), box(7.4, H, 0.2, wallW, 0.2, H / 2, 3.5));
  const ceil = mesh(new THREE.PlaneGeometry(7.4, 7), std({ color: 0xf2f0ea, roughness: 0.95 }), 0.2, H, 0, 0); ceil.rotation.x = Math.PI / 2; g.add(ceil);
  const lampM = new THREE.MeshBasicMaterial({ color: 0xfff6e2, toneMapped: false });
  for (const [x, z] of [[-1.2, 0.6], [1.2, 0.6], [-1.2, -1.6], [1.2, -1.6], [3.0, 0.6]]) { const p = mesh(new THREE.PlaneGeometry(1.1, 0.32), lampM, x, H - 0.01, z, 0); p.rotation.x = Math.PI / 2; g.add(p); g.add(box(1.16, 0.03, 0.38, M.white, x, H - 0.012, z, 0)); }
  // 窓
  const frameM = std({ color: 0x6f5a45, roughness: 0.6 });
  for (const [w, h, x, y] of [[ww + 0.1, 0.07, wc, 0.9], [ww + 0.1, 0.07, wc, 2.6], [0.07, 1.7, wx0, 1.75], [0.07, 1.7, wx1, 1.75], [0.05, 1.7, wc, 1.75], [ww, 0.05, wc, 1.75]]) g.add(box(w, h, 0.24, frameM, x, y, fz));
  const glass = mesh(new THREE.PlaneGeometry(ww, 1.7), phys({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.03, depthWrite: false, envMapIntensity: 1.2 }), wc, 1.75, fz, 0); g.add(glass);
  g.add(box(ww + 0.1, 0.04, 0.3, frameM, wc, 0.9, fz + 0.1));
  // カウンター
  const cx = (L.counterX0 + L.counterX1) / 2, cw = L.counterX1 - L.counterX0;
  g.add(mesh(rbox(cw + 0.06, 0.045, 0.7, 0.012, 2), M.wood, cx, Y - 0.0225, 0));
  g.add(box(cw, Y - 0.14, 0.6, std({ color: 0xe9e4d8, roughness: 0.55 }), cx, (Y - 0.045 + 0.1) / 2 + 0.03, 0));
  g.add(box(cw - 0.06, 0.1, 0.52, M.dark, cx, 0.05, 0));
  for (let i = 0; i < 4; i++) g.add(box(0.012, Y - 0.2, 0.004, std({ color: 0xcfc8b8, roughness: 0.6 }), L.counterX0 + 0.4 + i * 0.8, Y / 2 + 0.02, 0.302, 0));
  // POS 端末 (画面は無地)
  const pos = new THREE.Group(); pos.position.set(0.93, Y, -0.2);
  pos.add(mesh(rbox(0.3, 0.09, 0.2, 0.012, 2), M.dark, 0, 0.045, 0));
  const scr = mesh(rbox(0.2, 0.15, 0.016, 0.006, 1), M.dark, 0, 0.2, -0.02); scr.rotation.x = -0.3; pos.add(scr);
  const gl = mesh(new THREE.PlaneGeometry(0.18, 0.13), std({ color: 0x11161c, roughness: 0.08, metalness: 0.4 }), 0, 0.2, -0.0105, 0); gl.rotation.x = -0.3; pos.add(gl);
  pos.add(mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.1, 10), M.dark, 0, 0.12, -0.04)); g.add(pos);
  // ボタン
  const btn = new THREE.Group(); btn.position.copy(L.button);
  btn.add(mesh(rbox(0.15, 0.03, 0.14, 0.012, 2), std({ color: 0xd9dbd8, roughness: 0.35 }), 0, 0.015, 0));
  btn.add(mesh(new THREE.CylinderGeometry(0.06, 0.062, 0.012, 32), M.dark, 0, 0.034, 0));
  const cap = mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.03, 36), phys({ color: 0xf0a01a, roughness: 0.25, clearcoat: 0.6 }), 0, 0.052, 0);
  const dome = mesh(new THREE.SphereGeometry(0.052, 32, 10, 0, 6.283, 0, Math.PI / 2), cap.material, 0, 0.015, 0); dome.scale.y = 0.22; cap.add(dome);
  cap.userData.dynamic = true; btn.add(cap); g.add(btn); R.btnCap = cap;
  // スキャナー台
  const sst = new THREE.Group(); sst.position.set(L.scanner.x, Y, L.scanner.z);
  sst.add(mesh(new THREE.CylinderGeometry(0.055, 0.062, 0.016, 24), M.dark, 0, 0.008, 0));
  sst.add(tubeAlong([new THREE.Vector3(0, 0.01, 0), new THREE.Vector3(0, 0.06, -0.01), new THREE.Vector3(0, 0.09, 0.0)], 0.008, M.dark, 8, 8));
  sst.add(mesh(rbox(0.05, 0.02, 0.06, 0.006, 1), M.dark, 0, 0.088, 0.006)); g.add(sst);
  // 袋掛け
  const rack = new THREE.Group(); rack.position.copy(L.rack);
  rack.add(mesh(rbox(0.36, 0.008, 0.2, 0.003, 1), M.steel, 0, 0.004, -0.02));
  rack.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, PEG_Y + 0.03, 10), M.chrome, 0, (PEG_Y + 0.03) / 2, -0.1));
  const bar = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.46, 10), M.chrome, 0, PEG_Y - 0.004, -0.085); bar.rotation.z = Math.PI / 2; rack.add(bar);
  for (const px of PEG_X) rack.add(tubeAlong([new THREE.Vector3(px, PEG_Y - 0.004, -0.085), new THREE.Vector3(px, PEG_Y - 0.006, -0.03), new THREE.Vector3(px, PEG_Y - 0.006, 0.012), new THREE.Vector3(px, PEG_Y + 0.006, 0.022)], 0.0045, M.chrome, 10, 6));
  g.add(rack);
  // ゴンドラ棚
  const sh = new THREE.Group(), SX = L.shelfX;
  const wsteel = std({ color: 0xe8e6e0, roughness: 0.42, metalness: 0.35 });
  for (const x of [-0.42, 0.42]) sh.add(box(0.035, 1.72, 0.03, wsteel, SX + x, 0.86, -0.41));
  const perf = T.canvas(128, 128), pg = perf.getContext('2d'); pg.fillStyle = '#d9d6cd'; pg.fillRect(0, 0, 128, 128); pg.fillStyle = '#b9b6ad'; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { pg.beginPath(); pg.arc(8 + x * 16, 8 + y * 16, 1.9, 0, 7); pg.fill(); }
  sh.add(box(0.84, 1.3, 0.012, std({ map: T.tex(perf, { repeat: [10, 15] }), roughness: 0.55, metalness: 0.2 }), SX, 1.05, -0.425));
  sh.add(box(0.86, 0.14, 0.46, wsteel, SX, 0.07, -0.2)); sh.add(box(0.86, 0.02, 0.46, wsteel, SX, 0.43, -0.2));
  sh.add(box(0.86, 0.3, 0.02, wsteel, SX, 0.28, -0.42));
  // 上段の板と値札レール(無地)
  sh.add(box(0.86, 0.025, 0.34, wsteel, SX, L.shelfTopY - 0.0125, -0.13));
  sh.add(box(0.86, 0.032, 0.006, std({ color: 0xf6f4ee, roughness: 0.4 }), SX, L.shelfTopY - 0.016, 0.043, 0));
  for (const x of L.milkX) sh.add(box(0.05, 0.022, 0.002, std({ color: 0xf2c94c, roughness: 0.5 }), x, L.shelfTopY - 0.016, 0.047, 0));
  sh.add(box(0.86, 0.025, 0.3, wsteel, SX, 1.7 - 0.0125, -0.24));
  for (const [bx, bz] of [[-0.42, 0.03], [0.42, 0.03]]) sh.add(tubeAlong([new THREE.Vector3(SX + bx, L.shelfTopY - 0.02, bz), new THREE.Vector3(SX + bx, L.shelfTopY - 0.2, -0.4)], 0.006, wsteel, 2, 6));
  // 傾斜トレー
  const tr = new THREE.Group(); const slope = Math.atan2(0.298, 0.954);
  tr.position.set(SX, 0.8, 0.03); tr.rotation.x = slope;
  tr.add(box(0.6, 0.014, 0.36, M.wood, 0, -0.007, -0.17));
  const matG = mesh(new THREE.PlaneGeometry(0.57, 0.33), std({ color: 0x4f7a4a, roughness: 0.95, bumpMap: M.fab, bumpScale: 0.6 }), 0, 0.0008, -0.17, 2); matG.rotation.x = -Math.PI / 2; tr.add(matG);
  for (const x of [-0.29, -0.09, 0.09, 0.29]) { const w = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.35, 6), M.chrome, x, 0.022, -0.17); w.rotation.x = Math.PI / 2; tr.add(w); }
  for (const y of [0.012, 0.03]) { const w = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.6, 6), M.chrome, 0, y, 0.004); w.rotation.z = Math.PI / 2; tr.add(w); }
  for (const x of [-0.29, -0.09, 0.09, 0.29]) tr.add(mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.04, 6), M.chrome, x, 0.015, 0.004));
  sh.add(tr);
  for (const x of [-0.41, 0.41]) sh.add(tubeAlong([new THREE.Vector3(SX + x, 0.78, 0.03), new THREE.Vector3(SX + x, 0.88, -0.41)], 0.007, wsteel, 2, 6));
  // パンのかご
  const bin = mesh(new THREE.CylinderGeometry(0.088, 0.07, 0.17, 24, 1, true), std({ map: T.wickerTex(), roughness: 0.8, side: THREE.DoubleSide, bumpMap: T.wickerTex(), bumpScale: 1.2 }), L.bin.x, L.bin.y + 0.085, L.bin.z);
  sh.add(bin, mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.006, 20), std({ color: 0x8a6a40, roughness: 0.8 }), L.bin.x, L.bin.y + 0.004, L.bin.z));
  const rimB = mesh(new THREE.TorusGeometry(0.088, 0.006, 6, 24), std({ color: 0x9a7444, roughness: 0.7 }), L.bin.x, L.bin.y + 0.17, L.bin.z); rimB.rotation.x = Math.PI / 2; sh.add(rimB);
  g.add(sh);
  // 壁の棚
  const wallShelf = (axis, a0, a1, c, ys, flip, seedN) => {
    const rows = [];
    for (const y of ys) {
      const len = a1 - a0, mid = (a0 + a1) / 2;
      g.add(axis === 'x' ? box(len, 0.03, 0.32, M.wood, mid, y, c) : box(0.32, 0.03, len, M.wood, c, y, mid));
      rows.push({ axis, a0, a1, y: y + 0.015, c, h: 0.3, flip });
    }
    products(g, M, rows, seedN);
  };
  wallShelf('z', -2.9, 2.9, -3.13, [0.5, 0.95, 1.4, 1.85], false, 21);
  wallShelf('z', -2.6, 3.0, 3.53, [0.5, 0.95, 1.4, 1.85], true, 22);
  wallShelf('x', -2.8, 3.3, 3.23, [0.5, 0.95, 1.4, 1.85], false, 23);
  // 数字のない壁時計
  const ck = T.canvas(128, 128), cg = ck.getContext('2d'); cg.fillStyle = '#f7f5ee'; cg.beginPath(); cg.arc(64, 64, 62, 0, 7); cg.fill();
  cg.strokeStyle = '#3a3835'; cg.lineCap = 'round'; for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; cg.lineWidth = i % 3 ? 2 : 5; cg.beginPath(); cg.moveTo(64 + Math.cos(a) * 50, 64 + Math.sin(a) * 50); cg.lineTo(64 + Math.cos(a) * 57, 64 + Math.sin(a) * 57); cg.stroke(); }
  cg.lineWidth = 5; cg.beginPath(); cg.moveTo(64, 64); cg.lineTo(42, 44); cg.stroke(); cg.lineWidth = 3; cg.beginPath(); cg.moveTo(64, 64); cg.lineTo(64, 20); cg.stroke();
  const clock = mesh(new THREE.CircleGeometry(0.15, 32), std({ map: T.tex(ck), roughness: 0.4 }), -0.1, 2.0, fz + 0.115, 0); g.add(clock);
  const crim = mesh(new THREE.TorusGeometry(0.152, 0.012, 8, 32), M.dark, -0.1, 2.0, fz + 0.115, 0); g.add(crim);
  // 納品箱 (段ボール) と台
  const cr = new THREE.Group(); cr.position.copy(L.crate);
  const cb = std({ map: T.cardboardTex(), roughness: 0.85, side: THREE.DoubleSide });
  const cw2 = 0.38, cd = 0.27, ch = 0.2;
  cr.add(box(cw2, 0.006, cd, cb, 0, 0.003, 0));
  for (const [w, d, x, z] of [[cw2, 0.006, 0, cd / 2], [cw2, 0.006, 0, -cd / 2], [0.006, cd, cw2 / 2, 0], [0.006, cd, -cw2 / 2, 0]]) cr.add(box(w, ch, d, cb, x, ch / 2, z));
  const flap = (w, d, x, z, rx, rz) => { const p = new THREE.Group(); p.position.set(x, ch, z); const f = box(w, 0.005, d, cb, rx ? 0 : (rz > 0 ? -w / 2 : w / 2), 0, rx ? (rx > 0 ? d / 2 : -d / 2) : 0); p.add(f); p.rotation.set(rx || 0, 0, rz || 0); cr.add(p); };
  flap(cw2, 0.13, 0, cd / 2, 0.75, 0); flap(cw2, 0.13, 0, -cd / 2, -2.2, 0); flap(0.13, cd, cw2 / 2, 0, 0, -0.95); flap(0.13, cd, -cw2 / 2, 0, 0, 0.95);
  cr.add(box(0.2, 0.004, cd - 0.012, cb, 0.085, 0.105, 0)); // 小物用の中敷き
  cr.add(box(0.05, ch + 0.002, 0.002, std({ color: 0xd8c59a, roughness: 0.5 }), 0, ch / 2, cd / 2 + 0.004, 0));
  g.add(cr);
  const slat = std({ color: 0xb78d5a, roughness: 0.75, map: T.woodTex() });
  for (let i = 0; i < 3; i++) g.add(box(0.44, 0.07, 0.02, slat, L.crate.x, 0.045 + i * 0.09, L.crate.z + 0.15), box(0.44, 0.07, 0.02, slat, L.crate.x, 0.045 + i * 0.09, L.crate.z - 0.15));
  for (const x of [-0.21, 0.21]) for (let i = 0; i < 3; i++) g.add(box(0.02, 0.07, 0.3, slat, L.crate.x + x, 0.045 + i * 0.09, L.crate.z));
  g.add(box(0.44, 0.015, 0.32, slat, L.crate.x, L.crate.y - 0.0075, L.crate.z));
  // かご置き台
  const st = new THREE.Group(); st.position.set(L.stand.x, 0, L.stand.z);
  for (const [x, z] of [[-0.2, -0.14], [0.2, -0.14], [-0.2, 0.14], [0.2, 0.14]]) st.add(mesh(new THREE.CylinderGeometry(0.009, 0.009, L.stand.y, 8), M.chrome, x, L.stand.y / 2, z));
  st.add(mesh(rbox(0.44, 0.012, 0.32, 0.004, 1), M.steel, 0, L.stand.y - 0.006, 0)); st.add(mesh(rbox(0.44, 0.012, 0.32, 0.004, 1), M.steel, 0, 0.066, 0));
  g.add(st);
  for (let i = 0; i < 2; i++) { const b = makeBasket(); b.position.copy(L.stack).add(new THREE.Vector3(0, i * 0.05, 0)); g.add(b); }
  mergeStatic(g);
  return { group: g, refs: R };
}

export function buildExterior(M) {
  const g = new THREE.Group(), R = {};
  const fz = L.frontZ - 0.2; // 外壁面
  const sm = std({ map: T.sidingTex(), roughness: 0.8 });
  const seg = (x0, x1, y0, y1) => g.add(box(x1 - x0, y1 - y0, 0.04, sm, (x0 + x1) / 2, (y0 + y1) / 2, fz - 0.02));
  seg(-3.4, L.winX0, 0, 3.4); seg(L.winX0, L.winX1, 0, 0.9); seg(L.winX0, L.winX1, 2.6, 3.4); seg(L.winX1, L.openX0, 0, 3.4); seg(L.openX0, L.openX1, L.openH + 0.25, 3.4); seg(L.openX1, 3.9, 0, 3.4);
  g.add(box(7.6, 0.25, 0.5, std({ color: 0x5b4a3c, roughness: 0.7 }), 0.2, 3.5, fz + 0.15));
  // 日よけ (しま模様)
  const aw = mesh(new THREE.PlaneGeometry(3.5, 1.0, 12, 1), std({ map: T.stripeTex('#f6f1e4', '#3f8f6b', 12), roughness: 0.85, side: THREE.DoubleSide }), (L.openX0 + L.openX1) / 2, 2.9, fz - 0.46); aw.rotation.x = -Math.PI / 2 + 0.5; aw.rotation.z = Math.PI; g.add(aw);
  const val = mesh(new THREE.PlaneGeometry(3.5, 0.16), aw.material, (L.openX0 + L.openX1) / 2, 2.6, fz - 0.9, 1); val.rotation.y = Math.PI; g.add(val);
  // シャッターケースとレール
  const al = std({ color: 0xb9bcbd, metalness: 0.9, roughness: 0.4 });
  g.add(box(L.openX1 - L.openX0 + 0.16, 0.26, 0.24, al, (L.openX0 + L.openX1) / 2, L.openH + 0.13, L.frontZ - 0.12));
  for (const x of [L.openX0 - 0.03, L.openX1 + 0.03]) g.add(box(0.06, L.openH, 0.08, al, x, L.openH / 2, L.frontZ - 0.12));
  // シャッター本体
  const sw = L.openX1 - L.openX0, clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), L.openH + 0.02);
  const cm = std({ map: T.shutterTex(), bumpMap: T.shutterBump(), bumpScale: 3, metalness: 0.75, roughness: 0.45, side: THREE.DoubleSide, clippingPlanes: [clip] });
  cm.map.repeat.set(1, 3); cm.bumpMap.repeat.set(1, 3);
  const sht = new THREE.Group(); sht.position.set((L.openX0 + L.openX1) / 2, 0, L.frontZ - 0.12);
  const curtain = mesh(new THREE.PlaneGeometry(sw, L.openH + 0.1), cm, 0, (L.openH + 0.1) / 2 + 0.07, 0); sht.add(curtain);
  const bar = mesh(rbox(sw, 0.09, 0.05, 0.012, 1), al, 0, 0.045, 0); sht.add(bar);
  const hm = std({ color: 0x33363a, roughness: 0.5, metalness: 0.3 });
  for (const z of [0.04, -0.04]) { const hd = tubeAlong([new THREE.Vector3(-0.55, 0.05, z * 0.6), new THREE.Vector3(-0.5, 0.05, z * 1.9), new THREE.Vector3(0.5, 0.05, z * 1.9), new THREE.Vector3(0.55, 0.05, z * 0.6)], 0.016, hm, 16, 8); sht.add(hd); }
  mergeStatic(sht); sht.userData.dynamic = true; g.add(sht); R.shutter = sht;
  // 歩道・道路・向かい
  const walk = mesh(new THREE.PlaneGeometry(16, 3.2), std({ map: T.paverTex(), roughness: 0.85 }), 1, 0.0, fz - 1.6, 2); walk.rotation.x = -Math.PI / 2; g.add(walk);
  g.add(box(16, 0.12, 0.16, std({ color: 0xb8b4aa, roughness: 0.8 }), 1, -0.02, fz - 3.2));
  const road = mesh(new THREE.PlaneGeometry(30, 7), std({ map: T.asphaltTex(), roughness: 0.9 }), 1, -0.06, fz - 6.7, 2); road.rotation.x = -Math.PI / 2; g.add(road);
  const walk2 = mesh(new THREE.PlaneGeometry(30, 3), std({ map: T.paverTex(), roughness: 0.85 }), 1, 0.0, fz - 11.7, 2); walk2.rotation.x = -Math.PI / 2; g.add(walk2);
  const r = T.rng(77), bcols = [0xe6dccb, 0xd7c0a6, 0xc9d3d6, 0xe9e2d6, 0xcdb9a0];
  let bx = -9;
  while (bx < 12) {
    const w = 2.6 + r() * 2.2, h = 3.2 + r() * 2.6, c = bcols[Math.floor(r() * bcols.length)];
    const b = box(w, h, 3, std({ color: c, roughness: 0.85 }), bx + w / 2, h / 2, fz - 14.7, 2); g.add(b);
    const wm = std({ color: 0x5d7183, roughness: 0.15, metalness: 0.5 });
    for (let fl = 0; fl < Math.floor(h / 1.5); fl++) for (let k = 0; k < Math.floor(w / 1.1); k++) g.add(box(0.6, 0.75, 0.05, wm, bx + 0.6 + k * 1.1, 1.0 + fl * 1.5, fz - 13.19, 0));
    g.add(box(w, 0.12, 3.1, std({ color: 0x8a7a6a, roughness: 0.8 }), bx + w / 2, h + 0.06, fz - 14.7, 0));
    bx += w + 0.05;
  }
  // 街路樹と植木鉢
  const leafM = std({ map: T.leafTex(), roughness: 0.85 }), trunkM = std({ color: 0x5a4433, roughness: 0.9 }), potM = std({ color: 0xb5633c, roughness: 0.8 });
  const blob = (x, y, z, s, n, seedN) => { const rr = T.rng(seedN), geo = new THREE.IcosahedronGeometry(1, 3); for (let i = 0; i < n; i++) { const m = mesh(geo, leafM, x + (rr() - 0.5) * s * 1.6, y + (rr() - 0.5) * s, z + (rr() - 0.5) * s * 1.6); m.scale.setScalar(s * (0.5 + rr() * 0.4)); g.add(m); } };
  for (const tx of [-2.6, 4.9]) { g.add(mesh(new THREE.CylinderGeometry(0.07, 0.1, 2.3, 8), trunkM, tx, 1.15, fz - 11.0)); blob(tx, 3.1, fz - 11.0, 1.05, 12, tx * 10 + 99); }
  for (const [px, s] of [[-0.12, 0.28], [3.45, 0.36]]) { g.add(mesh(new THREE.CylinderGeometry(0.17, 0.12, 0.3, 14), potM, px, 0.15, fz - 0.42)); blob(px, 0.5 + s * 0.4, fz - 0.42, s, 6, px * 31 + 7); }
  // ベンチ
  const bw = std({ map: T.woodTex(), roughness: 0.6 });
  g.add(box(1.2, 0.04, 0.3, bw, -1.2, 0.42, fz - 0.42), box(0.06, 0.42, 0.28, M.dark, -1.7, 0.21, fz - 0.42), box(0.06, 0.42, 0.28, M.dark, -0.7, 0.21, fz - 0.42));
  // 空
  const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 24, 12), new THREE.MeshBasicMaterial({ map: T.skyTex(), side: THREE.BackSide, toneMapped: false, fog: false })); sky.position.y = -6; sky.userData.dynamic = true; g.add(sky);
  mergeStatic(g);
  return { group: g, refs: R };
}

// 環境マップ用の簡易な部屋 (天井灯と窓の明るさ)
export function buildEnvScene() {
  const s = new THREE.Scene();
  const bm = (c, k) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.BackSide });
  s.add(new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), bm(0xcfc6b6, 0.55)));
  const pm = (w, h, x, y, z, rx, ry, c, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); s.add(m); };
  pm(8, 8, 0, -1.99, 0, -Math.PI / 2, 0, 0xb5aa98, 0.5);
  for (const [x, z] of [[-1.5, 1], [1.5, 1], [-1.5, -1.5], [1.5, -1.5]]) pm(1.6, 0.6, x, 1.98, z, Math.PI / 2, 0, 0xfff4dc, 9);
  pm(3.4, 2.4, 1.2, -0.3, -3.98, 0, 0, 0xdfeeff, 7); pm(1.8, 1.6, -1.8, 0.2, -3.98, 0, 0, 0xdfeeff, 6);
  pm(8, 1.2, 0, 1.2, 3.98, 0, Math.PI, 0xfff0d8, 1.2);
  return s;
}
