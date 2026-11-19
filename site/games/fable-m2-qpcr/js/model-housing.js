// 外装（塗装カバー・通気口・タッチパネル・開閉ボタン）とベンチ。
// カバーは側面プロファイル (z,y) を X 方向へ押し出した薄肉シェル。中央の濃色バンドにドロワー開口がある。
(function () {
  'use strict';
  const B = QP.build;
  const D = QP.D;
  const M = QP.mat;
  QP.model = QP.model || {};

  // ---- 2D 作図ヘルパ ------------------------------------------------------
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const norm = (a) => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };
  const left = (d) => [-d[1], d[0]];

  function intersect(p1, d1, p2, d2) {
    const den = d1[0] * d2[1] - d1[1] * d2[0];
    const t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den;
    return [p1[0] + d1[0] * t, p1[1] + d1[1] * t];
  }

  // 折れ線を左側（反時計回り輪郭の内側）へ t だけずらす
  function offsetLine(pts, t, closed) {
    const n = pts.length;
    const out = [];
    for (let i = 0; i < n; i++) {
      const hasPrev = closed || i > 0;
      const hasNext = closed || i < n - 1;
      const p = pts[i];
      const dPrev = hasPrev ? norm(sub(p, pts[(i - 1 + n) % n])) : null;
      const dNext = hasNext ? norm(sub(pts[(i + 1) % n], p)) : null;
      if (dPrev && dNext) {
        const a = [p[0] + left(dPrev)[0] * t, p[1] + left(dPrev)[1] * t];
        const b = [p[0] + left(dNext)[0] * t, p[1] + left(dNext)[1] * t];
        out.push(intersect(a, dPrev, b, dNext));
      } else {
        const d = dPrev || dNext;
        out.push([p[0] + left(d)[0] * t, p[1] + left(d)[1] * t]);
      }
    }
    return out;
  }

  // 角を丸めながら折れ線を path に描く
  function trace(path, pts, r, closed, start) {
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const corner = closed || (i > 0 && i < n - 1);
      if (!corner) {
        if (i === 0 && start) path.moveTo(p[0], p[1]);
        else path.lineTo(p[0], p[1]);
        continue;
      }
      const d1 = norm(sub(pts[(i - 1 + n) % n], p));
      const d2 = norm(sub(pts[(i + 1) % n], p));
      const a = [p[0] + d1[0] * r, p[1] + d1[1] * r];
      const b = [p[0] + d2[0] * r, p[1] + d2[1] * r];
      if (i === 0 && start) path.moveTo(a[0], a[1]);
      else path.lineTo(a[0], a[1]);
      path.quadraticCurveTo(p[0], p[1], b[0], b[1]);
    }
    if (closed) path.closePath();
    return path;
  }

  // 厚み t の帯（開いた折れ線）/ 輪（閉じた輪郭）
  function stripShape(pts, t, r) {
    const s = new THREE.Shape();
    trace(s, pts, r, false, true);
    trace(s, offsetLine(pts, t, false).reverse(), Math.max(r - t, 0.05), false, false);
    s.closePath();
    return s;
  }
  function ringShape(pts, t, r) {
    const s = trace(new THREE.Shape(), pts, r, true, true);
    s.holes.push(trace(new THREE.Path(), offsetLine(pts, t, true), Math.max(r - t, 0.05), true, true));
    return s;
  }

  const PROFILE = [
    [D.zFront, D.yBase],
    [D.zFront, D.yKnee],
    [D.zSlantEnd, D.yTop],
    [D.zRear, D.yTop],
    [D.zRear, D.yBase],
  ];
  const R = 1.7; // 外装の角丸
  const SIDE_T = 0.6;

  // 傾斜面（タッチパネル取り付け面）の座標系
  const slant = (function () {
    const dz = D.zSlantEnd - D.zFront;
    const dy = D.yTop - D.yKnee;
    const len = Math.hypot(dz, dy);
    return {
      len,
      angle: -Math.atan2(-dz, dy), // rotation.x
      center: new THREE.Vector3(0, (D.yKnee + D.yTop) / 2, (D.zFront + D.zSlantEnd) / 2),
      normal: new THREE.Vector3(0, -dz / len, dy / len),
    };
  })();
  QP.slant = slant;

  QP.model.housing = function (root) {
    const out = { shell: [] };

    // ---- カバー（分解ラベル対象） -----------------------------------------
    const cover = B.part('cover', '外装カバー', [0, 1, 0], 7);
    root.add(cover);

    const white = new B.Batch();
    const dark = new B.Batch();
    const liner = new B.Batch();
    const x0 = D.openHX;
    const x1 = D.HX - SIDE_T;

    // 左右のリング状シェル
    const ring = ringShape(PROFILE, D.wall, R);
    white.add(M.paint, B.extrudeX(ring, x0, x1, { seg: 6 }));
    white.add(M.paint, B.extrudeX(ring, -x1, -x0, { seg: 6 }));
    const innerPts = offsetLine(PROFILE, D.wall + 0.03, true);
    const ringIn = ringShape(innerPts, 0.06, R - D.wall);
    liner.add(M.inner, B.extrudeX(ringIn, -x1, x1, { seg: 6 }));

    // 中央バンド: ドロワー開口の上（前面上部〜傾斜〜天面の一部）と下、残りは白
    const topEnd = D.zSlantEnd - 1.6;
    const upper = stripShape([[D.zFront, D.openY1], PROFILE[1], PROFILE[2], [topEnd, D.yTop]], D.wall, R);
    const lower = stripShape([[D.zFront - 2.4, D.yBase], PROFILE[0], [D.zFront, D.openY0]], D.wall, R);
    const rest = stripShape([[topEnd, D.yTop], PROFILE[3], PROFILE[4], [D.zFront - 2.4, D.yBase]], D.wall, R);
    dark.add(M.paintDark, B.extrudeX(upper, -x0, x0, { seg: 6 }));
    dark.add(M.paintDark, B.extrudeX(lower, -x0, x0, { seg: 6 }));
    white.add(M.paint, B.extrudeX(rest, -x0, x0, { seg: 6 }));

    // 側板（通気口つき）。右は冷却ファンの丸穴グリル、左は吸気スリット。
    function sidePanel(rightSide) {
      const s = trace(new THREE.Shape(), PROFILE, R, true, true);
      if (rightSide) {
        const cy = 9.5;
        const pitch = 1.02;
        for (let j = -5; j <= 5; j++) {
          for (let i = -5; i <= 5; i++) {
            const u = D.cz + (i + (j & 1 ? 0.5 : 0)) * pitch;
            const v = cy + j * pitch * 0.866;
            if (Math.hypot(u - D.cz, v - cy) < 4.25) s.holes.push(B.circleHole(u, v, 0.37));
          }
        }
      } else {
        for (let k = 0; k < 7; k++) s.holes.push(B.slotHole(D.cz, 5.6 + k * 1.25, 10.5, 0.52));
      }
      for (let k = 0; k < 6; k++) s.holes.push(B.slotHole(-11.5, 26.5 + k * 1.3, 13, 0.5));
      return s;
    }
    // 側板は「面取りした外枠」＋「穴あきの平板」。小穴まで面取りすると三角形が潰れるため分ける。
    const FRAME = 1.2;
    const frameShape = ringShape(PROFILE, FRAME, R);
    const panelPts = offsetLine(PROFILE, FRAME - 0.2, true);
    function addSide(rightSide) {
      const xa = rightSide ? x1 + 0.22 : -D.HX + 0.22;
      const xb = rightSide ? D.HX - 0.22 : -x1 - 0.22;
      const geo = new THREE.ExtrudeGeometry(frameShape, {
        depth: xb - xa, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.22,
        bevelOffset: -0.22, bevelSegments: 2,
      }).rotateY(-Math.PI / 2).translate(xb, 0, 0);
      white.add(M.paint, geo);
      const holes = sidePanel(rightSide).holes;
      const flat = trace(new THREE.Shape(), panelPts, R - FRAME + 0.2, true, true);
      flat.holes = holes;
      white.add(M.paint, B.extrudeX(flat, rightSide ? x1 : -D.HX + 0.06, rightSide ? D.HX - 0.06 : -x1, { seg: 6 }));
      // 裏当て（暗色）: 穴は同じ位置
      const back = trace(new THREE.Shape(), PROFILE, R, true, true);
      back.holes = holes;
      liner.add(M.inner, B.extrudeX(back, rightSide ? x1 - 0.08 : -x1 + 0.02, rightSide ? x1 - 0.02 : -x1 + 0.08, { seg: 6 }));
    }
    addSide(true);
    addSide(false);

    // 背面の小物: 電源インレット、スイッチ、通信ポート、背面スリット
    const zr = D.zRear;
    dark.add(M.plastic, B.rbox(5.2, 3.2, 0.5, 0.25), -11, 6, zr - 0.2);
    dark.add(M.plastic, B.box(2.6, 1.9, 0.5), -11.6, 6, zr - 0.3);
    dark.add(M.plastic, B.rbox(1.5, 2.2, 0.6, 0.2), -5.5, 6, zr - 0.25);
    dark.add(M.plastic, B.rbox(1.6, 1.5, 0.4, 0.1), 8, 5.6, zr - 0.15);
    dark.add(M.plastic, B.rbox(1.5, 0.7, 0.4, 0.1), 11, 5.4, zr - 0.15);
    for (let k = 0; k < 8; k++) dark.add(M.plastic, B.rbox(14, 0.45, 0.3, 0.12), 6, 24 + k * 1.3, zr - 0.08);
    white.add(M.alu, B.rbox(6, 3, 0.1, 0.04), 9, 12, zr - 0.05); // 無記名の銘板

    white.into(cover);
    dark.into(cover);
    liner.into(cover, { cast: false });
    cover.children.forEach((m) => out.shell.push(m));

    // 透視表示用の輪郭線（体験モード）。メッシュの稜線抽出ではなく、元の輪郭から直接つくる。
    const seg = [];
    const loop = (pts, x) => {
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        seg.push(x, a.y, a.x, x, b.y, b.x);
      }
    };
    const outline = trace(new THREE.Shape(), PROFILE, R, true, true).getPoints(6);
    for (const x of [-D.HX, -x0, x0, D.HX]) loop(outline, x);
    for (const right of [true, false]) {
      for (const h of sidePanel(right).holes) loop(h.getPoints(right ? 4 : 5), right ? D.HX : -D.HX);
    }
    for (const y of [D.openY0, D.openY1]) seg.push(-x0, y, D.zFront, x0, y, D.zFront);
    out.ghostLines = new THREE.LineSegments(new THREE.BufferGeometry(), QP.mat.ghostLine);
    out.ghostLines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    out.ghostLines.visible = false;
    out.ghostLines.renderOrder = 31;
    cover.add(out.ghostLines);

    // ---- ゴム足 ------------------------------------------------------------
    const feet = new B.Batch();
    for (const sx of [-1, 1]) {
      for (const z of [D.zFront - 4.5, D.zRear + 4.5]) feet.add(M.rubber, B.cyl(1.7, D.yBase, 20), sx * 13.5, D.yBase / 2, z);
    }
    feet.into(root);

    // ---- タッチパネル ------------------------------------------------------
    const mount = new THREE.Group();
    mount.position.copy(slant.center);
    mount.rotation.x = slant.angle;
    cover.add(mount); // カバーに付いているので、カバーの分解に追従する
    const screen = B.part('screen', 'タッチパネル', [0, 0, 1], 2.2);
    mount.add(screen);
    const glassW = 19.2;
    const glassH = 14.4;
    const glass = new THREE.Mesh(B.extrudeZ(B.rrShape(glassW, glassH, 0.9), 0.26, { seg: 6, bevel: 0.05, bevelSeg: 1 }), M.glassBlack);
    M.glassBlack.transparent = true;
    glass.position.z = 0.04;
    glass.castShadow = false;
    glass.receiveShadow = true;
    glass.renderOrder = 40; // 透視発光（深度無視）より後に描いて、画面の上に光が乗らないようにする
    screen.add(glass);

    // 表示面（キャンバスを発光テクスチャとして貼る。艶はカバーガラスと同じ）
    const dispW = 17.4;
    const dispH = 10.875;
    out.displayMat = new THREE.MeshPhysicalMaterial({
      color: 0x030303, roughness: 0.07, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03,
      emissive: 0xffffff, emissiveIntensity: 1.15, transparent: true,
    });
    const display = new THREE.Mesh(new THREE.PlaneGeometry(dispW, dispH), out.displayMat);
    display.position.set(0, 0.35, 0.37);
    display.name = 'display';
    display.renderOrder = 41;
    screen.add(display);
    out.display = display;
    out.screen = screen;

    // ---- 開閉ボタン（前面右上、照光リング） --------------------------------
    const btn = B.part('eject', '開閉ボタン', [0, 0, 1], 0.8);
    btn.position.set(7.0, 20.55, D.zFront);
    cover.add(btn);
    const bb = new B.Batch();
    bb.add(M.plastic, B.cyl(1.32, 0.3, 28), 0, 0, 0.12, Math.PI / 2);
    bb.add(M.aluBlack, B.cyl(0.95, 0.3, 28), 0, 0, 0.3, Math.PI / 2);
    bb.into(btn, { cast: false });
    out.buttonCap = btn.children[1];
    out.ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.09, 8, 36), out.ringMat);
    ringMesh.position.z = 0.3;
    btn.add(ringMesh);
    out.button = btn;

    return out;
  };

  // ---- ベンチ（明るいラミネート天板） ----------------------------------------
  QP.model.bench = function (scene) {
    const g = new THREE.Group();
    const top = new THREE.Mesh(B.rbox(150, 4, 112, 0.6, 3), M.bench);
    top.position.set(0, -2, 10);
    top.receiveShadow = true;
    g.add(top);

    // 接地感を出すぼかし影（本体の真下）
    const blob = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: QP.tex.softDot, color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.scale.set(64, 76, 1);
    blob.position.set(0, 0.02, -1);
    blob.renderOrder = 1;
    g.add(blob);
    scene.add(g);
    return { group: g, blob };
  };
})();
