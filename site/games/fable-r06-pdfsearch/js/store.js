/*
 * store.js — persistent data (IndexedDB), with an in-memory stand-in when the
 * browser refuses storage (private window, blocked site data). No network.
 *
 * Two databases, on purpose:
 *
 *   "pdf-cross-search-2"      REGENERABLE — can always be rebuilt from the PDFs
 *       docs    { id (first 32 hex of the SHA-256 of the bytes), sha256, name, path, paths[], meta, labels, gen, … }
 *       text    per document: every page's normalized text, char flags, line ends, signatures, OCR state, generation
 *       geom    per page ("<doc>:<000123>"): words/text items with boxes, source (pdf | ocr) and OCR confidence
 *       thumbs  per page: a small WebP of the page
 *       blobs   per document: a copy of the PDF, only for PDFs added one by one (folders are read in place, read-only)
 *       meta    schema version
 *
 *   "pdf-cross-search-user"   USER DATA — cannot be regenerated, never evicted by this app
 *       folders   the folder list (with directory handles)
 *       annots    bookmarks, notes, region highlights — keyed by content hash + page
 *       cites     citation fields the owner corrected, page-label offsets — keyed by content hash
 *       history   search history
 *       kv        dictionary edits, last session, backup bookkeeping, version links (old hash -> new hash)
 *
 * When storage runs short this app only ever drops regenerable data (thumbnails first).
 *
 * SCHEMA history
 *   1  (r2-p1) one database holding everything, no generation numbers, no metadata
 *   2  user data moved to its own database; documents carry sha256 / meta / labels / gen
 */
