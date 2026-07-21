---
sidebar_position: 1
title: Activating Customer Support
description: Step-by-step walkthrough of the Lira support activation wizard — email, channels, notifications, knowledge base, and going live.
---

# Activating Customer Support

Before your team can use the Tickets queue, analytics, or any other support features, you need to activate the support module. The activation wizard walks you through **four focused steps** and takes under two minutes to complete.

Navigate to **Support** in the sidebar. If your organisation hasn't activated support yet, you'll be taken directly to the activation wizard.

:::tip Knowledge Base is now post-activation
Seeding the Knowledge Base used to be Step 4 of this wizard, but it's a multi-step async flow (web crawls, document uploads, source OAuth) that doesn't fit a quick wizard. After you click **Activate**, the success screen pushes you straight to **/org/knowledge** — and the in-dashboard Lira widget walks you through it as step 2 of its setup guide. See [Onboarding overview](/platform/customer-support/onboarding).
:::

:::info Activation is free — you start in sandbox
New organisations activate into the **sandbox** environment: every feature is testable at no cost, outbound emails are previewed rather than sent, and the widget shows a SANDBOX badge. Billing only starts when you deliberately go live from the Environment card at the top of **Settings → Support**. See [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).
:::

---

## Why activation matters

Activation does several things behind the scenes:

- Provisions your unique support email address on Lira's email-routing infrastructure
- Stores your channel configuration (Web SDK Runtime, optional widget)
- Generates your widget secret for identified-visitor HMAC signing
- Configures your Ticketing Email so Lira knows where to send new-ticket notifications
- Flags your organisation's support module as active, unlocking the Inbox, Tickets, Customers, Proactive, and Analytics pages
- Unlocks the remaining steps of the in-widget setup guide (they stay locked until activation)

You can change any of these settings later from **Settings → Support**.

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

If you'd prefer customers to email an address on your own domain, set that address in the "Use your own existing address instead" field during Step 1 (or later in **Settings → Support → Channels → Email Support**).

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
- **Widget colour** — any hex colour, set from **Settings → Support → Get connected**

After activation, you'll receive the install `<script>` snippet. [→ Full widget guide](/platform/customer-support/widget)

### Hosted portal fallback

A branded, publicly hosted fallback page at:

```
https://support.liraintelligence.com/your-slug
```

During activation, set your **portal slug** if you need a temporary no-code page
or a link to send in email. The slug becomes part of your portal URL and can be
changed later from **Settings → Support → Channels → Hosted page**.

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

## Step 4 — Test & Activate

Review your configuration, then click **Activate Support**. Lira will:

1. Confirm all settings
2. Provision your email address on the sending infrastructure
3. Generate your widget secret
4. Mark your organisation's support module as active

Activation is immediate. There's no waiting period.

:::tip Don't worry about the Knowledge Base yet
The activation success screen pushes you straight to **/org/knowledge** with a one-click "Seed Knowledge Base" button. Seeding takes 1–10 minutes for most products (web crawl + document upload) and doesn't block activation. See [Onboarding overview](/platform/customer-support/onboarding) for the full setup journey post-activation.
:::

### The in-widget setup guide unlocks here

The Lira widget on your dashboard renders a numbered setup-progress card. Before activation, only step 1 (Activate customer support) is clickable — the later steps are shown locked, and clicking one displays "Activate customer support first." The moment activation completes, the locked steps unlock automatically (no refresh needed), each step becomes clickable and navigates you to the right page, and steps tick themselves off as the underlying work is detected — you never mark them done by hand. See [Onboarding overview](/platform/customer-support/onboarding).

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
full-page SDK snippet from the success screen or **Settings → Support → Get connected**.

[→ Full Web SDK guide](/platform/customer-support/web-sdk)

### 2. Share your support email

If you enabled email support, forward your support email address to customers. You can also configure a custom address (e.g. `support@yourcompany.com`) from **Settings → Support → Channels → Email Support**.

### 3. Check your ticketing email

When Lira can't resolve a question, it opens a ticket and emails this address. Make sure it's set to an inbox somebody actually watches.

Go to **Settings → Support → Escalation** (or revisit Step 3 in the activation wizard).

### 4. (Optional) Identify your logged-in users

By default, the widget treats every visitor as anonymous. If your website has logged-in users and you want Lira to greet them by name and access their account details, you can enable **identified visitor mode**.

This requires your server to compute an HMAC-SHA256 signature of the visitor's email using your widget secret, then pass the email, name, and signature to the SDK. The widget secret is available from **Settings → Support → Get connected → Widget secret**.

This is optional and can be set up any time after going live.

[→ Full guide: Web SDK identity](/platform/customer-support/web-sdk#signed-identity)
---

## Changing settings after activation

Every setting you configure during activation can be changed later:

| What to change | Where to find it |
|----------------|-----------------|
| Enable/disable channels | Settings → Support → Channels |
| Custom support email / forwarding | Settings → Support → Channels → Email Support |
| Web SDK snippets | Settings → Support → Get connected |
| Portal slug | Settings → Support → Channels → Hosted page |
| Widget colour & greeting | Settings → Support → Get connected |
| Widget secret (identified visitors) | Settings → Support → Get connected → Widget secret |
| Auto-reply & confidence threshold | Settings → Support → AI behavior → Reply behavior |
| Ticketing email + SLA target | Settings → Support → Escalation (or activation Step 3) |
| Sandbox / live environment | Settings → Support → Environment card (above the tabs) |

---

## Frequently asked questions

**Can I reactivate support after deactivating it?**
Yes. Your email address and configuration are preserved. Just go back to the activation flow.

**What if my Knowledge Base is empty when I activate?**
Lira will still respond, but answers will be less specific. Add documents or connect a source from the Knowledge Base section, then Lira begins using the new content for future conversations immediately — no reactivation needed.

**Can I change my hosted portal slug after activation?**
Yes — update it from **Settings → Support → Channels → Hosted page**. The old URL will stop working, so update any links you've published.

**Does activation cost anything?**
No. You activate into the free sandbox environment, where testing caps apply instead of plan limits. Paid billing starts only when you go live from the Environment card in **Settings → Support** and complete the required Paddle-backed subscription flow. You can see your current usage, plan, and billing status at any time in **Settings → Subscription**. See [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).
