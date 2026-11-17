// Builds the dev-notes reference page.
//
//   cd site && npm install && npm run build     →  site/dist/dev-notes.html
//
// The markdown in knowledge/ stays the source of truth — this script only READS it. It turns the
// notes into one JSON object and drops that into template.html, which holds all of the page's
// design and behavior. So: content changes happen in markdown, look-and-feel changes in the
// template, and this file is just the bridge between them.
//
// The page mirrors the files: knowledge/concepts/README.md is the table of contents (parts →
// chapters), and each chapter file is one page — its Covers line, its Terms list, then its
// own-words explanations (the ## sections below the Terms). inbox/ notes each become a page too,
// and so does each guide/ page listed in the themes table of guide/README.md.
//
// It fails loudly: a chapter missing from the contents, a line it can't parse, or a [[link]] that
// points nowhere stops the build with a message. A broken note should block the page, not silently
// vanish from it.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = new URL('../', import.meta.url);
const CONCEPTS = 'knowledge/concepts/';

const read = (path) => readFileSync(new URL(path, ROOT), 'utf8');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const norm = (s) => s.toLowerCase().replace(/[*`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const plain = (html) => html.replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const fail = (msg) => { throw new Error(msg); };

// ── 1. The table of contents: parts → chapters, in book order ──

const parts = [];
const toc = [];   // chapters in order: { id, title, num, part }
for (const line of read(CONCEPTS + 'README.md').split('\n')) {
  const part = line.match(/^### Part ([IVX]+) — (.+)$/);
  if (part) { parts.push({ num: part[1], name: part[2], chapters: [] }); continue; }
  const ch = line.match(/^(\d+)\. \[(.+?)\]\(([a-z0-9-]+)\.md\)$/);
  if (ch) {
    const part = parts.at(-1) ?? fail(`contents: chapter "${ch[2]}" comes before any "### Part" heading`);
    toc.push({ id: ch[3], title: ch[2], num: Number(ch[1]), part: part.num });
    part.chapters.push(ch[3]);
  }
}
const onDisk = readdirSync(new URL(CONCEPTS, ROOT)).filter((f) => f.endsWith('.md') && f !== 'README.md');
for (const f of onDisk) {
  if (!toc.some((c) => c.id + '.md' === f)) fail(`${CONCEPTS}${f} isn't listed in the Contents of ${CONCEPTS}README.md`);
}
toc.forEach((c, i) => c.num === i + 1 || fail(`contents: "${c.title}" is numbered ${c.num}, expected ${i + 1}`));

// ── 2. Split each chapter file: title · Covers line · Terms list · explanations ──

const raw = Object.fromEntries(toc.map(({ id }) => {
  const where = `${CONCEPTS}${id}.md`;
  const md = read(where);
  const terms = md.indexOf('\n## Terms\n');
  if (terms < 0) fail(`${where} has no "## Terms" section`);
  const next = md.indexOf('\n## ', terms + 1);
  return [id, {
    title: (md.match(/^# (.+)$/m) ?? fail(`${where} has no # title`))[1],
    covers: (md.match(/^> \*\*Covers:\*\* (.+)$/m) ?? fail(`${where} has no "> **Covers:**" line`))[1],
    terms: md.slice(terms + 10, next < 0 ? undefined : next),
    rest: next < 0 ? '' : md.slice(next + 1),
  }];
}));

// Index every heading (and every row of a "Term | Definition" table) so [[links]] can resolve
const targets = {};   // chapter id → [{ plain, anchor, row? }]
for (const [id, { rest }] of Object.entries(raw)) {
  targets[id] = [];
  let section = id;
  for (const t of marked.lexer(rest)) {
    if (t.type === 'heading' && t.depth === 2) {
      section = `${id}--${slug(norm(t.text))}`;
      targets[id].push({ plain: plain(marked.parseInline(t.text)), anchor: section });
    }
    if (t.type === 'table' && norm(t.header[0].text) === 'term') {
      for (const row of t.rows) targets[id].push({ plain: plain(marked.parseInline(row[0].text)), anchor: section, row: true });
    }
  }
}

// "[[chapter#Heading]]", "[[#Heading]]" (same chapter) or "[[chapter]]" → { chapter, anchor, label }
function resolve(ref, from) {
  const [id, heading] = ref.split('#');
  const chapter = id || from;
  if (!raw[chapter]) fail(`[[${ref}]] in ${from}.md: no chapter called ${chapter}.md`);
  if (!heading) return { chapter, anchor: chapter, label: raw[chapter].title };
  const want = norm(heading);
  const hit = targets[chapter].find((t) => !t.row && norm(t.plain).startsWith(want))
    ?? targets[chapter].find((t) => t.row && norm(t.plain).startsWith(want))
    ?? fail(`[[${ref}]] in ${from}.md doesn't match a heading or a table term in ${chapter}.md`);
  return { chapter, anchor: hit.anchor, label: (chapter === from ? '' : `${raw[chapter].title} › `) + hit.plain };
}

// ── 3. Terms: "- **name** — definition" lines; house terms "🏠 **name** (≈ translation)" ──

function splitTranslation(rest) {
  let depth = 0;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '(') depth++;
    if (rest[i] === ')' && --depth === 0) return [rest.slice(2, i).trim(), rest.slice(i + 1).replace(/^\s*—\s*/, '').trim()];
  }
  fail(`unclosed (≈ … in: ${rest}`);
}

const seen = new Set();
function parseBullet(line, chapter) {
  const pointers = [...line.matchAll(/→ \[\[([^\]]+)\]\]/g)].map((m) => m[1]);
  const body = line.replace(/\s*→ \[\[[^\]]+\]\]/g, '').trim();
  // one line can hold several house terms: "🏠 **pin** (≈ …) · 🏠 **tripwire** (≈ …)"
  return body.split(/ · (?=🏠 )/).map((part, n) => {
    const m = part.match(/^(🏠 )?\*\*(.+?)\*\*\s*(.*)$/) ?? fail(`${chapter}.md: can't parse this term line: ${part}`);
    const [, house, name] = m;
    let rest = m[3];
    let translation = '';
    if (rest.startsWith('(≈')) [translation, rest] = splitTranslation(rest);
    rest = rest.replace(/^—\s*/, '');
    let id = 't-' + slug(name);
    while (seen.has(id)) id += '-';
    seen.add(id);
    const term = {
      id, name, house: Boolean(house),
      translation: translation && marked.parseInline(translation),
      def: rest && marked.parseInline(rest),
      deep: n === 0 ? pointers.map((p) => resolve(p, chapter)) : [],
    };
    term.text = plain(`${term.translation} ${term.def}`);
    return term;
  });
}

