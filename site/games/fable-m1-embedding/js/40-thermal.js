/* Wax inside one base mold: volume/level bookkeeping, a small 2-D enthalpy (phase-change) heat
   solver over (distance-from-wall x height), shrinkage with a casting "pipe" (the dip), and the
   free-surface shape. Time is accelerated (stylised) but the mechanism is the real one:
   heat leaves through the steel floor and walls, the front moves inward and upward, liquid
   feeds the shrinkage until the surface skins over. */
(function () {
  'use strict';
  const EC = window.EC;
  const T = window.THREE;
  const U = EC.U;
  const MS = EC.moldShape, CS = EC.cassetteShape, K = EC.K;

  const ND = 10, NY = 14;
  const Y0 = MS.floorY, YTOP = 1.48, DY = (YTOP - Y0) / NY;
  const LAT = 95;          // latent heat / specific heat (degC-equivalent)
  const ALPHA = 0.03;      // stylised thermal diffusivity cm^2/s (real paraffin ~1.3e-3)
  const BETA = 0.15;       // volumetric shrinkage on freezing
  const TOP_K = 0.008;     // weak convective loss at the free surface
  const half = [0, 0];

  function tempOf(h) { return h < 0 ? K.Tm + h : h > LAT ? K.Tm + (h - LAT) : K.Tm; }
  function enthalpyOf(t) { return t >= K.Tm ? LAT + (t - K.Tm) : t - K.Tm; }

  function WaxFill(mold) {
    this.mold = mold;
    this.h = new Float32Array(ND * NY);
    this.f = new Float32Array(ND * NY);
    this.tmp = new Float32Array(ND * NY);
    this.data = new Uint8Array(ND * NY * 4);
    this.tex = new T.DataTexture(this.data, ND, NY, T.RGBAFormat, T.UnsignedByteType);
    this.tex.magFilter = this.tex.minFilter = T.LinearFilter;
    this.tex.needsUpdate = true;
    this.vol = 0;            // liquid-equivalent wax volume (mL)
    this.nAct = 0;
    this.level = Y0;         // mean top level (local y)
    this.liq = Y0;           // level of the still-liquid part of the surface
    this.col = new Float32Array(ND).fill(Y0);
    this.frozen = new Uint8Array(ND);
    this.front = new Float32Array(ND);   // solid height from the floor per column
    this.phi = 0;            // overall solid fraction
    this.tMean = K.Tres; this.tMax = K.Tres; this.tProbe = K.Tres; this.fProbe = 0;
    this.Tb = K.Tplate; this.Tt = K.Tplate;
    this.slosh = { x: 0, z: 0, vx: 0, vz: 0 };
    this.tiltX = 0; this.tiltZ = 0;       // frozen-in surface tilt
    this.ripple = 0; this.rx = 0; this.rz = 0;
    this.seam = -1;
    this.spilled = 0;
    this.coolRate = 0;       // d(phi)/dt, drives crackle + crystal fineness
    this.fineness = 0.5;
    this.asleep = false;
    this.q = { overflow: 0, seam: false, skinCrack: false, poured: 0 };
    this.dirty = true;
  }
  const P = WaxFill.prototype;
  WaxFill.ND = ND; WaxFill.NY = NY; WaxFill.Y0 = Y0; WaxFill.DY = DY; WaxFill.YTOP = YTOP;
  WaxFill.tempOf = tempOf;

  /* Free cross-section (cm^2) at local height y, minus the cassette's plastic when seated. */
  P.freeArea = function (y) {
    MS.half(Math.min(y, MS.rimY), half);
    let a = 4 * half[0] * half[1];
    const c = this.mold.cassette;
    if (c) {
      const yc = c.seatY;
      if (y >= yc && y <= yc + CS.h) a -= CS.solid * 4 * CS.hx * CS.hz;
    }
    return a;
  };
  P.topLimit = function () {
    const c = this.mold.cassette;
    return (c ? Math.max(MS.rimY, c.seatY + CS.h) : MS.rimY) + MS.dome;
  };
  P.levelFor = function (v) {
    const step = 0.02;
    let y = Y0, acc = 0;
    const lim = this.topLimit();
    while (y < lim) {
      const dv = this.freeArea(y + step * 0.5) * step;
      if (acc + dv >= v) return y + ((v - acc) / dv) * step;
      acc += dv; y += step;
    }
    return lim;
  };
  P.volumeTo = function (yTop) {
    const step = 0.02;
    let acc = 0;
    for (let y = Y0; y < yTop; y += step) acc += this.freeArea(y + step * 0.5) * Math.min(step, yTop - y);
    return acc;
  };
  P.capacity = function () { return this.volumeTo(this.topLimit()); };

  /* Add molten wax at temperature t (pouring). Returns the volume that did not fit. */
  P.pour = function (dv, t) {
    this.vol += dv;
    this.q.poured += dv;
    this.asleep = false;
    const hp = enthalpyOf(t);
    // the jet stirs the liquid: mix its heat into the still-molten cells
    let nl = 0;
    const n = this.nAct * ND;
    for (let i = 0; i < n; i++) if (this.f[i] < 0.5) nl++;
    if (nl > 0) {
      const k = Math.min(1, (dv / Math.max(0.3, this.vol)) * (n / nl));
      for (let i = 0; i < n; i++) if (this.f[i] < 0.5) this.h[i] += (hp - this.h[i]) * k;
    }
    this.pourH = hp;
    this.pouring = 0.25;
  };

  P.setSurface = function (zone) { this.zone = zone; this.asleep = false; };

  function ringWeights(hx, hz, out) {
    const d = Math.min(hx, hz) / ND;
    let sum = 0;
    for (let k = 0; k < ND; k++) {
      const a0 = (hx - k * d) * (hz - k * d), a1 = (hx - (k + 1) * d) * (hz - (k + 1) * d);
      out[k] = Math.max(1e-4, a0 - a1);
      sum += out[k];
    }
    for (let k = 0; k < ND; k++) out[k] /= sum;
  }
  const W = new Float32Array(ND);

  P.update = function (dt, env) {
    const m = this.mold;
    // ---- mold steel temperature (two lumped nodes: floor and rim) ----
    const z = this.zone || 'air';
    let ts = K.Tamb, tau = 30;
    if (z === 'plate') { ts = K.Tplate; tau = 1.2; }
    else if (z === 'cold') { ts = env.cold; tau = 1.1; }
    else if (z === 'chamber') { ts = K.Tchamber; tau = 3; }
    else if (z === 'deck') { ts = 36; tau = 12; }
    else if (z === 'bench') { ts = K.Tamb; tau = 11; }
    else if (this.nAct > 0) { ts = tempOf(this.h[ND >> 1]) * 0.88 + K.Tamb * 0.12; tau = 2.2; }
    this.Tb += (ts - this.Tb) * (1 - Math.exp(-dt / tau));
    this.Tt += (this.Tb - this.Tt) * (1 - Math.exp(-dt / 2.6));

    if (this.vol <= 1e-4) { this.nAct = 0; this.level = this.liq = Y0; this.phi = 0; return; }

    // ---- level from volume (with shrinkage of the solid part) ----
    const lim = this.topLimit();
    const veff = this.vol * (1 - BETA * this.phi);
    const cap = this.capacity();
    if (veff > cap) {
      // surface tension gives way: the excess runs over the rim
      const ex = veff - cap;
      const out = Math.min(ex, Math.max(ex * 9 * dt, 0.02));
      this.vol -= out / (1 - BETA * this.phi);
      this.spilled += out; this.q.overflow += out;
      this.spillNow = (this.spillNow || 0) + out;
    }
    this.level = Math.min(lim, this.levelFor(Math.min(veff, cap)));

    // ---- activate / retire rows ----
    const want = U.clamp(Math.ceil((this.level - Y0) / DY - 0.35), 1, NY);
    if (want > this.nAct) {
      for (let j = this.nAct; j < want; j++) for (let i = 0; i < ND; i++) {
        const src = j > 0 ? this.h[(j - 1) * ND + i] : this.pourH;
        const below = j > 0 ? this.f[(j - 1) * ND + i] : 0;
        const hot = this.pouring > 0;
        this.h[j * ND + i] = hot ? this.pourH : Math.max(src, LAT + 1);
        if (hot && j > 1 && i > ND / 2 && below > 0.75 && this.seam < 0) { this.seam = (j * DY) / (NY * DY); this.q.seam = true; }
      }
      this.nAct = want;
    } else if (want < this.nAct) this.nAct = want;
    if (this.pouring > 0) this.pouring -= dt;

    if (this.asleep) { if (Math.abs(this.Tb - this.sleepTb) > 1) this.asleep = false; else return; }

    // ---- heat conduction with phase change (explicit, sub-stepped) ----
    const nAct = this.nAct, h = this.h, tmp = this.tmp;
    const steps = Math.max(1, Math.ceil(dt / 0.016));
    const sdt = dt / steps;
    const phiOld = this.phi;
    for (let s = 0; s < steps; s++) {
      for (let j = 0; j < nAct; j++) {
        const yMid = Y0 + (j + 0.5) * DY;
        MS.half(yMid, half);
        const dd = Math.min(half[0], half[1]) / ND;
        const kx = ALPHA / (dd * dd), ky = ALPHA / (DY * DY);
        const tw = this.Tb + (this.Tt - this.Tb) * U.sat(yMid / MS.rimY);
        for (let i = 0; i < ND; i++) {
          const idx = j * ND + i;
          const t = tempOf(h[idx]);
          let q = 0;
          q += kx * (i > 0 ? tempOf(h[idx - 1]) - t : 2 * (tw - t));
          if (i < ND - 1) q += kx * (tempOf(h[idx + 1]) - t);
          q += ky * (j > 0 ? tempOf(h[idx - ND]) - t : 2 * (this.Tb - t));
          if (j < nAct - 1) q += ky * (tempOf(h[idx + ND]) - t);
          else q += ky * TOP_K * (K.Tamb - t);
          tmp[idx] = h[idx] + q * sdt;
        }
      }
      for (let i = 0, n = nAct * ND; i < n; i++) h[i] = tmp[i];
    }

    // ---- derived fields ----
    MS.half(Math.min(this.level, MS.rimY), half);
    ringWeights(half[0], half[1], W);
    let fs = 0, ts2 = 0, tmax = -99, moving = 0;
    const f = this.f, data = this.data;
    for (let j = 0; j < NY; j++) {
      const src = Math.min(j, nAct - 1);
      for (let i = 0; i < ND; i++) {
        const hv = h[src * ND + i];
        const fv = U.sat(1 - hv / LAT);
        if (j < nAct) {
          if (Math.abs(fv - f[j * ND + i]) > 1e-5) moving++;
          f[j * ND + i] = fv;
          const t = tempOf(hv);
          fs += fv * W[i]; ts2 += t * W[i];
          if (t > tmax) tmax = t;
        }
        data[(j * ND + i) * 4] = fv * 255;
      }
    }
    this.phi = fs / nAct; this.tMean = ts2 / nAct; this.tMax = tmax;
    const pj = Math.min(nAct - 1, Math.max(0, Math.floor(nAct * 0.5))), pi = Math.floor(ND * 0.62);
    this.tProbe = tempOf(h[pj * ND + pi]); this.fProbe = f[pj * ND + pi];
    const rate = (this.phi - phiOld) / dt;
    this.coolRate += (rate - this.coolRate) * Math.min(1, dt * 4);
    if (this.fProbe > 0.02 && this.fProbe < 0.3 && rate > 0) this.fineness = U.sat(this.fineness + (U.sat(rate * 9) - this.fineness) * dt * 2);
    this.tex.needsUpdate = true;
    this.dirty = true;

    // ---- surface: columns freeze at the level of the moment; the liquid pool feeds shrinkage ----
    const top = nAct - 1;
    let wl = 0, frozenSum = 0;
    for (let k = 0; k < ND; k++) {
      const fz = f[top * ND + k] > 0.5 ? 1 : 0;
      if (fz && !this.frozen[k]) {
        this.col[k] = this.liq;
        // freezing while the liquid is still sloshing leaves a tilted, rippled surface
        this.tiltX += this.slosh.x * W[k] * 1.5; this.tiltZ += this.slosh.z * W[k] * 1.5;
      }
      this.frozen[k] = fz;
      if (fz) frozenSum += W[k] * this.col[k]; else wl += W[k];
    }
    if (wl > 1e-4) {
      const target = (this.level - frozenSum) / wl;
      this.liq = U.clamp(target, Math.max(Y0, this.level - 0.45), lim);
    } else this.liq = this.level;
    for (let k = 0; k < ND; k++) if (!this.frozen[k]) this.col[k] = this.liq;

    // contiguous solid measured up from the floor, per column (the visible front)
    for (let k = 0; k < ND; k++) {
      let s = 0;
      for (let j = 0; j < nAct; j++) { const fv = f[j * ND + k]; s += Math.min(1, fv * 1.6); if (fv < 0.55) break; }
      this.front[k] = Math.min(s * DY, this.col[k] - Y0);
    }

    // settle to sleep when nothing changes any more (steady state on a constant surface)
    const drift = Math.abs(this.tMean - (this.tPrev === undefined ? 1e3 : this.tPrev)) / dt;
    this.tPrev = this.tMean;
    this.still = moving === 0 && drift < 0.05 && this.pouring <= 0 && Math.abs(this.slosh.vx) + Math.abs(this.slosh.vz) < 0.01 ? (this.still || 0) + dt : 0;
    if (this.still > 1.5) { this.asleep = true; this.still = 0; this.sleepTb = this.Tb; }
  };

  /* Slosh: the free surface behaves like a damped pendulum driven by the mold's acceleration. */
  P.updateSlosh = function (dt, ax, az) {
    const s = this.slosh;
    const liqFrac = 1 - this.phi;
    const om = 15, zeta = 0.16;
    s.vx += (-om * om * s.x - 2 * zeta * om * s.vx - ax * 0.04) * dt;
    s.vz += (-om * om * s.z - 2 * zeta * om * s.vz - az * 0.04) * dt;
    s.x += s.vx * dt; s.z += s.vz * dt;
    const lim = 0.3 * liqFrac;
    s.x = U.clamp(s.x, -lim, lim); s.z = U.clamp(s.z, -lim, lim);
    if (Math.abs(s.x) + Math.abs(s.z) > 0.002) this.asleep = false;
    if (this.ripple > 0) { this.ripple = Math.max(0, this.ripple - dt * 2.2); this.dirty = true; }
    // slopping over the rim
    const reach = Math.max(Math.abs(s.x) * 2.0, Math.abs(s.z) * 1.5);
    const head = this.liq + reach - (this.topLimit() - MS.dome * 0.6);
    if (head > 0 && liqFrac > 0.3 && this.vol > 0.2) {
      const out = Math.min(this.vol * 0.5, head * 14 * dt);
      this.vol -= out; this.spilled += out; this.q.overflow += out;
      this.spillNow = (this.spillNow || 0) + out;
      this.spillDirX = Math.sign(s.x) * (Math.abs(s.x) * 2 > Math.abs(s.z) * 1.5 ? 1 : 0);
      this.spillDirZ = Math.sign(s.z) * (Math.abs(s.x) * 2 > Math.abs(s.z) * 1.5 ? 0 : 1);
    }
  };

  /* Local surface height at normalised wall distance dn (0 wall .. 1 centre). */
  P.surfaceAt = function (dn) {
    const k = dn * ND - 0.5;
    const k0 = U.clamp(Math.floor(k), 0, ND - 1), k1 = Math.min(ND - 1, k0 + 1);
    const t = U.sat(k - k0);
    return this.col[k0] + (this.col[k1] - this.col[k0]) * t * t * (3 - 2 * t);
  };
  P.frontAt = function (dn) {
    const k = dn * ND - 0.5;
    const k0 = U.clamp(Math.floor(k), 0, ND - 1), k1 = Math.min(ND - 1, k0 + 1);
    const t = U.sat(k - k0);
    return this.front[k0] + (this.front[k1] - this.front[k0]) * t;
  };
  /* Solid fraction at a local point (for chips, the cassette, forceps). */
  P.solidAt = function (dn, y) {
    if (this.nAct <= 0) return 0;
    const j = U.clamp(Math.floor((y - Y0) / DY), 0, this.nAct - 1);
    const i = U.clamp(Math.floor(dn * ND), 0, ND - 1);
    return this.f[j * ND + i];
  };
  P.liquidFraction = function () { return this.nAct > 0 ? 1 - this.phi : 0; };
  /* 0..1: how cleanly the block will release (solid through, cooled, shrunk off the walls). */
  P.readiness = function () {
    if (this.nAct <= 0) return 0;
    return U.smooth(0.9, 0.995, this.phi) * U.smooth(50, 32, this.tMean);
  };
  P.remove = function (v) { v = Math.min(v, this.vol); this.vol -= v; this.asleep = false; return v; };
  P.reset = function () {
    this.vol = 0; this.nAct = 0; this.phi = 0; this.level = this.liq = Y0; this.seam = -1; this.spilled = 0;
    this.col.fill(Y0); this.frozen.fill(0); this.front.fill(0); this.h.fill(0); this.f.fill(0); this.data.fill(0);
    this.tiltX = this.tiltZ = 0; this.fineness = 0.5; this.coolRate = 0;
    this.q = { overflow: 0, seam: false, skinCrack: false, poured: 0 };
    this.tex.needsUpdate = true; this.dirty = true; this.asleep = false;
  };

  EC.WaxFill = WaxFill;
})();
