import test from 'node:test';
import assert from 'node:assert/strict';

import { ExpandedExerciseRenderer } from '../../src/components/ExpandedExerciseRenderer.js';
import { RichTopicCard } from '../../src/components/RichTopicCard.js';
import { COURSE_CONTENT } from '../../src/data/expandedCourseContent.js';

const topic = COURSE_CONTENT.nl.grammar.A0[0];

test('topic cards display activity progress', () => {
  const markup = RichTopicCard({ topic, completed: 2, total: 5, href: '#/topic' });
  assert.match(markup, /2\/5 activities complete/);
  assert.match(markup, /40%/);
});

test('exercise cards display position and saved completion', () => {
  const markup = ExpandedExerciseRenderer(topic.exercises[0], {
    speechSupported: false,
    index: 0,
    total: topic.exercises.length,
    completed: true
  });
  assert.match(markup, /Activity 1 of 5/);
  assert.match(markup, /Complete ✓/);
  assert.match(markup, /data-exercise-status/);
});
