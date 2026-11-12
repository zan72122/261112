/*
 * indexer.js — the code that runs in the background workers. No network.
 *
 * Nothing in this file executes on the page by itself: it only defines two functions
 * whose source text core.js turns into Blob workers (a file:// page cannot start a
 * Worker from a file, and a Blob worker cannot importScripts() a file).
 *
 *   PS_INDEX_WORKER  PDF bytes -> content hash, searchable text + positions, signatures,
 *                    page thumbnails; and page images for OCR. Runs PDF.js (display + core)
 *                    entirely inside the worker, drawing on OffscreenCanvas.
 *   PS_OCR_WORKER    page image -> words with boxes and confidence (Tesseract, WebAssembly).
 *
 * PS_INDEX_WORKER(host) can also run on the page itself (host = a fake port) as a
 * fallback for browsers that refuse Blob workers.
 */
function PS_INDEX_WORKER(host) {
  'use strict';
  const G = typeof self !== 'undefined' ? self : window;
  const inWorker = !host;
  const lib = G.pdfjsLib, PS = G.PS;
  const post = host ? (m, t) => host.postMessage(m, t) : (m, t) => G.postMessage(m, t || []);
  const THUMB_W = 208;       // px width of the stored page thumbnail
  const OCR_LONG_SIDE = 2400; // px of the page image handed to OCR

  // ---- fonts: stand-ins for Japanese fonts a PDF names but does not embed (same as on the page)
  if (inWorker && G.FontFace) {
    const Native = G.FontFace;
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
      return new Native(family, src, desc);
    };
    Patched.prototype = Native.prototype;
    G.FontFace = Patched;
  }

  // ---- questions to the page (CMaps and standard fonts live in <script> files only the page can load)
  const waiting = new Map();
  let askSeq = 0;
  function ask(kind, arg) {
    return new Promise((resolve, reject) => {
      const rid = ++askSeq;
      waiting.set(rid, { resolve, reject });
      post({ t: 'ask', rid, kind, arg });
    });
  }
  class CMapFactory {
    async fetch({ name }) {
      const cMapData = await ask('cmap', name);
      return { cMapData, compressionType: lib.CMapCompressionType.BINARY };
    }
  }
  class FontFactory {
    async fetch({ filename }) { return ask('font', filename); }
  }

  const hasOffscreen = typeof OffscreenCanvas !== 'undefined';
  const makeCanvas = (w, h) => {
    w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
    if (hasOffscreen) return new OffscreenCanvas(w, h);
    const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
  };
  const toBlob = (canvas, type, quality) => (canvas.convertToBlob
    ? canvas.convertToBlob({ type, quality })
    : new Promise((resolve) => canvas.toBlob(resolve, type, quality)));
  const canvasFactory = {
    create(w, h) { const canvas = makeCanvas(w, h); return { canvas, context: canvas.getContext('2d') }; },
    reset(cc, w, h) { cc.canvas.width = w; cc.canvas.height = h; },
    destroy(cc) { if (cc.canvas) { cc.canvas.width = 0; cc.canvas.height = 0; } cc.canvas = null; cc.context = null; },
  };
  const filterFactory = { addFilter() { return 'none'; }, addHCMFilter() { return 'none'; }, addHighlightHCMFilter() { return 'none'; }, destroy() {} };

  function openPdf(data) {
    const params = {
      data,
      CMapReaderFactory: CMapFactory,
      StandardFontDataFactory: FontFactory,
      useWorkerFetch: false,
      isEvalSupported: false,
      enableXfa: false,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
      verbosity: 0,
    };
    if (inWorker) {
      params.canvasFactory = canvasFactory;
      params.filterFactory = filterFactory;
      params.ownerDocument = { fonts: G.fonts, createElement: (n) => { if (n === 'canvas') return makeCanvas(1, 1); throw new Error('no DOM in worker: ' + n); } };
    } else Object.assign(params, host.pdfParams());
    return lib.getDocument(params).promise;
  }

  async function hashBytes(buf) {
    try {
      if (G.crypto && G.crypto.subtle) {
        const d = new Uint8Array(await G.crypto.subtle.digest('SHA-256', buf));
        let s = '';
        for (let i = 0; i < d.length; i++) s += d[i].toString(16).padStart(2, '0');
        return s; // full SHA-256; the document id is its first 32 hex chars
      }
    } catch (_) { /* fall through */ }
    // no WebCrypto (very old browser): 2 x 32-bit FNV-1a over the bytes + the length
    const u = new Uint8Array(buf);
    let a = 0x811c9dc5, b = 0x01000193;
    for (let i = 0; i < u.length; i++) { a = Math.imul(a ^ u[i], 0x01000193); b = Math.imul(b + u[i], 0x85ebca6b) ^ (b >>> 13); }
    return 'x' + (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0') + u.length.toString(16).padStart(12, '0');
  }

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

  // share of pixels that stand out from the page background: tells a blank page from a scanned one.
  // Relative to the page's own average brightness, so a faint, low-contrast scan still counts as "something is there".
  function inkShare(ctx, w, h) {
    const d = ctx.getImageData(0, 0, w, h).data;
    const n = w * h;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2];
    const mean = sum / n;
    let ink = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] < mean - 24) ink++;
    return ink / n;
  }

  let thumbType = 'image/webp';
  async function encodeThumb(canvas) {
    let blob = await toBlob(canvas, thumbType, 0.45);
    if (blob && thumbType === 'image/webp' && blob.type !== 'image/webp') { thumbType = 'image/jpeg'; blob = await toBlob(canvas, thumbType, 0.6); }
    return blob ? { type: blob.type, data: await blob.arrayBuffer() } : null;
  }

  // Citation fields, only from what the file itself states (Info dictionary, XMP, a DOI printed on the first pages).
  // Nothing is guessed: the file's creation date is not a publication year, so it is not used.
  async function readMeta(pdf, headText) {
    const out = { title: '', authors: '', year: '', journal: '', doi: '', src: {} };
    const set = (k, v, src) => { v = String(v || '').replace(/\s+/g, ' ').trim(); if (v && !out[k]) { out[k] = v.slice(0, 400); out.src[k] = src; } };
    const DOI = /\b10\.\d{4,9}\/[^\s"<>]*[^\s"<>.,;)\]]/;
    try {
      const md = await pdf.getMetadata();
      const x = md.metadata;
      const xg = (name) => { try { const v = x ? x.get(name) : null; return Array.isArray(v) ? v.filter(Boolean).join('; ') : v || ''; } catch (_) { return ''; } };
      set('title', xg('dc:title'), 'xmp');
      set('authors', xg('dc:creator'), 'xmp');
      set('journal', xg('prism:publicationname') || xg('prism:publicationName'), 'xmp');
      const xdoi = DOI.exec(xg('prism:doi') || xg('dc:identifier') || '');
      if (xdoi) set('doi', xdoi[0], 'xmp');
      const date = xg('prism:coverdate') || xg('prism:coverDate') || xg('prism:publicationdate') || xg('prism:publicationDate') || xg('dc:date');
      const y = /\b(1[89]|20)\d\d\b/.exec(date || '');
      if (y) set('year', y[0], 'xmp');
      const info = md.info || {};
      const junk = /^(untitled|unspecified|anonymous|unknown)$|\.(docx?|pptx?|xlsx?|indd|tex|dvi|qxd)$|^microsoft word/i;
      if (info.Title && !junk.test(String(info.Title).trim())) set('title', info.Title, 'info');
      if (info.Author && !junk.test(String(info.Author).trim())) set('authors', info.Author, 'info');
    } catch (_) { /* no metadata */ }
    const t = DOI.exec(headText || '');
    if (t) set('doi', t[0], 'text');
    return out;
  }

  /** PDF -> everything the index keeps for it. */
  async function indexJob(m) {
    const buf = m.bytes ? (m.bytes.buffer || m.bytes) : await m.file.arrayBuffer();
    const size = buf.byteLength;
    const sha256 = await hashBytes(buf);
    const hash = sha256.slice(0, 32);
    // the page knows whether this content is already indexed (moved / renamed / touched file)
    const go = await ask('hash', { id: m.id, hash });
    if (!go) { post({ t: 'skip', id: m.id, hash, size }); return; }
    const pdf = await openPdf(new Uint8Array(buf));
    try {
      const n = pdf.numPages;
      const texts = new Array(n), geoms = new Array(n), thumbs = new Array(n);
      const fls = [], les = [];
      const w = new Float32Array(n), h = new Float32Array(n), lc = new Uint32Array(n), sl = new Uint16Array(n), ocr = new Uint8Array(n), doubt = new Uint8Array(n);
      const transfer = [];
      let flLen = 0, leLen = 0, sigLen = 0, lastProg = 0;
      let headText = '';
      for (let no = 1; no <= n; no++) {
        if (m.failAt && no === m.failAt) throw new Error('injected failure at page ' + no); // test hook (A1: atomic updates)
        const page = await pdf.getPage(no);
        const vp = page.getViewport({ scale: 1 });
        let raw;
        try { raw = extractRaw(await page.getTextContent(), vp); } catch (_) { raw = { w: vp.width, h: vp.height, items: [] }; }
        if (no <= 2) headText += raw.items.map((it) => it.str).join(' ') + '\n';
        const built = PS.buildPage(raw);
        const i = no - 1;
        texts[i] = built.text; fls.push(built.fl); les.push(built.le);
        w[i] = raw.w; h[i] = raw.h; lc[i] = built.le.length; sl[i] = PS.sigBytes(built.text.length);
        flLen += built.fl.length; leLen += built.le.length; sigLen += sl[i];
        const packed = PS.packRaw(raw);
        geoms[i] = packed;
        transfer.push(packed.fi.buffer, packed.g.buffer, packed.eol.buffer);
        // thumbnail
        let ink = 0;
        try {
          const scale = Math.min(THUMB_W / vp.width, 360 / vp.height);
          const tv = page.getViewport({ scale });
          const canvas = makeCanvas(tv.width, tv.height);
          const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
          await page.render({ canvasContext: ctx, viewport: tv, background: '#ffffff' }).promise;
          if (built.text.length < 16) ink = inkShare(ctx, canvas.width, canvas.height);
          const th = await encodeThumb(canvas);
          canvas.width = canvas.height = 0;
          if (th) { thumbs[i] = th; transfer.push(th.data); }
        } catch (_) { thumbs[i] = null; }
        // (almost) no text but something is drawn: an image-only page -> queue for OCR
        ocr[i] = built.text.length < 16 && ink > 0.002 ? 1 : 0;
        // a text layer made of replacement / private-use / control chars is not really searchable: flag it
        if (!ocr[i] && built.text.length >= 30) {
          let odd = 0;
          for (let k = 0; k < built.text.length; k++) { const c = built.text.charCodeAt(k); if (c === 0xfffd || (c >= 0xe000 && c <= 0xf8ff) || c < 32) odd++; }
          if (odd / built.text.length > 0.2) doubt[i] = 4;
        }
        page.cleanup();
        const now = Date.now();
        if (now - lastProg > 400) { lastProg = now; post({ t: 'prog', id: m.id, page: no, of: n }); }
      }
      const fl = new Uint8Array(flLen), le = new Uint32Array(leLen), sig = new Uint8Array(sigLen);
      let a = 0, b = 0, c = 0;
      for (let i = 0; i < n; i++) {
        fl.set(fls[i], a); a += fls[i].length;
        le.set(les[i], b); b += les[i].length;
        PS.makeSig(texts[i], sig, c, sl[i]); c += sl[i];
      }
      const text = { id: hash, n, w, h, texts, fl, le, lc, sl, sig, ocr, conf: new Uint8Array(n), doubt, pg: new Uint16Array(n).fill(1) };
      transfer.push(w.buffer, h.buffer, fl.buffer, le.buffer, lc.buffer, sl.buffer, sig.buffer, ocr.buffer, text.conf.buffer);
      const meta = await readMeta(pdf, headText);
      let labels = null;
      try { labels = await pdf.getPageLabels(); } catch (_) {}
      post({ t: 'doc', id: m.id, hash, sha256, size, numPages: n, text, geoms, thumbs, meta, labels: Array.isArray(labels) && labels.length === n ? labels : null }, transfer);
    } finally {
      try { await pdf.destroy(); } catch (_) {}
    }
  }

  // one document stays open between consecutive OCR page requests
  let ocrDoc = null;
  async function ocrImageJob(m) {
    if (!ocrDoc || ocrDoc.key !== m.key) {
      if (ocrDoc) { try { await ocrDoc.pdf.destroy(); } catch (_) {} ocrDoc = null; }
      const buf = m.bytes ? (m.bytes.buffer || m.bytes) : await m.file.arrayBuffer();
      ocrDoc = { key: m.key, pdf: await openPdf(new Uint8Array(buf)) };
    }
    const page = await ocrDoc.pdf.getPage(m.page);
    const vp1 = page.getViewport({ scale: 1 });
    const scale = Math.min(6, Math.max(1, (m.longSide || OCR_LONG_SIDE) / Math.max(vp1.width, vp1.height)));
    // m.rotate: extra clockwise rotation (90 / 180 / 270) for pages scanned sideways
    const vp = page.getViewport({ scale, rotation: (page.rotate + (m.rotate || 0)) % 360 });
    const canvas = makeCanvas(vp.width, vp.height);
    await page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport: vp, background: '#ffffff' }).promise;
    const blob = await toBlob(canvas, 'image/png');
    const png = await blob.arrayBuffer();
    const out = { t: 'img', id: m.id, png, w: canvas.width, h: canvas.height, pw: vp1.width, ph: vp1.height };
    canvas.width = canvas.height = 0;
    page.cleanup();
    post(out, [png]);
  }

  function handle(m) {
    if (m.t === 'answer') {
      const w = waiting.get(m.rid);
      if (!w) return;
      waiting.delete(m.rid);
      if (m.error) w.reject(new Error(m.error)); else w.resolve(m.data);
    } else if (m.t === 'index') {
      indexJob(m).catch((err) => post({ t: 'err', id: m.id, message: String((err && err.message) || err), name: err && err.name }));
    } else if (m.t === 'ocrimg') {
      ocrImageJob(m).catch((err) => post({ t: 'err', id: m.id, message: String((err && err.message) || err) }));
    } else if (m.t === 'closeocr') {
      if (ocrDoc) { ocrDoc.pdf.destroy().catch(() => {}); ocrDoc = null; }
    }
  }
  if (inWorker) G.addEventListener('message', (e) => { if (e.data && e.data.t) handle(e.data); });
  else host.deliver = handle;
  post({ t: 'up' });
}

