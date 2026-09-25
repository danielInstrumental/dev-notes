# Concepts — the engineering vocabulary, organized like a book

The concepts I work with, arranged the way a reference book on software engineering would arrange
them: five parts, one file per chapter. Each chapter opens with a **Covers** line (what belongs in
it), then lists its terms one line each. Where I've written a fuller explanation in my own words,
the term points to it further down the same file.

Companion to the `prompt-coaching` skill, which draws on these chapters when naming the user's
unknown unknowns. **This is OPEN, not a syllabus** — see "How this grows" at the bottom.

**Markers:** unmarked = canonical professional vocabulary · 🏠 = house style (coined in the
user's projects — useful, but translate it when talking to other engineers; the translation is
given in parentheses).

_Definitions are project-neutral. They started as notes from real projects, but the project-specific detail is deliberately stripped out here._

## Contents

### Part I — Building blocks

1. [Design & structure](design-and-structure.md)
2. [Data & state](data-and-state.md)
3. [Functions, effects & flow](functions-effects-and-flow.md)

### Part II — Keeping it right

4. [Correctness](correctness.md)
5. [Errors & reliability](errors-and-reliability.md)
6. [Concurrency](concurrency.md)
7. [Security](security.md)
8. [Testing](testing.md)
9. [Performance](performance.md)

### Part III — Connecting systems

10. [Integration & APIs](integration-and-apis.md)

### Part IV — Changing it

11. [Change & maintenance](change-and-maintenance.md)
12. [Delivery & version control](delivery-and-version-control.md)
13. [Operations & observability](operations-and-observability.md)

### Part V — How we work

14. [Documentation & knowledge](documentation-and-knowledge.md)
15. [Planning & prioritization](planning-and-prioritization.md)
16. [Working with AI agents](working-with-ai-agents.md)

---

## How this grows (open by design)

This deliberately does NOT try to be complete. The chapters are the structure; the terms fill in
as the user actually meets them. Some chapters start empty on purpose — they mark where a
conventional reference would have a chapter, so new terms have a home when they arrive.

Rules for any agent maintaining it:

1. **When coaching surfaces a term not in any chapter, ADD it** — to the chapter whose **Covers**
   line fits it. Propose a new chapter only if none fits. Adding is the default, not the exception.
2. **Mark its status honestly**: canonical (unmarked) or 🏠 house style with the conventional
   translation in parentheses. If unsure it's canonical, say so rather than guessing.
3. **One line per term in a chapter's Terms list.** A fuller own-words explanation goes in a `##`
   section further down the SAME chapter file, and the term points to it with `→ [[#Heading]]`.
   A term and its explanation always live in the same chapter.
4. **Upstream first** (see `AUTHORING.md`): add terms here in dev-notes, then `kit/install.sh <project> --update` —
   a term learned in one project should reach all of them.
5. **House terms must stay load-bearing.** A 🏠 term earns its place by being USED — by a skill in
   this kit or an active project. If nothing uses it anymore, drop it (canonical terms
   are exempt: they're the professional vocabulary regardless of whether we currently use them).
