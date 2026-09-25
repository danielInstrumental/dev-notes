# Inbox

Notes on things I'm still working out: recipes, gotchas and platform details from real builds
that may or may not earn a permanent place. The inbox keeps [`knowledge/`](../knowledge/) clean
while giving everything else somewhere to land.

## One note per file

Name it `YYYY-MM-DD-short-title.md` (the date you wrote it) and start it with this header:

```markdown
# <Title>

**Date:** 2026-07-27
**Tags:** hubspot · cms-react · recipe
**Status:** active
```

The build refuses a note without a `Date` and a `Status`.

## Status: every note is heading somewhere

| Status | Meaning |
|---|---|
| `active` | Still useful as it is, or still being learned |
| `graduated → <where>` | Its lasting part moved to a permanent home (a concept term, a lesson, a snippet, a guide). Keep the note for its history, or delete it |
| `dropped` | Turned out not to matter. Delete it when you next tidy up |

**Graduating** means moving the part that turned out to be general into the place that fits it
by convention: a term into its concepts chapter, a war story into `lessons/`, reusable code into
`snippets/`. What stays behind is the project-specific detail.

## Keep it generic

This repo is public. Replace client, project and account names with placeholders (`my-project`,
`my-theme`) before a note lands here, and keep the commands, structures and gotchas exactly as
they were.
