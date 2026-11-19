/* The inset: a dive into the wax of the mold in focus. Chains wriggle while it is molten; below
   the melting point plates nucleate and grow until they impinge. It is a pure function of the
   simulated solid fraction and temperature at a probe point, drawn exaggerated on purpose. */
(function () {
  'use strict';
  const EC = window.EC;
  const U = EC.U;
  const C = (EC.crystal = { vis: 0, phi: 0, temp: 62 });
  let el, cv, g, S = 300;
  let crystals = [], chains = [], seedFine = -1, acc = 0;
  const home = { x: 0, y: 0, size: 132 }, scr = { x: 0, y: 0 };
  let px = 0, py = 0, ps = 0.2, shownFor = null;

  function build(fineness) {
    const r = U.rng(1234 + Math.round(fineness * 7));
    const n = Math.round(9 + fineness * 30);
    crystals = [];
    for (let i = 0; i < n; i++) {
      const a = r() * 6.283, rad = Math.sqrt(r()) * 0.98;
      crystals.push({
        x: 0.5 + Math.cos(a) * rad * 0.5, y: 0.5 + Math.sin(a) * rad * 0.5,
        rot: r() * Math.PI, birth: r() * 0.62, len: (0.5 + r() * 0.6) / Math.sqrt(n / 9), asp: 0.16 + r() * 0.26,
      });
    }
    crystals.sort(function (a, b) { return a.birth - b.birth; });
    seedFine = fineness;
  }

  function buildChains() {
    const r = U.rng(99);
    chains = [];
    for (let i = 0; i < 46; i++) chains.push({ x: r(), y: r(), a: r() * 6.283, ph: r() * 6.283, n: 5 + Math.floor(r() * 4), sp: 0.5 + r() });
  }

  function draw(time) {
    const phi = C.phi, temp = C.temp;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, S, S);
    g.save();
    g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 6.2832); g.clip();
    // melt: dark, with a milky veil growing as it sets
    const bg = g.createRadialGradient(S * 0.42, S * 0.4, S * 0.05, S / 2, S / 2, S * 0.6);
    const v = Math.round(18 + 44 * phi * phi);
    bg.addColorStop(0, 'rgb(' + (v + 16) + ',' + (v + 16) + ',' + (v + 17) + ')');
    bg.addColorStop(1, 'rgb(' + v * 0.55 + ',' + v * 0.55 + ',' + v * 0.6 + ')');
    g.fillStyle = bg; g.fillRect(0, 0, S, S);

    // wriggling paraffin chains (liquid). Hotter = livelier; they vanish as crystals take them.
    const agit = U.clamp((temp - 30) / 32, 0.15, 1.2);
    g.lineCap = 'round'; g.lineJoin = 'round';
    const liq = 1 - phi;
    g.strokeStyle = 'rgba(255,255,255,' + (0.34 * liq + 0.03).toFixed(3) + ')';
    g.lineWidth = S * 0.007;
    const nShow = Math.round(chains.length * (0.15 + 0.85 * liq));
    for (let i = 0; i < nShow; i++) {
      const c = chains[i];
      const t = time * c.sp * agit;
      let x = (c.x + Math.sin(t * 0.7 + c.ph) * 0.05 * agit + 1) % 1, y = (c.y + Math.cos(t * 0.6 + c.ph * 1.3) * 0.05 * agit + 1) % 1;
      let a = c.a + Math.sin(t * 0.9 + c.ph) * 0.8;
      g.beginPath();
      g.moveTo(x * S, y * S);
      for (let k = 0; k < c.n; k++) {
        a += Math.sin(t * 2.3 + k * 1.7 + c.ph) * 0.9 * agit + (k % 2 ? 0.55 : -0.55);
        x += Math.cos(a) * 0.022; y += Math.sin(a) * 0.022;
        g.lineTo(x * S, y * S);
      }
      g.stroke();
    }

    // plate crystals: lamellae of straightened, stacked chains
    for (let i = 0; i < crystals.length; i++) {
      const c = crystals[i];
      if (phi <= c.birth * 0.9) continue;
      const k = U.sat((phi - c.birth * 0.9) / (1 - c.birth * 0.9));
      const grow = Math.pow(k, 0.55);
      const L = c.len * grow * S * 0.5, Wd = L * c.asp * (0.5 + 0.5 * grow);
      g.save();
      g.translate(c.x * S, c.y * S); g.rotate(c.rot);
      g.beginPath();
      g.moveTo(-L, 0); g.lineTo(-L * 0.62, -Wd); g.lineTo(L * 0.62, -Wd); g.lineTo(L, 0); g.lineTo(L * 0.62, Wd); g.lineTo(-L * 0.62, Wd); g.closePath();
      g.fillStyle = 'rgba(255,255,255,' + (0.1 + 0.1 * grow).toFixed(3) + ')';
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,' + (0.55 + 0.35 * grow).toFixed(3) + ')';
      g.lineWidth = S * 0.0055;
      g.stroke();
      // lamella lines
      g.strokeStyle = 'rgba(255,255,255,0.26)';
      g.lineWidth = S * 0.003;
      g.beginPath();
      const nl = 3;
      for (let q = -nl; q <= nl; q++) {
        if (q === 0) continue;
        const yy = (q / (nl + 1)) * Wd, xx = L * (1 - 0.38 * Math.abs(q) / (nl + 1)) * 0.9;
        g.moveTo(-xx, yy); g.lineTo(xx, yy);
      }
      g.stroke();
      // a bright growing tip while it is still advancing
      if (k < 0.98 && k > 0.02) { g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(L, 0, S * 0.008, 0, 6.3); g.arc(-L, 0, S * 0.008, 0, 6.3); g.fill(); }
      g.restore();
    }
    // vignette
    const vg = g.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.5);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    g.fillStyle = vg; g.fillRect(0, 0, S, S);
    g.restore();

    // caption and probe temperature
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '600 ' + Math.round(S * 0.088) + 'px -apple-system, "Hiragino Sans", "Yu Gothic UI", "Noto Sans JP", "IPAGothic", sans-serif';
    g.fillText('誇張表示', S / 2, S * 0.845);
    g.font = '500 ' + Math.round(S * 0.105) + 'px -apple-system, "Helvetica Neue", Arial, sans-serif';
    g.fillText(Math.round(temp) + '°C', S / 2, S * 0.16);
  }

  EC.initCrystal = function () {
    el = document.getElementById('inset');
    cv = document.getElementById('insetc');
    g = cv.getContext('2d');
    S = cv.width;
    build(0.5); buildChains();
    function place() {
      const small = window.innerWidth <= 560 || window.innerHeight <= 460;
      home.size = small ? 104 : 132;
      home.x = 14 + home.size / 2;
      home.y = window.innerHeight - 14 - home.size / 2;
    }
    place();
    EC.on('resize', place);
    const leaderEl = document.createElement('div');
    leaderEl.style.cssText = 'position:absolute;left:0;top:0;height:1px;background:rgba(255,255,255,.6);transform-origin:0 50%;opacity:0;will-change:transform';
    el.parentNode.insertBefore(leaderEl, el);
    const wp = new window.THREE.Vector3();

    EC.updaters.push(function (dt, time) {
      const m = EC.state.play ? EC.sim.focus : null;
      const f = m && m.fill && m.fill.vol > 0.3 ? m.fill : null;
      C.vis = U.damp(C.vis, f ? 1 : 0, f ? 5 : 8, dt);
      if (C.vis < 0.01) { if (el.style.opacity !== '0') { el.style.opacity = '0'; leaderEl.style.opacity = '0'; } shownFor = null; return; }
      if (f) {
        C.phi = U.damp(C.phi, f.fProbe > 0.985 ? 1 : f.fProbe, 10, dt); C.temp = f.tProbe;
        // nucleation density is set by how fast it was cooling when it started to freeze
        if (C.phi < 0.03 && Math.abs(f.fineness - seedFine) > 0.12) build(f.fineness);
        m.obj.getWorldPosition(wp); wp.y += 0.9;
        EC.toScreen(wp, scr);
        if (shownFor !== m) { shownFor = m; px = scr.x; py = scr.y; ps = 0.12; }
      }
      // it grows out of the wax and settles in the corner
      const k = 1 - Math.exp(-5 * dt);
      px += (home.x - px) * k; py += (home.y - py) * k; ps += (1 - ps) * k;
      el.style.opacity = C.vis.toFixed(3);
      el.style.transform = 'translate3d(' + (px - home.size / 2).toFixed(1) + 'px,' + (py - home.size / 2).toFixed(1) + 'px,0) scale(' + ps.toFixed(3) + ')';
      // thin lead from the lens to the wax it shows
      const dx = scr.x - px, dy = scr.y - py, d = Math.hypot(dx, dy), r = (home.size / 2) * ps;
      if (d > r + 6) {
        leaderEl.style.opacity = (C.vis * 0.9).toFixed(3);
        leaderEl.style.width = (d - r).toFixed(1) + 'px';
        leaderEl.style.transform = 'translate3d(' + (px + (dx / d) * r).toFixed(1) + 'px,' + (py + (dy / d) * r).toFixed(1) + 'px,0) rotate(' + Math.atan2(dy, dx).toFixed(4) + 'rad)';
      } else leaderEl.style.opacity = '0';
      acc += dt;
      if (acc > 1 / 30) { acc = 0; draw(time); }
    });
  };
})();
