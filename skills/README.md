# Agent Workflow Skills (project starter)

A reusable set of agent skills extracted and generalized from a real project. Each skill is a
folder containing a `SKILL.md` in **Claude Code's native skill format** — a YAML frontmatter block
(`name` + `description`) followed by the instructions. Copy the folders into a new project's
`.claude/skills/` directory and Claude Code auto-discovers them: the `description` tells the agent
when to use each one, and you can invoke any of them directly by typing `/<name>`.

They also read fine as plain markdown, so this repo doubles as the browsable reference copy.

## The workflow loop

These skills are a **system**, not independent documents. Together they enforce one loop:

```
SESSION START ──▶ read the top handoff, verify state, brief the user   (/session-startup)
      │
      ▼
PLAN ──────────▶ ground in code, build the impact model, get the "go"  (/plan-first
      │                                                                 + its checklist)
      ▼
IMPLEMENT ─────▶ exactly the approved edits, stop on surprise
      │
      ▼
VERIFY ────────▶ agent pre-checks, then the USER verifies in the real environment
      │
      ▼
LOG ───────────▶ one as-built entry per verified unit                  (/log-implementation)
      │
      ▼
SESSION END ───▶ current-state sweep + write the handoff               (/write-handoff)
```

## The skills

| Skill | What it does | When it's used |
|---|---|---|
| [`session-startup/`](session-startup/SKILL.md) | Required reading, standing rules, verify-state-with-commands, the 4-part briefing | First thing, every session |
| [`plan-first/`](plan-first/SKILL.md) | The plan-first workflow (Phases 0–8) + the guards registry template | Before ANY code change |
| ↳ [`change-impact-checklist.md`](plan-first/change-impact-checklist.md) | The dependency-impact checklist (§§1–8) the plan phases walk | Inside plan Phases 2 and 7 |
| [`log-implementation/`](log-implementation/SKILL.md) | One as-built entry per verified unit of change | After each user-verified change |
| [`write-tests/`](write-tests/SKILL.md) | Conventional testing practice (pyramid, AAA, test-with-the-change) + agentic pins/guards/tripwires | Writing any test; choosing what kind a change needs |
| ↳ [`test-taxonomy.md`](write-tests/test-taxonomy.md) | All test kinds + the growth ladder (coverage → property-based → mutation → integration → E2E → CI) | Reference, on demand |
| [`write-commits/`](write-commits/SKILL.md) | Commit message conventions — Conventional Commits types + the seven timeless rules | Every commit / commit recommendation |
| [`write-handoff/`](write-handoff/SKILL.md) | The 13-section session handoff + the pre-handoff staleness sweep | Once, at session end |
| [`prompt-coaching/`](prompt-coaching/SKILL.md) | Standing instruction: coach the user's prompts every turn | Every turn, every session (standing rule) |
| ↳ [`core-vocabulary.md`](prompt-coaching/core-vocabulary.md) | Living map of engineering concept families (conventional vs house-style) — grows with every project | Reference the coaching draws from |
| ↳ [`problem-classes.md`](prompt-coaching/problem-classes.md) | Living map of bug classes — symptom → class name → standard mitigations | Named aloud whenever a session hits a bug |

Not skills, but part of the kit:

| File / folder | What it is |
|---|---|
| [`AUTHORING.md`](AUTHORING.md) | The style guide for writing/editing skills in this kit — read before adding skill #6 |
| [`ROADMAP.md`](ROADMAP.md) | The kit's own forward plan (Now/Next/Later with triggers) — simplify · generalize · formalize |
| [`templates/`](templates/) | Starter data files (handoff/implementation/plan/bug logs · TODO with Now/Next/Later triage · ARCHITECTURE overview with rot-guards) + the `CLAUDE.md` starter block |

## Shared file conventions

