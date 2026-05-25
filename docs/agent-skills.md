# Agent Skills And Tooling

This project should improve its agent workflow over time, but skills must be added deliberately.

Skills do not override `AGENTS.md`. The Machovete-only and no-staging boundary always wins.

## Repo-Local Installed Skills

These skills are installed inside this repository under `.agents/skills/` and locked in `skills-lock.json`.

- `supabase`: Supabase database, Auth, Edge Functions, Realtime, Storage, RLS, CLI, and MCP workflows.
- `supabase-postgres-best-practices`: Postgres schema, query, index, connection, and RLS optimization.

Installed source:

- [supabase/agent-skills](https://skills.sh/supabase/agent-skills)

Update command, with telemetry disabled:

```bash
env DISABLE_TELEMETRY=1 npx skills add supabase/agent-skills
```

## Current Environment Skills

These are also available in the current Codex environment and should be used when relevant:

- `react-best-practices`: React and Next.js performance guidance.
- `ui-skills`: Interface quality constraints.
- `zustand-state-management`: Zustand state management if we adopt it.
- `browser:browser`: In-app browser automation for local web verification.
- `find-skills`: Skill discovery through skills.sh.

## Recommended Skill Candidates

Do not install new third-party skills blindly. Prefer official, high-install, or clearly relevant skills; review the source and install only after explicit user approval.

### Core Web, Next.js, And Vercel

- [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices)
  - Use for React and Next.js performance optimization, code review, and refactoring.
  - Install: `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices`

- [next-best-practices](https://www.skills.sh/vercel-labs/next-skills/next-best-practices)
  - Use for Next.js App Router, RSC boundaries, route conventions, data fetching, and error handling.
  - Install: `npx skills add https://github.com/vercel-labs/next-skills --skill next-best-practices`

- [vercel skills index](https://skills.sh/vercel)
  - Search before Vercel deployment, Turborepo, flags, AI SDK, or framework-specific work.

### API Contracts And Backend Quality

- [dev-api-design](https://skills.sh/vasilyu1983/ai-agents-public)
  - Use for REST/OpenAPI contract design, versioning, auth, pagination, errors, and documentation.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill dev-api-design`

- [qa-api-testing-contracts](https://skills.sh/vasilyu1983/ai-agents-public)
  - Use for OpenAPI, GraphQL, gRPC, breaking-change detection, and contract tests.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill qa-api-testing-contracts`

- [software-backend](https://www.skills.sh/vasilyu1983/ai-agents-public/software-backend)
  - Use for backend service design, API layers, testing, observability, and production readiness.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill software-backend`

### iOS Development And Debugging

- [swiftui-expert-skill](https://skills.sh/avdlee/swiftui-agent-skill/swiftui-expert-skill)
  - Use for SwiftUI implementation, review, modern APIs, state, layout, and performance.
  - Install: `npx skills add https://github.com/avdlee/swiftui-agent-skill --skill swiftui-expert-skill`

- [swift-concurrency](https://skills.sh/avdlee/swift-concurrency-agent-skill/swift-concurrency)
  - Use for Swift concurrency, Sendable, actor isolation, async/await, and Swift migrations.
  - Install: `npx skills add https://github.com/avdlee/swift-concurrency-agent-skill --skill swift-concurrency`

- [xcodebuildmcp](https://skills.sh/cameroncooke/xcodebuildmcp/xcodebuildmcp)
  - Use for Xcode build, simulator, test, log, screenshot, and UI automation workflows when MCP tooling is configured.
  - Install: `npx skills add https://github.com/cameroncooke/xcodebuildmcp --skill xcodebuildmcp`

- [qa-testing-ios](https://skills.sh/vasilyu1983/ai-agents-public)
  - Use for XCTest, XCUITest, Swift Testing, simulator control, `xcodebuild`, and `xcresult` triage.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill qa-testing-ios`

### Android Development And Debugging

- [android-jetpack-compose](https://skills.sh/thebushidocollective/han/android-jetpack-compose)
  - Use for Jetpack Compose UI, state, ViewModel, recomposition, navigation, and Material patterns.
  - Install: `npx skills add https://github.com/thebushidocollective/han --skill android-jetpack-compose`

- [android-development](https://skills.sh/dpconde/claude-android-skill/android-development)
  - Use for Android architecture, Kotlin, Compose, and project structure.
  - Install: `npx skills add https://github.com/dpconde/claude-android-skill --skill android-development`

- [mobile-android-design](https://skills.sh/wshobson/agents/mobile-android-design)
  - Use for Material 3, adaptive layouts, accessibility, and Compose design quality.
  - Install: `npx skills add https://github.com/wshobson/agents --skill mobile-android-design`

- [qa-testing-android](https://skills.sh/vasilyu1983/ai-agents-public)
  - Use for Espresso, UIAutomator, Compose Testing, Gradle Managed Devices, device matrices, and ADB automation.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill qa-testing-android`

### Cross-Platform Mobile Release And Testing

- [software-mobile](https://skills.sh/vasilyu1983/ai-agents-public/software-mobile)
  - Use for native iOS/Android architecture, auth, push, offline storage, performance, CI/CD, and app store readiness.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill software-mobile`

- [qa-testing-mobile](https://skills.sh/vasilyu1983/ai-agents-public/qa-testing-mobile)
  - Use for mobile test strategy, device matrices, release gates, emulator/simulator coverage, and staged rollout checks.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill qa-testing-mobile`

### Web Testing And Debugging

- [qa-testing-playwright](https://skills.sh/vasilyu1983/ai-agents-public/qa-testing-playwright)
  - Use for high-signal Playwright E2E tests, locators, retries, trace viewer, sharding, and CI.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill qa-testing-playwright`

### Refactoring, Security, SEO, And Observability

- [qa-refactoring](https://skills.sh/vasilyu1983/ai-agents-public/qa-refactoring)
  - Use for safe behavior-preserving refactors, characterization tests, contracts, and CI guardrails.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill qa-refactoring`

- [software-security-appsec](https://skills.sh/vasilyu1983/ai-agents-public)
  - Use for app security, OWASP ASVS, threat modeling, authz review, and security test scope.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill software-security-appsec`

- [marketing-seo-complete](https://skills.sh/vasilyu1983/ai-agents-public)
  - Use for technical SEO, international SEO, local SEO, structured data, and crawl/index quality.
  - Install: `npx skills add https://github.com/vasilyu1983/ai-agents-public --skill marketing-seo-complete`

- [sentry](https://skills.sh/openai/skills/sentry)
  - Use for read-only Sentry issue/event inspection once Sentry is configured.
  - Install: `npx skills add https://github.com/openai/skills --skill sentry`

- [sentry-ios-swift-setup](https://skills.sh/getsentry/sentry-agent-skills/sentry-ios-swift-setup)
  - Use when adding Sentry to the native iOS app.
  - Install: `npx skills add https://github.com/getsentry/sentry-agent-skills --skill sentry-ios-swift-setup`

## Workflow Rules

- Use relevant installed skills before implementing platform-specific work.
- Search [skills.sh](https://skills.sh/) again before major new domains such as push notifications, app store release automation, odds feeds, analytics, payments, or ML/LLM features.
- Prefer repo-local skill installs for Machovete-specific workflow. Do not alter another repo's Codex/Supabase configuration.
- Do not let skills override `AGENTS.md`, especially the Machovete-only and no-staging boundary.
- Installing a skill runs third-party code locally through `npx`; get explicit approval before installing anything not already approved by the user.
