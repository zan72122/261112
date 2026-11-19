// 後処理: HDR で描いたシーンにブルーム（発光のにじみ）と陽炎を足し、トーンマップして画面へ出す。
// 陽炎はシーンのアルファを「マスク」として使う（fx.js のスプライトがアルファを下げた場所だけ揺らす）。
// 軽さ優先: ブルームは 1/2 → 1/16 の小さなバッファ 4 枚だけ。
(function () {
  'use strict';

  const VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

  const P = (QP.post = { ok: false, bloom: true });

  P.init = function (renderer) {
    const gl = renderer.getContext();
    P.renderer = renderer;
    P.ok = renderer.capabilities.isWebGL2 && !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
    if (!P.ok) return false;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
    P.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    P.quad = new THREE.Mesh(geo, null);
    P.quad.frustumCulled = false;
    P.scene = new THREE.Scene();
    P.scene.add(P.quad);

    const mk = (frag, uniforms, extra) => new THREE.ShaderMaterial(Object.assign({
      vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, toneMapped: false,
    }, extra || {}));

    // 明るい部分だけ取り出しつつ 1/2 に縮小
    P.mBright = mk(`
      uniform sampler2D tMap; uniform vec2 uTexel; uniform float uThreshold; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMap, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(1.0, -1.0)).rgb
               + texture2D(tMap, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(1.0, 1.0)).rgb;
        c = min(c * 0.25, vec3(5.0)); // 鏡面の一点光りが巨大な光芒にならないよう上限をかける
        float l = max(c.r, max(c.g, c.b));
        float w = smoothstep(uThreshold, uThreshold * 2.2, l);
        gl_FragColor = vec4(c * w, 1.0);
      }`, { tMap: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 1.0 } });

    P.mDown = mk(`
      uniform sampler2D tMap; uniform vec2 uTexel; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMap, vUv).rgb * 4.0
               + texture2D(tMap, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(1.0, -1.0)).rgb
               + texture2D(tMap, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(1.0, 1.0)).rgb;
        gl_FragColor = vec4(c * 0.125, 1.0);
      }`, { tMap: { value: null }, uTexel: { value: new THREE.Vector2() } });

    P.mUp = mk(`
      uniform sampler2D tMap; uniform vec2 uTexel; varying vec2 vUv;
      void main(){
        vec3 c = (texture2D(tMap, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(1.0, -1.0)).rgb
                + texture2D(tMap, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(1.0, 1.0)).rgb) * 2.0
                + texture2D(tMap, vUv + uTexel * vec2(-2.0, 0.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(2.0, 0.0)).rgb
                + texture2D(tMap, vUv + uTexel * vec2(0.0, -2.0)).rgb + texture2D(tMap, vUv + uTexel * vec2(0.0, 2.0)).rgb;
        gl_FragColor = vec4(c / 12.0, 1.0);
      }`, { tMap: { value: null }, uTexel: { value: new THREE.Vector2() } },
    { blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, transparent: true });

    // 合成 → トーンマップ → sRGB
    P.mFinal = mk(`
      uniform sampler2D tScene; uniform sampler2D tBloom;
      uniform float uTime; uniform float uBloom; uniform float uShimmer; uniform float uAspect; uniform float uVignette;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 uv = vUv;
        if (uShimmer > 0.0) {
          float mask = clamp(1.0 - texture2D(tScene, vUv).a, 0.0, 1.0);
          if (mask > 0.004) {
            vec2 p = vUv * vec2(uAspect, 1.0) * 46.0;
            float n1 = sin(p.y * 1.9 - uTime * 6.5 + sin(p.x * 1.3 + uTime * 1.4) * 1.7);
            float n2 = sin(p.x * 2.4 + uTime * 3.3 + sin(p.y * 1.1 - uTime * 2.6) * 1.5);
            uv += vec2(n1 / uAspect, n2 * 0.55) * mask * 0.0052 * uShimmer;
          }
        }
        vec3 col = texture2D(tScene, uv).rgb;
        col += texture2D(tBloom, vUv).rgb * uBloom;
        vec2 q = vUv - 0.5;
        col *= 1.0 - uVignette * dot(q, q);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor.rgb += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
      }`, {
      tScene: { value: null }, tBloom: { value: null }, uTime: { value: 0 }, uBloom: { value: 0.5 },
      uShimmer: { value: 0 }, uAspect: { value: 1 }, uVignette: { value: 0.35 },
    }, { toneMapped: true });

    P.black = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    P.black.needsUpdate = true;
    P.chain = [];
    return true;
  };

  // w, h は実ピクセル数
  P.setSize = function (w, h, samples) {
    if (!P.ok) return;
    if (P.maxSamples != null) samples = Math.min(samples, P.maxSamples);
    if (P.rt && (P.samples !== samples)) {
      P.rt.dispose();
      P.rt = null;
    }
    if (!P.rt) {
      P.rt = new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType, samples, depthBuffer: true, stencilBuffer: false,
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      });
      P.samples = samples;
    } else P.rt.setSize(w, h);
    for (let i = 0; i < 4; i++) {
      const cw = Math.max(2, Math.round(w / (2 << i)));
      const chh = Math.max(2, Math.round(h / (2 << i)));
      if (!P.chain[i]) {
        P.chain[i] = new THREE.WebGLRenderTarget(cw, chh, {
          type: THREE.HalfFloatType, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        });
      } else P.chain[i].setSize(cw, chh);
    }
    P.w = w;
    P.h = h;
  };

  // HDR ターゲットが実際に使えるか確かめる（古い端末向けの保険）。だめなら MSAA なし → 後処理なしの順に退避。
  P.validate = function () {
    if (!P.ok) return false;
    const r = P.renderer;
    const gl = r.getContext();
    const complete = () => {
      r.setRenderTarget(P.rt);
      r.clear();
      const props = r.properties.get(P.rt);
      const fb = props.__webglMultisampledFramebuffer || props.__webglFramebuffer;
      let ok = true;
      if (fb) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      }
      r.setRenderTarget(null);
      r.resetState();
      return ok;
    };
    if (complete()) return true;
    if (P.samples > 0) {
      P.maxSamples = 0;
      P.setSize(P.w, P.h, 0);
      if (complete()) return true;
    }
    P.ok = false;
    return false;
  };

  function pass(mat, src, dst) {
    mat.uniforms.tMap.value = src.texture;
    mat.uniforms.uTexel.value.set(1 / src.width, 1 / src.height);
    P.quad.material = mat;
    P.renderer.setRenderTarget(dst);
    P.renderer.render(P.scene, P.cam);
  }

  // シーン（と小窓）を HDR ターゲットへ描いたあとに呼ぶ
  P.finish = function (time, o) {
    const r = P.renderer;
    const auto = r.autoClear;
    r.autoClear = false;
    const bloomOn = P.bloom && o.bloom > 0.001;
    if (bloomOn) {
      const c = P.chain;
      P.mBright.uniforms.uThreshold.value = o.threshold;
      pass(P.mBright, P.rt, c[0]);
      pass(P.mDown, c[0], c[1]);
      pass(P.mDown, c[1], c[2]);
      pass(P.mDown, c[2], c[3]);
      pass(P.mUp, c[3], c[2]);
      pass(P.mUp, c[2], c[1]);
    }
    const u = P.mFinal.uniforms;
    u.tScene.value = P.rt.texture;
    u.tBloom.value = bloomOn ? P.chain[1].texture : P.black;
    u.uBloom.value = bloomOn ? o.bloom : 0;
    u.uTime.value = time % 1000;
    u.uShimmer.value = o.shimmer;
    u.uAspect.value = P.w / P.h;
    P.quad.material = P.mFinal;
    r.setRenderTarget(null);
    r.render(P.scene, P.cam);
    r.autoClear = auto;
  };
})();
