'use strict';
const SPMModels=(()=>{
// Same currentRatio helper and constants as the preserved studio.js STM model.
function currentRatio(gap,barrier){const k=Math.sqrt(2*9.1093837139e-31*barrier*1.602176634e-19)/1.054571817e-34*1e-9;return Math.exp(-2*k*(gap-.5));}
const decay=-Math.log(currentRatio(.6,4))/.1;
function surface(x){return .04*Math.sin(2*Math.PI*x/40)+.08*Math.exp(-(((x-55)/9)**2));}
function scan(mode){let z=surface(0)+.5;const out=[];for(let i=0;i<=100;i++){const h=surface(i),before=z;let initial=currentRatio(z-h,4);if(mode==='current'){for(let j=0;j<8;j++)z+=.35*Math.log(currentRatio(z-h,4))/decay;}else z=.65;out.push({x:i,h,z,gap:z-h,current:currentRatio(z-h,4),initial,adjustment:z-before});}return out;}
// Lennard-Jones-type illustrative force; r in nm, epsilon in nN nm, F in nN.
function force(r){const q=.3/r;return 24*.01/r*(2*q**12-q**6);}
function deflection(r){return force(r)/10;} // k=10 N/m, nN/(N/m)=nm
const modes={contact:{min:.28,start:.31,A:0,signal:'Static deflection → force setpoint'},noncontact:{min:.4,start:.7,A:.03,signal:'Frequency shift (FM example) → height feedback'},tapping:{min:.46,start:.46,A:.18,signal:'Oscillation amplitude (AM example) → height feedback'}};
function dynamicDistance(mode,r,phase){return r+modes[mode].A*Math.cos(phase);}
return {currentRatio,decay,surface,scan,force,deflection,modes,dynamicDistance};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=SPMModels;
