---
name: write-commits
description: Git commit message conventions — Conventional Commits types (feat/fix/docs/…), imperative subject lines, what-and-why bodies, atomic commits. Use when committing or recommending a commit message.
---

# Write Commits

> ## Project Configuration — fill in per project
> - **Format:** <"Conventional Commits" OR "plain language, no type prefix" — pick one per project and stay consistent>
> - **Who commits:** <e.g. "the agent recommends the message; the USER commits"— or the agent commits on request>
> - **Scope names in use:** <the project's (scope) vocabulary, if using Conventional Commits — e.g. auth, forms, sync>

## Purpose

Commit history is the project's other durable log — written once, read for years. A good message
lets a future reader (or `git log --oneline`) understand the change without opening the diff.

## When to use

Every commit. Also when the user asks "what should the commit message be" — recommend proactively,
don't wait to be asked twice.

---

## Conventional Commits (the industry standard format)

```
type(scope): short description

optional body — what and why

optional footer — BREAKING CHANGE: …, issue refs
```

| Type | Use for |
|---|---|
| `feat` | A new capability for the user |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting/whitespace — no logic change |
| `refactor` | Restructuring — no behavior change |
| `perf` | A performance improvement |
| `test` | Adding or correcting tests |
| `build` | Build system / dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance that changes no src/test behavior |
| `revert` | Reverts a previous commit (name it) |

- `(scope)` is optional: the area touched — `feat(auth): add password reset`.
- **Breaking changes:** `feat!:` or a `BREAKING CHANGE:` footer.
- Why teams adopt it: machine-readable history — changelogs and version bumps can be automated
  (`fix` → patch, `feat` → minor, `!` → major), and choosing a type forces you to notice when one
  commit is really two.

## The seven timeless rules (apply regardless of format)

1. **Imperative mood** in the subject: "add validation", not "added" — read it as "if applied,
   this commit will _add validation_".
2. Subject ≈ 50 characters, capitalized, no trailing period.
3. Blank line between subject and body.
4. Body wrapped at ~72 characters.
5. Body explains **what and why, not how** — the diff already shows how.
6. **Atomic commits:** one logical change per commit, revertable alone. (The commit-history twin of
   the one-unit-of-change rule in `plan-first`.)
7. If you can't summarize the commit in one line, it's probably two commits.

## Rules for the agent

- Check `git status` BEFORE asking about commits; if there's uncommitted work, recommend the
  message proactively.
- Recommend the message in plain text (no surrounding quotes), matching the project's configured
  format.
- Never commit or push unless the configuration block (or the user, explicitly) says so.

## Related skills

- `plan-first` — the unit of change being committed is the unit that skill scoped.
- `log-implementation` — the log entry and the commit describe the same unit; keep them consistent.
