# Guide — starting a project

What to think through, and discuss with the agent, when a new project starts. One page per theme.

This is the companion to [`knowledge/`](../knowledge/README.md): the concepts there are reference
material I look a term up in, while the guide is the order I work through things at kickoff. Guide
pages link into the concepts chapters for vocabulary instead of redefining it.

## Themes

Status: **To do** = page not written yet · **In progress** = page started. We build these one at a time.

| # | Theme | The question it answers | Concepts chapters it draws on | Status |
|---|---|---|---|---|
| 1 | Requirements & scope | What are we building, for whom, what counts as done, and what is out of scope? | [Planning & prioritization](../knowledge/concepts/planning-and-prioritization.md) | To do |
| 2 | Architecture | What are the main pieces, where does each run, and how do they talk to each other? | [Design & structure](../knowledge/concepts/design-and-structure.md) · [Functions, effects & flow](../knowledge/concepts/functions-effects-and-flow.md) | To do |
| 3 | Data & integrations | What data exists, where is the single source of truth, and how do we read and write external systems? | [Data & state](../knowledge/concepts/data-and-state.md) · [Integration & APIs](../knowledge/concepts/integration-and-apis.md) | To do |
| 4 | Security & access | Who can log in, who can see or change which record, and where do secrets live? | [Security](../knowledge/concepts/security.md) · [Correctness](../knowledge/concepts/correctness.md) | To do |
| 5 | [Testing](testing.md) | What kinds of tests, how are they set up from day one, and what must pass before shipping? | [Testing](../knowledge/concepts/testing.md) | In progress |
| 6 | Environments & deployment | Where do we develop and test safely, how does code reach production, and how do we roll back? | [Delivery & version control](../knowledge/concepts/delivery-and-version-control.md) | To do |
| 7 | Failure handling & monitoring | What happens when something fails, and how do we find out? | [Errors & reliability](../knowledge/concepts/errors-and-reliability.md) · [Operations & observability](../knowledge/concepts/operations-and-observability.md) | To do |
| 8 | Ways of working | How do we branch, document, and work with the agent? | [Documentation & knowledge](../knowledge/concepts/documentation-and-knowledge.md) · [Working with AI agents](../knowledge/concepts/working-with-ai-agents.md) · the [kit](../kit/README.md) | To do |
| 9 | [Commits](commits.md) | What does a commit message look like, how large is one commit, and who writes it? | [Delivery & version control](../knowledge/concepts/delivery-and-version-control.md) · the [`write-commits` skill](../kit/skills/write-commits/SKILL.md) | In progress |

_The list is a starting proposal, not checked against a standard reference yet. Themes may merge,
split or be added as each page gets written._
