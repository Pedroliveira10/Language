import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const languages = ['dutch', 'polish', 'portuguese-pt'];

for (const language of languages) {
  test(`${language} curriculum has unique exercise ids`, async () => {
    const url = new URL(`../../src/languages/${language}/curriculum.json`, import.meta.url);
    const curriculum = JSON.parse(await readFile(url, 'utf8'));
    const ids = curriculum.units.flatMap((unit) => unit.exercises.map((exercise) => exercise.id));
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.length > 0);
  });
}

