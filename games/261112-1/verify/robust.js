// Robustness checks with real touch input: extra fingers, cancel, rapid taps, rotation, hidden/visible,
// idle, save refused / corrupted / restored, WebGL missing, audio refused, low-load mode, both launch styles.
const fs = require('fs'), path = require('path'), http = require('http');
const { open } = require('./lib.js');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const R = { checks: [], notes: {}, started: new Date().toISOString() };
function check(name, ok, detail) { R.checks.push({ name, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); }
const Q = 'steps=20&dtmax=0.15', KEY = 'gf-261112-1-sentaku';
const sleevePull = async (T) => { const s = await T.part('shirt', 17), p = await T.pt(0, 0.45, 0.27); await T.drag([[s.x, s.y], [p.x, p.y]], 700, 250); return T.until(() => { const c = __G.cl.shirt; return c.loc === 'drum' && c.insert <= 0; }, null, 25000); };
const sane = (st) => Object.values(st.cloths).every((c) => ['basket', 'drum', 'rod', 'flat', 'held', 'person'].includes(c.loc) && c.grab === -1 && isFinite(c.cen[0]) && isFinite(c.cen[1]) && isFinite(c.cen[2]));

(async () => {
  // ---------- 1. extra finger, cancel, rapid taps, rotation, hidden, idle ----------
  {
    const T = await open({ w: 640, h: 440, q: Q }); await T.wait(1000);
    const s = await T.part('shirt', 17), port = await T.pt(0, 0.45, 0.27), hd = await T.ev(() => { const v = __G.W.handle.getWorldPosition(new (__G.cam.pos.constructor)()); return __T.pt(v.x, v.y, v.z); });
    let st = await T.state(); check('first touch not yet made: audio not started', st.audio === 'none', st.audio);
    await T.raw('touchStart', [{ x: s.x, y: s.y, id: 0 }]); await T.wait(200);
    st = await T.state(); check('first touch starts Web Audio', st.audio === 'running', st.audio);
    await T.raw('touchMove', [{ x: s.x + 30, y: s.y - 30, id: 0 }]); await T.wait(100);
    await T.raw('touchStart', [{ x: s.x + 30, y: s.y - 30, id: 0 }, { x: hd.x, y: hd.y, id: 1 }]); await T.wait(150);   // second finger on the door handle
    await T.raw('touchMove', [{ x: s.x + 60, y: s.y - 60, id: 0 }, { x: hd.x + 20, y: hd.y, id: 1 }]); await T.wait(150);
    await T.raw('touchMove', [{ x: s.x + 60, y: s.y - 60, id: 0 }]); await T.wait(300);   // the second finger lifts (CDP: a point missing from the list is released)
    st = await T.state(); check('a second finger is ignored: the sleeve stays held, the door handle did nothing', st.cloths.shirt.grab >= 0 && st.m.door === 1 && Object.values(st.cloths).filter((c) => c.grab >= 0).length === 1, { grab: st.cloths.shirt.grab, door: st.m.door });
    for (let i = 1; i <= 8; i++) { await T.raw('touchMove', [{ x: s.x + 60 + (port.x - s.x - 60) * i / 8, y: s.y - 60 + (port.y - s.y + 60) * i / 8, id: 0 }]); await T.wait(60); }
    await T.wait(200); await T.raw('touchEnd', []); await T.until(() => { const c = __G.cl.shirt; return c.loc === 'drum' && c.insert <= 0; }, null, 25000);
    st = await T.state(); check('the first finger finishes its drag normally', st.cloths.shirt.loc === 'drum' && sane(st));
    // cancel in the middle of a drag
    const g = await T.ev(() => { const G = __G, c = G.cl.towel; let b = null; for (let k = 0; k < c.n; k++) { const s = __T.part('towel', k), np = G.nearParticle(s.x, s.y, (o) => o.loc === 'basket'); if (np && np.c === c && (!b || __T.wpart('towel', k)[1] > b.wy)) b = { x: s.x, y: s.y, wy: __T.wpart('towel', k)[1] }; } return b; });
    await T.down(g.x, g.y); await T.wait(150); await T.move(g.x + 40, g.y - 80); await T.wait(200); await T.cancel(); await T.wait(2500);
    st = await T.state(); check('pointercancel mid-drag: the towel is let go and settles back in the basket', st.cloths.towel.loc === 'basket' && sane(st), st.cloths.towel.loc);
    // rapid tapping everywhere
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 60; i++) { const pts = [hd, port, s, { x: rnd() * 640, y: rnd() * 440 }, await T.pt(0.14, 0.785, 0.313)], p = pts[i % pts.length]; await T.down(p.x + (rnd() - 0.5) * 20, p.y + (rnd() - 0.5) * 20); await T.wait(20 + rnd() * 30); if (i % 3 === 0) await T.move(p.x + rnd() * 60, p.y - rnd() * 60); await T.up(); await T.wait(15); }
    await T.wait(4000); st = await T.state();
    check('60 rapid taps/flicks on handle, port, knob, cloth, empty space: no error, one owner per piece', T.errors.length === 0 && sane(st) && (st.m.door === 0 || st.m.door === 1 || st.m.door > 0), { door: st.m.door, latched: st.m.latched, locs: Object.fromEntries(Object.entries(st.cloths).map(([k, c]) => [k, c.loc])) });
    // rotation while holding something
    if (st.m.latched || st.m.door < 1) { await T.tap(hd.x, hd.y); await T.until(() => __G.washer.door >= 1 || __G.washer.door <= 0, null, 30000); }
    st = await T.state(); if (st.m.door < 1) { const h2 = await T.ev(() => { const v = __G.W.handle.getWorldPosition(new (__G.cam.pos.constructor)()); return __T.pt(v.x, v.y, v.z); }); await T.tap(h2.x, h2.y); await T.until(() => __G.washer.door >= 1, null, 60000); await T.wait(800); }
    const g2 = await T.ev(() => { const G = __G; for (const id of ['towel', 'sockA', 'sockB']) { const c = G.cl[id]; if (c.loc !== 'basket') continue; for (let k = 0; k < c.n; k++) { const s = __T.part(id, k), np = G.nearParticle(s.x, s.y, (o) => o.loc === 'basket'); if (np && np.c === c) return { x: s.x, y: s.y, id }; } } return null; });
    await T.down(g2.x, g2.y); await T.wait(200); await T.move(g2.x + 30, g2.y - 60); await T.wait(150);
    await T.p.setViewportSize({ width: 440, height: 640 }); await T.wait(1500);
    st = await T.state(); check('rotating to portrait while holding a piece: it is released, layout re-fits', sane(st) && st.view === 'wash-load', { view: st.view });
    await T.up().catch(() => {}); await T.shot(path.join(OUT, 'robust_rotated.png'));
    const pp = await T.pt(0, 0.45, 0.27), sp = await T.ev(() => { const b = __G.basket; return __T.pt(b.x, b.y + 0.2, b.z); });
    check('after rotation the port and the basket are both inside the portrait screen', pp.x > 0 && pp.x < 440 && pp.y > 0 && pp.y < 640 && sp.x > 0 && sp.x < 440 && sp.y > 0 && sp.y < 640, { port: [pp.x | 0, pp.y | 0], basket: [sp.x | 0, sp.y | 0] });
    await T.p.setViewportSize({ width: 640, height: 440 }); await T.wait(1200);
    // hidden / visible
    const t0 = (await T.state()).time, f0 = (await T.state()).frames;
    const other = await T.ctx.newPage(); await other.goto('about:blank'); await other.bringToFront(); await T.wait(300);
    let hidden = await T.ev(() => document.hidden), how = 'second tab brought to front';
    if (!hidden) { how = 'synthetic visibilitychange (headless tab stayed visible)'; await T.ev(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); }); hidden = true; }
    const t1 = (await T.state()).time; await new Promise((r) => setTimeout(r, 4000)); const t2 = (await T.state()).time;
    if (how.startsWith('synthetic')) await T.ev(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); }); else { await T.p.bringToFront(); await other.close(); }
    await T.wait(700); const t3 = (await T.state()).time;
    check('hidden: game time stops; visible again: it continues without adding the time away', t2 - t1 < 0.11 && t3 - t2 < 1.2 && t3 > t2, { how, hiddenAdvance: +(t2 - t1).toFixed(3), afterReturn: +(t3 - t2).toFixed(3) });
    R.notes.hiddenMethod = how;
    // idle
    const hint0 = await T.ev(() => __G.hint.count); await T.wait(16000); st = await T.state(); const hint1 = await T.ev(() => __G.hint.count);
    check('left alone for 16 s: nothing breaks, at most one new finger demo for the current step', sane(st) && T.errors.length === 0 && hint1 - hint0 <= 1, { demos: hint1 - hint0 });
    check('no console errors / external requests in this session', T.errors.length === 0 && T.requests.length === 0, { errors: T.errors, requests: T.requests });
    await T.close();
  }
  // ---------- 2. saves ----------
  for (const f of ['save_s4.json', 'save_s5.json']) {
    const fp = path.join(OUT, f); if (!fs.existsSync(fp) || !fs.readFileSync(fp, 'utf8')) { check('restore ' + f, false, 'no save captured by play.js'); continue; }
    const json = fs.readFileSync(fp, 'utf8'), want = JSON.parse(json);
    const T = await open({ w: 640, h: 440, q: Q, init: `try{localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(json)})}catch(e){}` }); await T.wait(2500);
    const st = await T.state(); const got = Object.fromEntries(Object.entries(st.cloths).map(([k, c]) => [k, c.loc]));
    const ok = st.station === want.station && Object.keys(want.cloths).every((k) => got[k] === want.cloths[k].loc) && st.cloths.sockA.inv === want.cloths.sockA.inv && Object.keys(want.cloths).every((k) => !want.cloths[k].flat || st.cloths[k].flat.folds === want.cloths[k].flat.folds.length) && Object.keys(want.cloths).every((k) => !want.cloths[k].rod || (st.cloths[k].rod && st.cloths[k].rod.holds.length === want.cloths[k].rod.holds.length));
    check('reload restores ' + f + ': station, where each piece is, folds, pins, inside-out sock', ok && T.errors.length === 0, { station: st.station, got, pins: st.dry.pins.filter((p) => p.state === 'on').length });
    await T.shot(path.join(OUT, 'robust_restore_' + f.replace('.json', '') + '.png')); await T.close();
  }
  {
    const T = await open({ w: 640, h: 440, q: Q, init: `Storage.prototype.setItem = function(){ throw new DOMException('denied', 'QuotaExceededError'); };` }); await T.wait(1000);
    const ok = await sleevePull(T); await T.wait(2500); const st = await T.state(), so = await T.ev(() => __G.saveOK);
    check('saving refused (setItem throws): play continues in memory, no error', !!ok && so === false && T.errors.length === 0, { saveOK: so, errors: T.errors }); await T.close();
  }
  {
    const T = await open({ w: 640, h: 440, q: Q, init: `Object.defineProperty(window, 'localStorage', { get(){ throw new DOMException('blocked', 'SecurityError'); } });` }); await T.wait(1000);
    const ok = await sleevePull(T); await T.wait(2500);
    check('storage blocked entirely (localStorage getter throws): starts and plays', !!ok && T.errors.length === 0, { errors: T.errors }); await T.close();
  }
  for (const [name, bad] of [['broken JSON', '{"v":3,"station":'], ['wrong version', JSON.stringify({ v: 1 })], ['out-of-range values', null]]) {
    let val = bad;
    if (val === null) { const fp = path.join(OUT, 'save_s4.json'); if (fs.existsSync(fp) && fs.readFileSync(fp, 'utf8')) { const o = JSON.parse(fs.readFileSync(fp, 'utf8')); o.standZ = 99; o.cloths.towel.wf = [1, 2, 'x']; o.cloths.shirt.rod = { id: 7, s: 1e9 }; val = JSON.stringify(o); } else val = '{"v":3,"station":"moon"}'; }
    const T = await open({ w: 640, h: 440, q: Q, init: `try{localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(val)})}catch(e){}` }); await T.wait(1000);
    const st0 = await T.state(), ok = await sleevePull(T);
    check('corrupted save (' + name + '): rejected, starts from the beginning and is playable', st0.station === 'wash' && st0.cloths.towel.loc === 'basket' && !!ok && T.errors.length === 0, { errors: T.errors }); await T.close();
  }
  // ---------- 3. WebGL missing ----------
  for (const [name, o] of [['getContext returns null', { init: `const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(t){ return /webgl/.test(t) ? null : g.apply(this, arguments); };` }], ['browser started with --disable-3d-apis', { args: ['--disable-3d-apis'] }]]) {
    const T = await open(Object.assign({ w: 640, h: 440 }, o)); await T.wait(800);
    const fb = await T.ev(() => ({ shown: getComputedStyle(document.getElementById('fb')).display, img: getComputedStyle(document.getElementById('fb')).backgroundImage.slice(0, 22), bytes: getComputedStyle(document.getElementById('fb')).backgroundImage.length, canvas: getComputedStyle(document.getElementById('c')).display, hasT: !!window.__T }));
    check('WebGL unavailable (' + name + '): embedded still picture is shown instead, no error', fb.shown === 'block' && fb.img.includes('data:image/jpeg') && fb.bytes > 20000 && fb.canvas === 'none' && T.errors.length === 0, Object.assign(fb, { errors: T.errors }));
    await T.shot(path.join(OUT, 'robust_nowebgl.png')); await T.close();
  }
  // ---------- 4. audio refused ----------
  {
    const T = await open({ w: 640, h: 440, q: Q, init: `window.AudioContext = function(){ throw new Error('audio refused'); }; window.webkitAudioContext = window.AudioContext;` }); await T.wait(1000);
    const ok = await sleevePull(T); const st = await T.state();
    check('audio refused (AudioContext throws): silent, game still plays', !!ok && st.audio === 'failed' && T.errors.length === 0, { audio: st.audio, errors: T.errors }); await T.close();
  }
  // ---------- 5. low-load mode keeps the mechanics ----------
  {
    const T = await open({ w: 640, h: 440, q: Q + '&low=1' }); await T.wait(1000);
    const ok = await sleevePull(T); const st = await T.state();
    check('forced low-load mode (?low=1): same interaction works', !!ok && st.low === true && T.errors.length === 0, { fps: +st.fps.toFixed(1) }); R.notes.lowFps640 = +st.fps.toFixed(1); await T.close();
  }
  {
    const T = await open({ w: 1180, h: 820 }); await T.wait(20000); const st = await T.state();
    check('dynamic resolution reacts to slow frames (software GL at 1180x820): scale drops, low-load mode engages by itself', st.res < 1 || st.low, { fps: +st.fps.toFixed(1), resScale: st.res, low: st.low }); R.notes.auto = { fps: +st.fps.toFixed(1), resScale: st.res, low: st.low };
    const ok = await sleevePull(T); check('and the game is still playable in that state', !!ok && T.errors.length === 0); await T.close();
  }
  // ---------- 6. served from a Pages-style sub folder ----------
  {
    const root = path.resolve(__dirname, '..', '..', '..'); const hits = [];
    const srv = http.createServer((req, res) => { hits.push(req.url); const u = decodeURIComponent(req.url.split('?')[0]); if (!u.startsWith('/261112/')) { res.writeHead(404); return res.end(); } const fp = path.join(root, u.slice('/261112/'.length)); if (!fp.startsWith(root) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': fp.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' }); fs.createReadStream(fp).pipe(res); });
    await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${srv.address().port}`;
    const T = await open({ w: 640, h: 440, url: base + '/261112/games/261112-1/index.html', q: Q, base }); await T.wait(1000);
    const ok = await sleevePull(T);
    check('served over http from /261112/games/261112-1/: starts and plays, only index.html is requested', !!ok && T.errors.length === 0 && T.requests.length === 0 && hits.filter((h) => !h.includes('favicon')).length === 1, { requestsToServer: hits, external: T.requests }); await T.close(); srv.close();
  }
  R.pass = R.checks.filter((c) => c.ok).length; R.fail = R.checks.filter((c) => !c.ok).length; R.finished = new Date().toISOString();
  fs.writeFileSync(path.join(__dirname, 'results-robust.json'), JSON.stringify(R, null, 1));
  console.log(`\n${R.pass} passed, ${R.fail} failed`);
})();
