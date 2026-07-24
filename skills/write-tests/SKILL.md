---
name: write-tests
description: How to write and maintain tests — conventional foundations (test pyramid, AAA structure, test-with-the-change, regression-test-per-bug-fix, hermetic rules) plus agentic extensions (pins, drift guards, tripwires). Use when writing any test, choosing what kind of test a change needs, or setting up a new project's suite.
---

# Write Tests

> ## Project Configuration — fill in per project
> - **Runner + location:** <e.g. "Vitest, suite in `tests/`, run `npm test` → expect N/N green">
> - **Suite constraints:** <e.g. "pure unit, hermetic — no network, no real credentials, no records created">
> - **CI status:** <"runs on every push via <CI tool>" or "MANUAL — run before every handoff" — name the gap honestly>
> - **Coverage tooling:** <e.g. "`vitest --coverage`" or "not yet adopted — see the growth ladder">

## Purpose

Tests are the constraint harness that lets code be trusted without trusting its author — human or
agent. A change without tests is a claim; a change with tests that were watched failing first is
evidence.

## When to use

Whenever writing a test, deciding what kind of test a change needs (the `plan-first` skill's
predicted-test-impact section feeds this), fixing a bug, or setting up a new project's suite.

---

## Conventional foundations (industry practice — the default)

1. **The test pyramid.** Many fast **unit** tests (one function/module, in memory, milliseconds) ·
   fewer **integration** tests (several real pieces together) · few **end-to-end** tests (the real
   app driven like a user, e.g. Playwright). The ratio is economics, not ideology: unit tests are
   cheap and pinpoint the broken line; E2E tests are slow, flaky, and only say "something broke
   somewhere." Buy confidence at the cheapest tier that can prove the thing.
   **The pyramid is a default shape, not a quota** — put each test at the tier where the risk
   actually lives. A unit test cannot prove wiring (a real schema, auth scopes, two systems
   agreeing); when a project is mostly glue around external systems, its middle tier legitimately
   grows. What stays true at every tier: hermetic-by-default below, real-things-in-play above, and
   never test at a higher tier what a lower tier can prove.
2. **Tests ship WITH the change — same unit, same commit.** "Tests later" never comes. The strict
   version is **TDD**: write the failing test first (red) → minimum code to pass (green) →
   refactor. The minimum bar is test-with-the-change.
3. **Every bug fix ships with the regression test that would have caught it — and run it BEFORE
   the fix to watch it fail.** A test never seen red proves nothing (it may pass vacuously).
4. **Structure: Arrange – Act – Assert.** Set up state, do the one thing, check the one outcome.
   One behavior per test; the test NAME states the behavior ("rejects a submission missing a
   required field") so a red test is its own bug report.
5. **Test doubles — use the right one and the right word:** **stub** (canned answers) · **mock**
   (canned answers + verifies how it was called) · **fake** (working lightweight substitute, e.g.
   an in-memory client) · **fixture** (canned data, e.g. a captured real payload — pseudonymize
   any real-user data before committing it).
6. **Hermetic by default.** Unit tests never touch network, filesystem, clock, or randomness —
   inject those through seams. A hermetic suite is safe to run anytime, anywhere, repeatedly.
7. **Test the matrix, not just the happy path:** each failure mode, boundary cases (empty / null /
   malformed / equal-dates), and the no-op cases (nothing changed → nothing written).
8. **CI is the enforcement layer.** Professionals run the suite automatically on every push/PR
   (e.g. GitHub Actions) and a red suite BLOCKS the merge. Without CI, every constraint is
   optional — if this project lacks CI, the config block above must say so and the suite runs
   manually before every handoff, no exceptions.
9. **Coverage is a gap-finder, never a target.** Use it to discover untested branches; never chase
   a percentage (Goodhart's law — tests written to hit a number verify nothing).

---

## Agentic extensions (constraints on how code evolves over time)

Conventional kinds test what code DOES. These test that decided things STAY decided — the failure
modes that matter most when agents edit code across many sessions:

- **Pin** — freezes a decided behavior or value so it can't drift silently. Write one whenever a
  plan names an invariant "enforced by convention" (see `plan-first` Phase 2 §6).
- **Drift / parity guard** — asserts two DELIBERATE copies of logic are still identical (compare
  source or behavior). Required for every entry in the `plan-first` guards registry.
- **Tripwire** — DESIGNED to go red when a planned event happens (a go-live flip, an external
  activation). A red tripwire is the signal working: rewrite it WITH the change it detects.
- **Inertness pin** — proves dormant/data-gated code changed nothing about live behavior
  (byte-identical outputs against current fixtures). Required for DATA-GATED INERT edits.
- **Replay / golden-master** — replays a real captured payload (pseudonymized) through the real
  engine and pins the exact output census. The strongest guard on an external contract.

**Rules that make these work:**

- **Never delete-to-green.** Before touching a red test, identify its KIND — a red pin means the
  edit landed (flip it with the change); a red tripwire means the event fired; a red behavior test
  means a bug. "Fixing" a guard to green destroys it.
- **Keep a taxonomy README in the suite** — a table classifying every test file's KIND and what
  each red means, plus the current expected count. A suite whose reds can't be diagnosed gets
  deleted-to-green under deadline pressure.
- **Predicted test impact before implementing** (from `plan-first` Phase 4): which tests MUST
  redden (proof the edit landed) · MUST stay green (regression pins) · are NEW · become
  intent-divergent (green but now misnamed — rename with the change).

---

## Choosing what to write (quick decision guide)

| The change is… | Write… |
|---|---|
| New pure logic (validator, transform, guard) | Unit tests for the matrix (happy / failures / boundaries / no-ops) — TDD if the spec is clear |
| A bug fix | The regression test FIRST (watch it fail), then the fix |
| Touching a deliberate duplicate | Run + extend the parity guard; register in the guards registry |
| A decision ("never write X", "always shape Y") | A pin naming the decision in its test name |
| Dormant / data-gated code | Inertness pin + a fake-driven unit matrix for the new branch |
| An external contract (vendor payload, API shape) | A fixture replay test with pseudonymized captured data |
| Hard to unit-test (real browser, real integration) | Escalate a tier — see `test-taxonomy.md`'s ladder — or a written manual QA checklist with observable must-pass checks |

---

## Related skills

- `plan-first` — predicted test impact (Phase 4), invariant enforcement (Phase 2 §6), and the
  guards registry every parity test pins.
- `log-implementation` — every entry reports the suite result (`N/N` + case list) as evidence.
- `write-handoff` — new pins/tripwires and their flip conditions go in the handoff's DO-NOT list;
  the tests README is a row in the pre-handoff sweep.
- `test-taxonomy.md` (this folder) — the full reference: all test kinds, when to reach for each,
  and the growth ladder (coverage → property-based → mutation → integration → E2E → CI; the
  integration rung can come early for boundary-heavy projects).
