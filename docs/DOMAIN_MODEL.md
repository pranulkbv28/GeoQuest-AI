# GeoQuest AI — Domain Model

## Purpose

This document defines the core concepts of GeoQuest AI and how they relate to one another. It is the bridge between design (`GAME_DESIGN.md`) and implementation (Prisma schema, NestJS modules). It intentionally does not duplicate code, API shapes, or field-level schema detail — those live in `ARCHITECTURE.md` and the actual codebase. This document answers one question: **what are the concepts of the game, and how do they relate?**

## Core Concepts

### Game

A single instance of play, from creation to a win condition (or termination). Has a mode (Solo, Vs. AI Bot, Local Pass-and-Play, Private Room, Ranked Online), a country pool, and a set of players. A `Game` row exists for every game regardless of mode — including Local Pass-and-Play — even when detailed history underneath it isn't persisted (see Persistence Policy below).

### Player

A participant in a `Game`. May be a registered `User`, an anonymous local participant (Local Pass-and-Play), or an AI-controlled bot. Represented within a game as a `GamePlayer` — the same `User` can be a `GamePlayer` in many different games over time.

### Turn

A single unit of play belonging to one `GamePlayer` within a `Game`: the sequence of spinning, resolving a country guess, and (if applicable) resolving a category question, ending with the player's position being updated and the turn passing on (or continuing, e.g. after a Streak Bonus or Spin Again tile). `Turn` is a first-class domain entity, not merely a UI concept — see `DECISIONS.md` for why it is treated as the source of truth for gameplay history.

### Attempt

A single challenge-response cycle within a `Turn`. A `Turn` can contain more than one `Attempt`: one for the country-guess challenge (identifying the spun country among highlighted map candidates), and, if the player lands on a category tile, another for the resulting trivia `Question`. Modeled generically with a `challengeType` (`country_guess` | `question`) rather than as separate entities per challenge type, so both cases share the same shape (challenge presented, response given, correctness, time taken). The relationship to `Country` vs. `Question` is mutually exclusive based on `challengeType`, and this invariant is enforced rather than merely conventional (see `DECISIONS.md`).

### Board

A shared, reusable template of `Tile`s that games of a given mode/length are played on — a `Game` references a `Board`, rather than owning its own copy of tiles. For MVP, there is exactly one `Board` template per mode/length (e.g., one Quick Match layout, one World Tour layout); multiple randomized templates per mode/length are a deferred future replayability lever, not MVP scope (see `DECISIONS.md`).

### Spinner

The mechanism that selects the next challenge for a `Turn` — a country (for the guess challenge) or, indirectly, a category (via which `Tile` the player lands on). The Spinner's responsibility is limited to selection and presentation; it does not generate question content or determine correctness (see `DECISIONS.md`: "The spinner presents challenges; it does not generate them").

### Tile

A single space on the `Board`. Has a type: a category tile (triggers a `Question` from that `Category`), or a special tile (`Spin Again`, `Double Reward`, and potential future tiles like `Swap Positions`, `Skip a Turn`, `Steal a Category`).

### Question

A single trivia question belonging to a `Category`, with multiple-choice answer options, and an optional reference to a single `Country`. May be statically authored or AI-generated via the scheduled batch refresh job (see `GAME_DESIGN.md`: AI Integration Points). Answered as part of an `Attempt`. Not every question references a country (e.g., continent-level or comparative questions); questions that genuinely span multiple countries are handled by leaving this reference unset for MVP rather than a many-to-many relationship (see `DECISIONS.md`). Uses a soft-delete policy so that a retired question doesn't invalidate historical `Attempt` records that reference it (see `ARCHITECTURE.md`: Database Conventions).

### Category

A grouping of `Question`s. Fixed, curated taxonomy of five categories (Countries & Continents, Physical Features, Culture & Society, Visual Landmarks, Current Events) — see `GAME_DESIGN.md`: Category Taxonomy for the full definitions and naming rationale. Used both to organize the question bank and as the basis for adaptive difficulty's weighted category distribution. The taxonomy itself is fixed at design time, not generated or reshaped by AI at runtime (see `DECISIONS.md`).

### Country

A single country in the game's country pool, used both as the subject of the country-guess challenge and as a possible topic for `Question`s. A `Game`'s country pool is a randomized subset (Quick Match) or the full set (World Tour) selected at game creation.

## Derived Concepts (not primary entities)

These are computed from the entities above, not stored as independent primary records (see `DECISIONS.md`: Turn/Attempt as source of truth):

- **PlayerStat**: aggregated accuracy, response time, and category strength/weakness, derived from a player's historical `Turn`/`Attempt` records.
- **Skill Rating**: a single score derived from `PlayerStat` history, used to calibrate the AI Bot opponent and drive online matchmaking.
- **Adaptive Difficulty Weights**: per-category selection probabilities for a given player, derived from `PlayerStat`, consumed by the Spinner/question-selection logic at the start of each `Turn`.

## Relationships

| Entity | Relates To | Nature of Relationship |
| :---- | :---- | :---- |
| Game | Player (via GamePlayer) | One `Game` has many `GamePlayer`s |
| Game | Board | Many `Game`s reference one shared `Board` template (one per mode/length for MVP) |
| Game | Country | One `Game` has a country pool (many `Country` records) |
| GamePlayer | Turn | One `GamePlayer` has many `Turn`s across a `Game` |
| Turn | Attempt | One `Turn` has one or two `Attempt`s (country-guess, and optionally a question) |
| Attempt | Question | An `Attempt` of type `question` references one `Question` (mutually exclusive with Country, enforced) |
| Attempt | Country | An `Attempt` of type `country_guess` references one `Country` (mutually exclusive with Question, enforced) |
| Question | Category | Many `Question`s belong to one `Category` |
| Question | Country | A `Question` optionally references at most one `Country` for MVP (nullable, not required, not many-to-many) |
| Board | Tile | One `Board` has many `Tile`s in a fixed sequence |
| Tile | Category | A category `Tile` references one `Category` |
| PlayerStat | Turn / Attempt | Derived from a player's historical `Turn`/`Attempt` records (not a direct foreign-key relationship — a computed projection) |
| Skill Rating | PlayerStat | Derived from `PlayerStat` history |

## Persistence Policy (Cross-Reference)

Whether `Turn`/`Attempt` records are written to the database depends on `Game.mode`. This is a persistence/implementation decision, not a domain-modeling one, and is documented in full in `DECISIONS.md` ("Turn persistence policy is determined by Game Mode, not applied uniformly"). Summary: persisted for Solo, Vs. AI Bot, Private Room, and Ranked Online; not persisted for Local Pass-and-Play in MVP (a `Game` row still exists for Local, but no `Turn`/`Attempt` history underneath it).

## Open Questions

- Exact shape of `Attempt`'s `challengeType`-specific fields (e.g., how highlighted map candidates for a `country_guess` attempt are recorded) — to be resolved during Phase 1 schema work.
- Whether/when to introduce multiple randomized `Board` templates per mode/length (deferred past MVP — see `DECISIONS.md`).
- Whether a `Question` ↔ `Country` many-to-many join table becomes necessary once a feature requires reliably finding all questions touching a given country (deferred — see `DECISIONS.md`).
