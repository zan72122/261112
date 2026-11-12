/* Procedural textures, PBR materials and studio environment.
   Everything is generated at start-up from code: no image files, no network. */
(function () {
  'use strict';
  const MT = (window.MT = window.MT || {});
  const T = THREE;

  // ---- small utilities ---------------------------------------------------
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function mkCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  MT.rng = rng;
  MT.mkCanvas = mkCanvas;

  // Tileable value noise on a w*h grid (cells = lattice size), cosine interpolated.
  function valueNoise(w, h, cellsX, cellsY, seed) {
    const r = rng(seed);
    const g = new Float32Array(cellsX * cellsY);
    for (let i = 0; i < g.length; i++) g[i] = r();
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      const fy = (y / h) * cellsY, y0 = Math.floor(fy), ty = fy - y0;
      const sy = (1 - Math.cos(ty * Math.PI)) * 0.5;
      const ya = (y0 % cellsY) * cellsX, yb = ((y0 + 1) % cellsY) * cellsX;
      for (let x = 0; x < w; x++) {
        const fx = (x / w) * cellsX, x0 = Math.floor(fx), tx = fx - x0;
        const sx = (1 - Math.cos(tx * Math.PI)) * 0.5;
        const xa = x0 % cellsX, xb = (x0 + 1) % cellsX;
        const a = g[ya + xa] * (1 - sx) + g[ya + xb] * sx;
        const b = g[yb + xa] * (1 - sx) + g[yb + xb] * sx;
        out[y * w + x] = a * (1 - sy) + b * sy;
      }
    }
    return out;
  }
  function fbm(w, h, base, octaves, seed, stretchX, stretchY) {
    const out = new Float32Array(w * h);
    let amp = 1, tot = 0;
    for (let o = 0; o < octaves; o++) {
      const cx = Math.max(1, Math.round(base * (1 << o) * (stretchX || 1)));
      const cy = Math.max(1, Math.round(base * (1 << o) * (stretchY || 1)));
      const n = valueNoise(w, h, cx, cy, seed + o * 101);
      for (let i = 0; i < out.length; i++) out[i] += n[i] * amp;
      tot += amp; amp *= 0.5;
    }
    for (let i = 0; i < out.length; i++) out[i] /= tot;
    return out;
  }
  // Height field -> tangent-space normal map texture (tileable).
  function normalTex(height, w, h, strength, repeat) {
    const c = mkCanvas(w, h), ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) {
      const yu = ((y - 1 + h) % h) * w, yd = ((y + 1) % h) * w, yc = y * w;
      for (let x = 0; x < w; x++) {
        const xl = (x - 1 + w) % w, xr = (x + 1) % w;
        const dx = (height[yc + xr] - height[yc + xl]) * strength;
        const dy = (height[yd + x] - height[yu + x]) * strength;
        const inv = 1 / Math.sqrt(dx * dx + dy * dy + 1);
        const i = (yc + x) * 4;
        d[i] = (-dx * inv * 0.5 + 0.5) * 255;
        d[i + 1] = (dy * inv * 0.5 + 0.5) * 255;
        d[i + 2] = (inv * 0.5 + 0.5) * 255;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    if (repeat) t.repeat.set(repeat[0], repeat[1]);
    t.anisotropy = 4;
    return t;
  }
  function grayTex(vals, w, h, lo, hi, repeat) {
    const c = mkCanvas(w, h), ctx = c.getContext('2d');
    const img = ctx.createImageData(w, h), d = img.data;
    for (let i = 0; i < w * h; i++) {
      const v = Math.max(0, Math.min(255, (lo + (hi - lo) * vals[i]) * 255));
      d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v; d[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    if (repeat) t.repeat.set(repeat[0], repeat[1]);
    t.anisotropy = 4;
    return t;
  }
  function colorTex(c, repeat) {
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 8;
    if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  }

  // Box-projected UVs in millimetres so that noise textures keep a constant
  // physical scale on boxes, extrusions and other procedural solids.
  MT.projUV = function (geo, tile) {
    tile = tile || 40;
    if (geo.index) geo = geo.toNonIndexed();
    const p = geo.attributes.position, n = geo.attributes.normal;
    const uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) {
      const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
      let u, v;
      if (ax >= ay && ax >= az) { u = p.getZ(i); v = p.getY(i); }
      else if (ay >= az) { u = p.getX(i); v = p.getZ(i); }
      else { u = p.getX(i); v = p.getY(i); }
      uv[i * 2] = u / tile; uv[i * 2 + 1] = v / tile;
    }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2));
    return geo;
  };

  const FONT = '"Hiragino Sans","Yu Gothic UI","Meiryo","Noto Sans JP","Noto Sans CJK JP","IPAPGothic","IPAGothic",sans-serif';
  MT.FONT = FONT;

  // ---- texture set -------------------------------------------------------
  const Tex = (MT.Tex = {});

  MT.buildTextures = function () {
    const S = 256;
    // orange-peel paint
    Tex.paintN = normalTex(fbm(S, S, 14, 3, 11), S, S, 2.2);
    // sand-cast texture showing through thick paint
    Tex.castN = normalTex(fbm(S, S, 30, 3, 23), S, S, 4.0);
    // brushed metal: streaks along U
    const br = fbm(S, S, 2, 4, 37, 1, 40);
    Tex.brushN = normalTex(br, S, S, 1.6);
    Tex.brushR = grayTex(br, S, S, 0.55, 1.0);
    // fine grain for satin plastic / anodised surfaces
    Tex.grainN = normalTex(fbm(S, S, 64, 2, 51), S, S, 1.4);
    // diamond knurl
    {
      const h = new Float32Array(S * S);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const a = ((x + y) % 32) / 32, b = ((x - y + 1024) % 32) / 32;
        const ta = 1 - Math.abs(a * 2 - 1), tb = 1 - Math.abs(b * 2 - 1);
        h[y * S + x] = Math.min(ta, tb);
      }
      Tex.knurlN = normalTex(h, S, S, 7);
    }
    // straight knurl (axial grooves): ridges vary along U
    {
      const h = new Float32Array(S * S);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const a = (x % 16) / 16;
        h[y * S + x] = Math.pow(1 - Math.abs(a * 2 - 1), 0.7);
      }
      Tex.ribN = normalTex(h, S, S, 6);
    }
    // pleated rubber bellows: ridges along V
    {
      const h = new Float32Array(S * S);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const a = (y % 32) / 32;
        h[y * S + x] = Math.sin(a * Math.PI);
      }
      Tex.bellowsN = normalTex(h, S, S, 9);
    }
    // bench top: speckled laminate
    {
      const c = mkCanvas(512, 512), g = c.getContext('2d');
      g.fillStyle = '#8f9190'; g.fillRect(0, 0, 512, 512);
      const r = rng(77);
      for (let i = 0; i < 9000; i++) {
        const v = 110 + Math.floor(r() * 70);
        g.fillStyle = 'rgba(' + v + ',' + v + ',' + (v - 2) + ',' + (0.25 + r() * 0.5) + ')';
        const s = 0.6 + r() * 1.8;
        g.fillRect(r() * 512, r() * 512, s, s);
      }
      for (let i = 0; i < 1400; i++) {
        g.fillStyle = 'rgba(40,42,44,' + (0.15 + r() * 0.3) + ')';
        const s = 0.6 + r() * 1.4;
        g.fillRect(r() * 512, r() * 512, s, s);
      }
      Tex.bench = colorTex(c, [14, 14]);
      Tex.benchR = grayTex(fbm(S, S, 6, 4, 91), S, S, 0.62, 0.92, [5, 5]);
    }
    // soft contact shadow blob
    {
      const c = mkCanvas(256, 256), g = c.getContext('2d');
      const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128);
      gr.addColorStop(0, 'rgba(0,0,0,0.62)');
      gr.addColorStop(0.55, 'rgba(0,0,0,0.34)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
      Tex.blob = new T.CanvasTexture(c);
    }
    // hotspot ring + arc arrow (beginner mode)
    {
      const c = mkCanvas(128, 128), g = c.getContext('2d');
      g.strokeStyle = '#fff'; g.lineWidth = 7;
      g.beginPath(); g.arc(64, 64, 46, 0, Math.PI * 2); g.stroke();
      g.globalAlpha = 0.35; g.lineWidth = 3;
      g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.stroke();
      Tex.ring = new T.CanvasTexture(c);
      const c2 = mkCanvas(256, 256), h = c2.getContext('2d');
      h.strokeStyle = '#fff'; h.fillStyle = '#fff'; h.lineWidth = 13; h.lineCap = 'round';
      for (let k = 0; k < 2; k++) {       // two arrows chasing each other around the rim
        h.save(); h.translate(128, 128); h.rotate(k * Math.PI); h.translate(-128, -128);
        h.beginPath(); h.arc(128, 128, 108, -Math.PI * 0.86, -Math.PI * 0.2); h.stroke();
        const ax = 128 + 108 * Math.cos(-Math.PI * 0.2), ay = 128 + 108 * Math.sin(-Math.PI * 0.2);
        h.translate(ax, ay); h.rotate(-Math.PI * 0.2 + Math.PI / 2);
        h.beginPath(); h.moveTo(-6, -17); h.lineTo(26, 0); h.lineTo(-6, 17); h.closePath(); h.fill();
        h.restore();
      }
      Tex.arc = new T.CanvasTexture(c2);
    }
    // thickness dial scale: numbers 1..20 over a 300 degree sweep
    {
      const c = mkCanvas(512, 512), g = c.getContext('2d');
      g.fillStyle = '#0d0e10'; g.fillRect(0, 0, 512, 512);
      g.translate(256, 256);
      g.strokeStyle = '#f4f4f0'; g.fillStyle = '#f4f4f0';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let v = 1; v <= 20; v++) {
        const a = MT.dialAngle(v);          // radians, 0 = up, clockwise positive
        g.save(); g.rotate(-a);
        g.lineWidth = v % 5 === 0 || v === 1 ? 5 : 3;
        g.beginPath(); g.moveTo(0, -248); g.lineTo(0, v % 5 === 0 || v === 1 ? -214 : -226); g.stroke();
        if (v === 1 || v % 5 === 0 || v % 2 === 0) {
          g.font = (v % 5 === 0 || v === 1 ? 'bold 44px ' : '30px ') + 'Arial,Helvetica,sans-serif';
          g.fillText(String(v), 0, -186);
        }
        g.restore();
      }
      // half-step ticks
      for (let v = 1.5; v < 20; v++) {
        g.save(); g.rotate(-MT.dialAngle(v)); g.lineWidth = 2;
        g.beginPath(); g.moveTo(0, -248); g.lineTo(0, -236); g.stroke(); g.restore();
      }
      g.font = 'bold 34px Arial,Helvetica,sans-serif';
      g.fillText('µm', 0, 204);
      Tex.dial = colorTex(c);
    }
    // neutral name plate (no brand)
    {
      const c = mkCanvas(512, 128), g = c.getContext('2d');
      const gr = g.createLinearGradient(0, 0, 0, 128);
      gr.addColorStop(0, '#c9ccce'); gr.addColorStop(0.5, '#e6e8e9'); gr.addColorStop(1, '#b9bcbe');
      g.fillStyle = gr; g.fillRect(0, 0, 512, 128);
      g.strokeStyle = '#3a3d40'; g.lineWidth = 3; g.strokeRect(8, 8, 496, 112);
      g.fillStyle = '#26282a'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = 'bold 34px Arial,Helvetica,sans-serif';
      g.fillText('ROTARY MICROTOME', 256, 46);
      g.font = '22px Arial,Helvetica,sans-serif';
      g.fillText('TEACHING MODEL  ·  1–20 µm', 256, 88);
      Tex.plate = colorTex(c);
    }
    // matcaps: lit-sphere images that stand in for image-based lighting on metals in the lite tier
    {
      const mk = (stops, hi) => {
        const c = mkCanvas(256, 256), g = c.getContext('2d');
        const gr = g.createLinearGradient(0, 0, 0, 256);
        stops.forEach(s => gr.addColorStop(s[0], s[1]));
        g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
        const h = g.createRadialGradient(86, 62, 2, 86, 62, 70);
        h.addColorStop(0, 'rgba(255,255,255,' + hi + ')'); h.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = h; g.fillRect(0, 0, 256, 256);
        const v = g.createRadialGradient(128, 128, 84, 128, 128, 128);
        v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.4)');
        g.fillStyle = v; g.fillRect(0, 0, 256, 256);
        return colorTex(c);
      };
      Tex.capChrome = mk([[0, '#ffffff'], [0.3, '#cfd6dc'], [0.47, '#4d5359'], [0.53, '#22262b'], [0.64, '#6c7379'], [1, '#c4c9cd']], 0.9);
      Tex.capSteel = mk([[0, '#f1f3f5'], [0.4, '#aab0b6'], [0.52, '#727980'], [0.6, '#858c92'], [1, '#bdc2c6']], 0.55);
    }
    // clearance-angle scale strip on the knife holder
    {
      const c = mkCanvas(256, 64), g = c.getContext('2d');
      g.fillStyle = '#101113'; g.fillRect(0, 0, 256, 64);
      g.strokeStyle = '#eee'; g.fillStyle = '#eee'; g.font = 'bold 20px Arial,Helvetica,sans-serif';
      g.textAlign = 'center';
      for (let i = 0; i <= 10; i++) {
        const x = 18 + i * 22;
        g.lineWidth = i % 5 === 0 ? 3 : 1.5;
        g.beginPath(); g.moveTo(x, 4); g.lineTo(x, i % 5 === 0 ? 30 : 20); g.stroke();
        if (i % 5 === 0) g.fillText(String(i), x, 54);
      }
      Tex.angleScale = colorTex(c);
    }
    // arrow decal on the handwheel showing the working direction
    {
      const c = mkCanvas(256, 96), g = c.getContext('2d');
      g.clearRect(0, 0, 256, 96);
      g.strokeStyle = '#f2f2ee'; g.fillStyle = '#f2f2ee'; g.lineWidth = 10; g.lineCap = 'round';
      g.beginPath(); g.moveTo(22, 60); g.quadraticCurveTo(128, 6, 214, 54); g.stroke();
      g.beginPath(); g.moveTo(236, 68); g.lineTo(196, 62); g.lineTo(222, 30); g.closePath(); g.fill();
      Tex.arrow = colorTex(c);
    }
  };

  // Angle of the dial (radians, clockwise from 12 o'clock) for a thickness in µm.
  MT.dialAngle = function (um) { return ((um - 1) / 19) * (300 * Math.PI / 180) - (150 * Math.PI / 180); };

  // ---- test pattern (ruler grid + letters) -------------------------------
  // Drawn once per wax colour; used on the block face and on every section.
  MT.makePatternTexture = function (seams) {
    const W = 600, H = 480;   // 30 x 24 mm at 20 px/mm
    const c = mkCanvas(W, H), g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
    const ink = 'rgba(14,28,40,0.80)', inkSoft = 'rgba(14,28,40,0.30)';
    for (let mm = 0; mm <= 30; mm++) {
      const x = mm * 20;
      g.strokeStyle = mm % 5 === 0 ? ink : inkSoft; g.lineWidth = mm % 5 === 0 ? 3 : 1.4;
      g.beginPath(); g.moveTo(x, 60); g.lineTo(x, H - 40); g.stroke();
    }
    for (let mm = 3; mm <= 22; mm++) {
      const y = mm * 20;
      g.strokeStyle = (mm - 2) % 5 === 0 ? ink : inkSoft; g.lineWidth = (mm - 2) % 5 === 0 ? 3 : 1.4;
      g.beginPath(); g.moveTo(40, y); g.lineTo(W - 40, y); g.stroke();
    }
    // ruler ticks along the top edge
    g.strokeStyle = ink; g.fillStyle = ink;
    for (let mm = 2; mm <= 28; mm++) {
      const x = mm * 20; g.lineWidth = 2.4;
      g.beginPath(); g.moveTo(x, 14); g.lineTo(x, mm % 5 === 0 ? 50 : 34); g.stroke();
    }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const win = (x, y, w, h) => {
      g.fillStyle = '#ffffff'; g.fillRect(x, y, w, h);
      g.strokeStyle = ink; g.lineWidth = 3; g.strokeRect(x, y, w, h);
    };
    win(70, 120, 170, 170); win(360, 120, 170, 170); win(215, 320, 170, 110);
    g.fillStyle = ink;
    g.font = 'bold 150px Arial,Helvetica,sans-serif';
    g.fillText('R', 155, 212); g.fillText('F', 445, 212);
    g.font = 'bold 76px Arial,Helvetica,sans-serif';
    g.fillText('2 7', 300, 378);
    if (seams) {   // section joints for the ribbon
      const s1 = g.createLinearGradient(0, 0, 0, 20);
      s1.addColorStop(0, 'rgba(0,0,0,0.40)'); s1.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = s1; g.fillRect(0, 0, W, 20);
      const s2 = g.createLinearGradient(0, H - 20, 0, H);
      s2.addColorStop(0, 'rgba(0,0,0,0)'); s2.addColorStop(1, 'rgba(0,0,0,0.40)');
      g.fillStyle = s2; g.fillRect(0, H - 20, W, 20);
    }
    const t = colorTex(c);
    if (seams) { t.wrapT = T.RepeatWrapping; t.wrapS = T.ClampToEdgeWrapping; }
    return t;
  };

  // ---- materials ---------------------------------------------------------
  const Mat = (MT.Mat = {});
  // lite = software rendering / weak GPU. Image-based lighting is by far the most
  // expensive thing per pixel there, so only real metals keep it; paint, plastic and
  // the bench fall back to Phong / Lambert and normal maps are dropped.
  MT.buildMaterials = function (lite) {
    MT.lite = !!lite;
    const S = T.MeshStandardMaterial;
    const phong = (o, shin, spec) => {
      const col = new T.Color(o.color !== undefined ? o.color : 0xffffff);
      if (!o.map && col.r + col.g + col.b < 0.2) col.lerp(new T.Color(0x767c84), 0.34);   // no bounce light here: lift near-black paints
      const q = { color: col, shininess: shin, specular: spec };
      if (o.map) q.map = o.map;
      if (o.emissive !== undefined) { q.emissive = o.emissive; q.emissiveIntensity = o.emissiveIntensity || 1; }
      return new T.MeshPhongMaterial(q);
    };
    const P = lite ? function (o) { return phong(o, 30 + (1 - (o.roughness || 0.5)) * 90, o.clearcoat ? 0x5a5a5a : 0x333333); } : T.MeshPhysicalMaterial;
    const ns = (a) => new T.Vector2(a, a);
    // standard material; in lite mode non-metals become Phong and maps are dropped
    const mk = !lite ? (o) => new S(o) : (o) => {
      if ((o.metalness || 0) < 0.9) return (o.roughness || 0.5) > 0.7 ? new T.MeshLambertMaterial({ color: o.color, map: o.map || null }) : phong(o, 20 + (1 - (o.roughness || 0.5)) * 110, (o.metalness || 0) > 0.5 ? 0x777777 : 0x2c2c2c);
      return new T.MeshMatcapMaterial({ color: o.color, matcap: (o.roughness || 0.3) < 0.2 ? Tex.capChrome : Tex.capSteel });
    };
    Mat.paintBody = new P({ color: 0xdfe1da, roughness: 0.4, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.22, normalMap: Tex.paintN, normalScale: ns(0.22) });
    Mat.paintBase = new P({ color: 0x23272c, roughness: 0.55, metalness: 0, clearcoat: 0.18, clearcoatRoughness: 0.45, normalMap: Tex.castN, normalScale: ns(0.5) });
    Mat.paintWheel = new P({ color: 0x30353b, roughness: 0.42, metalness: 0, clearcoat: 0.45, clearcoatRoughness: 0.3, normalMap: Tex.paintN, normalScale: ns(0.25) });
    Mat.steel = mk({ color: 0xcfd2d6, roughness: 0.36, metalness: 1, normalMap: Tex.brushN, normalScale: ns(0.35), roughnessMap: Tex.brushR });
    Mat.steelGround = mk({ color: 0xd9dcdf, roughness: 0.24, metalness: 1, normalMap: Tex.brushN, normalScale: ns(0.18) });
    Mat.chrome = mk({ color: 0xf4f6f8, roughness: 0.06, metalness: 1 });
    Mat.blade = mk({ color: 0xe9edf2, roughness: 0.16, metalness: 1 });
    Mat.bladeEdge = mk({ color: 0xffffff, roughness: 0.04, metalness: 1 });
    Mat.anod = mk({ color: 0x17181b, roughness: 0.4, metalness: 0.8, normalMap: Tex.grainN, normalScale: ns(0.12) });
    Mat.anodTray = mk({ color: 0x101113, roughness: 0.5, metalness: 0.0, normalMap: Tex.grainN, normalScale: ns(0.2) });
    Mat.anodKnurl = mk({ color: 0x17181b, roughness: 0.46, metalness: 0.8, normalMap: Tex.knurlN, normalScale: ns(0.9) });
    Mat.steelKnurl = mk({ color: 0xcfd2d6, roughness: 0.36, metalness: 1, normalMap: Tex.knurlN, normalScale: ns(0.9) });
    Mat.plastic = mk({ color: 0x131416, roughness: 0.52, metalness: 0, normalMap: Tex.grainN, normalScale: ns(0.25) });
    Mat.plasticRib = mk({ color: 0x131416, roughness: 0.56, metalness: 0, normalMap: Tex.ribN, normalScale: ns(0.9) });
    Mat.plasticRed = new P({ color: 0xc8201c, roughness: 0.42, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.4, normalMap: Tex.grainN, normalScale: ns(0.15) });
    Mat.plasticIvory = mk({ color: 0xe9e6dc, roughness: 0.5, metalness: 0, normalMap: Tex.grainN, normalScale: ns(0.2) });
    Mat.rubber = mk({ color: 0x0b0b0c, roughness: 0.92, metalness: 0 });
    Mat.bellows = mk({ color: 0x0c0c0d, roughness: 0.78, metalness: 0, normalMap: Tex.bellowsN, normalScale: ns(1.0) });
    Mat.brass = mk({ color: 0xc09a45, roughness: 0.3, metalness: 1, normalMap: Tex.brushN, normalScale: ns(0.2) });
    Mat.dark = mk({ color: 0x050506, roughness: 0.9, metalness: 0 });
    Mat.dialFace = mk({ map: Tex.dial, roughness: 0.42, metalness: 0.3 });
    Mat.plate = mk({ map: Tex.plate, roughness: 0.3, metalness: 0.85 });
    Mat.angleScale = mk({ map: Tex.angleScale, roughness: 0.45, metalness: 0.5 });
    Mat.arrow = new T.MeshBasicMaterial({ map: Tex.arrow, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    Mat.lampOff = mk({ color: 0x1a2a1c, roughness: 0.25, metalness: 0, emissive: 0x18c85a, emissiveIntensity: 1.6 });
    Mat.bench = lite ? new T.MeshBasicMaterial({ map: Tex.bench }) : new S({ map: Tex.bench, roughness: 1.0, roughnessMap: Tex.benchR, metalness: 0 });
    if (lite) for (const k in Tex) { Tex[k].anisotropy = 1; }
    Mat.blob = new T.MeshBasicMaterial({ map: Tex.blob, transparent: true, depthWrite: false, opacity: 0.85, toneMapped: false });
    for (const k in Mat) Mat[k].name = k;
  };

  // wax material set for one block colour
  MT.makeWax = function (hex) {
    const c = new T.Color(hex);
    const wax = MT.lite
      ? new T.MeshPhongMaterial({ color: c, shininess: 90, specular: 0x777777, emissive: c.clone().multiplyScalar(0.26) })
      : new T.MeshPhysicalMaterial({
        color: c, roughness: 0.36, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.3,
        transparent: true, opacity: 0.9, emissive: c.clone().multiplyScalar(0.22),
        sheen: 0.6, sheenRoughness: 0.5, sheenColor: c.clone().lerp(new T.Color(0xffffff), 0.6),
      });
    wax.name = 'wax';
    return wax;
  };

  // ---- studio environment (PMREM from a tiny emissive scene) -------------
  MT.buildEnvironment = function (renderer, style) {
    const s = new T.Scene();
    const add = (w, h, pos, look, color, k) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(k), side: T.DoubleSide }));
      m.position.set(pos[0], pos[1], pos[2]); m.lookAt(look[0], look[1], look[2]); s.add(m);
    };
    const room = new T.Mesh(new T.BoxGeometry(30, 16, 30), new T.MeshBasicMaterial({ color: style === 'play' ? 0x0b0f1c : 0x16171a, side: T.BackSide }));
    room.position.y = 5; s.add(room);
    // bench bounce
    add(30, 30, [0, -2.9, 0], [0, 10, 0], style === 'play' ? 0x2a3350 : 0x55585a, 1);
    if (style === 'play') {
      add(9, 9, [0, 12.5, 1], [0, 0, 0], 0xffffff, 5.5);
      add(8, 5, [9, 6, 9], [0, 1, 0], 0xfff1dc, 13);
      add(2.2, 9, [-13, 4, 2], [0, 2, 0], 0x6fdcff, 6.5);
      add(2.2, 9, [12, 4, -8], [0, 2, 0], 0xff86b8, 5);
      add(12, 1.6, [0, 7, -14], [0, 2, 0], 0xcfe4ff, 8);
      add(1.5, 1.5, [-5, 9, 10], [0, 0, 0], 0xffffff, 26);
    } else {
      add(10, 10, [0, 12.5, 1], [0, 0, 0], 0xffffff, 5.0);
      add(8, 5, [9, 6, 9], [0, 1, 0], 0xfff4e6, 12);
      add(2.5, 9, [-13, 4, 2], [0, 2, 0], 0xdfe9ff, 6.5);
      add(12, 1.8, [0, 7, -14], [0, 2, 0], 0xffffff, 8);
      add(3, 6, [13, 4, -6], [0, 2, 0], 0xffe9d0, 4);
      add(1.5, 1.5, [-5, 9, 10], [0, 0, 0], 0xffffff, 24);
    }
    const pm = new T.PMREMGenerator(renderer);
    const rt = pm.fromScene(s, 0.03);
    pm.dispose();
    s.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    return rt.texture;
  };
})();
