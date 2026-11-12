// bagsim.js — レジ袋の2D XPBDシミュレーション
// 袋: 6x7 の膜格子(42質点) + 持ち手 3質点x2 = 48質点。張力優先(圧縮はごく弱い)の距離拘束。
// 商品: 箱・円(球)・カプセル近似の剛体。サンプル円 vs SDF の接触 + 摩擦。
// 座標: 袋ローカル。原点=袋掛け中心の台面, x=右, y=上 (メートル)

export const NC = 6, NR = 7;
export const BAG_W = 0.32, BAG_H = 0.36, HANDLE_H = 0.13;
export const PEG_Y = 0.512;
export const PEG_X = [-0.19, -0.08, 0.08, 0.19]; // 左外, 左内, 右内, 右外
const G = 9.8;
const H_SUB = 1 / 480;
const FILM = 0.002, TUN = 0.05, RIM_R = 0.011;

let gx = 0, gy = 0; // SDF勾配(ローカル)の受け渡し
const tmpA = [0, 0], tmpB = [0, 0];

function sdfLocal(sh, lx, ly) {
  if (sh.type === 'circle') {
    const l = Math.hypot(lx, ly) || 1e-9; gx = lx / l; gy = ly / l; return l - sh.r;
  }
  if (sh.type === 'capsule') {
    const cy = ly < -sh.hl ? -sh.hl : ly > sh.hl ? sh.hl : ly;
    const dx = lx, dy = ly - cy, l = Math.hypot(dx, dy) || 1e-9;
    gx = dx / l; gy = dy / l; return l - sh.r;
  }
  const r = sh.r, ax = Math.abs(lx) - (sh.hx - r), ay = Math.abs(ly) - (sh.hy - r);
  const sx = lx < 0 ? -1 : 1, sy = ly < 0 ? -1 : 1;
  if (ax > 0 && ay > 0) { const l = Math.hypot(ax, ay) || 1e-9; gx = sx * ax / l; gy = sy * ay / l; return l - r; }
  if (ax > ay) { gx = sx; gy = 0; return ax - r; }
  gx = 0; gy = sy; return ay - r;
}

export function makeShape(type, p) {
  const sh = Object.assign({ type }, p);
  const s = [];
  if (type === 'circle') { s.push([0, 0, sh.r]); sh.inertiaK = 0.4 * sh.r * sh.r; sh.bound = sh.r; }
  else if (type === 'capsule') {
    const n = Math.max(2, Math.ceil((2 * sh.hl) / 0.03) + 1);
    for (let i = 0; i < n; i++) s.push([0, -sh.hl + (2 * sh.hl * i) / (n - 1), sh.r]);
    const L = 2 * sh.hl + sh.r; sh.inertiaK = (L * L) / 12; sh.bound = sh.hl + sh.r;
  } else {
    const ix = sh.hx - sh.r, iy = sh.hy - sh.r;
    const nx = Math.max(1, Math.ceil((2 * ix) / 0.035)), ny = Math.max(1, Math.ceil((2 * iy) / 0.035));
    for (let i = 0; i <= nx; i++) { const x = -ix + (2 * ix * i) / nx; s.push([x, -iy, sh.r], [x, iy, sh.r]); }
    for (let j = 1; j < ny; j++) { const y = -iy + (2 * iy * j) / ny; s.push([-ix, y, sh.r], [ix, y, sh.r]); }
    sh.inertiaK = (4 * sh.hx * sh.hx + 4 * sh.hy * sh.hy) / 12; sh.bound = Math.hypot(sh.hx, sh.hy);
  }
  sh.samples = s;
  return sh;
}

