#!/usr/bin/env node
/**
 * Test the Lira AI from the terminal, the way a customer would experience it.
 *
 *   node scripts/test-lira-ai.mjs
 *
 * Each case asserts on the ANSWER, not just that a reply came back:
 *   expect  — every phrase must appear (case-insensitive)
 *   forbid  — none of these may appear  ← this is what catches regressions
 *
 * Exit code 1 if anything fails, so it can gate a release.
 */
const API = process.env.LIRA_API_BASE ?? 'https://api.creovine.com';

const CASES = [
  {
    q: 'Do you have an SDK?',
    // `expect` carries the assertion: it must name the Web SDK. The forbid
    // phrases are scoped to denying the SDK outright — a bare "don't have"
    // also fires on the TRUE clause "we don't have a specific SDK for mobile",
    // which is a correct clarification, not a denial.
    expect: ['web sdk'],
    forbid: ["don't have an sdk", "don't have any sdk", 'no sdk at all', 'sdk is not available'],
    why: 'The Web SDK exists — denying it loses developers.',
  },
  {
    q: 'Do you have a native SDK for mobile?',
    expect: ['support'],
    forbid: ['native sdk for ios', 'install our mobile sdk', 'reference app'],
    why: 'There is NO mobile SDK. It must not invent one, nor deny mobile support.',
  },
  {
    q: 'How do I integrate Lira into my mobile app?',
    // "mint a support session" is the same claim as "session token" — the
  // assertion is the mechanism (backend mints, app opens a socket), not wording.
    expect: ['session', 'websocket'],
    forbid: ['web sdk', 'webhook', 'not supported'],
    why: 'Mobile = backend mints a session token + app opens the WebSocket. Not the Web SDK.',
  },
  {
    q: 'How do I authenticate API requests?',
    expect: ['api key'],
    forbid: ["can't help", 'not sure'],
    why: 'Bearer API key, kept server-side.',
  },
  { q: 'Do you support webhooks?', expect: ['webhook'], forbid: ["don't support", 'not support', 'no webhook'], why: 'Signed webhooks exist for ticket events.' },
  { q: 'How much does it cost?', expect: ['free', '29'], forbid: ['contact sales for pricing'], why: 'Pricing is public; a short spoken answer need not list every tier.' },
  {
    q: 'How do I get started?',
    expect: ['sign'],
    forbid: ['book a demo first', 'sales-led', 'invite code'],
    why: 'Signup is open and self-serve — never gate it behind a demo.',
  },
  { q: 'My widget is not showing up, what do I do?', expect: [], forbid: ["can't help", 'contact support', 'unable to help'], why: 'It should troubleshoot (console, diagnostics, embed) rather than deflect — the forbid list is the real assertion.' },
  { q: 'Can I integrate with React?', expect: ['sdk'], forbid: ['not supported'], why: 'React is supported via the Web SDK.' },
  {
    q: 'Do you offer a Nigerian accent or custom brand voice? Is it in Scale?',
    expect: ['separate'],
    forbid: ['included in scale', 'part of the scale plan'],
    why: 'Localized voice is a separate product, not a plan feature.',
  },
  {
    q: 'Who founded Lira?',
    expect: ['yerins', 'sarah'],
    forbid: ["can't share", 'private'],
    why: 'Founders are public.',
  },
  {
    q: 'What is my usage this month?',
    expect: ['dashboard'],
    forbid: ['your usage is', 'you have used'],
    why: 'Not signed in — it must not invent account data.',
  },
  {
    q: 'Can I run my staging environment and production against the same Lira workspace?',
    // The claim is the capability, not the vocabulary — "the key you use decides
    // the mode" is a correct answer that happens not to contain both words.
    expect: ['workspace'],
    forbid: ['not possible', "can't", 'separate workspace', 'second organization', 'two workspaces'],
    why: 'Test and live keys are valid at the same time — one workspace, both environments.',
  },
  {
    q: 'What are the Lira API key prefixes?',
    expect: ['lira_sk_test', 'lira_sk_live'],
    forbid: ['only one key', 'no test key'],
    why: 'Four key types exist: sk/pk × test/live.',
  },
  {
    q: 'I already have one API key from before. Does it stop working or become production automatically?',
    expect: ['keep', 'workspace'],
    forbid: ['stops working', 'must create', 'automatically converted', 'no longer valid'],
    why: 'Legacy keys keep working and follow the workspace environment — no forced migration.',
  },
  {
    q: 'For my mobile app, what do I change to separate staging from production support?',
    expect: ['test key', 'live key'],
    forbid: ['nothing is possible', 'not supported for mobile', 'rebuild the app'],
    why: 'Mobile mode comes from the key the customer backend mints with; app code is unchanged.',
  },
  {
    q: 'Can I switch between sandbox and production from my terminal, or is it dashboard only?',
    // A spoken concierge won't reliably read out command names; the claim that
    // matters is "not dashboard-only", which the forbid list enforces.
    expect: ['terminal'],
    // "dashboard only" alone also fires inside the correct negation
    // "it's not limited to the dashboard only" — scope it to real denials.
    forbid: ['is dashboard only', 'only in the dashboard', 'not possible', 'must use the dashboard'],
    why: 'The CLI has both switches: `lira mode` for the key, `lira env go-live` for the workspace.',
  },
  {
    q: 'If I create a live key before going live, does it start sending real emails?',
    expect: ['no'],
    forbid: ['yes, it will', 'starts sending'],
    why: 'Live keys stay inert until the workspace goes live — no bypassing the commercial gate.',
  },
  {
    q: 'Does the AI know which of my logged-in users it is talking to?',
    // A spoken answer needn't name the JS function; "recognises them by email
    // and external customer id" is the correct answer.
    expect: ['yes'],
    forbid: ['anonymous only', "can't know", 'not possible'],
    why: 'Identity is plumbed: identify() on web, the session mint on mobile.',
  },
  {
    q: 'My MCP tools need my own customer id, not the email. How do I send it?',
    expect: ['external'],
    forbid: ['only email', 'not supported', "can't send"],
    why: 'external_customer_id via setContext (web) or externalCustomerId at mint (mobile). Orgs hit this the moment they wire MCP.',
  },
  {
    q: 'One workspace serves Personal, SME and Corporate. How does the AI know which product a customer is on?',
    expect: ['context'],
    forbid: ['separate workspace', 'not possible', 'one product'],
    why: 'setContext / mint context, plus product-specific KB content for different answers.',
  },
  {
    q: 'Where do I find my widget signing secret in the dashboard?',
    expect: ['api keys'],
    forbid: ['get connected', 'developer options'],
    why: 'It moved to Settings → Support → API keys. Users hunted for it under Get connected.',
  },
  {
    q: 'Can customers talk to Lira by voice in my mobile app, or is it chat only?',
    expect: ['voice'],
    forbid: ['chat only', 'not supported', 'only text', 'no voice'],
    why: 'Voice works on native mobile via the same session token — a mic button streaming PCM over a WebSocket.',
  },
  {
    q: 'If a customer calls by voice and then chats, is it the same conversation?',
    expect: ['same'],
    forbid: ['separate conversation', 'different thread', 'two conversations'],
    why: 'Voice continues the open conversation — one thread, one customer, same knowledge base.',
  },
  {
    q: 'If I click Production in the dashboard without paying, what happens?',
    expect: ['pay'],
    forbid: ['nothing happens', 'it just switches', 'free'],
    why: 'Production is gated: picking it before go-live opens the plan/payment flow, like Paystack.',
  },
  {
    q: 'Does sandbox traffic use my paid plan quota?',
    expect: ['no'],
    forbid: ['yes, it does', 'counts against your plan'],
    why: 'Test traffic is metered separately against the test caps.',
  },
];

const ask = async (message) => {
  const res = await fetch(`${API}/lira/v1/voice-demo/concierge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).say ?? '';
};

let failed = 0;
console.log(`Testing ${API}\n`);

for (const c of CASES) {
  let say = '';
  try {
    say = await ask(c.q);
  } catch (err) {
    console.log(`✗ ${c.q}\n  request failed: ${err.message}\n`);
    failed++;
    continue;
  }
  const low = say.toLowerCase();
  const missing = (c.expect ?? []).filter((p) => !low.includes(p.toLowerCase()));
  const present = (c.forbid ?? []).filter((p) => low.includes(p.toLowerCase()));

  if (missing.length === 0 && present.length === 0) {
    console.log(`✓ ${c.q}`);
  } else {
    failed++;
    console.log(`✗ ${c.q}`);
    console.log(`  why it matters: ${c.why}`);
    if (missing.length) console.log(`  missing: ${missing.join(', ')}`);
    if (present.length) console.log(`  MUST NOT say: ${present.join(', ')}`);
    console.log(`  actual: ${say.slice(0, 220)}`);
  }
}

console.log(`\n${CASES.length - failed}/${CASES.length} passed`);
process.exit(failed ? 1 : 0);
