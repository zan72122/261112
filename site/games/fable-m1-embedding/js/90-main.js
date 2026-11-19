/* Boot, main loop, resize and adaptive resolution. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;
  const canvas = document.getElementById('c');
  const cam = EC.cam;

  // ---- camera views (fit to the current aspect) ----
  EC.views = {
    overview: function () {
      const portrait = EC.camera.aspect < 0.8;
      return { target: new T.Vector3(portrait ? 12 : 13, 14.5, 5), az: portrait ? 0.42 : 0.5, el: 0.33, dist: cam.fitDist(portrait ? 50 : 62, 31) };
    },
    work: function () {
      const a = EC.camera.aspect;
      if (a < 0.8) return { target: new T.Vector3(3, 12.5, 12), az: 0.24, el: 0.72, dist: cam.fitDist(27, 24) };
      return { target: new T.Vector3(15, 12.5, 10), az: 0.3, el: 0.66, dist: cam.fitDist(46, 22) };
    },
    current: function () { return EC.state.play ? EC.views.work() : EC.views.overview(); },
  };

  // ---- resolution ----
  const maxDpr = EC.params.dpr ? parseFloat(EC.params.dpr) : Math.min(window.devicePixelRatio || 1, 2);
  let dpr = maxDpr;
  const adaptive = !EC.params.noadapt;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    EC.renderer.setPixelRatio(dpr);
    EC.renderer.setSize(w, h, false);
    EC.camera.aspect = w / h;
    EC.camera.updateProjectionMatrix();
    EC.emit('resize', w, h);
  }

  let slow = 0, fast = 0, emaMs = 16;
  function adapt(ms) {
    if (!adaptive) return;
    emaMs += (ms - emaMs) * 0.05;
    if (emaMs > 24) { slow += ms; fast = 0; } else if (emaMs < 13.5) { fast += ms; slow = 0; } else { slow = fast = 0; }
    if (slow > 1500 && dpr > 1) { dpr = Math.max(1, dpr - 0.25); slow = 0; emaMs = 18; resize(); }
    else if (fast > 6000 && dpr < maxDpr) { dpr = Math.min(maxDpr, dpr + 0.25); fast = 0; resize(); }
  }

  let last = 0, running = true;
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const ms = last ? now - last : 16.7;
    last = now;
    const dt = U.clamp(ms / 1000, 0.001, 0.05);
    const st = EC.state;
    if (manual) { if (!st.frames) EC.draw(); return; }
    st.dt = dt; st.time += dt;
    cam.update(dt);
    const up = EC.updaters;
    for (let i = 0; i < up.length; i++) up[i](dt, st.time);
    EC.draw();
    if (ms < 200) adapt(ms);
  }
  // ?manual=1: time only advances through EC.step(), frames are drawn on request (headless capture)
  const manual = !!EC.params.manual;
  EC.draw = function () {
    const st = EC.state;
    if (st.shadowDirty) { EC.renderer.shadowMap.needsUpdate = true; st.shadowDirty = false; }
    EC.renderer.render(EC.scene, EC.camera);
    st.frames = (st.frames || 0) + 1;
  };

  /* Advance the simulation without drawing (used by the headless check to fast-forward). */
  EC.step = function (n, dt) {
    const st = EC.state, up = EC.updaters;
    dt = dt || 1 / 60;
    for (let k = 0; k < n; k++) {
      st.dt = dt; st.time += dt;
      cam.update(dt);
      for (let i = 0; i < up.length; i++) up[i](dt, st.time);
    }
    EC.scene.updateMatrixWorld();
  };

  function boot() {
    EC.tex.init();
    EC.mats.init();
    EC.initEnv(canvas);
    EC.buildMachine();
    EC.buildColdPlate();
    EC.buildProps();
    EC.controls.init(canvas);
    EC.initInteract();
    EC.initExplode();
    EC.initCrystal();
    EC.initUI();
    resize();
    cam.flyTo(EC.views.overview(), true);
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', function () { setTimeout(resize, 250); });
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) { last = 0; requestAnimationFrame(frame); }
      EC.emit('visibility', running);
    });
    EC.renderer.compile(EC.scene, EC.camera);
    requestAnimationFrame(function (t) {
      frame(t);
      document.getElementById('veil').classList.add('gone');
      EC.ready = true;
    });
  }

  function start() {
    try { boot(); } catch (err) {
      // no WebGL (or it was refused): say so instead of leaving a blank page
      const v = document.getElementById('veil');
      v.style.cssText += ';display:grid;place-items:center;color:#fff;font-size:14px;letter-spacing:.08em;pointer-events:auto';
      v.textContent = 'WebGL を利用できません';
      throw err;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
