# Glossary

Technical terms I want to keep sharp, defined in my own words with generic examples. Grouped by topic so each file is a short, reviewable set.

| File | Covers |
|---|---|
| [functions-and-effects.md](functions-and-effects.md) | Pure function, side effect, attribution rule, functional core/imperative shell, idempotency (and idempotent ≠ pure) |
| [state-and-data.md](state-and-data.md) | Source of truth, derived state, projection, cache/stale, invariant, contract, consumers/downstream |
| [correctness-and-drift.md](correctness-and-drift.md) | DRY / single source of truth, drift (schema/config/client-server), reference trace, orphaned reference, dead code, false match |
| [enforcement-and-safety.md](enforcement-and-safety.md) | Guard, backstop, defense-in-depth, client vs server validation, fail-open/closed, eventual vs read-after-write consistency |
| [data-flow.md](data-flow.md) | Write/read path, hop, propagation, end-to-end tracing, debounce, event bus |
| [data-modeling.md](data-modeling.md) | Scalar vs collection, cardinality, embedded/denormalized vs normalized, discriminated union, upsert, reconcile |

_Definitions are project-neutral. They started as notes from real projects, but the project-specific detail is deliberately stripped out here._
