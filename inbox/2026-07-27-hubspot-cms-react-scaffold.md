# CMS React (developer project) scaffold — anatomy, commands, gotchas

**Date:** 2026-07-27
**Tags:** hubspot · cms-react · projects-platform · recipe
**Status:** active

Context: a modules-only CMS React project (a step-form module) added alongside an existing
classic theme.

## The mental model

A HubSpot **developer project** is *just files on disk* — no `hs` commands are needed to
create or develop one. The CLI recognizes a folder as a project purely from marker files
(**configuration by convention**). `hs` only enters at deploy time (`hs project upload`),
which in my workflow I run myself, never the agent.

Two starting paths:

| Path | When | How |
|---|---|---|
| Scaffolder | Full React **theme** | `npx @hubspot/create-cms-theme@latest` (generates + installs) |
| Hand-build | **Modules-only** (`cms-assets`) alongside an existing classic theme — what I used | create the structure below |

HubSpot docs: [Build and deploy with projects](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/project-structure) ·
[CMS React quickstart](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/react-plus-hubl-quickstart) (the scaffolder path)

## Anatomy (modules-only variant)

```
my-project/
├── hsproject.json                    ← "this is a project" marker: {name, srcDir, platformVersion: "2025.2"}
└── src/cms-assets/
    ├── cms-assets-hsmeta.json        ← component config: {uid, type: "cms-assets", config.themePath}
    └── my-modules/                   ← name must match themePath above
        ├── cms-assets.json           ← {label, outputPath: ""} — label shown in HubSpot
        ├── package.json              ← deps: @hubspot/cms-components, react 18; dev: @hubspot/cms-dev-server
        ├── tsconfig.json             ← TS optional but used here
        ├── env.d.ts                  ← see gotcha #1
        └── components/
            ├── modules/MyModule/index.tsx   ← module: exports { Component, fields, meta }
            └── islands/MyModuleIsland.tsx   ← interactive subtree (client JS)
```

HubSpot docs: [Project structure](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/project-structure#project-structure)
(the "Without theme" tab is this variant)

## Modules and islands

Module contract: `index.tsx` must export **`Component`** (React, receives `fieldValues` prop),
**`fields`** (JSX tree of `@hubspot/cms-components/fields` inside `<ModuleFields>`), and
**`meta`** (`{label}`). Interactivity goes in an **island**: import with the `?island` suffix
and render via `<Island module={...} {...serializableProps} />` — SSR renders static HTML
first, the island's JS **hydrates** in the browser.

HubSpot docs: [Modules](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/modules) ·
[Islands](https://developers.hubspot.com/docs/cms/reference/react/islands) (also covers `hydrateOn`: `load` · `idle` · `visible`) ·
[Build health checks](https://developers.hubspot.com/docs/cms/reference/react/build-health-checks) (what the build verifies about those three exports)

## The complete command log (from zero to verified)

```shell
# 1. write the files above (no commands)
# 2. install
cd my-project/src/cms-assets/my-modules && npm install
# 3. sanity-check TS
npx tsc --noEmit
# 4. local preview server (NOTHING uploads; reads portal identity from ~/.hscli/config.yml)
npm run start          # → http://hslocal.net:3000 dashboard + live module previews (hot reload)
# 5. deploy — I run this myself, when a unit is verified:
hs project upload      # first run creates the project in the portal
```

From the docs: `hs project upload` builds **and, by default, auto-deploys** after a successful
build. Auto-deploy can be turned off in the project's settings, then deploy with `hs project deploy`.

HubSpot docs: [Local development](https://developers.hubspot.com/docs/cms/reference/react/local-development) ·
[Project CLI commands](https://developers.hubspot.com/docs/developer-tooling/local-development/hubspot-cli/project-commands)

## Gotchas learned

1. **`?island` imports fail typecheck out of the box.** HubSpot ships the declarations in
   `@hubspot/cms-components/islands.d.ts` but nothing includes them. Fix: an `env.d.ts` with
   `/// <reference path="./node_modules/@hubspot/cms-components/islands.d.ts" />` (and add it
   to tsconfig `include`). Do NOT hand-write `declare module '*?island'` with a plain
   `ComponentType` — the Island prop needs their lazy-ref type (`moduleName`/`moduleId`).
   *(HubSpot's own [quote-module example](https://developers.hubspot.com/docs/cms/start-building/building-blocks/modules/quotes/create-quote-modules)
   hits the same gap and silences it with `// @ts-expect-error -- ?island not typed`; the
   reference above keeps the real types instead.)*
2. **Expected warning pre-upload:** the dev server asks the portal for the project by name and
   logs "The request was not found" until the first `hs project upload`. Harmless for local work.
3. **React re-renders are async** — a Playwright `evaluate` that clicks and reads text in the
   same tick sees the stale DOM; read in a second evaluate.
4. **macOS TCC can wedge the whole session** (hit on 2026-07-27): killing/restarting the
   dev server processes coincided with macOS revoking Desktop-folder access for the host app —
   every read under `~/Desktop` returned `EPERM: Operation not permitted` while `/private/tmp`
   worked. Permissions on the files themselves were fine. Fix: fully quit + reopen the host app
   (VS Code) so the TCC grant re-applies; approve any "access files in your Desktop folder"
   prompt. Recognize the signature: EPERM on a folder whose `ls -ld` mode looks normal ⇒ think
   TCC, not chmod.

## Where this might graduate

- The recipe itself → a permanent HubSpot guide, if CMS React becomes a regular part of my work.
- Gotcha #3 → the Testing chapter (async rendering in browser tests).
- Gotcha #4 → `lessons/` — it's about macOS, not HubSpot.

## Reference

Links checked against HubSpot's developer docs on 2026-09-25.

- [CMS React overview](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/overview)
- [CMS React quickstart](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/react-plus-hubl-quickstart)
- [Build and deploy with projects](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/project-structure) — structure and schema
- [Modules](https://developers.hubspot.com/docs/cms/start-building/introduction/react-plus-hubl/modules) · [Islands](https://developers.hubspot.com/docs/cms/reference/react/islands) · [`@hubspot/cms-components` library](https://developers.hubspot.com/docs/cms/reference/react/cms-components-library)
- [Local development](https://developers.hubspot.com/docs/cms/reference/react/local-development) · [Project CLI commands](https://developers.hubspot.com/docs/developer-tooling/local-development/hubspot-cli/project-commands)
