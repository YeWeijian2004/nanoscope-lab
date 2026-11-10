'use strict';
// Independent teaching models. Length outputs are nm; angles supplied in mrad.
const ElectronModels = (() => {
  function wavelength(kv){const h=6.62607015e-34,m=9.1093837139e-31,e=1.602176634e-19,c=299792458,V=kv*1000;return h/Math.sqrt(2*m*e*V*(1+e*V/(2*m*c*c)))*1e9;}
  function spot(mrad){const a=mrad/1000,source=1,spherical=.5*2e6*a**3,chromatic=2e6*a*.7/30000,diffraction=.61*wavelength(30)/a;return {source,spherical,chromatic,diffraction,total:Math.hypot(source,spherical,chromatic,diffraction)};}
  function transmission(t,mu=1/120){return Math.exp(-mu*t);}
  function specimen(x,y){return ((x+.32)**2+(y+.05)**2<.23**2 || Math.abs(y-.35*Math.sin(4*x))<.07) ? 2 : 1;}
  function image(t,n=128){const data=new Float64Array(n*n);for(let y=0;y<n;y++)for(let x=0;x<n;x++)data[y*n+x]=transmission(t,specimen(2*x/(n-1)-1,2*y/(n-1)-1)/120);return data;}
  return {wavelength,spot,transmission,specimen,image};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ElectronModels;
