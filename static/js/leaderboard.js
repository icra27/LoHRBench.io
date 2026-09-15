document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('[data-family-tab]')];
  const panels = [...document.querySelectorAll('[data-family]')];
  const subtypeButtons = [...document.querySelectorAll('[data-subtype-filter]')];
  const metricSelect = document.getElementById('ranking-metric');
  const liveStatus = document.querySelector('.ranking-status');
  const familyNames = { tamp: 'TAMP', e2e: 'End-to-end', hybrid: 'Hybrid' };
  let family = 'tamp';
  let subtype = 'all';

  function refreshRanking() {
    const primary = metricSelect.value;
    const secondary = primary === 'sr' ? 'prog' : 'sr';
    let visibleCount = 0;

    panels.forEach(panel => {
      const selected = panel.dataset.family === family;
      panel.hidden = !selected;
      const list = panel.querySelector('.method-rankings');
      const entries = [...list.children].sort((a, b) =>
        Number(b.dataset[primary]) - Number(a.dataset[primary]) ||
        Number(b.dataset[secondary]) - Number(a.dataset[secondary]) ||
        a.dataset.name.localeCompare(b.dataset.name)
      );
      let count = 0;
      let rank = 0;
      let previousScores = null;
      entries.forEach(entry => {
        list.append(entry);
        entry.hidden = panel.dataset.family === 'e2e' && subtype !== 'all' && entry.dataset.subtype !== subtype;
        if (entry.hidden) {
          entry.querySelector('details').open = false;
          return;
        }
        count += 1;
        const scores = `${entry.dataset[primary]}:${entry.dataset[secondary]}`;
        if (scores !== previousScores) rank = count;
        previousScores = scores;
        entry.value = rank;
        const number = entry.querySelector('.method-rank');
        number.textContent = String(rank).padStart(2, '0');
        number.setAttribute('aria-label', `Rank ${rank}`);
        entry.classList.toggle('is-first', rank === 1);
      });
      panel.querySelector('.method-count').textContent = `${count} ${count === 1 ? 'method' : 'methods'}`;
      panel.querySelector('.ranking-columns').hidden = count === 0;
      list.hidden = count === 0;
      const empty = panel.querySelector('.empty-ranking');
      if (empty) empty.hidden = count !== 0;
      if (selected) visibleCount = count;
    });

    tabs.forEach(tab => {
      const active = tab.dataset.familyTab === family;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    subtypeButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.subtypeFilter === subtype));
    });
    document.querySelector('.ranking-order-label').textContent = primary === 'sr'
      ? 'Ranked by mean success rate' : 'Ranked by mean progress score';
    const typeLabel = family === 'e2e' && subtype !== 'all'
      ? ` / ${subtype === 'other' ? 'other policies' : subtype.toUpperCase()}` : '';
    liveStatus.textContent = `${familyNames[family]}${typeLabel}: ${visibleCount} ${visibleCount === 1 ? 'method' : 'methods'}, ranked by ${primary === 'sr' ? 'success rate' : 'progress score'}.`;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      family = tab.dataset.familyTab;
      refreshRanking();
    });
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      tabs[target].focus();
      tabs[target].click();
    });
  });
  subtypeButtons.forEach(button => button.addEventListener('click', () => {
    subtype = button.dataset.subtypeFilter;
    refreshRanking();
  }));
  metricSelect.addEventListener('change', refreshRanking);

  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.dataset.family}`);
  });
  document.querySelector('.family-tabs').hidden = false;
  document.querySelector('.subtype-filters').hidden = false;
  document.querySelector('.ranking-sort').hidden = false;
  refreshRanking();
});
