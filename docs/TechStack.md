# Tech Stack

> **Version:** 1.0  
> **Status:** Accepted  
> **Last Updated:** 2026-06-29

## Philosophy

Technology choices in GeoQuest AI are driven by product architecture and long-term engineering goals rather than popularity alone.

GeoQuest AI has two primary objectives:

1. Build a production-quality multiplayer geography game.
2. Serve as a long-term engineering project for learning:
   - Software Engineering
   - Backend Engineering
   - AI Engineering
   - Data Engineering
   - DevOps
   - System Design

Whenever possible, the project will implement a free or open-source solution while documenting the production-grade alternative.

---

## Monorepo

| Technology | Purpose |
| :--------- | :------ |
| Turborepo | Monorepo management |

### Why Turborepo?

A monorepo allows us to:

- Share code between applications
- Share TypeScript types
- Share UI components
- Share configuration
- Improve build performance through caching

Future applications may include:

- Web
- Admin Dashboard
- Mobile
- Documentation Site

---

## Frontend

| Technology | Purpose |
| :--------- | :------ |
| Next.js | React Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| TanStack Query | Server State Management |
| Socket.IO Client | Real-time Multiplayer |

### Why Next.js?

Next.js provides:

- Server-side rendering
- Client-side rendering
- API integration
- Excellent TypeScript support
- Strong developer ecosystem

---

## Backend

| Technology | Purpose |
| :--------- | :------ |
| NestJS | Backend Framework |
| TypeScript | Shared Language |

### Why NestJS?

NestJS provides:

- Dependency Injection
- Modular architecture
- Guards
- Interceptors
- Middleware
- Enterprise project structure

The framework closely resembles enterprise backend development and aligns well with object-oriented design principles.

---

## Database

| Technology | Purpose |
| :--------- | :------ |
| PostgreSQL | Primary Database |
| Prisma | ORM & Schema Management |

### Why PostgreSQL?

GeoQuest AI models highly relational data, including:

- Players
- Rooms
- Matches
- Turns
- Boards
- Countries
- Leaderboards

A relational database is the most appropriate choice for these relationships.

---

## Caching

| Technology | Purpose |
| :--------- | :------ |
| Redis | Caching, Sessions, Room State, Rate Limiting |

Redis will only be introduced when a genuine performance or scalability requirement exists.

Future use cases include:

- Session storage
- Room state
- Active matches
- AI response caching
- Leaderboards

---

## Authentication

The authentication strategy will be finalized in a future ADR.

Current candidates include:

- Better Auth
- Auth.js

Selection criteria:

- TypeScript support
- Flexibility
- Self-hosting
- Integration with NestJS and Next.js

---

## Realtime Communication

| Technology | Purpose |
| :--------- | :------ |
| Socket.IO | Multiplayer Synchronization |

### Why Socket.IO?

Socket.IO provides:

- Reliable communication
- Automatic reconnection
- Room support
- Event-driven messaging

---

## Artificial Intelligence

GeoQuest AI communicates with language models through an internal AI Gateway.

The Gameplay capability must **never** communicate directly with an AI provider.

Future supported providers include:

- OpenAI
- Gemini
- Claude

The architecture will also support future experimentation with:

- Council of LLMs
- Semantic Caching
- Prompt Versioning
- AI Evaluation Pipelines

---

## Data Engineering

Python will be used for future analytics and data pipelines.

Planned areas include:

- Event Processing
- ETL Pipelines
- Analytics
- Reporting
- Dashboards
- Data Validation

---

## Testing

Testing tools:

- Jest
- Vitest
- Playwright

Testing philosophy:

- Business logic is tested first.
- UI behaviour is tested where necessary.
- Critical gameplay logic should always have automated tests.

---

## DevOps

Current tools:

- Docker
- GitHub Actions

Future technologies (documentation only):

- Kubernetes
- OpenTelemetry
- Prometheus
- Grafana

These technologies will only be introduced when they solve a real engineering problem.

---

## Documentation

GeoQuest AI follows a documentation-first philosophy.

Project documentation includes:

- Markdown
- Mermaid diagrams
- Architecture Decision Records (ADRs)
- Production Notes
- Learning Notes

Every document should explain:

- What decision was made
- Why it was made
- Alternatives considered
- Trade-offs accepted

---

## Guiding Principles

The technology stack follows these principles:

- Architecture drives technology
- Gameplay is deterministic
- AI enhances gameplay but never controls it
- Technologies must solve real problems before being introduced
- Simpler solutions are preferred until scalability requires otherwise
- Production-grade alternatives should always be documented, even if they are not implemented

---

## Future Technologies

The following technologies are intentionally deferred until they solve a real problem:

- RabbitMQ
- Apache Kafka
- Kubernetes
- Vector Databases
- OpenTelemetry
- Prometheus
- Grafana
- AI Council Architecture

These technologies are considered future engineering milestones rather than MVP requirements.
