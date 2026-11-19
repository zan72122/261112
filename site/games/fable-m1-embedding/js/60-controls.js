/* Smooth orbit camera plus pointer routing. A pointer either operates something (beginner mode,
   decided by EC.interact.pick) or drives the camera: 1 finger orbit, 2 fingers pinch/pan,
   wheel zoom, right/shift drag pan. A short press without movement is a "tap" (part label). */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;

  const cam = (EC.cam = {
    target: new T.Vector3(14, 13, 4), az: 0.5, el: 0.36, dist: 150,
    gTarget: new T.Vector3(14, 13, 4), gAz: 0.5, gEl: 0.36, gDist: 150,
    vAz: 0, vEl: 0, lambda: 14, flying: 0,
    minDist: 14, maxDist: 360,
  });
  const ray = new T.Raycaster();
  const ndc = new T.Vector2();
  const tmp = new T.Vector3(), tmp2 = new T.Vector3();
  let canvas = null;
  const pointers = new Map();
  EC.pointers = pointers;

  cam.apply = function () {
    const c = EC.camera, ce = Math.cos(cam.el);
    c.position.set(cam.target.x + cam.dist * Math.sin(cam.az) * ce, cam.target.y + cam.dist * Math.sin(cam.el), cam.target.z + cam.dist * Math.cos(cam.az) * ce);
    c.lookAt(cam.target);
    c.updateMatrixWorld();
  };

  /* Distance that fits a box of half-extents (hw, hh) around the target for the current aspect. */
  cam.fitDist = function (hw, hh) {
    const c = EC.camera, t = Math.tan(U.rad(c.fov / 2));
    return Math.max(hh / t, hw / (t * c.aspect)) * 1.04;
  };

  cam.flyTo = function (v, instant) {
    if (v.target && !(isFinite(v.target.x + v.target.y + v.target.z))) return;
    if (v.dist !== undefined && !isFinite(v.dist)) return;
    if (v.target) cam.gTarget.copy(v.target);
    if (v.az !== undefined) {
      // go the short way round
      cam.gAz = cam.az + U.wrapPi(v.az - cam.az);
    }
    if (v.el !== undefined) cam.gEl = v.el;
    if (v.dist !== undefined) cam.gDist = v.dist;
    cam.vAz = cam.vEl = 0;
    if (instant) {
      cam.target.copy(cam.gTarget); cam.az = cam.gAz; cam.el = cam.gEl; cam.dist = cam.gDist;
      cam.apply();
    } else cam.flying = 1.4;
  };

  function clampGoals() {
    cam.gEl = U.clamp(cam.gEl, 0.05, 1.5);
    cam.gDist = U.clamp(cam.gDist, cam.minDist, cam.maxDist);
    cam.gTarget.x = U.clamp(cam.gTarget.x, -70, 95);
    cam.gTarget.y = U.clamp(cam.gTarget.y, 0, 44);
    cam.gTarget.z = U.clamp(cam.gTarget.z, -34, 56);
  }

  cam.update = function (dt) {
    // inertia after an orbit drag
    if (!orbitCount()) {
      cam.gAz += cam.vAz * dt; cam.gEl += cam.vEl * dt;
      const k = Math.exp(-5.5 * dt);
      cam.vAz *= k; cam.vEl *= k;
    }
    clampGoals();
    if (cam.flying > 0) cam.flying -= dt;
    const l = cam.flying > 0 ? 4.2 : cam.lambda;
    const f = 1 - Math.exp(-l * dt);
    cam.az += (cam.gAz - cam.az) * f;
    cam.el += (cam.gEl - cam.el) * f;
    cam.dist += (cam.gDist - cam.dist) * f;
    cam.target.lerp(cam.gTarget, f);
    cam.apply();
  };

  cam.pan = function (dxPx, dyPx) {
    const c = EC.camera;
    const scale = (2 * cam.dist * Math.tan(U.rad(c.fov / 2))) / canvas.clientHeight;
    tmp.setFromMatrixColumn(c.matrixWorld, 0);
    tmp2.setFromMatrixColumn(c.matrixWorld, 1);
    cam.gTarget.addScaledVector(tmp, -dxPx * scale).addScaledVector(tmp2, dyPx * scale);
  };

  EC.setRay = function (x, y, r) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    (r || ray).setFromCamera(ndc, EC.camera);
    return r || ray;
  };
  EC.ray = ray;

  /* World position -> CSS pixel position; returns false if behind the camera. */
  EC.toScreen = function (v, out) {
    tmp.copy(v).project(EC.camera);
    const rect = canvas.getBoundingClientRect();
    out.x = rect.left + (tmp.x * 0.5 + 0.5) * rect.width;
    out.y = rect.top + (-tmp.y * 0.5 + 0.5) * rect.height;
    return tmp.z < 1;
  };

  function orbitCount() {
    let n = 0;
    pointers.forEach(function (p) { if (p.role === 'orbit') n++; });
    return n;
  }
  function orbitList() {
    const l = [];
    pointers.forEach(function (p) { if (p.role === 'orbit') l.push(p); });
    return l;
  }

  let lastTap = { t: 0, x: 0, y: 0 };

  function down(e) {
    if (e.pointerType === 'mouse' && e.button > 2) return;
    EC.emit('gesture');
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = {
      id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, px: e.clientX, py: e.clientY,
      type: e.pointerType || 'mouse', button: e.button, shift: e.shiftKey, t0: performance.now(), moved: false, role: 'orbit', act: null,
    };
    if (EC.state.play && EC.interact && !(p.type === 'mouse' && e.button !== 0)) {
      const h = EC.interact.pick(p);
      if (h) { p.role = 'act'; p.act = h; }
    }
    pointers.set(p.id, p);
    if (p.role === 'orbit') { cam.vAz = cam.vEl = 0; cam.flying = 0; pinch = null; }
    e.preventDefault();
  }

  let pinch = null;
  function move(e) {
    const p = pointers.get(e.pointerId);
    if (!p) { if (EC.interact && EC.interact.hover) EC.interact.hover(e.clientX, e.clientY); return; }
    p.px = p.x; p.py = p.y; p.x = e.clientX; p.y = e.clientY;
    const dx = p.x - p.px, dy = p.y - p.py;
    if (!p.moved && Math.hypot(p.x - p.sx, p.y - p.sy) > (p.type === 'mouse' ? 4 : 9)) p.moved = true;
    if (p.role === 'act') { if (p.act.move) p.act.move(p); return; }
    const list = orbitList();
    if (list.length === 1) {
      if (!p.moved) return;
      if (p.type === 'mouse' && (p.button === 2 || p.button === 1 || p.shift)) cam.pan(dx, dy);
      else {
        const k = 0.0052;
        cam.gAz -= dx * k; cam.gEl += dy * k;
        const dt = Math.max(0.008, EC.state.dt);
        cam.vAz = U.lerp(cam.vAz, (-dx * k) / dt, 0.4); cam.vEl = U.lerp(cam.vEl, (dy * k) / dt, 0.4);
      }
    } else if (list.length >= 2) {
      const a = list[0], b = list[1];
      const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (pinch) {
        cam.gDist *= pinch.d / Math.max(20, d);
        cam.pan(mx - pinch.x, my - pinch.y);
      }
      pinch = { d: Math.max(20, d), x: mx, y: my };
      cam.vAz = cam.vEl = 0;
    }
  }

  function up(e) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    pointers.delete(e.pointerId);
    pinch = null;
    const now = performance.now();
    const tapped = !p.moved && now - p.t0 < 320;
    if (p.role === 'act') {
      if (p.act.end) p.act.end(p, tapped);
      if (tapped && EC.explode) EC.explode.tap(p.x, p.y, p.act.item || null);
      return;
    }
    if (tapped) {
      const dbl = now - lastTap.t < 340 && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 28;
      lastTap = { t: dbl ? 0 : now, x: p.x, y: p.y };
      if (dbl) focusAt(p.x, p.y);
      else if (EC.explode) EC.explode.tap(p.x, p.y, null);
    } else if (now - p.t0 > 200 && Math.abs(cam.vAz) + Math.abs(cam.vEl) < 0.25) cam.vAz = cam.vEl = 0;
  }

  function cancel(e) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    pointers.delete(e.pointerId);
    pinch = null;
    if (p.role === 'act' && p.act.end) p.act.end(p, false);
  }

  /* Double tap: zoom toward the tapped spot, or back out to the home view. */
  function focusAt(x, y) {
    EC.setRay(x, y);
    const hits = ray.intersectObjects(EC.scene.children, true);
    let hit = null;
    for (let i = 0; i < hits.length; i++) { if (hits[i].object.visible && hits[i].object.isMesh && !hits[i].object.userData.noPick) { hit = hits[i]; break; } }
    const home = EC.views ? EC.views.current() : null;
    if (hit && hit.point.y > 0.5 && cam.dist > (home ? home.dist * 0.62 : 80)) {
      cam.flyTo({ target: hit.point.clone(), dist: Math.max(cam.minDist + 8, cam.dist * 0.45) });
    } else if (home) cam.flyTo(home);
  }

  function wheel(e) {
    e.preventDefault();
    EC.emit('gesture');
    const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
    cam.gDist *= Math.exp(U.clamp(d, -240, 240) * 0.0012);
    cam.flying = 0;
  }

  EC.controls = {
    init: function (cv) {
      canvas = cv;
      cv.addEventListener('pointerdown', down);
      cv.addEventListener('pointermove', move);
      cv.addEventListener('pointerup', up);
      cv.addEventListener('pointercancel', cancel);
      cv.addEventListener('lostpointercapture', function (e) { if (pointers.has(e.pointerId)) cancel(e); });
      cv.addEventListener('wheel', wheel, { passive: false });
      cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (n) { document.addEventListener(n, function (e) { e.preventDefault(); }, { passive: false }); });
      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    },
    releaseAll: function () {
      pointers.forEach(function (p) { if (p.role === 'act' && p.act.end) p.act.end(p, false); });
      pointers.clear();
    },
  };
})();
