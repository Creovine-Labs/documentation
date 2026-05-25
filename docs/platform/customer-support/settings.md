---
sidebar_position: 8
title: Settings Reference
description: Complete reference for all Support settings — Web SDK, Secret, Channels, Hosted fallback, Behaviour, and Escalation.
---

# Settings Reference

All Support settings are accessible from **Settings → Support**. Settings are grouped into tabs including **Web SDK**, **Secret**, **Channels**, **Hosted**, **Behaviour**, and **Escalation**. Changes take effect after clicking **Save**.

---

## Web SDK tab

Copy SDK snippets and configure the appearance of your web support surfaces.

### Full-page Support SDK

The recommended B2B install snippet. Copy this into a customer-owned route such
as `/support` so Lira renders inside their app instead of sending users to a
hosted Lira URL.

[→ Full Web SDK guide](/platform/customer-support/web-sdk)

### JavaScript SDK API

Use this snippet when the product needs signed visitor identity and live product
context. It shows `window.Lira.init(...)`, `window.Lira.identify(...)`,
`window.Lira.setContext(...)`, and `window.Lira.mountSupportPage(...)`.

### NPM package

Use `@liraintelligence/support` when the customer wants typed imports, React components, and
registered customer actions. The package is publish-ready, but must be published
to your npm registry before customer projects can install it by name.

```bash
# After @liraintelligence/support is published to your npm registry
npm install @liraintelligence/support
```

The React entrypoint is `@liraintelligence/support/react` and exports `LiraProvider`,
`useLira`, `useLiraAction`, `LiraSupportPage`, and `LiraWidget`.

### Floating Chat Widget

The optional launcher snippet for pages where you want a compact support button.
It uses the same Lira runtime as the full-page SDK.

[→ Full widget installation guide](/platform/customer-support/widget)

### Widget Colour

The primary colour used for the widget button, header bar, and Lira's message bubbles.

- Enter any 6-digit hex code (e.g. `#3730a3`, `#1d4ed8`)
- Or pick from the quick-select palette of preset colours
- A live colour swatch shows the selected colour

### Greeting Message

The first message Lira sends when a customer opens the chat widget. Keep it brief and welcoming.

Default: *"Hello! How can I help you today?"*

---

## Secret tab

### Widget Secret

The widget secret is used to verify the identity of logged-in visitors on your website. It is only needed if you want Lira to recognise your logged-in users and access their account information — anonymous chat support does not require it.

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

---

## Channels tab

Enable or disable each support channel and configure channel-specific settings.

### Web Chat Runtime

Enables or disables the runtime used by both:

- The full-page Support SDK
- The floating chat widget

If this is disabled, new web chat sessions are not accepted.

### Hosted Portal

Enable the optional Lira-hosted fallback page.

| Field | Description |
|-------|-------------|
| **Enabled** | Toggle to turn the hosted fallback on or off |
| **Portal URL slug** | Lowercase identifier for your portal URL (e.g. `acme-corp` → `support.liraintelligence.com/acme-corp`) |
| **Open portal** | Link to open your live portal (appears once your slug is saved) |

[→ Hosted portal guide](/platform/customer-support/portal)

### Chat Widget

An embeddable floating chat button for your website.

| Field | Description |
|-------|-------------|
| **Enabled** | Toggle to enable or disable live chat on your embedded widget |

The widget's appearance, full-page SDK snippet, and floating widget snippet are configured in the **Web SDK tab**.

### Email Support

Handles inbound customer emails via Lira's AI reply engine.

| Field | Description |
|-------|-------------|
| **Enabled** | Toggle to enable AI email handling |
| **Your Lira support address** | Your assigned platform address — share this with customers or use as a forwarding destination |
| **Custom address (optional)** | Your own domain's support email (e.g. `support@yourcompany.com`). If set, configure forwarding from this address to your Lira address in your email provider. |

#### How custom email forwarding works

