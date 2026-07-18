# State & Data Relationships

The vocabulary for *how two pieces of state relate*. A lot of hard bugs are mis-relationships between copies of the same data.

| Term | Definition |
|---|---|
| **Source of truth** | The copy that *wins* when copies disagree; everything else should be recomputed from it. |
| **Derived state** | Data **computed from** the source, not entered directly (e.g. a progress percentage, a "complete" flag). |
| **Projection** | A derived **copy persisted elsewhere**, re-shaped for a different consumer. A projection doesn't follow its source backwards — wiping the source doesn't necessarily clear the projection. |
| **Cache** | Derived state **stored to avoid recomputing**, which can go **stale**. |
| **Stale** | A derived copy that no longer matches its source. |
| **Invariant** | A condition that must **always hold**, or something breaks (e.g. "these two validators always agree"). |
| **Contract** | An **implicit agreement** between two pieces of code that neither one enforces — break one side and the other fails silently (e.g. an error key that doubles as a DOM id; rename the id and scroll-to-error breaks silently). |
| **Consumers / downstream** | Everything that **reads** a value; "downstream" = after it in the data flow. |

## Recurring bug shapes (named)
- **Two sources of truth disagree** — two stores of the same fact, each trusted by different code.
- **Stale cache** — a cached "derived" value that wasn't recomputed when its source changed.
- **Projection masking** — a stale projected copy still looks valid because nothing re-derived it.

## Questions worth asking
- *"Which copy is the **source of truth** here?"* — the first question whenever two stores of the same fact can disagree.
- *"Is this **derived**? Then it should be recomputed, not stored — or cached with a way to invalidate."*
- *"Does this change break a **contract** (something neither side enforces)?"*
- *"What **invariant** must hold across these copies, and what enforces it?"*

See also: [[data-flow]], [[correctness-and-drift]], [[functions-and-effects]].
