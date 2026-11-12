/* All sound is synthesised with WebAudio at run time (no audio files). */
(function () {
  'use strict';
  const MT = window.MT;
  let ctx = null, master = null, noiseBuf = null, enabled = true;
  let hissG = null, hissF = null, whirG = null, whirF = null, rubG = null;
  const last = {};

  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (e) { ctx = null; return false; }
    master = ctx.createGain(); master.gain.value = enabled ? 0.85 : 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 5; comp.attack.value = 0.003; comp.release.value = 0.18;
    master.connect(comp); comp.connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const loop = (type, f, q) => {
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      const g = ctx.createGain(); g.gain.value = 0;
      s.connect(fl); fl.connect(g); g.connect(master); s.start();
      return [g, fl];
    };
    [hissG, hissF] = loop('bandpass', 5200, 0.9);     // blade through wax
    [whirG, whirF] = loop('lowpass', 240, 0.4);       // bearing rumble of the handwheel
    [rubG] = loop('bandpass', 900, 2.5);              // crunch of a thick bite
    return true;
  }
  function resume() { if (init() && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
  function ok(name, minGap) {
    if (!ctx || !enabled || ctx.state !== 'running') return false;
    if (minGap) { const t = ctx.currentTime; if (last[name] !== undefined && t - last[name] < minGap) return false; last[name] = t; }
    return true;
  }
  function nz(o) {   // filtered noise burst
    const t = ctx.currentTime + (o.when || 0);
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f, t); f.Q.value = o.q || 1;
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.gain, t + (o.att || 0.002)); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random() * 1.5); s.stop(t + o.dur + 0.02);
  }
  function tone(o) {
    const t = ctx.currentTime + (o.when || 0);
    const os = ctx.createOscillator(); os.type = o.type || 'sine'; os.frequency.setValueAtTime(o.f, t);
    if (o.f2) os.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.gain, t + (o.att || 0.003)); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    os.connect(g); g.connect(master); os.start(t); os.stop(t + o.dur + 0.02);
  }

  const A = {
    resume,
    get enabled() { return enabled; },
    setEnabled(v) { enabled = v; if (master) master.gain.setTargetAtTime(v ? 0.85 : 0, ctx.currentTime, 0.02); if (v) resume(); },
    // --- one-shots ---
    ratchet() { if (!ok('ratchet', 0.012)) return; nz({ f: 3400 + Math.random() * 500, q: 6, dur: 0.022, gain: 0.34 }); tone({ f: 1900, f2: 1300, dur: 0.02, gain: 0.07, type: 'triangle' }); },
    tick() { if (!ok('tick', 0.03)) return; nz({ f: 1500, q: 3, dur: 0.02, gain: 0.07 }); },
    dial() { if (!ok('dial', 0.02)) return; nz({ f: 2600, q: 8, dur: 0.018, gain: 0.3 }); tone({ f: 880, f2: 640, dur: 0.03, gain: 0.05, type: 'square' }); },
    coarse() { if (!ok('coarse', 0.02)) return; nz({ f: 1100, q: 5, dur: 0.03, gain: 0.34 }); tone({ f: 300, f2: 200, dur: 0.035, gain: 0.12, type: 'triangle' }); },
    clampClick(open) {
      if (!ok()) return;
      nz({ f: open ? 2400 : 3000, q: 7, dur: 0.03, gain: 0.5 }); tone({ f: open ? 620 : 760, f2: 380, dur: 0.06, gain: 0.16, type: 'triangle' });
      nz({ f: 2000, q: 5, dur: 0.03, gain: 0.3, when: 0.07 });
    },
    lock(on) {
      if (!ok()) return;
      nz({ f: on ? 900 : 1500, q: 2, dur: 0.07, gain: 0.5 }); tone({ f: on ? 170 : 240, f2: on ? 85 : 160, dur: 0.13, gain: 0.42 });
      if (on) nz({ f: 2600, q: 6, dur: 0.03, gain: 0.25, when: 0.05 });
    },
    clunk() {    // wheel refuses against the lock
      if (!ok('clunk', 0.28)) return;
      tone({ f: 120, f2: 52, dur: 0.22, gain: 0.7 }); nz({ f: 420, q: 1.2, dur: 0.09, gain: 0.55, type: 'lowpass' });
      nz({ f: 2300, q: 9, dur: 0.05, gain: 0.2, when: 0.03 }); tone({ f: 660, f2: 610, dur: 0.16, gain: 0.05, type: 'triangle', when: 0.02 });
    },
    thud() {     // wax block lands on the closed guard
      if (!ok('thud', 0.3)) return;
      tone({ f: 210, f2: 95, dur: 0.14, gain: 0.5 }); nz({ f: 700, q: 0.8, dur: 0.07, gain: 0.35, type: 'lowpass' });
    },
    snap(open) { if (!ok()) return; nz({ f: open ? 1900 : 1400, q: 4, dur: 0.045, gain: 0.5 }); tone({ f: open ? 520 : 400, f2: 260, dur: 0.07, gain: 0.2, type: 'triangle' }); },
    crumple() {
      if (!ok('crumple', 0.2)) return;
      for (let i = 0; i < 9; i++) nz({ f: 2500 + Math.random() * 5000, q: 2 + Math.random() * 4, dur: 0.02 + Math.random() * 0.04, gain: 0.25 + Math.random() * 0.25, when: i * 0.028 + Math.random() * 0.02 });
      tone({ f: 420, f2: 150, dur: 0.2, gain: 0.12, type: 'sawtooth' });
    },
    tear() { if (!ok('tear', 0.2)) return; nz({ f: 5200, f2: 1600, q: 1.5, dur: 0.16, gain: 0.3 }); },
    crack() {    // thick chunk breaks off
      if (!ok('crack', 0.15)) return;
      nz({ f: 1700, q: 1, dur: 0.06, gain: 0.8 }); tone({ f: 240, f2: 70, dur: 0.2, gain: 0.6 });
      for (let i = 0; i < 4; i++) nz({ f: 900 + Math.random() * 2500, q: 3, dur: 0.03, gain: 0.3, when: 0.05 + i * 0.04 });
    },
    scrape() { if (!ok('scrape', 0.25)) return; nz({ f: 700, f2: 2300, q: 3, dur: 0.22, gain: 0.5 }); tone({ f: 130, f2: 190, dur: 0.2, gain: 0.16, type: 'sawtooth' }); },
    limit() { if (!ok('limit', 0.3)) return; tone({ f: 150, f2: 80, dur: 0.12, gain: 0.5 }); nz({ f: 1700, q: 6, dur: 0.04, gain: 0.35 }); },
    blockOut() {
      if (!ok('blockOut', 1)) return;
      tone({ f: 130, f2: 60, dur: 0.25, gain: 0.6 }); nz({ f: 500, q: 1, dur: 0.1, gain: 0.5, type: 'lowpass' });
      tone({ f: 660, dur: 0.16, gain: 0.16, type: 'triangle', when: 0.22 }); tone({ f: 440, dur: 0.3, gain: 0.16, type: 'triangle', when: 0.4 });
    },
    good(n) {    // a clean section joined the ribbon
      if (!ok('good', 0.05)) return;
      const f = 660 * Math.pow(2, (Math.min(n, 12) % 13) / 12);
      tone({ f, dur: 0.11, gain: 0.07, type: 'sine' }); tone({ f: f * 2, dur: 0.07, gain: 0.025, type: 'sine', when: 0.01 });
    },
    pop() { if (!ok('pop', 0.05)) return; tone({ f: 300, f2: 620, dur: 0.07, gain: 0.14, type: 'triangle' }); nz({ f: 1200, f2: 4200, q: 1.2, dur: 0.12, gain: 0.1 }); },
    unpop() { if (!ok('unpop', 0.05)) return; tone({ f: 520, f2: 260, dur: 0.07, gain: 0.1, type: 'triangle' }); },
    whoosh() { if (!ok('whoosh', 0.2)) return; nz({ f: 500, f2: 3200, q: 0.8, dur: 0.32, gain: 0.3, att: 0.1 }); },
    zip(dur) { if (!ok()) return; for (let i = 0; i < 14; i++) nz({ f: 2800, q: 7, dur: 0.016, gain: 0.2, when: (i / 14) * (dur || 0.3) }); },
    slide() { if (!ok()) return; nz({ f: 900, f2: 1800, q: 1.5, dur: 0.25, gain: 0.16, att: 0.06 }); },
    // --- continuous beds, set every frame ---
    setCut(level, kind) {
      if (!ctx) return;
      const t = ctx.currentTime, on = enabled && ctx.state === 'running';
      hissG.gain.setTargetAtTime(on && kind !== 'chunk' ? level : 0, t, 0.02);
      rubG.gain.setTargetAtTime(on && kind === 'chunk' ? level * 1.4 : 0, t, 0.02);
    },
    setCutTone(um) { if (ctx) hissF.frequency.setTargetAtTime(6800 - Math.min(20, um) * 190, ctx.currentTime, 0.03); },
    setWheel(speed) {
      if (!ctx) return;
      const v = Math.min(1, Math.abs(speed) / 14);
      whirG.gain.setTargetAtTime(enabled ? v * 0.22 : 0, ctx.currentTime, 0.05);
      whirF.frequency.setTargetAtTime(160 + v * 520, ctx.currentTime, 0.05);
    },
  };
  MT.Audio = A;
})();
