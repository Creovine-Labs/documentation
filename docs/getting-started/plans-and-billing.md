---
id: plans-and-billing
title: Subscription & Billing
sidebar_label: Subscription & Billing
---

# Subscription & Billing

Lira has four plans. Every plan includes **unlimited team seats** — you pay
for the AI's work, never per agent.

| | Free | Pro | Scale | Enterprise |
|---|---|---|---|---|
| Base price | $0 | $29/mo | $99/mo | Custom |
| Conversations included / mo | 250 | 2,000 | 12,000 | Volume |
| Overage per extra 1,000 | — | $12 | $8 | Custom |
| Languages | 2 | 5 | 5 | 5+ |
| WhatsApp Business API | — | — | ✓ | ✓ |
| Localized voice | — | — | ✓ | ✓ |
| Custom brand voice | — | — | — | ✓ |
| Multiple domains | — | — | ✓ | ✓ |
| "Powered by Lira" removed | — | ✓ | ✓ | ✓ |
| Priority support | — | — | ✓ | ✓ |
| Advanced analytics & exports | — | — | ✓ | ✓ |

A **conversation** is one complete chat session between a visitor and the
agent — not one per message. WhatsApp Business API conversations additionally
carry Meta's per-conversation fees, billed on top of your plan.

**Localized voice** lets the agent answer out loud in a natural voice matched
to your market, on **Scale** and **Enterprise** (enabled during onboarding;
voice usage is metered per minute). **Enterprise** can also commission a
**custom brand voice**, in their own voice and tone, cloned with consent. See
[Localized Voice](/platform/customer-support/voice) for details.

## How your plan is set

Lira is invite-only. The plan you agreed with the Lira team is attached to
your invitation — when you sign up, your organization starts on exactly that
plan, with its limits and features applied automatically.

## Sandbox first, then live

New organizations start in the free **sandbox** environment: every feature
is unlocked for testing, real outbound sends are suppressed, and sandbox
testing caps apply instead of your plan's limits. Your plan — and real
billing — takes effect when you deliberately go live from the Environment
card in **Settings → Support**. See
[Sandbox and going live](/platform/customer-support/sandbox-and-going-live)
for the caps, the extension process, and exactly what changes at the switch.

