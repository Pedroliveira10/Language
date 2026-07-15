# CEFR and Speaking Upgrade Report

## Result

The application now follows `Language -> Category -> CEFR level -> Topic -> Exercise` for Dutch, Polish, and European Portuguese. Grammar, Vocabulary, Pronunciation, Writing, and Conversation remain intact as top-level course categories, and Speaking has been added beside them. Language Basics is a separate English foundation course on the dashboard.

The static build remains compatible with GitHub Pages and requires no backend.

## Main changes

- Added A0, A1, A2, B1, B2, C1, and C2 inside every language category.
- Added 252 validated topics and 252 exercises: two topics for every combination of 3 languages, 6 categories, and 7 CEFR levels.
- Changed guidance, translations, speech rate, expected answer length, answer type, and hints as levels increase.
- Kept manual answers and integrated them into the progression; higher levels use more open production.
- Added browser speech recognition with `nl-NL`, `pl-PL`, and `pt-PT`, accepted alternatives, normalized comparison, word-level feedback, and a recognition score.
- Added 33 Language Basics lessons with English explanations, examples, sentence breakdowns, common mistakes, quizzes, manual practice, and three-language connections.
- Added scoped progress, safe legacy migration and backup, course enrolment, saved preferences, and last-route continuation.
- Moved Settings to a sticky top-right header control.
- Centralized light/dark theme colors and improved dark-mode text, chip, input, placeholder, border, and feedback contrast.
- Preserved the previous standalone application as `public/legacy.html`, linked it from each language overview, and generated the former long filename as a compatibility entry point for the existing public URL.
- Added a source-to-public build step and content validation.

## Navigation and hierarchy

Example route:

`#/language/nl/category/grammar/level/A1/topic/present-tense-and-questions`

The router filters content in this order:

1. Language: `nl`, `pl`, or `pt`.
2. Category: grammar, vocabulary, pronunciation, writing, conversation, or speaking.
3. CEFR level: A0 through C2.
4. Topic.
5. Shared lesson and exercise renderer.

CEFR levels never replace the main category cards.

## Progress migration

New progress is stored under `language-studio-progress-v2`. Each record is keyed by language, category, CEFR level, topic, and lesson. Records retain attempts, correct and incorrect answers, speaking attempts, writing attempts, completion, last answer, and update time.

The one-time migration reads these legacy keys:

- `englishPathState`
- `language-studio-pl`
- `language-studio-pt-PT`

Before mapping anything, it preserves copies under:

- `language-studio-backup-englishPathState`
- `language-studio-backup-language-studio-pl`
- `language-studio-backup-language-studio-pt-PT`

Old levels map as 1 -> A0, 2 -> A1, 3 -> A2, and 4/manual -> B1. Original keys are not deleted. `language-studio-migration-v2` makes the migration idempotent. Unknown or partially incompatible old data remains available in the backup keys.

## Speaking recognition

Speech recognition is created and started only from the microphone button click handler. The selected course locale is assigned to the Web Speech API. Recognized text is normalized for case, punctuation, repeated spaces, and harmless filler words, then compared with the expected answer and all accepted alternatives.

Feedback reports the expected sentence, recognized sentence, matching words, missing words, incorrect substitutions, additional words, and an approximate **Speech recognition score**. Permission denial, no-speech, general recognition failure, and unsupported-browser cases have user-facing messages.

This is word-recognition feedback, not a professional pronunciation assessment. Accuracy depends on the browser, operating system, microphone, connection, and speech-recognition provider.

## Testing performed

- Build completed successfully.
- Content validators passed for 3 existing curricula, 3 existing exercises, 252 CEFR topics, 252 CEFR exercises, and 33 Language Basics lessons.
- 29 automated tests passed across content, exercises, navigation, profile, progress migration, speech comparison, recognition lifecycle, unsupported-browser fallback, denied permission, and locale handling.
- Syntax checks passed for 90 JavaScript and MJS files.
- Browser route matrix: all 126 language/category/level pages opened, and the first topic on each level page opened, for 252 successful level/topic checks.
- Multiple-choice answer and persisted completion tested.
- Manual answer with an accepted variation tested.
- C2 open writing response and model comparison tested.
- All 33 Language Basics links counted; Pronouns quiz, manual exercise, completion, reload persistence, and back navigation tested.
- Settings location, open/close behavior, dark/light persistence, and legacy preference migration tested.
- Dark-mode contrast measured in browser: body 17.75:1, input text 13.72:1, placeholder 5.14:1, primary button 15.34:1, muted text 11.64:1, and high-contrast chips 8.97:1 in the tested states.
- Desktop and 390 x 844 mobile layouts tested with no horizontal overflow; the mobile Settings control did not overlap the title.
- Invalid topic handling and the preserved legacy page tested.
- A temporary `/Language/index.html` deployment simulation loaded its module and stylesheet from `/Language/assets/`; a nested Polish B2 vocabulary route opened with two topics.
- The generated `public/dutch_polish_portuguese_mobile_learning_studio.html` compatibility page was verified byte-for-byte against the new `public/index.html`.
- No JavaScript console errors were present at the end of browser testing.

## Tests not performed

