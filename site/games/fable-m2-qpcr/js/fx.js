// 演出レイヤ: ウェルの発光、励起ビーム、陽炎マスク、湯気、ヒントリング、透視（ゴースト）外装。
// どれも機構の状態 S から決まる。体験モード係数 k（QP.view.k）で強さを変える。
(function () {
  'use strict';
  const { clamp, smooth, rng } = QP.util;
  const D = QP.D;
  const V = QP.view;
  const FX = (QP.fx = {});

  const TAIL = '\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n';

  // ---- インスタンス化したビルボード（加算 or アルファ） ----------------------
  class Billboards {
    constructor(n, additive, depthTest) {
      const base = new THREE.PlaneGeometry(1, 1);
      const geo = new THREE.InstancedBufferGeometry();
      geo.index = base.index;
      geo.setAttribute('position', base.attributes.position);
      geo.setAttribute('uv', base.attributes.uv);
      this.off = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3);
      this.col = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3);
      this.par = new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2); // 大きさ, 不透明度
      for (const a of [this.off, this.col, this.par]) a.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aOff', this.off);
      geo.setAttribute('aCol', this.col);
      geo.setAttribute('aPar', this.par);
      geo.instanceCount = n;
      const mat = new THREE.ShaderMaterial({
        uniforms: { uGain: { value: 1 } },
        vertexShader: `
          attribute vec3 aOff; attribute vec3 aCol; attribute vec2 aPar;
          varying vec2 vUv; varying vec3 vCol; varying float vA;
          void main() {
            vec4 mv = modelViewMatrix * vec4(aOff, 1.0);
            mv.xy += position.xy * aPar.x;
            gl_Position = projectionMatrix * mv;
            vUv = uv; vCol = aCol; vA = aPar.y;
          }`,
        fragmentShader: `
          uniform float uGain; varying vec2 vUv; varying vec3 vCol; varying float vA;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float f = smoothstep(1.0, 0.0, d);
            f *= f;
            ${additive ? 'gl_FragColor = vec4(vCol * f * uGain * vA, 1.0);' : 'gl_FragColor = vec4(vCol, f * vA * uGain);'}
            ${TAIL}
          }`,
        transparent: true,
        depthWrite: false,
        depthTest,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: additive ? THREE.OneFactor : THREE.SrcAlphaFactor,
        blendDst: additive ? THREE.OneFactor : THREE.OneMinusSrcAlphaFactor,
        // アルファは書き換えない（アルファ = 陽炎マスクに使うため）
        blendSrcAlpha: THREE.ZeroFactor,
        blendDstAlpha: THREE.OneFactor,
      });
      this.mesh = new THREE.Mesh(geo, mat);
      this.mesh.frustumCulled = false;
      this.n = n;
    }
    set(i, x, y, z, r, g, b, size, alpha) {
      this.off.setXYZ(i, x, y, z);
      this.col.setXYZ(i, r, g, b);
      this.par.setXY(i, size, alpha);
    }
    commit() {
      this.off.needsUpdate = this.col.needsUpdate = this.par.needsUpdate = true;
    }
  }

  FX.build = function (scene) {
    const it = V.items;

    // ウェルの発光: 手前のものに隠れる層 + 透視する層（体験モード用）
    FX.glow = new Billboards(96, true, true);
    FX.glowX = new Billboards(96, true, false);
    FX.glow.mesh.renderOrder = 8;
    FX.glowX.mesh.renderOrder = 9;
    it.plate.add(FX.glow.mesh);
    it.plate.add(FX.glowX.mesh);

    // 励起ビーム（対物レンズ → ウェル）
    const h = D.yObj - (D.yBlockTop + 0.1);
    FX.beamMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color() }, uGain: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV; varying float vH;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalMatrix * normal; vV = -mv.xyz; vH = uv.y;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uGain; varying vec3 vN; varying vec3 vV; varying float vH;
        void main() {
          float f = abs(dot(normalize(vN), normalize(vV)));
          float a = pow(f, 1.4) * (0.55 + 0.45 * vH);
          gl_FragColor = vec4(uColor * a * uGain, 1.0);
          ${TAIL}
        }`,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    });
    FX.beam = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.16, h, 16, 1, true), FX.beamMat);
    FX.beam.position.y = D.yObj - h / 2;
    FX.beam.renderOrder = 7;
    FX.beam.visible = false;
    V.optics.head.add(FX.beam);
    // レンズ先端とウェル面の光点
    FX.spots = new Billboards(3, true, true);
    FX.spots.mesh.renderOrder = 7;
    V.optics.head.add(FX.spots.mesh);

    // 陽炎マスク: 描いた場所のアルファだけを下げる。合成パスがそこを揺らす（post.js）
    const shimmerMat = () => new THREE.SpriteMaterial({
      map: QP.tex.softDot, opacity: 0, transparent: true, depthWrite: false,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
      blendSrc: THREE.ZeroFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    FX.shimmer = [
      { s: new THREE.Sprite(shimmerMat()), at: [0, 23.5, D.cz], size: [22, 15] }, // ブロック / リッド上
      { s: new THREE.Sprite(shimmerMat()), at: [21.5, 15.5, D.cz], size: [11, 20] }, // 排気口
      { s: new THREE.Sprite(shimmerMat()), at: [0, 20, D.cz], size: [17, 12] }, // 開いたドロワー上のブロック
    ];
    for (const sh of FX.shimmer) {
      sh.s.position.set(sh.at[0], sh.at[1], sh.at[2]);
      sh.s.scale.set(sh.size[0], sh.size[1], 1);
      sh.s.renderOrder = 999;
      sh.s.visible = false;
      scene.add(sh.s);
    }

    // 湯気（未シールのとき）
    FX.steam = new Billboards(56, false, true);
    FX.steam.mesh.renderOrder = 20;
    scene.add(FX.steam.mesh);
    FX.steamP = [];
    for (let i = 0; i < 56; i++) FX.steamP.push({ life: 0, max: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s: 1 });
    FX.steamAcc = 0;

    // 冷却風の流れ（左の吸気口 → ヒートシンク → ファン → 右の排気口）。体験モードで風量と温度を見せる
    FX.air = new Billboards(90, true, true); // 1 粒につき 3 個並べて尾を引かせる
    FX.air.mesh.renderOrder = 6;
    scene.add(FX.air.mesh);
    FX.airP = [];
    const ar = rng(9);
    for (let i = 0; i < 30; i++) FX.airP.push({ x: -22 + ar() * 46, y: 7.3 + ar() * 4.4, z: D.cz - 4.6 + ar() * 9.2, v: 0.75 + ar() * 0.5, s: 0.5 + ar() * 0.6 });

    // ヒントリング（次に触れるものをそっと示す）
    const rc = document.createElement('canvas');
    rc.width = rc.height = 128;
    const g = rc.getContext('2d');
    g.strokeStyle = '#fff';
    g.lineWidth = 7;
    g.beginPath();
    g.arc(64, 64, 52, 0, Math.PI * 2);
    g.stroke();
    FX.hintMat = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(rc), transparent: true, depthTest: false, depthWrite: false, opacity: 0,
      blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    });
    FX.hint = new THREE.Sprite(FX.hintMat);
    FX.hint.renderOrder = 50;
    scene.add(FX.hint);
    FX.hintPos = new THREE.Vector3();
    FX.hintShown = 0;

    buildGhost();
  };

  // ---- 透視外装: 体験モードではカバーをガラスのように透かして中の機構を見せる ----
  function buildGhost() {
    FX.ghostMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 }, uColor: { value: new THREE.Color(0.62, 0.78, 1.0) } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalMatrix * normal; vV = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uOpacity; uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
        void main() {
          float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
          float a = uOpacity * (0.016 + 0.3 * pow(f, 2.6));
          gl_FragColor = vec4(uColor * 1.4, a);
          ${TAIL}
        }`,
      transparent: true, depthWrite: false, side: THREE.FrontSide,
      blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    });
    FX.edgeMat = QP.mat.ghostLine;
    FX.solid = []; // 実体メッシュ（実機表示）
    FX.ghost = [V.housing.ghostLines, V.thermal.fasciaLines]; // 透視メッシュと輪郭線
    const targets = V.housing.shell.concat(V.thermal.fasciaMeshes);
    for (const mesh of targets) {
      FX.solid.push(mesh);
      mesh.userData.shell = true; // 体験モードではクリックが素通りする（interact.js）
      if (mesh.material === QP.mat.inner) continue; // 内張りは透視側を作らない
      const gm = new THREE.Mesh(mesh.geometry, FX.ghostMat);
      gm.renderOrder = 30;
      gm.visible = false;
      gm.userData.ghost = true;
      mesh.parent.add(gm);
      FX.ghost.push(gm);
    }
    FX.ghostState = -1;
  }

  function applyGhost(k) {
    // k: 0 = 塗装カバー, 1 = 透視。途中は両方を重ねてクロスフェードする
    const state = k <= 0.001 ? 0 : k >= 0.999 ? 2 : 1;
    if (state !== FX.ghostState) {
      FX.ghostState = state;
      for (const m of FX.solid) {
        m.visible = state !== 2;
        m.castShadow = state === 0 && m.material !== QP.mat.inner;
      }
      for (const m of FX.ghost) m.visible = state !== 0;
      const fading = state === 1;
      for (const mat of [QP.mat.paint, QP.mat.paintDark, QP.mat.inner]) {
        if (mat.transparent !== fading) {
          mat.transparent = fading;
          mat.needsUpdate = true;
        }
      }
      FX.shadowDirty = true;
    }
    const o = 1 - smooth(k * 1.6);
    QP.mat.paint.opacity = QP.mat.paintDark.opacity = QP.mat.inner.opacity = state === 1 ? o : 1;
    FX.ghostMat.uniforms.uOpacity.value = smooth((k - 0.25) / 0.75);
    FX.edgeMat.opacity = 0.3 * smooth((k - 0.4) / 0.6);
  }

  // 次に触れるとよさそうなもの（強制はしない）
  function pickHint(S) {
    if (S.run.active || S.plate.t < 1 || S.film.t < 1 || S.drawer.moving) return null;
    const open = S.drawer.pos > 0.98;
    const inside = S.plate.pose !== 'bench';
    if (S.plate.pose === 'skew' && open) return 'plate';
    if (!open) {
      if (!inside) return 'eject';
      return S.run.done ? 'eject' : 'start';
    }
    if (!inside) return 'plate';
    if (!S.film.on) return 'film';
    return 'start';
  }

  const _v = new THREE.Vector3();
  const steamRng = rng(5);

  function emitSteam(x, y, z, n, spread, up) {
    let made = 0;
    for (const p of FX.steamP) {
      if (p.life > 0) continue;
      p.max = p.life = 1.3 + steamRng() * 1.3;
      p.x = x + (steamRng() - 0.5) * spread[0];
      p.y = y;
      p.z = z + (steamRng() - 0.5) * spread[1];
      p.vx = (steamRng() - 0.5) * 1.6;
      p.vz = (steamRng() - 0.5) * 1.6;
      p.vy = up * (0.7 + steamRng() * 0.7);
      p.s = 1.4 + steamRng() * 1.6;
      if (++made >= n) break;
    }
  }
  FX.emitSteam = emitSteam;

  FX.update = function (dt, camera) {
    const S = QP.machine.S;
    const k = V.k;
    const T = S.temp;

    applyGhost(k);

    // ---- ウェルの色と発光 ---------------------------------------------------
    const liquid = V.items.liquid;
    const arr = liquid.instanceColor.array;
    const gainNear = 1.15 + 0.9 * k;
    const xray = k * 0.42;
    for (const w of QP.build.wells) {
      const ws = S.wells[w.i];
      const em = V.em[ws.dye];
      // 残光: 測定直後に明るく、そのあと落ち着く（体験モードでは長く残す）
      const lum = ws.lum * (0.42 + 0.26 * k + 0.5 * ws.flash);
      const body = 0.1 + 0.05 * k;
      const j = w.i * 3;
      arr[j] = em.r * (body + lum * 3.2);
      arr[j + 1] = em.g * (body + lum * 3.2);
      arr[j + 2] = em.b * (body + lum * 3.2);
      // 透視層はリッドの穴の出口の高さに置く（斜めから見ても穴と位置が合う）
      const yy = D.plateH + 0.05 + S.lid.pos * (D.lidT + 0.14);
      const size = 0.75 + lum * 1.5;
      FX.glow.set(w.i, w.x, D.plateH + 0.05, w.z, em.r, em.g, em.b, size, lum * gainNear);
      FX.glowX.set(w.i, w.x, yy, w.z, em.r, em.g, em.b, 0.6 + lum * 0.85, lum * xray * 1.3);
    }
    liquid.instanceColor.needsUpdate = true;
    FX.glow.commit();
    FX.glowX.commit();
    FX.glowX.mesh.visible = xray > 0.01;

    // ---- 励起ビーム ---------------------------------------------------------
    const ch = S.wheel.moving ? 0 : S.wheel.index;
    const on = S.led.level > 0.03 && ch > 0;
    FX.beam.visible = on;
    FX.spots.mesh.visible = on;
    if (on) {
      const ex = V.ex[ch];
      FX.beamMat.uniforms.uColor.value.copy(ex);
      FX.beamMat.uniforms.uGain.value = S.led.level * (0.5 + 1.5 * k);
      const hit = S.run.well >= 0 ? S.wells[S.run.well] : null;
      const f = hit ? hit.flash : 0;
      const em = hit && hit.dye === ch ? V.em[hit.dye] : ex;
      FX.spots.set(0, 0, D.yObj - 0.05, 0, ex.r, ex.g, ex.b, 2.2, S.led.level * (1.2 + k));
      FX.spots.set(1, 0, D.yLidDown + D.lidT + 0.1, 0, ex.r, ex.g, ex.b, 1.8, S.led.level * (0.8 + k));
      FX.spots.set(2, 0, D.yObj + 0.4, 0, em.r, em.g, em.b, 2.6, f * (0.5 + 1.2 * k));
      FX.spots.commit();
    }

    // ---- 陽炎 ---------------------------------------------------------------
    const hotBlock = smooth((T.block - 52) / 40);
    const inside = S.drawer.pos < 0.5;
    const sh = FX.shimmer;
    sh[0].s.material.opacity = inside ? hotBlock * k * 0.95 : 0;
    sh[1].s.material.opacity = smooth((T.sink - 28) / 10) * clamp(S.fan.rpm * 1.3, 0, 1) * (0.5 + 0.5 * k);
    sh[2].s.material.opacity = inside ? 0 : hotBlock * (0.4 + 0.6 * k);
    sh[2].s.position.z = D.cz + S.drawer.pos * D.travel;
    FX.shimmerOn = false;
    for (const x of sh) {
      x.s.visible = FX.shimmerEnabled && x.s.material.opacity > 0.02;
      if (x.s.visible) FX.shimmerOn = true;
    }

    // ---- 冷却風 -------------------------------------------------------------
    const wind = S.fan.rpm * k;
    FX.air.mesh.visible = wind > 0.03;
    if (FX.air.mesh.visible) {
      const warm = smooth((T.sink - 27) / 14);
      for (let i = 0; i < FX.airP.length; i++) {
        const p = FX.airP[i];
        p.x += S.fan.rpm * 52 * p.v * dt;
        if (p.x > 25) p.x -= 47;
        // ヒートシンクを抜けたあとだけ暖色になる（熱を運び出している）
        const heated = p.x > -6 ? warm * smooth((p.x + 6) / 10) : 0;
        const fade = smooth((p.x + 22) / 4) * (1 - smooth((p.x - 19) / 6));
        for (let j = 0; j < 3; j++) {
          FX.air.set(i * 3 + j, p.x - j * 0.85, p.y, p.z, 0.35 + 0.65 * heated, 0.6 - 0.25 * heated, 1.0 - 0.9 * heated,
            p.s * (1.5 - j * 0.3), wind * fade * (0.9 - j * 0.28));
        }
      }
      FX.air.commit();
    }

    // ---- 湯気 ---------------------------------------------------------------
    const plateIn = S.plate.pose !== 'bench';
    const steaming = plateIn && !S.film.on && T.block > 72;
    if (steaming) {
      FX.steamAcc += dt * ((T.block - 72) / 23) * 20;
      const pz = D.cz + S.drawer.pos * D.travel;
      while (FX.steamAcc >= 1) {
        FX.steamAcc -= 1;
        // リッドが降りていれば穴と縁から、上がっていれば面全体から立ちのぼる
        const down = S.lid.pos > 0.8;
        if (down && steamRng() < 0.35) emitSteam((steamRng() < 0.5 ? -1 : 1) * 7.3, D.yLidDown + 0.4, pz, 1, [0.6, 9.5], 4);
        else emitSteam(0, down ? D.yLidDown + D.lidT + 0.2 : D.yBlockTop + 0.6, pz, 1, [11, 7.5], 6);
      }
    }
    let live = 0;
    for (let i = 0; i < FX.steamP.length; i++) {
      const p = FX.steamP[i];
      if (p.life > 0) {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy *= 1 - 0.25 * dt;
        const a = p.life / p.max;
        const grow = p.s * (1 + (1 - a) * 2.4);
        FX.steam.set(i, p.x, p.y, p.z, 0.8, 0.86, 0.92, grow, Math.sin(Math.PI * clamp(a, 0, 1)) * 0.5);
        live++;
      } else {
        FX.steam.set(i, 0, -50, 0, 0, 0, 0, 0, 0);
      }
    }
    FX.steam.mesh.visible = live > 0;
    if (live > 0) FX.steam.commit();

    // ---- ヒント -------------------------------------------------------------
    const want = k > 0.5 ? pickHint(S) : null;
    V.hint = want;
    if (want) {
      if (want === 'eject') V.housing.button.getWorldPosition(_v);
      else if (want === 'plate') V.items.plate.getWorldPosition(_v).y += D.plateH;
      else if (want === 'film') V.items.film.getWorldPosition(_v);
      else {
        const uv = QP.screen.uvOf('start');
        const disp = V.housing.display;
        const gp = disp.geometry.parameters;
        _v.set((uv.u - 0.5) * gp.width, (uv.v - 0.5) * gp.height, 0.05);
        disp.localToWorld(_v);
      }
      FX.hintPos.copy(_v);
      FX.hintShown = Math.min(1, FX.hintShown + dt * 3);
    } else {
      FX.hintShown = Math.max(0, FX.hintShown - dt * 5);
    }
    FX.hint.visible = FX.hintShown > 0.01;
    if (FX.hint.visible) {
      const ph = (performance.now() / 1000) % 1.4 / 1.4;
      FX.hint.position.copy(FX.hintPos);
      // 画面上でほぼ一定の大きさに見えるよう距離で拡縮
      const dist = camera.position.distanceTo(FX.hintPos);
      const base = dist * 0.028 * (want === 'plate' || want === 'film' ? 1.5 : 1);
      const sc = base * (0.7 + ph * 1.3);
      FX.hint.scale.set(sc, sc, 1);
      FX.hintMat.opacity = FX.hintShown * (1 - ph) * 0.95;
    }
  };

  FX.shimmerEnabled = true;
  FX.shadowDirty = true;
})();
