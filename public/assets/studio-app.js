import { CEFR_LEVELS } from './config/cefrLevels.js';
import { CATEGORIES, getCategory } from './config/categories.js';
import { COURSE_CONTENT, LANGUAGES, findTopic, getTopics } from './data/expandedCourseContent.js';
import { LANGUAGE_BASICS, findBasicsLesson } from './data/language-basics/index.js';
import { CategoryCard } from './components/CategoryCard.js';
import { CefrLevelSelector } from './components/CefrLevelSelector.js';
import { RichTopicCard } from './components/RichTopicCard.js';
import { ExpandedExerciseRenderer } from './components/ExpandedExerciseRenderer.js';
import { AnswerFeedback, SpeechFeedback } from './components/FeedbackBox.js';
import { escapeHtml } from './components/studioMarkup.js';
import { speakText } from './services/studioAudio.js';
import { compareSpeech, isSpeechRecognitionSupported, recogniseOnce } from './services/speechRecognition.js';
import { getLessonProgress, loadStudioProgress, progressSummary, recordExerciseAttempt, saveLastRoute } from './services/studioProgress.js';
import { loadStudioPreferences, saveStudioPreferences, setCourseEnrolled } from './services/studioPreferences.js';

const root = document.getElementById('app');
const settingsModal = document.getElementById('settingsModal');
const settingsButton = document.getElementById('settingsButton');
const closeSettings = document.getElementById('closeSettings');
let progress = loadStudioProgress();
let preferences = loadStudioPreferences();
let currentTopic = null;
let currentBasicsLesson = null;

function route(parts) {
  return `#/${parts.filter(Boolean).map((part) => encodeURIComponent(part)).join('/')}`;
}

function decodeRoute() {
  try {
    return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return [];
  }
}

function backLink(href, label = 'Back') {
  return `<a class="back-link" href="${href}">← ${escapeHtml(label)}</a>`;
}

function viewHeader({ eyebrow, title, description, backHref, backLabel, actions = '' }) {
  return `<div class="view-header">
    <div>${backHref ? backLink(backHref, backLabel) : ''}<p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div>
    ${actions ? `<div class="view-actions">${actions}</div>` : ''}
  </div>`;
}

function applyPreferences() {
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = preferences.theme === 'dark' || (preferences.theme === 'system' && systemDark);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.motion = preferences.reducedMotion ? 'reduced' : 'full';
}

function syncSettingsControls() {
  document.querySelectorAll('[data-setting]').forEach((control) => {
    const key = control.dataset.setting;
    if (control.type === 'checkbox') control.checked = Boolean(preferences[key]);
    else control.value = String(preferences[key]);
  });
}

function openSettings() {
  syncSettingsControls();
  settingsModal.hidden = false;
  closeSettings.focus();
}

function hideSettings() {
  settingsModal.hidden = true;
  settingsButton.focus();
}

function topicContext(topic, exercise = null) {
  return {
    language: topic.language,
    category: topic.category,
    cefrLevel: topic.cefrLevel,
    topicId: topic.topicId,
    lessonId: exercise?.lessonId || topic.lesson.id
  };
}

function topicProgress(topic) {
  const completed = topic.exercises.filter((exercise) =>
    Boolean(getLessonProgress(progress, topicContext(topic, exercise))?.completed)).length;
  return { completed, total: topic.exercises.length };
}

function basicsContext(lesson) {
  return { language: 'basics', category: 'language-basics', cefrLevel: 'A0', topicId: lesson.id, lessonId: lesson.id };
}

function cappedSummary(filter, total) {
  const summary = progressSummary(progress, filter);
  return { ...summary, completed: Math.min(total, summary.completed), total };
}

