import { LANGUAGE_BASICS } from './language-basics/index.js';

const META = Object.freeze({
  nl: {
    title: 'How Dutch Works', locale: 'nl-NL',
    examples: [['Ik drink koffie.', 'I drink coffee.'], ['De kleine hond loopt snel.', 'The small dog walks quickly.'], ['Wij wonen in Amsterdam.', 'We live in Amsterdam.'], ['Zij geeft haar vriend een boek.', 'She gives her friend a book.'], ['Omdat het regent, blijven we thuis.', 'Because it is raining, we stay home.'], ['Ik heb geen auto.', 'I do not have a car.'], ['Waar woon je?', 'Where do you live?'], ['Morgen ga ik werken.', 'Tomorrow I am going to work.']],
    sentence: 'Ik drink koffie.', translation: 'I drink coffee.',
    breakdown: [['Ik', 'pronoun subject'], ['drink', 'verb'], ['koffie', 'noun direct object']],
    overview: 'Dutch relies strongly on verb position. Main clauses usually place the finite verb second, while subordinate clauses often move verbs towards the end.',
    facts: [
      'Personal pronouns distinguish informal jij/je from formal u; subject forms include ik, jij, u, hij, zij, het, wij and jullie.',
      'Nouns normally take de or het. Plurals normally take de; diminutives normally take het.',
      'Use geen with an indefinite noun and niet to negate most other elements.',
      'A conjugated verb is normally second in a main clause. Starting with time or place causes inversion: Vandaag werk ik thuis.',
      'After subordinators such as omdat, the conjugated verb moves towards the end: omdat ik thuis werk.',
      'Modal verbs keep the infinitive at the end: Ik wil Nederlands leren.',
      'Separable verbs split in main clauses: Ik sta vroeg op, but remain together in the infinitive: opstaan.',
      'Adjective endings depend on definiteness and whether a singular het noun is indefinite.'
    ],
    comparisons: ['de/het noun gender', 'verb-second word order', 'niet versus geen', 'separable verbs', 'modal + final infinitive', 'formal u versus informal jij']
  },
  pl: {
    title: 'How Polish Works', locale: 'pl-PL',
    examples: [['Piję kawę.', 'I drink coffee.'], ['Mały pies biegnie szybko.', 'The small dog runs quickly.'], ['Mieszkamy w Warszawie.', 'We live in Warsaw.'], ['Ona daje przyjacielowi książkę.', 'She gives her friend a book.'], ['Ponieważ pada, zostajemy w domu.', 'Because it is raining, we stay home.'], ['Nie mam samochodu.', 'I do not have a car.'], ['Gdzie mieszkasz?', 'Where do you live?'], ['Jutro idę do pracy.', 'Tomorrow I am going to work.']],
    sentence: 'Ja piję kawę.', translation: 'I drink coffee.',
    breakdown: [['Ja', 'pronoun subject'], ['piję', 'verb'], ['kawę', 'noun direct object, accusative']],
    overview: 'Polish uses rich endings. Verb forms often reveal the subject, while noun and adjective endings reveal gender, number and grammatical case.',
    facts: [
      'Subject pronouns such as ja, ty and my are often omitted because the verb ending already identifies the person.',
      'Nouns are masculine, feminine or neuter. Many feminine nouns end in -a and many neuter nouns end in -o or -e.',
      'The seven cases are nominative, genitive, dative, accusative, instrumental, locative and vocative.',
      'Cases show a noun’s role, so endings change: kawa becomes kawę as a direct object.',
      'Adjectives agree with nouns in gender, number and case.',
      'Imperfective verbs present an action as ongoing or repeated; perfective partners present it as bounded or completed.',
      'Questions can use czy. Negation normally uses nie and Polish allows double negatives.',
      'Word order is flexible but changes focus and information structure; neutral order is still useful for learners.'
    ],
    comparisons: ['seven cases', 'gender from noun endings', 'perfective and imperfective aspect', 'optional subject pronouns', 'czy questions', 'double negatives']
  },
  pt: {
    title: 'How European Portuguese Works', locale: 'pt-PT',
    examples: [['Eu bebo café.', 'I drink coffee.'], ['O cão pequeno corre depressa.', 'The small dog runs quickly.'], ['Vivemos em Lisboa.', 'We live in Lisbon.'], ['Ela dá um livro ao amigo.', 'She gives her friend a book.'], ['Como está a chover, ficamos em casa.', 'Because it is raining, we stay home.'], ['Não tenho carro.', 'I do not have a car.'], ['Onde moras?', 'Where do you live?'], ['Amanhã vou trabalhar.', 'Tomorrow I am going to work.']],
    sentence: 'Eu bebo café.', translation: 'I drink coffee.',
    breakdown: [['Eu', 'pronoun subject'], ['bebo', 'verb'], ['café', 'noun direct object']],
    overview: 'European Portuguese uses rich verb conjugation, gender and number agreement, contractions, and characteristic placement of unstressed object pronouns.',
    facts: [
      'Subject pronouns are often omitted because the conjugated verb identifies the person.',
      'Ser describes identity or defining characteristics; estar commonly describes state or location. Ter means to have.',
      'Nouns and adjectives agree in masculine/feminine and singular/plural forms.',
      'Prepositions combine with articles: de + o = do, em + a = na, a + o = ao, and a + a = à.',
      'European Portuguese often places clitic pronouns after an affirmative verb: Chamo-me Ana. Negation attracts them before it: Não me chamo Ana.',
      'Use tu in familiar contexts, você with regional/social caution, and o senhor/a senhora formally.',
      'The progressive is normally estar a + infinitive: estou a fazer, not the Brazilian default estou fazendo.',
      'European Portuguese often reduces unstressed vowels; audio should use pt-PT.'
    ],
    comparisons: ['telemóvel, not celular', 'autocarro, not ônibus', 'comboio, not trem', 'ficheiro, not arquivo', 'estou a fazer, not estou fazendo', 'pt-PT clitic placement']
  }
});

