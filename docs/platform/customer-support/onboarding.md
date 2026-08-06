---
sidebar_position: 1
slug: /platform/customer-support/onboarding
title: Onboarding overview (the 5 steps)
description: How to get from "just signed up" to a fully live Lira customer support stack — the 5 steps your dashboard walks you through, with what each one is and why it matters.
---

# Onboarding overview — the 5 steps

When you sign up for Lira and click **"Guide me through setting up my support agent"** in the dashboard widget, you'll see a numbered setup-progress card. Each step has a clear what, why, and how — plus the AI Lira widget itself walks you through each one interactively. This page is the canonical reference for the five.

The card is interactive, not just a checklist:

- **Steps are clickable.** Each numbered step navigates the dashboard straight to the page where that step happens (the activation wizard, the Knowledge Base, Settings). A "View guide" link on each step opens the matching docs page.
- **Steps are locked until activation.** Until you complete step 1, the later steps render locked — clicking one shows "Activate customer support first." They unlock automatically the moment activation completes, without a refresh.
- **Steps complete themselves.** Progress is detected from your org's real state — an indexed Knowledge Base page ticks step 2, a confirmed SDK install ticks step 3, and so on. You never mark a step done by hand; the number turns into a check mark, and sub-items show partial progress within a step.

| # | Step | Required? | Where it happens |
|---|------|-----------|------------------|
| 1 | **Activate customer support** | Required | Activation wizard |
| 2 | **Teach Lira about your product** | Required | Knowledge Base tab |
| 3 | **Install the support page (Web SDK)** | Required | Your codebase |
| 4 | **Add the chat bubble** | Optional | Your codebase |
| 5 | **Sign in your users + verify** | Required | Your codebase + Setup Health |

Your setup is complete when every required step is green. Step 4 (chat bubble) is genuinely optional — many B2B products ship only the `/support` page and skip the floating widget.

