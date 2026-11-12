// すべての質感テクスチャをコードで生成する(外部素材なし)
import * as THREE from 'three';
import { canvasOf, texFromCanvas, normalCanvasFromHeight, heightFromCanvas, rng, makeNoise2, clamp, smooth } from './util.js';

function fbm(n, x, y, oct) { let a = 0, amp = 0.5, f = 1; for (let i = 0; i < oct; i++) { a += n(x * f, y * f) * amp; amp *= 0.5; f *= 2; } return a; }

// 壁タイル: 釉薬タイルと目地
export function makeTiles(seed, nx, ny, px, base, vary, groutCol) {
  const w = nx * px, h = ny * px; const r = rng(seed);
  const ca = canvasOf(w, h), cr = canvasOf(w, h), ch = canvasOf(w, h);
  const a = ca.getContext('2d'), ro = cr.getContext('2d'), hc = ch.getContext('2d');
  a.fillStyle = groutCol; a.fillRect(0, 0, w, h);
  ro.fillStyle = '#d8d8d8'; ro.fillRect(0, 0, w, h);
  hc.fillStyle = '#000'; hc.fillRect(0, 0, w, h);
  const g = Math.max(2, Math.round(px * 0.022));
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v = (r() - 0.5) * vary; const x = i * px + g, y = j * px + g, s = px - g * 2;
    const c = base.map((b, k) => clamp(Math.round(b + v * (k === 2 ? 0.8 : 1) * 255), 0, 255));
    a.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; a.fillRect(x, y, s, s);
    const gr = a.createLinearGradient(x, y, x + s, y + s); gr.addColorStop(0, 'rgba(255,255,255,0.05)'); gr.addColorStop(1, 'rgba(0,0,0,0.035)');
    a.fillStyle = gr; a.fillRect(x, y, s, s);
    const rv = 28 + Math.round(r() * 14); ro.fillStyle = `rgb(${rv},${rv},${rv})`; ro.fillRect(x, y, s, s);
    // ふちの丸み(高さ)
    const steps = 5;
    for (let k = 0; k < steps; k++) { const t = (k + 1) / steps; const vv = Math.round(255 * (1 - Math.pow(1 - t, 2))); hc.fillStyle = `rgb(${vv},${vv},${vv})`; hc.fillRect(x + k, y + k, s - k * 2, s - k * 2); }
  }
  // ごく弱いゆらぎ
  const hgt = heightFromCanvas(ch); const n = makeNoise2(seed + 3, 16);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) hgt[y * w + x] += fbm(n, x / w * 16, y / h * 16, 2) * 0.05;
  return {
    map: texFromCanvas(ca, { srgb: true, aniso: 8 }),
    roughnessMap: texFromCanvas(cr, { aniso: 4 }),
    normalMap: texFromCanvas(normalCanvasFromHeight(hgt, w, h, 2.2), { aniso: 8 }),
  };
}

// 石調のデッキ/床
export function makeStone(seed, size, base, speck) {
  const c = canvasOf(size, size), ctx = c.getContext('2d'); const img = ctx.createImageData(size, size); const d = img.data;
  const n1 = makeNoise2(seed, 8), n2 = makeNoise2(seed + 7, 64), n3 = makeNoise2(seed + 11, 128); const hgt = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const cl = fbm(n1, u * 8, v * 8, 4) - 0.5; const sp = n2(u * 64, v * 64); const fine = n3(u * 128, v * 128);
    const s = (sp > 0.8 ? (sp - 0.8) * speck * 4 : 0) - (fine - 0.5) * 0.05;
    const i = (y * size + x) * 4; const k = 1 + cl * 0.09 - s;
    d[i] = clamp(base[0] * k, 0, 255); d[i + 1] = clamp(base[1] * k, 0, 255); d[i + 2] = clamp(base[2] * (k + cl * 0.02), 0, 255); d[i + 3] = 255;
    hgt[y * size + x] = fine * 0.5 + cl * 0.5;
  }
  ctx.putImageData(img, 0, 0);
  return { map: texFromCanvas(c, { srgb: true, aniso: 8 }), normalMap: texFromCanvas(normalCanvasFromHeight(hgt, size, size, 0.8), { aniso: 4 }) };
}

