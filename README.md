# Language Learning Studio

A mobile-first learning app for Dutch, Polish, and European Portuguese.

## Current state

The modular application contains 25,200 independently tracked exercises across
Dutch, Polish, and European Portuguese: 200 exercises for every combination of
language, category, and CEFR level. Exercise types are separate and the app
loads one exercise at a time. Each language also has a score-free “How This
Language Works” reference guide. The original single-file application remains
available at `public/legacy.html`.

## Run locally

Install Node.js 20 or newer, then run:

```bash
npm start
```

Open `http://localhost:8000`. No package installation is required.

## Validate

```bash
npm test
npm run check:content
npm run build
```

## Architecture

- `public/` contains files served directly.
- `src/app/` owns application state and navigation.
- `src/components/` contains reusable UI.
- `src/exercise-types/` contains exercise renderers and answer checks.
- `src/languages/` contains language-specific curricula and learning content.
- `src/data/exerciseCatalog.js` defines validated exercise-type distributions.
- `src/data/languageStructure.js` defines the three language reference guides.
- `src/services/` wraps browser capabilities such as storage and speech.
- `tests/` covers behavior and content integrity.
- `docs/` records curriculum and contribution decisions.

See [the roadmap](docs/roadmap.md) for the incremental migration plan.
