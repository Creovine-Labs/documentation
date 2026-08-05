---
sidebar_position: 2
title: Sandbox and going live
description: What the free sandbox includes, the testing caps that apply, and exactly what changes the moment you switch your workspace live.
---

# Sandbox and going live

Every new Lira organisation starts in **sandbox** — a free environment where you can test the entire product before paying anything. When you're ready, you flip the workspace to **live** from the Environment card at the top of **Settings → Support**. That switch is the commercial moment: your plan's limits apply and, for paid plans, Paddle-backed billing begins.

:::tip You don't have to choose one or the other
Going live does **not** end your ability to test. With [test and live keys](/platform/customer-support/test-and-live-mode), a live workspace keeps running test traffic from your staging environment at the same time — separately capped, no real sends, kept out of the live inbox. The caps on this page apply to **test-mode traffic**, whether or not your workspace has gone live.
:::

---

## What sandbox includes

Sandbox is built so you can evaluate everything, not a cut-down trial:

- **Every feature is unlocked**, regardless of the plan you were invited on. WhatsApp configuration, tool packs, branding options — a Free-invited org can fully evaluate Scale-level behaviour before committing.
- **Real-world side effects are suppressed.** Customer-facing emails and WhatsApp messages are dry-run: you see exactly what Lira *would* send (previewed in the dashboard), but nothing reaches a real customer's inbox or phone. Slack, Linear, and outbound-webhook escalations are also suppressed in sandbox, so testing never posts into your live channels. Tool packs backed by a real external integration (e.g. Stripe) stay blocked until you go live.
- **Your own team still gets alerted.** Ticket and escalation notifications to *your* team's address are delivered in sandbox — so you can confirm the flow works — and are clearly tagged **`[SANDBOX]`** in the subject.
- **A SANDBOX badge is visible.** The widget shows a SANDBOX pill in its header, and the dashboard shows a sandbox indicator, so nobody mistakes test traffic for production support.
- **Payments are safe to rehearse.** A sandbox workspace runs checkout against Paddle's sandbox environment: you can practise subscribing and going live using Paddle **test cards** (for example `4242 4242 4242 4242`, any future expiry, any 3-digit code) and **no real money is charged**. Lira picks the Paddle environment automatically from the workspace's environment, so you never have to configure it. See [Subscription & Billing → Testing payments safely in sandbox](/getting-started/plans-and-billing#testing-payments-safely-in-sandbox).

Two things stay locked even in sandbox: real WhatsApp message sending (requires a live workspace on Scale or above, because it accrues Meta fees) and the go-live switch itself, which is a deliberate, confirmed step.

## Sandbox testing caps

Testing is free, so a fixed set of monthly caps applies to **test-mode traffic** — that means a sandbox workspace, and also the test-key traffic of a workspace that has already gone live:

| Cap | Default |
|---|---|
| Conversations per month | 500 |
| AI replies per month | 500 |
| AI calls per month (all pipeline stages) | 2,000 |
| Knowledge Base size | 200 web pages / 25 documents |

Test and live volumes are counted **separately**: hitting a test cap never throttles your real customers, and heavy live usage never blocks your staging tests.

Caps reset monthly, like plan limits. If you hit one, the widget and dashboard show a friendly message — testing pauses for the rest of the month unless you go live or request an extension. Sandbox conversation data is also retained for 30 days (Knowledge Base content and documents are kept until you delete them).

You can watch your sandbox usage on **Settings → Subscription**, which shows live bars for conversations, AI replies, and LLM calls against the caps.

### Requesting a sandbox extension

Need more room to finish testing? On **Settings → Subscription**, click **Request sandbox extension**. The Lira team reviews the request; on approval your caps are raised for the month. A maximum of **2 extension requests per month** are granted per organisation. Only org owners and admins can request extensions, and only one request (extension or plan change) can be pending at a time.

---

## Going live

When your integration is ready, open **Settings → Support** and use the **Environment card** above the tabs:

1. Click **Production** on the Sandbox / Production switch.
2. A confirmation dialog shows your plan, its price, and its included monthly volume, and states plainly: going live starts billing for paid plans.
3. Type your organisation's name to confirm, then click the confirm button — labelled **Go live** on Free, or **Set up billing & go live** on a paid plan without an active subscription.

### Or from the terminal

Going live is not dashboard-only. The CLI has the same switch, with the same typed confirmation:

```bash
lira env show        # is this workspace live?
lira env go-live     # asks you to type the organisation name
lira env sandbox     # go back
```

If your plan needs a subscription and there isn't one, the CLI stops and sends you to the dashboard — Paddle checkout needs a browser. Everything else works from the terminal. See [switching modes from your terminal](/platform/customer-support/test-and-live-mode#switching-modes-from-your-terminal).

**On a paid plan (Pro or Scale) with no active subscription, going live collects payment first.** Confirming opens a **Paddle Checkout overlay**; the workspace only switches to production after payment succeeds. If a subscription is already active — or the workspace is on Free — there is no checkout step and the switch happens immediately. Because the workspace is still in sandbox at this point, any checkout you run before the switch uses Paddle's sandbox environment and test cards; the first checkout that bills a real card is the one that takes you live.

The moment the switch completes:

- **Your plan's limits replace the sandbox caps.** Included conversation and AI-reply volumes come from the plan you agreed with the Lira team (see [Subscription & Billing](/getting-started/plans-and-billing)).
- **Real billing becomes active for paid plans.** Going live starts your billing period. Lira uses Paddle as the authorized reseller and Merchant of Record for Pro and Scale checkout, invoices, receipts, taxes, and payment-method updates, and now charges a **real** payment card (sandbox was test-card only). Paid plans also keep answering past the included volume and bill the excess as [overage](/getting-started/plans-and-billing#what-happens-at-your-limit). No org ever goes billable silently.
- **Real outbound turns on.** Emails actually send, and plan-gated features (such as real WhatsApp sends on Scale+) become available.
- **Plan feature gates become authoritative.** In sandbox everything was unlocked for testing; live, your plan decides which features you have.

The SANDBOX badge disappears from the widget and the Environment card shows **LIVE**.

### Returning to sandbox

The switch also works in reverse — for example to roll back during an incident. Switching back to sandbox re-suppresses real outbound sends, restores the SANDBOX badge, and re-applies the testing caps. It does not automatically cancel an active paid subscription; use **Settings → Subscription** or contact the Lira team before rolling back a live workspace for billing reasons.

---

## Limits, downgrades, and billing

Once live, your usage is governed by your plan:

- What happens when you reach your included volume (paid plans keep answering and bill the excess as overage), how upgrades and downgrades apply, and how Paddle billing works are covered in [Subscription & Billing](/getting-started/plans-and-billing).
- Plan changes are made from **Settings → Subscription**. Pro and Scale are self-serve (pick the plan, pay through Paddle Checkout, and it applies automatically); Enterprise and downgrades to Free are reviewed by the Lira team. On a downgrade, paid features lock when the change is applied, while usage caps above the new plan's limits stay in place until your next monthly reset.

---

## Frequently asked questions

**Does sandbox cost anything?**
No. Sandbox is free, indefinitely, within the testing caps.

**Can I test the payment flow without being charged?**
Yes. A sandbox workspace runs checkout against Paddle's sandbox, which accepts only Paddle **test cards** (for example `4242 4242 4242 4242`) and never charges real money. Real cards are billed only after you go live. Lira selects the Paddle environment automatically from the workspace, so nothing to configure. Details: [Testing payments safely in sandbox](/getting-started/plans-and-billing#testing-payments-safely-in-sandbox).

**Can customers tell my widget is in sandbox?**
Yes — the widget shows a SANDBOX badge while the workspace is in sandbox. That's deliberate: it keeps test surfaces clearly marked and is one of the reasons production launches should go live.

**Will my Knowledge Base survive going live?**
Yes. Knowledge Base pages and documents are kept. Only sandbox *conversation* data is subject to the 30-day retention window.

**I hit a sandbox cap mid-test. What are my options?**
Either go live (your plan's volume applies immediately) or request a sandbox extension from **Settings → Subscription** (up to 2 granted per month). Caps also reset at the start of each month.

**Who can flip the environment switch?**
Org owners and admins, from **Settings → Support**. The confirmation requires typing the organisation name, so it can't happen by accident.
