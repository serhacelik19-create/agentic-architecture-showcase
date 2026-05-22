# Development Notes

This project was prepared as a public portfolio demo from a larger private codebase. The goal was to keep the real architecture and product flow visible while making the repository safe to share publicly.

## How AI-Assisted Coding Was Used

AI tools were used as a development assistant for:

- Reviewing the project structure and identifying sensitive or production-only files.
- Planning a safe public-demo version of the repository.
- Refactoring external service boundaries into local/demo-safe behavior.
- Improving README documentation for portfolio review.
- Checking for likely missing dependencies, broken imports, and local setup issues.

AI output was treated as a draft, not as final truth. Changes were reviewed against the actual codebase before being kept.

## How The Output Was Verified

The public demo was checked with a mix of static analysis, build commands, and source searches:

- `npm run build` was used to verify the React panel build.
- `flutter pub get` was used to resolve mobile dependencies.
- `flutter analyze` was used to verify the Flutter app after dependency and folder changes.
- `node --check` was used on changed backend files to catch syntax errors.
- Source searches were used to confirm that production URLs, API keys, Firebase configuration, and external AI service calls were not left in the public demo.
- Git status and commit diffs were reviewed before committing changes.

## Trade-Offs

Some implementation details were intentionally adjusted for the public version:

- Production API and database URLs were replaced with local development endpoints.
- AI and push notification integrations were disabled or mocked so the project can be reviewed without private service credentials.
- Build outputs, dependency folders, logs, generated locks, and private environment files were excluded.
- Google Fonts were kept because they preserve the original UI appearance and do not expose private infrastructure.
- The admin app was removed from the public demo to keep the repository focused on the backend, institution panel, and student mobile app.

## What This Demonstrates

This repository is meant to show:

- Full-stack product structure across backend, web panel, and mobile app.
- Practical TypeScript/React, Flutter/Dart, Node.js/Express, Prisma, and PostgreSQL usage.
- Awareness of security and privacy when preparing a public code sample.
- Ability to use AI-assisted coding while still verifying behavior through tooling, reasoning, and code review.
