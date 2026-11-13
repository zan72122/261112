// sky.js - the big cheap backdrop: gradient sky dome, sun glow, endless sea, fog and lights.
(function () {
  'use strict';
  var T = THREE, MA = window.MA, U = MA.uni, P = MA.pal;

  MA.buildSky = function (scene) {
    scene.fog = new T.FogExp2(P.horizon, MA.FOG_DENSITY);

    var hemi = new T.HemisphereLight(0xe6f3ff, 0xc9dcc0, 2.0);
    var sun = new T.DirectionalLight(0xfff1d6, 1.75);
    sun.position.copy(U.sunDir.value).multiplyScalar(100);
    scene.add(hemi, sun);

    // --- sky dome: follows the camera, drawn first, never writes depth ---
    var sky = new T.Mesh(
      new T.SphereGeometry(1, 24, 12),
      new T.ShaderMaterial({
        uniforms: {
          top: { value: new T.Color(P.skyTop) },
          mid: { value: new T.Color(P.skyMid) },
          hor: { value: U.fogColor.value },
          sunCol: { value: new T.Color(P.sun) },
          sunDir: U.sunDir,
        },
        vertexShader:
          'varying vec3 vDir;\n' +
          'void main(){ vDir = position; vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; }',
        fragmentShader:
          'precision highp float;\n' +
          'uniform vec3 top, mid, hor, sunCol, sunDir; varying vec3 vDir;\n' +
          'void main(){\n' +
          '  vec3 d = normalize(vDir);\n' + // vDir is a unit-sphere position, never zero
          '  float h = d.y;\n' +
          '  vec3 col = mix(hor, mid, smoothstep(0.0, 0.22, h));\n' +
          '  col = mix(col, top, smoothstep(0.15, 0.75, h));\n' +
          '  float s = max(dot(d, sunDir), 0.0);\n' +
          '  float s2 = s * s; float s4 = s2 * s2; float s8 = s4 * s4; float s32 = s8 * s8 * s8 * s8;\n' +
          '  float s128 = s32 * s32 * s32 * s32;\n' +
          '  col += sunCol * (s8 * 0.16 + s32 * 0.22 + s128 * s128 * 0.9);\n' +
          '  gl_FragColor = vec4(col, 1.0);\n' +
          '  #include <colorspace_fragment>\n' +
          '}',
        side: T.BackSide,
        depthWrite: false,
        depthTest: false,
        fog: false,
      })
    );
    sky.scale.setScalar(3000);
    sky.renderOrder = -100;
    sky.frustumCulled = false;
    scene.add(sky);

    // --- sea: one quad that slides under the camera; pattern is in world space ---
    var isl = [];
    for (var i = 0; i < 5; i++) isl.push(new T.Vector4(1e6, 1e6, 1, 0));
    var sea = new T.Mesh(
      new T.PlaneGeometry(9000, 9000, 1, 1),
      new T.ShaderMaterial({
        uniforms: {
          time: U.time,
          fogColor: U.fogColor,
          fogDensity: U.fogDensity,
          deep: { value: new T.Color(P.seaDeep) },
          light: { value: new T.Color(P.seaLight) },
          shallow: { value: new T.Color(P.seaShallow) },
          uIsl: { value: isl },
        },
        vertexShader:
          'varying vec3 vW;\n' +
          'void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
        fragmentShader:
          'precision highp float;\n' +
          'uniform float time; uniform vec3 deep, light, shallow; uniform vec4 uIsl[5];\n' +
          MA.glslFog +
          'varying vec3 vW;\n' +
          'void main(){\n' +
          '  vec2 p = vW.xz;\n' +
          '  float dist = distance(vW, cameraPosition);\n' +
          '  float nearK = 1.0 - smoothstep(120.0, 800.0, dist);\n' +
          '  float w = sin(p.x * 0.045 + time * 0.5) * sin(p.y * 0.038 - time * 0.4) + 0.5 * sin((p.x + p.y) * 0.11 + time * 0.9);\n' +
          '  vec3 col = mix(deep, light, 0.5 + 0.3 * w * nearK);\n' +
          '  vec2 q = p + vec2(sin(p.y * 0.071 + time * 0.31), sin(p.x * 0.063 - time * 0.27)) * 7.0;\n' +
          '  float g = sin(q.x * 0.21 + sin(q.y * 0.093) * 2.3 + time * 0.8) * sin(q.y * 0.47 + sin(q.x * 0.117) * 2.1 - time * 1.1)\n' +
          '          + 0.45 * sin((q.x + q.y) * 0.9 + time * 1.7);\n' +
          '  col += vec3(0.5) * smoothstep(1.02, 1.3, g) * (1.0 - smoothstep(30.0, 300.0, dist));\n' +
          '  for (int i = 0; i < 5; i++) {\n' +
          '    float d = distance(p, uIsl[i].xy); float r = uIsl[i].z;\n' +
          '    col = mix(col, shallow, (1.0 - smoothstep(r * 0.9, r * 1.6 + 6.0, d)) * 0.8);\n' +
          '  }\n' +
          '  col = mix(col, fogColor, fogAmount(dist));\n' +
          '  gl_FragColor = vec4(col, 1.0);\n' +
          '  #include <colorspace_fragment>\n' +
          '}',
        fog: false,
      })
    );
    sea.rotation.x = -Math.PI / 2;
    sea.frustumCulled = false;
    scene.add(sea);

    MA.sky = {
      seaIslands: isl,
      update: function (cam) {
        sky.position.copy(cam.position);
        sea.position.set(cam.position.x, 0, cam.position.z);
      },
    };
  };
})();
