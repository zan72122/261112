// Inset "through the eyepiece" view: the printed test pattern at the current magnification,
// with the eyepiece field circle (FN 26.5) and the camera frame rectangle drawn to scale.
(function () {
  'use strict';
  const S = window.SCOPE;

  class Inset {
    constructor(root) {
      this.root = root;
      this.pat = root.querySelector('canvas.pat');
      this.ovl = root.querySelector('canvas.ovl');
      this.cap = root.querySelector('.cap');
      this.size = 0; this.anim = { fov: 0 };
    }
    _fit() {
      const css = this.pat.clientWidth || 200, dpr = Math.min(2, window.devicePixelRatio || 1);
      const px = Math.round(css * dpr);
      if (px !== this.size) { this.size = px; this.pat.width = this.pat.height = px; this.ovl.width = this.ovl.height = px; }
      return { px, dpr, css };
    }
    // op = optics.compute(state); fovShown lets the zoom animate between objectives
    draw(op, st, fovShown) {
      const { px, dpr } = this._fit();
      const fov = fovShown || op.fov;
      const R = px * 0.47, cx = px / 2, cy = px / 2;
      const ppm = (2 * R) / fov;                       // device px per mm on the slide
      const ctx = this.pat.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, px, px);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      // bright field background: brightness follows (NA / M)^2, glare lowers the contrast
      const b = op.brightness;
      const L = Math.round(255 * (0.10 + 0.90 * b));
      ctx.fillStyle = `rgb(${L},${Math.round(L * 0.985)},${Math.round(L * 0.93)})`;
      ctx.fillRect(0, 0, px, px);
      // the image in a compound microscope is rotated by 180 degrees
      ctx.translate(cx, cy); ctx.rotate(Math.PI); ctx.scale(ppm, ppm);
      const half = fov / 2 + 0.02;
      const ink = `rgba(${Math.round(18 * b)},${Math.round(18 * b)},${Math.round(24 * b)},${(0.42 + 0.58 * op.contrast).toFixed(3)})`;
      S.pattern.drawPattern(ctx, ppm, { x0: -half, y0: -half, x1: half, y1: half }, ink);
      ctx.restore();
      // image of the field diaphragm (a ten-bladed iris) when it is smaller than the field of view
      const rf = (op.fieldDia / 2) * ppm;
      if (rf < R * 1.02) {
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, R + 1, 0, Math.PI * 2);
        ctx.moveTo(cx + rf * Math.cos(0.3), cy + rf * Math.sin(0.3));
        for (let k = 9; k >= 0; k--) {
          const a = (k / 10) * Math.PI * 2 + 0.3, am = a + Math.PI / 10;
          ctx.quadraticCurveTo(cx + rf * 1.06 * Math.cos(am), cy + rf * 1.06 * Math.sin(am), cx + rf * Math.cos(a), cy + rf * Math.sin(a));
        }
        ctx.closePath();
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 5 * dpr;
        ctx.fillStyle = 'rgba(3,4,8,0.94)';
        ctx.fill('evenodd');
        ctx.restore();
      }
      // defocus: blur radius from the solver (object space mm -> css px)
      const blurCss = Math.min(14, (op.blur * ppm) / dpr * 0.5);
      this.pat.style.filter = blurCss > 0.15 ? `blur(${blurCss.toFixed(2)}px)` : 'none';

      // crisp overlay: field stop edge, field circle, camera frame
      const o = this.ovl.getContext('2d');
      o.setTransform(1, 0, 0, 1, 0, 0);
      o.clearRect(0, 0, px, px);
      o.beginPath(); o.rect(0, 0, px, px); o.arc(cx, cy, R, 0, Math.PI * 2, true);
      o.fillStyle = '#05070c'; o.fill('evenodd');
      o.lineWidth = 2.2 * dpr; o.strokeStyle = '#49c6ff';
      o.beginPath(); o.arc(cx, cy, R, 0, Math.PI * 2); o.stroke();
      const cw = op.camW * ppm, ch = op.camH * ppm;
      o.setLineDash([6 * dpr, 4 * dpr]); o.lineWidth = 2 * dpr; o.strokeStyle = '#ff5db1';
      o.strokeRect(cx - cw / 2, cy - ch / 2, cw, ch);
      o.setLineDash([]);
      // corner ticks of the camera frame
      o.lineWidth = 3 * dpr;
      const t = 7 * dpr;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const x = cx + (sx * cw) / 2, y = cy + (sy * ch) / 2;
        o.beginPath(); o.moveTo(x - sx * t, y); o.lineTo(x, y); o.lineTo(x, y - sy * t); o.stroke();
      }
      this._caption(op, st);
    }
    _caption(op, st) {
      const f = (v, d) => v.toFixed(d);
      const bars = Math.max(1, Math.round(op.brightness * 5));
      const focusUm = st.focus * 1000;
      const sharp = Math.abs(focusUm) <= op.dof / 2;          // inside the depth of field
      const html =
        `<div class="row big"><b>${op.mag}×</b><span>対物</span><i>×</i><b>10×</b><span>接眼</span><i>=</i><b class="tot">${op.total}×</b></div>` +
        `<div class="row"><em class="dot eye"></em>接眼の視野 φ${f(op.fov, 2)} mm<small>FN 26.5</small></div>` +
        `<div class="row"><em class="dot cam"></em>カメラの枠 ${f(op.camW, 2)} × ${f(op.camH, 2)} mm</div>` +
        `<div class="row dim">明るさ <span class="bars">${'●'.repeat(bars)}${'○'.repeat(5 - bars)}</span>　分解能 ${f(op.res, 2)} µm</div>` +
        (sharp ? `<div class="row dim">像は上下左右が逆さまに見えます</div>` : `<div class="row warn">ピントずれ ${focusUm > 0 ? '+' : ''}${Math.abs(focusUm) >= 100 ? f(focusUm / 1000, 2) + ' mm' : f(focusUm, 0) + ' µm'}（焦点深度 ${f(op.dof, 1)} µm）</div>`);
      if (html !== this._last) { this.cap.innerHTML = html; this._last = html; }
    }
  }
  S.Inset = Inset;
})();
