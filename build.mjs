import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const block = (...lines) => lines.join('\n');

async function replaceInFile(relativePath, replacements) {
  const path = join(root, relativePath);
  let text = await readFile(path, 'utf8');
  for (const [from, to, label] of replacements) {
    if (text.includes(to)) continue;
    if (!text.includes(from)) throw new Error(`${relativePath}: could not find ${label}`);
    text = text.replace(from, to);
  }
  await writeFile(path, text, 'utf8');
}

await replaceInFile('src/studio-app.js', [
  [
    "import { COURSE_CONTENT, LANGUAGES, findTopic, getTopics } from './data/courseContent.js';",
    "import { COURSE_CONTENT, LANGUAGES, findTopic, getTopics } from './data/expandedCourseContent.js';",
    'expanded content import'
  ],
  [
    "import { TopicCard } from './components/TopicCard.js';",
    "import { RichTopicCard } from './components/RichTopicCard.js';",
    'rich topic card import'
  ],
  [
    "import { ExerciseRenderer } from './components/ExerciseRenderer.js';",
    "import { ExpandedExerciseRenderer } from './components/ExpandedExerciseRenderer.js';",
    'expanded renderer import'
  ],
  [
    block(
      'function topicContext(topic) {',
      '  return {',
      '    language: topic.language,',
      '    category: topic.category,',
      '    cefrLevel: topic.cefrLevel,',
      '    topicId: topic.topicId,',
      '    lessonId: topic.lesson.id',
      '  };',
      '}'
    ),
    block(
      'function topicContext(topic, exercise = null) {',
      '  return {',
      '    language: topic.language,',
      '    category: topic.category,',
      '    cefrLevel: topic.cefrLevel,',
      '    topicId: topic.topicId,',
      '    lessonId: exercise?.lessonId || topic.lesson.id',
      '  };',
      '}',
      '',
      'function topicProgress(topic) {',
      '  const completed = topic.exercises.filter((exercise) =>',
      '    Boolean(getLessonProgress(progress, topicContext(topic, exercise))?.completed)).length;',
      '  return { completed, total: topic.exercises.length };',
      '}'
    ),
    'topic progress helpers'
  ],
  [
    '    const total = CEFR_LEVELS.reduce((sum, level) => sum + getTopics(languageId, category.id, level.id).length, 0);',
    block(
      '    const total = CEFR_LEVELS.reduce((sum, level) => sum + getTopics(languageId, category.id, level.id)',
      '      .reduce((levelTotal, topic) => levelTotal + topic.exercises.length, 0), 0);'
    ),
    'language activity total'
  ],
  [
    '    const total = getTopics(languageId, categoryId, level.id).length;',
    block(
      '    const total = getTopics(languageId, categoryId, level.id)',
      '      .reduce((sum, topic) => sum + topic.exercises.length, 0);'
    ),
    'level activity total'
  ],
  [
    block(
      '  const cards = topics.map((topic) => TopicCard({',
      '    topic,',
      '    completed: Boolean(getLessonProgress(progress, topicContext(topic))?.completed),',
      "    href: route(['language', languageId, 'category', categoryId, 'level', level, 'topic', topic.topicId])",
      "  })).join('');"
    ),
    block(
      '  const cards = topics.map((topic) => {',
      '    const summary = topicProgress(topic);',
      '    return RichTopicCard({',
      '      topic,',
      '      completed: summary.completed,',
      '      total: summary.total,',
      "      href: route(['language', languageId, 'category', categoryId, 'level', level, 'topic', topic.topicId])",
      '    });',
      "  }).join('');"
    ),
    'topic cards'
  ],
  [
    '  <div class="exercise-stack">${topic.exercises.map((exercise) => ExerciseRenderer(exercise, { speechSupported: isSpeechRecognitionSupported(window) })).join(\'\')}</div>`;',
    block(
      '  <div class="exercise-stack">${topic.exercises.map((exercise, index) => ExpandedExerciseRenderer(exercise, {',
      '    speechSupported: isSpeechRecognitionSupported(window),',
      '    index,',
      '    total: topic.exercises.length,',
      '    completed: Boolean(getLessonProgress(progress, topicContext(topic, exercise))?.completed)',
      "  })).join('')}</div>`;"
    ),
    'exercise stack'
  ],
  [
    block(
      'function storeExerciseResult(exercise, result) {',
      '  recordExerciseAttempt(progress, topicContext(currentTopic), { ...result, type: exercise.type });',
      '}'
    ),
    block(
      'function storeExerciseResult(exercise, result) {',
      '  const record = recordExerciseAttempt(progress, topicContext(currentTopic, exercise), { ...result, type: exercise.type });',
      '  if (record.completed) {',
      '    const card = root.querySelector(`[data-exercise-card="${exercise.id}"]`);',
      "    card?.classList.add('is-complete');",
      "    const status = card?.querySelector('[data-exercise-status]');",
      "    if (status) status.textContent = 'Complete ✓';",
      '  }',
      '  return record;',
      '}'
    ),
    'per-activity progress storage'
  ]
]);

await replaceInFile('scripts/validate-studio-content.mjs', [
  [
    "import { COURSE_CONTENT, LANGUAGES } from '../src/data/courseContent.js';",
    "import { COURSE_CONTENT, EXERCISES_PER_TOPIC, LANGUAGES, TOPICS_PER_LEVEL } from '../src/data/expandedCourseContent.js';",
    'expanded validator import'
  ],
  [
    '      if (!Array.isArray(topics) || topics.length === 0) throw new Error(`No topics: ${language}/${category.id}/${level.id}`);',
    '      if (!Array.isArray(topics) || topics.length < TOPICS_PER_LEVEL) throw new Error(`Not enough topics: ${language}/${category.id}/${level.id}`);',
    'minimum topics validation'
  ],
  [
    '        if (!topic.topicId || !topic.lesson?.id || !topic.exercises?.length) throw new Error(`Incomplete topic: ${topic.id}`);',
    '        if (!topic.topicId || !topic.lesson?.id || topic.exercises?.length < EXERCISES_PER_TOPIC) throw new Error(`Incomplete topic: ${topic.id}`);',
    'minimum exercises validation'
  ]
]);

await replaceInFile('tests/content/cefr-content.test.js', [
  [
    "import { COURSE_CONTENT, LANGUAGES } from '../../src/data/courseContent.js';",
    "import { COURSE_CONTENT, EXERCISES_PER_TOPIC, LANGUAGES, TOPICS_PER_LEVEL } from '../../src/data/expandedCourseContent.js';",
    'expanded test import'
  ],
  [
    "test('every language, category and CEFR level has two topics', () => {",
    "test('every language, category and CEFR level has a substantial topic set', () => {",
    'topic count test name'
  ],
  [
    '        assert.equal(topics?.length, 2, `${language}/${category.id}/${level.id}`);',
    block(
      '        assert.equal(topics?.length, TOPICS_PER_LEVEL, `${language}/${category.id}/${level.id}`);',
      '        topics.forEach((topic) => assert.equal(topic.exercises.length, EXERCISES_PER_TOPIC, topic.id));'
    ),
    'topic and exercise count assertion'
  ],
  [
    '  assert.equal(ids.size, 252);',
    '  assert.equal(ids.size, 3150);',
    'exercise total assertion'
  ]
]);

console.log('Applied expanded curriculum wiring.');
