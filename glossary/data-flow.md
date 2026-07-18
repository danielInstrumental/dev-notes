# Data Flow

**Data flow** = the route a value travels through the system. "Trace the data flow" (or "trace it **end-to-end**") means follow the value through **every hop**, checking what each hop does to it. The precise version of "review how the value propagates."

## Write path vs read path
- **Write path** — input → persisted → projected (how a value gets in and stored).
- **Read path** — persisted → rendered (how a stored value gets back out).

A system often has more than one read path (e.g. loading a saved record vs prefilling from a different source). Naming which path you mean avoids confusion.

## Hop
One step (one "arrow") in the chain. **Bugs live at hops:** a trim at one hop, a format transform (`yes → Yes`) at another, a debounce delaying one. When something stored doesn't match something entered, ask **"which hop changed it?"**

## Propagation
A value flowing onward through its downstream hops. *"Does clearing the field propagate all the way to storage?"*

## Debounce
Delaying an action until input has "settled" — i.e. wait until N ms after the *last* event before firing once, instead of firing on every event. Common for autosave and search-as-you-type. (Related: **throttle** = fire at most once per interval.)

## Event bus / custom-event pattern
Components that don't share state communicate by **dispatching and listening for events** rather than through a shared store. Useful when independently-loaded parts of a page can't see each other's state. Contrast with a centralized store (Redux-style) — with an event bus there is no single store; parts talk via events.

## Questions worth asking
- *"Trace the **write path** for this value **end-to-end** — input to storage to any projected copy."*
- *"It's right in memory but wrong in storage → the bug is at the **save hop**, not the input."*
- *"Do we need a second **read path** for this, distinct from the existing one?"*

See also: [[state-and-data]], [[data-modeling]].
