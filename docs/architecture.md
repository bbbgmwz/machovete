# Architecture

## Product Shape

Machovete is one sports data product with three native clients:

- Web app for public users and SEO landing pages
- Native iOS app
- Native Android app

The backend, data model, and API contract are shared.

## Core Flow

```txt
External providers
  -> Supabase Edge Functions and scheduled ingestion
  -> Normalized Postgres tables
  -> Public/staff API contract
  -> Web, iOS, Android
```

Frontend clients consume normalized product data. They do not consume raw provider payloads.

## Backend Execution

Use Supabase Edge Functions first for:

- MVP public API endpoints
- Provider ingestion experiments
- Webhooks
- Scheduled syncs invoked by Supabase Cron and pg_net
- Lightweight staff actions

Move a workload behind the same contract later if it becomes too long-running, high-volume, dependency-heavy, or unsuitable for Edge Function limits.

## Auth Domains

Public users authenticate with Supabase Auth.

Staff users authenticate separately with Clerk unless explicitly changed. Staff operations go through protected staff routes and write audit logs.

## Realtime

Use a `LiveUpdateService` abstraction in clients. Supabase Realtime is acceptable for MVP, but raw database changes must not leak into client domain logic.
