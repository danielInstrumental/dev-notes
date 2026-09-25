---
name: comment-protocol
description: Conventions for comments, markers and docs that a reader with no project memory can trust — decision fingerprints, KIND/flip-condition test headers, KEEP-IN-SYNC markers, dated claims. Use on day one of a new project, when adding comments or markers, or when auditing an existing codebase.
---

# comment-protocol — annotations a zero-context reader can trust

**What this is:** the conventions that make a codebase **agent-legible** — comments, markers and
docs designed so a reader with NO project memory (a new developer, a future AI session, you in six
months) can tell *deliberate* from *rot*, know what every signal means, and act without tribal
knowledge. Distilled from a project where every rule below was earned by an incident.
Adopt from DAY ONE of a new project — retrofitting cost that project a full audit pass.

## The seven principles

1. **Decisions leave fingerprints.** Every deliberate oddity gets a dated comment AT THE SITE:
   what it is, why, and what would change it ("dormant but supported — set required:true and it
   renders; do not clean"). The corollary is the **Chesterton test**: when you meet something that
   looks wrong, ask *"did anyone write down a reason?"* — a fingerprint means decision (leave it or
   re-open it consciously); silence means presumed rot (verify, then fix). This only works if
   fingerprints are the RULE, so silence is INFORMATIVE.
2. **Signals declare their own semantics.** A test states its KIND and its **flip condition** —
   what a red means and what to do (see `write-tests`' taxonomy). A marker states who sets it and
   who clears it. If interpreting a signal needs a human who remembers, the signal is incomplete.
3. **Greppability is a design constraint.** Markers are uniquely searchable strings (`// KIND:`,
   `KEEP IN SYNC`, `⚠ DORMANT`, `DO NOT`), and status tokens sit at a FIXED position in headings so
   filters can't mis-parse (a heading may *mention* ✅ without *being* ✅ — position disambiguates).
4. **Claims carry dates, not tenses.** "9 copies as of 2026-07-20" cannot rot; "9 copies" rots on
   the 10th. Counts and rosters live in ONE registry; other sites POINT there. When a claim must
   appear in prose, date it — a dated snapshot is honest forever.
5. **Negative documentation is first-class.** Prohibitions are written, never implied: DO-NOT
   lists, "never delete-to-green", "deliberately dormant — do not remove", and **reopen triggers**
   on every declined decision (a recorded "no" without a trigger gets re-litigated forever).
6. **Instructions outrank descriptions.** A stale instruction causes a repeat failure; a stale
   description only confuses. Write more instructions ("edit BOTH copies, then run the parity
   test") and fewer descriptions; when auditing docs for rot, sweep instructions first.
7. **Docs are tested by journeys, not reviews.** The acceptance test for documentation is the
   **stranger test**: pick a realistic task ("change this copy", "add a field end-to-end",
   "debug a vanished file") and walk it using ONLY the written artifacts — every dead end is a
   finding. Proofreading finds typos; journeys find the missing signpost.

## The marker vocabulary (adopt as-is; add project-specific ones sparingly)

| Marker | Where | Says |
|---|---|---|
| `// KIND: <kind> … FLIP CONDITION: …` | line 1 of every test file | what the test is, what a red means, what to do |
| `KEEP IN SYNC with <all copies> (+ the pin)` | every copy of forced duplication | the roster of copies + the machine check |
| `<claim> (deliberate — <why>; changes if <trigger>) [YYYY-MM-DD]` | at any looks-wrong-on-purpose site | the decision fingerprint |
| `⚠ DORMANT — DO NOT REMOVE (<role>)` | unused-but-load-bearing files | dead-looking ≠ deletable |
| a `DO NOT` list | the handoff / CLAUDE.md | prohibitions, enumerated |
| `🚫 declined <date> — reopen if <trigger>` | register entries | a durable "no" |
| status token at a FIXED heading position (`— ✅ / ⏳ / 🚫`) | every register heading | machine-filterable state |

## Relation to the established concepts

These compose existing ideas: **codetags** (PEP 350 — standard comment tags), **ADRs** (this
protocol inlines micro-ADRs at the code site; big decisions still deserve a real ADR file),
**Diátaxis** (keep how-to playbooks, reference inventories and explanation maps as SEPARATE
documents), **docs-as-code**. The integration — designing all of it for a zero-context reader —
is the part with no standard name yet; "agent-legible" is the emerging term.

## Cross-links (in this kit)

`write-tests` (the test taxonomy the KIND header points into) · `plan-first` (the KEEP-IN-SYNC +
registry duty) · `write-handoff` (DO-NOT lists, mental-model pins) · `core-vocabulary` (ADR,
stranger test) · `templates/` (the register headings' token convention).
