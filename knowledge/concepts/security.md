# Security

> **Covers:** Who may do what, and what input can be trusted.

## Terms

- **trust boundary** — the line between code you control and input anyone can forge; everything
  crossing it is untrusted until validated/authorized ("never trust the client")
- **authentication (authn)** — proving WHO is calling; derive it server-side from the session,
  never from a client-sent param
- **authorization (authz)** — whether that caller MAY do this (logged-in ≠ entitled)
- **object-level authorization / ownership check** — authz per RECORD: does this id belong to
  this caller? Its absence is **IDOR/BOLA** — the change-the-id-in-the-URL bug class
- **least privilege** — every user, process and credential gets only the access its job needs
- **attack surface** — everything an attacker can reach or try (endpoints, params, uploads)
- **validation vs sanitization** — reject bad input vs transform it to be safe (prefer reject +
  allowlists)
- **OWASP Top 10 / STRIDE / CWE** — three standard references: **OWASP Top 10** = the most critical
  web app risks; **STRIDE** = six threat categories for threat modeling; **CWE** = the numbered
  catalog of weakness types (see the Security family in `../bug-classes.md`)
- **defense in depth** — several independent layers of protection, so one failing doesn't breach the
  whole (e.g. a client check for UX + a server check for integrity) → [[#Defense-in-depth]]

## Defense-in-depth

Enforcing the same **invariant** in more than one layer, so one bypassed or failed layer doesn't breach it. The standard shape: **client check (UX) + server guard (integrity)**.
