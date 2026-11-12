// 保存拒否・保存破損・復元・WebGL失敗/喪失・音拒否 の確認 (node verify/robust.mjs)
// ブラウザ環境側を差し替えるだけで、ゲーム内部の状態は書き換えない。
import fs from 'node:fs';
import path from 'node:path';
import { open, chromium, ARGS, ROOT, sleep } from './lib.mjs';

const outDir = path.join(ROOT, 'verify/results'), shots = path.join(ROOT, 'verify/shots'); fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(shots, { recursive: true });
const checks = []; const ck = (name, pass, detail) => { checks.push({ name, pass: !!pass, detail }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); };
const browser = await chromium.launch({ args: ARGS });
const Q = '?low=1&rs=0.25&fixed=1', KEY = 'gf-261112-3:save';
const milkToShelf = async (g) => { const a = await g.q("item('milk1')"), s = await g.q('shelfSlot(0)'); await g.drag(a, { x: s.x, y: s.y + 20 }, 8, 0.12); await g.wait(0.6); return (await g.state()).items.milk1; };
const run = async (name, fn) => { try { await fn(); } catch (e) { ck(name + ': 例外なし', false, String(e.message).slice(0, 300)); } };

await run('保存拒否(setItem)', async () => {
  const g = await open({ browser, w: 390, h: 844, query: Q, init: () => { Storage.prototype.setItem = function () { throw new DOMException('denied', 'QuotaExceededError'); }; } });
  await g.ready(); const m = await milkToShelf(g); await g.wait(1.0); const i = await g.info();
  ck('保存拒否(setItem が例外): メモリで継続して遊べる', m.loc === 'shelf' && i.saveOK === false && g.log.errors.length === 0, { loc: m.loc, saveOK: i.saveOK, errors: g.log.errors.slice(0, 2) });
  await g.close();
});
await run('保存拒否(localStorage 取得)', async () => {
  const g = await open({ browser, w: 390, h: 844, query: Q, init: () => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } }); } });
  await g.ready(); const m = await milkToShelf(g); await g.wait(1.0); const i = await g.info();
  ck('保存拒否(localStorage 自体が使えない): 標準配置で始まり遊べる', m.loc === 'shelf' && i.saveOK === false && g.log.errors.length === 0, { loc: m.loc, saveOK: i.saveOK, errors: g.log.errors.slice(0, 2) });
  await g.close();
});
const good = (extra) => { const it = (loc, slot = 0, ord = 0) => ({ loc, slot, ord, sc: 0, paid: 0, bx: 0, by: 0.2, ba: 0, tidy: 1 }); return Object.assign({ v: 1, day: 3, intro: 1, phase: 'open', station: 0, basket: 'stand', paid: 0, handed: 0, pegs: [1, 2], shutter: 0, carded: 0, items: { milk1: it('shelf', 0), milk2: it('shelf', 2), apple1: it('lane', 1, 0), apple2: it('lane', 0, 0), berry: it('lane', 1, 1), bread: it('bin') } }, extra || {}); };
const bads = {
  '壊れたJSON': '{"v":1,"day":', '空文字': '', '別バージョン': JSON.stringify(good({ v: 99 })), '値域外(day)': JSON.stringify(good({ day: -4 })), '値域外(shutter)': JSON.stringify(good({ shutter: 7 })),
  '不整合(同じ棚に牛乳2つ)': (() => { const s = good(); s.items.milk2.slot = 0; return JSON.stringify(s); })(), '不整合(未知の場所)': (() => { const s = good(); s.items.apple1.loc = 'moon'; return JSON.stringify(s); })(),
  '不整合(未会計なのに袋の中)': (() => { const s = good(); s.items.bread.loc = 'bag'; return JSON.stringify(s); })(), '不整合(品が足りない)': (() => { const s = good(); delete s.items.berry; return JSON.stringify(s); })(),
  '非有限値': JSON.stringify(good()).replace('"bx":0', '"bx":1e999'), '配列': '[1,2,3]',
};
for (const [label, raw] of Object.entries(bads)) await run('破損: ' + label, async () => {
  const g = await open({ browser, w: 390, h: 844, query: Q, storage: { [KEY]: raw } });
  await g.ready(); const s = await g.state(), i = await g.info();
  ck(`保存破損(${label}): 拒否して標準配置で開始`, s.day === 1 && s.items.milk1.loc === 'crate' && s.items.milk2.slot === 1 && g.log.errors.length === 0 && (raw === '' || i.loadRejected === true), { day: s.day, milk1: s.items.milk1.loc, rejected: i.loadRejected, errors: g.log.errors.slice(0, 2) });
  await g.close();
});
await run('正しい保存の復元', async () => {
  const g = await open({ browser, w: 390, h: 844, query: Q, storage: { [KEY]: JSON.stringify(good()) } });
  await g.ready(); const s = await g.state(), i = await g.info();
  ck('検査に通る保存は復元される (日数・棚の並び)', s.day === 3 && s.items.milk2.slot === 2 && i.lanes[1][0] === 'apple1' && i.lanes[1][1] === 'berry' && i.lanes[0][0] === 'apple2' && i.loadRejected === false, { day: s.day, lanes: i.lanes });
  await g.close();
});
await run('途中保存→再読み込み', async () => {
  const ctx = await open({ browser, w: 390, h: 844, query: Q }); const g = ctx; await g.ready();
  await milkToShelf(g);
  for (const id of ['apple1', 'bread']) { const a = await g.q(`item('${id}')`), b = await g.q('basket()'); await g.drag(a, { x: b.x, y: b.y + 10 }, 8, 0.12); await g.wait(0.5); }
  const bg = await g.q('basketGrip()'); await g.drag(bg, { x: bg.x + 220, y: bg.y - 10 }, 8, 0.1);
  await g.until(() => window.__gf.info().station === 1 && window.__gf.info().cust === 'atReg' && window.__gf.info().carryT === 1); await g.wait(1.0);
  const s0 = await g.q('scanner()'), t = await g.q("item('apple1')"); await g.down(s0.x, s0.y); await g.slide(s0, t, 6); await g.wait(0.3); await g.up();
  await g.until(() => !window.__gf.info().assist && window.__gf.info().reads >= 1, 30000); await g.wait(1.2);
  const before = await g.state();
  await g.page.reload(); await g.ready(); const after = await g.state(), i = await g.info();
  const same = JSON.stringify(before.items) === JSON.stringify(after.items) && before.basket === after.basket && before.station === after.station && before.intro === after.intro;
  ck('遊びの途中で読み込み直しても同じ状態から続く (品の所在・読取済み・かご・場面・客)', same && after.basket === 'reg' && i.station === 1 && i.cust === 'atReg' && Object.values(after.items).some((x) => x.loc === 'tray' && x.sc === 1), { station: i.station, cust: i.cust, tray: Object.keys(after.items).filter((k) => after.items[k].loc === 'tray') });
  ck('読み込み直しで品が複製・消失しない', Object.keys(after.items).length === 6);
  await g.close();
});
await run('WebGL 生成失敗', async () => {
  const g = await open({ browser, w: 390, h: 844, query: '', init: () => { const o = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { if (/webgl/i.test(t)) return null; return o.call(this, t, ...a); }; } });
  await g.page.waitForFunction(() => window.__gf && (window.__gf.failed || window.__gf.ready), null, { timeout: 60000 }); await sleep(500);
  const r = await g.page.evaluate(() => { const fb = document.getElementById('fb'), c = document.getElementById('c'); return { failed: window.__gf.failed, fb: getComputedStyle(fb).display, canvas: getComputedStyle(c).display, w: fb.naturalWidth, h: fb.naturalHeight, src: fb.src.slice(0, 22) }; });
  await g.page.screenshot({ path: path.join(shots, 'webgl-fallback-390x844.png') });
  ck('WebGL 生成失敗: 埋め込み静止画の代替画面を表示 (エラーなし)', r.failed === true && r.fb === 'block' && r.canvas === 'none' && r.w > 100 && r.src.startsWith('data:image/jpeg') && g.log.errors.length === 0 && g.log.requests.length === 1, { ...r, errors: g.log.errors.slice(0, 2), requests: g.log.requests.length });
  await g.close();
});
await run('WebGL 喪失', async () => {
  const g = await open({ browser, w: 390, h: 844, query: Q }); await g.ready();
  await g.page.evaluate(() => { window.__lc = document.getElementById('c').getContext('webgl2').getExtension('WEBGL_lose_context'); window.__lc.loseContext(); });
  await sleep(700); const f0 = await g.q('perf.frames'); await g.page.evaluate(() => window.__lc.restoreContext());
  // 復旧後はシェーダーの作り直しで最初の数フレームが遅い (ソフトウェア描画では数十秒かかることがある)
  await g.page.waitForFunction((f) => window.__gf.perf.frames >= f + 3, f0, { timeout: 120000, polling: 250 }).catch(() => {}); const f1 = await g.q('perf.frames');
  const m = await milkToShelf(g);
  ck('WebGL 喪失→復旧: 描画と遊びが続く', f1 > f0 && m.loc === 'shelf' && (await g.q('failed')) === false, { frames: [f0, f1], errors: g.log.errors.slice(0, 2) });
  await g.page.evaluate(() => window.__lc.loseContext()); await sleep(5500);
  const r = await g.page.evaluate(() => ({ failed: window.__gf.failed, fb: getComputedStyle(document.getElementById('fb')).display }));
  ck('WebGL 喪失→復旧不能 (約4秒): 代替画面へ切り替え', r.failed === true && r.fb === 'block', r);
  await g.close();
});
await run('音の拒否', async () => {
  let g = await open({ browser, w: 390, h: 844, query: Q, init: () => { window.AudioContext = function () { throw new Error('blocked'); }; window.webkitAudioContext = undefined; } });
  await g.ready(); let m = await milkToShelf(g); let i = await g.info();
  ck('音の拒否(AudioContext が作れない): 無音で遊べる', m.loc === 'shelf' && i.audio === false && g.log.errors.length === 0, { audio: i.audio, errors: g.log.errors.slice(0, 2) });
  await g.close();
  g = await open({ browser, w: 390, h: 844, query: Q, init: () => { const A = window.AudioContext; window.AudioContext = class extends A { resume() { return Promise.reject(new DOMException('not allowed', 'NotAllowedError')); } }; } });
  await g.ready(); m = await milkToShelf(g); i = await g.info();
  ck('音の拒否(resume が拒否される): 遊びは続く', m.loc === 'shelf' && g.log.errors.length === 0, { audioState: i.audioState, errors: g.log.errors.slice(0, 2) });
  await g.close();
  g = await open({ browser, w: 390, h: 844, query: Q }); await g.ready(); const i0 = await g.info(); m = await milkToShelf(g); i = await g.info();
  ck('通常時: 最初のタッチで音が始まり「ことん」が鳴る', i0.audio === false && i.audio === true && i.audioState === 'running' && i.sounds >= 2, { before: i0.audioState, after: i.audioState, sounds: i.sounds });
  await g.close();
});
const res = { pass: checks.filter((c) => c.pass).length, fail: checks.filter((c) => !c.pass).length, checks };
fs.writeFileSync(path.join(outDir, 'robust.json'), JSON.stringify(res, null, 1));
console.log(`\nrobust: pass ${res.pass} / fail ${res.fail}`);
await browser.close(); process.exit(0);