// タオル地(パイル)。uvは布1枚で0..1、repeatで細かさ
export function makeTerry(seed, size) {
  const n = makeNoise2(seed, size); const n2 = makeNoise2(seed + 5, 32); const hgt = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const loop = Math.pow(Math.abs(Math.sin(x * Math.PI / 4 + (y & 4 ? 1.57 : 0)) * Math.sin(y * Math.PI / 4)), 0.6);
    hgt[y * size + x] = loop * 0.55 + n(x, y) * 0.45 + fbm(n2, x / size * 32, y / size * 32, 2) * 0.25;
  }
  return texFromCanvas(normalCanvasFromHeight(hgt, size, size, 3.2), { aniso: 4 });
}

// 平織りの綿布
export function makeWeave(seed, size, threads) {
  const hgt = new Float32Array(size * size); const n = makeNoise2(seed, 64); const c = canvasOf(size, size), ctx = c.getContext('2d'); const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size * threads, v = y / size * threads; const iu = Math.floor(u), iv = Math.floor(v);
    const over = ((iu + iv) & 1) === 0; const fu = u - iu - 0.5, fv = v - iv - 0.5;
    const warp = Math.cos(fu * Math.PI) * (over ? 1 : 0.55) * (0.75 + 0.25 * Math.cos(fv * Math.PI * 2));
    const weft = Math.cos(fv * Math.PI) * (over ? 0.55 : 1) * (0.75 + 0.25 * Math.cos(fu * Math.PI * 2));
    const hv = Math.max(warp, weft) + (n(u * 3.1, v * 3.1) - 0.5) * 0.3; hgt[y * size + x] = hv;
    const sh = 200 + hv * 45 + (n(u * 0.7, v * 9) - 0.5) * 16; const i = (y * size + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = clamp(sh, 0, 255); img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return { map: texFromCanvas(c, { srgb: true, aniso: 4 }), normalMap: texFromCanvas(normalCanvasFromHeight(hgt, size, size, 2.4), { aniso: 4 }) };
}

// 籐かごの編み目
export function makeWicker(seed, size) {
  const hgt = new Float32Array(size * size); const c = canvasOf(size, size), ctx = c.getContext('2d'); const img = ctx.createImageData(size, size);
  const n = makeNoise2(seed, 32); const cols = 16, rows = 12;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size * cols, v = y / size * rows; const iv = Math.floor(v), fv = v - iv - 0.5;
    const ph = (u + (iv & 1) * 0.5) % 1; const wave = Math.cos(ph * Math.PI * 2);      // 横材が縦芯の上下を通る
    const strand = Math.cos(fv * Math.PI) * (0.65 + 0.35 * wave);
    const stake = Math.cos(((u % 1) - 0.5) * Math.PI * 2.4) * 0.5 * (wave < 0 ? 1 : 0.2);
    const hv = Math.max(strand, stake) + (n(u * 2, v * 6) - 0.5) * 0.15; hgt[y * size + x] = hv;
    const fib = n(u * 0.6, v * 14) * 0.25; const k = 0.5 + hv * 0.45 + fib; const i = (y * size + x) * 4;
    img.data[i] = clamp(168 * k + 40, 0, 255); img.data[i + 1] = clamp(120 * k + 26, 0, 255); img.data[i + 2] = clamp(68 * k + 14, 0, 255); img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return { map: texFromCanvas(c, { srgb: true, aniso: 8 }), normalMap: texFromCanvas(normalCanvasFromHeight(hgt, size, size, 3.5), { aniso: 8 }) };
}

// 水底のコースティクス模様(タイル可)
export function makeCaustics(size) {
  const c = canvasOf(size, size), ctx = c.getContext('2d'); const img = ctx.createImageData(size, size); const TAU = Math.PI * 2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const px = (x / size) * TAU - 250, py = (y / size) * TAU - 250; let ix = px, iy = py, cc = 1; const inten = 0.005, t = 1.7;
    for (let n = 0; n < 5; n++) {
      const tt = t * (1 - 3.5 / (n + 1)); const nx = px + Math.cos(tt - ix) + Math.sin(tt + iy), ny = py + Math.sin(tt - iy) + Math.cos(tt + ix); ix = nx; iy = ny;
      const lx = px / (Math.sin(ix + tt) / inten), ly = py / (Math.cos(iy + tt) / inten); cc += 1 / Math.sqrt(lx * lx + ly * ly);
    }
    cc /= 5; cc = 1.17 - Math.pow(cc, 1.4); const v = clamp(Math.pow(Math.abs(cc), 8), 0, 1); const i = (y * size + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v * 255; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return texFromCanvas(c, { aniso: 2 });
}

// 水面の細かいさざ波法線
export function makeRipple(seed, size) {
  const n = makeNoise2(seed, 16); const hgt = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) hgt[y * size + x] = fbm(n, x / size * 16, y / size * 16, 3);
  return texFromCanvas(normalCanvasFromHeight(hgt, size, size, 2.0), { aniso: 2 });
}

// 泡: 細かな気泡の法線
export function makeBubbles(seed, size) {
  const c = canvasOf(size, size), ctx = c.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size); const r = rng(seed);
  for (let i = 0; i < 520; i++) {
    const x = r() * size, y = r() * size, rad = 2 + r() * r() * 9;
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
      const g = ctx.createRadialGradient(x + ox * size, y + oy * size, 0, x + ox * size, y + oy * size, rad);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.7, 'rgba(190,190,190,0.8)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x + ox * size, y + oy * size, rad, 0, 7); ctx.fill();
    }
  }
  return texFromCanvas(normalCanvasFromHeight(heightFromCanvas(c), size, size, 2.6), { aniso: 2 });
}