function renderHome() {
  currentTopic = null;
  currentBasicsLesson = null;
  const all = progressSummary(progress);
  const continueAction = progress.lastRoute && progress.lastRoute !== '#/'
    ? `<a class="button secondary" href="${escapeHtml(progress.lastRoute)}">Continue last lesson</a>` : '';
  root.innerHTML = `${viewHeader({
    eyebrow: 'One studio · three languages',
    title: 'Choose what you want to learn',
    description: 'Follow a clear Category → CEFR level → Topic → Exercise path, or learn grammar terminology in English.',
    actions: continueAction
  })}
  <section class="dashboard-stats" aria-label="Learning summary">
    <div><strong>${preferences.enrolled.length}</strong><span>courses enrolled</span></div>
    <div><strong>${all.completed}</strong><span>lessons completed</span></div>
    <div><strong>${all.correct}</strong><span>correct answers</span></div>
    <div><strong>${all.speakingAttempts}</strong><span>speaking attempts</span></div>
  </section>
  <section class="course-grid" aria-label="Courses">
    ${Object.values(LANGUAGES).map((language) => {
      const enrolled = preferences.enrolled.includes(language.id);
      const summary = progressSummary(progress, { language: language.id });
      return `<article class="course-card accent-${language.accent}">
        <span class="course-flag" aria-hidden="true">${language.flag}</span>
        <span class="enrolment-status ${enrolled ? 'active' : ''}">${enrolled ? 'Enrolled' : 'Not enrolled'}</span>
        <h2>${escapeHtml(language.name)}</h2>
        <p>Grammar, vocabulary, pronunciation, writing, conversation and speaking from A0 to C2.</p>
        <div class="chip-row"><span class="chip high-contrast">${language.locale} audio</span><span class="chip high-contrast">7 CEFR levels</span><span class="chip high-contrast">${summary.completed} complete</span></div>
        <div class="button-row"><a class="button" href="${route(['language', language.id])}">Open course</a><button class="button secondary" type="button" data-enrol-language="${language.id}">${enrolled ? 'Leave course' : 'Enrol'}</button></div>
      </article>`;
    }).join('')}
    <article class="course-card basics-card">
      <span class="course-flag" aria-hidden="true">🧩</span><span class="enrolment-status active">English guide</span>
      <h2>Language Basics</h2>
      <p>Learn what nouns, pronouns, verbs, clauses, cases and other grammar terms mean before using them in a new language.</p>
      <div class="chip-row"><span class="chip high-contrast">${LANGUAGE_BASICS.length} lessons</span><span class="chip high-contrast">Quizzes</span><span class="chip high-contrast">Sentence breakdowns</span></div>
      <div class="button-row"><a class="button" href="#/basics">Learn the basics</a></div>
    </article>
  </section>`;
}

function renderLanguage(languageId) {
  const language = LANGUAGES[languageId];
  if (!language) return renderNotFound('Language not found.');
  const cards = CATEGORIES.map((category) => {
    const total = CEFR_LEVELS.reduce((sum, level) => sum + getTopics(languageId, category.id, level.id)
      .reduce((levelTotal, topic) => levelTotal + topic.exercises.length, 0), 0);
    const summary = cappedSummary({ language: languageId, category: category.id }, total);
    return CategoryCard({ category, completed: summary.completed, total, href: route(['language', languageId, 'category', category.id]) });
  }).join('');
  root.innerHTML = `${viewHeader({
    eyebrow: `${language.flag} ${language.name}`,
    title: `${language.name} course`,
    description: 'Choose a category first. CEFR levels appear inside each category.',
    backHref: '#/', backLabel: 'All courses',
    actions: '<a class="button secondary" href="./legacy.html">Open preserved legacy lessons</a>'
  })}<div class="selection-grid">${cards}</div>`;
}

function renderCategory(languageId, categoryId) {
  const language = LANGUAGES[languageId];
  const category = getCategory(categoryId);
  if (!language || !category) return renderNotFound('Category not found.');
  const summaries = Object.fromEntries(CEFR_LEVELS.map((level) => {
    const total = getTopics(languageId, categoryId, level.id)
      .reduce((sum, topic) => sum + topic.exercises.length, 0);
    return [level.id, cappedSummary({ language: languageId, category: categoryId, cefrLevel: level.id }, total)];
  }));
  root.innerHTML = `${viewHeader({
    eyebrow: `${language.name} · ${category.label}`,
    title: 'Choose your CEFR level',
    description: 'Difficulty changes the content, support, exercise type, speaking speed and expected answer length.',
    backHref: route(['language', languageId]), backLabel: `${language.name} categories`
  })}${CefrLevelSelector({
    levels: CEFR_LEVELS,
    summaries,
    routeFor: (level) => route(['language', languageId, 'category', categoryId, 'level', level])
  })}`;
}

function renderTopics(languageId, categoryId, level) {
  const language = LANGUAGES[languageId];
  const category = getCategory(categoryId);
  const levelMeta = CEFR_LEVELS.find((item) => item.id === level);
  if (!language || !category || !levelMeta) return renderNotFound('Course level not found.');
  const topics = getTopics(languageId, categoryId, level);
  const cards = topics.map((topic) => {
    const summary = topicProgress(topic);
    return RichTopicCard({
      topic,
      completed: summary.completed,
      total: summary.total,
      href: route(['language', languageId, 'category', categoryId, 'level', level, 'topic', topic.topicId])
    });
  }).join('');
  root.innerHTML = `${viewHeader({
    eyebrow: `${language.name} · ${category.label} · ${level}`,
    title: `${level} — ${levelMeta.label}`,
    description: levelMeta.guidance,
    backHref: route(['language', languageId, 'category', categoryId]), backLabel: 'All levels'
  })}${cards ? `<div class="selection-grid">${cards}</div>` : '<div class="notice">No lessons are available for this level yet.</div>'}`;
}

