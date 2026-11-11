// 共通の小道具: 乱数・補間・ノイズ・キャンバステクスチャ
import * as THREE from 'three';

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const sat = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (a, b, x) => { const t = sat((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const damp = (cur, target, rate, dt) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
export const angDiff = (a, b) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };
export const fin = (v) => typeof v === 'number' && isFinite(v);

export function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

// 値ノイズ(2D, タイル可)
export function makeNoise2(seed, period) {
  const r = rng(seed); const n = period; const g = new Float32Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = r();
  return (x, y) => {
    x = ((x % n) + n) % n; y = ((y % n) + n) % n;
    const xi = Math.floor(x), yi = Math.floor(y); const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const x1 = (xi + 1) % n, y1 = (yi + 1) % n;
    const a = g[yi * n + xi], b = g[yi * n + x1], c = g[y1 * n + xi], d = g[y1 * n + x1];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

export function canvasOf(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

export function texFromCanvas(c, opts = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = opts.clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  if (opts.srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = opts.aniso || 4;
  if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1]);
  t.needsUpdate = true;
  return t;
}

// 高さ配列(0..1, Float32, w*h) → 法線マップのキャンバス
export function normalCanvasFromHeight(hgt, w, h, strength, wrap = true) {
  const c = canvasOf(w, h); const ctx = c.getContext('2d'); const img = ctx.createImageData(w, h); const d = img.data;
  const at = (x, y) => {
    if (wrap) { x = (x + w) % w; y = (y + h) % h; } else { x = clamp(x, 0, w - 1); y = clamp(y, 0, h - 1); }
    return hgt[y * w + x];
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength, dy = (at(x, y + 1) - at(x, y - 1)) * strength;
    const il = 1 / Math.sqrt(dx * dx + dy * dy + 1); const i = (y * w + x) * 4;
    d[i] = (-dx * il * 0.5 + 0.5) * 255; d[i + 1] = (dy * il * 0.5 + 0.5) * 255; d[i + 2] = (il * 0.5 + 0.5) * 255; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0); return c;
}

// キャンバスの赤チャンネルを高さ配列へ
export function heightFromCanvas(c) {
  const w = c.width, h = c.height; const d = c.getContext('2d').getImageData(0, 0, w, h).data; const o = new Float32Array(w * h);
  for (let i = 0; i < o.length; i++) o[i] = d[i * 4] / 255;
  return o;
}

export const V3 = THREE.Vector3;
