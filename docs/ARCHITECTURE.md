# GeoQuest AI — Architecture

## Overview

This document describes the technical architecture for GeoQuest AI: the stack, why each piece was chosen, and how the major systems fit together. It assumes familiarity with the gameplay described in `GAME_DESIGN.md`.

## Tech Stack

| Layer | Choice | Notes |
| :---- | :---- | :---- |
| Frontend | Next.js + TypeScript + Tailwind CSS | Prior experience on the team |
| State management | Redux Toolkit | Prior experience; Zustand considered as a lighter alternative if needed later |
| Backend | NestJS | Prior experience; modular structure suits separating game logic, matchmaking, AI integration, etc. |
| Database | PostgreSQL + Prisma ORM | Prior experience; relational data (users, games, questions, countries) fits well |
| Auth | NextAuth | Prior experience |
| Realtime (local rooms, live multiplayer) | Socket.IO | Prior experience |
| Matchmaking / session state / presence | Redis | New addition — needed once queues, live rooms, or multi-instance Socket.IO scaling are required |
| AI question generation | Anthropic or OpenAI API, called from a scheduled backend job | New integration; straightforward REST calls from NestJS, not called live per-turn |
| Map rendering | SVG world map (e.g. react-simple-maps or a custom-controlled SVG) | New library |
| API testing | Bruno | Already in use |
| Package manager | pnpm | Efficient monorepo workspace support, avoids duplicated `node_modules` across apps |
| Monorepo tooling | Turborepo | Task orchestration and build caching across `apps/web` and `apps/api` |
| Hosting (free tier to start) | Vercel (frontend) + Render/Railway (NestJS + Postgres + Redis) | Render already used previously |

## Repository & Infrastructure Setup

### Repository Layout

A single monorepo, not separate repos per app, since the frontend and backend share domain types (`Turn`, `Attempt`, `Question`, etc. from `DOMAIN_MODEL.md`) that need to stay in sync:

```txt
geoquest-ai/
├── apps/
│   ├── web/          (Next.js)
│   └── api/           (NestJS)
│       └── api-testing/bruno/geoquest-ai/   (Bruno collection, YAML-based format)
├── packages/
│   ├── shared-types/   (TS interfaces shared between web & api)
│   ├── config/         (shared eslint/tsconfig base)
│   └── database/       (independent workspace: Prisma schema, client, migrations, seed/import scripts — see Database Package Ownership below)
├── docs/               (GAME_DESIGN.md, ARCHITECTURE.md, DECISIONS.md, ROADMAP.md, DOMAIN_MODEL.md)
├── docker-compose.yml
├── package.json        (root workspace config)
└── .env.example
```

### Database Package Ownership

`packages/database` is a fully independent workspace, not a thin pass-through:

- Its own `package.json`, own `.env` (for standalone script execution), and own scripts: `db:push`, `db:migrate`, `db:seed`, plus import scripts.
- Owns the Prisma schema, migrations, and exposes the Prisma Client plus typed data-access functions for `apps/api` to consume.
- `apps/api` never runs Prisma CLI commands or writes raw Prisma calls directly — it depends on `packages/database` as a library.
- The AI question-generation job's *scheduling and orchestration* (cron trigger, LLM API calls, retry logic) lives in `apps/api`'s AI Module, since that's application logic — but the actual writing of generated questions to the database goes through functions exposed by `packages/database`, keeping "how data gets written" owned by the database package and "when/why" owned by the API.
- `DATABASE_URL` is defined independently in both `packages/database/.env` (for standalone migration/seed runs) and `apps/api/.env` (for runtime connection), pointing at the same value — a small deliberate duplication that preserves each workspace's independence rather than one reaching into the other's config.

### Database Package Structure & Seeding Strategy

```txt
packages/database/
├── prisma/               (schema.prisma, migrations/)
└── scripts/
    ├── seed/             (deterministic baseline data required for the app: categories, countries, base question set)
    │   ├── categories/
    │   ├── countries/
    │   └── questions/
    └── import/           (bulk-loading external datasets: country data, flags, larger question sets)
        ├── countries/
        └── questions/
```

