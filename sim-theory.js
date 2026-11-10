/* Theory-only views. Existing experiment controls are the source of phase/direction. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id),C=SIM,sample=C.sample();
 const descriptions={
 laser:['Laser illumination','Excitation light supplies the patterned illumination. Relay optics and polarization control are omitted from this schematic.'],
 grating:['Grating & diffraction orders','The grating splits illumination into 0 and ±1 orders. Moving or rotating the grating changes the interference pattern’s phase or direction.'],
 objective:['Objective lens','The objective brings the illumination beams together at the specimen and collects its fluorescence. The drawn rays indicate beam routing, not a scale optical prescription.'],
 sample:['Fixed fluorescent sample','The sample stays still. Its fluorescence is proportional to sample density × illumination intensity; this multiplication generates the Moiré difference frequencies.'],
 dichroic:['Dichroic beam splitter','In this illustrated arrangement, excitation is transmitted toward the objective and longer-wavelength fluorescence is reflected toward the detector. An emission filter rejects residual excitation.'],
 camera:['Camera & reconstruction','The camera records the optically blurred fluorescence, including low-frequency Moiré information. Three phases at each of two directions supply the six images used by this lesson’s reconstruction.']
 };
 function select(key){document.querySelectorAll('[data-optic]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.optic===key)));$('opticName').textContent=descriptions[key][0];$('opticExplanation').textContent=descriptions[key][1];}
 document.querySelectorAll('[data-optic]').forEach(el=>{el.addEventListener('click',()=>select(el.dataset.optic));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(el.dataset.optic);}});});
 function draw(id,a,max=1){const canvas=$(id),ctx=canvas.getContext('2d'),im=ctx.createImageData(C.N,C.N);for(let i=0;i<a.length;i++){const v=Math.max(0,Math.min(1,a[i]/max));im.data[4*i]=8+204*v;im.data[4*i+1]=27+214*v;im.data[4*i+2]=32+108*v;im.data[4*i+3]=255;}ctx.putImageData(im,0,0);}
 let playing=false,visible=false,frame=0,start=0,last=0;
 function render(phase=+$('phase').value,demo=false){const angle=+$('orientation').value,p=C.pattern(angle,phase),product=C.multiply(sample,p);draw('opticPattern',p,1.9);draw('opticProduct',product,1.9);draw('opticCamera',C.blur(product));$('opticPatternImage').setAttribute('href',$('opticPattern').toDataURL());$('opticState').textContent=`${angle}° direction · ${phase.toFixed(0)}° phase${demo?' · preview sweep (not acquired)':' · follows experiment controls'}`;}
 function syncCaptures(){$('opticAcquisition').textContent=$('count').textContent+' → '+($('resultLock').hidden?'Reconstruction available above':'Three phases × two directions → reconstruct above');}
 function stop(){playing=false;cancelAnimationFrame(frame);$('opticPlay').textContent='Animate phase → Moiré';$('opticPlay').setAttribute('aria-pressed','false');render();}
 function tick(t){if(!playing||!visible||document.hidden){stop();return;}if(t-last>160){render((+$('phase').value+(t-start)/6000*360)%360,true);last=t;}frame=requestAnimationFrame(tick);}
 $('opticPlay').addEventListener('click',()=>{if(playing){stop();return;}playing=true;start=performance.now();last=0;$('opticPlay').textContent='Stop · restore selected phase';$('opticPlay').setAttribute('aria-pressed','true');frame=requestAnimationFrame(tick);});
 for(const id of ['phase','orientation'])$(id).addEventListener('change',stop);
 $('clear').addEventListener('click',()=>{stop();syncCaptures();});
 new MutationObserver(syncCaptures).observe($('count'),{childList:true,subtree:true});
 new MutationObserver(syncCaptures).observe($('resultLock'),{attributes:true,attributeFilter:['hidden']});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&playing)stop();},{threshold:.05}).observe($('opticsLesson'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop();});
 draw('opticFixed',sample);select('grating');render();syncCaptures();
})();
