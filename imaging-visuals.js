/* Component explanations only: does not access simulation state. */
document.querySelectorAll('.imaging-schematic').forEach(panel => {
  const parts = panel.querySelectorAll('[data-visual-part]');
  const select = part => {
    parts.forEach(item => item.setAttribute('aria-pressed', String(item === part)));
    panel.querySelector('[role="status"]').textContent = part.dataset.visualPart;
  };
  parts.forEach(part => {
    part.addEventListener('click', () => select(part));
    part.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select(part);
      }
    });
  });
  select(parts[0]);
});
