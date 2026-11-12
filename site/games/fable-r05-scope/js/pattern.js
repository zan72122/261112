// The printed optical test pattern (ruler grid + letters) and the small engraved-label textures.
// The same drawing code feeds the texture on the 3D slide and the 2D "through the eyepiece" inset.
(function () {
  'use strict';
  const S = window.SCOPE;
  const FONT = '"Helvetica Neue", Helvetica, Arial, "Noto Sans", sans-serif';

  // Slide geometry (mm). Origin = slide centre, x along the long side, y towards the front of the stage.
  const SLIDE = { w: 76, h: 26, labelX1: -19.5, px: 12, py: 9 };

  // Draw the pattern. ctx must already be scaled so that 1 unit = 1 mm (y down). ppm = device px per mm,
  // view = {x0,y0,x1,y1} visible rectangle in mm (used for culling and level of detail).
  function drawPattern(ctx, ppm, view, ink) {
    const lw = (mm) => Math.max(mm, 0.75 / ppm);
    const vis = (x0, y0, x1, y1) => !(x1 < view.x0 || x0 > view.x1 || y1 < view.y0 || y0 > view.y1);
    const PX = SLIDE.px, PY = SLIDE.py;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineCap = 'butt';
    const text = (str, x, y, h, align, weight) => {
      if (h * ppm < 3.2) return;
      ctx.save();
      ctx.translate(x, y);
      const k = h / 100;
      ctx.scale(k, k);
      ctx.font = `${weight || 600} 100px ${FONT}`;
      ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(str, 0, 0);
      ctx.restore();
    };
    const line = (x0, y0, x1, y1, w) => { ctx.lineWidth = lw(w); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); };

    // frame
    ctx.lineWidth = lw(0.05);
    ctx.strokeRect(-PX, -PY, PX * 2, PY * 2);
    // 1 mm grid
    ctx.globalAlpha = ppm > 12 ? 0.8 : 0.45;
    for (let x = -PX + 1; x < PX; x++) if (x !== 0 && vis(x, -PY, x, PY)) line(x, -PY, x, PY, 0.008);
    for (let y = -PY + 1; y < PY; y++) if (y !== 0 && vis(-PX, y, PX, y)) line(-PX, y, PX, y, 0.008);
    ctx.globalAlpha = 1;
    // main axes
    line(-PX, 0, PX, 0, 0.01); line(0, -PY, 0, PY, 0.01);
    // 0.1 mm grid in the central 2 x 2 mm
    if (ppm > 55 && vis(-1, -1, 1, 1)) {
      ctx.globalAlpha = 0.55;
      for (let k = -9; k <= 9; k++) if (k !== 0) { line(k / 10, -1, k / 10, 1, 0.003); line(-1, k / 10, 1, k / 10, 0.003); }
      ctx.globalAlpha = 1;
    }
    // ruler ticks along both axes: 1 mm, 0.5 mm, 0.1 mm and (near the centre) 0.01 mm
    const ticks = (step, len, w, range, skip) => {
      if (step * ppm < 2.2) return;
      const n = Math.round(range / step);
      const i0 = Math.max(-n, Math.floor(view.x0 / step)), i1 = Math.min(n, Math.ceil(view.x1 / step));
      if (view.y0 < len && view.y1 > -len) for (let i = i0; i <= i1; i++) { if (skip && i % skip === 0) continue; line(i * step, -len, i * step, len, w); }
      const j0 = Math.max(-Math.round(Math.min(range, PY) / step), Math.floor(view.y0 / step)), j1 = Math.min(Math.round(Math.min(range, PY) / step), Math.ceil(view.y1 / step));
      if (view.x0 < len && view.x1 > -len) for (let j = j0; j <= j1; j++) { if (skip && j % skip === 0) continue; line(-len, j * step, len, j * step, w); }
    };
    ticks(1, 0.42, 0.012, PX, 0);
    ticks(0.5, 0.28, 0.009, PX, 2);
    ticks(0.1, 0.16, 0.005, PX, 5);
    ticks(0.01, 0.028, 0.0016, 1.5, 10);
    ticks(0.05, 0.05, 0.0022, 1.5, 2);
    // numbers on the rulers (mm)
    for (let i = -PX + 1; i < PX; i++) if (i !== 0 && vis(i - 0.4, 0.4, i + 0.4, 1.0)) text(String(Math.abs(i)), i, 0.72, 0.26, 'center', 500);
    for (let j = -PY + 1; j < PY; j++) if (j !== 0 && vis(0.4, j - 0.3, 1.2, j + 0.3)) text(String(Math.abs(j)), 0.62, j, 0.26, 'left', 500);
    // 0.1 mm numbers near the centre
    if (ppm > 110) for (let i = -9; i <= 9; i++) if (i !== 0) {
      if (vis(i / 10 - 0.05, 0.02, i / 10 + 0.05, 0.1)) text('.' + Math.abs(i), i / 10, 0.066, 0.026, 'center', 500);
      if (vis(0.02, i / 10 - 0.05, 0.12, i / 10 + 0.05)) text('.' + Math.abs(i), 0.05, i / 10, 0.026, 'left', 500);
    }
    // labels of the 1 mm grid squares (column letter + row number)
    if (ppm > 16) {
      const c0 = Math.max(-PX, Math.floor(view.x0)), c1 = Math.min(PX - 1, Math.floor(view.x1));
      const r0 = Math.max(-PY, Math.floor(view.y0)), r1 = Math.min(PY - 1, Math.floor(view.y1));
      ctx.globalAlpha = 0.85;
      for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) {
        if ((c === -1 || c === 0) && (r === -1 || r === 0)) continue;
        text(String.fromCharCode(65 + c + PX) + (r + PY + 1), c + 0.06, r + 0.17, 0.17, 'left', 500);
      }
      ctx.globalAlpha = 1;
    }
    // concentric target
    for (const r of [0.05, 0.1, 0.25, 0.5]) {
      if (r * ppm < 2) continue;
      ctx.lineWidth = lw(r < 0.2 ? 0.0022 : 0.006);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    }
    // letters at three scales (asymmetric on purpose: they reveal the image inversion)
    text('OPTICS', -2.02, -1.56, 0.86, 'center', 700);
    text('TEST 123', 2.3, 1.6, 0.6, 'center', 700);
    text('F', -3.5, 1.52, 1.5, 'center', 800);
    text('R', 3.5, -1.5, 1.5, 'center', 800);
    text('FOCUS', -0.5, -0.36, 0.17, 'center', 700);
    text('abc 456', 0.5, 0.63, 0.15, 'center', 700);
    text('F', 0.66, -0.52, 0.3, 'center', 800);
    text('micro', -0.11, -0.085, 0.036, 'center', 700);
    text('10 µm / div', 0.15, 0.125, 0.026, 'center', 600);
    text('R', 0.16, -0.13, 0.07, 'center', 800);
    text('F', -0.15, 0.14, 0.07, 'center', 800);
  }

  // texture for the top face of the 3D slide: transparent glass, black ink, frosted label field
  function slideCanvas() {
    const ppm = 28, c = document.createElement('canvas');
    c.width = Math.round(SLIDE.w * ppm); c.height = Math.round(SLIDE.h * ppm);
    const ctx = c.getContext('2d');
    ctx.setTransform(ppm, 0, 0, ppm, c.width / 2, c.height / 2);
    // frosted label field on the left end
    ctx.fillStyle = 'rgba(244,244,240,0.93)';
    ctx.fillRect(-SLIDE.w / 2 + 0.4, -SLIDE.h / 2 + 0.4, SLIDE.labelX1 + SLIDE.w / 2 - 0.4, SLIDE.h - 0.8);
    ctx.fillStyle = '#1b1d22';
    const t = (s, y, h, w) => { ctx.save(); ctx.translate(-28.9, y); ctx.scale(h / 100, h / 100); ctx.font = `${w} 100px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore(); };
    t('TEST PATTERN', -7.6, 1.9, 700);
    t('GRID  1 mm / 0.1 / 0.01', -4.2, 1.15, 500);
    t('RULER + LETTERS', -1.9, 1.15, 500);
    t('76 × 26 mm', 3.4, 1.5, 600);
    t('OPTICS TEACHING SLIDE', 7.4, 1.0, 500);
    ctx.strokeStyle = '#1b1d22'; ctx.lineWidth = 0.12;
    ctx.strokeRect(-36.6, -10.6, 15.4, 21.2);
    drawPattern(ctx, ppm, { x0: -38, y0: -13, x1: 38, y1: 13 }, 'rgba(10,11,14,0.96)');
    return c;
  }

  // ---- small label textures ----
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function bandText(w, h, items, color, font) {
    const c = canvas(w, h), ctx = c.getContext('2d');
    ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    for (const it of items) {
      ctx.font = `${it.weight || 600} ${Math.round(h * (it.size || 0.5))}px ${font || FONT}`;
      ctx.fillStyle = it.color || color;
      ctx.fillText(it.text, w * it.x, h * (it.y || 0.5));
    }
    return c;
  }
  const objectiveBand = (mag, na) => bandText(1024, 160, [
    { text: `PLAN ${mag}×/${na.toFixed(2)}`, x: 0.25, y: 0.34, size: 0.36, weight: 700 },
    { text: '∞ / –   FN 26.5', x: 0.25, y: 0.76, size: 0.26, weight: 500 },
    { text: `PLAN ${mag}×/${na.toFixed(2)}`, x: 0.75, y: 0.34, size: 0.36, weight: 700 },
    { text: '∞ / –   FN 26.5', x: 0.75, y: 0.76, size: 0.26, weight: 500 },
  ], '#0c0d10');
  const eyepieceBand = () => bandText(1024, 96, [
    { text: '10× / 26.5', x: 0.17, size: 0.62, weight: 600 }, { text: '10× / 26.5', x: 0.5, size: 0.62, weight: 600 }, { text: '10× / 26.5', x: 0.83, size: 0.62, weight: 600 },
  ], '#e9eaec');
  const adapterBand = () => bandText(1024, 96, [
    { text: 'C-MOUNT  0.63×', x: 0.25, size: 0.56, weight: 600 }, { text: 'C-MOUNT  0.63×', x: 0.75, size: 0.56, weight: 600 },
  ], '#e9eaec');
  const condenserBand = () => bandText(1024, 128, [
    { text: 'ABBE  NA 1.25', x: 0.25, y: 0.34, size: 0.34, weight: 700 }, { text: '0.1 · 0.2 · 0.4 · 0.6 · 0.9', x: 0.25, y: 0.76, size: 0.26, weight: 500 },
    { text: 'ABBE  NA 1.25', x: 0.75, y: 0.34, size: 0.34, weight: 700 }, { text: '0.1 · 0.2 · 0.4 · 0.6 · 0.9', x: 0.75, y: 0.76, size: 0.26, weight: 500 },
  ], '#e9eaec');
  function ticksBand(w, h, n, color) {
    const c = canvas(w, h), ctx = c.getContext('2d');
    ctx.fillStyle = color;
    for (let k = 0; k < n; k++) {
      const x = ((k + 0.5) / n) * w, major = k % 5 === 0;
      ctx.fillRect(x - (major ? 2.2 : 1.2), major ? h * 0.2 : h * 0.45, major ? 4.4 : 2.4, major ? h * 0.8 : h * 0.55);
    }
    return c;
  }
  function scaleStrip(lenMM, color) {
    const ppm = 16, c = canvas(Math.round(lenMM * ppm), 96), ctx = c.getContext('2d');
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.font = `500 34px ${FONT}`;
    for (let k = 0; k <= lenMM; k++) {
      const x = k * ppm, big = k % 10 === 0, mid = k % 5 === 0;
      ctx.fillRect(x - 1, 96 - (big ? 50 : mid ? 38 : 26), 2, big ? 50 : mid ? 38 : 26);
      if (big && k > 0 && k < lenMM) ctx.fillText(String(k), x, 40);
    }
    return c;
  }
  function badge() {
    const c = canvas(640, 120), ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 120);
    g.addColorStop(0, '#2a2d33'); g.addColorStop(1, '#17191d');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 640, 120);
    ctx.fillStyle = '#d9dbe0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 46px ${FONT}`; ctx.fillText('OPTICS TRAINER', 320, 46);
    ctx.font = `500 24px ${FONT}`; ctx.fillStyle = '#9aa0aa'; ctx.fillText('TRANSMITTED LIGHT · 4 / 10 / 20 / 40', 320, 90);
    return c;
  }
  function dial() {
    const c = canvas(256, 256), ctx = c.getContext('2d');
    ctx.fillStyle = '#17181b'; ctx.fillRect(0, 0, 256, 256);
    ctx.translate(128, 128); ctx.fillStyle = '#d5d7da';
    for (let k = 0; k < 11; k++) { ctx.save(); ctx.rotate((-150 + k * 30) * Math.PI / 180); ctx.fillRect(-2, -118, 4, k % 5 === 0 ? 26 : 16); ctx.restore(); }
    ctx.fillStyle = '#f3a52b'; ctx.fillRect(-3, -84, 6, 46);
    return c;
  }

  S.pattern = { SLIDE, drawPattern, slideCanvas, objectiveBand, eyepieceBand, adapterBand, condenserBand, ticksBand, scaleStrip, badge, dial };
})();
