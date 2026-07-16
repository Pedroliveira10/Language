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
const PROPER_NAMES = new Set(['sam','anna','pedro','amsterdam','portugal','lisboa','warszawa','nederland','polska']);
const GRAMMAR_TARGETS = Object.freeze({
  nl: new Set(['ben','bent','is','zijn','heb','hebt','heeft','drink','drinkt','woon','woont','de','het','een','ik','je','jij','u','hij','zij','wij','in','op','met','en','maar','omdat','niet','geen']),
  pl: new Set(['jestem','jesteś','jest','są','mam','masz','ma','piję','pijesz','mieszkam','mieszkasz','ja','ty','on','ona','my','w','na','z','i','ale','bo','nie']),
  pt: new Set(['sou','és','é','somos','tenho','tens','tem','bebo','bebes','moro','moras','o','a','um','uma','eu','tu','ele','ela','nós','em','no','na','com','e','mas','porque','não'])
});
const LOW_PRIORITY_GRAMMAR = new Set(['de','het','een','ik','je','jij','u','hij','zij','wij','ja','ty','on','ona','my','o','a','um','uma','eu','tu','ele','ela','nós']);
const RESPONSE_BANK = Object.freeze({
  nl: [
    { cue: 'Hallo, ik ben Sam.', question: 'Hoe heet je?', answers: ['Ik heet Sam.', 'Mijn naam is Sam.', 'Ik ben Sam.'], reply: 'Hallo Sam, ik ben Anna.' },
    { cue: 'Hoe gaat het?', question: 'Hoe gaat het?', answers: ['Goed.', 'Het gaat goed.', 'Heel goed.', 'Prima.', 'Niet zo goed.'], reply: 'Het gaat goed, dank je.' },
    { cue: 'Ik woon in Amsterdam.', question: 'Waar woon je?', answers: ['Ik woon in Amsterdam.', 'In Amsterdam.'], reply: 'Leuk, ik woon ook in Amsterdam.' },
    { cue: 'Ik spreek Nederlands.', question: 'Welke taal spreek je?', answers: ['Ik spreek Nederlands.', 'Nederlands.'], reply: 'Ik spreek ook Nederlands.' },
    { cue: 'Tot morgen!', question: 'Wanneer zien we elkaar?', answers: ['Morgen.', 'We zien elkaar morgen.'], reply: 'Tot morgen!' }
  ],
  pl: [
    { cue: 'Cześć, jestem Sam.', question: 'Jak masz na imię?', answers: ['Mam na imię Sam.', 'Jestem Sam.'], reply: 'Cześć Sam, jestem Anna.' },
    { cue: 'Jak się masz?', question: 'Jak się masz?', answers: ['Dobrze.', 'Mam się dobrze.', 'Świetnie.'], reply: 'Dobrze, dziękuję.' },
    { cue: 'Mieszkam w Warszawie.', question: 'Gdzie mieszkasz?', answers: ['Mieszkam w Warszawie.', 'W Warszawie.'], reply: 'Ja też mieszkam w Warszawie.' },
    { cue: 'Mówię po polsku.', question: 'W jakim języku mówisz?', answers: ['Mówię po polsku.', 'Po polsku.'], reply: 'Ja też mówię po polsku.' },
    { cue: 'Do zobaczenia jutro!', question: 'Kiedy się zobaczymy?', answers: ['Jutro.', 'Zobaczymy się jutro.'], reply: 'Do jutra!' }
  ],
  pt: [
    { cue: 'Olá, eu sou o Sam.', question: 'Como te chamas?', answers: ['Chamo-me Sam.', 'Eu sou o Sam.'], reply: 'Olá Sam, eu sou a Ana.' },
    { cue: 'Como estás?', question: 'Como estás?', answers: ['Estou bem.', 'Bem.', 'Muito bem.'], reply: 'Estou bem, obrigado.' },
    { cue: 'Moro em Lisboa.', question: 'Onde moras?', answers: ['Moro em Lisboa.', 'Em Lisboa.'], reply: 'Eu também moro em Lisboa.' },
    { cue: 'Falo português.', question: 'Que língua falas?', answers: ['Falo português.', 'Português.'], reply: 'Eu também falo português.' },
    { cue: 'Até amanhã!', question: 'Quando nos vemos?', answers: ['Amanhã.', 'Vemo-nos amanhã.'], reply: 'Até amanhã!' }
  ]
});
const ADVANCED_RESPONSE_BANK = Object.freeze({
  nl: [
    { cue: 'Het voorstel lijkt efficiënt, maar brengt aanzienlijke risico’s met zich mee.', question: 'Welke risico’s brengt het voorstel met zich mee?', answers: ['Het brengt aanzienlijke risico’s met zich mee.', 'Vooral de langetermijnrisico’s zijn aanzienlijk.'], reply: 'Daarom moeten we de risico’s eerst grondig beoordelen.' },
    { cue: 'De resultaten spreken de oorspronkelijke hypothese gedeeltelijk tegen.', question: 'In hoeverre ondersteunen de resultaten de hypothese?', answers: ['Ze ondersteunen de hypothese slechts gedeeltelijk.', 'De resultaten spreken haar gedeeltelijk tegen.'], reply: 'Dan moeten we de hypothese waarschijnlijk bijstellen.' },
    { cue: 'Hoewel de maatregel populair is, blijft de uitvoering problematisch.', question: 'Waarom blijft de maatregel omstreden?', answers: ['Omdat de uitvoering problematisch blijft.', 'De uitvoering roept nog belangrijke bezwaren op.'], reply: 'Populariteit alleen garandeert inderdaad geen goede uitvoering.' },
    { cue: 'We moeten zowel de kosten als de maatschappelijke gevolgen afwegen.', question: 'Welke factoren moeten we tegen elkaar afwegen?', answers: ['De kosten en de maatschappelijke gevolgen.', 'We moeten financiële en maatschappelijke factoren afwegen.'], reply: 'Laten we beide factoren in de analyse opnemen.' },
    { cue: 'Zijn opmerking was niet zozeer kritisch als wel veelzeggend.', question: 'Hoe zou je zijn opmerking karakteriseren?', answers: ['Als veelzeggend eerder dan kritisch.', 'De opmerking was vooral veelzeggend.'], reply: 'Dat is ook hoe ik zijn opmerking interpreteerde.' }
  ],
  pl: [
    { cue: 'Propozycja wydaje się skuteczna, ale wiąże się ze znacznym ryzykiem.', question: 'Z jakim ryzykiem wiąże się ta propozycja?', answers: ['Wiąże się ze znacznym ryzykiem.', 'Najważniejsze jest ryzyko długoterminowe.'], reply: 'Dlatego najpierw powinniśmy dokładnie ocenić ryzyko.' },
    { cue: 'Wyniki częściowo przeczą pierwotnej hipotezie.', question: 'W jakim stopniu wyniki potwierdzają hipotezę?', answers: ['Potwierdzają ją tylko częściowo.', 'Wyniki częściowo jej przeczą.'], reply: 'W takim razie należy skorygować hipotezę.' },
    { cue: 'Chociaż rozwiązanie jest popularne, jego wdrożenie pozostaje trudne.', question: 'Dlaczego rozwiązanie nadal budzi zastrzeżenia?', answers: ['Ponieważ jego wdrożenie pozostaje trudne.', 'Problemem jest sposób wdrożenia.'], reply: 'Sama popularność rzeczywiście nie gwarantuje powodzenia.' },
    { cue: 'Musimy rozważyć zarówno koszty, jak i skutki społeczne.', question: 'Jakie czynniki musimy rozważyć?', answers: ['Koszty i skutki społeczne.', 'Musimy uwzględnić czynniki finansowe i społeczne.'], reply: 'Uwzględnijmy oba czynniki w analizie.' },
    { cue: 'Jego uwaga była nie tyle krytyczna, ile wymowna.', question: 'Jak scharakteryzujesz jego uwagę?', answers: ['Była raczej wymowna niż krytyczna.', 'Uwaga była przede wszystkim wymowna.'], reply: 'Ja również tak ją zinterpretowałem.' }
  ],
  pt: [
    { cue: 'A proposta parece eficaz, mas implica riscos consideráveis.', question: 'Que riscos implica esta proposta?', answers: ['Implica riscos consideráveis.', 'Os riscos a longo prazo são especialmente relevantes.'], reply: 'Por isso, devemos avaliar primeiro os riscos com rigor.' },
    { cue: 'Os resultados contrariam parcialmente a hipótese inicial.', question: 'Em que medida os resultados sustentam a hipótese?', answers: ['Sustentam-na apenas parcialmente.', 'Os resultados contrariam-na em parte.'], reply: 'Nesse caso, teremos de reformular a hipótese.' },
    { cue: 'Embora a medida seja popular, a execução continua problemática.', question: 'Porque continua a medida a suscitar reservas?', answers: ['Porque a execução continua problemática.', 'A forma de execução ainda levanta objeções.'], reply: 'A popularidade, por si só, não garante uma boa execução.' },
    { cue: 'Temos de ponderar os custos e as consequências sociais.', question: 'Que fatores temos de ponderar?', answers: ['Os custos e as consequências sociais.', 'Temos de ponderar fatores financeiros e sociais.'], reply: 'Incluamos ambos os fatores na análise.' },
    { cue: 'O comentário foi mais revelador do que propriamente crítico.', question: 'Como caracterizarias o comentário?', answers: ['Como revelador, mais do que crítico.', 'O comentário foi sobretudo revelador.'], reply: 'Foi também essa a minha interpretação.' }
  ]
});
function responseBank(language, level) { return ['B2','C1','C2'].includes(level) ? ADVANCED_RESPONSE_BANK[language] : RESPONSE_BANK[language]; }

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

