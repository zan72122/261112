(()=>{/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Vu=0,nh=1,Wu=2;var zs=1,Xu=2,Pr=3,ms=0,Gn=1,Ce=2,Hs=0,gs=1,xs=2,ih=3,sh=4,Ao=5;var Gs=100,qu=101,Yu=102,Zu=103,Ju=104,$u=200,Vs=201,Ku=202,ju=203,rh=204,ys=205,Qu=206,td=207,ed=208,nd=209,id=210,sd=211,rd=212,od=213,ad=214,Sa=0,wa=1,Ea=2,vr=3,Ta=4,Aa=5,Ra=6,Ca=7,oh=0,ld=1,cd=2,Di=0,ah=1,lh=2,ch=3,Ro=4,hh=5,uh=6,dh=7;var fh=300,Ws=301,Ir=302,sl=303,rl=304,Ri=1e3,oi=1001,Pa=1002,An=1003,hd=1004;var Co=1005;var xn=1006,ol=1007;var $i=1008;var Zn=1009,ph=1010,mh=1011,Lr=1012,al=1013,_i=1014,ui=1015,ei=1016,ll=1017,cl=1018,Xs=1020,gh=35902,xh=35899,yh=1021,_h=1022,ni=1023,qi=1026,Ki=1027,hl=1028,ul=1029,_s=1030,dl=1031;var fl=1033,Po=33776,Io=33777,Lo=33778,Do=33779,pl=35840,ml=35841,gl=35842,xl=35843,yl=36196,_l=37492,vl=37496,Ml=37488,bl=37489,No=37490,Sl=37491,wl=37808,El=37809,Tl=37810,Al=37811,Rl=37812,Cl=37813,Pl=37814,Il=37815,Ll=37816,Dl=37817,Nl=37818,Fl=37819,Ul=37820,Ol=37821,kl=36492,Bl=36494,zl=36495,Hl=36283,Gl=36284,Fo=36285,Vl=36286;var io=2300,Ia=2301,Ma=2302,Yc=2303,Zc=2400,Jc=2401,$c=2402;var ud=3200;var Wl=0,dd=1,vi="",hn="srgb",so="srgb-linear",ro="linear",ke="srgb";var ba=7680;var fd=519,pd=512,md=513,gd=514,vh=515,xd=516,yd=517,Mh=518,bh=519,_d=35044,Uo=35048;var Sh="300 es",ai=2e3,Mr=2001;function cf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function hf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function oo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function vd(){let i=oo("canvas");return i.style.display="block",i}var fu={},br=null;function wh(...i){let t="THREE."+i.shift();br?br("log",t,...i):console.log(t,...i)}function Md(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Kt(...i){i=Md(i);let t="THREE."+i.shift();if(br)br("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function se(...i){i=Md(i);let t="THREE."+i.shift();if(br)br("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Us(...i){let t=i.join(" ");t in fu||(fu[t]=!0,Kt(...i))}function bd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Sd={[Sa]:Sa,[Ea]:Ra,[Ta]:Ta,[vr]:Aa,[wa]:wa,[Ra]:Ea,[Ca]:Ca,[Aa]:vr},Ci=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var bc=Math.PI/180,La=180/Math.PI;function Oo(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Nn[i&255]+Nn[i>>8&255]+Nn[i>>16&255]+Nn[i>>24&255]+"-"+Nn[t&255]+Nn[t>>8&255]+"-"+Nn[t>>16&15|64]+Nn[t>>24&255]+"-"+Nn[e&63|128]+Nn[e>>8&255]+"-"+Nn[e>>16&255]+Nn[e>>24&255]+Nn[n&255]+Nn[n>>8&255]+Nn[n>>16&255]+Nn[n>>24&255]).toLowerCase()}function ge(i,t,e){return Math.max(t,Math.min(e,i))}function uf(i,t){return(i%t+t)%t}function Sc(i,t,e){return(1-e)*i+e*t}function wd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Eh(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function df(i,t){if(t.constructor===Float32Array)return i;let e=Eh(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/e,-1)}function ff(i,t){if(t.constructor===Float32Array)return i;let e=Eh(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*e)}var Ih=class Ih{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ge(this.x,t.x,e.x),this.y=ge(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ge(this.x,t,e),this.y=ge(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ge(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ih.prototype.isVector2=!0;var xt=Ih,qn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],p=r[o+2],x=r[o+3];if(u!==x||l!==d||c!==f||h!==p){let g=l*d+c*f+h*p+u*x;g<0&&(d=-d,f=-f,p=-p,x=-x,g=-g);let m=1-a;if(g<.9995){let _=Math.acos(g),v=Math.sin(_);m=Math.sin(m*_)/v,a=Math.sin(a*_)/v,l=l*m+d*a,c=c*m+f*a,h=h*m+p*a,u=u*m+x*a}else{l=l*m+d*a,c=c*m+f*a,h=h*m+p*a,u=u*m+x*a;let _=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=_,c*=_,h*=_,u*=_}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*u+l*f-c*d,t[e+1]=l*p+h*d+c*u-a*f,t[e+2]=c*p+h*f+a*d-l*u,t[e+3]=h*p-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Kt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ge(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Lh=class Lh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(pu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(pu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ge(this.x,t.x,e.x),this.y=ge(this.y,t.y,e.y),this.z=ge(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ge(this.x,t,e),this.y=ge(this.y,t,e),this.z=ge(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ge(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return wc.copy(this).projectOnVector(t),this.sub(wc)}reflect(t){return this.sub(wc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Lh.prototype.isVector3=!0;var I=Lh,wc=new I,pu=new qn,Dh=class Dh{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],x=s[0],g=s[3],m=s[6],_=s[1],v=s[4],M=s[7],b=s[2],w=s[5],y=s[8];return r[0]=o*x+a*_+l*b,r[3]=o*g+a*v+l*w,r[6]=o*m+a*M+l*y,r[1]=c*x+h*_+u*b,r[4]=c*g+h*v+u*w,r[7]=c*m+h*M+u*y,r[2]=d*x+f*_+p*b,r[5]=d*g+f*v+p*w,r[8]=d*m+f*M+p*y,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,p=e*u+n*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/p;return t[0]=u*x,t[1]=(s*c-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Us("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ec.makeScale(t,e)),this}rotate(t){return Us("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ec.makeRotation(-t)),this}translate(t,e){return Us("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ec.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Dh.prototype.isMatrix3=!0;var le=Dh,Ec=new le,mu=new le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),gu=new le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pf(){let i={enabled:!0,workingColorSpace:so,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ke&&(s.r=Xi(s.r),s.g=Xi(s.g),s.b=Xi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ke&&(s.r=_r(s.r),s.g=_r(s.g),s.b=_r(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===vi?ro:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[so]:{primaries:t,whitePoint:n,transfer:ro,toXYZ:mu,fromXYZ:gu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:hn},outputColorSpaceConfig:{drawingBufferColorSpace:hn}},[hn]:{primaries:t,whitePoint:n,transfer:ke,toXYZ:mu,fromXYZ:gu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:hn}}}),i}var Se=pf();function Xi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function _r(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var rr,Da=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{rr===void 0&&(rr=oo("canvas")),rr.width=t.width,rr.height=t.height;let s=rr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=rr}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=oo("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Xi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Xi(e[n]/255)*255):e[n]=Xi(e[n]);return{data:e,width:t.width,height:t.height}}else return Kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},mf=0,Sr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:mf++}),this.uuid=Oo(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Tc(s[o].image)):r.push(Tc(s[o]))}else r=Tc(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Tc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Da.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Kt("Texture: Unable to serialize Texture."),{})}var gf=0,Ac=new I,Ln=class i extends Ci{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=oi,s=oi,r=xn,o=$i,a=ni,l=Zn,c=i.DEFAULT_ANISOTROPY,h=vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=Oo(),this.name="",this.source=new Sr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new le,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Ac).x}get height(){return this.source.getSize(Ac).y}get depth(){return this.source.getSize(Ac).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Kt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==fh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ri:t.x=t.x-Math.floor(t.x);break;case oi:t.x=t.x<0?0:1;break;case Pa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ri:t.y=t.y-Math.floor(t.y);break;case oi:t.y=t.y<0?0:1;break;case Pa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Ln.DEFAULT_IMAGE=null;Ln.DEFAULT_MAPPING=fh;Ln.DEFAULT_ANISOTROPY=1;var Nh=class Nh{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(c+1)/2,M=(f+1)/2,b=(m+1)/2,w=(h+d)/4,y=(u+x)/4,T=(p+g)/4;return v>M&&v>b?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=w/n,r=y/n):M>b?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=w/s,r=T/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=y/r,s=T/r),this.set(n,s,r,e),this}let _=Math.sqrt((g-p)*(g-p)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(g-p)/_,this.y=(u-x)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ge(this.x,t.x,e.x),this.y=ge(this.y,t.y,e.y),this.z=ge(this.z,t.z,e.z),this.w=ge(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ge(this.x,t,e),this.y=ge(this.y,t,e),this.z=ge(this.z,t,e),this.w=ge(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ge(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Nh.prototype.isVector4=!0;var tn=Nh,Na=class extends Ci{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new tn(0,0,t,e),this.scissorTest=!1,this.viewport=new tn(0,0,t,e),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new Ln({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:xn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Sr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qn=class extends Na{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},ao=class extends Ln{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Fa=class extends Ln{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var il=class il{constructor(t,e,n,s,r,o,a,l,c,h,u,d,f,p,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,f,p,x,g)}set(t,e,n,s,r,o,a,l,c,h,u,d,f,p,x,g){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new il().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/or.setFromMatrixColumn(t,0).length(),r=1/or.setFromMatrixColumn(t,1).length(),o=1/or.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,p=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+p*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,p=c*h,x=c*u;e[0]=d+x*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,p=c*h,x=c*u;e[0]=d-x*a,e[4]=-o*u,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,p=a*h,x=a*u;e[0]=l*h,e[4]=p*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*h,e[4]=x-d*u,e[8]=p*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+p,e[10]=d-x*u}else if(t.order==="XZY"){let d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=o*h,e[9]=f*u-p,e[2]=p*u-f,e[6]=a*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(xf,t,yf)}lookAt(t,e,n){let s=this.elements;return Kn.subVectors(t,e),Kn.lengthSq()===0&&(Kn.z=1),Kn.normalize(),ss.crossVectors(n,Kn),ss.lengthSq()===0&&(Math.abs(n.z)===1?Kn.x+=1e-4:Kn.z+=1e-4,Kn.normalize(),ss.crossVectors(n,Kn)),ss.normalize(),ta.crossVectors(Kn,ss),s[0]=ss.x,s[4]=ta.x,s[8]=Kn.x,s[1]=ss.y,s[5]=ta.y,s[9]=Kn.y,s[2]=ss.z,s[6]=ta.z,s[10]=Kn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],x=n[6],g=n[10],m=n[14],_=n[3],v=n[7],M=n[11],b=n[15],w=s[0],y=s[4],T=s[8],F=s[12],O=s[1],N=s[5],B=s[9],G=s[13],E=s[2],U=s[6],C=s[10],P=s[14],X=s[3],D=s[7],W=s[11],K=s[15];return r[0]=o*w+a*O+l*E+c*X,r[4]=o*y+a*N+l*U+c*D,r[8]=o*T+a*B+l*C+c*W,r[12]=o*F+a*G+l*P+c*K,r[1]=h*w+u*O+d*E+f*X,r[5]=h*y+u*N+d*U+f*D,r[9]=h*T+u*B+d*C+f*W,r[13]=h*F+u*G+d*P+f*K,r[2]=p*w+x*O+g*E+m*X,r[6]=p*y+x*N+g*U+m*D,r[10]=p*T+x*B+g*C+m*W,r[14]=p*F+x*G+g*P+m*K,r[3]=_*w+v*O+M*E+b*X,r[7]=_*y+v*N+M*U+b*D,r[11]=_*T+v*B+M*C+b*W,r[15]=_*F+v*G+M*P+b*K,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],p=t[3],x=t[7],g=t[11],m=t[15],_=l*f-c*d,v=a*f-c*u,M=a*d-l*u,b=o*f-c*h,w=o*d-l*h,y=o*u-a*h;return e*(x*_-g*v+m*M)-n*(p*_-g*b+m*w)+s*(p*v-x*b+m*y)-r*(p*M-x*w+g*y)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],p=t[12],x=t[13],g=t[14],m=t[15],_=e*a-n*o,v=e*l-s*o,M=e*c-r*o,b=n*l-s*a,w=n*c-r*a,y=s*c-r*l,T=h*x-u*p,F=h*g-d*p,O=h*m-f*p,N=u*g-d*x,B=u*m-f*x,G=d*m-f*g,E=_*G-v*B+M*N+b*O-w*F+y*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/E;return t[0]=(a*G-l*B+c*N)*U,t[1]=(s*B-n*G-r*N)*U,t[2]=(x*y-g*w+m*b)*U,t[3]=(d*w-u*y-f*b)*U,t[4]=(l*O-o*G-c*F)*U,t[5]=(e*G-s*O+r*F)*U,t[6]=(g*M-p*y-m*v)*U,t[7]=(h*y-d*M+f*v)*U,t[8]=(o*B-a*O+c*T)*U,t[9]=(n*O-e*B-r*T)*U,t[10]=(p*w-x*M+m*_)*U,t[11]=(u*M-h*w-f*_)*U,t[12]=(a*F-o*N-l*T)*U,t[13]=(e*N-n*F+s*T)*U,t[14]=(x*v-p*b-g*_)*U,t[15]=(h*b-u*v+d*_)*U,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,p=r*u,x=o*h,g=o*u,m=a*u,_=l*c,v=l*h,M=l*u,b=n.x,w=n.y,y=n.z;return s[0]=(1-(x+m))*b,s[1]=(f+M)*b,s[2]=(p-v)*b,s[3]=0,s[4]=(f-M)*w,s[5]=(1-(d+m))*w,s[6]=(g+_)*w,s[7]=0,s[8]=(p+v)*y,s[9]=(g-_)*y,s[10]=(1-(d+x))*y,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=or.set(s[0],s[1],s[2]).length(),a=or.set(s[4],s[5],s[6]).length(),l=or.set(s[8],s[9],s[10]).length();r<0&&(o=-o),pi.copy(this);let c=1/o,h=1/a,u=1/l;return pi.elements[0]*=c,pi.elements[1]*=c,pi.elements[2]*=c,pi.elements[4]*=h,pi.elements[5]*=h,pi.elements[6]*=h,pi.elements[8]*=u,pi.elements[9]*=u,pi.elements[10]*=u,e.setFromRotationMatrix(pi),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=ai,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),p,x;if(l)p=r/(o-r),x=o*r/(o-r);else if(a===ai)p=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Mr)p=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=ai,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s),p,x;if(l)p=1/(o-r),x=o/(o-r);else if(a===ai)p=-2/(o-r),x=-(o+r)/(o-r);else if(a===Mr)p=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};il.prototype.isMatrix4=!0;var Ne=il,or=new I,pi=new Ne,xf=new I(0,0,0),yf=new I(1,1,1),ss=new I,ta=new I,Kn=new I,xu=new Ne,yu=new qn,on=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ge(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ge(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return xu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(xu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return yu.setFromEuler(this),this.setFromQuaternion(yu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};on.DEFAULT_ORDER="XYZ";var wr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},_f=0,_u=new I,ar=new qn,Bi=new Ne,ea=new I,Jr=new I,vf=new I,Mf=new qn,vu=new I(1,0,0),Mu=new I(0,1,0),bu=new I(0,0,1),Su={type:"added"},bf={type:"removed"},lr={type:"childadded",child:null},Rc={type:"childremoved",child:null},Hn=class i extends Ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=Oo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new I,e=new on,n=new qn,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ne},normalMatrix:{value:new le}}),this.matrix=new Ne,this.matrixWorld=new Ne,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ar.setFromAxisAngle(t,e),this.quaternion.multiply(ar),this}rotateOnWorldAxis(t,e){return ar.setFromAxisAngle(t,e),this.quaternion.premultiply(ar),this}rotateX(t){return this.rotateOnAxis(vu,t)}rotateY(t){return this.rotateOnAxis(Mu,t)}rotateZ(t){return this.rotateOnAxis(bu,t)}translateOnAxis(t,e){return _u.copy(t).applyQuaternion(this.quaternion),this.position.add(_u.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(vu,t)}translateY(t){return this.translateOnAxis(Mu,t)}translateZ(t){return this.translateOnAxis(bu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ea.copy(t):ea.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Jr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(Jr,ea,this.up):Bi.lookAt(ea,Jr,this.up),this.quaternion.setFromRotationMatrix(Bi),s&&(Bi.extractRotation(s.matrixWorld),ar.setFromRotationMatrix(Bi),this.quaternion.premultiply(ar.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(se("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Su),lr.child=t,this.dispatchEvent(lr),lr.child=null):se("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(bf),Rc.child=t,this.dispatchEvent(Rc),Rc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Su),lr.child=t,this.dispatchEvent(lr),lr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jr,t,vf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jr,Mf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Hn.DEFAULT_UP=new I(0,1,0);Hn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var dt=class extends Hn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Sf={type:"move"},Er=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Sf)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new dt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Ed={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},rs={h:0,s:0,l:0},na={h:0,s:0,l:0};function Cc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Ut=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Se.workingColorSpace){return this.r=t,this.g=e,this.b=n,Se.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Se.workingColorSpace){if(t=uf(t,1),e=ge(e,0,1),n=ge(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Cc(o,r,t+1/3),this.g=Cc(o,r,t),this.b=Cc(o,r,t-1/3)}return Se.colorSpaceToWorking(this,s),this}setStyle(t,e=hn){function n(r){r!==void 0&&parseFloat(r)<1&&Kt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Kt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=hn){let n=Ed[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Xi(t.r),this.g=Xi(t.g),this.b=Xi(t.b),this}copyLinearToSRGB(t){return this.r=_r(t.r),this.g=_r(t.g),this.b=_r(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=hn){return Se.workingToColorSpace(Fn.copy(this),t),Math.round(ge(Fn.r*255,0,255))*65536+Math.round(ge(Fn.g*255,0,255))*256+Math.round(ge(Fn.b*255,0,255))}getHexString(t=hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Se.workingColorSpace){Se.workingToColorSpace(Fn.copy(this),e);let n=Fn.r,s=Fn.g,r=Fn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Se.workingColorSpace){return Se.workingToColorSpace(Fn.copy(this),e),t.r=Fn.r,t.g=Fn.g,t.b=Fn.b,t}getStyle(t=hn){Se.workingToColorSpace(Fn.copy(this),t);let e=Fn.r,n=Fn.g,s=Fn.b;return t!==hn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(rs),this.setHSL(rs.h+t,rs.s+e,rs.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(rs),t.getHSL(na);let n=Sc(rs.h,na.h,e),s=Sc(rs.s,na.s,e),r=Sc(rs.l,na.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fn=new Ut;Ut.NAMES=Ed;var Os=class extends Hn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},mi=new I,zi=new I,Pc=new I,Hi=new I,cr=new I,hr=new I,wu=new I,Ic=new I,Lc=new I,Dc=new I,Nc=new tn,Fc=new tn,Uc=new tn,cs=class i{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),mi.subVectors(t,e),s.cross(mi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){mi.subVectors(s,e),zi.subVectors(n,e),Pc.subVectors(t,e);let o=mi.dot(mi),a=mi.dot(zi),l=mi.dot(Pc),c=zi.dot(zi),h=zi.dot(Pc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Hi)===null?!1:Hi.x>=0&&Hi.y>=0&&Hi.x+Hi.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hi.x),l.addScaledVector(o,Hi.y),l.addScaledVector(a,Hi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Nc.setScalar(0),Fc.setScalar(0),Uc.setScalar(0),Nc.fromBufferAttribute(t,e),Fc.fromBufferAttribute(t,n),Uc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Nc,r.x),o.addScaledVector(Fc,r.y),o.addScaledVector(Uc,r.z),o}static isFrontFacing(t,e,n,s){return mi.subVectors(n,e),zi.subVectors(t,e),mi.cross(zi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mi.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),mi.cross(zi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;cr.subVectors(s,n),hr.subVectors(r,n),Ic.subVectors(t,n);let l=cr.dot(Ic),c=hr.dot(Ic);if(l<=0&&c<=0)return e.copy(n);Lc.subVectors(t,s);let h=cr.dot(Lc),u=hr.dot(Lc);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return o=l/(l-h),e.copy(n).addScaledVector(cr,o);Dc.subVectors(t,r);let f=cr.dot(Dc),p=hr.dot(Dc);if(p>=0&&f<=p)return e.copy(r);let x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(hr,a);let g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return wu.subVectors(r,s),a=(u-h)/(u-h+(f-p)),e.copy(s).addScaledVector(wu,a);let m=1/(g+x+d);return o=x*m,a=d*m,e.copy(n).addScaledVector(cr,o).addScaledVector(hr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Pi=class{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(gi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(gi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=gi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,gi):gi.fromBufferAttribute(r,o),gi.applyMatrix4(t.matrixWorld),this.expandByPoint(gi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ia.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ia.copy(n.boundingBox)),ia.applyMatrix4(t.matrixWorld),this.union(ia)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,gi),gi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter($r),sa.subVectors(this.max,$r),ur.subVectors(t.a,$r),dr.subVectors(t.b,$r),fr.subVectors(t.c,$r),os.subVectors(dr,ur),as.subVectors(fr,dr),Ls.subVectors(ur,fr);let e=[0,-os.z,os.y,0,-as.z,as.y,0,-Ls.z,Ls.y,os.z,0,-os.x,as.z,0,-as.x,Ls.z,0,-Ls.x,-os.y,os.x,0,-as.y,as.x,0,-Ls.y,Ls.x,0];return!Oc(e,ur,dr,fr,sa)||(e=[1,0,0,0,1,0,0,0,1],!Oc(e,ur,dr,fr,sa))?!1:(ra.crossVectors(os,as),e=[ra.x,ra.y,ra.z],Oc(e,ur,dr,fr,sa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Gi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Gi=[new I,new I,new I,new I,new I,new I,new I,new I],gi=new I,ia=new Pi,ur=new I,dr=new I,fr=new I,os=new I,as=new I,Ls=new I,$r=new I,sa=new I,ra=new I,Ds=new I;function Oc(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ds.fromArray(i,r);let a=s.x*Math.abs(Ds.x)+s.y*Math.abs(Ds.y)+s.z*Math.abs(Ds.z),l=t.dot(Ds),c=e.dot(Ds),h=n.dot(Ds);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Wi=wf();function wf(){let i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function Ef(i){Math.abs(i)>65504&&Kt("DataUtils.toHalfFloat(): Value out of range."),i=ge(i,-65504,65504),Wi.floatView[0]=i;let t=Wi.uint32View[0],e=t>>23&511;return Wi.baseTable[e]+((t&8388607)>>Wi.shiftTable[e])}function Tf(i){let t=i>>10;return Wi.uint32View[0]=Wi.mantissaTable[Wi.offsetTable[t]+(i&1023)]+Wi.exponentTable[t],Wi.floatView[0]}var lo=class{static toHalfFloat(t){return Ef(t)}static fromHalfFloat(t){return Tf(t)}},pn=new I,oa=new xt,Af=0,In=class extends Ci{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Af++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=_d,this.updateRanges=[],this.gpuType=ui,this.version=0,this._normalizationScale=t!==void 0?Eh(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)oa.fromBufferAttribute(this,e),oa.applyMatrix3(t),this.setXY(e,oa.x,oa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)pn.fromBufferAttribute(this,e),pn.applyMatrix3(t),this.setXYZ(e,pn.x,pn.y,pn.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)pn.fromBufferAttribute(this,e),pn.applyMatrix4(t),this.setXYZ(e,pn.x,pn.y,pn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)pn.fromBufferAttribute(this,e),pn.applyNormalMatrix(t),this.setXYZ(e,pn.x,pn.y,pn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)pn.fromBufferAttribute(this,e),pn.transformDirection(t),this.setXYZ(e,pn.x,pn.y,pn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):df(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):ff(t,this.array)}};var co=class extends In{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var ho=class extends In{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var xe=class extends In{constructor(t,e,n){super(new Float32Array(t),e,n)}},Rf=new Pi,Kr=new I,kc=new I,Ii=class{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Rf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Kr.subVectors(t,this.center);let e=Kr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Kr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(kc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Kr.copy(t.center).add(kc)),this.expandByPoint(Kr.copy(t.center).sub(kc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Cf=0,ri=new Ne,Bc=new Hn,pr=new I,jn=new Pi,jr=new Pi,Tn=new I,un=class i extends Ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=Oo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(cf(t)?ho:co)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new le().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return ri.makeRotationFromQuaternion(t),this.applyMatrix4(ri),this}rotateX(t){return ri.makeRotationX(t),this.applyMatrix4(ri),this}rotateY(t){return ri.makeRotationY(t),this.applyMatrix4(ri),this}rotateZ(t){return ri.makeRotationZ(t),this.applyMatrix4(ri),this}translate(t,e,n){return ri.makeTranslation(t,e,n),this.applyMatrix4(ri),this}scale(t,e,n){return ri.makeScale(t,e,n),this.applyMatrix4(ri),this}lookAt(t){return Bc.lookAt(t),Bc.updateMatrix(),this.applyMatrix4(Bc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(pr).negate(),this.translate(pr.x,pr.y,pr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new xe(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){se("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];jn.setFromBufferAttribute(r),this.morphTargetsRelative?(Tn.addVectors(this.boundingBox.min,jn.min),this.boundingBox.expandByPoint(Tn),Tn.addVectors(this.boundingBox.max,jn.max),this.boundingBox.expandByPoint(Tn)):(this.boundingBox.expandByPoint(jn.min),this.boundingBox.expandByPoint(jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&se('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ii);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){se("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){let n=this.boundingSphere.center;if(jn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];jr.setFromBufferAttribute(a),this.morphTargetsRelative?(Tn.addVectors(jn.min,jr.min),jn.expandByPoint(Tn),Tn.addVectors(jn.max,jr.max),jn.expandByPoint(Tn)):(jn.expandByPoint(jr.min),jn.expandByPoint(jr.max))}jn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Tn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Tn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Tn.fromBufferAttribute(a,c),l&&(pr.fromBufferAttribute(t,c),Tn.add(pr)),s=Math.max(s,n.distanceToSquared(Tn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&se('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){se("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new In(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let F=0;F<n.count;F++)a[F]=new I,l[F]=new I;let h=new I,u=new I,d=new I,f=new xt,p=new xt,x=new xt,g=new I,m=new I;function _(F,O,N){c[F]=c[O]=c[N]=1,h.fromBufferAttribute(n,F),u.fromBufferAttribute(n,O),d.fromBufferAttribute(n,N),f.fromBufferAttribute(r,F),p.fromBufferAttribute(r,O),x.fromBufferAttribute(r,N),u.sub(h),d.sub(h),p.sub(f),x.sub(f);let B=1/(p.x*x.y-x.x*p.y);isFinite(B)&&(g.copy(u).multiplyScalar(x.y).addScaledVector(d,-p.y).multiplyScalar(B),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-x.x).multiplyScalar(B),a[F].add(g),a[O].add(g),a[N].add(g),l[F].add(m),l[O].add(m),l[N].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let F=0,O=v.length;F<O;++F){let N=v[F],B=N.start,G=N.count;for(let E=B,U=B+G;E<U;E+=3)_(t.getX(E+0),t.getX(E+1),t.getX(E+2))}let M=new I,b=new I,w=new I,y=new I;function T(F){w.fromBufferAttribute(s,F),y.copy(w);let O=a[F];M.copy(O),M.sub(w.multiplyScalar(w.dot(O))).normalize(),b.crossVectors(y,O);let B=b.dot(l[F])<0?-1:1;o.setXYZW(F,M.x,M.y,M.z,B)}for(let F=0,O=n.count;F<O;++F)c[F]&&T(F);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new In(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(t)for(let d=0,f=t.count;d<f;d+=3){let p=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Tn.fromBufferAttribute(t,e),Tn.normalize(),t.setXYZ(e,Tn.x,Tn.y,Tn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,p=0;for(let x=0,g=l.length;x<g;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let m=0;m<h;m++)d[p++]=c[f++]}return new In(d,h,u)}if(this.index===null)return Kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var zc=new I,Pf=new I,If=new le,xi=class{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=zc.subVectors(n,e).cross(Pf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(zc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||If.getNormalMatrix(t),s=this.coplanarPoint(zc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Lf=0,hs=class extends Ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Oo(),this.name="",this.type="Material",this.blending=gs,this.side=ms,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rh,this.blendDst=ys,this.blendEquation=Gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ut(0,0,0),this.blendAlpha=0,this.depthFunc=vr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ba,this.stencilZFail=ba,this.stencilZPass=ba,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Kt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ut().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new xi().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new xt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new xt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Vi=new I,Hc=new I,aa=new I,la=new I,uo=class{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Vi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Vi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Vi.copy(this.origin).addScaledVector(this.direction,e),Vi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Hc.copy(t).add(e).multiplyScalar(.5),aa.copy(e).sub(t).normalize(),la.copy(this.origin).sub(Hc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(aa),a=la.dot(this.direction),l=-la.dot(aa),c=la.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=r*h,u>=0)if(d>=-p)if(d<=p){let x=1/h;u*=x,d*=x,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Hc).addScaledVector(aa,d),f}intersectSphere(t,e){if(t.radius<0)return null;Vi.subVectors(t.center,this.origin);let n=Vi.dot(this.direction),s=Vi.dot(Vi)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Vi)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=t.x-o.x,d=t.y-o.y,f=t.z-o.z,p=e.x-o.x,x=e.y-o.y,g=e.z-o.z,m=n.x-o.x,_=n.y-o.y,v=n.z-o.z,M=Math.abs(l),b=Math.abs(c),w=Math.abs(h),y,T,F,O,N,B,G,E,U,C,P,X;if(M>=b&&M>=w?(F=l,B=u,U=p,X=m,l>=0?(y=c,T=h,O=d,N=f,G=x,E=g,C=_,P=v):(y=h,T=c,O=f,N=d,G=g,E=x,C=v,P=_)):b>=w?(F=c,B=d,U=x,X=_,c>=0?(y=h,T=l,O=f,N=u,G=g,E=p,C=v,P=m):(y=l,T=h,O=u,N=f,G=p,E=g,C=m,P=v)):(F=h,B=f,U=g,X=v,h>=0?(y=l,T=c,O=u,N=d,G=p,E=x,C=m,P=_):(y=c,T=l,O=d,N=u,G=x,E=p,C=_,P=m)),F===0)return null;let D=y/F,W=T/F,K=1/F,ut=O-D*B,Pt=N-W*B,Z=G-D*U,ft=E-W*U,Rt=C-D*X,Gt=P-W*X,wt=Rt*ft-Gt*Z,$t=ut*Gt-Pt*Rt,Te=Z*Pt-ft*ut;if(s){if(wt<0||$t<0||Te<0)return null}else if((wt<0||$t<0||Te<0)&&(wt>0||$t>0||Te>0))return null;let Mt=wt+$t+Te;if(Mt===0)return null;let be=K*(wt*B+$t*U+Te*X);return(Mt>0?be<0:be>0)?null:this.at(be/Mt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ue=class extends hs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=oh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Eu=new Ne,Ns=new uo,ca=new Ii,Tu=new I,ha=new I,ua=new I,da=new I,Gc=new I,fa=new I,Au=new I,pa=new I,tt=class extends Hn{constructor(t=new un,e=new Ue){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){fa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Gc.fromBufferAttribute(u,t),o?fa.addScaledVector(Gc,h):fa.addScaledVector(Gc.sub(e),h))}e.add(fa)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere),ca.applyMatrix4(r),Ns.copy(t.ray).recast(t.near),!(ca.containsPoint(Ns.origin)===!1&&(Ns.intersectSphere(ca,Tu)===null||Ns.origin.distanceToSquared(Tu)>(t.far-t.near)**2))&&(Eu.copy(r).invert(),Ns.copy(t.ray).applyMatrix4(Eu),!(n.boundingBox!==null&&Ns.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ns)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){let g=d[p],m=o[g.materialIndex],_=Math.max(g.start,f.start),v=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let M=_,b=v;M<b;M+=3){let w=a.getX(M),y=a.getX(M+1),T=a.getX(M+2);s=ma(this,m,t,n,c,h,u,w,y,T),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let _=a.getX(g),v=a.getX(g+1),M=a.getX(g+2);s=ma(this,o,t,n,c,h,u,_,v,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){let g=d[p],m=o[g.materialIndex],_=Math.max(g.start,f.start),v=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let M=_,b=v;M<b;M+=3){let w=M,y=M+1,T=M+2;s=ma(this,m,t,n,c,h,u,w,y,T),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let _=g,v=g+1,M=g+2;s=ma(this,o,t,n,c,h,u,_,v,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function Df(i,t,e,n,s,r,o,a){let l;if(t.side===Gn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ms,a),l===null)return null;pa.copy(a),pa.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(pa);return c<e.near||c>e.far?null:{distance:c,point:pa.clone(),object:i}}function ma(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,ha),i.getVertexPosition(l,ua),i.getVertexPosition(c,da);let h=Df(i,t,e,n,ha,ua,da,Au);if(h){let u=new I;cs.getBarycoord(Au,ha,ua,da,u),s&&(h.uv=cs.getInterpolatedAttribute(s,a,l,c,u,new xt)),r&&(h.uv1=cs.getInterpolatedAttribute(r,a,l,c,u,new xt)),o&&(h.normal=cs.getInterpolatedAttribute(o,a,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new I,materialIndex:0};cs.getNormal(ha,ua,da,d.normal),h.face=d,h.barycoord=u}return h}var ks=class extends Ln{constructor(t=null,e=1,n=1,s,r,o,a,l,c=An,h=An,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var li=class extends In{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},mr=new Ne,Ru=new Ne,ga=[],Cu=new Pi,Nf=new Ne,Qr=new tt,to=new Ii,Yi=class extends tt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new li(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Nf)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Pi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,mr),Cu.copy(t.boundingBox).applyMatrix4(mr),this.boundingBox.union(Cu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ii),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,mr),to.copy(t.boundingSphere).applyMatrix4(mr),this.boundingSphere.union(to)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Qr.geometry=this.geometry,Qr.material=this.material,Qr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),to.copy(this.boundingSphere),to.applyMatrix4(n),t.ray.intersectsSphere(to)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,mr),Ru.multiplyMatrices(n,mr),Qr.matrixWorld=Ru,Qr.raycast(t,ga);for(let o=0,a=ga.length;o<a;o++){let l=ga[o];l.instanceId=r,l.object=this,e.push(l)}ga.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new li(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ks(new Float32Array(s*this.count),s,this.count,hl,ui));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Fs=new Ii,Ff=new xt(.5,.5),xa=new I,us=class{constructor(t=new xi,e=new xi,n=new xi,s=new xi,r=new xi,o=new xi){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ai,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],x=r[9],g=r[10],m=r[11],_=r[12],v=r[13],M=r[14],b=r[15];if(s[0].setComponents(c-o,f-h,m-p,b-_).normalize(),s[1].setComponents(c+o,f+h,m+p,b+_).normalize(),s[2].setComponents(c+a,f+u,m+x,b+v).normalize(),s[3].setComponents(c-a,f-u,m-x,b-v).normalize(),n)s[4].setComponents(l,d,g,M).normalize(),s[5].setComponents(c-l,f-d,m-g,b-M).normalize();else if(s[4].setComponents(c-l,f-d,m-g,b-M).normalize(),e===ai)s[5].setComponents(c+l,f+d,m+g,b+M).normalize();else if(e===Mr)s[5].setComponents(l,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Fs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Fs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Fs)}intersectsSprite(t){Fs.center.set(0,0,0);let e=Ff.distanceTo(t.center);return Fs.radius=.7071067811865476+e,Fs.applyMatrix4(t.matrixWorld),this.intersectsSphere(Fs)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(xa.x=s.normal.x>0?t.max.x:t.min.x,xa.y=s.normal.y>0?t.max.y:t.min.y,xa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(xa)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Pu=new Ne,Ua=class i{constructor(){this.coordinateSystem=ai,this._frustums=[],this._count=0}setFromArrayCamera(t){let e=t.cameras,n=this._frustums;for(let s=0;s<e.length;s++){let r=e[s];Pu.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new us),n[s].setFromProjectionMatrix(Pu,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let e=this._frustums,n=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new us),e[s].copy(n[s]);return this._count=t._count,this}clone(){return new i().copy(this)}};var fo=class extends Ln{constructor(t=[],e=Ws,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},po=class extends Ln{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Zi=class extends Ln{constructor(t,e,n=_i,s,r,o,a=An,l=An,c,h=qi,u=1){if(h!==qi&&h!==Ki)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Sr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},mo=class extends Zi{constructor(t,e=_i,n=Ws,s,r,o=An,a=An,l,c=qi){let h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},go=class extends Ln{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},yi=class i extends un{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(h,3)),this.setAttribute("uv",new xe(u,2));function p(x,g,m,_,v,M,b,w,y,T,F){let O=M/y,N=b/T,B=M/2,G=b/2,E=w/2,U=y+1,C=T+1,P=0,X=0,D=new I;for(let W=0;W<C;W++){let K=W*N-G;for(let ut=0;ut<U;ut++){let Pt=ut*O-B;D[x]=Pt*_,D[g]=K*v,D[m]=E,c.push(D.x,D.y,D.z),D[x]=0,D[g]=0,D[m]=w>0?1:-1,h.push(D.x,D.y,D.z),u.push(ut/y),u.push(1-W/T),P+=1}}for(let W=0;W<T;W++)for(let K=0;K<y;K++){let ut=d+K+U*W,Pt=d+K+U*(W+1),Z=d+(K+1)+U*(W+1),ft=d+(K+1)+U*W;l.push(ut,Pt,ft),l.push(Pt,Z,ft),X+=6}a.addGroup(f,X,F),f+=X,d+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var yn=class i extends un{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new I,h=new xt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=n+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new xe(o,3)),this.setAttribute("normal",new xe(a,3)),this.setAttribute("uv",new xe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Me=class i extends un{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,x=[],g=n/2,m=0;_(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new xe(u,3)),this.setAttribute("normal",new xe(d,3)),this.setAttribute("uv",new xe(f,2));function _(){let M=new I,b=new I,w=0,y=(e-t)/n;for(let T=0;T<=r;T++){let F=[],O=T/r,N=O*(e-t)+t;for(let B=0;B<=s;B++){let G=B/s,E=G*l+a,U=Math.sin(E),C=Math.cos(E);b.x=N*U,b.y=-O*n+g,b.z=N*C,u.push(b.x,b.y,b.z),M.set(U,y,C).normalize(),d.push(M.x,M.y,M.z),f.push(G,1-O),F.push(p++)}x.push(F)}for(let T=0;T<s;T++)for(let F=0;F<r;F++){let O=x[F][T],N=x[F+1][T],B=x[F+1][T+1],G=x[F][T+1];(t>0||F!==0)&&(h.push(O,N,G),w+=3),(e>0||F!==r-1)&&(h.push(N,B,G),w+=3)}c.addGroup(m,w,0),m+=w}function v(M){let b=p,w=new xt,y=new I,T=0,F=M===!0?t:e,O=M===!0?1:-1;for(let B=1;B<=s;B++)u.push(0,g*O,0),d.push(0,O,0),f.push(.5,.5),p++;let N=p;for(let B=0;B<=s;B++){let E=B/s*l+a,U=Math.cos(E),C=Math.sin(E);y.x=F*C,y.y=g*O,y.z=F*U,u.push(y.x,y.y,y.z),d.push(0,O,0),w.x=U*.5+.5,w.y=C*.5*O+.5,f.push(w.x,w.y),p++}for(let B=0;B<s;B++){let G=b+B,E=N+B;M===!0?h.push(E,E+1,G):h.push(E+1,E,G),T+=3}c.addGroup(m,T,M===!0?1:2),m+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Li=class i extends Me{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var ci=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Kt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new xt:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new I,s=[],r=[],o=[],a=new I,l=new Ne;for(let f=0;f<=t;f++){let p=f/t;s[f]=this.getTangentAt(p,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(ge(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(ge(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}},xo=class extends ci{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new xt){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Oa=class extends xo{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Th(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var Iu=new I,Lu=new I,Vc=new Th,Wc=new Th,Xc=new Th,Tr=class extends ci{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Lu.subVectors(s[0],s[1]).add(s[0]),c=Lu);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Iu.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Iu),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),p<1e-4&&(p=x),g<1e-4&&(g=x),Vc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,x,g),Wc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,x,g),Xc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,x,g)}else this.curveType==="catmullrom"&&(Vc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Wc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Xc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Vc.calc(l),Wc.calc(l),Xc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Du(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function Uf(i,t){let e=1-i;return e*e*t}function Of(i,t){return 2*(1-i)*i*t}function kf(i,t){return i*i*t}function eo(i,t,e,n){return Uf(i,t)+Of(i,e)+kf(i,n)}function Bf(i,t){let e=1-i;return e*e*e*t}function zf(i,t){let e=1-i;return 3*e*e*i*t}function Hf(i,t){return 3*(1-i)*i*i*t}function Gf(i,t){return i*i*i*t}function no(i,t,e,n,s){return Bf(i,t)+zf(i,e)+Hf(i,n)+Gf(i,s)}var ka=class extends ci{constructor(t=new xt,e=new xt,n=new xt,s=new xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new xt){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(no(t,s.x,r.x,o.x,a.x),no(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ba=class extends ci{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(no(t,s.x,r.x,o.x,a.x),no(t,s.y,r.y,o.y,a.y),no(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},za=class extends ci{constructor(t=new xt,e=new xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new xt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ha=class extends ci{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ga=class extends ci{constructor(t=new xt,e=new xt,n=new xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new xt){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(eo(t,s.x,r.x,o.x),eo(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},yo=class extends ci{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(eo(t,s.x,r.x,o.x),eo(t,s.y,r.y,o.y),eo(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ar=class extends ci{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new xt){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Du(a,l.x,c.x,h.x,u.x),Du(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new xt().fromArray(s))}return this}},Vf=Object.freeze({__proto__:null,ArcCurve:Oa,CatmullRomCurve3:Tr,CubicBezierCurve:ka,CubicBezierCurve3:Ba,EllipseCurve:xo,LineCurve:za,LineCurve3:Ha,QuadraticBezierCurve:Ga,QuadraticBezierCurve3:yo,SplineCurve:Ar});var _o=class i extends un{constructor(t=[new xt(0,-.5),new xt(.5,0),new xt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ge(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,u=new I,d=new xt,f=new I,p=new I,x=new I,g=0,m=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:g=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,f.x=m*1,f.y=-g,f.z=m*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:x.normalize(),l.push(x.x,x.y,x.z);break;default:g=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,f.x=m*1,f.y=-g,f.z=m*0,p.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(p)}for(let _=0;_<=e;_++){let v=n+_*h*s,M=Math.sin(v),b=Math.cos(v);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*M,u.y=t[w].y,u.z=t[w].x*b,o.push(u.x,u.y,u.z),d.x=_/e,d.y=w/(t.length-1),a.push(d.x,d.y);let y=l[3*w+0]*M,T=l[3*w+1],F=l[3*w+0]*b;c.push(y,T,F)}}for(let _=0;_<e;_++)for(let v=0;v<t.length-1;v++){let M=v+_*t.length,b=M,w=M+t.length,y=M+t.length+1,T=M+1;r.push(b,w,T),r.push(y,T,w)}this.setIndex(r),this.setAttribute("position",new xe(o,3)),this.setAttribute("uv",new xe(a,2)),this.setAttribute("normal",new xe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var ce=class i extends un{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],p=[],x=[],g=[];for(let m=0;m<h;m++){let _=m*d-o;for(let v=0;v<c;v++){let M=v*u-r;p.push(M,-_,0),x.push(0,0,1),g.push(v/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let _=0;_<a;_++){let v=_+c*m,M=_+c*(m+1),b=_+1+c*(m+1),w=_+1+c*m;f.push(v,M,w),f.push(M,b,w)}this.setIndex(f),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(x,3)),this.setAttribute("uv",new xe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Re=class i extends un{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new I,d=new I,f=[],p=[],x=[],g=[];for(let m=0;m<=n;m++){let _=[],v=m/n,M=o+v*a,b=t*Math.cos(M),w=Math.sqrt(t*t-b*b),y=0;m===0&&o===0?y=.5/e:m===n&&l===Math.PI&&(y=-.5/e);for(let T=0;T<=e;T++){let F=T/e,O=s+F*r;u.x=-w*Math.cos(O),u.y=b,u.z=w*Math.sin(O),p.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(F+y,1-v),_.push(c++)}h.push(_)}for(let m=0;m<n;m++)for(let _=0;_<e;_++){let v=h[m][_+1],M=h[m][_],b=h[m+1][_],w=h[m+1][_+1];(m!==0||o>0)&&f.push(v,M,w),(m!==n-1||l<Math.PI)&&f.push(M,b,w)}this.setIndex(f),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(x,3)),this.setAttribute("uv",new xe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var hi=class i extends un{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new I,f=new I,p=new I;for(let x=0;x<=n;x++){let g=o+x/n*a;for(let m=0;m<=s;m++){let _=m/s*r;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),c.push(f.x,f.y,f.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),p.subVectors(f,d).normalize(),h.push(p.x,p.y,p.z),u.push(m/s),u.push(x/n)}}for(let x=1;x<=n;x++)for(let g=1;g<=s;g++){let m=(s+1)*x+g-1,_=(s+1)*(x-1)+g-1,v=(s+1)*(x-1)+g,M=(s+1)*x+g;l.push(m,_,M),l.push(_,v,M)}this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(h,3)),this.setAttribute("uv",new xe(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var vo=class i extends un{constructor(t=new yo(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new I,l=new I,c=new xt,h=new I,u=[],d=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new xe(u,3)),this.setAttribute("normal",new xe(d,3)),this.setAttribute("uv",new xe(f,2));function x(){for(let v=0;v<e;v++)g(v);g(r===!1?e:0),_(),m()}function g(v){h=t.getPointAt(v/e,h);let M=o.normals[v],b=o.binormals[v];for(let w=0;w<=s;w++){let y=w/s*Math.PI*2,T=Math.sin(y),F=-Math.cos(y);l.x=F*M.x+T*b.x,l.y=F*M.y+T*b.y,l.z=F*M.z+T*b.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function m(){for(let v=1;v<=e;v++)for(let M=1;M<=s;M++){let b=(s+1)*(v-1)+(M-1),w=(s+1)*v+(M-1),y=(s+1)*v+M,T=(s+1)*(v-1)+M;p.push(b,w,T),p.push(w,y,T)}}function _(){for(let v=0;v<=e;v++)for(let M=0;M<=s;M++)c.x=v/e,c.y=M/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Vf[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function qs(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Nu(s))s.isRenderTargetTexture?(Kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Nu(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function On(i){let t={};for(let e=0;e<i.length;e++){let n=qs(i[e]);for(let s in n)t[s]=n[s]}return t}function Nu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Wf(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ah(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Se.workingColorSpace}var Td={clone:qs,merge:On},Xf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,qf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Yn=class extends hs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Xf,this.fragmentShader=qf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=qs(t.uniforms),this.uniformsGroups=Wf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Ut().setHex(s.value);break;case"v2":this.uniforms[n].value=new xt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new tn().fromArray(s.value);break;case"m3":this.uniforms[n].value=new le().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ne().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Va=class extends Yn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},He=class extends hs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wl,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ge=class extends He{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new xt(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ge(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ut(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ut(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ut(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return Us('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){Us('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Wa=class extends hs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ud,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Xa=class extends hs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function gr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function ya(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var ds=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},qa=class extends ds{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Zc,endingEnd:Zc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Jc:r=t,a=2*e-n;break;case $c:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Jc:o=t,l=2*n-e;break;case $c:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-e)/(s-e),x=p*p,g=x*p,m=-d*g+2*d*x-d*p,_=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*p+1,v=(-1-f)*g+(1.5+f)*x+.5*p,M=f*g-f*x;for(let b=0;b!==a;++b)r[b]=m*o[h+b]+_*o[c+b]+v*o[l+b]+M*o[u+b];return r}},Ya=class extends ds{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},Za=class extends ds{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Ja=class extends ds{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let p=(n-e)/(s-e),x=1-p;for(let g=0;g!==a;++g)r[g]=o[c+g]*x+o[l+g]*p;return r}let d=a*2,f=t-1;for(let p=0;p!==a;++p){let x=o[c+p],g=o[l+p],m=f*d+p*2,_=u[m],v=u[m+1],M=t*d+p*2,b=h[M],w=h[M+1],y=Zf(n,e,_,b,s);r[p]=Ad(y,x,v,w,g)}return r}};function Ad(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function Yf(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function Zf(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=Ad(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=Yf(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var ti=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=gr(e,this.TimeBufferType),this.values=gr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:gr(t.times,Array),values:gr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),ya(t.settings)&&(n.settings={inTangents:gr(t.settings.inTangents,Array),outTangents:gr(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Za(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ya(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new qa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Ja(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case io:e=this.InterpolantFactoryMethodDiscrete;break;case Ia:e=this.InterpolantFactoryMethodLinear;break;case Ma:e=this.InterpolantFactoryMethodSmooth;break;case Yc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Kt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return io;case this.InterpolantFactoryMethodLinear:return Ia;case this.InterpolantFactoryMethodSmooth:return Ma;case this.InterpolantFactoryMethodBezier:return Yc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t;ya(this.settings)&&(Fu(this.settings.inTangents,t),Fu(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;ya(this.settings)&&(Uu(this.settings.inTangents,t),Uu(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(se("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(se("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){se("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){se("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&hf(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){se("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ma,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let x=e[u+p];if(x!==e[d+p]||x!==e[f+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,ya(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Fu(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]+=t}function Uu(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}ti.prototype.ValueTypeName="";ti.prototype.TimeBufferType=Float32Array;ti.prototype.ValueBufferType=Float32Array;ti.prototype.DefaultInterpolation=Ia;var fs=class extends ti{constructor(t,e,n){super(t,e,n)}};fs.prototype.ValueTypeName="bool";fs.prototype.ValueBufferType=Array;fs.prototype.DefaultInterpolation=io;fs.prototype.InterpolantFactoryMethodLinear=void 0;fs.prototype.InterpolantFactoryMethodSmooth=void 0;var $a=class extends ti{constructor(t,e,n,s){super(t,e,n,s)}};$a.prototype.ValueTypeName="color";var Ka=class extends ti{constructor(t,e,n,s){super(t,e,n,s)}};Ka.prototype.ValueTypeName="number";var ja=class extends ds{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)qn.slerpFlat(r,0,o,c-a,o,c,l);return r}},Mo=class extends ti{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new ja(this.times,this.values,this.getValueSize(),t)}};Mo.prototype.ValueTypeName="quaternion";Mo.prototype.InterpolantFactoryMethodSmooth=void 0;var ps=class extends ti{constructor(t,e,n){super(t,e,n)}};ps.prototype.ValueTypeName="string";ps.prototype.ValueBufferType=Array;ps.prototype.DefaultInterpolation=io;ps.prototype.InterpolantFactoryMethodLinear=void 0;ps.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends ti{constructor(t,e,n,s){super(t,e,n,s)}};Qa.prototype.ValueTypeName="vector";var tl=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Rd=new tl,el=class{constructor(t){this.manager=t!==void 0?t:Rd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};el.DEFAULT_MATERIAL_NAME="__DEFAULT";var bo=class extends Hn{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ut(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}};var qc=new Ne,Ou=new I,ku=new I,So=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.mapType=Zn,this.map=null,this.mapPass=null,this.matrix=new Ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new us,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new tn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Ou.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ou),ku.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ku),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){qc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(qc,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Mr||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(qc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},_a=new I,va=new qn,Ai=new I,wo=class extends Hn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ne,this.projectionMatrix=new Ne,this.projectionMatrixInverse=new Ne,this.coordinateSystem=ai,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(_a,va,Ai),Ai.x===1&&Ai.y===1&&Ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_a,va,Ai.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(_a,va,Ai),Ai.x===1&&Ai.y===1&&Ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_a,va,Ai.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ls=new I,Bu=new xt,zu=new xt,Un=class extends wo{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=La*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(bc*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return La*2*Math.atan(Math.tan(bc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ls.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ls.x,ls.y).multiplyScalar(-t/ls.z),ls.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ls.x,ls.y).multiplyScalar(-t/ls.z)}getViewSize(t,e){return this.getViewBounds(t,Bu,zu),e.subVectors(zu,Bu)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(bc*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Kc=class extends So{constructor(){super(new Un(90,1,.5,500)),this.isPointLightShadow=!0}},Ji=class extends bo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Kc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Eo=class extends wo{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},jc=class extends So{constructor(){super(new Eo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Rr=class extends bo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Hn.DEFAULT_UP),this.updateMatrix(),this.target=new Hn,this.shadow=new jc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var To=class extends un{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var xr=-90,yr=1,Cr=class extends Hn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Un(xr,yr,t,e);s.layers=this.layers,this.add(s);let r=new Un(xr,yr,t,e);r.layers=this.layers,this.add(r);let o=new Un(xr,yr,t,e);o.layers=this.layers,this.add(o);let a=new Un(xr,yr,t,e);a.layers=this.layers,this.add(a);let l=new Un(xr,yr,t,e);l.layers=this.layers,this.add(l);let c=new Un(xr,yr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===ai)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Mr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=x,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},nl=class extends Un{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}};var Rh="\\[\\]\\.:\\/",Jf=new RegExp("["+Rh+"]","g"),Ch="[^"+Rh+"]",$f="[^"+Rh.replace("\\.","")+"]",Kf=/((?:WC+[\/:])*)/.source.replace("WC",Ch),jf=/(WCOD+)?/.source.replace("WCOD",$f),Qf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ch),tp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ch),ep=new RegExp("^"+Kf+jf+Qf+tp+"$"),np=["material","materials","bones","map"],Qc=class{constructor(t,e,n){let s=n||Je.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Je=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Jf,"")}static parseTrackName(t){let e=ep.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);np.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Kt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){se("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){se("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){se("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){se("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){se("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;se("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Je.Composite=Qc;Je.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Je.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Je.prototype.GetterByBindingType=[Je.prototype._getValue_direct,Je.prototype._getValue_array,Je.prototype._getValue_arrayElement,Je.prototype._getValue_toArray];Je.prototype.SetterByBindingTypeAndVersioning=[[Je.prototype._setValue_direct,Je.prototype._setValue_direct_setNeedsUpdate,Je.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Je.prototype._setValue_array,Je.prototype._setValue_array_setNeedsUpdate,Je.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Je.prototype._setValue_arrayElement,Je.prototype._setValue_arrayElement_setNeedsUpdate,Je.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Je.prototype._setValue_fromArray,Je.prototype._setValue_fromArray_setNeedsUpdate,Je.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var m_=new Float32Array(1);var Hu=new Ne,Bs=class{constructor(t,e,n=0,s=1/0){this.ray=new uo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new wr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):se("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Hu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Hu),this}intersectObject(t,e=!0,n=[]){return th(t,this,n,e),n.sort(Gu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)th(t[s],this,n,e);return n.sort(Gu),n}};function Gu(i,t){return i.distance-t.distance}function th(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)th(r[o],t,e,!0)}}var Fh=class Fh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};Fh.prototype.isMatrix2=!0;var eh=Fh;function Ph(i,t,e,n){let s=ip(n);switch(e){case yh:return i*t;case hl:return i*t/s.components*s.byteLength;case ul:return i*t/s.components*s.byteLength;case _s:return i*t*2/s.components*s.byteLength;case dl:return i*t*2/s.components*s.byteLength;case _h:return i*t*3/s.components*s.byteLength;case ni:return i*t*4/s.components*s.byteLength;case fl:return i*t*4/s.components*s.byteLength;case Po:case Io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Lo:case Do:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ml:case xl:return Math.max(i,16)*Math.max(t,8)/4;case pl:case gl:return Math.max(i,8)*Math.max(t,8)/2;case yl:case _l:case Ml:case bl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case vl:case No:case Sl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case El:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Tl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Al:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Rl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Cl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Pl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Il:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ll:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Dl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Nl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Fl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ul:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ol:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case kl:case Bl:case zl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Hl:case Gl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Fo:case Vl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ip(i){switch(i){case Zn:case ph:return{byteLength:1,components:1};case Lr:case mh:case ei:return{byteLength:2,components:1};case ll:case cl:return{byteLength:2,components:4};case _i:case al:case ui:return{byteLength:4,components:1};case gh:case xh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function $d(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function rp(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],x=u[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let x=u[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var op=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ap=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,up=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,fp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_p=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,vp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ep=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Tp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Cp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Pp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Ip=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Up=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Op=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,kp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Gp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Vp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Yp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$p=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Kp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,jp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,em=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,im=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,rm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,om=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,am=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,lm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,um=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,mm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ym=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_m=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,vm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,bm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,wm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Em=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Am=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Rm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Cm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Im=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Fm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Um=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Om=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,km=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Vm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Wm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Xm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ym=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$m=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,sg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,rg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,og=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lg=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ug=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,dg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,fg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,pg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_g=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,vg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,wg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Tg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ag=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Pg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ig=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ng=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ug=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Og=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ye={alphahash_fragment:op,alphahash_pars_fragment:ap,alphamap_fragment:lp,alphamap_pars_fragment:cp,alphatest_fragment:hp,alphatest_pars_fragment:up,aomap_fragment:dp,aomap_pars_fragment:fp,batching_pars_vertex:pp,batching_vertex:mp,begin_vertex:gp,beginnormal_vertex:xp,bsdfs:yp,iridescence_fragment:_p,bumpmap_pars_fragment:vp,clipping_planes_fragment:Mp,clipping_planes_pars_fragment:bp,clipping_planes_pars_vertex:Sp,clipping_planes_vertex:wp,color_fragment:Ep,color_pars_fragment:Tp,color_pars_vertex:Ap,color_vertex:Rp,common:Cp,defaultnormal_vertex:Pp,displacementmap_pars_vertex:Ip,displacementmap_vertex:Lp,emissivemap_fragment:Dp,emissivemap_pars_fragment:Np,colorspace_fragment:Fp,colorspace_pars_fragment:Up,envmap_fragment:Op,envmap_common_pars_fragment:kp,envmap_pars_fragment:Bp,envmap_pars_vertex:zp,envmap_physical_pars_fragment:Kp,envmap_vertex:Hp,fog_vertex:Gp,fog_pars_vertex:Vp,fog_fragment:Wp,fog_pars_fragment:Xp,gradientmap_pars_fragment:qp,lightmap_pars_fragment:Yp,lights_lambert_fragment:Zp,lights_lambert_pars_fragment:Jp,lights_pars_begin:$p,lights_toon_fragment:jp,lights_toon_pars_fragment:Qp,lights_phong_fragment:tm,lights_phong_pars_fragment:em,lights_physical_fragment:nm,lights_physical_pars_fragment:im,lights_fragment_begin:sm,lights_fragment_maps:rm,lights_fragment_end:om,lightprobes_pars_fragment:am,logdepthbuf_fragment:lm,logdepthbuf_pars_fragment:cm,logdepthbuf_pars_vertex:hm,logdepthbuf_vertex:um,map_fragment:dm,map_pars_fragment:fm,map_particle_fragment:pm,map_particle_pars_fragment:mm,metalnessmap_fragment:gm,metalnessmap_pars_fragment:xm,morphinstance_vertex:ym,morphcolor_vertex:_m,morphnormal_vertex:vm,morphtarget_pars_vertex:Mm,morphtarget_vertex:bm,normal_fragment_begin:Sm,normal_fragment_maps:wm,normal_pars_fragment:Em,normal_pars_vertex:Tm,normal_vertex:Am,normalmap_pars_fragment:Rm,clearcoat_normal_fragment_begin:Cm,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Im,iridescence_pars_fragment:Lm,opaque_fragment:Dm,packing:Nm,premultiplied_alpha_fragment:Fm,project_vertex:Um,dithering_fragment:Om,dithering_pars_fragment:km,roughnessmap_fragment:Bm,roughnessmap_pars_fragment:zm,shadowmap_pars_fragment:Hm,shadowmap_pars_vertex:Gm,shadowmap_vertex:Vm,shadowmask_pars_fragment:Wm,skinbase_vertex:Xm,skinning_pars_vertex:qm,skinning_vertex:Ym,skinnormal_vertex:Zm,specularmap_fragment:Jm,specularmap_pars_fragment:$m,tonemapping_fragment:Km,tonemapping_pars_fragment:jm,transmission_fragment:Qm,transmission_pars_fragment:tg,uv_pars_fragment:eg,uv_pars_vertex:ng,uv_vertex:ig,worldpos_vertex:sg,background_vert:rg,background_frag:og,backgroundCube_vert:ag,backgroundCube_frag:lg,cube_vert:cg,cube_frag:hg,depth_vert:ug,depth_frag:dg,distance_vert:fg,distance_frag:pg,equirect_vert:mg,equirect_frag:gg,linedashed_vert:xg,linedashed_frag:yg,meshbasic_vert:_g,meshbasic_frag:vg,meshlambert_vert:Mg,meshlambert_frag:bg,meshmatcap_vert:Sg,meshmatcap_frag:wg,meshnormal_vert:Eg,meshnormal_frag:Tg,meshphong_vert:Ag,meshphong_frag:Rg,meshphysical_vert:Cg,meshphysical_frag:Pg,meshtoon_vert:Ig,meshtoon_frag:Lg,points_vert:Dg,points_frag:Ng,shadow_vert:Fg,shadow_frag:Ug,sprite_vert:Og,sprite_frag:kg},Nt={common:{diffuse:{value:new Ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new le}},envmap:{envMap:{value:null},envMapRotation:{value:new le},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new le},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0},uvTransform:{value:new le}},sprite:{diffuse:{value:new Ut(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}}},Fi={basic:{uniforms:On([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.fog]),vertexShader:ye.meshbasic_vert,fragmentShader:ye.meshbasic_frag},lambert:{uniforms:On([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new Ut(0)},envMapIntensity:{value:1}}]),vertexShader:ye.meshlambert_vert,fragmentShader:ye.meshlambert_frag},phong:{uniforms:On([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new Ut(0)},specular:{value:new Ut(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ye.meshphong_vert,fragmentShader:ye.meshphong_frag},standard:{uniforms:On([Nt.common,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.roughnessmap,Nt.metalnessmap,Nt.fog,Nt.lights,{emissive:{value:new Ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag},toon:{uniforms:On([Nt.common,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.gradientmap,Nt.fog,Nt.lights,{emissive:{value:new Ut(0)}}]),vertexShader:ye.meshtoon_vert,fragmentShader:ye.meshtoon_frag},matcap:{uniforms:On([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,{matcap:{value:null}}]),vertexShader:ye.meshmatcap_vert,fragmentShader:ye.meshmatcap_frag},points:{uniforms:On([Nt.points,Nt.fog]),vertexShader:ye.points_vert,fragmentShader:ye.points_frag},dashed:{uniforms:On([Nt.common,Nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ye.linedashed_vert,fragmentShader:ye.linedashed_frag},depth:{uniforms:On([Nt.common,Nt.displacementmap]),vertexShader:ye.depth_vert,fragmentShader:ye.depth_frag},normal:{uniforms:On([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,{opacity:{value:1}}]),vertexShader:ye.meshnormal_vert,fragmentShader:ye.meshnormal_frag},sprite:{uniforms:On([Nt.sprite,Nt.fog]),vertexShader:ye.sprite_vert,fragmentShader:ye.sprite_frag},background:{uniforms:{uvTransform:{value:new le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ye.background_vert,fragmentShader:ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new le}},vertexShader:ye.backgroundCube_vert,fragmentShader:ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ye.cube_vert,fragmentShader:ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ye.equirect_vert,fragmentShader:ye.equirect_frag},distance:{uniforms:On([Nt.common,Nt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ye.distance_vert,fragmentShader:ye.distance_frag},shadow:{uniforms:On([Nt.lights,Nt.fog,{color:{value:new Ut(0)},opacity:{value:1}}]),vertexShader:ye.shadow_vert,fragmentShader:ye.shadow_frag}};Fi.physical={uniforms:On([Fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new le},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new le},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new le},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new le},sheen:{value:0},sheenColor:{value:new Ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new le},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new le},attenuationDistance:{value:0},attenuationColor:{value:new Ut(0)},specularColor:{value:new Ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new le},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new le}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag};var Xl={r:0,b:0,g:0},Bg=new Ne,Kd=new le;Kd.set(-1,0,0,0,1,0,0,0,1);function zg(i,t,e,n,s,r){let o=new Ut(0),a=s===!0?0:1,l,c,h=null,u=0,d=null;function f(_){let v=_.isScene===!0?_.background:null;if(v&&v.isTexture){let M=_.backgroundBlurriness>0;v=t.get(v,M)}return v}function p(_){let v=!1,M=f(_);M===null?g(o,a):M&&M.isColor&&(g(M,1),v=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||v)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(_,v){let M=f(v);M&&M.isCubeTexture?(c===void 0&&(c=new tt(new yi(1,1,1),new Yn({name:"BackgroundCubeMaterial",uniforms:qs(Fi.backgroundCube.uniforms),vertexShader:Fi.backgroundCube.vertexShader,fragmentShader:Fi.backgroundCube.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,w,y){this.matrixWorld.copyPosition(y.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Bg.makeRotationFromEuler(v.backgroundRotation)).transpose(),M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Kd),c.material.toneMapped=Se.getTransfer(M.colorSpace)!==ke,(h!==M||u!==M.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,d=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new tt(new ce(2,2),new Yn({name:"BackgroundMaterial",uniforms:qs(Fi.background.uniforms),vertexShader:Fi.background.vertexShader,fragmentShader:Fi.background.fragmentShader,side:ms,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=Se.getTransfer(M.colorSpace)!==ke,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,d=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function g(_,v){_.getRGB(Xl,Ah(i)),e.buffers.color.setClear(Xl.r,Xl.g,Xl.b,v,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,v=1){o.set(_),a=v,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(_){a=_,g(o,a)},render:p,addToRenderList:x,dispose:m}}function Hg(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(N,B,G,E,U){let C=!1,P=u(N,E,G,B);r!==P&&(r=P,c(r.object)),C=f(N,E,G,U),C&&p(N,E,G,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,M(N,B,G,E),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return i.createVertexArray()}function c(N){return i.bindVertexArray(N)}function h(N){return i.deleteVertexArray(N)}function u(N,B,G,E){let U=E.wireframe===!0,C=n[B.id];C===void 0&&(C={},n[B.id]=C);let P=N.isInstancedMesh===!0?N.id:0,X=C[P];X===void 0&&(X={},C[P]=X);let D=X[G.id];D===void 0&&(D={},X[G.id]=D);let W=D[U];return W===void 0&&(W=d(l()),D[U]=W),W}function d(N){let B=[],G=[],E=[];for(let U=0;U<e;U++)B[U]=0,G[U]=0,E[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:G,attributeDivisors:E,object:N,attributes:{},index:null}}function f(N,B,G,E){let U=r.attributes,C=B.attributes,P=0,X=G.getAttributes();for(let D in X)if(X[D].location>=0){let K=U[D],ut=C[D];if(ut===void 0&&(D==="instanceMatrix"&&N.instanceMatrix&&(ut=N.instanceMatrix),D==="instanceColor"&&N.instanceColor&&(ut=N.instanceColor)),K===void 0||K.attribute!==ut||ut&&K.data!==ut.data)return!0;P++}return r.attributesNum!==P||r.index!==E}function p(N,B,G,E){let U={},C=B.attributes,P=0,X=G.getAttributes();for(let D in X)if(X[D].location>=0){let K=C[D];K===void 0&&(D==="instanceMatrix"&&N.instanceMatrix&&(K=N.instanceMatrix),D==="instanceColor"&&N.instanceColor&&(K=N.instanceColor));let ut={};ut.attribute=K,K&&K.data&&(ut.data=K.data),U[D]=ut,P++}r.attributes=U,r.attributesNum=P,r.index=E}function x(){let N=r.newAttributes;for(let B=0,G=N.length;B<G;B++)N[B]=0}function g(N){m(N,0)}function m(N,B){let G=r.newAttributes,E=r.enabledAttributes,U=r.attributeDivisors;G[N]=1,E[N]===0&&(i.enableVertexAttribArray(N),E[N]=1),U[N]!==B&&(i.vertexAttribDivisor(N,B),U[N]=B)}function _(){let N=r.newAttributes,B=r.enabledAttributes;for(let G=0,E=B.length;G<E;G++)B[G]!==N[G]&&(i.disableVertexAttribArray(G),B[G]=0)}function v(N,B,G,E,U,C,P){P===!0?i.vertexAttribIPointer(N,B,G,U,C):i.vertexAttribPointer(N,B,G,E,U,C)}function M(N,B,G,E){x();let U=E.attributes,C=G.getAttributes(),P=B.defaultAttributeValues;for(let X in C){let D=C[X];if(D.location>=0){let W=U[X];if(W===void 0&&(X==="instanceMatrix"&&N.instanceMatrix&&(W=N.instanceMatrix),X==="instanceColor"&&N.instanceColor&&(W=N.instanceColor)),W!==void 0){let K=W.normalized,ut=W.itemSize,Pt=t.get(W);if(Pt===void 0)continue;let Z=Pt.buffer,ft=Pt.type,Rt=Pt.bytesPerElement,Gt=ft===i.INT||ft===i.UNSIGNED_INT||W.gpuType===al;if(W.isInterleavedBufferAttribute){let wt=W.data,$t=wt.isInterleavedBuffer===!0?wt.stride:wt.itemSize,Te=W.offset;if(wt.isInstancedInterleavedBuffer||wt.isInstancedBufferAttribute){for(let Mt=0;Mt<D.locationSize;Mt++)m(D.location+Mt,wt.meshPerAttribute);N.isInstancedMesh!==!0&&E._maxInstanceCount===void 0&&(E._maxInstanceCount=wt.meshPerAttribute*wt.count)}else for(let Mt=0;Mt<D.locationSize;Mt++)g(D.location+Mt);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let Mt=0;Mt<D.locationSize;Mt++)v(D.location+Mt,ut/D.locationSize,ft,K,$t*Rt,(Te+ut/D.locationSize*Mt)*Rt,Gt)}else{if(W.isInstancedBufferAttribute){for(let wt=0;wt<D.locationSize;wt++)m(D.location+wt,W.meshPerAttribute);N.isInstancedMesh!==!0&&E._maxInstanceCount===void 0&&(E._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let wt=0;wt<D.locationSize;wt++)g(D.location+wt);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let wt=0;wt<D.locationSize;wt++)v(D.location+wt,ut/D.locationSize,ft,K,ut*Rt,ut/D.locationSize*wt*Rt,Gt)}}else if(P!==void 0){let K=P[X];if(K!==void 0)switch(K.length){case 2:i.vertexAttrib2fv(D.location,K);break;case 3:i.vertexAttrib3fv(D.location,K);break;case 4:i.vertexAttrib4fv(D.location,K);break;default:i.vertexAttrib1fv(D.location,K)}}}}_()}function b(){F();for(let N in n){let B=n[N];for(let G in B){let E=B[G];for(let U in E){let C=E[U];for(let P in C)h(C[P].object),delete C[P];delete E[U]}}delete n[N]}}function w(N){if(n[N.id]===void 0)return;let B=n[N.id];for(let G in B){let E=B[G];for(let U in E){let C=E[U];for(let P in C)h(C[P].object),delete C[P];delete E[U]}}delete n[N.id]}function y(N){for(let B in n){let G=n[B];for(let E in G){let U=G[E];if(U[N.id]===void 0)continue;let C=U[N.id];for(let P in C)h(C[P].object),delete C[P];delete U[N.id]}}}function T(N){for(let B in n){let G=n[B],E=N.isInstancedMesh===!0?N.id:0,U=G[E];if(U!==void 0){for(let C in U){let P=U[C];for(let X in P)h(P[X].object),delete P[X];delete U[C]}delete G[E],Object.keys(G).length===0&&delete n[B]}}}function F(){O(),o=!0,r!==s&&(r=s,c(r.object))}function O(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:F,resetDefaultState:O,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfObject:T,releaseStatesOfProgram:y,initAttributes:x,enableAttribute:g,disableUnusedAttributes:_}}function Gg(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];e.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Vg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let y=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(y){return!(y!==ni&&n.convert(y)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(y){let T=y===ei&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(y!==Zn&&y!==ui&&!T&&n.convert(y)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(y){if(y==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Kt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=e.logarithmicDepthBuffer===!0&&u===!1;e.reversedDepthBuffer===!0&&u===!1&&Kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&u===!0&&Kt("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:M,maxSamples:b,samples:w}}function Wg(i){let t=this,e=null,n=0,s=!1,r=!1,o=new xi,a=new le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{let _=r?0:n,v=_*4,M=m.clippingState||null;l.value=M,M=h(p,d,v,f);for(let b=0;b!==v;++b)M[b]=e[b];m.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,p){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=l.value,p!==!0||g===null){let m=f+x*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(g===null||g.length<m)&&(g=new Float32Array(m));for(let v=0,M=f;v!==x;++v,M+=4)o.copy(u[v]).applyMatrix4(_,a),o.normal.toArray(g,M),g[M+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}var zo=class extends Qn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new fo(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new yi(5,5,5),r=new Yn({name:"CubemapFromEquirect",uniforms:qs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gn,blending:Hs});r.uniforms.tEquirect.value=e;let o=new tt(s,r),a=e.minFilter;return e.minFilter===$i&&(e.minFilter=xn),new Cr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},Cd=256,Xg=3,qg=20,jd=256,Qd=16,Yg=3,Zg=new I,Jg=new Ut,Nr=class i{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Cr(1,10,null),this._boxMesh=new tt(new yi(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=Zg}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),h=this._getSourceTarget(!0);e>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,p=l.autoClearStencil,x=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(t.background=l.getClearColor(Jg));let g=new Cr(n,s,h);return g.position.copy(a),g.update(l,t),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=p,t.background=x,e>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ld(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Id(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(Cd,wd(t))}_fromTexture(t,e){t.mapping===Ws||t.mapping===Ir?this._setSize(t.image.length===0?Cd:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){let t=this._cubeSize,e=Pd(t,!1,!1),n=Math.log2(t)-Xg;for(let s=0;s<=n;s++)e.texture.mipmaps.push({width:t>>s,height:t>>s});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){let e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Pd(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=t,r.activeMipmapLevel=e;let o=t.width>>e;t.viewport.set(0,0,o,o),r.update(this._renderer,s),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===Ws||t.mapping===Ir?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ld()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Id()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=$g(),this._integrationMaterial=Kg());let e=this._cubeSize,n=t.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/Qd);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-Yg)r.roughness.value=a,this._renderCube(t,o,this._integrationMaterial);else{let l=a>0?Math.log2(e)+.5*Math.log2(6/(jd*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(t,o,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=jg());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(t,0,n),s.envMap.value=t.texture,this._renderCube(r,0,n)}};function Pd(i,t,e){return new zo(i,{minFilter:$i,generateMipmaps:t,type:ei,colorSpace:so,depthBuffer:e})}function Ho(i,t,e){return new Yn({name:i,uniforms:t,vertexShader:ye.cube_vert,fragmentShader:e,side:Gn,blending:Hs,depthTest:!1,depthWrite:!1})}function $g(){return Ho("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${jd}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Kg(){return Ho("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Qd}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function jg(){return Ho("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${qg}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Id(){return Ho("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Ld(){return Ho("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Qg(i){let t=new WeakMap,e=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===sl||f===rl)if(t.has(d)){let p=t.get(d).texture;return a(p,d.mapping)}else{let p=d.image;if(p&&p.height>0){let x=new zo(p.height);return x.fromEquirectangularTexture(i,d),t.set(d,x),d.addEventListener("dispose",c),a(x.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let f=d.mapping,p=f===sl||f===rl,x=f===Ws||f===Ir;if(p||x){let g=e.get(d),m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new Nr(i)),g=p?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,e.set(d,g),g.texture;if(g!==void 0)return g.texture;{let _=d.image;return p&&_&&_.height>0||x&&_&&l(_)?(n===null&&(n=new Nr(i)),g=p?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,e.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function a(d,f){return f===sl?d.mapping=Ws:f===rl&&(d.mapping=Ir),d}function l(d){let f=0,p=6;for(let x=0;x<p;x++)d[x]!==void 0&&f++;return f===p}function c(d){let f=d.target;f.removeEventListener("dispose",c);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function tx(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Us("WebGLRenderer: "+n+" extension not supported."),s}}}function ex(i,t,e,n){let s={},r=new WeakMap,o=new FinalizationRegistry(p=>delete s[p]);function a(p){l(p.target)}function l(p){p.index!==null&&t.remove(p.index);for(let g in p.attributes)t.remove(p.attributes[g]);p.removeEventListener("dispose",a),delete s[p.id],o.unregister(p);let x=r.get(p);x&&(t.remove(x),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function c(p,x){return s[x.id]!==void 0||(x.addEventListener("dispose",a),s[x.id]=new WeakRef(x),o.register(x,x.id,x),e.memory.geometries++),x}function h(p){let x=p.attributes;for(let g in x)t.update(x[g],i.ARRAY_BUFFER)}function u(p){let x=p.index,g=p.attributes.position,m=0;if(g===void 0)return;let _=x!==null?x.array.length:g.array.length/3-1,v=g.count>=65535?ho:co,M=new v(Math.ceil(_/3)*6,1),b=M.array;if(x!==null){let y=x.array;m=x.version;for(let T=0,F=0;T<_;T+=3){let O=y[T+0],N=y[T+1],B=y[T+2];b[F++]=O,b[F++]=N,b[F++]=N,b[F++]=B,b[F++]=B,b[F++]=O}}else{m=g.version;for(let y=0,T=0;y<_;y+=3){let F=y+0,O=y+1,N=y+2;b[T++]=F,b[T++]=O,b[T++]=O,b[T++]=N,b[T++]=N,b[T++]=F}}M.version=m;let w=r.get(p);w&&t.remove(w),r.set(p,M)}function d(p){let x=r.get(p);if(x){let g=p.index;g!==null&&x.version<g.version&&u(p)}else u(p);return r.get(p)}function f(){for(let p in s){let x=s[p].deref();x!==void 0&&l(x)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function nx(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*o),e.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*o,f),e.update(d,n,f))}function h(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let x=0;for(let g=0;g<f;g++)x+=d[g];e.update(x,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function ix(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:se("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function sx(i,t,e){let n=new WeakMap,s=new tn;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let F=function(){y.dispose(),n.delete(a),a.removeEventListener("dispose",F)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],v=0;f===!0&&(v=1),p===!0&&(v=2),x===!0&&(v=3);let M=a.attributes.position.count*v,b=1;M>t.maxTextureSize&&(b=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let w=new Float32Array(M*b*4*u),y=new ao(w,M,b,u);y.type=ui,y.needsUpdate=!0;let T=v*4;for(let O=0;O<u;O++){let N=g[O],B=m[O],G=_[O],E=M*b*4*O;for(let U=0;U<N.count;U++){let C=U*T;f===!0&&(s.fromBufferAttribute(N,U),w[E+C+0]=s.x,w[E+C+1]=s.y,w[E+C+2]=s.z,w[E+C+3]=0),p===!0&&(s.fromBufferAttribute(B,U),w[E+C+4]=s.x,w[E+C+5]=s.y,w[E+C+6]=s.z,w[E+C+7]=0),x===!0&&(s.fromBufferAttribute(G,U),w[E+C+8]=s.x,w[E+C+9]=s.y,w[E+C+10]=s.z,w[E+C+11]=G.itemSize===4?s.w:1)}}d={count:u,texture:y,size:new xt(M,b)},n.set(a,d),a.addEventListener("dispose",F)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function rx(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,u=c.geometry,d=t.get(c,u);if(r.get(d)!==h&&(t.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var ox={[ah]:"LINEAR_TONE_MAPPING",[lh]:"REINHARD_TONE_MAPPING",[ch]:"CINEON_TONE_MAPPING",[Ro]:"ACES_FILMIC_TONE_MAPPING",[uh]:"AGX_TONE_MAPPING",[dh]:"NEUTRAL_TONE_MAPPING",[hh]:"CUSTOM_TONE_MAPPING"};function ax(i,t,e,n,s,r){let o=new Qn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,h=new un;h.setAttribute("position",new xe([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new xe([0,2,0,0,2,0],2));let u=new Va({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new tt(h,u),f=new Eo(-1,1,1,-1,0,1),p=null,x=null,g=!1,m,_=null,v=[],M=!1;this.setSize=function(b,w){o.setSize(b,w),a!==null&&a.setSize(b,w),l!==null&&l.setSize(b,w);for(let y=0;y<v.length;y++){let T=v[y];T.setSize&&T.setSize(b,w)}},this.setEffects=function(b){v=b,M=v.length>0&&v[0].isRenderPass===!0;let w=o.width,y=o.height;v.length>0&&a===null&&(a=new Qn(w,y,{type:ei,depthBuffer:!1,stencilBuffer:!1}),l=new Qn(w,y,{type:ei,depthBuffer:!1,stencilBuffer:!1}));let T=s===!0&&v.some(F=>F.needsDepthTexture===!0);T!==(o.depthTexture!==null)&&(T===!0&&c===null&&(c=new Zi(w,y),r===!0&&(c.format=Ki,c.type=Xs)),o.dispose(),o.depthTexture=T?c:null,o.resolveDepthBuffer=T,o.storeMultisampledDepthBuffer=T);for(let F=0;F<v.length;F++){let O=v[F];O.setSize&&O.setSize(w,y),T&&O.needsDepthTexture===!0&&O.setDepthTexture&&O.setDepthTexture(c)}},this.begin=function(b,w){if(g||b.toneMapping===Di&&v.length===0)return!1;if(_=w,w!==null){let y=w.width,T=w.height;(o.width!==y||o.height!==T)&&this.setSize(y,T)}return M===!1&&b.setRenderTarget(o),m=b.toneMapping,b.toneMapping=Di,!0},this.hasRenderPass=function(){return M},this.end=function(b,w){b.toneMapping=m,g=!0;let y=o,T=a;for(let F=0;F<v.length;F++){let O=v[F];O.enabled!==!1&&(O.render(b,T,y,w),O.needsSwap!==!1&&(y=T,T=T===a?l:a))}if(p!==b.outputColorSpace||x!==b.toneMapping){p=b.outputColorSpace,x=b.toneMapping,u.defines={},Se.getTransfer(p)===ke&&(u.defines.SRGB_TRANSFER="");let F=ox[x];F&&(u.defines[F]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=y.texture,b.setRenderTarget(_),b.render(d,f),_=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var t0=new Ln,e0=new Zi(1,1),n0=new mo(1),i0=new ao,s0=new Fa,r0=new fo,Dd=[],Nd=[],Fd=new Float32Array(16),Ud=new Float32Array(9),Od=new Float32Array(4);function Fr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Dd[s];if(r===void 0&&(r=new Float32Array(s),Dd[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function _n(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function vn(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Zl(i,t){let e=Nd[t];e===void 0&&(e=new Int32Array(t),Nd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function lx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function cx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_n(e,t))return;i.uniform2fv(this.addr,t),vn(e,t)}}function hx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_n(e,t))return;i.uniform3fv(this.addr,t),vn(e,t)}}function ux(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_n(e,t))return;i.uniform4fv(this.addr,t),vn(e,t)}}function dx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_n(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),vn(e,t)}else{if(_n(e,n))return;Od.set(n),i.uniformMatrix2fv(this.addr,!1,Od),vn(e,n)}}function fx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_n(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),vn(e,t)}else{if(_n(e,n))return;Ud.set(n),i.uniformMatrix3fv(this.addr,!1,Ud),vn(e,n)}}function px(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_n(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),vn(e,t)}else{if(_n(e,n))return;Fd.set(n),i.uniformMatrix4fv(this.addr,!1,Fd),vn(e,n)}}function mx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function gx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_n(e,t))return;i.uniform2iv(this.addr,t),vn(e,t)}}function xx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_n(e,t))return;i.uniform3iv(this.addr,t),vn(e,t)}}function yx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_n(e,t))return;i.uniform4iv(this.addr,t),vn(e,t)}}function _x(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function vx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_n(e,t))return;i.uniform2uiv(this.addr,t),vn(e,t)}}function Mx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_n(e,t))return;i.uniform3uiv(this.addr,t),vn(e,t)}}function bx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_n(e,t))return;i.uniform4uiv(this.addr,t),vn(e,t)}}function Jl(i){return i.version===0&&(i.compareFunction=bh,i.needsUpdate=!0),i}function Sx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Jl(e0):r=t0,e.setTexture2D(t||r,s)}function wx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||s0,s)}function Ex(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Jl(n0):r=r0,e.setTextureCube(t||r,s)}function Tx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||i0,s)}function Ax(i){switch(i){case 5126:return lx;case 35664:return cx;case 35665:return hx;case 35666:return ux;case 35674:return dx;case 35675:return fx;case 35676:return px;case 5124:case 35670:return mx;case 35667:case 35671:return gx;case 35668:case 35672:return xx;case 35669:case 35673:return yx;case 5125:return _x;case 36294:return vx;case 36295:return Mx;case 36296:return bx;case 35678:case 36198:case 36298:case 36306:case 35682:return Sx;case 35679:case 36299:case 36307:return wx;case 35680:case 36300:case 36308:case 36293:return Ex;case 36289:case 36303:case 36311:case 36292:return Tx}}function Rx(i,t){i.uniform1fv(this.addr,t)}function Cx(i,t){let e=Fr(t,this.size,2);i.uniform2fv(this.addr,e)}function Px(i,t){let e=Fr(t,this.size,3);i.uniform3fv(this.addr,e)}function Ix(i,t){let e=Fr(t,this.size,4);i.uniform4fv(this.addr,e)}function Lx(i,t){let e=Fr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Dx(i,t){let e=Fr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Nx(i,t){let e=Fr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Fx(i,t){i.uniform1iv(this.addr,t)}function Ux(i,t){i.uniform2iv(this.addr,t)}function Ox(i,t){i.uniform3iv(this.addr,t)}function kx(i,t){i.uniform4iv(this.addr,t)}function Bx(i,t){i.uniform1uiv(this.addr,t)}function zx(i,t){i.uniform2uiv(this.addr,t)}function Hx(i,t){i.uniform3uiv(this.addr,t)}function Gx(i,t){i.uniform4uiv(this.addr,t)}function Vx(i,t,e){let n=this.cache,s=t.length,r=Zl(e,s);_n(n,r)||(i.uniform1iv(this.addr,r),vn(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Jl(e0):o=t0;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function Wx(i,t,e){let n=this.cache,s=t.length,r=Zl(e,s);_n(n,r)||(i.uniform1iv(this.addr,r),vn(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||s0,r[o])}function Xx(i,t,e){let n=this.cache,s=t.length,r=Zl(e,s);_n(n,r)||(i.uniform1iv(this.addr,r),vn(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=Jl(n0):o=r0;for(let a=0;a!==s;++a)e.setTextureCube(t[a]||o,r[a])}function qx(i,t,e){let n=this.cache,s=t.length,r=Zl(e,s);_n(n,r)||(i.uniform1iv(this.addr,r),vn(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||i0,r[o])}function Yx(i){switch(i){case 5126:return Rx;case 35664:return Cx;case 35665:return Px;case 35666:return Ix;case 35674:return Lx;case 35675:return Dx;case 35676:return Nx;case 5124:case 35670:return Fx;case 35667:case 35671:return Ux;case 35668:case 35672:return Ox;case 35669:case 35673:return kx;case 5125:return Bx;case 36294:return zx;case 36295:return Hx;case 36296:return Gx;case 35678:case 36198:case 36298:case 36306:case 35682:return Vx;case 35679:case 36299:case 36307:return Wx;case 35680:case 36300:case 36308:case 36293:return Xx;case 36289:case 36303:case 36311:case 36292:return qx}}var kh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ax(e.type)}},Bh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Yx(e.type)}},zh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Uh=/(\w+)(\])?(\[|\.)?/g;function kd(i,t){i.seq.push(t),i.map[t.id]=t}function Zx(i,t,e){let n=i.name,s=n.length;for(Uh.lastIndex=0;;){let r=Uh.exec(n),o=Uh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){kd(e,c===void 0?new kh(a,i,t):new Bh(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new zh(a),kd(e,u)),e=u}}}var Dr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Zx(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Bd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Jx=37297,$x=0;function Kx(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var zd=new le;function jx(i){Se._getMatrix(zd,Se.workingColorSpace,i);let t=`mat3( ${zd.elements.map(e=>e.toFixed(4))} )`;switch(Se.getTransfer(i)){case ro:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return Kt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Hd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Kx(i.getShaderSource(t),a)}else return r}function Qx(i,t){let e=jx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var ty={[ah]:"Linear",[lh]:"Reinhard",[ch]:"Cineon",[Ro]:"ACESFilmic",[uh]:"AgX",[dh]:"Neutral",[hh]:"Custom"};function ey(i,t){let e=ty[t];return e===void 0?(Kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var ql=new I;function ny(){Se.getLuminanceCoefficients(ql);let i=ql.x.toFixed(4),t=ql.y.toFixed(4),e=ql.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function iy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Bo).join(`
`)}function sy(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ry(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Bo(i){return i!==""}function Gd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Vd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var oy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Hh(i){return i.replace(oy,ay)}function ay(i,t){let e=ye[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Hh(e)}var ly=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wd(i){return i.replace(ly,cy)}function cy(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Xd(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var hy={[zs]:"SHADOWMAP_TYPE_PCF",[Pr]:"SHADOWMAP_TYPE_VSM"};function uy(i){return hy[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var dy={[Ir]:"ENVMAP_MODE_REFRACTION"};function fy(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":dy[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var py={[oh]:"ENVMAP_BLENDING_MULTIPLY",[ld]:"ENVMAP_BLENDING_MIX",[cd]:"ENVMAP_BLENDING_ADD"};function my(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":py[i.combine]||"ENVMAP_BLENDING_NONE"}function gy(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=uy(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=fy(e),u=my(e),d=iy(e),f=sy(r),p=s.createProgram(),x,g,m=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Bo).join(`
`),x.length>0&&(x+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Bo).join(`
`),g.length>0&&(g+=`
`)):(x=[Xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Bo).join(`
`),g=[Xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Di?"#define TONE_MAPPING":"",e.toneMapping!==Di?ye.tonemapping_pars_fragment:"",e.toneMapping!==Di?ey("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ye.colorspace_pars_fragment,Qx("linearToOutputTexel",e.outputColorSpace),ny(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Bo).join(`
`)),o=Hh(o),o=Gd(o,e),o=Vd(o,e),a=Hh(a),a=Gd(a,e),a=Vd(a,e),o=Wd(o),a=Wd(a),e.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,x=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,g=["#define varying in",e.glslVersion===Sh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Sh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let _=m+x+o,v=m+g+a,M=Bd(s,s.VERTEX_SHADER,_),b=Bd(s,s.FRAGMENT_SHADER,v);s.attachShader(p,M),s.attachShader(p,b),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function w(O){if(i.debug.checkShaderErrors){let N=s.getProgramInfoLog(p)||"",B=s.getShaderInfoLog(M)||"",G=s.getShaderInfoLog(b)||"",E=N.trim(),U=B.trim(),C=G.trim(),P=!0,X=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(P=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,M,b);else{let D=Hd(s,M,"vertex"),W=Hd(s,b,"fragment");se("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+E+`
`+D+`
`+W)}else E!==""?Kt("WebGLProgram: Program Info Log:",E):(U===""||C==="")&&(X=!1);X&&(O.diagnostics={runnable:P,programLog:E,vertexShader:{log:U,prefix:x},fragmentShader:{log:C,prefix:g}})}s.deleteShader(M),s.deleteShader(b),y=new Dr(s,p),T=ry(s,p)}let y;this.getUniforms=function(){return y===void 0&&w(this),y};let T;this.getAttributes=function(){return T===void 0&&w(this),T};let F=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return F===!1&&(F=s.getProgramParameter(p,Jx)),F},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=$x++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=M,this.fragmentShader=b,this}var xy=0,Gh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Vh(t),e.set(t,n)),n}},Vh=class{constructor(t){this.id=xy++,this.code=t,this.usedTimes=0}};function yy(i){return i===_s||i===No||i===Fo}function _y(i,t,e,n,s,r){let o=new wr,a=new Gh,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(y){return l.add(y),y===0?"uv":`uv${y}`}function p(y,T,F,O,N,B){let G=O.fog,E=N.geometry,U=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?O.environment:null,C=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,P=t.get(y.envMap||U,C),X=d[y.type],D=n.precision;y.precision!==null&&(D=n.getMaxPrecision(y.precision),D!==y.precision&&Kt("WebGLProgram.getParameters:",y.precision,"not supported, using",D,"instead."));let W=E.morphAttributes.position||E.morphAttributes.normal||E.morphAttributes.color,K=W!==void 0?W.length:0,ut=0;E.morphAttributes.position!==void 0&&(ut=1),E.morphAttributes.normal!==void 0&&(ut=2),E.morphAttributes.color!==void 0&&(ut=3);let Pt,Z,ft,Rt;if(X){let It=Fi[X];Pt=It.vertexShader,Z=It.fragmentShader}else{Pt=y.vertexShader,Z=y.fragmentShader;let It=a.getVertexShaderStage(y),Ee=a.getFragmentShaderStage(y);a.update(y,It,Ee),ft=It.id,Rt=Ee.id}let Gt=i.getRenderTarget(),wt=i.state.buffers.depth.getReversed(),$t=N.isInstancedMesh===!0,Te=N.isBatchedMesh===!0,Mt=!!y.map,be=!!y.matcap,Xt=!!P,qt=Xt&&P.isPMREMTexture===!0,Pe=!!y.aoMap,Ie=!!y.lightMap,Ye=!!y.bumpMap&&y.wireframe===!1,Fe=!!y.normalMap,Bn=!!y.displacementMap,Ae=!!y.emissiveMap,$e=!!y.metalnessMap,Ke=!!y.roughnessMap,Sn=y.anisotropy>0,V=y.clearcoat>0,Wn=y.diffuseRoughness>0,Ve=y.dispersion>0,We=y.retroreflectivity>0,Et=y.iridescence>0,ln=y.sheen>0,Yt=y.transmission>0,ie=Sn&&!!y.anisotropyMap,L=V&&!!y.clearcoatMap,A=V&&!!y.clearcoatNormalMap,J=V&&!!y.clearcoatRoughnessMap,pt=Wn&&!!y.diffuseRoughnessMap,ot=Et&&!!y.iridescenceMap,_t=Et&&!!y.iridescenceThicknessMap,At=ln&&!!y.sheenColorMap,et=ln&&!!y.sheenRoughnessMap,st=!!y.specularMap,vt=!!y.specularColorMap,k=!!y.specularIntensityMap,rt=Yt&&!!y.transmissionMap,Q=Yt&&!!y.thicknessMap,bt=!!y.gradientMap,nt=!!y.alphaMap,mt=y.alphaTest>0,Vt=!!y.alphaHash,Qt=!!y.extensions,ht=Di;y.toneMapped&&(Gt===null||Gt.isXRRenderTarget===!0)&&(ht=i.toneMapping);let Bt=qt?P.isCompressedCubeTexture?P.image[0].mipmaps:P.mipmaps:null,te={shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:Pt,fragmentShader:Z,defines:y.defines,customVertexShaderID:ft,customFragmentShaderID:Rt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:D,batching:Te,batchingColor:Te&&N._colorsTexture!==null,instancing:$t,instancingColor:$t&&N.instanceColor!==null,instancingMorph:$t&&N.morphTexture!==null,outputColorSpace:Gt===null?i.outputColorSpace:Gt.isXRRenderTarget===!0?Gt.texture.colorSpace:Se.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Mt,matcap:be,envMap:Xt,envMapMode:Xt&&P.mapping,envMapPMREM:qt,envMapMaxLod:qt?Bt.length-1:null,envMapSize:qt?Bt[0].width:null,aoMap:Pe,lightMap:Ie,bumpMap:Ye,normalMap:Fe,displacementMap:Bn,emissiveMap:Ae,normalMapObjectSpace:Fe&&y.normalMapType===dd,normalMapTangentSpace:Fe&&y.normalMapType===Wl,packedNormalMap:Fe&&y.normalMapType===Wl&&yy(y.normalMap.format),metalnessMap:$e,roughnessMap:Ke,anisotropy:Sn,anisotropyMap:ie,clearcoat:V,clearcoatMap:L,clearcoatNormalMap:A,clearcoatRoughnessMap:J,diffuseRoughness:Wn,diffuseRoughnessMap:pt,dispersion:Ve,retroreflection:We,iridescence:Et,iridescenceMap:ot,iridescenceThicknessMap:_t,sheen:ln,sheenColorMap:At,sheenRoughnessMap:et,specularMap:st,specularColorMap:vt,specularIntensityMap:k,transmission:Yt,transmissionMap:rt,thicknessMap:Q,gradientMap:bt,opaque:y.transparent===!1&&y.blending===gs&&y.alphaToCoverage===!1,alphaMap:nt,alphaTest:mt,alphaHash:Vt,combine:y.combine,mapUv:Mt&&f(y.map.channel),aoMapUv:Pe&&f(y.aoMap.channel),lightMapUv:Ie&&f(y.lightMap.channel),bumpMapUv:Ye&&f(y.bumpMap.channel),normalMapUv:Fe&&f(y.normalMap.channel),displacementMapUv:Bn&&f(y.displacementMap.channel),emissiveMapUv:Ae&&f(y.emissiveMap.channel),metalnessMapUv:$e&&f(y.metalnessMap.channel),roughnessMapUv:Ke&&f(y.roughnessMap.channel),anisotropyMapUv:ie&&f(y.anisotropyMap.channel),clearcoatMapUv:L&&f(y.clearcoatMap.channel),clearcoatNormalMapUv:A&&f(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&f(y.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:pt&&f(y.diffuseRoughnessMap.channel),iridescenceMapUv:ot&&f(y.iridescenceMap.channel),iridescenceThicknessMapUv:_t&&f(y.iridescenceThicknessMap.channel),sheenColorMapUv:At&&f(y.sheenColorMap.channel),sheenRoughnessMapUv:et&&f(y.sheenRoughnessMap.channel),specularMapUv:st&&f(y.specularMap.channel),specularColorMapUv:vt&&f(y.specularColorMap.channel),specularIntensityMapUv:k&&f(y.specularIntensityMap.channel),transmissionMapUv:rt&&f(y.transmissionMap.channel),thicknessMapUv:Q&&f(y.thicknessMap.channel),alphaMapUv:nt&&f(y.alphaMap.channel),vertexTangents:!!E.attributes.tangent&&(Fe||Sn),vertexNormals:!!E.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!E.attributes.color&&E.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!E.attributes.uv&&(Mt||nt),fog:!!G,useFog:y.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||E.attributes.normal===void 0&&Fe===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:wt,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:E.attributes.position!==void 0,morphTargets:E.morphAttributes.position!==void 0,morphNormals:E.morphAttributes.normal!==void 0,morphColors:E.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:ut,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:B.filter(It=>It.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&F.length>0,shadowMapType:i.shadowMap.type,toneMapping:ht,decodeVideoTexture:Mt&&y.map.isVideoTexture===!0&&Se.getTransfer(y.map.colorSpace)===ke,decodeVideoTextureEmissive:Ae&&y.emissiveMap.isVideoTexture===!0&&Se.getTransfer(y.emissiveMap.colorSpace)===ke,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Ce,flipSided:y.side===Gn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Qt&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qt&&y.extensions.multiDraw===!0||Te)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return te.vertexUv1s=l.has(1),te.vertexUv2s=l.has(2),te.vertexUv3s=l.has(3),l.clear(),te}function x(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let F in y.defines)T.push(F),T.push(y.defines[F]);return y.isRawShaderMaterial===!1&&(g(T,y),m(T,y),T.push(i.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function g(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapPMREM),y.push(T.envMapMaxLod),y.push(T.envMapSize),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.diffuseRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.numSunLights),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numSunLightShadows),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.numLightProbeGrids),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function m(y,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.diffuseRoughness&&o.enable(25),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function _(y){let T=d[y.type],F;if(T){let O=Fi[T];F=Td.clone(O.uniforms)}else F=y.uniforms;return F}function v(y,T){let F=h.get(T);return F!==void 0?++F.usedTimes:(F=new gy(i,T,y,s),c.push(F),h.set(T,F)),F}function M(y){if(--y.usedTimes===0){let T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function b(y){a.remove(y)}function w(){a.dispose()}return{getParameters:p,getProgramCacheKey:x,getUniforms:_,acquireProgram:v,releaseProgram:M,releaseShaderCache:b,programs:c,dispose:w}}function vy(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function My(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function qd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Yd(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,p,x,g,m){let _=i[t];return _===void 0?(_={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:x,renderOrder:d.renderOrder,z:g,group:m},i[t]=_):(_.id=d.id,_.object=d,_.geometry=f,_.material=p,_.materialVariant=o(d),_.groupOrder=x,_.renderOrder=d.renderOrder,_.z=g,_.group=m),t++,_}function l(d,f,p,x,g,m,_){_.reversedDepth===!0&&(g=-g);let v=a(d,f,p,x,g,m);p.transmission>0?n.push(v):p.transparent===!0?s.push(v):e.push(v)}function c(d,f,p,x,g,m){let _=a(d,f,p,x,g,m);p.transmission>0?n.unshift(_):p.transparent===!0?s.unshift(_):e.unshift(_)}function h(d,f){e.length>1&&e.sort(d||My),n.length>1&&n.sort(f||qd),s.length>1&&s.sort(f||qd)}function u(){for(let d=t,f=i.length;d<f;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function by(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Yd,i.set(n,[o])):s>=r.length?(o=new Yd,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Sy(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new I,color:new Ut};break;case"SpotLight":e={position:new I,direction:new I,color:new Ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Ut,groundColor:new Ut};break;case"RectAreaLight":e={color:new Ut,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function wy(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Ey=0;function Ty(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ay(i){let t=new Sy,e=wy(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);let s=new I,r=new Ne,o=new Ne;function a(c){let h=0,u=0,d=0;for(let B=0;B<9;B++)n.probe[B].set(0,0,0);let f=0,p=0,x=0,g=0,m=0,_=0,v=0,M=0,b=0,w=0,y=0,T=0,F=0,O=0;c.sort(Ty);for(let B=0,G=c.length;B<G;B++){let E=c[B],U=E.color,C=E.intensity,P=E.distance,X=null;if(E.shadow&&E.shadow.map&&(E.shadow.map.texture.format===_s?X=E.shadow.map.texture:X=E.shadow.map.depthTexture||E.shadow.map.texture),E.isAmbientLight)h+=U.r*C,u+=U.g*C,d+=U.b*C;else if(E.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(E.sh.coefficients[D],C);O++}else if(E.isSunLight){let D=t.get(E);if(D.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){let W=E.shadow,K=e.get(E);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize.copy(W.mapSize).multiply(W.getFrameExtents()),n.sunShadow[p]=K,n.sunShadowMap[p]=X;let ut=W.getViewportCount();for(let Pt=0;Pt<ut;Pt++)n.sunShadowMatrix[x+Pt]=W.getMatrix(Pt),n.sunShadowCascade[x+Pt]=W._cascadeData[Pt];x+=ut,p++}n.sun[f]=D,f++}else if(E.isDirectionalLight){let D=t.get(E);if(D.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){let W=E.shadow,K=e.get(E);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,n.directionalShadow[g]=K,n.directionalShadowMap[g]=X,n.directionalShadowMatrix[g]=E.shadow.matrix,b++}n.directional[g]=D,g++}else if(E.isSpotLight){let D=t.get(E);D.position.setFromMatrixPosition(E.matrixWorld),D.color.copy(U).multiplyScalar(C),D.distance=P,D.coneCos=Math.cos(E.angle),D.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),D.decay=E.decay,n.spot[_]=D;let W=E.shadow;if(E.map&&(n.spotLightMap[T]=E.map,T++,W.updateMatrices(E),E.castShadow&&F++),n.spotLightMatrix[_]=W.matrix,E.castShadow){let K=e.get(E);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,n.spotShadow[_]=K,n.spotShadowMap[_]=X,y++}_++}else if(E.isRectAreaLight){let D=t.get(E);D.color.copy(U).multiplyScalar(C),D.halfWidth.set(E.width*.5,0,0),D.halfHeight.set(0,E.height*.5,0),n.rectArea[v]=D,v++}else if(E.isPointLight){let D=t.get(E);if(D.color.copy(E.color).multiplyScalar(E.intensity),D.distance=E.distance,D.decay=E.decay,E.castShadow){let W=E.shadow,K=e.get(E);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,K.shadowCameraNear=W.camera.near,K.shadowCameraFar=W.camera.far,n.pointShadow[m]=K,n.pointShadowMap[m]=X,n.pointShadowMatrix[m]=E.shadow.matrix,w++}n.point[m]=D,m++}else if(E.isHemisphereLight){let D=t.get(E);D.skyColor.copy(E.color).multiplyScalar(C),D.groundColor.copy(E.groundColor).multiplyScalar(C),n.hemi[M]=D,M++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Nt.LTC_FLOAT_1,n.rectAreaLTC2=Nt.LTC_FLOAT_2):(n.rectAreaLTC1=Nt.LTC_HALF_1,n.rectAreaLTC2=Nt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let N=n.hash;(N.sunLength!==f||N.directionalLength!==g||N.pointLength!==m||N.spotLength!==_||N.rectAreaLength!==v||N.hemiLength!==M||N.numSunShadows!==p||N.numDirectionalShadows!==b||N.numPointShadows!==w||N.numSpotShadows!==y||N.numSpotMaps!==T||N.numLightProbes!==O)&&(n.sun.length=f,n.directional.length=g,n.spot.length=_,n.rectArea.length=v,n.point.length=m,n.hemi.length=M,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=y,n.spotShadowMap.length=y,n.spotLightMatrix.length=y+T-F,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=F,n.numLightProbes=O,N.sunLength=f,N.directionalLength=g,N.pointLength=m,N.spotLength=_,N.rectAreaLength=v,N.hemiLength=M,N.numSunShadows=p,N.numDirectionalShadows=b,N.numPointShadows=w,N.numSpotShadows=y,N.numSpotMaps=T,N.numLightProbes=O,n.version=Ey++)}function l(c,h){let u=0,d=0,f=0,p=0,x=0,g=0,m=h.matrixWorldInverse;for(let _=0,v=c.length;_<v;_++){let M=c[_];if(M.isSunLight){let b=n.sun[u];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),u++}else if(M.isDirectionalLight){let b=n.directional[d];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),d++}else if(M.isSpotLight){let b=n.spot[p];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),p++}else if(M.isRectAreaLight){let b=n.rectArea[x];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),x++}else if(M.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function Zd(i){let t=new Ay(i),e=[],n=[],s=[];function r(u){h.camera=u,e.length=0,n.length=0,s.length=0}function o(u){u.isLightProbeGrid?s.push(u):e.push(u)}function a(u){n.push(u)}function l(){t.setup(e),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){t.setupView(e,u)}let h={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Ry(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Zd(i),t.set(s,[a])):r>=o.length?(a=new Zd(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Cy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Py=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Iy=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],Ly=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Jd=new Ne,ko=new I,Oh=new I;function Dy(i,t,e){let n=new us,s=new xt,r=new xt,o=new tn,a=new Wa,l=new Xa,c={},h=e.maxTextureSize,u={[ms]:Gn,[Gn]:ms,[Ce]:Ce},d=new Yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:Cy,fragmentShader:Py}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new un;p.setAttribute("position",new In(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new tt(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zs;let m=this.type;this.render=function(w,y,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;this.type===Xu&&(Kt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=zs);let F=i.getRenderTarget(),O=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Hs),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let G=m!==this.type;G&&y.traverse(function(E){E.material&&(Array.isArray(E.material)?E.material.forEach(U=>U.needsUpdate=!0):E.material.needsUpdate=!0)});for(let E=0,U=w.length;E<U;E++){let C=w[E],P=C.shadow;if(P===void 0){Kt("WebGLShadowMap:",C,"has no shadow.");continue}if(P.autoUpdate===!1&&P.needsUpdate===!1)continue;s.copy(P.mapSize);let X=P.getFrameExtents();s.multiply(X),r.copy(P.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/X.x),s.x=r.x*X.x,P.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/X.y),s.y=r.y*X.y,P.mapSize.y=r.y));let D=i.state.buffers.depth.getReversed();if(P.camera._reversedDepth=D,P.map===null||G===!0){if(P.map!==null&&(P.map.depthTexture!==null&&(P.map.depthTexture.dispose(),P.map.depthTexture=null),P.map.dispose()),this.type===Pr){if(C.isPointLight){Kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}P.map=new Qn(s.x,s.y,{format:_s,type:ei,minFilter:xn,magFilter:xn,generateMipmaps:!1}),P.map.texture.name=C.name+".shadowMap",P.map.depthTexture=new Zi(s.x,s.y,ui),P.map.depthTexture.name=C.name+".shadowMapDepth",P.map.depthTexture.format=qi,P.map.depthTexture.compareFunction=null,P.map.depthTexture.minFilter=An,P.map.depthTexture.magFilter=An}else C.isPointLight?(P.map=new zo(s.x),P.map.depthTexture=new mo(s.x,_i)):(P.map=new Qn(s.x,s.y),P.map.depthTexture=new Zi(s.x,s.y,_i)),P.map.depthTexture.name=C.name+".shadowMap",P.map.depthTexture.format=qi,this.type===zs?(P.map.depthTexture.compareFunction=D?Mh:vh,P.map.depthTexture.minFilter=xn,P.map.depthTexture.magFilter=xn):(P.map.depthTexture.compareFunction=null,P.map.depthTexture.minFilter=An,P.map.depthTexture.magFilter=An);P.camera.updateProjectionMatrix()}P.map.isWebGLCubeRenderTarget!==!0&&(P.map.width!==s.x||P.map.height!==s.y)&&P.map.setSize(s.x,s.y);let W=P.map.isWebGLCubeRenderTarget?6:P.getViewportCount();C.isPointLight!==!0&&P.updateMatrices(C,T);let K=(P.camera.layers.mask&4294967294)!==0?P.camera.layers:T.layers;for(let ut=0;ut<W;ut++){let Pt=P.getCamera(ut);if(C.isPointLight){let Z=P.camera,ft=P.matrix,Rt=C.distance||Z.far;Rt!==Z.far&&(Z.far=Rt,Z.updateProjectionMatrix()),ko.setFromMatrixPosition(C.matrixWorld),Z.position.copy(ko),Oh.copy(Z.position),Oh.add(Iy[ut]),Z.up.copy(Ly[ut]),Z.lookAt(Oh),Z.updateMatrixWorld(),ft.makeTranslation(-ko.x,-ko.y,-ko.z),Jd.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),P._frustum.setFromProjectionMatrix(Jd,Z.coordinateSystem,Z.reversedDepth)}if(P.map.isWebGLCubeRenderTarget)i.setRenderTarget(P.map,ut),i.clear();else{ut===0&&(i.setRenderTarget(P.map),i.clear());let Z=P.getViewport(ut);o.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),B.viewport(o)}n=P.getFrustum(ut),M(y,T,Pt,C,K,this.type)}P.isPointLightShadow!==!0&&this.type===Pr&&_(P,T),P.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(F,O,N)};function _(w,y){let T=t.update(x);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null?w.mapPass=new Qn(s.x,s.y,{format:_s,type:ei}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(y,null,T,d,x,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(y,null,T,f,x,null)}function v(w,y,T,F){let O=null,N=T.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(N!==void 0)O=N;else if(O=T.isPointLight===!0?l:a,i.localClippingEnabled&&y.clipShadows===!0&&Array.isArray(y.clippingPlanes)&&y.clippingPlanes.length!==0||y.displacementMap&&y.displacementScale!==0||y.alphaMap&&y.alphaTest>0||y.map&&y.alphaTest>0||y.alphaToCoverage===!0){let B=O.uuid,G=y.uuid,E=c[B];E===void 0&&(E={},c[B]=E);let U=E[G];U===void 0&&(U=O.clone(),E[G]=U,y.addEventListener("dispose",b)),O=U}if(O.visible=y.visible,O.wireframe=y.wireframe,F===Pr?O.side=y.shadowSide!==null?y.shadowSide:y.side:O.side=y.shadowSide!==null?y.shadowSide:u[y.side],O.alphaMap=y.alphaMap,O.alphaTest=y.alphaToCoverage===!0?.5:y.alphaTest,O.map=y.map,O.clipShadows=y.clipShadows,O.clippingPlanes=y.clippingPlanes,O.clipIntersection=y.clipIntersection,O.displacementMap=y.displacementMap,O.displacementScale=y.displacementScale,O.displacementBias=y.displacementBias,O.wireframeLinewidth=y.wireframeLinewidth,O.linewidth=y.linewidth,T.isPointLight===!0&&O.isMeshDistanceMaterial===!0){let B=i.properties.get(O);B.light=T}return O}function M(w,y,T,F,O,N){if(w.visible===!1)return;if(w.layers.test(O)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&N===Pr)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,w.matrixWorld);let E=t.update(w),U=w.material;if(Array.isArray(U)){let C=E.groups;for(let P=0,X=C.length;P<X;P++){let D=C[P],W=U[D.materialIndex];if(W&&W.visible){let K=v(w,W,F,N);w.onBeforeShadow(i,w,y,T,E,K,D),i.renderBufferDirect(T,null,E,K,w,D),w.onAfterShadow(i,w,y,T,E,K,D)}}}else if(U.visible){let C=v(w,U,F,N);w.onBeforeShadow(i,w,y,T,E,C,null),i.renderBufferDirect(T,null,E,C,w,null),w.onAfterShadow(i,w,y,T,E,C,null)}}let G=w.children;for(let E=0,U=G.length;E<U;E++)M(G[E],y,T,F,O,N)}function b(w){w.target.removeEventListener("dispose",b);for(let T in c){let F=c[T],O=w.target.uuid;O in F&&(F[O].dispose(),delete F[O])}}}function Ny(i,t){function e(){let k=!1,rt=new tn,Q=null,bt=new tn(0,0,0,0);return{setMask:function(nt){Q!==nt&&!k&&(i.colorMask(nt,nt,nt,nt),Q=nt)},setLocked:function(nt){k=nt},setClear:function(nt,mt,Vt,Qt,ht){ht===!0&&(nt*=Qt,mt*=Qt,Vt*=Qt),rt.set(nt,mt,Vt,Qt),bt.equals(rt)===!1&&(i.clearColor(nt,mt,Vt,Qt),bt.copy(rt))},reset:function(){k=!1,Q=null,bt.set(-1,0,0,0)}}}function n(){let k=!1,rt=!1,Q=null,bt=null,nt=null;return{setReversed:function(mt){if(rt!==mt){let Vt=t.get("EXT_clip_control");mt?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT),rt=mt;let Qt=nt;nt=null,this.setClear(Qt)}},getReversed:function(){return rt},setTest:function(mt){mt?wt(i.DEPTH_TEST):$t(i.DEPTH_TEST)},setMask:function(mt){Q!==mt&&!k&&(i.depthMask(mt),Q=mt)},setFunc:function(mt){if(rt&&(mt=Sd[mt]),bt!==mt){switch(mt){case Sa:i.depthFunc(i.NEVER);break;case wa:i.depthFunc(i.ALWAYS);break;case Ea:i.depthFunc(i.LESS);break;case vr:i.depthFunc(i.LEQUAL);break;case Ta:i.depthFunc(i.EQUAL);break;case Aa:i.depthFunc(i.GEQUAL);break;case Ra:i.depthFunc(i.GREATER);break;case Ca:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}bt=mt}},setLocked:function(mt){k=mt},setClear:function(mt){nt!==mt&&(nt=mt,rt&&(mt=1-mt),i.clearDepth(mt))},reset:function(){k=!1,Q=null,bt=null,nt=null,rt=!1}}}function s(){let k=!1,rt=null,Q=null,bt=null,nt=null,mt=null,Vt=null,Qt=null,ht=null;return{setTest:function(Bt){k||(Bt?wt(i.STENCIL_TEST):$t(i.STENCIL_TEST))},setMask:function(Bt){rt!==Bt&&!k&&(i.stencilMask(Bt),rt=Bt)},setFunc:function(Bt,te,It){(Q!==Bt||bt!==te||nt!==It)&&(i.stencilFunc(Bt,te,It),Q=Bt,bt=te,nt=It)},setOp:function(Bt,te,It){(mt!==Bt||Vt!==te||Qt!==It)&&(i.stencilOp(Bt,te,It),mt=Bt,Vt=te,Qt=It)},setLocked:function(Bt){k=Bt},setClear:function(Bt){ht!==Bt&&(i.clearStencil(Bt),ht=Bt)},reset:function(){k=!1,rt=null,Q=null,bt=null,nt=null,mt=null,Vt=null,Qt=null,ht=null}}}let r=new e,o=new n,a=new s,l={},c=new WeakMap,h={},u={},d={},f=new WeakMap,p=[],x=null,g=!1,m=null,_=null,v=null,M=null,b=null,w=null,y=null,T=new Ut(0,0,0),F=0,O=!1,N=null,B=null,G=null,E=null,U=null,C=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),P=!1,X=0,D=i.getParameter(i.VERSION);D.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(D)[1]),P=X>=1):D.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(D)[1]),P=X>=2);let W=null,K={},ut=i.getParameter(i.SCISSOR_BOX),Pt=i.getParameter(i.VIEWPORT),Z=new tn().fromArray(ut),ft=new tn().fromArray(Pt);function Rt(k,rt,Q,bt){let nt=new Uint8Array(4),mt=i.createTexture();i.bindTexture(k,mt),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Vt=0;Vt<Q;Vt++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(rt,0,i.RGBA,1,1,bt,0,i.RGBA,i.UNSIGNED_BYTE,nt):i.texImage2D(rt+Vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,nt);return mt}let Gt={};Gt[i.TEXTURE_2D]=Rt(i.TEXTURE_2D,i.TEXTURE_2D,1),Gt[i.TEXTURE_CUBE_MAP]=Rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Gt[i.TEXTURE_2D_ARRAY]=Rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Gt[i.TEXTURE_3D]=Rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),wt(i.DEPTH_TEST),o.setFunc(vr),Ye(!1),Fe(nh),wt(i.CULL_FACE),Pe(Hs);function wt(k){h[k]!==!0&&(i.enable(k),h[k]=!0)}function $t(k){h[k]!==!1&&(i.disable(k),h[k]=!1)}function Te(k,rt){return d[k]!==rt?(i.bindFramebuffer(k,rt),d[k]=rt,k===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=rt),k===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=rt),!0):!1}function Mt(k,rt){let Q=p,bt=!1;if(k){Q=f.get(rt),Q===void 0&&(Q=[],f.set(rt,Q));let nt=k.textures;if(Q.length!==nt.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let mt=0,Vt=nt.length;mt<Vt;mt++)Q[mt]=i.COLOR_ATTACHMENT0+mt;Q.length=nt.length,bt=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,bt=!0);bt&&i.drawBuffers(Q)}function be(k){return x!==k?(i.useProgram(k),x=k,!0):!1}let Xt={[Gs]:i.FUNC_ADD,[qu]:i.FUNC_SUBTRACT,[Yu]:i.FUNC_REVERSE_SUBTRACT};Xt[Zu]=i.MIN,Xt[Ju]=i.MAX;let qt={[$u]:i.ZERO,[Vs]:i.ONE,[Ku]:i.SRC_COLOR,[rh]:i.SRC_ALPHA,[id]:i.SRC_ALPHA_SATURATE,[ed]:i.DST_COLOR,[Qu]:i.DST_ALPHA,[ju]:i.ONE_MINUS_SRC_COLOR,[ys]:i.ONE_MINUS_SRC_ALPHA,[nd]:i.ONE_MINUS_DST_COLOR,[td]:i.ONE_MINUS_DST_ALPHA,[sd]:i.CONSTANT_COLOR,[rd]:i.ONE_MINUS_CONSTANT_COLOR,[od]:i.CONSTANT_ALPHA,[ad]:i.ONE_MINUS_CONSTANT_ALPHA};function Pe(k,rt,Q,bt,nt,mt,Vt,Qt,ht,Bt){if(k===Hs){g===!0&&($t(i.BLEND),g=!1);return}if(g===!1&&(wt(i.BLEND),g=!0),k!==Ao){if(k!==m||Bt!==O){if((_!==Gs||b!==Gs)&&(i.blendEquation(i.FUNC_ADD),_=Gs,b=Gs),Bt)switch(k){case gs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xs:i.blendFunc(i.ONE,i.ONE);break;case ih:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case sh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:se("WebGLState: Invalid blending: ",k);break}else switch(k){case gs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ih:se("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sh:se("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:se("WebGLState: Invalid blending: ",k);break}v=null,M=null,w=null,y=null,T.set(0,0,0),F=0,m=k,O=Bt}return}nt=nt||rt,mt=mt||Q,Vt=Vt||bt,(rt!==_||nt!==b)&&(i.blendEquationSeparate(Xt[rt],Xt[nt]),_=rt,b=nt),(Q!==v||bt!==M||mt!==w||Vt!==y)&&(i.blendFuncSeparate(qt[Q],qt[bt],qt[mt],qt[Vt]),v=Q,M=bt,w=mt,y=Vt),(Qt.equals(T)===!1||ht!==F)&&(i.blendColor(Qt.r,Qt.g,Qt.b,ht),T.copy(Qt),F=ht),m=k,O=!1}function Ie(k,rt){k.side===Ce?$t(i.CULL_FACE):wt(i.CULL_FACE);let Q=k.side===Gn;rt&&(Q=!Q),Ye(Q),k.blending===gs&&k.transparent===!1?Pe(Hs):Pe(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),r.setMask(k.colorWrite);let bt=k.stencilWrite;a.setTest(bt),bt&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Ae(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?wt(i.SAMPLE_ALPHA_TO_COVERAGE):$t(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(k){N!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),N=k)}function Fe(k){k!==Vu?(wt(i.CULL_FACE),k!==B&&(k===nh?i.cullFace(i.BACK):k===Wu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):$t(i.CULL_FACE),B=k}function Bn(k){k!==G&&(P&&i.lineWidth(k),G=k)}function Ae(k,rt,Q){k?(wt(i.POLYGON_OFFSET_FILL),(E!==rt||U!==Q)&&(E=rt,U=Q,o.getReversed()&&(rt=-rt,Q=-Q),i.polygonOffset(rt,Q))):$t(i.POLYGON_OFFSET_FILL)}function $e(k){k?wt(i.SCISSOR_TEST):$t(i.SCISSOR_TEST)}function Ke(k){k===void 0&&(k=i.TEXTURE0+C-1),W!==k&&(i.activeTexture(k),W=k)}function Sn(k,rt,Q){Q===void 0&&(W===null?Q=i.TEXTURE0+C-1:Q=W);let bt=K[Q];bt===void 0&&(bt={type:void 0,texture:void 0},K[Q]=bt),(bt.type!==k||bt.texture!==rt)&&(W!==Q&&(i.activeTexture(Q),W=Q),i.bindTexture(k,rt||Gt[k]),bt.type=k,bt.texture=rt)}function V(){let k=K[W];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function Wn(){try{i.compressedTexImage2D(...arguments)}catch(k){se("WebGLState:",k)}}function Ve(){try{i.compressedTexImage3D(...arguments)}catch(k){se("WebGLState:",k)}}function We(){try{i.texSubImage2D(...arguments)}catch(k){se("WebGLState:",k)}}function Et(){try{i.texSubImage3D(...arguments)}catch(k){se("WebGLState:",k)}}function ln(){try{i.compressedTexSubImage2D(...arguments)}catch(k){se("WebGLState:",k)}}function Yt(){try{i.compressedTexSubImage3D(...arguments)}catch(k){se("WebGLState:",k)}}function ie(){try{i.texStorage2D(...arguments)}catch(k){se("WebGLState:",k)}}function L(){try{i.texStorage3D(...arguments)}catch(k){se("WebGLState:",k)}}function A(){try{i.texImage2D(...arguments)}catch(k){se("WebGLState:",k)}}function J(){try{i.texImage3D(...arguments)}catch(k){se("WebGLState:",k)}}function pt(k){return u[k]!==void 0?u[k]:i.getParameter(k)}function ot(k,rt){u[k]!==rt&&(i.pixelStorei(k,rt),u[k]=rt)}function _t(k){Z.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),Z.copy(k))}function At(k){ft.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),ft.copy(k))}function et(k,rt){let Q=c.get(rt);Q===void 0&&(Q=new WeakMap,c.set(rt,Q));let bt=Q.get(k);bt===void 0&&(bt=i.getUniformBlockIndex(rt,k.name),i.uniformBlockBinding(rt,bt,bt),Q.set(k,bt))}function st(k,rt,Q){let nt=c.get(rt).get(k);l[nt]!==Q&&(i.bindBufferBase(i.UNIFORM_BUFFER,nt,Q),l[nt]=Q)}function vt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},W=null,K={},d={},l={},f=new WeakMap,p=[],x=null,g=!1,m=null,_=null,v=null,M=null,b=null,w=null,y=null,T=new Ut(0,0,0),F=0,O=!1,N=null,B=null,G=null,E=null,U=null,Z.set(0,0,i.canvas.width,i.canvas.height),ft.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:wt,disable:$t,bindFramebuffer:Te,drawBuffers:Mt,useProgram:be,setBlending:Pe,setMaterial:Ie,setFlipSided:Ye,setCullFace:Fe,setLineWidth:Bn,setPolygonOffset:Ae,setScissorTest:$e,activeTexture:Ke,bindTexture:Sn,unbindTexture:V,compressedTexImage2D:Wn,compressedTexImage3D:Ve,texImage2D:A,texImage3D:J,pixelStorei:ot,getParameter:pt,updateUBOMapping:et,uniformBlockBinding:st,texStorage2D:ie,texStorage3D:L,texSubImage2D:We,texSubImage3D:Et,compressedTexSubImage2D:ln,compressedTexSubImage3D:Yt,scissor:_t,viewport:At,reset:vt}}function Fy(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xt,h=new WeakMap,u=new Set,d,f=new WeakMap,p=new Set,x=new FinalizationRegistry(L=>p.delete(L)),g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,A){return g?new OffscreenCanvas(L,A):oo("canvas")}function _(L,A,J){let pt=1,ot=ie(L);if((ot.width>J||ot.height>J)&&(pt=J/Math.max(ot.width,ot.height)),pt<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let _t=Math.floor(pt*ot.width),At=Math.floor(pt*ot.height);d===void 0&&(d=m(_t,At));let et=A?m(_t,At):d;return et.width=_t,et.height=At,et.getContext("2d").drawImage(L,0,0,_t,At),Kt("WebGLRenderer: Texture has been resized from ("+ot.width+"x"+ot.height+") to ("+_t+"x"+At+")."),et}else return"data"in L&&Kt("WebGLRenderer: Image in DataTexture is too big ("+ot.width+"x"+ot.height+")."),L;return L}function v(L){return L.generateMipmaps}function M(L){i.generateMipmap(L)}function b(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(L,A,J,pt,ot,_t=!1){if(L!==null){if(i[L]!==void 0)return i[L];Kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let At;pt&&(At=t.get("EXT_texture_norm16"),At||Kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let et=A;if(A===i.RED&&(J===i.FLOAT&&(et=i.R32F),J===i.HALF_FLOAT&&(et=i.R16F),J===i.UNSIGNED_BYTE&&(et=i.R8),J===i.UNSIGNED_SHORT&&At&&(et=At.R16_EXT),J===i.SHORT&&At&&(et=At.R16_SNORM_EXT)),A===i.RED_INTEGER&&(J===i.UNSIGNED_BYTE&&(et=i.R8UI),J===i.UNSIGNED_SHORT&&(et=i.R16UI),J===i.UNSIGNED_INT&&(et=i.R32UI),J===i.BYTE&&(et=i.R8I),J===i.SHORT&&(et=i.R16I),J===i.INT&&(et=i.R32I)),A===i.RG&&(J===i.FLOAT&&(et=i.RG32F),J===i.HALF_FLOAT&&(et=i.RG16F),J===i.UNSIGNED_BYTE&&(et=i.RG8),J===i.UNSIGNED_SHORT&&At&&(et=At.RG16_EXT),J===i.SHORT&&At&&(et=At.RG16_SNORM_EXT)),A===i.RG_INTEGER&&(J===i.UNSIGNED_BYTE&&(et=i.RG8UI),J===i.UNSIGNED_SHORT&&(et=i.RG16UI),J===i.UNSIGNED_INT&&(et=i.RG32UI),J===i.BYTE&&(et=i.RG8I),J===i.SHORT&&(et=i.RG16I),J===i.INT&&(et=i.RG32I)),A===i.RGB_INTEGER&&(J===i.UNSIGNED_BYTE&&(et=i.RGB8UI),J===i.UNSIGNED_SHORT&&(et=i.RGB16UI),J===i.UNSIGNED_INT&&(et=i.RGB32UI),J===i.BYTE&&(et=i.RGB8I),J===i.SHORT&&(et=i.RGB16I),J===i.INT&&(et=i.RGB32I)),A===i.RGBA_INTEGER&&(J===i.UNSIGNED_BYTE&&(et=i.RGBA8UI),J===i.UNSIGNED_SHORT&&(et=i.RGBA16UI),J===i.UNSIGNED_INT&&(et=i.RGBA32UI),J===i.BYTE&&(et=i.RGBA8I),J===i.SHORT&&(et=i.RGBA16I),J===i.INT&&(et=i.RGBA32I)),A===i.RGB&&(J===i.UNSIGNED_SHORT&&At&&(et=At.RGB16_EXT),J===i.SHORT&&At&&(et=At.RGB16_SNORM_EXT),J===i.UNSIGNED_INT_5_9_9_9_REV&&(et=i.RGB9_E5),J===i.UNSIGNED_INT_10F_11F_11F_REV&&(et=i.R11F_G11F_B10F)),A===i.RGBA){let st=_t?ro:Se.getTransfer(ot);J===i.FLOAT&&(et=i.RGBA32F),J===i.HALF_FLOAT&&(et=i.RGBA16F),J===i.UNSIGNED_BYTE&&(et=st===ke?i.SRGB8_ALPHA8:i.RGBA8),J===i.UNSIGNED_SHORT&&At&&(et=At.RGBA16_EXT),J===i.SHORT&&At&&(et=At.RGBA16_SNORM_EXT),J===i.UNSIGNED_SHORT_4_4_4_4&&(et=i.RGBA4),J===i.UNSIGNED_SHORT_5_5_5_1&&(et=i.RGB5_A1)}return(et===i.R16F||et===i.R32F||et===i.RG16F||et===i.RG32F||et===i.RGBA16F||et===i.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function y(L,A){let J;return L?A===null||A===_i||A===Xs?J=i.DEPTH24_STENCIL8:A===ui?J=i.DEPTH32F_STENCIL8:A===Lr&&(J=i.DEPTH24_STENCIL8,Kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===_i||A===Xs?J=i.DEPTH_COMPONENT24:A===ui?J=i.DEPTH_COMPONENT32F:A===Lr&&(J=i.DEPTH_COMPONENT16),J}function T(L,A){return v(L)===!0||L.isFramebufferTexture&&L.minFilter!==An&&L.minFilter!==xn?Math.log2(Math.max(A.width,A.height))+1:L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?A.mipmaps.length:1}function F(L){let A=new WeakRef(L);n.get(L).__ref=A,p.add(A),x.register(L,A,A)}function O(L){let A=n.get(L).__ref;A!==void 0&&(p.delete(A),x.unregister(A))}function N(L){G(L.target)}function B(L){E(L.target)}function G(L){L.removeEventListener("dispose",N),O(L),C(L),L.isVideoTexture&&h.delete(L),L.isHTMLTexture&&u.delete(L)}function E(L){L.removeEventListener("dispose",B),O(L),X(L)}function U(){for(let L of p){let A=L.deref();A!==void 0&&(A.isRenderTarget===!0?E(A):G(A))}p.clear(),u.clear()}function C(L){let A=n.get(L);if(A.__webglInit===void 0)return;let J=L.source,pt=f.get(J);if(pt){let ot=pt[A.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&P(L),Object.keys(pt).length===0&&f.delete(J)}n.remove(L)}function P(L){let A=n.get(L);i.deleteTexture(A.__webglTexture);let J=L.source,pt=f.get(J);delete pt[A.__cacheKey],o.memory.textures--}function X(L){let A=n.get(L);A.__depthDisposeCallback&&A.__depthDisposeCallback();let J=L.depthTexture;if(J&&J.renderTarget===L&&G(J),L.isWebGLCubeRenderTarget)for(let ot=0;ot<6;ot++){if(Array.isArray(A.__webglFramebuffer[ot]))for(let _t=0;_t<A.__webglFramebuffer[ot].length;_t++)i.deleteFramebuffer(A.__webglFramebuffer[ot][_t]);else i.deleteFramebuffer(A.__webglFramebuffer[ot]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[ot])}else{if(Array.isArray(A.__webglFramebuffer))for(let ot=0;ot<A.__webglFramebuffer.length;ot++)i.deleteFramebuffer(A.__webglFramebuffer[ot]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ot=0;ot<A.__webglColorRenderbuffer.length;ot++)A.__webglColorRenderbuffer[ot]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[ot]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}let pt=L.textures;for(let ot=0,_t=pt.length;ot<_t;ot++){let At=n.get(pt[ot]);At.__webglTexture&&(i.deleteTexture(At.__webglTexture),o.memory.textures--),n.remove(pt[ot])}n.remove(L)}let D=0;function W(){D=0}function K(){return D}function ut(L){D=L}function Pt(){let L=D;return L>=s.maxTextures&&Kt("WebGLTextures: Trying to use "+(L+1)+" texture units while this GPU supports only "+s.maxTextures),D+=1,L}function Z(L){let A=[];return A.push(L.wrapS),A.push(L.wrapT),A.push(L.wrapR||0),A.push(L.magFilter),A.push(L.minFilter),A.push(L.anisotropy),A.push(L.internalFormat),A.push(L.format),A.push(L.type),A.push(L.generateMipmaps),A.push(L.mipmapsAutoUpdate),A.push(L.premultiplyAlpha),A.push(L.flipY),A.push(L.unpackAlignment),A.push(L.colorSpace),A.join()}function ft(L,A){let J=n.get(L);if(L.isVideoTexture&&ln(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&J.__version!==L.version){let pt=L.image;if(pt===null)Kt("WebGLRenderer: Texture marked for update but no image data found.");else if(pt.complete===!1)Kt("WebGLRenderer: Texture marked for update but image is incomplete");else{Ie(J,L,A);return}}else L.isExternalTexture&&(J.__webglTexture=L.sourceTexture?L.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,J.__webglTexture,i.TEXTURE0+A)}function Rt(L,A){let J=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&J.__version!==L.version){Ie(J,L,A);return}else L.isExternalTexture&&(J.__webglTexture=L.sourceTexture?L.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,J.__webglTexture,i.TEXTURE0+A)}function Gt(L,A){let J=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&J.__version!==L.version){Ie(J,L,A);return}e.bindTexture(i.TEXTURE_3D,J.__webglTexture,i.TEXTURE0+A)}function wt(L,A){let J=n.get(L);if(L.version>0&&J.__version!==L.version){Ye(J,L,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture,i.TEXTURE0+A)}let $t={[Ri]:i.REPEAT,[oi]:i.CLAMP_TO_EDGE,[Pa]:i.MIRRORED_REPEAT},Te={[An]:i.NEAREST,[hd]:i.NEAREST_MIPMAP_NEAREST,[Co]:i.NEAREST_MIPMAP_LINEAR,[xn]:i.LINEAR,[ol]:i.LINEAR_MIPMAP_NEAREST,[$i]:i.LINEAR_MIPMAP_LINEAR},Mt={[pd]:i.NEVER,[bh]:i.ALWAYS,[md]:i.LESS,[vh]:i.LEQUAL,[gd]:i.EQUAL,[Mh]:i.GEQUAL,[xd]:i.GREATER,[yd]:i.NOTEQUAL};function be(L,A){if(A.type===ui&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===xn||A.magFilter===ol||A.magFilter===Co||A.magFilter===$i||A.minFilter===xn||A.minFilter===ol||A.minFilter===Co||A.minFilter===$i)&&Kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,$t[A.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,$t[A.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,$t[A.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,Te[A.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,Te[A.minFilter]),A.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Mt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===An||A.minFilter!==Co&&A.minFilter!==$i||A.type===ui&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){let J=t.get("EXT_texture_filter_anisotropic");i.texParameterf(L,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function Xt(L,A){let J=!1;L.__webglInit===void 0&&(L.__webglInit=!0,A.addEventListener("dispose",N),F(A));let pt=A.source,ot=f.get(pt);ot===void 0&&(ot={},f.set(pt,ot));let _t=Z(A);if(_t!==L.__cacheKey){ot[_t]===void 0&&(ot[_t]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,J=!0),ot[_t].usedTimes++;let At=ot[L.__cacheKey];At!==void 0&&(ot[L.__cacheKey].usedTimes--,At.usedTimes===0&&P(A)),L.__cacheKey=_t,L.__webglTexture=ot[_t].texture}return J}function qt(L,A,J){return Math.floor(Math.floor(L/J)/A)}function Pe(L,A,J,pt){let _t=L.updateRanges;if(_t.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,J,pt,A.data);else{_t.sort((k,rt)=>k.start-rt.start);let At=0;for(let k=1;k<_t.length;k++){let rt=_t[At],Q=_t[k],bt=rt.start+rt.count,nt=qt(Q.start,A.width,4),mt=qt(rt.start,A.width,4);Q.start<=bt+1&&nt===mt&&qt(Q.start+Q.count-1,A.width,4)===nt?rt.count=Math.max(rt.count,Q.start+Q.count-rt.start):(++At,_t[At]=Q)}_t.length=At+1;let et=e.getParameter(i.UNPACK_ROW_LENGTH),st=e.getParameter(i.UNPACK_SKIP_PIXELS),vt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let k=0,rt=_t.length;k<rt;k++){let Q=_t[k],bt=Math.floor(Q.start/4),nt=Math.ceil(Q.count/4),mt=bt%A.width,Vt=Math.floor(bt/A.width),Qt=nt,ht=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,mt),e.pixelStorei(i.UNPACK_SKIP_ROWS,Vt),e.texSubImage2D(i.TEXTURE_2D,0,mt,Vt,Qt,ht,J,pt,A.data)}L.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,et),e.pixelStorei(i.UNPACK_SKIP_PIXELS,st),e.pixelStorei(i.UNPACK_SKIP_ROWS,vt)}}function Ie(L,A,J){let pt=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(pt=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(pt=i.TEXTURE_3D);let ot=Xt(L,A),_t=A.source;e.bindTexture(pt,L.__webglTexture,i.TEXTURE0+J);let At=n.get(_t);if(_t.version!==At.__version||ot===!0){if(e.activeTexture(i.TEXTURE0+J),(typeof ImageBitmap<"u"&&A.image instanceof ImageBitmap)===!1){let ht=Se.getPrimaries(Se.workingColorSpace),Bt=A.colorSpace===vi?null:Se.getPrimaries(A.colorSpace),te=A.colorSpace===vi||ht===Bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te)}e.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment);let st=_(A.image,!1,s.maxTextureSize);st=Yt(A,st);let vt=r.convert(A.format,A.colorSpace),k=r.convert(A.type),rt=w(A.internalFormat,vt,k,A.normalized,A.colorSpace,A.isVideoTexture);be(pt,A);let Q,bt=A.mipmaps,nt=A.isVideoTexture!==!0,mt=At.__version===void 0||ot===!0,Vt=_t.dataReady,Qt=T(A,st);if(A.isDepthTexture)rt=y(A.format===Ki,A.type),mt&&(nt?e.texStorage2D(i.TEXTURE_2D,1,rt,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,rt,st.width,st.height,0,vt,k,null));else if(A.isDataTexture)if(bt.length>0){nt&&mt&&e.texStorage2D(i.TEXTURE_2D,Qt,rt,bt[0].width,bt[0].height);for(let ht=0,Bt=bt.length;ht<Bt;ht++)Q=bt[ht],nt?Vt&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,Q.width,Q.height,vt,k,Q.data):e.texImage2D(i.TEXTURE_2D,ht,rt,Q.width,Q.height,0,vt,k,Q.data);A.generateMipmaps=!1}else nt?(mt&&e.texStorage2D(i.TEXTURE_2D,Qt,rt,st.width,st.height),Vt&&Pe(A,st,vt,k)):e.texImage2D(i.TEXTURE_2D,0,rt,st.width,st.height,0,vt,k,st.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){nt&&mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Qt,rt,bt[0].width,bt[0].height,st.depth);for(let ht=0,Bt=bt.length;ht<Bt;ht++)if(Q=bt[ht],A.format!==ni)if(vt!==null)if(nt){if(Vt)if(A.layerUpdates.size>0){let te=Ph(Q.width,Q.height,A.format,A.type);for(let It of A.layerUpdates){let Ee=Q.data.subarray(It*te/Q.data.BYTES_PER_ELEMENT,(It+1)*te/Q.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,It,Q.width,Q.height,1,vt,Ee)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,Q.width,Q.height,st.depth,vt,Q.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ht,rt,Q.width,Q.height,st.depth,0,Q.data,0,0);else Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else nt?Vt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,Q.width,Q.height,st.depth,vt,k,Q.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ht,rt,Q.width,Q.height,st.depth,0,vt,k,Q.data);A.layerUpdates.size>0&&A.clearLayerUpdates()}else{nt&&mt&&e.texStorage2D(i.TEXTURE_2D,Qt,rt,bt[0].width,bt[0].height);for(let ht=0,Bt=bt.length;ht<Bt;ht++)Q=bt[ht],A.format!==ni?vt!==null?nt?Vt&&e.compressedTexSubImage2D(i.TEXTURE_2D,ht,0,0,Q.width,Q.height,vt,Q.data):e.compressedTexImage2D(i.TEXTURE_2D,ht,rt,Q.width,Q.height,0,Q.data):Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):nt?Vt&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,Q.width,Q.height,vt,k,Q.data):e.texImage2D(i.TEXTURE_2D,ht,rt,Q.width,Q.height,0,vt,k,Q.data)}else if(A.isDataArrayTexture)if(nt){if(mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Qt,rt,st.width,st.height,st.depth),Vt)if(A.layerUpdates.size>0){let ht=Ph(st.width,st.height,A.format,A.type);for(let Bt of A.layerUpdates){let te=st.data.subarray(Bt*ht/st.data.BYTES_PER_ELEMENT,(Bt+1)*ht/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Bt,st.width,st.height,1,vt,k,te)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,vt,k,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,rt,st.width,st.height,st.depth,0,vt,k,st.data);else if(A.isData3DTexture)nt?(mt&&e.texStorage3D(i.TEXTURE_3D,Qt,rt,st.width,st.height,st.depth),Vt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,vt,k,st.data)):e.texImage3D(i.TEXTURE_3D,0,rt,st.width,st.height,st.depth,0,vt,k,st.data);else if(A.isFramebufferTexture){if(mt)if(nt)e.texStorage2D(i.TEXTURE_2D,Qt,rt,st.width,st.height);else{let ht=st.width,Bt=st.height;for(let te=0;te<Qt;te++)e.texImage2D(i.TEXTURE_2D,te,rt,ht,Bt,0,vt,k,null),ht>>=1,Bt>>=1}}else if(A.isHTMLTexture){if("texElementImage2D"in i){let ht=i.canvas;if(ht.hasAttribute("layoutsubtree")||ht.setAttribute("layoutsubtree","true"),st.parentNode!==ht){ht.appendChild(st),u.add(A),ht.onpaint=Bt=>{let te=Bt.changedElements;for(let It of u)te.includes(It.image)&&(It.needsUpdate=!0)},ht.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,st);else{let te=i.RGBA,It=i.RGBA,Ee=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,te,It,Ee,st)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(bt.length>0){if(nt&&mt){let ht=ie(bt[0]);e.texStorage2D(i.TEXTURE_2D,Qt,rt,ht.width,ht.height)}for(let ht=0,Bt=bt.length;ht<Bt;ht++)Q=bt[ht],nt?Vt&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,vt,k,Q):e.texImage2D(i.TEXTURE_2D,ht,rt,vt,k,Q);A.generateMipmaps=!1}else if(nt){if(mt){let ht=ie(st);e.texStorage2D(i.TEXTURE_2D,Qt,rt,ht.width,ht.height)}Vt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,k,st)}else e.texImage2D(i.TEXTURE_2D,0,rt,vt,k,st);v(A)&&A.mipmapsAutoUpdate===!0&&M(pt),At.__version=_t.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function Ye(L,A,J){if(A.image.length!==6)return;let pt=Xt(L,A),ot=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+J);let _t=n.get(ot);if(ot.version!==_t.__version||pt===!0){e.activeTexture(i.TEXTURE0+J);let At=Se.getPrimaries(Se.workingColorSpace),et=A.colorSpace===vi?null:Se.getPrimaries(A.colorSpace),st=A.colorSpace===vi||At===et?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);let vt=A.isCompressedTexture||A.image[0].isCompressedTexture,k=A.image[0]&&A.image[0].isDataTexture,rt=[];for(let It=0;It<6;It++)!vt&&!k?rt[It]=_(A.image[It],!0,s.maxCubemapSize):rt[It]=k?A.image[It].image:A.image[It],rt[It]=Yt(A,rt[It]);let Q=rt[0],bt=r.convert(A.format,A.colorSpace),nt=r.convert(A.type),mt=w(A.internalFormat,bt,nt,A.normalized,A.colorSpace),Vt=A.isVideoTexture!==!0,Qt=_t.__version===void 0||pt===!0,ht=ot.dataReady,Bt=T(A,Q);be(i.TEXTURE_CUBE_MAP,A);let te;if(A.isDepthTexture){if(mt=y(A.format===Ki,A.type),Qt)if(Vt)e.texStorage2D(i.TEXTURE_CUBE_MAP,1,mt,Q.width,Q.height);else for(let It=0;It<6;It++)e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,mt,Q.width,Q.height,0,bt,nt,null)}else if(vt){Vt&&Qt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Bt,mt,Q.width,Q.height);for(let It=0;It<6;It++){te=rt[It].mipmaps;for(let Ee=0;Ee<te.length;Ee++){let je=te[Ee];A.format!==ni?bt!==null?Vt?ht&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,0,0,je.width,je.height,bt,je.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,mt,je.width,je.height,0,je.data):Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,0,0,je.width,je.height,bt,nt,je.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,mt,je.width,je.height,0,bt,nt,je.data)}}}else{if(te=A.mipmaps,Vt&&Qt){te.length>0&&Bt++;let It=ie(rt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Bt,mt,It.width,It.height)}for(let It=0;It<6;It++)if(k){Vt?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,0,0,rt[It].width,rt[It].height,bt,nt,rt[It].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,mt,rt[It].width,rt[It].height,0,bt,nt,rt[It].data);for(let Ee=0;Ee<te.length;Ee++){let fi=te[Ee].image[It].image;Vt?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,0,0,fi.width,fi.height,bt,nt,fi.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,mt,fi.width,fi.height,0,bt,nt,fi.data)}}else{Vt?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,0,0,bt,nt,rt[It]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,mt,bt,nt,rt[It]);for(let Ee=0;Ee<te.length;Ee++){let je=te[Ee];Vt?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,0,0,bt,nt,je.image[It]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,mt,bt,nt,je.image[It])}}}v(A)&&A.mipmapsAutoUpdate===!0&&M(i.TEXTURE_CUBE_MAP),_t.__version=ot.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function Fe(L,A,J,pt,ot,_t){let At=r.convert(J.format,J.colorSpace),et=r.convert(J.type),st=w(J.internalFormat,At,et,J.normalized,J.colorSpace),vt=n.get(A),k=n.get(J);if(k.__renderTarget=A,!vt.__hasExternalTextures){let rt=Math.max(1,A.width>>_t),Q=Math.max(1,A.height>>_t);ot===i.TEXTURE_3D||ot===i.TEXTURE_2D_ARRAY?e.texImage3D(ot,_t,st,rt,Q,A.depth,0,At,et,null):e.texImage2D(ot,_t,st,rt,Q,0,At,et,null)}e.bindFramebuffer(i.FRAMEBUFFER,L),Et(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,pt,ot,k.__webglTexture,0,We(A)):(ot===i.TEXTURE_2D||ot>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,pt,ot,k.__webglTexture,_t),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bn(L,A,J){if(i.bindRenderbuffer(i.RENDERBUFFER,L),A.depthBuffer){let pt=A.depthTexture,ot=pt&&pt.isDepthTexture?pt.type:null,_t=y(A.stencilBuffer,ot),At=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Et(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,We(A),_t,A.width,A.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,We(A),_t,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,_t,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,At,i.RENDERBUFFER,L)}else{let pt=A.textures;for(let ot=0;ot<pt.length;ot++){let _t=pt[ot],At=r.convert(_t.format,_t.colorSpace),et=r.convert(_t.type),st=w(_t.internalFormat,At,et,_t.normalized,_t.colorSpace);Et(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,We(A),st,A.width,A.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,We(A),st,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,st,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ae(L,A,J){let pt=A.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,L),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ot=n.get(A.depthTexture);ot.__renderTarget=A;let _t=pt?A.depthTexture.image[0]:A.depthTexture.image;(!ot.__webglTexture||_t.width!==A.width||_t.height!==A.height)&&(_t.width=A.width,_t.height=A.height,A.depthTexture.needsUpdate=!0),pt?wt(A.depthTexture,0):ft(A.depthTexture,0);let At=ot.__webglTexture,et=We(A),st=pt?i.TEXTURE_CUBE_MAP_POSITIVE_X+J:i.TEXTURE_2D,vt=A.depthTexture.format===Ki?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(A.depthTexture.format===qi)Et(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,vt,st,At,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,vt,st,At,0);else if(A.depthTexture.format===Ki)Et(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,vt,st,At,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,vt,st,At,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function $e(L){let A=n.get(L),J=L.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==L.depthTexture){let pt=L.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),pt){let ot=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,pt.removeEventListener("dispose",ot)};pt.addEventListener("dispose",ot),A.__depthDisposeCallback=ot}A.__boundDepthTexture=pt}if(L.depthTexture&&!A.__autoAllocateDepthBuffer)if(J)for(let pt=0;pt<6;pt++)Ae(A.__webglFramebuffer[pt],L,pt);else L.texture.mipmaps.length>0?Ae(A.__webglFramebuffer[0],L,0):Ae(A.__webglFramebuffer,L,0);else if(J){A.__webglDepthbuffer=[];for(let pt=0;pt<6;pt++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[pt]),A.__webglDepthbuffer[pt]===void 0)A.__webglDepthbuffer[pt]=i.createRenderbuffer(),Bn(A.__webglDepthbuffer[pt],L,!1);else{let ot=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=A.__webglDepthbuffer[pt];i.bindRenderbuffer(i.RENDERBUFFER,_t),i.framebufferRenderbuffer(i.FRAMEBUFFER,ot,i.RENDERBUFFER,_t)}}else if(L.texture.mipmaps.length>0?e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),Bn(A.__webglDepthbuffer,L,!1);else{let ot=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,_t),i.framebufferRenderbuffer(i.FRAMEBUFFER,ot,i.RENDERBUFFER,_t)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ke(L,A,J){let pt=n.get(L);A!==void 0&&Fe(pt.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),J!==void 0&&$e(L)}function Sn(L){let A=L.texture,J=n.get(L),pt=n.get(A);L.addEventListener("dispose",B),F(L);let ot=L.textures,_t=L.isWebGLCubeRenderTarget===!0,At=ot.length>1;if(At||(pt.__webglTexture===void 0&&(pt.__webglTexture=i.createTexture()),pt.__version=A.version,o.memory.textures++),_t){J.__webglFramebuffer=[];for(let et=0;et<6;et++)if(A.mipmaps.length>0){J.__webglFramebuffer[et]=[];for(let st=0;st<A.mipmaps.length;st++)J.__webglFramebuffer[et][st]=i.createFramebuffer()}else J.__webglFramebuffer[et]=i.createFramebuffer()}else{if(A.mipmaps.length>0){J.__webglFramebuffer=[];for(let et=0;et<A.mipmaps.length;et++)J.__webglFramebuffer[et]=i.createFramebuffer()}else J.__webglFramebuffer=i.createFramebuffer();if(At)for(let et=0,st=ot.length;et<st;et++){let vt=n.get(ot[et]);vt.__webglTexture===void 0&&(vt.__webglTexture=i.createTexture(),o.memory.textures++)}if(L.samples>0&&Et(L)===!1){J.__webglMultisampledFramebuffer=i.createFramebuffer(),J.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let et=0;et<ot.length;et++){let st=ot[et];J.__webglColorRenderbuffer[et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,J.__webglColorRenderbuffer[et]);let vt=r.convert(st.format,st.colorSpace),k=r.convert(st.type),rt=w(st.internalFormat,vt,k,st.normalized,st.colorSpace,L.isXRRenderTarget===!0),Q=We(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,rt,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+et,i.RENDERBUFFER,J.__webglColorRenderbuffer[et])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(J.__webglDepthRenderbuffer=i.createRenderbuffer(),Bn(J.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(_t){e.bindTexture(i.TEXTURE_CUBE_MAP,pt.__webglTexture),be(i.TEXTURE_CUBE_MAP,A);for(let et=0;et<6;et++)if(A.mipmaps.length>0)for(let st=0;st<A.mipmaps.length;st++)Fe(J.__webglFramebuffer[et][st],L,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,st);else Fe(J.__webglFramebuffer[et],L,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);v(A)?M(i.TEXTURE_CUBE_MAP):A.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,A.mipmaps.length-1),e.unbindTexture()}else if(At){for(let et=0,st=ot.length;et<st;et++){let vt=ot[et],k=n.get(vt),rt=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(rt=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,k.__webglTexture),be(rt,vt),Fe(J.__webglFramebuffer,L,vt,i.COLOR_ATTACHMENT0+et,rt,0),v(vt)&&M(rt)}e.unbindTexture()}else{let et=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(et=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(et,pt.__webglTexture),be(et,A),A.mipmaps.length>0)for(let st=0;st<A.mipmaps.length;st++)Fe(J.__webglFramebuffer[st],L,A,i.COLOR_ATTACHMENT0,et,st);else Fe(J.__webglFramebuffer,L,A,i.COLOR_ATTACHMENT0,et,0);v(A)?M(et):A.mipmaps.length>0&&i.texParameteri(et,i.TEXTURE_MAX_LEVEL,A.mipmaps.length-1),e.unbindTexture()}L.depthBuffer&&$e(L)}function V(L){let A=L.textures;for(let J=0,pt=A.length;J<pt;J++){let ot=A[J];if(v(ot)&&ot.mipmapsAutoUpdate===!0){let _t=b(L),At=n.get(ot).__webglTexture;e.bindTexture(_t,At),M(_t),e.unbindTexture()}}}let Wn=[];function Ve(L){if(L.samples>0){if(Et(L)===!1){let A=L.textures,J=L.width,pt=L.height,ot=i.COLOR_BUFFER_BIT,_t=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,At=n.get(L),et=A.length>1;if(et)for(let vt=0;vt<A.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,At.__webglMultisampledFramebuffer),L.texture.mipmaps.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglFramebuffer);for(let vt=0;vt<A.length;vt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ot|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ot|=i.STENCIL_BUFFER_BIT)),et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,At.__webglColorRenderbuffer[vt]);let k=n.get(A[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,k,0)}i.blitFramebuffer(0,0,J,pt,0,0,J,pt,ot,i.NEAREST),l===!0&&(Wn.length=0,Wn.push(i.COLOR_ATTACHMENT0+vt),L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&Wn.push(_t),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Wn))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),et)for(let vt=0;vt<A.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,At.__webglColorRenderbuffer[vt]);let k=n.get(A[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,k,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&l){let A=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function We(L){return Math.min(s.maxSamples,L.samples)}function Et(L){let A=n.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ln(L){let A=o.render.frame;h.get(L)!==A&&(h.set(L,A),L.update())}function Yt(L,A){let J=L.colorSpace,pt=L.format,ot=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||J!==so&&J!==vi&&(Se.getTransfer(J)===ke?(pt!==ni||ot!==Zn)&&Kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):se("WebGLTextures: Unsupported texture color space:",J)),A}function ie(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=Pt,this.resetTextureUnits=W,this.getTextureUnits=K,this.setTextureUnits=ut,this.setTexture2D=ft,this.setTexture2DArray=Rt,this.setTexture3D=Gt,this.setTextureCube=wt,this.rebindTextures=Ke,this.setupRenderTarget=Sn,this.updateRenderTargetMipmap=V,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Fe,this.useMultisampledRTT=Et,this.dispose=U}function Uy(i,t){function e(n,s=vi){let r,o=Se.getTransfer(s);if(n===Zn)return i.UNSIGNED_BYTE;if(n===ll)return i.UNSIGNED_SHORT_4_4_4_4;if(n===cl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===gh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===xh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ph)return i.BYTE;if(n===mh)return i.SHORT;if(n===Lr)return i.UNSIGNED_SHORT;if(n===al)return i.INT;if(n===_i)return i.UNSIGNED_INT;if(n===ui)return i.FLOAT;if(n===ei)return i.HALF_FLOAT;if(n===yh)return i.ALPHA;if(n===_h)return i.RGB;if(n===ni)return i.RGBA;if(n===qi)return i.DEPTH_COMPONENT;if(n===Ki)return i.DEPTH_STENCIL;if(n===hl)return i.RED;if(n===ul)return i.RED_INTEGER;if(n===_s)return i.RG;if(n===dl)return i.RG_INTEGER;if(n===fl)return i.RGBA_INTEGER;if(n===Po||n===Io||n===Lo||n===Do)if(o===ke)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Po)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Po)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===pl||n===ml||n===gl||n===xl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===pl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ml)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===gl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===xl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===yl||n===_l||n===vl||n===Ml||n===bl||n===No||n===Sl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===yl||n===_l)return o===ke?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===vl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ml)return r.COMPRESSED_R11_EAC;if(n===bl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===No)return r.COMPRESSED_RG11_EAC;if(n===Sl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===wl||n===El||n===Tl||n===Al||n===Rl||n===Cl||n===Pl||n===Il||n===Ll||n===Dl||n===Nl||n===Fl||n===Ul||n===Ol)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===wl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===El)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Tl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Al)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Rl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Cl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Pl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Il)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ll)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Dl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Nl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fl)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ul)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ol)return o===ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===kl||n===Bl||n===zl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===kl)return o===ke?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Bl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===zl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hl||n===Gl||n===Fo||n===Vl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Hl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Gl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Vl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Oy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ky=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Wh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new go(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Yn({vertexShader:Oy,fragmentShader:ky,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new tt(new ce(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xh=class extends Ci{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null,x=typeof XRWebGLBinding<"u",g=new Wh,m={},_=e.getContextAttributes(),v=null,M=null,b=[],w=[],y=new xt,T=null,F=null,O=new Un;O.viewport=new tn;let N=new Un;N.viewport=new tn;let B=[O,N],G=new nl,E=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ft=b[Z];return ft===void 0&&(ft=new Er,b[Z]=ft),ft.getTargetRaySpace()},this.getControllerGrip=function(Z){let ft=b[Z];return ft===void 0&&(ft=new Er,b[Z]=ft),ft.getGripSpace()},this.getHand=function(Z){let ft=b[Z];return ft===void 0&&(ft=new Er,b[Z]=ft),ft.getHandSpace()};function C(Z){let ft=w.indexOf(Z.inputSource);if(ft===-1)return;let Rt=b[ft];Rt!==void 0&&(Rt.update(Z.inputSource,Z.frame,c||o),Rt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function P(){s.removeEventListener("select",C),s.removeEventListener("selectstart",C),s.removeEventListener("selectend",C),s.removeEventListener("squeeze",C),s.removeEventListener("squeezestart",C),s.removeEventListener("squeezeend",C),s.removeEventListener("end",P),s.removeEventListener("inputsourceschange",X);for(let Z=0;Z<b.length;Z++){let ft=w[Z];ft!==null&&(w[Z]=null,b[Z].disconnect(ft))}E=null,U=null,g.reset();for(let Z in m)delete m[Z];if(t.setRenderTarget(v),f=null,d=null,u=null,s=null,M=null,Pt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(y.width,y.height,!1),F!==null){let Z=F.camera;Z.fov=F.fov,Z.zoom=F.zoom,Z.updateProjectionMatrix(),F=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&Kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",C),s.addEventListener("selectstart",C),s.addEventListener("selectend",C),s.addEventListener("squeeze",C),s.addEventListener("squeezestart",C),s.addEventListener("squeezeend",C),s.addEventListener("end",P),s.addEventListener("inputsourceschange",X),_.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(y),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Rt=null,Gt=null,wt=null;_.depth&&(wt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Rt=_.stencil?Ki:qi,Gt=_.stencil?Xs:_i);let $t={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer($t),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new Qn(d.textureWidth,d.textureHeight,{format:ni,type:Zn,depthTexture:new Zi(d.textureWidth,d.textureHeight,Gt,void 0,void 0,void 0,void 0,void 0,void 0,Rt),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let Rt={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Rt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Qn(f.framebufferWidth,f.framebufferHeight,{format:ni,type:Zn,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Pt.setContext(s),Pt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(Z){for(let ft=0;ft<Z.removed.length;ft++){let Rt=Z.removed[ft],Gt=w.indexOf(Rt);Gt>=0&&(w[Gt]=null,b[Gt].disconnect(Rt))}for(let ft=0;ft<Z.added.length;ft++){let Rt=Z.added[ft],Gt=w.indexOf(Rt);if(Gt===-1){for(let $t=0;$t<b.length;$t++)if($t>=w.length){w.push(Rt),Gt=$t;break}else if(w[$t]===null){w[$t]=Rt,Gt=$t;break}if(Gt===-1)break}let wt=b[Gt];wt&&wt.connect(Rt)}}function D(Z,ft){ft===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ft.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ft=Z.near,Rt=Z.far;g.texture!==null&&(g.depthNear>0&&(ft=g.depthNear),g.depthFar>0&&(Rt=g.depthFar)),G.near=N.near=O.near=ft,G.far=N.far=O.far=Rt,(E!==G.near||U!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),E=G.near,U=G.far),G.layers.mask=Z.layers.mask|6,O.layers.mask=G.layers.mask&-5,N.layers.mask=G.layers.mask&-3;let Gt=Z.parent,wt=G.cameras;D(G,Gt);for(let $t=0;$t<wt.length;$t++)D(wt[$t],Gt);G.projectionMatrix.copy(O.projectionMatrix),G.projectionMatrixInverse.copy(O.projectionMatrixInverse),F===null&&Z.isPerspectiveCamera&&(F={camera:Z,fov:Z.fov,zoom:Z.zoom}),W(Z,G,Gt)};function W(Z,ft,Rt){Rt===null?Z.matrix.copy(ft.matrixWorld):(Z.matrix.copy(Rt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ft.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ft.projectionMatrix),Z.projectionMatrixInverse.copy(ft.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=La*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(G)},this.getCameraTexture=function(Z){return m[Z]};let K=null;function ut(Z,ft){if(h=ft.getViewerPose(c||o),p=ft,h!==null){let Rt=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let Gt=!1;Rt.length!==G.cameras.length&&(G.cameras.length=0,Gt=!0);for(let Mt=0;Mt<Rt.length;Mt++){let be=Rt[Mt],Xt=null;if(f!==null)Xt=f.getViewport(be);else{let Pe=u.getViewSubImage(d,be);Xt=Pe.viewport,Mt===0&&(t.setRenderTargetTextures(M,Pe.colorTexture,Pe.depthStencilTexture),t.setRenderTarget(M))}let qt=B[Mt];qt===void 0&&(qt=new Un,qt.layers.enable(Mt),qt.viewport=new tn,B[Mt]=qt),qt.matrix.fromArray(be.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(be.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),Mt===0&&(G.matrix.copy(qt.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Gt===!0&&G.cameras.push(qt)}let wt=s.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let Mt=u.getDepthInformation(Rt[0]);Mt&&Mt.isValid&&Mt.texture&&g.init(Mt,s.renderState)}if(wt&&wt.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let Mt=0;Mt<Rt.length;Mt++){let be=Rt[Mt].camera;if(be){let Xt=m[be];Xt||(Xt=new go,m[be]=Xt);let qt=u.getCameraImage(be);Xt.sourceTexture=qt}}}}for(let Rt=0;Rt<b.length;Rt++){let Gt=w[Rt],wt=b[Rt];Gt!==null&&wt!==void 0&&wt.update(Gt,ft,c||o)}K&&K(Z,ft),ft.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ft}),p=null}let Pt=new $d;Pt.setAnimationLoop(ut),this.setAnimationLoop=function(Z){K=Z},this.dispose=function(){}}},By=new Ne,o0=new le;o0.set(-1,0,0,0,1,0,0,0,1);function zy(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Ah(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,_,v,M){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,M)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,_,v):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Gn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Gn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let _=t.get(m),v=_.envMap,M=_.envMapRotation;v&&(g.envMap.value=v,g.envMapRotation.value.setFromMatrix4(By.makeRotationFromEuler(M)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(o0),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,_,v){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*_,g.scale.value=v*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,_){g.ior.value=m.ior,m.diffuseRoughness>0&&(g.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=m.diffuseRoughnessMap,e(m.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Gn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let _=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Hy(i,t,e,n){let s={},r={};function o(_,v){let M=v.program;n.uniformBlockBinding(_,M,s[_.id])}function a(_,v){let M=s[_.id];M===void 0&&(p(_),M=l(_),s[_.id]=M,_.addEventListener("dispose",g));let b=v.program;n.updateUBOMapping(_,b);let w=t.render.frame;r[_.id]!==w&&(c(_),r[_.id]=w)}function l(_){let v=i.createBuffer(),M=_.__size,b=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,M,b),i.bindBuffer(i.UNIFORM_BUFFER,null),v}function c(_){let v=s[_.id],M=_.uniforms,b=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let w=0,y=M.length;w<y;w++){let T=M[w];if(Array.isArray(T))for(let F=0,O=T.length;F<O;F++)h(T[F],w,F,b);else h(T,w,0,b)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(_,v,M,b){if(d(_,v,M,b)===!0){let w=_.__offset,y=_.value;if(Array.isArray(y)){let T=0;for(let F=0;F<y.length;F++){let O=y[F],N=x(O,!0);u(O,_.__data,T),T+=N.storage/Float32Array.BYTES_PER_ELEMENT}}else u(y,_.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,w,_.__data)}}function u(_,v,M){typeof _=="number"||typeof _=="boolean"?v[M]=_:_.isMatrix3?(v[M]=_.elements[0],v[M+1]=_.elements[1],v[M+2]=_.elements[2],v[M+3]=0,v[M+4]=_.elements[3],v[M+5]=_.elements[4],v[M+6]=_.elements[5],v[M+7]=0,v[M+8]=_.elements[6],v[M+9]=_.elements[7],v[M+10]=_.elements[8],v[M+11]=0):ArrayBuffer.isView(_)?v.set(_.subarray(0,v.length-M),M):_.toArray(v,M)}function d(_,v,M,b){let w=_.value,y=v+"_"+M;if(Array.isArray(w)){b[y]===void 0&&(b[y]=[]);let T=b[y],F=!1;for(let O=0;O<w.length;O++)f(w[O],T,O)===!0&&(F=!0);return F}return f(w,b,y)}function f(_,v,M){if(v[M]===void 0)return typeof _=="number"||typeof _=="boolean"?v[M]=_:ArrayBuffer.isView(_)?v[M]=_.slice():v[M]=_.clone(),!0;{let b=v[M];if(typeof _=="number"||typeof _=="boolean"){if(b!==_)return v[M]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(b.equals(_)===!1)return b.copy(_),!0}}return!1}function p(_){let v=_.uniforms,M=0,b=16;for(let y=0,T=v.length;y<T;y++){let F=Array.isArray(v[y])?v[y]:[v[y]];for(let O=0,N=F.length;O<N;O++){let B=F[O],G=Array.isArray(B.value)?B.value:[B.value],E=Array.isArray(v[y])||Array.isArray(B.value),U=M;for(let P=0,X=G.length;P<X;P++){let D=G[P],W=x(D,E),K=M%b,ut=K%W.boundary,Pt=K+ut;M+=ut,Pt!==0&&b-Pt<W.storage&&(M+=b-Pt),P===0&&(U=M),M+=W.storage}let C=B.type==="int"?Int32Array:B.type==="uint"?Uint32Array:Float32Array;B.__data=new C((M-U)/Float32Array.BYTES_PER_ELEMENT),B.__offset=U}}let w=M%b;return w>0&&(M+=b-w),_.__size=M,_.__cache={},this}function x(_,v){let M={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(M.boundary=4,M.storage=4):_.isVector2?(M.boundary=8,M.storage=8):_.isVector3||_.isColor?(M.boundary=16,M.storage=12):_.isVector4?(M.boundary=16,M.storage=16):_.isMatrix3?(M.boundary=16,M.storage=48):_.isMatrix4?(M.boundary=16,M.storage=64):_.isTexture?Kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(M.boundary=16,M.storage=_.byteLength):Kt("WebGLRenderer: Unsupported uniform value type.",_),v===!0&&(M.boundary=16,M.storage=Math.ceil(M.storage/16)*16),M}function g(_){let v=_.target;v.removeEventListener("dispose",g),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function m(){for(let _ in s)i.deleteBuffer(s[_]);s={},r={}}return{bind:o,update:a,dispose:m}}var Gy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ni=null;function Vy(){return Ni===null&&(Ni=new ks(Gy,16,16,_s,ei),Ni.name="DFG_LUT",Ni.minFilter=xn,Ni.magFilter=xn,Ni.wrapS=oi,Ni.wrapT=oi,Ni.generateMipmaps=!1,Ni.needsUpdate=!0),Ni}var Yl=class{constructor(t={}){let{canvas:e=vd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Zn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let x=f,g=new Set([fl,dl,ul]),m=new Set([Zn,_i,Lr,Xs,ll,cl]),_=new Uint32Array(4),v=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]},b=null,w=null,y=[],T=[],F=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Di,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let O=this,N=!1,B=null,G=null,E=null,U=null;this._outputColorSpace=hn;let C=0,P=0,X=null,D=-1,W=null,K=new tn,ut=new tn,Pt=null,Z=new Ut(0),ft=0,Rt=e.width,Gt=e.height,wt=1,$t=null,Te=null,Mt=new tn(0,0,Rt,Gt),be=new tn(0,0,Rt,Gt),Xt=!1,qt=new us,Pe=new Ua,Ie=!1,Ye=!1,Fe=new Ne,Bn=new I,Ae=new tn,$e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ke=!1;function Sn(){return X===null?wt:1}let V=n;function Wn(R,H){return e.getContext(R,H)}let Ve,We,Et,ln,Yt,ie,L,A,J,pt,ot,_t,At,et,st,vt,k,rt,Q,bt,nt,mt,Vt;try{let R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"187"}`),e.addEventListener("webglcontextlost",Bt,!1),e.addEventListener("webglcontextrestored",te,!1),e.addEventListener("webglcontextcreationerror",It,!1),V===null){let H="webgl2";if(V=Wn(H,R),V===null)throw Wn(H)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Qt()}catch(R){throw e.removeEventListener("webglcontextlost",Bt,!1),e.removeEventListener("webglcontextrestored",te,!1),e.removeEventListener("webglcontextcreationerror",It,!1),se("WebGLRenderer: "+R.message),R}function Qt(){Ve=new tx(V),Ve.init(),nt=new Uy(V,Ve),We=new Vg(V,Ve,t,nt),Et=new Ny(V,Ve),We.reversedDepthBuffer&&d&&Et.buffers.depth.setReversed(!0),G=V.createFramebuffer(),E=V.createFramebuffer(),U=V.createFramebuffer(),ln=new ix(V),Yt=new vy,ie=new Fy(V,Ve,Et,Yt,We,nt,ln),L=new Qg(O),A=new rp(V),mt=new Hg(V,A),J=new ex(V,A,ln,mt),pt=new rx(V,J,A,mt,ln),rt=new sx(V,We,ie),st=new Wg(Yt),ot=new _y(O,L,Ve,We,mt,st),_t=new zy(O,Yt),At=new by,et=new Ry(Ve),k=new zg(O,L,Et,pt,p,l),vt=new Dy(O,pt,We),Vt=new Hy(V,ln,We,Et),Q=new Gg(V,Ve,ln),bt=new nx(V,Ve,ln),ln.programs=ot.programs,O.capabilities=We,O.extensions=Ve,O.properties=Yt,O.renderLists=At,O.shadowMap=vt,O.state=Et,O.info=ln}x!==Zn&&(F=new ax(x,e.width,e.height,a,s,r));let ht=new Xh(O,V);this.xr=ht,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){let R=Ve.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=Ve.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return wt},this.setPixelRatio=function(R){R!==void 0&&(wt=R,this.setSize(Rt,Gt,!1))},this.getSize=function(R){return R.set(Rt,Gt)},this.setSize=function(R,H,j=!0){if(ht.isPresenting){Kt("WebGLRenderer: Can't change size while VR device is presenting.");return}Rt=R,Gt=H,e.width=Math.floor(R*wt),e.height=Math.floor(H*wt),j===!0&&(e.style.width=R+"px",e.style.height=H+"px"),F!==null&&F.setSize(e.width,e.height),this.setViewport(0,0,R,H)},this.getDrawingBufferSize=function(R){return R.set(Rt*wt,Gt*wt).floor()},this.setDrawingBufferSize=function(R,H,j){Rt=R,Gt=H,wt=j,e.width=Math.floor(R*j),e.height=Math.floor(H*j),this.setViewport(0,0,R,H)},this.setEffects=function(R){if(x===Zn){se("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let H=0;H<R.length;H++)if(R[H].isOutputPass===!0){Kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}F.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(K)},this.getViewport=function(R){return R.copy(Mt)},this.setViewport=function(R,H,j,Y){R.isVector4?Mt.set(R.x,R.y,R.z,R.w):Mt.set(R,H,j,Y),Et.viewport(K.copy(Mt).multiplyScalar(Sn()).round())},this.getScissor=function(R){return R.copy(be)},this.setScissor=function(R,H,j,Y){R.isVector4?be.set(R.x,R.y,R.z,R.w):be.set(R,H,j,Y),Et.scissor(ut.copy(be).multiplyScalar(Sn()).round())},this.getScissorTest=function(){return Xt},this.setScissorTest=function(R){Et.setScissorTest(Xt=R)},this.setOpaqueSort=function(R){$t=R},this.setTransparentSort=function(R){Te=R},this.getClearColor=function(R){return R.copy(k.getClearColor())},this.setClearColor=function(){k.setClearColor(...arguments)},this.getClearAlpha=function(){return k.getClearAlpha()},this.setClearAlpha=function(){k.setClearAlpha(...arguments)},this.clear=function(R=!0,H=!0,j=!0){let Y=0;if(R){let $=!1;if(X!==null){let Tt=X.texture.format;$=g.has(Tt)}if($){let Tt=X.texture.type,kt=m.has(Tt),St=k.getClearColor(),Dt=k.getClearAlpha(),Ct=St.r,ee=St.g,_e=St.b;kt?(_[0]=Ct,_[1]=ee,_[2]=_e,_[3]=Dt,V.clearBufferuiv(V.COLOR,0,_)):(v[0]=Ct,v[1]=ee,v[2]=_e,v[3]=Dt,V.clearBufferiv(V.COLOR,0,v))}else Y|=V.COLOR_BUFFER_BIT}H&&(Y|=V.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),j&&(Y|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&V.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),B=R},this.dispose=function(){e.removeEventListener("webglcontextlost",Bt,!1),e.removeEventListener("webglcontextrestored",te,!1),e.removeEventListener("webglcontextcreationerror",It,!1),k.dispose(),At.dispose(),et.dispose(),ie.dispose(),Yt.dispose(),L.dispose(),pt.dispose(),J.dispose(),mt.dispose(),Vt.dispose(),ot.dispose(),ht.dispose(),ht.removeEventListener("sessionstart",er),ht.removeEventListener("sessionend",wi),Xn.stop()};function Bt(R){R.preventDefault(),wh("WebGLRenderer: Context Lost."),N=!0}function te(){wh("WebGLRenderer: Context Restored."),N=!1;let R=ln.autoReset,H=vt.enabled,j=vt.autoUpdate,Y=vt.needsUpdate,$=vt.type;Qt(),ln.autoReset=R,vt.enabled=H,vt.autoUpdate=j,vt.needsUpdate=Y,vt.type=$}function It(R){se("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Ee(R){let H=R.target;H.removeEventListener("dispose",Ee),je(H)}function je(R){fi(R),Yt.remove(R)}function fi(R){let H=Yt.get(R).programs;H!==void 0&&(H.forEach(function(j){ot.releaseProgram(j)}),R.isShaderMaterial&&ot.releaseShaderCache(R))}this.renderBufferDirect=function(R,H,j,Y,$,Tt){H===null&&(H=$e);let kt=$.isMesh&&$.matrixWorld.determinantAffine()<0,St=Ti(R,H,j,Y,$);Et.setMaterial(Y,kt);let Dt=j.index,Ct=1;if(Y.wireframe===!0){if(Dt=J.getWireframeAttribute(j),Dt===void 0)return;Ct=2}let ee=j.drawRange,_e=j.attributes.position,Ft=ee.start*Ct,me=(ee.start+ee.count)*Ct;Tt!==null&&(Ft=Math.max(Ft,Tt.start*Ct),me=Math.min(me,(Tt.start+Tt.count)*Ct)),Dt!==null?(Ft=Math.max(Ft,0),me=Math.min(me,Dt.count)):_e!=null&&(Ft=Math.max(Ft,0),me=Math.min(me,_e.count));let Qe=me-Ft;if(Qe<0||Qe===1/0)return;mt.setup($,Y,St,j,Dt);let Oe,Le=Q;if(Dt!==null&&(Oe=A.get(Dt),Le=bt,Le.setIndex(Oe)),$.isMesh)Y.wireframe===!0?(Et.setLineWidth(Y.wireframeLinewidth*Sn()),Le.setMode(V.LINES)):Le.setMode(V.TRIANGLES);else if($.isLine){let wn=Y.linewidth;wn===void 0&&(wn=1),Et.setLineWidth(wn*Sn()),$.isLineSegments?Le.setMode(V.LINES):$.isLineLoop?Le.setMode(V.LINE_LOOP):Le.setMode(V.LINE_STRIP)}else $.isPoints?Le.setMode(V.POINTS):$.isSprite&&Le.setMode(V.TRIANGLES);if($.isBatchedMesh)if(Ve.get("WEBGL_multi_draw"))Le.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{let wn=$._multiDrawStarts,zt=$._multiDrawCounts,fn=$._multiDrawCount,at=Dt?A.get(Dt).bytesPerElement:1,Wt=Yt.get(Y).currentProgram.getUniforms();for(let Zt=0;Zt<fn;Zt++)Wt.setValue(V,"_gl_DrawID",Zt),Le.render(wn[Zt]/at,zt[Zt])}else if($.isInstancedMesh)Le.renderInstances(Ft,Qe,$.count);else if(j.isInstancedBufferGeometry){let wn=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,zt=Math.min(j.instanceCount,wn);Le.renderInstances(Ft,Qe,zt)}else Le.render(Ft,Qe)};function As(R,H,j,Y){B!==null&&R.isNodeMaterial&&B.setObject(Y,R),Ie===!0&&st.setState(R,j,!1),R.transparent===!0&&R.side===Ce&&R.forceSinglePass===!1?(R.side=Gn,R.needsUpdate=!0,is(R,H,Y),R.side=ms,R.needsUpdate=!0,is(R,H,Y),R.side=Ce):is(R,H,Y)}this.compile=function(R,H,j=null){j===null&&(j=R),B!==null&&B.renderStart(R,H,j),w=et.get(j),w.init(H),T.push(w),j.traverseVisible(function($){$.isLight&&$.layers.test(H.layers)&&(w.pushLight($),$.castShadow&&w.pushShadow($))}),R!==j&&R.traverseVisible(function($){$.isLight&&$.layers.test(H.layers)&&(w.pushLight($),$.castShadow&&w.pushShadow($))}),w.setupLights(),B!==null&&B.updateLights(w.state.lightsArray),Ye=this.localClippingEnabled,Ie=st.init(this.clippingPlanes,Ye),Ie===!0&&st.setGlobalState(this.clippingPlanes,H),B!==null&&vt.render(w.state.shadowsArray,j,H);let Y=new Set;return R.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;let Tt=$.material;if(Tt)if(Array.isArray(Tt))for(let kt=0;kt<Tt.length;kt++){let St=Tt[kt];As(St,j,H,$),Y.add(St)}else As(Tt,j,H,$),Y.add(Tt)}),w=T.pop(),B!==null&&B.renderEnd(),Y},this.compileAsync=function(R,H,j=null){let Y=this.compile(R,H,j);return new Promise($=>{function Tt(){if(Y.forEach(function(kt){let Dt=Yt.get(kt).currentProgram;(Dt===void 0||Dt.isReady())&&Y.delete(kt)}),Y.size===0){$(R);return}setTimeout(Tt,10)}Ve.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let Rs=null;function tr(R){Rs&&Rs(R)}function er(){Xn.stop()}function wi(){Xn.start()}let Xn=new $d;Xn.setAnimationLoop(tr),typeof self<"u"&&Xn.setContext(self),this.setAnimationLoop=function(R){Rs=R,ht.setAnimationLoop(R),R===null?Xn.stop():Xn.start()},ht.addEventListener("sessionstart",er),ht.addEventListener("sessionend",wi),this.render=function(R,H){if(H!==void 0&&H.isCamera!==!0){se("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;B!==null&&B.renderStart(R,H);let j=ht.enabled===!0&&ht.isPresenting===!0,Y=F!==null&&(X===null||j)&&F.begin(O,X);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),ht.enabled===!0&&ht.isPresenting===!0&&(F===null||F.isCompositing()===!1)&&(ht.cameraAutoUpdate===!0&&ht.updateCamera(H),H=ht.getCamera()),R.isScene===!0&&R.onBeforeRender(O,R,H,X),w=et.get(R,T.length),w.init(H),w.state.textureUnits=ie.getTextureUnits(),T.push(w),Fe.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),H.isArrayCamera?Pe.setFromArrayCamera(H):qt.setFromProjectionMatrix(Fe,ai,H.reversedDepth),Ye=this.localClippingEnabled,Ie=st.init(this.clippingPlanes,Ye),b=At.get(R,y.length),b.init(),y.push(b),this.info.render.frame++,ht.enabled===!0&&ht.isPresenting===!0){let kt=O.xr.getDepthSensingMesh();kt!==null&&Zr(kt,H,-1/0,O.sortObjects)}Zr(R,H,0,O.sortObjects),b.finish(),B!==null&&B.updateLights(w.state.lightsArray),O.sortObjects===!0&&b.sort($t,Te),Ke=ht.enabled===!1||ht.isPresenting===!1||ht.hasDepthSensing()===!1,Ke&&k.addToRenderList(b,R),this.info.autoReset===!0&&this.info.reset(),Ie===!0&&st.beginShadows();let $=w.state.shadowsArray;if(vt.render($,R,H),Ie===!0&&st.endShadows(),(Y&&F.hasRenderPass())===!1){let kt=b.opaque,St=b.transmissive;if(w.setupLights(),H.isArrayCamera){let Dt=H.cameras;if(St.length>0)for(let Ct=0,ee=Dt.length;Ct<ee;Ct++){let _e=Dt[Ct];Qo(kt,St,R,_e)}Ke&&k.render(R);for(let Ct=0,ee=Dt.length;Ct<ee;Ct++){let _e=Dt[Ct];jo(b,R,_e,_e.viewport)}}else St.length>0&&Qo(kt,St,R,H),Ke&&k.render(R),jo(b,R,H)}X!==null&&P===0&&(ie.updateMultisampleRenderTarget(X),ie.updateRenderTargetMipmap(X)),Y&&F.end(O),R.isScene===!0&&R.onAfterRender(O,R,H),mt.resetDefaultState(),D=-1,W=null,T.pop(),T.length>0?(w=T[T.length-1],ie.setTextureUnits(w.state.textureUnits),Ie===!0&&st.setGlobalState(O.clippingPlanes,w.state.camera)):w=null,y.pop(),y.length>0?b=y[y.length-1]:b=null,B!==null&&B.renderEnd()};function Zr(R,H,j,Y){if(R.visible===!1)return;if(R.layers.test(H.layers)){if(R.isGroup)j=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(H);else if(R.isLight)w.pushLight(R),R.castShadow&&w.pushShadow(R);else if(R.isSprite){let kt=H.isArrayCamera?Pe:qt;if(!R.frustumCulled||R.intersectsFrustum(kt)){Y&&Ae.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Fe);let St=pt.update(R),Dt=R.material;Dt.visible&&b.push(R,St,Dt,j,Ae.z,null,H)}}else if(R.isMesh||R.isLine||R.isPoints){let kt=H.isArrayCamera?Pe:qt;if(!R.frustumCulled||R.intersectsFrustum(kt)){let St=pt.update(R),Dt=R.material;if(Y&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ae.copy(R.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Ae.copy(St.boundingSphere.center)),Ae.applyMatrix4(R.matrixWorld).applyMatrix4(Fe)),Array.isArray(Dt)){let Ct=St.groups;for(let ee=0,_e=Ct.length;ee<_e;ee++){let Ft=Ct[ee],me=Dt[Ft.materialIndex];me&&me.visible&&b.push(R,St,me,j,Ae.z,Ft,H)}}else Dt.visible&&b.push(R,St,Dt,j,Ae.z,null,H)}}}let Tt=R.children;for(let kt=0,St=Tt.length;kt<St;kt++)Zr(Tt[kt],H,j,Y)}function jo(R,H,j,Y){let{opaque:$,transmissive:Tt,transparent:kt}=R;w.setupLightsView(j),Ie===!0&&st.setGlobalState(O.clippingPlanes,j),Y&&Et.viewport(K.copy(Y)),$.length>0&&ns($,H,j),Tt.length>0&&ns(Tt,H,j),kt.length>0&&ns(kt,H,j),Et.buffers.depth.setTest(!0),Et.buffers.depth.setMask(!0),Et.buffers.color.setMask(!0),Et.setPolygonOffset(!1)}function Qo(R,H,j,Y){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[Y.id]===void 0){let Ft=Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[Y.id]=new Qn(1,1,{generateMipmaps:!0,type:Ft?ei:Zn,minFilter:$i,samples:Math.max(4,We.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Se.workingColorSpace})}let Tt=w.state.transmissionRenderTarget[Y.id],kt=Y.viewport||K;Tt.setSize(kt.z*O.transmissionResolutionScale,kt.w*O.transmissionResolutionScale);let St=O.getRenderTarget(),Dt=O.getActiveCubeFace(),Ct=O.getActiveMipmapLevel();O.setRenderTarget(Tt),O.getClearColor(Z),ft=O.getClearAlpha(),ft<1&&O.setClearColor(16777215,.5),O.clear(),Ke&&k.render(j);let ee=O.toneMapping;O.toneMapping=Di;let _e=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),w.setupLightsView(Y),Ie===!0&&st.setGlobalState(O.clippingPlanes,Y),ns(R,j,Y),ie.updateMultisampleRenderTarget(Tt),ie.updateRenderTargetMipmap(Tt),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let Ft=!1;for(let me=0,Qe=H.length;me<Qe;me++){let Oe=H[me],{object:Le,geometry:wn,material:zt,group:fn}=Oe;if(zt.side===Ce&&Le.layers.test(Y.layers)){let at=zt.side;zt.side=Gn,zt.needsUpdate=!0,nr(Le,j,Y,wn,zt,fn),zt.side=at,zt.needsUpdate=!0,Ft=!0}}Ft===!0&&(ie.updateMultisampleRenderTarget(Tt),ie.updateRenderTargetMipmap(Tt))}O.setRenderTarget(St,Dt,Ct),O.setClearColor(Z,ft),_e!==void 0&&(Y.viewport=_e),O.toneMapping=ee}function ns(R,H,j){let Y=H.isScene===!0?H.overrideMaterial:null;for(let $=0,Tt=R.length;$<Tt;$++){let kt=R[$],{object:St,geometry:Dt,group:Ct}=kt,ee=kt.material;ee.allowOverride===!0&&Y!==null&&(ee=Y),St.layers.test(j.layers)&&nr(St,H,j,Dt,ee,Ct)}}function nr(R,H,j,Y,$,Tt){B!==null&&$.isNodeMaterial&&B.setObject(R,$),R.onBeforeRender(O,H,j,Y,$,Tt),R.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),$.onBeforeRender(O,H,j,Y,R,Tt),$.transparent===!0&&$.side===Ce&&$.forceSinglePass===!1?($.side=Gn,$.needsUpdate=!0,O.renderBufferDirect(j,H,Y,$,R,Tt),$.side=ms,$.needsUpdate=!0,O.renderBufferDirect(j,H,Y,$,R,Tt),$.side=Ce):O.renderBufferDirect(j,H,Y,$,R,Tt),R.onAfterRender(O,H,j,Y,$,Tt)}function Ei(R){let H=0;for(let j of R)j.texture!==null&&H++;return H}function is(R,H,j){H.isScene!==!0&&(H=$e);let Y=Yt.get(R),$=w.state.lights,Tt=w.state.shadowsArray,kt=$.state.version,St=ot.getParameters(R,$.state,Tt,H,j,w.state.lightProbeGridArray),Dt=ot.getProgramCacheKey(St),Ct=Y.programs;Y.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?H.environment:null,Y.fog=H.fog;let ee=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;Y.envMap=L.get(R.envMap||Y.environment,ee),Y.envMapRotation=Y.environment!==null&&R.envMap===null?H.environmentRotation:R.envMapRotation,Ct===void 0&&(R.addEventListener("dispose",Ee),Ct=new Map,Y.programs=Ct,Y.programVariants=new Map);let _e=Ct.get(Dt);if(_e!==void 0){if(Y.currentProgram===_e&&Y.lightsStateVersion===kt)return Ps(R,St),_e}else St.uniforms=ot.getUniforms(R),B!==null&&R.isNodeMaterial&&B.build(R,j,St),R.onBeforeCompile(St,O),_e=ot.acquireProgram(St,Dt),Ct.set(Dt,_e),Y.uniforms=St.uniforms;let Ft=Y.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ft.clippingPlanes=st.uniform),Ps(R,St),Y.needsLights=sr(R),Y.lightsStateVersion=kt,Y.needsLights&&(Ft.ambientLightColor.value=$.state.ambient,Ft.lightProbe.value=$.state.probe,Ft.sunLights.value=$.state.sun,Ft.sunLightShadows.value=$.state.sunShadow,Ft.directionalLights.value=$.state.directional,Ft.directionalLightShadows.value=$.state.directionalShadow,Ft.spotLights.value=$.state.spot,Ft.spotLightShadows.value=$.state.spotShadow,Ft.rectAreaLights.value=$.state.rectArea,Ft.ltc_1.value=$.state.rectAreaLTC1,Ft.ltc_2.value=$.state.rectAreaLTC2,Ft.pointLights.value=$.state.point,Ft.pointLightShadows.value=$.state.pointShadow,Ft.hemisphereLights.value=$.state.hemi,Ft.sunShadowMatrix.value=$.state.sunShadowMatrix,Ft.sunShadowCascade.value=$.state.sunShadowCascade,Ft.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Ft.spotLightMatrix.value=$.state.spotLightMatrix,Ft.spotLightMap.value=$.state.spotLightMap,Ft.pointShadowMatrix.value=$.state.pointShadowMatrix),Y.numLightProbeGrids=Ei(w.state.lightProbeGridArray),Y.currentProgram=_e,Y.uniformsList=null,_e}function ir(R,H,j,Y,$){let Tt=Yt.get(R),kt=Tt.currentProgram.id+","+Y+","+$,St=Tt.programVariants.get(kt);return St===void 0?(St=is(R,H,j),Tt.programVariants.set(kt,St)):(Tt.currentProgram=St,Tt.uniformsList=null,Tt.outputColorSpace=Y,Tt.toneMapping=$),St}function Cs(R){if(R.uniformsList===null){let H=R.currentProgram.getUniforms();R.uniformsList=Dr.seqWithValue(H.seq,R.uniforms)}return R.uniformsList}function Ps(R,H){let j=Yt.get(R);j.outputColorSpace=H.outputColorSpace,j.batching=H.batching,j.batchingColor=H.batchingColor,j.instancing=H.instancing,j.instancingColor=H.instancingColor,j.instancingMorph=H.instancingMorph,j.skinning=H.skinning,j.morphTargets=H.morphTargets,j.morphNormals=H.morphNormals,j.morphColors=H.morphColors,j.morphTargetsCount=H.morphTargetsCount,j.numClippingPlanes=H.numClippingPlanes,j.numIntersection=H.numClipIntersection,j.vertexAlphas=H.vertexAlphas,j.vertexTangents=H.vertexTangents,j.toneMapping=H.toneMapping}function Ti(R,H,j,Y,$){H.isScene!==!0&&(H=$e),ie.resetTextureUnits();let Tt=H.fog,kt=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?H.environment:null,St=X===null?O.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Se.workingColorSpace,Dt=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,Ct=L.get(Y.envMap||kt,Dt),ee=Y.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,_e=!!j.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ft=!!j.morphAttributes.position,me=!!j.morphAttributes.normal,Qe=!!j.morphAttributes.color,Oe=Di;Y.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Oe=O.toneMapping);let Le=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,wn=Le!==void 0?Le.length:0,zt=Yt.get(Y),fn=w.state.lights;if(Ie===!0&&(Ye===!0||R!==W)){let sn=R===W&&Y.id===D;st.setState(Y,R,sn)}let at=!1,Wt=!1;Y.version===zt.__version?zt.needsLights&&zt.lightsStateVersion!==fn.state.version||$.isBatchedMesh&&zt.batching===!1||!$.isBatchedMesh&&zt.batching===!0||$.isBatchedMesh&&zt.batchingColor===!0&&$._colorsTexture===null||$.isBatchedMesh&&zt.batchingColor===!1&&$._colorsTexture!==null||$.isInstancedMesh&&zt.instancing===!1||!$.isInstancedMesh&&zt.instancing===!0||$.isSkinnedMesh&&zt.skinning===!1||!$.isSkinnedMesh&&zt.skinning===!0||$.isInstancedMesh&&zt.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&zt.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&zt.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&zt.instancingMorph===!1&&$.morphTexture!==null||zt.envMap!==Ct||Y.fog===!0&&zt.fog!==Tt||zt.numClippingPlanes!==void 0&&(zt.numClippingPlanes!==st.numPlanes||zt.numIntersection!==st.numIntersection)||zt.vertexAlphas!==ee||zt.vertexTangents!==_e||zt.morphTargets!==Ft||zt.morphNormals!==me||zt.morphColors!==Qe||zt.morphTargetsCount!==wn||zt.numLightProbeGrids!==Ei(w.state.lightProbeGridArray)?at=!0:(zt.outputColorSpace!==St||zt.toneMapping!==Oe)&&(Wt=!0):(at=!0,zt.__version=Y.version);let Zt=zt.currentProgram;(at===!0||Wt===!0)&&(Zt=Wt===!0?ir(Y,H,$,St,Oe):is(Y,H,$),B&&Y.isNodeMaterial&&B.onUpdateProgram(Y,Zt,zt));let Ze=!1,De=!1,cn=!1,oe=Zt.getUniforms(),nn=zt.uniforms;if(Et.useProgram(Zt.program)&&(Ze=!0,De=!0,cn=!0),Y.id!==D&&(D=Y.id,De=!0),Ze||W!==R){Et.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),oe.setValue(V,"projectionMatrix",R.projectionMatrix),oe.setValue(V,"viewMatrix",R.matrixWorldInverse);let En=oe.map.cameraPosition;En!==void 0&&En.setValue(V,Bn.setFromMatrixPosition(R.matrixWorld)),We.logarithmicDepthBuffer&&oe.setValue(V,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&oe.setValue(V,"isOrthographic",R.isOrthographicCamera===!0),W!==R&&(W=R,De=!0,cn=!0)}if(zt.needsLights&&(fn.state.sunShadowMap.length>0&&oe.setValue(V,"sunShadowMap",fn.state.sunShadowMap,ie),fn.state.directionalShadowMap.length>0&&oe.setValue(V,"directionalShadowMap",fn.state.directionalShadowMap,ie),fn.state.spotShadowMap.length>0&&oe.setValue(V,"spotShadowMap",fn.state.spotShadowMap,ie),fn.state.pointShadowMap.length>0&&oe.setValue(V,"pointShadowMap",fn.state.pointShadowMap,ie)),$.isSkinnedMesh){oe.setOptional(V,$,"bindMatrix"),oe.setOptional(V,$,"bindMatrixInverse");let sn=$.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),oe.setValue(V,"boneTexture",sn.boneTexture,ie))}$.isBatchedMesh&&(oe.setOptional(V,$,"batchingTexture"),oe.setValue(V,"batchingTexture",$._matricesTexture,ie),oe.setOptional(V,$,"batchingIdTexture"),oe.setValue(V,"batchingIdTexture",$._indirectTexture,ie),oe.setOptional(V,$,"batchingColorTexture"),$._colorsTexture!==null&&oe.setValue(V,"batchingColorTexture",$._colorsTexture,ie));let zn=j.morphAttributes;if((zn.position!==void 0||zn.normal!==void 0||zn.color!==void 0)&&rt.update($,j,Zt),(De||zt.receiveShadow!==$.receiveShadow)&&(zt.receiveShadow=$.receiveShadow,oe.setValue(V,"receiveShadow",$.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&H.environment!==null&&(nn.envMapIntensity.value=H.environmentIntensity),nn.dfgLUT!==void 0&&(nn.dfgLUT.value=Vy()),De){if(oe.setValue(V,"toneMappingExposure",O.toneMappingExposure),zt.needsLights&&ze(nn,cn),Tt&&Y.fog===!0&&_t.refreshFogUniforms(nn,Tt),_t.refreshMaterialUniforms(nn,Y,wt,Gt,w.state.transmissionRenderTarget[R.id]),zt.needsLights&&zt.numLightProbeGrids>0){let sn=M,En=0;for(let ki of w.state.lightProbeGridArray)ki.texture!==null&&(sn.textures[En]=ki.texture,sn.min[En]=ki.boundingBox.min,sn.max[En]=ki.boundingBox.max,sn.resolution[En]=ki.resolution,En++);for(let ki in sn)sn[ki].length=En;nn.probesSH.value=sn.textures,nn.probesMin.value=sn.min,nn.probesMax.value=sn.max,nn.probesResolution.value=sn.resolution}Dr.upload(V,Cs(zt),nn,ie)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Dr.upload(V,Cs(zt),nn,ie),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&oe.setValue(V,"center",$.center),oe.setValue(V,"modelViewMatrix",$.modelViewMatrix),oe.setValue(V,"normalMatrix",$.normalMatrix),oe.setValue(V,"modelMatrix",$.matrixWorld),Y.uniformsGroups!==void 0){let sn=Y.uniformsGroups;for(let En=0,ki=sn.length;En<ki;En++){let du=sn[En];Vt.update(du,Zt),Vt.bind(du,Zt)}}return Zt}function ze(R,H){R.ambientLightColor.needsUpdate=H,R.lightProbe.needsUpdate=H,R.sunLights.needsUpdate=H,R.sunLightShadows.needsUpdate=H,R.directionalLights.needsUpdate=H,R.directionalLightShadows.needsUpdate=H,R.pointLights.needsUpdate=H,R.pointLightShadows.needsUpdate=H,R.spotLights.needsUpdate=H,R.spotLightShadows.needsUpdate=H,R.rectAreaLights.needsUpdate=H,R.hemisphereLights.needsUpdate=H}function sr(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(R,H,j){let Y=Yt.get(R);Y.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),Yt.get(R.texture).__webglTexture=H,Yt.get(R.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:j,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,H){let j=Yt.get(R);j.__webglFramebuffer=H,j.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(R,H=0,j=0){X=R,C=H,P=j;let Y=null,$=!1,Tt=!1;if(R){let St=Yt.get(R);if(St.__useDefaultFramebuffer!==void 0){Et.bindFramebuffer(V.FRAMEBUFFER,St.__webglFramebuffer),K.copy(R.viewport),ut.copy(R.scissor),Pt=R.scissorTest,Et.viewport(K),Et.scissor(ut),Et.setScissorTest(Pt),D=-1;return}else if(St.__webglFramebuffer===void 0)ie.setupRenderTarget(R);else if(St.__hasExternalTextures)ie.rebindTextures(R,Yt.get(R.texture).__webglTexture,Yt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let ee=R.depthTexture;if(St.__boundDepthTexture!==ee){if(ee!==null&&Yt.has(ee)&&(R.width!==ee.image.width||R.height!==ee.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ie.setupDepthRenderbuffer(R)}}let Dt=R.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(Tt=!0);let Ct=Yt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Ct[H])?Y=Ct[H][j]:Y=Ct[H],$=!0):R.samples>0&&ie.useMultisampledRTT(R)===!1?Y=Yt.get(R).__webglMultisampledFramebuffer:Array.isArray(Ct)?Y=Ct[j]:Y=Ct,K.copy(R.viewport),ut.copy(R.scissor),Pt=R.scissorTest}else K.copy(Mt).multiplyScalar(wt).floor(),ut.copy(be).multiplyScalar(wt).floor(),Pt=Xt;if(j!==0&&(Y=G),Et.bindFramebuffer(V.FRAMEBUFFER,Y)&&Et.drawBuffers(R,Y),Et.viewport(K),Et.scissor(ut),Et.setScissorTest(Pt),$){let St=Yt.get(R.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+H,St.__webglTexture,j)}else if(Tt){let St=H;for(let Dt=0;Dt<R.textures.length;Dt++){let Ct=Yt.get(R.textures[Dt]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+Dt,Ct.__webglTexture,j,St)}}else if(R!==null&&j!==0){let St=Yt.get(R.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,St.__webglTexture,j)}D=-1};function Is(R){let H=Yt.get(R);return(H.__readFormat!==R.format||H.__readType!==R.type)&&(H.__readFormat=R.format,H.__readType=R.type,H.__formatReadable=We.textureFormatReadable(R.format),H.__typeReadable=We.textureTypeReadable(R.type)),H}this.readRenderTargetPixels=function(R,H,j,Y,$,Tt,kt,St=0){if(!(R&&R.isWebGLRenderTarget)){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=Yt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&kt!==void 0&&(Dt=Dt[kt],Array.isArray(Dt)&&(Dt=Dt[0])),Dt){Et.bindFramebuffer(V.FRAMEBUFFER,Dt);try{let Ct=R.textures[St],ee=Ct.format,_e=Ct.type;R.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+St);let Ft=Is(Ct);if(Ft.__formatReadable===!1){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ft.__typeReadable===!1){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=R.width-Y&&j>=0&&j<=R.height-$&&V.readPixels(H,j,Y,$,nt.convert(ee),nt.convert(_e),Tt)}finally{let Ct=X!==null?Yt.get(X).__webglFramebuffer:null;Et.bindFramebuffer(V.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(R,H,j,Y,$,Tt,kt,St=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=Yt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&kt!==void 0&&(Dt=Dt[kt],Array.isArray(Dt)&&(Dt=Dt[0])),Dt)if(H>=0&&H<=R.width-Y&&j>=0&&j<=R.height-$){Et.bindFramebuffer(V.FRAMEBUFFER,Dt);let Ct=R.textures[St],ee=Ct.format,_e=Ct.type;R.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+St);let Ft=Is(Ct);if(Ft.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ft.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let me=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,me),V.bufferData(V.PIXEL_PACK_BUFFER,Tt.byteLength,V.STREAM_READ),V.readPixels(H,j,Y,$,nt.convert(ee),nt.convert(_e),0),V.bindBuffer(V.PIXEL_PACK_BUFFER,null);let Qe=X!==null?Yt.get(X).__webglFramebuffer:null;Et.bindFramebuffer(V.FRAMEBUFFER,Qe);let Oe=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await bd(V,Oe,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,me),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,Tt),V.bindBuffer(V.PIXEL_PACK_BUFFER,null),V.deleteBuffer(me),V.deleteSync(Oe),Tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,H=null,j=0){let Y=Math.pow(2,-j),$=Math.floor(R.image.width*Y),Tt=Math.floor(R.image.height*Y),kt=H!==null?H.x:0,St=H!==null?H.y:0;ie.setTexture2D(R,0),V.copyTexSubImage2D(V.TEXTURE_2D,j,0,0,kt,St,$,Tt),Et.unbindTexture()},this.copyTextureToTexture=function(R,H,j=null,Y=null,$=0,Tt=0){let kt,St,Dt,Ct,ee,_e,Ft,me,Qe,Oe=R.isCompressedTexture?R.mipmaps[Tt]:R.image;if(j!==null)kt=j.max.x-j.min.x,St=j.max.y-j.min.y,Dt=j.isBox3?j.max.z-j.min.z:1,Ct=j.min.x,ee=j.min.y,_e=j.isBox3?j.min.z:0;else{let oe=Math.pow(2,-$);kt=Math.floor(Oe.width*oe),St=Math.floor(Oe.height*oe),R.isDataArrayTexture?Dt=Oe.depth:R.isData3DTexture?Dt=Math.floor(Oe.depth*oe):Dt=1,Ct=0,ee=0,_e=0}Y!==null?(Ft=Y.x,me=Y.y,Qe=Y.z):(Ft=0,me=0,Qe=0);let Le=nt.convert(H.format),wn=nt.convert(H.type),zt;H.isData3DTexture?(ie.setTexture3D(H,0),zt=V.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(ie.setTexture2DArray(H,0),zt=V.TEXTURE_2D_ARRAY):(ie.setTexture2D(H,0),zt=V.TEXTURE_2D),Et.activeTexture(V.TEXTURE0),Et.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,H.flipY),Et.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),Et.pixelStorei(V.UNPACK_ALIGNMENT,H.unpackAlignment);let fn=Et.getParameter(V.UNPACK_ROW_LENGTH),at=Et.getParameter(V.UNPACK_IMAGE_HEIGHT),Wt=Et.getParameter(V.UNPACK_SKIP_PIXELS),Zt=Et.getParameter(V.UNPACK_SKIP_ROWS),Ze=Et.getParameter(V.UNPACK_SKIP_IMAGES);Et.pixelStorei(V.UNPACK_ROW_LENGTH,Oe.width),Et.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Oe.height),Et.pixelStorei(V.UNPACK_SKIP_PIXELS,Ct),Et.pixelStorei(V.UNPACK_SKIP_ROWS,ee),Et.pixelStorei(V.UNPACK_SKIP_IMAGES,_e);let De=R.isDataArrayTexture||R.isData3DTexture,cn=H.isDataArrayTexture||H.isData3DTexture;if(R.isDepthTexture){let oe=Yt.get(R),nn=Yt.get(H),zn=Yt.get(oe.__renderTarget),sn=Yt.get(nn.__renderTarget);Et.bindFramebuffer(V.READ_FRAMEBUFFER,zn.__webglFramebuffer),Et.bindFramebuffer(V.DRAW_FRAMEBUFFER,sn.__webglFramebuffer);for(let En=0;En<Dt;En++)De&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Yt.get(R).__webglTexture,$,_e+En),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Yt.get(H).__webglTexture,Tt,Qe+En)),V.blitFramebuffer(Ct,ee,Ct+kt,ee+St,Ft,me,Ft+kt,me+St,V.DEPTH_BUFFER_BIT,V.NEAREST);Et.bindFramebuffer(V.READ_FRAMEBUFFER,null),Et.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if($!==0||R.isRenderTargetTexture||Yt.has(R)){let oe=Yt.get(R),nn=Yt.get(H);Et.bindFramebuffer(V.READ_FRAMEBUFFER,E),Et.bindFramebuffer(V.DRAW_FRAMEBUFFER,U);for(let zn=0;zn<Dt;zn++)De?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,oe.__webglTexture,$,_e+zn):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,oe.__webglTexture,$),cn?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,nn.__webglTexture,Tt,Qe+zn):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,nn.__webglTexture,Tt),$!==0?V.blitFramebuffer(Ct,ee,Ct+kt,ee+St,Ft,me,Ft+kt,me+St,V.COLOR_BUFFER_BIT,V.NEAREST):cn?V.copyTexSubImage3D(zt,Tt,Ft,me,Qe+zn,Ct,ee,kt,St):V.copyTexSubImage2D(zt,Tt,Ft,me,Ct,ee,kt,St);Et.bindFramebuffer(V.READ_FRAMEBUFFER,null),Et.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else cn?R.isDataTexture||R.isData3DTexture?V.texSubImage3D(zt,Tt,Ft,me,Qe,kt,St,Dt,Le,wn,Oe.data):H.isCompressedArrayTexture?V.compressedTexSubImage3D(zt,Tt,Ft,me,Qe,kt,St,Dt,Le,Oe.data):V.texSubImage3D(zt,Tt,Ft,me,Qe,kt,St,Dt,Le,wn,Oe):R.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,Tt,Ft,me,kt,St,Le,wn,Oe.data):R.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,Tt,Ft,me,Oe.width,Oe.height,Le,Oe.data):V.texSubImage2D(V.TEXTURE_2D,Tt,Ft,me,kt,St,Le,wn,Oe);Et.pixelStorei(V.UNPACK_ROW_LENGTH,fn),Et.pixelStorei(V.UNPACK_IMAGE_HEIGHT,at),Et.pixelStorei(V.UNPACK_SKIP_PIXELS,Wt),Et.pixelStorei(V.UNPACK_SKIP_ROWS,Zt),Et.pixelStorei(V.UNPACK_SKIP_IMAGES,Ze),Tt===0&&H.generateMipmaps===!0&&H.mipmapsAutoUpdate===!0&&V.generateMipmap(zt),Et.unbindTexture()},this.initRenderTarget=function(R){Yt.get(R).__webglFramebuffer===void 0&&ie.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?ie.setTextureCube(R,0):R.isData3DTexture?ie.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?ie.setTexture2DArray(R,0):ie.setTexture2D(R,0),Et.unbindTexture()},this.resetState=function(){C=0,P=0,X=null,Et.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Se._getDrawingBufferColorSpace(t),e.unpackColorSpace=Se._getUnpackColorSpace()}};var S={renderer:null,scene:null,camera:null,H:null,time:0,dt:0,frame:0,params:new URLSearchParams(typeof location<"u"?location.search:""),updaters:[],state:null};function Ys(i){return S.updaters.push(i),i}var re=(i,t=0,e=1)=>i<t?t:i>e?e:i,Ht=(i,t,e)=>i+(t-i)*e,Ur=(i,t,e)=>{let n=re((e-i)/(t-i));return n*n*(3-2*n)},Jt=(i,t,e,n)=>Ht(i,t,1-Math.exp(-e*n)),Wy=Math.PI*2;function de(i){let t=i>>>0;return function(){t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Xe={lin:i=>i,inOut:i=>i*i*(3-2*i),out:i=>1-(1-i)*(1-i),out3:i=>1-Math.pow(1-i,3),in:i=>i*i,back:i=>1+(1.70158+1)*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2),bounce:i=>i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375,elastic:i=>i===0||i===1?i:Math.pow(2,-9*i)*Math.sin((i*8-.75)*(Wy/3))+1};function $l(i,t,e){let n=Math.imul(i,374761393)^Math.imul(t,668265263)^Math.imul(e,1442695041);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296}function vs(i,t,e=1,n=0){let s=Math.floor(i),r=Math.floor(t),o=i-s,a=t-r,l=s+1,c=r+1;n&&(s=(s%n+n)%n,l=(l%n+n)%n,r=(r%n+n)%n,c=(c%n+n)%n);let h=o*o*(3-2*o),u=a*a*(3-2*a),d=$l(s,r,e),f=$l(l,r,e),p=$l(s,c,e),x=$l(l,c,e);return d+(f-d)*h+(p-d)*u+(d-f-p+x)*h*u}function ji(i,t,e,n=1){let s=Math.floor(e),r=e-s,o=r*r*(3-2*r);return Ht(vs(i+s*31.7,t+s*17.3,n),vs(i+(s+1)*31.7,t+(s+1)*17.3,n),o)}function he(i,t=i){let e=document.createElement("canvas");return e.width=i,e.height=t,e.getContext("2d",{willReadFrequently:!0}),e}function Xy(i,t,e){let n=he(i,t),s=n.getContext("2d"),r=s.createImageData(i,t);for(let o=0;o<i*t;o++){let a=e()*255|0;r.data[o*4]=r.data[o*4+1]=r.data[o*4+2]=a,r.data[o*4+3]=255}return s.putImageData(r,0,0),n}function qy(i,t,e,n,s,r,o=1,a="source-over"){n=Math.max(1,Math.round(n)),s=Math.max(1,Math.round(s));let l=Xy(n,s,r);i.save(),i.globalAlpha=o,i.globalCompositeOperation=a,i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high";let c=i.createPattern(l,"repeat"),h=t/n,u=e/s;c.setTransform(new DOMMatrix().scale(h,u)),i.fillStyle=c,i.fillRect(0,0,t,e),i.restore()}function Jn(i,{seed:t=1,baseX:e=4,baseY:n=4,oct:s=5,gain:r=.5,w:o=i,h:a=i}={}){let l=de(t),c=he(o,a),h=c.getContext("2d");h.fillStyle="#808080",h.fillRect(0,0,o,a);let u=1,d=e,f=n;for(let p=0;p<s&&(qy(h,o,a,d,f,l,p===0?1:u,"source-over"),u*=r,d*=2,f*=2,!(d>o/2&&f>a/2));p++)d=Math.min(d,o),f=Math.min(f,a);return c}function Mi(i,t=2){let e=i.width,n=i.height,s=i.getContext("2d").getImageData(0,0,e,n).data,r=he(e,n),o=r.getContext("2d"),a=o.createImageData(e,n),l=a.data;for(let c=0;c<n;c++){let h=(c-1+n)%n*e,u=(c+1)%n*e,d=c*e;for(let f=0;f<e;f++){let p=(f-1+e)%e,x=(f+1)%e,g=(s[(d+x)*4]-s[(d+p)*4])/255,m=(s[(u+f)*4]-s[(h+f)*4])/255,_=-g*t,v=m*t,M=1/Math.sqrt(_*_+v*v+1),b=(d+f)*4;l[b]=(_*M*.5+.5)*255,l[b+1]=(v*M*.5+.5)*255,l[b+2]=(M*.5+.5)*255,l[b+3]=255}}return o.putImageData(a,0,0),r}function Yh(i,t,e,n=1){let s=i.width,r=i.height,o=he(s,r),a=o.getContext("2d"),l=i.getContext("2d").getImageData(0,0,s,r),c=l.data;for(let h=0;h<c.length;h+=4){let u=t+(e-t)*Math.pow(c[h]/255,n);c[h]=c[h+1]=c[h+2]=u}return a.putImageData(l,0,0),o}var a0=4;function l0(i){a0=Math.min(8,i||1)}function Ot(i,{srgb:t=!1,repeat:e=null,aniso:n=!0,mip:s=!0}={}){let r=new po(i);return r.colorSpace=t?hn:vi,e&&(r.wrapS=r.wrapT=Ri,r.repeat.set(e[0],e[1])),n&&(r.anisotropy=a0),s||(r.generateMipmaps=!1,r.minFilter=xn),r.needsUpdate=!0,r}var Dn=(i,t,e,n=1)=>`rgba(${i|0},${t|0},${e|0},${n})`;function Go(i,{seed:t=3,base:e=[196,150,100],dark:n=[140,96,56],planks:s=0,knots:r=2,grain:o=1,plankJitter:a=.1}={}){let l=de(t),c=i,h=i,u=he(c,h),d=u.getContext("2d"),f=he(c,h),p=f.getContext("2d");d.fillStyle=Dn(...e),d.fillRect(0,0,c,h),p.fillStyle="#808080",p.fillRect(0,0,c,h);let x=Math.max(1,s);for(let v=0;v<x;v++){let M=v/x*h,b=h/x;d.save(),d.beginPath(),d.rect(0,M,c,b),d.clip();let w=(l()-.5)*2*a;d.fillStyle=w>0?Dn(255,240,215,w):Dn(60,35,10,-w),d.fillRect(0,M,c,b);let y=Math.round(46*o*(b/256)+14),T=l()*1e3;for(let O=0;O<y;O++){let N=M+l()*b,B=2+l()*5,G=.004+l()*.006,E=l()*6.28,U=.05+l()*.16,C=.6+l()*1.8;d.strokeStyle=Dn(...n,U),d.lineWidth=C,p.strokeStyle=`rgba(40,40,40,${U*.9})`,p.lineWidth=C,d.beginPath(),p.beginPath();for(let P=-8;P<=c+8;P+=8){let X=N+Math.sin((P+T)*G+E)*B+Math.sin((P+T)*G*3.1+E*2)*B*.25;P===-8?(d.moveTo(P,X),p.moveTo(P,X)):(d.lineTo(P,X),p.lineTo(P,X))}d.stroke(),p.stroke()}let F=x>1?l()<.35?1:0:r;for(let O=0;O<F;O++){let N=l()*c,B=M+b*(.25+l()*.5),G=5+l()*9;for(let U=7;U>=0;U--){let C=G*(.25+U*.42);d.strokeStyle=Dn(...n,.34-U*.035),d.lineWidth=1.4,d.beginPath(),d.ellipse(N,B,C*2.3,C,0,0,6.3),d.stroke()}let E=d.createRadialGradient(N,B,0,N,B,G);E.addColorStop(0,Dn(n[0]*.45,n[1]*.4,n[2]*.35,.9)),E.addColorStop(1,Dn(...n,0)),d.fillStyle=E,d.beginPath(),d.ellipse(N,B,G*1.5,G,0,0,6.3),d.fill()}if(d.restore(),x>1){d.fillStyle=Dn(35,22,12,.75),d.fillRect(0,M,c,1.5),p.fillStyle="rgba(0,0,0,0.9)",p.fillRect(0,M,c,2);let O=l()*c;d.fillRect(O,M,1.5,b),p.fillRect(O,M,2,b)}}let g=Jn(i,{seed:t+5,baseX:3,baseY:96,oct:3});d.globalAlpha=.16,d.globalCompositeOperation="multiply",d.drawImage(g,0,0),d.globalCompositeOperation="source-over";let m=Jn(i,{seed:t+9,baseX:2,baseY:5,oct:3});d.globalAlpha=.14,d.globalCompositeOperation="overlay",d.drawImage(m,0,0),d.globalAlpha=1,d.globalCompositeOperation="source-over",p.globalAlpha=.25,p.drawImage(g,0,0),p.globalAlpha=1;let _=Yh(g,150,215);return{map:u,normal:Mi(f,1.6),rough:_}}function Zh(i,{seed:t=11,dir:e="x",lo:n=70,hi:s=120}={}){let r=e==="x"?{baseX:2,baseY:i/2}:{baseX:i/2,baseY:2},o=Jn(i,{seed:t,...r,oct:2,gain:.6}),a=o.getContext("2d"),l=de(t+1);for(let c=0;c<7;c++){let h=l()*i,u=l()*i,d=i*(.03+l()*.07),f=a.createRadialGradient(h,u,0,h,u,d);f.addColorStop(0,"rgba(255,255,255,0.12)"),f.addColorStop(1,"rgba(255,255,255,0)"),a.fillStyle=f,a.beginPath(),a.ellipse(h,u,d*1.4,d,l()*3,0,6.3),a.fill()}return{rough:Yh(o,n,s),normal:Mi(o,.55)}}function c0(i,{seed:t=21,cols:e=4,rows:n=8,grout:s=5,base:r=[236,232,222],brick:o=!0}={}){let a=de(t),l=i,c=i,h=he(l,c),u=h.getContext("2d"),d=he(l,c),f=d.getContext("2d");u.fillStyle=Dn(168,162,152),u.fillRect(0,0,l,c),f.fillStyle="#303030",f.fillRect(0,0,l,c);let p=l/e,x=c/n;for(let b=0;b<n;b++)for(let w=-1;w<e;w++){let y=o&&b%2?p/2:0,T=w*p+y+s/2,F=b*x+s/2,O=p-s,N=x-s,B=(a()-.5)*10;u.fillStyle=Dn(r[0]+B,r[1]+B,r[2]+B*.8),qh(u,T,F,O,N,3),u.fill();let G=5;for(let E=0;E<G;E++){let U=120+E/(G-1)*110;f.fillStyle=Dn(U,U,U),qh(f,T+E,F+E,O-E*2,N-E*2,3),f.fill()}}let g=Jn(i,{seed:t+2,baseX:6,baseY:6,oct:3});f.globalAlpha=.07,f.drawImage(g,0,0),f.globalAlpha=1,u.globalAlpha=.05,u.globalCompositeOperation="multiply",u.drawImage(g,0,0),u.globalAlpha=1,u.globalCompositeOperation="source-over";let m=he(l,c),_=m.getContext("2d");_.drawImage(d,0,0);let v=_.getImageData(0,0,l,c),M=v.data;for(let b=0;b<M.length;b+=4){let w=M[b]>100?52+(M[b]>200?0:20):215;M[b]=M[b+1]=M[b+2]=w}return _.putImageData(v,0,0),{map:h,normal:Mi(d,2.2),rough:m}}function qh(i,t,e,n,s,r){i.beginPath(),i.moveTo(t+r,e),i.lineTo(t+n-r,e),i.quadraticCurveTo(t+n,e,t+n,e+r),i.lineTo(t+n,e+s-r),i.quadraticCurveTo(t+n,e+s,t+n-r,e+s),i.lineTo(t+r,e+s),i.quadraticCurveTo(t,e+s,t,e+s-r),i.lineTo(t,e+r),i.quadraticCurveTo(t,e,t+r,e),i.closePath()}var Kl=qh;function Ms(i,{seed:t=31,base:e=[236,226,208],threads:n=64,stripe:s=null,check:r=null}={}){let o=i,a=i,l=he(o,a),c=l.getContext("2d"),h=he(o,a),u=h.getContext("2d");if(c.fillStyle=Dn(...e),c.fillRect(0,0,o,a),s){let p=o/n;c.fillStyle=Dn(...s.color,s.alpha??.85);for(let x=0;x<n;x+=s.every)c.fillRect(x*p,0,p*s.width,a)}if(r){let p=o/n;c.fillStyle=Dn(...r.color,.45);for(let x=0;x<n;x+=r.every)c.fillRect(x*p,0,p*r.width,a),c.fillRect(0,x*p,o,p*r.width)}let d=o/n;u.fillStyle="#000",u.fillRect(0,0,o,a);for(let p=0;p<n;p++)for(let x=0;x<n;x++){let g=(x+p)%2===0,m=x*d,_=p*d,v=g?u.createLinearGradient(m,_,m+d,_):u.createLinearGradient(m,_,m,_+d);v.addColorStop(0,"#404040"),v.addColorStop(.5,g?"#f0f0f0":"#b0b0b0"),v.addColorStop(1,"#404040"),u.fillStyle=v,u.fillRect(m,_,d,d)}let f=Jn(i,{seed:t,baseX:24,baseY:24,oct:3});return c.globalAlpha=.1,c.globalCompositeOperation="multiply",c.drawImage(f,0,0),c.globalAlpha=.22,c.drawImage(h,0,0),c.globalAlpha=1,c.globalCompositeOperation="source-over",{map:l,normal:Mi(h,1.3)}}function Qi(i,{seed:t=41,base:e=8,oct:n=4,strength:s=2,baseY:r=null}={}){return Mi(Jn(i,{seed:t,baseX:e,baseY:r??e,oct:n}),s)}function Zs(i,{seed:t=51,base:e=[200,170,120],spots:n=300,spot:s=[120,90,50],rmin:r=.5,rmax:o=2.2,alpha:a=.5,mottle:l=.25}={}){let c=de(t),h=he(i),u=h.getContext("2d");u.fillStyle=Dn(...e),u.fillRect(0,0,i,i);let d=Jn(i,{seed:t+1,baseX:5,baseY:5,oct:4});u.globalAlpha=l,u.globalCompositeOperation="overlay",u.drawImage(d,0,0),u.globalAlpha=1,u.globalCompositeOperation="source-over";for(let f=0;f<n;f++){u.fillStyle=Dn(...s,a*(.4+c()*.6));let p=r+c()*(o-r);u.beginPath(),u.ellipse(c()*i,c()*i,p*(.7+c()*.8),p,c()*3,0,6.3),u.fill()}return h}function h0(i=128,t=0,e="255,255,255",n=1){let s=he(i),r=s.getContext("2d"),o=r.createRadialGradient(i/2,i/2,i*.5*t,i/2,i/2,i/2);return o.addColorStop(0,`rgba(${e},1)`),o.addColorStop(.5,`rgba(${e},${Math.pow(.42,n)})`),o.addColorStop(1,`rgba(${e},0)`),r.fillStyle=o,r.fillRect(0,0,i,i),s}function u0(i=128,t=61){let e=he(i),n=e.getContext("2d"),s=de(t);for(let r=0;r<9;r++){let o=i*(.32+s()*.36),a=i*(.32+s()*.36),l=i*(.16+s()*.2),c=n.createRadialGradient(o,a,0,o,a,l);c.addColorStop(0,"rgba(255,255,255,0.20)"),c.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=c,n.fillRect(0,0,i,i)}return e}function d0(i=128){let t=he(i),e=t.getContext("2d"),n=i/2,s=e.createRadialGradient(n,n,0,n,n,n);s.addColorStop(0,"rgba(255,255,255,1)"),s.addColorStop(.18,"rgba(255,250,220,0.55)"),s.addColorStop(1,"rgba(255,240,200,0)"),e.fillStyle=s,e.fillRect(0,0,i,i),e.globalCompositeOperation="lighter";for(let r of[0,Math.PI/2]){e.save(),e.translate(n,n),e.rotate(r);let o=e.createLinearGradient(-n,0,n,0);o.addColorStop(0,"rgba(255,255,255,0)"),o.addColorStop(.5,"rgba(255,255,255,0.95)"),o.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=o,e.beginPath(),e.ellipse(0,0,n,n*.045,0,0,6.3),e.fill(),e.restore()}return t}function f0(i=128,t=1){let e=he(i),n=e.getContext("2d"),s=i/2,r=n.createRadialGradient(s,s,s*.15,s,s,s);return r.addColorStop(0,"rgba(0,0,0,0.9)"),r.addColorStop(.55,"rgba(0,0,0,0.42)"),r.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=r,n.fillRect(0,0,i,i),e}var q={},ct={};function p0(){let i=Ge,t=He;ct.dot=Ot(h0(128),{srgb:!0}),ct.steam=Ot(u0(128),{srgb:!0}),ct.sparkle=Ot(d0(128),{srgb:!0}),ct.blob=Ot(f0(128),{srgb:!0}),ct.fineNormal=Ot(Qi(256,{seed:5,base:24,oct:3,strength:1.2}),{repeat:[1,1]}),ct.waterNormal=Ot(Qi(256,{seed:8,base:5,oct:4,strength:2.4}),{repeat:[1,1]});let e=Zh(512,{seed:11,dir:"x"});ct.brushX_r=Ot(e.rough,{repeat:[1,1]}),ct.brushX_n=Ot(e.normal,{repeat:[1,1]});let n=Zh(512,{seed:13,dir:"y"});ct.brushY_r=Ot(n.rough,{repeat:[1,1]}),ct.brushY_n=Ot(n.normal,{repeat:[1,1]}),q.steel=new i({color:12172479,metalness:1,roughness:1,roughnessMap:ct.brushX_r,normalMap:ct.brushX_n,normalScale:new xt(.35,.35),anisotropy:.55,anisotropyRotation:0,envMapIntensity:1.15}),q.steelV=new i({color:12172479,metalness:1,roughness:1,roughnessMap:ct.brushY_r,normalMap:ct.brushY_n,normalScale:new xt(.35,.35),anisotropy:.55,anisotropyRotation:Math.PI/2,envMapIntensity:1.15}),q.steelTurned=new i({color:11119792,metalness:1,roughness:1,roughnessMap:ct.brushX_r,normalMap:ct.brushX_n,normalScale:new xt(.3,.3),anisotropy:.6,anisotropyRotation:Math.PI/2,envMapIntensity:1.15}),q.chrome=new t({color:15132906,metalness:1,roughness:.07,envMapIntensity:1.2}),q.steelPolished=new t({color:14474975,metalness:1,roughness:.16,envMapIntensity:1.15}),q.steelSink=new i({color:13225167,metalness:1,roughness:1,roughnessMap:ct.brushX_r,normalMap:ct.brushX_n,normalScale:new xt(.3,.3),envMapIntensity:1}),q.brass=new t({color:12162906,metalness:1,roughness:.42}),q.castIron=new t({color:1776412,metalness:.3,roughness:.62,normalMap:ct.fineNormal,normalScale:new xt(.5,.5)}),q.blackEnamel=new i({color:1052690,metalness:0,roughness:.28,clearcoat:.6,clearcoatRoughness:.2}),q.hobGlass=new i({color:789518,metalness:0,roughness:.34,clearcoat:.12,clearcoatRoughness:.25,envMapIntensity:.7,specularIntensity:.4}),q.blackPlastic=new t({color:1710619,metalness:0,roughness:.48}),q.rubber=new t({color:2763307,metalness:0,roughness:.85}),q.aluminium=new t({color:13027529,metalness:1,roughness:.5}),q.burnerBody=new t({color:7303539,metalness:.9,roughness:.62});let s=Ot(Qi(256,{seed:71,base:6,oct:3,strength:.25}),{repeat:[2,1]});q.enamel=new i({color:12728875,metalness:0,roughness:.2,clearcoat:.9,clearcoatRoughness:.06,normalMap:s,normalScale:new xt(.2,.2),envMapIntensity:1.1}),q.enamelInner=new i({color:15722192,metalness:0,roughness:.3,clearcoat:.5,clearcoatRoughness:.15,normalMap:s,normalScale:new xt(.15,.15),side:Ce}),q.glass=new i({color:16777215,metalness:0,roughness:.04,transparent:!0,opacity:.16,envMapIntensity:1.6,clearcoat:1,clearcoatRoughness:.03,depthWrite:!1,side:Ce}),q.glassThick=new i({color:15267058,metalness:0,roughness:.05,transparent:!0,opacity:.3,envMapIntensity:1.5,depthWrite:!1});let r=Go(1024,{seed:3,base:[186,142,96],dark:[120,82,48],planks:8,plankJitter:.1});ct.floor=Ot(r.map,{srgb:!0,repeat:[3,3]}),ct.floorN=Ot(r.normal,{repeat:[3,3]}),ct.floorR=Ot(r.rough,{repeat:[3,3]}),q.floor=new t({map:ct.floor,normalMap:ct.floorN,normalScale:new xt(.6,.6),roughnessMap:ct.floorR,roughness:.62,metalness:0});let o=Go(1024,{seed:7,base:[214,172,118],dark:[150,104,60],knots:3,grain:1.2});ct.board=Ot(o.map,{srgb:!0}),ct.boardN=Ot(o.normal),ct.boardR=Ot(o.rough),q.board=new t({map:ct.board,normalMap:ct.boardN,normalScale:new xt(.7,.7),roughnessMap:ct.boardR,roughness:.95,metalness:0});let a=Go(512,{seed:17,base:[176,130,86],dark:[118,80,46],knots:1,grain:.9});ct.cab=Ot(a.map,{srgb:!0,repeat:[1,1]}),ct.cabN=Ot(a.normal,{repeat:[1,1]}),q.cabinet=new t({map:ct.cab,normalMap:ct.cabN,normalScale:new xt(.5,.5),roughness:.5,metalness:0});let l=Go(1024,{seed:23,base:[200,152,100],dark:[132,90,50],knots:4,grain:1.3});ct.table=Ot(l.map,{srgb:!0}),ct.tableN=Ot(l.normal),q.table=new i({map:ct.table,normalMap:ct.tableN,normalScale:new xt(.5,.5),roughness:.42,metalness:0,clearcoat:.25,clearcoatRoughness:.35}),q.woodDark=new t({map:ct.cab,normalMap:ct.cabN,color:10123872,roughness:.6}),q.woodLight=new t({map:ct.board,normalMap:ct.boardN,normalScale:new xt(.4,.4),color:15917768,roughness:.7});let c=Zs(512,{seed:33,base:[182,171,154],spots:1500,spot:[112,102,88],rmin:.4,rmax:1.6,alpha:.5,mottle:.12});ct.counter=Ot(c,{srgb:!0,repeat:[4,1]}),q.counter=new i({map:ct.counter,roughness:.28,metalness:0,clearcoat:.3,clearcoatRoughness:.25,normalMap:ct.fineNormal,normalScale:new xt(.06,.06)});let h=c0(512,{seed:21,cols:4,rows:8});ct.tile=Ot(h.map,{srgb:!0,repeat:[6,1.6]}),ct.tileN=Ot(h.normal,{repeat:[6,1.6]}),ct.tileR=Ot(h.rough,{repeat:[6,1.6]}),q.tile=new i({map:ct.tile,normalMap:ct.tileN,normalScale:new xt(.9,.9),roughnessMap:ct.tileR,roughness:1,metalness:0,clearcoat:.25,clearcoatRoughness:.15});let u=Ot(Qi(256,{seed:44,base:40,oct:2,strength:.6}),{repeat:[6,3]});q.wall=new t({color:15129803,roughness:.93,metalness:0,normalMap:u,normalScale:new xt(.25,.25)}),q.ceiling=new t({color:15525852,roughness:.95,metalness:0}),q.whitePaint=new i({color:16052974,roughness:.35,metalness:0,clearcoat:.3,clearcoatRoughness:.3}),q.fridge=new i({color:15659248,roughness:.32,metalness:0,clearcoat:.7,clearcoatRoughness:.18,normalMap:ct.fineNormal,normalScale:new xt(.03,.03)}),q.fridgeInner=new t({color:16054264,roughness:.5,metalness:0}),q.plasticWhite=new t({color:15921386,roughness:.42,metalness:0}),q.ceramic=new i({color:16250092,roughness:.18,metalness:0,clearcoat:.8,clearcoatRoughness:.08}),q.ceramicBlue=new i({color:9417679,roughness:.2,metalness:0,clearcoat:.8,clearcoatRoughness:.08}),q.ceramicYellow=new i({color:15912811,roughness:.22,metalness:0,clearcoat:.8,clearcoatRoughness:.1});let d=Ms(256,{seed:31,base:[240,232,216],threads:48});ct.linen=Ot(d.map,{srgb:!0,repeat:[6,6]}),ct.linenN=Ot(d.normal,{repeat:[6,6]}),q.linen=new i({map:ct.linen,normalMap:ct.linenN,normalScale:new xt(.6,.6),roughness:.92,metalness:0,sheen:.4,sheenRoughness:.6,sheenColor:new Ut(16774368),side:Ce});let f=Ms(256,{seed:37,base:[246,244,238],threads:48,check:{color:[70,120,190],every:8,width:2}});return ct.towel=Ot(f.map,{srgb:!0,repeat:[2,2]}),ct.towelN=Ot(f.normal,{repeat:[2,2]}),q.towel=new i({map:ct.towel,normalMap:ct.towelN,normalScale:new xt(.8,.8),roughness:.95,metalness:0,sheen:.5,sheenRoughness:.5,side:Ce}),q.fabricSofa=new i({map:ct.linen,normalMap:ct.linenN,normalScale:new xt(.9,.9),color:12175028,roughness:.95,sheen:.5,sheenRoughness:.5}),q.blanket=new i({map:ct.linen,normalMap:ct.linenN,normalScale:new xt(1,1),color:15976880,roughness:1,sheen:.9,sheenRoughness:.4,sheenColor:new Ut(16771288),side:Ce}),q.shadowBlob=new Ue({map:ct.blob,transparent:!0,opacity:.5,depthWrite:!1,color:0}),q.sponge=new t({color:15913290,roughness:.95,normalMap:Ot(Qi(128,{seed:81,base:40,oct:2,strength:3}),{repeat:[2,2]})}),q.spongeGreen=new t({color:5216858,roughness:1}),q.paper=new t({color:16513264,roughness:.9,side:Ce}),q}var Jh=new Map;function fe(i,t=.82,e={}){let n=i+":"+t+JSON.stringify(e);if(!Jh.has(n)){let s=new Ge({color:i,roughness:t,metalness:0,sheen:.35,sheenRoughness:.7,...e});s.userData.keep=!0,Jh.set(n,s)}return Jh.get(n)}function Or(i,t,e,n=.01,s=3){n=Math.min(n,i/2,t/2,e/2);let r=s*2+1,o=new yi(1,1,1,r,r,r).toNonIndexed(),a=o.attributes.position.array,l=o.attributes.normal.array,c=o.attributes.uv.array,h=i/2-n,u=t/2-n,d=e/2-n,f=.5/r,p=a.length/6;for(let x=0,g=0;x<a.length;x+=3,g+=2){let m=a[x],_=a[x+1],v=a[x+2],M=m-Math.sign(m)*f,b=_-Math.sign(_)*f,w=v-Math.sign(v)*f;Math.abs(m)<=f+1e-6&&(M=0),Math.abs(_)<=f+1e-6&&(b=0),Math.abs(v)<=f+1e-6&&(w=0);let y=Math.hypot(M,b,w)||1;M/=y,b/=y,w/=y;let T=h*Math.sign(m)+M*n,F=u*Math.sign(_)+b*n,O=d*Math.sign(v)+w*n;a[x]=T,a[x+1]=F,a[x+2]=O,l[x]=M,l[x+1]=b,l[x+2]=w;let N=Math.floor(x/p);N<2?(c[g]=O/e+.5,c[g+1]=F/t+.5):N<4?(c[g]=T/i+.5,c[g+1]=O/e+.5):(c[g]=T/i+.5,c[g+1]=F/t+.5)}return o.computeBoundingSphere(),o.computeBoundingBox(),o}function Lt(i,t,e,n,s=.008,r=2){let o=new tt(Or(i,t,e,s,r),n);return o.castShadow=!0,o.receiveShadow=!0,o}function an(i,t,e,n){let s=new tt(new yi(i,t,e),n);return s.castShadow=!0,s.receiveShadow=!0,s}function Ui(i,t=48,{smooth:e=0,closed:n=!1}={}){let s=i.map(([o,a])=>new xt(Math.max(o,1e-5),a));if(e>0){s=new Ar(s).getPoints(s.length*e);for(let a of s)a.x=Math.max(a.x,1e-5)}return new _o(s,t)}function ne(i,t,e=48,n={}){let s=new tt(Ui(i,e,n),t);return s.castShadow=!0,s.receiveShadow=!0,s}function Ql({rx:i=.03,ry:t=.02,rz:e=.025,noise:n=.15,freq:s=2.2,seed:r=1,wseg:o=20,hseg:a=14,shape:l=null}={}){let c=new Re(1,o,a),h=c.attributes.position,u=new I;for(let d=0;d<h.count;d++){u.fromBufferAttribute(h,d);let f=1+(ji(u.x*s+5,u.y*s+9,u.z*s+3,r)-.5)*2*n;l&&(f*=l(u)),h.setXYZ(d,u.x*i*f,u.y*t*f,u.z*e*f)}return c.computeVertexNormals(),Yy(c,o,a),c}function Yy(i,t,e){let n=i.attributes.normal;for(let s=0;s<=e;s++){let r=s*(t+1),o=r+t,a=n.getX(r)+n.getX(o),l=n.getY(r)+n.getY(o),c=n.getZ(r)+n.getZ(o),h=Math.hypot(a,l,c)||1;n.setXYZ(r,a/h,l/h,c/h),n.setXYZ(o,a/h,l/h,c/h)}}var Zy=new I(0,1,0),jl=new I;function Vo(i,t,e,n=1){jl.subVectors(e,t);let s=jl.length()||1e-6;i.position.copy(t).addScaledVector(jl,.5),i.quaternion.setFromUnitVectors(Zy,jl.multiplyScalar(1/s)),i.scale.set(n,s,n)}function m0(i=.03,t=.026,e=12){return Ui([[1e-4,-.5-i*0],[i*.7,-.5+0],[i,-.42],[(i+t)/2,0],[t,.42],[t*.7,.5],[1e-4,.5]],e,{smooth:3})}function Rn(i,t,e,n=24,s=8,r=!1){let o=new Tr(i,r),a=new tt(new vo(o,n,t,s,r),e);return a.castShadow=!0,a.receiveShadow=!0,a}function qe(i,t,e,n=.5){let s=new tt(new ce(t,e),new Ue({map:i,transparent:!0,opacity:n,depthWrite:!1,toneMapped:!1,color:0}));return s.rotation.x=-Math.PI/2,s.renderOrder=1,s}var gt={room:{x0:-2.6,x1:3.4,z0:0,z1:5.2,h:2.4},counterY:.85,counterD:.65,counterX0:-1.3,counterX1:1.5,fridge:{x:-2.08,w:.7,d:.68,h:1.8},sink:{x:-.85,z:.33,w:.5,d:.38,depth:.18},prep:{x:-.05,z:.36},hob:{x:.86,z:.34,w:.6,d:.5},burnerMain:new I(.71,.85,.29),burnerSide:new I(1.02,.85,.29),table:{x:.6,z:3,w:1.4,d:.8,y:.72},sofa:{x:-.75,z:4.62},door:{x:2.5,z:5.2,w:.86,h:2},hook:new I(-1.52,1.42,.03),stool:new I(-1.47,0,.95)};function lt(i,t,e,n,s){return i.position.set(t,e,n),s&&s.add(i),i}function Jy(){let i=he(512,512),t=i.getContext("2d"),e=de(99),n=t.createLinearGradient(0,0,0,512);n.addColorStop(0,"#cfe6fb"),n.addColorStop(.45,"#eaf4fb"),n.addColorStop(.5,"#dfeccf"),n.addColorStop(1,"#a9c78a"),t.fillStyle=n,t.fillRect(0,0,512,512),t.filter="blur(7px)";for(let s=0;s<60;s++){let r=e()*512,o=210+e()*150,a=26+e()*60;t.fillStyle=`rgba(${90+e()*60},${140+e()*60},${70+e()*40},0.5)`,t.beginPath(),t.arc(r,o,a,0,6.3),t.fill()}t.fillStyle="rgba(232,222,205,0.9)",t.fillRect(0,372,512,34);for(let s=0;s<14;s++)t.fillStyle=`rgba(${240-e()*30},${130+e()*80},${150+e()*60},0.8)`,t.beginPath(),t.arc(e()*512,400+e()*60,5+e()*6,0,6.3),t.fill();return t.filter="none",Ot(i,{srgb:!0})}function g0(i){let t={groups:{}},e=gt.room,n=new dt;i.add(n),t.root=n;let s=e.x1-e.x0,r=e.z1-e.z0,o=(e.x0+e.x1)/2,a=(e.z0+e.z1)/2,l=new tt(new ce(s,r),q.floor);l.rotation.x=-Math.PI/2,l.position.set(o,0,a),l.receiveShadow=!0,n.add(l);let c=new tt(new ce(s,r),q.ceiling);c.rotation.x=Math.PI/2,c.position.set(o,e.h,a),n.add(c);let h=(at,Wt,Zt,Ze,De,cn=0)=>{let oe=new tt(new ce(at,Wt),q.wall);return oe.position.set(Zt,Ze,De),oe.rotation.y=cn,oe.receiveShadow=!0,n.add(oe),oe},u=-.5,d=.4,f=1.2,p=2;h(u-e.x0,e.h,(e.x0+u)/2,e.h/2,0),h(e.x1-d,e.h,(e.x1+d)/2,e.h/2,0),h(d-u,f,(u+d)/2,f/2,0),h(d-u,e.h-p,(u+d)/2,(e.h+p)/2,0);let x=2.5,g=4.5,m=.25,_=2.05;h(x-e.z0,e.h,e.x0,e.h/2,(e.z0+x)/2,Math.PI/2),h(e.z1-g,e.h,e.x0,e.h/2,(e.z1+g)/2,Math.PI/2),h(g-x,m,e.x0,m/2,(x+g)/2,Math.PI/2),h(g-x,e.h-_,e.x0,(e.h+_)/2,(x+g)/2,Math.PI/2),h(r,e.h,e.x1,e.h/2,a,-Math.PI/2);let v=gt.door,M=v.x-v.w/2,b=v.x+v.w/2;h(M-e.x0,e.h,(e.x0+M)/2,e.h/2,e.z1,Math.PI),h(e.x1-b,e.h,(e.x1+b)/2,e.h/2,e.z1,Math.PI),h(v.w,e.h-v.h,v.x,(e.h+v.h)/2,e.z1,Math.PI);let w=q.whitePaint;lt(an(s,.07,.012,w),o,.035,e.z1-.006,n),lt(an(.012,.07,r,w),e.x1-.006,.035,a,n);let y=Jy(),T=new Ue({map:y,color:new Ut(2.6,2.5,2.35)});lt(new tt(new ce(2.4,1.8),T),-.05,1.55,-.6,n);let F=q.whitePaint,O=d-u,N=p-f,B=(u+d)/2,G=(f+p)/2;lt(Lt(O+.1,.05,.12,F,.006),B,f-.02,-.01,n),lt(Lt(O+.08,.04,.1,F,.006),B,p+.02,-.02,n),lt(Lt(.04,N+.04,.1,F,.006),u-.02,G,-.02,n),lt(Lt(.04,N+.04,.1,F,.006),d+.02,G,-.02,n),lt(Lt(.028,N,.03,F,.004),B,G,-.04,n),lt(Lt(O,.024,.03,F,.004),B,G+.12,-.04,n);let E=new tt(new ce(O,N),q.glass);E.position.set(B,G,-.05),n.add(E);let U=fe(13208158,.7),C=new dt;lt(C,.22,f+.005,-.005,n),C.add(lt(ne([[.028,0],[.036,.06],[.04,.062],[.034,.06]],U,20),0,0,0));let P=new He({color:6265416,roughness:.6,side:Ce}),X=de(5);for(let at=0;at<11;at++){let Wt=new tt(new Re(.022,8,6),P);Wt.scale.set(.5,1,.16);let Zt=X()*6.28,Ze=.012+X()*.022;Wt.position.set(Math.cos(Zt)*Ze,.085+X()*.05,Math.sin(Zt)*Ze),Wt.rotation.set((X()-.5)*1.2,Zt,(X()-.5)*1.2),Wt.castShadow=!0,C.add(Wt)}let D=new Ue({map:y,color:new Ut(2.3,2.25,2.1)}),W=new tt(new ce(4.2,2.6),D);W.rotation.y=Math.PI/2,W.position.set(e.x0-.8,1.2,3.5),n.add(W),lt(Lt(.1,.05,g-x+.1,F,.006),e.x0-.01,m-.02,(x+g)/2,n),lt(Lt(.1,.05,g-x+.1,F,.006),e.x0-.01,_+.02,(x+g)/2,n);for(let at of[x-.02,(x+g)/2,g+.02])lt(Lt(.08,_-m+.04,.045,F,.006),e.x0-.02,(m+_)/2,at,n);let K=Ms(128,{seed:77,base:[250,246,238],threads:40}),ut=new Ge({map:Ot(K.map,{srgb:!0,repeat:[4,8]}),roughness:.95,transparent:!0,opacity:.86,side:Ce,sheen:.5});for(let[at,Wt]of[[x-.08,x+.42],[g-.42,g+.08]]){let Zt=new ce(Wt-at,2,24,1),Ze=Zt.attributes.position;for(let cn=0;cn<Ze.count;cn++)Ze.setZ(cn,Math.sin(Ze.getX(cn)*46)*.022);Zt.computeVertexNormals();let De=new tt(Zt,ut);De.rotation.y=Math.PI/2,De.position.set(e.x0+.07,1.14,(at+Wt)/2),n.add(De)}lt(Rn([new I(e.x0+.07,2.16,x-.2),new I(e.x0+.07,2.16,g+.2)],.009,q.woodDark,4,8),0,0,0,n);let Pt=new dt;n.add(Pt),t.groups.kitchen=Pt;let Z=gt.counterY,ft=gt.counterD,Rt=gt.counterX0,Gt=gt.counterX1,wt=Gt-Rt,$t=(Rt+Gt)/2,Te=.035,Mt=gt.sink,be=Mt.x-Mt.w/2,Xt=Mt.x+Mt.w/2,qt=Mt.z-Mt.d/2,Pe=Mt.z+Mt.d/2,Ie=(at,Wt,Zt,Ze)=>{let De=Lt(Wt-at,Te,Ze-Zt,q.counter,.004,1);return lt(De,(at+Wt)/2,Z-Te/2,(Zt+Ze)/2,Pt),De};Ie(Rt,be,0,ft+.02),Ie(Xt,Gt,0,ft+.02),Ie(be,Xt,0,qt),Ie(be,Xt,Pe,ft+.02);{let at=Z-Te-.1,Wt=gt.sink.x-gt.sink.w/2-.015,Zt=gt.sink.x+gt.sink.w/2+.015,Ze=Z-gt.sink.depth-.03-.1;lt(an(Wt-Rt,at,ft-.03,q.cabinet),(Rt+Wt)/2,.1+at/2,(ft-.03)/2,Pt),lt(an(Gt-Zt,at,ft-.03,q.cabinet),(Gt+Zt)/2,.1+at/2,(ft-.03)/2,Pt),lt(an(Zt-Wt,Ze,ft-.03,q.cabinet),(Wt+Zt)/2,.1+Ze/2,(ft-.03)/2,Pt),lt(an(Zt-Wt,at,.03,q.cabinet),(Wt+Zt)/2,.1+at/2,ft-.045,Pt),lt(an(Zt-Wt,at,.02,q.cabinet),(Wt+Zt)/2,.1+at/2,.01,Pt)}lt(an(wt-.02,.1,ft-.09,q.blackPlastic),$t,.05,(ft-.09)/2,Pt);let Ye=[[-1.3,-.85],[-.85,-.4],[-.4,.1],[.1,.56],[.56,1.16],[1.16,1.5]];for(let[at,Wt]of Ye){let Zt=Lt(Wt-at-.008,Z-Te-.12,.02,q.cabinet,.004,1);lt(Zt,(at+Wt)/2,.11+(Z-Te-.12)/2,ft-.02,Pt);let Ze=Lt(Math.min(.16,(Wt-at)*.4),.012,.014,q.steel,.005,1);lt(Ze,(at+Wt)/2,Z-Te-.07,ft+.002,Pt)}lt(an(.02,Z-Te,ft,q.cabinet),Gt-.01,(Z-Te)/2,ft/2,Pt);let Fe=new tt(new ce(wt+.5,.92),q.tile);Fe.position.set($t-.25,Z+.46,.004),Fe.receiveShadow=!0,Pt.add(Fe);let Bn=new tt(new ce(wt,.1),new Ue({map:ct.blob,transparent:!0,opacity:.22,depthWrite:!1,color:0}));Bn.rotation.x=-Math.PI/2,Bn.position.set($t,Z+.0012,.02),Bn.scale.set(1,1,1),Pt.add(Bn);let Ae=new dt;Pt.add(Ae),t.sink=Ae;let $e=Mt.depth,Ke=.004,Sn=q.steelSink;lt(an(Mt.w,Ke,Mt.d,Sn),Mt.x,Z-$e,Mt.z,Ae).castShadow=!1,lt(an(Ke,$e,Mt.d,Sn),be+Ke/2,Z-$e/2,Mt.z,Ae),lt(an(Ke,$e,Mt.d,Sn),Xt-Ke/2,Z-$e/2,Mt.z,Ae),lt(an(Mt.w,$e,Ke,Sn),Mt.x,Z-$e/2,qt+Ke/2,Ae),lt(an(Mt.w,$e,Ke,Sn),Mt.x,Z-$e/2,Pe-Ke/2,Ae);let V=q.steel;lt(Lt(Mt.w+.03,.004,.018,V,.002,1),Mt.x,Z+.001,qt-.006,Ae),lt(Lt(Mt.w+.03,.004,.018,V,.002,1),Mt.x,Z+.001,Pe+.006,Ae),lt(Lt(.018,.004,Mt.d+.03,V,.002,1),be-.006,Z+.001,Mt.z,Ae),lt(Lt(.018,.004,Mt.d+.03,V,.002,1),Xt+.006,Z+.001,Mt.z,Ae);let Wn=ne([[0,.001],[.03,.001],[.036,.003],[.04,.001]],q.chrome,24);lt(Wn,Mt.x,Z-$e+Ke/2,Mt.z-.06,Ae);let Ve=new tt(new yn(.022,20),new Ue({color:328965}));Ve.rotation.x=-Math.PI/2,lt(Ve,Mt.x,Z-$e+Ke/2+.0025,Mt.z-.06,Ae);let We=qt-.055,Et=new dt;lt(Et,Mt.x,Z,We,Ae),t.faucet=Et,Et.add(ne([[.03,0],[.03,.006],[.022,.012],[.02,.05],[.018,.06]],q.chrome,24));let ln=Rn([new I(0,.05,0),new I(0,.2,0),new I(0,.285,.035),new I(0,.3,.11),new I(0,.255,.165),new I(0,.215,.168)],.0125,q.chrome,40,12);Et.add(ln),Et.add(lt(ne([[.0135,0],[.015,.004],[.015,.02],[.0125,.022]],q.chrome,16),0,.2,.168)),t.spout=new I(Mt.x,Z+.2,We+.168);let Yt=new dt;lt(Yt,0,.058,0,Et),t.faucetLever=Yt,Yt.add(lt(ne([[.019,0],[.02,.012],[.016,.026],[0,.028]],q.chrome,20),0,0,0));let ie=Lt(.014,.008,.085,q.chrome,.004,2);lt(ie,.035,.018,.02,Yt),ie.rotation.y=.5,Yt.rotation.y=0;let L=new dt;lt(L,Xt-.05,Z,qt-.07,Ae),L.add(ne([[.026,0],[.028,.004],[.028,.1],[.02,.118],[.01,.122],[.01,.14]],new Ge({color:10475716,roughness:.15,transparent:!0,opacity:.8,clearcoat:.6}),20)),L.add(lt(ne([[.012,0],[.012,.012],[.004,.014],[.004,.03]],q.plasticWhite,12),0,.14,0)),L.add(lt(Lt(.012,.007,.036,q.plasticWhite,.003,1),0,.172,.012));let A=new dt;Pt.add(A),t.shelf=A;let J=1.4,pt=-1.27,ot=-.56,_t=.25;lt(Lt(ot-pt,.026,_t,q.woodLight,.005,1),(pt+ot)/2,J,_t/2+.005,A);for(let at of[pt+.06,ot-.06])lt(Lt(.02,.14,.018,q.blackPlastic,.004,1),at,J-.08,.012,A),lt(Lt(.02,.016,_t-.04,q.blackPlastic,.004,1),at,J-.02,_t/2,A);t.shelfTop=new I(-.78,J+.013,.14);let At=[q.ceramic,q.ceramicBlue,q.ceramicYellow];for(let at=0;at<3;at++)lt(ne([[0,.004],[.03,.004],[.036,.012],[.04,.075],[.042,.08],[.038,.078],[.034,.014],[0,.012]],At[at],28,{smooth:0}),pt+.09+at*.105,J+.013,.12,A);let et=new dt;Pt.add(et),lt(Lt(.78,.06,.5,q.steel,.006,1),gt.hob.x,1.72,.25,et),lt(Lt(.3,.62,.26,q.steel,.006,1),gt.hob.x,2.06,.13,et);let st=new tt(new ce(.2,.05),new Ue({color:new Ut(3.2,2.9,2.4)}));st.rotation.x=Math.PI/2,st.position.set(gt.hob.x,1.689,.3),et.add(st);let vt=new dt;lt(vt,gt.hob.x,Z,gt.hob.z,Pt),t.hob=vt;let k=Lt(gt.hob.w,.012,gt.hob.d,q.steel,.005,2);k.position.y=.0055,vt.add(k);let rt=Lt(gt.hob.w-.022,.004,gt.hob.d-.022,q.hobGlass,.0015,1);rt.position.y=.0102,vt.add(rt);let Q=qe(ct.blob,gt.hob.w+.08,gt.hob.d+.08,.3);Q.position.y=8e-4,vt.add(Q);let bt=new dt;lt(bt,1.36,Z,.13,Pt),bt.add(ne([[0,0],[.05,0],[.056,.01],[.056,.13],[.052,.135],[.05,.13],[.05,.012],[0,.01]],q.ceramicBlue,28));for(let at=0;at<4;at++){let Wt=Lt(.016,.26,.008,q.woodLight,.003,1);lt(Wt,(at-1.5)*.02,.15,at%2*.02-.01,bt),Wt.rotation.z=(at-1.5)*.09,Wt.rotation.x=(at%2?1:-1)*.07}bt.add(lt(qe(ct.blob,.2,.2,.4),0,.001,0));let nt=gt.fridge,mt=new dt;lt(mt,nt.x,0,0,n),t.fridge=mt;let Vt=nt.d/2,Qt=.62,ht=nt.h-Qt,Bt=.03;lt(Lt(nt.w,.03,nt.d-.04,q.fridge,.01,1),0,nt.h-.015,Vt-.02,mt),lt(an(Bt,nt.h,nt.d-.04,q.fridge),-nt.w/2+Bt/2,nt.h/2,Vt-.02,mt),lt(an(Bt,nt.h,nt.d-.04,q.fridge),nt.w/2-Bt/2,nt.h/2,Vt-.02,mt),lt(an(nt.w,nt.h,Bt,q.fridge),0,nt.h/2,Bt/2,mt),lt(an(nt.w-2*Bt,.04,nt.d-.08,q.fridgeInner),0,Qt,Vt-.02,mt);let te=new dt;mt.add(te);let It=q.fridgeInner,Ee=nt.w-2*Bt-.004,je=nt.d-.1,fi=new tt(new ce(Ee,ht),It);fi.position.set(0,Qt+ht/2,Bt+.002),te.add(fi);let As=new tt(new ce(je,ht),It);As.rotation.y=Math.PI/2,As.position.set(-Ee/2,Qt+ht/2,Bt+je/2),te.add(As);let Rs=As.clone();Rs.rotation.y=-Math.PI/2,Rs.position.x=Ee/2,te.add(Rs),t.fridgeShelves=[];for(let at of[.66,.98,1.3])lt(an(Ee,.008,je-.06,q.glassThick),0,at,Bt+(je-.06)/2,te).castShadow=!1,lt(Lt(Ee,.016,.012,q.plasticWhite,.004,1),0,at,Bt+je-.06,te),t.fridgeShelves.push(at+.004);let tr=new tt(new ce(.3,.08),new Ue({color:new Ut(0,0,0)}));tr.rotation.x=Math.PI/2,tr.position.set(0,nt.h-.032,.3),te.add(tr),t.fridgeLamp=tr;let er=new Ji(14479359,0,1.6,1.6);er.position.set(0,nt.h-.2,.42),mt.add(er),t.fridgeLight=er;let wi=new dt;lt(wi,-nt.w/2,0,nt.d-.02,mt),t.fridgeDoor=wi;let Xn=.05,Zr=Lt(nt.w-.006,ht-.006,Xn,q.fridge,.014,3);lt(Zr,nt.w/2,Qt+ht/2,Xn/2-.01,wi),t.fridgeDoorFront=new dt,lt(t.fridgeDoorFront,nt.w/2,Qt+ht/2,Xn-.0095,wi),t.fridgeDoorSize={w:nt.w-.006,h:ht-.006};let jo=Lt(.022,.42,.03,q.steelV,.009,2);lt(jo,nt.w-.06,Qt+ht/2-.1,Xn+.012,wi);let Qo=Lt(nt.w-.1,ht-.12,.02,q.fridgeInner,.008,1);lt(Qo,nt.w/2,Qt+ht/2,-.018,wi);for(let at of[.75,1.1,1.42])lt(Lt(nt.w-.14,.07,.07,new Ge({color:16777215,transparent:!0,opacity:.35,roughness:.1}),.008,1),nt.w/2,at,-.06,wi).castShadow=!1;let ns=Qt-.012;lt(Lt(nt.w-.006,ns-.03,Xn,q.fridge,.014,3),0,.03+(ns-.03)/2,nt.d-.02+Xn/2-.01,mt),lt(Lt(.36,.022,.03,q.steel,.009,2),0,ns-.09,nt.d+.03,mt),lt(an(nt.w-.02,.03,nt.d-.1,q.blackPlastic),0,.015,Vt,mt),lt(qe(ct.blob,nt.w+.3,nt.d+.5,.35),0,.002,Vt+.1,mt);let nr=new dt;lt(nr,gt.hook.x,gt.hook.y,0,n),nr.add(lt(Lt(.3,.05,.016,q.woodLight,.006,1),0,.02,.008));for(let at of[-.09,0,.09]){let Wt=ne([[0,0],[.007,0],[.007,.03],[.012,.036],[.012,.042],[0,.044]],q.woodDark,12);Wt.rotation.x=Math.PI/2,lt(Wt,at,.02,.016,nr)}let Ei=new dt;lt(Ei,gt.hook.x,2,.012,n),t.clock=Ei;{let at=ne([[0,0],[.13,0],[.14,.008],[.14,.022],[.132,.026],[.128,.014],[0,.012]],q.woodLight,48);at.rotation.x=Math.PI/2,Ei.add(at)}let is=new tt(new yn(.128,48),new He({color:16513262,roughness:.7}));is.position.z=.0125,Ei.add(is);for(let at=0;at<12;at++){let Wt=an(at%3===0?.008:.004,at%3===0?.022:.014,.001,q.blackPlastic),Zt=at/12*Math.PI*2;Wt.position.set(Math.sin(Zt)*.108,Math.cos(Zt)*.108,.0135),Wt.rotation.z=-Zt,Wt.castShadow=!1,Ei.add(Wt)}let ir=new dt,Cs=new dt;ir.position.z=.016,Cs.position.z=.018,Ei.add(ir,Cs),ir.add(lt(Lt(.01,.065,.002,q.blackPlastic,.001,1),0,.026,0)),Cs.add(lt(Lt(.007,.1,.002,q.blackPlastic,.001,1),0,.042,0)),Ei.add(lt(new tt(new Me(.008,.008,.004,16).rotateX(Math.PI/2),q.brass),0,0,.02)),t.clockHour=ir,t.clockMin=Cs;let Ps=new dt;lt(Ps,gt.stool.x,0,gt.stool.z,n),Ps.add(lt(ne([[0,0],[.17,0],[.175,.012],[.17,.028],[0,.028]],q.woodLight,32),0,.42,0));for(let at=0;at<4;at++){let Wt=at*Math.PI/2+Math.PI/4,Zt=new tt(new Me(.014,.011,.44,10),q.woodLight);Zt.position.set(Math.cos(Wt)*.125,.21,Math.sin(Wt)*.125),Zt.rotation.set(Math.sin(Wt)*.1,0,-Math.cos(Wt)*.1),Zt.castShadow=!0,Ps.add(Zt)}Ps.add(lt(qe(ct.blob,.5,.5,.35),0,.002,0)),t.stoolTop=new I(gt.stool.x,.448,gt.stool.z);let Ti=new dt;n.add(Ti),t.groups.dining=Ti;let ze=gt.table;lt(Lt(ze.w,.036,ze.d,q.table,.012,2),ze.x,ze.y-.018,ze.z,Ti);for(let[at,Wt]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let Zt=Lt(.055,ze.y-.036,.055,q.table,.01,1);lt(Zt,ze.x+at*(ze.w/2-.08),(ze.y-.036)/2,ze.z+Wt*(ze.d/2-.08),Ti)}lt(qe(ct.blob,ze.w+.5,ze.d+.5,.42),ze.x,.003,ze.z,Ti),t.chairs={};let sr=(at,Wt,Zt,Ze)=>{let De=new dt;lt(De,Wt,0,Zt,Ti),De.rotation.y=Ze,De.add(lt(Lt(.4,.03,.4,q.woodLight,.012,2),0,.44,0));let cn=Lt(.36,.03,.36,fe(14262363,.95),.014,2);lt(cn,0,.468,0,De);for(let[oe,nn]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let zn=new tt(new Me(.017,.014,.43,10),q.woodLight);zn.position.set(oe*.165,.215,nn*.165),zn.castShadow=!0,De.add(zn)}for(let oe of[-1,1]){let nn=new tt(new Me(.015,.015,.42,10),q.woodLight);nn.position.set(oe*.165,.65,-.18),nn.castShadow=!0,De.add(nn)}return lt(Lt(.38,.12,.022,q.woodLight,.01,2),0,.8,-.18,De),De.add(lt(qe(ct.blob,.6,.6,.3),0,.003,0)),t.chairs[at]=De,De};sr("friend",ze.x,ze.z+.62,Math.PI),sr("girl",ze.x,ze.z-.62,0),sr("papa",ze.x+.98,ze.z,-Math.PI/2),sr("mama",ze.x-.98,ze.z,Math.PI/2);let Is=new dt;lt(Is,ze.x,0,ze.z,Ti),Is.add(lt(new tt(new Me(.003,.003,.75,6),q.blackPlastic),0,e.h-.375,0)),Is.add(lt(ne([[.03,.2],[.05,.19],[.16,.05],[.2,0],[.196,0],[.155,.046],[.046,.184],[.03,.19]],new Ge({color:15986144,roughness:.4,side:Ce,clearcoat:.4}),40),0,1.5,0));let R=new tt(new Re(.04,16,12),new Ue({color:new Ut(4.2,3.4,2.2)}));R.position.set(0,1.56,0),Is.add(R);let H=Ms(256,{seed:55,base:[226,214,196],threads:32,stripe:{color:[196,150,120],every:8,width:1,alpha:.5}}),j=new tt(new ce(2.4,1.9),new He({map:Ot(H.map,{srgb:!0,repeat:[5,4]}),normalMap:Ot(H.normal,{repeat:[5,4]}),roughness:1}));j.rotation.x=-Math.PI/2,j.position.set(ze.x,.004,ze.z),j.receiveShadow=!0,Ti.add(j);let Y=new dt;lt(Y,gt.sofa.x,0,gt.sofa.z,n),t.sofa=Y;let $=q.fabricSofa;lt(Lt(1.9,.22,.86,$,.06,3),0,.26,0,Y),lt(Lt(1.9,.5,.22,$,.07,3),0,.55,.36,Y);for(let at of[-1,1])lt(Lt(.2,.4,.86,$,.07,3),at*.93,.4,0,Y);for(let at of[-.44,.44])lt(Lt(.84,.13,.62,$,.05,3),at,.42,-.07,Y);for(let[at,Wt]of[[-.85,-.33],[.85,-.33],[-.85,.33],[.85,.33]])lt(new tt(new Me(.022,.018,.15,10),q.woodDark),at,.075,Wt,Y);let Tt=Lt(.4,.38,.14,fe(15325608,.95),.065,3);lt(Tt,-.66,.66,.2,Y),Tt.rotation.set(-.25,.25,.1),lt(qe(ct.blob,2.3,1.3,.4),0,.003,0,Y);let kt=new dt;lt(kt,.85,0,4.75,n),kt.add(ne([[0,0],[.13,0],[.16,.26],[.17,.27],[.15,.26],[0,.24]],fe(14472904,.6),28));let St=de(12);for(let at=0;at<16;at++){let Wt=St()*6.28,Zt=.35+St()*.4,Ze=.2+St()*.55,De=new tt(new Re(1,10,6),P);De.scale.set(.055,Zt/2,.012);let cn=new dt;cn.position.set(0,.26,0),cn.rotation.set(0,Wt,0);let oe=new dt;oe.rotation.z=Ze,cn.add(oe),De.position.y=Zt/2,oe.add(De),De.castShadow=!0,kt.add(cn)}kt.add(lt(qe(ct.blob,.7,.7,.4),0,.003,0));let Dt=he(256,200),Ct=Dt.getContext("2d");Ct.fillStyle="#fbf6ea",Ct.fillRect(0,0,256,200),Ct.lineCap="round",Ct.strokeStyle="#6aa24e",Ct.lineWidth=7,Ct.beginPath(),Ct.moveTo(128,185),Ct.quadraticCurveTo(120,140,128,105),Ct.stroke();for(let at=0;at<7;at++){let Wt=at/7*6.28;Ct.fillStyle=at%2?"#f08a8a":"#f4a56a",Ct.beginPath(),Ct.ellipse(128+Math.cos(Wt)*30,78+Math.sin(Wt)*30,20,13,Wt,0,6.3),Ct.fill()}Ct.fillStyle="#f6d24a",Ct.beginPath(),Ct.arc(128,78,16,0,6.3),Ct.fill(),Ct.fillStyle="#7fb35f",Ct.beginPath(),Ct.ellipse(150,150,22,9,-.5,0,6.3),Ct.fill();let ee=new dt;lt(ee,gt.sofa.x,1.5,e.z1-.012,n),ee.rotation.y=Math.PI,ee.add(Lt(.56,.45,.02,q.woodLight,.006,1));let _e=new tt(new ce(.48,.375),new He({map:Ot(Dt,{srgb:!0}),roughness:.8}));_e.position.z=.0105,ee.add(_e);let Ft=new dt;n.add(Ft);let me=q.whitePaint;lt(Lt(.06,v.h+.06,.12,me,.008,1),M-.03,(v.h+.06)/2,e.z1-.01,Ft),lt(Lt(.06,v.h+.06,.12,me,.008,1),b+.03,(v.h+.06)/2,e.z1-.01,Ft),lt(Lt(v.w+.12,.06,.12,me,.008,1),v.x,v.h+.03,e.z1-.01,Ft);let Qe=new tt(new ce(2.4,2.6),new Ue({map:y,color:new Ut(1.9,1.85,1.7)}));Qe.rotation.y=Math.PI,Qe.position.set(v.x,1.2,e.z1+1.3),Ft.add(Qe);let Oe=new tt(new ce(2.4,1.4),new He({color:12432806,roughness:.9}));Oe.rotation.x=-Math.PI/2,Oe.position.set(v.x,0,e.z1+.7),Ft.add(Oe);let Le=new dt;lt(Le,b,0,e.z1-.02,Ft),t.doorLeaf=Le;let wn=Lt(v.w-.008,v.h-.008,.04,fe(9416347,.5,{clearcoat:.3}),.006,1);lt(wn,-v.w/2,v.h/2,0,Le);for(let at of[.55,1.45])lt(Lt(v.w-.24,at<1?.7:.75,.01,fe(8824210,.5),.02,1),-v.w/2,at,-.021,Le);let zt=new dt;lt(zt,-v.w+.09,1,-.02,Le);{let at=ne([[.022,0],[.022,.006],[.008,.01],[.008,.04],[0,.04]],q.brass,16);at.rotation.x=-Math.PI/2,zt.add(at)}zt.add(lt(Lt(.11,.018,.014,q.brass,.006,2),.04,0,-.045));let fn=new tt(new ce(.8,.5),new He({color:10124122,roughness:1,normalMap:ct.linenN}));return fn.rotation.x=-Math.PI/2,fn.position.set(v.x,.004,e.z1-.45),fn.receiveShadow=!0,Ft.add(fn),lt(Lt(.1,.14,.03,q.plasticWhite,.01,2),M-.3,1.45,e.z1-.016,Ft),t.doorbell=new I(M-.3,1.45,e.z1-.03),t}function x0(i,t){let e=new Os,n=new I(.3,1.15,1.2),s=new dt;s.position.copy(n).multiplyScalar(-1),e.add(s);let r=gt.room,o=r.x1-r.x0,a=r.z1-r.z0,l=(v,M,b)=>new Ue({color:new Ut(v,M,b),side:Ce}),c=(v,M,b,w,y,T,F=0,O=0)=>{let N=new tt(new ce(v,M),b);return N.position.set(w,y,T),N.rotation.set(F,O,0),s.add(N),N},h=(r.x0+r.x1)/2,u=(r.z0+r.z1)/2;c(o,a,l(.34,.25,.17),h,0,u,-Math.PI/2),c(o,a,l(.6,.58,.54),h,r.h,u,Math.PI/2),c(o,r.h,l(.42,.4,.36),h,r.h/2,r.z0,0,0),c(o,r.h,l(.36,.34,.3),h,r.h/2,r.z1,0,Math.PI),c(a,r.h,l(.4,.38,.34),r.x0,r.h/2,u,0,Math.PI/2),c(a,r.h,l(.36,.34,.3),r.x1,r.h/2,u,0,-Math.PI/2),c(.9,.8,l(15,14.4,13.5),-.05,1.6,.01),c(2,1.8,l(9.5,9.5,9.8),r.x0+.01,1.15,3.5,0,Math.PI/2),c(1.6,.25,l(7,6.4,5.6),.2,r.h-.01,.9,Math.PI/2),c(.25,1.6,l(5,4.6,4),1.4,r.h-.01,1.6,Math.PI/2),c(.6,.12,l(3.5,3.2,2.7),gt.hob.x,1.68,.3,Math.PI/2),c(.7,1.8,l(.2,.2,.2),gt.fridge.x,.9,.7),c(.8,.7,l(.12,.12,.13),gt.hob.x,2.05,.3),c(2.8,.85,l(.28,.2,.13),.1,.42,.66),c(.5,1.7,l(.06,.06,.07),.3,.9,2.4,0,Math.PI),c(1.4,.8,l(.3,.22,.15),gt.table.x,.72,gt.table.z,-Math.PI/2);let d=new Nr(i),f=d.fromScene(e,.035,.05,30);t.environment=f.texture,t.environmentIntensity=.56,t.background=new Ut(15327956),d.dispose(),e.traverse(v=>{v.isMesh&&(v.geometry.dispose(),v.material.dispose())});let p=new Rr(16773596,1.7);p.castShadow=!0,p.shadow.mapSize.set(2048,2048),p.shadow.bias=-4e-4,p.shadow.normalBias=.012,p.shadow.radius=5,p.shadow.blurSamples=12,t.add(p),t.add(p.target);let x=new I(-.5,.74,-.6).normalize(),g={sun:p,dir:x,focus:new I(0,.9,.4),size:1.2};g.setFocus=(v,M=1.2)=>{g.focus.copy(v),g.size=M,p.target.position.copy(v),p.position.copy(v).addScaledVector(x,4);let b=p.shadow.camera;b.left=-M,b.right=M,b.top=M,b.bottom=-M,b.near=.5,b.far=8,b.updateProjectionMatrix(),p.target.updateMatrixWorld()},g.setFocus(g.focus,1.3);let m=new Rr(16771538,.3);m.position.set(.8,2.2,3.5),m.target.position.set(.2,.9,.3),t.add(m,m.target);let _=new Ji(16767400,1.6,4.5,1.8);return _.position.set(gt.table.x,1.45,gt.table.z),t.add(_),g.fill=m,g.pend=_,g}var $h={home:{pos:[-1.32,1.3,2.95],look:[-1.78,1.1,.5],fov:40,light:[-1.8,.9,.8],ls:1.6},calendar:{pos:[-1.98,1.42,1.5],look:[-2,1.42,.6],fov:34,light:[-1.8,.9,.8],ls:1.6},sofa:{pos:[1,1.3,1.9],look:[-.55,1,4.2],fov:38,light:[-.6,.5,4.2],ls:1.8},apron:{pos:[-.55,1.35,2.6],look:[-1.45,1.05,.4],fov:40,light:[-1.5,.9,.8],ls:1.6},fridge:{pos:[-1.6,1.15,1.7],look:[-1.75,1.02,.4],fov:42,light:[-1.8,.9,.8],ls:1.4},sink:{pos:[-.85,1.43,1.02],look:[-.85,.84,.3],fov:40,light:[-.85,.85,.35],ls:.75},sinkShelf:{pos:[-.85,1.4,1.35],look:[-.85,1.16,.2],fov:42,light:[-.85,1,.35],ls:.9},board:{pos:[-.05,1.32,.95],look:[-.03,.93,.38],fov:38,light:[-.05,.85,.35],ls:.75},boardCat:{pos:[-1.9,1,1.95],look:[.2,.62,1.1],fov:45,light:[.1,.5,1.1],ls:1.6},stove:{pos:[.64,1.5,.92],look:[.645,.9,.37],fov:40,light:[.8,.85,.35],ls:.75},stoveLow:{pos:[.66,1.07,1],look:[.68,.9,.34],fov:40,light:[.8,.85,.35],ls:.75},stovePot:{pos:[.71,1.36,.82],look:[.72,.93,.31],fov:38,light:[.8,.85,.35],ls:.75},stoveWide:{pos:[-.25,1.45,1.55],look:[.95,1.1,.4],fov:45,light:[.9,.85,.5],ls:1.1},plate:{pos:[-.05,1.33,1],look:[-.05,.87,.36],fov:40,light:[-.05,.85,.35],ls:.75},plateClose:{pos:[-.05,1.13,.9],look:[-.06,.875,.455],fov:33,light:[-.05,.85,.35],ls:.6},door:{pos:[.15,1.3,2.5],look:[2.45,1,5.2],fov:38,light:[2.3,.6,4.6],ls:1.4},table:{pos:[.6,1.16,2.3],look:[.6,.76,3.3],fov:60,light:[.6,.7,3],ls:1.4},tableWide:{pos:[.6,1.6,1.3],look:[.6,.8,3.2],fov:50,light:[.6,.7,3],ls:1.6},cat:{pos:[.6,.75,2.3],look:[-.3,.5,4.4],fov:30,light:[-.4,.5,4.2],ls:1.5},fridgeEnd:{pos:[-1.6,1.36,2.1],look:[-1.85,1.28,.6],fov:40,light:[-1.8,.9,.8],ls:1.6}},tc=class{constructor(t,e){this.camera=t,this.lights=e,this.pos=new I,this.look=new I,this.fov=40,this.station=null,this.sway=1,this._lf=new I,this.offset=new I,this.jump("home")}_get(t){return typeof t=="string"?$h[t]:t}jump(t){let e=this._get(t);this.station=typeof t=="string"?t:"custom",this.pos.fromArray(e.pos),this.look.fromArray(e.look),this.fov=e.fov,e.light&&this.lights.setFocus(this._lf.fromArray(e.light),e.ls||1.2),this.apply(0)}move(t,e,n=1.4,s=Xe.inOut){let r=this._get(e);this.station=typeof e=="string"?e:"custom";let o=this.pos.clone(),a=this.look.clone(),l=this.fov,c=new I().fromArray(r.pos),h=new I().fromArray(r.look),u=this.lights.focus.clone(),d=this.lights.size,f=r.light?new I().fromArray(r.light):u,p=r.ls||d;return t.tween(n,x=>{this.pos.lerpVectors(o,c,x),this.look.lerpVectors(a,h,x),this.fov=Ht(l,r.fov,x),this.lights.setFocus(this._lf.lerpVectors(u,f,x),Ht(d,p,x)+Math.sin(x*Math.PI)*.3)},s)}apply(t){let e=this.camera,n=Math.sin(t*.43)*.0018*this.sway,s=Math.sin(t*.31+1.3)*.0014*this.sway;e.position.set(this.pos.x+this.offset.x+n,this.pos.y+this.offset.y+s,this.pos.z+this.offset.z);let r=2*Math.atan(Math.tan(this.fov*Math.PI/360)*Math.max(1,1.55/e.aspect))*180/Math.PI;Math.abs(e.fov-r)>1e-4&&(e.fov=r,e.updateProjectionMatrix()),e.lookAt(this.look)}};var Kh=new I,ts=new Bs,kr=new xt,ec=class{constructor(t,e){this.canvas=t,this.camera=e,this.items=[],this.active=null,this.pid=null,this.p={x:0,y:0,dx:0,dy:0,sx:0,sy:0,t0:0,moved:0,down:!1},this.anyDown=[],this.locked=!1,this.lastInputTime=0,this.lastActionTime=0;let n={passive:!1};t.addEventListener("pointerdown",s=>this._down(s),n),window.addEventListener("pointermove",s=>this._move(s),n),window.addEventListener("pointerup",s=>this._up(s),n),window.addEventListener("pointercancel",s=>this._up(s),n);for(let s of["contextmenu","gesturestart","gesturechange","dblclick","selectstart","dragstart"])window.addEventListener(s,r=>r.preventDefault(),n);window.addEventListener("touchmove",s=>s.preventDefault(),n),window.addEventListener("wheel",s=>s.preventDefault(),n)}add(t){return t.enabled=t.enabled!==!1,t.priority=t.priority||0,this.items.push(t),t}remove(t){let e=this.items.indexOf(t);e>=0&&this.items.splice(e,1),this.active===t&&(this.active=null)}clear(){this.items.length=0,this.active=null}worldPos(t,e=Kh){let n=typeof t.pos=="function"?t.pos():t.pos;return e.copy(n)}screen(t){let e=this.canvas.clientWidth,n=this.canvas.clientHeight,s=this.worldPos(t,Kh),r=s.distanceTo(this.camera.position);if(s.project(this.camera),s.z>1)return null;let o=n/2/(Math.tan(this.camera.fov*Math.PI/360)*r),a=Math.max(t.minPx||40,(t.radius||.05)*o*(t.grow||1.35));return{x:(s.x*.5+.5)*e,y:(-s.y*.5+.5)*n,r:a}}pick(t,e){let n=null,s=1/0;for(let r of this.items){if(!r.enabled)continue;if(r.zone){10-r.priority<s&&!n&&(n=r,s=9-r.priority*.01);continue}let o=this.screen(r);if(!o)continue;let a=Math.hypot(t-o.x,e-o.y)/o.r;if(a<=1){let l=a-r.priority;l<s&&(s=l,n=r)}}return n}_xy(t){let e=this.canvas.getBoundingClientRect();return[t.clientX-e.left,t.clientY-e.top]}_down(t){if(t.preventDefault(),this.pid!==null||t.pointerType==="mouse"&&t.button!==0)return;this.pid=t.pointerId;try{this.canvas.setPointerCapture(t.pointerId)}catch{}let[e,n]=this._xy(t),s=this.p;s.x=s.sx=e,s.y=s.sy=n,s.dx=s.dy=0,s.moved=0,s.t0=performance.now(),s.down=!0,this.lastInputTime=S.time;for(let o of this.anyDown)o(s);if(this.locked)return;let r=this.pick(e,n);this.active=r,r&&(this.lastActionTime=S.time,r.onDown&&r.onDown(s,r))}_move(t){if(t.pointerId!==this.pid)return;t.preventDefault();let[e,n]=this._xy(t),s=this.p;s.dx=e-s.x,s.dy=n-s.y,s.x=e,s.y=n,s.moved+=Math.hypot(s.dx,s.dy),this.lastInputTime=S.time;let r=this.active;r&&r.onMove&&!this.locked&&(this.lastActionTime=S.time,r.onMove(s,r))}_up(t){if(t.pointerId!==this.pid)return;this.pid=null;let e=this.p;e.down=!1;let n=this.active;this.active=null,!(!n||this.locked)&&(n.onUp&&n.onUp(e,n),n.onTap&&e.moved<14&&performance.now()-e.t0<600&&n.onTap(e,n))}planePoint(t,e=new I,n=this.p.x,s=this.p.y){let r=this.canvas.clientWidth,o=this.canvas.clientHeight;kr.set(n/r*2-1,-(s/o)*2+1),ts.setFromCamera(kr,this.camera);let a=ts.ray.origin,l=ts.ray.direction;if(Math.abs(l.y)<1e-5)return null;let c=(t-a.y)/l.y;return c<0?null:e.copy(a).addScaledVector(l,c)}planePointZ(t,e=new I,n=this.p.x,s=this.p.y){let r=this.canvas.clientWidth,o=this.canvas.clientHeight;kr.set(n/r*2-1,-(s/o)*2+1),ts.setFromCamera(kr,this.camera);let a=ts.ray.origin,l=ts.ray.direction;if(Math.abs(l.z)<1e-5)return null;let c=(t-a.z)/l.z;return c<0?null:e.copy(a).addScaledVector(l,c)}planePointN(t,e,n=new I,s=this.p.x,r=this.p.y){let o=this.canvas.clientWidth,a=this.canvas.clientHeight;kr.set(s/o*2-1,-(r/a)*2+1),ts.setFromCamera(kr,this.camera);let l=ts.ray.origin,c=ts.ray.direction,h=c.dot(e);if(Math.abs(h)<1e-5)return null;let u=Kh.copy(t).sub(l).dot(e)/h;return u<0?null:n.copy(l).addScaledVector(c,u)}targets(){let t=[];for(let e of this.items){if(!e.enabled)continue;let n=e.pos?this.screen(e):null;if(e.zone){t.push(n?{name:e.name,zone:!0,x:n.x,y:n.y,r:n.r}:{name:e.name,zone:!0});continue}n&&t.push({name:e.name,x:n.x,y:n.y,r:n.r})}return t}};var $y="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'><path d='M22 8c3.300 0 6 2.700 6 6v17l3-1c2-4 8-3 9 1 3-2.500 8-1 8.500 3 3.500-1.500 7.500 1 7.500 5v12c0 9-7 16-16 16h-6c-6 0-10-3-13-8L10 44c-2-3.500 2-7.500 6-5l0 1V14c0-3.300 2.700-6 6-6z' fill='#fffaf0' stroke='#8a6a4a' stroke-width='2.500' stroke-linejoin='round'/></svg>"),nc=class{constructor(t){this.input=t;let e=document.getElementById("fx");this.halo=document.createElement("div"),this.halo.className="halo",e.appendChild(this.halo),this.hand=document.createElement("div"),this.hand.className="hand",this.hand.style.backgroundImage=`url("${$y}")`,e.appendChild(this.hand),this.target=null,this.opts={},this.idle=0,this.handT=0,this.shown=!1,this.delayScale=1,this._a=new I,this._b=new I}set(t,e={}){this.target=t,this.opts=e,this.idle=0,this.handT=0,this._hide()}clear(){this.target=null,this._hide()}poke(){this.idle=0,this.handT=0,this._hide()}_hide(){this.halo.classList.remove("on"),this.hand.classList.remove("on"),this.shown=!1}_screen(t,e){if(!t)return null;if(t.pos||t.zone)return t.zone&&!t.pos?null:this.input.screen(t);let n=typeof t=="function"?t():t;return n?this.input.screen({pos:n,radius:e||.05}):null}update(t){if(!this.target)return;if(this.input.p.down){this.poke();return}this.idle+=t;let e=(this.opts.delay??3.5)*this.delayScale;if(this.idle<e)return;let n=this._screen(this.target,this.opts.radius);if(!n){this._hide();return}let s=Math.max(70,n.r*2.3);this.halo.style.width=this.halo.style.height=s+"px",this.halo.style.margin=`${-s/2}px 0 0 ${-s/2}px`,this.halo.style.left=n.x+"px",this.halo.style.top=n.y+"px",this.shown||(this.halo.classList.add("on"),this.shown=!0);let r=this.opts.hand;if(r&&this.idle>e+2.5&&(this.idle-e-2.5)%12<4.8){this.handT=(this.idle-e-2.5)%12;let o=2.4,a=this.handT%o/o,l=n.x,c=n.y,h=1;if(r==="tap")h=a<.25?1-Math.sin(a/.25*Math.PI)*.16:1,c+=6;else if(r==="drag"){let u=this._screen(this.opts.to,.05)||{x:n.x+120,y:n.y},d=Math.min(1,Math.max(0,(a-.15)/.6)),f=d*d*(3-2*d);l=n.x+(u.x-n.x)*f,c=n.y+(u.y-n.y)*f}else if(r==="circle"){let u=a*Math.PI*2,d=(this.opts.circleR||.6)*n.r;l=n.x+Math.cos(u)*d,c=n.y+Math.sin(u)*d*.6}else if(r==="turn"){let u=Math.sin(a*Math.PI);l=n.x+(u-.2)*90,c=n.y+10-u*18}this.hand.style.left=l+"px",this.hand.style.top=c+"px",this.hand.style.transform=`scale(${h})`,this.hand.classList.add("on")}else this.hand.classList.remove("on")}};var Br=class{constructor({max:t=64,texture:e,blending:n=gs,depthTest:s=!0,sizeScale:r=1}={}){this.max=t,this.n=0,this.p=new Float32Array(t*3),this.v=new Float32Array(t*3),this.life=new Float32Array(t),this.age=new Float32Array(t).fill(1e9),this.s0=new Float32Array(t),this.s1=new Float32Array(t),this.a0=new Float32Array(t),this.grav=new Float32Array(t),this.drag=new Float32Array(t),this.col=new Float32Array(t*3),this.rot=new Float32Array(t);let o=new To;o.setAttribute("position",new xe([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),o.setIndex([0,1,2,0,2,3]),this.aPos=new li(new Float32Array(t*3),3),this.aPos.setUsage(Uo),this.aData=new li(new Float32Array(t*3),3),this.aData.setUsage(Uo),this.aCol=new li(new Float32Array(t*3),3),this.aCol.setUsage(Uo),o.setAttribute("ipos",this.aPos),o.setAttribute("data",this.aData),o.setAttribute("pcolor",this.aCol),o.instanceCount=t,o.boundingSphere=new Ii(new I,100),this.mat=new Yn({uniforms:{map:{value:e}},vertexShader:`attribute vec3 ipos; attribute vec3 data; attribute vec3 pcolor; varying float vA; varying vec3 vC; varying vec2 vUv;
        void main(){ vec4 mv = viewMatrix * vec4(ipos, 1.0); float c = cos(data.z), s = sin(data.z); vec2 q = vec2(c * position.x - s * position.y, s * position.x + c * position.y) * data.x;
          mv.xy += q; gl_Position = projectionMatrix * mv; vA = data.y; vC = pcolor; vUv = position.xy + 0.5; }`,fragmentShader:`uniform sampler2D map; varying float vA; varying vec3 vC; varying vec2 vUv;
        void main(){ vec4 t = texture2D(map, vUv); gl_FragColor = vec4(t.rgb * vC, t.a * vA); if (gl_FragColor.a < 0.003) discard;
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,transparent:!0,depthWrite:!1,depthTest:s,blending:n}),this.points=new tt(o,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=20,this.cursor=0,this.alive=0}setViewport(){}emit({x:t,y:e,z:n,vx:s=0,vy:r=0,vz:o=0,life:a=1,s0:l=.02,s1:c=.06,alpha:h=.5,grav:u=0,drag:d=0,r:f=1,g:p=1,b:x=1}){let g=this.cursor;this.cursor=(this.cursor+1)%this.max,this.p[g*3]=t,this.p[g*3+1]=e,this.p[g*3+2]=n,this.v[g*3]=s,this.v[g*3+1]=r,this.v[g*3+2]=o,this.life[g]=a,this.age[g]=0,this.s0[g]=l,this.s1[g]=c,this.a0[g]=h,this.grav[g]=u,this.drag[g]=d,this.col[g*3]=f,this.col[g*3+1]=p,this.col[g*3+2]=x,this.rot[g]=Math.random()*6.28}update(t){let e=this.aPos.array,n=this.aData.array,s=this.aCol.array,r=0;for(let o=0;o<this.max;o++){let a=o*3;if(this.age[o]>=this.life[o]){n[a]=0,n[a+1]=0;continue}r++,this.age[o]+=t;let l=Math.min(1,this.age[o]/this.life[o]),c=Math.exp(-this.drag[o]*t);this.v[a]*=c,this.v[a+1]=this.v[a+1]*c-this.grav[o]*t,this.v[a+2]*=c,this.p[a]+=this.v[a]*t,this.p[a+1]+=this.v[a+1]*t,this.p[a+2]+=this.v[a+2]*t,e[a]=this.p[a],e[a+1]=this.p[a+1],e[a+2]=this.p[a+2],n[a]=this.s0[o]+(this.s1[o]-this.s0[o])*l,n[a+1]=this.a0[o]*Math.min(1,l*6)*(1-l)*(1-l*.3),n[a+2]=this.rot[o]+l*.6,s[a]=this.col[a],s[a+1]=this.col[a+1],s[a+2]=this.col[a+2]}this.alive=r,this.points.visible=r>0,(r>0||this._dirty)&&(this.aPos.needsUpdate=!0,this.aData.needsUpdate=!0,this.aCol.needsUpdate=!0),this._dirty=r>0}};function y0(i){let t={};return t.steam=new Br({max:160,texture:ct.steam}),i.add(t.steam.points),t.spark=new Br({max:90,texture:ct.sparkle,blending:xs,depthTest:!1}),i.add(t.spark.points),t.drops=new Br({max:140,texture:ct.dot}),i.add(t.drops.points),t.sparkleBurst=(e,n=8,s=.08,r=[1,.95,.7])=>{for(let o=0;o<n;o++){let a=Math.random()*6.28,l=Math.random()*3.14,c=s*(.4+Math.random());t.spark.emit({x:e.x+Math.cos(a)*Math.sin(l)*c*.5,y:e.y+Math.cos(l)*c*.5+.01,z:e.z+Math.sin(a)*Math.sin(l)*c*.5,vx:Math.cos(a)*c*.9,vy:.08+Math.random()*.12,vz:Math.sin(a)*c*.9,life:.7+Math.random()*.6,s0:.012,s1:.045+Math.random()*.03,alpha:.95,drag:2.2,r:r[0],g:r[1],b:r[2]})}},t.splash=(e,n,s,r=6,o=1)=>{for(let a=0;a<r;a++){let l=Math.random()*6.28,c=(.12+Math.random()*.3)*o;t.drops.emit({x:e,y:n+.003,z:s,vx:Math.cos(l)*c,vy:(.35+Math.random()*.6)*o,vz:Math.sin(l)*c,life:.35+Math.random()*.25,s0:.006,s1:.003,alpha:.75,grav:5,r:.92,g:.96,b:1})}},t.puff=(e,n,s,r=3,o=.12,a=.2)=>{for(let l=0;l<r;l++)t.steam.emit({x:e+(Math.random()-.5)*.04,y:n,z:s+(Math.random()-.5)*.04,vx:(Math.random()-.5)*.04,vy:.08+Math.random()*.08,vz:(Math.random()-.5)*.04,life:1.4+Math.random(),s0:o*.3,s1:o*(.8+Math.random()*.6),alpha:a,drag:.6})},Ys(e=>{let n=S.renderer.domElement.height/S.renderer.getPixelRatio()*S.renderer.getPixelRatio(),s=S.camera.fov;for(let r of[t.steam,t.spark,t.drops])r.setViewport(n,s),r.update(e)}),t}function bs(i=.005){let t=new Me(1,.8,1,12,8,!0);t.translate(0,-.5,0);let e=new Ge({color:15398655,roughness:.04,metalness:0,transparent:!0,opacity:.42,envMapIntensity:1.8,normalMap:ct.waterNormal,normalScale:new xt(.6,.6),depthWrite:!1});e.normalMap=ct.waterNormal.clone(),e.normalMap.wrapS=e.normalMap.wrapT=Ri,e.normalMap.repeat.set(1,3),e.normalMap.needsUpdate=!0;let n=new tt(t,e);n.visible=!1,n.renderOrder=6,n.userData.radius=i,n.userData.flow=0;let s=new I(0,-1,0),r=new I;return n.userData.set=(o,a,l,c)=>{if(n.userData.flow=l,n.visible=l>.01,!n.visible)return;r.subVectors(a,o);let h=r.length();n.position.copy(o),n.quaternion.setFromUnitVectors(s,r.normalize());let u=i*Math.sqrt(l)*(1+.06*Math.sin(c*40));n.scale.set(u,h,u),e.normalMap.offset.y=-c*2.2},n}var Wo=.012,Xo=.047,Js=gt.counterY+Wo+Xo;function _0({lenScale:i,width:t,alpha:e,inner:n,outer:s,tip:r}){return new Yn({uniforms:{uHeat:{value:0},uTime:{value:0},uLit:{value:0},uTilt:{value:.9},uCurl:{value:.3},uRing:{value:.037},uLen:{value:i},uWidth:{value:t},uAlpha:{value:e},cInner:{value:new Ut(...n)},cOuter:{value:new Ut(...s)},cTip:{value:new Ut(...r)}},vertexShader:`
      attribute float aAng; attribute float aSeed;
      uniform float uHeat, uTime, uLit, uTilt, uCurl, uRing, uLen, uWidth;
      varying float vT; varying float vEdge; varying float vOn;
      void main(){
        float t = position.y;
        float on = smoothstep(0.0, 0.08, uLit * 1.1 - aAng / 6.2832);
        float flick = 0.86 + 0.12 * sin(uTime * (9.0 + aSeed * 7.0) + aSeed * 40.0) + 0.06 * sin(uTime * 23.0 + aSeed * 11.0);
        float len = uLen * mix(0.016, 0.088, uHeat) * flick * on;
        float wid = uWidth * mix(0.005, 0.0125, uHeat) * (0.6 + 0.4 * on);
        float outD = len * t * cos(uTilt);
        float upD = len * (t * sin(uTilt) + uCurl * t * t);
        float tang = position.z * wid + sin(uTime * 13.0 + aSeed * 30.0 + t * 4.0) * 0.0016 * t;
        float r = uRing + outD + position.x * wid * 0.35;
        float y = upD + position.x * wid * 0.9 + 0.001;
        float ca = cos(aAng), sa = sin(aAng);
        vec3 p = vec3(ca * r - sa * tang, y, sa * r + ca * tang);
        vec3 n = normalize(vec3(ca * normal.x - sa * normal.z, normal.x * 0.9, sa * normal.x + ca * normal.z));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vEdge = abs(normalize(normalMatrix * n).z);
        vT = t; vOn = on;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform float uAlpha, uHeat; uniform vec3 cInner, cOuter, cTip;
      varying float vT; varying float vEdge; varying float vOn;
      void main(){
        vec3 col = mix(cInner, cOuter, smoothstep(0.0, 0.5, vT));
        col = mix(col, cTip, smoothstep(0.55, 1.0, vT));
        float a = pow(1.0 - vT, 1.25) * uAlpha * mix(1.0, 0.45, vEdge) * vOn;
        a *= smoothstep(0.0, 0.06, vT) * 0.85 + 0.15;
        gl_FragColor = vec4(col * a, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,transparent:!0,depthWrite:!1,blending:xs,side:Ce})}function Ky(){let i=he(256),t=i.getContext("2d");t.translate(128,128);let e=(n,s)=>{let r=n*Math.PI/180,o=98,a=Math.sin(r)*o,l=-Math.cos(r)*o;t.save(),t.translate(a,l),t.scale(s,s),t.beginPath(),t.moveTo(0,-13),t.bezierCurveTo(9,-3,9,5,0,10),t.bezierCurveTo(-9,5,-9,-3,0,-13),t.closePath(),t.fillStyle="rgba(226,229,233,0.9)",t.fill(),t.restore()};t.strokeStyle="rgba(226,229,233,0.9)",t.lineWidth=4,t.beginPath(),t.arc(0,-98,8,0,6.3),t.stroke(),e(38,.75),e(90,1.15),e(144,1.7);for(let n=0;n<40;n++){let s=(18+n*2.9)*Math.PI/180-Math.PI/2;t.beginPath(),t.lineWidth=1.5+n*.16,t.strokeStyle="rgba(226,229,233,0.6)",t.arc(0,0,72,s,s+.06),t.stroke()}return Ot(i,{srgb:!0})}var jh=null,ic=class{constructor(t,e,n,s=!0){this.name=n,this.pos=e.clone(),this.value=0,this.shown=0,this.lit=!1,this.heat=0,this.hasPot=!1,this.litAnim=0,this.pressed=0,this.grab=!1,this.enabled=!0,this.detent=0,this.sparkT=0,this.onGrab=null,this.onRelease=null,this.onLit=null,this.onOff=null;let r=new dt;r.position.set(e.x,gt.counterY+Wo,e.z),t.add(r),this.group=r;let o=s?1:.86;r.add(ne([[0,6e-4],[.05*o,6e-4],[.092*o,.0022],[.1*o,.0034],[.104*o,.001]],q.blackEnamel,48)),r.add(ne([[0,0],[.046*o,0],[.046*o,.008],[.04*o,.014],[.038*o,.02]],q.burnerBody,40));let a=(()=>{let y=he(256,16),T=y.getContext("2d");T.fillStyle="#b79a62",T.fillRect(0,0,256,16),T.fillStyle="#1a1208";for(let F=0;F<30;F++)T.fillRect(F*(256/30)+2,3,3.2,10);return Ot(y,{srgb:!0})})(),l=new tt(new Me(.037*o,.038*o,.008,48,1,!0),new He({map:a,metalness:.9,roughness:.45}));l.position.y=.024,r.add(l),r.add(ne([[0,.034],[.026*o,.034],[.034*o,.031],[.036*o,.028],[.034*o,.027],[0,.027]],q.blackEnamel,40));let c=new tt(new Me(.0022,.0022,.022,8),q.ceramic);c.position.set(.05*o,.012,.012),r.add(c);let h=new dt;r.add(h);let u=new tt(new hi(.118*o,.0055,10,56),q.castIron);u.rotation.x=Math.PI/2,u.position.y=.022,u.castShadow=!0,h.add(u);for(let y=0;y<5;y++){let T=y/5*Math.PI*2+.3,F=new dt;F.rotation.y=-T,h.add(F);let O=Lt(.09*o,.012,.011,q.castIron,.004,1);O.position.set(.078*o,Xo-.006,0),F.add(O);let N=Lt(.011,Xo-.004,.011,q.castIron,.004,1);N.position.set(.118*o,(Xo-.004)/2,0),F.add(N);let B=Lt(.01,.014,.01,q.castIron,.003,1);B.position.set(.04*o,Xo-.016,0),F.add(B)}let d=30,f=new Li(1,1,7,5,!0);f.translate(0,.5,0);let p=new Float32Array(d),x=new Float32Array(d);for(let y=0;y<d;y++)p[y]=y/d*Math.PI*2,x[y]=Math.sin(y*12.9898)*43758.5453%1,x[y]=Math.abs(x[y]);let g=y=>{let T=f.clone();T.setAttribute("aAng",new li(p,1)),T.setAttribute("aSeed",new li(x,1));let F=new Yi(T,y,d);return F.frustumCulled=!1,F.position.y=.0235,F.renderOrder=8,F.visible=!1,r.add(F),F};this.fOuter=g(_0({lenScale:1,width:1,alpha:.55,inner:[.16,.5,1],outer:[.04,.17,.95],tip:[.2,.12,.8]})),this.fInner=g(_0({lenScale:.42,width:.55,alpha:.38,inner:[.45,.9,1],outer:[.2,.62,1],tip:[.12,.4,1]}));for(let y of[this.fOuter,this.fInner])y.material.uniforms.uRing.value=.037*o;this.light=new Ji(5213439,0,.5,1.6),this.light.position.set(0,.03,0),r.add(this.light),this.glow=new tt(new ce(.34,.34),new Ue({map:ct.dot,color:3108095,transparent:!0,opacity:0,depthWrite:!1,blending:xs})),this.glow.rotation.x=-Math.PI/2,this.glow.position.y=.0045,this.glow.renderOrder=2,r.add(this.glow);let m=gt.hob.z+gt.hob.d/2-.055,_=new dt;_.position.set(e.x,gt.counterY+Wo,m),t.add(_),this.knobGroup=_,jh||(jh=Ky());let v=new tt(new ce(.118,.118),new Ue({map:jh,transparent:!0,depthWrite:!1,opacity:.8,color:12106946}));v.rotation.x=-Math.PI/2,v.position.y=6e-4,v.renderOrder=2,_.add(v),_.add(ne([[0,0],[.0265,0],[.0265,.003],[.024,.005],[0,.005]],q.blackPlastic,40));let M=new dt;M.position.y=.005,_.add(M),this.knob=M,M.add(ne([[.0225,0],[.0225,.002],[.0215,.016],[.0195,.0225],[.016,.025],[0,.025]],q.steelTurned,48));let b=Lt(.0125,.012,.043,q.steel,.0045,3);b.position.y=.029,M.add(b);let w=new tt(new yi(.0032,.0012,.013),new He({color:15221806,roughness:.5}));w.position.set(0,.0352,-.013),M.add(w);{let y=qe(ct.blob,.085,.085,.38);y.position.y=4e-4,_.add(y)}this.knobTop=new I(e.x,gt.counterY+Wo+.02,m),this.flameCenter=new I(e.x,gt.counterY+Wo+.035,e.z),this.item=S.input.add({name:"knob-"+n,pos:this.knobTop,radius:.034,minPx:46,grow:1.5,priority:.2,enabled:!1,onDown:()=>{this.grab=!0,this._startV=this.value,this._acc=0,this.onGrab&&this.onGrab(this),S.audio&&S.audio.knobPress()},onMove:y=>{let T=S.input.canvas.clientHeight;this._acc+=(y.dx+-y.dy*.45)/(T*.2),this.setValue(re(this._startV+this._acc,0,1))},onUp:y=>{if(this.grab=!1,y.moved<14){let T=[0,.36,.68,1],F=T.findIndex(O=>Math.abs(O-this.value)<.12);F<0&&(F=this.value>.84?3:this.value>.5?2:1),this.setValue(T[(F+1)%T.length])}else this.value<.1&&this.setValue(0);this.onRelease&&this.onRelease(this)}}),Ys((y,T)=>this.update(y,T))}setValue(t){this.value=re(t,0,1)}get targetHeat(){return this.value<.08?0:.12+.88*Ur(.08,1,this.value)}reset(t=0){this.value=this.shown=t,this.lit=t>=.08,this.heat=this.targetHeat,this.litAnim=this.lit?1:0,this.detent=Math.round(t*12),this.sparkT=0,this.grab=!1}update(t,e){let n=S.audio,s=this.shown;this.shown=Jt(this.shown,this.value,22,t),Math.abs(this.shown-this.value)<.002&&(this.shown=this.value);let r=Math.round(this.shown*12);r!==this.detent&&(this.detent=r,n&&n.knobClick(.5+this.shown*.3)),!this.lit&&this.shown>=.08?(this.sparkT+=t,this._sparkN===void 0&&(this._sparkN=0),this.sparkT>this._sparkN*.085&&(this._sparkN++,n&&n.spark()),this._sparkN>=3&&(this.lit=!0,this._sparkN=0,this.sparkT=0,n&&n.ignite(),this.onLit&&this.onLit(this))):this.lit||(this.sparkT=0,this._sparkN=0),this.lit&&this.shown<.07&&(this.lit=!1,n&&n.puff(),S.fx&&S.fx.sparkleBurst(this.flameCenter,7,.07),this.onOff&&this.onOff(this)),this.litAnim=Jt(this.litAnim,this.lit?1:0,this.lit?7:14,t);let o=this.lit?this.targetHeat:0;this.heat=Jt(this.heat,o,o>this.heat?9:6,t),this.heat<.002&&(this.heat=0),this.pressed=Jt(this.pressed,this.grab?1:0,30,t),this.knob.rotation.y=-this.shown*(150*Math.PI/180),this.knob.position.y=.005-this.pressed*.0022;let a=this.litAnim>.01&&this.heat>.001;if(this.fOuter.visible=this.fInner.visible=a,a)for(let c of[this.fOuter,this.fInner]){let h=c.material.uniforms;h.uHeat.value=this.heat,h.uTime.value=e,h.uLit.value=this.litAnim,h.uTilt.value=this.hasPot?Ht(.5,.2,this.heat):.95,h.uCurl.value=this.hasPot?.22:.5}let l=.9+.1*Math.sin(e*31)*Math.sin(e*17.3);this.light.intensity=this.heat*this.litAnim*.35*l,this.glow.material.opacity=this.heat*this.litAnim*.15*l,n&&n.setHiss(this.name,this.heat*this.litAnim)}};function jy(){let i=new dt,t=ne([[0,0],[.078,0],[.086,.006],[.09,.03],[.086,.07],[.07,.1],[.05,.113],[.036,.116]],q.steelPolished,48,{smooth:4});i.add(t),i.add(ne([[.037,.115],[.037,.12],[.03,.124],[.012,.126],[.01,.132],[.014,.142],[0,.146]],q.blackPlastic,28).translateY(0));let e=Rn([new I(.07,.05,0),new I(.1,.07,0),new I(.118,.1,0),new I(.132,.112,0)],.011,q.steelPolished,16,10);i.add(e);let n=Rn([new I(-.06,.1,0),new I(-.07,.17,0),new I(0,.2,0),new I(.07,.17,0),new I(.06,.1,0)],.007,q.blackPlastic,28,8);return i.add(n),i.userData.spout=new I(.134,.115,0),i}function v0(i){let t=new ic(i,gt.burnerMain,"main",!0),e=new ic(i,gt.burnerSide,"side",!1),n=jy();return n.position.set(gt.burnerSide.x,Js-.004,gt.burnerSide.z),n.rotation.y=.7,i.add(n),e.hasPot=!0,{main:t,side:e,kettle:n}}var yt=96,ue={rIn:.105,rOut:.112,h:.118,floor:.007,maxDepth:.072},sc=i=>new Ut(i),rc=class{constructor(t){this.scene=t,this.group=new dt,t.add(this.group),this.rng=de(1234),this.burner=null,this._buildPot(),this._buildSim(),this._buildLiquid(),this._buildBubbles(),this._buildLadle(),this._buildLid(),this.chunks=[],this.roux=[],this.onPop=null,this.onLidHop=null,this.reset()}_buildPot(){let t=this.group,e=ue,n=ne([[0,0],[.088,0],[.1,.004],[.107,.014],[e.rOut,.04],[e.rOut+.001,e.h-.004],[e.rOut+.0025,e.h]],q.enamel,64,{smooth:3});t.add(n);let s=ne([[e.rOut+5e-4,e.h],[e.rIn+.001,e.h-.001],[e.rIn,e.h-.012],[e.rIn-.001,.03],[e.rIn-.008,.012],[e.rIn-.02,e.floor],[0,e.floor]],q.enamelInner,64,{smooth:3});s.castShadow=!1,t.add(s);let r=new tt(new hi(e.rOut-.0015,.0034,10,64),q.steelPolished);r.rotation.x=Math.PI/2,r.position.y=e.h,t.add(r);for(let a of[-1,1]){let l=Rn([new I(a*(e.rOut-.004),e.h-.022,-.034),new I(a*(e.rOut+.022),e.h-.02,-.03),new I(a*(e.rOut+.03),e.h-.019,0),new I(a*(e.rOut+.022),e.h-.02,.03),new I(a*(e.rOut-.004),e.h-.022,.034)],.0062,q.enamel,24,10);t.add(l)}this.shadow=qe(ct.blob,.36,.36,.45),this.shadow.position.y=-.03,t.add(this.shadow);let o=new tt(new yn(e.rIn-.018,40),new Ue({map:ct.dot,color:0,transparent:!0,opacity:0,depthWrite:!1}));o.rotation.x=-Math.PI/2,o.position.y=e.floor+6e-4,t.add(o)}_buildSim(){let t=yt*yt;this.u=new Float32Array(t),this.v=new Float32Array(t),this.u2=new Float32Array(t),this.v2=new Float32Array(t),this.c=new Float32Array(t),this.c2=new Float32Array(t),this.m=new Float32Array(t),this.m2=new Float32Array(t),this.m0=new Float32Array(t),this.h=new Float32Array(t),this.hv=new Float32Array(t),this.gs=new Float32Array(t),this.gs2=new Float32Array(t),this.pr=new Float32Array(t),this.pr2=new Float32Array(t),this.div=new Float32Array(t),this.mask=new Uint8Array(t),this.rad=new Float32Array(t);for(let e=0;e<yt;e++)for(let n=0;n<yt;n++){let s=(n+.5)/yt*2-1,r=(e+.5)/yt*2-1,o=Math.hypot(s,r),a=e*yt+n;this.rad[a]=o,this.mask[a]=o<.985?1:0,this.m0[a]=re(.5+(vs(s*9+20,r*9+20,7)-.5)*1.3+(vs(s*22,r*22,9)-.5)*.7)}this.texData=new Uint16Array(t*4),this.tex=new ks(this.texData,yt,yt,ni,ei),this.tex.magFilter=this.tex.minFilter=xn,this.tex.wrapS=this.tex.wrapT=oi,this.tex.needsUpdate=!0,this.simAcc=0}clearSim(){for(let t of[this.u,this.v,this.c,this.h,this.hv,this.gs,this.pr])t.fill(0);this.m.set(this.m0)}sample(t,e,n){let s=(e*.5+.5)*yt-.5,r=(n*.5+.5)*yt-.5;s=re(s,0,yt-1.001),r=re(r,0,yt-1.001);let o=s|0,a=r|0,l=s-o,c=r-a,h=a*yt+o;return(t[h]*(1-l)+t[h+1]*l)*(1-c)+(t[h+yt]*(1-l)+t[h+yt+1]*l)*c}splat(t,e,n,s,r){let o=(e*.5+.5)*yt-.5,a=(n*.5+.5)*yt-.5,l=s*yt*.5,c=l*l,h=Math.max(1,Math.floor(o-l*2)),u=Math.min(yt-2,Math.ceil(o+l*2)),d=Math.max(1,Math.floor(a-l*2)),f=Math.min(yt-2,Math.ceil(a+l*2));for(let p=d;p<=f;p++)for(let x=h;x<=u;x++){let g=(x-o)*(x-o)+(p-a)*(p-a);t[p*yt+x]+=r*Math.exp(-g/c)}}ringImpulse(t,e,n,s){let r=(t*.5+.5)*yt-.5,o=(e*.5+.5)*yt-.5,a=n*yt*.5,l=Math.max(1,Math.floor(r-a*2)),c=Math.min(yt-2,Math.ceil(r+a*2)),h=Math.max(1,Math.floor(o-a*2)),u=Math.min(yt-2,Math.ceil(o+a*2));for(let d=h;d<=u;d++)for(let f=l;f<=c;f++){let p=Math.hypot(f-r,d-o)/a;this.hv[d*yt+f]+=s*(Math.exp(-(p-1)*(p-1)*6)-.9*Math.exp(-p*p*3))}}_advect(t,e,n){let s=this.u,r=this.v,o=n*yt*.5,a=yt-1.001;for(let l=1;l<yt-1;l++)for(let c=1;c<yt-1;c++){let h=l*yt+c,u=c-s[h]*o,d=l-r[h]*o;u=u<0?0:u>a?a:u,d=d<0?0:d>a?a:d;let f=u|0,p=d|0,x=u-f,g=d-p,m=p*yt+f;e[h]=(t[m]*(1-x)+t[m+1]*x)*(1-g)+(t[m+yt]*(1-x)+t[m+yt+1]*x)*g}}_simStep(t){let{u:e,v:n,u2:s,v2:r,c:o,c2:a,m:l,m2:c,m0:h,h:u,hv:d,gs:f,gs2:p,pr:x,pr2:g,div:m,mask:_,rad:v}=this,M=this.s,b=M.thick,w=yt*yt,y=this.ladle;if(y.inLiquid){let U=Math.hypot(y.vx,y.vz);if(U>.01){let C=(y.x*.5+.5)*yt-.5,P=(y.z*.5+.5)*yt-.5,X=.3*yt*.5,D=X*X,W=Math.min(1,t*14),K=Math.max(1,Math.floor(C-X*1.8)),ut=Math.min(yt-2,Math.ceil(C+X*1.8)),Pt=Math.max(1,Math.floor(P-X*1.8)),Z=Math.min(yt-2,Math.ceil(P+X*1.8));for(let Rt=Pt;Rt<=Z;Rt++)for(let Gt=K;Gt<=ut;Gt++){let wt=Rt*yt+Gt,$t=(Gt-C)*(Gt-C)+(Rt-P)*(Rt-P),Te=Math.exp(-$t/D)*W;e[wt]+=(y.vx-e[wt])*Te,n[wt]+=(y.vz-n[wt])*Te}let ft=Math.min(1,U*.6)*t;this.splat(f,y.x,y.z,.16,-.022*ft*(.4+b)),this.splat(d,y.x+y.vx/(U+.001)*.16,y.z+y.vz/(U+.001)*.16,.14,.05*Math.min(1.5,U)*(1-b*.6)*t*60*.016)}}let T=Math.exp(-t*(.45+4.2*b*b+1.2*b));for(let U=0;U<w;U++){if(!_[U]){e[U]=0,n[U]=0;continue}let C=v[U]>.86?T*(1-(v[U]-.86)*2.2*Math.min(1,t*30)):T;e[U]*=C,n[U]*=C}for(let U=1;U<yt-1;U++)for(let C=1;C<yt-1;C++){let P=U*yt+C;m[P]=_[P]?.5*(e[P+1]-e[P-1]+n[P+yt]-n[P-yt]):0}let F=x,O=g;for(let U=0;U<8;U++){for(let P=1;P<yt-1;P++)for(let X=1;X<yt-1;X++){let D=P*yt+X;if(!_[D]){O[D]=0;continue}let W=F[D];O[D]=((_[D-1]?F[D-1]:W)+(_[D+1]?F[D+1]:W)+(_[D-yt]?F[D-yt]:W)+(_[D+yt]?F[D+yt]:W)-m[D])*.25}let C=F;F=O,O=C}F!==x&&x.set(F);for(let U=1;U<yt-1;U++)for(let C=1;C<yt-1;C++){let P=U*yt+C;if(!_[P])continue;let X=x[P];if(e[P]-=.5*((_[P+1]?x[P+1]:X)-(_[P-1]?x[P-1]:X)),n[P]-=.5*((_[P+yt]?x[P+yt]:X)-(_[P-yt]?x[P-yt]:X)),v[P]>.9){let D=(C+.5)/yt*2-1,W=(U+.5)/yt*2-1,K=v[P],ut=(e[P]*D+n[P]*W)/K;ut>0&&(e[P]-=ut*D/K,n[P]-=ut*W/K)}}if(this._advect(e,s,t),this._advect(n,r,t),e.set(s),n.set(r),M.level>.02){this._advect(o,a,t),this._advect(l,c,t);let U=0,C=0;for(let D=0;D<w;D+=7)_[D]&&(U+=a[D],C++);U/=C||1,this.meanC=U;let P=t*(.02+.1*M.boil),X=t*.12;for(let D=0;D<w;D++)o[D]=a[D]+(U-a[D])*P,l[D]=c[D]+(h[D]-c[D])*X}let N=Ht(820,150,b),B=Math.exp(-t*Ht(1.6,10,b));for(let U=1;U<yt-1;U++)for(let C=1;C<yt-1;C++){let P=U*yt+C;if(!_[P]){u[P]=0,d[P]=0;continue}let X=u[P],D=(_[P-1]?u[P-1]:X)+(_[P+1]?u[P+1]:X)+(_[P-yt]?u[P-yt]:X)+(_[P+yt]?u[P+yt]:X)-4*X;d[P]=(d[P]+(N*D-30*X)*t)*B}let G=Math.exp(-t/Ht(.1,2.2,b)),E=Ht(10,3.5,b)*t;for(let U=1;U<yt-1;U++)for(let C=1;C<yt-1;C++){let P=U*yt+C;u[P]+=d[P]*t,u[P]>.006?u[P]=.006:u[P]<-.006&&(u[P]=-.006);let X=f[P];p[P]=(X+E*((_[P-1]?f[P-1]:X)+(_[P+1]?f[P+1]:X)+(_[P-yt]?f[P-yt]:X)+(_[P+yt]?f[P+yt]:X)-4*X))*G}f.set(p)}_uploadSim(){let t=this.texData,e=lo.toHalfFloat,{c:n,m:s,h:r,gs:o}=this,a=yt*yt;for(let l=0,c=0;l<a;l++,c+=4)t[c]=e(n[l]>8?8:n[l]),t[c+1]=e(s[l]),t[c+2]=e(r[l]+o[l]),t[c+3]=15360;this.tex.needsUpdate=!0}_buildLiquid(){let n=[],s=[],r=[];n.push(0,0,0),s.push(.5,.5);for(let _=1;_<=44;_++)for(let v=0;v<80;v++){let M=Math.pow(_/44,.85),b=v/80*Math.PI*2,w=Math.cos(b)*M,y=Math.sin(b)*M;n.push(w,0,y),s.push(w*.5+.5,y*.5+.5)}for(let _=0;_<80;_++)r.push(0,1+(_+1)%80,1+_);for(let _=1;_<44;_++)for(let v=0;v<80;v++){let M=1+(_-1)*80+v,b=1+(_-1)*80+(v+1)%80,w=M+80,y=b+80;r.push(M,b,w,b,y,w)}let o=new un;o.setAttribute("position",new xe(n,3)),o.setAttribute("uv",new xe(s,2)),o.setAttribute("normal",new xe(new Float32Array(n.length).map((_,v)=>v%3===1?1:0),3)),o.setIndex(r);let a=he(256),l=a.getContext("2d"),c=Jn(256,{seed:301,baseX:12,baseY:12,oct:4}),h=Jn(256,{seed:302,baseX:26,baseY:26,oct:2}),u=Jn(256,{seed:303,baseX:5,baseY:5,oct:3}),d=c.getContext("2d").getImageData(0,0,256,256).data,f=h.getContext("2d").getImageData(0,0,256,256).data,p=u.getContext("2d").getImageData(0,0,256,256).data,x=l.createImageData(256,256);for(let _=0;_<256*256*4;_+=4)x.data[_]=d[_],x.data[_+1]=f[_],x.data[_+2]=p[_],x.data[_+3]=255;l.putImageData(x,0,0),this.detailTex=Ot(a,{repeat:[1,1]});let g=this.uni={tSim:{value:this.tex},tDetail:{value:this.detailTex},uThick:{value:0},uTime:{value:0},uTexel:{value:1/yt},uCell:{value:2*ue.rIn/yt},uBroth:{value:sc(13281376)},uLight:{value:sc(10117660)},uDark:{value:sc(6042128)},uOil:{value:sc(14256668)},uWaterA:{value:.3},uBoil:{value:0},uSaute:{value:0}},m=new Ge({color:16777215,roughness:.1,metalness:0,transparent:!0,envMapIntensity:.62,clearcoat:0,specularIntensity:1,blending:Ao,blendSrc:Vs,blendDst:ys,blendSrcAlpha:Vs,blendDstAlpha:ys});m.onBeforeCompile=_=>{Object.assign(_.uniforms,g),_.vertexShader=_.vertexShader.replace("#include <common>",`#include <common>
uniform sampler2D tSim; varying vec2 vSim;`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vSim = uv; transformed.y += texture2D(tSim, uv).b;`),_.fragmentShader=_.fragmentShader.replace("#include <common>",`#include <common>
        uniform sampler2D tSim; uniform sampler2D tDetail; uniform float uThick, uTime, uTexel, uCell, uWaterA, uBoil, uSaute; uniform vec3 uBroth, uLight, uDark, uOil; varying vec2 vSim;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          vec4 s = texture2D(tSim, vSim);
          float hL = texture2D(tSim, vSim - vec2(uTexel, 0.0)).b, hR = texture2D(tSim, vSim + vec2(uTexel, 0.0)).b;
          float hD = texture2D(tSim, vSim - vec2(0.0, uTexel)).b, hU = texture2D(tSim, vSim + vec2(0.0, uTexel)).b;
          vec3 det = texture2D(tDetail, vSim * 2.1 + vec2(s.g * 0.12, -s.g * 0.09)).rgb;
          vec3 det2 = texture2D(tDetail, vSim * 4.7 + vec2(uTime * 0.01, s.g * 0.2)).rgb;
          float cc = max(s.r + (det.r - 0.5) * 0.5 * smoothstep(0.02, 0.5, s.r), 0.0);
          float cur = 1.0 - exp(-2.7 * cc);
          cur = mix(cur, smoothstep(0.25, 0.75, cur), 0.5);
          float shade = clamp(0.3 + (s.r - 1.0) * 0.45 + (s.g - 0.5) * 1.1 + (det.b - 0.5) * 0.5, 0.0, 1.0);
          vec3 curry = mix(uLight, uDark, shade);
          vec3 broth = mix(uBroth, uBroth * vec3(0.95, 0.86, 0.62), uSaute);
          vec3 col = mix(broth, curry, cur);
          float rr = length(vSim - 0.5) * 2.0;
          col *= mix(1.0, 0.72, smoothstep(0.86, 1.0, rr) * cur);
          // small ripples (water) / fine skin (curry)
          vec2 rip = (texture2D(tDetail, vSim * 3.0 + vec2(uTime * 0.05, uTime * 0.035)).rb - 0.5) + (texture2D(tDetail, vSim * 3.7 - vec2(uTime * 0.04, -uTime * 0.03)).br - 0.5);
          float ripA = mix(0.05 + uBoil * 0.3, 0.035 + uBoil * 0.06, cur);
          vec3 nObj = normalize(vec3(-(hR - hL) / (2.0 * uCell) + rip.x * ripA, 1.0, -(hU - hD) / (2.0 * uCell) + rip.y * ripA));
          normal = normalize(mat3(viewMatrix) * nObj);
          float fres = pow(1.0 - clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0), 3.0);
          // oil droplets floating on top
          float oil = smoothstep(0.6, 0.68, det2.g) * smoothstep(0.15, 0.6, cur + uSaute * 0.6);
          col = mix(col, mix(uOil, col * 1.5, 0.35), oil * 0.5);
          diffuseColor.a = mix(uWaterA + fres * 0.3, 1.0, cur);
          diffuseColor.rgb = col * diffuseColor.a;
          roughnessFactor = mix(0.035, mix(0.2, 0.13, uThick) + (det2.r - 0.5) * 0.08, cur);
          roughnessFactor = mix(roughnessFactor, 0.05, oil);
        }`)},this.liquid=new tt(o,m),this.liquid.receiveShadow=!0,this.liquid.renderOrder=3,this.liquid.frustumCulled=!1,this.group.add(this.liquid)}liquidRadius(t){let e=re((t-ue.floor)/.024);return Ht(ue.rIn-.02,ue.rIn-.0012,Math.sqrt(e))}_buildBubbles(){let e=new Re(1,14,8,0,Math.PI*2,0,Math.PI*.5);this.bubMat=new Ge({color:16777215,roughness:.06,metalness:0,transparent:!0,opacity:.4,envMapIntensity:1.3,blending:Ao,blendSrc:Vs,blendDst:ys,blendSrcAlpha:Vs,blendDstAlpha:ys}),this.bubMesh=new Yi(e,this.bubMat,40),this.bubMesh.frustumCulled=!1,this.bubMesh.renderOrder=4,this.bubMesh.count=0,this.group.add(this.bubMesh),this.bubbles=[];for(let n=0;n<40;n++)this.bubbles.push({on:!1,x:0,z:0,age:0,life:1,r:.01});this._bm=new Ne,this._bq=new qn,this._bs=new I,this._bp=new I,this.bubAcc=0}_updateBubbles(t){let e=this.s,n=this.rng,s=e.thick,r=e.level>.05?e.boil:0,o=r*r*Ht(24,9,s)*(.35+.65*e.level);for(this.bubAcc+=o*t;this.bubAcc>1;){this.bubAcc-=1;let h=this.bubbles.find(f=>!f.on);if(!h)break;let u=n()*6.283,d=Math.sqrt(n())*.86;h.on=!0,h.x=Math.cos(u)*d,h.z=Math.sin(u)*d,h.age=0,h.r=Ht(.003+n()*.005,.005+n()*.008,s)*(.8+.4*r),h.life=Ht(.22+n()*.3,.55+n()*.75,s)/(.7+.5*r)}let a=0,l=this.curR,c=this.surfY;for(let h of this.bubbles){if(!h.on)continue;h.age+=t;let u=h.age/h.life;if(u>=1){h.on=!1,this.ringImpulse(h.x,h.z,h.r/ue.rIn*1.5,-.02*(h.r/.01)*Ht(1,.55,s)),this.splat(this.gs,h.x,h.z,h.r/ue.rIn*.9,-.0016*s*(h.r/.012));let x=((h.z*.5+.5)*yt|0)*yt+((h.x*.5+.5)*yt|0);this.mask[x]&&(this.u[x]+=(n()-.5)*.5,this.v[x]+=(n()-.5)*.5),this.onPop&&this.onPop(h.r,s);continue}let d=Math.sin(Math.min(1,u*1.15)*Math.PI*.5),f=h.r*d,p=f*Ht(.62,.8,s)*(u>.9?1-(u-.9)*6:1);this._bp.set(h.x*l,c+this.sample(this.h,h.x,h.z)+this.sample(this.gs,h.x,h.z)-4e-4,h.z*l),this._bs.set(f,Math.max(p,1e-5),f),this._bm.compose(this._bp,this._bq,this._bs),this.bubMesh.setMatrixAt(a++,this._bm)}this.bubMesh.count=a,this.bubMesh.instanceMatrix.needsUpdate=!0,this.bubMesh.visible=a>0}_buildLadle(){let t=new dt;this.ladleG=t,this.scene.add(t);let e=new dt;t.add(e),this.ladleTilt=e;let n=ne([[0,-.022],[.016,-.02],[.03,-.011],[.037,.002],[.039,.012],[.0375,.012],[.0355,.002],[.029,-.0095],[.0155,-.018],[0,-.02]],q.steelPolished,36,{smooth:3});e.add(n);let s=Rn([new I(.036,.008,0),new I(.05,.03,0),new I(.06,.09,0),new I(.066,.16,0),new I(.069,.2,0)],.0042,q.steelPolished,24,8);s.scale.z=2.2,e.add(s);let r=ne([[0,0],[.0085,0],[.0095,.01],[.0085,.1],[.006,.108],[0,.11]],q.blackPlastic,16,{smooth:2});r.position.set(.0672,.15,0),r.rotation.z=-.045,e.add(r),this.ladleFillMat=new Ge({color:9067036,roughness:.14,transparent:!0,opacity:1}),this.ladleFill=new tt(new yn(.0362,28),this.ladleFillMat),this.ladleFill.rotation.x=-Math.PI/2,this.ladleFill.position.y=.006,e.add(this.ladleFill),this.ribbonMat=new Ge({color:9067036,roughness:.12,transparent:!0,opacity:1});let o=new Me(1,.72,1,12,6,!0);o.translate(0,-.5,0),this.ribbon=new tt(o,this.ribbonMat),this.ribbon.visible=!1,this.ribbon.renderOrder=5,this.scene.add(this.ribbon),this.drops=[];for(let a=0;a<4;a++){let l=new tt(new Re(1,10,8),this.ribbonMat);l.visible=!1,this.scene.add(l),this.drops.push({mesh:l,on:!1,y:0,vy:0})}this.ladle={x:.55,z:.1,tx:.55,tz:.1,vx:0,vz:0,lift:1,liftT:1,inLiquid:!1,pour:0,pourT:0,mode:"rest",stirAmount:0,speed:0,visible:!1,dropT:0,hold:!1}}ladleTo(t,e){let n=this.ladle,s=Math.hypot(t,e),r=.7;s>r&&(t*=r/s,e*=r/s),n.tx=t,n.tz=e,n.hold=!0,n.liftT=0,n.mode="stir"}ladleRelease(){let t=this.ladle;t.hold&&(t.hold=!1,t.liftT=1,t.mode="lift",t.tx*=.35,t.tz=t.tz*.35-.12,this.s.level>.2&&t.pour<=.05&&(t.pour=1,t.pourT=0))}_updateLadle(t,e){let n=this.ladle,s=this.s,r=this.ladleG;if(r.visible=n.visible,!n.visible){n.inLiquid=!1,this.ribbon.visible=!1;for(let v of this.drops)v.mesh.visible=!1;return}let o=s.thick,a=n.x,l=n.z,c=Ht(16,6.5,o);n.mode==="rest"&&(n.tx=.56,n.tz=.22),n.x=Jt(n.x,n.tx,c,t),n.z=Jt(n.z,n.tz,c,t),n.vx=(n.x-a)/Math.max(t,1e-4),n.vz=(n.z-l)/Math.max(t,1e-4),n.speed=Math.hypot(n.vx,n.vz),n.lift=Jt(n.lift,n.liftT,n.liftT>n.lift?5:12,t),n.mode==="lift"&&n.pour<=0&&n.lift>.97&&(n.mode="rest",n.liftT=0);let h=s.level>.05,u=this.group.position.y+(h?this.surfY-.012:ue.floor+.022),d=h?.075:.03,f=this.group.position.x+n.x*ue.rIn,p=this.group.position.z+n.z*ue.rIn;r.position.set(f,u+n.lift*d+(n.mode==="rest"?.004:0),p),n.inLiquid=n.lift<.4&&(h||this.chunks.length>0),n.inLiquid&&(n.stirAmount+=n.speed*t);let x=this.ladleTilt,g=n.mode==="rest"?1:0;x.rotation.set(0,0,0),r.rotation.set(0,-1.15+n.x*.25,0),n.tip=Jt(n.tip||0,n.pour>0&&n.lift>.5?1:0,6,t),x.rotation.z=-.42-g*.2+re(n.vx*.05,-.2,.2),x.rotation.x=re(-n.vz*.05,-.2,.2)+n.tip*.6;let m=this.curryness;if(this._mixCol=this._mixCol||new Ut,this._mixCol.copy(this.uni.uBroth.value).lerp(this._curCol||this.uni.uLight.value,m),this.ladleFillMat.color.copy(this._mixCol),this.ladleFillMat.opacity=Ht(.45,1,m),this.ribbonMat.color.copy(this._mixCol),this.ribbonMat.opacity=Ht(.5,1,m),this.ladleFill.visible=h&&n.lift>.25,n.pour>0&&n.lift>.5&&h){n.pourT+=t;let v=Ht(.9,2.6,o),M=n.pourT/v,b=Math.max(0,1-M),w=this._lip||(this._lip=new I);w.set(0,.008,.037),this.ladleTilt.updateWorldMatrix(!0,!1),this.ladleTilt.localToWorld(w);let y=this.group.position.y+this.surfY,T=Math.max(.005,w.y-y),F=(w.x-this.group.position.x)/ue.rIn,O=(w.z-this.group.position.z)/ue.rIn;if(b>.04){let N=Ht(.0016,.0052,o)*Math.pow(b,.6)*(1+.12*Math.sin(e*21));this.ribbon.visible=!0,this.ribbon.position.copy(w),this.ribbon.scale.set(N,T+.002,N),this.ladleFill.scale.setScalar(.75+.25*b),Math.hypot(F,O)<.95&&(this.splat(this.gs,F,O,.085,.03*t*b*o*o*2.2),this.splat(this.hv,F,O,.06,-.035*b*(1-o*.75)*t*60*.05),this.rng()<t*30*(1-o)&&this.ringImpulse(F,O,.08,.01)),S.audio&&this.rng()<t*14*b&&S.audio.drip(o,!1)}else{if(this.ribbon.visible=!1,n.dropT+=t,n.dropT>Ht(.16,.5,o)&&M<1.9){n.dropT=0;let N=Math.hypot(F,O)<.85?this.drops.find(B=>!B.on):null;N&&(N.on=!0,N.y=w.y,N.vy=0,N.mesh.position.copy(w),N.ux=F,N.uz=O)}M>=2&&(n.pour=0)}}else this.ribbon.visible=!1,n.lift<.3&&(n.pour=0);let _=this.group.position.y+this.surfY;for(let v of this.drops){if(!v.on){v.mesh.visible=!1;continue}v.vy-=5.5*t,v.y+=v.vy*t,v.mesh.position.y=v.y,v.mesh.visible=!0;let M=Ht(.0022,.004,o);v.mesh.scale.set(M,M*1.25,M),v.y<_&&(v.on=!1,v.mesh.visible=!1,this.ringImpulse(v.ux,v.uz,.07,.012*(1-o*.6)),this.splat(this.gs,v.ux,v.uz,.06,.0012*o),S.audio&&S.audio.drip(o,!1))}}_buildLid(){let t=new dt;this.lid=t,this.scene.add(t);let e=ue,n=ne([[0,.03],[.03,.0285],[.06,.023],[.085,.014],[.102,.004],[.108,5e-4]],q.glass,56,{smooth:3});n.castShadow=!1,n.renderOrder=9,t.add(n);let s=he(256),r=s.getContext("2d"),o=de(77);r.fillStyle="rgba(255,255,255,0.5)",r.fillRect(0,0,256,256);for(let h=0;h<900;h++){let u=1+o()*3.2;r.fillStyle=`rgba(255,255,255,${.25+o()*.5})`,r.beginPath(),r.arc(o()*256,o()*256,u,0,6.3),r.fill(),r.fillStyle="rgba(255,255,255,0.9)",r.beginPath(),r.arc(o()*256,o()*256,u*.3,0,6.3),r.fill()}this.fogMat=new He({color:16777215,alphaMap:Ot(s,{repeat:[3,3]}),transparent:!0,opacity:0,roughness:.55,depthWrite:!1});let a=ne([[0,.0288],[.03,.0273],[.06,.0218],[.085,.0128],[.1,.0035]],this.fogMat,40,{smooth:3});a.castShadow=!1,a.renderOrder=8,t.add(a);let l=new tt(new hi(.1085,.0038,10,64),q.steelPolished);l.rotation.x=Math.PI/2,l.position.y=.001,l.castShadow=!0,t.add(l),t.add(ne([[0,.028],[.011,.03],[.012,.034],[.009,.04],[.016,.05],[.02,.056],[.019,.061],[.012,.064],[0,.065]],q.blackPlastic,28,{smooth:2}));let c=new tt(new hi(.004,.0013,6,14),q.steelPolished);c.rotation.x=Math.PI/2,c.position.set(.06,.0245,0),t.add(c),this.lidState={on:!1,k:0,hop:0,hopV:0,tiltX:0,tiltZ:0,hopTimer:0,rest:new I,fog:0,visible:!1}}setLidRest(t){this.lidState.rest.copy(t)}_updateLid(t,e){let n=this.lidState,s=this.lid;if(s.visible=n.visible,!n.visible)return;n.k=Jt(n.k,n.on?1:0,6,t);let r=this.s;if(n.on&&n.k>.97&&r.boil>.45&&r.level>.2&&(n.hopTimer-=t*(.5+r.boil*1.4+(r.heat>.7?1.2:0)),n.hopTimer<=0&&n.hop<=0)){let c=r.heat>.7?1:.35;if(n.hopTimer=c>.9?this.rng()<.3?.22:.45+this.rng()*.25:1.1+this.rng()*.9,n.hopV=.12+.17*c*(.6+this.rng()*.6),n.tiltX=(this.rng()-.5)*.16*c,n.tiltZ=(this.rng()-.5)*.16*c,n.air=!0,this.onLidHop&&this.onLidHop(c),S.fx){let h=this.group.position;for(let u=0;u<3;u++){let d=this.rng()*6.28;S.fx.steam.emit({x:h.x+Math.cos(d)*.105,y:h.y+ue.h+.004,z:h.z+Math.sin(d)*.105,vx:Math.cos(d)*.12,vy:.12,vz:Math.sin(d)*.12,life:.9,s0:.02,s1:.09,alpha:.3,drag:2})}}}n.hopV-=5.5*t,n.hop+=n.hopV*t,n.hop<=0&&(n.air&&n.hopV<-.05&&(n.air=!1,S.audio&&S.audio.lidClack(Math.min(1,-n.hopV*3))),n.hop=0,n.hopV=0);let o=n.hop>0?1:0,a=this.group.position,l=a.y+ue.h+.0035+n.hop;s.position.set(Ht(n.rest.x,a.x,n.k),Ht(n.rest.y,l,n.k)+Math.sin(n.k*Math.PI)*.09,Ht(n.rest.z,a.z,n.k)),s.rotation.set(Jt(s.rotation.x,n.tiltX*o,14,t),0,Jt(s.rotation.z,n.tiltZ*o,14,t)),n.fog=Jt(n.fog,n.on&&n.k>.9?re(r.temp*.9):0,n.on?.5:1.2,t),this.fogMat.opacity=n.fog*.55}reset(){this.s={oil:0,level:0,temp:0,boil:0,thick:0,heat:0,dissolved:0,rouxMass:0,simmer:0,saute:0,rouxTotal:0,sizzle:0,stirring:0},this.clearSim();for(let t of this.chunks)this.group.remove(t.mesh),t.mesh.geometry.dispose();this.chunks.length=0;for(let t of this.roux)this.group.remove(t.mesh),t.mesh.geometry.dispose();if(this.roux.length=0,this.chunkTint)for(let[,t]of this.chunkTint)t.mat.dispose();for(let t of this.bubbles)t.on=!1;for(let t of this.drops)t.on=!1;Object.assign(this.ladle,{x:.56,z:.22,tx:.56,tz:.22,vx:0,vz:0,lift:0,liftT:0,pour:0,mode:"rest",stirAmount:0,hold:!1}),Object.assign(this.lidState,{on:!1,k:0,hop:0,hopV:0,fog:0}),this.meanC=0,this.curryness=0,this.surfY=ue.floor,this.curR=ue.rIn,this.chunkTint=new Map,this._uploadSim()}setFinished(){let t=this.s;t.level=1,t.dissolved=1,t.rouxMass=4,t.thick=1,t.simmer=1,t.saute=1,t.oil=1,t.rouxTotal=4,this.c.fill(1.15),this.meanC=1.15;for(let e of this.roux)this.group.remove(e.mesh);this.roux.length=0}setWater(){let t=this.s;t.level=1,t.oil=1,t.saute=1}addChunk(t,e,n,s=.5,r=null){let o=this.rng()*6.283,a=Math.sqrt(this.rng())*.7,l={mesh:t,type:e,r:n,x:Math.cos(o)*a,z:Math.sin(o)*a,vx:0,vz:0,y:ue.h+.05+this.rng()*.05,vy:0,floatK:s,phase:this.rng()*6.28,spin:(this.rng()-.5)*2,landed:!1,tx:(this.rng()-.5)*1.1,tz:(this.rng()-.5)*1.1,sink:this.rng()*.35};if(!this.chunkTint.has(t.material)){let c=t.material.clone();this.chunkTint.set(t.material,{mat:c,base:t.material.color.clone(),cooked:r||t.material.color.clone()})}return t.material=this.chunkTint.get(t.material).mat,t.castShadow=!1,this.group.add(t),this.chunks.push(l),l}addRoux(t,e,n){let s={mesh:t,x:e,z:n,vx:0,vz:0,y:ue.h+.06,vy:0,mass:1,inWater:!1,rot:this.rng()*6.28};return this.group.add(t),this.roux.push(s),this.s.rouxTotal++,s}pour(t,e,n=0,s=0){let r=this.s;r.level=Math.min(1,r.level+t*e),this.splat(this.hv,n,s,.12,-.05*e*60*.03),this.rng()<e*20&&this.ringImpulse(n+(this.rng()-.5)*.2,s+(this.rng()-.5)*.2,.1,.02);let o=((s*.5+.5)*yt|0)*yt+((n*.5+.5)*yt|0);for(let a=0;a<6;a++){let l=o+(this.rng()*9-4|0)+(this.rng()*9-4|0)*yt;l>0&&l<yt*yt&&this.mask[l]&&(this.u[l]+=(this.rng()-.5)*2.5,this.v[l]+=(this.rng()-.5)*2.5)}}update(t,e){let n=this.s,s=ue;n.heat=this.burner?this.burner.heat*(this.burner.lit?1:0):0,n.temp=Jt(n.temp,n.heat*1.12,n.heat*1.12>n.temp?.42:.16,t);let r=n.level>.3;n.boil=r?Ur(.42,.95,n.temp)*(.35+.65*Ur(0,.9,n.heat+.25)):0;let o=re(this.ladle.inLiquid?this.ladle.speed/2.5:0);n.stirring=Jt(n.stirring,o,4,t),n.dissolved=re(n.rouxMass/4),n.rouxTotal>=4&&this.roux.length===0&&(n.dissolved=1),n.dissolved>.98&&(n.simmer=Math.min(1,n.simmer+t*(.03+.11*n.boil+.05*n.stirring)));let a=Math.pow(n.dissolved,1.3)*(.62+.38*n.simmer);n.thick=Jt(n.thick,a,1.2,t),this.surfY=s.floor+.004+n.level*s.maxDepth,this.curR=this.liquidRadius(this.surfY),this.liquid.visible=n.level>.004||n.oil>.01,this.liquid.position.y=n.level>.004?this.surfY:s.floor+.0012;let l=n.level>.004?this.curR:s.rIn-.021;this.liquid.scale.set(l,1,l);let c=this.uni;c.uThick.value=n.thick,c.uTime.value=e,c.uBoil.value=n.boil,c.uSaute.value=n.saute*(1-re(n.dissolved*3)),c.uWaterA.value=n.level>.004?.2+.1*n.saute:.3*n.oil,this.curryness=1-Math.exp(-2.7*(this.meanC||0)),this.simAcc=Math.min(this.simAcc+t,.05);let h=0;for(;this.simAcc>=1/60&&h<2;)this._simStep(1/60),this.simAcc-=1/60,h++;if(h&&this._uploadSim(),n.boil>.05&&n.level>.05){let f=n.boil*5*(1-n.thick*.7);for(let p=0;p<f;p++){let x=this.rng()*yt*yt|0;this.mask[x]&&(this.hv[x]+=(this.rng()-.5)*.05*n.boil)}}this._updateRoux(t,e),this._updateChunks(t,e),this._updateBubbles(t),this._updateLadle(t,e),this._updateLid(t,e);let u=this.curryness;this._curCol=this._curCol||new Ut,this._curCol.copy(c.uLight.value).lerp(c.uDark.value,.3+.2*n.thick);{let f=Ht(.07,.98,u*u);this.bubMat.color.copy(c.uBroth.value).lerp(this._curCol,u).multiplyScalar(Ht(1,1.12,u)*f),this.bubMat.opacity=f,this.bubMat.roughness=Ht(.03,.12,u),this.bubMat.envMapIntensity=Ht(.45,1.1,u)}for(let[,f]of this.chunkTint)f.mat.color.copy(f.base).lerp(f.cooked,n.saute).lerp(this._curCol,.6*u),"roughness"in f.mat&&(f.mat.roughness=Ht(.55,.28,u));let d=n.level<.05&&this.chunks.length>0;if(n.sizzle=Jt(n.sizzle,d?Ur(.15,.55,n.temp)*(.55+.45*re(n.stirring*2+.3)):0,5,t),d&&n.temp>.3&&(n.saute=Math.min(1,n.saute+t*(.05+.2*n.stirring)*n.temp)),S.fx&&!(this.lidState.on&&this.lidState.k>.5)){let f=r?n.temp*n.temp*2.5+n.boil*3.5:n.sizzle*3;for(this._steamAcc=(this._steamAcc||0)+f*t;this._steamAcc>1;){this._steamAcc-=1;let p=this.rng()*6.28,x=Math.sqrt(this.rng())*s.rIn*.8,g=this.group.position;S.fx.steam.emit({x:g.x+Math.cos(p)*x,y:g.y+this.surfY+.02,z:g.z+Math.sin(p)*x,vx:(this.rng()-.5)*.03,vy:.1+this.rng()*.08,vz:(this.rng()-.5)*.03,life:1.6+this.rng()*1.2,s0:.05,s1:.2+this.rng()*.12,alpha:.042+.028*n.boil,drag:.5})}}S.audio&&S.audio.setCooking({sizzle:n.sizzle,boil:n.boil*(n.level>.3?1:0),thick:n.thick,lid:this.lidState.on&&this.lidState.k>.8})}_updateRoux(t,e){let n=this.s;for(let s=this.roux.length-1;s>=0;s--){let r=this.roux[s],o=this.surfY;if(!r.inWater)r.vy-=6*t,r.y+=r.vy*t,r.y<=o+.004&&(r.inWater=!0,r.y=o,this.ringImpulse(r.x,r.z,.2,.05),this.splat(this.hv,r.x,r.z,.14,-.06),S.audio&&S.audio.plop(.8),S.fx&&S.fx.splash(this.group.position.x+r.x*ue.rIn,this.group.position.y+o,this.group.position.z+r.z*ue.rIn,5));else{let h=this.sample(this.u,r.x,r.z),u=this.sample(this.v,r.x,r.z);r.vx=Jt(r.vx,h,5,t),r.vz=Jt(r.vz,u,5,t),r.x+=r.vx*t,r.z+=r.vz*t;let d=this.ladle;if(d.inLiquid){let _=r.x-d.x,v=r.z-d.z,M=Math.hypot(_,v);if(M<.36){let b=(.36-M)*4*t;r.x+=_/(M+.001)*b,r.z+=v/(M+.001)*b}}let f=Math.hypot(r.x,r.z);f>.72&&(r.x*=.72/f,r.z*=.72/f);let p=Math.hypot(h-r.vx,u-r.vz)+Math.hypot(h,u)*.5,x=(.012+.05*n.temp+.06*n.boil+.34*re(p*.8)+.2*n.stirring)*(.35+.65*re(n.temp*1.5)),g=Math.min(r.mass,x*t);r.mass-=g,n.rouxMass+=g;let m=g*23.8;if(this.splat(this.c,r.x,r.z,.11,m),r.y=o-.004-(1-r.mass)*.004+Math.sin(e*2+r.rot)*6e-4,r.mass<=.002){this.group.remove(r.mesh),r.mesh.geometry.dispose(),this.roux.splice(s,1);continue}}let a=r.mesh,l=r.mass;a.position.set(r.x*ue.rIn,r.y,r.z*ue.rIn),a.rotation.y=r.rot+(r.inWater?e*.1:0),a.morphTargetInfluences&&(a.morphTargetInfluences[0]=re(1-l*l*1.1+.05));let c=.35+.65*Math.pow(l,.5);a.scale.set(c,c*(.5+.5*l),c)}}_updateChunks(t,e){let n=this.s,s=ue,r=n.level>.05,o=this.ladle,a=this.chunks.length,l=s.floor;for(let c=0;c<a;c++){let h=this.chunks[c],u=this.sample(this.u,h.x,h.z),d=this.sample(this.v,h.x,h.z),f=r?4.5:9;if(h.vx=Jt(h.vx,u,f,t),h.vz=Jt(h.vz,d,f,t),o.inLiquid){let v=h.x-o.x,M=h.z-o.z,b=Math.hypot(v,M),w=.34+h.r/s.rIn;if(b<w){let y=(w-b)*9;h.vx+=v/(b+.001)*y*t*10,h.vz+=M/(b+.001)*y*t*10}}for(let v=c+1;v<a;v++){let M=this.chunks[v],b=M.x-h.x,w=M.z-h.z,y=Math.hypot(b,w),T=(h.r+M.r)/s.rIn*.74;if(y<T&&y>1e-4){let F=(T-y)/y*.5*Math.min(1,t*20);h.x-=b*F,h.z-=w*F,M.x+=b*F,M.z+=w*F}}h.x+=h.vx*t,h.z+=h.vz*t;let p=Math.max(.1,(r?this.curR:s.rIn-.022)/s.rIn-h.r/s.rIn),x=Math.hypot(h.x,h.z);x>p&&(h.x*=p/x,h.z*=p/x);let g;if(r){let v=Math.sin(e*1.7+h.phase)*.0012*(1+n.boil*2.5)+this.sample(this.h,h.x,h.z)+this.sample(this.gs,h.x,h.z);g=Math.max(l+h.r*.55,this.surfY-h.r*(1-h.floatK)*.9+h.r*(h.floatK-.5)*.4-h.sink*h.r+v)}else g=l+h.r*.6+(n.sizzle>.1?Math.abs(Math.sin(e*31+h.phase*7))*8e-4*n.sizzle:0);h.landed?h.y=Jt(h.y,g,7,t):(h.vy-=7*t,h.y+=h.vy*t,h.y<=g&&(h.landed=!0,h.y=g,r?(this.ringImpulse(h.x,h.z,.15,.04),S.audio&&S.audio.plop(.5)):S.audio&&S.audio.thunk(.35+this.rng()*.2,.3)));let m=h.mesh;m.position.set(h.x*s.rIn,h.y,h.z*s.rIn);let _=Math.hypot(h.vx,h.vz);m.rotation.y+=h.spin*_*t*1.5,h.landed?(m.rotation.x=Jt(m.rotation.x,h.tx+Math.sin(e*1.3+h.phase)*.06*(1+n.boil),6,t),m.rotation.z=Jt(m.rotation.z,h.tz,6,t)):(m.rotation.x+=t*4*h.spin,m.rotation.z+=t*3)}}};function M0(){let i=Or(.034,.014,.026,.0028,4),t=i.attributes.position,e=new Float32Array(t.count*3),n=new I;for(let s=0;s<t.count;s++){n.fromBufferAttribute(t,s);let r=new I(n.x/.017,n.y/.007,n.z/.013),o=r.length()||1;r.multiplyScalar(1/o),e[s*3]=r.x*.0165-n.x,e[s*3+1]=r.y*.006-n.y,e[s*3+2]=r.z*.0135-n.z}return i.morphAttributes.position=[new xe(e,3)],i.morphTargetsRelative=!0,i}var Cn=Ge,ae={},en={},Ks=["carrot","potato","onion","meat","sausage","corn","broccoli"];function b0(i){let t=0,e=i.map(c=>c.index?c.toNonIndexed():c);for(let c of e)t+=c.attributes.position.count;let n=new Float32Array(t*3),s=new Float32Array(t*3),r=new Float32Array(t*3),o=new Float32Array(t*2),a=0;for(let c of e)n.set(c.attributes.position.array,a*3),s.set(c.attributes.normal.array,a*3),c.attributes.color?r.set(c.attributes.color.array,a*3):r.fill(1,a*3,(a+c.attributes.position.count)*3),c.attributes.uv&&o.set(c.attributes.uv.array,a*2),a+=c.attributes.position.count;let l=new un;return l.setAttribute("position",new In(n,3)),l.setAttribute("normal",new In(s,3)),l.setAttribute("color",new In(r,3)),l.setAttribute("uv",new In(o,2)),l}function $s(i,t){let e=i.attributes.position,n=i.attributes.normal,s=new Float32Array(e.count*3),r=new I,o=new I,a=new Ut;for(let l=0;l<e.count;l++){r.fromBufferAttribute(e,l),o.fromBufferAttribute(n,l);let[c,h,u]=t(r,o);a.setRGB(c,h,u,hn),s[l*3]=a.r,s[l*3+1]=a.g,s[l*3+2]=a.b}return i.setAttribute("color",new In(s,3)),i}function Pn(i,t){let e=new tt(i,t);return e.castShadow=!0,e.receiveShadow=!0,e}function S0(){let i=Ot(Qi(128,{seed:91,base:18,oct:3,strength:1.6}),{repeat:[2,2]});{let n=Zs(256,{seed:101,base:[236,122,40],spots:0,mottle:.18}),s=n.getContext("2d"),r=de(4);for(let o=0;o<46;o++){s.strokeStyle=`rgba(170,70,15,${.25+r()*.3})`,s.lineWidth=1+r()*1.5;let a=r()*256,l=r()*256,c=12+r()*40;s.beginPath(),s.moveTo(l,a),s.lineTo(l+c,a+(r()-.5)*3),s.stroke()}ae.carrot=new Cn({map:Ot(n,{srgb:!0}),roughness:.62,normalMap:i,normalScale:new xt(.35,.35),clearcoat:0,clearcoatRoughness:.2})}ae.carrotCut=new Cn({color:16777215,vertexColors:!0,roughness:.5,clearcoat:.25,clearcoatRoughness:.3}),ae.green=new He({color:6068798,roughness:.7});{let n=Zs(256,{seed:111,base:[206,170,112],spots:260,spot:[120,86,46],rmin:.6,rmax:2.4,alpha:.55,mottle:.3});ae.potato=new Cn({map:Ot(n,{srgb:!0}),roughness:.82,normalMap:i,normalScale:new xt(.5,.5),clearcoat:0,clearcoatRoughness:.25})}ae.potatoCut=new Cn({color:16777215,vertexColors:!0,roughness:.55,clearcoat:.2,clearcoatRoughness:.35});{let n=Zs(256,{seed:121,base:[214,150,70],spots:0,mottle:.3}),s=n.getContext("2d"),r=de(8);for(let o=0;o<90;o++){s.strokeStyle=`rgba(${150+r()*60},${80+r()*40},20,${.18+r()*.25})`,s.lineWidth=.8+r()*2;let a=r()*256;s.beginPath(),s.moveTo(a,0),s.bezierCurveTo(a+(r()-.5)*12,80,a+(r()-.5)*12,170,a+(r()-.5)*6,256),s.stroke()}ae.onion=new Cn({map:Ot(n,{srgb:!0}),roughness:.42,clearcoat:.35,clearcoatRoughness:.3,sheen:.3})}ae.onionCut=new Cn({color:16777215,vertexColors:!0,roughness:.35,clearcoat:.4,clearcoatRoughness:.2,transparent:!1});{let n=Zs(128,{seed:131,base:[172,52,48],spots:0,mottle:.35}),s=n.getContext("2d"),r=de(12);for(let o=0;o<26;o++){s.strokeStyle=`rgba(250,225,215,${.35+r()*.4})`,s.lineWidth=.8+r()*2.2;let a=r()*128,l=r()*128;s.beginPath(),s.moveTo(a,l),s.bezierCurveTo(a+(r()-.5)*50,l+(r()-.5)*50,a+(r()-.5)*50,l+(r()-.5)*50,a+(r()-.5)*70,l+(r()-.5)*70),s.stroke()}ae.meat=new Cn({map:Ot(n,{srgb:!0}),roughness:.4,clearcoat:.5,clearcoatRoughness:.25})}ae.sausage=new Cn({color:11817775,roughness:.3,clearcoat:.6,clearcoatRoughness:.2}),ae.sausageCut=new Cn({color:16777215,vertexColors:!0,roughness:.4,clearcoat:.4,clearcoatRoughness:.25});{let n=he(256),s=n.getContext("2d"),r=he(256),o=r.getContext("2d"),a=de(14);s.fillStyle="#d99a1c",s.fillRect(0,0,256,256),o.fillStyle="#000",o.fillRect(0,0,256,256);let l=16,c=20,h=256/l,u=256/c;for(let d=0;d<c;d++)for(let f=0;f<l;f++){let p=(f+.5)*h+(a()-.5)*1.5,x=(d+.5+f%2*.5)*u,g=s.createRadialGradient(p-1,x-1,1,p,x,h*.62),m=a()*20;g.addColorStop(0,`rgb(255,${226+m*.4},${96+m})`),g.addColorStop(1,`rgb(226,${160+m},30)`),s.fillStyle=g,s.beginPath(),s.ellipse(p,x,h*.48,u*.47,0,0,6.3),s.fill();let _=o.createRadialGradient(p,x,0,p,x,h*.55);_.addColorStop(0,"#fff"),_.addColorStop(.7,"#aaa"),_.addColorStop(1,"#000"),o.fillStyle=_,o.beginPath(),o.ellipse(p,x,h*.5,u*.5,0,0,6.3),o.fill()}ae.corn=new Cn({map:Ot(n,{srgb:!0,repeat:[1,1]}),normalMap:Ot(Mi(r,3),{repeat:[1,1]}),roughness:.34,clearcoat:.5,clearcoatRoughness:.25})}ae.kernel=new Cn({color:15975994,roughness:.3,clearcoat:.6,clearcoatRoughness:.2}),ae.husk=new He({color:10272098,roughness:.75,side:Ce}),ae.broccoli=new Cn({color:16777215,vertexColors:!0,roughness:.78,normalMap:Ot(Qi(128,{seed:95,base:30,oct:2,strength:3.2}),{repeat:[3,3]}),normalScale:new xt(1,1),clearcoat:0,clearcoatRoughness:.3});{let n=he(256),s=n.getContext("2d"),r=de(21);s.fillStyle="#555",s.fillRect(0,0,256,256);for(let l=0;l<900;l++){let c=r()*256,h=r()*256,u=r()*3.14,d=7+r()*2.5,f=3+r();for(let[p,x]of[[0,0],[256,0],[-256,0],[0,256],[0,-256]]){s.save(),s.translate(c+p,h+x),s.rotate(u);let g=s.createRadialGradient(0,0,0,0,0,d);g.addColorStop(0,"#fff"),g.addColorStop(.6,"#bbb"),g.addColorStop(1,"#666"),s.fillStyle=g,s.beginPath(),s.ellipse(0,0,d,f,0,0,6.3),s.fill(),s.restore()}}ct.riceN=Ot(Mi(n,2.6),{repeat:[3,3]});let o=he(256),a=o.getContext("2d");a.fillStyle="#f6f3ea",a.fillRect(0,0,256,256),a.globalAlpha=.16,a.globalCompositeOperation="multiply",a.drawImage(n,0,0),ct.rice=Ot(o,{srgb:!0,repeat:[3,3]}),ae.rice=new Cn({map:ct.rice,color:16777215,normalMap:ct.riceN,normalScale:new xt(1.3,1.3),roughness:.55,clearcoat:.12,clearcoatRoughness:.4,sheen:.4,sheenColor:new Ut(16777215),emissive:1710098}),ae.grain=new Cn({color:16513522,roughness:.36,clearcoat:.45,clearcoatRoughness:.3,emissive:2368028})}ae.roux=new Cn({color:6962452,roughness:.42,clearcoat:.25,clearcoatRoughness:.4,sheen:.4,sheenColor:new Ut(13208122)}),ae.tray=new Cn({color:16119282,roughness:.6}),ae.film=new Cn({color:16777215,roughness:.05,transparent:!0,opacity:.16,clearcoat:1,depthWrite:!1}),ae.rouxTray=new Cn({color:15788760,roughness:.3,transparent:!0,opacity:.55,clearcoat:.6,side:Ce});let t=n=>new Ut(n);en.carrot={wash:!0,count:4,chunkR:.018,floatK:.45,cooked:t(16773344),pitch:1.25,icon:"#ee7a28",whole(){let n=new dt,s=Ui([[0,-.085],[.006,-.08],[.011,-.05],[.0155,0],[.019,.05],[.02,.07],[.016,.08],[.006,.083],[0,.083]],20,{smooth:4}),r=s.attributes.position;for(let l=0;l<r.count;l++){let c=r.getY(l),h=1+(ji(r.getX(l)*60,c*30,r.getZ(l)*60,3)-.5)*.14;r.setX(l,r.getX(l)*h+Math.sin(c*18)*.0025),r.setZ(l,r.getZ(l)*h)}s.computeVertexNormals();let o=Pn(s,ae.carrot.clone());n.add(o),n.userData.skin=[o.material];for(let l=0;l<5;l++){let c=Pn(new Me(.0022,.0028,.022,6),ae.green);c.position.set(Math.cos(l*1.3)*.004,.092,Math.sin(l*1.3)*.004),c.rotation.set(Math.sin(l)*.3,0,Math.cos(l*2)*.3),n.add(c)}n.rotation.z=Math.PI/2;let a=new dt;return a.add(n),a.userData={skin:n.userData.skin,len:.17,rad:.02},a},chunk(n){let s=.016+n()*.004,r=.02+n()*.008,o=new Me(s*(.8+n()*.2),s,r,14,1).toNonIndexed(),a=o.attributes.position,l=(n()-.5)*1.2,c=(n()-.5)*1;for(let h=0;h<a.count;h++){let u=a.getY(h);a.setY(h,u+(u>0?a.getX(h)*l:a.getZ(h)*c))}return o.computeVertexNormals(),$s(o,(h,u)=>{let d=Math.abs(u.y)<.6,f=Math.hypot(h.x,h.z)/s;return d?[.93,.46,.14]:f<.45?[.99,.66,.26]:[.96,.52,.17]}),Pn(o,ae.carrotCut)}},en.potato={wash:!0,count:4,chunkR:.02,floatK:.38,cooked:t(16774352),pitch:.8,icon:"#d2ad70",whole(){let n=Pn(Ql({rx:.042,ry:.029,rz:.032,noise:.16,freq:1.6,seed:5,wseg:28,hseg:18}),ae.potato.clone()),s=new dt;return s.add(n),s.userData={skin:[n.material],len:.085,rad:.03},s},chunk(n){let s=.027+n()*.006,r=Or(s*(.9+n()*.4),s*(.8+n()*.3),s*(.9+n()*.3),.007,2),o=r.attributes.position,a=n()*100|0;for(let c=0;c<o.count;c++){let h=1+(ji(o.getX(c)*70,o.getY(c)*70,o.getZ(c)*70,a)-.5)*.3;o.setXYZ(c,o.getX(c)*h,o.getY(c)*h,o.getZ(c)*h)}r.computeVertexNormals();let l=new I(n()-.5,n()-.5,n()-.5).normalize();return $s(r,(c,h)=>h.dot(l)>.72?[.78,.63,.4]:[.97,.9,.66]),Pn(r,ae.potatoCut)}},en.onion={wash:!0,count:4,chunkR:.018,floatK:.62,cooked:t(16180912),pitch:1.5,icon:"#d99a45",whole(){let n=new dt,s=Pn(Ui([[0,-.034],[.012,-.033],[.03,-.022],[.039,0],[.034,.02],[.02,.034],[.008,.042],[.004,.052],[0,.053]],28,{smooth:4}),ae.onion.clone());n.add(s);let r=Pn(new Re(.006,8,6),new He({color:13218954,roughness:.9}));return r.position.y=-.034,r.scale.y=.5,n.add(r),n.userData={skin:[s.material],len:.08,rad:.039},n},chunk(n){let s=new Re(.025+n()*.004,12,9,0,.75+n()*.4).toNonIndexed();s.scale(1,1.15,1),s.center(),s.computeVertexNormals(),$s(s,o=>{let a=re((o.y+.03)/.06);return[.96-a*.03,.95-a*.02,.84+a*.03]});let r=Pn(s,ae.onionCut);return r.material.side=Ce,r}},en.meat={wash:!1,count:4,chunkR:.019,floatK:.3,cooked:t(10123878),pitch:.6,icon:"#b04038",precut:!0,whole(){let n=new dt;n.add(Pn(ne([[0,0],[.05,0],[.058,.004],[.064,.018],[.066,.02],[.062,.018],[.056,.006],[0,.004]],ae.tray,4).geometry.rotateY(Math.PI/4).scale(1.25,1,.95),ae.tray));let s=de(6);n.userData.pieces=[];for(let o=0;o<4;o++){let a=en.meat.chunk(s);a.position.set((o%2-.5)*.05,.02,(o<2?-1:1)*.022),a.rotation.y=s()*3,n.add(a),n.userData.pieces.push(a)}let r=new tt(new ce(.15,.115),ae.film);return r.rotation.x=-Math.PI/2,r.position.y=.0225,n.add(r),n.userData.film=r,n.userData.len=.16,n.userData.rad=.05,n},chunk(n){let s=.027+n()*.005,r=Or(s*(.9+n()*.3),s*.8,s*(.9+n()*.3),.006,2);return Pn(r,ae.meat)}},en.sausage={wash:!1,count:5,chunkR:.012,floatK:.5,cooked:t(15782072),pitch:1.1,icon:"#b9552f",one(){let n=[];for(let o=0;o<=6;o++){let a=o/6-.5;n.push(new I(a*.085,0,Math.cos(a*2.6)*.012))}let s=Rn(n,.0105,ae.sausage,20,12),r=new dt;r.add(s);for(let o of[0,6]){let a=Pn(new Re(.0105,12,8),ae.sausage);a.position.copy(n[o]),r.add(a);let l=Pn(new Re(.003,6,5),ae.sausage);l.position.copy(n[o]).add(new I(o?.011:-.011,0,-.003)),r.add(l)}return r},whole(){let n=new dt;for(let s=0;s<3;s++){let r=en.sausage.one();r.position.set(0,.0105+(s===2?.017:0),s===2?0:(s-.5)*.023),r.rotation.y=(s-1)*.08,n.add(r)}return n.userData={len:.1,rad:.03},n},chunk(n){let s=new Me(.0105,.0105,.011+n()*.004,14,1).toNonIndexed(),r=s.attributes.position,o=.5+n()*.3;for(let a=0;a<r.count;a++)r.setY(a,r.getY(a)+r.getX(a)*o);return s.computeVertexNormals(),$s(s,(a,l)=>Math.abs(l.y)<.55?[.72,.33,.18]:[.93,.62,.52]),Pn(s,ae.sausageCut)}},en.corn={wash:!0,count:10,chunkR:.0068,floatK:.7,cooked:t(16777215),pitch:1.8,icon:"#f2c030",whole(){let n=new dt,s=Ui([[0,-.08],[.012,-.078],[.021,-.06],[.025,-.02],[.0245,.03],[.019,.062],[.01,.078],[0,.082]],28,{smooth:4}),r=s.attributes.uv;for(let l=0;l<r.count;l++)r.setXY(l,r.getX(l)*1,r.getY(l)*1.6);let o=Pn(s,ae.corn.clone());n.add(o);for(let l=0;l<3;l++){let c=new Re(.03,10,8,0,1.5,1.2,1.6);c.scale(1,2.4,1);let h=Pn(c,ae.husk);h.position.y=-.045,h.rotation.y=l*2.1,n.add(h)}n.rotation.z=Math.PI/2;let a=new dt;return a.add(n),a.userData={skin:[o.material],len:.165,rad:.026},a},chunk(n){let s=Ql({rx:.0068,ry:.0055,rz:.006,noise:.12,freq:2,seed:n()*99|0,wseg:8,hseg:6});return Pn(s,ae.kernel)}};let e=(n,s=1)=>{let r=[],o=new Me(.0055*s,.0065*s,.02*s,8).toNonIndexed();o.translate(0,-.012*s,0),$s(o,()=>[.62,.74,.4]),r.push(o);for(let a=0;a<6;a++){let l=a/5*6.28,c=a===5?0:.0075*s,h=Ql({rx:.0085*s,ry:.0075*s,rz:.0085*s,noise:.22,freq:3.5,seed:n()*99|0,wseg:9,hseg:7}).toNonIndexed();h.translate(Math.cos(l)*c,(a===5?.0065:.002)*s,Math.sin(l)*c),$s(h,u=>{let d=re(u.y/(.012*s)+.3);return[.2+d*.1,.42+d*.16,.13+d*.04]}),r.push(h)}return b0(r)};en.broccoli={wash:!0,count:3,chunkR:.019,floatK:.72,cooked:t(15269848),pitch:1.4,icon:"#4c8c3a",whole(){let n=de(31),s=[],r=new Me(.014,.018,.06,12).toNonIndexed();r.translate(0,-.03,0),$s(r,()=>[.6,.73,.38]),s.push(r);for(let l=0;l<9;l++){let c=e(n,2),h=l/8*6.28,u=l===8?0:.03;c.rotateZ(l===8?0:-.5),c.rotateY(-h),c.translate(Math.cos(h)*u,l===8?.03:.014,Math.sin(h)*u),s.push(c)}let o=Pn(b0(s),ae.broccoli.clone()),a=new dt;return o.position.y=.02,a.add(o),a.userData={skin:[o.material],len:.1,rad:.05},a},chunk(n){return Pn(e(n,1.6),ae.broccoli)}};for(let n of Ks)en[n].name=n;return en}var Qy=(()=>{let i;return()=>(i||(i=new Re(1,6,4).scale(.0033,.0015,.0016),i.userData.keep=!0),i)})();function oc(i,t,e,n=420,s=5){let r=new dt,o=de(s),a=new Re(1,36,14,0,Math.PI*2,0,Math.PI*.5),l=a.attributes.position,c=new I,h=(v,M)=>{let b=Math.min(1,Math.hypot(v,M));return Math.pow(Math.max(0,1-b*b),.62)*(.86+.26*ji(v*2.2+3,M*2.2+7,s*.37,11))+.02*ji(v*9,M*9,1.5,12)};for(let v=0;v<l.count;v++){c.fromBufferAttribute(l,v);let M=Math.hypot(c.x,c.z),b=1+(ji(c.x*2.5,c.z*2.5,.5,s)-.5)*.16;l.setXYZ(v,c.x*i*b,h(c.x,c.z)*t,c.z*e*b)}a.computeVertexNormals();let u=a.attributes.uv;for(let v=0;v<u.count;v++)u.setXY(v,l.getX(v)/.06,l.getZ(v)/.06);let d=new tt(a,ae.rice);d.castShadow=!0,d.receiveShadow=!0,r.add(d);let f=new Yi(Qy(),ae.grain,n);f.castShadow=!1,f.receiveShadow=!0;let p=new Ne,x=new qn,g=new on,m=new I,_=new I;for(let v=0;v<n;v++){let M=o()*6.283,b=Math.sqrt(o())*1,w=Math.cos(M)*b,y=Math.sin(M)*b,T=1+(ji(w*2.5,y*2.5,.5,s)-.5)*.16;_.set(w*i*T,h(w,y)*t+6e-4+o()*.0012,y*e*T),g.set((o()-.5)*1.3,o()*6.28,(o()-.5)*1.3),x.setFromEuler(g);let F=.85+o()*.35;m.set(F,F,F),p.compose(_,x,m),f.setMatrixAt(v,p)}return r.add(f),r.userData.grains=f,r.userData.base=d,r}function ac(){let i=new tt(M0(),ae.roux);return i.castShadow=!0,i.receiveShadow=!0,i}var bi=(i,t,e)=>new I(i,t,e),A0=m0(1,.86,12),Si=new Re(1,20,14),Qh={};function w0(i){if(Qh[i])return Qh[i];let t=he(128,96),e=t.getContext("2d");return e.lineCap="round",e.lineJoin="round",e.strokeStyle="#7a3b2e",e.fillStyle="#8f3d33",e.lineWidth=9,i==="smile"?(e.beginPath(),e.arc(64,22,34,.18*Math.PI,.82*Math.PI),e.stroke()):i==="flat"?(e.beginPath(),e.moveTo(42,48),e.lineTo(86,48),e.stroke()):i==="open"?(e.beginPath(),e.moveTo(26,30),e.quadraticCurveTo(64,26,102,30),e.quadraticCurveTo(96,86,64,88),e.quadraticCurveTo(32,86,26,30),e.fill(),e.fillStyle="#e88a82",e.beginPath(),e.ellipse(64,74,20,10,0,0,6.3),e.fill()):i==="o"?(e.beginPath(),e.ellipse(64,52,17,21,0,0,6.3),e.fill()):i==="small"?(e.beginPath(),e.arc(64,34,16,.15*Math.PI,.85*Math.PI),e.stroke()):i==="chew"?(e.beginPath(),e.ellipse(64,48,20,9,0,0,6.3),e.stroke()):i==="yawn"?(e.beginPath(),e.ellipse(64,50,24,30,0,0,6.3),e.fill()):i==="wavy"&&(e.beginPath(),e.moveTo(30,50),e.bezierCurveTo(46,36,54,62,64,48),e.bezierCurveTo(74,36,84,62,98,48),e.stroke()),Qh[i]=Ot(t,{srgb:!0})}var E0={smile:{m:"smile",eye:1},happy:{m:"open",eye:.22},open:{m:"open",eye:1},wow:{m:"o",eye:1.45},flat:{m:"flat",eye:1},sleepy:{m:"small",eye:.14},yawn:{m:"yawn",eye:.14},chew:{m:"chew",eye:.9},shy:{m:"wavy",eye:.8},small:{m:"small",eye:1},sneeze:{m:"o",eye:.14}},Ss=new I,qo=new I;function T0(i,t,e,n,s,r,o){Ss.subVectors(t,i);let a=Ss.length(),l=e+n-.002,c=Math.abs(e-n)+.002;a<1e-5&&(Ss.set(0,-1,0),a=1e-5),Ss.multiplyScalar(1/a);let h=re(a,c,l),u=(e*e-n*n+h*h)/(2*h),d=Math.sqrt(Math.max(0,e*e-u*u));qo.copy(s).addScaledVector(Ss,-s.dot(Ss)),qo.lengthSq()<1e-6&&qo.set(0,0,1),qo.normalize(),r.copy(i).addScaledVector(Ss,u).addScaledVector(qo,d),o.copy(i).addScaledVector(Ss,h)}var zr=class{constructor(t){this.o=t;let e=t.h,n=!!t.child;this.root=new dt,this.body=new dt,this.root.add(this.body);let s=fe(t.skin,.62,{sheen:.25}),r=fe(t.top,.88),o=fe(t.bottom,.9),a=fe(t.shoes||15921128,.7),l=n?.106:.112;this.dim={H:e,headR:l,hipY:e*(n?.42:.47),shY:e-l*2-(n?.035:.05),shW:n?.115:.165,armU:n?.17:.255,armL:n?.16:.24,legU:0,legL:0,handR:n?.036:.045};let c=this.dim;c.legU=c.hipY*.5,c.legL=c.hipY*.5-.02;let h=c.shW,u=c.shY-c.hipY,d=t.dress?[[0,-.16],[h*1.45,-.16],[h*1.38,-.12],[h*1,u*.35],[h*.86,u*.72],[h*.8,u*.95],[h*.42,u*1.04],[0,u*1.06]]:[[0,-.03],[h*.9,-.03],[h*1,.02],[h*.98,u*.4],[h*.92,u*.75],[h*.84,u*.95],[h*.42,u*1.04],[0,u*1.06]];if(this.torso=new tt(Ui(d,24,{smooth:3}),r),this.torso.scale.z=.72,this.torso.position.y=c.hipY,this.torso.castShadow=!0,this.body.add(this.torso),!t.dress){let _=new tt(Si,o);_.scale.set(h*.95,.1,h*.7),_.position.y=c.hipY-.02,_.castShadow=!0,this.body.add(_)}this.head=new dt,this.head.position.y=c.shY+.035+l*.92,this.body.add(this.head);let f=new tt(new Me(.036,.042,.07,12),s);f.position.y=c.shY+.02,this.body.add(f);let p=new tt(Si,s);p.scale.set(l,l*.97,l*.95),p.castShadow=!0,this.head.add(p);let x=new Ge({color:2759702,roughness:.15,clearcoat:1});this.eyes=[];for(let _ of[-1,1]){let v=new tt(Si,x);v.position.set(_*l*.36,l*.06,l*.86),v.scale.set(l*.115,l*.15,l*.06),this.head.add(v),this.eyes.push(v);let M=new tt(Si,new Ue({color:16777215}));M.scale.setScalar(.22),M.position.set(.3,.35,.9),v.add(M);let b=new tt(new yn(l*.17,16),new Ue({color:15764090,transparent:!0,opacity:.32,depthWrite:!1}));b.position.set(_*l*.56,-l*.2,l*.79),b.rotation.y=_*.6,this.head.add(b)}this.mouthMat=new Ue({map:w0("smile"),transparent:!0,depthWrite:!1,toneMapped:!0}),this.mouth=new tt(new ce(l*.5,l*.375),this.mouthMat),this.mouth.position.set(0,-l*.36,l*.905),this.mouth.rotation.x=.28,this.head.add(this.mouth),this._hair(t,l);let g=fe(t.sleeve??t.top,.88),m=(_,v)=>{let M=new tt(A0,_);return M.castShadow=!0,M.userData.r=v,this.body.add(M),M};this.arms={},this.legs={};for(let[_,v]of[["L",-1],["R",1]]){let M={s:v,S:bi(v*(c.shW+.012),c.shY-.03,0),E:bi(0,0,0),Hd:bi(0,0,0),T:bi(v*(c.shW+.05),c.hipY+.02,.03),cur:bi(v*(c.shW+.05),c.hipY+.02,.03),up:m(g,n?.034:.042),lo:m(t.longSleeve?g:s,n?.029:.036),speed:9,thumb:0};M.hand=new tt(Si,s),M.hand.scale.setScalar(c.handR),M.hand.castShadow=!0,this.body.add(M.hand),M.thumbM=new tt(Si,s),M.thumbM.scale.set(c.handR*.42,c.handR*.8,c.handR*.42),M.thumbM.visible=!1,this.body.add(M.thumbM),this.arms[_]=M;let b={s:v,S:bi(v*c.shW*.5,c.hipY,0),E:bi(0,0,0),Hd:bi(0,0,0),T:bi(v*c.shW*.5,.035,.01),cur:bi(v*c.shW*.5,.035,.01),up:m(o,n?.046:.058),lo:m(t.dress||t.shorts?s:o,n?.038:.047),speed:12};b.foot=new tt(Si,a),b.foot.scale.set(n?.04:.05,n?.03:.036,n?.065:.085),b.foot.castShadow=!0,this.root.add(b.foot),this.legs[_]=b}this.shadow=qe(ct.blob,.5,.42,.33),this.shadow.position.y=.004,this.root.add(this.shadow),this.headRot={yaw:0,pitch:0,roll:0},this.headT={yaw:0,pitch:0,roll:0},this.headSpeed=7,this.lean={x:0,z:0,y:0},this.leanT={x:0,z:0,y:0},this.bob=0,this.faceName="smile",this.eyeScale=1,this.eyeT=1,this.blinkT=2+Math.random()*3,this.sitting=!1,this.lying=!1,this.poleArm=bi(0,-.3,-1),this.walkPhase=0,this.walking=0,this._restArms(),this.setFace("smile"),this.root.traverse(_=>{_.isMesh&&(_.frustumCulled=!1)}),Ys((_,v)=>this.update(_,v))}_hair(t,e){let n=fe(t.hair,.55,{sheen:.6,sheenRoughness:.4}),s=this.head,r=t.hairStyle,o=new tt(new Re(e*1.07,28,18,0,Math.PI*2,0,Math.PI*.56),n);o.rotation.x=-.42,o.castShadow=!0,s.add(o);let a=new tt(new Re(e*1.06,24,16,0,Math.PI*2,0,Math.PI*.72),n);a.rotation.x=-1.35,s.add(a);let l=(c,h,u,d,f=d,p=d)=>{let x=new tt(Si,n);return x.position.set(c*e,h*e,u*e),x.scale.set(d*e,f*e,p*e),x.castShadow=!0,s.add(x),x};if(r==="bob"){for(let c of[-1,1])l(c*.86,-.42,-.05,.36,.62,.5);l(0,-.5,-.62,.8,.55,.5)}else if(r==="pigtails"){for(let c of[-1,1]){l(c*1.05,.25,-.2,.34),l(c*1.25,-.2,-.25,.3,.42,.3);let h=new tt(Si,fe(15227498,.6));h.position.set(c*.98*e,.3*e,-.12*e),h.scale.setScalar(.13*e),s.add(h)}l(0,.62,.78,.5,.2,.3)}else if(r==="bun")l(0,1.05,-.35,.42),l(0,.62,.78,.55,.2,.3);else if(r==="ponytail")l(0,.5,-1.05,.3),l(0,-.1,-1.25,.26,.5,.26),l(0,.62,.78,.55,.2,.3);else if(r==="curly"){for(let c=0;c<9;c++){let h=c/9*Math.PI*2;l(Math.cos(h)*.82,.55+Math.sin(c*2.3)*.12,Math.sin(h)*.82-.1,.36)}l(0,.95,-.05,.5)}else if(r==="short"){l(0,.66,.74,.62,.2,.34);for(let c of[-1,1])l(c*.93,.05,.05,.16,.32,.3)}else r==="boy"&&(l(.15,.7,.72,.6,.22,.36),l(-.4,.98,.1,.22,.16,.22))}setFace(t){let e=E0[t]||E0.smile;this.faceName=t,this.mouthMat.map=w0(e.m),this.eyeT=e.eye}_restArms(){let t=this.dim;for(let e of Object.values(this.arms))e.T.set(e.s*(t.shW+.045),t.shY-t.armU-t.armL+.035,.03)}restArms(){this._restArms();for(let t of Object.values(this.arms))t.thumb=0,t.world=null}hand(t,e,n,s,r=9){let o=this.arms[t];return o.T.set(e,n,s),o.speed=r,o.world=null,this}handWorld(t,e,n=10){let s=this.arms[t];return s.world=s.world||new I,s.world.copy(e),s.speed=n,this}thumbs(t,e=!0){let n=this.arms[t],s=this.dim;return n.thumb=e?1:0,e?this.hand(t,n.s*(s.shW+.11),s.shY-.02,.24,11):this.restArms(),this}wave(t,e){let n=this.dim,s=this.arms[t];this.hand(t,s.s*(n.shW+.14)+Math.sin(e*9)*.07,n.shY+.2,.1,16)}lookAt(t){let e=this.head.getWorldPosition(new I),n=t.clone().sub(e),r=Math.atan2(n.x,n.z)-this.root.rotation.y;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;this.headT.yaw=re(r,-1.25,1.25),this.headT.pitch=re(-Math.atan2(n.y,Math.hypot(n.x,n.z)),-.6,.7)}lookFront(){this.headT.yaw=0,this.headT.pitch=0,this.headT.roll=0}sitOn(t){let e=this.dim;this.sitting=!0,this.root.position.y=t+.075-e.hipY;let n=-this.root.position.y+.035;for(let s of Object.values(this.legs))s.T.set(s.s*e.shW*.55,Math.max(n,e.hipY-e.legL*.97),e.legU*.97),s.cur.copy(s.T);return this.shadow.visible=!1,this}stand(){return this.sitting=!1,this.root.position.y=0,this.shadow.visible=!0,this}place(t,e,n,s=0){return this.root.position.set(t,e,n),this.root.rotation.set(0,s,0),this}update(t,e){if(!this.root.visible||!this.root.parent)return;let n=this.dim;this.blinkT-=t;let s=1;this.blinkT<.12&&(s=.1),this.blinkT<0&&(this.blinkT=2.2+Math.random()*3.5),this.eyeScale=Jt(this.eyeScale,this.eyeT*(this.eyeT>.5?s:1),22,t);for(let u of this.eyes)u.scale.y=n.headR*.15*Math.max(.08,Math.min(this.eyeScale,1.5)),u.scale.x=n.headR*.115*(this.eyeScale>1?this.eyeScale:1);let r=this.headRot,o=this.headT,a=this.headSpeed;r.yaw=Jt(r.yaw,o.yaw,a,t),r.pitch=Jt(r.pitch,o.pitch,a,t),r.roll=Jt(r.roll,o.roll,a,t),this.head.rotation.set(r.pitch,r.yaw,r.roll,"YXZ");let l=this.lean,c=this.leanT;l.x=Jt(l.x,c.x,7,t),l.z=Jt(l.z,c.z,7,t),l.y=Jt(l.y,c.y,12,t);let h=Math.sin(e*1.6+n.H*7)*.003;if(this.body.rotation.set(l.x,0,l.z),this.body.position.y=l.y+this.bob+h,this.walking>.01&&!this.sitting){this.walkPhase+=t*9*this.walking;for(let u of Object.values(this.legs)){let d=this.walkPhase+(u.s>0?Math.PI:0);u.T.set(u.s*n.shW*.5,.035+Math.max(0,Math.sin(d))*.06,Math.cos(d)*.11*this.walking)}this.bob=Math.abs(Math.sin(this.walkPhase))*.018}else if(!this.sitting&&!this.lying)for(let u of Object.values(this.legs))u.T.set(u.s*n.shW*.5,.035,.01);this.body.updateWorldMatrix(!0,!1);for(let u of Object.values(this.arms))if(u.world&&(u.T.copy(u.world),this.body.worldToLocal(u.T)),u.cur.x=Jt(u.cur.x,u.T.x,u.speed,t),u.cur.y=Jt(u.cur.y,u.T.y,u.speed,t),u.cur.z=Jt(u.cur.z,u.T.z,u.speed,t),this.poleArm.set(u.s*.5,-.6,-.7),T0(u.S,u.cur,n.armU,n.armL,this.poleArm,u.E,u.Hd),Vo(u.up,u.S,u.E,u.up.userData.r),Vo(u.lo,u.E,u.Hd,u.lo.userData.r),u.hand.position.copy(u.Hd),u.thumbM.visible=u.thumb>.5,u.thumbM.visible){let d=u.thumbDir;d?(u.thumbM.position.copy(u.Hd).addScaledVector(d,n.handR*1.1),u.thumbM.quaternion.setFromUnitVectors(n_,d)):u.thumbM.position.set(u.Hd.x-u.s*n.handR*.2,u.Hd.y+n.handR*1.1,u.Hd.z)}for(let u of Object.values(this.legs)){u.cur.x=Jt(u.cur.x,u.T.x,u.speed,t),u.cur.y=Jt(u.cur.y,u.T.y,u.speed,t),u.cur.z=Jt(u.cur.z,u.T.z,u.speed,t);let d=t_.copy(u.cur);d.y-=this.body.position.y,d.y+=.03,T0(u.S,d,n.legU,n.legL,e_.set(0,.1,1),u.E,u.Hd),Vo(u.up,u.S,u.E,u.up.userData.r),Vo(u.lo,u.E,u.Hd,u.lo.userData.r),u.foot.position.set(u.Hd.x,u.Hd.y+this.body.position.y-.03+.005,u.Hd.z+.025)}}},t_=new I,e_=new I,n_=new I(0,1,0);function Hr(i,t,e,n,s,r=null){let o=t.root.position.clone(),a=Math.atan2(e-o.x,n-o.z),l=t.root.rotation.y,c=a-l;for(;c>Math.PI;)c-=Math.PI*2;for(;c<-Math.PI;)c+=Math.PI*2;t.walking=1;let h=0;return i.tween(s,u=>{t.root.position.x=Ht(o.x,e,u),t.root.position.z=Ht(o.z,n,u),t.root.rotation.y=l+c*Math.min(1,u*5);let d=Math.floor(t.walkPhase/Math.PI);d!==h&&(h=d,S.audio&&S.audio.step(.22))},u=>u).then(()=>{if(t.walking=0,t.bob=0,r!==null)return i.tween(.3,u=>{let d=t.root.rotation.y,f=r-d;for(;f>Math.PI;)f-=Math.PI*2;for(;f<-Math.PI;)f+=Math.PI*2;t.root.rotation.y=d+f*u})})}var Gr=[{h:1.1,child:!0,skin:15976869,hair:3811874,hairStyle:"bun",top:15911244,bottom:7114695,dress:!0,pitch:1.25,face:"#f2c94c"},{h:1.12,child:!0,skin:15382674,hair:2761248,hairStyle:"boy",top:7058314,bottom:5070726,shorts:!0,pitch:1.1,face:"#6bb38a"},{h:1.08,child:!0,skin:14263420,hair:4861988,hairStyle:"curly",top:15044520,bottom:9268416,dress:!0,pitch:1.35,face:"#e58fa8"}];function R0(i){let t={};t.mama=new zr({h:1.58,skin:15912368,hair:4862504,hairStyle:"bob",top:11125977,bottom:14208960,dress:!0,longSleeve:!0}),t.papa=new zr({h:1.72,skin:15581340,hair:2892832,hairStyle:"short",top:8362606,bottom:4871528,shoes:9071178}),t.girl=new zr({h:1.1,child:!0,skin:16043950,hair:3877410,hairStyle:"pigtails",top:16249318,bottom:15043210,dress:!0}),t.friends=Gr.map(e=>new zr(e));for(let e of[t.mama,t.papa,t.girl,...t.friends])i.add(e.root),e.root.visible=!1;return t.cat=new tu,i.add(t.cat.root),t}var tu=class{constructor(){let t=fe(15326411,.9,{sheen:.8,sheenRoughness:.5}),e=fe(13208146,.9,{sheen:.8}),n=fe(4864560,.9),s=fe(15311008,.6),r=this.root=new dt,o=this.bodyG=new dt;r.add(o);let a=(c,h,u,d,f,p,x,g)=>{let m=new tt(Si,h);return m.position.set(u,d,f),m.scale.set(p,x,g),m.castShadow=!0,c.add(m),m};this.torso=a(o,t,0,.17,0,.085,.085,.16),a(o,e,.03,.215,-.04,.062,.05,.09),a(o,e,-.04,.2,.07,.05,.045,.06),this.headG=new dt,this.headG.position.set(0,.25,.15),o.add(this.headG),a(this.headG,t,0,0,0,.072,.064,.066),a(this.headG,e,.03,.03,-.01,.045,.04,.05);for(let c of[-1,1]){let h=new tt(new Li(.026,.046,4),c>0?e:t);h.position.set(c*.042,.06,-.005),h.rotation.set(0,Math.PI/4,-c*.25),h.castShadow=!0,this.headG.add(h);let u=new tt(new Li(.014,.028,4),s);u.position.set(c*.042,.056,.006),u.rotation.set(0,Math.PI/4,-c*.25),this.headG.add(u);let d=a(this.headG,new Ge({color:2760728,roughness:.1,clearcoat:1}),c*.03,.008,.058,.0095,.012,.006);(this.eyes=this.eyes||[]).push(d),a(this.headG,t,c*.016,-.02,.058,.02,.016,.016)}a(this.headG,s,0,-.01,.068,.007,.005,.005),this.mouthAnchor=new dt,this.mouthAnchor.position.set(0,-.03,.075),this.headG.add(this.mouthAnchor),this.legs=[];for(let[c,h]of[[-.045,.1],[.045,.1],[-.05,-.1],[.05,-.1]]){let u=new dt;u.position.set(c,.13,h),o.add(u);let d=new tt(A0,t);d.scale.set(.022,.13,.022),d.position.y=-.065,d.castShadow=!0,u.add(d),a(u,t,0,-.125,.008,.024,.014,.03),this.legs.push(u)}this.tail=[];let l=o;for(let c=0;c<6;c++){let h=new dt;h.position.set(0,c===0?.2:0,c===0?-.15:-.045),l.add(h);let u=new tt(Si,c>3?e:t);u.scale.set(.016,.016,.03),u.position.z=-.022,u.castShadow=!0,h.add(u),this.tail.push(h),l=h}this.shadow=qe(ct.blob,.34,.5,.36),this.shadow.position.y=.004,r.add(this.shadow),this.pose="sit",this.walk=0,this.phase=0,this.sitK=1,this.loafK=0,this.purr=0,this.headYaw=0,this.headYawT=0,this.headPitchT=0,this.headPitch=0,this.blinkT=3,this.sleepy=0,Ys((c,h)=>this.update(c,h))}setPose(t){this.pose=t}update(t,e){if(!this.root.visible)return;let n=this.pose==="sit"?1:0,s=this.pose==="loaf"?1:0;this.sitK=Jt(this.sitK,n,6,t),this.loafK=Jt(this.loafK,s,5,t),this.phase+=t*11*this.walk;let r=this.bodyG;r.rotation.x=-this.sitK*.62,r.position.y=-this.loafK*.085-this.sitK*.012+Math.abs(Math.sin(this.phase))*.006*this.walk+(this.purr?Math.sin(e*150)*.0012:0),r.position.z=this.sitK*.03,this.headYaw=Jt(this.headYaw,this.headYawT,6,t),this.headPitch=Jt(this.headPitch,this.headPitchT,6,t),this.headG.rotation.set(this.sitK*.6+this.headPitch,this.headYaw,0),this.legs.forEach((a,l)=>{let c=l<2,h=Math.sin(this.phase+(l%2?Math.PI:0)+(c?0:Math.PI))*.55*this.walk;a.rotation.x=h+(c?this.sitK*.62:-this.sitK*.9),a.scale.y=1-this.loafK*.75-(c?0:this.sitK*.45)}),this.tail.forEach((a,l)=>{a.rotation.x=(l===0?.9-this.sitK*.7-this.loafK*.6:.16)+Math.sin(e*2.2+l*.7)*.05,a.rotation.y=Math.sin(e*1.7+l*.6)*(.12+this.sitK*.2)+(l>0?this.sitK*.35+this.loafK*.45:0)}),this.blinkT-=t;let o=this.blinkT<.12||this.sleepy?.12:1;this.blinkT<0&&(this.blinkT=2.5+Math.random()*4);for(let a of this.eyes)a.scale.y=.012*o}walkTo(t,e,n,s=.9){let r=this.root.position.clone(),o=Math.hypot(e-r.x,n-r.z),a=o/s,l=Math.atan2(e-r.x,n-r.z),c=this.root.rotation.y,h=l-c;for(;h>Math.PI;)h-=Math.PI*2;for(;h<-Math.PI;)h+=Math.PI*2;return this.setPose("stand"),this.walk=1,t.tween(a,u=>{this.root.position.x=Ht(r.x,e,u),this.root.position.z=Ht(r.z,n,u),this.root.rotation.y=c+h*Math.min(1,u*6)},u=>u).then(()=>{this.walk=0})}};var lc=class{constructor(){this.ctx=null,this.ok=!1,this.muted=!1,this.loops={},this.cook={sizzle:0,boil:0,thick:0,lid:!1},this.lastPop=0,this._crackT=0,this.music=null}unlock(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{});return}try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=this.ctx=new t;this.master=e.createGain(),this.master.gain.value=this.muted?0:.55;let n=e.createDynamicsCompressor();n.threshold.value=-16,n.knee.value=18,n.ratio.value=5,n.attack.value=.004,n.release.value=.2,this.master.connect(n),n.connect(e.destination),this.cookLP=e.createBiquadFilter(),this.cookLP.type="lowpass",this.cookLP.frequency.value=16e3,this.cookLP.connect(this.master);let s=e.sampleRate*2,r=e.createBuffer(1,s,e.sampleRate),o=r.getChannelData(0),a=0;for(let h=0;h<s;h++){let u=Math.random()*2-1;o[h]=u}this.noiseBuf=r;let l=e.createBuffer(1,s,e.sampleRate),c=l.getChannelData(0);for(let h=0;h<s;h++){let u=Math.random()*2-1;a=.985*a+.15*u,c[h]=a*2.2}this.brownBuf=l,this.ok=!0,e.state==="suspended"&&e.resume().catch(()=>{})}catch{this.ok=!1,this.ctx=null}}setMuted(t){this.muted=t,this.ok&&this.master.gain.setTargetAtTime(t?0:.55,this.ctx.currentTime,.05)}get t(){return this.ctx.currentTime}tone({f:t=440,f1:e=null,dur:n=.2,type:s="sine",vol:r=.2,attack:o=.004,when:a=0,dest:l=null,curve:c="exp",detune:h=0}){if(!this.ok)return;let u=this.ctx,d=u.currentTime+a,f=u.createOscillator(),p=u.createGain();f.type=s,f.frequency.setValueAtTime(t,d),f.detune.value=h,e&&f.frequency.exponentialRampToValueAtTime(Math.max(1,e),d+n),p.gain.setValueAtTime(1e-4,d),p.gain.linearRampToValueAtTime(r,d+o),c==="exp"?p.gain.exponentialRampToValueAtTime(1e-4,d+n):p.gain.linearRampToValueAtTime(1e-4,d+n),f.connect(p),p.connect(l||this.master),f.start(d),f.stop(d+n+.02)}noise({dur:t=.1,vol:e=.2,type:n="bandpass",f:s=2e3,f1:r=null,q:o=1,attack:a=.002,when:l=0,dest:c=null,brown:h=!1,hold:u=0}){if(!this.ok)return;let d=this.ctx,f=d.currentTime+l,p=d.createBufferSource();p.buffer=h?this.brownBuf:this.noiseBuf,p.loop=!0;let x=d.createBiquadFilter();x.type=n,x.frequency.setValueAtTime(s,f),x.Q.value=o,r&&x.frequency.exponentialRampToValueAtTime(r,f+t);let g=d.createGain();g.gain.setValueAtTime(1e-4,f),g.gain.linearRampToValueAtTime(e,f+a),u&&g.gain.setValueAtTime(e,f+a+u),g.gain.exponentialRampToValueAtTime(1e-4,f+t),p.connect(x),x.connect(g),g.connect(c||this.master),p.start(f,Math.random()*1.5),p.stop(f+t+.02)}loop(t,{type:e="bandpass",f:n=2e3,q:s=.7,brown:r=!1,dest:o=null}={}){if(!this.ok)return null;if(this.loops[t])return this.loops[t];let a=this.ctx,l=a.createBufferSource();l.buffer=r?this.brownBuf:this.noiseBuf,l.loop=!0;let c=a.createBiquadFilter();c.type=e,c.frequency.value=n,c.Q.value=s;let h=a.createGain();return h.gain.value=0,l.connect(c),c.connect(h),h.connect(o||this.master),l.start(0,Math.random()),this.loops[t]={g:h,fl:c,s:l}}setLoop(t,e,n){let s=this.loop(t,n);if(s)return(s.vol===void 0||Math.abs(e-s.vol)>.0015||e===0&&s.vol!==0)&&(s.vol=e,s.g.gain.setTargetAtTime(e,this.t,.06)),s}knobPress(){this.tone({f:190,f1:120,dur:.05,vol:.12})}knobClick(t=.6){this.noise({dur:.018,vol:.2*t,f:2600+Math.random()*600,q:2.5}),this.tone({f:1050+Math.random()*120,dur:.03,vol:.05*t,type:"triangle"})}spark(){this.noise({dur:.012,vol:.28,type:"highpass",f:4200}),this.tone({f:3100,dur:.012,vol:.05,type:"square"})}ignite(){this.noise({dur:.42,vol:.2,type:"lowpass",f:260,f1:1300,attack:.03,brown:!1}),this.tone({f:95,f1:60,dur:.22,vol:.14})}puff(){this.noise({dur:.2,vol:.2,type:"lowpass",f:700,f1:180,attack:.01}),this.tone({f:150,f1:70,dur:.16,vol:.12}),this.chime(.5,.12)}setHiss(t,e){if(!this.ok)return;let n=this.setLoop("hiss-"+t,e*.03+(e>.01?.008:0),{type:"bandpass",f:3400,q:.5});n&&(n.lv===void 0||Math.abs(e-n.lv)>.01)&&(n.lv=e,n.fl.frequency.setTargetAtTime(2600+e*1800,this.t,.1))}setCooking({sizzle:t,boil:e,thick:n,lid:s}){if(this.cook.sizzle=t,this.cook.boil=e,this.cook.thick=n,this.cook.lid=s,!this.ok)return;this._lid!==s&&(this._lid=s,this.cookLP.frequency.setTargetAtTime(s?520:16e3,this.t,.12)),this.setLoop("sizzle",t*.1,{type:"highpass",f:2800,q:.4,dest:this.cookLP});let r=this.setLoop("simmer",e*(.02+.02*(1-n)),{type:"lowpass",f:420,q:.6,brown:!0,dest:this.cookLP})}update(t){if(!this.ok)return;let e=this.cook;e.sizzle>.05&&(this._crackT-=t*(6+e.sizzle*26),this._crackT<=0&&(this._crackT=.3+Math.random(),this.noise({dur:.012+Math.random()*.02,vol:.05+Math.random()*.12*e.sizzle,type:"highpass",f:2500+Math.random()*4e3,dest:this.cookLP})))}blup(t=.01,e=0){if(!this.ok)return;let n=this.t;if(n-this.lastPop<.035)return;this.lastPop=n;let s=re(t/.016),r=(520-300*s)*(1-e*.5)*(.85+Math.random()*.3);this.tone({f:r,f1:r*(e>.5?.55:1.6),dur:.05+.07*e+.04*s,vol:.05+.07*s+.04*e,dest:this.cookLP}),e>.4&&this.noise({dur:.05,vol:.03,type:"lowpass",f:500,dest:this.cookLP})}drip(t=0){this.tone({f:700-350*t+Math.random()*200,f1:1100-700*t,dur:.05+t*.05,vol:.05,dest:this.cookLP})}plop(t=.6){this.tone({f:300+Math.random()*80,f1:520,dur:.09,vol:.16*t}),this.noise({dur:.14,vol:.1*t,f:1800,q:.6,attack:.01})}pourSet(t){this.setLoop("pour",t*.09,{type:"bandpass",f:1500,q:.4}),this.setLoop("pour2",t*.05,{type:"lowpass",f:380,q:1,brown:!0})}waterSet(t){this.setLoop("tap",t*.085,{type:"bandpass",f:3200,q:.35}),this.setLoop("tap2",t*.06,{type:"lowpass",f:500,q:.8,brown:!0})}splash(t=.5){this.noise({dur:.18,vol:.12*t,f:2400,q:.5,attack:.008})}thunk(t=1,e=.6){this.tone({f:170*t,f1:95*t,dur:.09,vol:.32*e}),this.noise({dur:.035,vol:.2*e,type:"lowpass",f:1400*t})}chop(t=1){this.noise({dur:.05,vol:.3,type:"bandpass",f:1900*t,q:.8}),this.thunk(.9+t*.25,.9),this.tone({f:420*t,f1:200,dur:.05,vol:.08,type:"triangle"})}clack(t=.7){for(let[e,n]of[[1750,.09],[2840,.06],[4100,.04]])this.tone({f:e*(.97+Math.random()*.06),dur:n,vol:.08*t,type:"triangle"});this.thunk(1.6,.5*t)}lidClack(t=.6){for(let[e,n]of[[2300,.07],[3650,.05],[5200,.03]])this.tone({f:e*(.96+Math.random()*.08),dur:n,vol:.06*t+.02,type:"triangle",dest:this.master});this.noise({dur:.02,vol:.08*t,type:"highpass",f:3e3})}clink(t=.7,e=1){for(let[n,s]of[[2090,.3],[3420,.22],[5230,.12]])this.tone({f:n*e*(.99+Math.random()*.02),dur:s,vol:.075*t,type:"sine"});this.noise({dur:.012,vol:.1*t,type:"highpass",f:5e3})}tap(t=.5){this.tone({f:620,f1:420,dur:.045,vol:.12*t,type:"triangle"})}pop(t=.6){this.tone({f:380,f1:900,dur:.07,vol:.2*t})}pick(t=.6){this.tone({f:520,f1:780,dur:.07,vol:.14*t,type:"triangle"})}beep(){this.tone({f:1760,dur:.09,vol:.1,type:"square",curve:"lin"}),this.tone({f:2640,dur:.09,vol:.03,type:"sine",curve:"lin"})}swish(t=.5,e=1800){this.noise({dur:.22,vol:.12*t,f:e,f1:e*2.2,q:.7,attack:.05})}cloth(t=.5){this.noise({dur:.3,vol:.09*t,f:900,f1:2200,q:.5,attack:.06})}squeak(t=.6){let e=1300+Math.random()*500;this.tone({f:e,f1:e*1.5,dur:.11,vol:.05*t,type:"sine"}),this.noise({dur:.1,vol:.03*t,f:5200,q:3})}scrub(t=.5){this.noise({dur:.12,vol:.09*t,f:2600+Math.random()*1500,q:.8,attack:.02})}foamPop(){this.tone({f:1500+Math.random()*1800,f1:2800,dur:.02,vol:.02})}stick(){this.noise({dur:.05,vol:.2,type:"lowpass",f:900}),this.tone({f:240,f1:150,dur:.07,vol:.2})}step(t=.4){this.thunk(.55+Math.random()*.1,t)}pen(t=.4){this.noise({dur:.07,vol:.05*t,f:3200+Math.random()*1500,q:1.2,attack:.01})}fridgeOpen(){this.tone({f:110,f1:70,dur:.14,vol:.25}),this.noise({dur:.25,vol:.1,type:"lowpass",f:600,f1:1800,attack:.03}),this.clink(.25,1.4)}fridgeClose(){this.thunk(.6,.9),this.noise({dur:.1,vol:.08,type:"lowpass",f:500})}setHum(t){if(!(!this.ok||t===0&&!this.hum)){if(!this.hum){let e=this.ctx,n=e.createGain();n.gain.value=0,n.connect(this.master);for(let[s,r]of[[100,.5],[200,.16],[50,.5]]){let o=e.createOscillator();o.frequency.value=s;let a=e.createGain();a.gain.value=r,o.connect(a),a.connect(n),o.start()}this.hum=n}this.hum.gain.setTargetAtTime(t*.035,this.t,.2)}}doorOpen(){this.noise({dur:.1,vol:.14,type:"lowpass",f:900}),this.tone({f:300,f1:420,dur:.5,vol:.02,type:"sawtooth",attack:.1}),this.thunk(.8,.5)}doorbell(){let t=(e,n)=>{for(let[s,r,o]of[[1,.2,1.3],[2.01,.08,.9],[3.02,.04,.5],[4.2,.02,.3]])this.tone({f:e*s,dur:o,vol:r,when:n})};t(659.3,0),t(523.3,.55)}chime(t=.6,e=0){[1318,1568,2093].forEach((n,s)=>{this.tone({f:n,dur:.5,vol:.05*t,when:e+s*.06}),this.tone({f:n*2.01,dur:.25,vol:.015*t,when:e+s*.06})})}mallet(t,e=0,n=.16,s=.5){this.tone({f:t,dur:s,vol:n,when:e}),this.tone({f:t*4,dur:s*.22,vol:n*.28,when:e}),this.tone({f:t*10.2,dur:.05,vol:n*.1,when:e})}jingle(t="ok"){let e={C:523.25,D:587.33,E:659.25,F:698.46,G:783.99,A:880,B:987.77,C2:1046.5,E2:1318.5,G2:1568},n=t==="big"?[["C",0],["E",.12],["G",.24],["C2",.36],["G",.52],["C2",.64],["E2",.8]]:t==="soft"?[["E",0],["G",.14]]:[["C",0],["E",.11],["G",.22]];for(let[s,r]of n)this.mallet(e[s],r,t==="soft"?.1:.15,t==="big"?.7:.45)}dance(){if(!this.ok)return 7.4;let t={C:523.25,D:587.33,E:659.25,F:698.46,G:783.99,A:880,B:987.77,c:1046.5,d:1174.7,e:1318.5,g:1568},e=.23,n="G E G c . A c A G . E G E C . . F A c e . d c A G . G A B c . c .".split(" ");n.forEach((r,o)=>{r!=="."&&this.mallet(t[r],o*e,.15,.4)});let s=[130.8,130.8,174.6,130.8,174.6,196,196,130.8];for(let r=0;r<16;r++)this.tone({f:s[(r>>1)%8],dur:.2,vol:.13,type:"triangle",when:r*e*2}),this.noise({dur:.04,vol:.035,type:"highpass",f:6e3,when:r*e*2+e}),this.noise({dur:.03,vol:.02,type:"highpass",f:7e3,when:r*e*2});return n.length*e}voice({f:t=400,f1:e=500,dur:n=.25,vol:s=.16,vowel:r="a",when:o=0,vib:a=0}){if(!this.ok)return;let l=this.ctx,c=l.currentTime+o,h=l.createOscillator();if(h.type="sawtooth",h.frequency.setValueAtTime(t,c),h.frequency.exponentialRampToValueAtTime(e,c+n),a){let f=l.createOscillator(),p=l.createGain();f.frequency.value=6,p.gain.value=a,f.connect(p),p.connect(h.frequency),f.start(c),f.stop(c+n)}let u={a:[800,1250],o:[480,850],u:[340,900],e:[520,1850],i:[300,2300],m:[260,1e3]}[r]||[700,1200],d=l.createGain();d.gain.setValueAtTime(1e-4,c),d.gain.linearRampToValueAtTime(s,c+Math.min(.04,n*.3)),d.gain.setValueAtTime(s,c+n*.6),d.gain.exponentialRampToValueAtTime(1e-4,c+n);for(let[f,p]of u.entries()){let x=l.createBiquadFilter();x.type="bandpass",x.frequency.value=p,x.Q.value=7;let g=l.createGain();g.gain.value=f?.5:1,h.connect(x),x.connect(g),g.connect(d)}d.connect(this.master),h.start(c),h.stop(c+n+.02)}sneeze(){this.voice({f:380,f1:520,dur:.32,vol:.1,vowel:"a"}),this.voice({f:560,f1:300,dur:.16,vol:.14,vowel:"u",when:.36}),this.noise({dur:.22,vol:.16,type:"highpass",f:2200,when:.36,attack:.01})}yawn(){this.voice({f:330,f1:430,dur:.5,vol:.09,vowel:"a"}),this.voice({f:430,f1:250,dur:.8,vol:.09,vowel:"o",when:.48,vib:3}),this.noise({dur:.9,vol:.02,f:1200,q:.4,when:.4,attack:.3})}hmm(t=!0){this.voice({f:t?420:380,f1:t?560:330,dur:.22,vol:.1,vowel:"m"})}wow(t=1){this.voice({f:430*t,f1:720*t,dur:.3,vol:.13,vowel:"a"}),this.voice({f:720*t,f1:560*t,dur:.25,vol:.1,vowel:"a",when:.28})}hello(t=1){this.voice({f:520*t,f1:640*t,dur:.14,vol:.12,vowel:"e"}),this.voice({f:640*t,f1:500*t,dur:.24,vol:.12,vowel:"o",when:.16})}giggle(t=1){for(let e=0;e<4;e++)this.voice({f:(620-e*30)*t,f1:(700-e*30)*t,dur:.09,vol:.09,vowel:e%2?"i":"e",when:e*.12})}yum(t=1){this.voice({f:380*t,f1:520*t,dur:.32,vol:.1,vowel:"m",vib:4})}chew(){for(let t=0;t<3;t++)this.noise({dur:.07,vol:.06,type:"lowpass",f:700,when:t*.17,brown:!0})}bite(){this.tone({f:320,f1:190,dur:.07,vol:.12}),this.noise({dur:.05,vol:.06,type:"lowpass",f:1200})}rumble(t=1.1,e=1){if(!this.ok)return;let n=this.ctx,s=n.currentTime,r=n.createOscillator();r.type="sawtooth",r.frequency.setValueAtTime(52,s),r.frequency.linearRampToValueAtTime(74,s+t*.4),r.frequency.linearRampToValueAtTime(44,s+t);let o=n.createOscillator(),a=n.createGain();o.frequency.value=11,a.gain.value=16,o.connect(a),a.connect(r.frequency);let l=n.createBiquadFilter();l.type="lowpass",l.frequency.value=260;let c=n.createGain();c.gain.setValueAtTime(1e-4,s),c.gain.linearRampToValueAtTime(.3*e,s+.15),c.gain.linearRampToValueAtTime(.18*e,s+t*.6),c.gain.exponentialRampToValueAtTime(1e-4,s+t),r.connect(l),l.connect(c),c.connect(this.master),r.start(s),o.start(s),r.stop(s+t+.05),o.stop(s+t+.05),this.noise({dur:t,vol:.05*e,type:"lowpass",f:200,brown:!0,attack:.2})}purr(t=1.6){if(!this.ok)return;let e=this.ctx,n=e.currentTime,s=e.createBufferSource();s.buffer=this.brownBuf,s.loop=!0;let r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=240;let o=e.createGain();o.gain.value=0;let a=e.createOscillator();a.type="sawtooth",a.frequency.value=24;let l=e.createGain();l.gain.value=.16,a.connect(l),l.connect(o.gain);let c=e.createGain();c.gain.setValueAtTime(1e-4,n),c.gain.linearRampToValueAtTime(1,n+.2),c.gain.setValueAtTime(1,n+t-.3),c.gain.linearRampToValueAtTime(1e-4,n+t);let h=e.createOscillator();h.type="triangle",h.frequency.value=27;let u=e.createGain();u.gain.value=.2,h.connect(u),u.connect(c),s.connect(r),r.connect(o),o.connect(c),c.connect(this.master),s.start(n),a.start(n),h.start(n),s.stop(n+t+.05),a.stop(n+t+.05),h.stop(n+t+.05)}meow(t=1){this.voice({f:520*t,f1:820*t,dur:.16,vol:.09,vowel:"i"}),this.voice({f:820*t,f1:560*t,dur:.38,vol:.1,vowel:"a",when:.15,vib:5})}};var Vr=Symbol("cancel"),cc=class{constructor(){this.tasks=new Set,this.alive=!0,this.cleanups=[],this.time=0}update(t){if(this.alive){this.time+=t;for(let e of[...this.tasks]){if(!this.tasks.has(e))continue;let n=!1;try{n=e.step(t)}catch(s){this.tasks.delete(e),e.reject(s);continue}n&&(this.tasks.delete(e),e.resolve(e.value))}}}_task(t){return this.alive?new Promise((e,n)=>{this.tasks.add({step:t,resolve:e,reject:n,value:void 0})}):Promise.reject(Vr)}wait(t){let e=0;return this._task(n=>(e+=n)>=t)}tween(t,e,n=Xe.inOut){let s=0;return e(n(0)),this._task(r=>{s+=r;let o=t<=0?1:Math.min(1,s/t);return e(n(o)),o>=1})}until(t){return this._task(()=>!!t())}every(t){let e=0,n={step:s=>(e+=s,t(s,e)===!1),resolve(){},reject(){}};return this.alive&&this.tasks.add(n),()=>this.tasks.delete(n)}signal(){let t,e={step:()=>!1,resolve:null,reject:null,value:void 0},n=new Promise((s,r)=>{e.resolve=s,e.reject=r});return this.alive?(this.tasks.add(e),t=s=>{this.tasks.has(e)&&(this.tasks.delete(e),e.resolve(s))},{promise:n,fire:t}):(n.catch(()=>{}),e.reject(Vr),{promise:n,fire(){}})}onEnd(t){this.cleanups.push(t)}cancel(){if(!this.alive)return;this.alive=!1;let t=[...this.tasks];this.tasks.clear();for(let e of t)try{e.reject(Vr)}catch{}for(let e of this.cleanups.splice(0))try{e()}catch(n){console.error(n)}}end(){this.cancel()}};function ve(i){return i.catch(t=>{t!==Vr&&console.error(t)}),i}var ws=Ge,uc=He,rn=(i,t,e)=>new I(i,t,e),eu=i=>"#"+i.toString(16).padStart(6,"0");function C0(i,t,e,n,s){if(i.save(),i.translate(t,e),i.fillStyle=eu(s.hair),i.beginPath(),i.arc(0,-n*.12,n*1.08,0,6.3),i.fill(),s.hairStyle==="bun"&&(i.beginPath(),i.arc(0,-n*1.2,n*.42,0,6.3),i.fill()),s.hairStyle==="curly")for(let r=0;r<8;r++)i.beginPath(),i.arc(Math.cos(r*.8+3.4)*n*1.05,Math.sin(r*.8+3.4)*n*1-n*.1,n*.36,0,6.3),i.fill();i.fillStyle=eu(s.skin),i.beginPath(),i.arc(0,0,n,0,6.3),i.fill(),i.fillStyle=eu(s.hair),i.beginPath(),i.ellipse(0,-n*.72,n*.86,n*.38,0,Math.PI,0),i.fill(),i.fillStyle="#2a1c16";for(let r of[-1,1])i.beginPath(),i.ellipse(r*n*.36,n*.02,n*.1,n*.13,0,0,6.3),i.fill();i.fillStyle="rgba(240,130,120,0.45)";for(let r of[-1,1])i.beginPath(),i.arc(r*n*.58,n*.32,n*.17,0,6.3),i.fill();i.strokeStyle="#7a3b2e",i.lineWidth=n*.09,i.lineCap="round",i.beginPath(),i.arc(0,n*.22,n*.36,.2*Math.PI,.8*Math.PI),i.stroke(),i.restore()}function i_(i,t,e,n){i.save(),i.translate(t,e),i.scale(n,n),i.fillStyle="#f0b429",i.beginPath(),i.moveTo(-30,22),i.quadraticCurveTo(-22,8,-22,-8),i.quadraticCurveTo(-22,-34,0,-34),i.quadraticCurveTo(22,-34,22,-8),i.quadraticCurveTo(22,8,30,22),i.closePath(),i.fill(),i.fillStyle="#d99a1c",i.beginPath(),i.arc(0,28,8,0,6.3),i.fill(),i.beginPath(),i.arc(0,-38,5,0,6.3),i.fill(),i.strokeStyle="#f0b429",i.lineWidth=4,i.lineCap="round";for(let s of[-1,1])i.beginPath(),i.arc(s*34,-8,12,s>0?-.8:Math.PI-.8,s>0?.8:Math.PI+.8),i.stroke(),i.beginPath(),i.arc(s*36,-8,22,s>0?-.7:Math.PI-.7,s>0?.7:Math.PI+.7),i.stroke();i.restore()}function I0(i){let t=he(384,512),e=t.getContext("2d"),n=Gr[i%Gr.length];e.fillStyle="#fdfaf2",e.fillRect(0,0,384,512),e.fillStyle="#f6c8b8",e.fillRect(0,0,384,232),e.fillStyle="#fff6e6",e.fillRect(236,96,116,112),e.fillStyle="#d9775f",e.beginPath(),e.moveTo(222,100),e.lineTo(294,42),e.lineTo(366,100),e.closePath(),e.fill(),e.fillStyle="#8fae9b",Kl(e,276,138,38,70,6),e.fill(),e.fillStyle="#f0b429",e.beginPath(),e.arc(306,176,4,0,6.3),e.fill(),C0(e,116,128,66,n),i_(e,196,60,.62),e.fillStyle="#c9c4ba";for(let u=0;u<12;u++)e.beginPath(),e.arc(22+u*31,8,7,0,6.3),e.fill();let s=7,r=4,o=26,a=262,l=48,c=56,h=10;for(let u=0;u<r;u++)for(let d=0;d<s;d++){let f=u*s+d;e.fillStyle=d===0?"#fbe3dc":d===6?"#dfeaf6":"#f1ece0",Kl(e,o+d*l,a+u*c,l-6,c-6,7),e.fill(),f<h&&(e.strokeStyle="#b9b2a4",e.lineWidth=3,e.lineCap="round",e.beginPath(),e.moveTo(o+d*l+10,a+u*c+12),e.lineTo(o+d*l+l-16,a+u*c+c-18),e.stroke()),f===h&&(C0(e,o+d*l+(l-6)/2,a+u*c+(c-6)/2+2,14,n),e.strokeStyle="#e23b2e",e.lineWidth=5,e.beginPath(),e.ellipse(o+d*l+(l-6)/2,a+u*c+(c-6)/2,25,28,.2,0,6.3),e.stroke())}return Ot(t,{srgb:!0})}function Yo(i,t=1,e=1,n=!0){let s=i.getContext("2d"),r=i.width,o=r/2,a=de(e);s.clearRect(0,0,r,r),n&&(s.fillStyle="#fffdf6",s.beginPath(),s.arc(o,o,o*.97,0,6.3),s.fill(),s.strokeStyle="rgba(0,0,0,0.06)",s.lineWidth=2,s.stroke());let l=[],c=2.6,h=o*.47;for(let p=0;p<=150;p++){let x=p/150,g=x*c*Math.PI*2-1.2,m=h*(.12+.88*x);l.push([o+Math.cos(g)*m*(1+.03*Math.sin(p*.7+e)),o+Math.sin(g)*m])}let u=c*Math.PI*2-1.2,d=7;for(let p=0;p<d;p++)for(let x=1;x<=22;x++){let g=x/22,m=u+(p+g)/d*Math.PI*2,_=h*(1+Math.sin(g*Math.PI)*.66);l.push([o+Math.cos(m)*_,o+Math.sin(m)*_])}let f=Math.max(2,Math.floor(l.length*re(t)));s.lineCap="round",s.lineJoin="round";for(let p=0;p<3;p++){s.strokeStyle=`rgba(${226-p*8},${40+p*12},${38+p*6},${p===0?.95:.35})`,s.lineWidth=r*(p===0?.04:.018),s.beginPath();for(let x=0;x<f;x++){let[g,m]=l[x],_=p?(a()-.5)*r*.012:0,v=p?(a()-.5)*r*.012:0;x===0?s.moveTo(g+_,m+v):s.lineTo(g+_,m+v)}s.stroke()}return l[f-1]}var P0=new Map;function L0(i=1,t=.13){let e=P0.get(i);if(!e){let n=he(256);Yo(n,1,i),e=new uc({map:Ot(n,{srgb:!0}),transparent:!0,roughness:.75,alphaTest:.05}),e.userData.keep=!0,e.map.userData.keep=!0,P0.set(i,e)}return new tt(new ce(t,t),e)}function D0(i,t=.105){let e=new dt,n=new tt(new ce(t,t*1.16),new uc({color:16513523,roughness:.6}));e.add(n);let s=new Ln;s.colorSpace=hn;let r=new Image;r.onload=()=>{s.image=r,s.needsUpdate=!0},r.src=i;let o=new tt(new ce(t*.88,t*.82),new uc({map:s,roughness:.35}));o.position.set(0,t*.1,6e-4),e.add(o);let a=new tt(new Me(.009,.009,.005,16).rotateX(Math.PI/2),fe(15227466,.4));return a.position.set(0,t*.53,.003),e.add(a),e}function s_(){let i=he(256,384),t=i.getContext("2d"),e=de(3);t.clearRect(0,0,256,384),t.beginPath(),t.moveTo(78,6),t.lineTo(178,6),t.quadraticCurveTo(184,96,250,132),t.lineTo(250,340),t.quadraticCurveTo(250,378,212,378),t.lineTo(44,378),t.quadraticCurveTo(6,378,6,340),t.lineTo(6,132),t.quadraticCurveTo(72,96,78,6),t.closePath(),t.save(),t.clip(),t.fillStyle="#fbf3e2",t.fillRect(0,0,256,384);for(let s=0;s<26;s++){let r=24+s%5*52+(s/5|0)%2*26,o=40+(s/5|0)*62+e()*8;t.save(),t.translate(r,o),t.rotate((e()-.5)*.6),t.fillStyle="#e2453c",t.beginPath(),t.moveTo(0,13),t.bezierCurveTo(-15,2,-11,-11,0,-8),t.bezierCurveTo(11,-11,15,2,0,13),t.fill(),t.fillStyle="#5fa046",t.beginPath(),t.ellipse(0,-9,8,3.4,0,0,6.3),t.fill(),t.fillStyle="#ffe9a8";for(let[a,l]of[[-4,-1],[4,-1],[0,4],[-3,6],[3,6]])t.fillRect(a,l,1.6,1.6);t.restore()}t.restore(),t.strokeStyle="#e2594e",t.lineWidth=9,t.stroke(),t.strokeStyle="#e2594e",t.lineWidth=5,t.fillStyle="#fff8ec",Kl(t,86,216,84,70,14),t.fill(),t.stroke();let n=Ms(128,{seed:4,threads:40});return{map:Ot(i,{srgb:!0}),normal:Ot(n.normal,{repeat:[6,9]})}}var Wr=null;function dc(i=.3,t=.44){Wr||(Wr=s_(),Wr.map.userData.keep=!0,Wr.normal.userData.keep=!0);let e=new ce(i,t,12,16);e.translate(0,-t/2,0);let n=e.attributes.position.array.slice(),s=new ws({map:Wr.map,normalMap:Wr.normal,normalScale:new xt(.6,.6),alphaTest:.5,side:Ce,roughness:.93,sheen:.5,sheenRoughness:.6}),r=new tt(e,s);r.castShadow=!0;let o=new dt;o.add(r);let a=Rn([rn(-i*.19,-.01,0),rn(-i*.14,.05,.004),rn(0,.075,.008),rn(i*.14,.05,.004),rn(i*.19,-.01,0)],.004,fe(14833998,.9),16,6);return o.add(a),o.userData={mesh:r,base:n,w:i,h:t,swing:0,swingV:0,wave:0},o.userData.update=(l,c)=>{let h=o.userData;h.swingV+=(-h.swing*26-h.swingV*2.2)*l,h.swing+=h.swingV*l,h.wave=Math.max(0,h.wave-l*.5);let u=e.attributes.position,d=.004+Math.min(.03,Math.abs(h.swingV)*.012)+h.wave*.02;for(let f=0;f<u.count;f++){let p=n[f*3],x=n[f*3+1],g=-x/t;u.setXYZ(f,p+h.swing*g*g*.16,x+Math.abs(h.swing)*g*.02,Math.sin(p*22+c*3.2+x*9)*d*g+Math.sin(x*14-c*5)*d*.6*g+.012*g*Math.cos(p*9))}u.needsUpdate=!0,e.computeVertexNormals()},o}function N0(){let i=new dt,t=he(128),e=t.getContext("2d");e.fillStyle="#444",e.fillRect(0,0,128,128);for(let a=0;a<8;a++)for(let l=0;l<16;l++){let c=a%2?4:0,h=e.createLinearGradient(l*8+c,0,l*8+8+c,0);h.addColorStop(0,"#333"),h.addColorStop(.5,"#fff"),h.addColorStop(1,"#333"),e.fillStyle=h,e.fillRect(l*8+c-4,a*16+2,8,12)}let n=new uc({color:13081180,roughness:.8,normalMap:Ot(Mi(t,3),{repeat:[5,2]}),side:Ce});i.add(ne([[0,.004],[.13,.004],[.145,.012],[.165,.12],[.17,.128],[.164,.126],[.14,.014],[0,.012]],n,40));let s=new tt(new hi(.167,.008,8,40),n);s.rotation.x=Math.PI/2,s.position.y=.127,s.castShadow=!0,i.add(s);let r=Rn([rn(-.165,.125,0),rn(-.15,.24,0),rn(0,.3,0),rn(.15,.24,0),rn(.165,.125,0)],.008,n,24,8);i.add(r);let o=new tt(new yn(.138,28),q.towel);return o.rotation.x=-Math.PI/2,o.position.y=.014,i.add(o),i.add(qe(ct.blob,.42,.42,.4)),i}function fc(i=.1,t=.075,e=q.steelPolished){let n=new dt;n.add(ne([[0,0],[i*.5,0],[i*.78,t*.3],[i*.95,t*.75],[i,t],[i*.985,t+.002],[i*.93,t*.75],[i*.76,t*.32],[i*.48,.004],[0,.004]],e,48,{smooth:3}));let s=qe(ct.blob,i*2.9,i*2.9,.42);return s.position.y=6e-4,n.add(s),n.userData={r:i,h:t},n}function pc(i=.32,t=14676735){let e=ct.waterNormal.clone();return e.wrapS=e.wrapT=Ri,e.repeat.set(2,2),e.needsUpdate=!0,new ws({color:t,roughness:.03,transparent:!0,opacity:i,envMapIntensity:1.6,normalMap:e,normalScale:new xt(.25,.25),depthWrite:!1})}function F0(){let i=new dt,t=Lt(.4,.022,.27,q.board,.007,2);t.position.y=.011,i.add(t);let e=qe(ct.blob,.5,.36,.4);return e.position.y=7e-4,i.add(e),i}function nu(){let i=new dt,t=ne([[0,0],[.105,0],[.11,.006],[.105,.012],[0,.012]],q.woodDark,36);i.add(t);let e=qe(ct.blob,.3,.3,.4);return e.position.y=6e-4,i.add(e),i}function U0(){let i=new dt,t=q.plasticWhite,e=fe(7323507,.45,{clearcoat:.4}),n=new ws({color:15924223,roughness:.08,transparent:!0,opacity:.26,clearcoat:1,depthWrite:!1,side:Ce});for(let[f,p]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let x=Lt(.018,.075,.018,t,.005,1);x.position.set(f*.066,.0375,p*.056),i.add(x)}let s=Lt(.16,.022,.14,t,.008,2);s.position.y=.084,i.add(s);let r=new tt(new Me(.058,.058,.07,32,1,!0),n);r.position.y=.128,r.renderOrder=7,i.add(r);let o=q.steelPolished;for(let f=-2;f<=2;f++){let p=Lt(.11,.004,.0018,o,5e-4,1);p.position.set(0,.096,f*.021),i.add(p);let x=Lt(.0018,.004,.11,o,5e-4,1);x.position.set(f*.021,.096,0),i.add(x)}let a=Lt(.03,.18,.024,t,.008,2);a.position.set(0,.09,-.082),i.add(a);let l=new dt;l.position.set(0,.178,-.082),i.add(l);let c=Lt(.026,.02,.25,t,.008,2);c.position.set(0,0,.115),l.add(c);let h=new tt(new Me(.052,.052,.026,28),t);h.position.set(0,-.026,.082),h.castShadow=!0,l.add(h);let u=new tt(new Re(.032,24,18),e);u.position.set(0,.012,.245),u.castShadow=!0,l.add(u);let d=qe(ct.blob,.3,.3,.4);return d.position.y=7e-4,i.add(d),i.userData={lever:l,knob:u,top:rn(0,.1,0),open:-.4,closed:.12},l.rotation.x=i.userData.open,i}function O0(){let i=new dt,t=ne([[0,.004],[.05,.004],[.054,.012],[.058,.13],[.062,.14],[.058,.138],[.054,.014],[0,.01]],q.glassThick,36);t.castShadow=!1,t.renderOrder=7,i.add(t);let e=new tt(new Me(.054,.05,.1,28),pc(.3));e.position.y=.062,e.renderOrder=6,i.add(e);let n=Rn([rn(-.056,.12,0),rn(-.095,.115,0),rn(-.1,.07,0),rn(-.06,.04,0)],.007,q.glassThick,16,8);n.castShadow=!1,i.add(n);let s=he(64,128),r=s.getContext("2d");r.strokeStyle="rgba(220,60,50,0.9)",r.lineWidth=3;for(let l=0;l<6;l++)r.beginPath(),r.moveTo(8,16+l*19),r.lineTo(l%2?30:46,16+l*19),r.stroke();let o=new tt(new ce(.03,.09),new Ue({map:Ot(s,{srgb:!0}),transparent:!0,depthWrite:!1}));o.position.set(.03,.075,.051),o.rotation.y=.55,i.add(o);let a=qe(ct.blob,.17,.17,.4);return a.position.y=7e-4,i.add(a),i.userData={water:e,spout:rn(.06,.14,0)},i}function k0(){let i=new dt;i.add(ne([[0,0],[.028,0],[.03,.006],[.03,.12],[.022,.15],[.011,.165],[.011,.19]],new ws({color:15255114,roughness:.08,transparent:!0,opacity:.72,clearcoat:1}),24));let t=ne([[0,.19],[.013,.19],[.013,.21],[0,.212]],fe(5216858,.5),16);return i.add(t),i.userData.spout=rn(0,.21,0),i}function B0(){let i=new dt,t=Lt(.085,.012,.066,ae.rouxTray,.004,1);t.position.y=.006,t.castShadow=!1,i.add(t),i.userData.blocks=[];for(let n=0;n<4;n++){let s=ac();s.position.set((n%2-.5)*.04,.018,(n<2?-.5:.5)*.03),i.add(s),i.userData.blocks.push(s)}let e=qe(ct.blob,.15,.13,.35);return e.position.y=7e-4,i.add(e),i}function r_(i){let t=he(512),e=t.getContext("2d");if(e.fillStyle=i===2?"#f7dc8a":"#f8f5ee",e.fillRect(0,0,512,512),e.translate(256,256),i===0&&(e.strokeStyle="#c9a24a",e.lineWidth=4,e.beginPath(),e.arc(0,0,236,0,6.3),e.stroke()),i===1){e.strokeStyle="#3f6fb0",e.lineWidth=7,e.beginPath(),e.arc(0,0,238,0,6.3),e.stroke(),e.lineWidth=3,e.beginPath(),e.arc(0,0,176,0,6.3),e.stroke();for(let n=0;n<24;n++){let s=n/24*6.283;e.save(),e.rotate(s),e.fillStyle="#4a7dc0",e.beginPath(),e.ellipse(207,0,15,7,.5,0,6.3),e.fill(),e.fillStyle="#7fa8dc",e.beginPath(),e.arc(207,16,4,0,6.3),e.fill(),e.restore()}}if(i===2)for(let n=0;n<12;n++){let s=n/12*6.283;e.save(),e.rotate(s),e.translate(208,0),e.rotate(Math.PI/2),n%2?(e.fillStyle="#fffaf0",e.beginPath(),e.arc(0,0,11,0,6.3),e.fill()):(e.fillStyle="#e2453c",e.beginPath(),e.moveTo(0,15),e.bezierCurveTo(-17,2,-12,-12,0,-9),e.bezierCurveTo(12,-12,17,2,0,15),e.fill(),e.fillStyle="#5fa046",e.beginPath(),e.ellipse(0,-10,9,4,0,0,6.3),e.fill()),e.restore()}return Ot(t,{srgb:!0})}var hc={};function qr(i=0){let t=new dt,e=.125,s=Ui(i===1?[[0,.006],[.07,.006],[.088,.011],[.105,.024],[.12,.028],[.124,.0265],[.12,.022],[.103,.016],[.086,.004],[.07,0],[.06,0],[.058,.003],[0,.003]]:[[0,.005],[.075,.005],[.09,.008],[.11,.016],[.123,.019],[.1255,.0175],[.122,.014],[.108,.0105],[.09,.003],[.075,0],[.062,0],[.06,.003],[0,.003]],64,{smooth:2}),r=s.attributes.position,o=s.attributes.uv;for(let h=0;h<r.count;h++)o.setXY(h,r.getX(h)/(e*2.02)+.5,r.getZ(h)/(e*2.02)+.5);hc[i]||(hc[i]=r_(i),hc[i].userData.keep=!0);let a=new ws({map:hc[i],roughness:.16,clearcoat:.9,clearcoatRoughness:.07}),l=new tt(s,a);l.castShadow=!0,l.receiveShadow=!0,t.add(l);let c=qe(ct.blob,.36,.36,.45);return c.position.y=6e-4,t.add(c),t.userData={kind:i,mat:a,mesh:l,R:e,top:i===1?.0065:.0055},t}var Xr=null;function o_(){if(Xr)return Xr;let i=Jn(256,{seed:404,baseX:9,baseY:9,oct:4}),t=he(256),e=t.getContext("2d"),n=de(8);e.fillStyle="#8a5418",e.fillRect(0,0,256,256),e.globalAlpha=.4,e.globalCompositeOperation="overlay",e.drawImage(i,0,0),e.globalCompositeOperation="source-over";for(let s=0;s<160;s++)e.globalAlpha=.25+n()*.3,e.fillStyle=n()<.5?"#c8801c":"#5a300c",e.beginPath(),e.arc(n()*256,n()*256,1+n()*3.5,0,6.3),e.fill();return e.globalAlpha=1,Xr=new ws({userData:{keep:!0},map:Ot(t,{srgb:!0,repeat:[1,1]}),roughness:.17,clearcoat:.85,clearcoatRoughness:.1,normalMap:Ot(Mi(i,1.6),{repeat:[1,1]}),normalScale:new xt(.55,.55),envMapIntensity:1}),Xr.map.userData.keep=!0,Xr.normalMap.userData.keep=!0,Xr}function mc(i,t,e=3){let n=new dt;n.position.y=i.userData.top,i.add(n);let s=de(e),r=oc(.058,.05,.066,360,e);r.position.set(-.036,0,0),n.add(r);let o=80,a=9,l=[],c=[],h=[],u=v=>.052*(.82+.26*vs(Math.cos(v)*1.3+5,Math.sin(v)*1.3+5,e+3)+.07*Math.sin(v*3+e)+.025*Math.sin(v*5+e*2));l.push(0,.0145,0),h.push(.5,.5);for(let v=1;v<=a;v++)for(let M=0;M<o;M++){let b=M/o*6.2832,w=v/a,y=u(b)*w;l.push(Math.cos(b)*y,.0145*Math.pow(1-w*w*w,.55)+4e-4+.0012*vs(Math.cos(b)*w*6+3,Math.sin(b)*w*6+3,e+9)*(1-w),Math.sin(b)*y*1.25),h.push(.5+Math.cos(b)*w*.5,.5+Math.sin(b)*w*.5)}for(let v=0;v<o;v++)c.push(0,1+(v+1)%o,1+v);for(let v=1;v<a;v++)for(let M=0;M<o;M++){let b=1+(v-1)*o+M,w=1+(v-1)*o+(M+1)%o,y=b+o,T=w+o;c.push(b,w,y,w,T,y)}let d=new un;d.setAttribute("position",new xe(l,3)),d.setAttribute("uv",new xe(h,2)),d.setIndex(c),d.computeVertexNormals();let f=new tt(d,o_());f.position.set(.034,0,.004),f.receiveShadow=!0,n.add(f);let p=[],x=new Ut(10118176),g=[];for(let v of t){let M=v==="corn"?5:t.length>4?1:2;for(let b=0;b<M;b++)g.push(v)}g.forEach((v,M)=>{let b=en[v],w=b.chunk(s);w.material=w.material.clone(),w.material.color.copy(w.material.color).multiply(b.cooked).lerp(x,.45),w.material.roughness=.3;let y=s()*6.283,T=Math.sqrt(s())*.034;w.position.set(.036+Math.cos(y)*T,.012+b.chunkR*.3,.004+Math.sin(y)*T*1.2),w.rotation.set(s()*3,s()*3,s()*3),w.scale.setScalar(.72),w.userData.at=(M+.5)/g.length,w.castShadow=!1,n.add(w),p.push(w)});let m={rice:0,curry:0,eaten:0},_=()=>{let v=1-m.eaten*.93,M=m.rice*v;r.visible=M>.02,r.scale.set(.45+.55*Math.pow(M,.5),Math.max(.001,M),.45+.55*Math.pow(M,.5));let b=m.curry*v;f.visible=b>.02;let w=Math.pow(b,.55);f.scale.set(w,.5+.5*b,w);for(let y of p)y.visible=m.curry>=y.userData.at*.98&&m.eaten<1-y.userData.at*.9};return n.userData={rice:r,curry:f,pieces:p,st:m,setRice(v){m.rice=re(v),_()},setCurry(v){m.curry=re(v),_()},setEaten(v){m.eaten=re(v),_()},steamAt:rn(0,.05,0)},_(),n}function z0(){let i=new dt,t=q.steelPolished,e=ne([[0,-.004],[.012,-.003],[.017,.001],[.018,.004],[.0165,.004],[.011,0],[0,-.0015]],t,20);e.scale.z=1.35,i.add(e);let n=Lt(.008,.0025,.12,t,.001,1);return n.position.set(0,.006,.08),n.rotation.x=-.06,i.add(n),i}function H0(){let i=new dt,t=fe(15987180,.35,{clearcoat:.6,clearcoatRoughness:.2});i.add(ne([[0,0],[.11,0],[.125,.01],[.132,.06],[.13,.15],[.126,.162],[.112,.164],[.108,.15],[.106,.05],[0,.05]],t,48,{smooth:2}));let e=ne([[.106,.16],[.1,.07],[0,.06]],q.aluminium,40);e.material=q.aluminium.clone(),e.material.side=Ce,i.add(e);let n=new dt;n.position.set(0,.162,-.125),i.add(n);let s=ne([[0,.035],[.08,.032],[.12,.016],[.13,0],[0,0]],t,48,{smooth:2});s.position.set(0,0,.125),n.add(s),n.rotation.x=-1.35;let r=Lt(.07,.03,.01,fe(3817285,.3),.004,1);r.position.set(0,.07,.131),i.add(r);let o=new tt(new yn(.004,12),new Ue({color:16751162}));o.position.set(.02,.07,.1365),i.add(o);let a=oc(.1,.03,.1,620,11);a.position.y=.118,i.add(a);let l=qe(ct.blob,.4,.4,.42);return l.position.y=7e-4,i.add(l),i.userData={rice:a,riceTop:rn(0,.15,0)},i}function G0(){let i=new dt,t=fe(16447730,.5),e=new tt(new Re(1,16,10),t);e.scale.set(.032,.004,.042),e.castShadow=!0,i.add(e);let n=Lt(.017,.007,.12,t,.003,1);n.position.set(0,0,.09),i.add(n);let s=oc(.026,.02,.03,70,9);return s.position.y=.002,s.visible=!1,i.add(s),i.userData.clump=s,i}function V0(){let i=new dt,t=Lt(.1,.028,.065,q.sponge,.008,2);t.position.y=.014,i.add(t);let e=Lt(.1,.01,.065,q.spongeGreen,.004,1);return e.position.y=.033,i.add(e),i}function W0(i=.2,t=.16){let e=new ce(i,t,10,8);e.rotateX(-Math.PI/2);let n=e.attributes.position.array.slice(),s=new tt(e,q.towel);return s.castShadow=!0,s.userData.update=(r,o=0,a=0)=>{let l=e.attributes.position;for(let c=0;c<l.count;c++){let h=n[c*3],u=n[c*3+2],d=Math.hypot(h,u)/(i*.6);l.setXYZ(c,h-o*d*d*.03,Math.sin(h*40+r*2)*.004*d+Math.cos(u*46)*.004-d*d*.02,u-a*d*d*.03)}l.needsUpdate=!0,e.computeVertexNormals()},s.userData.update(0),s}function X0(i){let t=i.userData.R,e=256,n=(f,p)=>{let x=he(e),g=x.getContext("2d");f(g);let m=Ot(x,{srgb:!0}),_=new yn(t*.985,48);_.rotateX(-Math.PI/2);let v=_.attributes.position;for(let b=0;b<v.count;b++){let w=Math.hypot(v.getX(b),v.getZ(b))/t;v.setY(b,w>.62?(w-.62)*.036:0)}let M=new tt(_,new ws({map:m,transparent:!0,depthWrite:!1,...p}));return M.userData={c:x,x:g,tex:m},M},s=de(17),r=n(f=>{for(let p=0;p<26;p++){let x=128+(s()-.3)*150,g=128+(s()-.5)*150,m=10+s()*26,_=f.createRadialGradient(x,g,0,x,g,m);_.addColorStop(0,"rgba(140,84,22,0.85)"),_.addColorStop(.7,"rgba(150,94,28,0.5)"),_.addColorStop(1,"rgba(150,94,28,0)"),f.fillStyle=_,f.beginPath(),f.ellipse(x,g,m*(1+s()),m,s()*3,0,6.3),f.fill()}for(let p=0;p<30;p++)f.fillStyle="rgba(252,250,244,0.9)",f.beginPath(),f.ellipse(60+s()*60,90+s()*80,3.2,1.6,s()*3,0,6.3),f.fill()},{roughness:.3}),o=n(()=>{},{roughness:.6,color:16777215}),a=n(f=>{for(let p=0;p<150;p++){let x=s()*256,g=s()*256,m=1.5+s()*4.5,_=f.createRadialGradient(x-m*.3,g-m*.3,0,x,g,m);_.addColorStop(0,"rgba(255,255,255,0.95)"),_.addColorStop(.5,"rgba(225,238,248,0.45)"),_.addColorStop(1,"rgba(200,220,240,0.0)"),f.fillStyle=_,f.beginPath(),f.arc(x,g,m,0,6.3),f.fill()}},{roughness:.02,clearcoat:1,envMapIntensity:2});r.position.y=i.userData.top+6e-4,o.position.y=i.userData.top+.0022,a.position.y=i.userData.top+.0012,r.renderOrder=4,a.renderOrder=5,o.renderOrder=6,i.add(r,a,o),a.visible=!1;let l=(f,p)=>[re(f/(t*.985)*.5+.5)*e,re(-p/(t*.985)*.5+.5)*e],c=(f,p,x,g)=>{let[m,_]=l(p,x),v=f.userData.x;v.save(),v.globalCompositeOperation="destination-out";let M=v.createRadialGradient(m,_,0,m,_,g);M.addColorStop(0,"rgba(0,0,0,0.5)"),M.addColorStop(1,"rgba(0,0,0,0)"),v.fillStyle=M,v.beginPath(),v.arc(m,_,g,0,6.3),v.fill(),v.restore(),f.userData.tex.needsUpdate=!0},h=(f,p)=>{let[x,g]=l(f,p),m=o.userData.x;for(let _=0;_<5;_++){let v=x+(Math.random()-.5)*44,M=g+(Math.random()-.5)*44,b=4+Math.random()*9,w=m.createRadialGradient(v-b*.3,M-b*.3,0,v,M,b);w.addColorStop(0,"rgba(255,255,255,0.95)"),w.addColorStop(.75,"rgba(240,246,252,0.8)"),w.addColorStop(1,"rgba(225,235,245,0)"),m.fillStyle=w,m.beginPath(),m.arc(v,M,b,0,6.3),m.fill()}o.userData.tex.needsUpdate=!0},u=(f=8)=>({n:f,cells:new Uint8Array(f*f),count:0,total:0,mark(p,x){let g=Math.floor((p/t*.5+.5)*f),m=Math.floor((x/t*.5+.5)*f);for(let[_,v]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){let M=g+_,b=m+v;if(M<0||b<0||M>=f||b>=f)continue;let w=b*f+M;this.cells[w]||(this.cells[w]=1,this.count++)}},get frac(){return this.count/this.total}});return{stains:r,foam:o,drops:a,erase:c,addFoam:h,mkGrid:()=>{let f=u();for(let p=0;p<f.n;p++)for(let x=0;x<f.n;x++){let g=(x+.5)/f.n*2-1,m=(p+.5)/f.n*2-1;Math.hypot(g,m)<.92?f.total++:f.cells[p*f.n+x]=2}return f},R:t}}function iu(){let i=new dt,t=new dt,e=Lt(.07,.16,.07,fe(16185336,.5),.004,1);e.position.y=.08,t.add(e);let n=Lt(.07,.03,.012,fe(8369120,.5),.003,1);n.position.y=.172,t.add(n);let s=Lt(.0715,.05,.0715,fe(8369120,.5),.004,1);s.position.y=.07,t.add(s),t.position.set(.22,0,-.1),i.add(t);for(let[r,o]of[[-.24,14245706],[-.15,15249980]]){let a=new dt;a.add(ne([[0,0],[.03,0],[.033,.01],[.033,.07],[.027,.078],[.027,.084]],new ws({color:o,roughness:.1,transparent:!0,opacity:.85,clearcoat:1}),20));let l=new tt(new Me(.029,.029,.012,20),fe(15921126,.4));l.position.y=.09,a.add(l),a.position.set(r,0,-.12),i.add(a)}return i.userData.decor=!0,i}function q0(){let i=new dt,t=fe(13197884,.95,{sheen:1,sheenRoughness:.4}),e=Rn([rn(-.045,0,0),rn(-.02,0,.008),rn(.02,0,.008),rn(.045,0,0)],.014,t,16,10);i.add(e);for(let s of[-1,1]){let r=new tt(new Re(.014,12,10),t);r.position.set(s*.045,0,0),i.add(r);let o=new tt(new Re(.005,8,6),fe(16773840,.9));o.position.set(s*.06,0,0),i.add(o)}let n=new tt(new hi(.0145,.003,6,16),fe(5941216,.7));n.rotation.y=Math.PI/2,i.add(n);for(let s of[-1,1]){let r=new tt(new Re(.0026,8,6),fe(2759702,.3));r.position.set(.022+s*.007,.006,.02),i.add(r)}return i}var Zo=["intro","apron","fridge","wash","cut","cook","roux","plate","eat","dishes","hanamaru"],js="fable-r14-curry-v1",it=(i,t,e)=>new I(i,t,e);function ru(){return{v:1,scene:"intro",picks:[],plate:0,friend:0,plays:0,stickers:[],photos:[],lastPhoto:null,seed:Math.random()*1e9|0,mute:!1,seen:{}}}var xc=null;function Z0(){let i=null;try{i=window.localStorage.getItem(js)}catch{i=null}if(!i)try{window.name&&window.name.indexOf(js+":")===0&&(i=window.name.slice(js.length+1))}catch{}!i&&xc&&(i=xc);let t=null;try{t=i?JSON.parse(i):null}catch{t=null}let e=ru();if(!t||typeof t!="object"||t.v!==1)return e;let n=Object.assign(e,t);return Zo.includes(n.scene)||(n.scene="intro"),Array.isArray(n.picks)||(n.picks=[]),Array.isArray(n.stickers)||(n.stickers=[]),Array.isArray(n.photos)||(n.photos=[]),n}function Vn(){let i=S.state,t;try{t=JSON.stringify(i)}catch{return!1}xc=t;let e=!1;try{window.localStorage.setItem(js,t),e=!0}catch{try{let s=JSON.stringify(Object.assign({},i,{photos:i.photos.slice(-2)}));window.localStorage.setItem(js,s),e=!0}catch{e=!1}}if(!e)try{window.name=js+":"+JSON.stringify(Object.assign({},i,{photos:[],lastPhoto:null}))}catch{}return S.storageOk=e,e}function ou(){try{window.localStorage.removeItem(js)}catch{}try{window.name=""}catch{}xc=null}var J0=["map","normalMap","roughnessMap","alphaMap","metalnessMap","emissiveMap","clearcoatNormalMap"];function $0(i){i.traverse(t=>{if(!t.isMesh&&!t.isPoints)return;let e=t.geometry;e&&!e.userData.keep&&e.dispose();for(let n of Array.isArray(t.material)?t.material:[t.material])if(!(!n||n.userData.keep)){for(let s of J0){let r=n[s];r&&!r.userData.keep&&r.dispose()}n.dispose()}})}function K0(...i){for(let t of i)if(t&&(t.userData.keep=!0,t.isMaterial))for(let e of J0)t[e]&&(t[e].userData.keep=!0)}var pe={objs:[],add(i,t=null){return(t||S.scene).add(i),this.objs.push(i),i},clear(){for(let i of this.objs)i.parent&&i.parent.remove(i),$0(i);this.objs.length=0}},j0={};function $n(i,t){j0[i]=t}var su=0;function yc(i,t=!0){let e=++su;S.scope&&S.scope.cancel(),S.input.clear(),S.hint.clear(),S.input.locked=!1;for(let n of S.permanentItems||[])S.input.add(n);(async()=>{let n=i,s=t;for(;e===su;){let r=new cc;S.scope=r,S.sceneName=n,S.sceneStep="enter",(S.stepLog=S.stepLog||[]).push(n+"/enter"),Zo.includes(n)&&(S.state.scene=n,Vn());let o;try{o=await j0[n]({scope:r,fresh:s})}catch(a){if(a===Vr)return;console.error(a);return}if(e!==su)return;r.end(),S.hint.clear(),n=o||"intro",s=!1}})()}function au(){S.state.scene="intro",S.state.picks=[],Vn(),Y0(!0).then(()=>{yc("intro",!0),Y0(!1)})}function Y0(i,t=350){let e=document.getElementById("fade");return e.style.transitionDuration=t+"ms",i?e.classList.remove("off"):e.classList.add("off"),new Promise(n=>setTimeout(n,t+30))}async function Es(i,t,e=.28){let n=document.getElementById("fade");n.style.transitionDuration=e*1e3/(S.timeScale||1)+"ms",n.classList.remove("off"),await i.wait(e+.03),t(),n.classList.add("off"),await i.wait(e*.6)}function jt(i){S.sceneStep=i,(S.stepLog=S.stepLog||[]).push(S.sceneName+"/"+i),S.stepLog.length>400&&S.stepLog.shift()}function z(){return S.audio}function Mn(i,t){let e=S.input.add(t);return i.onEnd(()=>S.input.remove(e)),e}function ii(i,t){let e=i.signal(),n=S.input.add({name:t.name,pos:t.pos,radius:t.radius||.06,minPx:t.minPx||44,grow:t.grow||1.4,priority:t.priority||0,zone:t.zone,onDown:s=>{S.input.remove(n),S.hint.clear(),e.fire(s)}});return i.onEnd(()=>S.input.remove(n)),t.hint!==!1&&S.hint.set(t.zone?t.hintPos||null:n,{hand:t.hint||"tap",delay:t.delay,radius:t.radius}),e.promise}function we(i,t,e,n=.5,s=.12,{rot:r=null,scale:o=null,ease:a=Xe.inOut,spin:l=0}={}){let c=t.position.clone(),h=t.rotation.clone(),u=t.scale.x;return i.tween(n,d=>{t.position.lerpVectors(c,e,d),t.position.y+=Math.sin(d*Math.PI)*s,r?t.rotation.set(Ht(h.x,r.x,d),Ht(h.y,r.y,d)+l*d,Ht(h.z,r.z,d)):l&&(t.rotation.y=h.y+l*d),o!==null&&t.scale.setScalar(Ht(u,o,d))},a)}function Ts(i,t,e=1,n=.35){let s=t.scale.x;return i.tween(n,r=>t.scale.setScalar(Ht(s,e,r)),Xe.back)}function kn(i,t=8,e=.08){S.fx.sparkleBurst(i,t,e)}var gn=(i,t=new I)=>i.getWorldPosition(t);function si({keepPot:i=!1}={}){pe.clear();let t=S.H,e=S.people;for(let s of[e.mama,e.papa,e.girl,...e.friends])s.root.visible=!1,s.stand(),s.restArms(),s.setFace("smile"),s.lookFront(),s.leanT.x=s.leanT.z=s.leanT.y=0,s.walking=0,s.bob=0,s.root.rotation.set(0,0,0),s.lying=!1,s.headSpeed=7;e.cat.root.visible=!1,e.cat.purr=0,e.cat.sleepy=0,e.cat.walk=0,S.blanket&&(S.blanket.visible=!1),t.fridgeDoor.rotation.y=0,t.fridgeLight.intensity=0,t.fridgeLamp.material.color.setRGB(.25,.25,.25),t.faucetLever.rotation.z=0,t.doorLeaf.rotation.y=0,S.stove.main.item.enabled=!1,S.stove.side.item.enabled=!1,S.stove.main.onGrab=S.stove.main.onRelease=null,i||(S.stove.main.reset(0),S.stove.side.reset(0),S.stove.main.hasPot=!1,S.pot.reset(),S.pot.group.visible=!1,S.pot.ladle.visible=!1,S.pot.lidState.visible=!1,S.pot.burner=null,S.pot.group.position.set(gt.burnerMain.x,Js,gt.burnerMain.z),S.pot.group.rotation.set(0,0,0));let n=S.audio;n&&(n.waterSet(0),n.pourSet(0),n.setHum(0)),S.rig.offset.set(0,0,0),lu()}var gc={};function lu(){let i=S.H.fridgeDoorFront;for(;i.children.length;){let n=i.children[0];i.remove(n),$0(n)}let t=S.state;gc[t.friend]||(gc[t.friend]=I0(t.friend),gc[t.friend].userData.keep=!0);let e=new tt(new ce(.27,.36),new He({map:gc[t.friend],roughness:.8}));e.position.set(-.165,.33,.001),i.add(e);for(let[n,s]of[[-.25,15227466],[-.08,4886504]]){let r=new tt(new Me(.011,.011,.006,16).rotateX(Math.PI/2),fe(s,.4));r.position.set(n,.5,.004),i.add(r)}S.calendar=e,t.stickers.slice(-40).forEach((n,s)=>{let r=L0(1+(n.seed||s),.115);r.position.set(n.x,n.y,.0012+s*12e-5),r.rotation.z=n.rot||0,i.add(r)}),t.photos.slice(-6).forEach((n,s)=>{let r=D0(n,.105),o=s%2,a=s/2|0;r.position.set(.1+o*.125,.42-a*.15,.002+s*2e-4),r.rotation.z=(s*37%11-5)*.012,i.add(r)})}function Q0(i){let t=i%4,e=(i/4|0)%4;return{x:-.24+t*.155+(i*7%5-2)*.006,y:.04-e*.15+(i*3%5-2)*.005}}function tf(){try{S.renderer.render(S.scene,S.camera);let i=S.renderer.domElement,t=240,e=220,n=document.createElement("canvas");n.width=t,n.height=e;let s=Math.min(i.width,i.height)*.86,r=(i.width-s*(t/e))/2,o=(i.height-s)/2;return n.getContext("2d").drawImage(i,r,o,s*(t/e),s,0,0,t,e),n.toDataURL("image/jpeg",.72)}catch{return null}}var Yr=gt.counterY;function nf(){let i=new tt(new Re(1,28,16),q.blanket);i.scale.set(.66,.25,.34),i.position.set(gt.sofa.x+.34,.63,gt.sofa.z-.05),i.castShadow=!0,i.visible=!1,S.scene.add(i),S.blanket=i;let t=S.people.girl,e=dc(.2,.3);e.position.set(0,t.dim.shY-.015,.088),e.rotation.x=.06,e.visible=!1,t.body.add(e),S.girlApron=e,e.userData.update(0,0)}function es(i="sleepy"){let t=S.people.mama;t.root.visible=!0,t.lying=!0,t.shadow.visible=!1,t.root.rotation.set(0,Math.PI,-Math.PI/2),t.root.position.set(gt.sofa.x+.97,.485+.17,gt.sofa.z-.06),t.setFace(i),t.headT.roll=0,S.blanket.visible=!0;for(let e of Object.values(t.arms))e.thumbDir=new I(-1,0,0);t.hand("R",.12,t.dim.shY-.2,.1),t.hand("L",-.1,t.dim.shY-.25,.14)}function Jo(i=!0){let t=S.people.mama,e=t.dim;i?(t.hand("L",-(e.shW+.3),e.shY-.12,.2,9),t.arms.L.thumb=1,t.setFace("smile")):(t.hand("L",-.1,e.shY-.25,.14),t.arms.L.thumb=0,t.setFace("sleepy"))}function Oi(i,t,e=Math.PI){let n=S.people.papa;n.root.visible=!0,n.place(i,0,t,e);for(let s of Object.values(n.arms))s.thumbDir=null;return n}function di(){let i=S.people.cat;i.root.visible=!0,i.root.position.set(gt.sofa.x+.5,.485,gt.sofa.z-.02),i.root.rotation.y=Math.PI*.8,i.setPose("loaf"),i.headYawT=0}async function $o(i,t=1.1){let e=S.people.papa;e.thumbs("R",!0),e.setFace("happy"),z()&&z().hmm(!0),await i.wait(t),e.thumbs("R",!1),e.setFace("smile")}$n("intro",async({scope:i})=>{si();let t=S.people,e=S.H;S.rig.jump("home"),t.girl.root.visible=!0,t.girl.place(-1.15,0,1.45,-2.45),S.girlApron.visible=!1,t.girl.headT.yaw=.25,t.girl.headT.pitch=-.3;let n=pe.add(dc());n.position.set(gt.hook.x,gt.hook.y+.012,.058),i.every((c,h)=>n.userData.update(c,h)),es("smile"),S.blanket.visible=!1;let s=t.mama;s.lying=!1,s.shadow.visible=!0,s.place(gt.sofa.x+.25,0,gt.sofa.z-.85,Math.PI);for(let c of Object.values(s.arms))c.thumbDir=null;s.restArms(),s.setFace("smile"),di(),jt("wait-start"),await ii(i,{name:"start",zone:!0,hintPos:()=>gn(S.calendar),radius:.16,hint:"tap",delay:2.5}),z()&&z().jingle("soft");let r=S.state,o=de(r.seed+r.plays*7919);r.friend=(r.plays+(o()*3|0))%3,r.picks=[],r.gag={cat:o()<.5?0:1,dance:o()*3|0,tummy:o()<.5},Vn(),jt("calendar"),await S.rig.move(i,"calendar",1.3),z()&&z().doorbell(),await i.tween(.9,c=>{S.calendar.scale.setScalar(1+Math.sin(c*Math.PI*3)*.035)});let a=e.clockMin.rotation.z,l=e.clockHour.rotation.z;return ve(i.tween(1.6,c=>{e.clockMin.rotation.z=a-c*Math.PI*4,e.clockHour.rotation.z=l-c*Math.PI/3,z()&&Math.random()<.2&&z().tap(.25)})),await S.rig.move(i,{pos:[-1.62,1.75,1.7],look:[gt.hook.x,2,0],fov:30},.9),await i.wait(.9),jt("mama"),await S.rig.move(i,"sofa",1.5),s.setFace("sneeze"),s.leanT.x=-.18,s.hand("R",.05,s.dim.shY+.1,.2),await i.wait(.35),z()&&z().sneeze(),await i.wait(.36),s.leanT.x=.3,s.leanT.y=-.02,await i.wait(.45),s.leanT.x=0,s.leanT.y=0,s.setFace("small"),await i.wait(.7),s.setFace("yawn"),s.hand("R",.02,s.dim.shY+.13,.17),s.headT.pitch=-.25,z()&&z().yawn(),await i.wait(1.5),s.headT.pitch=0,s.restArms(),s.setFace("sleepy"),await i.wait(.4),await Es(i,()=>{es("sleepy")}),await i.wait(.9),Jo(!0),await i.wait(1.1),Jo(!1),"apron"});$n("apron",async({scope:i,fresh:t})=>{si();let e=S.people;es("sleepy"),di();let n=e.girl;n.root.visible=!0,n.place(-1.15,0,1.45,-2.45),S.girlApron.visible=!1,n.headT.yaw=-.35,n.headT.pitch=-.3;let s=pe.add(dc()),r=it(gt.hook.x,gt.hook.y+.012,.058);s.position.copy(r);let o=s.userData;i.every((x,g)=>o.update(x,g)),t?S.rig.jump("apron"):await S.rig.move(i,"apron",1.4),jt("apron");let a=()=>it(s.position.x,s.position.y-.2,s.position.z),l=i.signal(),c=!1,h=!1,u=Mn(i,{name:"apron",pos:a,radius:.2,grow:1.2,onDown:()=>{c=!0,o.swingV+=2.2,o.wave=1,z()&&z().cloth(.7)},onMove:x=>{if(h)return;let g=S.input.planePointZ(.3);g&&(o.swingV+=re(x.dx*.06,-3,3),o.wave=1,s.position.x=Jt(s.position.x,re(g.x,-1.75,-.9),.6,1),s.position.y=Jt(s.position.y,re(g.y+.2,1,1.75),.6,1),s.position.z=Jt(s.position.z,.3,.4,1))},onUp:()=>{c&&!h&&(h=!0,u.enabled=!1,l.fire())}});S.hint.set(u,{hand:"tap",delay:3}),await l.promise,S.hint.clear(),jt("wear"),z()&&z().swish(.6,900);let d=n.root.position.clone().add(it(0,n.dim.shY+.02,-.12));o.swingV+=3,o.wave=1.2,await we(i,s,d,.75,.22,{scale:.68}),s.visible=!1,S.girlApron.visible=!0,S.girlApron.userData.wave=1,z()&&(z().cloth(.8),z().pop(.6)),i.every((x,g)=>S.girlApron.userData.update(x,g));let f=n.root.rotation.y;await i.tween(.6,x=>{n.root.rotation.y=Ht(f,.15,x)}),n.lookFront(),n.setFace("happy"),n.hand("L",-.2,n.dim.shY+.24,.05,12),n.hand("R",.2,n.dim.shY+.24,.05,12),S.girlApron.userData.swingV+=2,z()&&(z().jingle("ok"),z().wow(1.3)),kn(n.root.position.clone().add(it(0,1,.1)),10,.25);for(let x=0;x<3;x++)n.leanT.y=.05,await i.wait(.16),n.leanT.y=0,await i.wait(.16);let p=Oi(.2,1.75,-Math.PI/2);return ve(Hr(i,p,-.62,1.7,1.3,-1.1)),await i.wait(1.4),n.restArms(),n.setFace("smile"),await $o(i,1),"fridge"});var a_={corn:[-.15,2,.34],broccoli:[.13,2,.33],meat:[-.12,1,.33],sausage:[.15,1,.36],carrot:[-.17,0,.37],potato:[.03,0,.36],onion:[.21,0,.35]},sf={corn:.026,broccoli:0,meat:0,sausage:0,carrot:.02,potato:.03,onion:.035};$n("fridge",async({scope:i,fresh:t})=>{si();let e=S.people,n=S.H,s=S.state;es("sleepy"),di(),S.girlApron.visible=!0,Oi(-.62,1.7,-1.1),s.picks=[],Vn();let r=pe.add(N0());r.position.set(-1.12,Yr,.46);let o=gt.fridge,a={};pe.add(iu(),n.fridge).position.set(0,n.fridgeShelves[2],.36);let c=pe.add(iu(),n.fridge);c.position.set(.04,n.fridgeShelves[1],.38),c.children[1].visible=!1,c.children[2].visible=!1;for(let m of Ks){let _=en[m].whole(),[v,M,b]=a_[m];_.position.set(v,n.fridgeShelves[M]+sf[m]+.004,b),m==="carrot"&&(_.rotation.y=.5),m==="corn"&&(_.rotation.y=-.25),pe.add(_,n.fridge),a[m]=_}t?S.rig.jump("fridge"):await S.rig.move(i,"fridge",1.5),jt("door"),await ii(i,{name:"fridge-door",pos:()=>gn(n.fridgeDoorFront).add(it(.24,-.1,.05)),radius:.3,hint:"tap",delay:2.5}),z()&&(z().fridgeOpen(),z().setHum(1)),n.fridgeLamp.material.color.setRGB(3,3.3,3.6),await i.tween(.8,m=>{n.fridgeDoor.rotation.y=-2*m,n.fridgeLight.intensity=1.6*m},Xe.out);for(let m=0;m<5;m++)S.fx.steam.emit({x:o.x+(Math.random()-.5)*.4,y:.75+Math.random()*.2,z:.7,vx:0,vy:-.05,vz:.08,life:1.6,s0:.1,s1:.35,alpha:.1,drag:.5});jt("pick");let u=[],d=i.signal(),f=0,p={},x=Mn(i,{name:"basket",pos:()=>r.position.clone().add(it(0,.1,0)),radius:.17,enabled:!1,onDown:()=>{u.length&&!f&&d.fire()}}),g=()=>{let m=Ks.filter(_=>!u.includes(_));m.length&&(u.length>=3?S.hint.set(x,{hand:"tap",delay:5}):S.hint.set(p[m[0]],{hand:"tap",delay:u.length?4:2.5}))};for(let m of Ks)p[m]=Mn(i,{name:"ing-"+m,pos:()=>gn(a[m]).add(it(0,.02,0)),radius:.075,minPx:48,onDown:()=>{p[m].enabled=!1,u.push(m),s.picks=u.slice(),Vn(),f++;let _=a[m];S.scene.attach(_),z()&&z().pick();let v=u.length-1,M=v*2.4,b=v===0?0:.07,w=r.position.clone().add(it(Math.cos(M)*b,.05+v*.012,Math.sin(M)*b));ve(we(i,_,w,.6,.28,{spin:2.5}).then(()=>{f--,z()&&(z().beep(),z().thunk(.8,.5)),r.scale.setScalar(1.06),ve(Ts(i,r,1,.3)),x.enabled=!0,u.length===Ks.length&&d.fire()})),pe.objs.push(_),g()}});g(),await d.promise,S.hint.clear();for(let m of Ks)p[m].enabled=!1;return x.enabled=!1,jt("close"),z()&&z().jingle("ok"),kn(r.position.clone().add(it(0,.2,0)),8,.2),await i.wait(.4),await i.tween(.6,m=>{n.fridgeDoor.rotation.y=-2*(1-m),n.fridgeLight.intensity=1.6*(1-m)},Xe.in),z()&&(z().fridgeClose(),z().setHum(0)),n.fridgeLamp.material.color.setRGB(.25,.25,.25),await i.wait(.3),"wash"});var ef=new Ut(9337438),l_=new Ut(16777215);$n("wash",async({scope:i,fresh:t})=>{si();let e=S.H,n=S.state;es("sleepy"),di(),Oi(-.2,1.2,Math.PI*.95);let s=n.picks.filter(N=>en[N].wash);if(!s.length)return"cut";let r=gt.sink,o=Yr-r.depth+.004,a=pe.add(fc(.15,.085,q.steelPolished));a.position.set(r.x,o,r.z+.015);let l=.15,c=.085,h=new tt(new yn(1,40),pc(.3));h.rotation.x=-Math.PI/2,h.visible=!1,h.renderOrder=5,a.add(h);let u=new tt(new Me(l+.003,l*.62,c,40,1,!0),pc(.2));u.position.y=c/2,u.visible=!1,u.renderOrder=6,a.add(u);let d=pe.add(bs(.0065)),f=de(n.seed+5),p=s.map((N,B)=>{let G=en[N].whole(),E=B/s.length*6.283+.4,U=s.length===1?0:.06;G.position.set(Math.cos(E)*U,.03,Math.sin(E)*U),G.rotation.y=f()*3,a.add(G);let C=G.userData.skin||[];for(let P of C)P.color.copy(ef),P.roughness=.95;return{k:N,w:G,skins:C,clean:0,done:!1,x:G.position.x,z:G.position.z,roll:0,vx:0,vz:0,rad:G.userData.rad||.03}});t?S.rig.jump("sink"):await S.rig.move(i,"sink",1.5),jt("tap-on");let x=()=>gn(e.faucetLever).add(it(.03,.02,.02));await ii(i,{name:"faucet",pos:x,radius:.07,minPx:54,hint:"tap",delay:2.5}),z()&&z().tap(.8);let g=1,m=0,_=0,v=0,M=0;ve(i.tween(.25,N=>{e.faucetLever.rotation.z=.5*N}));let b=e.spout.clone(),w=it();i.every((N,B)=>{M=B,_=Jt(_,g,8,N),z()&&z().waterSet(_),m=re(m+_*N*.36-(g?0:N*.02));let G=.006+m*(c-.008),E=l*Ht(.5,.985,Math.pow(m,.6));h.visible=m>.02,h.position.y=G,h.scale.setScalar(E),h.material.normalMap.offset.set(B*.07,B*.05),h.material.color.setRGB(Ht(.74,.62,v),Ht(.9,.52,v),Ht(1,.36,v)),h.material.opacity=.4+v*.3,v=Math.max(0,v-N*(.12+_*.25));let U=m>=.999&&_>.3;if(u.visible=U,U&&(u.material.normalMap.offset.y=-B*1.4,Math.random()<N*22)){let C=Math.random()*6.28;S.fx.splash(a.position.x+Math.cos(C)*l*.7,o+.004,a.position.z+Math.sin(C)*l*.7,2,.5)}w.set(a.position.x,a.position.y+Math.max(G,.012),b.z),d.userData.set(b,w,_,B),_>.3&&Math.random()<N*26&&S.fx.splash(w.x,w.y,w.z,2,.45);for(let C of p){let P=Math.max(C.rad*.8+.006,G-C.rad*.25+Math.sin(B*2+C.x*30)*.002*m);C.w.position.y=Jt(C.w.position.y,P,6,N),C.x+=C.vx*N,C.z+=C.vz*N,C.vx*=Math.exp(-4*N),C.vz*=Math.exp(-4*N);let X=Math.hypot(C.x,C.z),D=Math.max(.01,E-C.rad*1.1);X>D&&(C.x*=D/X,C.z*=D/X);for(let W of p)if(W!==C){let K=W.x-C.x,ut=W.z-C.z,Pt=Math.hypot(K,ut),Z=(W.rad+C.rad)*1.25;if(Pt<Z&&Pt>1e-4){let ft=(Z-Pt)/Pt*.25;C.x-=K*ft,C.z-=ut*ft}}C.w.position.x=C.x,C.w.position.z=C.z}}),await i.until(()=>m>.5),jt("rub");let y=i.signal(),T=0,F=Mn(i,{name:"rub",zone:!0,pos:()=>a.position.clone().add(it(0,.06,0)),radius:.15,onMove:N=>{let B=S.input.planePoint(a.position.y+.06);if(!B)return;let G=B.x-a.position.x,E=B.z-a.position.z,U=null,C=.24;for(let D of p){let W=Math.hypot(D.x-G,D.z-E)+(D.done?.08:0);W<C&&(C=W,U=D)}if(!U)return;let P=U,X=Math.hypot(N.dx,N.dy);if(P.w.rotation.x+=N.dy*.03,P.w.rotation.z-=N.dx*.02,P.vx+=N.dx*.0016,P.vz+=N.dy*.0016,M-T>.09&&X>2&&(T=M,z()&&z().scrub(.5),Math.random()<.5&&S.fx.splash(a.position.x+P.x,a.position.y+.07,a.position.z+P.z,1,.35)),!P.done){P.clean=re(P.clean+X/(S.input.canvas.clientHeight*.75)),v=Math.min(1,v+X/900);for(let D of P.skins)D.color.copy(ef).lerp(l_,P.clean),D.roughness=Ht(.95,.42,P.clean),"clearcoat"in D&&(D.clearcoat=P.clean*.7);P.clean>=1&&(P.done=!0,z()&&z().chime(.6),kn(gn(P.w),7,.07),p.every(D=>D.done)?y.fire():S.hint.set(()=>gn(p.find(D=>!D.done).w),{hand:"circle",delay:3,radius:.05}))}}});S.hint.set(()=>gn(p.find(N=>!N.done).w),{hand:"circle",delay:2.5,radius:.05}),await y.promise,F.enabled=!1,S.hint.clear(),jt("tap-off"),z()&&z().jingle("ok");let O=ii(i,{name:"faucet",pos:x,radius:.07,minPx:54,hint:"tap",delay:1.5});return await Promise.race([O,i.wait(7)]),g=0,z()&&z().tap(.8),await i.tween(.25,N=>{e.faucetLever.rotation.z=.5*(1-N)}),await i.wait(.7),"cut"});function c_(i,t,e){let n=i%3,s=i/3|0,r=t*2.39996,o=.012+.03*Math.sqrt(t/Math.max(1,e));return it(.03+n*.062+Math.cos(r)*o*.75,.03+t*7%3*.006,-.085+s*.064+Math.sin(r)*o*.75)}$n("cut",async({scope:i,fresh:t})=>{si();let e=S.state,n=S.people;es("sleepy"),di();let s=Oi(.5,1.02,Math.PI*1.08),r=pe.add(F0());r.position.set(-.02,Yr,.4);let o=pe.add(U0());o.position.set(-.15,Yr+.022,.38);let a=o.userData,l=de(e.seed+11),c=e.picks.length?e.picks:["carrot","potato","onion"],h=c.map((v,M)=>{let b=pe.add(en[v].whole());return b.position.set(-.4+M*.105,Yr+(sf[v]||0)+.004,.16+M%2*.03),b.rotation.y=.3+M,b});t?S.rig.jump("board"):await S.rig.move(i,"board",1.5);let u=()=>gn(a.knob);s.lookAt(it(-.15,Yr,.4));let d=[];for(let v=0;v<c.length;v++){let M=c[v],b=en[M],w=h[v];jt("cut-"+M);let y=async(C,P,X,D)=>{C.position.copy(D),pe.add(C,r),d.push({mesh:C,k:M});let W=c_(v,P,X);await i.wait(P*.035),await we(i,C,W,.32+l()*.1,.06,{spin:3,ease:Xe.in}),C.rotation.set(l()*3,l()*3,l()*3),z()&&P%2===0&&z().thunk(b.pitch*(.9+l()*.2),.4)};if(b.precut){await we(i,w,r.position.clone().add(it(-.13,.1,.02)),.5,.1),await ii(i,{name:"meat-tray",pos:()=>gn(w),radius:.08,hint:"tap",delay:2.5}),z()&&z().swish(.5,2500),w.userData.film.visible=!1;let C=w.userData.pieces.map(P=>{let X=gn(P);return r.worldToLocal(X),X});for(let P of w.userData.pieces)P.visible=!1;await Promise.all(C.map((P,X)=>y(b.chunk(l),X,C.length,P))),ve(we(i,w,w.position.clone().add(it(-.5,0,-.1)),.5,.05).then(()=>{w.visible=!1}));continue}z()&&z().pick(.5),await we(i,w,o.position.clone().add(it(0,.125,0)),.45,.12,{rot:new on(0,.3,0)}),s.handWorld("L",u().add(it(.035,.03,.01)),8);let T=0,F=!1,O=i.signal(),N=C=>{a.lever.rotation.x=Ht(a.open,a.closed,C),s.handWorld("L",u().add(it(.035,.03,.01)),30),w.scale.y=1-Math.max(0,C-.55)*1.2},B=()=>{F||(F=!0,G.enabled=!1,O.fire())},G=Mn(i,{name:"lever",pos:u,radius:.07,minPx:56,grow:1.6,onMove:C=>{F||(T=re(T+C.dy/(S.input.canvas.clientHeight*.17)),N(T),T>=.92&&B())},onUp:C=>{F||(C.moved<14||T>.45?ve(i.tween(.16,P=>N(Ht(T,1,P)),Xe.in).then(B)):ve(i.tween(.2,P=>N(T*(1-P))).then(()=>{T=0})))}});S.hint.set(G,{hand:"drag",to:()=>u().add(it(0,-.11,.05)),delay:v===0?2.2:4}),await O.promise,S.hint.clear(),S.input.remove(G),N(1),z()&&z().chop(b.pitch),w.visible=!1;let E=it(-.13,.05,-.02),U=b.count;ve(i.tween(.3,C=>N(1-C),Xe.out).then(()=>{a.lever.rotation.x=a.open})),await Promise.all(Array.from({length:U},(C,P)=>y(b.chunk(l),P,U,E.clone().add(it(l()*.03,0,l()*.03))))),await i.wait(.15)}s.restArms(),z()&&z().jingle("ok"),kn(r.position.clone().add(it(.09,.08,0)),8,.15),await i.wait(.5),jt("cat-gag");let f=n.cat,p=c.includes("sausage"),x=pe.add(q0(),f.mouthAnchor);x.rotation.y=Math.PI/2,x.position.set(0,-.005,.01),f.root.position.set(1.9,0,1.55),f.root.rotation.y=-Math.PI/2,f.setPose("stand"),await S.rig.move(i,"boardCat",1.2);let g=f.walkTo(i,-.15,1.55,.8);await i.wait(.9),s.lookAt(f.root.position.clone().add(it(-.5,.2,0))),s.setFace("wow"),s.hand("R",.24,s.dim.shY+.02,.2,14),z()&&z().wow(.75),i.every(()=>{s.faceName==="wow"&&s.lookAt(f.root.position.clone().add(it(0,.2,0)))}),await i.wait(1),s.setFace("small"),s.lookAt(r.position.clone().add(it(.1,.05,0))),s.restArms();let m=d.filter(v=>p?v.k==="sausage":!0).slice(0,8);kn(gn(m[0].mesh),9,.08),z()&&z().chime(.7),await g,f.setPose("sit"),f.headYawT=.7,await i.wait(.35),S.scene.attach(x),pe.objs.push(x);let _=f.root.position.clone().add(it(-.16,.016,.08));return await we(i,x,_,.3,.04,{ease:Xe.in}),z()&&(z().squeak(1),z().thunk(1.4,.2)),await i.tween(.25,v=>{x.position.y=_.y+Math.sin(v*Math.PI)*.04}),z()&&z().squeak(.8),await i.wait(.3),z()&&z().meow(1.1),f.headPitchT=-.25,s.lookAt(f.root.position.clone().add(it(0,.2,0))),s.setFace("happy"),z()&&z().giggle(.7),s.leanT.y=.02,await i.wait(.2),s.leanT.y=0,await i.wait(.9),f.headPitchT=0,s.setFace("smile"),s.lookFront(),"cook"});var dn=gt.counterY,bn=it(gt.burnerMain.x,Js,gt.burnerMain.z),Ko=it(.39,dn,.45),cu=it(.37,dn,.2),_c=it(.2,dn,.27);function rf(i,t,e=!0){let n=S.pot;for(let s of i){let r=en[s];for(let o=0;o<r.count;o++){let a=n.addChunk(r.chunk(t),s,r.chunkR,r.floatK,r.cooked);a.y=.04,a.landed=e}}}function h_(i){let t=S.stove.main,e=0;t.onGrab=()=>{e=1.3},t.onRelease=()=>{e=1.3},i.every(n=>{t.grab?e=1.3:e-=n;let s=e>0?1:0,r=S.rig.offset;r.y=Jt(r.y,-.42*s,4.5,n),r.z=Jt(r.z,.1*s,4.5,n)}),i.onEnd(()=>{t.onGrab=t.onRelease=null,S.rig.offset.set(0,0,0)})}function u_(i){let t=S.pot;return Mn(i,{name:"stir",zone:!0,pos:()=>t.group.position.clone().add(it(0,ue.h,0)),radius:.1,enabled:!1,onDown:()=>e(),onMove:()=>e(),onUp:()=>t.ladleRelease()});function e(){let n=S.input.planePoint(t.group.position.y+t.surfY);n&&t.ladleTo((n.x-t.group.position.x)/ue.rIn,(n.z-t.group.position.z)/ue.rIn)}}async function of({scope:i,fresh:t},e){si();let n=S.state,s=S.people,r=S.pot,o=S.stove.main,a=S.stove.side;es("sleepy"),di();let l=Oi(1.1,.84,Math.PI*.88);l.lookAt(bn);let c=n.picks.length?n.picks:["carrot","potato","onion"],h=de(n.seed+21);r.group.visible=!0,o.item.enabled=!0,a.item.enabled=!0,r.onPop=(E,U)=>{z()&&z().blup(E,U)},r.setLidRest(it(cu.x,dn+.004,cu.z)),h_(i);let u=u_(i),d=()=>l.handWorld("L",it(1,dn+.045,.6),6);d(),i.every((E,U)=>{a.lit&&Math.random()<E*3*a.heat&&S.fx.puff(S.stove.kettle.position.x+.1,S.stove.kettle.position.y+.12,S.stove.kettle.position.z-.08,1,.1,.12)});let f=(E=.3)=>i.every((U,C)=>{o.heat<E&&!o.grab?S.hint.target!==o.item&&S.hint.set(o.item,{hand:"turn",delay:2.5}):S.hint.target===o.item&&S.hint.clear()});if(e){r.group.position.copy(bn),r.burner=o,o.hasPot=!0,rf(c,h),r.setWater(),r.ladle.visible=!0,u.enabled=!0,t?S.rig.jump("stove"):await S.rig.move(i,"stove",1.6),jt("reheat");let E=f(.3);await i.until(()=>r.s.boil>.3),E(),S.hint.clear()}else{r.group.position.copy(Ko);let E=pe.add(fc(.1,.07));E.position.copy(cu);let U=[];for(let Xt of c){let qt=en[Xt];for(let Pe=0;Pe<qt.count;Pe++){let Ie=qt.chunk(h),Ye=h()*6.283,Fe=Math.sqrt(h())*.06;Ie.position.set(Math.cos(Ye)*Fe,.016+h()*.04+(.06-Fe)*.3,Math.sin(Ye)*Fe),Ie.rotation.set(h()*3,h()*3,h()*3),E.add(Ie),U.push({m:Ie,k:Xt,d:qt})}}t?S.rig.jump("stove"):await S.rig.move(i,"stove",1.6),jt("pot"),await ii(i,{name:"pot",pos:()=>r.group.position.clone().add(it(0,.06,0)),radius:.13,hint:"drag",to:()=>bn.clone().add(it(0,.06,0)),delay:2.2}),z()&&z().pick(.5),await we(i,r.group,bn,.7,.13),z()&&z().clack(.9),r.burner=o,o.hasPot=!0,await i.tween(.18,Xt=>{r.group.position.y=bn.y+Math.sin(Xt*Math.PI)*.004}),jt("ignite"),S.hint.set(o.item,{hand:"turn",delay:2.2}),await i.until(()=>o.lit&&o.heat>.15),S.hint.clear(),await i.wait(.9),ve($o(i,.9).then(d)),jt("oil");let C=pe.add(k0());C.position.set(1.25,dn+.2,.55);let P=pe.add(bs(.0022));P.material=P.material.clone(),P.material.color.set(15253568),P.material.opacity=.8;let X=i.every(()=>l.handWorld("R",C.position.clone().add(it(.02,.07,.03)),30));l.leanT.x=.22,await we(i,C,bn.clone().add(it(.17,.2,.03)),.7,.05),await i.tween(.3,Xt=>{C.rotation.z=1.75*Xt}),await i.tween(.9,Xt=>{let qt=gn(C).add(it(-.19,-.02,0));P.userData.set(qt,it(qt.x,bn.y+ue.floor,qt.z),Math.sin(Xt*Math.PI),S.time),r.s.oil=Math.max(r.s.oil,Xt)}),P.visible=!1,await i.tween(.25,Xt=>{C.rotation.z=1.75*(1-Xt)}),await we(i,C,it(1.3,dn+.2,.6),.5,.03),X(),C.visible=!1,l.leanT.x=0,l.restArms(),d(),jt("veg"),await ii(i,{name:"bowl",pos:()=>E.position.clone().add(it(0,.05,0)),radius:.11,hint:"drag",to:()=>bn.clone().add(it(0,.1,0)),delay:2.5}),z()&&z().pick(.5),await we(i,E,bn.clone().add(it(-.2,.19,-.01)),.6,.06),await i.tween(.35,Xt=>{E.rotation.z=-1.25*Xt});for(let Xt=0;Xt<U.length;Xt++){let qt=U[Xt],Pe=r.addChunk(qt.m,qt.k,qt.d.chunkR,qt.d.floatK,qt.d.cooked);Pe.x=-.5+h()*.6,Pe.z=(h()-.5)*.9,Pe.y=ue.h+.05+h()*.03,Pe.vx=.5+h(),Pe.vy=-.2,await i.wait(U.length>30?.03:.05)}await i.wait(.3),await i.tween(.3,Xt=>{E.rotation.z=-1.25*(1-Xt)}),ve(we(i,E,it(.1,dn,.2),.6,.1).then(()=>{E.visible=!1})),jt("saute"),r.ladle.visible=!0,u.enabled=!0,S.hint.set(u,{hand:"circle",delay:2.5,circleR:.8});let D=f(.25),W=0,K=i.every(Xt=>{W+=Xt*(o.heat>.2?1:.15)});await i.until(()=>r.s.saute>.7||W>16),r.s.saute=Math.max(r.s.saute,.7),K(),D(),S.hint.clear(),z()&&z().chime(.5),jt("water");let ut=pe.add(O0());ut.position.set(.1,dn,.4),ut.scale.setScalar(.01),ve(Ts(i,ut,1,.3)),await we(i,ut,Ko.clone(),.5,.08),z()&&z().thunk(1.3,.4);let Pt=pe.add(bs(.006)),Z=!1,ft=0,Rt=0,Gt=bn.clone().add(it(-.215,.165,.04)),wt=Mn(i,{name:"jug",pos:()=>Ko.clone().add(it(0,.08,0)),radius:.12,minPx:56,onDown:()=>{Z=!0,ft=S.time+1.3},onUp:()=>{Z=!1}});S.hint.set(wt,{hand:"tap",delay:2.2});let $t=i.every((Xt,qt)=>{let Pe=(Z||S.time<ft)&&r.s.level<1?1:0;Rt=Jt(Rt,Pe,7,Xt),ut.position.lerpVectors(Ko,Gt,Rt),ut.position.y+=Math.sin(Rt*Math.PI)*.04,ut.rotation.z=-1.2*Rt;let Ie=Rt>.85&&Pe?1:0,Ye=ut.localToWorld(ut.userData.spout.clone());Pt.userData.set(Ye,it(Ye.x+.035,bn.y+r.surfY,Ye.z),Ie,qt),Ie&&(r.pour(.36,Xt,(Ye.x+.035-bn.x)/ue.rIn,(Ye.z-bn.z)/ue.rIn),ut.userData.water.scale.y=Math.max(.05,1-r.s.level*.95),ut.userData.water.position.y=.012+.05*ut.userData.water.scale.y),z()&&z().pourSet(Ie)});await i.until(()=>r.s.level>=1),S.hint.clear(),wt.enabled=!1,Z=!1,ft=0,await i.wait(.5),$t(),z()&&z().pourSet(0),Pt.visible=!1,ve(we(i,ut,it(.1,dn,.2),.6,.08).then(()=>{ut.visible=!1})),jt("boil"),S.hint.set(u,{hand:"circle",delay:5,circleR:.8});let Te=f(.3),Mt=0,be=i.every(Xt=>{Mt+=Xt});await i.until(()=>r.s.boil>.42||Mt>22),Te(),be(),S.hint.clear(),r.s.boil<.3&&(o.setValue(Math.max(o.value,.6)),await i.until(()=>r.s.boil>.4)),n.scene="roux",Vn()}jt("roux");let p=pe.add(B0());p.position.set(.1,dn,.4),p.scale.setScalar(.01),ve(Ts(i,p,1,.3)),await we(i,p,Ko.clone(),.5,.08),z()&&z().thunk(1.5,.35);let x=p.userData.blocks.slice(),g=0,m=Mn(i,{name:"roux",pos:()=>p.position.clone().add(it(0,.03,0)),radius:.09,minPx:56,onDown:()=>{let E=x.shift();if(!E)return;x.length||(m.enabled=!1),z()&&z().pick(.6),S.scene.attach(E);let U=4-x.length-1,C=[-.3,.3,-.25,.3][U],P=[-.3,-.25,.3,.3][U];ve(we(i,E,bn.clone().add(it(C*ue.rIn,ue.h+.06,P*ue.rIn)),.45,.1,{spin:2}).then(()=>{r.addRoux(E,C,P),g++})),S.hint.poke()}});S.hint.set(m,{hand:"tap",delay:2.2}),await i.until(()=>g>=4),S.hint.clear(),ve(we(i,p,it(.1,dn,.2),.6,.08).then(()=>{p.visible=!1})),jt("melt"),S.hint.set(u,{hand:"circle",delay:2.5,circleR:.8});let _=f(.25);await i.until(()=>r.s.dissolved>.985),z()&&z().chime(.6),jt("thicken");let v=0,M=i.every(E=>{v+=E});await i.until(()=>r.s.thick>.86||v>14),M(),_(),S.hint.clear(),kn(bn.clone().add(it(0,ue.h+.05,0)),10,.14),z()&&z().jingle("ok"),await i.wait(.8),jt("lid"),u.enabled=!1,r.ladleRelease(),r.ladle.visible=!1,r.lidState.visible=!0,r.lidState.on=!1,r.lidState.k=0,z()&&z().lidClack(.4),await ii(i,{name:"lid",pos:()=>gn(r.lid).add(it(0,.03,0)),radius:.11,hint:"drag",to:()=>bn.clone().add(it(0,ue.h+.04,0)),delay:2.2}),r.lidState.on=!0,z()&&z().pick(.5),await i.until(()=>r.lidState.k>.97),z()&&z().lidClack(.9),jt("simmer");let b=0,w=0;l.headSpeed=16,r.onLidHop=E=>{b++,E>.9&&w++,l.headT.pitch=.32,l.leanT.y=-.012,setTimeout(()=>{l.headT.pitch=-.08,l.leanT.y=0},150)};let y=0,T=!1,F=i.every(E=>{y+=E}),O=i.every(()=>{y>3&&w===0&&o.heat<.7&&!o.grab&&S.hint.target!==o.item&&S.hint.set(o.item,{hand:"turn",delay:1.5}),w>0&&S.hint.target===o.item&&S.hint.clear()});if(await i.until(()=>w>=2||y>9),O(),S.hint.clear(),w>=2){jt("lid-gag"),T=!0,await S.rig.move(i,"stoveWide",1);let E=b,U=0,C=i.every(P=>{U+=P});await i.until(()=>b-E>=6||U>5.5||o.heat<.5),C(),l.setFace("happy"),z()&&z().giggle(.7),await i.wait(.9),l.setFace("smile"),await S.rig.move(i,"stove",1)}else await i.wait(1.2);F(),r.s.simmer=1,jt("knob-off"),z()&&z().jingle("ok"),l.headSpeed=7,l.lookAt(o.knobTop),l.handWorld("L",o.knobTop.clone().add(it(.09,.07,.03)),6),S.hint.set(o.item,{hand:"turn",delay:1.2});let N=0,B=i.every(E=>{N+=E});return await i.until(()=>!o.lit&&o.value<.08||N>11),B(),S.hint.clear(),(o.lit||o.value>=.08)&&(l.handWorld("L",o.knobTop.clone().add(it(.01,.03,0)),9),await i.wait(.6),o.setValue(0),await i.until(()=>!o.lit)),(a.lit||a.value>.05)&&(l.handWorld("L",a.knobTop.clone().add(it(.01,.03,0)),9),await i.wait(.5),a.setValue(0),await i.wait(.4)),o.item.enabled=!1,a.item.enabled=!1,r.onLidHop=null,await i.wait(.5),d(),await $o(i,1),await Es(i,()=>{S.rig.jump("sofa"),Jo(!0)}),z()&&z().hmm(!0),await i.wait(1.4),await Es(i,()=>{S.rig.jump("stove"),Jo(!1)}),jt("to-plate"),r.lidState.on=!1,z()&&z().lidClack(.5),S.fx.puff(bn.x,bn.y+ue.h+.03,bn.z,6,.2,.22),await i.wait(.9),r.burner=null,o.hasPot=!1,r.ladle.visible=!1,pe.add(nu()).position.copy(_c),l.handWorld("L",r.group.position.clone().add(it(.13,.1,0)),20),ve(S.rig.move(i,"plate",1.7)),await we(i,r.group,_c.clone().add(it(0,.012,0)),1.5,.12),z()&&z().thunk(.9,.6),l.restArms(),r.lidState.visible=!1,"plate"}$n("cook",i=>of(i,!1));$n("roux",i=>of(i,!0));function d_(){let i=new dt,t=new dt;i.add(t),t.add(ne([[0,-.022],[.016,-.02],[.03,-.011],[.037,.002],[.039,.012],[.0375,.012],[.0355,.002],[.029,-.0095],[.0155,-.018],[0,-.02]],q.steelPolished,36,{smooth:3}));let e=Rn([it(.036,.008,0),it(.05,.03,0),it(.06,.09,0),it(.066,.16,0),it(.069,.2,0)],.0042,q.steelPolished,24,8);e.scale.z=2.2,t.add(e);let n=ne([[0,0],[.0085,0],[.0095,.01],[.0085,.1],[.006,.108],[0,.11]],q.blackPlastic,16,{smooth:2});n.position.set(.0672,.15,0),n.rotation.z=-.045,t.add(n);let s=new Ge({color:9065496,roughness:.16,clearcoat:.5}),r=new tt(new yn(.0362,28),s);return r.rotation.x=-Math.PI/2,r.position.y=.007,t.add(r),i.userData={tilt:t,fill:r,fillMat:s},i}$n("plate",async({scope:i,fresh:t})=>{si({keepPot:!t});let e=S.state,n=S.pot,s=S.people;es("sleepy"),di();let r=Oi(.75,1.05,Math.PI*1.1),o=e.picks.length?e.picks:["carrot","potato","onion"],a=de(e.seed+31);t&&(n.reset(),rf(o,de(e.seed+21)),n.setFinished(),n.s.temp=.35),S.stove.main.reset(0),S.stove.side.reset(0),S.stove.main.hasPot=!1,n.group.visible=!0,n.burner=null,n.ladle.visible=!1,n.lidState.visible=!1,n.group.position.copy(_c).add(it(0,.012,0)),n.onPop=null,pe.add(nu()).position.copy(_c);let c=pe.add(H0());c.position.set(-.36,dn,.2),c.rotation.y=.35;let h=pe.add(G0()),u=it(-.33,dn+.168,.22);h.position.copy(u),h.rotation.set(-.5,.6,0);let d=pe.add(d_()),f=n.group.position.clone().add(it(.035,ue.floor+.075,.03));d.position.copy(f),d.rotation.y=-1,d.userData.tilt.rotation.z=-.5,i.every((G,E)=>{Math.random()<G*2.2&&S.fx.puff(c.position.x,dn+.2,c.position.z,1,.14,.13)});let p=[0,1,2].map(G=>{let E=pe.add(qr(G));return E.position.set(-.32+G*.27,dn,.52),E});t?S.rig.jump("plate"):S.rig.station!=="plate"&&await S.rig.move(i,"plate",1.5),jt("choose");let x=i.signal(),g=p.map((G,E)=>Mn(i,{name:"plate-"+E,pos:()=>G.position.clone().add(it(0,.02,0)),radius:.12,onDown:()=>x.fire(E)}));S.hint.set(g[1],{hand:"tap",delay:3});let m=await x.promise;S.hint.clear();for(let G of g)S.input.remove(G);e.plate=m,Vn(),z()&&(z().pick(),z().clink(.5));let _=p[m],v=it(-.07,dn,.47);p.forEach((G,E)=>{E!==m&&ve(we(i,G,G.position.clone().add(it(E<m?-.7:.9,0,.1)),.55,.02).then(()=>{G.visible=!1}))}),await we(i,_,v,.5,.05),z()&&z().clink(.7,.9);let M=mc(_,o,e.seed%97+3).userData;jt("rice");let b=!1,w=0,y=0,T=Mn(i,{name:"rice",pos:()=>c.position.clone().add(it(0,.17,.02)),radius:.14,onDown:async()=>{if(!(b||w>=3)){b=!0,S.hint.poke();try{z()&&z().cloth(.5),await we(i,h,c.position.clone().add(it(0,.15,.02)),.22,.03,{rot:new on(-.9,.6,0)}),h.userData.clump.visible=!0,z()&&z().scrub(.4),await we(i,h,_.position.clone().add(it(-.04,.11,.02)),.5,.1,{rot:new on(-.15,.2,0)}),await i.tween(.18,E=>{h.rotation.z=1.3*E}),h.userData.clump.visible=!1,w++,z()&&(z().thunk(.7,.35),z().cloth(.4));let G=M.st.rice;ve(i.tween(.35,E=>M.setRice(Ht(G,w/3,E)),Xe.back)),S.fx.puff(_.position.x-.03,dn+.06,_.position.z,2,.12,.16),await we(i,h,u,.45,.08,{rot:new on(-.5,.6,0)})}finally{b=!1}}}});S.hint.set(T,{hand:"tap",delay:2.2}),await i.until(()=>w>=3&&!b),T.enabled=!1,S.hint.clear(),z()&&z().chime(.5),jt("curry");let F=pe.add(bs(.006));F.material=new Ge({color:9065496,roughness:.15,clearcoat:.5});let O=Mn(i,{name:"curry",pos:()=>n.group.position.clone().add(it(0,ue.h,0)),radius:.13,onDown:async()=>{if(!(b||y>=3)){b=!0,S.hint.poke();try{let G=d.userData.tilt;await we(i,d,n.group.position.clone().add(it(0,n.surfY-.01,0)),.25,0),n.ringImpulse(0,0,.3,-.05),z()&&z().drip(1),d.userData.fill.visible=!0,await we(i,d,n.group.position.clone().add(it(-.02,ue.h+.08,.02)),.3,0),await we(i,d,_.position.clone().add(it(.075,.13,-.035)),.5,.05),await i.tween(.25,U=>{G.rotation.x=.75*U});let E=M.st.curry;y++,await i.tween(.85,U=>{let C=G.localToWorld(it(0,.008,.037));F.userData.set(C,it(C.x,dn+.02,C.z),Math.sin(Math.min(1,U*1.15)*Math.PI)*.9+.05,S.time),M.setCurry(Ht(E,y/3,Xe.out(U))),d.userData.fill.scale.setScalar(1-U*.6),z()&&Math.random()<.25&&z().drip(1)}),F.visible=!1,d.userData.fill.visible=!1,d.userData.fill.scale.setScalar(1),S.fx.puff(_.position.x+.04,dn+.05,_.position.z,2,.12,.16),await i.tween(.2,U=>{G.rotation.x=.75*(1-U)}),await we(i,d,f,.45,.06)}finally{b=!1}}}});d.userData.fill.visible=!1,S.hint.set(O,{hand:"tap",delay:2.2}),await i.until(()=>y>=3&&!b),O.enabled=!1,S.hint.clear(),jt("photo"),z()&&z().jingle("big"),kn(_.position.clone().add(it(0,.09,0)),12,.16);let N=i.every(G=>{Math.random()<G*5&&S.fx.puff(_.position.x+(Math.random()-.5)*.08,dn+.05,_.position.z,1,.13,.14)});await S.rig.move(i,"plateClose",1.3),await i.wait(.9);let B=tf();return B&&(e.lastPhoto=B,Vn()),await $o(i,.9),await i.wait(.4),jt("bell"),z()&&z().doorbell(),r.lookAt(it(gt.door.x,1.2,gt.door.z)),r.setFace("wow"),await i.wait(1.3),r.setFace("smile"),N(),"eat"});var hu=gt.counterY,Be=gt.table,Qs=.483;function af(i,t,e,n=1){let s=i.dim,r=e%3;if(r===0)i.leanT.y=Math.abs(Math.sin(t*7.5))*.045*n,i.hand("L",-(s.shW+.1),s.shY+.16+Math.sin(t*7.5)*.09,.08,16),i.hand("R",s.shW+.1,s.shY+.16-Math.sin(t*7.5)*.09,.08,16),i.headT.roll=Math.sin(t*7.5)*.12;else if(r===1)i.leanT.z=Math.sin(t*5.2)*.17*n,i.leanT.y=Math.abs(Math.sin(t*5.2))*.02,i.hand("L",-(s.shW+.2),s.shY+.05+Math.sin(t*10.4)*.05,.1,14),i.hand("R",s.shW+.2,s.shY+.05-Math.sin(t*10.4)*.05,.1,14),i.headT.roll=-Math.sin(t*5.2)*.2;else{let o=t*9;i.leanT.y=Math.abs(Math.sin(t*6.5))*.03*n,i.hand("L",-.05+Math.cos(o)*.06,s.shY-.06+Math.sin(o)*.06,.22,18),i.hand("R",.05-Math.cos(o)*.06,s.shY-.06-Math.sin(o)*.06,.22,18),i.headT.roll=Math.sin(t*6.5)*.15}}function lf(i){i.leanT.y=i.leanT.z=0,i.headT.roll=0,i.restArms()}$n("eat",async({scope:i,fresh:t})=>{si();let e=S.state,n=S.people,s=S.H,r=e.picks.length?e.picks:["carrot","potato","onion"],o=e.gag||{tummy:!0,dance:0};di();let a=n.cat,l=n.friends[e.friend%3],c=Gr[e.friend%3],h=n.mama;h.root.visible=!0,h.lying=!1;for(let E of Object.values(h.arms))E.thumbDir=null;h.place(Be.x-.98,0,Be.z,Math.PI/2).sitOn(Qs),h.setFace("smile");let u=n.papa;u.root.visible=!0,u.place(Be.x+.98,0,Be.z,-Math.PI/2).sitOn(Qs);let d=E=>{let U=E.dim;E.hand("L",-.12,U.hipY+.2,.3),E.hand("R",.12,U.hipY+.2,.3)};d(h),d(u),l.root.visible=!0,l.place(gt.door.x,0,gt.door.z+.42,Math.PI),l.setFace("smile");let f=[e.plate,e.plate,(e.plate+1)%3,(e.plate+2)%3],p=[{id:"friend",fig:l,spot:it(Be.x,Be.y,Be.z+.25)},{id:"mama",fig:h,spot:it(Be.x-.47,Be.y,Be.z)},{id:"papa",fig:u,spot:it(Be.x+.47,Be.y,Be.z)},{id:"girl",fig:null,spot:it(Be.x,Be.y,Be.z-.23)}];p.forEach((E,U)=>{E.plate=pe.add(qr(f[U])),E.plate.position.set(Be.x-.39+U*.26,Be.y,Be.z-.02),E.plate.scale.setScalar(.92),E.food=mc(E.plate,r,e.seed%97+3+U*5).userData,E.food.setRice(1),E.food.setCurry(1),E.spoon=pe.add(z0()),E.spoon.visible=!1,E.bites=0,E.busy=!1,E.served=!1}),i.every(E=>{for(let U of p)U.bites<2&&Math.random()<E*1.3&&S.fx.puff(U.plate.position.x,Be.y+.06,U.plate.position.z,1,.12,.1)}),jt("door"),t?(S.rig.jump("door"),z()&&z().doorbell()):await S.rig.move(i,"door",1.6),await ii(i,{name:"door",pos:()=>it(gt.door.x-.28,1,gt.door.z-.08),radius:.4,hint:"tap",delay:2.2}),z()&&z().doorOpen(),await i.tween(.9,E=>{s.doorLeaf.rotation.y=-1.45*E},Xe.out),jt("hello"),l.setFace("happy"),z()&&z().hello(c.pitch),await i.tween(1.3,E=>{l.wave("R",E*1.3)},Xe.lin),l.restArms(),l.setFace("smile"),u.lookAt(it(gt.door.x,1,gt.door.z)),h.lookAt(it(gt.door.x,1,gt.door.z)),ve((async()=>{h.wave("L",0),await i.tween(1,E=>h.wave("L",E)),d(h)})()),await Hr(i,l,gt.door.x,gt.door.z-.6,.9),ve(S.rig.move(i,"table",2.6)),await Hr(i,l,1.5,4.3,1.1),await Hr(i,l,Be.x,4.12,1,Math.PI),ve(i.tween(.6,E=>{s.doorLeaf.rotation.y=-1.45*(1-E)},Xe.in).then(()=>{z()&&z().thunk(.7,.5)}));let g=l.root.position.clone();z()&&z().pop(.5),await i.tween(.45,E=>{l.root.position.z=Ht(g.z,Be.z+.62,E),l.root.position.y=Math.sin(E*Math.PI)*.25+(Qs+.075-l.dim.hipY)*E}),l.sitOn(Qs),d(l),z()&&z().thunk(.8,.4),u.lookFront(),h.lookFront(),await i.wait(.5),jt("tummy"),z()&&z().rumble(1.1,.8),await i.wait(.7);let m=l.head.getWorldPosition(it());u.lookAt(m),h.lookAt(m),o.tummy||u.lookFront(),await i.wait(.9),l.setFace("shy"),l.headT.yaw=.45,await i.wait(.22),l.headT.yaw=-.45,await i.wait(.22),l.headT.yaw=.45,await i.wait(.22),l.headT.yaw=0,await i.wait(.3),o.tummy?(await Es(i,()=>{S.rig.jump({pos:[1.45,.98,3.95],look:[a.root.position.x,.6,a.root.position.z],fov:26,light:[-.4,.5,4.2],ls:1.6}),a.purr=1,a.sleepy=1}),z()&&z().purr(1.9),await i.wait(2),z()&&z().meow(.9),await Es(i,()=>{S.rig.jump("table"),a.purr=0})):(u.setFace("shy"),u.hand("R",.02,u.dim.hipY+.16,.2,12),h.lookAt(u.head.getWorldPosition(it())),l.lookAt(u.head.getWorldPosition(it())),z()&&z().rumble(.8,.7),u.leanT.y=.012,await i.wait(.9),u.leanT.y=0,z()&&z().giggle(.7),await i.wait(.8),u.setFace("smile"),d(u)),h.lookFront(),u.lookFront(),l.lookFront(),l.setFace("smile"),await i.wait(.5),z()&&z().rumble(1.4,1.1);let _=i.every((E,U)=>{l.leanT.z=Math.sin(U*40)*.02});await i.wait(.5),l.setFace("wow"),l.hand("L",-.05,l.dim.hipY+.14,.17,14),l.hand("R",.05,l.dim.hipY+.14,.17,14),u.lookAt(m),h.lookAt(m),await i.wait(.9),_(),l.leanT.z=0,l.setFace("shy"),z()&&z().giggle(c.pitch),h.setFace("happy"),u.setFace("happy"),await i.wait(1.1),h.setFace("smile"),u.setFace("smile"),l.setFace("smile"),d(l),h.lookFront(),u.lookFront(),jt("serve");let v=0;for(let E of p)E.item=Mn(i,{name:"serve-"+E.id,pos:()=>E.plate.position.clone().add(it(0,.03,0)),radius:.12,onDown:()=>{if(E.served)return;E.served=!0,E.item.enabled=!1;let U=p[v++];E.seat=U,U.mine=E,z()&&z().pick(.6),S.hint.poke(),ve(Promise.all([we(i,E.plate,U.spot,.55,.07),Ts(i,E.plate,1,.5)]).then(()=>{z()&&z().clink(.6,.85+Math.random()*.2),E.landed=!0,U.fig&&(U.fig.setFace("happy"),ve(i.wait(.8).then(()=>U.fig.setFace("smile"))))}));let C=p.find(P=>!P.served);C&&S.hint.set(C.item,{hand:"drag",to:()=>(p[v]||p[3]).spot.clone().add(it(0,.03,0)),delay:3})}});S.hint.set(p[0].item,{hand:"drag",to:()=>p[0].spot.clone().add(it(0,.03,0)),delay:2.2}),await i.until(()=>v>=4&&p.every(E=>E.landed)),S.hint.clear();let M=p.map(E=>({id:E.id,fig:E.fig,plate:E.mine.plate,food:E.mine.food,spoon:E.mine.spoon,bites:0,busy:!1}));await i.wait(.4),jt("eat");let b=!1,w=0,y=async E=>{if(!(E.busy||E.bites>=4)){E.busy=!0;try{let U=E.plate.position.clone().add(it(.03,.05,0));if(E.spoon.visible=!0,E.fig){let C=E.fig,P=i.every(()=>{let K=C.arms.R.hand.getWorldPosition(it());E.spoon.position.copy(K).add(it(0,-.015,0)),E.spoon.rotation.y=C.root.rotation.y});C.handWorld("R",U,13),await i.wait(.3),E.bites++;let X=E.food.st.eaten;ve(i.tween(.3,K=>E.food.setEaten(Ht(X,E.bites/4,K))));let D=C.head.getWorldPosition(it()).add(it(Math.sin(C.root.rotation.y)*.11,-.05,Math.cos(C.root.rotation.y)*.11));C.setFace("open"),C.handWorld("R",D,13),await i.wait(.33),z()&&z().bite(),C.setFace("chew"),await i.wait(.15),P(),E.spoon.visible=!1;let W=C.dim;C.hand("R",.12,W.hipY+.2,.3),E.id==="friend"&&!b?(b=!0,await i.wait(.35),C.setFace("wow"),z()&&z().wow(c.pitch),await i.wait(.75),C.setFace("happy"),z()&&(z().jingle("ok"),z().giggle(c.pitch)),kn(C.head.getWorldPosition(it()).add(it(0,.18,0)),10,.2),await i.tween(2.6,K=>af(C,K*2.6,o.dance),Xe.lin),lf(C),d(C),C.setFace("smile"),h.setFace("happy"),u.setFace("happy"),ve(i.wait(1).then(()=>{h.setFace("smile"),u.setFace("smile")}))):(z()&&z().chew(),await i.wait(.55),z()&&Math.random()<.6&&z().yum(E.fig===u?.7:E.fig===h?1:c.pitch),C.setFace(E.bites>=4?"happy":"smile"),await i.wait(.3))}else{E.spoon.position.copy(U),E.spoon.rotation.set(0,0,0),E.bites++;let C=E.food.st.eaten;ve(i.tween(.3,X=>E.food.setEaten(Ht(C,E.bites/4,X))));let P=S.camera.position.clone().add(it(0,-.1,.12));await we(i,E.spoon,P,.42,.03),E.spoon.visible=!1,z()&&(z().bite(),z().chew()),await i.wait(.5),z()&&z().yum(1.3)}}finally{E.busy=!1}}};for(let E of M)E.item=Mn(i,{name:"eat-"+E.id,pos:()=>E.plate.position.clone().add(it(0,.03,0)),radius:.13,onDown:()=>{S.hint.poke(),ve(y(E))}});S.hint.set(M[0].item,{hand:"tap",delay:2.2});let T=0,F=1.6,O=i.every(E=>{if(T+=E,F-=E,F<=0){F=1.5+Math.random()*1.2;let U=M.filter(C=>C.fig&&!C.busy&&C.bites<4&&(C.id!=="friend"?b||T>6:T>5));U.length&&ve(y(U[Math.random()*U.length|0]))}});await i.until(()=>b),S.hint.set(M[3].item,{hand:"tap",delay:4}),await i.until(()=>M.filter(E=>E.fig).every(E=>E.bites>=3&&!E.busy)&&(M[3].bites>=2||T>26)||T>40),O(),S.hint.clear();for(let E of M)E.item.enabled=!1;await i.until(()=>M.every(E=>!E.busy));for(let E of M){let U=E.food.st.eaten;ve(i.tween(.5,C=>E.food.setEaten(Ht(U,1,C))))}jt("dance");let N=n.girl;N.root.visible=!0,S.girlApron.visible=!0,N.place(Be.x,0,Be.z-.62,0).sitOn(Qs),await S.rig.move(i,"tableWide",1.2);let B=z()?z().dance():7.4,G=[l,h,u,N];for(let E of G)E.setFace("happy");a.purr=1,await i.tween(Math.max(6,B),E=>{let U=E*B;G.forEach((C,P)=>af(C,U+P*.2,o.dance+P,C===l||C===N?1:.6)),Math.random()<.05&&kn(it(Be.x+(Math.random()-.5)*1.6,1.5+Math.random()*.3,Be.z+(Math.random()-.5)*.6),2,.1)},Xe.lin);for(let E of G)lf(E),d(E),E.setFace("smile");return a.purr=0,z()&&z().jingle("big"),await i.wait(1),"dishes"});$n("dishes",async({scope:i,fresh:t})=>{si();let e=S.state,n=S.H,s=S.people;di(),Oi(-.2,1.2,Math.PI*.95);let r=s.friends[e.friend%3];r.root.visible=!0,r.place(Be.x,0,Be.z+.62,Math.PI).sitOn(Qs);let o=s.mama;o.root.visible=!0,o.place(Be.x-.98,0,Be.z,Math.PI/2).sitOn(Qs);let a=gt.sink,l=pe.add(qr(e.plate)),c=it(a.x,hu-.105,a.z-.015);l.position.copy(c),l.rotation.x=.8,l.children[1].visible=!1;let h=X0(l),u=pe.add(V0()),d=it(a.x+.19,hu-a.depth+.01,a.z+.1);u.position.copy(d),u.rotation.y=.4;let f=pe.add(W0()),p=it(a.x+.42,hu+.012,a.z+.12);f.position.copy(p),f.rotation.y=-.3;let x=[0,1,2].map(C=>{let P=pe.add(qr((e.plate+1+C)%3));return P.position.copy(n.shelfTop).add(it(0,C*.012,0)),P.children[1].visible=C===0,P}),g=pe.add(bs(.0065));t?S.rig.jump("sink"):await S.rig.move(i,"sink",1.8);let m=it(0,Math.cos(.8),Math.sin(.8)),_=()=>{let C=S.input.planePointN(l.position,m);if(!C)return null;let P=C.clone();return l.worldToLocal(C),{lx:C.x,lz:C.z,w:P,inside:Math.hypot(C.x,C.z)<h.R*1.05}};jt("scrub");let v=h.mkGrid(),M=0,b=0,w=Mn(i,{name:"scrub",zone:!0,pos:()=>l.position.clone().add(it(0,.02,.02)),radius:.12,onDown:()=>y(),onMove:C=>y(C),onUp:()=>{}});function y(C){let P=_();if(!P)return;let X=Math.hypot(P.lx,P.lz),D=X>h.R?h.R/X:1,W=P.lx*D,K=P.lz*D,ut=l.localToWorld(it(W,.03,K));u.position.lerp(ut,.6),u.rotation.set(.8,.4,0),!(!C||Math.hypot(C.dx,C.dy)<1)&&(h.addFoam(W,K),h.erase(h.stains,W,K,26),v.mark(W,K),S.time-M>.1&&(M=S.time,z()&&(z().scrub(.6),Math.random()<.4&&z().foamPop())),S.time-b>.25&&(b=S.time,S.fx.drops.emit({x:ut.x,y:ut.y+.01,z:ut.z,vx:(Math.random()-.5)*.06,vy:.08+Math.random()*.06,vz:.03,life:1.3,s0:.012,s1:.02,alpha:.5,grav:-.02,drag:1.5})))}S.hint.set(w,{hand:"circle",delay:2.2,circleR:.7}),await i.until(()=>v.frac>.62),w.enabled=!1,S.hint.clear(),z()&&z().chime(.5),ve(we(i,u,d,.4,.05,{rot:new on(0,.4,0)})),jt("rinse"),await ii(i,{name:"faucet",pos:()=>gn(n.faucetLever).add(it(.03,.02,.02)),radius:.07,minPx:54,hint:"tap",delay:2}),z()&&z().tap(.8),ve(i.tween(.25,C=>{n.faucetLever.rotation.z=.5*C}));let F=it(a.x,l.position.y+.06,n.spout.z),O=0,N=i.every((C,P)=>{g.userData.set(n.spout,F,O,P),z()&&z().waterSet(O),O>.3&&Math.random()<C*30&&S.fx.splash(F.x+(Math.random()-.5)*.12,F.y-Math.random()*.08,F.z+.03,2,.5)});await i.tween(.3,C=>{O=C}),h.drops.visible=!0,await i.tween(2.4,C=>{let P=Ht(-h.R,h.R,C);for(let X=-3;X<=3;X++)h.erase(h.foam,X/3*h.R*.9,P,34),h.erase(h.stains,X/3*h.R*.9,P,34)},Xe.lin);for(let C=-4;C<=4;C++)for(let P=-4;P<=4;P++)h.erase(h.foam,P/4*h.R,C/4*h.R,40),h.erase(h.stains,P/4*h.R,C/4*h.R,40);h.foam.visible=!1,h.stains.visible=!1,await i.tween(.3,C=>{O=1-C,n.faucetLever.rotation.z=.5*(1-C)}),N(),g.visible=!1,z()&&(z().waterSet(0),z().tap(.7)),jt("wipe");let B=h.mkGrid(),G=null,E=Mn(i,{name:"wipe",zone:!0,pos:()=>l.position.clone().add(it(0,.02,.02)),radius:.12,onDown:()=>U(),onMove:C=>U(C)});function U(C){let P=_();if(!P)return;let X=Math.hypot(P.lx,P.lz),D=X>h.R?h.R/X:1,W=P.lx*D,K=P.lz*D,ut=l.localToWorld(it(W,.02,K));f.position.lerp(ut,.6),f.rotation.set(.8,0,0),f.userData.update(S.time,C?C.dx*.2:0,C?C.dy*.2:0),!(!C||Math.hypot(C.dx,C.dy)<1)&&(h.erase(h.drops,W,K,30),h.erase(h.drops,W,K,22),B.mark(W,K),S.time-M>.16&&(M=S.time,z()&&z().squeak(.7)))}ve(we(i,f,l.position.clone().add(it(.13,.05,.05)),.5,.08,{rot:new on(.8,0,0)})),S.hint.set(E,{hand:"circle",delay:2.2,circleR:.7}),await i.until(()=>B.frac>.62),E.enabled=!1,S.hint.clear(),h.drops.visible=!1,jt("shine"),ve(we(i,f,p,.4,.05,{rot:new on(0,-.3,0)})),z()&&(z().chime(1),z().squeak(1)),kn(l.position.clone().add(it(0,.05,.03)),14,.14),await i.tween(.6,C=>{l.rotation.x=.8+Math.sin(C*Math.PI)*.25,l.position.y=c.y+Math.sin(C*Math.PI)*.07}),jt("stack"),ve(S.rig.move(i,"sinkShelf",1.1)),await we(i,l,n.shelfTop.clone().add(it(0,3*.012,0)),.9,.18,{rot:new on(0,0,0)}),z()&&z().clink(.9,1);for(let C of x)C.position.y-=.002;return await i.wait(.12),z()&&z().clink(.4,1.2),kn(gn(l).add(it(0,.04,0)),6,.1),await i.wait(.9),"hanamaru"});$n("hanamaru",async({scope:i,fresh:t})=>{si();let e=S.state,n=S.H,s=S.people;di();let r=s.mama;r.root.visible=!0,r.lying=!1;for(let P of Object.values(r.arms))P.thumbDir=null;r.place(-1.26,0,.9,-.3),r.setFace("happy");let o=Oi(-.75,1.5,-1.2);t?S.rig.jump("fridgeEnd"):await S.rig.move(i,"fridgeEnd",1.8),jt("draw");let a=e.plays+1,l=he(512),c=Ot(l,{srgb:!0});Yo(l,0,a);let h=pe.add(new tt(new ce(1,1),new He({map:c,transparent:!0,alphaTest:.04,roughness:.8}))),u=S.camera,d=u.position.clone().lerp(it(-1.98,1.3,.6),.34).add(it(.02,-.02,0));h.position.copy(d),h.scale.setScalar(.01),h.lookAt(u.position),h.renderOrder=30;let f=new dt,p=new tt(new Me(.008,.008,.09,12),fe(14826286,.6));p.position.y=.045,f.add(p);let x=new tt(new Li(.008,.016,12),fe(12724770,.6));x.rotation.x=Math.PI,x.position.y=-.008,f.add(x);let g=new tt(new Re(.03,16,12),fe(15912368,.62));g.position.set(.012,.075,.01),f.add(g),f.rotation.z=-.5,f.rotation.x=.4,f.visible=!1,pe.add(f),z()&&z().swish(.5,1200),await Ts(i,h,.3,.4),f.visible=!0,await i.tween(3,P=>{let X=Yo(l,P,a);c.needsUpdate=!0;let D=it(X[0]/512-.5,-(X[1]/512-.5),.01);h.localToWorld(D),f.position.copy(D),z()&&Math.random()<.45&&z().pen(.8)},Xe.lin),Yo(l,1,a),c.needsUpdate=!0,f.visible=!1,z()&&z().jingle("ok"),r.thumbs("R",!0),kn(h.position.clone(),10,.12),await i.wait(.7),jt("stick");let m=gn(n.fridgeDoorFront).z+.004,_=n.fridgeDoorSize,v=gn(n.fridgeDoorFront),M=Q0(e.stickers.length),b=it(v.x+M.x,v.y+M.y,m);await i.tween(.4,P=>{h.scale.setScalar(Ht(.3,.19,P))});let w=i.signal(),y=!1,T=!1,F=Mn(i,{name:"sticker",pos:()=>h.position.clone(),radius:.1,minPx:70,grow:1.5,onDown:()=>{T=!0,z()&&z().pick(.6)},onMove:P=>{if(P.moved<10)return;y=!0;let X=S.input.planePointZ(m+.12);X&&(h.position.set(re(X.x,v.x-_.w/2-.2,v.x+_.w/2+.5),re(X.y,v.y-_.h/2+.07,v.y+_.h/2+.1),m+.12),h.rotation.set(0,0,0),h.scale.setScalar(.15))},onUp:()=>{T&&(F.enabled=!1,w.fire(y))}});S.hint.set(F,{hand:"drag",to:()=>b,delay:2.2});let O=await w.promise;S.hint.clear();let N=b.x,B=b.y;O&&(N=re(h.position.x,v.x-_.w/2+.07,v.x+_.w/2-.07),B=re(h.position.y,v.y-_.h/2+.07,v.y+_.h/2-.07));let G=(a*37%9-4)*.03,E=h.rotation.clone(),U=h.scale.x,C=h.position.clone();return await i.tween(.35,P=>{h.position.lerpVectors(C,it(N,B,m),P),h.rotation.set(Ht(E.x,0,P),Ht(E.y,0,P),Ht(E.z,G,P)),h.scale.setScalar(Ht(U,.115,P))},Xe.in),z()&&(z().stick(),z().jingle("big")),kn(it(N,B,m+.03),16,.16),e.stickers.push({x:+(N-v.x).toFixed(4),y:+(B-v.y).toFixed(4),rot:G,seed:a}),e.lastPhoto&&(e.photos.push(e.lastPhoto),e.photos.length>6&&(e.photos=e.photos.slice(-6)),e.lastPhoto=null),e.plays++,e.scene="intro",e.picks=[],Vn(),h.visible=!1,lu(),r.setFace("happy"),o.thumbs("R",!0),o.setFace("happy"),z()&&z().wow(1),await i.tween(1.6,P=>{r.leanT.y=Math.abs(Math.sin(P*9))*.03}),r.thumbs("R",!1),o.thumbs("R",!1),jt("end"),await S.rig.move(i,"home",2.2),await i.wait(.6),"intro"});var vc=[{pr:2,shadow:2048},{pr:1.5,shadow:2048},{pr:1.25,shadow:1024},{pr:1,shadow:1024},{pr:.8,shadow:512},{pr:.6,shadow:0}],Mc={home:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M4 11.500 12 4.500l8 7V20h-5.500v-5h-5v5H4z' fill='%237a5a3c'/></svg>",soundOn:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M4 9.500h3.500L12 6v12l-4.500-3.500H4z' fill='%237a5a3c'/><path d='M15 9.500c1.200 1.300 1.200 3.700 0 5M17.500 7.500c2.300 2.500 2.300 6.500 0 9' fill='none' stroke='%237a5a3c' stroke-width='1.800' stroke-linecap='round'/></svg>",soundOff:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M4 9.500h3.500L12 6v12l-4.500-3.500H4z' fill='%237a5a3c'/><path d='M15.500 9.500l5 5M20.500 9.500l-5 5' fill='none' stroke='%237a5a3c' stroke-width='1.800' stroke-linecap='round'/></svg>",full:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M5 9.500V5h4.500M14.500 5H19v4.500M19 14.500V19h-4.500M9.500 19H5v-4.500' fill='none' stroke='%237a5a3c' stroke-width='2.200' stroke-linecap='round' stroke-linejoin='round'/></svg>"},uu=i=>`url("data:image/svg+xml,${i.replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/"/g,"'")}")`;function f_(){let i=S.params;i.get("reset")&&ou();let t=document.getElementById("c"),e=new Yl({canvas:t,antialias:!0,powerPreference:"high-performance",alpha:!1,stencil:!1});e.outputColorSpace=hn,e.toneMapping=Ro,e.toneMappingExposure=.95,e.shadowMap.enabled=!0,e.shadowMap.type=zs,l0(e.capabilities.getMaxAnisotropy()),S.renderer=e;let n=new Os;S.scene=n;let s=new Un(40,1.6,.05,30);S.camera=s,S.state=Z0(),S.audio=new lc,S.audio.muted=!!S.state.mute,p0(),S.lights=x0(e,n),S.H=g0(n),S.rig=new tc(s,S.lights),S.input=new ec(t,s),S.hint=new nc(S.input),S.fx=y0(n),S0(),S.stove=v0(n),S.permanentItems=[S.stove.main.item,S.stove.side.item],S.pot=new rc(n),S.people=R0(n),nf(),K0(...Object.values(q),...Object.values(ae),...Object.values(ct)),S.updaters.push((D,W)=>S.pot.update(D,W)),S.updaters.push(D=>S.audio.update(D));let r=window.devicePixelRatio||1,o=i.get("q")!==null?Math.max(0,Math.min(vc.length-1,parseInt(i.get("q"),10)||0)):r>=1.5?1:3,a=i.get("q")!==null,l=()=>{let D=vc[o];S.quality=o,e.setPixelRatio(Math.min(r,D.pr)),e.setSize(window.innerWidth,window.innerHeight,!1);let W=S.lights.sun;D.shadow===0?W.castShadow=!1:(W.castShadow=!0,W.shadow.mapSize.x!==D.shadow&&(W.shadow.mapSize.set(D.shadow,D.shadow),W.shadow.map&&(W.shadow.map.dispose(),W.shadow.map=null))),S.fx.steam.points.material.opacity=1},c=()=>{s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix(),l()};window.addEventListener("resize",c),c();let h=new Float32Array(240),u=0,d=0,f=3.5,p=()=>{let D=Math.min(d,h.length);return D<8?0:Array.from(h.subarray(0,D)).sort((K,ut)=>K-ut)[Math.floor(D*.95)]},x=document.getElementById("btn-home"),g=document.getElementById("btn-sound"),m=document.getElementById("btn-full");x.style.backgroundImage=uu(Mc.home),m.style.backgroundImage=uu(Mc.full);let _=()=>{g.style.backgroundImage=uu(S.audio.muted?Mc.soundOff:Mc.soundOn)};_();let v=D=>{D.preventDefault(),D.stopPropagation()};g.addEventListener("pointerdown",D=>{v(D),S.audio.unlock(),S.audio.setMuted(!S.audio.muted),S.state.mute=S.audio.muted,Vn(),_(),S.audio.muted||S.audio.tap(.6)});let M=()=>{try{let D=document;if(D.fullscreenElement||D.webkitFullscreenElement)(D.exitFullscreen||D.webkitExitFullscreen).call(D);else{let W=D.documentElement,K=(W.requestFullscreen||W.webkitRequestFullscreen).call(W);K&&K.catch&&K.catch(()=>{})}}catch{}};m.addEventListener("pointerdown",D=>{v(D),M()});let b=document.createElement("div");b.className="ring",x.appendChild(b);let w=-1,y=0,T=(D,W="#e8a23c")=>{b.style.background=D>0?`conic-gradient(${W} ${D*360}deg, rgba(0,0,0,0) 0deg)`:"none",b.style.webkitMask=b.style.mask="radial-gradient(circle, rgba(0,0,0,0) 62%, #000 64%)"};x.addEventListener("pointerdown",D=>{v(D),S.audio.unlock(),w=0,y=performance.now();try{x.setPointerCapture(D.pointerId)}catch{}});let F=()=>{if(w<0)return;let D=w;w=-1,T(0),D>=5?(ou(),S.state=ru(),S.state.mute=S.audio.muted,Vn(),S.audio.jingle("soft"),au()):D>=.8&&(S.audio.jingle("soft"),au())};x.addEventListener("pointerup",F),x.addEventListener("pointercancel",F);for(let D of[x,g,m])D.addEventListener("contextmenu",v);let O=!0;S.input.anyDown.push(()=>{S.audio.unlock(),O&&(O=!1,!i.get("test")&&!i.get("nofs")&&!(document.fullscreenElement||document.webkitFullscreenElement)&&M())}),t.addEventListener("webglcontextlost",D=>{D.preventDefault()},!1),t.addEventListener("webglcontextrestored",()=>{window.location.reload()},!1),document.addEventListener("visibilitychange",()=>{d=0,u=0,f=3;let D=S.audio.ctx;D&&(document.hidden?D.suspend().catch(()=>{}):D.resume().catch(()=>{}))});let N=!!i.get("test");S.timeScale=Math.max(1,parseFloat(i.get("speed")||"1"));let B=Math.max(1,parseInt(i.get("rskip")||"1",10)),G=D=>{S.dt=D,S.time+=D,S.frame++,S.scope&&S.scope.update(D);for(let W of S.updaters)W(D,S.time);S.hint.update(D),w>=0&&(w=(performance.now()-y)/1e3,T(Math.min(1,w/.8),w>=5?"#e2553c":"#e8a23c"),w>1.2&&w<5&&T(Math.min(1,w/5),"#e2a03c"))};S.fastForward=D=>{let W=Math.round(D*60);for(let K=0;K<W;K++)G(1/60)};let E=performance.now(),U=0,C=D=>{requestAnimationFrame(C);let W=Math.max(0,(D-E)/1e3);E=D;let K=performance.now(),ut=K;if(!S.paused)if(N){let Pt=Math.round(S.timeScale);for(let Z=0;Z<Pt;Z++)G(1/30)}else G(Math.min(.05,W)*S.timeScale);ut=performance.now(),S.rig.apply(S.time),(++U%B===0||S.paused)&&e.render(n,s),S.cpu&&(S.cpu.push(performance.now()-K),S.cpuTick.push(ut-K),S.cpu.length>3e3&&(S.cpu.shift(),S.cpuTick.shift())),W>0&&!document.hidden&&(h[u]=Math.min(1e3,W*1e3),u=(u+1)%h.length,d++),!a&&!N&&(f-=Math.min(W,.5),f<=0&&d>=8&&(p()>21&&o<vc.length-1?(o++,l(),d=0,u=0,f=2.5):f=1))};window.__game={ready:!1,G:S,stats:()=>({calls:e.info.render.calls,tris:e.info.render.triangles,quality:o,p95:+p().toFixed(2),frames:d,programs:e.info.programs?e.info.programs.length:0}),frameTimes:()=>Array.from(h.subarray(0,Math.min(d,h.length))),resetFrameTimes:()=>{d=0,u=0},info:()=>({scene:S.sceneName,step:S.sceneStep,time:+S.time.toFixed(2),state:{scene:S.state.scene,picks:S.state.picks,plate:S.state.plate,friend:S.state.friend,plays:S.state.plays,stickers:S.state.stickers.length,photos:S.state.photos.length},storageOk:S.storageOk,burner:{value:+S.stove.main.value.toFixed(3),lit:S.stove.main.lit,heat:+S.stove.main.heat.toFixed(3)},side:{lit:S.stove.side.lit},pot:{level:+S.pot.s.level.toFixed(3),boil:+S.pot.s.boil.toFixed(3),thick:+S.pot.s.thick.toFixed(3),dissolved:+S.pot.s.dissolved.toFixed(3),saute:+S.pot.s.saute.toFixed(3),chunks:S.pot.chunks.length,roux:S.pot.roux.length,lid:S.pot.lidState.on},audio:S.audio.ok,hint:!!S.hint.target}),targets:()=>S.input.targets(),steps:()=>(S.stepLog||[]).slice(),rayDown:(D,W,K=2)=>{let Pt=new Bs(new I(D,K,W),new I(0,-1,0),0,5).intersectObjects(S.scene.children,!0).find(Z=>Z.object.visible&&Z.object.isMesh&&!(Z.object.material&&Z.object.material.transparent));return Pt?+Pt.point.y.toFixed(4):null},worldPos:D=>{let W=S;for(let ut of D.split("."))W=W[ut];let K=W.getWorldPosition(new I);return[+K.x.toFixed(3),+K.y.toFixed(3),+K.z.toFixed(3)]},setSpeed:D=>{S.timeScale=D},benchTicks:(D=300)=>{let W=[];for(let K=0;K<D;K++){let ut=performance.now();G(1/60),W.push(performance.now()-ut)}return W},setRskip:D=>{B=Math.max(1,D|0)},pause:D=>{S.paused=!!D},setQuality:D=>{o=Math.max(0,Math.min(vc.length-1,D|0)),l()},goto:(D,W=!0)=>{Zo.includes(D)&&yc(D,W)}};let P=i.get("dev"),X=i.get("cam");P?p_(P):yc(i.get("scene")&&Zo.includes(i.get("scene"))?i.get("scene"):S.state.scene,!0),X&&$h[X]&&S.rig.jump(X),i.get("ff")&&S.fastForward(parseFloat(i.get("ff")));try{e.compile(n,s)}catch{}requestAnimationFrame(C),setTimeout(()=>{document.getElementById("fade").classList.add("off"),window.__game.ready=!0},60)}function p_(i){let t=S.params,e=de(7),n=S.pot;n.group.visible=!0,n.group.position.set(gt.burnerMain.x,Js,gt.burnerMain.z),n.burner=S.stove.main,S.stove.main.hasPot=!0,n.setLidRest(new I(.4,.86,.3)),S.input.add(S.stove.main.item),S.input.add(S.stove.side.item),S.stove.main.item.enabled=!0,S.stove.side.item.enabled=!0;let s=parseFloat(t.get("heat")||"0.7");S.stove.main.reset(s);for(let r of(t.get("ing")||"carrot,potato,onion,meat").split(",")){let o=en[r];for(let a=0;a<o.count;a++){let l=n.addChunk(o.chunk(e),r,o.chunkR,o.floatK,o.cooked);l.y=.03}}if(n.ladle.visible=!0,i!=="fry"&&(n.setWater(),n.s.temp=s),i==="roux")for(let r=0;r<4;r++){let o=n.addRoux(ac(),(r%2-.5)*.5,r<2?-.3:.3);o.y=.07}i==="curry"&&n.setFinished(),i==="lid"&&(n.setFinished(),n.lidState.visible=!0,n.lidState.on=!0,n.ladle.visible=!1),t.get("stir")&&S.updaters.push((r,o)=>{o<parseFloat(t.get("stir"))?n.ladleTo(Math.cos(o*4)*.55,Math.sin(o*4)*.55):n.ladleRelease()})}f_();})();
