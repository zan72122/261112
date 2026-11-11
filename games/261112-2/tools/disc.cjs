// 発見ごとの探索・検証。node disc.cjs d4 のように実行
const { open, rec } = require('./lib.cjs');
const f = (v) => typeof v === 'number' ? +v.toFixed(3) : v;
const D = (s) => s.ducks.map(d => `${d.kind[0]}:${d.mode}${d.floating ? 'F' : ''}${d.walking ? 'W' : ''}(${f(d.x)},${f(d.z)}) wet[${d.wet.map(v => v.toFixed(2))}] foam[${d.foam.map(v => v.toFixed(2))}]`).join(' | ');
const which = process.argv[2]; const out = {};
const cen = async (T) => { const l = await T.ev(() => window.__duckbath.debug.foamList()); let x = 0, z = 0; for (const p of l) { x += p[0]; z += p[1]; } return l.length ? { x: x / l.length, z: z / l.length, n: l.length } : { x: 0, z: 0, n: 0 }; };
const band = (n, x0, x1, z0, z1) => { const a = []; for (let i = 0; i < n; i++) a.push(Math.round((x0 + Math.random() * (x1 - x0)) * 1000), Math.round((z0 + Math.random() * (z1 - z0)) * 1000), 170); return a; };
const tests = {
  async d2(T) { // 壁への一なでで泡の帯が折り返す。なぞる位置で戻る向きが変わる
    for (const side of ['right', 'left']) {
      await T.preset({ stage: 3, scene: 2, level: -0.04, foam: band(60, 0.02, 0.3, -0.26, -0.17), ducks: [{ k: 'parent', m: 'tub', x: -0.36, z: 0.1, h: 0.4, wet: [0, 0, 0, 0], foam: [0, 0, 0, 0] }, { k: 'kid', m: 'tub', x: 0.16, z: 0.12, h: 3.0, wet: [0, 0, 1, 1], foam: [0, 0, 0, 0] }] });
      await T.wait(1500); const c0 = await cen(T); const x = side === 'right' ? 0.37 : -0.05;
      await T.stroke([[x, 0.12], [x, -0.05], [x, -0.27]], 500); const tr = [];
      for (let i = 0; i < 8; i++) { await T.wait(700); const c = await cen(T); tr.push([f(c.x - c0.x), f(c.z - c0.z)]); }
      const s = await T.st(); console.log('d2', side, 'c0', f(c0.x), f(c0.z), 'trace dx,dz', JSON.stringify(tr), 'kid', f(s.ducks[1].x), f(s.ducks[1].z)); out['d2_' + side] = { c0, trace: tr };
      if (side === 'right') await T.shot('shots/tmp/d2.png');
    }
  },
  async d3(T) { // 親が流れを分け、後ろの子の揺れが小さい
    for (const withParent of [true, false]) {
      await T.preset({ stage: 3, scene: 3, level: -0.04, foam: band(50, 0.3, 0.42, -0.12, 0.12), ducks: [{ k: 'parent', m: 'tub', x: withParent ? 0.12 : -0.36, z: withParent ? 0.0 : 0.1, h: withParent ? 1.57 : 0.4, wet: [0, 0, 1, 1], foam: [0, 0, 0, 0] }, { k: 'kid', m: 'tub', x: -0.07, z: 0.0, h: 3.14, wet: [0, 0, 1, 1], foam: [0, 0, 0, 0] }] });
      await T.wait(2500); let s0 = await T.st(); const k0 = s0.ducks[1]; let maxH = 0, maxF = 0;
      for (let r = 0; r < 2; r++) { await T.stroke([[0.45, 0.0], [0.36, 0.0], [0.26, 0.0]], 450); for (let i = 0; i < 5; i++) { await T.wait(300); const v = await T.ev(([x, z]) => { const d = window.__duckbath.debug; const fl = d.flowAt(x, z); return [Math.abs(d.waveAt(x, z)), Math.hypot(fl[0], fl[1])]; }, [k0.x, k0.z]); maxH = Math.max(maxH, v[0]); maxF = Math.max(maxF, v[1]); } }
      await T.wait(1500); const s = await T.st(); const l = await T.ev(() => window.__duckbath.debug.foamList()); const P = s.ducks[0]; const up = l.filter(p => p[1] < -0.08 && p[0] < 0.3).length, dn = l.filter(p => p[1] > 0.08 && p[0] < 0.3).length, mid = l.filter(p => Math.abs(p[1]) <= 0.08 && p[0] < 0.0).length;
      console.log('d3 parent between:', withParent, 'kid moved', f(Math.hypot(s.ducks[1].x - k0.x, s.ducks[1].z - k0.z)), 'max wave at kid', f(maxH * 1000) + 'mm', 'max flow at kid', f(maxF), 'foam split up/down/behind', up, dn, mid); out['d3_' + withParent] = { kidMoved: Math.hypot(s.ducks[1].x - k0.x, s.ducks[1].z - k0.z), maxWaveMm: maxH * 1000, maxFlow: maxF, up, dn, mid };
      if (withParent) await T.shot('shots/tmp/d3.png');
    }
  },
  async d4(T) { // 満水近くで親を下ろすと縁へ水が乗る。少ない水では乗らない
    for (const lv of [-0.024, -0.075]) {
      await T.preset({ stage: 3, scene: 3, level: lv, foam: band(20, 0.0, 0.3, -0.25, -0.18), ducks: [{ k: 'parent', m: 'tub', x: -0.37, z: -0.08, h: 0.6, wet: [0, 0, 0, 0], foam: [0, 0, 0, 0] }, { k: 'kid', m: 'tub', x: -0.3, z: 0.14, h: 0, wet: [0, 0, 0, 0], foam: [0, 0, 0, 0] }] });
      await T.wait(2500); const s0 = await T.st(); let peak = 0, lvMax = -1; const p = T.carry('parent', [0.12, 0.0], { after: 0 }); let done = false; p.then(() => { done = true; });
      while (!done) { const s = await T.st(); peak = Math.max(peak, s.spillPeak); await T.wait(120); }
      for (let i = 0; i < 16; i++) { const s = await T.st(); peak = Math.max(peak, s.spillPeak, s.spill); lvMax = Math.max(lvMax, s.level); await T.wait(150); if (i === 3 && lv > -0.03) await T.shot('shots/tmp/d4.png'); }
      const s1 = await T.st(); // 持ち上げると水位が下がる
      const tg = await T.tg(); await T.down(tg.parent.x, tg.parent.y); await T.wait(1500); const s2 = await T.st(); await T.up(); await T.wait(600);
      console.log('d4 start level', f(s0.level), 'after drop level', f(s1.level), 'max', f(lvMax), 'spill peak', f(peak), 'lifted level', f(s2.level), 'overQ', f(s1.overQ * 1000)); out['d4_' + lv] = { start: s0.level, after: s1.level, max: lvMax, spillPeak: peak, lifted: s2.level };
    }
  },
  async d5(T) { // 泡帽子へ横からシャワー→隣の子の背へ。子が離れていれば水面へ
    for (const near of [true, false]) {
      await T.preset({ stage: 3, scene: 3, level: -0.04, foam: [], ducks: [{ k: 'parent', m: 'tub', x: 0.16, z: -0.03, h: 3.14, wet: [0, 0, 1, 1], foam: [0.85, 0, 0, 0] }, { k: 'kid', m: 'tub', x: near ? -0.03 : 0.38, z: near ? 0.13 : 0.2, h: 3.14, wet: [0, 0, 1, 1], foam: [0, 0, 0, 0] }] });
      await T.wait(2000); let tg = await T.tg(); await T.down(tg.shower.x, tg.shower.y); await T.wait(500); await T.settle(); let s = await T.st(); const P = s.ducks[0];
      // まず近くへ寄せて頭を下げさせ、下がった頭の横(奥側)から手前へ向けて流す
      let path = await T.w2s([[-0.2, 0.3, -0.46], [-0.1, 0.3, -0.44]]); for (const q of path) { await T.move(q[0], q[1]); await T.wait(500); } await T.wait(1500); s = await T.st(); const hx = s.ducks[0].head[0], hz = s.ducks[0].head[2];
      path = await T.w2s([[hx, 0.3, -0.46], [hx, 0.3, hz - 0.36], [hx, 0.3, hz - 0.3]]);
      for (const q of path) { await T.move(q[0], q[1]); await T.wait(500); } const f0 = s.foam; let neck = 0; const hits = [];
      for (let i = 0; i < 14; i++) { await T.wait(400); s = await T.st(); neck = Math.max(neck, s.ducks[0].neck); hits.push(s.shower.kind + '' + (s.shower.kind === 2 ? 'p' + s.shower.part : '')); if (i === 5 && near) await T.shot('shots/tmp/d5.png'); }
      await T.up(); await T.wait(1500); s = await T.st();
      console.log('d5 kid near:', near, 'parent hat', f(s.ducks[0].foam[0]), 'kid back foam', f(s.ducks[1].foam[1]), 'water foam', f0, '->', s.foam, 'neck max', f(neck), 'hit', JSON.stringify(s.shower.hit.map(f)), 'kinds', hits.join(''), D(s)); out['d5_' + near] = { hat: s.ducks[0].foam[0], kidBack: s.ducks[1].foam[1], foam0: f0, foam1: s.foam, neck };
    }
  },
  async d7(T) { // 片側だけ拭いて寝床へ。濡れた側の下にだけ水跡
    for (const flip of [false, true]) {
      await T.preset({ stage: 5, scene: 5, level: -0.33, ring: 0.12, foam: [], ducks: [{ k: 'parent', m: 'tub', x: 0.1, z: 0.0, h: 0, wet: [0, 0, 0, 0], foam: [0, 0, 0, 0] }, { k: 'kid', m: 'deck', x: 0.14, z: -0.58, h: 0, wet: [0, 0, 1, 1], foam: [0, 0, 0, 0] }] });
      await T.wait(1500); let s = await T.st(); const K = s.ducks[1]; let tg = await T.tg();
      // 右の端で、子の手前側(右=+z側)だけをなでる
      await T.down(tg.towel1.x, tg.towel1.y); await T.wait(500); await T.settle();
      const path = await T.w2s([[K.x + 0.12, 0.12, K.z + 0.1], [K.x + 0.06, 0.12, K.z + 0.05], [K.x - 0.06, 0.12, K.z + 0.05], [K.x + 0.06, 0.12, K.z + 0.05], [K.x - 0.06, 0.12, K.z + 0.05], [K.x + 0.06, 0.12, K.z + 0.05], [K.x - 0.06, 0.12, K.z + 0.05], [K.x + 0.06, 0.12, K.z + 0.05], [K.x - 0.06, 0.12, K.z + 0.05], [K.x + 0.1, 0.12, K.z + 0.1]]);
      let pp = [tg.towel1.x, tg.towel1.y]; for (const q of path) { for (let k = 1; k <= 5; k++) { await T.move(pp[0] + (q[0] - pp[0]) * k / 5, pp[1] + (q[1] - pp[1]) * k / 5); await T.wait(70); } pp = q; const ss = await T.st(); console.log('   wipe', ss.ducks[1].wet.map(f).join(',')); } s = await T.st(); const wetAfterWipe = s.ducks[1].wet.slice(); const ts = await T.ev(() => window.__duckbath.debug.towelStats());
      if (!flip) await T.shot('shots/tmp/d7a.png'); await T.up(); await T.wait(600);
      // 寝床へ(flip のときは逆向きに置く: 左から右へ運ぶと+x向き、いったん右へ出してから戻すと-x向き)
      if (!flip) await T.carry('kid', [0.6, -0.62]); else { const pp = await T.carry('kid', [0.76, -0.62], { keep: true }); const b = await T.w2s([[0.6, 0.15, -0.62]]); const s2 = await T.st(); const a = await T.scr(s2.ducks[1].x, s2.ducks[1].y, s2.ducks[1].z); const ex = (await T.scr(0.6, s2.ducks[1].y, -0.62)).x - a.x; for (let k = 1; k <= 8; k++) { await T.move(pp[0] + ex * k / 8, pp[1]); await T.wait(120); } await T.wait(400); await T.up(); await T.wait(900); }
      await T.wait(6000); s = await T.st(); const k = s.ducks[1]; const sc = await T.ev(() => window.__duckbath.debug.stainCentroid());
      const c = Math.cos(k.h), sn = Math.sin(k.h); const lz = sc ? -(sc.x - k.x) * sn + (sc.z - k.z) * c : 0;
      console.log('d7 flip', flip, 'wet after wipe', wetAfterWipe.map(f), 'towel', JSON.stringify(ts), 'kid', D(s).split('|')[1], 'heading', f(k.h), 'stain', sc && [f(sc.x), f(sc.z), f(sc.sum)], 'stain local z (neg=left side)', f(lz)); out['d7_' + flip] = { wetAfterWipe, towel: ts, heading: k.h, stain: sc, stainLocalZ: lz, kid: [k.x, k.z] };
      if (!flip) await T.shot('shots/tmp/d7b.png');
    }
  },
};
(async () => { const T = await open(); const t0 = Date.now(); await tests[which](T); console.log('errors', T.log.errors, 'sec', ((Date.now() - t0) / 1000).toFixed(0)); rec('explore_' + which, out); await T.close(); })();
