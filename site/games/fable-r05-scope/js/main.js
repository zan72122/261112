// Application: modes, interaction, animation loop, adaptive quality and test hooks.
(function () {
  'use strict';
  const S = window.SCOPE;
  const { M, clamp, lerp, damp } = S;
  const $ = (s) => document.querySelector(s);
  const canvas = $('#gl'), tag = $('#tag'), lead = $('#lead'), hint = $('#hint');
  const query = new URLSearchParams(location.search);

  let R;
  try { R = new S.Renderer(canvas); } catch (e) { $('#fail').hidden = false; window.__failed = String(e && e.message); return; }
  const model = S.buildModel(R);
  const light = new S.LightPath(R, model);
  const orbit = new S.Orbit();
  const inset = new S.Inset($('#inset'));
  const parts = model.parts, ref = model.ref;
  for (const id in parts) { parts[id].x = 0; }
  const warmTodo = R.pendingVariants(model.items);

  const st = { mode: 'real', obj: 1, field: 0.9, aperture: 0.6, focus: 0, selected: null };
  const an = { look: 0, front: 1e9, turret: Math.PI / 2, turretV: 0, field: st.field, aperture: st.aperture, fov: 2.65, coarse: 0, fine: 0, auto: true, key: '' };

  // ---------- two looks: studio product shot / dark "light lab" ----------
  const LOOK_REAL = { exposure: 0.42, envInt: 1.0, keyCol: [4.4, 4.25, 4.0], bgTop: [0.62, 0.63, 0.65], bgBot: [1.0, 0.99, 0.97], bgGlow: [1.75, 1.73, 1.70], bloom: 0.22, bloomThreshold: 1.6, vignette: 0.35, beamThrough: 0, hiCol: [1.0, 0.55, 0.12], floorFade: [700, 2600] };
  const LOOK_BEG = { exposure: 0.55, envInt: 0.36, keyCol: [1.0, 1.08, 1.3], bgTop: [0.010, 0.014, 0.032], bgBot: [0.028, 0.036, 0.07], bgGlow: [0.075, 0.095, 0.18], bloom: 0.95, bloomThreshold: 0.85, vignette: 0.55, beamThrough: 0.36, hiCol: [1.0, 0.45, 0.72], floorFade: [230, 1050] };
  const look = { xrayCol: [0.30, 0.58, 1.0], shadows: true };
  const FLOOR_REAL = model.MAT.floor.color.slice(), FLOOR_BEG = S.hex('#262b3a');
  function mixLook(t) {
    model.MAT.floor.color = FLOOR_REAL.map((v, i) => lerp(v, FLOOR_BEG[i], t));
    for (const k in LOOK_REAL) {
      const a = LOOK_REAL[k], b = LOOK_BEG[k];
      look[k] = Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], t)) : lerp(a, b, t);
    }
  }

  // ---------- quality: device pixel ratio up to 2 + 4x MSAA, scaled down automatically when frames are slow ----------
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const Q = { mode: query.get('q') || 'auto', scale: dpr, msaa: 4, acc: 0, n: 0, fast: 0, settle: 0 };
  if (Q.mode === 'low') { Q.scale = Math.min(dpr, 0.6); Q.msaa = 0; }
  else if (Q.mode === 'fxaa') Q.msaa = 0;                     // full resolution, FXAA instead of MSAA
  else if (Q.mode === 'auto' && R.caps.software) { Q.scale = Math.min(dpr, 0.7); Q.msaa = 0; }
  function adapt(ms) {
    if (Q.mode !== 'auto' || Q.settle-- > 0) return;
    Q.acc += ms; Q.n++;
    if (Q.n < 10) return;
    const avg = Q.acc / Q.n;
    Q.acc = 0; Q.n = 0;
    if (avg > 34) {
      Q.fast = 0;
      if (Q.msaa) Q.msaa = 0; else Q.scale = Math.max(0.42, Q.scale * (avg > 60 ? 0.78 : 0.9));
      Q.settle = 4;
    } else if (avg < 15) {
      if (++Q.fast >= 3) { Q.fast = 0; Q.settle = 4; if (Q.scale < dpr) Q.scale = Math.min(dpr, Q.scale * 1.15); else if (!Q.msaa && !R.caps.software) Q.msaa = 4; }
    } else Q.fast = 0;
  }

  // depth pre-pass (every pixel is shaded once); `?prepass=0` switches it off for comparison
  const PREPASS = query.get('prepass') !== '0';

  // ---------- parts: explode / highlight / ghost ----------
  function partBounds(p) {
    const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    for (const it of p.items) {
      const mn = it.mesh.min, mx = it.mesh.max;
      for (let c = 0; c < 8; c++) {
        const w = M.point(it.node.world, [c & 1 ? mx[0] : mn[0], c & 2 ? mx[1] : mn[1], c & 4 ? mx[2] : mn[2]]);
        for (let a = 0; a < 3; a++) { if (w[a] < lo[a]) lo[a] = w[a]; if (w[a] > hi[a]) hi[a] = w[a]; }
      }
    }
    const c = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
    return { c, r: Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / 2 };
  }
  const f2 = (v, d) => v.toFixed(d === undefined ? 2 : d);
  function liveText(id) {
    const op = light.op || S.optics.compute(st), p = parts[id];
    if (p.objective !== undefined) { const o = S.OBJECTIVES[p.objective]; return `${o.mag}× / NA ${f2(o.na)}　作動距離 ${o.wd} mm　視野 φ${f2(S.optics.FN / o.mag)} mm`; }
    switch (id) {
      case 'field': return `開き ${Math.round(st.field * 100)}%　照らす範囲 φ${f2(op.fieldDia, 1)} mm`;
      case 'aperture': return `開き ${Math.round(st.aperture * 100)}%　光の円すい 半角 ${f2(op.coneDeg, 1)}°（NA ${f2(op.naEff)}）`;
      case 'condenser': return `照明の開口数 NA ${f2(op.naCond)}（開口絞りで変化）`;
      case 'eyepiece': return `総合倍率 ${op.total}×　見える範囲 φ${f2(op.fov)} mm`;
      case 'camera': case 'camport': return `写る範囲 ${f2(op.camW)} × ${f2(op.camH)} mm（センサー 13.2 × 8.8 mm）`;
      case 'coarse': case 'fine': return `ピントのずれ ${Math.abs(st.focus) < 0.1 ? f2(st.focus * 1000, 0) + ' µm' : f2(st.focus) + ' mm'}　焦点深度 ${f2(op.dof, 1)} µm`;
      case 'nosepiece': return `いまの対物レンズ ${op.mag}×（NA ${f2(op.na)}）`;
      case 'slide': return `目盛り 1 mm / 0.1 mm / 0.01 mm`;
      case 'stage': return `ステージ上面の高さ ${f2(190 + st.focus, 2)} mm`;
      default: return '';
    }
  }
  function showTag() {
    const id = st.selected;
    if (!id) { tag.classList.remove('on'); lead.classList.remove('on'); return; }
    const p = parts[id];
    const title = p.objective !== undefined ? `対物レンズ ${S.OBJECTIVES[p.objective].mag}×` : p.ja;
    const live = liveText(id);
    const html = `<h2>${title}</h2><div class="en">${p.en || ''}</div><p>${p.desc || ''}</p>${live ? `<div class="live">${live}</div>` : ''}`;
    if (html !== tag._html) { tag.innerHTML = html; tag._html = html; }
    tag.classList.add('on'); lead.classList.add('on');
  }
  function select(id) {
    if (id && !parts[id]) id = null;
    st.selected = id;
    an.auto = false;
    if (id) {
      const b = partBounds(parts[id]);
      orbit.goal.target = [lerp(orbit.homeTarget[0], b.c[0], 0.8), lerp(orbit.homeTarget[1], b.c[1], 0.8), lerp(orbit.homeTarget[2], b.c[2], 0.8)];
      orbit.goal.dist = clamp(orbit.goal.dist, b.r * 4.5 + 150, Math.max(b.r * 7 + 420, 560) * Math.max(1, 0.9 / orbit.aspect));
    } else orbit.goal.target = orbit.homeTarget.slice();
    showTag();
    wake(30);
  }
  function setObjective(k) {
    k = ((k % 4) + 4) % 4;
    if (k !== st.obj) { st.obj = k; an.auto = false; }
    document.querySelectorAll('#dock .objs button').forEach((b) => b.classList.toggle('on', +b.dataset.obj === st.obj));
    showTag(); wake(30);
  }
  function setMode(m) {
    if (m !== 'real' && m !== 'beginner') return;
    if (m === 'beginner' && st.mode !== 'beginner') { an.front = 0; flash('光の通り道が光ります。部品をクリックすると名前とはたらきが出ます'); }
    st.mode = m;
    document.body.className = 'mode-' + m;
    document.querySelectorAll('#pill [data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    wake(30);
  }
  let hintTimer = 0;
  function flash(text, ms) { hint.textContent = text; hint.classList.add('on'); clearTimeout(hintTimer); hintTimer = setTimeout(() => hint.classList.remove('on'), ms || 6500); }

  // ---------- picking ----------
  function pickAt(cx, cy) {
    const r = canvas.getBoundingClientRect();
    const ray = S.rayFromNdc(cam.viewProj, ((cx - r.left) / r.width) * 2 - 1, 1 - ((cy - r.top) / r.height) * 2);
    const hit = S.raycast(model.items, ray);
    if (!hit) return null;
    if (an.look > 0.5 && parts[hit.item.part].x > 0.5) {         // ghosted shell: let the optics inside win
      const inner = S.raycast(model.items, ray, (it) => it.inner);
      if (inner) return inner.item.part;
    }
    return hit.item.part;
  }
  function click(cx, cy) {
    const id = pickAt(cx, cy);
    if (!id) return select(null);
    const p = parts[id];
    if (p.objective !== undefined) setObjective(p.objective);
    else if (id === 'nosepiece') setObjective(st.obj + 1);
    select(id);
  }

  // ---------- pointer / wheel / keys ----------
  const ptrs = new Map();
  let drag = null, pinch = 0, hoverT = 0;
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    an.auto = false;
    if (ptrs.size === 1) {
      const id = e.button === 0 ? pickAt(e.clientX, e.clientY) : null;
      const mode = e.button === 2 || e.shiftKey ? 'pan' : id === 'coarse' || id === 'fine' ? id : 'orbit';
      drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, mode, moved: 0, t: performance.now() };
    } else { drag = null; pinch = 0; }
    canvas.classList.add('drag'); wake(10);
  });
  canvas.addEventListener('pointermove', (e) => {
    const p = ptrs.get(e.pointerId);
    if (!p) {
      const now = performance.now();
      if (now - hoverT > 90) { hoverT = now; canvas.classList.toggle('over', !!pickAt(e.clientX, e.clientY)); }
      return;
    }
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) orbit.zoom(pinch / d);
      pinch = d;
      orbit.pan(dx * 0.5, dy * 0.5, canvas.clientHeight);
    } else if (drag) {
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved < 5) { wake(4); return; }
      if (drag.mode === 'orbit') orbit.rotate(dx, dy);
      else if (drag.mode === 'pan') orbit.pan(dx, dy, canvas.clientHeight);
      else {
        const before = st.focus;
        st.focus = clamp(st.focus - dy * (drag.mode === 'coarse' ? 0.03 : 0.0004), -6, 0.45);
        an[drag.mode] += ((st.focus - before) / (drag.mode === 'coarse' ? 3.6 : 0.1)) * Math.PI * 2;
        if (st.selected !== drag.mode) select(drag.mode); else showTag();
      }
    }
    wake(10);
  });
  const up = (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    pinch = 0;
    if (drag && ptrs.size === 0) {
      if (drag.moved < 5 && performance.now() - drag.t < 600 && drag.mode !== 'pan') click(drag.sx, drag.sy);
      drag = null;
    }
    if (ptrs.size === 0) canvas.classList.remove('drag');
    wake(10);
  };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); an.auto = false; orbit.zoom(Math.exp(clamp(e.deltaY, -240, 240) * 0.0014)); wake(10); }, { passive: false });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('dblclick', () => { if (!st.selected) { orbit.home(); wake(30); } });
  function fullscreen() {
    const d = document, el = d.documentElement;
    try {
      const pr = d.fullscreenElement ? d.exitFullscreen() : el.requestFullscreen ? el.requestFullscreen() : null;
      if (pr && pr.catch) pr.catch(() => {});
    } catch (err) { /* fullscreen is optional */ }
  }
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k >= '1' && k <= '4') setObjective(+k - 1);
    else if (k === 'b') setMode(st.mode === 'real' ? 'beginner' : 'real');
    else if (k === 'f') fullscreen();
    else if (k === 'escape') select(null);
    else if (k === 'r') { st.focus = 0; orbit.home(); select(null); }
    else if (k === 'arrowleft') orbit.rotate(60, 0);
    else if (k === 'arrowright') orbit.rotate(-60, 0);
    else if (k === 'arrowup') orbit.rotate(0, 40);
    else if (k === 'arrowdown') orbit.rotate(0, -40);
    else return;
    an.auto = false; wake(30);
  });
  document.querySelectorAll('#pill [data-mode]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('#fs').addEventListener('click', fullscreen);
  document.querySelectorAll('#dock .objs button').forEach((b) => b.addEventListener('click', () => setObjective(+b.dataset.obj)));
  $('#fd').addEventListener('input', (e) => { st.field = e.target.value / 100; an.auto = false; if (st.selected !== 'field') select('field'); else showTag(); wake(20); });
  $('#ad').addEventListener('input', (e) => { st.aperture = e.target.value / 100; an.auto = false; if (st.selected !== 'aperture') select('aperture'); else showTag(); wake(20); });
  window.addEventListener('resize', () => wake(10));

  // ---------- frame loop ----------
  let cam = null, last = 0, awake = 30, frames = 0, lastRender = 0, wasRendered = false;
  const dts = [];
  function wake(n) { awake = Math.max(awake, n); }
  const near = (obj, key, goal, rate, dt, eps) => {
    const v = damp(obj[key], goal, rate, dt);
    if (Math.abs(v - goal) < (eps || 1e-3)) { const ch = obj[key] !== goal; obj[key] = goal; return ch; }
    obj[key] = v;
    return true;
  };
  function placeTag() {
    if (!st.selected) return;
    const b = partBounds(parts[st.selected]);
    const p = M.point(cam.viewProj, b.c), w = innerWidth, h = innerHeight;
    const x = (p[0] * 0.5 + 0.5) * w, y = (1 - (p[1] * 0.5 + 0.5)) * h;
    const tw = tag.offsetWidth, th = tag.offsetHeight;
    const right = x < w * 0.56;
    let tx = right ? x + 84 : x - 84 - tw;
    tx = clamp(tx, 12, w - tw - 12);
    const ty = clamp(y - th - 26, 54, h - th - (st.mode === 'beginner' ? 96 : 14));
    tag.style.transform = `translate(${Math.round(tx)}px, ${Math.round(ty)}px)`;
    const ln = lead.firstElementChild, dot = lead.lastElementChild;
    const ex = clamp(x, tx, tx + tw), ey = ty + th;
    ln.setAttribute('x1', x); ln.setAttribute('y1', y); ln.setAttribute('x2', right ? Math.max(tx, ex) : Math.min(tx + tw, ex)); ln.setAttribute('y2', ey);
    dot.setAttribute('cx', x); dot.setAttribute('cy', y);
  }

  function frame(ts) {
    requestAnimationFrame(frame);
    const now = ts / 1000, dt = Math.min(0.1, Math.max(0.001, now - last));
    last = now;
    const w = innerWidth, h = innerHeight;
    if (!w || !h) return;
    orbit.aspect = w / h;
    if (frames === 0) orbit.home(true);
    let busy = false;
    const beg = st.mode === 'beginner';

    busy = near(an, 'look', beg ? 1 : 0, 3.2, dt, 2e-3) || busy;
    if (beg && an.front < light.maxLen + 80) { an.front += 340 * dt; busy = true; if (an.front >= light.maxLen + 80) an.front = 1e9; }
    // turret: lightly under-damped spring gives the click-stop feel
    let tg = (st.obj * Math.PI) / 2;
    tg += Math.round((an.turret - tg) / (Math.PI * 2)) * Math.PI * 2;
    an.turretV += ((tg - an.turret) * 150 - an.turretV * 19) * dt;
    an.turret += an.turretV * dt;
    if (Math.abs(tg - an.turret) > 4e-4 || Math.abs(an.turretV) > 4e-3) busy = true; else { an.turret = tg; an.turretV = 0; }
    ref.turret.setSpin(an.turret);
    busy = near(an, 'field', st.field, 14, dt) || busy;
    busy = near(an, 'aperture', st.aperture, 14, dt) || busy;
    ref.fieldIris.set(lerp(2.6, S.DIM.FD_R0, an.field)); ref.fieldRing.setSpin(an.field * 1.5);
    ref.apertureIris.set(lerp(1.6, S.DIM.AD_R0, an.aperture)); ref.apertureRing.setSpin(-an.aperture * 1.3);
    ref.stageGroup.setOffset(0, st.focus, 0);
    for (const n of ref.coarse) n.setSpin(n.sign * (an.coarse + an.fine * 0.02));
    for (const n of ref.fine) n.setSpin(n.sign * an.fine);

    for (const id in parts) {
      const p = parts[id], sel = st.selected === id;
      let ch = near(p, 't', sel ? 1 : 0, 7.5, dt);
      ch = near(p, 'hi', sel ? 1 : 0, 9, dt) || ch;
      // ghost shells in the beginner mode; the selected part turns solid again so it stands out
      ch = near(p, 'x', beg && p.xray && !sel && (p.objective === undefined || p.objective === st.obj) ? 1 : 0, 4.5, dt) || ch;
      busy = busy || ch;
      const e = p.t * p.t * (3 - 2 * p.t);
      for (const tp of p.tops) tp.node.setOffset(tp.ex[0] * e, tp.ex[1] * e, tp.ex[2] * e);
      const pulse = p.hi * (0.62 + 0.38 * Math.sin(now * 4.2));
      for (const it of p.items) { it.hi = pulse; it.xray = it.canXray ? p.x : 0; }
    }
    if (st.selected) busy = true;                 // highlight pulse keeps animating

    // light path + inset follow the optical state
    const state = { obj: st.obj, field: an.field, aperture: an.aperture, focus: st.focus };
    const key = `${st.obj}|${an.field.toFixed(4)}|${an.aperture.toFixed(4)}|${st.focus.toFixed(5)}`;
    const op0 = light.op;
    if (key !== an.key) { an.key = key; light.rebuild(state); for (const k in light.items) light.items[k].base = light.items[k].gain; }
    const fovMoving = near(an, 'fov', light.op.fov, 6, dt, 2e-3);
    busy = busy || fovMoving;
    if (an.look <= 0.02) an.insetOn = false;
    else if (!an.insetOn || light.op !== op0 || fovMoving || an.insetW !== w) { an.insetOn = true; an.insetW = w; inset.draw(light.op, st, an.fov); if (st.selected) showTag(); }
    light.setVisible(an.look > 0.004);
    for (const k in light.items) light.items[k].gain = (light.items[k].base || 1) * an.look;
    if (an.look > 0.02) R.setPoints(light.buf, light.particles(now, an.front, an.look)); else R.points.count = 0;

    if (an.auto && !beg) { orbit.goal.az += dt * 0.11; busy = true; }
    const moving = orbit.update(dt);
    const changed = model.root.update(false);
    if (changed) for (const it of model.items) if (it.version !== it.node.version) { it.version = it.node.version; it.world = it.node.world; it.normalMat = M.normalMatrix(it.world); it.center = M.point(it.world, it.lc); }

    const sizeChanged = R.width !== Math.max(16, Math.floor(w * Q.scale)) || R.height !== Math.max(16, Math.floor(h * Q.scale)) || R.msaa !== Math.min(Q.msaa, R.caps.msaa);
    const need = busy || moving || changed || an.look > 0.002 || awake > 0 || sizeChanged || frames < 4;
    if (awake > 0) awake--;
    if (!need) { wasRendered = false; return; }

    R.setSize(w * Q.scale, h * Q.scale, Q.msaa);
    mixLook(an.look);
    cam = orbit.matrices();
    R.render({ items: model.items, view: cam.view, proj: cam.proj, viewProj: cam.viewProj, camPos: cam.eye, camForward: cam.forward, time: now, look, shadowDirty: changed || frames < 3, beamFront: an.front, prepass: PREPASS });
    placeTag();
    if (wasRendered) { const ms = ts - lastRender; dts.push(ms); if (dts.length > 90) dts.shift(); if (frames > 20) adapt(ms); }
    wasRendered = true; lastRender = ts;
    if (warmTodo.length && frames > 3) R._pbr(warmTodo.pop(), true);     // pre-compile one ghost-shell shader per frame
    if (++frames === 3) { window.__ready = true; if (st.mode === 'real') flash('ドラッグで回転 ・ ホイールで拡大 ・ 部品をクリック'); }
  }

  mixLook(0);
  light.rebuild({ obj: st.obj, field: st.field, aperture: st.aperture, focus: 0 });
  for (const k in light.items) light.items[k].base = light.items[k].gain;
  setObjective(st.obj);
  if (location.hash === '#beginner' || query.get('mode') === 'beginner') setMode('beginner');
  requestAnimationFrame(frame);

  // ---------- hooks used by tools/verify.mjs (also handy in the console) ----------
  window.__scope = {
    state: st, anim: an, quality: Q, parts, renderer: R,
    setMode, setObjective, select, wake,
    set(o) { Object.assign(st, o); if (o.field !== undefined) $('#fd').value = o.field * 100; if (o.aperture !== undefined) $('#ad').value = o.aperture * 100; an.auto = false; showTag(); wake(30); },
    view(v) { Object.assign(orbit.goal, v.az !== undefined ? { az: (v.az * Math.PI) / 180 } : {}, v.el !== undefined ? { el: (v.el * Math.PI) / 180 } : {}, v.dist ? { dist: v.dist } : {}, v.target ? { target: v.target.slice() } : {}); if (v.snap !== false) orbit.snap(); an.auto = !!v.auto; wake(30); },
    // snap every eased animation to its end state (used by the verification so it does not depend on frame rate)
    jump() {
      const beg = st.mode === 'beginner';
      an.look = beg ? 1 : 0; an.front = 1e9; an.turret = (st.obj * Math.PI) / 2; an.turretV = 0; an.field = st.field; an.aperture = st.aperture;
      an.fov = S.optics.FN / S.OBJECTIVES[st.obj].mag; an.insetOn = false;
      for (const id in parts) { const p = parts[id], sel = st.selected === id; p.t = p.hi = sel ? 1 : 0; p.x = beg && p.xray && !sel && (p.objective === undefined || p.objective === st.obj) ? 1 : 0; }
      orbit.snap(); wake(30);
    },
    setQuality(scale, msaa) { Q.mode = 'fixed'; Q.scale = scale; Q.msaa = msaa; wake(10); },
    project(id) { const b = partBounds(parts[id]); const p = M.point(orbit.matrices().viewProj, b.c); return { x: (p[0] * 0.5 + 0.5) * innerWidth, y: (1 - (p[1] * 0.5 + 0.5)) * innerHeight, z: p[2] }; },
    projectPoint(w) { const p = M.point(orbit.matrices().viewProj, w); return { x: (p[0] * 0.5 + 0.5) * innerWidth, y: (1 - (p[1] * 0.5 + 0.5)) * innerHeight }; },
    pick(x, y) { cam = orbit.matrices(); return pickAt(x, y); },
    settled() { return !Object.values(parts).some((p) => (p.t > 0.001 && p.t < 0.999) || (p.x > 0.001 && p.x < 0.999)) && Math.abs(an.turretV) < 1e-3 && (an.look < 0.003 || an.look > 0.997) && (st.mode !== 'beginner' || an.front > 1e8); },
    stats() {
      const n = dts.length, avg = n ? dts.reduce((a, b) => a + b, 0) / n : 0;
      const sorted = dts.slice().sort((a, b) => a - b);
      return { fps: avg ? +(1000 / avg).toFixed(1) : 0, frameMs: +avg.toFixed(1), p95Ms: n ? +sorted[Math.floor(n * 0.95)].toFixed(1) : 0, samples: n, frames, draws: R.stats.draws, triangles: Math.round(R.stats.tris), size: [R.width, R.height], scale: +Q.scale.toFixed(2), msaa: R.msaa, renderer: R.caps.renderer, software: R.caps.software, parts: Object.keys(parts).length, items: model.items.length, glError: R.gl.getError() };
    },
  };
  window.__stats = window.__scope.stats;
})();
