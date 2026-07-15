export const CEFR_LEVELS = Object.freeze([
  {
    id: 'A0',
    label: 'Absolute Beginner',
    description: 'Recognise essential words, pronouns and very short sentences.',
    guidance: 'Strong hints, translations and recognition tasks.',
    hintLevel: 'strong',
    answerMode: 'recognition',
    speechRate: 0.72
  },
  {
    id: 'A1',
    label: 'Beginner',
    description: 'Use simple present forms, questions and everyday expressions.',
    guidance: 'Guided typing, short answers and slow audio.',
    hintLevel: 'guided',
    answerMode: 'guided-input',
    speechRate: 0.78
  },
  {
    id: 'A2',
    label: 'Elementary',
    description: 'Handle practical situations with longer sentences and fewer hints.',
    guidance: 'Short translations, sentence completion and practical exchanges.',
    hintLevel: 'moderate',
    answerMode: 'short-input',
    speechRate: 0.86
  },
  {
    id: 'B1',
    label: 'Intermediate',
    description: 'Connect sentences and respond independently in realistic situations.',
    guidance: 'Frequent manual answers and limited translation support.',
    hintLevel: 'limited',
    answerMode: 'sentence-input',
    speechRate: 0.94
  },
  {
    id: 'B2',
    label: 'Upper Intermediate',
    description: 'Use complex structures, idioms and formal or informal language.',
    guidance: 'Longer production with several possible correct answers.',
    hintLevel: 'minimal',
    answerMode: 'extended-input',
    speechRate: 1
  },
  {
    id: 'C1',
    label: 'Advanced',
    description: 'Express abstract ideas with nuanced vocabulary and detailed structure.',
    guidance: 'Minimal guidance and natural-speed language.',
    hintLevel: 'minimal',
    answerMode: 'open-production',
    speechRate: 1.05
  },
  {
    id: 'C2',
    label: 'Proficient',
    description: 'Communicate with near-native precision, style and cultural nuance.',
    guidance: 'Almost no hints; evaluate subtle differences in style and meaning.',
    hintLevel: 'none',
    answerMode: 'free-production',
    speechRate: 1.1
  }
]);

export const CEFR_IDS = Object.freeze(CEFR_LEVELS.map((level) => level.id));

export function getCefrLevel(id) {
  return CEFR_LEVELS.find((level) => level.id === id) || null;
}

