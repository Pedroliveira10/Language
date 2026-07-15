import { escapeHtml } from './studioMarkup.js';

function wordList(values, emptyText = 'None') {
  if (!values?.length) return `<span class="word-token empty">${emptyText}</span>`;
  return values.map((value) => `<span class="word-token">${escapeHtml(typeof value === 'string' ? value : `${value.recognised} → ${value.expected}`)}</span>`).join('');
}

export function SpeechFeedback(result, exerciseId) {
  return `<div class="speech-feedback ${result.accepted ? 'correct' : 'incorrect'}" role="status">
    <h4>Speech recognition score: ${result.score}%</h4>
    <dl>
      <div><dt>Expected sentence</dt><dd>${escapeHtml(result.expected)}</dd></div>
      <div><dt>Recognised sentence</dt><dd>${escapeHtml(result.recognised || 'Nothing recognised')}</dd></div>
      <div><dt>Matching words</dt><dd>${wordList(result.matching)}</dd></div>
      <div><dt>Missing words</dt><dd>${wordList(result.missing)}</dd></div>
      <div><dt>Incorrect words</dt><dd>${wordList(result.incorrect)}</dd></div>
      <div><dt>Additional words</dt><dd>${wordList(result.additional)}</dd></div>
    </dl>
    <p class="recognition-note">This checks recognised words. It is not a professional pronunciation assessment.</p>
    <div class="button-row">
      <button class="button secondary" type="button" data-listen-exercise="${escapeHtml(exerciseId)}">Listen again</button>
      <button class="button" type="button" data-speak-exercise="${escapeHtml(exerciseId)}">Retry</button>
    </div>
  </div>`;
}

export function AnswerFeedback({ correct, explanation, acceptedAnswers = [] }) {
  return `<div class="answer-feedback ${correct ? 'correct' : 'incorrect'}" role="status">
    <strong>${correct ? 'Correct.' : 'Not quite.'}</strong>
    <p>${escapeHtml(explanation)}</p>
    ${!correct && acceptedAnswers.length ? `<p>Accepted answer: ${escapeHtml(acceptedAnswers[0])}</p>` : ''}
  </div>`;
}

