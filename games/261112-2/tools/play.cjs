// 通し遊びの検証: 最初の浴室から寝かしつけ・はなまる・再遊び・再読込まで、
// すべて実際のタッチ(Pointer Events)で操作する。保存データの書き込みによる近道は使わない。
// 使い方: node play.cjs 820 1180
const { open, rec } = require('./lib.cjs');
const path = require('path');
const f = (v) => (typeof v === 'number' ? +v.toFixed(4) : v);
const W = +process.argv[2] || 820, H = +process.argv[3] || 1180; const tag = `${W}x${H}`;
const shotDir = path.resolve(__dirname, 'shots');
(async () => {
  const T = await open({ w: W, h: H }); const t0 = Date.now(); const R = { size: tag, checks: {}, notes: {}, timeline: [] };
  const ok = (name, cond, info) => { R.checks[name] = { pass: !!cond, info }; console.log((cond ? 'PASS ' : 'FAIL ') + name, info === undefined ? '' : JSON.stringify(info)); };
  const mark = async (label) => { const s = await T.st(); R.timeline.push({ label, wall: +((Date.now() - t0) / 1000).toFixed(1), simT: f(s.simT), stage: s.stage, scene: s.scene, level: f(s.level), foam: s.foam, fps: f(s.fps) }); return s; };
  const shot = (name) => T.shot(path.join(shotDir, `${tag}_${name}.png`));
  const onScreen = (p) => p.x > 8 && p.x < W - 8 && p.y > 8 && p.y < H - 8;

  // ---- 1 ためる ----
  let s = await mark('start'); let tg = await T.tg();
  ok('start_first_bath', s.stage === 1 && s.scene === 1 && !s.ducks[1].floating && s.ducks[0].mode === 'tub' && s.audio === 'none', { stage: s.stage, level: f(s.level), audio: s.audio });
  ok('start_targets_visible', onScreen(tg.handle) && onScreen(tg.kid) && onScreen(tg.parent), { handle: [f(tg.handle.x), f(tg.handle.y)], hitR: { handle: tg.handle.r, kid: f(tg.kid.r), parent: f(tg.parent.r) } });
  ok('hit_areas_64px', Object.values(tg).every((t) => t.r * 2 >= 64), Object.fromEntries(Object.entries(tg).map(([k, v]) => [k, Math.round(v.r * 2)])));
  // 迷ったら約4秒で指のお手本
  const hi = await T.until((st) => st.handOn, 20000, 150); ok('hint_appears_when_idle', !!hi && hi.hint === 'handle', hi && { hint: hi.hint, simT: f(hi.simT) });
  if (W === 820 || W === 375) await shot('s1_hint'); else { await T.wait(2500); }
  await shot('s1_tameru');
  tg = await T.tg(); await T.down(tg.handle.x, tg.handle.y); await T.wait(700); s = await T.st(); ok('hint_retreats_on_touch', !s.handOn, { handOn: s.handOn });
  ok('audio_starts_on_first_touch', s.audio === 'running', { audio: s.audio });
  await T.move(tg.handle.x - 14, tg.handle.y + 5); await T.wait(350); s = await T.st(); ok('short_drag_moves_handle', s.open > 0.02 && s.drag === 'handle', { open: f(s.open), flow: f(s.flow) });
  for (let k = 2; k <= 6; k++) { await T.move(tg.handle.x - 14 * k, tg.handle.y + 5 * k); await T.wait(70); } await T.up(); s = await mark('faucet_open'); ok('faucet_continuous', s.open > 0.3 && s.open < 1, { open: f(s.open) });
  const lv0 = R.timeline[0].level; const fl = await T.until((st) => st.ducks[1].floating, 40000, 200); ok('d1_kid_floats_on_step_when_filled', !!fl && fl.level > lv0, fl && { level: f(fl.level), simT: f(fl.simT), kidY: f(fl.ducks[1].y) }); await mark('kid_floats');
  s = await T.until((st) => st.stage >= 2 && st.scene === 2, 15000); ok('scene2_follows_same_water', !!s, s && { scene: s.scene, level: f(s.level) }); await T.settle();
  // 満水近くまでためる(オーバーフロー口へ流れ出すまで)
  s = await T.until((st) => st.overQ > 0, 90000, 500); ok('overflow_outlet_takes_excess', !!s && s.level < 0, s && { level: f(s.level), overQ: f(s.overQ * 1000) }); await mark('full');
  tg = await T.tg(); await T.tap(tg.handle.x, tg.handle.y); s = await T.until((st) => st.flow < 0.02, 8000); ok('faucet_tap_closes', !!s, s && { open: f(s.open) });

  // ---- 2 泡を混ぜる ----
  const foam0 = (await T.st()).foam; await T.stroke([[0.3, 0.1], [0.27, -0.08], [0.24, -0.26]], 600); await T.wait(300); s = await T.st(); ok('stroke_moves_camera_to_water', s.scene === 2, { scene: s.scene }); await T.settle();
  for (let i = 0; i < 4; i++) { await T.stroke(i % 2 ? [[-0.02, 0.12], [0.0, -0.08], [0.02, -0.26]] : [[0.3, 0.12], [0.27, -0.08], [0.24, -0.26]], 600); await T.wait(250); if (i === 1) await shot('s2_awa'); }
  s = await mark('stroked'); ok('stroking_mixes_foam_and_unlocks_shower', s.stage >= 3 && s.foam >= foam0, { stage: s.stage, foam0, foam: s.foam, made: s.made });
  s = await T.until((st) => st.scene === 3, 15000); ok('scene3_after_mixing', !!s); await T.settle();

  // ---- 3 浮かべて洗う ----
  // 親は段に立ったまま満水→持ち上げて深い所へ下ろすと、給水なしで縁へ水が乗る
  s = await T.st(); const lvBefore = s.level; let peak = 0, lvMax = -1, lifted = 0; let done = false;
  const cp = T.carry('parent', [0.14, 0.02], { after: 0 }).then(() => { done = true; }); while (!done) { const q = await T.st(); if (q.ducks[0].mode === 'held') lifted = lifted ? Math.min(lifted, q.level) : q.level; peak = Math.max(peak, q.spillPeak); await T.wait(120); } await cp;
  for (let i = 0; i < 12; i++) { const q = await T.st(); peak = Math.max(peak, q.spillPeak, q.spill); lvMax = Math.max(lvMax, q.level); await T.wait(120); }
  s = await mark('parent_dropped'); ok('d4_parent_displaces_water_onto_rim', peak > 0.3 && s.ducks[0].floating && lifted < lvBefore - 0.004 && s.open === 0, { levelBefore: f(lvBefore), lifted: f(lifted), maxAfterDrop: f(lvMax), spillPeak: f(peak), faucetOpen: s.open, disc: s.disc });
  // シャワー: 親の頭の横から
  tg = await T.tg(); ok('shower_unlocked', !tg.shower.locked && onScreen(tg.shower), tg.shower); await T.down(tg.shower.x, tg.shower.y); await T.wait(500); await T.settle();
  s = await T.st(); const P0 = s.ducks[0]; const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  let p = await T.w2s([[cl(P0.x - 0.3, -0.7, 0.6), 0.3, cl(P0.z - 0.3, -0.48, 0.45)], [cl(P0.x - 0.2, -0.7, 0.6), 0.3, cl(P0.z - 0.26, -0.48, 0.45)]]); for (const q of p) { await T.move(q[0], q[1]); await T.wait(450); } await T.wait(1400); s = await T.st(); const hd = s.ducks[0].head;
  const dz = hd[2] - 0.34 >= -0.48 ? 1 : -1; // 奥から手前へ、届かなければ手前から奥へ
  p = await T.w2s([[hd[0], 0.3, cl(hd[2] - dz * 0.46, -0.49, 0.49)], [hd[0], 0.3, hd[2] - dz * 0.37], [hd[0], 0.3, hd[2] - dz * 0.31]]); for (const q of p) { await T.move(q[0], q[1]); await T.wait(500); }
  let neck = 0, hitDuck = 0; for (let i = 0; i < 8; i++) { await T.wait(350); const q = await T.st(); neck = Math.max(neck, q.ducks[0].neck); if (q.shower.kind === 2) hitDuck++; }
  await shot('s3_arau'); s = await T.st(); ok('shower_wets_feathers_and_parent_lowers_head', s.shower.held && neck > 0.6 && hitDuck > 0 && s.ducks[0].wet[0] > 0.5, { neck: f(neck), hitDuck, parentWet: s.ducks[0].wet.map(f) });
  await T.up(); await T.wait(600); s = await T.st(); ok('shower_returns_and_stops', !s.shower.held && s.drag === null); s = await T.until((st) => st.stage >= 4 && st.scene === 4, 15000); ok('stage4_after_shower', !!s); await T.settle(); await mark('washed');

  // ---- 4 排水して拭く ----
  // 子を段へ運ぶ→浮く。栓を少し上げる→同じ子が再び立つ。栓を戻す→止まる
  await T.carry('kid', [-0.4, 0.06]); await T.wait(1500); await T.settle(); s = await T.st(); const kidOnStepFloat = s.ducks[1].floating && s.ducks[1].x < -0.22;
  tg = await T.tg(); ok('ring_unlocked', !tg.ring.locked && onScreen(tg.ring), tg.ring);
  let a = await T.scr(0.552, 0.042, 0.1), b = await T.scr(0.552, 0.042 + 0.04, 0.1); await T.drag([[tg.ring.x, tg.ring.y], [tg.ring.x, tg.ring.y + (b.y - a.y)]], 500); s = await T.st(); const ringPartial = s.ring; ok('ring_partial_position_drains', s.ring > 0.02 && s.ring < 0.12 && s.drainQ > 0, { ring: f(s.ring), drainQ: f(s.drainQ * 1000) });
  s = await T.until((st) => !st.ducks[1].floating && st.ducks[1].mode === 'tub', 60000, 300); ok('d1_same_kid_stands_again_when_drained', kidOnStepFloat && !!s && s.ducks[1].x < -0.22, s && { level: f(s.level), kid: [f(s.ducks[1].x), f(s.ducks[1].z)], floatedBefore: kidOnStepFloat }); await mark('kid_stands_again');
  tg = await T.tg(); a = await T.scr(0.552, 0.042 + ringPartial, 0.1); b = await T.scr(0.552, 0.042 - 0.03, 0.1); await T.drag([[tg.ring.x, tg.ring.y], [tg.ring.x, tg.ring.y + (b.y - a.y)]], 400); s = await T.st(); const lvStop = s.level; await T.wait(1500); const s2 = await T.st(); ok('ring_down_stops_drain', s.ring < 0.005 && s2.drainQ === 0 && Math.abs(s2.level - lvStop) < 0.002, { ring: f(s.ring), level: [f(lvStop), f(s2.level)] });
  // 水面を回してから栓を抜く→泡が排水口へ集まる。足のついた二羽は残る
  for (let i = 0; i < 2; i++) await T.stroke([[0.46, 0.1], [0.33, 0.22], [0.2, 0.1], [0.33, -0.02], [0.46, 0.1], [0.33, 0.22], [0.2, 0.1]], 1100); await T.wait(300); await T.settle();
  s = await T.st(); const gam = s.gamma; const foamBefore = s.foam; tg = await T.tg(); a = await T.scr(0.552, 0.042, 0.1); b = await T.scr(0.552, 0.042 + 0.13, 0.1); await T.drag([[tg.ring.x, tg.ring.y], [tg.ring.x, tg.ring.y + (b.y - a.y)]], 500); await T.settle();
  let walked = false; s = await T.until((st) => { if (st.ducks.some((d) => d.walking)) walked = true; return st.level < -0.2 || st.sucked > 8; }, 60000, 300); const suckedMid = s ? s.sucked : 0;
  // 途中で栓を戻す→吸い込みが止まり、残った泡でまた遊べる
  tg = await T.tg(); a = await T.scr(0.552, 0.042 + 0.13, 0.1); b = await T.scr(0.552, 0.042 - 0.04, 0.1); await T.drag([[tg.ring.x, tg.ring.y], [tg.ring.x, tg.ring.y + (b.y - a.y)]], 400); s = await T.st(); const lvMid = s.level, foamMid = s.foam; for (let i = 0; i < 4; i++) { await T.wait(300); const q = await T.st(); if (q.ducks.some((d) => d.walking)) walked = true; } const s3 = await T.st();
  ok('d6_swirl_then_drain_gathers_foam', suckedMid > 0 && foamBefore > 0, { circulation: f(gam), foamBefore, sucked: suckedMid }); ok('d6_plug_back_stops_suction_foam_remains', s3.drainQ === 0 && Math.abs(s3.level - lvMid) < 0.002 && s3.sucked - s.sucked <= 1, { level: f(lvMid), foamLeft: foamMid, suckedAfterStop: s3.sucked - s.sucked });
  await T.stroke([[0.1, 0.1], [0.2, 0.0], [0.3, -0.1]], 500); await T.settle(); await mark('mid_drain');
  tg = await T.tg(); a = await T.scr(0.552, 0.042, 0.1); b = await T.scr(0.552, 0.042 + 0.14, 0.1); await T.drag([[tg.ring.x, tg.ring.y], [tg.ring.x, tg.ring.y + (b.y - a.y)]], 500);
  for (let i = 0; i < 160; i++) { const q = await T.st(); if (q.ducks.some((d) => d.walking)) walked = true; if (q.level < -0.332 && (walked || i > 120)) break; await T.wait(350); }
  await T.wait(2500); await T.settle(); s = await mark('drained'); ok('d6_ducks_stay_and_waddle_when_water_leaves', s.ducks.every((d) => d.mode === 'tub' && !d.floating) && walked && s.level < -0.3, { level: f(s.level), walked, ducks: s.ducks.map((d) => [d.kind, f(d.x), f(d.z)]) });
  await shot('s4_haisui');
  // タオルへ運ぶ
  tg = await T.tg(); ok('towel_unlocked', !tg.towel0.locked && !tg.towel1.locked);
  await T.carry('kid', [0.19, -0.58]); await T.settle(); s = await T.st(); ok('carry_kid_to_towel', s.ducks[1].mode === 'deck' && s.stage === 5, { kid: s.ducks[1].mode, stage: s.stage });
  await T.carry('parent', [0.06, -0.63]); await T.settle(); s = await mark('on_towel'); ok('carry_parent_to_towel', s.ducks[0].mode === 'deck' && s.scene === 5, { parent: s.ducks[0].mode, scene: s.scene });
  // 子の手前側(右の羽)だけを、右の端でなでる
  const K = s.ducks[1]; const wetBefore = K.wet.slice(); tg = await T.tg(); await T.down(tg.towel1.x, tg.towel1.y); await T.wait(450); await T.settle();
  const c = Math.cos(K.h), sn = Math.sin(K.h); const loc = (lx, lz) => [K.x + lx * c - lz * sn, 0.12, K.z + lx * sn + lz * c];
  const cr = (await T.ev(() => { const v = window.__duckbath.towel.p; const n = window.__duckbath.towel.n; return [v[(n - 1) * 3], v[(n - 1) * 3 + 2]]; })); const vx = cr[0] - K.x, vz = cr[1] - K.z; const sideSign = (-sn * vx + c * vz) >= 0 ? 1 : -1; // 端のある側の羽だけをなでる
  p = await T.w2s([loc(0.07, sideSign * 0.12), loc(0.06, sideSign * 0.058), loc(-0.05, sideSign * 0.058), loc(0.06, sideSign * 0.058), loc(-0.05, sideSign * 0.058), loc(0.06, sideSign * 0.058), loc(-0.05, sideSign * 0.058), loc(0.06, sideSign * 0.058), loc(-0.05, sideSign * 0.058), loc(0.06, sideSign * 0.058)]);
  let pp = [tg.towel1.x, tg.towel1.y]; let n = 0; for (const q of p) { for (let k = 1; k <= 5; k++) { await T.move(pp[0] + ((q[0] - pp[0]) * k) / 5, pp[1] + ((q[1] - pp[1]) * k) / 5); await T.wait(60); } pp = q; if (++n === 5) await shot('s5_fuku'); }
  s = await T.st(); const ts = await T.ev(() => window.__duckbath.debug.towelStats()); const kw = s.ducks[1].wet; const near = sideSign > 0 ? 3 : 2, far = sideSign > 0 ? 2 : 3;
  ok('d7_wipe_one_side_dries_only_that_side', kw[near] < wetBefore[near] - 0.3 && kw[far] > kw[near] + 0.15 && ts.right > ts.left && ts.max > 0.02 && wetBefore[far] > 0.5, { wetBefore: wetBefore.map(f), wetAfter: kw.map(f), wipedPart: near, towel: { left: f(ts.left), right: f(ts.right), max: f(ts.max) } });
  await T.up(); await T.wait(700); await mark('wiped');

  // ---- 5 寝かせる ----
  const stain0 = (await T.st()).stain; await T.carry('kid', [0.66, -0.57]); s = await T.st(); ok('carry_kid_to_bed', s.ducks[1].mode === 'bed', { mode: s.ducks[1].mode, scene: s.scene });
  await T.wait(5000); s = await T.st(); const sc = await T.ev(() => window.__duckbath.debug.stainCentroid()); const k2 = s.ducks[1]; const lz = sc ? -(sc.x - k2.x) * Math.sin(k2.h) + (sc.z - k2.z) * Math.cos(k2.h) : 0;
  ok('d7_wet_side_leaves_stain_on_bed', !!sc && sc.sum > stain0 + 0.5 && (far === 2 ? lz < -0.004 : lz > 0.004), { stainSum: sc && f(sc.sum), stainLocalZ: f(lz), wetSide: far === 2 ? 'left(-z)' : 'right(+z)', kidWet: k2.wet.map(f) });
  await T.carry('parent', [0.53, -0.66]); s = await T.st(); ok('carry_parent_to_bed', s.ducks[0].mode === 'bed');
  s = await T.until((st) => st.card && st.ducks[0].asleep > 0.9, 40000, 400); ok('both_sleep_and_hanamaru', !!s && s.scene === 5, s && { asleep: s.ducks.map((d) => f(d.asleep)), card: s.card, cycles: s.cycles }); await T.wait(3600); await mark('asleep'); await shot('s5_neru');

  // ---- 再遊び・状態の引継ぎ ----
  s = await T.st(); const wetKeep = s.ducks[0].wet.slice(), towelKeep = s.towelWet, stainKeep = s.stain;
  await T.carry('parent', [0.1, 0.0]); await T.settle(); s = await T.st(); ok('replay_parent_back_to_tub', s.ducks[0].mode === 'tub' && !s.card && s.ducks[0].asleep < 0.2 && s.stage === 5, { mode: s.ducks[0].mode, card: s.card, scene: s.scene });
  ok('state_carries_across_scenes', Math.abs(s.towelWet - towelKeep) < 0.01 && Math.abs(s.stain - stainKeep) < stainKeep * 0.2 + 1 && s.ducks[0].wet.every((v, i) => Math.abs(v - wetKeep[i]) < 0.15), { towelWet: [f(towelKeep), f(s.towelWet)], stain: [f(stainKeep), f(s.stain)], parentWet: [wetKeep.map(f), s.ducks[0].wet.map(f)] });
  // 栓を戻して、もう一度ためられる
  tg = await T.tg(); a = await T.scr(0.552, 0.042 + s.ring, 0.1); b = await T.scr(0.552, 0.042 - 0.04, 0.1); await T.drag([[tg.ring.x, tg.ring.y], [tg.ring.x, tg.ring.y + (b.y - a.y)]], 400); await T.settle();
  tg = await T.tg(); const lvR = (await T.st()).level; await T.tap(tg.handle.x, tg.handle.y); await T.wait(5000); s = await T.st(); ok('replay_fill_again', s.level > lvR + 0.004 && s.flow > 0.2, { level: [f(lvR), f(s.level)], scene: s.scene });
  tg = await T.tg(); await T.tap(tg.handle.x, tg.handle.y); await T.wait(4500); await mark('replay');
  // 再読込でも同じ親子・寝床・濡れ跡が戻る
  const A = await T.st(); await T.ev(() => window.__duckbath.debug.save());
  await T.page.goto(T.page.url().replace('fresh=1&', ''), { timeout: 120000 }); await T.page.waitForFunction('window.__duckbath && window.__duckbath.ready', null, { timeout: 180000 }); await T.wait(800); const Bs = await T.st();
  ok('reload_restores_memory', Bs.stage === A.stage && Bs.ducks.every((d, i) => d.mode === A.ducks[i].mode && Math.abs(d.x - A.ducks[i].x) < 0.03 && Math.abs(d.z - A.ducks[i].z) < 0.03 && d.wet.every((v, j) => Math.abs(v - A.ducks[i].wet[j]) < 0.1)) && Math.abs(Bs.towelWet - A.towelWet) < 0.01 && Math.abs(Bs.stain - A.stain) < A.stain * 0.15 + 1 && Math.abs(Bs.level - A.level) < 0.02,
    { before: { stage: A.stage, level: f(A.level), ducks: A.ducks.map((d) => [d.mode, f(d.x), f(d.z)]), towel: f(A.towelWet), stain: f(A.stain) }, after: { stage: Bs.stage, level: f(Bs.level), ducks: Bs.ducks.map((d) => [d.mode, f(d.x), f(d.z)]), towel: f(Bs.towelWet), stain: f(Bs.stain) } });
  ok('no_console_errors', T.log.errors.length === 0, T.log.errors.slice(0, 5)); ok('no_external_requests', T.log.requests.length === 0, T.log.requests.slice(0, 5));
  R.seconds = +((Date.now() - t0) / 1000).toFixed(0); R.passed = Object.values(R.checks).filter((c) => c.pass).length; R.total = Object.keys(R.checks).length; R.mode = '操作検証は軽量描画(q=low, rs=0.3, lite=1)。撮影時のみ高品質へ切替';
  console.log(`== ${tag}: ${R.passed}/${R.total} pass, ${R.seconds}s`); rec('play_' + tag, R); await T.close();
})().catch((e) => { console.error('ERROR', e); process.exit(1); });
