/* Magnified cross-section of the blade edge meeting the block (2D canvas).
   The advance per turn is drawn hugely exaggerated and marked 「誇張表示」. */
(function () {
  'use strict';
  const MT = window.MT, K = MT.K;
  const DEG = Math.PI / 180;

  MT.Inset = function (canvas) {
    const g = canvas.getContext('2d');
    if (!g.roundRect) g.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };   // older browsers
    const W = 300, H = 220;
    let dpr = 0;
    const EX = 172, EY = 112;           // blade edge on the canvas
    const SY = 5.6;                     // px per mm along the stroke
    const SD = 9;                       // px per mm of remaining wax depth
    const UMPX = 1.5;                   // px per µm of feed  -> the exaggeration
    const hist = [];                    // finished sections: { px, col, crumple, chunk }
    let curLen = 0;
    const rake = 46 * DEG, clear = 9 * DEG;
    const rx = Math.sin(rake), ry = Math.cos(rake);

    function layerPx(mm) {
      const um = mm * 1000;
      return um <= 30 ? um * UMPX : Math.min(62, 45 + Math.sqrt(um - 30) * 0.8);
    }
    function css(c, a) { return 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + (a === undefined ? 1 : a) + ')'; }
    function hatch(x, y, w, h, step, style) {
      g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
      g.strokeStyle = style; g.lineWidth = 1; g.beginPath();
      for (let k = -h; k < w + h; k += step) { g.moveTo(x + k, y + h); g.lineTo(x + k + h, y); }
      g.stroke(); g.restore();
    }

    // st: { theta, um, W, pEff (mm), retract (mm), cut: {kind,u,p,crumple}|null, col:[r,g,b] sRGB 0..1, blockOut, guardClosed, fresh }
    function draw(st) {
      const r = Math.min(2, window.devicePixelRatio || 1);
      if (r !== dpr) { dpr = r; canvas.width = W * r; canvas.height = H * r; }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const col = st.col;
      const bh = K.bh * SY;
      const cy = EY - K.R * Math.cos(st.theta) * SY;        // block centre on canvas
      const top = cy - bh / 2, bot = cy + bh / 2;
      const cutting = st.cut && st.cut.kind !== 'scrape';
      const p = cutting ? st.cut.p : Math.max(0, st.pEff);
      const lp = layerPx(p);
      const retr = st.retract > 1e-6 ? 9 * (st.retract / K.retract) : 0;
      const face = EX - retr;                                // cut face of the block
      const chunky = p > K.Pchunk;

      // ---- block ----
      g.save(); g.beginPath(); g.rect(0, 0, W, H); g.clip();
      const wd = st.W * SD;
      const waxL = face - wd;
      // clamp jaws + carrier (approach the blade as the wax is used up)
      g.fillStyle = '#e9e6dc'; g.fillRect(waxL - 34, top - 11, 34, bh + 22);
      g.fillStyle = '#9aa0a6';
      g.fillRect(waxL - 34 - 8, top - 62, 36, 51); g.fillRect(waxL - 34 - 8, bot + 11, 36, 51);
      hatch(waxL - 42, top - 62, 36, 51, 6, 'rgba(0,0,0,0.35)'); hatch(waxL - 42, bot + 11, 36, 51, 6, 'rgba(0,0,0,0.35)');
      g.fillStyle = '#5b6066'; g.fillRect(waxL - 80, top - 62, 40, bh + 124);
      // wax body
      g.fillStyle = css(col, 0.95); g.fillRect(waxL, top, wd, bh);
      // faint grid lines of the embedded test pattern
      g.strokeStyle = 'rgba(8,20,30,0.28)'; g.lineWidth = 1; g.beginPath();
      for (let mm = 2; mm < K.bh; mm += 2) { const y = top + mm * SY; g.moveTo(waxL, y); g.lineTo(face, y); }
      g.stroke();
      // the layer that this turn will remove (exaggerated)
      if (lp > 0.2) {
        const yEdge = Math.max(top, Math.min(bot, EY));
        const lTop = top, lBot = cutting ? yEdge : bot;
        if (lBot > lTop + 0.5 && !(cutting && st.cut.u >= 1)) {
          g.fillStyle = css(col, 1); g.fillRect(face, lTop, lp, lBot - lTop);
          g.fillStyle = 'rgba(255,255,255,0.28)'; g.fillRect(face, lTop, lp, lBot - lTop);
          if (chunky) hatch(face, lTop, lp, lBot - lTop, 5, 'rgba(0,0,0,0.45)');
          g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 1; g.strokeRect(face + 0.5, lTop + 0.5, lp - 1, Math.max(0, lBot - lTop - 1));
        }
      }
      g.restore();

      // ---- cut plane ----
      g.setLineDash([3, 4]); g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(EX + 0.5, 0); g.lineTo(EX + 0.5, H); g.stroke(); g.setLineDash([]);

      // ---- ribbon on the rake face ----
      const drawBand = (s0, s1, px, c, crumple, chunk) => {
        if (s1 <= s0) return;
        const off = 3 + px / 2;                 // rides on the rake face
        const ax = EX + rx * s0 + ry * off, ay = EY + ry * s0 - rx * off;
        const bx = EX + rx * s1 + ry * off, by = EY + ry * s1 - rx * off;
        g.lineCap = 'butt'; g.strokeStyle = css(c, 1); g.lineWidth = Math.max(1.2, px);
        g.beginPath();
        if (crumple) {
          const n = Math.max(3, Math.round((s1 - s0) / 7));
          g.moveTo(ax, ay);
          for (let i = 1; i <= n; i++) { const t = i / n, w = (i % 2 ? 1 : -1) * 6; g.lineTo(ax + (bx - ax) * t + ry * w, ay + (by - ay) * t - rx * w); }
        } else { g.moveTo(ax, ay); g.lineTo(bx, by); }
        g.stroke();
        if (chunk) { g.strokeStyle = 'rgba(0,0,0,0.4)'; g.lineWidth = 1; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke(); g.setLineDash([]); }
        // seam tick
        g.strokeStyle = 'rgba(0,0,0,0.55)'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(bx - ry * (px / 2 + 2), by + rx * (px / 2 + 2)); g.lineTo(bx + ry * (px / 2 + 2), by - rx * (px / 2 + 2)); g.stroke();
      };
      let s = 0;
      if (cutting) { curLen = st.cut.u * bh * (st.cut.crumple ? 0.45 : 0.9); drawBand(0, curLen, Math.max(1.5, Math.min(lp, 34)), col, st.cut.crumple, st.cut.kind === 'chunk'); s = curLen; }
      else curLen = 0;
      for (let i = hist.length - 1; i >= 0 && s < 260; i--) {
        const h = hist[i]; if (h.gone) break;
        drawBand(s + 1.5, s + h.len, h.px, h.col, h.crumple, h.chunk); s += h.len;
      }

      // ---- blade ----
      const L = 190;
      g.beginPath(); g.moveTo(EX, EY);
      g.lineTo(EX + Math.tan(clear) * L, EY + L); g.lineTo(EX + Math.tan(rake) * L + 60, EY + L); g.lineTo(EX + rx * 42, EY + ry * 42);
      g.closePath();
      const gr = g.createLinearGradient(EX, EY, EX + 90, EY + 60);
      gr.addColorStop(0, '#f4f6f8'); gr.addColorStop(1, '#8e959c');
      g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 1; g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(EX, EY, 2.2, 0, 7); g.fill();
      if (st.guardClosed) {     // closed guard sits over the edge
        g.fillStyle = '#c8201c'; g.strokeStyle = 'rgba(0,0,0,0.5)';
        g.beginPath(); g.roundRect(EX - 16, EY - 20, 30, 22, 8); g.fill(); g.stroke();
      }

      // ---- annotations ----
      g.font = 'bold 11px ' + MT.FONT; g.textBaseline = 'middle'; g.textAlign = 'left';
      const tagW = g.measureText('誇張表示').width + 14;
      g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 1; g.beginPath(); g.roundRect(9.5, 9.5, tagW, 19, 5); g.stroke();
      g.fillStyle = '#fff'; g.fillText('誇張表示', 16, 19.5);
      // thickness read-out
      g.textAlign = 'right';
      g.font = 'bold 26px ' + MT.FONT; g.fillStyle = '#fff';
      const big = String(st.um);
      g.fillText(big, W - 42, 24);
      g.font = 'bold 12px ' + MT.FONT; g.textAlign = 'left'; g.fillText('µm', W - 38, 28);
      if (chunky) {
        g.textAlign = 'right'; g.font = 'bold 12px ' + MT.FONT; g.fillStyle = '#fff';
        g.fillText('!  ' + Math.round(p * 1000) + ' µm', W - 12, 50);
      }
      // dimension arrows across the layer, while it is in view above the edge
      if (lp > 0.2 && !st.blockOut && !chunky) {
        const yy = Math.max(top + 12, Math.min(EY - 16, 60));
        if (yy < Math.min(bot, cutting ? EY : bot) - 4 && yy > top + 4) {
          g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 1.2;
          const x0 = face, x1 = face + lp;
          g.beginPath(); g.moveTo(x1 + 5, yy); g.lineTo(x1 + 30, yy); g.moveTo(x0 - 5, yy); g.lineTo(x0 - 24, yy); g.stroke();
          g.beginPath(); g.moveTo(x1, yy); g.lineTo(x1 + 7, yy - 3.5); g.lineTo(x1 + 7, yy + 3.5); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(x0, yy); g.lineTo(x0 - 7, yy - 3.5); g.lineTo(x0 - 7, yy + 3.5); g.closePath(); g.fill();
          g.font = 'bold 11px ' + MT.FONT; g.textAlign = 'left';
          g.fillText((p * 1000 < 10 ? (p * 1000).toFixed(p * 1000 % 1 > 0.05 ? 1 : 0) : Math.round(p * 1000)) + ' µm', x1 + 34, yy);
        }
      }
      if (st.blockOut) {
        g.textAlign = 'left'; g.font = 'bold 12px ' + MT.FONT;
        const t = 'ブロック終了・安全停止', tw = g.measureText(t).width + 16;
        g.fillStyle = 'rgba(255,255,255,0.95)'; g.beginPath(); g.roundRect(10, H - 32, tw, 22, 6); g.fill();
        g.fillStyle = '#111'; g.fillText(t, 18, H - 20.5);
      }
    }
    function addSection(mm, col, crumple, chunk) {
      const px = Math.max(1.5, Math.min(layerPx(mm), 34));
      hist.push({ px, col: col.slice(), crumple, chunk, len: K.bh * SY * (crumple ? 0.45 : 0.9) });
      if (hist.length > 6) hist.shift();
    }
    function breakRibbon() { if (hist.length) hist[hist.length - 1].gone = true; hist.length = 0; }
    return { draw, addSection, breakRibbon };
  };
})();
