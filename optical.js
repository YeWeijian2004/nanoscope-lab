(() => {
  const $ = id => document.getElementById(id);
  const explanations = {
    absorption:'Excitation: a fluorophore absorbs a photon and reaches an excited electronic state. E = hc/λ: shorter wavelengths carry more photon energy.',
    relaxation:'Non-radiative relaxation transfers some energy to the surroundings before emission. The diagram is schematic; not every absorbed photon produces fluorescence.',
    emission:'Fluorescence is spontaneous emission back toward the ground state. It is typically at a longer wavelength than excitation (Stokes shift), allowing filters to separate weak fluorescence from strong excitation light.',
    laser:'The laser forms a focused excitation spot. A scanner moves that spot across XY; the images above represent the completed raster at the selected focus.',
    dichroic:'A wavelength-selective dichroic reflects excitation toward the objective and transmits fluorescence toward the detector in this schematic. An emission filter rejects residual excitation.',
    objective:'The objective focuses excitation and collects fluorescence. Changing focal position selects a different sample depth; it does not move the specimen structures.',
    pinhole:'A detection lens images the focal plane onto a conjugate pinhole plane. In-focus light forms a compact spot; defocused light spreads more widely and is preferentially blocked. Closing the aperture also loses useful photons.',
    detector:'The detector records light transmitted through the pinhole. Scanning creates a 2D optical section. A stack requires repeated scans at different focal depths.'
  };
  document.querySelectorAll('[data-explain]').forEach(g => {
    const activate=()=>{const svg=g.closest('svg');svg.querySelectorAll('[data-explain]').forEach(x=>x.setAttribute('aria-pressed',String(x===g)));$(svg.dataset.output).textContent=explanations[g.dataset.explain];};
    g.addEventListener('click',activate);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  });
  // Deterministic 3-plane specimen. Coordinates and defocus are in micrometres.
  const N=96, planes=[-1,0,1], sources=planes.map((z,k)=>Array.from({length:48},(_,i)=>{const t=2*Math.PI*i/48;return k===0?{x:2+.8*Math.cos(t),y:2+.8*Math.sin(t)}:k===1?{x:.55+2.9*i/47,y:2+.65*Math.sin(t)}:{x:2+.95*Math.cos(t),y:2+.35*Math.sin(2*t)};}));
  function weights(a,z){return planes.map(p=>{const dz=p-z,E=Math.exp(-.5*(dz/.8)**2),w=.52*Math.sqrt(1+(dz/.55)**2);return {dz,E,T:1-Math.exp(-a*a/(2*w*w))};});}
  function render(id,data){const c=$(id),ctx=c.getContext('2d'),im=ctx.createImageData(N,N);for(let i=0;i<data.length;i++){const v=Math.min(255,Math.round(data[i]/14*255));im.data.set([v*.7,v,v*.85,255],4*i);}ctx.putImageData(im,0,0);}
  function update(){const a=+$('pinholeSize').value,z=+$('focalZ').value,ws=weights(a,z),open=new Float64Array(N*N),filtered=new Float64Array(N*N);ws.forEach((q,k)=>{const sigma=.10*Math.sqrt(1+(q.dz/.6)**2)*N/4,norm=100/(2*Math.PI*sigma*sigma);for(const s of sources[k]){const cx=s.x*N/4,cy=s.y*N/4,r=Math.ceil(4*sigma);for(let y=Math.max(0,Math.floor(cy-r));y<Math.min(N,cy+r+1);y++)for(let x=Math.max(0,Math.floor(cx-r));x<Math.min(N,cx+r+1);x++){const v=norm*q.E*Math.exp(-((x-cx)**2+(y-cy)**2)/(2*sigma*sigma)),i=y*N+x;open[i]+=v;filtered[i]+=v*q.T;}}});render('openImage',open);render('confocalImage',filtered);
    $('pinholeValue').textContent=a.toFixed(2)+' AU';$('focusValue').textContent=z.toFixed(1)+' µm';const total=ws.reduce((s,q)=>s+q.E*q.T,0),full=ws.reduce((s,q)=>s+q.E,0),off=ws.reduce((s,q)=>s+(Math.abs(q.dz)>.35?q.E*q.T:0),0);$('confocalReadout').textContent=`Collected signal: ${(100*total/full).toFixed(1)}% of open detector. Out-of-focus contribution (|Δz| > 0.35 µm): ${(100*off/total).toFixed(1)}%.`;
    $('layerReadout').replaceChildren(...ws.map((q,k)=>{const d=document.createElement('div');d.className='layer-bar';const l=document.createElement('span');l.textContent=`z = ${planes[k]} µm`;const m=document.createElement('meter');m.min=0;m.max=1;m.value=q.E*q.T;m.setAttribute('aria-label',`Collected fraction from plane ${planes[k]} micrometres`);const v=document.createElement('span');v.textContent=(100*q.E*q.T).toFixed(1)+'%';d.append(l,m,v);return d;}));
    $('referenceThroughput').textContent=`Exactly in-focus reference transmission: ${(100*(1-Math.exp(-a*a/(2*.52**2)))).toFixed(1)}%.`;
    const gap=4+a*8;$('apertureTop').setAttribute('height',70-gap/2);$('apertureBottom').setAttribute('y',145+gap/2);$('apertureBottom').setAttribute('height',70-gap/2);$('focusPlane').setAttribute('y',244-z*20);$('focusLabel').textContent=`Focus z = ${z.toFixed(1)} µm`;
  }
  $('pinholeSize').addEventListener('input',update);$('focalZ').addEventListener('input',update);$('confocalReset').onclick=()=>{$('pinholeSize').value='1';$('focalZ').value='0';update();};update();
})();
