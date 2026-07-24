# Test Taxonomy — reference

Companion to `SKILL.md`. Two sections: the kinds of tests (conventional first, then agentic
extensions), and the growth ladder for adopting heavier tooling deliberately.

## Conventional kinds (industry-standard vocabulary)

| Kind | Scope / speed | What it proves | Typical tooling |
|---|---|---|---|
| **Unit** | One function/module, in memory, ms | The logic does what it says, incl. failure modes and boundaries | Vitest, Jest, pytest, JUnit |
| **Integration** | Several real pieces together (module + real DB, two services) | The pieces actually fit — wiring, schemas, auth | Same runners + real/containerized deps |
| **End-to-end (E2E)** | The real app, driven like a user, minutes | The whole system works for a real flow | Playwright, Cypress |
| **Smoke** | A handful of E2E-ish checks after a deploy | The deploy didn't brick the core paths | A tagged subset of E2E |
| **Regression** | Any tier | A previously-fixed bug stays fixed; a decided behavior stays decided | Ordinary tests written per bug fix |
| **Acceptance / UAT** | Human or automated, against requirements | The feature does what the stakeholder asked | Manual scripts with must-pass checklists; BDD |
| **BDD / Gherkin** | Requirements as executable `Given/When/Then` | The spec itself is testable — no reinterpretation gap | Cucumber, SpecFlow |
| **Contract** | The boundary between two systems | Each side honors the agreed request/response shapes | Pact; fixture-replay tests |
| **Property-based** | Unit tier, generated inputs | Invariants hold for HUNDREDS of random inputs, not 5 hand-picked ones | fast-check, Hypothesis |
| **Mutation** | Meta — tests the tests | Each deliberate code-break is caught by some test (survivors = weak tests) | Stryker, mutmut |
| **Performance / load** | System under traffic | Latency/throughput budgets hold | k6, Locust |
| **Static analysis** | No execution at all | Type errors, lint violations, known-vulnerable deps | TypeScript, ESLint, audit tools |

Supporting process conventions: tests run in **CI** on every push (red blocks merge) · **coverage**
reports find untested branches (never a target) · **flaky** tests are quarantined and fixed, not
retried forever.

## Agentic extensions (constraints on code evolution — see SKILL.md for rules)

| Kind | What it proves | When to write one |
|---|---|---|
| **Pin** | A decided behavior/value hasn't drifted | Any invariant a plan says is "enforced by convention" |
| **Drift / parity guard** | Two deliberate copies of logic are still identical | Every guards-registry entry with >1 copy |
| **Tripwire** | A planned external event fired (red = working) | Any dormant activation or go-live flip worth detecting |
| **Inertness pin** | Dormant/data-gated code changed nothing live | Every DATA-GATED INERT edit |
| **Replay / golden-master** | The real engine still handles a real captured payload identically | External contracts; after the first real payload exists |

## The growth ladder — adopt deliberately, one rung at a time

Each rung multiplies the value of the rungs below it. Adopt a rung when its trigger appears, not
before — premature tooling is maintenance debt.

1. **A solid hermetic unit suite + taxonomy README** — the foundation; everything else assumes it.
2. **Coverage reporting** (`--coverage`) — *trigger: you're unsure which branches are untested.*
   Read it as a map of gaps; never set a threshold target without understanding Goodhart's law.
3. **Property-based tests** — *trigger: a function's input space is large (parsers, date math,
   merge logic) and hand-picked cases keep missing edges.*
4. **Mutation testing** — *trigger: the suite is large and you want to know if it would actually
   catch a bug (especially when agents wrote many of the tests).* Run occasionally, not per-commit.
5. **E2E smoke suite** (Playwright) — *trigger: manual browser-verify of the same core flows is
   eating real time every session.* Keep it small (5–10 flows); flakiness grows with size.
6. **CI gate** — *trigger: more than one person/agent merges code, or you've merged something with
   a red suite once.* The suite + lint on every push; red blocks merge. This is the rung that turns
   tests into a gauntlet — everything below it is optional until the machine enforces it.
