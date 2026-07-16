import { LANGUAGES, getTopics } from './expandedCourseContent.js';

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
    ['word-meaning', 'Word to Meaning', 40, 'Choose the meaning that fits the phrase.'],
    ['meaning-word', 'Meaning to Word', 40, 'Recall the target-language phrase.'],
    ['sentence-context', 'Sentence Context', 30, 'Use vocabulary in a meaningful sentence.'],
    ['matching', 'Matching', 30, 'Match a phrase to its meaning.'],
    ['translation', 'Translation', 30, 'Translate vocabulary in context.'],
    ['manual-answer', 'Manual Answer', 30, 'Write a suitable phrase yourself.']
  ],
  pronunciation: [
    ['listen-select', 'Listen and Select', 40, 'Listen and choose what you hear.'],
    ['sound-recognition', 'Sound Recognition', 40, 'Recognise an important sound pattern.'],
    ['word-comparison', 'Word Comparison', 30, 'Compare a phrase with its spoken form.'],
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
    ['independent-writing', 'Independent Writing', 40, 'Write a complete response.']
  ],
  conversation: [
    ['choose-reply', 'Choose the Reply', 40, 'Choose the most natural response.'],
    ['complete-dialogue', 'Complete the Dialogue', 40, 'Supply the missing conversational turn.'],
    ['listening-comprehension', 'Listening Comprehension', 30, 'Understand a short spoken exchange.'],
    ['conversation-order', 'Conversation Ordering', 30, 'Put dialogue elements in a natural order.'],
    ['manual-reply', 'Manual Reply', 30, 'Write your own appropriate reply.'],
    ['scenario-response', 'Scenario Response', 30, 'Respond to a realistic situation.']
  ],
  speaking: [
    ['repeat-word', 'Repeat a Word', 40, 'Repeat key language clearly.'],
    ['repeat-sentence', 'Repeat a Sentence', 40, 'Repeat a complete sentence with natural rhythm.'],
    ['answer-question', 'Answer a Question', 30, 'Give a short spoken answer.'],
    ['describe-situation', 'Describe a Situation', 30, 'Describe the idea aloud.'],
    ['conversation-response', 'Conversation Response', 30, 'Respond naturally in a spoken exchange.'],
    ['free-speaking', 'Free Speaking', 30, 'Speak independently with level-appropriate detail.']
  ]
});

const MULTIPLE_CHOICE = new Set(['multiple-choice','word-meaning','meaning-word','listen-select','sound-recognition','matching','choose-reply','listening-comprehension']);
const SPEAKING = new Set(['repeat-word','repeat-sentence','answer-question','describe-situation','conversation-response','free-speaking']);
const OPEN = new Set(['independent-writing','manual-writing','manual-answer','manual-reply','scenario-response']);
const ORDERING = new Set(['sentence-order','conversation-order']);
const FORBIDDEN_PROMPT_TEXT = ['work with this level-appropriate language','rewrite this model accurately and naturally','complete the missing part of this model'];

export function normalizeText(value) {
  return String(value || '').normalize('NFC').toLocaleLowerCase().replace(/\s+/g, ' ').replace(/^[\s.,!?;:]+|[\s.,!?;:]+$/g, '').trim();
}

export function tokenizeSentence(sentence) {
  return String(sentence || '').trim().split(/\s+/).filter(Boolean);
}

export function sentenceFromTokens(tokens) {
  return tokens.join(' ').replace(/\s+([,.;!?])/g, '$1').replace(/([¿¡])\s+/g, '$1');
}

export function shuffleTokens(tokens) {
  if (tokens.length < 2) return [...tokens];
  const shuffled = [...tokens].reverse();
  if (shuffled.every((token, index) => token === tokens[index])) shuffled.push(shuffled.shift());
  return shuffled;
}

function blankSentence(sentence) {
  const tokens = tokenizeSentence(sentence);
  const index = Math.max(0, tokens.length - 1);
  const match = tokens[index].match(/^(.*?)([.,!?;:]*)$/u);
  const answer = match?.[1] || tokens[index];
  tokens[index] = `____${match?.[2] || ''}`;
  return { promptSentence: sentenceFromTokens(tokens), answer };
}

function incorrectSentence(sentence) {
  const tokens = tokenizeSentence(sentence);
  if (tokens.length < 3) return null;
  const first = tokens.length > 3 ? 1 : 0;
  const second = first + 1;
  [tokens[first], tokens[second]] = [tokens[second], tokens[first]];
  const incorrect = sentenceFromTokens(tokens);
  return normalizeText(incorrect) === normalizeText(sentence) ? null : incorrect;
}

