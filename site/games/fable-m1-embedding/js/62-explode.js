/* Tap a part: it moves out a little along its own axis and a short Japanese label appears. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;
  const ray = new T.Raycaster();
  const E = (EC.explode = { cur: null, t: 0 });
  let label, leader;
  const anchor = new T.Vector3(), scr = { x: 0, y: 0 };
  let lx = 0, ly = 0, shown = false;

  function ownerOf(o) {
    while (o) {
      if (o.userData.item) return { item: o.userData.item };
      if (o.userData.part) return { part: o.userData.part };
      o = o.parent;
    }
    return null;
  }

  E.hide = function () {
    if (!E.cur) return;
    if (E.cur.part) E.cur.part.target = 0;
    if (E.cur.item) E.cur.item.exT = 0;
    E.cur = null;
    shown = false;
    label.classList.remove('on'); leader.classList.remove('on');
  };

  E.show = function (own, point) {
    E.hide();
    E.cur = own; E.t = 0;
    const text = own.part ? own.part.label : own.item.label;
    label.textContent = text;
    if (own.part) {
      own.part.target = 1;
      E.rel = own.part.group.worldToLocal(point.clone());
      E.obj = own.part.group;
    } else {
      own.item.exT = 1;
      E.rel = own.item.obj.worldToLocal(point.clone());
      E.obj = own.item.obj;
    }
    shown = true;
    label.classList.add('on'); leader.classList.add('on');
    EC.emit('label', own);
  };

  /* item: optional item the tap was already resolved to by the interaction layer. */
  E.tap = function (x, y, item) {
    EC.setRay(x, y, ray);
    const hits = ray.intersectObjects(EC.scene.children, true);
    let own = null, point = null;
    for (let i = 0; i < hits.length; i++) {
      const o = hits[i].object;
      if (!o.visible || o.userData.noPick || !o.isMesh || o.material.visible === false) continue;
      const w = ownerOf(o);
      if (w) { own = w; point = hits[i].point; break; }
      if (o.material.transparent) continue;
      break;
    }
    if (item && (!own || own.item !== item)) {
      own = { item: item };
      point = item.obj.getWorldPosition(new T.Vector3());
      point.y += 0.8;
    }
    if (!own) { E.hide(); return; }
    const same = E.cur && ((own.part && E.cur.part === own.part) || (own.item && E.cur.item === own.item));
    if (same) { E.hide(); return; }
    E.show(own, point);
  };

  EC.initExplode = function () {
    label = document.getElementById('label');
    leader = document.getElementById('leader');
    EC.parts.forEach(function (p) { p.home = p.group.position.clone(); });
    EC.on('grab', function (item) { if (E.cur && E.cur.item === item) E.hide(); item.exPrev = 0; item.ex = 0; item.exT = 0; });
    EC.on('mode', function () { E.hide(); });

    EC.updaters.push(function (dt) {
      // part offsets
      const parts = EC.parts;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p.target === 0 && p.s.x === 0 && p.s.v === 0) continue;
        U.spring(p.s, p.target, 15, dt);
        if (p.target === 0 && Math.abs(p.s.x) < 0.0005 && Math.abs(p.s.v) < 0.001) { p.s.x = 0; p.s.v = 0; }
        p.group.position.copy(p.home).addScaledVector(p.dir, p.s.x);
        EC.touchShadow();
      }
      // loose items lift a little
      const items = EC.items.all;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (!it.exT && !it.ex) continue;
        const prev = it.ex || 0;
        it.ex = U.damp(prev, (it.exT || 0) * (it.lift || 1.2), 12, dt);
        if (!it.exT && it.ex < 0.002) it.ex = 0;
        const rewritten = it.where === 'mold' || it.where === 'forceps';
        if (rewritten) it.obj.position.y += it.ex;
        else if (!it.held && !it.falling) it.obj.position.y += it.ex - (it.exPrev || 0);
        it.exPrev = rewritten ? 0 : it.ex;
        EC.touchShadow();
      }
      if (!E.cur) return;
      E.t += dt;
      if (E.t > 4.2) { E.hide(); return; }
      // label follows the tapped spot
      anchor.copy(E.rel);
      E.obj.localToWorld(anchor);
      if (!EC.toScreen(anchor, scr)) { E.hide(); return; }
      const w = window.innerWidth, h = window.innerHeight;
      const lw = label.offsetWidth, lh = label.offsetHeight;
      const side = scr.x > w * 0.62 ? -1 : 1;
      let tx = scr.x + side * 46 - (side < 0 ? lw : 0), ty = scr.y - 54;
      tx = U.clamp(tx, 8, w - lw - 8); ty = U.clamp(ty, 8, h - lh - 8);
      if (!shown) { lx = tx; ly = ty; } else { lx = U.damp(lx, tx, 18, dt); ly = U.damp(ly, ty, 18, dt); }
      label.style.transform = 'translate3d(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px,0)';
      const ex = side > 0 ? lx : lx + lw, ey = ly + lh / 2;
      const dx = ex - scr.x, dy = ey - scr.y;
      leader.style.width = Math.hypot(dx, dy).toFixed(1) + 'px';
      leader.style.transform = 'translate3d(' + scr.x.toFixed(1) + 'px,' + scr.y.toFixed(1) + 'px,0) rotate(' + Math.atan2(dy, dx).toFixed(4) + 'rad)';
    });
  };
})();
