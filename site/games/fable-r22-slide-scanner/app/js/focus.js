/* focus.js (late) — the live camera view, the focus dial, the sharpness graph and autofocus.
   Sharpness is measured from the pixels the camera actually renders (gradient energy),
   and AUTO really searches for the peak: a coarse sweep, then a climb with shrinking steps. */
(function () {
  'use strict';
  const SS = window.SS, U = SS.util, C = SS.cfg, S = SS.S, mech = SS.mech, sim = SS.sim, ax = S.ax;
  const $ = (s) => document.querySelector(s);
  const live = $('#live'), graph = $('#graph'), dial = $('#dial'), autoBtn = $('#auto'), lensBtn = $('#lens');
  const F = {};
  const f = S.focus;

  /* ---------- sharpness of the centre of the field ---------- */
  const N = 96, mc = document.createElement('canvas'); mc.width = mc.height = N;
  const mx = mc.getContext('2d', { willReadFrequently: true }), lum = new Float32Array(N * N);
  const WIDE = 1 / 3, FINE = 1 / 12; // part of the field used: wide to find the hill, narrow to sit on its top
  F.measure = function (crop) {
    mech.render(mx, N, 0, 0, null, crop || WIDE);
    const d = mx.getImageData(0, 0, N, N).data;
    let sum = 0;
    for (let k = 0, p = 0; k < N * N; k++, p += 4) { const l = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2]; lum[k] = l; sum += l; }
    let g = 0;
    for (let y = 0; y < N - 1; y++) for (let x = 0, k = y * N; x < N - 1; x++, k++) { const a = lum[k + 1] - lum[k], b = lum[k + N] - lum[k]; g += a * a + b * b; }
    const mean = sum / (N * N);
    return g / ((N - 1) * (N - 1)) / (mean * mean + 25);
  };
  function addSample(z, m) {
    const a = f.samples;
    for (let i = 0; i < a.length; i++) if (Math.abs(a[i].z - z) < 3) { a[i].z = z; a[i].m = m; f.last = a[i]; return; }
    a.push((f.last = { z, m })); a.sort((p, q) => p.z - q.z);
    if (a.length > 240) a.splice(0, a.length - 240);
  }

  /* ---------- autofocus ---------- */
  const ready = (tok) => sim.until(() => S.lamp.on && S.lamp.level > S.lamp.set * 0.95 && !ax.tur.moving, tok);
  const begin = () => { f.ok = false; f.af = true; autoBtn.classList.add('run'); };
  const end = () => { f.af = false; autoBtn.classList.remove('run'); };
  // climb from z0 with shrinking steps, then sit in the middle of the flat top
  async function climb(tok, z0, scale) {
    const o = mech.objective(), dof = C.objectives[o].dof;
    await ax.z.moveTo(z0, tok); await sim.wait(0.03, tok);
    let z = z0, m0 = F.measure(FINE), dir = 1, st = [20, 16, 8][o], n = 0;
    const k = scale / Math.max(m0, 1e-9); // keep the graph on one scale
    const look = async (zt) => { await ax.z.moveTo(zt, tok); await sim.wait(0.03, tok); const m = F.measure(FINE); addSample(zt, m * k); SS.emit('af:step', m); return m; };
    while (st >= 1.5 && n++ < 30) {
      const zt = U.clamp(z + dir * st, C.z.min, C.z.max), m = await look(zt);
      if (m > m0 * 1.0005) { z = zt; m0 = m; } else { dir = -dir; st *= 0.5; } // went over the top: turn back with a smaller step
    }
    const d = Math.max(1, dof / 3); let lo = z, hi = z;
    for (let q = 1; q <= 9; q++) { const zt = z + q * d; if (zt > C.z.max || (await look(zt)) < m0 * 0.975) break; hi = zt; }
    for (let q = 1; q <= 9; q++) { const zt = z - q * d; if (zt < C.z.min || (await look(zt)) < m0 * 0.975) break; lo = zt; }
    z = (lo + hi) / 2;
    await ax.z.moveTo(z, tok);
    f.ok = true; f.z = z; SS.emit('focus:done');
    return true;
  }
  // full search: sweep the whole travel, then climb the hill that was found
  F.auto = async function (tok) {
    begin(); f.samples.length = 0;
    try {
      const c = mech.cam();
      if (!(c.cx > 1 && c.cx < C.pat.w - 1 && c.cy > 1 && c.cy < C.pat.h - 1)) await Promise.all([ax.x.moveTo(0, tok), ax.y.moveTo(0, tok)]);
      await ready(tok);
      const step = [60, 50, 25][mech.objective()];
      await ax.z.moveTo(C.z.min, tok);
      let best = -1, bz = 0; const ms = [];
      for (let z = C.z.min; z <= C.z.max + 0.5; z += step) {
        await ax.z.moveTo(z, tok); await sim.wait(0.035, tok);
        const m = F.measure(); addSample(z, m); ms.push(m); SS.emit('af:step', m);
        if (m > best) { best = m; bz = z; }
      }
      const sorted = ms.slice().sort((a, b) => a - b), med = sorted[sorted.length >> 1];
      // a hill must rise clearly above the plain, must not sit at the end of the travel, and
      // must show real contrast: a heavily blurred image has almost none (measured: > 0.012 in
      // focus anywhere on the slides, < 0.0001 when 150 µm or more away)
      if (!(bz > C.z.min + 1 && bz < C.z.max - 1) || best < med * 2.2 || best < 0.0012) {
        await ax.z.moveTo(0, tok); // no hill anywhere in the travel
        SS.emit('focus:fail');
        return false;
      }
      return await climb(tok, bz, best);
    } finally { end(); }
  };
  // the user has focused by hand: only polish it; if there is no hill here, search everything
  F.refine = async function (tok) {
    await ready(tok);
    begin();
    try {
      const z = ax.z.pos, look = async (zt) => { await ax.z.moveTo(U.clamp(zt, C.z.min, C.z.max), tok); await sim.wait(0.03, tok); return F.measure(); };
      const m = await look(z), a = await look(z + 45), b = await look(z - 45);
      if (m > 0.003 && m > a * 1.3 && m > b * 1.3) return await climb(tok, z, m);
    } finally { end(); }
    return F.auto(tok);
  };
  // the slide cannot be focused (it is upside down): send it back to the desk and hint at it
  F.failEject = function () {
    const i = S.stageSlide;
    sim.wait(0.9).then(() => { if (S.stageSlide === i && i >= 0) { F.hint = i; SS.app.setStep('load'); } });
  };
  autoBtn.addEventListener('click', () => {
    SS.emit('user'); SS.emit('ui');
    if (S.busy === 'af') { mech.cancelJob(); return; }
    if ((S.busy !== '' && S.busy !== 'goto') || S.stageSlide < 0) return;
    mech.startJob('af', (tok) => F.auto(tok).then((ok) => { if (!ok) F.failEject(); }));
  });
  lensBtn.addEventListener('click', () => { SS.emit('user'); SS.emit('ui'); mech.turretStep(1); });
  SS.on('turret', () => { f.samples.length = 0; });
  SS.on('loaded', () => { f.samples.length = 0; });

  /* ---------- dial ---------- */
  let dAng = 0, dId = -1, tickAcc = 0, limitFlash = 0;
  const ang = (e) => { const r = dial.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2); };
  dial.addEventListener('pointerdown', (e) => { try { dial.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } dId = e.pointerId; dAng = ang(e); S.zHeld = true; SS.emit('user'); });
  dial.addEventListener('pointermove', (e) => {
    if (e.pointerId !== dId) return;
    const a = ang(e); let d = a - dAng; dAng = a;
    if (d > Math.PI) d -= 2 * Math.PI; else if (d < -Math.PI) d += 2 * Math.PI;
    if (mech.focusBy((d / (2 * Math.PI)) * C.z.turn)) { if (limitFlash <= 0) SS.emit('limit', 'zStage'); limitFlash = 0.4; }
    tickAcc += Math.abs(d); if (tickAcc > 0.2) { tickAcc = 0; SS.emit('tick'); }
  });
  const dUp = (e) => { if (e.pointerId === dId) { dId = -1; S.zHeld = false; } };
  dial.addEventListener('pointerup', dUp); dial.addEventListener('pointercancel', dUp);
  dial.addEventListener('wheel', (e) => { e.preventDefault(); mech.focusBy(-e.deltaY * 0.05); }, { passive: false });

  function drawDial() {
    const w = dial.width, x = dial.getContext('2d'), r = w / 2;
    x.clearRect(0, 0, w, w); x.save(); x.translate(r, r);
    // travel gauge
    const t = (ax.z.pos - C.z.min) / (C.z.max - C.z.min), a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
    x.lineWidth = r * 0.07; x.lineCap = 'round';
    x.strokeStyle = 'rgba(255,255,255,0.14)'; x.beginPath(); x.arc(0, 0, r * 0.93, a0, a1); x.stroke();
    x.strokeStyle = limitFlash > 0 ? '#ff5a4a' : '#f0b429'; x.beginPath(); x.arc(0, 0, r * 0.93, a0, a0 + (a1 - a0) * t); x.stroke();
    // knob
    const g = x.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r * 0.82);
    g.addColorStop(0, '#5a6573'); g.addColorStop(1, '#2a313b');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, r * 0.8, 0, 6.2832); x.fill();
    x.rotate((ax.z.pos / C.z.turn) * 2 * Math.PI);
    x.strokeStyle = 'rgba(255,255,255,0.28)'; x.lineWidth = Math.max(1, r * 0.03);
    for (let k = 0; k < 24; k++) { const a = (k / 24) * 6.2832; x.beginPath(); x.moveTo(Math.cos(a) * r * 0.66, Math.sin(a) * r * 0.66); x.lineTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78); x.stroke(); }
    x.fillStyle = '#f0b429'; x.beginPath(); x.arc(0, -r * 0.5, r * 0.1, 0, 6.2832); x.fill();
    x.restore();
    // mountain glyph in the middle: this dial is "focus"
    x.save(); x.translate(r, r); x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = Math.max(1.5, r * 0.045); x.lineJoin = 'round';
    x.beginPath(); x.moveTo(-r * 0.24, r * 0.12); x.lineTo(-r * 0.06, -r * 0.14); x.lineTo(r * 0.04, 0); x.lineTo(r * 0.12, -r * 0.08); x.lineTo(r * 0.26, r * 0.12); x.closePath(); x.stroke();
    x.restore();
  }

  /* ---------- graph: sharpness against Z, the "mountain" ---------- */
  function drawGraph() {
    const w = graph.width, h = graph.height, x = graph.getContext('2d');
    if (h < 8) return;
    x.clearRect(0, 0, w, h);
    const a = f.samples, pad = 6 * SS.dpr, X = (z) => pad + ((z - C.z.min) / (C.z.max - C.z.min)) * (w - 2 * pad);
    let mmax = 0.004; for (const s of a) if (s.m > mmax) mmax = s.m; // the floor keeps a featureless blur from looking like a hill
    if (f.cur > mmax) mmax = f.cur;
    const Y = (m) => h - pad - (m / mmax) * (h - 2.4 * pad);
    x.strokeStyle = 'rgba(255,255,255,0.18)'; x.lineWidth = SS.dpr; x.beginPath(); x.moveTo(pad, h - pad); x.lineTo(w - pad, h - pad); x.stroke();
    if (a.length > 1) {
      x.beginPath(); x.moveTo(X(a[0].z), h - pad);
      for (const s of a) x.lineTo(X(s.z), Y(s.m));
      x.lineTo(X(a[a.length - 1].z), h - pad); x.closePath();
      x.fillStyle = 'rgba(240,180,41,0.28)'; x.fill();
      x.beginPath(); a.forEach((s, i) => (i ? x.lineTo(X(s.z), Y(s.m)) : x.moveTo(X(s.z), Y(s.m))));
      x.strokeStyle = '#f0b429'; x.lineWidth = 2 * SS.dpr; x.lineJoin = 'round'; x.stroke();
    }
    x.fillStyle = '#f0b429'; for (const s of a) { x.beginPath(); x.arc(X(s.z), Y(s.m), 2.2 * SS.dpr, 0, 6.2832); x.fill(); }
    // where the lens is now
    const cx = X(ax.z.pos);
    x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = SS.dpr; x.beginPath(); x.moveTo(cx, pad * 0.5); x.lineTo(cx, h - pad); x.stroke();
    if (f.cur !== undefined) { x.fillStyle = '#fff'; x.beginPath(); x.arc(cx, Y(f.cur), 3.6 * SS.dpr, 0, 6.2832); x.fill(); }
    if (f.ok) { const fx = X(f.z); x.fillStyle = '#4ade80'; x.beginPath(); x.moveTo(fx, pad * 0.3); x.lineTo(fx + 7 * SS.dpr, pad * 0.3 + 4 * SS.dpr); x.lineTo(fx, pad * 0.3 + 8 * SS.dpr); x.closePath(); x.fill(); x.fillRect(fx - SS.dpr * 0.75, pad * 0.3, SS.dpr * 1.5, h - pad * 1.3); }
  }

  /* ---------- live view ---------- */
  function drawLive() {
    const n = live.width, x = live.getContext('2d');
    if (n < 8) return;
    mech.render(x, n, 0, 0);
    if (f.af) { x.strokeStyle = '#f0b429'; x.lineWidth = 2 * SS.dpr; x.strokeRect(n / 3, n / 3, n / 3, n / 3); }
    x.strokeStyle = 'rgba(255,255,255,0.5)'; x.lineWidth = SS.dpr;
    x.beginPath(); x.moveTo(n / 2 - 7 * SS.dpr, n / 2); x.lineTo(n / 2 + 7 * SS.dpr, n / 2); x.moveTo(n / 2, n / 2 - 7 * SS.dpr); x.lineTo(n / 2, n / 2 + 7 * SS.dpr); x.stroke();
  }
  // dragging the picture moves the stage, like pushing the slide under a microscope
  let lId = -1, lx = 0, ly = 0;
  live.addEventListener('pointerdown', (e) => { try { live.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } lId = e.pointerId; lx = e.clientX; ly = e.clientY; S.nudge.held = true; SS.emit('user'); });
  live.addEventListener('pointermove', (e) => {
    if (e.pointerId !== lId) return;
    const k = C.objectives[mech.objective()].fov / live.getBoundingClientRect().width;
    mech.jogBy((e.clientX - lx) * k, (e.clientY - ly) * k); lx = e.clientX; ly = e.clientY;
  });
  const lUp = (e) => { if (e.pointerId === lId) { lId = -1; S.nudge.held = false; } };
  live.addEventListener('pointerup', lUp); live.addEventListener('pointercancel', lUp);

  /* ---------- per frame ---------- */
  let rev = 0, zSeen = 1e9, mT = 0, wob = 0, lensShown = -1, redraw = true;
  SS.on('layout', () => { redraw = true; });
  SS.on('af:step', () => { redraw = true; });
  ['focus:done', 'focus:fail', 'loaded', 'turret', 'busy'].forEach((e) => SS.on(e, () => { redraw = true; }));
  SS.late.add({
    tick(dt) {
      // a slide that was sent back because it is upside down wobbles to show why
      if (F.hint !== undefined && F.hint >= 0) {
        const s = S.slides[F.hint];
        if (s.where === 'table') { wob = 2.6; F.wobI = F.hint; F.hint = -1; }
      }
      if (wob > 0) {
        wob -= dt; const s = S.slides[F.wobI], body = SS.m.slides[F.wobI].body;
        if (s.where !== 'table' || !s.flipped) wob = 0;
        else body.rotation.x = Math.PI + Math.sin((2.6 - wob) * 9) * 0.5 * Math.min(1, wob);
        if (wob <= 0 && s.flipped && s.where === 'table') body.rotation.x = Math.PI;
      }
    },
    frame(dt) {
      if (S.step === 'load') return;
      limitFlash -= dt; mT -= dt;
      const o = mech.objective();
      if (o !== lensShown) { lensShown = o; lensBtn.textContent = C.objectives[o].mag + '×'; }
      const changed = S.camRev !== rev;
      if (changed || redraw) {
        rev = S.camRev; drawLive();
        // keep the graph honest while the user turns the dial: measure, do not guess
        if (S.stageSlide >= 0 && S.lamp.level > 0.05 && !f.af && mT <= 0 && S.busy !== 'load' && S.busy !== 'unload') {
          mT = 0.05; f.cur = F.measure();
          if (Math.abs(ax.z.pos - zSeen) > 2 && S.busy !== 'scan' && S.busy !== 'stitch') { zSeen = ax.z.pos; addSample(ax.z.pos, f.cur); }
        } else if (f.af && f.last) f.cur = f.last.m;
        drawDial(); drawGraph(); redraw = limitFlash > -0.1;
      }
    },
  });
  SS.provide('focus', F);
})();
