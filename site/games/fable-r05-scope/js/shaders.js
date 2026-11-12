// GLSL ES 3.00 sources for the hand-written WebGL2 renderer.
(function () {
  'use strict';
  const S = window.SCOPE;
  const H = '#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\nprecision highp samplerCube;\n';

  // fullscreen triangle
  const FS_VS = H + `
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

  const FACE_DIR = `
vec3 faceDir(int f, vec2 uv){
  vec2 p = uv * 2.0 - 1.0;
  if (f == 0) return vec3(1.0, -p.y, -p.x);
  if (f == 1) return vec3(-1.0, -p.y, p.x);
  if (f == 2) return vec3(p.x, 1.0, p.y);
  if (f == 3) return vec3(p.x, -1.0, -p.y);
  if (f == 4) return vec3(p.x, -p.y, 1.0);
  return vec3(-p.x, -p.y, -1.0);
}`;

  // ---- procedural photo-studio environment (soft boxes + dim room) ----
  const ENVGEN_FS = H + `
in vec2 vUv; out vec4 o;
uniform int uFace; uniform float uNoKey; uniform vec3 uKeyDir;
${FACE_DIR}
float softbox(vec3 d, vec3 c, vec3 up, vec2 hs, float soft){
  vec3 z = normalize(c); vec3 x = normalize(cross(up, z)); vec3 y = cross(z, x);
  float dz = dot(d, z); if (dz <= 0.0) return 0.0;
  vec2 p = vec2(dot(d, x), dot(d, y)) / dz;
  vec2 e = smoothstep(hs + soft, hs - soft, abs(p));
  vec2 q = p / hs;
  float hot = 1.0 - 0.22 * dot(q, q);
  return e.x * e.y * max(hot, 0.35);
}
void main(){
  vec3 d = normalize(faceDir(uFace, vUv));
  // dim neutral room above, white seamless paper sweep below and around the horizon
  vec3 col = mix(vec3(0.10, 0.104, 0.112), vec3(0.30, 0.31, 0.33), smoothstep(0.1, 1.0, d.y));
  vec3 sweep = mix(vec3(0.50, 0.49, 0.48), vec3(0.95, 0.94, 0.92), smoothstep(-1.0, -0.05, d.y));
  col = mix(sweep, col, smoothstep(-0.04, 0.20, d.y));
  // key: large soft box, front right, high
  col += (1.0 - uNoKey) * vec3(1.0, 0.97, 0.93) * 13.0 * softbox(d, uKeyDir, vec3(0, 1, 0), vec2(0.42, 0.56), 0.10);
  // fill: big, cool, front left
  col += vec3(0.86, 0.93, 1.0) * 1.5 * softbox(d, vec3(0.86, 0.30, 0.42), vec3(0, 1, 0), vec2(0.70, 0.85), 0.20);
  // overhead strip
  col += vec3(1.0) * 2.3 * softbox(d, vec3(0.0, 1.0, -0.12), vec3(0, 0, 1), vec2(1.00, 0.36), 0.16);
  // rim strips behind (edge highlights)
  col += vec3(0.95, 0.97, 1.0) * 9.0 * softbox(d, vec3(0.62, 0.30, -0.72), vec3(0, 1, 0), vec2(0.10, 0.85), 0.05);
  col += vec3(1.0, 0.96, 0.92) * 6.5 * softbox(d, vec3(-0.80, 0.22, -0.56), vec3(0, 1, 0), vec2(0.09, 0.70), 0.05);
  // low front card (gives chrome a bright belly line)
  col += vec3(1.0) * 1.3 * softbox(d, vec3(0.1, -0.25, 1.0), vec3(0, 1, 0), vec2(0.9, 0.12), 0.08);
  o = vec4(col, 1.0);
}`;

  const prefilterFS = (samples) => H + `
in vec2 vUv; out vec4 o;
uniform samplerCube uSrc; uniform int uFace; uniform float uRough; uniform float uSrcSize;
${FACE_DIR}
const float PI = 3.14159265;
float rad(uint b){ b=(b<<16u)|(b>>16u); b=((b&0x55555555u)<<1u)|((b&0xAAAAAAAAu)>>1u); b=((b&0x33333333u)<<2u)|((b&0xCCCCCCCCu)>>2u); b=((b&0x0F0F0F0Fu)<<4u)|((b&0xF0F0F0F0u)>>4u); b=((b&0x00FF00FFu)<<8u)|((b&0xFF00FF00u)>>8u); return float(b)*2.3283064365386963e-10; }
void main(){
  vec3 N = normalize(faceDir(uFace, vUv));
  if (uRough < 0.03) { o = vec4(textureLod(uSrc, N, 0.0).rgb, 1.0); return; }
  vec3 up = abs(N.z) < 0.999 ? vec3(0,0,1) : vec3(1,0,0);
  vec3 T = normalize(cross(up, N)); vec3 B = cross(N, T);
  float a = uRough * uRough;
  vec3 acc = vec3(0.0); float w = 0.0;
  const uint NS = ${samples}u;
  for (uint i = 0u; i < NS; i++){
    vec2 Xi = vec2(float(i) / float(NS), rad(i));
    float phi = 2.0 * PI * Xi.x;
    float ct = sqrt((1.0 - Xi.y) / (1.0 + (a*a - 1.0) * Xi.y));
    float st = sqrt(1.0 - ct*ct);
    vec3 Hh = T * (st * cos(phi)) + B * (st * sin(phi)) + N * ct;
    vec3 L = 2.0 * dot(N, Hh) * Hh - N;
    float NoL = dot(N, L);
    if (NoL > 0.0){
      float NoH = max(dot(N, Hh), 0.0);
      float dd = NoH * NoH * (a*a - 1.0) + 1.0;
      float D = a*a / (PI * dd * dd);
      float pdf = D / 4.0 + 1e-4;
      float saT = 4.0 * PI / (6.0 * uSrcSize * uSrcSize);
      float saS = 1.0 / (float(NS) * pdf);
      float mip = max(0.5 * log2(saS / saT) + 1.0, 0.0);
      acc += textureLod(uSrc, L, mip).rgb * NoL; w += NoL;
    }
  }
  o = vec4(acc / max(w, 1e-4), 1.0);
}`;

  const IRRADIANCE_FS = H + `
in vec2 vUv; out vec4 o;
uniform samplerCube uSrc; uniform int uFace;
${FACE_DIR}
const float PI = 3.14159265;
void main(){
  vec3 N = normalize(faceDir(uFace, vUv));
  vec3 up = abs(N.z) < 0.999 ? vec3(0,0,1) : vec3(1,0,0);
  vec3 T = normalize(cross(up, N)); vec3 B = cross(N, T);
  vec3 acc = vec3(0.0);
  const int NA = 16; const int NB = 6;
  for (int i = 0; i < NA; i++) for (int j = 0; j < NB; j++){
    float phi = 2.0 * PI * (float(i) + 0.5) / float(NA);
    float u = (float(j) + 0.5) / float(NB);
    float st = sqrt(u), ct = sqrt(1.0 - u);   // cosine weighted
    vec3 L = T * (st * cos(phi)) + B * (st * sin(phi)) + N * ct;
    acc += textureLod(uSrc, L, 4.0).rgb;
  }
  o = vec4(acc / float(NA * NB), 1.0);   // = irradiance / PI
}`;

  // ---- geometry vertex shader ----
  const MESH_VS = H + `
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNor; layout(location=2) in vec2 aUv;
uniform mat4 uModel; uniform mat4 uViewProj; uniform mat3 uNormalMat;
invariant gl_Position;
out vec3 vWPos; out vec3 vNor; out vec3 vOPos; out vec2 vUv;
void main(){
  vec4 w = uModel * vec4(aPos, 1.0);
  vWPos = w.xyz; vNor = uNormalMat * aNor; vOPos = aPos; vUv = aUv;
  gl_Position = uViewProj * w;
}`;

  // variance shadow map writer (orthographic light, linear depth)
  const DEPTH_VS = H + `
layout(location=0) in vec3 aPos;
uniform mat4 uModel; uniform mat4 uViewProj;
invariant gl_Position;
out float vD;
void main(){ vec4 w = uModel * vec4(aPos, 1.0); gl_Position = uViewProj * w; vD = gl_Position.z * 0.5 + 0.5; }`;
  const DEPTH_FS = H + `
in float vD; out vec4 o;
void main(){ float dx = dFdx(vD), dy = dFdy(vD); o = vec4(vD, vD * vD + 0.25 * (dx*dx + dy*dy), 0.0, 1.0); }`;

  const BLUR_FS = H + `
in vec2 vUv; out vec4 o; uniform sampler2D uTex; uniform vec2 uStep;
void main(){
  vec4 c = texture(uTex, vUv) * 0.2270270270;
  c += (texture(uTex, vUv + uStep * 1.3846153846) + texture(uTex, vUv - uStep * 1.3846153846)) * 0.3162162162;
  c += (texture(uTex, vUv + uStep * 3.2307692308) + texture(uTex, vUv - uStep * 3.2307692308)) * 0.0702702703;
  o = c;
}`;

  const COMMON_FS = `
uniform vec3 uCam;
uniform samplerCube uEnv;
uniform float uEnvInt;
uniform vec3 uKeyDir; uniform vec3 uKeyCol;
uniform sampler2D uShKey; uniform mat4 uKeyMat;
uniform sampler2D uShTop; uniform mat4 uTopMat;
uniform float uShadowOn;
uniform vec2 uInvRes;
uniform vec3 uBgTop; uniform vec3 uBgBot; uniform vec3 uBgGlow;
uniform float uTime;
const float PI = 3.14159265;
vec3 bgColor(vec2 uv){
  vec3 c = mix(uBgBot, uBgTop, smoothstep(0.0, 1.0, uv.y));
  float r = length((uv - vec2(0.5, 0.40)) * vec2(1.0, 1.25));
  return mix(uBgGlow, c, smoothstep(0.0, 0.85, r));
}
float vsm(sampler2D t, mat4 m, vec3 wp, float bleed){
  vec4 sc = m * vec4(wp, 1.0);
  vec3 p = sc.xyz * 0.5 + 0.5;
  if (p.x <= 0.002 || p.x >= 0.998 || p.y <= 0.002 || p.y >= 0.998 || p.z >= 0.999) return 1.0;
  vec2 mo = texture(t, p.xy).rg;
  float d = p.z - mo.x - 0.0004;
  if (d <= 0.0) return 1.0;
  float var = max(mo.y - mo.x * mo.x, 1.5e-7);
  float pm = var / (var + d * d);
  return clamp((pm - bleed) / (1.0 - bleed), 0.0, 1.0);
}
vec2 envBRDF(float NoV, float rough){
  const vec4 c0 = vec4(-1.0, -0.0275, -0.572, 0.022); const vec4 c1 = vec4(1.0, 0.0425, 1.04, -0.04);
  vec4 r = rough * c0 + c1;
  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  return vec2(-1.04, 1.04) * a004 + r.zw;
}`;

  // ---- main PBR shader (metal / paint / plastic, optional clear coat, decals, x-ray shell look) ----
  // Compiled in variants (#define) so that software rasterisers never pay for unused texture lookups.
  const pbrFS = (d) => H + `
#define FINISH ${d.finish | 0}
#define MAPMODE ${d.map | 0}
#define COAT ${d.coat ? 1 : 0}
#define XRAY ${d.xray ? 1 : 0}
in vec3 vWPos; in vec3 vNor; in vec3 vOPos; in vec2 vUv;
layout(location=0) out vec4 oCol;
${COMMON_FS}
uniform vec3 uSH[9];
uniform vec3 uColor; uniform float uMetal; uniform float uRough; uniform float uCoat; uniform float uCoatRough;
uniform vec3 uEmis;
uniform sampler2D uMap;
uniform sampler2D uNoise;
uniform float uBump;
uniform vec4 uHi;
uniform float uXray; uniform vec3 uXrayCol;
uniform float uAlpha;
uniform vec2 uFloorFade;

vec3 shIrr(vec3 n){
  return uSH[0] + uSH[1] * n.y + uSH[2] * n.z + uSH[3] * n.x + uSH[4] * (n.x * n.y) + uSH[5] * (n.y * n.z)
       + uSH[6] * (3.0 * n.z * n.z - 1.0) + uSH[7] * (n.x * n.z) + uSH[8] * (n.x * n.x - n.y * n.y);
}
vec3 bump(vec3 N, vec3 P, float h, float s){
  vec3 dpx = dFdx(P), dpy = dFdy(P);
  float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 g = (r1 * hx + r2 * hy) * sign(det);
  return normalize(abs(det) * N - s * g);
}
void main(){
  vec3 Ng = normalize(vNor);
  if (!gl_FrontFacing) Ng = -Ng;
  vec3 N = Ng;
  vec3 V = normalize(uCam - vWPos);
  vec3 base = uColor; float metal = uMetal; float rough = uRough; float alpha = uAlpha;
#if MAPMODE == 1
  { vec4 m = texture(uMap, vUv); base = mix(base, m.rgb, m.a); metal *= 1.0 - m.a; rough = mix(rough, 0.6, m.a); }
#elif MAPMODE == 2
  base = texture(uMap, vUv).rgb;
#elif MAPMODE == 3
  { vec4 m = texture(uMap, vUv); base = m.rgb; alpha *= m.a; }
#endif
#if FINISH == 1
  {   // sprayed paint: gentle orange peel
    float h = texture(uNoise, vOPos.xy * 0.017 + vOPos.z * vec2(0.0113, 0.0071)).r;
    N = bump(N, vWPos, h, uBump);
  }
#elif FINISH == 2
  {   // machined metal: fine streaks running around the part
    float h = texture(uNoise, vec2(vUv.y * 0.9, vUv.x * 0.35)).a;
    rough = clamp(rough + (h - 0.5) * 0.16, 0.03, 1.0);
  }
#elif FINISH == 3
  {   // diamond knurl (uv prepared by the mesh)
    float fw = max(fwidth(vUv.x), fwidth(vUv.y));
    float fade = clamp(1.0 - fw * 1.6, 0.0, 1.0);
    float a = abs(sin((vUv.x + vUv.y) * PI)), b = abs(sin((vUv.x - vUv.y) * PI));
    float h = min(a, b);
    N = bump(N, vWPos, h, uBump * fade);
    base *= mix(0.86, 0.72 + 0.28 * h, fade); rough = mix(rough + 0.12, rough, fade);
  }
#elif FINISH == 4
  {   // straight ribs
    float fw = fwidth(vUv.x);
    float fade = clamp(1.0 - fw * 1.6, 0.0, 1.0);
    float h = 0.5 + 0.5 * cos(vUv.x * 2.0 * PI);
    N = bump(N, vWPos, h, uBump * fade);
    base *= mix(0.85, 0.70 + 0.30 * h, fade);
  }
#elif FINISH == 5
  {   // fine textured coating / rubber
    float h = texture(uNoise, vOPos.xy * 0.085 + vOPos.z * vec2(0.057, 0.031)).a;
    N = bump(N, vWPos, h, uBump);
    rough = clamp(rough + (h - 0.5) * 0.25, 0.05, 1.0);
  }
#endif
  float NoV = max(dot(N, V), 1e-3);
  vec3 F0 = mix(vec3(0.04), base, metal);
  vec3 diffC = base * (1.0 - metal);
  float shK = 1.0, shT = 1.0;
  if (uShadowOn > 0.5){
    shK = vsm(uShKey, uKeyMat, vWPos + Ng * 0.7, 0.22);
    shT = vsm(uShTop, uTopMat, vWPos + Ng * 0.7, 0.02);
  }
  float ao = mix(0.30, 1.0, shT);
  float NoL = max(dot(N, uKeyDir), 0.0);
  vec3 col = diffC * uKeyCol * (NoL * shK);
  vec3 R = reflect(-V, N);
  vec3 envS = textureLod(uEnv, R, rough * 5.0).rgb;
  vec2 ab = envBRDF(NoV, rough);
  float kw = smoothstep(0.50 - 0.45 * rough, 0.97, dot(R, uKeyDir));
  float specOcc = mix(1.0, shK, kw) * mix(0.40, 1.0, shT);
  col += diffC * max(shIrr(N), vec3(0.0)) * (ao * uEnvInt);
  col += envS * (F0 * ab.x + ab.y) * (specOcc * uEnvInt);
#if COAT == 1
  {
    float Fc = (0.04 + 0.96 * pow(1.0 - max(dot(Ng, V), 0.0), 5.0)) * uCoat;
    vec3 envC = textureLod(uEnv, reflect(-V, Ng), uCoatRough * 5.0).rgb;
    col = col * (1.0 - Fc) + envC * (Fc * specOcc * uEnvInt);
  }
#endif
  col += uEmis;
  float fres = pow(1.0 - NoV, 2.2);
  col += uHi.rgb * uHi.a * (0.10 + 1.5 * fres);
#if FINISH == 7
  {   // studio floor: fades into the backdrop
    float d = length(vWPos.xz);
    col = mix(col, bgColor(gl_FragCoord.xy * uInvRes), smoothstep(uFloorFade.x, uFloorFade.y, d));
  }
#endif
#if XRAY == 1
  {
    float f2 = pow(1.0 - NoV, 1.5);
    vec3 xc = uXrayCol * (0.10 + 1.25 * f2) + col * 0.30;
    col = mix(col, xc, uXray);
    alpha *= mix(1.0, 0.07 + 0.60 * f2, uXray);
  }
#endif
  oCol = vec4(col, alpha);
}`;

  // ---- glass: screen-space refraction of the opaque scene + coated reflections ----
  const GLASS_FS = H + `
in vec3 vWPos; in vec3 vNor; in vec3 vOPos; in vec2 vUv;
layout(location=0) out vec4 oCol;
${COMMON_FS}
uniform sampler2D uScene; uniform mat4 uView;
uniform vec3 uTint; uniform float uRefr; uniform float uRough; uniform vec3 uCoating; uniform float uF0; uniform float uBody;
uniform vec4 uHi;
void main(){
  vec3 N = normalize(vNor);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCam - vWPos);
  float NoV = max(dot(N, V), 1e-3);
  vec3 Rr = refract(-V, N, 1.0 / 1.52);
  vec2 off = (mat3(uView) * (Rr + V)).xy;
  vec2 uv = clamp(gl_FragCoord.xy * uInvRes + off * uRefr, vec2(0.002), vec2(0.998));
  vec3 tr = texture(uScene, uv).rgb;
  // body colour: thicker looking towards grazing angles
  tr *= mix(uTint, uTint * uTint, pow(1.0 - NoV, 2.0) * uBody);
  float F = uF0 + (1.0 - uF0) * pow(1.0 - NoV, 5.0);
  vec3 R = reflect(-V, N);
  vec3 rf = textureLod(uEnv, R, uRough * 5.0).rgb * uEnvInt;
  float shT = uShadowOn > 0.5 ? vsm(uShTop, uTopMat, vWPos + N * 0.7, 0.02) : 1.0;
  rf *= mix(0.45, 1.0, shT);
  vec3 col = tr * (1.0 - F) + rf * mix(uCoating, vec3(1.0), pow(1.0 - NoV, 3.0)) * F;
  float fres = pow(1.0 - NoV, 2.2);
  col += uHi.rgb * uHi.a * (0.10 + 1.5 * fres);
  oCol = vec4(col, 1.0);
}`;

  // ---- glowing light beams (additive) ----
  const BEAM_FS = H + `
in vec3 vWPos; in vec3 vNor; in vec3 vOPos; in vec2 vUv;
layout(location=0) out vec4 oCol;
uniform vec3 uCam; uniform float uTime;
uniform vec3 uColor; uniform float uIntensity; uniform float uFront; uniform float uDim; uniform float uSoft;
void main(){
  vec3 N = normalize(vNor);
  vec3 V = normalize(uCam - vWPos);
  float nv = abs(dot(N, V));
  float body = pow(nv, uSoft);
  float s = vUv.y;                      // distance along the light path (mm)
  float flow = 0.62 + 0.38 * sin(s * 0.16 - uTime * 5.5);
  float pulse = smoothstep(0.0, 1.0, 1.0 - abs(fract(s * 0.0042 - uTime * 0.42) - 0.5) * 2.0);
  pulse = pow(pulse, 6.0);
  float reveal = 1.0 - smoothstep(uFront - 26.0, uFront, s);
  float head = smoothstep(uFront - 40.0, uFront - 8.0, s) * reveal;
  vec3 col = uColor * (uIntensity * body * (flow + pulse * 1.3) * reveal) + uColor * head * 2.4 * body;
  oCol = vec4(col * uDim, 1.0);
}`;

  const POINTS_VS = H + `
layout(location=0) in vec4 aPos;     // xyz + size (mm)
layout(location=1) in vec4 aCol;
uniform mat4 uViewProj; uniform float uPx;
out vec4 vCol;
void main(){
  gl_Position = uViewProj * vec4(aPos.xyz, 1.0);
  gl_PointSize = clamp(aPos.w * uPx / max(gl_Position.w, 1.0), 1.0, 64.0);
  vCol = aCol;
}`;
  const POINTS_FS = H + `
in vec4 vCol; out vec4 o; uniform float uDim;
void main(){
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;
  float g = exp(-r * 3.2);
  o = vec4(vCol.rgb * vCol.a * g * uDim, 1.0);
}`;

  const BG_FS = H + `
in vec2 vUv; out vec4 o;
uniform vec3 uBgTop; uniform vec3 uBgBot; uniform vec3 uBgGlow;
void main(){
  vec3 c = mix(uBgBot, uBgTop, smoothstep(0.0, 1.0, vUv.y));
  float r = length((vUv - vec2(0.5, 0.40)) * vec2(1.0, 1.25));
  o = vec4(mix(uBgGlow, c, smoothstep(0.0, 0.85, r)), 1.0);
}`;

  // ---- bloom ----
  const BLOOM_PRE_FS = H + `
in vec2 vUv; out vec4 o; uniform sampler2D uTex; uniform vec2 uTexel; uniform float uThreshold;
vec3 pre(vec2 uv){
  vec3 c = min(texture(uTex, uv).rgb, vec3(60.0));
  float l = max(c.r, max(c.g, c.b));
  float k = max(l - uThreshold, 0.0) / max(l, 1e-4);
  return c * k;
}
void main(){
  vec2 d = uTexel * 0.5;
  o = vec4((pre(vUv + vec2(-d.x, -d.y)) + pre(vUv + vec2(d.x, -d.y)) + pre(vUv + vec2(-d.x, d.y)) + pre(vUv + vec2(d.x, d.y))) * 0.25, 1.0);
}`;
  const BLOOM_DOWN_FS = H + `
in vec2 vUv; out vec4 o; uniform sampler2D uTex; uniform vec2 uTexel;
void main(){
  vec2 d = uTexel;
  vec3 c = texture(uTex, vUv).rgb * 4.0;
  c += texture(uTex, vUv + vec2(-d.x, -d.y)).rgb + texture(uTex, vUv + vec2(d.x, -d.y)).rgb + texture(uTex, vUv + vec2(-d.x, d.y)).rgb + texture(uTex, vUv + vec2(d.x, d.y)).rgb;
  o = vec4(c / 8.0, 1.0);
}`;
  const BLOOM_UP_FS = H + `
in vec2 vUv; out vec4 o; uniform sampler2D uTex; uniform sampler2D uAdd; uniform vec2 uTexel; uniform float uMix;
void main(){
  vec2 d = uTexel;
  vec3 c = texture(uTex, vUv + vec2(-d.x, -d.y)).rgb + texture(uTex, vUv + vec2(d.x, -d.y)).rgb + texture(uTex, vUv + vec2(-d.x, d.y)).rgb + texture(uTex, vUv + vec2(d.x, d.y)).rgb;
  o = vec4(texture(uAdd, vUv).rgb + c * 0.25 * uMix, 1.0);
}`;

  // ---- tone mapping + output ----
  const COMPOSITE_FS = H + `
in vec2 vUv; out vec4 o;
uniform sampler2D uHdr; uniform sampler2D uBloom;
uniform float uExposure; uniform float uBloomStr; uniform float uVignette; uniform float uTime;
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
void main(){
  vec3 c = texture(uHdr, vUv).rgb + texture(uBloom, vUv).rgb * uBloomStr;
  c *= uExposure;
  c = aces(c);
  c = pow(c, vec3(1.0 / 2.2));
  vec2 q = vUv - 0.5;
  c *= 1.0 - uVignette * dot(q, q) * 1.6;
  float n = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) / 255.0;
  o = vec4(c, dot(c, vec3(0.299, 0.587, 0.114)));
}`;

  // compact FXAA (luma in alpha)
  const FXAA_FS = H + `
