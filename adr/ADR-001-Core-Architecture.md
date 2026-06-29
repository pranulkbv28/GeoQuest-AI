# ADR-001: Core Architecture

> **Status:** Accepted  
> **Date:** 2026-06-29  
> **Decision Makers:** GeoQuest AI Team

## Context

GeoQuest AI is being developed as a production-quality multiplayer geography game while also serving as a long-term engineering project for learning:

- Software Engineering
- Backend Engineering
- AI Engineering
- Data Engineering
- DevOps
- System Design

The project is expected to evolve significantly over time. Therefore, maintainability, scalability, and separation of concerns are considered more important than rapid implementation.

---

## Decision

The application will be designed around **business capabilities** rather than technologies or frameworks.

The initial business capabilities are:

- Identity
- Lobby
- Gameplay
- Geography
- Challenge
- Notifications
- Analytics
- Configuration

Future capabilities may include:

- Administration
- Matchmaking
- Tournament Management
- Social Features

Each capability owns a clearly defined responsibility and communicates with other capabilities through well-defined interfaces.

---

## Architectural Principles

### Gameplay First

Gameplay is the primary concern of the platform.

Every architectural decision should prioritize gameplay correctness over implementation convenience.

---

### Deterministic Game Logic

Game logic must always be deterministic.

Given the same:

- Game seed
- Player actions
- Rule set

the game should always produce the same result.

Business logic must never depend directly on an AI provider.

---

### AI as a Supporting Capability

Artificial Intelligence enhances gameplay but never controls it.

AI is responsible for:

- Question generation
- Answer evaluation
- Explanations
- Difficulty adaptation

AI is **not** responsible for:

- Turn order
- Player movement
- Scoring
- Victory conditions
- Match progression

Gameplay communicates only with the Challenge capability.

The Challenge capability communicates with AI providers.

---

### Separation of Responsibilities

Each business capability owns one business concern.

Examples include:

| Capability | Responsibility |
| :--------- | :------------- |
| Identity | Users, authentication and sessions |
| Lobby | Rooms and match creation |
| Gameplay | Match flow and game rules |
| Geography | Countries and map validation |
| Challenge | Challenge generation and evaluation |
| Notifications | Real-time communication |
| Analytics | Gameplay events and reporting |
| Configuration | Game configuration and feature flags |

---

### Event-Driven Thinking

Gameplay produces events.

Other capabilities consume those events without tightly coupling themselves to gameplay.

This architecture enables future support for:

- Analytics pipelines
- Notifications
- Audit logs
- Replay systems
- Data engineering workflows

---

### Production Mindset

Whenever production-grade infrastructure is beyond the current scope of the project, the team will:

1. Implement the simplest correct solution.
2. Document the production alternative.
3. Record the trade-offs.
4. Avoid premature optimization.

---

## Consequences

### Benefits

- Clear ownership boundaries
- High maintainability
- Easier automated testing
- Framework independence
- AI provider independence
- Future scalability
- Cleaner long-term architecture

### Trade-offs

- More upfront design effort
- Slightly slower initial development
- More abstraction than a typical hobby project

These trade-offs are considered acceptable because the project's primary objective is long-term quality rather than rapid delivery.

---

## Future ADRs

This ADR defines the architectural foundation of GeoQuest AI.

Future decisions will be documented in separate ADRs rather than modifying this document.

Planned ADRs include:

- ADR-002: Technology Stack
- ADR-003: Monorepo Structure
- ADR-004: Gameplay Architecture
- ADR-005: AI Gateway
- ADR-006: Event System
- ADR-007: Caching Strategy
- ADR-008: Data Pipeline
- ADR-009: Deployment Strategy

---

## References

Related documents:

- [`docs/TechStack.md`](../docs/TechStack.md)
- [`architecture/DomainModel.md`](../architecture/DomainModel.md)

This ADR should be read before implementing any new business capability or major architectural change.
