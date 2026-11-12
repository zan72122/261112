// 実画面からサムネイルと、WebGL が使えない端末向けの静止画を作る(高品質設定、実際のタッチで蛇口を開ける)
const { open } = require('./lib.cjs'); const path = require('path');
(async () => {
  const T = await open({ w: 960, h: 720, q: 'fresh=1&q=high&simcap=0.35' }); await T.wait(4000);
  let tg = await T.tg(); await T.drag([[tg.handle.x, tg.handle.y], [tg.handle.x - 40, tg.handle.y + 14]], 400);
  await T.until((s) => s.ducks[1].floating, 240000, 1500); await T.wait(6000);
  await T.page.screenshot({ path: path.resolve(__dirname, '../thumb.png'), timeout: 300000 });
  await T.page.screenshot({ path: path.resolve(__dirname, 'fallback.jpg'), type: 'jpeg', quality: 74, timeout: 300000 });
  console.log(JSON.stringify((await T.st()).ducks.map((d) => [d.kind, d.floating])), T.log.errors); await T.close();
})();
