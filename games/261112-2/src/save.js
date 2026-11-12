// 遊びの記憶: 版・型・範囲を確かめ、壊れていたら最初の浴室から
import { fin, clamp } from './util.js';
const KEY = 'gf-261112-2.duckbath'; const VER = 3;

function enc(arr, n) { let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(48 + Math.round(clamp(arr[i], 0, 1) * 60)); return s; }
function dec(s, out, n, scale = 1) { if (typeof s !== 'string' || s.length !== n) return false; for (let i = 0; i < n; i++) { const v = s.charCodeAt(i) - 48; if (!(v >= 0 && v <= 60)) return false; out[i] = (v / 60) * scale; } return true; }
const num = (v, a, b) => fin(v) && v >= a && v <= b;

export function saveState(G) {
  if (G.noSave) return false;
  try {
    const W = G.water, T = G.towel, st = G.env.stain; const foam = [];
    for (let k = 0; k < W.fn && foam.length < 900; k++) { if (W.ftmp[k]) continue; foam.push(Math.round(W.fx[k] * 1000), Math.round(W.fz[k] * 1000), Math.round(W.fs[k] * 10000)); }
    const sd = new Float32Array(st.data.length); for (let i = 0; i < sd.length; i++) sd[i] = st.data[i] / 255;
    const data = { v: VER, t: Date.now(), stage: G.game.stage, scene: G.rig.scene, vol: +W.vol.toFixed(6), ring: +G.tools.ringH.toFixed(4), card: G.game.cardDone ? 1 : 0, cycles: G.game.cycles | 0,
      ducks: G.ducks.map((d) => ({ k: d.kind, m: d.mode === 'held' ? d.prevMode || 'tub' : d.mode, x: +d.x.toFixed(4), z: +d.z.toFixed(4), h: +d.heading.toFixed(3), wet: d.wet.map((v) => +v.toFixed(3)), foam: d.foam.map((v) => +v.toFixed(3)) })),
      foam, towel: enc(T.wet, T.n), bed: enc(sd, sd.length) };
    window.localStorage.setItem(KEY, JSON.stringify(data)); return true;
  } catch (e) { return false; }
}

export function loadState() {
  let raw; try { raw = window.localStorage.getItem(KEY); } catch (e) { return null; }
  if (!raw || typeof raw !== 'string' || raw.length > 200000) return null;
  let d; try { d = JSON.parse(raw); } catch (e) { return null; }
  try {
    if (!d || typeof d !== 'object' || d.v !== VER) return null;
    if (!num(d.stage, 1, 5) || !num(d.scene, 1, 5) || !num(d.vol, 0, 0.3) || !num(d.ring, 0, 0.15)) return null;
    if (!Array.isArray(d.ducks) || d.ducks.length !== 2 || d.ducks[0].k !== 'parent' || d.ducks[1].k !== 'kid') return null;
    for (const k of d.ducks) { if (!k || !['tub', 'deck', 'bed'].includes(k.m) || !num(k.x, -1, 1) || !num(k.z, -1, 1) || !num(k.h, -100, 100)) return null; if (!Array.isArray(k.wet) || k.wet.length !== 4 || !Array.isArray(k.foam) || k.foam.length !== 4) return null; for (let i = 0; i < 4; i++) if (!num(k.wet[i], 0, 1) || !num(k.foam[i], 0, 1)) return null; }
    if (!Array.isArray(d.foam) || d.foam.length % 3 !== 0 || d.foam.length > 900) return null; for (const v of d.foam) if (!num(v, -1000, 1000)) return null;
    if (typeof d.towel !== 'string' || typeof d.bed !== 'string') return null;
    d.stage = Math.round(d.stage); d.scene = Math.round(d.scene); return d;
  } catch (e) { return null; }
}
export function decodeInto(s, out, n, scale) { return dec(s, out, n, scale); }
export function clearState() { try { window.localStorage.removeItem(KEY); } catch (e) { /* 無視 */ } }
export const SAVE_KEY = KEY;
