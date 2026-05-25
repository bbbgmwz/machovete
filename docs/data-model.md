# Data Model

The normalized data model exists to make multiple providers usable as one product.

## Initial Domains

- Sport
- Country
- League
- Season
- Team
- Player
- Match
- Score
- Match event
- Venue
- Referee
- Standing
- Statistic
- Lineup
- Injury
- Bookmaker
- Odds market
- Odds selection

## Provider Mapping

Every provider-owned entity should support mapping to internal IDs:

- `provider_name`
- `provider_entity_type`
- `provider_entity_id`
- `internal_entity_id`
- confidence/status fields where manual review may be needed

Do not assume two providers name the same entity the same way.

## Raw Payloads

Raw provider payloads may be stored for debugging and replay. They are not product data and must not be exposed directly to frontends.

## Staff Review

Manual mapping and correction workflows should be built into the staff surface early. Sports data quality will depend on correcting provider mismatches.
