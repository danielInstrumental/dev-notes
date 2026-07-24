# Core Engineering Vocabulary — a living map

Companion to the `prompt-coaching` skill. This is the map of concept **families** the coaching
draws from when naming the user's unknown unknowns — organized so growth has somewhere to go.

**This map is OPEN, not a syllabus.** These families and terms are a starting core, not the whole
of engineering vocabulary. It grows as projects surface new concepts — see "How this file grows"
at the bottom. No term is "done": the user's own definitions live in the repo's `glossary/`
folder; this file just says what exists and whether it's conventional.

**Markers:** unmarked = canonical professional vocabulary · 🏠 = house style (coined in the
user's projects — useful, but translate it when talking to other engineers; the translation is
given in parentheses).

---

## Structure — what the parts are

- **module / component** — a self-contained piece with one job
- **layer** — a horizontal stratum (UI / logic / persistence); each talks mainly to its neighbors
- **boundary** — where one part ends and another begins
- **interface** — the visible set of operations a part exposes at its boundary
- **contract** — the promises made across a boundary (shapes, semantics, guarantees)
- **abstraction** — hiding detail behind a simpler concept
- **dependency** — what a part needs from outside itself
- **coupling** — how entangled two parts are (lower is better)
- **cohesion** — how focused one part is on one job (higher is better)
- **seam** — an injected point where behavior can be swapped (for tests, pivots)

## Behavior — what happens at runtime

- **mechanism / flow** — how a feature actually works step by step
- **state** — the data a system remembers at a moment in time
- **lifecycle** — the fixed sequence of stages something moves through (create → active → archived)
- **data flow** — the path data takes through the system
- **side effect** — extra state mutated beyond the obvious result
- **idempotency** — running it twice is safe (converges, no duplicates)
- **race condition** — outcome depends on unpredictable ordering of concurrent events
- **eventual consistency** — a read may lag a write (search indexes, projections)

## Correctness — what must stay true

- **invariant** — a condition that must ALWAYS hold; break it and the system is wrong
- **precondition / postcondition** — what must be true before / after an operation
- **validation** — checking inputs against rules
- **guard** — an enforced check that gates an action (the server-side one is authoritative)
- **fail-open / fail-closed** — on error, allow or block? (both valid; unexamined is not)
- **defense in depth** — the same protection at multiple layers; the client copy is UX,
  the server copy is the real line

## Change over time — how code evolves

- **pattern** — a named reusable solution shape
- **refactoring** — restructuring without changing behavior
- **regression** — something that used to work breaking again
- **technical debt** — shortcuts that must be repaid later (acceptable when chosen consciously)
- **drift** — duplicated things (rules, copies, docs) falling out of sync silently
- **migration** — moving data/code from an old shape to a new one
- **backward compatibility** — new code still handles old data/behavior
- 🏠 **pin** (≈ regression test freezing a decision) · 🏠 **tripwire** (≈ canary test designed to
  redden on a planned event) · 🏠 **drift guard / parity test** (≈ consistency check between
  deliberate copies)

## Build strategies — how to sequence construction

- **vertical slice** — one thin feature path through EVERY layer (two fields: schema → save →
  read → display), vs a **horizontal slice** (one whole layer at a time — whose weakness is that
  end-to-end flow is invisible until the very end)
- **walking skeleton** — the smallest end-to-end implementation that actually runs through all
  layers; build it first, then add flesh incrementally
- **tracer bullet** — a walking skeleton built specifically to SEE the trajectory (logs at each
  hop); tracer code is KEPT and extended
- **spike / prototype** — throwaway code written only to answer a question, then deleted (the
  opposite of a tracer bullet — never let a spike quietly become production)
- **incremental development** — extending a proven path piece by piece, vs **big-bang** (build
  everything, connect at the end, meet all the wiring bugs at once)

## Process & knowledge — how teams work

- **convention** — an agreed rule/style (enforced by discipline, not by the machine)
- **specification (spec)** — the written statement of what to build
- **source of truth (SSOT)** — the ONE place a fact authoritatively lives
- **separation of concerns** — each part addresses one concern; don't tangle them
- **ubiquitous language** — one precise shared vocabulary used identically in talk, docs, and code
- **conceptual model / domain model** — the named concepts + relationships you think with
- **unknown unknowns** — the gaps you can't see; the coaching's job is naming them
- 🏠 **standing instruction** (≈ a directive applying to every future turn)
- 🏠 **stranger test** (≈ could a competent stranger continue from the artifacts alone?)

---

## How this file grows (open by design)

This map deliberately does NOT try to be complete — as the user builds more projects, new concepts
WILL surface that aren't here (whole families may be missing: e.g. security, performance,
distributed systems, databases each have their own vocabulary).

Rules for any agent maintaining it:

1. **When coaching surfaces a term not on this map, ADD it** — to its family, or start a new
   family if none fits. Adding is the default, not the exception.
2. **Mark its status honestly**: canonical (unmarked) or 🏠 house style with the conventional
   translation in parentheses. If unsure it's canonical, say so rather than guessing.
3. **One-line definitions only** — the user's fuller own-words definitions belong in the repo's
   `glossary/` folder, not here. This file is the index of what exists.
4. **Upstream first** (see `AUTHORING.md`): add terms here in dev-notes, then re-copy to projects —
   a term learned in one project should reach all of them.
5. **House terms must stay load-bearing.** A 🏠 term earns its place by being USED — by a skill in
   this kit or an active project. If nothing uses it anymore, drop it from the map (canonical terms
   are exempt: they're the professional vocabulary regardless of whether we currently use them).
