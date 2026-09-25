# Correctness & Drift

## DRY / single source of truth
"Don't Repeat Yourself." A piece of logic (a rule, a constant, a shape) should have **one** authoritative definition. When the same thing is defined in multiple places, the copies must be kept equal *by hand* — and eventually won't be.

## Drift
When two copies of something that **must** agree are maintained separately, they tend to **diverge** over time. The symptom is usually "it passed one check but not another." Common named instances:
- **Client/server validation mismatch** — front-end and back-end validate differently.
- **Schema drift** — DB schema vs code model out of sync.
- **Configuration drift** — environments that should match diverge.
- **Logic / business-rule duplication** — the same rule restated in several places.

**Prevention/detection:**
- Prefer a **single source of truth**: one rule function consumed everywhere, so there's only one definition to change.
- When duplication is unavoidable, treat the copies as a **set** and change them **together**.
- Test *both* paths — a value that should fail must fail at *every* gate. Passing one but not another = drift.

## Reference trace ("find all references")
Finding **every** place that reads or depends on a symbol (a field, variable, function, prop) **before** you change or remove it. It's the discovery step: you can't reason about the impact of touching `X` until you've located all of `X`'s consumers. Same idea as an IDE's "Find all references," done deliberately.

**When:** mandatory before any **destructive change** (removing/renaming); recommended before changing a value's type or shape. Additive changes need a lighter trace.

Terms that go with it:
- **Orphaned reference / dangling consumer** — code still pointing at a symbol that no longer exists after a removal. The bug a reference trace prevents.
- **Dead code** — a branch/handler that can never fire once a thing is gone; clean it in the same pass.
- **False match** — a search hit that *looks* related but isn't. A trace must disambiguate, not just count hits.

See also: [[state-and-data]], [[functions-and-effects]].
