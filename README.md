const SEEDS = [
  ['what-is-language','What is a language?','A language is a shared system of sounds, signs and words that people use to communicate.','People share ideas through language.','language','A language is more than a list of translated words; it also has patterns and social rules.'],
  ['what-is-word','What is a word?','A word is a unit of language that carries meaning or performs a grammatical job.','The small dog runs.','dog','Spaces often separate written words, but some expressions contain several words.'],
  ['what-is-sentence','What is a sentence?','A sentence expresses a complete thought and normally contains a subject and a predicate.','She eats an apple.','sentence','A group of words is not automatically a complete sentence.'],
  ['what-is-grammar','What is grammar?','Grammar is the system of patterns that explains how words change and work together.','The small dog runs quickly.','grammar','Grammar describes useful patterns; it is not only a list of mistakes to avoid.'],
  ['nouns','Nouns','A noun names a person, place, thing or idea.','The teacher opens the window.','teacher','Do not assume that nouns have the same grammatical gender in every language.'],
  ['pronouns','Pronouns','A pronoun can replace or point to a noun, such as I, you, she, it or they.','She eats an apple.','she','Choose a pronoun that agrees with the person, number and context.'],
  ['verbs','Verbs','A verb describes an action, event or state, such as run, happen or be.','She eats an apple.','eats','A sentence usually needs a verb, and its form may change with tense or subject.'],
  ['adjectives','Adjectives','An adjective describes a noun by giving information about quality, size, colour or another feature.','The small dog runs quickly.','small','Adjective position and agreement differ between languages.'],
  ['adverbs','Adverbs','An adverb modifies a verb, adjective, another adverb or a whole sentence.','The small dog runs quickly.','quickly','Not every English adverb ends in -ly.'],
  ['articles','Articles','An article introduces a noun and can mark it as specific or non-specific, as in the, a and an.','She eats an apple.','an','Languages use articles differently, and Polish usually has no direct equivalent of English articles.'],
  ['prepositions','Prepositions','A preposition shows a relationship such as place, time, direction or method.','The keys are on the table.','on','Prepositions rarely translate one-to-one between languages.'],
  ['conjunctions','Conjunctions','A conjunction connects words, phrases or clauses, such as and, but, because and although.','I stayed home because it rained.','because','Choose a conjunction that expresses the intended relationship.'],
  ['subjects','Subjects','The subject is the person, thing or idea that performs the action or is described.','The small dog runs quickly.','dog','The subject is not always the first word in a sentence.'],
  ['predicates','Predicates','The predicate says what the subject does, is or experiences; it contains the main verb.','The small dog runs quickly.','runs','Do not confuse the complete predicate with only the verb.'],
  ['objects','Objects','An object is affected by a verb or completes its meaning.','Maya reads the book.','book','Not every verb takes an object.'],
  ['direct-objects','Direct objects','A direct object directly receives the action of a transitive verb.','She eats an apple.','apple','Ask “what?” or “whom?” after the verb, but remember that this test is only a guide.'],
  ['indirect-objects','Indirect objects','An indirect object usually identifies the recipient or beneficiary of an action.','Sam gave Maya a book.','Maya','English can express the recipient with word order or with a preposition such as to.'],
  ['singular-plural','Singular and plural','Singular refers to one; plural normally refers to more than one.','One book becomes two books.','books','Plural formation and agreement are not always regular.'],
  ['verb-tense','Verb tense','Verb tense locates an action or state in time and interacts with aspect.','She works, worked and will work.','worked','Time words and verb tense are related but are not the same thing.'],
  ['present-tense','Present tense','The present tense commonly describes current states, habits and general facts.','He works from home.','works','The present tense can express more than an action happening this second.'],
  ['past-tense','Past tense','The past tense presents an action or state as earlier than the present.','He worked yesterday.','worked','Irregular past forms must often be learned individually.'],
  ['future-tense','Future forms','Languages use several forms to talk about predictions, plans and intentions.','He will work tomorrow.','will','Do not assume that every language has one single future tense used in every context.'],
  ['infinitives','Infinitives','An infinitive is a basic verb form that is not marked for a particular subject or tense.','She wants to learn.','learn','English often uses to before an infinitive, but not after every verb.'],
  ['conjugation','Conjugation','Conjugation is the way a verb changes for person, number, tense, mood or other features.','I am, you are, she is.','is','Do not use one verb form with every subject unless the language permits it.'],
  ['questions','Questions','A question requests information or confirmation and may change word order, intonation or verb form.','Where do you live?','where','A question mark alone does not create correct question structure.'],
  ['negatives','Negatives','A negative sentence denies, rejects or reverses an idea using words such as not, never or no.','I do not agree.','not','Different languages place and combine negative words differently.'],
  ['word-order','Word order','Word order is the arrangement of sentence parts; it helps show meaning and emphasis.','The child reads the book.','reads','Moving words can change meaning or make a sentence unnatural.'],
  ['main-clauses','Main clauses','A main clause can stand alone as a complete sentence.','We stayed home.','stayed','A main clause can contain another clause without losing its central role.'],
  ['subordinate-clauses','Subordinate clauses','A subordinate clause depends on another clause and adds information such as reason, time or condition.','We stayed home because it rained.','because','A subordinate clause cannot always stand alone as a complete sentence.'],
  ['formal-informal','Formal and informal language','Register is the level of formality chosen for the audience, relationship and situation.','Could you help me? is more formal than Can you help?','could','Formal language is not always better; it must suit the context.'],
  ['grammatical-gender','Gender in grammar','Grammatical gender groups nouns and can control the form of related words.','The noun may be masculine, feminine or neuter.','gender','Grammatical gender does not necessarily match biological sex.'],
  ['grammatical-cases','Cases in grammar','A grammatical case marks a noun or pronoun according to its role or relationship in a sentence.','The form can show who acts and who receives.','case','Case is a grammatical function, not merely a word ending.'],
  ['agreement','Agreement between words','Agreement means that related words match in features such as person, number, gender or case.','She works, but they work.','works','Check all words controlled by the same grammatical feature.']
];

