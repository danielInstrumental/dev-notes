---
name: plan-first
description: Plan-first workflow for any code change — ground the plan in current code, trace every consumer, build the dependency impact model, and wait for an explicit "go" before implementing. Use before ANY code change.
---

# Plan First (plan before implementing)

> ## Project Configuration — fill in per project
> - **Deploy/verify boundary:** <who deploys, who verifies, and how — e.g. "the user uploads and verifies in the browser">
> - **Companion checklist:** `change-impact-checklist.md` (in this skill's folder — walk it in Phase 2 and again in Phase 7)
> - **Plan log:** `.ai/PLAN_LOG.md` · **Standalone plans:** `.ai/PLANS/<initiative>/`
> - **Bug log path:** <where numbered out-of-scope findings go>
> - **Pre-merge checks:** <the project's syntax/lint/test commands run before handing off>

## Purpose

Produce a grounded, decision-complete plan before any code is written. No code until a grounded
plan exists, the dependency impact model is built, decisions are confirmed, and the user gives an
explicit "go".

## When to use

Before ANY code change — bug fix, feature, refactor, copy tweak. Every phase always runs; only the
**depth** scales (see "Scaling: light vs heavy plans" below). When the user invokes this skill or
asks for a plan, follow every phase below, in order.

---

## Standing rules (never break, regardless of phase)

1. **NO CODE before an approved plan + explicit "go".** Understanding a pattern is not approval.
   Discussing a fix is not approval. A plan existing is not approval.
2. **Respect the deploy/verify boundary** (configuration block above).
3. **One unit of change per verify cadence.** Propose → user confirms → implement ONE unit → user
   verifies → only then propose the next. Never batch ahead, never "while I'm here".
4. **Log to the implementation log only AFTER the user verifies.** Never before. Don't edit the
   frozen PRIOR handoff mid-session.
5. **Out-of-scope findings go to the bug log** as new numbered entries — never folded into the
   current change's scope.
6. **Stop on surprise.** If implementation or verification reveals ANYTHING the impact model did not
   predict — an extra consumer, an unconditional code path, a different data type — STOP, report it,
   and wait. Do not improvise a fix for the surprise inside the approved scope.

---

## Phase 0 — Ground the plan in CURRENT code

A plan is grounded only when every claim in it was verified against the code as it exists **today**.

- Read the bug-log entry (and any addenda), the related plan/implementation-log entries, and any
  notes they reference.
- Then **confirm every claim in the actual code**: open the files, find the real line numbers, verify
  the described behavior is still the behavior. Bug entries and old plans rot — line numbers drift
  with every edit above them.
- **If a plan already exists from a previous session: re-verify ALL of its code references before
  presenting it.** Treat its line numbers and "today" descriptions as stale until proven current.
- **When the change targets an external system** (a CRM property, an API field, a schema), resolve
  the target by its exact identifier in the live system — not by a guessed keyword. Cross-check the
  internal name AND the type before declaring it wireable. (Lesson: two fields were mis-wired because
  a keyword guess matched the wrong property; the display label was the reliable key.)
- **Pattern reuse never skips grounding.** "Same fix as #X" speeds the design, but the new surface
  gets its own full Phase 0–2 pass. (Lesson: a "copy of a previous fix" got its own impact model,
  which found an unconditional code path the pattern-copy alone would have missed.)
- **"Verify at edit time" is self-confessed incomplete grounding.** Grep your own plan for "verify
  at edit/implement time" before presenting — each instance is Phase-0 debt, and closing them finds
  real errors.

---

## Phase 1 — Reference trace

Sweep the codebase for **every consumer and writer** of the thing being changed. Present as a table:

| Consumer / writer | Where (file:line) | Today | After the fix |

- Grep for the state key, the function, the event name, the CSS class, the prop — every handle on it.
- Include every layer: components, central orchestrators, server/API functions, event listeners,
  summary/display views, styles — and any standalone surfaces that carry their own copies of patterns.
- **Tests are consumers too:** include the pins/guards that constrain the thing being changed. A
  trace that omits them under-predicts the co-edits — this row feeds the Phase-4 predicted-test-impact
  section.
- The trace must find the consumers the bug entry **didn't know about** — that's its job.

---

## Phase 2 — Dependency impact model (checklist §§1–5)

Build the model BEFORE designing the edit. Walk the companion checklist §§1–5 explicitly and write
the walk down:

- **§1 Unit of change** — UI field / state key / validation rule / workflow logic / persistence shape.
  Name what is NOT changing (no schema change, no validation change, etc.).
- **§2 Consumers** — within-module AND cross-module: validation, render conditions, submit payload,
  autosave path, summary views, cross-step gates, label/display maps (misses here fail silently).
- **§3 Derived state** — completion tracking, navigation gating, conditional sections, computed flags.
  State **transitions**: what flips, what freezes, what must NOT flip.
- **§4 Side effects** — dependent-field clearing, upload/file-reference resets, hardcoded default key
  arrays, re-validation triggers, cascading saves, browser/UA quirks the render layer inherits.
- **§5 Persistence / schema / contracts** — stored state shape, API payload shape, external-system
  property expectations, compatibility with existing saved data, server merge semantics (a shallow
  spread merges differently than you assume — verify, don't assume).
- **§6 Failure modes & invariants** (plan-level addition) — three questions, every change:
  1. **How can the NEW code itself fail at runtime?** Network failure, HTTP rejection, **partial
     failure** (a multi-step sequence dying between steps), **race conditions** (async saves,
     event-dispatch vs independent-fetch ordering).
  2. **What is the fail-open / fail-closed posture of any guard or check?** State it explicitly.
     Both postures are valid — *unexamined* is not.
  3. **What invariants must hold after the change?** Name them. An invariant the plan doesn't name
     is an invariant the implementation can break silently. **And state what ENFORCES each
     invariant / "no-impact" claim:** *by construction* (structural — cannot regress), *by test pin*,
     or *by convention*. Convention-enforced claims MUST gain a pin or a KEEP-IN-SYNC marker —
     decisions regress when forgotten; constructions don't.
- **Lifecycle & entry-point sweep** — §2 covers downstream *readers*; THIS covers the *inbound*
  pathways that POPULATE the touched state and the re-derivation paths (the recurring blind spot,
  because prefill / seed / heal-on-load effects fire with no obvious call site in the changed file).
  Enumerate the project's FIXED set of these once, then walk each, marking **applies / N/A**:
  fresh entry (every surface that can create the record) · server-side seeding/prefill · inbound
  integrations/ingest · re-validation (load-time healing + navigate-away) · post-submit/locked
  state · outbound projection/sync (including the empty/zero case) · display/summary · **load-time
  AUTO-WRITERS** (effects that write state on page open with NO user action — they meet
  server-injected state BEFORE any user edit and amplify multi-tab races).
  **Plus the FUTURE-writer question:** the sweep audits TODAY's writers — if the change alters a
  state key's shape or semantics, name the shape/invariant a *future* writer must honor as an
  explicit invariant in the plan (normalize-on-read protects readers only).
- **Review-dimensions sweep** (one line each — call out the ones that APPLY, mark the rest N/A so
  nothing is silently skipped): **regression surface** · **implicit contracts** (unenforced
  assumptions: shapes, ordering, semantics) · **idempotency** (is running it twice safe) ·
  **security/authorization** (server-enforced or UI-only? data exposure?) · **observability** (when
  it fails, will anyone KNOW?) · **performance** (added reads/calls/renders per operation) ·
  **accessibility** (labels, focus, announcements) · **validator drift** (does this ADD, CHANGE, or
  DUPLICATE a rule enforced in more than one place? If so: update ALL copies as a SET, or consciously
  accept the duplication WITH a keep-in-sync mechanism — a prominent "KEEP IN SYNC with X" comment at
  each copy. Name the copies and the sync plan. This is the #1 recurring bug class. ⚠️ **Direction
  matters:** a *destructive* change (remove/rename a requirement) not mirrored to the server makes
  the server STRICTER than the client → false rejection of valid users (HIGH severity); an *additive*
  change not mirrored makes the server looser → the backstop silently weakens.)
- **Interaction crossings** (checklists don't catch these): for feature-shaped units, walk **every
  state's exits**, cross **each user action with each state transition** (e.g. dismissing a
  processing banner must not suppress the later ready notification), and ask **"what does success
  disable / what does failure retry?"** (a "once" marker must mean once *successfully*).

---

## Phase 3 — Design

- Number every edit (A1, A2, B1 …) with exact file + insertion point, and include the actual code for
  anything non-trivial. Smallest viable diff; prefer single-chokepoint fixes over per-mirror patches
  ("fix the source, not each mirror").
- State what is deliberately **NOT in this pass** (deferred halves, optional follow-ons) so deferral
  is a recorded decision, not an omission.
- Note precedent patterns being reused and where they live — with the load-bearing details included
  (the detail you omit is the one that bites).
- **Classify every edit by SHIPPING MODE** — each mode has its own proof obligation:
  - **DORMANT**: new code that nothing imports/registers — ships inert with no way to run.
    Proof = a dormancy check (exists / not registered / not required by any entrypoint).
  - **DATA-GATED INERT**: an edit to live code whose new branch is unreachable until an external
    precondition exists. Proof = (i) a check that the gating value is absent from all production
    data, (ii) an **inertness pin** (existing behavior byte-identical against current fixtures),
    (iii) copy-parity where applicable. The gate is DATA, not a config flag — nothing to toggle off.
  - **LIVE**: behavior changes now — full verification depth.
  Don't mix LIVE with the other modes in one unit unless inseparable.
- **When a plan ADDS a protective guard, re-walk every existing path that previously DELETED or
  OVERWROTE the newly-protected thing** — each such path's outcome silently changes and must become
  a NAMED DECISION, not an accident.
- **Multi-writer fields need a stated PRECEDENCE CHAIN.** When a change adds a writer to any state
  slot, state the full chain (e.g. user-typed > seeded > ingested), name the merge policy implementing
  it (e.g. fill-only-empty), and confirm the ordering guarantee that makes any arrival order converge.
  Distinguish **safe-by-exclusion** (never mapped at all — stronger) from **safe-by-precedence**
  (mapped, resolved by merge order); say which one each contested field relies on.
- **EVIDENCE TIERS for load-bearing numbers.** Classify every constant the design leans on:
  **measured** (we watched it) → **documented-verified** (read in the vendor's live docs during this
  project, cite the URL) → **documented-remembered** (model/training knowledge) → **inferred**.
  State each number's tier; retiring a verification probe requires UPGRADING the tier, never
  trusting it.
- **Tiered designs answer "which tier is the user's concrete case?" IN THE PLAN.** Every threshold
  word (oversize, large, slow) gets its number, its UNIT, and which pipeline leg it governs — and the
  plan places the motivating real-world case in its tier explicitly.
- **When a decision ITERATES, render the option space as a table with per-option costs before
  locking.** The losing options' rationales stay in the log so the choice is never re-litigated
  from scratch.

---

## Phase 4 — Verification plan (written BEFORE implementing)

Two halves, both planned up front:

**Pre-handoff (agent, before handing to the user):**
- **Unit tests for any pure logic/predicate — required, not optional, whenever the change has a
  testable branch** (guards, validators, transforms, heal/reconcile rules). Test the matrix: happy
  path, each failure mode, boundary cases (equal dates, empty/null/malformed input), and the no-op
  cases (nothing changed → nothing written). Report as N/N passed with the case list.
- **PREDICTED TEST IMPACT — required for any change touching suite-covered code, written BEFORE
  implementing.** Four lists: **(a) tests that MUST redden** — an expected red is PROOF the edit
  landed, not a failure · **(b) tests that MUST stay green** — the inertness/regression pins ·
  **(c) new tests needed** — including helper/fake extensions · **(d) tests whose NAMES/comments
  become intent-divergent** — still green but now describing the old behavior; rename WITH the
  change, never leave a green lie.
- Grep-verify every edit landed; run the project's syntax/diagnostic checks.
- **When the unit touches an EXTERNAL system, add the middle verification tier — fake it (unit) /
  probe it (live one-question scripts, redacted data only) / integrate (gated).** The middle tier is
  the one people forget — and the one that finds the vendor's real behavior (a live probe once found
  a hard document-size cap no documentation mentioned).
- **When the unit produces a CONTRACT/spec with examples, machine-verify the examples through the
  real engine** — a spec example that parses through the real code cannot drift from the implementation.
- **A constraint can only be MEASURED from inside the environment that imposes it.** A probe that
  succeeds from the local machine proves the CONTRACT (wire shape, acceptance), never the RUNTIME
  ENVELOPE (execution ceilings, memory). State per probe result which of the two it proved.
- **Manufactured test artifacts are themselves a variable.** A probe failure may be the artifact,
  not the system (a programmatically-rebuilt file failed a pipeline the native equivalent passed).
  Prefer native/real artifacts; when a manufactured one fails, re-test with a differently-made one
  BEFORE concluding anything about the system.

**Post-deploy (user, in the real environment):**
- Written as **observable evidence**, not vague "check it works": which UI element, which network
  request (or its absence), which stored value, which error message verbatim.
- Include a **regression pass** (the unchanged paths still behave identically) and mark the
  **must-pass set** — the 2–3 checks that decide done/not-done.
- Ask the user to report observations in the gold-standard format:
  `1: <what they saw> ✓ · 2: <what they saw> ✓` — observed values, not just "confirmed".

---

## Phase 5 — Decisions + the approval gate

- End the plan with a **numbered decisions table**: each open choice, the options, and a clear
  recommendation (recommended option listed first, with the one-line WHY).
- Status marker on the plan entry: `⏳ PLAN — awaiting decisions + "go"`.
- **Wait for the explicit go.** Answers to decisions ≠ go. Ask if ambiguous.
- **The moment approval is given, record it in the plan-log entry** (flip to `🟢 APPROVED <date> —
  user confirmed <which decisions>`), so an interruption can't lose the approval state.
- **The PRE-GO RE-REVIEW is a standing offer.** For any unit beyond trivial, a full Phase 0–2 re-walk
  against the real code immediately before the go is cheap and has never come back empty. For DORMANT
  builds it finds mostly *integration-boundary and go-live issues*, not module bugs.
- **Name the plan's STAGE at the top — proposal-grade vs build-grade are different documents with
  different completion bars.** A PROPOSAL/ADR plan (is this worth doing?) is complete when every open
  item is *named and gated* — it deliberately stops short of numbered edits. A BUILD plan is complete
  when every edit is numbered and grounded. A proposal → build transition is a second planning pass,
  not a formality.

---

## Phase 6 — Implementation rules

- Implement exactly the numbered edits — nothing more. Read each edit site immediately before editing.
- Stop-on-surprise (standing rule 6) applies from the first keystroke.
- After editing: run the Phase 4 pre-handoff checks (unit tests, grep verification, diagnostics).
- Then hand to the user for deploy with the post-deploy verification list restated. Do not log
  anything yet.
- **Platform-settings changes are EDITS — no safety net sees them.** Any settings flip on a platform
  surface the integration touches (form options, property config, workflow toggles) changes deployed
  behavior with no code diff, no test red, no git trace. Announce it BEFORE flipping and impact-walk
  it like a code edit.

---

## Phase 7 — Post-implementation verification (against the model)

After implementing (and after the user verifies), verify the implementation **against the impact
model built in Phase 2** — not against memory:

> Confirm behavior matches across all validation scopes, the persistence schema, the write path,
> downstream consumers, and the render layer.
> **Surface anything the model predicted that didn't land, and anything noted as deferred.**

Walk the checklist's §6 verification surfaces and report which apply and what was observed.

---

## Phase 8 — Close-out (only after user verification)

1. **`IMPLEMENTATION_LOG.md`** — append the as-built entry at EOF (see the
   `log-implementation` skill).
2. **`PLAN_LOG.md`** — flip the entry's status to `✅ RESOLVED <date>`, noting whether the impact
   model held and any deviations.
3. **Bug log** — mark the entry `✅ RESOLVED <date>` in the heading + add a resolution block at the
   top of the entry (preserve the original text below). File any spawned findings as NEW numbered
   entries. The bug log is only for real deferred bugs/future work — approved decisions and completed
   deviations are logged in the implementation log, not as bugs.
4. **Project SSOT docs** — if the change touched anything a current-state document describes
   (a field's source/validation/mapping, an architecture claim), update that doc as part of close-out.
5. **Guards registry** — if the unit shipped or changed a GUARD or a duplicated rule, add/update its
   row in the registry below — at close-out, not "later". The pre-handoff current-state sweep
   (the `write-handoff` skill) is the end-of-session backstop.

---

## Guards & duplicated-rule registry (check Phase 2 against this)

A **guard** = a server-enforced check that gates an action (the authoritative line; any client
equivalent is UX-only, defense-in-depth). A **duplicated rule** = the same logic in more than one
place (validator-drift risk). When a plan touches a field, rule, state key, or status that ANY entry
below depends on, the plan MUST update that guard/copy too — or note explicitly why it's unaffected.
**Keep this table current as guards land — starts empty in a new project.**

| Guard / duplicated rule | Where (file) | Depends on (what a change might break) | Drift / failure note |
|---|---|---|---|
| _(none yet — add the first row when the first guard or deliberate duplication ships)_ | | | |

(This registry is the concrete companion to the Phase-2 **validator drift** + **§6 invariants**
checks: validator-drift asks "did I sync the copies?", the registry says "here are the copies/guards
that exist.")

---

## Scaling: light vs heavy plans

Every phase always runs — only the **depth** scales:

- **Light** (one rule in one file): trace table may be ~6 rows, design is one code block, decisions
  may be 3–4 wording/scope confirmations. Still: grounded line numbers, full checklist walk, a unit
  test of the predicate, explicit go. (Empirical: the full-walk-on-trivial-units rule keeps finding
  real issues on "display-only" units — accessibility gaps especially.)
- **Heavy** (multi-layer/multi-file): full HIGH-LEVEL SUMMARY up top ("read this"), exhaustive trace,
  per-edit lettering across files, server + client halves separated (Part A / Part B), and a
  verification plan with a numbered must-pass scenario list.

### Pre-building under an undecided fork (deadline readiness)

When you must build before an external decision lands: (a) write the CONTRACT first — it is the fixed
point every branch shares. (b) put an injected SEAM at every boundary whose owner is undecided
(io adapter / transport / driver hook) — the pivot then swaps a module, not a design. (c) ship
dormant only what is truly inert; UI can ship behind a **dev toggle** (URL-param pattern) with manual
verify. (d) track every assumption with its pivot path, and mark every deferral with WHAT it gates:
*building*, *finalizing*, or *activating*. (e) judge insurance code by OPTION VALUE (test-tooling,
audit capability, pivot speed), not by whether it runs in production.

---

## PLAN_LOG entry template

```
## [YYYY-MM-DD] — <BUG #N / FEATURE>: <one-line title> (⏳ PLAN — awaiting decisions + "go")

### ▶ HIGH-LEVEL SUMMARY (read this)

<What's wrong, the proven cause, the fix in one sentence, severity, blast radius.>

### Reference trace (verified in code today)
| Consumer / writer | Where | Today | After the fix |

### Checklist walk (§§1–5 + plan-level §6)
- §1 Unit: … (and what is NOT changing)
- §2 Consumers: …
- §3 Derived state: …
- §4 Side effects: …
- §5 Schema/contracts: …
- §6 Failure modes & invariants: runtime failures / partial failure / races · guard posture
  (fail-open/closed) · named invariants + what enforces each
- Review-dimensions sweep: regression surface · implicit contracts · idempotency · security/authz ·
  observability · performance · a11y · validator drift — applies / N/A each
- Lifecycle & entry-point sweep: <the project's enumerated inbound/re-derivation paths> —
  applies / N/A each

### Design (numbered edits)
- A1 / A2 / B1 …: file + insertion point + code
- Shipping mode per edit: DORMANT / DATA-GATED INERT / LIVE + its proof obligation

### Verification
- Pre-handoff: unit tests (cases) + grep/diagnostics
- Predicted test impact: (a) must-redden · (b) must-stay-green · (c) new tests · (d) intent-divergent renames
- Post-deploy (user): numbered observable checks + must-pass set

### Decisions to confirm
- (1) … [rec — why] vs alternative
- (2) …

### Status: ⏳ AWAITING decisions + explicit "go". NO CODE until then.
```

---

## Related skills

- `change-impact-checklist.md` (this folder) — the §§1–8 checklist Phases 2 and 7 walk.
- `session-startup` — runs before this: no plan is proposed until the startup briefing is presented.
- `log-implementation` — Phase 8's close-out entry, written only after the user verifies.
- `write-handoff` — the end-of-session sweep that backstops this skill's registry and status flips.
