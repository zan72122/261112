// 4サイズ×5場面の構図確認(軽い描画)。モンタージュを1枚にまとめる
const { open, chromium, ARGS } = require('./lib.cjs');
const path = require('path');
(async () => {
  const sizes = [[375, 667], [390, 844], [820, 1180], [1180, 820]]; const files = [];
  const browser = await chromium.launch({ args: ARGS });
  for (const [w, h] of sizes) for (let sc = 1; sc <= 5; sc++) { const T = await open({ browser, w, h, q: `fresh=1&q=low&rs=0.6&lite=1&scene=${sc}` }); await T.wait(900); const f = path.resolve(__dirname, `shots/tmp/fr_${w}x${h}_${sc}.png`); await T.page.screenshot({ path: f, timeout: 120000 }); files.push([f, w, h, sc]); await T.ctx.close(); }
  const pg = await browser.newPage({ viewport: { width: 1500, height: 1250 } });
  await pg.setContent('<body style="margin:0;background:#333;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;padding:6px">' + files.map((f) => `<div style="color:#fff;font:11px sans-serif"><img src="file://${f[0]}" style="height:${f[1] > f[2] ? 200 : 290}px;display:block">${f[1]}x${f[2]} s${f[3]}</div>`).join('') + '</body>');
  await pg.waitForTimeout(800); await pg.screenshot({ path: path.resolve(__dirname, 'shots/tmp/frames.png'), fullPage: true }); await browser.close();
})();
