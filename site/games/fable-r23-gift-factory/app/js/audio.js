/* All sound is synthesised with WebAudio: belt hum, clacks, pops, bells, robot voices, parade music. */
(function () {
'use strict';
const U = GF.U;
const A = GF.audio = { ctx: null };
let ctx = null, master = null, nbuf = null, hum = null, musicG = null, farG = null, cur = null;
const last = {};
function gate(name, ms) { const n = performance.now(); if (last[name] && n - last[name] < ms) return false; last[name] = n; return true; }

A.init = function () {
  if (ctx) return;
  try { const AC = window.AudioContext || window.webkitAudioContext; ctx = A.ctx = new AC(); } catch (e) { ctx = null; return; }
  master = ctx.createGain(); master.gain.value = .75;
  const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
  nbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  musicG = ctx.createGain(); musicG.gain.value = 0; musicG.connect(master);
  farG = ctx.createGain(); farG.gain.value = .16; farG.connect(master); cur = master;
  startHum();
};
A.unlock = function () {
  if (!ctx) A.init();
  if (ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) { /* ignore */ } }
};
function tone(type, f0, f1, dur, vol, delay, dest, attack) {
  const t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(Math.max(20, f0), t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + (attack || .008));
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(dest || cur); o.start(t); o.stop(t + dur + .05);
  return o;
}
function noise(dur, vol, type, f0, f1, q, delay, dest) {
  const t = ctx.currentTime + (delay || 0), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = nbuf; s.loop = true; f.type = type; f.Q.value = q || 1;
  f.frequency.setValueAtTime(Math.max(30, f0), t); if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(.02, dur * .3));
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(dest || cur); s.start(t, Math.random()); s.stop(t + dur + .05);
}
function startHum() {                                 // soft "goto-goto" of the belts
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), l = ctx.createOscillator(), lg = ctx.createGain();
  s.buffer = nbuf; s.loop = true; f.type = 'lowpass'; f.frequency.value = 190; g.gain.value = .11;
  l.type = 'sine'; l.frequency.value = 3.1; lg.gain.value = .05; l.connect(lg); lg.connect(g.gain);
  s.connect(f); f.connect(g); g.connect(master); s.start(); l.start(); hum = g;
}
A.far = function (on) { if (ctx) cur = on ? farG : master; };   // sounds from areas beside us are faint
const ok = (name, ms) => ctx && gate(name, ms === undefined ? 45 : ms);

