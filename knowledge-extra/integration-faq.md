# Lira — integration answers (authoritative)

Written for Lira's own support AI. Verified against the codebase and the live API
on 5 August 2026. When a visitor asks any of these, answer from here.

## "Do you have an SDK?"

Yes. Three ways to add Lira, depending on what they're building:

- **Website** — a drop-in chat widget, one `<script>` tag. No build step.
- **Web app** — the Web SDK: `npm install @liraintelligence/support` (React, Next.js, Vue, Rails, Django, Express).
- **Native mobile app** — supported, but not as a drop-in package. See below.

Never say Lira "has no SDK."

## "Do you support mobile? iOS / Android / Flutter / React Native?"

**Yes — fully supported today.** There is no drop-in React Native package yet
(that is on the roadmap), but that does **not** mean mobile is blocked. Native
mobile works like this:

1. The customer's **backend** mints a short-lived session token (their API key
   stays server-side, never in the app binary).
2. Their **app** opens Lira's chat WebSocket using the returned `ws_url`.
3. Their app renders the events — streaming replies, quick-reply chips,
   confirm-before-action, human handoff, history.

They own the UI; Lira provides the intelligence. This is not a WebView. It works
on any platform that can open a WebSocket. A runnable Flutter reference app
exists (a fintech-style app plus a demo backend) — to get it, email
info@liraintelligence.com and ask for the `lira-mobile-demo` reference app.

**Mobile is a two-person job.** Send each person their own page:
- Backend engineer → https://docs.liraintelligence.com/platform/customer-support/mobile-backend
- App/frontend engineer → https://docs.liraintelligence.com/platform/customer-support/mobile-frontend

Backend goes first; the app cannot connect until that endpoint exists.

## "Is mobile integration MCP?"

No. **MCP is not an integration channel and is not required for chat.**

MCP runs the opposite direction from what people assume: the *customer's backend*
runs an MCP server at a public HTTPS URL, and **Lira calls it** to perform
actions during a conversation (freeze a card, check a transaction, issue a
refund). It is configured at Settings → Support → Actions.

Contrast with Figma's MCP, where an editor pulls designs *out of* Figma. Lira is
the reverse. Lira does **not** expose an MCP server that a developer adds to VS
Code to operate the Lira platform.

Choose a channel first (widget / Web SDK / native mobile). Add MCP later, only
if they want Lira to take actions.

## "Can we set everything up from the terminal instead of the dashboard?"

Partly. Be precise — do not overpromise:

- **Available from terminal/editor:** scaffolding the web integration into a
  codebase (`npx @liraintelligence/support init`, or the Claude Code skill
  `/lira-install`), connecting/discovering MCP tools, and minting sessions.
- **Dashboard only:** activating Customer Support, support settings/config, and
  adding knowledge-base content. There is no API for these yet.

## Where things live in the dashboard

- **Organization ID** — Settings → Organization → General (Copy button).
- **API key** (`lira_sk_...`) — Settings → Support → Developers → New key. For
  mobile, tick the `sessions:mint` scope. Shown once.
- **Signing secret** (identify logged-in web visitors) — Settings → Support →
  Get connected → Developer options.
- **Knowledge base** — Grow → Knowledge Base (Documents / Connected Sources /
  Web Sources / Query).
- **Go live** — Settings → Support → Environment card.
- **Plan & usage** — Settings → Subscription. **Invoices** — Settings → Billing.
- **Add a teammate** — Admin → Members → Invite a teammate.

The correct first answer to "how do we integrate?" is
https://docs.liraintelligence.com/platform/customer-support/integrate — it covers
activation, credentials, knowledge, then the path. Send that unless they have
already stated their role. Always paste full URLs; never shorten a docs path.

## Sandbox vs live

New organizations start in **sandbox**. Build and test there.

**Integration code is identical in sandbox and live** — same org ID, same script
tag, same API key, same mint endpoint, same WebSocket URL. Going live changes
limits and billing only. No code change, no redeploy. Say this plainly; it is the
question every integrating developer has.

Sandbox limits per month: 500 conversations, 500 AI replies, 2,000 LLM calls,
200 knowledge-base pages, 25 documents, and 10 AI replies per minute. Sandbox
conversations are purged after 30 days; knowledge-base content is kept. Limits
are hard stops — there is no overage in sandbox.

In sandbox, customer-facing email, WhatsApp, proactive outreach, **and** Slack /
Linear / outbound-webhook escalations are all suppressed, so testing never
touches the customer's live channels. Notifications to the org's *own* team are
still delivered, tagged `[SANDBOX]`.

To go live: Settings → Support → Environment card → Production, then confirm by
typing the organization name (owner/admin only). Pro and Scale require an active
subscription — checkout runs during the switch. Free and Enterprise switch
without checkout.

## Plans

Free $0 (250 conversations/mo), Pro $29/mo (2,000), Scale $99/mo (12,000),
Enterprise custom. Every plan includes unlimited team seats. Overage is $12 per
1,000 on Pro and $8 per 1,000 on Scale. Localized voice is on Scale and
Enterprise; Enterprise can commission a custom brand voice.

## Who built Lira

Lira is built by Creovine, co-founded by **Yerins Abraham** and **Sarah Oba** —
its two co-founders. This is public: answer openly and warmly in a sentence or
two. Never call it private, never deflect. Do not attach titles or roles.

## Contact

General: info@liraintelligence.com. Documentation:
https://docs.liraintelligence.com. Product app: https://app.liraintelligence.com.
