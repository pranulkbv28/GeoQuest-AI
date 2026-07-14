# GeoQuest AI — Decisions Log

## Purpose
This is a running, ADR-style log of decisions made during design and development, along with the reasoning behind them. New entries should be appended at the top, with the date, the decision, alternatives considered, and the reasoning.

## Decision Format
Each entry follows this structure:
- **Decision**: what was decided
- **Alternatives considered**: what else was on the table
- **Reasoning**: why this option was chosen

## Log

### Category has a stable, human-set `categorySlug` for lookups
- **Decision**: `Category` includes a unique `categorySlug` field (e.g. `culture-and-society`), separate from its `id` and display `name`. Lookups by slug (`GET /categories/slug/:slug`) are supported alongside lookup by `id`.
- **Alternatives considered**: Relying solely on `id` (CUID2) for all category lookups, including any URL-facing or hardcoded references.
- **Reasoning**: A CUID2 `id` is not human-readable or stable to hardcode in frontend logic (e.g., "highlight the Culture & Society category"); a slug gives a stable, readable identifier independent of the display `name`, which may be revised for copy reasons without breaking existing references. The category seed script must upsert on `categorySlug` (not delete-and-recreate) specifically so this stability is preserved across reseeds — see the seed-script idempotency note below.

### Seed scripts must upsert, not delete-and-recreate, once referenced by other tables
- **Decision**: Seed scripts for reference data (`Category`, `Country`) use `upsert` keyed on a stable unique field (`categorySlug`, `isoCode`), never `deleteMany` followed by `createMany`.
- **Alternatives considered**: Clearing and reseeding lookup tables from scratch on every run, for simplicity.
- **Reasoning**: Delete-and-recreate generates new primary keys on every run, silently orphaning any existing foreign-key references (e.g., a `Question.categoryId` pointing at a since-deleted row). Once `Question` exists with `onDelete: Restrict` on its `Category` relation, a `deleteMany` against a referenced `Category` would fail outright. Upserting on a stable business key avoids both problems and keeps reseeding safe to run repeatedly.

### API is versioned via URI prefix (`/api/v1/...`)
- **Decision**: All REST endpoints are exposed under a versioned prefix, e.g. `/api/v1/countries`, `/api/v1/categories`, using NestJS's built-in URI-based versioning (`app.enableVersioning()` plus a `version` on each `@Controller`).
- **Alternatives considered**: No versioning for now (add later if needed); header-based versioning instead of URI-based.
- **Reasoning**: Introducing versioning early, while the API surface is still small, avoids a breaking migration later once real clients (the frontend, or external consumers) depend on unversioned paths. URI-based versioning was chosen over header-based for visibility and simplicity — the version is immediately obvious from the URL itself, which matters for a small team debugging via Bruno/browser rather than programmatically-set headers.

