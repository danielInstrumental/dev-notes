# Testing

> **The question this answers:** What kinds of tests does this project need, how are they set up
> from day one, and what must pass before shipping?

_Status: in progress. Section 1 is written; sections 2 to 5 are still outlines._

## 1. The map

Every test can be described two ways at once:

- **Scope:** how much of the system runs.
- **Purpose:** what the test is there to tell you.

A test's full name uses one of each. In "a unit regression test", unit is the scope and regression
is the purpose. In "an end-to-end smoke test", end-to-end is the scope and smoke is the purpose.

A test that fails is called **red**. One that passes is **green**.

### Scope: how much of the system runs

Each level exercises more of the real system than the one above it. It therefore provides stronger
evidence, and costs more to write, run and maintain.

| Scope | What is exercised | What it verifies | What it cannot detect | Typical quantity |
|---|---|---|---|---|
| **Static check** | No code is executed. A tool analyzes the source (linter, type checker) | The absence of undefined names, unresolved imports and type errors | Whether the logic is correct | Applied to the whole codebase on every run |
| **Unit** | A single function or module, in memory, in milliseconds | The logic of that unit is correct, including its error handling | Whether the units are integrated correctly | Many. Written with each change |
| **Integration** | Several real components together, such as a function and a live API or database | The components interoperate: data formats, permissions and configuration | Whether the complete user flow works | Fewer. Concentrated at the boundaries between systems |
| **End-to-end** | The deployed application, operated as a user would operate it | A feature works from start to finish | Which component is at fault when it fails | Few. The three to five most critical user flows |

Unit and end-to-end tests serve different purposes, so a project needs both from the outset: many
unit tests to verify the logic, and at least one end-to-end test to verify that the application
works as a whole.

### Purpose: what a failure indicates

The first four apply to every project. The remaining three apply in specific circumstances.

| Purpose | A failure indicates | When to use |
|---|---|---|
| **Behavior test** | The code's observable behavior no longer matches its specification | By default. Most tests in a suite are of this kind |
| **Regression test** | Previously working behavior has been broken by a later change | After fixing a defect that exposed untested behavior, or to protect a deliberate design decision from unintended change |
| **Smoke test** | A critical path is not functioning, and the build is not fit to release | Established early in the project: a small set of fast end-to-end checks run before each commit or deployment |
| **Acceptance test** | The feature does not satisfy its acceptance criteria | For each feature, verified against the agreed criteria. Frequently performed as a manual checklist |
| **Characterization test** | Existing behavior has changed, whether or not that behavior was correct | Before refactoring legacy code, or code whose behavior is not fully understood |
| **Differential test** | Two implementations required to produce the same result have diverged | When the same logic is implemented in more than one place, or a rewrite must reproduce the behavior of the system it replaces |
| **Expected-failure test** | An anticipated change has taken effect, and the test must now be updated | Occasionally: to signal that a pending dependency or planned change has gone live |

Before modifying a failing test, identify its purpose. Changing a test solely to make it pass
discards the information it was written to provide.

Definitions and the full list of test kinds are in the [Testing chapter](../knowledge/concepts/testing.md).

## 2. Talk it through

_To write: the questions to discuss with the agent before any code exists, such as how the agent
will run the app and which user flows are critical._

## 3. Set it up

_To write: the day-one boilerplate. Vitest, the tests folder, one command to run everything, and the
first end-to-end check._

## 4. As you build

_To write: the short checklist for each change. What kind of test does this need?_

## 5. Go deeper

_To write: links to the glossary chapter, the `write-tests` skill and the prompts._
