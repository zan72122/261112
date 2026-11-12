/* Puzzle generator (K6).
 * Builds a puzzle forwards from a known solution: drop the marble, put a piece
 * in its way, watch where the real physics sends it, repeat, and finally put
 * the cup where the marble lands. Every candidate is then checked by the
 * solver (same physics), rejected if it is trivial, a fluke or out of the
 * level's difficulty band, and replaced by a hand-made puzzle if we run out
 * of attempts. */
(function (root) {
  'use strict';
  var MG = root.MG, C = MG.C, KINDS = MG.KINDS, S = MG.Solver;
  var G = MG.Gen = { forceFail: false, stats: { attempts: 0, fallbacks: 0, why: {} } };
  function no(why) { G.stats.why[why] = (G.stats.why[why] || 0) + 1; return null; }

  // chain: pieces on the marble's way; player: how many of them the child places
  var LEVELS = G.LEVELS = {
    1: { chain: [1], player: [1], need: 1, kinds: { plank: 5, curve: 2 }, distract: [1, 2], rot: 'given', blocks: [0], spare: 0, bell: 0.15, band: [5, 14], budget: 400 },
    2: { chain: [1, 2], player: [1], need: 1, kinds: { plank: 4, curve: 2, bouncer: 2 }, distract: [2, 3], rot: 'near', blocks: [0], spare: 0, bell: 0.2, band: [12, 23], budget: 600 },
    3: { chain: [2], player: [2], need: 2, kinds: { plank: 4, curve: 2, bouncer: 2 }, distract: [1, 2], rot: 'near', blocks: [0, 1], spare: 0, bell: 0.3, band: [21, 34], budget: 1200 },
    4: { chain: [2, 3], player: [2], need: 2, kinds: { plank: 3, curve: 2, bouncer: 2 }, distract: [2, 4], rot: 'flat', blocks: [0, 1, 2], spare: 0, bell: 0.45, band: [32, 46], budget: 1800 },
    5: { chain: [3], player: [2, 3], need: 2, kinds: { plank: 3, curve: 2, bouncer: 2 }, distract: [3, 5], rot: 'flat', blocks: [1, 2], spare: 0.15, bell: 0.55, band: [44, 58], budget: 2600 },
    6: { chain: [3, 4], player: [3], need: 2, kinds: { plank: 3, curve: 2, bouncer: 3 }, distract: [4, 6], rot: 'flat', blocks: [1, 2, 3], spare: 0.4, bell: 0.6, band: [56, 999], budget: 3200 }
  };
  G.MAX_LEVEL = 6;

  function ri(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function pickW(rng, w) {
    var t = 0, k, r; for (k in w) t += w[k];
    r = rng() * t; for (k in w) { r -= w[k]; if (r < 0) return k; }
    return k;
  }
  function shuffle(rng, a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function segSegDist(a, b) {
    // good enough for thin capsules: endpoint-to-segment distances, plus a crossing test
    var d = Math.min(
      MG.segDist2(a[0], a[1], b[0], b[1], b[2], b[3]), MG.segDist2(a[2], a[3], b[0], b[1], b[2], b[3]),
      MG.segDist2(b[0], b[1], a[0], a[1], a[2], a[3]), MG.segDist2(b[2], b[3], a[0], a[1], a[2], a[3]));
    var d1 = (b[2] - b[0]) * (a[1] - b[1]) - (b[3] - b[1]) * (a[0] - b[0]);
    var d2 = (b[2] - b[0]) * (a[3] - b[1]) - (b[3] - b[1]) * (a[2] - b[0]);
    var d3 = (a[2] - a[0]) * (b[1] - a[1]) - (a[3] - a[1]) * (b[0] - a[0]);
    var d4 = (a[2] - a[0]) * (b[3] - a[1]) - (a[3] - a[1]) * (b[2] - a[0]);
    if (d1 * d2 < 0 && d3 * d4 < 0) return 0;
    return Math.sqrt(d);
  }
  function itemsGap(a, b) {
    var sa = MG.itemSegs(a), sb = MG.itemSegs(b), best = 1e9, i, j, d;
    for (i = 0; i < sa.length; i++) for (j = 0; j < sb.length; j++) { d = segSegDist(sa[i], sb[j]); if (d < best) best = d; }
    return best - KINDS[a.k].rad - KINDS[b.k].rad;
  }
  G.itemsGap = itemsGap;

  function pathMinDist(path, x, y, from) {
    var best = 1e12, i, dx, dy, d;
    for (i = from || 0; i < path.length; i += 2) { dx = path[i] - x; dy = path[i + 1] - y; d = dx * dx + dy * dy; if (d < best) best = d; }
    return Math.sqrt(best);
  }
  function pathRectDist(path, bx, by, w, h) {
    var best = 1e12, i, qx, qy, d;
    for (i = 0; i < path.length; i += 2) {
      qx = Math.max(Math.abs(path[i] - bx) - w / 2, 0); qy = Math.max(Math.abs(path[i + 1] - by) - h / 2, 0);
      d = qx * qx + qy * qy; if (d < best) best = d;
    }
    return Math.sqrt(best);
  }
  function sameArr(a, b) { return a.length === b.length && a.join(',') === b.join(','); }

  /** One attempt. Returns a puzzle or null. Generator function (yields between simulations). */
  function* attempt(rng, L) {
    var P = LEVELS[L], spoutX = C.GX0 + C.GS * ri(rng, 1, C.COLS - 2);
    var chainN = pick(rng, P.chain), chain = [], i, j, c;
    var spec = { spoutX: spoutX, items: [] };
    var res = MG.simRun(spec, { path: true }), from = 30;
    var touchedIds = [];
    for (c = 0; c < chainN; c++) {
      var kind = pickW(rng, P.kinds);
      if (c > 0 && chain[c - 1].k === 'bouncer' && kind === 'bouncer' && rng() < 0.7) kind = 'plank';
      var cands = [], rots = S.rots(kind), seenPeg = {};
      for (i = from; i < res.path.length; i += 2) {
        var px = res.path[i], py = res.path[i + 1];
        var gx0 = Math.max(0, Math.ceil((px - 130 - C.GX0) / C.GS)), gx1 = Math.min(C.COLS - 1, Math.floor((px + 130 - C.GX0) / C.GS));
        var gy0 = Math.max(0, Math.ceil((py - 130 - C.GY0) / C.GS)), gy1 = Math.min(C.ROWS - 1, Math.floor((py + 130 - C.GY0) / C.GS));
        for (var gx = gx0; gx <= gx1; gx++) for (var gy = gy0; gy <= gy1; gy++) {
          var pk = gx + ',' + gy; if (seenPeg[pk]) continue; seenPeg[pk] = 1;
          for (j = 0; j < rots.length; j++) cands.push({ k: kind, x: C.GX0 + gx * C.GS, y: C.GY0 + gy * C.GS, r: rots[j] });
        }
      }
      shuffle(rng, cands);
      var okc = null, tries = 0;
      for (i = 0; i < cands.length && tries < 16 && !okc; i++) {
        var cd = cands[i];
        if (cd.y - C.SPOUT_Y < 120) continue;
        var first = S.pathTouches(res.path, cd, 0);
        if (first < from) continue;                      // must not disturb the earlier part of the run
        var clash = false;
        for (j = 0; j < chain.length; j++) if (itemsGap(cd, chain[j]) < 34 || (chain[j].x === cd.x && chain[j].y === cd.y)) clash = true;
        if (clash) continue;
        tries++;
        cd.id = 'c' + c;
        var r2 = MG.simRun({ spoutX: spoutX, items: chain.concat([cd]) }, { path: true });
        yield 0;
        if (r2.end !== 'out') continue;
        if (!sameArr(r2.touched, touchedIds.concat([cd.id]))) continue;
        var hits = 0; for (j = 0; j < r2.events.length; j++) if (r2.events[j].t === 'hit' && r2.events[j].o === cd.id) hits++;
        if (hits > 2) continue;
        var last = r2.touchLast[cd.id], ei = (last >> 1) * 2 + 16;
        if (ei >= r2.path.length) continue;
        var ex = r2.path[ei], ey = r2.path[ei + 1];
        if (ex < 110 || ex > C.W - 110 || ey > (c === chainN - 1 ? 620 : 560) || ey < 60) continue;
        okc = cd; res = r2; from = (last >> 1) * 2 + 24;
      }
      if (!okc) return no('chain' + c);
      chain.push(okc); touchedIds.push(okc.id);
    }
    // the cup goes where the marble comes down
    var cups = [], seenCup = {};
    for (var cy = 350; cy <= 750; cy += 50) {
      var my = cy - 40;                                   // a little below the rim line
      for (i = from + 20; i < res.path.length - 2; i += 2) {
        if (!(res.path[i + 1] < my && res.path[i + 3] >= my)) continue;
        var cx = Math.round(res.path[i] / 10) * 10;
        if (cx < 150 || cx > C.W - 150) continue;
        var ck = cx + ',' + cy; if (seenCup[ck]) continue; seenCup[ck] = 1;
        cups.push({ k: 'cup', x: cx, y: cy, id: 'cup', i: i });
      }
    }
    cups.sort(function (a, b) { return a.i - b.i; });
    if (!cups.length) return no('nocupspot');
    // prefer a longer flight: sort by time, take from the later two thirds
    var cup = null, order = [];
    for (i = 0; i < cups.length; i++) order.push(cups[Math.min(cups.length - 1, Math.floor(cups.length * (0.25 + 0.75 * rng())))]);
    for (i = 0; i < order.length && i < 8 && !cup; i++) {
      var cc = order[i], bad = false;
      for (j = 0; j < chain.length; j++) if (Math.abs(chain[j].x - cc.x) < 150 && Math.abs(chain[j].y - cc.y) < 140) bad = true;
      if (bad) continue;
      var r3 = MG.simRun({ spoutX: spoutX, items: chain.concat([cc]) }, { path: true });
      yield 0;
      if (r3.ok && sameArr(r3.touched, touchedIds.concat(['cup'])) && r3.steps < 840) { cup = cc; res = r3; }
    }
    if (!cup) return no('cupfail');

    // split the chain into bolted pieces and the child's pieces
    var nPlayer = Math.min(chainN, pick(rng, P.player)), idx = [], isPlayer = {};
    for (i = 0; i < chainN; i++) idx.push(i);
    shuffle(rng, idx);
    for (i = 0; i < nPlayer; i++) isPlayer[idx[i]] = 1;
    var fixed = [{ k: 'cup', x: cup.x, y: cup.y }], sol = [];
    for (i = 0; i < chainN; i++) {
      var q = { k: chain[i].k, x: chain[i].x, y: chain[i].y, r: MG.canonRot(chain[i].k, chain[i].r) };
      if (isPlayer[i]) sol.push(q); else fixed.push(q);
    }
    var pz = { spoutX: spoutX, fixed: fixed, pegs: [], tray: [], sol: sol, alts: [], level: L };

    // stone blocks: scenery that also closes off shortcuts
    var nb = pick(rng, P.blocks), shapes = [[100, 100], [200, 60], [60, 200], [150, 100], [100, 150]];
    for (i = 0, j = 0; i < nb && j < 14; j++) {
      var sh = pick(rng, shapes), bx = ri(rng, 3, 29) * 50, by = ri(rng, 6, 15) * 50;
      if (pathRectDist(res.path, bx, by, sh[0], sh[1]) < C.R + 34) continue;
      if (Math.abs(bx - cup.x) < sh[0] / 2 + 110 && Math.abs(by - cup.y) < sh[1] / 2 + 100) continue;
      var blk = { k: 'block', x: bx, y: by, w: sh[0], h: sh[1] }, near = false;
      for (var q2 = 0; q2 < chain.length; q2++) if (Math.abs(chain[q2].x - bx) < sh[0] / 2 + 115 && Math.abs(chain[q2].y - by) < sh[1] / 2 + 115) near = true;
      for (q2 = 1; q2 < fixed.length; q2++) if (fixed[q2].k === 'block' && Math.abs(fixed[q2].x - bx) < (fixed[q2].w + sh[0]) / 2 + 20 && Math.abs(fixed[q2].y - by) < (fixed[q2].h + sh[1]) / 2 + 20) near = true;
      if (near) continue;
      fixed.push(blk); i++;
    }

    // the bare board must not solve itself, and every piece of the solution must matter
    if (S.simulate(pz, []).ok) return no('trivial');
    for (i = 0; i < sol.length; i++) {
      var without = sol.slice(0, i).concat(sol.slice(i + 1));
      if (S.simulate(pz, without).ok) return no('unneeded');
    }
    yield 0;
    var base = S.simulate(pz, sol, { path: true });
    if (!base.ok) return no('blockbreak');
    if (!S.robust(pz, sol)) return no('fluke');
    yield 0;

    // open pegs: the solution's pegs plus tempting others
    var empty = MG.simRun({ spoutX: spoutX, items: [] }, { path: true });
    var pegs = [], pegKey = {};
    for (i = 0; i < sol.length; i++) { pegs.push([sol[i].x, sol[i].y]); pegKey[sol[i].x + ',' + sol[i].y] = 1; }
    var pool = [];
    for (var gx2 = 0; gx2 < C.COLS; gx2++) for (var gy2 = 0; gy2 < C.ROWS; gy2++) {
      var qx = C.GX0 + gx2 * C.GS, qy = C.GY0 + gy2 * C.GS;
      if (pegKey[qx + ',' + qy]) continue;
      var blocked = false;
      for (j = 0; j < fixed.length; j++) {
        var f = fixed[j];
        if (f.k === 'block') { if (Math.abs(qx - f.x) < f.w / 2 + 45 && Math.abs(qy - f.y) < f.h / 2 + 45) blocked = true; }
        else if (f.k === 'cup') { if (Math.abs(qx - f.x) < 115 && Math.abs(qy - f.y) < 100) blocked = true; }
        else if (MG.itemDist(f, qx, qy) < 45) blocked = true;
      }
      if (blocked) continue;
      var dn = Math.min(pathMinDist(base.path, qx, qy), pathMinDist(empty.path, qx, qy));
      pool.push({ x: qx, y: qy, w: dn < 105 ? 8 : (dn < 210 ? 3 : 0.4) });
    }
    var nd = ri(rng, P.distract[0], P.distract[1]);
    for (i = 0; i < nd && pool.length; i++) {
      var tw = 0; for (j = 0; j < pool.length; j++) tw += pool[j].w;
      var rr = rng() * tw;
      for (j = 0; j < pool.length; j++) { rr -= pool[j].w; if (rr < 0) break; }
      j = Math.min(j, pool.length - 1);
      pegs.push([pool[j].x, pool[j].y]); pool.splice(j, 1);
    }
    pegs.sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; });
    pz.pegs = pegs;

    // tray
    var tray = [];
    for (i = 0; i < sol.length; i++) {
      var tr = sol[i].r, K = KINDS[sol[i].k];
      if (P.rot === 'near') tr = MG.canonRot(sol[i].k, sol[i].r - K.rstep * ri(rng, 0, 2));
      else if (P.rot === 'flat') tr = 0;
      tray.push({ k: sol[i].k, r: tr });
    }
    if (rng() < P.spare) tray.push({ k: pickW(rng, P.kinds), r: 0 });
    shuffle(rng, tray);
    pz.tray = tray;
    return { pz: pz, base: base };
  }

  /** Difficulty estimate from what the solver saw: roughly "how many bits of search does a
   *  player face before stumbling on any of the known solutions", plus a little for pieces
   *  whose effect is harder to foresee. */
  G.rate = function (pz, an) {
    var i, j, k, sols = [], solKey = S.key(pz.sol), has = false;
    for (i = 0; i < an.sols.length; i++) { sols.push(an.sols[i].placed); if (S.key(an.sols[i].placed) === solKey) has = true; }
    if (!has) sols.push(pz.sol);
    var trayRot = {};
    for (i = 0; i < pz.tray.length; i++) (trayRot[pz.tray[i].k] = trayRot[pz.tray[i].k] || []).push(MG.canonRot(pz.tray[i].k, pz.tray[i].r));
    var mass = 0, minP = 99, easiest = null, easiestBits = 1e9;
    for (j = 0; j < sols.length; j++) {
      var sol = sols[j], bits = 0;
      for (i = 0; i < sol.length; i++) {
        k = sol[i].k;
        var given = trayRot[k] && trayRot[k].indexOf(MG.canonRot(k, sol[i].r)) >= 0;
        bits += Math.log2(Math.max(1, pz.pegs.length - i)) + (given ? 0.4 : Math.log2(S.rots(k).length));
      }
      mass += Math.pow(2, -bits);
      if (sol.length < minP) minP = sol.length;
      if (bits < easiestBits) { easiestBits = bits; easiest = sol; }
    }
    var eff = Math.max(0.3, -Math.log2(mass));
    var bounc = 0, needRot = 0;
    for (i = 0; i < easiest.length; i++) {
      if (easiest[i].k === 'bouncer') bounc++;
      if (!(trayRot[easiest[i].k] && trayRot[easiest[i].k].indexOf(MG.canonRot(easiest[i].k, easiest[i].r)) >= 0)) needRot++;
    }
    var nFixed = 0; for (i = 0; i < pz.fixed.length; i++) if (pz.fixed[i].k !== 'cup' && pz.fixed[i].k !== 'bell') nFixed++;
    var score = 5 * eff + 4 * easiest.length + 3 * bounc + (pz.tray.length > pz.sol.length ? 3 : 0) + 1.2 * nFixed;
    return {
      score: Math.round(score * 10) / 10, bits: Math.round(eff * 100) / 100, nsol: sols.length, exhausted: an.exhausted,
      minPieces: minP, needRot: needRot, pegs: pz.pegs.length, pieces: pz.sol.length, sims: an.sims
    };
  };

  function* finish(pz, base, rng, L) {
    var P = LEVELS[L], i, j;
    if (P.need > 1) {   // cheap early exit: a shortcut with fewer pieces than this level is about
      var quick = yield* S.solveGen(pz, { budget: 400, maxSols: 1, maxDepth: P.need - 1 });
      if (quick.sols.length) return no('shortcut');
    }
    var an = yield* S.solveGen(pz, { budget: P.budget, maxSols: 16 });
    var solKey = S.key(pz.sol), found = false, alts = [];
    for (i = 0; i < an.sols.length; i++) {
      if (S.key(an.sols[i].placed) === solKey) found = true; else alts.push(an.sols[i]);
    }
    var diff = G.rate(pz, an);
    diff.solverFound = found;
    pz.diff = diff;
    // keep a few alternatives for hints; shortest first
    alts.sort(function (a, b) { return a.placed.length - b.placed.length || a.steps - b.steps; });
    pz.alts = alts.slice(0, 5).map(function (a) { return a.placed; });
    pz.secret = { bell: false, thrift: diff.minPieces < pz.sol.length && diff.minPieces > 0, par: diff.minPieces };

    // bell: for little ones it hangs on the way; later it hides on another way home
    if (rng() < P.bell) {
      var path = base.path, target = null, altUsed = -1;
      if (L >= 3 && alts.length) {
        for (var a = 0; a < Math.min(alts.length, 4) && !target; a++) {
          var ra = S.simulate(pz, alts[a].placed, { path: true });
          if (!ra.ok) continue;
          target = bellSpot(pz, ra.path, path, rng);
          if (target) altUsed = a;
        }
      }
      if (!target && (L <= 3 || rng() < 0.35)) target = bellSpot(pz, path, null, rng);
      yield 0;
      if (target) {
        pz.fixed.push({ k: 'bell', x: target[0], y: target[1] });
        var chk = S.simulate(pz, altUsed >= 0 ? alts[altUsed].placed : pz.sol);
        if (chk.ok && chk.bells.length) { pz.secret.bell = true; pz.secret.bellAlt = altUsed >= 0; if (altUsed >= 0) pz.bellSol = alts[altUsed].placed; }
        else pz.fixed.pop();
      }
    }
    return pz;
  }

  function bellSpot(pz, path, avoid, rng) {
    var opts = [], i, j, x, y, ok;
    for (i = 40; i < path.length - 30; i += 6) {
      x = Math.round(path[i]); y = Math.round(path[i + 1]);
      if (x < 80 || x > C.W - 80 || y < 150 || y > 760) continue;
      ok = true;
      for (j = 0; j < pz.fixed.length && ok; j++) {
        var f = pz.fixed[j];
        if (f.k === 'cup') { if (Math.abs(x - f.x) < 110 && Math.abs(y - f.y) < 120) ok = false; }
        else if (MG.itemDist(f, x, y) < 62) ok = false;
      }
      for (j = 0; j < pz.pegs.length && ok; j++) if (Math.hypot(x - pz.pegs[j][0], y - pz.pegs[j][1]) < 118) ok = false;
      if (ok && avoid && pathMinDist(avoid, x, y) < 95) ok = false;
      if (ok) opts.push([x, y]);
    }
    return opts.length ? pick(rng, opts) : null;
  }

  /** Full generation as a time-sliceable generator. Always returns a verified puzzle. */
  G.generateGen = function* (seed, level, opt) {
    opt = opt || {};
    level = Math.max(1, Math.min(G.MAX_LEVEL, level | 0));
    var rng = MG.rng(MG.hash2(seed, level * 7919 + 13)), P = LEVELS[level];
    var maxAttempts = opt.maxAttempts || 520, n = 0;
    while (!G.forceFail && n < maxAttempts) {
      n++; G.stats.attempts++;
      var built = yield* attempt(rng, level);
      if (!built) continue;
      var pz = yield* finish(built.pz, built.base, rng, level);
      if (!pz) continue;
      var sc = pz.diff.score;
      if (pz.diff.minPieces < P.need) continue;
      if (sc < P.band[0] || sc > P.band[1]) continue;
      // final word belongs to the physics: the stored solution must still work with everything in place
      if (!S.simulate(pz, pz.sol).ok) continue;
      pz.id = 'g' + level + '-' + seed; pz.seed = seed; pz.level = level; pz.src = 'gen'; pz.attempts = n;
      return pz;
    }
    G.stats.fallbacks++;
    return G.fallback(seed, level);
  };
  G.generate = function (seed, level, opt) { return S.runSync(G.generateGen(seed, level, opt)); };

  /** Hand-made, verified puzzles for when the generator comes up empty. */
  G.fallback = function (seed, level) {
    var bank = MG.Bank || [], pool = [], i;
    for (i = 0; i < bank.length; i++) if (bank[i].level === level) pool.push(bank[i]);
    if (!pool.length) for (i = 0; i < bank.length; i++) if (Math.abs(bank[i].level - level) <= 1) pool.push(bank[i]);
    if (!pool.length) pool = bank;
    var src = pool[(seed >>> 0) % pool.length];
    var pz = JSON.parse(JSON.stringify(src));
    pz.seed = seed; pz.src = 'bank'; pz.id = src.id + '-' + seed;
    return pz;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MG;
})(typeof globalThis !== 'undefined' ? globalThis : this);