function distractors(value, pool, index) {
  const options = [value];
  for (let offset = 1; options.length < 4 && offset <= pool.length * 2; offset += 1) {
    const candidate = pool[(index + offset) % pool.length];
    if (candidate && !options.includes(candidate)) options.push(candidate);
  }
  if (options.length < 2) return [];
  const shift = index % options.length;
  return options.slice(shift).concat(options.slice(0, shift));
}

function taskData(sectionId, seed, seedPool, languageName, index) {
  const target = seed.correctAnswer;
  const source = seed.translation;
  const targetPool = seedPool.map((item) => item.correctAnswer);
  const sourcePool = seedPool.map((item) => item.translation).filter(Boolean);
  if (sectionId === 'translation') return { prompt: `Translate from English into ${languageName}: ${source}`, answer: target, translation: null };
  if (sectionId === 'word-meaning') return { prompt: `Choose the correct meaning of: ${target}`, answer: source, options: distractors(source, sourcePool, index), translation: null };
  if (sectionId === 'meaning-word') return { prompt: `Choose the ${languageName} phrase for: ${source}`, answer: target, options: distractors(target, targetPool, index), translation: null };
  if (sectionId === 'fill-blank' || sectionId === 'sentence-completion') {
    const blank = blankSentence(target);
    return { prompt: `Complete the sentence: ${blank.promptSentence}`, answer: blank.answer, translation: null, blank: blank.promptSentence };
  }
  if (ORDERING.has(sectionId)) return { prompt: `Arrange the words to express: ${source}`, answer: target, tokens: shuffleTokens(tokenizeSentence(target)), translation: null };
  if (sectionId === 'error-correction') {
    const incorrect = incorrectSentence(target);
    return { prompt: `Correct the sentence: ${incorrect}`, answer: target, incorrectSentence: incorrect, translation: null, explanation: `The words in “${incorrect}” are in the wrong order. Compare them with “${target}”.` };
  }
  if (sectionId === 'listen-select' || sectionId === 'sound-recognition' || sectionId === 'listening-comprehension') return { prompt: `Listen and choose the sentence that means: ${source}`, answer: target, options: distractors(target, targetPool, index), translation: null };
  if (sectionId === 'listen-type') return { prompt: `Listen and type the sentence that means: ${source}`, answer: target, translation: null };
  if (sectionId === 'multiple-choice') return { prompt: `Choose the correct ${languageName} sentence for: ${source}`, answer: target, options: distractors(target, targetPool, index), translation: null };
  if (sectionId === 'matching') return { prompt: `Choose the meaning of: ${target}`, answer: source, options: distractors(source, sourcePool, index), translation: null };
  if (sectionId === 'copying') return { prompt: `Copy exactly: ${target}`, answer: target, translation: source };
  if (sectionId.startsWith('repeat-')) return { prompt: `Listen and repeat: ${target}`, answer: target, translation: source };
  if (SPEAKING.has(sectionId)) return { prompt: `Respond aloud in ${languageName}: ${source}`, answer: target, translation: null };
  if (sectionId.includes('reply') || sectionId.includes('dialogue') || sectionId.includes('scenario')) return { prompt: `Respond naturally in ${languageName}: ${source}`, answer: target, translation: null };
  if (sectionId.includes('sound') || sectionId.includes('stress') || sectionId.includes('comparison') || sectionId.includes('difficult')) return { prompt: `Listen and practise: ${target}`, answer: target, translation: source };
  return { prompt: `Write this idea in ${languageName}: ${source}`, answer: target, translation: null };
}

function buildSection(language, category, level, spec, allSeeds) {
  const [id, label, targetCount, description] = spec;
  const languageName = LANGUAGES[language].name;
  const seedsByAnswer = new Map();
  for (const seed of allSeeds) {
    const key = normalizeText(seed.correctAnswer);
    const current = seedsByAnswer.get(key);
    if (!current || (!current.translation && seed.translation)) seedsByAnswer.set(key, seed);
  }
  const uniqueSeeds = [...seedsByAnswer.values()];
  const exercises = uniqueSeeds.map((seed, index) => {
    const task = taskData(id, seed, uniqueSeeds, languageName, index);
    return Object.freeze({
      ...seed,
      id: `${language}-${category}-${level.toLowerCase()}-${id}-${String(index + 1).padStart(3, '0')}`,
      topicId: id,
      lessonId: `${id}-${String(index + 1).padStart(3, '0')}`,
      exerciseType: id,
      exerciseTypeLabel: label,
      type: ORDERING.has(id) ? 'sentenceOrder' : MULTIPLE_CHOICE.has(id) ? 'multipleChoice' : SPEAKING.has(id) ? 'speaking' : OPEN.has(id) ? 'openResponse' : 'manual',
      prompt: task.prompt,
      correctAnswer: task.answer,
      acceptedAnswers: [task.answer],
      options: task.options || [],
      orderingTokens: task.tokens || [],
      incorrectSentence: task.incorrectSentence || null,
      blank: task.blank || null,
      audioText: seed.correctAnswer,
      translation: task.translation,
      explanation: task.explanation || `${description} The model answer is “${task.answer}”.`,
      sourceText: seed.translation,
      targetCount
    });
  });
  return Object.freeze({ id, label, count: exercises.length, targetCount, description, exercises: Object.freeze(exercises) });
}

