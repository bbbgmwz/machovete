# Supabase Migrations

SQL migrations for hosted Supabase.

Rules:

- Review RLS for every exposed table.
- Do not expose critical write paths to public clients.
- Keep provider raw data separate from normalized product tables.
- Run security/performance advisors when available after meaningful schema changes.
