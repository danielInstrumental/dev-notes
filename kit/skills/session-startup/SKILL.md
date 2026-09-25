---
name: session-startup
description: Load project context at the start of every session — read the top handoff, verify its state claims with commands, and present the required 4-part briefing before proposing or writing any code.
---

# Session Startup (project context loader)

> ## Project Configuration — fill in per project
> - **Role line:** You are an expert <STACK — e.g. "full-stack developer specializing in React and Node"> continuing an established project (**<PROJECT NAME>**).
> - **Deploy command + owner:** <e.g. "NEVER run `<deploy command>` — the USER deploys and verifies in the browser."> Decide who deploys and how changes are verified, and state it here.
> - **Codebase location:** <where the source lives, one line>
> - **Test suite:** <run command + currently-expected result, e.g. "`npm test` → expect N/N green">
> - **Extra required reading:** <any project docs beyond the standard logs — architecture overview, bug log path, SSOT docs>

## Purpose

Your first responsibility every session is to understand the *current* state before changing anything.

## When to use

First thing, every session — and again after any mid-session compaction or model switch (see the
rules below).

## Working principle

> **Understand first. Plan second. Execute last.**

This file is a **router**, not the source of truth. The **current handoff** and **the `plan-first`
skill** are authoritative; if anything here disagrees with them, they win. Keep this file pointing at the living
docs rather than duplicating their contents — duplicated content is how router files go stale.

---

## Required reading (in order)

1. **`.ai/HANDOFF_LOG.md` — read the TOP entry first.** This is the live state: newest session handoff
   at the top, with its own required-reading list, shipped-and-verified ledger, "pick up here" pointer,
   and open items. **Then follow that handoff's own required-reading list** — it's kept current each
   session and supersedes the static list here.
2. **The `plan-first` skill** (`SKILL.md` + `change-impact-checklist.md` in its folder) — the
   plan-first workflow (Phases 0–8) and the dependency-impact checklist.
3. **The bug log** — the numbered log of open + resolved issues.
4. **`.ai/IMPLEMENTATION_LOG.md`** — append-only as-built history (newest at EOF). Past entries explain
   *why* things are the way they are.
5. Any project-specific docs named in the configuration block above.

---

## Standing rules (non-negotiable — these govern every session)

1. **Respect the deploy/verify boundary** stated in the configuration block. If the user deploys and
   verifies, you write code + run pre-deploy checks, then hand off — never deploy yourself.
2. **No application code without an approved plan + an explicit "go".** Understanding a pattern,
   discussing a fix, or a plan merely existing is NOT approval. (Docs/log edits are exempt — they're
   not application code.)
3. **One unit of change per verify cadence.** Propose → confirm → implement ONE unit → user verifies →
   only then the next. Never batch ahead, never "while I'm here".
4. **Log to `IMPLEMENTATION_LOG.md` only AFTER the user verifies** the change in the real environment.
   Never before.
5. **Out-of-scope findings → a new numbered entry in the bug log**, never folded into the current change.
6. **Stop on surprise.** If reality contradicts the plan's impact model, stop and report — don't improvise.
7. **Ground against the code, not the notes.** Bug entries and old plans rot; verify line numbers and
   behavior in the actual files before acting on them.
8. **Duplicated logic is edited as a SET.** Where the same rule/function deliberately exists in more
   than one place (see the Guards & duplicated-rule registry in the `plan-first` skill), edit every
   copy and run whatever parity check pins them together.
9. **Prompt-coaching note every turn.** Every response — answers and implementations alike — ends
   with the coaching note per the `prompt-coaching` skill.

---

## Startup process

1. **Read the top handoff** → then its own required-reading list → skim the bug log.
2. **Verify the handoff's state claims with commands — the handoff is a snapshot, not the present.**
   Run `git status -sb` and the test suite, and COMPARE against the handoff's expected values (branch,
   commit state, suite count). Report any drift as its own line in the briefing: "handoff says X,
   observed Y." (Lesson learned: a handoff said "commit owed"; git was already clean — the user had
   committed after it was written. Another time, a current-state doc six days stale asserted the
   OPPOSITE of shipped reality.)
3. For anything you'll touch, **open the real files** and confirm current behavior + line numbers
   (don't trust the notes' line numbers — they drift with every edit above them).
4. Build the mental model: what the system does, how the layers interact, and the current development state.

### Additional startup rules learned in practice

- **After a COMPACTION or MODEL SWITCH mid-project, re-run this routine and treat the compaction
  summary as UNVERIFIED.** It is machine-generated notes — re-read the real files for anything
  load-bearing before acting on a summary claim.
- **Initiative folders carry their own entry points.** When the pick-up task belongs to a larger
  initiative under `.ai/PLANS/<initiative>/`, read its `README.md` FIRST (orientation, status
  snapshot, commands), then the specific plan. Don't reconstruct initiative context from the
  handoff alone.
- **If the test suite is RED at startup, identify the failing test's KIND before touching anything.**
  Some tests are pins/tripwires DESIGNED to fail on planned events — a red tripwire is the signal
  working, and "fixing" it to green destroys the guard. Never delete-to-green.
- **For a LARGE new workstream (not routine pick-up):** a parallel fan-out read is an available
  grounding pattern — several read-only explorer agents over the layers (server / front-end / tests /
  docs), each returning a dense map, cross-checked against each other. Spot-verify any load-bearing
  claim from a reader yourself before building on it (readers err).

---

## REQUIRED OUTPUT before any code

Present these four before proposing or making any change:

1. **Current Understanding** — what the project is and how it works (the layers).
2. **Last Session State** — from the top handoff: what shipped, what's in flight.
3. **Current Focus** — the handoff's "pick up here" pointer, restated; what should happen next.
4. **Risks / Unknowns** — anything unclear, missing, or unverified (flag what you'd need to confirm
   in code or live before acting).

Then: propose a plan (per the `plan-first` skill) and wait for the explicit "go". Never code first.

---

## Related skills

- `plan-first` — the workflow every proposed change then follows; its guards registry is required reading here.
- `write-handoff` — produces the handoff this skill reads at the top of the log.
- `log-implementation` — the as-built history this skill skims for the "why" behind current code.
- `prompt-coaching` — standing rule active every turn: every response ends with a prompt-coaching note.