in vec2 vUv; out vec4 o; uniform sampler2D uTex; uniform vec2 uTexel;
void main(){
  vec3 rgbM = texture(uTex, vUv).rgb;
  float lM = texture(uTex, vUv).a;
  float lNW = texture(uTex, vUv + vec2(-1.0, -1.0) * uTexel).a;
  float lNE = texture(uTex, vUv + vec2(1.0, -1.0) * uTexel).a;
  float lSW = texture(uTex, vUv + vec2(-1.0, 1.0) * uTexel).a;
  float lSE = texture(uTex, vUv + vec2(1.0, 1.0) * uTexel).a;
  float lMin = min(lM, min(min(lNW, lNE), min(lSW, lSE)));
  float lMax = max(lM, max(max(lNW, lNE), max(lSW, lSE)));
  if (lMax - lMin < max(0.031, lMax * 0.10)) { o = vec4(rgbM, 1.0); return; }
  vec2 dir = vec2(-((lNW + lNE) - (lSW + lSE)), ((lNW + lSW) - (lNE + lSE)));
  float red = max((lNW + lNE + lSW + lSE) * 0.03125, 0.0078125);
  float rc = 1.0 / (min(abs(dir.x), abs(dir.y)) + red);
  dir = clamp(dir * rc, vec2(-8.0), vec2(8.0)) * uTexel;
  vec3 a = 0.5 * (texture(uTex, vUv + dir * (1.0 / 3.0 - 0.5)).rgb + texture(uTex, vUv + dir * (2.0 / 3.0 - 0.5)).rgb);
  vec4 b4 = 0.25 * (texture(uTex, vUv + dir * -0.5) + texture(uTex, vUv + dir * 0.5));
  vec3 b = a * 0.5 + b4.rgb;
  float lB = dot(b, vec3(0.299, 0.587, 0.114));
  o = vec4((lB < lMin || lB > lMax) ? a : b, 1.0);
}`;

  const COPY_FS = H + `
in vec2 vUv; out vec4 o; uniform sampler2D uTex;
void main(){ o = vec4(texture(uTex, vUv).rgb, 1.0); }`;

  S.SHADERS = { FS_VS, ENVGEN_FS, prefilterFS, IRRADIANCE_FS, MESH_VS, DEPTH_VS, DEPTH_FS, BLUR_FS, pbrFS, GLASS_FS, BEAM_FS, POINTS_VS, POINTS_FS, BG_FS, BLOOM_PRE_FS, BLOOM_DOWN_FS, BLOOM_UP_FS, COMPOSITE_FS, FXAA_FS, COPY_FS };
})();
