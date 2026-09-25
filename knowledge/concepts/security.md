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
- **least privilege** — every credential carries only the scopes its job needs
- **attack surface** — everything an attacker can reach or try (endpoints, params, uploads)
- **validation vs sanitization** — reject bad input vs transform it to be safe (prefer reject +
  allowlists)
- **OWASP Top 10 / STRIDE / CWE** — the canonical catalogs and taxonomy of vulnerability classes;
  the professional shared vocabulary for this chapter (see the Security family in
  `../bug-classes.md`)
- **defense in depth** — the same protection at multiple layers; the client copy is UX,
  the server copy is the real line → [[#Defense-in-depth]]

## Defense-in-depth

Enforcing the same **invariant** in more than one layer, so one bypassed or failed layer doesn't breach it. The standard shape: **client check (UX) + server guard (integrity)**.
