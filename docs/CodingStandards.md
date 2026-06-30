# Coding Standards

> **Version:** 1.0  
> **Status:** Accepted  
> **Last Updated:** 2026-06-30

---

## Table of Contents

- Philosophy
- General Principles
- Project Structure
- React Standards
- TypeScript Standards
- Styling Standards
- Import Standards
- Naming Conventions
- Architecture
- Comments
- Documentation
- Engineering Philosophy

---

## Philosophy

GeoQuest AI follows a consistency-first engineering philosophy.

Every coding convention exists to improve one or more of the following:

- Readability
- Maintainability
- Scalability
- Predictability
- Team collaboration

Whenever possible, existing project conventions should be followed rather than introducing new patterns.

---

## General Principles

- Keep solutions simple until complexity is justified.
- Prefer composition over inheritance.
- Prefer reusable components over duplication.
- Optimize for readability before cleverness.
- Avoid premature optimization.
- Every component should have a single responsibility.
- Feature development should not introduce unnecessary architectural changes.

---

## Project Structure

The project follows a feature-first architecture.

```text
apps/
packages/

src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── styles/
├── types/
└── utils/
```

### Responsibilities

| Folder | Responsibility |
| :--- | :--- |
| app | Next.js routes |
| components | Shared reusable components |
| features | Feature-specific code |
| hooks | Shared React hooks |
| lib | Shared libraries and helper functions |
| services | API communication |
| styles | Global styling |
| types | Shared TypeScript types |
| utils | Pure utility functions |

---

## React Standards

### Components

#### Component Naming

Components use PascalCase.

Example:

```text
Hero.tsx
Navbar.tsx
RoomCard.tsx
```

#### Component Exports

React components use default exports.

```tsx
const Hero = () => {
  return (
    <section>
      ...
    </section>
  );
};

export default Hero;
```

#### Route Components

Next.js route files follow the official Next.js style.

```tsx
export default function HomePage() {
  return <Hero />;
}
```

#### Component Responsibilities

- Every component should have a single responsibility.
- Split components as they grow.
- Avoid creating large "God Components."

#### Reusable Components

Reusable components should expose a `className` prop whenever extending styles makes sense.

```tsx
import { cn } from "@/lib/utils";

type HeroProps = {
  className?: string;
};

const Hero = ({ className }: HeroProps) => {
  return (
    <section className={cn("...", className)}>
      ...
    </section>
  );
};

export default Hero;
```

#### Component Composition

Prefer composition over creating multiple specialized components.

Preferred:

```tsx
<Button variant="outline" />
```

Instead of:

```tsx
<OutlineButton />
```

#### Props

Props should represent **behavior**, not presentation.

Good examples:

- `disabled`
- `loading`
- `open`
- `checked`

Avoid boolean props for:

- spacing
- alignment
- colors
- sizing

Use `className` for presentation whenever possible.

---

### Hooks

Hooks begin with `use`.

Examples:

```text
useTimer.ts
useCountdown.ts
useGameSocket.ts
```

Hooks use default exports.

---

### Utilities

Utilities use named exports.

```tsx
export const formatScore = () => {
  ...
};
```

---

## TypeScript Standards

### General

Use TypeScript for all new code.

Prefer:

```tsx
type Props = {
  ...
};
```

Avoid:

- `PropTypes`
- `any`

### React.FC

Do not use `React.FC`.

Preferred:

```tsx
const Hero = () => {
  ...
};
```

---

## Styling Standards

### Tailwind CSS

Tailwind CSS is the primary styling solution.

Guidelines:

- Prefer utility classes.
- Avoid inline styles.
- Avoid custom CSS unless required.
- Reuse design system components whenever possible.

### Class Names

Use the `cn()` utility whenever combining class names.

Preferred:

```tsx
className={cn(
  "rounded-lg",
  isActive && "bg-primary",
  className
)}
```

Avoid:

```tsx
className={`rounded-lg ${isActive ? "bg-primary" : ""}`}
```

### shadcn/ui

Generated shadcn components form the project's design system.

Guidelines:

- Do not modify generated components unless necessary.
- Prefer composition before modification.
- Extend components through props and variants.
- Feature-specific wrappers belong inside the corresponding feature folder.

---

## Import Standards

### Import Aliases

Use the configured import alias whenever possible.

Preferred:

```tsx
import Hero from "@/components/common/Hero";
```

Avoid long relative imports whenever an alias is available.

---

## Naming Conventions

| Item | Convention |
| :--- | :--- |
| Components | PascalCase |
| Hooks | useSomething |
| Types | PascalCase |
| Interfaces | PascalCase |
| Utilities | camelCase |
| Constants | UPPER_SNAKE_CASE (global) / camelCase (local) |
| Files | Match exported component |

---

## Architecture

Prefer feature-first organization over type-first organization.

Example:

```text
features/
└── lobby/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types.ts
    └── utils.ts
```

---

## Comments

Write code that explains itself.

Comments should explain **why**, not **what**.

Good:

```tsx
// Prevent duplicate room joins while a request is pending.
```

Avoid:

```tsx
// Increment counter.
counter++;
```

---

## Documentation

Significant architectural decisions should be documented.

When introducing a major technology or pattern:

- Update the relevant documentation.
- Create or update an ADR where appropriate.
- Keep examples current.
- Document trade-offs where applicable.

---

## Engineering Philosophy

GeoQuest AI prioritizes:

1. Simplicity
2. Readability
3. Consistency
4. Scalability
5. Maintainability

Code should be easy to understand six months later, even if it was written today.
