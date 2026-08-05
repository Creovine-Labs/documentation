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
    expect: ['web sdk'],
    forbid: ["don't have", 'no sdk', 'not available'],
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
    expect: ['session token', 'websocket'],
    forbid: ['web sdk', 'webhook', 'not supported'],
    why: 'Mobile = backend mints a session token + app opens the WebSocket. Not the Web SDK.',
  },
  {
    q: 'How do I authenticate API requests?',
    expect: ['api key'],
    forbid: ["can't help", 'not sure'],
    why: 'Bearer API key, kept server-side.',
  },
  { q: 'Do you support webhooks?', expect: ['webhook'], forbid: ['no', 'not support'], why: 'Signed webhooks exist for ticket events.' },
  { q: 'How much does it cost?', expect: ['free', '29'], forbid: ['contact sales for pricing'], why: 'Pricing is public; a short spoken answer need not list every tier.' },
  {
    q: 'How do I get started?',
    expect: ['sign'],
    forbid: ['book a demo first', 'sales-led', 'invite code'],
    why: 'Signup is open and self-serve — never gate it behind a demo.',
  },
  { q: 'My widget is not showing up, what do I do?', expect: ['script'], forbid: ["can't help", 'contact support'], why: 'It should troubleshoot, not deflect.' },
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
