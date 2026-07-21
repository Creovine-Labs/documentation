---
slug: /getting-started/quickstart
sidebar_position: 3
title: Quickstart
description: From your first Lira invite to a working chat widget on your site — in under 30 minutes.
---

# Quickstart

This walks you through the first 30 minutes after we provision your Lira account. By the end you'll have:

- An account, signed in
- An organization with at least one knowledge source
- A working Lira widget on a page you control (staging is fine)

If you don't have an account yet, start at **[Get an Account](/getting-started/get-an-account)**.

## Prerequisites

- An invite link from the Lira team (delivered by email after your scoping call)
- A site or app you can paste a `<script>` tag into — staging is fine
- A help center URL, a few PDFs, or a Google Drive folder with docs (any one of these works)

## Step 1 — Accept your invite

Click the invite link in your email. You'll land on `/accept-invite?token=…`, set a password, and get dropped into the Lira dashboard with your organization already set up.

If you're inviting teammates next, go to **Members** in the sidebar and click **Invite a teammate**. Each invite is a one-time, expiring link tied to a specific email — they set their own password when they accept.

## Step 2 — Feed Lira your knowledge

Lira's quality is a direct function of what it knows about your product. Open **Knowledge Base** in the sidebar (under **Grow**) and add at least one source:

- **Web crawl** — paste your help center / docs URL. Lira crawls, summarizes, and stores each page. Re-runs on demand.
- **Documents** — drop in PDFs, DOCX, Markdown, or CSV files.
- **Connected sources** — connect Google Drive when your support docs live there, then import the approved files into your KB.

You can mix all three. See [Knowledge Base](/knowledge-base/overview) for the full picture.

## Step 3 — Activate the support module

In the sidebar, click **Customer Support** (or the activation prompt on the dashboard). The activation wizard covers:

1. **Email setup** — pick a Lira-hosted support address or forward from your own domain.
2. **Channel** — chat widget, full support page, or both.
3. **Ticket notifications** — the email address that hears about every ticket Lira opens.
4. **Test & activate** — chat with Lira in test mode, then flip the toggle live.

Full reference: [Activation guide](/platform/customer-support/activation).

## Step 4 — Drop the widget on a page

Once activated, copy the embed snippet from **Settings → Support → Get connected** (or from the activation success screen). It looks like this:

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-position="bottom-right">
</script>
```

Paste it before the closing `</body>` tag of your site. Reload — a Lira bubble appears in the bottom corner. Click it and chat.

For framework-specific setup (Next.js, Vite, Remix, Rails, Django, Express, plain HTML), see [Install guides](/platform/customer-support/integration-guides). For logged-in users with signed identity, see [Identified visitors on the widget page](/platform/customer-support/widget).

## Step 5 — Go further

You have a working widget. Here's what most teams do next, in roughly this order:

- **[Capabilities](/platform/customer-support/capabilities)** — review and register the real operations Lira can run on a visitor's behalf (cancel, upgrade, retry payment, refund), with per-capability risk and approval policy. This is where Lira stops being a chatbot and starts being a support agent.
- **[Go live](/platform/customer-support/sandbox-and-going-live)** — when testing in sandbox is done, flip the workspace live from the Environment card in Settings → Support to start serving real customers on your plan.
- **[Proactive](/platform/customer-support/proactive)** — trigger contextual nudges when visitors hit an error state, get stuck on onboarding, or match any condition you define.
- **[Inbox](/platform/customer-support/inbox)** — review what Lira said, learn from edge cases, correct anything that should be answered differently next time.
- **[Analytics](/platform/customer-support/analytics)** — resolution rate, deflection, response time, top intents, CSAT.

## Got stuck?

The chat widget on the Lira dashboard is **the same widget you'll embed on your site** — pointed at Lira's own onboarding context. Ask it. If it can't answer (genuinely product, billing, or roadmap), it opens an async ticket with our team and we reply by email.
