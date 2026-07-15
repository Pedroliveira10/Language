# Language Learning Studio

A mobile-first learning app for Dutch, Polish, and European Portuguese.

## Current state

The original, fully working single-file application is preserved at
`public/index.html`. The `src` tree establishes the boundaries for migrating
that application into maintainable modules without interrupting the published
version.

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

