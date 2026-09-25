# Design & structure

> **Covers:** How code is divided into parts, and how those parts depend on and talk to each other.

## Terms

- **module / component** — a self-contained piece with one job
- **layer** — a horizontal stratum (UI / logic / persistence); each talks mainly to its neighbors
- **boundary** — where one part ends and another begins
- **interface** — the visible set of operations a part exposes at its boundary
- **contract** — the promises made across a boundary (shapes, semantics, guarantees)
  → [[#Implicit contract]]
- **abstraction** — hiding detail behind a simpler concept
- **dependency** — what a part needs from outside itself
- **coupling** — how entangled two parts are (lower is better)
- **cohesion** — how focused one part is on one job (higher is better)
- **seam** — an injected point where behavior can be swapped (for tests, pivots)
- **pattern** — a named reusable solution shape
- **separation of concerns** — each part addresses one concern; don't tangle them

## Implicit contract

A **contract that nothing enforces** — an implicit agreement between two pieces of code; break one side and the other fails silently (e.g. an error key that doubles as a DOM id; rename the id and scroll-to-error breaks silently).
