import { CEFR_LEVELS, getCefrLevel } from '../config/cefrLevels.js';
import { CATEGORIES } from '../config/categories.js';

export const LANGUAGES = Object.freeze({
  nl: { id: 'nl', name: 'Dutch', locale: 'nl-NL', flag: '🇳🇱', accent: 'orange' },
  pl: { id: 'pl', name: 'Polish', locale: 'pl-PL', flag: '🇵🇱', accent: 'red' },
  pt: { id: 'pt', name: 'European Portuguese', locale: 'pt-PT', flag: '🇵🇹', accent: 'green' }
});

const TOPIC_TITLES = Object.freeze({
  grammar: {
    A0: ['What is a verb?', 'Personal pronouns and basic word order'],
    A1: ['Present tense and questions', 'Negatives and articles'],
    A2: ['Past and future forms', 'Modal verbs and flexible word order'],
    B1: ['Connected and relative clauses', 'Intermediate verb forms'],
    B2: ['Complex sentence structures', 'Formal, informal and advanced word order'],
    C1: ['Nuanced grammar and clause structure', 'Stylistic differences'],
    C2: ['Near-native and rare structures', 'Subtle usage differences']
  },
  vocabulary: {
    A0: ['People, numbers and everyday objects', 'First actions and descriptions'],
    A1: ['Home, food and daily routines', 'Travel and essential services'],
    A2: ['Work, health and practical life', 'Common collocations and opposites'],
    B1: ['News, relationships and common expressions', 'Word families and natural combinations'],
    B2: ['Idiomatic workplace vocabulary', 'Formal and informal word choice'],
    C1: ['Abstract and specialised vocabulary', 'Nuance, register and connotation'],
    C2: ['Advanced idioms and cultural references', 'Precision, ambiguity and rhetorical choice']
  },
  pronunciation: {
    A0: ['Alphabet and individual sounds', 'Listen and repeat essential words'],
    A1: ['Common letter combinations', 'Slow sentence stress'],
    A2: ['Word stress and longer sound groups', 'Rhythm in practical sentences'],
    B1: ['Connected speech in common expressions', 'Longer listening at everyday speed'],
    B2: ['Reduced sounds and natural rhythm', 'Formal and informal intonation'],
    C1: ['Native-speed connected speech', 'Subtle stress and speaker intention'],
    C2: ['Regional variation and fine phonetic detail', 'Near-native rhythm and expressive delivery']
  },
  writing: {
    A0: ['Copy essential words', 'Build a first short sentence'],
    A1: ['Write guided everyday sentences', 'Ask and answer in writing'],
    A2: ['Write a practical message', 'Describe a past or future plan'],
    B1: ['Build a connected paragraph', 'Explain an opinion independently'],
    B2: ['Write formal and informal texts', 'Develop a structured argument'],
    C1: ['Write an essay or detailed explanation', 'Adapt tone for audience and purpose'],
    C2: ['Write with style and nuance', 'Edit for precision and rhetorical effect']
  },
  conversation: {
    A0: ['Greetings and basic replies', 'Introduce yourself'],
    A1: ['Everyday questions and answers', 'A short café conversation'],
    A2: ['Travel and appointment situations', 'Solve a practical problem'],
    B1: ['Extended realistic conversations', 'Explain experiences and preferences'],
    B2: ['Workplace and social discussion', 'Switch between formal and informal speech'],
    C1: ['Professional and abstract discussion', 'Clarify, challenge and negotiate'],
    C2: ['Near-native debate', 'Implied meaning, humour and cultural nuance']
  },
  speaking: {
    A0: ['Repeat individual words', 'Say a short personal phrase'],
    A1: ['Repeat a complete short sentence', 'Answer a basic question'],
    A2: ['Give a practical spoken answer', 'Describe a simple plan'],
    B1: ['Produce a connected answer', 'Speak about an experience'],
    B2: ['Discuss a realistic topic', 'Compare formal and informal responses'],
    C1: ['Explain an abstract idea', 'Give a detailed professional response'],
    C2: ['Debate with precision', 'Express subtle attitude and nuance']
  }
});

