// audio.js - every sound is synthesised with WebAudio: propeller purr, wind, bells,
// the receivers' voices, chick cheeps, and a very quiet music box while flying.
// Nothing plays until the first touch (browser rule), and everything is safe to call before that.
(function () {
  'use strict';
  var MA = window.MA;
  var ctx = null, master = null, noiseBuf = null;
  var prop = null, wind = null, music = { on: false, next: 0, step: 0, bar: 0 };

  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }

  function env(g, t0, a, d, vol) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  }
  // One enveloped oscillator. o: {type, f, f1 (slide to), a (attack), d (decay), vol, vib, vibF, when, lp}
  function tone(o) {
    var t0 = ctx.currentTime + (o.when || 0), a = o.a || 0.01, d = o.d || 0.3;
    var osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t0);
    if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t0 + (o.slide || a + d));
    if (o.vib) {
      var l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = o.vibF || 6;
      lg.gain.value = o.vib;
      l.connect(lg); lg.connect(osc.frequency);
      l.start(t0); l.stop(t0 + a + d + 0.05);
    }
    env(g, t0, a, d, o.vol || 0.1);
    var out = g;
    if (o.lp) {
      var f = ctx.createBiquadFilter();
      f.type = o.bp ? 'bandpass' : 'lowpass';
      f.frequency.setValueAtTime(o.lp, t0);
      if (o.lp1) f.frequency.exponentialRampToValueAtTime(o.lp1, t0 + a + d);
      f.Q.value = o.q || 0.8;
      g.connect(f);
      out = f;
    }
    osc.connect(g);
    out.connect(master);
    osc.start(t0);
    osc.stop(t0 + a + d + 0.05);
  }
  function bell(f, when, vol, d) {
    tone({ f: f, when: when, vol: vol, a: 0.004, d: d || 0.9 });
    tone({ f: f * 2.01, when: when, vol: vol * 0.35, a: 0.004, d: (d || 0.9) * 0.5 });
    tone({ f: f * 3.0, when: when, vol: vol * 0.12, a: 0.004, d: (d || 0.9) * 0.25, type: 'triangle' });
  }
  function noise(o) {
    var t0 = ctx.currentTime + (o.when || 0), a = o.a || 0.02, d = o.d || 0.3;
    var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noiseBuf;
    src.loop = true;
    f.type = o.type || 'bandpass';
    f.frequency.setValueAtTime(o.f, t0);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t0 + a + d);
    f.Q.value = o.q || 0.8;
    env(g, t0, a, d, o.vol || 0.1);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0, Math.random() * 1.5);
    src.stop(t0 + a + d + 0.05);
  }
  var PENTA = [72, 74, 76, 79, 81, 84, 86, 88, 91];
  function run(notes, gap, vol, d, when) {
    for (var i = 0; i < notes.length; i++) bell(midi(notes[i]), (when || 0) + i * gap, vol, d);
  }

  var SFX = {
    load: function (slot) {
      tone({ f: 320, f1: 760, d: 0.13, vol: 0.12, type: 'triangle' });
      bell(midi([72, 76, 79, 84][slot || 0]), 0.1, 0.14, 0.8);
    },
    thud: function () {
      tone({ f: 150, f1: 70, d: 0.16, vol: 0.2 });
      noise({ f: 300, type: 'lowpass', d: 0.1, vol: 0.08 });
    },
    putt: function () {
      tone({ f: 95, f1: 60, d: 0.1, vol: 0.16, type: 'triangle' });
      noise({ f: 500, type: 'lowpass', d: 0.07, vol: 0.05 });
    },
    ready: function () { run([72, 76, 79, 84], 0.09, 0.11, 0.8, 0.15); },
    liftoff: function () {
      noise({ f: 300, f1: 1400, a: 1.2, d: 1.6, vol: 0.09, q: 0.6 });
      run([60, 64, 67, 72, 76, 79, 84], 0.13, 0.1, 1.0, 0.2);
    },
    drop: function () {
      tone({ f: 1250, f1: 480, d: 0.55, vol: 0.09, vib: 18, vibF: 9 });
      tone({ f: 500, f1: 900, d: 0.08, vol: 0.1, type: 'triangle' });
      noise({ f: 700, type: 'lowpass', a: 0.05, d: 0.3, vol: 0.07, when: 0.4 });
    },
    land: function () {
      noise({ f: 2500, f1: 6000, d: 0.5, vol: 0.05, q: 1.5 });
      run([72, 76, 79, 84, 88], 0.08, 0.12, 1.0);
      run([84, 88, 91], 0.0, 0.07, 1.6, 0.5);
    },
    toot: function () {
      for (var k = 0; k < 2; k++) {
        tone({ f: 233, when: k * 0.24, a: 0.03, d: 0.2, vol: 0.09, type: 'sawtooth', lp: 900 });
        tone({ f: 294, when: k * 0.24, a: 0.03, d: 0.2, vol: 0.07, type: 'sawtooth', lp: 900 });
      }
    },
    chime: function (i) {
      var b = (i || 0) % 4, n = [];
      for (var k = 0; k < 5; k++) n.push(PENTA[b + k]);
      run(n, 0.07, 0.11, 1.1);
      noise({ f: 4000, f1: 8000, d: 0.4, vol: 0.03, q: 2 });
    },
    cheep: function (pitch) {
      var p = 2500 * (pitch || 1);
      tone({ f: p, f1: p * 1.45, d: 0.07, vol: 0.06 });
      tone({ f: p * 1.1, f1: p * 1.6, d: 0.08, vol: 0.06, when: 0.11 });
    },
    gull: function () {
      tone({ f: 900, f1: 620, a: 0.03, d: 0.3, vol: 0.035, type: 'sawtooth', lp: 1800, bp: true, q: 3 });
      tone({ f: 1000, f1: 650, a: 0.03, d: 0.36, vol: 0.035, type: 'sawtooth', lp: 1800, bp: true, q: 3, when: 0.34 });
    },
    whoosh: function () { noise({ f: 500, f1: 1500, a: 0.4, d: 0.8, vol: 0.09, q: 0.5 }); },
    gust: function () { noise({ f: 350, f1: 900, a: 0.8, d: 1.4, vol: 0.1, q: 0.7 }); },
    boing: function () {
      tone({ f: 260, f1: 620, slide: 0.12, d: 0.34, vol: 0.13, type: 'triangle', vib: 30, vibF: 13 });
    },
    splash: function () {
      noise({ f: 900, f1: 300, type: 'lowpass', a: 0.03, d: 0.7, vol: 0.1 });
      noise({ f: 3500, d: 0.35, vol: 0.04, q: 1 });
    },
    pop: function () {
      tone({ f: 500, f1: 1100, d: 0.09, vol: 0.12, type: 'triangle' });
      noise({ f: 3000, d: 0.12, vol: 0.05, q: 1 });
    },
    rainbow: function () {
      var n = [], i;
      for (i = 0; i < 22; i++) n.push(60 + [0, 2, 4, 7, 9][i % 5] + 12 * Math.floor(i / 5));
      run(n, 0.11, 0.085, 1.6, 0.2);
      var chord = [48, 55, 60, 64, 67, 74];
      for (i = 0; i < chord.length; i++) tone({ f: midi(chord[i]), a: 1.8, d: 6, vol: 0.04, type: 'triangle', when: 0.4 });
    },
    through: function () {
      run([72, 76, 79, 84, 88, 91, 96], 0.07, 0.11, 1.4);
      run([96, 91, 88, 84], 0.09, 0.07, 1.2, 0.6);
      noise({ f: 5000, f1: 9000, a: 0.1, d: 1.2, vol: 0.04, q: 2 });
    },
    // --- receivers' voices ---
    bear: function () { // warm, round humming
      var m = [57, 60, 64, 60, 65];
      for (var i = 0; i < m.length; i++) tone({ f: midi(m[i]), when: i * 0.2, a: 0.04, d: 0.2, vol: 0.13, type: 'triangle', vib: 5, vibF: 7, lp: 700, lp1: 1100 });
    },
    mill: function () { // wooden robot: clicky bleeps
      var m = [76, 83, 79, 88, 84, 91];
      for (var i = 0; i < m.length; i++) {
        tone({ f: midi(m[i]), when: i * 0.1, a: 0.004, d: 0.07, vol: 0.06, type: 'square', lp: 2600 });
        tone({ f: 180, f1: 120, when: i * 0.1, d: 0.03, vol: 0.07, type: 'triangle' });
      }
    },
    turtle: function () { // slow happy "puuu-oh"
      tone({ f: 196, f1: 262, slide: 0.5, a: 0.12, d: 0.7, vol: 0.12, type: 'sawtooth', lp: 500, lp1: 900, vib: 3, vibF: 4 });
      tone({ f: 262, f1: 330, slide: 0.4, a: 0.1, d: 0.6, vol: 0.1, type: 'sawtooth', lp: 600, lp1: 1000, when: 0.75, vib: 3, vibF: 4 });
    },
    light: function () { // penguin: bright little honks
      for (var i = 0; i < 3; i++) tone({ f: 640 + i * 60, f1: 420, a: 0.01, d: 0.13, vol: 0.09, type: 'sawtooth', lp: 1500, bp: true, q: 4, when: i * 0.17 });
    },
  };

  function startLoops() {
    // propeller: two soft oscillators chopped by a blade-rate LFO
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter();
    var am = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain(), out = ctx.createGain();
    o1.type = 'triangle'; o2.type = 'sawtooth';
    lp.type = 'lowpass'; lp.frequency.value = 260;
    am.gain.value = 0.6; lg.gain.value = 0.4; lfo.type = 'sine';
    out.gain.value = 0;
    o1.connect(lp); o2.connect(lp); lp.connect(am); lfo.connect(lg); lg.connect(am.gain); am.connect(out); out.connect(master);
    o1.start(); o2.start(); lfo.start();
    prop = { o1: o1, o2: o2, lfo: lfo, out: out };
    // wind: filtered noise
    var src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), wg = ctx.createGain();
    src.buffer = noiseBuf; src.loop = true;
    bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 0.6;
    wg.gain.value = 0;
    src.connect(bp); bp.connect(wg); wg.connect(master);
    src.start();
    wind = { bp: bp, g: wg };
  }

  // very quiet music box: I - vi - IV - V with pentatonic phrases, a bar every ~3.4 s
  var ROOTS = [48, 45, 41, 43];
  var PHR = [
    [[0, 76], [2, 79], [4, 84], [6, 79]], [[0, 72], [3, 76], [4, 79]], [[1, 81], [2, 79], [4, 76], [6, 74]],
    [[0, 84], [2, 81], [4, 79], [5, 76], [6, 72]], [[0, 79], [4, 76]], [[2, 72], [3, 74], [4, 76], [6, 79]], [],
  ];
  function tickMusic() {
    if (!music.on || ctx.state !== 'running') return;
    var now = ctx.currentTime;
    if (music.next < now) music.next = now + 0.1;
    while (music.next < now + 0.5) {
      var w = music.next - now, bar = music.bar % 4;
      tone({ f: midi(ROOTS[bar]), when: w, a: 0.5, d: 2.8, vol: 0.035, type: 'triangle' });
      tone({ f: midi(ROOTS[bar] + 7), when: w, a: 0.7, d: 2.6, vol: 0.02 });
      var ph = PHR[Math.floor(Math.random() * PHR.length)];
      for (var i = 0; i < ph.length; i++) bell(midi(ph[i][1]), w + ph[i][0] * 0.42, 0.028, 1.4);
      music.next += 8 * 0.42;
      music.bar++;
    }
  }

  MA.audio = {
    ready: false,
    unlock: function () {
      try {
        if (!ctx) {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          ctx = new AC();
          var comp = ctx.createDynamicsCompressor();
          master = ctx.createGain();
          master.gain.value = 0.85;
          master.connect(comp);
          comp.connect(ctx.destination);
          noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
          var d = noiseBuf.getChannelData(0);
          for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          startLoops();
          this.ready = true;
        }
        if (ctx.state !== 'running' && !document.hidden) ctx.resume();
      } catch (e) { /* no audio: the game still plays */ }
    },
    sfx: function (name, arg) {
      if (!ctx || ctx.state !== 'running' || !SFX[name]) return;
      try { SFX[name](arg); } catch (e) { console.error('sfx ' + name + ': ' + e.message); }
    },
    startMusic: function () { music.on = true; },
    state: function () { return ctx ? ctx.state : 'none'; },
    // called every frame. s: {spin, speed, alt, turn, cloud, wind}
    update: function (s) {
      if (!ctx || ctx.state !== 'running') return;
      var t = ctx.currentTime, sp = s.spin || 0;
      prop.o1.frequency.setTargetAtTime(38 + sp * 2.1, t, 0.1);
      prop.o2.frequency.setTargetAtTime(57 + sp * 3.1, t, 0.1);
      prop.lfo.frequency.setTargetAtTime(Math.max(sp * 0.48, 0.5), t, 0.1);
      prop.out.gain.setTargetAtTime(0.075 * MA.clamp(sp / 10, 0, 1), t, 0.15);
      var w = 0.012 + 0.03 * MA.clamp((s.speed || 0) / 20, 0, 1) + 0.018 * Math.abs(s.turn || 0) + 0.09 * (s.cloud || 0) + 0.1 * (s.wind || 0);
      wind.g.gain.setTargetAtTime(w * (0.8 + 0.2 * Math.sin(t * 0.7)), t, 0.3);
      wind.bp.frequency.setTargetAtTime(420 + (s.alt || 0) * 3.5 + (s.cloud || 0) * 500, t, 0.3);
      tickMusic();
    },
    hush: function (hidden) {
      if (!ctx) return;
      if (hidden) ctx.suspend(); else ctx.resume();
    },
  };
})();
