/* Minimal monochrome UI: three small buttons (mode, sound, fullscreen), a wordless gesture hint,
   a readiness ring, the result mark, and the wiring from simulation events to sound and sparks. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;

  const ICON = {
    hand: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13.5" r="3.2"/><path d="M6.6 8.1a7.6 7.6 0 0 1 10.8 0"/><path d="M3.9 5.3a11.5 11.5 0 0 1 16.2 0"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.5a7.8 7.8 0 0 1 0 11"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
    full: '<svg viewBox="0 0 24 24"><path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15"/></svg>',
    unfull: '<svg viewBox="0 0 24 24"><path d="M9 4.5V9H4.5M19.5 9H15V4.5M15 19.5V15h4.5M4.5 15H9v4.5"/></svg>',
  };
  const MARK = {
    oo: '<svg viewBox="0 0 96 96"><circle cx="48" cy="48" r="38"/><circle cx="48" cy="48" r="22"/></svg>',
    o: '<svg viewBox="0 0 96 96"><circle cx="48" cy="48" r="36"/></svg>',
    tri: '<svg viewBox="0 0 96 96"><path d="M48 12 88 82H8z"/></svg>',
    x: '<svg viewBox="0 0 96 96"><path d="M16 16 80 80M80 16 16 80"/></svg>',
  };

  EC.setMode = function (play) {
    if (EC.state.play === play) return;
    EC.state.play = play;
    document.body.classList.toggle('play', play);
    const b = document.getElementById('bMode');
    b.classList.toggle('on', play);
    b.classList.remove('nudge');
    EC.cam.flyTo(EC.views.current());
    EC.emit('mode', play);
  };

  EC.initUI = function () {
    const A = EC.audio, W = EC.wax, sim = EC.sim;
    const bMode = document.getElementById('bMode'), bSound = document.getElementById('bSound'), bFull = document.getElementById('bFull');
    bMode.innerHTML = ICON.hand; bSound.innerHTML = ICON.sound; bFull.innerHTML = ICON.full;
    bMode.classList.add('nudge');
    function press(el, fn) {
      // blur afterwards so Space (the foot switch key) never re-triggers a focused button
      el.addEventListener('click', function (e) { e.preventDefault(); A.init(); fn(); A.click(0.5); el.blur(); });
      el.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    }
    press(bMode, function () { EC.setMode(!EC.state.play); });
    press(bSound, function () { A.setMuted(!A.muted); bSound.innerHTML = A.muted ? ICON.mute : ICON.sound; bSound.classList.toggle('on', A.muted); });
    const de = document.documentElement;
    const req = de.requestFullscreen || de.webkitRequestFullscreen, exit = document.exitFullscreen || document.webkitExitFullscreen;
    const fsOK = !!req && !!exit && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
    function isFull() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
    function toggleFull() { try { if (isFull()) exit.call(document); else { const r = req.call(de); if (r && r.catch) r.catch(function () {}); } } catch (e) { /* not allowed here */ } }
    if (!fsOK) bFull.hidden = true; else {
      press(bFull, toggleFull);
      ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (n) { document.addEventListener(n, function () { bFull.innerHTML = isFull() ? ICON.unfull : ICON.full; }); });
    }
    window.addEventListener('keydown', function (e) {
      if (e.repeat || (e.target && e.target.tagName === 'BUTTON')) return;
      if (e.code === 'KeyF' && fsOK) toggleFull();
      else if (e.code === 'KeyM') bSound.click();
      else if (e.code === 'Enter') bMode.click();
    });
    EC.on('gesture', function () { A.init(); idle = 0; });
    // iOS only unlocks audio from touchend / click handlers
    ['touchend', 'pointerup', 'click', 'keydown'].forEach(function (n) { window.addEventListener(n, function () { A.init(); }, { passive: true }); });
    EC.on('visibility', function (on) { if (A.ctx) { if (on) A.ctx.resume(); else A.ctx.suspend(); } });

    // ---------------- events -> sound and sparks ----------------
    const lim = {};
    function limited(key, gap) { const t = performance.now(); if (lim[key] && t - lim[key] < gap) return false; lim[key] = t; return true; }
    EC.on('grab', function (it) {
      if (it.kind === 'mold') A.clink(0.22, 1.25); else if (it.kind === 'forceps') A.clink(0.18, 1.9); else if (it.kind === 'cup') { A.thud(0.25); A.tick(0.6); } else A.plastic(0.35);
    });
    EC.on('land', function (it, where, v) {
      const p = it.obj.getWorldPosition(new T.Vector3());
      if (it.kind === 'mold') {
        if (where === 'cold') { A.frost(0.5 + v * 0.5); W.puff(p.x, p.y + 0.3, p.z, 6, 2.6, 0.12, 2); }
        else if (where === 'plate' || where === 'chamber' || where === 'wells') A.clink(0.35 + v * 0.5, 1);
        else { A.thud(0.3 + v * 0.3); A.clink(0.2, 1.1); }
      } else if (it.kind === 'forceps') A.clink(0.25, 1.8);
      else if (it.kind === 'chip') A.tick(0.8);
      else if (it.kind === 'cup') { A.thud(0.6); A.clink(0.2, 0.6); }
      else if (it.kind === 'block') { A.plastic(0.7); A.thud(0.25); if (where === 'cold') W.puff(p.x, p.y + 0.3, p.z, 4, 2.4, 0.1, 2); }
      else A.plastic(0.6 + v * 0.3);
    });
    EC.on('clack', function (v) { A.clack(v); });
    EC.on('pedal', function (down) { A.click(down ? 0.9 : 0.5); });
    EC.on('valve', function (open) { A.tick(open ? 1.2 : 0.8); if (open && EC.tank.level <= 0.004) A.hiss(1, 0.9); });
    EC.on('sputter', function () { if (limited('sput', 70)) A.spit(0.8); });
    EC.on('splash', function (x, y, z, vol, kind) {
      if (!limited('splash' + kind, kind === 'plate' ? 110 : 60)) return;
      if (kind === 'cold') { A.sizzle(0.8); W.puff(x, y + 0.2, z, 2, 1.2, 0.14, 2.5); } else A.splat(Math.min(1, 0.35 + vol * 2));
    });
    EC.on('overflow', function (m) { if (limited('over', 160)) { A.blub(0.8, 0.6); A.splat(0.4); } });
    let drainAcc = 0;
    EC.on('drain', function (v) { drainAcc += v; });
    EC.on('cassetteOn', function (c, m, wet) { if (wet) { A.plastic(0.6); A.squish(0.35); } else A.plastic(1); });
    EC.on('seated', function () { A.squish(0.9); A.plastic(0.7); });
    EC.on('crack', function (m) { A.crack(); const p = m.obj.position; W.puff(p.x, p.y + 1.4, p.z, 3, 1.4, 0.12, 2); });
    EC.on('pinch', function () { A.tick(1.5); });
    EC.on('nudgeStart', function () { A.blub(0.5, 1.5); });
    EC.on('chipIn', function (chip, m) { if (m.fill && m.fill.vol > 0.2) A.blub(0.7, 1.2); else A.tick(1); });
    EC.on('chipSettle', function () { A.tick(0.6); });
    EC.on('aligned', function (chip) { A.ding(); const p = chip.obj.getWorldPosition(new T.Vector3()); W.sparkle(p.x, p.y + 0.4, p.z, 8, 6); });
    EC.on('blocked', function () { A.tick(1); A.deny(); });
    EC.on('stuck', function (fc) { A.crackle(1); A.deny(); const p = fc.obj.getWorldPosition(new T.Vector3()); W.puff(p.x, p.y + 0.3, p.z, 4, 1.2, 0.16, 2); });
    EC.on('sizzle', function () { if (limited('siz', 120)) A.sizzle(0.8); });
    EC.on('needForceps', function () { A.deny(); idle = 9; });
    EC.on('dock', function (fc) { A.clink(0.3, 1.6); if (fc.blobAmt > 0.05) A.sizzle(1); });
    EC.on('unwell', function () { A.clink(0.16, 2.1); });
    EC.on('quench', function (m) { A.hiss(1, 0.9); const p = m.obj.position; W.puff(p.x, p.y + 0.2, p.z, 10, 3.2, 0.14, 2.6); });
    EC.on('slice', function () { A.slice(); });
    EC.on('pullStart', function () { A.creak(1, true); });
    EC.on('lidStop', function (name, open, v) { if (name === 'lidTank') { A.clink(0.3 + v * 0.4, 0.55); A.thud(0.3 + v * 0.4); } else { A.plastic(0.5 + v * 0.5); A.thud(0.2 + v * 0.3); } });
    EC.on('label', function () { A.whoosh(0.5); A.tick(0.5); });
    EC.on('pellet', function (b) { if (limited('pel' + b, b ? 45 : 70)) A.tick(b ? 0.55 : 0.3); });
    EC.on('plop', function () { if (limited('plop', 80)) A.blub(0.5, 1.4); });
    EC.on('melt', function () { A.sizzle(1); });
    EC.on('tick', function (v) { A.tick(v); });
    EC.on('mode', function () { A.whoosh(1); });

    // ---------------- result mark ----------------
    const mark = document.getElementById('mark');
    let markT = 0, markObj = null;
    const mpos = new T.Vector3(), scr = { x: 0, y: 0 };
    EC.on('pop', function (m, res, block) {
      if (res.empty) { A.plastic(0.8); return; }
      A.pop(res);
      A.jingle(res.mark);
      mark.innerHTML = MARK[res.mark];
      markT = 2.6; markObj = block ? block.obj : m.obj;
      const p = (block ? block.obj : m.obj).position;
      if (res.mark === 'oo' || res.mark === 'o') W.sparkle(p.x, p.y + 1, p.z, res.mark === 'oo' ? 46 : 20, 16);
      if (res.bonded && res.soft < 0.3) W.puff(p.x, p.y, p.z, 6, 2.2, 0.12, 3);
      EC.cam.kick = 1;
    });

    // ---------------- gesture hint + readiness ring ----------------
    const hint = document.getElementById('hint'), hintLine = document.getElementById('hintline');
    const ring = document.createElement('div');
    ring.id = 'ring';
    ring.style.cssText = 'position:absolute;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;opacity:0;will-change:transform,opacity;' +
      '-webkit-mask:radial-gradient(circle,transparent 11.5px,#000 12px);mask:radial-gradient(circle,transparent 11.5px,#000 12px)';
    hint.parentNode.appendChild(ring);
    let idle = 0, hintPhase = 0, sug = null, sugT = 0;
    const a2 = { x: 0, y: 0 }, b2 = { x: 0, y: 0 };

    /* The camera frames whatever the next sensible move involves. It only moves when the stage
       changes and nobody is touching the screen, so a manual view is kept until then. */
    let frameKey = '', frameWait = 0;
    const fc = new T.Vector3();
    function autoFrame(sg, busy, dt) {
      if (sg.kind === 'none' || EC.params.noauto) return;
      const q = function (v) { return Math.round(v.x / 5) + ',' + Math.round(v.z / 5); };
      const key = sg.kind + '|' + q(sg.a) + '|' + (sg.kind === 'drag' ? q(sg.b) : '');
      if (key === frameKey) { frameWait = 0; return; }
      if (busy) { frameWait = 0; return; }
      frameWait += dt * 3.4;      // called every 0.3 s
      if (frameWait < 0.5) return;
      frameKey = key; frameWait = 0;
      let x0 = sg.a.x, x1 = sg.a.x, z0 = sg.a.z, z1 = sg.a.z, y1 = sg.a.y;
      const add = function (v) { x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); z0 = Math.min(z0, v.z); z1 = Math.max(z1, v.z); y1 = Math.max(y1, v.y); };
      if (sg.kind === 'drag') add(sg.b);
      if (sim.focus) add(sim.focus.obj.position);
      const cold = sg.kind === 'wait' || sg.ready;
      const el = cold ? 0.4 : 0.68, az = cold ? 0.3 : 0.24;
      const hw = Math.max(cold ? 8.5 : 12.5, (x1 - x0) / 2 + 7);
      const hh = Math.max(cold ? 6.5 : 9, ((z1 - z0) * Math.sin(el) + Math.max(0, y1 - 12)) / 2 + 6.5);
      fc.set((x0 + x1) / 2, cold ? 13.6 : 12.4, (z0 + z1) / 2);
      EC.cam.flyTo({ target: fc.clone(), az: az, el: el, dist: EC.cam.fitDist(hw, hh) });
    }
    EC.on('mode', function () { frameKey = ''; frameWait = 0; });

    EC.updaters.push(function (dt, time) {
      const st = EC.state;
      // sound state
      const ws = W.stream, f = sim.focus && sim.focus.fill;
      let freeze = 0;
      EC.items.molds.forEach(function (m) { if (m.fill && m.fill.coolRate > 0 && m.fill.zone === 'cold') freeze += m.fill.coolRate; });
      A.frame(dt, {
        flow: ws.q, landing: ws.landing, landKind: ws.landKind, fill: f ? (f.level - EC.moldShape.floorY) / 1.3 : 0,
        scrape: sim.scrape || 0, scrapeCold: sim.scrapeCold, strain: sim.strain || 0, freeze: freeze, drain: drainAcc,
      });
      drainAcc = 0;
      // warm shimmer where the stream lands (beginner mode only)
      if (st.play && ws.landing > 0.5 && Math.random() < dt * 9) W.puff(EC.D.nozzle.x, ws.landY + 0.3, EC.D.nozzle.z, 1, 0.9, 0.07, 4);

      // result mark follows the block for a moment
      if (markT > 0) {
        markT -= dt;
        mpos.copy(markObj.position); mpos.y += 4.5;
        EC.toScreen(mpos, scr);
        const t = 2.6 - markT;
        const s = t < 0.35 ? U.easeOutBack(t / 0.35) : 1;
        mark.style.opacity = (markT < 0.5 ? markT / 0.5 : Math.min(1, t * 6)).toFixed(3);
        mark.style.transform = 'translate3d(' + scr.x.toFixed(1) + 'px,' + (scr.y - 30).toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
      } else if (mark.style.opacity !== '0') mark.style.opacity = '0';
      // a little camera jolt on a pop
      if (EC.cam.kick > 0) { EC.cam.kick = Math.max(0, EC.cam.kick - dt * 5); EC.camera.position.y += Math.sin(EC.cam.kick * 18) * 0.12 * EC.cam.kick; }

      // edge pan while something is being carried toward the rim of the screen
      let busy = false;
      EC.pointers.forEach(function (p) {
        busy = true;
        if (p.role !== 'act' || !p.act.item || !p.act.item.held) return;
        const w = window.innerWidth, h = window.innerHeight, mx = Math.min(110, w * 0.14), my = Math.min(90, h * 0.12);
        const ex = p.x < mx ? -(1 - p.x / mx) : p.x > w - mx ? 1 - (w - p.x) / mx : 0;
        const ey = p.y < my ? -(1 - p.y / my) : p.y > h - my ? 1 - (h - p.y) / my : 0;
        if (ex || ey) EC.cam.pan(-ex * 520 * dt, -ey * 380 * dt);
      });
      EC.renderer.domElement.classList.toggle('busy', busy);

      // hint
      idle = busy ? 0 : idle + dt;
      let show = false;
      if (st.play) {
        sugT -= dt;
        if (sugT <= 0 || !sug) { sug = sim.suggest(); sugT = 0.3; }
        if (sug.kind !== 'wait' && sug.kind !== 'none' && idle > (sug.ready ? 0.6 : 1.8)) show = true;
        autoFrame(sug, busy, dt);
      }
      if (show) {
        hintPhase += dt;
        const okA = EC.toScreen(sug.a, a2);
        if (sug.kind === 'drag') {
          EC.toScreen(sug.b, b2);
          const cyc = hintPhase % 2.3, t = U.sat((cyc - 0.35) / 1.25), e = U.easeInOut(t);
          let x = a2.x + (b2.x - a2.x) * e, y = a2.y + (b2.y - a2.y) * e;
          if (sug.turn) { const sw = U.sat((cyc - 1.6) / 0.6); x += Math.cos(sw * 6.283) * 12 * (sw > 0 && sw < 1 ? 1 : 0); y += Math.sin(sw * 6.283) * 12 * (sw > 0 && sw < 1 ? 1 : 0); }
          const al = Math.min(1, cyc / 0.3) * (1 - U.sat((cyc - 1.95) / 0.3));
          const sc = cyc < 0.35 ? 1.5 - 0.5 * (cyc / 0.35) : 1;
          hint.style.opacity = (okA ? al * 0.95 : 0).toFixed(3);
          hint.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
          // the path the finger should take
          const lx = b2.x - a2.x, ly = b2.y - a2.y;
          hintLine.style.opacity = (okA ? al * 0.55 : 0).toFixed(3);
          hintLine.style.width = Math.hypot(lx, ly).toFixed(1) + 'px';
          hintLine.style.transform = 'translate3d(' + a2.x.toFixed(1) + 'px,' + a2.y.toFixed(1) + 'px,0) rotate(' + Math.atan2(ly, lx).toFixed(4) + 'rad)';
        } else {
          if (hintLine.style.opacity !== '0') hintLine.style.opacity = '0';
          const cyc = hintPhase % 1.5, sc = 1.5 - 0.6 * U.sat(cyc / 0.3) + 0.06 * Math.sin(cyc * 20) * (cyc > 0.3 ? 1 : 0);
          hint.style.opacity = (okA ? Math.min(1, cyc / 0.2) * (1 - U.sat((cyc - 1.2) / 0.3)) * 0.95 : 0).toFixed(3);
          hint.style.transform = 'translate3d(' + a2.x.toFixed(1) + 'px,' + a2.y.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
        }
      } else { hintPhase = 0; if (hint.style.opacity !== '0') { hint.style.opacity = '0'; hintLine.style.opacity = '0'; } }
      // readiness ring over a mold that is cooling
      const fm = st.play && sim.focus && sim.focus.where === 'cold' && sim.focus.fill && sim.focus.cassette ? sim.focus : null;
      if (fm) {
        const r = fm.fill.readiness(), prog = U.sat(0.75 * fm.fill.phi + 0.25 * r);
        mpos.copy(fm.obj.position); mpos.y += 3.4;
        EC.toScreen(mpos, scr);
        ring.style.background = 'conic-gradient(#fff ' + (prog * 360).toFixed(0) + 'deg, rgba(255,255,255,.22) 0)';
        ring.style.opacity = (0.9).toFixed(2);
        const pulse = r > 0.97 ? 1 + 0.12 * Math.sin(time * 9) : 1;
        ring.style.transform = 'translate3d(' + scr.x.toFixed(1) + 'px,' + (scr.y - 26).toFixed(1) + 'px,0) scale(' + pulse.toFixed(3) + ')';
        if (r > 0.97 && !fm.dinged) { fm.dinged = true; A.ding(); }
        if (r < 0.5) fm.dinged = false;
      } else if (ring.style.opacity !== '0') ring.style.opacity = '0';
    });
  };
})();
