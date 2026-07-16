import { CEFR_LEVELS } from './config/cefrLevels.js';
import { CATEGORIES, getCategory } from './config/categories.js';
import { COURSE_CONTENT, LANGUAGES } from './data/expandedCourseContent.js';
import { EXERCISES_PER_LEVEL, getExerciseSections, getExerciseSection, sentenceFromTokens, validateLevelCatalog } from './data/exerciseCatalog.js?v=20260716-1';
import { getLanguageStructure, findStructureLesson } from './data/languageStructure.js';
import { CategoryCard } from './components/CategoryCard.js';
import { CefrLevelSelector } from './components/CefrLevelSelector.js';
import { ExpandedExerciseRenderer } from './components/ExpandedExerciseRenderer.js';
import { AnswerFeedback, SpeechFeedback } from './components/FeedbackBox.js';
import { escapeHtml, progressPercent } from './components/studioMarkup.js';
import { speakText } from './services/studioAudio.js';
import { compareSpeech, isSpeechRecognitionSupported, startRecognition } from './services/speechRecognition.js';
import { getLessonProgress, getSectionPosition, loadStudioProgress, progressSummary, recordExerciseAttempt, saveLastRoute, saveSectionPosition, saveStructureReading, toggleStructureBookmark } from './services/studioProgress.js';
import { loadStudioPreferences, saveStudioPreferences, setCourseEnrolled } from './services/studioPreferences.js';

const root = document.getElementById('app');
const settingsModal = document.getElementById('settingsModal');
const settingsButton = document.getElementById('settingsButton');
const closeSettings = document.getElementById('closeSettings');
let progress = loadStudioProgress();
let preferences = loadStudioPreferences();
let currentExercise = null;
let currentContext = null;
let structureSearchTimer = null;
let activeRecognition = null;

const route = (parts) => `#/${parts.filter((part) => part !== undefined && part !== null).map((part) => encodeURIComponent(part)).join('/')}`;
function decodeRoute() { try { return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent); } catch { return []; } }
const backLink = (href, label = 'Back') => `<a class="back-link" href="${href}">← ${escapeHtml(label)}</a>`;
function viewHeader({ eyebrow, title, description, backHref, backLabel, actions = '' }) {
  return `<div class="view-header"><div>${backHref ? backLink(backHref, backLabel) : ''}<p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div>${actions ? `<div class="view-actions">${actions}</div>` : ''}</div>`;
}

