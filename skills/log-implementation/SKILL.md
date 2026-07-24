---
name: log-implementation
description: Append one as-built entry to the implementation log after a unit of change is verified by the user — per implementation, not per session. Newest entry last, only after verification, grounded in real file:line.
---

# Log an Implementation (as-built entry)

> ## Project Configuration — fill in per project
> - **Log file:** `.ai/IMPLEMENTATION_LOG.md` — **append at EOF** (newest last)
> - **What "verified" means:** <e.g. "the user confirms in the browser / on staging">
> - **Pre-merge checks to report:** <the project's syntax/test/diagnostic commands>
> - **External-system verification tooling:** <e.g. "property lookups verified via <script/console>">

## Purpose

Append a **per-implementation** as-built entry when a unit of change is **done and verified**. This
is the durable record of *what shipped and why* — written **per implementation, NOT at end of session.**

## Not the handoff (keep these straight)

| | Implementation log entry | Session handoff |
|---|---|---|
| **Cadence** | Each time a change is verified (may be several per session) | Once, at session end / before compaction |
| **Scope** | One change (feature / fix / decision) | The whole session |
| **File** | `.ai/IMPLEMENTATION_LOG.md` | `.ai/HANDOFF_LOG.md` |
| **Order** | **Append at EOF** (newest last) | **Prepend on top** (newest first) |
| **Instruction** | this skill | the `write-handoff` skill |

A session typically produces **several** implementation-log entries and **one** handoff. Don't
conflate them.

---

## Hard rules

- **Append at EOF. Newest entry last.** Never edit, reorder, or delete a prior entry — it's an
  append-only audit trail.
- **Only AFTER the user verifies.** Never log coded-but-unverified work; that lives in the handoff
  as `⏳ pending`, not here. Logging before verification is this rule's most common violation — don't.
- **Ground in code — don't invent.** Exact `file:line`, real key/property names, real test counts
  (`N/N`). Log only what actually happened and was observed.
- This entry is **one part of close-out**, not the whole of it — also flip the plan file's status,
  mark the bug log, and update any current-state SSOT doc the change touched (see the
  `plan-first` skill, Phase 8).

---

## When to write an entry

One scoped entry per:
- a new feature / behavior shipped + verified;
- a bug fixed + verified;
- a convention or architectural decision made;
- a meaningful change to how data is tracked / saved / displayed / synced.

Related work done together (a fix + its follow-up) can be one entry with a clear title.
**Doc-only / triage-only** work is a valid entry too — log the doc + bug deltas with the same
exactness (every file edited with its path, every bug # filed/resolved).

---

## Required format

```
## [YYYY-MM-DD] FEATURE / BUG #N — <one-line title>
**Plan:** <plan file + status>, or "no formal plan — <why>". <One-line what + why.>

**External-system changes (if any):** properties / options / config created, verified live via <tool>.
**Edits:** lettered (A1, B1, C1 …), each with **exact file:line** + what changed + why.
  Flag any deliberately duplicated logic edited in ALL its copies (KEEP-IN-SYNC + which parity
  check was run).
**Validator drift:** "none required (+ why)" OR which copies of a multi-copy rule were updated
  as a SET.
**Known limitation / cleanup:** accepted trade-offs; any TEMP scaffolding owed removal (or "none").
**Pre-merge checks:** syntax check, test suite **N/N** (with the case list), diagnostics.
**Verified <YYYY-MM-DD> (user):** the observed evidence — the must-pass checks, with the date.
**Bug delta:** `#N NEW` / `#N ✅ RESOLVED` (or "none"). Deploy note if merged ≠ deployed.
```

Use code blocks for snippets and tables for before/after behavior. Group under sub-headings when the
change is large.

---

## What makes a good entry

- **Explains the why, not just the what** — the code shows what changed; the log explains the
  reasoning and the options not taken.
- **Captures the decision** — which approach was chosen and why (reference external conventions or
  reference systems when relevant).
- **Honest about state** — accepted limitations, deferred halves, and known races are stated, not
  hidden.
- **Re-findable** — cross-references the plan file, bug #, and any persisted test so the next agent
  can get full detail.

---

## Mandatory steps before writing

1. Confirm the change is **verified** by the user (if not, stop — it's not loggable yet).
2. Identify the exact files changed and what each change does (re-read them; don't trust memory).
3. Read the current EOF of `IMPLEMENTATION_LOG.md` to confirm the last entry, then append below it.
4. Write the entry per the format above, grounded in the real `file:line` and observed results.

---

## Related

- The `plan-first` skill — the plan-first workflow this close-out concludes (Phase 8).
- The `write-handoff` skill — the *session handoff* instruction (the end-of-session companion, not this).
