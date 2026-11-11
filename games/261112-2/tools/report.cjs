// results/*.json から検証記録 VERIFY.md を組み立てる
const fs = require('fs'); const path = require('path');
const dir = path.resolve(__dirname, 'results'); const rd = (n) => { try { return JSON.parse(fs.readFileSync(path.join(dir, n), 'utf8')); } catch (e) { return null; } };
const L = []; const p = (s = '') => L.push(s);
const sizes = ['375x667', '390x844', '820x1180', '1180x820'];
p('# 検証記録 — ぷかぷか！あひるちゃんのおふろ (gf-261112-nx2)');
p();
p('この記録は `tools/report.cjs` が `tools/results/*.json` から生成したものです。数値はすべて下記の環境での実測で、**iPad 実機の結果ではありません**。');
p();
p('## 測定環境');
p('- ヘッドレス Chromium (Playwright 同梱版) / ANGLE + SwiftShader (ソフトウェア描画、GPU なし) / 4 vCPU の Linux コンテナ');
p('- 操作はすべて CDP `Input.dispatchTouchEvent` による実際のタッチ → ブラウザが生成する Pointer Events (pointerdown / pointermove / pointerup) で行った。内部状態は `window.__duckbath.debug` から**読むだけ**');
p('- 操作検証は描画を軽くした設定 (`q=low&rs=0.3&lite=1`: 低負荷モード・解像度 0.3 倍・産毛の層を省略) で実行。ゲームの状態更新と入力経路は通常と同じ。スクリーンショットの瞬間だけ高品質設定へ切り替えて撮影');
p('- 実施日: ' + new Date().toISOString().slice(0, 10));
p();
p('## 1. 通し遊び (最初の浴室 → はなまる → 再遊び → 再読込)');
p('`tools/play.cjs`。保存データの書き込みによる近道は使わず、最初の画面から最後まで指の操作だけで進めた。');
p();
p('| 画面 | 合格 / 全項目 | 所要(実時間) |'); p('|---|---|---|');
const plays = {}; for (const s of sizes) { const r = rd(`play_${s}.json`); plays[s] = r; p(`| ${s} | ${r ? `${r.passed} / ${r.total}` : '未実施'} | ${r ? r.seconds + ' 秒' : '-'} |`); }
p();
const names = new Set(); for (const s of sizes) if (plays[s]) Object.keys(plays[s].checks).forEach((k) => names.add(k));
p('| 確認項目 | ' + sizes.join(' | ') + ' |'); p('|---|' + sizes.map(() => '---').join('|') + '|');
for (const n of names) p(`| ${n} | ` + sizes.map((s) => (plays[s] && plays[s].checks[n] ? (plays[s].checks[n].pass ? '○' : '×') : '-')).join(' | ') + ' |');
p();
const ref = plays['820x1180'] || plays[sizes.find((s) => plays[s])];
if (ref) { p('### 820×1180 での実測値(抜粋)'); p('```'); for (const [k, v] of Object.entries(ref.checks)) p(`${v.pass ? 'PASS' : 'FAIL'} ${k} ${v.info === undefined ? '' : JSON.stringify(v.info)}`); p('```'); p(); p('進行の記録 (wall=実時間秒, simT=ゲーム内秒):'); p('```'); for (const t of ref.timeline) p(JSON.stringify(t)); p('```'); }
p();
p('## 2. 発見の比較実験 (条件をそろえた A/B)');
p('`tools/disc.cjs`。あひると泡の初期配置だけは保存データの読込経路でそろえ(=再現性のため)、そこからの操作は実際のタッチ。発見 1・4・6・7 は上の通し遊びの中でも確認している。');
p();
const d2 = rd('explore_d2.json'), d3 = rd('explore_d3.json'), d4 = rd('explore_d4.json'), d5 = rd('explore_d5.json'), d7 = rd('explore_d7.json');
if (d2) { p('**発見2 壁へのひとなでで泡の帯が折り返す**: 泡の重心の移動 (dx, dz) [m]、なでた 0.7 秒後から 0.7 秒おき'); p('```'); p('泡の右脇をなでる: ' + JSON.stringify(d2.d2_right && d2.d2_right.trace)); p('泡の左脇をなでる: ' + JSON.stringify(d2.d2_left && d2.d2_left.trace)); p('```'); p('→ なでる位置で x 方向の戻り方が逆になり、どちらも壁(z=-0.3)から手前(+z)へ折り返す。'); p(); }
if (d3) { p('**発見3 親が流れを分け、後ろの子の揺れが小さい**'); p('```'); p('親が間にいる  : ' + JSON.stringify(d3.d3_true)); p('親をどけた    : ' + JSON.stringify(d3.d3_false)); p('```'); p(); }
if (d4) { p('**発見4 満水近くで親を下ろすと縁へ水が乗る / 少ない水では乗らない**'); p('```'); for (const [k, v] of Object.entries(d4)) p(k + ': ' + JSON.stringify(v)); p('```'); p(); }
if (d5) { p('**発見5 泡帽子へ横からシャワー → 隣の子の背へ / 離れていれば水面へ**'); p('```'); p('子が隣    : ' + JSON.stringify(d5.d5_true)); p('子が離れる: ' + JSON.stringify(d5.d5_false)); p('```'); p(); }
if (d7) { p('**発見7 片側だけ拭いて寝床へ → 濡れた側の下にだけ水跡 / 置く向きで跡の位置が変わる**'); p('```'); for (const [k, v] of Object.entries(d7)) p(k + ': ' + JSON.stringify({ wetAfterWipe: v.wetAfterWipe, heading: v.heading, stain: v.stain, stainLocalZ: v.stainLocalZ, kid: v.kid })); p('```'); p(); }
p('## 3. 壊れにくさ');
const rb = rd('robust.json'); if (rb) { p(`\`tools/robust.cjs\`: ${rb.passed} / ${rb.total} 合格`); p('```'); for (const [k, v] of Object.entries(rb.checks)) p(`${v.pass ? 'PASS' : 'FAIL'} ${k} ${v.info === undefined ? '' : JSON.stringify(v.info)}`); p('```'); } else p('未実施');
p();
p('## 4. 描画速度 (ヘッドレス・ソフトウェア描画での実測)');
p('`tools/perf.cjs`。各場面を 7 秒暖機したあと 10 秒間のフレーム数を数えた。「high」= 通常品質(屈折つきの水・産毛の層 11 枚・影 2048)、「low」= 低負荷モード(水は半透明反射・産毛 6 枚・影 1024 を隔フレーム更新・泡の上限 230)。');
p();
const pf = fs.readdirSync(dir).filter((f) => f.startsWith('perf_')).map((f) => rd(f)).filter(Boolean);
if (pf.length) { p('| 画面 | 品質 | 場面 | fps | 描画命令数 | 三角形数 | JS 物理 ms/フレーム |'); p('|---|---|---|---|---|---|---|'); for (const f of pf) for (const r of f.rows) p(`| ${r.size} | ${r.quality} | ${r.scene} | ${r.fps} | ${r.drawCalls} | ${r.triangles} | ${r.jsSimMsPerFrame} |`); p(); p('ソフトウェア描画のため fps は GPU 搭載機より桁違いに低い。iPad での 30fps は**未検証**。JS 側の物理(水・泡・布)は 1 ステップ 1ms 未満で、負荷の大半は描画。'); } else p('未実施');
p();
p('## 5. スクリーンショット');
const shots = fs.readdirSync(path.resolve(__dirname, 'shots')).filter((f) => f.endsWith('.png')); p(`\`tools/shots/\` に ${shots.length} 枚。通し遊びの各場面を 4 サイズで撮影:`); p(); for (const s of shots) p('- ' + s);
p();
p('## 6. 確認していないこと');
p('- iPad / iPhone 実機での表示・タッチ・音・fps (Safari の WebGL、Safe Area の実寸、音の解禁挙動を含む)');
p('- 実際の 5 歳児による初見プレイ(説明なしで成立するかは、当たり判定の大きさ・お手本の指・解放順の確認にとどまる)');
p('- 音の聞こえ方(合成音の生成と開始状態は確認、音質は未聴取)');
p('- 高品質設定のままの通し操作(操作検証は軽量描画で実施。高品質は撮影と fps 測定のみ)');
fs.writeFileSync(path.resolve(__dirname, '../VERIFY.md'), L.join('\n') + '\n'); console.log('VERIFY.md', L.length, 'lines');
