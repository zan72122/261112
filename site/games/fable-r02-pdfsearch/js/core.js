/*
 * core.js — everything between the files on disk and the search engine:
 *   - loading binaries through <script> tags (the only thing file:// allows)
 *   - starting PDF.js (real Worker from a Blob, main-thread fallback)
 *   - the library: bundled PDFs + PDFs the user adds (kept in IndexedDB)
 *   - text extraction into searchable pages
 * No network access anywhere in this file.
 */
(function (root) {
  'use strict';
  const PS = (root.PS = root.PS || {});
  const EMB = 'vendor/pdfjs-embedded/';

  // ------------------------------------------------------------ script-tag assets
  const arrived = new Map();
  const loading = new Map();
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

  function decodeBase64(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /** Bytes of an embedded binary (see tools/build-embedded.mjs). */
  PS.loadAsset = function (key, url) {
    let p = loading.get(key);
    if (!p) {
      p = loadScript(url).then(() => {
        const b64 = arrived.get(key);
        arrived.delete(key);
        loading.delete(key);
        if (b64 == null) throw new Error('埋め込みデータがありません: ' + key);
        return decodeBase64(b64);
      }, (err) => { loading.delete(key); throw err; });
      loading.set(key, p);
    }
    return p.then((bytes) => bytes.slice());
  };

  // ------------------------------------------------------------ PDF.js
  let lib = null, pdfWorker = null, pdfReady = null;
  PS.workerMode = 'none';

  function startBlobWorker() {
    return loadScript(EMB + 'worker-source.js').then(() => new Promise((resolve, reject) => {
      const src = root.PS_PDF_WORKER_SOURCE;
      root.PS_PDF_WORKER_SOURCE = null;
      if (!src || typeof Worker === 'undefined') return reject(new Error('no worker'));
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
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
  class CMapFactory {
    async fetch({ name }) {
      const cMapData = await PS.loadAsset(`cmaps/${name}.bcmap`, `${EMB}cmaps/${name}.bcmap.js`);
      return { cMapData, compressionType: lib.CMapCompressionType.BINARY };
    }
  }
  class FontFactory {
    async fetch({ filename }) {
      return PS.loadAsset(`standard_fonts/${filename}`, `${EMB}standard_fonts/${filename}.js`);
    }
  }

  // Open documents are few (LRU); everything else is reopened from bytes on demand.
  const MAX_OPEN = 6;
  const open = new Map(); // doc.id -> { promise, refs, used }
  let tick = 0;

  function openPdf(doc) {
    let slot = open.get(doc.id);
    if (!slot) {
      slot = { refs: 0, used: 0, promise: null };
      slot.promise = PS.initPdf().then(() => doc.getBytes()).then((data) => lib.getDocument({
        data,
        worker: pdfWorker,
        CMapReaderFactory: CMapFactory,
        StandardFontDataFactory: FontFactory,
        cMapUrl: EMB + 'cmaps/',
        cMapPacked: true,
        standardFontDataUrl: EMB + 'standard_fonts/',
        useWorkerFetch: false,
        isEvalSupported: false,
        enableXfa: false,
        disableAutoFetch: true,
        disableStream: true,
        disableRange: true,
      }).promise);
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

  // ------------------------------------------------------------ text extraction
  function extractRaw(tc, vp) {
    const items = [];
    for (const it of tc.items) {
      if (typeof it.str !== 'string') continue;
      const tx = lib.Util.transform(vp.transform, it.transform);
      const ang = Math.atan2(tx[1], tx[0]);
      const fh = Math.hypot(tx[2], tx[3]) || Math.abs(it.height) || 1;
      const style = tc.styles[it.fontName] || {};
      let asc = style.ascent ? style.ascent : style.descent ? 1 + style.descent : 0.86;
      let desc = style.descent ? -style.descent : 0.16;
      asc = Math.min(1.1, Math.max(0.6, asc));
      desc = Math.min(0.4, Math.max(0.08, desc));
      items.push({
        str: it.str,
        fam: style.fontFamily || 'sans-serif',
        x: tx[4], y: tx[5],
        ux: Math.cos(ang), uy: Math.sin(ang),
        len: (style.vertical ? it.height : it.width) * vp.scale,
        fs: fh,
        up: asc * fh, dn: desc * fh,
        eol: it.hasEOL ? 1 : 0,
      });
    }
    return { w: vp.width, h: vp.height, items };
  }

  function attachPages(doc, raws) {
    doc.pages = raws.map((raw, i) => {
      const page = PS.buildPage(raw);
      page.doc = doc;
      page.no = i + 1;
      page.key = doc.id + '#' + (i + 1);
      return page;
    });
    doc.numPages = doc.pages.length;
  }

  async function indexDoc(doc, onPage) {
    const raws = await PS.withPdf(doc, async (pdf) => {
      const out = [];
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const vp = page.getViewport({ scale: 1 });
        const tc = await page.getTextContent();
        out.push(extractRaw(tc, vp));
        page.cleanup();
        if (onPage) onPage(n, pdf.numPages);
      }
      return out;
    });
    attachPages(doc, raws);
    return raws;
  }

  // ------------------------------------------------------------ IndexedDB (user-added PDFs)
  let dbPromise = null;
  function db() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        let req;
        try { req = indexedDB.open('pdf-cross-search', 1); } catch (e) { return reject(e); }
        req.onupgradeneeded = () => {
          req.result.createObjectStore('meta', { keyPath: 'id' });
          req.result.createObjectStore('blobs');
          req.result.createObjectStore('index');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(new Error('blocked'));
      });
      dbPromise.catch(() => {});
    }
    return dbPromise;
  }
  function tx(stores, mode, fn) {
    return db().then((d) => new Promise((resolve, reject) => {
      const t = d.transaction(stores, mode);
      let result;
      t.oncomplete = () => resolve(result);
      t.onerror = t.onabort = () => reject(t.error || new Error('IndexedDB'));
      result = fn(t);
    }));
  }
  const reqP = (req) => new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });

  // ------------------------------------------------------------ library
  const lib_ = (PS.library = {
    docs: [],
    pages: [], // all indexed pages, in library order
    busy: { done: 0, total: 0 },
    persistent: true,
    onChange: null,
  });

  function changed() {
    lib_.pages = [];
    for (const d of lib_.docs) if (d.pages) for (const p of d.pages) lib_.pages.push(p);
    if (lib_.onChange) lib_.onChange();
  }

  const byName = (a, b) => (a.source === b.source ? a.name.localeCompare(b.name, 'ja') : a.source === 'bundled' ? -1 : 1);

  function addDoc(doc) {
    lib_.docs.push(doc);
    lib_.docs.sort(byName);
  }

  async function runIndex(doc, cachedRaw) {
    lib_.busy.total++;
    try {
      if (cachedRaw) attachPages(doc, cachedRaw);
      else {
        const raws = await indexDoc(doc);
        if (doc.source === 'user' && lib_.persistent) {
          tx(['index', 'meta'], 'readwrite', (t) => {
            t.objectStore('index').put(raws, doc.id);
            t.objectStore('meta').put({ id: doc.id, name: doc.name, size: doc.size, mtime: doc.mtime });
          }).catch(() => {});
        }
      }
      doc.status = 'ready';
    } catch (err) {
      doc.status = 'error';
      doc.error = String((err && err.message) || err);
      doc.pages = [];
      doc.numPages = 0;
    }
    lib_.busy.done++;
    if (lib_.busy.done >= lib_.busy.total) lib_.busy.done = lib_.busy.total = 0;
    changed();
  }

  /** Load bundled PDFs and whatever the user added earlier. */
  PS.loadLibrary = async function () {
    await PS.initPdf();
    const jobs = [];
    for (const m of root.PS_BUNDLED_PDFS || []) {
      const doc = {
        id: 'b:' + m.name, name: m.name, source: 'bundled', size: m.size, mtime: m.mtime, status: 'pending', pages: null, numPages: 0,
        getBytes: () => PS.loadAsset(m.key, 'pdfs/embedded/' + encodeURIComponent(m.name) + '.js'),
      };
      addDoc(doc);
      jobs.push(() => runIndex(doc));
    }
    try {
      const [metas, keys, idx] = await tx(['meta', 'index'], 'readonly', (t) => Promise.all([
        reqP(t.objectStore('meta').getAll()),
        reqP(t.objectStore('index').getAllKeys()),
        reqP(t.objectStore('index').getAll()),
      ]));
      const cache = new Map(keys.map((k, i) => [k, idx[i]]));
      for (const m of metas) {
        const doc = userDoc(m, null);
        addDoc(doc);
        jobs.push(() => runIndex(doc, cache.get(m.id)));
      }
    } catch (_) {
      lib_.persistent = false; // private mode etc.: user PDFs live for this session only
    }
    changed();
    for (const job of jobs) await job();
  };

  function userDoc(meta, file) {
    return {
      id: meta.id, name: meta.name, source: 'user', size: meta.size, mtime: meta.mtime, status: 'pending', pages: null, numPages: 0,
      getBytes: async () => {
        const blob = file || await tx(['blobs'], 'readonly', (t) => reqP(t.objectStore('blobs').get(meta.id)));
        if (!blob) throw new Error('保存データが見つかりません');
        return new Uint8Array(await blob.arrayBuffer());
      },
    };
  }

  /** Add local PDF files (File objects from a picker, a folder picker or a drop). */
  PS.addFiles = async function (files) {
    const pdfs = [...files].filter((f) => /\.pdf$/i.test(f.name) || f.type === 'application/pdf');
    const added = [];
    for (const f of pdfs) {
      const name = f.webkitRelativePath || f.relPath || f.name;
      const meta = { id: `u:${name}:${f.size}:${f.lastModified}`, name, size: f.size, mtime: f.lastModified };
      if (lib_.docs.some((d) => d.id === meta.id)) continue;
      let keep = null;
      if (lib_.persistent) {
        try {
          await tx(['blobs', 'meta'], 'readwrite', (t) => {
            t.objectStore('blobs').put(f, meta.id);
            t.objectStore('meta').put(meta);
          });
        } catch (_) { keep = f; } // quota etc.: keep this one in memory only
      } else keep = f;
      const doc = userDoc(meta, keep);
      addDoc(doc);
      added.push(doc);
    }
    changed();
    for (const doc of added) await runIndex(doc);
    return added.length;
  };

  PS.removeUserDocs = async function () {
    for (const d of lib_.docs) if (d.source === 'user') closePdf(d);
    lib_.docs = lib_.docs.filter((d) => d.source !== 'user');
    changed();
    try {
      await tx(['meta', 'blobs', 'index'], 'readwrite', (t) => {
        t.objectStore('meta').clear(); t.objectStore('blobs').clear(); t.objectStore('index').clear();
      });
    } catch (_) {}
  };

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
