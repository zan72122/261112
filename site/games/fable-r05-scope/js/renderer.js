// Hand-written WebGL2 forward renderer:
//   HDR (RGBA16F) + optional 4x MSAA, image based lighting from a procedural studio,
//   variance soft shadows (key light + overhead occlusion), screen-space refraction for glass,
//   additive light beams, bloom, ACES tone mapping, FXAA.
(function () {
  'use strict';
  const S = window.SCOPE;
  const { M, V } = S;
  const SH = S.SHADERS;

  class Program {
    constructor(gl, vsSrc, fsSrc, name) {
      this.gl = gl; this.name = name;
      const mk = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('shader ' + name + ': ' + gl.getShaderInfoLog(s));
        return s;
      };
      const p = (this.p = gl.createProgram());
      gl.attachShader(p, mk(gl.VERTEX_SHADER, vsSrc)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fsSrc));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link ' + name + ': ' + gl.getProgramInfoLog(p));
      this.u = {}; this.samplers = [];
      gl.useProgram(p);
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(p, i);
        const nm = info.name.replace(/\[0\]$/, '');
        const u = { loc: gl.getUniformLocation(p, info.name), type: info.type };
        if (info.type === gl.SAMPLER_2D || info.type === gl.SAMPLER_CUBE) {
          u.unit = this.samplers.length; u.target = info.type === gl.SAMPLER_2D ? gl.TEXTURE_2D : gl.TEXTURE_CUBE_MAP;
          gl.uniform1i(u.loc, u.unit);
          this.samplers.push(nm);
        }
        this.u[nm] = u;
      }
    }
    use() { this.gl.useProgram(this.p); return this; }
    set(name, v) {
      const u = this.u[name];
      if (!u) return this;
      const gl = this.gl;
      switch (u.type) {
        case gl.FLOAT: gl.uniform1f(u.loc, v); break;
        case gl.INT: case gl.BOOL: gl.uniform1i(u.loc, v); break;
        case gl.FLOAT_VEC2: gl.uniform2f(u.loc, v[0], v[1]); break;
        case gl.FLOAT_VEC3: if (v.length > 3) gl.uniform3fv(u.loc, v); else gl.uniform3f(u.loc, v[0], v[1], v[2]); break;
        case gl.FLOAT_VEC4: gl.uniform4f(u.loc, v[0], v[1], v[2], v[3]); break;
        case gl.FLOAT_MAT3: gl.uniformMatrix3fv(u.loc, false, v); break;
        case gl.FLOAT_MAT4: gl.uniformMatrix4fv(u.loc, false, v); break;
        default: break;
      }
      return this;
    }
    tex(name, texture) {
      const u = this.u[name];
      if (!u) return this;
      const gl = this.gl;
      gl.activeTexture(gl.TEXTURE0 + u.unit);
      gl.bindTexture(u.target, texture);
      return this;
    }
  }

  class Renderer {
    constructor(canvas) {
      const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
      if (!gl) throw new Error('WebGL2 is not available');
      this.gl = gl; this.canvas = canvas;
      this.caps = {
        float: !!gl.getExtension('EXT_color_buffer_float'),
        floatLinear: !!gl.getExtension('OES_texture_float_linear'),
        aniso: gl.getExtension('EXT_texture_filter_anisotropic'),
      };
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      this.caps.renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      this.caps.software = /swiftshader|llvmpipe|software/i.test(this.caps.renderer);
      this.caps.msaa = this.caps.float ? Math.min(4, Math.max(0, ...Array.from(gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA16F, gl.SAMPLES) || [0]))) : 0;
      this.hdrInternal = this.caps.float ? gl.RGBA16F : gl.RGBA8;
      this.hdrType = this.caps.float ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
      this.shadowsOK = this.caps.float && this.caps.floatLinear;

      const P = (vs, fs, name) => new Program(gl, vs, fs, name);
      this.prog = {
        envgen: P(SH.FS_VS, SH.ENVGEN_FS, 'envgen'), prefilter: P(SH.FS_VS, SH.prefilterFS(this.caps.software ? 40 : 96), 'prefilter'), irradiance: P(SH.FS_VS, SH.IRRADIANCE_FS, 'irradiance'),
        depth: P(SH.DEPTH_VS, SH.DEPTH_FS, 'depth'), blur: P(SH.FS_VS, SH.BLUR_FS, 'blur'),
        glass: P(SH.MESH_VS, SH.GLASS_FS, 'glass'), beam: P(SH.MESH_VS, SH.BEAM_FS, 'beam'),
        points: P(SH.POINTS_VS, SH.POINTS_FS, 'points'), bg: P(SH.FS_VS, SH.BG_FS, 'bg'),
        bloomPre: P(SH.FS_VS, SH.BLOOM_PRE_FS, 'bloomPre'), bloomDown: P(SH.FS_VS, SH.BLOOM_DOWN_FS, 'bloomDown'), bloomUp: P(SH.FS_VS, SH.BLOOM_UP_FS, 'bloomUp'),
        composite: P(SH.FS_VS, SH.COMPOSITE_FS, 'composite'), fxaa: P(SH.FS_VS, SH.FXAA_FS, 'fxaa'), copy: P(SH.FS_VS, SH.COPY_FS, 'copy'),
      };
      this.pbrVariants = new Map();
      this.frameId = 0;
      this.emptyVAO = gl.createVertexArray();
      this.white = this.texture(new Uint8Array([255, 255, 255, 255]), { w: 1, h: 1, mips: false });
      this.black = this.texture(new Uint8Array([0, 0, 0, 255]), { w: 1, h: 1, mips: false });
      this.noise = this._noiseTexture();
      this.dummyCube = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.dummyCube);
      for (let f = 0; f < 6; f++) gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      this.keyDir = V.norm([-0.56, 0.68, 0.47]);
      this._buildEnvironment();
      this._buildShadowTargets();
      this.width = 0; this.height = 0; this.msaa = 0;
      this.stats = { draws: 0, tris: 0 };
      this.points = { vao: gl.createVertexArray(), buf: gl.createBuffer(), cap: 0, count: 0 };
      gl.bindVertexArray(this.points.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.points.buf);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 32, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 16);
      gl.bindVertexArray(null);
    }

    // ---------- resources ----------
    mesh(b, dynamic) {
      const gl = this.gl;
      const m = { vao: gl.createVertexArray(), bufs: [], count: b.indices.length, min: b.min, max: b.max, positions: b.positions, indices: b.indices, dynamic: !!dynamic };
      gl.bindVertexArray(m.vao);
      const usage = dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
      [[b.positions, 3], [b.normals, 3], [b.uvs, 2]].forEach(([data, size], loc) => {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        m.bufs.push(buf);
      });
      m.ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, b.indices, usage);
      gl.bindVertexArray(null);
      return m;
    }
    updateMesh(m, b) {
      const gl = this.gl;
      gl.bindVertexArray(m.vao);
      [b.positions, b.normals, b.uvs].forEach((data, k) => { gl.bindBuffer(gl.ARRAY_BUFFER, m.bufs[k]); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW); });
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, b.indices, gl.DYNAMIC_DRAW);
      gl.bindVertexArray(null);
      m.count = b.indices.length; m.min = b.min; m.max = b.max; m.positions = b.positions; m.indices = b.indices;
    }
    // source: canvas / ImageData, or Uint8Array with {w,h}
    texture(source, opts = {}) {
      const gl = this.gl, t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      const internal = opts.srgb ? gl.SRGB8_ALPHA8 : gl.RGBA8;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      if (source instanceof Uint8Array) gl.texImage2D(gl.TEXTURE_2D, 0, internal, opts.w, opts.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
      else gl.texImage2D(gl.TEXTURE_2D, 0, internal, gl.RGBA, gl.UNSIGNED_BYTE, source);
      const mips = opts.mips !== false;
      if (mips) gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      const wrap = opts.repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
      if (this.caps.aniso && mips) gl.texParameterf(gl.TEXTURE_2D, this.caps.aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(this.caps.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
      return t;
    }
    _noiseTexture() {
      // tileable smooth noise in 4 channels (different octave mixes), 256^2
      const n = 256, data = new Uint8Array(n * n * 4);
      let seed = 1337;
      const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const layer = (cells) => {
        const g = new Float32Array(cells * cells);
        for (let i = 0; i < g.length; i++) g[i] = rnd();
        const out = new Float32Array(n * n);
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
          const fx = (x / n) * cells, fy = (y / n) * cells, ix = Math.floor(fx), iy = Math.floor(fy);
          let tx = fx - ix, ty = fy - iy;
          tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
          const a = g[(iy % cells) * cells + (ix % cells)], b = g[(iy % cells) * cells + ((ix + 1) % cells)];
          const c = g[((iy + 1) % cells) * cells + (ix % cells)], d = g[((iy + 1) % cells) * cells + ((ix + 1) % cells)];
          out[y * n + x] = a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
        }
        return out;
      };
      const ch = [
        [layer(16), layer(32), layer(64)], [layer(16), layer(32), layer(64)], [layer(16), layer(32), layer(64)], [layer(64), layer(128), layer(128)],
      ];
      for (let i = 0; i < n * n; i++) for (let c = 0; c < 4; c++) data[i * 4 + c] = Math.round(255 * (ch[c][0][i] * 0.5 + ch[c][1][i] * 0.3 + ch[c][2][i] * 0.2));
      return this.texture(data, { w: n, h: n, repeat: true });
    }

    _fsDraw() { const gl = this.gl; gl.bindVertexArray(this.emptyVAO); gl.drawArrays(gl.TRIANGLES, 0, 3); }

    _cube(size, levels) {
      const gl = this.gl, t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, t);
      gl.texStorage2D(gl.TEXTURE_CUBE_MAP, levels, this.hdrInternal, size, size);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, levels > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    }
    _buildEnvironment() {
      const gl = this.gl, fbo = gl.createFramebuffer();
      // software rasterisers get a smaller bake (same look, ~10x less start-up work)
      const SIZE = this.caps.software ? 128 : 256, LEVELS = 6;
      const allLevels = Math.log2(SIZE) + 1;
      const src = this._cube(SIZE, allLevels), srcNoKey = this._cube(64, 7);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
      const gen = (tex, size, noKey) => {
        const p = this.prog.envgen.use();
        p.set('uNoKey', noKey).set('uKeyDir', this.keyDir);
        gl.viewport(0, 0, size, size);
        for (let f = 0; f < 6; f++) {
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, tex, 0);
          p.set('uFace', f);
          this._fsDraw();
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex); gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      };
      gen(src, SIZE, 0); gen(srcNoKey, 64, 1);
      this.env = this._cube(SIZE, LEVELS);
      this.envSize = SIZE;
      const pf = this.prog.prefilter.use();
      pf.tex('uSrc', src).set('uSrcSize', SIZE);
      for (let l = 0; l < LEVELS; l++) {
        const sz = SIZE >> l;
        gl.viewport(0, 0, sz, sz);
        pf.set('uRough', l / (LEVELS - 1));
        for (let f = 0; f < 6; f++) {
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, this.env, l);
          pf.set('uFace', f);
          this._fsDraw();
        }
      }
      // diffuse lighting: cosine-convolved cube -> 9 spherical-harmonic coefficients (no texture lookup per pixel)
      const IR = this.caps.software ? 16 : 32, irr = this._cube(IR, 1);
      const ir = this.prog.irradiance.use();
      ir.tex('uSrc', srcNoKey);
      gl.viewport(0, 0, IR, IR);
      const sh = new Float64Array(27);
      let wsum = 0;
      const dirOf = (f, u, v) => {
        const x = u * 2 - 1, y = v * 2 - 1;
        return [[1, -y, -x], [-1, -y, x], [x, 1, y], [x, -1, -y], [x, -y, 1], [-x, -y, -1]][f];
      };
      for (let f = 0; f < 6; f++) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, irr, 0);
        ir.set('uFace', f);
        this._fsDraw();
        let px;
        if (this.caps.float) { px = new Float32Array(IR * IR * 4); gl.readPixels(0, 0, IR, IR, gl.RGBA, gl.FLOAT, px); }
        else { const b8 = new Uint8Array(IR * IR * 4); gl.readPixels(0, 0, IR, IR, gl.RGBA, gl.UNSIGNED_BYTE, b8); px = Float32Array.from(b8, (q) => q / 255); }
        for (let j = 0; j < IR; j++) for (let i = 0; i < IR; i++) {
          const d = dirOf(f, (i + 0.5) / IR, (j + 0.5) / IR);
          const l2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], l = Math.sqrt(l2);
          const w = 1 / (l2 * l), x = d[0] / l, y = d[1] / l, z = d[2] / l;
          const Y = [0.282095, 0.488603 * y, 0.488603 * z, 0.488603 * x, 1.092548 * x * y, 1.092548 * y * z, 0.315392 * (3 * z * z - 1), 1.092548 * x * z, 0.546274 * (x * x - y * y)];
          const o = (j * IR + i) * 4;
          for (let k = 0; k < 9; k++) for (let c = 0; c < 3; c++) sh[k * 3 + c] += px[o + c] * Y[k] * w;
          wsum += w;
        }
      }
      const K = [0.282095, 0.488603, 0.488603, 0.488603, 1.092548, 1.092548, 0.315392, 1.092548, 0.546274];
      this.sh = new Float32Array(27);
      for (let k = 0; k < 9; k++) for (let c = 0; c < 3; c++) this.sh[k * 3 + c] = (sh[k * 3 + c] * (4 * Math.PI / wsum)) * K[k];
      gl.deleteTexture(irr);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo); gl.deleteTexture(src); gl.deleteTexture(srcNoKey);
    }

    _tex2D(w, h, internal, format, type, filter) {
      const gl = this.gl, t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    }
    _target(w, h, internal, format, type, filter, depth) {
      const gl = this.gl, t = { w, h, fbo: gl.createFramebuffer(), tex: this._tex2D(w, h, internal, format, type, filter) };
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
      if (depth) {
        t.depth = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, t.depth);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, t.depth);
      }
      return t;
    }
    _freeTarget(t) {
      if (!t) return;
      const gl = this.gl;
      gl.deleteFramebuffer(t.fbo);
      if (t.tex) gl.deleteTexture(t.tex);
      if (t.depth) gl.deleteRenderbuffer(t.depth);
      if (t.color) gl.deleteRenderbuffer(t.color);
    }

    _buildShadowTargets() {
      if (!this.shadowsOK) return;
      const gl = this.gl;
      const mk = (size) => ({
        size,
        a: this._target(size, size, gl.RG32F, gl.RG, gl.FLOAT, gl.LINEAR, true),
        b: this._target(size, size, gl.RG32F, gl.RG, gl.FLOAT, gl.LINEAR, false),
      });
      this.shKey = mk(1024); this.shTop = mk(512);
      // key light: orthographic, looking at the instrument
      const c = [0, 215, -45], R = 430;
      const eye = V.addScaled(c, this.keyDir, 900);
      this.shKey.mat = M.mul(M.ortho(-R, R, -R, R, 200, 1700), M.lookAt(eye, c, [0, 1, 0]));
      // overhead occlusion "sky" light
      this.shTop.mat = M.mul(M.ortho(-R, R, -R, R, 100, 1100), M.lookAt([0, 1000, -45], [0, 0, -45], [0, 0, -1]));
    }

    setSize(w, h, msaa) {
      const gl = this.gl;
      w = Math.max(16, Math.floor(w)); h = Math.max(16, Math.floor(h));
      msaa = Math.min(msaa || 0, this.caps.msaa);
      if (w === this.width && h === this.height && msaa === this.msaa) return;
      this.width = w; this.height = h; this.msaa = msaa;
      if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
      [this.hdr, this.scene, this.ldr, this.main].forEach((t) => this._freeTarget(t));
      (this.bloom || []).forEach((t) => this._freeTarget(t));
      (this.bloomUp || []).forEach((t) => this._freeTarget(t));
      const I = this.hdrInternal, T = this.hdrType;
      this.hdr = this._target(w, h, I, gl.RGBA, T, gl.LINEAR, msaa === 0);
      this.scene = this._target(w, h, I, gl.RGBA, T, gl.LINEAR, false);
      this.ldr = this._target(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR, false);
      if (msaa > 0) {
        const t = (this.main = { w, h, fbo: gl.createFramebuffer(), color: gl.createRenderbuffer(), depth: gl.createRenderbuffer() });
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.bindRenderbuffer(gl.RENDERBUFFER, t.color); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, msaa, gl.RGBA16F, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, t.color);
        gl.bindRenderbuffer(gl.RENDERBUFFER, t.depth); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, msaa, gl.DEPTH_COMPONENT24, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, t.depth);
      } else this.main = null;
      this.bloom = []; this.bloomUp = [];
      let bw = w >> 1, bh = h >> 1;
      for (let k = 0; k < 5 && bw >= 8 && bh >= 8; k++) {
        this.bloom.push(this._target(bw, bh, I, gl.RGBA, T, gl.LINEAR, false));
        this.bloomUp.push(this._target(bw, bh, I, gl.RGBA, T, gl.LINEAR, false));
        bw >>= 1; bh >>= 1;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // ---------- shadows ----------
    renderShadows(items) {
      if (!this.shadowsOK) return;
      const gl = this.gl, p = this.prog.depth;
      gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.disable(gl.CULL_FACE);
      const pass = (sh, steps) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, sh.a.fbo);
        gl.viewport(0, 0, sh.size, sh.size);
        gl.clearColor(1, 1, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        p.use().set('uViewProj', sh.mat);
        for (const it of items) {
          if (!it.visible || it.cast === false || it.layer !== 'opaque') continue;
          p.set('uModel', it.world);
          gl.bindVertexArray(it.mesh.vao);
          gl.drawElements(gl.TRIANGLES, it.mesh.count, gl.UNSIGNED_INT, 0);
        }
        gl.disable(gl.DEPTH_TEST);
        const b = this.prog.blur.use();
        for (const st of steps) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, sh.b.fbo);
          b.tex('uTex', sh.a.tex).set('uStep', [st / sh.size, 0]); this._fsDraw();
          gl.bindFramebuffer(gl.FRAMEBUFFER, sh.a.fbo);
          b.tex('uTex', sh.b.tex).set('uStep', [0, st / sh.size]); this._fsDraw();
        }
        gl.enable(gl.DEPTH_TEST);
      };
      pass(this.shKey, this.shadowSoft || [1.0, 1.6]);
      pass(this.shTop, [1.0, 2.2, 4.0]);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // ---------- frame ----------
    _common(p, f) {
      const L = f.look;
      p.set('uViewProj', f.viewProj).set('uCam', f.camPos).set('uTime', f.time)
        .set('uEnvInt', L.envInt).set('uKeyDir', this.keyDir).set('uKeyCol', L.keyCol)
        .set('uShadowOn', this.shadowsOK && L.shadows !== false ? 1 : 0)
        .set('uInvRes', [1 / this.width, 1 / this.height])
        .set('uBgTop', L.bgTop).set('uBgBot', L.bgBot).set('uBgGlow', L.bgGlow);
      p.tex('uEnv', this.env).set('uSH', this.sh);
      p.tex('uNoise', this.noise);
      p.tex('uShKey', this.shadowsOK ? this.shKey.a.tex : this.white).tex('uShTop', this.shadowsOK ? this.shTop.a.tex : this.white);
      if (this.shadowsOK) p.set('uKeyMat', this.shKey.mat).set('uTopMat', this.shTop.mat);
    }
    _pbr(m, xray, f) {
      const key = (m.finish || 0) + '|' + (m.map ? m.mapMode || 1 : 0) + '|' + (m.coat ? 1 : 0) + '|' + (xray ? 1 : 0);
      let p = this.pbrVariants.get(key);
      if (!p) {
        p = new Program(this.gl, SH.MESH_VS, SH.pbrFS({ finish: m.finish || 0, map: m.map ? m.mapMode || 1 : 0, coat: !!m.coat, xray }), 'pbr:' + key);
        this.pbrVariants.set(key, p);
      }
      p.use();
      if (f && p.frameId !== this.frameId) { p.frameId = this.frameId; this._common(p, f); }
      return p;
    }
    // Shader variants: the ones needed for the first frame are compiled lazily by the first draw;
    // the "ghost shell" variants are returned as a to-do list so the app can compile one per frame.
    pendingVariants(items) {
      const todo = [], seen = new Set();
      for (const it of items) {
        if (!it.canXray) continue;
        const m = it.material, key = (m.finish || 0) + '|' + (m.map ? m.mapMode || 1 : 0) + '|' + (m.coat ? 1 : 0) + '|1';
        if (!seen.has(key) && !this.pbrVariants.has(key)) { seen.add(key); todo.push(m); }
      }
      return todo;
    }
    _drawItem(p, it) {
      const gl = this.gl;
      p.set('uModel', it.world).set('uNormalMat', it.normalMat);
      gl.bindVertexArray(it.mesh.vao);
      gl.drawElements(gl.TRIANGLES, it.mesh.count, gl.UNSIGNED_INT, 0);
      this.stats.draws++; this.stats.tris += it.mesh.count / 3;
    }
    _pbrMaterial(p, it, f, xray) {
      const m = it.material;
      p.set('uColor', m.color).set('uMetal', m.metal || 0).set('uRough', m.rough === undefined ? 0.5 : m.rough)
        .set('uCoat', m.coat || 0).set('uCoatRough', m.coatRough === undefined ? 0.1 : m.coatRough)
        .set('uEmis', it.emissive || m.emissive || [0, 0, 0])
        .set('uBump', m.bump || 0)
        .set('uHi', it.hi > 0.001 ? [f.look.hiCol[0], f.look.hiCol[1], f.look.hiCol[2], it.hi] : [0, 0, 0, 0])
        .set('uXray', xray).set('uXrayCol', f.look.xrayCol).set('uAlpha', m.alpha === undefined ? 1 : m.alpha)
        .set('uFloorFade', f.look.floorFade);
      p.tex('uMap', m.map || this.white);
    }

    render(f) {
      const gl = this.gl, L = f.look, items = f.items;
      this.stats.draws = 0; this.stats.tris = 0;
      if (f.shadowDirty) this.renderShadows(items);

      // bucket + sort
      const opaque = [], glass = [], decals = [], shells = [], beams = [];
      const fw = f.camForward, cp = f.camPos;
      for (const it of items) {
        if (!it.visible) continue;
        const c = it.center;
        it.depth = (c[0] - cp[0]) * fw[0] + (c[1] - cp[1]) * fw[1] + (c[2] - cp[2]) * fw[2];
        if (it.layer === 'opaque') (it.xray > 0.004 ? shells : opaque).push(it);
        else if (it.layer === 'glass') glass.push(it);
        else if (it.layer === 'decal') decals.push(it);
        else if (it.layer === 'beam') beams.push(it);
      }
      opaque.sort((a, b) => a.depth - b.depth);
      glass.sort((a, b) => b.depth - a.depth);
      shells.sort((a, b) => b.depth - a.depth);

      const mainFbo = this.main ? this.main.fbo : this.hdr.fbo;
      gl.bindFramebuffer(gl.FRAMEBUFFER, mainFbo);
      gl.viewport(0, 0, this.width, this.height);
      gl.depthMask(true); gl.clearDepth(1); gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
      this.prog.bg.use().set('uBgTop', L.bgTop).set('uBgBot', L.bgBot).set('uBgGlow', L.bgGlow);
      this._fsDraw();

      // opaque: depth pre-pass first, so every pixel is shaded exactly once
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
      this.frameId++;
      if (f.prepass !== false) {
        gl.colorMask(false, false, false, false);
        const dp = this.prog.depth.use().set('uViewProj', f.viewProj);
        for (const it of opaque) {
          if (it.doubleSided) gl.disable(gl.CULL_FACE); else gl.enable(gl.CULL_FACE);
          dp.set('uModel', it.world);
          gl.bindVertexArray(it.mesh.vao);
          gl.drawElements(gl.TRIANGLES, it.mesh.count, gl.UNSIGNED_INT, 0);
        }
        gl.colorMask(true, true, true, true);
        gl.depthMask(false);
      }
      for (const it of opaque) {
        if (it.doubleSided) gl.disable(gl.CULL_FACE); else gl.enable(gl.CULL_FACE);
        const pbr = this._pbr(it.material, false, f);
        this._pbrMaterial(pbr, it, f, 0);
        this._drawItem(pbr, it);
      }
      gl.enable(gl.CULL_FACE); gl.depthMask(true);

      // copy of the opaque scene for refraction
      if (glass.length) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, mainFbo); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.scene.fbo);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        gl.bindFramebuffer(gl.FRAMEBUFFER, mainFbo);
        gl.depthMask(false);
        const gp = this.prog.glass.use();
        this._common(gp, f);
        gp.set('uView', f.view).tex('uScene', this.scene.tex);
        for (const it of glass) {
          const m = it.material;
          gp.set('uTint', m.tint || [1, 1, 1]).set('uRefr', m.refr === undefined ? 0.05 : m.refr).set('uRough', m.rough || 0.02)
            .set('uCoating', m.coating || [1, 1, 1]).set('uF0', m.f0 === undefined ? 0.04 : m.f0).set('uBody', m.body || 0)
            .set('uHi', it.hi > 0.001 ? [L.hiCol[0], L.hiCol[1], L.hiCol[2], it.hi] : [0, 0, 0, 0]);
          this._drawItem(gp, it);
        }
      }

      // blended: decals, then x-ray shells
      gl.depthMask(false);
      gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      if (decals.length || shells.length) {
        gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-2, -2);
        for (const it of decals) { const pbr = this._pbr(it.material, false, f); this._pbrMaterial(pbr, it, f, 0); this._drawItem(pbr, it); }
        gl.disable(gl.POLYGON_OFFSET_FILL);
        for (const it of shells) { const pbr = this._pbr(it.material, true, f); this._pbrMaterial(pbr, it, f, it.xray); this._drawItem(pbr, it); }
      }

      // light beams (additive): first the parts hidden behind solid objects (dim), then the visible parts
      if (beams.length || this.points.count) {
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.disable(gl.CULL_FACE);
        const bp = this.prog.beam.use();
        bp.set('uViewProj', f.viewProj).set('uCam', f.camPos).set('uTime', f.time);
        const pp = this.prog.points;
        for (let pass = 0; pass < 2; pass++) {
          gl.depthFunc(pass === 0 ? gl.GREATER : gl.LEQUAL);
          const dim = pass === 0 ? L.beamThrough : 1;
          if (dim <= 0.001) continue;
          bp.use().set('uDim', dim);
          for (const it of beams) {
            const m = it.material;
            bp.set('uColor', m.color).set('uIntensity', (m.intensity || 1) * (it.gain === undefined ? 1 : it.gain)).set('uFront', f.beamFront === undefined ? 1e9 : f.beamFront).set('uSoft', m.soft || 1.5);
            this._drawItem(bp, it);
          }
          if (this.points.count) {
            pp.use().set('uViewProj', f.viewProj).set('uPx', this.height * f.proj[5] * 0.5).set('uDim', dim);
            gl.bindVertexArray(this.points.vao);
            gl.drawArrays(gl.POINTS, 0, this.points.count);
            this.stats.draws++;
          }
        }
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
      }
      gl.disable(gl.BLEND); gl.depthMask(true);

      // resolve
      if (this.main) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.main.fbo); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.hdr.fbo);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
      }
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);

      // bloom
      let bloomTex = this.black;
      if (L.bloom > 0.001 && this.bloom.length) {
        const B = this.bloom, U = this.bloomUp;
        gl.bindFramebuffer(gl.FRAMEBUFFER, B[0].fbo); gl.viewport(0, 0, B[0].w, B[0].h);
        this.prog.bloomPre.use().tex('uTex', this.hdr.tex).set('uTexel', [1 / this.width, 1 / this.height]).set('uThreshold', L.bloomThreshold);
        this._fsDraw();
        const dn = this.prog.bloomDown.use();
        for (let k = 1; k < B.length; k++) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, B[k].fbo); gl.viewport(0, 0, B[k].w, B[k].h);
          dn.tex('uTex', B[k - 1].tex).set('uTexel', [1 / B[k - 1].w, 1 / B[k - 1].h]);
          this._fsDraw();
        }
        const up = this.prog.bloomUp.use();
        let prev = B[B.length - 1];
        for (let k = B.length - 2; k >= 0; k--) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, U[k].fbo); gl.viewport(0, 0, U[k].w, U[k].h);
          up.tex('uTex', prev.tex).tex('uAdd', B[k].tex).set('uTexel', [1 / prev.w, 1 / prev.h]).set('uMix', 0.92);
          this._fsDraw();
          prev = U[k];
        }
        bloomTex = prev.tex;
      }

      // tone map (+ FXAA when not multisampled)
      const useFxaa = !this.main && f.fxaa !== false;
      gl.bindFramebuffer(gl.FRAMEBUFFER, useFxaa ? this.ldr.fbo : null);
      gl.viewport(0, 0, this.width, this.height);
      this.prog.composite.use().tex('uHdr', this.hdr.tex).tex('uBloom', bloomTex)
        .set('uExposure', L.exposure).set('uBloomStr', L.bloom / Math.max(1, this.bloom.length) * 2.0).set('uVignette', L.vignette).set('uTime', f.time);
      this._fsDraw();
      if (useFxaa) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.prog.fxaa.use().tex('uTex', this.ldr.tex).set('uTexel', [1 / this.width, 1 / this.height]);
        this._fsDraw();
      }
      gl.bindVertexArray(null);
    }

    setPoints(data, count) {
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.points.buf);
      if (data.byteLength > this.points.cap) { gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW); this.points.cap = data.byteLength; }
      else gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
      this.points.count = count;
    }
  }

  S.Renderer = Renderer;
})();