function parseTerms(block, chapter) {
  const terms = [];
  const lines = block.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('- ')) continue;
    let bullet = lines[i].slice(2);
    while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) bullet += ' ' + lines[++i].trim();
    terms.push(...parseBullet(bullet, chapter));
  }
  return terms;
}

// ── 4. Explanations: the ## sections below the Terms ──

function parseSections(md, chapter) {
  const linked = md.replace(/\[\[([^\]]+)\]\]/g, (_, ref) => {
    const r = resolve(ref, chapter);
    return `[${r.label}](#${r.anchor})`;
  });
  const tokens = marked.lexer(linked);
  const sections = [];
  let buffer = [];
  const flush = () => {
    if (sections.length) sections.at(-1).html = marked.parser(Object.assign(buffer, { links: tokens.links }));
    buffer = [];
  };
  for (const t of tokens) {
    if (t.type === 'heading' && t.depth === 2) {
      flush();
      const heading = marked.parseInline(t.text);
      sections.push({ id: `${chapter}--${slug(norm(t.text))}`, heading, plain: plain(heading), html: '' });
    } else buffer.push(t);
  }
  flush();
  for (const s of sections) s.text = plain(s.html);
  return sections;
}

const chapters = toc.map((c) => ({
  ...c,
  covers: marked.parseInline(raw[c.id].covers),
  terms: parseTerms(raw[c.id].terms, c.id),
  sections: parseSections(raw[c.id].rest, c.id),
}));