`seed/` and `import/` are kept as separate concepts: seed scripts produce the deterministic baseline data the app requires to run at all; import scripts bulk-load larger or external datasets on top of that baseline. Keeping them distinct avoids scripts becoming a disorganized grab-bag as the project grows.

### Package Manager & Monorepo Tooling

- **pnpm workspaces** manage dependencies across `apps/*` and `packages/*`, using the `workspace:*` protocol for internal package linking.
- **Turborepo** orchestrates and caches tasks (`build`, `dev`, `lint`, `test`) across apps, so unrelated apps aren't rebuilt unnecessarily.

### Docker Compose Organization

Docker Compose runs only the **stateful local services** (Postgres, Redis) — not the Next.js or NestJS apps themselves, which run natively via pnpm/Turborepo for fast dev-loop iteration (hot reload). Containerizing the apps is a deployment/CI concern, handled separately from local development.

### Environment Variable Strategy

- A single `.env.example` at the repo root, checked into git, documenting every variable with placeholders — never real secrets.
- Real `.env` files (git-ignored) live per app (`apps/web/.env.local`, `apps/api/.env`).
- NestJS validates required env vars at startup (e.g., via `@nestjs/config` with a Joi/Zod schema) so missing configuration fails fast at boot rather than deep in a service call.
- Deployed environments (Vercel, Render) use their own secret/env management UI; secrets are never committed.

### Linting, Formatting & Git Hooks

- ESLint (flat config) + Prettier, with a single shared config in `packages/config` extended by both apps — not independently drifting configs. `eslint-config-prettier` disables ESLint rules that would conflict with Prettier's formatting.
- Husky manages git hooks; `lint-staged` runs lint/format only on staged files at `pre-commit`. Full type-checking and tests run in CI, not as a commit-blocking local hook.

### Shared TypeScript Configuration

A `packages/config/tsconfig.base.json` with `strict: true` enabled from day one, extended by `apps/web/tsconfig.json` and `apps/api/tsconfig.json`, overridden only where genuinely needed (e.g., Next.js JSX settings).

### Development Workflow

