<!-- HANDOFF LOG — session handoffs, NEWEST ON TOP (prepend above the previous entry).
     Older handoffs stay below as history. Never edit a prior handoff; supersede it with a dated
     ✅ UPDATE note in a newer entry instead. Format: a lighter version of kit/skills/write-handoff
     (its 13 sections are heavy for a notes repo — see TODO-12). -->

# Handoff Log

## 2026-11-16 — Session 2: a guide section, starting with the testing page

### Summary

Added a second kind of content next to the concepts book. The concepts are reference material (look
a term up); the new **guide** is what to think through, and discuss with the agent, when a project
starts. Created the themes table, started the testing page, and put the guide on the site.

Note: the two commits of 2026-11-05 (`944294f` conventional terms in place of house terms,
`00e1069` SWEBOK-aligned part names) were made without a handoff entry. They are in git and are
reflected in the files; this entry is the first since Session 1.

### Where things stand

- **Guide:** `guide/README.md` lists eight proposed themes. One has a page: `guide/testing.md`.
  - Section 1, **The map**, is written: tests described by scope (static check, unit, integration,
    end-to-end) and by purpose (behavior, regression, smoke, acceptance, characterization,
    differential, expected-failure).
  - Sections 2–5 are one-line outlines: Talk it through · Set it up · As you build · Go deeper.
- **Site:** has a Guide group at the top of the sidebar, an overview page, a view per guide page,
  and guide pages in search. The layout is wider. Republished to the same link at session end.
- **Concepts, kit, inbox:** unchanged this session.
- Everything committed and pushed; `main` matches GitHub.

### Decisions — settled; reopen only with a reason

- **The guide is separate from the concepts.** The concepts stay as they are. Guide pages link to
  concepts chapters for vocabulary and do not redefine terms.
- **A guide page has five sections:** the map (vocabulary on one screen) · talk it through
  (questions for the agent before code exists) · set it up (day-one boilerplate) · as you build
  (the per-change checklist) · go deeper (links).
- **Unit tests and end-to-end checks are not rivals.** A project has both from the start: many unit
  tests for the logic, and at least one end-to-end check proving the application works. This moves
  one smoke flow from rung 6 of the growth ladder to day one; the rest of the ladder stands.
- **Guide pages use a professional register:** standard terms (defect, specification, verifies),
  still understandable to a learner. No casual phrasing in tables.
- **Left out of the map on purpose:** structural/source invariants and meta-guards. They guard a
  very large suite and are not needed at project start.
- **While drafting, rebuild locally only**; republish the online copy when asked or at session end.

### Open questions

- **One test per behavior, or test the matrix?** A write-a-test prompt I brought in says one test
  per behavior with no unrequested edge cases; `write-tests` foundation 8 says test failure modes
  and boundaries. Decide which is the default (TODO-16).
- **The theme list and the map's placement of "acceptance"** were written from memory, not checked
  against a standard reference. A formal testing syllabus treats acceptance as a test level (scope)
  rather than a purpose. Check when convenient.
- **"Differential test" has two uses:** two copies of one rule that must agree (this repo), and an
  old system versus its rewrite (migration). The map names both; the glossary names only the first.

### Material gathered for section 2 ("Talk it through")

Candidate kickoff questions, from the session's discussion and from reviewing an earlier portal
project where tests started three months in:

1. How will the agent run the application and see whether a change works, given that only I deploy?
2. Which three to five user flows are critical?
3. Can server-side code share modules on this platform? (Check the platform's docs. Where it
   cannot, logic gets copied and needs differential tests.)
4. Where does the logic live? Rules kept in small plain files can be unit tested; rules inside
   large UI components cannot.
5. Will endpoints be tested through their real entry point with a fake client, including a caller
   who does not own the record?
6. Where do end-to-end tests run, with what test data, and how is that data cleaned up?
7. What must pass before I deploy, and what stays a manual check?

An article on verification by the Claude Code team (claude.dev blog, 2026-11-16) informed the
unit-plus-end-to-end decision and suggests three more ideas worth considering for sections 3 and 4:
a `verify` skill that runs the app as the smoke test, running cheap checks (tests, build, lint)
first, and stopping for a human after three failed fix attempts.

### Pick up here

**TODO-13 — section 2 of `guide/testing.md`.** Go through the candidate questions above with me one
at a time, keep the ones that hold up, write the section, rebuild, and I review it in the browser.

To resume: open Claude Code **inside `dev-notes/`** (so `CLAUDE.md` loads) and say
"let's continue".

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
