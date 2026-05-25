---
slug: /platform/customer-support
sidebar_position: 4
title: Customer Support
description: Complete guide to Lira's AI-powered customer support — Web SDK, tickets, widget, hosted fallback portal, proactive outreach, autonomous actions, and analytics.
---

# Customer Support

Lira's Customer Support module gives your organisation a fully autonomous AI support operation — handling inbound emails, in-app support, live chat, voice calls, tickets, and AI actions, all grounded in your Knowledge Base.

Once activated, Lira reads every incoming message, searches your documentation for the best answer, and responds confidently. When it can't, it opens a **ticket** for your team to handle asynchronously — without breaking the live chat with the customer.

---

## What's included

| Module | What it does |
|--------|-------------|
| [**Tickets**](/platform/customer-support/tickets) | Async human-followup queue. The primary surface your team works from. |
| [**Web SDK**](/platform/customer-support/web-sdk) | Full-page support embed for your own `/support` route, plus identity and live context |
| [**Chat Widget**](/platform/customer-support/widget) | Embeddable floating chat button for your website |
| [**Hosted Portal**](/platform/customer-support/portal) | Optional no-code fallback page when you cannot ship the SDK yet |
| [**Actions**](/platform/customer-support/actions) | Review and approve autonomous actions Lira wants to take on behalf of customers |
| [**Proactive**](/platform/customer-support/proactive) | Automated outreach — trigger messages based on customer events |
| [**Analytics**](/platform/customer-support/analytics) | CSAT scores, resolution rates, response times, and weekly reports |
| [**Chat history**](/platform/customer-support/inbox) | Read-only audit log of every AI chat. Use it to QA Lira's accuracy. |
| [**Settings**](/platform/customer-support/settings) | Configure channels, behaviour, ticketing email, and widget appearance |

---

## How it works

When support is activated, Lira listens across every channel you've enabled:

```
Customer message (email / SDK / chat / voice / hosted portal)
  → Lira retrieves relevant content from your Knowledge Base
  → Generates a grounded response
  → Confidence ≥ threshold  →  sends reply autonomously
  → Confidence   < threshold  →  opens a Ticket — async human follow-up
                                  (the live chat keeps going in parallel)
```

The AI chat is **never interrupted**. When something needs a human, Lira opens a [Ticket](/platform/customer-support/tickets) and keeps chatting with the visitor. Your team works the tickets queue at their own pace; the visitor gets an email when there's a reply.

Every raw chat — across channels — is still archived in **Chat history** so you can audit Lira's accuracy.

---

## Channels

Lira supports several support surfaces, each independently configurable from **Support → Settings**:

### Email
Lira is assigned a platform support address the moment you activate (e.g. `support-yourcompany-a1b2@liraintelligence.com`). You can share this directly with customers, or configure your own address (e.g. `support@yourcompany.com`) and set up a forwarding rule — Lira handles everything from there.

### Chat Widget
A floating chat button embedded on any page of your website. Install it with a single `<script>` tag. Customers get instant AI responses without leaving your site. Fully customisable colour and greeting message.

### Web SDK
The recommended B2B integration. Create your own support route, for example `lemonpay.com/support`, and mount Lira inside it. Your company owns the domain, app shell, and surrounding UI; Lira powers the AI conversation, tickets, signed identity, live product context, and action workflow. [→ Full SDK guide](/platform/customer-support/web-sdk)

### Voice
Inbound phone support powered by Lira's real-time voice AI. Customers call your support line; Lira answers, understands their issue, and either resolves it or escalates to a human in the same workflow.

### Hosted Portal
A branded, publicly accessible fallback page at `support.liraintelligence.com/your-slug`. Use it for temporary no-code launches or email links when a customer cannot integrate the Web SDK yet. [→ Hosted portal guide](/platform/customer-support/portal)

---

## Getting started

If you haven't activated the support module yet, the app will guide you through a short setup wizard covering email, channels, integrations, and knowledge base seeding.

[→ Activation guide](/platform/customer-support/activation)

---

## Related pages

- [Activation](/platform/customer-support/activation) — Step-by-step setup wizard
- [Tickets](/platform/customer-support/tickets) — Async human-followup queue (primary operator surface)
- [Web SDK](/platform/customer-support/web-sdk) — Full-page support embed for customer-owned routes
- [Chat Widget](/platform/customer-support/widget) — Website embed
- [Hosted Portal](/platform/customer-support/portal) — No-code fallback page
- [Chat history](/platform/customer-support/inbox) — Read-only audit log
- [Actions](/platform/customer-support/actions) — Autonomous action approvals
- [Proactive Outreach](/platform/customer-support/proactive) — Event-triggered messaging
- [Analytics](/platform/customer-support/analytics) — Reporting and CSAT
- [Settings Reference](/platform/customer-support/settings) — All configuration options
