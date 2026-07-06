# GeoQuest AI — Game Design

## Overview

GeoQuest AI is a web-based reimagining of the physical "World Safari" geography board game. Players move around a world map by spinning a spinner and answering geography questions, with AI used to keep questions current, adapt difficulty, and power a solo AI opponent. The project's goal is not a portfolio piece — it is meant to be shipped as a real, playable product.

## Design Philosophy

GeoQuest AI is designed around two independent educational challenges:

- **Spatial knowledge**: identifying locations on a world map.
- **General knowledge**: answering category-based questions (physical features, culture & society, visual landmarks, current events).

Learning is reinforced through repetition, adaptive difficulty, and replayability, rather than through explicit coaching or instruction.

Equally, GeoQuest AI is meant to work as a genuinely fun, competitive, social game first — the educational value comes from *wanting to keep playing*, not from the game feeling like a quiz with a scoreboard. Streaks, special tiles, multiplayer modes, and an AI opponent exist to make replaying and competing enjoyable in their own right. Educational intent and game-feel are treated as equally important design constraints: a mechanic that improves learning outcomes but makes the game less fun to return to is not a net win, and vice versa.

## Core Gameplay Loop

1. Player spins the spinner, which lands on a country name.
2. The player is shown an outlined, uncolored world map with a small set of highlighted candidate countries and must pick the correct one (multiple choice, not free-text and not color matching).
3. A correct pick moves the player's piece forward along the board path by a set number of steps.
4. Landing on a category space triggers a question from one of the five fixed categories (see Category Taxonomy below).
5. A correct answer moves the player forward again and grants another turn. A wrong answer reveals the correct answer and ends the turn.
6. First player to complete the board path (or the player furthest along when a time/turn limit is reached) wins.

## Category Taxonomy

The category set is fixed and curated, not dynamically generated or reshaped by AI at runtime (see `DECISIONS.md`: "Category taxonomy is fixed; AI operates within categories, not on the taxonomy"). Five categories, finalized:

1. **Countries & Continents**
2. **Physical Features**
3. **Culture & Society** — renamed from the original board game's "People & Places," narrowed to focus on traditions, customs, and cultural practices tied to a place (e.g., festivals, cuisine, art forms), rather than a broad mix of demographics, nicknames, and government facts. Deliberately excludes questions about named living/recent public figures to avoid political sensitivity; a dedicated "Notable People" category (historical figures) is a considered post-MVP addition, not part of MVP scope.
4. **Visual Landmarks**
5. **Current Events** — the one category whose *content* is continuously refreshed via the AI batch question-generation job (population shifts, recent elections, sports events, cultural moments tied to a country). The category itself is fixed; only its question content is kept fresh.

Categories are content groupings and a basis for adaptive difficulty weighting — they are not something the Spinner or any runtime system invents or removes. Changes to the taxonomy (adding, renaming, splitting categories) happen at design time and are logged as decisions, not as a live/automated feature.

## Map & Spinner Design

- The physical game's color-coded spinner/map linkage (matching slice colors to country colors) is **not** being carried over. It requires memorizing an arbitrary legend, which doesn't translate well to screen UI and adds no educational value.
- Instead: the map is shown with outlined country borders only (no fill-color legend). When a player must identify a country, a small number of countries are highlighted as multiple-choice candidates and the player selects the correct one.
- Difficulty is tuned by how many candidate countries are shown (e.g., 2 for easy, up to 6 for hard) and can be adjusted by the adaptive difficulty system (see below).

## Game Modes

### Single Player

- **Solo (no AI opponent)**: Player plays alone against the board. The system passively tracks play style — accuracy per country, response time, weak categories — purely for the player's own stats and to feed the adaptive systems below. No AI commentary or coaching is required for MVP.
- **Vs. AI Bot**: Player competes against an AI-controlled opponent calibrated to roughly the player's own skill level (see Skill Rating below). The bot's skill level also feeds into future online matchmaking.

### Multiplayer

- **Local (same device, pass-and-play)**: Multiple players share one device. AI adaptive difficulty and skill-based tuning are intentionally minimized here since skill levels overlap across different people — this mode is meant to be casual and social.
- **Private Rooms (multi-device, invite-based)**: Same casual philosophy as Local, but players join from their own devices over the network.
- **Online Matchmaking**: Players are matched with others of similar skill rating. Starting format: 1v1, with 2v2 as a possible later extension (open discussion, not committed for MVP).

## Skill Rating System

- Every player accumulates a skill rating based on performance (accuracy, speed, category strength).
- Used for: calibrating the AI bot's difficulty in single-player, and matchmaking in online multiplayer.
- Rating system mechanics (e.g., Elo-style formula) to be defined in detail during the matchmaking build phase (V3 — see ROADMAP.md).

## Adaptive Difficulty & Question Distribution

- In single-player modes, the system tracks per-category accuracy and response time.
- Category question distribution is adjusted using **weighted random selection**, not hard rules — e.g., a weak category's selection probability might shift from a flat 25% baseline up to ~35-40%, not be forced to dominate entirely.
- The system should avoid over-correcting: the goal is gentle reinforcement of weak areas, not punishing repetition.
- The number of multiple-choice candidates shown on the map can also scale with difficulty.

## Special Mechanics

- **Streak Bonus**: A bonus is awarded after 2-3 consecutive correct answers/turns (exact bonus value TBD — could be extra steps, a guaranteed easy question, etc.).
- **Special Tiles**:
  - *Spin Again*: take another spin immediately.
  - *Double Reward*: move forward the same number of steps again without spinning or answering a question.
  - Additional tiles to consider post-MVP: *Swap Positions*, *Skip a Turn*, *Steal a Category* (for added multiplayer chaos/fun).

## Country Pool

- Rather than always using all ~195 countries, games can use a randomized subset selected at game creation.
- Proposed modes:
  - **Quick Match**: a smaller randomized subset (e.g., ~20-30 countries), shorter game.
  - **World Tour**: full country pool, longer game.
- This also gives a natural replayability and difficulty/length lever without extra engineering.

## AI Integration Points

1. **Question Freshness**: A scheduled backend job periodically uses an LLM to generate/refresh "current" trivia questions (e.g., current population figures, recent events tied to a country). Questions are generated in batch, stored in the database like any other question, and spot-checked before going live — not generated live per-turn, to avoid hallucination risk and latency/cost at scale.
2. **AI Opponent (single-player Vs. Bot)**: A bot calibrated to the player's skill rating.
3. **Adaptive Spinner/Question Distribution**: As described above, driven by tracked player performance.
4. **Play-style Analytics (Solo mode)**: Passive tracking of accuracy, time-per-question, and weak categories/countries, surfaced back to the player as stats (and used internally to drive adaptive difficulty).

## Explicitly Out of Scope for MVP

- Full AI commentary/coaching UI in solo mode
- 2v2 online multiplayer (discussion only, not committed)
- Full skill-rating/matchmaking algorithm (deferred to V3)
- Extra special tiles beyond Spin Again / Double Reward