function relatedFor(index, lessons) {
  return [lessons[(index + 1) % lessons.length].id, lessons[(index + lessons.length - 1) % lessons.length].id];
}

function makeLesson(language, base, index, all) {
  const meta = META[language];
  const focus = meta.facts[index % meta.facts.length];
  const selectedExamples = [0, 1, 2].map((offset) => meta.examples[(index + offset) % meta.examples.length]);
  const languageExample = selectedExamples[0][0];
  return {
    id: base.id,
    order: index + 1,
    title: base.title,
    definition: base.definition,
    whyItMatters: `${base.title} helps you recognise how a sentence communicates meaning. In ${meta.title.replace('How ', '').replace(' Works', '')}, it also helps you predict forms, word order and agreement.`,
    recognition: `Look for the word or group doing the grammatical job described here. Then check its position, ending and relationship with nearby words.`,
    englishComparison: `${base.simpleExplanation} English often relies on fixed word order; the selected language may also use endings or verb position.`,
    languageExplanation: `${meta.overview} For this topic, remember: ${focus}`,
    examples: selectedExamples.map(([target, translation]) => ({ target, translation })),
    breakdown: meta.breakdown.map(([text, role]) => ({ text, role })),
    commonMistake: base.commonMistakes[0],
    usefulTrick: `Start with “${languageExample}”. Label each word, then change only one feature at a time. ${meta.comparisons[index % meta.comparisons.length]}.`,
    remember: focus,
    connection: `This topic connects directly to ${all[(index + 1) % all.length].title} and ${all[(index + all.length - 1) % all.length].title}.`,
    summary: `${base.definition} In this language, pay particular attention to ${meta.comparisons[index % meta.comparisons.length]}.`,
    related: relatedFor(index, all)
  };
}

export const LANGUAGE_STRUCTURE = Object.freeze(Object.fromEntries(Object.keys(META).map((language) => {
  const lessons = LANGUAGE_BASICS.map((base, index) => makeLesson(language, base, index, LANGUAGE_BASICS));
  return [language, Object.freeze({ ...META[language], lessons: Object.freeze(lessons) })];
})));

export function getLanguageStructure(language) {
  return LANGUAGE_STRUCTURE[language] || null;
}

export function findStructureLesson(language, id) {
  return getLanguageStructure(language)?.lessons.find((lesson) => lesson.id === id) || null;
}
