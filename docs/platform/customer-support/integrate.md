---
sidebar_position: 3
title: Add Lira to your app — start here
description: Setup steps and integration paths for Lira support. For developers, frontend or backend.
keywords:
  - integrate
  - integration
  - getting started
  - mobile
  - mobile app
  - ios
  - android
  - flutter
  - react native
  - native
  - sdk
  - widget
  - api key
  - org id
  - frontend
  - backend
  - mcp
  - cli
---

# Add Lira to your app — start here

**For developers — frontend or backend.**

Setup is Steps 1–3. Step 4 is the integration path.

---

## STEP 1 — ACTIVATE CUSTOMER SUPPORT

Required. Nothing works until support is on.

Dashboard → sidebar **Customer Support** → **Activate** → complete the 4-step wizard.

Reference: [Activation guide](/platform/customer-support/activation)

---

## STEP 2 — GET CREDENTIALS

**Organization ID** — format `org-...`
Location: **Settings → Organization → General** (Copy button).

**API key** — format `lira_sk_...`. Mobile only. Not needed for website or web app.
Location: **Settings → Support → Developers → New key**. Tick scope **`sessions:mint`**. Shown once.

**API key stays server-side.** Never in app binaries or browser code.

---

## STEP 3 — ADD KNOWLEDGE

Required. Lira answers from your content only.

**Grow → Knowledge Base → Web Sources** → paste site URL → **Crawl**.
Documents and Google Drive are on the adjacent tabs.

Reference: [Knowledge Base](/knowledge-base/overview)

---

## STEP 4 — CHOOSE INTEGRATION PATH

### FOR WEBSITE

One script tag.
→ [Website install](/platform/customer-support/widget)

### FOR WEB APP

React, Next.js, Vue, Rails, Django, Express.
→ [Web app install guides](/platform/customer-support/integration-guides)

### FOR SUPPORT INSIDE MOBILE APP

iOS, Android, Flutter, React Native. Two roles, two pages.

| Role | Task | Page |
|---|---|---|
| **BACKEND** | One endpoint that mints a support session | → [Mobile: the backend part](/platform/customer-support/mobile-backend) |
| **FRONTEND** | Chat screen + WebSocket | → [Mobile: the app part](/platform/customer-support/mobile-frontend) |

Backend first. The app cannot connect until that endpoint exists.

The chat screen design is on [Native mobile support](/platform/customer-support/mobile-frontend).


---

## SETUP FROM YOUR EDITOR OR TERMINAL

Available for **website and web app** integration. Not available for mobile.

**AI editor (Claude Code, Codex, Continue):**

```bash
npx @liraintelligence/support install-skill   # once
```
Then `/lira-install` in the editor. Detects framework, installs the package, wires it up.
→ [Claude Code skill](/platform/customer-support/integration-guides/claude-code-skill)

**CLI:**

```bash
npx @liraintelligence/support init
```

Both scaffold code in your project. **Steps 1–3 above are still done in the dashboard** — activation, credentials, and knowledge base are not automated.

---

## STAGING (SANDBOX) VS LIVE

New organizations start in **SANDBOX**. Build and test there.

Once you're integrating for real, you don't have to choose: **test and live keys work at the same time**, so your staging environment and production can both point at this workspace. Staging traffic gets its own quota, sends no real emails, and stays out of the live inbox. Switch from the dashboard topbar or the terminal:

```bash
lira mode test | lira mode live   # which key your commands use
lira env go-live                  # the workspace switch (real sends + billing)
lira status                       # what will my next command do?
```

→ [Test and live mode](/platform/customer-support/test-and-live-mode)

**INTEGRATION CODE IS IDENTICAL IN BOTH.** Same org ID, same script tag, same
API key, same mint endpoint, same WebSocket URL. Going live changes limits and
billing only — **no code change, no redeploy**.

### Sandbox limits (per month)

| Resource | Limit |
|---|---|
| Conversations | 500 |
| AI replies | 500 |
| LLM calls (all AI work, incl. classification) | 2,000 |
| AI replies per minute | 10 |
| Knowledge base pages | 200 |
| Knowledge base documents | 25 |

Conversations are purged after 30 days in sandbox. Knowledge base content is kept.
Limits are hard stops — there is no overage in sandbox.

### What does NOT send in sandbox

Customer-facing email, ticket emails, proactive outreach, and WhatsApp are dry-run.

**These DO fire for real in sandbox — configure with care:**
Slack, Linear, and outbound webhook escalations, plus escalation email to your team.
Team ticket alerts are sent, tagged `[SANDBOX]`.

### Going live

**Settings → Support → Environment card → Production**, then confirm by typing the
organization name. Owner or admin only.

Paid plans (Pro, Scale) require an active subscription — checkout opens during the
switch. Free and Enterprise switch without checkout.

Plans and pricing: [Subscription & Billing](/getting-started/plans-and-billing)
Dashboard: **Settings → Subscription** (plan, usage, plan-change and sandbox-extension requests) and **Settings → Billing** (invoices, payment methods).

Full detail: [Sandbox and going live](/platform/customer-support/sandbox-and-going-live)

---

## ABOUT MCP

MCP is **not** an integration path and is **not** required.

MCP connects Lira **outward to your systems** so it can perform actions during a chat — whatever your product does (cancel an order, change a booking, update a subscription). Configured at **Settings → Support → Actions**.

Integrate chat first using Step 4. Add MCP later if you want actions.
→ [MCP guide](/platform/customer-support/mcp)

---

## TROUBLESHOOTING

Live diagnostics: **Settings → Support → Health & audit → Setup Health**.
→ [Troubleshooting guide](/platform/customer-support/integration-guides/troubleshooting)
