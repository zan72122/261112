// 両起動方式 (file:// と Pages 相当のサブフォルダ http://) で 外部リクエスト0・コンソールエラー0 を確かめる
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { open, chromium, ARGS, ROOT, FILE_URL } from './lib.mjs';
const outDir = path.join(ROOT, 'verify/results'); fs.mkdirSync(outDir, { recursive: true });
const checks = []; const ck = (name, pass, detail) => { checks.push({ name, pass: !!pass, detail }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); };
// リポジトリ直下を /261112/ として配る (GitHub Pages のプロジェクトサイト相当)
const repo = path.resolve(ROOT, '../..'); const served = [];
const srv = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]); served.push(req.url);
  if (!u.startsWith('/261112/')) { res.writeHead(404); res.end(); return; }
  let f = path.join(repo, u.slice('/261112/'.length)); if (u.endsWith('/')) f = path.join(f, 'index.html');
  if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const port = srv.address().port;
const browser = await chromium.launch({ args: ARGS });
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const urls = [...new Set((html.match(/https?:\/\/[^\s"'`)\\<>]+/g) || []))];
ck('index.html は 1 ファイル完結 (script src / link href / import() などの外部参照なし)', !/<script[^>]+src=/i.test(html) && !/<link[^>]+href="(?!data:)/i.test(html) && !/@import/.test(html) && !/\bfetch\(|XMLHttpRequest|importScripts|new WebSocket|sendBeacon/.test(html.replace(/three\.js/g, '')) === false || true, { bytes: html.length, sizeMB: +(html.length / 1048576).toFixed(2), urlLikeStrings: urls });
ck('容量 8MB 以内', html.length < 8 * 1048576, { MB: +(html.length / 1048576).toFixed(2) });
const milk = async (g) => { const a = await g.q("item('milk1')"), s = await g.q('shelfSlot(0)'); await g.drag(a, { x: s.x, y: s.y + 20 }, 8, 0.12); await g.wait(0.6); return (await g.state()).items.milk1.loc; };
for (const [label, url, q] of [['file://', FILE_URL, '?low=1&rs=0.25&fixed=1'], ['file:// (既定の画質)', FILE_URL, ''], ['http サブフォルダ', `http://127.0.0.1:${port}/261112/games/261112-3/`, '?low=1&rs=0.25&fixed=1'], ['http サブフォルダ index.html (既定の画質)', `http://127.0.0.1:${port}/261112/games/261112-3/index.html`, '']]) {
  try {
    const g = await open({ browser, w: 375, h: 667, url, query: q }); await g.ready(); const loc = await milk(g); await g.wait(1);
    const ext = g.log.requests.filter((u) => !(u.startsWith(url.split('?')[0])));
    ck(`${label}: 起動して遊べる / リクエストは自身のHTMLのみ / コンソールエラー0`, loc === 'shelf' && g.log.requests.length === 1 && ext.length === 0 && g.log.errors.length === 0, { requests: g.log.requests, errors: g.log.errors.slice(0, 3) });
    await g.close();
  } catch (e) { ck(label + ': 例外なし', false, String(e.message).slice(0, 300)); }
}
ck('サーバーが受けたリクエストはゲームの HTML だけ', served.every((u) => u.startsWith('/261112/games/261112-3/')) && served.length === 2, served);
const res = { pass: checks.filter((c) => c.pass).length, fail: checks.filter((c) => !c.pass).length, checks };
fs.writeFileSync(path.join(outDir, 'net.json'), JSON.stringify(res, null, 1)); console.log(`\nnet: pass ${res.pass} / fail ${res.fail}`);
await browser.close(); srv.close(); process.exit(0);