### Bruno collections live in-repo (YAML format) and a four-layer Definition of Done governs every feature
- **Decision**: Bruno's request/test collections are checked into the repository at `apps/api/api-testing/bruno/geoquest-ai/`, using Bruno's current YAML-based file format (e.g. `Create Games.yml`, `folder.yml`, `workspace.yml`) rather than the older `.bru` format. Additionally, a feature is not considered complete until four layers are all updated: (1) implementation, (2) automated tests, (3) Bruno collection (requests + assertions), (4) documentation — only where the change affects architecture, API contracts, or project docs. The working loop per endpoint is: implement → exercise manually in Bruno → write Bruno test assertions → run the Bruno suite → commit; phase/feature completion triggers a tagged release per the existing versioning strategy.
- **Alternatives considered**: (1) Keeping Bruno collections outside the repo (e.g., only local to each developer's machine). (2) Treating tests/documentation as optional or "nice to have" rather than part of a feature's definition of done. (3) Automated enforcement (CI gate/PR checklist) of the four-layer rule from day one.
- **Reasoning**: Bruno collections are plain files, so checking them into git means the request/test suite is versioned and reviewable alongside the code that implements it, and available to anyone cloning the repo. The four-layer Definition of Done formalizes a rule that was otherwise just an intention, and ties directly into the tagged-release strategy: every tag then represents software that is implemented, tested, documented, and reproducible, rather than just "written." Enforcement is via personal discipline/self-review for now rather than automated tooling, since automated enforcement is a reasonable future addition but not required to adopt the rule itself.

### Database package (`packages/database`) is a fully independent workspace
- **Decision**: `packages/database` owns its own `package.json`, its own `.env`, and its own scripts (`db:push`, `db:migrate`, `db:seed`, plus import scripts). It owns the Prisma schema, migrations, and exposes the Prisma Client plus typed data-access functions for `apps/api` to consume. `apps/api` never runs Prisma CLI commands or writes raw Prisma calls directly. The AI question-generation job's scheduling/orchestration lives in `apps/api`'s AI Module, but the actual writes go through functions exposed by `packages/database`.
- **Alternatives considered**: Keeping `packages/database` as a thin package that mainly exposes the Prisma Client, with `apps/api` owning database scripts and environment configuration directly.
- **Reasoning**: This gives persistence concerns a clear, independent boundary consistent with the "Turn/Attempt as source of truth" principle, and makes future additions (seed scripts, country imports, AI-generated question writes) feel like natural extensions of the database package rather than miscellaneous scripts hanging off the API. `DATABASE_URL` is deliberately duplicated across `packages/database/.env` and `apps/api/.env` (pointing at the same value) to preserve this independence rather than one workspace reaching into the other's config.

### Database package seeding structure: separate `seed/` and `import/` scripts
- **Decision**: `packages/database/scripts/` is split into `seed/` (deterministic baseline data the app requires: categories, countries, base question set) and `import/` (bulk-loading external datasets: larger country data, flags, larger question sets).
- **Alternatives considered**: A single undifferentiated `scripts/` folder for all data-loading scripts.
- **Reasoning**: Seeding and bulk importing are conceptually different operations (required baseline vs. optional bulk data), and keeping them separate avoids the scripts folder becoming a disorganized grab-bag as the project grows.

### API design is resource-oriented REST, with Turn/Attempt as explicit sub-resources
- **Decision**: The API is resource-oriented, not action-oriented — endpoints map to domain entities from `DOMAIN_MODEL.md`. Rather than bare action endpoints like `POST /spin` or `POST /answer`, gameplay actions are modeled as creating sub-resources: `POST /games/:id/turns` starts a new Turn (triggering the spin), and `POST /games/:id/turns/:turnId/attempts` submits an Attempt (a country guess or a question answer).
- **Alternatives considered**: Action-oriented REST with flat verb-based endpoints (e.g., `POST /spin`, `POST /answer`) not tied to a specific resource path.
- **Reasoning**: The game revolves around a `Game` resource and almost every action modifies one, so resource-oriented REST fits naturally with NestJS controllers and keeps endpoints intuitive. Modeling `spin`/`answer` as Turn/Attempt sub-resources (rather than reintroducing informal verbs) keeps the API surface aligned with the actual domain model rather than drifting from it — this is also the kind of endpoint-shape decision that's painful to change later once frontend code depends on it.

### Database conventions: CUID2 primary keys, UTC-only timestamps, entity-specific deletion policy
- **Decision**:
  - **IDs**: all primary keys use CUID2 (Prisma's current `cuid()`-family generator).
  - **Timestamps**: all timestamps are stored in UTC with no exceptions; localization/timezone display is a frontend concern only.
  - **Deletion policy**: `Question` uses soft delete (`deletedAt`), excluded from the live question pool but retained so historical `Attempt` records stay valid. `User` uses soft delete for normal app behavior, with a separate hard-delete/anonymization path for actual erasure requests (e.g., GDPR) explicitly deferred to the auth/compliance phase rather than decided now. `Country`, `Game`, and `Turn` are never deleted.
- **Alternatives considered**: (1) Auto-increment integer IDs, UUIDs, or ULIDs instead of CUID2. (2) Hard-deleting `Question`/`User` records. (3) Deciding a final GDPR-compliant erasure mechanism now rather than deferring it.
- **Reasoning**: CUID2 is URL-safe, non-sequential (avoids ID-guessing), and natively supported by Prisma, without ULID's or UUID's tradeoffs for this use case. UTC-only timestamps prevent an entire class of timezone bugs that are expensive to retrofit later. The deletion policy preserves historical integrity consistent with "Turn/Attempt as source of truth for gameplay history" — a deleted question or user shouldn't invalidate an old game's recorded history. The `User` hard-delete/erasure mechanism is explicitly left open rather than falsely resolved, since it's a compliance concern properly addressed alongside authentication work, not before.

### Repository & infrastructure foundation locked in before app scaffolding
- **Decision**: Before creating the Next.js or NestJS apps, the following foundational choices are locked in: a single **monorepo** (`apps/web`, `apps/api`, `packages/shared-types`, `packages/config`, `packages/database`); **pnpm** as package manager with pnpm workspaces; **Turborepo** for task orchestration/caching; **Docker Compose** running only Postgres and Redis locally (apps run natively, not containerized, for local dev); a root `.env.example` with per-app git-ignored `.env` files and startup-time env validation in NestJS; a single shared **ESLint + Prettier** config in `packages/config`; **Husky + lint-staged** for pre-commit hooks (full type-checking/tests deferred to CI); a shared `tsconfig.base.json` with `strict: true` from day one; and a trunk-based workflow with conventional commits and self-reviewed PRs.
- **Alternatives considered**: (1) Separate repos per app instead of a monorepo. (2) npm or yarn instead of pnpm. (3) No monorepo task tooling, or Nx instead of Turborepo. (4) Containerizing the Next.js/NestJS apps themselves in local Docker Compose. (5) Partial/incremental TypeScript strictness instead of `strict: true` from the start.
- **Reasoning**: These are the choices that are painful to reverse later (repo layout, package manager, strictness level), unlike app-level code which can be refactored incrementally. A monorepo is justified specifically because the frontend and backend share domain types (`Turn`, `Attempt`, `Question`, etc. from `DOMAIN_MODEL.md`) that need to stay in sync via a shared package rather than drifting across separate repos. pnpm and Turborepo were chosen for their monorepo-specific efficiency (deduplicated installs, build caching) over heavier (Nx) or less monorepo-native (npm/yarn classic) alternatives. Docker Compose is scoped to stateful services only, since containerizing the apps themselves would slow down local hot-reload iteration for no local-dev benefit. Strict TypeScript from day one avoids a much more painful retrofit once the codebase grows.

### Board is a shared template, not per-game; single template per mode/length for MVP
- **Decision**: `Board` is modeled as a shared, reusable structure (`Game` references a `Board`, rather than each `Game` owning its own copy of `Tile`s). For MVP, there is exactly one `Board` template per mode/length (e.g., one Quick Match layout, one World Tour layout) — not a per-game-generated board, and not yet multiple randomized templates.
- **Alternatives considered**: (1) Per-Game Board, where every game gets its own owned copy of tiles. (2) Multiple randomized Board templates per mode/length from day one.
- **Reasoning**: A shared board avoids duplicating tile data per game and allows rebalancing a board layout by versioning the template rather than migrating every existing game's copy. This also matches what `DOMAIN_MODEL.md` already implied ("shared structure across games of the same mode/length"). Multiple randomized templates per mode/length are a real future replayability lever (a single fixed board gets stale quickly), but are deferred to Phase 2/3 rather than MVP, to avoid scope creep — MVP ships with one template per mode/length.

### Attempt is a single polymorphic entity, with an enforced mutual-exclusivity invariant
- **Decision**: `Attempt` remains a single table/entity (not split into `CountryAttempt`/`QuestionAttempt`), with `challengeType` distinguishing the two cases, and nullable `countryId` / `questionId` fields. A hard invariant is enforced (via a database check constraint where practical, otherwise in the service layer) that `challengeType = country_guess` requires `countryId` set and `questionId` null, and `challengeType = question` requires the reverse.
- **Alternatives considered**: Splitting into separate `CountryAttempt` and `QuestionAttempt` entities.
- **Reasoning**: `DOMAIN_MODEL.md` intentionally describes `Attempt` as one concept with a `challengeType`, not two; splitting would contradict that framing without a concrete benefit at this scale. The added invariant exists so the polymorphism is enforced, not merely conventional — nothing in a plain nullable-pair schema otherwise prevents a bad write from setting both fields or neither.

### Category is confirmed as a table, not an enum
- **Decision**: `Category` is implemented as its own database table/entity, not a code-level enum.
- **Alternatives considered**: Implementing `Category` as an enum.
- **Reasoning**: `DOMAIN_MODEL.md` already defines `Category` as an entity that `Question`s belong to and `Tile`s reference — this is closer to a table than an enum, so this was effectively already decided by the existing domain model rather than being a new open question.

### Question-to-Country relationship is an optional single foreign key, not required and not many-to-many
- **Decision**: `Question` has an optional (nullable) single `countryId` foreign key to `Country`. Not every question is required to reference a country, and for MVP a question references at most one country.
- **Alternatives considered**: (1) Requiring every `Question` to reference exactly one `Country`. (2) A many-to-many `Question` ↔ `Country` join table to support questions that genuinely reference multiple countries (e.g., "Which mountain range separates Europe and Asia?" or "Which two countries share the longest land border?").
- **Reasoning**: Many questions (continent-level, ocean-level, or comparative "which country has the highest GDP" questions) don't naturally belong to a single country, so a required relationship would distort the data model. A many-to-many join table is the more complete modeling for genuinely multi-country questions, but nothing in the current design (filtering, stats, adaptive difficulty) yet depends on reliably finding all questions touching a given country — so it's deferred as an open item rather than built now. If a future feature needs that guarantee, this is the trigger to introduce the join table.

### Category taxonomy is fixed; AI operates within categories, not on the taxonomy
- **Decision**: The category set is a small, fixed, human-curated taxonomy of five categories: Countries & Continents, Physical Features, Culture & Society, Visual Landmarks, and Current Events. AI's role is limited to (a) generating/refreshing *question content* within these categories (especially Current Events, on a schedule) and (b) adaptive difficulty weighting across them. AI does not add, remove, or reshape the category taxonomy itself at runtime. Any future taxonomy change (new categories, splits, renames) is a deliberate design-time decision, made by a person and logged here — not a live/automated feature.
- **Alternatives considered**: (1) Sticking strictly to the original physical board game's four categories unchanged. (2) Letting AI dynamically reshape the category taxonomy over time based on player engagement data.
- **Reasoning**: A dynamically AI-reshaped taxonomy would conflict with two existing principles: "the game must remain fully playable without AI" and "the spinner presents challenges, it does not generate them" — categories are structural content groupings, and letting them change live would make core game structure (adaptive difficulty weights, per-category stats, UI labels) a moving target dependent on AI. A fixed taxonomy, refreshed in content rather than structure, gets the "the game should feel alive, not static" quality that was actually being sought, without the architectural cost of a dynamic taxonomy.

### "People & Places" renamed to "Culture & Society" and narrowed in scope
- **Decision**: The original board game's "People & Places" category is renamed to "Culture & Society" and narrowed to focus on traditions, customs, and cultural practices tied to a place (festivals, cuisine, art forms, etc.), rather than a broad mix of demographics, nicknames, languages, and government facts. Questions about named living/recent public figures are excluded from MVP scope.
- **Alternatives considered**: (1) Keep "People & Places" as-is, broad and mixed. (2) Split into two categories: "Notable People" (historical figures) and "Culture & Traditions."
- **Reasoning**: Sample questions were drafted for all three options before deciding. "People & Places" as originally scoped reads as a grab-bag with no clear throughline (e.g., a population-statistics question next to a city-nickname question). The narrower "Culture & Society" framing produces a more distinctive, coherent category. Splitting into two categories was considered attractive (doubles adaptive-difficulty granularity, gives the spinner more distinct categories) but was deferred: it doubles the content-seeding and maintenance burden before MVP, and a "Notable People" category raises nontrivial content-safety questions around which public figures are safe/apolitical to ask about — better tackled post-MVP with real engagement data than rushed into initial scope.

### Turn and Attempt are the source of truth for gameplay history
- **Decision**: `Turn` (and `Attempt` within it) are first-class, persisted domain entities that serve as the canonical record of what happened during a game. Player statistics, adaptive difficulty inputs, achievements, and analytics are all *derived* from this history rather than maintained as independently updated primary records.
- **Alternatives considered**: (1) No persisted `Turn` entity at all — only directly updating aggregate fields on `PlayerStat` per turn. (2) Persisting `Turn` but treating it as an analytics table rather than a domain entity.
- **Reasoning**: `Turn`/`Attempt` exist because they are part of the domain — they represent what actually happened in a game — not because they're convenient for analytics. Deriving stats from this history (rather than updating aggregates directly) means definitions of stats (e.g., "accuracy") can change and be recomputed from history, instead of aggregates being permanently locked to whatever logic was live when they were written. Framing the question as "what is the source of truth for gameplay history" (rather than "should we persist Turn") produced a stronger, more explainable architecture.

### Turn persistence policy is determined by Game Mode, not applied uniformly
- **Decision**: Whether `Turn`/`Attempt` history is persisted depends on the game's mode, not a single global rule:

| Mode | Persist Turn/Attempt History? |
| :---- | :---- |
| Solo | Yes |
| Vs. AI Bot | Yes |
| Private Room | Yes |
| Ranked Online | Yes |
| Local Pass-and-Play | No (MVP default; may become configurable post-MVP) |

  A `Game` row is still created for Local Pass-and-Play (it needs an ID to coordinate realtime state and to show a winner at the end) — it's specifically the `Turn`/`Attempt` history underneath it that isn't written.
- **Alternatives considered**: (1) Persisting Turn/Attempt history uniformly for all modes, including Local. (2) Never persisting Turn/Attempt at all, relying only on in-memory state plus aggregate stat updates.
- **Reasoning**: Local Pass-and-Play involves multiple people sharing one device with no accounts attached to individual turns (e.g., four friends passing an iPad). There's no long-term value in permanently storing detailed turn-by-turn history for sessions with no persistent player identity attached, so it's treated closer to an incognito session. Modes involving accounts, AI learning, replay value, or competitive integrity (Solo, AI Bot, Private Room, Ranked) all benefit from persisted history, so they default to on. Write volume is not a meaningful concern at expected scale (rough math: 20 turns/game × 10,000 games/day ≈ 200,000 inserts/day, which Postgres handles trivially) — the decision is driven by whether the data has long-term value, not by storage or write cost.

### The game must remain fully playable without AI
- **Decision**: AI (question freshness generation, adaptive difficulty tuning, AI bot opponent) enhances gameplay but never owns the game rules. The game engine is authoritative and must function correctly with AI features degraded, unavailable, or disabled.
- **Alternatives considered**: Allowing AI systems to be a hard dependency for certain modes or mechanics.
- **Reasoning**: This is stated as an explicit rule (not just an implicit consequence of the batch-generation approach) so it can act as a test for future feature ideas: if a proposed feature would break the game when AI is unavailable, that's a signal the feature is designed wrong, not just an acceptable risk.

### The spinner presents challenges; it does not generate them
- **Decision**: The spinner's responsibility is limited to selection and presentation (deciding which country/category comes up next). It does not generate question content, determine correctness, or own game rules — that responsibility belongs to the question bank and game engine respectively.
- **Alternatives considered**: Allowing the spinner component to also own or generate challenge content directly.
- **Reasoning**: Keeping this boundary explicit separates game logic from presentation, allowing country selection, movement assignment, and future personalization (e.g., adaptive difficulty) to evolve independently of how the spinner itself is presented or animated.

### Project renamed from "World Safari" to "GeoQuest AI"
- **Decision**: The product is named GeoQuest AI going forward. "World Safari" remains the name of the original physical board game that inspired this project, and is still referenced as such in `GAME_DESIGN.md`.
- **Alternatives considered**: Keeping "World Safari" as the product name.
- **Reasoning**: "World Safari" is the name of an existing physical board game, which risks naming-overlap confusion. "GeoQuest AI" is distinctive, clearly communicates the geography + AI focus, and reflects that AI (question freshness, adaptive difficulty, AI opponent) is a core differentiator rather than a bolted-on feature.

### AI questions generated in batch, not live per-turn
- **Decision**: A scheduled backend job uses an LLM to generate/refresh "current" trivia questions, stored in Postgres like any other question, with spot-checking before going live.
- **Alternatives considered**: Calling an LLM live during gameplay to generate each question on demand.
- **Reasoning**: Live generation risks hallucinated facts (wrong capitals, figures) reaching players directly, and adds latency/cost per question, per player, per turn. Batch generation is cheaper, allows human review, and keeps grading deterministic since answers stay multiple choice.

### Multiple choice questions, not free text
- **Decision**: All questions are multiple choice.
- **Alternatives considered**: Free-text answers graded by an LLM.
- **Reasoning**: Deterministic grading, cheaper, no extra failure point from an LLM interpreting free-text correctness.

### Drop the color-coded spinner/map mechanic from the original board game
- **Decision**: The map shows outlined country borders only; players choose the correct country from a small set of highlighted candidates instead of matching spinner slice colors to map fill colors.
- **Alternatives considered**: Recreating the original board game's four-color spinner-to-map-fill matching system.
- **Reasoning**: The color mechanic works on a shared physical board but doesn't translate to screen UI — it forces memorizing an arbitrary legend and adds no educational value. Multiple-choice-on-map is easier to build (no click-precision-on-SVG logic), scales difficulty naturally (2 vs 6 candidate choices), and works identically on mobile touch and desktop.

### Phased build order: MVP first, AI opponent and online matchmaking later
- **Decision**: Build order is (1) solo play + local pass-and-play multiplayer, (2) private rooms + telemetry, (3) AI bot opponent + adaptive difficulty + online matchmaking.
- **Alternatives considered**: Building all modes (solo, AI bot, local, private rooms, online matchmaking) in parallel from the start.
- **Reasoning**: Skill-rating systems and matchmaking queues are nontrivial (rating algorithm, queue management, disconnect/reconnect handling, server-authoritative state). Building everything at once risks stalling. A phased approach gets the core loop solid before layering on the harder systems.

### Adaptive difficulty uses weighted random selection, not hard category swapping
- **Decision**: Category question distribution shifts gradually based on player performance (e.g., a weak category's selection probability might shift from ~25% baseline toward ~35-40%), rather than forcing an overwhelming share of questions from weak categories.
- **Alternatives considered**: Hard rule-based swapping (e.g., "always ask 2x as many questions from the weak category").
- **Reasoning**: Aggressive overcorrection can feel punishing rather than helpful. Weighted randomness keeps the game feeling fair while still reinforcing weak areas.

### Randomized country subset per game, with two size modes
- **Decision**: Games can use a randomized subset of countries rather than always using the full pool; proposed as "Quick Match" (smaller subset) vs. "World Tour" (full pool).
- **Alternatives considered**: Always using the full ~195-country pool.
- **Reasoning**: Improves replayability, gives a natural difficulty/length lever, and avoids uneven map-art/question-density design work across all countries at once.

### Tech stack carried over from existing prior work, with Redis added
- **Decision**: Continue with Next.js, NestJS, PostgreSQL, Prisma, NextAuth, Socket.IO, Redux Toolkit (all prior experience), and add Redis for matchmaking/session state, plus an LLM provider API for AI question generation.
- **Alternatives considered**: Restarting the stack from scratch with different technology choices.
- **Reasoning**: The existing stack is already familiar and partially built (per prior work using Next.js, NestJS, PostgreSQL, Bruno). Redis is a natural, well-understood addition for the realtime/matchmaking needs described in the game design, without introducing unfamiliar paradigms.

### Versioning and release strategy
- **Decision**: Use git tags from v0.1.0 through v0.9.x for pre-MVP milestones, with v1.0.0 marking MVP completion (solo + local multiplayer core loop). Post-1.0 follows standard semver. Each tag gets a corresponding GitHub Release with a full markdown write-up (Overview, What's Included, Decisions Made, Known Gaps, Next Milestone).
- **Alternatives considered**: Informal commit-based progress tracking without tagged releases.
- **Reasoning**: Tagged releases with structured write-ups keep scope honest release-to-release and make the project feel like a real shipped product rather than an ongoing untracked repo.

### Design/planning work and implementation work are kept in separate spaces
- **Decision**: Design discussions, documentation, and decision-making happen in a Claude Project (chat mode); actual code implementation happens in separate sessions/chats within that Project, with docs (`GAME_DESIGN.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `ROADMAP.md`) as shared knowledge base context.
- **Alternatives considered**: Doing all design and implementation in a single ongoing chat; using Claude Code exclusively.
- **Reasoning**: Claude Code requires a paid plan (Pro or API credits) which is not currently in use. A single long-running chat also risks context bloat and degraded responsiveness over time. Separating persistent documentation (via a Claude Project's knowledge base) from individual implementation chats keeps context available without needing to re-explain decisions each time.