(function (root) {
  'use strict';
  const PS = (root.PS = root.PS || {});
  const SCHEMA = (PS.SCHEMA = 2);
  const DBS = {
    index: { name: 'pdf-cross-search-2', version: 2, stores: ['docs', 'text', 'geom', 'thumbs', 'blobs', 'meta', /* schema 1 leftovers, emptied by the migration: */ 'folders', 'annots', 'kv'] },
    user: { name: 'pdf-cross-search-user', version: 1, stores: ['folders', 'annots', 'cites', 'history', 'kv'] },
  };
  const DB_OF = { docs: 'index', text: 'index', geom: 'index', thumbs: 'index', blobs: 'index', meta: 'index', folders: 'user', annots: 'user', cites: 'user', history: 'user', kv: 'user' };
  const KEYPATH = { docs: 'id', folders: 'id', annots: 'id', text: 'id', cites: 'id', history: 'id' };

  const reqP = (req) => new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });

  let openP = null;
  let mem = null; // Map per store when IndexedDB is unavailable
  const handles = {};

  function openDb(which) {
    const def = DBS[which];
    return new Promise((resolve, reject) => {
      let req;
      try { req = indexedDB.open(def.name, def.version); } catch (e) { return reject(e); }
      req.onupgradeneeded = () => {
        const d = req.result;
        for (const s of def.stores) if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, KEYPATH[s] ? { keyPath: KEYPATH[s] } : undefined);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('blocked'));
    });
  }

  // schema 1 -> 2: user data lived in the index database; copy it out, then empty the old stores
  async function migrate(index, user) {
    const info = await reqP(index.transaction('meta').objectStore('meta').get('schema'));
    const from = info ? info.value : null;
    const result = { from: from == null ? 'new' : from, to: SCHEMA, moved: 0 };
    if (from === SCHEMA) return result;
    const legacy = ['folders', 'annots', 'kv'];
    const t = index.transaction(legacy, 'readonly');
    const dump = await Promise.all(legacy.map((s) => Promise.all([reqP(t.objectStore(s).getAll()), reqP(t.objectStore(s).getAllKeys())])));
    const hadDocs = (await reqP(index.transaction('docs').objectStore('docs').count())) > 0;
    const moved = dump.reduce((n, [vals]) => n + vals.length, 0);
    if (moved) {
      await new Promise((resolve, reject) => {
        const w = user.transaction(legacy, 'readwrite');
        w.oncomplete = resolve; w.onerror = w.onabort = () => reject(w.error);
        legacy.forEach((s, i) => { const [vals, keys] = dump[i]; vals.forEach((v, k) => { if (KEYPATH[s]) w.objectStore(s).put(v); else w.objectStore(s).put(v, keys[k]); }); });
      });
    }
    await new Promise((resolve, reject) => {
      const w = index.transaction([...legacy, 'meta'], 'readwrite');
      w.oncomplete = resolve; w.onerror = w.onabort = () => reject(w.error);
      for (const s of legacy) w.objectStore(s).clear();
      w.objectStore('meta').put({ value: SCHEMA, from: from == null ? (hadDocs || moved ? 1 : null) : from, at: Date.now(), moved }, 'schema');
    });
    result.moved = moved;
    if (from == null && (hadDocs || moved)) result.from = 1;
    return result;
  }

  const Store = (PS.store = {
    persistent: true,
    migration: null,   // { from, to, moved } of this launch
    persisted: null,   // navigator.storage.persist() result

    /** Opens both databases (migrating if needed); falls back to memory. Resolves to true when data will survive a restart. */
    open() {
      if (!openP) {
        openP = Promise.all([openDb('index'), openDb('user')]).then(async ([index, user]) => {
          handles.index = index; handles.user = user;
          Store.migration = await migrate(index, user);
          // ask the browser not to evict this origin's storage; the answer is recorded, not assumed
          try { Store.persisted = navigator.storage && navigator.storage.persist ? await navigator.storage.persist() : null; } catch (_) { Store.persisted = null; }
        }).catch((err) => {
          mem = new Map(Object.keys(DB_OF).map((s) => [s, new Map()]));
          Store.persistent = false;
          Store.openError = String((err && err.message) || err);
        });
      }
      return openP.then(() => Store.persistent);
    },

    get(store, key) {
      return Store.open().then(() => {
        if (mem) return mem.get(store).get(key);
        return reqP(handles[DB_OF[store]].transaction(store, 'readonly').objectStore(store).get(key));
      });
    },

    /** All values of a store (optionally only keys in [lower, upper]). */
    getAll(store, lower, upper) {
      return Store.open().then(() => {
        if (mem) {
          const out = [];
          for (const [k, v] of mem.get(store)) if ((lower == null || k >= lower) && (upper == null || k <= upper)) out.push(v);
          return out;
        }
        const range = lower != null ? IDBKeyRange.bound(lower, upper) : undefined;
        return reqP(handles[DB_OF[store]].transaction(store, 'readonly').objectStore(store).getAll(range));
      });
    },

    /** Values in key order, `count` at a time: resolves to { values, lastKey } (lastKey = null at the end). */
    page(store, afterKey, count) {
      return Store.open().then(() => {
        if (mem) {
          const keys = [...mem.get(store).keys()].sort().filter((k) => afterKey == null || k > afterKey).slice(0, count);
          return { values: keys.map((k) => mem.get(store).get(k)), lastKey: keys.length === count ? keys[keys.length - 1] : null };
        }
        const os = handles[DB_OF[store]].transaction(store, 'readonly').objectStore(store);
        const range = afterKey == null ? undefined : IDBKeyRange.lowerBound(afterKey, true);
        return Promise.all([reqP(os.getAll(range, count)), reqP(os.getAllKeys(range, count))])
          .then(([values, keys]) => ({ values, lastKey: keys.length === count ? keys[keys.length - 1] : null }));
      });
    },

    /**
     * Apply several writes. Writes to one database are one transaction (all or nothing):
     *   { put: store, value, key? }   { del: store, key }   { delPrefix: store, prefix }   { clear: store }
     */
    batch(ops) {
      return Store.open().then(() => {
        if (mem) {
          for (const op of ops) {
            if (op.put) { const m = mem.get(op.put); m.set(op.key != null ? op.key : op.value[KEYPATH[op.put]], op.value); }
            else if (op.del) mem.get(op.del).delete(op.key);
            else if (op.delPrefix) { const m = mem.get(op.delPrefix); for (const k of [...m.keys()]) if (String(k).startsWith(op.prefix)) m.delete(k); }
            else if (op.clear) mem.get(op.clear).clear();
          }
          return;
        }
        const run = (which) => {
          const mine = ops.filter((op) => DB_OF[op.put || op.del || op.delPrefix || op.clear] === which);
          if (!mine.length) return null;
          const names = [...new Set(mine.map((op) => op.put || op.del || op.delPrefix || op.clear))];
          return new Promise((resolve, reject) => {
            const t = handles[which].transaction(names, 'readwrite', { durability: which === 'user' ? 'strict' : 'relaxed' });
            t.oncomplete = () => resolve();
            t.onerror = t.onabort = () => reject(t.error || new Error('IndexedDB'));
            for (const op of mine) {
              if (op.put) { const os = t.objectStore(op.put); if (KEYPATH[op.put]) os.put(op.value); else os.put(op.value, op.key); }
              else if (op.del) t.objectStore(op.del).delete(op.key);
              else if (op.delPrefix) t.objectStore(op.delPrefix).delete(IDBKeyRange.bound(op.prefix, op.prefix + '￿'));
              else if (op.clear) t.objectStore(op.clear).clear();
            }
          });
        };
        return Promise.all([run('index'), run('user')]).then(() => {});
      });
    },

    put(store, value, key) { return Store.batch([{ put: store, value, key }]); },
    del(store, key) { return Store.batch([{ del: store, key }]); },

    /** { usage, quota } in bytes as the browser reports them (null when it does not). */
    estimate() {
      try { return navigator.storage.estimate().then((e) => ({ usage: e.usage, quota: e.quota }), () => null); } catch (_) { return Promise.resolve(null); }
    },

    /** PDFs kept by the first version of this app (database "pdf-cross-search"): hand them over once (dropLegacy() afterwards). */
    async takeLegacy() {
      if (mem || !indexedDB.databases) return [];
      try {
        const list = await indexedDB.databases();
        if (!list.some((d) => d.name === 'pdf-cross-search')) return [];
        const old = await new Promise((resolve, reject) => { const r = indexedDB.open('pdf-cross-search'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
        const out = [];
        if (old.objectStoreNames.contains('meta') && old.objectStoreNames.contains('blobs')) {
          const metas = await reqP(old.transaction('meta', 'readonly').objectStore('meta').getAll());
          for (const m of metas) {
            const blob = await reqP(old.transaction('blobs', 'readonly').objectStore('blobs').get(m.id));
            if (blob) out.push(new File([blob], String(m.name || 'document.pdf').split('/').pop(), { type: 'application/pdf', lastModified: m.mtime || Date.now() }));
          }
        }
        old.close();
        return out;
      } catch (_) { return []; }
    },
    dropLegacy() { try { indexedDB.deleteDatabase('pdf-cross-search'); } catch (_) {} },
  });

  const pad = (n) => String(n).padStart(6, '0');
  /** Key of one page in the geom / thumbs stores. */
  PS.pageKey = (docId, no) => docId + ':' + pad(no);
})(window);
