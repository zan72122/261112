// 実測 fps (ヘッドレス Chromium + SwiftShader = CPU ソフトウェア描画)。実機 iPad の値ではない。
// 使い方: node verify/perf.mjs [秒数=10]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { open, chromium, ARGS, ROOT, sleep } from './lib.mjs';
const outDir = path.join(ROOT, 'verify/results'); fs.mkdirSync(outDir, { recursive: true });
const SEC = +process.argv[2] || 10, rows = [];
const browser = await chromium.launch({ args: ARGS });
const gpu = await (async () => { const g = await open({ browser, w: 300, h: 300, query: '?low=1&rs=0.2' }); await g.ready(); const r = await g.page.evaluate(() => { const c = document.createElement('canvas').getContext('webgl2'); const e = c.getExtension('WEBGL_debug_renderer_info'); return { renderer: e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : c.getParameter(c.RENDERER), ua: navigator.userAgent, cores: navigator.hardwareConcurrency, dpr: devicePixelRatio }; }); await g.close(); return r; })();
for (const [w, h] of [[375, 667], [390, 844], [820, 1180], [1180, 820]]) for (const [label, q] of [['既定 (動的解像度あり・自動で低負荷化)', ''], ['低負荷モード指定', '?low=1'], ['検証用の低解像度 (操作テストで使用)', '?low=1&rs=0.25&fixed=1']]) {
  const g = await open({ browser, w, h, query: q }); await g.ready(); await sleep(4000);
  const a = await g.page.evaluate(() => ({ f: window.__gf.perf.frames, t: performance.now(), gt: window.__gf.info().time })); await sleep(SEC * 1000);
  const b = await g.page.evaluate(() => ({ f: window.__gf.perf.frames, t: performance.now(), gt: window.__gf.info().time, perf: window.__gf.perf, pr: window.__gf.pixelRatio, calls: window.__gf.calls(), tris: window.__gf.tris() }));
  const row = { size: `${w}x${h}`, mode: label, query: q || '(なし)', seconds: +((b.t - a.t) / 1000).toFixed(1), fps: +(((b.f - a.f) / (b.t - a.t)) * 1000).toFixed(1), gameSpeed: +((b.gt - a.gt) / ((b.t - a.t) / 1000)).toFixed(2), pixelRatio: +b.pr.toFixed(2), renderPx: `${Math.round(w * b.pr)}x${Math.round(h * b.pr)}`, scale: +b.perf.scale.toFixed(2), lowMode: b.perf.low, drawCalls: b.calls, triangles: b.tris, errors: g.log.errors.length };
  rows.push(row); console.log(JSON.stringify(row)); await g.close();
}
const res = { env: { ...gpu, cpu: os.cpus()[0].model, cpuCount: os.cpus().length, memGB: Math.round(os.totalmem() / 1073741824), note: 'ヘッドレス Chromium (Playwright) + ANGLE/SwiftShader の CPU 描画。GPU なし。実機 iPad の計測ではない。' }, scene: '場面1 (朝の陳列) を起動後 4 秒おいてから計測', seconds: SEC, rows };
fs.writeFileSync(path.join(outDir, 'perf.json'), JSON.stringify(res, null, 1)); await browser.close(); process.exit(0);
