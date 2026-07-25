// READ-ONLY: search marketing forms by name; print id + field list.
//
//   node find-form.js <query...>
//   node find-form.js application
const TOKEN = require('./_token');

const query = process.argv.slice(2).join(' ').toLowerCase();
if (!query) { console.error('usage: node find-form.js <name query>'); process.exit(1); }

(async () => {
  const forms = [];
  let after;
  do {
    const url = `https://api.hubapi.com/marketing/v3/forms/?limit=100${after ? `&after=${after}` : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) { console.error(`${res.status}: ${await res.text()}`); process.exit(1); }
    const body = await res.json();
    forms.push(...(body.results || []));
    after = body.paging && body.paging.next && body.paging.next.after;
  } while (after);

  const hits = forms.filter((f) => (f.name || '').toLowerCase().includes(query));
  if (!hits.length) { console.log(`No forms match "${query}" (searched ${forms.length}).`); return; }
  console.log(`${hits.length} form(s) match "${query}":\n`);
  for (const f of hits) {
    console.log(`  ${f.id}  "${f.name}"  (${f.formType || '?'}${f.archived ? ' · ARCHIVED' : ''})`);
    const fields = (f.fieldGroups || []).flatMap((g) => g.fields || []);
    for (const fld of fields) console.log(`      ${fld.name}  [${fld.fieldType}]${fld.required ? ' (required)' : ''}`);
  }
  console.log('\n(marketing v3 forms only — legacy/v2 forms and system pages do not appear here)');
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
