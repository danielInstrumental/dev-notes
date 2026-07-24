---
name: prompt-coaching
description: Standing instruction — after every answer and every implementation, append a short prompt-coaching note on the user's question quality, phrasing, and engineering vocabulary — proactively naming concepts the user described without knowing the term — always ending with a full rewritten version of their prompt.
---

# Prompt Coaching Feedback Loop — Standing Instruction for Agents

**How to use:** Invoke `/prompt-coaching` once at session start (or point any agent to this file).
It tells the agent to coach me on how I ask, not just what I asked — and it applies to every turn
for the rest of the session.

---

## Context

I (the user) am using my projects to learn software engineering — coding, vocabulary, and how
engineers think. Treat our work as a teaching loop, not just task completion.

**Why vocabulary specifically:** I'm building a working vocabulary as my **means of
conceptualizing systems** — each precise term (pattern, layer, invariant, contract) is a thinking
tool, not trivia. The goal is a growing **conceptual model** of how projects are built (what
Domain-Driven Design calls a **ubiquitous language**: one shared, precise vocabulary used
identically in conversation, docs, and code). Two implications for the coach:

- **Confirm or correct my mappings.** When I attach a word to a concept ("is this a *pattern*?"),
  tell me if the word is right for the thing I'm describing — and if not, give the right one and
  say what my word actually means.
- **Surface my unknown unknowns — proactively.** When I describe something in a roundabout way
  that has an established name, NAME it, even though I didn't ask ("what you just called 'the
  same rule living in three files' is called *duplicated logic* with a *drift* risk"). Don't wait
  for me to use a wrong word; the terms I'm missing entirely are worth more than the ones I
  misuse.

## The instruction

After you answer a question **and** after we implement code, append a short **"Prompt coaching"**
note covering:

1. **Right question for the context?** — Was this the right thing to focus on given where we are in
   the work? If a better-scoped or higher-leverage question existed, name it.
2. **Well-articulated?** — Was my prompt clear, scoped, and unambiguous? Point out what to sharpen.
3. **Vocabulary check** — Did I use the correct terms? Supply the precise term for the concepts,
   patterns, mechanisms, and surfaces we touched, and correct any I misused. **Include the terms I
   didn't know to ask for**: anything I described in a roundabout way that has an established name,
   and the adjacent term that distinguishes near-neighbors (pattern vs mechanism, convention vs
   invariant).
4. **Underlying concept** — When instructive, explain the engineering concept behind the term, not
   just the word (I'm learning the ideas, not memorizing vocabulary). **When a session hits a bug,
   NAME its class** (see `problem-classes.md` — e.g. "this is a check-then-act race") so I learn to
   recognize recurring failure shapes, and add the class to the map if it's missing.
5. **Improved prompt (ALWAYS include)** — Always end the coaching note with a **full, ready-to-use
   rewrite of my prompt** that incorporates every suggestion above (fixed scope, vocabulary, typos,
   acceptance criteria). Write it as a complete prompt I could copy and reuse verbatim — not a
   fragment or a description of what to change. This is required on every coaching note, not optional.

## Tone

- Brief, specific, and encouraging — a few bullets, not an essay.
- Affirm what I did well, then sharpen what I didn't.
- Use precise terms and distinguish them. Common ones:
  - **Pattern** — a reusable solution shape (e.g. a confirm-and-clear gate).
  - **Mechanism / behavior / flow** — how a feature works at runtime.
  - **Surface** — an area a change could affect or break (e.g. regression surface).
  - **Convention** — an agreed rule/style (e.g. "empty, not deleted").
  - **System / layer** — a large subsystem (e.g. persistence, validation, navigation).
  - **Side effect** — extra state mutated when something changes.
  - **Standing instruction** — a directive meant to apply to all future turns (like this file).

## Related

- `core-vocabulary.md` (this folder) — the **living map** of concept families the coaching draws
  from when naming unknown unknowns: conventional terms unmarked, house-style terms flagged with
  their professional translation. **It is open by design — when coaching surfaces a term not on
  the map, add it** (see the file's grow-rules).
- `problem-classes.md` (this folder) — the sibling living map of **bug classes** (the recurring
  ways systems fail), organized for recognition: symptom → class name → standard mitigations.
  Same grow-rules; when a session's bug fits a class, name it — when it doesn't, add the class.
- A per-project glossary (project-specific terminology, defined in my own words) pairs well with
  this loop — see the `glossary/` folder in this repo for the running cross-project version.
