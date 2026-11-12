/*
 * notes.js — what the owner makes and takes away. No fixed UI: keys, the context menu, transient overlays.
 *
 *   bookmarks (B), highlights of a hit or of a dragged region (K), short notes (M)
 *       stored as USER DATA, keyed by the document's content hash + page + page coordinates (0..1),
 *       so they survive moving / renaming the file. If the file's content changes they stay with the old hash
 *       and are shown as "original changed" on the nearest page of the new version — never silently re-anchored.
 *   copy out (Ctrl/⌘+Shift+C): the hit's line (or the text in a dragged region) + a source line built only from
 *       what the PDF states or the owner entered; region / page as a 300 dpi PNG re-rendered from the PDF.
 *   export: Markdown, JSON, an offline HTML reading list with page thumbnails; one backup file of all user data.
 */
(function (root) {
  'use strict';
  const PS = root.PS, store = PS.store, L = PS.library;
  const $ = (id) => document.getElementById(id);
  const vscroll = $('vscroll');
  const S = PS.ui, V = PS.viewer;
  const uid = () => 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const el = (tag, props, ...kids) => { const e = document.createElement(tag); Object.assign(e, props || {}); for (const k of kids) e.append(k); return e; };

  // ---------------------------------------------------------------- transient overlays shared with extras.js
  let overlayEl = null, popEl = null;
  PS.overlay = function (panel, onClose) {
    PS.closeOverlays();
    panel.classList.add('panel');
    overlayEl = el('div', { className: 'overlay' }, panel);
    overlayEl._onClose = onClose;
    overlayEl.addEventListener('pointerdown', (e) => { if (e.target === overlayEl) PS.closeOverlays(); });
    document.body.appendChild(overlayEl);
    const f = panel.querySelector('textarea, input, button.go');
    if (f) f.focus();
    return overlayEl;
  };
  PS.popmenu = function (x, y, items, col) {
    if (popEl) popEl.remove();
    popEl = el('div', { className: 'popmenu' + (col ? ' col' : '') });
    for (const [label, run] of items) popEl.append(el('button', { type: 'button', textContent: label, onclick: () => { closePop(); run(); } }));
    document.body.appendChild(popEl);
    const r = popEl.getBoundingClientRect();
    popEl.style.left = Math.max(8, Math.min(x, innerWidth - r.width - 8)) + 'px';
    popEl.style.top = Math.max(8, Math.min(y, innerHeight - r.height - 8)) + 'px';
  };
  function closePop() { if (popEl) { popEl.remove(); popEl = null; return true; } return false; }
  /** Close whatever transient layer is open. Returns true if something was closed (Esc stops there). */
  PS.closeOverlays = function () {
    let closed = closePop();
    if (overlayEl) { const o = overlayEl; overlayEl = null; o.remove(); if (o._onClose) o._onClose(); closed = true; }
    if (selection) { clearSelection(); closed = true; }
    return closed;
  };
  document.addEventListener('pointerdown', (e) => { if (popEl && !e.target.closest('.popmenu')) closePop(); }, true);

  // ---------------------------------------------------------------- data
  const N = (PS.notes = { all: new Map(), byDoc: new Map(), cites: new Map(), loaded: false });
  PS.notesRev = 1;
  function reindex() {
    N.byDoc.clear();
    for (const a of N.all.values()) { if (!N.byDoc.has(a.doc)) N.byDoc.set(a.doc, []); N.byDoc.get(a.doc).push(a); }
    PS.notesRev++;
  }
  function touched() { store.get('kv', 'backup').then((b) => store.put('kv', Object.assign({}, b, { changed: Date.now() }), 'backup')).catch(() => {}); }
  PS.loadNotes = async function () {
    const [annots, cites] = await Promise.all([store.getAll('annots'), store.getAll('cites')]);
    N.all = new Map(annots.map((a) => [a.id, a]));
    N.cites = new Map(cites.map((c) => [c.id, c]));
    N.loaded = true;
    reindex();
    if (PS.repaintNotes) PS.repaintNotes();
  };
  function save(a) { a.updated = Date.now(); N.all.set(a.id, a); reindex(); touched(); PS.repaintNotes(); return store.put('annots', a).catch(() => PS.toast('保存できませんでした（ブラウザの保存領域）')); }
  function remove(a) { N.all.delete(a.id); reindex(); touched(); PS.repaintNotes(); return store.del('annots', a.id).catch(() => {}); }

  // notes made on an older version of a file: shown on the new version, flagged, not re-anchored
  function linkedNotes(docId) {
    const out = [];
    for (const v of PS.versions.values()) if (v.new === docId) for (const a of N.byDoc.get(v.old) || []) out.push(a);
    return out;
  }
  const nearest = (doc, no) => Math.min(doc.numPages, Math.max(1, no));
  const notesOn = (page) => (N.byDoc.get(page.doc.id) || []).filter((a) => a.page === page.no);
  const changedOn = (page) => linkedNotes(page.doc.id).filter((a) => nearest(page.doc, a.page) === page.no);
  PS.pageHasNotes = (page) => notesOn(page).length > 0 || changedOn(page).length > 0;
  PS.notesOn = notesOn;
  PS.changedNotesOn = changedOn;

  /** Paint the notes of a page into a marks layer (called by ui.js for whole pages). */
  PS.paintNotes = function (frag, g, rx, ry, rw, rh, mark) {
    if (!g.doc) return;
    const page = g.doc.pages[g.no - 1];
    if (!page) return;
    const w = g.w, h = g.h;
    let pins = 0;
    for (const a of notesOn(page)) {
      if (a.kind === 'bookmark') { frag.appendChild(mark('ribbon', w * 0.9, 0, w * 0.945, h * 0.055, rx, ry, rw, rh)); continue; }
      if (a.rects && a.rects.length) for (const r of a.rects) { const m = mark('note-hl' + (a.note ? ' has-text' : ''), r[0] * w, r[1] * h, r[2] * w, r[3] * h, rx, ry, rw, rh); if (a.note) m.title = a.note; m.dataset.note = a.id; frag.appendChild(m); }
      else { const m = mark('pin', w * 0.955, h * (0.07 + 0.035 * pins), w * 0.98, h * (0.07 + 0.035 * pins) + w * 0.025, rx, ry, rw, rh); m.title = a.note || ''; m.dataset.note = a.id; frag.appendChild(m); pins++; }
    }
    for (const a of changedOn(page)) {
      const rs = a.rects && a.rects.length ? a.rects : [[0.9, 0.0, 0.945, 0.055]];
      for (const r of rs) { const m = mark('changed', r[0] * w, r[1] * h, r[2] * w, r[3] * h, rx, ry, rw, rh); m.title = '原本が変更されました（旧版 p.' + a.page + ' の' + (a.kind === 'bookmark' ? 'しおり' : a.note ? 'メモ: ' + a.note : 'ハイライト') + '）'; frag.appendChild(m); }
    }
  };

  /** Pages that carry notes, in library order (for the "しおり・メモ" wall). */
  PS.markedPages = function () {
    const out = [], seen = new Set();
    const add = (p) => { if (p && !seen.has(p)) { seen.add(p); out.push(p); } };
    for (const d of L.docs) {
      const list = (N.byDoc.get(d.id) || []).map((a) => a.page).concat(linkedNotes(d.id).map((a) => nearest(d, a.page)));
      for (const no of [...new Set(list)].sort((a, b) => a - b)) add(d.pages[no - 1]);
    }
    return out;
  };
  /** Notes whose document is not in the library right now (file gone, or backup restored before the PDFs were added). */
  PS.unmatchedNotes = function () {
    const out = [];
    for (const a of N.all.values()) { if (L.byId.has(a.doc)) continue; const v = PS.versions.get(a.doc); if (v && L.byId.has(v.new)) continue; out.push(a); }
    return out;
  };

  // ---------------------------------------------------------------- where the owner is pointing
  const curPage = () => PS.currentViewerPage();
  // the current hit as { page, rects (0..1), text } — from n/N, else the first hit of the opened page
  async function currentHit() {
    if (!S.viewing || !S.res) return null;
    let page = null, hi = 0;
    if (V.cur) { page = V.cur.page; hi = V.cur.hit; } else { page = V.page && S.res.byPage.get(V.page) ? V.page : curPage(); }
    const entry = page ? S.res.byPage.get(page) : null;
    if (!entry || !entry.hits[hi]) return null;
    const g = await PS.geom(page);
    const h = entry.hits[hi];
    const rects = PS.hitRects(g, h.ds, h.len).map((r) => [r[0] / g.w, r[1] / g.h, r[2] / g.w, r[3] / g.h]);
    // the whole line the hit sits on: that is what one reads and cites
    let li = 0;
    while (li < g.lines.length - 1 && g.lines[li].e <= h.ds) li++;
    return { page, rects, text: PS.lineText(g, li), ocr: PS.hitConf(g, h.ds, h.len) >= 0 };
  }

  // ---------------------------------------------------------------- region selection (Shift + drag on an opened page)
  let selection = null; // { page, rect: [x0,y0,x1,y1] 0..1, el }
  let dragAt = 0;
  PS.dragging = () => performance.now() - dragAt < 350;
  function clearSelection() { if (selection && selection.el) selection.el.remove(); selection = null; }
  vscroll.addEventListener('pointerdown', (e) => {
    if (!e.shiftKey || e.button !== 0) return;
    const sheet = e.target.closest('.vsheet');
    if (!sheet) return;
    e.preventDefault();
    clearSelection();
    const vp = sheet.parentElement._vp;
    const box = sheet.getBoundingClientRect();
    const x0 = (e.clientX - box.left) / box.width, y0 = (e.clientY - box.top) / box.height;
    const rectEl = el('div', { className: 'sel-rect' });
    sheet.appendChild(rectEl);
    const sel = { page: vp.page, rect: [x0, y0, x0, y0], el: rectEl };
    const move = (ev) => {
      const x1 = Math.min(1, Math.max(0, (ev.clientX - box.left) / box.width)), y1 = Math.min(1, Math.max(0, (ev.clientY - box.top) / box.height));
      sel.rect = [Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1)];
      Object.assign(rectEl.style, { left: sel.rect[0] * 100 + '%', top: sel.rect[1] * 100 + '%', width: (sel.rect[2] - sel.rect[0]) * 100 + '%', height: (sel.rect[3] - sel.rect[1]) * 100 + '%' });
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      dragAt = performance.now();
      if (sel.rect[2] - sel.rect[0] < 0.01 || sel.rect[3] - sel.rect[1] < 0.005) { rectEl.remove(); return; }
      selection = sel;
      regionMenu(ev.clientX + 6, ev.clientY + 6);
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  });
  function regionMenu(x, y) {
    PS.popmenu(x, y, [
      ['画像をコピー', () => copyImage(selection.page, selection.rect).then(clearSelection)],
      ['テキストをコピー', () => copyText().then(clearSelection)],
      ['ハイライト', () => { addHighlight(); }],
      ['メモ', () => editNote()],
    ]);
  }
  /** Select a region programmatically (tests; rect in page fractions). */
  PS.selectRegion = function (page, rect) {
    clearSelection();
    const vp = V.pages[page.no - 1];
    const rectEl = el('div', { className: 'sel-rect' });
    Object.assign(rectEl.style, { left: rect[0] * 100 + '%', top: rect[1] * 100 + '%', width: (rect[2] - rect[0]) * 100 + '%', height: (rect[3] - rect[1]) * 100 + '%' });
    if (vp) vp.sheet.appendChild(rectEl);
    selection = { page, rect, el: rectEl };
  };

  // right-click on an opened page: the same actions, for the page
  vscroll.addEventListener('contextmenu', (e) => {
    const sheet = e.target.closest('.vsheet');
    if (!sheet) return;
    e.preventDefault();
    const page = sheet.parentElement._vp.page;
    const noteEl = e.target.closest('[data-note]');
    const items = [];
    if (noteEl && N.all.get(noteEl.dataset.note)) { const a = N.all.get(noteEl.dataset.note); items.push(['メモを編集', () => editNote(a)], ['このハイライト・メモを消す', () => remove(a)]); }
    items.push([notesOn(page).some((a) => a.kind === 'bookmark') ? 'しおりを外す' : 'しおりを付ける (B)', () => toggleBookmark(page)],
      ['このページにメモ (M)', () => editNote(null, page)],
      ['ページ全体を画像でコピー', () => copyImage(page, [0, 0, 1, 1])],
      ['書誌情報を確認・修正 (I)', () => editCite(page.doc)]);
    if (PS.openOriginal) items.push(['原本を新しいタブで開く (O)', () => PS.openOriginal(page)]);
    PS.popmenu(e.clientX, e.clientY, items, true);
  });

  // ---------------------------------------------------------------- bookmark / highlight / note
  function base(page, kind) { return { id: uid(), doc: page.doc.id, page: page.no, kind, rects: null, note: '', text: '', name: page.doc.name, path: page.doc.path, created: Date.now() }; }
  function toggleBookmark(page) {
    page = page || curPage();
    if (!page) return;
    const have = notesOn(page).find((a) => a.kind === 'bookmark');
    if (have) { remove(have); PS.toast('しおりを外しました'); } else { save(base(page, 'bookmark')); PS.toast('しおりを付けました ・ p.' + page.no); }
  }
  async function addHighlight() {
    let a = null;
    if (selection) { a = base(selection.page, 'highlight'); a.rects = [selection.rect]; a.text = await regionText(selection.page, selection.rect); clearSelection(); }
    else { const h = await currentHit(); if (h) { a = base(h.page, 'highlight'); a.rects = h.rects; a.text = h.text; } }
    if (!a) { PS.toast('ヒット上（n で移動）か、Shift+ドラッグで範囲を選んでから K'); return null; }
    await save(a);
    PS.toast('ハイライトしました ・ p.' + a.page);
    return a;
  }
  async function editNote(existing, page) {
    let a = existing || null;
    if (!a) {
      if (selection) { a = base(selection.page, 'note'); a.rects = [selection.rect]; a.text = await regionText(selection.page, selection.rect); }
      else {
        const h = page ? null : await currentHit();
        if (h) { a = base(h.page, 'note'); a.rects = h.rects; a.text = h.text; }
        else { const p = page || curPage(); if (!p) return; a = base(p, 'note'); }
      }
    }
    const ta = el('textarea', { rows: 4, value: a.note || '', placeholder: 'メモ（Ctrl+Enter で保存）' });
    ta.style.minWidth = '380px';
    const done = () => { a.note = ta.value.trim(); PS.closeOverlays(); if (!a.note && !a.rects) { if (existing) remove(a); return; } save(a); PS.toast('メモを保存しました ・ p.' + a.page); };
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); done(); } });
    const panel = el('div', {}, el('h2', { textContent: a.name + ' ・ p.' + a.page + ' のメモ' }), ta,
      el('div', { className: 'row' }, existing ? el('button', { type: 'button', textContent: '削除', onclick: () => { PS.closeOverlays(); remove(a); } }) : '', el('button', { type: 'button', textContent: 'やめる', onclick: () => PS.closeOverlays() }), el('button', { type: 'button', className: 'go', textContent: '保存', onclick: done })));
    PS.overlay(panel, clearSelection);
    ta.focus();
  }
  PS.noteApi = { toggleBookmark, addHighlight, editNote, save, remove, base };

  // ---------------------------------------------------------------- citation fields (found in the PDF, or entered once by the owner)
  /** { title, authors, year, journal, doi, src: { field: 'xmp'|'info'|'text'|'owner' }, label(no) } — nothing is guessed. */
  PS.citation = function (doc) {
    const m = doc.meta || {}, u = N.cites.get(doc.id) || {};
    const out = { src: {} };
    for (const k of ['title', 'authors', 'year', 'journal', 'doi']) {
      if (u[k]) { out[k] = u[k]; out.src[k] = 'owner'; } else if (m[k]) { out[k] = m[k]; out.src[k] = (m.src && m.src[k]) || 'pdf'; } else out[k] = '';
    }
    out.confirmed = Object.fromEntries(Object.entries(out.src).map(([k, v]) => [k, v === 'owner']));
    // printed page number: only from /PageLabels or an offset the owner set
    out.label = (no) => (u.labelOffset != null && u.labelOffset !== '' ? String(no + Number(u.labelOffset)) : doc.labels && doc.labels[no - 1] && doc.labels[no - 1] !== String(no) ? doc.labels[no - 1] : doc.labels && doc.labels[no - 1] ? doc.labels[no - 1] : '');
    out.labelSource = u.labelOffset != null && u.labelOffset !== '' ? 'owner' : doc.labels ? 'pdf' : '';
    return out;
  };
  PS.sourceLine = function (doc, no) {
    const c = PS.citation(doc);
    const parts = [];
    if (c.authors) parts.push(c.authors);
    if (c.title) parts.push(c.title);
    if (c.journal) parts.push(c.journal);
    if (c.year) parts.push(c.year);
    if (c.doi) parts.push('doi:' + c.doi);
    const label = c.label(no);
    const where = doc.name + ', PDF p.' + no + (c.labelSource && label ? ' (p.' + label + ')' : '');
    return (parts.length ? parts.join('. ') + '. — ' : '— ') + where;
  };
  function editCite(doc) {
    doc = doc || (curPage() && curPage().doc);
    if (!doc) return;
    const c = PS.citation(doc), u = N.cites.get(doc.id) || {};
    const fields = [['title', '題名'], ['authors', '著者'], ['year', '年'], ['journal', '誌名・発行元'], ['doi', 'DOI']];
    const inputs = {};
    const panel = el('div', {}, el('h2', { textContent: '書誌情報 ・ ' + doc.name }));
    panel.style.minWidth = '460px';
    for (const [k, label] of fields) {
      const src = c.src[k] === 'owner' ? '（入力済み）' : c.src[k] ? '（PDF内: ' + c.src[k] + '・未確認）' : '（PDFに記載なし）';
      inputs[k] = el('input', { type: 'text', value: c[k] || '' });
      panel.append(el('label', { textContent: label + ' ' + src }), inputs[k]);
    }
    inputs.labelOffset = el('input', { type: 'text', value: u.labelOffset != null ? u.labelOffset : '', placeholder: doc.labels ? 'PDFのページラベルを使用中' : '例: 68（PDF p.4 が印刷ページ 72 のとき）' });
    panel.append(el('label', { textContent: '印刷ページ番号 = PDFページ + この数（空欄: ' + (doc.labels ? 'PDFのページラベル' : '印刷ページは出典に書かない') + '）' }), inputs.labelOffset);
    const done = () => {
      const rec = { id: doc.id, name: doc.name, updated: Date.now() };
      // only what the owner actually changed becomes "confirmed"
      for (const [k] of fields) { const v = inputs[k].value.trim(); if (v && (v !== (doc.meta && doc.meta[k] || '') || u[k])) rec[k] = v; }
      const off = inputs.labelOffset.value.trim();
      if (off !== '' && !isNaN(Number(off))) rec.labelOffset = Number(off);
      N.cites.set(doc.id, rec);
      touched();
      store.put('cites', rec).catch(() => {});
      PS.closeOverlays();
      PS.toast('書誌情報を保存しました');
    };
    panel.append(el('div', { className: 'row' }, el('button', { type: 'button', textContent: 'やめる', onclick: () => PS.closeOverlays() }), el('button', { type: 'button', className: 'go', textContent: '保存', onclick: done })));
    PS.overlay(panel);
  }
  PS.setCitation = (doc, fields) => { const rec = Object.assign({ id: doc.id, name: doc.name, updated: Date.now() }, fields); N.cites.set(doc.id, rec); touched(); return store.put('cites', rec); };

  // ---------------------------------------------------------------- copy out
  PS.lastCopy = null;   // what was last copied (also for tests): { kind, text?, blob?, w?, h?, dpi?, via }
  function download(name, blob) {
    const a = el('a', { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  PS.download = download;
  async function regionText(page, rect) {
    const g = await PS.geom(page);
    const lines = [];
    for (const ln of g.lines) {
      const cy = (ln.y0 + ln.y1) / 2 / g.h;
      if (cy < rect[1] || cy > rect[3]) continue;
      // items of this line whose centre falls inside the region
      let s = '';
      for (let k = g.itemOf[ln.s]; k <= g.itemOf[ln.e - 1]; k++) { const it = g.items[k]; const cx = (it.x + it.ux * it.len / 2) / g.w; if (cx >= rect[0] && cx <= rect[2]) s += it.str; }
      if (s.trim()) lines.push(s.replace(/\s+/g, ' ').trim());
    }
    return lines.join('\n');
  }
  /** Copy the current hit's line (or the text inside the selected region) with its source line. */
  async function copyText() {
    let page, text, ocr;
    if (selection) { page = selection.page; text = await regionText(page, selection.rect); ocr = page.ocr === 2; }
    else { const h = await currentHit(); if (!h) { PS.toast('コピーするヒットがありません（n でヒットへ、または Shift+ドラッグで範囲選択）'); return null; } page = h.page; text = h.text; ocr = h.ocr || page.ocr === 2; }
    if (!text) { PS.toast('この範囲に文字はありません'); return null; }
    const source = PS.sourceLine(page.doc, page.no);
    const out = (ocr ? '[OCR未確認] ' : '') + text + '\n' + source;
    let via = 'clipboard';
    try { await navigator.clipboard.writeText(out); } catch (_) { via = 'download'; download('copy-' + page.doc.name.replace(/\.pdf$/i, '') + '-p' + page.no + '.txt', new Blob([out], { type: 'text/plain' })); }
    PS.lastCopy = { kind: 'text', text: out, source, ocr, via, fields: PS.citation(page.doc) };
    PS.toast(via === 'clipboard' ? '出典付きでコピーしました' : 'クリップボードが使えないため、テキストファイルとして保存しました');
    return PS.lastCopy;
  }
  // resolution of the scan a page consists of (image-only pages): do not pretend to more detail than the source has
  async function sourceDpi(page) {
    if (page.ocr === 0) return Infinity;
    try {
      return await PS.withPdf(page.doc, async (pdf) => {
        const p = await pdf.getPage(page.no);
        const ops = await p.getOperatorList();
        let best = 0;
        ops.fnArray.forEach((fn, i) => { if (fn === root.pdfjsLib.OPS.paintImageXObject) { const w = ops.argsArray[i][1]; if (w > best) best = w; } });
        return best ? best / (page.w / 72) : Infinity;
      });
    } catch (_) { return Infinity; }
  }
  /** Region (page fractions) -> PNG re-rendered from the PDF at 300 dpi (72 pt = 300 px), without highlights or UI. */
  async function copyImage(page, rect) {
    const src = await sourceDpi(page);
    const dpi = Math.min(300, Math.round(src));
    const scale = dpi / 72;
    const x = rect[0] * page.w, y = rect[1] * page.h, w = (rect[2] - rect[0]) * page.w, h = (rect[3] - rect[1]) * page.h;
    let canvas;
    try { canvas = await PS.renderPage(page, { scale, x, y, width: w * scale, height: h * scale }).promise; }
    catch (err) { PS.toast(err && err.needAccess ? '原本を読むにはフォルダへのアクセス許可が必要です' : '画像を作れませんでした'); return null; }
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    let via = 'clipboard';
    try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); } catch (_) { via = 'download'; download(page.doc.name.replace(/\.pdf$/i, '') + '-p' + page.no + '.png', blob); }
    PS.lastCopy = { kind: 'image', blob, w: canvas.width, h: canvas.height, dpi, via, source: PS.sourceLine(page.doc, page.no) };
    PS.toast((via === 'clipboard' ? '画像をコピーしました' : 'クリップボードが使えないため、PNG として保存しました') + ' ・ ' + canvas.width + '×' + canvas.height + ' px ・ ' + dpi + ' dpi' + (dpi < 300 ? '（スキャン原稿の解像度まで）' : ''));
    return PS.lastCopy;
  }
  PS.copyApi = { copyText, copyImage, regionText };

  // ---------------------------------------------------------------- export / import / backup
  const linkTo = (a) => new URL('index.html', location.href).href.split('#')[0] + '#doc=' + a.doc + '&p=' + a.page;
  const KIND = { bookmark: 'しおり', highlight: 'ハイライト', note: 'メモ' };
  const sorted = () => [...N.all.values()].sort((a, b) => (a.path || a.name).localeCompare(b.path || b.name) || a.page - b.page || a.created - b.created);
  const stamp = () => new Date().toISOString().slice(0, 10);
  PS.lastExport = null;
  function out(name, text, type) { PS.lastExport = { name, text, type }; download(name, new Blob([text], { type })); PS.toast(name + ' を保存しました'); return PS.lastExport; }
  const live = (a) => { const d = L.byId.get(a.doc); return d ? { name: d.name, path: d.path } : { name: a.name, path: a.path }; };

  PS.exportJson = function () {
    const items = sorted().map((a) => ({ ...a, file: live(a).name, path: live(a).path, link: linkTo(a) }));
    return out('pdf-notes-' + stamp() + '.json', JSON.stringify({ app: 'pdf-cross-search', kind: 'annotations', version: 1, exported: new Date().toISOString(), items }, null, 2), 'application/json');
  };
  PS.exportMarkdown = function () {
    const md = ['# しおり・ハイライト・メモ', '', '書き出し: ' + new Date().toISOString().slice(0, 16).replace('T', ' '), ''];
    let file = null;
    for (const a of sorted()) {
      const f = live(a);
      if (f.path !== file) { file = f.path; md.push('', '## ' + f.name, '', '`' + f.path + '`', ''); }
      const d = L.byId.get(a.doc);
      md.push('- **p.' + a.page + '** ' + KIND[a.kind] + (a.note ? ' — ' + a.note.replace(/\n/g, ' ') : '') + (a.text ? '\n  > ' + a.text.replace(/\n/g, ' ') : '') + '\n  [' + (d ? PS.sourceLine(d, a.page) : f.name + ', PDF p.' + a.page) + '](' + linkTo(a) + ')');
    }
    return out('pdf-notes-' + stamp() + '.md', md.join('\n') + '\n', 'text/markdown');
  };
  const b64 = (buf) => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /** One self-contained HTML page: the bookmarked / noted pages as thumbnails (data: URIs), each linking back into the app. */
  PS.exportHtml = async function () {
    const pages = new Map();
    for (const a of sorted()) { const k = a.doc + ':' + a.page; if (!pages.has(k)) pages.set(k, []); pages.get(k).push(a); }
    const cards = [];
    for (const [, list] of pages) {
      const a = list[0], f = live(a);
      const t = await PS.thumbData(a.doc, a.page).catch(() => null);
      const img = t && t.data ? `<img alt="" src="data:${t.type};base64,${b64(t.data)}">` : '<div class="none"></div>';
      const marks = list.flatMap((x) => (x.rects || []).map((r) => `<i style="left:${r[0] * 100}%;top:${r[1] * 100}%;width:${(r[2] - r[0]) * 100}%;height:${(r[3] - r[1]) * 100}%"></i>`)).join('');
      const notes = list.filter((x) => x.note).map((x) => `<p>${esc(x.note)}</p>`).join('');
      cards.push(`<a class="card" href="${esc(linkTo(a))}"><div class="sheet">${img}${marks}${list.some((x) => x.kind === 'bookmark') ? '<b></b>' : ''}</div><div class="cap"><span>${esc(f.name)}</span><span>p.${a.page}</span></div>${notes}</a>`);
    }
    const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>リーディングリスト ${stamp()}</title>
<style>body{margin:0;padding:36px 28px 60px;background:#e6e4df;color:#2a2927;font:13px/1.5 -apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic UI","Noto Sans CJK JP",sans-serif}
h1{font-size:16px;margin:0 0 4px}p.lead{margin:0 0 24px;color:#7b776f;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:26px}
.card{color:inherit;text-decoration:none}.sheet{position:relative;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.14),0 10px 28px rgba(0,0,0,.13)}
.sheet img{display:block;width:100%}.sheet .none{aspect-ratio:210/297}
.sheet i{position:absolute;background:rgba(120,220,140,.45);mix-blend-mode:multiply}.sheet b{position:absolute;right:6%;top:0;width:5%;height:6%;background:#f76707;clip-path:polygon(0 0,100% 0,100% 100%,50% 72%,0 100%)}
.cap{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:11.5px}.cap span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card p{margin:4px 0 0;font-size:12px;color:#444}</style></head><body>
<h1>リーディングリスト</h1><p class="lead">${stamp()} 書き出し ・ ${pages.size} ページ。ページをクリックすると PDF横断検索 でそのページが開きます（このファイルは単体でオフライン表示できます）。</p>
<div class="grid">${cards.join('\n')}</div></body></html>`;
    return out('reading-list-' + stamp() + '.html', html, 'text/html');
  };

  /** Everything the owner made, in one file (A9). Folder handles cannot leave the browser: their names are listed. */
  PS.exportBackup = async function () {
    const [dict, history, session, versions] = await Promise.all([store.get('kv', 'dictionary'), store.getAll('history'), store.get('kv', 'session'), store.get('kv', 'versions')]);
    const data = {
      app: 'pdf-cross-search', kind: 'backup', version: 1, schema: PS.SCHEMA, exported: new Date().toISOString(),
      annotations: sorted().map((a) => ({ ...a, sha: a.doc, file: live(a).name })),
      citations: [...N.cites.values()],
      dictionary: dict || null,
      history: history || [],
      versions: versions || [],
      session: session || null,
      folders: L.folders.map((f) => ({ name: f.name, kind: f.kind, count: f.count || 0 })),
    };
    const r = out('pdf-search-backup-' + stamp() + '.json', JSON.stringify(data, null, 2), 'application/json');
    store.get('kv', 'backup').then((b) => store.put('kv', Object.assign({}, b, { saved: Date.now() }), 'backup')).catch(() => {});
    return r;
  };

  /**
   * Read a JSON file the owner dropped or picked: an annotation export, a backup, or a dictionary.
   * Notes are re-linked by content hash; what has no matching PDF in the library is kept and reported, never dropped.
   */
  PS.importJson = async function (file) {
    let data;
    try { data = JSON.parse(typeof file === 'string' ? file : await file.text()); } catch (_) { PS.toast('JSON として読めませんでした'); return null; }
    if (data && (Array.isArray(data.groups) || (Array.isArray(data) && Array.isArray(data[0])))) return PS.loadDictionary ? PS.loadDictionary(data, true) : null;
    if (!data || data.app !== 'pdf-cross-search') { PS.toast('このアプリの書き出しファイルではありません'); return null; }
    const report = { kind: data.kind, notes: 0, citations: 0, dictionary: 0, history: 0, unmatched: [] };
    const ops = [];
    for (const a of data.items || data.annotations || []) {
      const rec = { id: a.id || uid(), doc: a.doc || a.sha, page: a.page, kind: a.kind, rects: a.rects || null, note: a.note || '', text: a.text || '', name: a.name || a.file, path: a.path || a.file, created: a.created || Date.now(), updated: a.updated || Date.now() };
      if (!rec.doc || !rec.page || !KIND[rec.kind]) continue;
      N.all.set(rec.id, rec);
      ops.push({ put: 'annots', value: rec });
      report.notes++;
    }
    if (data.kind === 'backup') {
      for (const c of data.citations || []) { if (!c.id) continue; N.cites.set(c.id, c); ops.push({ put: 'cites', value: c }); report.citations++; }
      if (data.dictionary && PS.loadDictionary) { await PS.loadDictionary(data.dictionary, true, true); report.dictionary = (data.dictionary.groups || []).length; }
      for (const h of data.history || []) { if (h && h.id) { ops.push({ put: 'history', value: h }); report.history++; } }
      if ((data.versions || []).length) { for (const v of data.versions) PS.versions.set(v.old, v); ops.push({ put: 'kv', key: 'versions', value: [...PS.versions.values()] }); }
    }
    await store.batch(ops);
    reindex();
    PS.repaintNotes();
    if (PS.reloadHistory) PS.reloadHistory();
    const un = new Map();
    for (const a of PS.unmatchedNotes()) un.set(a.doc, a.name || a.doc);
    for (const c of N.cites.values()) if (!L.byId.has(c.id)) un.set(c.id, c.name || c.id);
    report.unmatched = [...un.values()];
    PS.lastImport = report;
    PS.toast((data.kind === 'backup' ? '復元しました: ' : '読み込みました: ') + '注記 ' + report.notes + (report.citations ? '・書誌 ' + report.citations : '') + (report.dictionary ? '・辞書 ' + report.dictionary + ' 組' : '')
      + (report.unmatched.length ? ' ／ 未照合 ' + report.unmatched.length + ' 件（' + report.unmatched.slice(0, 3).join(', ') + (report.unmatched.length > 3 ? ' ほか' : '') + '）は保持しています。PDF を追加すると表示されます' : ''), null, report.unmatched.length ? 12000 : 5000);
    return report;
  };

  // a gentle reminder, at most once a week, when user data changed after the last backup
  async function backupReminder() {
    const b = (await store.get('kv', 'backup')) || {};
    if (!N.all.size && !N.cites.size) return;
    const week = 7 * 86400e3;
    if ((b.changed || 0) > (b.saved || 0) && Date.now() - (b.reminded || 0) > week && Date.now() - (b.changed || 0) > 60000) {
      await store.put('kv', Object.assign({}, b, { reminded: Date.now() }), 'backup');
      PS.toast('しおり・メモがバックアップ後に変更されています', { label: 'バックアップを保存', run: () => PS.exportBackup() }, 12000);
      PS.backupReminded = true;
    }
  }

  // ---------------------------------------------------------------- keys + menu
  /** Plain keys (called by ui.js when focus is not in a text field). Returns true when handled. */
  PS.noteKey = function (e) {
    const k = e.key.toLowerCase();
    if (S.viewing) {
      if (k === 'b') { toggleBookmark(); return true; }
      if (k === 'k') { addHighlight(); return true; }
      if (k === 'm') { e.preventDefault(); editNote(); return true; }
      if (k === 'i') { e.preventDefault(); editCite(); return true; }
    }
    return PS.extraKey ? PS.extraKey(e) : false;
  };
  /** Keys with modifiers. */
  PS.modKey = function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') { e.preventDefault(); copyText(); return true; }
    return PS.extraModKey ? PS.extraModKey(e) : false;
  };
  const pickJson = el('input', { type: 'file', accept: '.json,application/json', hidden: true });
  pickJson.addEventListener('change', () => { if (pickJson.files[0]) PS.importJson(pickJson.files[0]); pickJson.value = ''; });
  document.body.appendChild(pickJson);
  PS.menuExtras = function () {
    const items = [{ label: 'しおり・メモのページを表示', run: () => PS.showMarks(), hint: N.all.size ? String(N.all.size) : '' }];
    if (N.all.size) items.push({ label: '書き出す: Markdown', run: PS.exportMarkdown }, { label: '書き出す: JSON', run: PS.exportJson }, { label: '書き出す: リーディングリスト (HTML)', run: PS.exportHtml });
    items.push({ label: 'バックアップを保存（全ユーザーデータ）', run: PS.exportBackup }, { label: '読み込む・復元 / 辞書を読み込む…', run: () => pickJson.click() });
    if (PS.extraMenu) items.push({ sep: true }, ...PS.extraMenu());
    return items;
  };

  PS.loadNotes().then(() => setTimeout(backupReminder, 4000)).catch(() => {});
})(window);
