// READ-ONLY: find records by a property value (contact by email, deal by name, ...).
//
//   node search-records.js <objectType> <property> <value> [props,to,show] [--contains]
//   node search-records.js contacts email someone@example.com
//   node search-records.js deals dealname "UAT Test" dealname,createdate --contains
//
// ⚠ The search API is EVENTUALLY CONSISTENT — it can lag writes by seconds+. A just-created
//   record may not appear. Never use search for read-after-write checks; read by id instead.
const TOKEN = require('./_token');

const args = process.argv.slice(2).filter((a) => a !== '--contains');
const contains = process.argv.includes('--contains');
const [objectType, property, value, props] = args;
if (!objectType || !property || value === undefined) {
  console.error('usage: node search-records.js <objectType> <property> <value> [props,comma] [--contains]');
  process.exit(1);
}

(async () => {
  const res = await fetch(`https://api.hubapi.com/crm/v3/objects/${encodeURIComponent(objectType)}/search`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: property, operator: contains ? 'CONTAINS_TOKEN' : 'EQ', value }] }],
      properties: props ? props.split(',') : [property],
      limit: 100,
    }),
  });
  if (!res.ok) { console.error(`${res.status}: ${await res.text()}`); process.exit(1); }
  const body = await res.json();

  console.log(`${body.total} match(es) on ${objectType} where ${property} ${contains ? 'contains' : '='} "${value}"${body.total > 100 ? ' (showing first 100)' : ''}\n`);
  for (const r of body.results || []) {
    const shown = Object.entries(r.properties || {})
      .filter(([k]) => !['hs_object_id', 'createdate', 'lastmodifieddate'].includes(k))
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`).join('  ');
    console.log(`  ${r.id}  ${shown}`);
  }
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
