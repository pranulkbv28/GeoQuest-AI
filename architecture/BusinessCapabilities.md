# Business Capabilities

## Purpose

This document defines the business capabilities of GeoQuest AI.

Business capabilities describe the responsibilities of the product rather than the technologies used to implement it. They establish ownership boundaries and help determine where business logic belongs.

This document answers four questions:

- What does each capability own?
- What is each capability responsible for?
- What is each capability explicitly **not** responsible for?
- How do the capabilities interact?

This document is expected to evolve throughout the lifetime of the project.

---

## Capability Overview

```text
GeoQuest AI

├── Geography
├── Gameplay
├── AI
├── Users
└── Infrastructure
```

---

## Capability Responsibilities

| Capability | Purpose | Owns | Does Not Own | Depends On |
| :----------- | :-------- | :----- | :------------- | :----------- |
| Geography | Provides the authoritative source of geographical information used by GeoQuest AI. | Countries, coordinates, country boundaries, map metadata, country validation, country selection. | Players, game sessions, questions, scores, turns, AI prompts. | None |
| Gameplay | Owns every rule that determines how a game starts, progresses and ends. | Game sessions, turns, board generation, spinner logic, player movement, scoring, win conditions, game modes. | Authentication, user accounts, geographic data, AI prompts. | Geography, AI, Users |
| AI | Enhances gameplay while keeping gameplay deterministic. | Question generation, answer evaluation, explanations, difficulty adaptation, player coaching, single-player personalization. | Game rules, scoring, movement, match progression, geographic data. | Users |
| Users | Manages player identity and long-term progression. | Authentication, profiles, statistics, achievements, preferences, saved progress. | Gameplay, geographic data, AI logic. | None |
| Infrastructure | Provides shared technical services required by every business capability. | Configuration, logging, persistence, monitoring, caching, external integrations, API versioning. | Business logic. | None |

---

## Capability Relationships

```text
                 Gameplay
               /     |     \
              /      |      \
             /       |       \
      Geography     AI      Users
             \       |       /
              \      |      /
             Infrastructure
```

Gameplay orchestrates the player experience.

Supporting capabilities provide services to Gameplay while remaining independent of gameplay rules.

---

## Architectural Principles

### Gameplay First

Gameplay is the primary business capability of GeoQuest AI.

Every architectural decision should improve the gameplay experience before improving implementation convenience.

### Separation of Responsibilities

Each capability owns a single business concern.

Business logic should always reside within the capability that owns that concern.

### AI Is an Enhancement

Artificial Intelligence exists to enhance gameplay.

It must never become responsible for enforcing gameplay rules.

### Geography Is Data

The Geography capability provides factual information.

Gameplay determines how those facts are used.

### Infrastructure Supports the Product

Infrastructure enables business capabilities.

Business capabilities must not become coupled to infrastructure-specific implementations.

---

## Future Evolution

Additional business capabilities may be introduced as GeoQuest AI grows.

Potential future capabilities include:

- Administration
- Matchmaking
- Notifications
- Analytics
- Tournament Management
- Social Features

A new capability should only be introduced when an existing capability begins to own multiple independent business concerns.

---

## Notes

Business capabilities are **not** equivalent to NestJS modules.

NestJS modules are implementation details.

Business capabilities describe the product itself and should remain valid even if the application is rewritten using a different technology stack.

The mapping between business capabilities and implementation modules is documented separately.
