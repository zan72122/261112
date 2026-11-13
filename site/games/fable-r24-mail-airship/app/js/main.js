// main.js - boot, the frame loop, the level camera, hints, and the port -> take-off -> free-flight flow.
// Boot builds only the port scene. Everything else (clouds, islands, friends, rainbow...) is
// loaded and built in small slices after the first frame has been drawn.
(function () {
  'use strict';
  var T = THREE, MA = window.MA;
  var t0 = performance.now();

  var canvas = document.getElementById('c');
  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, stencil: false, powerPreference: 'high-performance' });
  // iPad: fixed 1.0 so the fill cost stays predictable. Desktop may use up to 2.
  renderer.setPixelRatio(MA.mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  var scene = new T.Scene();
  var cam = new T.PerspectiveCamera(55, 1, 1, 7000);
  MA.renderer = renderer;
  MA.scene = scene;
  MA.cam = cam;

  var W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    cam.aspect = W / H;
    // keep the sideways view wide enough in portrait
    var hf = Math.tan((30 * Math.PI) / 180);
    cam.fov = MA.clamp((2 * Math.atan(hf / cam.aspect) * 180) / Math.PI, 55, 78);
    cam.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', function () { setTimeout(resize, 250); });
  resize();

  var _pv = new T.Vector3();
  MA.project = function (v) {
    _pv.copy(v).project(cam);
    return { x: (_pv.x * 0.5 + 0.5) * W, y: (-_pv.y * 0.5 + 0.5) * H, behind: _pv.z > 1 };
  };

  // ---- first scene ----
  MA.buildSky(scene);
  var ship = MA.buildShip(scene);
  var port = MA.buildPort(scene);
  ship.pos.set(MA.DOCK.x, MA.DOCK.y, MA.DOCK.z);

  // ---- camera: always level, behind and above, no roll, no zoom ----
  var CAM_D = 24, CAM_H = 11, CAM_L = 18;
  var GLANCE = true; // set to false to keep the camera strictly behind the ship during deliveries
  var camYaw = 0, camY = ship.pos.y, chasePos = new T.Vector3(), chaseLook = new T.Vector3();
  var BASE_PITCH = Math.atan2(CAM_H - 1.5, CAM_D + CAM_L), glanceYaw = 0, glancePitch = 0;
  var look = new T.Vector3(), portPos = new T.Vector3(), portLook = new T.Vector3();
  function chase(dt, snap) {
    if (snap) { camYaw = ship.yaw; camY = ship.pos.y; }
    else {
      camYaw += MA.wrapPi(ship.yaw - camYaw) * (1 - Math.exp(-2.3 * dt));
      camY = MA.damp(camY, ship.pos.y, 3.2, dt);
    }
    var fx = Math.sin(camYaw), fz = Math.cos(camYaw);
    chasePos.set(ship.pos.x - fx * CAM_D, camY + CAM_H, ship.pos.z - fz * CAM_D);
    // While a parcel is being delivered the camera glances towards the receiver - a slow,
    // limited, level pan (never a cut or a zoom) - so the happy moment is not missed.
    var gy = 0, gp = 0, tg = GLANCE && MA.late.delivery && MA.late.delivery.ready ? MA.late.delivery.watch() : null;
    if (tg) {
      var dx = tg.x - chasePos.x, dz = tg.z - chasePos.z, dh = Math.sqrt(dx * dx + dz * dz) + 0.001;
      var rel = MA.wrapPi(Math.atan2(dx, dz) - camYaw), ar = Math.abs(rel);
      // limited so the ship stays in the picture; skipped when the receiver is already behind
      gy = MA.clamp(rel, -0.56, 0.56) * (1 - MA.sstep(2.0, 2.8, ar));
      gp = MA.clamp(Math.atan2(chasePos.y - tg.y, dh) - BASE_PITCH, -0.05, 0.22) * (1 - MA.sstep(0.9, 1.8, ar));
    }
    if (snap) { glanceYaw = gy; glancePitch = gp; }
    else {
      // eased and speed-limited (about 25 degrees a second at most), so it never feels like a swing
      glanceYaw += MA.clamp((gy - glanceYaw) * 1.4, -0.44, 0.44) * dt;
      glancePitch += MA.clamp((gp - glancePitch) * 1.4, -0.25, 0.25) * dt;
    }
    var ly = camYaw + glanceYaw, lp = BASE_PITCH + glancePitch, cp = Math.cos(lp);
    chaseLook.set(chasePos.x + Math.sin(ly) * cp * 40, chasePos.y - Math.sin(lp) * 40, chasePos.z + Math.cos(ly) * cp * 40);
  }
  function portCam() {
    // pull back a little on narrow (portrait) screens so the parcels and the ship both fit
    var f = Math.max(1, 1.25 / cam.aspect);
    portLook.copy(port.camLook);
    portPos.copy(port.camPos).sub(port.camLook).multiplyScalar(f).add(port.camLook);
  }

  // ---- hints: a soft "fingertip" that taps or drags. No words anywhere. ----
  var hintEl = document.getElementById('hint'), hintKind = '', hintX = -1, hintY = -1;
  function hint(kind, x, y) {
    if (kind !== hintKind) {
      hintKind = kind;
      hintEl.className = kind ? 'on ' + kind : '';
    }
    if (kind && (Math.abs(x - hintX) > 0.5 || Math.abs(y - hintY) > 0.5)) {
      hintX = x; hintY = y;
      hintEl.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    }
  }
  var veilEl = document.getElementById('veil'), veilNow = 0;
  MA.veil = 0; // 0..1 white-out while inside a cloud

  // ---- state ----
  MA.state = 'port';
  var tTake = 0, flyTime = 0, dragPx = 0;
  MA.startTakeoff = function () {
    MA.state = 'takeoff';
    tTake = 0;
    port.leave();
    ship.speed = 0;
    ship.speedK = 1;
    MA.audio.sfx('liftoff');
    MA.audio.startMusic();
  };

  var inp = MA.input;
  MA.initInput(canvas);
  inp.onFirstTouch = function () { MA.audio.unlock(); };
  ['pointerup', 'touchend', 'keyup'].forEach(function (n) {
    window.addEventListener(n, function () { MA.audio.unlock(); }, true);
  });
  inp.onTap = function (x, y) {
    MA.audio.unlock();
    if (MA.state === 'port') port.tap(x, y);
    else if (MA.late.delivery && MA.late.delivery.ready) MA.late.delivery.tap();
  };
  inp.onDrag = function (px) {
    if (MA.state !== 'port' || port.phase !== 'spin') return;
    dragPx += px;
    if (dragPx > 130) { dragPx = 0; port.addSpin(0.6); }
  };

  // ---- late modules ----
  var LATE = ['fx', 'clouds', 'islands', 'delivery', 'friends', 'rainbow', 'scenery'];
  function loadLate() {
    MA.loadScripts(LATE.map(function (n) { return 'js/' + n + '.js'; }), function () {
      LATE.forEach(function (n) {
        var m = MA.late[n];
        if (!m) return;
        m.init(scene); // each init only queues small build steps
        MA.defer(function () { m.ready = true; });
      });
      MA.defer(function () { MA.worldReady = true; });
    });
  }

  // ---- frame loop ----
  var last = performance.now(), frames = 0, hidden = false;
  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
    MA.audio.hush(hidden);
    last = performance.now();
  });
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); });
  canvas.addEventListener('webglcontextrestored', function () { location.reload(); });

  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden) return;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (dt <= 0) return;
    MA.uni.time.value += dt;
    MA.pollInput(dt);
    var L = MA.late, k;

    if (MA.state === 'port') {
      port.update(dt);
      portCam();
      cam.position.copy(portPos);
      look.copy(portLook);
      var ht = port.hintTarget();
      if (ht) hint('tap', ht.x, ht.y); else hint('');
    } else {
      if (MA.state === 'takeoff') {
        tTake += dt;
        k = MA.sstep(1.6, 4.2, tTake);
        ship.fly(dt, inp.x * k, Math.max(inp.y * k, ship.pos.y < 30 ? 0.9 : 0));
        chase(dt, tTake === dt);
        portCam();
        var u = MA.sstep(0, 1, tTake / 5.2);
        u = u * u * (3 - 2 * u);
        cam.position.lerpVectors(portPos, chasePos, u);
        look.lerpVectors(portLook, chaseLook, u);
        if (tTake >= 5.2) MA.state = 'fly';
        hint('');
      } else {
        flyTime += dt;
        ship.fly(dt, inp.x, inp.y);
        chase(dt, false);
        cam.position.copy(chasePos);
        look.copy(chaseLook);
        // show how to steer until the child has clearly done it
        var zoneHint = L.delivery && L.delivery.ready && L.delivery.wantTapHint();
        if (inp.dragTime < 1.2 && flyTime > 1.5 && !inp.held) hint('drag', W * 0.5, H * 0.72);
        else if (zoneHint) hint('tap', W * 0.5, H * 0.74);
        else hint('');
      }
      MA.world.updateLOD(scene, ship.pos);
      port.welcome();
    }
    cam.lookAt(look);
    MA.sky.update(cam);

    for (var i = 0; i < LATE.length; i++) {
      var m = L[LATE[i]];
      if (m && m.ready) m.update(dt);
    }
    MA.audio.update({ spin: ship.propSpin, speed: ship.speed, alt: ship.pos.y, turn: ship.turn, cloud: MA.veil, wind: ship.windK });
    if (Math.abs(MA.veil - veilNow) > 0.01) {
      veilNow = MA.veil;
      veilEl.style.opacity = (veilNow * 0.5).toFixed(2);
    }

    renderer.render(scene, cam);
    frames++;
    if (frames === 1) {
      MA.bootMs = performance.now() - t0;
      MA.firstFrameAt = performance.now();
      document.body.className = 'run';
      setTimeout(loadLate, 0);
    }
    MA.runDeferred(4);
  }
  requestAnimationFrame(frame);

  // ---- small hooks for the smoke test (harmless in normal play) ----
  MA.debug = {
    info: function () {
      var r = renderer.info;
      return {
        state: MA.state, phase: port.phase, tris: r.render.triangles, calls: r.render.calls,
        geos: r.memory.geometries, tex: r.memory.textures, programs: r.programs ? r.programs.length : 0,
        bootMs: MA.bootMs, worldReady: !!MA.worldReady, pending: MA.pendingWork(),
        pos: [ship.pos.x, ship.pos.y, ship.pos.z], yaw: ship.yaw,
        delivered: MA.late.delivery ? MA.late.delivery.count : 0,
        audio: MA.audio.state(),
      };
    },
    // put the ship `back` units before destination i, heading at it
    warp: function (i, back, alt) {
      var d = MA.dest[i].p, a = Math.atan2(d.x, d.z);
      ship.yaw = a;
      ship.pos.set(d.x - Math.sin(a) * back, alt || 48, d.z - Math.cos(a) * back);
      ship.turn = ship.climb = 0;
      chase(0, true);
    },
    // jump straight to free flight with all parcels aboard
    skipPort: function () {
      if (MA.state !== 'port') return;
      for (var i = 0; i < 4; i++) {
        var c = MA.cargo[i];
        if (c.state !== 'dock') continue;
        c.state = 'ship'; c.slot = port.loaded++;
        ship.model.add(c.mesh);
        c.mesh.position.copy(ship.slots[c.slot]);
        c.mesh.rotation.set(0, 0, 0);
        c.mesh.scale.setScalar(1);
      }
      port.phase = 'go';
      MA.startTakeoff();
      tTake = 5.2;
      ship.pos.y = 34;
      ship.speed = ship.CRUISE;
      chase(0, true);
    },
    place: function (x, y, z, yaw) {
      ship.pos.set(x, y, z);
      ship.yaw = yaw || 0;
      ship.turn = ship.climb = 0;
      chase(0, true);
    },
  };
})();
