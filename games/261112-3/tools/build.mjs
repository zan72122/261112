// 開発時ビルド: src/*.js と three.js を 1 本にまとめ、index.html へ埋め込む。
// 使い方: GF_MODULES=/path/to/node_modules node tools/build.mjs
// (three と esbuild を入れた node_modules を GF_MODULES で指す。完成品 index.html はビルド不要で動く)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mods = process.env.GF_MODULES || path.join(root, 'node_modules');
const require = createRequire(path.join(mods, 'x.js'));
const esbuild = require('esbuild');

const res = await esbuild.build({
  entryPoints: [path.join(root, 'src/main.js')], bundle: true, format: 'iife', minify: true, write: false,
  nodePaths: [mods], target: ['es2020', 'safari15'], legalComments: 'none', logLevel: 'warning',
});
let js = res.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const fbPath = path.join(root, 'tools/fallback.jpg');
const fb = existsSync(fbPath) ? 'data:image/jpeg;base64,' + readFileSync(fbPath).toString('base64') : 'data:image/gif;base64,R0lGODlhAQABAIAAANjSxgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
const html = readFileSync(path.join(root, 'tools/template.html'), 'utf8').replace('__FALLBACK__', () => fb).replace('__BUNDLE__', () => js);
const out = process.env.GF_OUT || 'index.html';
writeFileSync(path.join(root, out), html);
console.log(out, (html.length / 1024).toFixed(0) + ' KB (js ' + (js.length / 1024).toFixed(0) + ' KB)');
