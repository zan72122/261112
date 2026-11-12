/* Read-only window into the game for the automated tests, plus a manual clock.
 * Tests still act through real pointer events; this only tells them where
 * things are and lets them advance the fixed-step clock without waiting. */
(function (root) {
  'use strict';
  var MG = root.MG, G = MG.Game, C = MG.C, L = MG.Layout, St = MG.Store;
  var T = root.__T = {};
  function sp(x, y) { var p = G.toScreen(x, y); return { x: Math.round(p.x * 100) / 100, y: Math.round(p.y * 100) / 100 }; }

  T.manual = function (on) { G.manual = !!on; G.lastTs = 0; return G.manual; };
  /** Advance n frames at the given frame rate. Only the last one is drawn. */
  T.frames = function (n, fps, draw) {
    var ms = 1000 / (fps || 60), i;
    for (i = 0; i < n; i++) { G.skipRender = !(draw !== false && i === n - 1); G.frame(ms); }
    G.skipRender = false;
    return G.t;
  };
  /** Run frames until the current run is over (or a cap). Returns frames used. */
  T.runOut = function (fps, cap) {
    var ms = 1000 / (fps || 60), n = 0, b = G.board;
    G.skipRender = true;
    while (b && b.runActive && n < (cap || 2400)) { G.frame(ms); n++; }
    G.skipRender = false; G.frame(ms);
    return n;
  };
  T.issue = function (seed, level) {
    var pz = MG.Gen.generate(seed, level);
    if (G.screen !== 'play') { G.screen = 'play'; G.restAt = 0; }
    G.setPuzzle(pz); G.fade = 0;
    return { id: pz.id, src: pz.src, level: pz.level, score: pz.diff ? pz.diff.score : null, nsol: pz.diff ? pz.diff.nsol : null, attempts: pz.attempts || 0, sol: pz.sol, alts: pz.alts, tray: pz.tray, secret: pz.secret, solverFound: pz.diff ? pz.diff.solverFound : null };
  };
  T.loadPuzzle = function (pz) { G.screen = 'play'; G.restAt = 0; G.setPuzzle(JSON.parse(JSON.stringify(pz))); G.fade = 0; return pz.id; };
  T.pt = sp;
  T.world = function (cx, cy) { return G.toWorld(cx, cy); };
  T.view = function () { return { scale: G.view.scale, ox: G.view.ox, oy: G.view.oy, w: G.view.w, h: G.view.h }; };
  T.ui = function () {
    var o = {}, k;
    ['home', 'hint', 'undo', 'redo', 'next'].forEach(function (n) { o[n] = sp(L[n].x, L[n].y); });
    for (k in G.HOME) o['home_' + k] = sp(G.HOME[k].x, G.HOME[k].y);
    o.corner = sp(C.W - 50, C.H - 50);
    o.dots = MG.Parent.DOTS.map(function (d) { return sp(d.x, d.y); });
    o.shelfLeft = sp(G.SHELF.left.x, G.SHELF.left.y); o.shelfRight = sp(G.SHELF.right.x, G.SHELF.right.y);
    return o;
  };
  T.state = function () {
    var b = G.board, o = { screen: G.screen, t: G.t, parentOpen: MG.Parent.isOpen, parentState: MG.Parent.state, finishAfter: G.finishAfter, nextReady: G.nextReady(), logLen: G.log.length, storageOK: St.ok, audio: { started: MG.Audio.started, ctx: !!MG.Audio.ctx, dead: MG.Audio.dead, state: MG.Audio.ctx ? MG.Audio.ctx.state : 'none', played: MG.Audio.played }, progress: St.data.progress, creations: St.data.creations.length };
    if (b) {
      o.board = {
        mode: b.mode, id: b.pz.id, level: b.pz.level, sel: b.sel, won: b.won, fails: b.fails, runs: b.runs, runActive: b.runActive, spoutX: b.spoutX,
        undo: b.undoStack.length, redo: b.redoStack.length, trail: b.trail ? b.trail.length / 2 : 0,
        hint: b.hint ? { act: b.hint.act, auto: b.hint.auto, t: b.hint.t } : null, hintGlow: b.hintGlow(), hintCount: b.hintCount,
        foundN: b.foundN, bonus: { bell: !!b.bonus.bell, thrift: !!b.bonus.thrift },
        drag: !!b.drag, rot: b.rot ? { id: b.rot.id, to: b.rot.to } : null,
        pieces: b.pieces.map(function (p) { var t = b.target(p), s = sp(t.x, t.y), h = sp(b.slotX(p), L.TRAY_Y); return { id: p.id, k: p.k, x: p.x, y: p.y, r: p.r, placed: p.placed, sx: s.x, sy: s.y, hx: h.x, hy: h.y }; }),
        spout: sp(b.spoutX, 40),
        marbles: b.world ? b.world.marbles.filter(function (m) { return m.state === 1 || m.state === 2; }).length : 0
      };
      var selP = b.sel ? b.byId(b.sel) : null;
      if (selP && selP.placed && MG.KINDS[selP.k].rstep) {
        var h = b.handlePos(selP, b.rot && b.rot.id === selP.id ? b.rot.to : undefined);
        o.board.handle = sp(h.x, h.y); o.board.handleSide = h.side; o.board.arrowDeg = Math.round(h.a * 180 / Math.PI) % 360;
      }
    }
    return o;
  };
  /** Independent search for a solution (does not look at the stored one). */
  T.solveNow = function (budget) {
    var pz = G.board.pz, r = MG.Solver.solve(pz, { budget: budget || 3000, maxSols: 1 });
    return { found: r.sols.length > 0, placed: r.sols.length ? r.sols[0].placed : pz.sol, sims: r.sims };
  };
  T.simNow = function () { var b = G.board; return MG.Solver.simulate(b.pz, b.placedPieces()).ok; };
  T.puzzle = function () { return G.board ? G.board.pz : null; };
  T.arrangement = function () { return G.board ? G.board.pieces.map(function (p) { return { id: p.id, k: p.k, x: p.x, y: p.y, r: p.r, placed: p.placed }; }) : []; };
  T.log = function (from) { return G.log.slice(from || 0); };
  T.digest = function () { return G.board && G.board.world ? MG.digest(G.board.world) : ''; };
  T.events = function () { return G.board && G.board.world ? G.board.world.events.map(function (e) { return [e.s, e.t, e.m, e.o, e.v, e.x, e.y]; }) : []; };
  T.shelf = function () {
    var sh = G.shelfCards();
    return { page: sh.page, pages: sh.pages, cards: sh.cards.map(function (c) { var a = sp(c.x + c.w / 2, c.y + c.h / 2 + 30), o = { type: c.type, id: c.id || null, x: a.x, y: a.y }; if (c.copy) { var q = sp(c.copy.x, c.copy.y); o.cx = q.x; o.cy = q.y; } return o; }) };
  };
  T.creations = function () { return JSON.parse(JSON.stringify(St.data.creations)); };
  T.save = function () { return JSON.parse(JSON.stringify(St.data)); };
  T.frameStats = function (on) { if (on) { G.frameStats = { gap: [], work: [] }; return true; } var s = G.frameStats; G.frameStats = null; return s; };
})(typeof globalThis !== 'undefined' ? globalThis : this);
