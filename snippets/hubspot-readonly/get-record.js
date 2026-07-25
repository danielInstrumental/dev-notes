// READ-ONLY: read one record by id — any object type, chosen properties, optional associations.
//
//   node get-record.js <objectType> <id> [prop1,prop2,...] [assocType1,assocType2,...]
//   node get-record.js deals 62878719778 dealname,createdate
//   node get-record.js contacts 9051 firstname,lastname,email deals
//   node get-record.js 2-12345678 59093293338 record_name,type
const TOKEN = require('./_token');

const [objectType, id, props, assocs] = process.argv.slice(2);
if (!objectType || !id) {
  console.error('usage: node get-record.js <objectType> <id> [props,comma,separated] [assocTypes,comma,separated]');
  process.exit(1);
}

(async () => {
  const q = new URLSearchParams();
  if (props) q.set('properties', props);
  if (assocs) q.set('associations', assocs);
  const res = await fetch(`https://api.hubapi.com/crm/v3/objects/${encodeURIComponent(objectType)}/${encodeURIComponent(id)}?${q}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) { console.error(`${res.status}: ${await res.text()}`); process.exit(1); }
  const body = await res.json();

  console.log(`${objectType} ${body.id}  (created ${body.createdAt || '?'} · updated ${body.updatedAt || '?'}${body.archived ? ' · ARCHIVED' : ''})\n`);
  for (const [k, v] of Object.entries(body.properties || {})) console.log(`  ${k}: ${v === null ? '(null)' : JSON.stringify(v)}`);
  if (body.associations) {
    for (const [type, data] of Object.entries(body.associations)) {
      const ids = (data.results || []).map((r) => r.id);
      console.log(`\n  associations.${type} [${ids.length}]: ${ids.join(', ')}`);
    }
    console.log('  (association lists here are FIRST PAGE ONLY — use list-associations.js for the full cursor walk)');
  }
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
