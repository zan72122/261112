// All sound is synthesised with Web Audio (no samples). Starts on the first touch; failures are silent.
export class Sound {
  constructor() { this.ctx = null; this.ok = false; this.loops = {}; this.last = {}; this.failed = false; }
  start() {
    if (this.ctx || this.failed) { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {}); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) throw new Error('no audio');
      const c = this.ctx = new AC();
      this.master = c.createGain(); this.master.gain.value = 0.8;
      const comp = c.createDynamicsCompressor(); this.master.connect(comp); comp.connect(c.destination);
      const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      let s = 12345; for (let i = 0; i < len; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = (s / 2147483648 - 1); }
      this.noise = buf;
      const loop = (name, type, f, q) => {
        const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
        const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
        const g = c.createGain(); g.gain.value = 0; src.connect(fl); fl.connect(g); g.connect(this.master); src.start();
        this.loops[name] = { g, fl };
      };
      loop('water', 'bandpass', 1100, 0.6); loop('slosh', 'lowpass', 520, 0.4); loop('whoosh', 'bandpass', 500, 0.8);
      loop('drain', 'bandpass', 280, 5); loop('wind', 'bandpass', 420, 0.35); loop('rain', 'highpass', 2600, 0.3);
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 40; const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 260;
      const g = c.createGain(); g.gain.value = 0; o.connect(fl); fl.connect(g); g.connect(this.master); o.start(); this.loops.motor = { g, fl, o };
      if (c.state === 'suspended') c.resume().catch(() => {});
      this.ok = true;
    } catch (e) { this.failed = true; this.ctx = null; this.ok = false; }
  }
  suspend(on) { try { if (this.ctx) { if (on) this.ctx.suspend(); else this.ctx.resume(); } } catch (e) { /* ignore */ } }
  level(name, v, f) {
    if (!this.ok) return; const l = this.loops[name]; if (!l) return;
    try { const t = this.ctx.currentTime; l.g.gain.setTargetAtTime(v, t, 0.12); if (f !== undefined) { (l.o ? l.o.frequency : l.fl.frequency).setTargetAtTime(f, t, 0.1); if (l.o) l.fl.frequency.setTargetAtTime(f * 5 + 120, t, 0.1); } } catch (e) { /* ignore */ }
  }
  _tone(type, f0, f1, dur, gain, delay = 0) {
    const c = this.ctx, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  }
  _noise(type, f, q, dur, gain, delay = 0, f1) {
    const c = this.ctx, t = c.currentTime + delay, s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q; if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(this.master); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.03);
  }
  play(name, a = 1) {
    if (!this.ok) return;
    const now = performance.now(); if (this.last[name] && now - this.last[name] < 45) return; this.last[name] = now;
    try {
      const r = Math.random();
      switch (name) {
        case 'grab': this._noise('bandpass', 1300, 0.7, 0.09, 0.14 * a); break;
        case 'thud': this._tone('sine', 110, 55, 0.16, 0.4 * a); this._noise('lowpass', 420, 0.5, 0.12, 0.18 * a); break;
        case 'wetthud': this._tone('sine', 90, 48, 0.2, 0.42 * a); this._noise('bandpass', 800, 0.6, 0.16, 0.2 * a); break;
        case 'bonk': this._tone('sine', 240, 150, 0.22, 0.16 * a); this._noise('lowpass', 500, 0.5, 0.1, 0.12 * a); break;
        case 'click': this._noise('highpass', 2200, 0.5, 0.025, 0.25 * a); this._tone('sine', 1500, 900, 0.03, 0.12 * a); break;
        case 'clack': this._tone('sine', 170, 90, 0.09, 0.4 * a); this._noise('highpass', 1800, 0.5, 0.03, 0.2 * a); this._tone('sine', 120, 70, 0.1, 0.25 * a, 0.07); break;
        case 'tick': this._tone('sine', 950, 800, 0.02, 0.14 * a); break;
        case 'plink': this._tone('sine', 1000 + r * 700, 1700 + r * 900, 0.06, 0.09 * a); break;
        case 'splash': this._noise('bandpass', 900, 0.6, 0.28, 0.22 * a, 0, 500); break;
        case 'koron': this._tone('triangle', 660, 660, 0.12, 0.28); this._tone('triangle', 880, 880, 0.12, 0.26, 0.1); this._tone('triangle', 523, 500, 0.22, 0.28, 0.21); break;
        case 'pin': this._noise('bandpass', 2600, 3, 0.035, 0.4 * a); this._tone('sine', 720, 520, 0.03, 0.14 * a); break;
        case 'pop': this._tone('sine', 420, 760, 0.07, 0.2 * a); break;
        case 'slide': this._noise('lowpass', 520, 0.6, 0.3, 0.16 * a); break;
        case 'fold': this._noise('bandpass', 760, 0.5, 0.15, 0.1 * a); break;
        case 'peel': this._noise('bandpass', 1700, 0.9, 0.07, 0.16 * a); break;
        case 'whoosh': this._noise('bandpass', 300, 0.7, 0.7, 0.14 * a, 0, 900); break;
        case 'soft': this._tone('sine', 520, 660, 0.12, 0.1 * a); break;
        case 'wiggle': this._tone('sine', 300, 340, 0.05, 0.08); this._tone('sine', 340, 300, 0.05, 0.08, 0.06); break;
        case 'chime': [523, 659, 784, 1047, 1319].forEach((f, i) => { this._tone('sine', f, f, 1.1, 0.16, i * 0.11); this._tone('sine', f * 2.01, f * 2.01, 0.5, 0.04, i * 0.11); }); break;
        case 'nuzzle': this._noise('lowpass', 700, 0.4, 0.5, 0.08); this._tone('sine', 392, 440, 0.4, 0.07, 0.05); break;
      }
    } catch (e) { /* ignore */ }
  }
}
