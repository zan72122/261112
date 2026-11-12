/*
 * extras.js — everything else that must not become fixed UI: transient overlays and keys.
 *
 *   ?   keys + search syntax                    L   coverage ledger (what was actually searchable)
 *   D   search only the opened document         H   search history (Enter re-runs)
 *   O   open the original PDF in a new tab      R   read this page again with OCR (Shift+R: rotated 90° more)
 *   Alt+← / Alt+→ (⌘[ / ⌘])  back / forward between viewed places, with the exact scroll position
 *   last session (query, scope, document, page, zoom, scroll) is restored at launch
 *   dictionary: synonyms.json (bundled defaults) or the owner's own file, dropped on the window
 */
(function (root) {
  'use strict';
  const PS = root.PS, store = PS.store, L = PS.library, S = PS.ui, V = PS.viewer, act = PS.act;
  const $ = (id) => document.getElementById(id);
  const vscroll = $('vscroll'), input = $('q');
  const el = (tag, props, ...kids) => { const e = document.createElement(tag); Object.assign(e, props || {}); for (const k of kids) e.append(k); return e; };
  const fmt = PS.fmt;

  // ---------------------------------------------------------------- dictionary (synonyms / abbreviations)
  PS.dictionaryInfo = { source: 'none', groups: 0 };
  /** Install a dictionary: { groups: [[term, term, …], …] }. fromUser: remember it (user data). */
  PS.loadDictionary = async function (data, fromUser, quiet) {
    const groups = (Array.isArray(data) ? data : (data && data.groups) || []).map((g) => (Array.isArray(g) ? g : (g && g.terms) || []).filter((t) => typeof t === 'string' && t.trim())).filter((g) => g.length > 1);
    if (fromUser && !groups.length) { PS.toast('辞書に有効な組がありません（{"groups": [["ac", "air conditioner"], …]} の形式）'); return null; }
    const n = PS.setDictionary({ groups });
    PS.dictionaryInfo = { source: fromUser ? 'user' : 'default', groups: n };
    if (fromUser) {
      await store.put('kv', { groups, loaded: Date.now() }, 'dictionary').catch(() => {});
      store.get('kv', 'backup').then((b) => store.put('kv', Object.assign({}, b, { changed: Date.now() }), 'backup')).catch(() => {});
      if (!quiet) PS.toast('辞書を読み込みました（' + n + ' 組）。次回以降もこの辞書を使います');
    }
    if (L.loaded && S.query) act.refresh();
    return { groups: n };
  };
  PS.resetDictionary = async function () { await store.del('kv', 'dictionary').catch(() => {}); return PS.loadDictionary(root.PS_DEFAULT_DICTIONARY || { groups: [] }, false); };
  const dictReady = store.get('kv', 'dictionary').then((d) => PS.loadDictionary(d && d.groups ? d : root.PS_DEFAULT_DICTIONARY || { groups: [] }, false).then(() => { if (d && d.groups) PS.dictionaryInfo.source = 'user'; }), () => PS.loadDictionary(root.PS_DEFAULT_DICTIONARY || { groups: [] }, false));

  // ---------------------------------------------------------------- help
  PS.showHelp = function () {
    const rows = (list) => { const t = el('table'); for (const [k, v] of list) { const tr = el('tr'); const td = el('td'); for (const key of k.split(' / ')) td.append(el('kbd', { textContent: key }), ' '); tr.append(td, el('td', { textContent: v })); t.append(tr); } return t; };
    const panel = el('div', {}, el('h2', { textContent: 'キー操作と検索の書き方' }),
      el('h3', { textContent: '検索' }), rows([
        ['/ / Ctrl+F', '検索欄へ'], ['↑ ↓ ← →', '結果ページを選ぶ'], ['Enter', '選んだページを開く'], ['Esc', '閉じる → 検索を消す'],
        ['n / Shift+N', '次 / 前のヒットへ（ページ → 次の文書へ続く）'], ['D', '開いている文書だけを検索（もう一度で解除）'], ['H', '検索履歴（Enter で再実行）'], ['L', '検索できた範囲（台帳）'],
      ]),
      el('h3', { textContent: '開いたページ' }), rows([
        ['+ / - / 0', '拡大・縮小・元の大きさ（Ctrl+ホイール、ダブルクリックも可）'], ['B', 'しおり'], ['K', 'ヒット（または選んだ範囲）をハイライト'], ['M', 'メモ'],
        ['Shift+ドラッグ', '範囲を選ぶ → 画像/テキストをコピー・ハイライト・メモ'], ['Ctrl+Shift+C', 'ヒットの行を出典付きでコピー'], ['I', '書誌情報の確認・修正'],
        ['O', '原本 PDF を新しいタブで開く'], ['R / Shift+R', 'このページを OCR し直す / 90° 回して OCR'], ['Alt+← / Alt+→', '前に見ていた場所へ戻る / 進む'], ['F', '全画面'],
      ]),
      el('h3', { textContent: '検索の書き方' }), rows([
        ['庫内幅 28 cm', '語を並べる（質問文のままでも可）'], ['"stem bolts"', 'この並びを含むページだけ'], ['-washer', 'この語を含むページを除く'],
        ['file:manual', 'ファイル名に manual を含むものだけ（-file: で除外）'], ['in:travel/2024', 'フォルダ名で絞る'],
      ]),
      el('p', { textContent: '全角/半角・大文字/小文字・ひらがな/カタカナ・長音（サーバ/サーバー）・ハイフンや空白の有無は区別しません。辞書（synonyms.json）の語は言い換えも探します（青い印）。' }));
    panel.style.maxWidth = '760px';
    PS.overlay(panel);
  };

  // ---------------------------------------------------------------- coverage ledger (A2)
  const STATE = {
    ok: ['検索可', 'ok'], 'ocr-wait': ['OCR待ち', 'wait'], 'ocr-low': ['OCR要確認', 'warn'], suspect: ['文字層要確認', 'warn'], indexing: ['索引中', 'wait'],
    password: ['パスワード', 'bad'], damaged: ['破損・読込不可', 'bad'], unreadable: ['読めない', 'bad'], stale: ['旧版を表示中', 'warn'],
  };
  function coverageText(led) {
    const p = led.pages;
    const parts = ['検索済み ' + fmt(p.searchable) + ' / ' + fmt(p.total) + ' ページ'];
    if (p.ocrWait) parts.push('OCR待ち ' + fmt(p.ocrWait) + ' ページ');
    if (p.doubtful) parts.push('要確認 ' + fmt(p.doubtful) + ' ページ');
    if (p.unreadableDocs) parts.push('読めない ' + fmt(p.unreadableDocs) + ' ファイル');
    if (led.counts.indexing) parts.push('索引中 ' + fmt(led.counts.indexing) + ' ファイル');
    if (led.counts.stale) parts.push('旧版 ' + led.counts.stale + ' ファイル');
    return parts.join(' ・ ');
  }
  /** For an empty result: a line that says how much was really searched (null when everything was). */
  PS.coverageNote = function () {
    const led = PS.ledger();
    if (led.complete && !led.pages.doubtful) return null;
    const s = el('small', { className: 'coverage' }, coverageText(led) + ' ');
    s.append(el('button', { type: 'button', textContent: '内訳を見る', onclick: () => PS.showLedger('problems') }));
    return s;
  };
  let hinted = '';
  /** For a thin result (1–2 pages): the same information as a transient message, once per query. */
  PS.coverageHint = function (n) {
    if (n > 2 || hinted === S.shown) return;
    const led = PS.ledger();
    if (led.complete) return;
    hinted = S.shown;
    PS.toast(n + ' ページ ・ ' + coverageText(led), { label: '内訳を見る', run: () => PS.showLedger('problems') }, 9000);
  };
  const ICON = '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/></svg>';
  PS.showLedger = function (filter) {
    const led = PS.ledger();
    const groups = { all: () => true, problems: (it) => it.state !== 'ok', ok: (it) => it.state === 'ok' };
    for (const k of Object.keys(STATE)) if (k !== 'ok') groups[k] = (it) => it.state === k;
    const panel = el('div', {}, el('h2', { textContent: '検索できた範囲 ・ ' + coverageText(led) }));
    const tabs = el('div', { className: 'tabs' }), grid = el('div', { className: 'ledger' });
    const show = (key) => {
      [...tabs.children].forEach((b) => b.classList.toggle('on', b.dataset.k === key));
      const items = led.items.filter(groups[key]).slice(0, 400);
      grid.replaceChildren(...items.map((it) => {
        const [label, cls] = STATE[it.state];
        const sheet = el('div', { className: 'lsheet', innerHTML: ICON });
        const badPage = it.doc && it.doc.pages.find((p) => p.ocr === 1 || p.doubt || p.ocr === 3);
        const pg = it.doc && (badPage || it.doc.pages[0]);
        if (pg) PS.thumbUrl(pg).then((u) => { if (u) sheet.append(el('img', { alt: '', src: u })); });
        sheet.append(el('span', { className: 'badge ' + cls, textContent: label }));
        const okPages = it.doc ? it.doc.pages.filter((p) => p.ocr !== 1).length : 0;
        const meta = el('div', { className: 'lmeta' }, el('span', { textContent: it.pages ? okPages + ' / ' + it.pages + ' ページ検索可' : it.error ? String(it.error).slice(0, 26) : '' }));
        if (it.state !== 'ok' && it.state !== 'indexing') meta.append(el('button', { type: 'button', textContent: '再試行', onclick: (e) => { e.stopPropagation(); retry(it); } }));
        const node = el('div', { className: 'item', title: it.path + (it.error ? '\n' + it.error : '') }, sheet, el('div', { className: 'lname', textContent: it.name }), meta);
        node.dataset.state = it.state;
        node.dataset.file = it.name;
        if (pg) node.addEventListener('click', () => { PS.closeOverlays(); PS.openDocAt(it.doc, pg.no); });
        return node;
      }));
      if (!items.length) grid.append(el('p', { textContent: '該当するファイルはありません' }));
    };
    const tab = (key, label, n) => { const b = el('button', { type: 'button', textContent: label + ' ' + fmt(n), onclick: () => show(key) }); b.dataset.k = key; tabs.append(b); };
    tab('all', 'すべて', led.items.length);
    tab('problems', '要対応', led.items.filter(groups.problems).length);
    for (const k of Object.keys(STATE)) if (led.counts[k]) tab(k, STATE[k][0], led.counts[k]);
    panel.append(tabs, grid);
    PS.overlay(panel);
    show(filter && groups[filter] ? filter : 'all');
  };
  async function retry(it) {
    try {
      if (it.state === 'ocr-wait') { it.doc.ocrBlocked = false; for (const p of it.doc.pages) p.ocrError = null; const n = PS.queueOcr(it.doc); PS.toast(n ? 'OCR を再開しました（' + n + ' ページ）' : 'OCR の順番待ちです（' + it.wait + ' ページ）'); }
      else if (it.state === 'ocr-low' || it.state === 'suspect') { let n = 0; for (const p of it.doc.pages) if (p.doubt || p.ocr === 3) { PS.reocrPage(p, { longSide: 3400 }); n++; } PS.toast(n + ' ページを高解像度で OCR し直します'); }
      else if (it.doc) { PS.toast('「' + it.name + '」を読み直しています…'); const r = await PS.reindexDoc(it.doc); PS.toast(r.failed ? '読めませんでした: ' + (r.error || '') : '索引し直しました'); }
      else if (it.folder) act.rescan(it.folder);
    } catch (err) { PS.toast(err && err.needAccess ? 'フォルダへのアクセス許可が必要です（＋ → 再スキャン）' : '再試行できませんでした: ' + (err && err.message || err)); }
    PS.closeOverlays();
  }

  // ---------------------------------------------------------------- scope: only the opened document (A5)
  let before = null; // what to restore when the scope is lifted
  PS.toggleScope = function () {
    if (!S.viewing || !V.doc || !S.query.trim()) { if (S.scope) unscope(); return; }
    if (S.scope) return unscope();
    const cur = V.cur ? V.cur.page : V.page;
    before = { page: S.entries[S.sel] ? S.entries[S.sel].page : null, total: S.res ? S.res.total : 0 };
    S.scope = V.doc;
    rerun(cur);
    PS.toast('「' + V.doc.name + '」の中だけを検索しています（' + S.entries.length + ' ページ）・ D で解除');
    record();
  };
  function unscope() {
    const back = before && before.page;
    S.scope = null;
    before = null;
    rerun(back);
    PS.toast('すべての文書の検索に戻しました（' + fmt(S.res ? S.res.total : 0) + ' ページ）');
    record();
  }
  // recompute the results without letting the viewer jump, then put the selection on `page`
  function rerun(page) {
    const mode = V.entryMode;
    V.entryMode = false;
    S.sel = -1;
    S.drawn = 0;
    act.refresh();
    V.entryMode = mode;
    const idx = page ? S.entries.findIndex((e) => e.page === page) : -1;
    if (idx >= 0) act.select(idx, true);
    V.cur = null;
    act.updateCount();
  }

  // ---------------------------------------------------------------- history, last session, back / forward (A6)
  const H = (PS.history = { list: [], back: [], fwd: [], restoring: false });
  PS.reloadHistory = () => store.getAll('history').then((all) => { H.list = all.sort((a, b) => b.t - a.t).slice(0, 100); });
  let histT = 0;
  function noteQuery() {
    clearTimeout(histT);
    const q = S.shown;
    if (!q || !S.res) return;
    histT = setTimeout(() => {
      if (S.shown !== q) return;
      const scope = S.scope ? S.scope.id : null;
      const same = H.list.find((h) => h.q === q && (h.scope || null) === scope);
      const rec = { id: same ? same.id : 'h' + Date.now().toString(36), q, scope, scopeName: S.scope ? S.scope.name : null, n: S.res.total, t: Date.now() };
      H.list = [rec, ...H.list.filter((h) => h !== same)];
      const ops = [{ put: 'history', value: rec }];
      for (const old of H.list.slice(100)) ops.push({ del: 'history', key: old.id });
      H.list = H.list.slice(0, 100);
      store.batch(ops).catch(() => {});
    }, 1200);
  }
  function runHistory(h) {
    PS.closeOverlays();
    if (S.viewing) act.closeViewer();
    S.scope = h.scope ? L.byId.get(h.scope) || null : null;
    PS.setQuery(h.q);
    input.focus();
  }
  PS.showHistory = function () {
    const list = el('ul', { className: 'hist' });
    let sel = 0;
    const items = H.list.map((h, i) => {
      const li = el('li', {}, el('span', { textContent: h.q }), h.scopeName ? el('small', { textContent: h.scopeName + ' 内' }) : '', el('small', { textContent: fmt(h.n || 0) + ' ページ ・ ' + new Date(h.t).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }));
      li.addEventListener('click', () => runHistory(h));
      li.dataset.q = h.q;
      return li;
    });
    const mark = () => items.forEach((li, i) => li.classList.toggle('sel', i === sel));
    list.append(...items);
    const panel = el('div', { tabIndex: -1 }, el('h2', { textContent: '検索履歴（↑↓ で選び Enter で再実行）' }), items.length ? list : el('p', { textContent: 'まだ履歴はありません' }));
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { sel = Math.min(items.length - 1, sel + 1); mark(); items[sel] && items[sel].scrollIntoView({ block: 'nearest' }); e.preventDefault(); e.stopPropagation(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); mark(); items[sel] && items[sel].scrollIntoView({ block: 'nearest' }); e.preventDefault(); e.stopPropagation(); }
      else if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (H.list[sel]) runHistory(H.list[sel]); }
    });
    PS.overlay(panel);
    mark();
    panel.focus();
  };
  PS.historyKeys = (e) => { const p = document.querySelector('.overlay .panel'); if (p && p.querySelector('.hist')) { p.dispatchEvent(new KeyboardEvent('keydown', { key: e.key, bubbles: false })); return true; } return false; };

  // where the owner is: remembered continuously so a jump can be undone exactly
  let here = null; // { doc, page, top, left, zoom, q, scope }
  const whereKey = () => (S.viewing && V.doc ? V.doc.id + ':' + (V.page ? V.page.no : 0) : 'wall');
  function capture() {
    if (!S.viewing || !V.doc) return { doc: null, q: S.query, scope: S.scope ? S.scope.id : null, key: 'wall' };
    const cur = PS.currentViewerPage();
    return { doc: V.doc.id, page: cur ? cur.no : 1, top: vscroll.scrollTop, left: vscroll.scrollLeft, zoom: V.zoom, q: S.query, scope: S.scope ? S.scope.id : null, key: whereKey() };
  }
  let saveT = 0;
  function record() {
    clearTimeout(saveT);
    saveT = setTimeout(() => { const s = capture(); s.sel = S.sel; s.mode = S.mode; s.t = Date.now(); store.put('kv', s, 'session').catch(() => {}); }, 400);
  }
  PS.onNav = function () {
    noteQuery();
    const key = whereKey();
    if (here && here.key !== key && !H.restoring && here.doc) { H.back.push(here); if (H.back.length > 60) H.back.shift(); H.fwd.length = 0; }
    here = capture();
    record();
  };
  vscroll.addEventListener('scroll', () => { if (here && here.key === whereKey() && !H.restoring) { here.top = vscroll.scrollTop; here.left = vscroll.scrollLeft; here.zoom = V.zoom; const cur = PS.currentViewerPage(); if (cur) here.page = cur.no; } record(); }, { passive: true });

  function go(loc) {
    const doc = loc && loc.doc ? L.byId.get(loc.doc) : null;
    if (!doc) { if (loc && !loc.doc && S.viewing) act.closeViewer(); return false; }
    H.restoring = true;
    PS.openDocAt(doc, loc.page);
    act.setZoom(loc.zoom || 1);
    const apply = () => { vscroll.scrollTo({ top: loc.top, left: loc.left, behavior: 'auto' }); };
    apply();
    requestAnimationFrame(() => { apply(); requestAnimationFrame(() => { apply(); here = capture(); H.restoring = false; record(); }); });
    return true;
  }
  PS.goBack = function () { const loc = H.back.pop(); if (!loc) { PS.toast('これより前の場所はありません'); return false; } H.fwd.push(capture()); return go(loc); };
  PS.goForward = function () { const loc = H.fwd.pop(); if (!loc) return false; H.back.push(capture()); return go(loc); };

  // restore the last session at launch (unless the address already says what to show)
  async function restoreSession() {
    if (location.hash.length > 1) return;
    const s = await store.get('kv', 'session').catch(() => null);
    if (!s || (!s.q && !s.doc)) return;
    await new Promise((resolve) => { const t = setInterval(() => { if (L.loaded) { clearInterval(t); resolve(); } }, 30); });
    await dictReady.catch(() => {});
    if (S.query || S.viewing) return; // the owner was faster
    if (s.scope && L.byId.get(s.scope)) S.scope = L.byId.get(s.scope);
    if (s.q) PS.setQuery(s.q);
    PS.restored = { q: s.q || '', doc: null, page: 0 };
    const doc = s.doc ? L.byId.get(s.doc) : null;
    if (doc && doc.pages.length) {
      H.restoring = true;
      PS.openDocAt(doc, s.page);
      act.setZoom(s.zoom || 1);
      const apply = () => vscroll.scrollTo({ top: s.top || 0, left: s.left || 0, behavior: 'auto' });
      requestAnimationFrame(() => { apply(); requestAnimationFrame(() => { apply(); here = capture(); H.restoring = false; }); });
      PS.restored.doc = doc.name; PS.restored.page = s.page;
    }
  }

  // ---------------------------------------------------------------- open the original (A10), read a page again (A7)
  PS.lastOpened = null;
  /** The PDF's own bytes in a new tab at the current page. The app's state does not change. */
  PS.openOriginal = async function (page) {
    page = page || PS.currentViewerPage();
    if (!page) return null;
    try {
      const bytes = await page.doc.getBytes();
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })) + '#page=' + page.no;
      PS.lastOpened = url;
      const w = window.open(url, '_blank', 'noopener');
      if (w === null && !window.open) PS.toast('新しいタブを開けませんでした');
      setTimeout(() => URL.revokeObjectURL(url.split('#')[0]), 10 * 60000);
      return url;
    } catch (err) { PS.toast(err && err.needAccess ? '原本を開くにはフォルダへのアクセス許可が必要です（＋ → 再スキャン）' : '原本を開けませんでした'); return null; }
  };
  PS.reocrCurrent = async function (rotate) {
    const page = PS.currentViewerPage();
    if (!page) return null;
    page.rot = rotate ? ((page.rot || 0) + 90) % 360 : page.rot || 0;
    const beforeConf = page.ocr === 2 ? page.conf : null;
    PS.toast('p.' + page.no + ' を OCR し直しています…' + (page.rot ? '（' + page.rot + '° 回転）' : ''));
    const r = await PS.reocrPage(page, { rotate: page.rot, longSide: 3400 });
    if (!r) { PS.toast('OCR できませんでした' + (page.ocrError ? ': ' + page.ocrError : '')); return null; }
    PS.toast('p.' + page.no + ' を読み直しました ・ 信頼度 ' + (beforeConf == null ? '' : beforeConf + '% → ') + r.conf + '%（' + r.chars + ' 文字）');
    act.refresh();
    return r;
  };

  // ---------------------------------------------------------------- keys + menu
  PS.extraKey = function (e) {
    const k = e.key.toLowerCase();
    if (k === 'l') { e.preventDefault(); PS.showLedger(); return true; }
    if (k === 'h') { e.preventDefault(); PS.showHistory(); return true; }
    if (k === 'd') { PS.toggleScope(); return true; }
    if (S.viewing && k === 'o') { PS.openOriginal(); return true; }
    if (S.viewing && k === 'r') { PS.reocrCurrent(e.shiftKey); return true; }
    return false;
  };
  PS.extraModKey = function (e) {
    if ((e.altKey && e.key === 'ArrowLeft') || (e.metaKey && e.key === '[')) { e.preventDefault(); PS.goBack(); return true; }
    if ((e.altKey && e.key === 'ArrowRight') || (e.metaKey && e.key === ']')) { e.preventDefault(); PS.goForward(); return true; }
    return false;
  };
  PS.extraMenu = () => [
    { label: '検索できた範囲（台帳）', run: () => PS.showLedger(), hint: 'L' },
    { label: '検索履歴', run: () => PS.showHistory(), hint: 'H' },
    { label: 'キー操作と検索の書き方', run: () => PS.showHelp(), hint: '?' },
  ];

  PS.reloadHistory().catch(() => {});
  restoreSession().catch(() => {});
})(window);
