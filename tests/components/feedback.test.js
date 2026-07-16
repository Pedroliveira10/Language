import test from 'node:test';
import assert from 'node:assert/strict';
import { AnswerFeedback } from '../../src/components/FeedbackBox.js';

test('correct feedback contains only the concise success message', () => {
  const html = AnswerFeedback({ correct: true, explanation: 'Advanced unrelated model answer.', acceptedAnswers: ['Long model answer'] });
  assert.match(html, />Correct\.<\/strong>/);
  assert.doesNotMatch(html, /Advanced|model answer|Accepted answer/i);
});

test('incorrect feedback retains concise help and the accepted answer', () => {
  const html = AnswerFeedback({ correct: false, explanation: 'Use the finite verb here.', acceptedAnswers: ['ben'] });
  assert.match(html, /Not quite/); assert.match(html, /Use the finite verb/); assert.match(html, /ben/);
});
