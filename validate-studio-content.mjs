import { readFile } from 'node:fs/promises';

const languages = ['dutch', 'polish', 'portuguese-pt'];
let exerciseCount = 0;

for (const language of languages) {
  const url = new URL(`../src/languages/${language}/curriculum.json`, import.meta.url);
  const curriculum = JSON.parse(await readFile(url, 'utf8'));

  if (!curriculum.id || !curriculum.name || !Array.isArray(curriculum.units)) {
    throw new Error(`${language}: curriculum requires id, name, and units`);
  }

  for (const unit of curriculum.units) {
    if (!unit.id || !unit.title || !Array.isArray(unit.exercises)) {
      throw new Error(`${language}: every unit requires id, title, and exercises`);
    }
    for (const exercise of unit.exercises) {
      if (!exercise.id || !exercise.type || !exercise.prompt) {
        throw new Error(`${language}: every exercise requires id, type, and prompt`);
      }
      exerciseCount += 1;
    }
  }
}

console.log(`Validated ${languages.length} curricula and ${exerciseCount} exercises.`);

