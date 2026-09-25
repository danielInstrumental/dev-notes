# Design & structure

> **Covers:** How code is divided into parts, and how those parts depend on and talk to each other.

## Terms

- **module / component** — a self-contained unit that hides its internals behind an interface
- **layer** — a horizontal level (UI / logic / storage); each layer depends only on the one below it
- **boundary** — where one part ends and another begins
- **interface** — the visible set of operations a part exposes at its boundary
- **contract** — the promises made across a boundary (shapes, semantics, guarantees)
  → [[#Implicit contract]]
- **abstraction** — hiding detail behind a simpler concept
- **dependency** — what a part needs from outside itself
- **coupling** — how much one part depends on another's internals (lower is better: loose coupling
  means you can change one without the other)
- **cohesion** — how focused one part is on one job (higher is better)
- **seam** — a place where you can change what code does without editing it there (e.g. an injected
  dependency, a config switch) — for tests and pivots
- **pattern** — a named reusable solution shape
- **separation of concerns** — each part addresses one concern; don't tangle them

## Implicit contract

A **contract that nothing enforces** — an implicit agreement between two pieces of code; break one side and the other fails silently (e.g. an error key that doubles as a DOM id; rename the id and scroll-to-error breaks silently).
