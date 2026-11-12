// 開発用ビルド: src/*.js と three.js を1つの index.html に埋め込む
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const res = await build({
  entryPoints: [path.join(root, 'src/main.js')],
  bundle: true, format: 'iife', minify: !process.argv.includes('--dev'), write: false,
  target: ['es2019'], legalComments: 'none',
  nodePaths: [path.join(here, 'node_modules')],
  loader: { '.glsl': 'text' },
});
let js = res.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
let html = fs.readFileSync(path.join(root, 'src/template.html'), 'utf8');
let fb = '';
const fbPath = path.join(here, 'fallback.jpg');
if (fs.existsSync(fbPath)) fb = 'data:image/jpeg;base64,' + fs.readFileSync(fbPath).toString('base64');
html = html.replace('/*__FALLBACK__*/', () => JSON.stringify(fb));
html = html.replace('/*__GAME_JS__*/', () => js);
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('index.html', (html.length / 1024).toFixed(0) + 'KB');
