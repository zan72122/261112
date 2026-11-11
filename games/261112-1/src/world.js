// Static world: laundry room, washer, balcony, drying stand, counter. Real-size metres.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as TX from './tex.js';
import { TAU } from './util.js';

export const L = {
  wallZ: -0.36, extZ: -0.48,
  port: { x: 0, y: 0.45, z: 0.27, r: 0.165 },
  drum: { cx: 0, cy: 0.45, R: 0.225, zb: -0.25, zf: 0.19 },
  knob: { x: 0.14, y: 0.785, z: 0.283, r: 0.05 },
  hinge: { x: 0.245, y: 0.45, z: 0.275 },
  basket: { w: 0.60, d: 0.42, h: 0.15, floor: 0.05 },
  stWash: { x: -0.7, y: 0, z: 0.6 },
  stBal: { x: 3.32, y: 0, z: -2.0 },
  stFold: { x: -1.56, y: 0, z: 0.78 },
  stShelf: { x: -1.56, y: 0.065, z: -0.02 },
  door: { x0: 0.55, x1: 1.85, h: 2.05 },
  eaveZ: -2.05, eaveY: 2.45, parapetZ: -3.85,
  rods: [{ x: 2.45, y: 1.30 }, { x: 2.85, y: 1.02 }], rodHalf: 0.66, rodR: 0.011,
  standZ: [-2.9, -1.25], standZ0: -2.4,
  counter: { x0: -2.75, x1: -1.15, z0: -0.36, z1: 0.26, top: 0.72 },
  drawer: { x0: -2.70, x1: -1.98, y0: 0.47, depth: 0.50, zFront: 0.26, travel: 0.44 },
  person: { x: -3.06, z: -0.02 },
};

