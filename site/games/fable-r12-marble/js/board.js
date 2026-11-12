/* The board: pieces, selection, undo, runs of the shared simulation, hints and
 * the effects that make it feel like a toy. Used by puzzles, the sandbox and
 * the little demo on the home screen. */
(function (root) {
  'use strict';
  var MG = root.MG, C = MG.C, R = MG.R, PAL = MG.PAL, S = MG.Solver, A = MG.Audio, KINDS = MG.KINDS;
  var TAU = Math.PI * 2;

  var L = MG.Layout = {
    TRAY_Y: 920, TRAY_TOP: 852, SLOT: 225, PEG_R: 22, HANDLE_R: 36,
    HANDLE_D: { plank: 142, bouncer: 114, curve: 142 },
    home: { x: 64, y: 64, r: 42 }, hint: { x: C.W - 64, y: 64, r: 46 },
    undo: { x: 70, y: 920, r: 40 }, redo: { x: 162, y: 920, r: 40 },
    next: { x: 1400, y: 916, r: 62 },
    SAND_KINDS: ['plank', 'bouncer', 'curve', 'cup', 'bell'], MAX_PIECES: 30, MAX_MARBLES: 12
  };

  function Board(mode, pz, game) {
    this.mode = mode;                 // 'puzzle' | 'sandbox' | 'demo'
    this.pz = pz; this.game = game;
    this.spoutX = pz.spoutX;
    this.pieces = []; this.nid = 0;
    this.sel = null; this.selT = 0;
    this.undoStack = []; this.redoStack = [];
    this.world = null; this.windup = 0; this.queue = 0; this.acc = 0; this.evI = 0;
    this.runActive = false; this.trail = null; this.live = [];
    this.won = false; this.wonT = 0; this.fails = 0; this.runs = 0; this.failsAtHint = 0;
    this.hint = null; this.hintCount = 0; this.idle = 0; this.age = 0; this.changes = 0;
    this.found = {}; this.foundN = 0; this.flowers = []; this.bonus = { bell: 0, thrift: 0 };
    this.bellRung = {};
    this.drag = null; this.rot = null;
    this.fx = { bump: {}, msq: {}, parts: [], bell: {}, spoutSq: 0, wig: {}, reload: 0, cupFull: false, happy: 0 };
    this.fixed = [];
    var i, t;
    for (i = 0; i < pz.fixed.length; i++) { t = pz.fixed[i]; this.fixed.push({ id: 'f' + i, k: t.k, x: t.x, y: t.y, r: t.r || 0, w: t.w, h: t.h }); }
    for (i = 0; i < pz.tray.length; i++) {
      t = pz.tray[i];
      this.pieces.push({ id: 'p' + (this.nid++), k: t.k, r: t.r || 0, placed: t.x !== undefined, x: t.x || 0, y: t.y || 0, slot: i, ax: 0, ay: 0, ar: (t.r || 0) });
    }
    if (mode === 'sandbox') this.normalizeSandbox();
    if (pz.selectFirst && this.pieces.length) this.sel = this.pieces[0].id;   // tutorial: the handle is already showing
    for (i = 0; i < this.pieces.length; i++) { var q = this.target(this.pieces[i]); this.pieces[i].ax = q.x; this.pieces[i].ay = q.y; }
  }
  MG.Board = Board;
  var P = Board.prototype;

  /* ---------- geometry ---------- */
  P.slotX = function (p) {
    if (this.mode === 'sandbox') return 800 + (L.SAND_KINDS.indexOf(p.k) - 2) * L.SLOT;
    var n = this.pz.tray.length;
    return 800 + (p.slot - (n - 1) / 2) * L.SLOT;
  };
  P.target = function (p) {
    if (p.placed) return { x: p.x, y: p.y };
    // in the tray each piece sits centred on its slot (the slide's peg is off its middle)
    var c = p.k === 'curve' ? -9 : 0, a = (p.r || 0) * Math.PI / 6;
    return { x: this.slotX(p) + (p.k === 'curve' ? c * (Math.cos(a) + Math.sin(a)) : 0), y: L.TRAY_Y + (p.k === 'bell' ? 8 : 0) + (p.k === 'curve' ? c * (Math.sin(a) - Math.cos(a)) : 0) };
  };
  P.byId = function (id) { for (var i = 0; i < this.pieces.length; i++) if (this.pieces[i].id === id) return this.pieces[i]; return null; };
  P.placedPieces = function () { var o = [], i; for (i = 0; i < this.pieces.length; i++) if (this.pieces[i].placed) o.push(this.pieces[i]); return o; };
  P.pieceAt = function (x, y, except) { for (var i = 0; i < this.pieces.length; i++) { var p = this.pieces[i]; if (p.placed && p.x === x && p.y === y && p.id !== except) return p; } return null; };
  P.spec = function () { var s = S.spec(this.pz, this.placedPieces()); s.spoutX = this.spoutX; return s; };
  /** The handle normally sits ahead of the piece (where its arrow points). If that spot would
   *  cover the dispenser, a corner button or the tray, it sits at the tail instead. */
  P.handleBlocked = function (x, y) {
    if (x < 44 || x > C.W - 44 || y < 44 || y > L.TRAY_TOP - 12) return true;
    if (Math.abs(x - this.spoutX) < 56 + L.HANDLE_R + 18 && y < 84 + L.HANDLE_R + 18) return true;
    if (Math.hypot(x - L.home.x, y - L.home.y) < L.home.r + L.HANDLE_R + 12) return true;
    if (this.mode === 'puzzle' && Math.hypot(x - L.hint.x, y - L.hint.y) < L.hint.r + L.HANDLE_R + 12) return true;
    return false;
  };
  P.handleSide = function (p, r) {
    if (this.rot && this.rot.id === p.id && this.rot.side) return this.rot.side;   // never jumps mid-gesture
    var a = r * Math.PI / 6, d = L.HANDLE_D[p.k] || 120, cx = Math.cos(a) * d, cy = Math.sin(a) * d;
    if (!this.handleBlocked(p.x + cx, p.y + cy)) return 1;
    if (!this.handleBlocked(p.x - cx, p.y - cy)) return -1;
    return 1;
  };
  P.handlePos = function (p, r) {
    if (r === undefined) r = p.r;
    var a = r * Math.PI / 6, d = L.HANDLE_D[p.k] || 120, side = this.handleSide(p, r);
    return { x: p.x + side * Math.cos(a) * d, y: p.y + side * Math.sin(a) * d, a: a, side: side };
  };
  P.freePegs = function (except) {
    var out = [], i, g;
    for (i = 0; i < this.pz.pegs.length; i++) { g = this.pz.pegs[i]; if (!this.pieceAt(g[0], g[1], except)) out.push(g); }
    return out;
  };
  /** Nearest open, free peg whose visible disc is within tol of the point. */
  P.pegNear = function (x, y, tol, except) {
    var pegs = this.freePegs(except), best = null, bd = 1e9, i, d;
    for (i = 0; i < pegs.length; i++) { d = Math.hypot(pegs[i][0] - x, pegs[i][1] - y) - L.PEG_R; if (d < bd) { bd = d; best = pegs[i]; } }
    return best && bd <= tol ? { x: best[0], y: best[1], d: Math.max(0, bd) } : null;
  };
  P.anyPegNear = function (x, y, tol) {
    var best = null, bd = 1e9, i, d, g;
    for (i = 0; i < this.pz.pegs.length; i++) { g = this.pz.pegs[i]; d = Math.hypot(g[0] - x, g[1] - y) - L.PEG_R; if (d < bd) { bd = d; best = g; } }
    return best && bd <= tol ? { x: best[0], y: best[1] } : null;
  };
  /** Nearest movable piece whose visible shape is within tol. */
  P.pieceNear = function (x, y, tol) {
    var best = null, bd = 1e9, i, p, d;
    for (i = 0; i < this.pieces.length; i++) {
      p = this.pieces[i];
      if (p.placed) d = MG.itemDist(p, x, y);
      else { var sx = this.slotX(p); d = Math.max(Math.abs(x - sx) - 100, (L.TRAY_TOP + 6) - y, 0); }
      if (d < bd) { bd = d; best = p; }
    }
    return best && bd <= tol ? { p: best, d: bd } : null;
  };

  /* ---------- arrangement, undo/redo (K4) ---------- */
  P.snapshot = function () {
    var a = [], i, p;
    for (i = 0; i < this.pieces.length; i++) { p = this.pieces[i]; a.push({ id: p.id, k: p.k, x: p.x, y: p.y, r: p.r, placed: p.placed, slot: p.slot }); }
    return { pieces: a, spoutX: this.spoutX, nid: this.nid };
  };
  P.restore = function (snap) {
    var old = {}, i, s, p;
    for (i = 0; i < this.pieces.length; i++) old[this.pieces[i].id] = this.pieces[i];
    this.pieces = [];
    for (i = 0; i < snap.pieces.length; i++) {
      s = snap.pieces[i]; p = old[s.id];
      var q = { id: s.id, k: s.k, x: s.x, y: s.y, r: s.r, placed: s.placed, slot: s.slot, ax: 0, ay: 0, ar: s.r };
      if (p) { q.ax = p.ax; q.ay = p.ay; q.ar = p.ar; } else { var t = this.target(q); q.ax = t.x; q.ay = t.y; }
      this.pieces.push(q);
    }
    this.spoutX = snap.spoutX; this.nid = Math.max(this.nid, snap.nid);
    if (this.sel && !this.byId(this.sel)) this.sel = null;
  };
  /** Every change to the arrangement goes through here. */
  P.mutate = function (fn) {
    var before = this.snapshot();
    fn.call(this);
    if (this.mode === 'sandbox') this.normalizeSandbox();
    this.undoStack.push(before);
    if (this.undoStack.length > 20) this.undoStack.shift();
    this.redoStack.length = 0;
    this.changed();
  };
  P.undo = function () {
    if (!this.undoStack.length) return false;
    this.redoStack.push(this.snapshot());
    this.restore(this.undoStack.pop());
    this.changed(); A.ui('undo'); return true;
  };
  P.redo = function () {
    if (!this.redoStack.length) return false;
    this.undoStack.push(this.snapshot());
    this.restore(this.redoStack.pop());
    this.changed(); A.ui('redo'); return true;
  };
  P.changed = function () {
    this.changes++; this.hint = null; this.drag = null; this.rot = null;
    if (this.mode === 'sandbox') {
      if (this.world) this.world.setItems(this.spec().items), this.world.spoutX = this.spoutX;
      this.game.sandboxChanged(this);
    } else {
      // a run belongs to one arrangement: touching the board calls the marble home
      if (this.world && this.runActive) this.recall(false);
      this.world = null; this.runActive = false; this.windup = 0;
    }
  };
  P.normalizeSandbox = function () {
    var have = {}, i, p, keep = [], placed = 0;
    for (i = 0; i < this.pieces.length; i++) if (this.pieces[i].placed) placed++;
    for (i = 0; i < this.pieces.length; i++) {
      p = this.pieces[i];
      if (p.placed) { keep.push(p); continue; }
      if (have[p.k]) { if (this.sel === p.id) this.sel = null; continue; }   // a piece put back melts into its box
      have[p.k] = 1; keep.push(p);
    }
    this.pieces = keep;
    for (i = 0; i < L.SAND_KINDS.length; i++) {
      var k = L.SAND_KINDS[i];
      if (!have[k]) {
        p = { id: 'p' + (this.nid++), k: k, r: 0, placed: false, x: 0, y: 0, slot: i, ax: 0, ay: 0, ar: 0 };
        p.ax = this.slotX(p); p.ay = L.TRAY_Y + 90;
        this.pieces.push(p);
      }
    }
    this.full = placed >= L.MAX_PIECES;
  };

  P.select = function (id) {
    if (this.sel !== id) { this.sel = id; this.selT = this.game.t; if (id) A.ui('pick'); }
  };
  P.movePiece = function (p, x, y) {
    if (this.mode === 'sandbox' && !p.placed && this.full) { this.fx.wig[p.id] = 1; A.ui('nope'); return false; }
    var other = this.pieceAt(x, y, p.id), from = { placed: p.placed, x: p.x, y: p.y };
    this.mutate(function () {
      if (other) { other.placed = from.placed; other.x = from.x; other.y = from.y; }   // swap rather than stack
      p.placed = true; p.x = x; p.y = y;
    });
    this.fx.bump[p.id] = 0.8; A.ui('place');
    this.game.note({ t: 'move', id: p.id, x: x, y: y });
    return true;
  };
  P.toTray = function (p) {
    if (!p.placed) return false;
    this.mutate(function () { p.placed = false; });
    A.ui('back');
    if (!this.byId(p.id)) this.sel = null;
    this.game.note({ t: 'tray', id: p.id });
    return true;
  };
  P.rotatePiece = function (p, r) {
    r = ((r % 12) + 12) % 12;
    if (r === p.r) return false;
    var fromAr = p.ar;
    this.mutate(function () { p.r = r; });
    // turn the short way round on screen
    while (p.r - fromAr > 6) fromAr += 12;
    while (p.r - fromAr < -6) fromAr -= 12;
    p.ar = fromAr;
    A.ui('turn');
    this.game.note({ t: 'rotate', id: p.id, r: r });
    return true;
  };
  P.snapRot = function (p, ang) {
    var st = KINDS[p.k].rstep || 1, v = Math.round(ang / (Math.PI / 6) / st) * st;
    return ((v % 12) + 12) % 12;
  };

  /* ---------- runs ---------- */
  P.go = function () {
    this.hint = null;
    if (this.mode !== 'sandbox') {
      if (this.world && this.runActive) this.recall(true);
      this.world = new MG.World(this.spec());
      this.evI = 0; this.live = []; this.trail = null; this.bellRung = {};
      this.windup = 10; this.queue = 1; this.runActive = true; this.runs++;
      this.fx.cupFull = false;
    } else {
      if (!this.world) { this.world = new MG.World(this.spec()); this.evI = 0; }
      var act = 0, i, ms = this.world.marbles;
      for (i = 0; i < ms.length; i++) if (ms[i].state === 1 || ms[i].state === 2) act++;
      if (act + this.queue >= L.MAX_MARBLES) { for (i = 0; i < ms.length; i++) if (ms[i].state === 1 || ms[i].state === 2) { this.poof(ms[i]); ms[i].state = 3; break; } }
      this.queue++; if (this.windup <= 0) this.windup = 10;
      this.runActive = true; this.runs++;
    }
    this.fx.spoutSq = 1; this.fx.reload = 0;
    A.ui('drop');
    this.game.note({ t: 'go', run: this.runs });
  };
  P.poof = function (m) {
    for (var i = 0; i < 7; i++) { var a = i * TAU / 7; this.fx.parts.push({ x: m.x, y: Math.min(m.y, C.FLOOR_Y - 6), vx: Math.cos(a) * 70, vy: Math.sin(a) * 70 - 20, life: 0.45, max: 0.45, kind: 'puff', col: PAL.marbleHi, s: 9 }); }
  };
  P.recall = function (quiet) {
    var ms = this.world ? this.world.marbles : [], i;
    for (i = 0; i < ms.length; i++) if (ms[i].state === 1) { this.poof(ms[i]); ms[i].state = 3; }
    this.runActive = false; this.fx.reload = 0.25;
    if (!quiet) A.ui('home');
  };

  P.advance = function (ms) {
    if (!this.world || !this.runActive && this.mode !== 'sandbox' && !this.settling()) return;
    this.acc += ms;
    var n = 0;
    while (this.acc >= C.STEP_MS - 1e-6 && n < 10) { this.acc -= C.STEP_MS; n++; this.tick(); if (!this.world) break; }
    if (n >= 10) this.acc = 0;
  };
  P.settling = function () {   // after a win the marble keeps settling in the cup
    var ms = this.world ? this.world.marbles : [];
    for (var i = 0; i < ms.length; i++) if (ms[i].state === 2) return true;
    return false;
  };
  P.tick = function () {
    var w = this.world, i, m;
    if (this.queue > 0) {
      this.windup--;
      if (this.windup <= 0) { w.addMarble(0); this.queue--; this.windup = this.queue > 0 ? 16 : 0; }
    }
    w.stepOnce();
    if (this.mode !== 'sandbox' && this.runActive && w.marbles.length && (w.step % 3) === 0) { m = w.marbles[0]; if (m.state === 1) this.live.push(m.x, m.y); }
    this.consume();
    if (this.mode === 'sandbox') {
      var alive = 0;
      for (i = 0; i < w.marbles.length; i++) {
        m = w.marbles[i];
        if (m.state === 2 && w.step - m.caughtAt > 110) { m.state = 3; this.fx.parts.push({ x: m.x, y: m.y, vx: 0, vy: -60, life: 0.4, max: 0.4, kind: 'puff', col: PAL.marbleHi, s: 12 }); }
        // in the sandbox a marble may lie around for a while before it goes home
        if (m.state === 4) { if (m.naps) { this.poof(m); m.state = 3; } else { m.naps = 1; m.state = 1; m.rest = -480; } }
        if (m.state === 5) { if (m.laps >= 2) { this.poof(m); m.state = 3; } else { m.laps = (m.laps || 0) + 1; m.state = 1; m.age = 0; } }
        if (m.state === 1 || m.state === 2) alive++;
      }
      if (!alive && this.queue <= 0) { this.runActive = false; if (w.marbles.length > 40) { this.world = null; } }
    }
  };
  function pitchOf(b, id) {
    var it = b.byId(id), i;
    if (!it) for (i = 0; i < b.fixed.length; i++) if (b.fixed[i].id === id) it = b.fixed[i];
    if (!it) return 0;
    return Math.round(it.x / 100) + Math.round((800 - it.y) / 100);
  }
  P.consume = function () {
    var ev = this.world.events, e, i, fx = this.fx, m;
    for (; this.evI < ev.length; this.evI++) {
      e = ev[this.evI];
      if (e.t === 'hit') {
        fx.bump[e.o] = Math.max(fx.bump[e.o] || 0, Math.min(1, e.v / 650));
        fx.msq[e.m] = { a: Math.min(1, e.v / 850), nx: e.nx, ny: e.ny };
        A.hit(e.mat, e.v, pitchOf(this, e.o));
        if (e.v > 560 && fx.parts.length < 70) for (i = 0; i < 3; i++) fx.parts.push({ x: e.x, y: e.y, vx: (i - 1) * 60 - e.ny * 40, vy: -40 - 20 * i, life: 0.3, max: 0.3, kind: 'puff', col: PAL.dot, s: 6 });
      } else if (e.t === 'clack') {
        fx.msq[e.m] = { a: Math.min(1, e.v / 850), nx: e.nx, ny: e.ny };
        A.hit('glass', e.v, 0);
      } else if (e.t === 'bell') {
        fx.bell[e.o] = { t: 0, a: Math.min(1, 0.35 + e.v / 1200) * (e.x < this.worldMarbleX(e.m) ? 1 : -1) };
        this.bellRung[e.o] = true;
        A.bell(pitchOf(this, e.o), Math.min(1, 0.4 + e.v / 1500));
        this.game.note({ t: 'bell', id: e.o });
      } else if (e.t === 'caught') {
        fx.bump[e.o] = 1; A.hit('cup', 500, 0);
        m = this.world.marbles[e.m]; if (m) m.caughtAt = this.world.step;
        if (this.mode === 'puzzle') this.win(m, e.o);
        else this.cheer(e.x, e.y, 10);
      } else if (e.t === 'out') {
        if (this.mode !== 'sandbox') { if (this.runActive) this.fail(e, true); } else A.ui('plop');
        if (e.y > C.FLOOR_Y && fx.parts.length < 70) for (i = 0; i < 5; i++) fx.parts.push({ x: e.x, y: C.FLOOR_Y - 4, vx: (i - 2) * 45, vy: -90 - 12 * (i % 3), life: 0.4, max: 0.4, kind: 'puff', col: PAL.dot, s: 7 });
      } else if (e.t === 'rest' || e.t === 'timeout') {
        if (this.mode !== 'sandbox' && this.runActive) { m = this.world.marbles[e.m]; if (m) this.poof(m); this.fail(e, false); }
      }
    }
  };
  P.worldMarbleX = function (id) { var m = this.world && this.world.marbles[id]; return m ? m.x : 0; };

  P.fail = function (e, fell) {
    this.runActive = false;
    this.trail = this.live; this.live = [];
    this.fx.reload = 0.35;
    if (this.mode === 'puzzle') { this.fails++; this.game.note({ t: 'fail', end: e.t, fails: this.fails }); }
    A.ui(fell ? 'plop' : 'home');
  };

  P.cheer = function (x, y, n) {
    var cols = ['#f7a8c4', '#ffd76a', '#9bd3f0', '#b9e4a0', '#ffffff'], i;
    for (i = 0; i < n && this.fx.parts.length < 90; i++) {
      var a = -Math.PI / 2 + (i / (n - 1 || 1) - 0.5) * 2.2;
      this.fx.parts.push({ x: x, y: y - 30, vx: Math.cos(a) * (120 + 23 * (i % 5)), vy: Math.sin(a) * (300 + 31 * (i % 4)), life: 2.2, max: 2.2, kind: 'petal', col: cols[i % cols.length], s: 9 + (i % 3) * 2, rot: i });
    }
  };

  P.win = function (m, cupId) {
    var placed = this.placedPieces(), tp = S.touchedOnly(placed, { touched: m.touched }), key = S.key(tp);
    var isNew = !this.found[key], first = !this.won, cup = S.cupOf(this.pz), pz = this.pz, i, any = false;
    this.runActive = false; this.won = true; this.wonT = this.game.t;
    this.trail = this.live; this.live = [];
    this.fx.cupFull = true; this.fx.happy = 1;
    for (i = 0; i < tp.length; i++) { var hp = this.pieceAt(tp[i].x, tp[i].y, null); if (hp) this.fx.bump[hp.id] = 0.7; }
    // the same celebration for every valid solution (K6)
    this.cheer(cup.x, cup.y - 40, 26);
    A.celebrate();
    this.game.note({ t: 'celebrate', pz: pz.id, fx: 'petals+chime' });
    if (isNew) {
      this.found[key] = 1; this.foundN++;
      if (this.flowers.length < 5) this.flowers.push({ g: 0, i: this.flowers.length });
      if (!first) { A.ui('flower'); this.game.note({ t: 'newway', n: this.foundN }); }
    }
    // quiet extras for grown-ups: they never block anything
    for (i in this.bellRung) any = true;
    if (pz.secret && pz.secret.bell && any && !this.bonus.bell) { this.bonus.bell = this.game.t; A.ui('flutter'); this.game.note({ t: 'bonus', kind: 'bell' }); }
    if (pz.secret && pz.secret.thrift && placed.length <= pz.secret.par && !this.bonus.thrift) { this.bonus.thrift = this.game.t; A.ui('flutter'); this.game.note({ t: 'bonus', kind: 'thrift' }); }
    this.game.solved(this, first);
  };

  /* ---------- hints (K5) ---------- */
  P.showHint = function (auto) {
    if (this.mode !== 'puzzle') return null;
    var act = S.nextAction(this.pz, this.pieces);
    this.hint = { act: act, t: 0, auto: !!auto };
    this.hintCount++; this.failsAtHint = this.fails; this.idle = 0;
    if (!auto) A.ui('hint');
    this.game.note({ t: 'hint', auto: !!auto, act: act });
    return act;
  };
  P.hintGlow = function () {
    if (this.mode !== 'puzzle' || this.won) return 0;
    return (this.fails - this.failsAtHint >= 2 || this.sinceProgress() > 32) ? 1 : 0;
  };
  P.sinceProgress = function () { return this.age - (this.hintAge || 0); };

  /* ---------- per-frame update ---------- */
  P.update = function (dt, ms) {
    var i, p, fx = this.fx, k, t;
    this.age += dt; this.idle += dt;
    this.advance(ms);
    for (i = 0; i < this.pieces.length; i++) {
      p = this.pieces[i];
      if (this.drag && this.drag.id === p.id) { p.ax = this.drag.x; p.ay = this.drag.y; continue; }
      t = this.target(p);
      k = Math.min(1, dt * 20);
      p.ax += (t.x - p.ax) * k; p.ay += (t.y - p.ay) * k;
      p.ar += (p.r - p.ar) * Math.min(1, dt * 22);
      if (Math.abs(p.r - p.ar) < 0.01) p.ar = p.r;
    }
    for (k in fx.bump) { fx.bump[k] -= dt * 5; if (fx.bump[k] <= 0) delete fx.bump[k]; }
    for (k in fx.msq) { fx.msq[k].a -= dt * 7; if (fx.msq[k].a <= 0) delete fx.msq[k]; }
    for (k in fx.wig) { fx.wig[k] -= dt * 2.5; if (fx.wig[k] <= 0) delete fx.wig[k]; }
    for (k in fx.bell) { fx.bell[k].t += dt; if (fx.bell[k].t > 2.2) delete fx.bell[k]; }
    if (fx.spoutSq > 0) fx.spoutSq = Math.max(0, fx.spoutSq - dt * 6);
    if (fx.reload > 0) fx.reload = Math.max(0, fx.reload - dt);
    if (fx.happy > 0) fx.happy = Math.max(0, fx.happy - dt * 0.5);
    for (i = fx.parts.length - 1; i >= 0; i--) {
      p = fx.parts[i]; p.life -= dt;
      if (p.life <= 0) { fx.parts.splice(i, 1); continue; }
      if (p.kind === 'petal') { p.vy += 420 * dt; p.vx *= 1 - 1.2 * dt; if (p.vy > 90) p.vy = 90; p.rot += dt * 3; }
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
    for (i = 0; i < this.flowers.length; i++) if (this.flowers[i].g < 1) this.flowers[i].g = Math.min(1, this.flowers[i].g + dt * 1.6);
    if (this.hint) {
      this.hint.t += dt;
      if (this.hint.t > 7.5) { this.hint = null; this.hintAge = this.age; }
    }
    // rolling rumble
    if (this.mode !== 'demo') {
      var rv = 0, rm = 0, ms2 = this.world ? this.world.marbles : [];
      for (i = 0; i < ms2.length; i++) if (ms2[i].state === 1 && ms2[i].rollV > rv) { rv = ms2[i].rollV; rm = ms2[i].rollMat; }
      A.roll(rv, rm);
    }
    // long inactivity with nothing changing: offer the single next action
    if (this.mode === 'puzzle' && !this.won && !this.hint && !this.runActive && !this.drag && !this.rot && this.idle > this.game.idleHintAfter()) this.showHint(true);
  };

  /* ---------- drawing ---------- */
  P.draw = function (ctx) {
    var g = this.game, t = g.t, i, p, fx = this.fx, pz = this.pz, selP = this.sel ? this.byId(this.sel) : null;
    var picking = !!(selP || this.drag);
    var pulse = 0.5 + 0.5 * Math.sin(t * 4.2);
    // lattice (quiet) and open pegs (inviting)
    if (this.mode !== 'sandbox') for (var gx = 0; gx < C.COLS; gx++) for (var gy = 0; gy < C.ROWS; gy++) R.disc(ctx, C.GX0 + gx * C.GS, C.GY0 + gy * C.GS, 5, PAL.dot);
    if (this.trail && this.trail.length > 4) {
      ctx.fillStyle = PAL.marble; ctx.globalAlpha = 0.3;
      for (i = 0; i < this.trail.length; i += 2) { ctx.beginPath(); ctx.arc(this.trail[i], this.trail[i + 1], 4.5, 0, TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    var snapPeg = this.drag ? this.pegNear(this.drag.x, this.drag.y, this.drag.tol, this.drag.id) || this.dragSwap() : null;
    if (!picking) this.drawPegs(ctx, picking, snapPeg, pulse);
    // bolted things
    for (i = 0; i < this.fixed.length; i++) {
      p = this.fixed[i];
      var o = { fixed: true, bump: fx.bump[p.id] || 0 };
      if (p.k === 'cup') { o.full = fx.cupFull; o.happy = fx.happy; o.open = this.marbleNear(p.x, p.y - 40, 240); this.drawFlowers(ctx, p); }
      if (p.k === 'bell') { var bs = fx.bell[p.id]; o.swing = bs ? bs.a * Math.sin(bs.t * 11) * Math.exp(-bs.t * 1.8) : 0; o.rung = !!this.bellRung[p.id]; }
      if (fx.wig[p.id]) { ctx.save(); ctx.translate(Math.sin(fx.wig[p.id] * 30) * 5 * fx.wig[p.id], 0); R.piece(ctx, p, o); ctx.restore(); }
      else R.piece(ctx, p, o);
    }
    // placed pieces
    for (i = 0; i < this.pieces.length; i++) {
      p = this.pieces[i];
      if (!p.placed || (this.drag && this.drag.id === p.id)) continue;
      this.drawPiece(ctx, p, 1);
    }
    if (picking) this.drawPegs(ctx, picking, snapPeg, pulse);   // on top while a piece is in hand
    // spout
    var loaded = !(this.runActive && this.mode !== 'sandbox') && fx.reload <= 0;
    var wob = (this.mode === 'puzzle' && !this.runActive && !this.won && this.idle > 2.5) ? Math.sin(t * 9) * 0.05 * Math.max(0, Math.sin(t * 1.3)) : 0;
    R.spout(ctx, this.spoutX, fx.spoutSq, loaded || this.mode === 'sandbox', wob);
    // marbles
    if (this.world) {
      var ms = this.world.marbles, m, sq;
      for (i = 0; i < ms.length; i++) {
        m = ms[i]; if (m.state !== 1 && m.state !== 2) continue;
        sq = fx.msq[m.id];
        R.marble(ctx, m.x, m.y, m.ang, sq ? sq.a : 0, sq ? sq.nx : 0, sq ? sq.ny : 1);
      }
    } else if (fx.cupFull) {
      var cup = S.cupOf(pz); if (cup) R.marble(ctx, cup.x, cup.y + 17, 0.6, 0, 0, 1);
    }
    for (i = 0; i < fx.parts.length; i++) {
      p = fx.parts[i];
      ctx.globalAlpha = Math.min(1, p.life / p.max * 1.6);
      if (p.kind === 'petal') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, TAU); ctx.fillStyle = p.col; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = PAL.ink; ctx.stroke(); ctx.restore(); }
      else R.disc(ctx, p.x, p.y, p.s * (0.6 + 0.6 * (1 - p.life / p.max)), p.col, PAL.soft, 1.5);
      ctx.globalAlpha = 1;
    }
    this.drawSecrets(ctx);
    if (this.mode !== 'demo') this.drawTray(ctx);
    // rotate handle + direction arrow on the selected piece only
    if (selP && selP.placed && KINDS[selP.k].rstep && !(this.drag && this.drag.id === selP.id)) this.drawHandle(ctx, selP);
    if (this.drag) { p = this.byId(this.drag.id); if (p) { if (snapPeg) R.piece(ctx, { k: p.k, x: snapPeg.x, y: snapPeg.y, r: p.r }, { alpha: 0.3, noPeg: true }); this.drawPiece(ctx, p, 1.06); } }
    if (this.hint) this.drawHint(ctx);
  };
  P.drawPegs = function (ctx, picking, snapPeg, pulse) {
    var pz = this.pz, i;
    for (i = 0; i < pz.pegs.length; i++) {
      var pg = pz.pegs[i], occ = this.pieceAt(pg[0], pg[1], this.drag ? this.drag.id : null);
      if (occ) continue;
      var hl = picking ? 1 : 0, big = snapPeg && snapPeg.x === pg[0] && snapPeg.y === pg[1];
      if (this.mode === 'sandbox' && !big) R.disc(ctx, pg[0], pg[1], picking ? 9 + 1.5 * pulse : 7, picking ? PAL.glow : PAL.white, picking ? PAL.ink : PAL.soft, 2.5);
      else R.peg(ctx, pg[0], pg[1], big ? 1.5 : hl, big ? 1 : pulse);
    }
  };
  /** 0..1: how close the nearest rolling marble is to a point. */
  P.marbleNear = function (x, y, range) {
    var ms = this.world ? this.world.marbles : [], best = 0, i, d;
    for (i = 0; i < ms.length; i++) { if (ms[i].state !== 1) continue; d = 1 - Math.hypot(ms[i].x - x, ms[i].y - y) / range; if (d > best) best = d; }
    return best;
  };
  P.dragSwap = function () {
    var d = this.drag, g = this.anyPegNear(d.x, d.y, d.tol); return g;
  };
  P.drawPiece = function (ctx, p, scale) {
    var fx = this.fx, wig = fx.wig[p.id] || 0;
    R.piece(ctx, { k: p.k, x: p.ax + (wig ? Math.sin(wig * 30) * 6 * wig : 0), y: p.ay, r: p.ar }, {
      sel: this.sel === p.id, bump: fx.bump[p.id] || 0, scale: scale,
      swing: p.k === 'bell' && fx.bell[p.id] ? fx.bell[p.id].a * Math.sin(fx.bell[p.id].t * 11) * Math.exp(-fx.bell[p.id].t * 1.8) : 0
    });
  };
  P.drawTray = function (ctx) {
    var i, p, n = 0, x0, x1;
    if (this.mode === 'sandbox') { x0 = 800 - 2.5 * L.SLOT; x1 = 800 + 2.5 * L.SLOT; }
    else { n = this.pz.tray.length; if (!n) return; x0 = 800 - n / 2 * L.SLOT - 10; x1 = 800 + n / 2 * L.SLOT + 10; }
    R.rr(ctx, x0, L.TRAY_TOP + 6, x1 - x0, 132, 34); ctx.fillStyle = PAL.tray; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = PAL.soft; ctx.stroke();
    for (i = 0; i < this.pieces.length; i++) {
      p = this.pieces[i];
      if (p.placed || (this.drag && this.drag.id === p.id)) continue;
      ctx.save();
      if (this.mode === 'sandbox' && this.full) ctx.globalAlpha = 0.35;
      if (this.mode === 'puzzle' && !this.sel && !this.won && !this.runActive && this.idle > 3.5) ctx.translate(0, -8 * Math.max(0, Math.sin(this.game.t * 3.4 - i * 0.9)));
      this.drawPiece(ctx, p, p.k === 'cup' ? 0.78 : (p.k === 'curve' ? 0.8 : 0.9));
      ctx.restore();
    }
  };
  P.drawHandle = function (ctx, p) {
    var r = this.rot && this.rot.id === p.id ? this.rot.to : p.r, h = this.handlePos(p, r), prev = this.rot && this.rot.id === p.id;
    if (prev && this.rot.to !== p.r) R.piece(ctx, { k: p.k, x: p.x, y: p.y, r: this.rot.to }, { alpha: 0.42, noPeg: true });
    var D = L.HANDLE_D[p.k], ca = Math.cos(h.a), sa = Math.sin(h.a);
    // stalk from the piece to the handle
    ctx.save(); ctx.setLineDash([6, 9]);
    R.line(ctx, p.x + h.side * ca * 30, p.y + h.side * sa * 30, p.x + h.side * ca * (D - L.HANDLE_R - 6), p.y + h.side * sa * (D - L.HANDLE_R - 6), 4, PAL.ink);
    ctx.restore();
    // the direction arrow: always at the head of the piece
    var ad = h.side > 0 ? D - L.HANDLE_R - 20 : D - 34;
    ctx.save(); ctx.translate(p.x + ca * ad, p.y + sa * ad); ctx.rotate(h.a);
    ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-8, -11); ctx.lineTo(-8, 11); ctx.closePath();
    ctx.fillStyle = PAL.ink; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = PAL.ink; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
    R.button(ctx, h.x, h.y, L.HANDLE_R, { fill: prev ? PAL.glow : PAL.white, lw: 5 });
    // "turn me": a round arrow, clockwise like the turn itself
    ctx.save(); ctx.translate(h.x, h.y);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = PAL.ink; ctx.fillStyle = PAL.ink; ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.arc(0, 0, 15, -Math.PI * 0.95, Math.PI * 0.45); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12, 16); ctx.lineTo(4, 5); ctx.lineTo(5, 25); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  P.drawFlowers = function (ctx, cup) {
    var hues = ['#f7a8c4', '#9bd3f0', '#ffd76a', '#c7b5f5', '#b9e4a0'], i, f, side;
    for (i = 0; i < this.flowers.length; i++) {
      f = this.flowers[i]; side = i % 2 ? 1 : -1;
      R.flower(ctx, cup.x + side * (88 + 24 * Math.floor(i / 2)), cup.y + 52, f.g, hues[i % hues.length]);
    }
  };
  /** Silhouette butterflies are wishes for grown-ups; they fill in when a secret goal is met. */
  P.drawSecrets = function (ctx) {
    var pz = this.pz, t = this.game.t, cup, i, f, bx, by, a, k;
    if (this.mode !== 'puzzle' || !pz.secret) return;
    cup = S.cupOf(pz);
    var list = [];
    if (pz.secret.bell) { for (i = 0; i < this.fixed.length; i++) if (this.fixed[i].k === 'bell') list.push({ got: this.bonus.bell, x: this.fixed[i].x + 34, y: this.fixed[i].y - 44 }); }
    if (pz.secret.thrift) list.push({ got: this.bonus.thrift, x: 800 + this.pz.tray.length / 2 * L.SLOT + 44, y: L.TRAY_TOP + 2 });
    for (i = 0; i < list.length; i++) {
      f = list[i];
      if (!f.got) { R.butterfly(ctx, f.x, f.y, 0, 1, 0.62); continue; }
      k = Math.min(1, (t - f.got) / 1.6); a = k * k * (3 - 2 * k);
      bx = f.x + (cup.x + (i ? 40 : -40) - f.x) * a + Math.sin(t * 2 + i) * 10 * (1 - a * 0.6);
      by = f.y + (cup.y - 78 - f.y) * a - Math.sin(k * Math.PI) * 60 + Math.cos(t * 3 + i) * 5;
      R.butterfly(ctx, bx, by, 1, Math.sin(t * 9 + i), 0.8);
    }
  };
  P.drawHint = function (ctx) {
    var h = this.hint, act = h.act, T = 2.4, u = (h.t % T) / T, al = Math.min(1, h.t * 3, (7.5 - h.t) * 2), p, a, b, x, y, press = 0, e;
    if (al <= 0) return;
    if (act.type === 'go') { a = b = { x: this.spoutX + 12, y: 48 }; }
    else {
      p = this.byId(act.id); if (!p) return;
      a = { x: p.ax, y: p.ay };
      if (act.type === 'move') { b = { x: act.x, y: act.y }; R.piece(ctx, { k: p.k, x: act.x, y: act.y, r: p.r }, { alpha: 0.32 * al, noPeg: true }); }
      else if (act.type === 'tray') b = { x: this.slotX(p), y: L.TRAY_Y };
      else {   // rotate: show where it will point, press the piece, then its handle
        R.piece(ctx, { k: p.k, x: p.x, y: p.y, r: act.r }, { alpha: 0.32 * al, noPeg: true });
        if (this.sel === p.id) { e = this.handlePos(p); a = b = { x: e.x, y: e.y }; } else b = a;
      }
    }
    if (a === b || (a.x === b.x && a.y === b.y)) { x = a.x; y = a.y; press = (u > 0.25 && u < 0.5) ? 1 : 0; }
    else if (u < 0.22) { x = a.x; y = a.y; press = u > 0.08 ? 1 : 0; }
    else if (u < 0.7) { e = (u - 0.22) / 0.48; e = e * e * (3 - 2 * e); x = a.x + (b.x - a.x) * e; y = a.y + (b.y - a.y) * e; }
    else { x = b.x; y = b.y; press = u < 0.88 ? 1 : 0; }
    R.hand(ctx, x, y, press, 0.92 * al);
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
