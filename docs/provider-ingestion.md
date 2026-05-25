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