The skills read/write these **data files** in the project (the skills are instructions; these are
where the project's living state actually lives — rename consistently if you prefer another layout):

| Path | Purpose | Ordering |
|---|---|---|
| `.ai/HANDOFF_LOG.md` | Session handoffs — the live "where are we" pointer | **Prepend** — newest on TOP |
| `.ai/IMPLEMENTATION_LOG.md` | As-built history — what shipped and why | **Append** — newest at EOF |
| `.ai/PLAN_LOG.md` | Every plan, with status (⏳ PLAN → 🟢 APPROVED → ✅ RESOLVED) | Append — newest at EOF |
| `.ai/PLANS/<initiative>/` | Standalone formal plans for larger initiatives, each with its own README | — |
| `<bug log>.md` | Numbered bug log (open + resolved) — out-of-scope findings go here | Numbered `#N` entries |

Why the ordering matters: the handoff log is read top-first at every session start (newest must be
first); the implementation log is an append-only audit trail (history never reorders).

## Adopting in a new project

1. Copy the skill folders to `<project>/.claude/skills/` (not `AUTHORING.md` or `templates/` —
   those stay in this repo).
2. Copy the data-file skeletons from [`templates/`](templates/) into the project
   (`.ai/HANDOFF_LOG.md`, `.ai/IMPLEMENTATION_LOG.md`, `.ai/PLAN_LOG.md`, `.ai/TODO.md`,
   `.ai/ARCHITECTURE.md`, the bug log).
3. Fill in the **Project Configuration** block at the top of each `SKILL.md` — deploy command and
   owner, verification method, tech stack, paths.
4. Paste the block from [`templates/CLAUDE-md-starter.md`](templates/CLAUDE-md-starter.md) into the
   project's `CLAUDE.md` and fill its slots — it wires the loop (run `/session-startup` first,
   plan-first before code, the deploy boundary).

## Right-size the adoption — a menu, not a mandate (and not an excuse)

Projects differ in size and risk; the kit must scale its own adoption, in BOTH directions:

**Don't adopt by default (YAGNI).** The minimal, non-skippable core for ANY project is the loop
itself: `session-startup` + `plan-first` + `write-handoff`, their data files, and the standing
rules (stop-on-surprise, one-unit-per-verify, no code without a "go"). Everything else adopts on
its trigger:

| Piece | Adopt when |
|---|---|
| `write-tests` | the project has (or is about to have) a test suite |
| `log-implementation` | changes are frequent enough to need per-unit as-built records |
| `write-commits` | the git history matters (shared repo, releases, reviews) |
| `.ai/ARCHITECTURE.md` | there are layers/flows worth mapping (multi-layer systems, not scripts) |
| `prompt-coaching` | the user wants the teaching loop (for this user: always) |

**Don't skip by convenience.** Agents default to avoiding work — right-sizing is NOT that:

- The test for skipping is **the project's need and risk, never the executor's effort**. When in
  doubt, do the work (the full-walk-on-trivial-units rule keeps finding real issues on units
  that "looked skippable").
- **N/A must be earned**: a skipped piece is marked with its REASON, visibly — never silently
  omitted.
- **Skips are recorded decisions with a re-add trigger** ("skipped write-tests — no suite yet;
  adopt when the first testable logic ships"), so the decision resurfaces when conditions change.
- The non-skippable core above is exempt from right-sizing entirely — no project is too small
  to plan before coding.

(Within a skill, depth scales the same way — see `plan-first`'s "Scaling: light vs heavy plans"
and the test-taxonomy growth ladder: every phase runs, only the depth varies.)

## How the kit evolves (upstream first)

This repo is the **upstream**; each project's `.claude/skills/` copy is downstream. When a project
teaches a lesson that improves a skill, **update the skill here first** (anonymized, folded into the
section where it belongs — see [`AUTHORING.md`](AUTHORING.md)), then re-copy into active projects.
If only the project's local copy is patched, every other project keeps the old weakness and the kit
stops improving. Longer war stories go in [`lessons-learned/`](../lessons-learned/) — the skill
carries the distilled rule; the lesson file carries the narrative.

## Design principles baked into these skills

- **Understand first, plan second, execute last.** No code without a grounded plan and an explicit "go".
- **One unit of change per verify cadence.** Never batch ahead of verification.
- **Ground against the code, not the notes.** Logs and old plans rot; the code is the truth.
- **Append-only logs never rot; current-state docs do.** Every current-state doc needs an update
  trigger — that's what the pre-handoff sweep is for.
- **Write for the weakest future reader.** A handoff must survive being read by a less capable
  model (or a tired human) with zero inference required.
- **Right-size everything — in both directions.** Adopt on trigger, not by default (YAGNI); skip
  only on the project's need, never the executor's convenience — and every skip is a recorded
  decision with a re-add trigger.
