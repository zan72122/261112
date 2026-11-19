// 触って操作する層。タップで「操作できる物は操作、それ以外のパーツは少し分解して日本語ラベル」。
// ・プレート / フィルム / 開閉ボタン / タッチパネルのボタン → 装置を操作
// ・その他のパーツ → 分解方向へ少しずれて名前を表示
// ・ダブルタップ → そのパーツへ寄る（何もない所なら全体表示へ戻る）
(function () {
  'use strict';
  const { damp } = QP.util;
  const V = QP.view;
  const X = (QP.interact = { animating: false, autoZoom: false });

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const _v = new THREE.Vector3();
  const _b = new THREE.Box3();
  const _s = new THREE.Sphere();
  let canvas, camera, labelEl, labelText;
  let pick = [];
  let active = null; // 分解中のパーツ
  let label = null; // { group, local, t }
  let lastTap = { t: -1, x: 0, y: 0 };

  function visible(o) {
    for (; o; o = o.parent) if (!o.visible) return false;
    return true;
  }
  function partOf(o) {
    for (; o; o = o.parent) if (o.userData && o.userData.part) return o;
    return null;
  }

  function collect() {
    pick = [];
    const add = (root) => root.traverse((o) => {
      if (!o.isMesh || o.userData.ghost) return;
      if (o.material && o.material.isShaderMaterial) return;
      pick.push(o);
    });
    add(V.root);
    add(V.items.plate);
    add(V.items.film);
    V.items.liner.userData.liner = true;
    pick.push(V.items.liner);
  }

  function screenPos(world, out) {
    _v.copy(world).project(camera);
    out.x = (_v.x * 0.5 + 0.5) * window.innerWidth;
    out.y = (-_v.y * 0.5 + 0.5) * window.innerHeight;
    out.z = _v.z;
    return out;
  }

  function raycast(x, y) {
    ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(pick, false);
    // 体験モードでは透かした外装の向こうにある部品を優先する（何もなければ外装そのもの）
    const through = V.k > 0.5;
    let shell = null;
    for (const h of hits) {
      if (h.object.userData.shell && through) {
        if (!shell) shell = h;
        continue;
      }
      if (visible(h.object)) return h;
    }
    return shell;
  }

  // 小さな操作対象（開閉ボタン・プレート・フィルム）は指でも押しやすいよう近傍判定を足す
  const _sp = { x: 0, y: 0, z: 0 };
  function nearHotspot(x, y, radius) {
    let best = null;
    let bd = radius;
    const test = (id, obj, facing) => {
      obj.getWorldPosition(_v);
      if (facing && camera.position.z - _v.z < 4) return; // 裏側からは押せない
      screenPos(_v, _sp);
      if (_sp.z > 1) return;
      const d = Math.hypot(_sp.x - x, _sp.y - y);
      if (d < bd) {
        bd = d;
        best = id;
      }
    };
    test('eject', V.housing.button, true);
    return best;
  }

  function showLabel(group, worldPoint, text) {
    label = { group, local: group.worldToLocal(worldPoint.clone()), t: 0 };
    labelText.textContent = text;
    labelEl.classList.add('show');
  }
  function hideLabel() {
    label = null;
    labelEl.classList.remove('show');
  }

  function explode(group, point) {
    const p = group.userData.part;
    if (active && active !== group) setTarget(active, 0);
    const opening = !(active === group && p.target > 0.5);
    setTarget(group, opening ? 1 : 0);
    active = opening ? group : null;
    if (opening) {
      showLabel(group, point, p.label);
      QP.bus.emit('part:pop');
    } else {
      hideLabel();
      QP.bus.emit('part:back');
    }
  }
  function setTarget(group, t) {
    const p = group.userData.part;
    p.target = t;
    if (p.also) for (const a of p.also) QP.build.parts[a.id].userData.part.target2 = t * a.k;
  }

  function operate(id, group, point) {
    if (active) {
      setTarget(active, 0);
      active = null;
    }
    QP.machine.press(id);
    if (group && point) showLabel(group, point, group.userData.part.label);
  }

  function tap(x, y, pointerType) {
    const now = performance.now();
    const dbl = now - lastTap.t < 330 && Math.hypot(x - lastTap.x, y - lastTap.y) < 28;
    lastTap = { t: dbl ? -1 : now, x, y };
    const hit = raycast(x, y);
    if (dbl) return void focus(hit);

    const hot = nearHotspot(x, y, 26);
    if (!hit) {
      if (hot) return operate(hot, V.housing.button, V.housing.button.getWorldPosition(new THREE.Vector3()));
      if (active) {
        setTarget(active, 0);
        active = null;
        QP.bus.emit('part:back');
      }
      hideLabel();
      return;
    }
    // タッチパネル: ボタンに当たれば操作、当たらなければパーツとして扱う
    if (hit.object === V.housing.display && hit.uv) {
      // 画面が小さく見えているときは、まず正面へ寄る（指で押せる大きさにする）
      if (QP.screenPixels() < (pointerType === 'mouse' ? 120 : 250)) {
        QP.faceScreen();
        X.autoZoom = true;
        QP.bus.emit('part:pop');
        hideLabel();
        return;
      }
      const before = QP.machine.S.run.active;
      if (QP.screen.tap(hit.uv.x, hit.uv.y)) {
        hideLabel();
        // 寄った状態で ▶ を押したら、機構が見える位置へ戻って運転を見せる
        if (X.autoZoom && !before && QP.machine.S.run.active) {
          X.autoZoom = false;
          setTimeout(() => QP.goHome(false), 380);
        }
        return;
      }
    }
    if (hit.object.userData.liner) return operate('film', V.items.film, hit.point);
    const group = partOf(hit.object);
    if (!group) return;
    const id = group.userData.part.id;
    if (id === 'eject' || (hot === 'eject' && (id === 'cover' || id === 'fascia'))) return operate('eject', V.housing.button, hit.point);
    if (id === 'plate') return operate('plate', group, hit.point);
    if (id === 'film') {
      // 貼ってあるフィルムへのタップはプレート操作として扱う（剥がすときは剥離紙をタップ）
      if (QP.machine.S.film.on) return operate('plate', V.items.plate, hit.point);
      return operate('film', group, hit.point);
    }
    explode(group, hit.point);
  }

  function focus(hit) {
    if (!hit) return QP.goHome(false);
    const group = partOf(hit.object);
    if (!group) return QP.goHome(false);
    _b.setFromObject(group);
    _b.getBoundingSphere(_s);
    QP.focusOn(_s.center.clone(), Math.max(_s.radius, 5));
  }

  X.init = function (cv, cam) {
    canvas = cv;
    camera = cam;
    labelEl = document.getElementById('label');
    labelText = labelEl.querySelector('b');
    collect();

    let down = null;
    canvas.addEventListener('pointerdown', (e) => {
      down = e.isPrimary ? { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, multi: false } : null;
      if (!e.isPrimary && down) down.multi = true;
    });
    window.addEventListener('pointerdown', (e) => {
      if (!e.isPrimary && down) down.multi = true;
    }, true);
    canvas.addEventListener('pointerup', (e) => {
      if (!down || e.pointerId !== down.id) return;
      const d = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const quick = performance.now() - down.t < 450;
      const ok = !down.multi && quick && d < (e.pointerType === 'mouse' ? 5 : 11);
      down = null;
      if (ok) tap(e.clientX, e.clientY, e.pointerType);
    });
    canvas.addEventListener('pointercancel', () => { down = null; });

    // マウスのときだけ: 操作できる物の上で指カーソルにする（負荷を抑えるため間引く）
    let hoverAt = 0;
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || e.buttons) return;
      const now = performance.now();
      if (now - hoverAt < 90) return;
      hoverAt = now;
      const hit = raycast(e.clientX, e.clientY);
      let hand = false;
      if (hit) {
        const g = partOf(hit.object);
        const id = g && g.userData.part.id;
        hand = id === 'plate' || id === 'film' || id === 'eject' || hit.object.userData.liner || hit.object === V.housing.display;
      }
      canvas.style.cursor = hand ? 'pointer' : 'grab';
    });
  };

  X.clear = function () {
    if (active) setTarget(active, 0);
    active = null;
    hideLabel();
  };

  const _w = new THREE.Vector3();
  X.update = function (dt) {
    let moving = false;
    for (const id in QP.build.parts) {
      const g = QP.build.parts[id];
      const p = g.userData.part;
      const want = Math.max(p.target, p.target2 || 0);
      if (Math.abs(p.cur - want) > 0.0015) {
        p.cur = damp(p.cur, want, 11, dt);
        moving = true;
      } else if (p.cur !== want) {
        p.cur = want;
        moving = true;
      } else continue;
      g.position.copy(p.base).addScaledVector(p.dir, p.dist * p.cur);
    }
    X.animating = moving;

    if (label) {
      label.t += dt;
      label.group.updateWorldMatrix(true, false);
      _w.copy(label.local).applyMatrix4(label.group.matrixWorld);
      screenPos(_w, _sp);
      const w = window.innerWidth;
      const left = _sp.x > w - 170;
      labelEl.classList.toggle('left', left);
      labelEl.style.transform = `translate3d(${_sp.x.toFixed(1)}px,${Math.max(_sp.y, 70).toFixed(1)}px,0)`;
      if (label.t > 3.6) {
        if (active) {
          setTarget(active, 0);
          active = null;
          QP.bus.emit('part:back');
        }
        hideLabel();
      }
    }
  };
})();
