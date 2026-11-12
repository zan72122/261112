// audio.js — Web Audio の合成音のみ。開始を拒否されても無音で続行する。
export class Sound {
  constructor() { this.ctx = null; this.ok = false; this.tried = false; this.count = 0; }
  start() {
    if (this.ctx) { if (this.ctx.state === 'suspended') { try { const p = this.ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* 無音で続行 */ } } return; }
    if (this.tried) return; this.tried = true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const c = (this.ctx = new AC());
      this.master = c.createGain(); this.master.gain.value = 0.8;
      const comp = c.createDynamicsCompressor(); this.master.connect(comp); comp.connect(c.destination);
      const len = c.sampleRate * 1.5, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = buf;
      this.rustle = this._loop(3200, 0.7, 'bandpass'); this.shut = this._loop(900, 1.2, 'bandpass'); this.roll = this._loop(240, 0.8, 'lowpass');
      const p = c.resume(); if (p && p.catch) p.catch(() => {});
      this.ok = true;
    } catch (e) { this.ok = false; this.ctx = null; }
  }
  _loop(freq, q, type) {
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = c.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(this.master); s.start();
    return { g, f };
  }
  _set(n, v, freq) { if (!this.ok) return; const t = this.ctx.currentTime; n.g.gain.setTargetAtTime(v, t, 0.04); if (freq) n.f.frequency.setTargetAtTime(freq, t, 0.05); }
  setRustle(v) { this._set(this.rustle, Math.min(0.22, v), 2600 + v * 6000); }
  setShutter(v) { this._set(this.shut, Math.min(0.32, v * 0.5), 600 + v * 900); }
  setRoll(v) { this._set(this.roll, Math.min(0.3, v), 180 + v * 500); }
  quiet() { if (!this.ok) return; this.setRustle(0); this.setShutter(0); this.setRoll(0); }
  suspend() { if (this.ctx && this.ctx.state === 'running') { try { this.ctx.suspend(); } catch (e) { /* */ } } }
  resume() { if (this.ctx && this.ctx.state === 'suspended') { try { const p = this.ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* */ } } }
  _tone(type, f0, f1, dur, vol, delay = 0) {
    if (!this.ok) return; this.count++;
    const c = this.ctx, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  }
  _burst(freq, q, dur, vol, delay = 0, type = 'bandpass') {
    if (!this.ok) return; this.count++;
    const c = this.ctx, t = c.currentTime + delay, s = c.createBufferSource(); s.buffer = this.noise;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }
  // 「ことん」: 品物ごとに高さを変える
  koton(kind = 'milk', vol = 1) {
    const f = { milk: 150, apple: 210, berry: 320, bread: 120, basket: 180, tray: 260 }[kind] || 170;
    this._tone('sine', f * 1.9, f, 0.11, 0.5 * vol); this._burst(f * 6, 1.2, 0.05, 0.25 * vol); this._tone('sine', f * 1.5, f * 0.9, 0.09, 0.22 * vol, 0.075);
  }
  tap(vol = 0.5) { this._burst(1800, 2, 0.03, 0.18 * vol); this._tone('sine', 420, 300, 0.05, 0.12 * vol); }
  beep() { this._tone('square', 1960, 1960, 0.09, 0.16); this._tone('sine', 2940, 2940, 0.09, 0.12); }
  blip() { this._tone('sine', 1300, 1300, 0.035, 0.06); }
  click() { this._burst(2400, 3, 0.02, 0.3); this._tone('square', 190, 120, 0.04, 0.16); this._burst(1500, 3, 0.02, 0.2, 0.09); }
  bell() { for (const [f, v, d] of [[1320, 0.3, 0.9], [2640, 0.14, 0.6], [3960, 0.07, 0.4]]) this._tone('sine', f, f, d, v); this._burst(3000, 1, 0.03, 0.2); }
  clack() { this._burst(1200, 2, 0.04, 0.4); this._tone('triangle', 520, 340, 0.06, 0.22); this._burst(900, 2, 0.04, 0.22, 0.06); }
  hook() { this._tone('sine', 2400, 2100, 0.05, 0.1); this._burst(4200, 4, 0.025, 0.16); }
  clank(v = 1) { this._burst(700, 4, 0.12, 0.4 * v); this._tone('triangle', 310, 250, 0.25, 0.2 * v); this._tone('sine', 1240, 1180, 0.2, 0.06 * v); }
  stamp() { this._tone('sine', 140, 60, 0.16, 0.7); this._burst(500, 1, 0.06, 0.4); }
  chime() { [784, 988, 1175, 1568].forEach((f, i) => { this._tone('sine', f, f, 0.7, 0.2, i * 0.11); this._tone('sine', f * 2, f * 2, 0.4, 0.05, i * 0.11); }); }
  pop() { this._tone('sine', 500, 900, 0.07, 0.16); }
  step() { this._burst(300, 1, 0.05, 0.07, 0, 'lowpass'); }
  swish() { this._burst(2200, 0.8, 0.22, 0.12); }
}
