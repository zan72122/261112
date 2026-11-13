/* app.js — boot, renderer, camera, pointer input, steps/views UI and layout.
   Only the first scene (the machine, the slides on the desk, the "いれる" step) is built
   here. Everything else is loaded by loadLate() after the first frame is on screen. */
(function () {
  'use strict';
  const SS = window.SS, T = THREE, U = SS.util, C = SS.cfg, S = SS.S, mech = SS.mech;
  const A = (SS.app = {});
  const $ = (s) => document.querySelector(s);
  let renderer, scene, camera, M, W = 1, H = 1;

  /* ---------- camera rig ---------- */
  const VIEWS = {
    real: { az: 0.5, pol: 1.13, R: 34, tgt: [-1.5, 15.5, 3.5] },
    explode: { az: 0.62, pol: 1.2, R: 47, tgt: [-1.5, 28, 0] },
    path: { az: 0.3, pol: 1.36, R: 21, tgt: [-8, 18, 0] },
    scan: { az: 0.3, pol: 0.66, R: 19, tgt: [-6.5, 13, 0.5] },
  };
  const orb = (A.orb = { az: 0.5, pol: 1.13, R: 34, zoom: 1, tgt: new T.Vector3(-1.5, 15.5, 3.5), g: { az: 0.5, pol: 1.13, R: 34, zoom: 1, tgt: new T.Vector3(-1.5, 15.5, 3.5) }, ox: 0, oy: 0, gox: 0, goy: 0, fw: 1, fh: 1, gfw: 1, gfh: 1 });
  A.setCamView = function (name, snap) {
    const v = VIEWS[name]; orb.g.az = v.az; orb.g.pol = v.pol; orb.g.R = v.R; orb.g.zoom = 1; orb.g.tgt.set(v.tgt[0], v.tgt[1], v.tgt[2]);
    if (snap) { orb.az = v.az; orb.pol = v.pol; orb.R = v.R; orb.zoom = 1; orb.tgt.copy(orb.g.tgt); }
  };
  function updateCamera(dt) {
    const k = 1 - Math.exp(-6 * dt), g = orb.g;
    orb.az += (g.az - orb.az) * k; orb.pol += (g.pol - orb.pol) * k; orb.R += (g.R - orb.R) * k; orb.zoom += (g.zoom - orb.zoom) * k;
    orb.tgt.lerp(g.tgt, k); orb.ox += (orb.gox - orb.ox) * k; orb.oy += (orb.goy - orb.oy) * k; orb.fw += (orb.gfw - orb.fw) * k; orb.fh += (orb.gfh - orb.fh) * k;
    const tanV = Math.tan((camera.fov * Math.PI) / 360);
    const half = Math.max(0.05, Math.min(Math.atan(tanV * orb.fh), Math.atan(tanV * orb.fw)));
    const d = (orb.R / Math.sin(half)) * orb.zoom, sp = Math.sin(orb.pol);
    camera.position.set(orb.tgt.x + d * sp * Math.sin(orb.az), orb.tgt.y + d * Math.cos(orb.pol), orb.tgt.z + d * sp * Math.cos(orb.az));
    camera.lookAt(orb.tgt);
    camera.setViewOffset(W, H, Math.round(orb.ox), Math.round(orb.oy), W, H);
  }

  /* ---------- picking and highlight ---------- */
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  function setRay(x, y) { ndc.set((x / W) * 2 - 1, -(y / H) * 2 + 1); ray.setFromCamera(ndc, camera); }
  function shown(o) { for (; o; o = o.parent) if (!o.visible) return false; return true; }
  function pick(x, y) {
    setRay(x, y);
    const hits = ray.intersectObjects(M.pickables, false);
    let cov = null;
    for (const h of hits) {
      if (!shown(h.object)) continue;
      const id = h.object.userData.part;
      if (id === 'cover') { cov = cov || h; continue; }
      return { part: id, slide: h.object.userData.slide, point: h.point, object: h.object };
    }
    return cov ? { part: 'cover', point: cov.point, object: cov.object } : null;
  }
  const partKey = (id) => { const n = M.parts[id]; return (n && n.userData.alias) || id; };
  let hl = null;
  const hlMat = new Map();
  A.highlight = function (id, sticky) {
    A.unhighlight();
    if (!id) return;
    const list = [];
    for (const mesh of M.pickables) {
      if (partKey(mesh.userData.part) !== id) continue;
      if (id === 'slide') continue;
      const m = mesh.material;
      if (m === M.mats.matte || m === M.mats.metal || m === M.mats.metalPlain) {
        let c = hlMat.get(m); if (!c) { c = m.clone(); c.emissive = new T.Color(0xff8a1e); hlMat.set(m, c); }
        list.push({ mesh, orig: m }); mesh.material = c;
      } else if (m === M.mats.cover) { list.push({ mesh, orig: m, op: m.opacity }); }
    }
    hl = { id, list, t: 0, sticky };
  };
  A.unhighlight = function () {
    if (!hl) return;
    for (const e of hl.list) { e.mesh.material = e.orig; if (e.op !== undefined) e.orig.opacity = e.op; }
    hl = null;
  };
  function updateHighlight(dt) {
    if (!hl) return;
    hl.t += dt;
    const p = 0.35 + 0.3 * Math.sin(hl.t * 7);
    hlMat.forEach((c) => { c.emissiveIntensity = p; });
    for (const e of hl.list) if (e.op !== undefined) e.orig.opacity = e.op + 0.12 * (0.5 + 0.5 * Math.sin(hl.t * 7));
    if (!hl.sticky && hl.t > 3.2) A.unhighlight();
  }

  /* ---------- the name card ---------- */
  const tip = $('#tip'); let tipTimer = 0;
  A.showTip = function (id, x, y) {
    SS.need('info').then((info) => {
      const e = info[id]; if (!e) return;
      tip.firstChild.textContent = e[0]; tip.lastChild.textContent = e[1];
      const tw = Math.min(260, W - 24);
      tip.style.left = U.clamp(x + 16, 12, W - tw - 12) + 'px';
      tip.style.top = U.clamp(y - 78, 12, H - 150) + 'px';
      tip.classList.add('show'); clearTimeout(tipTimer);
      tipTimer = setTimeout(() => tip.classList.remove('show'), 3400);
    });
  };

  /* ---------- pointer input on the 3D view ---------- */
  const ptrs = new Map(); let ges = null;
  const STAGE_PARTS = { xStage: 1, yStage: 1, clip: 1, xRail: 1 };
  const _v = new T.Vector3(), _v2 = new T.Vector3(), _pl = new T.Plane(), _q = new T.Quaternion();
  function toScreen(v, out) { _v2.copy(v).project(camera); out.x = (_v2.x * 0.5 + 0.5) * W; out.y = (-_v2.y * 0.5 + 0.5) * H; return out; }
  A.toScreen = toScreen;
  const _s0 = { x: 0, y: 0 }, _s1 = { x: 0, y: 0 }, _s2 = { x: 0, y: 0 };
  function rackNear(i, x, y) {
    mech.rackWorld(i, _v, _q); toScreen(_v, _s0);
    return 1 - U.clamp(Math.hypot(x - _s0.x, y - _s0.y) / (0.34 * Math.min(W, H)), 0, 1);
  }
  function onDown(e) {
    try { $('#gl').setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointers cannot be captured */ }
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    SS.emit('user');
    if (ptrs.size === 1) {
      ges = { type: 'pending', id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now(), hit: pick(e.clientX, e.clientY) };
    } else if (ptrs.size === 2 && ges && ges.type !== 'slide') {
      if (ges.type === 'jog') S.nudge.held = false;
      const p = [...ptrs.values()];
      ges = { type: 'pinch', d0: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1, z0: orb.g.zoom };
    }
  }
  function onMove(e) {
    const p = ptrs.get(e.pointerId); if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
    if (!ges) return;
    if (ges.type === 'pinch') {
      const q = [...ptrs.values()]; if (q.length < 2) return;
      orb.g.zoom = U.clamp((ges.z0 * ges.d0) / (Math.hypot(q[0].x - q[1].x, q[0].y - q[1].y) || 1), 0.3, 1.5);
      assist = false;
      return;
    }
    if (e.pointerId !== ges.id) return;
    if (ges.type === 'pending') {
      if (Math.hypot(e.clientX - ges.x0, e.clientY - ges.y0) < 7) return;
      const h = ges.hit;
      if (h && h.slide !== undefined && mech.dragStart(h.slide)) {
        ges.type = 'slide'; ges.slide = h.slide;
        camera.getWorldDirection(_v); _pl.setFromNormalAndCoplanarPoint(_v, h.point);
        A.highlight('rack', true); SS.emit('drag:start');
      } else if (h && (STAGE_PARTS[h.part] || (h.part === 'slide' && S.slides[h.slide].where === 'stage'))) {
        ges.type = 'jog'; S.nudge.held = true;
      } else ges.type = 'orbit';
    }
    if (ges.type === 'orbit') {
      assist = false;
      orb.g.az -= dx * 0.0055; orb.g.pol = U.clamp(orb.g.pol - dy * 0.0045, 0.12, 1.52);
    } else if (ges.type === 'slide') {
      setRay(e.clientX, e.clientY);
      if (ray.ray.intersectPlane(_pl, _v)) { _v.y = Math.max(_v.y, 1.5); ges.near = rackNear(ges.slide, e.clientX, e.clientY); mech.dragTo(ges.slide, _v, ges.near); }
    } else if (ges.type === 'jog') {
      // turn the finger movement into stage millimetres using the on-screen directions of X and Z
      _v.set(C.OX, 14, 0); toScreen(_v, _s0); _v.x += 1; toScreen(_v, _s1); _v.x -= 1; _v.z += 1; toScreen(_v, _s2);
      const ax = _s1.x - _s0.x, ay = _s1.y - _s0.y, bx = _s2.x - _s0.x, by = _s2.y - _s0.y, det = ax * by - ay * bx;
      if (Math.abs(det) > 4) mech.jogBy(((dx * by - dy * bx) / det) * 10, ((ax * dy - ay * dx) / det) * 10);
      else mech.jogBy((dx / (Math.hypot(ax, ay) || 1)) * 10 * Math.sign(ax || 1), 0);
    }
  }
  function onUp(e) {
    const had = ptrs.delete(e.pointerId);
    if (!had || !ges) return;
    if (ges.type === 'pinch') { if (ptrs.size < 2) ges = null; return; }
    if (e.pointerId !== ges.id) return;
    if (ges.type === 'pending' && performance.now() - ges.t0 < 500 && e.type !== 'pointercancel') tap(ges.hit, e.clientX, e.clientY);
    else if (ges.type === 'slide') { mech.dragEnd(ges.slide, (ges.near || 0) > 0.6 && e.type !== 'pointercancel'); A.unhighlight(); SS.emit('drag:end'); }
    else if (ges.type === 'jog') S.nudge.held = false;
    ges = null;
  }
  function tap(h, x, y) {
    if (!h) { tip.classList.remove('show'); A.unhighlight(); return; }
    let id = partKey(h.part);
    if (h.slide !== undefined) {
      const s = S.slides[h.slide];
      if (s.where === 'table') mech.flip(h.slide);
      else if (s.where === 'stage' && (S.busy === 'scan' || S.busy === 'stitch')) knock();
    } else if (STAGE_PARTS[id] && (S.busy === 'scan' || S.busy === 'stitch')) knock();
    else if (/^obj\d$/.test(id) || id === 'turret') mech.turretStep(1);
    A.highlight(id); A.showTip(id, x, y); SS.emit('tap', id);
  }
  function knock() { const a = Math.random() * 6.283; mech.poke(Math.cos(a) * 55, Math.sin(a) * 55); }

  // while a slide is being loaded the camera leans towards the loader, unless the user is steering
  let assist = false;
  SS.on('slide:racked', () => { if (S.view !== 'real') return; assist = true; orb.g.az = 0.38; orb.g.pol = 1.0; orb.g.zoom = 0.66; orb.g.tgt.set(5.5, 14.5, 3.5); });
  SS.on('loaded', () => { if (assist && S.view === 'real') A.setCamView('real'); assist = false; });
  SS.on('view', () => { assist = false; });

  /* ---------- steps and views ---------- */
  const stepBtns = {}, viewBtns = {};
  function nope(name, next) {
    const b = stepBtns[name]; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
    SS.emit('nope'); if (next) A.suggest(next);
  }
  A.suggest = function (name) { for (const k in stepBtns) stepBtns[k].classList.toggle('next', k === name); A.suggested = name; };
  A.setStep = function (name) {
    if (name === 'load') { if (S.want >= 0 || S.stageSlide >= 0) mech.eject(); SS.dropScan(); }
    else if (S.want < 0) return nope(name, 'load');
    else if (name === 'view' && !(S.scan && S.scan.done)) return nope(name, 'scan');
    if (name === 'focus' && (S.busy === 'scan' || S.busy === 'stitch')) mech.cancelJob();
    S.step = name;
    for (const k in stepBtns) stepBtns[k].classList.toggle('on', k === name);
    layout(); SS.emit('step', name);
    if (name === 'scan') SS.need('scan').then((sc) => sc.start());
    refreshHint();
  };
  A.setView = function (name) {
    if (S.view === name) { A.setCamView(name); return; }
    const prev = S.view; S.view = name;
    for (const k in viewBtns) viewBtns[k].classList.toggle('on', k === name);
    A.setCamView(name);
    SS.emit('view', name, prev);
    layout();
  };
  // which step button should invite the user
  function refreshHint() {
    let n = '';
    if (S.want < 0) n = 'load';
    else if (S.busy === 'load' || S.busy === 'unload') n = '';
    else if (S.scan && S.scan.done) n = S.step === 'view' ? '' : 'view';
    else if (S.busy === 'scan' || S.busy === 'stitch' || S.busy === 'af') n = '';
    else if (!S.focus.ok) n = S.step === 'focus' ? '' : 'focus';
    else n = 'scan';
    if (n === S.step && n !== 'scan') n = '';
    if (n === 'scan' && S.step === 'scan' && S.busy !== '') n = '';
    A.suggest(n);
  }
  ['busy', 'loaded', 'unloaded', 'focus:done', 'scan:done', 'scan:clear', 'slide:racked'].forEach((ev) => SS.on(ev, refreshHint));
  // forget a scan and give its tile bitmaps back at once (Safari keeps canvas memory until told)
  SS.dropScan = function () {
    if (S.scan) S.scan.tiles.forEach((t) => { t.cv.width = t.cv.height = 0; t.g = t.g2 = null; });
    S.scan = null; SS.emit('scan:clear');
  };
  SS.on('loaded', SS.dropScan);
  // an end stop was reached: show which switch stopped the stage
  let limT = 0;
  SS.on('limit', (id) => { const n = performance.now(); if (n - limT > 500) { limT = n; A.highlight(id); } });

  /* ---------- layout: the monitor panel and the free area left for the 3D view ---------- */
  const panel = $('#panel');
  const els = { screen: $('#screen'), live: $('#live'), graph: $('#graph'), dial: $('#dial'), auto: $('#auto'), lens: $('#lens') };
  function place(el, x, y, w, h) {
    const st = el.style; st.left = x + 'px'; st.top = y + 'px'; st.width = w + 'px'; st.height = h + 'px'; st.display = w > 0 ? 'block' : 'none';
    if (el.tagName === 'CANVAS') {
      const bw = Math.max(1, Math.round(w * SS.dpr)), bh = Math.max(1, Math.round(h * SS.dpr));
      if (el.width !== bw || el.height !== bh) { el.width = bw; el.height = bh; }
    }
  }
  function layout() {
    W = window.innerWidth; H = window.innerHeight;
    const st = S.step, land = W >= H * 1.02, bottom = 80, P = 10, G = 8;
    let free = { x: 0, y: 0, w: W, h: H - bottom };
    if (st === 'load') panel.classList.add('hide');
    else {
      panel.classList.remove('hide');
      const D = Math.round(U.clamp(Math.min(W, H) * 0.15, 96, 124)); // dial and small live size
      let pw, ph, px, py;
      if (st === 'focus') {
        if (land) {
          const w = Math.round(U.clamp(Math.min(W * 0.3, H - bottom - D - 70), 140, 360));
          pw = w + 2 * P; ph = P + w + G + D + P; px = W - pw - 12; py = Math.max(12, (H - bottom - ph) / 2);
          place(els.screen, 0, 0, 0, 0); place(els.live, P, P, w, w);
          place(els.graph, P, P + w + G, w - D - G, D - 48); place(els.auto, P, P + w + G + D - 40, 0, 0);
          place(els.dial, P + w - D, P + w + G, D, D);
          btnRow(P, P + w + G + D - 40, w - D - G);
        } else {
          const L = Math.round(Math.min((W - 24 - 2 * P) * 0.52, H * 0.3));
          pw = W - 24; ph = L + 2 * P; px = 12; py = H - bottom - ph;
          const rw = pw - 2 * P - L - G;
          place(els.screen, 0, 0, 0, 0); place(els.live, P, P, L, L);
          place(els.graph, P + L + G, P, rw, Math.max(40, L - D - G));
          place(els.dial, P + L + G + rw - D, P + L - D, D, D);
          btnRow(P + L + G, P + L - 40, rw - D - G);
        }
      } else {
        const big = st === 'view';
        if (land) {
          const maxH = H - bottom - 24 - D - G - 2 * P;
          const w = Math.round(Math.min(W * (big ? 0.58 : 0.46) - 2 * P, maxH * 1.5));
          pw = w + 2 * P; const sh = Math.round((w * 2) / 3); ph = P + sh + G + D + P; px = W - pw - 12; py = Math.max(12, (H - bottom - ph) / 2);
          place(els.screen, P, P, w, sh); rowBelow(P, P + sh + G, w, D);
        } else {
          pw = W - 24; const w = pw - 2 * P, sh = Math.round(Math.min((w * 2) / 3, H * (big ? 0.42 : 0.34)));
          ph = P + sh + G + D + P; px = 12; py = H - bottom - ph;
          place(els.screen, P, P, w, sh); rowBelow(P, P + sh + G, w, D);
        }
      }
      panel.style.left = px + 'px'; panel.style.top = py + 'px'; panel.style.width = pw + 'px'; panel.style.height = ph + 'px';
      free = land ? { x: 0, y: 0, w: px, h: H - bottom } : { x: 0, y: 0, w: W, h: py };
    }
    A.free = free; A.landscape = land;
    // the lamp slider sits beside the 3D view, not over the monitor
    const lb = $('#light'), lh = Math.min(210, Math.max(150, free.h - 150));
    lb.style.height = lh + 'px'; lb.style.top = Math.max(124 + lh * 0.4, free.y + free.h * 0.52) + 'px';
    orb.gox = W / 2 - (free.x + free.w / 2); orb.goy = H / 2 - (free.y + free.h / 2 + 12);
    orb.gfw = free.w / H; orb.gfh = (free.h - 24) / H;
    if (renderer) {
      renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
      const fx = $('#fx'); fx.width = Math.round(W * SS.dpr); fx.height = Math.round(H * SS.dpr);
    }
    SS.emit('layout');
  }
  function rowBelow(x, y, w, D) {
    place(els.live, x, y, D, D);
    place(els.dial, x + w - D, y, D, D);
    place(els.graph, x + D + G8, y, w - 2 * D - 2 * G8, D - 48);
    btnRow(x + D + G8, y + D - 40, w - 2 * D - 2 * G8);
  }
  const G8 = 8;
  function btnRow(x, y, w) {
    if (w < 118) { place(els.auto, x, y, Math.max(52, Math.min(84, w)), 40); place(els.lens, 0, 0, 0, 0); return; } // no room: the turret can still be tapped
    const aw = Math.min(84, Math.max(60, w * 0.5 - 4));
    place(els.auto, x, y, aw, 40); place(els.lens, x + aw + 6, y, Math.min(64, Math.max(50, w - aw - 6)), 40);
  }
  A.layout = layout;

  /* ---------- light slider ---------- */
  function initLight() {
    const box = $('#light'), knob = box.querySelector('.knob');
    const T0 = 46, B0 = 18, LO = 0.12, HI = 1.5;
    const show = () => { const h = box.clientHeight - T0 - B0; knob.style.top = T0 + (1 - (S.lamp.set - LO) / (HI - LO)) * h + 'px'; };
    const setFrom = (e) => {
      const r = box.getBoundingClientRect(), h = r.height - T0 - B0;
      S.lamp.set = U.clamp(HI - ((e.clientY - r.top - T0) / h) * (HI - LO), LO, HI);
      if (!(S.busy === 'scan' || S.busy === 'stitch')) S.lamp.ref = S.lamp.set;
      show(); SS.emit('user');
    };
    box.addEventListener('pointerdown', (e) => { try { box.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } S.lamp.held = true; setFrom(e); });
    box.addEventListener('pointermove', (e) => { if (S.lamp.held) setFrom(e); });
    const up = () => { S.lamp.held = false; };
    box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
    SS.on('lamp', show); SS.on('layout', show); show();
  }

  /* ---------- the hint hand: shows "drag a slide to the rack" until someone does it ---------- */
  function initHand() {
    const hand = $('#hand'); let t = 0, idle = 0, done = false;
    SS.on('user', () => { idle = 0; });
    SS.on('slide:racked', () => { done = true; });
    SS.on('step', (n) => { if (n === 'load') done = false; });
    A.updateHand = function (dt) {
      idle += dt;
      const on = !done && S.step === 'load' && S.want < 0 && idle > 2.2 && !ges && S.slides[0].where === 'table';
      if (!on) { if (hand.style.opacity !== '0') hand.style.opacity = '0'; t = 0; return; }
      t = (t + dt / 2.4) % 1;
      const k = U.smooth((t - 0.15) / 0.6);
      toScreen(M.slides[0].root.position, _s1); mech.rackWorld(0, _v, _q); toScreen(_v, _s2);
      hand.style.left = U.lerp(_s1.x, _s2.x, k) + 'px'; hand.style.top = U.lerp(_s1.y, _s2.y, k) - Math.sin(k * Math.PI) * 40 + 'px';
      hand.style.opacity = t < 0.08 ? t / 0.08 : t > 0.88 ? (1 - t) / 0.12 : 1;
    };
  }

  /* ---------- environment for metal reflections: a tiny procedural studio ---------- */
  function makeEnv() {
    const es = new T.Scene(), geos = [], mats = [];
    const add = (g, color, x, y, z, rx, ry) => {
      const m = new T.MeshBasicMaterial({ color, side: T.DoubleSide }); const o = new T.Mesh(g, m);
      o.position.set(x, y, z); o.rotation.set(rx || 0, ry || 0, 0); es.add(o); geos.push(g); mats.push(m);
    };
    add(new T.BoxGeometry(24, 14, 24), 0x9aa5b2, 0, 0, 0);
    add(new T.PlaneGeometry(13, 13), new T.Color(5.5, 5.5, 5.5), 0, 6.9, 0, Math.PI / 2, 0);
    add(new T.PlaneGeometry(7, 6), new T.Color(3.2, 3.4, 3.8), -11.9, 1, 2, 0, Math.PI / 2);
    add(new T.PlaneGeometry(6, 5), new T.Color(2.8, 2.6, 2.3), 11.9, 0.5, -3, 0, Math.PI / 2);
    add(new T.PlaneGeometry(9, 4), new T.Color(2.2, 2.2, 2.2), 0, 1.5, 11.9, 0, 0);
    add(new T.PlaneGeometry(24, 24), 0x5a626e, 0, -6.9, 0, Math.PI / 2, 0);
    const pm = new T.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(es, 0.03, 0.1, 100, { size: 128 }).texture; // small: reflections here are soft anyway
    pm.dispose(); geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose());
  }

  /* ---------- boot ---------- */
  function boot() {
    const canvas = $('#gl');
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', stencil: false });
    } catch (e) {
      $('#splash').innerHTML = '<p style="font-size:18px">WebGL がつかえません</p>'; return;
    }
    renderer.setPixelRatio(SS.dpr);
    A.renderer = renderer;
    scene = A.scene = new T.Scene(); scene.background = new T.Color(0xdfe6ec);
    camera = A.camera = new T.PerspectiveCamera(30, 1, 6, 600);
    A.hemi = new T.HemisphereLight(0xffffff, 0x8f99a6, 0.5); scene.add(A.hemi);
    A.sun = new T.DirectionalLight(0xffffff, 1.25); A.sun.position.set(22, 60, 38); scene.add(A.sun);
    makeEnv(); scene.environmentIntensity = 0.7;
    M = SS.build(scene); mech.init(M);

    document.querySelectorAll('#steps button').forEach((b) => { stepBtns[b.dataset.step] = b; b.addEventListener('click', () => { SS.emit('user'); SS.emit('ui'); A.setStep(b.dataset.step); }); });
    document.querySelectorAll('#views button').forEach((b) => { viewBtns[b.dataset.view] = b; b.addEventListener('click', () => { SS.emit('user'); SS.emit('ui'); A.setView(b.dataset.view); }); });
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); orb.g.zoom = U.clamp(orb.g.zoom * Math.exp(e.deltaY * 0.0012), 0.3, 1.5); }, { passive: false });
    ['gesturestart', 'gesturechange', 'contextmenu', 'dblclick'].forEach((n) => document.addEventListener(n, (e) => e.preventDefault(), { passive: false }));
    window.addEventListener('resize', layout); window.addEventListener('orientationchange', () => setTimeout(layout, 250));
    initLight(); initHand();
    A.setCamView('real', true); layout();
    orb.ox = orb.gox; orb.oy = orb.goy; orb.fw = orb.gfw; orb.fh = orb.gfh;
    A.suggest('load');

    let last = performance.now(), first = true;
    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      const raw = Math.min(0.05, (now - last) / 1000); last = now;
      const n = Math.max(1, Math.ceil(SS.sim.scale)), dt = (raw * SS.sim.scale) / n;
      for (let i = 0; i < n; i++) { SS.sim.time += dt; mech.update(dt); SS.sim.pump(); if (SS.late) SS.late.tick(dt); }
      updateCamera(raw); updateHighlight(raw); A.updateHand(raw);
      if (SS.late) SS.late.frame(raw);
      renderer.render(scene, camera);
      if (first) {
        first = false; SS.perf.firstFrame = performance.now() - SS.perf.t0;
        const sp = $('#splash'); sp.style.opacity = '0'; setTimeout(() => sp.remove(), 400);
        SS.ready = true; setTimeout(loadLate, 30);
      }
    }
    SS.perf.built = performance.now() - SS.perf.t0;
    requestAnimationFrame(frame);
  }

  /* ---------- everything that is not the first scene is fetched after the first frame ---------- */
  const LATE = ['info', 'audio', 'focus', 'screen', 'scan', 'views'];
  function loadLate() {
    const mods = [];
    SS.late = {
      add: (m) => mods.push(m),
      tick: (dt) => { for (let i = 0; i < mods.length; i++) if (mods[i].tick) mods[i].tick(dt); },
      frame: (dt) => { for (let i = 0; i < mods.length; i++) if (mods[i].frame) mods[i].frame(dt); },
    };
    let k = 0;
    (function next() {
      if (k >= LATE.length) { SS.perf.late = performance.now() - SS.perf.t0; SS.lateReady = true; SS.emit('late'); return; }
      const s = document.createElement('script'); s.src = 'js/' + LATE[k++] + '.js'; s.onload = () => setTimeout(next, 0);
      s.onerror = () => { console.error('load failed: ' + s.src); setTimeout(next, 0); };
      document.head.appendChild(s);
    })();
  }

  // small hooks for the smoke test and for poking at the machine from the console
  SS.debug = {
    drop: (i) => { if (mech.dragStart(i)) mech.dragEnd(i, true); },
    pick, tap: (x, y) => tap(pick(x, y), x, y),
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
