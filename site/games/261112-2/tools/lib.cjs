// 検証用の共通部品: ヘッドレスChromiumで実際のタッチ(Pointer Events)を送る
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FILE = 'file://' + path.resolve(__dirname, '../index.html');
const ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'];

async function open(opts = {}) {
  const browser = opts.browser || (await chromium.launch({ args: ARGS.concat(opts.args || []) }));
  const ctx = await browser.newContext({ viewport: { width: opts.w || 820, height: opts.h || 1180 }, hasTouch: true, isMobile: !!opts.mobile, deviceScaleFactor: opts.dsf || 1 });
  const page = await ctx.newPage(); const log = { errors: [], requests: [], console: [] };
  page.on('console', (m) => { const t = m.text(); if (/GPU stall|GL Driver Message/.test(t)) return; if (m.type() === 'error' || m.type() === 'warning') log.errors.push(m.type() + ': ' + t); else log.console.push(t); });
  page.on('pageerror', (e) => log.errors.push('pageerror: ' + e.message + '\n' + (e.stack || '')));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('file://') && !u.startsWith('data:') && !u.startsWith('blob:')) log.requests.push(u); });
  if (opts.init) await page.addInitScript(opts.init);
  const q = opts.q === undefined ? 'fresh=1&q=low&rs=0.3&lite=1&simcap=0.35' : opts.q;
  await page.goto((opts.url || FILE) + (q ? '?' + q : ''), { timeout: 120000 });
  if (!opts.noWait) await page.waitForFunction('window.__duckbath && window.__duckbath.ready', null, { timeout: 180000 });
  const cdp = await ctx.newCDPSession(page);
  const T = {
    browser, ctx, page, log, cdp,
    st: () => page.evaluate(() => window.__duckbath.debug.state()),
    tg: () => page.evaluate(() => window.__duckbath.debug.targets()),
    scr: (x, y, z) => page.evaluate(([a, b, c]) => window.__duckbath.debug.toScreen(a, b, c), [x, y, z]),
    ev: (fn, arg) => page.evaluate(fn, arg),
    wait: (ms) => page.waitForTimeout(ms),
    async down(x, y, id = 1) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id, radiusX: 8, radiusY: 8, force: 1 }] }); },
    async move(x, y, id = 1) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y, id, radiusX: 8, radiusY: 8, force: 1 }] }); },
    async up() { await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); },
    async tap(x, y) { await T.down(x, y); await page.waitForTimeout(60); await T.up(); },
    // pts: [[x,y],...] を ms 掛けてなぞる
    async drag(pts, ms = 900, opts2 = {}) {
      const steps = opts2.steps || Math.max(8, Math.round(ms / 45)); await T.down(pts[0][0], pts[0][1]); await page.waitForTimeout(opts2.hold || 90);
      for (let i = 1; i <= steps; i++) { const f = (i / steps) * (pts.length - 1); const k = Math.min(pts.length - 2, Math.floor(f)); const u = f - k; await T.move(pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u); await page.waitForTimeout(ms / steps); }
      if (opts2.keep) return; await page.waitForTimeout(opts2.endHold || 60); await T.up();
    },
    // 状態が条件を満たすまで待つ
    async until(fn, timeout = 30000, every = 250) { const t0 = Date.now(); for (;;) { const s = await T.st(); if (fn(s)) return s; if (Date.now() - t0 > timeout) return null; await page.waitForTimeout(every); } },
    async settle(timeout = 8000) { return T.until((s) => !s.camMoving, timeout, 150); },
    // 高品質に切り替えて撮影し、検証用の軽い設定へ戻す
    async shot(file, full = true) {
      const frames = async (n) => { const f0 = await page.evaluate(() => window.__duckbath.frame); await page.waitForFunction((a) => window.__duckbath.frame >= a, f0 + n, { timeout: 300000, polling: 200 }); };
      if (full) { await page.evaluate(() => window.__duckbath.debug.setQuality({ low: false, lite: false, scale: 1 })); await frames(5); }
      await page.screenshot({ path: file, timeout: 300000 });
      if (full) { await page.evaluate(() => window.__duckbath.debug.setQuality({ low: true, lite: true, scale: 0.3 })); await frames(2); }
    },
    // ワールド座標の列を画面座標へ
    async w2s(pts) { return page.evaluate((a) => a.map((p) => { const s = window.__duckbath.debug.toScreen(p[0], p[1], p[2]); return [s.x, s.y]; }), pts); },
    // 水面をなぞる(ワールドxzの列)
    async stroke(xz, ms = 900, o) { const s = await T.st(); const pts = await T.w2s(xz.map((p) => [p[0], s.level, p[1]])); await T.drag(pts, ms, o); },
    // あひるを運んで離す。dest=[x,z] へ来るまで指の位置を補正する
    async carry(name, dest, o = {}) {
      const i = name === 'parent' ? 0 : 1; let tg = await T.tg(); let px = tg[name].x, py = tg[name].y; await T.down(px, py); await page.waitForTimeout(250);
      for (let it = 0; it < (o.iters || 8); it++) { await T.settle(5000); const s = await T.st(); const d = s.ducks[i]; const a = await T.scr(d.x, d.y, d.z), b = await T.scr(dest[0], d.y, dest[1]); const ex = b.x - a.x, ey = b.y - a.y; if (Math.hypot(ex, ey) < 4 && it > 0) break; const vp = page.viewportSize(); const tx = Math.max(6, Math.min(vp.width - 6, px + ex)), ty = Math.max(6, Math.min(vp.height - 6, py + ey)); // 指は画面の外へは出ない
        const n = Math.max(2, Math.round(Math.hypot(tx - px, ty - py) / 40)); for (let k = 1; k <= n; k++) { await T.move(px + ((tx - px) * k) / n, py + ((ty - py) * k) / n); await page.waitForTimeout(o.stepMs || 60); } px = tx; py = ty; await page.waitForTimeout(350); }
      if (o.keep) return [px, py]; await T.settle(5000); await page.waitForTimeout(o.hold || 150); await T.up(); await page.waitForTimeout(o.after === undefined ? 900 : o.after);
    },
    // 保存データを書いて読み直す(探索用の近道。最終検証の通し遊びでは使わない)
    async preset(o) {
      await page.evaluate((o) => { const G = window.__duckbath; const W = G.water; G.noSave = true; const z = (n) => new Array(n + 1).join('0');
        const d = { v: 3, t: Date.now(), stage: o.stage || 4, scene: o.scene || 3, vol: +W.volAt(o.level === undefined ? -0.03 : o.level).toFixed(6), ring: o.ring || 0, card: 0, cycles: 0,
          ducks: o.ducks || [{ k: 'parent', m: 'tub', x: 0.12, z: 0.05, h: 2.8, wet: [0.3, 0.2, 1, 1], foam: [0.5, 0.3, 0.3, 0.3] }, { k: 'kid', m: 'tub', x: -0.05, z: -0.02, h: 0.3, wet: [0.2, 0.3, 1, 1], foam: [0, 0.2, 0.2, 0.2] }],
          foam: o.foam || (() => { const a = []; for (let i = 0; i < 70; i++) a.push(Math.round((Math.random() * 0.7 - 0.2) * 1000), Math.round((Math.random() * 0.4 - 0.2) * 1000), 180); return a; })(), towel: z(G.towel.n), bed: z(4096) };
        localStorage.setItem('gf-261112-2.duckbath', JSON.stringify(d)); }, o);
      await page.goto((opts.url || FILE) + '?' + q.replace('fresh=1&', ''), { timeout: 120000 }); await page.waitForFunction('window.__duckbath && window.__duckbath.ready', null, { timeout: 180000 }); await page.waitForTimeout(800);
    },
    async close() { await ctx.close(); if (!opts.browser) await browser.close(); },
  };
  return T;
}
function rec(name, data) { const dir = path.resolve(__dirname, 'results'); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify(data, null, 1)); }
module.exports = { open, rec, FILE, ARGS, chromium };
