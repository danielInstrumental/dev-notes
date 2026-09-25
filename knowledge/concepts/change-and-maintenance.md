# Change & maintenance

> **Covers:** Changing existing code safely: the kinds of change, how risky each is, and keeping old data and behavior working.

## Terms

- **refactoring** — restructuring without changing behavior
- **additive change** — new capability with existing paths untouched (vs a **behavioral fix**,
  which changes what some path does — its risk scales with who can reach that path)
- 🏠 **fail-path-only change** (≈ a fix confined to an error branch — healthy traffic never
  executes it, so working flows can't regress; the cheapest correctness class)
- **hardening** — guards/validation added to make existing behavior safer, no new features
- **cross-cutting change** — touches many sites or a shared convention; risk lives in COVERAGE
  (vs a **surgical/localized** fix: one site, one rule)
- **blast radius** — how much can break if a change is wrong
- **regression surface** — which existing behaviors need re-verification after a change; near a
  deadline you ration THIS, not lines of code
- **reachability** — the estimator for both of the above: who/what can execute the changed code?
  A 10-line refactor of a shared helper can outweigh a 100-line additive feature
- **technical debt** — shortcuts that must be repaid later (acceptable when chosen consciously)
- **drift** — duplicated things (rules, copies, docs) falling out of sync silently
  → [[#Drift]]
- **migration** — moving data/code from an old shape to a new one
- **backward compatibility** — new code still handles old data/behavior

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
