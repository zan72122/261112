/* All sound is synthesised with WebAudio (no files). One-shots for clicks, clinks, pops and
   jingles; continuous voices for the pour, sputter, scraping, hum and freezing crackle. */
(function () {
  'use strict';
  const EC = window.EC;
  const U = EC.U;
  const A = (EC.audio = { ctx: null, muted: false, ready: false });
  let ctx = null, master = null, wet = null, noiseBuf = null;
  const voices = {};

  function now() { return ctx.currentTime; }

  function makeNoise() {
    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  function makeReverb() {
    const len = Math.floor(ctx.sampleRate * 1.1);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / len;
        lp += ((Math.random() * 2 - 1) - lp) * 0.35;
        d[i] = lp * Math.pow(1 - t, 3.2) * (i < 300 ? i / 300 : 1);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    wet = ctx.createGain();
    wet.gain.value = 0.22;
    wet.connect(conv); conv.connect(master);
  }

  A.init = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ctx = new AC(); } catch (e) { return; }
    A.ctx = ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 5; comp.attack.value = 0.004; comp.release.value = 0.2;
    master = ctx.createGain();
    master.gain.value = A.muted ? 0 : 0.9;
    master.connect(comp); comp.connect(ctx.destination);
    makeNoise(); makeReverb();
    startVoices();
    A.ready = true;
    if (ctx.state === 'suspended') ctx.resume();
  };
  A.setMuted = function (m) {
    A.muted = m;
    if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, now(), 0.03);
  };
  A.suspend = function (on) { if (ctx) { if (on) ctx.suspend(); else if (!A.muted || true) ctx.resume(); } };

  // ---- building blocks ----
  function out(g, rev) { g.connect(master); if (rev) { const s = ctx.createGain(); s.gain.value = rev; g.connect(s); s.connect(wet); } }
  function tone(type, f0, f1, dur, vol, rev, delay, attack) {
    if (!A.ready) return;
    const t = now() + (delay || 0);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); out(g, rev);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function burst(freq, q, dur, vol, type, rev, delay, f1) {
    if (!A.ready) return;
    const t = now() + (delay || 0);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true;
    s.playbackRate.value = 0.7 + Math.random() * 0.6;
    f.type = type || 'bandpass'; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); out(g, rev);
    s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.03);
  }
  function loopNoise(type, freq, q) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true;
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.value = 0;
    s.connect(f); f.connect(g);
    s.start();
    return { src: s, filter: f, gain: g };
  }

  function startVoices() {
    // pour: hiss of the falling thread + low gurgle of the pool
    const p1 = loopNoise('bandpass', 2400, 0.9); out(p1.gain, 0.15);
    const p2 = loopNoise('bandpass', 520, 3.5); out(p2.gain, 0.1);
    voices.pour = p1; voices.gurgle = p2;
    // scrape of steel on steel
    const sc = loopNoise('bandpass', 3100, 2.2); out(sc.gain, 0.1);
    voices.scrape = sc;
    // sticky strain when a block is pulled too early
    const st = loopNoise('bandpass', 700, 6); out(st.gain, 0.05);
    voices.strain = st;
    // machine hum (heater transformer + fan) and cold plate compressor
    const hum = ctx.createGain(); hum.gain.value = 0;
    [[100, 0.5], [200, 0.22], [300, 0.08]].forEach(function (h) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = h[0]; g.gain.value = h[1];
      o.connect(g); g.connect(hum); o.start();
    });
    out(hum, 0.1);
    voices.hum = hum;
    const fan = loopNoise('lowpass', 420, 0.3); out(fan.gain, 0.05);
    voices.fan = fan;
    const cmp = ctx.createGain(); cmp.gain.value = 0;
    [[49, 0.6], [98, 0.3], [147, 0.16]].forEach(function (h) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = h[0]; g.gain.value = h[1];
      o.connect(g); g.connect(cmp); o.start();
    });
    out(cmp, 0.1);
    voices.cmp = cmp;
  }
  function setGain(v, val, tc) { v.gain.setTargetAtTime(val, now(), tc || 0.04); }

  // ---- one-shots ----
  A.tick = function (v) { burst(3800, 3, 0.03, 0.12 * (v || 1)); tone('square', 1900, 900, 0.025, 0.03 * (v || 1)); };
  A.click = function (v) { burst(2200, 2, 0.045, 0.2 * (v || 1)); tone('sine', 300, 120, 0.05, 0.12 * (v || 1)); };
  A.clack = function (v) { burst(1500, 1.6, 0.06, 0.26 * v, 'bandpass', 0.2); tone('triangle', 420, 160, 0.07, 0.14 * v, 0.2); };
  A.clink = function (v, pitch) {
    const k = pitch || 1;
    [[2140, 0.16], [3390, 0.11], [5120, 0.08], [7730, 0.05]].forEach(function (pp, i) {
      tone('sine', pp[0] * k * (1 + (Math.random() - 0.5) * 0.02), pp[0] * k, 0.09 + 0.16 / (i + 1), 0.09 * v * (1 - i * 0.18), 0.5);
    });
    burst(4200, 1, 0.02, 0.2 * v);
  };
  A.thud = function (v) { burst(240, 0.8, 0.11, 0.42 * v, 'lowpass', 0.15); tone('sine', 120, 55, 0.12, 0.3 * v, 0.1); };
  A.plastic = function (v) { burst(1700, 2.4, 0.05, 0.22 * v, 'bandpass', 0.2); tone('triangle', 680, 420, 0.045, 0.1 * v, 0.2); };
  A.frost = function (v) { burst(5200, 0.8, 0.22, 0.12 * v, 'highpass', 0.3); A.clink(v * 0.55, 0.72); };
  A.splat = function (v) { burst(900, 0.9, 0.09, 0.2 * v, 'bandpass', 0.2, 0, 320); tone('sine', 300, 110, 0.08, 0.08 * v); };
  A.plink = function (v, p) { const f = (p || 1) * (880 + Math.random() * 500); tone('sine', f, f * 1.9, 0.07, 0.11 * (v || 1), 0.6); tone('sine', f * 2.4, f * 2.1, 0.05, 0.03 * (v || 1), 0.6); };
  A.blub = function (v, p) { const f = (p || 1) * (260 + Math.random() * 260); tone('sine', f, f * 2.2, 0.07, 0.12 * (v || 1), 0.2, 0, 0.012); };
  A.spit = function (v) { burst(1500 + Math.random() * 1500, 1.4, 0.05, 0.25 * v, 'bandpass', 0.2); A.blub(0.8 * v, 0.7); };
  A.hiss = function (v, dur) { burst(6200, 0.7, dur || 0.5, 0.11 * v, 'highpass', 0.25); };
  A.sizzle = function (v) { burst(5400, 1.2, 0.16, 0.1 * (v || 1), 'highpass', 0.2); if (Math.random() < 0.6) burst(3000, 4, 0.02, 0.1, 'bandpass', 0.2, 0.05); };
  A.squish = function (v) { burst(420, 1.2, 0.2, 0.26 * v, 'bandpass', 0.15, 0, 1300); A.blub(0.8, 1.3); setTimeout(function () { A.blub(0.6, 1.7); }, 90); };
  A.crackle = function (v) { for (let i = 0; i < 3; i++) burst(3000 + Math.random() * 4000, 5, 0.012 + Math.random() * 0.02, 0.2 * v, 'bandpass', 0.3, i * 0.03 * Math.random()); };
  A.crack = function () { burst(2600, 1.2, 0.07, 0.5, 'bandpass', 0.4); burst(900, 2, 0.12, 0.35, 'bandpass', 0.4, 0.012); tone('square', 260, 70, 0.09, 0.12, 0.3); };
  A.creak = function (v, up) { tone('sawtooth', up ? 190 : 260, up ? 300 : 150, 0.16, 0.035 * v, 0.3, 0, 0.03); burst(1300, 6, 0.16, 0.05 * v, 'bandpass', 0.3); };
  A.whoosh = function (v) { burst(700, 0.9, 0.22, 0.12 * (v || 1), 'bandpass', 0.2, 0, 2600); };
  A.slice = function () { burst(1800, 1.5, 0.34, 0.16, 'bandpass', 0.4, 0, 7000); tone('sine', 900, 2800, 0.3, 0.05, 0.5); };
  A.pop = function (res) {
    if (!res.bonded) { A.plastic(1); tone('sine', 300, 180, 0.2, 0.08, 0.3, 0.05); return; }
    if (res.soft > 0.4) { burst(380, 1, 0.3, 0.4, 'lowpass', 0.2, 0, 150); A.blub(1, 0.5); setTimeout(function () { A.blub(0.8, 0.4); A.splat(0.8); }, 120); return; }
    if (res.cracked) { A.crack(); tone('sine', 420, 170, 0.09, 0.3, 0.3, 0.03); return; }
    tone('sine', 520, 150, 0.09, 0.5, 0.35); burst(2600, 1.2, 0.03, 0.4, 'bandpass', 0.4); A.clink(0.5, 1.15);
  };
  A.jingle = function (mark) {
    const seq = { oo: [1047, 1319, 1568, 2093], o: [1047, 1568], tri: [784, 740], x: [440, 311] }[mark] || [];
    seq.forEach(function (f, i) {
      const d = 0.12 * i + 0.28;
      if (mark === 'x' || mark === 'tri') tone('triangle', f, f * (mark === 'x' ? 0.82 : 1), 0.3, 0.14, 0.4, d, 0.02);
      else { tone('sine', f, f, 0.5, 0.14, 0.7, d, 0.008); tone('sine', f * 3.01, f * 3, 0.2, 0.03, 0.7, d, 0.004); }
    });
  };
  A.ding = function () { tone('sine', 1760, 1760, 0.4, 0.09, 0.7, 0, 0.006); tone('sine', 2637, 2637, 0.3, 0.05, 0.7, 0.06, 0.006); };
  A.deny = function () { tone('triangle', 220, 180, 0.09, 0.1, 0.2); tone('triangle', 196, 160, 0.1, 0.1, 0.2, 0.1); };

  // ---- continuous state, fed once per frame ----
  let crackAcc = 0, drainAcc = 0, blubAcc = 0, relayT = 6, cmpOn = 1;
  A.frame = function (dt, s) {
    if (!A.ready || ctx.state !== 'running') return;
    // pour
    const q = s.flow;
    setGain(voices.pour.gain, q > 0.05 ? 0.035 + 0.05 * Math.min(1, q / 2.7) : 0, 0.03);
    voices.pour.filter.frequency.setTargetAtTime(1800 + 1200 * Math.min(1, q / 2.7), now(), 0.05);
    const pool = s.landing * (s.landKind === 'mold' ? 1 : 0.45);
    setGain(voices.gurgle.gain, pool * 0.1, 0.05);
    // the cavity sounds higher as it fills, like a bottle
    voices.gurgle.filter.frequency.setTargetAtTime(380 + 1500 * U.sat(s.fill) + (s.landKind === 'mold' ? 0 : 900), now(), 0.08);
    if (pool > 0.2) {
      blubAcc += dt * (5 + 9 * pool);
      if (blubAcc > 1) { blubAcc = 0; A.blub(0.35 * pool, 0.8 + s.fill * 1.6); }
    }
    setGain(voices.scrape.gain, s.scrape * (s.scrapeCold ? 0.05 : 0.028), 0.04);
    voices.scrape.filter.frequency.setTargetAtTime(s.scrapeCold ? 4600 : 3000, now(), 0.05);
    setGain(voices.strain.gain, s.strain * 0.16, 0.03);
    voices.strain.filter.frequency.setTargetAtTime(500 + 700 * s.strain, now(), 0.03);
    setGain(voices.hum, 0.011, 0.5);
    setGain(voices.fan.gain, 0.022, 0.5);
    setGain(voices.cmp, cmpOn ? 0.012 : 0.003, 0.6);
    relayT -= dt;
    if (relayT <= 0) { relayT = 7 + Math.random() * 9; cmpOn = cmpOn ? 0 : 1; A.click(0.25); }
    // freezing: tiny cracks as the front advances
    crackAcc += dt * Math.max(0, s.freeze) * 90;
    if (crackAcc > 1) { crackAcc = Math.random() * 0.4; burst(3500 + Math.random() * 5000, 6, 0.01 + Math.random() * 0.015, 0.05 + Math.random() * 0.06, 'bandpass', 0.5); }
    // drain: drips into the tray below
    drainAcc += s.drain * 9;
    if (drainAcc > 1) { drainAcc = 0; A.plink(0.5, 0.8 + Math.random() * 0.5); }
  };
})();
