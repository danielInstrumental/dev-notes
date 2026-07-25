# HubSpot Read-Only Helpers

Self-contained CLI scripts (Node 18+, zero dependencies) for asking a live HubSpot portal
one-question grounding queries. **Strictly read-only by construction** — the only POST calls are
batch-*reads* and search; nothing here creates, updates, or archives anything. Generalized from
the UMHS project's `.notes/API/` toolkit (2026-07-25); parametrized by object type so they work
on any portal.

## Setup

1. Create a **Private App** in the portal (Settings → Integrations → Private Apps) with
   **read-only scopes** (`crm.objects.*.read`, `crm.schemas.*.read`, `forms`). Least privilege:
   don't reuse a broad admin token.
2. Provide the token via either (env wins):
   - `export HS_PAT=pat-na1-...`, or
   - a `.token` file in this folder containing only the token (gitignored here — keep it that way).

## The tools

| Script | Question it answers | Example |
|---|---|---|
| `find-property.js` | "Which property is labeled X, and what's its internal name / type / options?" | `node find-property.js deals country` |
| `get-record.js` | "What does record N actually hold right now?" | `node get-record.js deals 123 dealname,createdate` |
| `search-records.js` | "Which records have property = value?" (⚠ see consistency note) | `node search-records.js contacts email x@y.com` |
| `list-associations.js` | "What is record N associated to — ALL pages, with labels + typeIds?" | `node list-associations.js deals 123 contacts` |
| `find-form.js` | "Which form is named like X, and what fields does it have?" | `node find-form.js application` |
| `orphan-audit.js` | "Which child records lost their parent?" (lists only — never archives) | `node orphan-audit.js 2-12345678 deals record_name` |

Custom objects: pass the type id (`2-…`) as the objectType. Standard objects accept names
(`contacts`, `deals`, `companies`) or ids (`0-1`, `0-3`).

## Lessons baked in (why these exist)

- **Resolve properties by display LABEL, then verify the internal name + type** — keyword-guessing
  internal names wires the wrong property (find-property prints both, plus enum options, because
  enum writes must match option values EXACTLY).
- **Search is eventually consistent** — it lags writes by seconds+. Never use `search-records` for
  read-after-write verification; read by id (`get-record`) instead. Duplicate-create bugs are born
  from this exact mistake.
- **Association lists paginate** — a one-page read silently truncates; `list-associations` walks
  every cursor page and shows direction-specific typeIds + labels.
- **Platforms don't cascade-delete** — deleting a parent leaves child records dangling, unreachable
  by parent-scoped sync logic; `orphan-audit` finds them. Archiving is deliberately NOT in this
  set — that's a conscious write action for the UI or a future write-tool.
- **Ground before you plan**: these are the executable half of "verify every claim against the
  live system" — a plan that names a property or association this toolkit hasn't confirmed is
  guessing.

## Safety posture

Read-only by construction · least-privilege token · `.token` gitignored · no third-party
dependencies (nothing to audit) · every script prints exactly what it queried.
