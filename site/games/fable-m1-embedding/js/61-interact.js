/* Beginner (operate) mode: everything the viewer can do with the machine, and the per-frame
   mechanics that react to it. No scripted sequence: each response comes from the state of the
   mechanism (lever angle -> valve -> stream -> level -> heat flow -> solid fraction -> release). */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;
  const D = EC.D, K = EC.K;
  const MS = EC.moldShape, CS = EC.cassetteShape;
  const WF = EC.WaxFill;

  const sim = (EC.sim = { focus: null, blocks: [], results: [], stats: { blocks: 0 } });
  const I = (EC.interact = {});
  const ray = new T.Raycaster();
  const fl = {}, hit = {}, tmpV = new T.Vector3(), tmpV2 = new T.Vector3(), scr = { x: 0, y: 0 };
  let items, mech, R, W;

  const FLOORS = { bench: 1, deck: 1, plate: 1, chamber: 1, chamberLid: 1, cold: 1, coldFrame: 1, wells: 1, towerTop: 1, tankLid: 1 };
  const MOLD_FLOORS = { bench: 1, deck: 1, plate: 1, chamber: 1, chamberLid: 1, cold: 1, coldFrame: 1 };
  const SMALL_FLOORS = { bench: 1, deck: 1, plate: 1, chamber: 1, chamberLid: 1, cold: 1, coldFrame: 1, wells: 1, dish: 1 };
  const CUP_FLOORS = { bench: 1, deck: 1, plate: 1, chamberLid: 1, cold: 1, coldFrame: 1, towerTop: 1, tankLid: 1, tank: 1 };
  const LEVER_REST_Z = D.lever.pivotZ + 0.12, MAX_PUSH = 0.85;

  /* Heading of an object about the vertical axis, read from its world matrix. */
  function yawOf(obj) {
    obj.updateWorldMatrix(true, false);
    const e = obj.matrixWorld.elements;
    return Math.atan2(-e[2], e[0]);
  }

  function thermalZone(name) {
    if (name === 'plate' || name === 'cold' || name === 'chamber' || name === 'bench') return name;
    if (name === 'held' || name === 'air') return 'air';
    return 'deck';
  }

  sim.attachFill = function (m) {
    m.fill = new WF(m);
    m.fill.Tb = m.fill.Tt = m.where === 'chamber' ? K.Tchamber : m.where === 'cold' ? EC.envT.cold : m.where === 'plate' || m.sliding ? K.Tplate - 2 : 34;
    m.fill.setSurface(thermalZone(m.sliding ? m.slideZone : m.where));
    m.view = new W.WaxView(m);
  };

  // ---------------------------------------------------------------------------------------
  // pointer helpers
  // ---------------------------------------------------------------------------------------
  function aimRay(h, p) {
    // ease from "where it was grabbed" to "a little above the finger" so the item stays visible
    // a mouse keeps its grab point; a finger would hide the item, so it eases to just above it
    const mouse = p.type === 'mouse';
    const t = mouse && !h.snap ? 0 : U.sat((performance.now() - h.t0) / 220);
    const off = mouse ? 0 : h.touchLift || 0;
    const ox = h.gx * (1 - t), oy = h.gy * (1 - t) - off * t;
    return EC.setRay(p.x + ox, p.y + oy, ray);
  }
  function worldPerPx(pos) {
    const c = EC.camera;
    return (2 * c.position.distanceTo(pos) * Math.tan(U.rad(c.fov / 2))) / window.innerHeight;
  }
  function detach(item) {
    if (item.obj.parent !== EC.scene) EC.scene.attach(item.obj);
  }
  function startCarry(item, p, lift) {
    detach(item);
    item.held = true; item.falling = false;
    item.prevWhere = item.where;
    item.where = 'held';
    item.tx = item.obj.position.x; item.tz = item.obj.position.z; item.ty = item.obj.position.y;
    item.floorY = item.obj.position.y; item.vx = item.vz = 0;
    EC.toScreen(item.obj.position, scr);
    const h = { item: item, t0: performance.now(), gx: scr.x - p.x, gy: scr.y - p.y, touchLift: lift || 0 };
    if (Math.hypot(h.gx, h.gy) > 90) { h.gx = h.gy = 0; }
    EC.emit('grab', item);
    return h;
  }
  function land(item, zoneName, y) {
    item.held = false;
    item.where = zoneName;
    item.falling = true; item.fallV = 0; item.restY = y;
  }

  // ---------------------------------------------------------------------------------------
  // molds
  // ---------------------------------------------------------------------------------------
  function moldHandler(m, p) {
    const h = startCarry(m, p, 26);
    sim.focus = m.fill && m.fill.vol > 0.05 ? m : sim.focus;
    h.move = function (pp) {
      aimRay(h, pp);
      if (!EC.rayFloor(ray, MOLD_FLOORS, hit)) return;
      m.tx = hit.x; m.tz = hit.z; m.floorY = hit.y; m.zoneName = hit.zone.name;
    };
    h.end = function (pp, tapped) {
      m.held = false; m.sliding = false;
      if (tapped) { m.tx = m.obj.position.x; m.tz = m.obj.position.z; }
      const pos = m.obj.position;
      EC.floorAt(pos.x, pos.z, MOLD_FLOORS, fl);
      land(m, fl.name === 'none' ? 'bench' : fl.name, fl.y);
      mech.lever.push = 0;
    };
    h.move(p);
    return h;
  }

  function updateMold(m, dt, time) {
    const pos = m.obj.position;
    if (m.held) {
      const slide = m.zoneName === 'plate' || m.zoneName === 'cold';
      // the lever paddle is in the way: pushing the mold against it opens the valve
      let tz = m.tz, tx = m.tx;
      const nearHead = m.zoneName === 'plate' && Math.abs(pos.x) < 4.3 && pos.y < D.plate.y + 1.5;
      if (nearHead || (m.zoneName === 'plate' && Math.abs(tx) < 4.3)) tz = Math.max(tz, LEVER_REST_Z - MAX_PUSH + MS.outerHz);
      if (m.zoneName === 'deck' || m.zoneName === 'plate') tz = Math.max(tz, 2.7 + MS.outerHz);
      const k = 1 - Math.exp(-(slide ? 26 : 18) * dt);
      const ox = pos.x, oz = pos.z;
      pos.x += (tx - pos.x) * k; pos.z += (tz - pos.z) * k;
      const ty = m.floorY + (slide ? 0.0 : 1.5);
      pos.y += (ty - pos.y) * (1 - Math.exp(-(ty > pos.y ? 26 : 14) * dt));
      const nvx = (pos.x - ox) / dt, nvz = (pos.z - oz) / dt;
      m.ax = (nvx - (m.vx || 0)) / dt; m.az = (nvz - (m.vz || 0)) / dt;
      m.vx = nvx; m.vz = nvz;
      m.sliding = slide && Math.abs(pos.y - m.floorY) < 0.12;
      m.slideZone = m.zoneName;
      if (nearHead) mech.lever.push = U.clamp(LEVER_REST_Z - (pos.z - MS.outerHz), 0, MAX_PUSH + 0.05);
      else mech.lever.push = 0;
      sim.scrape = Math.max(sim.scrape || 0, m.sliding ? Math.min(1, Math.hypot(nvx, nvz) / 30) : 0);
      sim.scrapeCold = m.zoneName === 'cold';
      EC.touchShadow();
    } else {
      m.ax = m.az = 0; m.vx = m.vz = 0;
      if (m.falling) fall(m, dt);
      // the lever spring nudges a resting mold back out
      if (m.where === 'plate' && Math.abs(pos.x) < 4.3 && !m.falling) {
        const lz = LEVER_REST_Z - D.lever.len * Math.sin(mech.lever.a) * 0.97;
        if (pos.z - MS.outerHz < lz - 0.01) { pos.z = Math.min(pos.z + 9 * dt, lz + MS.outerHz); EC.touchShadow(); }
      }
    }
    // carried molds tip a little with their motion
    const lean = m.held && !m.sliding ? 1 : 0;
    m.mesh.rotation.z = U.damp(m.mesh.rotation.z, U.clamp(-(m.vx || 0) * 0.004, -0.12, 0.12) * lean, 12, dt);
    m.mesh.rotation.x = U.damp(m.mesh.rotation.x, U.clamp((m.vz || 0) * 0.004, -0.12, 0.12) * lean, 12, dt);

    const f = m.fill;
    if (!f) return;
    const zone = m.held ? (m.sliding ? m.slideZone : 'air') : m.falling ? 'air' : m.where;
    const tz2 = thermalZone(zone);
    if (f.zone !== tz2) { f.setSurface(tz2); if (tz2 === 'cold' && f.vol > 0.3) EC.emit('quench', m); }
    // a seated cassette baffles the liquid, so it sloshes far less
    const baffle = m.cassette ? 0.35 : 1;
    f.updateSlosh(dt, (m.ax || 0) * baffle, (m.az || 0) * baffle);
    f.update(dt, EC.envT);
    // rim overflow / slop goes wherever it falls
    if (f.spillNow > 0) {
      const v = f.spillNow; f.spillNow = 0;
      sim.spillAcc = (sim.spillAcc || 0) + v;
      let dx = f.spillDirX || 0, dz = f.spillDirZ || 0;
      if (!dx && !dz) { const a = Math.random() * 6.283; dx = Math.cos(a); dz = Math.sin(a); if (Math.abs(dx) > Math.abs(dz)) { dx = Math.sign(dx); dz *= 0.6; } else { dz = Math.sign(dz); dx *= 0.6; } }
      const ex = pos.x + dx * (MS.outerHx + 0.2), ez = pos.z + dz * (MS.outerHz + 0.2);
      W.drop(ex, pos.y + MS.rimY, ez, dx * 5 + (m.vx || 0) * 0.5, 2, dz * 5 + (m.vz || 0) * 0.5, v, f.tMean);
      EC.emit('overflow', m, v);
    }
    if (m.view) m.view.update(dt, time, m.held || m.falling);
    // chip resting in the wax
    const chip = m.chip;
    if (chip && chip.where === 'mold') {
      const dn = U.sat(Math.min(MS.wellHx - Math.abs(chip.lx), MS.wellHz - Math.abs(chip.lz)) / MS.wellHz);
      const bed = f.vol > 0.05 ? Math.min(f.frontAt(dn), 0.5) : 0;
      const rest = MS.floorY + Math.max(chip.bed || 0, chip.settled ? chip.bed || 0 : bed);
      if (!chip.settled) {
        chip.bed = bed;
        const speed = f.vol > 0.05 && chip.ly > rest + 0.01 ? 1.3 * (1 - 0.8 * f.solidAt(dn, chip.ly)) : 8;
        chip.ly = Math.max(rest, chip.ly - speed * dt);
        if (chip.ly <= rest + 1e-3) { chip.settled = true; chip.high = (chip.bed || 0) > 0.06; EC.emit('chipSettle', chip, m); }
      }
      chip.locked = f.solidAt(dn, chip.ly + 0.05) > 0.45;
      chip.obj.position.set(chip.lx, chip.ly, chip.lz);
      chip.obj.rotation.set(chip.high ? 0.12 : 0, chip.rot, 0);
    }
    // cassette riding on the mold
    const c = m.cassette;
    if (c) updateCassetteOnMold(c, m, f, dt, time);
  }

  function fall(item, dt) {
    const pos = item.obj.position;
    item.fallV += 950 * dt;
    pos.y -= item.fallV * dt;
    EC.touchShadow();
    if (pos.y <= item.restY) {
      pos.y = item.restY;
      item.falling = false;
      EC.emit('land', item, item.where, Math.min(1, item.fallV / 60));
      if (item.kind === 'mold' && item.where === 'chamber') R.chamberGroup.attach(item.obj);
      if (item.kind === 'cassette' && item.where === 'chamber') R.chamberGroup.attach(item.obj);
      if (item.kind === 'chip' && item.where === 'dish') R.dishGroup.attach(item.obj);
      separate(item);
    }
  }

  /* Keep loose things from resting inside each other. */
  function separate(item) {
    const rad = { mold: 2.3, cassette: 2.1, chip: 0.8, block: 2.3, cup: 4.8, forceps: 0 };
    const r0 = rad[item.kind];
    if (!r0) return;
    const p = item.obj.position;
    for (let k = 0; k < 2; k++) for (let i = 0; i < items.all.length; i++) {
      const o = items.all[i];
      if (o === item || o.held || !rad[o.kind] || o.where !== item.where) continue;
      if (o.kind === 'chip' && item.kind !== 'chip') continue;
      o.obj.getWorldPosition(tmpV);
      item.obj.getWorldPosition(tmpV2);
      const dx = tmpV2.x - tmpV.x, dz = tmpV2.z - tmpV.z, d = Math.hypot(dx, dz), need = (r0 + rad[o.kind]) * 0.9;
      if (d < need && Math.abs(tmpV2.y - tmpV.y) < 1.5) {
        const nx = d > 0.01 ? dx / d : 1, nz = d > 0.01 ? dz / d : 0;
        p.x += nx * (need - d); p.z += nz * (need - d);
      }
    }
  }

  // ---------------------------------------------------------------------------------------
  // cassettes
  // ---------------------------------------------------------------------------------------
  function freeMoldNear(x, z, range) {
    let best = null, bd = range;
    for (let i = 0; i < items.molds.length; i++) {
      const m = items.molds[i];
      if (m.cassette || m.where === 'chamber' || m.held || m.falling) continue;
      const d = Math.hypot(m.obj.position.x - x, m.obj.position.z - z);
      if (d < bd) { bd = d; best = m; }
    }
    return best;
  }

  function cassetteHandler(c, p) {
    if (c.where === 'mold') return cassetteOnMoldHandler(c, p);
    const h = startCarry(c, p, 30);
    h.move = function (pp) {
      aimRay(h, pp);
      if (!EC.rayFloor(ray, SMALL_FLOORS, hit)) return;
      c.tx = hit.x; c.tz = hit.z; c.floorY = hit.y; c.zoneName = hit.zone.name;
      // magnetic snap over a waiting mold
      const m = freeMoldNear(hit.x, hit.z, 2.6);
      c.over = m;
      if (m) { c.tx = m.obj.position.x; c.tz = m.obj.position.z; c.floorY = m.obj.position.y + MS.ledgeY; }
    };
    h.end = function (pp, tapped) {
      c.held = false;
      const pos = c.obj.position;
      const m = tapped ? null : freeMoldNear(pos.x, pos.z, 1.3);
      c.over = null;
      if (m) { attachCassette(c, m); return; }
      if (tapped && c.prevWhere === 'chamber') { returnToSlot(c); return; }
      EC.floorAt(pos.x, pos.z, SMALL_FLOORS, fl);
      land(c, fl.name === 'none' ? 'bench' : fl.name, fl.y);
    };
    h.move(p);
    return h;
  }

  function returnToSlot(item) {
    item.held = false; item.falling = false;
    item.where = 'chamber';
    R.chamberGroup.attach(item.obj);
    item.homing = 1;
  }

  function attachCassette(c, m) {
    m.obj.attach(c.obj);
    c.where = 'mold'; c.mold = m; m.cassette = c;
    c.falling = false;
    const f = m.fill;
    const wet = f && f.vol > 0.05 && f.liq > MS.ledgeY - 0.02;
    c.seatY = wet ? U.clamp(f.liq - 0.08, MS.ledgeY + 0.02, MS.ledgeY + 0.36) : MS.ledgeY;
    c.tilt = wet ? 0.05 + Math.random() * 0.04 : 0;
    c.tiltDir = Math.random() * 6.283;
    c.dropT = 0; c.pressing = false; c.pressT = 0; c.locked = false; c.pull = 0; c.bob = 0;
    c.obj.position.set(0, c.seatY + 1.2, 0);
    c.obj.rotation.set(0, 0, 0);
    EC.emit('cassetteOn', c, m, wet);
    sim.focus = m.fill && m.fill.vol > 0.05 ? m : sim.focus;
  }

  function updateCassetteOnMold(c, m, f, dt, time) {
    c.dropT = Math.min(1, (c.dropT || 0) + dt * 6);
    const liquidBelow = f.vol > 0.05 && f.solidAt(0.35, MS.ledgeY + 0.05) < 0.5 && f.solidAt(0.9, Math.max(MS.floorY, f.liq - 0.05)) < 0.5;
    const skinned = f.vol > 0.05 && !liquidBelow && f.level > MS.ledgeY + 0.03;
    if (!c.locked) {
      if (c.pressing) {
        c.pressT += dt;
        if (skinned && c.seatY > MS.ledgeY + 0.03) {
          // a skin is in the way: it holds, then gives with a crack
          if (c.pressT > 0.55 && !f.q.skinCrack) { f.q.skinCrack = true; EC.emit('crack', m); c.seatY = Math.max(MS.ledgeY + 0.1, c.seatY - 0.08); c.tilt += 0.03; }
        } else {
          const before = c.seatY;
          c.seatY = Math.max(MS.ledgeY, c.seatY - 1.1 * dt);
          c.tilt = Math.max(0, c.tilt - 0.4 * dt);
          if (before > MS.ledgeY && f.vol > 0.05) { c.squish = (c.squish || 0) + (before - c.seatY); f.asleep = false; f.ripple = Math.max(f.ripple, 0.4); f.rx = CS.innerCx; f.rz = 0; }
          if (before > MS.ledgeY && c.seatY <= MS.ledgeY) EC.emit('seated', c, m);
        }
      }
      // once the wax around the cassette has set, it stays as it is
      if (f.vol > 0.05 && f.phi > 0.5 && !c.pressing) { c.locked = true; c.tiltFrozen = c.tilt + (c.seatY - MS.ledgeY) * 0.2; }
    }
    c.pull = U.damp(c.pull, c.pullTarget || 0, c.pullTarget ? 30 : 16, dt);
    c.bob = liquidBelow && c.seatY > MS.ledgeY + 0.01 ? Math.sin(time * 5.1 + c.id) * 0.012 : 0;
    const drop = (1 - U.easeOutCubic(c.dropT)) * 1.2;
    c.obj.position.set((c.pullJx || 0), c.seatY + drop + c.bob + c.pull, 0);
    c.obj.rotation.set(Math.sin(c.tiltDir) * c.tilt, 0, Math.cos(c.tiltDir) * c.tilt);
    if (drop > 0.001 || c.pull > 0.001 || c.pressing) EC.touchShadow();
  }

  function cassetteOnMoldHandler(c, p) {
    const m = c.mold;
    const h = { item: c, t0: performance.now(), mode: 'press' };
    c.pressing = true; c.pressT = 0;
    sim.focus = m.fill && m.fill.vol > 0.05 ? m : sim.focus;
    let sub = null;
    h.move = function (pp) {
      if (h.mode === 'press' && pp.moved) {
        const dx = pp.x - pp.sx, dy = pp.y - pp.sy;
        c.pressing = false;
        if (dy < 0 && -dy > Math.abs(dx) * 0.8) { h.mode = 'pull'; EC.emit('pullStart', m); }
        else { h.mode = 'move'; sub = moldHandler(m, pp); sub.gx = sub.gy = 0; }
      }
      if (h.mode === 'move') { sub.move(pp); return; }
      if (h.mode === 'pull') {
        m.obj.getWorldPosition(tmpV);
        const cm = Math.max(0, (pp.sy - pp.y) - 8) * worldPerPx(tmpV);
        const f = m.fill;
        const bonded = f && f.vol > 0.05 && f.level > c.seatY + CS.floor + 0.03;
        const ready = bonded ? f.readiness() : 1;
        const thr = bonded ? U.lerp(3.4, 0.22, ready) : 0.3;
        c.pullTarget = Math.min(cm, thr) * (bonded ? U.lerp(0.1, 0.5, ready) : 1) + 0.0001;
        c.pullJx = bonded && ready < 0.9 ? Math.sin(performance.now() * 0.05) * 0.012 * Math.min(1, cm) : 0;
        sim.strain = bonded ? U.sat(cm / thr) * (1 - ready) : 0;
        if (cm >= thr) { h.mode = 'done'; c.pullTarget = 0; c.pullJx = 0; sim.strain = 0; sub = popBlock(m, pp, bonded); }
      } else if (h.mode === 'done' && sub) sub.move(pp);
    };
    h.end = function (pp, tapped) {
      c.pressing = false; c.pullTarget = 0; c.pullJx = 0; sim.strain = 0;
      if (h.mode === 'pull') EC.emit('pullCancel', m);
      if (sub) sub.end(pp, false);
    };
    return h;
  }

  // ---------------------------------------------------------------------------------------
  // popping the block out of the mold
  // ---------------------------------------------------------------------------------------
  function evaluate(m, bonded) {
    const f = m.fill, c = m.cassette, chip = m.chip;
    const res = { liq: 0, soft: 0, cracked: false, tilted: false, bonded: bonded, seam: false, chip: 'none', overflow: false, score: 0, mark: 'x' };
    if (!bonded) { res.score = 0; return res; }
    const liq = f.liquidFraction();
    res.liq = liq;
    res.soft = U.smooth(0.22, 0.7, liq);
    res.cracked = (liq > 0.035 && res.soft < 0.5) || f.q.skinCrack || f.tMean > 46;
    const tilt = (c.tiltFrozen || 0) + Math.abs(f.tiltX) + Math.abs(f.tiltZ);
    res.tilt = tilt;
    res.tilted = tilt > 0.035;
    res.seam = f.q.seam;
    res.overflow = f.q.overflow > 0.5;
    let score = 100;
    score -= 75 * res.soft;
    if (res.cracked) score -= 35;
    if (res.tilted) score -= 25;
    if (res.seam) score -= 10;
    if (res.overflow) score -= 6;
    if (chip) {
      const err = Math.abs(U.wrapPi(chip.rot));
      const off = Math.max(Math.abs(chip.lx) / 0.75, Math.abs(chip.lz) / 0.6);
      res.chip = chip.high ? 'high' : err > 0.21 ? 'askew' : off > 1 ? 'off' : 'ok';
      res.chipErr = err;
      if (res.chip === 'high') score -= 15; else if (res.chip === 'askew') score -= 14 + Math.min(10, err * 6); else if (res.chip === 'off') score -= 7;
    } else score -= 22;
    res.score = Math.max(0, Math.round(score));
    res.mark = res.score >= 90 ? 'oo' : res.score >= 68 ? 'o' : res.score >= 38 ? 'tri' : 'x';
    return res;
  }

  function popBlock(m, p, bonded) {
    const c = m.cassette, f = m.fill;
    const res = evaluate(m, bonded);
    // lifting a cassette off a mold that holds no wax is not a casting result
    res.empty = !bonded && !(f && f.vol > 0.5);
    if (!res.empty) sim.results.push(res);
    m.secT = 0;
    c.plane.constant = 1e5; c.plane.normal.set(0, 0, -1);
    if (!bonded) {
      m.cassette = null; c.mold = null;
      // nothing holds the cassette: it simply comes away, the wax (if any) stays behind
      EC.scene.attach(c.obj);
      c.where = 'held';
      EC.emit('pop', m, res, null);
      const h = cassetteHandler(c, p);
      h.gx = h.gy = 0;
      return h;
    }
    // build the block: cassette + wax + chip, in the mold's local frame
    const obj = new T.Group(), flip = new T.Group();
    m.obj.getWorldPosition(obj.position);
    EC.scene.add(obj);
    obj.add(flip);
    const PIV = 0.72;
    flip.position.y = PIV;
    const wax = W.makeBlockWax(m, res);
    m.cassette = null; c.mold = null;
    wax.position.y = -PIV;
    if (res.tilted) { wax.rotation.z = Math.min(0.14, res.tilt * 1.2) * (Math.cos(c.tiltDir) > 0 ? 1 : -1); wax.rotation.x = Math.min(0.1, res.tilt * 0.8) * Math.sin(c.tiltDir); }
    flip.add(wax);
    c.obj.position.set(0, c.seatY - PIV, 0); c.obj.rotation.set(0, 0, 0);
    flip.add(c.obj);
    c.where = 'block';
    const chip = m.chip;
    if (chip) {
      chip.obj.position.set(chip.lx, chip.ly - PIV - 0.012, chip.lz);
      flip.add(chip.obj);
      chip.where = 'block'; m.chip = null;
    }
    const block = { kind: 'block', label: 'ワックスブロック', obj: obj, flip: flip, wax: wax, cassette: c, chip: chip, res: res, where: 'held', lift: 0, id: sim.stats.blocks++, flipT: 0, melt: 0, age: 0 };
    const pick = new T.Mesh(new T.BoxGeometry(5, 2.2, 3.6), EC.pickMat);
    pick.position.y = 0.8; pick.visible = false; pick.userData.item = block;
    obj.add(pick);
    block.pick = pick;
    EC.picks.push(pick); items.all.push(block);
    obj.traverse(function (o) { if (o.isMesh) o.userData.item = block; });
    c.pick.userData.item = block;
    if (chip) chip.pick.userData.item = block;
    sim.blocks.push(block);
    // what was still liquid does not come along
    const left = f.vol * res.liq;
    const n = Math.min(14, Math.ceil(left * 5));
    for (let i = 0; i < n; i++) W.drop(obj.position.x + (Math.random() - 0.5) * 2.4, obj.position.y + 0.5 + Math.random() * 0.5, obj.position.z + (Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 6, 4 + Math.random() * 10, (Math.random() - 0.5) * 6, (left * 0.5) / n, f.tMean);
    f.reset();
    if (left > 0.1) { f.pour(left * 0.5, Math.max(K.Tm + 1, f.tMean)); }
    if (m.view) m.view.update(0.016, EC.state.time, true);
    EC.emit('pop', m, res, block);
    if (sim.focus === m) sim.focus = null;
    // keep the bench from filling up: the oldest block is recycled
    while (sim.blocks.length > 5) recycleBlock(sim.blocks[0]);
    const h = blockHandler(block, p);
    h.gx = h.gy = 0;
    return h;
  }

  function removeItem(item) {
    let i = items.all.indexOf(item); if (i >= 0) items.all.splice(i, 1);
    i = EC.picks.indexOf(item.pick); if (i >= 0) EC.picks.splice(i, 1);
  }

  function restock(c, chip) {
    if (c) {
      c.pick.userData.item = c; c.mesh.userData.item = c; c.labelMesh.userData.item = c;
      c.where = 'chamber'; c.held = false; c.falling = false; c.mold = null;
      R.chamberGroup.add(c.obj);
      c.obj.position.set(c.slot.x, c.slot.y + 0.01, c.slot.z); c.obj.rotation.set(-Math.PI / 2, 0, 0);
      c.obj.scale.setScalar(0.01); c.popIn = 0;
    }
    if (chip) {
      chip.pick.userData.item = chip; chip.mesh.userData.item = chip;
      chip.where = 'dish'; chip.settled = false; chip.high = false; chip.locked = false; chip.bed = 0;
      R.dishGroup.add(chip.obj);
      chip.obj.position.set(chip.slot.x, chip.slot.y, chip.slot.z); chip.obj.rotation.set(0, (Math.random() - 0.5) * 2.6, 0);
      chip.obj.scale.setScalar(0.01); chip.popIn = 0;
    }
  }

  function recycleBlock(b) {
    const i = sim.blocks.indexOf(b);
    if (i >= 0) sim.blocks.splice(i, 1);
    removeItem(b);
    if (b.wax.parent) { b.wax.parent.remove(b.wax); b.wax.geometry.dispose(); b.wax.material.dispose(); }
    restock(b.cassette && b.cassette.where === 'block' ? b.cassette : null, b.chip && b.chip.where === 'block' ? b.chip : null);
    EC.scene.remove(b.obj);
    EC.touchShadow();
  }

  function blockHandler(b, p) {
    const h = startCarry(b, p, 30);
    h.move = function (pp) {
      aimRay(h, pp);
      if (!EC.rayFloor(ray, MOLD_FLOORS, hit)) return;
      b.tx = hit.x; b.tz = hit.z; b.floorY = hit.y; b.zoneName = hit.zone.name;
    };
    h.end = function () {
      b.held = false;
      const pos = b.obj.position;
      EC.floorAt(pos.x, pos.z, MOLD_FLOORS, fl);
      land(b, fl.name === 'none' ? 'bench' : fl.name, fl.y - 0.09);
    };
    h.move(p);
    return h;
  }

  function updateBlock(b, dt) {
    const pos = b.obj.position;
    b.age += dt;
    b.flipT = Math.min(1, b.flipT + dt * 2.4);
    b.flip.rotation.x = Math.PI * U.easeInOut(b.flipT);
    if (b.held) {
      const k = 1 - Math.exp(-18 * dt);
      pos.x += (b.tx - pos.x) * k; pos.z += (b.tz - pos.z) * k;
      pos.y += (b.floorY + 2.4 - pos.y) * (1 - Math.exp(-12 * dt));
      EC.touchShadow();
    } else if (b.falling) fall(b, dt);
    // a block left on the heated surface melts back into a puddle
    if (!b.held && !b.falling && b.where === 'plate' && b.wax.parent) {
      b.melt += dt / 9;
      if (b.melt > 0.12) {
        const s = Math.max(0.02, 1 - (b.melt - 0.12) / 0.88);
        b.wax.scale.set(1 + (1 - s) * 0.25, s, 1 + (1 - s) * 0.25);
        b.wax.position.y = -0.72 + (1 - s) * 0.5;
        W.spill.inject(pos.x + (Math.random() - 0.5) * 3, pos.z + (Math.random() - 0.5) * 2.4, 0.9 * dt);
        if (!b.sizzled) { b.sizzled = true; EC.emit('melt', b); }
        EC.touchShadow();
      }
      if (b.melt >= 1) dissolveBlock(b);
    }
  }

  function dissolveBlock(b) {
    const i = sim.blocks.indexOf(b);
    if (i >= 0) sim.blocks.splice(i, 1);
    removeItem(b);
    b.wax.parent.remove(b.wax); b.wax.geometry.dispose(); b.wax.material.dispose();
    const c = b.cassette, chip = b.chip;
    EC.scene.attach(c.obj);
    c.pick.userData.item = c; c.mesh.userData.item = c; c.labelMesh.userData.item = c;
    c.where = 'plate'; c.obj.rotation.set(0, 0, 0); c.obj.position.y = D.plate.y;
    if (chip) {
      EC.scene.attach(chip.obj);
      chip.pick.userData.item = chip; chip.mesh.userData.item = chip;
      chip.where = 'plate'; chip.settled = false; chip.high = false; chip.locked = false; chip.bed = 0;
      chip.obj.rotation.set(0, chip.rot, 0); chip.obj.position.y = D.plate.y;
      chip.obj.position.x += 2.6;
    }
    EC.scene.remove(b.obj);
    EC.touchShadow();
  }

  // ---------------------------------------------------------------------------------------
  // forceps and chips
  // ---------------------------------------------------------------------------------------
  function chipFree(ch) { return ch.where !== 'mold' && ch.where !== 'forceps' && ch.where !== 'block' && !ch.falling; }

  function forcepsHandler(fc, p) {
    if (fc.where === 'well' && fc.hole >= 0) { R.wellHoles[fc.hole].used = null; fc.hole = -1; EC.emit('unwell', fc); }
    const h = startCarry(fc, p, 36);
    h.snap = true;      // the pointer steers the tips
    fc.dwell = 0; fc.nudge = null; fc.dip = 0;
    h.move = function (pp) {
      aimRay(h, pp);
      if (!EC.rayFloor(ray, SMALL_FLOORS, hit)) return;
      fc.tx = hit.x; fc.tz = hit.z; fc.floorY = hit.y; fc.zoneName = hit.zone.name;
    };
    h.end = function (pp, tapped) {
      fc.held = false;
      releaseForceps(fc, tapped);
    };
    h.move(p);
    return h;
  }

  function freeHoleNear(x, z, range) {
    let best = -1, bd = range;
    for (let i = 0; i < R.wellHoles.length; i++) {
      const hl = R.wellHoles[i];
      if (hl.used) continue;
      const d = Math.hypot(hl.x - x, hl.z - z);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  function dropChipHere(chip, x, z) {
    const yaw = yawOf(chip.obj);
    EC.scene.attach(chip.obj);
    chip.obj.rotation.set(0, yaw, 0);
    const mh = W.moldAt(x, z);
    if (mh && mh.inCav && !mh.mold.chip && !mh.mold.cassette && mh.mold.where !== 'chamber') {
      const m = mh.mold;
      m.obj.attach(chip.obj);
      chip.where = 'mold'; chip.mold = m; m.chip = chip;
      chip.lx = U.clamp(mh.lx, -0.75, 0.75); chip.lz = U.clamp(mh.lz, -0.62, 0.62);
      chip.ly = Math.max(MS.floorY, chip.obj.position.y); chip.rot = yaw;
      chip.settled = false; chip.bed = 0; chip.high = false; chip.turnTried = false; chip.wasAligned = Math.abs(U.wrapPi(yaw)) < 0.1;
      chip.obj.rotation.set(0, chip.rot, 0);
      EC.emit('chipIn', chip, m);
      return true;
    }
    EC.floorAt(x, z, SMALL_FLOORS, fl);
    chip.rot = yaw;
    chip.obj.position.x = x; chip.obj.position.z = z;
    land(chip, fl.name === 'none' ? 'bench' : fl.name, fl.y);
    return false;
  }

  function releaseForceps(fc, tapped) {
    const pos = fc.obj.position;
    if (fc.nudge) fc.nudge.chip.turnTried = true;
    fc.nudge = null;
    // let go of a carried chip (unless frozen wax glues it to cold tips)
    if (fc.payload && fc.blobAmt < 0.3) {
      const chip = fc.payload;
      const mh = W.moldAt(pos.x, pos.z);
      const intoWax = mh && mh.inCav && mh.mold.fill && mh.mold.fill.vol > 0.3 && !mh.mold.chip && !mh.mold.cassette;
      if (intoWax && fc.temp < 46 && mh.mold.fill.liquidFraction() > 0.3) {
        // cold steel: the wax freezes onto the tips and the chip comes straight back out
        fc.blobAmt = 1; mh.mold.fill.remove(0.25);
        EC.emit('stuck', fc);
      } else {
        fc.payload = null;
        dropChipHere(chip, pos.x, pos.z);
        fc.setOpen(1);
      }
    }
    if (tapped && fc.prevWhere === 'well') { dockForceps(fc, freeHoleNear(pos.x, pos.z, 99)); return; }
    const hole = freeHoleNear(pos.x, pos.z, 2.6);
    if (hole >= 0 && (fc.zoneName === 'wells' || Math.hypot(R.wellHoles[hole].x - pos.x, R.wellHoles[hole].z - pos.z) < 2.2)) { dockForceps(fc, hole); return; }
    // otherwise they are laid down beside wherever they were used
    let lx = pos.x + 3.4, lz = pos.z + 2.3;
    EC.floorAt(lx, lz, FLOORS, fl);
    if (fl.name === 'none') { EC.floorAt(pos.x, pos.z, FLOORS, fl); lx = pos.x; lz = pos.z; }
    fc.lay = { x: lx, y: fl.y + 0.1, z: lz, t: 0 };
    fc.where = fl.name === 'none' ? 'bench' : fl.name;
    EC.emit('land', fc, fc.where, 0.4);
  }

  function dockForceps(fc, hole) {
    if (hole < 0) return;
    R.wellHoles[hole].used = fc;
    fc.hole = hole; fc.where = 'well'; fc.lay = null;
    fc.dockT = 0;
    EC.emit('dock', fc);
  }

  const HOLD_ROT = new T.Euler(-0.5, 0, -0.42), LAY_ROT = new T.Euler(0, 0.35, -Math.PI / 2 + 0.03);
  const qa = new T.Quaternion(), qb = new T.Quaternion();
  function updateForceps(fc, dt, time) {
    const pos = fc.obj.position;
    let zoneT = K.Tamb, tau = 26;
    if (fc.held) {
      const k = 1 - Math.exp(-20 * dt);
      pos.x += (fc.tx - pos.x) * k; pos.z += (fc.tz - pos.z) * k;
      // reach down for a chip, or into a mold
      let hover = 1.25, dipTarget = 0;
      let surfY = fc.floorY;
      const mh = W.moldAt(pos.x, pos.z);
      if (mh && mh.inCav) surfY = mh.y;
      if (!fc.payload && !fc.nudge) {
        // loose chip under the tips?
        let best = null, bd = 0.95;
        for (let i = 0; i < items.chips.length; i++) {
          const ch = items.chips[i];
          if (!chipFree(ch)) continue;
          ch.obj.getWorldPosition(tmpV);
          const d = Math.hypot(tmpV.x - pos.x, tmpV.z - pos.z);
          if (d < bd && Math.abs(tmpV.y - fc.floorY) < 1.2) { bd = d; best = ch; }
        }
        if (best) {
          fc.dwell += dt; dipTarget = 1;
          best.obj.getWorldPosition(tmpV);
          surfY = tmpV.y + 0.05;
          pos.x += (tmpV.x - pos.x) * Math.min(1, dt * 10); pos.z += (tmpV.z - pos.z) * Math.min(1, dt * 10);
          if (fc.dwell > 0.16 && fc.dip > 0.85) {
            fc.payload = best; best.where = 'forceps'; best.falling = false;
            fc.obj.attach(best.obj);
            best.grabT = 0;
            fc.setOpen(0.12);
            EC.emit('pinch', fc, best);
          }
        } else {
          fc.dwell = 0;
          // a chip lying in molten wax can be pushed and turned
          const m = mh && mh.inCav ? mh.mold : null;
          if (m && m.chip && m.chip.where === 'mold' && !m.cassette) {
            const ch = m.chip;
            const dx = mh.lx - ch.lx, dz = mh.lz - ch.lz;
            if (Math.hypot(dx, dz) < 1.15) {
              const cs = Math.cos(-ch.rot), sn = Math.sin(-ch.rot);
              // grab point in the chip's own frame, kept on the chip
              const gx = U.clamp(dx * cs + dz * sn, -0.6, 0.6), gz = U.clamp(-dx * sn + dz * cs, -0.4, 0.4);
              fc.nudge = { chip: ch, mold: m, gx: gx, gz: gz, t: 0 };
              fc.setOpen(0.2);
              EC.emit('nudgeStart', fc, ch);
            }
          }
        }
      }
      if (fc.nudge) {
        const nd = fc.nudge, ch = nd.chip, m = nd.mold;
        const mp = m.obj.position;
        const lx = pos.x - mp.x, lz = pos.z - mp.z;
        dipTarget = 1; surfY = mp.y + ch.ly + 0.1;
        nd.t += dt;
        const f = m.fill;
        if (Math.hypot(lx, lz) > 3.1 || m.held) {
          // dragged right out of the mold
          fc.nudge = null;
          if (!ch.locked) {
            fc.payload = ch; ch.where = 'forceps'; m.chip = null; ch.mold = null; ch.settled = false; ch.high = false;
            fc.obj.attach(ch.obj); ch.grabT = 0; fc.setOpen(0.12);
            for (let i = 0; i < 3; i++) W.drop(pos.x, mp.y + 1.3, pos.z, (Math.random() - 0.5) * 4, 2, (Math.random() - 0.5) * 4, 0.03, 58);
            if (f) f.remove(0.09);
            EC.emit('pinch', fc, ch);
          }
        } else if (!ch.locked) {
          // overdamped rigid body in a viscous bath, pulled at the grab point
          const cs = Math.cos(ch.rot), sn = Math.sin(ch.rot);
          const rx = nd.gx * cs + nd.gz * sn, rz = -nd.gx * sn + nd.gz * cs;
          const fx = (lx - (ch.lx + rx)) * 60, fz = (lz - (ch.lz + rz)) * 60;
          const visc = 1 + 6 * (f ? f.solidAt(0.6, ch.ly + 0.05) : 0);
          ch.lx += (fx / (5 * visc)) * dt; ch.lz += (fz / (5 * visc)) * dt;
          const torque = rz * fx - rx * fz;
          ch.rot += (torque / (1.5 * visc)) * dt;
          const ex = Math.abs(Math.cos(ch.rot)) * 0.65 + Math.abs(Math.sin(ch.rot)) * 0.45, ez = Math.abs(Math.sin(ch.rot)) * 0.65 + Math.abs(Math.cos(ch.rot)) * 0.45;
          ch.lx = U.clamp(ch.lx, -(MS.wellHx - ex), MS.wellHx - ex); ch.lz = U.clamp(ch.lz, -(MS.wellHz - ez), MS.wellHz - ez);
          if (f) { f.ripple = Math.max(f.ripple, 0.18); f.rx = ch.lx; f.rz = ch.lz; f.asleep = false; }
          sim.swirl = Math.min(1, Math.hypot(fx, fz) / 60);
          const aligned = Math.abs(U.wrapPi(ch.rot)) < 0.1;
          if (aligned && !ch.wasAligned) EC.emit('aligned', ch);
          ch.wasAligned = aligned;
          // cold tips: wax freezes on, the chip gets glued
          if (fc.temp < 46 && f && f.liquidFraction() > 0.3) {
            fc.blobAmt = Math.min(1, fc.blobAmt + dt * 1.4);
            if (fc.blobAmt >= 1) {
              fc.nudge = null; fc.payload = ch; ch.where = 'forceps'; m.chip = null; ch.mold = null; ch.settled = false;
              fc.obj.attach(ch.obj); ch.grabT = 0; f.remove(0.25);
              EC.emit('stuck', fc);
            }
          }
        } else if (nd.t > 0.3 && !nd.ticked) { nd.ticked = true; EC.emit('blocked', ch); }
      } else if (fc.payload && mh && mh.inCav && mh.mold.fill && mh.mold.fill.vol > 0.3) hover = 0.9;
      fc.dip = U.damp(fc.dip, dipTarget, 16, dt);
      const ty = surfY + U.lerp(hover, 0.03, fc.dip);
      pos.y += (ty - pos.y) * (1 - Math.exp(-18 * dt));
      qa.setFromEuler(HOLD_ROT);
      fc.obj.quaternion.slerp(qa, 1 - Math.exp(-14 * dt));
      EC.touchShadow();
      zoneT = K.Tamb; tau = 30;
    } else if (fc.where === 'well') {
      const hl = R.wellHoles[fc.hole];
      if (fc.obj.parent !== R.wellsGroup) {
        fc.dockT = Math.min(1, (fc.dockT || 0) + dt * 3.5);
        tmpV.set(hl.x, D.wells.topY - 1.05 + (1 - U.easeOutCubic(fc.dockT)) * 0, hl.z);
        R.wellsGroup.localToWorld(tmpV);
        const up = Math.sin(Math.PI * fc.dockT) * 3;
        pos.lerp(tmpV, 1 - Math.exp(-12 * dt)); pos.y += up * dt * 6 * (1 - fc.dockT);
        qb.setFromEuler(new T.Euler(-0.2, fc.id ? 0.5 : -0.35, 0));
        fc.obj.quaternion.slerp(qb, 1 - Math.exp(-12 * dt));
        EC.touchShadow();
        if (fc.dockT >= 1 && pos.distanceTo(tmpV) < 0.05) { R.wellsGroup.attach(fc.obj); fc.obj.position.set(hl.x, D.wells.topY - 1.05, hl.z); }
      }
      zoneT = K.Twell; tau = 3.2;
    } else {
      if (fc.lay && fc.lay.t < 1) {
        fc.lay.t = Math.min(1, fc.lay.t + dt * 3);
        tmpV.set(fc.lay.x, fc.lay.y, fc.lay.z);
        pos.lerp(tmpV, 1 - Math.exp(-14 * dt));
        qb.setFromEuler(LAY_ROT);
        fc.obj.quaternion.slerp(qb, 1 - Math.exp(-14 * dt));
        EC.touchShadow();
      }
      const w = fc.where;
      if (w === 'plate') { zoneT = 55; tau = 7; } else if (w === 'cold') { zoneT = 1; tau = 3.5; } else if (w === 'deck' || w === 'wells' || w === 'chamberLid') { zoneT = 38; tau = 14; } else { zoneT = K.Tamb; tau = 14; }
    }
    fc.temp += (zoneT - fc.temp) * (1 - Math.exp(-dt / tau));
    // carried chip follows the tips
    const ch = fc.payload;
    if (ch) {
      ch.grabT = Math.min(1, (ch.grabT || 0) + dt * 8);
      ch.obj.position.lerp(tmpV.set(0, 0.02, 0), ch.grabT);
      if (!fc.held && fc.blobAmt < 0.02) {
        // glue melted: the chip drops beside the tips
        fc.payload = null;
        fc.obj.getWorldPosition(tmpV);
        if (fc.where === 'well') dropChipHere(ch, tmpV.x, D.wells.z1 + 1.8);
        else dropChipHere(ch, tmpV.x + 1.2, tmpV.z + 1.4);
        fc.setOpen(1);
      }
    }
    // frozen wax on the tips melts off again once they are hot
    if (fc.blobAmt > 0 && fc.temp > K.Tm + 1) {
      fc.blobAmt = Math.max(0, fc.blobAmt - dt * 0.55);
      if (Math.random() < dt * 5) { fc.obj.getWorldPosition(tmpV); EC.emit('sizzle', tmpV); if (fc.where !== 'well') W.drop(tmpV.x, tmpV.y + 0.2, tmpV.z, 0, 0, 0, 0.03, 58); }
    }
    fc.blob.visible = fc.blobAmt > 0.01;
    if (fc.blob.visible) fc.blob.scale.set(1.5 * fc.blobAmt, 1.9 * fc.blobAmt, 1.5 * fc.blobAmt);
    fc.glow.material.opacity = EC.state.play ? 0.5 * U.sat((fc.temp - 46) / 20) * (0.85 + 0.15 * Math.sin(time * 7 + fc.id)) : 0;
    if (!fc.payload && !fc.nudge && fc.open < 1) fc.setOpen(Math.min(1, fc.open + dt * 5));
  }

  function updateLoose(item, dt) {
    // cassettes and chips that are simply being carried or lying around
    const pos = item.obj.position;
    if (item.popIn !== undefined) {
      item.popIn = Math.min(1, item.popIn + dt * 3);
      item.obj.scale.setScalar(Math.max(0.01, U.easeOutBack(item.popIn)));
      if (item.popIn >= 1) { item.obj.scale.setScalar(1); delete item.popIn; }
      EC.touchShadow();
    }
    if (item.homing) {
      item.homing = Math.max(0, item.homing - dt * 4);
      tmpV.set(item.slot.x, item.slot.y, item.slot.z);
      pos.lerp(tmpV, 1 - Math.exp(-16 * dt));
      item.obj.rotation.x = U.damp(item.obj.rotation.x, -Math.PI / 2, 16, dt);
      if (item.homing === 0) { pos.copy(tmpV); item.obj.rotation.set(-Math.PI / 2, 0, 0); }
      EC.touchShadow();
      return;
    }
    if (item.held) {
      const k = 1 - Math.exp(-20 * dt);
      pos.x += (item.tx - pos.x) * k; pos.z += (item.tz - pos.z) * k;
      const lift = item.over ? 0.55 : 1.9;
      pos.y += (item.floorY + lift - pos.y) * (1 - Math.exp(-16 * dt));
      item.obj.rotation.x = U.damp(item.obj.rotation.x, 0, 14, dt);
      item.obj.rotation.z = U.damp(item.obj.rotation.z, 0, 14, dt);
      EC.touchShadow();
    } else if (item.falling) {
      item.obj.rotation.x = U.damp(item.obj.rotation.x, 0, 20, dt);
      fall(item, dt);
    }
  }

  // ---------------------------------------------------------------------------------------
  // pellet cup
  // ---------------------------------------------------------------------------------------
  const loose = [];
  let looseMesh = null;
  const m4 = new T.Matrix4(), qI = new T.Quaternion(), s3 = new T.Vector3(0.36, 0.3, 0.36);

  function cupHandler(cup, p) {
    const h = startCarry(cup, p, 0);
    h.move = function (pp) {
      aimRay(h, pp);
      if (!EC.rayFloor(ray, CUP_FLOORS, hit)) return;
      cup.tx = hit.x; cup.tz = hit.z; cup.floorY = hit.y; cup.zoneName = hit.zone.name;
    };
    h.end = function () {
      cup.held = false;
      const pos = cup.obj.position;
      let allowed = { bench: 1, deck: 1, plate: 1, chamberLid: 1, cold: 1, coldFrame: 1, towerTop: 1, tankLid: 1 };
      // it cannot be left standing in the bath: it goes back to its place on the bench
      if (cup.zoneName === 'tank') { pos.x = D.cup.x; pos.z = D.cup.z; pos.y = 6; allowed = { bench: 1 }; }
      EC.floorAt(pos.x, pos.z, allowed, fl);
      land(cup, fl.name === 'none' ? 'bench' : fl.name, fl.y);
    };
    h.move(p);
    return h;
  }

  function updateCup(cup, dt) {
    const pos = cup.obj.position;
    const overTank = cup.held && (cup.zoneName === 'tank' || cup.zoneName === 'tankLid');
    if (cup.held) {
      const k = 1 - Math.exp(-14 * dt);
      // over the reservoir it is held to one side and tipped, so the pour lands where you point
      const tx = overTank ? cup.tx - 8.4 : cup.tx;
      const tz = overTank ? U.clamp(cup.tz, D.tank.z0 + 5, D.tank.z1 - 5) : cup.tz;
      const ty = overTank ? D.tower.y1 + 7 : cup.floorY + 3;
      pos.x += (tx - pos.x) * k; pos.z += (tz - pos.z) * k;
      pos.y += (ty - pos.y) * (1 - Math.exp(-10 * dt));
      EC.touchShadow();
    } else if (cup.falling) fall(cup, dt);
    cup.tip = U.damp(cup.tip || 0, overTank ? 1 : 0, 6, dt);
    cup.obj.rotation.z = -cup.tip * 1.72;
    R.cupShadow.position.x = pos.x; R.cupShadow.position.z = pos.z;
    R.cupShadow.visible = pos.y < 1;
    if (cup.tip > 0.8) {
      cup.acc = (cup.acc || 0) + dt * 11;
      while (cup.acc > 1) {
        cup.acc -= 1;
        loose.push({ x: pos.x + 8.2, y: pos.y + 1.2 + Math.random() * 2.4, z: pos.z + (Math.random() - 0.5) * 5, vx: 6 + Math.random() * 8, vy: -6, vz: (Math.random() - 0.5) * 8, rest: 0, b: 0 });
        EC.emit('pellet', 0);
      }
    }
  }

  function updateLoosePellets(dt) {
    let n = 0, moving = false;
    for (let i = loose.length - 1; i >= 0; i--) {
      const p = loose[i];
      if (p.rest < 1) {
        moving = true;
        p.vy -= 700 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        EC.floorAt(p.x, p.z, null, fl);
        if (fl.name === 'tank') {
          if (p.y < D.tower.y1) { if (W.addPellet(p.x, p.y, p.z, p.vx * 0.3, p.vy, p.vz * 0.3)) { loose.splice(i, 1); continue; } }
        } else if (p.y <= fl.y + 0.3 && p.vy < 0) {
          p.y = fl.y + 0.3;
          if (Math.abs(p.vy) < 26 || p.b > 5) { p.rest = 1; p.vx = p.vz = 0; }
          else { p.vy = -p.vy * 0.42; p.vx = p.vx * 0.6 + (Math.random() - 0.5) * 16; p.vz = p.vz * 0.6 + (Math.random() - 0.5) * 16; p.b++; EC.emit('pellet', 1); }
        }
        if (p.y < -2) { loose.splice(i, 1); continue; }
      }
    }
    while (loose.length > 80) loose.shift();
    if (!moving && looseMesh.count === loose.length) return;
    for (let i = 0; i < loose.length; i++) {
      const p = loose[i];
      m4.compose(tmpV.set(p.x, p.y, p.z), qI, s3);
      looseMesh.setMatrixAt(n++, m4);
    }
    looseMesh.count = n; looseMesh.visible = n > 0;
    looseMesh.instanceMatrix.needsUpdate = true;
    EC.touchShadow();
  }

  // ---------------------------------------------------------------------------------------
  // fixed controls of the machine: lever, foot switch, lids, flow knob
  // ---------------------------------------------------------------------------------------
  function ctrlHandler(name, p) {
    const h = { ctrl: name, t0: performance.now() };
    if (name === 'lever') {
      mech.lever.hand = 1;
      h.end = function () { mech.lever.hand = 0; };
    } else if (name === 'pedal') {
      mech.pedal.down = 1;
      h.end = function () { mech.pedal.down = 0; };
    } else if (name === 'lidTank' || name === 'lidChamber') {
      const lid = mech[name];
      lid.held = true; lid.v = 0;
      const horiz = name === 'lidChamber';
      h.move = function (pp) {
        const dy = pp.y - pp.py, dx = pp.x - pp.px;
        lid.a = U.clamp(lid.a + (-dy * 0.011) + (horiz ? -dx * 0.004 : 0), 0, lid.max);
        lid.v = 0;
        EC.touchShadow();
      };
      h.end = function (pp, tapped) {
        lid.held = false;
        if (tapped) lid.v = lid.a < 0.1 ? 3.4 : 0;     // a tap just rattles it
        lid.goal = lid.a > lid.max * 0.45 ? 1 : 0;
      };
    } else if (name === 'knob') {
      h.move = function (pp) {
        const k = mech.knob, before = Math.round(k.a * 6);
        k.a = U.clamp(k.a + (pp.x - pp.px) * 0.012 - (pp.y - pp.py) * 0.012, -1.3, 1.3);
        mech.flowScale = 1 + k.a * 0.55;
        if (Math.round(k.a * 6) !== before) EC.emit('tick', 0.5);
      };
    }
    return h;
  }

  function updateMech(dt, time) {
    // lever: pushed by hand or by a mold, returned by its spring
    const lv = mech.lever;
    const target = Math.max(lv.hand * D.lever.maxAngle, Math.asin(U.clamp(lv.push / D.lever.len, 0, 0.3)));
    const prev = lv.a;
    lv.s = lv.s || { x: 0, v: 0 };
    lv.a = Math.max(0, U.spring(lv.s, target, target > lv.a ? 46 : 30, dt));
    if (prev > 0.012 && lv.a <= 0.012 && target < 0.005) EC.emit('clack', 0.7);
    if (prev < 0.03 && lv.a >= 0.03) EC.emit('clack', 0.45);
    R.lever.rotation.x = lv.a;
    if (Math.abs(lv.a - prev) > 1e-5) EC.touchShadow();
    const open = U.smooth(0.12, 0.72, lv.a / D.lever.maxAngle);
    // foot switch
    const pd = mech.pedal, px = pd.x;
    pd.x = U.damp(pd.x, pd.down || pd.key ? 1 : 0, 34, dt);
    R.pedal.rotation.x = 0.2 - 0.17 * pd.x;
    if ((px < 0.6) !== (pd.x < 0.6)) EC.emit('pedal', pd.x >= 0.6);
    if (Math.abs(pd.x - px) > 1e-4) EC.touchShadow();
    const v = Math.max(open, pd.x >= 0.6 ? 1 : 0);
    if ((mech.valve > 0.03) !== (v > 0.03)) EC.emit('valve', v > 0.03);
    mech.valve = v;
    R.flowLed.material = v > 0.03 ? R.flowLedOn : R.flowLedOff;
    R.knob.rotation.x = mech.knob.a * 1.6;

    // lids swing on their hinges; let go and they fall open or shut
    ['lidTank', 'lidChamber'].forEach(function (name) {
      const lid = mech[name];
      if (!lid.held) {
        const goal = lid.goal ? lid.max : 0;
        if (Math.abs(lid.a - goal) > 1e-4 || Math.abs(lid.v) > 1e-3) {
          lid.v += (lid.goal ? 9 : -11) * dt;
          lid.a += lid.v * dt;
          if (lid.a >= lid.max) { lid.a = lid.max; if (lid.v > 0.6) { EC.emit('lidStop', name, true, Math.min(1, lid.v / 4)); lid.v = -lid.v * 0.22; } else lid.v = 0; }
          if (lid.a <= 0) { lid.a = 0; if (lid.v < -0.6) { EC.emit('lidStop', name, false, Math.min(1, -lid.v / 4)); lid.v = -lid.v * 0.18; } else lid.v = 0; }
          EC.touchShadow();
        }
      }
    });
    R.lidTank.rotation.x = -mech.lidTank.a;
    R.lidChamber.rotation.z = mech.lidChamber.a;
    // heater lamp follows the thermostat
    R.ledHeat.material.color.setRGB(EC.tank.heat ? 2.2 : 0.25, EC.tank.heat ? 1.0 : 0.12, 0.05);
  }

  // ---------------------------------------------------------------------------------------
  // section view of the mold cooling on the cold plate (beginner mode)
  // ---------------------------------------------------------------------------------------
  function updateSection(m, dt) {
    const want = EC.state.play && m === sim.focus && m.where === 'cold' && !m.held && !m.falling && m.fill && m.fill.vol > 0.5 && !(m.cassette && (m.cassette.pullTarget || 0) > 0.001);
    const prev = m.secT || 0;
    m.secT = U.clamp(prev + (want ? dt * 1.7 : -dt * 4), 0, 1);
    if (m.secT > 0 && prev === 0) { m.secSide = EC.camera.position.z >= m.obj.position.z ? 1 : -1; EC.emit('slice', m); }
    if (m.secT > 0) {
      const camSide = EC.camera.position.z >= m.obj.position.z ? 1 : -1;
      if (camSide !== m.secSide && m.secT >= 1) { m.secSide = camSide; }
      const off = U.lerp(2.3, 0.0, U.easeInOut(m.secT));
      const z = m.obj.position.z;
      if (m.secSide > 0) { m.plane.normal.set(0, 0, -1); m.plane.constant = z + off; }
      else { m.plane.normal.set(0, 0, 1); m.plane.constant = -(z - off); }
      if (m.view) { m.view.cap.visible = m.view.steel.visible = m.secT > 0.92; m.view.secT = m.secT; if (prev !== m.secT) m.view.done = false; }
      EC.touchShadow();
    } else if (prev > 0 || m.plane.constant < 1e4) {
      m.plane.normal.set(0, 0, -1); m.plane.constant = 1e5;
      if (m.view) { m.view.cap.visible = m.view.steel.visible = false; m.view.secT = 0; }
    }
    const c = m.cassette, ch = m.chip;
    if (c) { c.plane.normal.copy(m.plane.normal); c.plane.constant = m.plane.constant; }
    if (ch) { ch.plane.normal.copy(m.plane.normal); ch.plane.constant = m.plane.constant; ch.clipped = true; }
  }

  // ---------------------------------------------------------------------------------------
  // picking
  // ---------------------------------------------------------------------------------------
  I.pick = function (p) {
    EC.setRay(p.x, p.y, ray);
    const hits = ray.intersectObjects(EC.picks, false);
    if (!hits.length) return null;
    const best = hits[0];
    const ud = best.object.userData;
    if (ud.ctrl) return ctrlHandler(ud.ctrl, p);
    const it = ud.item;
    if (!it || it.held) return null;
    if (it.kind === 'mold') {
      if (it.where === 'chamber' && mech.lidChamber.a < 0.9) return ctrlHandler('lidChamber', p);
      // a cassette sitting on the mold is what the hand meets first
      if (it.cassette && !it.held) {
        const lp = it.obj.worldToLocal(tmpV.copy(best.point));
        if (Math.abs(lp.x) < 2.05 && Math.abs(lp.z) < 1.45) return cassetteOnMoldHandler(it.cassette, p);
        for (let i = 0; i < hits.length; i++) if (hits[i].object.userData.item === it.cassette) return cassetteOnMoldHandler(it.cassette, p);
      }
      return moldHandler(it, p);
    }
    if (it.kind === 'cassette') {
      if (it.where === 'chamber' && mech.lidChamber.a < 0.9) return ctrlHandler('lidChamber', p);
      if (it.where === 'block') return null;
      return cassetteHandler(it, p);
    }
    if (it.kind === 'block') return blockHandler(it, p);
    if (it.kind === 'forceps') return forcepsHandler(it, p);
    if (it.kind === 'cup') return cupHandler(it, p);
    if (it.kind === 'chip' && it.where === 'forceps') {
      const holder = items.forceps.find(function (q) { return q.payload === it; });
      if (holder && !holder.held) return forcepsHandler(holder, p);
      return null;
    }
    if (it.kind === 'chip') {
      // chips are handled with the forceps: fetch the nearest warm pair
      EC.emit('needForceps', it);
      return { item: it, t0: performance.now(), end: function () {} };
    }
    return null;
  };

  I.hover = function (x, y) {
    if (!EC.state.play) { if (I.hot) { I.hot = false; EC.renderer.domElement.classList.remove('point'); } return; }
    EC.setRay(x, y, ray);
    const hot = ray.intersectObjects(EC.picks, false).length > 0;
    if (hot !== I.hot) { I.hot = hot; EC.renderer.domElement.classList.toggle('point', hot); }
  };

  // ---------------------------------------------------------------------------------------
  // what would be a sensible next move? (drives the wordless hint)
  // ---------------------------------------------------------------------------------------
  const sA = new T.Vector3(), sB = new T.Vector3();
  sim.suggest = function () {
    const lidOpen = mech.lidChamber.a > 0.9;
    let m = sim.focus;
    const out = { kind: 'none', a: sA, b: sB };
    // a mold in play?
    let active = null;
    for (let i = 0; i < items.molds.length; i++) { const mo = items.molds[i]; if (mo.where !== 'chamber' && !mo.held) { if (!active || mo === m) active = mo; } }
    if (!active) {
      if (!lidOpen) { R.lidChamber.localToWorld(sA.set(12.4, 1, 0)); sB.copy(sA); sB.y += 9; sB.x -= 5; out.kind = 'drag'; return out; }
      const mo = items.molds.find(function (q) { return q.where === 'chamber'; });
      if (!mo) return out;
      mo.obj.getWorldPosition(sA); sA.y += 1; sB.set(0, D.plate.y + 1, D.nozzle.z + 0.4); out.kind = 'drag'; return out;
    }
    m = active;
    const p = m.obj.position, f = m.fill, vol = f ? f.vol : 0;
    const under = m.where === 'plate' && Math.abs(p.x) < 0.8 && Math.abs(p.z - D.nozzle.z) < 0.9;
    const c = m.cassette, chip = m.chip;
    const levelOK = f && f.level > MS.ledgeY - 0.12;
    if (m.where === 'cold') {
      if (!c) {
        if (vol > 0.3) { out.kind = 'wait'; sA.set(p.x, p.y + 1.5, p.z); return out; }
        // an empty mold left on the cold plate: bring it back for the next block
        sA.set(p.x, p.y + 1, p.z); sB.set(0, D.plate.y + 1, D.nozzle.z + 0.3); out.kind = 'drag'; return out;
      }
      if (f && f.readiness() > 0.97) { p.y += 0; sA.set(p.x, p.y + 1.5, p.z); sB.set(p.x, p.y + 8, p.z); out.kind = 'drag'; out.ready = true; return out; }
      out.kind = 'wait'; sA.set(p.x, p.y + 1.5, p.z); return out;
    }
    if (!levelOK && !chip) {
      if (!under) { sA.set(p.x, p.y + 1, p.z); sB.set(0, D.plate.y + 1, D.nozzle.z + 0.3); out.kind = 'drag'; return out; }
      R.lever.localToWorld(sA.set(0, -6.3, 0.3)); out.kind = 'hold'; return out;
    }
    if (!chip && !c) {
      const fc = items.forceps.find(function (q) { return !q.held; });
      const ch = items.chips.find(chipFree);
      if (!fc || !ch) return out;
      const carrying = items.forceps.find(function (q) { return q.payload; });
      if (carrying) { carrying.obj.getWorldPosition(sA); sB.set(p.x, p.y + 1, p.z); out.kind = 'drag'; return out; }
      fc.obj.getWorldPosition(sA); sA.y += fc.where === 'well' ? 6 : 0.5; ch.obj.getWorldPosition(sB); sB.y += 0.4; out.kind = 'drag'; return out;
    }
    if (chip && !c && Math.abs(U.wrapPi(chip.rot)) > 0.14 && !chip.locked && !chip.turnTried) {
      // swirl the chip straight with the forceps
      const fc = items.forceps.find(function (q) { return !q.held; });
      if (fc) { fc.obj.getWorldPosition(sA); sA.y += fc.where === 'well' ? 6 : 0.5; sB.set(p.x + chip.lx, p.y + 0.8, p.z + chip.lz); out.kind = 'drag'; out.turn = true; return out; }
    }
    if (!c) {
      const cs = items.cassettes.find(function (q) { return q.where === 'chamber'; }) || items.cassettes.find(function (q) { return q.where !== 'mold' && q.where !== 'block' && !q.held; });
      if (!cs) return out;
      if (cs.where === 'chamber' && !lidOpen) { R.lidChamber.localToWorld(sA.set(12.4, 1, 0)); sB.copy(sA); sB.y += 9; sB.x -= 5; out.kind = 'drag'; return out; }
      cs.obj.getWorldPosition(sA); sA.y += 0.6; sB.set(p.x, p.y + 1.6, p.z); out.kind = 'drag'; return out;
    }
    if (c.seatY > MS.ledgeY + 0.02 && !c.locked) { sA.set(p.x, p.y + 1.6, p.z); out.kind = 'hold'; return out; }
    if (f && f.level < c.seatY + CS.h - 0.16 && f.phi < 0.2) {
      if (!under) { sA.set(p.x, p.y + 1, p.z); sB.set(0, D.plate.y + 1, D.nozzle.z + 0.3); out.kind = 'drag'; return out; }
      R.lever.localToWorld(sA.set(0, -6.3, 0.3)); out.kind = 'hold'; return out;
    }
    sA.set(p.x, p.y + 1, p.z); sB.set((D.cold.plate.x0 + D.cold.plate.x1) / 2, D.cold.plate.y + 1, (D.cold.plate.z0 + D.cold.plate.z1) / 2); out.kind = 'drag'; return out;
  };

  // ---------------------------------------------------------------------------------------
  EC.initInteract = function () {
    items = EC.items; mech = EC.mech; R = EC.rig; W = EC.wax;
    W.init();
    // per-mold steel (own clipping plane for the section view)
    items.molds.forEach(function (m) {
      m.plane = new T.Plane(new T.Vector3(0, 0, -1), 1e5);
      m.mesh.material = EC.mats.steelPolish.clone();
      m.mesh.material.side = T.DoubleSide;
      m.mesh.material.clippingPlanes = [m.plane];
      m.fill = null; m.view = null; m.cassette = null; m.chip = null; m.secT = 0;
    });
    items.cassettes.forEach(function (c) {
      c.plane = new T.Plane(new T.Vector3(0, 0, -1), 1e5);
      c.mesh.material.clippingPlanes = [c.plane];
      c.mesh.material.side = T.DoubleSide;
      c.seatY = MS.ledgeY; c.pull = 0;
    });
    items.chips.forEach(function (ch) {
      ch.rot = ch.obj.rotation.y; ch.lx = ch.lz = 0; ch.ly = 0;
      ch.plane = new T.Plane(new T.Vector3(0, 0, -1), 1e5);
      ch.mesh.material.clippingPlanes = [ch.plane];
    });
    sim.api = { attachCassette: attachCassette, dropChip: dropChipHere, pop: popBlock, dock: dockForceps };
    looseMesh = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), EC.mats.waxPellet, 80);
    looseMesh.count = 0; looseMesh.visible = false; looseMesh.frustumCulled = false; looseMesh.castShadow = true; looseMesh.userData.noPick = true;
    EC.scene.add(looseMesh);

    // pick proxies for the fixed controls
    function ctrlPick(parent, name, w, h, d, x, y, z) {
      const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), EC.pickMat);
      mesh.position.set(x, y, z); mesh.visible = false; mesh.userData.ctrl = name;
      parent.add(mesh); EC.picks.push(mesh);
    }
    ctrlPick(R.lever, 'lever', 4.6, 8.4, 2.2, 0, -4.4, 0.2);
    ctrlPick(R.pedal, 'pedal', 9.6, 2.2, 12.4, 0, 0.5, -6);
    ctrlPick(R.lidTank, 'lidTank', 31, 2.6, 25.5, 0, 0.6, 12.8);
    ctrlPick(R.lidChamber, 'lidChamber', 14, 1.8, 19.6, 7, 0.4, 0);
    ctrlPick(R.knob, 'knob', 2.6, 3.4, 3.4, 0.9, 0, 0);

    window.addEventListener('keydown', function (e) {
      if (e.code === 'Space') { if (EC.state.play) { mech.pedal.key = 1; EC.emit('gesture'); } e.preventDefault(); }
    });
    window.addEventListener('keyup', function (e) { if (e.code === 'Space') mech.pedal.key = 0; });
    window.addEventListener('blur', function () { mech.pedal.key = 0; });

    let dispT = 0;
    EC.updaters.push(function (dt, time) {
      sim.scrape = 0; sim.swirl = (sim.swirl || 0) * Math.exp(-dt * 8);
      updateMech(dt, time);
      for (let i = 0; i < items.molds.length; i++) { const m = items.molds[i]; updateMold(m, dt, time); updateSection(m, dt); }
      for (let i = 0; i < items.cassettes.length; i++) { const c = items.cassettes[i]; if (c.where !== 'mold' && c.where !== 'block') updateLoose(c, dt); }
      for (let i = 0; i < items.chips.length; i++) {
        const ch = items.chips[i];
        if (ch.where !== 'mold' && ch.clipped) { ch.clipped = false; ch.plane.constant = 1e5; ch.plane.normal.set(0, 0, -1); }
        if (ch.where !== 'mold' && ch.where !== 'block' && ch.where !== 'forceps') updateLoose(ch, dt);
      }
      for (let i = 0; i < items.forceps.length; i++) updateForceps(items.forceps[i], dt, time);
      for (let i = sim.blocks.length - 1; i >= 0; i--) updateBlock(sim.blocks[i], dt);
      updateCup(items.cup, dt);
      updateLoosePellets(dt);
      W.update(dt, time);
      if (sim.focus && (!sim.focus.fill || sim.focus.fill.vol < 0.02)) sim.focus = null;
      dispT -= dt;
      if (dispT <= 0) {
        dispT = 0.2;
        R.display.draw({ tank: EC.tank.temp, plate: EC.envT.plate, chamber: EC.envT.chamber, level: EC.tank.level, heat: EC.tank.heat, flow: mech.valve > 0.03 });
        R.coldDisplay.draw(EC.envT.cold);
      }
    });

    // leaving beginner mode lets go of everything that is being held
    EC.on('mode', function (play) {
      if (!play) { EC.controls.releaseAll(); mech.lever.hand = 0; mech.pedal.down = 0; mech.pedal.key = 0; }
    });
  };
})();
