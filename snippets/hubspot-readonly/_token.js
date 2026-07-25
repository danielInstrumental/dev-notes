// _token.js — loads a HubSpot Private App token for these read-only helpers.
//
// The token is NEVER hardcoded in a script. Provide it via EITHER (env wins):
//   • env var:  export HS_PAT=pat-na1-...          (nothing written to disk), OR
//   • a file:   .token in THIS folder, containing only the token string (gitignored).
//
// Rotating the token = update ONE place. Scopes: read-only helpers need only crm.objects.*.read
// (+ forms for find-form) — least privilege: don't hand these scripts a broad admin token.
const fs = require('fs');
const path = require('path');

function loadToken() {
  if (process.env.HS_PAT && process.env.HS_PAT.trim()) return process.env.HS_PAT.trim();
  try {
    const v = fs.readFileSync(path.join(__dirname, '.token'), 'utf8').trim();
    if (v) return v;
  } catch (_) { /* fall through */ }
  throw new Error('No HubSpot token found. Set HS_PAT, or create a .token file in this folder. See _token.js.');
}

module.exports = loadToken();
