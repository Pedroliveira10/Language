import { CEFR_LEVELS, getCefrLevel } from '../config/cefrLevels.js';
import { CATEGORIES } from '../config/categories.js';

export const TOPICS_PER_LEVEL = 5;
export const EXERCISES_PER_TOPIC = 5;

export const LANGUAGES = Object.freeze({
  nl: { id: 'nl', name: 'Dutch', locale: 'nl-NL', flag: '🇳🇱', accent: 'orange' },
  pl: { id: 'pl', name: 'Polish', locale: 'pl-PL', flag: '🇵🇱', accent: 'red' },
  pt: { id: 'pt', name: 'European Portuguese', locale: 'pt-PT', flag: '🇵🇹', accent: 'green' }
});

const TOPIC_TITLES = Object.freeze({
  grammar: {
    A0: ['What is a verb?', 'Personal pronouns', 'Basic sentence order', 'Articles and nouns', 'First common verbs'],
    A1: ['Present tense', 'Questions', 'Negatives', 'Articles and gender', 'Possessives and basic agreement'],
    A2: ['Past tense', 'Future forms', 'Modal verbs', 'Reflexive and separable patterns', 'More complex word order'],
    B1: ['Connected clauses', 'Relative clauses', 'Intermediate verb forms', 'Real and unreal conditions', 'Reported ideas and opinions'],
    B2: ['Complex sentence structures', 'Formal and informal grammar', 'Advanced word order', 'Passive and impersonal forms', 'Emphasis and information focus'],
    C1: ['Nuanced grammar', 'Advanced clause structures', 'Stylistic differences', 'Tense and mood choices', 'Cohesion across long texts'],
    C2: ['Near-native grammar', 'Rare structures', 'Subtle usage differences', 'Rhetorical grammar', 'Editing ambiguity and implication']
  },
  vocabulary: {
    A0: ['People and family', 'Numbers and time', 'Home and everyday objects', 'Food and drink', 'First actions and descriptions'],
    A1: ['Daily routines', 'Home and neighbourhood', 'Shopping and food', 'Travel and directions', 'Essential services'],
    A2: ['Work and study', 'Health and appointments', 'Travel problems', 'Feelings and preferences', 'Common collocations and opposites'],
    B1: ['News and media', 'Relationships and social life', 'Workplace language', 'Word families', 'Common expressions and phrasal patterns'],
    B2: ['Idiomatic workplace vocabulary', 'Formal and informal word choice', 'Society and public services', 'Collocations for argument', 'Precision with synonyms'],
    C1: ['Abstract ideas', 'Specialised and academic vocabulary', 'Nuance and connotation', 'Register and tone', 'Metaphor and sophisticated collocation'],
    C2: ['Advanced idioms', 'Cultural references', 'Precision and ambiguity', 'Rhetorical word choice', 'Rare and context-dependent expressions']
  },
  pronunciation: {
    A0: ['Alphabet and letter names', 'Core vowel sounds', 'Core consonant sounds', 'Syllables in essential words', 'Listen and repeat first phrases'],
    A1: ['Common letter combinations', 'Long and short vowels', 'Difficult consonant contrasts', 'Slow sentence stress', 'Question and statement intonation'],
    A2: ['Word stress', 'Longer sound groups', 'Rhythm in practical sentences', 'Sound changes at word boundaries', 'Clear connected phrases'],
    B1: ['Connected speech', 'Common reductions', 'Everyday-speed listening', 'Contrastive stress', 'Expressive intonation'],
    B2: ['Reduced sounds and natural rhythm', 'Formal and informal intonation', 'Linking across clauses', 'Fast but clear delivery', 'Speaker attitude through stress'],
    C1: ['Native-speed connected speech', 'Subtle stress and intention', 'Dense consonant and vowel sequences', 'Professional delivery', 'Regional and social variation'],
    C2: ['Fine phonetic detail', 'Near-native rhythm', 'Expressive and rhetorical delivery', 'Rapid regional speech', 'Intentional accent and style choices']
  },
  writing: {
    A0: ['Copy names and greetings', 'Copy essential nouns', 'Build a first sentence', 'Write numbers and dates', 'Complete a simple form'],
    A1: ['Guided everyday sentences', 'Ask and answer in writing', 'Describe a routine', 'Write a short note', 'Join two simple ideas'],
    A2: ['Write a practical message', 'Describe a past event', 'Explain a future plan', 'Request information politely', 'Write a short connected text'],
    B1: ['Build a connected paragraph', 'Explain an opinion', 'Describe an experience', 'Write a clear email', 'Organise reasons and examples'],
    B2: ['Formal and informal texts', 'Structured arguments', 'Reports and proposals', 'Compare viewpoints', 'Edit for clarity and register'],
    C1: ['Academic and professional explanations', 'Long-form essays', 'Adapt tone for audience', 'Synthesize several ideas', 'Edit cohesion and nuance'],
    C2: ['Write with style and nuance', 'Edit for rhetorical effect', 'Imply without stating directly', 'Control voice and rhythm', 'Refine near-native precision']
  },
  conversation: {
    A0: ['Greetings and farewells', 'Introduce yourself', 'Give basic personal details', 'Ask for a simple item', 'Use yes, no and polite replies'],
    A1: ['Everyday questions and answers', 'A short café conversation', 'Shopping for basics', 'Talking about routines', 'Making a simple arrangement'],
    A2: ['Travel situations', 'Appointments and services', 'Solve a practical problem', 'Make and respond to invitations', 'Explain a simple preference'],
    B1: ['Extended realistic conversations', 'Explain experiences', 'Handle a misunderstanding', 'Give advice and suggestions', 'Keep a discussion moving'],
    B2: ['Workplace discussion', 'Formal and informal interaction', 'Negotiate a solution', 'Disagree diplomatically', 'Discuss advantages and risks'],
    C1: ['Professional discussion', 'Abstract topics', 'Clarify and challenge', 'Negotiate complex positions', 'Manage turn-taking and implication'],
    C2: ['Near-native debate', 'Implied meaning and humour', 'Cultural nuance', 'Persuasion and rebuttal', 'Delicate and high-stakes discussion']
  },
  speaking: {
    A0: ['Repeat names and greetings', 'Repeat individual words', 'Say a short personal phrase', 'Name everyday objects', 'Give a one-word reply'],
    A1: ['Repeat a short sentence', 'Answer a basic question', 'Describe your routine briefly', 'Ask for something politely', 'Give a simple direction'],
    A2: ['Give a practical answer', 'Describe a simple plan', 'Talk about yesterday', 'Explain a preference', 'Leave a short spoken message'],
    B1: ['Produce a connected answer', 'Speak about an experience', 'Explain a reason', 'Give advice', 'Summarise a familiar topic'],
    B2: ['Discuss a realistic topic', 'Compare formal and informal responses', 'Defend a viewpoint', 'Describe consequences', 'Respond spontaneously at length'],
    C1: ['Explain an abstract idea', 'Give a professional response', 'Qualify an opinion', 'Present a structured argument', 'Handle follow-up questions'],
    C2: ['Debate with precision', 'Express subtle attitude', 'Use humour and implication', 'Reframe a complex argument', 'Speak with rhetorical nuance']
  }
});

