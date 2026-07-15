import { backupStorageKey, readJson, writeJson } from './studioStorage.js';

export const PROGRESS_KEY = 'language-studio-progress-v2';
export const MIGRATION_KEY = 'language-studio-migration-v2';
export const LEGACY_KEYS = Object.freeze(['englishPathState', 'language-studio-pl', 'language-studio-pt-PT']);

export function legacyLevelToCefr(value) {
  return ({ 1: 'A0', 2: 'A1', 3: 'A2', 4: 'B1' })[Number(value)] || 'A0';
}

export function createEmptyProgress() {
  return { version: 2, records: {}, lastRoute: '#/', migratedAt: null };
}

export function progressKey({ language, category, cefrLevel, topicId, lessonId }) {
  return [language, category, cefrLevel, topicId, lessonId].join('|');
}

function migratedRecord(context, legacyKey) {
  return {
    ...context,
    attempts: 1,
    correct: 1,
    incorrect: 0,
    speakingAttempts: 0,
    writingAttempts: 0,
    completed: true,
    migrated: true,
    legacyKey,
    updatedAt: new Date().toISOString()
  };
}

function addRecord(progress, context, legacyKey) {
  const key = progressKey(context);
  if (!progress.records[key]) progress.records[key] = migratedRecord(context, legacyKey);
}

function migrateDutch(progress, storage) {
  const state = readJson('englishPathState', {}, storage);
  const grammarTopics = ['be', 'have'];
  for (const [topic, completed] of Object.entries(state || {})) {
    if (!completed) continue;
    const category = grammarTopics.includes(topic) ? 'grammar' : topic;
    const safeCategory = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'conversation'].includes(category) ? category : 'grammar';
    addRecord(progress, {
      language: 'nl', category: safeCategory, cefrLevel: 'A0', topicId: `legacy-${topic}`, lessonId: `legacy-${topic}-lesson`
    }, `englishPathState:${topic}`);
  }
}

function migrateCompletedModules(progress, storage, storageKey, language) {
  const state = readJson(storageKey, { completed: [] }, storage);
  if (!Array.isArray(state?.completed)) return;
  for (const item of state.completed) {
    const [rawCategory = 'grammar', rawTopic = 'legacy-topic', rawLevel = '1'] = String(item).split(':');
    const category = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'conversation'].includes(rawCategory) ? rawCategory : 'grammar';
    addRecord(progress, {
      language,
      category,
      cefrLevel: legacyLevelToCefr(rawLevel),
      topicId: `legacy-${rawTopic}`,
      lessonId: `legacy-${rawTopic}-level-${rawLevel}`
    }, `${storageKey}:${item}`);
  }
}

export function migrateLegacyProgress(storage = globalThis.localStorage, now = new Date()) {
  const progress = readJson(PROGRESS_KEY, createEmptyProgress(), storage);
  if (readJson(MIGRATION_KEY, null, storage)?.complete) return progress;

  LEGACY_KEYS.forEach((key) => backupStorageKey(key, storage));
  migrateDutch(progress, storage);
  migrateCompletedModules(progress, storage, 'language-studio-pl', 'pl');
  migrateCompletedModules(progress, storage, 'language-studio-pt-PT', 'pt');

  progress.version = 2;
  progress.migratedAt = now.toISOString();
  writeJson(PROGRESS_KEY, progress, storage);
  writeJson(MIGRATION_KEY, {
    complete: true,
    migratedAt: progress.migratedAt,
    backups: LEGACY_KEYS.map((key) => `language-studio-backup-${key}`)
  }, storage);
  return progress;
}

