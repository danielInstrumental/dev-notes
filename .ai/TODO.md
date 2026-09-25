<!-- TODO — planned work for this repo (the vault + its site). IDs are TODO-1, TODO-2, … never
     reused. TRIAGE on entry: every new item goes in Now / Next / Later; Later items carry a
     REVISIT TRIGGER. Any session that opens, closes or moves an item updates this file.
     The skills kit keeps its own forward plan in kit/ROADMAP.md — this file links to it
     rather than copying it. Format from kit/templates/TODO.md. -->

# TODO

Item format: `- [ ] TODO-N — one line`, and for Later items the REVISIT TRIGGER.

## Now — current focus

- [ ] **TODO-1 — Testing review, part 2.** One idea at a time, keep / soften / drop each in
  `kit/skills/write-tests/SKILL.md`: the agentic extensions (**pin** first, then drift/parity
  guard, tripwire, inertness pin, replay/golden-master) → their rules (never delete-to-green,
  taxonomy README, predicted test impact) → a wording check of the 10 conventional foundations →
  the static gate → the growth ladder.

## Next — queued behind Now

- [ ] **TODO-2 — Adopt the kit in next week's project** (the "Now" item in `kit/ROADMAP.md`):
  install with `kit/install.sh`, fill the config blocks, and fold every friction back into the kit.
- [ ] **TODO-3 — Bug classes on the site.** First decide whether they file under the same 16
  chapters; then check their definitions against standard references, as with the concepts.
- [ ] **TODO-4 — Review the rest of the kit for a learner** (as TODO-1 did for testing):
  `plan-first` (406 lines), `session-startup`, `write-handoff`, `log-implementation`,
  `comment-protocol`, `prompt-coaching` — conventional vs house style, right-sized or overkill.
- [ ] **TODO-5 — Skills kit section on the site.**
- [ ] **TODO-6 — Snippets section on the site.**
- [ ] **TODO-7 — Lessons: a template + a site section.** Candidate first lesson: the macOS
  Desktop-permissions (TCC) gotcha from the CMS React inbox note (its "graduate" line).

## Later — parked, each with its revisit trigger

- [ ] **TODO-8 — Fill the empty chapters** (Performance · Integration & APIs · Operations &
  observability). *Revisit when a project meets one of those topics, or I ask "what's missing
  from <chapter>?".*
- [ ] **TODO-9 — Rebuild + republish automatically** (e.g. on every push). *Revisit when a
  manual rebuild gets forgotten, or rebuilding becomes friction.*
- [ ] **TODO-10 — Move the site to a real website** (a static host). *Revisit when most sections
  are on the site, or I want it outside claude.ai.*
- [ ] **TODO-11 — Keep per-project config out of `SKILL.md`**, so `install.sh --update` stops
  wiping it. *Revisit during TODO-2 — the first real adoption will show whether it hurts.*
- [ ] **TODO-12 — A lighter handoff format for small repos.** The kit's 13-section handoff is heavy
  for a notes repo; this log uses a lighter version. *Revisit after 2–3 sessions using it — then
  fold what worked back into `kit/skills/write-handoff`.*

## Done

- 2026-09-25 — Session 1: cleanup, knowledge/kit split, concepts as a book, definitions checked,
  inbox, site, bug-fix testing rules, this log. Details: `.ai/HANDOFF_LOG.md`, 2026-09-25 entry.
