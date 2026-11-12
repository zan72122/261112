/* Mechanism simulation (no rendering): handwheel -> crank -> specimen stroke,
   ratchet feed, retraction, cutting, coarse feed, lock, guard and safety stop.
   All lengths in millimetres, angles in radians. */
(function () {
  'use strict';
  const MT = window.MT, K = MT.K;
  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const wrap = a => ((a % TAU) + TAU) % TAU;
  const smooth = t => t * t * (3 - 2 * t);

  K.crumpleOmega = 8.5;                 // rad/s through the cut: faster than this crumples the section
  K.UG0 = 0.5 - 20 / K.bh;              // guard closed: block may not enter (UG0, UG1)
  K.UG1 = 0.5 + 14 / K.bh;

  // fraction of the block face that has passed the edge (0 = edge at block bottom, 1 = at top)
  const uOf = th => 0.5 - (K.R / K.bh) * Math.cos(th);
  // specimen retraction on the return stroke
  function retractAt(ph) {
    if (ph <= 180 * DEG) return 0;
    if (ph < 195 * DEG) return K.retract * smooth((ph - 180 * DEG) / (15 * DEG));
    if (ph <= 285 * DEG) return K.retract;
    if (ph < 300 * DEG) return K.retract * (1 - smooth((ph - 285 * DEG) / (15 * DEG)));
    return 0;
  }

  const S = {
    theta: 0, omega: 0, wiggle: 0,
    F: 0, W: K.W0, um: 5, fresh: true,
    lock: false, guardClosed: false,
    feedArmed: false, feedProg: 0, feedLatch: 0, feedAcc: 0, coarseAcc: 0,
    cut: null, blockOut: false, sections: 0, turns: 0,
    busy: false, knifeAway: false,
    drag: null,            // { target, slip, clunked }
    lastBlock: '',
  };
  S.F = S.um * 0.001;

  const pRaw = () => S.F + S.W - K.W0;
  const pEff = () => pRaw() - retractAt(wrap(S.theta));

  function startCut(p, ev) {
    const kind = p > K.Pchunk ? 'chunk' : 'section';
    S.cut = { kind, p, u: 0, crumple: false, peak: 0 };
    S.fresh = false;
    ev.push({ t: 'cutStart', kind, p });
  }

  // advance the wheel by a small angle; returns false when something blocks it
  function advance(d, speed, ev) {
    const th0 = S.theta, th1 = th0 + d;
    const u0 = uOf(th0), u1 = uOf(th1);
    if (S.guardClosed) {
      const in0 = u0 > K.UG0 && u0 < K.UG1, in1 = u1 > K.UG0 && u1 < K.UG1;
      if (!in0 && in1) { ev.push({ t: 'guardThud', speed }); return false; }
    }
    const ph0 = wrap(th0), ph1 = wrap(th1), fwd = d > 0;
    if (fwd && ph0 < Math.PI && ph1 >= Math.PI) { S.feedArmed = true; S.feedProg = 0; }
    if (fwd && ph1 < ph0) S.turns++;
    if (fwd && S.feedArmed && (ph1 >= K.feedA0 || ph1 < ph0)) {
      const prog = ph1 < ph0 ? 1 : clamp((ph1 - K.feedA0) / (K.feedA1 - K.feedA0), 0, 1);
      if (prog > S.feedProg) {
        if (S.feedProg === 0) {
          const want = S.fresh ? 0 : S.um * 0.001;
          const cap = Math.max(0, S.W - K.Wmin - Math.max(0, pRaw()));
          S.feedLatch = Math.min(want, cap);
          if (!S.fresh && cap < want - 1e-9 && !S.blockOut) { S.blockOut = true; ev.push({ t: 'blockOut' }); }
        }
        const dF = (prog - S.feedProg) * S.feedLatch;
        S.F += dF; S.feedProg = prog;
        S.feedAcc += dF * 1000;
        while (S.feedAcc >= 1) { S.feedAcc -= 1; ev.push({ t: 'ratchet' }); }
        if (prog >= 1) S.feedArmed = false;
      }
    }
    S.theta = th1;
    const pe = pRaw() - retractAt(ph1);
    if (!S.cut && !S.knifeAway && pe > 4e-4) {
      if (u0 < 0 && u1 >= 0) startCut(pe, ev);
      else if (u0 > 1 && u1 <= 1) {       // block dragged upwards over the edge: scraped, not cut
        S.W -= pe; S.fresh = false;
        ev.push({ t: 'scrape', p: pe });
        if (S.W <= K.Wmin + 1e-6 && !S.blockOut) { S.blockOut = true; ev.push({ t: 'blockOut' }); }
      }
    }
    const c = S.cut;
    if (c) {
      const uc = clamp(u1, 0, 1);
      if (uc > c.u) {
        const du = uc - c.u; c.u = uc;
        if (speed > c.peak) c.peak = speed;
        if (c.kind === 'section' && speed > K.crumpleOmega && !c.crumple) { c.crumple = true; ev.push({ t: 'crumple' }); }
        ev.push({ t: 'cutProg', kind: c.kind, u: c.u, du, speed, p: c.p });
      }
      if (c.u >= 1) {
        S.W -= c.p;
        if (c.kind === 'section' && !c.crumple) S.sections++;
        ev.push({ t: 'cutEnd', kind: c.kind, crumple: c.crumple, p: c.p });
        S.cut = null;
        if (S.W <= K.Wmin + 1e-6 && !S.blockOut) { S.blockOut = true; ev.push({ t: 'blockOut' }); }
      }
    }
    return true;
  }

  function step(dt, ev) {
    let dth = 0, want = 0;
    if (S.drag) {
      want = S.drag.target - S.drag.slip - S.theta;
      if (Math.abs(want) > 1.2) { const ex = want - Math.sign(want) * 1.2; S.drag.slip += ex; want -= ex; }
    }
    if (S.busy) { S.omega = 0; }
    else if (S.lock) {
      if (S.drag) {
        S.wiggle = clamp(want * 0.1, -0.028, 0.028);
        if (Math.abs(want) > 0.07 && !S.drag.clunked) { S.drag.clunked = true; ev.push({ t: 'lockClunk' }); }
        if (Math.abs(want) < 0.02) S.drag.clunked = false;
      } else if (Math.abs(S.omega) > 0.3) ev.push({ t: 'lockClunk' });
      S.omega = 0;
    } else if (S.drag) {
      let lim = 34;
      if (S.cut && S.cut.kind === 'chunk') lim = 2.4 / (1 + S.cut.p * 1.6);
      dth = clamp(want, -lim * dt, lim * dt);
    } else {
      S.omega *= Math.exp(-0.8 * dt);
      let dec = 2.6;
      if (S.cut) dec += S.cut.kind === 'chunk' ? 70 + 90 * S.cut.p : 1.5 + S.um * 0.2;
      if (S.blockOut) dec += 3;
      S.omega = Math.abs(S.omega) <= dec * dt ? 0 : S.omega - Math.sign(S.omega) * dec * dt;
      dth = S.omega * dt;
    }
    if (!S.lock || !S.drag) S.wiggle *= Math.exp(-18 * dt);
    const n = Math.max(1, Math.ceil(Math.abs(dth) / (2.5 * DEG)));
    const d = dth / n, speed = Math.abs(dth) / Math.max(dt, 1e-4);
    let moved = 0, blocked = false;
    if (dth !== 0) for (let i = 0; i < n; i++) { if (!advance(d, speed, ev)) { blocked = true; break; } moved += d; }
    if (S.drag) {
      S.omega += (moved / Math.max(dt, 1e-4) - S.omega) * Math.min(1, dt * 14);
      if (blocked) { S.omega = 0; S.drag.slip += want - moved; }
    } else if (blocked) S.omega = -S.omega * 0.12;
    return moved;
  }

  function setUm(v, ev) {
    v = clamp(Math.round(v), 1, 20);
    if (v === S.um) return false;
    S.um = v;
    if (S.fresh) S.F = v * 0.001;
    ev.push({ t: 'dial', um: v });
    return true;
  }

  function coarse(dA, ev) {
    if (S.busy) return 0;
    const u = uOf(S.theta);
    if (u > -0.03 && u < 1.03) { ev.push({ t: 'coarseBlocked' }); return 0; }
    let dF = (dA / TAU) * K.coarsePerRev, hit = false;
    const pr = pRaw(), maxP = Math.min(K.Pmax, S.W - K.Wmin);
    if (dF > 0 && pr + dF > maxP) { dF = Math.max(0, maxP - pr); hit = true; }
    if (dF < 0 && S.F + dF < K.Fmin) { dF = Math.min(0, K.Fmin - S.F); hit = true; }
    if (dF !== 0) {
      S.F += dF; S.fresh = false;
      S.coarseAcc += dF;
      while (Math.abs(S.coarseAcc) >= 0.1) { S.coarseAcc -= Math.sign(S.coarseAcc) * 0.1; ev.push({ t: 'coarseClick' }); }
    }
    if (hit) {
      ev.push({ t: 'coarseLimit', out: dA > 0 && S.W - K.Wmin <= K.Pmax + 1e-9 && S.W - K.Wmin < 0.05 });
      if (dA > 0 && S.W - K.Wmin < 1e-6 && !S.blockOut) { S.blockOut = true; ev.push({ t: 'blockOut' }); }
    }
    return dF;
  }

  function toggleLock(ev) {
    if (S.busy) return;
    S.lock = !S.lock;
    ev.push({ t: S.lock ? 'lockOn' : 'lockOff', spinning: Math.abs(S.omega) > 0.5 });
    if (S.lock) S.omega = 0;
  }
  function toggleGuard(ev) {
    if (S.busy) return;
    if (!S.guardClosed) {
      const u = uOf(S.theta);
      if (u > K.UG0 && u < K.UG1) { ev.push({ t: 'guardRefuse' }); return; }
    }
    S.guardClosed = !S.guardClosed;
    ev.push({ t: S.guardClosed ? 'guardClose' : 'guardOpen' });
  }
  function canReload() { const u = uOf(S.theta); return !S.busy && (u < -0.03 || u > 1.03); }
  function finishReload() {
    S.W = K.W0; S.F = S.um * 0.001; S.fresh = true; S.cut = null; S.blockOut = false;
    S.feedArmed = false; S.feedProg = 0; S.feedAcc = 0; S.coarseAcc = 0;
  }

  MT.Sim = { S, step, setUm, coarse, toggleLock, toggleGuard, canReload, finishReload, uOf, retractAt, pRaw, pEff, wrap };
})();
