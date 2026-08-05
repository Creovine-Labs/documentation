---
sidebar_position: 8
title: Settings Reference
description: Complete reference for all Support settings — the Environment card and the seven groups Get connected, Channels, Behavior, Actions, Developers, Escalation, and Health & audit.
---

# Settings Reference

All Support settings live at **Settings → Support**. The page has two parts:

1. An **Environment card** at the top, always visible, showing whether the workspace is in **SANDBOX** or **LIVE** mode with a **Sandbox / Production** switch. See [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).
2. Seven grouped tabs below it:

| Tab | What it holds |
|---|---|
| **Get connected** | Install snippets (Web widget / Full page / JavaScript / npm), widget appearance & greeting |
| **Channels** | Web chat, voice, email, WhatsApp, and the Lira-hosted page |
| **Behavior** | Auto-reply, confidence threshold, always-escalate topics, and compliance guardrails |
| **Actions** | Let Lira take real actions — connect an MCP server, a REST adapter with agent tool packs, or manually registered actions |
| **API keys** | Every credential in one place: publishable keys (`lira_pk_*`, for embeds), secret keys (`lira_sk_*`, for your backend), and the signing secret for logged-in customers — plus the CLI / API quickstart |
| **Escalation** | Where conversations go when a human steps in — alert email, SLA target, and Slack / Linear / webhook destinations |
| **Health & audit** | Integration diagnostics and the agent audit log |

Changes take effect after clicking **Save** (a Save button sits next to the tab bar and in a sticky bar at the bottom of the page — there is no auto-save). The **Agent audit log** is read-only.

> **Moved:** the old **AI behavior** tab is now **Behavior**, and the **Capabilities catalog** it used to contain has been replaced by the new **Actions** tab (MCP servers, REST adapter tool packs, and manually registered actions). Anywhere you previously went to "Settings → Support → AI behavior → Capabilities," go to **Settings → Support → Actions**.

Plan, usage, go-live status, and plan-change requests appear on the separate
**Settings → Subscription** tab; invoices, payment methods, and license
management live on the **Settings → Billing** tab — see
[Subscription & Billing](/getting-started/plans-and-billing).

---

## Environment card

Sits above the tabs and is always visible. It shows an **Environment** heading with a **SANDBOX** or **LIVE** badge and a Sandbox / Production switch.

- In **sandbox**, no real emails are sent (they are previewed only) and the widget shows a SANDBOX badge. Everything is free to test under sandbox testing caps.
- Switching to **Production** opens a go-live confirmation showing your plan, price, and included volume. Confirming requires typing your organisation name. On a paid plan without an active subscription, confirming collects payment through a Paddle Checkout overlay before the switch. Going live starts real billing for paid plans and replaces the sandbox caps with your plan's limits.
- Switching back to sandbox re-suppresses real outbound sends and restores the testing caps.

