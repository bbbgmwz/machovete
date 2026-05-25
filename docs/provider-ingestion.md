# Provider Ingestion

Provider ingestion starts with real data, not fake product fixtures.

## Default Execution

Use Supabase Edge Functions for MVP ingestion experiments and scheduled syncs. Use Supabase Cron plus `pg_net` to invoke scheduled functions. Store secrets used by scheduled calls in Supabase Vault.

## Edge-First Guardrail

Edge Functions are the default, but the architecture is not Edge-only. Move work to a dedicated worker if it needs:

- Longer execution time than Edge limits allow
- Heavy CPU work
- Unsupported native dependencies
- High-throughput batching
- Durable queue processing beyond the MVP setup

The API contract and normalized tables must stay stable if execution moves.

## Ingestion Rules

- Track provider request/response status.
- Store enough raw payload data for replay/debugging.
- Normalize before exposing data to clients.
- Use provider mapping tables for external IDs.
- Record failed jobs and retries.
- Make provider health visible to staff users.

## First MVP Focus

Football comes first. Do not broaden to secondary sports until live football lists, match details, scores, events, team pages, and league pages work from real provider data.

## Sportmonks Goal Verification Research

Initial docs review: Sportmonks exposes enough information to delay goal notifications until provider-level confirmation, but the docs do not show an explicit post-goal kickoff/restart event type.

Relevant docs:

- Events type definitions: https://docs.sportmonks.com/v3/definitions/types/events
- Livescores guide: https://docs.sportmonks.com/v3/world-cup-2026/live-matches-livescores-and-events
- Latest updated livescores: https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/livescores/get-latest-updated-livescores
- Fixture entity, including events, periods, scores, and ball coordinates: https://docs.sportmonks.com/v3/endpoints-and-entities/entities/fixture

Findings:

- `events` can be included on live score and fixture responses.
- Event type IDs include goal-like events: `14` goal, `15` own goal, and `16` penalty.
- VAR event type ID `10` covers cancelled goals and related VAR events.
- Sportmonks documents VAR goal states including `Goal under review`, `Goal cancelled`, `Goal confirmed`, and a final goal event once the check is over.
- `livescores/latest` returns fixtures changed within the last 10 seconds, but it tracks only fixture core fields: `state_id`, `venue_id`, `name`, `starting_at`, `starting_at_timestamp`, `result_info`, `leg`, and `length`. Changes in nested `events`, `lineups`, odds, or statistics do not trigger that endpoint by themselves.
- The livescores endpoints support includes such as `events`, `timeline`, `periods`, `scores`, `state`, `participants`, and `ballCoordinates`.
- The published event type list does not show a kickoff or restart event.

Working product rule for MVP experiments:

- Treat raw `GOAL`, `OWNGOAL`, and scored `PENALTY` events as pending until our ingestion logic verifies them.
- Suppress user push notifications while a related `Goal under review` VAR event exists.
- Suppress the notification if the provider emits `Goal cancelled`, `Goal Disallowed`, `Goal Disallowed - offside`, or if the normalized score rolls back.
- Send a "verified goal" notification only after provider-level confirmation: either the VAR outcome is goal-confirmed/final goal event, or the goal remains in `scores` and `events` after the next successful live polling cycle with no contradictory VAR/cancellation event.
- Do not claim true kickoff-after-goal verification from Sportmonks until real API sampling proves we can derive restart from `periods`, `timeline`, `ballCoordinates`, or another field.

Open validation task once a Sportmonks token is available:

- Poll `GET /v3/football/livescores/inplay?include=events.type;timeline.type;periods;scores;state;ballCoordinates` during matches.
- Capture raw payloads for goals, VAR goal reviews, cancelled goals, and post-goal restarts.
- Confirm whether `periods.ticking`, `timeline`, or `ballCoordinates.timer` can reliably prove play restarted after a goal.
- If no restart signal exists, use provider-confirmed-goal semantics instead of kickoff-confirmed semantics in the public notification setting.
