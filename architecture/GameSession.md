# Game Session

## Purpose

This document defines the Game Session, the central business object of GeoQuest AI.

A Game Session represents a single playable instance of the game. Every action performed by a player belongs to exactly one Game Session.

The Game Session is the heart of GeoQuest AI and coordinates gameplay by interacting with the Geography, AI and Users capabilities.

This document defines:

- What a Game Session contains.
- How a Game Session progresses.
- Which capabilities it depends on.
- What responsibilities belong inside a Game Session.

This document intentionally avoids implementation details such as database schemas, NestJS modules or API contracts.

---

## Game Session Lifecycle

```text
Player Starts Game
        │
        ▼
Create Game Session
        │
        ▼
Generate Game Configuration
        │
        ├── Select Countries
        ├── Generate Board
        └── Configure Rules
        │
        ▼
Game Begins
        │
        ▼
Gameplay Loop
        │
        ├── Spin
        ├── Locate Country
        ├── Move
        ├── Land On Tile
        ├── Generate Challenge
        └── Evaluate Answer
        │
        ▼
Victory Condition Met
        │
        ▼
Game Ends
        │
        ▼
Persist Results
```

---

## Game Session Responsibilities

A Game Session owns:

- Current game state
- Selected game mode
- Participating players
- Current turn
- Selected country pool
- Board state
- Player positions
- Score tracking
- Session status
- Rule configuration
- Random seed

A Game Session does **not** own:

- Country information
- User profiles
- Authentication
- AI prompts
- Question generation
- Application configuration

---

## Capability Interactions

| Capability | Interaction |
| :----------- | :------------ |
| Geography | Provides countries and validates map interactions. |
| AI | Generates and evaluates challenges during gameplay. |
| Users | Provides player identity and long-term progression. |
| Infrastructure | Persists session data and provides supporting services. |

The Game Session orchestrates gameplay but never owns the responsibilities of supporting capabilities.

---

## Gameplay Flow

A Game Session follows the same sequence regardless of game mode.

```text
Start Turn

↓

Spin

↓

Country Selected

↓

Player Locates Country

↓

Location Validated

↓

Move Across Board

↓

Determine Tile

↓

Generate Challenge

↓

Player Answers

↓

Evaluate Answer

↓

Correct?
 ├── Yes → Continue Turn
 └── No  → End Turn

↓

Next Player / Next Turn

↓

Victory Check
```

---

## Game Modes

A Game Session supports multiple gameplay modes.

| Mode | Description |
| :----- | :------------ |
| Single Player | One player competes against the game with adaptive gameplay. |
| Local Multiplayer | Multiple players share a single device. |
| Private Rooms | Players join a shared room using a room code. |
| Public Matchmaking | Players are automatically matched with others of similar skill. |

Every mode follows the same gameplay rules.

Only the session creation process differs.

---

## Single Player

Single Player is designed to maximize learning.

The game may adapt using player history to:

- Select country pools
- Adjust challenge difficulty
- Recommend learning opportunities
- Personalize gameplay

Gameplay rules remain deterministic.

AI enhances the experience but never controls it.

---

## Multiplayer

Multiplayer prioritizes fairness over personalization.

All participants receive the same:

- Board
- Country pool
- Challenges
- Rule configuration

Adaptive gameplay is disabled to ensure competitive integrity.

Future multiplayer modes may introduce configurable room settings without changing gameplay rules.

---

## Design Principles

### Gameplay First

Every Game Session exists to deliver an enjoyable gameplay experience.

### Deterministic Rules

Game rules must always produce the same outcome when provided with the same inputs.

### Capability Separation

The Game Session coordinates business capabilities without assuming ownership of their responsibilities.

### AI Assists Gameplay

AI enhances gameplay but never determines game rules, scoring or player movement.

---

## Future Evolution

Future versions of the Game Session may introduce:

- Saved games
- Spectator mode
- Replay system
- Tournament support
- Seasonal events
- Power-ups
- Custom rule sets

These features should extend the Game Session without violating the architectural principles defined in ADR-001.

---

## Notes

The Game Session is the primary business object of GeoQuest AI.

While supporting capabilities provide data and services, the Game Session is responsible for coordinating the complete gameplay experience.

All gameplay-related APIs should be designed around the Game Session rather than individual supporting capabilities.
