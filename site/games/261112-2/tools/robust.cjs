// 壊れにくさの検証: 複数指・連打・回転・非表示復帰・保存拒否/破損・WebGL失敗・音拒否・放置・自動低負荷・Pagesサブフォルダ
// 使い方: node robust.cjs [項目名...]
const { open, rec, chromium, ARGS } = require('./lib.cjs');
const http = require('http'); const fs = require('fs'); const path = require('path');
const f = (v) => (typeof v === 'number' ? +v.toFixed(4) : v);
const R = { checks: {} }; const ok = (name, cond, info) => { R.checks[name] = { pass: !!cond, info }; console.log((cond ? 'PASS ' : 'FAIL ') + name, info === undefined ? '' : JSON.stringify(info)); };
const KEY = 'gf-261112-2.duckbath';
const clean = (T) => T.log.errors.length === 0 && T.log.requests.length === 0;
const tests = {
  async multitouch() {
    const T = await open(); let tg = await T.tg(); const pt = (x, y, id) => ({ x, y, id, radiusX: 8, radiusY: 8, force: 1 });
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt(tg.handle.x, tg.handle.y, 1)] }); await T.wait(200);
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pt(tg.handle.x - 30, tg.handle.y + 10, 1)] }); await T.wait(200);
    // 二本目の指であひるに触れても、最初の指の操作だけが続く
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt(tg.handle.x - 30, tg.handle.y + 10, 1), pt(tg.kid.x, tg.kid.y, 2)] }); await T.wait(250);
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pt(tg.handle.x - 60, tg.handle.y + 20, 1), pt(tg.kid.x + 80, tg.kid.y - 60, 2)] }); await T.wait(300);
    let s = await T.st(); const mid = { drag: s.drag, open: f(s.open), kid: s.ducks[1].mode };
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [pt(tg.handle.x - 60, tg.handle.y + 20, 1)] }); await T.wait(200);
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pt(tg.handle.x - 75, tg.handle.y + 25, 1)] }); await T.wait(250); const s2 = await T.st();
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await T.wait(300); const s3 = await T.st();
    // 三本同時に置いても壊れない
    await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt(200, 500, 5), pt(400, 700, 6), pt(600, 600, 7)] }); await T.wait(300); await T.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await T.wait(500); const s4 = await T.st();
    ok('multitouch_first_finger_only', mid.drag === 'handle' && mid.kid === 'tub' && s2.open > mid.open - 0.001 && s3.drag === null && s4.drag === null && s4.ducks.every((d) => d.mode !== 'held') && clean(T), { mid, openAfter: f(s2.open), endDrag: s3.drag, errors: T.log.errors });
    await T.close();
  },
  async rapid() {
    const T = await open(); let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 60; i++) { const x = 20 + rnd() * 780, y = 20 + rnd() * 1140; await T.down(x, y); if (i % 3 === 0) await T.move(x + rnd() * 80 - 40, y + rnd() * 80 - 40); await T.up(); }
    let tg = await T.tg(); for (let i = 0; i < 14; i++) await T.tap(tg.handle.x, tg.handle.y); for (let i = 0; i < 10; i++) await T.tap(tg.kid.x, tg.kid.y);
    await T.wait(1500); const s = await T.st(); const fin = [s.level, s.vol, s.open, ...s.ducks.flatMap((d) => [d.x, d.y, d.z, d.h, ...d.wet, ...d.foam])].every((v) => Number.isFinite(v));
    ok('rapid_taps_no_break', fin && s.drag === null && s.ducks.every((d) => d.mode === 'tub') && s.level > -0.34 && s.level < 0.007 && clean(T), { level: f(s.level), open: f(s.open), stage: s.stage, ducks: s.ducks.map((d) => [d.mode, f(d.x), f(d.z)]), errors: T.log.errors });
    await T.close();
  },
  async rotate() {
    const T = await open({ w: 820, h: 1180 }); let tg = await T.tg(); await T.down(tg.kid.x, tg.kid.y); await T.wait(300); await T.move(tg.kid.x + 60, tg.kid.y - 30); await T.wait(300); const held = (await T.st()).ducks[1].mode;
    await T.page.setViewportSize({ width: 1180, height: 820 }); await T.page.waitForFunction(() => window.__duckbath.w === 1180, null, { timeout: 60000, polling: 200 }); await T.wait(800); await T.settle(15000); let s = await T.st(); /* 描画が遅い環境では resize の反映とカメラの落ち着きを待つ */ tg = await T.tg(); const vis = (p) => p.x > 0 && p.x < 1180 && p.y > 0 && p.y < 820;
    ok('rotate_releases_grab_and_reframes', held === 'held' && s.drag === null && s.ducks[1].mode === 'tub' && vis(tg.handle) && vis(tg.kid) && vis(tg.parent), { heldBefore: held, after: s.ducks[1].mode, handle: [f(tg.handle.x), f(tg.handle.y)] });
    await T.up(); await T.drag([[tg.handle.x, tg.handle.y], [tg.handle.x - 70, tg.handle.y + 20]], 400); s = await T.st(); const o1 = s.open;
    await T.page.setViewportSize({ width: 375, height: 667 }); await T.page.waitForFunction(() => window.__duckbath.w === 375, null, { timeout: 60000, polling: 200 }); await T.wait(800); await T.page.setViewportSize({ width: 820, height: 1180 }); await T.page.waitForFunction(() => window.__duckbath.w === 820, null, { timeout: 60000, polling: 200 }); await T.wait(800); await T.settle(15000); tg = await T.tg(); await T.tap(tg.handle.x, tg.handle.y); await T.wait(900); s = await T.st();
    ok('rotate_back_and_play_on', o1 > 0.2 && s.open < 0.05 && clean(T), { openAfterLandscapeDrag: f(o1), openAfterTap: f(s.open), errors: T.log.errors }); await T.close();
  },
  async hidden() {
    const T = await open(); let tg = await T.tg(); await T.tap(tg.handle.x, tg.handle.y); await T.wait(800); tg = await T.tg(); await T.down(tg.kid.x, tg.kid.y); await T.wait(400); const a = await T.st();
    await T.ev(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
    await T.wait(300); const h1 = await T.ev(() => ({ run: window.__duckbath.isRunning(), frame: window.__duckbath.frame, st: window.__duckbath.debug.state() })); await T.wait(5000); const h2 = await T.ev(() => ({ run: window.__duckbath.isRunning(), frame: window.__duckbath.frame, st: window.__duckbath.debug.state() }));
    ok('hidden_stops_progress', !h1.run && h2.frame === h1.frame && h2.st.simT === h1.st.simT && h2.st.level === h1.st.level && h1.st.audio !== 'running', { frames: [h1.frame, h2.frame], simT: [f(h1.st.simT), f(h2.st.simT)], audio: h1.st.audio });
    await T.ev(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
    await T.wait(700); const b = await T.st(); ok('resume_releases_grab_no_time_jump', a.ducks[1].mode === 'held' && b.running && b.drag === null && b.ducks[1].mode === 'tub' && b.simT - h1.st.simT < 1.5 && b.level - h1.st.level < 0.01, { heldBefore: a.ducks[1].mode, kidAfter: b.ducks[1].mode, simJump: f(b.simT - h1.st.simT), levelJump: f(b.level - h1.st.level), audio: b.audio });
    await T.up(); tg = await T.tg(); await T.tap(tg.handle.x, tg.handle.y); await T.wait(800); const c = await T.st(); ok('resume_play_on', c.open < 0.05 && clean(T), { open: f(c.open), errors: T.log.errors }); await T.close();
  },
  async storage() {
    const play = async (T) => { let tg = await T.tg(); await T.tap(tg.handle.x, tg.handle.y); await T.wait(1500); const s = await T.st(); return s; };
    let T = await open({ q: 'q=low&rs=0.3&lite=1&simcap=0.25', init: `Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('denied', 'SecurityError'); } });` });
    let s = await play(T); await T.ev(() => { document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('pagehide')); }); await T.wait(300);
    ok('storage_denied_still_plays', s.stage === 1 && s.flow > 0.1 && clean(T), { flow: f(s.flow), errors: T.log.errors }); await T.close();
    T = await open({ q: 'q=low&rs=0.3&lite=1&simcap=0.25', init: `Storage.prototype.setItem = function () { throw new DOMException('full', 'QuotaExceededError'); };` }); s = await play(T); const saved = await T.ev(() => window.__duckbath.debug.save());
    ok('storage_quota_still_plays', s.flow > 0.1 && saved === false && clean(T), { flow: f(s.flow), saveReturned: saved, errors: T.log.errors }); await T.close();
    const bad = { broken_json: '{"v":3,"stage":2,', wrong_version: JSON.stringify({ v: 1, stage: 3 }), out_of_range: JSON.stringify({ v: 3, t: 1, stage: 9, scene: 2, vol: 55, ring: 0, card: 0, ducks: [], foam: [], towel: '', bed: '' }), wrong_types: JSON.stringify({ v: 3, t: 1, stage: '4', scene: 2, vol: 'NaN', ring: null, ducks: [{ k: 'parent', m: 'sky', x: 'a', z: 0, h: 0, wet: [9, 9, 9, 9], foam: [0, 0, 0] }, { k: 'kid' }], foam: [1, 2], towel: 5, bed: {} }), nan_values: '{"v":3,"t":1,"stage":3,"scene":3,"vol":1e999,"ring":0,"card":0,"cycles":0,"ducks":[{"k":"parent","m":"tub","x":0,"z":0,"h":0,"wet":[0,0,0,0],"foam":[0,0,0,0]},{"k":"kid","m":"tub","x":1e9,"z":0,"h":0,"wet":[0,0,0,0],"foam":[0,0,0,0]}],"foam":[],"towel":"","bed":""}', huge: 'x'.repeat(400000), bad_strings: JSON.stringify({ v: 3, t: 1, stage: 3, scene: 3, vol: 0.1, ring: 0, card: 0, cycles: 0, ducks: [{ k: 'parent', m: 'tub', x: 0, z: 0, h: 0, wet: [0, 0, 0, 0], foam: [0, 0, 0, 0] }, { k: 'kid', m: 'tub', x: 0.1, z: 0, h: 0, wet: [0, 0, 0, 0], foam: [0, 0, 0, 0] }], foam: [], towel: 'zz', bed: '\u0000￿' }) };
    const res = {};
    for (const [name, val] of Object.entries(bad)) { T = await open({ q: 'q=low&rs=0.3&lite=1&simcap=0.25', init: `try { localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(val)}); } catch (e) {}` }); s = await play(T); const loaded = await T.ev(() => window.__duckbath.loaded); res[name] = { stage: s.stage, flow: f(s.flow), loaded, level: f(s.level), errors: T.log.errors.length }; await T.close(); }
    // 文字列だけ壊れた保存は、読める部分(段階と位置)だけ使い、濡れ跡は空で始まる
    ok('storage_corrupt_starts_playable', Object.entries(res).every(([k, v]) => v.flow > 0.1 && v.errors === 0 && Number.isFinite(v.level) && (k === 'bad_strings' ? v.stage === 3 : v.stage === 1 && v.loaded === false)), res);
  },
  async webgl() {
    const T = await open({ noWait: true, q: '', init: `const og = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t) { if (/webgl/i.test(t)) return null; return og.apply(this, arguments); };` });
    await T.wait(2500); const r = await T.ev(() => { const fb = document.getElementById('fb'); const cs = getComputedStyle(fb); return { fallback: !!(window.__duckbath && window.__duckbath.fallback), display: cs.display, src: (fb.src || '').slice(0, 22), natural: [fb.naturalWidth, fb.naturalHeight], rect: [fb.getBoundingClientRect().width, fb.getBoundingClientRect().height], canvas: getComputedStyle(document.getElementById('gl')).display, veil: getComputedStyle(document.getElementById('veil')).opacity }; });
    await T.tap(300, 500); await T.wait(300); await T.page.screenshot({ path: path.resolve(__dirname, 'shots/fallback_webgl_fail.png') });
    ok('webgl_fail_shows_embedded_still', r.fallback && r.display === 'block' && r.src.startsWith('data:image/jpeg') && r.natural[0] > 300 && r.rect[0] > 300 && r.canvas === 'none' && clean(T), Object.assign(r, { errors: T.log.errors })); await T.close();
  },
  async audio() {
    let T = await open({ init: `window.AudioContext = function () { throw new Error('audio blocked'); }; window.webkitAudioContext = undefined;` }); let tg = await T.tg(); await T.drag([[tg.handle.x, tg.handle.y], [tg.handle.x - 70, tg.handle.y + 20]], 400); await T.wait(600); let s = await T.st();
    ok('audio_refused_game_continues', s.audio === 'failed' && s.open > 0.2 && s.flow > 0.1 && clean(T), { audio: s.audio, open: f(s.open), errors: T.log.errors }); await T.close();
    T = await open({ init: `const OA = window.AudioContext; window.AudioContext = function () { const c = new OA(); c.resume = () => Promise.reject(new Error('not allowed')); c.suspend(); return c; };` }); tg = await T.tg(); await T.drag([[tg.handle.x, tg.handle.y], [tg.handle.x - 70, tg.handle.y + 20]], 400); await T.wait(600); s = await T.st();
    ok('audio_resume_rejected_game_continues', s.open > 0.2 && s.flow > 0.1 && clean(T), { audio: s.audio, open: f(s.open), errors: T.log.errors }); await T.close();
    T = await open(); const before = (await T.st()).audio; tg = await T.tg(); await T.down(tg.handle.x, tg.handle.y); await T.wait(300); const after = (await T.st()).audio; await T.up(); ok('audio_starts_only_after_first_touch', before === 'none' && after === 'running', { before, after }); await T.close();
  },
  async idle() {
    const T = await open(); const a = await T.st(); let hints = 0, on = false; const t0 = Date.now(); while (Date.now() - t0 < 50000) { const s = await T.st(); if (s.handOn && !on) hints++; on = s.handOn; await T.wait(300); }
    const b = await T.st(); ok('idle_50s_stable', hints >= 2 && Math.abs(b.level - a.level) < 0.003 && b.stage === 1 && b.ducks.every((d, i) => d.mode === 'tub' && Math.hypot(d.x - a.ducks[i].x, d.z - a.ducks[i].z) < 0.05) && clean(T), { hintsShown: hints, level: [f(a.level), f(b.level)], simT: f(b.simT), errors: T.log.errors }); await T.close();
  },
  async autolow() {
    // 品質固定なしで起動すると、遅い環境では解像度→低負荷モードの順に自動で下がる。その状態でも操作が成立する
    const T = await open({ q: 'fresh=1&simcap=0.25', w: 820, h: 1180 }); const s0 = await T.st(); const s = await T.until((st) => st.low, 120000, 1000);
    ok('auto_lowers_resolution_then_low_mode', !!s && s.scale <= 0.56 && s.perfLog.length >= 2, s ? { before: { low: s0.low, scale: s0.scale }, after: { low: s.low, scale: f(s.scale) }, log: s.perfLog } : null);
    let tg = await T.tg(); await T.drag([[tg.handle.x, tg.handle.y], [tg.handle.x - 70, tg.handle.y + 20]], 400); const fl = await T.until((st) => st.ducks[1].floating, 120000, 1000); ok('low_mode_keeps_core_play', !!fl && clean(T), fl && { level: f(fl.level), low: fl.low, errors: T.log.errors }); await T.close();
  },
  async pages() {
    // Pages のサブフォルダ配信を模して http で開く
    const root = path.resolve(__dirname, '../../..'); const srv = http.createServer((q, r) => { const p = decodeURIComponent(q.url.split('?')[0]); if (!p.startsWith('/261112/')) { r.writeHead(404); return r.end(); } const fp = path.join(root, p.replace('/261112/', '')); fs.readFile(fp, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(d); }); });
    await new Promise((res) => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port; const url = `http://127.0.0.1:${port}/261112/games/261112-2/index.html`;
    const T = await open({ url }); const reqs = T.log.requests.filter((u) => !u.startsWith(url)); let tg = await T.tg(); await T.tap(tg.handle.x, tg.handle.y); await T.wait(1200); const s = await T.st();
    ok('pages_subfolder_boots_single_file', s.flow > 0.1 && reqs.length === 0 && T.log.errors.length === 0, { url: '/261112/games/261112-2/index.html', otherRequests: reqs, errors: T.log.errors }); await T.close(); srv.close();
  },
};
(async () => { const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(tests); const t0 = Date.now(); for (const n of names) { try { await tests[n](); } catch (e) { ok(n + '_crashed', false, String(e && e.stack || e).slice(0, 600)); require('child_process').spawnSync('pkill', ['-f', 'chrome']); } }
  let prev = {}; const fp = path.resolve(__dirname, 'results/robust.json'); try { prev = JSON.parse(fs.readFileSync(fp, 'utf8')).checks || {}; } catch (e) { /* 初回 */ }
  R.checks = Object.assign(prev, R.checks); R.passed = Object.values(R.checks).filter((c) => c.pass).length; R.total = Object.keys(R.checks).length; rec('robust', R); console.log(`== robust ${R.passed}/${R.total} pass, ${((Date.now() - t0) / 1000).toFixed(0)}s`); process.exit(0); })();
