# Machovete

Bulgarian-first live score and sports data platform for web, iOS, and Android.

This repository is intentionally starting with project governance, shell structure, and quality gates before app code. The first implementation priority after this foundation is backend/API and provider ingestion validation against real sports data.

## Stack Direction

- Monorepo: pnpm workspaces + Turborepo
- Web: Next.js App Router, TypeScript, shadcn/ui, Tailwind CSS
- iOS: Swift + SwiftUI
- Android: Kotlin + Jetpack Compose
- Backend: Supabase hosted Postgres/Auth/Realtime/Edge Functions
- Public auth: Supabase Auth
- Staff auth: Clerk unless explicitly changed
- Localization: Bulgarian default, English secondary

## First Commands

```bash
pnpm install
pnpm check
```

Read `AGENTS.md` before making changes.