const SAMPLES = Object.freeze({
  nl: {
    A0: [
      ['Hallo, ik ben Sam.', 'Hello, I am Sam.', ['Hallo ik ben Sam.']],
      ['Dit is een boek.', 'This is a book.', ['Dit is een boek']],
      ['Ik heb water.', 'I have water.', []],
      ['Wij wonen hier.', 'We live here.', ['We wonen hier.']],
      ['De tafel is groot.', 'The table is big.', []]
    ],
    A1: [
      ['Ik werk vandaag thuis.', 'I am working from home today.', ['Vandaag werk ik thuis.']],
      ['Waar woon je?', 'Where do you live?', ['Waar woont u?']],
      ['Zij heeft twee broers.', 'She has two brothers.', ['Ze heeft twee broers.']],
      ['We eten om zeven uur.', 'We eat at seven o’clock.', ['Wij eten om zeven uur.']],
      ['Ik begrijp de vraag niet.', 'I do not understand the question.', []]
    ],
    A2: [
      ['Gisteren heb ik de trein gemist.', 'Yesterday I missed the train.', ['Ik heb gisteren de trein gemist.']],
      ['Morgen ga ik mijn collega bellen.', 'Tomorrow I am going to call my colleague.', ['Ik ga morgen mijn collega bellen.']],
      ['Je moet eerst een afspraak maken.', 'You must make an appointment first.', ['U moet eerst een afspraak maken.']],
      ['Als het mooi weer is, fietsen we naar het strand.', 'If the weather is nice, we will cycle to the beach.', []],
      ['Kunt u mij vertellen waar het station is?', 'Can you tell me where the station is?', ['Kun je mij vertellen waar het station is?']]
    ],
    B1: [
      ['Hoewel het regende, zijn we toch gaan wandelen.', 'Although it rained, we still went for a walk.', ['We zijn toch gaan wandelen, hoewel het regende.']],
      ['Ik denk dat deze oplossing beter werkt omdat ze eenvoudiger is.', 'I think this solution works better because it is simpler.', ['Volgens mij werkt deze oplossing beter omdat ze eenvoudiger is.']],
      ['Toen ik aankwam, was de vergadering al begonnen.', 'When I arrived, the meeting had already started.', []],
      ['Het boek dat je me gaf, vond ik verrassend goed.', 'I found the book you gave me surprisingly good.', []],
      ['Als ik meer tijd had, zou ik vaker Nederlands oefenen.', 'If I had more time, I would practise Dutch more often.', []]
    ],
    B2: [
      ['Zou u het voorstel nader kunnen toelichten?', 'Could you explain the proposal in more detail?', ['Kunt u het voorstel wat nader toelichten?']],
      ['Informeel zou ik het direct zeggen, maar in een vergadering formuleer ik het voorzichtiger.', 'Informally I would say it directly, but in a meeting I phrase it more carefully.', []],
      ['Hoewel het plan voordelen biedt, mogen we de financiële risico’s niet onderschatten.', 'Although the plan offers advantages, we must not underestimate the financial risks.', []],
      ['Enerzijds bespaart de maatregel tijd; anderzijds vergroot hij de werkdruk.', 'On the one hand the measure saves time; on the other hand it increases the workload.', []],
      ['De beslissing werd genomen nadat alle betrokkenen waren geraadpleegd.', 'The decision was made after all parties had been consulted.', []]
    ],
    C1: [
      ['De ogenschijnlijke eenvoud van de maatregel verhult de maatschappelijke gevolgen.', 'The apparent simplicity of the measure conceals its social consequences.', []],
      ['Ik wil die aanname nuanceren zonder de kern van het betoog te ontkennen.', 'I want to qualify that assumption without denying the core of the argument.', []],
      ['Voor zover de gegevens betrouwbaar zijn, lijkt de conclusie gerechtvaardigd.', 'Insofar as the data are reliable, the conclusion appears justified.', []],
      ['Niettemin blijft de vraag in hoeverre dit beleid op lange termijn houdbaar is.', 'Nevertheless, the question remains to what extent this policy is sustainable in the long term.', []],
      ['De implicaties reiken verder dan de auteurs aanvankelijk doen vermoeden.', 'The implications extend further than the authors initially suggest.', []]
    ],
    C2: [
      ['Zijn terloopse opmerking was niet zozeer kritisch als wel veelzeggend.', 'His casual remark was not so much critical as revealing.', []],
      ['Met fijnzinnige ironie ondergroef ze een redenering die op het eerste gezicht sluitend leek.', 'With subtle irony she undermined an argument that initially seemed conclusive.', []],
      ['Hoe overtuigend het betoog ook moge klinken, het berust op een nauwelijks houdbare premisse.', 'However convincing the argument may sound, it rests on a barely tenable premise.', []],
      ['Wat doorgaans als terughoudendheid wordt uitgelegd, bleek hier doelbewuste ambiguïteit.', 'What is usually interpreted as restraint proved here to be deliberate ambiguity.', []],
      ['Een al te stellige formulering zou de subtiele verschuiving in betekenis tenietdoen.', 'An overly categorical formulation would undo the subtle shift in meaning.', []]
    ]
  },
  pl: {
    A0: [
      ['Cześć, jestem Sam.', 'Hello, I am Sam.', ['Cześć jestem Sam.']],
      ['To jest książka.', 'This is a book.', ['To książka.']],
      ['Mam wodę.', 'I have water.', []],
      ['Mieszkamy tutaj.', 'We live here.', ['My mieszkamy tutaj.']],
      ['Stół jest duży.', 'The table is big.', []]
    ],
    A1: [
      ['Dzisiaj pracuję w domu.', 'I am working from home today.', ['Pracuję dzisiaj w domu.']],
      ['Gdzie mieszkasz?', 'Where do you live?', ['Gdzie pan mieszka?', 'Gdzie pani mieszka?']],
      ['Ona ma dwóch braci.', 'She has two brothers.', []],
      ['Jemy o siódmej.', 'We eat at seven o’clock.', ['My jemy o siódmej.']],
      ['Nie rozumiem pytania.', 'I do not understand the question.', []]
    ],
    A2: [
      ['Wczoraj spóźniłem się na pociąg.', 'Yesterday I missed the train.', ['Wczoraj spóźniłam się na pociąg.']],
      ['Jutro zadzwonię do mojego kolegi.', 'Tomorrow I will call my colleague.', ['Jutro zadzwonię do mojej koleżanki.']],
      ['Najpierw musisz umówić się na wizytę.', 'You must make an appointment first.', []],
      ['Jeśli będzie ładna pogoda, pojedziemy rowerem na plażę.', 'If the weather is nice, we will cycle to the beach.', []],
      ['Czy może mi pan powiedzieć, gdzie jest dworzec?', 'Can you tell me where the station is?', ['Czy może mi pani powiedzieć, gdzie jest dworzec?']]
    ],
    B1: [
      ['Chociaż padało, i tak poszliśmy na spacer.', 'Although it rained, we still went for a walk.', ['Mimo że padało, poszliśmy na spacer.']],
      ['Uważam, że to rozwiązanie działa lepiej, ponieważ jest prostsze.', 'I think this solution works better because it is simpler.', ['Myślę, że to rozwiązanie jest lepsze, bo jest prostsze.']],
      ['Kiedy przyjechałem, spotkanie już się zaczęło.', 'When I arrived, the meeting had already started.', ['Kiedy przyjechałam, spotkanie już się zaczęło.']],
      ['Książka, którą mi dałeś, okazała się zaskakująco dobra.', 'The book you gave me turned out to be surprisingly good.', []],
      ['Gdybym miał więcej czasu, częściej ćwiczyłbym polski.', 'If I had more time, I would practise Polish more often.', ['Gdybym miała więcej czasu, częściej ćwiczyłabym polski.']]
    ],
    B2: [
      ['Czy mógłby pan dokładniej wyjaśnić tę propozycję?', 'Could you explain the proposal in more detail?', ['Czy mogłaby pani dokładniej wyjaśnić tę propozycję?']],
      ['Nieformalnie powiedziałbym to wprost, ale na spotkaniu ująłbym to ostrożniej.', 'Informally I would say it directly, but in a meeting I would phrase it more carefully.', []],
      ['Chociaż plan ma zalety, nie możemy lekceważyć ryzyka finansowego.', 'Although the plan has advantages, we cannot ignore the financial risk.', []],
      ['Z jednej strony rozwiązanie oszczędza czas, z drugiej zwiększa obciążenie pracą.', 'On the one hand the solution saves time; on the other it increases the workload.', []],
      ['Decyzję podjęto po konsultacji ze wszystkimi zainteresowanymi stronami.', 'The decision was made after consulting all interested parties.', []]
    ],
    C1: [
      ['Pozorna prostota tego rozwiązania przesłania jego społeczne konsekwencje.', 'The apparent simplicity of the solution conceals its social consequences.', []],
      ['Chciałbym zniuansować to założenie, nie podważając głównej tezy.', 'I would like to qualify that assumption without undermining the main thesis.', []],
      ['O ile dane są wiarygodne, wniosek wydaje się uzasadniony.', 'Insofar as the data are reliable, the conclusion appears justified.', []],
      ['Niemniej pozostaje pytanie, na ile ta polityka jest trwała w dłuższej perspektywie.', 'Nevertheless, the question remains how sustainable this policy is in the long term.', []],
      ['Konsekwencje sięgają dalej, niż autorzy początkowo sugerują.', 'The consequences reach further than the authors initially suggest.', []]
    ],
    C2: [
      ['Jego mimochodem rzucona uwaga była nie tyle krytyczna, ile wymowna.', 'His casual remark was not so much critical as revealing.', []],
      ['Subtelną ironią podważyła rozumowanie, które pozornie wydawało się niepodważalne.', 'With subtle irony she undermined reasoning that appeared unassailable.', []],
      ['Jakkolwiek przekonująco brzmi ten wywód, opiera się na ledwie dającej się obronić przesłance.', 'However convincing the argument sounds, it rests on a barely defensible premise.', []],
      ['To, co zwykle uznaje się za powściągliwość, okazało się tutaj celową dwuznacznością.', 'What is usually regarded as restraint proved here to be deliberate ambiguity.', []],
      ['Zbyt kategoryczne sformułowanie zatarłoby subtelne przesunięcie znaczenia.', 'An overly categorical formulation would blur the subtle shift in meaning.', []]
    ]
  },
  pt: {
    A0: [
      ['Olá, eu sou o Sam.', 'Hello, I am Sam.', ['Olá, sou o Sam.', 'Eu sou o Sam.']],
      ['Isto é um livro.', 'This is a book.', ['É um livro.']],
      ['Tenho água.', 'I have water.', []],
      ['Vivemos aqui.', 'We live here.', ['Nós vivemos aqui.']],
      ['A mesa é grande.', 'The table is big.', []]
    ],
    A1: [
      ['Hoje trabalho em casa.', 'I am working from home today.', ['Eu hoje trabalho em casa.']],
      ['Onde moras?', 'Where do you live?', ['Onde é que moras?', 'Onde mora?']],
      ['Ela tem dois irmãos.', 'She has two brothers.', []],
      ['Jantamos às sete horas.', 'We eat at seven o’clock.', ['Nós jantamos às sete horas.']],
      ['Não percebo a pergunta.', 'I do not understand the question.', ['Não entendo a pergunta.']]
    ],
    A2: [
      ['Ontem perdi o comboio.', 'Yesterday I missed the train.', ['Perdi o comboio ontem.']],
      ['Amanhã vou telefonar ao meu colega.', 'Tomorrow I am going to call my colleague.', ['Vou telefonar ao meu colega amanhã.']],
      ['Primeiro tens de marcar uma consulta.', 'You must make an appointment first.', ['Primeiro tem de marcar uma consulta.']],
      ['Se estiver bom tempo, vamos de bicicleta até à praia.', 'If the weather is nice, we will cycle to the beach.', []],
      ['Pode dizer-me onde fica a estação?', 'Can you tell me where the station is?', ['Podes dizer-me onde fica a estação?']]
    ],
    B1: [
      ['Embora estivesse a chover, fomos dar um passeio.', 'Although it was raining, we went for a walk.', ['Fomos dar um passeio, apesar de estar a chover.']],
      ['Acho que esta solução funciona melhor porque é mais simples.', 'I think this solution works better because it is simpler.', ['Penso que esta solução resulta melhor por ser mais simples.']],
      ['Quando cheguei, a reunião já tinha começado.', 'When I arrived, the meeting had already started.', []],
      ['O livro que me deste revelou-se surpreendentemente bom.', 'The book you gave me turned out to be surprisingly good.', []],
      ['Se tivesse mais tempo, praticaria português com mais frequência.', 'If I had more time, I would practise Portuguese more often.', []]
    ],
    B2: [
      ['Poderia explicar a proposta com mais pormenor?', 'Could you explain the proposal in more detail?', ['Podia explicar melhor a proposta?']],
      ['Informalmente diria isso de forma direta, mas numa reunião seria mais cauteloso.', 'Informally I would say that directly, but in a meeting I would be more careful.', []],
      ['Embora o plano tenha vantagens, não devemos subestimar os riscos financeiros.', 'Although the plan has advantages, we must not underestimate the financial risks.', []],
      ['Por um lado, a medida poupa tempo; por outro, aumenta a carga de trabalho.', 'On the one hand the measure saves time; on the other it increases the workload.', []],
      ['A decisão foi tomada depois de todas as partes terem sido consultadas.', 'The decision was made after all parties had been consulted.', []]
    ],
    C1: [
      ['A aparente simplicidade da medida oculta as suas consequências sociais.', 'The apparent simplicity of the measure conceals its social consequences.', []],
      ['Gostaria de matizar esse pressuposto sem negar o essencial do argumento.', 'I would like to qualify that assumption without denying the core of the argument.', []],
      ['Na medida em que os dados são fiáveis, a conclusão parece justificada.', 'Insofar as the data are reliable, the conclusion appears justified.', []],
      ['Ainda assim, resta saber até que ponto esta política é sustentável a longo prazo.', 'Nevertheless, the question remains how sustainable this policy is in the long term.', []],
      ['As implicações vão mais longe do que os autores inicialmente sugerem.', 'The implications go further than the authors initially suggest.', []]
    ],
    C2: [
      ['O comentário feito de passagem não foi tanto crítico quanto revelador.', 'The passing comment was not so much critical as revealing.', []],
      ['Com uma ironia subtil, desmontou um raciocínio que à primeira vista parecia irrefutável.', 'With subtle irony she dismantled reasoning that initially seemed irrefutable.', []],
      ['Por mais convincente que o argumento pareça, assenta numa premissa dificilmente sustentável.', 'However convincing the argument may seem, it rests on a barely sustainable premise.', []],
      ['O que habitualmente se interpreta como contenção revelou-se aqui uma ambiguidade deliberada.', 'What is usually interpreted as restraint proved here to be deliberate ambiguity.', []],
      ['Uma formulação demasiado categórica anularia a subtil mudança de sentido.', 'An overly categorical formulation would undo the subtle shift in meaning.', []]
    ]
  }
});

