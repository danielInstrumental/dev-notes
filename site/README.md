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
| [`build.mjs`](build.mjs) | **Reads** the markdown and turns it into data: `knowledge/concepts/README.md` gives the parts and chapters in book order, and each chapter file gives its Covers line, its Terms and its deep dives (the `##` sections below the Terms). Every `→ [[#Heading]]` or `[[chapter#Heading]]` link is resolved to the section it names. The data is dropped into the template. |
| [`template.html`](template.html) | **Everything you see**: the layout, colors, fonts, search, sidebar and dark mode. It holds no notes of its own, just a `const DATA = __DATA__;` slot that the build fills. |
| `dist/` | The built page. Not committed (it's generated), see `.gitignore`. |

So a content change goes in `knowledge/`, a look-and-feel change goes in `template.html`, and
`build.mjs` only changes when the *format* of the notes changes.

**The build fails loudly on purpose.** A term line it can't parse, a chapter file missing from the
Contents, a chapter without its `## Terms` or `> **Covers:**` line, or a `[[link]]` that points nowhere stops the build with a message
naming the problem. It stops instead of skipping because a note that silently disappears from
the page is worse than a build you have to fix.

## Adding to it

- **A new term:** add a line to the Terms list of the chapter whose Covers line fits, then rebuild.
- **A deep dive for a term:** add a `##` section below the Terms in the same chapter, and point the
  term at it with `→ [[#Heading]]`.
- **A new chapter:** create the file (title, Covers line, `## Terms`) and add it to the Contents in
  `knowledge/concepts/README.md` — the build insists.
- **An inbox note:** add `inbox/YYYY-MM-DD-title.md` with the `Date` / `Tags` / `Status` header
  (see [`inbox/README.md`](../inbox/README.md)), then rebuild.
- **A new section of the site** (bug classes, the kit…): a parser in `build.mjs` plus a view in
  `template.html`. We build these one at a time.
