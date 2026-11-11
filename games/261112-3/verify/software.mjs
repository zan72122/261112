// Focused no-GPU renderer regression: original scene traversal and camera projection.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const sandbox={window:{}};vm.runInNewContext(readFileSync(new URL('../src/software.js',import.meta.url),'utf8'),sandbox);
class Matrix {clone(){return new Matrix()} multiply(){return this} fromArray(){return this}}
class Vector {
 clone(){return new Vector()} fromBufferAttribute(a,i){[this.x,this.y,this.z]=a.values[i];return this}
 applyMatrix4(){return this} set(x,y,z){Object.assign(this,{x,y,z});return this}
 add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this} multiplyScalar(n){this.x*=n;this.y*=n;this.z*=n;return this}
}
let fills=0;
const ctx={fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){fills++}};
const renderer=new sandbox.window.StoreCanvasRenderer({getContext:()=>ctx});renderer.setPixelRatio(2);renderer.setSize(390,844);
assert.equal(renderer.getPixelRatio(),1);
const material={visible:true,opacity:1,side:0,color:{getStyle:()=> '#ff0000'}};
const obj={isMesh:true,matrixWorld:new Matrix(),material,geometry:{attributes:{position:{count:3,values:[[-.5,-.5,0],[.5,-.5,0],[0,.5,0]]}},groups:[]}};
const scene={updateMatrixWorld(){},traverseVisible(fn){fn(obj)}};
const camera={position:new Vector(),projectionMatrix:new Matrix(),matrixWorldInverse:new Matrix(),updateMatrixWorld(){}};
renderer.render(scene,camera);assert.equal(fills,1);
obj.isInstancedMesh=true;obj.count=2;obj.instanceMatrix={array:new Float32Array(32)};
renderer.render(scene,camera);assert.equal(fills,3);
obj.material.clippingPlanes=[{distanceToPoint:()=> -1}];renderer.render(scene,camera);assert.equal(fills,3);
console.log('Canvas fallback: projection, instances, clipping and sizing passed');