function PS_OCR_WORKER() {
  'use strict';
  let M = null, api = null;

  async function gunzip(bytes) {
    if (!(bytes[0] === 31 && bytes[1] === 139)) return bytes;
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function init(m) {
    // TesseractCore was defined by the engine source placed in front of this function
    M = await self.TesseractCore({ print() {}, printErr() {} });
    for (const [code, data] of Object.entries(m.langs)) M.FS.writeFile('./' + code + '.traineddata', await gunzip(new Uint8Array(data)));
    api = new M.TessBaseAPI();
    if (api.Init(null, m.init, M.OEM_LSTM_ONLY) === -1) throw new Error('Tesseract init failed');
    api.SetVariable('tessedit_pageseg_mode', String(M.PSM_AUTO));
    api.SetVariable('preserve_interword_spaces', '1');
    api.SetVariable('user_defined_dpi', '220');
  }

  // mean word confidence of a TSV result, weighted by text length
  function meanConf(tsv) {
    let sum = 0, n = 0;
    for (const row of tsv.split('\n')) {
      const c = row.split('\t');
      if (c.length < 12 || c[0] !== '5' || +c[10] < 0) continue;
      const len = c.slice(11).join('').trim().length;
      sum += +c[10] * len; n += len;
    }
    return n ? sum / n : 0;
  }

  let apiV = null; // second engine instance for Japanese vertical writing, created when first needed
  function recognize(m) {
    M.FS.writeFile('/input', new Uint8Array(m.png));
    if (api.SetImageFile(1, 0) === 1) throw new Error('image not readable');
    api.Recognize(null);
    let tsv = api.GetTSVText(0);
    let conf = meanConf(tsv), mode = 'horizontal';
    if (conf < 60) {
      // unreadable as horizontal text: try the vertical Japanese model on the same image and keep the better reading
      if (!apiV) {
        apiV = new M.TessBaseAPI();
        if (apiV.Init(null, 'jpn_vert', M.OEM_LSTM_ONLY) === -1) apiV = null;
        else { apiV.SetVariable('tessedit_pageseg_mode', String(M.PSM_SINGLE_BLOCK_VERT_TEXT)); apiV.SetVariable('user_defined_dpi', '220'); }
      }
      if (apiV && apiV.SetImageFile(1, 0) !== 1) {
        apiV.Recognize(null);
        const tsvV = apiV.GetTSVText(0);
        const confV = meanConf(tsvV);
        if (confV > conf + 5) { tsv = tsvV; conf = confV; mode = 'vertical'; }
      }
    }
    try { M.FS.unlink('/input'); } catch (_) {}
    return { tsv, mode };
  }

  self.onmessage = async (e) => {
    const m = e.data;
    try {
      if (m.t === 'init') { await init(m); self.postMessage({ t: 'ready' }); }
      else if (m.t === 'ocr') { const t0 = Date.now(); const r = recognize(m); self.postMessage({ t: 'res', id: m.id, tsv: r.tsv, mode: r.mode, ms: Date.now() - t0 }); }
    } catch (err) {
      self.postMessage({ t: 'err', id: m.id, message: String((err && err.message) || err) });
    }
  };
}
