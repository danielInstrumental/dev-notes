# Errors & reliability

> **Covers:** What the system does when something fails: which way it fails, who pays for the failure, and how it recovers.

## Terms

- **fail-open / fail-closed** — on error, allow or block? (both valid; unexamined is not)
  → [[#Fail-closed / fail-open]]
- **fail-fast (fail-loud)** — on an unexpected condition, name it and STOP rather than paper over
  it with a fallback and continue
- 🏠 **classify-don't-swallow** (≈ fail-fast on unexpected stored state: refuse the write instead
  of substituting a default)
- **fail-safe** — when in doubt, protect the stored data at the cost of availability
- **availability vs durability** — the write-path trade: "operations always succeed" vs "data
  survives when service degrades"; error handling chooses who pays for a failure — the data
  (silently, later) or the current request (visibly, now)

## Fail-closed / fail-open

The posture a guard takes when **it itself** can't decide (its own read/parse fails):
- **Fail-closed** — on error, **deny** (safer for integrity).
- **Fail-open** — on error, **allow** (safer for availability).

Both are valid — the point is to **choose consciously** and state which one you picked and why.
