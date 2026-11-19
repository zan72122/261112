// 手続き生成テクスチャとマテリアル。画像ファイルは一切使わない（オフライン・単一フォルダ）。
(function () {
  'use strict';
  const { rng } = QP.util;

  // ---- テクスチャ ---------------------------------------------------------
  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function tex(c, opts) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    if (opts && opts.srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (opts && opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1]);
    return t;
  }

  // タイル可能な値ノイズ（高さ場）
  function heightField(size, cells, seed, octaves) {
    const out = new Float32Array(size * size);
    let amp = 1;
    let total = 0;
    for (let o = 0; o < octaves; o++) {
      const n = cells << o;
      const r = rng(seed + o * 101);
      const g = new Float32Array(n * n);
      for (let i = 0; i < g.length; i++) g[i] = r();
      for (let y = 0; y < size; y++) {
        const fy = (y / size) * n;
        const y0 = Math.floor(fy);
        const ty = fy - y0;
        const sy = ty * ty * (3 - 2 * ty);
        for (let x = 0; x < size; x++) {
          const fx = (x / size) * n;
          const x0 = Math.floor(fx);
          const tx = fx - x0;
          const sx = tx * tx * (3 - 2 * tx);
          const a = g[(y0 % n) * n + (x0 % n)];
          const b = g[(y0 % n) * n + ((x0 + 1) % n)];
          const c = g[((y0 + 1) % n) * n + (x0 % n)];
          const d = g[((y0 + 1) % n) * n + ((x0 + 1) % n)];
          out[y * size + x] += (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy) * amp;
        }
      }
      total += amp;
      amp *= 0.5;
    }
    for (let i = 0; i < out.length; i++) out[i] /= total;
    return out;
  }

  // 高さ場 → 法線マップ
  function normalFromHeight(h, size, strength) {
    const c = canvas(size, size);
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const l = h[y * size + ((x + size - 1) % size)];
        const r = h[y * size + ((x + 1) % size)];
        const u = h[((y + size - 1) % size) * size + x];
        const d = h[((y + 1) % size) * size + x];
        let nx = (l - r) * strength;
        let ny = (u - d) * strength;
        const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
        nx *= inv;
        ny *= inv;
        const i = (y * size + x) * 4;
        img.data[i] = (nx * 0.5 + 0.5) * 255;
        img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
        img.data[i + 2] = inv * 255;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  const T = (QP.tex = {});

  // 塗装のゆず肌
  T.orangePeel = tex(normalFromHeight(heightField(128, 16, 7, 2), 128, 2.2), { repeat: [5, 5] });

  // ヘアライン（粗さマップ）: 横方向に流れる細い筋
  T.brushed = (function () {
    const c = canvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#a2a2a2';
    ctx.fillRect(0, 0, 256, 256);
    const r = rng(11);
    for (let i = 0; i < 1400; i++) {
      const y = r() * 256;
      const v = 120 + r() * 110;
      ctx.strokeStyle = `rgba(${v},${v},${v},${0.18 + r() * 0.3})`;
      ctx.lineWidth = 0.5 + r() * 0.9;
      const x = r() * 256;
      const len = 60 + r() * 220;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.moveTo(x - 256, y);
      ctx.lineTo(x + len - 256, y);
      ctx.stroke();
    }
    return tex(c, { repeat: [2, 2] });
  })();

  // ベンチ天板の細かな斑点
  T.speckle = (function () {
    const c = canvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b4b7ba';
    ctx.fillRect(0, 0, 256, 256);
    const r = rng(23);
    for (let i = 0; i < 2600; i++) {
      const v = r() < 0.5 ? 150 + r() * 40 : 190 + r() * 50;
      ctx.fillStyle = `rgba(${v},${v},${v + 2},${0.35 + r() * 0.4})`;
      const s = 0.5 + r() * 1.6;
      ctx.fillRect(r() * 256, r() * 256, s, s);
    }
    return tex(c, { srgb: true, repeat: [10, 8] });
  })();

  // ぼかし円（発光・湯気・影に共用）
  T.softDot = (function () {
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.62)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.18)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    return t;
  })();

  // ポリイミドヒーターの配線模様
  T.heater = (function () {
    const c = canvas(256, 128);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b06a12';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#6b3c08';
    ctx.lineWidth = 3;
    for (let y = 6; y < 128; y += 10.66) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
    return tex(c, { srgb: true, repeat: [1, 6] });
  })();

  // 基板のパターン
  T.pcb = (function () {
    const c = canvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0c3f27';
    ctx.fillRect(0, 0, 256, 256);
    const r = rng(41);
    ctx.strokeStyle = '#15613a';
    ctx.lineWidth = 2;
    for (let i = 0; i < 70; i++) {
      let x = Math.round(r() * 32) * 8;
      let y = Math.round(r() * 32) * 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let k = 0; k < 4; k++) {
        if (r() < 0.5) x += (Math.round(r() * 8) - 4) * 8;
        else y += (Math.round(r() * 8) - 4) * 8;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = '#b9b08a';
    for (let i = 0; i < 120; i++) ctx.fillRect(Math.round(r() * 32) * 8 - 1.5, Math.round(r() * 32) * 8 - 1.5, 3, 3);
    return tex(c, { srgb: true });
  })();

  // 電源ユニットのパンチング（法線なしの簡易表現）
  T.perf = (function () {
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#9a9da1';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#17181a';
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        ctx.beginPath();
        ctx.arc(x * 16 + (y % 2 ? 12 : 4), y * 16 + 8, 4.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return tex(c, { srgb: true, repeat: [6, 3] });
  })();

  // 送りねじの山（斜め縞）。回転が見えるようにする
  T.thread = (function () {
    const c = canvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#c9ccd0';
    ctx.fillRect(0, 0, 32, 32);
    ctx.strokeStyle = '#5d6065';
    ctx.lineWidth = 5;
    for (let k = -1; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo(0, k * 16);
      ctx.lineTo(32, k * 16 + 16);
      ctx.stroke();
    }
    return tex(c, { srgb: true, repeat: [1, 14] });
  })();

  // ---- マテリアル ---------------------------------------------------------
  const M = (QP.mat = {});
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const phys = (o) => new THREE.MeshPhysicalMaterial(o);

  // 塗装外装（明るいグレー）と中央バンド（艶のあるアンスラサイト）
  M.paint = phys({
    color: 0xe4e6e8, roughness: 0.4, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 1.3,
    normalMap: T.orangePeel, normalScale: new THREE.Vector2(0.12, 0.12),
  });
  M.paintDark = phys({
    color: 0x16181c, roughness: 0.3, metalness: 0, clearcoat: 0.9, clearcoatRoughness: 0.1, envMapIntensity: 1.8,
    normalMap: T.orangePeel, normalScale: new THREE.Vector2(0.05, 0.05),
  });
  M.inner = std({ color: 0x24262a, roughness: 0.8, metalness: 0.1 }); // 外装の裏側

  // アルマイト各色
  M.alu = std({ color: 0xc7cbd1, roughness: 0.34, metalness: 1, roughnessMap: T.brushed, envMapIntensity: 1.6 });
  M.aluBlock = std({ color: 0xd6dade, roughness: 0.36, metalness: 1, roughnessMap: T.brushed, envMapIntensity: 2.0 });
  M.aluSink = std({ color: 0xb9bec5, roughness: 0.42, metalness: 1, envMapIntensity: 1.8 });
  M.aluBlack = std({ color: 0x1a1b1f, roughness: 0.42, metalness: 0.9, roughnessMap: T.brushed });
  M.aluLid = std({ color: 0x1c1d21, roughness: 0.4, metalness: 0.9 });
  M.aluBlue = std({ color: 0x1d4fd1, roughness: 0.3, metalness: 1 });
  M.aluRed = std({ color: 0xb8231c, roughness: 0.3, metalness: 1 });

  M.steel = std({ color: 0xdfe1e4, roughness: 0.2, metalness: 1, envMapIntensity: 1.8 });
  M.thread = std({ color: 0xffffff, map: T.thread, roughness: 0.28, metalness: 1 });
  M.zinc = std({ color: 0x565a61, roughness: 0.48, metalness: 0.9 });
  M.brass = std({ color: 0xc79a4b, roughness: 0.32, metalness: 1 });
  M.copper = std({ color: 0xc47a4a, roughness: 0.35, metalness: 1 });

  M.plastic = std({ color: 0x141518, roughness: 0.55, metalness: 0 });
  M.plasticGrey = std({ color: 0x5a5e64, roughness: 0.6, metalness: 0 });
  M.rubber = std({ color: 0x0b0b0c, roughness: 0.92, metalness: 0 });
  M.silicone = std({ color: 0x8c9096, roughness: 0.85, metalness: 0 });
  M.ceramic = std({ color: 0xf1eee4, roughness: 0.62, metalness: 0 });
  M.pellet = std({ color: 0x6f7378, roughness: 0.45, metalness: 0.7 });
  M.heater = std({ color: 0xffffff, map: T.heater, roughness: 0.38, metalness: 0.25 });
  M.pcb = std({ color: 0xffffff, map: T.pcb, roughness: 0.5, metalness: 0.1 });
  M.perf = std({ color: 0xffffff, map: T.perf, roughness: 0.5, metalness: 0.7 });
  M.wireRed = std({ color: 0xc0261f, roughness: 0.55 });
  M.wireBlack = std({ color: 0x101012, roughness: 0.55 });
  M.belt = std({ color: 0x0d0d0e, roughness: 0.8 });

  // プレート（白いポリプロピレン）とシールフィルム
  M.plate = std({ color: 0xf3f4f2, roughness: 0.48, metalness: 0 });
  // 透明フィルム: 下地は透かし、映り込みだけを加算する（薄い不透明度だと艶まで消えてしまうため）
  M.film = phys({
    color: 0x05070a, roughness: 0.07, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 2.1,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
  });
  M.liner = std({ color: 0xf6f6f3, roughness: 0.75 });

  // タッチパネルのカバーガラスとレンズ
  M.glassBlack = phys({ color: 0x050506, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03 });
  M.lens = phys({
    color: 0xbcd0ff, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.42,
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.2, depthWrite: false,
  });
  M.sensor = std({ color: 0x1a2a3a, roughness: 0.15, metalness: 0.9 });

  M.bench = std({ color: 0x9da1a6, map: T.speckle, roughness: 0.5, metalness: 0 });
  M.ghostLine = new THREE.LineBasicMaterial({ color: 0xbfd6ff, transparent: true, opacity: 0, depthWrite: false });

  // 温度で色づく部品は専用インスタンスにして emissive を個別に動かす
  M.clone = (m) => m.clone();

  // フィルター用の色ガラス
  M.filterGlass = (hex) => phys({
    color: hex, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.72,
    clearcoat: 1, clearcoatRoughness: 0.03, emissive: hex, emissiveIntensity: 0.18, envMapIntensity: 1.8,
  });
})();
