// 音はすべて Web Audio で合成する。開始に失敗しても遊びは続く
export class Audio {
  constructor() { this.ctx = null; this.ok = false; this.failed = false; this.loops = {}; this.lastPat = 0; this.lastVoice = { parent: -9, kid: -9 }; this.started = 0; }
  // 最初のタッチで呼ぶ
  start() {
    if (this.ctx) { if (this.ctx.state === 'suspended') { try { const p = this.ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* 無音で続行 */ } } return; }
    if (this.failed) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) { this.failed = true; return; }
      const ctx = (this.ctx = new AC()); const p = ctx.resume && ctx.resume(); if (p && p.catch) p.catch(() => {});
      this.master = ctx.createGain(); this.master.gain.value = 0.85; const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 5; this.master.connect(comp); comp.connect(ctx.destination);
      const len = ctx.sampleRate * 2; const buf = ctx.createBuffer(1, len, ctx.sampleRate); const d = buf.getChannelData(0); let b0 = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = 0.97 * b0 + 0.03 * w; d[i] = w * 0.6 + b0 * 3.2; } this.noise = buf;
      this.loops.faucet = this.loop(1500, 0.8, 'bandpass'); this.loops.fill = this.loop(420, 1.6, 'bandpass'); this.loops.shower = this.loop(4200, 0.5, 'highpass'); this.loops.drain = this.loop(260, 5, 'bandpass'); this.loops.swish = this.loop(900, 0.9, 'bandpass'); this.loops.rub = this.loop(2300, 0.7, 'bandpass'); this.loops.breath = this.loop(520, 1.2, 'lowpass'); this.loops.over = this.loop(700, 2.2, 'bandpass');
      // 排水のごぼごぼ
      const lfo = ctx.createOscillator(); lfo.frequency.value = 8.5; const lg = ctx.createGain(); lg.gain.value = 90; lfo.connect(lg); lg.connect(this.loops.drain.f.frequency); lfo.start();
      this.ok = true; this.started = ctx.currentTime;
    } catch (e) { this.failed = true; this.ok = false; }
  }
  loop(freq, q, type) { const ctx = this.ctx; const s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true; s.playbackRate.value = 0.8 + Math.random() * 0.4; const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const g = ctx.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(this.master); s.start(); return { f, g, v: 0 }; }
  set(name, v, freq) { if (!this.ok) return; const l = this.loops[name]; if (!l) return; if (Math.abs(v - l.v) > 0.004) { l.v = v; try { l.g.gain.setTargetAtTime(v, this.ctx.currentTime, 0.06); } catch (e) { /* 続行 */ } } if (freq) { try { l.f.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1); } catch (e) { /* 続行 */ } } }
  suspend() { if (this.ctx && this.ctx.state === 'running') { try { const p = this.ctx.suspend(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* 続行 */ } } }
  resume() { if (this.ctx && this.ctx.state === 'suspended') { try { const p = this.ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* 続行 */ } } }
  tone(type, f0, f1, dur, vol, delay = 0, q) {
    if (!this.ok) return; try { const ctx = this.ctx, t = ctx.currentTime + delay; const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur); const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.012, dur * 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      let last = o; if (q) { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = q[0]; f.Q.value = q[1]; o.connect(f); last = f; } last.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02); } catch (e) { /* 続行 */ }
  }
  burst(freq0, freq1, dur, vol, q = 1, delay = 0) {
    if (!this.ok) return; try { const ctx = this.ctx, t = ctx.currentTime + delay; const s = ctx.createBufferSource(); s.buffer = this.noise; s.playbackRate.value = 0.7 + Math.random() * 0.6; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(freq0, t); f.frequency.exponentialRampToValueAtTime(freq1, t + dur); const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + dur + 0.05); } catch (e) { /* 続行 */ }
  }
  // 水滴
  plink(pitch = 1, vol = 0.25) { const f = (900 + Math.random() * 500) * pitch; this.tone('sine', f, f * 1.9, 0.07, vol); }
  // 着水
  plop(power, deep) { this.burst(1800, 300, 0.35 + power * 0.25, 0.22 + power * 0.3, 0.8); this.tone('sine', deep ? 240 : 420, deep ? 90 : 200, 0.16, 0.25 + power * 0.2); }
  // 縁へ乗る水
  slosh(power) { this.burst(2400, 400, 0.9, 0.3 + power * 0.3, 0.6); this.burst(700, 220, 1.1, 0.2, 1.2, 0.08); }
  pat(pitch, wet) { if (!this.ok) return; const now = this.ctx.currentTime; if (now - this.lastPat < 0.06) return; this.lastPat = now; if (wet) this.burst(1500 * pitch, 600, 0.07, 0.12, 1.5); else this.tone('sine', 300 * pitch, 150, 0.05, 0.12); }
  tok() { this.tone('triangle', 620, 420, 0.07, 0.18); this.tone('triangle', 500, 380, 0.07, 0.12, 0.09); }
  squeak() { this.tone('sine', 700, 1200, 0.09, 0.07); }
  // 鳴き声: 親はガア、子はピヨ
  voice(kind, vol = 1) {
    if (!this.ok) return; const now = this.ctx.currentTime; if (now - this.lastVoice[kind] < 0.9) return; this.lastVoice[kind] = now;
    if (kind === 'kid') { const f = 2700 + Math.random() * 500; this.tone('sine', f, f * 1.35, 0.085, 0.16 * vol); this.tone('sine', f * 1.05, f * 1.45, 0.08, 0.14 * vol, 0.14); if (Math.random() < 0.5) this.tone('sine', f * 1.1, f * 1.5, 0.08, 0.12 * vol, 0.28); }
    else { const f = 330 + Math.random() * 50; const n = Math.random() < 0.5 ? 2 : 3; for (let i = 0; i < n; i++) { this.tone('sawtooth', f * (1 - i * 0.05), f * 0.72, 0.13, 0.2 * vol, i * 0.17, [1250, 2.2]); this.tone('square', f * 2.01, f * 1.4, 0.11, 0.045 * vol, i * 0.17, [2500, 3]); } }
  }
  // はなまる: やわらかい三つの音
  chime() { const notes = [523.25, 659.25, 783.99, 1046.5]; notes.forEach((f, i) => { this.tone('sine', f, f, 1.1, 0.13, 0.1 + i * 0.16); this.tone('sine', f * 2, f * 2, 0.6, 0.035, 0.1 + i * 0.16); }); this.tone('sine', 150, 80, 0.12, 0.3, 0.0); }
}
