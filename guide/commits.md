# Commits

> **The question this answers:** What does a commit message look like, how large is one commit, and
> who writes it?

_Status: in progress. All five sections are drafted and awaiting review._

The conventions on this page are kept in the [`write-commits` skill](../kit/skills/write-commits/SKILL.md),
which the agent follows whenever a commit is due. The format, the types and the message rules below
are taken from that skill when the site is built, so the page and the skill cannot disagree.

## 1. The map

A **commit** is a saved snapshot of changes in a repository's history. Its **message** has a
**subject** (the first line) and an optional **body** separated from it by a blank line. Git treats
the text up to the first blank line as the commit's title and uses it throughout its tools.

A diff shows *what* changed. Only the message can record *why*. The history is read long after the
details are forgotten: through `git log`, `git blame` and code review. A message is written once and
read for years.

Two formats are in common use:

| Format | A subject line | Suited to |
|---|---|---|
| **Conventional Commits** | `feat(auth): add password reset` | Shared repositories, projects with releases, and any project where tools read the history to produce changelogs or version numbers |
| **Plain** | `Add password reset` | Personal or small repositories where nothing is generated from the history |

Pick one format per project and apply it consistently.

### Conventional Commits

![[kit/skills/write-commits/SKILL.md#Conventional Commits]]

### Message rules

![[kit/skills/write-commits/SKILL.md#Message rules]]

### One logical change per commit

Each commit holds one change that can be reviewed, reverted and understood on its own; this is
called an **atomic commit**. Choosing a type is a useful test: when a change fits two types, or the
subject needs the word "and", it is two commits.

Branches, pull requests and remotes are defined in the
[Delivery & version control chapter](../knowledge/concepts/delivery-and-version-control.md).

## 2. Talk it through

Settle these at the start of a project, then record the answers (section 3).

| Question | Options | Default |
|---|---|---|
| Which format? | Conventional Commits, or plain messages | Conventional Commits when the repository is shared or released |
| What casing follows the type? | lowercase (`feat: add login`), or capitalized | Lowercase, which is what commitlint's default configuration requires |
| Which scopes? | A short list of the project's areas, such as `auth`, `forms`, `sync` | No scopes at first. Add one when the same area keeps recurring |
| Who runs the commit? | The agent supplies the commands and the developer runs them, or the agent commits on request | The agent supplies the commands |
| Are pull requests squashed when merged? | Squash into one commit, or keep every commit | With squash merging, the commits of a pull request become a single commit on `main`, whose message is written at merge time (often from the pull request title). That message is the one that must follow the format |

## 3. Set it up

1. Install the kit in the project (`kit/install.sh`), so the agent follows the `write-commits` skill.
2. Record the section 2 answers in the skill's **Project Configuration** block, or in the
   project's `CLAUDE.md`.
3. Optional, not needed on day one: a check that rejects messages that break the format, such as
   commitlint run from a git hook or in CI. Worth adding when several people commit, or when a tool
   generates releases from the history.

## 4. As you build

Before each commit:

1. Review what changed with `git status` and `git diff`.
2. Confirm it is one logical change. If the subject needs "and", split it.
3. Choose the type, and the scope if the project uses scopes.
4. Check the subject: it completes "If applied, this commit will ___", stays near 50 characters and
   has no closing period.
5. Add a body when the reason for the change is not obvious from the subject.
6. Stage the files by name rather than with `git add .`, so stray files such as logs or `.env`
   stay out.

### The commands

| Command | What it does |
|---|---|
| `git status` | Lists changed, staged and new (untracked) files |
| `git diff` | Shows unstaged changes line by line. Add `--staged` for staged changes |
| `git add <files>` | Stages the named files for the next commit |
| `git commit -m '<message>'` | Commits what is staged |
| `git commit -m '<subject>' -m '<body>'` | The same, with a body. Each `-m` becomes its own paragraph |
| `git commit -am '<message>'` | Stages every modified or deleted file that git already tracks, then commits. **New files are not included** |
| `git commit --amend -m '<message>'` | Replaces the last commit. Use it only before pushing |
| `git push` | Sends local commits to the remote repository |

Wrap messages in single quotes, so the shell leaves characters such as `!` and `$` untouched.

## 5. Go deeper

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/): the specification.
  Its FAQ covers commits that fit more than one type, using the wrong type, squash workflows and
  reverts.
- [How to Write a Git Commit Message](https://cbea.ms/git-commit/), Chris Beams: the seven rules,
  with the reasoning behind each.
- [commitlint config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional):
  the eleven types and the checks it enforces.
- [git commit documentation](https://git-scm.com/docs/git-commit): every option of the command.
- The [`write-commits` skill](../kit/skills/write-commits/SKILL.md): the instructions the agent
  follows.