const LANGUAGE_SAMPLES = Object.freeze({
  nl: {
    A0: [
      { target: 'Hallo, ik ben Sam.', translation: 'Hello, I am Sam.', variants: ['Hallo ik ben Sam'] },
      { target: 'Dit is een boek.', translation: 'This is a book.', variants: ['Dit is een boek'] }
    ],
    A1: [
      { target: 'Ik werk vandaag thuis.', translation: 'I am working from home today.', variants: ['Vandaag werk ik thuis.'] },
      { target: 'Waar woon je?', translation: 'Where do you live?', variants: ['Waar woont u?'] }
    ],
    A2: [
      { target: 'Gisteren heb ik de trein gemist.', translation: 'Yesterday I missed the train.', variants: ['Ik heb gisteren de trein gemist.'] },
      { target: 'Morgen ga ik mijn collega bellen.', translation: 'Tomorrow I am going to call my colleague.', variants: ['Ik ga morgen mijn collega bellen.'] }
    ],
    B1: [
      { target: 'Hoewel het regende, zijn we toch gaan wandelen.', translation: 'Although it rained, we still went for a walk.', variants: ['We zijn toch gaan wandelen, hoewel het regende.'] },
      { target: 'Ik denk dat deze oplossing beter werkt omdat ze eenvoudiger is.', translation: 'I think this solution works better because it is simpler.', variants: ['Volgens mij werkt deze oplossing beter omdat ze eenvoudiger is.'] }
    ],
    B2: [
      { target: 'Zou u het voorstel nader kunnen toelichten?', translation: 'Could you explain the proposal in more detail?', variants: ['Kunt u het voorstel wat nader toelichten?'] },
      { target: 'Informeel zou ik het direct zeggen, maar in een vergadering formuleer ik het voorzichtiger.', translation: 'Informally I would say it directly, but in a meeting I phrase it more carefully.', variants: [] }
    ],
    C1: [
      { target: 'De ogenschijnlijke eenvoud van de maatregel verhult de maatschappelijke gevolgen.', translation: 'The apparent simplicity of the measure conceals its social consequences.', variants: [] },
      { target: 'Ik wil die aanname nuanceren zonder de kern van het betoog te ontkennen.', translation: 'I want to qualify that assumption without denying the core of the argument.', variants: [] }
    ],
    C2: [
      { target: 'Zijn terloopse opmerking was niet zozeer kritisch als wel veelzeggend.', translation: 'His casual remark was not so much critical as revealing.', variants: [] },
      { target: 'Met fijnzinnige ironie ondergroef ze een redenering die op het eerste gezicht sluitend leek.', translation: 'With subtle irony she undermined an argument that initially seemed conclusive.', variants: [] }
    ]
  },
  pl: {
    A0: [
      { target: 'Cześć, jestem Sam.', translation: 'Hello, I am Sam.', variants: ['Cześć jestem Sam'] },
      { target: 'To jest książka.', translation: 'This is a book.', variants: ['To książka.'] }
    ],
    A1: [
      { target: 'Dzisiaj pracuję w domu.', translation: 'I am working from home today.', variants: ['Pracuję dzisiaj w domu.'] },
      { target: 'Gdzie mieszkasz?', translation: 'Where do you live?', variants: ['Gdzie pan mieszka?', 'Gdzie pani mieszka?'] }
    ],
    A2: [
      { target: 'Wczoraj spóźniłem się na pociąg.', translation: 'Yesterday I missed the train.', variants: ['Wczoraj spóźniłam się na pociąg.'] },
      { target: 'Jutro zadzwonię do mojego kolegi.', translation: 'Tomorrow I will call my colleague.', variants: ['Jutro zadzwonię do mojej koleżanki.'] }
    ],
    B1: [
      { target: 'Chociaż padało, i tak poszliśmy na spacer.', translation: 'Although it rained, we still went for a walk.', variants: ['Mimo że padało, poszliśmy na spacer.'] },
      { target: 'Uważam, że to rozwiązanie działa lepiej, ponieważ jest prostsze.', translation: 'I think this solution works better because it is simpler.', variants: ['Myślę, że to rozwiązanie jest lepsze, bo jest prostsze.'] }
    ],
    B2: [
      { target: 'Czy mógłby pan dokładniej wyjaśnić tę propozycję?', translation: 'Could you explain the proposal in more detail?', variants: ['Czy mogłaby pani dokładniej wyjaśnić tę propozycję?'] },
      { target: 'Nieformalnie powiedziałbym to wprost, ale na spotkaniu ująłbym to ostrożniej.', translation: 'Informally I would say it directly, but in a meeting I would phrase it more carefully.', variants: [] }
    ],
    C1: [
      { target: 'Pozorna prostota tego rozwiązania przesłania jego społeczne konsekwencje.', translation: 'The apparent simplicity of the solution conceals its social consequences.', variants: [] },
      { target: 'Chciałbym zniuansować to założenie, nie podważając głównej tezy.', translation: 'I would like to qualify that assumption without undermining the main thesis.', variants: [] }
    ],
    C2: [
      { target: 'Jego mimochodem rzucona uwaga była nie tyle krytyczna, ile wymowna.', translation: 'His casual remark was not so much critical as revealing.', variants: [] },
      { target: 'Subtelną ironią podważyła rozumowanie, które pozornie wydawało się niepodważalne.', translation: 'With subtle irony she undermined reasoning that appeared unassailable.', variants: [] }
    ]
  },
  pt: {
    A0: [
      { target: 'Olá, eu sou o Sam.', translation: 'Hello, I am Sam.', variants: ['Olá, sou o Sam.', 'Eu sou o Sam.'] },
      { target: 'Isto é um livro.', translation: 'This is a book.', variants: ['É um livro.'] }
    ],
    A1: [
      { target: 'Hoje trabalho em casa.', translation: 'I am working from home today.', variants: ['Eu hoje trabalho em casa.'] },
      { target: 'Onde moras?', translation: 'Where do you live?', variants: ['Onde é que moras?', 'Onde mora?'] }
    ],
    A2: [
      { target: 'Ontem perdi o comboio.', translation: 'Yesterday I missed the train.', variants: ['Perdi o comboio ontem.'] },
      { target: 'Amanhã vou telefonar ao meu colega.', translation: 'Tomorrow I am going to call my colleague.', variants: ['Vou telefonar ao meu colega amanhã.'] }
    ],
    B1: [
      { target: 'Embora estivesse a chover, fomos dar um passeio.', translation: 'Although it was raining, we went for a walk.', variants: ['Fomos dar um passeio, apesar de estar a chover.'] },
      { target: 'Acho que esta solução funciona melhor porque é mais simples.', translation: 'I think this solution works better because it is simpler.', variants: ['Penso que esta solução resulta melhor por ser mais simples.'] }
    ],
    B2: [
      { target: 'Poderia explicar a proposta com mais pormenor?', translation: 'Could you explain the proposal in more detail?', variants: ['Podia explicar melhor a proposta?'] },
      { target: 'Informalmente diria isso de forma direta, mas numa reunião seria mais cauteloso.', translation: 'Informally I would say that directly, but in a meeting I would be more careful.', variants: [] }
    ],
    C1: [
      { target: 'A aparente simplicidade da medida oculta as suas consequências sociais.', translation: 'The apparent simplicity of the measure conceals its social consequences.', variants: [] },
      { target: 'Gostaria de matizar esse pressuposto sem negar o essencial do argumento.', translation: 'I would like to qualify that assumption without denying the core of the argument.', variants: [] }
    ],
    C2: [
      { target: 'O comentário feito de passagem não foi tanto crítico quanto revelador.', translation: 'The passing comment was not so much critical as revealing.', variants: [] },
      { target: 'Com uma ironia subtil, desmontou um raciocínio que à primeira vista parecia irrefutável.', translation: 'With subtle irony she dismantled reasoning that initially seemed irrefutable.', variants: [] }
    ]
  }
});

