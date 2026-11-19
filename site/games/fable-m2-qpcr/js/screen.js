// 装置のタッチパネル。2D キャンバスに描き、3D の表示面へ発光テクスチャとして貼る。
// 文字は数字だけ（温度・サイクル数）。操作は ▶/■、開閉、早送り、フィルター 4 色。
(function () {
  'use strict';
  const { clamp } = QP.util;
  const W = 640;
  const H = 400;
  const PLOT = { x: 16, y: 76, w: 440, h: 232 };
  const BTN = {
    start: { cx: 550, cy: 132, r: 56 },
    eject: { cx: 550, cy: 246, w: 136, h: 58 },
    speed: { cx: 550, cy: 318, w: 136, h: 50 },
    filters: [50, 120, 190, 260].map((x, i) => ({ cx: x, cy: 358, r: 25, ch: i + 1 })),
  };
  const FG = '#e9ebee';
  const DIM = '#6d727a';
  const FONT = '"SF Mono", ui-monospace, Menlo, Consolas, "Roboto Mono", monospace';

  const css = (hex, a) => `rgba(${(hex >> 16) & 255},${(hex >> 8) & 255},${hex & 255},${a == null ? 1 : a})`;

  QP.screen = (function () {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;

    let dirty = true;
    let since = 0;
    let clock = 0;
    const ripple = { x: 0, y: 0, t: 9 };
    ['scan:well', 'cycle', 'filter', 'speed', 'start', 'stop', 'done', 'stopped', 'error', 'refuse', 'run:start', 'drawer:start', 'drawer:end']
      .forEach((e) => QP.bus.on(e, () => { dirty = true; }));

    function rr(x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }

    function drawTop(S) {
      const T = S.temp;
      g.save();
      g.scale(1.32, 1.32);
      // 温度計アイコン
      g.strokeStyle = FG;
      g.fillStyle = FG;
      g.lineWidth = 2.2;
      g.beginPath();
      g.arc(26, 31, 6, 0.75 * Math.PI, 0.25 * Math.PI);
      g.lineTo(30, 12);
      g.arc(26, 12, 4, 0, Math.PI, true);
      g.closePath();
      g.stroke();
      g.beginPath();
      g.arc(26, 31, 3.2, 0, Math.PI * 2);
      g.fill();
      g.font = `600 27px ${FONT}`;
      g.textBaseline = 'middle';
      g.textAlign = 'left';
      g.fillText(T.block.toFixed(1) + '°', 42, 25);
      // 加熱 / 冷却の矢印
      if (Math.abs(T.drive) > 0.15) {
        const up = T.drive > 0;
        g.fillStyle = up ? '#ff8a3a' : '#4ac6ff';
        g.beginPath();
        const ax = 148;
        const ay = 24;
        if (up) { g.moveTo(ax, ay - 9); g.lineTo(ax + 8, ay + 6); g.lineTo(ax - 8, ay + 6); }
        else { g.moveTo(ax, ay + 9); g.lineTo(ax + 8, ay - 6); g.lineTo(ax - 8, ay - 6); }
        g.closePath();
        g.fill();
      }
      // サイクル（循環矢印＋数字）
      g.strokeStyle = S.run.active || S.run.done ? FG : DIM;
      g.fillStyle = g.strokeStyle;
      g.lineWidth = 2.2;
      g.beginPath();
      g.arc(214, 24, 9, -0.2 * Math.PI, 1.45 * Math.PI);
      g.stroke();
      g.beginPath();
      g.moveTo(214 + 9 * Math.cos(-0.2 * Math.PI) + 5, 24 + 9 * Math.sin(-0.2 * Math.PI) - 6);
      g.lineTo(214 + 9 * Math.cos(-0.2 * Math.PI) + 3, 24 + 9 * Math.sin(-0.2 * Math.PI) + 5);
      g.lineTo(214 + 9 * Math.cos(-0.2 * Math.PI) - 6, 24 + 9 * Math.sin(-0.2 * Math.PI) - 1);
      g.closePath();
      g.fill();
      g.font = `600 27px ${FONT}`;
      const cyc = String(S.run.cycle).padStart(2, '0');
      g.fillText(cyc, 234, 25);
      g.fillStyle = DIM;
      g.font = `500 17px ${FONT}`;
      g.fillText('/' + S.run.total, 270, 28);
      // 完了マーク
      if (S.run.done) {
        g.strokeStyle = '#7dffa8';
        g.lineWidth = 3.5;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(330, 25);
        g.lineTo(338, 33);
        g.lineTo(352, 15);
        g.stroke();
        g.lineCap = 'butt';
      }
      g.restore();
      // 進捗バー
      g.fillStyle = 'rgba(255,255,255,0.09)';
      g.fillRect(PLOT.x, 64, PLOT.w, 4);
      g.fillStyle = FG;
      const prog = S.run.total ? clamp((S.run.cycle - (S.run.phase === 'scan' || S.run.done || !S.run.active ? 0 : 0.5)) / S.run.total, 0, 1) : 0;
      g.fillRect(PLOT.x, 64, PLOT.w * (S.run.done ? 1 : prog), 4);
    }

    function drawPlot(S) {
      const N = S.run.total;
      const { x, y, w, h } = PLOT;
      g.fillStyle = '#0b0c0f';
      rr(x, y, w, h, 6);
      g.fill();
      g.save();
      rr(x, y, w, h, 6);
      g.clip();
      // 目盛り
      g.strokeStyle = 'rgba(255,255,255,0.07)';
      g.lineWidth = 1;
      g.beginPath();
      for (let k = 4; k < N; k += 4) {
        const gx = x + (k / N) * w;
        g.moveTo(gx + 0.5, y);
        g.lineTo(gx + 0.5, y + h);
      }
      for (let k = 1; k < 4; k++) {
        const gy = y + (k / 4) * h;
        g.moveTo(x, gy + 0.5);
        g.lineTo(x + w, gy + 0.5);
      }
      g.stroke();
      // 曲線: 96 ウェルぶん。選択中フィルターの色素を最後（手前）に描く
      const px = (cyc) => x + ((cyc - 0.5) / N) * w;
      const py = (v) => y + h - 10 - (clamp(v, 0, 1.15) / 1.15) * (h - 22);
      g.lineJoin = 'round';
      g.lineWidth = 2.1;
      const order = [1, 2, 3, 4].filter((d) => d !== S.filter).concat([S.filter]);
      for (const dye of order) {
        g.strokeStyle = css(QP.CHANNELS[dye].em, dye === S.filter ? 0.95 : 0.55);
        g.beginPath();
        for (let i = 0; i < 96; i++) {
          if (S.wells[i].dye !== dye) continue;
          const n = S.meas[i];
          if (!n) continue;
          g.moveTo(px(1), py(S.data[i * N]));
          for (let k = 1; k < n; k++) g.lineTo(px(k + 1), py(S.data[i * N + k]));
          if (n === 1) g.lineTo(px(1) + 2, py(S.data[i * N]));
        }
        g.stroke();
      }
      // 走査中の現在サイクル位置
      if (S.run.active && S.run.cycle > 0) {
        g.fillStyle = 'rgba(255,255,255,0.12)';
        g.fillRect(px(S.run.cycle) - 1, y, 2, h);
      }
      g.restore();
      // 軸の小目盛り
      g.fillStyle = DIM;
      for (let k = 4; k <= N; k += 4) g.fillRect(x + ((k - 0.5) / N) * w - 0.5, y + h + 3, 1.5, 5);
    }

    function drawButtons(S) {
      const b = BTN.start;
      const running = S.run.active;
      const pulse = 0.5 + 0.5 * Math.sin(clock * 3.2);
      g.lineWidth = 3.5;
      g.strokeStyle = FG;
      g.fillStyle = running ? '#1a1c20' : `rgba(255,255,255,${0.05 + (running ? 0 : 0.06 * pulse)})`;
      g.beginPath();
      g.arc(b.cx, b.cy, b.r, 0, Math.PI * 2);
      g.fill();
      g.stroke();
      g.fillStyle = FG;
      if (running) {
        rr(b.cx - 19, b.cy - 19, 38, 38, 6);
        g.fill();
        // 運転中リング（位相の進み）
        g.strokeStyle = S.temp.drive > 0.15 ? '#ff8a3a' : S.temp.drive < -0.15 ? '#4ac6ff' : FG;
        g.lineWidth = 4;
        g.beginPath();
        g.arc(b.cx, b.cy, b.r + 8, clock * 2.5, clock * 2.5 + 1.6);
        g.stroke();
      } else {
        g.beginPath();
        g.moveTo(b.cx - 16, b.cy - 25);
        g.lineTo(b.cx + 27, b.cy);
        g.lineTo(b.cx - 16, b.cy + 25);
        g.closePath();
        g.fill();
      }

      // 開閉
      const e = BTN.eject;
      g.lineWidth = 2.6;
      g.strokeStyle = running ? DIM : FG;
      g.fillStyle = 'rgba(255,255,255,0.04)';
      rr(e.cx - e.w / 2, e.cy - e.h / 2, e.w, e.h, 14);
      g.fill();
      g.stroke();
      g.fillStyle = running ? DIM : FG;
      if (running) {
        // 錠前
        g.lineWidth = 3;
        g.beginPath();
        g.arc(e.cx, e.cy - 5, 7, Math.PI, 0);
        g.stroke();
        rr(e.cx - 11, e.cy - 5, 22, 16, 3);
        g.fill();
      } else {
        g.beginPath();
        g.moveTo(e.cx, e.cy - 13);
        g.lineTo(e.cx + 15, e.cy + 3);
        g.lineTo(e.cx - 15, e.cy + 3);
        g.closePath();
        g.fill();
        g.fillRect(e.cx - 15, e.cy + 8, 30, 4.5);
      }

      // 早送り
      const s = BTN.speed;
      const fast = S.speed > 1;
      g.strokeStyle = fast ? FG : DIM;
      g.fillStyle = fast ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.03)';
      g.lineWidth = 2.2;
      rr(s.cx - s.w / 2, s.cy - s.h / 2, s.w, s.h, 12);
      g.fill();
      g.stroke();
      g.fillStyle = fast ? FG : DIM;
      for (let k = 0; k < 2; k++) {
        const ox = s.cx - 16 + k * 18;
        g.beginPath();
        g.moveTo(ox - 2, s.cy - 10);
        g.lineTo(ox + 14, s.cy);
        g.lineTo(ox - 2, s.cy + 10);
        g.closePath();
        g.fill();
      }

      // フィルター 4 色
      for (const f of BTN.filters) {
        const col = QP.CHANNELS[f.ch].em;
        const on = S.filter === f.ch;
        g.fillStyle = css(col, on ? 1 : 0.38);
        g.beginPath();
        g.arc(f.cx, f.cy, on ? f.r : f.r - 5, 0, Math.PI * 2);
        g.fill();
        if (on) {
          g.strokeStyle = FG;
          g.lineWidth = 3;
          g.beginPath();
          g.arc(f.cx, f.cy, f.r + 7, 0, Math.PI * 2);
          g.stroke();
        }
      }
    }

    // 直近の測定値を 12×8 の点で表示（検出器が見た像）
    function drawMap(S) {
      const N = S.run.total;
      const ox = 306;
      const oy = 332;
      const p = 7.0;
      for (let i = 0; i < 96; i++) {
        const cx = ox + (i % 12) * p * 1.9 + 4;
        const cy = oy + ((i / 12) | 0) * p + 3;
        const n = S.meas[i];
        const v = n ? clamp(S.data[i * N + n - 1], 0, 1) : 0;
        g.fillStyle = v > 0.06 ? css(QP.CHANNELS[S.wells[i].dye].em, 0.25 + 0.75 * v) : 'rgba(255,255,255,0.1)';
        g.beginPath();
        g.arc(cx, cy, 2.8, 0, Math.PI * 2);
        g.fill();
        if (S.run.well === i) {
          g.strokeStyle = FG;
          g.lineWidth = 1.2;
          g.stroke();
        }
      }
    }

    function drawError(S) {
      if (!S.error) return;
      const blink = Math.sin(clock * 14) > -0.2;
      if (!blink) return;
      const cx = PLOT.x + PLOT.w / 2;
      const cy = PLOT.y + PLOT.h / 2;
      g.fillStyle = 'rgba(8,8,10,0.82)';
      rr(cx - 92, cy - 62, 184, 124, 14);
      g.fill();
      g.strokeStyle = '#ff5a4e';
      g.fillStyle = '#ff5a4e';
      g.lineWidth = 5;
      g.lineJoin = 'round';
      if (S.error === 'lock') {
        g.beginPath();
        g.arc(cx, cy - 12, 20, Math.PI, 0);
        g.stroke();
        rr(cx - 30, cy - 12, 60, 46, 7);
        g.fill();
      } else {
        // 斜めのプレートと警告
        g.save();
        g.translate(cx - 6, cy + 10);
        g.rotate(-0.22);
        g.strokeRect(-58, -16, 116, 32);
        g.restore();
        g.beginPath();
        g.moveTo(cx + 52, cy - 46);
        g.lineTo(cx + 78, cy - 2);
        g.lineTo(cx + 26, cy - 2);
        g.closePath();
        g.fill();
        g.fillStyle = '#0a0a0c';
        g.fillRect(cx + 49.5, cy - 30, 5, 15);
        g.fillRect(cx + 49.5, cy - 12, 5, 5);
      }
    }

    function draw() {
      const S = QP.machine.S;
      g.fillStyle = '#060709';
      g.fillRect(0, 0, W, H);
      drawTop(S);
      drawPlot(S);
      drawButtons(S);
      drawMap(S);
      drawError(S);
      if (ripple.t < 0.35) {
        g.strokeStyle = `rgba(255,255,255,${0.7 * (1 - ripple.t / 0.35)})`;
        g.lineWidth = 3;
        g.beginPath();
        g.arc(ripple.x, ripple.y, 10 + ripple.t * 130, 0, Math.PI * 2);
        g.stroke();
      }
      texture.needsUpdate = true;
    }

    function hit(x, y) {
      const b = BTN.start;
      if (Math.hypot(x - b.cx, y - b.cy) < b.r + 8) return ['start'];
      for (const k of ['eject', 'speed']) {
        const e = BTN[k];
        if (Math.abs(x - e.cx) < e.w / 2 + 8 && Math.abs(y - e.cy) < e.h / 2 + 4) return [k];
      }
      for (const f of BTN.filters) if (Math.hypot(x - f.cx, y - f.cy) < f.r + 10) return ['filter', f.ch];
      return null;
    }

    return {
      texture, W, H, BTN,
      // uv（左下原点）でのタップ。ボタンに当たれば true
      tap(u, v) {
        const x = u * W;
        const y = (1 - v) * H;
        const a = hit(x, y);
        if (!a) return false;
        ripple.x = x;
        ripple.y = y;
        ripple.t = 0;
        dirty = true;
        QP.bus.emit('ui:tap');
        QP.machine.press(a[0], a[1]);
        return true;
      },
      // ボタン中心の uv（ヒント表示用）
      uvOf(name) {
        const b = name === 'start' ? BTN.start : BTN[name];
        return { u: b.cx / W, v: 1 - b.cy / H };
      },
      update(dt) {
        const S = QP.machine.S;
        clock += dt;
        since += dt;
        ripple.t += dt;
        const lively = S.run.active || ripple.t < 0.4 || S.error || S.drawer.moving;
        if ((dirty && since > 0.045) || since > (lively ? 0.085 : 0.45)) {
          draw();
          dirty = false;
          since = 0;
        }
      },
      redraw: draw,
    };
  })();
})();