function renderTopic(languageId, categoryId, level, topicId) {
  const language = LANGUAGES[languageId];
  const category = getCategory(categoryId);
  const topic = findTopic(languageId, categoryId, level, topicId);
  if (!language || !category || !topic) return renderNotFound('This lesson does not exist or could not be loaded.');
  currentTopic = topic;
  currentBasicsLesson = null;
  root.innerHTML = `${viewHeader({
    eyebrow: `${language.name} · ${category.label} · ${level}`,
    title: topic.title,
    description: topic.description,
    backHref: route(['language', languageId, 'category', categoryId, 'level', level]), backLabel: `${level} topics`
  })}
  <article class="lesson-card">
    <p class="eyebrow">Lesson</p><h2>${escapeHtml(topic.lesson.title)}</h2>
    <p>${escapeHtml(topic.lesson.explanation)}</p>
    <div class="example-list">${topic.lesson.examples.map((example) => `<div><span>Example</span>${escapeHtml(example)}</div>`).join('')}</div>
    <div class="lesson-note"><strong>Common mistake</strong><p>${escapeHtml(topic.lesson.commonMistake)}</p></div>
    <div class="lesson-note guidance"><strong>Support at ${level}</strong><p>${escapeHtml(topic.lesson.guidance)}</p></div>
  </article>
  <div class="exercise-stack">${topic.exercises.map((exercise, index) => ExpandedExerciseRenderer(exercise, {
    speechSupported: isSpeechRecognitionSupported(window),
    index,
    total: topic.exercises.length,
    completed: Boolean(getLessonProgress(progress, topicContext(topic, exercise))?.completed)
  })).join('')}</div>`;
}

function renderBasics() {
  currentTopic = null;
  currentBasicsLesson = null;
  root.innerHTML = `${viewHeader({
    eyebrow: 'English foundation course',
    title: 'Language Basics',
    description: 'Friendly explanations for learners who have never studied grammar terminology.',
    backHref: '#/', backLabel: 'Dashboard'
  })}<div class="basics-list">${LANGUAGE_BASICS.map((lesson) => {
    const complete = Boolean(getLessonProgress(progress, basicsContext(lesson))?.completed);
    return `<a class="basics-list-item ${complete ? 'is-complete' : ''}" href="${route(['basics', lesson.id])}"><span>${lesson.order}</span><strong>${escapeHtml(lesson.title)}</strong><small>${complete ? 'Complete ✓' : 'Definition · examples · quiz · practice'}</small></a>`;
  }).join('')}</div>`;
}

function renderBasicsLesson(id) {
  const lesson = findBasicsLesson(id);
  if (!lesson) return renderNotFound('This Language Basics lesson does not exist.');
  currentTopic = null;
  currentBasicsLesson = lesson;
  root.innerHTML = `${viewHeader({
    eyebrow: `Language Basics · Lesson ${lesson.order}`,
    title: lesson.title,
    description: lesson.definition,
    backHref: '#/basics', backLabel: 'All basics lessons'
  })}
  <article class="lesson-card basics-lesson">
    <section><h2>Simple explanation</h2><p>${escapeHtml(lesson.simpleExplanation)}</p></section>
    <section><h2>Example</h2><p class="example-sentence">${escapeHtml(lesson.examples[0])}</p>
      <div class="sentence-breakdown">${lesson.breakdown.map((part) => `<div><strong>${escapeHtml(part.text)}</strong><span>${escapeHtml(part.role)}</span></div>`).join('')}</div>
    </section>
    <section class="lesson-note"><h2>Common mistake</h2><p>${escapeHtml(lesson.commonMistakes[0])}</p></section>
    <section><h2>Connections to your courses</h2><div class="connection-grid"><p><strong>🇳🇱 Dutch</strong>${escapeHtml(lesson.connections.nl)}</p><p><strong>🇵🇱 Polish</strong>${escapeHtml(lesson.connections.pl)}</p><p><strong>🇵🇹 Portuguese</strong>${escapeHtml(lesson.connections.pt)}</p></div></section>
  </article>
  <section class="exercise-card" data-basics-quiz="${lesson.id}"><div class="exercise-kicker">Short quiz</div><h3>${escapeHtml(lesson.quiz.question)}</h3><div class="answer-options">${lesson.quiz.options.map((option, index) => `<button class="answer-option" type="button" data-basics-option="${index}">${escapeHtml(option)}</button>`).join('')}</div><div class="exercise-feedback" data-basics-feedback></div></section>
  <section class="exercise-card" data-basics-manual="${lesson.id}"><div class="exercise-kicker">Manual exercise</div><h3>${escapeHtml(lesson.manualExercise.prompt)}</h3><label class="manual-field">Your example<textarea rows="4" data-basics-input placeholder="Write your own example"></textarea></label><button class="button" type="button" data-basics-model>Compare with model</button><div class="exercise-feedback" data-basics-manual-feedback></div></section>`;
}

