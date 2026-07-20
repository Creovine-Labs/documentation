---
sidebar_position: 2
title: Get an Account
description: Lira is concierge-onboarded. Here's how to start a conversation with our team, get provisioned, and have a working integration in days, not weeks.
---

# Get an Account

Lira is **not self-serve**. You can't sign up on the marketing site, type a credit card, and start using it the next minute. We've made that intentional choice because every customer's support footprint is different — different products, different volume, different rules about what an AI is allowed to say or do — and trying to abstract all of that into a sign-up form would either (a) over-promise and disappoint, or (b) under-promise and look generic. Neither is fair to you.

Instead, every account is provisioned by our team after a short conversation. Here's what that looks like.

## How signup works

### 1. Reach out

Go to **[liraintelligence.com](https://liraintelligence.com)** and click **Speak to an expert** (or **Book a demo**). You can also email us directly at **team@liraintelligence.com**.

Tell us, roughly:
- What product you support
- Where your support lives today (Zendesk, Intercom, an inbox, nothing yet)
- Roughly how many conversations per week
- Whether you want a chat widget, a full support page, both, or something custom

If you have a help center / docs site / KB URL, send that too. It helps us pre-scope before the call.

### 2. Short scoping call

We'll spend 20–30 minutes understanding what you actually need. Specifically:

- **What conversations Lira should handle** — refunds, password resets, plan changes, "how do I" questions, billing, account-specific support, all of the above?
- **What it absolutely should NOT do** — for example: never quote a price not on the public site, never modify a subscription without confirmation, always escalate anything that mentions a refund.
- **What in-product actions you want enabled** — e.g. cancel a sub, retry a payment, update a plan, generate an invoice — these are wired up using your existing APIs.
- **Who Lira talks to** — public visitors only, logged-in users only, or both (with different rules for each).
- **How you want it to look** — colors, greeting, position, voice, identity.

### 3. We configure your org

After the call we provision an **organization** for you on the Lira platform. That includes:

- Your Lira **org ID** + a unique widget secret (for signed-identity)
- A **plan tier** (Free / Pro / Scale / Enterprise) with the right usage limits — see [Subscription & Billing](/getting-started/plans-and-billing). New orgs start in the free [sandbox](/platform/customer-support/sandbox-and-going-live); paid billing begins only when you go live and complete the required Paddle-backed subscription flow
- The **integration surface** you chose (widget, full page, or both)
- An **invitation link** for your founder/owner account

You get the invite by email. One click → set a password → you land in the Lira dashboard with your org already set up.

### 4. Add your team

From the Lira dashboard, **Members** page, you can invite your teammates by email. Each gets a one-time, expiring invite link tied to their address. They click it, set a password, and they're in. No shared "join codes" — every invitation is scoped to a person and a role (admin or member).

For teammates who are already on the Lira platform under a different organization (e.g. a contractor working with multiple Lira customers), the invite attaches them to your org — they'll see both in their org switcher.

### 5. Activate & integrate

In the dashboard, **Support → Activate** walks through:

1. **Email setup** — choose a Lira-hosted support address (e.g. `support@your-company.lira.email`) or forward from your own domain.
2. **Knowledge base** — upload docs, paste a website URL for crawling, or connect Google Drive / GitHub for live sync. See [Knowledge Base](/knowledge-base/overview).
3. **Channel** — pick chat widget, full support page, or both. See [SDKs overview](/platform/customer-support/sdks).
4. **Test & go live** — chat with your own Lira in test mode, confirm it sounds right, then flip the toggle to live.

Most customers go from "got the invite" to "widget live on staging" in about a day.

## Need a second organization?

If you already have an account and want to spin up a separate org (different product line, different team, different billing), reach out to us again. We'll provision the new org under your existing email and you'll see both in your switcher.

The same rule applies for the same reason: every org has its own plan, its own limits, and usually its own context — we want to set that up with you, not after the fact.

## Want to talk to a real human first?

That's the whole point — this onboarding **is** the conversation. Email **team@liraintelligence.com** with one sentence about what you're trying to support, and we'll reply same-day with a calendar link.