- A real microphone recording and the browser's live permission prompt were not triggered. Automated fakes verified locale assignment, transcript handling, denied permission, and unsupported recognition without recording audio.
- Synthesized audio was not evaluated by listening to the device output.
- The changes were not published to the live GitHub repository from this workspace; GitHub Pages compatibility was tested locally under `/Language/`.
- No cross-device sync or login was tested because those features require an account/backend service and are not part of this static implementation.

## Known issues and limitations

- Web Speech API support and accuracy vary by browser and platform. Chrome or Edge is recommended.
- Recognition scoring checks recognized words and cannot reliably judge accent, stress, rhythm, or phoneme quality.
- Higher-level open writing shows a model and guidance but cannot provide generative AI evaluation without a backend or external service.
- The new CEFR catalog is structurally complete with two topics per category/level combination, but it is still starter curriculum depth and can be expanded with more authored lessons.
- Legacy data with an unknown format is backed up but may not be automatically classifiable.

## Files created

### Source, build, tests, and documentation

- `src/config/cefrLevels.js`
- `src/config/categories.js`
- `src/data/courseContent.js`
- `src/data/language-basics/index.js`
- `src/services/studioStorage.js`
- `src/services/migration.js`
- `src/services/studioProgress.js`
- `src/services/speechRecognition.js`
- `src/services/studioAudio.js`
- `src/services/studioPreferences.js`
- `src/components/studioMarkup.js`
- `src/components/CategoryCard.js`
- `src/components/CefrLevelSelector.js`
- `src/components/TopicCard.js`
- `src/components/MicrophoneButton.js`
- `src/components/FeedbackBox.js`
- `src/components/ExerciseRenderer.js`
- `src/index.html`
- `src/studio-app.js`
- `src/styles/studio.css`
- `scripts/build.mjs`
- `scripts/validate-studio-content.mjs`
- `tests/content/cefr-content.test.js`
- `tests/content/language-basics.test.js`
- `tests/progress/migration.test.js`
- `tests/speech/speechRecognition.test.js`
- `tests/speech/microphoneFallback.test.js`
- `tests/speech/recogniseOnce.test.js`
- `public/legacy.html`
- `public/dutch_polish_portuguese_mobile_learning_studio.html`
- `docs/implementation-report.md`

### Generated public assets

- `public/assets/app/navigation/index.js`
- `public/assets/app/profile/index.js`
- `public/assets/app/progress/index.js`
- `public/assets/app/settings/index.js`
- `public/assets/components/AudioButton.js`
- `public/assets/components/CategoryCard.js`
- `public/assets/components/CefrLevelSelector.js`
- `public/assets/components/DictionaryPopover.js`
- `public/assets/components/ExerciseCard.js`
- `public/assets/components/ExerciseRenderer.js`
- `public/assets/components/ExplanationBox.js`
- `public/assets/components/FeedbackBox.js`
- `public/assets/components/MicrophoneButton.js`
- `public/assets/components/ProgressBar.js`
- `public/assets/components/studioMarkup.js`
- `public/assets/components/TopicCard.js`
- `public/assets/config/categories.js`
- `public/assets/config/cefrLevels.js`
- `public/assets/data/courseContent.js`
- `public/assets/data/language-basics/index.js`
- `public/assets/exercise-types/Conversation.js`
- `public/assets/exercise-types/index.js`
- `public/assets/exercise-types/Listening.js`
- `public/assets/exercise-types/ManualInput.js`
- `public/assets/exercise-types/MultipleChoice.js`
- `public/assets/exercise-types/SentenceOrder.js`
- `public/assets/languages/dutch/conversations/greetings.json`
- `public/assets/languages/dutch/curriculum.json`
- `public/assets/languages/dutch/grammar/README.md`
- `public/assets/languages/dutch/pronunciation/README.md`
- `public/assets/languages/dutch/vocabulary/starter.json`
- `public/assets/languages/dutch/writing/README.md`
- `public/assets/languages/index.js`
- `public/assets/languages/polish/conversations/greetings.json`
- `public/assets/languages/polish/curriculum.json`
- `public/assets/languages/polish/grammar/README.md`
- `public/assets/languages/polish/pronunciation/README.md`
- `public/assets/languages/polish/vocabulary/starter.json`
- `public/assets/languages/polish/writing/README.md`
- `public/assets/languages/portuguese-pt/conversations/greetings.json`
- `public/assets/languages/portuguese-pt/curriculum.json`
- `public/assets/languages/portuguese-pt/grammar/README.md`
- `public/assets/languages/portuguese-pt/pronunciation/README.md`
- `public/assets/languages/portuguese-pt/vocabulary/starter.json`
- `public/assets/languages/portuguese-pt/writing/README.md`
- `public/assets/main.js`
- `public/assets/services/audio.js`
- `public/assets/services/migration.js`
- `public/assets/services/progress.js`
- `public/assets/services/speechRecognition.js`
- `public/assets/services/storage.js`
- `public/assets/services/studioAudio.js`
- `public/assets/services/studioPreferences.js`
- `public/assets/services/studioProgress.js`
- `public/assets/services/studioStorage.js`
- `public/assets/studio-app.js`
- `public/assets/styles/base.css`
- `public/assets/styles/components.css`
- `public/assets/styles/studio.css`

## Files modified

- `package.json` - added build and combined content-validation commands.
- `public/index.html` - replaced the monolithic entry point with the generated modular entry point. The original was preserved first as `public/legacy.html`.

The existing GitHub Pages workflow was inspected but did not need modification because it already publishes the `public` directory.