function renderNotFound(message) {
  currentTopic = null;
  currentBasicsLesson = null;
  root.innerHTML = `${viewHeader({ eyebrow: 'Something went wrong', title: 'Page unavailable', description: message, backHref: '#/', backLabel: 'Dashboard' })}<div class="notice warning">${escapeHtml(message)}</div>`;
}

function renderRoute() {
  const parts = decodeRoute();
  if (!parts.length) renderHome();
  else if (parts[0] === 'basics' && parts.length === 1) renderBasics();
  else if (parts[0] === 'basics' && parts[1]) renderBasicsLesson(parts[1]);
  else if (parts[0] === 'language' && parts[1] && parts.length === 2) renderLanguage(parts[1]);
  else if (parts[0] === 'language' && parts[2] === 'category' && parts[3] && parts.length === 4) renderCategory(parts[1], parts[3]);
  else if (parts[0] === 'language' && parts[2] === 'category' && parts[4] === 'level' && parts[5] && parts.length === 6) renderTopics(parts[1], parts[3], parts[5]);
  else if (parts[0] === 'language' && parts[2] === 'category' && parts[4] === 'level' && parts[6] === 'topic' && parts[7]) renderTopic(parts[1], parts[3], parts[5], parts[7]);
  else renderNotFound('The requested route is not valid.');
  saveLastRoute(progress, location.hash || '#/');
  document.title = `${root.querySelector('h1')?.textContent || 'Language Learning Studio'} · Language Studio`;
  root.focus({ preventScroll: true });
  scrollTo({ top: 0, behavior: preferences.reducedMotion ? 'auto' : 'smooth' });
}

function findExercise(id) {
  return currentTopic?.exercises.find((exercise) => exercise.id === id) || null;
}

