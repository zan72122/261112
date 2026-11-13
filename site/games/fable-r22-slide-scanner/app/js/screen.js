/* screen.js (late) — the monitor: the mosaic being assembled and the deep-zoom viewer.
   A tile is a preview bitmap plus its capture record (true position, blur, exposure).
   At low zoom the bitmaps are drawn; when zoomed in, the visible part of each tile is
   rendered again from that record at screen resolution, down to the camera's pixel size,
   beyond which the pixels themselves are shown as squares. */
(function () {
  'use strict';
  const SS = window.SS, U = SS.util, C = SS.cfg, S = SS.S, mech = SS.mech, sim = SS.sim, ax = S.ax;
  const cv = document.querySelector('#screen'), ctx = cv.getContext('2d');
  const TT = C.tiles, H2 = TT.fov / 2, PPM_T = TT.px / TT.fov, NAT = C.nativePx / TT.fov;
  const V = { cx: C.pat.w / 2, cy: C.pat.h / 2, ppm: 10 }; // ppm: canvas pixels per millimetre
  const R = { V };
  let dirty = true, anim = null, mark = null, rev = 0, userView = false;
  const pxc = document.createElement('canvas');

  const fitPpm = () => Math.min(cv.width / (C.pat.w + 1.6), cv.height / (C.pat.h + 1.6));
  R.fit = () => { V.cx = C.pat.w / 2; V.cy = C.pat.h / 2; V.ppm = fitPpm(); userView = false; dirty = true; };
  R.zoomTo = (cx, cy, ppm, dur) => new Promise((res) => { anim = { a: { cx: V.cx, cy: V.cy, ppm: V.ppm }, b: { cx, cy, ppm }, t: 0, dur, res }; });
  R.fitTo = (dur) => R.zoomTo(C.pat.w / 2, C.pat.h / 2, fitPpm(), dur);
  R.touch = () => { dirty = true; };
  const X = (mx) => (mx - V.cx) * V.ppm + cv.width / 2, Y = (my) => (my - V.cy) * V.ppm + cv.height / 2;
  const MX = (px) => (px - cv.width / 2) / V.ppm + V.cx, MY = (py) => (py - cv.height / 2) / V.ppm + V.cy;
  // mosaic millimetres -> page (CSS) pixels, used by the scan view to draw its link lines
  R.toPage = (mx, my, out) => { const r = cv.getBoundingClientRect(); out.x = r.left + X(mx) / SS.dpr; out.y = r.top + Y(my) / SS.dpr; out.ok = r.width > 4; return out; };
  R.visible = () => cv.clientWidth > 4;

  /* ---------- drawing ---------- */
  function drawTile(t, sc, sl) {
    const ex = t.nx + t.ex, ey = t.ny + t.ey, cell = sc.blend >= 0.5;
    let rx0, ry0, rx1, ry1;
    if (!cell) { rx0 = ex - H2; ry0 = ey - H2; rx1 = ex + H2; ry1 = ey + H2; }
    else {
      rx0 = t.i === 0 ? t.nx - H2 : t.nx - TT.step / 2; rx1 = t.i === TT.nx - 1 ? t.nx + H2 : t.nx + TT.step / 2;
      ry0 = t.j === 0 ? t.ny - H2 : t.ny - TT.step / 2; ry1 = t.j === TT.ny - 1 ? t.ny + H2 : t.ny + TT.step / 2;
    }
    const w = cv.width, h = cv.height;
    const cx0 = Math.max(0, Math.round(X(rx0))), cy0 = Math.max(0, Math.round(Y(ry0))), cx1 = Math.min(w, Math.round(X(rx1))), cy1 = Math.min(h, Math.round(Y(ry1)));
    if (cx1 <= cx0 || cy1 <= cy0) return;
    const mx0 = MX(cx0), my0 = MY(cy0);
    if (V.ppm <= PPM_T * 1.6) {
      const k = PPM_T / V.ppm;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(t.cv, (mx0 - (ex - H2)) * PPM_T, (my0 - (ey - H2)) * PPM_T, (cx1 - cx0) * k, (cy1 - cy0) * k, cx0, cy0, cx1 - cx0, cy1 - cy0);
    } else {
      const ox = t.tx - ex, oy = t.ty - ey; // what the tile really shows at a mosaic point
      if (V.ppm <= NAT) SS.pattern.capture(ctx, sl, mx0 + ox, my0 + oy, V.ppm, cx1 - cx0, cy1 - cy0, cx0, cy0, t.blur, t.gain, t.flipped);
      else {
        const q = V.ppm / NAT, tx0 = t.tx - H2, ty0 = t.ty - H2;
        const gx0 = Math.floor((mx0 + ox - tx0) * NAT), gy0 = Math.floor((my0 + oy - ty0) * NAT);
        const gx1 = Math.ceil((MX(cx1) + ox - tx0) * NAT), gy1 = Math.ceil((MY(cy1) + oy - ty0) * NAT);
        const nw = Math.max(1, gx1 - gx0), nh = Math.max(1, gy1 - gy0);
        if (pxc.width < nw) pxc.width = nw; if (pxc.height < nh) pxc.height = nh;
        SS.pattern.capture(pxc.getContext('2d'), sl, tx0 + gx0 / NAT, ty0 + gy0 / NAT, NAT, nw, nh, 0, 0, t.blur, t.gain, t.flipped);
        ctx.save(); ctx.beginPath(); ctx.rect(cx0, cy0, cx1 - cx0, cy1 - cy0); ctx.clip();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(pxc, 0, 0, nw, nh, X(tx0 + gx0 / NAT - ox), Y(ty0 + gy0 / NAT - oy), nw * q, nh * q);
        ctx.restore();
      }
    }
    const age = sim.time - t.born;
    if (age < 0.3) { ctx.fillStyle = 'rgba(255,255,255,' + 0.75 * (1 - age / 0.3) + ')'; ctx.fillRect(cx0, cy0, cx1 - cx0, cy1 - cy0); R.live = true; }
  }

  function draw() {
    const w = cv.width, h = cv.height, d = SS.dpr;
    if (w < 8) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.fillStyle = '#0b0e12'; ctx.fillRect(0, 0, w, h);
    const sc = S.scan; R.live = false;
    // the empty grid waiting for tiles
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = d;
    for (let j = 0; j < TT.ny; j++) for (let i = 0; i < TT.nx; i++) ctx.strokeRect(X(i * TT.step) + 1, Y(j * TT.step) + 1, TT.step * V.ppm - 2, TT.step * V.ppm - 2);
    if (sc && sc.tiles.length) {
      const sl = SS.pattern.slides[sc.slide];
      for (let k = 0; k < sc.tiles.length; k++) drawTile(sc.tiles[k], sc, sl);
      const a = 1 - sc.blend;
      if (a > 0.01) {
        // overlap bands and tile outlines: tiles are laid like roof shingles
        ctx.fillStyle = 'rgba(255,214,90,' + 0.25 * a + ')';
        for (const t of sc.tiles) {
          const ex = t.nx + t.ex, ey = t.ny + t.ey;
          const L = t.i > 0 && sc.grid[t.j * TT.nx + t.i - 1], Tn = t.j > 0 && sc.grid[(t.j - 1) * TT.nx + t.i];
          if (L) { const lx = L.nx + L.ex + H2; if (lx > ex - H2) ctx.fillRect(X(ex - H2), Y(ey - H2), (lx - ex + H2) * V.ppm, TT.fov * V.ppm); }
          if (Tn) { const ty = Tn.ny + Tn.ey + H2; if (ty > ey - H2) ctx.fillRect(X(ex - H2), Y(ey - H2), TT.fov * V.ppm, (ty - ey + H2) * V.ppm); }
        }
        ctx.lineWidth = d;
        for (const t of sc.tiles) {
          ctx.strokeStyle = t.bad ? 'rgba(255,90,74,' + (0.6 + 0.4 * Math.sin(sim.time * 9)) * a + ')' : 'rgba(255,255,255,' + 0.38 * a + ')';
          if (t.bad) { ctx.lineWidth = 2.5 * d; R.live = true; } else ctx.lineWidth = d;
          ctx.strokeRect(X(t.nx + t.ex - H2) + 0.5, Y(t.ny + t.ey - H2) + 0.5, TT.fov * V.ppm - 1, TT.fov * V.ppm - 1);
        }
        // seams that have been compared: green fits, red does not
        ctx.lineWidth = 3 * d; ctx.lineCap = 'round';
        for (const p of sc.pairs) {
          if (!p.done) continue;
          const A = p.a, B = p.b, mx = (A.nx + A.ex + B.nx + B.ex) / 2, my = (A.ny + A.ey + B.ny + B.ey) / 2;
          ctx.strokeStyle = p.conf > 0.55 ? 'rgba(74,222,128,' + 0.95 * a + ')' : 'rgba(255,90,74,' + 0.95 * a + ')';
          ctx.beginPath();
          if (p.horiz) { ctx.moveTo(X(mx), Y(my - 1.1)); ctx.lineTo(X(mx), Y(my + 1.1)); } else { ctx.moveTo(X(mx - 1.1), Y(my)); ctx.lineTo(X(mx + 1.1), Y(my)); }
          ctx.stroke();
        }
      }
    }
    // where the camera is looking right now
    if (S.stageSlide >= 0) {
      const c = mech.cam();
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2 * d;
      ctx.strokeRect(X(c.cx - c.fov / 2), Y(c.cy - c.fov / 2), c.fov * V.ppm, c.fov * V.ppm);
    }
    if (mark) {
      const k = (sim.time - mark.t) / 1.1;
      if (k >= 1) mark = null;
      else {
        ctx.strokeStyle = 'rgba(34,211,238,' + (1 - k) + ')'; ctx.lineWidth = 3 * d;
        ctx.beginPath(); ctx.arc(X(mark.x), Y(mark.y), (8 + 40 * k) * d, 0, 6.2832); ctx.stroke(); R.live = true;
      }
    }
    if (sc && sc.tiles.length) scaleBar(w, h, d);
  }
  function scaleBar(w, h, d) {
    const want = (120 * d) / V.ppm; let len = 20;
    for (const v of [20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001, 0.0005]) { len = v; if (v <= want) break; }
    const px = len * V.ppm, x0 = 14 * d, y0 = h - 16 * d;
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(x0 - 6 * d, y0 - 24 * d, px + 12 * d, 32 * d);
    ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0, px, 3 * d); ctx.fillRect(x0, y0 - 4 * d, 1.5 * d, 8 * d); ctx.fillRect(x0 + px - 1.5 * d, y0 - 4 * d, 1.5 * d, 8 * d);
    ctx.font = '600 ' + 13 * d + 'px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(len >= 1 ? len + ' mm' : +(len * 1000).toFixed(1) + ' µm', x0, y0 - 7 * d);
  }

  /* ---------- pinch, pan, double tap (only in the みる step) ---------- */
  const ptrs = new Map(); let lastTap = null, moved = 0, t0 = 0;
  const maxPpm = () => NAT * 64, minPpm = () => fitPpm() * 0.75;
  function clampView() {
    V.ppm = U.clamp(V.ppm, minPpm(), maxPpm());
    V.cx = U.clamp(V.cx, -1, C.pat.w + 1); V.cy = U.clamp(V.cy, -1, C.pat.h + 1); dirty = true; userView = true;
  }
  function zoomAt(px, py, f) {
    const mx = MX(px), my = MY(py);
    V.ppm = U.clamp(V.ppm * f, minPpm(), maxPpm());
    V.cx = mx - (px - cv.width / 2) / V.ppm; V.cy = my - (py - cv.height / 2) / V.ppm; clampView();
  }
  const loc = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * SS.dpr, y: (e.clientY - r.top) * SS.dpr }; };
  cv.addEventListener('pointerdown', (e) => {
    if (S.step !== 'view') return;
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    ptrs.set(e.pointerId, loc(e)); anim = null; SS.emit('user');
    if (ptrs.size === 1) { moved = 0; t0 = performance.now(); }
  });
  cv.addEventListener('pointermove', (e) => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    const n = loc(e);
    if (ptrs.size === 1) { V.cx -= (n.x - p.x) / V.ppm; V.cy -= (n.y - p.y) / V.ppm; moved += Math.abs(n.x - p.x) + Math.abs(n.y - p.y); clampView(); }
    else if (ptrs.size === 2) {
      let o = null; ptrs.forEach((v, id) => { if (id !== e.pointerId) o = v; });
      const d0 = Math.hypot(p.x - o.x, p.y - o.y) || 1, d1 = Math.hypot(n.x - o.x, n.y - o.y) || 1;
      zoomAt(o.x, o.y, d1 / d0); moved += 99; // the resting finger stays on its spot, the moving one stretches the picture
    }
    p.x = n.x; p.y = n.y;
  });
  const up = (e) => {
    const p = ptrs.get(e.pointerId); if (!p) return; ptrs.delete(e.pointerId);
    if (e.type === 'pointercancel' || ptrs.size > 0) return;
    if (moved < 12 * SS.dpr && performance.now() - t0 < 350) {
      const now = performance.now();
      if (lastTap && now - lastTap.t < 420 && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 44 * SS.dpr) { lastTap = null; R.goTo(MX(p.x), MY(p.y)); }
      else lastTap = { t: now, x: p.x, y: p.y };
    }
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', (e) => { if (S.step !== 'view') return; e.preventDefault(); anim = null; const p = loc(e); zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0016)); }, { passive: false });

  // double tap: the stage goes back to where that spot was photographed
  R.goTo = function (mx, my) {
    const sc = S.scan; if (!sc || S.stageSlide !== sc.slide) return;
    const i = U.clamp(Math.floor(mx / TT.step), 0, TT.nx - 1), j = U.clamp(Math.floor(my / TT.step), 0, TT.ny - 1), t = sc.grid[j * TT.nx + i];
    if (!t || S.busy === 'load' || S.busy === 'unload' || S.busy === 'scan' || S.busy === 'stitch') return;
    mark = { x: mx, y: my, t: sim.time }; dirty = true; SS.emit('goto', t);
    mech.startJob('goto', (tok) => Promise.all([mech.setObjective(C.scanObjective, tok), ax.x.moveTo(C.pat.w / 2 - t.nx, tok), ax.y.moveTo(C.pat.h / 2 - t.ny, tok)]));
  };

  SS.on('layout', () => { if (!userView || S.step !== 'view') R.fit(); else clampView(); });
  SS.on('step', () => { ptrs.clear(); R.fit(); });
  ['scan:clear', 'scan:start', 'scan:tile', 'scan:done', 'stitch'].forEach((e) => SS.on(e, () => { dirty = true; }));
  SS.late.add({
    frame(dt) {
      if (S.step === 'load' || S.step === 'focus') return;
      if (anim) {
        anim.t = Math.min(1, anim.t + dt / anim.dur); const k = U.smooth(anim.t), a = anim.a, b = anim.b;
        V.ppm = a.ppm * Math.pow(b.ppm / a.ppm, k); V.cx = U.lerp(a.cx, b.cx, k); V.cy = U.lerp(a.cy, b.cy, k); dirty = true;
        if (anim.t >= 1) { const r = anim.res; anim = null; r(); }
      }
      if (S.camRev !== rev) { rev = S.camRev; dirty = true; }
      if (dirty || R.live) { dirty = false; draw(); }
    },
  });
  R.fit();
  SS.provide('screen', R);
})();
