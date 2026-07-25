// READ-ONLY: classify records of a child object type by parent-association ABSENCE.
// The generalized orphan pattern: platforms don't cascade-delete associations — deleting a
// parent leaves its children dangling, and parent-scoped sync engines can never reach them.
// This tool LISTS AND CLASSIFIES ONLY — archiving is deliberately not in this read-only set
// (do it in the UI, or build a write tool consciously when the need is real).
//
//   node orphan-audit.js <childType> <parentType> [displayProp]
//   node orphan-audit.js 2-12345678 deals record_name
//   node orphan-audit.js contacts companies email
const TOKEN = require('./_token');

const [childType, parentType, displayProp] = process.argv.slice(2);
if (!childType || !parentType) {
  console.error('usage: node orphan-audit.js <childType> <parentType> [displayProp]');
  process.exit(1);
}
const H = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

(async () => {
  // 1) List ALL child records (paginated).
  const children = [];
  let after;
  do {
    const q = new URLSearchParams({ limit: '100', properties: ['hs_createdate', displayProp].filter(Boolean).join(',') });
    if (after) q.set('after', after);
    const res = await fetch(`https://api.hubapi.com/crm/v3/objects/${encodeURIComponent(childType)}?${q}`, { headers: H });
    if (!res.ok) { console.error(`${res.status}: ${await res.text()}`); process.exit(1); }
    const body = await res.json();
    children.push(...(body.results || []));
    after = body.paging && body.paging.next && body.paging.next.after;
  } while (after);
  if (!children.length) { console.log(`No ${childType} records exist.`); return; }

  // 2) Batch-read parent associations (100 per call — a read-only POST).
  const parentsByChild = new Map();
  for (let i = 0; i < children.length; i += 100) {
    const batch = children.slice(i, i + 100);
    const res = await fetch(`https://api.hubapi.com/crm/v4/associations/${encodeURIComponent(childType)}/${encodeURIComponent(parentType)}/batch/read`, {
      method: 'POST', headers: H, body: JSON.stringify({ inputs: batch.map((c) => ({ id: c.id })) }),
    });
    if (!res.ok) { console.error(`${res.status}: ${await res.text()}`); process.exit(1); }
    const body = await res.json();
    for (const row of body.results || []) parentsByChild.set(String(row.from.id), (row.to || []).map((t) => t.toObjectId));
  }

  // 3) Classify + report.
  let orphans = 0;
  for (const c of children) {
    const parents = parentsByChild.get(String(c.id)) || [];
    const name = displayProp ? ` "${c.properties[displayProp] || ''}"` : '';
    const created = (c.properties.hs_createdate || '').slice(0, 10);
    if (!parents.length) { orphans++; console.log(`  [ORPHAN] ${c.id}${name}  created=${created}`); }
    else console.log(`  [${parentType} ${parents.join(',')}] ${c.id}${name}  created=${created}`);
  }
  console.log(`\nTotal: ${children.length} · orphaned: ${orphans} · associated: ${children.length - orphans}`);
  console.log('(read-only — this tool never archives. Orphans of a deleted parent stay until removed deliberately.)');
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