Sandbox is also where you rehearse payments safely: a sandbox workspace can
run the whole checkout with Paddle **test cards** and is never charged real
money. See [Testing payments safely in sandbox](#testing-payments-safely-in-sandbox).

## Testing payments safely in sandbox

Paddle runs in one of two environments, and Lira picks the right one for you
**automatically, per workspace**, from the workspace's own environment:

- A **sandbox** workspace transacts against Paddle's sandbox. Checkout works
  end to end, but only Paddle **test cards** are accepted and **no real money
  moves**. Use the standard Paddle sandbox test card:

  ```
  Card number   4242 4242 4242 4242
  Expiry        any future date
  Security code any 3 digits
  ```

- A **live** workspace transacts against Paddle's live environment and bills
  **real payment cards**.

You never choose the environment on the checkout screen — it follows the
workspace. This means you can practise subscribing, upgrading, and going live
in sandbox as many times as you like without a real charge, then repeat the
exact same flow for real once you go live.

## Viewing your subscription and usage

**Settings → Subscription** shows your current plan, its entitlements, your
launch status (sandbox or live), billing status, and live usage for the month.
While in sandbox, the usage bars track the sandbox testing caps
(conversations, AI replies, and LLM calls); once live, they track your plan's
included volume. Usage counters reset on the first of each month (UTC).

Paid subscriptions are processed through **Paddle**, Lira's authorized reseller
and Merchant of Record. Paddle handles checkout, payment collection, tax/VAT,
receipts, invoices, payment-method updates, and card security. Lira never
stores card details.

## Changing plans

All plan changes start from **Settings → Subscription**. How a change is
applied depends on which plan you pick:

- **Pro and Scale are self-serve.** Pick the plan and select **Subscribe**
  (or **Switch to this plan** if you already have a subscription). A **Paddle
  Checkout** overlay opens; on payment your plan is applied automatically —
  Lira applies it from Paddle's verified webhook, not from the browser
  returning from checkout. In sandbox this checkout uses Paddle test cards
  (no real charge); once live it bills a real card.
- **Enterprise and downgrades to Free are reviewed.** Select **Request
  change**; the Lira team reviews and applies it. You'll see the pending
  request in the same place and can cancel it before it's decided.

A few rules apply to the **reviewed** requests (Enterprise, downgrade to
Free, and sandbox extensions) — self-serve Pro/Scale checkout is immediate
and not subject to them:

- **Only org owners and admins can change plans.** Members see the plan
  and usage read-only, with a note to ask an org admin for changes.
- **One pending request at a time.** While a reviewed change (or sandbox
  extension) is awaiting review, new requests are disabled until it is
  decided or cancelled.
- **Up to 3 requests per month.** Requests beyond that are refused —
  contact the Lira team if you need a manual exception.
- **Sandbox extensions are their own request type**, made from the same
  page while you're in sandbox, and capped at 2 granted per month. See
  [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

How the change lands once applied:

- **Upgrades** take effect as soon as they're applied (immediately on a
  successful Pro/Scale checkout): limits are raised right away and newly
  included features (for example the WhatsApp channel on Scale) unlock.
- **Downgrades** work in two parts. Features not included in the new plan
  lock as soon as the change is applied — WhatsApp real message sending is
  turned off immediately (so you never accrue Meta fees on a plan that
  doesn't include the channel), though your WhatsApp configuration is kept
  in case you upgrade again. Usage limits are gentler: if you've already
  used more this month than the new plan includes, your current limits stay
  in place until your next monthly reset, when the lower limits take
  effect.

## What happens at your limit

When you reach your included conversation volume, behavior depends on your
plan:

- **Free** workspaces pause AI replies until the monthly reset or a plan
  change.
- **Paid** workspaces (live Pro and Scale) keep answering past the included
  volume. The excess is metered and billed as **overage** on top of your base
  plan — **$12 per extra 1,000 conversations on Pro** and **$8 per extra
  1,000 on Scale**. Overage is reconciled per billing period and charged to
  the payment method on file through Paddle, separately from your base
  subscription.

Overage only applies to **live** paid workspaces. Sandbox stops at the
sandbox testing caps instead of billing overage. WhatsApp Business API
traffic may also carry Meta's own conversation fees on top of your Lira plan.

## Billing

Paddle is the billing system for Pro and Scale subscriptions:

- **Checkout:** subscribing to Pro or Scale — or going live on a paid plan —
  opens a **Paddle Checkout overlay** that collects payment. On success the
  plan applies automatically.
- **Merchant of Record:** Paddle handles card processing, sales tax/VAT,
  invoices, and receipts. Lira never sees or stores card details.
- **Manage billing:** once a subscription exists, **Settings → Subscription**
  shows a **Manage billing** button that opens the Paddle customer portal —
  update your card, view invoices and receipts, and cancel the subscription
  there.
- **Subscription status:** active, past due, canceled, cancel-at-period-end,
  and the next-billing (or access-until) date are tracked on your Lira tenant
  and shown on **Settings → Subscription**.
- **Entitlements:** Lira applies plan limits and feature access only from a
  verified Paddle payment/subscription event, never from the browser
  returning from checkout.

Enterprise plans can still use a custom contract or manual billing arrangement
when that is part of the agreement.

### Past-due and canceled subscriptions

If Paddle marks a subscription as past due, Lira keeps the subscription status
visible in **Settings → Subscription** so an owner or admin can update the
payment method. If the subscription is canceled, paid plan access ends based on
the account's billing terms and the workspace may return to Free-level access.
