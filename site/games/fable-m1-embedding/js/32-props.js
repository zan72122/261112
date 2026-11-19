/* Loose items: stainless base molds, plastic cassettes, test chips, forceps and the wax pellet cup.
   This file only builds them and puts them in their starting places; behaviour is in 61-interact. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;

  /* Mold cavity: a deep well (the block face) under a wider ledge that seats the cassette.
     Local coordinates, origin at the centre of the mold's underside. */
  const MS = (EC.moldShape = {
    floorY: 0.08, ledgeY: 0.75, rimY: 1.26, dome: 0.17,
    outerHx: 2.4, outerHz: 1.8,
    wellHx: 1.45, wellHz: 1.15,
    half: function (y, out) {
      if (y <= MS.ledgeY) { const t = U.sat((y - MS.floorY) / (MS.ledgeY - MS.floorY)); out[0] = 1.45 + 0.11 * t; out[1] = 1.15 + 0.11 * t; }
      else { const t = U.sat((y - MS.ledgeY) / (MS.rimY - MS.ledgeY)); out[0] = 2.06 + 0.08 * t; out[1] = 1.46 + 0.08 * t; }
      return out;
    },
  });
  /* Cassette: 4.0 x 2.8 x 0.6, slotted floor, slanted writing face on the +x end. */
  const CS = (EC.cassetteShape = { hx: 2.0, hz: 1.4, h: 0.6, floor: 0.1, innerHx: 1.5, innerHz: 1.27, innerCx: -0.375, solid: 0.38 });

  function moldGeometry() {
    return EC.geom.loft([
      { y: 0.0, hx: 1.5, hz: 1.2, r: 0.35 }, { y: 0.7, hx: 1.62, hz: 1.32, r: 0.38 }, { y: 0.72, hx: 2.13, hz: 1.53, r: 0.42, sharp: true },
      { y: 1.2, hx: 2.2, hz: 1.6, r: 0.45 }, { y: 1.2, hx: 2.4, hz: 1.8, r: 0.5, sharp: true }, { y: 1.26, hx: 2.4, hz: 1.8, r: 0.5, sharp: true },
      { y: 1.26, hx: 2.14, hz: 1.54, r: 0.42, sharp: true }, { y: 0.76, hx: 2.06, hz: 1.46, r: 0.38 }, { y: 0.75, hx: 1.56, hz: 1.26, r: 0.34, sharp: true },
      { y: 0.08, hx: 1.45, hz: 1.15, r: 0.3 },
    ], { capBottom: true, capTop: true, k: 4 });
  }

  function cassetteGeometry() {
    const G = EC.geom, parts = [];
    // frame
    parts.push({
      g: G.loft([
        { y: 0, hx: 1.625, hz: 1.4, r: 0.1 }, { y: 0.6, hx: 1.625, hz: 1.4, r: 0.1 }, { y: 0.6, hx: 1.5, hz: 1.27, r: 0.06, sharp: true }, { y: 0.1, hx: 1.5, hz: 1.27, r: 0.06 },
      ], { k: 2 }), m: new T.Matrix4().makeTranslation(-0.375, 0, 0),
    });
    // slanted writing end: profile in (p, y) extruded along x, then turned so p -> x
    const wedge = G.prism([[1.25, 0], [2.0, 0], [2.0, 0.14], [1.25, 0.6]], -1.4, 1.4, 0.03, { seg: 2 });
    parts.push({ g: wedge, m: new T.Matrix4().makeRotationY(Math.PI / 2) });
    // slotted floor: long rails and cross bars
    function bar(w, d, x, z) {
      parts.push({ g: new T.BoxGeometry(w, 0.1, d), m: new T.Matrix4().makeTranslation(x, 0.05, z) });
    }
    [-1.3, -0.44, 0.44, 1.3].forEach(function (z) { bar(3.2, 0.15, -0.375, z); });
    for (let i = 0; i <= 11; i++) bar(0.1, 2.6, -1.95 + i * 0.286, 0);
    return G.merge(parts);
  }

  function labelGeometry() {
    const g = new T.PlaneGeometry(0.8, 2.5);
    const ang = Math.atan2(0.46, 0.75);
    g.rotateX(-Math.PI / 2);
    g.rotateZ(-ang);
    g.translate(1.63, 0.385, 0);
    return g;
  }

  const CASSETTE_COLORS = [0xf2f2ee, 0xf3a9bd, 0xf4dc6a, 0x8fd3a0, 0x8fbfe8, 0xf2a66a, 0xc3aee6, 0x86d4d0];
  const CHIP_DEFS = [['#d8453a', 'F'], ['#2f6fd0', 'R'], ['#2c9a57', 'G'], ['#e0a21c', 'P'], ['#7b4fc4', 'J'], ['#e2662a', 'Q']];

  function pickBox(w, h, d, y) {
    const m = new T.Mesh(new T.BoxGeometry(w, h, d), EC.pickMat);
    m.position.y = y;
    m.visible = false;
    return m;
  }

  EC.buildProps = function () {
    const D = EC.D, M = EC.mats, R = EC.rig;
    EC.pickMat = new T.MeshBasicMaterial({ visible: false });
    const items = (EC.items = { molds: [], cassettes: [], chips: [], forceps: [], cup: null, all: [] });
    const picks = (EC.picks = []);

    function reg(item, pick) {
      pick.userData.item = item;
      item.pick = pick;
      item.obj.add(pick);
      picks.push(pick);
      items.all.push(item);
      item.obj.traverse(function (o) { if (o.isMesh && o !== pick) { o.userData.item = item; } });
    }

    // ---------------- molds ----------------
    const mg = moldGeometry();
    const ch = D.chamber, ccx = (ch.x0 + ch.x1) / 2;
    for (let i = 0; i < 4; i++) {
      const obj = new T.Group();
      const mesh = new T.Mesh(mg, M.steelPolish);
      mesh.castShadow = mesh.receiveShadow = true;
      obj.add(mesh);
      const slot = { x: ccx + (i % 2 ? 2.85 : -2.85), y: ch.floorY, z: ch.z0 + 2.4 + Math.floor(i / 2) * 4.1 };
      obj.position.set(slot.x, slot.y, slot.z);
      R.chamberGroup.add(obj);
      const item = { kind: 'mold', label: 'ベースモールド', obj: obj, mesh: mesh, slot: slot, where: 'chamber', id: i, lift: 2.0 };
      reg(item, pickBox(5.0, 1.7, 3.8, 0.85));
      items.molds.push(item);
    }

    // ---------------- cassettes ----------------
    const cg = cassetteGeometry(), lg = labelGeometry();
    const labelMat = new T.MeshStandardMaterial({ color: 0xfbfbf8, roughness: 0.7, metalness: 0 });
    for (let i = 0; i < 8; i++) {
      const obj = new T.Group();
      const mat = new T.MeshStandardMaterial({ color: CASSETTE_COLORS[i], roughness: 0.5, metalness: 0 });
      const mesh = new T.Mesh(cg, mat);
      mesh.castShadow = mesh.receiveShadow = true;
      const lab = new T.Mesh(lg, labelMat);
      obj.add(mesh, lab);
      const slot = { x: ccx, y: ch.floorY + 1.42, z: ch.z1 - 8.5 + i * 1.02, stand: true };
      obj.position.set(slot.x, slot.y, slot.z);
      obj.rotation.x = -Math.PI / 2;
      R.chamberGroup.add(obj);
      const item = { kind: 'cassette', label: 'カセット', obj: obj, mesh: mesh, labelMesh: lab, slot: slot, where: 'chamber', id: i, lift: 2.2, color: CASSETTE_COLORS[i] };
      reg(item, pickBox(4.3, 1.0, 3.1, 0.3));
      items.cassettes.push(item);
    }

    // ---------------- test chips ----------------
    const chipGeo = new T.BoxGeometry(1.3, 0.14, 0.9);
    const rnd = U.rng(42);
    const ds = D.dish;
    CHIP_DEFS.forEach(function (def, i) {
      const obj = new T.Group();
      const mat = new T.MeshStandardMaterial({ map: EC.tex.chip(def[0], def[1]), color: 0xb4b4b4, roughness: 0.42, metalness: 0 });
      const mesh = new T.Mesh(chipGeo, mat);
      mesh.position.y = 0.07;
      mesh.castShadow = mesh.receiveShadow = true;
      obj.add(mesh);
      const slot = { x: ds.x - 3.1 + (i % 3) * 3.1, y: ds.floorY, z: ds.z - 1.75 + Math.floor(i / 3) * 3.5 };
      obj.position.set(slot.x, slot.y, slot.z);
      obj.rotation.y = (rnd() - 0.5) * 2.6 + (rnd() < 0.3 ? Math.PI : 0);
      R.dishGroup.add(obj);
      const item = { kind: 'chip', label: 'テストチップ', obj: obj, mesh: mesh, slot: slot, where: 'dish', id: i, lift: 1.6 };
      reg(item, pickBox(1.9, 0.9, 1.5, 0.25));
      items.chips.push(item);
    });

    // ---------------- forceps ----------------
    const bladeGeo = EC.geom.blade(12, 0.14, 0.92, 0.07, 0.13);
    const tipGeo = new T.SphereGeometry(0.34, 12, 8);
    [1, 5].forEach(function (holeIdx, i) {
      const obj = new T.Group();
      const mat = M.steelSatin;
      const blades = [];
      [-1, 1].forEach(function (s) {
        const hinge = new T.Group();
        hinge.position.set(0, 12, 0);
        const b = new T.Mesh(bladeGeo, mat);
        b.position.set(0, -12, s * 0.07);
        b.castShadow = true;
        hinge.add(b);
        hinge.userData.sign = s;
        obj.add(hinge);
        blades.push(hinge);
      });
      const back = new T.Mesh(new T.BoxGeometry(0.92, 1.3, 0.3), mat);
      back.position.set(0, 12.2, 0);
      back.castShadow = true;
      obj.add(back);
      // stylised heat halo at the tips and a wax blob that appears when cold tips freeze wax
      const glow = new T.Mesh(tipGeo, new T.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending }));
      glow.scale.set(0.6, 3.2, 0.6); glow.position.y = 1.2;
      const blob = new T.Mesh(tipGeo, M.waxSolid());
      blob.scale.setScalar(0.001); blob.position.y = 0.25; blob.visible = false; blob.castShadow = true;
      obj.add(glow, blob);
      const hole = R.wellHoles[holeIdx];
      hole.used = true;
      const item = {
        kind: 'forceps', label: 'ピンセット', obj: obj, blades: blades, glow: glow, blob: blob, hole: holeIdx, where: 'well', id: i, lift: 0,
        open: 1, temp: EC.K.Twell, payload: null, blobAmt: 0, dip: 0, dwell: 0, nudge: null,
      };
      item.setOpen = function (o) {
        item.open = o;
        const a = 0.004 + 0.04 * o;
        blades[0].rotation.x = a; blades[1].rotation.x = -a;
      };
      item.setOpen(1);
      // docked: standing in a well, tips down, leaning back
      obj.position.set(hole.x, D.wells.topY - 1.05, hole.z);
      obj.rotation.set(-0.2, i ? 0.5 : -0.35, 0);
      R.wellsGroup.add(obj);
      reg(item, pickBox(1.8, 12.5, 1.8, 6.5));
      items.forceps.push(item);
    });

    // ---------------- wax pellet cup ----------------
    (function () {
      const obj = new T.Group();
      const cupGeo = new T.LatheGeometry([
        new T.Vector2(0.01, 0), new T.Vector2(3.5, 0), new T.Vector2(3.7, 0.3), new T.Vector2(4.5, 8.4), new T.Vector2(4.75, 8.7), new T.Vector2(4.6, 8.75),
        new T.Vector2(4.32, 8.4), new T.Vector2(3.55, 0.5), new T.Vector2(0.01, 0.5),
      ], 36);
      const cup = new T.Mesh(cupGeo, M.steelFine);
      cup.castShadow = cup.receiveShadow = true;
      obj.add(cup);
      // heap of pellets
      const heap = new T.Mesh(new T.SphereGeometry(4.2, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.waxPellet);
      heap.scale.set(1, 0.32, 1); heap.position.y = 6.6;
      obj.add(heap);
      const pg = new T.SphereGeometry(0.36, 8, 6);
      const inst = new T.InstancedMesh(pg, M.waxPellet, 90);
      const mm = new T.Matrix4(), r = U.rng(7), q = new T.Quaternion(), sc = new T.Vector3();
      for (let i = 0; i < 90; i++) {
        const a = r() * 6.283, rr = Math.sqrt(r()) * 3.9;
        const y = 6.55 + 1.36 * Math.sqrt(Math.max(0, 1 - (rr / 4.2) * (rr / 4.2))) + (r() - 0.5) * 0.12;
        sc.set(1, 0.72 + r() * 0.2, 1);
        mm.compose(new T.Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr), q, sc);
        inst.setMatrixAt(i, mm);
      }
      inst.castShadow = true;
      obj.add(inst);
      obj.position.set(D.cup.x, 0, D.cup.z);
      EC.scene.add(obj);
      EC.definePart(obj, 'ワックス粒', 0, 2.5, 0);
      const item = { kind: 'cup', label: 'ワックス粒', obj: obj, where: 'bench', lift: 2.5, heap: heap, pellets: inst };
      reg(item, pickBox(9.6, 9.5, 9.6, 4.6));
      items.cup = item;
      R.cupShadow = EC.contactShadow(D.cup.x - 3.6, D.cup.x + 3.6, D.cup.z - 3.6, D.cup.z + 3.6, 0, 3, 0.5);
    })();
  };
})();
