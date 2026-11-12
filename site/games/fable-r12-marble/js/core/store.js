/* Save format (K2). One versioned object for progress, creations and settings.
 * - schemaVersion + migration (v1 -> v2), nothing a child made is ever dropped
 * - every write is read back and compared; if storage is unavailable (private
 *   mode, file:// quirks, quota) the game keeps running from memory and the
 *   parent corner can export/import creations as JSON. */
(function (root) {
  'use strict';
  var MG = root.MG, C = MG.C;
  var St = MG.Store = {
    KEY: 'marble-garden.save', BAK: 'marble-garden.save.bak',
    VERSION: 2, data: null, ok: true, lastError: '', writes: 0, backend: null
  };

  function ls() {
    if (St.backend) return St.backend;
    try { return root.localStorage || null; } catch (e) { return null; }
  }

  St.defaults = function () {
    return {
      schemaVersion: 2, savedAt: 0,
      settings: { volume: 0.6 },
      progress: { tutStep: 0, tutDone: false, level: 1, streak: 0, counter: 0, salt: 0 },
      creations: []
    };
  };

  var V1_KIND = { ramp: 'plank', drum: 'bouncer', bend: 'curve', cup: 'cup', bell: 'bell' };

  /** Bring any older (or partial) save up to the current schema. Never throws. */
  St.migrate = function (obj) {
    var d = St.defaults(), i, j, b, it, c, list;
    if (!obj || typeof obj !== 'object') return d;
    var ver = obj.schemaVersion || obj.version || (obj.creations ? 2 : 1);
    if (ver <= 1) {
      // v1: { version:1, muted, level, tutorial, boards:[{ id, spout:col, items:[{type,col,row,deg}] }] }
      d.settings.volume = obj.muted ? 0 : 0.6;
      d.progress.level = clampInt(obj.level, 1, 6, 1);
      d.progress.tutStep = clampInt(obj.tutorial, 0, 99, 0);
      list = obj.boards || [];
      for (i = 0; i < list.length; i++) {
        b = list[i]; if (!b) continue;
        c = { id: String(b.id || St.newId()), created: b.t || 0, updated: b.t || 0, parentId: null, spoutX: C.GX0 + C.GS * clampInt(b.spout, 0, C.COLS - 1, 6), pieces: [], prev: null };
        for (j = 0; j < (b.items || []).length; j++) {
          it = b.items[j];
          if (!it || !V1_KIND[it.type]) continue;
          c.pieces.push({ k: V1_KIND[it.type], x: C.GX0 + C.GS * it.col, y: C.GY0 + C.GS * it.row, r: ((Math.round((it.deg || 0) / 30) % 12) + 12) % 12 });
        }
        d.creations.push(c);
      }
      return d;
    }
    // v2 (or newer: keep what we understand)
    if (obj.settings && typeof obj.settings.volume === 'number') d.settings.volume = Math.max(0, Math.min(1, obj.settings.volume));
    if (obj.progress) {
      var p = obj.progress;
      d.progress.tutStep = clampInt(p.tutStep, 0, 99, 0);
      d.progress.tutDone = !!p.tutDone;
      d.progress.level = clampInt(p.level, 1, 6, 1);
      d.progress.streak = clampInt(p.streak, 0, 9, 0);
      d.progress.counter = clampInt(p.counter, 0, 1e9, 0);
      d.progress.salt = clampInt(p.salt, 0, 4294967295, 0);
    }
    list = obj.creations || [];
    for (i = 0; i < list.length; i++) {
      c = St.cleanCreation(list[i]);
      if (c) d.creations.push(c);
    }
    d.savedAt = obj.savedAt || 0;
    return d;
  };

  function clampInt(v, lo, hi, def) { v = Math.round(Number(v)); if (!isFinite(v)) return def; return Math.max(lo, Math.min(hi, v)); }

  function cleanPieces(arr) {
    var out = [], i, p;
    for (i = 0; i < (arr || []).length && out.length < 40; i++) {
      p = arr[i];
      if (!p || !MG.KINDS[p.k] || p.k === 'block' || !isFinite(p.x) || !isFinite(p.y)) continue;
      out.push({ k: p.k, x: Number(p.x), y: Number(p.y), r: ((Math.round(p.r || 0) % 12) + 12) % 12 });
    }
    return out;
  }
  St.cleanCreation = function (c) {
    if (!c || typeof c !== 'object') return null;
    return {
      id: String(c.id || St.newId()), created: Number(c.created) || 0, updated: Number(c.updated) || 0,
      parentId: c.parentId ? String(c.parentId) : null,
      spoutX: isFinite(c.spoutX) ? Number(c.spoutX) : 750,
      pieces: cleanPieces(c.pieces),
      prev: c.prev && c.prev.pieces ? { spoutX: isFinite(c.prev.spoutX) ? Number(c.prev.spoutX) : 750, pieces: cleanPieces(c.prev.pieces) } : null
    };
  };

  var idN = 0;
  St.newId = function () { idN++; return 'c' + Date.now().toString(36) + idN.toString(36) + Math.floor(Math.random() * 1296).toString(36); };

  St.load = function () {
    var s = ls(), raw = null, obj = null, usedBackup = false;
    St.ok = true;
    try { raw = s ? s.getItem(St.KEY) : null; } catch (e) { St.ok = false; St.lastError = String(e); }
    if (!s) { St.ok = false; St.lastError = 'no storage'; }
    if (raw) { try { obj = JSON.parse(raw); } catch (e) { obj = null; } }
    if (raw && !obj) {
      // damaged main copy: keep it aside, fall back to the previous good one
      try { s.setItem(St.KEY + '.damaged', raw); obj = JSON.parse(s.getItem(St.BAK)); usedBackup = true; } catch (e2) { obj = null; }
    }
    var fromVersion = obj ? (obj.schemaVersion || obj.version || (obj.creations ? 2 : 1)) : 0;
    St.data = St.migrate(obj);
    if (!St.data.progress.salt) St.data.progress.salt = (Math.floor(Math.random() * 4294967295) >>> 0) || 1;
    if (obj && (fromVersion !== St.VERSION || usedBackup)) {
      try { if (raw && s) s.setItem(St.KEY + '.v' + fromVersion, raw); } catch (e3) { /* best effort */ }
      St.save();
    }
    return St.data;
  };

  /** Write, then read back and compare. Returns true only for a verified write. */
  St.save = function () {
    var s = ls(), str;
    St.data.savedAt = Date.now();
    str = JSON.stringify(St.data);
    St.writes++;
    try {
      if (!s) throw new Error('no storage');
      s.setItem(St.KEY, str);
      if (s.getItem(St.KEY) !== str) throw new Error('read-back mismatch');
      St.ok = true; St.lastError = '';
      try { s.setItem(St.BAK, str); } catch (e0) { /* the second copy is a nicety */ }   // only ever a verified copy
      return true;
    } catch (e) {
      St.ok = false; St.lastError = String(e && e.message || e);
      return false;
    }
  };

  /* ---------- creations ---------- */
  St.findCreation = function (id) { var l = St.data.creations, i; for (i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; };
  St.putCreation = function (c) {
    var l = St.data.creations, i;
    for (i = 0; i < l.length; i++) if (l[i].id === c.id) { l[i] = c; return St.save(); }
    l.push(c); return St.save();
  };
  St.copyCreation = function (id) {
    var src = St.findCreation(id); if (!src) return null;
    var c = JSON.parse(JSON.stringify(src));
    c.id = St.newId(); c.parentId = src.id; c.created = c.updated = Date.now(); c.prev = null;
    St.data.creations.push(c); St.save();
    return c;
  };
  St.removeCreation = function (id) {
    St.data.creations = St.data.creations.filter(function (c) { return c.id !== id; });
    return St.save();
  };

  /* ---------- parent-side export / import ---------- */
  St.exportJSON = function () {
    return JSON.stringify({ app: 'marble-garden', schemaVersion: St.VERSION, exportedAt: Date.now(), creations: St.data.creations, progress: St.data.progress, settings: St.data.settings }, null, 1);
  };
  /** Adds creations from an export (any schema version). Existing creations are never overwritten. */
  St.importJSON = function (text) {
    var obj, d, i, c, added = 0, kept = 0;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, added: 0, kept: 0 }; }
    if (!obj || typeof obj !== 'object') return { ok: false, added: 0, kept: 0 };
    d = St.migrate(obj);
    for (i = 0; i < d.creations.length; i++) {
      c = d.creations[i];
      var mine = St.findCreation(c.id);
      if (mine) {
        if (JSON.stringify(mine.pieces) === JSON.stringify(c.pieces) && mine.spoutX === c.spoutX) { kept++; continue; }
        c.id = St.newId();
      }
      St.data.creations.push(c); added++;
    }
    St.save();
    return { ok: true, added: added, kept: kept };
  };

  St.resetProgress = function () {
    var salt = (Math.floor(Math.random() * 4294967295) >>> 0) || 1;
    St.data.progress = { tutStep: 0, tutDone: false, level: 1, streak: 0, counter: 0, salt: salt };
    return St.save();
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MG;
})(typeof globalThis !== 'undefined' ? globalThis : this);
