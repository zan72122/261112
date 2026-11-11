// tex.js — すべてコードで描く手続きテクスチャ
import * as THREE from 'three';

export function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function h2(x, y, s) { let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1274126177); n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; }
export function vnoise(x, y, s = 0, wrap = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const w = (a) => (wrap ? ((a % wrap) + wrap) % wrap : a);
  const a = h2(w(xi), w(yi), s), b = h2(w(xi + 1), w(yi), s), c = h2(w(xi), w(yi + 1), s), d = h2(w(xi + 1), w(yi + 1), s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y, s = 0, oct = 4, wrap = 0) { let a = 0.5, f = 1, t = 0, n = 0; for (let i = 0; i < oct; i++) { t += a * vnoise(x * f, y * f, s + i * 17, wrap ? wrap * f : 0); n += a; a *= 0.5; f *= 2; } return t / n; }

export function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
export function tex(c, o = {}) {
  const t = new THREE.CanvasTexture(c);
  if (o.srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
  if (o.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.repeat[0], o.repeat[1]); }
  t.anisotropy = o.aniso || 4;
  return t;
}
// ピクセル関数から (r,g,b:0..1) を塗る
export function pix(w, h, fn) {
  const c = canvas(w, h), g = c.getContext('2d'), im = g.createImageData(w, h), d = im.data, o = [0, 0, 0];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    fn(x / w, y / h, o, x, y);
    const i = (y * w + x) * 4; d[i] = o[0] * 255; d[i + 1] = o[1] * 255; d[i + 2] = o[2] * 255; d[i + 3] = 255;
  }
  g.putImageData(im, 0, 0); return c;
}
const mix = (a, b, t) => a + (b - a) * t;
const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function col(o, a, b, t) { o[0] = mix(a[0], b[0], t); o[1] = mix(a[1], b[1], t); o[2] = mix(a[2], b[2], t); }

// 数字なしのバーコード
export function barcode(g, x, y, w, h, seed) {
  const r = rng(seed); g.fillStyle = '#fbfbf8'; g.fillRect(x, y, w, h);
  g.fillStyle = '#16161a'; let px = x + w * 0.07; const end = x + w * 0.93;
  while (px < end) { const bw = (1 + Math.floor(r() * 3)) * w * 0.012; if (r() > 0.42) g.fillRect(px, y + h * 0.12, Math.min(bw, end - px), h * 0.76); px += bw; }
}

