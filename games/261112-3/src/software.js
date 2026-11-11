// Canvas painter for devices where WebGL context creation is unavailable.
// Uses the original scene, camera, geometry and game state.
window.StoreCanvasRenderer = class {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d', {alpha:false});
    this.shadowMap = {}; this.info = {render:{triangles:0,calls:0}}; this.ratio=1;
  }
  setPixelRatio(r) { this.ratio=Math.min(r,1); }
  getPixelRatio() { return this.ratio; }
  setSize(w,h) { this.canvas.width=Math.round(w*this.ratio); this.canvas.height=Math.round(h*this.ratio); }
  render(scene,camera) {
    const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height,faces=[];
    scene.updateMatrixWorld(); camera.updateMatrixWorld();
    const view=camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse);
    const p=camera.position.clone();
    const css=c=>c ? c.getStyle() : '#dfe7ee';
    ctx.globalAlpha=1; ctx.fillStyle=css(scene.background); ctx.fillRect(0,0,w,h);
    scene.traverseVisible(obj=>{
      if(!obj.isMesh || !obj.geometry.attributes.position) return;
      const g=obj.geometry,pos=g.attributes.position,uv=g.attributes.uv,idx=g.index;
      const draw = (world, tint) => {
      const mat=view.clone().multiply(world),verts=[];
      for(let i=0;i<pos.count;i++) {
        p.fromBufferAttribute(pos,i).applyMatrix4(mat);
        verts.push([(p.x+1)*w/2,(1-p.y)*h/2,p.z]);
      }
      const n=idx?idx.count:pos.count,groups=g.groups.length?g.groups:[{start:0,count:n,materialIndex:0}];
      for(const group of groups) {
        const m=Array.isArray(obj.material)?obj.material[group.materialIndex]:obj.material;
        if(!m || !m.visible || m.opacity<=0) continue;
        for(let i=group.start;i<Math.min(n,group.start+group.count);i+=3) {
          const ids=[0,1,2].map(k=>idx?idx.getX(i+k):i+k),v=ids.map(k=>verts[k]);
          if(v.some(a=>!a || a[2]<-1 || a[2]>1)) continue;
          const area=(v[1][0]-v[0][0])*(v[2][1]-v[0][1])-(v[1][1]-v[0][1])*(v[2][0]-v[0][0]);
          if(m.side===0 && area>=0 || Math.abs(area)<.15) continue;
          if(v.every(a=>a[0]<0)||v.every(a=>a[0]>w)||v.every(a=>a[1]<0)||v.every(a=>a[1]>h)) continue;
          if (m.clippingPlanes && m.clippingPlanes.some(plane=> {
            p.set(0,0,0); for (const id of ids) p.add(camera.position.clone().fromBufferAttribute(pos,id));
            p.multiplyScalar(1/3).applyMatrix4(world); return plane.distanceToPoint(p)<0;
          })) continue;
          faces.push({v,ids,uv,m,tint,z:(v[0][2]+v[1][2]+v[2][2])/3});
        }
      }
      };
      if (obj.isInstancedMesh) {
        for (let i=0;i<obj.count;i++) {
          const local=obj.matrixWorld.clone().fromArray(obj.instanceMatrix.array,i*16);
          let tint=null;
          if (obj.instanceColor) tint=obj.material.color.clone().fromArray(obj.instanceColor.array,i*3);
          draw(obj.matrixWorld.clone().multiply(local),tint);
        }
      } else draw(obj.matrixWorld,null);
    });
    faces.sort((a,b)=>b.z-a.z);
    for(const f of faces) {
      const {v,m,uv,ids}=f;
      ctx.globalAlpha=m.opacity; ctx.fillStyle=css(f.tint ? m.color.clone().multiply(f.tint) : m.color);
      ctx.beginPath();ctx.moveTo(v[0][0],v[0][1]);ctx.lineTo(v[1][0],v[1][1]);ctx.lineTo(v[2][0],v[2][1]);ctx.closePath();ctx.fill();
      const image=m.map && m.map.image;
      if(image && image.width && uv) {
        const t=ids.map(i=>[uv.getX(i)*image.width,(m.map.flipY?1-uv.getY(i):uv.getY(i))*image.height]);
        const [a,b,c]=t,det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
        if(Math.abs(det)>.001) {
          const dx1=v[1][0]-v[0][0],dx2=v[2][0]-v[0][0],dy1=v[1][1]-v[0][1],dy2=v[2][1]-v[0][1];
          const A=(dx1*(c[1]-a[1])-dx2*(b[1]-a[1]))/det,B=(dy1*(c[1]-a[1])-dy2*(b[1]-a[1]))/det,C=(dx2*(b[0]-a[0])-dx1*(c[0]-a[0]))/det,D=(dy2*(b[0]-a[0])-dy1*(c[0]-a[0]))/det;
          ctx.save();ctx.clip();ctx.transform(A,B,C,D,v[0][0]-A*a[0]-C*a[1],v[0][1]-B*a[0]-D*a[1]);ctx.drawImage(image,0,0);ctx.restore();
        }
      }
    }
    ctx.globalAlpha=1; this.info.render.triangles=faces.length;this.info.render.calls=faces.length;
  }
};
