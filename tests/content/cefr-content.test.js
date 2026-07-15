import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES } from '../../src/config/categories.js';
import { CEFR_LEVELS } from '../../src/config/cefrLevels.js';
import { COURSE_CONTENT, EXERCISES_PER_TOPIC, LANGUAGES, TOPICS_PER_LEVEL } from '../../src/data/expandedCourseContent.js';

test('every language, category and CEFR level has a substantial topic set', () => {
  for (const language of Object.keys(LANGUAGES)) {
    for (const category of CATEGORIES) {
      for (const level of CEFR_LEVELS) {
        const topics = COURSE_CONTENT[language]?.[category.id]?.[level.id];
        assert.equal(topics?.length, TOPICS_PER_LEVEL, `${language}/${category.id}/${level.id}`);
        topics.forEach((topic) => assert.equal(topic.exercises.length, EXERCISES_PER_TOPIC, topic.id));
      }
    }
  }
});

test('all generated exercises contain required metadata and unique ids', () => {
  const ids = new Set();
  for (const [language, categories] of Object.entries(COURSE_CONTENT)) {
    for (const [category, levels] of Object.entries(categories)) {
      for (const [cefrLevel, topics] of Object.entries(levels)) {
        for (const topic of topics) {
          assert.equal(topic.language, language);
          assert.equal(topic.category, category);
          assert.equal(topic.cefrLevel, cefrLevel);
          for (const exercise of topic.exercises) {
            for (const field of ['id','language','category','cefrLevel','topicId','lessonId','type','prompt','correctAnswer','acceptedAnswers','explanation','audioText','difficultyMetadata']) {
              assert.notEqual(exercise[field], undefined, `${exercise.id} missing ${field}`);
            }
            assert.equal(ids.has(exercise.id), false, `duplicate ${exercise.id}`);
            ids.add(exercise.id);
          }
        }
      }
    }
  }
  assert.equal(ids.size, 3150);
});

test('difficulty changes exercise production and guidance', () => {
  for (const language of Object.keys(LANGUAGES)) {
    for (const category of CATEGORIES) {
      const a0 = COURSE_CONTENT[language][category.id].A0[0].exercises[0];
      const c2 = COURSE_CONTENT[language][category.id].C2[0].exercises[0];
      if (category.id !== 'speaking' && category.id !== 'writing') assert.equal(a0.type, 'multipleChoice');
      if (category.id === 'speaking') assert.equal(c2.type, 'speaking');
      else assert.ok(COURSE_CONTENT[language][category.id].C2[0].exercises.some((exercise) => ['openResponse', 'manual'].includes(exercise.type)));
      assert.equal(a0.difficultyMetadata.hintLevel, 'strong');
      assert.equal(c2.difficultyMetadata.hintLevel, 'none');
      assert.ok(a0.difficultyMetadata.speechRate < c2.difficultyMetadata.speechRate);
    }
  }
});

test('speech and audio locales stay language-specific', () => {
  const expected = { nl: 'nl-NL', pl: 'pl-PL', pt: 'pt-PT' };
  for (const [language, locale] of Object.entries(expected)) {
    for (const level of CEFR_LEVELS) {
      for (const topic of COURSE_CONTENT[language].speaking[level.id]) {
        assert.equal(topic.exercises[0].locale, locale);
      }
    }
  }
});

