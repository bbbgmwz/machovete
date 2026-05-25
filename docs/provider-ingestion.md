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
- Sportmonks' events tutorial documents a stronger sequence: `GOAL_UNDER_REVIEW` should be followed by either `GOAL_CONFIRMED` or `GOAL_DISALLOWED`, and events have `sort_order` for chronological ordering.
- `livescores/latest` returns fixtures changed within the last 10 seconds, but it tracks only fixture core fields: `state_id`, `venue_id`, `name`, `starting_at`, `starting_at_timestamp`, `result_info`, `leg`, and `length`. Changes in nested `events`, `lineups`, odds, or statistics do not trigger that endpoint by themselves.
- The livescores endpoints support includes such as `events`, `timeline`, `periods`, `scores`, `state`, `participants`, and `ballCoordinates`.
- The published event type list does not show a kickoff or restart event.
- Sportmonks' public webhook glossary says football data is currently delivered through a pull-based API model, so do not assume Sportmonks will push provider-managed goal notifications.

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

## API-Football Goal Verification Research

Initial docs review: API-Football can support a backend-built goal notification system and exposes VAR events, but the checked docs do not show an explicit kickoff/restart-after-goal signal or a provider-managed verified-goal notification product.

Relevant docs:

- Local saved documentation checked during research: `docs/api-football/API-Football - Documentation.html`
- API-Football VAR events announcement: https://www.api-football.com/news/post/var-events
- API-Football beginner guide, `/fixtures/events`: https://www.api-football.com/news/post/how-to-get-started-with-api-football-the-complete-beginners-guide
- API-Football save-calls guide for live fixtures/events polling: https://www.api-football.com/news/post/how-to-save-calls-to-the-api

Findings:

- The `/fixtures/events` endpoint returns match events with `time.elapsed`, `time.extra`, `team`, `player`, `assist`, `type`, `detail`, and `comments`.
- Available event types include `Goal`, `Card`, `Subst`, and `Var`.
- Goal details include `Normal Goal`, `Own Goal`, `Penalty`, and `Missed Penalty`.
- VAR details in the saved docs include `Goal cancelled` and `Penalty confirmed`.
- API-Football's VAR announcement says events cancelled or confirmed by VAR are available in API-Football V1, V2, and V3 from the 2020-2021 season.
- API-Football's beginner guide explicitly suggests using `/fixtures/events?type=Goal` for a dedicated goal notification system; this is still polling/filtering, not a provider-hosted notification service.
- Fixture status includes `1H`, `HT`, `2H`, `ET`, `BT`, `P`, and other match states. `1H` is described as first half kick-off and `2H` as second half started, but these statuses are period-level and do not prove kickoff restarted after an individual goal.
- The main `/fixtures` endpoint can be queried with `live=all` and returns live fixtures with events in the response. API-Football recommends this for saving calls.
- Fixtures and events are documented as updating every 15 seconds. Depending on competition, there may still be delay between reality and API availability.
- No checked API-Football docs mention webhooks, push feeds, or provider-managed verified-goal notifications.

Working product rule for MVP experiments:

- Treat raw API-Football `Goal` events as pending until our ingestion logic verifies them.
- If a later `Var` event with `Goal cancelled` appears, cancel the pending notification or emit a disallowed-goal correction only if the user opted into corrections.
- If a goal remains present in `/fixtures?live=all` or `/fixtures/events` after at least one additional polling cycle and no contradictory VAR event or score rollback appears, mark it provider-verified.
- Do not claim true kickoff-after-goal verification from API-Football unless live sampling proves a reliable restart signal exists outside the documented fixture status fields.

Provider comparison for this feature:

- Sportmonks is stronger for VAR-confirmed goal semantics because it documents `GOAL_UNDER_REVIEW -> GOAL_CONFIRMED` or `GOAL_DISALLOWED` event chains and `sort_order`.
- API-Football is usable for delayed goal notifications and VAR cancellation handling, but based on the checked docs it looks less explicit than Sportmonks for "goal confirmed" semantics.
- Neither provider currently proves "send only after kickoff restarted" from documentation alone. Real live-match sampling is required.
