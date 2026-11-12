/*
 * ui.js — the screen.
 *
 *   stage  : a wall of page previews. With a query it holds the hit pages, best first,
 *            each with its hits painted on the page and a magnified strip ("lens")
 *            lying on the lines that answer the query.
 *   viewer : opens beside the wall (the wall becomes a narrow rail) and shows the
 *            whole document at reading size, scrolled to the hit. n / N walk hit by hit.
 *   fixed controls: search pill, add button, fullscreen button. Nothing else.
 *            Everything new lives in keys, the ＋ menu, the context menu and transient overlays.
 *
 * Pages come from the persistent index: a stored thumbnail shows at once, hit positions are
 * fetched when a card scrolls into view, and the sharp page is drawn when the PDF is reachable.
 */
(function () {
  'use strict';
  const PS = window.PS;
  const $ = (id) => document.getElementById(id);
  const stage = $('stage'), grid = $('grid'), viewerEl = $('viewer'), vscroll = $('vscroll');
  const input = $('q'), countEl = $('count'), addBtn = $('add'), fsBtn = $('fs'), menu = $('menu'), dropEl = $('drop');

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const LENS_BLEED = 0.035; // lens sticks out 3.5% of the page width on each side (see .lens in app.css)
  const WALL_STEP = 48;     // cards added to the wall at a time

  const S = (PS.ui = {
    query: '',
    res: null,      // PS.search() output for the current query
    entries: [],    // what the wall shows: [{ page, hits, lines, rel }] (library mode: first pages)
    shown: '',
    sel: -1,
    viewing: false,
    drawn: 0,       // how many entries have a card in the wall
    mode: 'library', // 'library' | 'search' | 'marks' (bookmarked pages)
    searchMs: 0,
  });

  // ---------------------------------------------------------------- text measuring (hit rectangles)
  const mctx = document.createElement('canvas').getContext('2d');
  const widths = new Map();
  PS.measure = function (fam, ch) {
    let m = widths.get(fam);
    if (!m) widths.set(fam, (m = new Map()));
    let w = m.get(ch);
    if (w === undefined) {
      mctx.font = '20px ' + fam;
      w = mctx.measureText(ch).width / 20; // em
      m.set(ch, w);
    }
    return w;
  };

  // ---------------------------------------------------------------- render queue
  const queue = [];
  let active = 0;
  function enqueue(prio, page, opts, done, fail) {
    const job = { prio, page, opts, done, fail, dead: false, handle: null };
    queue.push(job);
    pump();
    return job;
  }
  function cancel(job) {
    if (!job) return;
    job.dead = true;
    if (job.handle) job.handle.cancel();
  }
  function pump() {
    while (active < 2 && queue.length) {
      queue.sort((a, b) => a.prio - b.prio);
      const job = queue.shift();
      if (job.dead) continue;
      active++;
      job.handle = PS.renderPage(job.page, job.opts);
      job.handle.promise
        .then((canvas) => { if (!job.dead) job.done(canvas); }, (err) => { if (!job.dead && job.fail) job.fail(err); })
        .finally(() => { active--; pump(); });
    }
  }
  // a document whose PDF cannot be read right now (folder permission not granted yet): do not keep trying
  function noteLocked(doc, err) {
    if (err && 'needAccess' in err) { doc.locked = err.needAccess || true; hintLocked(doc); }
  }

  // ---------------------------------------------------------------- marks (hits painted on a page)
  /** Rectangles of an entry's hits on its page: [{ r: [x0,y0,x1,y1], cls, hit }] */
  function entryRects(entry, g) {
    if (!entry.rects || entry.rectsOf !== g) {
      entry.rects = [];
      entry.rectsOf = g;
      entry.hits.forEach((h, hi) => {
        const conf = PS.hitConf(g, h.ds, h.len);
        let cls = 'hit';
        if (h.syn) cls += ' syn'; else if (h.v) cls += ' var';
        if (conf >= 0) cls += conf < 70 ? ' ocr low' : ' ocr';
        for (const r of PS.hitRects(g, h.ds, h.len)) entry.rects.push({ r, cls, hit: hi });
      });
    }
    return entry.rects;
  }

  function mark(cls, x0, y0, x1, y1, rx, ry, rw, rh) {
    const el = document.createElement('i');
    el.className = cls;
    el.style.left = ((x0 - rx) / rw) * 100 + '%';
    el.style.top = ((y0 - ry) / rh) * 100 + '%';
    el.style.width = ((x1 - x0) / rw) * 100 + '%';
    el.style.height = ((y1 - y0) / rh) * 100 + '%';
    return el;
  }

  /** Fill `box` with marks for `entry`, for the page region (rx,ry,rw,rh); bands only for whole pages. */
  function paintMarks(box, entry, g, rx, ry, rw, rh, withBands, cur) {
    const frag = document.createDocumentFragment();
    if (entry && entry.hits && g) {
      if (withBands) {
        for (const l of entry.lines) {
          const ln = g.lines[l.index];
          if (ln) frag.appendChild(mark('band', ln.x0 - 3, ln.y0 - 2, ln.x1 + 3, ln.y1 + 2, rx, ry, rw, rh));
        }
      }
      for (const m of entryRects(entry, g)) {
        const r = m.r;
        if (r[2] < rx || r[0] > rx + rw || r[3] < ry || r[1] > ry + rh) continue;
        frag.appendChild(mark(m.hit === cur ? m.cls + ' cur' : m.cls, r[0], r[1], r[2], r[3], rx, ry, rw, rh));
      }
    }
    if (PS.paintNotes && withBands && g) PS.paintNotes(frag, g, rx, ry, rw, rh, mark);
    box.replaceChildren(frag);
  }

  // ---------------------------------------------------------------- lenses
  /** Where to put magnified strips on a card whose page is drawn `sheetW` CSS px wide. */
  function lensSpecs(entry, g, sheetW) {
    const page = g;
    const st = sheetW / page.w;
    const LW = page.w * (1 + 2 * LENS_BLEED);
    const groups = [];
    for (const l of entry.lines) {
      const ln = page.lines[l.index];
      if (!ln) continue;
      const gr = groups[groups.length - 1];
      if (gr && gr.n < 3 && ln.y0 - gr.y1 < 1.2 * Math.max(ln.fs, gr.fs) && ln.y0 >= gr.y0) {
        gr.x0 = Math.min(gr.x0, ln.x0); gr.x1 = Math.max(gr.x1, ln.x1); gr.y1 = Math.max(gr.y1, ln.y1);
        gr.fs = Math.max(gr.fs, ln.fs); gr.n++; gr.last = l.index;
      } else groups.push({ x0: ln.x0, y0: ln.y0, x1: ln.x1, y1: ln.y1, fs: ln.fs, n: 1, first: l.index, last: l.index });
    }
    const specs = [];
    let floor = -Infinity;
    for (const gr of groups) {
      const fsPx = gr.fs * st;            // text size on the thumbnail
      let m = Math.min(14.5 / fsPx, 3.2); // aim for ~14px text in the lens
      if (m < 1.25) continue;            // already readable on the page itself
      const pad = gr.fs * 0.9;
      const gw = gr.x1 - gr.x0 + 2 * pad;
      if (LW / gw < m) m = Math.max(LW / gw, Math.max(1.25, 11 / fsPx));
      const bleed = page.w * LENS_BLEED;
      let rx, rw, left;
      if (gw <= LW / m + 0.01) {
        // the strip is only as wide as the line, and the enlarged line starts where the real one does
        rw = gw;
        rx = gr.x0 - pad;
        left = Math.min(Math.max(gr.x0 - pad * m, -bleed), page.w + bleed - rw * m);
      } else {
        // too long even at the smallest zoom: full width, centred on the hits
        rw = LW / m;
        let sum = 0, cnt = 0;
        for (const mk of entryRects(entry, g)) { const r = mk.r; if (r[3] > gr.y0 && r[1] < gr.y1) { sum += (r[0] + r[2]) / 2; cnt++; } }
        const cx = cnt ? sum / cnt : (gr.x0 + gr.x1) / 2;
        rx = Math.min(Math.max(cx - rw / 2, gr.x0 - pad), gr.x1 + pad - rw);
        left = -bleed;
      }
      // breathing room above/below; in tight text cut halfway to the neighbouring line, not through it
      const above = page.lines[gr.first - 1], below = page.lines[gr.last + 1];
      const room = (gap) => Math.min(0.95, Math.max(0.12, gap / gr.fs / 2)) * gr.fs;
      const padTop = room(above && above.y1 <= gr.y0 + gr.fs * 0.3 ? gr.y0 - above.y1 : Infinity);
      const padBottom = room(below && below.y0 >= gr.y1 - gr.fs * 0.3 ? below.y0 - gr.y1 : Infinity);
      const ry = gr.y0 - padTop, rh = gr.y1 - gr.y0 + padTop + padBottom;
      const hT = rh * m; // strip height in page px at thumbnail scale
      let top = (gr.y0 + gr.y1) / 2 - hT / 2;
      top = Math.max(top, floor + page.h * 0.006, 0);
      if (top + hT > page.h) top = page.h - hT;
      if (top < floor) continue;
      floor = top + hT;
      specs.push({ rx, ry, rw, rh, m, top, hT, left, wT: rw * m });
    }
    return specs;
  }

  // ---------------------------------------------------------------- cards
  const cards = new Map(); // page.key -> card
  const rendered = new Set(); // cards holding a sharp canvas (LRU by insertion)
  const MAX_THUMBS = 60;

  function getCard(page) {
    let card = cards.get(page.key);
    if (card && card.page === page) return card;
    const el = document.createElement('article');
    el.className = 'card';
    el.tabIndex = -1;
    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.style.aspectRatio = page.w + ' / ' + page.h;
    const marks = document.createElement('div');
    marks.className = 'marks';
    const lensBox = document.createElement('div');
    lensBox.className = 'lenses';
    sheet.append(marks, lensBox);
    const cap = document.createElement('footer');
    cap.className = 'cap';
    const meter = document.createElement('span');
    meter.className = 'meter';
    const bar = document.createElement('b');
    meter.appendChild(bar);
    const name = document.createElement('span');
    name.className = 'name';
    const pg = document.createElement('span');
    pg.className = 'pg';
    cap.append(meter, name, pg);
    el.append(sheet, cap);
    card = { el, sheet, marks, lensBox, meter, bar, name, pg, page, entry: null, visible: false, img: null, imgAsked: false, canvas: null, thumbW: 0, job: null, lensJobs: [], lensSig: '' };
    el._card = card;
    cards.set(page.key, card);
    io.observe(el);
    return card;
  }

  const io = new IntersectionObserver((list) => {
    for (const e of list) {
      const card = e.target._card;
      if (!card) continue;
      card.visible = e.isIntersecting;
      if (card.visible) ensureCard(card);
      else { cancel(card.job); card.job = null; }
    }
  }, { root: stage, rootMargin: '500px 0px' });

  function ensureCard(card) {
    if (!card.visible || !card.el.isConnected) return;
    const sheetW = card.sheet.clientWidth;
    if (!sheetW) return;
    const page = card.page, doc = page.doc;
    // 1. the stored thumbnail: there at once, also when the PDF itself is out of reach
    if (!card.imgAsked) {
      card.imgAsked = true;
      PS.thumbUrl(page).then((url) => {
        if (!url || card.canvas) return;
        const img = new Image();
        img.className = 'thumb';
        img.alt = '';
        img.decoding = 'async';
        img.src = url;
        card.img = img;
        card.sheet.prepend(img);
      });
    }
    // 2. the sharp page
    if (!card.job && card.thumbW < sheetW * 0.8 && !doc.locked) {
      const cssW = Math.max(sheetW, 200);
      const scale = (cssW * DPR) / page.w;
      card.job = enqueue(1, page, { scale, width: page.w * scale, height: page.h * scale }, (canvas) => {
        card.job = null;
        if (card.canvas) card.canvas.remove();
        card.canvas = canvas;
        card.thumbW = cssW;
        card.sheet.prepend(canvas);
        if (card.img) { card.img.remove(); card.img = null; card.imgAsked = false; }
        rendered.delete(card); rendered.add(card);
        trimThumbs();
      }, (err) => { card.job = null; noteLocked(doc, err); });
    }
    if (rendered.has(card)) { rendered.delete(card); rendered.add(card); }
    // 3. hit marks and lenses need the text positions
    const entry = card.entry;
    if (entry && entry.hits) {
      const g = PS.geomNow(page);
      if (g) { paintCardMarks(card, g); layoutLenses(card, g, sheetW); }
      else PS.geom(page).then((gg) => { if (card.entry === entry && card.visible) { paintCardMarks(card, gg); layoutLenses(card, gg, card.sheet.clientWidth); } });
    } else if (card.lensSig) { card.lensSig = ''; card.lensJobs.forEach(cancel); card.lensJobs = []; card.lensBox.replaceChildren(); }
  }

  function paintCardMarks(card, g) {
    const entry = card.entry;
    const sig = entry && entry.hits ? S.shown + '|' + (PS.notesRev || 0) : '';
    if (card.markSig === sig && card.markOf === entry) return;
    card.markSig = sig; card.markOf = entry;
    paintMarks(card.marks, entry && entry.hits ? entry : null, g, 0, 0, g.w, g.h, true);
  }

  function trimThumbs() {
    if (rendered.size <= MAX_THUMBS) return;
    for (const card of rendered) {
      if (rendered.size <= MAX_THUMBS) break;
      if (card.visible && card.el.isConnected) continue;
      rendered.delete(card);
      if (card.canvas) { card.canvas.remove(); card.canvas.width = 0; card.canvas = null; }
      card.thumbW = 0;
    }
  }

  function layoutLenses(card, g, sheetW) {
    const entry = card.entry;
    const page = card.page;
    const specs = entry && entry.lines && !S.viewing && !page.doc.locked ? lensSpecs(entry, g, sheetW) : [];
    const sig = specs.length ? S.shown + '|' + Math.round(sheetW) + '|' + specs.map((s) => [s.rx, s.ry, s.rw, s.m, s.top].map((v) => v.toFixed(1)).join(',')).join(';') : '';
    if (sig === card.lensSig) return;
    if (S.viewing && card.lensSig) return; // rail mode hides lenses; keep what is there
    card.lensSig = sig;
    card.lensJobs.forEach(cancel);
    card.lensJobs = [];
    const st = sheetW / page.w;
    const els = specs.map((sp) => {
      const lens = document.createElement('div');
      lens.className = 'lens';
      lens.style.left = (sp.left / page.w) * 100 + '%';
      lens.style.width = (sp.wT / page.w) * 100 + '%';
      lens.style.top = (sp.top / page.h) * 100 + '%';
      lens.style.height = (sp.hT / page.h) * 100 + '%';
      const marks = document.createElement('div');
      marks.className = 'marks';
      paintMarks(marks, entry, g, sp.rx, sp.ry, sp.rw, sp.rh, false);
      lens.appendChild(marks);
      const scale = st * sp.m * DPR;
      card.lensJobs.push(enqueue(2, page, { scale, x: sp.rx, y: sp.ry, width: sp.rw * scale, height: sp.rh * scale }, (canvas) => lens.prepend(canvas),
        (err) => { noteLocked(page.doc, err); lens.remove(); }));
      return lens;
    });
    card.lensBox.replaceChildren(...els);
  }

  function updateCard(card, entry, index) {
    card.entry = entry;
    card.index = index;
    const page = card.page, doc = page.doc;
    card.el.dataset.file = doc.name;
    card.el.dataset.page = page.no;
    card.el.classList.toggle('sel', index === S.sel);
    card.el.classList.toggle('scan', page.ocr === 2);
    card.name.textContent = doc.name;
    card.name.title = doc.path || doc.name;
    const searching = !!entry.hits;
    card.meter.hidden = !searching;
    const ocrTag = (page.ocr === 2 ? ' ・OCR ' + (page.conf || 0) + '%' + (page.doubt ? ' 要確認' : '') : page.ocr === 1 ? ' ・OCR待ち' : page.ocr === 3 ? ' ・文字なし' : page.doubt ? ' ・文字層要確認' : '')
      + (doc.stale ? ' ・旧版' : '');
    card.el.classList.toggle('stale', !!doc.stale);
    if (searching) {
      card.bar.style.width = Math.max(8, Math.round(entry.rel * 100)) + '%';
      card.meter.title = '関連度 ' + Math.round(entry.rel * 100) + '%';
      card.pg.textContent = (doc.numPages > 1 ? 'p.' + page.no + ' / ' + doc.numPages : 'p.' + page.no) + ocrTag;
      card.el.setAttribute('aria-label', doc.name + ' ' + page.no + 'ページ、ヒット ' + entry.hits.length + ' 件');
    } else if (S.mode === 'marks') {
      card.pg.textContent = 'p.' + page.no + ' / ' + doc.numPages;
      card.el.setAttribute('aria-label', doc.name + ' ' + page.no + 'ページ（しおり）');
    } else {
      card.pg.textContent = doc.numPages + 'ページ' + ocrTag;
      card.el.setAttribute('aria-label', doc.name + ' ' + doc.numPages + 'ページ');
    }
    if (!searching) {
      card.markSig = null;
      if (S.mode === 'marks' || (PS.pageHasNotes && PS.pageHasNotes(page))) PS.geom(page).then((g) => { if (card.entry === entry) paintMarks(card.marks, null, g, 0, 0, g.w, g.h, true); });
      else card.marks.replaceChildren();
    }
  }

  // ---------------------------------------------------------------- the wall
  function compute() {
    const lib = PS.library;
    const q = S.query.trim();
    let entries;
    S.res = null;
    if (S.mode === 'marks' && PS.markedPages) entries = PS.markedPages().map((page) => ({ page }));
    else if (q) {
      const t0 = performance.now();
      // S.scope: search only the opened document (D key); the query stays as typed
      S.res = PS.search(q, S.scope && lib.byId.get(S.scope.id) === S.scope ? S.scope.pages : lib.pages);
      S.searchMs = performance.now() - t0;
      if (S.res.query.n) entries = S.res.results;
      else {
        // filters only (file: / in:): the files that pass
        const pool = S.res.filtered;
        const seen = new Set();
        entries = [];
        if (pool) for (const p of pool) if (!seen.has(p.doc)) { seen.add(p.doc); entries.push({ page: p.doc.pages[0] }); }
        S.res = null;
      }
    } else entries = lib.docs.filter((d) => d.pages && d.pages.length).map((d) => ({ page: d.pages[0] }));
    return entries;
  }

  function refresh() {
    const lib = PS.library;
    const q = S.query.trim();
    const entries = compute();
    S.entries = entries;
    S.shown = q; // the query the wall currently answers (typing is debounced)
    if (S.sel >= entries.length) S.sel = entries.length - 1;
    if (q && S.res && entries.length && S.sel < 0) S.sel = 0;
    if ((!q || !S.res) && !S.viewing) S.sel = -1;

    const want = Math.min(entries.length, Math.max(WALL_STEP, S.viewing ? S.sel + 12 : 0, Math.min(S.drawn, 400)));
    const els = [];
    for (let i = 0; i < want; i++) {
      const card = getCard(entries[i].page);
      updateCard(card, entries[i], i);
      els.push(card.el);
    }
    S.drawn = want;
    if (!els.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = S.mode === 'marks' ? 'しおり・ハイライト・メモはまだありません（開いたページで B / K / M）'
        : q ? '一致するページはありません'
          : !lib.loaded || lib.busy.total ? 'PDFを読み込んでいます…'
            : 'PDFがありません。右下の ＋ から追加するか、ここにドロップしてください';
      // never let "not found" look like "not searchable": say how much was actually searched
      const cov = q && PS.coverageNote ? PS.coverageNote() : null;
      if (cov) empty.append(document.createElement('br'), cov);
      els.push(empty);
    } else if (q && S.res && PS.coverageHint) PS.coverageHint(entries.length);
    grid.replaceChildren(...els);
    // forget cards that are no longer shown (documents that left the library, old searches)
    if (cards.size > 700) {
      for (const [key, card] of cards) {
        if (card.el.isConnected) continue;
        io.unobserve(card.el); cancel(card.job); card.lensJobs.forEach(cancel); rendered.delete(card); cards.delete(key);
        if (card.canvas) card.canvas.width = 0;
      }
    }
    for (const el of els) if (el._card) ensureCard(el._card);
    updateCount();
    if (S.viewing) {
      if (V.entryMode && S.sel >= 0) showInViewer(S.entries[S.sel], false);
      else if (V.entryMode) closeViewer();
      else repaintViewer();
    }
  }

  // more cards as the wall is scrolled
  function growWall() {
    if (S.drawn >= S.entries.length) return;
    if (stage.scrollTop + stage.clientHeight < stage.scrollHeight - 900) return;
    const end = Math.min(S.entries.length, S.drawn + WALL_STEP);
    const frag = document.createDocumentFragment();
    const added = [];
    for (let i = S.drawn; i < end; i++) {
      const card = getCard(S.entries[i].page);
      updateCard(card, S.entries[i], i);
      frag.appendChild(card.el);
      added.push(card);
    }
    S.drawn = end;
    grid.appendChild(frag);
    for (const c of added) ensureCard(c);
  }
  stage.addEventListener('scroll', growWall, { passive: true });

  const fmt = (n) => n.toLocaleString('en-US');
  function updateCount() {
    const lib = PS.library;
    const working = lib.busy.total > 0 || lib.ocr.total > 0;
    addBtn.classList.toggle('busy', working);
    let text;
    if (lib.busy.total) text = '索引中 ' + fmt(lib.busy.done) + '/' + fmt(lib.busy.total);
    else if (S.mode === 'marks') text = 'しおり ' + S.entries.length + 'ページ';
    else if (S.query.trim() && S.res) {
      if (S.scope) text = S.entries.length + 'ページ・この文書のみ';
      else text = S.entries.length ? fmt(S.res.total) + 'ページ・' + fmt(S.res.files) + 'ファイル' : '0ページ';
    } else if (S.query.trim()) text = fmt(S.entries.length) + 'ファイル';
    else {
      const bad = lib.docs.filter((d) => d.status === 'error').length;
      text = fmt(lib.docs.length - bad) + ' PDF・' + fmt(lib.pages.length) + 'ページ' + (bad ? '・読込不可 ' + bad : '');
    }
    if (!lib.busy.total && lib.ocr.total) text += '・OCR ' + lib.ocr.done + '/' + lib.ocr.total;
    countEl.textContent = text;
  }
  PS.onProgress = () => { if (!PS.library.busy.total) updateCount(); };

  function select(index, scroll) {
    if (index < 0 || index >= S.entries.length) return;
    S.sel = index;
    while (S.drawn <= index && S.drawn < S.entries.length) { const before = S.drawn; stage.scrollTop = stage.scrollHeight; growWallForce(); if (S.drawn === before) break; }
    for (const el of grid.children) if (el._card) el.classList.toggle('sel', el._card.index === index);
    const card = cards.get(S.entries[index].page.key);
    if (card && scroll) card.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function growWallForce() {
    const end = Math.min(S.entries.length, S.drawn + WALL_STEP);
    for (let i = S.drawn; i < end; i++) {
      const card = getCard(S.entries[i].page);
      updateCard(card, S.entries[i], i);
      grid.appendChild(card.el);
    }
    S.drawn = end;
  }

  function columns() {
    const kids = [...grid.children].filter((el) => el._card);
    if (!kids.length) return 1;
    const top = kids[0].offsetTop;
    let n = 0;
    while (n < kids.length && kids[n].offsetTop === top) n++;
    return Math.max(1, n);
  }

  // ---------------------------------------------------------------- viewer
  // entryMode: opened from a result (rail stays in sync); otherwise opened by link / bookmark
  const V = (PS.viewer = { doc: null, pages: [], zoom: 1, baseW: 0, entryMode: true, cur: null, page: null });

  const vio = new IntersectionObserver((list) => {
    for (const e of list) {
      const vp = e.target._vp;
      if (!vp) continue;
      vp.visible = e.isIntersecting;
      if (vp.visible) ensureVPage(vp);
      else { cancel(vp.job); vp.job = null; }
    }
  }, { root: vscroll, rootMargin: '600px 0px' });

  function fitWidth(page) {
    const cw = vscroll.clientWidth - 72, ch = vscroll.clientHeight - 62 - 46;
    return Math.max(260, Math.min(cw, (ch * page.w) / page.h));
  }

  function buildViewer(doc, page) {
    for (const vp of V.pages) { vio.unobserve(vp.el); cancel(vp.job); }
    V.doc = doc;
    V.zoom = 1;
    V.cur = null;
    V.baseW = fitWidth(page);
    V.pages = doc.pages.map((p) => {
      const el = document.createElement('div');
      el.className = 'vpage';
      el.dataset.page = p.no;
      const sheet = document.createElement('div');
      sheet.className = 'vsheet';
      sheet.style.aspectRatio = p.w + ' / ' + p.h;
      const marks = document.createElement('div');
      marks.className = 'marks';
      sheet.appendChild(marks);
      const cap = document.createElement('div');
      cap.className = 'vcap';
      cap.textContent = doc.name + ' ・ ' + p.no + ' / ' + doc.numPages + (doc.labels && doc.labels[p.no - 1] ? '（p.' + doc.labels[p.no - 1] + '）' : '') + (doc.stale ? ' ・旧版（新しい版を索引できませんでした）' : '');
      el.append(sheet, cap);
      const vp = { el, sheet, marks, cap, page: p, visible: false, img: null, imgAsked: false, canvas: null, drawnW: 0, job: null, markSig: null };
      el._vp = vp;
      return vp;
    });
    sizeViewer();
    vscroll.replaceChildren(...V.pages.map((vp) => vp.el));
    for (const vp of V.pages) vio.observe(vp.el);
  }

  function sizeViewer() {
    for (const vp of V.pages) vp.el.style.width = Math.round((V.baseW * V.zoom * vp.page.w) / V.pages[0].page.w) + 'px';
  }

  const entryOf = (page) => (S.res ? S.res.byPage.get(page) || null : null);

  function ensureVPage(vp) {
    if (!vp.visible) return;
    const w = vp.sheet.clientWidth;
    const page = vp.page, doc = page.doc;
    if (!vp.imgAsked) {
      vp.imgAsked = true;
      PS.thumbUrl(page).then((url) => {
        if (!url || vp.canvas) return;
        const img = new Image();
        img.className = 'thumb';
        img.alt = '';
        img.src = url;
        vp.img = img;
        vp.sheet.prepend(img);
      });
    }
    paintVMarks(vp);
    if (!w || vp.job || Math.abs(vp.drawnW - w) < 2 || doc.locked) return;
    const scale = Math.min((w * DPR) / page.w, 4096 / Math.max(page.w, page.h));
    vp.job = enqueue(0, page, { scale, width: page.w * scale, height: page.h * scale }, (canvas) => {
      vp.job = null;
      if (vp.canvas) { vp.canvas.remove(); vp.canvas.width = 0; }
      vp.canvas = canvas;
      vp.drawnW = w;
      vp.sheet.prepend(canvas);
      if (vp.img) { vp.img.remove(); vp.img = null; }
      ensureVPage(vp); // size may have changed while drawing
    }, (err) => { vp.job = null; noteLocked(doc, err); });
  }

  // hits + notes on an opened page (positions come from the store when the page gets near the screen)
  function paintVMarks(vp, force) {
    const entry = entryOf(vp.page);
    const cur = V.cur && V.cur.vp === vp ? V.cur.hit : -1;
    const hasNotes = PS.pageHasNotes && PS.pageHasNotes(vp.page);
    const sig = (entry ? S.shown : '') + '|' + cur + '|' + (hasNotes ? PS.notesRev : 0);
    if (!force && vp.markSig === sig) return;
    vp.markSig = sig;
    if (!entry && !hasNotes) { vp.marks.replaceChildren(); return; }
    const done = (g) => { if (vp.markSig === sig) paintMarks(vp.marks, entry, g, 0, 0, g.w, g.h, true, cur); };
    const g = PS.geomNow(vp.page);
    if (g) done(g); else PS.geom(vp.page).then(done);
  }
  function repaintViewer() { for (const vp of V.pages) { vp.markSig = null; if (vp.visible) paintVMarks(vp); } }
  PS.repaintNotes = function () {
    repaintViewer();
    for (const el of grid.children) { const c = el._card; if (c) { c.markSig = null; updateCard(c, c.entry, c.index); if (c.visible) ensureCard(c); } }
  };

  function scrollToY(vp, yFrac, xFrac, animate, center) {
    let y = vp.el.offsetTop - 62;
    const h = vp.sheet.clientHeight;
    if (yFrac != null) {
      const lineY = yFrac * h;
      if (center || lineY > vscroll.clientHeight - 120) y = vp.el.offsetTop + lineY - vscroll.clientHeight / 2;
    }
    let x = Math.max(0, (vscroll.scrollWidth - vscroll.clientWidth) / 2);
    if (xFrac != null && vscroll.scrollWidth > vscroll.clientWidth + 4) x = vp.el.offsetLeft + xFrac * vp.sheet.clientWidth - vscroll.clientWidth / 2;
    vscroll.scrollTo({ top: Math.max(0, y), left: Math.max(0, x), behavior: animate ? 'smooth' : 'auto' });
  }

  function showInViewer(entry, animate) {
    const page = entry.page, doc = page.doc;
    if (V.doc !== doc || V.pages.length !== doc.pages.length || V.pages[0].page !== doc.pages[0]) buildViewer(doc, page);
    V.page = page;
    for (const vp of V.pages) { vp.el.classList.remove('target'); if (vp.visible) paintVMarks(vp); }
    const vp = V.pages[page.no - 1];
    if (!vp) return;
    void vp.el.offsetWidth;
    vp.el.classList.add('target');
    // bring the page up; if the evidence would still be off screen, bring that line to the middle
    scrollToY(vp, null, null, animate);
    if (entry.lines && entry.lines.length) {
      PS.geom(page).then((g) => {
        if (V.page !== page || (V.cur && V.cur.vp === vp)) return;
        const ln = g.lines[entry.lines[0].index];
        if (ln) scrollToY(vp, ((ln.y0 + ln.y1) / 2) / g.h, null, animate);
      });
    }
    hintLocked(doc);
  }

  function enterViewing() {
    S.viewing = true;
    document.body.classList.add('viewing');
    viewerEl.hidden = false;
  }

  function openViewer(index) {
    if (index < 0 || index >= S.entries.length) return;
    const was = S.viewing;
    enterViewing();
    V.entryMode = true;
    V.cur = null;
    select(index, false);
    showInViewer(S.entries[index], was && V.doc === S.entries[index].page.doc);
    const card = cards.get(S.entries[index].page.key);
    if (card) card.el.scrollIntoView({ block: 'nearest' });
    syncHash();
  }

  /** Open a document at a page without a search (links from exports, bookmarks). */
  PS.openDocAt = function (doc, no, region) {
    if (!doc || !doc.pages.length) return false;
    const page = doc.pages[Math.min(doc.pages.length, Math.max(1, no || 1)) - 1];
    const idx = S.entries.findIndex((e) => e.page === page);
    enterViewing();
    V.cur = null;
    if (idx >= 0) { V.entryMode = true; select(idx, true); } else { V.entryMode = false; }
    showInViewer({ page }, false);
    if (region) { const vp = V.pages[page.no - 1]; scrollToY(vp, (region[1] + region[3]) / 2, (region[0] + region[2]) / 2, false, true); }
    syncHash();
    return true;
  };

  function closeViewer() {
    if (!S.viewing) return;
    S.viewing = false;
    V.cur = null;
    document.body.classList.remove('viewing');
    viewerEl.hidden = true;
    hideHint();
    for (const el of grid.children) if (el._card) ensureCard(el._card);
    const cur = S.sel >= 0 && S.entries[S.sel] ? cards.get(S.entries[S.sel].page.key) : null;
    if (cur) cur.el.scrollIntoView({ block: 'nearest' });
    if (!S.query.trim()) {
      S.sel = -1;
      for (const el of grid.children) el.classList.remove('sel');
    }
    syncHash();
  }

  function setZoom(z) {
    if (!S.viewing) return;
    z = Math.min(4, Math.max(0.5, z));
    if (Math.abs(z - V.zoom) < 0.001) return;
    const ratio = z / V.zoom;
    const midY = vscroll.scrollTop + vscroll.clientHeight / 2, midX = vscroll.scrollLeft + vscroll.clientWidth / 2;
    V.zoom = z;
    sizeViewer();
    vscroll.scrollTop = midY * ratio - vscroll.clientHeight / 2;
    vscroll.scrollLeft = midX * ratio - vscroll.clientWidth / 2;
    clearTimeout(setZoom.t);
    setZoom.t = setTimeout(() => V.pages.forEach(ensureVPage), 140);
  }

  function currentVPage() {
    const y = vscroll.scrollTop + vscroll.clientHeight * 0.35;
    let cur = 0;
    V.pages.forEach((vp, i) => { if (vp.el.offsetTop <= y) cur = i; });
    return cur;
  }
  PS.currentViewerPage = () => (S.viewing && V.pages.length ? V.pages[currentVPage()].page : null);

  function scrollViewerPage(dir) {
    const y = vscroll.scrollTop + 70;
    let cur = 0;
    V.pages.forEach((vp, i) => { if (vp.el.offsetTop <= y) cur = i; });
    const next = V.pages[Math.min(V.pages.length - 1, Math.max(0, cur + dir))];
    if (next) vscroll.scrollTo({ top: Math.max(0, next.el.offsetTop - 62), behavior: 'smooth' });
  }

  // ---------------------------------------------------------------- hit by hit (n / N)
  // Reading order inside the open document; past its last hit, on to the next document of the results.
  function docHits(doc) {
    const list = [];
    if (!S.res) return list;
    for (const p of doc.pages) {
      const e = S.res.byPage.get(p);
      if (e) e.hits.forEach((h, i) => list.push({ page: p, entry: e, hit: i }));
    }
    return list;
  }
  function docOrder() {
    const seen = new Set(), out = [];
    for (const e of S.entries) if (!seen.has(e.page.doc)) { seen.add(e.page.doc); out.push(e.page.doc); }
    return out;
  }

  function stepHit(dir) {
    if (!S.res || !S.entries.length) return;
    if (!S.viewing) { openViewer(Math.max(0, S.sel)); }
    let doc = V.doc;
    let list = docHits(doc);
    let i;
    if (V.cur && V.cur.doc === doc) i = list.findIndex((x) => x.page === V.cur.page && x.hit === V.cur.hit) + dir;
    else {
      // first step: the first hit on the page in view (or the last one before it when going back)
      const from = V.page || V.pages[currentVPage()].page;
      i = dir > 0 ? list.findIndex((x) => x.page.no >= from.no) : (() => { let k = -1; list.forEach((x, n) => { if (x.page.no <= from.no) k = n; }); return k; })();
      if (i < 0) i = dir > 0 ? list.length : -1;
    }
    const docs = docOrder();
    let di = docs.indexOf(doc);
    let edge = false;
    if (i >= list.length || i < 0) {
      const nd = docs[di + dir];
      if (!nd && S.scope && list.length) i = dir > 0 ? 0 : list.length - 1; // inside one document: go round
      else if (!nd) { edge = true; i = Math.min(list.length - 1, Math.max(0, i)); }
      else { doc = nd; di += dir; list = docHits(doc); i = dir > 0 ? 0 : list.length - 1; }
    }
    const target = list[i];
    if (!target) return;
    goHit(target, i, list.length, di, docs.length, edge);
  }

  function goHit(target, i, n, di, nd, edge) {
    const { page, entry, hit } = target;
    const doc = page.doc;
    enterViewing();
    if (V.doc !== doc || V.pages.length !== doc.pages.length) buildViewer(doc, page);
    const vp = V.pages[page.no - 1];
    const prev = V.cur;
    V.cur = { doc, page, hit, vp };
    V.page = page;
    V.entryMode = true;
    for (const p of V.pages) p.el.classList.toggle('target', p === vp);
    if (prev && prev.vp !== vp) paintVMarks(prev.vp, true);
    // rail: select the card of this page when it is among the results
    const idx = S.entries.findIndex((e) => e.page === page);
    if (idx >= 0) {
      select(idx, false);
      const card = cards.get(page.key);
      if (card) card.el.scrollIntoView({ block: 'nearest' });
    }
    PS.geom(page).then((g) => {
      if (!V.cur || V.cur.page !== page || V.cur.hit !== hit) return;
      paintVMarks(vp, true);
      const h = entry.hits[hit];
      const rects = PS.hitRects(g, h.ds, h.len);
      if (!rects.length) return;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const r of rects.slice(0, 1)) { x0 = Math.min(x0, r[0]); y0 = Math.min(y0, r[1]); x1 = Math.max(x1, r[2]); y1 = Math.max(y1, r[3]); }
      scrollToY(vp, ((y0 + y1) / 2) / g.h, ((x0 + x1) / 2) / g.w, false, true);
      flashPos(vp, (i + 1) + ' / ' + n + (nd > 1 ? '  ・ 文書 ' + (di + 1) + ' / ' + nd : '') + (edge ? '  ・ 端' : ''), x1 / g.w, y0 / g.h);
      S.lastPos = { i: i + 1, n, doc: di + 1, docs: nd, file: doc.name, page: page.no, edge: !!edge };
    });
    hintLocked(doc);
    syncHash();
  }

  // the tiny "3 / 17" next to the hit; goes away by itself
  let posEl = null, posT = 0;
  function flashPos(vp, text, xFrac, yFrac) {
    if (posEl) posEl.remove();
    clearTimeout(posT);
    posEl = document.createElement('span');
    posEl.className = 'pos';
    posEl.textContent = text;
    posEl.style.left = Math.min(92, Math.max(0, xFrac * 100)) + '%';
    posEl.style.top = yFrac * 100 + '%';
    vp.sheet.appendChild(posEl);
    posT = setTimeout(() => { if (posEl) { posEl.remove(); posEl = null; } }, 1500);
  }

  // ---------------------------------------------------------------- transient overlays: toast + "reconnect" hint
  const toastEl = $('toast');
  let toastT = 0;
  /** A short message at the bottom that leaves by itself. action: { label, run } makes it clickable. */
  PS.toast = function (text, action, ms) {
    clearTimeout(toastT);
    toastEl.replaceChildren();
    const span = document.createElement('span');
    span.textContent = text;
    toastEl.appendChild(span);
    if (action) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = action.label;
      b.addEventListener('click', () => { hideToast(); action.run(); });
      toastEl.appendChild(b);
    }
    toastEl.hidden = false;
    toastT = setTimeout(hideToast, ms || (action ? 12000 : 4500));
  };
  function hideToast() { clearTimeout(toastT); toastEl.hidden = true; }

  // PDF out of reach (folder permission after a restart): say so once, offer the one click that fixes it
  let hinted = null;
  function hintLocked(doc) {
    if (!doc.locked || hinted === doc.locked) return;
    const folder = doc.locked === true ? null : doc.locked;
    hinted = doc.locked;
    if (!folder) { PS.toast('「' + doc.name + '」の元ファイルが見つかりません（索引とサムネイルで表示中）'); return; }
    if (PS.pendingFolders().includes(folder)) { resumeToast(folder); return; } // the more important thing to say about this folder
    PS.toast('「' + folder.name + '」は索引から表示中です。鮮明な表示にはフォルダへのアクセスが必要です', { label: folder.handle ? 'アクセスを許可' : 'フォルダを選び直す', run: () => reconnect(folder) }, 15000);
  }
  // an indexing run that was cut short by closing the tab: offer to continue (permission needs a click)
  function resumeToast(f) {
    const n = PS.library.docs.filter((d) => d.paths.some((p) => p.folder === f.id)).length;
    PS.toast('「' + f.name + '」の索引作成が途中です（' + fmt(n) + ' PDF まで完了）', { label: '続きから再開', run: () => rescan(f) }, 20000);
  }
  function hideHint() { /* the toast times out by itself */ }

  async function reconnect(folder) {
    if (!folder.handle) { pickFolder(); return; }
    try {
      const stats = await PS.rescanFolder(folder);
      if (!stats) { PS.toast('アクセスが許可されませんでした。索引・しおり・メモはそのまま残っています', { label: 'もう一度', run: () => reconnect(folder) }, 12000); return; }
      unlockAll();
      scanToast(folder, stats);
    } catch (err) { PS.toast('再スキャンできませんでした: ' + (err && err.message || err)); }
  }
  function unlockAll() {
    hinted = null;
    for (const d of PS.library.docs) d.locked = null;
    if (PS.retryOcr) PS.retryOcr();
    for (const el of grid.children) if (el._card) ensureCard(el._card);
    V.pages.forEach(ensureVPage);
  }
  function scanToast(folder, s) {
    const parts = [];
    if (s.indexed) parts.push('新規・変更 ' + fmt(s.indexed));
    if (s.moved) parts.push('移動・改名 ' + fmt(s.moved));
    if (s.removed) parts.push('削除 ' + fmt(s.removed));
    if (s.failed) parts.push('読込不可 ' + fmt(s.failed));
    PS.toast('「' + folder.name + '」 ' + fmt(s.total) + ' PDF：' + (parts.length ? parts.join('・') : '変更なし') + '（' + (s.ms / 1000).toFixed(1) + ' 秒）');
  }

  // ---------------------------------------------------------------- URL (#q=…&open=n, #doc=…&p=n) so a search / a page can be bookmarked
  function syncHash() {
    const parts = [];
    if (S.query) parts.push('q=' + encodeURIComponent(S.query));
    if (S.viewing && V.entryMode && S.sel >= 0 && S.entries[S.sel] && S.entries[S.sel].hits) parts.push('open=' + (S.sel + 1));
    else if (S.viewing && V.doc && V.page) parts.push('doc=' + V.doc.id, 'p=' + V.page.no);
    try { history.replaceState(null, '', parts.length ? '#' + parts.join('&') : location.pathname + location.search); } catch (_) {}
    if (PS.onNav) PS.onNav();
  }
  function readHash() {
    const out = {};
    for (const part of location.hash.replace(/^#/, '').split('&')) {
      const k = part.split('=')[0];
      if (!k) continue;
      try { out[k] = decodeURIComponent(part.slice(k.length + 1).replace(/\+/g, ' ')); } catch (_) {}
    }
    return out;
  }

  // ---------------------------------------------------------------- events
  let typing = 0;
  function setQuery(q, now) {
    S.query = q;
    if (S.mode === 'marks' && q.trim()) S.mode = 'library';
    clearTimeout(typing);
    const run = () => { S.sel = -1; S.drawn = 0; refresh(); stage.scrollTop = 0; syncHash(); };
    if (now) run(); else typing = setTimeout(run, 70);
  }
  PS.setQuery = (q) => { input.value = q; setQuery(q, true); };
  input.addEventListener('input', () => setQuery(input.value, false));

  window.addEventListener('pointermove', () => document.body.classList.remove('keys'), { passive: true });
  grid.addEventListener('click', (e) => {
    const el = e.target.closest('.card');
    if (el && el._card) openViewer(el._card.index);
  });
  vscroll.addEventListener('click', (e) => { if (!e.target.closest('.vpage') && !(PS.dragging && PS.dragging())) closeViewer(); });
  vscroll.addEventListener('dblclick', (e) => { if (e.target.closest('.vsheet')) setZoom(V.zoom > 1.01 ? 1 : 1.8); });
  vscroll.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(V.zoom * Math.exp(-e.deltaY * 0.0022));
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.isComposing) return; // Japanese IME in progress
    const ae = document.activeElement;
    const inInput = ae === input;
    const inOther = ae && ae !== input && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA');
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key;
    if (inOther) return; // note editor etc. handle their own keys
    if (document.querySelector('.overlay') && e.key !== 'Escape') return; // an overlay is open: it has the keys
    if (mod && k.toLowerCase() === 'f') { e.preventDefault(); input.focus(); input.select(); return; }
    if (k === 'Escape') {
      if (PS.closeOverlays && PS.closeOverlays()) return;
      if (!menu.hidden) closeMenu();
      else if (S.viewing) closeViewer();
      else if (S.mode === 'marks') { S.mode = 'library'; S.drawn = 0; refresh(); }
      else if (S.query) { input.value = ''; setQuery('', true); }
      else input.blur();
      return;
    }
    if (PS.modKey && PS.modKey(e)) return; // copy with source, back / forward
    if (mod || e.altKey) return;
    if (k === 'Enter') {
      if (inInput) { clearTimeout(typing); if (S.query !== input.value || S.shown !== input.value.trim()) setQuery(input.value, true); }
      if (ae && ae.closest && ae.closest('#menu, #add, #fs, #toast, .overlay')) return;
      if (S.entries.length && !S.viewing) { e.preventDefault(); openViewer(Math.max(0, S.sel)); if (inInput) input.blur(); } // keys now go to the page (n, B, K, …)
      return;
    }
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      if (!S.entries.length) return;
      e.preventDefault();
      const step = (k === 'ArrowDown' ? 1 : -1) * (S.viewing ? 1 : columns());
      const next = S.sel < 0 ? 0 : S.sel + step;
      if (next < 0 || next >= S.entries.length) return;
      document.body.classList.add('keys');
      if (S.viewing) openViewer(next); else select(next, true);
      return;
    }
    if (inInput) return;
    if (PS.noteKey && PS.noteKey(e)) return;
    if (k === '/') { e.preventDefault(); input.focus(); input.select(); }
    else if (k === 'n' || k === 'N') { e.preventDefault(); stepHit(e.shiftKey || k === 'N' ? -1 : 1); }
    else if (k === '?') { e.preventDefault(); if (PS.showHelp) PS.showHelp(); }
    else if (k === 'ArrowRight' || k === 'ArrowLeft') {
      e.preventDefault();
      const d = k === 'ArrowRight' ? 1 : -1;
      if (S.viewing) scrollViewerPage(d);
      else if (S.entries.length) { document.body.classList.add('keys'); select(Math.min(S.entries.length - 1, Math.max(0, S.sel + d)), true); }
    } else if (k === 'PageDown' || k === 'PageUp' || k === ' ') {
      if (!S.viewing) return;
      e.preventDefault();
      vscroll.scrollBy({ top: (k === 'PageUp' ? -1 : 1) * vscroll.clientHeight * 0.85, behavior: 'smooth' });
    } else if (k === '+' || k === '=' || k === ';') setZoom(V.zoom * 1.2);
    else if (k === '-') setZoom(V.zoom / 1.2);
    else if (k === '0') setZoom(1);
    else if (k.toLowerCase() === 'f') toggleFullscreen();
  });

  function toggleFullscreen() {
    const d = document, el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else { const p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el); if (p && p.catch) p.catch(() => {}); }
  }
  fsBtn.addEventListener('click', toggleFullscreen);

  // ----- the ＋ menu (built each time it opens: it reflects the folders that exist) -----
  function menuItem(label, run, hint) {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'menuitem');
    b.textContent = label;
    if (hint) { const s = document.createElement('small'); s.textContent = hint; b.appendChild(s); }
    b.addEventListener('click', () => { closeMenu(); run(); });
    return b;
  }
  function menuNote(text) { const p = document.createElement('p'); p.textContent = text; return p; }
  const menuSep = () => document.createElement('hr');

  function openMenu() {
    const lib = PS.library;
    const items = [
      menuItem('PDFを追加…', () => $('pickFiles').click()),
      menuItem('フォルダを追加…', pickFolder),
    ];
    for (const f of lib.folders) {
      const n = lib.docs.filter((d) => d.paths.some((p) => p.folder === f.id)).length;
      items.push(menuItem('再スキャン: ' + f.name, () => rescan(f), fmt(n) + ' PDF' + (f.state === 'scanning' ? '・途中' : '')));
    }
    if (PS.menuExtras) { items.push(menuSep()); for (const it of PS.menuExtras()) items.push(it.sep ? menuSep() : menuItem(it.label, it.run, it.hint)); }
    if (lib.folders.length || lib.docs.some((d) => !d.bundled)) { items.push(menuSep()); items.push(menuItem('追加したPDF・フォルダを外す', () => PS.removeUserDocs().then(() => PS.toast('追加したPDFを外しました')))); }
    items.push(menuNote('ウィンドウへのドロップでも追加できます'));
    menu.replaceChildren(...items);
    menu.hidden = false;
    addBtn.setAttribute('aria-expanded', 'true');
  }
  PS.menuItem = menuItem;
  function closeMenu() { menu.hidden = true; addBtn.setAttribute('aria-expanded', 'false'); }
  addBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
  document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !e.target.closest('#menu, #add')) closeMenu(); });

  // ----- adding PDFs and folders (pickers, drop) -----
  async function pickFolder() {
    // Chrome / Edge: a directory handle that can be re-scanned later. Elsewhere: a one-off file list.
    if (window.showDirectoryPicker) {
      try {
        const handle = await window.showDirectoryPicker({ mode: 'read' });
        addHandle(handle);
        return;
      } catch (err) { if (err && err.name === 'AbortError') return; }
    }
    $('pickDir').click();
  }
  async function addHandle(handle) {
    try {
      const folder = () => PS.library.folders.find((f) => f.handle === handle);
      const stats = await PS.addFolderHandle(handle);
      unlockAll();
      if (folder()) scanToast(folder(), stats);
    } catch (err) { PS.toast('フォルダを読めませんでした: ' + (err && err.message || err)); }
  }
  async function addFileList(files) {
    const list = [...files];
    const inDir = list.filter((f) => (f.relPath || f.webkitRelativePath || '').includes('/'));
    const loose = list.filter((f) => !(f.relPath || f.webkitRelativePath || '').includes('/'));
    const tops = new Map();
    for (const f of inDir) { const top = (f.relPath || f.webkitRelativePath).split('/')[0]; if (!tops.has(top)) tops.set(top, []); tops.get(top).push(f); }
    for (const [top, fs] of tops) {
      const stats = await PS.addFolderFiles(fs, top);
      unlockAll();
      const folder = PS.library.folders.find((f) => f.name === top);
      if (folder) scanToast(folder, stats);
    }
    if (loose.length) {
      const other = loose.filter((f) => /\.json$/i.test(f.name));
      for (const f of other) if (PS.importJson) await PS.importJson(f);
      const n = await PS.addFiles(loose);
      if (n) PS.toast(n + ' 件のPDFを追加しました');
    }
  }
  async function rescan(folder) {
    if (!folder.handle) { PS.toast('「' + folder.name + '」を選び直すと、新しい・変更されたPDFだけを索引します', { label: 'フォルダを選ぶ', run: pickFolder }); return; }
    reconnect(folder);
  }
  for (const id of ['pickFiles', 'pickDir']) {
    $(id).addEventListener('change', (e) => { addFileList(e.target.files); e.target.value = ''; });
  }

  function readEntry(entry, out) {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((f) => { f.relPath = entry.fullPath.replace(/^\//, ''); out.push(f); resolve(); }, () => resolve());
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const all = [];
        const more = () => reader.readEntries((batch) => {
          if (!batch.length) return Promise.all(all.map((c) => readEntry(c, out))).then(resolve);
          all.push(...batch);
          more();
        }, () => resolve());
        more();
      } else resolve();
    });
  }
  let dragDepth = 0;
  const hasFiles = (e) => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
  window.addEventListener('dragenter', (e) => { if (hasFiles(e)) { dragDepth++; dropEl.hidden = false; e.preventDefault(); } });
  window.addEventListener('dragover', (e) => { if (hasFiles(e)) e.preventDefault(); });
  window.addEventListener('dragleave', (e) => { if (hasFiles(e) && --dragDepth <= 0) { dragDepth = 0; dropEl.hidden = true; } });
  window.addEventListener('drop', async (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth = 0;
    dropEl.hidden = true;
    const items = [...e.dataTransfer.items].filter((it) => it.kind === 'file');
    // everything must be taken from the event synchronously
    const entries = items.map((it) => (it.webkitGetAsEntry ? it.webkitGetAsEntry() : null));
    const handles = items.map((it) => (it.getAsFileSystemHandle ? it.getAsFileSystemHandle().catch(() => null) : Promise.resolve(null)));
    const plain = [...e.dataTransfer.files];
    const direct = items.map((it) => (it.getAsFile ? it.getAsFile() : null));
    const files = [];
    for (let i = 0; i < items.length; i++) {
      const entry = entries[i];
      if (entry && entry.isDirectory) {
        const handle = await handles[i];
        if (handle && handle.kind === 'directory') { addHandle(handle); continue; } // re-scannable
        await readEntry(entry, files);
      } else if (direct[i]) files.push(direct[i]); // a loose file: the File itself (entry.file() is refused on file:// pages)
      else if (entry && entry.isFile) await readEntry(entry, files);
      else if (plain[i]) files.push(plain[i]);
    }
    if (!items.length) files.push(...plain);
    if (files.length) addFileList(files);
  });

  // ----- layout changes -----
  let resizeT = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      for (const el of grid.children) if (el._card) ensureCard(el._card);
      growWall();
      if (S.viewing && V.pages.length) {
        const cur = V.page && V.page.doc === V.doc ? V.page : V.pages[0].page;
        V.baseW = fitWidth(cur);
        sizeViewer();
        V.pages.forEach(ensureVPage);
      }
    }, 160);
  }).observe(document.body);

  // what the other modules (notes.js, extras.js) drive
  PS.act = { openViewer, closeViewer, stepHit, setZoom, select, refresh, scrollToY, pickFolder, rescan, reconnect, addHandle, unlockAll, updateCount, enterViewing, buildViewer, docHits, docOrder };
  PS.fmt = fmt;

  // ---------------------------------------------------------------- start
  let pending = false;
  PS.library.onChange = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; refresh(); maybeOpenFromHash(); });
  };
  PS.refresh = () => { S.drawn = Math.min(S.drawn, WALL_STEP); refresh(); };
  PS.showMarks = () => { S.mode = 'marks'; input.value = ''; S.query = ''; S.sel = -1; S.drawn = 0; if (S.viewing) closeViewer(); refresh(); stage.scrollTop = 0; };

  const boot = readHash();
  let bootOpen = parseInt(boot.open, 10) || 0;
  let bootDoc = boot.doc ? { id: boot.doc, p: parseInt(boot.p, 10) || 1 } : null;
  if (boot.q) { input.value = boot.q; S.query = boot.q; }
  function maybeOpenFromHash() {
    if (bootDoc && PS.library.loaded) {
      const doc = PS.library.byId.get(bootDoc.id);
      if (doc && doc.pages.length) { const p = bootDoc.p; bootDoc = null; bootOpen = 0; PS.openDocAt(doc, p); return; }
      if (!PS.library.busy.total && PS.ready) { bootDoc = null; PS.toast('リンク先の文書はこのライブラリにありません'); }
    }
    if (!bootOpen || PS.library.busy.total || !PS.library.loaded) return;
    const n = bootOpen;
    bootOpen = 0;
    if (S.entries[n - 1]) openViewer(n - 1);
  }
  window.addEventListener('hashchange', () => {
    const h = readHash();
    if (h.doc) { const doc = PS.library.byId.get(h.doc); if (doc) PS.openDocAt(doc, parseInt(h.p, 10) || 1); }
  });

  updateCount();
  PS.loadLibrary().then(() => {
    PS.ready = true;
    refresh();
    maybeOpenFromHash();
    const pend = PS.pendingFolders();
    if (pend.length) resumeToast(pend[0]);
  }, (err) => {
    countEl.textContent = '起動に失敗しました';
    console.error(err);
  });
  if (!boot.open && !boot.doc) input.focus({ preventScroll: true });

  // for the bundled offline checks (tools/, acceptance.html): what the screen currently shows
  PS.snapshot = async function (limit) {
    const lib = PS.library;
    const shown = S.shown && S.res ? S.entries.slice(0, limit || 40) : [];
    const results = [];
    for (const e of shown) {
      const g = await PS.geom(e.page);
      results.push({
        file: e.page.doc.name,
        path: e.page.doc.path,
        page: e.page.no,
        relevance: Math.round(e.rel * 100),
        hits: e.hits.length,
        kinds: { exact: e.hits.filter((h) => !h.v && !h.syn).length, variant: e.hits.filter((h) => h.v && !h.syn).length, dict: e.hits.filter((h) => h.syn).length },
        ocr: e.page.ocr, conf: e.page.conf,
        evidence: e.lines.map((l) => PS.lineText(g, l.index)),
      });
    }
    return {
      query: S.shown || '',
      ready: !!PS.ready && !lib.busy.total,
      loaded: lib.loaded,
      worker: PS.workerMode,
      indexMode: PS.indexMode,
      busy: { done: lib.busy.done, total: lib.busy.total },
      ocrQueue: { done: lib.ocr.done, total: lib.ocr.total },
      total: S.res ? S.res.total : S.entries.length,
      searchMs: S.searchMs,
      docCount: lib.docs.length, pageCount: lib.pages.length,
      docs: lib.docs.length <= 60 ? lib.docs.map((d) => ({ name: d.name, pages: d.numPages, status: d.status, error: d.error || null })) : [],
      results,
    };
  };
})();
