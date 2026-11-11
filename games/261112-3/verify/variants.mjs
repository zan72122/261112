// 一品での完了・逆戻り・放置・連打・回転・非表示復帰・マルチタッチ・pointercancel の確認
// 使い方: node verify/variants.mjs   (390x844 を基本に、回転で 844x390 も通る)
import fs from 'node:fs';
import path from 'node:path';
import { open, chromium, ARGS, ROOT, sleep } from './lib.mjs';

const outDir = path.join(ROOT, 'verify/results'); fs.mkdirSync(outDir, { recursive: true });
const checks = [], notes = {}; const ck = (name, pass, detail) => { checks.push({ name, pass: !!pass, detail }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); };
const browser = await chromium.launch({ args: ARGS });
const W = 390, H = 844;
const g = await open({ browser, w: W, h: H, query: '?low=1&rs=0.3&fixed=1' });
await g.ready();
const P = (e) => g.q(e), st = () => g.state(), info = () => g.info(), item = (id) => P(`item('${id}')`);
const LOCS = ['crate', 'shelf', 'lane', 'bin', 'basket', 'tray', 'bag', 'sold'];
const sane = async () => { const s = await st(), i = await info(); const ids = Object.keys(s.items); return ids.length === 6 && ids.every((k) => LOCS.includes(s.items[k].loc)) && i.drag === null; };
const setHidden = (v) => g.page.evaluate((h) => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => h }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (h ? 'hidden' : 'visible') }); document.dispatchEvent(new Event('visibilitychange')); }, v);

