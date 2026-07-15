import { escapeHtml } from './studioMarkup.js';
import { MicrophoneButton } from './MicrophoneButton.js';

export function ExerciseRenderer(exercise, { speechSupported }) {
  const translation = exercise.translation ? `<p class="translation"><strong>Translation:</strong> ${escapeHtml(exercise.translation)}</p>` : '';
  const listen = exercise.audioText ? `<button class="button secondary" type="button" data-listen-exercise="${escapeHtml(exercise.id)}">🔊 Listen</button>` : '';
  let interaction = '';
  if (exercise.type === 'multipleChoice') {
    interaction = `<div class="answer-options">${exercise.options.map((option) => `<button class="answer-option" type="button" data-answer-exercise="${escapeHtml(exercise.id)}" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`;
  } else if (exercise.type === 'speaking') {
    interaction = MicrophoneButton({ supported: speechSupported, exerciseId: exercise.id });
  } else if (exercise.type === 'openResponse') {
    interaction = `<label class="manual-field">Your answer<textarea data-input-exercise="${escapeHtml(exercise.id)}" rows="6" placeholder="Write a complete answer. Several answers may be valid."></textarea></label>
      <button class="button" type="button" data-reveal-exercise="${escapeHtml(exercise.id)}">Compare with model answer</button>`;
  } else {
    interaction = `<label class="manual-field">Your answer<input type="text" data-input-exercise="${escapeHtml(exercise.id)}" autocomplete="off" placeholder="Type your answer"></label>
      <button class="button" type="button" data-check-exercise="${escapeHtml(exercise.id)}">Check answer</button>`;
  }
  return `<section class="exercise-card" data-exercise-card="${escapeHtml(exercise.id)}">
    <div class="exercise-kicker">${escapeHtml(exercise.cefrLevel)} · ${escapeHtml(exercise.type)}</div>
    <h3>${escapeHtml(exercise.prompt)}</h3>
    ${translation}
    <div class="button-row">${listen}</div>
    <div class="exercise-interaction">${interaction}</div>
    <div class="exercise-feedback" data-feedback-for="${escapeHtml(exercise.id)}"></div>
  </section>`;
}

