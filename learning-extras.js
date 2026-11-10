// Presentation/routing only; original app.js owns all activities and scoring.
(() => {
 const view = new URLSearchParams(location.search).get('view');
 if (['probes','ptycho','concepts'].includes(view)) {
  document.documentElement.classList.add('extras', 'extras-'+view);
  if(view !== 'concepts') document.getElementById('tab-'+view).click();
 } else if (!['optics','electrons'].includes(view)) {
  const destinations = {lab:'optical.html#resolution', instruments:'optical.html#concept-check',challenge:'optical.html#concept-check',frontier:'electron.html#ptychography',sources:'electron.html#references','ref-optics':'optical.html#sources','ref-jeol':'electron.html#references'};
  location.replace(destinations[location.hash.slice(1)] || 'index.html#journey');
 }
})();
