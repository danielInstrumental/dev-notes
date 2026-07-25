// READ-ONLY: walk ALL association pages between one record and another object type.
// Pagination-safe (cursor walk) — association lists longer than one page are the classic
// silent-truncation trap; this walks every page and says how many pages it took.
//
//   node list-associations.js <fromType> <id> <toType>
//   node list-associations.js deals 62878719778 contacts
//   node list-associations.js 2-12345678 59093293338 deals
const TOKEN = require('./_token');

const [fromType, id, toType] = process.argv.slice(2);
if (!fromType || !id || !toType) {
  console.error('usage: node list-associations.js <fromType> <id> <toType>');
  process.exit(1);
}

(async () => {
  const rows = [];
  let after;
  let pages = 0;
  do {
    const url = `https://api.hubapi.com/crm/v4/objects/${encodeURIComponent(fromType)}/${encodeURIComponent(id)}/associations/${encodeURIComponent(toType)}?limit=100${after ? `&after=${after}` : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) { console.error(`${res.status}: ${await res.text()}`); process.exit(1); }
    const body = await res.json();
    pages++;
    rows.push(...(body.results || []));
    after = body.paging && body.paging.next && body.paging.next.after;
  } while (after);

  console.log(`${fromType} ${id} → ${toType}: ${rows.length} association(s) across ${pages} page(s)\n`);
  for (const r of rows) {
    const types = (r.associationTypes || [])
      .map((t) => `${t.category}:${t.typeId}${t.label ? ` "${t.label}"` : ''}`).join(' · ');
    console.log(`  ${r.toObjectId}  [${types}]`);
  }
  console.log('\n(association LABELS + typeIds shown — direction matters: A→B and B→A have different typeIds)');
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
