/*
 * search.js — the offline search engine (no DOM, no network).
 *
 * Text model
 *   Every page is flattened to one normalized string: NFKC, lower-case, with
 *   whitespace and hyphens removed (a "break" flag remembers where they were).
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
 *
 * Ranking
 *   Each query char has a weight (script, word length, rarity across pages,
 *   stop words). A page scores by the weight it covers, a bonus for repeated
 *   hits, and a bonus when one line covers a lot (proximity). The lines that
 *   explain the score best are returned as "evidence lines".
 */
(function (root) {
  'use strict';
  const PS = (root.PS = root.PS || {});

  const OTHER = 0, LATIN = 1, DIGIT = 2, HAN = 3, HIRA = 4, KATA = 5;
  const SENT = '\u0001'; // never present in page text; splits the query at punctuation

  const DROP_RE = new RegExp('[\\s\\u0000-\\u001f\\u007f\\u00ad\\u200b-\\u200f\\u2028\\u2029\\ufeff]');
  const HYPHEN_RE = new RegExp('[-\\u2010-\\u2015\\u2212]');
  const LETTER_RE = /\p{L}/u;

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

  // class of s[k], where a '.' between two digits counts as part of the number
  function clsAt(s, k) {
    const ch = s[k];
    if (ch === '.' && isDigitCh(s, k - 1) && isDigitCh(s, k + 1)) return DIGIT;
    return cls(ch);
  }

  // Normalizes `str` char by char. emit(char, sourceIndex) is called for kept chars;
  // st.brk is raised when something was dropped before the next char (1 = whitespace, 2 = only a hyphen).
  function eachNorm(str, emit, st) {
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const code = ch.charCodeAt(0);
      let n;
      if (code < 128) n = code >= 65 && code <= 90 ? String.fromCharCode(code + 32) : ch;
      else if (code >= 0xd800 && code <= 0xdfff) n = ch;
      else if (i + 1 < str.length && (str.charCodeAt(i + 1) === 0xff9e || str.charCodeAt(i + 1) === 0xff9f)) {
        n = (ch + str[i + 1]).normalize('NFKC'); // half-width kana + voicing mark -> one char
        i++;
      } else n = ch.normalize('NFKC').toLowerCase();
      for (let k = 0; k < n.length; k++) {
        const c = n[k];
        if (DROP_RE.test(c)) { st.brk = 1; continue; }
        if (HYPHEN_RE.test(c)) { if (!st.brk) st.brk = 2; continue; } // 2 = joined by a hyphen only
        // thousands separator: 1,300 -> 1300
        if (c === ',' && isDigitCh(str, i - 1) && isDigitCh(str, i + 1) && isDigitCh(str, i + 2) && isDigitCh(str, i + 3)) continue;
        emit(c, i);
      }
    }
  }

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
   * raw = { w, h, items: [{ str, fam, x, y, ux, uy, len, fs, up, dn, eol }] }
   * (geometry in page px at scale 1, y down). Returns the searchable page.
   */
  PS.buildPage = function (raw) {
    const chars = [], brk = [], itemOf = [], offOf = [];
    const lines = [];
    const st = { brk: 1 };
    let cur = null, prevEol = true;
    const items = raw.items;
    for (let k = 0; k < items.length; k++) {
      const it = items[k];
      const before = chars.length;
      eachNorm(it.str, (c, i) => {
        chars.push(c); brk.push(st.brk); st.brk = 0; itemOf.push(k); offOf.push(i);
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
      if (it.eol) { prevEol = true; st.brk = 1; }
    }
    return {
      w: raw.w, h: raw.h, items,
      text: chars.join(''),
      brk: Uint8Array.from(brk),
      itemOf: Int32Array.from(itemOf),
      offOf: Int32Array.from(offOf),
      lines,
    };
  };

  function lineIndexAt(page, pos) {
    const L = page.lines;
    let lo = 0, hi = L.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (L[mid].e <= pos) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  /** Rectangles [x0,y0,x1,y1] (page px at scale 1) covering text chars [ds, ds+len). */
  PS.hitRects = function (page, ds, len) {
    const rects = [];
    let k = ds;
    const end = ds + len;
    while (k < end) {
      const itemIdx = page.itemOf[k];
      let m = k;
      while (m + 1 < end && page.itemOf[m + 1] === itemIdx) m++;
      const item = page.items[itemIdx];
      const cum = itemCum(item);
      rects.push(itemBox(item, cum[page.offOf[k]], cum[Math.min(item.str.length, page.offOf[m] + 1)]));
      k = m + 1;
    }
    return rects;
  };

  /** Original text of a line (for tests / accessibility labels; the UI shows pages, not text). */
  PS.lineText = function (page, lineIdx) {
    const ln = page.lines[lineIdx];
    if (!ln) return '';
    const a = page.itemOf[ln.s], b = page.itemOf[ln.e - 1];
    let s = '';
    for (let k = a; k <= b; k++) s += page.items[k].str;
    return s.replace(/\s+/g, ' ').trim();
  };

  // ---------------------------------------------------------------- query

  const JA_STOP = ['何', 'なに', 'いつ', 'どの', 'どこ', 'どれ', 'どちら', 'だれ', '誰', 'なぜ', 'どう', 'どんな', 'いくつ', 'いくら',
    'ですか', 'ますか', 'でしょうか', 'ください', '教えて', 'について', 'とは'];
  const EN_STOP = new Set(('a an the of to in on at is are was were be been do does did what which who whom when where why how ' +
    'and or for with by it its this that these those from as about can could should would will i me my we you your').split(' '));

  PS.parseQuery = function (str) {
    const chars = [], brkA = [];
    const st = { brk: 1 };
    eachNorm(String(str || '').normalize('NFKC'), (c) => { chars.push(c); brkA.push(st.brk); st.brk = 0; }, st);
    const tmp = chars.join('');
    const n = tmp.length;
    const cl = new Uint8Array(n);
    const out = [];
    for (let i = 0; i < n; i++) {
      cl[i] = clsAt(tmp, i);
      out.push(cl[i] === OTHER ? SENT : tmp[i]);
    }
    const q = out.join('');
    const qbrk = Uint8Array.from(brkA);

    // runs of one script (never across a break or punctuation)
    const runStart = new Int32Array(n), runLen = new Int32Array(n);
    for (let i = 0; i < n;) {
      let j = i + 1;
      if (cl[i] !== OTHER) while (j < n && cl[j] === cl[i] && !qbrk[j]) j++;
      for (let k = i; k < j; k++) { runStart[k] = i; runLen[k] = j - i; }
      i = j;
    }

    const base = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      if (cl[i] === OTHER) continue;
      base[i] = (cl[i] === HIRA ? 0.3 : 1) / Math.sqrt(runLen[i]);
    }
    // stop words: keep them matchable (phrases), but nearly weightless
    for (const w of JA_STOP) {
      for (let p = q.indexOf(w); p !== -1; p = q.indexOf(w, p + 1)) for (let k = 0; k < w.length; k++) base[p + k] *= 0.15;
    }
    for (let i = 0; i < n; i++) {
      if (cl[i] === LATIN && runStart[i] === i && EN_STOP.has(q.substr(i, runLen[i]))) {
        for (let k = 0; k < runLen[i]; k++) base[i + k] *= 0.15;
      }
    }

    const isCJK = (c) => c === HAN || c === HIRA || c === KATA;
    // unbroken kana/kanji stretches (a phrase the user typed without spaces)
    const cjkLen = new Int32Array(n);
    for (let i = 0; i < n;) {
      let j = i + 1;
      if (isCJK(cl[i])) while (j < n && isCJK(cl[j]) && !qbrk[j]) j++;
      for (let k = i; k < j; k++) cjkLen[k] = isCJK(cl[i]) ? j - i : 0;
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
    return { raw: str, q, n, cl, qbrk, runStart, runLen, cjkLen, glued, base, startOK, seedLen, stem };
  };

  function docStartOK(page, j, c) {
    if (j === 0 || page.brk[j]) return true;
    if (c !== LATIN && c !== DIGIT) return true;
    return clsAt(page.text, j - 1) !== c;
  }

  function endOK(Q, page, i, j, len) {
    const e = i + len, f = j + len;
    const last = Q.cl[e - 1];
    if (Q.q[e - 1] === '.') return false;
    if (last === KATA) {
      // a short piece cut off the front of a longer katakana word (トル from トルク) says nothing
      const rs = Q.runStart[e - 1];
      return !(e < rs + Q.runLen[e - 1] && e - Math.max(i, rs) < 4);
    }
    if (last !== LATIN && last !== DIGIT) return true;
    if (e < Q.n && Q.glued[e]) return false; // code cut in half
    // a number stays with its counter: 「12日」 does not hit a bare 12 (nor 15分 for 15日)
    if (last === DIGIT && e < Q.n && Q.cl[e] === HAN && !Q.qbrk[e]) return false;
    if (e < Q.n && Q.cl[e] === last && !Q.qbrk[e]) return false; // query word cut in half
    if (f < page.text.length && !page.brk[f] && clsAt(page.text, f) === last) {
      if (last === DIGIT) return false; // 28 must not match 280
      if (Q.runLen[e - 1] < 3) return false; // short words: whole word only
    }
    return true;
  }

  function findHits(Q, page) {
    const t = page.text, q = Q.q, n = Q.n;
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
        if (b < 0.25) continue; // glue only (particles, stop words)
        // two hiragana (する, とき, こと…) are glue unless that is all the user typed
        if (kanaOnly && len < 3 && Q.cjkLen[i] !== len) continue;
        // ...and so does a short piece from the middle or end of one (トース from オーブントースター)
        if (Q.cl[i] === KATA && i > Q.runStart[i] && Math.min(i + len, Q.runStart[i] + Q.runLen[i]) - i < 4) continue;
        hits.push({ qs: i, ds: j, len });
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

  /**
   * pages: array of built pages (each may carry any extra fields, e.g. doc / no).
   * Returns { query, results: [{ page, score, rel, coverage, hits, lines }], byPage: Map }
   *   hits  : [{ qs, ds, len }] positions in page.text
   *   lines : evidence lines [{ index, gain }] sorted top to bottom
   */
  PS.search = function (queryStr, pages) {
    const Q = PS.parseQuery(queryStr);
    const empty = { query: Q, results: [], byPage: new Map() };
    if (!Q.n) return empty;
    const n = Q.n;
    const df = new Float64Array(n);
    const cands = [];
    for (const page of pages) {
      const hits = findHits(Q, page);
      if (!hits.length) continue;
      const c = new Uint16Array(n);
      for (const h of hits) for (let k = 0; k < h.len; k++) c[h.qs + k]++;
      for (let i = 0; i < n; i++) if (c[i]) df[i]++;
      cands.push({ page, hits, c });
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

    for (const cand of cands) {
      const { page, hits, c } = cand;
      let cov = 0, covPlain = 0;
      for (let i = 0; i < n; i++) {
        if (!c[i]) continue;
        covPlain += w[i];
        cov += w[i] * (1 + 0.6 * (1 - 1 / c[i]));
      }
      // which query chars does each line cover?
      const perLine = new Map();
      for (const h of hits) {
        let li = lineIndexAt(page, h.ds);
        for (let k = 0; k < h.len; k++) {
          while (li < page.lines.length - 1 && page.lines[li].e <= h.ds + k) li++;
          let set = perLine.get(li);
          if (!set) perLine.set(li, (set = new Uint8Array(n)));
          set[h.qs + k] = 1;
        }
      }
      // greedy: lines that add the most not-yet-covered query weight
      const rem = Float64Array.from(w);
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
      byPage.set(cand.page, cand);
    }
    const results = cands.filter((cand) => cand.score >= 0.2 * top).slice(0, 300);
    return { query: Q, results, byPage };
  };
})(typeof window !== 'undefined' ? window : globalThis);
