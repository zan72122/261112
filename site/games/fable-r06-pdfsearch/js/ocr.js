/*
 * ocr.js — scanned pages become searchable, offline (Tesseract compiled to WebAssembly, Japanese + English).
 *
 *   image-only page ──render (index worker, OffscreenCanvas)──▶ PNG ──recognise (OCR worker)──▶ words + boxes + confidence
 *        ──▶ the same page model as a text PDF (PS.buildPage) ──▶ same persistent index, same highlighting
 *
 * Everything runs in workers; the page only passes messages and writes the result (one transaction per batch).
 * The engine (vendor/tesseract-embedded/*.js, ~15 MB) is loaded only when a page actually needs OCR.
 * Work waits while the owner types or scrolls, and resumes by itself; after a restart the pages that are
 * still marked "waiting for OCR" are picked up again.
 */
(function (root) {
  'use strict';
  const PS = root.PS, L = PS.library, store = PS.store;
  const TESS = 'vendor/tesseract-embedded/';
  const LANGS = ['jpn', 'eng', 'jpn_vert'];
  const MAX_WORKERS = Math.max(1, Math.min(3, Math.floor((navigator.hardwareConcurrency || 4) / 2) - 1));

  const queue = [];        // { doc, page, opts, resolve }
  const queued = new Set(); // page keys
  let engineP = null;
  const workers = [];      // { w, busy, ready }
  let render = null;       // { w, key, waiting: Map(id -> {resolve, reject}) }
  let seq = 0, active = 0;
  PS.ocrState = { engine: 'idle', error: null, ms: [], pages: 0 };

  // typing / scrolling comes first: background OCR starts no new page for a moment after any input
  let userAt = 0;
  for (const ev of ['keydown', 'input', 'wheel', 'pointerdown']) window.addEventListener(ev, () => { userAt = performance.now(); }, { passive: true, capture: true });
  const quiet = () => performance.now() - userAt > 350;

  function engine() {
    if (!engineP) {
      PS.ocrState.engine = 'loading';
      engineP = Promise.all([PS.loadAsset('tesseract/core', TESS + 'core.js'), ...LANGS.map((l) => PS.loadAsset('tesseract/' + l, TESS + l + '.js'))]).then(([core, ...langs]) => {
        const url = URL.createObjectURL(new Blob([core, '\n;', root.PS_OCR_WORKER.toString(), '\nPS_OCR_WORKER();\n'], { type: 'text/javascript' }));
        PS.ocrState.engine = 'ready';
        return { url, langs };
      });
      engineP.catch((err) => { PS.ocrState.engine = 'failed'; PS.ocrState.error = String((err && err.message) || err); });
    }
    return engineP;
  }

  function spawnOcr() {
    const slot = { w: null, busy: null, ready: null };
    slot.ready = engine().then(({ url, langs }) => new Promise((resolve, reject) => {
      const w = new Worker(url);
      slot.w = w;
      w.onerror = (e) => { reject(new Error((e && e.message) || 'OCR worker failed')); if (slot.busy) { slot.busy.reject(new Error('OCR worker crashed')); slot.busy = null; } };
      w.onmessage = (ev) => {
        const m = ev.data;
        if (m.t === 'ready') resolve();
        else if (m.t === 'res' && slot.busy) { const b = slot.busy; slot.busy = null; b.resolve(m); }
        else if (m.t === 'err') { if (slot.busy) { const b = slot.busy; slot.busy = null; b.reject(new Error(m.message)); } else reject(new Error(m.message)); }
      };
      const data = {};
      LANGS.forEach((l, i) => { data[l] = langs[i].slice().buffer; });
      w.postMessage({ t: 'init', langs: data, init: 'jpn+eng' }, Object.values(data));
    }));
    return slot;
  }

  function renderer() {
    if (render) return render.ready;
    render = { w: null, key: null, waiting: new Map(), ready: null };
    render.ready = PS._indexWorkerUrl().then((url) => new Promise((resolve, reject) => {
      const w = new Worker(url);
      render.w = w;
      const post = (m, t) => w.postMessage(m, t || []);
      w.onerror = (e) => reject(new Error((e && e.message) || 'render worker failed'));
      w.onmessage = (ev) => {
        const m = ev.data;
        if (!m || !m.t) return;
        if (m.t === 'up') return resolve(render);
        if (m.t === 'ask') return PS._serveAsk(post, m);
        const p = render.waiting.get(m.id);
        if (!p) return;
        render.waiting.delete(m.id);
        if (m.t === 'img') p.resolve(m); else p.reject(new Error(m.message || 'render failed'));
      };
    }));
    return render.ready;
  }

  // the page as an image, drawn off the main thread; the PDF bytes travel only when the document changes
  async function pageImage(doc, no, opts) {
    const r = await renderer();
    const id = ++seq;
    const msg = { t: 'ocrimg', id, key: doc.id, page: no, rotate: (opts && opts.rotate) || 0, longSide: (opts && opts.longSide) || 0 };
    const transfer = [];
    if (r.key !== doc.id) { const bytes = await doc.getBytes(); msg.bytes = bytes; transfer.push(bytes.buffer); r.key = doc.id; }
    return new Promise((resolve, reject) => { r.waiting.set(id, { resolve, reject }); r.w.postMessage(msg, transfer); });
  }

  /**
   * Tesseract TSV (levels 4 = line, 5 = word) -> raw page items in page coordinates.
   * iw, ih: image size; pw, ph: page size (unrotated, px at scale 1); rot: clockwise rotation the image was rendered with.
   */
  PS.ocrToRaw = function (tsv, iw, ih, pw, ph, rot) {
    rot = ((rot || 0) % 360 + 360) % 360;
    const lines = new Map();
    for (const row of tsv.split('\n')) {
      const c = row.split('\t');
      if (c.length < 12) continue;
      const level = +c[0];
      if (level !== 4 && level !== 5) continue;
      const key = c[2] + '-' + c[3] + '-' + c[4];
      let ln = lines.get(key);
      if (!ln) lines.set(key, (ln = { box: null, words: [] }));
      const box = { l: +c[6], t: +c[7], w: +c[8], h: +c[9] };
      if (level === 4) ln.box = box;
      else { const text = c.slice(11).join('\t').replace(/\s+/g, ''); if (text && +c[10] >= 0) ln.words.push({ ...box, conf: +c[10], text }); }
    }
    // image px -> page px. The image may have been rendered rotated: map points back to the unrotated page.
    const swap = rot === 90 || rot === 270;
    const s = (swap ? ph : pw) / iw;
    const pt = (x, y) => { x *= s; y *= s; return rot === 90 ? [y, ph - x] : rot === 180 ? [pw - x, ph - y] : rot === 270 ? [pw - y, x] : [x, y]; };
    const dir = (dx, dy) => (rot === 90 ? [dy, -dx] : rot === 180 ? [-dx, -dy] : rot === 270 ? [-dy, dx] : [dx, dy]);
    const items = [];
    let confSum = 0, confN = 0;
    const isAscii = (ch) => ch && ch.charCodeAt(0) < 0x2e80;
    for (const ln of lines.values()) {
      const ws = ln.words;
      if (!ws.length) continue;
      const lb = ln.box || { l: Math.min(...ws.map((w) => w.l)), t: Math.min(...ws.map((w) => w.t)), w: 0, h: 0 };
      if (!ln.box) { lb.w = Math.max(...ws.map((w) => w.l + w.w)) - lb.l; lb.h = Math.max(...ws.map((w) => w.t + w.h)) - lb.t; }
      const tops = ws.map((w) => w.t);
      const stacked = ws.length > 1 ? Math.max(...tops) - Math.min(...tops) > lb.w * 0.8 : ws[0].text.length > 1 && ws[0].h > ws[0].w * 1.6;
      const vertical = lb.h > lb.w * 1.4 && stacked;
      const med = (arr) => { const a = [...arr].sort((x, y) => x - y); return a[a.length >> 1]; };
      if (vertical) {
        // Japanese vertical writing: words run top to bottom, the column is as wide as the line box
        ws.sort((a, b) => a.t - b.t);
        const colW = med(ws.map((w) => w.w));
        const cx = lb.l + lb.w / 2;
        ws.forEach((w, i) => {
          const [x, y] = pt(cx - colW / 2, w.t);
          const [ux, uy] = dir(0, 1);
          items.push({ str: w.text, fam: 'serif', x, y, ux, uy, len: w.h * s, fs: colW * s, up: colW * s, dn: 0, eol: i === ws.length - 1 ? 1 : 0, cf: Math.round(w.conf) });
          confSum += w.conf * w.text.length; confN += w.text.length;
        });
      } else {
        ws.sort((a, b) => a.l - b.l);
        const mh = med(ws.map((w) => w.h));
        ws.forEach((w, i) => {
          // word boxes of the LSTM engine wobble in height: use the line's typical height around the word's own centre
          const cy = w.t + w.h / 2;
          const [x, y] = pt(w.l, cy + mh / 2);
          const [ux, uy] = dir(1, 0);
          const next = ws[i + 1];
          const gap = next && (isAscii(w.text[w.text.length - 1]) || isAscii(next.text[0])) ? ' ' : '';
          items.push({ str: w.text + gap, fam: 'serif', x, y, ux, uy, len: w.w * s, fs: mh * s, up: mh * s, dn: 0, eol: next ? 0 : 1, cf: Math.round(w.conf) });
          confSum += w.conf * w.text.length; confN += w.text.length;
        });
      }
    }
    return { raw: { w: pw, h: ph, items }, conf: confN ? Math.round(confSum / confN) : 0, chars: confN };
  };

  // why an OCR result should not be trusted blindly (A7): more than the engine's own confidence
  function doubtOf(text, conf) {
    let d = 0;
    if (conf < 60) d |= 1;
    if (text.length < 30) d |= 2;
    let odd = 0;
    for (let k = 0; k < text.length; k++) { const c = text.charCodeAt(k); if (c === 0xfffd || (c >= 0x2500 && c <= 0x25ff) || (c >= 0xe000 && c <= 0xf8ff) || '|~^`\\_'.includes(text[k])) odd++; }
    if (text.length && odd / text.length > 0.12) d |= 4;
    return d;
  }

  // write-behind per document: every flush is one transaction (text record + the pages' positions), at most one per 1.5 s
  const dirtyDocs = new Map(); // doc -> { geoms: Map(key -> packed), timer }
  function markDirty(doc, key, packed) {
    let d = dirtyDocs.get(doc);
    if (!d) dirtyDocs.set(doc, (d = { geoms: new Map(), timer: 0 }));
    d.geoms.set(key, packed);
    if (!d.timer) d.timer = setTimeout(() => flush(doc), 1500);
  }
  function flush(doc) {
    const d = dirtyDocs.get(doc);
    if (!d) return Promise.resolve();
    clearTimeout(d.timer);
    dirtyDocs.delete(doc);
    if (!L.byId.has(doc.id)) return Promise.resolve();
    const ops = [{ put: 'text', value: PS._textRecord(doc) }, { put: 'docs', value: PS._docRecord(doc) }];
    for (const [key, packed] of d.geoms) ops.push({ put: 'geom', key, value: packed });
    return store.batch(ops).catch(() => {});
  }
  PS.flushOcr = () => Promise.all([...dirtyDocs.keys()].map(flush));

  async function ocrPage(job) {
    const { doc, page, opts } = job;
    const t0 = performance.now();
    const img = await pageImage(doc, page.no, opts);
    let slot = workers.find((s) => !s.busy);
    if (!slot) { slot = spawnOcr(); workers.push(slot); }
    slot.busy = { resolve() {}, reject() {} }; // reserved
    let res;
    try {
      await slot.ready;
      res = await new Promise((resolve, reject) => { slot.busy = { resolve, reject }; slot.w.postMessage({ t: 'ocr', id: img.id, png: img.png }, [img.png]); });
    } catch (err) { slot.busy = null; throw err; }
    const out = PS.ocrToRaw(res.tsv, img.w, img.h, page.w, page.h, (opts && opts.rotate) || 0);
    const built = PS.buildPage(out.raw);
    if (!L.byId.has(doc.id) || doc.pages[page.no - 1] !== page) return; // the document left the library meanwhile
    // swap in the page's new generation in one step: a search never sees half of it
    const bytes = PS.sigBytes(built.text.length);
    const sig = new Uint8Array(bytes);
    PS.makeSig(built.text, sig, 0, bytes);
    const was = page.ocr;
    Object.assign(page, { text: built.text, fl: built.fl, le: built.le, sb: sig, so: 0, sl: bytes, ocr: built.text.length ? 2 : 3, conf: out.conf, doubt: doubtOf(built.text, out.conf), gen: (page.gen || 1) + 1 });
    if (was === 1) doc.ocrLeft = Math.max(0, doc.ocrLeft - 1);
    PS._geomCache.delete(page.key);
    markDirty(doc, PS.pageKey(doc.id, page.no), PS.packRaw(out.raw));
    const ms = performance.now() - t0;
    PS.ocrState.ms.push(Math.round(ms));
    PS.ocrState.pages++;
    return { ms, conf: out.conf, chars: built.text.length };
  }

  function pump() {
    if (PS.debug.pauseOcr) return; // test hook: hold OCR back (A2 "not searched yet")
    while (active < MAX_WORKERS && queue.length) {
      if (!quiet() && !queue[0].urgent) { setTimeout(pump, 200); return; }
      const job = queue.shift();
      active++;
      ocrPage(job).then((r) => { job.resolve(r || null); }, (err) => {
        // a page that cannot be read stays "waiting": the ledger shows it, a retry is one key away
        job.page.ocrError = String((err && err.message) || err);
        if (err && err.needAccess !== undefined) job.doc.ocrBlocked = true;
        job.resolve(null);
      }).finally(() => {
        active--;
        queued.delete(job.page.key);
        L.ocr.done++;
        if (!queue.length && !active) {
          L.ocr.done = L.ocr.total = 0;
          PS.flushOcr().then(() => PS._changed(true));
          // the engine holds ~200 MB per worker: let it go when there is nothing left to read
          setTimeout(() => { if (!queue.length && !active) { for (const s of workers) if (s.w) s.w.terminate(); workers.length = 0; if (render && render.w) { render.w.terminate(); render = null; } } }, 30000);
        } else PS._changed();
        pump();
      });
    }
  }

  /** Queue every page of the document that still waits for OCR (image-only pages). */
  PS.queueOcr = function (doc) {
    if (!doc.pages || doc.ocrBlocked) return 0;
    let n = 0;
    for (const page of doc.pages) {
      if (page.ocr !== 1 || queued.has(page.key)) continue;
      queued.add(page.key);
      queue.push({ doc, page, opts: null, resolve() {} });
      L.ocr.total++;
      n++;
    }
    if (n) PS._changed();
    pump();
    return n;
  };

  /**
   * Read one page again (A7): opts { rotate: 0|90|180|270, longSide: px }. Only this page's index entry changes.
   * Resolves to { ms, conf, chars } or null when the page could not be read.
   */
  PS.reocrPage = function (page, opts) {
    if (queued.has(page.key)) return Promise.resolve(null);
    queued.add(page.key);
    L.ocr.total++;
    return new Promise((resolve) => { queue.unshift({ doc: page.doc, page, opts: opts || {}, urgent: true, resolve }); PS._changed(); pump(); }).then((r) => PS.flushOcr().then(() => r));
  };

  /** After access to a folder came back: pages that were blocked can be read now. */
  PS.resumeOcr = pump;
  PS.retryOcr = function () { for (const d of L.docs) { d.ocrBlocked = false; if (d.ocrLeft) PS.queueOcr(d); } };
})(window);
