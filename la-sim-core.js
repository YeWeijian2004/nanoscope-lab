(function(root){'use strict';
const N=96,field=6,required=[-1.5,0,1.5];
function sample(){const p=[];for(let i=0;i<64;i++){const a=i*2*Math.PI/64;p.push({x:-.55+.9*Math.cos(a),y:.9*Math.sin(a),z:-1.5});}for(let i=0;i<61;i++)p.push({x:-1.5+i*.05,y:.45*Math.sin(i/10),z:0});for(let i=0;i<64;i++){const a=i*2*Math.PI/32,c=i<32?-.65:.65;p.push({x:c+.3*Math.cos(a),y:.65+.3*Math.sin(a),z:1.5});}return p;}
const specimen=sample();
function illumination(dz,thickness){return thickness===0?1:Math.exp(-4*Math.log(2)*dz*dz/(thickness*thickness));}
function form(z,thickness){const image=new Float64Array(N*N),step=field/N;let total=0,out=0;for(const p of specimen){const dz=p.z-z,weight=illumination(dz,thickness);if(weight<1e-10)continue;const sigma=.12*Math.sqrt(1+(dz/.6)**2),cx=(p.x+field/2)/step-.5,cy=(p.y+field/2)/step-.5,r=5*sigma/step,amp=weight*step*step/(2*Math.PI*sigma*sigma);for(let y=Math.max(0,Math.floor(cy-r));y<=Math.min(N-1,Math.ceil(cy+r));y++)for(let x=Math.max(0,Math.floor(cx-r));x<=Math.min(N-1,Math.ceil(cx+r));x++){const v=amp*Math.exp(-((x-cx)**2+(y-cy)**2)*step*step/(2*sigma*sigma));image[y*N+x]+=v;total+=v;if(Math.abs(dz)>.35)out+=v;}}return {image,outFraction:total?out/total:0,total};}
function complete(slices){return required.every(z=>slices.some(s=>s.z===z&&s.thickness===.5));}
const api={N,field,required,specimen,illumination,form,complete};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LASIM=api;
})(typeof globalThis!=='undefined'?globalThis:this);