const cache = new Map();
export function getExerciseSections(language, category, level) {
  const key = `${language}|${category}|${level}`;
  if (cache.has(key)) return cache.get(key);
  const seeds = getTopics(language, category, level).flatMap((topic) => topic.exercises);
  const sections = seeds.length ? (CATEGORY_SECTIONS[category] || []).map((spec) => buildSection(language, category, level, spec, seeds)) : [];
  cache.set(key, sections);
  return sections;
}
export function getExerciseSection(language, category, level, sectionId) { return getExerciseSections(language, category, level).find((section) => section.id === sectionId) || null; }

export function validateExercise(exercise, expected = {}) {
  const errors = [];
  const prompt = normalizeText(exercise.prompt);
  const answer = normalizeText(exercise.correctAnswer);
  if (!prompt || !answer || !exercise.acceptedAnswers?.length) errors.push('Missing prompt or accepted answer.');
  if (FORBIDDEN_PROMPT_TEXT.some((text) => prompt.includes(text))) errors.push('Prompt contains a forbidden generator phrase.');
  if (exercise.exerciseTypeLabel && new RegExp(`${exercise.exerciseTypeLabel}\\s+\\d+`, 'i').test(exercise.prompt)) errors.push('Prompt exposes an internal exercise label.');
  if (/\s\/\s/.test(exercise.prompt) || /\s\/\s/.test(exercise.correctAnswer)) errors.push('Exercise joins multiple examples with a slash.');
  if (expected.language && exercise.language !== expected.language) errors.push('Exercise language does not match the course.');
  if (expected.level && exercise.cefrLevel !== expected.level) errors.push('Exercise CEFR level does not match the course.');
  if (exercise.exerciseType === 'error-correction' && normalizeText(exercise.incorrectSentence) === answer) errors.push('Error Correction sentence is already correct.');
  if (ORDERING.has(exercise.exerciseType)) {
    if (exercise.orderingTokens?.length < 2) errors.push('Sentence Ordering needs at least two tokens.');
    if (sentenceFromTokens(exercise.orderingTokens || []) === exercise.correctAnswer) errors.push('Sentence Ordering starts in the correct order.');
  }
  if (['fill-blank','sentence-completion'].includes(exercise.exerciseType) && !exercise.blank?.includes('____')) errors.push('Fill in the Blank has no real blank.');
  if (exercise.translation && [exercise.prompt, exercise.correctAnswer].some((visible) => normalizeText(exercise.translation) === normalizeText(visible))) errors.push('Translation duplicates visible exercise text.');
  return errors;
}

export function validateLevelCatalog(language, category, level, sections = getExerciseSections(language, category, level)) {
  const errors = [];
  const exercises = sections.flatMap((section) => section.exercises);
  if (sections.reduce((sum, section) => sum + section.targetCount, 0) !== EXERCISES_PER_LEVEL) errors.push('Section targets do not add up to 200.');
  const ids = new Set(); const promptsBySection = new Map();
  for (const exercise of exercises) {
    if (ids.has(exercise.id)) errors.push(`Duplicate ID: ${exercise.id}`);
    const prompts = promptsBySection.get(exercise.exerciseType) || new Set();
    const prompt = `${normalizeText(exercise.prompt)}|${normalizeText(exercise.correctAnswer)}`;
    if (prompts.has(prompt)) errors.push(`Duplicate exercise in ${exercise.exerciseType}: ${exercise.id}`);
    for (const error of validateExercise(exercise, { language, level })) errors.push(`${exercise.id}: ${error}`);
    ids.add(exercise.id); prompts.add(prompt); promptsBySection.set(exercise.exerciseType, prompts);
  }
  return { valid: errors.length === 0 && exercises.length === EXERCISES_PER_LEVEL, contentValid: errors.length === 0, complete: exercises.length === EXERCISES_PER_LEVEL, errors, total: exercises.length };
}

export function findExercise(language, category, level, sectionId, exerciseId) { return getExerciseSection(language, category, level, sectionId)?.exercises.find((exercise) => exercise.id === exerciseId) || null; }
