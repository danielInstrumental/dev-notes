# Data Modeling

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

## How a one-to-many is stored — two representations
| Representation | Definition |
|---|---|
| **Embedded / denormalized** | children stored **inside** the parent as one serialized value (e.g. a JSON array in a single text column). Fast to read whole, awkward to query/relate. |
| **Normalized** | each child is its **own record**, linked by a relationship. Queryable and relatable, more moving parts. |

"Normalizing" a collection = moving it from an embedded representation to linked child records.

## Related patterns
- **Discriminated union / single-table inheritance** — one table/object holding several kinds of record, told apart by a `type` **discriminator** column.
- **Upsert** — "update if it exists, else insert." Made safe/repeatable with an **idempotency key** so a retry targets the same record instead of creating a duplicate (see [[functions-and-effects]] → idempotency).
- **Reconcile** — bring a target into agreement with a source (create missing, update changed, remove/archive absent).

## Relational vocabulary (so terms line up)
**field / property / column** = one attribute · **table / object** = a collection of records of one kind · **record / row** = one instance · **association / foreign key / relationship** = a typed link between records (a one-to-many lives here).

See also: [[data-flow]], [[state-and-data]].