function slug(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function exerciseType(category, level) {
  if (category === 'speaking') return 'speaking';
  if (category === 'writing') return ['A0', 'A1'].includes(level) ? 'manual' : 'openResponse';
  if (category === 'conversation') return level === 'A0' ? 'multipleChoice' : level < 'B2' ? 'manual' : 'openResponse';
  if (category === 'pronunciation') return ['A0', 'A1'].includes(level) ? 'multipleChoice' : 'manual';
  if (level === 'A0') return 'multipleChoice';
  if (['A1', 'A2', 'B1'].includes(level)) return 'manual';
  return 'openResponse';
}

function promptFor(category, level, sample, languageName) {
  if (category === 'speaking') return level === 'A0' ? `Listen, then repeat: ${sample.target}` : `Say this naturally in ${languageName}: ${sample.translation}`;
  if (category === 'pronunciation') return `Listen carefully and identify or reproduce: ${sample.target}`;
  if (category === 'writing') return level === 'A0' ? `Copy this exactly: ${sample.target}` : level === 'A1' ? `Write this guided sentence: ${sample.translation}` : `Write a ${level}-appropriate response using this idea: ${sample.translation}`;
  if (category === 'conversation') return level === 'A0' ? `Choose the most useful reply for: ${sample.translation}` : `Reply naturally in ${languageName}: ${sample.translation}`;
  if (category === 'vocabulary') return level === 'A0' ? `Choose the phrase that means: ${sample.translation}` : `Produce the ${languageName} expression for: ${sample.translation}`;
  return level === 'A0' ? `Choose the correct basic sentence for: ${sample.translation}` : `Use the structure from the lesson to express: ${sample.translation}`;
}

function makeExercise(language, category, level, topicId, index, sample) {
  const languageMeta = LANGUAGES[language];
  const difficulty = getCefrLevel(level);
  const type = exerciseType(category, level);
  const alternatives = LANGUAGE_SAMPLES[language][level].filter((item) => item.target !== sample.target).map((item) => item.target);
  return {
    id: `${language}-${category}-${level.toLowerCase()}-${topicId}-${String(index + 1).padStart(3, '0')}`,
    language,
    category,
    cefrLevel: level,
    topicId,
    lessonId: `${topicId}-lesson`,
    type,
    prompt: promptFor(category, level, sample, languageMeta.name),
    options: type === 'multipleChoice' ? [sample.target, ...alternatives, level === 'A0' ? 'I do not know yet' : 'None of these'] : [],
    correctAnswer: sample.target,
    acceptedAnswers: [sample.target, ...sample.variants],
    explanation: `${difficulty.label}: ${difficulty.guidance} The model answer is “${sample.target}”.`,
    translation: ['B2', 'C1', 'C2'].includes(level) ? null : sample.translation,
    audioText: sample.target,
    locale: languageMeta.locale,
    difficultyMetadata: {
      cefrLevel: level,
      hintLevel: difficulty.hintLevel,
      answerMode: difficulty.answerMode,
      speechRate: difficulty.speechRate,
      acceptsMultipleAnswers: sample.variants.length > 0 || ['B2', 'C1', 'C2'].includes(level)
    }
  };
}

function makeTopic(language, category, level, title, index) {
  const sample = LANGUAGE_SAMPLES[language][level][index % LANGUAGE_SAMPLES[language][level].length];
  const topicId = slug(title);
  const difficulty = getCefrLevel(level);
  return {
    id: `${language}-${category}-${level.toLowerCase()}-${topicId}`,
    language,
    category,
    cefrLevel: level,
    topicId,
    title,
    description: `${difficulty.description} This ${category} topic uses ${difficulty.guidance.toLowerCase()}`,
    lesson: {
      id: `${topicId}-lesson`,
      title,
      explanation: `At ${level}, focus on understanding and producing language at the ${difficulty.label.toLowerCase()} stage. Notice how “${sample.target}” communicates “${sample.translation}”.`,
      examples: [sample.target, ...sample.variants].slice(0, 3),
      commonMistake: `Do not translate every word mechanically. Follow ${LANGUAGES[language].name} word order and natural phrasing.`,
      guidance: difficulty.guidance
    },
    exercises: [makeExercise(language, category, level, topicId, index, sample)]
  };
}

export const COURSE_CONTENT = Object.freeze(
  Object.fromEntries(Object.keys(LANGUAGES).map((language) => [
    language,
    Object.fromEntries(CATEGORIES.map((category) => [
      category.id,
      Object.fromEntries(CEFR_LEVELS.map((level) => [
        level.id,
        TOPIC_TITLES[category.id][level.id].map((title, index) => makeTopic(language, category.id, level.id, title, index))
      ]))
    ]))
  ]))
);

export function getTopics(language, category, level) {
  return COURSE_CONTENT[language]?.[category]?.[level] || [];
}

export function findTopic(language, category, level, topicId) {
  return getTopics(language, category, level).find((topic) => topic.topicId === topicId) || null;
}

