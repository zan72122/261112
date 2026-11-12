// 場面ごとの描画速度(ヘッドレスChromium + SwiftShader のソフトウェア描画)。iPad実機の値ではない
const { open, rec } = require('./lib.cjs');
(async () => {
  const out = { env: 'headless Chromium (Playwright) / ANGLE SwiftShader software rendering / 4 vCPU', rows: [] };
  const sizes = process.argv[2] ? [process.argv[2].split('x').map(Number)] : [[1180, 820], [820, 1180]];
  for (const [w, h] of sizes) for (const q of ['high', 'low']) for (let sc = 1; sc <= 5; sc++) {
    const T = await open({ w, h, q: `fresh=1&q=${q}&scene=${sc}` }); await T.wait(7000);
    const a = await T.ev(() => ({ f: window.__duckbath.frame, t: performance.now() })); await T.wait(10000); const b = await T.ev(() => ({ f: window.__duckbath.frame, t: performance.now(), p: window.__duckbath.prof2 }));
    const row = { size: `${w}x${h}`, quality: q, scene: sc, fps: +(((b.f - a.f) * 1000) / (b.t - a.t)).toFixed(2), frames: b.f - a.f, seconds: +((b.t - a.t) / 1000).toFixed(1), drawCalls: b.p.calls, triangles: b.p.tris, jsSimMsPerFrame: +b.p.sim.toFixed(2), jsRenderSubmitMs: +b.p.render.toFixed(2) }; out.rows.push(row); console.log(JSON.stringify(row)); await T.close();
  }
  rec('perf_' + sizes.map((s) => s.join('x')).join('_'), out);
})();
