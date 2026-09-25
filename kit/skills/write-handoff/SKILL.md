---
name: write-handoff
description: Write the end-of-session handoff — run the pre-handoff current-state sweep, then prepend the full 13-section handoff to the handoff log. Use at session end or when the context window nears compaction.
---

# Write the Session Handoff

> ## Project Configuration — fill in per project
> - **Handoff log:** `.ai/HANDOFF_LOG.md` — **prepend** the new handoff on TOP (newest first; older handoffs stay below as history)
> - **Deploy/verify vocabulary:** <what "verified" means here — e.g. "browser-verified by the user">
> - **Current-state docs for the pre-handoff sweep:** <list this project's living documents — TODO lists, architecture overview, tests README, initiative READMEs, field inventories — and the trigger for each; see the sweep section>

## Purpose

Write a session handoff at the **end of a work session** (or when the context window is nearing
compaction) so the next agent — or post-compaction you — can resume without re-deriving context.

**The standard: the stranger test.** The consumer of a handoff may be a LESS capable model than the
writer, or a human who wasn't there. Could a competent stranger continue from the written artifacts
ALONE, with zero inference and zero judgment calls that were already made? Compaction keeps the
*gist* and drops *precision* — the brittle specifics must be written to the durable file or they're
lost.

Ground every section in what actually happened this session — don't invent. Use exact file paths,
key names, and identifiers; a handoff full of vague nouns ("the degree stuff") is useless.

---

## The handoff sections (all required)

1. **What we're doing** — the overall task/methodology in one short paragraph, and where we are in it.

2. **Required reading (in order)** — the exact files the next agent must read first, each with a
   one-line why. Standing-instruction files first, then the bug log, plan log, implementation log,
   and any current-state SSOT docs relevant to the pick-up task. If the pick-up belongs to an
   initiative with its own `README.md`, point there — do NOT duplicate the initiative narrative into
   the handoff, where it ages out of sync (two-layer durability: session context → handoff;
   initiative context → the initiative folder's README).

3. **Shipped + verified ledger (at-a-glance)** — one scannable ` · `-separated line of everything
   that shipped **and was verified** this session (a ledger of done, not in-flight). Follow it with:
   - a **bug census** line: `N total · N resolved · N outstanding`, plus new/resolved-this-session IDs
     (the count question gets asked every session — put the answer where the scan happens);
   - a **git state** line: current branch, committed/merged or not, any uncommitted changes;
   - a **deploy state** line: **git merge ≠ deployed.** Code can be merged to main yet NOT live.
     State both explicitly ("merged AND live as build #N", or flag the gap: "merged but NOT deployed").
     There is a third gradation: **logic-verified-via-script ≠ deployed** — proving logic against the
     live system with a standalone probe still leaves the deployed code running the old version. A
     feature can be code-complete + logic-verified + NOT deployed + NOT user-verified — name which
     state each item is in and the exact remaining step.
   - If the session shipped no code: say **"NO CODE SHIPPED — <docs / triage / planning> session"**
     and let §4 enumerate the doc + bug deltas with the same exactness a code session demands.

4. **What we did this session + why (EXHAUSTIVE — omit nothing)** — bullet **every** change made:
   features, fixes, refactors, copy/UX tweaks, validation changes, schema additions, new files, and
   every decision or bug logged. For each: the **reason**, the **exact file paths + field/key/component
   names** touched, and its **status** (✅ verified / ⏳ pending verify / ⏸ deferred). Cross-reference
   the durable record (implementation-log entries, plan IDs, bug `#N`). Err toward more detail —
   a too-long §4 is recoverable; a missing change is silently lost.

5. **▶ Where we left off / pick up here ◀** — name the *exact* next task, whether it's build vs
   verify, and any blocked items with the blocker. Include:
   - **The INPUTS the user owes the next session** — some pick-ups are gated on decisions/answers
     only the user can bring; name each needed input explicitly.
   - **Cascade/unmasked bugs and their SEQUENCING** — when fixing X surfaced a deeper pre-existing
     bug Y that was masked until the fix: record both, note *why* Y was hidden, and state whether
     continuing X is **gated behind Y**. Say "blocked behind newly-found #Y," not just "deferred."

6. **⚠️ Critical details a summary would lose** — the brittle, non-obvious specifics that cause bugs
   or undo decisions if mis-remembered:
   - exact key names + any dead/orphaned keys · naming collisions · per-module architecture
     differences · gotchas (e.g. case-sensitivity of fetched values) · placeholder/TEMP data that
     isn't real · **intentional deviations that must NOT be "corrected" back to the spec**.
   - **Reference-test evidence VERBATIM** — when a live reference system was probed to spec a rule,
     that observation IS the spec: record what was tested, what happened, and what we therefore did
     NOT build (or a future agent will "fix" a deliberate omission).
   - **HOW-TO-TEST / REPRODUCE notes for in-flight work** when triggering the code path is
     non-obvious (first-load-only, create-branch-only, conditionally-rendered) — or the next agent
     "tests" the wrong path and concludes it's broken.
   - **The IDENTITY/credential each external code path uses** — when more than one token/app/key can
     run "the same" call, say which path uses which; a scope/permission gap on one is invisible when
     you test with the other.
   - **If a deploy is BLOCKED by INFRA (not by our code):** record the block's identity (exact
     endpoint), what was ruled out client-side, the support reference, and who owns the workaround —
     a blocked-but-correct feature is its own state; the next agent must not re-debug working code.
   - **No unglossed jargon or metaphors — define terms inline at first use.** Write "the probe
     (= a throwaway script that asks the real system one question)" the first time, every session.
     A metaphor that carried a decision must be expanded to the literal decision.

