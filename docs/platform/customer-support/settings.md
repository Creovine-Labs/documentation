---
sidebar_position: 8
title: Settings Reference
description: Complete reference for all Support settings — the Environment card and the five groups Get connected, Channels, AI behavior, Escalation, and Health & audit.
---

# Settings Reference

All Support settings live at **Settings → Support**. The page has two parts:

1. An **Environment card** at the top, always visible, showing whether the workspace is in **SANDBOX** or **LIVE** mode with a switch to change it. See [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).
2. Five grouped tabs below it:

| Tab | What it holds |
|---|---|
| **Get connected** | Web SDK snippets, widget appearance, the widget secret, mobile SDKs |
| **Channels** | Web chat, voice, email, WhatsApp, and the Lira-hosted page |
| **AI behavior** | Auto-reply, confidence threshold, volume limits, and the capabilities catalog |
| **Escalation** | Where conversations go when a human needs to step in |
| **Health & audit** | Integration diagnostics and the agent audit log |

Changes take effect after clicking **Save** (a Save button sits next to the tab bar and in a sticky bar at the bottom of the page — there is no auto-save). Two exceptions: the **Capabilities** section saves inline per row, and the **Agent audit log** is read-only.

Plan, usage, go-live status, billing status, Paddle Checkout, and the Paddle
customer portal also appear on the separate **Settings → Subscription** tab —
see [Subscription & Billing](/getting-started/plans-and-billing).

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
registered customer actions. The package is publish-ready, but must be published
to your npm registry before customer projects can install it by name.

```bash
# After @liraintelligence/support is published to your npm registry
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

## AI behavior tab

How the AI replies, when it holds back, and which actions it is allowed to take.

### Reply behavior

#### Auto-reply

When enabled, Lira automatically sends responses to customers when its confidence is at or above the threshold. When disabled, Lira will process conversations but not send any replies — useful for monitoring mode or during initial setup.

Default: **On**

#### Confidence Threshold

A slider from 0% to 100%. Lira generates a confidence score for each response based on how well it can ground the answer in your Knowledge Base. If the score is **below this threshold**, the conversation is automatically escalated to your team.

| Threshold | Effect |
|-----------|--------|
| **Low (e.g. 40%)** | Lira responds to more conversations autonomously — may include lower-quality answers |
| **Medium (e.g. 70%)** | Balanced — good autonomous rate with solid quality (recommended starting point) |
| **High (e.g. 90%)** | Very few autonomous responses — most conversations escalate to humans |

Default: **70%**

:::tip Calibrating the threshold
Start at 70%. Check your Analytics page after the first week. If escalation rate is too high and CSAT is good on autonomous conversations, lower the threshold. If CSAT on autonomous conversations is poor, raise it.
:::

#### Force-Escalate Intents

A comma-separated list of intent labels. If Lira detects any of these intents in a conversation, it **always** escalates — regardless of how confident it is.

Use this for sensitive or high-risk topics where you always want a human involved:

```
data_privacy, account_security, legal, fraud, billing_dispute, refund_request
```

Lira's intent detection is based on the content of the customer's message. When it classifies a conversation's intent as matching one of these labels, escalation happens immediately.

#### Volume & Limits

A read-only display showing your current usage against your monthly limits:

- **Conversations this month** / maximum per month
- **AI replies this month** / maximum per month

In sandbox these are the sandbox testing caps; once live they are your plan's limits. The fuller usage view — including sandbox extensions, plan changes, billing status, and Paddle customer portal access — is on **Settings → Subscription**. See [Subscription & Billing](/getting-started/plans-and-billing).

### Capabilities

The catalog of resources and actions Lira's AI agent is allowed to call inside your org. Each row carries a kind (`resource` or `action`), a risk tier, an auth scope, and a `runtime executable` or `metadata only` badge.

Admins can:

- Override the description, input/output schemas, risk tier, and auth scope of any built-in capability.
- Disable a capability entirely so the agent stops seeing it.
- Register new server-side capabilities ahead of an executor existing — they appear as `metadata only` until the runtime wires them up.

Overrides may only **tighten** policy, never loosen it. The runtime rejects loosening writes with `RISK_LOOSENED` or `SCOPE_LOOSENED`.

Unlike the rest of the page, capability rows save inline — each edit is applied immediately without the Save button.

[→ Full Capabilities guide](/platform/customer-support/capabilities)

---

## Escalation tab

Where conversations go when a human needs to step in.

### Escalation Email

The address that receives an alert whenever a conversation is escalated (including when Lira opens a ticket). Defaults to your account email; switch to a shared inbox like `support@yourcompany.com` if your team handles escalations together.

### SLA Target (hours)

The maximum number of hours before an escalated ticket is considered to be breaching SLA. Range: 1–72 hours.

Default: **4 hours**

### Slack Channel

Optional. A channel (e.g. `#support-escalations`) that receives a notification when a conversation is escalated. Requires the Slack integration to be connected.

### Linear Team

Optional. Escalated tickets are created as Linear issues in this team. Requires the Linear integration to be connected.

---

## Health & audit tab

Integration diagnostics plus a log of every action the agent ran on your behalf.

### Integration health

Run diagnostics on demand to confirm your setup is working — widget install, identity signing, channels, and connected integrations. Every row should be green before you consider the install done. The same checks power the in-dashboard troubleshooting the AI runs when you ask it about widget issues.

### Agent audit log

The persistent record of every capability call the AI agent made — successful, blocked, pending approval, or failed. Each row is an `AgentActionRun` with:

- Capability name, kind, status, risk tier, and effective auth scope.
- Redacted input / output summary (emails masked, secret-named fields stripped).
- Policy decision, conversation ID, visitor ID, and any ticket ID created.
- Estimated tokens in / out and the model cost in USD.

Filters: status and capability name. The log is read-only.

[→ Full Audit guide](/platform/customer-support/audit)

---

## Saving settings

The **Get connected**, **Channels**, **AI behavior** (Reply behavior), and **Escalation** groups share a single Save action — one button next to the tab bar and one in the sticky bar at the bottom of the page. Click it after making changes; there is no auto-save.

Two surfaces do not use the Save button:

- **Capabilities** (in AI behavior) saves each row inline — every upsert / delete is its own admin API call, applied immediately.
- **Agent audit log** (in Health & audit) is read-only.

You can move between tabs without losing unsaved changes, but refreshing or leaving the page will discard any uncommitted edits.
