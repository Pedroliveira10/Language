export const CATEGORIES = Object.freeze([
  { id: 'grammar', label: 'Grammar', icon: '✦', description: 'Rules, verbs, tenses, clauses and word order.' },
  { id: 'vocabulary', label: 'Vocabulary', icon: '▦', description: 'Words, collocations, synonyms, opposites and idioms.' },
  { id: 'pronunciation', label: 'Pronunciation', icon: '◉', description: 'Sounds, stress, rhythm and connected speech.' },
  { id: 'writing', label: 'Writing', icon: '✎', description: 'From copying words to nuanced long-form writing.' },
  { id: 'conversation', label: 'Conversation', icon: '◌', description: 'Guided replies, practical situations and discussions.' },
  { id: 'speaking', label: 'Speaking', icon: '🎙', description: 'Use your microphone and practise producing language.' }
]);

export function getCategory(id) {
  return CATEGORIES.find((category) => category.id === id) || null;
}

