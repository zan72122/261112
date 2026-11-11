// 使い方: node montage.cjs out.png cols h file1 file2 ...
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [out, cols, h, ...files] = process.argv.slice(2); const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1500, height: 900 } });
  const html = path.resolve(__dirname, 'shots/tmp/_montage.html');
  fs.writeFileSync(html, `<body style="margin:0;background:#333;display:grid;grid-template-columns:repeat(${cols},max-content);gap:6px;padding:6px">` + files.map((f) => `<div style="color:#fff;font:11px sans-serif"><img src="file://${path.resolve(f)}" style="height:${h}px;display:block">${path.basename(f)}</div>`).join('') + '</body>');
  await pg.goto('file://' + html); await pg.waitForTimeout(500); await pg.screenshot({ path: out, fullPage: true }); await b.close();
})();
