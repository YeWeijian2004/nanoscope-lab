/* Isolated, dependency-free SIM forward/inverse model. CommonJS export enables numerical checks. */
(function(root){
'use strict';
const N=128,S=N*N,cutoff=18,modulation=.9,regularization=1e-4;
function fft1(re,im,inverse){
 for(let i=1,j=0;i<N;i++){let bit=N>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]];}}
 for(let len=2;len<=N;len*=2){const a=(inverse?2:-2)*Math.PI/len,wr=Math.cos(a),wi=Math.sin(a);for(let start=0;start<N;start+=len){let cr=1,ci=0;for(let j=0;j<len/2;j++){const u=start+j,v=u+len/2,tr=re[v]*cr-im[v]*ci,ti=re[v]*ci+im[v]*cr;re[v]=re[u]-tr;im[v]=im[u]-ti;re[u]+=tr;im[u]+=ti;const next=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=next;}}}
 if(inverse)for(let i=0;i<N;i++){re[i]/=N;im[i]/=N;}
}
function fft2(input,imag,inverse=false){const re=new Float64Array(input),im=imag?new Float64Array(imag):new Float64Array(S),r=new Float64Array(N),q=new Float64Array(N);for(let axis=0;axis<2;axis++)for(let a=0;a<N;a++){for(let b=0;b<N;b++){const i=axis?b*N+a:a*N+b;r[b]=re[i];q[b]=im[i];}fft1(r,q,inverse);for(let b=0;b<N;b++){const i=axis?b*N+a:a*N+b;re[i]=r[b];im[i]=q[b];}}return {re,im};}
const otf=Float64Array.from({length:S},(_,i)=>{const x=i%N,y=Math.floor(i/N),rho=Math.hypot(x>N/2?x-N:x,y>N/2?y-N:y)/cutoff;return rho<1?2/Math.PI*(Math.acos(rho)-rho*Math.sqrt(1-rho*rho)):0;});
function blur(a){const f=fft2(a);for(let i=0;i<S;i++){f.re[i]*=otf[i];f.im[i]*=otf[i];}return fft2(f.re,f.im,true).re;}
function pattern(angle,phase){const vectors={0:[14,0],45:[10,10],90:[0,14],135:[-10,10]},[kx,ky]=vectors[angle];return Float64Array.from({length:S},(_,i)=>1+modulation*Math.cos(2*Math.PI*(kx*(i%N)+ky*Math.floor(i/N))/N+phase*Math.PI/180));}
function sample(){return Float64Array.from({length:S},(_,i)=>{const x=i%N,y=Math.floor(i/N),g=(cx,cy)=>Math.exp(-((x-cx)**2+(y-cy)**2)/(2*12**2));return .015+.9*g(38,43)*(.55+.45*Math.cos(2*Math.PI*26*x/N))+.9*g(88,84)*(.55+.45*Math.cos(2*Math.PI*26*y/N));});}
function multiply(a,b){return Float64Array.from(a,(v,i)=>v*b[i]);}
function capture(object,angle,phase){const p=pattern(angle,phase);return {angle,phase,p,data:blur(multiply(object,p))};}
function dot(a,b){let sum=0;for(let i=0;i<S;i++)sum+=a[i]*b[i];return sum;}
// Only frames enter this solver: the original sample is never available here.
async function reconstruct(frames,progress=()=>{}){
 if(!frames.length)throw new Error('Acquire at least one image.');
 const count=frames.length,b=new Float64Array(S);
 for(const f of frames){const z=blur(f.data);for(let i=0;i<S;i++)b[i]+=f.p[i]*z[i]/count;}
 function normal(x){const out=Float64Array.from(x,v=>regularization*v);for(const f of frames){const z=blur(blur(multiply(x,f.p)));for(let i=0;i<S;i++)out[i]+=f.p[i]*z[i]/count;}return out;}
 const x=new Float64Array(S),r=new Float64Array(b),p=new Float64Array(r);let rr=dot(r,r),initial=rr,iterations=0;
 for(;iterations<80&&rr>initial*1e-12;iterations++){const ap=normal(p),alpha=rr/dot(p,ap);for(let i=0;i<S;i++){x[i]+=alpha*p[i];r[i]-=alpha*ap[i];}const next=dot(r,r),beta=next/rr;for(let i=0;i<S;i++)p[i]=r[i]+beta*p[i];rr=next;if(iterations%8===0){progress(iterations);await new Promise(resolve=>setTimeout(resolve,0));}}
 let error=0,power=0;for(const f of frames){const predicted=blur(multiply(x,f.p));for(let i=0;i<S;i++){error+=(predicted[i]-f.data[i])**2;power+=f.data[i]**2;}}
 return {image:x,residual:Math.sqrt(error/Math.max(power,1e-30)),iterations};
}
function phaseCoverage(frames,angle){const fs=frames.filter(f=>f.angle===angle);if(fs.length<3)return false;let c=0,s=0,cc=0,ss=0,cs=0;for(const f of fs){const a=f.phase*Math.PI/180,u=Math.cos(a),v=Math.sin(a);c+=u;s+=v;cc+=u*u;ss+=v*v;cs+=u*v;}return (fs.length*(cc*ss-cs*cs)-c*(c*ss-s*cs)+s*(c*cs-s*cc))/fs.length**3>.12;}
function stripeBands(a){const f=fft2(a),dc=Math.abs(f.re[0]);return [26,26*N].map(i=>2*Math.hypot(f.re[i],f.im[i])/Math.max(dc,1e-30));}
const api={N,S,fft2,blur,pattern,sample,capture,multiply,reconstruct,phaseCoverage,stripeBands};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SIM=api;
})(typeof globalThis!=='undefined'?globalThis:this);
