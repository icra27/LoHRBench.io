document.addEventListener('DOMContentLoaded', () => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const suites = [...document.querySelectorAll('[data-suite]')];
  const status = document.querySelector('.filter-status');

  function filterTasks(selected) {
    let count = 0;
    let visibleSuites = 0;
    for (const suite of suites) {
      suite.hidden = selected !== 'all' && suite.dataset.suite !== selected;
      if (suite.hidden) {
        suite.querySelectorAll('video').forEach(video => video.pause());
      } else {
        count += suite.querySelectorAll('.task-card').length;
        visibleSuites += 1;
      }
    }
    for (const button of filters) {
      const active = button.dataset.filter === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    status.textContent = selected === 'all'
      ? `Showing all ${count} tasks across ${visibleSuites} suites`
      : `Showing ${count} tasks in ${document.querySelector(`[data-suite="${selected}"] h3`).firstChild.textContent.trim()}`;
  }

  filters.forEach(button => button.addEventListener('click', () => filterTasks(button.dataset.filter)));
  document.querySelector('.task-toolbar').hidden = false;

  // Reveal a linked task even when a different suite is currently selected.
  function revealLinkedTask() {
    const task = document.getElementById(window.location.hash.slice(1));
    if (!task || !task.classList.contains('task-card')) return;
    const suite = task.closest('[data-suite]');
    if (suite.hidden) filterTasks(suite.dataset.suite);
    task.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', revealLinkedTask);
  revealLinkedTask();

  const previews = [...document.querySelectorAll('.overview-video')];
  const toggle = document.querySelector('.preview-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let previewsEnabled = !reducedMotion.matches;

  function updateToggle() {
    toggle.textContent = previewsEnabled ? 'Pause previews' : 'Play previews';
  }

  function playPreview(video) {
    video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
  }

  function syncPreviews() {
    previews.forEach(video => {
      if (previewsEnabled && !document.hidden && video.dataset.visible === 'true') playPreview(video);
      else video.pause();
    });
    updateToggle();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { entry.target.dataset.visible = String(entry.isIntersecting); });
      syncPreviews();
    }, { threshold: 0.2 });
    previews.forEach(video => observer.observe(video));
  } else {
    previews.forEach(video => { video.dataset.visible = 'true'; });
  }
  toggle.addEventListener('click', () => {
    previewsEnabled = !previewsEnabled;
    syncPreviews();
  });
  document.addEventListener('visibilitychange', syncPreviews);
  reducedMotion.addEventListener('change', event => {
    previewsEnabled = !event.matches;
    syncPreviews();
  });
  toggle.hidden = false;
  syncPreviews();

  // Keep the appendix easy to follow by playing only one task demonstration at a time.
  const demonstrations = [...document.querySelectorAll('.task-card video')];
  demonstrations.forEach(video => video.addEventListener('play', () => {
    demonstrations.forEach(other => { if (other !== video) other.pause(); });
  }));
});
