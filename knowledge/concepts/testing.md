# Testing

> **Covers:** How behavior is verified: the kinds of tests, the regression tests this kit labels by intent, and the ladder for adopting heavier tooling one rung at a time.

## Terms

- **regression** — something that used to work breaking again
- **change-detector test** — a test that just restates the code (e.g. `expect(color).toBe('#333')`), so
  it breaks on every intended change and never catches a real bug — an anti-pattern
- **tautological test** — a test that can't fail: its expected value is computed with the code's own
  logic, or it only checks what its mocks were told to return — an anti-pattern
- **test behavior, not implementation** — assert what code does for its caller, not how it does it;
  a good test fails when behavior breaks and survives a refactor
- **characterization test** — freezes what existing code does TODAY, bugs included, so you can
  refactor it safely (Michael Feathers, *Working Effectively with Legacy Code*). Not the same as a
  regression test, which protects behavior you DECIDED on
- **differential test** — runs two implementations of the same logic on the same inputs and
  compares the results, e.g. a client and a server validator sharing one table of test cases
  (formerly "drift guard" / "parity test" in this kit)
- **expected-failure test** — a test marked as expected to fail, so the suite turns red the day it
  starts passing (pytest `xfail(strict=True)`, Vitest `test.fails`); used to detect a planned
  event (formerly "tripwire" in this kit)

## Conventional kinds (industry-standard vocabulary)

| Kind | Scope / speed | What it proves | Typical tooling |
|---|---|---|---|
| **Unit** | One function/module, in memory, ms | The logic does what it says, incl. failure modes and boundaries | Vitest, Jest, pytest, JUnit |
| **Integration** | Several real pieces together (module + real DB, two services) | The pieces actually fit — wiring, schemas, auth | Same runners + real/containerized deps |
| **End-to-end (E2E)** | The real app, driven like a user, minutes | The whole system works for a real flow | Playwright, Cypress |
| **Smoke** | A handful of E2E-ish checks after a deploy | The deploy didn't brick the core paths | A tagged subset of E2E |
| **Regression** | Any tier | A previously-fixed bug stays fixed; a decided behavior stays decided | Ordinary behavior tests — added or strengthened when a bug reveals an untested behavior |
| **Acceptance / UAT** | Human or automated, against requirements | The feature does what the stakeholder asked | Manual scripts with acceptance-criteria checklists; BDD |
| **BDD / Gherkin** | Requirements as executable `Given/When/Then` | The spec itself is testable — no reinterpretation gap | Cucumber, SpecFlow |
| **Contract** | The boundary between two systems | Each side honors the agreed request/response shapes | Pact; fixture-replay tests |
| **Golden master / snapshot / approval** | Any tier, replaying a real captured input | The output for a real captured payload is still exactly the same | Vitest/Jest snapshots, ApprovalTests; record-replay tools |
| **Characterization** | Usually unit, around legacy code | What the code does TODAY is recorded before you refactor it | Ordinary runners; often snapshot-style |
| **Property-based** | Unit tier, generated inputs | Invariants hold for HUNDREDS of random inputs, not 5 hand-picked ones | fast-check, Hypothesis |
| **Mutation** | Meta — tests the tests | Each deliberate code-break is caught by some test (survivors = weak tests) | Stryker, mutmut |
| **Performance / load** | System under traffic | Latency/throughput budgets hold | k6, Locust |
| **Static analysis** | No execution at all | Type errors, lint violations, known-vulnerable deps | TypeScript, ESLint, audit tools |

Supporting process conventions: tests run in **CI** on every push (red blocks merge) · **coverage**
reports find untested branches (never a target) · **flaky** tests are quarantined and fixed, not
retried forever.

## Agentic extensions (constraints on code evolution — see the `write-tests` skill for rules)

| Kind | What it proves | When to write one |
|---|---|---|
| **Regression test for a decision** | A decided behavior/value hasn't drifted | Any invariant a plan says is "enforced by convention" |
| **Differential test** | Two deliberate copies of logic still agree | Every guards-registry entry with >1 copy |
| **Expected-failure test** | A planned external event happened (red = working) | Any unwired activation or go-live flip worth detecting |
| **Flag-off regression test** | Dark-launched (data-gated) code changed nothing live | Every dark-launch edit |
| **Golden master** | The real engine still handles a real captured payload identically | External contracts; after the first real payload exists |

## The growth ladder — adopt deliberately, one rung at a time

Each rung multiplies the value of the rungs below it. Adopt a rung when its trigger appears, not
before — premature tooling is maintenance debt.

1. **A solid hermetic unit suite + test strategy README** — the foundation; everything else assumes it.
1.5. **The lint check** — *trigger: any codebase layer your tests read as text rather than
   execute (JSX, templates, untyped scripts), and no CI yet.* Cheap, closes a whole signal-less
   class; for solo/agentic projects it arrives long BEFORE rung 7 (where lint conventionally
   lives, inside CI). Recipe in the `write-tests` skill § "The lint check".
2. **Coverage reporting** (`--coverage`) — *trigger: you're unsure which branches are untested.*
   Read it as a map of gaps; never set a threshold target without understanding Goodhart's law.
3. **Property-based tests** — *trigger: a function's input space is large (parsers, date math,
   merge logic) and hand-picked cases keep missing edges.*
4. **Mutation testing** — *trigger: the suite is large and you want to know if it would actually
   catch a bug (especially when agents wrote many of the tests).* Run occasionally, not per-commit.
5. **Integration tests** — *trigger: bugs keep appearing at boundaries the unit suite can't see
   (wiring, schemas, permissions, two systems disagreeing), or the project is mostly glue code
   around external systems.* This rung can come EARLY — for integration-heavy projects it matters
   more than rungs 2–4; the pyramid is a default, not a quota.
6. **E2E smoke suite** (Playwright) — *trigger: manual browser-verify of the same core flows is
   eating real time every session.* Keep it small (5–10 flows); flakiness grows with size.
7. **CI gate** — *trigger: more than one person/agent merges code, or you've merged something with
   a red suite once.* The suite + lint on every push; red blocks merge. This is the rung that turns
   tests into a gauntlet — everything below it is optional until the machine enforces it.
