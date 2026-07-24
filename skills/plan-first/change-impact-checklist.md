# Change Impact Checklist

> ## Project Configuration — fill in per project
> - List the project's concrete instances under each generic item as you discover them (validation
>   entry points, summary views, label/display maps, load-time auto-writers, the fixed set of
>   inbound/seed paths). The checklist gets MORE specific over the project's life — that's the point.
> - **Test suite command:** <e.g. `npm test` — all green before hand-off>

Use this before and after every modification. The `plan-first` skill (`SKILL.md` in this folder)
walks §§1–5 in Phase 2 and §6 in Phase 7; §8 applies whenever a change writes to an external system.

---

## Before Making the Change

### 1. What am I actually changing?

Identify the unit of change:

- [ ] UI field / component
- [ ] State key (schema)
- [ ] Validation rule
- [ ] Workflow logic
- [ ] API / persistence shape

Name what is **NOT** changing, too.

---

### 2. Who consumes this?

Find all downstream readers:

- [ ] Validation logic (component-level AND any central/orchestrator-level validators)
- [ ] Render conditions (conditional sections, disabled states, labels)
- [ ] Submission / API payload
- [ ] Autosave / persistence path
- [ ] Summaries / derived views
- [ ] **Cross-module dependencies** — does another step/module read or gate on this field?
- [ ] **Label / display maps** — is this field referenced in any lookup map (scroll-to-error ids,
      short-label tables, confirmation-dialog text)? Silent failure if missed.

---

### 3. What is derived from it?

What breaks indirectly if this changes?

- [ ] Completion/progress tracking
- [ ] Navigation gating (locks, step ordering)
- [ ] Conditional UI sections (fields that show/hide based on this value)
- [ ] Computed values or flags

State the **transitions**: what flips, what freezes, what must NOT flip.

---

### 4. What side effects does it trigger?

What else gets mutated when it changes?

- [ ] **Confirm-and-clear gates** — if this is a Yes/No gate, does toggling back need to clear
      dependent children (with user confirmation)?
- [ ] Clearing dependent fields (batch updates)
- [ ] Resetting uploads / file references
- [ ] **Hardcoded default key arrays** — are there key lists that need updating?
- [ ] Re-validation triggers (real-time invalidation, navigate-away re-validation)
- [ ] Cascading state updates
- [ ] **State-machine CROSSINGS** (a known checklist blind spot): if the change involves
      states/statuses, cross **each user action × each state transition** (e.g. dismissing a banner
      during `processing` must not suppress the later `ready`), and ask **"what does SUCCESS
      disable?"** and **"what does FAILURE retry, and what marker does a failed attempt consume?"**
      (a "once" marker must mean once SUCCESSFULLY). Walk every state's exits — a state without a
      user exit is a trap.
- [ ] **Load-time AUTO-WRITERS** — does the change interact with (or ADD) an effect that writes
      state on page open with NO user action (id back-fills, heal-on-load saves, migrations,
      navigate-away writes)? Server-injected state meets these effects BEFORE any user edit, and
      they amplify multi-tab races (each fires a save just from opening a page). Keep the project's
      fixed set of auto-writers listed here.
- [ ] **New protective guard? Re-walk every path that previously DELETED or OVERWROTE the protected
      thing** — each such path's outcome silently changes and must become a named decision.
- [ ] **Client concurrency / MULTI-TAB** — does the change read-modify-write SHARED state? If there
      is no version/etag guard, saves are last-writer-wins, and load-time auto-writers fire saves
      from merely opening a page. Ask: what does a second/stale tab do to this change, and does the
      change make a stale tab's save MORE destructive? Name the accepted posture — don't leave it
      unexamined.

---

### 5. Does it affect schema or external contracts?

Does this change stored or shared data?

- [ ] Stored state JSON shape (key names, nesting, types)
- [ ] API payload structure
- [ ] Backend / external-system property expectations
- [ ] **OTHER WRITERS of any touched external field** — name every other writer (other integrations,
      staff manual edits, platform automations/workflows, vendors) and state the precedence. Common
      default reality: your projection OVERWRITES external edits on the next save, and ONE invalid
      shared-field value can poison a whole batch write. "Nobody else writes this" is a claim —
      verify it.
- [ ] **Compatibility with existing saved data** — if a key is renamed or removed, saved records
      with the old key become stale. Acceptable only when no real users exist yet.

---

