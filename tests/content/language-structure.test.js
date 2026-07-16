import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGE_STRUCTURE } from '../../src/data/languageStructure.js';

test('each language has a detailed score-free structure guide', () => {
  for (const [language, guide] of Object.entries(LANGUAGE_STRUCTURE)) {
    assert.ok(guide.lessons.length >= 31, language);
    assert.equal(guide.locale, language === 'pt' ? 'pt-PT' : language === 'nl' ? 'nl-NL' : 'pl-PL');
    for (const lesson of guide.lessons) {
      assert.equal('quiz' in lesson, false);
      assert.equal('exercises' in lesson, false);
      assert.ok(lesson.examples.length >= 3);
      assert.ok(lesson.breakdown.length >= 3);
      assert.ok(lesson.usefulTrick && lesson.commonMistake && lesson.remember);
    }
  }
});
