/* scan.js (late) — tile capture in serpentine order and stitching.
   Each tile is rendered at the stage's true position (screw backlash, vibration, knocks),
   with the blur and exposure of that instant. Stitching then measures the offset of every
   neighbouring pair from their overlapping pixels (zero-mean normalised cross-correlation,
   coarse to fine), solves all tile positions together, and re-takes tiles that fit nowhere. */
(function () {
  'use strict';
  const SS = window.SS, U = SS.util, C = SS.cfg, S = SS.S, mech = SS.mech, sim = SS.sim, ax = S.ax;
  const TT = C.tiles, N = TT.px, N2 = N / 2, PPM = N / TT.fov, STEP = Math.round(TT.step * PPM); // 96 px
  const all = (l) => Promise.all(l);
  const rnd = U.rng(20261113);
  const Sc = {};

  function gray(t) {
    const d = t.cv.getContext('2d').getImageData(0, 0, N, N).data, g = new Float32Array(N * N), h = new Float32Array(N2 * N2);
    for (let k = 0, p = 0; k < N * N; k++, p += 4) g[k] = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
    for (let y = 0; y < N2; y++) for (let x = 0; x < N2; x++) { const k = 2 * y * N + 2 * x; h[y * N2 + x] = (g[k] + g[k + 1] + g[k + N] + g[k + N + 1]) / 4; }
    t.g = g; t.g2 = h;
  }
  function capture(i, j, idx) {
    const cs = mech.cam();
    cs.cx += (rnd() - 0.5) * 0.05; cs.cy += (rnd() - 0.5) * 0.05; // the stage never settles perfectly
    cs.blur += Math.hypot(S.bump.vx, S.bump.vy) * 0.004; // a knock during the exposure smears the tile
    const cv = document.createElement('canvas'); cv.width = cv.height = N;
    mech.render(cv.getContext('2d', { willReadFrequently: true }), N, 0, 0, cs);
    const t = { i, j, idx, nx: TT.step * (i + 0.5), ny: TT.step * (j + 0.5), tx: cs.cx, ty: cs.cy, ex: 0, ey: 0, blur: cs.blur, gain: cs.gain, flipped: cs.flipped, cv, born: sim.time, bad: false };
    gray(t);
    return t;
  }

  /* zero-mean normalised cross-correlation of the area where B(x,y) lies on A(x+ox, y+oy) */
  function zncc(A, B, n, ox, oy) {
    const x0 = Math.max(0, -ox), x1 = Math.min(n, n - ox), y0 = Math.max(0, -oy), y1 = Math.min(n, n - oy);
    if (x1 - x0 < 3 || y1 - y0 < 3) return -1;
    const cnt = (x1 - x0) * (y1 - y0);
    let sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
    for (let y = y0; y < y1; y++) {
      let kb = y * n + x0, ka = (y + oy) * n + x0 + ox;
      for (let x = x0; x < x1; x++) { const a = A[ka++], b = B[kb++]; sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b; }
    }
    const va = saa - (sa * sa) / cnt, vb = sbb - (sb * sb) / cnt;
    if (va < 4 * cnt || vb < 4 * cnt) return -1; // nothing to hold on to
    return (sab - (sa * sb) / cnt) / Math.sqrt(va * vb);
  }
  const peak = (m, c, p) => { const d = m - 2 * c + p; return Math.abs(d) < 1e-9 ? 0 : U.clamp((0.5 * (m - p)) / d, -0.5, 0.5); };
  /* Offset of tile b relative to where it should be next to tile a (mm), with a confidence
     and a weight per axis. A strip that only shows lines running across the seam matches
     equally well wherever it is slid along them, so the sharpness of the correlation peak
     in each direction decides how much that direction can be trusted. */
  function register(a, b, horiz) {
    const R = 5, S2 = STEP / 2, MIN = (N - STEP) / 2; // never accept less than half of the overlap
    let best = -2, bx = 0, by = 0;
    for (let sy = -R; sy <= R; sy++) for (let sx = -R; sx <= R; sx++) {
      if ((horiz ? sx : sy) > MIN / 2) continue;
      const v = zncc(a.g2, b.g2, N2, horiz ? S2 + sx : sx, horiz ? sy : S2 + sy) - 0.004 * (Math.abs(sx) + Math.abs(sy));
      if (v > best) { best = v; bx = sx; by = sy; }
    }
    const f = (sx, sy) => ((horiz ? sx : sy) > MIN ? -1 : zncc(a.g, b.g, N, horiz ? STEP + sx : sx, horiz ? sy : STEP + sy));
    let fb = -2, fx = 0, fy = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const v = f(2 * bx + dx, 2 * by + dy); if (v > fb) { fb = v; fx = 2 * bx + dx; fy = 2 * by + dy; } }
    const xm = f(fx - 1, fy), xp = f(fx + 1, fy), ym = f(fx, fy - 1), yp = f(fx, fy + 1);
    const curve = (m, p) => (m < -0.5 || p < -0.5 ? 0 : U.clamp((2 * fb - m - p) / 0.06, 0, 1));
    const cw = fb > 0.55 ? fb * fb : 0;
    return { dx: (fx + peak(xm, fb, xp)) / PPM, dy: (fy + peak(ym, fb, yp)) / PPM, conf: fb, wx: Math.max(0.004, cw * curve(xm, xp)), wy: Math.max(0.004, cw * curve(ym, yp)) };
  }
  /* A tile that was knocked or shifted fits at most the neighbours that were shifted with it.
     Measured correlation: undisturbed pairs 0.82-1.0, blurred or brighter against normal
     0.52-0.99 (median 0.8-0.9), displaced against normal 0.06-0.71 (median 0.2-0.3).
     So: at least half of a tile's seams below 0.5 means it does not belong where it is. */
  function isBad(t) {
    let low = 0, known = 0;
    for (const p of t.pairs) { if (p.conf <= -1) continue; known++; if (p.conf < 0.5) low++; } // -1: a blank strip says nothing
    return known > 0 && low * 2 >= known;
  }
  function solve(sc) {
    const n = sc.tiles.length, cx = new Float64Array(TT.nx * TT.ny), cy = new Float64Array(TT.nx * TT.ny), key = (t) => t.j * TT.nx + t.i;
    for (let it = 0; it < 160; it++) {
      for (const t of sc.tiles) {
        let wx = 0, wy = 0, sx = 0, sy = 0; const k = key(t);
        for (const p of t.pairs) {
          if (p.a === t) { sx += p.wx * (cx[key(p.b)] - p.dx); sy += p.wy * (cy[key(p.b)] - p.dy); } else { sx += p.wx * (cx[key(p.a)] + p.dx); sy += p.wy * (cy[key(p.a)] + p.dy); }
          wx += p.wx; wy += p.wy;
        }
        if (wx > 0) cx[k] = sx / wx; if (wy > 0) cy[k] = sy / wy;
      }
    }
    let mx = 0, my = 0; for (const t of sc.tiles) { mx += cx[key(t)]; my += cy[key(t)]; } mx /= n; my /= n;
    for (const t of sc.tiles) { t.gx = cx[key(t)] - mx; t.gy = cy[key(t)] - my; t.bad = isBad(t); }
  }
  async function slideIn(sc, tok, dur) {
    const from = sc.tiles.map((t) => [t.ex, t.ey]), t0 = sim.time;
    for (;;) {
      const k = U.smooth((sim.time - t0) / dur);
      sc.tiles.forEach((t, q) => { if (!t.bad) { t.ex = U.lerp(from[q][0], t.gx, k); t.ey = U.lerp(from[q][1], t.gy, k); } });
      SS.emit('stitch');
      if (k >= 1) break;
      await sim.next(tok);
    }
  }

  async function stitch(sc, tok) {
    const scr = SS.screen;
    S.busy = 'stitch'; sc.phase = 'register'; SS.emit('busy'); SS.emit('stitch:start');
    sc.pairs = []; sc.tiles.forEach((t) => { t.pairs = []; });
    const at = (i, j) => (i < TT.nx && j < TT.ny ? sc.grid[j * TT.nx + i] : null);
    for (const t of sc.tiles) {
      for (const [b, horiz] of [[at(t.i + 1, t.j), true], [at(t.i, t.j + 1), false]]) {
        if (!b) continue;
        const p = { a: t, b, horiz, dx: 0, dy: 0, conf: 0, wx: 0, wy: 0, done: false }; sc.pairs.push(p); t.pairs.push(p); b.pairs.push(p);
      }
    }
    // compare every pair of neighbours; a few per frame so the seams can be seen lighting up
    for (let k = 0; k < sc.pairs.length; k++) {
      const p = sc.pairs[k]; Object.assign(p, register(p.a, p.b, p.horiz)); p.done = true;
      if (k % 5 === 4) { SS.emit('stitch'); SS.emit('seam'); await sim.wait(0.012, tok); }
    }
    solve(sc); SS.emit('stitch');
    await sim.wait(0.25, tok);
    // show one junction close up while the tiles slide into register
    sc.phase = 'align';
    if (scr) { await scr.zoomTo(18, 3, document.querySelector('#screen').width / 7.6, 0.9); await sim.wait(0.45, tok); }
    await slideIn(sc, tok, 1.4); SS.emit('stitch:fit');
    await sim.wait(0.45, tok);
    if (scr) await scr.fitTo(0.8);
    // tiles that match none of their neighbours were disturbed: go back and take them again
    let retakes = 0;
    for (let round = 0; round < 2; round++) {
      const bad = sc.tiles.filter((t) => t.bad);
      if (!bad.length || retakes >= 14) break;
      sc.phase = 'retake'; SS.emit('retake');
      for (const old of bad) {
        if (retakes++ >= 14) break;
        await all([ax.x.moveTo(C.pat.w / 2 - old.nx, tok), ax.y.moveTo(C.pat.h / 2 - old.ny, tok)]);
        await sim.wait(0.12, tok);
        const t = capture(old.i, old.j, old.idx);
        t.pairs = old.pairs; t.pairs.forEach((p) => { if (p.a === old) p.a = t; else p.b = t; Object.assign(p, register(p.a, p.b, p.horiz)); });
        sc.tiles[sc.tiles.indexOf(old)] = t; sc.grid[t.j * TT.nx + t.i] = t;
        SS.emit('scan:tile', t);
        await sim.wait(0.1, tok);
      }
      const keep = sc.tiles.map((t) => [t.ex, t.ey]);
      solve(sc); sc.tiles.forEach((t, q) => { t.ex = keep[q][0]; t.ey = keep[q][1]; });
      await slideIn(sc, tok, 0.6);
    }
    sc.phase = 'blend';
    const t0 = sim.time;
    for (;;) { sc.blend = U.smooth((sim.time - t0) / 0.8); SS.emit('stitch'); if (sc.blend >= 1) break; await sim.next(tok); }
  }

  Sc.start = function () {
    if (S.stageSlide < 0 && S.want < 0) return;
    // a slide still on its way to the stage: start as soon as it has arrived
    if (mech.loaderBusy() || S.stageSlide < 0) { Sc.pending = true; return; }
    Sc.pending = false;
    return mech.startJob('scan', async (tok) => {
      SS.dropScan();
      const sc = (S.scan = { slide: S.stageSlide, tiles: [], grid: new Array(TT.nx * TT.ny).fill(null), pairs: [], blend: 0, done: false, phase: 'prep' });
      SS.emit('scan:start');
      if (SS.screen) SS.screen.fit();
      await all([mech.setObjective(C.scanObjective, tok), ax.x.moveTo(0, tok), ax.y.moveTo(0, tok)]);
      // exposure is set once for the whole scan, from the lamp as it is now
      await sim.until(() => Math.abs(S.lamp.level - S.lamp.set) < 0.01, tok);
      S.lamp.ref = S.lamp.set; S.exposure = 1 / Math.max(0.2, S.lamp.set);
      if (!S.focus.ok) {
        const ok = await SS.focus.refine(tok);
        if (!ok) { SS.focus.failEject(); return; }
      }
      S.zBase = ax.z.pos; S.zOff = 0; S.zServo = true;
      sc.phase = 'capture';
      let idx = 0;
      for (let j = 0; j < TT.ny; j++) {
        for (let q = 0; q < TT.nx; q++) {
          const i = j % 2 ? TT.nx - 1 - q : q; // boustrophedon: there and back like an ox ploughing
          await all([ax.x.moveTo(C.pat.w / 2 - TT.step * (i + 0.5), tok), ax.y.moveTo(C.pat.h / 2 - TT.step * (j + 0.5), tok)]);
          await sim.wait(0.05, tok);
          const t = capture(i, j, idx++);
          sc.tiles.push(t); sc.grid[j * TT.nx + i] = t;
          SS.emit('scan:tile', t);
          await sim.wait(0.07, tok);
        }
      }
      await stitch(sc, tok);
      sc.done = true; sc.phase = 'done'; S.zServo = false; S.zOff = 0;
      SS.emit('scan:done');
      await all([ax.x.moveTo(0, tok), ax.y.moveTo(0, tok)]);
    });
  };
  SS.on('loaded', () => { if (Sc.pending && S.step === 'scan') Sc.start(); Sc.pending = false; });
  SS.on('step', (n) => { if (n !== 'scan') Sc.pending = false; });
  SS.provide('scan', Sc);
})();
