// 装置のシミュレーション本体。見た目・音・タッチパネルはすべてこの状態 S を読むだけ。
// ・機構（ドロワー / リッド / ホイール / ヘッド）は目標値へ動く小さな物理モデル
// ・運転手順はジェネレータで書いたシーケンス（閉じる → 押さえる → 加熱/冷却/スキャン × N）
// ・「いたずら」への応答もここで決める（運転中の開扉拒否、斜め置きでリッド停止 など）
(function () {
  'use strict';
  const { clamp, rng } = QP.util;
  const D = QP.D;
  const bus = QP.bus;

  const N = 24; // サイクル数
  const T_HI = 95;
  const T_LO = 60;
  const T_AMB = 25;
  const ROW_T = 0.2; // 1 行を走査する時間 [s]
  const STEP_T = 0.05; // 行送り
  const LID_JAM = 0.66; // 斜めプレートに当たるリッド位置

  const HOME_X = D.wellX(0) - D.pitch * 0.5;
  const END_X = D.wellX(D.cols - 1) + D.pitch * 0.5;

  const S = {
    t: 0,
    speed: 1,
    drawer: { pos: 0, vel: 0, target: 0, moving: false },
    lid: { pos: 0, vel: 0, target: 0, moving: false, jam: false },
    plate: { pose: 'bench', prev: 'bench', t: 1 }, // bench | seat | skew
    film: { on: false, t: 1 }, // on = プレートに貼ってある
    temp: { block: T_AMB, sink: T_AMB, lid: T_AMB, set: T_AMB, lidSet: T_AMB, drive: 0 },
    fan: { rpm: 0, target: 0, angle: 0 },
    head: { x: HOME_X, z: D.wellZ(0), vx: 0, vz: 0 },
    wheel: { index: 0, target: 0, angle: 0, moving: false },
    led: { on: false, level: 0 },
    filter: 1,
    run: { active: false, cycle: 0, total: N, phase: 'idle', dir: 1, done: false, well: -1 },
    wells: [],
    data: new Float32Array(96 * N),
    meas: new Uint8Array(96),
    fog: 0,
    error: null, // 'skew' | 'lock'
    errorT: 0,
    jolt: 0, // 開扉拒否のガタつき
    strain: 0, // リッドが噛んだときのうなり
  };

  // ---- ウェルごとのデモ信号 ----------------------------------------------
  // 列ごとに 4 色の色素を繰り返し、行 A→H の順に立ち上がりを遅らせる（S 字カーブの束になる）
  (function initWells() {
    const r = rng(20261119);
    for (let i = 0; i < 96; i++) {
      const c = i % D.cols;
      const row = (i / D.cols) | 0;
      S.wells.push({
        dye: 1 + (c % 4),
        c0: 5.2 + row * 1.7 + ((c / 4) | 0) * 0.3 + r.gauss() * 0.08,
        amp: 0.9 + r() * 0.12,
        k: 0.6 + r() * 0.08,
        level: 1, // 液量（蒸発で減る）
        lum: 0, // 直近の測定で見えた明るさ（残光）
        flash: 0, // 励起された瞬間の閃光
        drift: 0,
      });
    }
  })();
  const noise = rng(77);

  function signal(w, cycle) {
    return 0.035 + w.amp / (1 + Math.exp(-(cycle - w.c0) / w.k));
  }

  const platePresent = () => S.plate.pose !== 'bench';
  const itemsBusy = () => S.plate.t < 1 || S.film.t < 1;
  const plateReachable = () => S.plate.pose === 'bench' || (S.drawer.pos > 0.985 && !S.drawer.moving);

  // 1 ウェルの測定。ホイールの現在位置と色素が合うときだけ蛍光が検出器へ届く。
  function measure(i, cycle) {
    const w = S.wells[i];
    const ch = S.wheel.moving ? 0 : S.wheel.index;
    let v = 0.012 + noise.gauss() * 0.004;
    let match = false;
    if (platePresent() && ch > 0) {
      if (w.dye === ch) {
        match = true;
        v = signal(w, cycle) + noise.gauss() * 0.008;
        if (!S.film.on) {
          // 未シール: 曇りで信号が落ち、ウェルごとにふらつく
          w.drift += noise.gauss() * 0.07 * (0.3 + S.fog);
          w.drift *= 0.93;
          v = v * (1 - 0.5 * S.fog) + w.drift + noise.gauss() * (0.015 + 0.05 * S.fog);
        }
      } else {
        v = 0.02 + noise.gauss() * 0.005; // 他色はフィルタで遮られる
      }
    }
    v = clamp(v, 0, 1.2);
    S.data[i * N + cycle - 1] = v;
    S.meas[i] = cycle;
    if (match) {
      w.lum = v;
      w.flash = 1;
    } else {
      w.lum *= 0.1; // 色が合わないウェルは次の走査ですぐ暗くなる
      w.flash = platePresent() && ch > 0 ? 0.12 : 0;
    }
    S.run.well = i;
    bus.emit('scan:well', { i, v, match, ch });
  }

  // ---- シーケンス ----------------------------------------------------------
  function* wait(sec) {
    let t = 0;
    while (t < sec) t += yield;
  }
  function* until(pred) {
    while (!pred()) yield;
  }

  function* seqDrawer(target) {
    yield* until(() => !itemsBusy());
    S.drawer.target = target;
    yield* until(() => !S.drawer.moving && Math.abs(S.drawer.pos - target) < 1e-3);
  }

  function* seqWheel(index) {
    S.wheel.target = index;
    yield;
    yield* until(() => !S.wheel.moving);
  }

  function* seqScan(cycle) {
    yield* seqWheel(S.filter);
    S.led.on = true;
    bus.emit('led', true);
    yield* wait(0.08);
    const dir = S.run.dir;
    let side = -1; // 現在ヘッドがいる側（-1 = 左）
    for (let k = 0; k < D.rows; k++) {
      const row = dir > 0 ? k : D.rows - 1 - k;
      // 行送り
      const z0 = S.head.z;
      const z1 = D.wellZ(row);
      if (Math.abs(z1 - z0) > 1e-4) {
        let t = 0;
        while (t < STEP_T) {
          t += yield;
          S.head.z = z0 + (z1 - z0) * clamp(t / STEP_T, 0, 1);
        }
      }
      S.head.z = z1;
      // 1 行スイープ。通過した列を順に測定
      const xa = side < 0 ? HOME_X : END_X;
      const xb = side < 0 ? END_X : HOME_X;
      let next = 0;
      let t = 0;
      bus.emit('scan:row', { row, dir: side < 0 ? 1 : -1 });
      while (t < ROW_T) {
        t += yield;
        const f = clamp(t / ROW_T, 0, 1);
        S.head.x = xa + (xb - xa) * f;
        S.head.vx = (xb - xa) / ROW_T;
        while (next < D.cols && f >= (next + 0.5) / D.cols) {
          const col = side < 0 ? next : D.cols - 1 - next;
          measure(row * D.cols + col, cycle);
          next++;
        }
      }
      S.head.vx = 0;
      side = -side;
    }
    S.run.dir = -dir;
    S.run.well = -1;
    S.led.on = false;
    bus.emit('led', false);
    S.wheel.target = 0;
  }

  function resetRunData() {
    S.data.fill(0);
    S.meas.fill(0);
    for (const w of S.wells) {
      w.lum = 0;
      w.flash = 0;
      w.drift = 0;
    }
    S.run.cycle = 0;
    S.run.done = false;
    S.run.dir = 1;
  }

  function* seqRun() {
    S.run.active = true;
    S.run.done = false;
    S.run.phase = 'close';
    yield* seqDrawer(0);
    S.run.phase = 'clamp';
    S.lid.target = 1;
    yield;
    yield* until(() => !S.lid.moving);
    if (S.lid.jam) {
      // 斜めに置かれたプレートに当たった: 少しうなってから戻し、ドロワーを開けて見せる
      S.error = 'skew';
      S.errorT = 5;
      S.strain = 1;
      bus.emit('error', { kind: 'skew' });
      yield* wait(0.85);
      S.strain = 0;
      S.lid.jam = false;
      S.lid.target = 0;
      yield;
      yield* until(() => !S.lid.moving);
      S.run.active = false;
      S.run.phase = 'idle';
      yield* wait(0.2);
      yield* seqDrawer(1);
      return;
    }
    bus.emit('clamp');
    resetRunData();
    S.temp.lidSet = 105;
    yield* wait(0.35);
    bus.emit('run:start');
    for (let c = 1; c <= N; c++) {
      S.run.cycle = c;
      S.run.phase = 'heat';
      S.temp.set = T_HI;
      bus.emit('relay', 1);
      yield* until(() => S.temp.block > T_HI - 0.8);
      S.run.phase = 'hold';
      yield* wait(0.3);
      S.run.phase = 'cool';
      S.temp.set = T_LO;
      bus.emit('relay', -1);
      yield* until(() => S.temp.block < T_LO + 0.8);
      S.run.phase = 'scan';
      yield* seqScan(c);
      bus.emit('cycle', c);
    }
    yield* seqFinish(true);
  }

  function* seqFinish(completed) {
    S.run.phase = 'finish';
    S.lid.jam = false; // 噛み込み中に止められても必ずリッドを戻せるようにする
    S.strain = 0;
    S.led.on = false;
    S.wheel.target = 0;
    S.temp.set = T_AMB;
    S.temp.lidSet = T_AMB;
    bus.emit('relay', -1);
    yield* until(() => S.temp.block < 45);
    S.lid.target = 0;
    yield;
    yield* until(() => !S.lid.moving);
    S.run.active = false;
    S.run.done = completed;
    S.run.phase = 'idle';
    S.run.well = -1;
    if (completed) for (const w of S.wells) if (w.lum > 0.05) w.flash = 1; // 完了の合図にひと光り
    bus.emit(completed ? 'done' : 'stopped');
  }

  let seq = null;
  function start(gen) {
    seq = gen;
    seq.next();
  }

  function refuse() {
    S.jolt = 1;
    S.error = 'lock';
    S.errorT = 1.4;
    bus.emit('refuse');
  }

  // ---- 操作（タッチパネル・開閉ボタン・プレート・フィルム） ----------------
  function press(action, arg) {
    switch (action) {
      case 'eject':
        if (S.run.active) return refuse(); // 運転中は開かない（ロックがガチャンと鳴る）
        bus.emit('button');
        start(seqDrawer(S.drawer.target > 0.5 ? 0 : 1));
        return;
      case 'start':
        if (S.run.active) {
          if (S.run.phase === 'finish') return;
          bus.emit('stop');
          start(seqFinish(false));
        } else {
          bus.emit('start');
          start(seqRun());
        }
        return;
      case 'filter':
        if (arg >= 1 && arg <= 4 && arg !== S.filter) {
          S.filter = arg;
          if (S.led.on) S.wheel.target = arg; // 走査中ならその場で切り替わる
          bus.emit('filter', arg);
        }
        return;
      case 'speed':
        S.speed = S.speed > 1 ? 1 : 3;
        bus.emit('speed', S.speed);
        return;
      case 'plate':
        if (itemsBusy()) return;
        if (!plateReachable()) return void bus.emit('nope', 'plate');
        if (S.plate.pose === 'bench') {
          if (!(S.drawer.pos > 0.985 && !S.drawer.moving)) return void bus.emit('nope', 'plate');
          movePlate('seat');
        } else if (S.plate.pose === 'seat') {
          movePlate('skew');
        } else {
          movePlate('bench');
        }
        return;
      case 'film':
        if (itemsBusy()) return;
        if (!plateReachable()) return void bus.emit('nope', 'film');
        S.film.on = !S.film.on;
        S.film.t = 0;
        bus.emit(S.film.on ? 'film:fly' : 'film:peel');
        return;
    }
  }

  function movePlate(to) {
    S.plate.prev = S.plate.pose;
    S.plate.pose = to;
    S.plate.t = 0;
    bus.emit('plate:move', { from: S.plate.prev, to });
  }

  // ---- 物理ステップ --------------------------------------------------------
  function axis(a, dt, vmax, acc, onEnd) {
    const d = a.target - a.pos;
    if (Math.abs(d) < 1e-4 && Math.abs(a.vel) < 0.02) {
      if (a.moving) {
        a.moving = false;
        a.pos = a.target;
        a.vel = 0;
        if (onEnd) onEnd();
      }
      return;
    }
    if (!a.moving) a.moving = true;
    const want = Math.sign(d) * Math.min(vmax, Math.sqrt(2 * acc * Math.abs(d)) + 0.02);
    const dv = clamp(want - a.vel, -acc * 2.5 * dt, acc * 2.5 * dt);
    a.vel += dv;
    const step = a.vel * dt;
    if (Math.abs(step) >= Math.abs(d)) {
      a.pos = a.target;
      a.vel = 0;
      a.moving = false;
      if (onEnd) onEnd();
    } else a.pos += step;
  }

  let drawerWasMoving = false;
  let lidWasMoving = false;
  let wheelWasMoving = false;

  function step(dt) {
    S.t += dt;
    if (seq) {
      const r = seq.next(dt);
      if (r.done) seq = null;
    }

    // ドロワー
    axis(S.drawer, dt, 0.8, 1.9, () => bus.emit('drawer:end', S.drawer.pos > 0.5 ? 1 : 0));
    if (S.drawer.moving && !drawerWasMoving) bus.emit('drawer:start', S.drawer.target > S.drawer.pos ? 1 : -1);
    drawerWasMoving = S.drawer.moving;

    // リッド（斜めプレートがあると途中で止まる）
    const jamAt = S.plate.pose === 'skew' ? LID_JAM : 2;
    if (S.lid.target > 0.5 && S.lid.pos >= jamAt && !S.lid.jam) {
      S.lid.jam = true;
      S.lid.pos = jamAt;
      S.lid.vel = 0;
      S.lid.moving = false;
      bus.emit('lid:jam');
    }
    if (!S.lid.jam) axis(S.lid, dt, 1.5, 4.5, () => bus.emit('lid:end', S.lid.pos > 0.5 ? 1 : 0));
    if (S.lid.moving && !lidWasMoving) bus.emit('lid:start', S.lid.target > S.lid.pos ? 1 : -1);
    lidWasMoving = S.lid.moving;

    // フィルターホイール（近い向きへ回る）
    const wstep = (Math.PI * 2) / 5;
    const wt = S.wheel.target * wstep;
    let da = wt - S.wheel.angle;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    if (Math.abs(da) > 1e-3) {
      S.wheel.moving = true;
      const w = Math.sign(da) * Math.min(Math.abs(da), 7.5 * dt);
      S.wheel.angle += w;
    } else if (S.wheel.moving || S.wheel.index !== S.wheel.target) {
      S.wheel.angle = wt;
      S.wheel.moving = false;
      S.wheel.index = S.wheel.target;
      bus.emit('wheel:end', S.wheel.index);
    }
    if (S.wheel.moving && !wheelWasMoving) bus.emit('wheel:start');
    wheelWasMoving = S.wheel.moving;

    // 走査していないときはヘッドを待機位置へ戻す
    if (S.run.phase !== 'scan') {
      const tx = HOME_X;
      const tz = S.run.active ? S.head.z : D.wellZ(0);
      const mx = clamp(tx - S.head.x, -22 * dt, 22 * dt);
      const mz = clamp(tz - S.head.z, -14 * dt, 14 * dt);
      S.head.x += mx;
      S.head.z += mz;
      S.head.vx = mx / dt;
    }

    // LED
    S.led.level += ((S.led.on ? 1 : 0) - S.led.level) * Math.min(1, dt * 28);

    // 熱: ペルチェ駆動 u（+ で加熱、- で冷却）
    const T = S.temp;
    const err = T.set - T.block;
    const powered = S.run.active || Math.abs(err) > 0.4;
    const u = powered ? clamp(err / 5, -1, 1) : 0;
    T.drive = u;
    T.block += (u > 0 ? u * 34 : u * 30) * dt - (T.block - T_AMB) * 0.012 * dt;
    T.sink += (Math.max(0, -u) * 17 + Math.abs(u) * 2.4 - Math.max(0, u) * 5) * dt - (T.sink - T_AMB) * (0.1 + 1.5 * S.fan.rpm) * dt;
    T.sink = Math.max(T.sink, T_AMB - 4);
    T.lid += clamp(T.lidSet - T.lid, -4 * dt, 30 * dt);

    // ファン: ヒートシンク温度と冷却要求に応じて回転数が変わる
    const F = S.fan;
    F.target = S.run.active
      ? clamp(0.28 + (T.sink - 27) / 18 + Math.max(0, -u) * 0.5, 0.28, 1)
      : T.sink > 29 || T.block > 40 ? 0.3 : 0;
    F.rpm += (F.target - F.rpm) * Math.min(1, dt * (F.target > F.rpm ? 3.2 : 1.1));
    F.angle += F.rpm * 62 * dt;

    // 未シール: 高温で蒸気が出てリッドが曇り、液が減る
    const clamped = S.lid.pos > 0.9;
    if (platePresent() && !S.film.on && clamped && T.block > 70) {
      const hot = (T.block - 70) / 25;
      S.fog = Math.min(1, S.fog + 0.05 * hot * dt);
      for (const w of S.wells) w.level = Math.max(0.4, w.level - 0.012 * hot * dt);
    } else if (!S.run.active) {
      S.fog = Math.max(0, S.fog - 0.015 * dt);
    }

    // ウェルの残光
    for (const w of S.wells) {
      if (w.flash > 0) w.flash = Math.max(0, w.flash - dt * 3.2);
    }

    // プレート / フィルムの移動アニメーション
    if (S.plate.t < 1) {
      S.plate.t = Math.min(1, S.plate.t + dt / 0.5);
      if (S.plate.t >= 1) {
        bus.emit('plate:land', S.plate.pose);
        if (S.plate.pose === 'bench') {
          // ベンチに戻したら次の実演に備えて元へ戻す
          for (const w of S.wells) {
            w.level = 1;
            w.lum = 0;
          }
        }
      }
    }
    if (S.film.t < 1) {
      S.film.t = Math.min(1, S.film.t + dt / 0.55);
      if (S.film.t >= 1) bus.emit(S.film.on ? 'film:seal' : 'film:land');
    }

    if (S.errorT > 0) {
      S.errorT -= dt;
      if (S.errorT <= 0) S.error = null;
    }
    if (S.jolt > 0) S.jolt = Math.max(0, S.jolt - dt * 2.6);
  }

  // 実時間 dt を速度倍率つきで細かく刻んで進める
  function update(dt) {
    let rest = Math.min(dt, 0.1) * S.speed;
    while (rest > 1e-6) {
      const h = Math.min(rest, 1 / 90);
      step(h);
      rest -= h;
    }
  }

  QP.machine = {
    S, N, T_HI, T_LO, T_AMB, HOME_X,
    press, update,
    platePresent, plateReachable, itemsBusy,
    // デバッグ・検証用: 描画なしで時間を進める
    advance(sec) {
      const n = Math.ceil(sec * 60);
      for (let i = 0; i < n; i++) step(1 / 60);
    },
  };
})();
