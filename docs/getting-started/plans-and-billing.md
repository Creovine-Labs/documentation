---
id: plans-and-billing
title: Plans & Billing
sidebar_label: Plans & Billing
---

# Plans & Billing

Lira has four plans. Every plan includes **unlimited team seats** — you pay
for the AI's work, never per agent.

| | Free | Pro | Scale | Enterprise |
|---|---|---|---|---|
| Base price | $0 | $29/mo | $99/mo | Custom |
| Conversations included / mo | 250 | 2,000 | 12,000 | Volume |
| Overage per extra 1,000 | — | $12 | $8 | Custom |
| Languages | 2 | 5 | 5 | 5+ |
| WhatsApp Business API | — | — | ✓ | ✓ |
| Multiple domains | — | — | ✓ | ✓ |
| "Powered by Lira" removed | — | ✓ | ✓ | ✓ |
| Priority support | — | — | ✓ | ✓ |
| Advanced analytics & exports | — | — | ✓ | ✓ |

A **conversation** is one complete chat session between a visitor and the
agent — not one per message. WhatsApp Business API conversations additionally
carry Meta's per-conversation fees, billed on top of your plan.

## How your plan is set

Lira is invite-only. The plan you agreed with the Lira team is attached to
your invitation — when you sign up, your organization starts on exactly that
plan, with its limits and features applied automatically.

## Sandbox first, then live

New organizations start in the free **sandbox** environment: every feature
is unlocked for testing, real outbound sends are suppressed, and sandbox
testing caps apply instead of your plan's limits. Your plan — and billing —
takes effect when you deliberately go live from the Environment card in
**Settings → Support**. See
[Sandbox and going live](/platform/customer-support/sandbox-and-going-live)
for the caps, the extension process, and exactly what changes at the switch.

## Viewing your plan and usage

**Settings → Subscription** shows your current plan, its entitlements, your
launch status (sandbox or live), and live usage for the month. While in
sandbox, the usage bars track the sandbox testing caps (conversations, AI
replies, and LLM calls); once live, they track your plan's included volume.
Usage counters reset on the first of each month (UTC).

## Changing plans

From **Settings → Subscription**, pick the plan you want and select
**Request change**. The Lira team reviews and applies it — you'll see the
pending request in the same place and can cancel it before it's decided.

A few rules around requests:

- **Only org owners and admins can request changes.** Members see the plan
  and usage read-only, with a note to ask an org admin for changes.
- **One pending request at a time.** While a plan change (or sandbox
  extension) is awaiting review, new requests are disabled until it is
  decided or cancelled.
- **Up to 3 requests per month.** Requests beyond that are refused —
  contact the Lira team if you need a manual exception.
- **Sandbox extensions are their own request type**, made from the same
  page while you're in sandbox, and capped at 2 granted per month. See
  [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

- **Upgrades** take effect as soon as they're approved: limits are raised
  immediately and newly included features (for example the WhatsApp channel
  on Scale) unlock right away.
- **Downgrades** work in two parts. Features not included in the new plan
  lock as soon as the change is applied — WhatsApp real message sending is
  turned off immediately (so you never accrue Meta fees on a plan that
  doesn't include the channel), though your WhatsApp configuration is kept
  in case you upgrade again. Usage limits are gentler: if you've already
  used more this month than the new plan includes, your current limits stay
  in place until your next monthly reset, when the lower limits take
  effect.

## What happens at your limit

When you reach your included conversation volume, behavior depends on plan:
paid plans continue serving conversations and meter overage at the plan's
per-1,000 rate; the Free plan pauses AI replies until the monthly reset.

## Billing

Invoicing is currently handled directly by the Lira team alongside plan
approval. Automated billing via Paddle is on the roadmap; your plan and
usage data are already tracked per organization, so the transition will not
change your limits or history.
