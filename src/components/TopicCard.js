import { escapeHtml } from './studioMarkup.js';

export function TopicCard({ topic, completed, href }) {
  return `<a class="selection-card topic-card ${completed ? 'is-complete' : ''}" href="${escapeHtml(href)}">
    <span class="topic-status" aria-hidden="true">${completed ? '✓' : '→'}</span>
    <span class="selection-copy"><strong>${escapeHtml(topic.title)}</strong><small>${escapeHtml(topic.description)}</small></span>
  </a>`;
}

