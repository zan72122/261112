/* Drawing primitives. Everything is drawn in world units on a pre-scaled 2D
 * context. No text is ever drawn. Shapes carry the meaning; colour only helps. */
(function (root) {
  'use strict';
  var MG = root.MG, C = MG.C, KINDS = MG.KINDS;
  var R = MG.R = {};
  var PAL = MG.PAL = {
    bg: '#e7e0d2', panel: '#f9f4e8', dot: '#e3d8c3', ink: '#3a322d', soft: '#8a7f73',
    plank: '#eaae50', plankHi: '#f8d595', bouncer: '#1f9e8f', bouncerHi: '#eafbf7',
    curve: '#7a6fd6', curveHi: '#d6d2f7', cup: '#e4572e', cupHi: '#fbe3d6',
    marble: '#2b5fa8', marbleHi: '#dbe9fb', bell: '#f2c14e', stone: '#a7a297', stoneHi: '#c4c0b6',
    fixed: '#cfc8ba', tray: '#efe7d6', white: '#ffffff', glow: '#fff3b8', night: '#27304a', nightHi: '#3a4668'
  };
  var TAU = Math.PI * 2;

  R.rr = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  };
  function line(ctx, ax, ay, bx, by, w, col) { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); }
  function disc(ctx, x, y, r, fill, stroke, lw) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw || 4; ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  R.disc = disc; R.line = line;

  /** A piece in its own frame. o: {fixed, sel, alpha, bump (0..1 squash), swing} */
  R.piece = function (ctx, p, o) {
    o = o || {};
    var K = KINDS[p.k];
    ctx.save();
    ctx.translate(p.x, p.y);
    if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
    if (o.scale) ctx.scale(o.scale, o.scale);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (p.k === 'block') { block(ctx, p); ctx.restore(); return; }
    if (p.k === 'cup') { cup(ctx, o); ctx.restore(); return; }
    if (p.k === 'bell') { bell(ctx, o); ctx.restore(); return; }
    ctx.rotate((p.r || 0) * Math.PI / 6);
    var b = o.bump || 0;
    if (b) ctx.scale(1 + 0.05 * b, 1 - 0.22 * b);
    if (o.sel) {   // soft halo (shape, not just colour, says "this one is in your hand")
      ctx.globalAlpha *= 0.9;
      if (p.k === 'curve') arcStroke(ctx, K.rad * 2 + 26, PAL.glow); else line(ctx, K.segs[0][0], 0, K.segs[0][2], 0, K.rad * 2 + 26, PAL.glow);
      ctx.globalAlpha /= 0.9;
    }
    if (p.k === 'plank') {
      line(ctx, -90, 0, 90, 0, 26, PAL.ink);
      line(ctx, -90, 0, 90, 0, 18, o.fixed ? PAL.fixed : PAL.plank);
      if (!o.fixed) { line(ctx, -70, -3.5, 40, -3.5, 2.5, PAL.plankHi); line(ctx, -20, 3.5, 72, 3.5, 2.5, PAL.plankHi); }
    } else if (p.k === 'bouncer') {
      line(ctx, -58, 0, 58, 0, 32, PAL.ink);
      line(ctx, -58, 0, 58, 0, 24, o.fixed ? PAL.fixed : PAL.bouncer);
      ctx.beginPath();
      for (var i = 0; i <= 8; i++) { var zx = -48 + i * 12, zy = (i % 2 ? -6 : 6); if (i) ctx.lineTo(zx, zy); else ctx.moveTo(zx, zy); }
      ctx.lineWidth = 3.5; ctx.strokeStyle = o.fixed ? PAL.ink : PAL.bouncerHi; ctx.stroke();
    } else if (p.k === 'curve') {
      arcStroke(ctx, 26, PAL.ink);
      arcStroke(ctx, 18, o.fixed ? PAL.fixed : PAL.curve);
      if (!o.fixed) { ctx.setLineDash([10, 14]); arcStroke(ctx, 3, PAL.curveHi); ctx.setLineDash([]); }
    }
    // the peg / bolt the piece hangs on
    if (o.fixed) {
      var ends = p.k === 'curve' ? [[-39, -61], [61, 39]] : [[K.segs[0][0] * 0.8, 0], [K.segs[0][2] * 0.8, 0]];
      for (var e = 0; e < 2; e++) { disc(ctx, ends[e][0], ends[e][1], 6.5, PAL.stoneHi, PAL.ink, 2.5); line(ctx, ends[e][0] - 3, ends[e][1] - 3, ends[e][0] + 3, ends[e][1] + 3, 2, PAL.ink); }
    } else if (!o.noPeg) {
      var px = p.k === 'curve' ? -9.7 : 0, py = p.k === 'curve' ? 9.7 : 0;
      disc(ctx, px, py, 5, PAL.ink);
    }
    ctx.restore();
  };
  function arcStroke(ctx, w, col) {
    ctx.beginPath(); ctx.arc(61, -61, 100, Math.PI / 2, Math.PI);
    ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke();
  }
  function block(ctx, p) {
    R.rr(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 10);
    ctx.fillStyle = PAL.stone; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = PAL.ink; ctx.stroke();
    ctx.save(); ctx.clip();
    ctx.lineWidth = 3; ctx.strokeStyle = PAL.stoneHi;
    for (var d = -p.h - p.w; d < p.w + p.h; d += 34) { ctx.beginPath(); ctx.moveTo(d - p.w / 2, p.h / 2); ctx.lineTo(d - p.w / 2 + p.h, -p.h / 2); ctx.stroke(); }
    ctx.restore();
  }
  function cup(ctx, o) {
    var b = o.bump || 0, happy = o.happy || 0, open = o.open || 0;
    ctx.scale(1 + 0.08 * b + 0.06 * open, 1 - 0.1 * b + 0.02 * open);
    ctx.beginPath(); ctx.moveTo(-63, -45); ctx.lineTo(-52, 45); ctx.lineTo(52, 45); ctx.lineTo(63, -45);
    ctx.lineWidth = 24; ctx.strokeStyle = PAL.ink; ctx.stroke();
    ctx.lineWidth = 16; ctx.strokeStyle = PAL.cup; ctx.stroke();
    // rim marks: readable without colour
    disc(ctx, -63, -45, 5, PAL.cupHi); disc(ctx, 63, -45, 5, PAL.cupHi);
    line(ctx, -30, 45, 30, 45, 3, PAL.cupHi);
    if (!o.full) {   // "a marble belongs here"
      ctx.setLineDash([7, 9]); ctx.beginPath(); ctx.arc(0, 17, 19, 0, TAU); ctx.lineWidth = 3.5; ctx.strokeStyle = PAL.marble; ctx.globalAlpha *= 0.55 + 0.25 * happy; ctx.stroke(); ctx.setLineDash([]);
    }
  }
  function bell(ctx, o) {
    var sw = o.swing || 0;
    line(ctx, 0, -40, 0, -22, 4, PAL.ink);
    disc(ctx, 0, -42, 5, PAL.ink);
    ctx.rotate(sw);
    ctx.beginPath();
    ctx.moveTo(-26, 18); ctx.quadraticCurveTo(-22, -24, 0, -24); ctx.quadraticCurveTo(22, -24, 26, 18); ctx.closePath();
    ctx.fillStyle = o.rung ? '#ffd76a' : PAL.bell; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = PAL.ink; ctx.stroke();
    line(ctx, -30, 18, 30, 18, 6, PAL.ink);
    disc(ctx, 0, 27, 6.5, PAL.ink);
    line(ctx, -9, -8, -12, 6, 3, PAL.white);
  }

  R.marble = function (ctx, x, y, ang, sq, nx, ny, alpha) {
    ctx.save(); ctx.translate(x, y);
    if (alpha !== undefined) ctx.globalAlpha *= alpha;
    if (sq > 0.01) { var a = Math.atan2(ny, nx); ctx.rotate(a); ctx.scale(1 - 0.28 * sq, 1 + 0.2 * sq); ctx.rotate(-a); }
    disc(ctx, 0, 0, C.R - 1.5, PAL.marble, PAL.ink, 3);
    ctx.rotate(ang);
    // a swirl so rolling is visible (motion cue)
    ctx.beginPath(); ctx.arc(0, 0, 11, 0.3, 2.2); ctx.lineWidth = 4; ctx.strokeStyle = PAL.marbleHi; ctx.lineCap = 'round'; ctx.stroke();
    disc(ctx, -6, -7, 3, PAL.white);
    ctx.restore();
  };

  /** The marble dispenser. squash 0..1 (anticipation), loaded: marble peeking out, t: time for idle wobble */
  R.spout = function (ctx, x, squash, loaded, wob) {
    ctx.save(); ctx.translate(x, 10);
    ctx.lineJoin = 'round';
    var s = squash || 0;
    ctx.scale(1 + 0.12 * s, 1 - 0.16 * s);
    if (wob) ctx.rotate(wob);
    if (loaded) R.marble(ctx, 0, 62, 0, 0, 0, 0);
    ctx.beginPath();
    ctx.moveTo(-52, -12); ctx.lineTo(52, -12); ctx.lineTo(52, 22); ctx.quadraticCurveTo(50, 44, 30, 50); ctx.lineTo(30, 66); ctx.lineTo(-30, 66); ctx.lineTo(-30, 50); ctx.quadraticCurveTo(-50, 44, -52, 22); ctx.closePath();
    ctx.fillStyle = PAL.marbleHi; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.stroke();
    // marbles waiting inside
    disc(ctx, -20, 18, 11, PAL.marble, PAL.ink, 2.5); disc(ctx, 14, 12, 11, PAL.marble, PAL.ink, 2.5); disc(ctx, 0, 34, 11, PAL.marble, PAL.ink, 2.5);
    line(ctx, -30, 58, 30, 58, 5, PAL.ink);
    ctx.restore();
  };

  R.peg = function (ctx, x, y, hl, pulse) {
    var r = 12 + 10 * hl + 3 * hl * pulse;
    disc(ctx, x, y, r, hl > 0.05 ? PAL.glow : PAL.white, PAL.ink, 3.5);
    disc(ctx, x, y, 4.5, PAL.ink);
  };

  /** Ghost hand: fingertip at (x,y). press 0..1. */
  R.hand = function (ctx, x, y, press, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= alpha;
    var s = 1 - 0.1 * press; ctx.scale(s, s); ctx.rotate(-0.35);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (press > 0.5) { ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.globalAlpha *= 0.5; ctx.stroke(); ctx.globalAlpha /= 0.5; }
    ctx.beginPath();
    ctx.moveTo(-13, 6); ctx.lineTo(-13, 62);            // index finger left edge
    ctx.quadraticCurveTo(-34, 52, -40, 66);             // thumb web
    ctx.quadraticCurveTo(-34, 96, -12, 122);            // palm left
    ctx.lineTo(44, 122);
    ctx.quadraticCurveTo(58, 100, 56, 74);              // palm right
    ctx.quadraticCurveTo(54, 58, 38, 60);               // knuckles
    ctx.quadraticCurveTo(30, 52, 13, 56);
    ctx.lineTo(13, 6);
    ctx.quadraticCurveTo(0, -12, -13, 6);
    ctx.closePath();
    ctx.fillStyle = PAL.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.stroke();
    line(ctx, 13, 60, 13, 76, 3.5, PAL.ink); line(ctx, 36, 62, 36, 76, 3.5, PAL.ink);
    ctx.restore();
  };

  R.flower = function (ctx, x, y, g, hue) {
    if (g <= 0) return;
    ctx.save(); ctx.translate(x, y);
    line(ctx, 0, 0, 0, -46 * g, 5, '#4d7c3a');
    ctx.translate(0, -46 * g); ctx.scale(g, g);
    for (var i = 0; i < 5; i++) { var a = i * TAU / 5 - Math.PI / 2; disc(ctx, Math.cos(a) * 13, Math.sin(a) * 13, 10, hue || '#f7a8c4', PAL.ink, 2.5); }
    disc(ctx, 0, 0, 8, '#ffe07a', PAL.ink, 2.5);
    ctx.restore();
  };

  /** fill 0 = dotted outline only (a wish), 1 = alive. flap: -1..1 */
  R.butterfly = function (ctx, x, y, fill, flap, size) {
    ctx.save(); ctx.translate(x, y); ctx.scale(size || 1, size || 1);
    var w = 0.55 + 0.45 * Math.abs(flap);
    ctx.lineJoin = 'round';
    for (var s = -1; s <= 1; s += 2) {
      ctx.save(); ctx.scale(s * w, 1);
      ctx.beginPath(); ctx.moveTo(2, 0); ctx.bezierCurveTo(10, -30, 40, -30, 34, -4); ctx.bezierCurveTo(44, 10, 22, 26, 2, 6); ctx.closePath();
      if (fill > 0.5) { ctx.fillStyle = '#f59e42'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = PAL.ink; ctx.stroke(); disc(ctx, 22, -10, 5, PAL.white); }
      else { ctx.setLineDash([4, 6]); ctx.lineWidth = 2.5; ctx.strokeStyle = PAL.soft; ctx.stroke(); ctx.setLineDash([]); }
      ctx.restore();
    }
    line(ctx, 0, -10, 0, 10, fill > 0.5 ? 5 : 3, fill > 0.5 ? PAL.ink : PAL.soft);
    ctx.restore();
  };

  /* ---------- icons (all wordless) ---------- */
  R.button = function (ctx, x, y, r, o) {
    o = o || {};
    ctx.save();
    if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
    if (o.glow) { disc(ctx, x, y, r + 8 + 6 * o.glow, null, PAL.bell, 6); }
    disc(ctx, x, y, r, o.fill || PAL.white, PAL.ink, o.lw || 4);
    ctx.restore();
  };
  R.icon = function (ctx, name, x, y, s, o) {
    o = o || {};
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = PAL.ink; ctx.fillStyle = PAL.ink; ctx.lineWidth = 0.16;
    var i;
    if (name === 'home') {
      ctx.beginPath(); ctx.moveTo(-0.55, 0); ctx.lineTo(0, -0.52); ctx.lineTo(0.55, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.38, -0.08); ctx.lineTo(-0.38, 0.48); ctx.lineTo(0.38, 0.48); ctx.lineTo(0.38, -0.08); ctx.stroke();
      ctx.fillRect(-0.1, 0.14, 0.2, 0.34);
    } else if (name === 'undo' || name === 'redo') {
      if (name === 'redo') ctx.scale(-1, 1);
      // an arrow curling back over the top
      ctx.lineWidth = 0.17;
      ctx.beginPath(); ctx.arc(0.06, 0.1, 0.4, Math.PI * 1.08, Math.PI * 2.55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.62, -0.3); ctx.lineTo(-0.3, 0.14); ctx.lineTo(-0.06, -0.3); ctx.closePath(); ctx.fill();
    } else if (name === 'next' || name === 'play') {
      ctx.beginPath(); ctx.moveTo(-0.3, -0.48); ctx.lineTo(0.5, 0); ctx.lineTo(-0.3, 0.48); ctx.closePath(); ctx.fillStyle = o.fill || PAL.ink; ctx.fill(); ctx.stroke();
    } else if (name === 'full') {
      for (i = 0; i < 4; i++) { ctx.save(); ctx.rotate(i * Math.PI / 2); ctx.beginPath(); ctx.moveTo(0.2, 0.5); ctx.lineTo(0.5, 0.5); ctx.lineTo(0.5, 0.2); ctx.stroke(); ctx.restore(); }
    } else if (name === 'copy') {
      ctx.lineWidth = 0.14;
      R.rr(ctx, -0.5, -0.5, 0.7, 0.7, 0.12); ctx.fillStyle = PAL.white; ctx.fill(); ctx.stroke();
      R.rr(ctx, -0.2, -0.2, 0.7, 0.7, 0.12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0.15, 0); ctx.lineTo(0.15, 0.3); ctx.moveTo(0, 0.15); ctx.lineTo(0.3, 0.15); ctx.stroke();
    } else if (name === 'plus') {
      ctx.lineWidth = 0.2; ctx.beginPath(); ctx.moveTo(0, -0.5); ctx.lineTo(0, 0.5); ctx.moveTo(-0.5, 0); ctx.lineTo(0.5, 0); ctx.stroke();
    } else if (name === 'left' || name === 'right') {
      if (name === 'left') ctx.scale(-1, 1);
      ctx.lineWidth = 0.2; ctx.beginPath(); ctx.moveTo(-0.2, -0.45); ctx.lineTo(0.3, 0); ctx.lineTo(-0.2, 0.45); ctx.stroke();
    }
    ctx.restore();
  };

  /** Miniature of a board (used for the shelf and the parent's before/after view). */
  R.thumb = function (canvas, creation, w, h) {
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d'), s = w / C.W, i;
    ctx.fillStyle = PAL.panel; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.scale(s, s);
    ctx.translate(0, (h / s - 860) / 2);
    for (var gx = 0; gx < C.COLS; gx++) for (var gy = 0; gy < C.ROWS; gy++) disc(ctx, C.GX0 + gx * C.GS, C.GY0 + gy * C.GS, 5, PAL.dot);
    R.spout(ctx, creation.spoutX, 0, true, 0);
    for (i = 0; i < creation.pieces.length; i++) R.piece(ctx, creation.pieces[i], { noPeg: true });
    ctx.restore();
    return canvas;
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
