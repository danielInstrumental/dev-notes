# Documentation & knowledge

> **Covers:** Writing down how the system works and why, so the next reader doesn't have to ask.

## Terms

- **convention** — an agreed rule/style (enforced by discipline, not by the machine)
- **specification (spec)** — the written statement of what to build
- **ubiquitous language** — one precise shared vocabulary used identically in talk, docs, and code
- **architecture overview** — the one-page current-state map of a system's context, layers, and
  load-bearing patterns; structured by the **C4 model**'s zoom levels (context → containers →
  components → code; maintain only the top two)
- **ADR (architecture decision record)** — one short record per significant decision: context,
  decision, consequences (a plan log's decisions table is ADRs by another name)
- **diagrams-as-code** — diagrams written as text (e.g. **Mermaid**) inside markdown: versioned,
  diffable, rendered by GitHub and artifact viewers
- **living documentation** — docs with an explicit update TRIGGER and a "last reconciled" date;
  a current-state doc without a trigger is a rot certainty
- 🏠 **stranger test** (≈ could a competent stranger continue from the artifacts alone?)
