# AUTHORING — how skills in this kit are written

Read this before writing a new skill or editing an existing one. It keeps the kit consistent so
that writing skill #6 is mechanical, not a design exercise.

## Naming

- **Folder name = skill name**: lowercase **kebab-case** (`words-with-hyphens`), verb-first when the
  skill is an action (`write-handoff`, `log-implementation`), noun allowed when it's a phase or a
  standing mode (`session-startup`, `prompt-coaching`).
- The name is what users type (`/write-handoff`) — keep it short, unambiguous, and sayable.
- The instruction file is always `SKILL.md`. Supporting reference files live in the same folder
  with descriptive kebab-case names (`change-impact-checklist.md`).

## Frontmatter

Every `SKILL.md` starts with exactly:

```yaml
---
name: <same as the folder name>
description: <one or two sentences>
---
```

**The `description` is the most load-bearing line in the file — treat it as an API.** It is shown
to the agent every session (it's how the agent decides when to load the skill), so:

- Write it in third person, imperative content: *what the skill does* + *when to use it*.
- Include the trigger moment explicitly ("Use at session end", "Use before ANY code change").
- Keep it tight — every skill's description costs context in every session, used or not.
- Keep it in sync with the body: if the skill's behavior changes, the description changes in the
  same edit.

## Structure — the standard skeleton

Sections in this order (omit ones that genuinely don't apply; don't invent new orderings):

1. **Project Configuration** — a `>` blockquote of fill-in-per-project slots (paths, deploy
   command + owner, what "verified" means). Everything project-specific goes HERE, so the body
   stays generic.
2. **Purpose** — one short paragraph: what this skill produces and why it exists.
3. **When to use** — the trigger, stated so a reader (or the agent) can't miss the moment.
4. **Hard rules / standing rules** — the non-negotiables, numbered.
5. **Procedure** — the numbered steps or phases (the bulk of the skill).
6. **Output format** — a copy-ready template in a code block, when the skill produces a document.
7. **Related skills** — one line each, saying how they connect (not just a list of names).

## Voice and style

- **Imperative, addressed to the agent**: "Read the top handoff", not "the agent should read…".
- **Anonymized lessons, not project history**: a lesson keeps its teaching example in one line with
  the project nouns removed ("a handoff said commit owed; git was already clean"). No bug numbers,
  file paths, or vendor names from a specific project.
- **Rules state their WHY** when the why is what makes them stick ("never delete-to-green — a red
  tripwire is the signal working").
- Emphasis (bold/CAPS) marks the load-bearing words, not decoration.

## Size — progressive disclosure

Keep `SKILL.md` swallowable in one read (aim well under ~400 lines). Push long reference material
(checklists, registries, worked examples) into companion files in the skill's folder and point to
them — the agent loads those only when needed. If a skill keeps growing, split the growth into a
reference file rather than letting the main file bloat.

## Evolution — upstream first

This repo is the **upstream**; each project's `.claude/skills/` copy is a downstream copy.
When a project teaches a lesson that improves a skill:

1. Distill the lesson (anonymize it — strip project nouns).
2. **Edit the skill here in dev-notes first**, folded into the section where it belongs — not as a
   dated addendum at the bottom (addenda are how the originals grew inside one project; the kit
   stays consolidated).
3. Re-copy the updated skill into active projects when convenient.

A lesson worth a longer story also gets an entry in `lessons-learned/` — the skill carries the
distilled rule; the lesson file carries the narrative.