export class BagSim {
  constructor() {
    const n = NC * NR + 6;
    this.n = n;
    this.px = new Float64Array(n); this.py = new Float64Array(n);
    this.qx = new Float64Array(n); this.qy = new Float64Array(n);
    this.vx = new Float64Array(n); this.vy = new Float64Array(n);
    this.w = new Float64Array(n);
    this.cons = []; // [i, j, rest, compliance, compressK]
    this.bodies = [];
    this.groundY = 0;
    this.support = null; // {x0,x1,y} 客の添え手
    this.acc = 0;
    // 持ち手の支点: {x,y} 目標。apexL / apexR
    this.pinL = { x: PEG_X[1], y: PEG_Y, tx: PEG_X[1], ty: PEG_Y };
    this.pinR = { x: PEG_X[2], y: PEG_Y, tx: PEG_X[2], ty: PEG_Y };
    this.strainL = 0; this.strainR = 0; this.rustle = 0; this.thump = 0;
    this._build();
  }
  idx(c, r) { return r * NC + c; }
  _build() {
    const dx = BAG_W / (NC - 1), dy = BAG_H / (NR - 1);
    const top = PEG_Y - HANDLE_H;
    const m = 0.002;
    for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
      const i = this.idx(c, r);
      this.px[i] = -BAG_W / 2 + c * dx; this.py[i] = top - r * dy; this.w[i] = 1 / m;
    }
    const b = NC * NR;
    this.hL = [b, b + 1, b + 2]; this.hR = [b + 3, b + 4, b + 5]; // a(外), b(内), apex
    const setH = (h, c0, c1) => {
      const x0 = this.px[this.idx(c0, 0)], x1 = this.px[this.idx(c1, 0)];
      this.px[h[0]] = x0 + (x1 - x0) * 0.12; this.py[h[0]] = top + HANDLE_H * 0.55;
      this.px[h[1]] = x1 - (x1 - x0) * 0.12; this.py[h[1]] = top + HANDLE_H * 0.55;
      this.px[h[2]] = (x0 + x1) / 2; this.py[h[2]] = top + HANDLE_H;
      this.w[h[0]] = this.w[h[1]] = 1 / m; this.w[h[2]] = 0;
    };
    setH(this.hL, 0, 1); setH(this.hR, NC - 1, NC - 2);
    this.restX = Float64Array.from(this.px); this.restY = Float64Array.from(this.py);
    const A = 3.6e-4;
    const add = (i, j, comp, ck) => {
      this.cons.push([i, j, Math.hypot(this.px[i] - this.px[j], this.py[i] - this.py[j]), comp, ck]);
    };
    for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
      if (c < NC - 1) add(this.idx(c, r), this.idx(c + 1, r), A, r === NR - 1 ? 0.10 : 0.035);
      if (r < NR - 1) add(this.idx(c, r), this.idx(c, r + 1), A, 0.035);
      if (c < NC - 1 && r < NR - 1) {
        add(this.idx(c, r), this.idx(c + 1, r + 1), A * 2.5, 0.02);
        add(this.idx(c + 1, r), this.idx(c, r + 1), A * 2.5, 0.02);
      }
    }
    const strap = (h, c0, c1) => {
      const i0 = this.idx(c0, 0), i1 = this.idx(c1, 0);
      const s0 = this.cons.length;
      add(i0, h[0], A, 0.03); add(i1, h[1], A, 0.03); add(h[0], h[2], A, 0.03); add(h[1], h[2], A, 0.03);
      add(h[0], h[1], A * 4, 0.05); add(i0, h[1], A * 3, 0.01); add(i1, h[0], A * 3, 0.01);
      return [s0, s0 + 1, s0 + 2, s0 + 3];
    };
    this.strapL = strap(this.hL, 0, 1); this.strapR = strap(this.hR, NC - 1, NC - 2);
    // 外周 (左辺↓, 底→, 右辺↑)
    const bd = [];
    for (let r = 0; r < NR; r++) bd.push(this.idx(0, r));
    for (let c = 1; c < NC; c++) bd.push(this.idx(c, NR - 1));
    for (let r = NR - 2; r >= 0; r--) bd.push(this.idx(NC - 1, r));
    this.boundary = bd;
    this.cornerL = this.idx(0, 0); this.cornerR = this.idx(NC - 1, 0);
    this.rim = [this.cornerL, this.cornerR];
    this.qx.set(this.px); this.qy.set(this.py);
    this.px[this.hL[2]] = this.pinL.x; this.py[this.hL[2]] = this.pinL.y;
    this.px[this.hR[2]] = this.pinR.x; this.py[this.hR[2]] = this.pinR.y;
  }
  // 袋全体を平行移動して支点に合わせ直す(復元・掛け直しの初期化用)
  resetShape(ox = 0, oy = 0) {
    for (let i = 0; i < this.n; i++) {
      this.px[i] = this.qx[i] = this.restX[i] + ox; this.py[i] = this.qy[i] = this.restY[i] + oy;
      this.vx[i] = this.vy[i] = 0;
    }
  }
  addBody(id, shape, mass, x, y, a) {
    const b = {
      id, shape, mass, x, y, a, px: x, py: y, pa: a, vx: 0, vy: 0, va: 0,
      invM: 1 / mass, invI: 1 / (mass * shape.inertiaK), held: false,
      gx: 0, gy: 0, tx: 0, ty: 0, // つかみ点(ローカル)と目標(ワールド)
      inside: new Uint8Array(shape.samples.length), side: new Float32Array(shape.samples.length),
      ghost: 0, stuckT: 0, contact: 0, hit: 0,
    };
    this.bodies.push(b);
    this.initFlags(b);
    return b;
  }
  removeBody(b) { const i = this.bodies.indexOf(b); if (i >= 0) this.bodies.splice(i, 1); }
  getBody(id) { return this.bodies.find((b) => b.id === id) || null; }
  samplePos(b, k, out) {
    const s = b.shape.samples[k], c = Math.cos(b.a), sn = Math.sin(b.a);
    out[0] = b.x + c * s[0] - sn * s[1]; out[1] = b.y + sn * s[0] + c * s[1];
  }
  sdfWorld(b, x, y) {
    const c = Math.cos(b.a), s = Math.sin(b.a), dx = x - b.x, dy = y - b.y;
    const d = sdfLocal(b.shape, c * dx + s * dy, -s * dx + c * dy);
    const lx = gx, ly = gy; gx = c * lx - s * ly; gy = s * lx + c * ly;
    return d;
  }
  pointInBag(x, y) {
    const bd = this.boundary; let inside = false;
    for (let i = 0, j = bd.length - 1; i < bd.length; j = i++) {
      const xi = this.px[bd[i]], yi = this.py[bd[i]], xj = this.px[bd[j]], yj = this.py[bd[j]];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  mouthSide(x, y, out) {
    const L = this.cornerL, R = this.cornerR;
    const ex = this.px[R] - this.px[L], ey = this.py[R] - this.py[L];
    const dx = x - this.px[L], dy = y - this.py[L];
    out[0] = ex * dy - ey * dx; out[1] = (dx * ex + dy * ey) / (ex * ex + ey * ey || 1e-9);
  }
  initFlags(b) {
    const p = tmpA, m = tmpB;
    for (let k = 0; k < b.inside.length; k++) {
      this.samplePos(b, k, p); this.mouthSide(p[0], p[1], m);
      b.side[k] = m[0];
      b.inside[k] = m[0] < 0 && this.pointInBag(p[0], p[1]) ? 1 : 0;
    }
  }
  anyInside(b) { for (let k = 0; k < b.inside.length; k++) if (b.inside[k]) return true; return false; }
  allInside(b) { for (let k = 0; k < b.inside.length; k++) if (!b.inside[k]) return false; return true; }
  bodyAt(x, y, pad = 0) {
    let best = null, bd = pad;
    for (const b of this.bodies) { const d = this.sdfWorld(b, x, y); if (d < bd) { bd = d; best = b; } }
    return best;
  }
  grab(b, x, y) {
    const c = Math.cos(b.a), s = Math.sin(b.a), dx = x - b.x, dy = y - b.y;
    let lx = c * dx + s * dy, ly = -s * dx + c * dy;
    const sh = b.shape;
    if (sh.type === 'circle') { lx = 0; ly = 0; }
    else if (sh.type === 'capsule') { lx = 0; ly = Math.max(-sh.hl, Math.min(sh.hl, ly)); }
    else { lx = Math.max(-sh.hx * 0.6, Math.min(sh.hx * 0.6, lx)); ly = Math.max(-sh.hy * 0.85, Math.min(sh.hy * 0.85, ly)); }
    b.gx = lx; b.gy = ly; b.held = true; b.tx = x; b.ty = y; b.stuckT = 0; b.ghost = 0;
    // 手で持つ: 箱や球はつかんだ向きをゆるく保つ。長いパンだけはつかみ点から自由にぶら下がる
    // 長いパンは、まんなか近くを持てば横向きを保ち、端を持てば先が下を向いてぶら下がる
    if (sh.type === 'capsule') b.holdA = Math.abs(ly) < sh.hl * 0.3 ? Math.round((b.a - Math.PI / 2) / Math.PI) * Math.PI + Math.PI / 2 : null;
    else b.holdA = sh.type === 'box' ? Math.round(b.a / (Math.PI / 2)) * (Math.PI / 2) : b.a;
  }
  release(b) { b.held = false; b.ghost = 0; }

  step(dt) {
    // 空の袋は、折れやねじれが残らないよう、掛かった位置の素直な形へゆっくり戻る (速度は生まない)
    if (this.relax) {
      const k = 1 - Math.exp(-2.5 * Math.min(dt, 0.05)), ox = (this.pinL.x + this.pinR.x) / 2, oy = (this.pinL.y + this.pinR.y) / 2 - PEG_Y;
      for (let i = 0; i < this.n; i++) { if (this.w[i] === 0) continue; const dx = (this.restX[i] + ox - this.px[i]) * k, dy = (this.restY[i] + oy - this.py[i]) * k; this.px[i] += dx; this.qx[i] += dx; this.py[i] += dy; this.qy[i] += dy; }
    }
    this.acc += Math.min(dt, 0.05);
    let n = 0;
    this.thump = 0;
    while (this.acc >= H_SUB && n < 28) { this.sub(H_SUB); this.acc -= H_SUB; n++; }
    if (n >= 28) this.acc = 0;
    this._post(dt);
  }
  _pin(pin, i, h) {
    const dx = pin.tx - pin.x, dy = pin.ty - pin.y, l = Math.hypot(dx, dy), mx = (this.pinSpeed || 3.5) * h;
    if (l > mx) { pin.x += (dx / l) * mx; pin.y += (dy / l) * mx; } else { pin.x = pin.tx; pin.y = pin.ty; }
    this.px[i] = pin.x; this.py[i] = pin.y;
  }
  sub(h) {
    const { px, py, qx, qy, vx, vy, w, n } = this;
    const dampP = Math.exp(-11.0 * h);
    for (let i = 0; i < n; i++) {
      qx[i] = px[i]; qy[i] = py[i];
      if (w[i] === 0) continue;
      vy[i] -= G * h; vx[i] *= dampP; vy[i] *= dampP;
      px[i] += vx[i] * h; py[i] += vy[i] * h;
    }
    this._pin(this.pinL, this.hL[2], h); this._pin(this.pinR, this.hR[2], h);
    for (const b of this.bodies) {
      b.px = b.x; b.py = b.y; b.pa = b.a;
      b.vy -= G * h;
      const dl = Math.exp(-(b.held ? 6 : 0.5) * h), da = Math.exp(-(b.held ? 9 : 1.2) * h);
      b.vx *= dl; b.vy *= dl; b.va *= da;
      b.x += b.vx * h; b.y += b.vy * h; b.a += b.va * h;
      b.contact = 0; b.gc = 0;
    }
    // 膜の距離拘束 (掃引方向を交互にして偏りを消す)
    const cons = this.cons, ih2 = 1 / (h * h);
    this.flip = !this.flip;
    for (let it = 0; it < 2; it++) {
      for (let kk = 0; kk < cons.length; kk++) {
        const k = (it === 0) === this.flip ? kk : cons.length - 1 - kk;
        const c = cons[k], i = c[0], j = c[1];
        const dx = px[j] - px[i], dy = py[j] - py[i], l = Math.hypot(dx, dy) || 1e-9;
        let C = l - c[2];
        const ws = w[i] + w[j]; if (ws === 0) continue;
        let s;
        if (C > 0) s = C / (ws + c[3] * ih2); else s = (C * c[4]) / ws;
        const ux = (dx / l) * s, uy = (dy / l) * s;
        px[i] += ux * w[i]; py[i] += uy * w[i]; px[j] -= ux * w[j]; py[j] -= uy * w[j];
      }
    }
    // つかみ拘束
    for (const b of this.bodies) if (b.held) this._solveGrab(b, h);
    // 剛体同士
    const B = this.bodies;
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      const a = B[i], b = B[j];
      const dd = Math.hypot(a.x - b.x, a.y - b.y);
      if (dd > a.shape.bound + b.shape.bound + 0.01) continue;
      if (a.ghost > 0 || b.ghost > 0) continue;
      this._pair(a, b); this._pair(b, a);
    }
    // 剛体 vs 袋
    const bd = this.boundary, p = tmpA;
    for (const b of B) {
      const any = this.anyInside(b);
      for (let k = 0; k < b.inside.length; k++) {
        this.samplePos(b, k, p);
        const rs = b.shape.samples[k][2];
        if (b.inside[k]) {
          if (this.flip) for (let s = bd.length - 2; s >= 0; s--) this._seg(b, p[0], p[1], rs, bd[s], bd[s + 1]);
          else for (let s = 0; s < bd.length - 1; s++) this._seg(b, p[0], p[1], rs, bd[s], bd[s + 1]);
        }
        // 台面・添え手
        let gy0 = this.groundY;
        // 添え手は「やわらかい面」: 1サブステップに0.4mmまでしか押し上げない (急な速度を生まない)
        if (this.support && p[0] > this.support.x0 && p[0] < this.support.x1 && this.support.y > gy0) gy0 = Math.max(gy0, Math.min(this.support.y, p[1] - rs + 0.0004));
        if (p[1] - rs < gy0) this._ground(b, p[0], p[1], rs, gy0);
      }
      if (any) for (let s = 0; s < bd.length; s++) this._particle(b, bd[s], 0.003);
      for (let s = 0; s < this.rim.length; s++) this._particle(b, this.rim[s], RIM_R);
    }
    // 膜 vs 台面
    for (let i = 0; i < n; i++) {
      if (w[i] === 0) continue;
      let gy0 = this.groundY + 0.003;
      if (this.support && px[i] > this.support.x0 && px[i] < this.support.x1 && this.support.y + 0.003 > gy0) gy0 = Math.max(gy0, Math.min(this.support.y + 0.003, py[i] + 0.0004));
      if (py[i] < gy0) { const pen = gy0 - py[i]; py[i] = gy0; if (pen > 0.0002) px[i] = qx[i]; else px[i] -= (px[i] - qx[i]) * 0.5; }
    }
    // 速度更新
    const ih = 1 / h;
    for (let i = 0; i < n; i++) { vx[i] = (px[i] - qx[i]) * ih; vy[i] = (py[i] - qy[i]) * ih; }
    for (const b of B) {
      const ovx = b.vx, ovy = b.vy;
      b.vx = (b.x - b.px) * ih; b.vy = (b.y - b.py) * ih; b.va = (b.a - b.pa) * ih;
      const sp = Math.hypot(b.vx, b.vy);
      if (sp > 6) { b.vx *= 6 / sp; b.vy *= 6 / sp; }
      if (b.va > 25) b.va = 25; else if (b.va < -25) b.va = -25;
      if (b.contact) {
        const dv = Math.hypot(b.vx - ovx, b.vy - ovy); if (dv > b.hit) b.hit = dv;
        const circ = b.shape.type === 'circle';
        const slow = Math.hypot(b.vx, b.vy) < 0.04;
        const cd = Math.exp(-(b.gc >= 2 ? 7 : 2.2) * h), ca = Math.exp(-(b.gc >= 2 ? 40 : circ ? (slow ? 45 : 7) : 3.5) * h); b.vx *= cd; b.vy *= cd; b.va *= ca;
      }
      // 口の通過判定
      const m = tmpB;
      for (let k = 0; k < b.inside.length; k++) {
        this.samplePos(b, k, p); this.mouthSide(p[0], p[1], m);
        const prev = b.side[k];
        if (prev > 0 !== m[0] > 0 && m[1] > -0.03 && m[1] < 1.03) b.inside[k] = m[0] < 0 ? 1 : 0;
        b.side[k] = m[0];
      }
    }
  }
  _solveGrab(b, h) {
    const c = Math.cos(b.a), s = Math.sin(b.a);
    const rx = c * b.gx - s * b.gy, ry = s * b.gx + c * b.gy;
    let dx = b.tx - (b.x + rx), dy = b.ty - (b.y + ry);
    const l = Math.hypot(dx, dy);
    if (l < 1e-7) return;
    const nx = dx / l, ny = dy / l;
    const wg = b.invM + b.invI * (rx * ny - ry * nx) ** 2;
    const alpha = 6e-4 / (h * h);
    let lam = l / (wg + alpha);
    const maxF = (b.mass * 80 + 30) * h * h; // 引く力の上限
    if (lam > maxF) lam = maxF;
    const cx = nx * lam, cy = ny * lam;
    b.x += cx * b.invM; b.y += cy * b.invM; b.a += b.invI * (rx * cy - ry * cx);
    if (b.holdA !== null && b.holdA !== undefined) b.a += (b.holdA - b.a) * (1 - Math.exp(-(b.shape.type === 'box' ? 30 : 14) * h));
  }
  _disp(b, rx, ry, out) {
    const da = b.pa - b.a, c = Math.cos(da), s = Math.sin(da);
    out[0] = b.x + rx - (b.px + c * rx - s * ry); out[1] = b.y + ry - (b.py + s * rx + c * ry);
  }
  _pair(a, b) {
    const p = tmpA, sm = a.shape.samples, bAny = this.anyInside(b);
    for (let k = 0; k < sm.length; k++) {
      this.samplePos(a, k, p);
      const rs = sm[k][2];
      const d = this.sdfWorld(b, p[0], p[1]) - rs;
      if (d >= 0) continue;
      const nx = gx, ny = gy;
      const cxp = p[0] - nx * rs, cyp = p[1] - ny * rs;
      // 膜をはさんだ接触はしない: 袋の外(手前)を通る品は、中の品に当たらない
      if (a.inside[k]) { if (!bAny) continue; } else if (this.pointInBag(cxp, cyp)) continue;
      const rax = cxp - a.x, ray = cyp - a.y, rbx = cxp - b.x, rby = cyp - b.y;
      const hm = a.held ? 0.35 : 1, hb = b.held ? 0.35 : 1; // 持った品は押し負けにくい
      const wa = (a.invM + a.invI * (rax * ny - ray * nx) ** 2) * hm, wb = (b.invM + b.invI * (rbx * ny - rby * nx) ** 2) * hb;
      const lam = Math.min(-d, 0.004) / (wa + wb); // 深いめり込みは少しずつ解く (弾け飛ばない)
      this._corr(a, rax, ray, nx * lam * hm, ny * lam * hm); this._corr(b, rbx, rby, -nx * lam * hb, -ny * lam * hb);
      a.contact = b.contact = 1;
      // 摩擦
      const da = tmpB; this._disp(a, rax, ray, da); const dax = da[0], day = da[1]; this._disp(b, rbx, rby, da);
      let tx = dax - da[0], ty = day - da[1]; const dn = tx * nx + ty * ny; tx -= dn * nx; ty -= dn * ny;
      const tl = Math.hypot(tx, ty);
      if (tl > 1e-10) {
        tx /= tl; ty /= tl;
        const wat = a.invM + a.invI * (rax * ty - ray * tx) ** 2, wbt = b.invM + b.invI * (rbx * ty - rby * tx) ** 2;
        const lt = Math.min(tl / (wat + wbt), 0.45 * lam);
        this._corr(a, rax, ray, -tx * lt, -ty * lt); this._corr(b, rbx, rby, tx * lt, ty * lt);
      }
    }
  }
  _corr(b, rx, ry, cx, cy) { b.x += cx * b.invM; b.y += cy * b.invM; b.a += b.invI * (rx * cy - ry * cx); }
  _seg(b, cx, cy, rs, i, j) {
    const { px, py, w, qx, qy } = this;
    const ex = px[j] - px[i], ey = py[j] - py[i], l2 = ex * ex + ey * ey; if (l2 < 1e-10) return;
    const dx = cx - px[i], dy = cy - py[i];
    const t = (dx * ex + dy * ey) / l2; if (t < -0.08 || t > 1.08) return;
    const l = Math.sqrt(l2), nx = -ey / l, ny = ex / l;
    const s = dx * nx + dy * ny;
    if (s > rs + FILM || s < -TUN) return;
    const d = s - rs - FILM, tc = t < 0 ? 0 : t > 1 ? 1 : t;
    const rx = cx - nx * rs - b.x, ry = cy - ny * rs - b.y;
    const wb = b.invM + b.invI * (rx * ny - ry * nx) ** 2;
    const wi = w[i] * (1 - tc), wj = w[j] * tc;
    const ws = wb + wi * (1 - tc) + wj * tc; if (ws === 0) return;
    const lam = -d / ws;
    this._corr(b, rx, ry, nx * lam, ny * lam);
    px[i] -= nx * lam * wi; py[i] -= ny * lam * wi; px[j] -= nx * lam * wj; py[j] -= ny * lam * wj;
    b.contact = 1;
    if (ny > 0.9 && py[i] < this.groundY + 0.008 && py[j] < this.groundY + 0.008) b.gc++; // 台に着いた膜の上
    const da = tmpB; this._disp(b, rx, ry, da);
    const fx = (px[i] - qx[i]) * (1 - tc) + (px[j] - qx[j]) * tc, fy = (py[i] - qy[i]) * (1 - tc) + (py[j] - qy[j]) * tc;
    let tx = da[0] - fx, ty = da[1] - fy; const dn = tx * nx + ty * ny; tx -= dn * nx; ty -= dn * ny;
    const tl = Math.hypot(tx, ty);
    if (tl > 1e-10) {
      tx /= tl; ty /= tl;
      const wbt = b.invM + b.invI * (rx * ty - ry * tx) ** 2;
      const lt = Math.min(tl / (wbt + wi * (1 - tc) + wj * tc), 0.4 * lam);
      this._corr(b, rx, ry, -tx * lt, -ty * lt);
      px[i] += tx * lt * wi; py[i] += ty * lt * wi; px[j] += tx * lt * wj; py[j] += ty * lt * wj;
    }
  }
  _particle(b, i, pr) {
    const { px, py, w } = this;
    if (Math.abs(px[i] - b.x) > b.shape.bound + pr || Math.abs(py[i] - b.y) > b.shape.bound + pr) return;
    const d = this.sdfWorld(b, px[i], py[i]) - pr;
    if (d >= 0) return;
    const nx = gx, ny = gy;
    const cxp = px[i] - nx * pr, cyp = py[i] - ny * pr, rx = cxp - b.x, ry = cyp - b.y;
    const wb = b.invM + b.invI * (rx * ny - ry * nx) ** 2, wp = w[i];
    if (wb + wp === 0) return;
    const lam = -d / (wb + wp);
    px[i] += nx * lam * wp; py[i] += ny * lam * wp;
    this._corr(b, rx, ry, -nx * lam, -ny * lam);
    b.contact = 1;
    if (pr > 0.005) { // 口の縁(持ち手の付け根)は滑りにくい: 載せたパンが留まる
      const da = tmpB; this._disp(b, rx, ry, da);
      let tx = da[0] - (px[i] - this.qx[i]), ty = da[1] - (py[i] - this.qy[i]); const dn = tx * nx + ty * ny; tx -= dn * nx; ty -= dn * ny;
      const tl = Math.hypot(tx, ty);
      if (tl > 1e-10) { tx /= tl; ty /= tl; const wbt = b.invM + b.invI * (rx * ty - ry * tx) ** 2; const lt = Math.min(tl / (wbt + wp), 0.7 * lam); this._corr(b, rx, ry, -tx * lt, -ty * lt); px[i] += tx * lt * wp; py[i] += ty * lt * wp; }
    }
  }
  _ground(b, cx, cy, rs, gy0) {
    const d = cy - rs - gy0;
    const rx = cx - b.x, ry = cy - rs - b.y;
    const wb = b.invM + b.invI * rx * rx;
    const lam = -d / wb;
    this._corr(b, rx, ry, 0, lam);
    b.contact = 1; b.gc++;
    const da = tmpB; this._disp(b, rx, ry, da);
    const tl = Math.abs(da[0]);
    if (tl > 1e-10) {
      const tx = Math.sign(da[0]), wbt = b.invM + b.invI * ry * ry;
      const lt = Math.min(tl / wbt, 0.5 * lam);
      this._corr(b, rx, ry, -tx * lt, 0);
    }
  }
  _post(dt) {
    // 持ち手の張り
    const st = (ids) => { let s = 0; for (const k of ids) { const c = this.cons[k]; s += Math.hypot(this.px[c[0]] - this.px[c[1]], this.py[c[0]] - this.py[c[1]]) / c[2] - 1; } return s / ids.length; };
    this.strainL = st(this.strapL); this.strainR = st(this.strapR);
    let e = 0; for (let i = 0; i < NC * NR; i++) e += this.vx[i] * this.vx[i] + this.vy[i] * this.vy[i];
    this.rustle = Math.sqrt(e / (NC * NR));
    // 取りこぼしの自己修復とつかみ詰まり対策
    const p = tmpA, m = tmpB;
    for (const b of this.bodies) {
      for (let k = 0; k < b.inside.length; k++) {
        this.samplePos(b, k, p); this.mouthSide(p[0], p[1], m);
        const pin = this.pointInBag(p[0], p[1]);
        if (b.inside[k] && !pin && m[0] > 0.004) b.inside[k] = 0;
        // すでに袋へ入っている品の一部が口の外を通って入り込んだとき: その部分も袋の中として扱う
        else if (!b.inside[k] && pin && m[0] < -0.03 && !b.held && this.anyInside(b)) b.inside[k] = 1;
      }
      if (b.held) {
        const c = Math.cos(b.a), s = Math.sin(b.a);
        const gxw = b.x + c * b.gx - s * b.gy, gyw = b.y + s * b.gx + c * b.gy;
        const far = Math.hypot(b.tx - gxw, b.ty - gyw);
        if (far > 0.07) b.stuckT += dt; else b.stuckT = Math.max(0, b.stuckT - dt * 2);
      }
      if (b.ghost > 0) { b.ghost -= dt; if (b.ghost <= 0) b.stuckT = 0; }
      if (b.hit > this.thump) this.thump = b.hit;
      b.hit = 0;
      if (!isFinite(b.x) || !isFinite(b.y) || !isFinite(b.a)) { b.x = 0; b.y = 0.6; b.a = 0; b.vx = b.vy = b.va = 0; b.px = b.x; b.py = b.y; b.pa = 0; }
    }
    for (let i = 0; i < this.n; i++) if (!isFinite(this.px[i]) || !isFinite(this.py[i])) { this.resetShape(this.pinL.x - PEG_X[1], this.pinL.y - PEG_Y); break; }
  }
  // 手が届くか: 手は2つの持ち手のあいだから、ほぼ真上から入る。
  // 持ち手に寄せられた「肩」の下や、ほかの品の真下は届かない → 持ち手を横へ引いて口を広げた側だけ届くようになる。
  // 手の入る幅: ふだんは2つの持ち手のあいだ。持ち手を外側の掛け金へ引いた側は、その側の壁ぎわまで開く
  reachBand() {
    return [this.pinL.x + 0.03 - Math.max(0, PEG_X[1] - this.pinL.x) * 1.6, this.pinR.x - 0.03 + Math.max(0, this.pinR.x - PEG_X[2]) * 1.6];
  }
  reachable(b) {
    if (!this.allInside(b)) return true;
    const band = this.reachBand(), lo = band[0], hi = band[1];
    if (hi < lo) return false;
    const sh = b.shape, c = Math.cos(b.a), sn = Math.sin(b.a), pts = [[b.x, b.y]];
    const ext = sh.type === 'box' ? (sh.hx > sh.hy ? [sh.hx * 0.7, 0] : [0, sh.hy * 0.7]) : sh.type === 'capsule' ? [0, sh.hl * 0.8] : null;
    if (ext) for (const s of [1, -1]) pts.push([b.x + s * (c * ext[0] - sn * ext[1]), b.y + s * (sn * ext[0] + c * ext[1])]);
    // 品の左右の肩にも手をかけられる (上に少しかぶさった品があっても、空いた側からつかめる)
    const rx = sh.type === 'circle' ? sh.r : sh.type === 'capsule' ? Math.abs(sn) * sh.hl + sh.r : Math.abs(c) * sh.hx + Math.abs(sn) * sh.hy;
    pts.push([b.x + rx * 0.6, b.y], [b.x - rx * 0.6, b.y]);
    for (const t of pts) {
      if (t[0] < lo || t[0] > hi) continue; // 持ち手のあいだ (口の開いている幅) の真下だけ
      let clear = true; // その点のすぐ上に別の品がかぶさっていないか
      for (let h = 0.02; h <= 0.16 && clear; h += 0.02) {
        const x = t[0], y = t[1] + h;
        if (this.sdfWorld(b, x, y) < 0) continue;
        for (const o of this.bodies) if (o !== b && this.sdfWorld(o, x, y) < 0) { clear = false; break; }
      }
      if (clear) return true;
    }
    return false;
  }
  // 袋の中身の重心・質量
  contents() {
    let m = 0, cx = 0, cy = 0;
    for (const b of this.bodies) if (this.anyInside(b) && !b.held) { m += b.mass; cx += b.x * b.mass; cy += b.y * b.mass; }
    return { mass: m, x: m ? cx / m : 0, y: m ? cy / m : 0 };
  }
  center() { return { x: (this.px[this.cornerL] + this.px[this.cornerR]) / 2, y: (this.py[this.cornerL] + this.py[this.cornerR]) / 2 }; }
  bottomY() { let y = 1e9; for (let c = 0; c < NC; c++) y = Math.min(y, this.py[this.idx(c, NR - 1)]); return y; }
}
