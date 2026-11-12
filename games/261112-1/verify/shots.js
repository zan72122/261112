// Five scenes x four screen sizes, captured from the running game, with the measured frame rate of each.
// Scenes 1-3 are played by touch at each size; scenes 4-5 reload the saves written by play.js at those points
// (the game's own save/restore), then wait for the picture to settle.
// usage: node verify/shots.js [WxH ...]
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const SIZES = (process.argv.slice(2).length ? process.argv.slice(2) : ['375x667', '390x844', '820x1180', '1180x820']).map((s) => s.split('x').map(Number));
const Q = 'steps=20&dtmax=0.15', KEY = 'gf-261112-1-sentaku';
const resFile = path.join(__dirname, 'results-shots.json');
const R = fs.existsSync(resFile) ? JSON.parse(fs.readFileSync(resFile, 'utf8')) : { rows: [] };
(async () => {
  for (const [w, h] of SIZES) {
    const tag = `${w}x${h}`; R.rows = R.rows.filter((r) => r.size !== tag);
    const rec = async (T, scene, view) => { await T.wait(3500); const st = await T.state(); const gl = await T.ev(() => { const g = __G.renderer.getContext(), e = g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown'; }); await T.shot(path.join(OUT, `${scene}_${tag}.png`)); const row = { size: tag, scene, view: st.view, fps: +st.fps.toFixed(1), resScale: st.res === undefined ? 1 : +st.res.toFixed(2), low: st.low, renderer: gl, errors: T.errors.length, external: T.requests.length }; R.rows.push(row); console.log(JSON.stringify(row)); };
    {
      const T = await open({ w, h, q: Q }); await T.wait(1500);
      await rec(T, 's1_load');
      const grab = (id) => T.ev((id) => { const G = __G, c = G.cl[id], f = (o) => o.site === G.station && o.loc === 'basket'; let best = null; for (let k = 0; k < c.n; k++) { if (!c.active[k]) continue; const wp = __T.wpart(id, k), s = __T.part(id, k); if (s.x < 8 || s.y < 8 || s.x > G.vw - 8 || s.y > G.vh - 8) continue; const np = G.nearParticle(s.x, s.y, f); if (np && np.c === c && (!best || wp[1] > best.wy)) best = { x: s.x, y: s.y, wy: wp[1] }; } return best; }, id);
      for (const id of ['shirt', 'towel', 'sockA', 'sockB']) { const g = await grab(id), p = await T.pt(0, 0.45, 0.27); if (!g) { console.log('no grab', id); continue; } await T.drag([[g.x, g.y], [p.x, p.y]], 800, 280); await T.until((id) => { const c = __G.cl[id]; return c.loc === 'drum' && c.insert <= 0 && c.settle <= 0; }, id, 40000); await T.wait(500); }
      const hd = await T.ev(() => { const G = __G, v = G.W.handle.getWorldPosition(new (G.cam.pos.constructor)()), p = __T.pt(v.x, v.y, v.z); if (p.x > 10 && p.x < G.vw - 10 && p.y > 10 && p.y < G.vh - 10) return p; const c = G.W.door.localToWorld(new (G.cam.pos.constructor)(-0.4, 0.08, 0.03)); return __T.pt(c.x, c.y, c.z); }); await T.tap(hd.x, hd.y); await T.until(() => __G.washer.latched, null, 60000); await T.wait(1500);
      const knobTo = async (target) => { for (let n = 0; n < 14; n++) { const v = (await T.state()).m.knob; if (Math.abs(v - target) < 0.02) return; const c = await T.pt(0.14, 0.785, 0.313), e = await T.pt(0.19, 0.785, 0.313), r = Math.abs(e.x - c.x) * 0.9; const ang = (u) => 2.44 - u * 4.88, P = (u) => [c.x - Math.sin(ang(u)) * r, c.y - Math.cos(ang(u)) * r]; const to = Math.max(0, Math.min(1, v + Math.max(-0.3, Math.min(0.3, target - v)))), pts = []; for (let i = 0; i <= 8; i++) pts.push(P(v + (to - v) * i / 8)); await T.drag(pts, 450, 70); } };
      await knobTo(0.25); await T.until(() => __G.washer.water >= 1, null, 120000); await T.wait(2500);
      await rec(T, 's2_wash');
      await knobTo(0.5); await T.until(() => __G.washer.water <= 0.01 && __G.washer.rinsed, null, 120000);
      await knobTo(0.95); await T.until(() => __G.cl.towel.onWall, null, 90000);
      await rec(T, 's3_spin');
      if (T.errors.length) console.log('errors', T.errors); await T.close();
    }
    for (const [scene, f] of [['s4_dry', 'save_s4.json'], ['s5_fold', 'save_s5.json']]) {
      const json = fs.readFileSync(path.join(__dirname, 'out', f), 'utf8');
      const T = await open({ w, h, q: Q, init: `try{localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(json)})}catch(e){}` }); await T.wait(3000);
      await rec(T, scene); if (T.errors.length) console.log('errors', T.errors); await T.close();
    }
    fs.writeFileSync(resFile, JSON.stringify(R, null, 1));
  }
})();
