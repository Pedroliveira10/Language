import { escapeHtml, progressPercent } from './studioMarkup.js';

export function CefrLevelSelector({ levels, summaries, routeFor }) {
  return `<div class="level-grid">${levels.map((level) => {
    const summary = summaries[level.id] || { completed: 0, total: 0 };
    const percent = progressPercent(summary.completed, summary.total);
    return `<a class="level-card" href="${escapeHtml(routeFor(level.id))}">
      <span class="level-code">${level.id}</span>
      <span><strong>${escapeHtml(level.label)}</strong><small>${escapeHtml(level.description)}</small></span>
      <span class="level-meta">${summary.completed}/${summary.total}<span class="mini-progress"><i style="width:${percent}%"></i></span></span>
    </a>`;
  }).join('')}</div>`;
}

