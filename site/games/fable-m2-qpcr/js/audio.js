// 効果音。すべて WebAudio で合成する（音声ファイルなし）。
// ・連続音: ファン / ドロワーとリッドのモーター / スキャンヘッド / ペルチェのうなり / 湯気
// ・単発音: 機構イベント（QP.bus）に対応するクリック・ゴトン・チャイムなど
// ブラウザの制約で、最初のタップまでは鳴らない（unlock）。
(function () {
  'use strict';
  const { clamp } = QP.util;
  const A = (QP.audio = { ctx: null, muted: false, ready: false });
  let ctx, master, noiseBuf, voices;
  let lastBlip = 0;
  const VOLUME = 1.25; // 全体音量（後段のコンプレッサーが頭を抑える）

  A.unlock = function () {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        // iOS: 消音スイッチに左右されず再生する（対応ブラウザのみ）
        if (navigator.audioSession) navigator.audioSession.type = 'playback';
      } catch (e) { /* 非対応は無視 */ }
      ctx = A.ctx = new AC();
      build();
    }
    if (ctx.state === 'suspended') ctx.resume();
  };

  A.setMuted = function (m) {
    A.muted = m;
    if (master) master.gain.setTargetAtTime(m ? 0 : VOLUME, ctx.currentTime, 0.03);
  };

  function build() {
    master = ctx.createGain();
    master.gain.value = A.muted ? 0 : VOLUME;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 18;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;
    master.connect(comp);
    comp.connect(ctx.destination);
    A.out = comp; // 出力段（音量確認などの計測用）

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    let seed = 1234567;
    for (let i = 0; i < d.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      d[i] = (seed / 2147483648 - 1) * 0.9;
    }

    const loopNoise = () => {
      const s = ctx.createBufferSource();
      s.buffer = noiseBuf;
      s.loop = true;
      s.start();
      return s;
    };
    const osc = (type, f) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.start();
      return o;
    };
    const gain = (v) => {
      const g = ctx.createGain();
      g.gain.value = v;
      return g;
    };
    const filt = (type, f, q) => {
      const b = ctx.createBiquadFilter();
      b.type = type;
      b.frequency.value = f;
      b.Q.value = q || 1;
      return b;
    };
    const chain = (...n) => {
      for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]);
      return n[n.length - 1];
    };

    voices = {};
    // ファン: 風切り音（帯域ノイズ）＋羽根の基音
    voices.fanF = filt('bandpass', 500, 0.7);
    voices.fanG = gain(0);
    chain(loopNoise(), voices.fanF, voices.fanG, master);
    voices.fanO = osc('sawtooth', 80);
    voices.fanOF = filt('lowpass', 420, 0.8);
    voices.fanOG = gain(0);
    chain(voices.fanO, voices.fanOF, voices.fanOG, master);
    // ドロワーのモーター
    voices.drwO = osc('sawtooth', 120);
    voices.drwF = filt('bandpass', 700, 2.5);
    voices.drwG = gain(0);
    chain(voices.drwO, voices.drwF, voices.drwG, master);
    voices.drwN = gain(0);
    chain(loopNoise(), filt('bandpass', 2600, 1.2), voices.drwN, master);
    // リッドのモーター（低め）
    voices.lidO = osc('square', 70);
    voices.lidF = filt('lowpass', 520, 2);
    voices.lidG = gain(0);
    chain(voices.lidO, voices.lidF, voices.lidG, master);
    // スキャンヘッドのステッピング音
    voices.headO = osc('square', 400);
    voices.headF = filt('lowpass', 1500, 1.5);
    voices.headG = gain(0);
    chain(voices.headO, voices.headF, voices.headG, master);
    // ペルチェ駆動のうなり
    voices.pelO = osc('sine', 100);
    voices.pelO2 = osc('triangle', 200);
    voices.pelG = gain(0);
    voices.pelO.connect(voices.pelG);
    chain(voices.pelO2, gain(0.35), voices.pelG);
    voices.pelG.connect(master);
    // 湯気
    voices.hissG = gain(0);
    chain(loopNoise(), filt('highpass', 3800, 0.6), voices.hissG, master);

    A.ready = true;
  }

  // ---- 単発音の部品 --------------------------------------------------------
  function tone(f0, f1, dur, type, vol, when, attack) {
    if (!A.ready) return;
    const t = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.03);
  }
  function noise(dur, type, f0, f1, q, vol, when, attack) {
    if (!A.ready) return;
    const t = ctx.currentTime + (when || 0);
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    const b = ctx.createBiquadFilter();
    b.type = type;
    b.Q.value = q;
    b.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) b.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.003));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(b);
    b.connect(g);
    g.connect(master);
    s.start(t, Math.random() * 1.5);
    s.stop(t + dur + 0.03);
  }
  const thunk = (vol, when, f) => {
    tone(f || 95, 42, 0.16, 'sine', vol, when);
    noise(0.05, 'lowpass', 900, 300, 0.7, vol * 0.6, when);
  };
  const click = (vol, when, f) => {
    noise(0.018, 'bandpass', f || 3200, 0, 1.2, vol, when);
    tone((f || 3200) * 0.4, 0, 0.02, 'square', vol * 0.25, when);
  };
  const bell = (f, vol, when, dur) => {
    tone(f, f, dur || 0.7, 'sine', vol, when, 0.003);
    tone(f * 2.01, f * 2.01, (dur || 0.7) * 0.5, 'sine', vol * 0.28, when, 0.003);
  };

  // ---- 機構イベント → 音 ----------------------------------------------------
  const on = QP.bus.on;
  on('ui:tap', () => { click(0.16, 0, 2600); tone(1250, 1250, 0.05, 'sine', 0.08); });
  on('button', () => { click(0.3, 0, 1900); thunk(0.2, 0.005, 150); });
  on('drawer:start', () => { click(0.22, 0, 1500); tone(180, 300, 0.12, 'triangle', 0.05); });
  on('drawer:end', (open) => {
    if (open) { thunk(0.32, 0, 120); click(0.2, 0.03, 2200); }
    else { thunk(0.6, 0, 82); noise(0.09, 'lowpass', 500, 160, 0.8, 0.28, 0.01); click(0.18, 0.07, 1300); }
  });
  on('refuse', () => {
    // ロックがガチャン。開かない
    thunk(0.85, 0, 74);
    noise(0.07, 'bandpass', 1100, 700, 5, 0.4, 0.0);
    thunk(0.6, 0.11, 66);
    noise(0.12, 'bandpass', 1700, 1200, 9, 0.22, 0.12);
    tone(196, 185, 0.16, 'square', 0.09, 0.26);
    tone(147, 139, 0.22, 'square', 0.09, 0.44);
  });
  on('lid:start', (dir) => { click(0.16, 0, 1200); tone(dir > 0 ? 130 : 170, dir > 0 ? 110 : 190, 0.1, 'triangle', 0.06); });
  on('lid:end', (down) => {
    if (down) { thunk(0.5, 0, 105); click(0.25, 0.02, 900); tone(520, 300, 0.12, 'triangle', 0.05, 0.03); }
    else { click(0.2, 0, 1700); thunk(0.2, 0.01, 140); }
  });
  on('clamp', () => { noise(0.2, 'lowpass', 420, 120, 0.9, 0.22); });
  on('lid:jam', () => {
    thunk(0.6, 0, 130);
    for (let i = 0; i < 9; i++) noise(0.07, 'bandpass', 240 + (i % 3) * 60, 180, 7, 0.34, 0.03 + i * 0.085);
    tone(58, 52, 0.85, 'sawtooth', 0.2, 0.02, 0.05);
  });
  on('error', () => {
    tone(392, 392, 0.16, 'square', 0.1, 0.9);
    tone(294, 294, 0.3, 'square', 0.1, 1.1);
  });
  on('start', () => { bell(523, 0.14, 0); bell(659, 0.14, 0.09); bell(784, 0.16, 0.18); });
  on('stop', () => { bell(659, 0.13, 0); bell(440, 0.14, 0.11); });
  on('stopped', () => { tone(330, 220, 0.3, 'sine', 0.1); });
  on('done', () => { bell(523, 0.16, 0, 1.0); bell(659, 0.15, 0.13, 1.0); bell(784, 0.15, 0.26, 1.1); bell(1047, 0.18, 0.42, 1.6); });
  on('run:start', () => { tone(90, 140, 0.5, 'sine', 0.12, 0, 0.2); });
  on('relay', (dir) => { click(0.34, 0, dir > 0 ? 2100 : 1500); tone(dir > 0 ? 1320 : 990, 0, 0.035, 'sine', 0.06, 0.004); thunk(0.14, 0, 180); });
  on('led', (v) => { if (v) tone(2400, 3200, 0.05, 'sine', 0.05); });
  on('scan:row', (r) => { tone(r.dir > 0 ? 300 : 260, 0, 0.02, 'square', 0.03); });
  on('scan:well', (m) => {
    if (!A.ready) return;
    const now = ctx.currentTime;
    if (now - lastBlip < 0.022) return;
    lastBlip = now;
    if (m.match) tone(520 + m.v * 1500, 0, 0.045, 'triangle', 0.035 + m.v * 0.06);
    else noise(0.012, 'highpass', 5000, 0, 0.7, 0.03);
  });
  on('cycle', () => { tone(190, 150, 0.07, 'sine', 0.1); });
  on('wheel:start', () => { noise(0.2, 'bandpass', 1400, 2600, 6, 0.09, 0, 0.03); tone(700, 1100, 0.18, 'sawtooth', 0.018, 0, 0.03); });
  on('wheel:end', () => { click(0.2, 0, 3600); });
  on('filter', () => { tone(880, 1320, 0.07, 'sine', 0.08); });
  on('speed', (s) => { tone(s > 1 ? 700 : 1000, s > 1 ? 1400 : 500, 0.12, 'triangle', 0.09); click(0.1, 0.1, 3000); });
  on('plate:move', () => { noise(0.34, 'bandpass', 500, 1500, 0.9, 0.1, 0, 0.12); });
  on('plate:land', (pose) => {
    if (pose === 'seat') { click(0.34, 0, 1400); thunk(0.3, 0.005, 210); tone(900, 700, 0.04, 'triangle', 0.08, 0.01); }
    else if (pose === 'skew') { click(0.3, 0, 900); click(0.22, 0.09, 700); noise(0.14, 'bandpass', 2300, 1500, 3, 0.1, 0.02); }
    else { thunk(0.2, 0, 240); click(0.16, 0.004, 1100); }
  });
  on('film:fly', () => { noise(0.36, 'bandpass', 900, 2400, 1.2, 0.07, 0, 0.14); });
  on('film:seal', () => { noise(0.3, 'bandpass', 1200, 4200, 3.5, 0.2, 0, 0.05); click(0.12, 0.28, 2400); });
  on('film:peel', () => {
    for (let i = 0; i < 12; i++) noise(0.03, 'highpass', 2800, 0, 0.8, 0.07 + Math.random() * 0.1, i * 0.026 + Math.random() * 0.01);
  });
  on('film:land', () => { noise(0.05, 'lowpass', 1800, 600, 0.7, 0.07); });
  on('nope', () => { tone(220, 196, 0.07, 'triangle', 0.1); tone(196, 165, 0.1, 'triangle', 0.1, 0.09); });
  on('mode', (b) => { noise(0.5, 'bandpass', b ? 400 : 2400, b ? 2800 : 400, 1.4, 0.08, 0, 0.2); tone(b ? 440 : 660, b ? 880 : 330, 0.35, 'sine', 0.05, 0, 0.1); });
  on('part:pop', () => { tone(480, 820, 0.07, 'sine', 0.1); noise(0.05, 'highpass', 4200, 0, 0.7, 0.04); });
  on('part:back', () => { tone(700, 420, 0.06, 'sine', 0.06); });

  // ---- 連続音を機構の状態に合わせる -------------------------------------------
  A.update = function () {
    if (!A.ready) return;
    const S = QP.machine.S;
    const t = ctx.currentTime;
    const set = (p, v, tc) => p.setTargetAtTime(v, t, tc || 0.04);
    const sp = S.speed > 1 ? 1.25 : 1;

    const rpm = S.fan.rpm;
    set(voices.fanG.gain, rpm * rpm * 0.2 + rpm * 0.02);
    set(voices.fanF.frequency, 260 + rpm * 1250);
    set(voices.fanOG.gain, rpm * 0.05);
    set(voices.fanO.frequency, 46 + rpm * 150);
    set(voices.fanOF.frequency, 200 + rpm * 500);

    const dv = Math.abs(S.drawer.vel) / 0.8;
    set(voices.drwG.gain, S.drawer.moving ? 0.035 + dv * 0.1 : 0, 0.02);
    set(voices.drwO.frequency, (95 + dv * 150) * sp);
    set(voices.drwF.frequency, 500 + dv * 900);
    set(voices.drwN.gain, S.drawer.moving ? dv * 0.035 : 0, 0.02);

    const lv = Math.abs(S.lid.vel) / 1.5;
    set(voices.lidG.gain, (S.lid.moving ? 0.03 + lv * 0.07 : 0) + S.strain * 0.1, 0.02);
    set(voices.lidO.frequency, S.strain > 0 ? 46 : (62 + lv * 60) * sp);

    const hv = clamp(Math.abs(S.head.vx) / 54, 0, 1.2);
    const scanning = S.run.phase === 'scan' && hv > 0.05;
    set(voices.headG.gain, scanning ? 0.028 : hv > 0.05 ? 0.012 : 0, 0.008);
    set(voices.headO.frequency, (S.head.vx > 0 ? 392 : 330) * (0.6 + 0.4 * hv) * sp, 0.01);

    const u = Math.abs(S.temp.drive);
    set(voices.pelG.gain, u * 0.07, 0.08);
    set(voices.pelO.frequency, S.temp.drive > 0 ? 100 + u * 20 : 100 - u * 12, 0.1);
    set(voices.pelO2.frequency, S.temp.drive > 0 ? 200 + u * 40 : 200 - u * 24, 0.1);

    const steaming = S.plate.pose !== 'bench' && !S.film.on && S.temp.block > 72;
    set(voices.hissG.gain, steaming ? 0.02 + ((S.temp.block - 72) / 23) * 0.06 : 0, 0.15);
  };
})();