function tokenWord(token) { return normalizeText(String(token).replace(/^[-–—"“”'’]+|[-–—"“”'’]+$/g, '')); }

export function blankSentence(sentence, { category = 'vocabulary', language = 'nl' } = {}) {
  const tokens = tokenizeSentence(sentence);
  const eligible = tokens.map((token, index) => ({ token: tokenWord(token), index })).filter(({ token }) => token && !PROPER_NAMES.has(token));
  let selected = category === 'grammar' ? eligible.find(({ token }) => GRAMMAR_TARGETS[language]?.has(token) && !LOW_PRIORITY_GRAMMAR.has(token)) : null;
  if (!selected && category === 'grammar') selected = eligible.find(({ token }) => GRAMMAR_TARGETS[language]?.has(token));
  if (!selected && category === 'grammar') selected = eligible.find(({ index }) => index > 0 && index < tokens.length - 1);
  if (!selected) selected = [...eligible].reverse().find(({ token }) => token.length > 2) || eligible.at(-1);
  const index = selected?.index ?? Math.max(0, tokens.length - 1);
  const match = tokens[index].match(/^(.*?)([.,!?;:]*)$/u);
  const answer = match?.[1] || tokens[index];
  tokens[index] = `____${match?.[2] || ''}`;
  return { promptSentence: sentenceFromTokens(tokens), answer, removedIndex: index, targetRole: category === 'grammar' ? 'grammar-form' : 'vocabulary-item' };
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

function taskData(sectionId, seed, seedPool, languageName, index, language, category, level) {
  const target = seed.correctAnswer;
  const source = seed.translation;
  const targetPool = seedPool.map((item) => item.correctAnswer);
  const sourcePool = seedPool.map((item) => item.translation).filter(Boolean);
  if (sectionId === 'translation') return { prompt: `Translate from English into ${languageName}: ${source}`, answer: target, translation: null };
  if (sectionId === 'word-meaning') return { prompt: `Choose the correct meaning of: ${target}`, answer: source, options: distractors(source, sourcePool, index), translation: null };
  if (sectionId === 'meaning-word') return { prompt: `Choose the ${languageName} phrase for: ${source}`, answer: target, options: distractors(target, targetPool, index), translation: null };
  if (sectionId === 'fill-blank' || sectionId === 'sentence-completion') {
    const blank = blankSentence(target, { category, language });
    return { prompt: `Complete the sentence: ${blank.promptSentence}`, answer: blank.answer, translation: null, blank: blank.promptSentence, blankTargetRole: blank.targetRole, removedIndex: blank.removedIndex };
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
  if (sectionId === 'choose-reply') {
    const bank = responseBank(language, level); const item = bank[index % bank.length]; const replyPool = bank.map((entry) => entry.reply);
    return { prompt: `Choose the most natural reply: ${item.cue}`, answer: item.reply, options: distractors(item.reply, replyPool, index), audioText: item.cue, translation: null };
  }
  if (sectionId === 'copying') return { prompt: `Copy exactly: ${target}`, answer: target, translation: source };
  if (sectionId === 'repeat-word') { const word = tokenizeSentence(target).map(tokenWord).find((item) => item.length > 2 && !PROPER_NAMES.has(item)) || tokenWord(target); return { prompt: `Listen and repeat the word: ${word}`, answer: word, audioText: word, translation: null }; }
  if (sectionId === 'repeat-sentence') return { prompt: `Listen and repeat: ${target}`, answer: target, audioText: target, translation: source };
  if (sectionId === 'answer-question') {
    const bank = responseBank(language, level); const item = bank[index % bank.length];
    return { prompt: item.question, answer: item.answers[0], acceptedAnswers: item.answers, requiredConcepts: tokenizeSentence(item.answers[0]).filter((word) => word.length > 3).slice(-1), responseMode: 'flexible', audioText: item.question, translation: null };
  }
  if (sectionId === 'free-speaking' || sectionId === 'describe-situation') return { prompt: `Speak freely in ${languageName} about this situation: ${source}`, answer: target, acceptedAnswers: seed.acceptedAnswers?.length ? seed.acceptedAnswers : [target], requiredConcepts: tokenizeSentence(target).map(tokenWord).filter((word) => word.length > 3 && !PROPER_NAMES.has(word)).slice(-2), responseMode: 'flexible', audioText: null, translation: null };
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
    const task = taskData(id, seed, uniqueSeeds, languageName, index, language, category, level);
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
      acceptedAnswers: task.acceptedAnswers || [task.answer],
      options: task.options || [],
      orderingTokens: task.tokens || [],
      incorrectSentence: task.incorrectSentence || null,
      blank: task.blank || null,
      blankTargetRole: task.blankTargetRole || null,
      removedIndex: task.removedIndex ?? null,
      responseMode: task.responseMode || 'exact',
      requiredConcepts: task.requiredConcepts || [],
      audioText: task.audioText === null ? null : task.audioText || seed.correctAnswer,
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
  if (['fill-blank','sentence-completion'].includes(exercise.exerciseType)) {
    if (!exercise.blank?.includes('____')) errors.push('Fill in the Blank has no real blank.');
    if (exercise.blank?.replace('____', exercise.correctAnswer) !== exercise.audioText) errors.push('Blank answer does not reconstruct the source sentence.');
    if (exercise.category === 'grammar' && (exercise.blankTargetRole !== 'grammar-form' || PROPER_NAMES.has(normalizeText(exercise.correctAnswer)))) errors.push('Grammar blank does not target a grammar form.');
  }
  if (MULTIPLE_CHOICE.has(exercise.exerciseType)) {
    const options = (exercise.options || []).map((option) => normalizeText(option)).filter(Boolean);
    if (options.length < 3 || new Set(options).size !== options.length) errors.push('Multiple-choice exercise needs at least three unique non-empty options.');
    if (options.filter((option) => option === answer).length !== 1) errors.push('Multiple-choice correct answer must occur exactly once in options.');
  }
  if (exercise.exerciseType === 'answer-question') {
    if (!/[?¿]$/.test(String(exercise.prompt).trim()) || !/^(wie|wat|waar|wanneer|waarom|hoe|welke|in hoeverre|czy|kto|co|gdzie|kiedy|dlaczego|jak|jaki|jaka|jakie|w jakim|z jakim|quem|o que|onde|quando|como|qual|que|em que medida|porque)\b/i.test(String(exercise.prompt).trim())) errors.push('Answer a Question needs a genuine target-language question.');
    if (normalizeText(exercise.prompt) === answer || exercise.responseMode !== 'flexible' || exercise.acceptedAnswers.length < 2) errors.push('Answer a Question needs multiple logical response patterns.');
  }
  if (SPEAKING.has(exercise.exerciseType) && (!answer || !exercise.acceptedAnswers?.length)) errors.push('Speaking exercise has no expected response.');
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
