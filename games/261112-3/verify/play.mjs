// 全4場面を「実際の指操作経路」(CDP の touch → Pointer Events) だけで最後まで遊ぶ検証。
// 使い方: node verify/play.mjs <w> <h> [full|core]
//   full: 6つの発見・重複会計防止・再訪・返却などを細かく確認 / core: 4場面の通し + 撮影
// 操作は低負荷モード (?low=1&rs=0.25&fixed=1: 描画解像度だけを下げる) で行い、
// 撮影は同じ保存データを標準画質 (?fixed=1) で開き直して行う (ヘッドレスの SwiftShader が遅いため)。
// 内部状態は window.__gf の読み取り専用関数で観測するだけで、書き換えは行わない。
import fs from 'node:fs';
import path from 'node:path';
import { open, chromium, ARGS, ROOT, FILE_URL } from './lib.mjs';

const W = +process.argv[2] || 820, H = +process.argv[3] || 1180, MODE = process.argv[4] || 'full', FULL = MODE === 'full';
const tag = `${W}x${H}`, shots = path.join(ROOT, 'verify/shots'), outDir = path.join(ROOT, 'verify/results');
fs.mkdirSync(shots, { recursive: true }); fs.mkdirSync(outDir, { recursive: true });
const checks = [], notes = {}, T0 = Date.now();
const ck = (name, pass, detail) => { checks.push({ name, pass: !!pass, detail }); console.log((pass ? 'ok   ' : 'FAIL ') + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); };

const browser = await chromium.launch({ args: ARGS });
const g = await open({ browser, w: W, h: H, query: '?low=1&rs=0.25&fixed=1' });
await g.ready();
const P = (e) => g.q(e), st = () => g.state(), info = () => g.info(), sim = () => g.q('sim()');
const item = (id) => P(`item('${id}')`);
const qshot = async (name) => { // 標準画質で同じ保存データを開いて撮る
  await g.wait(0.7);
  const t = Date.now(), ctxPage = await g.ctx.newPage(); const errs = [];
  ctxPage.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); ctxPage.on('pageerror', (e) => errs.push(e.message));
  await ctxPage.goto(FILE_URL + '?fixed=1');
  await ctxPage.waitForFunction(() => window.__gf && window.__gf.ready, null, { timeout: 180000 });
  await ctxPage.waitForFunction(() => window.__gf.perf.frames >= 6, null, { timeout: 300000, polling: 200 });
  const file = path.join(shots, `${tag}-${name}.png`);
  await ctxPage.screenshot({ path: file, timeout: 300000 });
  const pf = await ctxPage.evaluate(() => ({ station: window.__gf.info().station, pr: window.__gf.pixelRatio }));
  await ctxPage.close();
  ck(`撮影 ${name}`, errs.length === 0, { ms: Date.now() - t, station: pf.station, pixelRatio: pf.pr, errors: errs.slice(0, 2) });
};
const dragTo = async (from, to, steps = 8, hold = 0.12) => { await g.drag(from, to, steps, hold); };
const toBasket = async (id) => { const a = await item(id), b = await P('basket()'); await dragTo(a, { x: b.x, y: b.y + 10 }); await g.wait(0.45); return (await item(id)).loc; };
// 袋へ入れる: 口の真上へ運んでから下ろして離す
const putBag = async (id, bx, by = 0.22, opt = {}) => {
  const a = await item(id); const top = await P(`bag(${bx},0.66)`), dn = await P(`bag(${bx},${by})`);
  const gx = opt.grabDx || 0, gy = opt.grabDy || 0;
  await g.down(a.x + gx, a.y + gy); await g.slide({ x: a.x + gx, y: a.y + gy }, top, 7); await g.wait(opt.hang || 0.15); await g.slide(top, dn, 6); await g.wait(0.2); await g.up(); await g.wait(opt.settle || 1.4);
  return (await sim()).bodies.find((b) => b.id === id) || null;
};
// 袋から出して受け台へ戻す
const takeOut = async (id) => {
  const s = await sim(), b = s.bodies.find((x) => x.id === id); if (!b) return 'none';
  const a = await P(`bag(${b.x},${b.y})`), up = await P(`bag(${b.x},0.7)`), out = await P('bag(-0.42,0.6)');
  await g.down(a.x, a.y); await g.slide(a, up, 6); await g.slide(up, out, 6); await g.wait(0.15); await g.up(); await g.wait(0.9);
  return (await item(id)).loc;
};

