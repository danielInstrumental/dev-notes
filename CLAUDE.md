# dev-notes — my personal developer reference

A vault of what I learn while building: engineering concepts organized like a reference book, an
inbox of notes in progress, a reusable agent-skills kit, and snippets. The markdown is browsable
as a searchable site (built from these files), which will eventually become a real website.
I'm learning as I go — much of this is new to me.

## Start of every session

1. Read the **top entry** of [`.ai/HANDOFF_LOG.md`](.ai/HANDOFF_LOG.md) and [`.ai/TODO.md`](.ai/TODO.md).
2. Brief me before changing anything: where we are, what's next, any open questions.

## How we work

- **Propose first, then wait for my approval.** Describe the exact change (before/after or a
  diff) and ask. Approval covers only what was described. Reading files to answer a question is fine.
- After approval: make the change, show what changed, then **commit and push to `main`** when I
  say so. One logical change per commit.
- After any change to `knowledge/`, `inbox/` or `site/`: rebuild the site and republish it.
- **Explain things plainly, with a concrete example.** Check claims against standard references
  and say honestly when my notes are wrong or too narrow. Prefer conventional, right-sized practice
  over expert-only overhead; when a note says "always", ask whether it should be "by default".

## Rules

- **This repo is PUBLIC.** No client, project or account names, IDs or private details. Make
  notes generic (`my-project`, `my-theme`) before they land here.
- **Markdown is the source of truth.** Never edit `site/dist/` — change the markdown and rebuild.
- **Concepts** (`knowledge/concepts/`): one file per chapter; a term goes in the chapter whose
  **Covers** line fits it; a term and its deep dive live in the same chapter. Empty chapters are
  intentional — add terms as I meet them, or when I ask "what's missing from <chapter>?".
- **Inbox** (`inbox/`): dated notes with `Date` / `Tags` / `Status`; link official docs; a note
  graduates to a permanent home or gets dropped (see `inbox/README.md`).
- **The build fails loudly on purpose.** Fix the note, never loosen the build to get green.

## Where things live

| Path | What |
|---|---|
| `knowledge/concepts/` | The concepts book — `README.md` is the table of contents (5 parts, 16 chapters) |
| `knowledge/bug-classes.md` | Bug classes (not yet on the site — see TODO) |
| `inbox/` | Notes in progress |
| `kit/` | The agent-skills kit + templates + `install.sh` (installs into OTHER projects, not this one) |
| `snippets/` | Reusable code (HubSpot read-only helpers) |
| `lessons/` | Takeaways from projects (empty so far) |
| `site/` | `build.mjs` (markdown → data) + `template.html` (the page) — see `site/README.md` |
| `.ai/HANDOFF_LOG.md` · `.ai/TODO.md` | Session handoffs (newest on top) · what's left (Now / Next / Later) |

## Site

```
cd site && npm install && npm run build    # → site/dist/dev-notes.html
```

Published (private) at https://claude.ai/artifact/JdFXsWL53isSAMmrGwuCTe — republish to that same
link after each rebuild so the URL never changes.

## End of every session

Prepend a new entry to `.ai/HANDOFF_LOG.md` (what happened, where things stand, decisions,
where to pick up) and update `.ai/TODO.md` (move finished items to Done, triage new ones).