When you set a custom address, Lira **does not** control your domain's email. You need to create a forwarding rule in your own email provider (Google Workspace, Microsoft 365, etc.) so that messages to your custom address are automatically forwarded to your Lira address.

```
Customer → support@yourcompany.com
  → your email provider forwards to → support-yourcompanyname-a1b2@liraintelligence.com
  → Lira reads and responds
```

Lira will display the "Forwarding setup required" instructions in Settings whenever a custom address is entered, as a reminder.

:::info Voice support
Inbound voice (AI phone agent) is currently disabled behind a feature flag while we
polish the call quality. The UI may still show a toggle in some plans; expect it to
return as a generally available feature in a future release.
:::

---

## Behaviour tab

Control how Lira decides when to respond autonomously and when to escalate.

### Auto-reply

When enabled, Lira automatically sends responses to customers when its confidence is at or above the threshold. When disabled, Lira will process conversations but not send any replies — useful for monitoring mode or during initial setup.

Default: **On**

### Confidence Threshold

A slider from 0% to 100%. Lira generates a confidence score for each response based on how well it can ground the answer in your Knowledge Base. If the score is **below this threshold**, the conversation is automatically escalated to your team.

| Threshold | Effect |
|-----------|--------|
| **Low (e.g. 40%)** | Lira responds to more conversations autonomously — may include lower-quality answers |
| **Medium (e.g. 70%)** | Balanced — good autonomous rate with solid quality (recommended starting point) |
| **High (e.g. 90%)** | Very few autonomous responses — most conversations escalate to humans |

Default: **70%**

:::tip Calibrating the threshold
Start at 70%. Check your Analytics tab after the first week. If escalation rate is too high and CSAT is good on autonomous conversations, lower the threshold. If CSAT on autonomous conversations is poor, raise it.
:::

### Force-Escalate Intents

A comma-separated list of intent labels. If Lira detects any of these intents in a conversation, it **always** escalates — regardless of how confident it is.

Use this for sensitive or high-risk topics where you always want a human involved:

```
data_privacy, account_security, legal, fraud, billing_dispute, refund_request
```

Lira's intent detection is based on the content of the customer's message. When it classifies a conversation's intent as matching one of these labels, escalation happens immediately.

### Volume & Limits

A read-only display showing your current usage against your plan limits:

- **Conversations this month** / maximum per month
- **AI replies this month** / maximum per month

Contact your account manager to increase limits.

---

## Ticketing tab

Configure where ticket notifications go when Lira can't answer a question on its own. (The legacy "Escalation" tab was renamed — same field, new framing.)

### Ticketing Email

The address that receives a notification every time Lira opens a ticket. Defaults to your account email; switch to a shared inbox like `support@yourcompany.com` if your team handles tickets together.

Example: `support-team@yourcompany.com`

### Additional recipients (Enterprise)

CC up to two extra teammates on every ticket notification. Available on the Enterprise plan only. Configure them in this tab or during activation Step 3.

### SLA Target (hours)

The maximum number of hours before a ticket is considered to be breaching SLA. Valid range: 1–720 hours.

When a ticket hasn't been resolved within this window, it's flagged in Lira's internal tracking. (Future versions will surface SLA breach alerts directly in the Tickets view.)

Default: **4 hours**

:::info Slack / Linear / HubSpot / Salesforce
Previous versions of Lira routed escalations to Slack, Linear, HubSpot, or Salesforce. Those channels have been removed from the activation flow in favour of the unified **Ticketing Email** plus the in-app [Tickets](/platform/customer-support/tickets) queue. The underlying integrations may return as KB connected sources in the future, but they are no longer used for escalation alerts.
:::

---

## Saving settings

All four tabs share a single **Save Support Settings** button at the bottom of the page. Click it after making any changes — unsaved changes are indicated by the button becoming active (it's disabled when no changes are pending).

You can navigate between tabs without losing unsaved changes, but refreshing or leaving the page will discard any uncommitted edits.
