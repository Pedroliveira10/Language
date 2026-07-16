import test from 'node:test';
import assert from 'node:assert/strict';
import { CEFR_LEVELS } from '../../src/config/cefrLevels.js';
import { CATEGORIES } from '../../src/config/categories.js';
import { LANGUAGES } from '../../src/data/expandedCourseContent.js';
import { CATEGORY_SECTIONS, EXERCISES_PER_LEVEL, getExerciseSections, normalizeText, sentenceFromTokens, validateExercise, validateLevelCatalog } from '../../src/data/exerciseCatalog.js';
import { ExpandedExerciseRenderer, shouldShowTranslationHelp } from '../../src/components/ExpandedExerciseRenderer.js';

test('every course path exposes valid unique content and retains the 200-activity target', () => {
  for (const language of Object.keys(LANGUAGES)) for (const category of CATEGORIES) for (const level of CEFR_LEVELS) {
    const sections = getExerciseSections(language, category.id, level.id);
    assert.equal(sections.length, 6);
    assert.equal(sections.reduce((sum, section) => sum + section.targetCount, 0), EXERCISES_PER_LEVEL);
    assert.deepEqual(sections.map((section) => section.targetCount), CATEGORY_SECTIONS[category.id].map((spec) => spec[2]));
    const validation = validateLevelCatalog(language, category.id, level.id, sections);
    assert.equal(validation.contentValid, true, validation.errors.join('\n'));
    assert.equal(new Set(sections.flatMap((section) => section.exercises.map((exercise) => exercise.id))).size, validation.total);
  }
});

test('generated prompts and answers contain one genuine activity', () => {
  const exercises = getExerciseSections('pt', 'grammar', 'A1').flatMap((section) => section.exercises);
  for (const exercise of exercises) {
    assert.doesNotMatch(exercise.prompt, /work with this level-appropriate|focus on this grammar skill|\s\/\s/i);
    assert.doesNotMatch(exercise.correctAnswer, /\s\/\s/);
    assert.doesNotMatch(exercise.prompt, new RegExp(`${exercise.exerciseTypeLabel}\\s+\\d+`, 'i'));
  }
});

test('task-specific formats are structurally valid', () => {
  const sections = getExerciseSections('nl', 'grammar', 'A1');
  const byId = Object.fromEntries(sections.map((section) => [section.id, section.exercises[0]]));
  assert.ok(byId['fill-blank'].blank.includes('____'));
  assert.equal(byId['fill-blank'].correctAnswer.includes(' '), false);
  assert.notEqual(normalizeText(byId['error-correction'].incorrectSentence), normalizeText(byId['error-correction'].correctAnswer));
  assert.notEqual(sentenceFromTokens(byId['sentence-order'].orderingTokens), byId['sentence-order'].correctAnswer);
  assert.equal(byId.translation.translation, null);
});

test('sentence ordering renders movable tokens, reset and submit without a text field', () => {
  const exercise = getExerciseSections('pl', 'grammar', 'A1').find((section) => section.id === 'sentence-order').exercises[0];
  const html = ExpandedExerciseRenderer(exercise, { speechSupported: false, index: 0, total: 5, completed: false });
  assert.match(html, /data-order-token/); assert.match(html, /draggable="true"/); assert.match(html, /data-reset-order/); assert.match(html, /data-submit-order/);
  assert.doesNotMatch(html, /data-input-exercise/);
});

test('translation help is hidden when redundant or answer-revealing', () => {
  assert.equal(shouldShowTranslationHelp({ exerciseType: 'translation', translation: 'hello', sourceText: 'hello' }), false);
  assert.equal(shouldShowTranslationHelp({ exerciseType: 'copying', translation: 'hello', sourceText: 'hello', prompt: 'Copy', correctAnswer: 'olá' }), true);
  assert.equal(shouldShowTranslationHelp({ exerciseType: 'copying', translation: 'hello', sourceText: 'source', prompt: 'Copy', correctAnswer: 'olá' }), true);
});

test('reusable validation rejects malformed content', () => {
  const base = getExerciseSections('nl', 'grammar', 'A1')[0].exercises[0];
  assert.ok(validateExercise({ ...base, prompt: `${base.exerciseTypeLabel} 7: Work with this level-appropriate language`, correctAnswer: 'one / two' }).length >= 2);
});
