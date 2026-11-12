/*
 * search.js — the offline search engine (no DOM, no network).
 * The same source runs on the page and inside the background index worker
 * (the worker is assembled from PS_SEARCH_FACTORY.toString(), see core.js).
 *
 * Text model
 *   Every page is flattened to one normalized string:
 *     - NFKC + lower-case (full/half width, ligatures such as ﬁ, upper/lower case)
 *     - whitespace, hyphens and dashes removed (a "break" flag remembers where they were,
 *       so "FR-228K", "FR 228K" and a word hyphenated across a line break all read the same)
 *     - katakana folded to hiragana, small kana to full-size kana, the long-vowel mark ー dropped
 *       (flags remember what the original was, so exact matches can still be told from variants)
 *   Each normalized char remembers the text item it came from, so a match can
 *   be painted back onto the page.
 *
 * Matching (works for Japanese without a dictionary, and for Latin words)
 *   The query is normalized the same way. For every page we collect the
 *   maximal substrings shared by the query and the page ("hits"):
 *     - kana/kanji: any shared run of 2+ chars (1 char only if typed alone)
 *     - Latin words / numbers: whole words (prefix allowed for 3+ letters),
 *       numbers must match as whole numbers
 *   So a natural question such as 「冷蔵庫と電子レンジの型番は何か」 hits
 *   冷蔵庫 / 電子レンジ / 型番 and ignores the glue around them.
 *   On top of the free text: "quoted phrases" (must occur), -word (must not occur),
 *   file:/in: filters, and dictionary expansion (synonyms / abbreviations).
 *
 * Ranking
 *   Each query char has a weight (script, word length, rarity across pages,
 *   stop words). A page scores by the weight it covers, a bonus for repeated
 *   hits, and a bonus when one line covers a lot (proximity). Variant matches
 *   (kana type, small kana, long vowel) count 0.9, dictionary expansions 0.6.
 *   The lines that explain the score best are returned as "evidence lines".
 *
 * Scale
 *   Each page carries a small bit signature of its chars and char pairs. A query
 *   first tests the signatures (a few bit tests per page), then runs the exact
 *   matcher only on the pages that can contain a hit.
 */