7. **Mental-model pins** — the hard-won conceptual distinctions, numbered, phrased as **"do not
   conflate X with Y."** The gist survives compaction; the DISTINCTIONS don't — these are the
   highest-value lines in a handoff for a weaker reader.

8. **Patterns established/used (reuse, don't reinvent)** — the code patterns applied, named, with
   where they live. Include **persisted (durable) tests**: path + verbatim run command + what each
   covers — and state if a related code path still LACKS one. (Distinct from cleanup debt: these are
   re-runnable assets, not scaffolding owed removal.)

9. **Assumption register + decisions table** — every tracked assumption (name, what it assumes, the
   pivot path if wrong) and every decision (✅ answered — with the answer and WHY / ⏳ open — with the
   recommendation). The reader must never (a) treat an assumption as fact, (b) re-litigate an
   answered decision, or (c) face a judgment call the session already made. **"Decision-complete" is
   the bar:** if following the handoff requires choosing, the handoff is missing a decision row.

10. **Methodology rules + DO-NOT list** — how the user wants the agent to work, and the prohibitions
    **enumerated, not implied** (strong models infer prohibitions from context; weaker ones need the
    list): never deploy · never touch X · never commit secret Y · never delete-to-green a pin/tripwire
    (name any NEW pins this session added and their flip conditions).

11. **Cleanup debt** — temporary instrumentation/scaffolding owed removal: diagnostic logs, test
    records created in external systems, feature-flag stubs, commented-out probes — each with its
    **removal condition**. Temporary code that isn't written down as owed becomes permanent silently.
    (A live-verification script in a scratchpad is EPHEMERAL — port it into the repo if a durable
    test is wanted, or list it here.)

12. **Open items / bug log** — pointers to deferred work with IDs.

13. **How to start the next session** — a numbered "do this first" list ending at the exact pick-up
    task. **Every runnable step carries its VERBATIM command + EXPECTED result** ("run `npm test` →
    expect N/N, git clean") so the reader detects drift immediately instead of proceeding on a broken
    base. For each agent-ready queued task, consider a **ready-to-run KICKOFF PROMPT** the user can
    paste — it front-loads the constraints and required reading (for a weaker model, the kickoff
    prompt IS the quality control).

---

## Supersede, don't rewrite

If a previous handoff (or the mid-session draft of this one) described something mid-debug and the
session then RESOLVED it: add a top `> ## ✅ UPDATE — <date>: RESOLVED …` banner naming the real root
cause and pointing to the close-out — and leave the original mid-debug narrative **below as HISTORY**
(mark it so). Do NOT delete/rewrite the debug story: the ruled-out guesses and *how* they were
eliminated are the audit trail.

---

## The PRE-HANDOFF CURRENT-STATE SWEEP

**Why:** append-only logs never rot; **every rotten doc is a current-state document without an update
trigger** (one reconciliation day once found five materially stale docs — including an architecture
doc asserting the OPPOSITE of shipped reality). The fix is a sweep bound to the one ritual that
always runs — the handoff.

**BEFORE writing the handoff, walk the project's current-state docs (listed in the configuration
block) and reconcile every one the session's work triggered.** Then the handoff's §4 lists what was
reconciled AND what was consciously left stale — staleness must be legible, never silent.

Typical sweep table (adapt to the project):

| Current-state doc | Reconcile when (the trigger) |
|---|---|
| TODO lists | any item the session opened / closed / moved / descoped |
| The Guards & duplicated-rule registry (the `plan-first` skill) | a guard or duplicated rule shipped or changed |
| The tests README (status line + coverage table) | ANY test file added or materially changed — tick with grep receipts, not memory |
| The touched initiative's `README.md` status snapshot + any umbrella index above it | that initiative advanced or changed status |
| The architecture overview | the session shipped behavior/structure changes → reconcile the affected SECTIONS; at minimum, fix any claim the session INVERTED |
| Staged-work ledgers / backlogs | a feature they stage shipped / descoped — also check for conflicts with invariants shipped since |

Rules of the sweep: **trigger-based, never calendar-based** ("update everything daily" becomes a
skipped ritual; "touch the rows your session triggered" survives). **Append-only logs and frozen
artifacts are NOT in the sweep** — frozen artifacts (sent contracts, superseded docs) get
supersede/provenance ANNOTATIONS, never rewrites. **Close checkboxes with evidence** (a grep/file
receipt). Current-state docs carry a "last reconciled" date in their header — update it when you
sweep them.

---

## Related skills

- `session-startup` — the consumer of this handoff: it reads the top entry and verifies its claims.
- `log-implementation` — the per-change durable record this handoff cross-references (§4) instead of duplicating.
- `plan-first` — its guards registry and plan statuses are rows in the pre-handoff sweep.
