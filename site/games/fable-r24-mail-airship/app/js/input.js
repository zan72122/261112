// input.js - one-finger steering. Drag from wherever the finger lands: sideways turns,
// up/down changes height, letting go returns to level cruise. A quick touch is a "tap".
// A second finger may tap while the first keeps steering.
(function () {
  'use strict';
  var MA = window.MA;
  var inp = (MA.input = {
    x: 0, y: 0, // steering, -1..1 (right / up positive)
    held: false,
    dragTime: 0, // seconds spent steering (for hints)
    onTap: null, // fn(x, y)
    onDrag: null, // fn(pixels moved)
    onFirstTouch: null,
  });
  var steerId = null, ox = 0, oy = 0, pts = {}, keys = {}, touched = false;

  function radius() { return MA.clamp(Math.min(innerWidth, innerHeight) * 0.15, 56, 150); }

  function down(e) {
    if (!touched) { touched = true; if (inp.onFirstTouch) inp.onFirstTouch(); }
    pts[e.pointerId] = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0, lx: e.clientX, ly: e.clientY };
    if (steerId === null) {
      steerId = e.pointerId;
      ox = e.clientX;
      oy = e.clientY;
      inp.held = true;
    }
    e.preventDefault();
  }
  function move(e) {
    var p = pts[e.pointerId];
    if (!p) return;
    var step = Math.hypot(e.clientX - p.lx, e.clientY - p.ly);
    p.moved += step;
    p.lx = e.clientX;
    p.ly = e.clientY;
    if (inp.onDrag && step > 0) inp.onDrag(step);
    if (e.pointerId === steerId) {
      var R = radius(), dx = e.clientX - ox, dy = e.clientY - oy;
      // the origin trails the finger, so reversing direction always answers at once
      if (dx > R) { ox += dx - R; dx = R; } else if (dx < -R) { ox += dx + R; dx = -R; }
      if (dy > R) { oy += dy - R; dy = R; } else if (dy < -R) { oy += dy + R; dy = -R; }
      var dead = R * 0.1;
      inp.x = Math.abs(dx) < dead ? 0 : (dx - Math.sign(dx) * dead) / (R - dead);
      inp.y = Math.abs(dy) < dead ? 0 : -(dy - Math.sign(dy) * dead) / (R - dead);
    }
    e.preventDefault();
  }
  function up(e, cancelled) {
    var p = pts[e.pointerId];
    if (!p) return;
    delete pts[e.pointerId];
    if (!cancelled && p.moved < 16 && performance.now() - p.t < 450 && inp.onTap) inp.onTap(e.clientX, e.clientY);
    if (e.pointerId === steerId) {
      steerId = null;
      inp.x = inp.y = 0;
      inp.held = false;
    }
  }

  MA.initInput = function (el) {
    el.addEventListener('pointerdown', down, { passive: false });
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', function (e) { up(e, false); });
    window.addEventListener('pointercancel', function (e) { up(e, true); });
    // keep Safari from scrolling, zooming, selecting or showing callouts
    ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'contextmenu', 'dblclick', 'selectstart'].forEach(function (n) {
      document.addEventListener(n, function (e) { e.preventDefault(); }, { passive: false });
    });
    window.addEventListener('blur', function () { steerId = null; pts = {}; keys = {}; inp.x = inp.y = 0; inp.held = false; });
    // keyboard, for trying the game on a desktop
    window.addEventListener('keydown', function (e) {
      if (!touched) { touched = true; if (inp.onFirstTouch) inp.onFirstTouch(); }
      if (e.code === 'Space' && !e.repeat && inp.onTap) inp.onTap(innerWidth / 2, innerHeight / 2);
      keys[e.code] = true;
    });
    window.addEventListener('keyup', function (e) { keys[e.code] = false; });
  };

  MA.pollInput = function (dt) {
    if (steerId === null) {
      var kx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
      var ky = (keys.ArrowUp || keys.KeyW ? 1 : 0) - (keys.ArrowDown || keys.KeyS ? 1 : 0);
      inp.x = kx;
      inp.y = ky;
    }
    if (inp.x !== 0 || inp.y !== 0) inp.dragTime += dt;
  };
})();
