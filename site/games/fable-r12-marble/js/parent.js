/* Parent corner (K8): out of a child's reach, and the only place with words.
 * Gesture: press and hold the bottom-right corner for 3 seconds; three dots
 * appear; without lifting, slide through them in order (a zigzag). */
(function (root) {
  'use strict';
  var MG = root.MG, C = MG.C, R = MG.R, PAL = MG.PAL, St = MG.Store, A = MG.Audio;
  var P = MG.Parent = { isOpen: false, state: 'idle', id: null, t0: 0, sx: 0, sy: 0, idx: 0, armedAt: 0, el: null, opens: 0 };
  var ZONE = 120, HOLD = 3, DOT_R = 58, LIMIT = 9;
  var DOTS = P.DOTS = [{ x: C.W - 330, y: C.H - 70 }, { x: C.W - 170, y: C.H - 270 }, { x: C.W - 430, y: C.H - 390 }];
  P.ZONE = ZONE; P.HOLD = HOLD;

  P.onDown = function (id, x, y) {
    if (P.state !== 'idle' && id !== P.id && MG.Game.t - P.t0 > 20) { P.state = 'idle'; P.id = null; }   // a lost pointer must not lock the corner
    if (P.state !== 'idle') return P.id === id;
    if (x > C.W - ZONE && y > C.H - ZONE) { P.state = 'hold'; P.id = id; P.t0 = MG.Game.t; P.sx = x; P.sy = y; return true; }
    return false;
  };
  P.onMove = function (id, x, y) {
    if (P.state === 'idle' || id !== P.id) return false;
    if (P.state === 'hold') { if (Math.hypot(x - P.sx, y - P.sy) > 45) P.state = 'dead'; return true; }
    if (P.state === 'armed') {
      var d = DOTS[P.idx];
      if (Math.hypot(x - d.x, y - d.y) < DOT_R) { P.idx++; A.ui('turn'); if (P.idx >= DOTS.length) { P.state = 'dead'; P.open(); } }
      else if (P.idx < DOTS.length - 1 && Math.hypot(x - DOTS[DOTS.length - 1].x, y - DOTS[DOTS.length - 1].y) < DOT_R) P.state = 'dead';   // wrong order
    }
    return true;
  };
  P.onUp = function (id) {
    if (P.state === 'idle' || id !== P.id) return false;
    P.state = 'idle'; P.id = null; return true;
  };
  P.update = function () {
    var t = MG.Game.t;
    if (P.state === 'hold' && t - P.t0 >= HOLD) { P.state = 'armed'; P.idx = 0; P.armedAt = t; }
    if (P.state === 'armed' && t - P.armedAt > LIMIT) P.state = 'dead';
  };
  P.draw = function (ctx) {
    var t = MG.Game.t, i;
    if (P.state === 'hold') {
      var k = Math.min(1, (t - P.t0) / HOLD);
      if (k > 0.25) { ctx.beginPath(); ctx.arc(C.W - 56, C.H - 56, 34, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); ctx.lineWidth = 6; ctx.strokeStyle = PAL.soft; ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1; }
    } else if (P.state === 'armed') {
      ctx.save(); ctx.setLineDash([8, 12]); ctx.beginPath(); ctx.moveTo(C.W - 56, C.H - 56);
      for (i = 0; i < DOTS.length; i++) ctx.lineTo(DOTS[i].x, DOTS[i].y);
      ctx.lineWidth = 4; ctx.strokeStyle = PAL.soft; ctx.stroke(); ctx.restore();
      for (i = 0; i < DOTS.length; i++) R.disc(ctx, DOTS[i].x, DOTS[i].y, 16 + 5 * i, i < P.idx ? PAL.soft : PAL.white, PAL.soft, 4);
    }
  };

  /* ---------- overlay (DOM, bilingual) ---------- */
  function el(tag, cls, text) { var e = root.document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function row(parent, ja, en) { var r = el('div', 'p-row'); var l = el('div', 'p-label'); l.appendChild(el('span', 'ja', ja)); l.appendChild(el('span', 'en', en)); r.appendChild(l); parent.appendChild(r); return r; }
  function btn(ja, en, fn, cls) { var b = el('button', 'p-btn' + (cls ? ' ' + cls : '')); b.type = 'button'; b.appendChild(el('span', 'ja', ja)); b.appendChild(el('span', 'en', en)); b.addEventListener('click', fn); return b; }
  function twoStep(ja, en, ja2, en2, fn) {
    var armed = false, b = btn(ja, en, function () {
      if (!armed) { armed = true; b.firstChild.textContent = ja2; b.lastChild.textContent = en2; b.classList.add('warn'); return; }
      fn();
    });
    return b;
  }

  P.open = function () {
    if (P.isOpen) return;
    var G = MG.Game, d = root.document;
    P.isOpen = true; P.opens++;
    G.ptr = null; if (G.board) { G.board.drag = null; G.board.rot = null; }
    G.note({ t: 'parent', open: true });
    var wrap = P.el = el('div'); wrap.id = 'parent';
    var box = el('div', 'p-box'); wrap.appendChild(box);
    var h = el('h1'); h.appendChild(el('span', 'ja', 'おとなのコーナー')); h.appendChild(el('span', 'en', 'Parent corner')); box.appendChild(h);

    // finish after this one
    var r1 = row(box, 'この問題でおしまいにする（次に成功したら、ビー玉がおうちに帰って休みます）', 'Finish after this one (after the next success the marbles roll home and the game rests)');
    var cb = el('input'); cb.type = 'checkbox'; cb.id = 'p-finish'; cb.checked = !!G.finishAfter;
    cb.addEventListener('change', function () { G.finishAfter = cb.checked; G.note({ t: 'finishAfter', on: cb.checked }); });
    r1.appendChild(cb);
    if (G.screen === 'rest') { var rw = row(box, 'いまは「おやすみ」の画面です', 'The game is resting now'); rw.appendChild(btn('起こす', 'Wake up', function () { G.wake(); P.close(); }, 'p-wake')); }

    // sound
    var r2 = row(box, '音の大きさ', 'Sound level');
    var vol = el('input'); vol.type = 'range'; vol.min = '0'; vol.max = '100'; vol.id = 'p-volume'; vol.value = String(Math.round(St.data.settings.volume * 100));
    vol.addEventListener('input', function () { St.data.settings.volume = Number(vol.value) / 100; A.setVolume(St.data.settings.volume); });
    vol.addEventListener('change', function () { St.save(); A.ui('place'); });
    r2.appendChild(vol);

    // storage status
    if (!St.ok) {
      var warn = el('div', 'p-warn');
      warn.appendChild(el('span', 'ja', 'このブラウザーでは自動保存ができていません。遊びは続けられます。作品は下の「書き出し」で残せます。'));
      warn.appendChild(el('span', 'en', 'Auto-save is not working in this browser. Play continues; use Export below to keep creations.'));
      box.appendChild(warn);
    }

    // export / import
    var n = St.data.creations.length;
    var r3 = row(box, '作品（' + n + ' 個）の書き出し・読み込み', 'Export / import creations (' + n + ')');
    var ta = el('textarea'); ta.id = 'p-json'; ta.rows = 3; ta.spellcheck = false;
    var msg = el('div', 'p-msg'); msg.id = 'p-msg';
    r3.appendChild(btn('書き出し', 'Export', function () {
      var text = St.exportJSON(); ta.value = text;
      try {
        var a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = 'marble-garden-creations.json';
        d.body.appendChild(a); a.click(); d.body.removeChild(a);
      } catch (e) { /* the text box below still has it */ }
      msg.textContent = 'OK ✓  JSON ↓';
    }, 'p-export'));
    var file = el('input'); file.type = 'file'; file.accept = '.json,application/json'; file.id = 'p-file';
    file.addEventListener('change', function () {
      var f = file.files && file.files[0]; if (!f) return;
      var rd = new FileReader(); rd.onload = function () { doImport(String(rd.result)); }; rd.readAsText(f);
    });
    r3.appendChild(file);
    box.appendChild(ta);
    var r3b = el('div', 'p-row');
    r3b.appendChild(btn('貼り付けた内容を読み込む', 'Import pasted text', function () { doImport(ta.value); }, 'p-import'));
    r3b.appendChild(msg); box.appendChild(r3b);
    function doImport(text) {
      var res = St.importJSON(text);
      msg.textContent = res.ok ? ('+' + res.added + ' ✓') : '✗ JSON';
      G.thumbs = {};
      G.note({ t: 'import', ok: res.ok, added: res.added });
    }

    // before / after
    var pairs = P.pairs();
    var hb = el('h2'); hb.appendChild(el('span', 'ja', '作りなおした作品（まえ → あと）')); hb.appendChild(el('span', 'en', 'Creations your child changed (before → after)')); box.appendChild(hb);
    var list = el('div', 'p-pairs'); box.appendChild(list);
    if (!pairs.length) { var none = el('div', 'p-none'); none.appendChild(el('span', 'ja', 'まだありません')); none.appendChild(el('span', 'en', 'Nothing yet')); list.appendChild(none); }
    pairs.slice(0, 12).forEach(function (pr) {
      var item = el('div', 'p-pair');
      item.appendChild(R.thumb(d.createElement('canvas'), pr.before, 240, 150));
      item.appendChild(el('span', 'p-arrow', '→'));
      item.appendChild(R.thumb(d.createElement('canvas'), pr.after, 240, 150));
      list.appendChild(item);
    });

    // all creations (delete is here, never on the child's shelf)
    var ha = el('h2'); ha.appendChild(el('span', 'ja', 'すべての作品')); ha.appendChild(el('span', 'en', 'All creations')); box.appendChild(ha);
    var all = el('div', 'p-all'); box.appendChild(all);
    G.sortedCreations().forEach(function (c) {
      var item = el('div', 'p-item');
      item.appendChild(R.thumb(d.createElement('canvas'), c, 160, 100));
      item.appendChild(twoStep('消す', 'Delete', '本当に消す？', 'Really delete?', function () { St.removeCreation(c.id); all.removeChild(item); G.thumbs = {}; }));
      all.appendChild(item);
    });

    var r5 = row(box, 'パズルの進み具合を最初に戻す（作品は消えません）', 'Reset puzzle progress (creations are kept)');
    r5.appendChild(twoStep('リセット', 'Reset', '本当にリセット？', 'Really reset?', function () { St.resetProgress(); G.note({ t: 'reset' }); P.close(); G.goHome(); }));

    var foot = el('div', 'p-row p-foot');
    foot.appendChild(btn('全画面', 'Fullscreen', function () { G.toggleFull(); }));
    foot.appendChild(btn('とじる', 'Close', function () { P.close(); }, 'p-close'));
    box.appendChild(foot);
    d.body.appendChild(wrap);
  };
  P.close = function () {
    if (!P.isOpen) return;
    P.isOpen = false;
    if (P.el && P.el.parentNode) P.el.parentNode.removeChild(P.el);
    P.el = null; P.state = 'idle'; P.id = null;
    MG.Game.note({ t: 'parent', open: false });
  };
  /** Before/after pairs: an edited creation and what it was, or a copy and its original. */
  P.pairs = function () {
    var out = [], l = MG.Game.sortedCreations(), i, c, par;
    for (i = 0; i < l.length; i++) {
      c = l[i];
      if (c.prev && c.prev.pieces && JSON.stringify(c.prev.pieces) !== JSON.stringify(c.pieces)) out.push({ before: { spoutX: c.prev.spoutX, pieces: c.prev.pieces }, after: c, id: c.id });
      else if (c.parentId) { par = St.findCreation(c.parentId); if (par && JSON.stringify(par.pieces) !== JSON.stringify(c.pieces)) out.push({ before: par, after: c, id: c.id }); }
    }
    return out;
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