// ── 5. The inbox: one note per file, newest first; header lines give Date, Tags, Status ──

const INBOX = 'inbox/';
const notes = readdirSync(new URL(INBOX, ROOT))
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => {
    const where = INBOX + f;
    const md = read(where);
    const field = (name, required) => {
      const m = md.match(new RegExp(`^\\*\\*${name}:\\*\\* (.+)$`, 'm'));
      return m ? m[1].trim() : required ? fail(`${where} has no "**${name}:**" line`) : '';
    };
    const id = 'n-' + slug(f.replace(/\.md$/, ''));
    const body = md.replace(/^# .+$/m, '').replace(/^\*\*(Date|Tags|Status):\*\* .+$/gm, '').trim();
    const tokens = marked.lexer(body);
    const intro = [];
    const sections = [];
    for (const t of tokens) {
      if (t.type === 'heading' && t.depth === 2) {
        const heading = marked.parseInline(t.text);
        sections.push({ id: `${id}--${slug(norm(t.text))}`, heading, plain: plain(heading), tokens: [] });
      } else (sections.at(-1)?.tokens ?? intro).push(t);
    }
    const render = (toks) => marked.parser(Object.assign(toks, { links: tokens.links }));
    return {
      id,
      title: (md.match(/^# (.+)$/m) ?? fail(`${where} has no # title`))[1],
      date: field('Date', true),
      tags: field('Tags', false).split('·').map((t) => t.trim()).filter(Boolean),
      status: field('Status', true),
      intro: render(intro),
      sections: sections.map(({ tokens: toks, ...s }) => { const html = render(toks); return { ...s, html, text: plain(html) }; }),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

// ── 6. The guide: guide/README.md lists the themes in order; a theme with a page links to its file ──
//
// A row of the themes table:  | 5 | [Testing](testing.md) | the question | concepts links | status |
// A theme whose page isn't written yet has a plain title instead of a link.

const GUIDE = 'guide/';
const REPO_URL = 'https://github.com/danielInstrumental/dev-notes/blob/main/';

// Relative markdown links: a concepts chapter or guide page opens on this site; any other file in
// the repo (the kit, snippets…) isn't on the site yet, so it opens on GitHub.
function siteLinks(md, where) {
  return md.replace(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g, (_, href) => {
    const [file, frag] = href.split('#');
    const path = new URL(file, new URL(GUIDE, 'file:///')).pathname.slice(1);
    const concept = path.match(/^knowledge\/concepts\/([a-z0-9-]+)\.md$/);
    if (concept) {
      if (concept[1] === 'README') return '](#concepts)';
      if (!raw[concept[1]]) fail(`${where} links to ${file}, which isn't a concepts chapter`);
      return `](#${concept[1]})`;
    }
    if (path === GUIDE + 'README.md') return '](#guide)';
    const page = path.match(/^guide\/([a-z0-9-]+)\.md$/);
    if (page) return `](#g-${page[1]}${frag ? '--' + slug(frag) : ''})`;
    return `](${REPO_URL}${path}${frag ? '#' + frag : ''})`;
  });
}
// [[chapter#Heading]] works in guide pages too, so a guide page can point at one term's deep dive
const wikiLinks = (md, where) => md.replace(/\[\[([^\]]+)\]\]/g, (_, ref) => {
  if (ref.startsWith('#')) fail(`${where}: [[${ref}]] needs a chapter name, e.g. [[testing${ref}]]`);
  const r = resolve(ref, where);
  return `[${r.label}](#${r.anchor})`;
});

const guideReadme = read(GUIDE + 'README.md');
const guideIntro = guideReadme.slice(guideReadme.indexOf('\n'), guideReadme.indexOf('\n## ')).trim();
const cell = (s) => marked.parseInline(siteLinks(s.trim(), GUIDE + 'README.md'));
const themes = guideReadme.split('\n').flatMap((line) => {
  const cols = line.split('|').map((c) => c.trim());
  if (!/^\d+$/.test(cols[1] ?? '')) return [];
  if (cols.length !== 7) fail(`${GUIDE}README.md: theme row ${cols[1]} needs 5 columns (# · theme · question · concepts · status)`);
  const link = cols[2].match(/^\[(.+)\]\(([a-z0-9-]+)\.md\)$/);
  return [{ num: Number(cols[1]), title: link ? link[1] : cols[2], file: link ? link[2] : '', question: cell(cols[3]), concepts: cell(cols[4]), status: cols[5] }];
});
if (!themes.length) fail(`${GUIDE}README.md has no themes table`);
for (const f of readdirSync(new URL(GUIDE, ROOT)).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
  if (!themes.some((t) => t.file + '.md' === f)) fail(`${GUIDE}${f} isn't linked from the themes table in ${GUIDE}README.md`);
}

const guidePages = themes.map((theme) => {
  const page = { ...theme, id: theme.file ? 'g-' + theme.file : '', intro: '', sections: [] };
  if (!theme.file) return page;
  const where = `${GUIDE}${theme.file}.md`;
  const md = read(where);
  if (!/^# .+$/m.test(md)) fail(`${where} has no # title`);
  const tokens = marked.lexer(wikiLinks(siteLinks(md.replace(/^# .+$/m, ''), where), where));
  const intro = [];
  const sections = [];
  for (const t of tokens) {
    // the page repeats its question for anyone reading the markdown; the site shows the table's copy
    if (t.type === 'blockquote' && !sections.length && /^\*\*The question this answers:\*\*/.test(t.text)) continue;
    if (t.type === 'heading' && t.depth === 2) {
      const heading = marked.parseInline(t.text);
      sections.push({ id: `${page.id}--${slug(norm(t.text))}`, heading, plain: plain(heading), tokens: [] });
    } else (sections.at(-1)?.tokens ?? intro).push(t);
  }
  const render = (toks) => marked.parser(Object.assign(toks, { links: tokens.links }));
  page.intro = render(intro);
  page.sections = sections.map(({ tokens: toks, ...s }) => { const html = render(toks); return { ...s, html, text: plain(html) }; });
  return page;
});

// ── 7. Fill the template ──

const repo = fileURLToPath(ROOT);
const git = (cmd) => { try { return execSync(`git ${cmd}`, { cwd: repo }).toString().trim(); } catch { return ''; } };
const edited = git('status --porcelain -- knowledge inbox guide') !== '';
const data = {
  built: new Date().toISOString().slice(0, 10),
  commit: (git('rev-parse --short HEAD') || 'unknown') + (edited ? ' + local edits' : ''),
  parts,
  chapters,
  notes,
  guide: { intro: marked.parse(siteLinks(guideIntro, GUIDE + 'README.md')), pages: guidePages },
};
const json = JSON.stringify(data).replace(/</g, '\\u003c');   // can't close the <script> early
const SLOT = 'const DATA = __DATA__;';
const template = read('site/template.html');
if (template.split(SLOT).length !== 2) fail(`site/template.html must contain "${SLOT}" exactly once`);
const page = template.replace(SLOT, () => `const DATA = ${json};`);

mkdirSync(new URL('site/dist/', ROOT), { recursive: true });
writeFileSync(new URL('site/dist/dev-notes.html', ROOT), page);

const terms = chapters.flatMap((c) => c.terms);
const empty = chapters.filter((c) => !c.terms.length).length;
console.log(`built site/dist/dev-notes.html — ${terms.length} terms in ${chapters.length} chapters ` +
  `(${empty} empty) across ${parts.length} parts, ${chapters.reduce((n, c) => n + c.sections.length, 0)} explanations, ` +
  `${terms.filter((t) => t.deep.length).length} terms linked to one; ${notes.length} inbox note${notes.length === 1 ? '' : 's'}; ` +
  `guide: ${guidePages.filter((p) => p.id).length} of ${guidePages.length} themes have a page`);
