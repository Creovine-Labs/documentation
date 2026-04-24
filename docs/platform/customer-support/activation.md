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
- Connects your escalation destinations (Slack, Linear, or email) so alerts fire correctly
- Flags your organisation's support module as active, unlocking the Inbox, Analytics, Proactive, and Actions tabs

You can change any of these settings later from **Support → Settings**, but completing all five steps before activating gives Lira the best possible starting context.

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

## Step 2 — Channels

Choose which support channels to enable. You can turn any of these on or off at any time after activation from **Settings → Channels**.

### Chat Widget

An embeddable floating chat button for your website. When enabled, you'll see a **live preview** of the widget with an animated demo conversation so you can see exactly what your customers will experience.

You can customise:

- **Greeting message** — the first message Lira sends when a customer opens the chat (default: *"Hi! How can we help you today?"*)
- **Widget colour** — any hex colour, set from **Settings → Widget**

After activation, you'll receive the install `<script>` snippet. [→ Full widget guide](/platform/customer-support/widget)

### Support Portal

A branded, publicly hosted page at:

```
https://support.liraintelligence.com/your-slug
```

During activation, set your **portal slug** — a short lowercase identifier for your organisation (e.g. `acme-corp`). The slug becomes part of your portal URL and can be changed later from **Settings → Channels**.

The portal lets customers:

- Submit new support tickets
- Track the status of existing conversations
- Live-chat with Lira

You can also embed the portal as an `<iframe>` inside your own help centre or website.

[→ Full portal guide](/platform/customer-support/portal)

---

## Step 3 — Connect integrations

Connecting integrations means Lira knows where to route escalations and can pull in additional context.

| Integration | What it unlocks |
|-------------|----------------|
| **Slack** | Real-time escalation alerts in a channel of your choice |
| **Linear** | Automatically creates issues in your team when conversations are escalated |
| **HubSpot** | Links conversations to HubSpot contact and deal records |
| **Salesforce** | Associates tickets with Salesforce contacts and opportunities |

You can connect or disconnect any integration at any time from the **Integrations** page. None of these are required to activate — you can skip this step and connect integrations later.

You can also set an **Escalation Email** here: the email address that receives a notification whenever Lira escalates a conversation to a human. This is separate from your support address — it goes to whoever on your team handles urgent tickets.

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
3. Sync your portal slug (if you enabled a portal)
4. Mark your organisation's support module as active

Activation is immediate. There's no waiting period.

---

## After activation — what you'll see

Once you click **Activate Support**, a success screen appears with:

- Your **support email address** (copy it to share with customers)
- The **chat widget install code** (if you enabled the chat widget)
- Your **portal URL** (if you enabled the portal), plus an iframe embed code

After closing this screen, you'll land in the **Inbox** — ready to receive conversations.
---

## What to do next

The basics are live. Here's what most organisations set up next, in order of priority:

### 1. Install the chat widget on your website

Copy the `<script>` snippet from the success screen (or from **Support → Settings → Widget tab → Embed Code**) and paste it into your site's layout before the closing `</body>` tag. It takes one minute.

[→ Full widget installation guide](/platform/customer-support/widget)

### 2. Share your support email

If you enabled email support, forward your support email address to customers. You can also configure a custom address (e.g. `support@yourcompany.com`) from **Support → Settings → Channels tab → Email section**.

### 3. Check your escalation destination

When Lira can't resolve a conversation, it escalates to your team. Make sure the right destination is configured — Slack channel, email, or Linear — so your team gets notified immediately.

Go to **Support → Settings → Escalation tab**.

### 4. (Optional) Identify your logged-in users

By default, the widget treats every visitor as anonymous. If your website has logged-in users and you want Lira to greet them by name and access their account details, you can enable **identified visitor mode**.

This requires your server to compute an HMAC-SHA256 signature of the visitor's email using your widget secret, then pass the email, name, and signature as attributes on the `<script>` tag. The widget secret is available from **Support → Settings → Widget tab → Widget Secret**.

This is optional and can be set up any time after going live.

[→ Full guide: Identifying visitors](/platform/customer-support/widget#identifying-visitors-optional)
---

## Changing settings after activation

Every setting you configure during activation can be changed later:

| What to change | Where to find it |
|----------------|-----------------|
| Enable/disable channels | Support → Settings → Channels tab |
| Custom support email / forwarding | Support → Settings → Channels tab → Email section |
| Portal slug | Support → Settings → Channels tab → Support Portal section |
| Widget colour & greeting | Support → Settings → Widget tab |
| Widget secret (identified visitors) | Support → Settings → Widget tab → Widget Secret section |
| Auto-reply & confidence threshold | Support → Settings → Behaviour tab |
| Escalation email, Slack, Linear | Support → Settings → Escalation tab |
| Integrations | Integrations page in sidebar |

---

## Frequently asked questions

**Can I reactivate support after deactivating it?**
Yes. Your email address and configuration are preserved. Just go back to the activation flow.

**What if my Knowledge Base is empty when I activate?**
Lira will still respond, but answers will be less specific. Add documents or connect a source from the Knowledge Base section, then Lira begins using the new content for future conversations immediately — no reactivation needed.

**Can I change my portal slug after activation?**
Yes — update it from **Settings → Channels → Support Portal**. The old URL will stop working, so update any links you've published.

**Does activation cost anything?**
Lira tracks monthly conversation and AI reply limits per your plan. You can see your current usage at any time in **Settings → Behaviour → Volume & Limits**.
