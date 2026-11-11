// 浴室の寸法(メートル)と地形関数。すべての系が同じ数値を共有する。
import { clamp, smooth } from './util.js';

export const L = {
  HX: 0.5, HZ: 0.3,          // 浴槽内側の半寸(縁の高さ y=0)
  CORNER: 0.085,
  RIM: 0.105,                // 縁の幅
  RIM_RISE: 0.014,           // 縁は外側が高い(内向きに傾く)
  DEEP: -0.34, STEP: -0.115, // 底と浅い段の高さ
  STEP_X0: -0.215, STEP_X1: -0.145, // 段の立ち上がり
  WALLRUN: 0.062,
  DECK_Z0: -0.405, WALL_Z: -0.86, // 奥のデッキ(窓辺)と壁
  SIDE_X: 0.86,              // 左右の壁
  FLOOR_Y: -0.56,
  OVER_Y: -0.018,            // オーバーフロー口の水位
  SPILL_Y: -0.008,           // 縁へ乗り始める水位
  FAUCET: { x: -0.1, z: -0.5 },
  STREAM: { x: -0.1, z: -0.17 },
  DRAIN: { x: 0.33, z: 0.1 },
  RING: { x: 0.552, z: 0.1 },
  OVERFLOW: { x: 0.26, z: -0.3 },
  SHOWER_REST: { x: -0.58, y: 0.42, z: -0.8 },
  TOWEL: { x0: -0.05, x1: 0.33, railY: 0.36, railZ: -0.825, cx: 0.14, cz: -0.6 },
  BED: { x: 0.6, z: -0.625, rx: 0.232, rz: 0.19, y: 0.045 },
  CARD: { x: 0.415, z: -0.82, y: 0.0 },
};

// 角丸長方形の内側距離(正=内側)
export function insideDist(x, z) {
  const r = L.CORNER; const qx = Math.abs(x) - (L.HX - r), qz = Math.abs(z) - (L.HZ - r);
  const ox = Math.max(qx, 0), oz = Math.max(qz, 0);
  return -(Math.sqrt(ox * ox + oz * oz) + Math.min(Math.max(qx, qz), 0) - r);
}

export function floorBase(x) { return L.STEP + (L.DEEP - L.STEP) * smooth(L.STEP_X0, L.STEP_X1, x); }

// 浴槽内面の高さ(縁=0, 底は負)
export function ground(x, z) {
  const d = insideDist(x, z);
  if (d <= 0) return 0;
  const t = clamp(d / L.WALLRUN, 0, 1);
  const s = 1 - Math.pow(1 - t, 2.6);
  return floorBase(x) * s;
}

export function groundNormal(x, z, out) {
  const e = 0.002;
  const dx = (ground(x + e, z) - ground(x - e, z)) / (2 * e), dz = (ground(x, z + e) - ground(x, z - e)) / (2 * e);
  const il = 1 / Math.sqrt(dx * dx + dz * dz + 1);
  out[0] = -dx * il; out[1] = il; out[2] = -dz * il; return out;
}

export function inTub(x, z, inset = 0) { return insideDist(x, z) > inset; }

// 浴槽内へ最近点クランプ
export function clampToTub(x, z, inset) {
  const hx = L.HX - inset, hz = L.HZ - inset, r = Math.max(0.01, L.CORNER - inset * 0.5);
  let cx = clamp(x, -hx, hx), cz = clamp(z, -hz, hz);
  const ax = Math.abs(cx) - (hx - r), az = Math.abs(cz) - (hz - r);
  if (ax > 0 && az > 0) {
    const l = Math.sqrt(ax * ax + az * az);
    if (l > r) { const k = r / l; cx = Math.sign(cx) * (hx - r + ax * k); cz = Math.sign(cz) * (hz - r + az * k); }
  }
  return [cx, cz];
}

export function inBed(x, z, grow = 0) {
  const dx = (x - L.BED.x) / (L.BED.rx + grow), dz = (z - L.BED.z) / (L.BED.rz + grow);
  return dx * dx + dz * dz < 1;
}
