// 使い方: node shot.cjs out.png [w] [h] [query] [waitMs]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [out, w = '820', h = '1180', q = '', wait = '1500'] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') { const t = m.text(); if (!/GPU stall|GL Driver Message/.test(t)) console.log('console', m.type(), t); } });
  p.on('pageerror', (e) => console.log('pageerror', e.message, e.stack));
  await p.goto('file://' + path.resolve(__dirname, '../index.html') + (q ? '?' + q : ''));
  await p.waitForFunction('window.__duckbath && window.__duckbath.ready', null, { timeout: 120000 });
  await p.waitForTimeout(+wait);
  console.log(JSON.stringify(await p.evaluate(() => ({ f: window.__duckbath.frame, ms: window.__duckbath.buildMs, ft: window.__duckbath.ft, prof: window.__duckbath.prof }))));
  await p.screenshot({ path: out, timeout: 180000 });
  await b.close();
})();
