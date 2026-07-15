import test from 'node:test';
import assert from 'node:assert/strict';
import { CEFR_LEVELS } from '../../src/config/cefrLevels.js';
import { CATEGORIES } from '../../src/config/categories.js';
import { LANGUAGES } from '../../src/data/expandedCourseContent.js';
import { CATEGORY_SECTIONS, EXERCISES_PER_LEVEL, getExerciseSections, validateLevelCatalog } from '../../src/data/exerciseCatalog.js';

test('every language/category/CEFR path has exactly 200 separated exercises', () => {
  for (const language of Object.keys(LANGUAGES)) for (const category of CATEGORIES) for (const level of CEFR_LEVELS) {
    const sections = getExerciseSections(language, category.id, level.id);
    assert.equal(sections.length, 6);
    assert.equal(sections.flatMap((section) => section.exercises).length, EXERCISES_PER_LEVEL);
    assert.deepEqual(sections.map((section) => section.count), CATEGORY_SECTIONS[category.id].map((spec) => spec[2]));
    assert.equal(validateLevelCatalog(language, category.id, level.id, sections).valid, true);
    sections.forEach((section) => section.exercises.forEach((exercise) => assert.equal(exercise.exerciseType, section.id)));
  }
});

test('catalog validation detects duplicates and missing content', () => {
  const sections = getExerciseSections('nl', 'grammar', 'A1').map((section) => ({ ...section, exercises: [...section.exercises] }));
  sections[0].exercises[1] = { ...sections[0].exercises[1], prompt: sections[0].exercises[0].prompt };
  const result = validateLevelCatalog('nl', 'grammar', 'A1', sections);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.startsWith('Duplicate prompt')));
});