function normaliseAnswer(value) {
  return String(value || '').toLocaleLowerCase().normalize('NFC').replace(/[.,!?;:"“”„'’]/g, '').replace(/\s+/g, ' ').trim();
}

function acceptedAnswer(exercise, answer) {
  const normalized = normaliseAnswer(answer);
  return exercise.acceptedAnswers.some((candidate) => normaliseAnswer(candidate) === normalized);
}

function feedbackTarget(exerciseId) {
  return root.querySelector(`[data-feedback-for="${exerciseId}"]`);
}

function storeExerciseResult(exercise, result) {
  const record = recordExerciseAttempt(progress, topicContext(currentTopic, exercise), { ...result, type: exercise.type });
  if (record.completed) {
    const card = root.querySelector(`[data-exercise-card="${exercise.id}"]`);
    card?.classList.add('is-complete');
    const status = card?.querySelector('[data-exercise-status]');
    if (status) status.textContent = 'Complete ✓';
  }
  return record;
}

function showAnswerResult(exercise, answer) {
  const correct = acceptedAnswer(exercise, answer);
  storeExerciseResult(exercise, { correct, completed: correct, answer });
  feedbackTarget(exercise.id).innerHTML = AnswerFeedback({ correct, explanation: exercise.explanation, acceptedAnswers: exercise.acceptedAnswers });
}

function listenToExercise(exercise) {
  const target = feedbackTarget(exercise.id);
  if (!preferences.soundEnabled) {
    target.innerHTML = '<div class="notice warning">Pronunciation audio is disabled in Settings.</div>';
    return;
  }
  if (!speakText(exercise.audioText, exercise.locale, exercise.difficultyMetadata.speechRate, window)) {
    target.innerHTML = '<div class="notice warning">Audio is unavailable in this browser.</div>';
  }
}

async function startSpeaking(exercise, trigger) {
  const target = feedbackTarget(exercise.id);
  const original = trigger.innerHTML;
  trigger.disabled = true;
  trigger.innerHTML = '<span aria-hidden="true">●</span> Listening…';
  target.innerHTML = '<div class="notice">Speak now. Recognition stops automatically.</div>';
  try {
    const recognised = await recogniseOnce(exercise.locale, window);
    const result = compareSpeech(recognised, exercise.correctAnswer, exercise.acceptedAnswers);
    storeExerciseResult(exercise, { correct: result.accepted, completed: result.accepted, answer: recognised });
    target.innerHTML = SpeechFeedback(result, exercise.id);
  } catch (error) {
    target.innerHTML = `<div class="notice warning" role="alert">${escapeHtml(error.message)}</div>`;
  } finally {
    trigger.disabled = false;
    trigger.innerHTML = original;
  }
}

root.addEventListener('click', (event) => {
  const enrol = event.target.closest('[data-enrol-language]');
  if (enrol) {
    const language = enrol.dataset.enrolLanguage;
    preferences = setCourseEnrolled(preferences, language, !preferences.enrolled.includes(language));
    saveStudioPreferences(preferences);
    renderHome();
    return;
  }
  const listen = event.target.closest('[data-listen-exercise]');
  if (listen) { const exercise = findExercise(listen.dataset.listenExercise); if (exercise) listenToExercise(exercise); return; }
  const answer = event.target.closest('[data-answer-exercise]');
  if (answer) { const exercise = findExercise(answer.dataset.answerExercise); if (exercise) showAnswerResult(exercise, answer.dataset.answer); return; }
  const check = event.target.closest('[data-check-exercise]');
  if (check) {
    const exercise = findExercise(check.dataset.checkExercise);
    const input = root.querySelector(`[data-input-exercise="${check.dataset.checkExercise}"]`);
    if (exercise && input) showAnswerResult(exercise, input.value);
    return;
  }
  const reveal = event.target.closest('[data-reveal-exercise]');
  if (reveal) {
    const exercise = findExercise(reveal.dataset.revealExercise);
    const input = root.querySelector(`[data-input-exercise="${reveal.dataset.revealExercise}"]`);
    if (exercise) {
      storeExerciseResult(exercise, { correct: null, completed: Boolean(input?.value.trim()), answer: input?.value || '' });
      feedbackTarget(exercise.id).innerHTML = `<div class="answer-feedback correct"><strong>Model answer</strong><p>${escapeHtml(exercise.correctAnswer)}</p><p>${escapeHtml(exercise.explanation)}</p></div>`;
    }
    return;
  }
  const speak = event.target.closest('[data-speak-exercise]');
  if (speak) { const exercise = findExercise(speak.dataset.speakExercise); if (exercise) startSpeaking(exercise, speak); return; }
  const basicsOption = event.target.closest('[data-basics-option]');
  if (basicsOption && currentBasicsLesson) {
    const option = currentBasicsLesson.quiz.options[Number(basicsOption.dataset.basicsOption)];
    const correct = option === currentBasicsLesson.quiz.answer;
    recordExerciseAttempt(progress, basicsContext(currentBasicsLesson), { correct, completed: correct, type: 'multipleChoice', answer: option });
    root.querySelector('[data-basics-feedback]').innerHTML = AnswerFeedback({ correct, explanation: currentBasicsLesson.quiz.explanation, acceptedAnswers: [currentBasicsLesson.quiz.answer] });
    return;
  }
  const basicsModel = event.target.closest('[data-basics-model]');
  if (basicsModel && currentBasicsLesson) {
    const input = root.querySelector('[data-basics-input]');
    recordExerciseAttempt(progress, basicsContext(currentBasicsLesson), { correct: null, completed: Boolean(input.value.trim()), type: 'writing', answer: input.value });
    root.querySelector('[data-basics-manual-feedback]').innerHTML = `<div class="answer-feedback correct"><strong>Model example</strong><p>${escapeHtml(currentBasicsLesson.manualExercise.modelAnswer)}</p><p>Compare its structure with your example. More than one answer can be valid.</p></div>`;
  }
});

settingsButton.addEventListener('click', openSettings);
closeSettings.addEventListener('click', hideSettings);
settingsModal.addEventListener('click', (event) => { if (event.target === settingsModal) hideSettings(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !settingsModal.hidden) hideSettings(); });
document.addEventListener('change', (event) => {
  const control = event.target.closest('[data-setting]');
  if (!control) return;
  const key = control.dataset.setting;
  preferences[key] = control.type === 'checkbox' ? control.checked : key === 'dailyGoal' ? Number(control.value) : control.value;
  saveStudioPreferences(preferences);
  applyPreferences();
});
window.addEventListener('hashchange', renderRoute);
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (preferences.theme === 'system') applyPreferences(); });

applyPreferences();
syncSettingsControls();
if (!location.hash) location.hash = '#/';
else renderRoute();

export { COURSE_CONTENT };