export function woodTex() {
  const c = pix(512, 512, (u, v, o) => {
    const plank = Math.floor(u * 6), pu = u * 6 - plank, ph = h2(plank, 3, 9);
    const g = fbm(u * 3 + ph * 7, v * 40 + ph * 30, 3, 4), ring = Math.sin((v * 22 + g * 5 + ph * 9) * 3.1) * 0.5 + 0.5;
    let t = 0.45 + (ph - 0.5) * 0.3 + (g - 0.5) * 0.35 + ring * 0.08;
    const edge = sm(0.0, 0.012, pu) * sm(1, 0.988, pu);
    col(o, [0.50, 0.34, 0.19], [0.80, 0.62, 0.40], t); o[0] *= 0.82 + 0.18 * edge; o[1] *= 0.8 + 0.2 * edge; o[2] *= 0.78 + 0.22 * edge;
  });
  return tex(c, { repeat: [1, 1] });
}
export function floorTex() {
  const c = pix(512, 512, (u, v, o) => {
    const tu = u * 2, tv = v * 2, fu = tu - Math.floor(tu), fv = tv - Math.floor(tv);
    const id = h2(Math.floor(tu), Math.floor(tv), 5);
    const n = fbm(u * 24, v * 24, 11, 4, 24), sp = h2(Math.floor(u * 512), Math.floor(v * 512), 2);
    let t = 0.55 + (id - 0.5) * 0.12 + (n - 0.5) * 0.25;
    col(o, [0.63, 0.59, 0.53], [0.86, 0.83, 0.77], t);
    if (sp > 0.965) { o[0] *= 0.82; o[1] *= 0.82; o[2] *= 0.84; }
    const gr = Math.min(fu, 1 - fu, fv, 1 - fv); const k = sm(0.004, 0.012, gr);
    o[0] = mix(0.42, o[0], k); o[1] = mix(0.40, o[1], k); o[2] = mix(0.37, o[2], k);
  });
  return tex(c, { repeat: [5, 5], aniso: 8 });
}
export function floorRough() {
  const c = pix(256, 256, (u, v, o) => {
    const tu = u * 2, tv = v * 2, fu = tu - Math.floor(tu), fv = tv - Math.floor(tv);
    const gr = Math.min(fu, 1 - fu, fv, 1 - fv); const k = sm(0.004, 0.014, gr);
    const n = fbm(u * 12, v * 12, 31, 4, 12); const r = mix(0.9, 0.3 + n * 0.28, k); o[0] = o[1] = o[2] = r;
  });
  return tex(c, { repeat: [5, 5], srgb: false });
}
export function plasterTex(base = [0.93, 0.91, 0.86]) {
  const c = pix(256, 256, (u, v, o) => { const n = fbm(u * 8, v * 8, 4, 5, 8); const k = 0.93 + n * 0.1; o[0] = base[0] * k; o[1] = base[1] * k; o[2] = base[2] * k; });
  return tex(c, { repeat: [3, 2] });
}
export function noiseBump(seed = 1, scale = 16, oct = 4) {
  const c = pix(256, 256, (u, v, o) => { o[0] = o[1] = o[2] = fbm(u * scale, v * scale, seed, oct, scale); });
  return tex(c, { srgb: false, repeat: [1, 1] });
}
// 牛乳パック: 4面を横に並べた展開 (各面 128x512)。下端 v=0。
export function milkTex(seed) {
  const c = canvas(512, 512), g = c.getContext('2d');
  g.fillStyle = '#f7f6f1'; g.fillRect(0, 0, 512, 512);
  const blue = '#1f5fb0', light = '#7fb4e6', deep = '#123e7c';
  for (let p = 0; p < 4; p++) {
    const x0 = p * 128;
    g.save(); g.beginPath(); g.rect(x0, 0, 128, 512); g.clip();
    // 帯模様 (キャンバス上は y 下向き。箱の下端 = y 512)
    g.fillStyle = blue; g.beginPath(); g.moveTo(x0, 512);
    for (let i = 0; i <= 32; i++) { const x = x0 + i * 4; g.lineTo(x, 330 + Math.sin((i / 32) * Math.PI * 2 + p * 1.57) * 16); }
    g.lineTo(x0 + 128, 512); g.fill();
    g.fillStyle = light; g.beginPath(); g.moveTo(x0, 512);
    for (let i = 0; i <= 32; i++) { const x = x0 + i * 4; g.lineTo(x, 392 + Math.sin((i / 32) * Math.PI * 2 + p * 1.57 + 1.2) * 12); }
    g.lineTo(x0 + 128, 512); g.fill();
    g.fillStyle = deep; g.fillRect(x0, 478, 128, 34);
    g.fillStyle = blue; g.fillRect(x0, 148, 128, 9); g.fillStyle = light; g.fillRect(x0, 162, 128, 4);
    if (p === 0 || p === 2) { // しずく模様
      g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(x0 + 64, 222); g.bezierCurveTo(x0 + 96, 268, x0 + 92, 300, x0 + 64, 300); g.bezierCurveTo(x0 + 36, 300, x0 + 32, 268, x0 + 64, 222); g.fill();
      g.strokeStyle = blue; g.lineWidth = 5; g.stroke();
      g.fillStyle = light; g.beginPath(); g.ellipse(x0 + 56, 276, 7, 11, 0.4, 0, 7); g.fill();
    } else if (p === 1) {
      barcode(g, x0 + 22, 216, 84, 58, seed);
    } else {
      g.fillStyle = light; for (let i = 0; i < 4; i++) g.fillRect(x0 + 24, 208 + i * 20, 80 - (i % 2) * 22, 7);
    }
    g.restore();
    g.strokeStyle = 'rgba(120,120,110,0.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + 0.5, 0); g.lineTo(x0 + 0.5, 512); g.stroke();
  }
  // 屋根部の折り線
  g.strokeStyle = 'rgba(110,110,100,0.25)'; g.beginPath(); g.moveTo(0, 104); g.lineTo(512, 104); g.moveTo(0, 26); g.lineTo(512, 26); g.stroke();
  return tex(c, { aniso: 8 });
}
export function appleTex(variant) {
  const c = pix(256, 256, (u, v, o) => {
    // u: 周方向, v: 0=底 1=上
    const streak = fbm(u * 40, v * 3, 7 + variant, 4, 40), blotch = fbm(u * 5, v * 4, 3 + variant * 5, 4, 5);
    let red = sm(0.25, 0.75, blotch * 0.9 + streak * 0.35 + (variant ? -0.12 + 0.35 * Math.sin(u * 6.283) : 0.22));
    const pole = sm(0.86, 1.0, v) * 0.85 + sm(0.1, 0.0, v) * 0.5;
    red *= 1 - pole * 0.75;
    const yel = variant ? [0.86, 0.80, 0.32] : [0.90, 0.72, 0.30], rd = variant ? [0.74, 0.12, 0.10] : [0.66, 0.06, 0.07];
    col(o, yel, rd, red);
    const dark = fbm(u * 60, v * 5, 21, 3, 60); o[0] *= 0.86 + dark * 0.2; o[1] *= 0.84 + dark * 0.2; o[2] *= 0.84 + dark * 0.2;
    // 果皮の細点
    const cu = u * 46, cv = v * 46, iu = Math.floor(cu), iv = Math.floor(cv);
    if (h2(iu, iv, 77 + variant) > 0.45) {
      const dx = cu - iu - 0.2 - h2(iu, iv, 5) * 0.6, dy = cv - iv - 0.2 - h2(iu, iv, 6) * 0.6, d = dx * dx + dy * dy;
      if (d < 0.012) { const k = 0.55; o[0] = mix(o[0], 0.95, k); o[1] = mix(o[1], 0.86, k); o[2] = mix(o[2], 0.62, k); }
    }
    if (v > 0.93) { const k = sm(0.93, 1, v); o[0] = mix(o[0], 0.45, k); o[1] = mix(o[1], 0.42, k); o[2] = mix(o[2], 0.2, k); }
  });
  return tex(c);
}
// パン: u=周方向(0.25が正面/上), v=長さ方向
export function slashMask(u, v) {
  let m = 0;
  for (let i = 0; i < 5; i++) {
    const cv = 0.16 + i * 0.17, du = (u - 0.25) * 5.2, dv = (v - cv) * 9 - du * 0.9;
    const d = (du * du) / 0.9 + (dv * dv) / 0.16;
    m = Math.max(m, 1 - d);
  }
  return Math.max(0, m);
}
export function breadTex() {
  const c = pix(256, 512, (u, v, o) => {
    const n = fbm(u * 10, v * 22, 5, 5, 10), n2 = fbm(u * 40, v * 80, 9, 3, 40);
    const top = Math.cos((u - 0.25) * 6.283) * 0.5 + 0.5;
    let t = 0.35 + top * 0.35 + (n - 0.5) * 0.5; // 焼き色
    col(o, [0.86, 0.66, 0.36], [0.50, 0.25, 0.08], sm(0.2, 0.95, t));
    const sl = slashMask(u, v);
    if (sl > 0) { const k = sm(0.0, 0.45, sl); const e = sm(0.0, 0.2, sl) * (1 - sm(0.2, 0.5, sl)); o[0] = mix(o[0], 0.93, k); o[1] = mix(o[1], 0.82, k); o[2] = mix(o[2], 0.60, k); o[0] *= 1 - e * 0.45; o[1] *= 1 - e * 0.55; o[2] *= 1 - e * 0.6; }
    const fl = sm(0.62, 0.8, fbm(u * 26, v * 50, 41, 3, 26)) * 0.35 * top; o[0] = mix(o[0], 0.96, fl); o[1] = mix(o[1], 0.93, fl); o[2] = mix(o[2], 0.85, fl);
    o[0] *= 0.92 + n2 * 0.14; o[1] *= 0.9 + n2 * 0.16; o[2] *= 0.88 + n2 * 0.18;
  });
  return tex(c);
}
export function breadBump() {
  const c = pix(128, 256, (u, v, o) => { const sl = slashMask(u, v); o[0] = o[1] = o[2] = 0.45 + fbm(u * 18, v * 40, 3, 4, 18) * 0.3 - sm(0, 0.5, sl) * 0.3 + sm(0.0, 0.15, sl) * (1 - sm(0.15, 0.4, sl)) * 0.35; });
  return tex(c, { srgb: false });
}
export function sleeveTex(seed) {
  const c = canvas(256, 256), g = c.getContext('2d');
  const base = pix(256, 256, (u, v, o) => { const n = fbm(u * 6, v * 30, 8, 4, 6); o[0] = 0.80 * (0.9 + n * 0.16); o[1] = 0.66 * (0.9 + n * 0.16); o[2] = 0.46 * (0.9 + n * 0.16); });
  g.drawImage(base, 0, 0);
  g.fillStyle = '#b5482e'; g.fillRect(0, 40, 256, 16); g.fillRect(0, 196, 256, 16);
  g.fillStyle = '#f3ead8'; g.fillRect(0, 62, 256, 5); g.fillRect(0, 186, 256, 5);
  for (let i = 0; i < 8; i++) { g.fillStyle = '#b5482e'; g.beginPath(); g.arc(16 + i * 32, 126, 5, 0, 7); g.fill(); }
  barcode(g, 36, 92, 62, 62, seed);
  return tex(c);
}
export function strawberryTex() {
  const c = pix(128, 128, (u, v, o) => {
    const n = fbm(u * 6, v * 6, 2, 3, 6);
    col(o, [0.86, 0.16, 0.12], [0.62, 0.03, 0.05], sm(0.1, 0.9, v * 0.6 + n * 0.5));
    if (v > 0.9) { const k = sm(0.9, 1, v); o[0] = mix(o[0], 0.9, k); o[1] = mix(o[1], 0.75, k); o[2] = mix(o[2], 0.55, k); }
    const cu = u * 12 + (Math.floor(v * 12) % 2) * 0.5, cv = v * 12, dx = cu - Math.floor(cu) - 0.5, dy = cv - Math.floor(cv) - 0.5, d = dx * dx * 2 + dy * dy;
    if (d < 0.03) { o[0] = 0.93; o[1] = 0.80; o[2] = 0.38; } else if (d < 0.075) { o[0] *= 0.72; o[1] *= 0.6; o[2] *= 0.6; }
  });
  return tex(c);
}
export function labelTex(seed) {
  const c = canvas(256, 64), g = c.getContext('2d');
  g.fillStyle = '#faf7ee'; g.fillRect(0, 0, 256, 64);
  g.fillStyle = '#c8322e'; g.fillRect(0, 0, 256, 9); g.fillRect(0, 55, 256, 9);
  g.fillStyle = '#3d8a4a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(18 + i * 22, 32, 7, 11, 0.5, 0, 7); g.fill(); }
  barcode(g, 168, 14, 70, 36, seed);
  return tex(c);
}
export function cardboardTex() {
  const c = pix(256, 256, (u, v, o) => { const n = fbm(u * 5, v * 5, 6, 4, 5), l = Math.sin(v * 256 * 0.9) * 0.5 + 0.5; const k = 0.9 + n * 0.14 - l * 0.035; o[0] = 0.72 * k; o[1] = 0.56 * k; o[2] = 0.37 * k; });
  return tex(c, { repeat: [1, 1] });
}
// かごの格子 (alphaTest 用)
export function latticeTex(colr) {
  const c = canvas(256, 128), g = c.getContext('2d');
  g.clearRect(0, 0, 256, 128); g.fillStyle = colr; g.fillRect(0, 0, 256, 128);
  g.globalCompositeOperation = 'destination-out';
  for (let y = 0; y < 4; y++) for (let x = 0; x < 16; x++) { const px = x * 16 + 3, py = 22 + y * 22; g.beginPath(); g.roundRect(px, py, 10, 16, 3); g.fill(); }
  g.globalCompositeOperation = 'source-over';
  const t = tex(c); t.wrapS = THREE.RepeatWrapping; return t;
}
export function brushedTex() {
  const c = pix(256, 64, (u, v, o) => { const n = fbm(u * 2, v * 60, 4, 4, 2); o[0] = o[1] = o[2] = 0.3 + n * 0.3; });
  return tex(c, { srgb: false, repeat: [1, 1] });
}
export function shutterTex() {
  const c = pix(64, 256, (u, v, o) => {
    const s = v * 8 - Math.floor(v * 8); const rib = Math.sin(s * Math.PI); const n = fbm(u * 3, v * 2, 3, 4, 3);
    const k = 0.72 + rib * 0.2 + (n - 0.5) * 0.12 - sm(0.9, 1, s) * 0.3;
    o[0] = 0.80 * k; o[1] = 0.80 * k; o[2] = 0.78 * k;
  });
  return tex(c, { repeat: [1, 2.2] });
}
export function shutterBump() {
  const c = pix(16, 256, (u, v, o) => { const s = v * 8 - Math.floor(v * 8); o[0] = o[1] = o[2] = Math.pow(Math.sin(s * Math.PI), 0.7) * (1 - sm(0.92, 1, s) * 0.8); });
  return tex(c, { srgb: false, repeat: [1, 2.2] });
}
export function fabricBump() {
  const c = pix(128, 128, (u, v, o) => { const a = Math.sin(u * 128 * 1.57) * 0.5 + 0.5, b = Math.sin(v * 128 * 1.57) * 0.5 + 0.5; o[0] = o[1] = o[2] = 0.4 + a * b * 0.4 + h2(u * 128, v * 128, 1) * 0.2; });
  return tex(c, { srgb: false, repeat: [6, 6] });
}
export function crinkleBump() {
  const c = pix(256, 256, (u, v, o) => {
    let t = 0, a = 0.55, f = 5;
    for (let i = 0; i < 4; i++) { const n = vnoise(u * f, v * f, 50 + i * 7, f); t += a * (1 - Math.abs(n * 2 - 1)); a *= 0.5; f *= 2.1; f = Math.round(f); }
    o[0] = o[1] = o[2] = t;
  });
  return tex(c, { srgb: false, repeat: [1.4, 1.6] });
}
export function paverTex() {
  const c = pix(256, 256, (u, v, o) => {
    const row = Math.floor(v * 8), tu = u * 4 + (row % 2) * 0.5, fu = tu - Math.floor(tu), fv = v * 8 - row;
    const id = h2(Math.floor(tu), row, 8), n = fbm(u * 30, v * 30, 2, 3, 30);
    const k = 0.78 + (id - 0.5) * 0.18 + (n - 0.5) * 0.2; const gr = sm(0.0, 0.05, Math.min(fu, 1 - fu, fv * 0.5, (1 - fv) * 0.5));
    o[0] = 0.74 * k * (0.6 + 0.4 * gr); o[1] = 0.70 * k * (0.6 + 0.4 * gr); o[2] = 0.64 * k * (0.6 + 0.4 * gr);
  });
  return tex(c, { repeat: [6, 6], aniso: 8 });
}
export function stripeTex(a, b, n = 8) {
  const c = canvas(128, 16), g = c.getContext('2d');
  for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect((i * 128) / n, 0, 128 / n + 1, 16); }
  return tex(c, { repeat: [1, 1] });
}
export function wickerTex() {
  const c = pix(128, 128, (u, v, o) => {
    const cu = u * 16, cv = v * 12, iu = Math.floor(cu), iv = Math.floor(cv), fu = cu - iu, fv = cv - iv;
    const over = (iu + iv) % 2 === 0; const b = over ? Math.sin(fu * Math.PI) : Math.sin(fv * Math.PI) * 0.6;
    const k = 0.55 + b * 0.45 + (h2(iu, iv, 4) - 0.5) * 0.15; o[0] = 0.72 * k; o[1] = 0.53 * k; o[2] = 0.30 * k;
  });
  return tex(c, { repeat: [3, 1] });
}
// 背景棚の商品ラベル (帯模様のみ)
export function productTex() {
  const c = canvas(256, 64), g = c.getContext('2d');
  for (let i = 0; i < 4; i++) {
    const x = i * 64; g.fillStyle = '#ffffff'; g.fillRect(x, 0, 64, 64);
    g.fillStyle = 'rgba(0,0,0,0.42)';
    if (i === 0) { g.fillRect(x, 18, 64, 14); g.fillRect(x, 38, 64, 4); }
    else if (i === 1) { g.beginPath(); g.arc(x + 32, 30, 15, 0, 7); g.fill(); g.fillRect(x, 54, 64, 10); }
    else if (i === 2) { for (let k = 0; k < 4; k++) g.fillRect(x + 6 + k * 14, 10, 7, 40); }
    else { g.beginPath(); g.moveTo(x, 44); g.quadraticCurveTo(x + 32, 12, x + 64, 44); g.lineTo(x + 64, 64); g.lineTo(x, 64); g.fill(); }
  }
  return tex(c);
}
export function blobTex() {
  const c = canvas(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(0,0,0,0.62)'); gr.addColorStop(0.45, 'rgba(0,0,0,0.32)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c);
}
export function skyTex() {
  const c = canvas(16, 256), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#5d9fe0'); gr.addColorStop(0.45, '#a9d0f2'); gr.addColorStop(0.62, '#e6f1f8'); gr.addColorStop(1, '#f2f0e6');
  g.fillStyle = gr; g.fillRect(0, 0, 16, 256); return tex(c);
}
export function leafTex() {
  const c = pix(64, 64, (u, v, o) => { const n = fbm(u * 6, v * 6, 12, 4, 6); o[0] = 0.16 + n * 0.2; o[1] = 0.36 + n * 0.3; o[2] = 0.12 + n * 0.12; });
  return tex(c, { repeat: [2, 2] });
}
export function asphaltTex() {
  const c = pix(128, 128, (u, v, o) => { const n = h2(u * 128, v * 128, 3) * 0.25 + fbm(u * 8, v * 8, 4, 3, 8) * 0.3; o[0] = o[1] = 0.26 + n * 0.5; o[2] = 0.28 + n * 0.5; });
  return tex(c, { repeat: [8, 3] });
}
export function sidingTex() {
  const c = pix(256, 256, (u, v, o) => {
    const b = v * 10 - Math.floor(v * 10), id = h2(Math.floor(v * 10), 2, 6), n = fbm(u * 3, v * 60, 5, 4, 3);
    const k = 0.82 + (id - 0.5) * 0.1 + (n - 0.5) * 0.16 - sm(0.9, 1, b) * 0.35;
    o[0] = 0.88 * k; o[1] = 0.84 * k; o[2] = 0.74 * k;
  });
  return tex(c, { repeat: [2, 1] });
}
// はなまるカード (進行 t: 0..1 で朱色の花丸が現れる)
export function drawCard(c, t) {
  const g = c.getContext('2d'), W = c.width, H = c.height;
  g.fillStyle = '#fdfcf7'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(200,190,170,0.5)'; g.lineWidth = 3; g.strokeRect(8, 8, W - 16, H - 16);
  if (t <= 0) return;
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.24;
  g.strokeStyle = '#d3201c'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = R * 0.17; g.globalAlpha = 0.96;
  g.beginPath(); // うずまき
  const N = 120, tt = Math.min(1, t * 1.6);
  for (let i = 0; i <= N * tt; i++) { const a = (i / N) * Math.PI * 5.2, r = (i / N) * R; const x = cx + Math.cos(a - 1.2) * r, y = cy + Math.sin(a - 1.2) * r; i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke();
  const pt = Math.max(0, (t - 0.55) / 0.45);
  if (pt > 0) { // 花びら
    g.beginPath(); const P = 7, M = Math.floor(P * 24 * pt);
    for (let i = 0; i <= M; i++) { const a = (i / (P * 24)) * Math.PI * 2 - 1.2, r = R * (1.12 + 0.36 * Math.abs(Math.sin((a + 1.2) * P * 0.5))); const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  g.globalAlpha = 1;
}
