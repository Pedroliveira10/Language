import { escapeHtml } from './studioMarkup.js';

export function RichTopicCard({ topic, completed, total, href }) {
  const done = total > 0 && completed >= total;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return `<a class="selection-card topic-card ${done ? 'is-complete' : ''}" href="${escapeHtml(href)}">
    <span class="topic-status" aria-hidden="true">${done ? '✓' : '→'}</span>
    <span class="selection-copy">
      <strong>${escapeHtml(topic.title)}</strong>
      <small>${escapeHtml(topic.description)}</small>
      <small>${completed}/${total} activities complete · ${percent}%</small>
    </span>
  </a>`;
}
