# API Contract

The API contract is the source of truth.

Frontends must not define product behavior independently from backend schemas. Contract changes must update:

- Validation schemas
- Shared domain types
- API client behavior
- Web implementation
- iOS implementation
- Android implementation
- Localization
- Tests
- Documentation

## Contract Principles

- Use normalized domain names, not provider names.
- Keep public response shapes stable and versionable.
- Additive changes are preferred.
- Breaking changes require a migration plan across all clients.
- Match statuses, event types, odds markets, and statistic types must be represented in shared types before UI usage.

## Initial API Areas

- Sports and countries
- Leagues and seasons
- Teams and players
- Match lists
- Match details
- Scores and match events
- Standings
- Favorites
- Provider health
- Staff mapping/correction endpoints

## Client Rule

Web, iOS, and Android should use generated or shared typed clients where possible. No client should hand-code a separate interpretation of backend responses.
