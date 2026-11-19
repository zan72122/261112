/* Procedural canvas textures. Everything is generated at start-up: no image files, no network. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;
  const X = (EC.tex = {});

  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  X.canvas = canvas;

  function mk(c, opts) {
    const t = new T.CanvasTexture(c);
    opts = opts || {};
    if (opts.srgb) t.colorSpace = T.SRGBColorSpace;
    t.wrapS = t.wrapT = opts.clamp ? T.ClampToEdgeWrapping : T.RepeatWrapping;
    t.anisotropy = opts.aniso || 4;
    if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1]);
    if (opts.offset) t.offset.set(opts.offset[0], opts.offset[1]);
    t.needsUpdate = true;
    return t;
  }
  X.mk = mk;

  /* Height canvas (red channel) -> tangent-space normal map canvas. Wraps at the edges. */
  function toNormal(src, strength) {
    const w = src.width, h = src.height;
    const sd = src.getContext('2d').getImageData(0, 0, w, h).data;
    const out = canvas(w, h);
    const ctx = out.getContext('2d');
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let y = 0; y < h; y++) {
      const yu = ((y - 1 + h) % h) * w, yd = ((y + 1) % h) * w;
      for (let x = 0; x < w; x++) {
        const xl = (x - 1 + w) % w, xr = (x + 1) % w;
        const dx = (sd[(y * w + xr) * 4] - sd[(y * w + xl) * 4]) / 255;
        const dy = (sd[(yd + x) * 4] - sd[(yu + x) * 4]) / 255;
        let nx = -dx * strength, ny = dy * strength, nz = 1;
        const l = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx *= l; ny *= l; nz *= l;
        const i = (y * w + x) * 4;
        d[i] = (nx * 0.5 + 0.5) * 255;
        d[i + 1] = (ny * 0.5 + 0.5) * 255;
        d[i + 2] = (nz * 0.5 + 0.5) * 255;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return out;
  }
  X.toNormal = toNormal;

  /* Brushed metal: long horizontal streaks. Returns {rough, normal} textures (tile ~8 cm). */
  function brushed(seed, size, period) {
    const r = U.rng(seed);
    const c = canvas(size, size);
    const g = c.getContext('2d');
    g.fillStyle = 'rgb(150,150,150)';
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < size * 5; i++) {
      const y = r() * size;
      const len = size * (0.25 + r() * 0.9);
      const x = r() * size;
      const v = 95 + r() * 120;
      g.strokeStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + (0.1 + r() * 0.22) + ')';
      g.lineWidth = 0.5 + r() * 1.1;
      g.beginPath();
      g.moveTo(x, y); g.lineTo(x + len, y);
      g.moveTo(x - size, y); g.lineTo(x + len - size, y);
      g.stroke();
    }
    const rep = [1 / period, 1 / period];
    return {
      rough: mk(c, { repeat: rep, aniso: 8 }),
      normal: mk(toNormal(c, 1.6), { repeat: rep, aniso: 8 }),
    };
  }

  /* Soft blobby noise by summing random soft dots (tiles). */
  function blobNoise(seed, size, count, rMin, rMax, base, amp) {
    const r = U.rng(seed);
    const c = canvas(size, size);
    const g = c.getContext('2d');
    g.fillStyle = 'rgb(' + base + ',' + base + ',' + base + ')';
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < count; i++) {
      const x = r() * size, y = r() * size, rad = rMin + r() * (rMax - rMin);
      const v = r() < 0.5 ? 255 : 0;
      for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
        const cx = x + ox * size, cy = y + oy * size;
        if (cx < -rad || cy < -rad || cx > size + rad || cy > size + rad) continue;
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
        gr.addColorStop(0, 'rgba(' + v + ',' + v + ',' + v + ',' + amp + ')');
        gr.addColorStop(1, 'rgba(' + v + ',' + v + ',' + v + ',0)');
        g.fillStyle = gr;
        g.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }
    }
    return c;
  }
  X.blobNoise = blobNoise;

  function speckle(seed, size, base, n, spread) {
    const r = U.rng(seed);
    const c = canvas(size, size);
    const g = c.getContext('2d');
    g.fillStyle = 'rgb(' + base[0] + ',' + base[1] + ',' + base[2] + ')';
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < n; i++) {
      const v = (r() - 0.5) * spread;
      g.fillStyle = 'rgba(' + (base[0] + v | 0) + ',' + (base[1] + v | 0) + ',' + (base[2] + v | 0) + ',' + (0.35 + r() * 0.5) + ')';
      const s = 0.6 + r() * 1.8;
      g.fillRect(r() * size, r() * size, s, s);
    }
    return c;
  }

  /* Radial soft dot (particles, contact shadows). */
  function softDot(size, inner, hard) {
    const c = canvas(size, size);
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(size / 2, size / 2, size * (inner || 0), size / 2, size / 2, size / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    if (hard) gr.addColorStop(hard, 'rgba(255,255,255,0.85)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, size, size);
    return c;
  }

  /* Blurred rounded rectangle used as a baked contact shadow under the units. */
  function shadowBlob(size, pad, power) {
    const c = canvas(size, size);
    const g = c.getContext('2d');
    const img = g.createImageData(size, size);
    const d = img.data;
    const half = size / 2, inner = half - pad;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const dx = Math.max(0, Math.abs(x - half + 0.5) - inner), dy = Math.max(0, Math.abs(y - half + 0.5) - inner);
      const dist = Math.sqrt(dx * dx + dy * dy) / pad;
      const a = Math.pow(U.sat(1 - dist), power);
      const i = (y * size + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = 0;
      d[i + 3] = a * 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  /* Work-surface top: brushed steel with milled drain channels. u,v in [0,1] across the plate. */
  function plateMaps() {
    const W = 1024, H = 768;
    const D = EC.D;
    const pw = D.plate.x1 - D.plate.x0, pd = D.plate.z1 - D.plate.z0;
    const sx = W / pw, sz = H / pd;
    const r = U.rng(77);
    const hgt = canvas(W, H);
    let g = hgt.getContext('2d');
    g.fillStyle = 'rgb(160,160,160)';
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 5200; i++) {
      const y = r() * H, x = r() * W, len = W * (0.2 + r() * 0.7), v = 110 + r() * 100;
      g.strokeStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + (0.08 + r() * 0.16) + ')';
      g.lineWidth = 0.6 + r();
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y); g.moveTo(x - W, y); g.lineTo(x + len - W, y); g.stroke();
    }
    const col = canvas(W, H);
    const gc = col.getContext('2d');
    gc.fillStyle = 'rgb(255,255,255)';
    gc.fillRect(0, 0, W, H);

    function channels(ctx, style, lw) {
      ctx.strokeStyle = style; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const m = 1.1 * sx, rr = 1.6 * sx;
      const x0 = m, x1 = W - m, y0 = m, y1 = H - m;
      ctx.beginPath();
      ctx.moveTo(x0 + rr, y0); ctx.lineTo(x1 - rr, y0); ctx.arcTo(x1, y0, x1, y0 + rr, rr);
      ctx.lineTo(x1, y1 - rr); ctx.arcTo(x1, y1, x1 - rr, y1, rr);
      ctx.lineTo(x0 + rr, y1); ctx.arcTo(x0, y1, x0, y1 - rr, rr);
      ctx.lineTo(x0, y0 + rr); ctx.arcTo(x0, y0, x0 + rr, y0, rr);
      ctx.stroke();
      // feeders running down the slope into the grille
      const gz = (D.grille.z0 - D.plate.z0) * sz;
      const gx0 = (D.grille.x0 - D.plate.x0) * sx, gx1 = (D.grille.x1 - D.plate.x0) * sx;
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const fx = gx0 + ((gx1 - gx0) * (k + 0.5)) / 5;
        const tx = W / 2 + (fx - W / 2) * 2.5;
        ctx.moveTo(tx, y0 + 0.2 * sz); ctx.lineTo(fx, gz);
      }
      ctx.stroke();
    }
    channels(g, 'rgba(40,40,40,0.9)', 0.42 * sx);
    channels(g, 'rgba(90,90,90,0.9)', 0.2 * sx);
    channels(gc, 'rgba(120,122,126,0.55)', 0.44 * sx);
    channels(gc, 'rgba(70,72,76,0.5)', 0.16 * sx);
    return {
      map: mk(col, { srgb: true, clamp: true, aniso: 8 }),
      rough: mk(hgt, { clamp: true, aniso: 8 }),
      normal: mk(toNormal(hgt, 2.2), { clamp: true, aniso: 8 }),
    };
  }

  /* Cold plate top: anodised aluminium under a bloom of frost (denser at the rim). */
  function frostMaps() {
    const S = 1024, r = U.rng(31);
    const col = canvas(S, S), rough = canvas(S, S);
    const g = col.getContext('2d'), gr = rough.getContext('2d');
    g.fillStyle = 'rgb(58,68,82)'; g.fillRect(0, 0, S, S);
    gr.fillStyle = 'rgb(84,84,84)'; gr.fillRect(0, 0, S, S);
    // machining swirl of the bare plate
    g.strokeStyle = 'rgba(160,172,186,0.035)'; g.lineWidth = 1;
    for (let i = 0; i < 90; i++) { g.beginPath(); g.arc(S / 2, S / 2, 12 + i * 8.4, 0, 6.3); g.stroke(); }
    // haze
    const haze = blobNoise(8, S, 90, 60, 220, 128, 0.2);
    g.globalAlpha = 0.28; g.globalCompositeOperation = 'screen'; g.drawImage(haze, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    const eg = g.createRadialGradient(S / 2, S / 2, S * 0.22, S / 2, S / 2, S * 0.72);
    eg.addColorStop(0, 'rgba(236,244,252,0.0)'); eg.addColorStop(1, 'rgba(236,244,252,0.42)');
    g.fillStyle = eg; g.fillRect(0, 0, S, S);
    // ice crystals
    for (let i = 0; i < 150000; i++) {
      const x = r() * S, y = r() * S;
      const ex = Math.min(x, S - x) / S, ey = Math.min(y, S - y) / S;
      const edge = 1 - U.sat(Math.min(ex, ey) * 4);
      const patch = 0.5 + 0.5 * Math.sin(x * 0.0105 + 1.3) * Math.cos(y * 0.0085 + 0.4);
      const p = 0.14 + 0.7 * edge + 0.22 * patch;
      if (r() > p) continue;
      const a = 0.04 + r() * 0.22, s = 0.6 + r() * 1.5;
      g.fillStyle = 'rgba(240,247,255,' + a + ')';
      g.fillRect(x, y, s, s);
      gr.fillStyle = 'rgba(250,250,250,' + (a * 2) + ')';
      gr.fillRect(x, y, s, s);
    }
    gr.globalAlpha = 0.5; gr.drawImage(haze, 0, 0); gr.globalAlpha = 1;
    return { map: mk(col, { srgb: true, clamp: true, aniso: 8 }), rough: mk(rough, { clamp: true }) };
  }

  /* Cassette floor: slotted grid (alpha). */
  function slots() {
    const W = 256, H = 192;
    const c = canvas(W, H), g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'destination-out';
    const cols = 11, rows = 3, mx = 12, my = 14;
    const cw = (W - mx * 2) / cols, rh = (H - my * 2) / rows;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = mx + i * cw + cw * 0.22, y = my + j * rh + rh * 0.12;
      const w = cw * 0.56, h = rh * 0.76, rr = w / 2;
      g.beginPath();
      g.moveTo(x + rr, y); g.arcTo(x + w, y, x + w, y + h, rr); g.arcTo(x + w, y + h, x, y + h, rr);
      g.arcTo(x, y + h, x, y, rr); g.arcTo(x, y, x + w, y, rr); g.fill();
    }
    const t = mk(c, { srgb: true, clamp: true });
    return t;
  }

  /* Test chip print: ruler grid, tick marks and one asymmetric letter. */
  X.chip = function (color, letter) {
    const W = 208, H = 144;
    const c = canvas(W, H), g = c.getContext('2d');
    g.fillStyle = color; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, 0, W, H * 0.5);
    g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 1;
    const step = 16;
    g.beginPath();
    for (let x = step; x < W; x += step) { g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); }
    for (let y = step; y < H; y += step) { g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); }
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineWidth = 2;
    g.beginPath();
    for (let i = 0; i <= 13; i++) {
      const x = 8 + i * 14.77, l = i % 5 === 0 ? 16 : 8;
      g.moveTo(x, H); g.lineTo(x, H - l);
    }
    for (let i = 0; i <= 9; i++) {
      const y = 8 + i * 14.2, l = i % 5 === 0 ? 16 : 8;
      g.moveTo(0, y); g.lineTo(l, y);
    }
    g.stroke();
    g.strokeRect(3, 3, W - 6, H - 6);
    g.fillStyle = '#fff';
    g.font = 'bold 92px "Helvetica Neue", Helvetica, Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(letter, W / 2 + 8, H / 2 - 4);
    // orientation dot (top-left)
    g.beginPath(); g.arc(30, 26, 7, 0, 6.3); g.fill();
    return mk(c, { srgb: true, clamp: true, aniso: 8 });
  };

  /* Cassette writing face. */
  X.cassetteLabel = function (code) {
    const c = canvas(128, 48), g = c.getContext('2d');
    g.fillStyle = '#f4f4f1'; g.fillRect(0, 0, 128, 48);
    g.fillStyle = '#2a2d30';
    g.font = '600 26px "Helvetica Neue", Helvetica, Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(code, 64, 25);
    return mk(c, { srgb: true, clamp: true });
  };

  /* Ventilation louvres (colour + height). */
  function vents() {
    const W = 256, H = 256;
    const c = canvas(W, H), g = c.getContext('2d');
    g.clearRect(0, 0, W, H);
    for (let i = 0; i < 12; i++) {
      const y = 10 + i * 20.2;
      const gr = g.createLinearGradient(0, y, 0, y + 11);
      gr.addColorStop(0, 'rgba(8,9,10,0.95)'); gr.addColorStop(0.7, 'rgba(30,32,34,0.9)'); gr.addColorStop(1, 'rgba(120,122,124,0.5)');
      g.fillStyle = gr;
      const x = 14, w = W - 28, h = 11, rr = 5;
      g.beginPath();
      g.moveTo(x + rr, y); g.arcTo(x + w, y, x + w, y + h, rr); g.arcTo(x + w, y + h, x, y + h, rr);
      g.arcTo(x, y + h, x, y, rr); g.arcTo(x, y, x + w, y, rr); g.fill();
    }
    return mk(c, { srgb: true, clamp: true });
  }

  /* Small panel pictograms (no words): atlas of white line icons on transparent. */
  function icons() {
    const S = 96, n = 8;
    const c = canvas(S * n, S), g = c.getContext('2d');
    g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
    function at(i, fn) { g.save(); g.translate(i * S, 0); fn(); g.restore(); }
    at(0, function () { g.beginPath(); g.moveTo(48, 70); g.lineTo(24, 34); g.lineTo(72, 34); g.closePath(); g.fill(); });         // down
    at(1, function () { g.beginPath(); g.moveTo(48, 26); g.lineTo(24, 62); g.lineTo(72, 62); g.closePath(); g.fill(); });         // up
    at(2, function () { g.beginPath(); g.arc(48, 52, 22, -1.0, Math.PI + 1.0); g.stroke(); g.beginPath(); g.moveTo(48, 20); g.lineTo(48, 50); g.stroke(); }); // power
    at(3, function () {                                                                                                           // heat waves
      for (let k = 0; k < 3; k++) { const x = 28 + k * 20; g.beginPath(); g.moveTo(x, 74); g.bezierCurveTo(x - 12, 58, x + 12, 46, x, 24); g.stroke(); }
    });
    at(4, function () { g.beginPath(); g.moveTo(48, 16); g.bezierCurveTo(74, 48, 70, 78, 48, 78); g.bezierCurveTo(26, 78, 22, 48, 48, 16); g.fill(); }); // drop
    at(5, function () {                                                                                                           // snow
      for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; g.beginPath(); g.moveTo(48 + Math.cos(a) * 30, 48 + Math.sin(a) * 30); g.lineTo(48 - Math.cos(a) * 30, 48 - Math.sin(a) * 30); g.stroke(); }
    });
    at(6, function () { g.beginPath(); g.arc(48, 48, 20, 0, 6.3); g.stroke(); g.beginPath(); g.arc(48, 48, 5, 0, 6.3); g.fill(); }); // set
    at(7, function () {                                                                                                           // hot-surface warning
      g.fillStyle = '#f2c230'; g.strokeStyle = '#1a1a1a'; g.lineWidth = 5;
      g.beginPath(); g.moveTo(48, 10); g.lineTo(88, 82); g.lineTo(8, 82); g.closePath(); g.fill(); g.stroke();
      g.lineWidth = 4;
      for (let k = 0; k < 3; k++) { const x = 36 + k * 12; g.beginPath(); g.moveTo(x, 68); g.bezierCurveTo(x - 7, 58, x + 7, 52, x, 40); g.stroke(); }
      g.beginPath(); g.moveTo(30, 74); g.lineTo(66, 74); g.stroke();
    });
    return { tex: mk(c, { srgb: true, clamp: true }), n: n };
  }

  /* Level-window scale ticks. */
  function ticks() {
    const c = canvas(48, 256), g = c.getContext('2d');
    g.strokeStyle = 'rgba(235,238,240,0.92)'; g.lineWidth = 2.5;
    for (let i = 0; i <= 20; i++) {
      const y = 8 + i * 12;
      g.beginPath(); g.moveTo(2, y); g.lineTo(i % 5 === 0 ? 34 : 18, y); g.stroke();
    }
    return mk(c, { srgb: true, clamp: true });
  }

  /* Ribbed rubber pad (height). */
  function ribs() {
    const c = canvas(64, 64), g = c.getContext('2d');
    for (let y = 0; y < 64; y++) {
      const v = 128 + 110 * Math.sin((y / 64) * Math.PI * 2 * 4);
      g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
      g.fillRect(0, y, 64, 1);
    }
    return mk(toNormal(c, 1.4), { repeat: [0.5, 0.5] });
  }

  /* Hairline cracks for a block popped too early. */
  X.cracks = function (seed) {
    const S = 256, r = U.rng(seed);
    const c = canvas(S, S), g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, S, S);
    g.lineCap = 'round';
    function crack(x, y, a, len, w) {
      g.lineWidth = w; g.strokeStyle = 'rgba(70,66,58,0.9)';
      g.beginPath(); g.moveTo(x, y);
      let n = 0;
      while (len > 0 && n++ < 60) {
        const s = 6 + r() * 12;
        a += (r() - 0.5) * 1.1;
        x += Math.cos(a) * s; y += Math.sin(a) * s; len -= s;
        g.lineTo(x, y);
        if (w > 1.2 && r() < 0.3) { g.stroke(); crack(x, y, a + (r() < 0.5 ? 1 : -1) * (0.6 + r() * 0.6), len * 0.5, w * 0.6); g.lineWidth = w; g.beginPath(); g.moveTo(x, y); }
      }
      g.stroke();
    }
    const cx = S * (0.35 + r() * 0.3), cy = S * (0.35 + r() * 0.3);
    for (let k = 0; k < 5; k++) crack(cx, cy, (k / 5) * 6.28 + r(), S * (0.4 + r() * 0.4), 3.2);
    return mk(c, { srgb: true, clamp: true });
  };

  X.init = function () {
    X.brushA = brushed(11, 512, 9);
    X.brushB = brushed(23, 512, 5);
    X.peel = mk(toNormal(blobNoise(5, 256, 900, 3, 9, 128, 0.2), 0.9), { repeat: [0.4, 0.4] });
    X.bench = mk(speckle(3, 512, [196, 197, 195], 15000, 46), { srgb: true, repeat: [1 / 26, 1 / 26], aniso: 8 });
    X.benchRough = mk(blobNoise(9, 256, 240, 10, 40, 150, 0.14), { repeat: [1 / 45, 1 / 45] });
    X.dot = mk(softDot(64, 0), { srgb: true, clamp: true });
    X.shadowBlob = mk(shadowBlob(128, 38, 1.7), { clamp: true });
    X.plate = plateMaps();
    X.frost = frostMaps();
    X.slots = slots();
    X.vents = vents();
    X.icons = icons();
    X.ticks = ticks();
    X.ribs = ribs();
  };
})();
