import test from 'node:test';
import assert from 'node:assert/strict';

import { CATEGORIES } from '../../src/config/categories.js';
import { CEFR_LEVELS } from '../../src/config/cefrLevels.js';
import {
  COURSE_CONTENT,
  EXERCISES_PER_TOPIC,
  LANGUAGES,
  TOPICS_PER_LEVEL
} from '../../src/data/expandedCourseContent.js';

function allTopics() {
  return Object.values(COURSE_CONTENT).flatMap((categories) =>
    Object.values(categories).flatMap((levels) => Object.values(levels).flat()));
}

test('expanded catalog contains 630 topics and 3150 activities', () => {
  const topics = allTopics();
  assert.equal(topics.length, 630);
  assert.equal(topics.flatMap((topic) => topic.exercises).length, 3150);
});

test('each learning path has five topics with five independently tracked activities', () => {
  for (const language of Object.keys(LANGUAGES)) {
    for (const category of CATEGORIES) {
      for (const level of CEFR_LEVELS) {
        const topics = COURSE_CONTENT[language][category.id][level.id];
        assert.equal(topics.length, TOPICS_PER_LEVEL);
        for (const topic of topics) {
          assert.equal(topic.exercises.length, EXERCISES_PER_TOPIC);
          assert.equal(new Set(topic.exercises.map((exercise) => exercise.lessonId)).size, EXERCISES_PER_TOPIC);
        }
      }
    }
  }
});

test('non-speaking topics mix recognition and production activities', () => {
  for (const topic of allTopics().filter((item) => item.category !== 'speaking')) {
    const types = new Set(topic.exercises.map((exercise) => exercise.type));
    assert.ok(types.has('multipleChoice') || types.has('manual'));
    assert.ok(types.size >= 2, `${topic.id} should vary activity types`);
  }
});

test('speaking topics contain five locale-specific microphone activities', () => {
  const locales = { nl: 'nl-NL', pl: 'pl-PL', pt: 'pt-PT' };
  for (const topic of allTopics().filter((item) => item.category === 'speaking')) {
    assert.equal(topic.exercises.length, 5);
    topic.exercises.forEach((exercise) => {
      assert.equal(exercise.type, 'speaking');
      assert.equal(exercise.locale, locales[topic.language]);
    });
  }
});
