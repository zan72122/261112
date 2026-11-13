/* pattern.js — the printed test pattern of the mock slides, drawn procedurally.
   Pattern space is millimetres, x right, y down, origin at the top-left of the 36 x 24 mm
   printed area. Every element has a level-of-detail rule, so the same function serves the
   3D slide texture, the live camera view, the tiles and the deep-zoom viewer. */
(function () {
  'use strict';
  const SS = window.SS, U = SS.util, C = SS.cfg;
  const P = (SS.pattern = {});
  const PW = C.pat.w, PH = C.pat.h;
  const SX0 = -C.slide.patX, SX1 = C.slide.L - C.slide.patX; // slide edges in pattern space
  const SY0 = -C.slide.patY, SY1 = C.slide.W - C.slide.patY;
  const LABEL_X1 = -7; // frosted label covers x in [SX0, LABEL_X1]
  const FONT = '"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic","IPAPGothic",sans-serif';

  P.slides = [
    { id: 0, glass: 0xff8f7d, bg: '#ffe4dd', ink: '#5e1a22', ink2: '#c9443c', band: '#e8553f', mark: 'A', zs: 35 },
    { id: 1, glass: 0x6fd6a0, bg: '#dff7e6', ink: '#0f4634', ink2: '#1f9d6b', band: '#27a877', mark: 'B', zs: -60 },
    { id: 2, glass: 0x7fb4ff, bg: '#dfeaff', ink: '#16296b', ink2: '#3f6fe0', band: '#3d73e6', mark: 'C', zs: 90 },
  ];

  const ZONES = [
    ['あ', 'star', 'chart', 'chart2', 'bars', 'A'],
    ['rings', 'い', 'gray', 'checker', '1', 'ruler'],
    ['text', 'dots', 'う', 'shapes', 'stripes', 'B'],
    ['2', 'checker', 'え', 'star', 'text', 'C'],
  ];
  const CHART = [
    '#e53935', '#fb8c00', '#fdd835', '#43a047', '#00acc1', '#1e88e5',
    '#d81b60', '#8e24aa', '#f48fb1', '#c0ca33', '#00897b', '#6d4c41',
    '#ffcdd2', '#ffe0b2', '#fff9c4', '#c8e6c9', '#b2ebf2', '#bbdefb',
  ];

  // what the light meets at a point of the stage aperture
  P.materialAt = (x, y) => {
    if (x < SX0 || x > SX1 || y < SY0 || y > SY1) return 'air';
    return x < LABEL_X1 ? 'label' : 'glass';
  };

  /* Draw the region whose top-left is (x0,y0) mm at s px/mm into ctx (0,0,pw,ph).
     opt.flipped: the slide is upside down (seen mirrored). opt.tex: 3D texture look. */
  P.draw = function (ctx, sl, x0, y0, s, pw, ph, opt) {
    opt = opt || {};
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, pw, ph); ctx.clip();
    if (opt.flipped) { ctx.translate(0, ph); ctx.scale(1, -1); y0 = PH - y0 - ph / s; }
    const x1 = x0 + pw / s, y1 = y0 + ph / s;
    const X = (x) => (x - x0) * s, Y = (y) => (y - y0) * s;
    const rect = (ax, ay, bx, by) => ctx.fillRect(X(ax), Y(ay), (bx - ax) * s, (by - ay) * s);

    /* background: air, tinted glass, opaque label */
    if (opt.tex) {
      ctx.clearRect(0, 0, pw, ph);
      ctx.globalAlpha = 0.42; ctx.fillStyle = sl.bg; rect(SX0, SY0, SX1, SY1); ctx.globalAlpha = 1;
      drawLabelTex(ctx, sl, X, Y, s);
    } else {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, pw, ph);
      ctx.fillStyle = sl.bg; rect(SX0, SY0, SX1, SY1);
      ctx.fillStyle = '#26262b'; rect(SX0, SY0, LABEL_X1, SY1);
      // ground glass edge
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      const e = Math.max(0.08, 1 / s);
      rect(SX0, SY0, SX1, SY0 + e); rect(SX0, SY1 - e, SX1, SY1); rect(SX1 - e, SY0, SX1, SY1);
    }

    // printed area only from here on
    const vx0 = Math.max(x0, 0), vx1 = Math.min(x1, PW), vy0 = Math.max(y0, 0), vy1 = Math.min(y1, PH);
    if (vx1 > vx0 && vy1 > vy0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(X(0), Y(0), PW * s, PH * s); ctx.clip();
      const v = { ctx, sl, s, X, Y, rect, vx0, vx1, vy0, vy1 };
      drawZones(v);
      drawSpeckle(v);
      drawGrid(v);
      ctx.restore();
      // frame
      ctx.strokeStyle = sl.ink; ctx.lineWidth = Math.max(1, 0.16 * s);
      ctx.strokeRect(X(0), Y(0), PW * s, PH * s);
    }
    ctx.restore();
  };

  function drawLabelTex(ctx, sl, X, Y, s) {
    ctx.fillStyle = '#f4f2ec'; ctx.fillRect(X(SX0), Y(SY0), (LABEL_X1 - SX0) * s, (SY1 - SY0) * s);
    ctx.fillStyle = sl.band; ctx.fillRect(X(SX0), Y(SY0), (LABEL_X1 - SX0) * s, 6 * s);
    ctx.fillStyle = sl.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 ' + 13 * s + 'px ' + FONT;
    ctx.fillText(sl.mark, X((SX0 + LABEL_X1) / 2), Y(16));
    // arrow showing the scan side
    ctx.beginPath(); ctx.moveTo(X(-10), Y(3)); ctx.lineTo(X(-13), Y(1.2)); ctx.lineTo(X(-13), Y(4.8)); ctx.closePath();
    ctx.fillStyle = '#ffffff'; ctx.fill();
  }

  /* ---------- hierarchical graph paper: 10, 5, 1, 0.1, 0.01, 0.001 mm ---------- */
  const GRID = [
    { d: 10, w: 0.11, a: 0.9, skip: 0 },
    { d: 5, w: 0.08, a: 0.75, skip: 2 },
    { d: 1, w: 0.035, a: 0.55, skip: 5 },
    { d: 0.1, w: 0.005, a: 0.45, skip: 10 },
    { d: 0.01, w: 0.0006, a: 0.4, skip: 10 },
    { d: 0.001, w: 0.00007, a: 0.35, skip: 10 },
  ];
  function drawGrid(v) {
    const { ctx, sl, s, X, Y } = v;
    ctx.fillStyle = sl.ink;
    for (let g = 0; g < GRID.length; g++) {
      const L = GRID[g], sp = L.d * s;
      if (sp < 5) break;
      let wpx = L.w * s, a = L.a * U.clamp((sp - 5) / 18, 0, 1);
      if (wpx < 1) { a *= Math.max(wpx, 0.3); wpx = 1; }
      if (a < 0.02) continue;
      ctx.globalAlpha = a;
      const i0 = Math.ceil(v.vx0 / L.d - 1e-6), i1 = Math.floor(v.vx1 / L.d + 1e-6);
      const j0 = Math.ceil(v.vy0 / L.d - 1e-6), j1 = Math.floor(v.vy1 / L.d + 1e-6);
      const top = Y(v.vy0), hgt = (v.vy1 - v.vy0) * s, left = X(v.vx0), wid = (v.vx1 - v.vx0) * s;
      for (let i = i0; i <= i1; i++) {
        if (L.skip && i % L.skip === 0) continue;
        ctx.fillRect(X(i * L.d) - wpx / 2, top, wpx, hgt);
      }
      for (let j = j0; j <= j1; j++) {
        if (L.skip && j % L.skip === 0) continue;
        ctx.fillRect(left, Y(j * L.d) - wpx / 2, wid, wpx);
      }
    }
    ctx.globalAlpha = 1;
    // edge ruler: millimetre numbers along the top and left edges
    if (s >= 6) {
      const big = s < 28;
      const fs = (big ? 1.1 : 0.42) * s;
      ctx.font = '700 ' + fs + 'px ' + FONT; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
      ctx.fillStyle = sl.ink;
      const st = big ? 5 : 1, pad = (big ? 0.2 : 0.07) * s;
      if (v.vy0 < 1.6) for (let i = Math.ceil(v.vx0 / st) * st; i <= v.vx1; i += st) if (i > 0 && i < PW) ctx.fillText(String(i), X(i) + pad, Y(0) + pad);
      if (v.vx0 < 1.6) for (let j = Math.ceil(v.vy0 / st) * st; j <= v.vy1; j += st) if (j > 0 && j < PH) ctx.fillText(String(j), X(0) + pad, Y(j) + pad);
    }
    // coordinate labels printed in the corner of every cell, three levels deep
    const LAB = [{ d: 1, n: 0 }, { d: 0.1, n: 1 }, { d: 0.01, n: 2 }, { d: 0.001, n: 3 }];
    for (let k = 0; k < LAB.length; k++) {
      const d = LAB[k].d, cp = d * s;
      if (cp < 90) break;
      if (cp > 2600) continue;
      const fs = 0.085 * cp;
      ctx.globalAlpha = 0.8 * U.clamp((cp - 90) / 60, 0, 1);
      ctx.font = '600 ' + fs + 'px ' + FONT; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
      const i0 = Math.floor(v.vx0 / d), i1 = Math.floor(v.vx1 / d), j0 = Math.floor(v.vy0 / d), j1 = Math.floor(v.vy1 / d);
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
        if (k === 0 && (i === 0 || j === 0)) continue;
        ctx.fillText((i * d).toFixed(LAB[k].n) + ' · ' + (j * d).toFixed(LAB[k].n), X(i * d) + 0.07 * cp, Y(j * d) + 0.06 * cp);
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- small random marks so that every spot of the slide is unique ---------- */
  function drawSpeckle(v) {
    const { ctx, sl, s, X, Y } = v;
    if (0.2 * s >= 1.6) {
      const i0 = Math.floor(v.vx0), i1 = Math.floor(v.vx1), j0 = Math.floor(v.vy0), j1 = Math.floor(v.vy1);
      const halo = 0.2 * s > 4;
      ctx.lineWidth = Math.max(1, 0.03 * s); ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
        const h = U.hash(i, j, 11 + sl.id), h2 = U.hash(i, j, 23 + sl.id), h3 = U.hash(i, j, 37 + sl.id);
        const cx = X(i + 0.28 + 0.44 * h), cy = Y(j + 0.3 + 0.42 * h2), r = (0.1 + 0.07 * h3) * s;
        const type = (h3 * 977) % 5 | 0;
        ctx.fillStyle = h2 > 0.5 ? sl.ink : sl.ink2;
        ctx.beginPath();
        if (type === 0) ctx.arc(cx, cy, r, 0, 6.2832);
        else if (type === 1) { ctx.moveTo(cx, cy - r * 1.2); ctx.lineTo(cx + r * 1.1, cy + r * 0.8); ctx.lineTo(cx - r * 1.1, cy + r * 0.8); ctx.closePath(); }
        else if (type === 2) ctx.rect(cx - r, cy - r, 2 * r, 2 * r);
        else if (type === 3) { ctx.rect(cx - r * 1.2, cy - r * 0.35, r * 2.4, r * 0.7); ctx.rect(cx - r * 0.35, cy - r * 1.2, r * 0.7, r * 2.4); }
        else { ctx.moveTo(cx, cy - r * 1.3); ctx.lineTo(cx + r, cy); ctx.lineTo(cx, cy + r * 1.3); ctx.lineTo(cx - r, cy); ctx.closePath(); }
        if (halo) ctx.stroke();
        ctx.fill();
      }
    }
    // finer dust-like dots that appear only when zoomed in
    for (let lv = 1; lv <= 2; lv++) {
      const d = lv === 1 ? 0.1 : 0.01, cp = d * s;
      if (cp < 26 || cp > 4000) continue;
      ctx.globalAlpha = U.clamp((cp - 26) / 30, 0, 1) * 0.85;
      const i0 = Math.floor(v.vx0 / d), i1 = Math.floor(v.vx1 / d), j0 = Math.floor(v.vy0 / d), j1 = Math.floor(v.vy1 / d);
      ctx.fillStyle = sl.ink2;
      ctx.beginPath();
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
        const h = U.hash(i, j, 50 + lv * 7 + sl.id);
        if (h > 0.55) continue;
        const h2 = U.hash(j, i, 61 + lv + sl.id);
        const cx = X((i + 0.3 + 0.5 * h2) * d), cy = Y((j + 0.35 + 0.9 * h) * d), r = (0.07 + 0.08 * h2) * cp;
        ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, 6.2832);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- the 6 x 4 zones of 6 mm ---------- */
  function drawZones(v) {
    const c0 = Math.max(0, Math.floor(v.vx0 / 6)), c1 = Math.min(5, Math.floor(v.vx1 / 6));
    const r0 = Math.max(0, Math.floor(v.vy0 / 6)), r1 = Math.min(3, Math.floor(v.vy1 / 6));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) drawZone(v, ZONES[r][c], c * 6, r * 6, c, r);
  }

  function drawZone(v, type, zx, zy, c, r) {
    const { ctx, sl, s, X, Y, rect } = v;
    const cx = zx + 3, cy = zy + 3;
    ctx.fillStyle = sl.ink; ctx.strokeStyle = sl.ink;
    if (type.length === 1) {
      ctx.font = '800 ' + 3.9 * s + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = (c + r) % 2 ? sl.ink : sl.ink2;
      ctx.fillText(type, X(cx), Y(cy + 0.25));
    } else if (type === 'star') {
      const R = 2.3 * s, n = 36;
      ctx.beginPath();
      for (let k = 0; k < n; k += 2) {
        const a0 = (k / n) * 6.2832, a1 = ((k + 1) / n) * 6.2832;
        ctx.moveTo(X(cx), Y(cy)); ctx.arc(X(cx), Y(cy), R, a0, a1); ctx.closePath();
      }
      ctx.fill();
      ctx.lineWidth = Math.max(1, 0.05 * s); ctx.beginPath(); ctx.arc(X(cx), Y(cy), R, 0, 6.2832); ctx.stroke();
    } else if (type === 'chart' || type === 'chart2') {
      const off = type === 'chart' ? 0 : 3;
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
        ctx.fillStyle = CHART[j * 6 + i + off];
        rect(zx + 0.25 + i * 1.9, zy + 0.6 + j * 1.75, zx + 0.25 + i * 1.9 + 1.7, zy + 0.6 + j * 1.75 + 1.5);
      }
    } else if (type === 'gray') {
      for (let i = 0; i < 6; i++) {
        const g = Math.round(255 * (1 - i / 5));
        ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
        rect(zx + 0.45 + i * 0.85, zy + 1.0, zx + 0.45 + (i + 1) * 0.85, zy + 2.8);
      }
      for (let i = 0; i < 12; i++) {
        const g = Math.round(255 * (i / 11));
        ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
        rect(zx + 0.45 + i * 0.425, zy + 3.3, zx + 0.45 + (i + 1) * 0.425, zy + 5.0);
      }
    } else if (type === 'bars') {
      // line-pair groups, each half the size of the one before
      let w = 0.32, gx = zx + 0.6, gy = zy + 0.9;
      for (let k = 0; k < 16 && w * s > 0.35; k++) {
        for (let b = 0; b < 4; b++) {
          rect(gx + b * 2 * w, gy, gx + b * 2 * w + w, gy + 7 * w);
          rect(gx + 8.5 * w, gy + b * 2 * w, gx + 15.5 * w, gy + b * 2 * w + w);
        }
        gy += 8.2 * w; w /= 2;
        if (k % 2 === 1) gx += 0.2 * w;
      }
    } else if (type === 'rings') {
      let R = 2.4, ox = cx, oy = cy;
      ctx.lineCap = 'butt';
      for (let k = 0; k < 14 && R * s > 2; k++) {
        const t = R / 7;
        ctx.lineWidth = Math.max(0.6, t * s);
        for (let q = 0; q < 3; q++) { ctx.beginPath(); ctx.arc(X(ox), Y(oy), (R - t * (0.5 + 2 * q)) * s, 0, 6.2832); ctx.stroke(); }
        R = R / 7;
      }
    } else if (type === 'checker') {
      let size = 4.4, ox = zx + 0.8, oy = zy + 0.9;
      for (let k = 0; k < 9 && size * s > 3; k++) {
        const q = size / 4;
        for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) if ((i + j) % 2 === 0) rect(ox + i * q, oy + j * q, ox + (i + 1) * q, oy + (j + 1) * q);
        ox += q; oy += 0; size = q; // recurse into the white square next to the corner
        ctx.fillStyle = k % 2 ? sl.ink : sl.ink2;
      }
    } else if (type === 'ruler') {
      // a fine scale: 0..4 mm with ticks down to one micrometre
      const bx = zx + 1, by = zy + 3.4;
      ctx.lineWidth = Math.max(1, 0.03 * s);
      rect(bx, by, bx + 4, by + Math.max(0.03, 1 / s));
      const lv = [[1, 1.2, 0.03], [0.5, 0.9, 0.02], [0.1, 0.6, 0.012], [0.01, 0.06, 0.0012], [0.001, 0.006, 0.00012]];
      for (let q = 0; q < lv.length; q++) {
        const d = lv[q][0];
        if (d * s < 3) break;
        const a0 = Math.max(0, Math.floor((v.vx0 - bx) / d)), a1 = Math.min(Math.round(4 / d), Math.ceil((v.vx1 - bx) / d));
        const w = Math.max(lv[q][2], 1 / s);
        for (let i = a0; i <= a1; i++) rect(bx + i * d - w / 2, by - lv[q][1], bx + i * d + w / 2, by);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = '700 ' + 0.6 * s + 'px ' + FONT;
      if (0.6 * s > 5) for (let i = 0; i <= 4; i++) ctx.fillText(String(i), X(bx + i), Y(by + 0.2));
      if (0.6 * s > 5) { ctx.textAlign = 'left'; ctx.fillText('mm', X(bx + 4.25), Y(by + 0.2)); ctx.textAlign = 'center'; }
      if (0.06 * s > 6) {
        ctx.font = '600 ' + 0.045 * s + 'px ' + FONT;
        const a0 = Math.max(0, Math.floor((v.vx0 - bx) / 0.1)), a1 = Math.min(40, Math.ceil((v.vx1 - bx) / 0.1));
        for (let i = a0; i <= a1; i++) if (i % 10) ctx.fillText((i / 10).toFixed(1), X(bx + i * 0.1), Y(by + 0.02));
      }
      // vertical twin
      const vx = zx + 0.7, vy = zy + 0.5;
      for (let i = 0; i <= 20; i++) { const len = i % 10 === 0 ? 0.7 : i % 5 === 0 ? 0.5 : 0.3; rect(vx, vy + i * 0.1 - 0.012, vx + len, vy + i * 0.1 + 0.012); }
    } else if (type === 'text') {
      const lines = ['いろはにほへと', 'ABCDEFG 0123', 'ちりぬるをわか', 'HIJKLMN 4567', 'よたれそつねな', 'OPQRSTU 89'];
      let fs = 0.9, ty = zy + 0.8;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      for (let k = 0; k < 14; k++) {
        const px = fs * s;
        if (px < 2.2) { if (px > 0.5) { ctx.globalAlpha = 0.5; rect(zx + 0.6, ty + fs * 0.25, zx + 0.6 + fs * 5.2, ty + fs * 0.75); ctx.globalAlpha = 1; } }
        else { ctx.font = '700 ' + px + 'px ' + FONT; ctx.fillText(lines[k % lines.length], X(zx + 0.6), Y(ty)); }
        ty += fs * 1.25; fs *= 0.62;
      }
    } else if (type === 'dots') {
      ctx.beginPath();
      for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) {
        const r = 0.34 * Math.pow(0.72, i + j * 0.5) * s;
        if (r < 0.3) continue;
        ctx.moveTo(X(zx + 1 + i) + r, Y(zy + 1 + j)); ctx.arc(X(zx + 1 + i), Y(zy + 1 + j), r, 0, 6.2832);
      }
      ctx.fill();
    } else if (type === 'shapes') {
      ctx.lineWidth = Math.max(1, 0.14 * s); ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.arc(X(zx + 1.7), Y(zy + 1.9), 1.0 * s, 0, 6.2832); ctx.stroke();
      ctx.strokeRect(X(zx + 3.4), Y(zy + 0.9), 1.9 * s, 1.9 * s);
      ctx.beginPath(); ctx.moveTo(X(zx + 1.7), Y(zy + 3.3)); ctx.lineTo(X(zx + 2.8), Y(zy + 5.2)); ctx.lineTo(X(zx + 0.6), Y(zy + 5.2)); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = sl.ink2; ctx.beginPath();
      for (let k = 0; k < 10; k++) { const a = -1.5708 + k * 0.62832, rr = (k % 2 ? 0.45 : 1.05) * s; const px = X(zx + 4.35) + Math.cos(a) * rr, py = Y(zy + 4.3) + Math.sin(a) * rr; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.closePath(); ctx.fill();
    } else if (type === 'stripes') {
      const cols = ['#e53935', '#43a047', '#1e88e5', '#00acc1', '#d81b60', '#fdd835'];
      for (let i = 0; i < 12; i++) { ctx.fillStyle = cols[i % 6]; rect(zx + 0.6 + i * 0.4, zy + 0.9, zx + 0.6 + i * 0.4 + 0.3, zy + 3.0); }
      let w = 0.2, x = zx + 0.6;
      for (let k = 0; k < 10 && w * s > 0.4; k++) {
        for (let i = 0; i < 6; i++) { ctx.fillStyle = cols[i]; rect(x + i * w, zy + 3.4, x + i * w + w * 0.8, zy + 5.2); }
        x += 6.6 * w; w *= 0.6;
      }
    }
    // zone name in the corner
    if (0.62 * s > 4.5) {
      ctx.fillStyle = sl.ink; ctx.globalAlpha = 0.9;
      ctx.font = '700 ' + 0.62 * s + 'px ' + FONT; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      ctx.fillText('ABCDEF'[c] + (r + 1), X(zx + 5.8), Y(zy + 5.85));
      ctx.globalAlpha = 1;
    }
  }

  /* ---------- camera rendering: defocus blur and exposure on top of the pattern ---------- */
  let scratch = null;
  function getScratch(w, h) {
    if (!scratch) scratch = document.createElement('canvas');
    if (scratch.width < w) scratch.width = w;
    if (scratch.height < h) scratch.height = h;
    return scratch;
  }
  /* Draw into ctx at (dx,dy) size pw x ph. blurMM is the blur circle on the slide,
     gain the exposure (1 = correct). sl may be null (no slide: bare light). */
  P.capture = function (ctx, sl, x0, y0, s, pw, ph, dx, dy, blurMM, gain, flipped) {
    pw = Math.max(1, Math.round(pw)); ph = Math.max(1, Math.round(ph));
    const b = (blurMM || 0) * s;
    ctx.save();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (!sl) { ctx.fillStyle = '#fff'; ctx.fillRect(dx, dy, pw, ph); }
    else if (b < 0.75) {
      ctx.translate(dx, dy);
      P.draw(ctx, sl, x0, y0, s, pw, ph, { flipped });
      ctx.translate(-dx, -dy);
    } else {
      const k = Math.min(1, 1.5 / (b + 0.75));
      const sw = Math.max(2, Math.ceil(pw * k)), sh = Math.max(2, Math.ceil(ph * k));
      const sc = getScratch(sw, sh), sx = sc.getContext('2d');
      sx.setTransform(1, 0, 0, 1, 0, 0);
      P.draw(sx, sl, x0, y0, s * (sw / pw), sw, sh, { flipped });
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sc, 0, 0, sw, sh, dx, dy, pw, ph);
    }
    if (gain < 0.995) {
      ctx.globalAlpha = 1 - Math.max(0, gain); ctx.fillStyle = '#000'; ctx.fillRect(dx, dy, pw, ph);
    } else if (gain > 1.005) {
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, gain - 1);
      ctx.drawImage(ctx.canvas, dx, dy, pw, ph, dx, dy, pw, ph);
    }
    ctx.restore();
  };

  /* texture of the whole slide for the 3D model (512 x 176) */
  P.slideTexture = function (sl) {
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 176;
    const s = 512 / C.slide.L;
    P.draw(cv.getContext('2d'), sl, SX0, SY0, s, 512, 176, { tex: true });
    return cv;
  };
})();