## After Making the Change

### 6. How do I verify this?

Test these surfaces before marking done:

- [ ] **Render layer** — correct UI appears / disappears; labels correct; no old naming visible
- [ ] **Persisted shape** — correct keys are written; old keys are absent (inspect the actual
      network traffic / stored data, not just the UI)
- [ ] **Clear-on-toggle** — toggling a gate back clears the dependent data and file references
- [ ] **Navigation/completion gating** — incomplete state blocks; complete state allows
- [ ] **Error affordances** — error display, scroll-to-error, and any lookup maps still resolve
- [ ] **Reload** — all changes persist and re-hydrate correctly after a page reload
- [ ] **Regression** — unrelated fields and modules behave identically to before
- [ ] **BASELINE → act → DIFF, for any external-system-writing change**: snapshot the affected
      records READ-ONLY before the test, then verify by DIFF. Three delta kinds:
      predicted-and-seen = pass · predicted-and-missing = fail · **unpredicted-and-seen = a
      QUESTION, never a pass** (attribute every record). The baseline also QUARANTINES pre-existing
      anomalies so they can't masquerade as effects of the change.
- [ ] **The test suite** — all green before hand-off. If a test REDDENS, identify its KIND first —
      pins/tripwires are DESIGNED to fail on certain changes and must be flipped WITH the change
      (never deleted-to-green); drift guards mean update BOTH copies.
- [ ] **Dev-toggle / param-gated features** — the OFF state is the must-pass: with the toggle
      absent, the app must be pixel-identical.

---

### 7. What documentation needs updating?

- [ ] `IMPLEMENTATION_LOG.md` — the as-built entry (after user verification only)
- [ ] TODO lists — mark items done or update open items
- [ ] `PLAN_LOG.md` — confirm the plan reflects what was actually implemented
- [ ] **Tests added?** → update the tests README (coverage table + status count)
- [ ] **Initiative touched?** → refresh its `README.md` status snapshot
- [ ] Any field/data SSOT inventory the project keeps — update the touched field's block

---

## 8. External-system writes, reconciles & projections

Use this section IN ADDITION to §§1–7 whenever a change writes to or **reconciles** an EXTERNAL
object (CRM object, third-party API) — i.e. a projection that creates/updates/deletes records keyed
by an id, not just in-app state.

### A. Idempotency & identity
- [ ] **Stable identity key** minted at the SOURCE and carried through (array index is NOT
      identity — reindexing on delete corrupts an index-keyed sync).
- [ ] **Running it twice is safe** (converges, no duplicates). Explicitly test the re-run.
- [ ] **Deletes detected by ABSENCE** (diff desired-vs-current), not by catching an event — a
      removed item is just *gone* from the source.
- [ ] **Edit ≠ delete:** a record mid-edit (temporarily not "committed") must NOT be archived as an
      orphan — orphan-detection compares against ALL present source ids, not just committed ones.

### B. Eventual consistency (read-after-write lag)
- [ ] Does the logic **read back something it just wrote**? Search/index endpoints are often
      eventually-consistent (lag seconds+): a just-created record may not appear → duplicate-create
      or missed-delete. Prefer direct id reads / relationship APIs (read-after-write consistent)
      over search for current-state reads.
- [ ] **Concurrency:** can two runs overlap (debounced saves, parallel callers)? What prevents a
      double-create — a unique constraint? idempotent upsert? serialization?

### C. Partial failure & atomicity
- [ ] Multi-step sequences (create A, update B, archive C) are **NOT atomic** — what is the state if
      it dies midway? Is re-run idempotent so the next run HEALS it?
- [ ] **Fail-open / fail-closed posture stated.** A projection should usually be **fail-soft** — its
      failure must never block the core source-of-truth write.
- [ ] **Observability:** if it fails silently (fail-soft), will anyone KNOW? Log it. Decide if a
      stale projection needs an out-of-band repair path.

### D. Rate limits, batching, cadence
- [ ] **Call count per operation** (N records → N calls?). Use batch APIs to bound it regardless of N.
- [ ] **Retry configured** for 429/5xx (many clients need it enabled explicitly).
- [ ] **Trigger cadence:** how often does it fire (every keystroke-save? milestone? submit)? Add a
      delta-check to skip no-ops if chatty.
