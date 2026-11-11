const { open } = require('./lib.cjs');
const f = (v) => typeof v === 'number' ? +v.toFixed(3) : v;
const D = (s) => s.ducks.map(d => `${d.kind[0]}:${d.mode}${d.floating ? 'F' : ''}${d.walking ? 'W' : ''}(${f(d.x)},${f(d.z)}) wet[${d.wet.map(v => v.toFixed(2))}] foam[${d.foam.map(v => v.toFixed(2))}] sl${f(d.asleep)}`).join(' | ');
(async () => {
  const T = await open(); const t0 = Date.now(); const el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
  await T.preset({ stage: 4, scene: 4, level: -0.03 }); let s = await T.st(); console.log(el(), 'preset', f(s.level), D(s), 'scene', s.scene);
  let tg = await T.tg(); console.log('ring', JSON.stringify(tg.ring));
  // 水面を回してから栓を抜く
  for (let i = 0; i < 2; i++) await T.stroke([[0.45, 0.1], [0.33, 0.24], [0.2, 0.1], [0.33, -0.04], [0.45, 0.1], [0.33, 0.24], [0.2, 0.1]], 1200);
  s = await T.st(); console.log(el(), 'swirl gamma', f(s.gamma), 'scene', s.scene);
  await T.settle(); tg = await T.tg(); await T.drag([[tg.ring.x, tg.ring.y], [tg.ring.x, tg.ring.y - 80]], 600); await T.settle();
  s = await T.st(); console.log(el(), 'ring', f(s.ring), 'drainQ', f(s.drainQ * 1000), 'scene', s.scene, 'foam', s.foam);
  for (let i = 0; i < 14; i++) { await T.wait(3000); s = await T.st(); console.log(el(), 'lv', f(s.level), 'foam', s.foam, 'sucked', s.sucked, 'gamma', f(s.gamma), D(s)); if (s.level < -0.325) break; if (i === 2) await T.shot('shots/tmp/x6a.png'); }
  await T.wait(4000); s = await T.st(); console.log(el(), 'after walk', D(s)); await T.shot('shots/tmp/x6b.png');
  await T.carry('kid', [0.2, -0.6]); await T.settle(); s = await T.st(); console.log(el(), 'kid on towel', D(s), 'stage', s.stage, 'scene', s.scene);
  await T.carry('parent', [0.12, -0.62]); await T.settle(); s = await T.st(); console.log(el(), 'parent on towel', D(s), 'scene', s.scene);
  await T.shot('shots/tmp/x6c.png');
  // 拭く: 右の端をつかんで子の上を往復
  tg = await T.tg(); console.log('towel tg', JSON.stringify(tg.towel0), JSON.stringify(tg.towel1));
  const K = s.ducks[1]; await T.down(tg.towel1.x, tg.towel1.y); await T.wait(500); await T.settle();
  const path = await T.w2s([[K.x + 0.12, 0.12, K.z + 0.1], [K.x - 0.02, 0.12, K.z - 0.02], [K.x - 0.12, 0.12, K.z - 0.08], [K.x + 0.02, 0.12, K.z], [K.x + 0.12, 0.12, K.z + 0.08], [K.x - 0.1, 0.12, K.z - 0.06], [K.x + 0.1, 0.12, K.z + 0.08]]);
  for (let r = 0; r < 2; r++) for (const p of path) { await T.move(p[0], p[1]); await T.wait(260); }
  s = await T.st(); console.log(el(), 'wiped', D(s), 'towel', JSON.stringify(await T.ev(() => window.__duckbath.debug.towelStats())));
  await T.shot('shots/tmp/x6d.png'); await T.up(); await T.wait(800);
  await T.carry('kid', [0.66, -0.6]); s = await T.st(); console.log(el(), 'kid bed', D(s), 'scene', s.scene);
  await T.carry('parent', [0.6, -0.66]); s = await T.st(); console.log(el(), 'parent bed', D(s), 'scene', s.scene);
  s = await T.until(st => st.card, 30000, 500); console.log(el(), 'card', s && s.card, s && D(s), 'stain', s && f(s.stain));
  await T.wait(3500); await T.shot('shots/tmp/x6e.png'); s = await T.st(); console.log(el(), 'end', D(s), 'stain', f(s.stain), JSON.stringify(await T.ev(() => window.__duckbath.debug.stainCentroid())));
  console.log('errors', T.log.errors); await T.close();
})();
