# Functions & Effects

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

See also: [[correctness-and-drift]], [[state-and-data]].
