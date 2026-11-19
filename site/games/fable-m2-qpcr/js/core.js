// 名前空間・寸法・小さな道具。ここより下のファイルはすべて QP.* を介してつながる。
// 単位は cm、X=右 / Y=上 / Z=手前。ベンチ天面が y=0。
(function () {
  'use strict';

  const QP = (window.QP = {});

  // ---- 数値ユーティリティ ------------------------------------------------
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const easeInOut = (t) => { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  // フレームレートに依らない指数追従（lambda が大きいほど速い）
  const damp = (cur, target, lambda, dt) => lerp(cur, target, 1 - Math.exp(-lambda * dt));

  // 再現できる乱数（デモ信号や模様に使う）
  function rng(seed) {
    let s = seed >>> 0;
    const f = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.gauss = () => {
      let u = 0;
      for (let i = 0; i < 4; i++) u += f();
      return (u - 2) * 1.732; // おおよそ標準正規
    };
    return f;
  }

  QP.util = { clamp, lerp, smooth, easeInOut, damp, rng };

  // ---- イベントバス（機構 → 音・表示） -----------------------------------
  const listeners = new Map();
  QP.bus = {
    on(name, fn) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(fn);
    },
    emit(name, data) {
      const l = listeners.get(name);
      if (l) for (let i = 0; i < l.length; i++) l[i](data);
    },
  };

  // ---- 寸法 ---------------------------------------------------------------
  // 機構どうしが干渉しないよう、ここで一元管理する。
  const D = (QP.D = {});

  // 外装
  D.W = 36; // 全幅
  D.HX = D.W / 2;
  D.zFront = 22;
  D.zRear = -24;
  D.yBase = 1.6; // 外装下端（ゴム足の上）
  D.yKnee = 23.5; // 前面が傾斜に変わる高さ
  D.yTop = 41;
  D.zSlantEnd = 13; // 傾斜が天面に達する z
  D.wall = 0.5;
  D.bandHX = 10.6; // 中央の濃色バンド半幅
  D.openHX = 10.3; // ドロワー開口
  D.openY0 = 4.6;
  D.openY1 = 19.0;

  // プレート（SBS 準拠の 96 穴）
  D.pitch = 0.9;
  D.cols = 12;
  D.rows = 8;
  D.plateW = 12.78;
  D.plateD = 8.55;
  D.plateH = 1.5; // スカート下端〜デッキ上面
  D.wellR = 0.275;

  // ドロワーと熱モジュール（閉位置でのプレート中心）
  D.cz = 10;
  D.travel = 18;
  D.yFin0 = 7.0;
  D.ySink = 12.0; // ヒートシンク基部の下面
  D.yPelt = 13.0;
  D.yBlock = 13.45;
  D.yBlockUp = 14.05; // フランジ上面
  D.yBlockTop = 15.95;
  D.yPlate = D.yBlockTop + 0.17 - D.plateH; // 着座時のプレート原点（スカート下端）
  D.yFilm = D.yBlockTop + 0.17 + 0.06;

  // 加熱リッド
  D.lidT = 1.3;
  D.lidTravel = 2.6;
  D.yLidDown = D.yFilm + 0.02; // 押さえ込み時のリッド下面
  D.lidColX = 10.4; // 昇降ガイド柱
  D.lidColZ = 4.4;

  // 光学ヘッドとガントリ
  D.yObj = 21.2; // 対物レンズ先端
  D.yHead = 22.6; // ヘッド本体下面
  D.yGantry = 30;
  D.railX = 12.5;

  // ウェル番号 → プレート中心からのオフセット（列 1 が左、行 A が奥）
  D.wellX = (c) => (c - (D.cols - 1) / 2) * D.pitch;
  D.wellZ = (r) => (r - (D.rows - 1) / 2) * D.pitch;

  // ---- フィルターチャンネル（0 は遮光位置） -------------------------------
  // ex: 励起光の色 / em: 蛍光の色。色素は em の色で光る。
  QP.CHANNELS = [
    { name: 'dark', ex: 0x000000, em: 0x000000 },
    { name: 'green', ex: 0x2f7dff, em: 0x35ff7e },
    { name: 'yellow', ex: 0x21e6a0, em: 0xffe04a },
    { name: 'orange', ex: 0xffc21a, em: 0xff8326 },
    { name: 'red', ex: 0xff6a1f, em: 0xff2b5e },
  ];

  // URL ハッシュの簡易パラメータ（#mode=beginner&q=0 など）
  QP.params = (function () {
    const out = {};
    const h = (location.hash || '').replace(/^#/, '');
    h.split('&').forEach((kv) => {
      if (!kv) return;
      const i = kv.indexOf('=');
      if (i < 0) out[kv] = '1';
      else out[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
    });
    return out;
  })();
})();