A.katan = function (v) { if (!ok('katan')) return; v = v || 1; noise(.04, .3 * v, 'bandpass', 1900, 1500, 3); tone('triangle', 330, 210, .07, .22 * v); noise(.05, .22 * v, 'bandpass', 1300, 1000, 3, .1); tone('triangle', 250, 160, .08, .18 * v, .1); };
A.pon = function (v) { if (!ok('pon')) return; tone('sine', 620, 190, .14, .45 * (v || 1)); };
A.chirin = function (p) {
  if (!ok('chirin', 90)) return; p = p || 1;
  for (let k = 0; k < 3; k++) {
    const dl = k * .1 + Math.random() * .02, f = 1750 * p * (1 + (k % 2) * .06);
    tone('sine', f, f, .55, .16, dl); tone('sine', f * 2.76, f * 2.76, .3, .07, dl); tone('sine', f * 5.4, f * 5.4, .16, .03, dl);
  }
};
A.shiin = function () { if (!ok('shiin', 120)) return; noise(.55, .05, 'bandpass', 700, 260, .7); tone('sine', 200, 150, .3, .05); };
A.boyon = function (p) {
  if (!ok('boyon', 80)) return; p = p || 1;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(150 * p, t); o.frequency.exponentialRampToValueAtTime(430 * p, t + .12);
  o.frequency.exponentialRampToValueAtTime(190 * p, t + .26); o.frequency.exponentialRampToValueAtTime(330 * p, t + .38); o.frequency.exponentialRampToValueAtTime(170 * p, t + .52);
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.35, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .55);
  o.connect(g); g.connect(cur); o.start(t); o.stop(t + .6);
};
A.petan = function () { if (!ok('petan', 80)) return; noise(.1, .4, 'lowpass', 420, 160, 1); tone('sine', 120, 62, .16, .4); };
A.thud = function () { if (!ok('thud', 100)) return; noise(.25, .5, 'lowpass', 300, 80, 1); tone('sine', 80, 38, .35, .6); };
A.clack = function () { if (!ok('clack')) return; noise(.03, .4, 'highpass', 2200, 2200, 1); tone('square', 170, 90, .07, .16); };
A.ding = function () { if (!ok('ding', 80)) return; tone('sine', 1320, 1320, .5, .16); tone('sine', 1980, 1980, .3, .06); };
A.whoosh = function (v) { if (!ok('whoosh', 80)) return; noise(.28, .16 * (v || 1), 'bandpass', 380, 1700, 1.2); };
A.servo = function (dur, p) {
  if (!ok('servo', 60)) return; dur = dur || .5; p = p || 1;
  const t = ctx.currentTime, o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(140 * p, t); o.frequency.linearRampToValueAtTime(260 * p, t + dur * .5); o.frequency.linearRampToValueAtTime(170 * p, t + dur);
  f.type = 'lowpass'; f.frequency.value = 900;
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.06, t + .04); g.gain.setValueAtTime(.06, t + dur - .06); g.gain.linearRampToValueAtTime(.0001, t + dur);
  o.connect(f); f.connect(g); g.connect(cur); o.start(t); o.stop(t + dur + .05);
};
A.whir = function (dur) { if (!ok('whir', 200)) return; dur = dur || 1.6; noise(dur, .13, 'bandpass', 300, 1500, 2.5); tone('triangle', 90, 240, dur, .08, 0, null, dur * .4); };
A.ratchet = function () { if (!ok('ratchet', 300)) return; for (let k = 0; k < 8; k++) { noise(.03, .25, 'bandpass', 1500 + k * 180, 1500 + k * 180, 4, k * .09); tone('square', 260 + k * 40, 220 + k * 40, .04, .06, k * .09); } };
A.sparkle = function () { if (!ok('sparkle', 150)) return; for (let k = 0; k < 6; k++) { const f = U.pick([1568, 1760, 2093, 2349, 2637, 3136]); tone('sine', f, f, .3, .08, k * .06); } };
A.crash = function () { if (!ok('crash', 300)) return; for (let k = 0; k < 6; k++) { const d = k * .07 + Math.random() * .04; noise(.05, .3, 'bandpass', U.rand(900, 1900), 900, 3, d); tone('triangle', U.rand(200, 380), 150, .08, .2, d); } };
A.shutter = function (dur) { if (!ok('shutter', 500)) return; dur = dur || 2.4; noise(dur, .22, 'lowpass', 160, 420, 1); for (let k = 0; k < dur / .12; k++) noise(.03, .14, 'bandpass', 900, 900, 4, k * .12); };
A.snore = function () { if (!ok('snore', 600)) return; tone('sawtooth', 70, 95, .7, .035, 0, null, .35); tone('sine', 520, 760, .5, .02, .85, null, .2); };
A.fanfare = function () {
  if (!ok('fanfare', 800)) return;
  [[523, 0], [659, .14], [784, .28], [1047, .42], [784, .62], [1047, .76]].forEach(n => { tone('square', n[0], n[0], n[0] === 1047 && n[1] > .7 ? .7 : .16, .09, n[1]); tone('triangle', n[0] / 2, n[0] / 2, .2, .12, n[1]); });
};
/* robot / toy voices: a few pitched blips. moods: happy, hm, wow, sleepy, effort, dizzy, yay */
A.voice = function (pitch, mood) {
  if (!ok('voice' + Math.round(pitch * 10), 160)) return;
  const base = 520 * (pitch || 1);
  const pat = {
    happy: [[1, 1.25], [1.25, 1.5], [1.5, 1.9]], hm: [[1.2, 1.1], [1, .8]], wow: [[1, 2.2], [2.2, 2]],
    sleepy: [[.8, .6], [.62, .5]], effort: [[.7, .75], [.75, .8], [.8, 1.3]], dizzy: [[1.5, 1], [1.3, .9], [1.1, .8], [.9, .7]],
    yay: [[1, 1.5], [1.5, 1], [1, 1.5], [1.5, 2.1]]
  }[mood || 'happy'];
  const step = mood === 'sleepy' ? .26 : mood === 'effort' ? .2 : .1;
  pat.forEach((n, i) => {
    const t = ctx.currentTime + i * step, o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(), d = step * .85;
    o.type = 'square'; o.frequency.setValueAtTime(base * n[0], t); o.frequency.exponentialRampToValueAtTime(base * n[1], t + d);
    f.type = 'bandpass'; f.frequency.value = base * 2.2; f.Q.value = 1.6;
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.2, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(f); f.connect(g); g.connect(cur); o.start(t); o.stop(t + d + .03);
  });
};

/* parade march: tiny step sequencer */
const mel = [72, 76, 79, 76, 72, 76, 79, -1, 81, 79, 77, 76, 74, -1, 67, -1, 72, 76, 79, 84, 83, 79, 76, -1, 74, 77, 76, 74, 72, -1, 72, -1];
const bass = [48, 55, 48, 55, 53, 55, 43, 55, 48, 55, 48, 55, 43, 50, 48, 55];
const mus = { on: false, next: 0, i: 0 }, hz = m => 440 * Math.pow(2, (m - 69) / 12);
A.music = function (on) {
  if (!ctx) return; mus.on = on;
  const t = ctx.currentTime; musicG.gain.cancelScheduledValues(t); musicG.gain.setValueAtTime(musicG.gain.value, t);
  musicG.gain.linearRampToValueAtTime(on ? .55 : 0, t + (on ? .3 : 1.6));
  if (on) { mus.next = t + .1; mus.i = 0; }
};
A.update = function () {
  if (!ctx || !mus.on) return;
  const st = .21;
  while (mus.next < ctx.currentTime + .25) {
    const i = mus.i % 32, d = mus.next - ctx.currentTime;
    if (mel[i] > 0) { tone('square', hz(mel[i]), hz(mel[i]), st * 1.6, .07, d, musicG); tone('triangle', hz(mel[i] + 12), hz(mel[i] + 12), st, .05, d, musicG); }
    if (i % 2 === 0) tone('triangle', hz(bass[(i / 2) % 16]), hz(bass[(i / 2) % 16]), st * 1.7, .2, d, musicG);
    if (i % 4 === 2) noise(.07, .16, 'highpass', 1800, 1800, 1, d, musicG); else if (i % 4 === 0) tone('sine', 110, 50, .12, .3, d, musicG);
    if (i % 2 === 1) noise(.02, .05, 'highpass', 6000, 6000, 1, d, musicG);
    mus.next += st; mus.i++;
  }
};
})();
