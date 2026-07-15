import { escapeHtml, progressPercent } from './studioMarkup.js';

export function CategoryCard({ category, completed = 0, total = 0, href }) {
  const percent = progressPercent(completed, total);
  return `<a class="selection-card category-card" href="${escapeHtml(href)}">
    <span class="selection-icon" aria-hidden="true">${category.icon}</span>
    <span class="selection-copy"><strong>${escapeHtml(category.label)}</strong><small>${escapeHtml(category.description)}</small></span>
    <span class="selection-progress"><span>${completed}/${total}</span><span class="mini-progress"><i style="width:${percent}%"></i></span></span>
  </a>`;
}

