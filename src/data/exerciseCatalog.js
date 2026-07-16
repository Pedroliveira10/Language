import { getTopics } from './expandedCourseContent.js';

export const EXERCISES_PER_LEVEL = 200;

export const CATEGORY_SECTIONS = Object.freeze({
  grammar: [
    ['multiple-choice', 'Multiple Choice', 40, 'Choose the grammatically correct answer.'],
    ['fill-blank', 'Fill in the Blank', 40, 'Complete a sentence with the missing form.'],
    ['sentence-order', 'Sentence Ordering', 30, 'Put sentence elements into a natural order.'],
    ['translation', 'Translation', 30, 'Translate accurately while preserving meaning.'],
    ['error-correction', 'Error Correction', 30, 'Find and correct a grammar problem.'],
    ['manual-writing', 'Manual Writing', 30, 'Produce the structure independently.']
  ],
  vocabulary: [
    ['word-meaning', 'Word to Meaning', 40, 'Choose the meaning that fits the word and context.'],
    ['meaning-word', 'Meaning to Word', 40, 'Recall the target-language word or phrase.'],
    ['sentence-context', 'Sentence Context', 30, 'Use vocabulary in a meaningful sentence.'],
    ['matching', 'Matching', 30, 'Match related words, meanings and contexts.'],
    ['translation', 'Translation', 30, 'Translate vocabulary in context.'],
    ['manual-answer', 'Manual Answer', 30, 'Write a suitable word or phrase yourself.']
  ],
  pronunciation: [
    ['listen-select', 'Listen and Select', 40, 'Listen and choose what you hear.'],
    ['sound-recognition', 'Sound Recognition', 40, 'Recognise an important sound contrast.'],
    ['word-comparison', 'Word Comparison', 30, 'Compare the sound of related words.'],
    ['stress-syllable', 'Stress and Syllables', 30, 'Notice stress, syllables and rhythm.'],
    ['listen-type', 'Listen and Type', 30, 'Type the phrase that you hear.'],
    ['difficult-sound', 'Difficult Sounds', 30, 'Practise a language-specific sound pattern.']
  ],
  writing: [
    ['copying', 'Copying', 30, 'Copy accurately and notice spelling.'],
    ['sentence-completion', 'Sentence Completion', 30, 'Complete a written sentence.'],
    ['sentence-order', 'Sentence Ordering', 30, 'Build a coherent written sentence.'],
    ['translation', 'Translation', 40, 'Translate into natural written language.'],
    ['error-correction', 'Error Correction', 30, 'Edit a sentence for accuracy.'],
    ['independent-writing', 'Independent Writing', 40, 'Write a complete response without a fixed template.']
  ],
  conversation: [
    ['choose-reply', 'Choose the Reply', 40, 'Choose the most natural response.'],
    ['complete-dialogue', 'Complete the Dialogue', 40, 'Supply the missing conversational turn.'],
    ['listening-comprehension', 'Listening Comprehension', 30, 'Understand a short spoken exchange.'],
    ['conversation-order', 'Conversation Ordering', 30, 'Put dialogue turns in a natural order.'],
    ['manual-reply', 'Manual Reply', 30, 'Write your own appropriate reply.'],
    ['scenario-response', 'Scenario Response', 30, 'Respond to a realistic situation.']
  ],
  speaking: [
    ['repeat-word', 'Repeat a Word', 40, 'Repeat key words clearly.'],
    ['repeat-sentence', 'Repeat a Sentence', 40, 'Repeat a complete sentence with natural rhythm.'],
    ['answer-question', 'Answer a Question', 30, 'Give a short spoken answer.'],
    ['describe-situation', 'Describe a Situation', 30, 'Describe what is happening aloud.'],
    ['conversation-response', 'Conversation Response', 30, 'Respond naturally in a spoken exchange.'],
    ['free-speaking', 'Free Speaking', 30, 'Speak independently with level-appropriate detail.']
  ]
});

const TYPE_MODE = Object.freeze({
  'multiple-choice': 'multipleChoice', 'word-meaning': 'multipleChoice', 'meaning-word': 'multipleChoice',
  'listen-select': 'multipleChoice', 'sound-recognition': 'multipleChoice', 'choose-reply': 'multipleChoice',
  'listening-comprehension': 'multipleChoice', matching: 'multipleChoice',
  'repeat-word': 'speaking', 'repeat-sentence': 'speaking', 'answer-question': 'speaking',
  'describe-situation': 'speaking', 'conversation-response': 'speaking', 'free-speaking': 'speaking',
  'independent-writing': 'openResponse', 'manual-writing': 'openResponse', 'manual-answer': 'openResponse',
  'manual-reply': 'openResponse', 'scenario-response': 'openResponse'
});

const TASK_OPENERS = [
  'Everyday situation', 'At home', 'At work or study', 'While travelling', 'In a public service',
  'With a friend', 'In a formal exchange', 'During a phone call', 'In a short message', 'In a follow-up question'
];

function sequenceAt(seeds, index) {
  const size = seeds.length;
  return [seeds[index % size], seeds[Math.floor(index / size) % size], seeds[Math.floor(index / (size * size)) % size]];
}

