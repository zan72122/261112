/* Wax in motion: reservoir, valve and falling stream, droplets, the spill film on the heated
   surface (shallow height-field that drains to the grille), frozen splats on cold surfaces,
   per-mold wax meshes (free surface, rising solid front, section cap), mist/steam particles and
   the finished block. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;
  const D = EC.D, K = EC.K;
  const MS = EC.moldShape, CS = EC.cassetteShape;
  const WF = EC.WaxFill;
  const ND = WF.ND, NY = WF.NY, Y0 = WF.Y0, DY = WF.DY;
  const half = [0, 0];

  const W = (EC.wax = {});
  /* Mechanism state shared with the interaction layer. */
  EC.mech = {
    lever: { a: 0, v: 0, hand: 0, push: 0 },
    pedal: { down: 0, x: 0 },
    lidTank: { a: 0, v: 0, held: false, max: 1.32 },
    lidChamber: { a: 0, v: 0, held: false, max: 1.82 },
    knob: { a: 0 },
    valve: 0, flowScale: 1,
  };
  EC.envT = { plate: K.Tplate, cold: K.Tcold, chamber: K.Tchamber };
  EC.tank = { level: 0.55, temp: K.Tres, capacity: 170, pellets: [], heat: false };

  // =====================================================================================
  // world: resting surfaces
  // =====================================================================================
  const zones = [
    { name: 'bench', y: 0, x0: D.bench.x0 + 2, x1: D.bench.x1 - 2, z0: D.bench.z0 + 3, z1: D.bench.z1 - 2 },
    { name: 'deck', y: D.deckY, x0: -29.3, x1: 29.3, z0: 2.7, z1: 22.3 },
    { name: 'plate', y: D.plate.y, x0: D.plate.x0, x1: D.plate.x1, z0: D.plate.z0, z1: D.plate.z1 },
    { name: 'wells', y: D.wells.topY, x0: D.wells.x0, x1: D.wells.x1, z0: D.wells.z0, z1: D.wells.z1 },
    { name: 'dish', y: D.dish.floorY, x0: D.dish.x - D.dish.w / 2 + 0.5, x1: D.dish.x + D.dish.w / 2 - 0.5, z0: D.dish.z - D.dish.d / 2 + 0.5, z1: D.dish.z + D.dish.d / 2 - 0.5 },
    { name: 'chamber', y: D.chamber.floorY, x0: D.chamber.x0 + 0.4, x1: D.chamber.x1 - 0.4, z0: D.chamber.z0 + 0.4, z1: D.chamber.z1 - 0.4, on: function () { return EC.mech.lidChamber.a > 0.9; } },
    { name: 'chamberLid', y: D.chamber.rimY + 0.42, x0: D.chamber.x0 - 0.4, x1: D.chamber.x1 + 0.5, z0: D.chamber.z0 - 0.4, z1: D.chamber.z1 + 0.4, on: function () { return EC.mech.lidChamber.a <= 0.9; } },
    { name: 'cold', y: D.cold.plate.y, x0: D.cold.plate.x0, x1: D.cold.plate.x1, z0: D.cold.plate.z0, z1: D.cold.plate.z1 },
    { name: 'coldFrame', y: D.cold.topY + 0.25, x0: D.cold.x0 + 0.3, x1: D.cold.x1 - 0.3, z0: D.cold.z0 + 0.3, z1: D.cold.z1 - 5 },
    { name: 'towerTop', y: D.tower.y1, x0: -29.5, x1: 29.5, z0: -29.5, z1: 1.2 },
    { name: 'tankLid', y: D.tower.y1 + 1.1, x0: D.tank.x0 - 1.2, x1: D.tank.x1 + 1.2, z0: D.tank.z0 - 1.2, z1: D.tank.z1 + 1.4, on: function () { return EC.mech.lidTank.a <= 0.7; } },
    { name: 'tank', y: D.tank.y0, x0: D.tank.x0 + 1, x1: D.tank.x1 - 1, z0: D.tank.z0 + 1, z1: D.tank.z1 - 1, on: function () { return EC.mech.lidTank.a > 0.7; }, dynY: function () { return Math.max(D.tank.floorY + 0.4, D.tank.y0 + EC.tank.level * (D.tank.y1 - D.tank.y0)); } },
  ];
  zones.forEach(function (z) { zones[z.name] = z; });
  EC.zones = zones;
  function zoneY(z) { return z.dynY ? z.dynY() : z.y; }

  /* Highest enabled surface under (x,z). allowed: optional object of zone names. */
  EC.floorAt = function (x, z, allowed, out) {
    let best = null, by = -1e9;
    for (let i = 0; i < zones.length; i++) {
      const zn = zones[i];
      if (allowed && !allowed[zn.name]) continue;
      if (zn.on && !zn.on()) continue;
      if (x < zn.x0 || x > zn.x1 || z < zn.z0 || z > zn.z1) continue;
      // a recess (chamber / open tank) wins over the deck around it
      const y = zoneY(zn), recess = zn.name === 'chamber' || zn.name === 'tank' || zn.name === 'dish';
      if (recess) { best = zn; by = y; break; }
      if (y > by) { by = y; best = zn; }
    }
    out = out || {};
    out.zone = best; out.y = best ? by : 0; out.name = best ? best.name : 'none';
    return out;
  };

  /* Solid volumes the pointer cannot see through (tower, lower body, cold unit). */
  const solids = [
    { x0: -30, x1: 30, y0: D.deckY, y1: D.tower.y1, z0: -30, z1: D.tower.z1 },
    { x0: -30, x1: 30, y0: 0, y1: D.deckY - 0.05, z0: -30, z1: 28 },
    { x0: D.cold.x0, x1: D.cold.x1, y0: 0, y1: D.cold.topY - 0.05, z0: D.cold.z0, z1: D.cold.z1 },
  ];
  function entryT(o, d, b) {
    let t0 = 0, t1 = 1e9;
    const lo = [b.x0, b.y0, b.z0], hi = [b.x1, b.y1, b.z1], oo = [o.x, o.y, o.z], dd = [d.x, d.y, d.z];
    for (let k = 0; k < 3; k++) {
      if (Math.abs(dd[k]) < 1e-7) { if (oo[k] < lo[k] || oo[k] > hi[k]) return -1; continue; }
      let a = (lo[k] - oo[k]) / dd[k], c = (hi[k] - oo[k]) / dd[k];
      if (a > c) { const s = a; a = c; c = s; }
      if (a > t0) t0 = a;
      if (c < t1) t1 = c;
      if (t0 > t1) return -1;
    }
    return t0;
  }

  /* First allowed surface hit by a ray (what the pointer is pointing at). Surfaces hidden behind
     a solid part of the units do not count, so nothing can be dragged "through" the machine. */
  EC.rayFloor = function (ray, allowed, out) {
    let bt = 1e9, found = false;
    const o = ray.ray.origin, d = ray.ray.direction;
    let block = 1e9;
    for (let i = 0; i < solids.length; i++) { const t = entryT(o, d, solids[i]); if (t >= 0 && t < block) block = t; }
    for (let i = 0; i < zones.length; i++) {
      const zn = zones[i];
      if (allowed && !allowed[zn.name]) continue;
      if (zn.on && !zn.on()) continue;
      if (Math.abs(d.y) < 1e-5) continue;
      const y = zoneY(zn), t = (y - o.y) / d.y;
      if (t <= 0 || t >= bt) continue;
      if (t > block + 0.6) continue;
      const x = o.x + d.x * t, z = o.z + d.z * t;
      if (x < zn.x0 || x > zn.x1 || z < zn.z0 || z > zn.z1) continue;
      // the deck plane is not there where the chamber opening is
      if (zn.name === 'deck') { const c = zones.chamber, w = zones.dish; if ((x > c.x0 && x < c.x1 && z > c.z0 && z < c.z1) || (x > w.x0 && x < w.x1 && z > w.z0 && z < w.z1)) continue; }
      if (zn.name === 'towerTop' && zones.tank.on() && x > zones.tank.x0 && x < zones.tank.x1 && z > zones.tank.z0 && z < zones.tank.z1) continue;
      bt = t; found = true;
      out.x = x; out.z = z; out.y = y; out.zone = zn;
    }
    return found;
  };

  // =====================================================================================
  // particles (mist, steam, sparkles)
  // =====================================================================================
  function ParticleSet(n, additive) {
    this.n = n; this.i = 0;
    this.p = new Float32Array(n * 3); this.v = new Float32Array(n * 3);
    this.size = new Float32Array(n); this.alpha = new Float32Array(n);
    this.life = new Float32Array(n); this.max = new Float32Array(n); this.grow = new Float32Array(n); this.a0 = new Float32Array(n); this.drag = new Float32Array(n);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(this.p, 3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('aSize', new T.BufferAttribute(this.size, 1).setUsage(T.DynamicDrawUsage));
    g.setAttribute('aAlpha', new T.BufferAttribute(this.alpha, 1).setUsage(T.DynamicDrawUsage));
    this.mat = new T.ShaderMaterial({
      uniforms: { map: { value: EC.tex.dot }, uScale: { value: 800 }, uColor: { value: new T.Color(1, 1, 1) } },
      vertexShader: 'attribute float aSize; attribute float aAlpha; varying float vA; uniform float uScale;\nvoid main(){ vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(256.0, aSize * uScale / max(1.0, -mv.z)); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform sampler2D map; uniform vec3 uColor; varying float vA;\nvoid main(){ float a = texture2D(map, gl_PointCoord).a * vA; if (a < 0.004) discard; gl_FragColor = vec4(uColor, a); }',
      transparent: true, depthWrite: false, blending: additive ? T.AdditiveBlending : T.NormalBlending,
    });
    this.pts = new T.Points(g, this.mat);
    this.pts.frustumCulled = false;
    this.pts.renderOrder = 30;
    this.pts.userData.noPick = true;
    EC.scene.add(this.pts);
    this.live = 0;
  }
  ParticleSet.prototype.spawn = function (x, y, z, vx, vy, vz, size, alpha, life, grow, drag) {
    const i = this.i; this.i = (i + 1) % this.n;
    this.p[i * 3] = x; this.p[i * 3 + 1] = y; this.p[i * 3 + 2] = z;
    this.v[i * 3] = vx; this.v[i * 3 + 1] = vy; this.v[i * 3 + 2] = vz;
    this.size[i] = size; this.a0[i] = alpha; this.alpha[i] = 0; this.life[i] = life; this.max[i] = life; this.grow[i] = grow || 0; this.drag[i] = drag || 0;
  };
  ParticleSet.prototype.update = function (dt) {
    let live = 0;
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) { if (this.alpha[i] !== 0) this.alpha[i] = 0; continue; }
      live++;
      this.life[i] -= dt;
      const k = Math.exp(-this.drag[i] * dt);
      this.v[i * 3] *= k; this.v[i * 3 + 1] *= k; this.v[i * 3 + 2] *= k;
      this.p[i * 3] += this.v[i * 3] * dt; this.p[i * 3 + 1] += this.v[i * 3 + 1] * dt; this.p[i * 3 + 2] += this.v[i * 3 + 2] * dt;
      this.size[i] += this.grow[i] * dt;
      const t = 1 - Math.max(0, this.life[i]) / this.max[i];
      this.alpha[i] = this.a0[i] * Math.min(1, t * 6) * (1 - t) * (1 - t);
    }
    if (live || this.live) {
      const g = this.pts.geometry;
      g.attributes.position.needsUpdate = true; g.attributes.aSize.needsUpdate = true; g.attributes.aAlpha.needsUpdate = true;
    }
    this.live = live;
    this.pts.visible = live > 0;
  };

  // =====================================================================================
  // droplets and frozen splats
  // =====================================================================================
  const MAXD = 72, MAXS = 110;
  const drops = [];
  let dropMesh = null, splatMesh = null, splatI = 0;
  const m4 = new T.Matrix4(), qI = new T.Quaternion(), v3 = new T.Vector3(), s3 = new T.Vector3();
  const splats = [];

  W.drop = function (x, y, z, vx, vy, vz, vol, temp) {
    if (drops.length >= MAXD) return;
    drops.push({ x: x, y: y, z: z, vx: vx, vy: vy, vz: vz, vol: vol, t: temp === undefined ? 60 : temp, age: 0 });
  };

  W.splat = function (x, y, z, vol, instant) {
    const r = 0.22 + 0.55 * Math.sqrt(Math.max(0.005, vol));
    const s = { x: x, y: y, z: z, r: r, t: instant ? 1 : 0, rot: Math.random() * 6.3, sx: 0.8 + Math.random() * 0.5 };
    splats[splatI] = s; s.i = splatI;
    splatI = (splatI + 1) % MAXS;
    W.splatDirty = true;
  };

  function updateDrops(dt) {
    const fl = {};
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.age += dt;
      d.vy -= 620 * dt;
      d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt;
      let land = false, ly = 0;
      // a mold cavity in the way?
      const hit = W.moldAt(d.x, d.z, d.y);
      if (hit && d.y <= hit.y) { land = true; ly = hit.y; }
      else {
        EC.floorAt(d.x, d.z, null, fl);
        if (d.y <= fl.y) { land = true; ly = fl.y; }
        else if (d.y < -1) { drops.splice(i, 1); continue; }
      }
      if (land) {
        drops.splice(i, 1);
        W.deposit(d.x, ly, d.z, d.vol, d.t, hit, fl.name, Math.abs(d.vy));
      }
    }
    dropMesh.count = drops.length;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      const r = Math.max(0.07, Math.cbrt(d.vol * 0.24));
      const st = 1 + Math.min(0.9, Math.abs(d.vy) * 0.006);
      v3.set(d.x, d.y, d.z); s3.set(r / Math.sqrt(st), r * st, r / Math.sqrt(st));
      m4.compose(v3, qI, s3);
      dropMesh.setMatrixAt(i, m4);
    }
    if (drops.length || dropMesh.userData.had) dropMesh.instanceMatrix.needsUpdate = true;
    dropMesh.userData.had = drops.length > 0;
    dropMesh.visible = drops.length > 0;
  }

  const eul = new T.Euler();
  function updateSplats(dt) {
    let any = W.splatDirty;
    for (let i = 0; i < splats.length; i++) { const s = splats[i]; if (s && s.t < 1) { s.t = Math.min(1, s.t + dt * 2.6); any = true; } }
    if (!any) return;
    W.splatDirty = false;
    let n = 0;
    for (let i = 0; i < splats.length; i++) {
      const s = splats[i];
      if (!s) continue;
      const e = U.easeOutCubic(s.t);
      v3.set(s.x, s.y + 0.012, s.z); s3.set(s.r * s.sx * (0.5 + 0.5 * e), s.r * 0.16 * (1.6 - 0.6 * e), s.r * (0.5 + 0.5 * e) / s.sx);
      eul.set(0, s.rot, 0); qI.setFromEuler(eul);
      m4.compose(v3, qI, s3);
      splatMesh.setMatrixAt(n++, m4);
    }
    qI.identity();
    splatMesh.count = n;
    splatMesh.instanceMatrix.needsUpdate = true;
    splatMesh.visible = n > 0;
    EC.touchShadow();
  }

  /* Which mold cavity (if any) is under a point. Returns {mold, y (world surface), lx, lz, inCav}. */
  const moldHit = { mold: null, y: 0, lx: 0, lz: 0, inCav: false, onCassette: false };
  W.moldAt = function (x, z, y) {
    const molds = EC.items.molds;
    for (let i = 0; i < molds.length; i++) {
      const m = molds[i];
      if (m.where === 'chamber' || m.inBlock) continue;
      const p = m.obj.position;
      const lx = x - p.x, lz = z - p.z;
      if (Math.abs(lx) > MS.outerHx || Math.abs(lz) > MS.outerHz) continue;
      if (y !== undefined && (y < p.y - 0.5 || y > p.y + 14)) continue;
      const inCav = Math.abs(lx) < 2.08 && Math.abs(lz) < 1.48;
      const c = m.cassette;
      let sy = MS.rimY;
      let onCas = false;
      if (inCav) {
        const inWell = Math.abs(lx) < 1.5 && Math.abs(lz) < 1.2;
        const base = inWell ? MS.floorY : MS.ledgeY;
        sy = m.fill && m.fill.vol > 0.01 ? Math.max(base, m.fill.liq) : base;
        if (c) { onCas = true; sy = Math.max(sy, c.seatY + CS.floor); if (lx > 1.25) sy = c.seatY + 0.4; }
      }
      moldHit.mold = m; moldHit.y = p.y + sy; moldHit.lx = lx; moldHit.lz = lz; moldHit.inCav = inCav; moldHit.onCassette = onCas;
      return moldHit;
    }
    return null;
  };

  /* Wax arriving somewhere: into a mold, onto the hot plate (film), or onto a cool surface (splat). */
  W.deposit = function (x, y, z, vol, temp, hit, zoneName, speed) {
    if (hit === undefined) hit = W.moldAt(x, z, y + 0.3);
    if (hit && hit.inCav && !(hit.onCassette && hit.lx > 1.25)) {
      const m = hit.mold;
      if (!m.fill) EC.sim.attachFill(m);
      m.fill.pour(vol, temp);
      m.fill.ripple = Math.min(1, m.fill.ripple + vol * 3 + 0.12);
      m.fill.rx = hit.lx; m.fill.rz = hit.lz;
      EC.sim.focus = m;
      EC.emit('waxIn', m, vol, hit);
      return 'mold';
    }
    if (zoneName === undefined) zoneName = EC.floorAt(x, z).name;
    if (hit) {
      // flange / writing face: runs off the side
      const sx = Math.abs(hit.lx) / MS.outerHx > Math.abs(hit.lz) / MS.outerHz;
      const ox = sx ? Math.sign(hit.lx) * (MS.outerHx + 0.25) : hit.lx, oz = sx ? hit.lz : Math.sign(hit.lz) * (MS.outerHz + 0.25);
      W.drop(hit.mold.obj.position.x + ox, y, hit.mold.obj.position.z + oz, (sx ? Math.sign(hit.lx) : 0) * 6, 0, (sx ? 0 : Math.sign(hit.lz)) * 6, vol, temp);
      EC.emit('splash', x, y, z, vol, 'steel');
      return 'rim';
    }
    if (zoneName === 'plate') {
      W.spill.inject(x, z, vol);
      EC.emit('splash', x, y, z, vol, 'plate', speed);
      return 'plate';
    }
    if (zoneName === 'tank') { EC.tank.level = Math.min(1, EC.tank.level + vol / EC.tank.capacity); return 'tank'; }
    W.splat(x, y, z, vol, zoneName === 'cold');
    EC.emit('splash', x, y, z, vol, zoneName === 'cold' ? 'cold' : 'dry', speed);
    return 'splat';
  };

  // =====================================================================================
  // spill film on the heated work surface
  // =====================================================================================
  const SP = (W.spill = { nx: 48, nz: 36, total: 0, drained: 0 });
  (function () {
    const nx = SP.nx, nz = SP.nz, n = nx * nz;
    const pl = D.plate, cw = (pl.x1 - pl.x0) / nx, cd = (pl.z1 - pl.z0) / nz, ca = cw * cd;
    const h = (SP.h = new Float32Array(n)), gnd = new Float32Array(n), blk = new Uint8Array(n), sink = new Uint8Array(n), flow = new Float32Array(n);
    const gcx = (D.grille.x0 + D.grille.x1) / 2, gcz = (D.grille.z0 + D.grille.z1) / 2;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const x = pl.x0 + (i + 0.5) * cw, z = pl.z0 + (j + 0.5) * cd;
      const dx = Math.max(0, Math.abs(x - gcx) - 5), dz = z - gcz;
      gnd[j * nx + i] = 0.02 * Math.hypot(dx, dz);
      if (x > D.grille.x0 && x < D.grille.x1 && z > D.grille.z0 && z < D.grille.z1) sink[j * nx + i] = 1;
      if (i === 0 || j === 0 || i === nx - 1 || j === nz - 1) sink[j * nx + i] = 2;
    }
    SP.cell = function (x, z) {
      const i = Math.floor((x - pl.x0) / cw), j = Math.floor((z - pl.z0) / cd);
      if (i < 0 || j < 0 || i >= nx || j >= nz) return -1;
      return j * nx + i;
    };
    SP.inject = function (x, z, vol) {
      const c = SP.cell(x, z);
      if (c < 0) return;
      const i0 = c % nx, j0 = (c / nx) | 0;
      let cnt = 0;
      const list = [];
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const i = i0 + di, j = j0 + dj;
        if (i < 0 || j < 0 || i >= nx || j >= nz || blk[j * nx + i]) continue;
        list.push(j * nx + i); cnt++;
      }
      if (!cnt) { list.push(c); cnt = 1; }
      for (let k = 0; k < cnt; k++) h[list[k]] += vol / ca / cnt;
      SP.total += vol; SP.awake = true;
    };
    SP.thickAt = function (x, z) { const c = SP.cell(x, z); return c < 0 ? 0 : h[c]; };

    let geom, mesh, thick, pos, nor;
    SP.build = function () {
      geom = new T.PlaneGeometry(pl.x1 - pl.x0, pl.z1 - pl.z0, nx, nz);
      geom.rotateX(-Math.PI / 2);
      geom.translate((pl.x0 + pl.x1) / 2, pl.y + 0.012, (pl.z0 + pl.z1) / 2);
      pos = geom.attributes.position; nor = geom.attributes.normal;
      thick = new T.BufferAttribute(new Float32Array(pos.count), 1);
      geom.setAttribute('aThick', thick);
      const mat = new T.MeshStandardMaterial({ color: 0x000000, emissive: EC.mats.waxColors.liquid, emissiveIntensity: 0.35, roughness: 0.05, metalness: 0, transparent: true, depthWrite: false, envMapIntensity: 1.4 });
      SP.mat = EC.mats.patch(mat, 'spill', {
        vpars: 'attribute float aThick;\nvarying float vThick;',
        vmain: 'vThick = aThick;',
        fpars: 'varying float vThick;',
        fcolor: 'if (vThick < 0.012) discard;\nfloat wEdge = smoothstep(0.012, 0.022, vThick);\nfloat wRim = wEdge * (1.0 - smoothstep(0.022, 0.055, vThick));\ndiffuseColor.a = wEdge * (0.3 + 0.4 * smoothstep(0.02, 0.2, vThick)) + wRim * 0.22;',
        fend: 'diffuseColor.a = clamp(diffuseColor.a + dot(totalSpecular, vec3(0.3333)) * 0.9 * wEdge, 0.0, 1.0);',
      });
      mesh = new T.Mesh(geom, mat);
      mesh.renderOrder = 6; mesh.visible = false; mesh.frustumCulled = false;
      mesh.userData.noPick = true;
      EC.rig.plateMesh.parent.add(mesh);
      SP.mesh = mesh;
    };

    SP.update = function (dt) {
      if (!SP.awake) return;
      // obstacles: molds standing on the plate
      blk.fill(0);
      const molds = EC.items.molds;
      for (let m = 0; m < molds.length; m++) {
        const mo = molds[m];
        if (mo.where !== 'plate' && !(mo.held && mo.sliding)) continue;
        const p = mo.obj.position;
        const i0 = Math.max(0, Math.floor((p.x - 1.5 - pl.x0) / cw)), i1 = Math.min(nx - 1, Math.floor((p.x + 1.5 - pl.x0) / cw));
        const j0 = Math.max(0, Math.floor((p.z - 1.2 - pl.z0) / cd)), j1 = Math.min(nz - 1, Math.floor((p.z + 1.2 - pl.z0) / cd));
        for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
          const c = j * nx + i;
          blk[c] = 1;
          if (h[c] > 0) {
            // squeeze the film out sideways
            const left = i - i0 < i1 - i, t = left ? (i0 > 0 ? j * nx + i0 - 1 : -1) : (i1 < nx - 1 ? j * nx + i1 + 1 : -1);
            if (t >= 0) h[t] += h[c];
            h[c] = 0;
          }
        }
      }
      const RATE = 15;
      const steps = Math.max(1, Math.ceil((RATE * dt) / 0.2)), sdt = dt / steps;
      let drained = 0;
      for (let s = 0; s < steps; s++) {
        flow.fill(0);
        for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
          const a = j * nx + i;
          if (blk[a]) continue;
          for (let dir = 0; dir < 2; dir++) {
            if (dir === 0 && i === nx - 1) continue;
            if (dir === 1 && j === nz - 1) continue;
            const b = dir === 0 ? a + 1 : a + nx;
            if (blk[b]) continue;
            const d = gnd[a] + h[a] - gnd[b] - h[b];
            const src = d > 0 ? a : b, hs = h[src];
            if (hs < 0.008) continue;
            let f = Math.abs(d) * RATE * sdt * Math.min(1, hs * 12);
            f = Math.min(f, hs * 0.22);
            if (d > 0) { flow[a] -= f; flow[b] += f; } else { flow[a] += f; flow[b] -= f; }
          }
        }
        for (let c = 0; c < n; c++) {
          let v = h[c] + flow[c];
          if (v < 0) v = 0;
          if (sink[c] && v > 0) { const o = v * Math.min(1, (sink[c] === 1 ? 9 : 4) * sdt); v -= o; drained += o * ca; }
          h[c] = v;
        }
      }
      let tot = 0;
      for (let c = 0; c < n; c++) {
        // the last film creeps off slowly
        if (h[c] > 0 && h[c] < 0.02) { const o = h[c] * Math.min(1, 0.5 * dt); h[c] -= o; drained += o * ca * 0.2; }
        tot += h[c];
      }
      SP.total = tot * ca;
      if (drained > 0) { SP.drained += drained; EC.emit('drain', drained); }
      // mesh
      const pa = pos.array, ta = thick.array, na = nor.array;
      const vx = nx + 1;
      for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
        let s = 0, cnt = 0;
        for (let dj = -1; dj <= 0; dj++) for (let di = -1; di <= 0; di++) {
          const ci = i + di, cj = j + dj;
          if (ci < 0 || cj < 0 || ci >= nx || cj >= nz) { cnt++; continue; }
          s += h[cj * nx + ci]; cnt++;
        }
        const v = j * vx + i, tv = s / cnt;
        ta[v] = tv;
        pa[v * 3 + 1] = pl.y + 0.012 + Math.min(0.3, tv) * 0.7;
      }
      for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
        const v = j * vx + i;
        const l = ta[v - (i > 0 ? 1 : 0)], r = ta[v + (i < nx ? 1 : 0)], u = ta[v - (j > 0 ? vx : 0)], dn = ta[v + (j < nz ? vx : 0)];
        let ax = (l - r) * 3.2, az = (u - dn) * 3.2;
        const il = 1 / Math.sqrt(ax * ax + az * az + 1);
        na[v * 3] = ax * il; na[v * 3 + 1] = il; na[v * 3 + 2] = az * il;
      }
      pos.needsUpdate = true; thick.needsUpdate = true; nor.needsUpdate = true;
      mesh.visible = SP.total > 0.004;
      if (SP.total < 0.002) { h.fill(0); SP.awake = false; mesh.visible = false; }
    };
  })();

  // =====================================================================================
  // the falling stream
  // =====================================================================================
  const ST = (W.stream = { q: 0, parcels: [], acc: 0, landing: 0, sputter: 0, dripT: 0, drips: 0, hiss: 0, flowing: false, landKind: 'plate' });
  const SEG = 7, MAXP = 56, GRAV = 620;
  let streamMesh = null, streamPos = null;

  function buildStream() {
    const g = new T.BufferGeometry();
    streamPos = new T.BufferAttribute(new Float32Array(MAXP * SEG * 3), 3).setUsage(T.DynamicDrawUsage);
    g.setAttribute('position', streamPos);
    g.setAttribute('normal', new T.BufferAttribute(new Float32Array(MAXP * SEG * 3), 3).setUsage(T.DynamicDrawUsage));
    const idx = [];
    for (let i = 0; i < MAXP - 1; i++) for (let s = 0; s < SEG; s++) {
      const a = i * SEG + s, b = i * SEG + ((s + 1) % SEG), c = a + SEG, e = b + SEG;
      idx.push(a, b, c, b, e, c);
    }
    g.setIndex(idx);
    W.streamMat = EC.mats.waxLiquid(0.42);
    streamMesh = new T.Mesh(g, W.streamMat);
    streamMesh.frustumCulled = false; streamMesh.renderOrder = 12; streamMesh.visible = false;
    streamMesh.userData.noPick = true;
    EC.scene.add(streamMesh);
    dropMesh = new T.InstancedMesh(new T.SphereGeometry(1, 10, 8), W.streamMat, MAXD);
    dropMesh.frustumCulled = false; dropMesh.renderOrder = 12; dropMesh.count = 0; dropMesh.visible = false;
    dropMesh.userData.noPick = true;
    EC.scene.add(dropMesh);
    splatMesh = new T.InstancedMesh(new T.SphereGeometry(1, 12, 8), EC.mats.waxSolid(), MAXS);
    splatMesh.frustumCulled = false; splatMesh.count = 0; splatMesh.visible = false; splatMesh.receiveShadow = true;
    splatMesh.userData.noPick = true;
    EC.scene.add(splatMesh);
  }

  function updateStream(dt, time) {
    const nz = D.nozzle, tank = EC.tank, mech = EC.mech;
    const valve = mech.valve;
    let want = 2.7 * valve * mech.flowScale;
    // an almost empty reservoir sucks air: the flow breaks up and spits
    let sput = 0;
    if (tank.level <= 0.004) { want = 0; sput = valve > 0.05 ? 1 : 0; }
    else if (tank.level < 0.07) { sput = 1 - tank.level / 0.07; }
    ST.sputter = sput * (valve > 0.05 ? 1 : 0);
    if (sput > 0 && valve > 0.05) {
      const gate = Math.sin(time * 31) * Math.sin(time * 17.3 + 1.7) + Math.sin(time * 53.1) * 0.5;
      want *= gate > 0.1 + sput * 0.5 ? 1 : 0;
      if (Math.random() < dt * 14 * sput && tank.level > 0.0003) {
        const v = 0.02 + Math.random() * 0.03;
        W.drop(nz.x + (Math.random() - 0.5) * 0.3, nz.y - 0.1, nz.z + (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 22, -10 - Math.random() * 30, (Math.random() - 0.5) * 22, v, tank.temp - 2);
        tank.level = Math.max(0, tank.level - v / tank.capacity);
        EC.emit('sputter', 1);
      }
    }
    ST.q += (want - ST.q) * Math.min(1, dt * 26);
    if (ST.q < 0.03) ST.q = 0;
    const q = ST.q;
    const wasFlowing = ST.flowing;
    ST.flowing = q > 0.05;
    if (wasFlowing && !ST.flowing && valve < 0.05) { ST.drips = 3; ST.dripT = 0.28; }
    if (ST.flowing) ST.drips = 0;
    // after-drips from the nozzle
    if (ST.drips > 0 && tank.level > 0.001) {
      ST.dripT -= dt;
      if (ST.dripT <= 0) {
        W.drop(nz.x, nz.y - 0.12, nz.z, 0, -4, 0, 0.035, tank.temp - 2);
        ST.drips--; ST.dripT = 0.4 + (3 - ST.drips) * 0.5;
      }
    }

    // where does it land right now?
    const hit = W.moldAt(nz.x, nz.z, nz.y - 1);
    let landY = D.plate.y;
    if (hit) landY = hit.y;
    ST.landY = landY; ST.landKind = hit ? (hit.inCav ? 'mold' : 'rim') : 'plate';

    // emit parcels
    const v0 = 15 + 9 * Math.min(1, q / 2.7);
    const par = ST.parcels;
    const EMIT = 1 / 100;
    ST.acc += dt;
    while (ST.acc >= EMIT) {
      ST.acc -= EMIT;
      if (q > 0.02 && tank.level > 0) {
        const age = ST.acc;
        par.unshift({ age: age, q: q, v0: v0, wob: (Math.random() - 0.5) * (0.02 + sput * 0.25), wob2: (Math.random() - 0.5) * (0.02 + sput * 0.25), vol: q * EMIT, link: true });
        tank.level = Math.max(0, tank.level - (q * EMIT) / tank.capacity);
      } else if (par.length && par[0].link) par.unshift({ age: ST.acc, q: 0, v0: v0, wob: 0, wob2: 0, vol: 0, link: false, gap: true });
    }
    // advance + land
    let landed = 0, landSpeed = 0;
    for (let i = par.length - 1; i >= 0; i--) {
      const p = par[i];
      p.age += dt;
      p.y = nz.y - p.v0 * p.age - 0.5 * GRAV * p.age * p.age;
      if (p.y <= landY || par.length > MAXP) {
        if (p.vol > 0) { landed += p.vol; landSpeed = p.v0 + GRAV * p.age; }
        par.splice(i, 1);
      }
    }
    if (landed > 0) {
      const kind = W.deposit(nz.x, landY, nz.z, landed, tank.temp - 2, hit, hit ? undefined : 'plate', landSpeed);
      ST.landing = Math.min(1, ST.landing + dt * 10);
      ST.lastKind = kind;
    } else ST.landing = Math.max(0, ST.landing - dt * 6);

    // tube mesh
    const pa = streamPos.array, na = streamMesh.geometry.attributes.normal.array;
    const n = Math.min(par.length, MAXP);
    let vis = false;
    for (let i = 0; i < MAXP; i++) {
      let x = nz.x, y = nz.y, z = nz.z, r = 0;
      if (i < n) {
        const p = par[i];
        const sp = p.v0 + GRAV * p.age;
        r = p.q > 0 ? Math.sqrt(p.q / (Math.PI * sp)) * 1.35 : 0;
        const first = i === 0, lastOne = i === n - 1;
        const prevGap = !first && par[i - 1].q <= 0, nextGap = !lastOne && par[i + 1].q <= 0;
        if ((first && q <= 0.02) || prevGap || nextGap) r *= 0.45;
        if (lastOne && p.y - landY < 0.5) r *= 1.5;       // foot of the stream spreads
        y = Math.max(landY, p.y);
        const w = 1 - Math.exp(-p.age * 9);
        x += p.wob * w * 3 + Math.sin(time * 23 + p.age * 40) * 0.012; z += p.wob2 * w * 3;
        if (r > 0) vis = true;
      } else if (n > 0) { y = Math.max(landY, par[n - 1].y); }
      if (i === 0 && n > 0 && q > 0.02) { y = nz.y + 0.05; r = Math.max(r, 0.2); }
      for (let s = 0; s < SEG; s++) {
        const a = (s / SEG) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), o = (i * SEG + s) * 3;
        pa[o] = x + c * r; pa[o + 1] = y; pa[o + 2] = z + sn * r;
        na[o] = c; na[o + 1] = 0.15; na[o + 2] = sn;
      }
    }
    streamPos.needsUpdate = true; streamMesh.geometry.attributes.normal.needsUpdate = true;
    streamMesh.visible = vis;
    if (vis) EC.touchShadow();
  }

  // =====================================================================================
  // reservoir: level, temperature, pellets
  // =====================================================================================
  let pelletMesh = null;
  const MAXPEL = 70;
  function updateTank(dt, time) {
    const tank = EC.tank, R = EC.rig;
    // floating pellets melt into the bath
    const yS = D.tank.y0 + tank.level * (D.tank.y1 - D.tank.y0);
    let n = 0, melting = 0;
    for (let i = tank.pellets.length - 1; i >= 0; i--) {
      const p = tank.pellets[i];
      if (p.fall) {
        p.vy -= 500 * dt; p.y += p.vy * dt; p.x += p.vx * dt; p.z += p.vz * dt;
        const fl = Math.max(yS, D.tank.floorY + 0.5);
        if (p.y <= fl) { p.fall = false; p.y = fl; EC.emit('plop', p.x, p.y, p.z); }
      } else {
        const hot = tank.temp > K.Tm + 0.5;
        if (hot) { const dm = dt / 4.2; p.m -= dm; melting++; tank.level = Math.min(1, tank.level + (dm * p.vol) / tank.capacity); tank.temp -= dm * 0.2; }
        p.y = Math.max(yS, D.tank.floorY + 0.45) - 0.1;
        p.x += Math.sin(time * 0.9 + i) * 0.05 * dt; p.z += Math.cos(time * 0.7 + i * 1.7) * 0.05 * dt;
        if (p.m <= 0) { tank.pellets.splice(i, 1); continue; }
      }
    }
    for (let i = 0; i < tank.pellets.length && n < MAXPEL; i++) {
      const p = tank.pellets[i], s = 0.36 * Math.cbrt(Math.max(0.02, p.m));
      v3.set(p.x, p.y, p.z); s3.set(s, s * 0.8, s);
      m4.compose(v3, qI, s3);
      pelletMesh.setMatrixAt(n++, m4);
    }
    pelletMesh.count = n; pelletMesh.visible = n > 0;
    if (n) pelletMesh.instanceMatrix.needsUpdate = true;
    tank.melting = melting;
    // thermostat
    const lidLoss = EC.mech.lidTank.a > 0.3 ? 0.035 : 0;
    tank.temp -= (tank.temp - K.Tamb) * (0.0012 + lidLoss * 0.02) * dt;
    const heat = tank.temp < K.Tres - 0.05;
    if (heat) tank.temp += Math.min(K.Tres - tank.temp, 0.9 * dt);
    tank.heat = heat && (tank.temp < K.Tres - 0.2 || melting > 0);
    R.setLevel(tank.level);
    // work surface / cold plate regulate with a little hysteresis ripple
    let load = 0;
    const molds = EC.items.molds;
    for (let i = 0; i < molds.length; i++) if (molds[i].where === 'cold' && molds[i].fill && molds[i].fill.tMean > 20) load += (molds[i].fill.tMean - 20) / 40;
    EC.envT.plate = K.Tplate + 0.25 * Math.sin(time * 0.61) + 0.1 * Math.sin(time * 1.9);
    EC.envT.cold = U.damp(EC.envT.cold, K.Tcold + 0.3 * Math.sin(time * 0.47) + Math.min(2.5, load * 1.6), 0.5, dt);
    EC.envT.chamber = K.Tchamber + 0.2 * Math.sin(time * 0.33 + 1) - (EC.mech.lidChamber.a > 0.5 ? 1.4 : 0) * U.sat(EC.mech.lidChamber.a);
  }

  W.addPellet = function (x, y, z, vx, vy, vz) {
    if (EC.tank.pellets.length >= MAXPEL) return false;
    EC.tank.pellets.push({ x: x, y: y, z: z, vx: vx, vy: vy, vz: vz, fall: true, m: 1, vol: 1.1 });
    return true;
  };

  // =====================================================================================
  // per-mold wax view
  // =====================================================================================
  const NU = 20, NV = 14, FU = 14, FV = 10, CU = 26, CL = 6, CUp = 5;
  function spaced(i, n) { return Math.sin((Math.PI / 2) * ((i / n) * 2 - 1)); }

  function WaxView(mold) {
    const fill = mold.fill;
    this.mold = mold; this.fill = fill;
    this.plane = mold.plane;
    this.group = new T.Group();
    mold.obj.add(this.group);
    const clip = [mold.plane];

    // free surface
    let g = new T.BufferGeometry();
    const nv = (NU + 1) * (NV + 1);
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('normal', new T.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('aField', new T.BufferAttribute(new Float32Array(nv * 2), 2).setUsage(T.DynamicDrawUsage));
    let idx = [];
    for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, e = c + 1; idx.push(a, c, b, b, c, e); }
    g.setIndex(idx);
    this.topMat = EC.mats.waxField(fill.tex, { alpha: 0.2, side: T.FrontSide });
    this.topMat.clippingPlanes = clip;
    this.top = new T.Mesh(g, this.topMat);
    this.top.renderOrder = 9; this.top.frustumCulled = false; this.top.userData.noPick = true;

    // rising solid front (seen through the still-clear liquid)
    g = new T.BufferGeometry();
    const nf = (FU + 1) * (FV + 1);
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(nf * 3), 3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('normal', new T.BufferAttribute(new Float32Array(nf * 3), 3).setUsage(T.DynamicDrawUsage));
    idx = [];
    for (let j = 0; j < FV; j++) for (let i = 0; i < FU; i++) { const a = j * (FU + 1) + i, b = a + 1, c = a + FU + 1, e = c + 1; idx.push(a, c, b, b, c, e); }
    g.setIndex(idx);
    this.frontMat = EC.mats.waxSolid();
    this.frontMat.clippingPlanes = clip;
    this.front = new T.Mesh(g, this.frontMat);
    this.front.frustumCulled = false; this.front.visible = false; this.front.userData.noPick = true;

    // section cap (z = 0 plane): lower block = well, upper block = ledge / cassette region
    g = new T.BufferGeometry();
    const rows = CL + 1 + CUp + 1, nc = (CU + 1) * rows;
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(nc * 3), 3).setUsage(T.DynamicDrawUsage));
    const nn = new Float32Array(nc * 3);
    for (let i = 0; i < nc; i++) nn[i * 3 + 2] = 1;
    g.setAttribute('normal', new T.BufferAttribute(nn, 3));
    g.setAttribute('aField', new T.BufferAttribute(new Float32Array(nc * 2), 2).setUsage(T.DynamicDrawUsage));
    idx = [];
    for (let r = 0; r < rows - 1; r++) {
      if (r === CL) continue;
      for (let i = 0; i < CU; i++) { const a = r * (CU + 1) + i, b = a + 1, c = a + CU + 1, e = c + 1; idx.push(a, b, c, b, e, c); }
    }
    g.setIndex(idx);
    this.capMat = EC.mats.waxField(fill.tex, { alpha: 0.5, side: T.DoubleSide });
    this.cap = new T.Mesh(g, this.capMat);
    this.cap.renderOrder = 14; this.cap.frustumCulled = false; this.cap.visible = false; this.cap.userData.noPick = true;

    // cut face of the pressed-steel mold, drawn as a dark technical outline
    this.steel = new T.Mesh(steelSectionGeometry(), steelSectionMat());
    this.steel.visible = false; this.steel.renderOrder = 13; this.steel.userData.noPick = true;
    this.group.add(this.front, this.top, this.cap);
    mold.obj.add(this.steel);
    this.time = 0;
  }
  let _ssg = null, _ssm = null;
  function steelSectionGeometry() {
    if (_ssg) return _ssg;
    const half = [[0, -0.012], [1.52, -0.012], [1.64, 0.7], [2.15, 0.72], [2.22, 1.19], [2.42, 1.19], [2.42, 1.275], [2.13, 1.275], [2.05, 0.77], [1.55, 0.76], [1.44, 0.085], [0, 0.085]];
    const pts = half.map(function (p) { return new T.Vector2(p[0], p[1]); });
    for (let i = half.length - 1; i >= 0; i--) pts.push(new T.Vector2(-half[i][0], half[i][1]));
    // two mirrored halves share the centre line: build as two shapes to keep each simple
    const right = new T.Shape(half.map(function (p) { return new T.Vector2(p[0], p[1]); }));
    const left = new T.Shape(half.map(function (p) { return new T.Vector2(-p[0], p[1]); }).reverse());
    _ssg = new T.ShapeGeometry([right, left]);
    return _ssg;
  }
  function steelSectionMat() {
    if (!_ssm) _ssm = new T.MeshBasicMaterial({ color: 0x2c3138, side: T.DoubleSide });
    return _ssm;
  }

  /* Height of the wax surface at local (x,z), including meniscus, slosh and ripples. */
  WaxView.prototype.surf = function (x, z, HX, HZ, pcx, phx, phz, time) {
    const f = this.fill;
    const dCav = Math.min(HX - Math.abs(x), HZ - Math.abs(z));
    const dn = U.sat(dCav / Math.min(HX, HZ));
    let y = f.surfaceAt(dn);
    const dp = Math.max(0, Math.min(phx - Math.abs(x - pcx), phz - Math.abs(z)));
    const k = Math.min(ND - 1, Math.floor(dn * ND));
    const liq = f.frozen[k] ? 0 : 1;
    const lim = f.topLimit() - MS.dome;
    if (f.liq > lim + 0.004) {
      // above the rim: a dome pinned at the edge by surface tension
      const e = 1 - Math.exp(-dp / 0.2);
      y = lim + (y - lim) * e;
    } else y += 0.065 * Math.exp(-dp / 0.14) * (0.35 + 0.65 * liq);   // wetting meniscus climbs the wall
    if (liq) {
      const s = f.slosh;
      y += (s.x * (x - pcx)) / phx + (s.z * z) / phz;
      if (f.ripple > 0.01) {
        const r = Math.hypot(x - f.rx, z - f.rz);
        y += f.ripple * 0.03 * Math.sin(13 * r - 17 * time) * Math.exp(-1.5 * r) * Math.min(1, dp * 5);
      }
    } else y += (f.tiltX * (x - pcx)) / phx + (f.tiltZ * z) / phz;
    this._dn = dn;
    return y;
  };

  WaxView.prototype.update = function (dt, time, force) {
    const f = this.fill, mold = this.mold;
    const has = f.vol > 0.01 && f.nAct > 0;
    this.group.visible = has;
    if (!has) return;
    const moving = f.dirty || f.ripple > 0.01 || Math.abs(f.slosh.x) + Math.abs(f.slosh.z) > 0.001 || force || this.secT > 0.001;
    if (!moving && this.done) return;
    this.done = true;
    f.dirty = false;
    const c = mold.cassette;
    // the set wax pulls away from the steel as it shrinks
    const sh = 1 - 0.035 * U.smooth(0.75, 1, f.phi) * U.smooth(50, 20, f.tMean);
    this.group.scale.set(sh, 1, sh);
    const lv = Math.min(f.liq, MS.rimY);
    MS.half(lv, half);
    const HX = half[0], HZ = half[1];
    let pcx = 0, phx = HX, phz = HZ;
    this.inCassette = false;
    if (c && f.liq > c.seatY + CS.floor + 0.015) { pcx = CS.innerCx; phx = CS.innerHx; phz = CS.innerHz; this.inCassette = true; }
    const vTop = (Math.max(0, f.nAct - 1) + 0.5) / NY;

    // --- free surface ---
    let pa = this.top.geometry.attributes.position.array, fa = this.top.geometry.attributes.aField.array;
    let o = 0, o2 = 0;
    for (let j = 0; j <= NV; j++) {
      const sv = spaced(j, NV);
      for (let i = 0; i <= NU; i++) {
        const su = spaced(i, NU);
        const x = pcx + su * phx, z = sv * phz;
        const y = this.surf(x, z, HX, HZ, pcx, phx, phz, time);
        pa[o++] = x; pa[o++] = y; pa[o++] = z;
        fa[o2++] = (this._dn * (ND - 1) + 0.5) / ND; fa[o2++] = vTop;
      }
    }
    this.top.geometry.attributes.position.needsUpdate = true;
    this.top.geometry.attributes.aField.needsUpdate = true;
    this.top.geometry.computeVertexNormals();

    // --- solid front ---
    let fmax = 0;
    for (let k = 0; k < ND; k++) fmax = Math.max(fmax, f.front[k]);
    const showFront = fmax > 0.03 && f.phi < 0.999;
    this.front.visible = showFront;
    if (showFront) {
      pa = this.front.geometry.attributes.position.array; o = 0;
      const wx = MS.wellHx, wz = MS.wellHz;
      for (let j = 0; j <= FV; j++) {
        const sv = spaced(j, FV);
        for (let i = 0; i <= FU; i++) {
          const su = spaced(i, FU);
          const dn = U.sat(Math.min(wx * (1 - Math.abs(su)), wz * (1 - Math.abs(sv))) / wz);
          const s = f.frontAt(dn);
          let y = Y0 + s;
          if (s < 0.012) y = Y0 - 0.03;
          MS.half(Math.max(Y0, y), half);
          y = Math.min(y, f.surfaceAt(dn) - 0.004);
          pa[o++] = su * (half[0] - 0.01); pa[o++] = y; pa[o++] = sv * (half[1] - 0.01);
        }
      }
      this.front.geometry.attributes.position.needsUpdate = true;
      this.front.geometry.computeVertexNormals();
    }

    // --- section cap ---
    if (this.cap.visible) {
      pa = this.cap.geometry.attributes.position.array; fa = this.cap.geometry.attributes.aField.array;
      o = 0; o2 = 0;
      const nAct = f.nAct;
      for (let blockI = 0; blockI < 2; blockI++) {
        const rowsN = blockI === 0 ? CL : CUp;
        for (let r = 0; r <= rowsN; r++) {
          for (let i = 0; i <= CU; i++) {
            const u = (i / CU) * 2 - 1;
            let x, y, yb, yt;
            if (blockI === 0) {
              yb = Y0;
              const xa = u * MS.wellHx;
              yt = Math.min(MS.ledgeY, this.surf(xa, 0, HX, HZ, pcx, phx, phz, time));
              y = yb + (yt - yb) * (r / rowsN);
              MS.half(Math.min(y, MS.ledgeY), half);
              x = u * half[0];
            } else {
              yb = MS.ledgeY;
              const xa = u * 2.06;
              let top = this.surf(U.clamp(xa, -HX + 0.01, HX - 0.01), 0, HX, HZ, pcx, phx, phz, time);
              if (c && this.inCassette && Math.abs(xa - pcx) > phx) top = Math.min(f.liq, c.seatY + CS.floor);
              yt = Math.max(yb, top);
              y = yb + (yt - yb) * (r / rowsN);
              MS.half(Math.max(MS.ledgeY + 0.001, Math.min(y, MS.rimY)), half);
              x = u * half[0];
            }
            MS.half(Math.min(y, MS.rimY), half);
            const hxh = y > MS.ledgeY ? half[0] : Math.min(half[0], 1.56);
            const dn = U.sat(Math.min(hxh - Math.abs(x), half[1]) / Math.min(hxh, half[1]));
            pa[o++] = x; pa[o++] = y; pa[o++] = 0;
            fa[o2++] = (dn * (ND - 1) + 0.5) / ND;
            fa[o2++] = (U.clamp((y - Y0) / DY, 0.5, nAct - 0.5)) / NY;
          }
        }
      }
      this.cap.geometry.attributes.position.needsUpdate = true;
      this.cap.geometry.attributes.aField.needsUpdate = true;
    }
    // beginner mode shows the melt amber (stylised heat); observation mode keeps it clear
    const play = EC.state.play;
    const tu = this.topMat.userData.uniforms, cu = this.capMat.userData.uniforms;
    tu.uLiquid.value.copy(play ? EC.mats.waxColors.hot : EC.mats.waxColors.liquid);
    cu.uLiquid.value.copy(tu.uLiquid.value);
    tu.uAlphaL.value = play ? 0.5 : 0.16; cu.uAlphaL.value = play ? 0.7 : 0.4;
    tu.uGlow.value = play ? 0.62 : 0.3; cu.uGlow.value = play ? 0.7 : 0.3;
    cu.uSeam.value = f.seam;
    EC.touchShadow();
  };
  WaxView.prototype.dispose = function () {
    this.mold.obj.remove(this.group); this.mold.obj.remove(this.steel);
    [this.top, this.front, this.cap].forEach(function (m) { m.geometry.dispose(); m.material.dispose(); });
  };
  W.WaxView = WaxView;

  // =====================================================================================
  // finished block (cassette + wax + chip), built when the block is pulled from the mold
  // =====================================================================================
  W.makeBlockWax = function (mold, res) {
    const f = mold.fill, c = mold.cassette, G = EC.geom;
    const top = Math.min(f.level, c.seatY + CS.floor + 0.03);
    const sh = 0.985;
    const parts = [];
    const rings = [{ y: Y0, hx: 1.45 * sh, hz: 1.15 * sh, r: 0.3 }];
    if (top > MS.ledgeY + 0.02) {
      rings.push({ y: MS.ledgeY, hx: 1.56 * sh, hz: 1.26 * sh, r: 0.34 }, { y: MS.ledgeY, hx: 2.04 * sh, hz: 1.44 * sh, r: 0.36, sharp: true }, { y: top, hx: 2.05 * sh, hz: 1.45 * sh, r: 0.36 });
    } else rings.push({ y: Math.max(Y0 + 0.05, Math.min(top, MS.ledgeY)), hx: 1.55 * sh, hz: 1.25 * sh, r: 0.34 });
    const body = G.loft(rings, { capBottom: true, capTop: true, k: 4 });
    parts.push(body);
    // wax that came up inside the cassette, with the frozen dip
    if (mold.view && mold.view.inCassette) {
      const src = mold.view.top.geometry;
      const tg = new T.BufferGeometry();
      tg.setAttribute('position', new T.BufferAttribute(new Float32Array(src.attributes.position.array), 3));
      tg.setAttribute('normal', new T.BufferAttribute(new Float32Array(src.attributes.normal.array), 3));
      tg.setAttribute('uv', new T.BufferAttribute(new Float32Array(src.attributes.position.count * 2), 2));
      tg.setIndex(Array.from(src.index.array));
      parts.push(tg);
    }
    const g = G.merge(parts);
    // soft block: the unsupported, still-molten core slumps
    const soft = res.soft;
    if (soft > 0.02) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i);
        if (y > MS.ledgeY + 0.001) continue;
        const t = 1 - (y - Y0) / (MS.ledgeY - Y0);
        const x = p.getX(i), z = p.getZ(i);
        const wob = Math.sin(x * 3.1 + z * 2.3) * 0.5 + 0.5;
        p.setXYZ(i, x * (1 + 0.36 * soft * t * (0.6 + wob * 0.6)), MS.ledgeY - (MS.ledgeY - y) * (1 - 0.66 * soft * (0.6 + 0.5 * wob)), z * (1 + 0.42 * soft * t * (1.2 - wob * 0.6)));
      }
      g.computeVertexNormals();
    }
    const mat = EC.mats.waxSolid();
    if (res.cracked) { mat.map = EC.tex.cracks((mold.id + 1) * 37 + Math.floor(EC.state.time)); mat.map.repeat.set(0.26, 0.34); mat.map.offset.set(0.5, 0.5); mat.map.wrapS = mat.map.wrapT = T.MirroredRepeatWrapping; }
    if (soft > 0.02) { mat.roughness = 0.5 - 0.36 * soft; mat.color.lerp(EC.mats.waxColors.hot, 0.22 * soft); }
    const mesh = new T.Mesh(g, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    return mesh;
  };

  // =====================================================================================
  W.init = function () {
    buildStream();
    SP.build();
    pelletMesh = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), EC.mats.waxPellet, MAXPEL);
    pelletMesh.count = 0; pelletMesh.visible = false; pelletMesh.frustumCulled = false; pelletMesh.userData.noPick = true;
    EC.rig.tankGroup.add(pelletMesh);
    W.mist = new ParticleSet(150, false);
    W.spark = new ParticleSet(90, true);
    EC.on('resize', function (w, h) {
      const s = (h * EC.renderer.getPixelRatio()) / (2 * Math.tan(U.rad(EC.camera.fov / 2)));
      W.mist.mat.uniforms.uScale.value = s; W.spark.mat.uniforms.uScale.value = s;
    });
  };

  let mistAcc = 0;
  W.update = function (dt, time) {
    updateTank(dt, time);
    updateStream(dt, time);
    updateDrops(dt);
    updateSplats(dt);
    SP.update(dt);
    const play = EC.state.play;
    if (W.tinted !== play) {
      W.tinted = play;
      const col = play ? EC.mats.waxColors.hot : EC.mats.waxColors.liquid;
      W.streamMat.emissive.copy(col); W.streamMat.emissiveIntensity = play ? 0.75 : 0.4; W.streamMat.opacity = play ? 0.78 : 0.42;
      SP.mat.emissive.copy(col); SP.mat.emissiveIntensity = play ? 0.6 : 0.3;
    }
    // frost mist creeping off the cold plate
    mistAcc += dt * (EC.state.play ? 9 : 5);
    const cp = D.cold.plate;
    while (mistAcc > 1) {
      mistAcc -= 1;
      const e = Math.random();
      let x, z;
      if (e < 0.5) { x = U.lerp(cp.x0, cp.x1, Math.random()); z = U.lerp(cp.z0, cp.z1, Math.random()); }
      else if (e < 0.75) { x = U.lerp(cp.x0, cp.x1, Math.random()); z = cp.z1 + 0.5; }
      else { x = Math.random() < 0.5 ? cp.x0 - 0.5 : cp.x1 + 0.5; z = U.lerp(cp.z0, cp.z1, Math.random()); }
      W.mist.spawn(x, cp.y + 0.4, z, (Math.random() - 0.5) * 1.2, e < 0.5 ? 0.25 : -0.9, 0.4 + Math.random() * 0.8, 4 + Math.random() * 4, 0.05 + Math.random() * 0.05, 3 + Math.random() * 2.5, 1.4, 0.25);
    }
    W.mist.update(dt);
    W.spark.update(dt);
  };

  W.sparkle = function (x, y, z, n, speed) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, e = Math.random() * 1.2 + 0.2, sp = speed * (0.4 + Math.random() * 0.8);
      W.spark.spawn(x, y, z, Math.cos(a) * Math.cos(e) * sp, Math.sin(e) * sp, Math.sin(a) * Math.cos(e) * sp, 0.5 + Math.random() * 0.7, 0.9, 0.5 + Math.random() * 0.5, -0.6, 2.4);
    }
  };
  W.puff = function (x, y, z, n, size, alpha, up) {
    for (let i = 0; i < n; i++) {
      W.mist.spawn(x + (Math.random() - 0.5) * size, y, z + (Math.random() - 0.5) * size, (Math.random() - 0.5) * 3, (up || 3) * (0.5 + Math.random()), (Math.random() - 0.5) * 3, size * (0.8 + Math.random()), alpha, 0.8 + Math.random() * 0.9, size * 1.5, 1.6);
    }
  };
})();
