# Quality Gates

Production quality is the default expectation from the first commit.

## Root

- `pnpm install`
- `pnpm check`
- CI must pass before merging

## Web

When web code exists and changes:

- Format
- Lint
- Typecheck
- Build
- Browser verification for user-facing changes
- SEO validation for public pages

## iOS

When iOS code exists and changes:

- Swift formatting/linting when configured
- Xcode build
- Unit/UI tests where useful
- Real device or simulator check for UI changes when feasible

## Android

When Android code exists and changes:

- Kotlin formatting/linting when configured
- Gradle build
- Unit/UI tests where useful
- Emulator or device check for UI changes when feasible

## Supabase

When database or backend changes:

- Migration review
- RLS review for exposed schemas
- Security advisor review where available
- Performance advisor review for meaningful schema/query changes
- Edge Function local or deploy validation where available

## Documentation

Update docs when changing architecture, contracts, data model, localization behavior, release process, or quality gates.
