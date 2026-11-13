/* audio.js (late) — every sound is synthesised with WebAudio from the state of the machine:
   stepper hum and screw hiss follow the real axis speeds, the shutter fires on each tile. */
(function () {
  'use strict';
  const SS = window.SS, U = SS.util, S = SS.S, ax = S.ax;
  const Au = { on: true };
  let ac = null, master = null, noiseBuf = null, voices = null;
  const btn = document.querySelector('#snd');

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = Au.on ? 0.9 : 0; master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // continuous voices: oscillator -> low-pass -> gain; screw hiss: looped noise -> band-pass -> gain
    const tone = (type, cut) => { const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain(); o.type = type; f.type = 'lowpass'; f.frequency.value = cut; g.gain.value = 0; o.connect(f); f.connect(g); g.connect(master); o.start(); return { o, g }; };
    const hiss = (freq, q) => { const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); n.buffer = noiseBuf; n.loop = true; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0; n.connect(f); f.connect(g); g.connect(master); n.start(); return { f, g }; };
    voices = { stage: tone('sawtooth', 1100), screw: hiss(2600, 1.2), loader: tone('square', 520), focus: tone('triangle', 2400), turret: tone('sawtooth', 700) };
    if (ac.state === 'suspended') ac.resume();
  }
  ['pointerdown', 'touchend', 'keydown'].forEach((ev) => window.addEventListener(ev, init, { passive: true }));

  function burst(t, dur, freq, q, vol, type) {
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf; f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    n.connect(f); f.connect(g); g.connect(master); n.start(t, Math.random() * 0.5, dur + 0.02);
  }
  function note(t, freq, dur, vol, type) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.03);
  }
  const ok = () => ac && ac.state === 'running' && Au.on;
  const fx = {
    shutter() { const t = ac.currentTime; burst(t, 0.035, 3800, 1.4, 0.34); burst(t + 0.045, 0.06, 1500, 0.9, 0.26); note(t, 190, 0.05, 0.1, 'square'); }, // カシャッ
    click() { burst(ac.currentTime, 0.03, 2400, 2.5, 0.2); },
    tick() { burst(ac.currentTime, 0.012, 5200, 3, 0.07); },
    limit() { const t = ac.currentTime; note(t, 92, 0.16, 0.4, 'sine'); burst(t, 0.05, 600, 0.8, 0.22, 'lowpass'); },
    knock() { const t = ac.currentTime; note(t, 130, 0.12, 0.35, 'sine'); burst(t, 0.04, 900, 0.7, 0.25); },
    good() { const t = ac.currentTime; note(t, 784, 0.16, 0.16); note(t + 0.11, 1175, 0.28, 0.16); },
    bad() { const t = ac.currentTime; note(t, 330, 0.18, 0.14, 'triangle'); note(t + 0.16, 247, 0.3, 0.14, 'triangle'); },
    done() { const t = ac.currentTime; [523, 659, 784, 1047].forEach((f, i) => note(t + i * 0.09, f, 0.3, 0.13)); },
    fit() { const t = ac.currentTime; note(t, 660, 0.12, 0.1); note(t + 0.08, 880, 0.2, 0.1); },
    nope() { note(ac.currentTime, 220, 0.12, 0.12, 'triangle'); },
    drop() { const t = ac.currentTime; burst(t, 0.04, 3200, 2, 0.16); note(t, 520, 0.08, 0.08); },
    seam() { burst(ac.currentTime, 0.01, 6500, 4, 0.03); },
  };
  const play = (name) => { if (ok()) fx[name](); };
  SS.on('scan:tile', () => play('shutter'));
  SS.on('click', () => play('click')); SS.on('tick', () => play('tick')); SS.on('ui', () => play('tick'));
  let lastLimit = 0;
  SS.on('limit', () => { const n = performance.now(); if (n - lastLimit > 260) { lastLimit = n; play('limit'); } });
  SS.on('poke', () => play('knock'));
  SS.on('focus:done', () => play('good')); SS.on('focus:fail', () => play('bad'));
  SS.on('scan:done', () => play('done')); SS.on('stitch:fit', () => play('fit'));
  SS.on('nope', () => play('nope')); SS.on('slide:racked', () => play('drop')); SS.on('slide:flip', () => play('click'));
  SS.on('seam', () => play('seam'));

  btn.addEventListener('click', () => {
    init(); Au.on = !Au.on; btn.classList.toggle('off', !Au.on);
    if (master) master.gain.setTargetAtTime(Au.on ? 0.9 : 0, ac.currentTime, 0.03);
  });

  let turAt = Math.round(ax.tur.pos);
  SS.late.add({
    frame() {
      if (!ac || ac.state !== 'running') return;
      const t = ac.currentTime, set = (p, v) => p.setTargetAtTime(v, t, 0.03);
      const vs = Math.abs(ax.x.vel) + Math.abs(ax.y.vel); // mm/s
      set(voices.stage.o.frequency, 70 + vs * 5.5); set(voices.stage.g.gain, Math.min(1, vs / 12) * 0.055);
      set(voices.screw.f.frequency, 1800 + vs * 40); set(voices.screw.g.gain, Math.min(1, vs / 30) * 0.06);
      const vl = Math.abs(ax.arm.vel) * 4 + Math.abs(ax.lift.vel) * 1.2 + Math.abs(ax.tray.vel) * 0.8 + Math.abs(ax.elev.vel) * 1.5 + Math.abs(ax.grip.vel) * 4 + Math.abs(ax.clip.vel) * 4;
      set(voices.loader.o.frequency, 55 + vl * 14); set(voices.loader.g.gain, Math.min(1, vl / 3) * 0.035);
      const vz = Math.abs(ax.z.vel); // µm/s
      set(voices.focus.o.frequency, 420 + vz * 1.6); set(voices.focus.g.gain, Math.min(1, vz / 60) * 0.03);
      const vt = Math.abs(ax.tur.vel);
      set(voices.turret.o.frequency, 110 + vt * 60); set(voices.turret.g.gain, Math.min(1, vt) * 0.03);
      if (!ax.tur.moving && Math.round(ax.tur.pos) !== turAt) { turAt = Math.round(ax.tur.pos); play('click'); } // detent
    },
  });
  SS.provide('audio', Au);
})();