- Trunk-based development: short-lived feature branches off `main`, one branch per roadmap item.
- Conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`), which also pairs with the tagged-release strategy in `DECISIONS.md`.
- Self-review via pull request before merging to `main`, even as a solo developer, as an optional extra checkpoint.

### API Design

- **Resource-oriented REST**, not action-oriented. Endpoints map to domain entities from `DOMAIN_MODEL.md`, not bare verbs:

  ```txt
  GET    /games
  POST   /games
  GET    /games/:id
  POST   /games/:id/turns              (starts a new Turn, triggers the spin)
  POST   /games/:id/turns/:turnId/attempts   (submits an Attempt — country guess or question answer)
  ```
  
  `spin` and `answer` are not standalone action endpoints — they're expressed as creating a `Turn` and creating an `Attempt` within it, mirroring the domain model directly so the API surface doesn't drift from the entities it represents.

### Database Conventions

- **IDs**: CUID2 for all primary keys (Prisma's current `cuid()`-family generator) — URL-safe, non-sequential (no ID-guessing), natively supported by Prisma.
- **Timestamps**: all timestamps stored in UTC, no exceptions. Localization/timezone display is handled entirely on the frontend.
- **Deletion policy**:
  - `Question`: soft delete (`deletedAt`). Soft-deleted questions are excluded from the live pool the Spinner draws from, but remain in the table so historical `Attempt` records referencing them stay valid.
  - `User`: soft delete for normal app behavior; a separate hard-delete/anonymization path for actual data-erasure requests (e.g., GDPR) is an open item deferred to the auth/compliance phase, not decided now.
  - `Country`, `Game`, `Turn`: never deleted — preserves historical integrity per the Turn/Attempt source-of-truth principle in `DECISIONS.md`.

### API Testing & Definition of Done

- **Bruno** collections are checked into the repo (not stored externally), living at `apps/api/api-testing/bruno/geoquest-ai/`. Bruno's current format stores collections as YAML files (e.g. `Create Games.yml`, `folder.yml`, `workspace.yml`), not the older `.bru` format.
- **Development loop**: for each endpoint — write the implementation, exercise it manually in Bruno, write Bruno test assertions, run the Bruno test suite, then commit. Once a phase/feature/roadmap item is complete, tag the release per the versioning strategy in `DECISIONS.md`.
- **Definition of Done**: a feature is not complete until all four layers are updated:
  1. Implementation
  2. Automated tests (unit/integration, where applicable)
  3. Bruno collection (requests + assertions)
  4. Documentation — only if the change affects architecture, API contracts, or project documentation
  
  This is a stated project rule enforced by personal discipline/PR self-review rather than automated tooling for now; introducing an automated check (e.g., a PR checklist or CI gate) is a possible future addition, not required to adopt the rule today.

## System Components

### Frontend (Next.js)

- Renders the game board, spinner, map, and question UI.
- Manages local game state via Redux Toolkit; syncs with backend via REST (turn-based data) and Socket.IO (realtime multiplayer events).

### Backend (NestJS)

Proposed module breakdown (to be refined as we build):

- **Auth Module** — NextAuth-integrated user accounts.
- **Game Module** — core game state machine: turns, spins, movement, tile effects, streaks.
- **Questions Module** — question bank CRUD, category weighting logic, serving questions to the Game Module.
- **AI Module** — scheduled jobs for question freshness generation; interfaces with the LLM provider API.
- **Matchmaking Module** (V3) — skill rating, queueing, pairing players for online multiplayer.
- **Realtime Gateway** — Socket.IO gateway for local/private/online multiplayer room events.

### Database (PostgreSQL via Prisma)

Core entities anticipated (to be formalized into a Prisma schema during implementation), matching `DOMAIN_MODEL.md`:

- `User`
- `Country`
- `Category`
- `Question` (with category, optional country reference, difficulty, source: static vs. AI-generated)
- `Board`, `Tile`
- `Game` (mode, players, country pool, board reference, state)
- `GamePlayer` (per-player progress within a game)
- `Turn`, `Attempt` (persisted per the mode-based persistence policy in `DECISIONS.md`)
- `PlayerStat` (aggregated accuracy/time/category performance, derived from Turn/Attempt history, feeding adaptive difficulty and skill rating)

### Realtime Layer (Socket.IO + Redis)

- Socket.IO handles live events: turn changes, spins, answers, tile effects, chat (if added later).
- Redis is introduced once we need to (a) share session/presence state across multiple backend instances, or (b) support a matchmaking queue. Not required for local single-instance MVP development, but planned for from the start so the realtime layer isn't rebuilt later.

### AI Integration

- **Batch question refresh job**: runs on a schedule (e.g., daily/weekly), calls the LLM provider, generates/refreshes questions in the "current events" category, stores them in Postgres. Includes a manual review/spot-check step before questions go live, especially early on.
- **AI opponent (bot)**: logic lives in the Game Module; calibrated using the player's skill rating rather than calling an LLM live during play (keeps latency and cost predictable).

## Hosting & Environments

- **Frontend**: Vercel (free tier to start).
- **Backend + DB + Redis**: Render or Railway (free tier to start).
- Local development uses Docker Compose for Postgres and Redis only (see Repository & Infrastructure Setup above); the Next.js and NestJS apps run natively for faster iteration.

## Noted for Later (Paid, Deferred)

- Managed Redis at production scale (beyond free tier limits).
- Dedicated WebSocket infrastructure (e.g., Ably, Pusher) if Socket.IO + Redis outgrows a self-managed setup.
- Higher-tier LLM API usage as question-generation volume grows.

## Open Questions

- Final choice of SVG map library vs. hand-built SVG.
- Exact skill-rating formula for matchmaking (deferred to the matchmaking build phase).
- Whether 2v2 online multiplayer is pursued post-MVP.
