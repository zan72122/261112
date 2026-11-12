// 撮影した PNG を、同じ画素のまま JPEG(品質88) に変換して容量を抑える
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const dir = path.resolve(__dirname, 'shots'); const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')); const b = await chromium.launch(); const pg = await b.newPage();
  for (const f of files) { const src = 'file://' + path.join(dir, f); await pg.goto('about:blank'); const html = path.join(dir, 'tmp', '_conv.html'); fs.writeFileSync(html, `<body style="margin:0"><img id="i" src="${src}" style="display:block"></body>`); await pg.goto('file://' + html);
    const sz = await pg.evaluate(() => new Promise((r) => { const i = document.getElementById('i'); const done = () => r([i.naturalWidth, i.naturalHeight]); if (i.complete) done(); else i.onload = done; })); await pg.setViewportSize({ width: sz[0], height: sz[1] }); await pg.screenshot({ path: path.join(dir, f.replace('.png', '.jpg')), type: 'jpeg', quality: 88 }); console.log(f, sz.join('x')); }
  await b.close();
})();
