---
id: whatsapp
title: WhatsApp Business API
sidebar_label: WhatsApp
---

# WhatsApp Business API channel

Run the same knowledge-grounded Lira agent inside WhatsApp: inbound customer
messages become Lira conversations, the AI answers from your knowledge base,
and escalations open tickets routed to your team — with per-channel
analytics.

:::info Plan requirement
The WhatsApp Business API channel is included in the **Scale** and
**Enterprise** plans. On other plans the section shows what you'd set up;
upgrade to Scale from **Settings → Subscription** (Scale is self-serve — pick
it and pay through Paddle Checkout). Meta's per-conversation fees are billed
by Meta on top of your Lira plan.

While your workspace is in [sandbox](/platform/customer-support/sandbox-and-going-live),
you can configure and dry-run the channel regardless of plan — but **real Meta
sends** always require a live workspace on Scale or above, because they accrue
Meta fees.
:::

## How the ownership works

**You own the sender identity; Lira operates the channel.** Your business
owns the Meta Business Portfolio, the WhatsApp Business Account (WABA), the
phone number, and the display name your customers see — and pays Meta's
WhatsApp fees. Lira securely stores the credentials you provide (encrypted;
never shown back in the dashboard), receives the webhooks, runs the AI, and
handles ticketing, escalation, and analytics.

## Before you start: Meta-side setup

Complete these in [Meta Business Manager](https://business.facebook.com)
(the in-app checklist under **Settings → Support → Channels → WhatsApp** mirrors
this list):

1. **Meta Business Portfolio** — create or confirm your Business Manager
   account.
2. **WhatsApp Business Account (WABA)** — create or connect one; note the
   WABA ID.
3. **Phone number** — add and verify the number customers will message. A
   number already registered in the WhatsApp app must be migrated first.
4. **Business verification & display name** — complete Meta business
   verification and submit your display name for review.
5. **Meta app + system-user access token** — create a Meta developer app
   with WhatsApp enabled and generate a system-user token with the
   `whatsapp_business_messaging` and `whatsapp_business_management`
   permissions, granted to your WABA and phone number.
6. **Message templates** — create and submit outbound templates (support
   acknowledgement, ticket updates, human handoff, resolution, CSAT).
   Templates are required for messages outside WhatsApp's 24-hour
   customer-service window.

## Configuring the channel in Lira

In **Settings → Support → Channels → WhatsApp**:

1. Enter your **WABA ID**, **Phone Number ID** (the Cloud API ID, not the
   visible number), display number, and display name.
2. Paste the **access token**, **app secret**, and a **webhook verify
   token** (generate any strong string). These are write-only: Lira stores
   them encrypted and shows only a "configured" badge afterward.
3. Copy the **webhook callback URL** shown in the tab into your Meta app's
   WhatsApp webhook configuration, using your verify token, and subscribe to
   the `messages` webhook field.
4. Add your approved **template names** to the allowlist, and set opt-out
   keywords.
5. Turn on the rollout toggles in order as you test:
   - **Channel enabled** — Lira accepts and verifies your webhooks.
   - **Ingest conversations** — inbound messages create Lira conversations.
   - **AI auto-replies** — the agent answers from your knowledge base
     (outbound stays in dry-run).
   - **Real Meta sends** — replies actually deliver to customers. Leave off
     until sandbox testing passes.

## Safety behavior

WhatsApp conversations run the same guardrails as web chat and email: PII
redaction before any AI processing, knowledge-grounded answers only,
low-confidence escalation, financial-advice refusal (where enabled), and
complaint escalation into SLA-tracked tickets. Duplicate webhook deliveries
are processed once.

## Analytics

The WhatsApp tab shows a 30-day summary (inbound messages, auto-replies,
outbound sends, failures, escalations, duplicates) and recent channel
events. WhatsApp conversations count toward your plan's monthly conversation
volume; Meta's fees are tracked separately.
