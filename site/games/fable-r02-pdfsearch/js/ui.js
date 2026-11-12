/*
 * ui.js — the screen.
 *
 *   stage  : a wall of page previews. With a query it holds the hit pages, best first,
 *            each with its hits painted on the page and a magnified strip ("lens")
 *            lying on the lines that answer the query.
 *   viewer : opens beside the wall (the wall becomes a narrow rail) and shows the
 *            whole document at reading size, scrolled to the hit.
 *   fixed controls: search pill, add button, fullscreen button. Nothing else.
 */
(function () {
  'use strict';
  const PS = window.PS;
  const $ = (id) => document.getElementById(id);
  const stage = $('stage'), grid = $('grid'), viewerEl = $('viewer'), vscroll = $('vscroll');
  const input = $('q'), countEl = $('count'), addBtn = $('add'), fsBtn = $('fs'), menu = $('menu'), dropEl = $('drop');

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const LENS_BLEED = 0.035; // lens sticks out 3.5% of the page width on each side (see .lens in app.css)

  const S = {
    query: '',
    res: null,      // PS.search() output for the current query
    entries: [],    // what the wall shows: [{ page, hits, lines, rel }] (library mode: first pages)
    shown: '',
    sel: -1,
    viewing: false,
  };

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
  function enqueue(prio, page, opts, done) {
    const job = { prio, page, opts, done, dead: false, handle: null };
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
        .then((canvas) => { if (!job.dead) job.done(canvas); }, () => {})
        .finally(() => { active--; pump(); });
    }
  }

  // ---------------------------------------------------------------- marks (hits painted on a page)
  function entryRects(entry) {
    if (!entry.rects) {
      entry.rects = [];
      for (const h of entry.hits) for (const r of PS.hitRects(entry.page, h.ds, h.len)) entry.rects.push(r);
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
  function paintMarks(box, entry, rx, ry, rw, rh, withBands) {
    const frag = document.createDocumentFragment();
    if (entry) {
      if (withBands) {
        for (const l of entry.lines) {
          const ln = entry.page.lines[l.index];
          frag.appendChild(mark('band', ln.x0 - 3, ln.y0 - 2, ln.x1 + 3, ln.y1 + 2, rx, ry, rw, rh));
        }
      }
      for (const r of entryRects(entry)) {
        if (r[2] < rx || r[0] > rx + rw || r[3] < ry || r[1] > ry + rh) continue;
        frag.appendChild(mark('hit', r[0], r[1], r[2], r[3], rx, ry, rw, rh));
      }
    }
    box.replaceChildren(frag);
  }

  // ---------------------------------------------------------------- lenses
  /** Where to put magnified strips on a card whose page is drawn `sheetW` CSS px wide. */
  function lensSpecs(entry, sheetW) {
    const page = entry.page;
    const st = sheetW / page.w;
    const LW = page.w * (1 + 2 * LENS_BLEED);
    const groups = [];
    for (const l of entry.lines) {
      const ln = page.lines[l.index];
      const g = groups[groups.length - 1];
      if (g && g.n < 3 && ln.y0 - g.y1 < 1.2 * Math.max(ln.fs, g.fs) && ln.y0 >= g.y0) {
        g.x0 = Math.min(g.x0, ln.x0); g.x1 = Math.max(g.x1, ln.x1); g.y1 = Math.max(g.y1, ln.y1);
        g.fs = Math.max(g.fs, ln.fs); g.n++; g.last = l.index;
      } else groups.push({ x0: ln.x0, y0: ln.y0, x1: ln.x1, y1: ln.y1, fs: ln.fs, n: 1, first: l.index, last: l.index });
    }
    const specs = [];
    let floor = -Infinity;
    for (const g of groups) {
      const fsPx = g.fs * st;            // text size on the thumbnail
      let m = Math.min(14.5 / fsPx, 3.2); // aim for ~14px text in the lens
      if (m < 1.25) continue;            // already readable on the page itself
      const pad = g.fs * 0.9;
      const gw = g.x1 - g.x0 + 2 * pad;
      if (LW / gw < m) m = Math.max(LW / gw, Math.max(1.25, 11 / fsPx));
      const bleed = page.w * LENS_BLEED;
      let rx, rw, left;
      if (gw <= LW / m + 0.01) {
        // the strip is only as wide as the line, and the enlarged line starts where the real one does
        rw = gw;
        rx = g.x0 - pad;
        left = Math.min(Math.max(g.x0 - pad * m, -bleed), page.w + bleed - rw * m);
      } else {
        // too long even at the smallest zoom: full width, centred on the hits
        rw = LW / m;
        let sum = 0, cnt = 0;
        for (const r of entryRects(entry)) if (r[3] > g.y0 && r[1] < g.y1) { sum += (r[0] + r[2]) / 2; cnt++; }
        const cx = cnt ? sum / cnt : (g.x0 + g.x1) / 2;
        rx = Math.min(Math.max(cx - rw / 2, g.x0 - pad), g.x1 + pad - rw);
        left = -bleed;
      }
      // breathing room above/below; in tight text cut halfway to the neighbouring line, not through it
      const above = page.lines[g.first - 1], below = page.lines[g.last + 1];
      const room = (gap) => Math.min(0.95, Math.max(0.12, gap / g.fs / 2)) * g.fs;
      const padTop = room(above && above.y1 <= g.y0 + g.fs * 0.3 ? g.y0 - above.y1 : Infinity);
      const padBottom = room(below && below.y0 >= g.y1 - g.fs * 0.3 ? below.y0 - g.y1 : Infinity);
      const ry = g.y0 - padTop, rh = g.y1 - g.y0 + padTop + padBottom;
      const hT = rh * m; // strip height in page px at thumbnail scale
      let top = (g.y0 + g.y1) / 2 - hT / 2;
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
  const rendered = new Set(); // cards holding a thumbnail canvas (LRU by insertion)
  const MAX_THUMBS = 60;

  function getCard(page) {
    let card = cards.get(page.key);
    if (card) return card;
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
    card = { el, sheet, marks, lensBox, meter, bar, name, pg, page, entry: null, visible: false, canvas: null, thumbW: 0, job: null, lensJobs: [], lensSig: '' };
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
    // thumbnail
    if (!card.job && card.thumbW < sheetW * 0.8) {
      const cssW = Math.max(sheetW, 200);
      const scale = (cssW * DPR) / card.page.w;
      card.job = enqueue(1, card.page, { scale, width: card.page.w * scale, height: card.page.h * scale }, (canvas) => {
        card.job = null;
        if (card.canvas) card.canvas.remove();
        card.canvas = canvas;
        card.thumbW = cssW;
        card.sheet.prepend(canvas);
        rendered.delete(card); rendered.add(card);
        trimThumbs();
      });
    }
    if (rendered.has(card)) { rendered.delete(card); rendered.add(card); }
    layoutLenses(card, sheetW);
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

  function layoutLenses(card, sheetW) {
    const entry = card.entry;
    const specs = entry && entry.lines && !S.viewing ? lensSpecs(entry, sheetW) : [];
    const sig = specs.length ? S.query + '|' + Math.round(sheetW) + '|' + specs.map((s) => [s.rx, s.ry, s.rw, s.m, s.top].map((v) => v.toFixed(1)).join(',')).join(';') : '';
    if (sig === card.lensSig) return;
    if (S.viewing && card.lensSig) return; // rail mode hides lenses; keep what is there
    card.lensSig = sig;
    card.lensJobs.forEach(cancel);
    card.lensJobs = [];
    const page = card.page;
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
      paintMarks(marks, entry, sp.rx, sp.ry, sp.rw, sp.rh, false);
      lens.appendChild(marks);
      const scale = st * sp.m * DPR;
      card.lensJobs.push(enqueue(2, page, { scale, x: sp.rx, y: sp.ry, width: sp.rw * scale, height: sp.rh * scale }, (canvas) => lens.prepend(canvas)));
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
    card.name.textContent = doc.name;
    card.name.title = doc.name;
    const searching = !!entry.hits;
    card.meter.hidden = !searching;
    if (searching) {
      card.bar.style.width = Math.max(8, Math.round(entry.rel * 100)) + '%';
      card.meter.title = '関連度 ' + Math.round(entry.rel * 100) + '%';
      card.pg.textContent = doc.numPages > 1 ? 'p.' + page.no + ' / ' + doc.numPages : 'p.' + page.no;
      card.el.setAttribute('aria-label', doc.name + ' ' + page.no + 'ページ、ヒット ' + entry.hits.length + ' 件');
    } else {
      card.pg.textContent = doc.numPages + 'ページ';
      card.el.setAttribute('aria-label', doc.name + ' ' + doc.numPages + 'ページ');
    }
    paintMarks(card.marks, searching ? entry : null, 0, 0, page.w, page.h, true);
  }

  // ---------------------------------------------------------------- the wall
  function refresh() {
    const lib = PS.library;
    const q = S.query.trim();
    let entries;
    if (q) {
      S.res = PS.search(q, lib.pages);
      entries = S.res.results;
    } else {
      S.res = null;
      entries = lib.docs.filter((d) => d.pages && d.pages.length).map((d) => ({ page: d.pages[0] }));
    }
    S.entries = entries;
    S.shown = q; // the query the wall currently answers (typing is debounced)
    if (S.sel >= entries.length) S.sel = entries.length - 1;
    if (q && entries.length && S.sel < 0) S.sel = 0;
    if (!q && !S.viewing) S.sel = -1;

    const els = entries.map((entry, i) => {
      const card = getCard(entry.page);
      updateCard(card, entry, i);
      return card.el;
    });
    if (!els.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = q ? '一致するページはありません'
        : lib.busy.total ? 'PDFを読み込んでいます…'
          : 'PDFがありません。右下の ＋ から追加するか、ここにドロップしてください';
      els.push(empty);
    }
    grid.replaceChildren(...els);
    // forget cards of documents that left the library
    for (const [key, card] of cards) {
      if (!lib.docs.includes(card.page.doc)) { io.unobserve(card.el); cancel(card.job); card.lensJobs.forEach(cancel); rendered.delete(card); cards.delete(key); }
    }
    for (const el of els) if (el._card) ensureCard(el._card);
    updateCount();
    if (S.viewing) {
      if (S.sel >= 0) showInViewer(S.entries[S.sel], false);
      else closeViewer();
    }
  }

  function updateCount() {
    const lib = PS.library;
    addBtn.classList.toggle('busy', lib.busy.total > 0);
    let text;
    if (lib.busy.total) text = '読み込み中 ' + lib.busy.done + '/' + lib.busy.total;
    else if (S.query.trim()) {
      const files = new Set(S.entries.map((e) => e.page.doc)).size;
      text = S.entries.length ? S.entries.length + 'ページ・' + files + 'ファイル' : '0ページ';
    } else {
      const bad = lib.docs.filter((d) => d.status === 'error').length;
      text = lib.docs.length - bad + ' PDF・' + lib.pages.length + 'ページ' + (bad ? '・読込不可 ' + bad : '');
    }
    countEl.textContent = text;
  }

  function select(index, scroll) {
    if (index < 0 || index >= S.entries.length) return;
    S.sel = index;
    for (const el of grid.children) if (el._card) el.classList.toggle('sel', el._card.index === index);
    const card = cards.get(S.entries[index].page.key);
    if (card && scroll) card.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
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
  const V = { doc: null, pages: [], zoom: 1, baseW: 0 };

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
    V.baseW = fitWidth(page);
    V.pages = doc.pages.map((p) => {
      const el = document.createElement('div');
      el.className = 'vpage';
      const sheet = document.createElement('div');
      sheet.className = 'vsheet';
      sheet.style.aspectRatio = p.w + ' / ' + p.h;
      const marks = document.createElement('div');
      marks.className = 'marks';
      sheet.appendChild(marks);
      const cap = document.createElement('div');
      cap.className = 'vcap';
      cap.textContent = doc.name + ' ・ ' + p.no + ' / ' + doc.numPages;
      el.append(sheet, cap);
      const vp = { el, sheet, marks, page: p, visible: false, canvas: null, drawnW: 0, job: null };
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

  function ensureVPage(vp) {
    if (!vp.visible) return;
    const w = vp.sheet.clientWidth;
    if (!w || vp.job || Math.abs(vp.drawnW - w) < 2) return;
    const scale = Math.min((w * DPR) / vp.page.w, 4096 / Math.max(vp.page.w, vp.page.h));
    vp.job = enqueue(0, vp.page, { scale, width: vp.page.w * scale, height: vp.page.h * scale }, (canvas) => {
      vp.job = null;
      if (vp.canvas) { vp.canvas.remove(); vp.canvas.width = 0; }
      vp.canvas = canvas;
      vp.drawnW = w;
      vp.sheet.prepend(canvas);
      ensureVPage(vp); // size may have changed while drawing
    });
  }

  function showInViewer(entry, animate) {
    const page = entry.page, doc = page.doc;
    if (V.doc !== doc || V.pages.length !== doc.pages.length) buildViewer(doc, page);
    for (const vp of V.pages) {
      const hit = S.res ? S.res.byPage.get(vp.page) : null;
      paintMarks(vp.marks, hit || null, 0, 0, vp.page.w, vp.page.h, true);
      vp.el.classList.remove('target');
    }
    const vp = V.pages[page.no - 1];
    if (!vp) return;
    void vp.el.offsetWidth;
    vp.el.classList.add('target');
    // bring the page up; if the evidence would still be off screen, bring that line to the middle
    let y = vp.el.offsetTop - 62;
    if (entry.lines && entry.lines.length) {
      const ln = page.lines[entry.lines[0].index];
      const lineY = (((ln.y0 + ln.y1) / 2) / page.h) * vp.sheet.clientHeight;
      if (lineY > vscroll.clientHeight - 120) y = vp.el.offsetTop + lineY - vscroll.clientHeight / 2;
    }
    vscroll.scrollTo({ top: Math.max(0, y), left: Math.max(0, (vscroll.scrollWidth - vscroll.clientWidth) / 2), behavior: animate ? 'smooth' : 'auto' });
  }

  function openViewer(index) {
    if (index < 0 || index >= S.entries.length) return;
    const was = S.viewing;
    S.viewing = true;
    document.body.classList.add('viewing');
    viewerEl.hidden = false;
    select(index, false);
    showInViewer(S.entries[index], was && V.doc === S.entries[index].page.doc);
    const card = cards.get(S.entries[index].page.key);
    if (card) card.el.scrollIntoView({ block: 'nearest' });
    syncHash();
  }

  function closeViewer() {
    if (!S.viewing) return;
    S.viewing = false;
    document.body.classList.remove('viewing');
    viewerEl.hidden = true;
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

  function scrollViewerPage(dir) {
    const y = vscroll.scrollTop + 70;
    let cur = 0;
    V.pages.forEach((vp, i) => { if (vp.el.offsetTop <= y) cur = i; });
    const next = V.pages[Math.min(V.pages.length - 1, Math.max(0, cur + dir))];
    if (next) vscroll.scrollTo({ top: Math.max(0, next.el.offsetTop - 62), behavior: 'smooth' });
  }

  // ---------------------------------------------------------------- URL (#q=…&open=n) so a search can be bookmarked
  function syncHash() {
    const parts = [];
    if (S.query) parts.push('q=' + encodeURIComponent(S.query));
    if (S.viewing && S.sel >= 0) parts.push('open=' + (S.sel + 1));
    try { history.replaceState(null, '', parts.length ? '#' + parts.join('&') : location.pathname + location.search); } catch (_) {}
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
    clearTimeout(typing);
    const run = () => { S.sel = -1; refresh(); stage.scrollTop = 0; syncHash(); };
    if (now) run(); else typing = setTimeout(run, 110);
  }
  input.addEventListener('input', () => setQuery(input.value, false));

  window.addEventListener('pointermove', () => document.body.classList.remove('keys'), { passive: true });
  grid.addEventListener('click', (e) => {
    const el = e.target.closest('.card');
    if (el && el._card) openViewer(el._card.index);
  });
  vscroll.addEventListener('click', (e) => { if (!e.target.closest('.vpage')) closeViewer(); });
  vscroll.addEventListener('dblclick', (e) => { if (e.target.closest('.vsheet')) setZoom(V.zoom > 1.01 ? 1 : 1.8); });
  vscroll.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(V.zoom * Math.exp(-e.deltaY * 0.0022));
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.isComposing) return; // Japanese IME in progress
    const inInput = document.activeElement === input;
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key;
    if (mod && k.toLowerCase() === 'f') { e.preventDefault(); input.focus(); input.select(); return; }
    if (k === 'Escape') {
      if (!menu.hidden) closeMenu();
      else if (S.viewing) closeViewer();
      else if (S.query) { input.value = ''; setQuery('', true); }
      else input.blur();
      return;
    }
    if (mod || e.altKey) return;
    if (k === 'Enter') {
      if (inInput) { clearTimeout(typing); if (S.query !== input.value) setQuery(input.value, true); }
      if (document.activeElement && document.activeElement.closest && document.activeElement.closest('#menu, #add, #fs')) return;
      if (S.entries.length && !S.viewing) { e.preventDefault(); openViewer(Math.max(0, S.sel)); }
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
    if (k === '/') { e.preventDefault(); input.focus(); input.select(); }
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

  // ----- adding PDFs (button menu, pickers, drop) -----
  function openMenu() {
    menu.querySelector('[data-act="clear"]').hidden = !PS.library.docs.some((d) => d.source === 'user');
    menu.hidden = false;
    addBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() { menu.hidden = true; addBtn.setAttribute('aria-expanded', 'false'); }
  addBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
  document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !e.target.closest('#menu, #add')) closeMenu(); });
  menu.addEventListener('click', (e) => {
    const act = e.target.dataset && e.target.dataset.act;
    if (!act) return;
    closeMenu();
    if (act === 'files') $('pickFiles').click();
    else if (act === 'folder') $('pickDir').click();
    else if (act === 'clear') PS.removeUserDocs();
  });
  for (const id of ['pickFiles', 'pickDir']) {
    $(id).addEventListener('change', (e) => { PS.addFiles(e.target.files); e.target.value = ''; });
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
    const entries = [...e.dataTransfer.items].map((it) => (it.webkitGetAsEntry ? it.webkitGetAsEntry() : null)).filter(Boolean);
    const files = [];
    if (entries.length) await Promise.all(entries.map((en) => readEntry(en, files)));
    else files.push(...e.dataTransfer.files);
    PS.addFiles(files);
  });

  // ----- layout changes -----
  let resizeT = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      for (const el of grid.children) if (el._card) ensureCard(el._card);
      if (S.viewing && V.pages.length) {
        const cur = S.sel >= 0 && S.entries[S.sel] ? S.entries[S.sel].page : V.pages[0].page;
        V.baseW = fitWidth(cur.doc === V.doc ? cur : V.pages[0].page);
        sizeViewer();
        V.pages.forEach(ensureVPage);
      }
    }, 160);
  }).observe(document.body);

  // ---------------------------------------------------------------- start
  let pending = false;
  PS.library.onChange = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; refresh(); maybeOpenFromHash(); });
  };

  const boot = readHash();
  let bootOpen = parseInt(boot.open, 10) || 0;
  if (boot.q) { input.value = boot.q; S.query = boot.q; }
  function maybeOpenFromHash() {
    if (!bootOpen || PS.library.busy.total) return;
    const n = bootOpen;
    bootOpen = 0;
    if (S.entries[n - 1]) openViewer(n - 1);
  }

  updateCount();
  PS.loadLibrary().then(() => { PS.ready = true; refresh(); maybeOpenFromHash(); }, (err) => {
    countEl.textContent = '起動に失敗しました';
    console.error(err);
  });
  if (!boot.open) input.focus({ preventScroll: true });

  // for the bundled offline checks (tools/, acceptance.html): what the screen currently shows
  PS.snapshot = function () {
    return {
      query: S.shown || '',
      ready: !!PS.ready && !PS.library.busy.total,
      worker: PS.workerMode,
      docs: PS.library.docs.map((d) => ({ name: d.name, pages: d.numPages, status: d.status, error: d.error || null })),
      results: (S.shown ? S.entries : []).map((e) => ({
        file: e.page.doc.name,
        page: e.page.no,
        relevance: Math.round(e.rel * 100),
        hits: e.hits.length,
        evidence: e.lines.map((l) => PS.lineText(e.page, l.index)),
      })),
    };
  };
})();