function applyPreferences() {
  const dark = preferences.theme === 'dark' || (preferences.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.motion = preferences.reducedMotion ? 'reduced' : 'full';
}
function syncSettingsControls() { document.querySelectorAll('[data-setting]').forEach((control) => { const key = control.dataset.setting; if (control.type === 'checkbox') control.checked = Boolean(preferences[key]); else control.value = String(preferences[key]); }); }
function openSettings() { syncSettingsControls(); settingsModal.hidden = false; closeSettings.focus(); }
function hideSettings() { settingsModal.hidden = true; settingsButton.focus(); }

function exerciseContext(language, category, cefrLevel, exerciseType, exercise) {
  return { language, category, cefrLevel, exerciseType, topicId: exerciseType, lessonId: exercise.id };
}
function sectionSummary(language, category, level, section) {
  const summary = progressSummary(progress, { language, category, cefrLevel: level, exerciseType: section.id });
  return { ...summary, total: section.exercises.length, completed: Math.min(summary.completed, section.exercises.length) };
}

function renderHome() {
  currentExercise = currentContext = null;
  const all = progressSummary(progress);
  const continueAction = progress.lastRoute && progress.lastRoute !== '#/' ? `<a class="button secondary" href="${escapeHtml(progress.lastRoute)}">Continue where I stopped</a>` : '';
  root.innerHTML = `${viewHeader({ eyebrow: 'One studio · three languages', title: 'Choose what you want to learn', description: 'Language → Category → CEFR level → Exercise type → Exercise.', actions: continueAction })}
  <section class="dashboard-stats"><div><strong>${preferences.enrolled.length}</strong><span>courses enrolled</span></div><div><strong>${all.completed}</strong><span>exercises completed</span></div><div><strong>${all.correct}</strong><span>correct answers</span></div><div><strong>${all.speakingAttempts}</strong><span>speaking attempts</span></div></section>
  <section class="course-grid">${Object.values(LANGUAGES).map((language) => {
    const enrolled = preferences.enrolled.includes(language.id);
    const summary = progressSummary(progress, { language: language.id });
    return `<article class="course-card accent-${language.accent}"><span class="course-flag">${language.flag}</span><span class="enrolment-status ${enrolled ? 'active' : ''}">${enrolled ? 'Enrolled' : 'Not enrolled'}</span><h2>${escapeHtml(language.name)}</h2><p>Six learning categories, seven CEFR levels and a language-specific reference guide.</p><div class="chip-row"><span class="chip">${language.locale} audio</span><span class="chip">200 exercises per level</span><span class="chip">${summary.completed} complete</span></div><div class="button-row"><a class="button" href="${route(['language', language.id])}">Open course</a><button class="button secondary" data-enrol-language="${language.id}">${enrolled ? 'Leave course' : 'Enrol'}</button></div></article>`;
  }).join('')}</section>`;
}

function renderLanguage(languageId) {
  const language = LANGUAGES[languageId];
  if (!language) return renderNotFound('Language not found.');
  const cards = CATEGORIES.map((category) => {
    const total = CEFR_LEVELS.length * EXERCISES_PER_LEVEL;
    const summary = progressSummary(progress, { language: languageId, category: category.id });
    return CategoryCard({ category, completed: Math.min(summary.completed, total), total, href: route(['language', languageId, 'category', category.id]) });
  }).join('');
  const guide = getLanguageStructure(languageId);
  const guideCard = `<a class="selection-card structure-card" href="${route(['language', languageId, 'structure'])}"><span class="selection-icon" aria-hidden="true">📖</span><span class="selection-copy"><strong>${escapeHtml(guide.title)}</strong><small>Explanations, examples, audio, bookmarks and reading progress.</small></span></a>`;
  root.innerHTML = `${viewHeader({ eyebrow: `${language.flag} ${language.name}`, title: `${language.name} course`, description: 'Choose exercises or open the reference guide to understand how the language is structured.', backHref: '#/', backLabel: 'All courses', actions: '<a class="button secondary" href="./legacy.html">Legacy lessons</a>' })}<div class="selection-grid">${cards}<a class="selection-card structure-card" href="${route(['language', languageId, 'structure'])}"><span class="selection-icon">📖</span><span class="selection-copy"><strong>${escapeHtml(guide.title)}</strong><small>Explanations, examples, audio, bookmarks and reading progress — no scores.</small></span></a></div>`;
}

function renderCategory(languageId, categoryId) {
  const language = LANGUAGES[languageId]; const category = getCategory(categoryId);
  if (!language || !category) return renderNotFound('Category not found.');
  const summaries = Object.fromEntries(CEFR_LEVELS.map((level) => {
    const validation = validateLevelCatalog(languageId, categoryId, level.id);
    const summary = progressSummary(progress, { language: languageId, category: categoryId, cefrLevel: level.id });
    return [level.id, { ...summary, completed: Math.min(summary.completed, validation.total), total: validation.valid ? EXERCISES_PER_LEVEL : validation.total }];
  }));
  root.innerHTML = `${viewHeader({ eyebrow: `${language.name} · ${category.label}`, title: 'Choose your CEFR level', description: 'Each validated level contains 200 exercises divided into six separate exercise types.', backHref: route(['language', languageId]), backLabel: `${language.name} categories` })}${CefrLevelSelector({ levels: CEFR_LEVELS, summaries, routeFor: (level) => route(['language', languageId, 'category', categoryId, 'level', level]) })}`;
}

function renderLanguageGuideFirst(languageId) {
  const language = LANGUAGES[languageId];
  if (!language) return renderNotFound('Language not found.');
  const guide = getLanguageStructure(languageId);
  const guideCard = `<a class="selection-card structure-card" href="${route(['language', languageId, 'structure'])}"><span class="selection-icon" aria-hidden="true">📖</span><span class="selection-copy"><strong>${escapeHtml(guide.title)}</strong><small>Explanations, examples, audio, bookmarks and reading progress.</small></span></a>`;
  const categoryCards = CATEGORIES.map((category) => {
    const total = CEFR_LEVELS.length * EXERCISES_PER_LEVEL;
    const summary = progressSummary(progress, { language: languageId, category: category.id });
    return CategoryCard({ category, completed: Math.min(summary.completed, total), total, href: route(['language', languageId, 'category', category.id]) });
  }).join('');
  root.innerHTML = `${viewHeader({ eyebrow: `${language.flag} ${language.name}`, title: `${language.name} course`, description: 'Start with how the language works, then choose an exercise category.', backHref: '#/', backLabel: 'All courses', actions: '<a class="button secondary" href="./legacy.html">Legacy lessons</a>' })}<div class="selection-grid">${guideCard}${categoryCards}</div>`;
}

function renderSections(languageId, categoryId, level) {
  const language = LANGUAGES[languageId]; const category = getCategory(categoryId); const levelMeta = CEFR_LEVELS.find((item) => item.id === level);
  if (!language || !category || !levelMeta) return renderNotFound('Course level not found.');
  const sections = getExerciseSections(languageId, categoryId, level); const validation = validateLevelCatalog(languageId, categoryId, level, sections);
  const cards = sections.map((section) => {
    const summary = sectionSummary(languageId, categoryId, level, section); const percent = progressPercent(summary.completed, summary.total);
    const savedId = getSectionPosition(progress, { language: languageId, category: categoryId, cefrLevel: level, exerciseType: section.id });
    const href = route(['language', languageId, 'category', categoryId, 'level', level, 'type', section.id, 'exercise', savedId || section.exercises[0]?.id]);
    return `<article class="exercise-type-card"><div class="exercise-type-heading"><span class="selection-icon">${summary.completed === summary.total ? '✓' : '→'}</span><div><h2>${escapeHtml(section.label)}</h2><p>${escapeHtml(section.description)}</p></div></div><div class="type-progress"><strong>${summary.completed}/${summary.total}</strong><span>${percent}% complete</span><span class="mini-progress"><i style="width:${percent}%"></i></span></div><a class="button" href="${href}">${savedId ? 'Continue' : 'Start section'}</a></article>`;
  }).join('');
  const warning = validation.valid ? '' : `<div class="notice warning">Content in development: ${validation.total} of ${EXERCISES_PER_LEVEL} exercises available. ${escapeHtml(validation.errors[0] || '')}</div>`;
  root.innerHTML = `${viewHeader({ eyebrow: `${language.name} · ${category.label} · ${level}`, title: 'Choose an exercise type', description: `${levelMeta.guidance} Exercise types stay separate, and only one exercise is loaded at a time.`, backHref: route(['language', languageId, 'category', categoryId]), backLabel: 'All levels' })}${warning}<div class="exercise-type-grid">${cards}</div>`;
}

function renderExercise(languageId, categoryId, level, sectionId, exerciseId) {
  const language = LANGUAGES[languageId]; const category = getCategory(categoryId); const section = getExerciseSection(languageId, categoryId, level, sectionId);
  if (!language || !category || !section) return renderNotFound('Exercise section not found.');
  const index = Math.max(0, section.exercises.findIndex((item) => item.id === exerciseId)); const exercise = section.exercises[index];
  if (!exercise) return renderNotFound('Exercise not found.');
  currentExercise = exercise; currentContext = exerciseContext(languageId, categoryId, level, sectionId, exercise);
  saveSectionPosition(progress, currentContext, exercise.id);
  const summary = sectionSummary(languageId, categoryId, level, section);
  const previous = section.exercises[index - 1]; const next = section.exercises[index + 1];
  const nav = `<nav class="exercise-navigation"><a class="button secondary ${previous ? '' : 'disabled'}" ${previous ? `href="${route(['language', languageId, 'category', categoryId, 'level', level, 'type', sectionId, 'exercise', previous.id])}"` : 'aria-disabled="true"'}>Previous</a><span>${index + 1} of ${section.exercises.length} · ${summary.completed} complete</span><a class="button ${next ? '' : 'disabled'}" ${next ? `href="${route(['language', languageId, 'category', categoryId, 'level', level, 'type', sectionId, 'exercise', next.id])}"` : 'aria-disabled="true"'}>Next</a></nav>`;
  root.innerHTML = `${viewHeader({ eyebrow: `${language.name} · ${category.label} · ${level}`, title: section.label, description: section.description, backHref: route(['language', languageId, 'category', categoryId, 'level', level]), backLabel: 'Return to exercise types', actions: `<a class="button secondary" href="${route(['language', languageId, 'category', categoryId])}">CEFR levels</a>` })}${nav}${ExpandedExerciseRenderer(exercise, { speechSupported: isSpeechRecognitionSupported(window), index, total: section.exercises.length, completed: Boolean(getLessonProgress(progress, currentContext)?.completed) })}${nav}`;
}

function renderStructure(languageId, query = '') {
  const language = LANGUAGES[languageId]; const guide = getLanguageStructure(languageId);
  if (!language || !guide) return renderNotFound('Language guide not found.');
  const needle = query.trim().toLocaleLowerCase(); const lessons = guide.lessons.filter((lesson) => !needle || `${lesson.title} ${lesson.definition}`.toLocaleLowerCase().includes(needle));
  const readCount = guide.lessons.filter((lesson) => progress.reading?.[`${languageId}|${lesson.id}`]?.read).length;
  const recent = (progress.recentStructure?.[languageId] || []).map((id) => guide.lessons.find((lesson) => lesson.id === id)).filter(Boolean);
  root.innerHTML = `${viewHeader({ eyebrow: `${language.flag} Reference guide`, title: guide.title, description: guide.overview, backHref: route(['language', languageId]), backLabel: `${language.name} course` })}<section class="reference-tools"><label>Search topics<input type="search" data-structure-search="${languageId}" value="${escapeHtml(query)}" placeholder="Search grammar terminology or a language pattern"></label><div><strong>${readCount}/${guide.lessons.length}</strong><span> topics read</span></div></section>${recent.length ? `<section class="recent-topics"><strong>Recently viewed</strong><div class="button-row">${recent.map((lesson) => `<a class="button secondary" href="${route(['language', languageId, 'structure', 'topic', lesson.id])}">${escapeHtml(lesson.title)}</a>`).join('')}</div></section>` : ''}<div class="basics-list">${lessons.map((lesson) => { const read = progress.reading?.[`${languageId}|${lesson.id}`]?.read; const bookmark = progress.bookmarks?.[`${languageId}|${lesson.id}`]; return `<a class="basics-list-item ${read ? 'is-complete' : ''}" href="${route(['language', languageId, 'structure', 'topic', lesson.id])}"><span>${bookmark ? '★' : lesson.order}</span><strong>${escapeHtml(lesson.title)}</strong><small>${read ? 'Read ✓' : 'Definition · examples · breakdown · useful trick'}</small></a>`; }).join('') || '<div class="notice">No topics match this search.</div>'}</div>`;
}

function breakdownClass(role) { for (const name of ['subject','verb','object','article','adjective','adverb','preposition','conjunction']) if (role.includes(name)) return name; return 'context'; }
function renderStructureLesson(languageId, id) {
  const language = LANGUAGES[languageId]; const guide = getLanguageStructure(languageId); const lesson = findStructureLesson(languageId, id);
  if (!language || !guide || !lesson) return renderNotFound('Reference topic not found.');
  saveStructureReading(progress, languageId, id);
  const index = guide.lessons.indexOf(lesson); const previous = guide.lessons[index - 1]; const next = guide.lessons[index + 1]; const bookmarked = Boolean(progress.bookmarks?.[`${languageId}|${id}`]);
  const related = lesson.related.map((relatedId) => guide.lessons.find((item) => item.id === relatedId)).filter(Boolean);
  root.innerHTML = `${viewHeader({ eyebrow: `${guide.title} · Topic ${lesson.order}`, title: lesson.title, description: lesson.definition, backHref: route(['language', languageId, 'structure']), backLabel: 'Table of contents', actions: `<button class="button secondary" data-bookmark-structure="${id}" data-language="${languageId}">${bookmarked ? '★ Bookmarked' : '☆ Bookmark'}</button>` })}<article class="lesson-card structure-lesson">
  <section><h2>Simple definition</h2><p>${escapeHtml(lesson.definition)}</p></section><section><h2>Why it matters</h2><p>${escapeHtml(lesson.whyItMatters)}</p></section><section><h2>How to recognise it</h2><p>${escapeHtml(lesson.recognition)}</p></section><section><h2>How it works in English</h2><p>${escapeHtml(lesson.englishComparison)}</p></section><section><h2>How it works here</h2><p>${escapeHtml(lesson.languageExplanation)}</p></section>
  <section><h2>Examples</h2>${lesson.examples.map((example) => `<details class="expandable-example"><summary><span lang="${language.locale}">${escapeHtml(example.target)}</span><button class="icon-button inline-audio" data-structure-audio="${escapeHtml(example.target)}" data-locale="${language.locale}" aria-label="Listen">🔊</button></summary><p>${escapeHtml(example.translation)}</p></details>`).join('')}</section>
  <section><h2>Visual sentence breakdown</h2><p class="example-sentence" lang="${language.locale}">${escapeHtml(guide.sentence)}</p><div class="sentence-breakdown">${lesson.breakdown.map((part) => `<div class="role-${breakdownClass(part.role)}"><strong>${escapeHtml(part.text)}</strong><span>${escapeHtml(part.role)}</span></div>`).join('')}</div></section>
  <section class="reference-callout mistake"><h2>Common mistake</h2><p>${escapeHtml(lesson.commonMistake)}</p></section><section class="reference-callout trick"><h2>Useful trick</h2><p>${escapeHtml(lesson.usefulTrick)}</p></section><section class="reference-callout remember"><h2>Remember</h2><p>${escapeHtml(lesson.remember)}</p></section><section><h2>Connection</h2><p>${escapeHtml(lesson.connection)}</p></section><section><h2>Short summary</h2><p>${escapeHtml(lesson.summary)}</p></section><section><h2>Related lessons</h2><div class="button-row">${related.map((item) => `<a class="button secondary" href="${route(['language', languageId, 'structure', 'topic', item.id])}">${escapeHtml(item.title)}</a>`).join('')}</div></section></article><nav class="exercise-navigation"><a class="button secondary ${previous ? '' : 'disabled'}" ${previous ? `href="${route(['language', languageId, 'structure', 'topic', previous.id])}"` : 'aria-disabled="true"'}>Previous topic</a><a class="button ${next ? '' : 'disabled'}" ${next ? `href="${route(['language', languageId, 'structure', 'topic', next.id])}"` : 'aria-disabled="true"'}>Next topic</a></nav>`;
}

function renderNotFound(message) { currentExercise = currentContext = null; root.innerHTML = `${viewHeader({ eyebrow: 'Development warning', title: 'Page unavailable', description: message, backHref: '#/', backLabel: 'Dashboard' })}<div class="notice warning">${escapeHtml(message)}</div>`; }
function renderRoute() {
  const p = decodeRoute();
  if (!p.length) renderHome();
  else if (p[0] === 'language' && p[1] && p.length === 2) renderLanguageGuideFirst(p[1]);
  else if (p[0] === 'language' && p[2] === 'structure' && p.length === 3) renderStructure(p[1]);
  else if (p[0] === 'language' && p[2] === 'structure' && p[3] === 'topic' && p[4]) renderStructureLesson(p[1], p[4]);
  else if (p[0] === 'language' && p[2] === 'category' && p[3] && p.length === 4) renderCategory(p[1], p[3]);
  else if (p[0] === 'language' && p[2] === 'category' && p[4] === 'level' && p[5] && p.length === 6) renderSections(p[1], p[3], p[5]);
  else if (p[0] === 'language' && p[2] === 'category' && p[4] === 'level' && p[6] === 'type' && p[8] === 'exercise' && p[9]) renderExercise(p[1], p[3], p[5], p[7], p[9]);
  else renderNotFound('The requested route is not valid.');
  saveLastRoute(progress, location.hash || '#/'); document.title = `${root.querySelector('h1')?.textContent || 'Language Learning Studio'} · Language Studio`; root.focus({ preventScroll: true }); scrollTo({ top: 0, behavior: preferences.reducedMotion ? 'auto' : 'smooth' });
}

function normaliseAnswer(value) { return String(value || '').toLocaleLowerCase().normalize('NFC').replace(/[.,!?;:"“”„'’]/g, '').replace(/\s+/g, ' ').trim(); }
function acceptedAnswer(exercise, answer) { const normalized = normaliseAnswer(answer); return exercise.acceptedAnswers.some((candidate) => normaliseAnswer(candidate) === normalized); }
const feedbackTarget = (id) => root.querySelector(`[data-feedback-for="${id}"]`);
function storeExerciseResult(result) { const record = recordExerciseAttempt(progress, currentContext, { ...result, type: currentExercise.type }); if (record.completed) root.querySelector('[data-exercise-card]')?.classList.add('is-complete'); return record; }
function showAnswerResult(answer) { const correct = acceptedAnswer(currentExercise, answer); storeExerciseResult({ correct, completed: correct, answer }); feedbackTarget(currentExercise.id).innerHTML = AnswerFeedback({ correct, explanation: currentExercise.explanation, acceptedAnswers: currentExercise.acceptedAnswers }); }
function listen(text = currentExercise?.audioText, locale = currentExercise?.locale) { if (!preferences.soundEnabled) return; speakText(text, locale, currentExercise?.difficultyMetadata?.speechRate || 0.9, window); }
function setMicrophoneState(control, state) {
  if (!control) return;
  const labels = { idle: 'Start speaking', requesting: 'Requesting microphone…', listening: 'Listening…', processing: 'Checking speech…' };
  const messages = { idle: 'Microphone is idle', requesting: 'Requesting microphone permission', listening: 'Microphone is listening', processing: 'Checking recognised speech' };
  const trigger = control.querySelector('[data-speak-exercise]'); const stop = control.querySelector('[data-stop-speaking]'); const indicator = control.querySelector('[data-listening-indicator]');
  control.dataset.state = state; control.querySelector('[data-microphone-label]').textContent = labels[state]; control.querySelector('[data-microphone-status]').textContent = messages[state];
  trigger.disabled = state !== 'idle'; stop.hidden = state !== 'listening'; indicator.hidden = state !== 'listening';
}
async function startSpeaking(trigger) {
  if (activeRecognition) return;
  const target = feedbackTarget(currentExercise.id); const control = trigger.closest('[data-microphone-control]'); setMicrophoneState(control, 'requesting');
  const session = startRecognition(currentExercise.locale, window); activeRecognition = session; setMicrophoneState(control, 'listening');
  try { const recognised = await session.promise; setMicrophoneState(control, 'processing'); const result = compareSpeech(recognised, currentExercise.correctAnswer, currentExercise.acceptedAnswers, { flexible: currentExercise.responseMode === 'flexible', requiredConcepts: currentExercise.requiredConcepts }); storeExerciseResult({ correct: result.accepted, completed: result.accepted, answer: recognised }); target.innerHTML = SpeechFeedback(result, currentExercise.id); }
  catch (error) { target.innerHTML = `<div class="notice warning" role="status">${escapeHtml(error.message)}</div>`; }
  finally { activeRecognition = null; setMicrophoneState(control, 'idle'); }
}

root.addEventListener('click', (event) => {
  const enrol = event.target.closest('[data-enrol-language]'); if (enrol) { const id = enrol.dataset.enrolLanguage; preferences = setCourseEnrolled(preferences, id, !preferences.enrolled.includes(id)); saveStudioPreferences(preferences); renderHome(); return; }
  const listenButton = event.target.closest('[data-listen-exercise]'); if (listenButton && currentExercise) { listen(); return; }
  const answer = event.target.closest('[data-answer-exercise]'); if (answer && currentExercise) { const options = answer.closest('.answer-options'); options.querySelectorAll('[data-answer-exercise]').forEach((button) => { button.disabled = true; button.classList.toggle('is-correct', acceptedAnswer(currentExercise, button.dataset.answer)); button.classList.remove('is-selected','is-incorrect'); }); answer.classList.add('is-selected'); if (!acceptedAnswer(currentExercise, answer.dataset.answer)) answer.classList.add('is-incorrect'); showAnswerResult(answer.dataset.answer); return; }
  const token = event.target.closest('[data-order-token]'); if (token && currentExercise) { const workspace = token.closest('[data-ordering-workspace]'); const destination = token.closest('[data-order-zone="available"]') ? workspace.querySelector('[data-order-zone="arranged"]') : workspace.querySelector('[data-order-zone="available"]'); destination.append(token); return; }
  const resetOrder = event.target.closest('[data-reset-order]'); if (resetOrder && currentExercise) { const workspace = resetOrder.closest('[data-ordering-workspace]'); const available = workspace.querySelector('[data-order-zone="available"]'); [...workspace.querySelectorAll('[data-order-token]')].sort((a, b) => Number(a.dataset.orderPosition) - Number(b.dataset.orderPosition)).forEach((item) => available.append(item)); feedbackTarget(currentExercise.id).innerHTML = ''; return; }
  const submitOrder = event.target.closest('[data-submit-order]'); if (submitOrder && currentExercise) { const tokens = [...submitOrder.closest('[data-ordering-workspace]').querySelectorAll('[data-order-zone="arranged"] [data-order-token]')].map((item) => item.dataset.orderToken); showAnswerResult(sentenceFromTokens(tokens)); return; }
  const check = event.target.closest('[data-check-exercise]'); if (check && currentExercise) { const input = root.querySelector(`[data-input-exercise="${currentExercise.id}"]`); showAnswerResult(input?.value); return; }
  const reveal = event.target.closest('[data-reveal-exercise]'); if (reveal && currentExercise) { const input = root.querySelector(`[data-input-exercise="${currentExercise.id}"]`); storeExerciseResult({ correct: null, completed: Boolean(input?.value.trim()), answer: input?.value || '' }); feedbackTarget(currentExercise.id).innerHTML = `<div class="answer-feedback correct"><strong>Model answer</strong><p>${escapeHtml(currentExercise.correctAnswer)}</p><p>${escapeHtml(currentExercise.explanation)}</p></div>`; return; }
  const speak = event.target.closest('[data-speak-exercise]'); if (speak && currentExercise) { startSpeaking(speak); return; }
  const stopSpeaking = event.target.closest('[data-stop-speaking]'); if (stopSpeaking && activeRecognition) { activeRecognition.stop(); return; }
  const audio = event.target.closest('[data-structure-audio]'); if (audio) { listen(audio.dataset.structureAudio, audio.dataset.locale); return; }
  const bookmark = event.target.closest('[data-bookmark-structure]'); if (bookmark) { const active = toggleStructureBookmark(progress, bookmark.dataset.language, bookmark.dataset.bookmarkStructure); bookmark.textContent = active ? '★ Bookmarked' : '☆ Bookmark'; }
});
root.addEventListener('dragstart', (event) => { const token = event.target.closest('[data-order-token]'); if (token) { token.classList.add('is-dragging'); event.dataTransfer?.setData('text/plain', token.dataset.orderToken); } });
root.addEventListener('dragend', (event) => event.target.closest('[data-order-token]')?.classList.remove('is-dragging'));
root.addEventListener('dragover', (event) => { if (event.target.closest('[data-order-zone]')) event.preventDefault(); });
root.addEventListener('drop', (event) => { const zone = event.target.closest('[data-order-zone]'); const token = root.querySelector('[data-order-token].is-dragging'); if (zone && token) { event.preventDefault(); zone.append(token); } });
root.addEventListener('input', (event) => { const search = event.target.closest('[data-structure-search]'); if (!search) return; const language = search.dataset.structureSearch; const value = search.value; clearTimeout(structureSearchTimer); structureSearchTimer = setTimeout(() => { renderStructure(language, value); const nextSearch = root.querySelector('[data-structure-search]'); nextSearch?.focus(); nextSearch?.setSelectionRange(value.length, value.length); }, 120); });
settingsButton.addEventListener('click', openSettings); closeSettings.addEventListener('click', hideSettings); settingsModal.addEventListener('click', (event) => { if (event.target === settingsModal) hideSettings(); }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !settingsModal.hidden) hideSettings(); });
document.addEventListener('change', (event) => { const control = event.target.closest('[data-setting]'); if (!control) return; const key = control.dataset.setting; preferences[key] = control.type === 'checkbox' ? control.checked : key === 'dailyGoal' ? Number(control.value) : control.value; saveStudioPreferences(preferences); applyPreferences(); });
window.addEventListener('hashchange', renderRoute); matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (preferences.theme === 'system') applyPreferences(); });
applyPreferences(); syncSettingsControls(); if (!location.hash) location.hash = '#/'; else renderRoute();

export { COURSE_CONTENT };
