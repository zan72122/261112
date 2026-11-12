/* Solver: every guarantee about a puzzle is made by running the very same
 * simulation the child plays (MG.simRun). */
(function (root) {
  'use strict';
  var MG = root.MG, C = MG.C, KINDS = MG.KINDS;
  var S = MG.Solver = {};

  S.rots = function (k) { return k === 'curve' ? [0, 3, 6, 9] : (KINDS[k].sym > 1 ? [0, 1, 2, 3, 4, 5] : [0]); };

  S.pkey = function (p) { return p.k + ':' + p.x + ':' + p.y + ':' + MG.canonRot(p.k, p.r); };
  S.key = function (placed) {
    var a = [], i; for (i = 0; i < placed.length; i++) a.push(S.pkey(placed[i]));
    a.sort(); return a.join('|');
  };

  /** Build the physics spec for a puzzle and a list of placed player pieces. */
  S.spec = function (pz, placed) {
    var items = [], i, f, p;
    for (i = 0; i < pz.fixed.length; i++) {
      f = pz.fixed[i];
      items.push({ id: 'f' + i, k: f.k, x: f.x, y: f.y, r: f.r || 0, w: f.w, h: f.h });
    }
    for (i = 0; i < placed.length; i++) {
      p = placed[i];
      items.push({ id: p.id || ('p' + i), k: p.k, x: p.x, y: p.y, r: p.r || 0 });
    }
    return { spoutX: pz.spoutX, items: items };
  };

  S.simulate = function (pz, placed, opt) { return MG.simRun(S.spec(pz, placed), opt); };

  /** Pieces of an arrangement the marble actually touched, in touch order. */
  S.touchedOnly = function (placed, res) {
    var out = [], i, j, id;
    for (i = 0; i < res.touched.length; i++) {
      id = res.touched[i];
      for (j = 0; j < placed.length; j++) if ((placed[j].id || ('p' + j)) === id) out.push({ k: placed[j].k, x: placed[j].x, y: placed[j].y, r: MG.canonRot(placed[j].k, placed[j].r) });
    }
    return out;
  };

  /** Does a recorded path come close enough to the item to touch it? (cheap prefilter) */
  S.pathTouches = function (path, it, from) {
    var segs = MG.itemSegs(it), thr = C.R + KINDS[it.k].rad + 5, thr2 = thr * thr, i, j, s;
    for (i = from || 0; i < path.length; i += 2) {
      if (Math.abs(path[i] - it.x) > 135 || Math.abs(path[i + 1] - it.y) > 135) continue;
      for (j = 0; j < segs.length; j++) {
        s = segs[j];
        if (MG.segDist2(path[i], path[i + 1], s[0], s[1], s[2], s[3]) < thr2) return i;
      }
    }
    return -1;
  };

  function cupOf(pz) { for (var i = 0; i < pz.fixed.length; i++) if (pz.fixed[i].k === 'cup') return pz.fixed[i]; return null; }
  S.cupOf = cupOf;

  function closest(path, tx, ty) {
    var best = 1e12, i, dx, dy, d;
    for (i = 0; i < path.length; i += 2) { dx = path[i] - tx; dy = path[i + 1] - ty; d = dx * dx + dy * dy; if (d < best) best = d; }
    return Math.sqrt(best);
  }

  /** Best-first search over arrangements. Generator function so the game can time-slice it. */
  S.solveGen = function* (pz, opt) {
    opt = opt || {};
    var budget = opt.budget || 600, maxSols = opt.maxSols || 24;
    var cup = cupOf(pz), tx = cup.x, ty = cup.y - 50;
    var out = { sols: [], sims: 0, exhausted: false, nodes: 0 };
    var open = [], seen = {}, seenT = {}, solT = {};
    var res = S.simulate(pz, [], { path: true });
    out.sims++;
    if (res.ok) { out.sols.push({ placed: [], steps: res.steps, bells: res.bells.slice() }); solT[''] = 1; }
    open.push({ placed: [], path: res.path, pri: closest(res.path, tx, ty) });
    seenT[''] = 1;
    var maxDepth = opt.maxDepth || pz.tray.length;
    while (open.length) {
      var bi = 0, i;
      for (i = 1; i < open.length; i++) if (open[i].pri < open[bi].pri) bi = i;
      var node = open.splice(bi, 1)[0];
      out.nodes++;
      // remaining kinds
      var remain = {}, kinds = [], k, n;
      for (i = 0; i < pz.tray.length; i++) remain[pz.tray[i].k] = (remain[pz.tray[i].k] || 0) + 1;
      for (i = 0; i < node.placed.length; i++) remain[node.placed[i].k]--;
      for (k in remain) if (remain[k] > 0) kinds.push(k);
      kinds.sort();
      for (var pi = 0; pi < pz.pegs.length; pi++) {
        var px = pz.pegs[pi][0], py = pz.pegs[pi][1], occ = false;
        for (i = 0; i < node.placed.length; i++) if (node.placed[i].x === px && node.placed[i].y === py) occ = true;
        if (occ) continue;
        for (var ki = 0; ki < kinds.length; ki++) {
          var rots = S.rots(kinds[ki]);
          for (var ri = 0; ri < rots.length; ri++) {
            var it = { k: kinds[ki], x: px, y: py, r: rots[ri] };
            if (S.pathTouches(node.path, it) < 0) continue;
            var arr = node.placed.concat([it]);
            var key = S.key(arr);
            if (seen[key]) continue;
            seen[key] = 1;
            res = S.simulate(pz, arr, { path: true });
            out.sims++;
            var tp = S.touchedOnly(arr, res), tkey = S.key(tp);
            if (res.ok) {
              if (!solT[tkey]) { solT[tkey] = 1; out.sols.push({ placed: tp, steps: res.steps, bells: res.bells.slice() }); }
            } else if (arr.length < maxDepth && !seenT[tkey]) {
              seenT[tkey] = 1;
              open.push({ placed: arr, path: res.path, pri: closest(res.path, tx, ty) + 70 * arr.length });
            }
            if (out.sims >= budget || out.sols.length >= maxSols) return out;
            if ((out.sims & 7) === 0) yield out;
          }
        }
      }
    }
    out.exhausted = true;
    return out;
  };

  S.runSync = function (gen) { var r = gen.next(); while (!r.done) r = gen.next(); return r.value; };
  S.solve = function (pz, opt) { return S.runSync(S.solveGen(pz, opt)); };

  /** Child-sized tolerance: the solution must not be a knife-edge fluke. */
  S.robust = function (pz, placed) {
    var dxs = [-5, 5, -2.5, 2.5], i, r;
    for (i = 0; i < dxs.length; i++) { r = S.simulate(pz, placed, { dx: dxs[i] }); if (!r.ok) return false; }
    return true;
  };

  /** Next single action that brings the current arrangement closer to a known solution.
   *  cur: [{id,k,x,y,r,placed}] ; returns {type:'go'} | {type:'move',id,x,y} | {type:'rotate',id,r} | {type:'tray',id} */
  S.nextAction = function (pz, cur) {
    var placed = [], i, j;
    for (i = 0; i < cur.length; i++) if (cur[i].placed) placed.push(cur[i]);
    if (S.simulate(pz, placed).ok) return { type: 'go' };
    var sols = [pz.sol].concat(pz.alts || []), best = null;
    for (var si = 0; si < sols.length; si++) {
      var sol = sols[si], used = {}, cost = 0, steps = [];
      // exact matches first, then same peg wrong angle, then anything of the kind
      var match = [], order = [];
      for (i = 0; i < sol.length; i++) match.push(null);
      // pieces still in the tray are offered before ones the child has already placed somewhere
      for (j = 0; j < cur.length; j++) if (!cur[j].placed) order.push(cur[j]);
      for (j = 0; j < cur.length; j++) if (cur[j].placed) order.push(cur[j]);
      for (var pass = 0; pass < 3; pass++) {
        for (i = 0; i < sol.length; i++) {
          if (match[i]) continue;
          for (j = 0; j < order.length; j++) {
            var p = order[j];
            if (used[p.id] || p.k !== sol[i].k) continue;
            var same = p.placed && p.x === sol[i].x && p.y === sol[i].y;
            var rotOk = MG.canonRot(p.k, p.r) === MG.canonRot(p.k, sol[i].r);
            if ((pass === 0 && same && rotOk) || (pass === 1 && same) || (pass === 2 && !(p.placed && onSol(sol, p)))) {
              match[i] = { p: p, same: same, rotOk: rotOk }; used[p.id] = 1; break;
            }
          }
        }
      }
      var feasible = true;
      for (i = 0; i < sol.length; i++) {
        if (!match[i]) { feasible = false; break; }
        if (match[i].same && match[i].rotOk) continue;
        if (match[i].same) { cost += 1; steps.push({ type: 'rotate', id: match[i].p.id, r: sol[i].r, x: sol[i].x, y: sol[i].y }); continue; }
        // target peg occupied by a foreign piece? move that one away first
        var blocker = null;
        for (j = 0; j < cur.length; j++) if (cur[j].placed && cur[j].x === sol[i].x && cur[j].y === sol[i].y && cur[j].id !== match[i].p.id) blocker = cur[j];
        if (blocker) { cost += 1; steps.push({ type: 'tray', id: blocker.id }); }
        cost += 1 + (match[i].rotOk ? 0 : 1);
        steps.push({ type: 'move', id: match[i].p.id, x: sol[i].x, y: sol[i].y, r: sol[i].r });
      }
      if (!feasible) continue;
      if (!steps.length) {
        // every solution piece is right but the run still fails: an extra piece is in the way
        for (j = 0; j < cur.length; j++) if (cur[j].placed && !used[cur[j].id]) { steps.push({ type: 'tray', id: cur[j].id }); cost += 1; break; }
      }
      if (steps.length && (!best || cost < best.cost)) best = { cost: cost, step: steps[0] };
    }
    return best ? best.step : { type: 'go' };
    function onSol(sol, p) { for (var q = 0; q < sol.length; q++) if (sol[q].x === p.x && sol[q].y === p.y && sol[q].k === p.k) return true; return false; }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MG;
})(typeof globalThis !== 'undefined' ? globalThis : this);