function PS_SEARCH_FACTORY(root) {
  'use strict';
  const PS = (root.PS = root.PS || {});

  const OTHER = 0, LATIN = 1, DIGIT = 2, HAN = 3, HIRA = 4, KATA = 5;
  const SENT = '\u0001'; // never present in page text; splits the query at punctuation

  // per-char flags (page.fl / Q.fl)
  const F_BRK = 3;      // 1 = whitespace was dropped before this char, 2 = only a hyphen
  const F_KATA = 4;     // original was katakana (stored folded to hiragana)
  const F_SMALL = 8;    // original was a small kana (stored full-size)
  const F_LONG = 16;    // a long-vowel mark followed this char (dropped)
  const F_VAR = F_KATA | F_SMALL | F_LONG;
  PS.FLAGS = { BRK: F_BRK, KATA: F_KATA, SMALL: F_SMALL, LONG: F_LONG };

  const DROP_RE = new RegExp('[\\s\\u0000-\\u001f\\u007f\\u00ad\\u200b-\\u200f\\u2028\\u2029\\u2060\\ufeff]');
  // hyphen-minus, Unicode hyphens/dashes, minus sign, small/full-width forms (after NFKC), underscore
  const HYPHEN_RE = new RegExp('[-_\\u2010-\\u2015\\u2043\\u2212\\ufe58\\ufe63]');
  const LETTER_RE = /\p{L}/u;
  const SMALL_KANA = { 'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お', 'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ', 'ゕ': 'か', 'ゖ': 'け' };

  function cls(ch) {
    const c = ch.charCodeAt(0);
    if (c >= 48 && c <= 57) return DIGIT;
    if ((c >= 97 && c <= 122) || (c >= 65 && c <= 90)) return LATIN;
    if (c < 128) return OTHER;
    if (c >= 0x3041 && c <= 0x309f) return c >= 0x3099 && c <= 0x309c ? OTHER : HIRA;
    if ((c >= 0x30a1 && c <= 0x30fa) || (c >= 0x30fc && c <= 0x30ff)) return KATA;
    if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3400 && c <= 0x4dbf) || (c >= 0x3005 && c <= 0x3007) || (c >= 0xf900 && c <= 0xfaff)) return HAN;
    if (c >= 0xd800 && c <= 0xdfff) return HAN; // astral chars (rare kanji): match verbatim
    if (LETTER_RE.test(ch)) return LATIN; // accented Latin, Greek, Cyrillic, Hangul, ...
    return OTHER;
  }
  const isDigitCh = (s, k) => k >= 0 && k < s.length && s.charCodeAt(k) >= 48 && s.charCodeAt(k) <= 57;

  // class of s[k] given its flags, where a '.' between two digits counts as part of the number
  function clsAt(s, fl, k) {
    if (fl[k] & F_KATA) return KATA;
    const ch = s[k];
    if (ch === '.' && isDigitCh(s, k - 1) && isDigitCh(s, k + 1)) return DIGIT;
    return cls(ch);
  }

  // Normalizes `str` char by char. emit(char, sourceIndex, flags) is called for kept chars.
  // st.brk is raised when something was dropped before the next char (1 = whitespace, 2 = only a hyphen);
  // st.kana tells whether the last kept char was a kana; st.long() marks that char as "followed by ー".
  function eachNorm(str, emit, st) {
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const code = ch.charCodeAt(0);
      const src = i;
      let n;
      if (code < 128) n = code >= 65 && code <= 90 ? String.fromCharCode(code + 32) : ch;
      else if (code >= 0xd800 && code <= 0xdfff) n = ch;
      else if (i + 1 < str.length && (str.charCodeAt(i + 1) === 0xff9e || str.charCodeAt(i + 1) === 0xff9f)) {
        n = (ch + str[i + 1]).normalize('NFKC'); // half-width kana + voicing mark -> one char
        i++;
      } else n = ch.normalize('NFKC').toLowerCase();
      for (let k = 0; k < n.length; k++) {
        let c = n[k];
        let cc = c.charCodeAt(0);
        if (cc < 128) {
          if (cc <= 32 || cc === 127) { st.brk = 1; st.kana = 0; continue; }
          if (cc === 45 || cc === 95) { if (!st.brk) st.brk = 2; st.kana = 0; continue; }
          // thousands separator: 1,300 -> 1300
          if (cc === 44 && isDigitCh(str, src - 1) && isDigitCh(str, src + 1) && isDigitCh(str, src + 2) && isDigitCh(str, src + 3)) continue;
          st.kana = 0;
          emit(c, src, 0);
          continue;
        }
        if (cc === 0x30fc) {
          // long-vowel mark: belongs to the kana before it; anywhere else it is used as a dash
          if (st.kana && !st.brk) st.long();
          else if (!st.brk) st.brk = 2;
          continue;
        }
        if (DROP_RE.test(c)) { st.brk = 1; st.kana = 0; continue; }
        if (HYPHEN_RE.test(c)) { if (!st.brk) st.brk = 2; st.kana = 0; continue; } // 2 = joined by a hyphen only
        let f = 0;
        if (cc >= 0x30a1 && cc <= 0x30f6) { cc -= 0x60; c = String.fromCharCode(cc); f = F_KATA; }
        if (cc >= 0x3041 && cc <= 0x3096) {
          const big = SMALL_KANA[c];
          if (big) { c = big; f |= F_SMALL; }
          st.kana = 1;
        } else st.kana = 0;
        emit(c, src, f);
      }
    }
  }

  /** Normalized form of a string (what the matcher compares). For tests and filters. */
  PS.fold = function (str) {
    const out = [];
    const st = { brk: 1, kana: 0, long() {} };
    eachNorm(String(str == null ? '' : str), (c) => { out.push(c); st.brk = 0; }, st);
    return out.join('');
  };

  // ---------------------------------------------------------------- pages

  // Width of one char in em; the browser replaces this with canvas measureText.
  PS.measure = function (fam, ch) {
    return ch.charCodeAt(0) > 0x2e7f ? 1 : ch === ' ' ? 0.3 : 0.55;
  };

  const isWideCode = (c) => c >= 0x2e80 && !(c >= 0xff61 && c <= 0xffdc) && !(c >= 0xffe8 && c <= 0xffee);

  // Cumulative width fractions of an item's chars (PDF.js only reports the item's total width).
  // Full-width chars are exactly 1em in CJK fonts; the remaining width is shared by the
  // narrow chars in proportion to their measured widths.
  function itemCum(item) {
    if (item.cum) return item.cum;
    const s = item.str, n = s.length;
    const wd = new Float32Array(n);
    let hasCJK = false;
    for (let i = 0; i < n; i++) if (isWideCode(s.charCodeAt(i))) { hasCJK = true; break; }
    let wide = 0, narrow = 0;
    for (let i = 0; i < n; i++) {
      const c = s.charCodeAt(i);
      if (isWideCode(c) || (hasCJK && c >= 0x2010 && c < 0x2e80)) { wd[i] = -1; wide++; }
      else { wd[i] = Math.max(0, PS.measure(item.fam, s[i]) || 0); narrow += wd[i]; }
    }
    let k = 1;
    const em = item.fs > 0 ? item.len / item.fs : 0;
    if (wide && narrow > 0 && em > 0) {
      k = (em - wide) / narrow;
      if (!(k > 0.4 && k < 2.5)) k = 1;
    }
    const cum = new Float32Array(n + 1);
    let acc = 0;
    for (let i = 0; i < n; i++) { acc += wd[i] < 0 ? 1 : wd[i] * k; cum[i + 1] = acc; }
    if (acc > 0) for (let i = 1; i <= n; i++) cum[i] /= acc;
    else for (let i = 1; i <= n; i++) cum[i] = i / n;
    item.cum = cum;
    return cum;
  }

  // Bounding box (page px at scale 1) of the part [f0,f1] of a text item.
  function itemBox(item, f0, f1) {
    const ax = item.x + item.ux * item.len * f0, ay = item.y + item.uy * item.len * f0;
    const bx = item.x + item.ux * item.len * f1, by = item.y + item.uy * item.len * f1;
    // "up" on screen for direction (ux,uy) is (uy,-ux)
    const upx = item.uy, upy = -item.ux;
    const xs = [ax + upx * item.up, ax - upx * item.dn, bx + upx * item.up, bx - upx * item.dn];
    const ys = [ay + upy * item.up, ay - upy * item.dn, by + upy * item.up, by - upy * item.dn];
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }

  /**
   * raw = { w, h, items: [{ str, fam, x, y, ux, uy, len, fs, up, dn, eol, cf? }] }
   * (geometry in page px at scale 1, y down; cf = OCR confidence 0-100 when the item was read by OCR).
   * Returns the searchable page with its geometry:
   *   text, fl (flags per char), le (end offset of each line)          <- what the matcher needs
   *   items, itemOf, offOf, lines (boxes)                              <- what painting needs
   */
  PS.buildPage = function (raw) {
    const chars = [], fl = [], itemOf = [], offOf = [];
    const lines = [];
    const st = { brk: 1, kana: 0, long() { if (fl.length) fl[fl.length - 1] |= F_LONG; } };
    let cur = null, prevEol = true;
    const items = raw.items;
    for (let k = 0; k < items.length; k++) {
      const it = items[k];
      const before = chars.length;
      eachNorm(it.str, (c, i, f) => {
        chars.push(c); fl.push(f | st.brk); st.brk = 0; itemOf.push(k); offOf.push(i);
      }, st);
      const added = chars.length - before;
      if (added) {
        const fh = it.up + it.dn;
        const horiz = Math.abs(it.uy) < 0.2;
        const pos = horiz ? it.y : it.x;
        if (!cur || prevEol || Math.abs(pos - cur.pos) > 0.6 * Math.max(fh, cur.fs)) {
          cur = { s: before, e: chars.length, x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity, fs: fh, pos };
          lines.push(cur);
        }
        const b = itemBox(it, 0, 1);
        cur.x0 = Math.min(cur.x0, b[0]); cur.y0 = Math.min(cur.y0, b[1]);
        cur.x1 = Math.max(cur.x1, b[2]); cur.y1 = Math.max(cur.y1, b[3]);
        cur.e = chars.length;
        cur.fs = Math.max(cur.fs, fh);
        prevEol = false;
      }
      if (it.eol) { prevEol = true; st.brk = 1; st.kana = 0; }
    }
    const le = new Uint32Array(lines.length);
    for (let i = 0; i < lines.length; i++) le[i] = lines[i].e;
    return {
      w: raw.w, h: raw.h, items,
      text: chars.join(''),
      fl: Uint8Array.from(fl),
      le,
      itemOf: Int32Array.from(itemOf),
      offOf: Int32Array.from(offOf),
      lines,
    };
  };

  /**
   * Compact, transferable form of a raw page (what the geom store keeps), and back.
   * { w, h, s: [str], fam: [family], fi: Uint8Array, g: Float32Array(8 per item), eol: Uint8Array, cf?: Uint8Array }
   */
  PS.packRaw = function (raw) {
    const n = raw.items.length;
    const fams = [], famIdx = new Map();
    const fi = new Uint8Array(n), g = new Float32Array(n * 8), eol = new Uint8Array(n), s = new Array(n);
    let cf = null;
    for (let k = 0; k < n; k++) {
      const it = raw.items[k];
      let f = famIdx.get(it.fam);
      if (f === undefined) { f = Math.min(fams.length, 255); if (f === fams.length) fams.push(it.fam); famIdx.set(it.fam, f); }
      fi[k] = f; s[k] = it.str; eol[k] = it.eol ? 1 : 0;
      g.set([it.x, it.y, it.ux, it.uy, it.len, it.fs, it.up, it.dn], k * 8);
      if (it.cf != null) { if (!cf) cf = new Uint8Array(n); cf[k] = it.cf; }
    }
    const out = { w: raw.w, h: raw.h, s, fam: fams, fi, g, eol };
    if (cf) out.cf = cf;
    return out;
  };
  PS.unpackRaw = function (p) {
    const n = p.s.length, g = p.g, items = new Array(n);
    for (let k = 0; k < n; k++) {
      const o = k * 8;
      items[k] = { str: p.s[k], fam: p.fam[p.fi[k]] || 'sans-serif', x: g[o], y: g[o + 1], ux: g[o + 2], uy: g[o + 3], len: g[o + 4], fs: g[o + 5], up: g[o + 6], dn: g[o + 7], eol: p.eol[k] };
      if (p.cf) items[k].cf = p.cf[k];
    }
    return { w: p.w, h: p.h, items };
  };

  function lineIndexAt(page, pos) {
    const L = page.le;
    let lo = 0, hi = L.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (L[mid] <= pos) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  /** Rectangles [x0,y0,x1,y1] (page px at scale 1) covering text chars [ds, ds+len) of a built page. */
  PS.hitRects = function (g, ds, len) {
    const rects = [];
    let k = ds;
    const end = Math.min(ds + len, g.text.length);
    while (k < end) {
      const itemIdx = g.itemOf[k];
      let m = k;
      while (m + 1 < end && g.itemOf[m + 1] === itemIdx) m++;
      const item = g.items[itemIdx];
      const cum = itemCum(item);
      let last = g.offOf[m] + 1;
      // the dropped long-vowel mark after the last char belongs to the word
      if ((g.fl[m] & F_LONG) && last < item.str.length) { const c = item.str.charCodeAt(last); if (c === 0x30fc || c === 0xff70) last++; }
      rects.push(itemBox(item, cum[g.offOf[k]], cum[Math.min(item.str.length, last)]));
      k = m + 1;
    }
    return rects;
  };

  /** Lowest OCR confidence (0-100) among the items under chars [ds, ds+len); -1 when the text is not from OCR. */
  PS.hitConf = function (g, ds, len) {
    let conf = -1;
    const end = Math.min(ds + len, g.text.length);
    for (let k = ds; k < end; k++) {
      const cf = g.items[g.itemOf[k]].cf;
      if (cf != null && (conf < 0 || cf < conf)) conf = cf;
    }
    return conf;
  };

  /** Original text of a line (for tests / accessibility labels; the UI shows pages, not text). */
  PS.lineText = function (g, lineIdx) {
    const ln = g.lines[lineIdx];
    if (!ln) return '';
    const a = g.itemOf[ln.s], b = g.itemOf[ln.e - 1];
    let s = '';
    for (let k = a; k <= b; k++) s += g.items[k].str;
    return s.replace(/\s+/g, ' ').trim();
  };

  // ---------------------------------------------------------------- page signatures (scale)
  // A Bloom-style bit set per page: 1 bit per distinct char, 2 bits per distinct char pair.
  const mix = (h) => { h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; h = Math.imul(h, 0x297a2d39); h ^= h >>> 15; return h >>> 0; };
  const h1 = (a) => mix(a + 0x9e3779b9);
  const h2a = (a, b) => mix(Math.imul(a, 0x10001) ^ Math.imul(b, 0x9e3b) ^ 0x51ed270b);
  const h2b = (a, b) => mix(Math.imul(a, 0x85eb) ^ Math.imul(b, 0xc2b2ae35) ^ 0x27d4eb2f);

  /** Signature size in bytes for a page text of `len` chars (power of two, about 8 bits per char). */
  PS.sigBytes = function (len) {
    let bits = 1024;
    while (bits < len * 8 && bits < 32768) bits <<= 1;
    return bits >> 3;
  };
  /** Write the signature of `text` into out[off .. off+bytes). */
  PS.makeSig = function (text, out, off, bytes) {
    const mask = bytes * 8 - 1;
    let prev = -1;
    for (let k = 0; k < text.length; k++) {
      const c = text.charCodeAt(k);
      let b = h1(c) & mask; out[off + (b >> 3)] |= 1 << (b & 7);
      if (prev >= 0) {
        b = h2a(prev, c) & mask; out[off + (b >> 3)] |= 1 << (b & 7);
        b = h2b(prev, c) & mask; out[off + (b >> 3)] |= 1 << (b & 7);
      }
      prev = c;
    }
  };
  // hashes a page must contain for the string `s` to be able to occur in it
  function seedHashes(s) {
    const out = [];
    if (s.length === 1) out.push(h1(s.charCodeAt(0)));
    for (let k = 0; k + 1 < s.length; k++) {
      const a = s.charCodeAt(k), b = s.charCodeAt(k + 1);
      out.push(h2a(a, b), h2b(a, b));
    }
    return Uint32Array.from(out);
  }
  function sigHas(page, hashes) {
    const sb = page.sb;
    if (!sb) return true; // no signature (small in-memory sets, tests): always a candidate
    const so = page.so, mask = page.sl * 8 - 1;
    for (let k = 0; k < hashes.length; k++) {
      const b = hashes[k] & mask;
      if (!(sb[so + (b >> 3)] & (1 << (b & 7)))) return false;
    }
    return true;
  }

  // ---------------------------------------------------------------- query

  const JA_STOP = ['何', 'なに', 'いつ', 'どの', 'どこ', 'どれ', 'どちら', 'だれ', '誰', 'なぜ', 'どう', 'どんな', 'いくつ', 'いくら',
    'ですか', 'ますか', 'でしょうか', 'ください', '教えて', 'について', 'とは'].map((w) => PS.fold(w));
  const EN_STOP = new Set(('a an the of to in on at is are was were be been do does did what which who whom when where why how ' +
    'and or for with by it its this that these those from as about can could should would will i me my we you your').split(' '));

  /**
   * Parse free text into the structure the matcher works on.
   * opt.literal: keep punctuation as chars to match (used for quoted phrases) instead of splitting there.
   */
  PS.parseQuery = function (str, opt) {
    const literal = !!(opt && opt.literal);
    const chars = [], fls = [];
    const st = { brk: 1, kana: 0, long() { if (fls.length) fls[fls.length - 1] |= F_LONG; } };
    eachNorm(String(str || '').normalize('NFKC'), (c, i, f) => { chars.push(c); fls.push(f | st.brk); st.brk = 0; }, st);
    const tmp = chars.join('');
    const n = tmp.length;
    const fl = Uint8Array.from(fls);
    const cl = new Uint8Array(n);
    const out = [];
    for (let i = 0; i < n; i++) {
      cl[i] = clsAt(tmp, fl, i);
      out.push(cl[i] === OTHER && !literal ? SENT : tmp[i]);
    }
    const q = out.join('');
    const qbrk = new Uint8Array(n);
    // op: prefix sums of the original length of each char (a dropped ー still counts as a char of its word)
    const op = new Int32Array(n + 1);
    for (let i = 0; i < n; i++) { qbrk[i] = fl[i] & F_BRK; op[i + 1] = op[i] + 1 + ((fl[i] & F_LONG) ? 1 : 0); }

    // runs of one script (never across a break or punctuation)
    const runStart = new Int32Array(n), runLen = new Int32Array(n);
    for (let i = 0; i < n;) {
      let j = i + 1;
      if (cl[i] !== OTHER) while (j < n && cl[j] === cl[i] && !qbrk[j]) j++;
      for (let k = i; k < j; k++) { runStart[k] = i; runLen[k] = j - i; }
      i = j;
    }

    const base = new Float32Array(n);
    const enStop = new Uint8Array(n); // an English stop word starts here
    for (let i = 0; i < n; i++) {
      if (cl[i] === OTHER) continue;
      const rs = runStart[i];
      base[i] = (op[i + 1] - op[i]) * (cl[i] === HIRA ? 0.3 : 1) / Math.sqrt(op[rs + runLen[i]] - op[rs]);
    }
    // stop words: keep them matchable (phrases), but nearly weightless
    if (!literal) {
      for (const w of JA_STOP) {
        for (let p = q.indexOf(w); p !== -1; p = q.indexOf(w, p + 1)) {
          let plain = true; // the stop words are hiragana/kanji: a katakana word that folds to the same chars is not one
          for (let k = 0; k < w.length; k++) if (fl[p + k] & F_KATA) plain = false;
          if (plain) for (let k = 0; k < w.length; k++) base[p + k] *= 0.15;
        }
      }
      for (let i = 0; i < n; i++) {
        if (cl[i] === LATIN && runStart[i] === i && EN_STOP.has(q.substr(i, runLen[i]))) {
          for (let k = 0; k < runLen[i]; k++) base[i + k] *= 0.15;
          enStop[i] = 1;
        }
      }
    }

    const isCJK = (c) => c === HAN || c === HIRA || c === KATA;
    // unbroken kana/kanji stretches (a phrase the user typed without spaces), in original chars
    const cjkLen = new Int32Array(n);
    for (let i = 0; i < n;) {
      let j = i + 1;
      if (isCJK(cl[i])) while (j < n && isCJK(cl[j]) && !qbrk[j]) j++;
      for (let k = i; k < j; k++) cjkLen[k] = isCJK(cl[i]) ? op[j] - op[i] : 0;
      i = j;
    }
    // letters/digits written without a space between them (a hyphen does not count) form one code
    const alnum = (c) => c === LATIN || c === DIGIT;
    const glued = new Uint8Array(n);
    for (let i = 1; i < n; i++) glued[i] = alnum(cl[i]) && alnum(cl[i - 1]) && qbrk[i] !== 1 ? 1 : 0;
    const startOK = new Uint8Array(n), seedLen = new Uint8Array(n), stem = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const c = cl[i];
      if (c === OTHER || q[i] === '.') continue;
      if (c === LATIN || c === DIGIT) {
        if (runStart[i] !== i) continue; // words and numbers only match from their first char
        if (glued[i]) continue;          // ...and codes (OT-12, FR-228K, 200ml) only as a whole
        startOK[i] = 1;
        seedLen[i] = Math.min(runLen[i], 255);
        continue;
      }
      // a counter stays with its number: in 「15日の」 a hit may start at 15, not at 日
      if (c === HAN && i > 0 && !qbrk[i] && cl[i - 1] === DIGIT) continue;
      // kana / kanji: 2+ chars — or one kanji / katakana typed by itself (matches anywhere),
      // or one kanji with kana around it (朝に, 洗う): matches where the page also uses it as a word of its own
      const prevGlued = i > 0 && !qbrk[i] && (cl[i - 1] === HAN || cl[i - 1] === KATA || cl[i - 1] === DIGIT || cl[i - 1] === LATIN);
      const nextGlued = i + 1 < n && !qbrk[i + 1] && (cl[i + 1] === HAN || cl[i + 1] === KATA || cl[i + 1] === DIGIT || cl[i + 1] === LATIN);
      const lone = c !== HIRA && !prevGlued && !nextGlued;
      const hasNext = i + 1 < n && isCJK(cl[i + 1]);
      if (lone) { startOK[i] = 1; seedLen[i] = 1; stem[i] = cjkLen[i] > 1 ? 1 : 0; }
      else if (hasNext) { startOK[i] = 1; seedLen[i] = 2; }
    }
    // "the", "of", "how"… occur on every English page: when the query has real words too, hits do not start at
    // them (a hit that started at the word before still runs across them), which keeps long questions fast
    if (!literal) {
      let real = false;
      for (let i = 0; i < n; i++) if (startOK[i] && !enStop[i]) { real = true; break; }
      if (real) for (let i = 0; i < n; i++) if (enStop[i]) startOK[i] = 0;
    }
    // a quoted phrase is matched as a whole, starting at its first letter (punctuation around it is ignored)
    let first = 0, last = n;
    while (first < n && cl[first] === OTHER) first++;
    while (last > first && cl[last - 1] === OTHER) last--;
    if (literal && first < last && !startOK[first]) { startOK[first] = 1; seedLen[first] = Math.min(2, last - first); }
    // the distinct seeds, with the signature hashes a page needs to hold them
    const seeds = [];
    const seen = new Set();
    for (let i = 0; i < n; i++) {
      if (!startOK[i]) continue;
      const s = q.substr(i, seedLen[i]);
      if (seen.has(s)) continue;
      seen.add(s);
      seeds.push(seedHashes(s));
    }
    return { raw: str, q, n, cl, fl, qbrk, op, runStart, runLen, cjkLen, glued, base, startOK, seedLen, stem, seeds, literal, first, last };
  };

  function mayContain(Q, page) {
    if (!page.sb) return true;
    const seeds = Q.seeds;
    for (let s = 0; s < seeds.length; s++) if (sigHas(page, seeds[s])) return true;
    return false;
  }

  function docStartOK(page, j, c) {
    if (j === 0 || (page.fl[j] & F_BRK)) return true;
    if (c !== LATIN && c !== DIGIT) return true;
    return clsAt(page.text, page.fl, j - 1) !== c;
  }

  function endOK(Q, page, i, j, len) {
    const e = i + len, f = j + len;
    const last = Q.cl[e - 1];
    if (Q.q[e - 1] === '.') return false;
    if (last === KATA) {
      // a short piece cut off the front of a longer katakana word (トル from トルク) says nothing
      const rs = Q.runStart[e - 1];
      return !(e < rs + Q.runLen[e - 1] && Q.op[e] - Q.op[Math.max(i, rs)] < 4);
    }
    if (last !== LATIN && last !== DIGIT) return true;
    if (e < Q.n && Q.glued[e]) return false; // code cut in half
    // a number stays with its counter: 「12日」 does not hit a bare 12 (nor 15分 for 15日)
    if (last === DIGIT && e < Q.n && Q.cl[e] === HAN && !Q.qbrk[e]) return false;
    if (e < Q.n && Q.cl[e] === last && !Q.qbrk[e]) return false; // query word cut in half
    if (f < page.text.length && !(page.fl[f] & F_BRK) && clsAt(page.text, page.fl, f) === last) {
      if (last === DIGIT) return false; // 28 must not match 280
      if (Q.runLen[e - 1] < 3) return false; // short words: whole word only
    }
    return true;
  }

  const isKanaCls = (c) => c === HIRA || c === KATA;

  /** Hits of the parsed query on a page: [{ qs, ql, ds, len, v }] (v = 1: kana/long-vowel variant). */
  function findHits(Q, page) {
    const t = page.text, q = Q.q, n = Q.n, pf = page.fl;
    const hits = [];
    if (!t) return hits;
    for (let i = 0; i < n; i++) {
      if (!Q.startOK[i]) continue;
      const sl = Q.seedLen[i];
      const seed = q.substr(i, sl);
      for (let j = t.indexOf(seed); j !== -1; j = t.indexOf(seed, j + 1)) {
        if (!docStartOK(page, j, Q.cl[i])) continue;
        let len = sl;
        while (i + len < n && j + len < t.length && q[i + len] === t[j + len]) len++;
        while (len >= sl && !endOK(Q, page, i, j, len)) len--;
        if (len < sl) continue;
        if (len === 1 && Q.stem[i] && ((j > 0 && cls(t[j - 1]) === HAN) || (j + 1 < t.length && cls(t[j + 1]) === HAN))) continue;
        let b = 0, kanaOnly = true;
        for (let k = 0; k < len; k++) { b += Q.base[i + k]; if (Q.cl[i + k] !== HIRA) kanaOnly = false; }
        if (b < 0.25 && !Q.literal) continue; // glue only (particles, stop words)
        const olen = Q.op[i + len] - Q.op[i];
        // two hiragana (する, とき, こと…) are glue unless that is all the user typed
        if (kanaOnly && olen < 3 && Q.cjkLen[i] !== olen && !Q.literal) continue;
        // ...and so does a short piece from the middle or end of one (トース from オーブントースター)
        if (Q.cl[i] === KATA && i > Q.runStart[i] && Q.op[Math.min(i + len, Q.runStart[i] + Q.runLen[i])] - Q.op[i] < 4) continue;
        // variant? (same chars after folding, but the kana type / size / long vowel differs)
        let v = 0, inner = false;
        for (let k = 0; k < len; k++) {
          const d = (Q.fl[i + k] ^ pf[j + k]) & F_VAR;
          if (d) { v = 1; if ((d & F_LONG) && k < len - 1) inner = true; }
        }
        if (inner && len < 3) {
          // コース must not hit コスト: a long vowel may only go missing inside a short word when the page word is exactly that word
          const f = j + len;
          const startsWord = j === 0 || (pf[j] & F_BRK) || !isKanaCls(clsAt(t, pf, j - 1));
          const endsWord = f >= t.length || (pf[f] & F_BRK) || !isKanaCls(clsAt(t, pf, f));
          if (!startsWord || !endsWord) continue;
        }
        // a Latin word matched only as the beginning of a longer word (max -> maximum): counts slightly less than the word itself
        let pre = 0;
        if (Q.cl[i + len - 1] === LATIN && j + len < t.length && !(pf[j + len] & F_BRK) && clsAt(t, pf, j + len) === LATIN) pre = 1;
        hits.push({ qs: i, ql: len, ds: j, len, v, pre });
      }
    }
    // drop hits contained in a longer hit on the same alignment
    hits.sort((a, b) => (a.ds - a.qs) - (b.ds - b.qs) || a.qs - b.qs || b.len - a.len);
    const outHits = [];
    let diag = NaN, reach = -1;
    for (const h of hits) {
      const d = h.ds - h.qs;
      if (d !== diag) { diag = d; reach = -1; }
      if (h.qs + h.len <= reach) continue;
      reach = h.qs + h.len;
      outHits.push(h);
    }
    outHits.sort((a, b) => a.ds - b.ds);
    return outHits;
  }
  PS._findHits = findHits;

  // does the page contain the whole parsed string (used for phrases, exclusions, dictionary alternatives)?
  function fullHits(Qp, page) {
    if (Qp.first >= Qp.last || !mayContain(Qp, page)) return [];
    return findHits(Qp, page).filter((h) => h.qs === Qp.first && h.qs + h.len >= Qp.last);
  }

  // ---------------------------------------------------------------- query syntax + dictionary

  /**
   * Split what the user typed into free text and operators:
   *   "exact phrase"   the page must contain the phrase (spaces / hyphens / width / case still do not matter)
   *   -word  -"a b"    pages containing it are left out
   *   file:xyz         only files whose name contains xyz        (-file:xyz to exclude)
   *   in:xyz           only files whose folder path contains xyz (-in:xyz to exclude)
   * Returns { text, phrases: [str], excludes: [str], files: [{ s, neg, dir }] }.
   */
  PS.parseInput = function (input) {
    const str = String(input || '');
    const phrases = [], excludes = [], files = [];
    let text = '';
    const QUOTES = '"“”„＂';
    const isSpace = (ch) => /\s/.test(ch);
    let i = 0;
    while (i < str.length) {
      const ch = str[i];
      const atStart = i === 0 || isSpace(str[i - 1]);
      let neg = false, j = i;
      if (atStart && (ch === '-' || ch === '−' || ch === '－') && j + 1 < str.length && !isSpace(str[j + 1]) && !/[-\d.]/.test(str[j + 1])) { neg = true; j++; }
      // file: / in: filters (ASCII or full-width colon)
      const m = atStart ? /^(file|in)[:：]/i.exec(str.slice(j, j + 6)) : null;
      if (m) {
        let k = j + m[0].length, val = '';
        if (QUOTES.includes(str[k])) { const e = closing(str, k + 1); val = str.slice(k + 1, e); k = e + 1; }
        else { const e = nextSpace(str, k); val = str.slice(k, e); k = e; }
        if (val) files.push({ s: PS.fold(val), neg, dir: m[1].toLowerCase() === 'in' });
        i = k;
        continue;
      }
      if (QUOTES.includes(str[j])) {
        const e = closing(str, j + 1);
        const val = str.slice(j + 1, e).trim();
        if (e < str.length || val) {
          if (val) { if (neg) excludes.push(val); else { phrases.push(val); text += ' ' + val + ' '; } }
          i = Math.min(str.length, e + 1);
          continue;
        }
      }
      if (neg) {
        const e = nextSpace(str, j);
        const val = str.slice(j, e);
        if (val) excludes.push(val);
        i = e;
        continue;
      }
      text += ch;
      i++;
    }
    return { text: text.trim(), phrases, excludes, files };

    function closing(s, from) { for (let k = from; k < s.length; k++) if (QUOTES.includes(s[k])) return k; return s.length; }
    function nextSpace(s, from) { let k = from; while (k < s.length && !isSpace(s[k])) k++; return k; }
  };

  // Dictionary: groups of interchangeable terms, e.g. [["ac", "air conditioner"], ["temp", "temperature"]].
  let DICT = [];
  /** Install the dictionary. Accepts { groups: [[...], ...] } or a bare array of groups. Returns the number of groups kept. */
  PS.setDictionary = function (dict) {
    const groups = Array.isArray(dict) ? dict : dict && Array.isArray(dict.groups) ? dict.groups : [];
    DICT = [];
    for (const g of groups) {
      const terms = (Array.isArray(g) ? g : g && Array.isArray(g.terms) ? g.terms : []).filter((t) => typeof t === 'string' && PS.fold(t));
      if (terms.length > 1) DICT.push(terms.map((t) => ({ raw: t, f: PS.fold(t), Q: null })));
    }
    return DICT.length;
  };
  PS.dictionarySize = () => DICT.length;

  // Occurrences of dictionary terms in the query: [{ s, len, alts: [parsed alternative] }]
  function expansions(Q) {
    const out = [];
    if (!DICT.length || !Q.n) return out;
    const q = Q.q;
    for (const group of DICT) {
      for (const term of group) {
        for (let p = q.indexOf(term.f); p !== -1; p = q.indexOf(term.f, p + 1)) {
          const e = p + term.f.length;
          // whole words only on the Latin/digit side: "ac" must not fire inside "back" or "ac-12"
          const first = Q.cl[p], last = Q.cl[e - 1];
          if ((first === LATIN || first === DIGIT) && p > 0 && !Q.qbrk[p] && Q.cl[p - 1] === first) continue;
          if ((first === LATIN || first === DIGIT) && Q.glued[p]) continue;
          if ((last === LATIN || last === DIGIT) && e < Q.n && !Q.qbrk[e] && (Q.cl[e] === last || Q.glued[e])) continue;
          if (e < Q.n && Q.glued[e]) continue;
          const alts = [];
          for (const other of group) {
            if (other === term || other.f === term.f) continue;
            if (!other.Q) other.Q = PS.parseQuery(other.raw, { literal: true });
            alts.push(other.Q);
          }
          if (alts.length) out.push({ s: p, len: term.f.length, alts });
        }
      }
    }
    return out;
  }

  // ---------------------------------------------------------------- search

  const FACTOR = [1, 0.9, 0.6]; // exact, kana/long-vowel variant, dictionary expansion

  /**
   * pages: array of searchable pages ({ text, fl, le, doc?, sb/so/sl? }).
   * Returns { query, input, results: [{ page, score, rel, coverage, hits, lines }], byPage: Map, total, filtered }
   *   hits  : [{ qs, ql, ds, len, v, syn }] positions in page.text (syn = 1: found through the dictionary)
   *   lines : evidence lines [{ index, gain }] sorted top to bottom
   *   total : number of pages that matched (results is capped at 300)
   */
  PS.search = function (queryStr, pages) {
    const input = PS.parseInput(queryStr);
    const Q = PS.parseQuery(input.text);
    const empty = { query: Q, input, results: [], byPage: new Map(), total: 0 };
    const n = Q.n;

    // file / folder filters work on the file, before any text is looked at
    let pool = pages;
    if (input.files.length) {
      const keep = new Map();
      const ok = (doc) => {
        if (!doc) return false;
        let r = keep.get(doc);
        if (r === undefined) {
          const full = doc.path || doc.name || '';
          const cut = full.lastIndexOf('/');
          const name = PS.fold(full.slice(cut + 1)), dir = PS.fold(cut < 0 ? '' : full.slice(0, cut));
          r = input.files.every((f) => ((f.dir ? dir : name).includes(f.s)) !== f.neg);
          keep.set(doc, r);
        }
        return r;
      };
      pool = pages.filter((p) => ok(p.doc));
    }
    const need = input.phrases.map((p) => PS.parseQuery(p, { literal: true })).filter((p) => p.first < p.last);
    const deny = input.excludes.map((p) => PS.parseQuery(p, { literal: true })).filter((p) => p.first < p.last);
    if (!n) {
      // nothing to rank: filters only (the caller shows the files that pass)
      empty.filtered = input.files.length ? pool : null;
      return empty;
    }
    const exps = expansions(Q);

    const df = new Float64Array(n);
    const cands = [];
    for (const page of pool) {
      let hits = null;
      if (mayContain(Q, page)) hits = findHits(Q, page);
      // dictionary alternatives stand in for the term the user typed
      for (const ex of exps) {
        for (const alt of ex.alts) {
          const fh = fullHits(alt, page);
          if (!fh.length) continue;
          if (!hits) hits = [];
          for (const h of fh) hits.push({ qs: ex.s, ql: ex.len, ds: h.ds, len: h.len, v: 0, syn: 1 });
        }
      }
      if (!hits || !hits.length) continue;
      if (need.length && !need.every((p) => fullHits(p, page).length)) continue;
      if (deny.length && deny.some((p) => fullHits(p, page).length)) continue;
      if (exps.length) {
        // one mark per place: a dictionary hit inside another hit for the same query term adds nothing
        hits.sort((a, b) => a.ds - b.ds || b.len - a.len);
        const direct = new Set();
        for (const h of hits) if (!h.syn) direct.add(h.ds);
        const kept = [];
        for (const h of hits) {
          const p = kept[kept.length - 1];
          if (h.syn && p && p.ds + p.len >= h.ds + h.len && p.qs <= h.qs && p.qs + p.ql >= h.qs + h.ql) continue;
          if (h.syn && direct.has(h.ds)) continue; // the word itself already matched here (max -> "maximum" as a prefix)
          kept.push(h);
        }
        hits = kept;
      }
      const c = new Uint16Array(n);
      const fac = new Float32Array(n);
      for (const h of hits) {
        const f = h.syn ? FACTOR[2] : h.v ? FACTOR[1] : h.pre ? 0.95 : FACTOR[0];
        for (let k = 0; k < h.ql; k++) { c[h.qs + k]++; if (f > fac[h.qs + k]) fac[h.qs + k] = f; }
      }
      for (let i = 0; i < n; i++) if (c[i]) df[i]++;
      cands.push({ page, hits, c, fac });
    }
    if (!cands.length) return empty;

    const N = Math.max(1, pages.length);
    const idf1 = Math.log(1 + (N - 0.5) / 1.5);
    const w = new Float64Array(n);
    let wAll = 0;
    for (let i = 0; i < n; i++) {
      const rarity = df[i] ? Math.log(1 + (N - df[i] + 0.5) / (df[i] + 0.5)) / idf1 : 1;
      w[i] = Q.base[i] * (0.3 + 0.7 * rarity);
      wAll += w[i];
    }

    const rem = new Float64Array(n);
    for (const cand of cands) {
      const { page, hits, c, fac } = cand;
      let cov = 0, covPlain = 0;
      for (let i = 0; i < n; i++) {
        if (!c[i]) continue;
        covPlain += w[i] * fac[i];
        cov += w[i] * fac[i] * (1 + 0.6 * (1 - 1 / c[i]));
      }
      // which query chars does each line cover?
      const perLine = new Map();
      const nl = page.le.length;
      for (const h of hits) {
        let li = lineIndexAt(page, h.ds);
        if (h.syn) {
          let set = perLine.get(li);
          if (!set) perLine.set(li, (set = new Uint8Array(n)));
          for (let k = 0; k < h.ql; k++) set[h.qs + k] = 1;
          continue;
        }
        for (let k = 0; k < h.len; k++) {
          while (li < nl - 1 && page.le[li] <= h.ds + k) li++;
          let set = perLine.get(li);
          if (!set) perLine.set(li, (set = new Uint8Array(n)));
          set[h.qs + k] = 1;
        }
      }
      // greedy: lines that add the most not-yet-covered query weight
      for (let i = 0; i < n; i++) rem[i] = w[i] * fac[i];
      const ev = [];
      let first = 0;
      while (ev.length < 3) {
        let best = -1, bestGain = 0;
        for (const [li, set] of perLine) {
          let g = 0;
          for (let i = 0; i < n; i++) if (set[i]) g += rem[i];
          if (g > bestGain + 1e-9) { bestGain = g; best = li; }
        }
        if (best < 0) break;
        if (!ev.length) first = bestGain;
        else if (bestGain < Math.max(0.12 * first, 0.5)) break;
        ev.push({ index: best, gain: bestGain });
        const set = perLine.get(best);
        for (let i = 0; i < n; i++) if (set[i]) rem[i] = 0;
      }
      ev.sort((a, b) => a.index - b.index);
      cand.lines = ev;
      cand.score = cov + 0.35 * first;
      cand.coverage = wAll ? covPlain / wAll : 0;
    }

    cands.sort((a, b) => b.score - a.score);
    const top = cands[0].score;
    const byPage = new Map();
    for (const cand of cands) {
      cand.rel = cand.score / top;
      delete cand.c;
      delete cand.fac;
      byPage.set(cand.page, cand);
    }
    const good = cands.filter((cand) => cand.score >= 0.2 * top);
    const files = new Set();
    for (const cand of good) files.add(cand.page.doc);
    return { query: Q, input, results: good.slice(0, 300), byPage, total: good.length, files: files.size };
  };
}
PS_SEARCH_FACTORY(typeof window !== 'undefined' ? window : globalThis);
