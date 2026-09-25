# Functions, effects & flow

> **Covers:** What code does when it runs: computing values versus changing things, and the path a value travels through the system.

## Terms

- **mechanism / flow** — how a feature actually works step by step
- **data flow** — the path data takes through the system → [[#Data flow]]
- **side effect** — extra state mutated beyond the obvious result
  → [[#Side effect]]
- **idempotency** — running it twice is safe (converges, no duplicates)
  → [[#Idempotency]]

## Side effect

Anything a function does *during its execution* **beyond computing and returning a value** — reaching outside its local scope to **mutate external state** (setting state, mutating a shared object/global) or do **I/O** (network calls, storage, logging, touching the DOM, showing a dialog).

Two senses, don't conflate them:
- **Formal (FP/CS):** *any* effect beyond returning a value.
- **Everyday:** a **secondary** consequence beyond the action's **primary** intent (e.g. "saving the form *also* clears dependent fields").

## Pure function

Takes input, returns output, does **nothing else** — no external mutation, no I/O. Same input → same output, every time. Trivially testable and safe to call anywhere.

## Attribution rule (the sharp bit)

> A side effect belongs to the **code that performs it**, not to a pure function whose return value is later fed into side-effecting code.

If `buildNext(state)` returns a new object (pure) and the **caller** then does `setState(next)`, the mutation + re-render are side effects of the `setState` call — not of `buildNext`. A pure function feeding an impure operation stays pure.

*(Caller = the code that invokes a function; callee = the function invoked. In `A → B`, A is the caller.)*

## Functional core, imperative shell

A design principle:
- Keep **deciding / computing** pure (validation, transforms, "what's the next state?") → predictable, testable, reusable.
- Concentrate **effects** in a thin, obvious outer layer (event handlers, save calls, `setState`).

The real rule isn't "no side effects" (a program needs them to do anything) — it's **no *surprising* side effects**: if a function has effects, its name and location should make that obvious. A hidden effect inside an innocent-looking "compute" helper is the bug.

## Idempotency

An operation is **idempotent** if applying it two or more times leaves the system in the **same state** as applying it once. The first run may change things; every run after adds no further change.
- Transform: `f(f(x)) == f(x)` — e.g. `format(format(x)) === format(x)`.
- Action: "calling the endpoint N times == calling it once."

**Idempotent ≠ pure.** A pure function has *no* side effects. An idempotent operation *may* have a side effect — it just reaches the *same* end state however many times it runs. `status = 'submitted'` writes to a record (a side effect) but is idempotent. "No-op on repeat," not "no effect ever."

Two questions to ask about any operation:
1. *Read/transform:* feed the output back in — same output?
2. *Action/write:* if this fires twice (double-click, retry, two callers, a remount), does the second fire change anything?

How to make an operation idempotent:
- **Guard / check-before-act** with a **reliable** existence check.
- **Deterministic key / dedup** — derive the target from a key the caller already has, so a second run hits the same record instead of creating a new one.
- **Set, don't accumulate** — "set status = X" is idempotent; "increment" / "append" are not.
- **Assume the edges retry** — double-clicks, debounced saves, retries all mean a write can fire more than once. Design writes to tolerate it.

## Data flow

**Data flow** = the route a value travels through the system. "Trace the data flow" (or "trace it **end-to-end**") means follow the value through **every hop**, checking what each hop does to it. The precise version of "review how the value propagates."

## Consumers / downstream

Everything that **reads** a value; "downstream" = after it in the data flow.

## Write path vs read path

- **Write path** — input → persisted → projected (how a value gets in and stored).
- **Read path** — persisted → rendered (how a stored value gets back out).

A system often has more than one read path (e.g. loading a saved record vs prefilling from a different source). Naming which path you mean avoids confusion.

## Hop

One step (one "arrow") in the chain. **Bugs live at hops:** a trim at one hop, a format transform (`yes → Yes`) at another, a debounce delaying one. When something stored doesn't match something entered, ask **"which hop changed it?"**

## Propagation

A value flowing onward through its downstream hops. *"Does clearing the field propagate all the way to storage?"*

## Debounce

Delaying an action until input has "settled" — i.e. wait until N ms after the *last* event before firing once, instead of firing on every event. Common for autosave and search-as-you-type. (Related: **throttle** = fire at most once per interval.)

## Event bus / custom-event pattern

Components that don't share state communicate by **dispatching and listening for events** rather than through a shared store. Useful when independently-loaded parts of a page can't see each other's state. Contrast with a centralized store (Redux-style) — with an event bus there is no single store; parts talk via events.

## Questions worth asking

- *"Trace the **write path** for this value **end-to-end** — input to storage to any projected copy."*
- *"It's right in memory but wrong in storage → the bug is at the **save hop**, not the input."*
- *"Do we need a second **read path** for this, distinct from the existing one?"*
