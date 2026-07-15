import test from 'node:test';
import assert from 'node:assert/strict';
import { checkManualInput } from '../../src/exercise-types/ManualInput.js';
import { checkMultipleChoice } from '../../src/exercise-types/MultipleChoice.js';
import { checkSentenceOrder } from '../../src/exercise-types/SentenceOrder.js';

test('manual input ignores case and surrounding spaces', () => {
  assert.equal(checkManualInput({ answer: 'Olá' }, '  olá '), true);
});

test('multiple choice requires the exact answer', () => {
  assert.equal(checkMultipleChoice({ answer: 'Hallo' }, 'Hallo'), true);
  assert.equal(checkMultipleChoice({ answer: 'Hallo' }, 'Tot ziens'), false);
});

test('sentence ordering compares the complete sequence', () => {
  const exercise = { answer: ['Ik', 'ben', 'Pedro'] };
  assert.equal(checkSentenceOrder(exercise, ['Ik', 'ben', 'Pedro']), true);
  assert.equal(checkSentenceOrder(exercise, ['Pedro', 'ben', 'Ik']), false);
});

