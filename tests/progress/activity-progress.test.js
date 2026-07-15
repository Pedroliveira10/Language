import test from 'node:test';
import assert from 'node:assert/strict';

import { createEmptyProgress } from '../../src/services/migration.js';
import { progressSummary, recordExerciseAttempt } from '../../src/services/studioProgress.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  };
}

test('activities in one topic save as separate progress records', () => {
  const progress = createEmptyProgress();
  const storage = memoryStorage();
  const shared = { language: 'nl', category: 'grammar', cefrLevel: 'A0', topicId: 'verbs' };

  recordExerciseAttempt(progress, { ...shared, lessonId: 'verbs-lesson' }, { correct: true, completed: true, type: 'multipleChoice', answer: 'ben' }, storage);
  recordExerciseAttempt(progress, { ...shared, lessonId: 'verbs-practice-002' }, { correct: false, completed: false, type: 'manual', answer: 'is' }, storage);

  const summary = progressSummary(progress, shared);
  assert.equal(summary.records, 2);
  assert.equal(summary.completed, 1);
  assert.equal(summary.correct, 1);
  assert.equal(summary.incorrect, 1);
});
