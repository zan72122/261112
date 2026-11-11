// 検証用の共通道具: ヘッドレス Chromium を起動し、CDP のタッチ入力 (実際の Pointer Events 経路) で操作する。
// ゲーム内部の状態は読み取りのみ (window.__gf の読み取り専用関数)。状態を書き換えて進めることはしない。
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const require = createRequire('/opt/node-tools/node_modules/x.js');
export const { chromium } = require('playwright');
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FILE_URL = pathToFileURL(path.join(ROOT, 'index.html')).href;
export const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'];

export async function open(opts = {}) {
  const { w = 820, h = 1180, url = FILE_URL, query = '', init = null, storage = null, dsf = 1 } = opts;
  const browser = opts.browser || (await chromium.launch({ args: ARGS.concat(opts.args || []) }));
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const log = { errors: [], requests: [], console: [] };
  page.on('console', (m) => { log.console.push(m.type() + ': ' + m.text()); if (m.type() === 'error') log.errors.push(m.text()); });
  page.on('pageerror', (e) => log.errors.push('pageerror: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('data:') && !u.startsWith('blob:')) log.requests.push(u); });
  if (init) await page.addInitScript(init);
  if (storage) await page.addInitScript((s) => { try { for (const k in s) localStorage.setItem(k, s[k]); } catch (e) { /* */ } }, storage);
  await page.goto(url + query);
  const cdp = await ctx.newCDPSession(page);
  const g = {
    browser, ctx, page, log, cdp, w, h,
    ev: (fn, ...a) => page.evaluate(fn, ...a),
    info: () => page.evaluate(() => window.__gf.info()),
    state: () => page.evaluate(() => window.__gf.state()),
    q: (expr) => page.evaluate('window.__gf.' + expr),
    async ready() { await page.waitForFunction(() => window.__gf && (window.__gf.ready || window.__gf.failed), null, { timeout: 60000 }); await g.wait(0.6); },
    // ゲーム内時間で待つ (低速な描画環境でも同じ進行になる)
    async wait(sec) { const t0 = await page.evaluate(() => window.__gf.info().time); await page.waitForFunction((t) => window.__gf.info().time >= t, t0 + sec, { timeout: 120000, polling: 50 }); },
    async until(expr, timeout = 90000) { await page.waitForFunction(expr, null, { timeout, polling: 60 }); },
    async frames(n = 2) { const f0 = await page.evaluate(() => window.__gf.perf.frames); await page.waitForFunction((f) => window.__gf.perf.frames >= f, f0 + n, { timeout: 60000, polling: 20 }); },
    async touch(type, x, y, id = 1) { await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' || type === 'touchCancel' ? [] : [{ x, y, id, radiusX: 8, radiusY: 8, force: 1 }] }); },
    async down(x, y) { await g.touch('touchStart', x, y); await g.frames(1); },
    async move(x, y) { await g.touch('touchMove', x, y); await g.frames(1); },
    async up() { await g.touch('touchEnd', 0, 0); await g.frames(1); },
    async tap(x, y) { await g.down(x, y); await g.up(); },
    // 指でなぞる: from → to を steps 分割。hold 秒だけ終点で止める (ゲーム内時間)
    async drag(a, b, steps = 10, hold = 0.15) { await g.down(a.x, a.y); await g.slide(a, b, steps); if (hold) await g.wait(hold); await g.up(); },
    async slide(a, b, steps = 10) { for (let i = 1; i <= steps; i++) { await g.move(a.x + ((b.x - a.x) * i) / steps, a.y + ((b.y - a.y) * i) / steps); } },
    async shot(file) { await g.frames(2); await page.screenshot({ path: file }); },
    async close() { await ctx.close(); if (!opts.browser) await browser.close(); },
  };
  return g;
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