function instruction(sectionId, source, target) {
  if (sectionId.includes('translation') || sectionId === 'meaning-word') return `Translate into the target language: ${source}`;
  if (sectionId.includes('order')) return `Rebuild this sentence sequence in its natural order: ${target.split(/\s+/).reverse().join(' / ')}`;
  if (sectionId.includes('error')) return `Rewrite this model accurately and naturally: ${target}`;
  if (sectionId.includes('listen') || sectionId.includes('sound') || sectionId.includes('stress') || sectionId.includes('word-comparison') || sectionId.includes('difficult')) return `Listen carefully, then identify or reproduce: ${target}`;
  if (sectionId.startsWith('repeat-')) return `Listen, then repeat: ${target}`;
  if (sectionId.includes('question')) return `Answer aloud using this language pattern: ${target}`;
  if (sectionId.includes('reply') || sectionId.includes('dialogue') || sectionId.includes('conversation') || sectionId.includes('scenario')) return `Give the next natural turn after this cue: ${target}`;
  if (sectionId.includes('blank') || sectionId.includes('completion')) return `Complete the missing part of this model: ${target.replace(/\p{L}+[.!?]?$/u, '_____')}`;
  return `Work with this level-appropriate language: ${target}`;
}

function distractors(answer, seedAnswers, index) {
  const choices = [answer];
  for (let offset = 1; choices.length < 4 && offset < seedAnswers.length + 5; offset += 1) {
    const candidate = seedAnswers[(index + offset * 2) % seedAnswers.length];
    if (!choices.includes(candidate)) choices.push(candidate);
  }
  while (choices.length < 4) choices.push(`${answer} (${choices.length})`);
  const shift = index % choices.length;
  return choices.slice(shift).concat(choices.slice(0, shift));
}

function buildSection(language, category, level, spec, allSeeds) {
  const [id, label, count, description] = spec;
  const mode = TYPE_MODE[id] || 'manual';
  const uniqueSeeds = [...new Map(allSeeds.map((seed) => [seed.correctAnswer, seed])).values()];
  const baseAnswers = uniqueSeeds.map((seed) => seed.correctAnswer);
  const exercises = Array.from({ length: count }, (_, index) => {
    const sequence = sequenceAt(uniqueSeeds, index);
    const target = sequence.map((seed) => seed.correctAnswer).join(' / ');
    const source = sequence.map((seed) => seed.translation || seed.prompt).join(' / ');
    const context = TASK_OPENERS[(index + category.length + level.length) % TASK_OPENERS.length];
    const prompt = `${context} · ${label} ${index + 1}: ${instruction(id, source, target)}`;
    return {
      ...sequence[0],
      id: `${language}-${category}-${level.toLowerCase()}-${id}-${String(index + 1).padStart(3, '0')}`,
      topicId: id,
      lessonId: `${id}-${String(index + 1).padStart(3, '0')}`,
      exerciseType: id,
      exerciseTypeLabel: label,
      type: mode,
      prompt,
      correctAnswer: target,
      acceptedAnswers: [target],
      options: mode === 'multipleChoice' ? distractors(target, baseAnswers, index) : [],
      audioText: target,
      translation: source,
      explanation: `${description} Compare the complete response with the model and notice the ${level} pattern.`,
      sequenceSources: sequence.map((seed) => seed.id)
    };
  });
  return Object.freeze({ id, label, count, description, exercises: Object.freeze(exercises) });
}

const cache = new Map();

export function getExerciseSections(language, category, level) {
  const key = `${language}|${category}|${level}`;
  if (cache.has(key)) return cache.get(key);
  const topics = getTopics(language, category, level);
  const seeds = topics.flatMap((topic) => topic.exercises);
  const specs = CATEGORY_SECTIONS[category] || [];
  const sections = seeds.length ? specs.map((spec) => buildSection(language, category, level, spec, seeds)) : [];
  cache.set(key, sections);
  return sections;
}

export function getExerciseSection(language, category, level, sectionId) {
  return getExerciseSections(language, category, level).find((section) => section.id === sectionId) || null;
}

export function validateLevelCatalog(language, category, level, sections = getExerciseSections(language, category, level)) {
  const errors = [];
  const exercises = sections.flatMap((section) => section.exercises);
  if (exercises.length !== EXERCISES_PER_LEVEL) errors.push(`Expected ${EXERCISES_PER_LEVEL}; found ${exercises.length}.`);
  if (sections.reduce((sum, section) => sum + section.count, 0) !== EXERCISES_PER_LEVEL) errors.push('Section totals do not add up to 200.');
  const ids = new Set();
  const prompts = new Set();
  const answersBySection = new Map();
  for (const exercise of exercises) {
    const prompt = exercise.prompt.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
    if (ids.has(exercise.id)) errors.push(`Duplicate ID: ${exercise.id}`);
    if (prompts.has(prompt)) errors.push(`Duplicate prompt: ${exercise.id}`);
    const answer = exercise.correctAnswer.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
    const sectionAnswers = answersBySection.get(exercise.exerciseType) || new Set();
    if (sectionAnswers.has(answer)) errors.push(`Duplicate answer in ${exercise.exerciseType}: ${exercise.id}`);
    if (!exercise.explanation) errors.push(`Missing explanation: ${exercise.id}`);
    if (!exercise.correctAnswer || !exercise.acceptedAnswers?.length) errors.push(`Missing accepted answer: ${exercise.id}`);
    ids.add(exercise.id);
    prompts.add(prompt);
    sectionAnswers.add(answer);
    answersBySection.set(exercise.exerciseType, sectionAnswers);
  }
  return { valid: errors.length === 0, errors, total: exercises.length };
}

export function findExercise(language, category, level, sectionId, exerciseId) {
  return getExerciseSection(language, category, level, sectionId)?.exercises.find((exercise) => exercise.id === exerciseId) || null;
}