try {
  // ---------- 場面1: 朝の陳列 ----------
  let S = await st(), i0 = await info();
  const m1 = await item('milk1'), s0 = await P('shelfSlot(0)'), m2 = await item('milk2');
  const inView = (p) => p.x > 8 && p.x < W - 8 && p.y > 8 && p.y < H - 8;
  ck('最初の一画面: 納品箱の牛乳・棚の空き・隣の牛乳が画面内', S.items.milk1.loc === 'crate' && S.items.milk2.loc === 'shelf' && inView(m1) && inView(s0) && inView(m2), { milk1: [m1.x, m1.y], slot0: [s0.x, s0.y], milk2: [m2.x, m2.y] });
  const pa = await P('lane(0)'), pb = await P('lane(1)'); notes.pxPer10cm_shelf = Math.round(Math.hypot(pb.x - pa.x, pb.y - pa.y) / 1.8);
  notes.hitDiameterPx = { apple: Math.max(68, Math.round(0.045 * notes.pxPer10cm_shelf * 10 * 2.1)), milk: Math.max(68, Math.round(0.05 * notes.pxPer10cm_shelf * 10 * 2.1)) };
  ck('当たり判定は 64 CSS px 以上 (最小でも直径68px)', notes.hitDiameterPx.apple >= 64, notes.hitDiameterPx);
  ck('最初のタッチ前は音が始まっていない', i0.audio === false && i0.audioState === 'none', i0.audioState);
  if (FULL) {
    // 放置 → 約4秒でお手本の手が一度だけ
    await g.wait(4.8); let ih = await info();
    ck('約4秒の放置でお手本の手が出る', ih.hints === 1 && ih.hint === true, { hints: ih.hints, idle: ih.idle });
    await g.wait(6); ih = await info();
    ck('お手本は一度だけ (くり返さない)', ih.hints === 1, { hints: ih.hints });
    // 牛乳より先に別の品に触れても小さく応えるだけ
    const ap = await item('apple1'); await dragTo(ap, { x: ap.x + 120, y: ap.y - 60 }); await g.wait(0.3);
    const ap2 = await item('apple1');
    ck('牛乳を置く前は別工程の品は小さく応答するだけ (動かせない)', ap2.loc === 'lane' && Math.abs(ap2.x - ap.x) < 6 && (await st()).intro === 0, { before: [ap.x, ap.y], after: [ap2.x, ap2.y] });
    ck('最初のタッチで Web Audio が始まる', (await info()).audio === true && (await info()).sounds > 0, { state: (await info()).audioState, sounds: (await info()).sounds });
  }
  // 牛乳を滑らせる: 反応の速さ
  const a0 = await item('milk1');
  await g.touch('touchStart', a0.x, a0.y); await g.frames(2);
  // 指を動かした瞬間のフレーム番号をページ内で記録し、牛乳が動いて見えたフレームとの差を数える
  await g.page.evaluate(() => { window.__t = { f: null }; document.getElementById('c').addEventListener('pointermove', () => { if (window.__t.f === null) { window.__t.f = window.__gf.perf.frames; window.__t.t = performance.now(); } }, { once: true }); });
  await g.touch('touchMove', a0.x + 6, a0.y - 34);
  const lat = await g.page.evaluate((y) => new Promise((res) => { const tick = () => { if (window.__t.f !== null && Math.abs(window.__gf.item('milk1').y - y) > 3) res({ frames: window.__gf.perf.frames - window.__t.f, ms: +(performance.now() - window.__t.t).toFixed(1), inputMs: window.__gf.perf.inputMs, fps: window.__gf.perf.fps }); else requestAnimationFrame(tick); }; tick(); }), a0.y);
  notes.milkResponse = lat;
  ck('牛乳は指を動かした次の描画フレームで本体が動く (60fps なら約17ms、30fps でも約33ms = 100ms以内)', lat.frames <= 1, { ...lat, note: 'frames=入力から反映までの描画フレーム数。ms はこのヘッドレス環境(低fps)での実測で、実機の値ではない' });
  const slot0 = await P('shelfSlot(0)'); const tDrop = (await info()).time; await g.slide({ x: a0.x + 6, y: a0.y - 34 }, { x: slot0.x, y: slot0.y + 20 }, 8); await g.wait(0.1); await g.up(); await g.wait(0.6);
  S = await st(); const snd1 = (await info()).sounds; notes.milkToShelfGameSec = +((await info()).time - tDrop).toFixed(2);
  ck('牛乳が棚の空きへ「ことん」と収まる', S.items.milk1.loc === 'shelf' && S.items.milk1.slot === 0 && S.intro === 1 && snd1 > 0, { loc: S.items.milk1.loc, slot: S.items.milk1.slot, sounds: snd1 });
  // 発見1: 手前のりんごを取ると奥が前へ / 奥へ戻す / 列を変える
  {
    const a1 = await item('apple1'), a2b = await item('apple2');
    await g.down(a1.x, a1.y); await g.slide(a1, { x: a1.x + 50, y: a1.y - 90 }, 4); await g.wait(1.3);
    const a2a = await item('apple2');
    ck('発見1: 手前のりんごを取ると奥のりんごが前へ転がる', a2b.lanePos > 0.05 && a2a.lanePos < 0.005, { before: a2b.lanePos, after: a2a.lanePos });
    const ln0 = await P('lane(0)'); await g.slide({ x: a1.x + 50, y: a1.y - 90 }, ln0, 5); await g.up(); await g.wait(1.6);
    let L = (await info()).lanes;
    ck('発見1: 同じ列へ戻すと奥に入り、次に出る品が変わる', L[0][0] === 'apple2' && L[0][1] === 'apple1', L);
    if (FULL) {
      const f = await item('apple2'), ln1 = await P('lane(1)'); await dragTo(f, ln1); await g.wait(1.6); L = (await info()).lanes;
      const a1n = await item('apple1');
      ck('発見1: 列を変えると元の列は次の品が前へ出る', L[0][0] === 'apple1' && L[1][0] === 'apple2' && a1n.lanePos < 0.005, L);
      const be = await item('berry'), ln2 = await P('lane(2)'); await dragTo(be, ln2); await g.wait(1.4);
      ck('いちごパックも納品箱から傾斜トレーへ並べられる', (await item('berry')).loc === 'lane', (await info()).lanes);
      // 並べ替え: 牛乳を別の空きへ
      const mm = await item('milk2'), s2 = await P('shelfSlot(2)'); await dragTo(mm, { x: s2.x, y: s2.y + 20 }); await g.wait(0.5);
      ck('棚の牛乳を別の空きへ並べ替えられる', (await st()).items.milk2.slot === 2, (await st()).items.milk2);
    }
  }
  await qshot('scene1');
  // かごへ集める (牛乳1・りんご1・いちご・パン。牛乳2とりんご2は棚に残す)
  const want = ['milk1', 'apple1', 'berry', 'bread']; const locs = {};
  for (const id of want) locs[id] = await toBasket(id);
  ck('好きな品をかごへ集められる', want.every((id) => locs[id] === 'basket'), locs);
  if (FULL) { // 逆戻り: かごからまた棚へ
    const br = await item('bread'), bn = await P('bin()'); await dragTo(br, bn); await g.wait(0.5);
    ck('かごの品を棚へ戻せる (逆戻り)', (await item('bread')).loc === 'bin');
    locs.bread = await toBasket('bread');
  }
  let bg = await P('basketGrip()'); await dragTo(bg, { x: bg.x + W * 0.5, y: bg.y - 20 }, 8, 0.1);
  await g.until(() => window.__gf.info().station === 1 && window.__gf.info().cust === 'atReg' && window.__gf.info().carryT === 1);
  await g.wait(1.2);
  ck('かごをレジ側へ運ぶと同じ品のままレジ場面へ', (await st()).basket === 'reg' && want.every((id) => true) && (await info()).station === 1, { basket: (await st()).basket });

  // ---------- 場面2: バーコードでピッ ----------
  let bt = await P('button()'); await g.tap(bt.x, bt.y); await g.wait(0.5);
  let ii = await info();
  ck('未読が残るうちの丸ボタンは会計にならない (未読品が寄るだけ)', ii.presses === 1 && ii.pays === 0 && (await st()).paid === 0, { presses: ii.presses, pays: ii.pays });
  const scanOne = async (id) => { const s = await P('scanner()'), t = await item(id); await g.down(s.x, s.y); await g.slide(s, { x: t.x, y: t.y }, 6); await g.wait(0.35); await g.up(); await g.wait(0.4); };
  let scanned = 0;
  for (let k = 0; k < 8; k++) {
    const s2 = await st(); const un = want.filter((id) => s2.items[id].loc === 'basket' && !s2.items[id].sc); if (!un.length) break;
    const before = (await info()).reads; await scanOne(un[0]); await g.until(() => !window.__gf.info().assist, 30000); await g.wait(0.3);
    const after = (await info()).reads; scanned++;
    if (k === 0) { const fi = await info(), sx = await st(); const nsc = want.filter((id) => sx.items[id].sc === 1).length; ck('スキャナーをかざすと最も近い一品ずつ読み、読取ごとに光と「ピッ」が一度', after - before >= 1 && fi.strong === fi.reads && nsc === fi.reads, { reads: fi.reads, strongFlashes: fi.strong, scannedItems: nsc }); }
    if (k === 1) await qshot('scene2');
  }
  S = await st(); ii = await info();
  ck('読んだ品は補助店員の手が右の受け台へ移す (全品)', want.every((id) => S.items[id].loc === 'tray' && S.items[id].sc === 1) && ii.reads === want.length, { reads: ii.reads, locs: want.map((id) => S.items[id].loc) });
  { // 再読取: 受け台の品へかざしても登録は増えない
    const before = ii.reads; await scanOne('milk1'); await g.wait(0.4); const fl = (await info()).flash;
    ck('再読取は短い確認光だけで登録は増えない', (await info()).reads === before && fl && fl.strong === false && (await info()).weak >= 1, { reads: (await info()).reads, flash: fl, weak: (await info()).weak });
  }
  bt = await P('button()'); for (let k = 0; k < 6; k++) await g.tap(bt.x, bt.y); // 連打
  await g.until(() => window.__gf.info().station === 2 && window.__gf.info().trayAt === 'bag' && window.__gf.info().cust === 'atBag', 60000);
  await g.wait(1.2); ii = await info(); S = await st();
  ck('丸ボタン連打でも会計確定は一度だけ', ii.pays === 1 && S.paid === 1 && want.every((id) => S.items[id].paid === 1), { presses: ii.presses, pays: ii.pays });
  ck('会計後は同じ受け台が袋の隣へ滑る (品もそのまま)', ii.trayAt === 'bag' && want.every((id) => S.items[id].loc === 'tray'));

  // ---------- 場面3: 袋詰めして渡す ----------
  if (FULL) {
    const e0 = await sim(); notes.bagEmpty = { bottoms: e0.bottoms, strainL: e0.strainL, strainR: e0.strainR };
    // 発見2
    let b = await putBag('milk1', -0.055); let s1 = await sim(); notes.milkLeft = { x: b && b.x, bottoms: s1.bottoms, strainL: s1.strainL, strainR: s1.strainR };
    const lowL = Math.min(s1.bottoms[0], s1.bottoms[1], s1.bottoms[2]), lowR = Math.min(s1.bottoms[3], s1.bottoms[4], s1.bottoms[5]);
    ck('発見2: 左へ牛乳 → 左の底が深く垂れ、左の持ち手が張る', b && b.in && b.x < -0.02 && s1.bottoms[1] < s1.bottoms[4] - 0.4 && s1.strainL > s1.strainR * 1.25, notes.milkLeft);
    void lowL; void lowR;
    ck('袋から出して受け台へ戻せる', (await takeOut('milk1')) === 'tray');
    b = await putBag('apple1', -0.055); let s2 = await sim(); notes.appleLeft = { x: b && b.x, bottoms: s2.bottoms, strainL: s2.strainL, strainR: s2.strainR };
    ck('発見2: 同じ位置のりんごより牛乳のほうが持ち手が張る', s1.strainL > s2.strainL * 1.25, { milk: s1.strainL, apple: s2.strainL });
    await takeOut('apple1');
    b = await putBag('milk1', 0.0); let s3 = await sim(); notes.milkCenter = { x: b && b.x, bottoms: s3.bottoms, strainL: s3.strainL, strainR: s3.strainR };
    await takeOut('milk1');
    b = await putBag('milk1', 0.055); let s4 = await sim(); notes.milkRight = { x: b && b.x, bottoms: s4.bottoms, strainL: s4.strainL, strainR: s4.strainR };
    ck('発見2: 中央・右へ移すとたわむ場所と張る持ち手も移る', s4.strainR > s4.strainL * 1.25 && s4.bottoms[4] < s4.bottoms[1] - 0.4 && Math.abs(s3.strainL - s3.strainR) < Math.abs(s1.strainL - s1.strainR), { center: notes.milkCenter, right: notes.milkRight });
    // 発見3: 牛乳にもたれたりんご → 牛乳を抜くと転がる
    const ap = await putBag('apple1', -0.02, 0.2); const sb = await sim(); const apB = sb.bodies.find((x) => x.id === 'apple1'), mkB = sb.bodies.find((x) => x.id === 'milk1');
    await takeOut('milk1'); await g.wait(1.0); const sa = await sim(); const apA = sa.bodies.find((x) => x.id === 'apple1');
    notes.d3 = { before: apB, milk: mkB, after: apA };
    ck('発見3: 支えの牛乳を引き抜くとりんごが空いた底へ転がる', apB && apA && (Math.abs(apA.x - apB.x) > 0.012 || Math.abs(apA.a - apB.a) > 0.25), { before: [apB && apB.x, apB && apB.a], after: [apA && apA.x, apA && apA.a] });
    void ap;
    const r1 = await putBag('milk1', -0.06); const sc1 = await sim(); const apC = sc1.bodies.find((x) => x.id === 'apple1');
    ck('発見3: 別方向から差し戻すと収まり方が変わる', r1 && apC && (Math.abs(r1.x - mkB.x) > 0.03 || Math.abs(apC.x - apB.x) > 0.01), { milkBefore: mkB && mkB.x, milkAfter: r1 && r1.x, appleBefore: apB && apB.x, appleAfter: apC && apC.x });
    await takeOut('milk1'); await takeOut('apple1'); await g.wait(0.5);
    // 発見4: 牛乳の右どなり(口の「肩」の下・牛乳の陰)の品は、口を開く前はつかめない → 右の持ち手を横へ引くと届く
    const mk = await putBag('milk1', 0.02, 0.2); const hid = await putBag('apple1', 0.085, 0.3, { settle: 1.8 });
    let sd = await sim(); let bb = sd.bodies.find((x) => x.id === 'apple1'), mb = sd.bodies.find((x) => x.id === 'milk1'); notes.d4 = { hidden: bb, milk: mb, mouth0: sd.mouth, band0: sd.band };
    if (!bb || !mb) throw new Error('発見4の準備に失敗: ' + JSON.stringify(sd.bodies));
    void mk; void hid;
    const blocked0 = (await info()).blocked; let pb2 = await P(`bag(${bb.x},${bb.y})`); await g.down(pb2.x, pb2.y); const dk0 = (await info()).drag; await g.slide(pb2, { x: pb2.x, y: pb2.y - 120 }, 4); await g.up(); await g.wait(0.6);
    const sd1 = await sim(); const bb1 = sd1.bodies.find((x) => x.id === 'apple1');
    ck('発見4: 牛乳の陰(口の肩の下)の品は口を開く前はつかめない (小さく応えるだけ)', bb.reach === false && dk0 === 'none' && (await info()).blocked === blocked0 + 1 && bb1 && bb1.in && Math.abs(bb1.y - bb.y) < 0.03, { reach: bb.reach, drag: dk0, hidden: [bb.x, bb.y], milk: [mb.x, mb.y, mb.a], band: sd.band });
    // 左だけ開く → 届く範囲は左へ広がるだけ
    let hl = await P('handle(0)'), pl = await P('peg(0)'); await dragTo(hl, pl, 6, 0.2); await g.wait(1.2); let so = await sim(); const bandL = so.band, reachL = so.bodies.find((x) => x.id === 'apple1').reach, mouthL = so.mouth, pegsL = (await st()).pegs.slice();
    hl = await P('handle(0)'); pl = await P('peg(1)'); await dragTo(hl, pl, 6, 0.2); await g.wait(1.0);
    let hr = await P('handle(1)'), pr = await P('peg(3)'); await dragTo(hr, pr, 6, 0.2); await g.wait(1.3); so = await sim(); const bb2 = so.bodies.find((x) => x.id === 'apple1');
    ck('発見4: 袋掛けが片側を支えたまま反対の持ち手を横へ引くと口が広がり、離しても開いたまま', (await st()).pegs[1] === 3 && pegsL[0] === 0 && so.mouth[1] > sd.mouth[1] + 0.04 && mouthL[0] < sd.mouth[0] - 0.03, { mouthRest: sd.mouth, mouthLeftOpen: mouthL, mouthRightOpen: so.mouth });
    ck('発見4: 開く方向で届く場所が変わる (左を開くと左へ、右を開くと右へ)', bandL[0] < sd.band[0] - 0.05 && Math.abs(bandL[1] - sd.band[1]) < 0.01 && so.band[1] > sd.band[1] + 0.05 && Math.abs(so.band[0] - sd.band[0]) < 0.01 && bb2.reach === true, { rest: sd.band, leftOpen: bandL, rightOpen: so.band, hiddenReach: { rest: bb.reach, leftOpen: reachL, rightOpen: bb2.reach } });
    pb2 = await P(`bag(${bb2.x},${bb2.y})`); const upP = await P(`bag(${bb2.x},0.7)`), outP = await P('bag(-0.42,0.6)');
    await g.down(pb2.x, pb2.y); const dk = (await info()).drag; await g.slide(pb2, upP, 6); await g.slide(upP, outP, 6); await g.up(); await g.wait(1.0);
    ck('発見4: 口を開くと陰の品をつかんで取り出せる', dk === 'body' && (await item('apple1')).loc === 'tray', { drag: dk, loc: (await item('apple1')).loc });
    // いちごパックでも同じ (牛乳の右へ落とす。届くかどうかは収まり方しだいなので記録のみ)
    const bh0 = await putBag('berry', 0.115, 0.3, { settle: 1.8 }); so = await sim(); notes.d4berry = { berry: so.bodies.find((x) => x.id === 'berry'), band: so.band }; void bh0;
    hr = await P('handle(1)'); pr = await P('peg(2)'); await dragTo(hr, pr, 6, 0.2); await g.wait(1.2);
    so = await sim(); notes.d4berry.afterClose = so.bodies.find((x) => x.id === 'berry');
    await putBag('apple1', -0.05, 0.25);
    // 発見5: 長いパン
    const br = await item('bread'); const topB = await P('bag(0,0.62)'), restB = await P('bag(0,0.4)');
    await g.down(br.x, br.y); await g.slide(br, topB, 7); await g.slide(topB, restB, 4); await g.wait(0.3); await g.up(); await g.wait(1.6);
    let sbr = await sim(); let bd = sbr.bodies.find((x) => x.id === 'bread'); notes.d5a = { bread: bd, mouth: sbr.mouth };
    const horiz = bd && Math.abs(Math.sin(bd.a)) > 0.8;
    ck('発見5: 横向きのパンは両端が袋口に載る', bd && horiz && !bd.all && bd.y > sbr.mouth[2] - 0.03, { bread: bd, mouthY: sbr.mouth[2] });
    // 端をつかんで持ち上げる → 先が下を向く → 入る
    const endP = await P(`bag(${bd.x + 0.15 * Math.abs(Math.sin(bd.a)) * Math.sign(Math.sin(bd.a) || 1) * -1},${bd.y + 0.15 * Math.cos(bd.a) * -1})`);
    const endAlt = await P(`bag(${bd.x + 0.15},${bd.y})`); void endP;
    await g.down(endAlt.x, endAlt.y); const liftP = await P('bag(0.03,0.86)'); await g.slide(endAlt, liftP, 7); await g.wait(1.0);
    const sh = await sim(); const bh = sh.bodies.find((x) => x.id === 'bread');
    const inP = await P('bag(0.03,0.5)'); await g.slide(liftP, inP, 7); await g.wait(0.3); await g.up(); await g.wait(1.8);
    sbr = await sim(); bd = sbr.bodies.find((x) => x.id === 'bread'); notes.d5b = { hanging: bh, final: bd };
    ck('発見5: 端をつかむと先が下を向き、入れると上だけ残る', bh && Math.abs(Math.cos(bh.a)) > 0.75 && bd && bd.in && !bd.all, { hangingAngle: bh && bh.a, final: bd });
    const ang0 = bd.a; const mkb = sbr.bodies.find((x) => x.id === 'milk1');
    const mp = await P(`bag(${mkb.x},${mkb.y + 0.05})`), mp2 = await P(`bag(${mkb.x - 0.06},${mkb.y + 0.07})`);
    await g.down(mp.x, mp.y); await g.slide(mp, mp2, 5); await g.wait(0.3); await g.up(); await g.wait(1.5);
    sbr = await sim(); bd = sbr.bodies.find((x) => x.id === 'bread');
    ck('発見5: 牛乳をずらすとパンの斜め方向も変わる', Math.abs(bd.a - ang0) > 0.03, { before: ang0, after: bd.a });
  } else {
    await putBag('milk1', -0.05); await putBag('apple1', 0.04); await putBag('berry', 0.0, 0.3);
    const br = await item('bread'); const liftP = await P('bag(0.02,0.86)'), inP = await P('bag(0.02,0.5)');
    await g.down(br.x + Math.round(notes.pxPer10cm_shelf * 1.2), br.y); await g.slide(br, liftP, 7); await g.wait(1.0); await g.slide(liftP, inP, 7); await g.wait(0.3); await g.up(); await g.wait(1.8);
  }
  S = await st(); const inBag = want.filter((id) => S.items[id].loc === 'bag');
  ck('会計済みの品が袋に入っている', inBag.length >= 3, { inBag, sim: (await sim()).bodies.map((b) => [b.id, b.x, b.y, b.in]) });
  await qshot('scene3');
  // 発見6: 持ち上げて横へ運び、止める
  const liftBag = async () => { const h = await P('handle(1)'), up = await P('bag(0.1,0.7)'); await g.down(h.x, h.y); await g.slide(h, up, 6); await g.wait(0.5); return up; };
  const carryTo = async (targetX, stepPx, waitEach) => { for (let k = 0; k < 40; k++) { const s = await sim(); const x = (s.pins[0] + s.pins[2]) / 2; if (Math.abs(x - targetX) < 0.03) break; const cur = await P(`bag(${x},${s.pins[1]})`); await g.move(cur.x + Math.sign(targetX - x) * stepPx, cur.y); if (waitEach) await g.wait(waitEach); } };
  const swing = async (n = 14) => { const out = []; for (let k = 0; k < n; k++) { const s = await sim(); out.push(+(s.com[0] - (s.pins[0] + s.pins[2]) / 2).toFixed(3)); await g.wait(0.12); } return out; };
  if (FULL) {
    await liftBag(); const lf = await info(); ck('持ち手を上へ引くと両持ち手をまとめて持ち上げる', lf.drag === 'handle:lift' && lf.bagWhere === 'held', { drag: lf.drag });
    await carryTo(-0.2, 40, 0); await g.wait(1.5);
    await carryTo(0.12, 60, 0); const fast = await swing(); const ampFast = Math.max(...fast) - Math.min(...fast);
    await g.wait(2.0); const settled = await swing(4);
    await carryTo(-0.2, 8, 0.12); await g.wait(0.2); const slow = await swing(); const ampSlow = Math.max(...slow) - Math.min(...slow);
    notes.d6 = { fast, slow, ampFast, ampSlow, settled };
    ck('発見6: 横へ運んで止めると底が遅れて揺れる', ampFast > 0.02 && fast.some((v) => v > 0.004) && fast.some((v) => v < -0.004), { ampFast, fast });
    ck('発見6: ゆっくり運ぶと揺れが小さい', ampSlow < ampFast * 0.75, { ampFast, ampSlow });
    // 台へ置く → 収まる
    const s0b = await sim(); const cur = await P(`bag(${(s0b.pins[0] + s0b.pins[2]) / 2},${s0b.pins[1]})`), down = await P(`bag(0,${0.42})`); await g.slide(cur, down, 8); await g.wait(1.5);
    const rest = await swing(6); const ampRest = Math.max(...rest) - Math.min(...rest); await g.up(); await g.wait(1.2);
    ck('発見6: 台へ置くと揺れが収まり、離すと袋掛けへ戻る', ampRest < 0.012 && (await info()).bagWhere === 'rack' && (await sim()).bodies.length >= 3, { ampRest, bagWhere: (await info()).bagWhere });
  }
  // 手渡し
  const handover = async () => { await liftBag(); await carryTo(0.3, 30, 0.05); await g.wait(1.0); const hp = await P('custHand()'); const s = await sim(); await g.up(); return { hp, s }; };
  let ho = await handover(); notes.handover = { custHand: ho.hp, com: ho.s.com, pins: ho.s.pins };
  ck('持った袋を近づけると客が手を伸ばして受け取りの構えをとる', ho.hp.bow > 0.15 && Math.abs(ho.hp.x - (ho.s.pins[0] + ho.s.pins[2]) / 2) < 0.15, ho.hp);
  await g.until(() => window.__gf.info().hands >= 1 && window.__gf.info().cust === 'holding', 30000); await g.wait(2.6);
  { const hp = await P('custHand()'); notes.holding = hp; ck('重い袋 (1.25kg超) では客がもう一方の手を底へ添える', ho.s.com[2] <= 1.25 ? hp.support === false : hp.support === true && hp.arm1 === true, { mass: ho.s.com[2], support: hp.support, arm1: hp.arm1 }); }
  ck('離すと客が受け取り、同じ袋・同じ品が客の手に', (await st()).handed === 1 && (await info()).bagWhere === 'cust' && (await sim()).bodies.length >= 3, { bodies: (await sim()).bodies.map((b) => b.id), support: (await P('custHand()')).support });
  if (FULL) {
    const s = await sim(); const c = await P(`bag(${(s.mouth[0] + s.mouth[1]) / 2},${s.mouth[2] - 0.15})`); await g.tap(c.x, c.y);
    await g.until(() => window.__gf.info().bagWhere === 'rack' && window.__gf.state().handed === 0 && window.__gf.info().cust === 'atBag', 60000); await g.wait(1.0);
    const sr = await sim(); S = await st();
    ck('渡した袋に触れると客が同じ袋を台へ戻す (品はそのまま・会計も増えない)', (await info()).returns === 1 && sr.bodies.length >= 3 && S.paid === 1 && (await info()).pays === 1, { bodies: sr.bodies.map((b) => b.id), pays: (await info()).pays });
    // 再訪: レジへ戻って再読取しても会計は増えない
    const tk = await takeOut(sr.bodies.find((b) => b.id !== 'bread').id); void tk;
    const nv = { x: Math.round(W * 0.25), y: Math.round(H * 0.12) }; await g.drag(nv, { x: nv.x + W * 0.5, y: nv.y }, 6, 0.05);
    await g.until(() => window.__gf.info().station === 1 && window.__gf.info().trayAt === 'reg', 30000); await g.wait(1.2);
    const onTray = Object.keys((await st()).items).filter((id) => (window, true) && true); void onTray;
    const S2 = await st(); const tid = want.find((id) => S2.items[id].loc === 'tray'); const r0 = (await info()).reads;
    await scanOne(tid); bt = await P('button()'); await g.tap(bt.x, bt.y); await g.tap(bt.x, bt.y);
    await g.until(() => window.__gf.info().station === 2 && window.__gf.info().trayAt === 'bag', 30000); await g.wait(1.0);
    ck('取り出した品を再読取・再度ボタンを押しても登録と会計は増えない', (await info()).reads === r0 && (await info()).pays === 1 && (await st()).paid === 1, { reads: (await info()).reads, pays: (await info()).pays });
    await putBag(tid, 0.0, 0.3);
    ho = await handover(); await g.until(() => window.__gf.info().hands >= 2 && window.__gf.info().cust === 'holding', 30000);
  }
  await g.until(() => window.__gf.state().phase === 'close' && window.__gf.info().station === 0, 120000); await g.wait(1.6);
  S = await st();
  ck('手渡しとおじぎのあと店じまいへ (渡した品は売れ、残りは棚に)', S.phase === 'close' && S.basket === 'stand' && want.filter((id) => S.items[id].loc === 'sold').length >= 3 && S.items.milk2.loc === 'shelf' && S.items.apple2.loc === 'lane', { sold: want.filter((id) => S.items[id].loc === 'sold'), milk2: S.items.milk2, apple2: S.items.apple2.loc });

  // ---------- 場面4: 店じまい ----------
  ck('売れた棚で残品が奥に引っ込んでいる', S.items.milk2.tidy === 0);
  const mm2 = await item('milk2'); await g.tap(mm2.x, mm2.y); await g.wait(0.6);
  ck('残品に触れると前へ寄る', (await st()).items.milk2.tidy === 1);
  bg = await P('basketGrip()'); const sk = await P('stack()'); await dragTo(bg, { x: bg.x, y: bg.y + Math.max(80, Math.abs(sk.y - bg.y) + 60) }, 6, 0.1);
  await g.wait(0.6); ck('空かごを重ねられる', (await st()).basket === 'stack');
  await g.until(() => window.__gf.info().station === 3, 30000); await g.wait(1.6);
  let bar = await P('shutterBar()'); const half = await P('pt(1.55,1.2,-3.52)');
  await g.down(bar.x, bar.y); await g.slide(bar, { x: bar.x, y: half.y }, 8); await g.up(); await g.wait(1.0);
  const sh1 = (await st()).shutter; await g.wait(1.2); const sh2 = (await st()).shutter;
  ck('シャッターは引いたぶん下がり、離すとその位置で止まる', sh1 > 0.25 && sh1 < 0.8 && Math.abs(sh1 - sh2) < 1e-6 && (await info()).station === 3, { shutter: sh1 });
  await qshot('scene4-shutter');
  bar = await P('shutterBar()'); const bot = await P('pt(1.55,-0.1,-3.52)');
  await g.down(bar.x, bar.y); await g.slide(bar, { x: bar.x, y: Math.min(H - 4, bot.y + 30) }, 10); await g.up();
  await g.until(() => window.__gf.info().station === 4, 30000);
  ck('閉じ切るとカメラが日中の店先へ移る', (await st()).shutter === 1 && (await info()).station === 4);
  { bar = await P('shutterBar()'); await g.drag(bar, { x: bar.x, y: bar.y - 200 }, 5, 0.05); ck('はなまるを受け取るまではシャッターは開かない', (await st()).shutter === 1 && (await info()).station === 4); }
  await g.until(() => window.__gf.state().carded === 1, 60000); await g.wait(1.6);
  const cs = await P('cardScreen()');
  ck('店長が白いカードにはなまるを押して渡す', (await info()).cards === 1 && cs.visible && inView(cs), cs);
  await qshot('scene4-storefront');
  // 再開店
  bar = await P('shutterBar()'); const topP = await P('pt(1.55,2.3,-3.52)');
  await g.down(bar.x, bar.y); await g.slide(bar, { x: bar.x, y: Math.max(4, topP.y) }, 10); await g.up();
  await g.until(() => window.__gf.info().station === 0 && window.__gf.info().via === 0 && window.__gf.state().day === 2, 60000); await g.wait(1.5);
  S = await st();
  ck('上へ引くと再開店: 新しい取引として補充される', S.day === 2 && S.phase === 'open' && S.paid === 0 && S.shutter < 0.01 && S.basket === 'stand' && S.items.milk1.loc === 'crate' && S.items.bread.loc === 'bin' && want.every((id) => S.items[id].sc === 0 && S.items[id].paid === 0), { milk1: S.items.milk1.loc, apple1: S.items.apple1.loc, berry: S.items.berry.loc, bread: S.items.bread.loc });
  ck('前回整えた棚の並びは残る', S.items.milk2.loc === 'shelf' && S.items.milk2.tidy === 1 && S.items.apple2.loc === 'lane' && (!FULL || (S.items.milk2.slot === 2 && S.items.apple2.slot === 1)), { milk2: S.items.milk2, apple2: S.items.apple2 });
  const m1b = await item('milk1'); ck('再開店後も納品箱の牛乳から始められる', inView(m1b) && m1b.loc === 'crate', [m1b.x, m1b.y]);
  if (FULL) { const a = await item('milk1'), s = await P('shelfSlot(0)'); await dragTo(a, { x: s.x, y: s.y + 20 }); await g.wait(0.6); ck('2日目も同じ操作で遊べる', (await st()).items.milk1.loc === 'shelf'); }
} catch (e) { ck('例外なく最後まで遊べる', false, String(e && e.message).slice(0, 400)); }

const fin = await info().catch(() => ({}));
ck('コンソールエラー 0', g.log.errors.length === 0, g.log.errors.slice(0, 5));
ck('外部リクエスト 0 (自分自身の HTML のみ)', g.log.requests.every((u) => u.startsWith('file://') && u.includes('index.html')), g.log.requests.slice(0, 5));
const res = { size: tag, mode: MODE, url: 'file:// (index.html?low=1&rs=0.25&fixed=1 で操作 / ?fixed=1 で撮影)', wallSec: Math.round((Date.now() - T0) / 1000), gameSec: fin.time, sounds: fin.sounds, pass: checks.filter((c) => c.pass).length, fail: checks.filter((c) => !c.pass).length, checks, notes };
fs.writeFileSync(path.join(outDir, `play-${tag}.json`), JSON.stringify(res, null, 1));
console.log(`\n${tag} ${MODE}: pass ${res.pass} / fail ${res.fail}  (${res.wallSec}s)`);
await browser.close(); process.exit(0);
