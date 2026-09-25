# Delivery & version control

> **Covers:** How work is sequenced into shippable steps, and how changes reach the main branch.

## Terms

- **vertical slice** — one thin feature path through EVERY layer (two fields: schema → save →
  read → display), vs a **horizontal slice** (one whole layer at a time — whose weakness is that
  end-to-end flow is invisible until the very end)
- **walking skeleton** — the smallest end-to-end implementation that actually runs through all
  layers; build it first, then add flesh incrementally
- **tracer bullet** — a walking skeleton built specifically to SEE the trajectory (logs at each
  hop); tracer code is KEPT and extended
- **spike / prototype** — throwaway code written only to answer a question, then deleted (the
  opposite of a tracer bullet — never let a spike quietly become production)
- **incremental development** — extending a proven path piece by piece, vs **big-bang** (build
  everything, connect at the end, meet all the wiring bugs at once)
- **feature branch** — an isolated line of history per task; `main` stays always-releasable
- **pull request (PR)** — a proposal to merge a branch, showing the full diff; where review and CI
  attach
- **code review** — a second reader approves the diff before merge (with agents: the agent authors,
  the human reviews)
- **trunk-based development** — small short-lived branches merged to main frequently (the modern
  default), vs long-lived branch schemes (GitFlow)
- **CI gate on the PR** — tests/lint run automatically; red blocks the merge button
- **worktree / private clone** — an isolated copy where an agent works without touching the main
  checkout
- **remote** — the shared copy (e.g. GitHub); push publishes local commits to it
