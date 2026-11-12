// 見えている棚・レジ・袋台に触れて場面を行き来できるか (1180x820 横画面)。node verify/nav.mjs
import fs from 'node:fs';
import path from 'node:path';
import { open, chromium, ARGS, ROOT } from './lib.mjs';
const outDir = path.join(ROOT, 'verify/results'); fs.mkdirSync(outDir, { recursive: true });
const checks = []; const ck = (name, pass, detail) => { checks.push({ name, pass: !!pass, detail }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); };
const browser = await chromium.launch({ args: ARGS }); const W = 1180, H = 820;
const g = await open({ browser, w: W, h: H, query: '?low=1&rs=0.25&fixed=1' }); await g.ready();
const P = (e) => g.q(e), st = () => g.state(), info = () => g.info(), item = (id) => P(`item('${id}')`);
const inView = (p) => p.x > 4 && p.x < W - 4 && p.y > 4 && p.y < H - 4;
try {
  let a = await item('milk1'), s = await P('shelfSlot(0)'); await g.drag(a, { x: s.x, y: s.y + 20 }, 8, 0.12); await g.wait(0.6);
  a = await item('apple1'); let b = await P('basket()'); await g.drag(a, { x: b.x, y: b.y + 10 }, 8, 0.12); await g.wait(0.5);
  // 棚の場面から、右に見えているレジ(スキャナー)に触れる → 移動するだけで状態は変わらない
  let sc = await P('scanner()'); const before = JSON.stringify((await st()).items);
  ck('棚の場面でレジ(スキャナー)が画面内に見えている', inView(sc), sc);
  await g.tap(sc.x, sc.y); await g.until(() => window.__gf.info().station === 1, 20000); await g.wait(1.0);
  ck('見えているレジに触れるとレジへ移動 (状態は変わらない・かごは棚に残る)', (await info()).station === 1 && JSON.stringify((await st()).items) === before && (await st()).basket === 'stand');
  // レジの場面から、左に見えている棚(パンのかご)に触れる
  let bn = await P('bin()'); ck('レジの場面で棚(パンのかご)が画面内に見えている', inView(bn), bn);
  await g.tap(bn.x, bn.y); await g.until(() => window.__gf.info().station === 0, 20000); await g.wait(1.0);
  ck('見えている棚に触れると棚へ戻る', (await info()).station === 0);
  // かごを運んでレジへ → 右に見えている袋掛けに触れる → 袋台へ / 袋台から左のレジ(POS)に触れて戻る
  const bg = await P('basketGrip()'); await g.drag(bg, { x: bg.x + W * 0.45, y: bg.y - 10 }, 8, 0.1);
  await g.until(() => window.__gf.info().station === 1 && window.__gf.info().cust === 'atReg' && window.__gf.info().carryT === 1); await g.wait(1.0);
  const rk = await P('peg(0)'); ck('レジの場面で袋掛けが画面内に見えている', inView(rk), rk);
  await g.tap(rk.x, rk.y + 30); await g.until(() => window.__gf.info().station === 2, 20000); await g.wait(1.0);
  ck('見えている袋台に触れると袋台へ (会計前でも行ける・かごと品はレジに残る)', (await info()).station === 2 && (await st()).basket === 'reg' && (await st()).items.apple1.loc === 'basket' && (await st()).paid === 0);
  const pos = await P('pt(0.93,1.0,-0.2)'); ck('袋台の場面でレジ(端末)が画面内に見えている', inView(pos), pos);
  await g.tap(pos.x, pos.y); await g.until(() => window.__gf.info().station === 1, 20000); await g.wait(0.8);
  ck('見えているレジに触れるとレジへ戻る', (await info()).station === 1);
  // 開店中はシャッターへは行けない (奥の開口部に触れても移動しない)
  const op = await P('pt(1.9,2.0,-3.4)'); if (inView(op)) { await g.tap(op.x, op.y); await g.wait(1.2); ck('開店中に奥のシャッター付近へ触れても店じまいへは飛ばない', (await info()).station === 1); }
} catch (e) { ck('例外なし', false, String(e.message).slice(0, 300)); }
ck('コンソールエラー 0', g.log.errors.length === 0, g.log.errors.slice(0, 3));
const res = { pass: checks.filter((c) => c.pass).length, fail: checks.filter((c) => !c.pass).length, checks };
fs.writeFileSync(path.join(outDir, 'nav.json'), JSON.stringify(res, null, 1)); console.log(`\nnav: pass ${res.pass} / fail ${res.fail}`);
await browser.close(); process.exit(0);
