# ROADMAP — future plans and improvements for the skills kit

<!-- The kit's own forward plan, run on the kit's own TODO conventions (dogfooding):
     Now / Next / Later sections · every Later item carries a REVISIT TRIGGER · items graduate
     out when done (note the commit) · adding requires a trigger or a felt pain — speculative
     items are bloat, the thing this kit exists to prevent. Upstream-first applies: improvements
     land here in dev-notes, then re-copy to projects. -->

Three standing improvement directions (the lens for every item below):
**simplify** (fewer words, fewer duplicates) · **generalize** (convention over house style) ·
**formalize** (adopt the professional/standard tool for what we do by hand).

## Now

- [ ] **First real adoption** — onboard the kit into the next project (copy folders, config-block
  interview, CLAUDE.md starter). Fold every friction found back into the kit: unclear config
  slots, missing steps in the README, skills that read wrong without UMHS context.

## Next

- [ ] **De-duplicate the data-file list** (simplify) — the list of `.ai/` data files currently
  lives in 3 places (skills README adoption step · CLAUDE-md-starter · templates folder itself);
  that's our own drift class. Pick ONE source (probably the templates folder) and point the
  others at it.
- [ ] **Worked examples per skill** (improve) — the UMHS originals referenced real log entries as
  examples; generalization removed them. Add one small FICTIONAL worked example per skill (a
  sample handoff §3, a sample implementation-log entry). Trigger: the first time an agent or
  reader produces a malformed artifact because the format alone wasn't enough.
- [ ] **CI gate template** (formalize) — a starter GitHub Actions workflow (run the test suite on
  every push/PR, red blocks merge) + a config line in write-tests. Trigger: the new project has a
  test suite worth enforcing — this is the rung that turns the kit's tests into a real gauntlet.

## Later — each with its revisit trigger

- [ ] **`branch-and-pr` skill** — branch naming, when to open the PR, PR description format, merge
  rules, agent-as-author / human-as-reviewer. *Trigger: the new project adopts feature branches +
  PRs (decided 2026-07-24 to adopt branches early).*
- [ ] **Generalize the UMHS CRM/API inspection toolkit** — the `.notes/API/` scripts (find-property
  by label · read-only record/association inspectors · the orphan-audit dry-run/archive pattern ·
  the token seam · the one-question probe template). The full inventory with porting notes lives in
  UMHS at `.ai/GENERALIZATION-CANDIDATES.md`. *Trigger: the first project that talks to HubSpot (or
  any external API) needs grounding tools — port then, parametrized, dry-run-by-default.*
- [ ] **`adopt-kit` skill** — automate the onboarding interview (copy folders, create data files,
  interview for config blocks). *Trigger: the SECOND adoption — do it manually once first, then
  automate what proved repetitive.*
- [ ] **Split plan-first's advanced sections into a reference file** (simplify / progressive
  disclosure) — evidence tiers, pre-building under a fork, shipping modes could move to a
  `references.md`. *Trigger: plan-first/SKILL.md grows past ~400 lines or agents demonstrably
  skim past the advanced rules.*
- [ ] **E2E / browser-automation skill** (formalize) — generalize the UMHS playwright skill (never
  ported). *Trigger: adopting the E2E rung of the test-taxonomy ladder — manual browser-verify of
  the same flows is eating session time.*
- [ ] **Ladder-rung notes for gherkin/BDD, property-based, mutation testing** — one reference each
  with tooling + first-run guidance. *Trigger: adopting that rung on a real project (encode what
  we've validated, not what we've read about).*
- [ ] **Kit versioning / CHANGELOG** (formalize) — a CHANGELOG.md so downstream projects can tell
  which kit version their copy came from. *Trigger: 2+ projects consuming the kit and a "does
  your copy have X?" question actually occurring.*
- [ ] **Frontmatter audit against Claude Code skill features** (formalize) — `allowed-tools`,
  argument hints, etc. were deliberately skipped for simplicity. *Trigger: a concrete need (e.g.
  a skill that must be read-only), not before.*
