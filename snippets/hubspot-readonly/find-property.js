// READ-ONLY: search an object type's properties by LABEL or internal name keyword.
// Resolve CRM targets by their display LABEL (not a guessed keyword) — labels are what
// specs/CSVs use; then verify the internal name + type printed here before wiring anything.
//
//   node find-property.js <objectType> <query...>
//   node find-property.js deals country
//   node find-property.js contacts "phone"
//   node find-property.js 2-12345678 status        (custom objects by type id)
const TOKEN = require('./_token');

const [objectType, ...queryParts] = process.argv.slice(2);
const query = queryParts.join(' ').toLowerCase();
if (!objectType || !query) {
  console.error('usage: node find-property.js <objectType: contacts|deals|companies|0-3|2-...> <query>');
  process.exit(1);
}

(async () => {
  const res = await fetch(`https://api.hubapi.com/crm/v3/properties/${encodeURIComponent(objectType)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) { console.error(`${res.status}: ${await res.text()}`); process.exit(1); }
  const { results = [] } = await res.json();

  const hits = results.filter((p) =>
    (p.label || '').toLowerCase().includes(query) || (p.name || '').toLowerCase().includes(query));

  if (!hits.length) { console.log(`No properties on "${objectType}" match "${query}" (searched ${results.length}).`); return; }
  console.log(`${hits.length} match(es) on "${objectType}" for "${query}":\n`);
  for (const p of hits) {
    console.log(`  ${p.name}`);
    console.log(`    label: "${p.label}"  type: ${p.type}/${p.fieldType}  group: ${p.groupName}${p.calculated ? '  (CALCULATED — read-only)' : ''}${p.modificationMetadata && p.modificationMetadata.readOnlyValue ? '  (readOnlyValue)' : ''}`);
    if (p.type === 'enumeration' && Array.isArray(p.options) && p.options.length) {
      const shown = p.options.slice(0, 20).map((o) => `"${o.value}"${o.label !== o.value ? ` (${o.label})` : ''}`);
      console.log(`    options[${p.options.length}]: ${shown.join(' · ')}${p.options.length > 20 ? ` · …+${p.options.length - 20} more` : ''}`);
    }
  }
  console.log('\n⚠ Enum writes must match option VALUES exactly (case + spelling) or the write fails INVALID_OPTION.');
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
