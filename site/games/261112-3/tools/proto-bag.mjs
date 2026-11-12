// 袋物理の試作確認 (node tools/proto-bag.mjs)
// 1) 牛乳の左右移動で底のたわむ場所が移る / りんごより持ち手が張る
// 2) 支えの牛乳を抜くとりんごが転がる
// 3) 持ち上げて横へ運んで止めると底が遅れて揺れる
import { BagSim, makeShape, NC, NR, PEG_X, PEG_Y } from '../src/bagsim.js';

const milk = makeShape('box', { hx: 0.035, hy: 0.108, r: 0.005 });
const apple = makeShape('circle', { r: 0.04 });
const run = (sim, t) => { for (let i = 0; i < t * 60; i++) sim.step(1 / 60); };
const bottoms = (sim) => Array.from({ length: NC }, (_, c) => +(sim.py[sim.idx(c, NR - 1)] * 100).toFixed(1));
const f = (v) => +v.toFixed(4);

{
  const sim = new BagSim(); run(sim, 2);
  console.log('empty bottoms(cm):', bottoms(sim), 'strain', f(sim.strainL), f(sim.strainR));
  for (const [name, sh, m] of [['milk', milk, 1.03], ['apple', apple, 0.3]]) {
    for (const x of [-0.1, 0, 0.1]) {
      const s = new BagSim(); run(s, 1);
      const b = s.addBody(name, sh, m, x, 0.5, 0); run(s, 3);
      console.log(name, 'drop x=', x, 'bottoms', bottoms(s), 'strainL/R', f(s.strainL), f(s.strainR), 'pos', f(b.x), f(b.y), 'ang', f(b.a), 'inside', s.allInside(b));
    }
  }
}
{
  const s = new BagSim(); run(s, 1);
  const m = s.addBody('milk', milk, 1.03, -0.05, 0.45, 0); run(s, 2);
  const a = s.addBody('apple', apple, 0.3, 0.05, 0.5, 0); run(s, 2);
  console.log('before pull: milk', f(m.x), f(m.y), f(m.a), 'apple', f(a.x), f(a.y));
  // 牛乳を上へ引き抜く
  s.grab(m, m.x, m.y + 0.08);
  for (let i = 0; i < 90; i++) { m.ty = Math.min(0.85, m.ty + 0.008); s.step(1 / 60); }
  console.log('milk pulled to', f(m.x), f(m.y), 'inside', s.anyInside(m));
  run(s, 2);
  console.log('after pull: apple', f(a.x), f(a.y), 'rolled angle', f(a.a));
}
{
  const s = new BagSim(); run(s, 1);
  s.addBody('milk', milk, 1.03, -0.05, 0.45, 0); s.addBody('apple', apple, 0.3, 0.06, 0.5, 0); run(s, 2);
  // 持ち上げて右へ運ぶ
  const lift = (x, y) => { s.pinL.tx = x - 0.012; s.pinL.ty = y; s.pinR.tx = x + 0.012; s.pinR.ty = y; };
  for (let i = 0; i < 40; i++) { lift(0, PEG_Y + i * 0.004); s.step(1 / 60); }
  const log = [];
  for (let i = 0; i < 30; i++) { lift(i * 0.014, PEG_Y + 0.16); s.step(1 / 60); }
  for (let i = 0; i < 120; i++) {
    lift(0.42, PEG_Y + 0.16); s.step(1 / 60);
    if (i % 10 === 0) { const c = s.contents(); log.push(f(c.x - 0.42)); }
  }
  console.log('swing (content COM x - hand x) every 1/6s:', log.join(' '));
  let ok = true; for (const b of s.bodies) if (!s.anyInside(b)) ok = false;
  console.log('all still in bag after carry:', ok);
}
{
  console.log('--- gentle placement (lowered by hand, then released)');
  for (const [name, sh, m, hy] of [['milk', milk, 1.03, 0.108], ['apple', apple, 0.3, 0.04]]) {
    for (const x of [-0.115, 0, 0.115]) {
      const s = new BagSim(); run(s, 1);
      const b = s.addBody(name, sh, m, x, 0.62, 0);
      s.grab(b, x, 0.62 + hy * 0.6);
      for (let i = 0; i < 80; i++) { b.ty = Math.max(0.09 + hy * 1.6, b.ty - 0.006); s.step(1 / 60); }
      s.release(b); run(s, 3);
      console.log(name, 'place x=', x, 'bottoms', bottoms(s), 'strainL/R', f(s.strainL), f(s.strainR), 'pos', f(b.x), f(b.y), 'ang', f(b.a));
    }
  }
}
