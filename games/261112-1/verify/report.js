// Builds the tables of VERIFY.md from the result JSON files (the prose around them lives in VERIFY.head.md / VERIFY.tail.md).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const rd = (f) => { const p = path.join(__dirname, f); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const short = (d) => { if (d === undefined || d === null) return ''; let s = typeof d === 'string' ? d : JSON.stringify(d); if (s.length > 230) s = s.slice(0, 227) + '…'; return '`' + esc(s) + '`'; };
const play = fs.readdirSync(__dirname).filter((f) => /^results-play-.*\.json$/.test(f)).map(rd), robust = rd('results-robust.json'), shots = rd('results-shots.json');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'));
let out = fs.readFileSync(path.join(__dirname, 'VERIFY.head.md'), 'utf8');
out += `\n- 検証対象: \`index.html\` ${html.length} bytes（${(html.length / 1024 / 1024).toFixed(2)} MB）, sha256 \`${crypto.createHash('sha256').update(html).digest('hex').slice(0, 16)}…\`\n`;
for (const p of play) {
  if (!p) continue;
  out += `\n## 通しプレイ（実タッチ入力）: ${p.size[0]}×${p.size[1]}\n\n`;
  out += `- 実行: ${p.started} 〜 ${p.finished}／結果: **${p.pass} 合格, ${p.fail} 不合格**\n`;
  if (p.final) out += `- 終了時: ゲーム内時間 ${p.final.gameSeconds} 秒, fps(移動平均) ${p.final.fps}, 低負荷モード ${p.final.low}, 解像度倍率 ${p.final.res}, 音 ${p.final.audio}\n`;
  out += `- コンソールエラー ${p.consoleErrors.length} 件／外部リクエスト ${p.externalRequests.length} 件／出た指のお手本: ${(p.hints || []).join(', ')}\n`;
  if (p.notes && p.notes.sleeveLift) out += `- 袖に触れてから持ち上がりが見えるまで: ${p.notes.sleeveLift.frames} フレーム（このヘッドレス環境で ${p.notes.sleeveLift.ms} ms、${p.notes.sleeveLift.liftedBy} m 上昇）\n`;
  if (p.notes && p.notes.devJump) out += `- **注意: 途中開始のデバッグ実行（${p.notes.devJump}）**\n`;
  out += `\n| # | 確認内容 | 結果 | 実測 |\n|---|---|---|---|\n`;
  p.checks.forEach((c, i) => { out += `| ${i + 1} | ${esc(c.name)} | ${c.ok ? '✅' : '❌'} | ${short(c.detail)} |\n`; });
}
if (robust) {
  out += `\n## 堅牢性\n\n- 実行: ${robust.started} 〜 ${robust.finished}／結果: **${robust.pass} 合格, ${robust.fail} 不合格**\n`;
  if (robust.notes.hiddenMethod) out += `- 非表示の作り方: ${robust.notes.hiddenMethod}\n`;
  out += `\n| # | 確認内容 | 結果 | 実測 |\n|---|---|---|---|\n`;
  robust.checks.forEach((c, i) => { out += `| ${i + 1} | ${esc(c.name)} | ${c.ok ? '✅' : '❌'} | ${short(c.detail)} |\n`; });
}
if (shots) {
  out += `\n## 4サイズ×5場面のスクリーンショットと fps\n\n画像は \`verify/shots/<場面>_<幅>x<高さ>.png\`。fps はその場面を表示して約3.5秒後の移動平均（下記の実行環境での値で、iPad 実機の値ではありません）。\n\n`;
  out += `| サイズ | 場面 | 構図 | fps | 解像度倍率 | 低負荷 | エラー | 外部通信 |\n|---|---|---|---|---|---|---|---|\n`;
  for (const r of shots.rows) out += `| ${r.size} | ${r.scene} | ${r.view} | ${r.fps} | ${r.resScale} | ${r.low} | ${r.errors} | ${r.external} |\n`;
  out += `\n- WebGL レンダラ: \`${esc(shots.rows[0] ? shots.rows[0].renderer : '')}\`\n`;
}
out += '\n' + fs.readFileSync(path.join(__dirname, 'VERIFY.tail.md'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'VERIFY.md'), out);
console.log('VERIFY.md written', out.length);
