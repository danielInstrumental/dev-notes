# Problem Classes — a living map of the ways systems go wrong

Companion to the `prompt-coaching` skill and sibling of `core-vocabulary.md`: that file names the
PARTS of a system; this one names the recurring WAYS systems fail — **bug classes**. Knowing the
class is the professional superpower: once a problem is classified, the known mitigations come
with the name.

**This map is OPEN, not a syllabus** — same grow-rules as `core-vocabulary.md` (see the bottom).
Whole families are missing by design (security, performance, distributed systems each have their
own catalog); they get added when a project meets them.

Entry format — built for RECOGNITION from symptoms:

> **Name** — what it is, one line.
> *You might have it when…* — the symptom as you'd actually experience it.
> *Mitigations:* the standard, named fixes.

---

## Concurrency & timing

- **Race condition** — the outcome depends on the unpredictable ordering of concurrent operations.
  *You might have it when…* something works most of the time but fails when actions happen quickly
  or simultaneously.
  *Mitigations:* serialization, locking, debouncing, idempotency — pick per sub-class below.
- **Check-then-act race (TOCTOU)** — two runs both check a condition ("no record exists"), both see
  the same answer, both act — e.g. a duplicate record created by concurrent page loads.
  *You might have it when…* duplicates appear despite code that "checks first".
  *Mitigations:* unique constraints, idempotent create (upsert), a single-creator rule, atomic
  check-and-set operations.
- **Lost update / last-writer-wins** — two writers read the same state, both modify their copy, the
  second write silently erases the first (the classic multi-tab bug).
  *You might have it when…* a change a user definitely made is gone, with no error anywhere.
  *Mitigations:* optimistic locking (version/etag compare on write), field-scoped writes instead of
  whole-blob writes, merge policies (e.g. fill-only-empty).
- **Out-of-order responses** — async responses arrive in a different order than the requests; the
  UI applies the stale one last — e.g. a "Saved ✓" pill reflecting the wrong request.
  *You might have it when…* a status indicator or search-as-you-type result is intermittently wrong,
  especially on slow networks.
  *Mitigations:* sequence-tag requests and apply only the latest; cancel superseded requests
  (AbortController); per-item status instead of one aggregate.
- **Double-submit** — the same action fires twice (double-click, retry, impatient reload) and the
  effect happens twice.
  *You might have it when…* duplicate emails/records/charges appear for a single user action.
  *Mitigations:* disable-on-click, idempotency keys, server-side dedup.

## Failure & partiality

- **Partial failure** — a multi-step sequence (create A, update B, archive C) is NOT atomic and
  dies midway, leaving inconsistent state.
  *You might have it when…* data is half-there: the record exists but the association is missing.
  *Mitigations:* make re-runs idempotent so the next run HEALS the state; transactions where the
  platform offers them; explicit repair paths.
- **Silent / swallowed failure** — an error is caught (or fail-softed) and nobody ever learns it
  happened; the feature "works" and quietly does nothing.
  *You might have it when…* something has been broken for weeks and no one noticed — records that
  silently never got created.
  *Mitigations:* log every swallowed error with context; observability as a review dimension
  ("when it fails, will anyone KNOW?"); alerts on rates.
- **Unexamined fail-open / fail-closed** — a guard has SOME behavior on error, but nobody chose it:
  fail-open silently lets things through; fail-closed blocks legitimate users on infrastructure
  hiccups.
  *You might have it when…* an outage either bypassed your protections or locked everyone out —
  and either way it surprised you.
  *Mitigations:* state the posture explicitly per guard at design time (both are valid; unexamined
  is not).

## Data & state

- **Eventual consistency (stale read-after-write)** — a read (especially search/index endpoints)
  lags a recent write; the just-created record "isn't there".
  *You might have it when…* code that reads back what it just wrote intermittently misses it —
  causing duplicate-create or missed-update.
  *Mitigations:* read by direct id / relationship APIs instead of search for current-state reads;
  design for the lag instead of assuming freshness.
- **Drift (duplicated-thing divergence)** — the same rule/logic/doc exists in more than one place
  and the copies silently diverge.
  *You might have it when…* behavior differs between two paths that are "the same" — client accepts
  what the server rejects.
  *Mitigations:* single source of truth where possible; where duplication is forced, KEEP-IN-SYNC
  markers + parity tests + a registry of the copies.
- **Orphaned data** — a record's parent/reference was deleted or never landed, leaving it dangling.
  *You might have it when…* counts don't add up, or cleanup jobs find records nothing points to.
  *Mitigations:* deletes detected by absence-diffing; cascade rules chosen explicitly; periodic
  orphan sweeps.
- **Schema / shape mismatch** — data saved under an old shape meets code expecting the new shape
  (renamed key, string-vs-array, enum value casing).
  *You might have it when…* only OLD records break, or a field is mysteriously empty after a rename.
  *Mitigations:* normalize-on-read gateways, migrations, backward-compatible readers, compatibility
  checks in every schema-touching plan.

## Boundaries & values

- **Off-by-one** — a loop or range is wrong by exactly one (`<` vs `<=`, 0- vs 1-indexed,
  inclusive vs exclusive bounds).
  *You might have it when…* the first or last item misbehaves; a boundary date is rejected.
  *Mitigations:* boundary-case tests as a standard part of every matrix (equal dates, empty, max).
- **Null / empty / undefined confusion** — "no value" has several distinct representations with
  different meanings (never-set vs cleared vs empty), and code conflates them.
  *You might have it when…* a tri-state behaves as two states — e.g. "never completed" being
  auto-completed because `undefined` was treated as `false`.
  *Mitigations:* name each state's meaning explicitly; test the trichotomy; avoid truthiness checks
  where the distinction matters.
- **Timezone / date bugs** — dates shift by a day (or a year at year-end) crossing timezones or
  formats (US month-first vs ISO).
  *You might have it when…* a date entered as the 1st displays as the 31st, or boundaries fail for
  users in other regions.
  *Mitigations:* store ISO/UTC; convert only at display; never parse ambiguous formats without
  declaring the convention.
- **Encoding / case-sensitivity mismatch** — the same value in different encodings or cases fails
  exact-match comparison (enum `'Yes'` vs `'yes'`).
  *You might have it when…* an exact-looking match fails intermittently, or an external write is
  rejected as an invalid option.
  *Mitigations:* normalize at the boundary; verify option values against the live system, not
  memory.
- **Floating-point surprise** — binary floats can't represent many decimals (`0.1 + 0.2 !== 0.3`);
  money math drifts by cents.
  *You might have it when…* totals are off by tiny amounts, or an equality check on computed
  numbers fails.
  *Mitigations:* integer minor-units (cents) for money; epsilon comparisons; decimal libraries.

---

## How this file grows (open by design)

Same rules as `core-vocabulary.md`: when a session hits a bug that belongs to a class not on this
map, **ADD the class** (with its symptom and mitigations) — adding is the default; new families
are expected (security, performance, distributed systems…); keep entries one-recognition-card
each; upstream first (add here in dev-notes, re-copy to projects); and the coaching duty applies —
**when a bug is diagnosed in a session, NAME its class out loud**, so recognition becomes reflex.
