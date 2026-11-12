/*
 * core.js — everything between the files on disk and the search engine:
 *   - loading binaries through <script> tags (the only thing file:// allows)
 *   - PDF.js on the page (drawing the pages you look at)
 *   - the library: documents and their searchable pages, loaded from the persistent index
 *   - background indexing: a pool of Blob workers turns PDFs into index entries
 *   - folders: add once, re-scan later (only new / changed files are read again)
 * No network access anywhere in this file.
 */
(function (root) {
  'use strict';
  const PS = (root.PS = root.PS || {});
  const store = PS.store;
  const EMB = 'vendor/pdfjs-embedded/';

  // ------------------------------------------------------------ script-tag assets
  const arrived = new Map();
  const loading = new Map();
  const kept = new Map(); // small shared resources (CMaps, fonts) stay decoded
  root.__psAsset = function (key, b64) { arrived.set(key, b64); };

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => { s.remove(); resolve(); };
      s.onerror = () => { s.remove(); reject(new Error('読み込めません: ' + url)); };
      document.head.appendChild(s);
    });
  }
  PS.loadScript = loadScript;

  function decodeBase64(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /** Bytes of an embedded binary (see tools/build-embedded.mjs). keep = cache the decoded bytes. */
  PS.loadAsset = function (key, url, keep) {
    if (kept.has(key)) return Promise.resolve(kept.get(key).slice());
    let p = loading.get(key);
    if (!p) {
      p = loadScript(url).then(() => {
        const b64 = arrived.get(key);
        arrived.delete(key);
        loading.delete(key);
        if (b64 == null) throw new Error('埋め込みデータがありません: ' + key);
        const bytes = decodeBase64(b64);
        if (keep) kept.set(key, bytes);
        return bytes;
      }, (err) => { loading.delete(key); throw err; });
      loading.set(key, p);
    }
    return p.then((bytes) => bytes.slice());
  };

  // ------------------------------------------------------------ PDF.js on the page (viewer)
  let lib = null, pdfWorker = null, pdfReady = null;
  PS.workerMode = 'none';

  let sourcesP = null;
  // the two halves of PDF.js as text (for Blob workers)
  function pdfSources() {
    if (!sourcesP) {
      sourcesP = Promise.all([
        root.PS_PDF_WORKER_SOURCE ? null : loadScript(EMB + 'worker-source.js'),
        root.PS_PDF_DISPLAY_SOURCE ? null : loadScript(EMB + 'display-source.js'),
      ]).then(() => {
        if (!root.PS_PDF_WORKER_SOURCE || !root.PS_PDF_DISPLAY_SOURCE) throw new Error('PDF.js source missing');
        return { core: root.PS_PDF_WORKER_SOURCE, display: root.PS_PDF_DISPLAY_SOURCE };
      });
      sourcesP.catch(() => { sourcesP = null; });
    }
    return sourcesP;
  }

  function startBlobWorker() {
    return pdfSources().then((src) => new Promise((resolve, reject) => {
      if (typeof Worker === 'undefined') return reject(new Error('no worker'));
      const url = URL.createObjectURL(new Blob([src.core], { type: 'text/javascript' }));
      let worker;
      const fail = (e) => { clearTimeout(timer); try { worker && worker.terminate(); } catch (_) {} URL.revokeObjectURL(url); reject(e instanceof Error ? e : new Error('worker error')); };
      const timer = setTimeout(() => fail(new Error('worker timeout')), 8000);
      try { worker = new Worker(url); } catch (e) { return fail(e); }
      worker.addEventListener('error', fail, { once: true });
      // the PDF.js worker announces itself with a "ready" message
      worker.addEventListener('message', function onMsg(ev) {
        if (!ev.data || ev.data.action !== 'ready') return;
        worker.removeEventListener('message', onMsg);
        worker.removeEventListener('error', fail);
        clearTimeout(timer);
        resolve(worker);
      });
    }));
  }

  PS.initPdf = function () {
    if (pdfReady) return pdfReady;
    lib = root.pdfjsLib;
    lib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/build/pdf.worker.min.js';
    pdfReady = startBlobWorker().then((worker) => {
      pdfWorker = new lib.PDFWorker({ port: worker });
      PS.workerMode = 'worker';
    }).catch(() =>
      // Fallback: run the PDF.js worker code on the main thread.
      loadScript('vendor/pdfjs/build/pdf.worker.min.js').then(() => {
        pdfWorker = new lib.PDFWorker();
        PS.workerMode = 'main-thread';
      })
    );
    return pdfReady;
  };

  // Many Japanese PDFs name a font without embedding it (HeiseiMin-W3, Ryumin-Light, MS-Mincho…).
  // PDF.js then asks the system for exactly that name and otherwise falls back to a Latin font.
  // Offer the Japanese fonts that ship with macOS / Windows / Linux as stand-ins (all local()).
  const NativeFontFace = root.FontFace;
  if (NativeFontFace) {
    const JP_FONT = /heisei|ryumin|gothicbbb|mincho|gothic|kozmin|kozgo|kozuka|hiragino|meiryo|yumin|yugo|ipa|osaka|futo|shingo|midashi|jun\d/i;
    const MINCHO = ['Hiragino Mincho ProN', 'Yu Mincho', 'YuMincho', 'MS Mincho', 'Noto Serif CJK JP', 'Noto Serif JP', 'IPAexMincho', 'IPAMincho'];
    const GOTHIC = ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'YuGothic', 'Meiryo', 'MS Gothic', 'Noto Sans CJK JP', 'Noto Sans JP', 'IPAexGothic', 'IPAGothic'];
    const Patched = function (family, src, desc) {
      if (typeof src === 'string') {
        const m = /^local\(([^)]+)\)$/.exec(src.trim());
        if (m && JP_FONT.test(m[1])) {
          const list = /min|ryumin|serif/i.test(m[1]) ? MINCHO : GOTHIC;
          src += ', ' + list.map((n) => `local("${n}")`).join(', ');
        }
      }
      return new NativeFontFace(family, src, desc);
    };
    Patched.prototype = NativeFontFace.prototype;
    root.FontFace = Patched;
  }

  // PDF.js asks for CMaps (Japanese encodings) and standard fonts; serve the embedded copies.
  const cmapBytes = (name) => PS.loadAsset(`cmaps/${name}.bcmap`, `${EMB}cmaps/${name}.bcmap.js`, true);
  const fontBytes = (filename) => PS.loadAsset(`standard_fonts/${filename}`, `${EMB}standard_fonts/${filename}.js`, true);
  class CMapFactory {
    async fetch({ name }) { return { cMapData: await cmapBytes(name), compressionType: lib.CMapCompressionType.BINARY }; }
  }
  class FontFactory {
    async fetch({ filename }) { return fontBytes(filename); }
  }
  const pdfParams = () => ({ worker: pdfWorker, CMapReaderFactory: CMapFactory, StandardFontDataFactory: FontFactory, cMapUrl: EMB + 'cmaps/', cMapPacked: true, standardFontDataUrl: EMB + 'standard_fonts/' });

  // Open documents are few (LRU); everything else is reopened from bytes on demand.
  const MAX_OPEN = 6;
  const open = new Map(); // doc.id -> { promise, refs, used }
  let tick = 0;

  function openPdf(doc) {
    let slot = open.get(doc.id);
    if (!slot) {
      slot = { refs: 0, used: 0, promise: null };
      slot.promise = PS.initPdf().then(() => doc.getBytes()).then((data) => lib.getDocument(Object.assign({
        data,
        useWorkerFetch: false,
        isEvalSupported: false,
        enableXfa: false,
        disableAutoFetch: true,
        disableStream: true,
        disableRange: true,
      }, pdfParams())).promise);
      slot.promise.catch(() => { if (open.get(doc.id) === slot) open.delete(doc.id); });
      open.set(doc.id, slot);
    }
    return slot;
  }

  function evict() {
    if (open.size <= MAX_OPEN) return;
    const idle = [...open.entries()].filter(([, s]) => s.refs === 0).sort((a, b) => a[1].used - b[1].used);
    while (open.size > MAX_OPEN && idle.length) {
      const [id, slot] = idle.shift();
      open.delete(id);
      slot.promise.then((pdf) => pdf.destroy()).catch(() => {});
    }
  }

  /** Run fn(pdfDocument) with the document kept open for the duration. */
  PS.withPdf = async function (doc, fn) {
    const slot = openPdf(doc);
    slot.refs++;
    slot.used = ++tick;
    try {
      return await fn(await slot.promise);
    } finally {
      slot.refs--;
      evict();
    }
  };

  function closePdf(doc) {
    const slot = open.get(doc.id);
    if (!slot) return;
    open.delete(doc.id);
    slot.promise.then((pdf) => pdf.destroy()).catch(() => {});
  }

  // ------------------------------------------------------------ library (in memory)
  const L = (PS.library = {
    docs: [],          // sorted: bundled first, then by path
    pages: [],         // every searchable page, in library order
    byId: new Map(),
    folders: [],
    busy: { done: 0, total: 0 },   // indexing jobs
    ocr: { done: 0, total: 0 },    // OCR pages
    persistent: true,
    loaded: false,
    onChange: null,
    stats: { loadMs: 0, indexed: 0, parsed: 0 },
  });
  const sessionFiles = new Map(); // doc.id -> File picked / dropped in this session
  const volatile = new Map();     // page key -> { geom, thumb } for documents the store refused (quota)
  const collator = new Intl.Collator('ja', { numeric: true });

  let dirty = false, notifyT = 0, lastNotify = 0;
  function rebuild() {
    if (!dirty) return;
    dirty = false;
    L.docs = [...L.byId.values()].sort((a, b) => (!!b.bundled - !!a.bundled) || collator.compare(a.path, b.path));
    const pages = [];
    for (const d of L.docs) if (d.pages) for (const p of d.pages) pages.push(p);
    L.pages = pages;
  }
  /** Tell the screen the library changed (at most every 600 ms while indexing). */
  function changed(now) {
    dirty = true;
    const fire = () => { notifyT = 0; lastNotify = performance.now(); rebuild(); if (L.onChange) L.onChange(); };
    if (notifyT) { if (!now) return; clearTimeout(notifyT); notifyT = 0; }
    const wait = now ? 0 : Math.max(0, 600 - (performance.now() - lastNotify));
    if (!wait) fire(); else notifyT = setTimeout(fire, wait);
  }
  PS.refreshLibrary = () => { dirty = true; rebuild(); };

  function makeDoc(rec) {
    const doc = {
      id: rec.id, name: rec.name, path: rec.path || rec.name, size: rec.size, numPages: rec.numPages || 0,
      status: rec.status || 'ready', error: rec.error || null,
      bundled: rec.bundled || null, blob: !!rec.blob, paths: rec.paths || [], added: rec.added || 0,
      sha256: rec.sha256 || null,       // full content hash (id = its first 32 hex chars)
      meta: rec.meta || null,           // citation fields found in the file: { title, authors, year, journal, doi, src }
      labels: rec.labels || null,       // printed page labels, only when the PDF defines /PageLabels
      gen: rec.gen || 1,                // index generation (raised when pages are re-read, e.g. by OCR)
      stale: rec.stale || null,         // { at, error }: the file changed on disk but its new version could not be indexed
      failedPaths: rec.failedPaths || [], // locations where this (unreadable) content was seen
      pages: [], ocrLeft: 0,
    };
    doc.source = doc.bundled ? 'bundled' : 'user';
    doc.getBytes = () => docBytes(doc);
    return doc;
  }
  const docRecord = (doc) => ({
    id: doc.id, name: doc.name, path: doc.path, size: doc.size, numPages: doc.numPages, status: doc.status, error: doc.error,
    bundled: doc.bundled, blob: doc.blob, paths: doc.paths, added: doc.added,
    sha256: doc.sha256, meta: doc.meta, labels: doc.labels, gen: doc.gen, stale: doc.stale, failedPaths: doc.failedPaths,
  });

  // Light pages: what searching needs stays in memory; positions and thumbnails stay in the store.
  function attachText(doc, t) {
    const pages = new Array(t.n);
    let a = 0, b = 0, c = 0, left = 0;
    for (let i = 0; i < t.n; i++) {
      const len = t.texts[i].length;
      pages[i] = {
        doc, no: i + 1, key: doc.id + '#' + (i + 1), w: t.w[i], h: t.h[i],
        text: t.texts[i], fl: t.fl.subarray(a, a + len), le: t.le.subarray(b, b + t.lc[i]),
        sb: t.sig, so: c, sl: t.sl[i], ocr: t.ocr[i], conf: t.conf ? t.conf[i] : 0,
        doubt: t.doubt ? t.doubt[i] : 0, // why a page's text is doubtful (bit 1 low OCR confidence, 2 almost no text, 4 unusual chars)
        gen: t.pg ? t.pg[i] : 1,          // generation of this page's index entry
      };
      if (t.ocr[i] === 1) left++;
      a += len; b += t.lc[i]; c += t.sl[i];
    }
    doc.pages = pages;
    doc.numPages = t.n;
    doc.ocrLeft = left;
  }
  // the persistent text record of a document, rebuilt from its pages (after OCR changed some)
  function textRecord(doc) {
    const n = doc.pages.length;
    let flLen = 0, leLen = 0, sigLen = 0;
    for (const p of doc.pages) { flLen += p.fl.length; leLen += p.le.length; sigLen += p.sl; }
    const t = { id: doc.id, gen: doc.gen, n, w: new Float32Array(n), h: new Float32Array(n), texts: new Array(n), fl: new Uint8Array(flLen), le: new Uint32Array(leLen),
      lc: new Uint32Array(n), sl: new Uint16Array(n), sig: new Uint8Array(sigLen), ocr: new Uint8Array(n), conf: new Uint8Array(n),
      doubt: new Uint8Array(n), pg: new Uint16Array(n) };
    let a = 0, b = 0, c = 0;
    doc.pages.forEach((p, i) => {
      t.w[i] = p.w; t.h[i] = p.h; t.texts[i] = p.text; t.lc[i] = p.le.length; t.sl[i] = p.sl; t.ocr[i] = p.ocr; t.conf[i] = p.conf || 0; t.doubt[i] = p.doubt || 0; t.pg[i] = p.gen || 1;
      t.fl.set(p.fl, a); a += p.fl.length;
      t.le.set(p.le, b); b += p.le.length;
      t.sig.set(p.sb.subarray(p.so, p.so + p.sl), c); c += p.sl;
    });
    return t;
  }
  PS._textRecord = textRecord;

  const folderById = (id) => L.folders.find((f) => f.id === id);

  async function docBytes(doc) {
    if (doc.bundled) return PS.loadAsset('pdfs/' + doc.bundled, 'pdfs/embedded/' + encodeURIComponent(doc.bundled) + '.js');
    const f = sessionFiles.get(doc.id);
    if (f) { try { return new Uint8Array(await f.arrayBuffer()); } catch (_) { sessionFiles.delete(doc.id); } }
    if (doc.blob) {
      const blob = await store.get('blobs', doc.id);
      if (blob) return new Uint8Array(await blob.arrayBuffer());
    }
    let locked = null;
    for (const p of doc.paths) {
      const folder = folderById(p.folder);
      if (!folder) continue;
      if (!folder.handle) { locked = locked || folder; continue; }
      try {
        if ((await folder.handle.queryPermission({ mode: 'read' })) !== 'granted') { locked = locked || folder; continue; }
        const file = await (await resolveHandle(folder.handle, p.rel)).getFile();
        return new Uint8Array(await file.arrayBuffer());
      } catch (_) { /* moved or deleted since the last scan: try the next location */ }
    }
    const err = new Error(locked ? 'フォルダへのアクセス許可が必要です' : 'ファイルが見つかりません');
    err.needAccess = locked;
    throw err;
  }
  async function resolveHandle(dir, rel) {
    const parts = rel.split('/');
    for (let i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle(parts[i]);
    return dir.getFileHandle(parts[parts.length - 1]);
  }

  /**
   * Can the PDF itself be read right now? 'ok' | folder record (needs the user's click to re-grant) | null (gone).
   * The index (search, highlights, thumbnails) works either way.
   */
  PS.access = async function (doc) {
    if (doc.bundled || doc.blob || sessionFiles.has(doc.id)) return 'ok';
    let locked = null;
    for (const p of doc.paths) {
      const folder = folderById(p.folder);
      if (!folder) continue;
      if (!folder.handle) { locked = locked || folder; continue; }
      try { if ((await folder.handle.queryPermission({ mode: 'read' })) === 'granted') return 'ok'; } catch (_) {}
      locked = locked || folder;
    }
    return locked;
  };

  // ------------------------------------------------------------ positions + thumbnails (lazy, from the store)
  const geomCache = new Map(); // page.key -> built page (LRU)
  const GEOM_MAX = 500;
  /** The page with its text positions (for painting hits). Promise; cached. */
  PS.geom = function (page) {
    const hit = geomCache.get(page.key);
    if (hit) { geomCache.delete(page.key); geomCache.set(page.key, hit); return hit; }
    const key = PS.pageKey(page.doc.id, page.no);
    const v = volatile.get(key);
    const p = (v ? Promise.resolve(v.geom) : store.get('geom', key)).then((packed) => {
      const g = PS.buildPage(packed ? PS.unpackRaw(packed) : { w: page.w, h: page.h, items: [] });
      g.doc = page.doc; g.no = page.no;
      p.value = g;
      return g;
    });
    p.catch(() => geomCache.delete(page.key));
    geomCache.set(page.key, p);
    if (geomCache.size > GEOM_MAX) geomCache.delete(geomCache.keys().next().value);
    return p;
  };
  /** Same, but only if it is already loaded (else null). */
  PS.geomNow = (page) => { const p = geomCache.get(page.key); return p && p.value ? p.value : null; };

  const thumbCache = new Map(); // page.key -> Promise<url|null>
  const THUMB_MAX = 400;
  /** Object URL of the stored thumbnail of a page (null if none). */
  PS.thumbUrl = function (page) {
    let p = thumbCache.get(page.key);
    if (p) { thumbCache.delete(page.key); thumbCache.set(page.key, p); return p; }
    const key = PS.pageKey(page.doc.id, page.no);
    const v = volatile.get(key);
    p = (v ? Promise.resolve(v.thumb) : store.get('thumbs', key)).then((t) => (t && t.data ? URL.createObjectURL(new Blob([t.data], { type: t.type })) : null), () => null);
    thumbCache.set(page.key, p);
    if (thumbCache.size > THUMB_MAX) {
      const [k, old] = thumbCache.entries().next().value;
      thumbCache.delete(k);
      old.then((u) => { if (u) URL.revokeObjectURL(u); });
    }
    return p;
  };
  /** Raw stored thumbnail { type, data } (for exports). */
  PS.thumbData = (docId, no) => { const key = PS.pageKey(docId, no); const v = volatile.get(key); return v ? Promise.resolve(v.thumb) : store.get('thumbs', key); };

  function forgetPages(doc) {
    for (const p of doc.pages || []) {
      geomCache.delete(p.key);
      const t = thumbCache.get(p.key);
      if (t) { thumbCache.delete(p.key); t.then((u) => { if (u) URL.revokeObjectURL(u); }); }
    }
  }

  // ------------------------------------------------------------ background workers
  const POOL_MAX = Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 4) - 2));
  const pool = { slots: [], queue: [], jobs: new Map(), seq: 0, url: null, broken: false, idleT: 0 };
  PS.indexMode = 'none'; // 'worker' | 'page' (fallback)
  PS.debug = {};         // test hooks (tools/acceptance.mjs): failAt(job) -> page number at which indexing throws

  function indexWorkerUrl() {
    return pdfSources().then((src) => {
      if (!pool.url) {
        pool.url = URL.createObjectURL(new Blob([
          src.display, '\n;', src.core, '\n;',
          root.PS_SEARCH_FACTORY.toString(), '\nPS_SEARCH_FACTORY(self);\n',
          root.PS_INDEX_WORKER.toString(), '\nPS_INDEX_WORKER();\n',
        ], { type: 'text/javascript' }));
      }
      return pool.url;
    });
  }

  function spawnSlot() {
    const slot = { worker: null, job: null, ready: null, post: null, dead: false, role: 'index' };
    slot.ready = (pool.broken ? Promise.reject(new Error('no worker')) : indexWorkerUrl().then((url) => new Promise((resolve, reject) => {
      let up = false;
      const w = new Worker(url);
      const timer = setTimeout(() => { if (!up) reject(new Error('index worker timeout')); }, 15000);
      w.onerror = (e) => { if (!up) { clearTimeout(timer); reject(new Error((e && e.message) || 'index worker failed')); } else slotCrashed(slot, e); };
      w.onmessage = (ev) => {
        const m = ev.data;
        if (!m || !m.t) return; // PDF.js announces itself on the same channel
        if (m.t === 'up') { up = true; clearTimeout(timer); PS.indexMode = 'worker'; resolve(); return; }
        onSlotMessage(slot, m);
      };
      slot.worker = w;
      slot.post = (m, t) => w.postMessage(m, t || []);
    }))).catch(() => {
      // Blob workers refused: run the same code on the page (slower, but everything still works)
      pool.broken = true;
      PS.indexMode = 'page';
      if (slot.worker) { try { slot.worker.terminate(); } catch (_) {} slot.worker = null; }
      return PS.initPdf().then(() => {
        const host = { postMessage: (m) => Promise.resolve().then(() => onSlotMessage(slot, m)), deliver: null, pdfParams };
        root.PS_INDEX_WORKER(host);
        slot.post = (m) => Promise.resolve().then(() => host.deliver(m));
      });
    });
    return slot;
  }

  function slotCrashed(slot, e) {
    slot.dead = true;
    const job = slot.job;
    pool.slots = pool.slots.filter((s) => s !== slot);
    if (job) finishJob(job, { failed: true, error: 'worker crashed: ' + ((e && e.message) || '') });
    pump();
  }

  function answer(slot, rid, data, error) {
    if (error) slot.post({ t: 'answer', rid, error: String(error) });
    else slot.post({ t: 'answer', rid, data }, data && data.buffer ? [data.buffer] : undefined);
  }

  const inflight = new Map(); // content hash -> jobs waiting for the same content that is being indexed right now

  function onSlotMessage(slot, m) {
    if (m.t === 'ask') {
      if (m.kind === 'cmap') cmapBytes(m.arg).then((d) => answer(slot, m.rid, d), (e) => answer(slot, m.rid, null, e));
      else if (m.kind === 'font') fontBytes(m.arg).then((d) => answer(slot, m.rid, d), (e) => answer(slot, m.rid, null, e));
      else if (m.kind === 'hash') {
        const job = pool.jobs.get(m.arg.id);
        const hash = m.arg.hash;
        if (job) job.hash = hash;
        const known = L.byId.get(hash);
        // unchanged content that is already indexed (moved / renamed / touched / duplicate file): do not parse again
        let go = !known || !!(job && job.retry); // retry: the owner asked to read this file again
        if (go && inflight.has(hash)) go = false;
        if (go) { inflight.set(hash, []); if (job) job.owns = true; }
        answer(slot, m.rid, go);
      }
      return;
    }
    const job = pool.jobs.get(m.id);
    if (!job) return;
    if (m.t === 'prog') { job.page = m.page; job.of = m.of; if (PS.onProgress) PS.onProgress(); return; }
    if (m.t === 'img') { slot.job = null; pool.jobs.delete(job.id); job.resolve(m); pump(); return; }
    slot.job = null;
    if (m.t === 'doc') commitDoc(job, m).then(() => finishJob(job, { indexed: true }), (err) => finishJob(job, { failed: true, error: String(err && err.message || err) }));
    else if (m.t === 'skip') {
      const wait = inflight.get(m.hash);
      if (wait && !L.byId.has(m.hash)) wait.push(job); // same content is being indexed by another worker: join it
      else attachSource(job, m.hash).then(() => finishJob(job, { known: true }));
    } else if (m.t === 'err') {
      if (job.kind === 'ocrimg') { pool.jobs.delete(job.id); job.reject(new Error(m.message)); pump(); return; }
      failedDoc(job, m).then(() => finishJob(job, { failed: true, error: m.message }));
    }
    pump();
  }

  function pump() {
    clearTimeout(pool.idleT);
    while (pool.queue.length) {
      let slot = pool.slots.find((s) => !s.job && !s.dead);
      if (!slot) {
        if (pool.slots.length >= (pool.broken ? 1 : POOL_MAX)) break;
        slot = spawnSlot();
        pool.slots.push(slot);
      }
      const job = pool.queue.shift();
      slot.job = job;
      slot.ready.then(() => job.payload()).then((payload) => {
        if (job.kind === 'ocrimg') slot.post(Object.assign({ t: 'ocrimg', id: job.id, key: job.key, page: job.pageNo }, payload));
        else slot.post(Object.assign({ t: 'index', id: job.id, failAt: PS.debug.failAt ? PS.debug.failAt(job) : 0 }, payload), payload.bytes ? [payload.bytes.buffer] : undefined);
      }).catch((err) => {
        slot.job = null;
        if (job.kind === 'ocrimg') { pool.jobs.delete(job.id); job.reject(err); }
        else finishJob(job, { failed: true, error: String((err && err.message) || err), unreadable: true });
        pump();
      });
    }
    if (!pool.queue.length && !pool.slots.some((s) => s.job)) {
      // nothing left: let the workers go after a while (they hold PDF.js in memory)
      pool.idleT = setTimeout(() => {
        if (pool.queue.length || pool.slots.some((s) => s.job)) return;
        for (const s of pool.slots) if (s.worker) { try { s.worker.terminate(); } catch (_) {} }
        pool.slots = [];
      }, 20000);
    }
  }

  /**
   * Queue one PDF for indexing.
   * job: { name, getFile(): Promise<File|Blob> | bytes(): Promise<Uint8Array>, folder?, rel?, size?, mtime?, keepBlob?, bundled?, retry? }
   * Resolves to { indexed | known | failed, doc?, error? } — never rejects.
   */
  function queueIndex(job) {
    job.id = ++pool.seq;
    job.kind = 'index';
    job.payload = () => (job.bytes ? job.bytes().then((bytes) => ({ bytes })) : job.getFile().then((file) => { job.file = file; return { file }; }));
    const p = new Promise((resolve) => { job.resolve = resolve; });
    pool.jobs.set(job.id, job);
    pool.queue.push(job);
    L.busy.total++;
    pump();
    return p;
  }

  function finishJob(job, result) {
    pool.jobs.delete(job.id);
    L.busy.done++;
    if (result.indexed) L.stats.parsed++;
    result.doc = job.doc || null;
    result.rel = job.rel || job.name;
    if (job.owns) {
      // release everyone who was waiting for this content
      const wait = inflight.get(job.hash);
      if (wait) {
        inflight.delete(job.hash);
        for (const other of wait) {
          if (L.byId.has(job.hash)) attachSource(other, job.hash).then(() => finishJob(other, { known: true }));
          else finishJob(other, { failed: true, error: result.error || 'failed' });
        }
      }
    }
    if (L.busy.done >= L.busy.total) { L.busy.done = L.busy.total = 0; changed(true); } else changed();
    job.resolve(result);
    pump();
  }

  const baseName = (p) => p.slice(p.lastIndexOf('/') + 1);

  // where a file lives: remember it on the document (a document can live in several places)
  function setSource(doc, job) {
    if (job.bundled) doc.bundled = job.bundled;
    if (job.keepBlob) doc.blob = true;
    if (job.folder) {
      const owner = pathOwner(job.folder, job.rel);
      if (owner && owner !== doc) {
        // same path, different content: a new version of the file. The old content leaves the index;
        // what the owner attached to it (notes, bookmarks) stays under the old hash and is linked to the new one.
        if (owner.status === 'ready' && doc.status === 'ready') linkVersion(owner, doc, job);
        dropPath(owner, job.folder, job.rel);
      }
      const p = doc.paths.find((x) => x.folder === job.folder && x.rel === job.rel);
      if (p) { p.size = job.size; p.mtime = job.mtime; } else doc.paths.push({ folder: job.folder, rel: job.rel, size: job.size, mtime: job.mtime });
    }
    if (job.file && !job.bundled) sessionFiles.set(doc.id, job.file);
    nameDoc(doc);
  }
  function nameDoc(doc) {
    if (doc.bundled) { doc.name = doc.bundled; doc.path = doc.bundled; doc.source = 'bundled'; return; }
    doc.source = 'user';
    const p = doc.paths[0];
    if (p) {
      const folder = folderById(p.folder);
      doc.name = baseName(p.rel);
      doc.path = (folder ? folder.name + '/' : '') + p.rel;
    } else if (doc.failedPaths.length) {
      const fp = doc.failedPaths[0], folder = folderById(fp.folder);
      doc.name = baseName(fp.rel);
      doc.path = (folder ? folder.name + '/' : '') + fp.rel;
    } else if (doc.fileName) { doc.name = doc.fileName; doc.path = doc.fileName; }
  }
  // old hash -> new hash, kept as user data (never evicted): notes on the old version can point at the new one
  const versions = (PS.versions = new Map());
  function linkVersion(oldDoc, newDoc, job) {
    const folder = folderById(job.folder);
    versions.set(oldDoc.id, { old: oldDoc.id, new: newDoc.id, path: (folder ? folder.name + '/' : '') + job.rel, name: oldDoc.name, oldPages: oldDoc.numPages, at: Date.now() });
    store.put('kv', [...versions.values()], 'versions').catch(() => {});
    if (PS.onVersion) PS.onVersion(oldDoc.id, newDoc.id);
  }
  function pathOwner(folderId, rel) {
    for (const d of L.byId.values()) if (d.paths.some((p) => p.folder === folderId && p.rel === rel)) return d;
    return null;
  }

  async function commitDoc(job, m) {
    const id = m.hash;
    let doc = L.byId.get(id);
    const fresh = !doc;
    if (fresh) doc = makeDoc({ id, name: job.name, path: job.name, size: m.size, added: Date.now() });
    else { forgetPages(doc); closePdf(doc); }
    doc.fileName = job.name;
    doc.status = 'ready'; doc.error = null; doc.size = m.size;
    doc.sha256 = m.sha256 || doc.sha256; doc.meta = m.meta || null; doc.labels = m.labels || null;
    doc.gen = fresh ? 1 : doc.gen + 1; doc.stale = null; doc.failedPaths = [];
    m.text.gen = doc.gen;
    setSource(doc, job);
    attachText(doc, m.text);
    job.doc = doc;
    const ops = [{ put: 'docs', value: docRecord(doc) }, { put: 'text', value: m.text }];
    if (!fresh) ops.push({ delPrefix: 'geom', prefix: id + ':' }, { delPrefix: 'thumbs', prefix: id + ':' });
    for (let i = 0; i < m.numPages; i++) {
      const key = PS.pageKey(id, i + 1);
      ops.push({ put: 'geom', key, value: m.geoms[i] });
      if (m.thumbs[i]) ops.push({ put: 'thumbs', key, value: m.thumbs[i] });
    }
    if (job.keepBlob && job.file) ops.push({ put: 'blobs', key: id, value: job.file });
    // one transaction: the document's new generation appears as a whole or not at all
    let saved = false;
    try { await store.batch(ops); saved = true; } catch (err) {
      // storage is short: give up regenerable data first (all thumbnails), never user data, and try once more
      try {
        await store.batch([{ clear: 'thumbs' }]);
        L.stats.thumbsEvicted = (L.stats.thumbsEvicted || 0) + 1;
        await store.batch(ops.filter((op) => op.put !== 'thumbs'));
        saved = true;
      } catch (_) { /* fall through */ }
    }
    if (!saved) {
      // the browser refused to store it at all: keep this document for the session only
      doc.unsaved = true;
      for (let i = 0; i < m.numPages; i++) volatile.set(PS.pageKey(id, i + 1), { geom: m.geoms[i], thumb: m.thumbs[i] });
      L.stats.unsaved = (L.stats.unsaved || 0) + 1;
    }
    L.byId.set(id, doc);
    L.stats.indexed++;
    if (doc.ocrLeft && PS.queueOcr) PS.queueOcr(doc);
  }

  async function attachSource(job, hash) {
    const doc = L.byId.get(hash);
    if (!doc) return;
    setSource(doc, job);
    job.doc = doc;
    const ops = [{ put: 'docs', value: docRecord(doc) }];
    if (job.keepBlob && job.file) ops.push({ put: 'blobs', key: doc.id, value: job.file });
    try { await store.batch(ops); } catch (_) {}
  }

  // a PDF that cannot be parsed (password, damage): remember it so it is not tried at every scan
  async function failedDoc(job, m) {
    if (!job.hash) return;
    let doc = L.byId.get(job.hash);
    if (doc && doc.status === 'ready' && job.retry) return; // a retry that failed leaves the working index alone
    if (!doc) doc = makeDoc({ id: job.hash, name: job.name, path: job.name, size: job.size || 0, added: Date.now() });
    doc.fileName = job.name;
    doc.status = 'error';
    doc.error = /password/i.test(m.name || m.message || '') ? 'パスワード付きPDF' : String(m.message || 'error');
    doc.pages = []; doc.numPages = 0;
    const owner = job.folder ? pathOwner(job.folder, job.rel) : null;
    if (owner && owner !== doc && owner.status === 'ready') {
      // the file at this path changed, but its new content cannot be indexed: keep serving the old version,
      // clearly marked as old, and remember the unreadable content so it is not retried at every scan
      owner.stale = { at: Date.now(), error: doc.error };
      if (!doc.failedPaths.some((p) => p.folder === job.folder && p.rel === job.rel)) doc.failedPaths.push({ folder: job.folder, rel: job.rel, size: job.size, mtime: job.mtime });
      nameDoc(doc);
      try { await store.put('docs', docRecord(owner)); } catch (_) {}
    } else setSource(doc, job);
    job.doc = doc;
    L.byId.set(doc.id, doc);
    try { await store.put('docs', docRecord(doc)); } catch (_) {}
  }

  function deleteDoc(doc) {
    forgetPages(doc);
    closePdf(doc);
    sessionFiles.delete(doc.id);
    L.byId.delete(doc.id);
    return store.batch([{ del: 'docs', key: doc.id }, { del: 'text', key: doc.id }, { del: 'blobs', key: doc.id },
      { delPrefix: 'geom', prefix: doc.id + ':' }, { delPrefix: 'thumbs', prefix: doc.id + ':' }]).catch(() => {});
  }
  // forget one location of a document; the document goes when its last location goes
  function dropPath(doc, folderId, rel) {
    doc.paths = doc.paths.filter((p) => !(p.folder === folderId && (rel == null || p.rel === rel)));
    if (!doc.paths.length && !doc.bundled && !doc.blob) return deleteDoc(doc);
    nameDoc(doc);
    return store.put('docs', docRecord(doc)).catch(() => {});
  }

  // ------------------------------------------------------------ loading the persistent index
  /** Load the index, then bring bundled PDFs and reachable folders up to date in the background. */
  PS.loadLibrary = async function () {
    const t0 = performance.now();
    L.persistent = await store.open();
    const [docs, folders, vers] = await Promise.all([store.getAll('docs'), store.getAll('folders'), store.get('kv', 'versions')]);
    L.folders = folders;
    L.persisted = store.persisted;
    L.migration = store.migration;
    for (const v of vers || []) versions.set(v.old, v);
    for (const rec of docs) L.byId.set(rec.id, makeDoc(rec));
    for (const d of L.byId.values()) nameDoc(d);
    // text in slices, so a big library does not arrive as one huge message
    let after = null;
    do {
      const { values, lastKey } = await store.page('text', after, 200);
      for (const t of values) { const d = L.byId.get(t.id); if (d && d.status !== 'error') attachText(d, t); }
      after = lastKey;
    } while (after != null);
    // a document without text is a half-written leftover: index it again when its file shows up
    for (const d of [...L.byId.values()]) if (d.status === 'ready' && !d.pages.length) L.byId.delete(d.id);
    // an unreadable leftover with no location at all says nothing
    for (const d of [...L.byId.values()]) if (d.status === 'error' && !d.paths.length && !d.failedPaths.length && !d.blob && !d.bundled) L.byId.delete(d.id);
    dirty = true; rebuild();
    L.loaded = true;
    L.stats.loadMs = Math.round(performance.now() - t0);
    L.stats.loadedDocs = L.docs.length;
    L.stats.loadedPages = L.pages.length;
    if (L.onChange) L.onChange();
    PS.loadedAt = performance.now();
    // from here on everything is background work
    return syncBundled().then(() => importLegacy()).then(() => {
      for (const d of L.byId.values()) if (d.ocrLeft && PS.queueOcr) PS.queueOcr(d);
      return resumeFolders();
    });
  };

  async function syncBundled() {
    const list = root.PS_BUNDLED_PDFS || [];
    const names = new Set(list.map((m) => m.name));
    for (const d of [...L.byId.values()]) {
      if (d.bundled && !names.has(d.bundled)) { d.bundled = null; if (!d.paths.length && !d.blob) await deleteDoc(d); }
    }
    const jobs = [];
    for (const m of list) {
      const id = m.sha256 ? m.sha256.slice(0, 32) : null;
      const have = id && L.byId.get(id);
      if (have && have.bundled === m.name) continue;
      if (have) { have.bundled = m.name; nameDoc(have); store.put('docs', docRecord(have)).catch(() => {}); continue; }
      jobs.push(queueIndex({ name: m.name, bundled: m.name, bytes: () => PS.loadAsset(m.key, 'pdfs/embedded/' + encodeURIComponent(m.name) + '.js') }));
    }
    if (jobs.length) changed(true);
    await Promise.all(jobs);
    changed(true);
  }

  async function importLegacy() {
    const files = await store.takeLegacy();
    if (!files.length) return;
    await PS.addFiles(files);
    store.dropLegacy();
  }

  // ------------------------------------------------------------ adding PDFs and folders
  const isPdf = (f) => /\.pdf$/i.test(f.name) || f.type === 'application/pdf';

  /** Add loose PDF files (picker or drop). They are copied into the browser's storage. Resolves to the number added. */
  PS.addFiles = async function (files) {
    const pdfs = [...files].filter(isPdf);
    if (!pdfs.length) return 0;
    const results = await Promise.all(pdfs.map((f) => queueIndex({ name: f.name, getFile: () => Promise.resolve(f), keepBlob: true, size: f.size, mtime: f.lastModified })));
    changed(true);
    return results.filter((r) => !r.failed).length;
  };

  const newId = () => 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const saveFolder = (folder) => store.put('folders', folder).catch(() => {});

  /**
   * Add (or re-scan) a folder through a directory handle (File System Access: picker or drop in Chrome / Edge).
   * The handle is kept, so later re-scans need no new selection — only the browser's permission click.
   */
  PS.addFolderHandle = async function (handle) {
    let folder = null;
    for (const f of L.folders) {
      if (f.handle) { try { if (await f.handle.isSameEntry(handle)) { folder = f; break; } } catch (_) {} }
    }
    if (!folder) folder = L.folders.find((f) => !f.handle && f.name === handle.name) || null;
    if (!folder) { folder = { id: newId(), name: handle.name, kind: 'handle', added: Date.now(), state: 'new', last: null }; L.folders.push(folder); }
    folder.handle = handle;
    folder.kind = 'handle';
    await saveFolder(folder);
    return scanFolder(folder, null);
  };

  /**
   * Add (or re-scan) a folder from a list of File objects (<input webkitdirectory>, or a drop without handles).
   * Each file needs .relPath or .webkitRelativePath ("folder/sub/file.pdf"). The browser gives no lasting access
   * this way: the index persists, but to re-scan or to draw sharp pages after a restart the folder is selected again.
   */
  PS.addFolderFiles = async function (files, name) {
    const list = [...files].filter(isPdf);
    const top = name || ((list[0] && (list[0].relPath || list[0].webkitRelativePath || '')).split('/')[0]) || 'folder';
    let folder = L.folders.find((f) => f.name === top) || null;
    if (!folder) { folder = { id: newId(), name: top, kind: 'files', added: Date.now(), state: 'new', last: null }; L.folders.push(folder); }
    await saveFolder(folder);
    const entries = list.map((f) => {
      const full = f.relPath || f.webkitRelativePath || f.name;
      const rel = full.startsWith(top + '/') ? full.slice(top.length + 1) : full;
      return { rel, size: f.size, mtime: f.lastModified, file: f };
    });
    return scanFolder(folder, entries);
  };

  async function walk(dir, prefix, out) {
    for await (const [name, child] of dir.entries()) {
      if (name.startsWith('.')) continue;
      if (child.kind === 'directory') await walk(child, prefix + name + '/', out);
      else if (/\.pdf$/i.test(name)) {
        try { const file = await child.getFile(); out.push({ rel: prefix + name, size: file.size, mtime: file.lastModified, file }); } catch (_) {}
      }
    }
    return out;
  }

  const scans = new Map(); // folder.id -> running scan promise
  /**
   * Bring the index in line with the folder: index new and changed files (size + mtime, then content hash),
   * keep unchanged ones untouched, follow moved / renamed ones without re-reading them, drop removed ones.
   * Resolves to { total, unchanged, indexed, moved, removed, failed, ms }.
   */
  function scanFolder(folder, entries) {
    if (scans.has(folder.id)) return scans.get(folder.id);
    const run = (async () => {
      const t0 = performance.now();
      folder.state = 'scanning';
      await saveFolder(folder);
      changed(true);
      if (!entries) entries = await walk(folder.handle, '', []);
      const known = new Map();
      for (const d of L.byId.values()) for (const p of d.paths) if (p.folder === folder.id) known.set(p.rel, { doc: d, p });
      // content that could not be indexed last time (same size + mtime): not tried again
      const failedAt = new Map();
      for (const d of L.byId.values()) for (const p of d.failedPaths) if (p.folder === folder.id) failedAt.set(p.rel, { doc: d, p });
      const seen = new Set();
      const jobs = [];
      let unchanged = 0;
      for (const e of entries) {
        seen.add(e.rel);
        const k = known.get(e.rel);
        const fp = failedAt.get(e.rel);
        if (fp && fp.p.size === e.size && fp.p.mtime === e.mtime) { unchanged++; continue; }
        if (fp) { fp.doc.failedPaths = fp.doc.failedPaths.filter((p) => p !== fp.p); if (!fp.doc.failedPaths.length && !fp.doc.paths.length) deleteDoc(fp.doc); }
        if (k && k.p.size === e.size && k.p.mtime === e.mtime && k.doc.status !== 'pending') {
          unchanged++;
          if (!folder.handle) sessionFiles.set(k.doc.id, e.file);
          continue;
        }
        jobs.push(queueIndex({ name: baseName(e.rel), folder: folder.id, rel: e.rel, size: e.size, mtime: e.mtime, getFile: () => Promise.resolve(e.file), keepHandleFile: !!folder.handle }));
      }
      folder.progress = { total: entries.length, todo: jobs.length };
      changed(true);
      const results = await Promise.all(jobs);
      // files that could not even be read (no hash): listed in the coverage ledger, tried again next scan
      folder.unreadable = results.filter((r) => r.failed && r.unreadable).map((r) => ({ rel: r.rel, error: r.error }));
      for (const [rel, fp] of failedAt) if (!seen.has(rel)) { fp.doc.failedPaths = fp.doc.failedPaths.filter((p) => p !== fp.p); if (!fp.doc.failedPaths.length && !fp.doc.paths.length) deleteDoc(fp.doc); }
      // only now forget files that are gone: a moved file was re-attached to its new place first
      let removed = 0;
      for (const [rel, k] of known) {
        if (seen.has(rel)) continue;
        if (!k.doc.paths.some((p) => p.folder === folder.id && p.rel === rel)) continue;
        const gone = k.doc.paths.length === 1 && !k.doc.bundled && !k.doc.blob;
        await dropPath(k.doc, folder.id, rel);
        if (gone) removed++;
      }
      const stats = {
        total: entries.length, unchanged,
        indexed: results.filter((r) => r.indexed).length,
        moved: results.filter((r) => r.known).length,
        failed: results.filter((r) => r.failed).length,
        removed, ms: Math.round(performance.now() - t0), at: Date.now(),
      };
      folder.state = 'done';
      folder.last = stats;
      folder.progress = null;
      folder.count = entries.length;
      await saveFolder(folder);
      changed(true);
      return stats;
    })().finally(() => scans.delete(folder.id));
    scans.set(folder.id, run);
    return run;
  }

  /** Re-scan a folder. With a kept handle this may show the browser's permission prompt (call from a click). */
  PS.rescanFolder = async function (folder) {
    if (!folder.handle) return null; // no lasting access: the screen asks the user to pick the folder again
    let perm = await folder.handle.queryPermission({ mode: 'read' });
    if (perm !== 'granted') perm = await folder.handle.requestPermission({ mode: 'read' });
    if (perm !== 'granted') return null;
    const stats = await scanFolder(folder, null);
    for (const d of L.byId.values()) if (d.ocrLeft && PS.queueOcr) PS.queueOcr(d);
    return stats;
  };

  // after a restart: folders whose permission is still valid are re-scanned silently (picks up new files and
  // continues an interrupted run); the others wait for the user (see PS.pendingFolders)
  async function resumeFolders() {
    for (const folder of L.folders) {
      if (!folder.handle) continue;
      try { if ((await folder.handle.queryPermission({ mode: 'read' })) === 'granted') scanFolder(folder, null); } catch (_) {}
    }
    changed(true);
  }
  /** Folders whose last scan did not finish (tab closed while indexing). */
  PS.pendingFolders = () => L.folders.filter((f) => f.state === 'scanning' && !scans.has(f.id));
  PS.scanning = () => scans.size > 0;

  PS.removeFolder = async function (folder) {
    for (const d of [...L.byId.values()]) if (d.paths.some((p) => p.folder === folder.id)) await dropPath(d, folder.id, null);
    L.folders = L.folders.filter((f) => f !== folder);
    await store.del('folders', folder.id).catch(() => {});
    changed(true);
  };

  /** Remove everything the user added (folders and single PDFs). Bundled PDFs stay. */
  PS.removeUserDocs = async function () {
    for (const f of [...L.folders]) await PS.removeFolder(f);
    for (const d of [...L.byId.values()]) {
      if (d.bundled) { if (d.blob) { d.blob = false; store.batch([{ del: 'blobs', key: d.id }, { put: 'docs', value: docRecord(d) }]).catch(() => {}); } continue; }
      await deleteDoc(d);
    }
    changed(true);
  };

  // ------------------------------------------------------------ coverage ledger (A2)
  /**
   * What was actually searchable. Every PDF the app has seen is in exactly one document state:
   *   ok | ocr-wait (some pages still wait for OCR) | ocr-low (OCR done but doubtful) | suspect (text layer looks broken)
   *   | indexing | password | damaged | unreadable (file could not be read) | stale (old version served: new one failed)
   * plus page counts: searchable, waiting for OCR, doubtful, not searchable.
   */
  PS.ledger = function () {
    rebuild();
    const items = [];
    const pages = { total: 0, searchable: 0, ocrWait: 0, doubtful: 0, unreadableDocs: 0 };
    for (const d of L.docs) {
      let state = 'ok', wait = 0, low = 0, sus = 0;
      if (d.status === 'error') state = /パスワード|password/i.test(d.error || '') ? 'password' : 'damaged';
      else {
        for (const p of d.pages) {
          pages.total++;
          if (p.ocr === 1) { wait++; pages.ocrWait++; } else pages.searchable++;
          if (p.ocr === 2 && (p.conf < 60 || p.doubt)) { low++; pages.doubtful++; }
          else if (p.ocr === 3 || (p.ocr === 0 && p.doubt)) { sus++; pages.doubtful++; }
        }
        if (d.stale) state = 'stale';
        else if (wait) state = 'ocr-wait';
        else if (low) state = 'ocr-low';
        else if (sus) state = 'suspect';
      }
      if (state === 'password' || state === 'damaged') pages.unreadableDocs++;
      items.push({ doc: d, state, name: d.name, path: d.path, pages: d.numPages, wait, low, sus, error: d.error || (d.stale && d.stale.error) || null });
    }
    for (const f of L.folders) for (const u of f.unreadable || []) { pages.unreadableDocs++; items.push({ doc: null, folder: f, state: 'unreadable', name: baseName(u.rel), path: f.name + '/' + u.rel, pages: 0, error: u.error }); }
    for (const job of pool.jobs.values()) if (job.kind === 'index') items.push({ doc: null, state: 'indexing', name: job.name, path: job.rel || job.name, pages: 0 });
    const counts = {};
    for (const it of items) counts[it.state] = (counts[it.state] || 0) + 1;
    return { items, pages, counts, complete: !pages.ocrWait && !pages.unreadableDocs && !counts.indexing && !counts.stale };
  };

  /** Index one document again from its file (ledger "retry"). Resolves to the job result. */
  PS.reindexDoc = async function (doc) {
    const loc = doc.paths[0] || doc.failedPaths[0] || null;
    const bytes = await docBytes(Object.assign({}, doc, { paths: doc.paths.length ? doc.paths : doc.failedPaths }));
    const job = { name: doc.name, bytes: () => Promise.resolve(bytes), retry: true, keepBlob: false, bundled: doc.bundled || undefined };
    if (loc) Object.assign(job, { folder: loc.folder, rel: loc.rel, size: loc.size, mtime: loc.mtime });
    return queueIndex(job);
  };

  /** Numbers for the report / benchmarks. */
  PS.measure_ = async function () {
    let chars = 0;
    for (const p of L.pages) chars += p.text.length;
    const est = await store.estimate();
    const mem = performance.memory ? { usedJSHeap: performance.memory.usedJSHeapSize, totalJSHeap: performance.memory.totalJSHeapSize } : null;
    return { docs: L.docs.length, pages: L.pages.length, chars, storage: est, memory: mem, stats: L.stats, indexMode: PS.indexMode, workers: POOL_MAX };
  };

  PS._queueIndex = queueIndex;
  PS._indexWorkerUrl = indexWorkerUrl;
  /** Answer a worker's request for a CMap / standard font (shared by the index pool and the OCR renderer). */
  PS._serveAsk = function (post, m) {
    const done = (d) => post({ t: 'answer', rid: m.rid, data: d }, d && d.buffer ? [d.buffer] : []);
    const fail = (e) => post({ t: 'answer', rid: m.rid, error: String(e) });
    if (m.kind === 'cmap') cmapBytes(m.arg).then(done, fail);
    else if (m.kind === 'font') fontBytes(m.arg).then(done, fail);
    else fail('unknown request');
  };
  PS._pool = pool;
  PS._docRecord = docRecord;
  PS._changed = changed;
  PS._volatile = volatile;
  PS._geomCache = geomCache;

  // ------------------------------------------------------------ rendering
  /**
   * Paint a region of a page into a fresh canvas.
   * opts: { scale (device px per page px), x, y (region origin, page px), width, height (device px) }
   * Returns { promise, cancel }.
   */
  PS.renderPage = function (page, opts) {
    let task = null, cancelled = false;
    const promise = PS.withPdf(page.doc, async (pdf) => {
      const p = await pdf.getPage(page.no);
      if (cancelled) throw new Error('cancelled');
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(opts.width));
      canvas.height = Math.max(1, Math.round(opts.height));
      const viewport = p.getViewport({ scale: opts.scale, offsetX: -(opts.x || 0) * opts.scale, offsetY: -(opts.y || 0) * opts.scale });
      task = p.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport, background: '#ffffff' });
      await task.promise;
      return canvas;
    });
    return { promise, cancel() { cancelled = true; if (task) task.cancel(); } };
  };
})(window);
