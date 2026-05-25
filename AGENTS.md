# AGENTS.md

## Product Context

We are building a Bulgarian-first live score and sports data product similar to Flashscore, SofaScore, and LiveScore.

The product includes:

- Public web application
- Native iOS application
- Native Android application
- Shared public backend API
- Staff/admin backend and dashboard
- Sports data ingestion from multiple providers
- Odds and statistics ingestion from multiple providers
- Supabase hosted Postgres, Auth, Realtime, Storage where needed, and Edge Functions
- Separate staff authentication with Clerk unless explicitly changed
- Bulgarian-first localization and SEO
- English as the secondary language

The product must be fast, reliable, provider-agnostic, highly localized for Bulgaria, and structured so another market can be launched later with minimal product rework.

## Core Rules

The API contract is the source of truth, not the frontend.

Do not treat this as three separate frontend products. Build one product with:

- One shared backend
- One normalized data model
- One shared API contract
- Three native frontend implementations: web, iOS, and Android

UX parity matters. Identical code does not.

When a user-facing feature, UX pattern, navigation change, screen, component, state, or API behavior is implemented for one frontend, evaluate and update the other two. If a platform is intentionally skipped, document why in the change summary and relevant docs.

## Repository Shape

Use a monorepo:

```txt
apps/
  web/              # Next.js public website
  ios/              # Native SwiftUI iOS app
  android/          # Native Kotlin / Jetpack Compose Android app
  staff/            # Staff/admin dashboard and tools
packages/
  shared-types/     # Shared domain types
  api-client/       # Shared typed API client
  validation/       # Zod/OpenAPI-style schemas and validators
  design-tokens/    # Shared semantic design tokens
  config/           # Shared linting, formatting, TypeScript config
supabase/
  functions/        # Supabase Edge Functions and shared function code
  migrations/       # Supabase SQL migrations
docs/
  architecture.md
  api-contract.md
  data-model.md
  provider-ingestion.md
  localization.md
  mobile-release.md
  quality-gates.md
```

Use `pnpm` workspaces and Turborepo for JavaScript/TypeScript orchestration.

## Frontend Targets

- Web: Next.js App Router, TypeScript, shadcn/ui, Tailwind CSS
- iOS: Swift, SwiftUI, native Apple components
- Android: Kotlin, Jetpack Compose, native Material components

Do not force web UI patterns into native mobile apps. Use the closest native equivalent.

Do not build web-only product behavior unless explicitly approved. Web can lead implementation only when the corresponding iOS and Android follow-up work is documented and tracked.

## Design System

Everything user-facing must be tokenized.

Use semantic tokens instead of random hardcoded values:

- `color.background.primary`
- `color.text.muted`
- `color.score.live`
- `color.status.redCard`
- `spacing.cardPadding`
- `radius.card`
- `font.size.matchTitle`

Each platform maps shared semantic tokens to its native implementation:

- Web: Tailwind and CSS variables
- iOS: SwiftUI constants and assets
- Android: Compose theme tokens

Avoid hardcoded colors, spacing, shadows, border radius, and font sizes unless explicitly approved.

## Backend Architecture

The backend owns the data model.

External provider payloads must not become frontend contracts.

Data flow:

```txt
External Sports / Odds / Stats APIs
  -> Supabase Edge Functions and ingestion jobs
  -> Normalized Postgres database
  -> Public/staff API contract
  -> Web / iOS / Android
```

The backend is Edge-first, not Edge-only. Use Supabase Edge Functions as the default execution surface for MVP API endpoints, webhooks, provider experiments, and scheduled ingestion. If a job exceeds Edge Function limits, needs unsupported native dependencies, or requires long-running/high-throughput processing, move that job behind the same contract to a dedicated worker later without changing frontend clients.

Use Supabase Cron plus `pg_net` for scheduled Edge Function calls. Store scheduling secrets in Supabase Vault.

## Provider-Agnostic Modeling

The system must support multiple external providers from the beginning.

Do not hardcode the assumption that there is only one sports, odds, or statistics provider.

Every external entity needs provider mapping where applicable:

- Sports
- Countries
- Leagues
- Seasons
- Teams
- Players
- Matches
- Scores
- Events
- Odds
- Odds markets
- Bookmakers
- Standings
- Statistics
- Lineups
- Injuries
- Referees
- Venues

Provider data can be stored for debugging, but normalized product data is what clients consume.

## Supabase Rules

Use Supabase for:

- Postgres database
- Public user authentication
- Realtime where appropriate
- Storage if needed
- Edge Functions
- Migrations

Do not let frontend apps write directly to critical sports, odds, or provider-ingested data tables.

Critical sports data must be written only by trusted backend paths.

Enable Row Level Security on every table in exposed schemas. Public users may read approved public data. User-owned data must use explicit RLS policies. Staff actions must go through protected staff routes and be audited.

