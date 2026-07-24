# CLAUDE.md starter block

Paste the block below into the new project's `CLAUDE.md` (create the file at the repo root if it
doesn't exist — Claude Code loads it automatically every session). Fill the `<…>` slots.

```markdown
# <PROJECT NAME>

## Session workflow (non-negotiable)

- At the START of every session, run the `session-startup` skill and present its 4-part
  briefing before proposing or writing any code.
- Before ANY code change, run the `plan-first` skill. No code without an approved plan and
  an explicit "go".
- After each change the user verifies, run the `log-implementation` skill.
- At session end (or when context nears compaction), run the `write-handoff` skill.
- STANDING RULE: follow the `prompt-coaching` skill — end EVERY response (answers and
  implementations alike) with the prompt-coaching note, including the full rewritten prompt.

## Boundaries

- Deploy/verify: <who deploys and how changes are verified — e.g. "NEVER deploy; the user
  deploys and verifies in the browser">
- <any other hard prohibitions — secrets, files not to touch, endpoints not to call>

## Where things live

- Handoffs: `.ai/HANDOFF_LOG.md` (newest on top) · As-built log: `.ai/IMPLEMENTATION_LOG.md`
  (newest at EOF) · Plans: `.ai/PLAN_LOG.md` + `.ai/PLANS/` · Bugs: `<bug log path>` ·
  Todos: `.ai/TODO.md` (Now / Next / Later — triage new items on entry)
- Source code: `<path>` · Tests: `<run command>` → expect `<current expected result>`
```
