---
name: write-commits
description: Git commit conventions (Conventional Commits types, message rules, one logical change per commit) and the copy-ready git add / git commit commands to hand the user. Use whenever a commit is due or the user asks about committing.
---

# Write Commits

> ## Project Configuration — fill in per project
> - **Format:** <"Conventional Commits" OR "plain messages, no type prefix" — pick one and stay consistent>
> - **Who commits:** <"the agent gives the commands, the USER runs them" (default) OR "the agent commits when asked">
> - **Scopes in use:** <the project's scope names, if using Conventional Commits — e.g. auth, forms, sync>
> - **After committing:** <e.g. "push to main" OR "push the branch and open a pull request">

## Purpose

Commit history is the project's longest-lived log: written once, read for years through `git log`,
`git blame` and code review. A diff shows *what* changed; only the message can say *why*. This
skill keeps every commit to one logical change with a message a stranger can follow, and hands the
user ready-to-run commands so committing takes seconds.

## When to use

- Whenever a unit of work is done and verified and a commit is due. Say so; don't wait to be asked.
- Whenever the user asks "what should the commit message be?" or "can I commit now?".

## Hard rules

1. **Don't commit or push unless the configuration or the user says so.** By default, give the
   commands and let the user run them. Why: the user decides what enters the history.
2. **One logical change per commit.** If the subject needs "and", or the change fits two types,
   it's two commits: give two command sets. Why: each commit can then be reviewed, reverted and
   understood on its own.
3. **Name the files in `git add`; never `git add .` or `git add -A`.** Why: a blanket add sweeps in
   stray files such as logs, `.env` or build output.
4. **Read the real state first** (`git status`, `git diff`). Never write the message from memory of
   what you changed. Why: the commit contains what's on disk, not what you intended.
5. **Always give the full command set** in the output format below, not only the message.

## Conventional Commits

The format, from the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
spec:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Use for | Example |
|---|---|---|
| `feat` | A new capability for the user | `feat(auth): add password reset` |
| `fix` | A bug fix | `fix(cart): stop double-counting discounts` |
| `docs` | Documentation only | `docs: correct spelling of CHANGELOG` |
| `style` | Formatting or whitespace, no change in what the code does | `style: apply prettier to the forms module` |
| `refactor` | Restructuring, no change in behavior | `refactor(sync): extract the retry logic` |
| `perf` | A performance improvement | `perf(search): cache the property list` |
| `test` | Adding or correcting tests | `test(cart): cover the empty-cart case` |
| `build` | Build system or dependencies | `build: upgrade marked to 18.0.14` |
| `ci` | CI configuration | `ci: run tests on every pull request` |
| `chore` | Maintenance that changes neither source nor tests | `chore: update .gitignore` |
| `revert` | Undoes an earlier commit (name it in a `Refs:` footer) | `revert: add password reset` |

Only `feat` and `fix` are defined by the spec. The other nine are the set from
[commitlint's config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional),
based on Angular's convention, which is the most widely used list. Other types are allowed; tools
that read the spec simply ignore them.

- **Scope** is optional: the area touched, in parentheses (`feat(auth): …`). Use the scope names
  from the configuration.
- **Breaking change:** a `!` right before the colon (`feat(api)!: …`), or a footer starting
  `BREAKING CHANGE:`, which must be uppercase. Either works with any type.
- **Version numbers:** release tools map `fix` → patch, `feat` → minor, and any breaking change →
  major (1.4.2 → 1.4.3, 1.5.0, 2.0.0).
- **Reverts:** the spec leaves them to tooling. The common form is `revert: <subject of the undone
  commit>` with a footer `Refs: <commit hash>`.
- **Casing:** the type is lowercase, and so is the start of the description (`feat: add login`).
  The spec accepts any casing if it's consistent; commitlint's default rejects a capitalized
  description.
- **More than one type fits?** Split it into several commits (the spec's FAQ).

## Message rules

The seven rules from Chris Beams, [How to Write a Git Commit Message](https://cbea.ms/git-commit/).
They apply in any format:

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain *what* and *why* vs. *how*

- With Conventional Commits, the casing rule above replaces rule 3. The 50 characters count the
  whole line, type included; treat it as a target (commitlint's hard limit is 100).
- **Imperative test:** the subject completes "If applied, this commit will ___".
  "add password reset" passes; "added password reset" doesn't.

| Instead of | Write | Why |
|---|---|---|
| `fixed stuff` | `fix(cart): stop double-counting discounts` | Names what was fixed |
| `feat: Added login page.` | `feat: add login page` | Imperative, lowercase, no period |
| `feat: add reset and fix footer typo` | `feat(auth): add password reset`, then `fix(footer): correct typo` | Two changes, two commits |
| `update` | `docs: add install steps to the README` | Type plus what changed |

## Procedure

1. Run `git status` and `git diff` (plus `git diff --staged` if anything is already staged). Note
   which files are **untracked** (new to git).
2. Group the changes into logical commits: one group, one commit.
3. For each group, pick the type and scope, write the subject and check it with the imperative
   test. Add a body when the *why* isn't obvious from the subject.
4. Give the user the command set below, one per commit, in the order to run them.
5. If the user spots a mistake in the last commit **before pushing** (wrong type, typo), give
   `git commit --amend -m '<corrected message>'`. After pushing, don't rewrite history; make a new
   commit instead.

## Output format

Every time a commit is due, give both options so the user can pick:

```
# Option A: stage the files, then commit
git add path/to/file-1 path/to/file-2
git commit -m 'feat(auth): add password reset'

# Option B: stage and commit in one step (only files git already tracks)
git commit -am 'feat(auth): add password reset'
```

Then, if the configuration says to push: `git push`.

- **What option B does:** `-a` stages every modified or deleted file that git already tracks, then
  commits. It does **not** include new (untracked) files. If the change has any, say so under the
  block, name them, and point the user to option A.
- **Option B takes every tracked change.** If unrelated edits are also present, say so and point the
  user to option A.
- **With a body:** add a second `-m`. Git turns each `-m` into its own paragraph:
  `git commit -m 'fix(cart): stop double-counting discounts' -m 'Discounts were applied per line and again on the total.'`
- **Quoting:** wrap messages in single quotes so the shell leaves `!`, `$` and backticks alone
  (inside double quotes, the `!` in `feat!:` can trigger shell history expansion). If the message
  needs an apostrophe, reword it ("does not" instead of "doesn't").
- **Several commits:** one numbered block per commit, in the order to run them.

## Related skills

- `plan-first`: the unit of change it scoped is the unit you commit.
- `log-implementation`: the log entry and the commit describe the same unit; keep them consistent.
- `write-handoff`: its git-state line reports what's committed and what isn't.
