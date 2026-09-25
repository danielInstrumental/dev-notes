# Documentation & knowledge

> **Covers:** Writing down how the system works and why, so the next reader doesn't have to ask.

## Terms

- **convention** — an agreed rule/style (enforced by discipline, not by the machine)
- **specification (spec)** — the written statement of what to build
- **ubiquitous language** — one precise shared vocabulary used identically in talk, docs, and code
- **architecture overview** — a one-page map of the system as it is now (its context, layers and
  load-bearing patterns), drawn at the **C4 model**'s top two zoom levels: context → containers
- **ADR (architecture decision record)** — one short record per significant decision: context,
  decision, consequences (a plan log's decisions table is ADRs by another name)
- **diagrams-as-code** — diagrams written as text (e.g. **Mermaid**) inside markdown: versioned,
  diffable, rendered by GitHub and artifact viewers
- **living documentation** — docs that change with the code, kept current by process or generated
  from the code itself. In practice: give each doc an update TRIGGER and a "last reconciled" date —
  a current-state doc without a trigger will rot
- 🏠 **stranger test** (≈ could a competent stranger continue from the artifacts alone?)
