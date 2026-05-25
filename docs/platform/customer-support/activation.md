---
sidebar_position: 1
title: Activating Customer Support
description: Step-by-step walkthrough of the Lira support activation wizard — email, channels, integrations, knowledge base, and going live.
---

# Activating Customer Support

Before your team can use the Inbox, analytics, or any other support features, you need to activate the support module. The activation wizard walks you through five focused steps and takes under ten minutes to complete.

Navigate to **Support** in the sidebar. If your organisation hasn't activated support yet, you'll be taken directly to the activation wizard.

---

## Why activation matters

Activation does several things behind the scenes:

- Provisions your unique support email address on Lira's sending infrastructure (AWS SES)
- Stores your channel configuration (which channels you're enabling and how)
- Seeds the AI with your Knowledge Base so it can answer immediately after going live
- Configures your Ticketing Email so Lira knows where to send new-ticket notifications
- Flags your organisation's support module as active, unlocking the Tickets, Analytics, Proactive, and Actions tabs

You can change any of these settings later from **Settings → Support**, but completing all five steps before activating gives Lira the best possible starting context.

---

## Step 1 — Email setup

The first thing Lira does is assign your organisation a platform support address. It looks like:

```
support-yourcompanyname-a1b2@liraintelligence.com
```

This address is yours permanently — it's tied to your organisation ID and doesn't change. You can:

- **Share it directly** with customers as your public support email
- **Use your own address instead** — for example `support@yourcompany.com`

### Using your own email address

If you'd prefer customers to email an address on your own domain, set that address in the "Use your own existing address instead" field during Step 1 (or later in **Settings → Channels → Email**).

You'll then need to create a **forwarding rule** in your email provider that sends messages arriving at `support@yourcompany.com` → `support-yourcompanyname-a1b2@liraintelligence.com`. Every major email provider (Google Workspace, Microsoft 365, Fastmail, Zoho) supports this. The steps are identical to forwarding to any other address.

Once forwarding is set up:

1. Customers email `support@yourcompany.com` (your address)
2. Your provider silently forwards each message to Lira
3. Lira replies from `support-yourcompanyname-a1b2@liraintelligence.com`
4. Customers see a professional conversation in their inbox

:::tip Keep both addresses
Even if you use your own domain, keep the Lira address — you'll need it as the forwarding destination, and it's where Lira's sent mail actually originates.
:::

---

## Step 2 — Web surfaces and channels

Choose which support surfaces to enable. For B2B products, the primary web
surface is the **Web SDK** mounted inside the customer's own app, for example
`lemonpay.com/support`. You can still enable the floating widget and hosted
portal fallback when useful.

You can turn these on or off later from **Settings → Support**.

### Web SDK and full-page support embed

The Web SDK lets the customer's product own the route, domain, layout, and
navigation while Lira powers the support runtime.

After activation, copy the full-page SDK snippet and give it to the customer's
engineering team. They create their own support route and mount Lira into a
container:

```html
<div id="lira-support-root" style="height: 720px;"></div>
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-mode="fullscreen"
  data-target="#lira-support-root">
</script>
```

[→ Full Web SDK guide](/platform/customer-support/web-sdk)

### Chat Widget

An optional floating chat button for your website. It uses the same Lira runtime
as the full-page SDK, but appears as a compact launcher instead of filling a
support route.

You can customise:

- **Greeting message** — the first message Lira sends when a customer opens the chat (default: *"Hi! How can we help you today?"*)
- **Widget colour** — any hex colour, set from **Settings → Support → Web SDK**

After activation, you'll receive the install `<script>` snippet. [→ Full widget guide](/platform/customer-support/widget)

### Hosted portal fallback

A branded, publicly hosted fallback page at:

```
https://support.liraintelligence.com/your-slug
```

During activation, set your **portal slug** if you need a temporary no-code page
or a link to send in email. The slug becomes part of your portal URL and can be
changed later from **Settings → Support → Hosted**.

The hosted fallback lets customers:

- Submit new support tickets
- Track the status of existing conversations
- Live-chat with Lira

Do not iframe the hosted portal into a customer product. If the customer wants
support inside their own app or domain, use the Web SDK.

[→ Hosted portal guide](/platform/customer-support/portal)

---

## Step 3 — Ticket notifications

When Lira can't confidently answer a customer, it opens a **ticket** — a discrete async thread the team picks up on its own time. The customer keeps chatting with Lira in parallel; the ticket is purely a queue for human follow-up.

This step has two things:

### Ticketing Email (required)

The address that receives the notification every time Lira opens a ticket. Defaults to your account email — switch to a shared inbox like `support@yourcompany.com` if your team handles tickets together.

### Additional recipients — Enterprise

CC up to two extra teammates on every ticket notification. Available on the Enterprise plan only.

:::info Where ticketing replaces the old "escalation" flow
The previous version of Lira handed off live chats to a human (silencing the AI). That flow has been replaced by tickets: the AI never goes silent, and your team handles the harder questions asynchronously. Existing `escalation_email` settings continue to work — they now route ticket-created notifications.
:::

---

## Step 4 — Seed Knowledge Base

Lira's responses are grounded in your Knowledge Base. The more content it has, the better its answers will be from day one.

This step shows you:

- How many Knowledge Base entries exist in your organisation
- The status of any connected sources (Google Drive, GitHub, etc.)
- Whether a web crawl is in progress or complete

You don't need to do anything in this step if your Knowledge Base already has content. If it's empty, we strongly recommend adding documents or connecting a source before going live — otherwise Lira will rely solely on general knowledge without any company-specific context.

[→ Knowledge Base documentation](/knowledge-base)

---

## Step 5 — Test & Activate

Review your configuration, then click **Activate Support**. Lira will:

1. Confirm all settings
2. Provision your email address on the sending infrastructure
3. Save the Web SDK and hosted fallback settings
4. Mark your organisation's support module as active

Activation is immediate. There's no waiting period.

---

## After activation — what to send your customer

The success screen lists every artifact you'll hand over to the customer's dev team. Think of it as a deliverable: copy each one and share.

- **Support Email** — the address customers email
- **Full-page Support SDK snippet** — mount inside the customer's own `/support` route
- **NPM package example** — install `@liraintelligence/support` in bundled apps and register customer actions
- **Chat Widget install snippet** — optional floating launcher for other pages
- **Widget Secret** — server-side key for signing identified visitors (only needed if the customer's platform has logged-in users; skip for fully public sites)
- **Hosted Portal URL** — optional no-code fallback link

Activation is immediate. After closing the screen you land in **Tickets** — your team's work queue.
---

## What to do next

The basics are live. Here's what most organisations set up next, in order of priority:

### 1. Install the full-page support SDK

Create a route such as `/support` in the customer product and paste the
full-page SDK snippet from the success screen or **Settings → Support → Web SDK**.

[→ Full Web SDK guide](/platform/customer-support/web-sdk)

### 2. Share your support email

If you enabled email support, forward your support email address to customers. You can also configure a custom address (e.g. `support@yourcompany.com`) from **Settings → Support → Channels tab → Email section**.

### 3. Check your ticketing email

When Lira can't resolve a question, it opens a ticket and emails this address. Make sure it's set to an inbox somebody actually watches.

Go to **Settings → Support → Ticketing tab** (or revisit Step 3 in the activation wizard).

### 4. (Optional) Identify your logged-in users

By default, the widget treats every visitor as anonymous. If your website has logged-in users and you want Lira to greet them by name and access their account details, you can enable **identified visitor mode**.

This requires your server to compute an HMAC-SHA256 signature of the visitor's email using your widget secret, then pass the email, name, and signature to the SDK. The widget secret is available from **Settings → Support → Secret**.

This is optional and can be set up any time after going live.

[→ Full guide: Web SDK identity](/platform/customer-support/web-sdk#signed-identity)
---

## Changing settings after activation

Every setting you configure during activation can be changed later:

| What to change | Where to find it |
|----------------|-----------------|
| Enable/disable channels | Settings → Support → Channels tab |
| Custom support email / forwarding | Settings → Support → Channels tab → Email section |
| Web SDK snippets | Settings → Support → Web SDK tab |
| Portal slug | Settings → Support → Hosted tab |
| Widget colour & greeting | Settings → Support → Web SDK tab |
| Widget secret (identified visitors) | Settings → Support → Secret tab |
| Auto-reply & confidence threshold | Settings → Support → Behaviour tab |
| Ticketing email + CC recipients | Settings → Support → Ticketing tab (or activation Step 3) |

---

## Frequently asked questions

**Can I reactivate support after deactivating it?**
Yes. Your email address and configuration are preserved. Just go back to the activation flow.

**What if my Knowledge Base is empty when I activate?**
Lira will still respond, but answers will be less specific. Add documents or connect a source from the Knowledge Base section, then Lira begins using the new content for future conversations immediately — no reactivation needed.

**Can I change my hosted portal slug after activation?**
Yes — update it from **Settings → Support → Hosted**. The old URL will stop working, so update any links you've published.

**Does activation cost anything?**
Lira tracks monthly conversation and AI reply limits per your plan. You can see your current usage at any time in **Settings → Behaviour → Volume & Limits**.
