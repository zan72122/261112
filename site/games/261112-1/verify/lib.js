// Playwright helper: real touch input through CDP (-> Pointer Events with pointerType "touch")
const { chromium } = require('playwright');
const path = require('path');
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'];
async function open(o = {}) {
  const w = o.w || 1180, h = o.h || 820;
  const b = await chromium.launch({ args: ARGS.concat(o.args || []) });
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: o.dpr || 1 });
  const p = await ctx.newPage();
  const T = { b, ctx, p, w, h, errors: [], requests: [], logs: [] };
  p.on('console', (m) => { T.logs.push(m.type() + ': ' + m.text()); if (m.type() === 'error') T.errors.push(m.text()); if (o.verbose) console.log('[console]', m.type(), m.text()); });
  p.on('pageerror', (e) => { T.errors.push('pageerror: ' + e.message); console.log('[pageerror]', e.message, (e.stack || '').split('\n').slice(0, 4).join(' | ')); });
  p.on('request', (r) => { const u = r.url(); if (!u.startsWith('file://') && !u.startsWith('data:') && !u.startsWith('blob:') && !(o.base && u.startsWith(o.base))) T.requests.push(u); });
  if (o.init) await p.addInitScript(o.init);
  const url = (o.url || ('file://' + path.resolve(__dirname, '..', 'index.html'))) + (o.q ? '?' + o.q : '');
  await p.goto(url);
  T.cdp = await ctx.newCDPSession(p);
  T.wait = (ms) => p.waitForTimeout(ms);
  T.state = () => p.evaluate(() => window.__T.state());
  T.ev = (f, a) => p.evaluate(f, a);
  T.pt = (x, y, z) => p.evaluate(([x, y, z]) => window.__T.pt(x, y, z), [x, y, z]);
  T.part = (id, k) => p.evaluate(([id, k]) => window.__T.part(id, k), [id, k]);
  T.down = (x, y, id = 0) => T.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id }] });
  T.move = (x, y, id = 0) => T.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y, id }] });
  T.up = () => T.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  T.cancel = () => T.cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  T.raw = (type, pts) => T.cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
  T.tap = async (x, y) => { await T.down(x, y); await T.wait(90); await T.up(); };
  // drag through points; pts: [[x,y],...]; ms: total time; hold: ms to wait before release
  T.drag = async (pts, ms = 900, hold = 150) => {
    await T.down(pts[0][0], pts[0][1]); await T.wait(120);
    const segs = pts.length - 1, steps = Math.max(6, Math.round(ms / 45 / segs));
    for (let s = 0; s < segs; s++) for (let i = 1; i <= steps; i++) { const t = i / steps; await T.move(pts[s][0] + (pts[s + 1][0] - pts[s][0]) * t, pts[s][1] + (pts[s + 1][1] - pts[s][1]) * t); await T.wait(ms / segs / steps); }
    await T.wait(hold); await T.up();
  };
  T.shot = (name, clip) => p.screenshot({ path: name, clip });
  T.until = async (fn, arg, timeout = 30000, step = 250) => { const t0 = Date.now(); for (;;) { const r = await p.evaluate(fn, arg); if (r) return r; if (Date.now() - t0 > timeout) return null; await T.wait(step); } };
  T.close = () => b.close();
  await p.waitForFunction(() => window.__T || document.getElementById('fb').style.display === 'block', null, { timeout: 30000 });
  return T;
}
module.exports = { open };