const CATEGORY_FOCUS = Object.freeze({
  grammar: 'notice the form, agreement and word order',
  vocabulary: 'build meaning, collocation and accurate word choice',
  pronunciation: 'connect spelling, sound, stress and rhythm',
  writing: 'plan, produce and edit clear written language',
  conversation: 'choose natural replies and keep an exchange moving',
  speaking: 'listen, respond aloud and build spoken confidence'
});

const COMMON_MISTAKES = Object.freeze({
  grammar: 'Do not translate the English structure word for word. Check the target-language form and word order.',
  vocabulary: 'Learn words in a phrase or sentence, not as isolated translations only.',
  pronunciation: 'Do not rely on spelling alone. Listen for stress, length, linking and sound contrasts.',
  writing: 'Check agreement, punctuation, word order and whether the register suits the reader.',
  conversation: 'A grammatically possible reply can still sound unnatural. Notice context and politeness.',
  speaking: 'Speak in meaningful chunks rather than pausing after every word.'
});

function sampleObject(entry) {
  return { target: entry[0], translation: entry[1], variants: entry[2] || [] };
}

function slug(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function levelIndex(level) {
  return CEFR_LEVELS.findIndex((item) => item.id === level);
}

function plannedType(category, level, activity) {
  const advanced = levelIndex(level) >= levelIndex('B2');
  if (category === 'speaking') return 'speaking';
  if (category === 'writing') {
    if (['A0', 'A1'].includes(level)) return ['manual', 'multipleChoice', 'manual', 'manual', 'manual'][activity];
    return ['manual', 'multipleChoice', 'manual', 'openResponse', 'openResponse'][activity];
  }
  if (category === 'pronunciation') return ['multipleChoice', 'manual', 'multipleChoice', 'manual', advanced ? 'openResponse' : 'manual'][activity];
  if (category === 'conversation') {
      if (level === 'A0') return ['multipleChoice', 'multipleChoice', 'manual', 'multipleChoice', 'manual'][activity];
    if (['A1', 'A2'].includes(level)) return ['multipleChoice', 'manual', 'manual', 'multipleChoice', 'manual'][activity];
    if (level === 'B1') return ['manual', 'manual', 'manual', 'multipleChoice', 'openResponse'][activity];
    return ['manual', 'openResponse', 'openResponse', 'multipleChoice', 'openResponse'][activity];
  }
  if (level === 'A0') return ['multipleChoice', 'manual', 'multipleChoice', 'manual', 'manual'][activity];
  if (['A1', 'A2'].includes(level)) return ['multipleChoice', 'manual', 'multipleChoice', 'manual', 'manual'][activity];
  if (level === 'B1') return ['multipleChoice', 'manual', 'multipleChoice', 'manual', 'openResponse'][activity];
  return ['multipleChoice', 'manual', 'multipleChoice', 'openResponse', 'openResponse'][activity];
}

function activityPrompt(category, level, activity, sample, languageName) {
  const prompts = {
    grammar: [
      `Choose the sentence with the correct ${level} structure.`,
      `Type the ${languageName} sentence that expresses: ${sample.translation}`,
      `Choose the best sentence for this meaning: ${sample.translation}`,
      `Reproduce the model with accurate grammar and word order: ${sample.translation}`,
      `Write a complete ${level} response using the same grammatical pattern.`
    ],
    vocabulary: [
      `Choose the expression that means: ${sample.translation}`,
      `Recall the complete ${languageName} expression from memory.`,
      `Choose the natural word combination for this context: ${sample.translation}`,
      `Use the target vocabulary in the complete model sentence.`,
      `Write a ${level} response that uses this vocabulary naturally.`
    ],
    pronunciation: [
      `Listen and choose the sentence you hear.`,
      `Listen again and type the words you hear.`,
      `Choose the written form that matches the audio.`,
      `Mark the complete phrase by typing it as one connected unit.`,
      `Describe the stress, rhythm or sound feature you notice, then compare with the model.`
    ],
    writing: [
      level === 'A0' ? `Copy this accurately: ${sample.target}` : `Write the model sentence from this idea: ${sample.translation}`,
      `Choose the clearest written version.`,
      `Rewrite the idea with correct spelling and word order.`,
      `Develop the idea into a suitable ${level} message or paragraph.`,
      `Write a second version with careful tone, cohesion and precision.`
    ],
    conversation: [
      `Choose or give a natural reply for this situation: ${sample.translation}`,
      `Respond in ${languageName} using the model meaning.`,
      `Continue the exchange with a complete and relevant sentence.`,
      `Choose the reply that best fits the context and register.`,
      `Give a fuller ${level} response and compare it with the model.`
    ],
    speaking: [
      `Listen, then repeat: ${sample.target}`,
      `Say this naturally in ${languageName}: ${sample.translation}`,
      `Give the complete spoken response: ${sample.translation}`,
      `Say the sentence again as one fluent phrase.`,
      `Record a clear ${level} response using this model: ${sample.target}`
    ]
  };
  return prompts[category][activity];
}

function makeOptions(sample, sampleBank, topicIndex, activity) {
  const distractors = [];
  for (let offset = 1; offset < sampleBank.length && distractors.length < 3; offset += 1) {
    const candidate = sampleBank[(topicIndex + activity + offset) % sampleBank.length].target;
    if (candidate !== sample.target && !distractors.includes(candidate)) distractors.push(candidate);
  }
  const options = [sample.target, ...distractors];
  const shift = (topicIndex + activity) % options.length;
  return [...options.slice(shift), ...options.slice(0, shift)];
}

function makeExercise(language, category, level, topicId, topicIndex, activity, sample, sampleBank) {
  const languageMeta = LANGUAGES[language];
  const difficulty = getCefrLevel(level);
  const type = plannedType(category, level, activity);
  const number = activity + 1;
  return {
    id: `${language}-${category}-${level.toLowerCase()}-${topicId}-${String(number).padStart(3, '0')}`,
    language,
    category,
    cefrLevel: level,
    topicId,
    lessonId: activity === 0 ? `${topicId}-lesson` : `${topicId}-practice-${String(number).padStart(3, '0')}`,
    type,
    activityNumber: number,
    prompt: activityPrompt(category, level, activity, sample, languageMeta.name),
    options: type === 'multipleChoice' ? makeOptions(sample, sampleBank, topicIndex, activity) : [],
    correctAnswer: sample.target,
    acceptedAnswers: [sample.target, ...sample.variants],
    explanation: `${difficulty.label}: ${difficulty.guidance} Model: “${sample.target}”`,
    translation: ['B2', 'C1', 'C2'].includes(level) && activity !== 0 ? null : sample.translation,
    audioText: sample.target,
    locale: languageMeta.locale,
    difficultyMetadata: {
      cefrLevel: level,
      hintLevel: difficulty.hintLevel,
      answerMode: difficulty.answerMode,
      speechRate: difficulty.speechRate,
      acceptsMultipleAnswers: sample.variants.length > 0 || ['B2', 'C1', 'C2'].includes(level),
      expectedLength: levelIndex(level) < levelIndex('B1') ? 'short' : levelIndex(level) < levelIndex('C1') ? 'extended' : 'long-form'
    }
  };
}

function makeTopic(language, category, level, title, topicIndex) {
  const sampleBank = SAMPLES[language][level].map(sampleObject);
  const sample = sampleBank[topicIndex % sampleBank.length];
  const topicId = slug(title);
  const difficulty = getCefrLevel(level);
  return {
    id: `${language}-${category}-${level.toLowerCase()}-${topicId}`,
    language,
    category,
    cefrLevel: level,
    topicId,
    title,
    description: `${difficulty.description} Practise five activities that ${CATEGORY_FOCUS[category]}.`,
    lesson: {
      id: `${topicId}-lesson`,
      title,
      explanation: `At ${level}, ${CATEGORY_FOCUS[category]}. The model “${sample.target}” communicates “${sample.translation}”. Work from supported recognition towards independent production.`,
      examples: [sample.target, ...sample.variants, sampleBank[(topicIndex + 1) % sampleBank.length].target].slice(0, 3),
      commonMistake: COMMON_MISTAKES[category],
      guidance: difficulty.guidance
    },
    exercises: Array.from({ length: EXERCISES_PER_TOPIC }, (_, activity) =>
      makeExercise(language, category, level, topicId, topicIndex, activity, sample, sampleBank))
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
