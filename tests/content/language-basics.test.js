import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGE_BASICS } from '../../src/data/language-basics/index.js';

test('Language Basics includes every requested lesson', () => {
  assert.equal(LANGUAGE_BASICS.length, 33);
  const titles = new Set(LANGUAGE_BASICS.map((lesson) => lesson.title));
  for (const title of ['Nouns','Pronouns','Verbs','Direct objects','Indirect objects','Main clauses','Subordinate clauses','Gender in grammar','Cases in grammar','Agreement between words']) {
    assert.equal(titles.has(title), true, title);
  }
});

test('every basics lesson has explanation, breakdown, quiz, manual exercise and connections', () => {
  for (const lesson of LANGUAGE_BASICS) {
    assert.ok(lesson.definition);
    assert.ok(lesson.simpleExplanation);
    assert.ok(lesson.examples.length);
    assert.ok(lesson.breakdown.length);
    assert.ok(lesson.commonMistakes.length);
    assert.ok(lesson.quiz.options.includes(lesson.quiz.answer));
    assert.ok(lesson.manualExercise.prompt);
    assert.ok(lesson.manualExercise.modelAnswer);
    assert.deepEqual(Object.keys(lesson.connections).sort(), ['nl','pl','pt']);
  }
});

