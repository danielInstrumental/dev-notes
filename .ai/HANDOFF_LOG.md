<!-- HANDOFF LOG — session handoffs, NEWEST ON TOP (prepend above the previous entry).
     Older handoffs stay below as history. Never edit a prior handoff; supersede it with a dated
     ✅ UPDATE note in a newer entry instead. Format: a lighter version of kit/skills/write-handoff
     (its 13 sections are heavy for a notes repo — see TODO-12). -->

# Handoff Log

## 2026-09-25 — Session 1: from notebook to organized vault + searchable site

### Summary

Brought the repo from a loose notebook to a structured vault. Cleaned out project-specific
references, split reference knowledge from the skills kit, reorganized the concepts into a
book-style table of contents, checked every definition against standard references, added an
inbox, and built a searchable site from the markdown. Ended with a first pass on the testing
approach.

### Where things stand

- **Concepts:** 114 terms in 16 chapters across 5 parts (3 chapters empty on purpose:
  Performance, Integration & APIs, Operations & observability). Every definition checked against
  standard references; house terms marked 🏠 with their standard names.
- **Inbox:** 1 note — HubSpot CMS React scaffold (made generic, linked to HubSpot docs).
- **Site:** https://claude.ai/artifact/JdFXsWL53isSAMmrGwuCTe — Contents, chapters, inbox,
  search with Part › Chapter breadcrumbs. Rebuild: `cd site && npm run build`, then republish.
- **Not yet on the site:** bug classes, the skills kit, snippets, lessons.
- Everything committed and pushed; `main` matches GitHub.

### What happened (14 commits)

1. **Cleanup** — removed references to the source project and real-looking HubSpot record IDs (`034c304`);
   added `comment-protocol`'s missing frontmatter and fixed the root README (`2b75931`).
2. **Structure** — linked the vocabulary map to the glossary (`5868ffa`); split the repo into
   `knowledge/` and `kit/`, added `kit/install.sh` (`34a836f`).
3. **Site** — build script + template (`73127f2`), accordion sidebar (`930847e`), concepts as a
   book: 5 parts / 16 chapters / one file each (`7755c3a`), search breadcrumbs (`d96a564`).
4. **Definitions** — indexed 26 deep-dive concepts as terms (`76a44bd`); corrected 28 of the 85
   original terms against standard references (`97fe347`).
5. **Inbox** — `inbox/` with the first note (`a23909b`).
6. **Testing** — bug-fix tests tied to behavior gaps; "test behavior, not implementation";
   tautological and change-detector tests as terms (`63a28db`, `d1a0385`).
7. **This handoff** — `CLAUDE.md`, `.ai/HANDOFF_LOG.md`, `.ai/TODO.md`.

### Decisions — settled; reopen only with a reason

- **Markdown is the source of truth; the site is generated** from it and never edited by hand.
- **`knowledge/` = reference, `kit/` = instructions.** Skills cite knowledge at its installed
  path (`.claude/knowledge/…`); `kit/install.sh` copies both into a project. Clean organization
  beats keeping the old copy-skills-by-hand workflow.
- **Concepts are organized like a reference book** (SWEBOK-style), not in the order I met things.
  One file per chapter; a **Covers** line decides what belongs; a term and its deep dive live
  together; empty chapters mark where terms will go.
- **Terms are added as I meet them**, not all at once.
- **Inbox notes** carry Date / Tags / Status, graduate or get dropped, are made generic (public
  repo), and link official docs.
- **Testing:** a bug fix closes a gap in behavior testing — no test-per-bug; test behavior, not
  implementation.
- **Working agreement:** propose → my approval → change → show diff → commit + push to `main`.
- The repo stays **public** for now.

### Open questions

- Should **bug classes** file under the same 16 chapters (e.g. a race-condition bug under
  Concurrency)? Decide before building their site section (TODO-3).
- The **agentic test extensions** (pin, tripwire, parity guard, inertness pin, replay): keep,
  soften or drop each for a learner-sized workflow? (TODO-1)

### Pick up here

**TODO-1 — the testing review, starting with pins.** For each idea: what it is (with an
example), whether it's standard or house style, when it's worth it vs overkill, and whether the
`write-tests` skill should keep, soften or drop it.

To resume: open Claude Code **inside `dev-notes/`** (so `CLAUDE.md` loads) and say
"let's continue".
