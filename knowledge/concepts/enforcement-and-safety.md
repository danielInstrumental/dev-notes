# Enforcement & Safety

The vocabulary for **where and how a rule is enforced** — the client/server axis.

## Guard
A check that **gates** an action: it runs before the action and either lets it proceed or rejects it. Usually implies a **server-side** gate — the authoritative line that genuinely *cannot* be bypassed.

## Backstop
A guard that **duplicates a check already done elsewhere** (usually the client) so that bypassing the first still gets caught.

## Defense-in-depth
Enforcing the same **invariant** in more than one layer, so one bypassed or failed layer doesn't breach it. The standard shape: **client check (UX) + server guard (integrity)**.

## Client validation vs server guard — different *jobs*, not redundancy

| | Client validation | Server guard |
|---|---|---|
| **Purpose** | **UX** — fast feedback, disable the button | **Integrity** — the rule genuinely *cannot* be broken |
| **Trust** | none (bypassable: stale tab, crafted request, client bug) | authoritative |

**Rule of thumb:** anything that *must* hold belongs in a server guard; the client copy is a courtesy. A UI-only invariant is a recurring bug class.

## Fail-closed / fail-open
The posture a guard takes when **it itself** can't decide (its own read/parse fails):
- **Fail-closed** — on error, **deny** (safer for integrity).
- **Fail-open** — on error, **allow** (safer for availability).

Both are valid — the point is to **choose consciously** and state which one you picked and why.

## Related distributed-systems terms
- **Eventual consistency** — after a write, reads may not immediately reflect it; the system converges "eventually." A search/index right after a write can still return the old result. A frequent cause of duplicate-create races: two callers both read "doesn't exist" and both create.
- **Read-after-write consistency** — a read is guaranteed to reflect a preceding write. When you need an existence check to be reliable, use a read-after-write-consistent path, not an eventually-consistent one.

See also: [[correctness-and-drift]], [[functions-and-effects]] (idempotency), [[state-and-data]].
