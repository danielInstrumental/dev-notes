# Errors & reliability

> **Covers:** What the system does when something fails: which way it fails, who pays for the failure, and how it recovers.

## Terms

- **fail-open / fail-closed** — on error, allow or block? (both valid; unexamined is not)
  → [[#Fail-closed / fail-open]]
- **fail-fast (fail-loud)** — on an unexpected condition, name it and STOP rather than paper over
  it with a fallback and continue
- 🏠 **classify-don't-swallow** (≈ don't swallow errors: fail fast on unexpected stored state —
  refuse the write instead of substituting a default)
- **fail-safe** — on failure, fall back to a state that causes no harm; for stored data, protect it
  even if the request fails
- **availability vs durability** — availability: the system keeps responding; durability: saved data
  isn't lost. Error handling decides which one a failure costs — the data (silently, later) or the
  current request (visibly, now). Related standard trade-off: **CAP** (consistency vs availability)

## Fail-closed / fail-open

The posture a guard takes when **it itself** can't decide (its own read/parse fails):
- **Fail-closed** — on error, **deny** (safer for integrity).
- **Fail-open** — on error, **allow** (safer for availability).

Both are valid — the point is to **choose consciously** and state which one you picked and why.