const SPECIAL_BREAKDOWNS = {
  'what-is-sentence': [
    { text: 'She', role: 'pronoun and subject' },
    { text: 'eats', role: 'verb and predicate' },
    { text: 'an', role: 'article' },
    { text: 'apple', role: 'noun and direct object' }
  ],
  'what-is-grammar': [
    { text: 'The', role: 'article' },
    { text: 'small', role: 'adjective' },
    { text: 'dog', role: 'noun and subject' },
    { text: 'runs', role: 'verb' },
    { text: 'quickly', role: 'adverb' }
  ],
  pronouns: [
    { text: 'She', role: 'pronoun and subject' },
    { text: 'eats', role: 'verb' },
    { text: 'an', role: 'article' },
    { text: 'apple', role: 'noun and object' }
  ],
  verbs: [
    { text: 'She', role: 'subject' },
    { text: 'eats', role: 'verb: the action' },
    { text: 'an apple', role: 'object' }
  ],
  adjectives: [
    { text: 'The', role: 'article' },
    { text: 'small', role: 'adjective describing dog' },
    { text: 'dog', role: 'noun and subject' },
    { text: 'runs quickly', role: 'predicate' }
  ],
  adverbs: [
    { text: 'The small dog', role: 'subject phrase' },
    { text: 'runs', role: 'verb' },
    { text: 'quickly', role: 'adverb describing how' }
  ],
  articles: [
    { text: 'She', role: 'subject' },
    { text: 'eats', role: 'verb' },
    { text: 'an', role: 'article before a vowel sound' },
    { text: 'apple', role: 'noun and object' }
  ],
  subjects: [
    { text: 'The small dog', role: 'complete subject' },
    { text: 'runs quickly', role: 'predicate' }
  ],
  predicates: [
    { text: 'The small dog', role: 'subject' },
    { text: 'runs quickly', role: 'complete predicate' }
  ],
  'direct-objects': [
    { text: 'She', role: 'subject' },
    { text: 'eats', role: 'verb' },
    { text: 'an apple', role: 'direct object' }
  ],
  'indirect-objects': [
    { text: 'Sam', role: 'subject' },
    { text: 'gave', role: 'verb' },
    { text: 'Maya', role: 'indirect object: recipient' },
    { text: 'a book', role: 'direct object' }
  ]
};

function defaultBreakdown(id, example, keyword, title) {
  const cleanKeyword = keyword.toLowerCase();
  return example.replace(/[.,?]/g, '').split(/\s+/).map((word) => ({
    text: word,
    role: word.toLowerCase() === cleanKeyword ? `focus: ${title.toLowerCase()}` : 'sentence context'
  }));
}

function connection(title, language) {
  const additions = {
    nl: 'Dutch relies strongly on word order and marks gender in articles and pronouns.',
    pl: 'Polish uses rich conjugation and case endings, so word forms often reveal their role.',
    pt: 'European Portuguese uses conjugation, agreement and grammatical gender extensively.'
  };
  return `${title} is also relevant in ${language === 'nl' ? 'Dutch' : language === 'pl' ? 'Polish' : 'European Portuguese'}. ${additions[language]}`;
}

export const LANGUAGE_BASICS = Object.freeze(SEEDS.map(([id, title, definition, example, keyword, mistake], index) => ({
  id,
  order: index + 1,
  title,
  definition,
  simpleExplanation: `${definition} Start by finding this feature in one clear sentence before learning exceptions.`,
  examples: [example],
  breakdown: SPECIAL_BREAKDOWNS[id] || defaultBreakdown(id, example, keyword, title),
  commonMistakes: [mistake],
  quiz: {
    id: `basics-${id}-quiz`,
    question: `Which explanation best describes “${title}”?`,
    options: [definition, 'It is only a spelling convention with no effect on meaning.', 'It is a translation rule that works identically in every language.'],
    answer: definition,
    explanation: definition
  },
  manualExercise: {
    id: `basics-${id}-manual`,
    prompt: `Write one simple example that demonstrates ${title.toLowerCase()}. Then compare it with the model.`,
    modelAnswer: example
  },
  connections: {
    nl: connection(title, 'nl'),
    pl: connection(title, 'pl'),
    pt: connection(title, 'pt')
  }
})));

export function findBasicsLesson(id) {
  return LANGUAGE_BASICS.find((lesson) => lesson.id === id) || null;
}