All of this happens in the free **sandbox** environment. Switching the workspace to the live environment — the moment billing starts — is a separate, deliberate step on the Environment card in **Settings → Support**. See [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

---

## Step 1 — Activate customer support

**What:** flip the master switch. Walks through a short wizard that provisions:
- Your unique support email address (e.g. `support-yourcompany-a1b2@liraintelligence.com`)
- Your widget secret (used for identified-visitor HMAC signing)
- Your ticketing email (where new-ticket notifications go)

**Why:** none of the other steps work without this. The Web SDK refuses to connect, tickets have nowhere to go, and Lira has no identity to sign visitors with.

**How:** Dashboard → **Support → Activate**. Takes under a minute.

**Done when:** the setup card marks step 1 with a check, the remaining steps unlock, and your **Settings → Support** tabs are populated.

[→ Full activation guide](/platform/customer-support/activation)

---

## Step 2 — Teach Lira about your product

**What:** seed your Knowledge Base. The fastest path is a website crawl, but you can also:
- Upload Word documents, Markdown files, plain text docs (PDF is not supported)
- Upload files, crawl your help center, or import approved files from Google Drive
- Add KB entries manually

**Why:** Lira's whole value is grounded answers about *your* product. With an empty KB, the AI hedges, gives generic responses, or escalates everything. The richer your KB, the smarter the agent.

**How:** Dashboard → **Knowledge Base → Web Sources** → paste your site URL and start a crawl. Most B2B products take 1–10 minutes to crawl. While that runs, you can move to step 3.

**Done when:** `lira_get_setup_progress` reports at least one web page or document indexed.

[→ Knowledge Base docs](/knowledge-base/overview)

---

## Step 3 — Install the support page (Web SDK)

**What:** drop `@liraintelligence/support` into a `/support` route on your own app, so your customers see Lira at `yourapp.com/support` — your domain, your shell, Lira's chat + tickets + AI inside.

**Why:** this is the **primary integration** and the whole product pitch. Customers never leave your app; the AI greets them by name (when you wire identity in step 5); the support page contains chat history, ticket history, and the live conversation.

**How:** the fastest path is:
```bash
npx @liraintelligence/support init --org-id=YOUR_ORG_ID
npm install @liraintelligence/support
```
The CLI scaffolds a working `/support` route for your framework (Next.js, Vite, Remix). For Rails, Django, Express, or plain HTML, the per-framework guide has copy-paste snippets.

If you use Claude Code or another AI editor, install our skill and run `/lira-install` instead — same result, one slash command.

**Done when:** your local `/support` route renders the Lira chat and you click "Installed" in the widget.

- [→ Web SDK overview](/platform/customer-support/web-sdk)
- [→ Per-framework guides](/platform/customer-support/integration-guides)
- [→ Claude Code skill](/platform/customer-support/integration-guides/claude-code-skill)

---

## Step 4 — Add the chat bubble (optional)

**What:** a floating chat bubble in the bottom-right (or bottom-left) of every page on your site outside of `/support`. Same Lira runtime as the support page — different placement.

**Why:** lets customers reach Lira ambient, anywhere on your site, without navigating to `/support`. Great for marketing pages, dashboards, settings screens. Skip it if you only want the dedicated `/support` page.

**How:** one `<script>` tag before `</body>` on every page where you want the bubble. Or mount `<LiraWidget />` in your React root layout.

**Done when:** you visit any page (not `/support`) and the bubble appears.

[→ Widget docs](/platform/customer-support/widget)

---

## Step 5 — Sign in your users + verify

**What:** two sub-steps:

1. **Identified-visitor signing.** Your backend signs each logged-in user's email with the widget secret (`HMAC-SHA256(LIRA_WIDGET_SECRET, email.trim().toLowerCase())`) and passes the signature to the SDK. Lira verifies it server-side before trusting the email.
2. **Setup Health verification.** Run the diagnostics in Dashboard → **Settings → Support → Health & audit → Setup health**. Every check should be green before you call install done.

**Why:**
- Without (1), Lira treats every visitor as anonymous — no name, no account context, no access to verified-only tools. For B2B SaaS this is critical.
- Without (2), you don't know if there's a silent integration mistake. Common one: your `LIRA_WIDGET_SECRET` doesn't match the dashboard secret. Without verification you find out three weeks later when a customer complains.

**How:**
```ts
// Backend: /api/lira/sign route
import crypto from 'node:crypto'
const sig = crypto
  .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
  .update(email.trim().toLowerCase())
  .digest('hex')
return { sig }
```
The CLI scaffold creates this route for Next.js automatically. For other frameworks, the per-framework guide has the equivalent code.

Then visit Dashboard → **Settings → Support → Health & audit** and click **Run diagnostics**. Every row should be green.

**Done when:** signing route is live, identified visitors are greeted by name in Lira chat, and the Setup Health panel is all green.

[→ Signed identity guide](/platform/customer-support/web-sdk#signed-identity)
[→ Troubleshooting (when health checks fail)](/platform/customer-support/integration-guides/troubleshooting)

---

## What "fully live" looks like

When all 5 are green:

- A customer visits `yourapp.com/support` → sees Lira chat + their ticket history.
- A logged-in customer is greeted by name; Lira can answer account-specific questions.
- The floating bubble (if you enabled it) lets them reach Lira from any page.
- When Lira can't answer, it opens a ticket. Your team gets emailed and replies via Dashboard → **Support → Tickets**.
- The customer's chat with Lira keeps going while the ticket is async-resolved.

That's the whole loop.

---

## If you get stuck

- **Browser console** on the page where you embedded Lira — `[Lira]` warnings tell you exactly what's misconfigured.
- **Dashboard → Settings → Support → Health & audit** — runs every diagnostic.
- **Ask Lira in the dashboard widget** — say "the widget on my site isn't responding" and the agent runs the same diagnostics and reads back the cause + fix.
- **Troubleshooting docs** — [/platform/customer-support/integration-guides/troubleshooting](/platform/customer-support/integration-guides/troubleshooting) maps every symptom to a fix.
