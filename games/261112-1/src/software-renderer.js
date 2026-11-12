// Canvas fallback renders the same scene and cloth simulation when WebGL is unavailable.
// No alternate game state or static replacement: all original pointer controls remain active.
window.LaundrySoftwareRenderer = class {
  constructor(canvas) {
    this.domElement = canvas;
    this.ctx = canvas.getContext('2d');
    this.software = true;
    this.shadowMap = {};
    this.ratio = 1;
    this.toneMappingExposure = 1;
  }
  setPixelRatio() { this.ratio = 1; }
  setSize(w, h) {
    // Keep the CPU rasterizer bounded on high density tablets.
    const k = Math.min(1, 720 / Math.max(w, h));
    this.domElement.width = Math.round(w * k);
    this.domElement.height = Math.round(h * k);
  }
  render(scene, camera) {
    const ctx = this.ctx, w = this.domElement.width, h = this.domElement.height;
    scene.updateMatrixWorld(); camera.updateMatrixWorld();
    const view = camera.matrixWorldInverse.elements, proj = camera.projectionMatrix.elements;
    const mul = (m, x, y, z, q = 1) => [m[0]*x+m[4]*y+m[8]*z+m[12]*q, m[1]*x+m[5]*y+m[9]*z+m[13]*q, m[2]*x+m[6]*y+m[10]*z+m[14]*q, m[3]*x+m[7]*y+m[11]*z+m[15]*q];
    const channel = x => Math.round(255 * Math.pow(Math.max(0, Math.min(1, x)), 1 / 2.2));
    const color = (c, k = 1) => `rgb(${channel(c.r*k)},${channel(c.g*k)},${channel(c.b*k)})`;
    ctx.globalAlpha = 1; ctx.fillStyle = scene.background?.isColor ? color(scene.background) : '#dfe7ea'; ctx.fillRect(0, 0, w, h);
    const faces = [];
    scene.traverseVisible(obj => {
      if (!obj.isMesh || !obj.geometry?.attributes.position) return;
      const g = obj.geometry, pos = g.attributes.position, uv = g.attributes.uv;
      const index = g.index, total = index ? index.count : pos.count;
      const points = new Array(pos.count), world = obj.matrixWorld.elements;
      for (let i = 0; i < pos.count; i++) {
        const p = mul(world, pos.getX(i), pos.getY(i), pos.getZ(i));
        const v = mul(view, p[0], p[1], p[2]), c = mul(proj, v[0], v[1], v[2]);
        points[i] = [(c[0]/c[3]+1)*w/2, (1-c[1]/c[3])*h/2, -v[2], p[0], p[1], p[2]];
      }
      const groups = Array.isArray(obj.material) ? g.groups : [{start: 0, count: total, materialIndex: 0}];
      for (const group of groups) {
        const mat = Array.isArray(obj.material) ? obj.material[group.materialIndex] : obj.material;
        if (!mat || mat.visible === false || mat.opacity <= 0) continue;
        const start = Math.max(group.start, g.drawRange.start), end = Math.min(total, group.start+group.count, g.drawRange.start+g.drawRange.count);
        for (let i = start; i+2 < end; i += 3) {
          const ids = [0,1,2].map(k => index ? index.getX(i+k) : i+k);
          const [a,b,c] = ids.map(k => points[k]);
          if (a[2] < camera.near || b[2] < camera.near || c[2] < camera.near) continue;
          if (Math.max(a[0],b[0],c[0]) < 0 || Math.min(a[0],b[0],c[0]) > w || Math.max(a[1],b[1],c[1]) < 0 || Math.min(a[1],b[1],c[1]) > h) continue;
          const area = (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
          if (mat.side === 0 && area >= 0 || mat.side === 1 && area <= 0 || Math.abs(area) < .03) continue;
          const ux=b[3]-a[3], uy=b[4]-a[4], uz=b[5]-a[5], vx=c[3]-a[3], vy=c[4]-a[4], vz=c[5]-a[5];
          const nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx, len=Math.hypot(nx,ny,nz)||1;
          const light = mat.isMeshBasicMaterial ? 1 : .65+.35*Math.abs((nx*.3+ny*.8+nz*.5)/len);
          let col = mat.color || {r:1,g:1,b:1};
          if (mat.vertexColors && g.attributes.color) { const vc=g.attributes.color, k=ids[0]; col={r:col.r*vc.getX(k),g:col.g*vc.getY(k),b:col.b*vc.getZ(k)}; }
          const wet = g.attributes.aWet, dirt = g.attributes.aDirt;
          const wetness = wet ? ids.reduce((v,k) => v+wet.getX(k),0)/3 : 0;
          const dirtiness = dirt ? ids.reduce((v,k) => v+dirt.getX(k),0)/3 : 0;
          faces.push({a,b,c,ids,uv,mat,col,light,wetness,dirtiness,z:(a[2]+b[2]+c[2])/3});
        }
      }
    });
    faces.sort((a,b) => b.z-a.z);
    for (const f of faces) {
      const {a,b,c,mat} = f;
      ctx.globalAlpha = mat.opacity;
      ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.lineTo(c[0],c[1]); ctx.closePath();
      ctx.fillStyle = color(f.col, f.light); ctx.fill();
      const tex = mat.map, img = tex?.image;
      // Affine UV mapping keeps the original procedural fabrics, wood and metal.
      if (img?.width && f.uv && tex.repeat.x === 1 && tex.repeat.y === 1) {
        const p = f.ids.map(k => [f.uv.getX(k)*img.width, (tex.flipY ? 1-f.uv.getY(k) : f.uv.getY(k))*img.height]);
        const [u,v,t] = p, det=(v[0]-u[0])*(t[1]-u[1])-(t[0]-u[0])*(v[1]-u[1]);
        if (Math.abs(det) > .0001) {
          const m0=((b[0]-a[0])*(t[1]-u[1])-(c[0]-a[0])*(v[1]-u[1]))/det;
          const m1=((b[1]-a[1])*(t[1]-u[1])-(c[1]-a[1])*(v[1]-u[1]))/det;
          const m2=((c[0]-a[0])*(v[0]-u[0])-(b[0]-a[0])*(t[0]-u[0]))/det;
          const m3=((c[1]-a[1])*(v[0]-u[0])-(b[1]-a[1])*(t[0]-u[0]))/det;
          ctx.save(); ctx.clip(); ctx.transform(m0,m1,m2,m3,a[0]-m0*u[0]-m2*u[1],a[1]-m1*u[0]-m3*u[1]); ctx.drawImage(img,0,0); ctx.restore();
        }
      }
      if (f.wetness > .01 || f.dirtiness > .01) {
        ctx.globalAlpha = Math.min(.55, f.wetness*.32+f.dirtiness*.35) * mat.opacity;
        ctx.fillStyle = f.dirtiness > .1 ? '#69513b' : '#30445a';
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
};

// A sustained, wordless touch response also covers otherwise empty scene areas.
(() => {
  const ring = document.createElement('div');
  ring.style.cssText = 'position:fixed;pointer-events:none;z-index:10;width:64px;height:64px;border:5px solid rgba(255,255,255,.95);box-shadow:0 0 20px rgba(102,183,214,.8),inset 0 0 16px rgba(102,183,214,.6);border-radius:50%;opacity:0;transform:translate(-50%,-50%);';
  document.body.appendChild(ring);
  let active = null, timer;
  const place = e => { ring.style.left=e.clientX+'px'; ring.style.top=e.clientY+'px'; };
  document.addEventListener('pointerdown', e => {
    if (active !== null || e.target.id !== 'c') return;
    active=e.pointerId; clearTimeout(timer); place(e); ring.style.transition='none'; ring.style.opacity='1'; ring.style.width=ring.style.height='64px';
    requestAnimationFrame(() => { ring.style.transition='width 1.5s,height 1.5s'; ring.style.width=ring.style.height='100px'; });
  }, true);
  document.addEventListener('pointermove', e => { if(e.pointerId===active) place(e); }, true);
  const end = e => { if(e.pointerId!==active) return; active=null; ring.style.transition='opacity 1.2s,width .4s,height .4s'; ring.style.width=ring.style.height='120px'; timer=setTimeout(()=>{ring.style.opacity='0';},300); };
  document.addEventListener('pointerup',end,true); document.addEventListener('pointercancel',end,true);
  window.addEventListener('blur',()=>{active=null;ring.style.opacity='0';});
})();
