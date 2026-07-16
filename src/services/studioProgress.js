import { migrateLegacyProgress, progressKey, PROGRESS_KEY } from './migration.js';
import { writeJson } from './studioStorage.js';

function matches(record, filter) {
  return Object.entries(filter).every(([key, value]) => value === undefined || record[key] === value);
}

export function loadStudioProgress(storage = globalThis.localStorage) {
  return migrateLegacyProgress(storage);
}

export function recordExerciseAttempt(progress, context, result, storage = globalThis.localStorage) {
  const key = progressKey(context);
  const previous = progress.records[key] || {
    ...context, attempts: 0, correct: 0, incorrect: 0, speakingAttempts: 0, writingAttempts: 0, completed: false
  };
  const next = {
    ...previous,
    attempts: previous.attempts + 1,
    correct: previous.correct + Number(Boolean(result.correct)),
    incorrect: previous.incorrect + Number(result.correct === false),
    speakingAttempts: previous.speakingAttempts + Number(result.type === 'speaking'),
    writingAttempts: previous.writingAttempts + Number(['writing', 'openResponse'].includes(result.type)),
    completed: previous.completed || Boolean(result.completed || result.correct),
    lastAnswer: result.answer ?? null,
    updatedAt: new Date().toISOString()
  };
  progress.records[key] = next;
  writeJson(PROGRESS_KEY, progress, storage);
  return next;
}

export function saveLastRoute(progress, route, storage = globalThis.localStorage) {
  progress.lastRoute = route;
  writeJson(PROGRESS_KEY, progress, storage);
}

export function saveSectionPosition(progress, context, exerciseId, storage = globalThis.localStorage) {
  const key = [context.language, context.category, context.cefrLevel, context.exerciseType].join('|');
  progress.positions ||= {};
  progress.positions[key] = exerciseId;
  writeJson(PROGRESS_KEY, progress, storage);
}

export function getSectionPosition(progress, context) {
  const key = [context.language, context.category, context.cefrLevel, context.exerciseType].join('|');
  return progress.positions?.[key] || null;
}

export function saveStructureReading(progress, language, lessonId, storage = globalThis.localStorage) {
  progress.reading ||= {};
  progress.recentStructure ||= {};
  progress.reading[`${language}|${lessonId}`] = { read: true, updatedAt: new Date().toISOString() };
  progress.recentStructure[language] = [lessonId, ...(progress.recentStructure[language] || []).filter((id) => id !== lessonId)].slice(0, 5);
  writeJson(PROGRESS_KEY, progress, storage);
}

export function toggleStructureBookmark(progress, language, lessonId, storage = globalThis.localStorage) {
  progress.bookmarks ||= {};
  const key = `${language}|${lessonId}`;
  progress.bookmarks[key] = !progress.bookmarks[key];
  writeJson(PROGRESS_KEY, progress, storage);
  return progress.bookmarks[key];
}

export function progressSummary(progress, filter = {}) {
  const records = Object.values(progress.records).filter((record) => matches(record, filter));
  return {
    records: records.length,
    completed: records.filter((record) => record.completed).length,
    attempts: records.reduce((sum, record) => sum + record.attempts, 0),
    correct: records.reduce((sum, record) => sum + record.correct, 0),
    incorrect: records.reduce((sum, record) => sum + record.incorrect, 0),
    speakingAttempts: records.reduce((sum, record) => sum + record.speakingAttempts, 0),
    writingAttempts: records.reduce((sum, record) => sum + record.writingAttempts, 0)
  };
}

export function getLessonProgress(progress, context) {
  return progress.records[progressKey(context)] || null;
}
