#!/usr/bin/env node
/**
 * Refresh the Lira organization's knowledge base.
 *
 * Bundles every docs page (plus anything in knowledge-extra/) into one markdown
 * file and replaces the existing KB document, so the support AI answers from the
 * current documentation. Re-run this after any docs change.
 *
 *   LIRA_EMAIL=you@example.com LIRA_PASSWORD=... node scripts/refresh-lira-kb.mjs
 *
 * Optional:
 *   --crawl        also re-crawl liraintelligence.com (replaces crawled pages)
 *   --org=org-...  target a different org (defaults to the Lira org)
 */
import fs from 'node:fs';
import path from 'node:path';

const API = process.env.LIRA_API_BASE ?? 'https://api.creovine.com';
const ORG = process.argv.find((a) => a.startsWith('--org='))?.slice(6)
  ?? process.env.LIRA_ORG_ID ?? 'org-556fc4d1-9f29-4114-bb0e-da83ddab6c70';
const EMAIL = process.env.LIRA_EMAIL;
const PASSWORD = process.env.LIRA_PASSWORD;
const DOC_NAME = 'Lira-Documentation.md';
const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

if (!EMAIL || !PASSWORD) {
  console.error('Set LIRA_EMAIL and LIRA_PASSWORD (an owner/admin login).');
  process.exit(1);
}

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name))
          : /\.mdx?$/.test(e.name) ? [path.join(dir, e.name)] : [])
    : [];

function bundle() {
  const docsDir = path.join(ROOT, 'docs');
  const extraDir = path.join(ROOT, 'knowledge-extra');
  const parts = [];

  for (const f of walk(docsDir).sort()) {
    const rel = path.relative(docsDir, f).replace(/\.mdx?$/, '');
    const url = `https://docs.liraintelligence.com/${rel === 'getting-started/overview' ? '' : rel}`;
    parts.push(`\n\n===== PAGE: ${url} =====\n\n${fs.readFileSync(f, 'utf8')}`);
  }
  for (const f of walk(extraDir).sort()) {
    parts.push(`\n\n===== INTERNAL NOTE: ${path.basename(f)} =====\n\n${fs.readFileSync(f, 'utf8')}`);
  }
  return parts.join('');
}

const json = async (res) => {
  const t = await res.text();
  try { return JSON.parse(t); } catch { throw new Error(`${res.status}: ${t.slice(0, 200)}`); }
};

(async () => {
  const auth = await json(await fetch(`${API}/v1/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  }));
  const jwt = auth.accessToken;
  if (!jwt) throw new Error('Login failed');
  const H = { Authorization: `Bearer ${jwt}` };

  const content = bundle();
  console.log(`Bundled ${Math.round(content.length / 1024)} KB of docs.`);

  // Replace any previous copy so chunks don't duplicate.
  const list = await json(await fetch(`${API}/lira/v1/orgs/${ORG}/documents`, { headers: H }));
  for (const d of (list.documents ?? []).filter((d) => d.file_name === DOC_NAME)) {
    await fetch(`${API}/lira/v1/orgs/${ORG}/documents/${d.doc_id}`, { method: 'DELETE', headers: H });
    console.log(`Removed previous ${DOC_NAME} (${d.doc_id}).`);
  }

  const form = new FormData();
  form.append('file', new Blob([content], { type: 'text/markdown' }), DOC_NAME);
  const up = await json(await fetch(`${API}/lira/v1/orgs/${ORG}/documents`, {
    method: 'POST', headers: H, body: form,
  }));
  const docId = up.document?.doc_id;
  console.log(`Uploaded ${DOC_NAME} (${docId}). Indexing…`);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const d = (await json(await fetch(`${API}/lira/v1/orgs/${ORG}/documents/${docId}`, { headers: H }))).document;
    if (d?.status === 'indexed') { console.log(`Indexed — ${d.chunk_count} chunks. Done.`); break; }
    if (d?.status === 'failed') throw new Error('Indexing failed');
  }

  if (process.argv.includes('--crawl')) {
    const seeds = ['pricing', 'features', 'products/customer-support', 'for/fintech',
      'for/hospitality', 'book-demo', 'contact', 'about', 'security', 'resources']
      .map((p) => `https://liraintelligence.com/${p}`);
    await fetch(`${API}/lira/v1/orgs/${ORG}/crawl`, {
      method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://liraintelligence.com', options: { max_pages: 100, max_depth: 5, include_urls: seeds } }),
    });
    console.log('Marketing-site crawl started (replaces previously crawled pages).');
  }
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
