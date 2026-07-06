# GeoQuest AI — Roadmap

## Overview

This roadmap outlines the phased path from current state to a shipped MVP (v1.0.0) and beyond, following the versioning strategy in `DECISIONS.md`. Each phase corresponds to a range of tagged releases.

## Versioning Convention

- `v0.1.0` – `v0.9.x`: pre-MVP, incremental milestones
- `v1.0.0`: MVP complete
- Post-1.0: standard semver (patch = fixes, minor = features, major = breaking changes)

## Phase 1 — Foundation (targeting v0.1.0 – v0.3.x)

- **Repository & infrastructure setup** (v0.1.0): monorepo structure, pnpm + Turborepo, Docker Compose (Postgres + Redis), env variable strategy, shared ESLint/Prettier/tsconfig, Husky + lint-staged — see `ARCHITECTURE.md`: Repository & Infrastructure Setup and `DECISIONS.md`. Completed before app scaffolding so later work builds on a stable, unchanging base.
- Project scaffolding: Next.js frontend, NestJS backend, PostgreSQL + Prisma, environment config.
- Core data models: `User`, `Country`, `Question`, `Game`, `GamePlayer`, `Turn`, `Attempt` (see `DOMAIN_MODEL.md`).
- Implement mode-based Turn/Attempt persistence policy (persist for Solo, AI Bot, Private Room, Ranked; skip for Local Pass-and-Play — see `DECISIONS.md`).
- Static question bank seeded manually (no AI generation yet).
- Basic spinner + map UI with outlined borders and multiple-choice country selection.
- Core single-device game loop: spin, guess, question, move, win condition.

## Phase 2 — Solo Experience (targeting v0.4.0 – v0.5.x)

- Solo play mode (no AI bot) fully playable start to finish.
- Passive play-style telemetry: accuracy, response time, weak categories/countries logged per player.
- Streak bonus mechanic.
- Special tiles: Spin Again, Double Reward.
- Randomized country subset selection (Quick Match vs. World Tour).

## Phase 3 — Local & Private Multiplayer (targeting v0.6.0 – v0.7.x)

- Local pass-and-play multiplayer (same device).
- Private rooms via Socket.IO (multi-device, invite-based).
- Basic telemetry continues to log during multiplayer, without AI-driven adaptation yet (per design: AI adaptation is minimized in these casual modes).

## Phase 4 — MVP Completion (targeting v0.8.0 – v1.0.0)

- Polish pass on core loop, UI/UX, and bug fixes across solo + local + private modes.
- `v1.0.0` marks MVP: solo play + local multiplayer, core loop fully working end-to-end, considered ready for real users.

## Phase 5 — AI & Competitive Systems (post-MVP, v1.x)

- Scheduled AI question-refresh job (batch-generated "current events" category, with spot-check review flow).
- Adaptive difficulty and weighted category distribution in single-player.
- AI bot opponent calibrated to player skill rating.
- Skill rating system design and implementation.
- Online matchmaking (starting with 1v1; 2v2 as an open discussion item).

## Deferred / Open Discussion

- 2v2 (or larger) online multiplayer formats.
- Additional special tiles beyond Spin Again / Double Reward (e.g., Swap Positions, Skip a Turn, Steal a Category).
- Migration to managed Redis, dedicated WebSocket infrastructure, or higher-tier LLM usage — to be revisited if/when free-tier infrastructure is outgrown.

## How This Roadmap Is Used

- Each phase's completion is expected to correspond to one or more tagged releases (see `DECISIONS.md` for the release/versioning process).
- This document should be updated as priorities shift — if a phase's scope changes, note it here and log the reasoning in `DECISIONS.md`.
