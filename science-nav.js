// Navigation only: numerical models and experiment state remain owned by each lab.
(() => {
  const labs = ['sim', 'sted', 'storm', 'frontiers', 'la-sim', 'ec-sted', 'background'];
  const back = document.getElementById('backToLab');
  if (back) {
    const from = new URLSearchParams(location.search).get('from');
    if (labs.includes(from)) {
      back.href = from === 'background' ? 'optical.html#instrument-tools' : from + '.html#workbench';
      back.textContent = '← Back to Lab';
    }
  }
  // Workbenches are visible in HTML. No entry click, delayed scroll or acquisition.
  // Keep each instrument iframe mounted so closing never resets either workspace.
  const panels = new Map();
  document.querySelectorAll('[data-instrument-view]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.instrumentView;
      let dialog = panels.get(key);
      if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.className = 'instrument-dialog';
        dialog.setAttribute('aria-label', 'Optional ' + key.toUpperCase() + ' instrument exploration');
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'instrument-close';
        close.textContent = 'Back to Workbench ×';
        close.addEventListener('click', () => dialog.close());
        const note = document.createElement('p');
        note.textContent = 'Schematic 3D instrument · drag to rotate, or use the camera and component controls. Your main experiment stays open.';
        const frame = document.createElement('iframe');
        frame.title = key.toUpperCase() + ' interactive 3D instrument';
        frame.addEventListener('load', () => {
          const doc = frame.contentDocument;
          doc.getElementById('choose-' + key)?.click();
          doc.getElementById('workspace')?.scrollIntoView();
        });
        frame.src = 'background.html?embed=1';
        dialog.append(close, note, frame);
        document.body.append(dialog);
        dialog.addEventListener('close', () => button.focus({preventScroll: true}));
        panels.set(key, dialog);
      }
      dialog.showModal();
    });
  });
})();
