# Language Learning Studio

A mobile-first learning app for Dutch, Polish, and European Portuguese.

## Current state

The modular application contains 630 CEFR topics and 3,150 independently
tracked activities across Dutch, Polish, and European Portuguese. The original
single-file application is preserved at public/legacy.html.

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
- `src/services/` wraps browser capabilities such as storage and speech.
- `tests/` covers behavior and content integrity.
- `docs/` records curriculum and contribution decisions.

See [the roadmap](docs/roadmap.md) for the incremental migration plan.

