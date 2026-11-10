/* Independent image-based localization. Ground truth is used only by sample generation and evaluation. */
(function(root){'use strict';
const N=96,pixel=25,sigma=4,photons=1200,background=2;
function rng(seed=12345){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function population(){const p=[];for(let i=0;i<24;i++){const y=350+i*72,x=1050+65*Math.sin(i/4);p.push({x,y},{x:x+160,y});}return p;}
function expected(points){const a=new Float64Array(N*N).fill(background);for(const p of points){const cx=p.x/pixel,cy=p.y/pixel;for(let y=Math.max(0,Math.floor(cy-20));y<Math.min(N,Math.ceil(cy+20));y++)for(let x=Math.max(0,Math.floor(cx-20));x<Math.min(N,Math.ceil(cx+20));x++)a[y*N+x]+=photons/(2*Math.PI*sigma*sigma)*Math.exp(-((x-cx)**2+(y-cy)**2)/(2*sigma*sigma));}return a;}
function poisson(mean,random){const stop=Math.exp(-mean);let k=0,p=1;do{k++;p*=random();}while(p>stop);return k-1;}
function camera(points,random){return Float64Array.from(expected(points),m=>poisson(m,random));}
function localize(image){
 const smooth=new Float64Array(N*N),candidates=[],accepted=[];let rejected=0;
 for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){let v=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)v+=image[(y+dy)*N+x+dx];smooth[y*N+x]=v/9;}
 for(let y=8;y<N-8;y++)for(let x=8;x<N-8;x++){const v=smooth[y*N+x];if(v<6)continue;let max=true;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if((dx||dy)&&smooth[(y+dy)*N+x+dx]>=v)max=false;if(max)candidates.push({x,y,v});}
 candidates.sort((a,b)=>b.v-a.v);const used=[];
 for(const c of candidates){if(used.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<8))continue;used.push(c);let sum=0,sx=0,sy=0,sxx=0,syy=0;for(let dy=-7;dy<=7;dy++)for(let dx=-7;dx<=7;dx++){const w=Math.max(0,image[(c.y+dy)*N+c.x+dx]-background);sum+=w;sx+=w*dx;sy+=w*dy;sxx+=w*dx*dx;syy+=w*dy*dy;}
 const mx=sx/sum,my=sy/sum,width=pixel*Math.sqrt(Math.max(0,(sxx+syy)/sum-mx*mx-my*my)/2);
 if(sum<700||sum>1650||width<70||width>115){rejected++;continue;}
 accepted.push({x:(c.x+mx)*pixel,y:(c.y+my)*pixel,width,signal:sum});
 }return {accepted,rejected};
}
// Simulator-only audit: does not change, remove or snap estimated coordinates.
function audit(estimates,bright){const used=new Set(),matches=[];for(const e of estimates){let best=-1,distance=40;bright.forEach((p,i)=>{const d=Math.hypot(e.x-p.x,e.y-p.y);if(!used.has(i)&&d<distance){distance=d;best=i;}});if(best>=0){used.add(best);matches.push({id:bright[best].id,error:distance});}}return matches;}
const api={N,pixel,sigma,photons,background,rng,population,expected,camera,localize,audit};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.STORM=api;
})(typeof globalThis!=='undefined'?globalThis:this);
