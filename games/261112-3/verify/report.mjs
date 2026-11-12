// verify/results/*.json から verify/RESULTS.md を作る (node verify/report.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';
const dir = path.join(ROOT, 'verify/results'), rd = (f) => (fs.existsSync(path.join(dir, f)) ? JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) : null);
const short = (d) => { if (d === undefined) return ''; let s = JSON.stringify(d); if (s.length > 230) s = s.slice(0, 227) + '…'; return ' `' + s.replace(/`/g, "'").replace(/\|/g, '/') + '`'; };
let md = '# 検証結果 (自動生成)\n\n';
md += '`node verify/report.mjs` が `verify/results/*.json` から生成。すべて **ヘッドレス Chromium (Playwright) + SwiftShader(CPU 描画)** での結果で、**実機 iPad での検証ではない**。\n';
md += '操作は CDP の `Input.dispatchTouchEvent` → ブラウザの Pointer Events 経路。ゲーム内部の状態は読み取りのみ (`window.__gf` の読み取り専用関数)。\n\n';
let tp = 0, tf = 0;
const sec = (title, r, extra = '') => {
  if (!r) { md += `## ${title}\n\n未実行\n\n`; return; }
  tp += r.pass; tf += r.fail;
  md += `## ${title}\n\n合格 ${r.pass} / 不合格 ${r.fail}${extra}\n\n`;
  for (const c of r.checks) md += `- ${c.pass ? '✔' : '✘ **不合格**'} ${c.name}${short(c.detail)}\n`;
  md += '\n';
};
for (const sz of ['820x1180', '375x667', '390x844', '1180x820']) { const r = rd(`play-${sz}.json`); sec(`通し遊び ${sz} (${r ? r.mode : '-'})`, r, r ? ` ／ 実時間 ${r.wallSec} 秒・ゲーム内 ${Math.round(r.gameSec)} 秒・鳴らした音 ${r.sounds} 回` : ''); }
sec('一品での完了・逆戻り・放置・連打・回転・非表示復帰・マルチタッチ (390x844)', rd('variants.json'));
sec('見えている棚・レジ・袋台に触れて行き来 (1180x820)', rd('nav.json'));
sec('保存拒否・保存破損・復元・WebGL 失敗・音拒否', rd('robust.json'));
sec('両起動方式 (file:// / http サブフォルダ)・外部リクエスト・容量', rd('net.json'));
const full = rd('play-820x1180.json');
if (full && full.notes) {
  const n = full.notes;
  md += '## 実測値 (820x1180 の通し遊びから)\n\n';
  const row = (k, v) => { md += `- ${k}: \`${JSON.stringify(v)}\`\n`; };
  row('入力→牛乳が動くまでの描画フレーム数 / このヘッドレス環境での ms', n.milkResponse);
  row('牛乳を棚へ収めるまでのゲーム内秒数 (ドラッグ開始〜「ことん」)', n.milkToShelfGameSec);
  row('当たり判定の直径 (CSS px)', n.hitDiameterPx);
  row('空の袋: 底の高さ[cm]・持ち手のひずみ', n.bagEmpty);
  row('牛乳を左へ', n.milkLeft); row('りんごを左へ', n.appleLeft); row('牛乳を中央へ', n.milkCenter); row('牛乳を右へ', n.milkRight);
  row('発見3 (支えの牛乳を抜く前後のりんご)', n.d3);
  row('発見4 (口の開きと届く範囲)', n.d4);
  row('発見5 (パン)', { onRim: n.d5a, hangingThenIn: n.d5b });
  row('発見6 (運搬後の重心の横ずれ[m] 時系列 0.12 秒間隔)', n.d6);
  row('手渡し直前の客の手', n.handover); row('受け取り後', n.holding);
  md += '\n';
}
const pf = rd('perf.json');
if (pf) {
  md += '## 実測 fps\n\n';
  md += `- 計測環境: ${pf.env.note}\n- レンダラ: \`${pf.env.renderer}\`\n- CPU: ${pf.env.cpu} × ${pf.env.cpuCount} 論理コア / メモリ ${pf.env.memGB}GB / devicePixelRatio ${pf.env.dpr}\n- 計測対象: ${pf.scene}、各 ${pf.seconds} 秒\n\n`;
  md += '| サイズ | 条件 | fps | 遊びの速さ(実時間比) | 描画解像度 | pixelRatio | 動的解像度の倍率 | 低負荷モード | draw calls | 三角形 |\n|---|---|---|---|---|---|---|---|---|---|\n';
  for (const r of pf.rows) md += `| ${r.size} | ${r.mode} \`${r.query}\` | ${r.fps} | ${r.gameSpeed} | ${r.renderPx} | ${r.pixelRatio} | ${r.scale} | ${r.lowMode ? 'ON' : 'OFF'} | ${r.drawCalls} | ${r.triangles} |\n`;
  md += '\n※ ソフトウェア描画 (GPU なし) の値。iPad の GPU での fps は未計測。\n\n';
}
md += `## 合計\n\n合格 ${tp} / 不合格 ${tf}\n`;
fs.writeFileSync(path.join(ROOT, 'verify/RESULTS.md'), md);
console.log('RESULTS.md', 'pass', tp, 'fail', tf);
