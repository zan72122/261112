// 固定コントロール 3 つ（表示モード / 音 / 全画面）と、ページ全体の入力まわり。
(function () {
  'use strict';
  const U = (QP.ui = {});

  U.init = function () {
    const bMode = document.getElementById('b-mode');
    const bSound = document.getElementById('b-sound');
    const bFull = document.getElementById('b-full');

    // 最初の操作で音を有効化（ブラウザの自動再生制限）
    const unlock = () => QP.audio && QP.audio.unlock();
    for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) window.addEventListener(ev, unlock, { passive: true });

    const syncMode = () => bMode.setAttribute('aria-pressed', String(QP.isBeginner()));
    bMode.addEventListener('click', () => {
      QP.setMode(!QP.isBeginner());
      syncMode();
      if (QP.interact) QP.interact.clear();
    });
    syncMode();

    bSound.addEventListener('click', () => {
      const muted = bSound.getAttribute('aria-pressed') === 'true';
      bSound.setAttribute('aria-pressed', String(!muted));
      if (QP.audio) QP.audio.setMuted(muted);
    });

    // 全画面: 対応していない環境（iPhone の Safari など）ではボタンを出さない
    const root = document.documentElement;
    const req = root.requestFullscreen || root.webkitRequestFullscreen;
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    const isFull = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (!req || !exit || (window.navigator.standalone === true)) bFull.hidden = true;
    else {
      bFull.addEventListener('click', () => {
        try {
          const p = isFull() ? exit.call(document) : req.call(root);
          if (p && p.catch) p.catch(() => {});
        } catch (e) { /* 拒否されても何もしない */ }
      });
    }

    // ページ側のズーム・メニュー・スクロールを止め、操作をすべて 3D へ渡す
    for (const ev of ['gesturestart', 'gesturechange', 'gestureend', 'contextmenu']) {
      document.addEventListener(ev, (e) => e.preventDefault());
    }
    document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
    document.addEventListener('dblclick', (e) => e.preventDefault());

    // キーボード（補助）: Space=開始/停止, E=開閉, 1-4=フィルター, F=早送り, B=表示モード, M=消音
    window.addEventListener('keydown', (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === ' ') { e.preventDefault(); QP.machine.press('start'); }
      else if (k === 'e') QP.machine.press('eject');
      else if (k >= '1' && k <= '4') QP.machine.press('filter', +k);
      else if (k === 'f') QP.machine.press('speed');
      else if (k === 'b') bMode.click();
      else if (k === 'm') bSound.click();
      else if (k === 'p') QP.machine.press('plate');
      else if (k === 's') QP.machine.press('film');
    });
  };
})();
