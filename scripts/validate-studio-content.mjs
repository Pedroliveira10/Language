import { CATEGORIES } from '../src/config/categories.js';
import { CEFR_LEVELS } from '../src/config/cefrLevels.js';
import { COURSE_CONTENT, EXERCISES_PER_TOPIC, LANGUAGES, TOPICS_PER_LEVEL } from '../src/data/expandedCourseContent.js';
import { LANGUAGE_BASICS } from '../src/data/language-basics/index.js';

let topicCount = 0;
let exerciseCount = 0;
const exerciseIds = new Set();

for (const language of Object.keys(LANGUAGES)) {
  for (const category of CATEGORIES) {
    for (const level of CEFR_LEVELS) {
      const topics = COURSE_CONTENT[language]?.[category.id]?.[level.id];
      if (!Array.isArray(topics) || topics.length < TOPICS_PER_LEVEL) throw new Error(`Not enough topics: ${language}/${category.id}/${level.id}`);
      for (const topic of topics) {
        topicCount += 1;
        if (!topic.topicId || !topic.lesson?.id || topic.exercises?.length < EXERCISES_PER_TOPIC) throw new Error(`Incomplete topic: ${topic.id}`);
        for (const exercise of topic.exercises) {
          exerciseCount += 1;
          if (exerciseIds.has(exercise.id)) throw new Error(`Duplicate exercise id: ${exercise.id}`);
          exerciseIds.add(exercise.id);
        }
      }
    }
  }
}

if (LANGUAGE_BASICS.length < 33) throw new Error('Language Basics is incomplete.');
console.log(`Validated ${topicCount} CEFR topics, ${exerciseCount} exercises, and ${LANGUAGE_BASICS.length} Language Basics lessons.`);

