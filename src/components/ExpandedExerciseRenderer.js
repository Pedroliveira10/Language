import { escapeHtml } from './studioMarkup.js';
import { MicrophoneButton } from './MicrophoneButton.js';
import { normalizeText } from '../data/exerciseCatalog.js';

export function shouldShowTranslationHelp(exercise) {
  if (!exercise.translation || ['translation', 'fill-blank', 'sentence-completion'].includes(exercise.exerciseType)) return false;
  const translation = normalizeText(exercise.translation);
  return translation !== normalizeText(exercise.prompt) && translation !== normalizeText(exercise.correctAnswer);
}

function OrderingWorkspace(exercise) {
  const tokens = exercise.orderingTokens.map((token, position) => `<button class="order-token" type="button" draggable="true" data-order-token="${escapeHtml(token)}" data-order-position="${position}">${escapeHtml(token)}</button>`).join('');
  return `<div class="ordering-workspace" data-ordering-workspace="${escapeHtml(exercise.id)}">
    <p class="ordering-label">Available words</p><div class="order-zone" data-order-zone="available">${tokens}</div>
    <p class="ordering-label">Your sentence</p><div class="order-zone arranged" data-order-zone="arranged" aria-label="Your arranged sentence"></div>
    <div class="button-row"><button class="button secondary" type="button" data-reset-order>Reset</button><button class="button" type="button" data-submit-order>Submit sentence</button></div>
  </div>`;
}

export function ExpandedExerciseRenderer(exercise, { speechSupported, index, total, completed }) {
  const translation = shouldShowTranslationHelp(exercise) ? `<p class="translation"><strong>Translation:</strong> ${escapeHtml(exercise.translation)}</p>` : '';
  const listen = exercise.audioText ? `<button class="button secondary" type="button" data-listen-exercise="${escapeHtml(exercise.id)}">Listen</button>` : '';
  let interaction = '';
  if (exercise.type === 'sentenceOrder') interaction = OrderingWorkspace(exercise);
  else if (exercise.type === 'multipleChoice') interaction = `<div class="answer-options">${exercise.options.map((option) => `<button class="answer-option" type="button" data-answer-exercise="${escapeHtml(exercise.id)}" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`;
  else if (exercise.type === 'speaking') interaction = MicrophoneButton({ supported: speechSupported, exerciseId: exercise.id });
  else if (exercise.type === 'openResponse') interaction = `<label class="manual-field">Your answer<textarea data-input-exercise="${escapeHtml(exercise.id)}" rows="6" placeholder="Write a complete answer. Several answers may be valid."></textarea></label><button class="button" type="button" data-reveal-exercise="${escapeHtml(exercise.id)}">Compare with model answer</button>`;
  else interaction = `<label class="manual-field">Your answer<input type="text" data-input-exercise="${escapeHtml(exercise.id)}" autocomplete="off" placeholder="Type your answer"></label><button class="button" type="button" data-check-exercise="${escapeHtml(exercise.id)}">Check answer</button>`;

  return `<section class="exercise-card ${completed ? 'is-complete' : ''}" data-exercise-card="${escapeHtml(exercise.id)}">
    <div class="exercise-kicker">Activity ${index + 1} of ${total} · ${escapeHtml(exercise.cefrLevel)} · ${escapeHtml(exercise.exerciseTypeLabel)} · <span data-exercise-status>${completed ? 'Complete ✓' : 'Not complete'}</span></div>
    <h3>${escapeHtml(exercise.prompt)}</h3>${translation}<div class="button-row">${listen}</div>
    <div class="exercise-interaction">${interaction}</div><div class="exercise-feedback" data-feedback-for="${escapeHtml(exercise.id)}"></div>
  </section>`;
}
