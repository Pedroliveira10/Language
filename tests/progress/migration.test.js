import test from 'node:test';
import assert from 'node:assert/strict';
import { MIGRATION_KEY, PROGRESS_KEY, legacyLevelToCefr, migrateLegacyProgress } from '../../src/services/migration.js';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    dump: () => Object.fromEntries(values)
  };
}

test('legacy level mapping keeps manual level as B1', () => {
  assert.deepEqual([1,2,3,4].map(legacyLevelToCefr), ['A0','A1','A2','B1']);
});

test('migration backs up old data and creates scoped v2 records', () => {
  const storage = memoryStorage({
    englishPathState: JSON.stringify({ be: true, have: false, vocabulary: true }),
    'language-studio-pl': JSON.stringify({ completed: ['vocabulary:food:1', 'writing:work:4'], dark: true }),
    'language-studio-pt-PT': JSON.stringify({ completed: ['conversation:travel:2'], dark: false })
  });
  const progress = migrateLegacyProgress(storage, new Date('2026-07-15T12:00:00.000Z'));
  const records = Object.values(progress.records);
  assert.equal(records.length, 5);
  assert.ok(records.some((record) => record.language === 'pl' && record.category === 'writing' && record.cefrLevel === 'B1'));
  assert.ok(records.every((record) => record.completed && record.migrated));
  const dump = storage.dump();
  assert.ok(dump['language-studio-backup-englishPathState']);
  assert.ok(dump['language-studio-backup-language-studio-pl']);
  assert.ok(dump['language-studio-backup-language-studio-pt-PT']);
  assert.ok(dump[PROGRESS_KEY]);
  assert.ok(dump[MIGRATION_KEY]);
});

test('migration is idempotent', () => {
  const storage = memoryStorage({ 'language-studio-pl': JSON.stringify({ completed: ['grammar:verb:1'] }) });
  const first = migrateLegacyProgress(storage);
  const second = migrateLegacyProgress(storage);
  assert.deepEqual(second, first);
});

