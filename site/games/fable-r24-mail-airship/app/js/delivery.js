// delivery.js (late) - where to go and how to deliver, shown only with light and motion:
//   * a tall pillar of light in the parcel's colour stands over each island that still waits
//   * near that island, rings pulse round the receiver and glowing dots trace the drop path
//   * a tap lets the parcel go: a parachute opens and it always drifts to the receiver
// Nothing can be missed and nothing is required: tapping anywhere else just toots the horn.
(function () {
  'use strict';
  var T = THREE, MA = window.MA;
  var ZONE = 150;
  var pillars = [], rings = [], dots = null, dotMat = null, falls = [], star = [0, 0.15, 0.3, 0.45];
  var zone = -1, zoneTime = 0, sinceLand = 99, tootCd = 0, finale = false, taught = 0, lastIsl = null;
  var _a = new T.Vector3(), _b = new T.Vector3(), _c = new T.Vector3(), _m = new T.Matrix4();

  function pillarMat(hex) {
    return new T.ShaderMaterial({
      uniforms: { time: MA.uni.time, col: { value: new T.Color(hex) }, op: { value: 0 } },
      vertexShader:
        'varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n' +
        'void main(){ vUv = uv; vN = normalMatrix * normal; vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }',
      fragmentShader:
        'precision highp float; uniform float time, op; uniform vec3 col; varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n' +
        'void main(){\n' +
        '  float rim = abs(dot(normalize(vN + vec3(0.0, 1e-4, 0.0)), normalize(vV + vec3(0.0, 0.0, 1e-4))));\n' +
        '  float up = 1.0 - vUv.y;\n' +
        '  float a = rim * (0.55 + 0.45 * rim) * (0.15 + 0.85 * up) * (0.78 + 0.22 * sin(vUv.y * 40.0 - time * 3.5)) * op;\n' +
        '  gl_FragColor = vec4(mix(col * 1.15, vec3(1.0), 0.28 * rim * rim), a);\n' +
        '  #include <colorspace_fragment>\n' +
        '}',
      transparent: true, depthWrite: false, fog: false,
    });
  }

  function chuteGeo(hex) {
    var g = new MA.Geo();
    g.add(new T.SphereGeometry(2.3, 10, 4, 0, MA.TAU, 0, Math.PI / 2), function (x, y, z) {
      return Math.floor(((Math.atan2(x, z) + Math.PI) / MA.TAU) * 10 + 0.001) % 2 ? 0xffffff : hex;
    }, MA.mat4([0, 2.6, 0], null, [1, 0.8, 1]));
    for (var i = 0; i < 4; i++) {
      var a = (i / 4) * MA.TAU + 0.4, x = Math.sin(a) * 2.1, z = Math.cos(a) * 2.1;
      g.cyl(0xffffff, 0.04, 0.04, 3.3, [x * 0.6, 1.45, z * 0.6], [Math.atan2(z, 2.6) * 0.75, 0, -Math.atan2(x, 2.6) * 0.75], 3);
    }
    return g.build();
  }

  var dl = (MA.late.delivery = {
    ready: false,
    count: 0,
    init: function (scene) {
      var self = this;
      MA.defer(function () {
        var geo = new T.CylinderGeometry(24, 8, 320, 18, 1, true);
        geo.translate(0, 160, 0);
        geo.shared = true;
        for (var i = 0; i < 4; i++) {
          var m = new T.Mesh(geo, pillarMat(MA.dest[i].color));
          m.renderOrder = 11; // after the clouds: it is light, it shines through them
          m.visible = false;
          m.frustumCulled = false;
          scene.add(m);
          pillars[i] = m;
        }
        var rg = new T.TorusGeometry(1, 0.07, 5, 30);
        rg.rotateX(Math.PI / 2);
        for (i = 0; i < 2; i++) {
          var r = new T.Mesh(rg, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, fog: false }));
          r.visible = false;
          r.renderOrder = 5;
          scene.add(r);
          rings.push(r);
        }
        dotMat = new T.MeshBasicMaterial({ color: 0xffffff, fog: false });
        dots = new T.InstancedMesh(new T.SphereGeometry(0.5, 6, 4), dotMat, 10);
        dots.instanceMatrix.setUsage(T.DynamicDrawUsage);
        dots.frustumCulled = false;
        dots.visible = false;
        scene.add(dots);
        self.scene = scene;
      });
    },
    // the receiver worth looking at right now (parcel on its way, or just arrived), or null
    watch: function () {
      if (falls.length) return falls[falls.length - 1].isl.target;
      return sinceLand < 4.5 && lastIsl ? lastIsl.target : null;
    },
    wantTapHint: function () { return zone >= 0 && zoneTime > (taught < 2 ? 1.6 : 7); },
    rackPos: function (out) { return MA.ship.model.localToWorld(out.set(0, -4.6, -2.4)); },

    tap: function () {
      var L = MA.late, ship = MA.ship, isl;
      if (MA.state === 'port') return;
      if (zone >= 0) {
        var c = MA.cargo[zone];
        isl = L.islands.list[zone];
        var mesh = c.mesh, grp = new T.Group();
        mesh.getWorldPosition(grp.position);
        ship.model.remove(mesh);
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, 0);
        var chute = new T.Mesh(chuteGeo(MA.dest[zone].color), MA.mat.lambertDouble);
        chute.scale.setScalar(0.01);
        grp.add(mesh, chute);
        this.scene.add(grp);
        c.state = 'fall';
        var dist = grp.position.distanceTo(isl.target);
        falls.push({ c: c, grp: grp, chute: chute, isl: isl, t: 0, dur: MA.clamp(dist / 34, 2.3, 4.4), p0: grp.position.clone(), ph: Math.random() * 6 });
        MA.audio.sfx('drop');
        taught++;
        zone = -1;
        zoneTime = 0;
        return;
      }
      // nothing to drop here: toot the horn, puff, and nearby friends answer
      if (tootCd > 0) return;
      tootCd = 0.5;
      MA.audio.sfx('toot');
      if (L.fx) L.fx.burst(this.rackPos(_a), finale ? 'rainbow' : 0xffffff, 9, 6, 1.3, 1.1, 1.5);
      if (L.islands) for (var i = 0; i < 4; i++) {
        isl = L.islands.list[i];
        if (isl && isl.delivered && isl.tR > 8 && Math.hypot(ship.pos.x - isl.x, ship.pos.z - isl.z) < 200) MA.audio.sfx(isl.id);
      }
      if (L.friends && L.friends.ready) L.friends.cheer();
    },

    update: function (dt) {
      if (!dots) return;
      var L = MA.late, ship = MA.ship, t = MA.uni.time.value, i, isl;
      var list = L.islands ? L.islands.list : [];
      tootCd -= dt;
      sinceLand += dt;

      // --- which island (if any) can take a parcel right now ---
      var z = -1;
      for (i = 0; i < 4; i++) {
        isl = list[i];
        var c = MA.cargo[i], p = pillars[i], show = !!isl && c.state === 'ship';
        var op = p.material.uniforms.op;
        op.value = MA.damp(op.value, show ? 1 : 0, 2, dt);
        p.visible = op.value > 0.01;
        if (!isl) continue;
        p.position.set(isl.target.x, 0, isl.target.z);
        if (show && MA.state === 'fly' && Math.hypot(ship.pos.x - isl.target.x, ship.pos.z - isl.target.z) < ZONE) z = i;
        // sparkles climbing the pillar, and a twinkling star high above that can be seen from anywhere
        if (show && L.fx) {
          var dd = Math.hypot(ship.pos.x - isl.x, ship.pos.z - isl.z);
          if (Math.random() < dt * 2.5) {
            var a = Math.random() * MA.TAU;
            L.fx.emit(isl.target.x + Math.cos(a) * 6, isl.target.y + Math.random() * 60, isl.target.z + Math.sin(a) * 6, 0, 9, 0, MA.dest[i].light, 1.5 + dd * 0.012, 2.2, 0);
          }
          star[i] -= dt;
          if (star[i] < 0) {
            star[i] = 0.55;
            L.fx.emit(isl.target.x, 150, isl.target.z, 0, 0, 0, MA.dest[i].color, 9 + dd * 0.07, 0.8, 0);
          }
        }
      }
      if (z !== zone) {
        zone = z;
        zoneTime = 0;
        if (z >= 0) MA.audio.sfx('ready');
      } else if (z >= 0) zoneTime += dt;

      // --- "let go here" cue: pulsing rings on the receiver + dots along the drop path ---
      var on = zone >= 0;
      dots.visible = on;
      for (i = 0; i < 2; i++) {
        var r = rings[i];
        r.visible = on;
        if (!on) continue;
        isl = list[zone];
        var k = (t * 0.7 + i * 0.5) % 1;
        r.position.copy(isl.target);
        r.scale.setScalar(5 + k * 13);
        r.material.color.setHex(MA.dest[zone].light);
        r.material.opacity = (1 - k) * 0.95;
      }
      if (on) {
        isl = list[zone];
        dotMat.color.setHex(MA.dest[zone].light);
        this.rackPos(_a);
        _b.copy(isl.target);
        _c.lerpVectors(_a, _b, 0.55);
        _c.y = _a.y + 3;
        for (i = 0; i < 10; i++) {
          var u = ((i + t * 1.8) % 10) / 10, v = 1 - u;
          var s = 0.5 + Math.sin(u * Math.PI) * 1.1;
          _m.makeScale(s, s, s);
          _m.setPosition(v * v * _a.x + 2 * v * u * _c.x + u * u * _b.x, v * v * _a.y + 2 * v * u * _c.y + u * u * _b.y, v * v * _a.z + 2 * v * u * _c.z + u * u * _b.z);
          dots.setMatrixAt(i, _m);
        }
        dots.instanceMatrix.needsUpdate = true;
      }

      // --- parcels on their parachutes ---
      for (i = falls.length - 1; i >= 0; i--) {
        var f = falls[i];
        f.t += dt;
        var uu = Math.min(f.t / f.dur, 1), e = 1 - (1 - uu) * (1 - uu), tg = f.isl.target;
        var sway = Math.sin(f.t * 3.1 + f.ph) * (1 - uu);
        f.grp.position.set(MA.lerp(f.p0.x, tg.x, e) + sway * 1.6, MA.lerp(f.p0.y, tg.y + 0.8, uu * (0.55 + 0.45 * uu)), MA.lerp(f.p0.z, tg.z, e) + Math.cos(f.t * 2.3 + f.ph) * (1 - uu) * 1.2);
        f.grp.rotation.set(Math.cos(f.t * 2.3 + f.ph) * 0.16 * (1 - uu), f.t * 0.6, sway * 0.22);
        f.grp.scale.setScalar(MA.lerp(1, 1.7, Math.min(f.t * 2, 1)));
        f.chute.scale.setScalar(MA.ease.outBack(MA.clamp((f.t - 0.25) / 0.45, 0.01, 1)));
        if (L.fx && Math.random() < dt * 12) L.fx.emit(f.grp.position.x, f.grp.position.y, f.grp.position.z, 0, 1, 0, MA.dest[f.c.dest].light, 1.2, 0.8, 0);
        if (uu >= 1) {
          // delivered! the parachute and parcel are no longer needed
          this.scene.remove(f.grp);
          f.chute.geometry.dispose();
          f.c.mesh.geometry.dispose();
          f.c.state = 'done';
          falls.splice(i, 1);
          f.isl.receive();
          lastIsl = f.isl;
          this.count++;
          sinceLand = 0;
          MA.audio.sfx('land');
          if (L.fx) {
            L.fx.burst(tg, 'confetti', 46, 17, 1.9, 2.2, -9);
            L.fx.burst(tg, MA.dest[f.c.dest].light, 16, 8, 2.4, 1.4, 2);
          }
          if (L.friends && L.friends.ready) L.friends.cheer();
        }
      }
      // hover near the receiver so the happy moment is not missed, then cruise on
      var hover = falls.length || sinceLand < 4;
      ship.speedK = MA.damp(ship.speedK, hover ? 0.07 : 1, hover ? 3.5 : 1.2, dt);

      // --- all four delivered: the rainbow ---
      if (!finale && this.count >= 4 && sinceLand > 4.2 && L.rainbow && L.rainbow.ready) {
        finale = true;
        L.rainbow.start();
      }
    },
  });
})();
