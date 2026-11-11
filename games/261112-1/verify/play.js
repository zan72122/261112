// Full playthrough with real touch input (CDP touch -> Pointer Events). No game function is called to act;
// page.evaluate is used only to READ state (where things are on screen, what happened).
// usage: node verify/play.js [w h]      env: NODE_PATH must reach playwright
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const W = +(process.argv[2] || 640), H = +(process.argv[3] || 440), OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const R = { size: [W, H], checks: [], notes: {}, started: new Date().toISOString() };
const sd = (a) => { const m = a.reduce((s, v) => s + v, 0) / a.length; return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length); };
const r3 = (v) => +(+v).toFixed(3);
function check(name, ok, detail) { R.checks.push({ name, ok: !!ok, detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail !== undefined ? '  ' + JSON.stringify(detail) : '')); }

(async () => {
  const T = await open({ w: W, h: H, q: 'steps=20&dtmax=0.15' });
  const S = () => T.state();
  const shot = (n) => T.shot(path.join(OUT, n + '.png'));
  const V3 = 'new (__G.cam.pos.constructor)()';
  const partPt = (id, i, j) => T.ev(([id, i, j]) => __T.part(id, __G.cl[id].idx(i, j)), [id, i, j]);
  const grabPoint = (id) => T.ev((id) => { const G = __G, c = G.cl[id], f = (o) => o.site === G.station && (o.loc === 'basket' || o.loc === 'rod' || (o.loc === 'drum' && !o.frame)); let best = null;
    for (let k = 0; k < c.n; k++) { if (!c.active[k]) continue; const w = __T.wpart(id, k), s = __T.part(id, k); if (s.x < 8 || s.y < 8 || s.x > G.vw - 8 || s.y > G.vh - 8) continue; const np = G.nearParticle(s.x, s.y, f); if (np && np.c === c && (!best || w[1] > best.wy)) best = { x: s.x, y: s.y, wy: w[1], k }; }
    if (!best && c.loc === 'basket') { // lying low behind the basket wall: reach in just under the rim, above where it lies
      const b = G.basket, bal = G.station === 'bal', v = c.center(new (G.cam.pos.constructor)()), s = __T.pt(v.x, v.y, v.z);
      const t0 = bal ? __T.pt(b.x + 0.3, b.y + 0.15, b.z + 0.21) : __T.pt(b.x - 0.3, b.y + 0.15, b.z + 0.21), t1 = bal ? __T.pt(b.x + 0.3, b.y + 0.15, b.z - 0.21) : __T.pt(b.x + 0.3, b.y + 0.15, b.z + 0.21);
      const x = Math.max(Math.min(t0.x, t1.x) + 6, Math.min(Math.max(t0.x, t1.x) - 6, s.x)), u = (x - t0.x) / ((t1.x - t0.x) || 1); best = { x, y: t0.y + (t1.y - t0.y) * u + 9, fish: true, centre: [v.x, v.y, v.z] }; }
    return best; }, id);
  const clothTo = async (id, x, y, o = {}) => { const g = await grabPoint(id); if (!g) throw new Error('no grab point: ' + id); await T.drag([[g.x, g.y], [x, y]], o.ms || 850, o.hold || 280); };
  const portPt = () => T.pt(0, 0.45, 0.27);
  const toPort = async (id) => { const p = await portPt(); await clothTo(id, p.x, p.y); await T.until((id) => { const c = __G.cl[id]; return c.loc === 'drum' && c.insert <= 0 && c.settle <= 0; }, id, 25000); await T.wait(500); };
  const basketTop = () => T.ev(() => { const b = __G.basket; return __T.pt(b.x, b.y + 0.3, b.z); });
  const toBasket = async (id) => { const b = await basketTop(); await clothTo(id, b.x, b.y, { ms: 900 }); await T.until((id) => { const c = __G.cl[id]; return c.loc === 'basket' && c.homing <= 0; }, id, 25000); await T.wait(300); };
  const handlePt = () => T.ev(() => { const v = __G.W.handle.getWorldPosition(new (__G.cam.pos.constructor)()); return __T.pt(v.x, v.y, v.z); });
  const tapHandle = async () => { const h = await handlePt(); await T.tap(h.x, h.y); };
  const knobTo = async (target) => { for (let n = 0; n < 14; n++) { const v = (await S()).m.knob; if (Math.abs(v - target) < 0.02) return v; const c = await T.pt(0.14, 0.785, 0.313), e = await T.pt(0.19, 0.785, 0.313), r = Math.abs(e.x - c.x) * 0.9; const ang = (u) => 2.44 - u * 4.88, P = (u) => [c.x - Math.sin(ang(u)) * r, c.y - Math.cos(ang(u)) * r]; const to = Math.max(0, Math.min(1, v + Math.max(-0.3, Math.min(0.3, target - v)))), pts = []; for (let i = 0; i <= 8; i++) pts.push(P(v + (to - v) * i / 8)); await T.drag(pts, 450, 70); } return (await S()).m.knob; };
  const settled = () => T.until(() => !__T.state().transit && !__G.basket.tween, null, 90000);
  // a point low on the basket's visible wall with no laundry hanging over it
  const bFront = () => T.ev(() => { const G = __G, b = G.basket, bal = G.station === 'bal', R = G.pickR(); let best = null; for (const u of [0, -0.3, 0.3, -0.6, 0.6, -0.8, 0.8]) { const p = bal ? __T.pt(b.x + 0.3, b.y + 0.04, b.z + u * 0.21) : __T.pt(b.x + u * 0.3, b.y + 0.04, b.z + 0.21); let near = 1e9; for (const c of G.list) { if (c.loc !== 'basket') continue; for (let k = 0; k < c.n; k++) { if (!c.active[k]) continue; if (Math.abs(c.p[k * 3] - b.x) < 0.3 && Math.abs(c.p[k * 3 + 2] - b.z) < 0.21) continue; const s = __T.part(c.id, k); near = Math.min(near, Math.hypot(s.x - p.x, s.y - p.y)); } } if (near > R * 1.2) return p; if (!best || near > best.near) best = Object.assign(p, { near }); } return best; });
  const carry = async (toPtFn) => { const a = await bFront(); await T.down(a.x, a.y); await T.wait(700); const st0 = (await S()).station; for (let i = 0; i < 40; i++) { const to = await toPtFn(); const cur = await bFront(); if ((await S()).station !== st0) break; const dx = to.x - cur.x, dy = to.y - cur.y, d = Math.hypot(dx, dy) || 1, stp = Math.min(d, 46); a.x += dx / d * stp; a.y += dy / d * stp; await T.move(a.x, a.y); await T.wait(90); } await T.up(); await settled(); await T.wait(1200); };
  const rodPt = (r, dz) => T.ev(([r, dz]) => { const L = [{ x: 2.45, y: 1.30 }, { x: 2.85, y: 1.02 }][r]; return __T.pt(L.x, L.y, __G.dry.stand.z + dz); }, [r, dz]);
  const pinTo = async (id, col) => { const n = await T.ev(() => __G.dry.pins.findIndex((p) => p.state === 'tray')); const a = await T.ev((n) => { const D = __G.dry, v = D.pinWorld(D.pins[n], new (__G.cam.pos.constructor)()); return __T.pt(v.x, v.y, v.z); }, n); const b = await T.ev(([id, col]) => { const D = __G.dry, c = __G.cl[id], r = [{ x: 2.45, y: 1.30 }, { x: 2.85, y: 1.02 }][c.rod.id]; return __T.pt(r.x, r.y, D.rodZ0(c) - col * c.cell); }, [id, col]); await T.drag([[a.x, a.y], [b.x, b.y]], 800, 250); await T.wait(700); };
  const sample = async (id, pts, n = 20, ms = 300) => { const acc = []; for (let q = 0; q < n; q++) { acc.push(await T.ev(([id, pts]) => { const c = __G.cl[id], o = []; for (const [i, j] of pts) { const k = c.idx(i, j) * 3; o.push(c.p[k], c.p[k + 2]); } return o; }, [id, pts])); await T.wait(ms); } const out = []; for (let i = 0; i < pts.length; i++) out.push(r3(sd(acc.map((a) => a[i * 2])) + sd(acc.map((a) => a[i * 2 + 1])))); return out; };
  const faces = (id) => T.ev((id) => { const c = __G.cl[id]; let f = 0, b = 0, n = 0, cf = 0, cb = 0; for (let k = 0; k < c.n; k++) if (c.active[k]) { f += c.wetF[k]; b += c.wetB[k]; cf += c.covF[k]; cb += c.covB[k]; n++; } return { front: +(f / n).toFixed(3), back: +(b / n).toFixed(3), covF: cf, covB: cb, s: c.rod ? +c.rod.s.toFixed(2) : null, loc: c.loc }; }, id);
  const sides = (id) => T.ev((id) => { const c = __G.cl[id], e = -2.05; let wo = 0, no = 0, wi = 0, ni = 0; for (let k = 0; k < c.n; k++) if (c.active[k]) { const w = (c.wetF[k] + c.wetB[k]) / 2; if (c.p[k * 3 + 2] < e) { wo += w; no++; } else { wi += w; ni++; } } return { outside: no ? +(wo / no).toFixed(2) : null, nOut: no, under: ni ? +(wi / ni).toFixed(2) : null, nUnder: ni }; }, id);
  const bbPt = (id, u, v) => T.ev(([id, u, v]) => { const f = __G.cl[id].flat, w = f.wbb; return __T.pt(w.x0 + (w.x1 - w.x0) * u, f.y + f.h, w.z0 + (w.z1 - w.z0) * v); }, [id, u, v]);
  const dims = async (id) => { const f = (await S()).cloths[id].flat; return f ? { w: r3(f.bb.x1 - f.bb.x0), d: r3(f.bb.z1 - f.bb.z0), where: f.where, folds: f.folds, x: r3((f.bb.x0 + f.bb.x1) / 2), z: r3((f.bb.z0 + f.bb.z1) / 2) } : null; };
  const stroke = async (id, u0, v0, u1, v1) => { const a = await bbPt(id, u0, v0), b = await bbPt(id, u1, v1); await T.drag([[a.x, a.y], [b.x, b.y]], 750, 200); await T.wait(500); };
  const drawerPt = (u, v) => T.ev(([u, v]) => { const o = __G.fold.drawerOff, z0 = Math.max(0.3, -0.248 + o), z1 = 0.232 + o; return __T.pt(-2.655 + 0.63 * u, 0.5, z0 + (z1 - z0) * v); }, [u, v]);
  const DEV = process.env.DEV_START;   // script debugging only: jumps ahead with an internal call. Never set for the recorded run.
  if (DEV) R.notes.devJump = DEV;
  let wetSpun = 0.3;
  try {
    if (!DEV) {
    // ===== scene 1: load =====
    await T.wait(1200);
    let st = await S();
    check('starts in the laundry view with no menu', st.view === 'wash-load' && st.m.door === 1 && st.station === 'wash', { view: st.view });
    const sleeve = await partPt('shirt', 0, 1), port = await portPt(), baskPt = await basketTop();
    check('sleeve, open port and basket are on screen together', [sleeve, port, baskPt].every((p) => p.x > 0 && p.x < W && p.y > 0 && p.y < H), { sleeve: [r3(sleeve.x), r3(sleeve.y)], port: [r3(port.x), r3(port.y)] });
    await shot('s1_start');
    await T.until(() => __G.hint.act, null, 15000); const hk = await T.ev(() => __G.hint.lastKey);
    check('idle ~4s shows one finger demonstration for the first step', hk === 'load', { key: hk }); await shot('s1_hint');
    await T.wait(3200);
    // knob responds with a wiggle only while the door is open
    { const c = await T.pt(0.14, 0.785, 0.313); await T.drag([[c.x - 14, c.y], [c.x + 40, c.y]], 300, 60); await T.wait(300); st = await S(); check('knob only wiggles while the door is open', st.m.knob === 0 && st.m.zone === 'off'); }
    // door to the balcony just rattles before it has been visited
    { const d = await T.pt(0.9, 0.9, -0.36); await T.tap(d.x, d.y); await T.wait(500); check('balcony door only rattles before the laundry is washed', (await S()).station === 'wash'); }
    // first touch: sleeve lifts at once
    await T.ev(() => { const c = __G.cl.shirt, k = c.idx(0, 1), y0 = c.p[k * 3 + 1]; window.__lift = null; window.addEventListener('pointerdown', () => { const t = performance.now(); let n = 0; const f = () => { n++; if (c.p[k * 3 + 1] > y0 + 0.004) window.__lift = { ms: performance.now() - t, frames: n }; else if (n < 60) requestAnimationFrame(f); }; requestAnimationFrame(f); }, { once: true, capture: true }); });
    await T.down(sleeve.x, sleeve.y); await T.wait(450);
    const lift = await T.ev(() => window.__lift); st = await S();
    check('touching the sleeve grabs it and lifts that point (frames until visibly lifted)', st.cloths.shirt.grab >= 0 && lift && lift.frames <= 2, lift); R.notes.sleeveLift = lift;
    for (let i = 1; i <= 10; i++) { await T.move(sleeve.x + (port.x - sleeve.x) * i / 10, sleeve.y + (port.y - sleeve.y) * i / 10); await T.wait(55); }
    await T.wait(250); await shot('s1_pull'); await T.up(); const tIn = Date.now();
    await T.until(() => { const c = __G.cl.shirt; return c.loc === 'drum' && c.insert <= 0; }, null, 25000);
    check('short pull drops the shirt over the lip into the drum', (await S()).cloths.shirt.loc === 'drum', { seconds: (Date.now() - tIn) / 1000 });
    await toPort('sockB'); st = await S(); check('sock put in on its own is not wrapped', st.cloths.sockB.loc === 'drum' && !st.cloths.sockB.wrap);
    await toPort('towel'); await toPort('sockA'); st = await S();
    check('sock laid onto the towel in the drum gets wrapped in its fold', st.cloths.sockA.wrap === true && st.cloths.towel.loc === 'drum', { sockA: st.cloths.sockA.wrap, sockB: st.cloths.sockB.wrap });
    await shot('s1_loaded');
    // ===== scene 2: wash =====
    await tapHandle(); await T.until(() => __G.washer.latched, null, 25000); await T.wait(900); st = await S();
    check('door handle tap closes and latches the door, view moves to the washer', st.m.latched && st.view === 'wash-run', { view: st.view });
    const dirt0 = st.cloths.towel.dirt;
    await knobTo(0.25); st = await S(); check('turning the plain knob (arc drag) starts the wash', st.m.zone === 'wash', { knob: r3(st.m.knob) });
    await T.until(() => __G.washer.water >= 1, null, 60000);
    const ys = []; for (let i = 0; i < 24; i++) { ys.push((await T.ev(() => { const c = __G.cl.towel, v = c.center(new (__G.cam.pos.constructor)()); v.applyMatrix4(c.frame); return v.y; }))); await T.wait(220); }
    st = await S();
    check('water fills, slow drum lifts the cloth and drops it into the water', st.m.water >= 1 && Math.abs(st.m.omega) > 3 && Math.max(...ys) - Math.min(...ys) > 0.04, { omega: r3(st.m.omega), towelCentreYRange: r3(Math.max(...ys) - Math.min(...ys)) });
    check('cloth gets soaked, suds build up', st.cloths.towel.wet > 0.95 && st.m.suds > 0.2, { wet: r3(st.cloths.towel.wet), suds: r3(st.m.suds) });
    await shot('s2_wash');
    await T.until(() => __G.list.every((c) => c.dirtMean < 0.02), null, 90000); st = await S();
    check('dirt marks thin out while washing', st.cloths.towel.dirt < 0.02 && dirt0 > 0.03, { before: r3(dirt0), after: r3(st.cloths.towel.dirt) });
    await knobTo(0.5); await T.wait(1200); await shot('s2_rinse');
    await T.until(() => __G.washer.water <= 0.01 && __G.washer.rinsed, null, 60000); st = await S();
    check('turning further gives a short rinse and the water drains', st.m.water <= 0.01 && st.m.suds < 0.1, { water: st.m.water, suds: r3(st.m.suds) });
    // ===== scene 3: spin =====
    await knobTo(1.0); await T.wait(1500); st = await S();
    check('spin: the view closes in on the round window', st.view === 'wash-spin' && st.m.zone === 'spin', { view: st.view });
    await T.until(() => __G.cl.towel.onWall && __G.cl.shirt.onWall, null, 30000); await T.wait(2500);
    const drops = await T.ev(() => __G.drops.n); st = await S(); await shot('s3_spin');
    check('fast spin presses the laundry onto the drum wall, drops run on the window', st.cloths.towel.onWall && st.cloths.shirt.onWall && drops > 0, { onWall: Object.fromEntries(Object.entries(st.cloths).map(([k, c]) => [k, c.onWall])), windowDrops: drops });
    // discovery 1: back off -> pieces peel off one at a time; forward -> they stick again
    await knobTo(0.63); const peel = {}; const t0 = Date.now();
    for (let i = 0; i < 80; i++) { const s = await S(); for (const [k, c] of Object.entries(s.cloths)) if (!c.onWall && peel[k] === undefined) peel[k] = r3((Date.now() - t0) / 1000); if (!s.cloths.towel.onWall && !s.cloths.shirt.onWall) break; await T.wait(180); }
    st = await S(); await shot('s3_peel');
    check('D1 slowing down: clothes peel off the wall one after another', peel.towel !== undefined && peel.shirt !== undefined && peel.towel !== peel.shirt, { peelSeconds: peel, omega: r3(st.m.omega) });
    await knobTo(0.85); await T.until(() => __G.cl.towel.onWall && __G.cl.shirt.onWall, null, 30000); st = await S();
    check('D1 speeding up again: they stick to the wall again (both states reachable around mid speed)', st.cloths.towel.onWall && st.cloths.shirt.onWall, { omega: r3(st.m.omega) });
    await knobTo(1.0); await T.until(() => __G.list.every((c) => c.wetMean < 0.34), null, 40000); st = await S();
    wetSpun = st.cloths.towel.wet;
    check('spinning lowers the remaining water', wetSpun < 0.34, { towelWet: r3(wetSpun) });
    await knobTo(0.5); await T.wait(2500); st = await S();
    check('turning the knob back does not put water back', st.m.water <= 0.01 && st.cloths.towel.wet <= wetSpun + 0.005, { zone: st.m.zone, water: st.m.water, towelWet: r3(st.cloths.towel.wet) });
    await knobTo(0.9); await T.wait(3500);
    // opening while running: slows down first, then opens
    await tapHandle(); await T.wait(400); st = await S(); const omegaAtTap = st.m.omega;
    check('door does not pop open mid-spin', st.m.latched && st.m.door === 0, { omega: r3(omegaAtTap) });
    await T.until(() => __G.washer.door >= 1, null, 60000); await settled(); await T.wait(800); st = await S();
    check('it slows, the knob returns, then the door opens', st.m.door === 1 && st.m.knob === 0 && Math.abs(st.m.omega) < 0.2 && st.view === 'wash-load');
    check('after the spin the pieces cling to the drum wall', st.cloths.towel.stuck === 1 && st.cloths.sockB.stuck === 1, Object.fromEntries(Object.entries(st.cloths).map(([k, c]) => [k, c.stuck])));
    await shot('s3_open');
    // discovery 2: pull the towel out -> the wrapped sock tumbles out, one sock inside out
    await toBasket('towel'); await T.wait(1500); st = await S();
    check('D2 pulling the towel out makes the wrapped sock tumble out inside-out', st.koron === 1 && st.cloths.sockA.inv === true && st.cloths.sockA.loc === 'basket', { koron: st.koron, sockA: st.cloths.sockA.loc, inverted: st.cloths.sockA.inv });
    check('D2 the separately loaded sock is still stuck in the drum, not inverted', st.cloths.sockB.loc === 'drum' && st.cloths.sockB.inv === false && st.cloths.sockB.stuck === 1);
    await shot('s3_koron');
    await toBasket('sockB'); await toBasket('shirt'); st = await S();
    check('everything is back in the basket, damp', Object.values(st.cloths).every((c) => c.loc === 'basket' && c.wet > 0.2 && c.wet < 0.4), Object.fromEntries(Object.entries(st.cloths).map(([k, c]) => [k, r3(c.wet)])));
    } else { await T.wait(800); await T.ev(() => { const G = __G; G.progress.washed = true; G.progress.spun = true; G.progress.washCount = 1; for (const c of G.list) { c.setWet(0.3); c.dirt.fill(0); } }); }
    let st;
    if (DEV === 'fold') { await T.ev(() => { const G = __G; G.progress.hung = true; G.progress.bal = true; G.progress.dried = true; G.cl.sockA.inverted = true; G.setSockLook(G.cl.sockA); for (const c of G.list) c.setWet(0); }); }
    if (DEV !== 'fold') {
    // ===== to the balcony =====
    await carry(() => T.pt(1.05, 0.14, 0.0)); st = await S();
    check('carrying the basket to the doorway takes the view (and the laundry) to the balcony', st.station === 'bal' && st.basket.station === 'bal' && Object.values(st.cloths).every((c) => c.site === 'bal'), { view: st.view });
    await shot('s4_arrive');
    // ===== scene 4: dry =====
    // towel by its corner on the back rod, straddling the eaves edge
    { const g = await partPt('towel', 0, 0), p = await rodPt(0, 0.6); await T.drag([[g.x, g.y], [p.x, p.y]], 1000, 400); await T.wait(2200); }
    st = await S(); check('towel hangs over the rod where it was dropped', st.cloths.towel.loc === 'rod' && st.cloths.towel.rod.id === 0, st.cloths.towel.rod);
    await pinTo('towel', 0); await T.wait(3500); st = await S();
    check('a clothespin carried from the saucer pins the corner', st.cloths.towel.rod.holds.length === 1 && st.dry.pins.filter((p) => p.state === 'on').length === 1, st.cloths.towel.rod);
    await shot('s4_onepin');
    const GRID = [[8, 0], [8, 15], [4, 8], [0, 15], [4, 15], [0, 8], [8, 8], [4, 4], [4, 12]], mean = (a) => r3(a.reduce((x, y) => x + y, 0) / a.length);
    const one = await sample('towel', GRID);
    await pinTo('towel', 8); await T.wait(3500); await shot('s4_twopins');
    const two = await sample('towel', GRID); st = await S();
    check('D3 one corner pinned: free corner swings widely; both corners pinned: overall swing drops, cloth between ripples', one[0] > 0.05 && two[0] < 0.01 && mean(two) < mean(one) * 0.85 && two[2] > 0.004, { onePin: { freeCorner: one[0], hem: one[1], overall: mean(one) }, twoPins: { corner: two[0], hem: two[1], middle: two[2], overall: mean(two) } });
    R.notes.firstHang = { wet: r3(st.cloths.towel.wet), swingSlow: r3(st.cloths.towel.swingSlow), hem: two[1], drips: await T.ev(() => __G.cl.towel.dripped || 0) };
    // shirt on the front rod
    { const p = await rodPt(1, -0.22); await clothTo('shirt', p.x, p.y, { ms: 900, hold: 350 }); await T.wait(1500); }
    st = await S(); check('shirt hangs on the front rod', st.cloths.shirt.loc === 'rod' && st.cloths.shirt.rod.id === 1, st.cloths.shirt.rod);
    // discovery 6: passing shower
    const before = await sides('towel'); check('(towel still evenly damp/dry before the shower)', before.outside < 0.4, before);
    await T.until(() => __G.dry.rainS.state === 'rain' && __G.dry.rainS.k > 0.9, null, 120000); await T.wait(4500);
    const during = await sides('towel'); st = await S(); await shot('s4_rain');
    check('D6 a light shower comes once: only the part outside the eaves gets wet (same towel, two halves)', during.nOut > 10 && during.nUnder > 10 && during.outside > during.under + 0.25, { before, during, sun: 'dimmed only, no thunder' });
    { const g = await T.ev(() => __T.pt(2.65, 1.16, __G.dry.stand.z - 0.66)), to = await T.ev(() => __T.pt(2.65, 1.16, __G.dry.stand.z - 0.66 + 0.6)); await T.drag([[g.x, g.y], [g.x + (to.x - g.x), g.y + (to.y - g.y)]], 800, 200); await T.wait(600); }
    st = await S(); const r0 = await T.ev(() => __G.list.map((c) => c.rained || 0)); await T.wait(2500); const r1 = await T.ev(() => __G.list.map((c) => c.rained || 0)); const st2 = await S();
    check('D6 sliding the stand under the eaves by its grip: no new wet marks while it still rains', st.dry.standZ > -1.5 && st2.dry.rainK > 0.3 && r1.every((v, i) => v - r0[i] < 1e-6), { standZ: r3(st.dry.standZ), rainK: r3(st2.dry.rainK), newWet: r1.map((v, i) => r3(v - r0[i])) });
    await shot('s4_undereaves');
    await T.until(() => __G.dry.rainS.state === 'idle', null, 90000); st = await S();
    check('the shower passes and does not come back', st.dry.rain === 'idle' && st.progress.rainFor === st.progress.washCount);
    // stand back out (tap on the grip toggles)
    { const g = await T.ev(() => __T.pt(2.65, 1.16, __G.dry.stand.z - 0.66)); await T.tap(g.x, g.y); await T.until(() => __G.dry.stand.tz === null && __G.dry.stand.z < -2.3, null, 30000); await T.wait(2000); check('a tap on the grip rolls the stand back out', (await S()).dry.standZ < -2.3, { standZ: (await S()).dry.standZ, hit: await T.ev(() => __G.lastTouch) }); }
    // socks beside it
    for (const [id, dz] of [['sockA', 0.58], ['sockB', 0.44]]) { const p = await rodPt(1, dz); await clothTo(id, p.x, p.y, { ms: 900, hold: 350 }); await T.wait(900); }
    st = await S(); check('socks hang on the front rod too', ['sockA', 'sockB'].every((k) => st.cloths[k].loc === 'rod'), Object.fromEntries(Object.entries(st.cloths).map(([k, c]) => [k, c.loc])));
    await shot('s4_hung'); await T.wait(2600); fs.writeFileSync(path.join(OUT, 'save_s4.json'), await T.ev(() => localStorage.getItem('gf-261112-1-sentaku')) || '');
    // discovery 5: fold the towel over the rod, later look inside
    { // pull the pins off (drag away), take the towel and hang it folded at its middle
      for (let n = 0; n < 2; n++) { const a = await T.ev(() => { const D = __G.dry, p = D.pins.find((q) => q.state === 'on' && q.cloth && q.cloth.id === 'towel'); if (!p) return null; const v = D.pinWorld(p, new (__G.cam.pos.constructor)()); return __T.pt(v.x, v.y, v.z); }); if (!a) break; await T.drag([[a.x, a.y], [a.x + 30, a.y - 70]], 500, 150); await T.wait(900); }
      st = await S(); check('pulling a clothespin takes it off; it returns to the saucer; the towel rests on the rod', st.dry.pins.every((p) => p.state === 'tray') && st.cloths.towel.loc === 'rod', { rod: st.cloths.towel.rod });
      const g = await partPt('towel', 4, 8), up = await rodPt(0, 0.5); await T.down(g.x, g.y); await T.wait(150); for (let i = 1; i <= 12; i++) { await T.move(g.x + (up.x - g.x) * i / 12, g.y + (up.y - 26 - g.y) * i / 12); await T.wait(60); } await T.move(up.x, up.y); await T.wait(500); await T.up(); await T.wait(2500);
    }
    let f0 = await faces('towel'); check('towel re-hung folded in half over the rod', f0.loc === 'rod' && f0.s > 5 && f0.s < 11 && f0.covB > 60, f0);
    await T.wait(14000); let f1 = await faces('towel');
    { const g = await partPt('towel', 4, 15); await T.down(g.x, g.y); await T.wait(150); for (let i = 1; i <= 10; i++) { await T.move(g.x + 30 * i / 10, g.y - H * 0.34 * i / 10); await T.wait(50); } await T.wait(600); await shot('s4_flip'); await T.up(); await T.wait(1500); }
    check('D5 folded towel: outer face dries, the inner face keeps a darker wet patch (seen by flipping it up)', f1.back > f1.front + 0.035 && f0.front - f1.front > 0.035 && f0.back - f1.back < 0.03, { atHang: f0, later: f1 });
    const dr0 = await T.ev(() => __G.cl.towel.dripped || 0);
    for (let n = 0; n < 5; n++) { const f = await faces('towel'); if (f.s < 0.5 || f.loc !== 'rod') break; const g = await partPt('towel', 4, 15); await T.down(g.x, g.y); await T.wait(150); for (let i = 1; i <= 10; i++) { await T.move(g.x, g.y + H * 0.13 * i / 10); await T.wait(70); } await T.wait(300); await T.up(); await T.wait(1300); }
    let f2 = await faces('towel'); await pinTo('towel', 0); await pinTo('towel', 8); await T.wait(9000); let f3 = await faces('towel'); st = await S();
    check('D5 spread out and pinned again: the patch is uncovered and dries, the towel catches the wind', f2.loc === 'rod' && f2.covB < 20 && f3.back < f2.back - 0.03 && st.cloths.towel.swingSlow > 0.01, { spread: f2, later: f3, swing: r3(st.cloths.towel.swingSlow) });
    await shot('s4_spread');
    // discovery 4: big towel upwind of the shirt
    const shirtWind = async () => { const xs = [], sp = []; for (let q = 0; q < 40; q++) { const r = await T.ev(() => { const c = __G.cl.shirt, rx = [2.45, 2.85][c.rod.id]; let x = 0, n = 0; for (let k = 0; k < c.n; k++) if (c.active[k]) { x += Math.abs(c.p[k * 3] - rx); n++; } return [x / n, c.swing]; }); xs.push(r[0]); sp.push(r[1]); await T.wait(300); } return { lean: r3(xs.reduce((a, b) => a + b) / xs.length), speed: r3(sp.reduce((a, b) => a + b) / sp.length) }; };
    const shadeOf = () => T.ev(() => { const c = __G.cl.shirt; let s = 0, n = 0; for (let k = 0; k < c.n; k++) if (c.active[k]) { s += c.shade[k]; n++; } return s / n; });
    const cz = (id) => T.ev((id) => __G.cl[id].center(new (__G.cam.pos.constructor)()).z, id);
    const slideTowel = async (toZ) => { for (let n = 0; n < 4; n++) { const z = await cz('towel'); if (Math.abs(z - toZ) < 0.05) break; const g = await partPt('towel', 4, 1), a = await T.ev(([z0, z1]) => [__T.pt(2.45, 1.25, z0), __T.pt(2.45, 1.25, z1)], [z, toZ]); await T.drag([[g.x, g.y], [g.x + (a[1].x - a[0].x) * 1.15, g.y + (a[1].y - a[0].y) * 1.15]], 1000, 250); await T.wait(900); } };
    const zShirt = await cz('shirt'), zTowel0 = await cz('towel'), shade0 = await shadeOf(), wOpen = await shirtWind();
    await slideTowel(zShirt); await T.wait(3500); const shade1 = await shadeOf(); await shot('s4_shadow');
    const wBehind = await shirtWind();
    await slideTowel(zTowel0); await T.wait(3500); const shade2 = await shadeOf(), wAside = await shirtWind();
    check('D4 towel slid upwind of the shirt: the shirt leans and moves less; slid aside: wind reaches it and it moves again', shade1 < shade0 - 0.25 && shade2 > shade1 + 0.25 && wBehind.speed < 0.75 * (wOpen.speed + wAside.speed) / 2 && wBehind.lean < 0.75 * (wOpen.lean + wAside.lean) / 2 && wAside.speed > wBehind.speed * 1.25, { windShare: { open: r3(shade0), behind: r3(shade1), aside: r3(shade2) }, shirt: { open: wOpen, behindTowel: wBehind, towelAside: wAside }, towelZ: [r3(zTowel0), r3(zShirt)] });
    R.notes.d4 = { wOpen, wBehind, wAside, shade0, shade1, shade2 };
    // dry, take in
    await T.until(() => __G.list.every((c) => c.wetMean < 0.07), null, 200000); st = await S();
    check('laundry dries within seconds-to-a-minute depending on exposure', Object.values(st.cloths).every((c) => c.wet < 0.07), Object.fromEntries(Object.entries(st.cloths).map(([k, c]) => [k, r3(c.wet)])));
    await shot('s4_dry');
    for (const id of ['shirt', 'sockA', 'sockB', 'towel']) { for (let n = 0; n < 3 && (await S()).cloths[id].loc !== 'basket'; n++) { const b = await basketTop(); await clothTo(id, b.x, b.y, { ms: 1100, hold: 300 }); await T.wait(2500); } }
    st = await S(); check('taking in: pulling pops the pins back to the saucer, laundry returns to the basket', Object.values(st.cloths).every((c) => c.loc === 'basket') && st.dry.pins.every((p) => p.state !== 'on'), { pins: st.dry.pins.map((p) => p.state) });
    // ===== second wash of the SAME towel with a weak spin, same hanging, for comparison =====
    await carry(() => T.pt(1.3, 0.14, -0.7)); st = await S(); check('basket carried back through the door returns to the washer', st.station === 'wash' && st.basket.station === 'wash');
    await toPort('towel'); await tapHandle(); await T.until(() => __G.washer.latched, null, 25000); await T.wait(600);
    await knobTo(0.25); await T.until(() => __G.washer.water >= 1 && __G.cl.towel.wetMean > 0.98, null, 60000);
    await knobTo(0.5); await T.until(() => __G.washer.water <= 0.01 && __G.washer.rinsed, null, 60000);
    await knobTo(0.3); await T.wait(1500); st = await S(); check('returning the knob to the wash position refills the water', st.m.zone === 'wash' && st.m.water > 0.1, { water: r3(st.m.water) });
    await knobTo(0.5); await T.until(() => __G.washer.water <= 0.01 && __G.washer.rinsed, null, 60000);
    await knobTo(0.66); await T.wait(5000); await tapHandle(); await T.until(() => __G.washer.door >= 1, null, 60000); await settled(); await T.wait(600);
    await toBasket('towel'); st = await S(); const wetWeak = st.cloths.towel.wet;
    check('weak spin leaves the same towel much wetter', wetWeak > wetSpun + 0.25, { strongSpin: r3(wetSpun), weakSpin: r3(wetWeak) });
    await carry(() => T.pt(1.05, 0.14, 0.0));
    { const g = await partPt('towel', 0, 0), p = await rodPt(0, 0.3); const dr = await T.ev(() => __G.cl.towel.dripped || 0); await T.drag([[g.x, g.y], [p.x, p.y]], 1000, 400); await T.wait(2200); await pinTo('towel', 0); await pinTo('towel', 8); await T.wait(3500); await shot('s4_wet_towel');
      const two2 = await sample('towel', GRID); st = await S(); const drips = (await T.ev(() => __G.cl.towel.dripped || 0)) - dr;
      R.notes.secondHang = { wet: r3(st.cloths.towel.wet), hem: two2[1], drips };
      check('same towel, same two pins, wetter: it drips, hangs heavier and swings less than after the strong spin', drips > 0 && two2[1] < R.notes.firstHang.hem && R.notes.firstHang.drips === 0, { first: R.notes.firstHang, second: R.notes.secondHang }); }
    await T.until(() => __G.cl.towel.wetMean < 0.07, null, 240000);
    { const b = await basketTop(); for (let n = 0; n < 3 && (await S()).cloths.towel.loc !== 'basket'; n++) { await clothTo('towel', b.x, b.y, { ms: 1100, hold: 300 }); await T.wait(2500); } }
    // ===== to the folding counter =====
    await carry(() => T.pt(1.3, 0.14, -0.7));
    }
    await carry(() => T.pt(-1.9, 0.14, 0.9)); st = await S();
    check('basket carried on to the counter', st.station === 'fold' && st.basket.station === 'fold', { view: st.view }); await shot('s5_arrive');
    const top = (x, z) => T.pt(x, 0.75, z);
    { const p = await top(-2.25, -0.05); await clothTo('towel', p.x, p.y, { ms: 900, hold: 300 }); await T.wait(1300); }
    { const p = await top(-1.55, -0.05); await clothTo('shirt', p.x, p.y, { ms: 900, hold: 300 }); await T.wait(1300); }
    st = await S(); check('pieces laid on the counter spread flat; a family member comes over', st.cloths.towel.flat && st.cloths.shirt.flat && st.fold.person !== 'away', { person: st.fold.person });
    // discovery 7: fold the towel from different edges
    const unfoldLast = async (id) => { const p = await T.ev((id) => { const G = __G, c = G.cl[id], f = c.flat, F = f.folds, l = F[F.length - 1]; if (!l) return null; const pre = c.foldExtent(l.ax, F.length - 1), free = l.side > 0 ? 2 * l.c - pre[1] : 2 * l.c - pre[0], e0 = l.side > 0 ? pre[1] : pre[0], oth = c.foldExtent(1 - l.ax), mid = (oth[0] + oth[1]) / 2;
      const W = (a, o) => { const xf = l.ax === 0 ? a : o, zf = l.ax === 0 ? o : a, xr = f.rot ? zf : xf, zr = f.rot ? -xf : zf; return __T.pt(f.ox + xr, f.y + f.h, f.oz + G.fold.zoff(c) + zr); };
      return [W(free + 0.02 * l.side, mid), W(e0 + 0.07 * l.side, mid)]; }, id); if (!p) return false; await T.drag([[p[0].x, p[0].y], [p[1].x, p[1].y]], 800, 220); await T.wait(500); return true; };
    await stroke('towel', 0.5, 0.95, 0.5, 0.04); const half = await dims('towel'); await unfoldLast('towel');
    const opened = await dims('towel'); check('folding follows the finger; pulling the folded edge back opens it again', half.folds === 1 && half.d < 0.3 && opened.folds === 0 && opened.w > 0.85 && opened.d > 0.45, { folded: half, opened });
    await stroke('towel', 0.5, 0.95, 0.5, 0.04); await stroke('towel', 0.5, 0.95, 0.5, 0.05); await stroke('towel', 0.97, 0.5, 0.03, 0.5);
    const thin = await dims('towel'); await shot('s5_thin');
    // open the drawer by pulling its handle, put the thin package in, a sock beside it
    { const hd = await T.ev(() => { const v = __G.W.drawerHandle.getWorldPosition(new (__G.cam.pos.constructor)()); return [__T.pt(v.x, v.y, v.z), __T.pt(v.x, v.y, v.z + 0.44)]; }); await T.drag([[hd[0].x, hd[0].y], [hd[1].x, hd[1].y]], 700, 200); await T.wait(1200); }
    check('pulling the handle opens the drawer', (await S()).fold.drawer === 1);
    { const a = await bbPt('towel', 0.5, 0.5), b = await drawerPt(0.5, 0.3); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 250); await T.wait(900); }
    const thinIn = await dims('towel');
    { const b = await drawerPt(0.5, 0.65); await clothTo('sockA', b.x, b.y, { ms: 900, hold: 300 }); await T.wait(900); }
    const sockThin = await dims('sockA'); await shot('s5_drawer_thin');
    // take the towel out again, open it and fold it the other way (square), put it back: the gap and the visible stripes change
    { const a = await bbPt('towel', 0.5, 0.5), b = await top(-2.1, -0.05); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 250); await T.wait(900); }
    for (let n = 0; n < 5 && (await dims('towel')).folds > 0; n++) await unfoldLast('towel');
    const reopened = await dims('towel'); check('the stored towel can be taken out and opened again', reopened.folds === 0 && reopened.where === 'top' && reopened.w > 0.85, reopened);
    await stroke('towel', 0.97, 0.5, 0.03, 0.5); await stroke('towel', 0.5, 0.95, 0.5, 0.05); await stroke('towel', 0.96, 0.5, 0.04, 0.5);
    const square = await dims('towel'); await shot('s5_square');
    { const a = await bbPt('towel', 0.5, 0.5), b = await drawerPt(0.22, 0.4); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 250); await T.wait(900); }
    const squareIn = await dims('towel');
    { const a = await bbPt('sockA', 0.5, 0.5), b = await drawerPt(0.72, 0.3); await T.drag([[a.x, a.y], [b.x, b.y]], 800, 250); await T.wait(900); }
    { const b = await drawerPt(0.72, 0.62); await clothTo('sockB', b.x, b.y, { ms: 900, hold: 300 }); await T.wait(900); }
    const sockSq = await dims('sockA'), sockB = await dims('sockB'); await shot('s5_drawer_square'); await T.wait(2600); fs.writeFileSync(path.join(OUT, 'save_s5.json'), await T.ev(() => localStorage.getItem('gf-261112-1-sentaku')) || '');
    check('D7 folding the towel from different edges gives a long thin package and a square one; they leave different gaps in the drawer and the socks go in differently', thin.w / thin.d > 2.5 && square.w / square.d < 1.6 && thinIn.where === 'drawer' && squareIn.where === 'drawer' && sockThin.where === 'drawer' && sockSq.where === 'drawer' && (Math.abs(sockSq.x - sockThin.x) > 0.1 || Math.abs(sockSq.z - sockThin.z) > 0.1), { thin: [thin.w, thin.d], square: [square.w, square.d], thinInDrawer: [thinIn.x, thinIn.z], squareInDrawer: [squareIn.x, squareIn.z], sockWithThin: [sockThin.x, sockThin.z], sockWithSquare: [sockSq.x, sockSq.z], sockB: [sockB.x, sockB.z, sockB.where] });
    // shirt: sleeves in, hem up, into the drawer on top
    await stroke('shirt', 0.03, 0.15, 0.42, 0.15); await stroke('shirt', 0.97, 0.15, 0.4, 0.15); await stroke('shirt', 0.5, 0.96, 0.5, 0.1);
    const shirtF = await dims('shirt');
    { const a = await bbPt('shirt', 0.5, 0.5), b = await drawerPt(0.7, 0.5); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 250); await T.wait(900); }
    check('shirt folds (sleeves, hem) and goes into the drawer', shirtF.folds === 3 && (await dims('shirt')).where === 'drawer', { folded: shirtF, stored: await dims('shirt') });
    // towel back out for the hand-over; basket onto the shelf
    { const a = await bbPt('towel', 0.5, 0.5), b = await top(-2.2, -0.05); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 250); await T.wait(900); }
    { const bk = await T.ev(() => { const b = __G.basket; return [__T.pt(b.x, b.y + 0.04, b.z + 0.21), __T.pt(-1.56, 0.18, 0.05)]; }); await T.drag([[bk[0].x, bk[0].y], [bk[1].x, bk[1].y]], 900, 250); await T.wait(1500); }
    st = await S(); check('empty basket slides onto the shelf; pins are in their saucer', st.basket.shelf === true && st.dry.pins.every((p) => p.state === 'tray'));
    await shot('s5_tidy');
    await T.until(() => __G.fold.P.state === 'wait' && __G.fold.P.k > 0.95, null, 30000);
    { const a = await bbPt('towel', 0.5, 0.5), h = (await S()).fold.hands, b = await T.pt(h[0], h[1], h[2]); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 300); await T.wait(500); }
    st = await S(); check('the last towel is handed to the waiting hands', st.cloths.towel.loc === 'person' && st.view === 'fold-finale', { person: st.fold.person });
    await T.until(() => __G.fold.P.state === 'nuzzle' && __G.fold.P.t > 1.3, null, 30000); await shot('s5_nuzzle');
    await T.until(() => __G.fold.P.state === 'card' && __G.fold.P.t > 1.3, null, 30000); await shot('s5_card');
    await T.until(() => __G.fold.P.state === 'hold', null, 30000); await T.wait(2200); st = await S(); await shot('s5_end');
    check('towel is pressed to the cheek, then a wordless hanamaru card comes back', st.progress.card === true && st.fold.person === 'hold');
    // ===== replay: the same towel can go round again; viewpoint-only navigation =====
    { const h = (await S()).fold.hands, a = await T.pt(h[0], h[1] + 0.02, h[2]), b = await top(-2.0, 0.0); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 300); await T.wait(900); }
    st = await S(); check('the towel can be taken back from the hands (same piece, folds kept)', st.cloths.towel.loc === 'flat' && st.cloths.towel.flat.folds === square.folds, { folds: st.cloths.towel.flat.folds, was: square.folds });
    { const bk = await T.ev(() => { const b = __G.basket; return [__T.pt(b.x, b.y + 0.04, b.z + 0.21), __T.pt(-1.56, 0.04, 0.99)]; }); await T.drag([[bk[0].x, bk[0].y], [bk[1].x, bk[1].y]], 900, 250); await T.wait(1500); }
    { const a = await bbPt('towel', 0.5, 0.5), b = await basketTop(); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 300); await T.until(() => __G.cl.towel.loc === 'basket' && __G.cl.towel.homing <= 0, null, 20000); }
    { const a = await bbPt('shirt', 0.5, 0.5), b = await basketTop(); await T.drag([[a.x, a.y], [b.x, b.y]], 900, 300); await T.until(() => __G.cl.shirt.loc === 'basket' && __G.cl.shirt.homing <= 0, null, 20000); }
    st = await S(); check('stored pieces go back into the basket for another wash (no copies; the socks stay where they were put, one still inside-out)', st.cloths.towel.loc === 'basket' && st.cloths.shirt.loc === 'basket' && st.cloths.sockA.flat && st.cloths.sockA.flat.where === 'drawer' && st.cloths.sockA.inv === true && st.cloths.sockB.flat && st.cloths.sockB.flat.where === 'drawer', { towel: st.cloths.towel.loc, shirt: st.cloths.shirt.loc, sockA: st.cloths.sockA.flat && st.cloths.sockA.flat.where, inv: st.cloths.sockA.inv });
    await carry(() => T.pt(-0.5, 0.14, 1.0)); st = await S();
    check('the basket carries the view back to the washer', st.station === 'wash' && st.basket.station === 'wash');
    { const d = await T.pt(0.9, 0.9, -0.36); await T.tap(d.x, d.y); await settled(); await T.wait(600); } st = await S();
    check('door tap now goes out to the balcony (visited): only the viewpoint moves, the basket stays', st.station === 'bal' && st.basket.station === 'wash');
    { const d = await T.pt(1.2, 1.0, -0.48); const on = d.x > 0 && d.x < W && d.y > 0 && d.y < H; await T.tap(d.x, d.y); await settled(); await T.wait(600); st = await S(); check('and the door seen from the balcony leads back in', on && st.station === 'wash', { doorOnScreen: on }); }
    await toPort('towel'); st = await S();
    check('same towel goes into the drum again', st.station === 'wash' && st.cloths.towel.loc === 'drum');
    await shot('s1_again');
  } catch (e) { check('run completed without script error', false, String(e && e.stack || e)); try { await shot('error'); } catch (e2) { /* ignore */ } }
  const st = await S().catch(() => null);
  R.final = st ? { fps: r3(st.fps), low: st.low, res: st.res, gameSeconds: r3(st.time), audio: st.audio } : null;
  R.consoleErrors = T.errors; R.externalRequests = T.requests; R.hints = await T.ev(() => Object.keys(__G.hint.shown)).catch(() => []);
  check('no console errors', T.errors.length === 0, T.errors); check('no external requests', T.requests.length === 0, T.requests);
  R.pass = R.checks.filter((c) => c.ok).length; R.fail = R.checks.filter((c) => !c.ok).length; R.finished = new Date().toISOString();
  fs.writeFileSync(path.join(__dirname, `results-play-${W}x${H}.json`), JSON.stringify(R, null, 1));
  console.log(`\n${R.pass} passed, ${R.fail} failed`);
  await T.close();
})();
