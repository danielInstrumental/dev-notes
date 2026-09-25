// Builds the dev-notes reference page.
//
//   cd site && npm install && npm run build     →  site/dist/dev-notes.html
//
// The markdown in knowledge/ stays the source of truth — this script only READS it. It turns the
// notes into one JSON object and drops that into template.html, which holds all of the page's
// design and behavior. So: content changes happen in markdown, look-and-feel changes in the
// template, and this file is just the bridge between them.
//
// It fails loudly: a line it can't parse, a file missing from the index, or a [[link]] that points
// nowhere stops the build with a message. A broken note should block the page, not silently vanish
// from it.
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

// ── 1. The deep-dive index: which topic files exist, in the order the concepts map lists them ──

const map = read(CONCEPTS + 'README.md');
const index = [...map.matchAll(/^\| \[([a-z0-9-]+)\.md\]\([^)]+\) \| (.+) \|$/gm)]
  .map(([, id, covers]) => ({ id, covers }));
const onDisk = readdirSync(new URL(CONCEPTS, ROOT)).filter((f) => f.endsWith('.md') && f !== 'README.md');
for (const f of onDisk) {
  if (!index.some((t) => t.id + '.md' === f)) fail(`${CONCEPTS}${f} isn't listed in the Deep dives table of ${CONCEPTS}README.md`);
}
const titles = Object.fromEntries(index.map(({ id }) => [id, read(`${CONCEPTS}${id}.md`).match(/^# (.+)$/m)[1]]));

// ── 2. Each deep dive → an intro plus its ## sections (and term rows from "Term | Definition" tables) ──

// [[file]] and [[file#Heading]] between notes become in-page links
const wikiLinks = (md) => md.replace(/\[\[([a-z0-9-]+)(?:#[^\]]+)?\]\]/g, (_, id) =>
  titles[id] ? `[${titles[id]}](#${id})` : fail(`[[${id}]] points at a file that doesn't exist`));

function parseTopic({ id, covers }) {
  const tokens = marked.lexer(wikiLinks(read(`${CONCEPTS}${id}.md`)));
  const topic = { id, title: titles[id], covers: marked.parseInline(covers), intro: '', sections: [], rows: [] };
  let section = null;
  let buffer = [];
  const flush = () => {
    const html = marked.parser(Object.assign(buffer, { links: tokens.links }));
    if (section) section.html = html; else topic.intro = html;
    buffer = [];
  };
  for (const t of tokens) {
    if (t.type === 'heading' && t.depth === 1) continue;
    if (t.type === 'heading' && t.depth === 2) {
      flush();
      section = { id: `${id}--${slug(norm(t.text))}`, heading: marked.parseInline(t.text), plain: plain(marked.parseInline(t.text)) };
      topic.sections.push(section);
      continue;
    }
    if (t.type === 'table' && norm(t.header[0].text) === 'term') {
      for (const row of t.rows) {
        topic.rows.push({ term: plain(marked.parseInline(row[0].text)), html: marked.parseInline(row[1].text), anchor: section ? section.id : id });
      }
    }
    buffer.push(t);
  }
  flush();
  topic.introText = plain(topic.intro);
  for (const s of topic.sections) s.text = plain(s.html);
  return topic;
}

const topics = index.map(parseTopic);

// A map term's "→ [[file#Heading]]" pointer resolves to a section heading, or a term in a table
function resolve(ref) {
  const [id, heading] = ref.split('#');
  const topic = topics.find((t) => t.id === id) ?? fail(`→ [[${ref}]]: no deep dive called ${id}.md`);
  if (!heading) return { topic: id, anchor: id, label: topic.title, html: topic.intro };
  const want = norm(heading);
  const section = topic.sections.find((s) => norm(s.plain).startsWith(want));
  if (section) return { topic: id, anchor: section.id, label: section.plain, html: section.html };
  const row = topic.rows.find((r) => norm(r.term).startsWith(want));
  if (row) return { topic: id, anchor: row.anchor, label: row.term, html: `<p>${row.html}</p>` };
  fail(`→ [[${ref}]] doesn't match a heading or a term in ${id}.md`);
}

// ── 3. The concepts map → families of one-line terms ──

// "🏠 **pin** (≈ regression test…)" → the translation inside the outer (≈ …), plus whatever follows it
function splitTranslation(rest) {
  let depth = 0;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '(') depth++;
    if (rest[i] === ')' && --depth === 0) return [rest.slice(2, i).trim(), rest.slice(i + 1).replace(/^\s*—\s*/, '').trim()];
  }
  fail(`unclosed (≈ … in: ${rest}`);
}

const seen = new Set();
function parseBullet(line) {
  const pointers = [...line.matchAll(/→ \[\[([^\]]+)\]\]/g)].map((m) => m[1]);
  const body = line.replace(/\s*→ \[\[[^\]]+\]\]/g, '').trim();
  // one bullet can hold several house terms: "🏠 **pin** (≈ …) · 🏠 **tripwire** (≈ …)"
  return body.split(/ · (?=🏠 )/).map((part, n) => {
    const m = part.match(/^(🏠 )?\*\*(.+?)\*\*\s*(.*)$/) ?? fail(`can't parse this concepts-map line: ${part}`);
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
      deep: n === 0 ? pointers.map(resolve) : [],
    };
    term.text = plain(`${term.translation} ${term.def}`);
    return term;
  });
}

const families = [];
let family = null;
const lines = map.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('## ')) {
    const [name, tagline = ''] = line.slice(3).split(' — ');
    const isFamily = !/^(Deep dives|How this file grows)/.test(name);
    family = isFamily ? { id: 'f-' + slug(name), name, tagline, terms: [] } : null;
    if (family) families.push(family);
    continue;
  }
  if (!family || !line.startsWith('- ')) continue;
  let bullet = line.slice(2);
  while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) bullet += ' ' + lines[++i].trim();
  family.terms.push(...parseBullet(bullet));
}

// ── 4. Fill the template ──

const repo = fileURLToPath(ROOT);
const git = (cmd) => { try { return execSync(`git ${cmd}`, { cwd: repo }).toString().trim(); } catch { return ''; } };
const edited = git('status --porcelain -- knowledge') !== '';
const data = {
  built: new Date().toISOString().slice(0, 10),
  commit: (git('rev-parse --short HEAD') || 'unknown') + (edited ? ' + local edits' : ''),
  families,
  topics: topics.map(({ rows, ...t }) => t),
};
const json = JSON.stringify(data).replace(/</g, '\\u003c');   // can't close the <script> early
const SLOT = 'const DATA = __DATA__;';
const template = read('site/template.html');
if (template.split(SLOT).length !== 2) fail(`site/template.html must contain "${SLOT}" exactly once`);
const page = template.replace(SLOT, () => `const DATA = ${json};`);

mkdirSync(new URL('site/dist/', ROOT), { recursive: true });
writeFileSync(new URL('site/dist/dev-notes.html', ROOT), page);

const terms = families.flatMap((f) => f.terms);
console.log(`built site/dist/dev-notes.html — ${terms.length} terms in ${families.length} families, ` +
  `${topics.length} deep dives, ${terms.filter((t) => t.deep.length).length} terms linked to your notes`);