try {
  // --- マルチタッチ: 2本目の指は無視され、1本目の操作が続く ---
  let a = await item('milk1'), s0 = await P('shelfSlot(0)');
  await g.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x, y: a.y, id: 1 }] }); await g.frames(2);
  await g.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: a.x + 10, y: a.y - 80, id: 1 }] }); await g.frames(2);
  await g.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x + 10, y: a.y - 80, id: 1 }, { x: 300, y: 700, id: 2 }] }); await g.frames(2);
  await g.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: a.x + 10, y: a.y - 80, id: 1 }, { x: 200, y: 400, id: 2 }] }); await g.frames(2);
  const d1 = (await info()).drag, held = await item('milk1');
  await g.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: s0.x, y: s0.y + 20, id: 1 }, { x: 200, y: 400, id: 2 }] }); await g.frames(3);
  await g.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [{ x: 200, y: 400, id: 2 }] }); await g.frames(2);
  await g.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await g.wait(0.7);
  ck('マルチタッチ: 2本目の指を無視し、1本目のドラッグが最後まで成立', d1 === 'item' && held.mode === 'held' && (await st()).items.milk1.loc === 'shelf' && (await info()).drag === null, { drag: d1, loc: (await st()).items.milk1.loc });

  // --- pointercancel: つかみを安全に解除して近い支持面へ ---
  a = await item('apple1'); await g.down(a.x, a.y); await g.slide(a, { x: a.x + 80, y: a.y - 120 }, 4);
  const dk = (await info()).drag; await g.touch('touchCancel', 0, 0); await g.wait(0.8);
  let ia = await item('apple1');
  ck('pointercancel: つかみが解除され、品は支持面に戻る', dk === 'item' && ia.mode !== 'held' && ['lane', 'crate', 'basket'].includes(ia.loc) && (await info()).drag === null, { loc: ia.loc, mode: ia.mode });

  // --- 画面回転: ドラッグ中に縦→横 ---
  a = await item('apple2'); await g.down(a.x, a.y); await g.slide(a, { x: a.x + 60, y: a.y - 100 }, 4);
  await g.page.setViewportSize({ width: H, height: W }); await sleep(600); await g.frames(4);
  ia = await item('apple2'); const iv = await info();
  const m2 = await item('milk2'), cr = await P('basketGrip()');
  ck('画面回転(縦→横): つかみが解除され支持面へ、横画面でも主要物が画面内', iv.drag === null && ia.mode !== 'held' && m2.x > 0 && m2.x < H && m2.y > 0 && m2.y < W && cr.x > 0 && cr.x < H && cr.y > 0 && cr.y < W, { apple2: ia.loc, milk2: [m2.x, m2.y], basket: [cr.x, cr.y] });
  await g.touch('touchEnd', 0, 0);
  // 横画面でそのまま遊ぶ: りんごをかごへ
  a = await item('apple1'); let b = await P('basket()'); await g.drag(a, { x: b.x, y: b.y + 10 }, 8, 0.12); await g.wait(0.6);
  ck('横画面でも同じ操作が成立 (りんごをかごへ)', (await st()).items.apple1.loc === 'basket');
  await g.page.setViewportSize({ width: W, height: H }); await sleep(600); await g.frames(4);
  ck('画面回転(横→縦): 状態はそのまま', (await st()).items.apple1.loc === 'basket' && (await sane()));

  // --- 一品での完了: りんご1個だけで最後まで ---
  let bg = await P('basketGrip()'); await g.drag(bg, { x: bg.x + W * 0.55, y: bg.y - 10 }, 8, 0.1);
  await g.until(() => window.__gf.info().station === 1 && window.__gf.info().cust === 'atReg' && window.__gf.info().carryT === 1); await g.wait(1.0);
  // 逆戻り: スワイプで棚へ戻り、またレジへ (状態は巻き戻らない)
  await g.drag({ x: 80, y: 120 }, { x: 80 + W * 0.6, y: 120 }, 6, 0.05); await g.until(() => window.__gf.info().station === 0, 20000); await g.wait(0.8);
  const sBack = await st();
  await g.drag({ x: W - 60, y: 120 }, { x: W - 60 - W * 0.6, y: 120 }, 6, 0.05); await g.until(() => window.__gf.info().station === 1, 20000); await g.wait(0.8);
  ck('逆戻り: 棚へ戻ってもかごと品はレジに残り、巻き戻らない', sBack.basket === 'reg' && sBack.items.apple1.loc === 'basket' && (await st()).basket === 'reg');
  // かごごと棚へ持ち帰り、また運ぶ
  bg = await P('basketGrip()'); await g.drag(bg, { x: bg.x - W * 0.6, y: bg.y + 10 }, 8, 0.1);
  await g.until(() => window.__gf.info().station === 0 && window.__gf.info().carryT === 0, 20000); await g.wait(0.8);
  ck('逆戻り: かごを棚側へ持ち帰れる (会計前)', (await st()).basket === 'stand' && (await st()).items.apple1.loc === 'basket');
  bg = await P('basketGrip()'); await g.drag(bg, { x: bg.x + W * 0.55, y: bg.y - 10 }, 8, 0.1);
  await g.until(() => window.__gf.info().station === 1 && window.__gf.info().carryT === 1); await g.wait(1.0);

  // --- 非表示/復帰: スキャナーを持ったまま非表示 ---
  let sc = await P('scanner()'); await g.down(sc.x, sc.y); await g.slide(sc, { x: sc.x + 40, y: sc.y - 60 }, 4);
  const dsc = (await info()).drag; await setHidden(true); await sleep(300);
  const f0 = await P('perf.frames'), t0 = (await info()).time; await sleep(2500); const f1 = await P('perf.frames'), t1 = (await info()).time, ih = await info();
  ck('非表示: つかみを解除し、描画と進行が止まる', dsc === 'scan' && ih.drag === null && f1 === f0 && t1 === t0 && ih.audioState !== 'running', { frames: [f0, f1], time: [t0, t1], audio: ih.audioState });
  await setHidden(false); await sleep(400); await g.frames(3); const t2 = (await info()).time; await g.touch('touchEnd', 0, 0);
  ck('復帰: 大きな時間差で進行が飛ばない (復帰直後の進みは 0.5 秒未満)', t2 - t1 < 0.5 && (await P('perf.frames')) > f1, { advanced: +(t2 - t1).toFixed(3) });
  await g.wait(0.6);

  // --- 放置: 20秒何もしなくても状態は変わらない (お手本は一度だけ) ---
  const sI = JSON.stringify((await st()).items), h0 = (await info()).hints; await g.wait(20);
  ck('放置 20 秒: 状態は変わらず、お手本は一度だけ', JSON.stringify((await st()).items) === sI && (await info()).hints === h0 + 1 && (await info()).station === 1, { hints: [(await info()).hints, h0] });

  // --- 連打: レジのあちこちを 40 回たたく ---
  const bt0 = await P('button()'); const pts = [bt0, await item('apple1'), await P('scanner()'), { x: 30, y: 60 }, { x: W / 2, y: H - 40 }];
  for (let k = 0; k < 40; k++) { const p = pts[k % pts.length]; await g.touch('touchStart', p.x + (k % 3), p.y); await g.touch('touchEnd', 0, 0); }
  await g.wait(1.5); if ((await info()).station !== 1) { await g.drag({ x: W - 60, y: 120 }, { x: 40, y: 120 }, 6, 0.05); await g.wait(1.2); }
  await g.until(() => window.__gf.info().drag === null, 10000);
  let ii = await info();
  ck('連打 40 回: 壊れず、未読のまま会計は成立しない', (await sane()) && ii.pays === 0 && (await st()).paid === 0, { presses: ii.presses, pays: ii.pays, station: ii.station });
  if ((await info()).station === 0) { await g.drag({ x: W - 60, y: 120 }, { x: 40, y: 120 }, 6, 0.05); await g.until(() => window.__gf.info().station === 1, 20000); await g.wait(0.8); }
  // 読む → 払う
  sc = await P('scanner()'); const t = await item('apple1'); await g.down(sc.x, sc.y); await g.slide(sc, t, 6); await g.wait(0.35); await g.up();
  await g.until(() => !window.__gf.info().assist && window.__gf.info().reads >= 1, 30000); await g.wait(0.5);
  const bt = await P('button()'); for (let k = 0; k < 5; k++) await g.tap(bt.x, bt.y);
  await g.until(() => window.__gf.info().station === 2 && window.__gf.info().trayAt === 'bag' && window.__gf.info().cust === 'atBag', 60000); await g.wait(1.0);
  ii = await info(); ck('一品だけで会計まで進める (連打でも一度)', ii.pays === 1 && ii.reads === 1);
  // 袋へ: 袋の「手前」で離しても、口の上へ持ち上がって入る (失敗なし)
  a = await item('apple1'); const front = await P('bag(0.0,0.2)'); await g.drag(a, front, 8, 0.15); await g.wait(2.2);
  const sb = await P('sim()');
  ck('袋の手前で離しても近い支え(袋)へ収まる', (await st()).items.apple1.loc === 'bag' && sb.bodies.length === 1 && sb.bodies[0].in, sb.bodies);
  // 袋を持ったまま非表示 → 袋は袋掛けへ戻る
  let h = await P('handle(1)'), up = await P('bag(0.1,0.7)'); await g.down(h.x, h.y); await g.slide(h, up, 6); await g.wait(0.4);
  const dl = (await info()).drag; await setHidden(true); await sleep(400); await setHidden(false); await g.touch('touchEnd', 0, 0); await g.wait(1.5);
  ck('袋を持ち上げたまま非表示→復帰: 袋は袋掛けへ戻り中身も無事', dl === 'handle:lift' && (await info()).bagWhere === 'rack' && (await P('sim()')).bodies.length === 1 && (await P('sim()')).bodies[0].in, { bagWhere: (await info()).bagWhere });
  // 手渡し
  h = await P('handle(1)'); up = await P('bag(0.1,0.7)'); await g.down(h.x, h.y); await g.slide(h, up, 6); await g.wait(0.5);
  for (let k = 0; k < 40; k++) { const s = await P('sim()'); const x = (s.pins[0] + s.pins[2]) / 2; if (x > 0.27) break; const cur = await P(`bag(${x},${s.pins[1]})`); await g.move(cur.x + 30, cur.y); await g.wait(0.05); }
  await g.wait(0.8); await g.up();
  await g.until(() => window.__gf.state().phase === 'close' && window.__gf.info().station === 0, 120000); await g.wait(1.5);
  let S = await st();
  ck('一品での完了: りんご1個の袋を渡して店じまいへ', S.phase === 'close' && S.items.apple1.loc === 'sold' && Object.values(S.items).filter((x) => x.loc === 'sold').length === 1);
  // 店じまい: かごはタップでも重なる
  bg = await P('basketGrip()'); await g.tap(bg.x, bg.y); await g.until(() => window.__gf.state().basket === 'stack', 20000);
  await g.until(() => window.__gf.info().station === 3, 30000); await g.wait(1.4);
  // シャッターを連続で上下 → 壊れない
  let bar = await P('shutterBar()'); await g.down(bar.x, bar.y);
  for (let k = 0; k < 6; k++) { await g.slide({ x: bar.x, y: bar.y + (k % 2 ? 60 : 0) }, { x: bar.x, y: bar.y + (k % 2 ? 0 : 260) }, 4); }
  await g.up(); await g.wait(0.5);
  ck('シャッターを上下に往復しても壊れない', (await info()).station === 3 || (await info()).station === 4, { shutter: (await st()).shutter });
  if ((await info()).station === 3) { bar = await P('shutterBar()'); const bot = await P('pt(1.55,-0.1,-3.52)'); await g.down(bar.x, bar.y); await g.slide(bar, { x: bar.x, y: Math.min(H - 4, bot.y + 30) }, 10); await g.up(); }
  await g.until(() => window.__gf.info().station === 4 && window.__gf.state().carded === 1, 90000); await g.wait(1.2);
  // 店先で回転しても カードは画面内
  await g.page.setViewportSize({ width: H, height: W }); await sleep(600); await g.frames(4); const cs = await P('cardScreen()');
  ck('店先で画面回転してもカードは画面内', cs.visible && cs.x > 0 && cs.x < H && cs.y > 0 && cs.y < W, cs);
  await g.page.setViewportSize({ width: W, height: H }); await sleep(600); await g.frames(4);
  bar = await P('shutterBar()'); const topP = await P('pt(1.55,2.3,-3.52)'); await g.down(bar.x, bar.y); await g.slide(bar, { x: bar.x, y: Math.max(4, topP.y) }, 10); await g.up();
  await g.until(() => window.__gf.info().station === 0 && window.__gf.info().via === 0 && window.__gf.state().day === 2, 60000); await g.wait(1.2);
  S = await st();
  ck('再開店: 売れた一品だけ納品箱へ補充、ほかは前日の場所のまま', S.day === 2 && S.items.apple1.loc === 'crate' && S.items.milk1.loc === 'shelf' && S.items.milk1.slot === 0 && S.items.bread.loc === 'bin');
} catch (e) { ck('例外なく最後まで遊べる', false, String(e && e.message).slice(0, 400)); }
ck('コンソールエラー 0', g.log.errors.length === 0, g.log.errors.slice(0, 5));
ck('外部リクエスト 0', g.log.requests.every((u) => u.startsWith('file://')), g.log.requests.slice(0, 4));
const res = { pass: checks.filter((c) => c.pass).length, fail: checks.filter((c) => !c.pass).length, checks, notes };
fs.writeFileSync(path.join(outDir, 'variants.json'), JSON.stringify(res, null, 1));
console.log(`\nvariants: pass ${res.pass} / fail ${res.fail}`);
await browser.close(); process.exit(0);