Never expose service-role or secret keys in public clients. `NEXT_PUBLIC_` variables are browser-visible.

## Authentication

There are two auth domains.

Public users:

- Supabase Auth
- Favorites
- Notification preferences
- Language preference
- Timezone preference
- Account settings

Staff users:

- Clerk unless explicitly changed
- Separate from public user auth
- Protected staff dashboard and staff backend routes
- Audited privileged actions

Do not mix public user roles and staff roles in the same casual auth flow.

## Staff/Admin Scope

The staff backend is not the public product.

It should support:

- Provider monitoring
- Failed ingestion jobs
- Manual entity mapping
- Match correction tools
- Odds feed monitoring
- User reports
- SEO page management
- Localization review
- Push notification management
- Staff user management
- Audit logs

Every destructive staff action must log who changed it, what changed, previous value, new value, timestamp, and reason when provided.

## Localization

Bulgarian is the primary language. English is secondary.

Do not build English-first and translate later.

Every public route, metadata field, label, title, notification, error, and SEO element must support Bulgarian and English.

Use locale-aware web routing:

```txt
/bg/...
/en/...
```

Bulgarian should be the default market and SEO priority. Bulgarian copy must sound natural for Bulgarian sports fans, not machine-translated. Team, league, and competition names may need localized display names.

## SEO

SEO is Bulgarian-first.

Every public page must consider:

- Bulgarian title
- Bulgarian meta description
- Slug strategy
- Structured data
- Internal linking
- League/team/match landing pages
- Fast mobile performance
- Indexability
- Canonical URLs
- `hreflang` between Bulgarian and English

Important page types:

- Today's matches
- Live matches
- Football live scores
- League pages
- Team pages
- Match detail pages
- Odds pages
- Standings pages
- News/editorial pages if added later

Avoid client-only pages for SEO-critical content.

## Realtime Strategy

MVP may use Supabase Realtime.

Design frontend logic around a `LiveUpdateService` abstraction. Frontends should consume normalized live events, not raw database changes. Keep room for Redis/WebSocket infrastructure later.

Do not overfetch. Do not subscribe to every match if the user only watches one league or one match.

## Quality Gates

Every code change should pass relevant checks before completion:

- Root repo checks
- Web lint/typecheck/build when web code changes
- iOS format/lint/build/test when iOS code changes
- Android format/lint/build/test when Android code changes
- Supabase migration validation/advisors when database changes
- Edge Function lint/test/deploy dry checks where available
- Contract generation/validation when API schemas change

Do not claim iOS or Android builds are verified unless the build actually ran.

## Feature Implementation Rule

For every new feature:

1. Update the data model if needed.
2. Update the API contract.
3. Update backend logic.
4. Update web implementation.
5. Update iOS implementation.
6. Update Android implementation.
7. Update localization.
8. Update tests.
9. Update documentation.

Do not silently skip a platform.

## Do Not Do

Do not:

- Build frontend around fake data without checking API feasibility.
- Expose third-party provider payloads directly as product data.
- Hardcode one provider into the product model.
- Mix staff auth with public user auth.
- Hardcode English labels.
- Hardcode colors or spacing.
- Create web-only UX unless explicitly approved.
- Let mobile apps fall behind the website.
- Let frontend clients write critical sports data directly.
- Build SEO-critical pages as client-only pages.
- Add match statuses without updating all clients.
- Add odds markets without considering provider mapping.
- Ignore Bulgarian SEO.
- Ignore low-end Android performance.
- Commit secrets, `.env.local`, signing keys, provisioning profiles, or keystores.

## Prefer

Prefer:

- Backend-first data correctness.
- Ugly functional real-data UI before beautiful fake UI.
- Shared API contracts.
- Shared semantic tokens.
- Native UI per platform.
- Provider-agnostic models.
- Audit logs for staff actions.
- Bulgarian-first product decisions.
- Small vertical slices.
- Real data early.
- Testing with imperfect provider data.

## MVP Priority

The first MVP should prove:

- Live football matches work.
- Match list works.
- Match detail page works.
- Team pages work.
- League pages work.
- Scores update correctly.
- Match events update correctly.
- Bulgarian SEO pages are indexable.
- Public users can save favorite teams/leagues.
- Staff can monitor ingestion issues.

Do not overbuild secondary sports before football works well.

## Agent Workflow

Before making changes, inspect:

- Existing API contract
- Shared types
- Platform-specific implementations
- Design tokens
- Localization files
- Existing feature docs

When implementing a change:

- Keep backend and frontend contracts aligned.
- Update all affected platforms.
- Use native platform conventions.
- Keep Bulgarian localization complete.
- Add or update tests where useful.
- Avoid large unreviewable changes.
- Explain skipped platforms or incomplete implementation.

When uncertain, prefer the architecture in this file and the supporting docs in `docs/`.