// 産毛の房ノイズ(R=細かい毛, G=粗い束)
export function makeFurNoise(seed, size) {
  const c = canvasOf(size, size), ctx = c.getContext('2d'); const img = ctx.createImageData(size, size); const r = rng(seed); const n = makeNoise2(seed + 2, 32);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4; img.data[i] = r() * 255; img.data[i + 1] = clamp(fbm(n, x / size * 32, y / size * 32, 2) * 300 - 20, 0, 255); img.data[i + 2] = r() * 255; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = texFromCanvas(c, {}); t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; return t;
}

// すりガラスの窓(外の緑と空のぼけ)
export function makeWindow(seed) {
  const w = 256, h = 256; const c = canvasOf(w, h), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fbfdff'); g.addColorStop(0.55, '#f4f8f6'); g.addColorStop(1, '#dfead8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); const r = rng(seed);
  for (let i = 0; i < 26; i++) {
    const x = r() * w, y = h * (0.62 + r() * 0.45), rad = 26 + r() * 46; const gg = ctx.createRadialGradient(x, y, 0, x, y, rad);
    gg.addColorStop(0, `rgba(${150 + r() * 40 | 0},${190 + r() * 30 | 0},${130 + r() * 30 | 0},0.33)`); gg.addColorStop(1, 'rgba(180,210,160,0)'); ctx.fillStyle = gg; ctx.fillRect(0, 0, w, h);
  }
  return texFromCanvas(c, { srgb: true, clamp: true });
}

// あひるの羽の地図(円筒UV: u=胴回り, v=尾→胸)。アルベドと法線を返す
export function makeFeatherMaps(seed, opts) {
  const W = 768, H = 384; const r = rng(seed);
  const ca = canvasOf(W, H), a = ca.getContext('2d'); const ch = canvasOf(W, H), hc = ch.getContext('2d');
  a.fillStyle = opts.base; a.fillRect(0, 0, W, H); hc.fillStyle = '#808080'; hc.fillRect(0, 0, W, H);
  const rows = 34;
  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1); const yc = H * (1 - v);                    // キャンバスでは下が尾
    const count = Math.round(26 + v * 40);
    for (let i = 0; i < count; i++) {
      const u = (i + (j & 1) * 0.5 + (r() - 0.5) * 0.3) / count; const top = 1 - Math.abs(u - 0.5) * 2;   // 1=背, 0=腹
      const wing = smooth(0.25, 0.5, top) * (1 - smooth(0.72, 0.9, top)) * (1 - smooth(0.55, 0.8, v)) * smooth(0.02, 0.2, v);
      const len = (9 + 26 * wing + 8 * (1 - v)) * (0.85 + r() * 0.3) * (1 - smooth(0.7, 1, v) * 0.5);
      const wid = (W / count) * (0.7 + 0.25 * r()) * (1 - wing * 0.3);
      const x = u * W, y = yc + (r() - 0.5) * 4; const lean = (u - 0.5) * 0.5 * (1 - wing); const col = opts.feather(r, u, v, wing);
      drawFeather(a, hc, x, y, wid, len, lean, col, opts); if (x < 30) drawFeather(a, hc, x + W, y, wid, len, lean, col, opts); else if (x > W - 30) drawFeather(a, hc, x - W, y, wid, len, lean, col, opts);
    }
  }
  const hgt = heightFromCanvas(ch);
  return { map: texFromCanvas(ca, { srgb: true, aniso: 8 }), normalMap: texFromCanvas(normalCanvasFromHeight(hgt, W, H, opts.bump || 2.4), { aniso: 8 }) };
}