Full details: [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

---

## Get connected tab

Everything needed to install Lira in your product: the web SDK embed, the signing secret for identified visitors, and mobile.

### Web SDK

#### Full-page Support SDK (recommended)

The recommended B2B install snippet. Copy this into a route you own, such as
`/support`, so Lira renders inside your app instead of sending users to a
hosted Lira URL.

[→ Full Web SDK guide](/platform/customer-support/web-sdk)

#### JavaScript SDK API

Use this snippet when the product needs signed visitor identity and live product
context. It shows `window.Lira.init(...)`, `window.Lira.identify(...)`,
`window.Lira.setContext(...)`, and `window.Lira.mountSupportPage(...)`.

#### NPM package

Use `@liraintelligence/support` when the customer wants typed imports, React components, and
registered customer actions. The package is published on npm, so customer
projects can install it by name.

```bash
npm install @liraintelligence/support
```

The React entrypoint is `@liraintelligence/support/react` and exports `LiraProvider`,
`useLira`, `useLiraAction`, `LiraSupportPage`, and `LiraWidget`.

#### Floating Chat Widget

The optional launcher snippet for pages where you want a compact support button.
It uses the same Lira runtime as the full-page SDK.

[→ Full widget installation guide](/platform/customer-support/widget)

#### Widget Color

The primary colour used for the widget button, header bar, and Lira's message bubbles.

- Enter any 6-digit hex code (e.g. `#3730a3`, `#1d4ed8`)
- Or pick from the quick-select palette of preset colours
- A live colour swatch shows the selected colour

#### Greeting Message

The first message Lira sends when a customer opens the chat widget. Keep it brief and welcoming.

Default: *"Hello! How can I help you today?"*

### Widget secret

The widget secret signs `identify()` calls so Lira can trust who a visitor is. It is only needed if you want Lira to recognise your logged-in users and access their account information — anonymous chat support does not require it.

| Control | Description |
|---------|-------------|
| **Show / Hide** | The secret is masked by default. Click **Show** to reveal the full hex string so you can copy it. |
| **Copy** | Copies the raw secret value to your clipboard. |
| **Rotate** | Generates a new secret and immediately invalidates the old one. You'll be asked to confirm before rotation happens. |

:::info What does the widget secret do?
When a visitor is logged in to your website, your server uses the widget secret to sign their identity (email address) as an HMAC-SHA256 signature. The widget passes this signature to Lira, which verifies it before treating the visitor as a trusted, identified customer. This prevents any anonymous visitor from impersonating another user by changing their email in the browser.

The secret must only ever exist on your server — never in your frontend code or HTML.

[→ Full guide: Web SDK identity](/platform/customer-support/web-sdk#signed-identity)
:::

:::warning If your secret is exposed
If the secret is ever accidentally committed to a repository, logged, or visible in your frontend, rotate it immediately. The old secret stops working the moment you confirm rotation.
:::

### Mobile SDKs

Native iOS and Android SDKs are on the roadmap. This section exists today so you can see the plan; there is nothing to configure yet.

---

## Channels tab

Where customers reach you: web chat, voice, email, WhatsApp, and the Lira-hosted page.

### Core channels

#### Web Chat Runtime

Enables or disables the runtime used by both:

- The full-page Support SDK
- The floating chat widget

If this is disabled, new web chat sessions are not accepted. The SDK snippets themselves live in the **Get connected** tab — the Channels tab links across to it.

#### Voice Support

Toggle for inbound voice support powered by Lira's voice.

:::info Voice availability
Inbound voice (AI phone agent) is currently being polished. The toggle is present, but expect voice to become generally available in a future release.
:::

#### Email Support

Handles inbound customer emails via Lira's AI reply engine.

| Field | Description |
|-------|-------------|
| **Enabled** | Toggle to enable AI email handling |
| **Your Lira support address** | Your assigned platform address — share this with customers or use as a forwarding destination |
| **Custom address (optional)** | Your own domain's support email (e.g. `support@yourcompany.com`). If set, configure forwarding from this address to your Lira address in your email provider. |

##### How custom email forwarding works

When you set a custom address, Lira **does not** control your domain's email. You need to create a forwarding rule in your own email provider (Google Workspace, Microsoft 365, etc.) so that messages to your custom address are automatically forwarded to your Lira address.

```
Customer → support@yourcompany.com
  → your email provider forwards to → support-yourcompanyname-a1b2@liraintelligence.com
  → Lira reads and responds
```

Lira will display the "Forwarding setup required" instructions in Settings whenever a custom address is entered, as a reminder.

### WhatsApp

Connect a WhatsApp Business number so Lira can answer there too. The section carries an in-app checklist of the Meta-side prerequisites plus the credential form.

[→ Full WhatsApp setup guide](/platform/customer-support/whatsapp)

### Hosted page

The optional Lira-hosted fallback page for teams that cannot embed code yet. For production B2B apps, prefer the Web SDK in **Get connected** — the hosted page should not be the main integration path.

| Field | Description |
|-------|-------------|
| **Enabled** | Toggle to turn the hosted fallback on or off |
| **Portal URL slug** | Lowercase identifier for your portal URL (e.g. `acme-corp` → `support.liraintelligence.com/acme-corp`) |
| **Open portal** | Link to open your live portal (appears once your slug is saved) |
| **Custom domain (optional)** | Serve the portal from your own domain via a CNAME to `support.liraintelligence.com` |
| **Branding** | Brand colour and logo URL for the portal header |
| **Portal greeting** | Opening message on the portal; leave blank to reuse your widget greeting |
| **Portal features** | Toggle Live Chat, Voice, Submit a Request, and Track Tickets individually |
| **Customer login** | Magic-link sign-in is active; identity verification / SSO is coming soon |

[→ Hosted portal guide](/platform/customer-support/portal)

---

## Behavior tab

How the AI replies and when it holds back. (Previously called **AI behavior**.)

### Replies

#### Auto-reply

When enabled, Lira automatically answers customers when it's confident. When disabled, Lira drafts a reply for a human to send instead of sending on its own — useful for monitoring mode or during initial setup.

Default: **On**

#### Confidence to answer

A slider with three presets — **Cautious**, **Balanced**, **Strict**. Lira scores each response on how well it can ground the answer in your Knowledge Base. Below the threshold, Lira hands the conversation to a human instead of guessing.

| Setting | Effect |
|-----------|--------|
| **Cautious (lower)** | Answers more, asks humans less — may include lower-quality answers |
| **Balanced (~70%)** | Good autonomous rate with solid quality (recommended starting point) |
| **Strict (higher)** | Answers only when very sure — most uncertain conversations escalate |

Default: **70% (Balanced)**

:::tip Calibrating the threshold
Start at Balanced. Check your Analytics page after the first week. If escalation rate is too high and CSAT is good on autonomous conversations, loosen it. If CSAT on autonomous conversations is poor, tighten it.
:::

### This month

A read-only usage card showing **Conversations** and **AI replies** used this month against your plan. In sandbox these are the sandbox testing caps; once live they are your plan's limits. The fuller usage view — including sandbox extensions and plan changes — is on **Settings → Subscription**. See [Subscription & Billing](/getting-started/plans-and-billing).

### Advanced

- **Always escalate certain topics** — name topics that skip the AI and go straight to a human, regardless of confidence (e.g. data privacy, account security, legal, fraud, billing disputes, refunds).
- **Compliance guardrails** (fintech) — rules for regulated support: advice limits, complaint timing, currency handling.

---

## Actions tab

Where you let Lira take **real actions** by calling your own systems. Every call still passes Lira's policy, confirmation / step-up, audit, and metering. (This replaces the old **Capabilities** catalog.)

### Connect a system — MCP server (recommended)

Point Lira at your MCP endpoint. Your tools run under your own auth. Nothing is callable until you **discover** the tools and **approve** them.

### REST adapter — Agent tool packs

No MCP server yet? Connect a REST API that follows Lira's convention (or a thin adapter in front of your real API). Each enabled **tool pack** exposes tools the agent can call during a chat. Example: the **Banking / Fintech actions** pack (`fintech_transaction_status`, `fintech_freeze_card`, `fintech_report_card_lost`, `fintech_open_dispute`, `fintech_change_limit`, `fintech_switch_plan`, `fintech_kyc_status`, …). Your key stays server-side; the verified customer is passed as the `X-Lira-Customer` header. **Money-moving actions automatically require the customer to re-authenticate (step-up) before running.**

### Advanced — manually registered actions (SDK)

Declare a server-side action by name so the AI knows it exists, ahead of wiring the executor. Most orgs use MCP instead.

[→ Full Actions guide](/platform/customer-support/actions)

---

## Developers tab

**Developer API keys** for automating Lira from the CLI or API — connecting MCP tools and minting native mobile support sessions from your backend. Create a key, then use it as `LIRA_API_KEY` (scopes such as `mcp:read`, `mcp:write`, `support:read`). A **CLI / API quickstart** on the same tab shows how to connect an MCP server and mint a customer session.

[→ Developer API](/platform/customer-support/developer-api)

---

## Escalation tab

Where conversations go when a human needs to step in.

### Alert email

The address that receives an alert whenever a conversation is escalated (including when Lira opens a ticket). Leave blank to email the org owner automatically; set a shared inbox like `support@yourcompany.com` if your team handles escalations together. There is also a toggle to turn the ticket-opened email on or off.

### Response-time target

The number of hours before an escalated ticket is flagged as overdue. Range: 1–72 hours. Default: **4 hours**.

### Automatic handoff

Let Lira bring in a human on its own — VIP customers, negative sentiment, repeated failures, and more.

### Extra destinations

Email always fires. You can also send the same ticket events to **Slack** (post to a channel), **Linear** (open an issue), or a signed **Webhook** (HTTPS only, HMAC-SHA256). Every delivery is retried and logged in **Support → Outbox**.

---

## Health & audit tab

Connection diagnostics plus a log of every action the agent ran on your behalf.

### Setup Health

Run diagnostics on demand to confirm your setup is working — support config, module activation, Web SDK runtime, widget secret, signature roundtrip, widget CDN reachability, and ticketing email. Every failed check tells you what's wrong **and** how to fix it. The same checks power the in-dashboard troubleshooting the AI runs when customers ask about widget issues.

### Agent audit log

The persistent record of every resource and action the AI agent used while helping customers — tickets, escalations, setup changes, setup-health checks, and approved customer actions. Each row includes:

- Action / resource name, kind, and status.
- Redacted input / output summary (emails masked, secret-named fields stripped).
- Policy decision and any ticket ID created.
- Estimated model cost in USD.

The log is read-only.

[→ Full Audit guide](/platform/customer-support/audit)

---

## Saving settings

The **Get connected**, **Channels**, **Behavior**, and **Escalation** groups share a single Save action — one button next to the tab bar and one in the sticky bar at the bottom of the page. Click it after making changes; there is no auto-save. The **Actions** and **Developers** tabs apply changes when you connect / create (per row); the **Agent audit log** is read-only.

You can move between tabs without losing unsaved changes, but refreshing or leaving the page will discard any uncommitted edits.
