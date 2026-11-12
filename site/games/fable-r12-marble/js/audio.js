/* Sound: everything is synthesised with Web Audio. Nothing starts before the
 * first touch, and if audio is refused the game simply stays silent. */
(function (root) {
  'use strict';
  var MG = root.MG;
  var A = MG.Audio = { ctx: null, dead: false, started: false, volume: 0.6, master: null, played: 0, rollGain: null, rollFilter: null, lastHit: {} };

  // C major pentatonic over two octaves: any order of hits sounds friendly
  var PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.7];
  A.note = function (i) { i = ((i % PENTA.length) + PENTA.length) % PENTA.length; return PENTA[i]; };

  /** Called from the first pointer event. Safe to call again. */
  A.start = function () {
    if (A.dead) return false;
    try {
      if (!A.ctx) {
        var AC = root.AudioContext || root.webkitAudioContext;
        if (!AC) { A.dead = true; return false; }
        A.ctx = new AC();
        var comp = A.ctx.createDynamicsCompressor();
        comp.threshold.value = -18; comp.ratio.value = 6; comp.attack.value = 0.004; comp.release.value = 0.2;
        A.master = A.ctx.createGain();
        A.master.gain.value = A.volume * 0.42;        // gentle ceiling
        A.master.connect(comp); comp.connect(A.ctx.destination);
        // rolling rumble: one looping noise source through a band-pass
        var len = A.ctx.sampleRate, buf = A.ctx.createBuffer(1, len, A.ctx.sampleRate), d = buf.getChannelData(0), seed = 12345, i, last = 0;
        for (i = 0; i < len; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; last = last * 0.82 + ((seed / 4294967296) * 2 - 1) * 0.18; d[i] = last * 2.4; }
        var src = A.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        A.rollFilter = A.ctx.createBiquadFilter(); A.rollFilter.type = 'bandpass'; A.rollFilter.frequency.value = 500; A.rollFilter.Q.value = 0.9;
        A.rollGain = A.ctx.createGain(); A.rollGain.gain.value = 0;
        src.connect(A.rollFilter); A.rollFilter.connect(A.rollGain); A.rollGain.connect(A.master);
        src.start();
      }
      if (A.ctx.state === 'suspended' && A.ctx.resume) { var p = A.ctx.resume(); if (p && p.catch) p.catch(function () {}); }
      A.started = true;
      return true;
    } catch (e) {
      A.dead = true; A.ctx = null;
      return false;
    }
  };

  A.setVolume = function (v) {
    A.volume = Math.max(0, Math.min(1, v));
    try { if (A.master) A.master.gain.setTargetAtTime(A.volume * 0.42, A.ctx.currentTime, 0.03); } catch (e) { /* ignore */ }
  };

  function tone(type, f0, f1, dur, gain, delay, attack) {
    if (!A.ctx || A.dead || A.volume <= 0) return;
    try {
      var t = A.ctx.currentTime + (delay || 0), o = A.ctx.createOscillator(), g = A.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t);
      if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + (attack || 0.004));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(A.master);
      o.start(t); o.stop(t + dur + 0.02);
      A.played++;
    } catch (e) { /* ignore */ }
  }
  A.tone = tone;

  /** Impact sound. mat: wood|rubber|slide|stone|cup|glass|metal ; v: impact speed ; pitch: scale index */
  A.hit = function (mat, v, pitch) {
    if (!A.ctx) return;
    var now = A.ctx.currentTime, key = mat + ':' + pitch;
    if (A.lastHit[key] && now - A.lastHit[key] < 0.045) return;     // no machine-gun repeats
    A.lastHit[key] = now;
    var g = Math.min(1, Math.max(0.12, v / 1000)), f = A.note(pitch || 0);
    if (mat === 'wood') { tone('triangle', f, f * 0.995, 0.16 + 0.1 * g, 0.5 * g); tone('sine', f * 4.01, f * 4, 0.05, 0.16 * g); }
    else if (mat === 'slide') { tone('sine', f * 0.75, f * 0.74, 0.12, 0.3 * g); }
    else if (mat === 'rubber') { tone('sine', 150 + 40 * g, 330 + 120 * g, 0.2, 0.55 * g); tone('triangle', 75, 60, 0.12, 0.35 * g); }
    else if (mat === 'stone') { tone('square', 190, 120, 0.05, 0.16 * g); tone('triangle', 900, 500, 0.03, 0.12 * g); }
    else if (mat === 'cup') { tone('sine', 196, 150, 0.14, 0.4 * g); }
    else if (mat === 'glass') { tone('sine', 1900, 1700, 0.05, 0.22 * g); tone('triangle', 2900, 2600, 0.03, 0.1 * g); }
    else if (mat === 'metal') { A.bell(pitch, g); }
  };
  A.bell = function (pitch, g) {
    var f = A.note((pitch || 0) + 5) * 2; g = g || 0.6;
    tone('sine', f, f, 1.1, 0.34 * g); tone('sine', f * 2.76, f * 2.76, 0.6, 0.12 * g); tone('sine', f * 5.4, f * 5.4, 0.25, 0.05 * g);
  };

  /** Rolling rumble follows the fastest rolling marble. Called once per frame. */
  A.roll = function (speed, matId) {
    if (!A.ctx || !A.rollGain) return;
    try {
      var g = Math.min(0.5, speed / 1400), t = A.ctx.currentTime;
      A.rollGain.gain.setTargetAtTime(A.volume > 0 ? g : 0, t, 0.05);
      A.rollFilter.frequency.setTargetAtTime((matId === 3 ? 700 : 380) + speed * 0.9, t, 0.06);
    } catch (e) { /* ignore */ }
  };

  var UI = {
    pick: function () { tone('sine', 520, 700, 0.08, 0.25); },
    place: function () { tone('triangle', 330, 240, 0.09, 0.4); tone('sine', 990, 900, 0.03, 0.1); },
    back: function () { tone('sine', 420, 300, 0.1, 0.22); },
    turn: function () { tone('triangle', 620, 660, 0.05, 0.25); },
    drop: function () { tone('sine', 300, 520, 0.09, 0.3); },
    home: function () { tone('sine', 360, 250, 0.16, 0.2); tone('sine', 270, 200, 0.2, 0.12, 0.05); },   // marble comes back: neutral, not a "wrong" buzzer
    plop: function () { tone('sine', 240, 110, 0.14, 0.22); },
    undo: function () { tone('sine', 500, 380, 0.08, 0.2); },
    redo: function () { tone('sine', 380, 500, 0.08, 0.2); },
    nope: function () { tone('sine', 220, 200, 0.07, 0.16); tone('sine', 200, 185, 0.07, 0.14, 0.09); },
    hint: function () { tone('sine', 660, 880, 0.18, 0.2); },
    next: function () { tone('sine', 392, 523, 0.12, 0.24); tone('sine', 523, 659, 0.14, 0.2, 0.09); },
    flower: function () { tone('sine', 1046, 1046, 0.3, 0.16); tone('sine', 1318, 1318, 0.3, 0.12, 0.08); },
    flutter: function () { tone('sine', 1568, 1760, 0.2, 0.1); tone('sine', 2093, 2093, 0.25, 0.08, 0.1); },
    sleep: function () { tone('sine', 392, 330, 0.5, 0.16); tone('sine', 330, 262, 0.7, 0.14, 0.35); tone('sine', 262, 196, 1.0, 0.12, 0.8); }
  };
  A.ui = function (name) { if (A.ctx && UI[name]) UI[name](); };

  A.celebrate = function () {
    if (!A.ctx) return;
    var seq = [0, 2, 3, 5, 7], i;
    for (i = 0; i < seq.length; i++) tone('triangle', A.note(seq[i]) * 2, A.note(seq[i]) * 2, 0.5, 0.26, i * 0.09);
    tone('sine', A.note(10), A.note(10), 0.9, 0.12, 0.5);
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
