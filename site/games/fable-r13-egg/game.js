(()=>{/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var fu=0,Pc=1,pu=2;var Ms=1,mu=2,hr=3,Ji=0,xn=1,xe=2,Ss=0,$i=1,ei=2,Ic=3,Lc=4,gu=5;var bs=100,xu=101,vu=102,_u=103,yu=104,Mu=200,Su=201,bu=202,wu=203,Dc=204,Nc=205,Eu=206,Tu=207,Ru=208,Au=209,Cu=210,Pu=211,Iu=212,Lu=213,Du=214,aa=0,la=1,ca=2,Ks=3,ha=4,ua=5,da=6,fa=7,Uc=0,Nu=1,Uu=2,fi=0,Fc=1,Oc=2,Bc=3,fo=4,Hc=5,kc=6,zc=7;var Vc=300,ws=301,ur=302,Ga=303,Wa=304,js=1e3,ai=1001,pa=1002,cn=1003,Fu=1004;var po=1005;var Qe=1006,Xa=1007;var Di=1008;var Cn=1009,Gc=1010,Wc=1011,dr=1012,qa=1013,ni=1014,Xn=1015,Pn=1016,Ya=1017,Za=1018,Es=1020,Xc=35902,qc=35899,Yc=1021,Zc=1022,Hn=1023,Ei=1026,Ni=1027,Ja=1028,$a=1029,Ki=1030,Ka=1031;var ja=1033,mo=33776,go=33777,xo=33778,vo=33779,Qa=35840,tl=35841,el=35842,nl=35843,il=36196,sl=37492,rl=37496,ol=37488,al=37489,_o=37490,ll=37491,cl=37808,hl=37809,ul=37810,dl=37811,fl=37812,pl=37813,ml=37814,gl=37815,xl=37816,vl=37817,_l=37818,yl=37819,Ml=37820,Sl=37821,bl=36492,wl=36494,El=36495,Tl=36283,Rl=36284,yo=36285,Al=36286;var Fr=2300,ma=2301,ra=2302,vc=2303,_c=2400,yc=2401,Mc=2402;var Ou=3200;var Cl=0,Bu=1,ii="",en="srgb",Or="srgb-linear",Br="linear",Le="srgb";var oa=7680;var Hu=519,ku=512,zu=513,Vu=514,Jc=515,Gu=516,Wu=517,$c=518,Kc=519,jc=35044,Qc=35048;var th="300 es",Vn=2e3,Qs=2001;function Lf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Df(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Hr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Xu(){let i=Hr("canvas");return i.style.display="block",i}var Ih={},tr=null;function kr(...i){let t="THREE."+i.shift();tr?tr("log",t,...i):console.log(t,...i)}function qu(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function oe(...i){i=qu(i);let t="THREE."+i.shift();if(tr)tr("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function re(...i){i=qu(i);let t="THREE."+i.shift();if(tr)tr("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function ds(...i){let t=i.join(" ");t in Ih||(Ih[t]=!0,oe(...i))}function Yu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Zu={[aa]:aa,[ca]:da,[ha]:ha,[Ks]:ua,[la]:la,[da]:ca,[fa]:fa,[ua]:Ks},ci=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var ql=Math.PI/180,ga=180/Math.PI;function ji(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]+"-"+Mn[t&255]+Mn[t>>8&255]+"-"+Mn[t>>16&15|64]+Mn[t>>24&255]+"-"+Mn[e&63|128]+Mn[e>>8&255]+"-"+Mn[e>>16&255]+Mn[e>>24&255]+Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]).toLowerCase()}function me(i,t,e){return Math.max(t,Math.min(e,i))}function Nf(i,t){return(i%t+t)%t}function Yl(i,t,e){return(1-e)*i+e*t}function Ju(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Pl(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function $u(i,t){if(t.constructor===Float32Array)return i;let e=Pl(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/e,-1)}function Ku(i,t){if(t.constructor===Float32Array)return i;let e=Pl(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*e)}var oh=class oh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=me(this.x,t.x,e.x),this.y=me(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=me(this.x,t,e),this.y=me(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(me(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};oh.prototype.isVector2=!0;var ot=oh,dn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3],p=r[o+0],d=r[o+1],g=r[o+2],v=r[o+3];if(h!==v||l!==p||c!==d||u!==g){let m=l*p+c*d+u*g+h*v;m<0&&(p=-p,d=-d,g=-g,v=-v,m=-m);let f=1-a;if(m<.9995){let x=Math.acos(m),_=Math.sin(x);f=Math.sin(f*x)/_,a=Math.sin(a*x)/_,l=l*f+p*a,c=c*f+d*a,u=u*f+g*a,h=h*f+v*a}else{l=l*f+p*a,c=c*f+d*a,u=u*f+g*a,h=h*f+v*a;let x=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=x,c*=x,u*=x,h*=x}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],p=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+u*h+l*d-c*p,t[e+1]=l*g+u*p+c*h-a*d,t[e+2]=c*g+u*d+a*p-l*h,t[e+3]=u*g-a*h-l*p-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),p=l(n/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=p*u*h+c*d*g,this._y=c*d*h-p*u*g,this._z=c*u*g+p*d*h,this._w=c*u*h-p*d*g;break;case"YXZ":this._x=p*u*h+c*d*g,this._y=c*d*h-p*u*g,this._z=c*u*g-p*d*h,this._w=c*u*h+p*d*g;break;case"ZXY":this._x=p*u*h-c*d*g,this._y=c*d*h+p*u*g,this._z=c*u*g+p*d*h,this._w=c*u*h-p*d*g;break;case"ZYX":this._x=p*u*h-c*d*g,this._y=c*d*h+p*u*g,this._z=c*u*g-p*d*h,this._w=c*u*h+p*d*g;break;case"YZX":this._x=p*u*h+c*d*g,this._y=c*d*h+p*u*g,this._z=c*u*g-p*d*h,this._w=c*u*h-p*d*g;break;case"XZY":this._x=p*u*h-c*d*g,this._y=c*d*h-p*u*g,this._z=c*u*g+p*d*h,this._w=c*u*h+p*d*g;break;default:oe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],p=n+a+h;if(p>0){let d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>h){let d=2*Math.sqrt(1+n-a-h);this._w=(u-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>h){let d=2*Math.sqrt(1+a-n-h);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+h-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(me(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},ah=class ah{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Lh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Lh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=me(this.x,t.x,e.x),this.y=me(this.y,t.y,e.y),this.z=me(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=me(this.x,t,e),this.y=me(this.y,t,e),this.z=me(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(me(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Zl.copy(this).projectOnVector(t),this.sub(Zl)}reflect(t){return this.sub(Zl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ah.prototype.isVector3=!0;var U=ah,Zl=new U,Lh=new dn,lh=class lh{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],p=n[2],d=n[5],g=n[8],v=s[0],m=s[3],f=s[6],x=s[1],_=s[4],y=s[7],w=s[2],T=s[5],M=s[8];return r[0]=o*v+a*x+l*w,r[3]=o*m+a*_+l*T,r[6]=o*f+a*y+l*M,r[1]=c*v+u*x+h*w,r[4]=c*m+u*_+h*T,r[7]=c*f+u*y+h*M,r[2]=p*v+d*x+g*w,r[5]=p*m+d*_+g*T,r[8]=p*f+d*y+g*M,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,p=a*l-u*r,d=c*r-o*l,g=e*h+n*p+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return t[0]=h*v,t[1]=(s*c-u*n)*v,t[2]=(a*n-s*o)*v,t[3]=p*v,t[4]=(u*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=d*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return ds("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Jl.makeScale(t,e)),this}rotate(t){return ds("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Jl.makeRotation(-t)),this}translate(t,e){return ds("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Jl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};lh.prototype.isMatrix3=!0;var ce=lh,Jl=new ce,Dh=new ce().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Nh=new ce().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Uf(){let i={enabled:!0,workingColorSpace:Or,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Le&&(s.r=wi(s.r),s.g=wi(s.g),s.b=wi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Le&&(s.r=$s(s.r),s.g=$s(s.g),s.b=$s(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ii?Br:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Or]:{primaries:t,whitePoint:n,transfer:Br,toXYZ:Dh,fromXYZ:Nh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:t,whitePoint:n,transfer:Le,toXYZ:Dh,fromXYZ:Nh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:en}}}),i}var ye=Uf();function wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ls,xa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ls===void 0&&(Ls=Hr("canvas")),Ls.width=t.width,Ls.height=t.height;let s=Ls.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ls}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Hr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wi(e[n]/255)*255):e[n]=wi(e[n]);return{data:e,width:t.width,height:t.height}}else return oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Ff=0,er=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ff++}),this.uuid=ji(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push($l(s[o].image)):r.push($l(s[o]))}else r=$l(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function $l(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?xa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(oe("Texture: Unable to serialize Texture."),{})}var Of=0,Kl=new U,fn=class i extends ci{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=ai,s=ai,r=Qe,o=Di,a=Hn,l=Cn,c=i.DEFAULT_ANISOTROPY,u=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=ji(),this.name="",this.source=new er(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ce,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Kl).x}get height(){return this.source.getSize(Kl).y}get depth(){return this.source.getSize(Kl).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){oe(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){oe(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Vc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case js:t.x=t.x-Math.floor(t.x);break;case ai:t.x=t.x<0?0:1;break;case pa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case js:t.y=t.y-Math.floor(t.y);break;case ai:t.y=t.y<0?0:1;break;case pa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=Vc;fn.DEFAULT_ANISOTROPY=1;var ch=class ch{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],u=l[4],h=l[8],p=l[1],d=l[5],g=l[9],v=l[2],m=l[6],f=l[10];if(Math.abs(u-p)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+p)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(c+1)/2,y=(d+1)/2,w=(f+1)/2,T=(u+p)/4,M=(h+v)/4,E=(g+m)/4;return _>y&&_>w?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=T/n,r=M/n):y>w?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=E/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=M/r,s=E/r),this.set(n,s,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(p-u)*(p-u));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(h-v)/x,this.z=(p-u)/x,this.w=Math.acos((c+d+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=me(this.x,t.x,e.x),this.y=me(this.y,t.y,e.y),this.z=me(this.z,t.z,e.z),this.w=me(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=me(this.x,t,e),this.y=me(this.y,t,e),this.z=me(this.z,t,e),this.w=me(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(me(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ch.prototype.isVector4=!0;var Xe=ch,va=class extends ci{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Xe(0,0,t,e),this.scissorTest=!1,this.viewport=new Xe(0,0,t,e),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new fn({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Qe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new er(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},pn=class extends va{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},zr=class extends fn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var _a=class extends fn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Va=class Va{constructor(t,e,n,s,r,o,a,l,c,u,h,p,d,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,h,p,d,g,v,m)}set(t,e,n,s,r,o,a,l,c,u,h,p,d,g,v,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=p,f[3]=d,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Va().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Ds.setFromMatrixColumn(t,0).length(),r=1/Ds.setFromMatrixColumn(t,1).length(),o=1/Ds.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){let p=o*u,d=o*h,g=a*u,v=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=d+g*c,e[5]=p-v*c,e[9]=-a*l,e[2]=v-p*c,e[6]=g+d*c,e[10]=o*l}else if(t.order==="YXZ"){let p=l*u,d=l*h,g=c*u,v=c*h;e[0]=p+v*a,e[4]=g*a-d,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=d*a-g,e[6]=v+p*a,e[10]=o*l}else if(t.order==="ZXY"){let p=l*u,d=l*h,g=c*u,v=c*h;e[0]=p-v*a,e[4]=-o*h,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*u,e[9]=v-p*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let p=o*u,d=o*h,g=a*u,v=a*h;e[0]=l*u,e[4]=g*c-d,e[8]=p*c+v,e[1]=l*h,e[5]=v*c+p,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let p=o*l,d=o*c,g=a*l,v=a*c;e[0]=l*u,e[4]=v-p*h,e[8]=g*h+d,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=d*h+g,e[10]=p-v*h}else if(t.order==="XZY"){let p=o*l,d=o*c,g=a*l,v=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=p*h+v,e[5]=o*u,e[9]=d*h-g,e[2]=g*h-d,e[6]=a*u,e[10]=v*h+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Bf,t,Hf)}lookAt(t,e,n){let s=this.elements;return Nn.subVectors(t,e),Nn.lengthSq()===0&&(Nn.z=1),Nn.normalize(),Hi.crossVectors(n,Nn),Hi.lengthSq()===0&&(Math.abs(n.z)===1?Nn.x+=1e-4:Nn.z+=1e-4,Nn.normalize(),Hi.crossVectors(n,Nn)),Hi.normalize(),Do.crossVectors(Nn,Hi),s[0]=Hi.x,s[4]=Do.x,s[8]=Nn.x,s[1]=Hi.y,s[5]=Do.y,s[9]=Nn.y,s[2]=Hi.z,s[6]=Do.z,s[10]=Nn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],p=n[9],d=n[13],g=n[2],v=n[6],m=n[10],f=n[14],x=n[3],_=n[7],y=n[11],w=n[15],T=s[0],M=s[4],E=s[8],N=s[12],C=s[1],L=s[5],b=s[9],R=s[13],S=s[2],P=s[6],F=s[10],D=s[14],H=s[3],B=s[7],z=s[11],Z=s[15];return r[0]=o*T+a*C+l*S+c*H,r[4]=o*M+a*L+l*P+c*B,r[8]=o*E+a*b+l*F+c*z,r[12]=o*N+a*R+l*D+c*Z,r[1]=u*T+h*C+p*S+d*H,r[5]=u*M+h*L+p*P+d*B,r[9]=u*E+h*b+p*F+d*z,r[13]=u*N+h*R+p*D+d*Z,r[2]=g*T+v*C+m*S+f*H,r[6]=g*M+v*L+m*P+f*B,r[10]=g*E+v*b+m*F+f*z,r[14]=g*N+v*R+m*D+f*Z,r[3]=x*T+_*C+y*S+w*H,r[7]=x*M+_*L+y*P+w*B,r[11]=x*E+_*b+y*F+w*z,r[15]=x*N+_*R+y*D+w*Z,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],p=t[10],d=t[14],g=t[3],v=t[7],m=t[11],f=t[15],x=l*d-c*p,_=a*d-c*h,y=a*p-l*h,w=o*d-c*u,T=o*p-l*u,M=o*h-a*u;return e*(v*x-m*_+f*y)-n*(g*x-m*w+f*T)+s*(g*_-v*w+f*M)-r*(g*y-v*T+m*M)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],u=t[10];return e*(o*u-a*c)-n*(r*u-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],p=t[10],d=t[11],g=t[12],v=t[13],m=t[14],f=t[15],x=e*a-n*o,_=e*l-s*o,y=e*c-r*o,w=n*l-s*a,T=n*c-r*a,M=s*c-r*l,E=u*v-h*g,N=u*m-p*g,C=u*f-d*g,L=h*m-p*v,b=h*f-d*v,R=p*f-d*m,S=x*R-_*b+y*L+w*C-T*N+M*E;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/S;return t[0]=(a*R-l*b+c*L)*P,t[1]=(s*b-n*R-r*L)*P,t[2]=(v*M-m*T+f*w)*P,t[3]=(p*T-h*M-d*w)*P,t[4]=(l*C-o*R-c*N)*P,t[5]=(e*R-s*C+r*N)*P,t[6]=(m*y-g*M-f*_)*P,t[7]=(u*M-p*y+d*_)*P,t[8]=(o*b-a*C+c*E)*P,t[9]=(n*C-e*b-r*E)*P,t[10]=(g*T-v*y+f*x)*P,t[11]=(h*y-u*T-d*x)*P,t[12]=(a*N-o*L-l*E)*P,t[13]=(e*L-n*N+s*E)*P,t[14]=(v*_-g*w-m*x)*P,t[15]=(u*w-h*_+p*x)*P,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,p=r*c,d=r*u,g=r*h,v=o*u,m=o*h,f=a*h,x=l*c,_=l*u,y=l*h,w=n.x,T=n.y,M=n.z;return s[0]=(1-(v+f))*w,s[1]=(d+y)*w,s[2]=(g-_)*w,s[3]=0,s[4]=(d-y)*T,s[5]=(1-(p+f))*T,s[6]=(m+x)*T,s[7]=0,s[8]=(g+_)*M,s[9]=(m-x)*M,s[10]=(1-(p+v))*M,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Ds.set(s[0],s[1],s[2]).length(),a=Ds.set(s[4],s[5],s[6]).length(),l=Ds.set(s[8],s[9],s[10]).length();r<0&&(o=-o),jn.copy(this);let c=1/o,u=1/a,h=1/l;return jn.elements[0]*=c,jn.elements[1]*=c,jn.elements[2]*=c,jn.elements[4]*=u,jn.elements[5]*=u,jn.elements[6]*=u,jn.elements[8]*=h,jn.elements[9]*=h,jn.elements[10]*=h,e.setFromRotationMatrix(jn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=Vn,l=!1){let c=this.elements,u=2*r/(e-t),h=2*r/(n-s),p=(e+t)/(e-t),d=(n+s)/(n-s),g,v;if(l)g=r/(o-r),v=o*r/(o-r);else if(a===Vn)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Qs)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Vn,l=!1){let c=this.elements,u=2/(e-t),h=2/(n-s),p=-(e+t)/(e-t),d=-(n+s)/(n-s),g,v;if(l)g=1/(o-r),v=o/(o-r);else if(a===Vn)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===Qs)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=h,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Va.prototype.isMatrix4=!0;var Te=Va,Ds=new U,jn=new Te,Bf=new U(0,0,0),Hf=new U(1,1,1),Hi=new U,Do=new U,Nn=new U,Uh=new Te,Fh=new dn,De=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],p=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(me(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-me(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(me(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-me(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(me(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-me(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Uh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Uh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Fh.setFromEuler(this),this.setFromQuaternion(Fh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};De.DEFAULT_ORDER="XYZ";var nr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},kf=0,Oh=new U,Ns=new dn,vi=new Te,No=new U,wr=new U,zf=new U,Vf=new dn,Bh=new U(1,0,0),Hh=new U(0,1,0),kh=new U(0,0,1),zh={type:"added"},Gf={type:"removed"},Us={type:"childadded",child:null},jl={type:"childremoved",child:null},nn=class i extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new U,e=new De,n=new dn,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Te},normalMatrix:{value:new ce}}),this.matrix=new Te,this.matrixWorld=new Te,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ns.setFromAxisAngle(t,e),this.quaternion.multiply(Ns),this}rotateOnWorldAxis(t,e){return Ns.setFromAxisAngle(t,e),this.quaternion.premultiply(Ns),this}rotateX(t){return this.rotateOnAxis(Bh,t)}rotateY(t){return this.rotateOnAxis(Hh,t)}rotateZ(t){return this.rotateOnAxis(kh,t)}translateOnAxis(t,e){return Oh.copy(t).applyQuaternion(this.quaternion),this.position.add(Oh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Bh,t)}translateY(t){return this.translateOnAxis(Hh,t)}translateZ(t){return this.translateOnAxis(kh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?No.copy(t):No.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt(wr,No,this.up):vi.lookAt(No,wr,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),Ns.setFromRotationMatrix(vi),this.quaternion.premultiply(Ns.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(re("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(zh),Us.child=t,this.dispatchEvent(Us),Us.child=null):re("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Gf),jl.child=t,this.dispatchEvent(jl),jl.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),vi.multiply(t.parent.matrixWorld)),t.applyMatrix4(vi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(zh),Us.child=t,this.dispatchEvent(Us),Us.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,t,zf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,Vf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),p=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};nn.DEFAULT_UP=new U(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Lt=class extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Wf={type:"move"},ir=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let v of t.hand.values()){let m=e.getJointPose(v,n),f=this._getHandJoint(c,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.quaternion,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],p=u.position.distanceTo(h.position),d=.02,g=.005;c.inputState.pinching&&p>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&p<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Wf)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Lt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},ju={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ki={h:0,s:0,l:0},Uo={h:0,s:0,l:0};function Ql(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Bt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ye.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ye.workingColorSpace){return this.r=t,this.g=e,this.b=n,ye.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ye.workingColorSpace){if(t=Nf(t,1),e=me(e,0,1),n=me(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ql(o,r,t+1/3),this.g=Ql(o,r,t),this.b=Ql(o,r,t-1/3)}return ye.colorSpaceToWorking(this,s),this}setStyle(t,e=en){function n(r){r!==void 0&&parseFloat(r)<1&&oe("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:oe("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);oe("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){let n=ju[t.toLowerCase()];return n!==void 0?this.setHex(n,e):oe("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wi(t.r),this.g=wi(t.g),this.b=wi(t.b),this}copyLinearToSRGB(t){return this.r=$s(t.r),this.g=$s(t.g),this.b=$s(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return ye.workingToColorSpace(Sn.copy(this),t),Math.round(me(Sn.r*255,0,255))*65536+Math.round(me(Sn.g*255,0,255))*256+Math.round(me(Sn.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ye.workingColorSpace){ye.workingToColorSpace(Sn.copy(this),e);let n=Sn.r,s=Sn.g,r=Sn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=ye.workingColorSpace){return ye.workingToColorSpace(Sn.copy(this),e),t.r=Sn.r,t.g=Sn.g,t.b=Sn.b,t}getStyle(t=en){ye.workingToColorSpace(Sn.copy(this),t);let e=Sn.r,n=Sn.g,s=Sn.b;return t!==en?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ki),this.setHSL(ki.h+t,ki.s+e,ki.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ki),t.getHSL(Uo);let n=Yl(ki.h,Uo.h,e),s=Yl(ki.s,Uo.s,e),r=Yl(ki.l,Uo.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Sn=new Bt;Bt.NAMES=ju;var fs=class extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new De,this.environmentIntensity=1,this.environmentRotation=new De,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Qn=new U,_i=new U,tc=new U,yi=new U,Fs=new U,Os=new U,Vh=new U,ec=new U,nc=new U,ic=new U,sc=new Xe,rc=new Xe,oc=new Xe,bi=class i{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Qn.subVectors(t,e),s.cross(Qn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Qn.subVectors(s,e),_i.subVectors(n,e),tc.subVectors(t,e);let o=Qn.dot(Qn),a=Qn.dot(_i),l=Qn.dot(tc),c=_i.dot(_i),u=_i.dot(tc),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;let p=1/h,d=(c*l-a*u)*p,g=(o*u-a*l)*p;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,yi)===null?!1:yi.x>=0&&yi.y>=0&&yi.x+yi.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,yi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,yi.x),l.addScaledVector(o,yi.y),l.addScaledVector(a,yi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return sc.setScalar(0),rc.setScalar(0),oc.setScalar(0),sc.fromBufferAttribute(t,e),rc.fromBufferAttribute(t,n),oc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(sc,r.x),o.addScaledVector(rc,r.y),o.addScaledVector(oc,r.z),o}static isFrontFacing(t,e,n,s){return Qn.subVectors(n,e),_i.subVectors(t,e),Qn.cross(_i).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Qn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Qn.cross(_i).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Fs.subVectors(s,n),Os.subVectors(r,n),ec.subVectors(t,n);let l=Fs.dot(ec),c=Os.dot(ec);if(l<=0&&c<=0)return e.copy(n);nc.subVectors(t,s);let u=Fs.dot(nc),h=Os.dot(nc);if(u>=0&&h<=u)return e.copy(s);let p=l*h-u*c;if(p<=0&&l>=0&&u<=0&&l-u>0)return o=l/(l-u),e.copy(n).addScaledVector(Fs,o);ic.subVectors(t,r);let d=Fs.dot(ic),g=Os.dot(ic);if(g>=0&&d<=g)return e.copy(r);let v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Os,a);let m=u*g-d*h;if(m<=0&&h-u>=0&&d-g>=0)return Vh.subVectors(r,s),a=(h-u)/(h-u+(d-g)),e.copy(s).addScaledVector(Vh,a);let f=1/(m+v+p);return o=v*f,a=p*f,e.copy(n).addScaledVector(Fs,o).addScaledVector(Os,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},hi=class{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ti.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ti.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ti.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ti):ti.fromBufferAttribute(r,o),ti.applyMatrix4(t.matrixWorld),this.expandByPoint(ti);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Fo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fo.copy(n.boundingBox)),Fo.applyMatrix4(t.matrixWorld),this.union(Fo)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ti),ti.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Er),Oo.subVectors(this.max,Er),Bs.subVectors(t.a,Er),Hs.subVectors(t.b,Er),ks.subVectors(t.c,Er),zi.subVectors(Hs,Bs),Vi.subVectors(ks,Hs),ls.subVectors(Bs,ks);let e=[0,-zi.z,zi.y,0,-Vi.z,Vi.y,0,-ls.z,ls.y,zi.z,0,-zi.x,Vi.z,0,-Vi.x,ls.z,0,-ls.x,-zi.y,zi.x,0,-Vi.y,Vi.x,0,-ls.y,ls.x,0];return!ac(e,Bs,Hs,ks,Oo)||(e=[1,0,0,0,1,0,0,0,1],!ac(e,Bs,Hs,ks,Oo))?!1:(Bo.crossVectors(zi,Vi),e=[Bo.x,Bo.y,Bo.z],ac(e,Bs,Hs,ks,Oo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ti).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ti).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Mi=[new U,new U,new U,new U,new U,new U,new U,new U],ti=new U,Fo=new hi,Bs=new U,Hs=new U,ks=new U,zi=new U,Vi=new U,ls=new U,Er=new U,Oo=new U,Bo=new U,cs=new U;function ac(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){cs.fromArray(i,r);let a=s.x*Math.abs(cs.x)+s.y*Math.abs(cs.y)+s.z*Math.abs(cs.z),l=t.dot(cs),c=e.dot(cs),u=n.dot(cs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var je=new U,Ho=new ot,Xf=0,An=class extends ci{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=jc,this.updateRanges=[],this.gpuType=Xn,this.version=0,this._normalizationScale=t!==void 0?Pl(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ho.fromBufferAttribute(this,e),Ho.applyMatrix3(t),this.setXY(e,Ho.x,Ho.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)je.fromBufferAttribute(this,e),je.applyMatrix3(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)je.fromBufferAttribute(this,e),je.applyMatrix4(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)je.fromBufferAttribute(this,e),je.applyNormalMatrix(t),this.setXYZ(e,je.x,je.y,je.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)je.fromBufferAttribute(this,e),je.transformDirection(t),this.setXYZ(e,je.x,je.y,je.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):$u(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):Ku(t,this.array)}};var Vr=class extends An{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Gr=class extends An{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Xt=class extends An{constructor(t,e,n){super(new Float32Array(t),e,n)}},qf=new hi,Tr=new U,lc=new U,ui=class{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):qf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Tr.subVectors(t,this.center);let e=Tr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Tr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(lc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Tr.copy(t.center).add(lc)),this.expandByPoint(Tr.copy(t.center).sub(lc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Yf=0,zn=new Te,cc=new nn,zs=new U,Un=new hi,Rr=new hi,ln=new U,Ce=class i extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=ji(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Lf(t)?Gr:Vr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ce().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return zn.makeRotationFromQuaternion(t),this.applyMatrix4(zn),this}rotateX(t){return zn.makeRotationX(t),this.applyMatrix4(zn),this}rotateY(t){return zn.makeRotationY(t),this.applyMatrix4(zn),this}rotateZ(t){return zn.makeRotationZ(t),this.applyMatrix4(zn),this}translate(t,e,n){return zn.makeTranslation(t,e,n),this.applyMatrix4(zn),this}scale(t,e,n){return zn.makeScale(t,e,n),this.applyMatrix4(zn),this}lookAt(t){return cc.lookAt(t),cc.updateMatrix(),this.applyMatrix4(cc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Xt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){re("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Un.setFromBufferAttribute(r),this.morphTargetsRelative?(ln.addVectors(this.boundingBox.min,Un.min),this.boundingBox.expandByPoint(ln),ln.addVectors(this.boundingBox.max,Un.max),this.boundingBox.expandByPoint(ln)):(this.boundingBox.expandByPoint(Un.min),this.boundingBox.expandByPoint(Un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&re('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ui);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){re("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){let n=this.boundingSphere.center;if(Un.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Rr.setFromBufferAttribute(a),this.morphTargetsRelative?(ln.addVectors(Un.min,Rr.min),Un.expandByPoint(ln),ln.addVectors(Un.max,Rr.max),Un.expandByPoint(ln)):(Un.expandByPoint(Rr.min),Un.expandByPoint(Rr.max))}Un.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ln.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ln));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)ln.fromBufferAttribute(a,c),l&&(zs.fromBufferAttribute(t,c),ln.add(zs)),s=Math.max(s,n.distanceToSquared(ln))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&re('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){re("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new An(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let N=0;N<n.count;N++)a[N]=new U,l[N]=new U;let u=new U,h=new U,p=new U,d=new ot,g=new ot,v=new ot,m=new U,f=new U;function x(N,C,L){c[N]=c[C]=c[L]=1,u.fromBufferAttribute(n,N),h.fromBufferAttribute(n,C),p.fromBufferAttribute(n,L),d.fromBufferAttribute(r,N),g.fromBufferAttribute(r,C),v.fromBufferAttribute(r,L),h.sub(u),p.sub(u),g.sub(d),v.sub(d);let b=1/(g.x*v.y-v.x*g.y);isFinite(b)&&(m.copy(h).multiplyScalar(v.y).addScaledVector(p,-g.y).multiplyScalar(b),f.copy(p).multiplyScalar(g.x).addScaledVector(h,-v.x).multiplyScalar(b),a[N].add(m),a[C].add(m),a[L].add(m),l[N].add(f),l[C].add(f),l[L].add(f))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let N=0,C=_.length;N<C;++N){let L=_[N],b=L.start,R=L.count;for(let S=b,P=b+R;S<P;S+=3)x(t.getX(S+0),t.getX(S+1),t.getX(S+2))}let y=new U,w=new U,T=new U,M=new U;function E(N){T.fromBufferAttribute(s,N),M.copy(T);let C=a[N];y.copy(C),y.sub(T.multiplyScalar(T.dot(C))).normalize(),w.crossVectors(M,C);let b=w.dot(l[N])<0?-1:1;o.setXYZW(N,y.x,y.y,y.z,b)}for(let N=0,C=n.count;N<C;++N)c[N]&&E(N);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new An(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);let s=new U,r=new U,o=new U,a=new U,l=new U,c=new U,u=new U,h=new U;if(t)for(let p=0,d=t.count;p<d;p+=3){let g=t.getX(p+0),v=t.getX(p+1),m=t.getX(p+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let p=0,d=e.count;p<d;p+=3)s.fromBufferAttribute(e,p+0),r.fromBufferAttribute(e,p+1),o.fromBufferAttribute(e,p+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(p+0,u.x,u.y,u.z),n.setXYZ(p+1,u.x,u.y,u.z),n.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ln.fromBufferAttribute(t,e),ln.normalize(),t.setXYZ(e,ln.x,ln.y,ln.z)}toNonIndexed(){function t(a,l){let c=a.array,u=a.itemSize,h=a.normalized,p=new c.constructor(l.length*u),d=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?d=l[v]*a.data.stride+a.offset:d=l[v]*u;for(let f=0;f<u;f++)p[g++]=c[d++]}return new An(p,u,h)}if(this.index===null)return oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){let p=c[u],d=t(p,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,p=c.length;h<p;h++){let d=c[h];u.push(d.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(e))}let r=t.morphAttributes;for(let c in r){let u=[],h=r[c];for(let p=0,d=h.length;p<d;p++)u.push(h[p].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ya=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=jc,this.updateRanges=[],this.version=0,this.uuid=ji()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});let e=Gh(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=this.array.slice(0).buffer);let n=new this.array.constructor(t.arrayBuffers[e]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});let e=Gh(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:e,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function Gh(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=ji()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var Rn=new U,Wr=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s,this._normalizationScale=t!==void 0?Pl(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Rn.fromBufferAttribute(this,e),Rn.applyMatrix4(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Rn.fromBufferAttribute(this,e),Rn.applyNormalMatrix(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Rn.fromBufferAttribute(this,e),Rn.transformDirection(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=this._denormalize(e)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=this._denormalize(e)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=this._denormalize(e)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=this._denormalize(e)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){kr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new An(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){kr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):$u(t,this.data.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):Ku(t,this.data.array)}},hc=new U,Zf=new U,Jf=new ce,Fn=class{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=hc.subVectors(n,e).cross(Zf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(hc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Jf.getNormalMatrix(t),s=this.coplanarPoint(hc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},$f=0,Ti=class extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=ji(),this.name="",this.type="Material",this.blending=$i,this.side=Ji,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Dc,this.blendDst=Nc,this.blendEquation=bs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=Ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oa,this.stencilZFail=oa,this.stencilZPass=oa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){oe(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){oe(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Bt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Fn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ot().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ot().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},di=class extends Ti{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Vs,Ar=new U,Gs=new U,Ws=new U,Xs=new ot,Cr=new ot,Qu=new Te,ko=new U,Pr=new U,zo=new U,Wh=new ot,uc=new ot,Xh=new ot,Ri=class extends nn{constructor(t=new di){if(super(),this.isSprite=!0,this.type="Sprite",Vs===void 0){Vs=new Ce;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ya(e,5);Vs.setIndex([0,1,2,0,2,3]),Vs.setAttribute("position",new Wr(n,3,0,!1)),Vs.setAttribute("uv",new Wr(n,2,3,!1))}this.geometry=Vs,this.material=t,this.center=new ot(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&re('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Gs.setFromMatrixScale(this.matrixWorld),Qu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ws.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gs.multiplyScalar(-Ws.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;Vo(ko.set(-.5,-.5,0),Ws,o,Gs,s,r),Vo(Pr.set(.5,-.5,0),Ws,o,Gs,s,r),Vo(zo.set(.5,.5,0),Ws,o,Gs,s,r),Wh.set(0,0),uc.set(1,0),Xh.set(1,1);let a=t.ray.intersectTriangle(ko,Pr,zo,!1,Ar);if(a===null&&(Vo(Pr.set(-.5,.5,0),Ws,o,Gs,s,r),uc.set(0,1),a=t.ray.intersectTriangle(ko,zo,Pr,!1,Ar),a===null))return;let l=t.ray.origin.distanceTo(Ar);l<t.near||l>t.far||e.push({distance:l,point:Ar.clone(),uv:bi.getInterpolation(Ar,ko,Pr,zo,Wh,uc,Xh,new ot),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}toJSON(t){let e=super.toJSON(t);return e.object.center=this.center.toArray(),e}};function Vo(i,t,e,n,s,r){Xs.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Cr.x=r*Xs.x-s*Xs.y,Cr.y=s*Xs.x+r*Xs.y):Cr.copy(Xs),i.copy(t),i.x+=Cr.x,i.y+=Cr.y,i.applyMatrix4(Qu)}var Si=new U,dc=new U,Go=new U,Wo=new U,Xr=class{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Si)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Si.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Si.copy(this.origin).addScaledVector(this.direction,e),Si.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){dc.copy(t).add(e).multiplyScalar(.5),Go.copy(e).sub(t).normalize(),Wo.copy(this.origin).sub(dc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Go),a=Wo.dot(this.direction),l=-Wo.dot(Go),c=Wo.lengthSq(),u=Math.abs(1-o*o),h,p,d,g;if(u>0)if(h=o*l-a,p=o*a-l,g=r*u,h>=0)if(p>=-g)if(p<=g){let v=1/u;h*=v,p*=v,d=h*(h+o*p+2*a)+p*(o*h+p+2*l)+c}else p=r,h=Math.max(0,-(o*p+a)),d=-h*h+p*(p+2*l)+c;else p=-r,h=Math.max(0,-(o*p+a)),d=-h*h+p*(p+2*l)+c;else p<=-g?(h=Math.max(0,-(-o*r+a)),p=h>0?-r:Math.min(Math.max(-r,-l),r),d=-h*h+p*(p+2*l)+c):p<=g?(h=0,p=Math.min(Math.max(-r,-l),r),d=p*(p+2*l)+c):(h=Math.max(0,-(o*r+a)),p=h>0?r:Math.min(Math.max(-r,-l),r),d=-h*h+p*(p+2*l)+c);else p=o>0?-r:r,h=Math.max(0,-(o*p+a)),d=-h*h+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(dc).addScaledVector(Go,p),d}intersectSphere(t,e){if(t.radius<0)return null;Si.subVectors(t.center,this.origin);let n=Si.dot(this.direction),s=Si.dot(Si)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,p=this.origin;return c>=0?(n=(t.min.x-p.x)*c,s=(t.max.x-p.x)*c):(n=(t.max.x-p.x)*c,s=(t.min.x-p.x)*c),u>=0?(r=(t.min.y-p.y)*u,o=(t.max.y-p.y)*u):(r=(t.max.y-p.y)*u,o=(t.min.y-p.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-p.z)*h,l=(t.max.z-p.z)*h):(a=(t.max.z-p.z)*h,l=(t.min.z-p.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Si)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,h=t.x-o.x,p=t.y-o.y,d=t.z-o.z,g=e.x-o.x,v=e.y-o.y,m=e.z-o.z,f=n.x-o.x,x=n.y-o.y,_=n.z-o.z,y=Math.abs(l),w=Math.abs(c),T=Math.abs(u),M,E,N,C,L,b,R,S,P,F,D,H;if(y>=w&&y>=T?(N=l,b=h,P=g,H=f,l>=0?(M=c,E=u,C=p,L=d,R=v,S=m,F=x,D=_):(M=u,E=c,C=d,L=p,R=m,S=v,F=_,D=x)):w>=T?(N=c,b=p,P=v,H=x,c>=0?(M=u,E=l,C=d,L=h,R=m,S=g,F=_,D=f):(M=l,E=u,C=h,L=d,R=g,S=m,F=f,D=_)):(N=u,b=d,P=m,H=_,u>=0?(M=l,E=c,C=h,L=p,R=g,S=v,F=f,D=x):(M=c,E=l,C=p,L=h,R=v,S=g,F=x,D=f)),N===0)return null;let B=M/N,z=E/N,Z=1/N,W=C-B*b,tt=L-z*b,k=R-B*P,ut=S-z*P,pt=F-B*H,Tt=D-z*H,dt=pt*ut-Tt*k,Pt=W*Tt-tt*pt,te=k*tt-ut*W;if(s){if(dt<0||Pt<0||te<0)return null}else if((dt<0||Pt<0||te<0)&&(dt>0||Pt>0||te>0))return null;let Rt=dt+Pt+te;if(Rt===0)return null;let Ht=Z*(dt*b+Pt*P+te*H);return(Rt>0?Ht<0:Ht>0)?null:this.at(Ht/Rt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Me=class extends Ti{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new De,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},qh=new Te,hs=new Xr,Xo=new ui,Yh=new U,qo=new U,Yo=new U,Zo=new U,fc=new U,Jo=new U,Zh=new U,$o=new U,it=class extends nn{constructor(t=new Ce,e=new Me){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Jo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],h=r[l];u!==0&&(fc.fromBufferAttribute(h,t),o?Jo.addScaledVector(fc,u):Jo.addScaledVector(fc.sub(e),u))}e.add(Jo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xo.copy(n.boundingSphere),Xo.applyMatrix4(r),hs.copy(t.ray).recast(t.near),!(Xo.containsPoint(hs.origin)===!1&&(hs.intersectSphere(Xo,Yh)===null||hs.origin.distanceToSquared(Yh)>(t.far-t.near)**2))&&(qh.copy(r).invert(),hs.copy(t.ray).applyMatrix4(qh),!(n.boundingBox!==null&&hs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,hs)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,p=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){let m=p[g],f=o[m.materialIndex],x=Math.max(m.start,d.start),_=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=x,w=_;y<w;y+=3){let T=a.getX(y),M=a.getX(y+1),E=a.getX(y+2);s=Ko(this,f,t,n,c,u,h,T,M,E),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let m=g,f=v;m<f;m+=3){let x=a.getX(m),_=a.getX(m+1),y=a.getX(m+2);s=Ko(this,o,t,n,c,u,h,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){let m=p[g],f=o[m.materialIndex],x=Math.max(m.start,d.start),_=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=x,w=_;y<w;y+=3){let T=y,M=y+1,E=y+2;s=Ko(this,f,t,n,c,u,h,T,M,E),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,f=v;m<f;m+=3){let x=m,_=m+1,y=m+2;s=Ko(this,o,t,n,c,u,h,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Kf(i,t,e,n,s,r,o,a){let l;if(t.side===xn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Ji,a),l===null)return null;$o.copy(a),$o.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo($o);return c<e.near||c>e.far?null:{distance:c,point:$o.clone(),object:i}}function Ko(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,qo),i.getVertexPosition(l,Yo),i.getVertexPosition(c,Zo);let u=Kf(i,t,e,n,qo,Yo,Zo,Zh);if(u){let h=new U;bi.getBarycoord(Zh,qo,Yo,Zo,h),s&&(u.uv=bi.getInterpolatedAttribute(s,a,l,c,h,new ot)),r&&(u.uv1=bi.getInterpolatedAttribute(r,a,l,c,h,new ot)),o&&(u.normal=bi.getInterpolatedAttribute(o,a,l,c,h,new U),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let p={a,b:l,c,normal:new U,materialIndex:0};bi.getNormal(qo,Yo,Zo,p.normal),u.face=p,u.barycoord=h}return u}var ps=class extends fn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=cn,u=cn,h,p){super(null,o,a,l,c,u,s,r,h,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ai=class extends An{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},qs=new Te,Jh=new Te,jo=[],$h=new hi,jf=new Te,Ir=new it,Lr=new ui,qr=class extends it{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ai(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,jf)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new hi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,qs),$h.copy(t.boundingBox).applyMatrix4(qs),this.boundingBox.union($h)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ui),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,qs),Lr.copy(t.boundingSphere).applyMatrix4(qs),this.boundingSphere.union(Lr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Ir.geometry=this.geometry,Ir.material=this.material,Ir.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Lr.copy(this.boundingSphere),Lr.applyMatrix4(n),t.ray.intersectsSphere(Lr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,qs),Jh.multiplyMatrices(n,qs),Ir.matrixWorld=Jh,Ir.raycast(t,jo);for(let o=0,a=jo.length;o<a;o++){let l=jo[o];l.instanceId=r,l.object=this,e.push(l)}jo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Ai(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ps(new Float32Array(s*this.count),s,this.count,Ja,Xn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},us=new ui,Qf=new ot(.5,.5),Qo=new U,Wi=class{constructor(t=new Fn,e=new Fn,n=new Fn,s=new Fn,r=new Fn,o=new Fn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Vn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],p=r[6],d=r[7],g=r[8],v=r[9],m=r[10],f=r[11],x=r[12],_=r[13],y=r[14],w=r[15];if(s[0].setComponents(c-o,d-u,f-g,w-x).normalize(),s[1].setComponents(c+o,d+u,f+g,w+x).normalize(),s[2].setComponents(c+a,d+h,f+v,w+_).normalize(),s[3].setComponents(c-a,d-h,f-v,w-_).normalize(),n)s[4].setComponents(l,p,m,y).normalize(),s[5].setComponents(c-l,d-p,f-m,w-y).normalize();else if(s[4].setComponents(c-l,d-p,f-m,w-y).normalize(),e===Vn)s[5].setComponents(c+l,d+p,f+m,w+y).normalize();else if(e===Qs)s[5].setComponents(l,p,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),us.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),us.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(us)}intersectsSprite(t){us.center.set(0,0,0);let e=Qf.distanceTo(t.center);return us.radius=.7071067811865476+e,us.applyMatrix4(t.matrixWorld),this.intersectsSphere(us)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Qo.x=s.normal.x>0?t.max.x:t.min.x,Qo.y=s.normal.y>0?t.max.y:t.min.y,Qo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Qo)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Kh=new Te,Ma=class i{constructor(){this.coordinateSystem=Vn,this._frustums=[],this._count=0}setFromArrayCamera(t){let e=t.cameras,n=this._frustums;for(let s=0;s<e.length;s++){let r=e[s];Kh.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new Wi),n[s].setFromProjectionMatrix(Kh,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let e=this._frustums,n=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new Wi),e[s].copy(n[s]);return this._count=t._count,this}clone(){return new i().copy(this)}};var Yr=class extends fn{constructor(t=[],e=ws,n,s,r,o,a,l,c,u){super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Zr=class extends fn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ci=class extends fn{constructor(t,e,n=ni,s,r,o,a=cn,l=cn,c,u=Ei,h=1){if(u!==Ei&&u!==Ni)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let p={width:t,height:e,depth:h};super(p,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new er(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Jr=class extends Ci{constructor(t,e=ni,n=ws,s,r,o=cn,a=cn,l,c=Ei){let u={width:t,height:t,depth:1},h=[u,u,u,u,u,u];super(t,t,e,n,s,r,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},$r=class extends fn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},mn=class i extends Ce{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],h=[],p=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Xt(c,3)),this.setAttribute("normal",new Xt(u,3)),this.setAttribute("uv",new Xt(h,2));function g(v,m,f,x,_,y,w,T,M,E,N){let C=y/M,L=w/E,b=y/2,R=w/2,S=T/2,P=M+1,F=E+1,D=0,H=0,B=new U;for(let z=0;z<F;z++){let Z=z*L-R;for(let W=0;W<P;W++){let tt=W*C-b;B[v]=tt*x,B[m]=Z*_,B[f]=S,c.push(B.x,B.y,B.z),B[v]=0,B[m]=0,B[f]=T>0?1:-1,u.push(B.x,B.y,B.z),h.push(W/M),h.push(1-z/E),D+=1}}for(let z=0;z<E;z++)for(let Z=0;Z<M;Z++){let W=p+Z+P*z,tt=p+Z+P*(z+1),k=p+(Z+1)+P*(z+1),ut=p+(Z+1)+P*z;l.push(W,tt,ut),l.push(tt,k,ut),H+=6}a.addGroup(d,H,N),d+=H,p+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Gn=class i extends Ce{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],u=e/2,h=Math.PI/2*t,p=e,d=2*h+p,g=n*2+r,v=s+1,m=new U,f=new U;for(let x=0;x<=g;x++){let _=0,y=0,w=0,T=0;if(x<=n){let N=x/n,C=N*Math.PI/2;y=-u-t*Math.cos(C),w=t*Math.sin(C),T=-t*Math.cos(C),_=N*h}else if(x<=n+r){let N=(x-n)/r;y=-u+N*e,w=t,T=0,_=h+N*p}else{let N=(x-n-r)/n,C=N*Math.PI/2;y=u+t*Math.sin(C),w=t*Math.cos(C),T=t*Math.sin(C),_=h+p+N*h}let M=Math.max(0,Math.min(1,_/d)),E=0;x===0?E=.5/s:x===g&&(E=-.5/s);for(let N=0;N<=s;N++){let C=N/s,L=C*Math.PI*2,b=Math.sin(L),R=Math.cos(L);f.x=-w*R,f.y=y,f.z=w*b,a.push(f.x,f.y,f.z),m.set(-w*R,T,w*b),m.normalize(),l.push(m.x,m.y,m.z),c.push(C+E,M)}if(x>0){let N=(x-1)*v;for(let C=0;C<s;C++){let L=N+C,b=N+C+1,R=x*v+C,S=x*v+C+1;o.push(L,b,R),o.push(b,S,R)}}}this.setIndex(o),this.setAttribute("position",new Xt(a,3)),this.setAttribute("normal",new Xt(l,3)),this.setAttribute("uv",new Xt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Pi=class i extends Ce{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new U,u=new ot;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,p=3;h<=e;h++,p+=3){let d=n+h/e*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[p]/t+1)/2,u.y=(o[p+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new Xt(o,3)),this.setAttribute("normal",new Xt(a,3)),this.setAttribute("uv",new Xt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},sn=class i extends Ce{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],p=[],d=[],g=0,v=[],m=n/2,f=0;x(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new Xt(h,3)),this.setAttribute("normal",new Xt(p,3)),this.setAttribute("uv",new Xt(d,2));function x(){let y=new U,w=new U,T=0,M=(e-t)/n;for(let E=0;E<=r;E++){let N=[],C=E/r,L=C*(e-t)+t;for(let b=0;b<=s;b++){let R=b/s,S=R*l+a,P=Math.sin(S),F=Math.cos(S);w.x=L*P,w.y=-C*n+m,w.z=L*F,h.push(w.x,w.y,w.z),y.set(P,M,F).normalize(),p.push(y.x,y.y,y.z),d.push(R,1-C),N.push(g++)}v.push(N)}for(let E=0;E<s;E++)for(let N=0;N<r;N++){let C=v[N][E],L=v[N+1][E],b=v[N+1][E+1],R=v[N][E+1];(t>0||N!==0)&&(u.push(C,L,R),T+=3),(e>0||N!==r-1)&&(u.push(L,b,R),T+=3)}c.addGroup(f,T,0),f+=T}function _(y){let w=g,T=new ot,M=new U,E=0,N=y===!0?t:e,C=y===!0?1:-1;for(let b=1;b<=s;b++)h.push(0,m*C,0),p.push(0,C,0),d.push(.5,.5),g++;let L=g;for(let b=0;b<=s;b++){let S=b/s*l+a,P=Math.cos(S),F=Math.sin(S);M.x=N*F,M.y=m*C,M.z=N*P,h.push(M.x,M.y,M.z),p.push(0,C,0),T.x=P*.5+.5,T.y=F*.5*C+.5,d.push(T.x,T.y),g++}for(let b=0;b<s;b++){let R=w+b,S=L+b;y===!0?u.push(S,S+1,R):u.push(S+1,S,R),E+=3}c.addGroup(f,E,y===!0?1:2),f+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ii=class i extends sn{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Sa=class i extends Ce{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),u(),this.setAttribute("position",new Xt(r,3)),this.setAttribute("normal",new Xt(r.slice(),3)),this.setAttribute("uv",new Xt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let _=new U,y=new U,w=new U;for(let T=0;T<e.length;T+=3)d(e[T+0],_),d(e[T+1],y),d(e[T+2],w),l(_,y,w,x)}function l(x,_,y,w){let T=w+1,M=[];for(let E=0;E<=T;E++){M[E]=[];let N=x.clone().lerp(y,E/T),C=_.clone().lerp(y,E/T),L=T-E;for(let b=0;b<=L;b++)b===0&&E===T?M[E][b]=N:M[E][b]=N.clone().lerp(C,b/L)}for(let E=0;E<T;E++)for(let N=0;N<2*(T-E)-1;N++){let C=Math.floor(N/2);N%2===0?(p(M[E][C+1]),p(M[E+1][C]),p(M[E][C])):(p(M[E][C+1]),p(M[E+1][C+1]),p(M[E+1][C]))}}function c(x){let _=new U;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(x),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function u(){let x=new U;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];let y=m(x)/2/Math.PI+.5,w=f(x)/Math.PI+.5;o.push(y,1-w)}g(),h()}function h(){for(let x=0;x<o.length;x+=6){let _=o[x+0],y=o[x+2],w=o[x+4],T=Math.max(_,y,w),M=Math.min(_,y,w);T>.9&&M<.1&&(_<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),w<.2&&(o[x+4]+=1))}}function p(x){r.push(x.x,x.y,x.z)}function d(x,_){let y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function g(){let x=new U,_=new U,y=new U,w=new U,T=new ot,M=new ot,E=new ot;for(let N=0,C=0;N<r.length;N+=9,C+=6){x.set(r[N+0],r[N+1],r[N+2]),_.set(r[N+3],r[N+4],r[N+5]),y.set(r[N+6],r[N+7],r[N+8]),T.set(o[C+0],o[C+1]),M.set(o[C+2],o[C+3]),E.set(o[C+4],o[C+5]),w.copy(x).add(_).add(y).divideScalar(3);let L=m(w);v(T,C+0,x,L),v(M,C+2,_,L),v(E,C+4,y,L)}}function v(x,_,y,w){w<0&&x.x===1&&(o[_]=x.x-1),y.x===0&&y.z===0&&(o[_]=w/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.detail)}};var On=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){oe("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let u=n[s],p=n[s+1]-u,d=(o-u)/p;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new ot:new U);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new U,s=[],r=[],o=[],a=new U,l=new Te;for(let d=0;d<=t;d++){let g=d/t;s[d]=this.getTangentAt(g,new U)}r[0]=new U,o[0]=new U;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),h=Math.abs(s[0].y),p=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),p<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(me(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(me(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}},sr=class extends On{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ot){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),p=l-this.aX,d=c-this.aY;l=p*u-d*h+this.aX,c=p*h+d*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ba=class extends sr{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function eh(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let p=(o-r)/c-(a-r)/(c+u)+(a-o)/u,d=(a-o)/u-(l-o)/(u+h)+(l-a)/h;p*=u,d*=u,s(o,a,p,d)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var jh=new U,Qh=new U,pc=new eh,mc=new eh,gc=new eh,Li=class extends On{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new U){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(Qh.subVectors(s[0],s[1]).add(s[0]),c=Qh);let h=s[a%r],p=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(jh.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=jh),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(h),d),v=Math.pow(h.distanceToSquared(p),d),m=Math.pow(p.distanceToSquared(u),d);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),pc.initNonuniformCatmullRom(c.x,h.x,p.x,u.x,g,v,m),mc.initNonuniformCatmullRom(c.y,h.y,p.y,u.y,g,v,m),gc.initNonuniformCatmullRom(c.z,h.z,p.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(pc.initCatmullRom(c.x,h.x,p.x,u.x,this.tension),mc.initCatmullRom(c.y,h.y,p.y,u.y,this.tension),gc.initCatmullRom(c.z,h.z,p.z,u.z,this.tension));return n.set(pc.calc(l),mc.calc(l),gc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function tu(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function t0(i,t){let e=1-i;return e*e*t}function e0(i,t){return 2*(1-i)*i*t}function n0(i,t){return i*i*t}function Nr(i,t,e,n){return t0(i,t)+e0(i,e)+n0(i,n)}function i0(i,t){let e=1-i;return e*e*e*t}function s0(i,t){let e=1-i;return 3*e*e*i*t}function r0(i,t){return 3*(1-i)*i*i*t}function o0(i,t){return i*i*i*t}function Ur(i,t,e,n,s){return i0(i,t)+s0(i,e)+r0(i,n)+o0(i,s)}var Kr=class extends On{constructor(t=new ot,e=new ot,n=new ot,s=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ot){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ur(t,s.x,r.x,o.x,a.x),Ur(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},wa=class extends On{constructor(t=new U,e=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new U){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ur(t,s.x,r.x,o.x,a.x),Ur(t,s.y,r.y,o.y,a.y),Ur(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},jr=class extends On{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ea=class extends On{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Qr=class extends On{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Nr(t,s.x,r.x,o.x),Nr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},to=class extends On{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Nr(t,s.x,r.x,o.x),Nr(t,s.y,r.y,o.y),Nr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},eo=class extends On{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(tu(a,l.x,c.x,u.x,h.x),tu(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new ot().fromArray(s))}return this}},Ta=Object.freeze({__proto__:null,ArcCurve:ba,CatmullRomCurve3:Li,CubicBezierCurve:Kr,CubicBezierCurve3:wa,EllipseCurve:sr,LineCurve:jr,LineCurve3:Ea,QuadraticBezierCurve:Qr,QuadraticBezierCurve3:to,SplineCurve:eo}),Ra=class extends On{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ta[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this.cacheLengths=null,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Ta[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},no=class extends Ra{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new jr(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Qr(this.currentPoint.clone(),new ot(t,e),new ot(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Kr(this.currentPoint.clone(),new ot(t,e),new ot(n,s),new ot(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new eo(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){let c=new sr(t,e,n,s,r,o,a,l);if(this.curves.length>0){let h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Wn=class extends no{constructor(t){super(t),this.uuid=ji(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new no().fromJSON(s))}return this}};function a0(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=td(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=d0(i,t,r,e)),i.length>80*e){a=i[0],l=i[1];let u=a,h=l;for(let p=e;p<s;p+=e){let d=i[p],g=i[p+1];d<a&&(a=d),g<l&&(l=g),d>u&&(u=d),g>h&&(h=g)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return io(r,o,e,a,l,c,0),o}function td(i,t,e,n,s){let r;if(s===b0(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=eu(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=eu(o/n|0,i[o],i[o+1],r);return r&&rr(r,r.next)&&(ro(r),r=r.next),r}function ms(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(rr(e,e.next)||Ye(e.prev,e,e.next)===0)){if(ro(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function io(i,t,e,n,s,r,o){if(!i)return;!o&&r&&x0(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?c0(i,n,s,r):l0(i)){t.push(l.i,i.i,c.i),ro(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=h0(ms(i),t),io(i,t,e,n,s,r,2)):o===2&&u0(i,t,e,n,s,r):io(ms(i),t,e,n,s,r,1);break}}}function l0(i){let t=i.prev,e=i,n=i.next;if(Ye(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=Math.min(s,r,o),h=Math.min(a,l,c),p=Math.max(s,r,o),d=Math.max(a,l,c),g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=p&&g.y>=h&&g.y<=d&&Dr(s,a,r,l,o,c,g.x,g.y)&&Ye(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function c0(i,t,e,n){let s=i.prev,r=i,o=i.next;if(Ye(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,p=o.y,d=Math.min(a,l,c),g=Math.min(u,h,p),v=Math.max(a,l,c),m=Math.max(u,h,p),f=Sc(d,g,t,e,n),x=Sc(v,m,t,e,n),_=i.prevZ,y=i.nextZ;for(;_&&_.z>=f&&y&&y.z<=x;){if(_.x>=d&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Dr(a,u,l,h,c,p,_.x,_.y)&&Ye(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Dr(a,u,l,h,c,p,y.x,y.y)&&Ye(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=f;){if(_.x>=d&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Dr(a,u,l,h,c,p,_.x,_.y)&&Ye(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=x;){if(y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Dr(a,u,l,h,c,p,y.x,y.y)&&Ye(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function h0(i,t){let e=i;do{let n=e.prev,s=e.next.next;!rr(n,s)&&nd(n,e,e.next,s)&&so(n,s)&&so(s,n)&&(t.push(n.i,e.i,s.i),ro(e),ro(e.next),e=i=s),e=e.next}while(e!==i);return ms(e)}function u0(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&y0(o,a)){let l=id(o,a);o=ms(o,o.next),l=ms(l,l.next),io(o,t,e,n,s,r,0),io(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function d0(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=td(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(_0(c))}s.sort(f0);for(let r=0;r<s.length;r++)e=p0(s[r],e);return e}function f0(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function p0(i,t){let e=m0(i,t);if(!e)return t;let n=id(e,i);return ms(n,n.next),ms(e,e.next)}function m0(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(rr(i,e))return e;do{if(rr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let h=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>r&&(r=h,o=e.x<e.next.x?e:e.next,h===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,u=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&ed(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let h=Math.abs(s-e.y)/(n-e.x);so(e,i)&&(h<u||h===u&&(e.x>o.x||e.x===o.x&&g0(o,e)))&&(o=e,u=h)}e=e.next}while(e!==a);return o}function g0(i,t){return Ye(i.prev,i,t.prev)<0&&Ye(t.next,i,i.next)<0}function x0(i,t,e,n){let s=i;do s.z===0&&(s.z=Sc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,v0(s)}function v0(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function Sc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function _0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function ed(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Dr(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&ed(i,t,e,n,s,r,o,a)}function y0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!M0(i,t)&&(so(i,t)&&so(t,i)&&S0(i,t)&&(Ye(i.prev,i,t.prev)||Ye(i,t.prev,t))||rr(i,t)&&Ye(i.prev,i,i.next)>0&&Ye(t.prev,t,t.next)>0)}function Ye(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function rr(i,t){return i.x===t.x&&i.y===t.y}function nd(i,t,e,n){let s=ea(Ye(i,t,e)),r=ea(Ye(i,t,n)),o=ea(Ye(e,n,i)),a=ea(Ye(e,n,t));return!!(s!==r&&o!==a||s===0&&ta(i,e,t)||r===0&&ta(i,n,t)||o===0&&ta(e,i,n)||a===0&&ta(e,t,n))}function ta(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ea(i){return i>0?1:i<0?-1:0}function M0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&nd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function so(i,t){return Ye(i.prev,i,i.next)<0?Ye(i,t,i.next)>=0&&Ye(i,i.prev,t)>=0:Ye(i,t,i.prev)<0||Ye(i,i.next,t)<0}function S0(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function id(i,t){let e=bc(i.i,i.x,i.y),n=bc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function eu(i,t,e,n){let s=bc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ro(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function bc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function b0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var wc=class{static triangulate(t,e,n=2){return a0(t,e,n)}},li=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];nu(t),iu(n,t);let o=t.length;e.forEach(nu);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,iu(n,e[l]);let a=wc.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function nu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function iu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var gs=class i extends Ce{constructor(t=new Wn([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new Xt(s,3)),this.setAttribute("uv",new Xt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1,p=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,f=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:w0,_,y=!1,w,T,M,E;if(f){_=f.getSpacedPoints(u),y=!0,p=!1;let j=f.isCatmullRomCurve3?f.closed:!1;w=f.computeFrenetFrames(u,j),T=new U,M=new U,E=new U}p||(m=0,d=0,g=0,v=0);let N=a.extractPoints(c),C=N.shape,L=N.holes;if(!li.isClockWise(C)){C=C.reverse();for(let j=0,ft=L.length;j<ft;j++){let $=L[j];li.isClockWise($)&&(L[j]=$.reverse())}}function R(j){let $=10000000000000001e-36,et=j[0];for(let lt=1;lt<=j.length;lt++){let Ut=lt%j.length,wt=j[Ut],Zt=wt.x-et.x,Kt=wt.y-et.y,se=Zt*Zt+Kt*Kt,X=Math.max(Math.abs(wt.x),Math.abs(wt.y),Math.abs(et.x),Math.abs(et.y)),fe=$*X*X;if(se<=fe){j.splice(Ut,1),lt--;continue}et=wt}}R(C),L.forEach(R);let S=L.length,P=C;for(let j=0;j<S;j++){let ft=L[j];C=C.concat(ft)}function F(j,ft,$){return ft||re("ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(ft,$)}let D=C.length;function H(j,ft,$){let et,lt,Ut,wt=j.x-ft.x,Zt=j.y-ft.y,Kt=$.x-j.x,se=$.y-j.y,X=wt*wt+Zt*Zt,fe=wt*se-Zt*Kt;if(Math.abs(fe)>Number.EPSILON){let ee=Math.sqrt(X),qt=Math.sqrt(Kt*Kt+se*se),xt=ft.x-Zt/ee,Ue=ft.y+wt/ee,$t=$.x-se/qt,Qt=$.y+Kt/qt,O=(($t-xt)*se-(Qt-Ue)*Kt)/(wt*se-Zt*Kt);et=xt+wt*O-j.x,lt=Ue+Zt*O-j.y;let A=et*et+lt*lt;if(A<=2)return new ot(et,lt);Ut=Math.sqrt(A/2)}else{let ee=!1;wt>Number.EPSILON?Kt>Number.EPSILON&&(ee=!0):wt<-Number.EPSILON?Kt<-Number.EPSILON&&(ee=!0):Math.sign(Zt)===Math.sign(se)&&(ee=!0),ee?(et=-Zt,lt=wt,Ut=Math.sqrt(X)):(et=wt,lt=Zt,Ut=Math.sqrt(X/2))}return new ot(et/Ut,lt/Ut)}let B=[];for(let j=0,ft=P.length,$=ft-1,et=j+1;j<ft;j++,$++,et++)$===ft&&($=0),et===ft&&(et=0),B[j]=H(P[j],P[$],P[et]);let z=[],Z,W=B.concat();for(let j=0,ft=S;j<ft;j++){let $=L[j];Z=[];for(let et=0,lt=$.length,Ut=lt-1,wt=et+1;et<lt;et++,Ut++,wt++)Ut===lt&&(Ut=0),wt===lt&&(wt=0),Z[et]=H($[et],$[Ut],$[wt]);z.push(Z),W=W.concat(Z)}let tt;if(m===0)tt=li.triangulateShape(P,L);else{let j=[],ft=[];for(let $=0;$<m;$++){let et=$/m,lt=d*Math.cos(et*Math.PI/2),Ut=g*Math.sin(et*Math.PI/2)+v;for(let wt=0,Zt=P.length;wt<Zt;wt++){let Kt=F(P[wt],B[wt],Ut);Pt(Kt.x,Kt.y,-lt),et===0&&j.push(Kt)}for(let wt=0,Zt=S;wt<Zt;wt++){let Kt=L[wt];Z=z[wt];let se=[];for(let X=0,fe=Kt.length;X<fe;X++){let ee=F(Kt[X],Z[X],Ut);Pt(ee.x,ee.y,-lt),et===0&&se.push(ee)}et===0&&ft.push(se)}}tt=li.triangulateShape(j,ft)}let k=tt.length,ut=g+v;for(let j=0;j<D;j++){let ft=p?F(C[j],W[j],ut):C[j];y?(M.copy(w.normals[0]).multiplyScalar(ft.x),T.copy(w.binormals[0]).multiplyScalar(ft.y),E.copy(_[0]).add(M).add(T),Pt(E.x,E.y,E.z)):Pt(ft.x,ft.y,0)}for(let j=1;j<=u;j++)for(let ft=0;ft<D;ft++){let $=p?F(C[ft],W[ft],ut):C[ft];y?(M.copy(w.normals[j]).multiplyScalar($.x),T.copy(w.binormals[j]).multiplyScalar($.y),E.copy(_[j]).add(M).add(T),Pt(E.x,E.y,E.z)):Pt($.x,$.y,h/u*j)}for(let j=m-1;j>=0;j--){let ft=j/m,$=d*Math.cos(ft*Math.PI/2),et=g*Math.sin(ft*Math.PI/2)+v;for(let lt=0,Ut=P.length;lt<Ut;lt++){let wt=F(P[lt],B[lt],et);Pt(wt.x,wt.y,h+$)}for(let lt=0,Ut=L.length;lt<Ut;lt++){let wt=L[lt];Z=z[lt];for(let Zt=0,Kt=wt.length;Zt<Kt;Zt++){let se=F(wt[Zt],Z[Zt],et);y?Pt(se.x,se.y+_[u-1].y,_[u-1].x+$):Pt(se.x,se.y,h+$)}}}pt(),Tt();function pt(){let j=s.length/3;if(p){let ft=0,$=D*ft;for(let et=0;et<k;et++){let lt=tt[et];te(lt[2]+$,lt[1]+$,lt[0]+$)}ft=u+m*2,$=D*ft;for(let et=0;et<k;et++){let lt=tt[et];te(lt[0]+$,lt[1]+$,lt[2]+$)}}else{for(let ft=0;ft<k;ft++){let $=tt[ft];te($[2],$[1],$[0])}for(let ft=0;ft<k;ft++){let $=tt[ft];te($[0]+D*u,$[1]+D*u,$[2]+D*u)}}n.addGroup(j,s.length/3-j,0)}function Tt(){let j=s.length/3,ft=0;dt(P,ft),ft+=P.length;for(let $=0,et=L.length;$<et;$++){let lt=L[$];dt(lt,ft),ft+=lt.length}n.addGroup(j,s.length/3-j,1)}function dt(j,ft){let $=j.length;for(;--$>=0;){let et=$,lt=$-1;lt<0&&(lt=j.length-1);for(let Ut=0,wt=u+m*2;Ut<wt;Ut++){let Zt=D*Ut,Kt=D*(Ut+1),se=ft+et+Zt,X=ft+lt+Zt,fe=ft+lt+Kt,ee=ft+et+Kt;Rt(se,X,fe,ee)}}}function Pt(j,ft,$){l.push(j),l.push(ft),l.push($)}function te(j,ft,$){Ht(j),Ht(ft),Ht($);let et=s.length/3,lt=x.generateTopUV(n,s,et-3,et-2,et-1);gt(lt[0]),gt(lt[1]),gt(lt[2])}function Rt(j,ft,$,et){Ht(j),Ht(ft),Ht(et),Ht(ft),Ht($),Ht(et);let lt=s.length/3,Ut=x.generateSideWallUV(n,s,lt-6,lt-3,lt-2,lt-1);gt(Ut[0]),gt(Ut[1]),gt(Ut[3]),gt(Ut[1]),gt(Ut[2]),gt(Ut[3])}function Ht(j){s.push(l[j*3+0]),s.push(l[j*3+1]),s.push(l[j*3+2])}function gt(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return E0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ta[s.type]().fromJSON(s)),new i(n,t.options)}},w0={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],u=t[s*3+1];return[new ot(r,o),new ot(a,l),new ot(c,u)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],u=t[n*3+1],h=t[n*3+2],p=t[s*3],d=t[s*3+1],g=t[s*3+2],v=t[r*3],m=t[r*3+1],f=t[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new ot(o,1-l),new ot(c,1-h),new ot(p,1-g),new ot(v,1-f)]:[new ot(a,1-l),new ot(u,1-h),new ot(d,1-g),new ot(m,1-f)]}};function E0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var oo=class i extends Sa{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}},xs=class i extends Ce{constructor(t=[new ot(0,-.5),new ot(.5,0),new ot(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=me(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],u=1/e,h=new U,p=new ot,d=new U,g=new U,v=new U,m=0,f=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,f=t[x+1].y-t[x].y,d.x=f*1,d.y=-m,d.z=f*0,v.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:v.normalize(),l.push(v.x,v.y,v.z);break;default:m=t[x+1].x-t[x].x,f=t[x+1].y-t[x].y,d.x=f*1,d.y=-m,d.z=f*0,g.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),l.push(d.x,d.y,d.z),v.copy(g)}for(let x=0;x<=e;x++){let _=n+x*u*s,y=Math.sin(_),w=Math.cos(_);for(let T=0;T<=t.length-1;T++){h.x=t[T].x*y,h.y=t[T].y,h.z=t[T].x*w,o.push(h.x,h.y,h.z),p.x=x/e,p.y=T/(t.length-1),a.push(p.x,p.y);let M=l[3*T+0]*y,E=l[3*T+1],N=l[3*T+0]*w;c.push(M,E,N)}}for(let x=0;x<e;x++)for(let _=0;_<t.length-1;_++){let y=_+x*t.length,w=y,T=y+t.length,M=y+t.length+1,E=y+1;r.push(w,T,E),r.push(M,E,T)}this.setIndex(r),this.setAttribute("position",new Xt(o,3)),this.setAttribute("uv",new Xt(a,2)),this.setAttribute("normal",new Xt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var He=class i extends Ce{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=t/a,p=e/l,d=[],g=[],v=[],m=[];for(let f=0;f<u;f++){let x=f*p-o;for(let _=0;_<c;_++){let y=_*h-r;g.push(y,-x,0),v.push(0,0,1),m.push(_/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let x=0;x<a;x++){let _=x+c*f,y=x+c*(f+1),w=x+1+c*(f+1),T=x+1+c*f;d.push(_,y,T),d.push(y,w,T)}this.setIndex(d),this.setAttribute("position",new Xt(g,3)),this.setAttribute("normal",new Xt(v,3)),this.setAttribute("uv",new Xt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var or=class i extends Ce{constructor(t=new Wn([new ot(0,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let u=0;u<t.length;u++)c(t[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Xt(s,3)),this.setAttribute("normal",new Xt(r,3)),this.setAttribute("uv",new Xt(o,2));function c(u){let h=s.length/3,p=u.extractPoints(e),d=p.shape,g=p.holes;li.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,f=g.length;m<f;m++){let x=g[m];li.isClockWise(x)===!0&&(g[m]=x.reverse())}let v=li.triangulateShape(d,g);for(let m=0,f=g.length;m<f;m++){let x=g[m];d=d.concat(x)}for(let m=0,f=d.length;m<f;m++){let x=d[m];s.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let m=0,f=v.length;m<f;m++){let x=v[m],_=x[0]+h,y=x[1]+h,w=x[2]+h;n.push(_,y,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return T0(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let o=e[t.shapes[s]];n.push(o)}return new i(n,t.curveSegments)}};function T0(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var ne=class i extends Ce{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],h=new U,p=new U,d=[],g=[],v=[],m=[];for(let f=0;f<=n;f++){let x=[],_=f/n,y=o+_*a,w=t*Math.cos(y),T=Math.sqrt(t*t-w*w),M=0;f===0&&o===0?M=.5/e:f===n&&l===Math.PI&&(M=-.5/e);for(let E=0;E<=e;E++){let N=E/e,C=s+N*r;h.x=-T*Math.cos(C),h.y=w,h.z=T*Math.sin(C),g.push(h.x,h.y,h.z),p.copy(h).normalize(),v.push(p.x,p.y,p.z),m.push(N+M,1-_),x.push(c++)}u.push(x)}for(let f=0;f<n;f++)for(let x=0;x<e;x++){let _=u[f][x+1],y=u[f][x],w=u[f+1][x],T=u[f+1][x+1];(f!==0||o>0)&&d.push(_,y,T),(f!==n-1||l<Math.PI)&&d.push(y,w,T)}this.setIndex(d),this.setAttribute("position",new Xt(g,3)),this.setAttribute("normal",new Xt(v,3)),this.setAttribute("uv",new Xt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Je=class i extends Ce{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],u=[],h=[],p=new U,d=new U,g=new U;for(let v=0;v<=n;v++){let m=o+v/n*a;for(let f=0;f<=s;f++){let x=f/s*r;d.x=(t+e*Math.cos(m))*Math.cos(x),d.y=(t+e*Math.cos(m))*Math.sin(x),d.z=e*Math.sin(m),c.push(d.x,d.y,d.z),p.x=t*Math.cos(x),p.y=t*Math.sin(x),g.subVectors(d,p).normalize(),u.push(g.x,g.y,g.z),h.push(f/s),h.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=s;m++){let f=(s+1)*v+m-1,x=(s+1)*(v-1)+m-1,_=(s+1)*(v-1)+m,y=(s+1)*v+m;l.push(f,x,y),l.push(x,_,y)}this.setIndex(l),this.setAttribute("position",new Xt(c,3)),this.setAttribute("normal",new Xt(u,3)),this.setAttribute("uv",new Xt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var Xi=class i extends Ce{constructor(t=new to(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new U,l=new U,c=new ot,u=new U,h=[],p=[],d=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Xt(h,3)),this.setAttribute("normal",new Xt(p,3)),this.setAttribute("uv",new Xt(d,2));function v(){for(let _=0;_<e;_++)m(_);m(r===!1?e:0),x(),f()}function m(_){u=t.getPointAt(_/e,u);let y=o.normals[_],w=o.binormals[_];for(let T=0;T<=s;T++){let M=T/s*Math.PI*2,E=Math.sin(M),N=-Math.cos(M);l.x=N*y.x+E*w.x,l.y=N*y.y+E*w.y,l.z=N*y.z+E*w.z,l.normalize(),p.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function f(){for(let _=1;_<=e;_++)for(let y=1;y<=s;y++){let w=(s+1)*(_-1)+(y-1),T=(s+1)*_+(y-1),M=(s+1)*_+y,E=(s+1)*(_-1)+y;g.push(w,T,E),g.push(T,M,E)}}function x(){for(let _=0;_<=e;_++)for(let y=0;y<=s;y++)c.x=_/e,c.y=y/s,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Ta[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function Ts(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(su(s))s.isRenderTargetTexture?(oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(su(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function wn(i){let t={};for(let e=0;e<i.length;e++){let n=Ts(i[e]);for(let s in n)t[s]=n[s]}return t}function su(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function R0(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function nh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ye.workingColorSpace}var sd={clone:Ts,merge:wn},A0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,C0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,gn=class extends Ti{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=A0,this.fragmentShader=C0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ts(t.uniforms),this.uniformsGroups=R0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Bt().setHex(s.value);break;case"v2":this.uniforms[n].value=new ot().fromArray(s.value);break;case"v3":this.uniforms[n].value=new U().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Xe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new ce().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Te().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Aa=class extends gn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Se=class extends Ti{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cl,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new De,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ge=class extends Se{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return me(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Bt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Bt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Bt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return ds('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){ds('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Ca=class extends Ti{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ou,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Pa=class extends Ti{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ys(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function na(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var qi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ia=class extends qi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_c,endingEnd:_c}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case yc:r=t,a=2*e-n;break;case Mc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case yc:o=t,l=2*n-e;break;case Mc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,u=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,p=this._weightPrev,d=this._weightNext,g=(n-e)/(s-e),v=g*g,m=v*g,f=-p*m+2*p*v-p*g,x=(1+p)*m+(-1.5-2*p)*v+(-.5+p)*g+1,_=(-1-d)*m+(1.5+d)*v+.5*g,y=d*m-d*v;for(let w=0;w!==a;++w)r[w]=f*o[u+w]+x*o[c+w]+_*o[l+w]+y*o[h+w];return r}},La=class extends qi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=(n-e)/(s-e),h=1-u;for(let p=0;p!==a;++p)r[p]=o[c+p]*h+o[l+p]*u;return r}},Da=class extends qi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Na=class extends qi{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let g=(n-e)/(s-e),v=1-g;for(let m=0;m!==a;++m)r[m]=o[c+m]*v+o[l+m]*g;return r}let p=a*2,d=t-1;for(let g=0;g!==a;++g){let v=o[c+g],m=o[l+g],f=d*p+g*2,x=h[f],_=h[f+1],y=t*p+g*2,w=u[y],T=u[y+1],M=I0(n,e,x,w,s);r[g]=rd(M,v,_,T,m)}return r}};function rd(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function P0(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function I0(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=rd(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=P0(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Bn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ys(e,this.TimeBufferType),this.values=Ys(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ys(t.times,Array),values:Ys(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),na(t.settings)&&(n.settings={inTangents:Ys(t.settings.inTangents,Array),outTangents:Ys(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Da(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new La(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ia(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Na(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Fr:e=this.InterpolantFactoryMethodDiscrete;break;case ma:e=this.InterpolantFactoryMethodLinear;break;case ra:e=this.InterpolantFactoryMethodSmooth;break;case vc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return oe("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Fr;case this.InterpolantFactoryMethodLinear:return ma;case this.InterpolantFactoryMethodSmooth:return ra;case this.InterpolantFactoryMethodBezier:return vc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t;na(this.settings)&&(ru(this.settings.inTangents,t),ru(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;na(this.settings)&&(ou(this.settings.inTangents,t),ou(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(re("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(re("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){re("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){re("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Df(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){re("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ra,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],u=t[a+1];if(c!==u&&(a!==1||c!==t[0]))if(s)l=!0;else{let h=a*n,p=h-n,d=h+n;for(let g=0;g!==n;++g){let v=e[h+g];if(v!==e[p+g]||v!==e[d+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let h=a*n,p=o*n;for(let d=0;d!==n;++d)e[p+d]=e[h+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,na(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function ru(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]+=t}function ou(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Bn.prototype.ValueTypeName="";Bn.prototype.TimeBufferType=Float32Array;Bn.prototype.ValueBufferType=Float32Array;Bn.prototype.DefaultInterpolation=ma;var Yi=class extends Bn{constructor(t,e,n){super(t,e,n)}};Yi.prototype.ValueTypeName="bool";Yi.prototype.ValueBufferType=Array;Yi.prototype.DefaultInterpolation=Fr;Yi.prototype.InterpolantFactoryMethodLinear=void 0;Yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ua=class extends Bn{constructor(t,e,n,s){super(t,e,n,s)}};Ua.prototype.ValueTypeName="color";var Fa=class extends Bn{constructor(t,e,n,s){super(t,e,n,s)}};Fa.prototype.ValueTypeName="number";var Oa=class extends qi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let u=c+a;c!==u;c+=4)dn.slerpFlat(r,0,o,c-a,o,c,l);return r}},ao=class extends Bn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Oa(this.times,this.values,this.getValueSize(),t)}};ao.prototype.ValueTypeName="quaternion";ao.prototype.InterpolantFactoryMethodSmooth=void 0;var Zi=class extends Bn{constructor(t,e,n){super(t,e,n)}};Zi.prototype.ValueTypeName="string";Zi.prototype.ValueBufferType=Array;Zi.prototype.DefaultInterpolation=Fr;Zi.prototype.InterpolantFactoryMethodLinear=void 0;Zi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ba=class extends Bn{constructor(t,e,n,s){super(t,e,n,s)}};Ba.prototype.ValueTypeName="vector";var Ha=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,p=c.length;h<p;h+=2){let d=c[h],g=c[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},od=new Ha,ka=class{constructor(t){this.manager=t!==void 0?t:od,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};ka.DEFAULT_MATERIAL_NAME="__DEFAULT";var ar=class extends nn{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},lr=class extends ar{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},xc=new Te,au=new U,lu=new U,lo=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=Cn,this.map=null,this.mapPass=null,this.matrix=new Te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wi,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new Xe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;au.setFromMatrixPosition(t.matrixWorld),e.position.copy(au),lu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lu),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){xc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(xc,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Qs||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(xc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},ia=new U,sa=new dn,oi=new U,co=class extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Te,this.projectionMatrix=new Te,this.projectionMatrixInverse=new Te,this.coordinateSystem=Vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(ia,sa,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,oi.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(ia,sa,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,oi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Gi=new U,cu=new ot,hu=new ot,bn=class extends co{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ga*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ql*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ga*2*Math.atan(Math.tan(ql*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Gi.x,Gi.y).multiplyScalar(-t/Gi.z),Gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Gi.x,Gi.y).multiplyScalar(-t/Gi.z)}getViewSize(t,e){return this.getViewBounds(t,cu,hu),e.subVectors(hu,cu)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ql*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Ec=class extends lo{constructor(){super(new bn(90,1,.5,500)),this.isPointLightShadow=!0}},vs=class extends ar{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Ec}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},_s=class extends co{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Tc=class extends lo{constructor(){super(new _s(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ys=class extends ar{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new Tc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var ho=class extends Ce{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Zs=-90,Js=1,cr=class extends nn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new bn(Zs,Js,t,e);s.layers=this.layers,this.add(s);let r=new bn(Zs,Js,t,e);r.layers=this.layers,this.add(r);let o=new bn(Zs,Js,t,e);o.layers=this.layers,this.add(o);let a=new bn(Zs,Js,t,e);a.layers=this.layers,this.add(a);let l=new bn(Zs,Js,t,e);l.layers=this.layers,this.add(l);let c=new bn(Zs,Js,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Qs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=v,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(h,p,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},za=class extends bn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}};var ih="\\[\\]\\.:\\/",L0=new RegExp("["+ih+"]","g"),sh="[^"+ih+"]",D0="[^"+ih.replace("\\.","")+"]",N0=/((?:WC+[\/:])*)/.source.replace("WC",sh),U0=/(WCOD+)?/.source.replace("WCOD",D0),F0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sh),O0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sh),B0=new RegExp("^"+N0+U0+F0+O0+"$"),H0=["material","materials","bones","map"],Rc=class{constructor(t,e,n){let s=n||Ve.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Ve=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(L0,"")}static parseTrackName(t){let e=B0.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);H0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){oe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){re("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){re("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){re("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){re("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){re("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){re("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){re("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;re("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){re("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){re("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ve.Composite=Rc;Ve.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ve.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ve.prototype.GetterByBindingType=[Ve.prototype._getValue_direct,Ve.prototype._getValue_array,Ve.prototype._getValue_arrayElement,Ve.prototype._getValue_toArray];Ve.prototype.SetterByBindingTypeAndVersioning=[[Ve.prototype._setValue_direct,Ve.prototype._setValue_direct_setNeedsUpdate,Ve.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ve.prototype._setValue_array,Ve.prototype._setValue_array_setNeedsUpdate,Ve.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ve.prototype._setValue_arrayElement,Ve.prototype._setValue_arrayElement_setNeedsUpdate,Ve.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ve.prototype._setValue_fromArray,Ve.prototype._setValue_fromArray_setNeedsUpdate,Ve.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var $v=new Float32Array(1);var uu=new Te,uo=class{constructor(t,e,n=0,s=1/0){this.ray=new Xr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new nr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):re("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return uu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(uu),this}intersectObject(t,e=!0,n=[]){return Ac(t,this,n,e),n.sort(du),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Ac(t[s],this,n,e);return n.sort(du),n}};function du(i,t){return i.distance-t.distance}function Ac(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Ac(r[o],t,e,!0)}}var hh=class hh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};hh.prototype.isMatrix2=!0;var Cc=hh;function rh(i,t,e,n){let s=k0(n);switch(e){case Yc:return i*t;case Ja:return i*t/s.components*s.byteLength;case $a:return i*t/s.components*s.byteLength;case Ki:return i*t*2/s.components*s.byteLength;case Ka:return i*t*2/s.components*s.byteLength;case Zc:return i*t*3/s.components*s.byteLength;case Hn:return i*t*4/s.components*s.byteLength;case ja:return i*t*4/s.components*s.byteLength;case mo:case go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xo:case vo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case tl:case nl:return Math.max(i,16)*Math.max(t,8)/4;case Qa:case el:return Math.max(i,8)*Math.max(t,8)/2;case il:case sl:case ol:case al:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case rl:case _o:case ll:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case cl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case hl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ul:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case dl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case fl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case pl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ml:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case gl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case xl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case vl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case _l:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case yl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ml:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Sl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case bl:case wl:case El:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Tl:case Rl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case yo:case Al:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function k0(i){switch(i){case Cn:case Gc:return{byteLength:1,components:1};case dr:case Wc:case Pn:return{byteLength:2,components:1};case Ya:case Za:return{byteLength:2,components:4};case ni:case qa:case Xn:return{byteLength:4,components:1};case Xc:case qc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Ad(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function V0(i){let t=new WeakMap;function e(a,l){let c=a.array,u=a.usage,h=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((d,g)=>d.start-g.start);let p=0;for(let d=1;d<h.length;d++){let g=h[p],v=h[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++p,h[p]=v)}h.length=p+1;for(let d=0,g=h.length;d<g;d++){let v=h[d];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var G0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,W0=`#ifdef USE_ALPHAHASH
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
#endif`,X0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,q0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Y0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Z0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,J0=`#ifdef USE_AOMAP
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
#endif`,$0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,K0=`#ifdef USE_BATCHING
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
#endif`,j0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Q0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ep=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,np=`#ifdef USE_IRIDESCENCE
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
#endif`,ip=`#ifdef USE_BUMPMAP
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
#endif`,sp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,rp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ap=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,cp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,up=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,dp=`#define PI 3.141592653589793
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
} // validated`,fp=`vec3 transformedNormal = objectNormal;
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
#endif`,pp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vp="gl_FragColor = linearToOutputTexel( gl_FragColor );",_p=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yp=`#ifdef USE_ENVMAP
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
#endif`,Mp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Sp=`#ifdef USE_ENVMAP
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
#endif`,bp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
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
#endif`,Ep=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Tp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ap=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cp=`#ifdef USE_GRADIENTMAP
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
}`,Pp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ip=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dp=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Np=`#ifdef USE_ENVMAP
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
#endif`,Up=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Op=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Hp=`PhysicalMaterial material;
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
#endif`,kp=`uniform sampler2D dfgLUT;
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
}`,zp=`
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
#endif`,Vp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Gp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wp=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,Xp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$p=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,jp=`#if defined( USE_POINTS_UV )
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
#endif`,Qp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,em=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nm=`#if defined( USE_MORPHCOLORS )
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
#endif`,im=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sm=`#ifdef USE_MORPHTARGETS
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
#endif`,rm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,om=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,am=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,um=`#ifdef USE_NORMALMAP
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
#endif`,dm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,vm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_m=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ym=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Em=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Tm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Rm=`float getShadowMask() {
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
}`,Am=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cm=`#ifdef USE_SKINNING
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
#endif`,Pm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Im=`#ifdef USE_SKINNING
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
#endif`,Lm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Um=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fm=`#ifdef USE_TRANSMISSION
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
#endif`,Om=`#ifdef USE_TRANSMISSION
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
#endif`,Bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Vm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gm=`uniform sampler2D t2D;
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
}`,Wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xm=`uniform float backgroundBlurriness;
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
}`,qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ym=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zm=`#include <common>
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
}`,Jm=`#if DEPTH_PACKING == 3200
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
}`,$m=`#define DISTANCE
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
}`,Km=`#define DISTANCE
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
}`,jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tg=`uniform float scale;
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
}`,eg=`uniform vec3 diffuse;
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
}`,ng=`#include <common>
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
}`,ig=`uniform vec3 diffuse;
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
}`,sg=`#define LAMBERT
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
}`,rg=`#define LAMBERT
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
}`,og=`#define MATCAP
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
}`,ag=`#define MATCAP
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
}`,lg=`#define NORMAL
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
}`,cg=`#define NORMAL
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
}`,hg=`#define PHONG
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
}`,ug=`#define PHONG
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
}`,dg=`#define STANDARD
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
}`,fg=`#define STANDARD
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
}`,pg=`#define TOON
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
}`,mg=`#define TOON
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
}`,gg=`uniform float size;
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
}`,xg=`uniform vec3 diffuse;
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
}`,vg=`#include <common>
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
}`,_g=`uniform vec3 color;
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
}`,yg=`uniform float rotation;
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
}`,Mg=`uniform vec3 diffuse;
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
}`,pe={alphahash_fragment:G0,alphahash_pars_fragment:W0,alphamap_fragment:X0,alphamap_pars_fragment:q0,alphatest_fragment:Y0,alphatest_pars_fragment:Z0,aomap_fragment:J0,aomap_pars_fragment:$0,batching_pars_vertex:K0,batching_vertex:j0,begin_vertex:Q0,beginnormal_vertex:tp,bsdfs:ep,iridescence_fragment:np,bumpmap_pars_fragment:ip,clipping_planes_fragment:sp,clipping_planes_pars_fragment:rp,clipping_planes_pars_vertex:op,clipping_planes_vertex:ap,color_fragment:lp,color_pars_fragment:cp,color_pars_vertex:hp,color_vertex:up,common:dp,defaultnormal_vertex:fp,displacementmap_pars_vertex:pp,displacementmap_vertex:mp,emissivemap_fragment:gp,emissivemap_pars_fragment:xp,colorspace_fragment:vp,colorspace_pars_fragment:_p,envmap_fragment:yp,envmap_common_pars_fragment:Mp,envmap_pars_fragment:Sp,envmap_pars_vertex:bp,envmap_physical_pars_fragment:Np,envmap_vertex:wp,fog_vertex:Ep,fog_pars_vertex:Tp,fog_fragment:Rp,fog_pars_fragment:Ap,gradientmap_pars_fragment:Cp,lightmap_pars_fragment:Pp,lights_lambert_fragment:Ip,lights_lambert_pars_fragment:Lp,lights_pars_begin:Dp,lights_toon_fragment:Up,lights_toon_pars_fragment:Fp,lights_phong_fragment:Op,lights_phong_pars_fragment:Bp,lights_physical_fragment:Hp,lights_physical_pars_fragment:kp,lights_fragment_begin:zp,lights_fragment_maps:Vp,lights_fragment_end:Gp,lightprobes_pars_fragment:Wp,logdepthbuf_fragment:Xp,logdepthbuf_pars_fragment:qp,logdepthbuf_pars_vertex:Yp,logdepthbuf_vertex:Zp,map_fragment:Jp,map_pars_fragment:$p,map_particle_fragment:Kp,map_particle_pars_fragment:jp,metalnessmap_fragment:Qp,metalnessmap_pars_fragment:tm,morphinstance_vertex:em,morphcolor_vertex:nm,morphnormal_vertex:im,morphtarget_pars_vertex:sm,morphtarget_vertex:rm,normal_fragment_begin:om,normal_fragment_maps:am,normal_pars_fragment:lm,normal_pars_vertex:cm,normal_vertex:hm,normalmap_pars_fragment:um,clearcoat_normal_fragment_begin:dm,clearcoat_normal_fragment_maps:fm,clearcoat_pars_fragment:pm,iridescence_pars_fragment:mm,opaque_fragment:gm,packing:xm,premultiplied_alpha_fragment:vm,project_vertex:_m,dithering_fragment:ym,dithering_pars_fragment:Mm,roughnessmap_fragment:Sm,roughnessmap_pars_fragment:bm,shadowmap_pars_fragment:wm,shadowmap_pars_vertex:Em,shadowmap_vertex:Tm,shadowmask_pars_fragment:Rm,skinbase_vertex:Am,skinning_pars_vertex:Cm,skinning_vertex:Pm,skinnormal_vertex:Im,specularmap_fragment:Lm,specularmap_pars_fragment:Dm,tonemapping_fragment:Nm,tonemapping_pars_fragment:Um,transmission_fragment:Fm,transmission_pars_fragment:Om,uv_pars_fragment:Bm,uv_pars_vertex:Hm,uv_vertex:km,worldpos_vertex:zm,background_vert:Vm,background_frag:Gm,backgroundCube_vert:Wm,backgroundCube_frag:Xm,cube_vert:qm,cube_frag:Ym,depth_vert:Zm,depth_frag:Jm,distance_vert:$m,distance_frag:Km,equirect_vert:jm,equirect_frag:Qm,linedashed_vert:tg,linedashed_frag:eg,meshbasic_vert:ng,meshbasic_frag:ig,meshlambert_vert:sg,meshlambert_frag:rg,meshmatcap_vert:og,meshmatcap_frag:ag,meshnormal_vert:lg,meshnormal_frag:cg,meshphong_vert:hg,meshphong_frag:ug,meshphysical_vert:dg,meshphysical_frag:fg,meshtoon_vert:pg,meshtoon_frag:mg,points_vert:gg,points_frag:xg,shadow_vert:vg,shadow_frag:_g,sprite_vert:yg,sprite_frag:Mg},Nt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ce},alphaMap:{value:null},alphaMapTransform:{value:new ce},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ce}},envmap:{envMap:{value:null},envMapRotation:{value:new ce},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ce}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ce}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ce},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ce},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ce},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ce}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ce}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ce}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ce},alphaTest:{value:0},uvTransform:{value:new ce}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ce},alphaMap:{value:null},alphaMapTransform:{value:new ce},alphaTest:{value:0}}},mi={basic:{uniforms:wn([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.fog]),vertexShader:pe.meshbasic_vert,fragmentShader:pe.meshbasic_frag},lambert:{uniforms:wn([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new Bt(0)},envMapIntensity:{value:1}}]),vertexShader:pe.meshlambert_vert,fragmentShader:pe.meshlambert_frag},phong:{uniforms:wn([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:pe.meshphong_vert,fragmentShader:pe.meshphong_frag},standard:{uniforms:wn([Nt.common,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.roughnessmap,Nt.metalnessmap,Nt.fog,Nt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag},toon:{uniforms:wn([Nt.common,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.gradientmap,Nt.fog,Nt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:pe.meshtoon_vert,fragmentShader:pe.meshtoon_frag},matcap:{uniforms:wn([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,{matcap:{value:null}}]),vertexShader:pe.meshmatcap_vert,fragmentShader:pe.meshmatcap_frag},points:{uniforms:wn([Nt.points,Nt.fog]),vertexShader:pe.points_vert,fragmentShader:pe.points_frag},dashed:{uniforms:wn([Nt.common,Nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pe.linedashed_vert,fragmentShader:pe.linedashed_frag},depth:{uniforms:wn([Nt.common,Nt.displacementmap]),vertexShader:pe.depth_vert,fragmentShader:pe.depth_frag},normal:{uniforms:wn([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,{opacity:{value:1}}]),vertexShader:pe.meshnormal_vert,fragmentShader:pe.meshnormal_frag},sprite:{uniforms:wn([Nt.sprite,Nt.fog]),vertexShader:pe.sprite_vert,fragmentShader:pe.sprite_frag},background:{uniforms:{uvTransform:{value:new ce},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pe.background_vert,fragmentShader:pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ce}},vertexShader:pe.backgroundCube_vert,fragmentShader:pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pe.cube_vert,fragmentShader:pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pe.equirect_vert,fragmentShader:pe.equirect_frag},distance:{uniforms:wn([Nt.common,Nt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pe.distance_vert,fragmentShader:pe.distance_frag},shadow:{uniforms:wn([Nt.lights,Nt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:pe.shadow_vert,fragmentShader:pe.shadow_frag}};mi.physical={uniforms:wn([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ce},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ce},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ce},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new ce},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ce},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ce},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ce},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ce},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ce},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ce},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ce},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ce},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ce}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag};var Il={r:0,b:0,g:0},Sg=new Te,Cd=new ce;Cd.set(-1,0,0,0,1,0,0,0,1);function bg(i,t,e,n,s,r){let o=new Bt(0),a=s===!0?0:1,l,c,u=null,h=0,p=null;function d(x){let _=x.isScene===!0?x.background:null;if(_&&_.isTexture){let y=x.backgroundBlurriness>0;_=t.get(_,y)}return _}function g(x){let _=!1,y=d(x);y===null?m(o,a):y&&y.isColor&&(m(y,1),_=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?e.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||_)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(x,_){let y=d(_);y&&y.isCubeTexture?(c===void 0&&(c=new it(new mn(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:Ts(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,T,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Sg.makeRotationFromEuler(_.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Cd),c.material.toneMapped=ye.getTransfer(y.colorSpace)!==Le,(u!==y||h!==y.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,h=y.version,p=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new it(new He(2,2),new gn({name:"BackgroundMaterial",uniforms:Ts(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:Ji,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=ye.getTransfer(y.colorSpace)!==Le,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=y,h=y.version,p=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,_){x.getRGB(Il,nh(i)),e.buffers.color.setClear(Il.r,Il.g,Il.b,_,r)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,_=1){o.set(x),a=_,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,m(o,a)},render:g,addToRenderList:v,dispose:f}}function wg(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null),r=s,o=!1;function a(L,b,R,S,P){let F=!1,D=h(L,S,R,b);r!==D&&(r=D,c(r.object)),F=d(L,S,R,P),F&&g(L,S,R,P),P!==null&&t.update(P,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,y(L,b,R,S),P!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(P).buffer))}function l(){return i.createVertexArray()}function c(L){return i.bindVertexArray(L)}function u(L){return i.deleteVertexArray(L)}function h(L,b,R,S){let P=S.wireframe===!0,F=n[b.id];F===void 0&&(F={},n[b.id]=F);let D=L.isInstancedMesh===!0?L.id:0,H=F[D];H===void 0&&(H={},F[D]=H);let B=H[R.id];B===void 0&&(B={},H[R.id]=B);let z=B[P];return z===void 0&&(z=p(l()),B[P]=z),z}function p(L){let b=[],R=[],S=[];for(let P=0;P<e;P++)b[P]=0,R[P]=0,S[P]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:R,attributeDivisors:S,object:L,attributes:{},index:null}}function d(L,b,R,S){let P=r.attributes,F=b.attributes,D=0,H=R.getAttributes();for(let B in H)if(H[B].location>=0){let Z=P[B],W=F[B];if(W===void 0&&(B==="instanceMatrix"&&L.instanceMatrix&&(W=L.instanceMatrix),B==="instanceColor"&&L.instanceColor&&(W=L.instanceColor)),Z===void 0||Z.attribute!==W||W&&Z.data!==W.data)return!0;D++}return r.attributesNum!==D||r.index!==S}function g(L,b,R,S){let P={},F=b.attributes,D=0,H=R.getAttributes();for(let B in H)if(H[B].location>=0){let Z=F[B];Z===void 0&&(B==="instanceMatrix"&&L.instanceMatrix&&(Z=L.instanceMatrix),B==="instanceColor"&&L.instanceColor&&(Z=L.instanceColor));let W={};W.attribute=Z,Z&&Z.data&&(W.data=Z.data),P[B]=W,D++}r.attributes=P,r.attributesNum=D,r.index=S}function v(){let L=r.newAttributes;for(let b=0,R=L.length;b<R;b++)L[b]=0}function m(L){f(L,0)}function f(L,b){let R=r.newAttributes,S=r.enabledAttributes,P=r.attributeDivisors;R[L]=1,S[L]===0&&(i.enableVertexAttribArray(L),S[L]=1),P[L]!==b&&(i.vertexAttribDivisor(L,b),P[L]=b)}function x(){let L=r.newAttributes,b=r.enabledAttributes;for(let R=0,S=b.length;R<S;R++)b[R]!==L[R]&&(i.disableVertexAttribArray(R),b[R]=0)}function _(L,b,R,S,P,F,D){D===!0?i.vertexAttribIPointer(L,b,R,P,F):i.vertexAttribPointer(L,b,R,S,P,F)}function y(L,b,R,S){v();let P=S.attributes,F=R.getAttributes(),D=b.defaultAttributeValues;for(let H in F){let B=F[H];if(B.location>=0){let z=P[H];if(z===void 0&&(H==="instanceMatrix"&&L.instanceMatrix&&(z=L.instanceMatrix),H==="instanceColor"&&L.instanceColor&&(z=L.instanceColor)),z!==void 0){let Z=z.normalized,W=z.itemSize,tt=t.get(z);if(tt===void 0)continue;let k=tt.buffer,ut=tt.type,pt=tt.bytesPerElement,Tt=ut===i.INT||ut===i.UNSIGNED_INT||z.gpuType===qa;if(z.isInterleavedBufferAttribute){let dt=z.data,Pt=dt.isInterleavedBuffer===!0?dt.stride:dt.itemSize,te=z.offset;if(dt.isInstancedInterleavedBuffer||dt.isInstancedBufferAttribute){for(let Rt=0;Rt<B.locationSize;Rt++)f(B.location+Rt,dt.meshPerAttribute);L.isInstancedMesh!==!0&&S._maxInstanceCount===void 0&&(S._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let Rt=0;Rt<B.locationSize;Rt++)m(B.location+Rt);i.bindBuffer(i.ARRAY_BUFFER,k);for(let Rt=0;Rt<B.locationSize;Rt++)_(B.location+Rt,W/B.locationSize,ut,Z,Pt*pt,(te+W/B.locationSize*Rt)*pt,Tt)}else{if(z.isInstancedBufferAttribute){for(let dt=0;dt<B.locationSize;dt++)f(B.location+dt,z.meshPerAttribute);L.isInstancedMesh!==!0&&S._maxInstanceCount===void 0&&(S._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let dt=0;dt<B.locationSize;dt++)m(B.location+dt);i.bindBuffer(i.ARRAY_BUFFER,k);for(let dt=0;dt<B.locationSize;dt++)_(B.location+dt,W/B.locationSize,ut,Z,W*pt,W/B.locationSize*dt*pt,Tt)}}else if(D!==void 0){let Z=D[H];if(Z!==void 0)switch(Z.length){case 2:i.vertexAttrib2fv(B.location,Z);break;case 3:i.vertexAttrib3fv(B.location,Z);break;case 4:i.vertexAttrib4fv(B.location,Z);break;default:i.vertexAttrib1fv(B.location,Z)}}}}x()}function w(){N();for(let L in n){let b=n[L];for(let R in b){let S=b[R];for(let P in S){let F=S[P];for(let D in F)u(F[D].object),delete F[D];delete S[P]}}delete n[L]}}function T(L){if(n[L.id]===void 0)return;let b=n[L.id];for(let R in b){let S=b[R];for(let P in S){let F=S[P];for(let D in F)u(F[D].object),delete F[D];delete S[P]}}delete n[L.id]}function M(L){for(let b in n){let R=n[b];for(let S in R){let P=R[S];if(P[L.id]===void 0)continue;let F=P[L.id];for(let D in F)u(F[D].object),delete F[D];delete P[L.id]}}}function E(L){for(let b in n){let R=n[b],S=L.isInstancedMesh===!0?L.id:0,P=R[S];if(P!==void 0){for(let F in P){let D=P[F];for(let H in D)u(D[H].object),delete D[H];delete P[F]}delete R[S],Object.keys(R).length===0&&delete n[b]}}}function N(){C(),o=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:N,resetDefaultState:C,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfObject:E,releaseStatesOfProgram:M,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function Eg(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function a(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let p=0;for(let d=0;d<u;d++)p+=c[d];e.update(p,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Tg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let M=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(M.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(M){return!(M!==Hn&&n.convert(M)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(M){let E=M===Pn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(M!==Cn&&M!==Xn&&!E&&n.convert(M)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(M){if(M==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";M="mediump"}return M==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",u=l(c);u!==c&&(oe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=e.logarithmicDepthBuffer===!0&&h===!1;e.reversedDepthBuffer===!0&&h===!1&&oe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&h===!0&&oe("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:y,maxSamples:w,samples:T}}function Rg(i){let t=this,e=null,n=0,s=!1,r=!1,o=new Fn,a=new ce,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,p){let d=h.length!==0||p||n!==0||s;return s=p,n=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,p){e=u(h,p,0)},this.setState=function(h,p,d){let g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{let x=r?0:n,_=x*4,y=f.clippingState||null;l.value=y,y=u(g,p,_,d);for(let w=0;w!==_;++w)y[w]=e[w];f.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,p,d,g){let v=h!==null?h.length:0,m=null;if(v!==0){if(m=l.value,g!==!0||m===null){let f=d+v*4,x=p.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<f)&&(m=new Float32Array(f));for(let _=0,y=d;_!==v;++_,y+=4)o.copy(h[_]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}var bo=class extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Yr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new mn(5,5,5),r=new gn({name:"CubemapFromEquirect",uniforms:Ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:xn,blending:Ss});r.uniforms.tEquirect.value=e;let o=new it(s,r),a=e.minFilter;return e.minFilter===Di&&(e.minFilter=Qe),new cr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},ad=256,Ag=3,Cg=20,Pd=256,Id=16,Pg=3,Ig=new U,Lg=new Bt,pr=class i{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new cr(1,10,null),this._boxMesh=new it(new mn(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=Ig}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),u=this._getSourceTarget(!0);e>0&&(u.texture.mipmapsAutoUpdate=!1);let h=l.autoClear,p=l.autoClearColor,d=l.autoClearDepth,g=l.autoClearStencil,v=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(t.background=l.getClearColor(Lg));let m=new cr(n,s,u);return m.position.copy(a),m.update(l,t),l.autoClear=h,l.autoClearColor=p,l.autoClearDepth=d,l.autoClearStencil=g,t.background=v,e>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(ad,Ju(t))}_fromTexture(t,e){t.mapping===ws||t.mapping===ur?this._setSize(t.image.length===0?ad:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){let t=this._cubeSize,e=ld(t,!1,!1),n=Math.log2(t)-Ag;for(let s=0;s<=n;s++)e.texture.mipmaps.push({width:t>>s,height:t>>s});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){let e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=ld(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=t,r.activeMipmapLevel=e;let o=t.width>>e;t.viewport.set(0,0,o,o),r.update(this._renderer,s),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===ws||t.mapping===ur?(this._cubemapMaterial===null&&(this._cubemapMaterial=hd()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=cd()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Dg(),this._integrationMaterial=Ng());let e=this._cubeSize,n=t.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/Id);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-Pg)r.roughness.value=a,this._renderCube(t,o,this._integrationMaterial);else{let l=a>0?Math.log2(e)+.5*Math.log2(6/(Pd*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(t,o,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=Ug());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(t,0,n),s.envMap.value=t.texture,this._renderCube(r,0,n)}};function ld(i,t,e){return new bo(i,{minFilter:Di,generateMipmaps:t,type:Pn,colorSpace:Or,depthBuffer:e})}function wo(i,t,e){return new gn({name:i,uniforms:t,vertexShader:pe.cube_vert,fragmentShader:e,side:xn,blending:Ss,depthTest:!1,depthWrite:!1})}function Dg(){return wo("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Pd}u

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
	`)}function Ng(){return wo("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Id}},`

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
	`)}function Ug(){return wo("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Cg}
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
	`)}function cd(){return wo("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function hd(){return wo("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Fg(i){let t=new WeakMap,e=new WeakMap,n=null;function s(p,d=!1){return p==null?null:d?o(p):r(p)}function r(p){if(p&&p.isTexture){let d=p.mapping;if(d===Ga||d===Wa)if(t.has(p)){let g=t.get(p).texture;return a(g,p.mapping)}else{let g=p.image;if(g&&g.height>0){let v=new bo(g.height);return v.fromEquirectangularTexture(i,p),t.set(p,v),p.addEventListener("dispose",c),a(v.texture,p.mapping)}else return null}}return p}function o(p){if(p&&p.isTexture&&p.isPMREMTexture!==!0){let d=p.mapping,g=d===Ga||d===Wa,v=d===ws||d===ur;if(g||v){let m=e.get(p),f=m!==void 0?m.texture.pmremVersion:0;if(p.isRenderTargetTexture&&p.pmremVersion!==f)return n===null&&(n=new pr(i)),m=g?n.fromEquirectangular(p,m):n.fromCubemap(p,m),m.texture.pmremVersion=p.pmremVersion,e.set(p,m),m.texture;if(m!==void 0)return m.texture;{let x=p.image;return g&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new pr(i)),m=g?n.fromEquirectangular(p):n.fromCubemap(p),m.texture.pmremVersion=p.pmremVersion,e.set(p,m),p.addEventListener("dispose",u),m.texture):null}}}return p}function a(p,d){return d===Ga?p.mapping=ws:d===Wa&&(p.mapping=ur),p}function l(p){let d=0,g=6;for(let v=0;v<g;v++)p[v]!==void 0&&d++;return d===g}function c(p){let d=p.target;d.removeEventListener("dispose",c);let g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function u(p){let d=p.target;d.removeEventListener("dispose",u);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function h(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:h}}function Og(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&ds("WebGLRenderer: "+n+" extension not supported."),s}}}function Bg(i,t,e,n){let s={},r=new WeakMap,o=new FinalizationRegistry(g=>delete s[g]);function a(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(let m in g.attributes)t.remove(g.attributes[m]);g.removeEventListener("dispose",a),delete s[g.id],o.unregister(g);let v=r.get(g);v&&(t.remove(v),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function c(g,v){return s[v.id]!==void 0||(v.addEventListener("dispose",a),s[v.id]=new WeakRef(v),o.register(v,v.id,v),e.memory.geometries++),v}function u(g){let v=g.attributes;for(let m in v)t.update(v[m],i.ARRAY_BUFFER)}function h(g){let v=g.index,m=g.attributes.position,f=0;if(m===void 0)return;let x=v!==null?v.array.length:m.array.length/3-1,_=m.count>=65535?Gr:Vr,y=new _(Math.ceil(x/3)*6,1),w=y.array;if(v!==null){let M=v.array;f=v.version;for(let E=0,N=0;E<x;E+=3){let C=M[E+0],L=M[E+1],b=M[E+2];w[N++]=C,w[N++]=L,w[N++]=L,w[N++]=b,w[N++]=b,w[N++]=C}}else{f=m.version;for(let M=0,E=0;M<x;M+=3){let N=M+0,C=M+1,L=M+2;w[E++]=N,w[E++]=C,w[E++]=C,w[E++]=L,w[E++]=L,w[E++]=N}}y.version=f;let T=r.get(g);T&&t.remove(T),r.set(g,y)}function p(g){let v=r.get(g);if(v){let m=g.index;m!==null&&v.version<m.version&&h(g)}else h(g);return r.get(g)}function d(){for(let g in s){let v=s[g].deref();v!==void 0&&l(v)}}return{get:c,update:u,getWireframeAttribute:p,dispose:d}}function Hg(i,t,e){let n;function s(h){n=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function l(h,p){i.drawElements(n,p,r,h*o),e.update(p,n,1)}function c(h,p,d){d!==0&&(i.drawElementsInstanced(n,p,r,h*o,d),e.update(p,n,d))}function u(h,p,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,h,0,d);let v=0;for(let m=0;m<d;m++)v+=p[m];e.update(v,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function kg(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:re("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function zg(i,t,e){let n=new WeakMap,s=new Xe;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,p=n.get(a);if(p===void 0||p.count!==h){let N=function(){M.dispose(),n.delete(a),a.removeEventListener("dispose",N)};p!==void 0&&p.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],_=0;d===!0&&(_=1),g===!0&&(_=2),v===!0&&(_=3);let y=a.attributes.position.count*_,w=1;y>t.maxTextureSize&&(w=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let T=new Float32Array(y*w*4*h),M=new zr(T,y,w,h);M.type=Xn,M.needsUpdate=!0;let E=_*4;for(let C=0;C<h;C++){let L=m[C],b=f[C],R=x[C],S=y*w*4*C;for(let P=0;P<L.count;P++){let F=P*E;d===!0&&(s.fromBufferAttribute(L,P),T[S+F+0]=s.x,T[S+F+1]=s.y,T[S+F+2]=s.z,T[S+F+3]=0),g===!0&&(s.fromBufferAttribute(b,P),T[S+F+4]=s.x,T[S+F+5]=s.y,T[S+F+6]=s.z,T[S+F+7]=0),v===!0&&(s.fromBufferAttribute(R,P),T[S+F+8]=s.x,T[S+F+9]=s.y,T[S+F+10]=s.z,T[S+F+11]=R.itemSize===4?s.w:1)}}p={count:h,texture:M,size:new ot(y,w)},n.set(a,p),a.addEventListener("dispose",N)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let v=0;v<c.length;v++)d+=c[v];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function Vg(i,t,e,n,s){let r=new WeakMap;function o(c){let u=s.render.frame,h=c.geometry,p=t.get(c,h);if(r.get(p)!==u&&(t.update(p),r.set(p,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return p}function a(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}var Gg={[Fc]:"LINEAR_TONE_MAPPING",[Oc]:"REINHARD_TONE_MAPPING",[Bc]:"CINEON_TONE_MAPPING",[fo]:"ACES_FILMIC_TONE_MAPPING",[kc]:"AGX_TONE_MAPPING",[zc]:"NEUTRAL_TONE_MAPPING",[Hc]:"CUSTOM_TONE_MAPPING"};function Wg(i,t,e,n,s,r){let o=new pn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,u=new Ce;u.setAttribute("position",new Xt([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new Xt([0,2,0,0,2,0],2));let h=new Aa({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),p=new it(u,h),d=new _s(-1,1,1,-1,0,1),g=null,v=null,m=!1,f,x=null,_=[],y=!1;this.setSize=function(w,T){o.setSize(w,T),a!==null&&a.setSize(w,T),l!==null&&l.setSize(w,T);for(let M=0;M<_.length;M++){let E=_[M];E.setSize&&E.setSize(w,T)}},this.setEffects=function(w){_=w,y=_.length>0&&_[0].isRenderPass===!0;let T=o.width,M=o.height;_.length>0&&a===null&&(a=new pn(T,M,{type:Pn,depthBuffer:!1,stencilBuffer:!1}),l=new pn(T,M,{type:Pn,depthBuffer:!1,stencilBuffer:!1}));let E=s===!0&&_.some(N=>N.needsDepthTexture===!0);E!==(o.depthTexture!==null)&&(E===!0&&c===null&&(c=new Ci(T,M),r===!0&&(c.format=Ni,c.type=Es)),o.dispose(),o.depthTexture=E?c:null,o.resolveDepthBuffer=E,o.storeMultisampledDepthBuffer=E);for(let N=0;N<_.length;N++){let C=_[N];C.setSize&&C.setSize(T,M),E&&C.needsDepthTexture===!0&&C.setDepthTexture&&C.setDepthTexture(c)}},this.begin=function(w,T){if(m||w.toneMapping===fi&&_.length===0)return!1;if(x=T,T!==null){let M=T.width,E=T.height;(o.width!==M||o.height!==E)&&this.setSize(M,E)}return y===!1&&w.setRenderTarget(o),f=w.toneMapping,w.toneMapping=fi,!0},this.hasRenderPass=function(){return y},this.end=function(w,T){w.toneMapping=f,m=!0;let M=o,E=a;for(let N=0;N<_.length;N++){let C=_[N];C.enabled!==!1&&(C.render(w,E,M,T),C.needsSwap!==!1&&(M=E,E=E===a?l:a))}if(g!==w.outputColorSpace||v!==w.toneMapping){g=w.outputColorSpace,v=w.toneMapping,h.defines={},ye.getTransfer(g)===Le&&(h.defines.SRGB_TRANSFER="");let N=Gg[v];N&&(h.defines[N]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,w.setRenderTarget(x),w.render(p,d),x=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),u.dispose(),h.dispose()}}var Ld=new fn,Dd=new Ci(1,1),Nd=new Jr(1),Ud=new zr,Fd=new _a,Od=new Yr,ud=[],dd=[],fd=new Float32Array(16),pd=new Float32Array(9),md=new Float32Array(4);function mr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=ud[s];if(r===void 0&&(r=new Float32Array(s),ud[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function rn(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function on(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Nl(i,t){let e=dd[t];e===void 0&&(e=new Int32Array(t),dd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Xg(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function qg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;i.uniform2fv(this.addr,t),on(e,t)}}function Yg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(rn(e,t))return;i.uniform3fv(this.addr,t),on(e,t)}}function Zg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;i.uniform4fv(this.addr,t),on(e,t)}}function Jg(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(rn(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),on(e,t)}else{if(rn(e,n))return;md.set(n),i.uniformMatrix2fv(this.addr,!1,md),on(e,n)}}function $g(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(rn(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),on(e,t)}else{if(rn(e,n))return;pd.set(n),i.uniformMatrix3fv(this.addr,!1,pd),on(e,n)}}function Kg(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(rn(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),on(e,t)}else{if(rn(e,n))return;fd.set(n),i.uniformMatrix4fv(this.addr,!1,fd),on(e,n)}}function jg(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Qg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;i.uniform2iv(this.addr,t),on(e,t)}}function tx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;i.uniform3iv(this.addr,t),on(e,t)}}function ex(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;i.uniform4iv(this.addr,t),on(e,t)}}function nx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function ix(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;i.uniform2uiv(this.addr,t),on(e,t)}}function sx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;i.uniform3uiv(this.addr,t),on(e,t)}}function rx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;i.uniform4uiv(this.addr,t),on(e,t)}}function Ul(i){return i.version===0&&(i.compareFunction=Kc,i.needsUpdate=!0),i}function ox(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Ul(Dd):r=Ld,e.setTexture2D(t||r,s)}function ax(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Fd,s)}function lx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Ul(Nd):r=Od,e.setTextureCube(t||r,s)}function cx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ud,s)}function hx(i){switch(i){case 5126:return Xg;case 35664:return qg;case 35665:return Yg;case 35666:return Zg;case 35674:return Jg;case 35675:return $g;case 35676:return Kg;case 5124:case 35670:return jg;case 35667:case 35671:return Qg;case 35668:case 35672:return tx;case 35669:case 35673:return ex;case 5125:return nx;case 36294:return ix;case 36295:return sx;case 36296:return rx;case 35678:case 36198:case 36298:case 36306:case 35682:return ox;case 35679:case 36299:case 36307:return ax;case 35680:case 36300:case 36308:case 36293:return lx;case 36289:case 36303:case 36311:case 36292:return cx}}function ux(i,t){i.uniform1fv(this.addr,t)}function dx(i,t){let e=mr(t,this.size,2);i.uniform2fv(this.addr,e)}function fx(i,t){let e=mr(t,this.size,3);i.uniform3fv(this.addr,e)}function px(i,t){let e=mr(t,this.size,4);i.uniform4fv(this.addr,e)}function mx(i,t){let e=mr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function gx(i,t){let e=mr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function xx(i,t){let e=mr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function vx(i,t){i.uniform1iv(this.addr,t)}function _x(i,t){i.uniform2iv(this.addr,t)}function yx(i,t){i.uniform3iv(this.addr,t)}function Mx(i,t){i.uniform4iv(this.addr,t)}function Sx(i,t){i.uniform1uiv(this.addr,t)}function bx(i,t){i.uniform2uiv(this.addr,t)}function wx(i,t){i.uniform3uiv(this.addr,t)}function Ex(i,t){i.uniform4uiv(this.addr,t)}function Tx(i,t,e){let n=this.cache,s=t.length,r=Nl(e,s);rn(n,r)||(i.uniform1iv(this.addr,r),on(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ul(Dd):o=Ld;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function Rx(i,t,e){let n=this.cache,s=t.length,r=Nl(e,s);rn(n,r)||(i.uniform1iv(this.addr,r),on(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Fd,r[o])}function Ax(i,t,e){let n=this.cache,s=t.length,r=Nl(e,s);rn(n,r)||(i.uniform1iv(this.addr,r),on(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=Ul(Nd):o=Od;for(let a=0;a!==s;++a)e.setTextureCube(t[a]||o,r[a])}function Cx(i,t,e){let n=this.cache,s=t.length,r=Nl(e,s);rn(n,r)||(i.uniform1iv(this.addr,r),on(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ud,r[o])}function Px(i){switch(i){case 5126:return ux;case 35664:return dx;case 35665:return fx;case 35666:return px;case 35674:return mx;case 35675:return gx;case 35676:return xx;case 5124:case 35670:return vx;case 35667:case 35671:return _x;case 35668:case 35672:return yx;case 35669:case 35673:return Mx;case 5125:return Sx;case 36294:return bx;case 36295:return wx;case 36296:return Ex;case 35678:case 36198:case 36298:case 36306:case 35682:return Tx;case 35679:case 36299:case 36307:return Rx;case 35680:case 36300:case 36308:case 36293:return Ax;case 36289:case 36303:case 36311:case 36292:return Cx}}var fh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=hx(e.type)}},ph=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Px(e.type)}},mh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},uh=/(\w+)(\])?(\[|\.)?/g;function gd(i,t){i.seq.push(t),i.map[t.id]=t}function Ix(i,t,e){let n=i.name,s=n.length;for(uh.lastIndex=0;;){let r=uh.exec(n),o=uh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){gd(e,c===void 0?new fh(a,i,t):new ph(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new mh(a),gd(e,h)),e=h}}}var fr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Ix(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function xd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Lx=37297,Dx=0;function Nx(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var vd=new ce;function Ux(i){ye._getMatrix(vd,ye.workingColorSpace,i);let t=`mat3( ${vd.elements.map(e=>e.toFixed(4))} )`;switch(ye.getTransfer(i)){case Br:return[t,"LinearTransferOETF"];case Le:return[t,"sRGBTransferOETF"];default:return oe("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function _d(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Nx(i.getShaderSource(t),a)}else return r}function Fx(i,t){let e=Ux(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var Ox={[Fc]:"Linear",[Oc]:"Reinhard",[Bc]:"Cineon",[fo]:"ACESFilmic",[kc]:"AgX",[zc]:"Neutral",[Hc]:"Custom"};function Bx(i,t){let e=Ox[t];return e===void 0?(oe("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Ll=new U;function Hx(){ye.getLuminanceCoefficients(Ll);let i=Ll.x.toFixed(4),t=Ll.y.toFixed(4),e=Ll.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function kx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(So).join(`
`)}function zx(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Vx(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function So(i){return i!==""}function yd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Md(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Gx=/^[ \t]*#include +<([\w\d./]+)>/gm;function gh(i){return i.replace(Gx,Wx)}function Wx(i,t){let e=pe[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return gh(e)}var Xx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sd(i){return i.replace(Xx,qx)}function qx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function bd(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}var Yx={[Ms]:"SHADOWMAP_TYPE_PCF",[hr]:"SHADOWMAP_TYPE_VSM"};function Zx(i){return Yx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Jx={[ur]:"ENVMAP_MODE_REFRACTION"};function $x(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Jx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Kx={[Uc]:"ENVMAP_BLENDING_MULTIPLY",[Nu]:"ENVMAP_BLENDING_MIX",[Uu]:"ENVMAP_BLENDING_ADD"};function jx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Kx[i.combine]||"ENVMAP_BLENDING_NONE"}function Qx(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Zx(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=$x(e),h=jx(e),p=kx(e),d=zx(r),g=s.createProgram(),v,m,f=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(So).join(`
`),v.length>0&&(v+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(So).join(`
`),m.length>0&&(m+=`
`)):(v=[bd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(So).join(`
`),m=[bd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==fi?"#define TONE_MAPPING":"",e.toneMapping!==fi?pe.tonemapping_pars_fragment:"",e.toneMapping!==fi?Bx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",pe.colorspace_pars_fragment,Fx("linearToOutputTexel",e.outputColorSpace),Hx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(So).join(`
`)),o=gh(o),o=yd(o,e),o=Md(o,e),a=gh(a),a=yd(a,e),a=Md(a,e),o=Sd(o),a=Sd(a),e.isRawShaderMaterial!==!0&&(f=`#version 300 es
`,v=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,m=["#define varying in",e.glslVersion===th?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let x=f+v+o,_=f+m+a,y=xd(s,s.VERTEX_SHADER,x),w=xd(s,s.FRAGMENT_SHADER,_);s.attachShader(g,y),s.attachShader(g,w),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function T(C){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(g)||"",b=s.getShaderInfoLog(y)||"",R=s.getShaderInfoLog(w)||"",S=L.trim(),P=b.trim(),F=R.trim(),D=!0,H=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(D=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,y,w);else{let B=_d(s,y,"vertex"),z=_d(s,w,"fragment");re("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+S+`
`+B+`
`+z)}else S!==""?oe("WebGLProgram: Program Info Log:",S):(P===""||F==="")&&(H=!1);H&&(C.diagnostics={runnable:D,programLog:S,vertexShader:{log:P,prefix:v},fragmentShader:{log:F,prefix:m}})}s.deleteShader(y),s.deleteShader(w),M=new fr(s,g),E=Vx(s,g)}let M;this.getUniforms=function(){return M===void 0&&T(this),M};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let N=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(g,Lx)),N},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Dx++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=y,this.fragmentShader=w,this}var tv=0,xh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new vh(t),e.set(t,n)),n}},vh=class{constructor(t){this.id=tv++,this.code=t,this.usedTimes=0}};function ev(i){return i===Ki||i===_o||i===yo}function nv(i,t,e,n,s,r){let o=new nr,a=new xh,l=new Set,c=[],u=new Map,h=n.logarithmicDepthBuffer,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(M){return l.add(M),M===0?"uv":`uv${M}`}function g(M,E,N,C,L,b){let R=C.fog,S=L.geometry,P=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?C.environment:null,F=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap,D=t.get(M.envMap||P,F),H=p[M.type],B=n.precision;M.precision!==null&&(B=n.getMaxPrecision(M.precision),B!==M.precision&&oe("WebGLProgram.getParameters:",M.precision,"not supported, using",B,"instead."));let z=S.morphAttributes.position||S.morphAttributes.normal||S.morphAttributes.color,Z=z!==void 0?z.length:0,W=0;S.morphAttributes.position!==void 0&&(W=1),S.morphAttributes.normal!==void 0&&(W=2),S.morphAttributes.color!==void 0&&(W=3);let tt,k,ut,pt;if(H){let It=mi[H];tt=It.vertexShader,k=It.fragmentShader}else{tt=M.vertexShader,k=M.fragmentShader;let It=a.getVertexShaderStage(M),Ee=a.getFragmentShaderStage(M);a.update(M,It,Ee),ut=It.id,pt=Ee.id}let Tt=i.getRenderTarget(),dt=i.state.buffers.depth.getReversed(),Pt=L.isInstancedMesh===!0,te=L.isBatchedMesh===!0,Rt=!!M.map,Ht=!!M.matcap,gt=!!D,j=gt&&D.isPMREMTexture===!0,ft=!!M.aoMap,$=!!M.lightMap,et=!!M.bumpMap&&M.wireframe===!1,lt=!!M.normalMap,Ut=!!M.displacementMap,wt=!!M.emissiveMap,Zt=!!M.metalnessMap,Kt=!!M.roughnessMap,se=M.anisotropy>0,X=M.clearcoat>0,fe=M.diffuseRoughness>0,ee=M.dispersion>0,qt=M.retroreflectivity>0,xt=M.iridescence>0,Ue=M.sheen>0,$t=M.transmission>0,Qt=se&&!!M.anisotropyMap,O=X&&!!M.clearcoatMap,A=X&&!!M.clearcoatNormalMap,J=X&&!!M.clearcoatRoughnessMap,mt=fe&&!!M.diffuseRoughnessMap,ht=xt&&!!M.iridescenceMap,Mt=xt&&!!M.iridescenceThicknessMap,yt=Ue&&!!M.sheenColorMap,rt=Ue&&!!M.sheenRoughnessMap,ct=!!M.specularMap,Et=!!M.specularColorMap,G=!!M.specularIntensityMap,at=$t&&!!M.transmissionMap,st=$t&&!!M.thicknessMap,bt=!!M.gradientMap,_t=!!M.alphaMap,St=M.alphaTest>0,Yt=!!M.alphaHash,ue=!!M.extensions,vt=fi;M.toneMapped&&(Tt===null||Tt.isXRRenderTarget===!0)&&(vt=i.toneMapping);let Vt=j?D.isCompressedCubeTexture?D.image[0].mipmaps:D.mipmaps:null,le={shaderID:H,shaderType:M.type,shaderName:M.name,vertexShader:tt,fragmentShader:k,defines:M.defines,customVertexShaderID:ut,customFragmentShaderID:pt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:B,batching:te,batchingColor:te&&L._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&L.instanceColor!==null,instancingMorph:Pt&&L.morphTexture!==null,outputColorSpace:Tt===null?i.outputColorSpace:Tt.isXRRenderTarget===!0?Tt.texture.colorSpace:ye.workingColorSpace,alphaToCoverage:!!M.alphaToCoverage,map:Rt,matcap:Ht,envMap:gt,envMapMode:gt&&D.mapping,envMapPMREM:j,envMapMaxLod:j?Vt.length-1:null,envMapSize:j?Vt[0].width:null,aoMap:ft,lightMap:$,bumpMap:et,normalMap:lt,displacementMap:Ut,emissiveMap:wt,normalMapObjectSpace:lt&&M.normalMapType===Bu,normalMapTangentSpace:lt&&M.normalMapType===Cl,packedNormalMap:lt&&M.normalMapType===Cl&&ev(M.normalMap.format),metalnessMap:Zt,roughnessMap:Kt,anisotropy:se,anisotropyMap:Qt,clearcoat:X,clearcoatMap:O,clearcoatNormalMap:A,clearcoatRoughnessMap:J,diffuseRoughness:fe,diffuseRoughnessMap:mt,dispersion:ee,retroreflection:qt,iridescence:xt,iridescenceMap:ht,iridescenceThicknessMap:Mt,sheen:Ue,sheenColorMap:yt,sheenRoughnessMap:rt,specularMap:ct,specularColorMap:Et,specularIntensityMap:G,transmission:$t,transmissionMap:at,thicknessMap:st,gradientMap:bt,opaque:M.transparent===!1&&M.blending===$i&&M.alphaToCoverage===!1,alphaMap:_t,alphaTest:St,alphaHash:Yt,combine:M.combine,mapUv:Rt&&d(M.map.channel),aoMapUv:ft&&d(M.aoMap.channel),lightMapUv:$&&d(M.lightMap.channel),bumpMapUv:et&&d(M.bumpMap.channel),normalMapUv:lt&&d(M.normalMap.channel),displacementMapUv:Ut&&d(M.displacementMap.channel),emissiveMapUv:wt&&d(M.emissiveMap.channel),metalnessMapUv:Zt&&d(M.metalnessMap.channel),roughnessMapUv:Kt&&d(M.roughnessMap.channel),anisotropyMapUv:Qt&&d(M.anisotropyMap.channel),clearcoatMapUv:O&&d(M.clearcoatMap.channel),clearcoatNormalMapUv:A&&d(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&d(M.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:mt&&d(M.diffuseRoughnessMap.channel),iridescenceMapUv:ht&&d(M.iridescenceMap.channel),iridescenceThicknessMapUv:Mt&&d(M.iridescenceThicknessMap.channel),sheenColorMapUv:yt&&d(M.sheenColorMap.channel),sheenRoughnessMapUv:rt&&d(M.sheenRoughnessMap.channel),specularMapUv:ct&&d(M.specularMap.channel),specularColorMapUv:Et&&d(M.specularColorMap.channel),specularIntensityMapUv:G&&d(M.specularIntensityMap.channel),transmissionMapUv:at&&d(M.transmissionMap.channel),thicknessMapUv:st&&d(M.thicknessMap.channel),alphaMapUv:_t&&d(M.alphaMap.channel),vertexTangents:!!S.attributes.tangent&&(lt||se),vertexNormals:!!S.attributes.normal,vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!S.attributes.color&&S.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!S.attributes.uv&&(Rt||_t),fog:!!R,useFog:M.fog===!0,fogExp2:!!R&&R.isFogExp2,flatShading:M.wireframe===!1&&(M.flatShading===!0||S.attributes.normal===void 0&&lt===!1&&(M.isMeshLambertMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isMeshPhysicalMaterial)),sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:dt,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:S.attributes.position!==void 0,morphTargets:S.morphAttributes.position!==void 0,morphNormals:S.morphAttributes.normal!==void 0,morphColors:S.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:W,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:b.filter(It=>It.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:vt,decodeVideoTexture:Rt&&M.map.isVideoTexture===!0&&ye.getTransfer(M.map.colorSpace)===Le,decodeVideoTextureEmissive:wt&&M.emissiveMap.isVideoTexture===!0&&ye.getTransfer(M.emissiveMap.colorSpace)===Le,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===xe,flipSided:M.side===xn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:ue&&M.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ue&&M.extensions.multiDraw===!0||te)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return le.vertexUv1s=l.has(1),le.vertexUv2s=l.has(2),le.vertexUv3s=l.has(3),l.clear(),le}function v(M){let E=[];if(M.shaderID?E.push(M.shaderID):(E.push(M.customVertexShaderID),E.push(M.customFragmentShaderID)),M.defines!==void 0)for(let N in M.defines)E.push(N),E.push(M.defines[N]);return M.isRawShaderMaterial===!1&&(m(E,M),f(E,M),E.push(i.outputColorSpace)),E.push(M.customProgramCacheKey),E.join()}function m(M,E){M.push(E.precision),M.push(E.outputColorSpace),M.push(E.envMapMode),M.push(E.envMapPMREM),M.push(E.envMapMaxLod),M.push(E.envMapSize),M.push(E.mapUv),M.push(E.alphaMapUv),M.push(E.lightMapUv),M.push(E.aoMapUv),M.push(E.bumpMapUv),M.push(E.normalMapUv),M.push(E.displacementMapUv),M.push(E.emissiveMapUv),M.push(E.metalnessMapUv),M.push(E.roughnessMapUv),M.push(E.anisotropyMapUv),M.push(E.clearcoatMapUv),M.push(E.clearcoatNormalMapUv),M.push(E.clearcoatRoughnessMapUv),M.push(E.diffuseRoughnessMapUv),M.push(E.iridescenceMapUv),M.push(E.iridescenceThicknessMapUv),M.push(E.sheenColorMapUv),M.push(E.sheenRoughnessMapUv),M.push(E.specularMapUv),M.push(E.specularColorMapUv),M.push(E.specularIntensityMapUv),M.push(E.transmissionMapUv),M.push(E.thicknessMapUv),M.push(E.combine),M.push(E.fogExp2),M.push(E.sizeAttenuation),M.push(E.morphTargetsCount),M.push(E.numSunLights),M.push(E.numDirLights),M.push(E.numPointLights),M.push(E.numSpotLights),M.push(E.numSpotLightMaps),M.push(E.numHemiLights),M.push(E.numRectAreaLights),M.push(E.numSunLightShadows),M.push(E.numDirLightShadows),M.push(E.numPointLightShadows),M.push(E.numSpotLightShadows),M.push(E.numSpotLightShadowsWithMaps),M.push(E.numLightProbes),M.push(E.numLightProbeGrids),M.push(E.shadowMapType),M.push(E.toneMapping),M.push(E.numClippingPlanes),M.push(E.numClipIntersection),M.push(E.depthPacking)}function f(M,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.retroreflection&&o.enable(24),E.diffuseRoughness&&o.enable(25),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),M.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),M.push(o.mask)}function x(M){let E=p[M.type],N;if(E){let C=mi[E];N=sd.clone(C.uniforms)}else N=M.uniforms;return N}function _(M,E){let N=u.get(E);return N!==void 0?++N.usedTimes:(N=new Qx(i,E,M,s),c.push(N),u.set(E,N)),N}function y(M){if(--M.usedTimes===0){let E=c.indexOf(M);c[E]=c[c.length-1],c.pop(),u.delete(M.cacheKey),M.destroy()}}function w(M){a.remove(M)}function T(){a.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:x,acquireProgram:_,releaseProgram:y,releaseShaderCache:w,programs:c,dispose:T}}function iv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function sv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function wd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ed(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(p){let d=0;return p.isInstancedMesh&&(d+=2),p.isSkinnedMesh&&(d+=1),d}function a(p,d,g,v,m,f){let x=i[t];return x===void 0?(x={id:p.id,object:p,geometry:d,material:g,materialVariant:o(p),groupOrder:v,renderOrder:p.renderOrder,z:m,group:f},i[t]=x):(x.id=p.id,x.object=p,x.geometry=d,x.material=g,x.materialVariant=o(p),x.groupOrder=v,x.renderOrder=p.renderOrder,x.z=m,x.group=f),t++,x}function l(p,d,g,v,m,f,x){x.reversedDepth===!0&&(m=-m);let _=a(p,d,g,v,m,f);g.transmission>0?n.push(_):g.transparent===!0?s.push(_):e.push(_)}function c(p,d,g,v,m,f){let x=a(p,d,g,v,m,f);g.transmission>0?n.unshift(x):g.transparent===!0?s.unshift(x):e.unshift(x)}function u(p,d){e.length>1&&e.sort(p||sv),n.length>1&&n.sort(d||wd),s.length>1&&s.sort(d||wd)}function h(){for(let p=t,d=i.length;p<d;p++){let g=i[p];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:h,sort:u}}function rv(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Ed,i.set(n,[o])):s>=r.length?(o=new Ed,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function ov(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new U,color:new Bt};break;case"SpotLight":e={position:new U,direction:new U,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function av(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var lv=0;function cv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function hv(i){let t=new ov,e=av(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);let s=new U,r=new Te,o=new Te;function a(c){let u=0,h=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,v=0,m=0,f=0,x=0,_=0,y=0,w=0,T=0,M=0,E=0,N=0,C=0;c.sort(cv);for(let b=0,R=c.length;b<R;b++){let S=c[b],P=S.color,F=S.intensity,D=S.distance,H=null;if(S.shadow&&S.shadow.map&&(S.shadow.map.texture.format===Ki?H=S.shadow.map.texture:H=S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)u+=P.r*F,h+=P.g*F,p+=P.b*F;else if(S.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(S.sh.coefficients[B],F);C++}else if(S.isSunLight){let B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let z=S.shadow,Z=e.get(S);Z.shadowIntensity=z.intensity,Z.shadowBias=z.bias,Z.shadowNormalBias=z.normalBias,Z.shadowRadius=z.radius,Z.shadowMapSize.copy(z.mapSize).multiply(z.getFrameExtents()),n.sunShadow[g]=Z,n.sunShadowMap[g]=H;let W=z.getViewportCount();for(let tt=0;tt<W;tt++)n.sunShadowMatrix[v+tt]=z.getMatrix(tt),n.sunShadowCascade[v+tt]=z._cascadeData[tt];v+=W,g++}n.sun[d]=B,d++}else if(S.isDirectionalLight){let B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let z=S.shadow,Z=e.get(S);Z.shadowIntensity=z.intensity,Z.shadowBias=z.bias,Z.shadowNormalBias=z.normalBias,Z.shadowRadius=z.radius,Z.shadowMapSize=z.mapSize,n.directionalShadow[m]=Z,n.directionalShadowMap[m]=H,n.directionalShadowMatrix[m]=S.shadow.matrix,w++}n.directional[m]=B,m++}else if(S.isSpotLight){let B=t.get(S);B.position.setFromMatrixPosition(S.matrixWorld),B.color.copy(P).multiplyScalar(F),B.distance=D,B.coneCos=Math.cos(S.angle),B.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),B.decay=S.decay,n.spot[x]=B;let z=S.shadow;if(S.map&&(n.spotLightMap[E]=S.map,E++,z.updateMatrices(S),S.castShadow&&N++),n.spotLightMatrix[x]=z.matrix,S.castShadow){let Z=e.get(S);Z.shadowIntensity=z.intensity,Z.shadowBias=z.bias,Z.shadowNormalBias=z.normalBias,Z.shadowRadius=z.radius,Z.shadowMapSize=z.mapSize,n.spotShadow[x]=Z,n.spotShadowMap[x]=H,M++}x++}else if(S.isRectAreaLight){let B=t.get(S);B.color.copy(P).multiplyScalar(F),B.halfWidth.set(S.width*.5,0,0),B.halfHeight.set(0,S.height*.5,0),n.rectArea[_]=B,_++}else if(S.isPointLight){let B=t.get(S);if(B.color.copy(S.color).multiplyScalar(S.intensity),B.distance=S.distance,B.decay=S.decay,S.castShadow){let z=S.shadow,Z=e.get(S);Z.shadowIntensity=z.intensity,Z.shadowBias=z.bias,Z.shadowNormalBias=z.normalBias,Z.shadowRadius=z.radius,Z.shadowMapSize=z.mapSize,Z.shadowCameraNear=z.camera.near,Z.shadowCameraFar=z.camera.far,n.pointShadow[f]=Z,n.pointShadowMap[f]=H,n.pointShadowMatrix[f]=S.shadow.matrix,T++}n.point[f]=B,f++}else if(S.isHemisphereLight){let B=t.get(S);B.skyColor.copy(S.color).multiplyScalar(F),B.groundColor.copy(S.groundColor).multiplyScalar(F),n.hemi[y]=B,y++}}_>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Nt.LTC_FLOAT_1,n.rectAreaLTC2=Nt.LTC_FLOAT_2):(n.rectAreaLTC1=Nt.LTC_HALF_1,n.rectAreaLTC2=Nt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=p;let L=n.hash;(L.sunLength!==d||L.directionalLength!==m||L.pointLength!==f||L.spotLength!==x||L.rectAreaLength!==_||L.hemiLength!==y||L.numSunShadows!==g||L.numDirectionalShadows!==w||L.numPointShadows!==T||L.numSpotShadows!==M||L.numSpotMaps!==E||L.numLightProbes!==C)&&(n.sun.length=d,n.directional.length=m,n.spot.length=x,n.rectArea.length=_,n.point.length=f,n.hemi.length=y,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=M,n.spotShadowMap.length=M,n.spotLightMatrix.length=M+E-N,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=N,n.numLightProbes=C,L.sunLength=d,L.directionalLength=m,L.pointLength=f,L.spotLength=x,L.rectAreaLength=_,L.hemiLength=y,L.numSunShadows=g,L.numDirectionalShadows=w,L.numPointShadows=T,L.numSpotShadows=M,L.numSpotMaps=E,L.numLightProbes=C,n.version=lv++)}function l(c,u){let h=0,p=0,d=0,g=0,v=0,m=0,f=u.matrixWorldInverse;for(let x=0,_=c.length;x<_;x++){let y=c[x];if(y.isSunLight){let w=n.sun[h];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(f),h++}else if(y.isDirectionalLight){let w=n.directional[p];w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(f),p++}else if(y.isSpotLight){let w=n.spot[g];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(f),w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(f),g++}else if(y.isRectAreaLight){let w=n.rectArea[v];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(f),o.identity(),r.copy(y.matrixWorld),r.premultiply(f),o.extractRotation(r),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),v++}else if(y.isPointLight){let w=n.point[d];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(f),d++}else if(y.isHemisphereLight){let w=n.hemi[m];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(f),m++}}}return{setup:a,setupView:l,state:n}}function Td(i){let t=new hv(i),e=[],n=[],s=[];function r(h){u.camera=h,e.length=0,n.length=0,s.length=0}function o(h){h.isLightProbeGrid?s.push(h):e.push(h)}function a(h){n.push(h)}function l(){t.setup(e),s.sort((h,p)=>h.priority-p.priority||h.id-p.id)}function c(h){t.setupView(e,h)}let u={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function uv(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Td(i),t.set(s,[a])):r>=o.length?(a=new Td(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var dv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fv=`uniform sampler2D shadow_pass;
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
}`,pv=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],mv=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],Rd=new Te,Mo=new U,dh=new U;function gv(i,t,e){let n=new Wi,s=new ot,r=new ot,o=new Xe,a=new Ca,l=new Pa,c={},u=e.maxTextureSize,h={[Ji]:xn,[xn]:Ji,[xe]:xe},p=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:dv,fragmentShader:fv}),d=p.clone();d.defines.HORIZONTAL_PASS=1;let g=new Ce;g.setAttribute("position",new An(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new it(g,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ms;let f=this.type;this.render=function(T,M,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===mu&&(oe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ms);let N=i.getRenderTarget(),C=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),b=i.state;b.setBlending(Ss),b.buffers.depth.getReversed()===!0?b.buffers.color.setClear(0,0,0,0):b.buffers.color.setClear(1,1,1,1),b.buffers.depth.setTest(!0),b.setScissorTest(!1);let R=f!==this.type;R&&M.traverse(function(S){S.material&&(Array.isArray(S.material)?S.material.forEach(P=>P.needsUpdate=!0):S.material.needsUpdate=!0)});for(let S=0,P=T.length;S<P;S++){let F=T[S],D=F.shadow;if(D===void 0){oe("WebGLShadowMap:",F,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;s.copy(D.mapSize);let H=D.getFrameExtents();s.multiply(H),r.copy(D.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/H.x),s.x=r.x*H.x,D.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/H.y),s.y=r.y*H.y,D.mapSize.y=r.y));let B=i.state.buffers.depth.getReversed();if(D.camera._reversedDepth=B,D.map===null||R===!0){if(D.map!==null&&(D.map.depthTexture!==null&&(D.map.depthTexture.dispose(),D.map.depthTexture=null),D.map.dispose()),this.type===hr){if(F.isPointLight){oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}D.map=new pn(s.x,s.y,{format:Ki,type:Pn,minFilter:Qe,magFilter:Qe,generateMipmaps:!1}),D.map.texture.name=F.name+".shadowMap",D.map.depthTexture=new Ci(s.x,s.y,Xn),D.map.depthTexture.name=F.name+".shadowMapDepth",D.map.depthTexture.format=Ei,D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=cn,D.map.depthTexture.magFilter=cn}else F.isPointLight?(D.map=new bo(s.x),D.map.depthTexture=new Jr(s.x,ni)):(D.map=new pn(s.x,s.y),D.map.depthTexture=new Ci(s.x,s.y,ni)),D.map.depthTexture.name=F.name+".shadowMap",D.map.depthTexture.format=Ei,this.type===Ms?(D.map.depthTexture.compareFunction=B?$c:Jc,D.map.depthTexture.minFilter=Qe,D.map.depthTexture.magFilter=Qe):(D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=cn,D.map.depthTexture.magFilter=cn);D.camera.updateProjectionMatrix()}D.map.isWebGLCubeRenderTarget!==!0&&(D.map.width!==s.x||D.map.height!==s.y)&&D.map.setSize(s.x,s.y);let z=D.map.isWebGLCubeRenderTarget?6:D.getViewportCount();F.isPointLight!==!0&&D.updateMatrices(F,E);let Z=(D.camera.layers.mask&4294967294)!==0?D.camera.layers:E.layers;for(let W=0;W<z;W++){let tt=D.getCamera(W);if(F.isPointLight){let k=D.camera,ut=D.matrix,pt=F.distance||k.far;pt!==k.far&&(k.far=pt,k.updateProjectionMatrix()),Mo.setFromMatrixPosition(F.matrixWorld),k.position.copy(Mo),dh.copy(k.position),dh.add(pv[W]),k.up.copy(mv[W]),k.lookAt(dh),k.updateMatrixWorld(),ut.makeTranslation(-Mo.x,-Mo.y,-Mo.z),Rd.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),D._frustum.setFromProjectionMatrix(Rd,k.coordinateSystem,k.reversedDepth)}if(D.map.isWebGLCubeRenderTarget)i.setRenderTarget(D.map,W),i.clear();else{W===0&&(i.setRenderTarget(D.map),i.clear());let k=D.getViewport(W);o.set(r.x*k.x,r.y*k.y,r.x*k.z,r.y*k.w),b.viewport(o)}n=D.getFrustum(W),y(M,E,tt,F,Z,this.type)}D.isPointLightShadow!==!0&&this.type===hr&&x(D,E),D.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(N,C,L)};function x(T,M){let E=t.update(v);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new pn(s.x,s.y,{format:Ki,type:Pn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),p.uniforms.shadow_pass.value=T.map.depthTexture,p.uniforms.resolution.value.set(T.map.width,T.map.height),p.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(M,null,E,p,v,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(M,null,E,d,v,null)}function _(T,M,E,N){let C=null,L=E.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)C=L;else if(C=E.isPointLight===!0?l:a,i.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0||M.alphaToCoverage===!0){let b=C.uuid,R=M.uuid,S=c[b];S===void 0&&(S={},c[b]=S);let P=S[R];P===void 0&&(P=C.clone(),S[R]=P,M.addEventListener("dispose",w)),C=P}if(C.visible=M.visible,C.wireframe=M.wireframe,N===hr?C.side=M.shadowSide!==null?M.shadowSide:M.side:C.side=M.shadowSide!==null?M.shadowSide:h[M.side],C.alphaMap=M.alphaMap,C.alphaTest=M.alphaToCoverage===!0?.5:M.alphaTest,C.map=M.map,C.clipShadows=M.clipShadows,C.clippingPlanes=M.clippingPlanes,C.clipIntersection=M.clipIntersection,C.displacementMap=M.displacementMap,C.displacementScale=M.displacementScale,C.displacementBias=M.displacementBias,C.wireframeLinewidth=M.wireframeLinewidth,C.linewidth=M.linewidth,E.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let b=i.properties.get(C);b.light=E}return C}function y(T,M,E,N,C,L){if(T.visible===!1)return;if(T.layers.test(C)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&L===hr)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,T.matrixWorld);let S=t.update(T),P=T.material;if(Array.isArray(P)){let F=S.groups;for(let D=0,H=F.length;D<H;D++){let B=F[D],z=P[B.materialIndex];if(z&&z.visible){let Z=_(T,z,N,L);T.onBeforeShadow(i,T,M,E,S,Z,B),i.renderBufferDirect(E,null,S,Z,T,B),T.onAfterShadow(i,T,M,E,S,Z,B)}}}else if(P.visible){let F=_(T,P,N,L);T.onBeforeShadow(i,T,M,E,S,F,null),i.renderBufferDirect(E,null,S,F,T,null),T.onAfterShadow(i,T,M,E,S,F,null)}}let R=T.children;for(let S=0,P=R.length;S<P;S++)y(R[S],M,E,N,C,L)}function w(T){T.target.removeEventListener("dispose",w);for(let E in c){let N=c[E],C=T.target.uuid;C in N&&(N[C].dispose(),delete N[C])}}}function xv(i,t){function e(){let G=!1,at=new Xe,st=null,bt=new Xe(0,0,0,0);return{setMask:function(_t){st!==_t&&!G&&(i.colorMask(_t,_t,_t,_t),st=_t)},setLocked:function(_t){G=_t},setClear:function(_t,St,Yt,ue,vt){vt===!0&&(_t*=ue,St*=ue,Yt*=ue),at.set(_t,St,Yt,ue),bt.equals(at)===!1&&(i.clearColor(_t,St,Yt,ue),bt.copy(at))},reset:function(){G=!1,st=null,bt.set(-1,0,0,0)}}}function n(){let G=!1,at=!1,st=null,bt=null,_t=null;return{setReversed:function(St){if(at!==St){let Yt=t.get("EXT_clip_control");St?Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.ZERO_TO_ONE_EXT):Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.NEGATIVE_ONE_TO_ONE_EXT),at=St;let ue=_t;_t=null,this.setClear(ue)}},getReversed:function(){return at},setTest:function(St){St?dt(i.DEPTH_TEST):Pt(i.DEPTH_TEST)},setMask:function(St){st!==St&&!G&&(i.depthMask(St),st=St)},setFunc:function(St){if(at&&(St=Zu[St]),bt!==St){switch(St){case aa:i.depthFunc(i.NEVER);break;case la:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case Ks:i.depthFunc(i.LEQUAL);break;case ha:i.depthFunc(i.EQUAL);break;case ua:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}bt=St}},setLocked:function(St){G=St},setClear:function(St){_t!==St&&(_t=St,at&&(St=1-St),i.clearDepth(St))},reset:function(){G=!1,st=null,bt=null,_t=null,at=!1}}}function s(){let G=!1,at=null,st=null,bt=null,_t=null,St=null,Yt=null,ue=null,vt=null;return{setTest:function(Vt){G||(Vt?dt(i.STENCIL_TEST):Pt(i.STENCIL_TEST))},setMask:function(Vt){at!==Vt&&!G&&(i.stencilMask(Vt),at=Vt)},setFunc:function(Vt,le,It){(st!==Vt||bt!==le||_t!==It)&&(i.stencilFunc(Vt,le,It),st=Vt,bt=le,_t=It)},setOp:function(Vt,le,It){(St!==Vt||Yt!==le||ue!==It)&&(i.stencilOp(Vt,le,It),St=Vt,Yt=le,ue=It)},setLocked:function(Vt){G=Vt},setClear:function(Vt){vt!==Vt&&(i.clearStencil(Vt),vt=Vt)},reset:function(){G=!1,at=null,st=null,bt=null,_t=null,St=null,Yt=null,ue=null,vt=null}}}let r=new e,o=new n,a=new s,l={},c=new WeakMap,u={},h={},p={},d=new WeakMap,g=[],v=null,m=!1,f=null,x=null,_=null,y=null,w=null,T=null,M=null,E=new Bt(0,0,0),N=0,C=!1,L=null,b=null,R=null,S=null,P=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),D=!1,H=0,B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(B)[1]),D=H>=1):B.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),D=H>=2);let z=null,Z={},W=i.getParameter(i.SCISSOR_BOX),tt=i.getParameter(i.VIEWPORT),k=new Xe().fromArray(W),ut=new Xe().fromArray(tt);function pt(G,at,st,bt){let _t=new Uint8Array(4),St=i.createTexture();i.bindTexture(G,St),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Yt=0;Yt<st;Yt++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(at,0,i.RGBA,1,1,bt,0,i.RGBA,i.UNSIGNED_BYTE,_t):i.texImage2D(at+Yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_t);return St}let Tt={};Tt[i.TEXTURE_2D]=pt(i.TEXTURE_2D,i.TEXTURE_2D,1),Tt[i.TEXTURE_CUBE_MAP]=pt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Tt[i.TEXTURE_2D_ARRAY]=pt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Tt[i.TEXTURE_3D]=pt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),dt(i.DEPTH_TEST),o.setFunc(Ks),et(!1),lt(Pc),dt(i.CULL_FACE),ft(Ss);function dt(G){u[G]!==!0&&(i.enable(G),u[G]=!0)}function Pt(G){u[G]!==!1&&(i.disable(G),u[G]=!1)}function te(G,at){return p[G]!==at?(i.bindFramebuffer(G,at),p[G]=at,G===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=at),G===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=at),!0):!1}function Rt(G,at){let st=g,bt=!1;if(G){st=d.get(at),st===void 0&&(st=[],d.set(at,st));let _t=G.textures;if(st.length!==_t.length||st[0]!==i.COLOR_ATTACHMENT0){for(let St=0,Yt=_t.length;St<Yt;St++)st[St]=i.COLOR_ATTACHMENT0+St;st.length=_t.length,bt=!0}}else st[0]!==i.BACK&&(st[0]=i.BACK,bt=!0);bt&&i.drawBuffers(st)}function Ht(G){return v!==G?(i.useProgram(G),v=G,!0):!1}let gt={[bs]:i.FUNC_ADD,[xu]:i.FUNC_SUBTRACT,[vu]:i.FUNC_REVERSE_SUBTRACT};gt[_u]=i.MIN,gt[yu]=i.MAX;let j={[Mu]:i.ZERO,[Su]:i.ONE,[bu]:i.SRC_COLOR,[Dc]:i.SRC_ALPHA,[Cu]:i.SRC_ALPHA_SATURATE,[Ru]:i.DST_COLOR,[Eu]:i.DST_ALPHA,[wu]:i.ONE_MINUS_SRC_COLOR,[Nc]:i.ONE_MINUS_SRC_ALPHA,[Au]:i.ONE_MINUS_DST_COLOR,[Tu]:i.ONE_MINUS_DST_ALPHA,[Pu]:i.CONSTANT_COLOR,[Iu]:i.ONE_MINUS_CONSTANT_COLOR,[Lu]:i.CONSTANT_ALPHA,[Du]:i.ONE_MINUS_CONSTANT_ALPHA};function ft(G,at,st,bt,_t,St,Yt,ue,vt,Vt){if(G===Ss){m===!0&&(Pt(i.BLEND),m=!1);return}if(m===!1&&(dt(i.BLEND),m=!0),G!==gu){if(G!==f||Vt!==C){if((x!==bs||w!==bs)&&(i.blendEquation(i.FUNC_ADD),x=bs,w=bs),Vt)switch(G){case $i:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ei:i.blendFunc(i.ONE,i.ONE);break;case Ic:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Lc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:re("WebGLState: Invalid blending: ",G);break}else switch(G){case $i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ei:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ic:re("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lc:re("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:re("WebGLState: Invalid blending: ",G);break}_=null,y=null,T=null,M=null,E.set(0,0,0),N=0,f=G,C=Vt}return}_t=_t||at,St=St||st,Yt=Yt||bt,(at!==x||_t!==w)&&(i.blendEquationSeparate(gt[at],gt[_t]),x=at,w=_t),(st!==_||bt!==y||St!==T||Yt!==M)&&(i.blendFuncSeparate(j[st],j[bt],j[St],j[Yt]),_=st,y=bt,T=St,M=Yt),(ue.equals(E)===!1||vt!==N)&&(i.blendColor(ue.r,ue.g,ue.b,vt),E.copy(ue),N=vt),f=G,C=!1}function $(G,at){G.side===xe?Pt(i.CULL_FACE):dt(i.CULL_FACE);let st=G.side===xn;at&&(st=!st),et(st),G.blending===$i&&G.transparent===!1?ft(Ss):ft(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),o.setFunc(G.depthFunc),o.setTest(G.depthTest),o.setMask(G.depthWrite),r.setMask(G.colorWrite);let bt=G.stencilWrite;a.setTest(bt),bt&&(a.setMask(G.stencilWriteMask),a.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),a.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),wt(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?dt(i.SAMPLE_ALPHA_TO_COVERAGE):Pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(G){L!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),L=G)}function lt(G){G!==fu?(dt(i.CULL_FACE),G!==b&&(G===Pc?i.cullFace(i.BACK):G===pu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pt(i.CULL_FACE),b=G}function Ut(G){G!==R&&(D&&i.lineWidth(G),R=G)}function wt(G,at,st){G?(dt(i.POLYGON_OFFSET_FILL),(S!==at||P!==st)&&(S=at,P=st,o.getReversed()&&(at=-at,st=-st),i.polygonOffset(at,st))):Pt(i.POLYGON_OFFSET_FILL)}function Zt(G){G?dt(i.SCISSOR_TEST):Pt(i.SCISSOR_TEST)}function Kt(G){G===void 0&&(G=i.TEXTURE0+F-1),z!==G&&(i.activeTexture(G),z=G)}function se(G,at,st){st===void 0&&(z===null?st=i.TEXTURE0+F-1:st=z);let bt=Z[st];bt===void 0&&(bt={type:void 0,texture:void 0},Z[st]=bt),(bt.type!==G||bt.texture!==at)&&(z!==st&&(i.activeTexture(st),z=st),i.bindTexture(G,at||Tt[G]),bt.type=G,bt.texture=at)}function X(){let G=Z[z];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function fe(){try{i.compressedTexImage2D(...arguments)}catch(G){re("WebGLState:",G)}}function ee(){try{i.compressedTexImage3D(...arguments)}catch(G){re("WebGLState:",G)}}function qt(){try{i.texSubImage2D(...arguments)}catch(G){re("WebGLState:",G)}}function xt(){try{i.texSubImage3D(...arguments)}catch(G){re("WebGLState:",G)}}function Ue(){try{i.compressedTexSubImage2D(...arguments)}catch(G){re("WebGLState:",G)}}function $t(){try{i.compressedTexSubImage3D(...arguments)}catch(G){re("WebGLState:",G)}}function Qt(){try{i.texStorage2D(...arguments)}catch(G){re("WebGLState:",G)}}function O(){try{i.texStorage3D(...arguments)}catch(G){re("WebGLState:",G)}}function A(){try{i.texImage2D(...arguments)}catch(G){re("WebGLState:",G)}}function J(){try{i.texImage3D(...arguments)}catch(G){re("WebGLState:",G)}}function mt(G){return h[G]!==void 0?h[G]:i.getParameter(G)}function ht(G,at){h[G]!==at&&(i.pixelStorei(G,at),h[G]=at)}function Mt(G){k.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),k.copy(G))}function yt(G){ut.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),ut.copy(G))}function rt(G,at){let st=c.get(at);st===void 0&&(st=new WeakMap,c.set(at,st));let bt=st.get(G);bt===void 0&&(bt=i.getUniformBlockIndex(at,G.name),i.uniformBlockBinding(at,bt,bt),st.set(G,bt))}function ct(G,at,st){let _t=c.get(at).get(G);l[_t]!==st&&(i.bindBufferBase(i.UNIFORM_BUFFER,_t,st),l[_t]=st)}function Et(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},h={},z=null,Z={},p={},l={},d=new WeakMap,g=[],v=null,m=!1,f=null,x=null,_=null,y=null,w=null,T=null,M=null,E=new Bt(0,0,0),N=0,C=!1,L=null,b=null,R=null,S=null,P=null,k.set(0,0,i.canvas.width,i.canvas.height),ut.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:dt,disable:Pt,bindFramebuffer:te,drawBuffers:Rt,useProgram:Ht,setBlending:ft,setMaterial:$,setFlipSided:et,setCullFace:lt,setLineWidth:Ut,setPolygonOffset:wt,setScissorTest:Zt,activeTexture:Kt,bindTexture:se,unbindTexture:X,compressedTexImage2D:fe,compressedTexImage3D:ee,texImage2D:A,texImage3D:J,pixelStorei:ht,getParameter:mt,updateUBOMapping:rt,uniformBlockBinding:ct,texStorage2D:Qt,texStorage3D:O,texSubImage2D:qt,texSubImage3D:xt,compressedTexSubImage2D:Ue,compressedTexSubImage3D:$t,scissor:Mt,viewport:yt,reset:Et}}function vv(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,u=new WeakMap,h=new Set,p,d=new WeakMap,g=new Set,v=new FinalizationRegistry(O=>g.delete(O)),m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function f(O,A){return m?new OffscreenCanvas(O,A):Hr("canvas")}function x(O,A,J){let mt=1,ht=Qt(O);if((ht.width>J||ht.height>J)&&(mt=J/Math.max(ht.width,ht.height)),mt<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){let Mt=Math.floor(mt*ht.width),yt=Math.floor(mt*ht.height);p===void 0&&(p=f(Mt,yt));let rt=A?f(Mt,yt):p;return rt.width=Mt,rt.height=yt,rt.getContext("2d").drawImage(O,0,0,Mt,yt),oe("WebGLRenderer: Texture has been resized from ("+ht.width+"x"+ht.height+") to ("+Mt+"x"+yt+")."),rt}else return"data"in O&&oe("WebGLRenderer: Image in DataTexture is too big ("+ht.width+"x"+ht.height+")."),O;return O}function _(O){return O.generateMipmaps}function y(O){i.generateMipmap(O)}function w(O){return O.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?i.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(O,A,J,mt,ht,Mt=!1){if(O!==null){if(i[O]!==void 0)return i[O];oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let yt;mt&&(yt=t.get("EXT_texture_norm16"),yt||oe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let rt=A;if(A===i.RED&&(J===i.FLOAT&&(rt=i.R32F),J===i.HALF_FLOAT&&(rt=i.R16F),J===i.UNSIGNED_BYTE&&(rt=i.R8),J===i.UNSIGNED_SHORT&&yt&&(rt=yt.R16_EXT),J===i.SHORT&&yt&&(rt=yt.R16_SNORM_EXT)),A===i.RED_INTEGER&&(J===i.UNSIGNED_BYTE&&(rt=i.R8UI),J===i.UNSIGNED_SHORT&&(rt=i.R16UI),J===i.UNSIGNED_INT&&(rt=i.R32UI),J===i.BYTE&&(rt=i.R8I),J===i.SHORT&&(rt=i.R16I),J===i.INT&&(rt=i.R32I)),A===i.RG&&(J===i.FLOAT&&(rt=i.RG32F),J===i.HALF_FLOAT&&(rt=i.RG16F),J===i.UNSIGNED_BYTE&&(rt=i.RG8),J===i.UNSIGNED_SHORT&&yt&&(rt=yt.RG16_EXT),J===i.SHORT&&yt&&(rt=yt.RG16_SNORM_EXT)),A===i.RG_INTEGER&&(J===i.UNSIGNED_BYTE&&(rt=i.RG8UI),J===i.UNSIGNED_SHORT&&(rt=i.RG16UI),J===i.UNSIGNED_INT&&(rt=i.RG32UI),J===i.BYTE&&(rt=i.RG8I),J===i.SHORT&&(rt=i.RG16I),J===i.INT&&(rt=i.RG32I)),A===i.RGB_INTEGER&&(J===i.UNSIGNED_BYTE&&(rt=i.RGB8UI),J===i.UNSIGNED_SHORT&&(rt=i.RGB16UI),J===i.UNSIGNED_INT&&(rt=i.RGB32UI),J===i.BYTE&&(rt=i.RGB8I),J===i.SHORT&&(rt=i.RGB16I),J===i.INT&&(rt=i.RGB32I)),A===i.RGBA_INTEGER&&(J===i.UNSIGNED_BYTE&&(rt=i.RGBA8UI),J===i.UNSIGNED_SHORT&&(rt=i.RGBA16UI),J===i.UNSIGNED_INT&&(rt=i.RGBA32UI),J===i.BYTE&&(rt=i.RGBA8I),J===i.SHORT&&(rt=i.RGBA16I),J===i.INT&&(rt=i.RGBA32I)),A===i.RGB&&(J===i.UNSIGNED_SHORT&&yt&&(rt=yt.RGB16_EXT),J===i.SHORT&&yt&&(rt=yt.RGB16_SNORM_EXT),J===i.UNSIGNED_INT_5_9_9_9_REV&&(rt=i.RGB9_E5),J===i.UNSIGNED_INT_10F_11F_11F_REV&&(rt=i.R11F_G11F_B10F)),A===i.RGBA){let ct=Mt?Br:ye.getTransfer(ht);J===i.FLOAT&&(rt=i.RGBA32F),J===i.HALF_FLOAT&&(rt=i.RGBA16F),J===i.UNSIGNED_BYTE&&(rt=ct===Le?i.SRGB8_ALPHA8:i.RGBA8),J===i.UNSIGNED_SHORT&&yt&&(rt=yt.RGBA16_EXT),J===i.SHORT&&yt&&(rt=yt.RGBA16_SNORM_EXT),J===i.UNSIGNED_SHORT_4_4_4_4&&(rt=i.RGBA4),J===i.UNSIGNED_SHORT_5_5_5_1&&(rt=i.RGB5_A1)}return(rt===i.R16F||rt===i.R32F||rt===i.RG16F||rt===i.RG32F||rt===i.RGBA16F||rt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function M(O,A){let J;return O?A===null||A===ni||A===Es?J=i.DEPTH24_STENCIL8:A===Xn?J=i.DEPTH32F_STENCIL8:A===dr&&(J=i.DEPTH24_STENCIL8,oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ni||A===Es?J=i.DEPTH_COMPONENT24:A===Xn?J=i.DEPTH_COMPONENT32F:A===dr&&(J=i.DEPTH_COMPONENT16),J}function E(O,A){return _(O)===!0||O.isFramebufferTexture&&O.minFilter!==cn&&O.minFilter!==Qe?Math.log2(Math.max(A.width,A.height))+1:O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?A.mipmaps.length:1}function N(O){let A=new WeakRef(O);n.get(O).__ref=A,g.add(A),v.register(O,A,A)}function C(O){let A=n.get(O).__ref;A!==void 0&&(g.delete(A),v.unregister(A))}function L(O){R(O.target)}function b(O){S(O.target)}function R(O){O.removeEventListener("dispose",L),C(O),F(O),O.isVideoTexture&&u.delete(O),O.isHTMLTexture&&h.delete(O)}function S(O){O.removeEventListener("dispose",b),C(O),H(O)}function P(){for(let O of g){let A=O.deref();A!==void 0&&(A.isRenderTarget===!0?S(A):R(A))}g.clear(),h.clear()}function F(O){let A=n.get(O);if(A.__webglInit===void 0)return;let J=O.source,mt=d.get(J);if(mt){let ht=mt[A.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&D(O),Object.keys(mt).length===0&&d.delete(J)}n.remove(O)}function D(O){let A=n.get(O);i.deleteTexture(A.__webglTexture);let J=O.source,mt=d.get(J);delete mt[A.__cacheKey],o.memory.textures--}function H(O){let A=n.get(O);A.__depthDisposeCallback&&A.__depthDisposeCallback();let J=O.depthTexture;if(J&&J.renderTarget===O&&R(J),O.isWebGLCubeRenderTarget)for(let ht=0;ht<6;ht++){if(Array.isArray(A.__webglFramebuffer[ht]))for(let Mt=0;Mt<A.__webglFramebuffer[ht].length;Mt++)i.deleteFramebuffer(A.__webglFramebuffer[ht][Mt]);else i.deleteFramebuffer(A.__webglFramebuffer[ht]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[ht])}else{if(Array.isArray(A.__webglFramebuffer))for(let ht=0;ht<A.__webglFramebuffer.length;ht++)i.deleteFramebuffer(A.__webglFramebuffer[ht]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ht=0;ht<A.__webglColorRenderbuffer.length;ht++)A.__webglColorRenderbuffer[ht]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[ht]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}let mt=O.textures;for(let ht=0,Mt=mt.length;ht<Mt;ht++){let yt=n.get(mt[ht]);yt.__webglTexture&&(i.deleteTexture(yt.__webglTexture),o.memory.textures--),n.remove(mt[ht])}n.remove(O)}let B=0;function z(){B=0}function Z(){return B}function W(O){B=O}function tt(){let O=B;return O>=s.maxTextures&&oe("WebGLTextures: Trying to use "+(O+1)+" texture units while this GPU supports only "+s.maxTextures),B+=1,O}function k(O){let A=[];return A.push(O.wrapS),A.push(O.wrapT),A.push(O.wrapR||0),A.push(O.magFilter),A.push(O.minFilter),A.push(O.anisotropy),A.push(O.internalFormat),A.push(O.format),A.push(O.type),A.push(O.generateMipmaps),A.push(O.mipmapsAutoUpdate),A.push(O.premultiplyAlpha),A.push(O.flipY),A.push(O.unpackAlignment),A.push(O.colorSpace),A.join()}function ut(O,A){let J=n.get(O);if(O.isVideoTexture&&Ue(O),O.isRenderTargetTexture===!1&&O.isExternalTexture!==!0&&O.version>0&&J.__version!==O.version){let mt=O.image;if(mt===null)oe("WebGLRenderer: Texture marked for update but no image data found.");else if(mt.complete===!1)oe("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,O,A);return}}else O.isExternalTexture&&(J.__webglTexture=O.sourceTexture?O.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,J.__webglTexture,i.TEXTURE0+A)}function pt(O,A){let J=n.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&J.__version!==O.version){$(J,O,A);return}else O.isExternalTexture&&(J.__webglTexture=O.sourceTexture?O.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,J.__webglTexture,i.TEXTURE0+A)}function Tt(O,A){let J=n.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&J.__version!==O.version){$(J,O,A);return}e.bindTexture(i.TEXTURE_3D,J.__webglTexture,i.TEXTURE0+A)}function dt(O,A){let J=n.get(O);if(O.version>0&&J.__version!==O.version){et(J,O,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture,i.TEXTURE0+A)}let Pt={[js]:i.REPEAT,[ai]:i.CLAMP_TO_EDGE,[pa]:i.MIRRORED_REPEAT},te={[cn]:i.NEAREST,[Fu]:i.NEAREST_MIPMAP_NEAREST,[po]:i.NEAREST_MIPMAP_LINEAR,[Qe]:i.LINEAR,[Xa]:i.LINEAR_MIPMAP_NEAREST,[Di]:i.LINEAR_MIPMAP_LINEAR},Rt={[ku]:i.NEVER,[Kc]:i.ALWAYS,[zu]:i.LESS,[Jc]:i.LEQUAL,[Vu]:i.EQUAL,[$c]:i.GEQUAL,[Gu]:i.GREATER,[Wu]:i.NOTEQUAL};function Ht(O,A){if(A.type===Xn&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===Qe||A.magFilter===Xa||A.magFilter===po||A.magFilter===Di||A.minFilter===Qe||A.minFilter===Xa||A.minFilter===po||A.minFilter===Di)&&oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(O,i.TEXTURE_WRAP_S,Pt[A.wrapS]),i.texParameteri(O,i.TEXTURE_WRAP_T,Pt[A.wrapT]),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,Pt[A.wrapR]),i.texParameteri(O,i.TEXTURE_MAG_FILTER,te[A.magFilter]),i.texParameteri(O,i.TEXTURE_MIN_FILTER,te[A.minFilter]),A.compareFunction&&(i.texParameteri(O,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(O,i.TEXTURE_COMPARE_FUNC,Rt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===cn||A.minFilter!==po&&A.minFilter!==Di||A.type===Xn&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){let J=t.get("EXT_texture_filter_anisotropic");i.texParameterf(O,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function gt(O,A){let J=!1;O.__webglInit===void 0&&(O.__webglInit=!0,A.addEventListener("dispose",L),N(A));let mt=A.source,ht=d.get(mt);ht===void 0&&(ht={},d.set(mt,ht));let Mt=k(A);if(Mt!==O.__cacheKey){ht[Mt]===void 0&&(ht[Mt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,J=!0),ht[Mt].usedTimes++;let yt=ht[O.__cacheKey];yt!==void 0&&(ht[O.__cacheKey].usedTimes--,yt.usedTimes===0&&D(A)),O.__cacheKey=Mt,O.__webglTexture=ht[Mt].texture}return J}function j(O,A,J){return Math.floor(Math.floor(O/J)/A)}function ft(O,A,J,mt){let Mt=O.updateRanges;if(Mt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,J,mt,A.data);else{Mt.sort((G,at)=>G.start-at.start);let yt=0;for(let G=1;G<Mt.length;G++){let at=Mt[yt],st=Mt[G],bt=at.start+at.count,_t=j(st.start,A.width,4),St=j(at.start,A.width,4);st.start<=bt+1&&_t===St&&j(st.start+st.count-1,A.width,4)===_t?at.count=Math.max(at.count,st.start+st.count-at.start):(++yt,Mt[yt]=st)}Mt.length=yt+1;let rt=e.getParameter(i.UNPACK_ROW_LENGTH),ct=e.getParameter(i.UNPACK_SKIP_PIXELS),Et=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let G=0,at=Mt.length;G<at;G++){let st=Mt[G],bt=Math.floor(st.start/4),_t=Math.ceil(st.count/4),St=bt%A.width,Yt=Math.floor(bt/A.width),ue=_t,vt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,St),e.pixelStorei(i.UNPACK_SKIP_ROWS,Yt),e.texSubImage2D(i.TEXTURE_2D,0,St,Yt,ue,vt,J,mt,A.data)}O.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,rt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,ct),e.pixelStorei(i.UNPACK_SKIP_ROWS,Et)}}function $(O,A,J){let mt=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(mt=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(mt=i.TEXTURE_3D);let ht=gt(O,A),Mt=A.source;e.bindTexture(mt,O.__webglTexture,i.TEXTURE0+J);let yt=n.get(Mt);if(Mt.version!==yt.__version||ht===!0){if(e.activeTexture(i.TEXTURE0+J),(typeof ImageBitmap<"u"&&A.image instanceof ImageBitmap)===!1){let vt=ye.getPrimaries(ye.workingColorSpace),Vt=A.colorSpace===ii?null:ye.getPrimaries(A.colorSpace),le=A.colorSpace===ii||vt===Vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,le)}e.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment);let ct=x(A.image,!1,s.maxTextureSize);ct=$t(A,ct);let Et=r.convert(A.format,A.colorSpace),G=r.convert(A.type),at=T(A.internalFormat,Et,G,A.normalized,A.colorSpace,A.isVideoTexture);Ht(mt,A);let st,bt=A.mipmaps,_t=A.isVideoTexture!==!0,St=yt.__version===void 0||ht===!0,Yt=Mt.dataReady,ue=E(A,ct);if(A.isDepthTexture)at=M(A.format===Ni,A.type),St&&(_t?e.texStorage2D(i.TEXTURE_2D,1,at,ct.width,ct.height):e.texImage2D(i.TEXTURE_2D,0,at,ct.width,ct.height,0,Et,G,null));else if(A.isDataTexture)if(bt.length>0){_t&&St&&e.texStorage2D(i.TEXTURE_2D,ue,at,bt[0].width,bt[0].height);for(let vt=0,Vt=bt.length;vt<Vt;vt++)st=bt[vt],_t?Yt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,st.width,st.height,Et,G,st.data):e.texImage2D(i.TEXTURE_2D,vt,at,st.width,st.height,0,Et,G,st.data);A.generateMipmaps=!1}else _t?(St&&e.texStorage2D(i.TEXTURE_2D,ue,at,ct.width,ct.height),Yt&&ft(A,ct,Et,G)):e.texImage2D(i.TEXTURE_2D,0,at,ct.width,ct.height,0,Et,G,ct.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){_t&&St&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ue,at,bt[0].width,bt[0].height,ct.depth);for(let vt=0,Vt=bt.length;vt<Vt;vt++)if(st=bt[vt],A.format!==Hn)if(Et!==null)if(_t){if(Yt)if(A.layerUpdates.size>0){let le=rh(st.width,st.height,A.format,A.type);for(let It of A.layerUpdates){let Ee=st.data.subarray(It*le/st.data.BYTES_PER_ELEMENT,(It+1)*le/st.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,It,st.width,st.height,1,Et,Ee)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,st.width,st.height,ct.depth,Et,st.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,vt,at,st.width,st.height,ct.depth,0,st.data,0,0);else oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else _t?Yt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,st.width,st.height,ct.depth,Et,G,st.data):e.texImage3D(i.TEXTURE_2D_ARRAY,vt,at,st.width,st.height,ct.depth,0,Et,G,st.data);A.layerUpdates.size>0&&A.clearLayerUpdates()}else{_t&&St&&e.texStorage2D(i.TEXTURE_2D,ue,at,bt[0].width,bt[0].height);for(let vt=0,Vt=bt.length;vt<Vt;vt++)st=bt[vt],A.format!==Hn?Et!==null?_t?Yt&&e.compressedTexSubImage2D(i.TEXTURE_2D,vt,0,0,st.width,st.height,Et,st.data):e.compressedTexImage2D(i.TEXTURE_2D,vt,at,st.width,st.height,0,st.data):oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):_t?Yt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,st.width,st.height,Et,G,st.data):e.texImage2D(i.TEXTURE_2D,vt,at,st.width,st.height,0,Et,G,st.data)}else if(A.isDataArrayTexture)if(_t){if(St&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ue,at,ct.width,ct.height,ct.depth),Yt)if(A.layerUpdates.size>0){let vt=rh(ct.width,ct.height,A.format,A.type);for(let Vt of A.layerUpdates){let le=ct.data.subarray(Vt*vt/ct.data.BYTES_PER_ELEMENT,(Vt+1)*vt/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Vt,ct.width,ct.height,1,Et,G,le)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,Et,G,ct.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,at,ct.width,ct.height,ct.depth,0,Et,G,ct.data);else if(A.isData3DTexture)_t?(St&&e.texStorage3D(i.TEXTURE_3D,ue,at,ct.width,ct.height,ct.depth),Yt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,Et,G,ct.data)):e.texImage3D(i.TEXTURE_3D,0,at,ct.width,ct.height,ct.depth,0,Et,G,ct.data);else if(A.isFramebufferTexture){if(St)if(_t)e.texStorage2D(i.TEXTURE_2D,ue,at,ct.width,ct.height);else{let vt=ct.width,Vt=ct.height;for(let le=0;le<ue;le++)e.texImage2D(i.TEXTURE_2D,le,at,vt,Vt,0,Et,G,null),vt>>=1,Vt>>=1}}else if(A.isHTMLTexture){if("texElementImage2D"in i){let vt=i.canvas;if(vt.hasAttribute("layoutsubtree")||vt.setAttribute("layoutsubtree","true"),ct.parentNode!==vt){vt.appendChild(ct),h.add(A),vt.onpaint=Vt=>{let le=Vt.changedElements;for(let It of h)le.includes(It.image)&&(It.needsUpdate=!0)},vt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ct);else{let le=i.RGBA,It=i.RGBA,Ee=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,le,It,Ee,ct)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(bt.length>0){if(_t&&St){let vt=Qt(bt[0]);e.texStorage2D(i.TEXTURE_2D,ue,at,vt.width,vt.height)}for(let vt=0,Vt=bt.length;vt<Vt;vt++)st=bt[vt],_t?Yt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,Et,G,st):e.texImage2D(i.TEXTURE_2D,vt,at,Et,G,st);A.generateMipmaps=!1}else if(_t){if(St){let vt=Qt(ct);e.texStorage2D(i.TEXTURE_2D,ue,at,vt.width,vt.height)}Yt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,G,ct)}else e.texImage2D(i.TEXTURE_2D,0,at,Et,G,ct);_(A)&&A.mipmapsAutoUpdate===!0&&y(mt),yt.__version=Mt.version,A.onUpdate&&A.onUpdate(A)}O.__version=A.version}function et(O,A,J){if(A.image.length!==6)return;let mt=gt(O,A),ht=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+J);let Mt=n.get(ht);if(ht.version!==Mt.__version||mt===!0){e.activeTexture(i.TEXTURE0+J);let yt=ye.getPrimaries(ye.workingColorSpace),rt=A.colorSpace===ii?null:ye.getPrimaries(A.colorSpace),ct=A.colorSpace===ii||yt===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);let Et=A.isCompressedTexture||A.image[0].isCompressedTexture,G=A.image[0]&&A.image[0].isDataTexture,at=[];for(let It=0;It<6;It++)!Et&&!G?at[It]=x(A.image[It],!0,s.maxCubemapSize):at[It]=G?A.image[It].image:A.image[It],at[It]=$t(A,at[It]);let st=at[0],bt=r.convert(A.format,A.colorSpace),_t=r.convert(A.type),St=T(A.internalFormat,bt,_t,A.normalized,A.colorSpace),Yt=A.isVideoTexture!==!0,ue=Mt.__version===void 0||mt===!0,vt=ht.dataReady,Vt=E(A,st);Ht(i.TEXTURE_CUBE_MAP,A);let le;if(A.isDepthTexture){if(St=M(A.format===Ni,A.type),ue)if(Yt)e.texStorage2D(i.TEXTURE_CUBE_MAP,1,St,st.width,st.height);else for(let It=0;It<6;It++)e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,St,st.width,st.height,0,bt,_t,null)}else if(Et){Yt&&ue&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Vt,St,st.width,st.height);for(let It=0;It<6;It++){le=at[It].mipmaps;for(let Ee=0;Ee<le.length;Ee++){let Ze=le[Ee];A.format!==Hn?bt!==null?Yt?vt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,0,0,Ze.width,Ze.height,bt,Ze.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,St,Ze.width,Ze.height,0,Ze.data):oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Yt?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,0,0,Ze.width,Ze.height,bt,_t,Ze.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee,St,Ze.width,Ze.height,0,bt,_t,Ze.data)}}}else{if(le=A.mipmaps,Yt&&ue){le.length>0&&Vt++;let It=Qt(at[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Vt,St,It.width,It.height)}for(let It=0;It<6;It++)if(G){Yt?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,0,0,at[It].width,at[It].height,bt,_t,at[It].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,St,at[It].width,at[It].height,0,bt,_t,at[It].data);for(let Ee=0;Ee<le.length;Ee++){let Dn=le[Ee].image[It].image;Yt?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,0,0,Dn.width,Dn.height,bt,_t,Dn.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,St,Dn.width,Dn.height,0,bt,_t,Dn.data)}}else{Yt?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,0,0,bt,_t,at[It]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,St,bt,_t,at[It]);for(let Ee=0;Ee<le.length;Ee++){let Ze=le[Ee];Yt?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,0,0,bt,_t,Ze.image[It]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,Ee+1,St,bt,_t,Ze.image[It])}}}_(A)&&A.mipmapsAutoUpdate===!0&&y(i.TEXTURE_CUBE_MAP),Mt.__version=ht.version,A.onUpdate&&A.onUpdate(A)}O.__version=A.version}function lt(O,A,J,mt,ht,Mt){let yt=r.convert(J.format,J.colorSpace),rt=r.convert(J.type),ct=T(J.internalFormat,yt,rt,J.normalized,J.colorSpace),Et=n.get(A),G=n.get(J);if(G.__renderTarget=A,!Et.__hasExternalTextures){let at=Math.max(1,A.width>>Mt),st=Math.max(1,A.height>>Mt);ht===i.TEXTURE_3D||ht===i.TEXTURE_2D_ARRAY?e.texImage3D(ht,Mt,ct,at,st,A.depth,0,yt,rt,null):e.texImage2D(ht,Mt,ct,at,st,0,yt,rt,null)}e.bindFramebuffer(i.FRAMEBUFFER,O),xt(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,mt,ht,G.__webglTexture,0,qt(A)):(ht===i.TEXTURE_2D||ht>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,mt,ht,G.__webglTexture,Mt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(O,A,J){if(i.bindRenderbuffer(i.RENDERBUFFER,O),A.depthBuffer){let mt=A.depthTexture,ht=mt&&mt.isDepthTexture?mt.type:null,Mt=M(A.stencilBuffer,ht),yt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;xt(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,qt(A),Mt,A.width,A.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,qt(A),Mt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Mt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,yt,i.RENDERBUFFER,O)}else{let mt=A.textures;for(let ht=0;ht<mt.length;ht++){let Mt=mt[ht],yt=r.convert(Mt.format,Mt.colorSpace),rt=r.convert(Mt.type),ct=T(Mt.internalFormat,yt,rt,Mt.normalized,Mt.colorSpace);xt(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,qt(A),ct,A.width,A.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,qt(A),ct,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,ct,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function wt(O,A,J){let mt=A.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,O),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ht=n.get(A.depthTexture);ht.__renderTarget=A;let Mt=mt?A.depthTexture.image[0]:A.depthTexture.image;(!ht.__webglTexture||Mt.width!==A.width||Mt.height!==A.height)&&(Mt.width=A.width,Mt.height=A.height,A.depthTexture.needsUpdate=!0),mt?dt(A.depthTexture,0):ut(A.depthTexture,0);let yt=ht.__webglTexture,rt=qt(A),ct=mt?i.TEXTURE_CUBE_MAP_POSITIVE_X+J:i.TEXTURE_2D,Et=A.depthTexture.format===Ni?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(A.depthTexture.format===Ei)xt(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Et,ct,yt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,Et,ct,yt,0);else if(A.depthTexture.format===Ni)xt(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Et,ct,yt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,Et,ct,yt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Zt(O){let A=n.get(O),J=O.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==O.depthTexture){let mt=O.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),mt){let ht=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,mt.removeEventListener("dispose",ht)};mt.addEventListener("dispose",ht),A.__depthDisposeCallback=ht}A.__boundDepthTexture=mt}if(O.depthTexture&&!A.__autoAllocateDepthBuffer)if(J)for(let mt=0;mt<6;mt++)wt(A.__webglFramebuffer[mt],O,mt);else O.texture.mipmaps.length>0?wt(A.__webglFramebuffer[0],O,0):wt(A.__webglFramebuffer,O,0);else if(J){A.__webglDepthbuffer=[];for(let mt=0;mt<6;mt++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[mt]),A.__webglDepthbuffer[mt]===void 0)A.__webglDepthbuffer[mt]=i.createRenderbuffer(),Ut(A.__webglDepthbuffer[mt],O,!1);else{let ht=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=A.__webglDepthbuffer[mt];i.bindRenderbuffer(i.RENDERBUFFER,Mt),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,Mt)}}else if(O.texture.mipmaps.length>0?e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),Ut(A.__webglDepthbuffer,O,!1);else{let ht=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Mt),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,Mt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Kt(O,A,J){let mt=n.get(O);A!==void 0&&lt(mt.__webglFramebuffer,O,O.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),J!==void 0&&Zt(O)}function se(O){let A=O.texture,J=n.get(O),mt=n.get(A);O.addEventListener("dispose",b),N(O);let ht=O.textures,Mt=O.isWebGLCubeRenderTarget===!0,yt=ht.length>1;if(yt||(mt.__webglTexture===void 0&&(mt.__webglTexture=i.createTexture()),mt.__version=A.version,o.memory.textures++),Mt){J.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(A.mipmaps.length>0){J.__webglFramebuffer[rt]=[];for(let ct=0;ct<A.mipmaps.length;ct++)J.__webglFramebuffer[rt][ct]=i.createFramebuffer()}else J.__webglFramebuffer[rt]=i.createFramebuffer()}else{if(A.mipmaps.length>0){J.__webglFramebuffer=[];for(let rt=0;rt<A.mipmaps.length;rt++)J.__webglFramebuffer[rt]=i.createFramebuffer()}else J.__webglFramebuffer=i.createFramebuffer();if(yt)for(let rt=0,ct=ht.length;rt<ct;rt++){let Et=n.get(ht[rt]);Et.__webglTexture===void 0&&(Et.__webglTexture=i.createTexture(),o.memory.textures++)}if(O.samples>0&&xt(O)===!1){J.__webglMultisampledFramebuffer=i.createFramebuffer(),J.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let rt=0;rt<ht.length;rt++){let ct=ht[rt];J.__webglColorRenderbuffer[rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,J.__webglColorRenderbuffer[rt]);let Et=r.convert(ct.format,ct.colorSpace),G=r.convert(ct.type),at=T(ct.internalFormat,Et,G,ct.normalized,ct.colorSpace,O.isXRRenderTarget===!0),st=qt(O);i.renderbufferStorageMultisample(i.RENDERBUFFER,st,at,O.width,O.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+rt,i.RENDERBUFFER,J.__webglColorRenderbuffer[rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),O.depthBuffer&&(J.__webglDepthRenderbuffer=i.createRenderbuffer(),Ut(J.__webglDepthRenderbuffer,O,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Mt){e.bindTexture(i.TEXTURE_CUBE_MAP,mt.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,A);for(let rt=0;rt<6;rt++)if(A.mipmaps.length>0)for(let ct=0;ct<A.mipmaps.length;ct++)lt(J.__webglFramebuffer[rt][ct],O,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,ct);else lt(J.__webglFramebuffer[rt],O,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);_(A)?y(i.TEXTURE_CUBE_MAP):A.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,A.mipmaps.length-1),e.unbindTexture()}else if(yt){for(let rt=0,ct=ht.length;rt<ct;rt++){let Et=ht[rt],G=n.get(Et),at=i.TEXTURE_2D;(O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(at=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(at,G.__webglTexture),Ht(at,Et),lt(J.__webglFramebuffer,O,Et,i.COLOR_ATTACHMENT0+rt,at,0),_(Et)&&y(at)}e.unbindTexture()}else{let rt=i.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(rt=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,mt.__webglTexture),Ht(rt,A),A.mipmaps.length>0)for(let ct=0;ct<A.mipmaps.length;ct++)lt(J.__webglFramebuffer[ct],O,A,i.COLOR_ATTACHMENT0,rt,ct);else lt(J.__webglFramebuffer,O,A,i.COLOR_ATTACHMENT0,rt,0);_(A)?y(rt):A.mipmaps.length>0&&i.texParameteri(rt,i.TEXTURE_MAX_LEVEL,A.mipmaps.length-1),e.unbindTexture()}O.depthBuffer&&Zt(O)}function X(O){let A=O.textures;for(let J=0,mt=A.length;J<mt;J++){let ht=A[J];if(_(ht)&&ht.mipmapsAutoUpdate===!0){let Mt=w(O),yt=n.get(ht).__webglTexture;e.bindTexture(Mt,yt),y(Mt),e.unbindTexture()}}}let fe=[];function ee(O){if(O.samples>0){if(xt(O)===!1){let A=O.textures,J=O.width,mt=O.height,ht=i.COLOR_BUFFER_BIT,Mt=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(O),rt=A.length>1;if(rt)for(let Et=0;Et<A.length;Et++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),O.texture.mipmaps.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Et=0;Et<A.length;Et++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(ht|=i.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(ht|=i.STENCIL_BUFFER_BIT)),rt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Et]);let G=n.get(A[Et]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,G,0)}i.blitFramebuffer(0,0,J,mt,0,0,J,mt,ht,i.NEAREST),l===!0&&(fe.length=0,fe.push(i.COLOR_ATTACHMENT0+Et),O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&fe.push(Mt),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,fe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),rt)for(let Et=0;Et<A.length;Et++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Et]);let G=n.get(A[Et]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,G,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&l){let A=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function qt(O){return Math.min(s.maxSamples,O.samples)}function xt(O){let A=n.get(O);return O.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ue(O){let A=o.render.frame;u.get(O)!==A&&(u.set(O,A),O.update())}function $t(O,A){let J=O.colorSpace,mt=O.format,ht=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||J!==Or&&J!==ii&&(ye.getTransfer(J)===Le?(mt!==Hn||ht!==Cn)&&oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):re("WebGLTextures: Unsupported texture color space:",J)),A}function Qt(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(c.width=O.naturalWidth||O.width,c.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(c.width=O.displayWidth,c.height=O.displayHeight):(c.width=O.width,c.height=O.height),c}this.allocateTextureUnit=tt,this.resetTextureUnits=z,this.getTextureUnits=Z,this.setTextureUnits=W,this.setTexture2D=ut,this.setTexture2DArray=pt,this.setTexture3D=Tt,this.setTextureCube=dt,this.rebindTextures=Kt,this.setupRenderTarget=se,this.updateRenderTargetMipmap=X,this.updateMultisampleRenderTarget=ee,this.setupDepthRenderbuffer=Zt,this.setupFrameBufferTexture=lt,this.useMultisampledRTT=xt,this.dispose=P}function _v(i,t){function e(n,s=ii){let r,o=ye.getTransfer(s);if(n===Cn)return i.UNSIGNED_BYTE;if(n===Ya)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Za)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Xc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===qc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Gc)return i.BYTE;if(n===Wc)return i.SHORT;if(n===dr)return i.UNSIGNED_SHORT;if(n===qa)return i.INT;if(n===ni)return i.UNSIGNED_INT;if(n===Xn)return i.FLOAT;if(n===Pn)return i.HALF_FLOAT;if(n===Yc)return i.ALPHA;if(n===Zc)return i.RGB;if(n===Hn)return i.RGBA;if(n===Ei)return i.DEPTH_COMPONENT;if(n===Ni)return i.DEPTH_STENCIL;if(n===Ja)return i.RED;if(n===$a)return i.RED_INTEGER;if(n===Ki)return i.RG;if(n===Ka)return i.RG_INTEGER;if(n===ja)return i.RGBA_INTEGER;if(n===mo||n===go||n===xo||n===vo)if(o===Le)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===mo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===go)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===mo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===go)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===vo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Qa||n===tl||n===el||n===nl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Qa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===tl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===el)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===nl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===il||n===sl||n===rl||n===ol||n===al||n===_o||n===ll)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===il||n===sl)return o===Le?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===rl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ol)return r.COMPRESSED_R11_EAC;if(n===al)return r.COMPRESSED_SIGNED_R11_EAC;if(n===_o)return r.COMPRESSED_RG11_EAC;if(n===ll)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===cl||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===xl||n===vl||n===_l||n===yl||n===Ml||n===Sl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===cl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===hl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ul)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===dl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===fl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===pl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ml)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===gl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===xl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===vl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===_l)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ml)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Sl)return o===Le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===bl||n===wl||n===El)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===bl)return o===Le?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===wl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===El)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Tl||n===Rl||n===yo||n===Al)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Tl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Rl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Al)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Es?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var yv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Mv=`
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

}`,_h=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new $r(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new gn({vertexShader:yv,fragmentShader:Mv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new it(new He(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},yh=class extends ci{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,p=null,d=null,g=null,v=typeof XRWebGLBinding<"u",m=new _h,f={},x=e.getContextAttributes(),_=null,y=null,w=[],T=[],M=new ot,E=null,N=null,C=new bn;C.viewport=new Xe;let L=new bn;L.viewport=new Xe;let b=[C,L],R=new za,S=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let ut=w[k];return ut===void 0&&(ut=new ir,w[k]=ut),ut.getTargetRaySpace()},this.getControllerGrip=function(k){let ut=w[k];return ut===void 0&&(ut=new ir,w[k]=ut),ut.getGripSpace()},this.getHand=function(k){let ut=w[k];return ut===void 0&&(ut=new ir,w[k]=ut),ut.getHandSpace()};function F(k){let ut=T.indexOf(k.inputSource);if(ut===-1)return;let pt=w[ut];pt!==void 0&&(pt.update(k.inputSource,k.frame,c||o),pt.dispatchEvent({type:k.type,data:k.inputSource}))}function D(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",D),s.removeEventListener("inputsourceschange",H);for(let k=0;k<w.length;k++){let ut=T[k];ut!==null&&(T[k]=null,w[k].disconnect(ut))}S=null,P=null,m.reset();for(let k in f)delete f[k];if(t.setRenderTarget(_),d=null,p=null,h=null,s=null,y=null,tt.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(M.width,M.height,!1),N!==null){let k=N.camera;k.fov=N.fov,k.zoom=N.zoom,k.updateProjectionMatrix(),N=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(_=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",D),s.addEventListener("inputsourceschange",H),x.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(M),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,Tt=null,dt=null;x.depth&&(dt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,pt=x.stencil?Ni:Ei,Tt=x.stencil?Es:ni);let Pt={colorFormat:e.RGBA8,depthFormat:dt,scaleFactor:r};h=this.getBinding(),p=h.createProjectionLayer(Pt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),y=new pn(p.textureWidth,p.textureHeight,{format:Hn,type:Cn,depthTexture:new Ci(p.textureWidth,p.textureHeight,Tt,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}else{let pt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,pt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new pn(d.framebufferWidth,d.framebufferHeight,{format:Hn,type:Cn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),tt.setContext(s),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function H(k){for(let ut=0;ut<k.removed.length;ut++){let pt=k.removed[ut],Tt=T.indexOf(pt);Tt>=0&&(T[Tt]=null,w[Tt].disconnect(pt))}for(let ut=0;ut<k.added.length;ut++){let pt=k.added[ut],Tt=T.indexOf(pt);if(Tt===-1){for(let Pt=0;Pt<w.length;Pt++)if(Pt>=T.length){T.push(pt),Tt=Pt;break}else if(T[Pt]===null){T[Pt]=pt,Tt=Pt;break}if(Tt===-1)break}let dt=w[Tt];dt&&dt.connect(pt)}}function B(k,ut){ut===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(ut.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;let ut=k.near,pt=k.far;m.texture!==null&&(m.depthNear>0&&(ut=m.depthNear),m.depthFar>0&&(pt=m.depthFar)),R.near=L.near=C.near=ut,R.far=L.far=C.far=pt,(S!==R.near||P!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),S=R.near,P=R.far),R.layers.mask=k.layers.mask|6,C.layers.mask=R.layers.mask&-5,L.layers.mask=R.layers.mask&-3;let Tt=k.parent,dt=R.cameras;B(R,Tt);for(let Pt=0;Pt<dt.length;Pt++)B(dt[Pt],Tt);R.projectionMatrix.copy(C.projectionMatrix),R.projectionMatrixInverse.copy(C.projectionMatrixInverse),N===null&&k.isPerspectiveCamera&&(N={camera:k,fov:k.fov,zoom:k.zoom}),z(k,R,Tt)};function z(k,ut,pt){pt===null?k.matrix.copy(ut.matrixWorld):(k.matrix.copy(pt.matrixWorld),k.matrix.invert(),k.matrix.multiply(ut.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(ut.projectionMatrix),k.projectionMatrixInverse.copy(ut.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=ga*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(p===null&&d===null))return l},this.setFoveation=function(k){l=k,p!==null&&(p.fixedFoveation=k),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=k)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(R)},this.getCameraTexture=function(k){return f[k]};let Z=null;function W(k,ut){if(u=ut.getViewerPose(c||o),g=ut,u!==null){let pt=u.views;d!==null&&(t.setRenderTargetFramebuffer(y,d.framebuffer),t.setRenderTarget(y));let Tt=!1;pt.length!==R.cameras.length&&(R.cameras.length=0,Tt=!0);for(let Rt=0;Rt<pt.length;Rt++){let Ht=pt[Rt],gt=null;if(d!==null)gt=d.getViewport(Ht);else{let ft=h.getViewSubImage(p,Ht);gt=ft.viewport,Rt===0&&(t.setRenderTargetTextures(y,ft.colorTexture,ft.depthStencilTexture),t.setRenderTarget(y))}let j=b[Rt];j===void 0&&(j=new bn,j.layers.enable(Rt),j.viewport=new Xe,b[Rt]=j),j.matrix.fromArray(Ht.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(Ht.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(gt.x,gt.y,gt.width,gt.height),Rt===0&&(R.matrix.copy(j.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),Tt===!0&&R.cameras.push(j)}let dt=s.enabledFeatures;if(dt&&dt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){h=n.getBinding();let Rt=h.getDepthInformation(pt[0]);Rt&&Rt.isValid&&Rt.texture&&m.init(Rt,s.renderState)}if(dt&&dt.includes("camera-access")&&v){t.state.unbindTexture(),h=n.getBinding();for(let Rt=0;Rt<pt.length;Rt++){let Ht=pt[Rt].camera;if(Ht){let gt=f[Ht];gt||(gt=new $r,f[Ht]=gt);let j=h.getCameraImage(Ht);gt.sourceTexture=j}}}}for(let pt=0;pt<w.length;pt++){let Tt=T[pt],dt=w[pt];Tt!==null&&dt!==void 0&&dt.update(Tt,ut,c||o)}Z&&Z(k,ut),ut.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ut}),g=null}let tt=new Ad;tt.setAnimationLoop(W),this.setAnimationLoop=function(k){Z=k},this.dispose=function(){}}},Sv=new Te,Bd=new ce;Bd.set(-1,0,0,0,1,0,0,0,1);function bv(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,nh(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,x,_,y){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(m,f):f.isMeshLambertMaterial?(r(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(m,f),p(m,f),f.isMeshPhysicalMaterial&&d(m,f,y)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),v(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,x,_):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===xn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===xn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let x=t.get(f),_=x.envMap,y=x.envMapRotation;_&&(m.envMap.value=_,m.envMapRotation.value.setFromMatrix4(Sv.makeRotationFromEuler(y)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Bd),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,x,_){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*x,m.scale.value=_*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function p(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function d(m,f,x){m.ior.value=f.ior,f.diffuseRoughness>0&&(m.diffuseRoughness.value=f.diffuseRoughness,f.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=f.diffuseRoughnessMap,e(f.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===xn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=f.iridescenceThicknessMaximum,f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){let x=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function wv(i,t,e,n){let s={},r={};function o(x,_){let y=_.program;n.uniformBlockBinding(x,y,s[x.id])}function a(x,_){let y=s[x.id];y===void 0&&(g(x),y=l(x),s[x.id]=y,x.addEventListener("dispose",m));let w=_.program;n.updateUBOMapping(x,w);let T=t.render.frame;r[x.id]!==T&&(c(x),r[x.id]=T)}function l(x){let _=i.createBuffer(),y=x.__size,w=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,y,w),i.bindBuffer(i.UNIFORM_BUFFER,null),_}function c(x){let _=s[x.id],y=x.uniforms,w=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let T=0,M=y.length;T<M;T++){let E=y[T];if(Array.isArray(E))for(let N=0,C=E.length;N<C;N++)u(E[N],T,N,w);else u(E,T,0,w)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(x,_,y,w){if(p(x,_,y,w)===!0){let T=x.__offset,M=x.value;if(Array.isArray(M)){let E=0;for(let N=0;N<M.length;N++){let C=M[N],L=v(C,!0);h(C,x.__data,E),E+=L.storage/Float32Array.BYTES_PER_ELEMENT}}else h(M,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,T,x.__data)}}function h(x,_,y){typeof x=="number"||typeof x=="boolean"?_[y]=x:x.isMatrix3?(_[y]=x.elements[0],_[y+1]=x.elements[1],_[y+2]=x.elements[2],_[y+3]=0,_[y+4]=x.elements[3],_[y+5]=x.elements[4],_[y+6]=x.elements[5],_[y+7]=0,_[y+8]=x.elements[6],_[y+9]=x.elements[7],_[y+10]=x.elements[8],_[y+11]=0):ArrayBuffer.isView(x)?_.set(x.subarray(0,_.length-y),y):x.toArray(_,y)}function p(x,_,y,w){let T=x.value,M=_+"_"+y;if(Array.isArray(T)){w[M]===void 0&&(w[M]=[]);let E=w[M],N=!1;for(let C=0;C<T.length;C++)d(T[C],E,C)===!0&&(N=!0);return N}return d(T,w,M)}function d(x,_,y){if(_[y]===void 0)return typeof x=="number"||typeof x=="boolean"?_[y]=x:ArrayBuffer.isView(x)?_[y]=x.slice():_[y]=x.clone(),!0;{let w=_[y];if(typeof x=="number"||typeof x=="boolean"){if(w!==x)return _[y]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(w.equals(x)===!1)return w.copy(x),!0}}return!1}function g(x){let _=x.uniforms,y=0,w=16;for(let M=0,E=_.length;M<E;M++){let N=Array.isArray(_[M])?_[M]:[_[M]];for(let C=0,L=N.length;C<L;C++){let b=N[C],R=Array.isArray(b.value)?b.value:[b.value],S=Array.isArray(_[M])||Array.isArray(b.value),P=y;for(let D=0,H=R.length;D<H;D++){let B=R[D],z=v(B,S),Z=y%w,W=Z%z.boundary,tt=Z+W;y+=W,tt!==0&&w-tt<z.storage&&(y+=w-tt),D===0&&(P=y),y+=z.storage}let F=b.type==="int"?Int32Array:b.type==="uint"?Uint32Array:Float32Array;b.__data=new F((y-P)/Float32Array.BYTES_PER_ELEMENT),b.__offset=P}}let T=y%w;return T>0&&(y+=w-T),x.__size=y,x.__cache={},this}function v(x,_){let y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=16,y.storage=48):x.isMatrix4?(y.boundary=16,y.storage=64):x.isTexture?oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(y.boundary=16,y.storage=x.byteLength):oe("WebGLRenderer: Unsupported uniform value type.",x),_===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function m(x){let _=x.target;_.removeEventListener("dispose",m),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function f(){for(let x in s)i.deleteBuffer(s[x]);s={},r={}}return{bind:o,update:a,dispose:f}}var Ev=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),pi=null;function Tv(){return pi===null&&(pi=new ps(Ev,16,16,Ki,Pn),pi.name="DFG_LUT",pi.minFilter=Qe,pi.magFilter=Qe,pi.wrapS=ai,pi.wrapT=ai,pi.generateMipmaps=!1,pi.needsUpdate=!0),pi}var Dl=class{constructor(t={}){let{canvas:e=Xu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:p=!1,outputBufferType:d=Cn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let v=d,m=new Set([ja,Ka,$a]),f=new Set([Cn,ni,dr,Es,Ya,Za]),x=new Uint32Array(4),_=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},w=null,T=null,M=[],E=[],N=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,L=!1,b=null,R=null,S=null,P=null;this._outputColorSpace=en;let F=0,D=0,H=null,B=-1,z=null,Z=new Xe,W=new Xe,tt=null,k=new Bt(0),ut=0,pt=e.width,Tt=e.height,dt=1,Pt=null,te=null,Rt=new Xe(0,0,pt,Tt),Ht=new Xe(0,0,pt,Tt),gt=!1,j=new Wi,ft=new Ma,$=!1,et=!1,lt=new Te,Ut=new U,wt=new Xe,Zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Kt=!1;function se(){return H===null?dt:1}let X=n;function fe(I,Y){return e.getContext(I,Y)}let ee,qt,xt,Ue,$t,Qt,O,A,J,mt,ht,Mt,yt,rt,ct,Et,G,at,st,bt,_t,St,Yt;try{let I={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"187"}`),e.addEventListener("webglcontextlost",Vt,!1),e.addEventListener("webglcontextrestored",le,!1),e.addEventListener("webglcontextcreationerror",It,!1),X===null){let Y="webgl2";if(X=fe(Y,I),X===null)throw fe(Y)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ue()}catch(I){throw e.removeEventListener("webglcontextlost",Vt,!1),e.removeEventListener("webglcontextrestored",le,!1),e.removeEventListener("webglcontextcreationerror",It,!1),re("WebGLRenderer: "+I.message),I}function ue(){ee=new Og(X),ee.init(),_t=new _v(X,ee),qt=new Tg(X,ee,t,_t),xt=new xv(X,ee),qt.reversedDepthBuffer&&p&&xt.buffers.depth.setReversed(!0),R=X.createFramebuffer(),S=X.createFramebuffer(),P=X.createFramebuffer(),Ue=new kg(X),$t=new iv,Qt=new vv(X,ee,xt,$t,qt,_t,Ue),O=new Fg(C),A=new V0(X),St=new wg(X,A),J=new Bg(X,A,Ue,St),mt=new Vg(X,J,A,St,Ue),at=new zg(X,qt,Qt),ct=new Rg($t),ht=new nv(C,O,ee,qt,St,ct),Mt=new bv(C,$t),yt=new rv,rt=new uv(ee),G=new bg(C,O,xt,mt,g,l),Et=new gv(C,mt,qt),Yt=new wv(X,Ue,qt,xt),st=new Eg(X,ee,Ue),bt=new Hg(X,ee,Ue),Ue.programs=ht.programs,C.capabilities=qt,C.extensions=ee,C.properties=$t,C.renderLists=yt,C.shadowMap=Et,C.state=xt,C.info=Ue}v!==Cn&&(N=new Wg(v,e.width,e.height,a,s,r));let vt=new yh(C,X);this.xr=vt,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){let I=ee.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){let I=ee.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return dt},this.setPixelRatio=function(I){I!==void 0&&(dt=I,this.setSize(pt,Tt,!1))},this.getSize=function(I){return I.set(pt,Tt)},this.setSize=function(I,Y,nt=!0){if(vt.isPresenting){oe("WebGLRenderer: Can't change size while VR device is presenting.");return}pt=I,Tt=Y,e.width=Math.floor(I*dt),e.height=Math.floor(Y*dt),nt===!0&&(e.style.width=I+"px",e.style.height=Y+"px"),N!==null&&N.setSize(e.width,e.height),this.setViewport(0,0,I,Y)},this.getDrawingBufferSize=function(I){return I.set(pt*dt,Tt*dt).floor()},this.setDrawingBufferSize=function(I,Y,nt){pt=I,Tt=Y,dt=nt,e.width=Math.floor(I*nt),e.height=Math.floor(Y*nt),this.setViewport(0,0,I,Y)},this.setEffects=function(I){if(v===Cn){re("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(I){for(let Y=0;Y<I.length;Y++)if(I[Y].isOutputPass===!0){oe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}N.setEffects(I||[])},this.getCurrentViewport=function(I){return I.copy(Z)},this.getViewport=function(I){return I.copy(Rt)},this.setViewport=function(I,Y,nt,K){I.isVector4?Rt.set(I.x,I.y,I.z,I.w):Rt.set(I,Y,nt,K),xt.viewport(Z.copy(Rt).multiplyScalar(se()).round())},this.getScissor=function(I){return I.copy(Ht)},this.setScissor=function(I,Y,nt,K){I.isVector4?Ht.set(I.x,I.y,I.z,I.w):Ht.set(I,Y,nt,K),xt.scissor(W.copy(Ht).multiplyScalar(se()).round())},this.getScissorTest=function(){return gt},this.setScissorTest=function(I){xt.setScissorTest(gt=I)},this.setOpaqueSort=function(I){Pt=I},this.setTransparentSort=function(I){te=I},this.getClearColor=function(I){return I.copy(G.getClearColor())},this.setClearColor=function(){G.setClearColor(...arguments)},this.getClearAlpha=function(){return G.getClearAlpha()},this.setClearAlpha=function(){G.setClearAlpha(...arguments)},this.clear=function(I=!0,Y=!0,nt=!0){let K=0;if(I){let Q=!1;if(H!==null){let Ct=H.texture.format;Q=m.has(Ct)}if(Q){let Ct=H.texture.type,kt=f.has(Ct),At=G.getClearColor(),Ft=G.getClearAlpha(),Jt=At.r,de=At.g,ve=At.b;kt?(x[0]=Jt,x[1]=de,x[2]=ve,x[3]=Ft,X.clearBufferuiv(X.COLOR,0,x)):(_[0]=Jt,_[1]=de,_[2]=ve,_[3]=Ft,X.clearBufferiv(X.COLOR,0,_))}else K|=X.COLOR_BUFFER_BIT}Y&&(K|=X.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),nt&&(K|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K!==0&&X.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(I){I.setRenderer(this),b=I},this.dispose=function(){e.removeEventListener("webglcontextlost",Vt,!1),e.removeEventListener("webglcontextrestored",le,!1),e.removeEventListener("webglcontextcreationerror",It,!1),G.dispose(),yt.dispose(),rt.dispose(),Qt.dispose(),$t.dispose(),O.dispose(),mt.dispose(),J.dispose(),St.dispose(),Yt.dispose(),ht.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",Mr),vt.removeEventListener("sessionend",Fi),ri.stop()};function Vt(I){I.preventDefault(),kr("WebGLRenderer: Context Lost."),L=!0}function le(){kr("WebGLRenderer: Context Restored."),L=!1;let I=Ue.autoReset,Y=Et.enabled,nt=Et.autoUpdate,K=Et.needsUpdate,Q=Et.type;ue(),Ue.autoReset=I,Et.enabled=Y,Et.autoUpdate=nt,Et.needsUpdate=K,Et.type=Q}function It(I){re("WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function Ee(I){let Y=I.target;Y.removeEventListener("dispose",Ee),Ze(Y)}function Ze(I){Dn(I),$t.remove(I)}function Dn(I){let Y=$t.get(I).programs;Y!==void 0&&(Y.forEach(function(nt){ht.releaseProgram(nt)}),I.isShaderMaterial&&ht.releaseShaderCache(I))}this.renderBufferDirect=function(I,Y,nt,K,Q,Ct){Y===null&&(Y=Zt);let kt=Q.isMesh&&Q.matrixWorld.determinantAffine()<0,At=ze(I,Y,nt,K,Q);xt.setMaterial(K,kt);let Ft=nt.index,Jt=1;if(K.wireframe===!0){if(Ft=J.getWireframeAttribute(nt),Ft===void 0)return;Jt=2}let de=nt.drawRange,ve=nt.attributes.position,Gt=de.start*Jt,_e=(de.start+de.count)*Jt;Ct!==null&&(Gt=Math.max(Gt,Ct.start*Jt),_e=Math.min(_e,(Ct.start+Ct.count)*Jt)),Ft!==null?(Gt=Math.max(Gt,0),_e=Math.min(_e,Ft.count)):ve!=null&&(Gt=Math.max(Gt,0),_e=Math.min(_e,ve.count));let Ke=_e-Gt;if(Ke<0||Ke===1/0)return;St.setup(Q,K,At,nt,Ft);let ke,Be=st;if(Ft!==null&&(ke=A.get(Ft),Be=bt,Be.setIndex(ke)),Q.isMesh)K.wireframe===!0?(xt.setLineWidth(K.wireframeLinewidth*se()),Be.setMode(X.LINES)):Be.setMode(X.TRIANGLES);else if(Q.isLine){let _n=K.linewidth;_n===void 0&&(_n=1),xt.setLineWidth(_n*se()),Q.isLineSegments?Be.setMode(X.LINES):Q.isLineLoop?Be.setMode(X.LINE_LOOP):Be.setMode(X.LINE_STRIP)}else Q.isPoints?Be.setMode(X.POINTS):Q.isSprite&&Be.setMode(X.TRIANGLES);if(Q.isBatchedMesh)if(ee.get("WEBGL_multi_draw"))Be.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else{let _n=Q._multiDrawStarts,Wt=Q._multiDrawCounts,Tn=Q._multiDrawCount,Ae=Ft?A.get(Ft).bytesPerElement:1,os=$t.get(K).currentProgram.getUniforms();for(let yn=0;yn<Tn;yn++)os.setValue(X,"_gl_DrawID",yn),Be.render(_n[yn]/Ae,Wt[yn])}else if(Q.isInstancedMesh)Be.renderInstances(Gt,Ke,Q.count);else if(nt.isInstancedBufferGeometry){let _n=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,Wt=Math.min(nt.instanceCount,_n);Be.renderInstances(Gt,Ke,Wt)}else Be.render(Gt,Ke)};function yr(I,Y,nt,K){b!==null&&I.isNodeMaterial&&b.setObject(K,I),$===!0&&ct.setState(I,nt,!1),I.transparent===!0&&I.side===xe&&I.forceSinglePass===!1?(I.side=xn,I.needsUpdate=!0,ae(I,Y,K),I.side=Ji,I.needsUpdate=!0,ae(I,Y,K),I.side=xe):ae(I,Y,K)}this.compile=function(I,Y,nt=null){nt===null&&(nt=I),b!==null&&b.renderStart(I,Y,nt),T=rt.get(nt),T.init(Y),E.push(T),nt.traverseVisible(function(Q){Q.isLight&&Q.layers.test(Y.layers)&&(T.pushLight(Q),Q.castShadow&&T.pushShadow(Q))}),I!==nt&&I.traverseVisible(function(Q){Q.isLight&&Q.layers.test(Y.layers)&&(T.pushLight(Q),Q.castShadow&&T.pushShadow(Q))}),T.setupLights(),b!==null&&b.updateLights(T.state.lightsArray),et=this.localClippingEnabled,$=ct.init(this.clippingPlanes,et),$===!0&&ct.setGlobalState(this.clippingPlanes,Y),b!==null&&Et.render(T.state.shadowsArray,nt,Y);let K=new Set;return I.traverse(function(Q){if(!(Q.isMesh||Q.isPoints||Q.isLine||Q.isSprite))return;let Ct=Q.material;if(Ct)if(Array.isArray(Ct))for(let kt=0;kt<Ct.length;kt++){let At=Ct[kt];yr(At,nt,Y,Q),K.add(At)}else yr(Ct,nt,Y,Q),K.add(Ct)}),T=E.pop(),b!==null&&b.renderEnd(),K},this.compileAsync=function(I,Y,nt=null){let K=this.compile(I,Y,nt);return new Promise(Q=>{function Ct(){if(K.forEach(function(kt){let Ft=$t.get(kt).currentProgram;(Ft===void 0||Ft.isReady())&&K.delete(kt)}),K.size===0){Q(I);return}setTimeout(Ct,10)}ee.get("KHR_parallel_shader_compile")!==null?Ct():setTimeout(Ct,10)})};let Cs=null;function Io(I){Cs&&Cs(I)}function Mr(){ri.stop()}function Fi(){ri.start()}let ri=new Ad;ri.setAnimationLoop(Io),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(I){Cs=I,vt.setAnimationLoop(I),I===null?ri.stop():ri.start()},vt.addEventListener("sessionstart",Mr),vt.addEventListener("sessionend",Fi),this.render=function(I,Y){if(Y!==void 0&&Y.isCamera!==!0){re("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;b!==null&&b.renderStart(I,Y);let nt=vt.enabled===!0&&vt.isPresenting===!0,K=N!==null&&(H===null||nt)&&N.begin(C,H);if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(Y),Y=vt.getCamera()),I.isScene===!0&&I.onBeforeRender(C,I,Y,H),T=rt.get(I,E.length),T.init(Y),T.state.textureUnits=Qt.getTextureUnits(),E.push(T),lt.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Y.isArrayCamera?ft.setFromArrayCamera(Y):j.setFromProjectionMatrix(lt,Vn,Y.reversedDepth),et=this.localClippingEnabled,$=ct.init(this.clippingPlanes,et),w=yt.get(I,M.length),w.init(),M.push(w),this.info.render.frame++,vt.enabled===!0&&vt.isPresenting===!0){let kt=C.xr.getDepthSensingMesh();kt!==null&&Oi(kt,Y,-1/0,C.sortObjects)}Oi(I,Y,0,C.sortObjects),w.finish(),b!==null&&b.updateLights(T.state.lightsArray),C.sortObjects===!0&&w.sort(Pt,te),Kt=vt.enabled===!1||vt.isPresenting===!1||vt.hasDepthSensing()===!1,Kt&&G.addToRenderList(w,I),this.info.autoReset===!0&&this.info.reset(),$===!0&&ct.beginShadows();let Q=T.state.shadowsArray;if(Et.render(Q,I,Y),$===!0&&ct.endShadows(),(K&&N.hasRenderPass())===!1){let kt=w.opaque,At=w.transmissive;if(T.setupLights(),Y.isArrayCamera){let Ft=Y.cameras;if(At.length>0)for(let Jt=0,de=Ft.length;Jt<de;Jt++){let ve=Ft[Jt];Sr(kt,At,I,ve)}Kt&&G.render(I);for(let Jt=0,de=Ft.length;Jt<de;Jt++){let ve=Ft[Jt];$n(w,I,ve,ve.viewport)}}else At.length>0&&Sr(kt,At,I,Y),Kt&&G.render(I),$n(w,I,Y)}H!==null&&D===0&&(Qt.updateMultisampleRenderTarget(H),Qt.updateRenderTargetMipmap(H)),K&&N.end(C),I.isScene===!0&&I.onAfterRender(C,I,Y),St.resetDefaultState(),B=-1,z=null,E.pop(),E.length>0?(T=E[E.length-1],Qt.setTextureUnits(T.state.textureUnits),$===!0&&ct.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,M.pop(),M.length>0?w=M[M.length-1]:w=null,b!==null&&b.renderEnd()};function Oi(I,Y,nt,K){if(I.visible===!1)return;if(I.layers.test(Y.layers)){if(I.isGroup)nt=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(Y);else if(I.isLight)T.pushLight(I),I.castShadow&&T.pushShadow(I);else if(I.isSprite){let kt=Y.isArrayCamera?ft:j;if(!I.frustumCulled||I.intersectsFrustum(kt)){K&&wt.setFromMatrixPosition(I.matrixWorld).applyMatrix4(lt);let At=mt.update(I),Ft=I.material;Ft.visible&&w.push(I,At,Ft,nt,wt.z,null,Y)}}else if(I.isMesh||I.isLine||I.isPoints){let kt=Y.isArrayCamera?ft:j;if(!I.frustumCulled||I.intersectsFrustum(kt)){let At=mt.update(I),Ft=I.material;if(K&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),wt.copy(I.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),wt.copy(At.boundingSphere.center)),wt.applyMatrix4(I.matrixWorld).applyMatrix4(lt)),Array.isArray(Ft)){let Jt=At.groups;for(let de=0,ve=Jt.length;de<ve;de++){let Gt=Jt[de],_e=Ft[Gt.materialIndex];_e&&_e.visible&&w.push(I,At,_e,nt,wt.z,Gt,Y)}}else Ft.visible&&w.push(I,At,Ft,nt,wt.z,null,Y)}}}let Ct=I.children;for(let kt=0,At=Ct.length;kt<At;kt++)Oi(Ct[kt],Y,nt,K)}function $n(I,Y,nt,K){let{opaque:Q,transmissive:Ct,transparent:kt}=I;T.setupLightsView(nt),$===!0&&ct.setGlobalState(C.clippingPlanes,nt),K&&xt.viewport(Z.copy(K)),Q.length>0&&ss(Q,Y,nt),Ct.length>0&&ss(Ct,Y,nt),kt.length>0&&ss(kt,Y,nt),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function Sr(I,Y,nt,K){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[K.id]===void 0){let Gt=ee.has("EXT_color_buffer_half_float")||ee.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[K.id]=new pn(1,1,{generateMipmaps:!0,type:Gt?Pn:Cn,minFilter:Di,samples:Math.max(4,qt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ye.workingColorSpace})}let Ct=T.state.transmissionRenderTarget[K.id],kt=K.viewport||Z;Ct.setSize(kt.z*C.transmissionResolutionScale,kt.w*C.transmissionResolutionScale);let At=C.getRenderTarget(),Ft=C.getActiveCubeFace(),Jt=C.getActiveMipmapLevel();C.setRenderTarget(Ct),C.getClearColor(k),ut=C.getClearAlpha(),ut<1&&C.setClearColor(16777215,.5),C.clear(),Kt&&G.render(nt);let de=C.toneMapping;C.toneMapping=fi;let ve=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),T.setupLightsView(K),$===!0&&ct.setGlobalState(C.clippingPlanes,K),ss(I,nt,K),Qt.updateMultisampleRenderTarget(Ct),Qt.updateRenderTargetMipmap(Ct),ee.has("WEBGL_multisampled_render_to_texture")===!1){let Gt=!1;for(let _e=0,Ke=Y.length;_e<Ke;_e++){let ke=Y[_e],{object:Be,geometry:_n,material:Wt,group:Tn}=ke;if(Wt.side===xe&&Be.layers.test(K.layers)){let Ae=Wt.side;Wt.side=xn,Wt.needsUpdate=!0,Ps(Be,nt,K,_n,Wt,Tn),Wt.side=Ae,Wt.needsUpdate=!0,Gt=!0}}Gt===!0&&(Qt.updateMultisampleRenderTarget(Ct),Qt.updateRenderTargetMipmap(Ct))}C.setRenderTarget(At,Ft,Jt),C.setClearColor(k,ut),ve!==void 0&&(K.viewport=ve),C.toneMapping=de}function ss(I,Y,nt){let K=Y.isScene===!0?Y.overrideMaterial:null;for(let Q=0,Ct=I.length;Q<Ct;Q++){let kt=I[Q],{object:At,geometry:Ft,group:Jt}=kt,de=kt.material;de.allowOverride===!0&&K!==null&&(de=K),At.layers.test(nt.layers)&&Ps(At,Y,nt,Ft,de,Jt)}}function Ps(I,Y,nt,K,Q,Ct){b!==null&&Q.isNodeMaterial&&b.setObject(I,Q),I.onBeforeRender(C,Y,nt,K,Q,Ct),I.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),Q.onBeforeRender(C,Y,nt,K,I,Ct),Q.transparent===!0&&Q.side===xe&&Q.forceSinglePass===!1?(Q.side=xn,Q.needsUpdate=!0,C.renderBufferDirect(nt,Y,K,Q,I,Ct),Q.side=Ji,Q.needsUpdate=!0,C.renderBufferDirect(nt,Y,K,Q,I,Ct),Q.side=xe):C.renderBufferDirect(nt,Y,K,Q,I,Ct),I.onAfterRender(C,Y,nt,K,Q,Ct)}function br(I){let Y=0;for(let nt of I)nt.texture!==null&&Y++;return Y}function ae(I,Y,nt){Y.isScene!==!0&&(Y=Zt);let K=$t.get(I),Q=T.state.lights,Ct=T.state.shadowsArray,kt=Q.state.version,At=ht.getParameters(I,Q.state,Ct,Y,nt,T.state.lightProbeGridArray),Ft=ht.getProgramCacheKey(At),Jt=K.programs;K.environment=I.isMeshStandardMaterial||I.isMeshLambertMaterial||I.isMeshPhongMaterial?Y.environment:null,K.fog=Y.fog;let de=I.isMeshStandardMaterial||I.isMeshLambertMaterial&&!I.envMap||I.isMeshPhongMaterial&&!I.envMap;K.envMap=O.get(I.envMap||K.environment,de),K.envMapRotation=K.environment!==null&&I.envMap===null?Y.environmentRotation:I.envMapRotation,Jt===void 0&&(I.addEventListener("dispose",Ee),Jt=new Map,K.programs=Jt,K.programVariants=new Map);let ve=Jt.get(Ft);if(ve!==void 0){if(K.currentProgram===ve&&K.lightsStateVersion===kt)return Ie(I,At),ve}else At.uniforms=ht.getUniforms(I),b!==null&&I.isNodeMaterial&&b.build(I,nt,At),I.onBeforeCompile(At,C),ve=ht.acquireProgram(At,Ft),Jt.set(Ft,ve),K.uniforms=At.uniforms;let Gt=K.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(Gt.clippingPlanes=ct.uniform),Ie(I,At),K.needsLights=Is(I),K.lightsStateVersion=kt,K.needsLights&&(Gt.ambientLightColor.value=Q.state.ambient,Gt.lightProbe.value=Q.state.probe,Gt.sunLights.value=Q.state.sun,Gt.sunLightShadows.value=Q.state.sunShadow,Gt.directionalLights.value=Q.state.directional,Gt.directionalLightShadows.value=Q.state.directionalShadow,Gt.spotLights.value=Q.state.spot,Gt.spotLightShadows.value=Q.state.spotShadow,Gt.rectAreaLights.value=Q.state.rectArea,Gt.ltc_1.value=Q.state.rectAreaLTC1,Gt.ltc_2.value=Q.state.rectAreaLTC2,Gt.pointLights.value=Q.state.point,Gt.pointLightShadows.value=Q.state.pointShadow,Gt.hemisphereLights.value=Q.state.hemi,Gt.sunShadowMatrix.value=Q.state.sunShadowMatrix,Gt.sunShadowCascade.value=Q.state.sunShadowCascade,Gt.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,Gt.spotLightMatrix.value=Q.state.spotLightMatrix,Gt.spotLightMap.value=Q.state.spotLightMap,Gt.pointShadowMatrix.value=Q.state.pointShadowMatrix),K.numLightProbeGrids=br(T.state.lightProbeGridArray),K.currentProgram=ve,K.uniformsList=null,ve}function ie(I,Y,nt,K,Q){let Ct=$t.get(I),kt=Ct.currentProgram.id+","+K+","+Q,At=Ct.programVariants.get(kt);return At===void 0?(At=ae(I,Y,nt),Ct.programVariants.set(kt,At)):(Ct.currentProgram=At,Ct.uniformsList=null,Ct.outputColorSpace=K,Ct.toneMapping=Q),At}function ge(I){if(I.uniformsList===null){let Y=I.currentProgram.getUniforms();I.uniformsList=fr.seqWithValue(Y.seq,I.uniforms)}return I.uniformsList}function Ie(I,Y){let nt=$t.get(I);nt.outputColorSpace=Y.outputColorSpace,nt.batching=Y.batching,nt.batchingColor=Y.batchingColor,nt.instancing=Y.instancing,nt.instancingColor=Y.instancingColor,nt.instancingMorph=Y.instancingMorph,nt.skinning=Y.skinning,nt.morphTargets=Y.morphTargets,nt.morphNormals=Y.morphNormals,nt.morphColors=Y.morphColors,nt.morphTargetsCount=Y.morphTargetsCount,nt.numClippingPlanes=Y.numClippingPlanes,nt.numIntersection=Y.numClipIntersection,nt.vertexAlphas=Y.vertexAlphas,nt.vertexTangents=Y.vertexTangents,nt.toneMapping=Y.toneMapping}function ze(I,Y,nt,K,Q){Y.isScene!==!0&&(Y=Zt),Qt.resetTextureUnits();let Ct=Y.fog,kt=K.isMeshStandardMaterial||K.isMeshLambertMaterial||K.isMeshPhongMaterial?Y.environment:null,At=H===null?C.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:ye.workingColorSpace,Ft=K.isMeshStandardMaterial||K.isMeshLambertMaterial&&!K.envMap||K.isMeshPhongMaterial&&!K.envMap,Jt=O.get(K.envMap||kt,Ft),de=K.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,ve=!!nt.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Gt=!!nt.morphAttributes.position,_e=!!nt.morphAttributes.normal,Ke=!!nt.morphAttributes.color,ke=fi;K.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(ke=C.toneMapping);let Be=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,_n=Be!==void 0?Be.length:0,Wt=$t.get(K),Tn=T.state.lights;if($===!0&&(et===!0||I!==z)){let qe=I===z&&K.id===B;ct.setState(K,I,qe)}let Ae=!1,os=!1;K.version===Wt.__version?Wt.needsLights&&Wt.lightsStateVersion!==Tn.state.version||Q.isBatchedMesh&&Wt.batching===!1||!Q.isBatchedMesh&&Wt.batching===!0||Q.isBatchedMesh&&Wt.batchingColor===!0&&Q._colorsTexture===null||Q.isBatchedMesh&&Wt.batchingColor===!1&&Q._colorsTexture!==null||Q.isInstancedMesh&&Wt.instancing===!1||!Q.isInstancedMesh&&Wt.instancing===!0||Q.isSkinnedMesh&&Wt.skinning===!1||!Q.isSkinnedMesh&&Wt.skinning===!0||Q.isInstancedMesh&&Wt.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&Wt.instancingColor===!1&&Q.instanceColor!==null||Q.isInstancedMesh&&Wt.instancingMorph===!0&&Q.morphTexture===null||Q.isInstancedMesh&&Wt.instancingMorph===!1&&Q.morphTexture!==null||Wt.envMap!==Jt||K.fog===!0&&Wt.fog!==Ct||Wt.numClippingPlanes!==void 0&&(Wt.numClippingPlanes!==ct.numPlanes||Wt.numIntersection!==ct.numIntersection)||Wt.vertexAlphas!==de||Wt.vertexTangents!==ve||Wt.morphTargets!==Gt||Wt.morphNormals!==_e||Wt.morphColors!==Ke||Wt.morphTargetsCount!==_n||Wt.numLightProbeGrids!==br(T.state.lightProbeGridArray)?Ae=!0:(Wt.outputColorSpace!==At||Wt.toneMapping!==ke)&&(os=!0):(Ae=!0,Wt.__version=K.version);let yn=Wt.currentProgram;(Ae===!0||os===!0)&&(yn=os===!0?ie(K,Y,Q,At,ke):ae(K,Y,Q),b&&K.isNodeMaterial&&b.onUpdateProgram(K,yn,Wt));let Lo=!1,Bi=!1,as=!1,be=yn.getUniforms(),un=Wt.uniforms;if(xt.useProgram(yn.program)&&(Lo=!0,Bi=!0,as=!0),K.id!==B&&(B=K.id,Bi=!0),Lo||z!==I){xt.buffers.depth.getReversed()&&I.reversedDepth!==!0&&(I._reversedDepth=!0,I.updateProjectionMatrix()),be.setValue(X,"projectionMatrix",I.projectionMatrix),be.setValue(X,"viewMatrix",I.matrixWorldInverse);let an=be.map.cameraPosition;an!==void 0&&an.setValue(X,Ut.setFromMatrixPosition(I.matrixWorld)),qt.logarithmicDepthBuffer&&be.setValue(X,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&be.setValue(X,"isOrthographic",I.isOrthographicCamera===!0),z!==I&&(z=I,Bi=!0,as=!0)}if(Wt.needsLights&&(Tn.state.sunShadowMap.length>0&&be.setValue(X,"sunShadowMap",Tn.state.sunShadowMap,Qt),Tn.state.directionalShadowMap.length>0&&be.setValue(X,"directionalShadowMap",Tn.state.directionalShadowMap,Qt),Tn.state.spotShadowMap.length>0&&be.setValue(X,"spotShadowMap",Tn.state.spotShadowMap,Qt),Tn.state.pointShadowMap.length>0&&be.setValue(X,"pointShadowMap",Tn.state.pointShadowMap,Qt)),Q.isSkinnedMesh){be.setOptional(X,Q,"bindMatrix"),be.setOptional(X,Q,"bindMatrixInverse");let qe=Q.skeleton;qe&&(qe.boneTexture===null&&qe.computeBoneTexture(),be.setValue(X,"boneTexture",qe.boneTexture,Qt))}Q.isBatchedMesh&&(be.setOptional(X,Q,"batchingTexture"),be.setValue(X,"batchingTexture",Q._matricesTexture,Qt),be.setOptional(X,Q,"batchingIdTexture"),be.setValue(X,"batchingIdTexture",Q._indirectTexture,Qt),be.setOptional(X,Q,"batchingColorTexture"),Q._colorsTexture!==null&&be.setValue(X,"batchingColorTexture",Q._colorsTexture,Qt));let Kn=nt.morphAttributes;if((Kn.position!==void 0||Kn.normal!==void 0||Kn.color!==void 0)&&at.update(Q,nt,yn),(Bi||Wt.receiveShadow!==Q.receiveShadow)&&(Wt.receiveShadow=Q.receiveShadow,be.setValue(X,"receiveShadow",Q.receiveShadow)),(K.isMeshStandardMaterial||K.isMeshLambertMaterial||K.isMeshPhongMaterial)&&K.envMap===null&&Y.environment!==null&&(un.envMapIntensity.value=Y.environmentIntensity),un.dfgLUT!==void 0&&(un.dfgLUT.value=Tv()),Bi){if(be.setValue(X,"toneMappingExposure",C.toneMappingExposure),Wt.needsLights&&$e(un,as),Ct&&K.fog===!0&&Mt.refreshFogUniforms(un,Ct),Mt.refreshMaterialUniforms(un,K,dt,Tt,T.state.transmissionRenderTarget[I.id]),Wt.needsLights&&Wt.numLightProbeGrids>0){let qe=y,an=0;for(let xi of T.state.lightProbeGridArray)xi.texture!==null&&(qe.textures[an]=xi.texture,qe.min[an]=xi.boundingBox.min,qe.max[an]=xi.boundingBox.max,qe.resolution[an]=xi.resolution,an++);for(let xi in qe)qe[xi].length=an;un.probesSH.value=qe.textures,un.probesMin.value=qe.min,un.probesMax.value=qe.max,un.probesResolution.value=qe.resolution}fr.upload(X,ge(Wt),un,Qt)}if(K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(fr.upload(X,ge(Wt),un,Qt),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&be.setValue(X,"center",Q.center),be.setValue(X,"modelViewMatrix",Q.modelViewMatrix),be.setValue(X,"normalMatrix",Q.normalMatrix),be.setValue(X,"modelMatrix",Q.matrixWorld),K.uniformsGroups!==void 0){let qe=K.uniformsGroups;for(let an=0,xi=qe.length;an<xi;an++){let Ph=qe[an];Yt.update(Ph,yn),Yt.bind(Ph,yn)}}return yn}function $e(I,Y){I.ambientLightColor.needsUpdate=Y,I.lightProbe.needsUpdate=Y,I.sunLights.needsUpdate=Y,I.sunLightShadows.needsUpdate=Y,I.directionalLights.needsUpdate=Y,I.directionalLightShadows.needsUpdate=Y,I.pointLights.needsUpdate=Y,I.pointLightShadows.needsUpdate=Y,I.spotLights.needsUpdate=Y,I.spotLightShadows.needsUpdate=Y,I.rectAreaLights.needsUpdate=Y,I.hemisphereLights.needsUpdate=Y}function Is(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(I,Y,nt){let K=$t.get(I);K.__autoAllocateDepthBuffer=I.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),$t.get(I.texture).__webglTexture=Y,$t.get(I.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:nt,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(I,Y){let nt=$t.get(I);nt.__webglFramebuffer=Y,nt.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(I,Y=0,nt=0){H=I,F=Y,D=nt;let K=null,Q=!1,Ct=!1;if(I){let At=$t.get(I);if(At.__useDefaultFramebuffer!==void 0){xt.bindFramebuffer(X.FRAMEBUFFER,At.__webglFramebuffer),Z.copy(I.viewport),W.copy(I.scissor),tt=I.scissorTest,xt.viewport(Z),xt.scissor(W),xt.setScissorTest(tt),B=-1;return}else if(At.__webglFramebuffer===void 0)Qt.setupRenderTarget(I);else if(At.__hasExternalTextures)Qt.rebindTextures(I,$t.get(I.texture).__webglTexture,$t.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){let de=I.depthTexture;if(At.__boundDepthTexture!==de){if(de!==null&&$t.has(de)&&(I.width!==de.image.width||I.height!==de.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Qt.setupDepthRenderbuffer(I)}}let Ft=I.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(Ct=!0);let Jt=$t.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(Jt[Y])?K=Jt[Y][nt]:K=Jt[Y],Q=!0):I.samples>0&&Qt.useMultisampledRTT(I)===!1?K=$t.get(I).__webglMultisampledFramebuffer:Array.isArray(Jt)?K=Jt[nt]:K=Jt,Z.copy(I.viewport),W.copy(I.scissor),tt=I.scissorTest}else Z.copy(Rt).multiplyScalar(dt).floor(),W.copy(Ht).multiplyScalar(dt).floor(),tt=gt;if(nt!==0&&(K=R),xt.bindFramebuffer(X.FRAMEBUFFER,K)&&xt.drawBuffers(I,K),xt.viewport(Z),xt.scissor(W),xt.setScissorTest(tt),Q){let At=$t.get(I.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+Y,At.__webglTexture,nt)}else if(Ct){let At=Y;for(let Ft=0;Ft<I.textures.length;Ft++){let Jt=$t.get(I.textures[Ft]);X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0+Ft,Jt.__webglTexture,nt,At)}}else if(I!==null&&nt!==0){let At=$t.get(I.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,At.__webglTexture,nt)}B=-1};function rs(I){let Y=$t.get(I);return(Y.__readFormat!==I.format||Y.__readType!==I.type)&&(Y.__readFormat=I.format,Y.__readType=I.type,Y.__formatReadable=qt.textureFormatReadable(I.format),Y.__typeReadable=qt.textureTypeReadable(I.type)),Y}this.readRenderTargetPixels=function(I,Y,nt,K,Q,Ct,kt,At=0){if(!(I&&I.isWebGLRenderTarget)){re("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=$t.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&kt!==void 0&&(Ft=Ft[kt],Array.isArray(Ft)&&(Ft=Ft[0])),Ft){xt.bindFramebuffer(X.FRAMEBUFFER,Ft);try{let Jt=I.textures[At],de=Jt.format,ve=Jt.type;I.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+At);let Gt=rs(Jt);if(Gt.__formatReadable===!1){re("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Gt.__typeReadable===!1){re("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=I.width-K&&nt>=0&&nt<=I.height-Q&&X.readPixels(Y,nt,K,Q,_t.convert(de),_t.convert(ve),Ct)}finally{let Jt=H!==null?$t.get(H).__webglFramebuffer:null;xt.bindFramebuffer(X.FRAMEBUFFER,Jt)}}},this.readRenderTargetPixelsAsync=async function(I,Y,nt,K,Q,Ct,kt,At=0){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ft=$t.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&kt!==void 0&&(Ft=Ft[kt],Array.isArray(Ft)&&(Ft=Ft[0])),Ft)if(Y>=0&&Y<=I.width-K&&nt>=0&&nt<=I.height-Q){xt.bindFramebuffer(X.FRAMEBUFFER,Ft);let Jt=I.textures[At],de=Jt.format,ve=Jt.type;I.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+At);let Gt=rs(Jt);if(Gt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Gt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let _e=X.createBuffer();X.bindBuffer(X.PIXEL_PACK_BUFFER,_e),X.bufferData(X.PIXEL_PACK_BUFFER,Ct.byteLength,X.STREAM_READ),X.readPixels(Y,nt,K,Q,_t.convert(de),_t.convert(ve),0),X.bindBuffer(X.PIXEL_PACK_BUFFER,null);let Ke=H!==null?$t.get(H).__webglFramebuffer:null;xt.bindFramebuffer(X.FRAMEBUFFER,Ke);let ke=X.fenceSync(X.SYNC_GPU_COMMANDS_COMPLETE,0);return X.flush(),await Yu(X,ke,4),X.bindBuffer(X.PIXEL_PACK_BUFFER,_e),X.getBufferSubData(X.PIXEL_PACK_BUFFER,0,Ct),X.bindBuffer(X.PIXEL_PACK_BUFFER,null),X.deleteBuffer(_e),X.deleteSync(ke),Ct}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(I,Y=null,nt=0){let K=Math.pow(2,-nt),Q=Math.floor(I.image.width*K),Ct=Math.floor(I.image.height*K),kt=Y!==null?Y.x:0,At=Y!==null?Y.y:0;Qt.setTexture2D(I,0),X.copyTexSubImage2D(X.TEXTURE_2D,nt,0,0,kt,At,Q,Ct),xt.unbindTexture()},this.copyTextureToTexture=function(I,Y,nt=null,K=null,Q=0,Ct=0){let kt,At,Ft,Jt,de,ve,Gt,_e,Ke,ke=I.isCompressedTexture?I.mipmaps[Ct]:I.image;if(nt!==null)kt=nt.max.x-nt.min.x,At=nt.max.y-nt.min.y,Ft=nt.isBox3?nt.max.z-nt.min.z:1,Jt=nt.min.x,de=nt.min.y,ve=nt.isBox3?nt.min.z:0;else{let be=Math.pow(2,-Q);kt=Math.floor(ke.width*be),At=Math.floor(ke.height*be),I.isDataArrayTexture?Ft=ke.depth:I.isData3DTexture?Ft=Math.floor(ke.depth*be):Ft=1,Jt=0,de=0,ve=0}K!==null?(Gt=K.x,_e=K.y,Ke=K.z):(Gt=0,_e=0,Ke=0);let Be=_t.convert(Y.format),_n=_t.convert(Y.type),Wt;Y.isData3DTexture?(Qt.setTexture3D(Y,0),Wt=X.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(Qt.setTexture2DArray(Y,0),Wt=X.TEXTURE_2D_ARRAY):(Qt.setTexture2D(Y,0),Wt=X.TEXTURE_2D),xt.activeTexture(X.TEXTURE0),xt.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,Y.flipY),xt.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),xt.pixelStorei(X.UNPACK_ALIGNMENT,Y.unpackAlignment);let Tn=xt.getParameter(X.UNPACK_ROW_LENGTH),Ae=xt.getParameter(X.UNPACK_IMAGE_HEIGHT),os=xt.getParameter(X.UNPACK_SKIP_PIXELS),yn=xt.getParameter(X.UNPACK_SKIP_ROWS),Lo=xt.getParameter(X.UNPACK_SKIP_IMAGES);xt.pixelStorei(X.UNPACK_ROW_LENGTH,ke.width),xt.pixelStorei(X.UNPACK_IMAGE_HEIGHT,ke.height),xt.pixelStorei(X.UNPACK_SKIP_PIXELS,Jt),xt.pixelStorei(X.UNPACK_SKIP_ROWS,de),xt.pixelStorei(X.UNPACK_SKIP_IMAGES,ve);let Bi=I.isDataArrayTexture||I.isData3DTexture,as=Y.isDataArrayTexture||Y.isData3DTexture;if(I.isDepthTexture){let be=$t.get(I),un=$t.get(Y),Kn=$t.get(be.__renderTarget),qe=$t.get(un.__renderTarget);xt.bindFramebuffer(X.READ_FRAMEBUFFER,Kn.__webglFramebuffer),xt.bindFramebuffer(X.DRAW_FRAMEBUFFER,qe.__webglFramebuffer);for(let an=0;an<Ft;an++)Bi&&(X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,$t.get(I).__webglTexture,Q,ve+an),X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,$t.get(Y).__webglTexture,Ct,Ke+an)),X.blitFramebuffer(Jt,de,Jt+kt,de+At,Gt,_e,Gt+kt,_e+At,X.DEPTH_BUFFER_BIT,X.NEAREST);xt.bindFramebuffer(X.READ_FRAMEBUFFER,null),xt.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else if(Q!==0||I.isRenderTargetTexture||$t.has(I)){let be=$t.get(I),un=$t.get(Y);xt.bindFramebuffer(X.READ_FRAMEBUFFER,S),xt.bindFramebuffer(X.DRAW_FRAMEBUFFER,P);for(let Kn=0;Kn<Ft;Kn++)Bi?X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,be.__webglTexture,Q,ve+Kn):X.framebufferTexture2D(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,be.__webglTexture,Q),as?X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,un.__webglTexture,Ct,Ke+Kn):X.framebufferTexture2D(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,un.__webglTexture,Ct),Q!==0?X.blitFramebuffer(Jt,de,Jt+kt,de+At,Gt,_e,Gt+kt,_e+At,X.COLOR_BUFFER_BIT,X.NEAREST):as?X.copyTexSubImage3D(Wt,Ct,Gt,_e,Ke+Kn,Jt,de,kt,At):X.copyTexSubImage2D(Wt,Ct,Gt,_e,Jt,de,kt,At);xt.bindFramebuffer(X.READ_FRAMEBUFFER,null),xt.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else as?I.isDataTexture||I.isData3DTexture?X.texSubImage3D(Wt,Ct,Gt,_e,Ke,kt,At,Ft,Be,_n,ke.data):Y.isCompressedArrayTexture?X.compressedTexSubImage3D(Wt,Ct,Gt,_e,Ke,kt,At,Ft,Be,ke.data):X.texSubImage3D(Wt,Ct,Gt,_e,Ke,kt,At,Ft,Be,_n,ke):I.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,Ct,Gt,_e,kt,At,Be,_n,ke.data):I.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,Ct,Gt,_e,ke.width,ke.height,Be,ke.data):X.texSubImage2D(X.TEXTURE_2D,Ct,Gt,_e,kt,At,Be,_n,ke);xt.pixelStorei(X.UNPACK_ROW_LENGTH,Tn),xt.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Ae),xt.pixelStorei(X.UNPACK_SKIP_PIXELS,os),xt.pixelStorei(X.UNPACK_SKIP_ROWS,yn),xt.pixelStorei(X.UNPACK_SKIP_IMAGES,Lo),Ct===0&&Y.generateMipmaps===!0&&Y.mipmapsAutoUpdate===!0&&X.generateMipmap(Wt),xt.unbindTexture()},this.initRenderTarget=function(I){$t.get(I).__webglFramebuffer===void 0&&Qt.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?Qt.setTextureCube(I,0):I.isData3DTexture?Qt.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?Qt.setTexture2DArray(I,0):Qt.setTexture2D(I,0),xt.unbindTexture()},this.resetState=function(){F=0,D=0,H=null,xt.reset(),St.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ye._getDrawingBufferColorSpace(t),e.unpackColorSpace=ye._getUnpackColorSpace()}};function we(i){let t=i>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var Dt=(i,t=0,e=1)=>i<t?t:i>e?e:i,Ot=(i,t,e)=>i+(t-i)*e,qn=(i,t,e)=>{let n=Dt((e-i)/(t-i));return n*n*(3-2*n)},jt={lin:i=>i,inOut:i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,out:i=>1-Math.pow(1-i,3),in:i=>i*i*i,outBack:i=>1+2.70158*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2),outElastic:i=>i===0?0:i===1?1:Math.pow(2,-10*i)*Math.sin((i*10-.75)*(2*Math.PI/3))+1,outBounce:i=>i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375};function hn(i,t=256){let e=we(i),n=new Float32Array(t*t);for(let o=0;o<n.length;o++)n[o]=e();let s=(o,a)=>n[(a%t+t)%t*t+(o%t+t)%t],r=(o,a)=>{let l=Math.floor(o),c=Math.floor(a),u=o-l,h=a-c,p=u*u*(3-2*u),d=h*h*(3-2*h),g=s(l,c),v=s(l+1,c),m=s(l,c+1),f=s(l+1,c+1);return g+(v-g)*p+(m-g)*d+(g-v-m+f)*p*d};return r.fbm=(o,a,l=4,c=2,u=.5)=>{let h=0,p=.5,d=1,g=0;for(let v=0;v<l;v++)h+=p*r(o*d,a*d),g+=p,p*=u,d*=c;return h/g},r}var Qi=class{constructor(){this.items=[],this.dead=!1,this.time=0}tween(t,e,n=jt.inOut){return new Promise(s=>{if(!this.dead){if(t<=0){e(1),s();return}this.items.push({t:0,dur:t,fn:e,easing:n,resolve:s}),e(n(0))}})}wait(t){return this.tween(t,()=>{},jt.lin)}until(t){return new Promise(e=>{this.dead||this.items.push({t:0,dur:1/0,tick:t,resolve:e})})}update(t){if(this.dead)return;this.time+=t;let e=this.items;for(let n=0;n<e.length;n++){let s=e[n];s.t+=t;let r=!1;if(s.tick)r=!!s.tick(t,s.t);else{let o=Dt(s.t/s.dur);s.fn(s.easing(o)),r=o>=1}r&&(s.done=!0)}if(e.some(n=>n.done)){let n=e.filter(s=>s.done);this.items=this.items.filter(s=>!s.done);for(let s of n)s.resolve()}}kill(){this.dead=!0,this.items.length=0}},kn=class{constructor(t=0,e=120,n=14){this.x=t,this.v=0,this.target=t,this.k=e,this.d=n}update(t){let e=Math.max(1,Math.ceil(t/.008)),n=t/e;for(let s=0;s<e;s++){let r=(this.target-this.x)*this.k-this.v*this.d;this.v+=r*n,this.x+=this.v*n}return this.x}kick(t){this.v+=t}};function Hd(i,t,e,n,s=.1){return i.lerpVectors(t,e,n),i.y+=Math.sin(Math.PI*n)*s,i}function Yn(i,{uniforms:t={},vertexPars:e="",vertexMain:n="",fragmentPars:s="",replace:r={},vreplace:o={},key:a=""}){return i.userData.uniforms=t,i.onBeforeCompile=l=>{Object.assign(l.uniforms,t),e&&(l.vertexShader=l.vertexShader.replace("#include <common>",`#include <common>
`+e)),n&&(l.vertexShader=l.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
`+n));for(let c in o)l.vertexShader=l.vertexShader.replace(c,o[c]);s&&(l.fragmentShader=l.fragmentShader.replace("#include <common>",`#include <common>
`+s));for(let c in r)l.fragmentShader.includes(c)||console.warn("patchMaterial: chunk not found",c),l.fragmentShader=l.fragmentShader.replace(c,r[c])},i.customProgramCacheKey=()=>a||i.uuid,i}var Mh={},kd=4;function zd(i){kd=Math.min(8,i)}function ts(i,t=i){let e=document.createElement("canvas");return e.width=i,e.height=t,e}function Pe(i,{srgb:t=!0,repeat:e=[1,1],wrap:n=!0}={}){let s=new Zr(i);return s.colorSpace=t?en:ii,n&&(s.wrapS=s.wrapT=js),s.repeat.set(e[0],e[1]),s.anisotropy=kd,s.needsUpdate=!0,s}function tn(i,t,e=i){let n=ts(i,e),s=n.getContext("2d"),r=s.createImageData(i,e),o=r.data;for(let a=0;a<e;a++)for(let l=0;l<i;l++){let c=t(l/i,a/e,l,a),u=(a*i+l)*4;typeof c=="number"?(o[u]=o[u+1]=o[u+2]=c*255,o[u+3]=255):(o[u]=c[0]*255,o[u+1]=c[1]*255,o[u+2]=c[2]*255,o[u+3]=c.length>3?c[3]*255:255)}return s.putImageData(r,0,0),n}function Ui(i,t,e=1,n=t){let s=ts(t,n),r=s.getContext("2d"),o=r.createImageData(t,n),a=o.data;for(let l=0;l<n;l++)for(let c=0;c<t;c++){let u=i[l*t+(c-1+t)%t],h=i[l*t+(c+1)%t],p=i[(l-1+n)%n*t+c],d=i[(l+1)%n*t+c],g=-(h-u)*e,v=(d-p)*e,m=1,f=Math.hypot(g,v,m);g/=f,v/=f,m/=f;let x=(l*t+c)*4;a[x]=(g*.5+.5)*255,a[x+1]=(v*.5+.5)*255,a[x+2]=(m*.5+.5)*255,a[x+3]=255}return r.putImageData(o,0,0),s}function Eo(i,t,e=i){let n=new Float32Array(i*e);for(let s=0;s<e;s++)for(let r=0;r<i;r++)n[s*i+r]=t(r/i,s/e,r,s);return n}var Sh={};function En(i,t){if(!Mh[i]){let e=performance.now();Mh[i]=t(),Sh[i]=Math.round(performance.now()-e)}return Mh[i]}function Fl(i="oak"){return En("wood_"+i,()=>{let t=i==="board"?512:1024,e=t/2,n=hn(i==="oak"?11:i==="floor"?23:37,256),s={oak:[[.8,.6,.38],[.6,.4,.22],[.42,.26,.13]],floor:[[.82,.68,.5],[.7,.54,.36],[.5,.36,.22]],board:[[.88,.74,.54],[.76,.58,.38],[.55,.38,.22]],dark:[[.5,.34,.21],[.38,.24,.14],[.24,.14,.08]]}[i],r=we(i.length*97+5),o=[],a=i==="floor"?4:2;for(let d=0;d<a;d++)o.push([r(),r(),.012+r()*.02]);let l=i==="floor"?6:1,c=new Float32Array(t*e),u=new Float32Array(t*e),h=tn(t,(d,g,v,m)=>{let f=g*l,x=Math.floor(f),_=f-x,y=x*37.1,w=d+(l>1?x*.37%1:0),T=_*(l>1?7:26)+y+n.fbm(w*1.5+y,_*(l>1?2:5),3)*(l>1?1.6:2.6),M=0;for(let F of o){let D=((w%1+1)%1-F[0])*2,H=_-F[1],B=D*D+H*H,z=F[2]*F[2]*(l>1?4:1);T+=1.6*Math.exp(-B/(z*14))*(1+.3*Math.sin(Math.atan2(H,D)*2)),M+=Math.exp(-B/(z*.9))}let E=.5+.5*Math.sin(T*6.283),N=n(w*420,f*34)*.6+n(w*150,f*90)*.4,C=n.fbm(w*3,f*60+y,3),L=Dt(.16+.3*Math.pow(E,2)+.3*C+.14*(N-.5)),b=L<.5?s[0].map((F,D)=>Ot(F,s[1][D],L*2)):s[1].map((F,D)=>Ot(F,s[2][D],(L-.5)*2)),R=l>1?.9+.2*(x*.618%1):1,S=Dt(M);b=b.map((F,D)=>F*R*(1-.4*S)*(.93+.14*n(d*5+9,g*5)));let P=0;if(l>1){let F=Math.min(_,1-_);P=1-qn(0,.012,F),b=b.map(D=>D*(1-.6*P))}return c[m*t+v]=-.5*Math.pow(E,3)*.25-N*.12-P*1.6-S*.2,u[m*t+v]=Dt(.55+.25*L+.1*N+P*.3),b},e),p=tn(t,(d,g,v,m)=>u[m*t+v],e);return{map:Pe(h),normalMap:Pe(Ui(c,t,1.6,e),{srgb:!1}),roughnessMap:Pe(p,{srgb:!1})}})}function bh(i=!1){return En("steel"+i,()=>{let e=hn(71,512),n=Eo(512,(a,l,c,u)=>{if(i){let h=a-.5,p=l-.5,d=Math.hypot(h,p),g=Math.atan2(p,h);return e(d*900,g*3)*.7+e(d*300,g*2+5)*.3}return e(c*.02,u*1.9)*.55+e(c*.006+7,u*.7)*.3+e(c*.05,u*3.7)*.15}),s=hn(5,64),r=tn(512,(a,l,c,u)=>{let h=n[u*512+c],p=qn(.55,.8,s.fbm(a*6,l*6,4));return[1,Dt(.3+(h-.5)*.22+p*.12),1]}),o=tn(512,(a,l,c,u)=>{let p=.8+(n[u*512+c]-.5)*.12;return[p*.98,p*.98,p]});return{map:Pe(o),roughnessMap:Pe(r,{srgb:!1}),normalMap:Pe(Ui(n,512,.55),{srgb:!1})}})}function Vd(){return En("tiles",()=>{let t=hn(91,128),e=new Float32Array(512*512),n=tn(512,(r,o,a,l)=>{let h=Math.floor(o*4),p=o*4-h,d=r*2+h%2*.5,g=Math.floor(d),v=d-g,m=Math.min(v,1-v)*(1/2)*2,f=Math.min(p,1-p)*(1/4),x=Math.min(m*1,f*2),_=1-qn(.004,.011,x),y=qn(.004,.035,x),w=.955+.035*((h*7+g*13)*.618%1)+.012*t(r*30,o*30);e[l*512+a]=y*1+t.fbm(r*14,o*14,3)*.1-_*.3;let T=[.78,.76,.72];return[.96*w,.955*w,.93*w].map((E,N)=>Ot(E,T[N],_))}),s=tn(512,(r,o,a,l)=>{let c=e[l*512+a];return Dt(c<.2?.9:.16+.08*t(r*9,o*9))});return{map:Pe(n),normalMap:Pe(Ui(e,512,2.2),{srgb:!1}),roughnessMap:Pe(s,{srgb:!1})}})}function Gd(){return En("plaster",()=>{let t=hn(13,256),e=Eo(512,(s,r)=>t.fbm(s*60,r*60,3)*.6+t.fbm(s*8,r*8,3)*.4),n=tn(512,(s,r)=>{let o=.96+.04*t.fbm(s*5,r*5,4);return[o,o*.985,o*.96]});return{map:Pe(n),normalMap:Pe(Ui(e,512,.8),{srgb:!1})}})}function es(i="linen"){return En("fabric_"+i,()=>{let e=hn(i.length*31+3,256),n=64,s=new Float32Array(512*512),r=tn(512,(o,a,l,c)=>{let u=o*n,h=a*n,p=Math.sin(u*Math.PI*2),d=Math.sin(h*Math.PI*2),v=(Math.floor(u)+Math.floor(h))%2===0?.5+.5*Math.cos((u%1-.5)*Math.PI*2):.5+.5*Math.cos((h%1-.5)*Math.PI*2),m=e(o*6,h*.9)*.5+e(u*.9,a*6)*.5;s[c*512+l]=v*.8+m*.5+.1*p*d;let f;if(i==="linen")f=[.93,.89,.8];else if(i==="curtain"){let _=qn(.42,.5,Math.abs(o*4%1-.5));f=[Ot(.98,.99,_),Ot(.89,.95,_),Ot(.68,.84,_)]}else if(i==="towel"){let _=o*8%1<.5?1:0,y=a*8%1<.5?1:0,w=(_+y)/2;f=[Ot(.95,.42,w),Ot(.95,.58,w),Ot(.93,.78,w)]}else if(i==="gingham"){let _=o*10%1<.5?1:0,y=a*10%1<.5?1:0,w=(_+y)/2;f=[Ot(.97,.86,w),Ot(.95,.42,w),Ot(.92,.4,w)]}else if(i==="pajama"){let _=qn(.3,.34,Math.abs(o*9%1-.5));f=[Ot(.55,.9,_),Ot(.7,.94,_),Ot(.88,.98,_)]}else i==="knit"?f=[.98,.93,.8]:i==="mat"?f=[.74,.8,.62]:f=[.9,.9,.9];let x=.86+.14*v+.08*(m-.5);return f.map(_=>_*x)});return{map:Pe(r),normalMap:Pe(Ui(s,512,1.4),{srgb:!1})}})}function Wd(){return En("nonstick",()=>{let t=we(777),e=hn(41,256),n=Eo(512,(a,l)=>e(a*220,l*220)*.7+e(a*90,l*90)*.3),s=ts(512),r=s.getContext("2d");r.fillStyle="#1c1c1e",r.fillRect(0,0,512,512);for(let a=0;a<9e3;a++){let l=40+t()*70;r.fillStyle=`rgba(${l},${l},${l+4},${.25+t()*.5})`,r.fillRect(t()*512,t()*512,1+t()*1.2,1+t()*1.2)}r.strokeStyle="rgba(120,120,125,0.05)",r.lineWidth=1;for(let a=0;a<60;a++)r.beginPath(),r.arc(512/2+(t()-.5)*80,512/2+(t()-.5)*80,40+t()*200,t()*6,t()*6+1.5),r.stroke();let o=tn(512,(a,l)=>Dt(.5+.18*e.fbm(a*6,l*6,3)));return{map:Pe(s),normalMap:Pe(Ui(n,512,.5),{srgb:!1}),roughnessMap:Pe(o,{srgb:!1})}})}function Xd(){return En("counter",()=>{let t=we(31),e=hn(17,128),n=tn(512,(o,a)=>{let l=.9+.05*e.fbm(o*4,a*4,4);return[l,l*.985,l*.955]}),s=n.getContext("2d");for(let o=0;o<2600;o++){let a=150+t()*80;s.fillStyle=`rgba(${a},${a-6},${a-16},${.1+t()*.22})`;let l=.5+t()*1.6;s.beginPath(),s.arc(t()*512,t()*512,l,0,7),s.fill()}let r=tn(256,(o,a)=>Dt(.22+.2*qn(.45,.75,e.fbm(o*5+3,a*5,4))));return{map:Pe(n),roughnessMap:Pe(r,{srgb:!1})}})}function Zn(i=24,t=.35,e=3){return En("fine"+i+"_"+t+"_"+e,()=>{let s=hn(e,256),r=Eo(256,(o,a)=>s.fbm(o*i,a*i,3));return Pe(Ui(r,256,t*4),{srgb:!1})})}function wh(){return En("eggshell",()=>{let t=hn(55,256),e=we(8),n=Eo(512,(o,a)=>t(o*180,a*180)*.6+t.fbm(o*30,a*30,3)*.4),s=tn(512,(o,a)=>{let l=.93+.07*t.fbm(o*7,a*7,4);return[l,l*.97,l*.93]}),r=s.getContext("2d");for(let o=0;o<500;o++)r.fillStyle=`rgba(150,105,70,${.05+e()*.13})`,r.beginPath(),r.arc(e()*512,e()*512,.6+e()*1.6,0,7),r.fill();return{map:Pe(s),normalMap:Pe(Ui(n,512,.7),{srgb:!1})}})}function qd(){return En("eggcracks",()=>{let i=[],e=wh().map.image;for(let n=0;n<=3;n++){let s=ts(512),r=s.getContext("2d");r.drawImage(e,0,0);let o=we(99),a=512*.25,l=512*.52,c=(u,h,p)=>{for(let d=0;d<h;d++){let g=d/h*Math.PI*2+o()*.8,v=a,m=l,f=Math.abs(Math.cos(g))>.6?1.7:.7;r.beginPath(),r.moveTo(v,m);let x=5+Math.floor(o()*4);for(let _=0;_<x;_++){g+=(o()-.5)*1.3;let y=u*f/x*(.6+o()*.8);v+=Math.cos(g)*y,m+=Math.sin(g)*y*.55,r.lineTo(v,m),o()<.35&&(r.lineTo(v+(o()-.5)*12,m+(o()-.5)*9),r.moveTo(v,m))}r.strokeStyle="rgba(70,45,30,0.75)",r.lineWidth=p,r.stroke(),r.strokeStyle="rgba(255,255,255,0.35)",r.lineWidth=p*.5,r.translate(.8,.8),r.stroke(),r.translate(-.8,-.8)}};if(n>=1&&c(26,5,1.1),n>=2&&c(60,7,1.3),n>=3){c(120,9,1.6),r.fillStyle="rgba(90,60,40,0.35)";for(let u=0;u<7;u++)r.beginPath(),r.arc(a+(o()-.5)*26,l+(o()-.5)*14,2+o()*3,0,7),r.fill()}i.push(Pe(s,{wrap:!0}))}return i})}function Yd(){return En("bread",()=>{let t=hn(63,256),e=we(21),n=new Float32Array(512*512),s=[];for(let l=0;l<520;l++)s.push([e(),e(),.004+e()*e()*.02]);let r=new Float32Array(512*512);for(let l of s){let c=Math.ceil(l[2]*512)+1,u=Math.floor(l[0]*512),h=Math.floor(l[1]*512);for(let p=-c;p<=c;p++)for(let d=-c;d<=c;d++){let g=Math.hypot(d,p)/(l[2]*512);if(g>1)continue;let v=((h+p)%512+512)%512*512+((u+d)%512+512)%512;r[v]=Math.max(r[v],1-g*g)}}let o=tn(512,(l,c,u,h)=>{let p=r[h*512+u],d=t.fbm(l*40,c*40,3);n[h*512+u]=d*.5-p*1.2;let g=1-.16*p+.08*(d-.5);return[.97*g,.92*g,.78*g]}),a=tn(256,(l,c)=>Dt(.35+.9*t.fbm(l*5+2,c*5,4)-.15*Math.abs(c-.5)));return{map:Pe(o),normalMap:Pe(Ui(n,512,2),{srgb:!1}),toastMap:Pe(a,{srgb:!1})}})}function Rs(){return En("softdot",()=>{let t=ts(128),e=t.getContext("2d"),n=e.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.35,"rgba(255,255,255,0.55)"),n.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=n,e.fillRect(0,0,128,128),Pe(t,{wrap:!1})})}function Zd(){return En("steam",()=>{let t=hn(7,64),e=tn(128,(n,s)=>{let r=Math.hypot(n-.5,s-.5)*2,o=Dt((1-r)*1.4)*Dt(.35+.9*t.fbm(n*5,s*5,4));return[1,1,1,o*o]});return Pe(e,{wrap:!1})})}function gr(){return En("sparkle",()=>{let t=ts(128),e=t.getContext("2d");e.translate(128/2,128/2);let n=e.createRadialGradient(0,0,0,0,0,128/2);n.addColorStop(0,"rgba(255,255,240,1)"),n.addColorStop(.2,"rgba(255,240,180,0.5)"),n.addColorStop(1,"rgba(255,220,120,0)"),e.fillStyle=n,e.beginPath();for(let s=0;s<8;s++){let r=s/8*Math.PI*2,o=s%2===0?128*.48:128*.09;e.lineTo(Math.cos(r)*o,Math.sin(r)*o)}return e.closePath(),e.fill(),Pe(t,{wrap:!1})})}function Jd(){return En("garden",()=>{let e=ts(512,384),n=e.getContext("2d"),s=n.createLinearGradient(0,0,0,384);s.addColorStop(0,"#bfe0ff"),s.addColorStop(.5,"#e9f5ff"),s.addColorStop(.62,"#fff7e0"),n.fillStyle=s,n.fillRect(0,0,512,384);let r=we(404);n.filter="blur(6px)";for(let a=0;a<70;a++){let l=r()*512,c=384*(.52+r()*.2),u=22+r()*50;n.fillStyle=`rgba(${90+r()*60},${150+r()*60},${70+r()*40},0.75)`,n.beginPath(),n.arc(l,c,u,0,7),n.fill()}n.fillStyle="rgba(190,225,140,0.9)",n.fillRect(0,384*.78,512,384*.3),n.fillStyle="rgba(245,238,225,0.9)",n.fillRect(512*.62,384*.38,512*.3,384*.3),n.fillStyle="rgba(170,110,90,0.85)",n.beginPath(),n.moveTo(512*.58,384*.4),n.lineTo(512*.77,384*.24),n.lineTo(512*.96,384*.4),n.fill(),n.filter="blur(10px)";for(let a=0;a<30;a++)n.fillStyle=`rgba(${120+r()*50},${180+r()*50},${80+r()*30},0.8)`,n.beginPath(),n.arc(r()*512,384*(.7+r()*.3),18+r()*30,0,7),n.fill();n.filter="none";let o=n.createRadialGradient(512*.2,384*.1,0,512*.2,384*.1,512*.8);return o.addColorStop(0,"rgba(255,250,225,0.95)"),o.addColorStop(1,"rgba(255,250,225,0)"),n.fillStyle=o,n.fillRect(0,0,512,384),Pe(e,{wrap:!1})})}function ns(i,t,e,n={}){return En("drawn_"+i,()=>{let s=ts(t,n.h||t);return e(s.getContext("2d"),t,n.h||t),Pe(s,{wrap:!!n.wrap,srgb:n.srgb!==!1})})}function To(i,t){return Pe(i,t)}var V={};function $d(i){let t=new fs,e=(o,a,l,c,u,h,p,d)=>{let g=new it(new mn(o,a,l),new Me({color:new Bt(p).multiplyScalar(d),side:xe}));return g.position.set(c,u,h),t.add(g),g},n=new it(new mn(10,5,9),new Me({color:new Bt(.4,.37,.33),side:xn}));n.position.set(0,1.2,0),t.add(n),e(10,.05,9,0,-1.25,0,"#a98058",.55),e(10,.05,9,0,3.65,0,"#fff6e8",.75),e(1.5,.05,1.1,-1.3,3.6,.7,"#fff7ea",11),e(.05,2.3,1.7,-4.9,1.6,-1.4,"#f4f7ff",3.4),e(.05,2.3,1.7,-4.9,1.6,.6,"#f4f7ff",3.4),e(.05,.7,.7,-4.85,2.3,-.4,"#fff0cc",14),e(.06,2.6,.5,-4.8,1.5,-3,"#40382f",1),e(.06,2.6,.5,-4.8,1.5,2.2,"#40382f",1),e(7,1.4,.05,.5,1.5,-4.4,"#f4f1ea",.9),e(3,.5,.4,.8,3,-4.2,"#3a3a3c",1),e(.05,3.2,1.6,4.9,1,-2.5,"#f8f8f8",.8),e(.05,3.4,1.8,4.9,1,1,"#2c2620",1),e(7,3,.05,0,1.2,4.4,"#57493c",1),e(1.6,1.2,.05,1.8,1.6,4.3,"#ffd9a8",1);let s=new pr(i),r=s.fromScene(t,.035);return s.dispose(),t.traverse(o=>{o.isMesh&&(o.geometry.dispose(),o.material.dispose())}),r.texture}function Kd(){let i=Ge,t=Se,e=bh(!1),n=bh(!0),s=(_,y,w)=>{let T=_.clone();return T.repeat.set(y,w),T.needsUpdate=!0,T};V.steel=new i({color:16777215,map:e.map,metalness:1,roughness:1,roughnessMap:e.roughnessMap,metalnessMap:e.roughnessMap,normalMap:e.normalMap,normalScale:new ot(.35,.35),anisotropy:.6,anisotropyRotation:Math.PI/2,envMapIntensity:1.15}),V.steelCirc=new i({color:16777215,map:n.map,metalness:1,roughness:1,roughnessMap:n.roughnessMap,metalnessMap:n.roughnessMap,normalMap:n.normalMap,normalScale:new ot(.3,.3),envMapIntensity:1.15}),V.steelPolished=new t({color:15921906,metalness:1,roughness:.12,envMapIntensity:1.2}),V.chrome=new t({color:16777215,metalness:1,roughness:.05,envMapIntensity:1.25}),V.castIron=new t({color:1776412,metalness:.6,roughness:.62,normalMap:Zn(60,.5,9),normalScale:new ot(.6,.6)}),V.burnerCap=new t({color:2302757,metalness:.4,roughness:.5,normalMap:Zn(60,.5,9)}),V.brass=new t({color:13214298,metalness:1,roughness:.35}),V.aluminium=new t({color:13224910,metalness:1,roughness:.42});let r=Wd();V.nonstick=new i({map:r.map,roughnessMap:r.roughnessMap,roughness:1,metalness:0,normalMap:r.normalMap,normalScale:new ot(.25,.25),clearcoat:.12,clearcoatRoughness:.45,envMapIntensity:.7}),V.panOuter=new t({color:2303014,metalness:.55,roughness:.45}),V.panRed=new i({color:11739935,metalness:0,roughness:.28,clearcoat:.8,clearcoatRoughness:.12}),V.panCream=new i({color:15326400,metalness:0,roughness:.3,clearcoat:.8,clearcoatRoughness:.12}),V.bakelite=new t({color:1315860,metalness:0,roughness:.38});let o=Fl("oak"),a=Fl("floor"),l=Fl("board");V.oak=new t({map:o.map,normalMap:o.normalMap,roughnessMap:o.roughnessMap,roughness:.82,normalScale:new ot(.5,.5)}),V.floor=new t({map:s(a.map,2.6,6.2),normalMap:s(a.normalMap,2.6,6.2),roughnessMap:s(a.roughnessMap,2.6,6.2),roughness:.66,normalScale:new ot(.6,.6)}),V.board=new t({map:l.map,normalMap:l.normalMap,roughnessMap:l.roughnessMap,roughness:.9,normalScale:new ot(.4,.4)});let c=Gd();V.wall=new t({color:16183266,map:s(c.map,3,2),normalMap:s(c.normalMap,6,4),normalScale:new ot(.25,.25),roughness:.93}),V.ceiling=new t({color:16447472,roughness:.95,emissive:16774368,emissiveIntensity:0}),V.trim=new t({color:16052714,roughness:.5});let u=Vd();V.tile=new i({map:u.map,normalMap:u.normalMap,roughnessMap:u.roughnessMap,roughness:1,clearcoat:.3,clearcoatRoughness:.15,normalScale:new ot(.8,.8)});let h=Xd();V.counter=new i({map:s(h.map,3,1),roughnessMap:s(h.roughnessMap,2,1),roughness:1,clearcoat:.25,clearcoatRoughness:.3}),V.cabinet=new i({color:15855076,roughness:.42,clearcoat:.15,clearcoatRoughness:.4,normalMap:Zn(40,.12,5),normalScale:new ot(.15,.15)}),V.cabinetInside=new t({color:14274493,roughness:.8}),V.fridge=new i({color:15987954,roughness:.3,metalness:0,clearcoat:.5,clearcoatRoughness:.2,normalMap:Zn(50,.1,6),normalScale:new ot(.12,.12)}),V.ceramic=new i({color:16513524,roughness:.22,clearcoat:1,clearcoatRoughness:.06,normalMap:Zn(10,.05,2),normalScale:new ot(.08,.08)}),V.ceramicBlue=new i({color:9417686,roughness:.25,clearcoat:1,clearcoatRoughness:.06}),V.ceramicYellow=new i({color:15979898,roughness:.25,clearcoat:1,clearcoatRoughness:.06}),V.ceramicPink=new i({color:15775416,roughness:.25,clearcoat:1,clearcoatRoughness:.06}),V.enamelCream=new i({color:15918792,roughness:.22,clearcoat:.8,clearcoatRoughness:.08}),V.enamelRed=new i({color:13123631,roughness:.22,clearcoat:.9,clearcoatRoughness:.08}),V.glass=new i({color:16777215,roughness:.03,metalness:0,transparent:!0,opacity:.16,envMapIntensity:1.4,depthWrite:!1,side:xe}),V.rubber=new t({color:2236962,roughness:.9}),V.plasticWhite=new t({color:15921902,roughness:.45});let p=es("linen"),d=es("curtain"),g=es("towel"),v=es("gingham"),m=es("pajama"),f=es("knit"),x=es("mat");return V.curtain=new i({map:s(d.map,3,6),normalMap:s(d.normalMap,14,28),normalScale:new ot(.5,.5),roughness:.95,side:xe,sheen:.5,sheenColor:new Bt(16773324),sheenRoughness:.6,emissive:new Bt(16763264),emissiveIntensity:0}),V.linen=new i({map:p.map,normalMap:p.normalMap,roughness:.95,sheen:.3,sheenRoughness:.7,side:xe}),V.towel=new i({map:g.map,normalMap:s(g.normalMap,3,3),roughness:.96,sheen:.4,sheenRoughness:.7,side:xe}),V.apron=new i({map:s(v.map,2,2),normalMap:s(v.normalMap,6,6),roughness:.95,sheen:.3}),V.pajama=new i({map:s(m.map,2,2),normalMap:s(m.normalMap,6,6),roughness:.95,sheen:.4}),V.knit=new i({map:s(f.map,2,2),normalMap:s(f.normalMap,5,5),roughness:.97,sheen:.5}),V.placemat=new t({map:s(x.map,2,1.5),normalMap:s(x.normalMap,4,3),roughness:.95}),V.skin=new i({color:15911332,roughness:.62,sheen:.35,sheenColor:new Bt(16759200),sheenRoughness:.5}),V.hair=new t({color:2825492,roughness:.55}),V.hairMama=new t({color:3810840,roughness:.5}),V.eye=new t({color:1708560,roughness:.15}),V.white=new t({color:16777215,roughness:.4}),V.blush=new Me({color:15899274,transparent:!0,opacity:.45,depthWrite:!1}),V.mouth=new t({color:10239283,roughness:.6}),V.sponge=new t({color:15913546,roughness:.95,normalMap:Zn(70,.9,12),normalScale:new ot(1.2,1.2)}),V.spongeGreen=new t({color:4165458,roughness:1,normalMap:Zn(70,.9,12)}),V.shadowBlob=new Me({map:Rs(),color:0,transparent:!0,opacity:.35,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),V.black=new t({color:789516,roughness:.6}),V.butter=new i({color:16243834,roughness:.35,clearcoat:.4,clearcoatRoughness:.3,sheen:.4,sheenColor:new Bt(16773808)}),V}function xr(i,t,e=.35){let n=new it(new He(i,t),V.shadowBlob.clone());return n.material.opacity=e,n.rotation.x=-Math.PI/2,n.renderOrder=1,n}var Ro=new U;function Jn(i,t,e,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Ro.copy(t),Ro[n]=0,Ro.normalize();let c=.5*o/(o+a),u=1-Ro.angleTo(i)/l;return Math.sign(Ro[e])===1?u*c:a/(o+a)+c+c*(1-u)}var vr=class i extends mn{constructor(t=1,e=1,n=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new U,c=new U,u=new U(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,p=this.attributes.normal.array,d=this.attributes.uv.array,g=h.length/6,v=new U,m=.5/o;for(let f=0,x=0;f<h.length;f+=3,x+=2)switch(l.fromArray(h,f),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),h[f+0]=u.x*Math.sign(l.x)+c.x*r,h[f+1]=u.y*Math.sign(l.y)+c.y*r,h[f+2]=u.z*Math.sign(l.z)+c.z*r,p[f+0]=c.x,p[f+1]=c.y,p[f+2]=c.z,Math.floor(f/g)){case 0:v.set(1,0,0),d[x+0]=Jn(v,c,"z","y",r,n),d[x+1]=1-Jn(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),d[x+0]=1-Jn(v,c,"z","y",r,n),d[x+1]=1-Jn(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),d[x+0]=1-Jn(v,c,"x","z",r,t),d[x+1]=Jn(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),d[x+0]=1-Jn(v,c,"x","z",r,t),d[x+1]=1-Jn(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),d[x+0]=1-Jn(v,c,"x","y",r,t),d[x+1]=1-Jn(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),d[x+0]=Jn(v,c,"x","y",r,t),d[x+1]=1-Jn(v,c,"y","x",r,e);break}}static fromJSON(t){return new i(t.width,t.height,t.depth,t.segments,t.radius)}};var q={roomX0:-2.4,roomX1:2.8,roomZ0:-1.9,roomZ1:2.6,roomH:2.4,winZ0:-1.5,winZ1:.5,winY0:.8,winY1:2.1,counterX0:-.4,counterX1:2.1,counterZ1:-1.25,counterY:.85,hob:new U(.75,.85,-1.56),burner:new U(.6,.85,-1.6),burner2:new U(.92,.85,-1.65),sink:new U(1.65,.85,-1.59),table:new U(-1.35,.72,-.75),papa:new U(-1.35,0,-1.4),mama:new U(1.28,0,-.98),toaster:new U(-.12,.85,-1.62),fridge:new U(2.46,0,-1.575),sunDir:new U(.85,-.3,-.36).normalize()},he=(i,t,e,n,s,r=3)=>new it(new vr(i,t,e,r,Math.min(n,i/2-1e-4,t/2-1e-4,e/2-1e-4)),s),We=(i,t,e,n)=>new it(new mn(i,t,e),n),Re=(i,t,e,n,s=32)=>new it(new sn(i,t,e,s),n),Fe=(i,t,e=64)=>new it(new xs(i.map(n=>new ot(n[0],n[1])),e),t);function gi(i,t=!0,e=!0){return i.traverse(n=>{n.isMesh&&(n.castShadow=t,n.receiveShadow=e)}),i}function Rv(i,t,e){let n=i.attributes.uv;for(let s=0;s<n.count;s++)n.setXY(s,n.getX(s)*t,n.getY(s)*e);return i}function Qd(i){let t={group:new Lt};i.add(t.group);let e=t.group,n=q.roomX1-q.roomX0,s=q.roomZ1-q.roomZ0,r=(q.roomX0+q.roomX1)/2,o=(q.roomZ0+q.roomZ1)/2,a=new it(new He(n,s),V.floor);a.rotation.x=-Math.PI/2,a.position.set(r,0,o),a.receiveShadow=!0,e.add(a);let l=new it(new He(n,s),V.ceiling);l.rotation.x=Math.PI/2,l.position.set(r,q.roomH,o),e.add(l);let c=new it(new He(n,q.roomH),V.wall);c.position.set(r,q.roomH/2,q.roomZ0),c.receiveShadow=!0,e.add(c);let u=new it(new He(s,q.roomH),V.wall);u.rotation.y=-Math.PI/2,u.position.set(q.roomX1,q.roomH/2,o),u.receiveShadow=!0,e.add(u);let h=.14,p=q.roomX0-h/2,d=(ae,ie,ge,Ie)=>{let ze=We(h,ie-ae,Ie-ge,V.wall);return ze.position.set(p,(ae+ie)/2,(ge+Ie)/2),ze.castShadow=!0,ze.receiveShadow=!0,e.add(ze),ze};d(0,q.winY0,q.roomZ0-.3,q.roomZ1),d(q.winY1,q.roomH+.6,q.roomZ0-.3,q.roomZ1),d(q.winY0,q.winY1,q.roomZ0-.6,q.winZ0),d(q.winY0,q.winY1,q.winZ1,q.roomZ1+1.5);let g=We(3,.1,9,V.wall);g.position.set(q.roomX0-1.4,q.roomH+.6,0),g.castShadow=!0,e.add(g);let v=We(n,.07,.012,V.trim);v.position.set(r,.035,q.roomZ0+.006),e.add(v);let m=We(.012,.07,s,V.trim);m.position.set(q.roomX0+.006,.035,o),e.add(m);let f=new Lt;e.add(f);let x=(q.winY0+q.winY1)/2,_=(q.winZ0+q.winZ1)/2,y=q.winY1-q.winY0,w=q.winZ1-q.winZ0,T=.05,M=V.trim,E=(ae,ie,ge,Ie,ze=T)=>{let $e=he(ze,ae,ie,.006,M);return $e.position.set(p+.02,ge,Ie),$e.castShadow=!0,f.add($e),$e};E(T,w,q.winY0+T/2,_,.1),E(T,w,q.winY1-T/2,_,.1),E(y,T,x,q.winZ0+T/2,.1),E(y,T,x,q.winZ1-T/2,.1),E(y,.06,x,_,.06),E(.03,w,q.winY0+y*.62,_,.03);let N=new it(new He(w,y),V.glass);N.rotation.y=Math.PI/2,N.position.set(p,x,_),f.add(N);let C=he(.07,.03,w+.1,.008,V.oak);C.position.set(q.roomX0+.015,q.winY0-.015,_),C.castShadow=!0,C.receiveShadow=!0,f.add(C);let L=new it(new He(6.5,4.2),new Me({map:Jd(),color:new Bt(2.6,2.5,2.3)}));L.rotation.y=Math.PI/2,L.position.set(q.roomX0-1.6,x+.3,_),f.add(L),t.outside=L;let b=Fe([[0,0],[.04,0],[.05,.07],[.046,.07],[.04,.012],[0,.012]],V.ceramic,32);b.position.set(q.roomX0+.005,q.winY0,.25),b.scale.setScalar(.8),gi(b),f.add(b);let R=new Se({color:5214012,roughness:.6,side:xe}),S=we(5);for(let ae=0;ae<9;ae++){let ie=new it(new ne(.022,10,8),R);ie.scale.set(1,.25,1.9);let ge=S()*6.28;ie.position.set(q.roomX0+.005+Math.cos(ge)*.022,q.winY0+.075+S()*.06,.25+Math.sin(ge)*.022),ie.rotation.set(S()*1.2-.6,ge,S()*1.2-.6),ie.castShadow=!0,f.add(ie)}let P=Re(.012,.012,w+.8,V.steelPolished,12);P.rotation.x=Math.PI/2,P.position.set(q.roomX0+.09,q.winY1+.13,_),e.add(P);for(let ae of[-1,1]){let ie=new it(new ne(.022,16,12),V.steelPolished);ie.position.set(q.roomX0+.09,q.winY1+.13,_+ae*(w/2+.4)),e.add(ie)}t.curtains=[jd(e,-1,_,w),jd(e,1,_,w)];let F=new Lt;F.position.set(q.table.x,0,q.table.z),e.add(F);let D=new vr(1.3,.035,.8,3,.012),H=new it(D,V.oak);H.position.y=q.table.y-.0175,F.add(H);for(let ae of[-1,1])for(let ie of[-1,1]){let ge=Re(.028,.02,q.table.y-.035,V.oak,16);ge.position.set(ae*.57,(q.table.y-.035)/2,ie*.32),F.add(ge)}let B=We(1.1,.07,.02,V.oak);B.position.set(0,q.table.y-.075,.31),F.add(B);let z=B.clone();z.position.z=-.31,F.add(z),gi(F),t.table=F;let Z=(ae,ie,ge)=>{let Ie=new Lt;Ie.position.set(ae,0,ie),Ie.rotation.y=ge;let ze=he(.42,.03,.4,.012,V.oak);ze.position.y=.44,Ie.add(ze);for(let rs of[-1,1])for(let I of[-1,1]){let Y=Re(.018,.014,I<0?.86:.43,V.oak,12);Y.position.set(rs*.18,I<0?.43:.215,I*.17),Ie.add(Y)}let $e=he(.4,.09,.022,.01,V.oak);$e.position.set(0,.8,-.172),Ie.add($e);let Is=he(.4,.05,.02,.008,V.oak);return Is.position.set(0,.66,-.172),Ie.add(Is),gi(Ie),e.add(Ie),Ie};t.papaChair=Z(q.papa.x,q.papa.z-.06,0),Z(-.5,-.78,-Math.PI/2),Z(-1.95,.02,Math.PI+.45);let W=new Lt;e.add(W);let tt=q.counterX1-q.counterX0,k=q.counterZ1-q.roomZ0,ut=(q.counterX0+q.counterX1)/2,pt=(ae,ie,ge,Ie)=>{let ze=We(ie-ae,Ie-ge,k-.03,V.cabinetInside);ze.position.set((ae+ie)/2,(ge+Ie)/2,q.roomZ0+(k-.03)/2),W.add(ze)};pt(q.counterX0,.31,.1,.82),pt(.31,1.19,.1,.445),pt(1.19,q.sink.x-.275,.1,.82),pt(q.sink.x-.275,q.sink.x+.275,.1,.62),pt(q.sink.x+.275,q.counterX1,.1,.82);for(let ae of[.305,1.195]){let ie=We(.012,.37,k-.03,V.cabinetInside);ie.position.set(ae,.63,q.roomZ0+(k-.03)/2),W.add(ie)}let Tt=We(tt,.1,k-.08,V.black);Tt.position.set(ut,.05,q.roomZ0+(k-.08)/2),W.add(Tt);let dt=q.sink.x-.27,Pt=q.sink.x+.27,te=q.sink.z-.2,Rt=q.sink.z+.2,Ht=(ae,ie,ge,Ie)=>{let ze=new vr(ie-ae,.035,Ie-ge,2,.006),$e=new it(ze,V.counter);return $e.position.set((ae+ie)/2,q.counterY-.0175,(ge+Ie)/2),W.add($e),$e};Ht(q.counterX0-.01,dt,q.roomZ0,q.counterZ1+.02),Ht(Pt,q.counterX1+.01,q.roomZ0,q.counterZ1+.02),Ht(dt-.004,Pt+.004,q.roomZ0,te),Ht(dt-.004,Pt+.004,Rt,q.counterZ1+.02);let gt=We(.02,.82,k,V.cabinet);gt.position.set(q.counterX0-0,.41,q.roomZ0+k/2),W.add(gt);let j=q.counterZ1+.009,ft=(ae,ie,ge,Ie,ze="h")=>{let $e=new Lt,Is=he(ie-ae-.006,Ie-ge-.006,.018,.004,V.cabinet);$e.add(Is);let rs=ze==="h"?Math.min(.26,(ie-ae)*.5):.16,I=Re(.006,.006,rs,V.steelPolished,12);ze==="h"?(I.rotation.z=Math.PI/2,I.position.set(0,(Ie-ge)/2-.05,.032)):I.position.set(ze==="vl"?-(ie-ae)/2+.04:(ie-ae)/2-.04,(Ie-ge)/2-.12,.032),$e.add(I);for(let Y of[-1,1]){let nt=Re(.004,.004,.026,V.steelPolished,8);nt.rotation.x=Math.PI/2,ze==="h"?nt.position.set(Y*(rs/2-.02),I.position.y,.02):nt.position.set(I.position.x,I.position.y+Y*.06,.02),$e.add(nt)}return $e.position.set((ae+ie)/2,(ge+Ie)/2,j),W.add($e),$e};ft(-.4,.3,.11,.8,"vr"),ft(1.2,1.65,.11,.8,"vr"),ft(1.65,2.1,.11,.8,"vl"),ft(.3,1.2,.11,.44,"h");let $=new Lt;$.position.set(.75,0,0),W.add($);let et=ft(.3,1.2,.44,.8,"h");W.remove(et),et.position.x=0,$.add(et);let lt=V.cabinetInside,Ut=We(.84,.012,.5,lt);Ut.position.set(0,.5,q.counterZ1-.25),$.add(Ut);for(let ae of[-1,1]){let ie=We(.012,.16,.5,lt);ie.position.set(ae*.42,.575,q.counterZ1-.25),$.add(ie)}let wt=We(.84,.16,.012,lt);wt.position.set(0,.575,q.counterZ1-.5),$.add(wt);let Zt=new it(new He(.82,.48),new Se({color:9277322,roughness:.95}));Zt.rotation.x=-Math.PI/2,Zt.position.set(0,.507,q.counterZ1-.25),$.add(Zt),t.drawer=$,t.drawerFront=et,t.drawerFloorY=.507;let Kt=We(.86,.34,.02,V.black);Kt.position.set(.75,.62,q.counterZ1-.56),W.add(Kt),gi(W);let se=Rv(new He(tt+.7,.72),(tt+.7)/.3,.72/.3),X=new it(se,V.tile);X.position.set(ut+.35,q.counterY+.36,q.roomZ0+.004),X.receiveShadow=!0,e.add(X);let fe=new Lt;fe.position.copy(q.sink),e.add(fe);let ee=.19,qt=.54,xt=.4,Ue=V.steel,$t=We(qt,.006,xt,Ue);$t.position.y=-ee,fe.add($t);let Qt=We(.006,ee,xt,Ue);Qt.position.set(-qt/2,-ee/2,0),fe.add(Qt);let O=Qt.clone();O.position.x=qt/2,fe.add(O);let A=We(qt,ee,.006,Ue);A.position.set(0,-ee/2,-xt/2),fe.add(A);let J=A.clone();J.position.z=xt/2,fe.add(J);let mt=.012;for(let[ae,ie,ge,Ie]of[[qt+.03,mt,0,-xt/2-.004],[qt+.03,mt,0,xt/2+.004],[mt,xt+.02,-qt/2-.004,0],[mt,xt+.02,qt/2+.004,0]]){let ze=he(ae,.006,ie,.002,V.steelPolished);ze.position.set(ge,.002,Ie),fe.add(ze)}let ht=Re(.035,.035,.004,V.steelPolished,24);ht.position.set(0,-ee+.004,-.05),fe.add(ht);let Mt=Re(.022,.022,.005,V.black,20);Mt.position.set(0,-ee+.005,-.05),fe.add(Mt),gi(fe,!1,!0),t.sink=fe,t.sinkDepth=ee;let yt=new Lt;yt.position.set(q.sink.x,q.counterY,q.sink.z-.25),e.add(yt);let rt=Re(.026,.03,.05,V.chrome,24);rt.position.y=.025,yt.add(rt);let ct=new Li([new U(0,.04,0),new U(0,.22,0),new U(0,.3,.04),new U(0,.31,.12),new U(0,.27,.17),new U(0,.235,.175)]),Et=new it(new Xi(ct,40,.012,16),V.chrome);yt.add(Et);let G=Re(.014,.014,.02,V.chrome,16);G.position.set(0,.228,.175),yt.add(G);let at=new Lt;at.position.set(.045,.045,0),yt.add(at);let st=Re(.014,.016,.03,V.chrome,16);st.rotation.z=Math.PI/2,at.add(st);let bt=he(.016,.012,.085,.005,V.chrome);bt.position.set(.012,.012,.045),at.add(bt),gi(yt),t.tap=yt,t.tapLever=at,t.tapMouth=new U(q.sink.x,q.counterY+.218,q.sink.z-.25+.175);let _t=new Lt;e.add(_t);let St=he(.95,.028,.24,.006,V.oak);St.position.set(1.62,1.46,q.roomZ0+.12),_t.add(St);for(let ae of[1.25,1.99]){let ie=We(.02,.12,.2,V.black);ie.position.set(ae,1.39,q.roomZ0+.1),ie.scale.z=1,_t.add(ie)}let Yt=Re(.006,.006,.7,V.steelPolished,10);Yt.rotation.z=Math.PI/2,Yt.position.set(1.62,1.3,q.roomZ0+.035),_t.add(Yt),gi(_t),t.shelfY=1.474,t.shelfZ=q.roomZ0+.13;let ue=he(.62,.1,.46,.008,V.steel);ue.position.set(q.hob.x,1.7,q.roomZ0+.23),gi(ue),e.add(ue);let vt=We(.26,.62,.24,V.steel);vt.position.set(q.hob.x,2.06,q.roomZ0+.12),e.add(vt);let Vt=new Lt;Vt.position.copy(q.fridge),e.add(Vt);let le=.66,It=1.76,Ee=.62,Ze=he(le,It,Ee,.02,V.fridge);Ze.position.set(0,It/2+.02,0),Vt.add(Ze);let Dn=Ee/2+.022,yr=he(le-.008,1.1,.045,.014,V.fridge);yr.position.set(0,.02+.62+.55+.02,Dn),Vt.add(yr);let Cs=he(le-.008,.6,.045,.014,V.fridge);Cs.position.set(0,.02+.3,Dn),Vt.add(Cs);for(let[ae,ie]of[[1.05,.5],[.52,.16]]){let ge=he(.022,ie,.02,.008,V.steelPolished);ge.position.set(-le/2+.055,ae,Dn+.045),Vt.add(ge)}gi(Vt),t.fridge=Vt,t.fridgeDoorZ=q.fridge.z+Dn+.0235;let Io=xr(.8,.35,.35);Io.position.set(q.fridge.x,.003,q.fridge.z+.38),e.add(Io);let Mr=xr(tt+.2,.3,.35);Mr.position.set(ut,.003,q.counterZ1+.02),e.add(Mr);let Fi=new Lt;Fi.position.set(q.table.x,0,q.table.z),e.add(Fi);let ri=Re(.003,.003,.75,V.black,6);ri.position.y=q.roomH-.375,Fi.add(ri);let Oi=Fe([[.02,.16],[.05,.14],[.17,.02],[.19,0],[.185,0],[.165,.016],[.045,.13],[0,.15]],V.enamelCream,48);Oi.position.y=q.roomH-.9,Oi.material=V.enamelCream.clone(),Oi.material.side=xe,Fi.add(Oi),gi(Fi,!0,!1);let $n=new Lt;$n.position.set(-.75,1.92,q.roomZ0+.02),e.add($n);let Sr=Re(.14,.14,.03,V.oak,48);Sr.rotation.x=Math.PI/2,$n.add(Sr);let ss=Re(.122,.122,.032,V.ceramic,48);ss.rotation.x=Math.PI/2,$n.add(ss);for(let ae=0;ae<12;ae++){let ie=We(.006,ae%3===0?.022:.012,.002,V.black),ge=ae/12*Math.PI*2;ie.position.set(Math.sin(ge)*.1,Math.cos(ge)*.1,.017),ie.rotation.z=-ge,$n.add(ie)}let Ps=We(.008,.06,.002,V.black);Ps.position.set(-.022,.016,.019),Ps.rotation.z=.95,$n.add(Ps);let br=We(.005,.09,.002,V.black);return br.position.set(0,.04,.02),$n.add(br),t.clock=$n,t.update=(ae,ie)=>{for(let ge of t.curtains)ge.update(ae,ie)},t}function jd(i,t,e,n){let o=q.winY1+.12,a=.42,l=o-a,c=n/2+.34,u=.27,h=c*1.45,p=8,d=e+t*(n/2+.32),g=new He(1,1,44,12),v=g.attributes.position,m=g.attributes.uv;for(let C=0;C<m.count;C++)m.setX(C,t>0?m.getX(C):1-m.getX(C));let f=V.curtain.clone();f.emissiveMap=f.map,f.emissiveIntensity=.55,f.emissive.setRGB(1,.8,.52),Yn(f,{key:"curtain",vertexPars:"varying vec3 vObjN; varying float vObjY;",vertexMain:"vObjN = normal; vObjY = position.y;",fragmentPars:"varying vec3 vObjN; varying float vObjY;",replace:{"#include <emissivemap_fragment>":`#include <emissivemap_fragment>
      totalEmissiveRadiance *= mix(0.30, 1.15, pow(abs(normalize(vObjN).x), 1.4)) * mix(0.55, 1.0, smoothstep(0.4, 2.0, vObjY));`}});let x=new it(g,f);x.castShadow=!0,x.receiveShadow=!0,x.frustumCulled=!1,i.add(x);let _=[];for(let C=0;C<=p;C++){let L=new it(new Je(.016,.003,6,14),V.steelPolished);L.rotation.y=Math.PI/2,i.add(L),_.push(L)}let y={mesh:x,side:t,anchorZ:d,open:0,target:0,lag:new kn(0,40,9),sway:0,dragging:!1,done:!1},w=we(t>0?3:4),T=[];for(let C=0;C<=44;C++)T.push(w());let M=-1,E=-1,N=-1;return y.width=C=>Ot(c,u,C),y.edgeWorld=(C=y.open)=>new U(q.roomX0+.09,1.25,d-t*y.width(C)),y.setEmissive=C=>{f.emissiveIntensity=C},y.update=(C,L)=>{y.dragging||(y.open+=(y.target-y.open)*Math.min(1,C*7)),y.lag.target=y.open,y.lag.update(C);let b=Math.sin(L*.7+t)*.004;if(Math.abs(y.open-M)<1e-4&&Math.abs(y.lag.x-E)<1e-4&&Math.abs(b-N)<5e-4)return;M=y.open,E=y.lag.x,N=b;for(let S=0;S<=12;S++){let P=S/12,F=Ot(y.open,y.lag.x,Math.pow(P,1.4)),D=Ot(c,u,Dt(F,-.05,1.05)),H=D/p,B=Math.min(.11,H/Math.PI*Math.sqrt(Math.max(0,h/D-1))*.8);for(let z=0;z<=44;z++){let Z=z/44,W=Z*p*Math.PI*2,tt=Math.sin(W)*B*(.75+.5*T[z])*(.55+.45*P)+Math.sin(W*.5+1.3)*B*.25*P,k=d-t*Z*D,ut=q.roomX0+.09+tt+b*P*P*8*(.5+Z),pt=o-P*l+Math.cos(W)*.004*P;v.setXYZ(S*45+z,ut,pt,k)}}v.needsUpdate=!0,g.computeVertexNormals(),g.computeBoundingSphere();let R=Ot(c,u,Dt(y.open));_.forEach((S,P)=>S.position.set(q.roomX0+.09,o+.012,d-t*(P/p)*R))},y.update(.016,0),y}var tf="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",Ol=class{constructor(t){this.enabled=!0,this.strength=.11,this.vignette=.22;let e=new Ce;e.setAttribute("position",new Xt([-1,-1,0,3,-1,0,-1,3,0],3)),e.setAttribute("uv",new Xt([0,0,2,0,0,2],2)),this.quad=new it(e,null),this.quad.frustumCulled=!1,this.cam=new _s(-1,1,1,-1,0,1),this.sceneRT=null,this.mips=[];let n=(s,r)=>new gn({vertexShader:tf,fragmentShader:s,uniforms:r,depthTest:!1,depthWrite:!1,toneMapped:!1});this.matDown=n(`uniform sampler2D tMap; uniform vec2 texel; uniform float first; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMap, vUv + texel*vec2(-1.,-1.)).rgb + texture2D(tMap, vUv + texel*vec2(1.,-1.)).rgb + texture2D(tMap, vUv + texel*vec2(-1.,1.)).rgb + texture2D(tMap, vUv + texel*vec2(1.,1.)).rgb;
        c *= 0.25;
        if (first > 0.5) { float l = max(c.r, max(c.g, c.b)); float k = smoothstep(0.9, 2.2, l); c = min(c, vec3(12.0)) * k; }
        gl_FragColor = vec4(c, 1.0);
      }`,{tMap:{value:null},texel:{value:new ot},first:{value:0}}),this.matUp=n(`uniform sampler2D tMap; uniform sampler2D tAdd; uniform vec2 texel; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tMap, vUv).rgb * 4.0;
        c += (texture2D(tMap, vUv + texel*vec2(-1.,0.)).rgb + texture2D(tMap, vUv + texel*vec2(1.,0.)).rgb + texture2D(tMap, vUv + texel*vec2(0.,-1.)).rgb + texture2D(tMap, vUv + texel*vec2(0.,1.)).rgb) * 2.0;
        c += texture2D(tMap, vUv + texel*vec2(-1.,-1.)).rgb + texture2D(tMap, vUv + texel*vec2(1.,-1.)).rgb + texture2D(tMap, vUv + texel*vec2(-1.,1.)).rgb + texture2D(tMap, vUv + texel*vec2(1.,1.)).rgb;
        gl_FragColor = vec4(c / 16.0 + texture2D(tAdd, vUv).rgb, 1.0);
      }`,{tMap:{value:null},tAdd:{value:null},texel:{value:new ot}}),this.matFinal=new gn({vertexShader:tf,depthTest:!1,depthWrite:!1,uniforms:{tScene:{value:null},tBloom:{value:null},strength:{value:.1},vig:{value:.2},fade:{value:0}},fragmentShader:`uniform sampler2D tScene; uniform sampler2D tBloom; uniform float strength; uniform float vig; uniform float fade; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(tScene, vUv).rgb + texture2D(tBloom, vUv).rgb * strength;
        vec2 q = vUv - 0.5; float v = 1.0 - vig * smoothstep(0.25, 0.85, dot(q, q) * 2.0);
        c *= v * (1.0 - fade);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}setSize(t){let e=t.getDrawingBufferSize(new ot),n=Math.max(2,e.x),s=Math.max(2,e.y);if(this.sceneRT&&this.sceneRT.width===n&&this.sceneRT.height===s)return;this.dispose(),this.sceneRT=new pn(n,s,{type:Pn,samples:4,depthBuffer:!0});let r=n,o=s;for(let a=0;a<5;a++){r=Math.max(2,r>>1),o=Math.max(2,o>>1);let l={type:Pn,depthBuffer:!1,minFilter:Qe,magFilter:Qe};this.mips.push({down:new pn(r,o,l),up:new pn(r,o,l)})}}dispose(){this.sceneRT&&this.sceneRT.dispose();for(let t of this.mips)t.down.dispose(),t.up.dispose();this.mips=[],this.sceneRT=null}pass(t,e,n){this.quad.material=e,t.setRenderTarget(n),t.render(this.quad,this.cam)}render(t,e,n,s){if(!this.enabled||!this.sceneRT){t.setRenderTarget(null),t.render(e,n),this.calls=t.info.render.calls,this.tris=t.info.render.triangles;return}t.setRenderTarget(this.sceneRT),t.render(e,n),this.calls=t.info.render.calls,this.tris=t.info.render.triangles;let r=this.mips,o=this.sceneRT.texture,a=this.sceneRT.width,l=this.sceneRT.height;for(let h=0;h<r.length;h++)this.matDown.uniforms.tMap.value=o,this.matDown.uniforms.texel.value.set(.5/a,.5/l),this.matDown.uniforms.first.value=h===0?1:0,this.pass(t,this.matDown,r[h].down),o=r[h].down.texture,a=r[h].down.width,l=r[h].down.height;let c=r[r.length-1].down.texture;for(let h=r.length-2;h>=0;h--){let p=h===r.length-2?r[h+1].down:r[h+1].up;this.matUp.uniforms.tMap.value=c,this.matUp.uniforms.tAdd.value=r[h].down.texture,this.matUp.uniforms.texel.value.set(1/p.width,1/p.height),this.pass(t,this.matUp,r[h].up),c=r[h].up.texture}let u=this.matFinal.uniforms;u.tScene.value=this.sceneRT.texture,u.tBloom.value=c,u.strength.value=this.strength,u.vig.value=this.vignette,this.pass(t,this.matFinal,null)}};var Av=`
attribute vec3 aJet;   // x: angle around ring, y: random phase, z: layer (0 outer, 1 inner core)
attribute vec2 aPar;   // x: 0..1 along the jet, y: angle around the jet axis
uniform float uTime, uLevel, uPan, uRing, uScale, uGap;
varying float vH; varying float vLayer; varying float vEdge; varying float vRnd; varying float vLevel;
void main() {
  float a = aJet.x, ph = aJet.y, layer = aJet.z;
  float h = aPar.x;
  float flick = 0.86 + 0.10 * sin(uTime * (11.0 + ph * 9.0) + ph * 40.0) + 0.06 * sin(uTime * 23.0 + ph * 91.0);
  float lvl = clamp(uLevel, 0.0, 1.0);
  float len = uScale * mix(0.014, 0.062, lvl) * flick * mix(1.0, 0.50, layer);
  float rad = uScale * mix(0.0040, 0.0074, lvl) * mix(1.0, 0.55, layer);
  float tilt = mix(0.62, 1.05, uPan * (0.4 + 0.6 * lvl));          // lean outward, more under a pan
  vec3 radial = vec3(cos(a), 0.0, sin(a));
  vec3 tang = vec3(-sin(a), 0.0, cos(a));
  vec3 axis = normalize(radial * sin(tilt) + vec3(0.0, cos(tilt), 0.0));
  vec3 side = normalize(cross(axis, tang));
  float prof = sin(3.14159 * pow(h, 0.62)) * (1.0 - h * 0.25);       // teardrop profile
  float sway = (sin(uTime * 7.0 + ph * 20.0) * 0.0016 + sin(uTime * 13.0 + ph * 50.0) * 0.0008) * h * uScale;
  vec3 p = radial * uRing + vec3(0.0, 0.002, 0.0)
         + axis * (h * len)
         + (tang * cos(aPar.y) + side * sin(aPar.y)) * rad * prof
         + tang * sway;
  // flames flatten and spread when they reach the pan bottom
  float over = max(0.0, p.y - uGap) * uPan;
  p.y -= over; p += radial * over * 1.25;
  vH = h; vLayer = layer; vRnd = ph; vLevel = lvl;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec3 n = normalize(normalMatrix * (tang * cos(aPar.y) + side * sin(aPar.y)));
  vEdge = abs(dot(n, normalize(-mv.xyz)));
  gl_Position = projectionMatrix * mv;
}`,Cv=`
uniform float uTime, uAlpha;
varying float vH; varying float vLayer; varying float vEdge; varying float vRnd; varying float vLevel;
void main() {
  vec3 outerLo = vec3(0.10, 0.34, 1.00), outerHi = vec3(0.30, 0.22, 0.95);
  vec3 core = vec3(0.45, 0.85, 1.00);
  vec3 col = mix(mix(outerLo, outerHi, smoothstep(0.3, 1.0, vH)), core, vLayer);
  float a = (1.0 - smoothstep(0.55, 1.0, vH)) * smoothstep(0.0, 0.08, vH);
  a *= mix(0.55, 0.95, vLayer) * mix(0.55, 1.0, pow(vEdge, 0.8));
  // rare warm tips at high heat (tiny, like a real hob)
  float tip = smoothstep(0.62, 0.95, vH) * step(0.86, fract(vRnd * 7.31 + floor(uTime * 3.0) * 0.37)) * smoothstep(0.55, 1.0, vLevel) * (1.0 - vLayer);
  col = mix(col, vec3(1.0, 0.62, 0.22), tip * 0.8); a += tip * 0.25;
  gl_FragColor = vec4(col * a * uAlpha * 1.35, 1.0);
}`;function Pv(i,t){let s=[],r=[],o=[],a=[],l=0;for(let u=0;u<2;u++)for(let h=0;h<i;h++){let p=h/i*Math.PI*2+(t()-.5)*.02,d=t();for(let g=0;g<=7;g++)for(let v=0;v<=7;v++)s.push(0,0,0),r.push(p,d,u),o.push(g/7,v/7*Math.PI*2);for(let g=0;g<7;g++)for(let v=0;v<7;v++){let m=l+g*8+v,f=m+1,x=m+7+1,_=x+1;a.push(m,x,f,f,x,_)}l+=64}let c=new Ce;return c.setAttribute("position",new Xt(s,3)),c.setAttribute("aJet",new Xt(r,3)),c.setAttribute("aPar",new Xt(o,2)),c.setIndex(a),c.boundingSphere=new ui(new U,.3),c}function ef(i){let t={group:new Lt,burners:[]};t.group.position.copy(q.hob),i.scene.add(t.group);let e=t.group,n=he(.6,.014,.5,.006,V.steel,3);n.position.y=.007,e.add(n);let s=he(.56,.004,.33,.002,V.steel.clone(),2);s.material.roughness=.85,s.position.set(0,.0145,-.06),e.add(s);let r=new Lt;r.position.set(0,.016,.192),r.rotation.x=.32,e.add(r);let o=he(.6,.022,.118,.008,V.steel,3);o.position.y=.004,r.add(o),t.fascia=r;let a=(c,u,h,p)=>{let d={scale:h,pos:new U(c,.014,u),value:0,held:!1,lit:!1,level:0,target:0,thermal:0,igniteT:-1,hasPan:!1,press:new kn(0,400,30)},g=new Lt;g.position.copy(d.pos),e.add(g),d.group=g;let v=Fe([[0,.001],[.05*h,.001],[.09*h,.004],[.098*h,.006],[.1*h,.004],[.1*h,0]],V.steelCirc,64);g.add(v);let m=Fe([[0,0],[.036*h,0],[.044*h,.006],[.046*h,.016],[.043*h,.02],[0,.02]],V.aluminium,48);m.position.y=.002,g.add(m);let f=Re(.0462*h,.0462*h,.005,new Se({color:4868684,metalness:.7,roughness:.6,map:ns("ports",256,(W,tt)=>{W.fillStyle="#8a8a8c",W.fillRect(0,0,tt,tt),W.fillStyle="#111";for(let k=0;k<40;k++)W.fillRect(k*(tt/40)+1,tt*.2,tt/40-3,tt*.6)},{wrap:!0})}),48,1,!0);f.position.y=.0165,g.add(f);let x=Fe([[0,0],[.037*h,0],[.04*h,.002],[.04*h,.006],[.036*h,.009],[0,.01]],V.burnerCap,48);x.position.y=.022,g.add(x);let _=Re(.002,.002,.012,V.ceramic,8);_.position.set(.054*h,.012,0),g.add(_);let y=new Lt;g.add(y);let w=.118*h,T=.043,M=new it(new Je(w,.005,10,64),V.castIron);M.rotation.x=Math.PI/2,M.position.y=T-.012,y.add(M);for(let W=0;W<4;W++){let tt=W/4*Math.PI*2+Math.PI/4,k=new Lt;k.rotation.y=-tt,y.add(k);let ut=he(w-.03*h+.012,.012,.011,.004,V.castIron,2);ut.position.set((w+.03*h)/2+.004,T-.006,0),k.add(ut);let pt=he(.012,T-.008,.012,.004,V.castIron,2);pt.position.set(w+.006,(T-.008)/2,0),k.add(pt)}d.panY=T;let E=new gn({vertexShader:Av,fragmentShader:Cv,transparent:!0,depthWrite:!1,blending:ei,side:xe,uniforms:{uTime:{value:0},uLevel:{value:0},uPan:{value:0},uRing:{value:.0465*h},uScale:{value:h},uGap:{value:T-.022},uAlpha:{value:0}}}),N=new it(Pv(Math.round(34*h),we(7+Math.round(h*10))),E);N.position.y=.019,N.visible=!1,N.renderOrder=5,g.add(N),d.flame=N,d.fmat=E;let C=new it(new He(.34*h,.34*h),new Me({map:Rs(),color:2776319,transparent:!0,opacity:0,blending:ei,depthWrite:!1}));C.rotation.x=-Math.PI/2,C.position.y=.012,C.renderOrder=4,g.add(C),d.glow=C;let L=new vs(4880639,0,.3,2);L.position.y=.012,g.add(L),d.light=L;let b=new Ri(new di({map:gr(),color:13623551,transparent:!0,opacity:0,blending:ei,depthWrite:!1}));b.scale.setScalar(.03),b.position.set(.05*h,.022,0),g.add(b),d.spark=b;let R=new Lt;R.position.set(p,.015,.004),r.add(R),d.knobBase=R;let S=Fe([[.026,0],[.036,0],[.037,.002],[.034,.0035],[.026,.0035]],V.steelPolished,48);R.add(S);let P=Re(.0335,.0335,.001,V.black,40);P.position.y=.0036,R.add(P);let F=new Lt;F.position.y=.005,R.add(F),d.knob=F;let D=Fe([[0,0],[.0305,0],[.031,.002],[.0295,.016],[.027,.0195],[0,.0205]],new Se({color:14869220,metalness:1,roughness:.3,envMapIntensity:1.1}),64);F.add(D);let H=he(.0135,.016,.056,.005,V.steel,3);H.position.y=.026,F.add(H);let B=he(.004,.002,.016,8e-4,new Se({color:14173226,roughness:.4,emissive:5574912,emissiveIntensity:.2}),1);B.position.set(0,.0345,-.018),F.add(B);let z=new it(new He(.115,.115),new Se({map:ns("legend",256,(W,tt)=>{W.clearRect(0,0,tt,tt),W.translate(tt/2,tt/2),W.fillStyle="rgba(30,30,34,0.9)",W.beginPath(),W.arc(0,-tt*.4,tt*.02,0,7),W.fill();for(let k=0;k<6;k++){let ut=-Math.PI/2+.55+k*.5,pt=tt*(.014+k*.006);W.fillStyle=`rgba(${40+k*6},${70+k*10},${150+k*18},0.95)`,W.beginPath(),W.arc(Math.cos(ut)*tt*.4,Math.sin(ut)*tt*.4,pt,0,7),W.fill()}}),transparent:!0,roughness:.5,metalness:.2,polygonOffset:!0,polygonOffsetFactor:-3}));z.rotation.x=-Math.PI/2,z.position.y=2e-4,R.add(z);let Z=new it(new ne(.062,12,10),new Me({visible:!1}));return Z.position.y=.02,R.add(Z),d.proxy=Z,d.maxAngle=2.9,t.burners.push(d),d};t.main=a(-.15,-.04,1,-.15),t.small=a(.17,-.09,.78,.17),e.traverse(c=>{c.isMesh&&c.material&&!c.material.transparent&&c.material.visible!==!1&&(c.castShadow=!0,c.receiveShadow=!0)});let l=new U;return t.burnerWorld=(c,u=new U)=>c.group.getWorldPosition(u),t.panRestY=c=>q.hob.y+c.pos.y+c.panY,t.setKnob=(c,u,h=!0)=>{u=Dt(u);let p=c.value;if(u===p)return;let d=.065,g=Math.floor(p/d),v=Math.floor(u/d);g!==v&&i.audio&&i.audio.knobClick(u>p?1:.8,u),c.value=u;let m=c.target>0,f=u>=.085;c.target=f?.14+.86*qn(.085,1,u)*(.5+.5*u):0,f&&!m&&(c.igniteT=0,c.sparks=0,t.onIgnite&&t.onIgnite(c)),!f&&m&&(c.igniteT=-1,c.lit&&(c.lit=!1,i.audio&&i.audio.puff(),t.onOff&&t.onOff(c,h))),t.onKnob&&t.onKnob(c,u,h)},t.release=c=>{(c.value>0&&c.value<.16&&!c.lit&&c.igniteT<0||c.value<.085&&c.value>0)&&t.setKnob(c,0)},t.forceOff=c=>{c.value>0&&t.setKnob(c,0,!1)},t.update=(c,u)=>{for(let h of t.burners){if(h.press.target=h.held?1:0,h.press.update(c),h.knob.rotation.y=-h.value*h.maxAngle,h.knob.position.y=.005-.0022*h.press.x,h.igniteT>=0&&!h.lit){let f=Math.floor(h.igniteT/.11);h.igniteT+=c;let x=Math.floor(h.igniteT/.11);x!==f&&x<=3&&(i.audio&&i.audio.spark(),h.sparkFlash=1),h.igniteT>.36&&(h.lit=!0,h.igniteT=-1,h.level=.02,h.whoomp=1,i.audio&&i.audio.ignite(),t.onLit&&t.onLit(h))}h.sparkFlash=Math.max(0,(h.sparkFlash||0)-c*14),h.spark.material.opacity=h.sparkFlash,h.spark.material.rotation=u*30,h.whoomp=Math.max(0,(h.whoomp||0)-c*2.8);let p=h.lit?h.target:0;h.level+=(p-h.level)*Math.min(1,c*(p>h.level?9:12)),!h.lit&&h.level<.004&&(h.level=0);let d=h.level>.003;h.flame.visible=d;let g=h.fmat.uniforms;g.uTime.value=u,g.uLevel.value=Dt(h.level+h.whoomp*.35),g.uPan.value+=((h.hasPan?1:0)-g.uPan.value)*Math.min(1,c*6),g.uAlpha.value=Dt(h.level*12);let v=.9+.1*Math.sin(u*17+h.scale*3)*Math.sin(u*7.3);h.glow.material.opacity=Dt(h.level*1.1+h.whoomp*.5)*.42*v,h.light.intensity=(h.level*.9+h.whoomp*.6)*.1*v;let m=h.lit?h.level:0;h.thermal+=(m-h.thermal)*Math.min(1,c/(m>h.thermal?2.2:5))}i.audio&&i.audio.setGas(Math.max(t.main.level,t.small.level*.6))},t}var Iv=new U(0,1,0);function Bl(i,t){let e=new it(new sn(t*.9,t,1,16,1,!0),i);return e.castShadow=!1,e.receiveShadow=!0,e}function nf(i,t){let e=new it(new ne(t,16,12),i);return e.receiveShadow=!0,e}function Hl(i,t,e,n){let s=e.clone().sub(t),r=s.length();i.position.copy(t).addScaledVector(s,.5),i.quaternion.setFromUnitVectors(Iv,s.normalize()),i.scale.set(1,Math.max(.01,r),1)}var kl=class{constructor(t){this.o=t;let e=t;this.root=new Lt,this.body=new Lt,this.root.add(this.body),this.body.position.y=e.hipY;let n=(u,h=90,p=14)=>new kn(u,h,p);this.p={yaw:n(0),pitch:n(0),roll:n(0),lean:n(0),leanSide:n(0),bob:n(0,160,12),eye:n(e.eye??1,200,22),brow:n(0),mouthOpen:n(0,220,20),mouthW:n(1,200,20),smile:n(1),bodyYaw:n(0,60,12),lx:n(e.restL[0]),ly:n(e.restL[1]),lz:n(e.restL[2]),rx:n(e.restR[0]),ry:n(e.restR[1]),rz:n(e.restR[2]),thumb:n(0),hairLean:n(e.hairLean??0,70,5),hairFlat:n(0,140,7),hairSplit:n(0,80,8),sparkle:n(0,60,12)},this.t=0,this.breath=1,this.chew=0,this.arcMode="sleep";let s=Fe(e.torso,e.cloth,40);s.receiveShadow=!0,s.scale.z=.8,this.body.add(s),e.extra&&e.extra(this);let r=Re(.045,.05,.07,V.skin,16);r.position.y=e.shoulderY+.035,this.body.add(r),this.headPivot=new Lt,this.headPivot.position.y=e.shoulderY+.06,this.body.add(this.headPivot);let o=e.headR;this.head=new Lt,this.head.position.y=o*.92,this.headPivot.add(this.head);let a=new it(new ne(o,40,32),V.skin);a.scale.set(1,1.04,.98),a.receiveShadow=!0,this.head.add(a);for(let u of[-1,1]){let h=new it(new ne(o*.2,14,12),V.skin);h.scale.set(.5,1,.8),h.position.set(u*o*.98,-o*.05,0),this.head.add(h)}let l=(u,h)=>Math.sqrt(Math.max(0,o*o-u*u-h*h))*.98;this.eyes=[];for(let u of[-1,1]){let h=u*o*.36,p=o*.06,d=new Lt;d.position.set(h,p,l(h,p)-.002),this.head.add(d);let g=new it(new ne(o*.105,20,16),V.eye);g.scale.z=.55,d.add(g);let v=new it(new ne(o*.032,10,8),new Me({color:16777215}));v.position.set(-o*.035,o*.045,o*.055),d.add(v);let m=new it(new ne(o*.018,8,6),new Me({color:16777215}));m.position.set(o*.04,-o*.03,o*.058),d.add(m);let f=new Je(o*.1,o*.016,6,16,Math.PI*.9),x=new it(f,V.eye);x.position.z=.002,d.add(x);let _=new it(new Gn(o*.02,o*.16,4,8),e.hair);_.rotation.z=Math.PI/2+u*.12,_.position.set(0,o*.24,0),d.add(_);let y=new Ri(new di({map:gr(),color:16777215,transparent:!0,opacity:0,depthWrite:!1}));y.scale.setScalar(o*.5),y.position.set(u*o*.16,o*.14,o*.12),d.add(y),this.eyes.push({eg:d,ball:g,hl:v,hl2:m,arc:x,brow:_,star:y,s:u})}let c=new it(new ne(o*.085,14,12),V.skin.clone());c.material.color.multiplyScalar(.93),c.position.set(0,-o*.12,l(0,-o*.12)+o*.02),this.head.add(c),this.mouthG=new Lt,this.mouthG.position.set(0,-o*.42,l(0,-o*.42)-.003),this.mouthG.rotation.x=.35,this.head.add(this.mouthG),this.mouthO=new it(new ne(o*.16,20,14),V.mouth),this.mouthO.scale.set(1,.1,.25),this.mouthG.add(this.mouthO),this.smileArc=new it(new Je(o*.17,o*.02,6,18,Math.PI*.8),V.mouth),this.smileArc.rotation.z=Math.PI+Math.PI*.1,this.smileArc.position.y=o*.12,this.mouthG.add(this.smileArc);for(let u of[-1,1]){let h=new it(new Pi(o*.16,20),V.blush),p=u*o*.6,d=-o*.22;h.position.set(p,d,l(p,d)+.002),h.lookAt(h.position.clone().multiplyScalar(2)),this.head.add(h)}this.hairG=new Lt,this.head.add(this.hairG),e.buildHair(this,o),this.arms={};for(let u of[-1,1]){let h=Bl(e.sleeve,.052),p=Bl(e.sleeve,.045),d=new Lt,g=new it(new ne(.047,18,14),V.skin);g.scale.set(.95,1,.8),d.add(g);let v=new it(new Gn(.014,.035,5,10),V.skin);d.add(v);let m=new it(new Je(.043,.012,8,18),e.sleeve);d.add(m);let f=nf(e.sleeve,.054),x=nf(e.sleeve,.047);this.body.add(h,p,d,f,x),this.arms[u]={up:h,fo:p,hand:d,thumb:v,cuff:m,jS:f,jE:x,shoulder:new U(u*e.shoulderW,e.shoulderY-.03,0),s:u}}this.pole={[-1]:new U(-.5,-.8,-.35),1:new U(.5,-.8,-.35)},this.update(.016)}set(t){for(let e in t)this.p[e]&&(this.p[e].target=t[e]);return this}snap(){for(let t in this.p)this.p[t].x=this.p[t].target,this.p[t].v=0}handL(t,e,n){return this.p.lx.target=t,this.p.ly.target=e,this.p.lz.target=n,this}handR(t,e,n){return this.p.rx.target=t,this.p.ry.target=e,this.p.rz.target=n,this}restArms(){let t=this.o;return this.handL(...t.restL),this.handR(...t.restR),this.p.thumb.target=0,this}toLocal(t){return this.root.worldToLocal(t.clone())}lookAtWorld(t,e=1){let n=this.toLocal(t),s=new U(0,this.o.hipY+this.o.shoulderY+.16,0),r=n.sub(s);this.p.yaw.target=Dt(Math.atan2(r.x,r.z),-1.2,1.2)*e,this.p.pitch.target=Dt(-Math.atan2(r.y,Math.hypot(r.x,r.z)),-.6,.8)*e}update(t){this.t+=t;let e=this.p,n=this.o;for(let u in e)e[u].update(t);let s=Math.sin(this.t*1.5)*.004*this.breath;this.body.position.y=n.hipY+e.bob.x+s,this.body.rotation.set(e.lean.x,e.bodyYaw.x,e.leanSide.x),this.headPivot.rotation.set(e.pitch.x,e.yaw.x,e.roll.x,"YXZ");let r=Dt(e.eye.x,0,1.6);for(let u of this.eyes){let h=r>.12;u.ball.visible=u.hl.visible=u.hl2.visible=h,u.arc.visible=!h;let p=Math.min(r,1)*(1+.35*Dt(r-1,0,1));u.ball.scale.set(1+.3*Dt(r-1,0,1),Math.max(.15,p),.55),u.arc.rotation.z=this.arcMode==="happy"?Math.PI*.05:Math.PI+Math.PI*.05,u.arc.position.y=this.arcMode==="happy"?-n.headR*.05:n.headR*.04,u.brow.position.y=n.headR*(.24+.1*e.brow.x),u.brow.rotation.z=Math.PI/2+u.s*(.12-.25*e.brow.x);let d=Dt(e.sparkle.x);u.star.material.opacity=d*(.6+.4*Math.sin(this.t*9+u.s)),u.star.material.rotation=this.t*1.5,u.hl.scale.setScalar(1+d*.8)}let o=Dt(e.mouthOpen.x,0,1.5);this.chew>0&&(o=.12+.14*(.5+.5*Math.sin(this.t*11))*this.chew);let a=o>.06;this.mouthO.visible=a,this.smileArc.visible=!a,this.mouthO.scale.set(.5+.5*e.mouthW.x,Math.max(.08,o),.25);let l=Dt(e.smile.x,-1,1.2);this.smileArc.scale.set(1,l>=0?Math.max(.12,l):-Math.max(.12,-l),1),this.smileArc.position.y=n.headR*(l>=0?.12:-.04)*Math.min(1,Math.abs(l)+.2),n.updateHair&&n.updateHair(this,t);let c=this._inv||(this._inv=new Te);this.body.updateMatrix(),c.copy(this.body.matrix).invert();for(let u of[-1,1]){let h=this.arms[u],p=new U(u<0?e.lx.x:e.rx.x,u<0?e.ly.x:e.ry.x,u<0?e.lz.x:e.rz.x).applyMatrix4(c),d=h.shoulder,g=n.armA,v=n.armB,m=p.clone().sub(d),f=m.length();f=Dt(f,Math.abs(g-v)+.01,g+v-.005),m.normalize(),p.copy(d).addScaledVector(m,f);let x=(g*g+f*f-v*v)/(2*g*f),_=Math.sqrt(Math.max(0,1-x*x)),y=this.pole[u].clone();y.addScaledVector(m,-y.dot(m)).normalize();let w=d.clone().addScaledVector(m,g*x).addScaledVector(y,g*_);Hl(h.up,d,w),Hl(h.fo,w,p),h.jS.position.copy(d),h.jE.position.copy(w),h.hand.position.copy(p),h.cuff.position.copy(w).sub(p).normalize().multiplyScalar(.03),h.cuff.quaternion.setFromUnitVectors(new U(0,0,1),w.clone().sub(p).normalize());let T=Dt(e.thumb.x)*(u>0||n.bothThumbs?1:0);h.thumb.position.set(-u*.04*(1-T),.012+.052*T,.02*(1-T)),h.thumb.rotation.z=-u*.9*(1-T),h.thumb.scale.setScalar(1+.5*T)}}};function Lv(i,t){let e=i.hairG,n=V.hair,s=new it(new ne(t*1.045,36,20,0,Math.PI*2,0,Math.PI*.46),n);s.rotation.x=-.32,s.scale.set(1,1.04,1),e.add(s);let r=new it(new ne(t*1.03,30,16,0,Math.PI*2,0,Math.PI*.62),n);r.rotation.x=-1.05,r.scale.set(1,1,.98),e.add(r);let o=(a,l)=>{let c=new ne(1,16,14);c.scale(l,a/2,l*.8),c.translate(0,a/2,0);let u=c.attributes.position;for(let p=0;p<u.count;p++){let d=u.getY(p)/a,g=1-.45*d;u.setX(p,u.getX(p)*g+Math.sin(d*1.5)*a*.26),u.setZ(p,u.getZ(p)*g)}return c.computeVertexNormals(),new it(c,n)};i.combs=[];for(let a=0;a<2;a++){let l=new Lt;l.position.y=t*.9,e.add(l);let c=[[.125,.046,.06,-.3],[.165,.052,0,0],[.135,.046,-.058,.3],[.09,.038,-.105,.6]];for(let u of c){let h=o(u[0]*(t/.115),u[1]);h.position.set(0,-.012,u[2]),h.rotation.x=-u[3],l.add(h)}i.combs.push(l)}i.combWob=new kn(0,60,3.2)}function Dv(i,t){let e=i.p;i.combWob.update(t);let n=e.hairLean.x,s=Dt(e.hairFlat.x,-.3,1),r=Dt(e.hairSplit.x,0,1),o=i.combWob.x;i.combs.forEach((a,l)=>{let c=l===0?1:-1;a.visible=l===0||r>.02,a.rotation.z=-(n*.55+o)*1-c*r*.62,a.position.x=c*r*i.o.headR*.3,a.scale.set(1,Math.max(.06,1-s*.92),1-.25*r)})}function sf(){let i=new kl({hipY:.47,shoulderY:.46,shoulderW:.205,headR:.118,armA:.27,armB:.26,eye:0,hairLean:1,torso:[[0,0],[.15,0],[.168,.05],[.17,.2],[.172,.33],[.16,.41],[.12,.455],[.06,.475],[0,.48]],cloth:V.pajama,sleeve:V.pajama,hair:V.hair,restL:[-.22,.76,.28],restR:[.22,.76,.28],buildHair:Lv,updateHair:Dv,extra:u=>{u.legs=[];for(let p of[-1,1]){let d=Bl(V.pajama,.075),g=Bl(V.pajama,.062),v=new it(new ne(.06,14,10),V.knit);v.scale.set(.8,.5,1.4),u.root.add(d,g,v),u.legs.push({th:d,sh:g,foot:v,s:p})}let h=new it(new Je(.07,.018,8,20),V.pajama);h.rotation.x=Math.PI/2,h.position.y=.47,h.scale.y=.8,u.body.add(h);for(let p=0;p<3;p++){let d=new it(new ne(.011,10,8),V.ceramic);d.position.set(0,.38-p*.1,.136+(p===0?-.004:.002)),u.body.add(d)}}});i.seated=!0,i.walk=0;let t=i.update.bind(i);i.update=u=>{t(u);let h=i.body.position.y;for(let p of i.legs){let d=p.s,g=new U(d*.09,h+.03,0),v,m;if(i.seated)v=new U(d*.1,.5,.36),m=new U(d*.1,.05,.38);else{let f=Math.sin(i.walk*6+(d>0?Math.PI:0))*.11;v=new U(d*.09,h*.52,.03+f*.6),m=new U(d*.09,.04,f)}Hl(p.th,g,v),Hl(p.sh,v,m),p.foot.position.copy(m).add(new U(0,-.01,.04))}};let e=new Me({transparent:!0,opacity:0,depthWrite:!1,side:xe}),n=new Lt,s=1.35,r=.118*s,o=new it(new Pi(r,40),e);n.add(o);let a=new Wn;a.moveTo(-r*.42,-r*.8),a.quadraticCurveTo(-r*1.35,-r*1.15,-r*1.45,-r*2),a.lineTo(-r*1.45,-r*3),a.lineTo(r*1.45,-r*3),a.lineTo(r*1.45,-r*2),a.quadraticCurveTo(r*1.35,-r*1.15,r*.42,-r*.8),n.add(new it(new or(a),e));let l=new it(new Pi(r*.16,12),e);l.position.set(-r*1,-r*.1,0),n.add(l);let c=[];for(let u=0;u<2;u++){let h=new Lt;h.position.y=r*.82,n.add(h);let p=[[.15,.052,-.065,.3],[.2,.058,0,0],[.165,.052,.065,-.3],[.11,.042,.115,-.6]];for(let d of p){let g=new Wn,v=d[0]*s,m=d[1]*s;g.moveTo(-m,0),g.bezierCurveTo(-m*1.1,v*.6,v*.02,v*1.05,v*.26,v),g.bezierCurveTo(v*.42,v*.95,m*1.2,v*.4,m,0);let f=new it(new or(g),e);f.position.set(d[2]*s,-.02,0),f.rotation.z=d[3],h.add(f)}c.push(h)}return n.traverse(u=>{u.isMesh&&(u.castShadow=!0,u.frustumCulled=!1)}),i.shadowProxy=n,i.proxyOn=0,i.updateProxy=()=>{let u=i.p,h=Dt(u.hairFlat.x,-.3,1),p=Dt(u.hairSplit.x,0,1),d=u.hairLean.x,g=new U(-1.02+u.roll.x*.25,1.2+(i.body.position.y-.47)*1.5-u.pitch.x*.12,q.roomZ0+.02);n.position.copy(g).addScaledVector(q.sunDir,-.42),n.rotation.z=-u.roll.x*.8+u.pitch.x*.5,n.scale.x=d>=0?1:-1,n.visible=i.proxyOn>.5,c.forEach((v,m)=>{v.visible=m===0||p>.02,v.rotation.z=(m===0?-1:1)*p*.5+i.combWob.x*.8-.25*(1-Math.abs(d)),v.scale.set(1,Math.max(.05,1-h*.92),1)})},i}function Nv(i,t){let e=i.hairG,n=V.hairMama,s=new it(new ne(t*1.05,36,20,0,Math.PI*2,0,Math.PI*.5),n);s.rotation.x=-.38,e.add(s);let r=new it(new ne(t*1.06,30,18,0,Math.PI*2,0,Math.PI*.68),n);r.rotation.x=-1.2,e.add(r);for(let l of[-1,1]){let c=new it(new ne(t*.42,16,12),n);c.scale.set(.55,1.25,.8),c.position.set(l*t*.9,-t*.25,t*.12),e.add(c)}let o=new it(new ne(t*.42,20,16),n);o.position.set(0,t*.95,-t*.55),e.add(o);let a=new it(new Je(t*.2,t*.05,8,16),V.enamelRed);a.position.set(0,t*.72,-t*.42),a.rotation.x=.9,e.add(a)}function rf(){return new kl({hipY:.92,shoulderY:.42,shoulderW:.168,headR:.108,armA:.25,armB:.24,eye:1,bothThumbs:!1,torso:[[0,-.02],[.135,-.02],[.142,.1],[.128,.22],[.142,.33],[.136,.38],[.1,.425],[.04,.445],[0,.45]],cloth:V.knit,sleeve:V.knit,hair:V.hairMama,restL:[-.16,.95,.2],restR:[.16,.95,.2],buildHair:Nv,extra:t=>{let e=Fe([[0,.02],[.22,.02],[.21,.2],[.175,.6],[.14,.92],[0,.92]],new Se({color:7307151,roughness:.9}),36);e.receiveShadow=!0,t.root.add(e);for(let a of[-1,1]){let l=new it(new ne(.055,14,10),V.knit);l.scale.set(.8,.45,1.5),l.position.set(a*.08,.025,.1),t.root.add(l)}let n=new it(new sn(.146,.147,.3,24,1,!0,-.75,1.5),V.apron);n.position.y=.2,n.scale.z=.8,t.body.add(n);let s=new it(new sn(.152,.215,.62,24,1,!0,-.95,1.9),V.apron);s.position.y=.5900000000000001,t.root.add(s);let r=new it(new Je(.143,.011,8,30),V.apron);r.rotation.x=Math.PI/2,r.position.y=.04,r.scale.y=.8,t.body.add(r);let o=new it(new Je(.09,.009,8,24,Math.PI),V.apron);o.position.set(0,.35,.03),o.rotation.x=-.5,t.body.add(o)}})}var In=(i,t=!0,e=!0)=>(i.traverse(n=>{n.isMesh&&n.material.visible!==!1&&(n.castShadow=t,n.receiveShadow=e)}),i),Oe={rb:.098,rt:.132,h:.044,floorY:.0046};function of(i=0){let t=new Lt,{rb:e,rt:n,h:s}=Oe,r=[V.panOuter,V.panRed,V.panCream][i],o=Fe([[0,0],[e-.012,0],[e-.002,.002],[e+.006,.01],[e+.016,.024],[n-.002,s-.003],[n+.0012,s-5e-4],[n+.001,s+8e-4]],r,96);t.add(o);let a=Fe([[n+.001,s+8e-4],[n-.0015,s+.001],[n-.0035,s-.002],[e+.013,.025],[e+.003,.011],[e-.005,.0062],[e-.016,.0047],[0,.0046]],V.nonstick,96);t.add(a);let l=new Lt;l.position.set(n-.004,s-.012,0),l.rotation.z=.2,t.add(l);let c=he(.05,.007,.03,.003,V.steelPolished,2);c.position.set(.02,0,0),l.add(c);for(let d of[-1,1]){let g=Re(.0035,.0035,.003,V.steelPolished,10);g.rotation.x=Math.PI/2,g.position.set(-.004,0,d*.008)}let u=i===0?V.bakelite:V.board,h=new it(new Gn(.013,.135,8,20),u);h.rotation.z=Math.PI/2,h.scale.set(1,1,.72),h.position.set(.115,.002,0),l.add(h);let p=new it(new Je(.007,.002,8,16),V.steelPolished);return p.rotation.x=Math.PI/2,p.position.set(.196,.002,0),l.add(p),In(t),t.userData.kind=i,t}function af(){let i=new Lt,t=[],e=.134,n=.034;for(let c=0;c<=14;c++){let u=c/14*(Math.PI/2);t.push([Math.sin(u)*e,Math.cos(u)*n*.999-0+.002])}let s=V.glass.clone();s.opacity=.2,s.roughness=.04;let r=Fe(t,s,72);r.renderOrder=8,i.add(r);let o=new it(new Je(e,.0035,10,72),V.steelPolished);o.rotation.x=Math.PI/2,o.position.y=.003,o.castShadow=!0,i.add(o);let a=Re(.007,.01,.014,V.steelPolished,16);a.position.y=n+.007,i.add(a);let l=Fe([[0,0],[.014,0],[.021,.006],[.02,.014],[.012,.018],[0,.019]],V.bakelite,32);return l.position.y=n+.013,l.castShadow=!0,i.add(l),i.userData.glass=s,i}function lf(){let i=new Lt,t=V.enamelCream,e=Fe([[0,0],[.085,0],[.095,.006],[.098,.03],[.09,.075],[.07,.108],[.045,.122],[.04,.126],[0,.126]],t,64);i.add(e);let n=Fe([[0,0],[.042,0],[.04,.006],[.02,.014],[0,.016]],t,40);n.position.y=.126,i.add(n);let s=new it(new ne(.012,16,12),V.bakelite);s.position.y=.153,i.add(s);let r=new Li([new U(.08,.055,0),new U(.115,.075,0),new U(.135,.115,0),new U(.15,.13,0)]),o=new it(new Xi(r,20,.012,14),t);i.add(o);let a=new Li([new U(-.06,.118,0),new U(-.07,.19,0),new U(0,.22,0),new U(.07,.19,0),new U(.06,.118,0)]),l=new it(new Xi(a,30,.006,10),V.steelPolished);i.add(l);let c=new it(new Gn(.0095,.07,6,14),V.bakelite);return c.rotation.z=Math.PI/2,c.position.y=.221,i.add(c),In(i),i.userData.spout=new U(.152,.134,0),i}var Ln={r:.128,wellY:.0088,wellR:.082},Uv=[[0,.003],[.062,.003],[.066,0],[.074,0],[.077,.004],[.1,.012],[.126,.0205],[.1285,.0222],[.1265,.0245],[.1,.0162],[.084,.0102],[.06,.0088],[0,.0088]];function zl(i=0){let t=new Lt,e=[V.ceramic,V.ceramic,V.ceramicYellow,V.ceramicPink][i]||V.ceramic,n=Fe(Uv,e,96);if(t.add(n),i===1){let s=Fe([[.112,.0204],[.1215,.0234]],V.ceramicBlue,96);s.material=V.ceramicBlue.clone(),s.material.side=xe,s.position.y=3e-4,t.add(s);let r=Fe([[.1035,.0177],[.1055,.0183]],s.material,96);r.position.y=3e-4,t.add(r)}return In(t),t.userData.kind=i,t}function Eh(i=.075,t=.05,e=V.ceramicBlue){let n=[[0,.003],[i*.38,.003],[i*.42,0],[i*.5,0],[i*.52,.004]];for(let r=1;r<=8;r++){let o=r/8*(Math.PI/2);n.push([i*(.52+.48*Math.sin(o)),.004+(t-.004)*(1-Math.cos(o))])}n.push([i-.002,t+.001]);for(let r=7;r>=0;r--){let o=r/8*(Math.PI/2);n.push([(i-.004)*(.5+.5*Math.sin(o)),.008+(t-.008)*(1-Math.cos(o))])}n.push([0,.008]);let s=Fe(n,e,64);return In(s),s}function Th(i=V.ceramic){let t=new Lt,e=Fe([[0,0],[.034,0],[.037,.003],[.038,.085],[.0385,.087],[.036,.087],[.0345,.008],[0,.007]],i,48);t.add(e);let n=new it(new Je(.024,.006,10,24,Math.PI),i);return n.rotation.z=-Math.PI/2,n.position.set(.037,.045,0),t.add(n),In(t),t}function cf(){let i=V.glass.clone();i.opacity=.22;let t=Fe([[0,0],[.028,0],[.03,.004],[.036,.11],[.0345,.11],[.0285,.008],[0,.007]],i,40);return t.renderOrder=6,t}function hf(){let i=new Lt,t=he(.15,.012,.09,.005,V.ceramic,3);t.position.y=.006,i.add(t);let e=he(.06,.03,.045,.004,V.butter,3);e.position.set(-.035,.027,0),i.add(e);let n=[];for(let s=0;s<3;s++){let r=Rh();r.position.set(.012+s*.022,.012,s%2*.01-.004),r.rotation.y=.2*(s-1),i.add(r),n.push(r)}return In(i),i.userData.pats=n,i}function Rh(){let i=he(.026,.011,.026,.003,V.butter.clone(),3);return i.geometry.translate(0,.0055,0),i.castShadow=!0,i.receiveShadow=!0,i}function uf(){let i=new Lt,t=.29,e=.185,n=.165,s=he(t,e,n,.035,V.enamelCream,6);s.position.y=e/2+.008,i.add(s);let r=he(t-.01,.012,n-.01,.004,V.bakelite,2);r.position.y=.006,i.add(r);let o=he(t-.06,.004,n-.03,.002,V.steel,2);o.position.y=e+.0085,i.add(o);let a=new Se({color:3811874,emissive:new Bt(1,.32,.05),emissiveIntensity:0,roughness:.7}),l=[-.034,.034],c=.15,u=.034;for(let v of l){let m=We(c,.002,u,V.black);m.position.set(0,e+.0108,v),i.add(m);let f=new Lt;f.position.set(0,e-.05,v),i.add(f);for(let x of[-1,1]){let _=new it(new He(c,.12),a);_.position.set(0,0,x*(u/2-.001)),_.rotation.y=x>0?Math.PI:0,f.add(_)}}let h=new Lt;h.position.set(t/2+.004,e*.8,0),i.add(h);let p=We(.003,.1,.012,V.black);p.position.set(t/2+5e-4,e*.52,0),i.add(p);let d=he(.03,.016,.044,.006,V.bakelite,3);d.position.x=.014,h.add(d);let g=Re(.016,.016,.008,V.steelCirc,24);g.rotation.z=Math.PI/2,g.position.set(t/2+.003,.05,.045),i.add(g);for(let v of[-1,1])for(let m of[-1,1]){let f=Re(.009,.009,.006,V.rubber,10);f.position.set(v*(t/2-.04),.002,m*(n/2-.03)),i.add(f)}return In(i),i.userData={lever:h,leverUpY:e*.8,leverDownY:e*.3,coilMat:a,slotZ:l,topY:e+.011,W:t,H:e,D:n},i}var Fv=(()=>{let i=new Wn,t=.056,e=.058,n=.012;return i.moveTo(-t+n,-e),i.lineTo(t-n,-e),i.quadraticCurveTo(t,-e,t,-e+n),i.lineTo(t,e*.45),i.bezierCurveTo(t+.006,e*.95,t*.5,e*1.08,0,e*1.02),i.bezierCurveTo(-t*.5,e*1.08,-t-.006,e*.95,-t,e*.45),i.lineTo(-t,-e+n),i.quadraticCurveTo(-t,-e,-t+n,-e),i})();function Ah(){let t=new gs(Fv,{depth:.017,bevelEnabled:!0,bevelThickness:.002,bevelSize:.002,bevelSegments:2,curveSegments:14});t.translate(0,0,-.017/2),t.scale(.85,.85,1);let e=t.attributes.uv;for(let p=0;p<e.count;p++)e.setXY(p,e.getX(p)/.12+.5,e.getY(p)/.12+.5);let n=Yd(),s={uToast:{value:0},tToast:{value:n.toastMap},uBites:{value:[new U(9,9,0),new U(9,9,0),new U(9,9,0),new U(9,9,0)]}},r="varying vec3 vLocal;",o="vLocal = position;",a="varying vec3 vLocal; uniform vec3 uBites[4]; uniform float uToast; uniform sampler2D tToast;",l="for (int i = 0; i < 4; i++) { float bd = distance(vLocal.xy, uBites[i].xy); float wob = 0.004 * sin(atan(vLocal.y - uBites[i].y, vLocal.x - uBites[i].x) * 7.0); if (bd < uBites[i].z + wob) discard; }",c=Yn(new Se({map:n.map,normalMap:n.normalMap,normalScale:new ot(.55,.55),roughness:.92,side:xe}),{uniforms:s,vertexPars:r,vertexMain:o,fragmentPars:a,key:"breadface",replace:{"#include <map_fragment>":`#include <map_fragment>
      ${l}
      float tp = texture2D(tToast, vMapUv).r;
      float edge = smoothstep(0.03, 0.049, max(abs(vLocal.x), abs(vLocal.y - 0.002)));
      float tk = smoothstep(0.0, 1.0, uToast * 1.5 - (1.0 - tp) * 0.75 + edge * 0.15 * uToast);
      vec3 golden = vec3(0.80, 0.50, 0.20), deep = vec3(0.50, 0.26, 0.09);
      diffuseColor.rgb = mix(diffuseColor.rgb, mix(golden, deep, smoothstep(0.55, 1.0, tk)) * (0.8 + 0.4 * diffuseColor.r), tk * 0.92);`}}),u=Yn(new Se({color:12155194,roughness:.8,normalMap:Zn(60,.5,4),side:xe}),{uniforms:s,vertexPars:r,vertexMain:o,fragmentPars:a,key:"breadcrust",replace:{"#include <map_fragment>":`#include <map_fragment>
      ${l}
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.22, 0.08), uToast * 0.55);
      if (!gl_FrontFacing) diffuseColor.rgb = vec3(0.96, 0.90, 0.74);`}}),h=new it(t,[c,u]);return h.castShadow=!0,h.receiveShadow=!0,h.userData={uni:s,th:.017,halfH:.0493},h}function Ov(){let i=new Lt,t=.017,e=new Ge({color:13837852,roughness:.22,clearcoat:.7,clearcoatRoughness:.08,sheen:.3,sheenColor:new Bt(16744544)}),n=new it(new ne(t,28,20),e);n.scale.set(1,.92,1),n.position.y=t*.92,i.add(n);let s=new Se({color:4160812,roughness:.7,side:xe});for(let o=0;o<5;o++){let a=new it(new Ii(.0035,.014,5),s),l=o/5*Math.PI*2;a.position.set(Math.cos(l)*.006,t*1.84-.001,Math.sin(l)*.006),a.rotation.set(Math.sin(l)*1.35,0,-Math.cos(l)*1.35),a.scale.z=.4,i.add(a)}let r=Re(.0012,.0015,.008,s,6);return r.position.y=t*1.84+.004,i.add(r),In(i),i.userData={foot:.018,type:"tomato",h:.034},i}function Bv(i=1){let t=we(i*17+3),e=12,n=40,s=new Ce,r=[],o=[],a=[],l=[];for(let p=0;p<=e;p++)for(let d=0;d<=n;d++){let g=p/e,v=d/n*Math.PI*1.25-Math.PI*.625,m=.062*g*(1+.14*Math.sin(v*3.3+i)+.07*Math.sin(v*7.7+i*3)),f=Math.pow(g,2)*(.01*Math.sin(v*9+i*2+g*3)+.008*Math.sin(v*17.3+1+g*5)+.005*Math.sin(v*31+i)),x=.02*g*g;r.push(Math.sin(v)*m,x+f+.002+.004*g*Math.sin(v*3),-Math.cos(v)*m+.03);let _=Math.min(1,g*(.85+.3*Math.sin(v*4+i)));o.push(.88-.52*_+.05*t(),.93-.2*_,.66-.48*_),l.push(d/n,g)}for(let p=0;p<e;p++)for(let d=0;d<n;d++){let g=p*(n+1)+d,v=g+1,m=g+n+1,f=m+1;a.push(g,m,v,v,m,f)}s.setAttribute("position",new Xt(r,3)),s.setAttribute("color",new Xt(o,3)),s.setAttribute("uv",new Xt(l,2)),s.setIndex(a),s.computeVertexNormals();let c=new Ge({vertexColors:!0,roughness:.45,side:xe,sheen:.5,sheenColor:new Bt(14221232),clearcoat:.25,clearcoatRoughness:.4,normalMap:Zn(18,.5,14),normalScale:new ot(.6,.6)}),u=new it(s,c);u.castShadow=!0,u.receiveShadow=!0;let h=new Lt;return h.add(u),h.userData={foot:.05,type:"lettuce",h:.02},h}function Hv(){let i=new Lt,t=ns("strawb",256,(r,o)=>{r.fillStyle="#d11f2a",r.fillRect(0,0,o,o);let a=r.createLinearGradient(0,0,0,o);a.addColorStop(0,"rgba(255,230,200,0.55)"),a.addColorStop(.25,"rgba(255,60,60,0)"),r.fillStyle=a,r.fillRect(0,0,o,o);for(let l=0;l<9;l++)for(let c=0;c<12;c++){let u=(c+l%2*.5)*(o/12),h=30+l*(o/10.5);r.fillStyle="rgba(120,10,20,0.5)",r.beginPath(),r.ellipse(u,h,5,6.5,0,0,7),r.fill(),r.fillStyle="#f1d27a",r.beginPath(),r.ellipse(u,h+.5,2.2,3.2,0,0,7),r.fill()}},{wrap:!0}),e=new Ge({map:t,roughness:.3,clearcoat:.6,clearcoatRoughness:.15,bumpMap:t,bumpScale:-.6}),n=Fe([[0,0],[.006,.002],[.013,.012],[.0175,.024],[.0165,.032],[.011,.037],[0,.038]],e,32);i.add(n);let s=new Se({color:5081646,roughness:.7,side:xe});for(let r=0;r<6;r++){let o=new it(new Ii(.004,.016,5),s),a=r/6*Math.PI*2;o.position.set(Math.cos(a)*.008,.0375,Math.sin(a)*.008),o.rotation.set(Math.sin(a)*1.45,0,-Math.cos(a)*1.45),o.scale.z=.35,i.add(o)}return i.rotation.z=0,In(i),i.userData={foot:.018,type:"strawberry",h:.04,tilt:1.15},i}function kv(i=2){let t=new Lt,e=we(i*31),n=new Se({color:4161322,roughness:.85,normalMap:Zn(90,.9,21),normalScale:new ot(1.5,1.5)}),s=new Se({color:11126650,roughness:.6}),r=Re(.007,.009,.022,s,12);r.position.y=.011,t.add(r);for(let o=0;o<11;o++){let a=e()*6.28,l=o===0?0:.008+e()*.01,c=new it(new oo(.0095+e()*.004,2),n);c.position.set(Math.cos(a)*l,.028+e()*.008-l*.3,Math.sin(a)*l),t.add(c)}return In(t),t.userData={foot:.022,type:"broccoli",h:.04},t}function zv(){let i=new Lt,t=new Ge({color:11883311,roughness:.3,clearcoat:.6,clearcoatRoughness:.2}),e=new it(new Gn(.0085,.042,8,16),t);e.rotation.z=Math.PI/2,e.position.y=.0085,i.add(e);let n=new Se({color:8007448,roughness:.6});for(let s=-1;s<=1;s++){let r=We(.0015,.004,.014,n);r.position.set(s*.012,.0155,0),r.rotation.y=.5,i.add(r)}return In(i),i.userData={foot:.03,type:"sausage",h:.017},i}var df={tomato:Ov,lettuce:Bv,strawberry:Hv,broccoli:kv,sausage:zv};function ff(){let i=new Lt,t=he(.085,.0022,.1,.001,V.bakelite,2);t.position.set(0,.0011,-.05),i.add(t);let e=he(.018,.004,.09,.0018,V.bakelite,2);e.position.set(0,.016,.04),e.rotation.x=-.36,i.add(e);let n=new it(new Gn(.0095,.15,6,14),V.board);return n.rotation.x=Math.PI/2-.36,n.position.set(0,.062,.162),n.scale.z=1,i.add(n),In(i),i}function pf(){let i=new Lt,t=he(.11,.028,.07,.008,V.sponge,3);t.position.y=.014,i.add(t);let e=he(.11,.008,.07,.003,V.spongeGreen,2);return e.position.y=.032,i.add(e),In(i),i}function Ch(i=.26,t=.2){let e=new He(i,t,26,20);e.rotateX(-Math.PI/2);let n=e.attributes.position;for(let r=0;r<n.count;r++){let o=n.getX(r),a=n.getZ(r);n.setY(r,.004+.004*Math.sin(o*60+a*25)+.003*Math.sin(a*70)+.01*Math.exp(-((o*o+a*a)/.004)))}e.computeVertexNormals();let s=new it(e,V.towel);return s.castShadow=!0,s.receiveShadow=!0,s}function mf(){let i=new Lt,t=Fe([[0,0],[.05,0],[.055,.005],[.055,.14],[.052,.142],[.05,.14],[.05,.008],[0,.008]],V.ceramic,40);i.add(t);let e=we(12);for(let n=0;n<4;n++){let s=new it(new Gn(.006,.2,4,10),n%2?V.board:V.steelPolished);s.position.set((e()-.5)*.05,.14,(e()-.5)*.05),s.rotation.set((e()-.5)*.4,0,(e()-.5)*.4),i.add(s);let r=n%2?he(.045,.006,.07,.003,V.board,2):new it(new ne(.028,16,10,0,6.28,0,1.4),V.steelPolished);r.position.copy(s.position).add(new U(Math.sin(-s.rotation.z)*.13,.125,Math.sin(s.rotation.x)*.13)),r.rotation.set(Math.PI/2+s.rotation.x,0,s.rotation.z),i.add(r)}return In(i),i}function gf(){let i=new Lt,t=V.glass.clone();t.opacity=.3,t.color.set(14676976);let e=Fe([[0,0],[.026,0],[.034,.03],[.03,.07],[.018,.1],[.02,.118],[.017,.118],[.015,.1],[.027,.07],[.03,.03],[0,.006]],t,40);e.renderOrder=6,i.add(e);let n=new Se({color:5081658,roughness:.6}),s=[16238920,16777215,15899312];for(let r=0;r<3;r++){let o=r*2.1,a=.22,l=Re(.002,.002,.2,n,6);l.position.set(Math.cos(o)*.012,.11,Math.sin(o)*.012),l.rotation.set(Math.sin(o)*a,0,-Math.cos(o)*a),i.add(l);let c=new U(Math.cos(o)*(.012+.1*Math.sin(a)),.21,Math.sin(o)*(.012+.1*Math.sin(a))),u=new Se({color:s[r],roughness:.6,side:xe});for(let p=0;p<8;p++){let d=new it(new ne(.011,10,8),u),g=p/8*6.28;d.scale.set(1,.25,.5),d.position.copy(c).add(new U(Math.cos(g)*.013,0,Math.sin(g)*.013)),d.rotation.y=-g,i.add(d)}let h=new it(new ne(.007,12,10),new Se({color:14721056,roughness:.8}));h.position.copy(c),h.position.y+=.002,i.add(h)}return i.traverse(r=>{r.isMesh&&!r.material.transparent&&(r.castShadow=!0)}),i}var Gv=.0285,xf=.0215,Wv=i=>xf*Math.sin(i)*(1+.17*Math.cos(i)),Xv=i=>-Gv*Math.cos(i),Vl=null;function qv(){if(Vl)return Vl;let i=wh();return Vl=qd().map((e,n)=>Yn(new Ge({color:15586230,map:e,normalMap:i.normalMap,normalScale:new ot(.35,.35),roughness:.52,side:xe,sheen:.2,sheenColor:new Bt(16773344)}),{key:"shell"+n,replace:{"#include <map_fragment>":`#include <map_fragment>
      if (!gl_FrontFacing) { diffuseColor.rgb = vec3(0.97, 0.955, 0.93); }`}})),Vl}function vf(i=1){let t=we(i*131+7),e=48,n=14,s=[],r=[];for(let m=0;m<5;m++)s.push((t()-.5)*.11),r.push([2+Math.floor(t()*9),t()*6.28]);let o=m=>{let f=0;for(let x=0;x<5;x++)f+=s[x]*Math.sin(m*r[x][0]+r[x][1]);return Math.PI/2+.03+f+.035*Math.sign(Math.sin(m*17+i))},a=(m,f)=>{let x=[],_=[],y=[];for(let T=0;T<=n;T++)for(let M=0;M<=e;M++){let E=M/e*Math.PI*2,N=Ot(m(E),f(E),T/n),C=Wv(N);x.push(Math.cos(E)*C,Xv(N),Math.sin(E)*C),_.push(M/e,N/Math.PI)}for(let T=0;T<n;T++)for(let M=0;M<e;M++){let E=T*(e+1)+M,N=E+1,C=E+e+1,L=C+1;y.push(E,N,C,N,L,C)}let w=new Ce;return w.setAttribute("position",new Xt(x,3)),w.setAttribute("uv",new Xt(_,2)),w.setIndex(y),w.computeVertexNormals(),w},l=qv(),c=new Lt,u=new Lt;c.add(u);let h=new U(0,0,-xf),p=m=>{let f=new Lt;f.position.copy(h);let x=new it(m,l[0]);return x.position.copy(h).negate(),x.castShadow=!0,x.receiveShadow=!0,f.add(x),u.add(f),{piv:f,mesh:x}},d=p(a(()=>1e-4,o)),g=p(a(o,()=>Math.PI-1e-4)),v={group:c,tilt:u,bottom:d,top:g,stage:0,open:0};return v.setStage=m=>{v.stage=m,d.mesh.material=g.mesh.material=l[Dt(m,0,3)]},v.setOpen=m=>{v.open=m,d.piv.rotation.x=m*1,g.piv.rotation.x=-m*1},v}var As=null,_f=null;function yf(){if(As)return As;let i=hn(1234,256),t=hn(99,256),e=tn(256,(o,a)=>[i.fbm(o*6,a*6,4),t.fbm(o*20,a*20,3),i(o*96,a*96)*.6+t(o*190,a*190)*.4]);As=To(e,{srgb:!1}),As.anisotropy=1;let n=256,s=new Float32Array(n*n),r=we(5);for(let o=0;o<260;o++){let a=r()*n,l=r()*n,c=3+r()*r()*16;for(let u=-c;u<=c;u++)for(let h=-c;h<=c;h++){let p=Math.hypot(h,u)/c;if(p>=1)continue;let d=(Math.floor(l+u)%n+n)%n*n+(Math.floor(a+h)%n+n)%n;s[d]=Math.max(s[d],Math.sqrt(1-p*p))}}return _f=To(tn(n,(o,a,l,c)=>s[c*n+l]),{srgb:!1}),As}var Yv=`
varying vec3 vEggPos; varying float vEdge; varying float vThick;
uniform float uCook, uCrisp, uFilmW; uniform sampler2D tNoise; uniform sampler2D tBubble; uniform vec3 uBites[6];
float eggCookAt(float n1) { return 0.05 + 0.40 * pow(vEdge, 0.8) + 0.50 * vThick + 0.12 * (n1 - 0.5); }
`,Gl=class{constructor({seed:t=1,twin:e=!1,slot:n=[0,0],panR:s=Oe.rb-.008}){yf(),this.seed=t,this.twin=e,this.slot=n;let r=we(t*7919+13);this.group=new Lt,this.cook=0,this.crisp=0,this.spread=0,this.film=0;let o=e?.057:.052,a=[.13,.1,.07,.05,.035,.025].map(S=>S*(.6+r()*.8)),l=a.map(()=>r()*6.28),c=[r()*6.28,r()*6.28],u=S=>{let P=1;for(let W=0;W<a.length;W++)P+=a[W]*Math.sin((W+1)*S+l[W]);let F=o*P,D=Math.cos(S),H=Math.sin(S),B=n[0]*D+n[1]*H,z=n[0]*n[0]+n[1]*n[1]-s*s,Z=-B+Math.sqrt(Math.max(0,B*B-z));return Math.min(F,Z*(.97+.02*Math.sin(S*9+l[0])))},h=e?.0185:.0205,p=[(r()-.5)*.012,(r()-.5)*.01],d=r()*3.14;this.yolkDefs=e?[{x:p[0]+Math.cos(d)*.0195,z:p[1]+Math.sin(d)*.0195,r:h},{x:p[0]-Math.cos(d)*.0195,z:p[1]-Math.sin(d)*.0195,r:h}]:[{x:p[0],z:p[1],r:h}];let g=this.yolkDefs,v=(S,P)=>{let F=1e9;for(let D of g)F=Math.min(F,Math.hypot(S-D.x,P-D.z));if(g.length>1){let D=Math.hypot(S-g[0].x,P-g[0].z),H=Math.hypot(S-g[1].x,P-g[1].z),B=.02,z=Dt(.5+.5*(H-D)/B);F=Ot(H,D,z)-B*z*(1-z)}return F},m=.0021,f=.005,x=112,_=30,y=new Float32Array((x*_+1)*3),w=[],T=[],M=[],E=[],N=new Float32Array(y.length),C=0;y[0]=0,y[1]=m+f*.6,y[2]=0,w.push(1),T.push(1),M.push(0),E.push(0),C=1;for(let S=1;S<=_;S++)for(let P=0;P<x;P++){let F=P/x*Math.PI*2,D=u(F),H=Math.pow(S/_,.9),B=Math.cos(F)*D*H,z=Math.sin(F)*D*H,Z=Math.sqrt(Math.max(0,1-Math.pow(H,7))),W=.034+.005*Math.sin(F*3+l[1])+.003*Math.sin(F*7+l[2])+(e?.004:0),tt=(1-qn(g[0].r*.85,W,v(B,z)))*Z,k=(m*(.75+.25*Math.sin(F*5+H*9+l[3])*H)*Z+f*tt)*(S===_?.02:1);y[C*3]=B,y[C*3+1]=k,y[C*3+2]=z,w.push(1-S/_),T.push(tt),E.push(H),M.push(.5+.5*Math.sin(F*2+c[0])*Math.sin(F*3+c[1])),C++}let L=[];for(let S=0;S<x;S++)L.push(0,1+(S+1)%x,1+S);for(let S=1;S<_;S++)for(let P=0;P<x;P++){let F=1+(S-1)*x+P,D=1+(S-1)*x+(P+1)%x,H=F+x,B=D+x;L.push(F,D,H,D,B,H)}let b=new Ce;b.setAttribute("position",new An(N,3)),b.setAttribute("aEdge",new Xt(w,1)),b.setAttribute("aThick",new Xt(T,1)),b.setIndex(L),this.geo=b,this.base=y,this.lobe=M,this.rho=E,this.outline=u,this.uni={uCook:{value:0},uCrisp:{value:0},uFilmW:{value:0},tNoise:{value:As},tBubble:{value:_f},uBites:{value:Array.from({length:6},()=>new U(9,9,0))}};let R=Yn(new Ge({color:16777215,roughness:.3,metalness:0,transparent:!0,clearcoat:1,clearcoatRoughness:.05,ior:1.36,specularIntensity:1}),{uniforms:this.uni,key:"eggwhite",vertexPars:"attribute float aEdge; attribute float aThick; varying vec3 vEggPos; varying float vEdge; varying float vThick;",vertexMain:"vEggPos = position; vEdge = aEdge; vThick = aThick;",fragmentPars:Yv,replace:{"#include <map_fragment>":`
          vec2 nuv = vEggPos.xz;
          float n1 = texture2D(tNoise, nuv * 5.0 + 0.13).r, n2 = texture2D(tNoise, nuv * 17.0).g, n3 = texture2D(tNoise, nuv * 46.0).b;
          for (int i = 0; i < 6; i++) { float bd = distance(vEggPos.xz, uBites[i].xy); float wob = 0.0035 * sin(atan(vEggPos.z - uBites[i].y, vEggPos.x - uBites[i].x) * 6.0 + float(i)); if (bd < uBites[i].z + wob) discard; }
          float eCook = smoothstep(-0.075, 0.075, uCook - eggCookAt(n1) + (n2 - 0.5) * 0.06);
          // raw: clear, faintly yellow jelly. cooked: opaque porcelain white with slight warmth
          vec3 rawCol = vec3(0.92, 0.86, 0.60) * 0.22;
          vec3 cookedCol = vec3(0.955, 0.945, 0.915) * (0.93 + 0.07 * n2) ;
          // crisp golden lace along the rim
          float rim = 1.0 - smoothstep(0.0, 0.11 + 0.10 * n1, vEdge);
          float brown = clamp(rim * uCrisp * (0.55 + 0.9 * n2) * eCook, 0.0, 1.0);
          vec3 golden = vec3(0.86, 0.56, 0.20), deep = vec3(0.50, 0.25, 0.07);
          cookedCol = mix(cookedCol, mix(golden, deep, smoothstep(0.45, 1.0, brown * (0.6 + n3))), smoothstep(0.05, 0.6, brown));
          // warm glow of the pan butter through thin white
          cookedCol = mix(cookedCol, cookedCol * vec3(1.0, 0.985, 0.94), (1.0 - vThick) * 0.5);
          diffuseColor.rgb = mix(rawCol, cookedCol, eCook);
          float rawA = 0.10 + 0.16 * vThick + 0.10 * (1.0 - smoothstep(0.0, 0.05, vEdge));
          float a = mix(rawA, 1.0, smoothstep(0.0, 0.8, eCook));
          // lace holes: the thin edge bubbles and breaks up when it crisps
          float lace = (1.0 - smoothstep(0.0, 0.085 * (0.3 + uCrisp), vEdge)) * smoothstep(0.52 - 0.22 * uCrisp, 0.75, n3 * 0.55 + n2 * 0.6) * step(0.05, uCrisp) * eCook;
          a *= 1.0 - lace * 0.92;
          a *= smoothstep(0.0, 0.012, vEdge);
          diffuseColor.a = a;
          float eggCooked = eCook; float eggBrown = brown; float eggN3 = n3;`,"#include <roughnessmap_fragment>":"float roughnessFactor = mix(0.035, 0.34 + 0.20 * eggN3 + 0.25 * eggBrown, eggCooked);","#include <normal_fragment_maps>":`
          { // tiny blisters where the white has set; they stay as the classic bumpy fried surface
            float e = 0.004; vec2 buv = vEggPos.xz * 13.0;
            float b0 = texture2D(tBubble, buv).r, bx = texture2D(tBubble, buv + vec2(e, 0.0)).r, bz = texture2D(tBubble, buv + vec2(0.0, e)).r;
            float amt = eggCooked * (0.15 + 0.85 * (1.0 - vThick)) * (0.35 + 0.65 * uCrisp) * (0.35 + 0.65 * (1.0 - smoothstep(0.1, 0.5, vEdge)));
            vec3 bn = vec3(-(bx - b0), 0.0, -(bz - b0)) * 7.5 * amt;
            normal = normalize(normal + (viewMatrix * vec4(bn, 0.0)).xyz);
          }`,"#include <opaque_fragment>":`
          material.clearcoat *= 1.0;
          diffuseColor.a = clamp(diffuseColor.a + dot(totalSpecular + clearcoatSpecularDirect + clearcoatSpecularIndirect, vec3(0.45)) * (1.0 - eggCooked) , 0.0, 1.0);
          #include <opaque_fragment>`}});this.whiteMat=R,this.white=new it(b,R),this.white.receiveShadow=!0,this.white.renderOrder=3,this.group.add(this.white),this.yolks=[];for(let S of g){let P={uWob:{value:new ot},uSquash:{value:0},uFilm:{value:0},uRad:{value:S.r}},F=Yn(new Ge({color:16095750,roughness:.2,clearcoat:1,clearcoatRoughness:.07,emissive:13916672,emissiveIntensity:.16,sheen:.5,sheenColor:new Bt(16762976),sheenRoughness:.4,envMapIntensity:1.5}),{uniforms:P,key:"yolk",vertexPars:"uniform vec2 uWob; uniform float uSquash; uniform float uRad; varying float vYh;",vertexMain:`float hh = clamp(position.y / uRad * 0.5 + 0.5, 0.0, 1.0); vYh = hh;
          transformed.xz += uWob * hh * hh; transformed.y *= 1.0 - uSquash; transformed.xz *= 1.0 + uSquash * 0.45;`,fragmentPars:"uniform float uFilm; varying float vYh;",replace:{"#include <map_fragment>":`
            float ndv = clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0);
            diffuseColor.rgb = mix(vec3(0.88, 0.33, 0.0), vec3(0.98, 0.585, 0.02), pow(ndv, 0.7));       // deeper orange at grazing angles
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.84, 0.66), uFilm * (0.55 + 0.3 * vYh));`,"#include <roughnessmap_fragment>":"float roughnessFactor = mix(roughness, 0.42, uFilm);"}}),D=new it(new ne(S.r,48,32),F);D.scale.y=.74,D.position.set(S.x,.0092,S.z),D.castShadow=!0,D.renderOrder=2,this.group.add(D),this.yolks.push({mesh:D,u:P,def:S,wx:new kn(0,220,9),wz:new kn(0,220,9),sq:new kn(0,260,12),gone:!1})}this.setSpread(0)}setSpread(t){this.spread=t;let e=this.base,n=this.geo.attributes.position.array,s=n.length/3,r=jt.out(Dt(t));for(let o=0;o<s;o++){let a=this.rho[o],l=Dt(t*1.45-.45*this.lobe[o]*a),c=Ot(.4-.1*a,1,jt.out(l));n[o*3]=e[o*3]*c,n[o*3+2]=e[o*3+2]*c,n[o*3+1]=e[o*3+1]*Ot(2.3-1*a,1,r)}this.geo.attributes.position.needsUpdate=!0,this.geo.computeVertexNormals(),this.geo.computeBoundingSphere()}kick(t=0,e=0,n=0){for(let s of this.yolks)s.wx.kick(t*(.8+.4*Math.random())),s.wz.kick(e*(.8+.4*Math.random())),s.sq.kick(n)}setBite(t,e,n,s){this.uni.uBites.value[t].set(e,n,s);for(let r of this.yolks)!r.gone&&Math.hypot(r.def.x-e,r.def.z-n)<s+r.def.r*.35&&(r.gone=!0,r.mesh.visible=!1)}clearBites(){for(let t of this.uni.uBites.value)t.set(9,9,0);for(let t of this.yolks)t.gone=!1,t.mesh.visible=!0}update(t,e,n=0){this.uni.uCook.value=this.cook,this.uni.uCrisp.value=this.crisp,this.whiteMat.clearcoatRoughness=Ot(.04,.22,Dt(this.cook)),this.whiteMat.clearcoat=Ot(1,.55,Dt(this.cook));for(let s of this.yolks)n>.05&&Math.random()<t*14*n&&(s.wx.kick((Math.random()-.5)*.02*n),s.wz.kick((Math.random()-.5)*.02*n)),s.wx.update(t),s.wz.update(t),s.sq.update(t),s.u.uWob.value.set(s.wx.x,s.wz.x),s.u.uSquash.value=Dt(s.sq.x,-.25,.45),s.u.uFilm.value=this.film}};function Mf(){let i=new sn(1,.55,1,14,6,!0);i.translate(0,-.5,0);let t=new Ge({color:16774872,roughness:.03,transparent:!0,opacity:.32,clearcoat:1,clearcoatRoughness:.03,depthWrite:!1}),e=new it(i,t);return e.renderOrder=4,e}function Sf(){yf();let i=new Pi(Oe.rb-.006,64);i.rotateX(-Math.PI/2);let t={uMelt:{value:0},uHot:{value:0},uTime:{value:0},tNoise:{value:As},uCentre:{value:new ot}},e=Yn(new Ge({color:16769162,roughness:.06,transparent:!0,depthWrite:!1,clearcoat:1,clearcoatRoughness:.04,polygonOffset:!0,polygonOffsetFactor:-1}),{uniforms:t,key:"butterfilm",vertexPars:"varying vec3 vP;",vertexMain:"vP = position;",fragmentPars:"varying vec3 vP; uniform float uMelt, uHot, uTime; uniform sampler2D tNoise; uniform vec2 uCentre;",replace:{"#include <map_fragment>":`
        float n = texture2D(tNoise, vP.xz * 5.0).r, n2 = texture2D(tNoise, vP.xz * 30.0 + vec2(uTime * 0.02, 0.0)).g, n3 = texture2D(tNoise, vP.xz * 70.0 - vec2(0.0, uTime * 0.03)).b;
        float d = length(vP.xz - uCentre) / ${(Oe.rb-.006).toFixed(4)};
        float reach = uMelt * 1.9 * (0.75 + 0.5 * n);
        float inside = 1.0 - smoothstep(reach - 0.10, reach, d);
        float ring = smoothstep(reach - 0.34, reach - 0.03, d);                       // froth gathers along the edge of the pool
        float foam = inside * uHot * (0.25 + 0.75 * ring) * smoothstep(0.66, 0.84, n3 * 0.75 + n2 * 0.45);
        diffuseColor.rgb = mix(vec3(1.0, 0.84, 0.42), vec3(1.0, 0.98, 0.90), foam);
        diffuseColor.a = inside * mix(0.075, 0.62, foam);`,"#include <opaque_fragment>":`diffuseColor.a = clamp(diffuseColor.a + dot(totalSpecular, vec3(0.3)) * step(0.01, diffuseColor.a), 0.0, 1.0);
        #include <opaque_fragment>`}}),n=new it(i,e);return n.renderOrder=1,n.receiveShadow=!0,n.userData.uni=t,n}var Ao=[[-.03,.012],[.038,-.03],[.03,.046]];function bf(i){let t={eggs:[],pan:null,melt:0,pat:null,butter:!1,lidOn:!1,fog:0,onBurner:!1,sizzle:0,doneT:0,steamAcc:0},e=t.holder=new Lt;e.position.y=Oe.floorY+4e-4,t.film=Sf(),t.film.visible=!1,e.add(t.film);let n=150,s=new ne(1,10,6,0,Math.PI*2,0,Math.PI/2),r=new Ge({color:16776693,roughness:.08,transparent:!0,opacity:.62,clearcoat:1,clearcoatRoughness:.05,depthWrite:!1});t.bubbles=new qr(s,r,n),t.bubbles.count=0,t.bubbles.renderOrder=6,t.bubbles.frustumCulled=!1,e.add(t.bubbles);let o=[],a=new nn,l=new U;return t.attach=c=>{t.pan=c,c?c.add(e):e.parent&&e.parent.remove(e)},t.reset=()=>{for(let c of t.eggs)c.group.parent&&c.group.parent.remove(c.group),c.geo.dispose();t.eggs=[],t.melt=0,t.patCover=!1,t.butter=!1,t.lidOn=!1,t.fog=0,t.film.visible=!1,t.film.userData.uni.uMelt.value=0,o.length=0,t.bubbles.count=0,t.doneT=0,t.pat&&(t.pat.parent&&t.pat.parent.remove(t.pat),t.pat=null)},t.addButter=(c=!1)=>{t.butter=!0,t.film.visible=!0,t.pat||(t.pat=Rh(),e.add(t.pat)),t.pat.position.set(-.012,0,.02),t.pat.rotation.y=.4,t.pat.scale.set(1,1,1),t.pat.visible=!c,t.film.userData.uni.uCentre.value.set(-.012,.02),t.melt=c?1:0},t.addEgg=({seed:c,twin:u},h="raw")=>{let p=t.eggs.length,d=new Gl({seed:c,twin:u,slot:Ao[p]});return d.group.position.set(Ao[p][0],5e-4+p*4e-4,Ao[p][1]),e.add(d.group),t.eggs.push(d),h==="raw"&&t.pat&&t.pat.visible&&(t.patCover=!0),h!=="raw"&&(d.setSpread(1),d.cook=h==="cooked"?1.2:0),d},t.allDone=()=>t.eggs.length>0&&t.eggs.every(c=>c.cook>=1.06),t.progress=()=>t.eggs.length?Math.min(...t.eggs.map(c=>c.cook))/1.06:0,t.update=(c,u)=>{let h=i.stove.main,p=t.onBurner?h.thermal:Math.max(0,t.residual=(t.residual||0)-c*.2);t.onBurner&&(t.residual=h.thermal);let d=t.film.userData.uni;if(d.uTime.value=u,t.butter){if(t.melt<1&&p>.04&&(t.melt=Math.min(1,t.melt+c*(.12+.5*p))),t.patCover&&t.pat&&t.pat.visible&&(t.melt=Math.min(1,Math.max(t.melt,.35)+c*.9)),t.pat&&t.pat.visible){let f=Dt(t.melt*1.6);t.pat.scale.set(1+.5*f,Math.max(.02,1-f),1+.5*f),t.pat.position.x=-.012+.01*f*Math.sin(u*1.3),f>=1&&(t.pat.visible=!1)}d.uMelt.value=t.melt*(.55+.45*Dt(t.melt)),d.uHot.value+=(Dt(p*1.6)-d.uHot.value)*Math.min(1,c*2)}let g=0;for(let f of t.eggs)f.spread>=.5&&p>.03&&f.cook<1.2&&(f.cook=Math.min(1.2,f.cook+c*((.3+.7*p)/11)*Dt(p/.1))),f.cook>.3&&(f.crisp=Math.min(1,Math.max(f.crisp,.14*Dt(f.cook))+Math.max(0,p-.48)*c/4.5)),t.lidOn&&p>.15&&(f.film=Math.min(1,f.film+c/7)),f.spread>0&&g++,f.update(c,u,p*(t.lidOn?.6:1));let v=g>0?1:t.butter&&t.melt>.1?.45:0;if(t.sizzle+=(p*v-t.sizzle)*Math.min(1,c*4),i.audio&&(i.audio.setSizzle(t.sizzle,t.lidOn?1:0),t.sizzle>.1&&Math.random()<c*(2+14*t.sizzle)&&i.audio.pop(.5+t.sizzle)),t.pan){let f=p*(g*9+(t.butter?5*t.melt:0));if(Math.random()<f*c&&o.length<n)if(g>0&&Math.random()<.8){let y=t.eggs[Math.floor(Math.random()*t.eggs.length)];if(y.spread>.6){let w=Math.random()*6.28,T=Math.random()<.6,M=y.outline(w),E=T?.86+Math.random()*.16:.35+Math.random()*.5,N=!T&&p>.6&&Math.random()<.14;o.push({x:y.group.position.x+Math.cos(w)*M*E,z:y.group.position.z+Math.sin(w)*M*E,y:T?5e-4:.0024,s:N?.003+Math.random()*.0028:6e-4+Math.random()*.0012,t:0,life:N?.9+Math.random()*.8:.35+Math.random()*.7})}}else{let y=Math.random()*6.28,w=Math.sqrt(Math.random())*(Oe.rb-.012)*Dt(t.melt*1.4);o.push({x:-.012+Math.cos(y)*w,z:.02+Math.sin(y)*w,y:3e-4,s:7e-4+Math.random()*.0015,t:0,life:.3+Math.random()*.6})}let x=0;for(let _=0;_<o.length;_++){let y=o[_];if(y.t+=c,y.t>y.life)continue;let w=y.t/y.life,T=y.s*Math.min(1,w*5)*(w>.9?1+(w-.9)*3:1);Math.hypot(y.x,y.z)>Oe.rb-.004||(a.position.set(y.x,y.y,y.z),a.scale.set(T,T*.8,T),a.updateMatrix(),t.bubbles.setMatrixAt(x,a.matrix),o[x++]=y)}for(o.length=x,t.bubbles.count=x,t.bubbles.instanceMatrix.needsUpdate=!0,e.getWorldPosition(l),t.steamAcc+=c*p*(g*2.2+.4)*(t.lidOn?.25:1);t.steamAcc>1;){t.steamAcc-=1;let _=Math.random()*6.28,y=Math.random()*.07;i.fx.puff(new U(l.x+Math.cos(_)*y,l.y+(t.lidOn?.045:.012),l.z+Math.sin(_)*y),.8+p*.9)}if(!t.lidOn&&p>.55&&g>0&&Math.random()<c*9*(p-.5)){let _=Math.random()*6.28,y=Math.random()*.08;i.fx.spit(new U(l.x+Math.cos(_)*y,l.y+.004,l.z+Math.sin(_)*y),p)}}let m=t.lidOn?Dt(p*1.5+(g?.25:0))*(g||t.butter?1:.3):0;t.fog+=(m-t.fog)*Math.min(1,c*(m>t.fog?.7:2.5))},t}function wf(){let i=null,t=null,e=null,n=null,s=!1,r=!1,o={},a={started:!1,muted:!1,events:[]},l=f=>{a.events.push(f),a.events.length>400&&a.events.shift()};a.start=()=>{if(a.started){i&&i.state==="suspended"&&i.resume().catch(()=>{});return}a.started=!0;try{let f=window.AudioContext||window.webkitAudioContext;if(!f)return;i=new f,t=i.createGain(),t.gain.value=r?0:.55,e=i.createDynamicsCompressor(),e.threshold.value=-16,e.knee.value=18,e.ratio.value=5,e.attack.value=.004,e.release.value=.2,t.connect(e),e.connect(i.destination);let x=i.sampleRate*2;n=i.createBuffer(1,x,i.sampleRate);let _=n.getChannelData(0);for(let y=0;y<x;y++)_[y]=Math.random()*2-1;s=!0,i.state==="suspended"&&i.resume().catch(()=>{}),h("gas",{type:"bandpass",f:3800,q:.7}),h("gasLow",{type:"lowpass",f:260,q:.5}),h("sizzle",{type:"bandpass",f:6200,q:.9}),h("sizzleLow",{type:"bandpass",f:2300,q:1.2}),h("water",{type:"bandpass",f:2600,q:.5}),h("cloth",{type:"bandpass",f:1900,q:.8}),h("scrub",{type:"bandpass",f:3200,q:1.4}),h("room",{type:"lowpass",f:180,q:.3}),p("room",.012)}catch{s=!1}},a.setMuted=f=>{r=a.muted=f,s&&t.gain.setTargetAtTime(f?0:.55,i.currentTime,.05)};let c=f=>(...x)=>{if(s)try{f(...x)}catch{}},u=()=>i.currentTime;function h(f,x){let _=i.createBufferSource();_.buffer=n,_.loop=!0,_.playbackRate.value=.8+Math.random()*.4;let y=i.createBiquadFilter();y.type=x.type,y.frequency.value=x.f,y.Q.value=x.q;let w=i.createGain();w.gain.value=0,_.connect(y),y.connect(w),w.connect(t),_.start(),o[f]={src:_,f:y,g:w}}function p(f,x,_){let y=o[f];y&&(y.g.gain.setTargetAtTime(Math.max(0,x),u(),.06),_&&y.f.frequency.setTargetAtTime(_,u(),.08))}function d({f=440,f2:x,t:_=.2,type:y="sine",g:w=.2,a:T=.004,at:M=0,vib:E=0,vibF:N=6,curve:C="exp"}){let L=u()+M,b=i.createOscillator();b.type=y,b.frequency.setValueAtTime(f,L),x&&(C==="exp"?b.frequency.exponentialRampToValueAtTime(Math.max(1,x),L+_):b.frequency.linearRampToValueAtTime(x,L+_));let R=i.createGain();if(R.gain.setValueAtTime(0,L),R.gain.linearRampToValueAtTime(w,L+T),R.gain.exponentialRampToValueAtTime(1e-4,L+_),E){let S=i.createOscillator();S.frequency.value=N;let P=i.createGain();P.gain.value=E,S.connect(P),P.connect(b.frequency),S.start(L),S.stop(L+_+.05)}return b.connect(R),R.connect(t),b.start(L),b.stop(L+_+.05),{o:b,gn:R}}function g({t:f=.1,g:x=.2,a:_=.002,type:y="bandpass",f:w=2e3,f2:T,q:M=1,at:E=0}){let N=u()+E,C=i.createBufferSource();C.buffer=n,C.loop=!0,C.loopStart=Math.random();let L=i.createBiquadFilter();L.type=y,L.frequency.setValueAtTime(w,N),T&&L.frequency.exponentialRampToValueAtTime(T,N+f),L.Q.value=M;let b=i.createGain();b.gain.setValueAtTime(0,N),b.gain.linearRampToValueAtTime(x,N+_),b.gain.exponentialRampToValueAtTime(1e-4,N+f),C.connect(L),L.connect(b),b.connect(t),C.start(N,Math.random()*1.5),C.stop(N+f+.05)}let v=(f,x,_,y=0)=>f.forEach((w,T)=>d({f:w*(1+(Math.random()-.5)*.01),t:x*(1-T*.12),g:_/(1+T*.7),at:y})),m=(f,x)=>{a[f]=(..._)=>{l(f),c(x)(..._)}};return m("knobClick",(f=1,x=0)=>{g({t:.018,g:.16*f,f:3400+x*900,q:2.5}),d({f:1750+Math.random()*250,t:.03,g:.05*f,type:"triangle"}),d({f:190,f2:120,t:.04,g:.07*f})}),m("spark",()=>{g({t:.012,g:.22,f:6500,q:1.2,type:"highpass"}),d({f:4200,t:.012,g:.04,type:"square"})}),m("ignite",()=>{g({t:.38,g:.2,f:240,f2:900,q:.6,a:.05,type:"lowpass"}),d({f:105,f2:62,t:.3,g:.14,a:.03})}),m("puff",()=>{g({t:.28,g:.16,f:1500,f2:240,q:.6,a:.01,type:"lowpass"}),d({f:160,f2:90,t:.12,g:.06})}),a.setGas=c(f=>{p("gas",f>.002?.012+.05*f:0,3e3+2200*f),p("gasLow",f>.002?.03+.1*f:0,200+160*f)}),a.setSizzle=c((f,x=0)=>{let _=1-.6*x;p("sizzle",f*.11*_*(.8+.2*Math.random()),(5200+2600*f)*(1-.5*x)),p("sizzleLow",f*.06*_,1800+1300*f)}),m("pop",(f=1)=>{g({t:.02+Math.random()*.02,g:.07*f,f:2500+Math.random()*5e3,q:3})}),m("clack",(f=1)=>{g({t:.03,g:.25*f,f:2500,q:.8}),v([640,1130,1790,2680,3900],.5,.11*f),d({f:120,f2:70,t:.09,g:.16*f})}),m("clink",(f=1)=>{g({t:.012,g:.12*f,f:5e3,q:1}),v([1730,2890,4370,6200],.45,.085*f)}),m("thud",(f=1)=>{d({f:110,f2:55,t:.14,g:.22*f}),g({t:.05,g:.1*f,f:400,type:"lowpass"})}),m("tap",(f=1)=>{d({f:880,f2:520,t:.045,g:.16*f,type:"triangle"}),g({t:.014,g:.12*f,f:3e3,q:1.5}),v([1900,2700],.12,.02*f)}),m("crack",()=>{for(let f=0;f<6;f++)g({t:.012+Math.random()*.02,g:.2-f*.02,f:2600+Math.random()*4500,q:2.5,at:f*.012+Math.random()*.01});d({f:700,f2:300,t:.05,g:.1,type:"triangle"})}),m("shellOpen",()=>{for(let f=0;f<4;f++)g({t:.03,g:.09,f:3500+Math.random()*3e3,q:2,at:f*.035});g({t:.25,g:.05,f:900,f2:400,q:1.2,a:.05,type:"lowpass"})}),m("plop",(f=0)=>{d({f:330,f2:110,t:.12,g:.16}),d({f:520,f2:240,t:.07,g:.05,at:.03}),f>.1&&g({t:.5,g:.16*f,f:5200,q:.7,a:.01})}),m("soft",(f=1)=>{d({f:240,f2:160,t:.06,g:.1*f}),g({t:.03,g:.04*f,f:800,type:"lowpass"})}),m("drawer",(f=1)=>{g({t:.45,g:.1,f:f>0?260:420,f2:f>0?520:240,q:1.2,a:.06,type:"bandpass"}),d({f:95,f2:60,t:.12,g:.18,at:.42}),g({t:.04,g:.1,f:1800,q:1,at:.42})}),m("rattle",()=>{for(let f=0;f<3;f++)v([900+Math.random()*500,2100+Math.random()*900],.2,.03,f*.05+Math.random()*.03)}),a.setCloth=c(f=>p("cloth",Math.min(.09,f*.09),1500+f*900)),m("ringTick",()=>{v([3100+Math.random()*900,5200],.06,.03)}),m("swish",(f=1)=>{g({t:.22,g:.08*f,f:900,f2:2800,q:.8,a:.06})}),m("lever",()=>{g({t:.03,g:.2,f:1500,q:1}),d({f:150,f2:80,t:.1,g:.2}),v([520,1340],.3,.05,.02)}),m("tick",()=>{g({t:.008,g:.05,f:4200,q:4})}),m("toastPop",()=>{g({t:.04,g:.26,f:1200,q:.8}),d({f:190,f2:380,t:.08,g:.16,type:"triangle"}),v([2093,4186,6270],1.2,.09,.05)}),a.setWater=c(f=>{p("water",f*.12,2200+900*f)}),a.setScrub=c(f=>p("scrub",Math.min(.08,f*.08),2600+f*1500)),m("squeak",()=>{d({f:1100+Math.random()*300,f2:1900+Math.random()*300,t:.12,g:.045,type:"sine",vib:25,vibF:40,curve:"lin"})}),m("bubble",()=>{let f=500+Math.random()*900;d({f,f2:f*1.9,t:.06,g:.05})}),m("drip",()=>{d({f:900,f2:1700,t:.05,g:.06})}),m("sparkle",(f=1)=>{[1568,2093,2637,3136].forEach((x,_)=>d({f:x,t:.5,g:.045*f,at:_*.07}))}),m("chime",(f=0)=>{let x=[523.25,659.25,783.99,1046.5,1318.5];d({f:x[f%x.length],t:.7,g:.07}),d({f:x[f%x.length]*2,t:.4,g:.02})}),m("jingle",()=>{[783.99,1046.5,1318.5,1046.5,1568].forEach((x,_)=>{d({f:x,t:.9,g:.07,at:_*.17}),d({f:x*2,t:.5,g:.018,at:_*.17})})}),m("shutter",()=>{g({t:.03,g:.2,f:3e3,q:.8}),g({t:.05,g:.16,f:1800,q:.8,at:.09}),d({f:300,f2:150,t:.05,g:.08,at:.09})}),m("paper",()=>{g({t:.3,g:.07,f:2500,f2:5e3,q:.7,a:.08})}),m("magnet",()=>{d({f:420,f2:210,t:.06,g:.2}),g({t:.015,g:.12,f:2400,q:1.5})}),m("birds",()=>{for(let f=0;f<7;f++){let x=f*.16+Math.random()*.08,_=3e3+Math.random()*1600;d({f:_,f2:_*(1.2+Math.random()*.3),t:.07,g:.022,at:x}),d({f:_*1.1,f2:_*.85,t:.06,g:.018,at:x+.075})}}),m("rooster",()=>{let f=[[620,700,.11,0],[760,820,.11,.14],[700,760,.1,.28],[900,620,.5,.42]];for(let[x,_,y,w]of f)d({f:x,f2:_,t:y,g:.05,type:"sawtooth",at:w,vib:14,vibF:22,curve:"lin"}),d({f:x*2,f2:_*2,t:y,g:.015,type:"square",at:w,curve:"lin"})}),m("yawn",()=>{d({f:190,f2:330,t:.5,g:.07,type:"triangle",a:.12,curve:"lin"}),d({f:330,f2:150,t:.9,g:.07,type:"triangle",a:.05,at:.45,vib:5,vibF:5,curve:"lin"}),g({t:1.2,g:.02,f:900,q:.6,a:.4})}),m("snore",()=>{g({t:.7,g:.035,f:240,f2:140,q:2.5,a:.3,type:"bandpass"}),d({f:82,t:.6,g:.03,type:"sawtooth",a:.25,vib:6,vibF:24})}),m("gasp",()=>{d({f:280,f2:620,t:.16,g:.08,type:"triangle",curve:"lin"})}),m("boing",()=>{d({f:180,f2:520,t:.5,g:.12,type:"sine",vib:60,vibF:13,curve:"lin"}),d({f:360,f2:1040,t:.35,g:.03,type:"triangle",vib:80,vibF:13,curve:"lin"})}),m("pat",()=>{d({f:200,f2:120,t:.07,g:.14}),g({t:.04,g:.06,f:700,type:"lowpass"})}),m("munch",()=>{for(let f=0;f<3;f++)g({t:.06,g:.09,f:700+Math.random()*600,q:1.4,at:f*.17,type:"bandpass"})}),m("crunch",()=>{for(let f=0;f<5;f++)g({t:.025,g:.12,f:2200+Math.random()*3e3,q:2,at:f*.03+Math.random()*.02})}),m("mmm",()=>{d({f:200,f2:300,t:.6,g:.08,type:"triangle",a:.08,vib:4,vibF:5.5,curve:"lin"}),d({f:400,f2:600,t:.6,g:.015,type:"sine",a:.08,curve:"lin"})}),m("hum",(f=0)=>{d({f:330+f*60,t:.16,g:.06,type:"triangle",a:.03}),d({f:415+f*80,t:.28,g:.06,type:"triangle",a:.03,at:.17})}),m("clap",()=>{for(let f=0;f<4;f++)g({t:.05,g:.12,f:1300+Math.random()*500,q:.9,at:f*.19})}),m("sniff",()=>{g({t:.16,g:.05,f:2600,f2:3800,q:2,a:.05}),g({t:.16,g:.05,f:2600,f2:3800,q:2,a:.05,at:.24})}),m("whee",()=>{d({f:300,f2:760,t:.35,g:.07,type:"triangle",curve:"lin",vib:8})}),m("step",()=>{d({f:90,f2:55,t:.09,g:.12}),g({t:.09,g:.03,f:1200,q:.6,a:.02})}),a}function Ef(i){let t=i.canvas,e={items:[],down:!1,pid:null,active:null,x:0,y:0,onAny:null,lastDownT:0,taps:0},n=new uo,s=new ot,r=new U;e.ray=n,e.add=u=>(u.magnet=u.magnet??56,u.priority=u.priority??0,e.items.push(u),u),e.remove=u=>{let h=e.items.indexOf(u);h>=0&&e.items.splice(h,1),e.active===u&&(e.active=null)},e.clear=u=>{e.items=e.items.filter(h=>u&&h.group!==u),e.active=null},e.setRay=(u,h)=>(s.set(u/window.innerWidth*2-1,-(h/window.innerHeight)*2+1),n.setFromCamera(s,i.camera),n),e.onPlaneY=(u,h=new U)=>{let p=n.ray,d=(u-p.origin.y)/p.direction.y;return d>0?h.copy(p.origin).addScaledVector(p.direction,d):null},e.onPlaneZ=(u,h=new U)=>{let p=n.ray,d=(u-p.origin.z)/p.direction.z;return d>0?h.copy(p.origin).addScaledVector(p.direction,d):null},e.onPlaneX=(u,h=new U)=>{let p=n.ray,d=(u-p.origin.x)/p.direction.x;return d>0?h.copy(p.origin).addScaledVector(p.direction,d):null},e.screenOf=u=>(r.copy(u).project(i.camera),{x:(r.x*.5+.5)*window.innerWidth,y:(-r.y*.5+.5)*window.innerHeight,behind:r.z>1});let o=u=>u.center?u.center():(Array.isArray(u.obj)?u.obj[0]:u.obj).getWorldPosition(new U);e.centerOf=o;function a(u,h){e.setRay(u,h);let p=null,d=1/0;for(let m of e.items){if(m.enabled&&!m.enabled()||!m.obj)continue;let f=Array.isArray(m.obj)?m.obj:[m.obj],x=n.intersectObjects(f,!0);if(x.length){let _=x[0].distance-m.priority*10;_<d&&(d=_,p=m,p._hit=x[0])}}if(p)return p;let g=Math.min(window.innerWidth,window.innerHeight)/800,v=1/0;for(let m of e.items){if(m.enabled&&!m.enabled()||m.magnet<=0)continue;let f=o(m);if(!f)continue;let x=e.screenOf(f);if(x.behind)continue;let _=Math.hypot(x.x-u,x.y-h)-m.priority*30;_<m.magnet*g&&_<v&&(v=_,p=m,p._hit=null)}return p}e.pick=a;let l=(u,h)=>Object.assign({x:u.clientX,y:u.clientY,sx:e.sx,sy:e.sy,dx:u.clientX-e.x,dy:u.clientY-e.y,moved:e.moved,dur:(performance.now()-e.t0)/1e3,ray:n,hit:e.active&&e.active._hit},h);t.addEventListener("pointerdown",u=>{if(!e.down&&!(u.pointerType==="mouse"&&u.button!==0)){e.down=!0,e.pid=u.pointerId,e.x=e.sx=u.clientX,e.y=e.sy=u.clientY,e.moved=0,e.t0=performance.now(),e.taps++;try{t.setPointerCapture(u.pointerId)}catch{}if(e.onAny&&e.onAny(u),e.locked){e.active=null;return}e.active=a(u.clientX,u.clientY),i.fx&&i.fx.hint.poke(),e.active&&e.active.onDown&&e.active.onDown(l(u)),u.preventDefault()}}),t.addEventListener("pointermove",u=>{if(!e.down||u.pointerId!==e.pid){e.down||(e.hx=u.clientX,e.hy=u.clientY);return}e.setRay(u.clientX,u.clientY);let h=Math.hypot(u.clientX-e.x,u.clientY-e.y);e.moved+=h,e.active&&e.active.onMove&&e.active.onMove(l(u)),e.x=u.clientX,e.y=u.clientY});let c=u=>{if(!e.down||u.pointerId!==e.pid)return;e.down=!1,e.setRay(u.clientX,u.clientY);let h=e.active;if(e.active=null,h){let p=Math.min(window.innerWidth,window.innerHeight)/800,d=e.moved<16*p;h.onUp&&h.onUp(l(u,{tap:d})),d&&h.onTap&&h.onTap(l(u,{tap:d}))}try{t.releasePointerCapture(u.pointerId)}catch{}};t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c),t.addEventListener("contextmenu",u=>u.preventDefault());for(let u of["gesturestart","gesturechange","dblclick"])document.addEventListener(u,h=>h.preventDefault(),{passive:!1});return document.addEventListener("touchmove",u=>u.preventDefault(),{passive:!1}),window.addEventListener("wheel",u=>{u.ctrlKey&&u.preventDefault()},{passive:!1}),e}var _r=class{constructor(t,{max:e=64,map:n,additive:s=!1,order:r=10,depthTest:o=!0}){this.max=e,this.n=0;let a=new ho;a.setAttribute("position",new Xt([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),a.setAttribute("uv",new Xt([0,0,1,0,1,1,0,1],2)),a.setIndex([0,1,2,0,2,3]),this.off=new Ai(new Float32Array(e*3),3),this.par=new Ai(new Float32Array(e*3),3),this.col=new Ai(new Float32Array(e*3),3);for(let l of[this.off,this.par,this.col])l.setUsage(Qc);a.setAttribute("aOff",this.off),a.setAttribute("aPar",this.par),a.setAttribute("aCol",this.col),a.instanceCount=0,this.mat=new gn({uniforms:{tMap:{value:n}},transparent:!0,depthWrite:!1,depthTest:o,blending:s?ei:$i,vertexShader:`attribute vec3 aOff; attribute vec3 aPar; attribute vec3 aCol; varying vec2 vUv; varying float vA; varying vec3 vC;
        void main(){ vUv = uv; vA = aPar.y; vC = aCol; float c = cos(aPar.z), s = sin(aPar.z); vec2 q = vec2(position.x * c - position.y * s, position.x * s + position.y * c) * aPar.x;
          vec4 mv = viewMatrix * vec4(aOff, 1.0); mv.xy += q; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform sampler2D tMap; varying vec2 vUv; varying float vA; varying vec3 vC;
        void main(){ vec4 t = texture2D(tMap, vUv); gl_FragColor = vec4(vC * t.rgb, t.a * vA); ${s?"gl_FragColor.rgb *= gl_FragColor.a;":""} }`}),this.mesh=new it(a,this.mat),this.mesh.frustumCulled=!1,this.mesh.renderOrder=r,t.add(this.mesh),this.items=[]}spawn(t){return this.items.length>=this.max&&this.items.shift(),t.t=0,t.rot=t.rot??Math.random()*6.28,t.spin=t.spin??0,t.grow=t.grow??0,t.r=t.r??1,t.g=t.g??1,t.b=t.b??1,t.drag=t.drag??0,t.fadeIn=t.fadeIn??.15,t.gy=t.gy??0,this.items.push(t),t}update(t){let e=this.items,n=0;for(let s=0;s<e.length;s++){let r=e[s];if(r.t+=t,r.t>=r.life)continue;r.vy+=r.gy*t;let o=Math.max(0,1-r.drag*t);r.vx*=o,r.vy*=o,r.vz*=o,r.x+=r.vx*t,r.y+=r.vy*t,r.z+=r.vz*t,r.rot+=r.spin*t;let a=r.t/r.life,l=r.alpha*Math.min(1,a/r.fadeIn)*(1-a)*(r.flick?.6+.4*Math.sin(r.t*r.flick):1);this.off.setXYZ(n,r.x,r.y,r.z),this.par.setXYZ(n,r.size+r.grow*r.t,l,r.rot),this.col.setXYZ(n,r.r,r.g,r.b),e[n++]=r}e.length=n,this.mesh.geometry.instanceCount=n,this.off.needsUpdate=this.par.needsUpdate=this.col.needsUpdate=!0}};function Tf(i){let t=i.scene,e={};e.steam=new _r(t,{max:90,map:Zd(),order:12}),e.stars=new _r(t,{max:80,map:gr(),additive:!0,order:14,depthTest:!1}),e.dots=new _r(t,{max:260,map:Rs(),additive:!0,order:13}),e.puff=(d,g=1,v=.03)=>e.steam.spawn({x:d.x+(Math.random()-.5)*v*2,y:d.y,z:d.z+(Math.random()-.5)*v*2,vx:(Math.random()-.5)*.02+.012,vy:.1+Math.random()*.08,vz:(Math.random()-.5)*.02,size:.035*g,grow:.07*g,life:1.6+Math.random()*1.2,alpha:.13*Math.min(1.5,g),spin:(Math.random()-.5)*.6,drag:.5}),e.sparkles=(d,g=10,v=1,m=[1,.93,.6])=>{for(let f=0;f<g;f++){let x=Math.random()*6.28,_=(Math.random()-.3)*1.6,y=(.1+Math.random()*.22)*v;e.stars.spawn({x:d.x,y:d.y,z:d.z,vx:Math.cos(x)*Math.cos(_)*y,vy:Math.sin(_)*y+.1*v,vz:Math.sin(x)*Math.cos(_)*y,size:(.018+Math.random()*.03)*v,life:.7+Math.random()*.7,alpha:1,spin:(Math.random()-.5)*4,drag:2.2,gy:-.12,r:m[0],g:m[1],b:m[2],flick:14+Math.random()*10,fadeIn:.05})}},e.spit=(d,g=1)=>{let v=Math.random()*6.28,m=.15+Math.random()*.25;e.dots.spawn({x:d.x,y:d.y,z:d.z,vx:Math.cos(v)*m*.4,vy:.35+Math.random()*.5*g,vz:Math.sin(v)*m*.4,size:.004+Math.random()*.004,life:.35+Math.random()*.25,alpha:.9,gy:-4.5,r:1,g:.93,b:.7,fadeIn:.02})};let n=ns("shaft",256,(d,g)=>{let v=d.createLinearGradient(0,0,g,0);v.addColorStop(0,"rgba(255,255,255,0.0)"),v.addColorStop(.06,"rgba(255,255,255,0.9)"),v.addColorStop(.5,"rgba(255,255,255,0.45)"),v.addColorStop(1,"rgba(255,255,255,0)"),d.fillStyle=v,d.fillRect(0,0,g,g),d.globalCompositeOperation="destination-in";let m=d.createLinearGradient(0,0,0,g),f=we(9);m.addColorStop(0,"rgba(0,0,0,0)");for(let x=1;x<10;x++)m.addColorStop(x/10,`rgba(0,0,0,${.25+f()*.75})`);m.addColorStop(1,"rgba(0,0,0,0)"),d.fillStyle=m,d.fillRect(0,0,g,g)});e.shafts=[];let s=3.3,r=q.sunDir;for(let d=0;d<9;d++){let g=Ot(q.winZ0+.1,q.winZ1-.1,d/8),v=new Ce,m=q.roomX0+.02,f=q.winY0,x=q.winY1;v.setAttribute("position",new Xt([m,f,g,m+r.x*s,f+r.y*s,g+r.z*s,m+r.x*s,x+r.y*s,g+r.z*s,m,x,g],3)),v.setAttribute("uv",new Xt([0,0,1,0,1,1,0,1],2)),v.setIndex([0,1,2,0,2,3]);let _=new it(v,new Me({map:n,color:new Bt(1,.86,.62),transparent:!0,opacity:0,blending:ei,depthWrite:!1,side:xe}));_.renderOrder=9,_.frustumCulled=!1,t.add(_),e.shafts.push({m:_,z:g,k:.6+.4*(d*.618%1)})}let o=we(77);e.dust=[];for(let d=0;d<110;d++)e.dust.push({a:o(),b:o(),c:o(),ph:o()*6.28,sp:.3+o()*.7});e.dustBoard=new _r(t,{max:120,map:Rs(),additive:!0,order:13}),e.shaftGain=1,e.updateSun=d=>{let g=i.room.curtains,v=(q.winZ0+q.winZ1)/2;for(let x of e.shafts){let _=x.z<v?g[0]:g[1],y=_.anchorZ-_.side*_.width(_.open),w=_.side<0?Dt((x.z-y)/.12):Dt((y-x.z)/.12);x.m.material.opacity=.085*w*x.k*e.shaftGain*(.9+.1*Math.sin(d*.6+x.z*9))}let m=e.dustBoard.items;m.length=0;let f=i.daylight;if(f>.02)for(let x of e.dust){let _=(x.a+d*.004*x.sp)%1,y=.15+.75*x.b,w=Ot(q.winZ0+.15,q.winZ1-.15,x.c),T=.25+_*2.6,M=Ot(q.winY0+.1,q.winY1-.1,y)-.08*Math.sin(d*.15*x.sp+x.ph),E=q.roomX0+r.x*T+.05*Math.sin(d*.21+x.ph),N=M+r.y*T+.04*Math.sin(d*.33*x.sp+x.ph*2),C=w+r.z*T+.05*Math.cos(d*.17+x.ph),L=w<v?g[0]:g[1],b=.5+.5*Math.sin(d*(1.3+x.sp)+x.ph*5);m.push({x:E,y:N,z:C,vx:0,vy:0,vz:0,size:.006+.006*x.b,grow:0,life:1,t:.5,alpha:1.7*f*Dt(L.open*1.5)*b*b,rot:0,spin:0,r:1,g:.9,b:.7,drag:0,fadeIn:.001,gy:0})}e.dustBoard.update(0)};let a=new Ri(new di({map:ns("hintglow",128,(d,g)=>{let v=d.createRadialGradient(g/2,g/2,g*.12,g/2,g/2,g/2);v.addColorStop(0,"rgba(255,244,200,0.0)"),v.addColorStop(.45,"rgba(255,238,170,0.75)"),v.addColorStop(.7,"rgba(255,225,140,0.25)"),v.addColorStop(1,"rgba(255,220,120,0)"),d.fillStyle=v,d.fillRect(0,0,g,g)}),transparent:!0,opacity:0,depthTest:!1,depthWrite:!1,blending:ei}));a.renderOrder=30,t.add(a);let l=document.createElement("div");l.id="hand",l.style.cssText="position:fixed;left:0;top:0;width:84px;height:84px;margin:-10px 0 0 -30px;pointer-events:none;opacity:0;z-index:3;will-change:transform,opacity;filter:drop-shadow(0 3px 5px rgba(60,40,20,.35));",l.innerHTML='<svg viewBox="0 0 64 64" width="84" height="84"><path d="M24 6c-3 0-5 2.200-5 5v22l-3.500-3.800c-2-2.100-5.200-2.200-7.200-.2-1.900 1.900-2 4.900-.3 7l10.500 13.800C21.500 54.500 26.500 58 33 58h6c8.800 0 15-6.600 15-15V29.500c0-2.800-2.100-5-4.800-5-1 0-2 .3-2.700.9-.6-2.200-2.500-3.800-4.800-3.800-1.200 0-2.300.4-3.200 1.200-.8-1.900-2.600-3.200-4.700-3.200-1 0-1.900.3-2.800.8V11c0-2.800-2.200-5-5-5z" fill="rgba(255,253,246,.93)" stroke="rgba(120,90,60,.7)" stroke-width="2" stroke-linejoin="round"/></svg>',document.body.appendChild(l);let c=e.hint={cur:null,idle:0,handT:-1,cycle:0,glowDelay:3.5,handDelay:7,enabled:!0,shown:0},u=new U,h=new U;c.set=d=>{c.cur=d,c.idle=0,c.handT=-1,c.cycle=0},c.clear=()=>{c.cur=null,c.handT=-1},c.poke=()=>{c.idle=0,c.handT=-1};let p=(d,g)=>(g.copy(d).project(i.camera),[(g.x*.5+.5)*window.innerWidth,(-g.y*.5+.5)*window.innerHeight]);return c.update=(d,g)=>{let v=c.cur,m=0,f=0;if(v&&c.enabled&&!i.input.down){c.idle+=d/(i.timeScale||1)*Math.min(i.timeScale,1)+0*g;let x=v.at();if(x){if(c.idle>(v.glowDelay??c.glowDelay)){m=Dt((c.idle-(v.glowDelay??c.glowDelay))*1.5)*(.55+.25*Math.sin(g*4)),a.position.copy(x);let y=i.camera.position.distanceTo(x);a.scale.setScalar((v.size??.13)*(1+.08*Math.sin(g*4))*Math.max(.6,y/.8))}let _=v.handDelay??c.handDelay;if(c.idle>_){c.handT<0&&(c.handT=0,c.shown++),c.handT+=d;let y=v.to?2.2:1.5,w=c.handT/y;if(w>=1)c.handT=-1,c.idle=_-(v.repeat??6);else{let T=p(x,u),M=T[0],E=T[1],N=0;if(v.to){let C=v.to(),L=p(C,h),b=jt.inOut(Dt((w-.25)/.5));M=Ot(T[0],L[0],b),E=Ot(T[1],L[1],b),N=w>.15&&w<.85?1:0}else N=w>.3&&w<.5||w>.62&&w<.8&&v.double?1:0;f=Math.min(1,w*6,(1-w)*6)*.95,l.style.transform=`translate(${M.toFixed(1)}px,${(E+(N?0:-14)).toFixed(1)}px) scale(${N?.9:1})`}}}}a.material.opacity+=(m-a.material.opacity)*Math.min(1,d*6),l.style.opacity=f.toFixed(2),c.glowOn=a.material.opacity>.05,c.handOn=f>.05},e.update=(d,g)=>{e.steam.update(d),e.stars.update(d),e.dots.update(d),e.updateSun(g),c.update(d,g)},e}function Rf(i){let t=i.world,e=i.x,n=i.stove,s=i.cook,r=i.audio,o=i.input,a=i.fx,l=t.papa,c=t.mama,u={},h=(_,y,w)=>new U(_,y,w),p=()=>{i.save.data.meal=i.meal,i.save.write()},d=0,g=!1;e.glanceAt=async(_,y,w,T=1.5,M=36)=>{let E=i.cam,N=E.p.clone(),C=E.t.clone(),L=E.fov;o.locked=!0,E.mixK=0,await _.tween(.8,R=>{E.t.lerpVectors(C,y,R),E.fov=Ot(L,M,R)}),i.setShadowFocus(h(-1.2,.9,-1),2),w&&await w(),await _.wait(T),await _.tween(.8,R=>{E.t.lerpVectors(y,C,R),E.fov=Ot(M,L,R)});let b=i.views[E.name];b&&b.shadow&&i.setShadowFocus(h(...b.shadow[0]),b.shadow[1]),o.locked=!1};let v=()=>l.head.getWorldPosition(h());function m(_){g=!0,i.cam.mix="flame";for(let y of n.burners){let w="lin",T=0,M=null,E={x:0,y:0},N=()=>y.proxy.getWorldPosition(h());o.add({name:y===n.main?"knob":"knob2",group:"knob",obj:y.proxy,magnet:64,priority:1,center:N,onDown:C=>{y.held=!0,M=null;let L=o.screenOf(N()),b=o.screenOf(N().add(h(.03,0,0))),R=Math.max(18,Math.abs(b.x-L.x));w=Math.hypot(C.x-L.x,C.y-L.y)<R*.55?"lin":"ang",E={x:L.x,y:L.y},T=Math.atan2(C.y-L.y,C.x-L.x),i.step="knob-held"},onMove:C=>{let L=Math.min(window.innerWidth,window.innerHeight)/800,b;if(w==="lin")b=(C.dx-C.dy*.6)/(190*L);else{let R=E,S=Math.atan2(C.y-R.y,C.x-R.x),P=S-T;P>Math.PI&&(P-=Math.PI*2),P<-Math.PI&&(P+=Math.PI*2),T=S,b=P/y.maxAngle,Math.hypot(C.x-R.x,C.y-R.y)<12&&(b=0)}n.setKnob(y,y.value+b)},onUp:C=>{if(y.held=!1,y===n.main&&(d=1.3),C.tap){let L=[0,.3,.62,1],b=L.findIndex(P=>P>y.value+.05),R=b<0?0:L[b],S=y.value;_.tween(.35,P=>n.setKnob(y,Ot(S,R,P)),jt.inOut)}else n.release(y)}})}}n.onLit=_=>{_===n.main&&a.hint.poke()},n.onOff=_=>{let y=n.burnerWorld(_);y.y+=.03,a.sparkles(y,7,.6,[.75,.88,1]),a.puff(y,.6)},u.tickA=(_,y)=>{let w=i.cam;if(g&&w.name==="stove"&&w.mix==="flame"&&!o.locked){d=Math.max(0,d-_);let T=n.main.held||d>0?1:0;w.mixK+=(T-w.mixK)*Math.min(1,_*(T?3.2:2.2))}else w.mix==="flame"&&(w.mixK+=(0-w.mixK)*Math.min(1,_*4));if(n.small.thermal>.5&&Math.random()<_*5*n.small.thermal){let T=t.kettle.localToWorld(t.kettle.userData.spout.clone());a.puff(T,.7,.004)}},u.intro=async _=>{g=!1;let y=i.cam;y.set("wide"),o.locked=!0;let w=i.save.data.plays===0||i.params.has("intro");if(document.getElementById("fade").style.opacity=1,e.fade(_,0,1.2),c.lookAtWorld(h(.6,.9,-1.5)),w){l.seated=!1,l.o.hipY=.88,l.dozing=!1,l.restArms(),l.handL(-.24,.95,.05).handR(.24,.95,.05),l.set({eye:0,pitch:.25,roll:.1,smile:.2}),l.snap();let T=[h(2.5,0,.5),h(.75,0,-.35),h(-.5,0,-1.3),h(q.papa.x,0,q.papa.z)];l.root.position.copy(T[0]),t.papaShadow.position.set(T[0].x,.004,T[0].z),await _.wait(.8);let M=0,E=async(C,L,b)=>{let R=Math.atan2(L.x-C.x,L.z-C.z),S=l.root.rotation.y;await _.tween(b,P=>{l.root.position.lerpVectors(C,L,P),l.root.rotation.y=Ot(S,R,Math.min(1,P*4)),l.walk=(l.walk||0)+i.dt,l.p.leanSide.target=Math.sin(l.walk*6)*.07,l.p.bob.target=Math.abs(Math.sin(l.walk*6))*.012,t.papaShadow.position.set(l.root.position.x,.004,l.root.position.z),M+=i.dt,M>.52&&(M=0,r.step())},jt.lin)};await E(T[0],T[1],2.6),l.set({mouthOpen:1.2,pitch:-.2,mouthW:1}),l.handR(.3,1.85,.1),r.yawn(),c.lookAtWorld(v()),await _.wait(1.25),l.set({mouthOpen:0,pitch:.25}),l.handR(.24,.95,.05),await E(T[1],T[2],2),await E(T[2],T[3],1.2);let N=l.root.rotation.y;await _.tween(.45,C=>{l.root.rotation.y=Ot(N,0,C)}),l.set({leanSide:0,bob:0}),await _.tween(.5,C=>{l.o.hipY=Ot(.88,.47,C),C>.5&&(l.seated=!0)}),r.thud(.5),e.papaDoze(),await _.wait(1),r.snore()}else e.papaDoze(!0),await _.wait(1.2),r.snore();c.lookAtWorld(v()),await _.wait(.9),c.lookAtWorld(y.p),c.set({smile:1.2}),await _.wait(.6),r.hum(0);for(let T=0;T<2;T++)c.p.pitch.target+=.28,await _.wait(.22),c.p.pitch.target-=.28,await _.wait(.26);c.handR(.05,1.12,.3),await _.wait(.5),c.restArms(),await _.wait(.4),o.locked=!1},u.curtains=async _=>{g=!1,i.step="curtains";let y=i.cam;y.name!=="wide"&&y.set("wide"),l.proxyOn=1,await y.to("curtain",1.8,_);let w=i.room.curtains,T=0,M=0,E=!1,N=R=>()=>R.edgeWorld().add(h(.02,0,R.side*.1));for(let R of w){let S=0,P=o.add({name:R.side<0?"curtainBack":"curtainFront",group:"curtains",obj:R.mesh,magnet:110,center:N(R),enabled:()=>!R.done,onDown:()=>{R.dragging=!0},onMove:F=>{let D=o.screenOf(R.edgeWorld(0)),H=o.screenOf(R.edgeWorld(1)),B=H.x-D.x,z=H.y-D.y,Z=B*B+z*z,W=(F.dx*B+F.dy*z)/Z*1.5,tt=R.open;R.open=Dt(R.open+W,0,1),S=Math.abs(R.open-tt)*30,r.setCloth(S),M+=Math.abs(R.open-tt),M>.09&&(M=0,r.ringTick()),a.hint.poke()},onUp:F=>{if(R.dragging=!1,r.setCloth(0),F.tap||R.open>.3){R.target=1,R.done=!0,r.swish(1);for(let D=0;D<4;D++)_.wait(.08*D).then(()=>r.ringTick())}else R.target=0}})}let C=()=>w.find(R=>!R.done&&R.side>0)||w.find(R=>!R.done);e.hint({at:()=>{let R=C();return R?N(R)():null},to:()=>{let R=C();return R?R.edgeWorld(.9):null},size:.2}),await _.until(()=>{let R=(w[0].open+w[1].open)/2;i.setDaylight(.1+.9*R);for(let P of w)P.setEmissive(.95*(1-P.open));let S=w.filter(P=>P.done).length;return S>T&&(T=S,S===1&&(r.birds(),E||(E=!0,l.set({brow:-.6,yaw:.35}),_.wait(1.6).then(()=>{l.dozing&&l.set({brow:0,yaw:-.1})})))),w.every(P=>P.done&&P.open>.93)}),a.hint.clear(),i.setDaylight(1);for(let R of w)R.setEmissive(0);a.sparkles(h(-1.6,1.5,-.4),8,1.2),r.sparkle(.8),await _.wait(.5);let L=y.p.clone(),b=y.t.clone();await _.tween(1.3,R=>{y.t.lerpVectors(b,h(-1.05,1.08,-1.9),R),y.p.lerpVectors(L,h(.42,1.28,.55),R)}),i.step="comb-gag",r.rooster(),l.combWob.kick(3.5),await _.wait(.55),l.combWob.kick(-2.5),l.set({mouthOpen:.5}),r.snore(),await _.wait(.9),l.set({mouthOpen:0}),l.combWob.kick(2),c.set({smile:1.3}),r.hum(1),await _.wait(1.1)},u.pan=async _=>{g=!1,i.step="drawer";let y=i.cam,w=i.room.drawer;await y.to("drawer",2,_);let T=0,M=!1,E=!1,N=()=>i.room.drawerFront.getWorldPosition(h()).add(h(0,.12,.03));o.add({name:"drawer",group:"pan",obj:i.room.drawerFront,magnet:120,center:N,enabled:()=>!M,onDown:()=>{E=!0},onMove:R=>{let S=o.screenOf(h(.75,.62,q.counterZ1)),P=o.screenOf(h(.75,.62,q.counterZ1+.44)),F=P.y-S.y,D=P.x-S.x,H=(R.dx*D+R.dy*F)/(D*D+F*F);T=Dt(T+H*1.3,0,1),w.position.z=T*.44},onUp:R=>{if(E=!1,R.tap||T>.12){M=!0,r.drawer(1);let S=T;_.tween(.5,P=>{T=Ot(S,1,P),w.position.z=T*.44},jt.out).then(()=>{r.rattle()})}else{let S=T;_.tween(.3,P=>{T=Ot(S,0,P),w.position.z=T*.44})}}}),e.hint({at:N,to:()=>N().add(h(0,0,.3)),size:.22}),await _.until(()=>M&&T>.98),i.step="pick-pan";let C=-1;t.pans.forEach((R,S)=>{o.add({name:"pan"+S,group:"pan",obj:R,magnet:60,center:()=>R.getWorldPosition(h()).add(h(0,.03,0)),enabled:()=>C<0,onDown:()=>{e.pulse(_,R,.04,.2)},onUp:()=>{C<0&&(C=S)}})}),e.hint({at:()=>t.pans[1].getWorldPosition(h()).add(h(0,.03,0)),size:.26}),await _.until(()=>C>=0),a.hint.clear(),i.meal.pan=C;let L=t.pans[C];i.scene.attach(L),r.rattle();let b=L.position.clone().add(h(0,.42,.16));y.to("stove",1.7,_),await e.fly(_,L,b,{dur:.55,lift:0,rot:new De(.25,-.9,0),e:jt.out}),_.tween(.6,R=>{w.position.z=(1-R)*.44},jt.inOut).then(()=>r.drawer(-1)),await e.fly(_,L,t.panRest,{dur:.75,lift:.1,rot:new De(0,-.62,0)}),r.clack(1),n.main.hasPan=!0,s.attach(L),s.onBurner=!0,await _.tween(.35,R=>{L.rotation.z=Math.sin(R*Math.PI*3)*.018*(1-R),L.position.y=t.panRest.y+Math.abs(Math.sin(R*Math.PI*2))*.004*(1-R)},jt.lin),L.rotation.z=0,L.position.y=t.panRest.y,p(),await _.wait(.3)},u.butter=async _=>{i.step="butter";let y=i.cam;y.name!=="stove"&&await y.to("stove",1.4,_),m(_);let w=t.butterDish.userData.pats[0],T=()=>w.getWorldPosition(h());e.hint({at:T,to:()=>t.panRest.clone().add(h(0,.03,0)),size:.1}),i.scene.attach(w);let M=await e.carry(_,{name:"butter",obj:w,group:"butter",magnet:90,priority:2,hit:[w,t.butterDish]});a.hint.clear();let E=t.panRest.clone().add(h(-.012,.12,.02)).applyAxisAngle(h(0,1,0),0).setY(t.panRest.y+.13),N=s.holder.localToWorld(h(-.012,0,.02));E.x=N.x,E.z=N.z,await e.fly(_,w,E,{dur:.5,lift:.06}),await _.tween(.22,L=>{w.position.y=Ot(E.y,N.y,L)},jt.in),r.soft(1),w.visible=!1,t.butterDish.add(w),s.addButter(!1),i.meal.butter=!0,p();let C=s.pat;await _.tween(.3,L=>{C.position.y=Math.abs(Math.sin(L*Math.PI*2))*.006*(1-L),C.rotation.y=.4+L*.3},jt.lin),n.main.thermal>.1&&r.plop(n.main.thermal*.6)};async function f(_){let y=i.meal.eggs.length,w=t.shellEggs[y];if(!w||y>=3)return!1;let T={seed:i.meal.seed+y*17+1,twin:y===i.meal.twinAt},M=()=>w.group.getWorldPosition(h());s.eggs.length||e.hint({at:M,to:()=>t.panRest.clone().add(h(-.08,.06,.08)),size:.12}),await e.carry(_,{name:"egg",obj:w.group,group:"egg",magnet:80,hit:[w.group,t.eggBowl],center:M,enabled:()=>!s.busy&&!s.locked,onGrab:()=>{i.scene.attach(w.group)}}),s.busy=!0,a.hint.clear(),i.step="egg-tap",w.group.parent!==i.scene&&i.scene.attach(w.group);let E=2.45,N=t.panRest.clone().add(h(Math.cos(E)*(Oe.rt+.002),Oe.h+.001,Math.sin(E)*(Oe.rt+.002))),C=N.clone().add(h(-.004,.05,.004)),L=w.tilt.quaternion.clone(),b=new dn().setFromEuler(new De(Math.PI/2,0,0)),R=w.group.quaternion.clone(),S=new dn().setFromEuler(new De(0,-E+Math.PI/2,0)),P=w.group.position.clone();await _.tween(.55,gt=>{w.group.position.lerpVectors(P,C,gt),w.group.position.y+=Math.sin(gt*Math.PI)*.05,w.tilt.quaternion.slerpQuaternions(L,b,gt),w.group.quaternion.slerpQuaternions(R,S,gt)});let F=0,D=!1,H=0,B=e.temp(new it(new ne(.11,10,8),new Me({visible:!1})));B.position.copy(C),i.scene.add(B);let z=o.add({name:"eggtap",group:"egg",obj:B,magnet:150,priority:3,center:()=>C.clone(),onDown:()=>{H++}});e.hint({at:()=>C.clone(),size:.12,glowDelay:2.5,handDelay:5}),await _.until(()=>{if(!D&&H>0&&F<3){H--,D=!0,F++;let gt=F;_.tween(.09,j=>{w.group.position.y=Ot(C.y,N.y+.021,j)},jt.in).then(()=>{w.setStage(gt),gt<3?r.tap(.8+gt*.2):r.crack(),r.clink(.25);let j=t.pickPan();j.rotation.z=.012,_.tween(.2,ft=>{j.rotation.z=.012*(1-ft)*Math.cos(ft*9)},jt.lin);for(let ft of s.eggs)ft.kick(.05,.03,0);return _.tween(.16,ft=>{w.group.position.y=Ot(N.y+.021,C.y,ft)},jt.out)}).then(()=>{D=!1})}return F>=3&&!D}),o.remove(z),a.hint.clear(),i.step="egg-open";let Z=Ao[y],W=s.holder.localToWorld(h(Z[0],0,Z[1])),tt=W.clone().add(h(0,.105,0)),k=w.group.position.clone();await _.tween(.45,gt=>{w.group.position.lerpVectors(k,tt,gt),w.group.position.y+=Math.sin(gt*Math.PI)*.02}),B.position.copy(tt);let ut=!1,pt=o.add({name:"eggopen",group:"egg",obj:B,magnet:170,priority:3,center:()=>tt.clone(),onDown:()=>{ut=!0}}),Tt=0;await _.until(gt=>(Tt+=gt,ut||Tt>1.4)),o.remove(pt),e.untemp(B),r.shellOpen();let dt=s.addEgg(T,"raw"),Pt=dt.group.position.y;dt.group.position.y=Pt+.075,dt.group.visible=!1;let te=e.temp(Mf());i.scene.add(te),te.visible=!1,_.tween(.4,gt=>{w.setOpen(gt),w.group.position.y=tt.y+gt*.012},jt.out),await _.wait(.14),dt.group.visible=!0,te.visible=!0;let Rt=n.main.thermal;if(await _.tween(.3,gt=>{dt.group.position.y=Pt+.075*(1-gt*gt);let j=tt.y-.012,ft=dt.group.getWorldPosition(h()).y+.012;te.position.set(W.x,j,W.z),te.scale.set(.011*(1-.3*gt),Math.max(.001,j-ft),.011*(1-.3*gt))},jt.lin),dt.group.position.y=Pt,r.plop(Rt),dt.kick(.25,.18,2.6),Rt>.25)for(let gt=0;gt<4;gt++)a.puff(W.clone().add(h(0,.01,0)),.9);_.tween(.5,gt=>{te.scale.x=te.scale.z=.008*(1-gt),te.material.opacity=.32*(1-gt)},jt.in).then(()=>{e.untemp(te),te.geometry.dispose(),te.material.dispose()}),_.tween(2.4,gt=>dt.setSpread(gt),jt.lin).then(()=>dt.kick(.06,.05,0)),i.meal.eggs.push(T),p(),await _.wait(.35);let Ht=t.shellBowl.position.clone().add(h((y-1)*.012,.03+y*.008,.004*y));return await e.fly(_,w.group,Ht,{dur:.55,lift:.07,rot:new De(.3*y,1+y,.2)}),w.group.scale.setScalar(.92),r.tap(.35),s.busy=!1,i.step="egg-in",T.twin&&(await _.wait(.9),r.sparkle(1),a.sparkles(W.clone().add(h(0,.03,0)),8,.8),await _.wait(.5),await e.glanceAt(_,v().add(h(0,.08,0)),async()=>{await _.wait(.25),l.p.hairSplit.target=1,l.combWob.kick(3),r.boing(),await _.wait(.5),c.set({smile:1.3}),r.hum(1)},1.4,30)),!0}async function x(_){for(;!_.dead&&i.meal.eggs.length<3&&!s.locked&&await f(_););}return u.egg=async _=>{i.step="egg";let y=i.cam;y.name!=="stove"&&y.set("stove"),m(_),s.locked=!1,s.busy=!1,await f(_),await _.wait(.6)},u.stove=async _=>{i.step="stove";let y=i.cam;y.name!=="stove"&&y.set("stove"),m(_),s.locked=!1,s.busy=!1,x(_);let w=()=>n.main.proxy.getWorldPosition(h()),T=H=>e.hint({at:w,to:()=>w().add(h(.07*H,0,0)),size:.11});T(1);let M=t.lid,E=!1,N=()=>t.panRest.clone().add(h(0,Oe.h+.001,0)),C=async H=>{if(!(E||s.lidOn===H)){if(E=!0,H)await e.fly(_,M,N(),{dur:.6,lift:.1,rot:new De(0,0,0)}),r.clink(.6),r.clack(.3),s.lidOn=!0;else{s.lidOn=!1;for(let B=0;B<5;B++)a.puff(N(),1.2,.07);await e.fly(_,M,t.lidRest.p,{dur:.6,lift:.12,rot:t.lidRest.r}),r.clink(.4)}E=!1}};o.add({name:"lid",group:"stove",obj:M,magnet:50,center:()=>M.getWorldPosition(h()).add(h(0,s.lidOn?.04:0,0)),priority:s.lidOn?2:0,enabled:()=>!E&&!s.busy&&!s.locked,onUp:()=>C(!s.lidOn)});let L=0,b=0,R=4+Math.random()*4,S=!1,P=we(i.meal.gagSeed);await _.until(H=>{let B=n.main;if(!B.lit&&!B.held?L+=H:(L>0&&T(1),L=0,B.lit&&a.hint.poke()),B.thermal>.86?b+=H:b=0,b>9&&!S&&(S=!0,r.hum(0),e.hint({at:w,to:()=>w().add(h(-.05,0,0)),size:.11,glowDelay:.2,handDelay:.6,repeat:30}),_.wait(5).then(()=>{s.allDone()||T(1)})),R-=H,R<0&&B.lit){R=7+P()*6;let z=Math.floor(P()*3);if(z===0)r.snore();else if(z===1){for(let Z of s.eggs)Z.kick(.12,.1,.4);r.pop(1.4)}else r.hum(P()<.5?0:1)}return s.allDone()&&!s.busy}),s.locked=!0,i.step="stove-done",a.hint.clear();let F=t.panRest.clone().add(h(0,.07,0));if(a.sparkles(F,14,1),r.sparkle(1),o.locked=!0,i.cam.mixK=0,await y.to("eggclose",1.1,_),await _.wait(1.5),await y.to("stove",1,_),o.locked=!1,n.main.lit||n.main.value>0){await e.glanceMama(_,()=>{c.lookAtWorld(w()),c.handR(-.25,1.05,.38),_.wait(.7).then(()=>{c.lookAtWorld(i.cam.p),c.p.pitch.target+=.2,r.hum(0)})},1.5),c.restArms(),e.hint({at:w,to:()=>w().add(h(-.07,0,0)),size:.12,glowDelay:.3,handDelay:2.5}),i.step="stove-off";let H=0;if(await _.until(B=>(H+=B,n.main.held&&(H=Math.min(H,8)),!n.main.lit&&n.main.value===0||H>14)),n.main.lit||n.main.value>0){o.locked=!0,e.mamaTo(1.02,-.98,-1.25),c.set({lean:.35,bodyYaw:-.2});let B=c.toLocal(w().add(h(.02,.05,.02)));c.handL(B.x,B.y,B.z),await _.wait(.7);let z=n.main.value;await _.tween(.7,Z=>n.setKnob(n.main,z*(1-Z),!1),jt.inOut),n.forceOff(n.main),await _.wait(.3),c.restArms(),c.set({lean:0,bodyYaw:0}),await _.wait(.5),e.mamaTo(1.62,-.72,-.85),o.locked=!1}}a.hint.clear(),n.forceOff(n.small),await _.wait(.5),s.lidOn&&await C(!1),i.meal.crisp=Math.max(...s.eggs.map(H=>H.crisp)),i.meal.film=Math.max(...s.eggs.map(H=>H.film)),p(),await e.glanceMama(_,()=>{c.lookAtWorld(i.cam.p),c.set({thumb:1,smile:1.3}),c.handR(.2,1.22,.32),r.hum(1)},1.3),c.restArms(),g=!1},u}function Af(i){let t=i.world,e=i.x,n=i.stove,s=i.cook,r=i.audio,o=i.input,a=i.fx,l=t.papa,c=t.mama,u={},h=(v,m,f)=>new U(v,m,f),p=()=>{i.save.data.meal=i.meal,i.save.write()},d=q.table.y;u.toast=async v=>{i.step="toast-bread";let m=i.cam,f=t.toaster,x=f.userData;await m.to("toaster",1.9,v);let _=0,y=!1,w=0,T=!1,M=(D,H)=>h(-.012+D*.01,x.topY+(H?-.017:-.046),x.slotZ[D]),E=t.bread.map((D,H)=>{let B={k:H,placed:!1,busy:!1};return(async()=>{await e.carry(v,{name:"bread"+H,obj:D,group:"toast",magnet:80,priority:H,enabled:()=>!y&&!B.busy}),B.busy=!0;let Z=_++;B.slot=Z,a.hint.clear();let W=f.localToWorld(M(Z,!0)),tt=W.clone().add(h(0,.12,0)),k=new dn().setFromEuler(new De(0,f.rotation.y,0));await e.fly(v,D,tt,{dur:.45,lift:.05,rot:new De(0,f.rotation.y,0)}),await v.tween(.25,ut=>{D.position.lerpVectors(tt,W,ut)},jt.in),f.attach(D),D.position.copy(M(Z,!0)),D.rotation.set(0,0,0),r.soft(1),r.rattle(),B.placed=!0,y||L()})(),B}),N=()=>x.lever.getWorldPosition(h()).add(h(.02,0,0)),C=()=>E.filter(D=>D.placed).length,L=()=>{C()===0?e.hint({at:()=>t.bread[1].getWorldPosition(h()),to:()=>f.localToWorld(h(0,x.topY+.05,0)),size:.16}):e.hint({at:N,to:()=>N().add(h(0,-.09,0)),size:.1,glowDelay:C()>=2?1.5:5,handDelay:C()>=2?4:9})};L();let b=new it(new mn(.09,.2,.1),new Me({visible:!1}));b.position.set(x.W/2+.03,x.H*.55,0),f.add(b),o.add({name:"lever",group:"toast",obj:b,magnet:70,priority:3,center:N,enabled:()=>!y&&C()>0&&E.every(D=>!D.busy||D.placed),onDown:()=>{T=!0},onMove:D=>{let H=o.screenOf(f.localToWorld(h(x.W/2,x.leverUpY,0))),B=o.screenOf(f.localToWorld(h(x.W/2,x.leverDownY,0))),z=D.dy/Math.max(20,B.y-H.y);w=Dt(w+z*1.3,0,1)},onUp:D=>{T=!1,(D.tap||w>.3)&&(y=!0)}}),await v.until(D=>(!T&&!y&&(w+=(0-w)*Math.min(1,D*10)),y&&(w+=(1-w)*Math.min(1,D*16)),x.lever.position.y=Ot(x.leverUpY,x.leverDownY,w),E.forEach(H=>{H.placed&&(t.bread[H.k].position.y=Ot(M(H.slot,!0).y,M(H.slot,!1).y,w))}),y&&w>.97)),f.remove(b),a.hint.clear(),r.lever(),i.step="toasting";let R=0,S=C();await v.tween(4.6,D=>{x.coilMat.emissiveIntensity=2.6*Math.min(1,D*3)*(.92+.08*Math.sin(i.time*30)),E.forEach(H=>{H.placed&&(t.bread[H.k].userData.uni.uToast.value=jt.inOut(Dt(D*1.05))*(.92+.08*H.k))}),R+=i.dt,R>.3&&(R=0,r.tick()),D>.5&&Math.random()<i.dt*3&&a.puff(f.localToWorld(h((Math.random()-.5)*.1,x.topY+.02,0)),.5)},jt.lin),r.toastPop(),y=!1,i.step="toast-pop",v.tween(.9,D=>{x.coilMat.emissiveIntensity=2.6*(1-D)},jt.out),v.tween(.12,D=>{x.lever.position.y=Ot(x.leverDownY,x.leverUpY,D)},jt.out),E.forEach(D=>{if(!D.placed)return;let H=t.bread[D.k],B=H.position.y,z=M(D.slot,!0).y+.012;v.tween(.55,Z=>{H.position.y=Ot(B,z,Z)+Math.sin(Math.min(1,Z*1.6)*Math.PI)*.06*(1-Z*.5),H.rotation.z=Math.sin(Z*9)*.05*(1-Z)},jt.out)});for(let D=0;D<3;D++)a.puff(f.localToWorld(h(0,x.topY+.03,0)),.8);let P=m.p.clone(),F=m.t.clone();v.tween(.5,D=>{m.t.lerpVectors(F,h(-.95,1.02,-1.5),D)},jt.out),l.dozing=!1,l.set({eye:1.5,brow:1,mouthOpen:.8,mouthW:.5,pitch:-.15,roll:0,yaw:.3,bob:.09,lean:-.05}),l.handL(-.36,1.32,.2).handR(.36,1.32,.2),r.gasp(),l.p.bob.v=1.6,l.p.hairLean.target=-l.p.hairLean.target||-1,l.combWob.kick(6),await v.wait(.35),l.set({bob:0}),r.boing(),await v.wait(.9),c.set({smile:1.3}),r.hum(1),l.set({eye:.5,mouthOpen:0,brow:0}),l.handR(.2,.755,.34),await v.wait(.7),e.papaDoze(),r.snore(),await v.wait(.8),v.tween(.7,D=>{m.t.lerpVectors(h(-.95,1.02,-1.5),F,D)}),i.meal.toast=S,p(),a.sparkles(f.localToWorld(h(0,x.topY+.1,0)),8,.8),r.sparkle(.7),await v.wait(.9)};let g=[[-.078,.058],[.082,.055],[-.09,-.02],[.092,-.01],[0,.092],[-.05,-.085],[.055,-.085],[0,-.1],[-.1,.02],[.1,.03]];return u.plate=async v=>{i.step="plate-choose";let m=i.cam,f=i.meal,x=q.counterY;m.to("plate",1.8,v);let _=t.bread.filter(($,et)=>et<f.toast),y=t.sideBoard.position;_.forEach(($,et)=>{i.scene.attach($);let lt=h(y.x+.2-et*.03,x+.016+.01+et*.018,y.z+.005+et*.012);v.wait(.3+et*.25).then(()=>e.fly(v,$,lt,{dur:.8,lift:.18,rot:new De(-Math.PI/2,0,.25-et*.5)})).then(()=>r.soft(.7))});let w=t.sideItems.slice();_.forEach(($,et)=>w.push({type:"toast",obj:$,placed:!1,idx:et}));let T=f.plateSet,M=[[-.04,.003,-1.375,0],[.17,.016,-1.43,.07],[.38,.003,-1.375,0]],E=(f.plate>=0,-1);T.forEach(($,et)=>{let lt=t.plates[$];lt.visible=!0,lt.position.set(M[et][0]-.5,x+M[et][1],M[et][2]),lt.rotation.set(0,0,et===1?.05:0),v.wait(.5+et*.15).then(()=>v.tween(.6,Ut=>{lt.position.x=M[et][0]-.5*(1-Ut)},jt.out)).then(()=>r.clink(.5)),o.add({name:"plate"+et,group:"plate",obj:lt,magnet:50,priority:et===1?1:0,center:()=>lt.position.clone().add(h(0,.02,0)),enabled:()=>E<0&&i.sc.time>1.4,onDown:()=>e.pulse(v,lt,.03,.2),onUp:()=>{E<0&&(E=$)}})}),e.hint({at:()=>t.plates[T[1]].position.clone().add(h(0,.03,0)),size:.3}),await v.until(()=>E>=0),a.hint.clear(),f.plate=E;let N=t.plates[E];r.clink(.8),T.forEach(($,et)=>{if($===E)return;let lt=t.plates[$];v.tween(.5,Ut=>{lt.position.x=M[et][0]-.7*Ut},jt.in).then(()=>{lt.visible=!1})}),await v.tween(.5,$=>{N.position.lerp(h(t.plateSpot.x,x+.002,t.plateSpot.z),$*.5+.02),N.rotation.z*=1-$}),N.position.set(t.plateSpot.x,x+.002,t.plateSpot.z),N.rotation.set(0,0,0),r.clink(.5),o.clear("plate"),i.step="plate-egg";let C=t.spatula,L=C.position.clone(),b=C.rotation.clone(),R=s.eggs,S=t.eggPlateSpots(R.length),P=0,F=!1,D=0,H=()=>R[P]?R[P].group.getWorldPosition(h()).add(h(0,.02,0)):t.panRest.clone();o.add({name:"spatula",group:"plate2",obj:C,magnet:80,priority:2,center:()=>C.position.clone().add(h(0,.03,.05)),enabled:()=>P+D<R.length,onDown:()=>{D++}});let B=e.temp(new it(new sn(Oe.rt,Oe.rt,.05,16),new Me({visible:!1})));B.position.copy(t.panRest).add(h(0,.03,0)),i.scene.add(B),o.add({name:"eggInPan",group:"plate2",obj:B,magnet:40,center:H,enabled:()=>P+D<R.length,onDown:()=>{D++}}),e.hint({at:()=>C.position.clone().add(h(0,.03,.05)),to:H,size:.14});let z=async()=>{F=!0;let $=R[P],et=P,lt=$.group.getWorldPosition(h()),Ut=new De(0,0,0);await e.fly(v,C,lt.clone().add(h(0,.004,.16)),{dur:.45,lift:.08,rot:Ut}),r.swish(.7),await v.tween(.35,X=>{C.position.z=lt.z+.16-.13*X,C.position.y=lt.y+.004-.003*X},jt.out),i.scene.attach($.group),C.attach($.group),$.kick(.2,.2,.6);let wt=C.position.clone().add(h(0,.11,.03));await e.fly(v,C,wt,{dur:.35,lift:0,e:jt.out});let Zt=N.localToWorld(h(S[et][0],Ln.wellY+6e-4+et*6e-4,S[et][1]));await e.fly(v,C,Zt.clone().add(h(0,.035,.035)),{dur:.7,lift:.07}),$.kick(.3,.25,0),i.scene.attach($.group);let Kt=$.group.position.clone(),se=C.position.clone();await v.tween(.4,X=>{$.group.position.lerpVectors(Kt,Zt,X),C.rotation.x=.35*Math.sin(X*Math.PI),C.position.lerpVectors(se,se.clone().add(h(0,.02,.1)),X)},jt.inOut),N.attach($.group),$.group.position.set(S[et][0],Ln.wellY+6e-4+et*6e-4,S[et][1]),$.group.rotation.set(0,0,0),r.soft(1),$.kick(.35,.3,1.6),a.sparkles(Zt.clone().add(h(0,.03,0)),5,.6),await e.fly(v,C,L,{dur:.5,lift:.06,rot:b}),P++,F=!1};await v.until(()=>(!F&&D>0&&P<R.length&&(D--,a.hint.clear(),z().then(()=>{P<R.length&&e.hint({at:()=>C.position.clone().add(h(0,.03,.05)),to:H,size:.14})})),P>=R.length&&!F)),e.untemp(B),o.clear("plate2"),f.plated=!0,r.chime(2),i.step="plate-sides";let Z=0,W=0,tt=()=>N.position.clone().add(h(0,.02,0)),k=async($,et,lt)=>{let Ut,wt,Zt=et?N.worldToLocal(et.clone()):null;if(!lt&&$.type!=="toast"&&Zt&&Math.hypot(Zt.x,Zt.z)<.135){Ut=Zt.x,wt=Zt.z;let qt=Math.hypot(Ut,wt),xt=$.type==="toast"?.085:.105;qt>xt&&(Ut*=xt/qt,wt*=xt/qt)}else{let qt=$.type==="toast"?t.toastPlateSpots[$.idx]:g[Z++%g.length];Ut=qt[0],wt=qt[1]}let Kt=$.obj;Kt.parent!==i.scene&&i.scene.attach(Kt);let se=$.type==="toast",X=Ln.wellY+(se?.044:(Math.hypot(Ut,wt)>.085?.007:0)+(R.some(qt=>Math.hypot(qt.group.position.x-Ut,qt.group.position.z-wt)<.045)?.004:0)),fe=N.localToWorld(h(Ut,X,wt)),ee=se?new De(-.62,t.toastPlateSpots[$.idx][2],0,"YXZ"):new De(0,Kt.rotation.y,Kt.userData.tilt||0);await e.fly(v,Kt,fe,{dur:.4,lift:.07,rot:ee}),N.attach(Kt),r.soft(.9),se&&r.crunch(),await v.tween(.2,qt=>{Kt.position.y=X+Math.sin(qt*Math.PI)*.006},jt.lin),$.lx=Ut,$.lz=wt,$.placed||($.placed=!0,W++)},ut=async $=>{for(;!v.dead&&!$.gone;){let et=await e.carry(v,{name:"side-"+$.type+($.placed?"-on":""),obj:$.obj,group:"sides",magnet:$.placed?26:44,priority:$.placed?4:2,lift:.06,enabled:()=>!pt,onGrab:()=>{$.obj.parent!==i.scene&&i.scene.attach($.obj)}});if(pt)return;await k($,et.pos,et.tap&&!$.placed)}},pt=!1;w.forEach($=>ut($)),e.hint({at:()=>{let $=w.find(et=>!et.placed);return $?$.obj.getWorldPosition(h()):tt()},to:tt,size:.12,glowDelay:3,handDelay:6});let Tt=new it(new sn(Ln.r+.012,Ln.r+.012,.012,24),new Me({visible:!1}));Tt.position.y=.004,N.add(Tt);let dt=0,Pt=N.position.clone();o.add({name:"plateServe",group:"serveTrigger",obj:Tt,magnet:0,priority:0,center:()=>N.position.clone().add(h(-.118,.02,.03)),enabled:()=>!pt,onMove:$=>{dt=Math.hypot($.x-$.sx,$.y-$.sy);let et=Math.min(window.innerWidth,window.innerHeight)/800;N.position.x=Pt.x+Dt(($.x-$.sx)/(900*et),-.06,.03),dt>46*et&&(pt=!0)},onUp:$=>{if(!pt){let et=N.position.x;v.tween(.25,lt=>{N.position.x=Ot(et,Pt.x,lt)}),$.tap&&(e.pulse(v,N,.02,.25),e.hint({at:()=>N.position.clone().add(h(-.118,.02,.03)),to:()=>N.position.clone().add(h(-.3,.02,.03)),size:.16,glowDelay:.1,handDelay:.4}))}}});let te=0,Rt=0,Ht=!1;await v.until($=>(W!==Rt&&(Rt=W,te=0,Ht=!1),te+=$,!Ht&&(te>(W>0?7:16)||W>=w.length)&&(Ht=!0,e.hint({at:()=>N.position.clone().add(h(-.118,.02,.03)),to:()=>N.position.clone().add(h(-.3,.02,.03)),size:.16,glowDelay:1.2,handDelay:3})),pt)),a.hint.clear(),o.clear(),o.locked=!0,N.remove(Tt),i.step="plate-photo",f.sides=w.filter($=>$.placed).map($=>({type:$.type,x:$.lx,z:$.lz,idx:$.idx})),w.forEach($=>{$.gone=!0}),await v.tween(.3,$=>{N.position.x+=(Pt.x-N.position.x)*$}),await v.wait(.15),r.shutter();let gt=N.position.clone();f.photo=await i.takePhoto({p:gt.clone().add(h(0,.4,.25)),t:gt.clone().add(h(0,.012,0)),fov:36});let j=document.getElementById("fade");j.style.background="#fff",j.style.opacity=.85,await v.tween(.5,$=>{j.style.opacity=(.85*(1-$)).toFixed(3)},jt.out),j.style.background="#1c1510",p(),i.step="plate-carry",e.mamaTo(-.52,-1.46,.5),c.lookAtWorld(h(-1.35,.8,-.9));let ft=h(-1.33,d+.003,-.46);m.to("table",2.3,v),await e.fly(v,N,ft,{dur:2.3,lift:.3}),r.clink(.6),o.locked=!1},u.serve=async v=>{i.step="serve";let m=i.cam;m.name!=="table"&&m.set("table");let f=i.meal,x=t.pickPlate();e.mamaTo(-.52,-1.46,.5),c.lookAtWorld(h(-1.35,.8,-.9));let _=h(-1.33,d+.003,-.46),y=h(q.papa.x,d+.003,-.95);x.position.copy(_);let w=!1,T=0,M=new it(new sn(Ln.r+.03,Ln.r+.03,.08,20),new Me({visible:!1}));M.position.y=.03,x.add(M),o.add({name:"plateSlide",group:"serve",obj:M,magnet:140,center:()=>x.position.clone().add(h(0,.02,0)),enabled:()=>!w,onMove:k=>{let ut=o.screenOf(_),pt=o.screenOf(y),Tt=pt.x-ut.x,dt=pt.y-ut.y;T=Dt(T+(k.dx*Tt+k.dy*dt)/(Tt*Tt+dt*dt),0,1),x.position.lerpVectors(_,y,T),r.setScrub(.25)},onUp:k=>{r.setScrub(0),(k.tap||T>.12)&&(w=!0)}}),e.hint({at:()=>x.position.clone().add(h(0,.02,0)),to:()=>y.clone().add(h(0,.02,0)),size:.3}),await v.until(()=>w),a.hint.clear(),x.remove(M),o.clear("serve");let E=x.position.clone();r.swish(.6),await v.tween(.8,k=>{x.position.lerpVectors(E,y,k)},jt.out),r.clink(.5);for(let k of s.eggs)k.kick(.3,.4,.3);m.to("eat",1.6,v),i.step="papa-wakes",l.dozing=!1,l.restArms(),l.pole[-1].set(-.5,-.8,-.35),l.set({roll:.05,pitch:-.12,yaw:0,lean:.05,leanSide:0}),r.sniff(),await v.wait(.35),l.p.pitch.target=-.02,await v.wait(.25),l.p.pitch.target=-.14,await v.wait(.5),l.set({eye:.45,brow:.3,pitch:.32}),await v.wait(.8),l.set({eye:1,brow:.8,mouthOpen:.5,mouthW:.5}),r.gasp(),c.set({smile:1.2}),await v.wait(.7),l.set({mouthOpen:0,smile:1}),l.arms[1].hand.add(t.fork),t.fork.position.set(0,0,.05),t.fork.rotation.set(.5,0,0);let C=[],L=we(f.seed+5),b=s.eggs.filter(k=>k.group.parent===x);b.forEach((k,ut)=>{let pt=b.length===1?3:2,Tt=L()*6.28;for(let dt=0;dt<pt;dt++)C.push({kind:"egg",e:k,b:dt,last:dt===pt-1,a:Tt+dt*2.4,col:dt===1?16098851:16447210,ord:dt*3+ut})});let R=k=>k.parent===x&&k.visible;t.bread.forEach((k,ut)=>{R(k)&&(C.push({kind:"toast",b:k,n:0,col:13208133,ord:1+ut*3}),C.push({kind:"toast",b:k,n:1,last:!0,col:13208133,ord:5+ut*3}))});let S=t.sideItems.filter(k=>R(k.obj));for(let k=0;k<S.length;k+=2)C.push({kind:"side",items:S.slice(k,k+2),col:S[k].type==="lettuce"||S[k].type==="broccoli"?8370250:14234667,ord:2+k*1.5});C.sort((k,ut)=>k.ord-ut.ord);let P=e.temp(new it(new ne(.014,12,10),new Se({color:16777215,roughness:.5})));P.visible=!1,t.fork.add(P),P.position.set(0,.004,-.085);let F=0,D=e.temp(new it(new ne(.45,10,8),new Me({visible:!1})));D.position.copy(y).add(h(0,.2,-.2)),i.scene.add(D),o.add({name:"feed",group:"eat",obj:D,magnet:400,center:()=>x.position.clone().add(h(0,.03,0)),onDown:()=>{F++}}),i.step="eating";let H=C.length,B=0,z=()=>l.toLocal(l.mouthG.getWorldPosition(h()));for(let k of C){let ut;k.kind==="egg"?ut=k.e.group.localToWorld(h(Math.cos(k.a)*.03,.01,Math.sin(k.a)*.03)):k.kind==="toast"?ut=k.b.getWorldPosition(h()):ut=k.items[0].obj.getWorldPosition(h());let pt=l.toLocal(ut.clone().add(h(0,.05,.03)));if(l.set({pitch:.34,lean:.14}),l.handR(pt.x,pt.y,pt.z),await v.wait(.42),P.material.color.setHex(k.col),P.visible=!0,P.scale.setScalar(1),k.kind==="egg"){let Rt=k.e;if(k.last)Rt.setBite(k.b,0,0,.3);else{let Ht=b.length===1?.034+k.b*.006:.046;Rt.setBite(k.b,Math.cos(k.a)*(k.b===1?.012:.04),Math.sin(k.a)*(k.b===1?.012:.04),Ht)}Rt.kick(.2,.2,.3)}else if(k.kind==="toast"){let Rt=k.b.userData.uni.uBites.value;k.last?k.b.visible=!1:(Rt[0].set(.05,.05,.05),r.crunch())}else for(let Rt of k.items)Rt.obj.visible=!1;r.tap(.3);let Tt=z();l.handR(Tt.x+.03,Tt.y-.02,Tt.z+.1),l.set({pitch:.05,lean:.05,mouthOpen:.9,mouthW:.7}),await v.wait(.42),P.visible=!1,l.set({mouthOpen:0}),l.chew=1,k.kind==="toast"?r.crunch():r.munch(),B++;let dt=B/H;l.set({eye:Ot(.55,1.15,dt),brow:.3+.6*dt,leanSide:(B%2?1:-1)*.06}),l.handR(.24,.86,.36);let Pt=0,te=F;await v.until(Rt=>(Pt+=Rt,Pt>.95||F>te&&Pt>.3)),l.chew=0,B%3===0&&(r.mmm(),c.set({smile:1.3}))}o.clear("eat"),e.untemp(D),o.locked=!0,i.step="papa-happy",e.dirtyPlate(),l.handR(.22,.78,.3),i.scene.attach(t.fork),t.fork.position.set(q.papa.x+.2,d+.004,-.93),t.fork.rotation.set(0,.4,0),r.clink(.3),l.set({leanSide:0,eye:1.55,brow:1,sparkle:1,smile:1.3,pitch:-.08,lean:0}),r.mmm(),r.sparkle(1),a.sparkles(l.head.getWorldPosition(h()).add(h(0,.05,.12)),14,1.1),await v.wait(1.3),l.arcMode="happy",l.handL(-.62,1.2,.25).handR(.62,1.2,.25),r.whee(),m.to("hug",1.1,v),await v.wait(.5),l.set({eye:0,lean:.55,pitch:-.25,sparkle:0}),l.handL(-.3,1.02,.78).handR(.3,1.02,.78),await v.wait(.5),r.pat(),l.p.bob.v=.5,await v.wait(.3),r.pat(),l.p.bob.v=.5,await v.wait(1),m.to("eat",1.1,v),l.set({eye:1.2,lean:0,pitch:0,sparkle:.6,thumb:1}),l.handL(-.22,.76,.28).handR(.3,1.18,.42),r.chime(3),c.set({smile:1.3});let Z=c.toLocal(c.head.getWorldPosition(h())),W=0;v.tween(1.3,()=>{W+=i.dt;let k=.05+.05*Math.sin(W*22);c.handL(-k,1.15,.26).handR(k,1.15,.26)},jt.lin).then(()=>c.restArms()),r.clap(),await v.wait(1.5),i.step="hair-gag",l.set({thumb:0,sparkle:0,eye:1});let tt=l.toLocal(l.head.getWorldPosition(h()).add(h(0,.2,.02)));l.handR(.24,.8,.3).handL(tt.x-.02,tt.y+.08,tt.z),await v.wait(.45),l.handL(tt.x-.02,tt.y-.04,tt.z),l.p.hairFlat.target=1,l.p.hairFlat.k=300,l.p.hairFlat.d=30,r.pat(),await v.wait(.3),l.set({smile:1.3,eye:0}),await v.wait(.6),l.handL(-.22,.76,.28),await v.wait(.75),l.p.hairFlat.k=150,l.p.hairFlat.d=5,l.p.hairFlat.target=0,l.combWob.kick(5),r.boing(),l.set({eye:1.3,brow:1,pitch:-.2}),await v.wait(.5),c.set({smile:1.4}),r.hum(1),await v.wait(.6),l.set({eye:0,pitch:0,brow:.3}),r.jingle(),await v.wait(1.6),l.set({eye:1}),o.locked=!1},u}var Ne=96,Wl=class{constructor(t,e,n,s){this.R=e,this.dirt=new Float32Array(Ne*Ne),this.foam=new Float32Array(Ne*Ne),this.wet=new Float32Array(Ne*Ne),this.data=new Uint8Array(Ne*Ne*4),this.tex=new ps(this.data,Ne,Ne,Hn),this.tex.magFilter=this.tex.minFilter=Qe,this.tex.needsUpdate=!0;let r=new xs(t.map(h=>new ot(h[0],h[1]+7e-4)),64),o=r.attributes.position,a=r.attributes.uv;for(let h=0;h<o.count;h++)a.setXY(h,o.getX(h)/(2*e)+.5,o.getZ(h)/(2*e)+.5);let l=hn(n,64),c=To(tn(128,(h,p)=>[l.fbm(h*8,p*8,3),l(h*40,p*40),l.fbm(h*20+5,p*20,2)]),{srgb:!1});this.uni={tMask:{value:this.tex},tN:{value:c},uTime:{value:0},uFlow:{value:0},uDirtCol:{value:new Bt(s)}},this.mat=Yn(new Ge({color:16777215,roughness:.3,transparent:!0,depthWrite:!1,clearcoat:1,clearcoatRoughness:.05,polygonOffset:!0,polygonOffsetFactor:-2,side:xe}),{uniforms:this.uni,key:"wash",vertexPars:"varying vec2 vWuv;",vertexMain:"vWuv = uv;",fragmentPars:"varying vec2 vWuv; uniform sampler2D tMask; uniform sampler2D tN; uniform float uTime, uFlow; uniform vec3 uDirtCol;",replace:{"#include <map_fragment>":`
          vec3 mk = texture2D(tMask, vWuv).rgb; vec3 nn = texture2D(tN, vWuv * 3.0).rgb; vec3 n2 = texture2D(tN, vWuv * 7.0 + vec2(0.0, -uTime * 0.25 * uFlow)).rgb;
          float dirt = mk.r * smoothstep(0.25, 0.6, nn.r + mk.r * 0.5);
          float foam = smoothstep(0.12, 0.5, mk.g * (0.6 + 0.8 * n2.b));
          float drops = mk.b * smoothstep(0.62, 0.72, n2.g * 0.6 + nn.b * 0.5) ;
          float film = mk.b * 0.10;
          vec3 col = mix(uDirtCol * (0.7 + 0.5 * nn.b), vec3(0.4, 0.25, 0.1), smoothstep(0.6, 0.9, nn.g) * 0.5);
          float a = dirt * 0.9;
          col = mix(col, vec3(1.0), foam); a = max(a, foam * (0.80 + 0.2 * n2.g));
          a = max(a, max(drops * 0.35, film));
          diffuseColor.rgb = col * (0.9 + 0.1 * n2.g); diffuseColor.a = a;
          float washFoam = foam; float washWet = max(drops, mk.b * 0.4);`,"#include <roughnessmap_fragment>":"float roughnessFactor = mix(mix(0.55, 0.05, washWet), 0.75, washFoam);","#include <normal_fragment_maps>":"{ vec2 buv = vWuv * 26.0; float e = 0.01; float b0 = texture2D(tN, buv).g, bx = texture2D(tN, buv + vec2(e, 0.0)).g, bz = texture2D(tN, buv + vec2(0.0, e)).g; normal = normalize(normal + (viewMatrix * vec4(vec3(b0 - bx, 0.0, b0 - bz) * 5.0 * washFoam, 0.0)).xyz); }","#include <opaque_fragment>":`diffuseColor.a = clamp(diffuseColor.a + dot(totalSpecular, vec3(0.35)) * step(0.02, washWet) * (1.0 - washFoam), 0.0, 1.0);
          #include <opaque_fragment>`}}),this.mesh=new it(r,this.mat),this.mesh.renderOrder=7;let u=we(n);for(let h=0;h<9;h++){let p=u()*6.28,d=Math.sqrt(u())*e*.7;this.paint(Math.cos(p)*d,Math.sin(p)*d,e*(.14+u()*.2),{dirt:.9},!1)}this.flush()}paint(t,e,n,{dirt:s=0,foam:r=0,wet:o=0},a=!0){let l=(t/(2*this.R)+.5)*Ne,c=(e/(2*this.R)+.5)*Ne,u=n/(2*this.R)*Ne,h=Math.ceil(u);for(let p=Math.max(0,Math.floor(c-h));p<=Math.min(Ne-1,Math.ceil(c+h));p++)for(let d=Math.max(0,Math.floor(l-h));d<=Math.min(Ne-1,Math.ceil(l+h));d++){let g=Math.hypot(d-l,p-c)/u;if(g>=1)continue;let v=1-g*g,m=p*Ne+d;this.dirt[m]=Dt(this.dirt[m]+s*v),this.foam[m]=Dt(this.foam[m]+r*v),this.wet[m]=Dt(this.wet[m]+o*v)}a&&this.flush()}flush(){let t=this.data;for(let e=0;e<Ne*Ne;e++)t[e*4]=this.dirt[e]*255,t[e*4+1]=this.foam[e]*255,t[e*4+2]=this.wet[e]*255,t[e*4+3]=255;this.tex.needsUpdate=!0}stats(){let t=0,e=0,n=0,s=0;for(let r=0;r<Ne;r++)for(let o=0;o<Ne;o++){if(Math.hypot(o-Ne/2,r-Ne/2)>Ne*.46)continue;let a=r*Ne+o;t+=this.dirt[a],e+=this.foam[a],n+=this.wet[a],s++}return{dirt:t/s,foam:e/s,wet:n/s}}rinse(t){for(let e=Ne-1;e>=0;e--)for(let n=0;n<Ne;n++){let s=e*Ne+n,r=e>0?this.foam[s-Ne]:0;this.foam[s]=Dt(Ot(this.foam[s],r,Math.min(1,t*5))-t*.38),this.dirt[s]=Dt(this.dirt[s]-t*1.2),this.wet[s]=Dt(this.wet[s]+t*2.5)}this.flush()}dispose(){this.mesh.geometry.dispose(),this.mat.dispose(),this.tex.dispose()}};function Cf(i){let t=i.world,e=i.x,n=i.stove,s=i.cook,r=i.audio,o=i.input,a=i.fx,l=t.papa,c=t.mama,u={},h=(S,P,F)=>new U(S,P,F),p=new it(new sn(.0055,.0075,1,12,8,!0),new Ge({color:15398655,roughness:.04,transparent:!0,opacity:.42,clearcoat:1,clearcoatRoughness:.03,depthWrite:!1}));p.geometry.translate(0,-.5,0),p.visible=!1,p.renderOrder=9,i.scene.add(p);let d=0,g=!1,v=.2,m=[[5e-4,.0088],[.06,.0088],[.084,.0102],[.1,.0162],[.1255,.0242]],f=[[5e-4,Oe.floorY],[Oe.rb-.016,.0047],[Oe.rb-.005,.0062],[Oe.rb+.003,.011],[Oe.rb+.013,.025],[Oe.rt-.004,Oe.h-.003]];u.tickC=(S,P)=>{if(d+=((g?1:0)-d)*Math.min(1,S*7),p.visible=d>.02,p.visible){let F=i.room.tapMouth;if(p.position.copy(F),p.scale.set(d*(1+.06*Math.sin(P*40)),v,d*(1+.06*Math.cos(P*33))),Math.random()<S*40*d){let D=F.clone();D.y-=v,a.dots.spawn({x:D.x,y:D.y+.004,z:D.z,vx:(Math.random()-.5)*.5,vy:.25+Math.random()*.4,vz:(Math.random()-.5)*.5+.1,size:.004+Math.random()*.004,life:.3,alpha:.5,gy:-4,r:.85,g:.95,b:1,fadeIn:.05})}}r.setWater(d)};let x=null;e.dirtyPlate=()=>{let S=t.pickPlate();return x&&x.owner===S&&x.mesh.parent===S||(x=new Wl(m,Ln.r,i.meal.seed+3,15769632),x.owner=S,S.add(x.mesh)),x},e.cleanPlateSurf=()=>{x&&(x.mesh.parent&&x.mesh.parent.remove(x.mesh),x.dispose(),x=null)},u.wash=async S=>{i.step="wash";let P=i.cam,F=t.pickPlate(),D=t.pickPan();g=!1,d=0;let H={p:h(q.sink.x-.03,q.counterY-.045,q.sink.z-.015),r:new De(.66,0,0)};F.visible=!0,P.name==="table"?(e.mamaTo(2.2,-.75,-.9),P.to("sink",2.4,S),await e.fly(S,F,H.p,{dur:2.4,lift:.35,rot:H.r})):(P.set("sink"),F.position.copy(H.p),F.rotation.copy(H.r)),r.clink(.5);let B=i.room.tapLever,z=()=>B.getWorldPosition(h()).add(h(.02,.02,.05)),Z=new it(new ne(.06,10,8),new Me({visible:!1}));B.add(Z),Z.position.set(.02,.01,.04);let W=gt=>{g=gt,r.knobClick(.8),S.tween(.2,j=>{B.rotation.x=Ot(B.rotation.x,gt?-.55:0,j)})},tt=t.sponge,k=t.cloth,ut=tt.position.clone(),pt=tt.rotation.clone(),Tt=k.position.clone(),dt=k.rotation.clone(),Pt=async(gt,j,ft)=>{gt.add(j.mesh);let $=()=>h(0,1,0).applyQuaternion(gt.quaternion),et=new Fn,lt=h(),Ut=A=>(et.setFromNormalAndCoplanarPoint($(),gt.localToWorld(h(0,.012,0))),o.ray.ray.intersectPlane(et,A)),wt=new it(new sn(j.R+.03,j.R+.03,.03,20),new Me({visible:!1}));wt.position.y=.012,gt.add(wt);let Zt=()=>gt.localToWorld(h(0,.015,0));i.step="wash-sponge-"+ft;let Kt=tt,se=null,X=0,fe=null,ee=0,qt="sponge",xt=o.add({name:"scrub",group:"wash",obj:[wt,tt,k],magnet:160,center:()=>se?Zt():Kt.position.clone().add(h(0,.02,0)),enabled:()=>qt==="sponge"||qt==="cloth",onDown:A=>{Ut(lt)?se=lt.clone():se=Zt()},onMove:A=>{if(!Ut(lt))return;let J=gt.worldToLocal(lt.clone()),mt=Math.hypot(J.x,J.z),ht=j.R*.95;mt>ht&&(J.x*=ht/mt,J.z*=ht/mt),J.y=.02,se=gt.localToWorld(J.clone());let Mt=fe?Math.hypot(J.x-fe.x,J.z-fe.z):0;fe=J.clone(),X=Math.min(1,X+Mt*14);let yt=j.R*(ft==="pan"?.62:.5);if(qt==="sponge"){if(j.paint(J.x,J.z,yt,{dirt:-.35,foam:.42}),Math.random()<Mt*30){r.bubble();let rt=gt.localToWorld(h(J.x,.03,J.z));a.dots.spawn({x:rt.x,y:rt.y,z:rt.z,vx:(Math.random()-.5)*.05,vy:.04+Math.random()*.06,vz:.02,size:.012+Math.random()*.014,life:1.2+Math.random(),alpha:.35,r:.9,g:.95,b:1,drag:.5})}}else j.paint(J.x,J.z,yt*1.1,{wet:-.6,foam:-.5}),ee+=Mt,ee>.12&&(ee=0,r.squeak());a.hint.poke()},onUp:()=>{fe=null}});e.hint({at:()=>tt.position.clone().add(h(0,.03,0)),to:Zt,size:.14});let Ue=A=>{X=Math.max(0,X-A*3),r.setScrub(qt==="sponge"?X:X*.5),se&&(Kt.position.lerp(se,Math.min(1,A*16)),Kt.quaternion.slerp(gt.quaternion,Math.min(1,A*10)))};await S.until(A=>{Ue(A);let J=j.stats();return J.dirt<(ft==="pan"?.12:.06)&&J.foam>.45}),qt="rinse",se=null,r.setScrub(0),a.hint.clear(),r.chime(0),e.fly(S,tt,ut,{dur:.5,lift:.08,rot:pt}),i.step="wash-rinse-"+ft,v=Math.max(.05,i.room.tapMouth.y-(gt.position.y+.035));let $t=o.add({name:"tap",group:"wash",obj:Z,magnet:90,priority:2,center:z,enabled:()=>qt==="rinse"||qt==="tapoff",onUp:()=>{qt==="rinse"&&!g?W(!0):qt==="tapoff"&&g&&W(!1)}});e.hint({at:z,size:.11}),await S.until(()=>g),a.hint.clear(),j.uni.uFlow.value=1;let Qt=0;await S.until(A=>{Qt+=A,j.uni.uTime.value+=A,j.rinse(A);let J=j.stats();return Qt>1.6&&J.foam<.02}),j.uni.uFlow.value=0,qt="tapoff",i.step="wash-tapoff-"+ft,e.hint({at:z,size:.11,glowDelay:.6,handDelay:3});let O=0;await S.until(A=>(O+=A,!g||O>9)),g&&W(!1),a.hint.clear(),o.remove($t),qt="cloth",Kt=k,i.step="wash-wipe-"+ft,e.hint({at:()=>k.position.clone().add(h(0,.03,0)),to:Zt,size:.16}),await S.until(A=>(Ue(A),j.stats().wet<(ft==="pan"?.22:.1))),qt="done",se=null,r.setScrub(0),a.hint.clear(),o.remove(xt);for(let A=0;A<Ne*Ne;A++)j.wet[A]=0,j.foam[A]=0,j.dirt[A]=0;j.flush(),e.fly(S,k,Tt,{dur:.5,lift:.08,rot:dt}),a.sparkles(Zt().add(h(0,.03,0)),12,.9,[1,1,.9]),r.sparkle(1),r.squeak(),await S.wait(.7),gt.remove(wt),gt.remove(j.mesh),j.dispose(),j===x&&(x=null)},te=e.dirtyPlate();await Pt(F,te,"plate"),i.step="wash-shelf-plate",P.to("shelf",1.3,S),e.hint({at:()=>F.position.clone().add(h(0,.03,0)),to:()=>t.shelfSpot.clone().add(h(0,.03,0)),size:.3,glowDelay:2,handDelay:5}),await e.carry(S,{name:"putPlate",obj:F,group:"wash",magnet:200,lift:0}),a.hint.clear(),await e.fly(S,F,t.shelfSpot.clone().add(h(0,.002,0)),{dur:.8,lift:.22,rot:new De(0,0,0)}),r.clink(1),a.sparkles(t.shelfSpot.clone().add(h(0,.05,.05)),6,.7),await S.wait(.4),i.step="wash-pan";for(let gt of s.eggs)gt.group.visible=!1;s.attach(null),s.onBurner=!1,n.main.hasPan=!1,P.to("sink",1.3,S);let Rt={p:h(q.sink.x-.03,q.counterY-.06,q.sink.z-.01),r:new De(.6,-.5,0,"YXZ")};await e.fly(S,D,Rt.p,{dur:1.2,lift:.3,rot:Rt.r}),r.clack(.6);let Ht=new Wl(f,Oe.rt,i.meal.seed+9,15253600);await Pt(D,Ht,"pan"),i.step="wash-hook-pan",P.to("shelf",1.3,S),e.hint({at:()=>D.position.clone().add(h(0,.03,0)),to:()=>t.hookSpot.clone(),size:.3,glowDelay:2,handDelay:5}),await e.carry(S,{name:"putPan",obj:D,group:"wash",magnet:200,lift:0}),a.hint.clear(),await e.fly(S,D,t.hookSpot,{dur:.9,lift:.15,rot:new De(Math.PI/2,0,-Math.PI/2)}),r.clack(.8),await S.tween(.8,gt=>{D.rotation.z=-Math.PI/2+Math.sin(gt*10)*.12*(1-gt)},jt.lin),B.remove(Z),a.sparkles(t.hookSpot.clone().add(h(0,0,.1)),8,.8),r.chime(4),c.lookAtWorld(i.cam.p),c.set({thumb:1}),c.handR(.2,1.22,.32),await S.wait(1),c.restArms()};let _=i.room.fridgeDoorZ+.002,y=q.fridge.x,w=t.album={group:new Lt,cards:[]};i.scene.add(w.group);let T=[];for(let S=0;S<4;S++)for(let P=0;P<3;P++)T.push([-.15+P*.185+S%2*.012,1.655-S*.165]);let M=1.6,E=[14169135,15909424,9411240,15765424].map(S=>new Ge({color:S,roughness:.3,clearcoat:.7,clearcoatRoughness:.15}));function N(S){let P=new Lt,F=E[S%4];if(S%4===0){let D=new it(new ne(.012,16,12),F);D.scale.set(1,1.15,.5),P.add(D);let H=new it(new Ii(.008,.006,6),new Se({color:5081646,roughness:.6}));H.position.y=.013,P.add(H)}else if(S%4===1){let D=new Wn;for(let B=0;B<10;B++){let z=B/10*Math.PI*2+Math.PI/2,Z=B%2?.0065:.014;B?D.lineTo(Math.cos(z)*Z,Math.sin(z)*Z):D.moveTo(Math.cos(z)*Z,Math.sin(z)*Z)}let H=new it(new gs(D,{depth:.004,bevelEnabled:!0,bevelSize:.0015,bevelThickness:.0015,bevelSegments:2}),F);P.add(H)}else if(S%4===2){let D=new it(new ne(.012,16,12),F);D.scale.z=.5,P.add(D);for(let H of[-1,1]){let B=new it(new Ii(.005,.009,4),F);B.position.set(H*.008,.011,0),B.scale.z=.5,P.add(B);let z=new it(new ne(.0015,6,6),V.eye);z.position.set(H*.004,.002,.006),P.add(z)}}else{for(let H=0;H<5;H++){let B=new it(new ne(.006,10,8),F),z=H/5*6.28;B.position.set(Math.cos(z)*.008,Math.sin(z)*.008,0),B.scale.z=.5,P.add(B)}let D=new it(new ne(.005,10,8),E[1]);D.scale.z=.6,D.position.z=.002,P.add(D)}return P.traverse(D=>{D.isMesh&&(D.castShadow=!0)}),P}function C(S){let P=new Lt,F=he(.092,.084,.0012,5e-4,new Se({color:16513782,roughness:.6}),1);F.castShadow=!0,P.add(F);let D=new fn;if(D.colorSpace=en,S){let B=new Image;B.onload=()=>{D.image=B,D.needsUpdate=!0},B.src=S}let H=new it(new He(.082,.0615),new Se({map:S?D:null,roughness:.35,color:S?16777215:15980960}));return H.position.set(0,.0065,8e-4),P.add(H),P.userData.pic=H,P.scale.setScalar(M),P}w.refresh=()=>{for(let S of w.cards)w.group.remove(S.g);w.cards=[],i.save.data.album.forEach((S,P)=>{let F=C(S.img);F.position.set(y+S.x,S.y,_),F.rotation.z=S.rot||0;let D=N(S.magnet||0);D.position.set(0,.036,.002),F.add(D),w.group.add(F),w.cards.push({g:F,ph:S})})};let L=new Lt;{let S=new Ge({color:16762910,roughness:.3,clearcoat:.8,emissive:16751104,emissiveIntensity:.15}),P=Re(.026,.026,.008,S,28);P.rotation.x=Math.PI/2,L.add(P);for(let D=0;D<10;D++){let H=he(.008,.016,.006,.002,S,1),B=D/10*6.28;H.position.set(Math.cos(B)*.038,Math.sin(B)*.038,0),H.rotation.z=B-Math.PI/2,L.add(H)}for(let D of[-1,1]){let H=new it(new ne(.0032,8,8),V.eye);H.position.set(D*.009,.005,.005),L.add(H)}let F=new it(new Je(.009,.0016,6,12,Math.PI*.8),V.mouth);F.rotation.z=Math.PI+.3,F.position.set(0,-.002,.005),L.add(F)}L.position.set(y+.2,.93,_+.004),L.traverse(S=>{S.isMesh&&(S.castShadow=!0)}),i.scene.add(L),t.sunMagnet=L,w.refresh();let b=new it(new ne(.07,8,8),new Me({visible:!1}));L.add(b);function R(S,P){let F=null,D=!1;S.until(()=>!1),o.add({name:"sun",group:"album",obj:b,magnet:60,priority:2,center:()=>L.position.clone(),enabled:()=>!D,onUp:async()=>{D=!0,r.chime(1),r.birds(),await e.pulse(S,L,.3,.4),await e.fade(S,1,.7),i.atHome=!1,i.meal=null,i.runScene("intro")}}),w.cards.forEach((H,B)=>{let z=H.g.position.clone(),Z=H.g.rotation.z;o.add({name:"photo"+B,group:"album",obj:H.g,magnet:30,center:()=>H.g.position.clone(),enabled:()=>!D,onUp:async()=>{if(!D){if(D=!0,r.paper(),F===H)await S.tween(.45,W=>{H.g.position.lerpVectors(H.g.position.clone(),z,W),H.g.rotation.z=Z*W,H.g.scale.setScalar(Ot(H.g.scale.x,M,W))}),F=null;else{if(F){let k=F;k.g.position.copy(k.home),k.g.scale.setScalar(M)}let W=i.cam.p.clone().lerp(i.cam.t,.42);W.y-=.01;let tt=H.g.position.clone();await S.tween(.5,k=>{H.g.position.lerpVectors(tt,W,k),H.g.rotation.z=Z*(1-k),H.g.scale.setScalar(Ot(M,3.4,k))},jt.out),F=H,H.home=z}D=!1}}})}),P&&e.hint({at:()=>L.position.clone(),size:.12,glowDelay:8,handDelay:16,repeat:14})}return u.homeView=S=>{i.step="home",w.refresh(),R(S,!1)},u.album=async S=>{i.step="album";let P=i.cam,F=i.meal;e.mamaTo(1.55,-.55,.35),c.lookAtWorld(h(2.4,1.2,-1.2)),P.name==="fridge"?P.set("fridge"):await P.to("fridge",2.2,S);let D=i.save.data;D.album.length>=12&&(D.album.shift(),w.refresh());let H=D.album.map(et=>[et.x,et.y]),B=T.find(et=>!H.some(lt=>Math.hypot(lt[0]-et[0],lt[1]-et[1])<.08))||T[D.album.length%12],z=e.temp(C(F.photo));i.scene.add(z);let Z=P.p.clone().lerp(P.t,.36);Z.y-=.035,z.position.copy(Z).add(h(0,-.25,0)),z.rotation.set(-.15,.08,.06),z.scale.setScalar(2.1),r.paper(),await S.tween(.7,et=>{z.position.lerpVectors(Z.clone().add(h(0,-.25,0)),Z,et)},jt.outBack),r.shutter(),i.step="album-photo";let W=null,tt=!1,k=null,ut=new it(new mn(.16,.15,.02),new Me({visible:!1}));z.add(ut),o.add({name:"photoNew",group:"album",obj:ut,magnet:220,priority:3,center:()=>z.position.clone(),onDown:()=>{tt=!0},onMove:et=>{if(et.moved<12)return;let lt=o.onPlaneZ(_+.05,h());lt&&(lt.x=Dt(lt.x,y-.17,y+.24),lt.y=Dt(lt.y,1.12,1.66),W=lt)},onUp:et=>{tt=!1,k={tap:et.tap||!W}}}),e.hint({at:()=>z.position.clone(),to:()=>h(y+B[0],B[1],_),size:.18}),await S.until(et=>(tt&&W&&(z.position.lerp(W,Math.min(1,et*12)),z.scale.setScalar(Ot(z.scale.x,M*1.1,Math.min(1,et*8))),z.rotation.x*=1-Math.min(1,et*8)),!!k)),a.hint.clear(),o.clear("album"),z.remove(ut);let pt=k.tap?h(y+B[0],B[1],_):h(W.x,W.y,_),Tt=(Math.random()-.5)*.16,dt=z.position.clone(),Pt=z.scale.x,te=z.rotation.clone();await S.tween(.55,et=>{z.position.lerpVectors(dt,pt,et),z.position.z+=Math.sin(et*Math.PI)*.06,z.scale.setScalar(Ot(Pt,M,et)),z.rotation.set(te.x*(1-et),te.y*(1-et),Ot(te.z,Tt,et))},jt.inOut),r.pat(),i.step="album-magnet";let Rt=[0,1,2,3],Ht=-1,gt=Rt.map((et,lt)=>{let Ut=e.temp(N(et));Ut.scale.setScalar(2.2);let wt=P.p.clone().lerp(P.t,.4);wt.x+=(lt-1.5)*.058,wt.y-=.105,Ut.position.copy(wt).add(h(0,-.15,0)),i.scene.add(Ut),S.wait(lt*.08).then(()=>S.tween(.45,Kt=>{Ut.position.lerpVectors(wt.clone().add(h(0,-.15,0)),wt,Kt)},jt.outBack));let Zt=new it(new ne(.014,8,8),new Me({visible:!1}));return Ut.add(Zt),o.add({name:"magnet"+lt,group:"album",obj:Zt,magnet:34,priority:3,center:()=>Ut.position.clone(),enabled:()=>Ht<0,onUp:()=>{Ht<0&&(Ht=lt)}}),Ut});e.hint({at:()=>gt[1].position.clone(),size:.07,glowDelay:3,handDelay:6}),await S.until(()=>Ht>=0),a.hint.clear(),o.clear("album");let j=gt[Ht],ft=pt.clone().add(h(0,.036*M,.004));gt.forEach((et,lt)=>{if(lt!==Ht){let Ut=et.position.clone();S.tween(.4,wt=>{et.position.y=Ut.y-.2*wt},jt.in).then(()=>e.untemp(et))}});let $=j.position.clone();await S.tween(.5,et=>{j.position.lerpVectors($,ft,et),j.position.z+=Math.sin(et*Math.PI)*.04,j.scale.setScalar(Ot(2.2,M,et))},jt.inOut),r.magnet(),a.sparkles(ft.clone().add(h(0,0,.03)),12,.7),r.sparkle(1),e.untemp(j),e.untemp(z),D.album.push({img:F.photo,x:pt.x-y,y:pt.y,rot:Tt,magnet:Rt[Ht]}),D.plays=(D.plays||0)+1,D.scene="done",i.save.write(),w.refresh(),c.lookAtWorld(P.p),c.set({smile:1.3,thumb:1}),c.handR(.2,1.22,.32),r.clap(),await S.wait(1.6),c.restArms(),r.jingle(),await S.wait(1)},u.done=async S=>{i.step="done",i.cam.name!=="fridge"&&i.cam.set("fridge"),w.refresh(),R(S,!0),await S.until(()=>!1)},u}var Co=["intro","curtains","pan","butter","egg","stove","toast","plate","serve","wash","album","done"],Xl="fable-r13-egg-save-v1";function Zv(){let i={ok:!0,data:null},t=()=>({v:1,scene:"intro",plays:0,album:[],meal:null,muted:!1});try{if(new URLSearchParams(location.search).has("reset")){window.localStorage.removeItem(Xl);try{history.replaceState(null,"",location.pathname)}catch{}}let e=window.localStorage.getItem(Xl);i.data=e?JSON.parse(e):t(),(!i.data||i.data.v!==1)&&(i.data=t())}catch{i.ok=!1,i.data=t()}return i.write=()=>{if(!i.ok)return!1;try{return window.localStorage.setItem(Xl,JSON.stringify(i.data)),!0}catch{try{return i.data.album=i.data.album.slice(-4),window.localStorage.setItem(Xl,JSON.stringify(i.data)),!0}catch{return i.ok=!1,!1}}},i.reset=()=>{i.data=t(),i.write()},i}function Pf(i){let t=i.save.data.plays,e=Date.now()%1e5+t*7919,n=we(e),s=i.params.get("twin"),r=n()<.3?Math.floor(n()*3):-1;t%3===1&&(r=1),s!=null&&(r=Number(s));let o=["strawberry","broccoli","sausage"],a=o[Math.floor(n()*o.length)];return{seed:e,twinAt:r,pan:-1,butter:!1,eggs:[],crisp:0,film:0,toast:0,plate:-1,plated:!1,sides:[],sideKinds:["tomato","lettuce",a],photo:null,gagSeed:Math.floor(n()*1e3),plateSet:[0,1,2+Math.floor(n()*2)]}}function If(i){let t=i.scene;i.save=Zv(),i.audio=wf(),i.input=Ef(i),i.fx=Tf(i),i.stove=ef(i),i.cook=bf(i);let e=i.world={},n=i.x={},s=e.papa=sf();t.add(s.root),t.add(s.shadowProxy);let r=e.mama=rf();t.add(r.root);let o=xr(.6,.5,.3);t.add(o),e.papaShadow=o;let a=xr(.6,.6,.32);t.add(a),e.mamaShadow=a,e.panRest=new U(q.hob.x+i.stove.main.pos.x,i.stove.panRestY(i.stove.main),q.hob.z+i.stove.main.pos.z),e.kettle=lf(),e.kettle.position.set(q.hob.x+i.stove.small.pos.x,i.stove.panRestY(i.stove.small),q.hob.z+i.stove.small.pos.z),e.kettle.rotation.y=2.3,t.add(e.kettle),e.pans=[0,1,2].map(b=>{let R=of(b);return i.room.drawer.add(R),R}),e.lid=af(),t.add(e.lid),e.lidRest={p:new U(.615,q.counterY+.128,q.roomZ0+.045),r:new De(Math.PI/2-.16,0,0)},e.eggBowl=new Lt,e.eggBowl.position.set(.29,q.counterY,-1.705),t.add(e.eggBowl),e.eggBowl.add(Eh(.085,.052,V.ceramicBlue)),e.shellEggs=[],[[-.028,.03,.022,.5],[.032,.03,.018,-.4],[.002,.03,-.034,1.4],[.004,.056,.006,2.2]].forEach((b,R)=>{let S=vf(R+1);S.home=new U(b[0],b[1],b[2]),S.homeRot=b[3],e.eggBowl.add(S.group),e.shellEggs.push(S)}),e.shellBowl=Eh(.05,.034,V.ceramic),e.shellBowl.position.set(.315,q.counterY,-1.335),t.add(e.shellBowl),e.butterDish=hf(),e.butterDish.position.set(.285,q.counterY,-1.51),e.butterDish.rotation.y=.12,t.add(e.butterDish),e.crock=mf(),e.crock.position.set(1.2,q.counterY,-1.76),t.add(e.crock),e.toaster=uf(),e.toaster.position.copy(q.toaster),e.toaster.rotation.y=-.22,t.add(e.toaster),e.breadBoard=he(.24,.016,.17,.006,V.board,2),e.breadBoard.position.set(-.1,q.counterY+.008,-1.385),e.breadBoard.rotation.y=.1,e.breadBoard.castShadow=e.breadBoard.receiveShadow=!0,t.add(e.breadBoard),e.bread=[Ah(),Ah()],e.bread.forEach(b=>t.add(b)),e.plates=[0,1,2,3].map(b=>{let R=zl(b);return R.visible=!1,t.add(R),R}),e.sideBoard=he(.5,.016,.16,.006,V.board,2),e.sideBoard.castShadow=e.sideBoard.receiveShadow=!0,e.sideBoard.position.set(.16,q.counterY+.008,-1.745),t.add(e.sideBoard),e.sideItems=[],e.spatula=ff(),t.add(e.spatula),e.plateSpot=new U(.17,q.counterY,-1.44);let c=q.table.y,u=new it(new He(.42,.3),V.placemat);u.rotation.x=-Math.PI/2,u.position.set(q.papa.x,c+.0015,-.98),u.receiveShadow=!0,t.add(u);let h=u.clone();h.position.set(-1.02,c+.0015,-.52),h.rotation.z=0,t.add(h);let p=u.clone();p.position.set(-1.68,c+.0015,-.52),t.add(p),e.emptyPlates=[];for(let[b,R,S]of[[q.papa.x,-.98,0],[-1.02,-.52,0],[-1.68,-.52,0]]){let P=zl(S);P.position.set(b,c+.002,R),t.add(P),e.emptyPlates.push(P)}e.mug=Th(V.ceramicYellow),e.mug.position.set(q.papa.x+.27,c,-1.02),e.mug.rotation.y=.8,t.add(e.mug),e.vase=gf(),e.vase.position.set(-1.84,c,-.92),t.add(e.vase);let d=cf();d.position.set(-.86,c,-.66),t.add(d),e.fork=new Lt;{let b=he(.012,.004,.11,.002,V.steelPolished,1);b.position.z=.02,e.fork.add(b);for(let S=-1;S<=1;S++){let P=he(.003,.003,.05,.001,V.steelPolished,1);P.position.set(S*.006,0,-.06),e.fork.add(P)}let R=he(.02,.004,.02,.002,V.steelPolished,1);R.position.z=-.035,e.fork.add(R)}e.fork.position.set(q.papa.x+.17,c+.004,-.98),t.add(e.fork),e.sponge=pf(),t.add(e.sponge),e.cloth=Ch(.2,.16),t.add(e.cloth),e.dryMat=Ch(.27,.3),e.dryMat.material=V.linen,e.dryMat.position.set(1.2,q.counterY+.001,-1.47),t.add(e.dryMat);let g=new Lt;{let b=Fe([[0,0],[.028,0],[.03,.01],[.03,.09],[.012,.11],[.012,.125],[0,.125]],new Ge({color:9425290,roughness:.25,transparent:!0,opacity:.85}),24);g.add(b);let R=Re(.01,.012,.03,V.plasticWhite,12);R.position.y=.138,g.add(R)}g.position.set(1.97,q.counterY,-1.74),t.add(g);for(let b=0;b<3;b++){let R=zl(0);R.position.set(1.88,i.room.shelfY+b*.012,i.room.shelfZ),t.add(R)}for(let b=0;b<2;b++){let R=Th(b?V.ceramicBlue:V.ceramic);R.position.set(1.28+b*.1,i.room.shelfY,i.room.shelfZ+.01*b),R.rotation.y=1+b,t.add(R)}e.shelfSpot=new U(1.6,i.room.shelfY,i.room.shelfZ),e.hookSpot=new U(1.52,1.17,q.roomZ0+.05);let v=new U;n.reparent=(b,R)=>{R.attach(b)};let m=new Set;n.temp=b=>(m.add(b),b),n.untemp=b=>{m.delete(b),b.parent&&b.parent.remove(b)},n.tempCount=()=>[...m].filter(b=>b.parent).length,n.clearTemps=()=>{for(let b of m)b.parent&&b.parent.remove(b);m.clear()},n.fly=(b,R,S,{dur:P=.7,lift:F=.12,rot:D=null,e:H=jt.inOut}={})=>{let B=R.position.clone(),z=R.quaternion.clone(),Z=D?new dn().setFromEuler(D):null;return b.tween(P,W=>{Hd(R.position,B,S,W,F),Z&&R.quaternion.slerpQuaternions(z,Z,W)},H)},n.pulse=(b,R,S=.08,P=.3)=>{let F=R.scale.clone();return b.tween(P,D=>{let H=1+Math.sin(D*Math.PI)*S;R.scale.copy(F).multiplyScalar(H)},jt.lin)},n.carry=(b,{name:R,obj:S,hit:P,target:F,enabled:D,lift:H=.07,onGrab:B,onRelease:z,group:Z,magnet:W=70,priority:tt=0,center:k})=>new Promise(ut=>{let pt=!1,Tt=!1,dt=0,Pt=new U,te=i.input.add({name:R,group:Z,obj:P||S,magnet:W,priority:tt,center:k||(()=>S.getWorldPosition(new U)),enabled:()=>!Tt&&(!D||D()),onDown:()=>{pt=!0,dt=S.position.y,Pt.copy(S.position),B&&B(),i.audio.soft(.6)},onMove:Rt=>{let Ht=i.input.onPlaneY(dt+H,v);Ht&&Rt.moved>10&&Pt.copy(Ht)},onUp:Rt=>{Tt||(Tt=!0,pt=!1,i.input.remove(te),ut({tap:Rt.tap,pos:Pt.clone()}),z&&z(Rt))}});b.until(Rt=>Tt?!0:(pt&&(S.position.x+=(Pt.x-S.position.x)*Math.min(1,Rt*14),S.position.z+=(Pt.z-S.position.z)*Math.min(1,Rt*14),S.position.y+=(dt+H-S.position.y)*Math.min(1,Rt*12)),!1))}),n.glanceMama=async(b,R,S=1.2)=>{let P=i.cam,F=P.p.clone(),D=P.t.clone(),H=P.fov,B=r.head.getWorldPosition(new U),z=F.clone().lerp(B,.06);z.y=Ot(F.y,B.y,.3);let Z=B.clone();Z.y-=.12,i.input.locked=!0,P.mixK=0,await b.tween(.85,W=>{P.p.lerpVectors(F,z,W),P.t.lerpVectors(D,Z,W),P.fov=Ot(H,40,W)}),R&&R(),await b.wait(S),await b.tween(.85,W=>{P.p.lerpVectors(z,F,W),P.t.lerpVectors(Z,D,W),P.fov=Ot(40,H,W)}),i.input.locked=!1},n.fade=(b,R,S=.6)=>{let P=document.getElementById("fade"),F=Number(P.style.opacity)||0;return b.tween(S,D=>{P.style.opacity=Ot(F,R,D).toFixed(3)},jt.lin)},n.hint=b=>i.fx.hint.set(b),n.mamaTo=(b,R,S)=>{r.root.position.set(b,0,R),r.root.rotation.y=S,a.position.set(b,.004,R)};let f=b=>Co.indexOf(b);e.pickPan=()=>i.meal.pan>=0?e.pans[i.meal.pan]:null,e.pickPlate=()=>i.meal.plate>=0?e.plates[i.meal.plate]:null,e.setCurtains=b=>{for(let R of i.room.curtains)R.open=R.target=b,R.done=b>.5,R.setEmissive(.95*(1-b));i.setDaylight(.1+.9*b),s.proxyOn=b>.5?1:0},e.buildSides=()=>{for(let F of e.sideItems)F.obj.parent&&F.obj.parent.remove(F.obj);e.sideItems=[];let b=i.meal.sideKinds,R=[],S=(F,D,H,B=0)=>{let z=df[F](e.sideItems.length+1),Z={type:F,obj:z,home:new U(e.sideBoard.position.x+D,q.counterY+.016,e.sideBoard.position.z+H),placed:!1,homeRot:B};return z.position.copy(Z.home),z.rotation.y=B,z.userData.tilt&&(z.rotation.z=z.userData.tilt),t.add(z),e.sideItems.push(Z),Z};S("tomato",-.205,.02),S("tomato",-.165,-.025),S("tomato",-.13,.03),S("lettuce",-.06,0,.3),S("lettuce",-.05,-.01,-.5).obj.position.y+=.006;let P=b[2];P==="strawberry"?(S(P,.025,.03,.4),S(P,.055,-.02,2),S(P,-.005,-.03,1.2)):P==="broccoli"?(S(P,.02,.02),S(P,.06,-.015,1)):(S(P,.03,.025,.3),S(P,.035,-.02,-.2)),e.sideItems[4].home.y+=.006},e.placeSideOnPlate=(b,R,S)=>{let P=e.pickPlate();P.add(b.obj);let F=i.cook.eggs.some(D=>D.group.parent===P&&Math.hypot(D.group.position.x-R,D.group.position.z-S)<.045);b.obj.position.set(R,Ln.wellY+(F?.004:0)+(Math.hypot(R,S)>.085?.006:0),S),b.placed=!0},e.eggPlateSpots=b=>b===1?[[.02,.012]]:b===2?[[-.036,.022],[.042,-.012]]:[[-.04,.03],[.045,.02],[0,-.042]],e.toastPlateSpots=[[-.046,-.08,.16],[.052,-.086,-.14]],e.toastOnPlate=(b,R)=>{let S=e.toastPlateSpots[R];b.position.set(S[0],Ln.wellY+.044,S[1]),b.rotation.set(-.62,S[2],0,"YXZ")},e.setup=b=>{let R=f(b),S=i.meal,P=i.room;i.input.locked=!1,i.cam.mix=null,i.cam.mixK=0,document.getElementById("fade").style.opacity=0,document.getElementById("fade").style.background="#1c1510",n.clearTemps(),e.setCurtains(R>f("curtains")?1:0),P.drawer.position.z=0;for(let W of i.stove.burners)W.value=0,W.target=0,W.lit=!1,W.level=0,W.thermal=0,W.igniteT=-1,W.held=!1,W.hasPan=!1;i.stove.small.hasPan=!0,e.pans.forEach((W,tt)=>{P.drawer.add(W),W.position.set(-.27+tt*.27,P.drawerFloorY+.001,q.counterZ1-.27),W.rotation.set(0,-Math.PI/2+.55,0),W.visible=!0});let F=i.cook;F.reset(),F.attach(null),F.onBurner=!1;let D=e.pickPan();D&&R>f("pan")&&(t.add(D),D.rotation.set(0,-.62,0),R<=f("serve")?(D.position.copy(e.panRest),F.onBurner=!0,i.stove.main.hasPan=!0):R===f("wash")?D.position.copy(e.panRest):(D.position.copy(e.hookSpot),D.rotation.set(Math.PI/2,0,-Math.PI/2)),F.attach(D),S.butter&&R<=f("serve")&&F.addButter(R>f("stove"))),e.lid.position.copy(e.lidRest.p),e.lid.rotation.copy(e.lidRest.r),e.lid.userData.glass.opacity=.2,e.lid.userData.glass.roughness=.04;let H=S.eggs.length;e.shellEggs.forEach((W,tt)=>{e.eggBowl.add(W.group),W.group.position.copy(W.home),W.group.rotation.set(0,0,0),W.tilt.rotation.set(Math.PI/2-.25,W.homeRot,0),W.setStage(0),W.setOpen(0),W.group.visible=tt>=H||tt===3,W.group.scale.setScalar(1)});let B=R>=f("pan")&&R<=f("stove");e.eggBowl.visible=R<=f("stove"),e.butterDish.visible=R<=f("stove"),e.shellBowl.visible=R<=f("stove"),e.butterDish.userData.pats.forEach((W,tt)=>{W.visible=!(S.butter&&tt===0)});let z=e.pickPlate();if(e.plates.forEach(W=>{W.visible=!1,t.add(W),W.rotation.set(0,0,0),W.scale.setScalar(1)}),D&&R>f("pan")&&S.eggs.forEach(W=>{let tt=F.addEgg(W,R>f("stove")?"cooked":"rawspread");R>f("stove")&&(tt.crisp=S.crisp,tt.film=S.film),tt.update(0,0)}),z&&R>f("plate")){z.visible=!0;let W=e.eggPlateSpots(F.eggs.length);F.eggs.forEach((tt,k)=>{z.add(tt.group),tt.group.position.set(W[k][0],Ln.wellY+6e-4+k*5e-4,W[k][1]),tt.group.visible=R<=f("serve")}),R<=f("serve")?z.position.set(-1.33,c+.003,-.46):R===f("wash")?z.position.set(q.sink.x,q.counterY-.1,q.sink.z):z.position.copy(e.shelfSpot)}let Z=e.toaster.userData;Z.lever.position.y=Z.leverUpY,Z.coilMat.emissiveIntensity=0,e.bread.forEach((W,tt)=>{if(W.userData.uni.uToast.value=R>f("toast")&&tt<S.toast?1:0,W.userData.uni.uBites.value.forEach(k=>k.set(9,9,0)),W.visible=!0,t.add(W),W.scale.setScalar(1),R>f("toast")&&tt<S.toast)if(R===f("plate"))e.toaster.add(W),W.position.set(-.012+tt*.01,Z.topY+.012,Z.slotZ[tt]),W.rotation.set(0,0,0,"XYZ");else if(R===f("serve")&&z&&S.sides.some(k=>k.type==="toast"&&k.idx===tt)){let k=S.sides.find(ut=>ut.type==="toast"&&ut.idx===tt);z.add(W),e.toastOnPlate(W,tt)}else W.visible=!1;else W.position.set(e.breadBoard.position.x-.03+tt*.035,q.counterY+.016+.009+tt*.0175,e.breadBoard.position.z+.005*tt),W.rotation.set(-Math.PI/2,0,.2+tt*.5,"XYZ"),W.visible=R<=f("toast")||tt>=S.toast}),e.buildSides(),e.sideBoard.visible=R>=f("plate")&&R<=f("serve"),e.sideItems.forEach(W=>{W.obj.visible=e.sideBoard.visible}),R>f("plate")&&z&&S.sides.filter(W=>W.type!=="toast").forEach(W=>{let tt=e.sideItems.find(k=>!k.placed&&k.type===W.type);tt&&(e.placeSideOnPlate(tt,W.x,W.z),tt.obj.visible=R<=f("serve"))}),e.spatula.visible=R===f("plate"),e.spatula.position.set(.43,q.counterY+.002,-1.36),e.spatula.rotation.set(0,-.5,0),e.emptyPlates[0].visible=R<f("serve"),e.fork.position.set(q.papa.x+.17,c+.004,-.98),e.fork.rotation.set(0,.1,0),t.add(e.fork),e.sponge.position.set(q.sink.x-.16,q.counterY+.002,q.sink.z+.265),e.sponge.rotation.set(0,.3,0),e.sponge.visible=!0,e.cloth.position.set(q.sink.x+.13,q.counterY+.002,q.sink.z+.27),e.cloth.rotation.set(0,-.2,0),e.cloth.visible=!0,P.tapLever.rotation.x=0,s.root.position.copy(q.papa),s.root.rotation.y=0,s.seated=!0,o.position.set(q.papa.x,.004,q.papa.z),s.p.hairSplit.target=S.eggs.some(W=>W.twin)&&R>f("egg")?1:0,s.p.hairFlat.target=0,s.p.hairLean.target=R>f("toast")?-1:1,R<=f("serve")?n.papaDoze(!0):n.papaAwake(!0),R<=f("curtains")?n.mamaTo(1.22,-.98,-.9):R<=f("plate")?n.mamaTo(1.62,-.72,-.85):R===f("serve")?n.mamaTo(-.52,-1.46,.5):R===f("wash")?n.mamaTo(2.2,-.75,-.9):n.mamaTo(1.55,-.55,.35),r.restArms(),r.set({yaw:0,pitch:0,roll:0,lean:0,smile:1,eye:1,mouthOpen:0}),r.snap(),s.snap(),e.album&&e.album.refresh(),n.cleanPlateSurf&&n.cleanPlateSurf()},n.papaDoze=b=>{s.arcMode="sleep",s.chew=0,s.set({eye:0,roll:.22,pitch:.16,yaw:-.1,lean:.1,leanSide:.05,smile:.25,mouthOpen:0,brow:0,sparkle:0,thumb:0,bob:0}),s.handL(-.14,1.06,.13).handR(.2,.755,.34),s.pole[-1].set(-.85,-.5,.35),s.dozing=!0,b&&s.snap()},n.papaAwake=b=>{s.arcMode="happy",s.dozing=!1,s.set({eye:1,roll:0,pitch:0,yaw:0,lean:0,leanSide:0,smile:1,mouthOpen:0,brow:.2}),s.restArms(),s.pole[-1].set(-.5,-.8,-.35),b&&s.snap()};let x=Object.assign({},Rf(i),Af(i),Cf(i));i.sceneName="",i.sc=new Qi,i.completed=[],i.runScene=async b=>{i.sc&&i.sc.kill();let R=i.sc=new Qi;if(i.sceneName=b,i.input.clear(),i.fx.hint.clear(),i.audio.setCloth(0),i.audio.setWater(0),i.audio.setScrub(0),(b==="intro"||!i.meal)&&(i.meal=Pf(i),i.save.data.meal=i.meal),i.save.data.scene=b,i.save.write(),e.setup(b),await x[b](R),R.dead)return;i.completed.push(b);let S=Co[Co.indexOf(b)+1];S&&i.runScene(S)},i.atHome=!1,i.goHome=async()=>{if(i.atHome){i.atHome=!1;let R=i.sceneName==="done"?"done":i.sceneName;await n.fade(i.scope,1,.35),i.runScene(R);return}if(i.sceneName==="intro")return;i.atHome=!0,i.sc&&i.sc.kill();let b=i.sc=new Qi;i.input.clear(),i.fx.hint.clear(),i.input.locked=!1,n.clearTemps();for(let R of i.stove.burners)i.stove.forceOff(R);i.audio.setWater(0),i.audio.setScrub(0),i.audio.setCloth(0),await n.fade(b,1,.35),i.cam.mix=null,i.cam.set("fridge"),n.mamaTo(1.55,-.55,.35),await n.fade(b,0,.35),x.homeView(b)};let _=document.getElementById("b-home"),y=document.getElementById("b-sound"),w=document.getElementById("b-full"),T=!1,M=()=>{try{let b=document,R=b.documentElement,S=R.requestFullscreen||R.webkitRequestFullscreen;if(S&&!(b.fullscreenElement||b.webkitFullscreenElement)){let P=S.call(R);P&&P.catch&&P.catch(()=>{})}}catch{}},E=()=>{i.audio.start(),T||(T=!0,!navigator.webdriver&&!i.params.has("nofs")&&M())};i.input.onAny=E;for(let b of[_,y,w])b.addEventListener("pointerdown",R=>{R.stopPropagation(),i.audio.start()});for(let b of["pointerup","click","touchend"])document.addEventListener(b,()=>{i.audio.started&&i.audio.start()},{passive:!0});_.addEventListener("click",()=>i.goHome()),y.addEventListener("click",()=>{let b=!i.audio.muted;i.audio.setMuted(b),y.classList.toggle("off",b),i.save.data.muted=b,i.save.write()}),w.addEventListener("click",()=>{try{let b=document;if(b.fullscreenElement||b.webkitFullscreenElement)(b.exitFullscreen||b.webkitExitFullscreen).call(b);else{let R=b.documentElement,S=R.requestFullscreen||R.webkitRequestFullscreen;if(S){let P=S.call(R);P&&P.catch&&P.catch(()=>{})}}}catch{}}),i.save.data.muted&&(i.audio.setMuted(!0),y.classList.add("off")),i.update=b=>{let R=i.time;i.sc&&i.sc.update(b),i.room.update(b,R),i.stove.update(b,R),i.cook.update(b,R),s.update(b),r.update(b),s.updateProxy(),s.dozing&&(s.p.pitch.target=.16+.05*Math.sin(R*.9),s.p.bob.target=.004*Math.sin(R*.9));let S=e.lid.userData.glass;S.opacity=Ot(.2,.62,i.cook.fog),S.roughness=Ot(.04,.55,i.cook.fog),x.tickA(b,R),x.tickC(b,R),i.fx.update(b,R)};let N=i.save.data,C=i.params.get("scene");i.meal=N.meal;let L=N.scene&&Co.includes(N.scene)&&N.meal?N.scene:"intro";if(L==="done"&&(L="intro"),C){L=C,(!i.meal||i.params.has("fresh"))&&(i.meal=Pf(i));let b=i.meal,R=Co.indexOf(C);if(R>f("pan")&&b.pan<0&&(b.pan=0),R>f("butter")&&(b.butter=!0),R>f("egg")&&!b.eggs.length){let S=Number(i.params.get("eggs")||2);for(let P=0;P<S;P++)b.eggs.push({seed:b.seed+P*17,twin:P===b.twinAt})}R>f("stove")&&(b.crisp=Number(i.params.get("crisp")??.5)),R>f("toast")&&!b.toast&&(b.toast=2),R>f("plate")&&b.plate<0&&(b.plate=1,b.sides=[{type:"tomato",x:-.078,z:.058},{type:"tomato",x:.082,z:.055},{type:"lettuce",x:-.09,z:-.02},{type:"toast",idx:0,x:-.046,z:-.08}]),i.save.data.meal=b}if(i.resumed=L!=="intro",i.runScene(L),C){let b=R=>i.params.has(R)?Number(i.params.get(R)):null;i.scope.wait(.12).then(()=>{if(b("cook")!=null)for(let R of i.cook.eggs)R.cook=b("cook"),R.crisp=b("crisp")??.3,R.film=b("film")??0;b("knob")!=null&&(i.stove.setKnob(i.stove.main,b("knob")),b("knob")>.1&&(i.stove.main.lit=!0,i.stove.main.igniteT=-1,i.stove.main.level=i.stove.main.target,i.stove.main.thermal=i.stove.main.target)),i.params.get("cam")&&(i.cam.set(i.params.get("cam")),i.cam.name="x"),b("lid")&&(e.lid.position.copy(e.panRest).add(new U(0,Oe.h+.001,0)),e.lid.rotation.set(0,0,0),i.cook.lidOn=!0),b("melt")!=null&&(i.cook.melt=b("melt")),b("freeze")&&(i.sc.kill(),i.fx.hint.clear(),i.input.locked=!0)})}i.test={state:()=>({scene:i.sceneName,completed:i.completed.slice(),atHome:i.atHome,knob:i.stove.main.value,lit:i.stove.main.lit,level:i.stove.main.level,thermal:i.stove.main.thermal,eggs:i.cook.eggs.map(b=>({cook:b.cook,crisp:b.crisp,twin:b.twin,spread:b.spread})),meal:i.meal,daylight:i.daylight,quality:i.quality.level,album:i.save.data.album.length,saveOk:i.save.ok,hintGlow:!!i.fx.hint.glowOn,hintHand:!!i.fx.hint.handOn,hintShown:i.fx.hint.shown,audio:i.audio.started,time:i.time,step:i.step||"",locked:!!i.input.locked,camMix:i.cam.mixK,temps:n.tempCount(),finite:[s.arms[1].up.scale.y,s.arms[-1].fo.scale.y,r.arms[1].up.scale.y,...i.cook.eggs.map(b=>b.geo.boundingSphere?b.geo.boundingSphere.radius:0)].every(b=>Number.isFinite(b)),knobPx:(()=>{let b=i.stove.main.proxy.getWorldPosition(new U),R=i.input.screenOf(b),S=i.input.screenOf(b.clone().add(new U(.03,0,0)));return Math.abs(S.x-R.x)})()}),targets:()=>i.input.items.filter(b=>!b.enabled||b.enabled()).map(b=>{let R=i.input.centerOf(b),S=i.input.screenOf(R);return{name:b.name,x:S.x,y:S.y}}),target:b=>{let R=i.input.items.find(P=>P.name===b&&(!P.enabled||P.enabled()));if(!R)return null;let S=i.input.screenOf(i.input.centerOf(R));return{x:S.x,y:S.y}},screen:(b,R,S)=>i.input.screenOf(new U(b,R,S)),hint:()=>{let b=i.fx.hint.cur;if(!b)return null;let R=b.at();if(!R)return null;let S={at:i.input.screenOf(R)};if(b.to){let P=b.to();P&&(S.to=i.input.screenOf(P))}return S}}}var si=new URLSearchParams(location.search),Po=document.getElementById("c"),zt=window.__egg={params:si,canvas:Po,time:0,dt:0,timeScale:Number(si.get("ts"))||1,frame:0,L:q};function Jv(){let i=performance.now(),t=new Dl({canvas:Po,antialias:!0,powerPreference:"high-performance",alpha:!1,stencil:!1,preserveDrawingBuffer:si.has("shot")});zt.renderer=t,t.outputColorSpace=en,t.toneMapping=fo,t.toneMappingExposure=1,t.shadowMap.enabled=!0,t.shadowMap.type=Ms,zd(t.capabilities.getMaxAnisotropy());let e=zt.scene=new fs;e.background=new Bt(1380622);let n=zt.loadMarks={},s=performance.now();Kd(),n.materials=performance.now()-s,s=performance.now(),e.environment=$d(t),n.env=performance.now()-s,s=performance.now(),e.environmentIntensity=.3;let r=zt.sun=new ys(new Bt(1,.9,.74),0);r.castShadow=!0,r.shadow.bias=-4e-4,r.shadow.normalBias=.012,r.shadow.radius=3.5,e.add(r,r.target);let o=zt.fill=new ys(new Bt(.8,.88,1),0);o.position.set(-3,2.2,.8),o.target.position.set(.5,.8,-1.2),e.add(o,o.target);let a=zt.bounce=new lr(new Bt(1,.96,.9),new Bt(.55,.42,.3),0);e.add(a);let l=new ys(new Bt(1,.965,.91),0);l.position.set(0,2.3,-.75),l.target.position.set(.55,.9,-1.5),e.add(l,l.target);let c=new lr(new Bt(.78,.84,1),new Bt(.5,.42,.36),0),u=new vs(new Bt(1,.76,.42),0,7,1.4);u.position.set(-1.95,1.45,-.5),e.add(c,u),zt.setShadowFocus=(L,b)=>{r.target.position.copy(L),r.position.copy(L).addScaledVector(q.sunDir,-7);let R=r.shadow.camera;R.left=-b,R.right=b,R.top=b,R.bottom=-b,R.near=.5,R.far=12,R.updateProjectionMatrix(),r.target.updateMatrixWorld(),r.shadow.needsUpdate=!0},zt.daylight=0,zt.setDaylight=L=>{zt.daylight=L;let b=(S,P)=>si.has(S)?Number(si.get(S)):P;r.intensity=b("sun",3.4)*L,o.intensity=b("fill",.25)*L,a.intensity=.06+b("bounce",.2)*L,l.intensity=b("key",1)*L,e.environmentIntensity=.2+b("env",.6)*L,t.toneMappingExposure=b("exp",.95),V.ceiling.emissiveIntensity=.04+.26*L;let R=Math.max(0,1-L*1.15);c.intensity=.55*R,u.intensity=2.6*R};let h=zt.camera=new bn(42,1.6,.05,30),p=zt.views={wide:{p:[1.55,1.36,1.75],t:[-.55,1,-1.5],fov:47,shadow:[[-.4,.8,-1],3]},curtain:{p:[.3,1.3,.78],t:[-2.25,1.22,-.92],fov:46,shadow:[[-1.2,.9,-.9],2.4]},drawer:{p:[.75,1.52,-.22],t:[.75,.62,-1.02],fov:44,shadow:[[.75,.8,-1.2],1.2]},stove:{p:[.53,1.37,-.93],t:[.53,.885,-1.555],fov:41,shadow:[[.6,.85,-1.5],.75]},flame:{p:[.515,1.035,-1.03],t:[.6,.895,-1.58],fov:41,shadow:[[.6,.85,-1.5],.75]},eggclose:{p:[.6,1.25,-1.17],t:[.6,.89,-1.6],fov:36,shadow:[[.6,.85,-1.5],.6]},toaster:{p:[.56,1.21,-.98],t:[-.42,.99,-1.55],fov:42,shadow:[[-.5,.9,-1.4],1.6]},plate:{p:[.33,1.42,-.84],t:[.33,.87,-1.5],fov:43,shadow:[[.4,.85,-1.5],.8]},table:{p:[-1.3,1.4,.72],t:[-1.35,.88,-1],fov:46,shadow:[[-1.35,.8,-.9],1.4]},hug:{p:[-1.33,1.24,0],t:[-1.35,1.06,-1.3],fov:46,shadow:[[-1.35,.8,-.9],1.4]},sink:{p:[1.6,1.44,-.86],t:[1.6,.79,-1.56],fov:43,shadow:[[1.6,.85,-1.5],.8]},shelf:{p:[1.5,1.36,-.3],t:[1.5,1.17,-1.65],fov:44,shadow:[[1.5,1,-1.5],1.3]},eat:{p:[-1.32,1.3,.15],t:[-1.35,.95,-1.15],fov:46,shadow:[[-1.35,.8,-.9],1.4]},combwall:{p:[.42,1.28,.55],t:[-1.05,1.08,-1.9],fov:46,shadow:[[-1.2,.9,-.9],2.4]},tableplate:{p:[-1.33,1.14,-.12],t:[-1.33,.74,-.47],fov:40,shadow:[[-1.35,.8,-.7],1]},fridge:{p:[2.4,1.36,.25],t:[2.46,1.3,-1.25],fov:42,shadow:[[2.3,1,-1.2],1.5]}},d=zt.cam={p:new U,t:new U,fov:45,name:"",mix:null,mixK:0,shake:0},g=new U,v=new U;d.set=L=>{let b=p[L];d.p.fromArray(b.p),d.t.fromArray(b.t),d.fov=b.fov,d.name=L,b.shadow&&zt.setShadowFocus(g.fromArray(b.shadow[0]),b.shadow[1])},d.to=(L,b=1.6,R=zt.scope)=>{let S=p[L],P=d.p.clone(),F=d.t.clone(),D=d.fov,H=new U().fromArray(S.p),B=new U().fromArray(S.t);d.name=L;let z=!1;return R.tween(b,Z=>{d.p.lerpVectors(P,H,Z),d.t.lerpVectors(F,B,Z),d.fov=Ot(D,S.fov,Z),!z&&Z>.5&&S.shadow&&(z=!0,zt.setShadowFocus(g.fromArray(S.shadow[0]),S.shadow[1]))},jt.inOut)},d.apply=()=>{let L=d.p,b=d.t,R=d.fov;if(d.mix&&d.mixK>.001){let D=p[d.mix],H=jt.inOut(Dt(d.mixK));L=g.copy(d.p).lerp(v.fromArray(D.p),H),b=v.copy(d.t).lerp(new U().fromArray(D.t),H),R=Ot(d.fov,D.fov,H)}h.position.copy(L),h.position.x+=Math.sin(zt.time*.31)*.0012,h.position.y+=Math.sin(zt.time*.43+1)*.001,h.lookAt(b);let S=1.6,P=h.aspect,F=R;if(P<S){let D=2*Math.atan(Math.tan(R*Math.PI/360)*S);F=2*Math.atan(Math.tan(D/2)/P)*180/Math.PI}Math.abs(h.fov-F)>.001&&(h.fov=F,h.updateProjectionMatrix())},zt.scope=new Qi,zt.room=Qd(e),n.room=performance.now()-s,s=performance.now();let m=zt.quality={level:0,locked:si.has("q"),samples:[],slow:0,fast:0},f=[{pr:2,shadow:2048,post:!0},{pr:1.5,shadow:2048,post:!0},{pr:1.25,shadow:1024,post:!0},{pr:1,shadow:1024,post:!1},{pr:.75,shadow:512,post:!1}];zt.post=new Ol(t);let x=t.capabilities.isWebGL2!==!1&&(t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float"));m.apply=L=>{m.level=Dt(L,0,f.length-1);let b=f[m.level],R=Math.min(window.devicePixelRatio||1,b.pr)*(b.pr<1?b.pr:1);t.setPixelRatio(R),r.shadow.mapSize.x!==b.shadow&&(r.shadow.mapSize.set(b.shadow,b.shadow),r.shadow.map&&(r.shadow.map.dispose(),r.shadow.map=null)),zt.post.enabled=b.post&&x&&!si.has("nopost"),_()},m.tick=L=>{if(m.locked)return;m.samples.push(L),m.acc=(m.acc||0)+L;let b=m.samples.length;if(!(b>=6&&m.acc/b>120||m.acc>=2500&&b>=8||b>=150))return;m.acc=0;let S=m.samples.slice().sort((F,D)=>F-D);m.samples.length=0;let P=S[Math.floor(S.length*.8)];P>19.5?(m.slow+=P>100?2:1,m.fast=0):P<12.5?(m.fast++,m.slow=0):(m.slow=0,m.fast=0),m.slow>=2&&m.level<f.length-1&&(m.apply(m.level+1),m.slow=0)};function _(){let L=window.innerWidth,b=window.innerHeight;t.setSize(L,b,!1),h.aspect=L/b,h.updateProjectionMatrix(),zt.post.setSize(t)}window.addEventListener("resize",_),m.apply(si.has("q")?Number(si.get("q")):window.devicePixelRatio>1.5?1:0),If(zt),n.game=performance.now()-s,zt.loadMs=performance.now()-i,zt.texTimes=Sh,zt.takePhoto=L=>new Promise(b=>{zt.photoReq={view:L,res:b}});function y(L){let b=h.position.clone(),R=h.quaternion.clone(),S=h.fov;h.position.copy(L.p),h.lookAt(L.t),h.fov=L.fov,h.updateProjectionMatrix(),zt.post.render(t,e,h,zt);let P=Po.width,F=Po.height,D=F*.92,H=D*4/3;H>P*.96&&(H=P*.96,D=H*3/4);let B=document.createElement("canvas");B.width=320,B.height=240,B.getContext("2d").drawImage(Po,(P-H)/2,(F-D)/2,H,D,0,0,320,240);let z=B.toDataURL("image/jpeg",.82);return h.position.copy(b),h.quaternion.copy(R),h.fov=S,h.updateProjectionMatrix(),zt.post.render(t,e,h,zt),z}let w=-1,T=Number(si.get("skip"))||0,M=zt.frameTimes=[],E=zt.cpuTimes=[],N=zt.logicTimes=[];try{let L=t.getContext(),b=L.getExtension("WEBGL_debug_renderer_info");zt.gpuName=b?L.getParameter(b.UNMASKED_RENDERER_WEBGL):"unknown"}catch{zt.gpuName="unknown"}function C(L){requestAnimationFrame(C),w<0&&(w=L);let b=L-w;w=L,b>=0||(b=0);let R=b;b>250&&(b=250),zt.frame>8&&(m.tick(b),zt.recordFrames&&M.push(R));let S=performance.now(),P=Math.min(.05,b/1e3)*zt.timeScale,F=zt.timeScale>1?Math.ceil(zt.timeScale):1;for(let H=0;H<F;H++)zt.dt=P/F,zt.time+=zt.dt,zt.scope.update(zt.dt),zt.update(zt.dt);d.apply();let D=performance.now();if((!T||zt.frame%T===0||zt.photoReq)&&zt.post.render(t,e,h,zt),zt.recordFrames&&(E.push(performance.now()-S),N.push(D-S),zt.lastCalls=zt.post.calls,zt.lastTris=zt.post.tris),zt.photoReq){let H=zt.photoReq;zt.photoReq=null;let B=null;try{B=y(H.view)}catch{B=null}H.res(B)}zt.frame++,zt.frame===3&&(document.getElementById("load").classList.add("gone"),si.has("noui")||document.getElementById("ui").classList.add("on"))}requestAnimationFrame(C)}try{Jv()}catch(i){console.error(i)}})();
