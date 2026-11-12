// Headless structural smoke check with WebGL unavailable; no external dependencies.
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
for (const [width,height] of [[390,844],[844,390],[820,1180],[1180,820]]) {
  const frames=[], listeners={}, nodes={}; let fills=0;
  const gradient={addColorStop(){}};
  const context = new Proxy({
    createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,
    createPattern:()=>({}),measureText:()=>({width:30}),
    getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),
    createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),
    fill(){fills++;},
  }, {get:(o,k)=> k in o ? o[k] : (()=>{})});
  const element = id => ({id,style:{},width:width,height:height,
    getContext:type=>type==='2d'?context:null,
    addEventListener(type,fn){(listeners[id+':'+type] ||= []).push(fn);},
    getBoundingClientRect:()=>({left:0,top:0,width,height}),setPointerCapture(){},releasePointerCapture(){},
    setAttribute(){},appendChild(child){nodes.feedback=child;},toDataURL:()=>'',
  });
  for(const id of ['c','fb','hint','safe']) nodes[id]=element(id);
  const document={hidden:false,body:element('body'),createElement:()=>element(''),
    createElementNS:()=>element(''),getElementById:id=>nodes[id],
    addEventListener(type,fn){(listeners['doc:'+type] ||= []).push(fn);}};
  const sandbox={console,document,URLSearchParams,location:{search:'?fresh=1'},navigator:{userAgent:'test'},
    innerWidth:width,innerHeight:height,devicePixelRatio:1,performance:{now:()=>0},
    requestAnimationFrame:fn=>frames.push(fn),cancelAnimationFrame(){},setTimeout:()=>1,clearTimeout(){},
    getComputedStyle:()=>({paddingLeft:'0',paddingRight:'0',paddingTop:'0',paddingBottom:'0'}),
    addEventListener(){},localStorage:{getItem:()=>null,setItem(){}},};
  sandbox.window=sandbox; sandbox.self=sandbox;
  const c=vm.createContext(sandbox);
  for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(match[1],c,{timeout:120000});
  for(let i=1;i<=3;i++) { const batch=frames.splice(0); for(const f of batch) f(i*17); }
  assert.equal(sandbox.__G.renderer.software,true); assert.equal(sandbox.__G.dead,undefined);
  assert.ok(fills>100,'scene geometry must render');
  const ev={target:nodes.c,pointerId:1,clientX:width/2,clientY:height/2,preventDefault(){}};
  for(const f of listeners['doc:pointerdown']||[]) f(ev);
  for(const f of listeners['c:pointerdown']||[]) f(ev);
  assert.ok(sandbox.__G.lastTouch);
  assert.equal(nodes.feedback.style.opacity,'1');
  const batch=frames.splice(0); for(const f of batch) f(1600);
  assert.equal(nodes.feedback.style.width,'100px','held touch has sustained visual feedback');
  for(const f of listeners['c:pointerup']||[]) f(ev);
  for(const f of listeners['doc:pointerup']||[]) f(ev);
  assert.equal(sandbox.__G.drag,null);
  assert.equal(nodes.feedback.style.width,'120px','release changes the feedback');
  console.log(`${width}x${height}: boot, scene (${fills} faces), center touch and release OK`);
}
