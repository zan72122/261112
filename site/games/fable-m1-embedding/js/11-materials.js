/* Material library. Stainless is brushed (anisotropic where the GPU can afford it), panels are
   powder-coated, plastics satin. Wax and glass get small shader patches (see patch()). */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const M = (EC.mats = {});

  /* Injects GLSL at well-known anchor points of the standard material. One program per key. */
  M.patch = function (mat, key, h) {
    mat.userData.uniforms = h.uniforms || {};
    mat.onBeforeCompile = function (shader) {
      Object.assign(shader.uniforms, mat.userData.uniforms);
      if (h.vpars) shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\n' + h.vpars);
      if (h.vmain) shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n' + h.vmain);
      let f = shader.fragmentShader;
      if (h.fpars) f = f.replace('#include <common>', '#include <common>\n' + h.fpars);
      if (h.fcolor) f = f.replace('#include <color_fragment>', '#include <color_fragment>\n' + h.fcolor);
      if (h.frough) f = f.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + h.frough);
      if (h.femissive) f = f.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + h.femissive);
      if (h.fend) f = f.replace('#include <opaque_fragment>', h.fend + '\n#include <opaque_fragment>');
      shader.fragmentShader = f;
    };
    mat.customProgramCacheKey = function () { return key; };
    return mat;
  };

  const SPEC_ALPHA = 'diffuseColor.a = clamp(diffuseColor.a + dot(totalSpecular, vec3(0.3333)) * SPECK, 0.0, 1.0);';

  /* Transparent surface whose reflections stay bright (glass, liquid). */
  M.glassy = function (mat, k) {
    return M.patch(mat, 'glassy' + k, { fend: SPEC_ALPHA.replace('SPECK', k.toFixed(2)) });
  };

  const WAX_LIQUID = new T.Color(1.0, 0.93, 0.74);
  const WAX_HOT = new T.Color(1.0, 0.6, 0.16);
  const WAX_MILKY = new T.Color(0.86, 0.855, 0.82);
  M.waxColors = { liquid: WAX_LIQUID, milky: WAX_MILKY, hot: WAX_HOT };

  /* Wax driven by a solid-fraction field texture: clear where molten, milky where set.
     Geometry supplies aField = (distance-from-wall 0..1, height 0..1). Molten wax has no diffuse
     response: it is a tinted, glossy, see-through layer (tint via uLiquid * uGlow). */
  M.waxField = function (fieldTex, o) {
    o = o || {};
    const mat = new T.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.06, metalness: 0, transparent: true, depthWrite: !!o.depthWrite,
      side: o.side === undefined ? T.DoubleSide : o.side, envMapIntensity: 1.25,
    });
    const u = {
      uField: { value: fieldTex },
      uLiquid: { value: WAX_LIQUID.clone() },
      uMilky: { value: WAX_MILKY.clone() },
      uAlphaL: { value: o.alpha === undefined ? 0.2 : o.alpha },
      uGlow: { value: 0.3 },
      uSeam: { value: -1 },
    };
    M.patch(mat, 'waxField', {
      uniforms: u,
      vpars: 'attribute vec2 aField;\nvarying vec2 vField;',
      vmain: 'vField = aField;',
      fpars: 'uniform sampler2D uField;\nuniform vec3 uLiquid;\nuniform vec3 uMilky;\nuniform float uAlphaL;\nuniform float uGlow;\nuniform float uSeam;\nvarying vec2 vField;\nfloat wMilk;',
      fcolor: [
        'float wSolid = texture2D(uField, vField).r;',
        'wMilk = smoothstep(0.30, 0.70, wSolid);',
        'float wSeam = (1.0 - smoothstep(0.0, 0.035, abs(vField.y - uSeam))) * wMilk;',
        'diffuseColor.rgb = uMilky * (1.0 - 0.22 * wSeam) * wMilk;',
        'diffuseColor.a = mix(uAlphaL, 0.97, wMilk);',
      ].join('\n'),
      frough: 'roughnessFactor = mix(roughnessFactor, 0.6, wMilk);',
      femissive: 'totalEmissiveRadiance += uLiquid * uGlow * (1.0 - wMilk);',
      fend: SPEC_ALPHA.replace('SPECK', '0.90'),
    });
    return mat;
  };

  /* Plain molten wax (stream, drips, reservoir): tinted, glossy, no diffuse. */
  M.waxLiquid = function (alpha, tint, glow) {
    const mat = new T.MeshStandardMaterial({
      color: 0x000000, emissive: tint || WAX_LIQUID, emissiveIntensity: glow === undefined ? 0.4 : glow, roughness: 0.05, metalness: 0,
      transparent: true, opacity: alpha, depthWrite: false, envMapIntensity: 1.3, side: T.DoubleSide,
    });
    return M.glassy(mat, 0.9);
  };

  M.waxSolid = function () {
    return new T.MeshStandardMaterial({ color: WAX_MILKY, roughness: 0.55, metalness: 0, emissive: 0x2a2924, emissiveIntensity: 0.3 });
  };

  M.init = function () {
    const X = EC.tex;
    const aniso = !EC.params.lite;

    function steel(o) {
      const base = {
        color: o.color || 0xcfd1d2, metalness: 1, roughness: o.rough,
        roughnessMap: o.maps.rough, normalMap: o.maps.normal,
        normalScale: new T.Vector2(o.ns || 0.25, o.ns || 0.25), envMapIntensity: o.env || 1.0,
      };
      if (o.map) base.map = o.map;
      if (aniso && o.aniso) {
        base.anisotropy = o.aniso;
        base.anisotropyRotation = o.rot || 0;
        return new T.MeshPhysicalMaterial(base);
      }
      return new T.MeshStandardMaterial(base);
    }

    M.steel = steel({ maps: X.brushA, rough: 0.46, aniso: 0.75 });
    M.steelFine = steel({ maps: X.brushB, rough: 0.42, ns: 0.18 });
    M.steelPlate = steel({ maps: X.plate, map: X.plate.map, rough: 0.5, aniso: 0.7, ns: 0.45 });
    M.steelPolish = new T.MeshStandardMaterial({ color: 0xbdc0c4, metalness: 1, roughness: 0.27, envMapIntensity: 1.15 });
    M.steelSatin = new T.MeshStandardMaterial({ color: 0xc4c6c8, metalness: 1, roughness: 0.34 });
    M.gunmetal = new T.MeshStandardMaterial({ color: 0x3b3e42, metalness: 0.9, roughness: 0.42 });

    M.paint = new T.MeshStandardMaterial({ color: 0xdcdad2, metalness: 0, roughness: 0.46, envMapIntensity: 0.85, normalMap: X.peel, normalScale: new T.Vector2(0.1, 0.1) });
    M.paintDark = new T.MeshStandardMaterial({ color: 0x24282c, metalness: 0.1, roughness: 0.55, envMapIntensity: 0.6, normalMap: X.peel, normalScale: new T.Vector2(0.08, 0.08) });
    M.paintGray = new T.MeshStandardMaterial({ color: 0x9aa0a4, metalness: 0, roughness: 0.5, normalMap: X.peel, normalScale: new T.Vector2(0.1, 0.1) });
    M.plasticBlack = new T.MeshStandardMaterial({ color: 0x17181a, metalness: 0, roughness: 0.42 });
    M.plasticGray = new T.MeshStandardMaterial({ color: 0x5b6066, metalness: 0, roughness: 0.5 });
    M.plasticWhite = new T.MeshStandardMaterial({ color: 0xd9d9d5, metalness: 0, roughness: 0.4 });
    M.rubber = new T.MeshStandardMaterial({ color: 0x101112, metalness: 0, roughness: 0.92 });
    M.rubberRib = new T.MeshStandardMaterial({ color: 0x141516, metalness: 0, roughness: 0.8, normalMap: X.ribs, normalScale: new T.Vector2(0.9, 0.9) });
    M.cavity = new T.MeshStandardMaterial({ color: 0x050506, metalness: 0, roughness: 1 });
    M.keypad = new T.MeshStandardMaterial({ color: 0x3a3f45, metalness: 0, roughness: 0.6 });

    M.glassSmoke = M.glassy(new T.MeshStandardMaterial({
      color: 0x20262b, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.42, depthWrite: false, envMapIntensity: 1.5, side: T.DoubleSide,
    }), 1.0);
    M.glassClear = M.glassy(new T.MeshStandardMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.08, depthWrite: false, envMapIntensity: 1.4,
    }), 1.0);
    M.glassDark = new T.MeshStandardMaterial({ color: 0x06080a, metalness: 0, roughness: 0.06, envMapIntensity: 1.4 });

    M.bench = new T.MeshStandardMaterial({ color: 0x7c8186, map: X.bench, metalness: 0, roughness: 0.5, roughnessMap: X.benchRough, envMapIntensity: 0.9 });
    M.benchEdge = new T.MeshStandardMaterial({ color: 0x2c3035, metalness: 0, roughness: 0.6 });
    M.wall = new T.MeshStandardMaterial({ color: 0xc9cdce, metalness: 0, roughness: 0.92, envMapIntensity: 0.7 });

    M.coldTop = new T.MeshStandardMaterial({ color: 0xffffff, map: X.frost.map, metalness: 0.35, roughness: 1.0, roughnessMap: X.frost.rough, envMapIntensity: 1.0 });

    M.ledGreen = new T.MeshBasicMaterial({ color: new T.Color(0.25, 1.9, 0.5) });
    M.ledAmber = new T.MeshBasicMaterial({ color: new T.Color(2.2, 1.0, 0.15) });
    M.ledBlue = new T.MeshBasicMaterial({ color: new T.Color(0.35, 1.0, 2.4) });
    M.ledOff = new T.MeshStandardMaterial({ color: 0x1b1d1f, roughness: 0.3 });
    M.lens = new T.MeshBasicMaterial({ color: new T.Color(3.4, 3.1, 2.6) });

    M.amber = new T.MeshStandardMaterial({ color: 0xe9a23a, emissive: 0xd88a1c, emissiveIntensity: 0.55, roughness: 0.15, metalness: 0 });
    M.tankWax = M.waxLiquid(0.9, new T.Color(0.95, 0.62, 0.2), 0.5);
    M.waxPellet = new T.MeshStandardMaterial({ color: 0xdedcd3, roughness: 0.45, metalness: 0, emissive: 0x24231f, emissiveIntensity: 0.4 });

    M.vents = new T.MeshStandardMaterial({ map: X.vents, transparent: true, roughness: 0.6, metalness: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    M.ticks = new T.MeshBasicMaterial({ map: X.ticks, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    M.contact = new T.MeshBasicMaterial({ color: 0x000000, alphaMap: X.shadowBlob, transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
  };

  /* Icon decal material from the pictogram atlas. */
  M.icon = function (i, color, opacity) {
    const t = EC.tex.icons.tex.clone();
    t.needsUpdate = true;
    t.repeat.set(1 / EC.tex.icons.n, 1);
    t.offset.set(i / EC.tex.icons.n, 0);
    return new T.MeshBasicMaterial({ map: t, color: color === undefined ? 0xffffff : color, transparent: true, opacity: opacity === undefined ? 0.85 : opacity, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 });
  };
})();
