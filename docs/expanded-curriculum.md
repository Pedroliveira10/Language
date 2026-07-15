# Expanded Curriculum Update

## Curriculum size

- 3 languages
- 6 categories per language
- 7 CEFR levels per category
- 5 topics per category/level path
- 5 independently tracked activities per topic
- 630 topics and 3,150 course activities in total

Each topic moves from recognition toward recall and production. Depending on category and CEFR level, activities use multiple choice, manual input, open writing, audio, or microphone-based speaking. Higher levels include more open responses and less translation support.

## Progress behavior

Each activity now has its own `lessonId`, so completing activity 1 does not complete the whole topic. Topic cards display `completed/5` and a percentage. Existing progress remains compatible because the first activity keeps the previous topic lesson ID.

## Files created for this update

- `src/data/expandedCourseContent.js`
- `src/components/RichTopicCard.js`
- `src/components/ExpandedExerciseRenderer.js`
- `scripts/apply-expanded-curriculum.mjs`
- `tests/content/expanded-curriculum.test.js`
- `tests/exercises/expanded-renderers.test.js`
- `tests/progress/activity-progress.test.js`
- `docs/expanded-curriculum.md`
- Generated public copies of the new source modules under `public/assets/`

## Files modified for this update

- `src/studio-app.js`
- `scripts/validate-studio-content.mjs`
- `tests/content/cefr-content.test.js`
- `.github/workflows/pages.yml`
- `docs/implementation-report.md`
- Generated `public/index.html`, compatibility entry point, and `public/assets/`

## Verification

- 630 topics and 3,150 activities validated.
- 36 automated tests passed across 13 test files.
- 101 JavaScript and MJS files passed syntax checks.
- All 126 language/category/level pages displayed five topics.
- The first topic in all 126 paths displayed five activities: 252 successful browser route checks.
- Multiple choice completion updated one activity to `1/5` and persisted after refresh.
- C2 writing displayed manual, multiple-choice, and open-response activities.
- Speaking topics displayed five microphone activities with the correct language locale in the data.
- A 390 x 844 layout displayed all five activity cards without horizontal overflow.
- No browser console errors were reported.

## Previous GitHub Actions failure

The failed `Run npm test` was caused by an incomplete browser upload. The repository contained tests that imported these files, but the files were absent from GitHub:

- `src/services/migration.js`
- `src/services/speechRecognition.js`

The code passed locally when the complete folder structure was present. Upload source dependencies before tests. The workflow now also runs `npm run build` before publishing the `public` directory.

## Safe web-upload order

Upload and commit one batch at a time from the repository root:

1. `src/services/`
2. `src/config/` and `src/data/`
3. `src/components/`, `src/styles/`, `src/app/`, and `src/exercise-types/`
4. The files directly inside `src/`, including `studio-app.js` and `index.html`
5. `scripts/` and `package.json`
6. `.github/workflows/pages.yml`
7. The complete `public/` folder
8. `tests/` subfolders, with tests uploaded last
9. `docs/`

Do not flatten folders. For example, `migration.js` must end at `src/services/migration.js`, not at the repository root.
