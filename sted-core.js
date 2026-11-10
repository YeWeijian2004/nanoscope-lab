/* Idealized STED teaching model. Width law is calibrated to a Gaussian PSF,
   not asserted to be an exact vectorial or time-dependent STED PSF. */
(function(root){'use strict';
 const N=101,FOV=800,D0=640/(2*1.4),separation=128;
 const coordinate=i=>(i-(N-1)/2)*FOV/(N-1);
 const width=s=>D0/Math.sqrt(1+s);
 const psf=(x,y,s)=>Math.exp(-4*Math.log(2)*(x*x+y*y)/width(s)**2);
 const signal=(x,y,s)=>psf(x-separation/2,y,s)+psf(x+separation/2,y,s);
 function row(y,s){return Float64Array.from({length:N},(_,x)=>signal(coordinate(x),coordinate(y),s));}
 function criterion(profile){const mid=(N-1)/2,peaks=[];for(let i=1;i<N-1;i++)if(profile[i]>profile[i-1]&&profile[i]>profile[i+1])peaks.push(i);const left=peaks.filter(i=>i<mid).sort((a,b)=>profile[b]-profile[a])[0],right=peaks.filter(i=>i>mid).sort((a,b)=>profile[b]-profile[a])[0];if(left===undefined||right===undefined)return {resolved:false,ratio:null};let valley=Infinity;for(let i=left;i<=right;i++)valley=Math.min(valley,profile[i]);const ratio=valley/Math.min(profile[left],profile[right]);return {resolved:right-left>=2&&ratio<=.735,ratio};}
 const api={N,FOV,D0,separation,coordinate,width,psf,signal,row,criterion};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.STED=api;
})(typeof globalThis!=='undefined'?globalThis:this);
