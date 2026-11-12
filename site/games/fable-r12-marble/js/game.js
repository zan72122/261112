/* Game shell: screens, input (K3), puzzle flow and gentle adaptation (K6),
 * the creation shelf (K7) and the resting scene (K8). */
(function (root) {
  'use strict';
  var MG = root.MG, C = MG.C, R = MG.R, PAL = MG.PAL, S = MG.Solver, A = MG.Audio, St = MG.Store, KINDS = MG.KINDS, L = MG.Layout, Board = MG.Board;
  var TAU = Math.PI * 2;

  var G = MG.Game = {
    screen: 'home', view: { scale: 1, ox: 0, oy: 0, w: 0, h: 0, dpr: 1 }, t: 0,
    board: null, demo: null, ptr: null, log: [], manual: false, testMode: false,
    job: null, nextPz: null, finishAfter: false, restAt: 0, fade: 0, shelfPage: 0, thumbs: {},
    frameStats: null, frames: 0, triedFull: false, skipRender: false
  };
  var HOME = { play: { x: 640, y: 914, r: 74 }, build: { x: 960, y: 914, r: 74 }, full: { x: C.W - 64, y: 64, r: 40 } };
  var SHELF = { cols: 4, rows: 2, w: 340, h: 250, gap: 30, y0: 170, left: { x: 690, y: 920, r: 50 }, right: { x: 910, y: 920, r: 50 } };
  G.HOME = HOME; G.SHELF = SHELF;

  G.note = function (e) { e.at = Math.round(G.t * 1000) / 1000; G.log.push(e); if (G.log.length > 6000) G.log.splice(0, 1000); };
  function now() { return (root.performance && performance.now) ? performance.now() : Date.now(); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- view ---------- */
  G.resize = function () {
    var cv = G.canvas, w = root.innerWidth, h = root.innerHeight, dpr = Math.min(2, root.devicePixelRatio || 1), v = G.view;
    v.w = w; v.h = h; v.dpr = dpr;
    v.scale = Math.min(w / C.W, h / C.H);
    v.ox = (w - C.W * v.scale) / 2; v.oy = (h - C.H * v.scale) / 2;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    G.bgLayer = null;
  };
  G.toWorld = function (cx, cy) { var v = G.view; return { x: (cx - v.ox) / v.scale, y: (cy - v.oy) / v.scale }; };
  G.toScreen = function (x, y) { var v = G.view; return { x: v.ox + x * v.scale, y: v.oy + y * v.scale }; };

  /* ---------- puzzles: which one, how hard (K6) ---------- */
  G.currentSpec = function () {
    var pr = St.data.progress;
    if (!pr.tutDone && pr.tutStep < MG.Tutorial.length) return { tut: pr.tutStep };
    return { seed: MG.hash2(pr.salt, pr.counter) & 0x7fffffff, level: pr.level };
  };
  G.idleHintAfter = function () { return (G.board && G.board.pz.tut) ? 12 : 45; };

  G.loadCurrent = function () {
    var spec = G.currentSpec();
    G.nextPz = null;
    if (spec.tut !== undefined) return G.setPuzzle(clone(MG.Tutorial[spec.tut]));
    G.board = null;
    G.job = { gen: MG.Gen.generateGen(spec.seed, spec.level), done: function (pz) { if (G.screen === 'play') G.setPuzzle(pz); } };
  };
  G.setPuzzle = function (pz) {
    G.board = new Board('puzzle', pz, G);
    G.nextPz = null; G.job = null; G.fade = 1;
    G.note({ t: 'puzzle', id: pz.id, level: pz.level, src: pz.src || (pz.tut ? 'tutorial' : 'gen'), score: pz.diff ? pz.diff.score : 0 });
  };
  /** Called by the board on a success. Difficulty only ever changes between puzzles. */
  G.solved = function (b, first) {
    if (!first) return;
    var pr = St.data.progress, pz = b.pz;
    if (pz.tut) {
      pr.tutStep = Math.max(pr.tutStep, pz.tutIndex + 1);
      if (pr.tutStep >= MG.Tutorial.length) pr.tutDone = true;
    } else {
      var hard = b.hintCount > 0 || b.fails >= 4, smooth = b.fails <= 1 && b.hintCount === 0;
      if (hard) { pr.level = Math.max(1, pr.level - 1); pr.streak = 0; }
      else if (smooth) { pr.streak++; if (pr.streak >= 2) { pr.level = Math.min(MG.Gen.MAX_LEVEL, pr.level + 1); pr.streak = 0; } }
      else pr.streak = 0;
      pr.counter++;
      G.note({ t: 'adapt', level: pr.level, fails: b.fails, hints: b.hintCount });
    }
    St.save();
    if (G.finishAfter) { G.finishAfter = false; G.restAt = G.t + 2.8; return; }
    var spec = G.currentSpec();
    if (spec.tut !== undefined) G.nextPz = clone(MG.Tutorial[spec.tut]);
    else G.job = { gen: MG.Gen.generateGen(spec.seed, spec.level), done: function (p) { G.nextPz = p; } };
  };
  G.nextReady = function () { var b = G.board; return !!(b && b.won && G.nextPz && !G.restAt && G.t - b.wonT > 1.3); };

  /* ---------- screens ---------- */
  G.goHome = function () {
    G.screen = 'home'; G.board = null; G.job = null; G.fade = 1; A.roll(0, 0);
    G.demo = new Board('demo', clone(MG.Demo), G); G.demoT = 1.2;
    G.note({ t: 'screen', s: 'home' });
  };
  G.startPlay = function () { G.screen = 'play'; G.fade = 1; G.restAt = 0; G.note({ t: 'screen', s: 'play' }); G.loadCurrent(); };
  G.openShelf = function () { G.screen = 'shelf'; G.board = null; G.fade = 1; A.roll(0, 0); G.note({ t: 'screen', s: 'shelf' }); };
  G.goRest = function () { G.screen = 'rest'; G.board = null; G.job = null; G.nextPz = null; G.restAt = 0; G.fade = 1; G.restT = G.t; A.roll(0, 0); A.ui('sleep'); G.note({ t: 'screen', s: 'rest' }); };
  G.wake = function () { if (G.screen === 'rest') G.goHome(); };

  function allPegs() { var a = [], x, y; for (y = 0; y < C.ROWS; y++) for (x = 0; x < C.COLS; x++) a.push([C.GX0 + x * C.GS, C.GY0 + y * C.GS]); return a; }
  /** Open the sandbox on a creation (or a fresh one). */
  G.openBuild = function (c, isCopy) {
    var fresh = !c;
    if (fresh) c = { id: St.newId(), created: Date.now(), updated: Date.now(), parentId: null, spoutX: 750, pieces: [], prev: null };
    var pz = { id: 'sandbox', spoutX: c.spoutX, fixed: [], pegs: allPegs(), tray: c.pieces.map(function (p) { return { k: p.k, r: p.r, x: p.x, y: p.y }; }) };
    G.screen = 'build'; G.fade = 1;
    G.board = new Board('sandbox', pz, G);
    G.board.creation = c; G.board.saved = !fresh; G.board.prevDone = fresh || isCopy;
    G.board.openSnap = JSON.stringify({ spoutX: c.spoutX, pieces: c.pieces });
    G.note({ t: 'screen', s: 'build', id: c.id });
  };
  /** Autosave: what a child builds is remembered without any save button. */
  G.sandboxChanged = function (b) {
    var c = b.creation, placed = b.placedPieces();
    var pieces = placed.map(function (p) { return { k: p.k, x: p.x, y: p.y, r: p.r }; });
    if (JSON.stringify(pieces) === JSON.stringify(c.pieces) && b.spoutX === c.spoutX) return;
    c.pieces = pieces; c.spoutX = b.spoutX; c.updated = Date.now();
    if (!b.prevDone) { c.prev = JSON.parse(b.openSnap); b.prevDone = true; }   // parent's before/after view
    if (!pieces.length && !b.saved) return;
    if (!pieces.length && b.saved && !c.prev && !c.parentId) { St.removeCreation(c.id); b.saved = false; return; }
    St.putCreation(c); b.saved = true;
  };
  G.sortedCreations = function () { return St.data.creations.slice().sort(function (a, b) { return b.updated - a.updated || (a.id < b.id ? 1 : -1); }); };
  G.shelfCards = function () {
    var list = G.sortedCreations(), per = SHELF.cols * SHELF.rows, cards = [], all = [{ type: 'new' }], i;
    for (i = 0; i < list.length; i++) all.push({ type: 'creation', id: list[i].id, c: list[i] });
    var pages = Math.max(1, Math.ceil(all.length / per));
    G.shelfPage = Math.max(0, Math.min(pages - 1, G.shelfPage));
    var x0 = (C.W - (SHELF.cols * SHELF.w + (SHELF.cols - 1) * SHELF.gap)) / 2;
    for (i = G.shelfPage * per; i < Math.min(all.length, (G.shelfPage + 1) * per); i++) {
      var j = i - G.shelfPage * per, cd = all[i];
      cd.x = x0 + (j % SHELF.cols) * (SHELF.w + SHELF.gap); cd.y = SHELF.y0 + Math.floor(j / SHELF.cols) * (SHELF.h + SHELF.gap + 20); cd.w = SHELF.w; cd.h = SHELF.h;
      if (cd.type === 'creation') cd.copy = { x: cd.x + cd.w - 44, y: cd.y + 44, r: 34 };
      cards.push(cd);
    }
    return { cards: cards, pages: pages, page: G.shelfPage };
  };

  /* ---------- input (K3) ---------- */
  function hitC(c, x, y, tol) { return Math.hypot(x - c.x, y - c.y) <= c.r + tol; }
  function tolFor(type) { return (type === 'mouse' ? 12 : 28) / G.view.scale; }

  G.onDown = function (e) {
    A.start();                                  // sound wakes with the first touch, never before
    var p = G.toWorld(e.clientX, e.clientY);
    if (MG.Parent.isOpen) return;
    if (MG.Parent.onDown(e.pointerId, p.x, p.y)) return;
    if (G.ptr && ((G.ptr.type === 'mouse' && (e.pointerType || 'mouse') === 'mouse') || now() - G.ptr.seen > 8000)) {
      // the browser lost track of the earlier pointer (it happens): let go of it quietly
      var lost = G.ptr; G.ptr = null;
      if (G.board) { G.board.drag = null; G.board.rot = null; if (lost.mode === 'spout') G.board.spoutX = lost.spout0; }
    }
    if (G.ptr) return;                          // one hand at a time: a sibling's finger changes nothing
    var ptr = G.ptr = { id: e.pointerId, type: e.pointerType || 'mouse', sx: e.clientX, sy: e.clientY, x: p.x, y: p.y, tol: tolFor(e.pointerType || 'mouse'), mode: 'none', moved: false, seen: now() };
    if (G.screen === 'play' || G.screen === 'build') { if (G.board) { G.board.idle = 0; boardDown(G.board, ptr); } else if (hitC(L.home, p.x, p.y, ptr.tol)) { ptr.mode = 'ui'; ptr.ui = 'home'; } }
    else if (G.screen === 'home') {
      if (hitC(HOME.play, p.x, p.y, ptr.tol)) { ptr.mode = 'ui'; ptr.ui = 'play'; }
      else if (hitC(HOME.build, p.x, p.y, ptr.tol)) { ptr.mode = 'ui'; ptr.ui = 'build'; }
      else if (hitC(HOME.full, p.x, p.y, ptr.tol)) { ptr.mode = 'ui'; ptr.ui = 'full'; }
      else if (p.y < L.TRAY_TOP && G.demo) { G.demo.go(); G.demoT = 4; }
    } else if (G.screen === 'shelf') shelfDown(ptr);
    if (ptr.mode === 'ui') ptr.pressed = true;
  };
  G.onMove = function (e) {
    var p = G.toWorld(e.clientX, e.clientY), ptr = G.ptr;
    if (MG.Parent.onMove(e.pointerId, p.x, p.y)) return;
    if (!ptr || ptr.id !== e.pointerId) return;
    ptr.x = p.x; ptr.y = p.y; ptr.seen = now();
    if (!ptr.moved && Math.hypot(e.clientX - ptr.sx, e.clientY - ptr.sy) > (ptr.type === 'mouse' ? 6 : 12)) ptr.moved = true;
    if (!ptr.moved) return;
    var b = G.board;
    if (!b) return;
    b.idle = 0;
    if (ptr.mode === 'piece') b.drag = { id: ptr.piece, x: p.x + ptr.gx, y: p.y + ptr.gy, tol: ptr.tol };
    else if (ptr.mode === 'rot' && b.rot) { var pc = b.byId(b.rot.id); if (pc) { b.rot.dragging = true; b.rot.to = b.snapRot(pc, Math.atan2(p.y - pc.y, p.x - pc.x) + (b.rot.side < 0 ? Math.PI : 0)); } }
    else if (ptr.mode === 'spout' && b.mode === 'sandbox') {
      var col = Math.max(0, Math.min(C.COLS - 1, Math.round((p.x - C.GX0) / C.GS)));
      b.spoutX = C.GX0 + col * C.GS; ptr.spoutMoved = true;
    }
  };
  G.onUp = function (e, cancelled) {
    var p = G.toWorld(e.clientX, e.clientY), ptr = G.ptr;
    if (MG.Parent.onUp(e.pointerId)) return;
    if (!ptr || ptr.id !== e.pointerId) return;
    G.ptr = null;
    var b = G.board;
    if (cancelled) { if (b) { b.drag = null; b.rot = null; if (ptr.mode === 'spout') b.spoutX = ptr.spout0; } return; }
    if (ptr.mode === 'ui') return uiAction(ptr, p);
    if (!b) return;
    if (ptr.mode === 'piece') {
      var pc = b.byId(ptr.piece); if (!pc) { b.drag = null; return; }
      if (b.drag) {
        var dx = b.drag.x, dy = b.drag.y, tgt;
        b.drag = null;
        tgt = b.pegNear(dx, dy, ptr.tol, pc.id) || b.anyPegNear(dx, dy, ptr.tol);
        if (tgt && !(pc.placed && pc.x === tgt.x && pc.y === tgt.y)) b.movePiece(pc, tgt.x, tgt.y);
        else if (!tgt && dy > L.TRAY_TOP - 10 && pc.placed) b.toTray(pc);
      } else if (ptr.wasSel && pc.placed && KINDS[pc.k].rstep && G.t - b.selT > 0.35) {
        b.rotatePiece(pc, pc.r + KINDS[pc.k].rstep);   // tapping the piece in your hand turns it one notch
      }
    } else if (ptr.mode === 'rot' && b.rot) {
      var rp = b.byId(b.rot.id), to = b.rot.to; b.rot = null;
      if (rp) b.rotatePiece(rp, to);
    } else if (ptr.mode === 'spout') {
      if (b.mode === 'sandbox' && ptr.spoutMoved) {
        var nx = b.spoutX; b.spoutX = ptr.spout0;
        if (nx !== ptr.spout0) b.mutate(function () { this.spoutX = nx; });
      } else b.go();
    }
  };

  function boardDown(b, ptr) {
    var x = ptr.x, y = ptr.y, tol = ptr.tol, puzzle = b.mode === 'puzzle', i;
    if (hitC(L.home, x, y, tol)) { ptr.mode = 'ui'; ptr.ui = 'home'; return; }
    if (hitC(L.undo, x, y, Math.min(tol, 8))) { ptr.mode = 'ui'; ptr.ui = 'undo'; return; }
    if (hitC(L.redo, x, y, Math.min(tol, 8))) { ptr.mode = 'ui'; ptr.ui = 'redo'; return; }
    if (puzzle && hitC(L.hint, x, y, tol)) { ptr.mode = 'ui'; ptr.ui = 'hint'; return; }
    if (puzzle && G.nextReady() && hitC(L.next, x, y, tol)) { ptr.mode = 'ui'; ptr.ui = 'next'; return; }
    var selP = b.sel ? b.byId(b.sel) : null;
    if (selP && selP.placed && KINDS[selP.k].rstep) {
      var h = b.handlePos(selP);
      if (Math.hypot(x - h.x, y - h.y) <= L.HANDLE_R + tol) {
        ptr.mode = 'rot';
        b.rot = { id: selP.id, to: (selP.r + KINDS[selP.k].rstep) % 12, dragging: false, side: h.side };   // the new direction shows before release
        return;
      }
    }
    if (Math.abs(x - b.spoutX) <= 56 + tol && y <= 84 + tol) { ptr.mode = 'spout'; ptr.spout0 = b.spoutX; return; }
    var hitP = b.pieceNear(x, y, tol);
    var peg = selP ? b.pegNear(x, y, tol, selP.id) : null;
    if (peg && selP.placed && peg.x === selP.x && peg.y === selP.y) peg = null;   // its own peg is not a destination
    if (peg && (!hitP || peg.d <= hitP.d)) { b.movePiece(selP, peg.x, peg.y); return; }   // with a piece in hand, a glowing peg wins a tie
    if (hitP) {
      ptr.mode = 'piece'; ptr.piece = hitP.p.id; ptr.wasSel = b.sel === hitP.p.id;
      // a piece from the tray jumps under the finger; a placed piece keeps the grip it was picked up by
      ptr.gx = hitP.p.placed ? hitP.p.x - x : 0; ptr.gy = hitP.p.placed ? hitP.p.y - y : 0;
      b.select(hitP.p.id);
      return;
    }
    if (selP && selP.placed && y > L.TRAY_TOP) { b.toTray(selP); return; }
    for (i = 0; i < b.fixed.length; i++) {
      if (MG.itemDist(b.fixed[i], x, y) <= tol) { b.fx.wig[b.fixed[i].id] = 1; A.ui('nope'); break; }   // bolted: it shakes its head
    }
    b.sel = null;
  }

  function uiAction(ptr, p) {
    var b = G.board, name = ptr.ui;
    if (name === 'home') {
      if (!hitC(L.home, p.x, p.y, ptr.tol * 1.5)) return;
      A.ui('back');
      if (G.screen === 'build') G.openShelf(); else G.goHome();
    } else if (name === 'undo') { if (b) b.undo(); }
    else if (name === 'redo') { if (b) b.redo(); }
    else if (name === 'hint') { if (b && !b.won) b.showHint(false); }
    else if (name === 'next') { if (G.nextReady()) { A.ui('next'); G.setPuzzle(G.nextPz); } }
    else if (name === 'play') { autoFull(); A.ui('next'); G.startPlay(); }
    else if (name === 'build') { autoFull(); A.ui('next'); G.openShelf(); }
    else if (name === 'full') G.toggleFull();
    else if (name === 'card') {
      var cards = G.shelfCards().cards, i, cd;
      for (i = 0; i < cards.length; i++) {
        cd = cards[i];
        if (cd.type === 'creation' && cd.id === ptr.card && ptr.copy) { var c2 = St.copyCreation(cd.id); A.ui('place'); G.note({ t: 'copy', from: cd.id, id: c2.id }); return G.openBuild(c2, true); }
        if (cd.type === 'creation' && cd.id === ptr.card) { A.ui('pick'); return G.openBuild(St.findCreation(cd.id), false); }
        if (cd.type === 'new' && ptr.card === '+') { A.ui('pick'); return G.openBuild(null, false); }
      }
    } else if (name === 'left') { G.shelfPage--; A.ui('turn'); }
    else if (name === 'right') { G.shelfPage++; A.ui('turn'); }
  }
  function shelfDown(ptr) {
    var x = ptr.x, y = ptr.y, tol = ptr.tol, sh = G.shelfCards(), i, cd;
    if (hitC(L.home, x, y, tol)) { ptr.mode = 'ui'; ptr.ui = 'home'; return; }
    if (sh.pages > 1 && sh.page > 0 && hitC(SHELF.left, x, y, tol)) { ptr.mode = 'ui'; ptr.ui = 'left'; return; }
    if (sh.pages > 1 && sh.page < sh.pages - 1 && hitC(SHELF.right, x, y, tol)) { ptr.mode = 'ui'; ptr.ui = 'right'; return; }
    for (i = 0; i < sh.cards.length; i++) {
      cd = sh.cards[i];
      if (cd.copy && hitC(cd.copy, x, y, Math.min(tol, 10))) { ptr.mode = 'ui'; ptr.ui = 'card'; ptr.card = cd.id; ptr.copy = true; return; }
    }
    for (i = 0; i < sh.cards.length; i++) {
      cd = sh.cards[i];
      if (x >= cd.x - 8 && x <= cd.x + cd.w + 8 && y >= cd.y - 8 && y <= cd.y + cd.h + 8) { ptr.mode = 'ui'; ptr.ui = 'card'; ptr.card = cd.type === 'new' ? '+' : cd.id; return; }
    }
  }

  function autoFull() { if (!G.triedFull && !G.testMode) { G.triedFull = true; G.toggleFull(true); } }
  G.toggleFull = function (onOnly) {
    try {
      var d = root.document, el = d.documentElement;
      if (d.fullscreenElement) { if (!onOnly) d.exitFullscreen(); }
      else if (el.requestFullscreen) { var pr = el.requestFullscreen(); if (pr && pr.catch) pr.catch(function () {}); }
    } catch (e) { /* fullscreen is a nicety */ }
  };

  /* ---------- frame ---------- */
  G.frame = function (ms) {
    if (ms > 100) ms = 100; if (ms < 0) ms = 0;
    var dt = ms / 1000, r, t0;
    G.t += dt; G.frames++;
    if (G.job) {
      t0 = now();
      do { r = G.job.gen.next(); } while (!r.done && (G.manual || now() - t0 < 5));
      if (r.done) { var cb = G.job.done; G.job = null; cb(r.value); }
    }
    if (G.fade > 0) G.fade = Math.max(0, G.fade - dt * 4);
    MG.Parent.update(dt);
    if (G.screen === 'home' && G.demo) {
      G.demoT -= dt;
      if (G.demoT <= 0 && !G.demo.runActive) { G.demo.go(); G.demoT = 5.5; }
      G.demo.update(dt, ms);
    }
    if (G.board) G.board.update(dt, ms);
    if (G.restAt && G.t >= G.restAt && G.screen === 'play') G.goRest();
    if (!G.skipRender) G.render();
  };

  function loop(ts) {
    if (!G.manual) {
      var ms = G.lastTs ? ts - G.lastTs : 16.7, t0 = now();
      G.frame(ms);
      if (G.frameStats) { G.frameStats.gap.push(ms); G.frameStats.work.push(now() - t0); }
    }
    G.lastTs = ts;
    root.requestAnimationFrame(loop);
  }

  /* ---------- drawing ---------- */
  function drawBg(ctx) {
    var v = G.view;
    ctx.setTransform(v.dpr, 0, 0, v.dpr, 0, 0);
    ctx.fillStyle = G.screen === 'rest' ? PAL.night : PAL.bg; ctx.fillRect(0, 0, v.w, v.h);
    ctx.setTransform(v.scale * v.dpr, 0, 0, v.scale * v.dpr, v.ox * v.dpr, v.oy * v.dpr);
  }
  function panel(ctx) {
    R.rr(ctx, 24, 16, C.W - 48, 824, 40); ctx.fillStyle = PAL.panel; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = PAL.dot; ctx.stroke();
  }
  function handIcon(ctx, c, glow) {
    R.button(ctx, c.x, c.y, c.r, { glow: glow, fill: glow ? PAL.glow : PAL.white });
    ctx.save(); ctx.translate(c.x, c.y); ctx.scale(0.46, 0.46); R.hand(ctx, -6, -58, 0, 1); ctx.restore();
  }
  G.render = function () {
    var ctx = G.ctx, b = G.board, t = G.t;
    drawBg(ctx);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (G.screen === 'home') drawHome(ctx);
    else if (G.screen === 'shelf') drawShelf(ctx);
    else if (G.screen === 'rest') drawRest(ctx);
    else {
      panel(ctx);
      if (b) b.draw(ctx);
      // the three small fixed controls: home, history (undo|redo), hint
      R.button(ctx, L.home.x, L.home.y, L.home.r); R.icon(ctx, 'home', L.home.x, L.home.y, 44);
      if (b) {
        R.rr(ctx, L.undo.x - 50, L.undo.y - 46, 192, 92, 46); ctx.fillStyle = PAL.white; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = PAL.ink; ctx.stroke();
        R.icon(ctx, 'undo', L.undo.x, L.undo.y, 40, { alpha: b.undoStack.length ? 1 : 0.25 });
        R.icon(ctx, 'redo', L.redo.x, L.redo.y, 40, { alpha: b.redoStack.length ? 1 : 0.25 });
        if (b.mode === 'puzzle') {
          var glow = b.hintGlow() ? 0.5 + 0.5 * Math.sin(t * 2.4) : 0;
          handIcon(ctx, L.hint, glow);
          if (G.nextReady()) {
            var k = Math.min(1, (t - b.wonT - 1.3) * 3), s = k * (1 + 0.04 * Math.sin(t * 3));
            ctx.save(); ctx.translate(L.next.x, L.next.y); ctx.scale(s, s);
            R.button(ctx, 0, 0, L.next.r, { glow: 0.5 + 0.5 * Math.sin(t * 3), fill: PAL.glow, lw: 5 });
            R.icon(ctx, 'next', 4, 0, 62);
            ctx.restore();
          }
        }
      }
    }
    MG.Parent.draw(ctx);
    if (G.fade > 0) { ctx.globalAlpha = G.fade * 0.9; ctx.fillStyle = G.screen === 'rest' ? PAL.night : PAL.bg; ctx.fillRect(-2000, -2000, 6000, 6000); ctx.globalAlpha = 1; }
  };

  function drawHome(ctx) {
    var t = G.t, s;
    panel(ctx);
    if (G.demo) G.demo.draw(ctx);
    // play: the big one
    s = 1 + 0.035 * Math.sin(t * 2.6);
    ctx.save(); ctx.translate(HOME.play.x, HOME.play.y); ctx.scale(s, s);
    R.button(ctx, 0, 0, HOME.play.r, { fill: PAL.glow, lw: 6 }); R.icon(ctx, 'play', 5, 0, 74, { fill: PAL.marble });
    ctx.restore();
    // build: a little board with pieces and a plus
    R.button(ctx, HOME.build.x, HOME.build.y, HOME.build.r, { lw: 6 });
    ctx.save(); ctx.translate(HOME.build.x - 12, HOME.build.y + 4); ctx.scale(0.42, 0.42);
    R.piece(ctx, { k: 'plank', x: -10, y: -40, r: 1 }, { noPeg: true }); R.piece(ctx, { k: 'bouncer', x: 20, y: 62, r: 0 }, { noPeg: true });
    ctx.restore();
    R.disc(ctx, HOME.build.x + 40, HOME.build.y - 34, 21, PAL.white, PAL.ink, 4); R.icon(ctx, 'plus', HOME.build.x + 40, HOME.build.y - 34, 22);
    R.button(ctx, HOME.full.x, HOME.full.y, HOME.full.r); R.icon(ctx, 'full', HOME.full.x, HOME.full.y, 36);
  }

  function thumbFor(c) {
    var th = G.thumbs[c.id], key = c.updated + ':' + c.pieces.length;
    if (!th || th.key !== key) { th = G.thumbs[c.id] = { key: key, canvas: R.thumb(root.document.createElement('canvas'), c, 480, 300) }; }
    return th.canvas;
  }
  G.thumbFor = thumbFor;
  function drawShelf(ctx) {
    var sh = G.shelfCards(), i, cd, t = G.t;
    // shelves
    for (i = 0; i < SHELF.rows; i++) { var sy = SHELF.y0 + i * (SHELF.h + SHELF.gap + 20) + SHELF.h + 10; R.rr(ctx, 40, sy, C.W - 80, 22, 10); ctx.fillStyle = PAL.plank; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = PAL.ink; ctx.stroke(); }
    for (i = 0; i < sh.cards.length; i++) {
      cd = sh.cards[i];
      R.rr(ctx, cd.x, cd.y, cd.w, cd.h, 22); ctx.fillStyle = PAL.panel; ctx.fill();
      if (cd.type === 'creation') {
        ctx.save(); R.rr(ctx, cd.x, cd.y, cd.w, cd.h, 22); ctx.clip();
        ctx.drawImage(thumbFor(cd.c), cd.x, cd.y + (cd.h - cd.w * 300 / 480) / 2, cd.w, cd.w * 300 / 480);
        ctx.restore();
        R.rr(ctx, cd.x, cd.y, cd.w, cd.h, 22); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.stroke();
        R.button(ctx, cd.copy.x, cd.copy.y, cd.copy.r); R.icon(ctx, 'copy', cd.copy.x - 2, cd.copy.y - 2, 34);
      } else {
        ctx.save(); ctx.setLineDash([14, 14]); R.rr(ctx, cd.x, cd.y, cd.w, cd.h, 22); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.stroke(); ctx.restore();
        var s = 1 + 0.05 * Math.sin(t * 2.6);
        R.disc(ctx, cd.x + cd.w / 2, cd.y + cd.h / 2, 58 * s, PAL.glow, PAL.ink, 5); R.icon(ctx, 'plus', cd.x + cd.w / 2, cd.y + cd.h / 2, 56 * s);
      }
    }
    if (sh.pages > 1) {
      if (sh.page > 0) { R.button(ctx, SHELF.left.x, SHELF.left.y, SHELF.left.r); R.icon(ctx, 'left', SHELF.left.x, SHELF.left.y, 50); }
      if (sh.page < sh.pages - 1) { R.button(ctx, SHELF.right.x, SHELF.right.y, SHELF.right.r); R.icon(ctx, 'right', SHELF.right.x, SHELF.right.y, 50); }
      for (i = 0; i < sh.pages; i++) R.disc(ctx, 800 + (i - (sh.pages - 1) / 2) * 30, 920, i === sh.page ? 9 : 6, i === sh.page ? PAL.ink : PAL.soft);
    }
    R.button(ctx, L.home.x, L.home.y, L.home.r); R.icon(ctx, 'home', L.home.x, L.home.y, 44);
  }

  /** The resting scene: the marbles have rolled home. Nothing to do here, on purpose. */
  function drawRest(ctx) {
    var t = G.t - G.restT, i, br = 1 + 0.03 * Math.sin(G.t * 1.2);
    ctx.fillStyle = PAL.nightHi;
    ctx.beginPath(); ctx.ellipse(800, 1080, 1100, 330, 0, 0, TAU); ctx.fill();
    R.disc(ctx, 1240, 220, 74, '#f6edc8'); R.disc(ctx, 1272, 200, 64, PAL.night);
    for (i = 0; i < 9; i++) R.disc(ctx, 180 + i * 163 + 40 * Math.sin(i * 7.3), 130 + 90 * Math.abs(Math.sin(i * 3.1)), 4 + (i % 3), '#f6edc8');
    // the cup, tucked in, with three marbles breathing slowly
    ctx.save(); ctx.translate(800, 660); ctx.scale(1.7, 1.7);
    var xs = [-26, 26, 0], ys = [18, 18, -14], arrive = Math.min(1, t / 2.2);
    for (i = 0; i < 3; i++) {
      var k = Math.max(0, Math.min(1, arrive * 3 - i)), e = k * k * (3 - 2 * k);
      ctx.save(); ctx.translate(-520 * (1 - e) + xs[i], ys[i] - Math.sin(e * Math.PI) * 60); ctx.scale(br, 2 - br);
      R.disc(ctx, 0, 0, 18.5, PAL.marble, PAL.ink, 3);
      ctx.beginPath(); ctx.arc(-6, -2, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.moveTo(10, -2); ctx.arc(6, -2, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.lineWidth = 2.5; ctx.strokeStyle = PAL.marbleHi; ctx.stroke();
      ctx.restore();
    }
    R.piece(ctx, { k: 'cup', x: 0, y: 0 }, { full: true });
    ctx.restore();
    for (i = 0; i < 3; i++) { var u = ((G.t * 0.16 + i / 3) % 1); R.disc(ctx, 900 + u * 60 + 14 * Math.sin(u * 9), 540 - u * 170, 5 + u * 9, null, '#aab6d6', 3); }
  }

  /* ---------- boot ---------- */
  G.init = function () {
    var d = root.document, cv = G.canvas = d.getElementById('game');
    G.ctx = cv.getContext('2d');
    G.testMode = /test/.test(root.location.hash || '');
    St.load();
    A.setVolume(St.data.settings.volume);
    G.resize();
    root.addEventListener('resize', G.resize);
    cv.addEventListener('pointerdown', function (e) { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* fine */ } G.onDown(e); });
    cv.addEventListener('pointermove', function (e) { G.onMove(e); });
    cv.addEventListener('pointerup', function (e) { G.onUp(e, false); });
    cv.addEventListener('pointercancel', function (e) { G.onUp(e, true); });
    cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    // no accidental zooming or selecting while small hands explore
    root.addEventListener('wheel', function (e) { if (!MG.Parent.isOpen) e.preventDefault(); }, { passive: false });
    d.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    d.addEventListener('dblclick', function (e) { if (!MG.Parent.isOpen) e.preventDefault(); });
    d.addEventListener('visibilitychange', function () { G.lastTs = 0; });
    G.goHome();
    G.fade = 0;
    root.requestAnimationFrame(loop);
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
