# site — the browsable page built from these notes

The markdown in [`knowledge/`](../knowledge/) is the source of truth. This folder turns it into one
searchable HTML page. You never edit the page itself: change the markdown, then rebuild.

```
cd site
npm install        # once — installs marked, the markdown parser
npm run build      # → site/dist/dev-notes.html
```

## How it works

| File | Job |
|---|---|
| [`build.mjs`](build.mjs) | **Reads** the markdown and turns it into data: the concepts map becomes families of terms, each deep-dive file becomes an intro plus its `##` sections, and every `→ [[file#Heading]]` pointer is resolved to the section it names. The data is dropped into the template. |
| [`template.html`](template.html) | **Everything you see**: the layout, colors, fonts, search, sidebar and dark mode. It holds no notes of its own, just a `const DATA = __DATA__;` slot that the build fills. |
| `dist/` | The built page. Not committed (it's generated), see `.gitignore`. |

So a content change goes in `knowledge/`, a look-and-feel change goes in `template.html`, and
`build.mjs` only changes when the *format* of the notes changes.

**The build fails loudly on purpose.** A concepts-map line it can't parse, a deep-dive file missing
from the map's index table, or a `[[link]]` that points nowhere stops the build with a message
naming the problem. It stops instead of skipping because a note that silently disappears from
the page is worse than a build you have to fix.

## Adding to it

- **A new term:** add a line to its family in `knowledge/concepts/README.md`, then rebuild.
- **A new deep-dive file:** create it in `knowledge/concepts/`, add a row to the map's
  *Deep dives* table (the build insists), and point terms at it with `→ [[file#Heading]]`.
- **A new section of the site** (bug classes, testing…): a parser in `build.mjs` plus a view in
  `template.html`. We build these one at a time.