- [ ] **VOLUME-CASCADE audit:** if the change alters a VOLUME assumption (a new writer, a pagination
      fix, a bigger batch), re-audit EVERY downstream consumer of that volume: single-page reads
      with no cursor loop, batch-call input caps, and **ordering/positional assumptions in result
      handling** (a `results[i] → inputs[i]` mapping breaks the moment a call is split). A capacity
      fix upstream EXPOSES capacity assumptions downstream — walk the whole chain.

### E. External-object correctness
- [ ] Object addressed by its stable **type id**, not display label (labels get renamed/duplicated).
- [ ] **Enum/option values match EXACTLY** (case + spelling) or the write fails. Verify option
      values against the live system, not memory.
- [ ] **Value types match the API's expectations** (many CRM APIs require string values —
      stringify numbers/booleans/dates).
- [ ] **Associations/relations = correct type AND direction.**
- [ ] **Token SCOPES** for the external object (read + write + relations); a missing scope is a
      runtime 403 that fail-soft will SWALLOW silently.
- [ ] Permanent-vs-editable schema choices (internal names, unique flags) verified before creating.
- [ ] **DEPLOY ORDERING — schema-first:** does the change need an external artifact (property,
      relation definition, enum option) to EXIST before the code that writes it runs? State the
      order explicitly: create → verify via an API read-back → THEN ship code. A write to a
      nonexistent property fails, and fail-soft swallows it — records silently never created.
      **Check the target object's REQUIRED properties before building** — *required ≠ existing*.

### F. Migration / parallel-run
- [ ] If replacing an existing projection, run **BOTH in parallel** until verified (strangler
      migration); state which is **authoritative**.
- [ ] **Legacy data:** does existing data have the new identity key? Backfill plan — or N/A.
- [ ] **Verify on a BRAND-NEW record** (true zero state), not by wiping state — projections persist
      independently and mask staleness (the "green-but-stale" trap).

### G. Deliberate duplication (bundler/runtime constraints)
- [ ] Logic that must run in more than one entrypoint but CANNOT be shared (bundler ships only the
      entrypoint; no module sharing) must be **inline-duplicated**. Add a **KEEP-IN-SYNC** banner at
      each copy + a **parity test**, and register it in the guards registry (`SKILL.md` in this folder).

### H. Third-party APIs
- [ ] **Verify the external system's LIMITS empirically before designing around them** — a
      one-question probe script against the real API beats documentation (a probe once found a hard
      input-size cap nothing in the docs mentioned).
- [ ] **Inject the transport/io at the boundary** (an adapter the caller supplies) — the module then
      tests with fakes, probes with local fetch, and ships dormant regardless of the runtime's HTTP
      libs; ownership of either side can change without a rewrite.
- [ ] **Verification tiers: fake it (unit) → probe it (live one-question scripts) → integrate
      (gated).** The middle tier is the one people forget — and the one that finds the vendor's
      real behavior.
- [ ] **Secrets:** API keys server-side ONLY — never in the repo, a client file, or the browser.
      Design the not-configured path (missing secret ⇒ fail-open with a reason, zero network calls).
- [ ] **PII: name exactly what data crosses to the third party and on what basis** (consent
      language / DPA) — a go-live gate, not an afterthought. Until settled: redacted/synthetic
      samples only.
- [ ] **Fail-open toward the user's core action** — the user's save/submit must never depend on the
      third party being up. Every external call returns a reason, never throws into the core path.

### I. Platform automations / workflow enrollment (the write-as-trigger blind spot)

Your writes to a shared platform can be automation TRIGGERS. For ANY new or changed write of a
property, property VALUE, or relation/label, ask — and get answers from whoever owns the automation
side, not assumptions:

- [ ] **Which automations enroll on what this change writes?** A feature can be code-complete and
      dead: the code writes property A but the automation triggers on property B, which nothing
      writes → zero effect, silently. The trigger the automation reads and the property the code
      writes MUST be confirmed to be the same one.
- [ ] **Are enrollment criteria exact enough?** An automation matching "records associated with X"
      without filtering the association TYPE can sweep in the wrong population (e.g. non-users
      receiving user-facing emails).
- [ ] **Does the write ENROLL records in automations unintentionally?** Always-set properties are
      enrollment surface — a test marker set on every record can enroll real users in test
      automations.
- [ ] **Who owns the automation side?** These are platform-side artifacts outside the repo — name
      the owner and the handoff in the plan. Conversely: an automation can OVERWRITE what your code
      depends on.
