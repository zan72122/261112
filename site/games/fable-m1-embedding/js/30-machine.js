/* The embedding centre itself: body shell, wax reservoir, dispenser head, heated work surface,
   warm chamber, forceps wells, display, work light and foot switch. Every named sub-assembly is a
   "part" (THREE.Group with userData.part) that can be clicked for a label / small explode. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;

  EC.parts = [];
  EC.rig = {};

  EC.definePart = function (group, label, dx, dy, dz, extra) {
    const p = { group: group, label: label, dir: new T.Vector3(dx || 0, dy || 0, dz || 0), home: null, s: { x: 0, v: 0 }, target: 0 };
    if (extra) Object.assign(p, extra);
    group.userData.part = p;
    EC.parts.push(p);
    return p;
  };

  function part(parent, label, dx, dy, dz, extra) {
    const g = new T.Group();
    parent.add(g);
    EC.definePart(g, label, dx, dy, dz, extra);
    return g;
  }

  function plane(mat, w, h, x, y, z, rx, ry, rz, parent, order) {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.rotation.set(rx || 0, ry || 0, rz || 0);
    if (order) m.renderOrder = order;
    parent.add(m);
    return m;
  }

  // ---------- seven-segment drawing for the in-world displays ----------
  const SEG = {
    '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc',
    '7': 'abc', '8': 'abcdefg', '9': 'abfgcd', '-': 'g', ' ': '', 'C': 'afed', 'E': 'afged', 'L': 'fed',
  };
  function seg7(g, x, y, w, h, ch, on, off) {
    const t = Math.max(2, w * 0.17), hh = h / 2;
    const segs = {
      a: [x + t * 0.6, y, w - t * 1.2, t, 0], d: [x + t * 0.6, y + h - t, w - t * 1.2, t, 0], g: [x + t * 0.6, y + hh - t / 2, w - t * 1.2, t, 0],
      f: [x, y + t * 0.6, t, hh - t * 0.9, 1], b: [x + w - t, y + t * 0.6, t, hh - t * 0.9, 1],
      e: [x, y + hh + t * 0.3, t, hh - t * 0.9, 1], c: [x + w - t, y + hh + t * 0.3, t, hh - t * 0.9, 1],
    };
    const lit = SEG[ch] === undefined ? '' : SEG[ch];
    for (const k in segs) {
      const s = segs[k], isOn = lit.indexOf(k) >= 0;
      if (!isOn && !off) continue;
      g.fillStyle = isOn ? on : off;
      g.beginPath();
      if (s[4] === 0) {
        const m = s[3] / 2;
        g.moveTo(s[0], s[1] + m); g.lineTo(s[0] + m, s[1]); g.lineTo(s[0] + s[2] - m, s[1]); g.lineTo(s[0] + s[2], s[1] + m);
        g.lineTo(s[0] + s[2] - m, s[1] + s[3]); g.lineTo(s[0] + m, s[1] + s[3]);
      } else {
        const m = s[2] / 2;
        g.moveTo(s[0] + m, s[1]); g.lineTo(s[0] + s[2], s[1] + m); g.lineTo(s[0] + s[2], s[1] + s[3] - m); g.lineTo(s[0] + m, s[1] + s[3]);
        g.lineTo(s[0], s[1] + s[3] - m); g.lineTo(s[0], s[1] + m);
      }
      g.closePath(); g.fill();
    }
  }
  /* value like 62.0 or -5.0 drawn right-aligned in a field of `n` digits (one decimal). */
  function readout(g, x, y, w, h, value, on, off) {
    const neg = value < 0;
    const v = Math.round(Math.abs(value) * 10);
    const frac = v % 10, whole = Math.floor(v / 10);
    const chars = [whole >= 10 ? String(Math.floor(whole / 10) % 10) : (neg ? '-' : ' '), String(whole % 10), String(frac)];
    if (neg && whole >= 10) chars[0] = String(Math.floor(whole / 10) % 10);
    const gap = w * 0.32;
    let cx = x;
    if (neg && whole < 10) { /* minus already in slot 0 */ }
    for (let i = 0; i < 3; i++) {
      seg7(g, cx, y, w, h, chars[i], on, off);
      cx += w + gap;
      if (i === 1) { g.fillStyle = on; g.fillRect(cx - gap * 0.72, y + h - w * 0.17, w * 0.17, w * 0.17); }
    }
    // degree + C
    g.strokeStyle = on; g.lineWidth = Math.max(2, w * 0.1);
    g.beginPath(); g.arc(cx + w * 0.12, y + w * 0.2, w * 0.14, 0, 6.3); g.stroke();
    seg7(g, cx + w * 0.42, y + h * 0.12, w * 0.62, h * 0.88, 'C', on, null);
    return cx + w * 1.2;
  }
  EC.seg7 = { seg7: seg7, readout: readout };

  function drawPicto(g, kind, x, y, s, col) {
    g.save(); g.translate(x, y); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = s * 0.09; g.lineCap = 'round'; g.lineJoin = 'round';
    if (kind === 'tank') {
      g.beginPath(); g.moveTo(0, s * 0.15); g.lineTo(0, s * 0.85); g.lineTo(s, s * 0.85); g.lineTo(s, s * 0.15); g.stroke();
      g.globalAlpha = 0.55; g.fillRect(s * 0.1, s * 0.45, s * 0.8, s * 0.32); g.globalAlpha = 1;
    } else if (kind === 'plate') {
      g.beginPath(); g.moveTo(0, s * 0.82); g.lineTo(s, s * 0.82); g.stroke();
      for (let k = 0; k < 3; k++) { const xx = s * (0.22 + k * 0.28); g.beginPath(); g.moveTo(xx, s * 0.64); g.bezierCurveTo(xx - s * 0.14, s * 0.46, xx + s * 0.14, s * 0.34, xx, s * 0.14); g.stroke(); }
    } else if (kind === 'box') {
      g.strokeRect(s * 0.06, s * 0.3, s * 0.88, s * 0.55);
      g.beginPath(); g.moveTo(s * 0.02, s * 0.3); g.lineTo(s * 0.98, s * 0.3); g.moveTo(s * 0.4, s * 0.17); g.lineTo(s * 0.6, s * 0.17); g.stroke();
    } else if (kind === 'snow') {
      for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; g.beginPath(); g.moveTo(s / 2 + Math.cos(a) * s * 0.42, s / 2 + Math.sin(a) * s * 0.42); g.lineTo(s / 2 - Math.cos(a) * s * 0.42, s / 2 - Math.sin(a) * s * 0.42); g.stroke(); }
    }
    g.restore();
  }

  /* Main display: reservoir / work surface / chamber temperatures plus a level bar. */
  function makeDisplay() {
    const c = EC.tex.canvas(512, 224), g = c.getContext('2d');
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
    const on = '#dff6ff', dim = 'rgba(120,170,190,0.09)';
    const d = { canvas: c, tex: tex, last: '' };
    d.draw = function (s) {
      const key = [s.tank.toFixed(1), s.plate.toFixed(1), s.chamber.toFixed(1), Math.round(s.level * 20), s.heat ? 1 : 0, s.flow ? 1 : 0].join('|');
      if (key === d.last) return;
      d.last = key;
      g.fillStyle = '#04080b'; g.fillRect(0, 0, 512, 224);
      const gr = g.createLinearGradient(0, 0, 0, 224);
      gr.addColorStop(0, 'rgba(40,80,100,0.20)'); gr.addColorStop(1, 'rgba(10,30,40,0.05)');
      g.fillStyle = gr; g.fillRect(0, 0, 512, 224);
      drawPicto(g, 'tank', 22, 26, 44, on);
      readout(g, 84, 22, 46, 92, s.tank, on, dim);
      drawPicto(g, 'plate', 330, 20, 30, on);
      readout(g, 372, 22, 19, 38, s.plate, on, dim);
      drawPicto(g, 'box', 330, 76, 30, on);
      readout(g, 372, 78, 19, 38, s.chamber, on, dim);
      // level bar
      g.strokeStyle = 'rgba(223,246,255,0.7)'; g.lineWidth = 2;
      g.strokeRect(24, 150, 464, 44);
      const n = 20, lit = Math.round(s.level * n);
      for (let i = 0; i < n; i++) {
        g.fillStyle = i < lit ? (lit <= 2 ? '#ffb347' : on) : 'rgba(120,170,190,0.10)';
        g.fillRect(31 + i * 22.6, 157, 18, 30);
      }
      // status pips
      g.fillStyle = s.heat ? '#ffb347' : 'rgba(255,180,70,0.15)';
      g.beginPath(); g.arc(36, 100, 8, 0, 6.3); g.fill();
      g.fillStyle = s.flow ? on : 'rgba(223,246,255,0.12)';
      g.beginPath(); g.moveTo(36, 118); g.bezierCurveTo(47, 132, 45, 142, 36, 142); g.bezierCurveTo(27, 142, 25, 132, 36, 118); g.fill();
      tex.needsUpdate = true;
    };
    return d;
  }

  EC.makeColdDisplay = function () {
    const c = EC.tex.canvas(256, 96), g = c.getContext('2d');
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    const on = '#bfeaff', dim = 'rgba(120,170,200,0.09)';
    const d = { canvas: c, tex: tex, last: '' };
    d.draw = function (t) {
      const key = t.toFixed(1);
      if (key === d.last) return;
      d.last = key;
      g.fillStyle = '#03070b'; g.fillRect(0, 0, 256, 96);
      drawPicto(g, 'snow', 14, 26, 40, on);
      readout(g, 74, 18, 30, 60, t, on, dim);
      tex.needsUpdate = true;
    };
    return d;
  };

  EC.buildMachine = function () {
    const D = EC.D, M = EC.mats, G = EC.geom, R = EC.rig;
    const root = new T.Group();
    EC.scene.add(root);
    EC.machine = root;
    let B;

    // ================= body shell =================
    const body = part(root, '本体', 0, 0, 0);
    B = new G.Builder(body);
    const prof = [[-30, 1], [-30, 34], [2, 34], [2, 11, 0.45], [23, 11], [28, 6.4], [28, 1, 0.6]];
    prof[0][2] = 0.6;
    B.add(M.paint, G.prism(prof, D.unit.x0, D.unit.x1, 1.3, { skip: [1, 3] }));
    // tower top with the reservoir opening, deck with the chamber opening
    const tk = D.tank, ch = D.chamber;
    B.add(M.paint, G.deckWithHoles(-30, 30, -30 + 1.3, 2 - 1.3, 34, [{ x0: tk.x0, x1: tk.x1, z0: tk.z0, z1: tk.z1, r: 2 }]));
    const tFas = 1.3 / Math.tan((Math.PI - Math.atan2(4.6, 5)) / 2);
    B.add(M.paint, G.deckWithHoles(-30, 30, 2 + 0.45, 23 - tFas, 11, [{ x0: ch.x0, x1: ch.x1, z0: ch.z0, z1: ch.z1, r: 1 }]));
    // dark front fascia on the tower, gutter under the work plate, seams
    B.box(M.paintDark, 54.5, 19.4, 0.5, 0, 22.9, 2.05, 0.18);
    B.box(M.cavity, 25.3, 0.2, 19.3, 0, 11.0, 12.5, 0);
    B.box(M.cavity, 0.06, 0.14, 57, -30.0, 11.2, -1, 0);
    B.box(M.cavity, 0.06, 0.14, 57, 30.0, 11.2, -1, 0);
    B.box(M.cavity, 20.6, 4.0, 0.04, 0, 3.5, 28.0, 0);
    // feet
    [[-26, -25], [26, -25], [-26, 23], [26, 23]].forEach(function (p) { B.cyl(M.rubber, 1.7, 1.5, 1.0, p[0], 0.5, p[1]); });
    // screws on the dark fascia
    [[-26.2, 31.6], [26.2, 31.6], [-26.2, 14.2], [26.2, 14.2]].forEach(function (p) { B.cyl(M.steelSatin, 0.28, 0.28, 0.12, p[0], p[1], 2.33, Math.PI / 2, 0, 0, 10); });
    B.done();
    // side louvres
    plane(M.vents, 18, 14, -30.02, 23, -14, 0, -Math.PI / 2, 0, body, 2);
    plane(M.vents, 18, 14, 30.02, 23, -14, 0, Math.PI / 2, 0, body, 2);
    plane(M.icon(7, 0xffffff, 1), 1.9, 1.9, 13.9, 11.03, 5.4, -Math.PI / 2, 0, 0, body, 2);
    plane(M.icon(7, 0xffffff, 1), 1.9, 1.9, -13.6, 11.03, 20.6, -Math.PI / 2, 0, 0, body, 2);

    // slanted control fascia at the front edge
    const fas = new T.Group();
    const slope = Math.atan2(4.6, 5);
    fas.position.set(0, 8.7, 25.5);
    fas.rotation.x = slope;
    body.add(fas);
    B = new G.Builder(fas);
    B.box(M.paintDark, 55, 0.16, 4.3, 0, 0.02, 0, 0.06);
    B.box(M.plasticBlack, 2.8, 0.5, 1.7, 23, 0.2, 0, 0.12);
    [-24.5, -22.3].forEach(function (x) { B.cyl(M.plasticBlack, 0.36, 0.36, 0.2, x, 0.12, 0.2, 0, 0, 0, 12); });
    B.done();
    const sw = part(fas, '電源スイッチ', 0, 1.2, 0);
    B = new G.Builder(sw);
    B.box(M.plasticGray, 2.2, 0.36, 1.2, 23, 0.44, 0, 0.1, 0, 0, 0.09);
    B.done();
    const swLed = new T.Mesh(new T.BoxGeometry(0.7, 0.1, 0.5), M.ledGreen);
    swLed.position.set(23.5, 0.68, 0); swLed.rotation.z = 0.09;
    sw.add(swLed);
    R.ledPower = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.12, 12), M.ledGreen);
    R.ledPower.position.set(-24.5, 0.25, 0.2); fas.add(R.ledPower);
    R.ledHeat = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.12, 12), M.ledAmber.clone());
    R.ledHeat.position.set(-22.3, 0.25, 0.2); fas.add(R.ledHeat);
    plane(M.icon(2, 0xdfe6ea, 0.8), 1.0, 1.0, -24.5, 0.12, -1.1, -Math.PI / 2, 0, 0, fas, 2);
    plane(M.icon(3, 0xdfe6ea, 0.8), 1.0, 1.0, -22.3, 0.12, -1.1, -Math.PI / 2, 0, 0, fas, 2);

    // waste wax tray (drawer)
    const tray = part(root, '廃ワックストレイ', 0, 0, 7.5);
    B = new G.Builder(tray);
    B.box(M.steelFine, 20.4, 3.8, 0.5, 0, 3.5, 28.2, 0.14);
    B.box(M.cavity, 9.4, 0.9, 0.2, 0, 4.4, 28.38, 0.1);
    B.box(M.steelPolish, 9.8, 0.26, 0.6, 0, 4.92, 28.5, 0.1);
    B.add(M.steelSatin, G.loft([
      { y: 1.9, hx: 9.7, hz: 8.2, r: 0.6 }, { y: 5.0, hx: 9.8, hz: 8.3, r: 0.6 }, { y: 5.0, hx: 9.6, hz: 8.1, r: 0.5, sharp: true }, { y: 2.1, hx: 9.5, hz: 8.0, r: 0.5 },
    ], { capBottom: true, capTop: true }), 0, 0, 19.7);
    B.done();

    // ================= reservoir =================
    const tzc = (tk.z0 + tk.z1) / 2, thx = (tk.x1 - tk.x0) / 2, thz = (tk.z1 - tk.z0) / 2;
    const tank = part(root, 'パラフィン槽', 0, 6, 0);
    B = new G.Builder(tank);
    B.add(M.steelSatin, G.loft([
      { y: 21.0, hx: thx - 0.5, hz: thz - 0.5, r: 2 }, { y: 34.0, hx: thx + 0.1, hz: thz + 0.1, r: 2.1 }, { y: 34.0, hx: thx + 0.8, hz: thz + 0.8, r: 2.6, sharp: true },
      { y: 34.5, hx: thx + 0.8, hz: thz + 0.8, r: 2.6, sharp: true }, { y: 34.5, hx: thx - 0.05, hz: thz - 0.05, r: 2, sharp: true }, { y: 21.4, hx: thx - 0.7, hz: thz - 0.7, r: 1.8 },
    ], { capBottom: true, capTop: true, k: 5 }), 0, 0, tzc);
    B.done();
    R.tankWax = new T.Mesh(G.loft([{ y: 0, hx: thx - 0.3, hz: thz - 0.3, r: 1.9 }], { capTop: true, k: 5 }), M.tankWax);
    R.tankWax.position.set(0, 27, tzc);
    R.tankWax.renderOrder = 3;
    tank.add(R.tankWax);
    R.tankGroup = tank;

    const lid = part(tank, '槽のふた', 0, 4, 0);
    const lidPivot = new T.Group();
    lidPivot.position.set(0, 34.82, tk.z0 - 1.3);
    lid.add(lidPivot);
    B = new G.Builder(lidPivot);
    const lw = thx * 2 + 2.6, ld = thz * 2 + 2.9;
    B.box(M.steel, lw, 0.5, ld, 0, 0.02, ld / 2 + 0.1, 0.22);
    B.box(M.steel, lw, 0.9, 0.3, 0, -0.3, ld + 0.05, 0.12);
    B.cyl(M.plasticBlack, 0.55, 0.7, 0.7, 0, 0.6, ld - 4.2);
    B.add(M.plasticBlack, new T.LatheGeometry([new T.Vector2(0, 1.5), new T.Vector2(1.2, 1.45), new T.Vector2(1.65, 1.1), new T.Vector2(1.6, 0.7), new T.Vector2(0.9, 0.3), new T.Vector2(0.55, 0.3)].reverse(), 24), 0, 0.62, ld - 4.2);
    [-9, 9].forEach(function (x) { B.cyl(M.steelPolish, 0.42, 0.42, 4.4, x, 0, 0, 0, 0, Math.PI / 2, 14); });
    B.done();
    R.lidTank = lidPivot;

    // ================= level window =================
    const lv = part(root, '液面窓', 0, 0, 2.6);
    B = new G.Builder(lv);
    B.box(M.steelFine, 3.7, 16.2, 0.5, -21.5, 23.5, 2.45, 0.2);
    B.box(M.glassDark, 2.1, 14.6, 0.24, -21.5, 23.5, 2.62, 0.05);
    B.done();
    R.levelCol = new T.Mesh(new T.BoxGeometry(1.5, 1, 0.1), M.amber);
    R.levelCol.position.set(-21.5, 16.4, 2.78);
    lv.add(R.levelCol);
    plane(M.glassClear, 2.1, 14.6, -21.5, 23.5, 2.86, 0, 0, 0, lv, 4);
    plane(M.ticks, 1.1, 13.9, -18.9, 23.4, 2.32, 0, 0, 0, lv, 2);
    R.levelY0 = 16.4; R.levelH = 14.0;

    // ================= display =================
    const disp = part(root, '温度表示', 0, 0, 2.6);
    B = new G.Builder(disp);
    B.box(M.plasticBlack, 16.8, 10.2, 0.6, 17.5, 25.2, 2.45, 0.25);
    [12.4, 15.8, 19.2, 22.6].forEach(function (x) { B.box(M.keypad, 2.5, 1.5, 0.16, x, 21.5, 2.74, 0.07); });
    B.done();
    R.display = makeDisplay();
    const scr = plane(new T.MeshBasicMaterial({ map: R.display.tex, color: new T.Color(1.5, 1.5, 1.5) }), 14.8, 6.5, 17.5, 26.3, 2.77, 0, 0, 0, disp);
    scr.material.toneMapped = true;
    plane(M.glassClear, 16.2, 9.6, 17.5, 25.2, 2.8, 0, 0, 0, disp, 4);
    [[12.4, 0], [15.8, 1], [19.2, 6], [22.6, 3]].forEach(function (p) { plane(M.icon(p[1], 0xdfe6ea, 0.75), 0.95, 0.95, p[0], 21.5, 2.84, 0, 0, 0, disp, 5); });

    // ================= dispenser head =================
    const hd = D.head;
    const head = part(root, 'ディスペンサー', 0, 0, 4.5);
    B = new G.Builder(head);
    B.box(M.paint, hd.x1 - hd.x0, hd.y1 - hd.y0, hd.z1 - hd.z0, 0, (hd.y0 + hd.y1) / 2, (hd.z0 + hd.z1) / 2, 0.9);
    B.box(M.paintDark, 8.4, 0.3, 10.2, 0, hd.y0 - 0.02, 7.7, 0.12);
    B.add(M.paintDark, G.loft([{ y: hd.y0 + 1.6, hx: 5.02, hz: 6.02, r: 0.92 }, { y: hd.y0 + 2.4, hx: 5.02, hz: 6.02, r: 0.92 }], { k: 5 }), 0, 0, (hd.z0 + hd.z1) / 2);
    [-1.5, 1.5].forEach(function (x) { B.box(M.steelSatin, 0.22, 0.9, 0.9, x, D.lever.pivotY + 0.05, D.lever.pivotZ, 0.05); });
    B.done();
    plane(M.icon(4, 0x7b8288, 0.9), 1.5, 1.5, 0, 25.4, hd.z1 + 0.02, 0, 0, 0, head, 2);
    R.flowLed = new T.Mesh(new T.CylinderGeometry(0.24, 0.24, 0.14, 12), M.ledOff.clone());
    R.flowLed.rotation.x = Math.PI / 2;
    R.flowLed.position.set(3.4, 22.25, hd.z1 + 0.04);
    head.add(R.flowLed);
    R.flowLedOn = M.ledAmber;
    R.flowLedOff = R.flowLed.material;

    const noz = part(head, '吐出ノズル', 0, -1.8, 0);
    B = new G.Builder(noz);
    const nz = D.nozzle;
    B.cyl(M.steelSatin, 0.9, 0.9, 0.55, nz.x, hd.y0 - 0.4, nz.z, 0, 0, 0, 6);
    B.add(M.steelPolish, new T.LatheGeometry([
      new T.Vector2(0.24, 0), new T.Vector2(0.34, 0.0), new T.Vector2(0.4, 0.15), new T.Vector2(0.55, 1.1), new T.Vector2(0.62, 1.2), new T.Vector2(0.62, 1.35),
    ], 20), nz.x, nz.y, nz.z);
    B.done();

    const lev = part(head, '吐出レバー', 0, 0, 3.2);
    const levPivot = new T.Group();
    levPivot.position.set(0, D.lever.pivotY, D.lever.pivotZ);
    lev.add(levPivot);
    B = new G.Builder(levPivot);
    B.cyl(M.steelPolish, 0.26, 0.26, 3.3, 0, 0, 0, 0, 0, Math.PI / 2, 12);
    B.box(M.steelFine, 1.9, 5.6, 0.14, 0, -2.8, 0, 0.05);
    B.box(M.steelFine, 3.7, 1.9, 0.16, 0, -6.25, 0.1, 0.07, -0.12, 0, 0);
    B.box(M.steelFine, 3.7, 0.5, 0.16, 0, -7.25, 0.32, 0.07, -0.55, 0, 0);
    B.done();
    R.lever = levPivot;

    const knob = part(head, '流量つまみ', 2.4, 0, 0);
    const knobSpin = new T.Group();
    knobSpin.position.set(hd.x1, 24.6, 9.2);
    knob.add(knobSpin);
    B = new G.Builder(knobSpin);
    B.cyl(M.plasticBlack, 1.45, 1.45, 0.3, 0.15, 0, 0, 0, 0, Math.PI / 2, 28);
    B.cyl(M.plasticBlack, 1.1, 1.2, 1.3, 0.9, 0, 0, 0, 0, Math.PI / 2, 14);
    B.box(M.plasticWhite, 0.06, 1.0, 0.16, 1.56, 0.55, 0, 0.02);
    B.done();
    R.knob = knobSpin;

    // ================= heated work surface =================
    const pl = D.plate, pw = pl.x1 - pl.x0, pd = pl.z1 - pl.z0, pcx = (pl.x0 + pl.x1) / 2, pcz = (pl.z0 + pl.z1) / 2;
    const plate = part(root, '加熱作業面', 0, 3.2, 0);
    ['map', 'roughnessMap', 'normalMap'].forEach(function (k) {
      const t = M.steelPlate[k];
      t.repeat.set(1 / pw, -1 / pd); t.offset.set(0.5, 0.5);
    });
    const plateMesh = new T.Mesh(G.rbox(pw, 0.6, pd, 0.18, 3), M.steelPlate);
    plateMesh.position.set(pcx, pl.y - 0.3, pcz);
    plateMesh.castShadow = plateMesh.receiveShadow = true;
    plate.add(plateMesh);
    R.plateMesh = plateMesh;

    const gr = D.grille, gcx = (gr.x0 + gr.x1) / 2, gcz = (gr.z0 + gr.z1) / 2, gw = gr.x1 - gr.x0, gd = gr.z1 - gr.z0;
    const grille = part(plate, 'ドレングリル', 0, 2.2, 0);
    B = new G.Builder(grille);
    B.box(M.cavity, gw, 0.04, gd, gcx, pl.y + 0.01, gcz, 0);
    B.box(M.steelPolish, gw + 0.5, 0.1, 0.22, gcx, pl.y + 0.05, gr.z0 - 0.1, 0.03);
    B.box(M.steelPolish, gw + 0.5, 0.1, 0.22, gcx, pl.y + 0.05, gr.z1 + 0.1, 0.03);
    B.box(M.steelPolish, 0.22, 0.1, gd + 0.4, gr.x0 - 0.12, pl.y + 0.05, gcz, 0.03);
    B.box(M.steelPolish, 0.22, 0.1, gd + 0.4, gr.x1 + 0.12, pl.y + 0.05, gcz, 0.03);
    for (let i = 0; i < 13; i++) B.box(M.steelPolish, 0.3, 0.14, gd, gr.x0 + 0.6 + i * ((gw - 1.2) / 12), pl.y + 0.06, gcz, 0.05);
    B.done();

    // ================= warm chamber =================
    const ccx = (ch.x0 + ch.x1) / 2, ccz = (ch.z0 + ch.z1) / 2, chx = (ch.x1 - ch.x0) / 2, chz = (ch.z1 - ch.z0) / 2;
    const chamber = part(root, '保温庫', 0, 4.5, 0);
    B = new G.Builder(chamber);
    B.add(M.steelSatin, G.loft([
      { y: ch.floorY - 0.2, hx: chx - 0.1, hz: chz - 0.1, r: 0.9 }, { y: D.deckY, hx: chx + 0.05, hz: chz + 0.05, r: 1.0 }, { y: D.deckY, hx: chx + 0.5, hz: chz + 0.5, r: 1.3, sharp: true },
      { y: ch.rimY, hx: chx + 0.5, hz: chz + 0.5, r: 1.3, sharp: true }, { y: ch.rimY, hx: chx - 0.08, hz: chz - 0.08, r: 0.9, sharp: true }, { y: ch.floorY, hx: chx - 0.25, hz: chz - 0.25, r: 0.8 },
    ], { capBottom: true, capTop: true }), ccx, 0, ccz);
    B.box(M.steelFine, chx * 2 - 0.7, 2.6, 0.12, ccx, ch.floorY + 1.3, ch.z0 + 8.9, 0.04);
    // cassette rack rails
    B.box(M.steelFine, 0.14, 1.5, 8.8, ccx - 2.25, ch.floorY + 0.75, ch.z1 - 4.9, 0.04);
    B.box(M.steelFine, 0.14, 1.5, 8.8, ccx + 2.25, ch.floorY + 0.75, ch.z1 - 4.9, 0.04);
    B.done();
    R.chamberGroup = chamber;

    const cl = part(chamber, '保温庫のふた', 0, 3.5, 0);
    const clPivot = new T.Group();
    clPivot.position.set(ch.x0 - 0.45, ch.rimY + 0.22, ccz);
    cl.add(clPivot);
    B = new G.Builder(clPivot);
    const clw = chx * 2 + 1.0, cld = chz * 2 + 0.9;
    B.box(M.glassSmoke, clw, 0.36, cld, clw / 2 + 0.05, 0.02, 0, 0.14);
    B.done({ cast: false });
    B = new G.Builder(clPivot);
    [-6, 6].forEach(function (z) { B.cyl(M.steelPolish, 0.36, 0.36, 3.2, 0, 0, z, Math.PI / 2, 0, 0, 12); });
    B.box(M.steelPolish, 0.5, 0.5, 8.4, clw - 1.0, 0.95, 0, 0.2);
    [-3.6, 3.6].forEach(function (z) { B.cyl(M.steelPolish, 0.2, 0.2, 0.8, clw - 1.0, 0.5, z, 0, 0, 0, 10); });
    B.box(M.steelFine, 0.7, 0.4, cld, clw - 0.3, 0.02, 0, 0.1);
    B.box(M.steelFine, 0.7, 0.4, cld, 0.4, 0.02, 0, 0.1);
    B.done();
    R.lidChamber = clPivot;

    // ================= forceps wells =================
    const we = D.wells, wcx = (we.x0 + we.x1) / 2, wcz = (we.z0 + we.z1) / 2;
    const wells = part(root, 'ピンセット保温穴', 0, 3.0, 0);
    B = new G.Builder(wells);
    B.box(M.steelFine, we.x1 - we.x0, we.topY - D.deckY, we.z1 - we.z0, wcx, (we.topY + D.deckY) / 2, wcz, 0.3);
    R.wellHoles = [];
    for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) {
      const hx = wcx - 4 + i * 4, hz = wcz - 1.45 + j * 2.9;
      B.cyl(M.cavity, 0.62, 0.62, 0.03, hx, we.topY + 0.005, hz, 0, 0, 0, 18);
      B.add(M.steelPolish, new T.TorusGeometry(0.68, 0.09, 8, 20), hx, we.topY + 0.01, hz, Math.PI / 2, 0, 0);
      R.wellHoles.push({ x: hx, z: hz, used: null });
    }
    B.done();
    R.wellsGroup = wells;
    plane(M.icon(3, 0x3a3f45, 0.8), 1.1, 1.1, wcx, we.topY + 0.012, wcz, -Math.PI / 2, 0, 0, wells, 2);

    // ================= chip dish =================
    const ds = D.dish;
    const dish = part(root, 'チップ皿', 0, 2.6, 0);
    B = new G.Builder(dish);
    B.add(M.plasticWhite, G.loft([
      { y: D.deckY, hx: ds.w / 2, hz: ds.d / 2, r: 1.1 }, { y: D.deckY + 0.95, hx: ds.w / 2 + 0.12, hz: ds.d / 2 + 0.12, r: 1.2 }, { y: D.deckY + 0.95, hx: ds.w / 2 - 0.1, hz: ds.d / 2 - 0.1, r: 1.0, sharp: true },
      { y: ds.floorY, hx: ds.w / 2 - 0.28, hz: ds.d / 2 - 0.28, r: 0.9 },
    ], { capBottom: true, capTop: true }), ds.x, 0, ds.z);
    B.done();
    R.dishGroup = dish;

    // ================= work light =================
    const lamp = part(root, '作業灯', 0, 3, 0);
    B = new G.Builder(lamp);
    const pts = [[25.5, 34, -3], [25.5, 39, -3], [24.4, 43.6, -0.5], [20.5, 45.4, 4.6], [15.6, 42.6, 9.4], [12.6, 38.2, 11.8]].map(function (p) { return new T.Vector3(p[0], p[1], p[2]); });
    const curve = new T.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    B.add(M.gunmetal, new T.TubeGeometry(curve, 44, 0.4, 10, false));
    for (let i = 3; i < 42; i++) {
      const cp = curve.getPointAt(i / 44), ct = curve.getTangentAt(i / 44);
      const qq = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), ct), ee = new T.Euler().setFromQuaternion(qq);
      B.add(M.gunmetal, new T.CylinderGeometry(0.47, 0.47, 0.2, 10), cp.x, cp.y, cp.z, ee.x, ee.y, ee.z);
    }
    B.cyl(M.plasticBlack, 1.4, 1.7, 1.2, 25.5, 34.6, -3);
    B.cyl(M.steelSatin, 0.7, 0.7, 0.7, 25.5, 35.4, -3);
    B.done();
    const end = pts[pts.length - 1];
    const aim = new T.Vector3(0, pl.y, 12.5);
    const dir = aim.clone().sub(end).normalize();
    const lampHead = new T.Group();
    lampHead.position.copy(end);
    lampHead.quaternion.setFromUnitVectors(new T.Vector3(0, -1, 0), dir);
    lamp.add(lampHead);
    const shade = new T.Mesh(new T.LatheGeometry([
      new T.Vector2(0.55, 0.9), new T.Vector2(0.7, 0.2), new T.Vector2(0.85, -0.4), new T.Vector2(1.85, -3.0), new T.Vector2(1.98, -3.7), new T.Vector2(1.8, -3.7), new T.Vector2(0.7, -0.9),
    ], 28), M.gunmetal);
    shade.castShadow = true;
    lampHead.add(shade);
    const lens = new T.Mesh(new T.CircleGeometry(1.7, 28), M.lens);
    lens.rotation.x = Math.PI / 2; lens.position.y = -3.2;
    lampHead.add(lens);
    const spot = new T.SpotLight(0xfff0dc, 620, 90, 0.5, 0.8, 2);
    spot.position.copy(end).addScaledVector(dir, 3.2);
    spot.target.position.copy(aim);
    lamp.add(spot, spot.target);
    R.spot = spot;

    // ================= foot switch =================
    const pdl = D.pedal;
    const foot = part(root, 'フットスイッチ', 0, 2.4, 0);
    const pedal = new T.Group();
    pedal.position.set(pdl.x, 0, pdl.z);
    pedal.rotation.y = pdl.yaw;
    foot.add(pedal);
    B = new G.Builder(pedal);
    B.box(M.plasticGray, 10.4, 1.5, 13.4, 0, 0.8, 0, 0.5);
    B.box(M.rubber, 10.0, 0.2, 13.0, 0, 0.1, 0, 0.05);
    B.cyl(M.steelSatin, 0.4, 0.4, 9.6, 0, 1.7, 5.7, 0, 0, Math.PI / 2, 12);
    B.cyl(M.plasticBlack, 0.55, 0.55, 1.6, 0, 0.9, -7.1, Math.PI / 2, 0, 0, 12);
    B.done();
    const treadle = new T.Group();
    treadle.position.set(0, 1.7, 5.7);
    treadle.rotation.x = 0.2;
    pedal.add(treadle);
    B = new G.Builder(treadle);
    B.box(M.plasticBlack, 9.2, 0.7, 12.0, 0, 0.3, -6.0, 0.3);
    B.box(M.rubberRib, 8.2, 0.16, 10.6, 0, 0.7, -6.0, 0.05);
    B.done();
    R.pedal = treadle;
    R.pedalGroup = pedal;
    // cable to the back of the unit
    const cs = Math.cos(pdl.yaw), sn = Math.sin(pdl.yaw);
    const px = pdl.x + sn * -7.8, pz = pdl.z + cs * -7.8;
    const cpts = [[px, 0.9, pz], [px - 2.2, 0.35, pz - 5], [-30.5, 0.35, 31.5], [-34.2, 0.35, 22], [-34, 0.35, 0], [-33.6, 0.35, -24], [-30, 0.35, -34], [-22, 0.35, -37]].map(function (p) { return new T.Vector3(p[0], p[1], p[2]); });
    const cable = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(cpts, false, 'catmullrom', 0.5), 80, 0.3, 8, false), M.rubber);
    cable.castShadow = true; cable.receiveShadow = true;
    foot.add(cable);

    // contact shadows
    EC.contactShadow(D.unit.x0, D.unit.x1, D.unit.z0, D.unit.z1, 0, 7, 0.62);
    EC.contactShadow(-27, 27, -1.5, 2.2, D.deckY + 0.004, 2.6, 0.42);
    EC.contactShadow(we.x0 + 0.4, we.x1 - 0.4, we.z0 + 0.4, we.z1 - 0.4, D.deckY + 0.004, 1.5, 0.4);
    EC.contactShadow(ds.x - ds.w / 2 + 0.6, ds.x + ds.w / 2 - 0.6, ds.z - ds.d / 2 + 0.6, ds.z + ds.d / 2 - 0.6, D.deckY + 0.004, 1.4, 0.32);
    EC.contactShadow(pl.x0 + 0.5, pl.x1 - 0.5, pl.z0 + 0.5, pl.z1 - 0.5, D.deckY + 0.006, 1.6, 0.4);
    R.pedalShadow = EC.contactShadow(pdl.x - 5, pdl.x + 5, pdl.z - 6.5, pdl.z + 6.5, 0, 3.5, 0.5);
    R.pedalShadow.rotation.z = pdl.yaw;

    // ---- rig state setters ----
    R.setLevel = function (f) {
      f = U.sat(f);
      const h = Math.max(0.02, f * R.levelH);
      R.levelCol.scale.y = h;
      R.levelCol.position.y = R.levelY0 + h / 2;
      R.tankWax.position.y = D.tank.y0 + f * (D.tank.y1 - D.tank.y0);
      R.tankWax.visible = f > 0.004;
    };
    R.setLevel(0.55);
    R.display.draw({ tank: 62, plate: 60, chamber: 60, level: 0.55, heat: false, flow: false });
  };
})();
