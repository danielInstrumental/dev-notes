# Data & state

> **Covers:** What the system stores, how data is shaped and related, and how copies of the same data stay consistent.

## Terms

- **state** — the data a system remembers at a moment in time
- **lifecycle** — the stages one thing goes through over its existence: a record (draft → submitted
  → archived) or a UI component (mount → update → unmount). Not the steps inside one action — that's
  a flow. A lifecycle with strict rules about which stage can follow which is a **state machine**
- **eventual consistency** — after a write, copies may briefly disagree (a search index, a
  projection), but they converge if writes stop → [[#Related distributed-systems terms]]
- **read-after-write consistency** — after a write, a read is guaranteed to see it
  → [[#Related distributed-systems terms]]
- **source of truth (SSOT)** — the ONE place a fact authoritatively lives
  → [[#Source of truth]]
- **derived state** — data computed from other data rather than entered (e.g. a progress %)
  → [[#Derived state]]
- **projection** — a copy of data reshaped and stored for a specific reader (e.g. a search index)
  → [[#Projection]]
- **cache** — a saved copy of computed or fetched data, kept to avoid redoing the work; can go stale
  → [[#Cache]]
- **stale** — a copy that no longer matches its source → [[#Stale]]
- **DRY (Don't Repeat Yourself)** — every piece of knowledge (a rule, constant or shape) has ONE
  authoritative definition → [[#DRY]]
- **conceptual model / domain model** — the concepts, rules and relationships of the business,
  reflected in the code
- **scalar vs collection** — a field holds one value, or many (a list of values, or of whole
  records) → [[#Field kinds]]
- **cardinality** — how many records relate to how many: one-to-one, one-to-many, many-to-many (in
  databases, also the number of distinct values in a column) → [[#Cardinality]]
- **embedded vs normalized** — related data stored inside the parent record, or as separate linked
  records → [[#How a one-to-many is stored]]
- **discriminated union** — a value that can be one of several kinds, with a tag field saying which
  (in a database: single-table inheritance) → [[#Related patterns]]
- **upsert** — insert a record, or update it if it already exists → [[#Related patterns]]
- **reconcile** — compare the desired state with the actual state, then change the actual to match
  → [[#Related patterns]]

## State relationships

The vocabulary for *how two pieces of state relate*. A lot of hard bugs are mis-relationships between copies of the same data.

| Term | Definition |
|---|---|
| **Source of truth** | The copy that *wins* when copies disagree; everything else should be recomputed from it. |
| **Derived state** | Data **computed from** the source, not entered directly (e.g. a progress percentage, a "complete" flag). |
| **Projection** | A derived **copy persisted elsewhere**, re-shaped for a different consumer. A projection doesn't follow its source backwards — wiping the source doesn't necessarily clear the projection. |
| **Cache** | A saved copy of **computed or fetched** data, kept to avoid redoing the work — which can go **stale**. |
| **Stale** | A derived copy that no longer matches its source. |

## DRY / single source of truth

"Don't Repeat Yourself." A piece of logic (a rule, a constant, a shape) should have **one** authoritative definition. When the same thing is defined in multiple places, the copies must be kept equal *by hand* — and eventually won't be.

## Related distributed-systems terms

- **Eventual consistency** — after a write, reads may not immediately reflect it; the system converges "eventually." A search/index right after a write can still return the old result. A frequent cause of duplicate-create races: two callers both read "doesn't exist" and both create.
- **Read-after-write consistency** — a read is guaranteed to reflect a preceding write. When you need an existence check to be reliable, use a read-after-write-consistent path, not an eventually-consistent one.

## Recurring bug shapes (named)

- **Two sources of truth disagree** — two stores of the same fact, each trusted by different code.
- **Stale cache** — a cached "derived" value that wasn't recomputed when its source changed.
- **Projection masking** — a stale projected copy still looks valid because nothing re-derived it.

## Questions worth asking

- *"Which copy is the **source of truth** here?"* — the first question whenever two stores of the same fact can disagree.
- *"Is this **derived**? Then it should be recomputed, not stored — or cached with a way to invalidate."*
- *"Does this change break a **contract** (something neither side enforces)?"*
- *"What **invariant** must hold across these copies, and what enforces it?"*

## Field kinds

| Kind | Definition | Examples |
|---|---|---|
| **Scalar** (atomic / primitive / single-valued) | holds ONE value | `firstName`, `email`, a date, a single Yes/No |
| **Collection** (array / multi-valued) | holds MANY items | see sub-kinds below |

**Collection sub-kinds** (the distinction that decides how to store it):
- **Flat multi-value** — many *atomic* values (a list of scalars), e.g. selected tags, a list of ids. Stored natively as a multi-select, or joined into one field.
- **Collection of records** — many *structured* items, each with its **own fields**, e.g. a list of colleges, recommenders, addresses. These are the candidates to give their own table/object.

## Cardinality (the relationship word)

one-to-one · **one-to-many** · **nested one-to-many** (a parent's child has its own children) · many-to-many.

(In databases, *cardinality* can also mean the number of **distinct values** in a column — a `status` column with
three possible values has low cardinality. Context tells you which meaning is in play.)

## How a one-to-many is stored — two representations

| Representation | Definition |
|---|---|
| **Embedded / denormalized** | children stored **inside** the parent as one serialized value (e.g. a JSON array in a single text column). Fast to read whole, awkward to query/relate. |
| **Normalized** | each child is its **own record**, linked by a relationship. Queryable and relatable, more moving parts. |

"Normalizing" a collection = moving it from an embedded representation to linked child records.

## Related patterns

- **Discriminated union** — a value that can be one of several kinds, with a tag field (the **discriminator**, e.g. `type`) saying which. Its database form is **single-table inheritance**: one table/object holding several kinds of record, told apart by a `type` column.
- **Upsert** — "update if it exists, else insert." Made safe/repeatable with an **idempotency key** so a retry targets the same record instead of creating a duplicate (see [[functions-effects-and-flow#Idempotency]]).
- **Reconcile** — compare the **desired** state (the source) with the **actual** state (the target), then change the target to match: create missing, update changed, remove/archive absent.

## Relational vocabulary (so terms line up)

**field / property / column** = one attribute · **table / object** = a collection of records of one kind · **record / row** = one instance · **association / foreign key / relationship** = a typed link between records (a one-to-many lives here).
