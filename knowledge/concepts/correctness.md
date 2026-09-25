# Correctness

> **Covers:** Rules that must always hold and the checks that enforce them, including where a rule is enforced (the client/server axis).

## Terms

- **invariant** — a condition that must ALWAYS hold; break it and the system is wrong
  → [[#Invariant]]
- **precondition / postcondition** — what must be true before / after an operation
- **validation** — checking inputs against rules
  → [[#Client validation vs server guard]]
- **guard** — an enforced check that gates an action (the server-side one is authoritative)
  → [[#Guard]]

## Invariant

A condition that must **always hold**, or something breaks (e.g. "these two validators always agree").

## Guard

A check that **gates** an action: it runs before the action and either lets it proceed or rejects it. Usually implies a **server-side** gate — the authoritative line that genuinely *cannot* be bypassed.

## Backstop

A guard that **duplicates a check already done elsewhere** (usually the client) so that bypassing the first still gets caught.

## Client validation vs server guard — different *jobs*, not redundancy

| | Client validation | Server guard |
|---|---|---|
| **Purpose** | **UX** — fast feedback, disable the button | **Integrity** — the rule genuinely *cannot* be broken |
| **Trust** | none (bypassable: stale tab, crafted request, client bug) | authoritative |

**Rule of thumb:** anything that *must* hold belongs in a server guard; the client copy is a courtesy. A UI-only invariant is a recurring bug class.
