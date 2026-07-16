import { CATEGORIES } from '../src/config/categories.js';
import { CEFR_LEVELS } from '../src/config/cefrLevels.js';
import { COURSE_CONTENT, EXERCISES_PER_TOPIC, LANGUAGES, TOPICS_PER_LEVEL } from '../src/data/expandedCourseContent.js';
import { LANGUAGE_BASICS } from '../src/data/language-basics/index.js';
import { EXERCISES_PER_LEVEL, getExerciseSections, validateLevelCatalog } from '../src/data/exerciseCatalog.js';
import { LANGUAGE_STRUCTURE } from '../src/data/languageStructure.js';

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
let expandedExerciseCount = 0;
for (const language of Object.keys(LANGUAGES)) {
  for (const category of CATEGORIES) {
    for (const level of CEFR_LEVELS) {
      const sections = getExerciseSections(language, category.id, level.id);
      const validation = validateLevelCatalog(language, category.id, level.id, sections);
      if (!validation.contentValid) throw new Error(`${language}/${category.id}/${level.id}: ${validation.errors.join(' ')}`);
      if (sections.reduce((sum, section) => sum + section.targetCount, 0) !== EXERCISES_PER_LEVEL) throw new Error(`Incorrect target total: ${language}/${category.id}/${level.id}`);
      expandedExerciseCount += validation.total;
    }
  }
  const guide = LANGUAGE_STRUCTURE[language];
  if (!guide || guide.lessons.length < 31) throw new Error(`Incomplete language structure guide: ${language}`);
  for (const lesson of guide.lessons) {
    for (const field of ['definition','whyItMatters','recognition','englishComparison','languageExplanation','commonMistake','usefulTrick','remember','connection','summary']) {
      if (!lesson[field]) throw new Error(`Missing ${field}: ${language}/${lesson.id}`);
    }
  }
}
console.log(`Validated ${topicCount} seed topics, ${exerciseCount} seed activities, ${expandedExerciseCount} separated exercises, and 3 language-structure guides.`);