function drawFeather(a, hc, x, y, wid, len, lean, col, opts) {
  const c = Math.cos(lean), s = Math.sin(lean);
  for (const ctx of [hc, a]) {
    ctx.setTransform(c, s, -s, c, x, y);
    ctx.beginPath(); ctx.moveTo(-wid * 0.5, -len * 0.3); ctx.bezierCurveTo(-wid * 0.56, len * 0.5, -wid * 0.3, len, 0, len);
    ctx.bezierCurveTo(wid * 0.3, len, wid * 0.56, len * 0.5, wid * 0.5, -len * 0.3); ctx.closePath();
    if (ctx === hc) {
      const g = ctx.createLinearGradient(0, -len * 0.3, 0, len); g.addColorStop(0, '#6a6a6a'); g.addColorStop(0.8, '#a8a8a8'); g.addColorStop(1, '#c4c4c4');
      ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(70,70,70,0.4)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.moveTo(0, -len * 0.1); ctx.lineTo(0, len * 0.9); ctx.stroke();
    } else { ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = opts.edge || 'rgba(150,140,120,0.07)'; ctx.lineWidth = 1; ctx.stroke(); }
  }
  hc.setTransform(1, 0, 0, 1, 0, 0); a.setTransform(1, 0, 0, 1, 0, 0);
}

// はなまるカード(無地→はなまるを描き足す)
export function makeCard() {
  const c = canvasOf(256, 256); const ctx = c.getContext('2d'); const tex = texFromCanvas(c, { srgb: true, clamp: true, aniso: 8 });
  const n = makeNoise2(77, 32);
  function paper() {
    const img = ctx.createImageData(256, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { const i = (y * 256 + x) * 4; const k = 1 + (n(x / 8, y / 8) - 0.5) * 0.05 + (n(x / 1.5, y / 1.5) - 0.5) * 0.035; img.data[i] = 247 * k; img.data[i + 1] = 241 * k; img.data[i + 2] = 226 * k; img.data[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
  }
  // t:0..1 で渦巻き→花びらの順に描く
  function draw(t) {
    paper();
    if (t > 0) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(214,52,46,0.9)'; ctx.lineWidth = 9;
      const cx = 128, cy = 132; const total = 260; const upto = Math.floor(total * Math.min(1, t));
      ctx.beginPath();
      for (let i = 0; i <= upto; i++) {
        const s = i / total; let x, y;
        if (s < 0.55) { const q = s / 0.55; const ang = q * Math.PI * 5.2 - 1.2; const rad = 6 + q * 50; x = cx + Math.cos(ang) * rad; y = cy + Math.sin(ang) * rad; }
        else { const q = (s - 0.55) / 0.45; const ang = q * Math.PI * 2 + (Math.PI * 5.2 - 1.2); const rad = 68 + Math.abs(Math.sin(q * Math.PI * 3.5)) * 26; x = cx + Math.cos(ang) * rad; y = cy + Math.sin(ang) * rad; }
        x += (n(i * 0.21, 3) - 0.5) * 3; y += (n(7, i * 0.21) - 0.5) * 3;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(235,110,100,0.35)'; ctx.lineWidth = 4; ctx.stroke();
    }
    tex.needsUpdate = true;
  }
  draw(0);
  return { tex, draw };
}
