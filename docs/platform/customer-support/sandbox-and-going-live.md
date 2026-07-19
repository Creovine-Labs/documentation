---
sidebar_position: 2
title: Sandbox and going live
description: What the free sandbox includes, the testing caps that apply, and exactly what changes the moment you switch your workspace live.
---

# Sandbox and going live

Every new Lira organisation starts in **sandbox** — a free environment where you can test the entire product before paying anything. When you're ready, you flip the workspace to **live** from the Environment card at the top of **Settings → Support**. That switch is the commercial moment: your plan's limits apply and your billing period starts.

---

## What sandbox includes

Sandbox is built so you can evaluate everything, not a cut-down trial:

- **Every feature is unlocked**, regardless of the plan you were invited on. WhatsApp configuration, tool packs, branding options — a Free-invited org can fully evaluate Scale-level behaviour before committing.
- **Real-world side effects are suppressed.** Outbound emails and WhatsApp messages are dry-run: you see exactly what Lira *would* send (previewed in the dashboard), but nothing reaches a real inbox or phone. Integrations that would mutate live third-party systems (for example the Stripe tool pack, and real WhatsApp sends) stay blocked until you go live.
- **A SANDBOX badge is visible.** The widget shows a SANDBOX pill in its header, and the dashboard shows a sandbox indicator, so nobody mistakes test traffic for production support.

Two things stay locked even in sandbox: real WhatsApp message sending (requires a live workspace on Scale or above, because it accrues Meta fees) and the go-live switch itself, which is a deliberate, confirmed step.

## Sandbox testing caps

Sandbox is free, so a fixed set of monthly testing caps applies to every sandbox org (they replace plan limits while you're in sandbox):

| Cap | Default |
|---|---|
| Conversations per month | 500 |
| AI replies per month | 500 |
| Knowledge Base size | 200 web pages / 25 documents |

Caps reset monthly, like plan limits. If you hit one, the widget and dashboard show a friendly message — testing pauses for the rest of the month unless you go live or request an extension. Sandbox conversation data is also retained for 30 days (Knowledge Base content and documents are kept until you delete them).

You can watch your sandbox usage on **Settings → Subscription**, which shows live bars for conversations, AI replies, and LLM calls against the caps.

### Requesting a sandbox extension

Need more room to finish testing? On **Settings → Subscription**, click **Request sandbox extension**. The Lira team reviews the request; on approval your caps are raised for the month. A maximum of **2 extension requests per month** are granted per organisation. Only org owners and admins can request extensions, and only one request (extension or plan change) can be pending at a time.

---

## Going live

When your integration is ready, open **Settings → Support** and use the **Environment card** above the tabs:

1. Click **Production** on the Sandbox / Production switch.
2. A confirmation dialog shows your plan, its price, and its included monthly volume, and states plainly: going live starts your billing period.
3. Type your organisation's name to confirm, then click **Go live**.

The moment you confirm:

- **Your plan's limits replace the sandbox caps.** Included conversation and AI-reply volumes come from the plan you agreed with the Lira team (see [Plans & Billing](/getting-started/plans-and-billing)).
- **Your billing period starts.** The Lira team is notified and invoicing begins — no org ever goes billable silently.
- **Real outbound turns on.** Emails actually send, and plan-gated features (such as real WhatsApp sends on Scale+) become available.
- **Plan feature gates become authoritative.** In sandbox everything was unlocked for testing; live, your plan decides which features you have.

The SANDBOX badge disappears from the widget and the Environment card shows **LIVE**.

### Returning to sandbox

The switch also works in reverse — for example to roll back during an incident. Switching back to sandbox re-suppresses real outbound sends, restores the SANDBOX badge, and re-applies the testing caps. It does not undo the fact that you went live; contact the Lira team about billing implications before rolling back a live workspace.

---

## Limits, downgrades, and billing

Once live, your usage is governed by your plan:

- What happens when you reach your included volume, how upgrades and downgrades apply, and how invoicing works are covered in [Plans & Billing](/getting-started/plans-and-billing).
- Plan changes are requested from **Settings → Subscription** and reviewed by the Lira team. On a downgrade, paid features lock when the change is applied, while usage caps above the new plan's limits stay in place until your next monthly reset.

---

## Frequently asked questions

**Does sandbox cost anything?**
No. Sandbox is free, indefinitely, within the testing caps.

**Can customers tell my widget is in sandbox?**
Yes — the widget shows a SANDBOX badge while the workspace is in sandbox. That's deliberate: it keeps test surfaces clearly marked and is one of the reasons production launches should go live.

**Will my Knowledge Base survive going live?**
Yes. Knowledge Base pages and documents are kept. Only sandbox *conversation* data is subject to the 30-day retention window.

**I hit a sandbox cap mid-test. What are my options?**
Either go live (your plan's volume applies immediately) or request a sandbox extension from **Settings → Subscription** (up to 2 granted per month). Caps also reset at the start of each month.

**Who can flip the environment switch?**
Org owners and admins, from **Settings → Support**. The confirmation requires typing the organisation name, so it can't happen by accident.