export function buildWorld(scene, low) {
  const W = {};
  const M = W.mat = {};
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const wallN = TX.noiseNormal(256, 6, 1.2, 3);
  M.wall = std({ color: 0xf1ece2, roughness: 0.94, normalMap: wallN, normalScale: new THREE.Vector2(0.25, 0.25) });
  M.white = std({ color: 0xf6f5f1, roughness: 0.55 });
  M.enamel = new THREE.MeshPhysicalMaterial({ color: 0xf5f5f3, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.18 });
  M.chrome = std({ color: 0xe2e6e9, metalness: 1, roughness: 0.14 });
  const brushed = TX.brushedTex();
  M.steel = std({ color: 0xffffff, map: brushed, metalness: 1, roughness: 0.3 });
  M.rubber = std({ color: 0x2b2d30, roughness: 0.78 });
  M.darkGloss = new THREE.MeshPhysicalMaterial({ color: 0x191b1e, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
  M.glass = std({ color: 0xd4e6ea, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.2, depthWrite: false, envMapIntensity: 1.8 });
  M.alu = std({ color: 0x55504a, metalness: 0.9, roughness: 0.42 });
  const floorT = TX.woodPlanks({ seed: 5, rows: 8, base: [203, 166, 120], repeat: [7, 7] });
  M.floor = std({ map: floorT.map, normalMap: floorT.normalMap, roughness: 0.52, normalScale: new THREE.Vector2(0.5, 0.5) });
  M.oak = std({ map: TX.woodPlain([206, 170, 124], 9), roughness: 0.5 });
  M.birch = std({ map: TX.woodPlain([232, 212, 180], 19), roughness: 0.6 });
  const feltN = TX.feltNormal(); feltN.repeat.set(7, 4);
  M.felt = std({ color: 0x9d9a92, roughness: 1, normalMap: feltN, normalScale: new THREE.Vector2(0.5, 0.5) });
  M.leather = std({ color: 0x8a5a36, roughness: 0.6 });
  const blob = TX.blobTex();
  const mesh = (g, m, x = 0, y = 0, z = 0, parent = scene) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };
  const box = (w, h, d, m, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, parent);
  const rbox = (w, h, d, r, m, x, y, z, parent) => mesh(new RoundedBoxGeometry(w, h, d, 3, r), m, x, y, z, parent);
  const tube = (a, b, r, m, parent) => { // cylinder between two points
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b), d = vb.clone().sub(va), len = d.length();
    const o = mesh(new THREE.CylinderGeometry(r, r, len, 14), m, 0, 0, 0, parent);
    o.position.copy(va).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o;
  };
  const shadowBlob = (x, z, sx, sz, op = 1, y = 0.004, parent = scene) => {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), new THREE.MeshBasicMaterial({ map: blob, transparent: true, opacity: op, depthWrite: false }));
    o.rotation.x = -Math.PI / 2; o.position.set(x, y, z); o.renderOrder = 1; parent.add(o); return o;
  };
  W.shadowBlob = shadowBlob;

  // ---------- room shell ----------
  const floor = mesh(new THREE.PlaneGeometry(11.2, 5), M.floor, 2.0, 0, 2.14); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  const wallH = 2.7;
  box(4.15, wallH, 0.12, M.wall, -1.525, wallH / 2, -0.42);            // back wall left of door
  box(5.75, wallH, 0.12, M.wall, 4.725, wallH / 2, -0.42);             // right of door
  box(1.3, wallH - L.door.h, 0.12, M.wall, 1.2, (wallH + L.door.h) / 2, -0.42); // lintel
  box(0.12, wallH, 5.2, M.wall, -3.66, wallH / 2, 2.2);                // left wall
  const ceil = box(11.5, 0.1, 5.4, new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }), 2, wallH + 0.05, 2.2); ceil.receiveShadow = false;   // only shades the room from the sun
  box(4.1, 0.09, 0.014, M.white, -1.5, 0.045, -0.353); box(0.014, 0.09, 5, M.white, -3.593, 0.045, 2.2);
  // sliding glass door (left half open, panels parked on the right)
  const fr = 0.05;
  box(fr, L.door.h, 0.13, M.alu, L.door.x0 - fr / 2, L.door.h / 2, -0.42);
  box(fr, L.door.h, 0.13, M.alu, L.door.x1 + fr / 2, L.door.h / 2, -0.42);
  box(1.4, fr, 0.13, M.alu, 1.2, L.door.h + fr / 2, -0.42);
  box(1.3, 0.025, 0.13, M.alu, 1.2, 0.0125, -0.42);
  const panel = new THREE.Group(); panel.position.set(1.53, 0, -0.40); scene.add(panel); W.doorPanel = panel;
  for (const dz of [0, -0.045]) {
    const px = dz ? 0.02 : -0.02;
    box(0.045, 1.98, 0.03, M.alu, px - 0.31, 1.02, dz, panel); box(0.045, 1.98, 0.03, M.alu, px + 0.31, 1.02, dz, panel);
    box(0.66, 0.05, 0.03, M.alu, px, 2.0, dz, panel); box(0.66, 0.07, 0.03, M.alu, px, 0.06, dz, panel);
    const gl = mesh(new THREE.PlaneGeometry(0.6, 1.9), M.glass, px, 1.03, dz, panel); gl.castShadow = false; gl.material = M.glass;
  }
  const dh = rbox(0.022, 0.2, 0.03, 0.008, M.chrome, -0.33, 1.0, 0.03, panel); W.doorHandle = dh;

  // shelf above washer with plain household things
  box(0.95, 0.03, 0.2, M.oak, 0, 1.3, -0.25);
  box(0.02, 0.12, 0.16, M.white, -0.38, 1.225, -0.26); box(0.02, 0.12, 0.16, M.white, 0.38, 1.225, -0.26);
  const bottle = (x, col, h, r) => { mesh(new THREE.CylinderGeometry(r, r, h, 20), std({ color: col, roughness: 0.42 }), x, 1.315 + h / 2, -0.25); mesh(new THREE.CylinderGeometry(r * 0.42, r * 0.42, 0.035, 14), M.white, x, 1.315 + h + 0.017, -0.25); };
  bottle(-0.3, 0xe9eef0, 0.2, 0.045); bottle(-0.17, 0xcfd9c6, 0.15, 0.04);
  const jar = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.13, 20), std({ color: 0xdfeef0, roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false }), 0.02, 1.38, -0.25); jar.castShadow = false;
  mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.06, 20), std({ color: 0xf7f5ee, roughness: 0.8 }), 0.02, 1.35, -0.25);
  mesh(new THREE.CylinderGeometry(0.054, 0.054, 0.02, 20), M.oak, 0.02, 1.455, -0.25);
  // small plant
  mesh(new THREE.CylinderGeometry(0.055, 0.042, 0.09, 18), std({ color: 0xb9694a, roughness: 0.85 }), 0.3, 1.36, -0.25);
  const leafM = std({ color: 0x4f8a48, roughness: 0.6, side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, lf = mesh(new THREE.SphereGeometry(0.05, 10, 8), leafM, 0.3 + Math.cos(a) * 0.035, 1.46 + (i % 3) * 0.035, -0.25 + Math.sin(a) * 0.03); lf.scale.set(0.55, 1.1, 0.16); lf.rotation.set(Math.sin(a) * 0.6, a, Math.cos(a) * 0.6); }

  // ---------- washer ----------
  const ws = new THREE.Group(); scene.add(ws); W.washer = ws;
  const sh = new THREE.Shape(); sh.moveTo(-0.3, 0.05); sh.lineTo(0.3, 0.05); sh.lineTo(0.3, 0.84); sh.lineTo(-0.3, 0.84); sh.closePath();
  const hole = new THREE.Path(); hole.absarc(0, L.port.y, 0.17, 0, TAU, true); sh.holes.push(hole);
  const front = mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.024, bevelEnabled: false, curveSegments: 64 }), M.enamel, 0, 0, 0.246, ws);
  front.name = 'front';
  box(0.012, 0.8, 0.572, M.enamel, -0.294, 0.445, -0.044, ws); box(0.012, 0.8, 0.572, M.enamel, 0.294, 0.445, -0.044, ws);
  box(0.6, 0.012, 0.585, M.enamel, 0, 0.051, -0.04, ws); box(0.6, 0.8, 0.012, M.enamel, 0, 0.445, -0.327, ws);
  rbox(0.604, 0.03, 0.62, 0.012, M.enamel, 0, 0.838, -0.03, ws);
  box(0.56, 0.05, 0.5, M.rubber, 0, 0.025, -0.05, ws);
  // control strip
  rbox(0.56, 0.105, 0.012, 0.005, M.darkGloss, 0, 0.785, 0.272, ws);
  rbox(0.17, 0.075, 0.012, 0.005, M.enamel, -0.18, 0.785, 0.277, ws);      // detergent drawer face
  rbox(0.09, 0.018, 0.012, 0.005, M.darkGloss, -0.18, 0.765, 0.281, ws);
  const led = mesh(new THREE.SphereGeometry(0.006, 10, 8), new THREE.MeshStandardMaterial({ color: 0x223322, emissive: 0x66ff99, emissiveIntensity: 0 }), 0.235, 0.785, 0.28, ws); W.led = led; led.castShadow = false;
  // knob
  const knob = new THREE.Group(); knob.position.set(L.knob.x, L.knob.y, 0.278); ws.add(knob); W.knob = knob;
  const kc = mesh(new THREE.CylinderGeometry(L.knob.r, L.knob.r * 1.04, 0.034, 48, 1, true), M.steel, 0, 0, 0.017, knob); kc.rotation.x = Math.PI / 2;
  const kt = mesh(new THREE.CircleGeometry(L.knob.r, 48), std({ map: TX.knobTex(), metalness: 1, roughness: 0.3 }), 0, 0, 0.0342, knob);
  kt.castShadow = false;
  const kr = mesh(new THREE.TorusGeometry(L.knob.r * 1.08, 0.004, 8, 48), M.chrome, L.knob.x, L.knob.y, 0.279, ws);
  // port ring + gasket
  mesh(new THREE.TorusGeometry(0.176, 0.01, 12, 64), M.chrome, 0, L.port.y, 0.268, ws);
  const gk = mesh(new THREE.LatheGeometry([new THREE.Vector2(0.17, 0), new THREE.Vector2(0.162, -0.012), new THREE.Vector2(0.168, -0.03), new THREE.Vector2(0.185, -0.045), new THREE.Vector2(0.2, -0.06), new THREE.Vector2(0.226, -0.075)], 56), std({ color: 0x3a3c40, roughness: 0.7, side: THREE.DoubleSide }), 0, L.port.y, 0.266, ws);
  gk.rotation.x = Math.PI / 2;
  // drum (rotates about z)
  const drum = new THREE.Group(); drum.position.set(L.drum.cx, L.drum.cy, 0); ws.add(drum); W.drum = drum;
  const dt = TX.drumTextures(), dl = L.drum.zf - L.drum.zb;
  const dm = std({ map: dt.map, normalMap: dt.normalMap, metalness: 1, roughness: 0.26, side: THREE.BackSide, normalScale: new THREE.Vector2(-0.8, -0.8) });
  const dc = mesh(new THREE.CylinderGeometry(L.drum.R + 0.004, L.drum.R + 0.004, dl, 64, 1, true), dm, 0, 0, (L.drum.zf + L.drum.zb) / 2, drum); dc.rotation.x = Math.PI / 2; dc.castShadow = false;
  const backM = std({ color: 0xffffff, map: brushed, metalness: 1, roughness: 0.3 });
  const bp = mesh(new THREE.CircleGeometry(L.drum.R + 0.004, 48), std({ map: TX.knobTex(true), metalness: 1, roughness: 0.34 }), 0, 0, L.drum.zb, drum); bp.castShadow = false;
  mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.012, 24), M.steel, 0, 0, L.drum.zb + 0.006, drum).rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * TAU + 0.5, lf = rbox(0.05, 0.03, dl - 0.04, 0.012, M.steel, Math.cos(a) * (L.drum.R - 0.012), Math.sin(a) * (L.drum.R - 0.012), (L.drum.zf + L.drum.zb) / 2, drum);
    lf.rotation.z = a + Math.PI / 2; lf.castShadow = false;
  }
  const lip = mesh(new THREE.RingGeometry(0.2, L.drum.R + 0.004, 48), std({ color: 0xffffff, map: brushed, metalness: 1, roughness: 0.3, side: THREE.DoubleSide }), 0, 0, L.drum.zf, drum); lip.castShadow = false;
  // dark outer tub behind the perforations
  const tub = mesh(new THREE.CylinderGeometry(L.drum.R + 0.02, L.drum.R + 0.02, dl + 0.03, 32, 1, true), std({ color: 0x15171a, roughness: 0.9, side: THREE.BackSide }), 0, L.drum.cy, (L.drum.zf + L.drum.zb) / 2, ws); tub.rotation.x = Math.PI / 2; tub.castShadow = false;
  // door (hinged on the right)
  const door = new THREE.Group(); door.position.set(L.hinge.x, L.hinge.y, L.hinge.z); ws.add(door); W.door = door;
  const dcx = -L.hinge.x;
  const ring = mesh(new THREE.LatheGeometry([new THREE.Vector2(0.172, 0.0), new THREE.Vector2(0.18, 0.03), new THREE.Vector2(0.2, 0.042), new THREE.Vector2(0.225, 0.04), new THREE.Vector2(0.238, 0.026), new THREE.Vector2(0.24, 0.0)], 64), new THREE.MeshPhysicalMaterial({ color: 0xe9ebec, roughness: 0.25, metalness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.15, side: THREE.DoubleSide }), dcx, 0, 0, door);
  ring.rotation.x = Math.PI / 2;
  mesh(new THREE.TorusGeometry(0.174, 0.008, 12, 64), M.chrome, dcx, 0, 0.012, door);
  const bowlPts = []; for (let i = 0; i <= 14; i++) { const t = i / 14; bowlPts.push(new THREE.Vector2(0.17 * Math.cos(t * Math.PI / 2 * 0.98) + 0.002, -0.085 * Math.sin(t * Math.PI / 2))); }
  const glassM = new THREE.MeshStandardMaterial({ color: 0xcfe2e6, roughness: 0.03, transparent: true, opacity: 0.2, depthWrite: false, envMapIntensity: 2.6, side: THREE.DoubleSide });
  const bowl = mesh(new THREE.LatheGeometry(bowlPts, 48), glassM, dcx, 0, 0.008, door); bowl.rotation.x = Math.PI / 2; bowl.castShadow = false; bowl.renderOrder = 6;
  const rimDark = mesh(new THREE.RingGeometry(0.14, 0.172, 48), new THREE.MeshStandardMaterial({ color: 0x9fb4ba, roughness: 0.05, transparent: true, opacity: 0.3, depthWrite: false }), dcx, 0, 0.004, door); rimDark.castShadow = false; rimDark.renderOrder = 6;
  W.doorGlass = glassM;
  const hd = rbox(0.03, 0.15, 0.03, 0.012, M.chrome, dcx - 0.232, 0, 0.045, door); W.handle = hd;
  box(0.03, 0.1, 0.02, M.chrome, -0.012, 0, 0.012, door);
  shadowBlob(0, 0.02, 1.25, 1.15, 1.0);
  // soft occlusion on the wall behind things, and a window glint on the door glass
  const wallBlob = (x, y, w, h, op) => { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: blob, transparent: true, opacity: op, depthWrite: false })); o.position.set(x, y, L.wallZ + 0.004); o.renderOrder = 1; scene.add(o); return o; };
  wallBlob(0, 0.42, 1.5, 1.7, 0.55); wallBlob(-1.95, 0.36, 2.6, 1.5, 0.5); wallBlob(0, 1.24, 1.5, 0.5, 0.35);
  const glint = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.33), new THREE.MeshBasicMaterial({ map: TX.glintTex(), transparent: true, opacity: 0.5, depthWrite: false })); glint.position.set(dcx, 0, 0.016); glint.renderOrder = 8; door.add(glint);

  // ---------- basket (felt, leather grips) ----------
  const bk = new THREE.Group(); scene.add(bk); W.basket = bk;
  const B = L.basket, rr = 0.06;
  const rrect = (w, d, r) => { const s = new THREE.Shape(); s.moveTo(-w / 2 + r, -d / 2); s.lineTo(w / 2 - r, -d / 2); s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r); s.lineTo(w / 2, d / 2 - r); s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2); s.lineTo(-w / 2 + r, d / 2); s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r); s.lineTo(-w / 2, -d / 2 + r); s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2); return s; };
  const outer = rrect(B.w, B.d, rr), inner = rrect(B.w - 0.03, B.d - 0.03, rr - 0.012); outer.holes.push(inner);
  const wallsG = new THREE.ExtrudeGeometry(outer, { depth: B.h - 0.006, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.006, bevelSegments: 3, curveSegments: 10 });
  const walls = mesh(wallsG, M.felt, 0, 0.003, 0, bk); walls.rotation.x = -Math.PI / 2;
  const bot = mesh(new THREE.ExtrudeGeometry(rrect(B.w - 0.01, B.d - 0.01, rr), { depth: B.floor - 0.004, bevelEnabled: false }), M.felt, 0, 0.002, 0, bk); bot.rotation.x = -Math.PI / 2;
  for (const s of [-1, 1]) {
    const hg = mesh(new THREE.TorusGeometry(0.055, 0.009, 8, 20, Math.PI), M.leather, 0, B.h - 0.035, s * (B.d / 2 + 0.004), bk);
    hg.scale.set(1, 0.75, 1);
    for (const e of [-1, 1]) mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.012, 8), M.chrome, e * 0.055, B.h - 0.04, s * (B.d / 2 + 0.006), bk).rotation.x = Math.PI / 2;
  }
  W.basketBlob = shadowBlob(0, 0, 1.02, 0.82, 0.95, 0.005, bk);

  // ---------- counter with drawer and cubby ----------
  const C = L.counter, cw = C.x1 - C.x0, cd = C.z1 - C.z0, cxm = (C.x0 + C.x1) / 2, czm = (C.z0 + C.z1) / 2;
  rbox(cw + 0.04, 0.035, cd + 0.03, 0.008, M.oak, cxm, C.top - 0.0175, czm + 0.012);
  box(0.02, C.top - 0.035, cd, M.white, C.x0 + 0.01, (C.top - 0.035) / 2, czm); box(0.02, C.top - 0.035, cd, M.white, C.x1 - 0.01, (C.top - 0.035) / 2, czm);
  box(0.02, C.top - 0.035, cd, M.white, -1.955, (C.top - 0.035) / 2, czm);
  box(cw, 0.06, cd - 0.04, M.white, cxm, 0.03, czm - 0.02); box(cw, C.top - 0.035, 0.015, M.white, cxm, (C.top - 0.035) / 2, C.z0 + 0.008);
  const cubM = std({ color: 0xe9e3d6, roughness: 0.8 });
  box(0.74, 0.012, cd - 0.02, cubM, -1.56, 0.066, czm);
  // fixed lower drawer front
  const lf2 = rbox(0.74, 0.37, 0.02, 0.006, M.white, -2.34, 0.25, C.z1 - 0.01);
  const barHandle = (parent, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); tube([-0.11, 0, 0.028], [0.11, 0, 0.028], 0.006, M.steel, g); tube([-0.09, 0, 0], [-0.09, 0, 0.028], 0.005, M.steel, g); tube([0.09, 0, 0], [0.09, 0, 0.028], 0.005, M.steel, g); return g; };
  barHandle(scene, -2.34, 0.33, C.z1);
  const drw = new THREE.Group(); drw.position.set(0, 0, 0); scene.add(drw); W.drawer = drw;
  const D = L.drawer, dw = D.x1 - D.x0, dxm = (D.x0 + D.x1) / 2;
  rbox(dw + 0.02, 0.22, 0.02, 0.006, M.white, dxm, 0.57, D.zFront - 0.01, drw);
  W.drawerHandle = barHandle(drw, dxm, 0.6, D.zFront);
  box(dw - 0.04, 0.012, D.depth, M.birch, dxm, D.y0 - 0.006, D.zFront - 0.02 - D.depth / 2, drw);
  box(0.012, 0.16, D.depth, M.birch, D.x0 + 0.026, D.y0 + 0.08, D.zFront - 0.02 - D.depth / 2, drw); box(0.012, 0.16, D.depth, M.birch, D.x1 - 0.026, D.y0 + 0.08, D.zFront - 0.02 - D.depth / 2, drw);
  box(dw - 0.04, 0.16, 0.012, M.birch, dxm, D.y0 + 0.08, D.zFront - 0.02 - D.depth, drw);
  shadowBlob(cxm, czm + 0.1, 2.2, 1.1, 0.8);

  // ---------- balcony ----------
  const tl = TX.tileTextures(); tl.map.repeat.set(9, 3.6); tl.normalMap.repeat.set(9, 3.6);
  const bfM = std({ map: tl.map, normalMap: tl.normalMap, roughness: 0.86, color: 0xe6dfd2, envMapIntensity: 0.6 });
  const bf = mesh(new THREE.PlaneGeometry(11.2, 3.5), bfM, 2.0, -0.012, -2.2); bf.rotation.x = -Math.PI / 2; bf.castShadow = false; W.balFloorMat = bfM;
  // wet overlay (rain outside the eaves)
  const wetM = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.12, metalness: 0, transparent: true, opacity: 0, depthWrite: false });
  const wet = mesh(new THREE.PlaneGeometry(11.2, L.eaveZ - L.parapetZ), wetM, 2.0, -0.008, (L.eaveZ + L.parapetZ) / 2); wet.rotation.x = -Math.PI / 2; wet.castShadow = false; wet.renderOrder = 1; W.wetFloor = wetM;
  const sd = TX.sidingTextures(); sd.map.repeat.set(12, 16); sd.normalMap.repeat.set(12, 16);
  const sideM = std({ map: sd.map, normalMap: sd.normalMap, roughness: 0.85, color: 0xe8e0d0, envMapIntensity: 0.7 });
  const ex1 = mesh(new THREE.PlaneGeometry(4.15, wallH), sideM, -1.525, wallH / 2, L.extZ - 0.002); ex1.rotation.y = Math.PI;
  const ex2 = mesh(new THREE.PlaneGeometry(5.75, wallH), sideM, 4.725, wallH / 2, L.extZ - 0.002); ex2.rotation.y = Math.PI;
  const ex3 = mesh(new THREE.PlaneGeometry(1.3, wallH - L.door.h), sideM, 1.2, (wallH + L.door.h) / 2, L.extZ - 0.002); ex3.rotation.y = Math.PI;
  // eaves + gutter
  const eaveM = std({ color: 0xf2efe8, roughness: 0.9 });
  box(11.2, 0.08, L.extZ - L.eaveZ, eaveM, 2.0, L.eaveY + 0.04, (L.extZ + L.eaveZ) / 2);
  box(11.2, 0.16, 0.03, std({ color: 0x6b6259, roughness: 0.6 }), 2.0, L.eaveY + 0.06, L.eaveZ - 0.015);
  const gut = mesh(new THREE.CylinderGeometry(0.05, 0.05, 11.2, 14, 1, true, 0, Math.PI), std({ color: 0x5d554d, roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide }), 2.0, L.eaveY + 0.02, L.eaveZ - 0.07); gut.rotation.set(0, 0, Math.PI / 2); gut.rotation.x = Math.PI;
  // parapet
  const parM = std({ color: 0xd9d2c4, roughness: 0.92, envMapIntensity: 0.7, normalMap: wallN, normalScale: new THREE.Vector2(0.4, 0.4) });
  box(11.2, 1.0, 0.12, parM, 2.0, 0.5, L.parapetZ - 0.06); rbox(11.2, 0.05, 0.18, 0.012, M.alu, 2.0, 1.025, L.parapetZ - 0.06);
  box(0.12, 1.0, 3.5, parM, -1.0, 0.5, -2.16); rbox(0.18, 0.05, 3.6, 0.012, M.alu, -1.0, 1.025, -2.16);   // far end
  tube([-0.6, 0.006, L.parapetZ + 0.12], [7.4, 0.006, L.parapetZ + 0.12], 0.012, std({ color: 0x8b857b, roughness: 0.7 }), scene); // drain channel edge
  // sky + far scenery
  const sky = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 16), new THREE.MeshBasicMaterial({ map: TX.mkTex(TX.skyCanvas(), { clampEdge: true }), side: THREE.BackSide, fog: false, depthWrite: false }));
  sky.position.set(2, -6, -2); scene.add(sky); W.sky = sky;
  const scT = TX.mkTex(TX.sceneryCanvas(), {}); scT.repeat.set(2, 1); scT.wrapT = THREE.ClampToEdgeWrapping;
  const sc = new THREE.Mesh(new THREE.CylinderGeometry(46, 46, 9, 48, 1, true), new THREE.MeshBasicMaterial({ map: scT, transparent: true, side: THREE.BackSide, depthWrite: false, fog: false }));
  sc.position.set(2, -0.3, -2); scene.add(sc); W.scenery = sc;

  // ---------- drying stand (slides along z on casters) ----------
  const st = new THREE.Group(); st.position.set(0, 0, L.standZ0); scene.add(st); W.stand = st;
  const [rb, rf] = L.rods, hz = L.rodHalf;
  for (const r of L.rods) { const t = tube([r.x, r.y, -hz - 0.02], [r.x, r.y, hz + 0.02], L.rodR, M.chrome, st); for (const s of [-1, 1]) mesh(new THREE.SphereGeometry(L.rodR * 1.25, 10, 8), M.rubber, r.x, r.y, s * (hz + 0.02), st); }
  W.grips = [];
  for (const s of [-1, 1]) {
    const z = s * hz;
    tube([rb.x, rb.y, z], [2.28, 0.07, z], 0.011, M.chrome, st); tube([rf.x, rf.y, z], [3.04, 0.07, z], 0.011, M.chrome, st);
    tube([rb.x, rb.y, z], [rf.x, rf.y, z], 0.011, M.chrome, st);
    tube([2.34, 0.5, z], [2.975, 0.5, z], 0.009, M.chrome, st);
    const gp = tube([rb.x + 0.07, rb.y - 0.049, z], [rf.x - 0.07, rf.y + 0.049, z], 0.02, std({ color: 0x33373b, roughness: 0.9, normalMap: feltN }), st); W.grips.push(gp);
    for (const [x] of [[2.28], [3.04]]) { const wh = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.024, 16), M.rubber, x, 0.035, z, st); wh.rotation.x = Math.PI / 2; mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 10), M.chrome, x, 0.035, z, st).rotation.x = Math.PI / 2; }
  }
  tube([2.34, 0.5, -hz], [2.34, 0.5, hz], 0.009, M.chrome, st); tube([2.975, 0.5, -hz], [2.975, 0.5, hz], 0.009, M.chrome, st);
  // pin saucer hanging on the front bar
  const trayM = new THREE.MeshPhysicalMaterial({ color: 0xf7f6f1, roughness: 0.25, clearcoat: 0.9, side: THREE.DoubleSide });
  const tray = mesh(new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(0.075, 0.002), new THREE.Vector2(0.105, 0.016), new THREE.Vector2(0.118, 0.034), new THREE.Vector2(0.122, 0.036), new THREE.Vector2(0.108, 0.02), new THREE.Vector2(0.074, 0.008), new THREE.Vector2(0, 0.006)], 36), trayM, 3.09, 0.515, 0, st);
  W.tray = tray; W.trayPos = new THREE.Vector3(3.09, 0.53, 0);
  tube([2.975, 0.5, -0.05], [3.09, 0.51, -0.05], 0.005, M.chrome, st); tube([2.975, 0.5, 0.05], [3.09, 0.51, 0.05], 0.005, M.chrome, st);
  mesh(new THREE.TorusGeometry(0.121, 0.003, 6, 36), std({ color: 0x4a78a8, roughness: 0.4 }), 3.09, 0.551, 0, st).rotation.x = Math.PI / 2;
  W.standBlob = shadowBlob(2.66, 0, 1.3, 1.7, 0.35, 0.004, st);

  // clothespin prototype
  const pinWood = std({ map: TX.woodPlain([226, 196, 150], 29), roughness: 0.7 });
  W.makePin = () => {
    const g = new THREE.Group();
    for (const s of [-1, 1]) { const pr = rbox(0.014, 0.082, 0.006, 0.002, pinWood, 0, 0, s * 0.0045, g); pr.rotation.x = s * 0.07; }
    const sp = mesh(new THREE.TorusGeometry(0.008, 0.0016, 6, 14), M.chrome, 0, 0.006, 0, g); sp.rotation.y = Math.PI / 2;
    tube([0, 0.006, -0.008], [0, 0.03, -0.0085], 0.0012, M.chrome, g); tube([0, 0.006, 0.008], [0, 0.03, 0.0085], 0.0012, M.chrome, g);
    return g;
  };

  // hanamaru card
  const cardM = [std({ color: 0xfffdf6, roughness: 0.8 }), std({ map: TX.hanamaruTex(), roughness: 0.78 })];
  const cg = new THREE.BoxGeometry(0.15, 0.15, 0.0016); cg.clearGroups(); cg.addGroup(0, 24, 0); cg.addGroup(24, 6, 1); cg.addGroup(30, 6, 0);
  const card = new THREE.Mesh(cg, cardM); card.castShadow = true; card.receiveShadow = true; card.visible = false; scene.add(card); W.card = card;

  W.tube = tube; W.rbox = rbox; W.mesh = mesh; W.box = box;
  return W;
}
