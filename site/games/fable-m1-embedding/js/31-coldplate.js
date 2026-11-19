/* Separate cold plate module that sits to the right of the embedding centre. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;

  EC.buildColdPlate = function () {
    const D = EC.D.cold, M = EC.mats, G = EC.geom, R = EC.rig;
    const root = new T.Group();
    EC.scene.add(root);
    EC.coldUnit = root;
    const cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2, w = D.x1 - D.x0, d = D.z1 - D.z0;

    const body = new T.Group();
    root.add(body);
    EC.definePart(body, 'コールドプレート', 0, 0, 0);
    let B = new G.Builder(body);
    // shell: side profile with a slanted control strip at the front
    const prof = [[D.z0, 1, 0.6], [D.z0, D.topY], [D.z1 - 4.6, D.topY], [D.z1, D.topY - 4.2], [D.z1, 1, 0.6]];
    B.add(M.paint, G.prism(prof, D.x0, D.x1, 1.2));
    [[D.x0 + 3.5, D.z0 + 4], [D.x1 - 3.5, D.z0 + 4], [D.x0 + 3.5, D.z1 - 4], [D.x1 - 3.5, D.z1 - 4]].forEach(function (p) { B.cyl(M.rubber, 1.6, 1.4, 1.0, p[0], 0.5, p[1]); });
    // trim frame around the plate
    const p = D.plate, pw = p.x1 - p.x0, pd = p.z1 - p.z0, pcx = (p.x0 + p.x1) / 2, pcz = (p.z0 + p.z1) / 2;
    B.box(M.paintDark, pw + 1.6, 0.3, pd + 1.6, pcx, D.topY + 0.1, pcz, 0.12);
    B.done();
    const vm = M.vents;
    const v1 = new T.Mesh(new T.PlaneGeometry(16, 7.5), vm); v1.position.set(D.x1 + 0.02, 6.6, cz - 2); v1.rotation.y = Math.PI / 2; v1.renderOrder = 2; body.add(v1);
    const v2 = new T.Mesh(new T.PlaneGeometry(16, 7.5), vm); v2.position.set(D.x0 - 0.02, 6.6, cz - 2); v2.rotation.y = -Math.PI / 2; v2.renderOrder = 2; body.add(v2);

    // control strip (slanted face)
    const fas = new T.Group();
    const slope = Math.atan2(4.2, 4.6);
    fas.position.set(cx, D.topY - 2.1, D.z1 - 2.3);
    fas.rotation.x = slope;
    body.add(fas);
    B = new G.Builder(fas);
    B.box(M.paintDark, w - 4, 0.16, 4.6, 0, 0.03, 0, 0.06);
    B.box(M.plasticBlack, 2.6, 0.5, 1.6, 9.5, 0.2, 0, 0.12);
    B.box(M.plasticGray, 2.0, 0.34, 1.1, 9.5, 0.44, 0, 0.1, 0, 0, 0.09);
    B.done();
    const led = new T.Mesh(new T.BoxGeometry(0.65, 0.1, 0.45), M.ledGreen); led.position.set(9.95, 0.68, 0); led.rotation.z = 0.09; fas.add(led);
    R.ledCold = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.12, 12), M.ledBlue.clone()); R.ledCold.position.set(-10.6, 0.14, 0); fas.add(R.ledCold);
    const ic = new T.Mesh(new T.PlaneGeometry(1.0, 1.0), M.icon(5, 0xdfe6ea, 0.8)); ic.rotation.x = -Math.PI / 2; ic.position.set(-8.9, 0.13, 0); ic.renderOrder = 2; fas.add(ic);

    const disp = new T.Group();
    fas.add(disp);
    EC.definePart(disp, '温度表示', 0, 1.6, 0);
    B = new G.Builder(disp);
    B.box(M.plasticBlack, 8.6, 0.3, 3.5, -2, 0.16, 0, 0.12);
    B.done();
    R.coldDisplay = EC.makeColdDisplay();
    const scr = new T.Mesh(new T.PlaneGeometry(7.6, 2.85), new T.MeshBasicMaterial({ map: R.coldDisplay.tex, color: new T.Color(1.5, 1.5, 1.5) }));
    scr.rotation.x = -Math.PI / 2; scr.position.set(-2, 0.33, 0);
    disp.add(scr);
    const gl = new T.Mesh(new T.PlaneGeometry(8.2, 3.2), M.glassClear); gl.rotation.x = -Math.PI / 2; gl.position.set(-2, 0.35, 0); gl.renderOrder = 4;
    disp.add(gl);
    R.coldDisplay.draw(-5);

    // the plate
    const plate = new T.Group();
    root.add(plate);
    EC.definePart(plate, '冷却プレート', 0, 3.2, 0);
    ['map', 'roughnessMap'].forEach(function (k) { const t = M.coldTop[k]; t.repeat.set(1 / pw, 1 / pd); t.offset.set(0.5, 0.5); });
    const pm = new T.Mesh(G.rbox(pw, 0.7, pd, 0.2, 3), M.coldTop);
    pm.position.set(pcx, p.y - 0.35, pcz);
    pm.castShadow = pm.receiveShadow = true;
    plate.add(pm);
    R.coldMesh = pm;
    R.coldGroup = plate;

    EC.contactShadow(D.x0, D.x1, D.z0, D.z1, 0, 6, 0.6);
  };
})();
