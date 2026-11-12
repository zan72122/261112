// Dev-time bundler: src/*.js + three.js -> one self-contained index.html (no runtime build, no network).
// usage: node tools/build.mjs   (needs `npm i three@0.160.0 esbuild` somewhere on NODE_PATH or in ./node_modules)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..');
const nodePaths = [path.join(root, 'node_modules'), ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean)];
const require = createRequire(nodePaths.map((p) => path.join(p, 'x.js')).find((p) => fs.existsSync(path.join(path.dirname(p), 'esbuild'))) || import.meta.url);
const esbuild = require('esbuild');
const out = await esbuild.build({ entryPoints: [path.join(root, 'src/main.js')], bundle: true, format: 'iife', minify: !process.env.NOMIN, write: false, target: ['es2020'], nodePaths, legalComments: 'none' });
let js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const fb = path.join(here, 'fallback.jpg');
const fbUri = fs.existsSync(fb) ? 'data:image/jpeg;base64,' + fs.readFileSync(fb).toString('base64') : 'data:image/gif;base64,R0lGODlhAQABAIAAAOnk2gAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
const html = fs.readFileSync(path.join(root, 'src/index.template.html'), 'utf8').replace('/*__SOFTWARE__*/', () => fs.readFileSync(path.join(root, 'src/software-renderer.js'), 'utf8')).replace('__FALLBACK__', () => fbUri).replace('/*__JS__*/', () => js);
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('index.html', (html.length / 1024 | 0) + ' KB');
