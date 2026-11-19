/* Renderer, camera, lighting rig, generated studio/lab environment map, bench and wall. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;

  /* A small "lab" lit by ceiling strip lights and a window: rendered once into a PMREM cube
     so stainless and wax pick up long soft highlights. */
  function buildEnvScene() {
    const s = new T.Scene();
    function wall(w, h, x, y, z, rx, ry, c) {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c[0], c[1], c[2]), side: T.DoubleSide }));
      m.position.set(x, y, z); m.rotation.set(rx, ry, 0);
      s.add(m);
      return m;
    }
    const W = 700, H = 320, D = 700;
    wall(W, D, 0, 0, 0, -Math.PI / 2, 0, [0.34, 0.34, 0.35]);             // floor (bench bounce)
    wall(W, D, 0, H, 0, Math.PI / 2, 0, [0.26, 0.27, 0.28]);              // ceiling
    wall(W, H, 0, H / 2, -D / 2, 0, 0, [0.5, 0.52, 0.54]);                // back wall
    wall(W, H, 0, H / 2, D / 2, 0, Math.PI, [0.3, 0.3, 0.31]);            // behind viewer
    wall(D, H, -W / 2, H / 2, 0, 0, Math.PI / 2, [0.36, 0.38, 0.41]);     // left
    wall(D, H, W / 2, H / 2, 0, 0, -Math.PI / 2, [0.36, 0.34, 0.32]);     // right (warm bounce)
    // ceiling strip lights
    for (let i = -1; i <= 1; i++) {
      wall(40, 300, i * 180, H - 2, 20, Math.PI / 2, 0, [17, 16.4, 15.6]);
    }
    wall(380, 46, 0, H - 2, 262, Math.PI / 2, 0, [7, 7, 7.2]);
    // window on the left wall, cool daylight
    wall(320, 170, -W / 2 + 2, 180, -30, 0, Math.PI / 2, [5.6, 6.6, 7.8]);
    // soft warm fill from the right/front and a broad front softbox
    wall(240, 150, W / 2 - 2, 150, 120, 0, -Math.PI / 2, [2.6, 2.3, 1.9]);
    wall(300, 120, 0, 150, D / 2 - 2, 0, Math.PI, [1.5, 1.5, 1.55]);
    // dark bench-level band so reflections ground the object
    wall(W, 50, 0, 25, -D / 2 + 2, 0, 0, [0.16, 0.16, 0.17]);
    // the cube camera sits at the origin: put it at bench height inside the room
    s.children.forEach(function (o) { o.position.y -= 105; });
    return s;
  }

  EC.initEnv = function (canvas) {
    const lite = EC.isMobile || EC.params.lite;
    const renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false });
    renderer.setClearColor(0x15171a, 1);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.localClippingEnabled = true;
    EC.renderer = renderer;

    const scene = (EC.scene = new T.Scene());
    const camera = (EC.camera = new T.PerspectiveCamera(30, 1, 3, 1200));

    const pm = new T.PMREMGenerator(renderer);
    const envScene = buildEnvScene();
    const envRT = pm.fromScene(envScene, 0.035, 1, 2000);
    scene.environment = envRT.texture;
    scene.background = envRT.texture;
    scene.backgroundBlurriness = 0.55;
    scene.backgroundIntensity = 0.55;
    pm.dispose();
    envScene.traverse(function (o) { if (o.geometry) { o.geometry.dispose(); o.material.dispose(); } });

    // key light with soft shadow
    const key = new T.DirectionalLight(0xfff4e6, 2.5);
    key.position.set(-58, 150, 96);
    key.target.position.set(14, 6, 2);
    key.castShadow = true;
    const sm = lite ? 1024 : 2048;
    key.shadow.mapSize.set(sm, sm);
    const sc = key.shadow.camera;
    sc.left = -78; sc.right = 84; sc.top = 66; sc.bottom = -52; sc.near = 60; sc.far = 330;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.12;
    key.shadow.radius = lite ? 2.2 : 3.2;
    scene.add(key, key.target);
    EC.keyLight = key;

    const fill = new T.DirectionalLight(0xcfe0ff, 0.45);
    fill.position.set(120, 70, 40);
    scene.add(fill);

    // bench
    const D = EC.D.bench;
    const bw = D.x1 - D.x0, bd = D.z1 - D.z0;
    const bench = new T.Mesh(EC.geom.rbox(bw, 4, bd, 0.9, 3), EC.mats.bench);
    bench.position.set((D.x0 + D.x1) / 2, -2, (D.z0 + D.z1) / 2);
    bench.receiveShadow = true;
    scene.add(bench);
    const apron = new T.Mesh(new T.BoxGeometry(bw - 6, 60, bd - 6), EC.mats.benchEdge);
    apron.position.set((D.x0 + D.x1) / 2, -34, (D.z0 + D.z1) / 2 - 2);
    scene.add(apron);
    // wall + upstand
    const wall = new T.Mesh(new T.PlaneGeometry(bw + 260, 230), EC.mats.wall);
    wall.position.set((D.x0 + D.x1) / 2, 85, D.z0 - 0.5);
    wall.receiveShadow = true;
    scene.add(wall);
    const up = new T.Mesh(EC.geom.rbox(bw, 9, 1.6, 0.5, 2), EC.mats.benchEdge);
    up.position.set((D.x0 + D.x1) / 2, 4.5, D.z0 + 0.8);
    up.receiveShadow = true; up.castShadow = true;
    scene.add(up);
    EC.benchMesh = bench;
    EC.wallMesh = wall;
    // soft occlusion on the wall behind the units (the key light comes from the front left)
    const ws = new T.Mesh(new T.PlaneGeometry(150, 74), EC.mats.contact.clone());
    ws.material.opacity = 0.2;
    ws.position.set(22, 22, D.z0 - 0.4);
    ws.renderOrder = 1; ws.userData.noPick = true;
    scene.add(ws);

    return renderer;
  };

  /* Baked-looking contact shadow under a footprint (cheap ambient occlusion on the bench). */
  EC.contactShadow = function (x0, x1, z0, z1, y, pad, opacity) {
    const w = x1 - x0 + pad * 2, d = z1 - z0 + pad * 2;
    const mat = EC.mats.contact.clone();
    mat.opacity = opacity === undefined ? 0.5 : opacity;
    const m = new T.Mesh(new T.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set((x0 + x1) / 2, y + 0.02, (z0 + z1) / 2);
    m.renderOrder = 1;
    EC.scene.add(m);
    return m;
  };
})();
