---
slug: /platform/customer-support/test-and-live-mode
sidebar_position: 3
title: Sandbox and production keys
description: Run your staging and production environments against the same Lira workspace at the same time — two key sets, separate quota, no real sends from test.
keywords:
  - test mode
  - live mode
  - staging
  - publishable key
  - secret key
  - lira_sk_test
  - lira_pk_live
  - environments
---

# Sandbox and production keys

Your staging environment and your production environment can point at the **same Lira workspace at the same time**, without staging ever touching real customers or real quota.

The rule is simple: **the key decides the environment.**

```
staging backend     →  lira_sk_test_…   →  sandbox traffic
production backend  →  lira_sk_live_…   →  production traffic
staging website     →  lira_pk_test_…   →  sandbox traffic
production website  →  lira_pk_live_…   →  production traffic
```

:::note Why the keys say `test` and `live`
`test` = sandbox, `live` = production — the same two environments, nothing more.
The key prefixes follow the convention your engineers already know from Stripe,
Paystack and Flutterwave; the dashboard uses the plainer words. If you can read
`lira_sk_test_`, you are holding a sandbox key.
:::

Both key sets are valid simultaneously. You never flip a switch to move between them, and you never need a second Lira workspace.

---

## The four keys

| Key | Secret? | Where it belongs |
|---|---|---|
| `lira_sk_test_…` | **Secret** — server only | Your staging / local backend (sandbox) |
| `lira_sk_live_…` | **Secret** — server only | Your production backend |
| `lira_pk_test_…` | Publishable — safe in HTML | Your staging website or app (sandbox) |
| `lira_pk_live_…` | Publishable — safe in HTML | Your production website or app build |

Find all four in **Settings → Support → API keys**. Secret keys are shown once at creation; publishable keys can be copied any time and rotated per mode.

:::danger Never ship a secret key to a browser or a mobile binary
`lira_sk_…` keys belong on your server. Publishable `lira_pk_…` keys are the ones designed to be public.
:::

:::info Live keys stay inert until your workspace goes live
You can create live keys and wire up your production config **before** going live — nothing real happens until the workspace itself is live. Until then, live keys behave exactly like test keys: no real emails, Slack, Linear or webhooks, and nothing billed. Every surface tells you when this is happening (`LIVE_KEY_NOT_ACTIVE` in the session-mint response and the widget config, and a warning in `lira status`).

The day you go live, those keys start working — no redeploy, no key swap. Going live remains the only way to turn on real sends, so nobody can bypass it by minting a live key.
:::

## What sandbox guarantees

| | Sandbox | Production |
|---|---|---|
| Quota consumed | Its own test allowance | Your plan's volume |
| Customer/team emails | Suppressed, never sent | Sent |
| Slack / Linear / webhooks | Suppressed | Delivered |
| Appears in the live inbox | No — only under **Test data** | Yes |
| Billing | Never | Per your plan |

Two extra guarantees worth knowing:

- **Threads are isolated.** A test embed cannot resume, read, hide, or act on a live conversation — even for the same signed-in customer — and the reverse is equally blocked. Staging can never write into a real customer's support thread.
- **No real outbound notification is sent in test.** Customer replies, ticket lifecycle emails, team alerts, Slack, Linear, and webhooks are all suppressed. Use the dashboard's Test data view and ticket/event logs to verify the flow.

## Sandbox still has limits

Test traffic is free, so it is capped. **These caps apply to test traffic whether or not your workspace is live** — a live workspace running a staging integration is still capped on the test side.

| Cap | Default |
|---|---|
| Sandbox conversations per month | 500 |
| Sandbox AI replies per month | 500 |
| Sandbox AI calls per month (all pipeline stages) | 2,000 |
| Rate | 10 AI replies per minute |
| Knowledge Base | 200 pages / 25 documents (shared across modes) |

Caps reset monthly. Hitting one pauses **test** traffic only — your live customers are never affected by a blown test cap, and a blown live quota never throttles your staging tests. Test conversation data is retained for 30 days.

Need more room while you build? **Settings → Subscription → Request sandbox extension** (owners and admins, up to 2 per month). See [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

:::note Sandbox is not a free tier for production traffic
Sandbox exists for building and QA. It shows a SANDBOX badge to end users, suppresses every real send, and is capped — so it can't quietly serve your real customers. Real customers need live keys and a live workspace.
:::

## Switching in the dashboard

The topbar shows **SANDBOX** or **PRODUCTION**. Click it and pick the other one. The inbox, tickets, analytics and dashboard counts all follow, and a ticket you create by hand is filed in the environment you are in.

Before you have gone live there is only sandbox, so picking **Production** opens the go-live flow — plan, price and payment — rather than switching. You cannot end up looking at production without having moved there deliberately.

Once live, the switch works both ways: a production workspace can drop into sandbox to check a staging integration. That choice is yours alone — a teammate can stay in production while you debug.

---

## Already have a single key? Nothing breaks

If you integrated before test and live keys existed, **you do not have to change anything today.**

- Your existing `lira_sk_…` key **keeps working exactly as it does now.** It is not converted, and it does not stop working. It follows your **workspace environment**: while your workspace is in sandbox it behaves as test; when you take the workspace live it behaves as live. That is precisely the behaviour you have today.
- Your existing embed (`data-org-id` with no publishable key) also keeps following the workspace environment, exactly as before.
- The dashboard labels these keys **Legacy** so you can spot them.

**What you gain by moving:** a legacy key can only ever be in one mode at a time — the workspace's. The moment you want staging and production running at once, you need explicit keys.

### Migrating, at your pace

1. Create a **test** key and a **live** key in **Settings → Support → API keys → New key**.
2. Point staging at the test key and production at the live key.
3. Copy the matching publishable keys into your staging and production embeds.
4. Once nothing is using the legacy key (check **Last used** in the dashboard), revoke it.

There is no deadline and no forced cut-over.

---

## Mobile apps

Mobile works the same way, and **the change is entirely in your backend** — your app code does not change.

Your app never holds a Lira key; it calls *your* server for a session token ([mobile: the backend part](/platform/customer-support/mobile-backend)). Whichever key your backend mints with sets the mode, and **the session stays in that mode for its whole life**:

```
Your staging server    →  mints with lira_sk_test_…  →  test session  →  test conversation
Your production server →  mints with lira_sk_live_…  →  live session  →  live conversation
```

So:

- **Backend engineer:** use the test key in your staging environment's config and the live key in production. That's the whole change — same endpoint, same request body.
- **Mobile engineer:** nothing to change. The `ws_url` your backend returns already carries the right mode. If you want to show it, the mint response includes `"mode": "test" | "live"` — handy for a debug banner in your staging build.
- **TestFlight / internal builds** pointed at your staging backend produce test traffic automatically, so QA sessions never reach the live inbox or your plan's quota.

## Websites and web apps

Add your publishable key to the embed:

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-publishable-key="lira_pk_live_YOUR_KEY"
  async></script>
```

Use `lira_pk_test_…` in your staging/preview deploys and `lira_pk_live_…` in production — most teams read it from the same environment variable that already distinguishes their builds:

```js
// Next.js / Vite / CRA — one variable, two values
window.LiraWidgetConfig = {
  orgId: 'YOUR_ORG_ID',
  publishableKey: process.env.NEXT_PUBLIC_LIRA_PUBLISHABLE_KEY,
}
```

If you sign in your users with HMAC identity verification, that is unchanged — the widget secret is per workspace and works in both modes.

Voice calls launched from the widget inherit the same publishable key mode. A call from your staging embed creates a test voice conversation and stays out of live quota, live inbox, live notifications, and live post-call actions.

### If the key is wrong

An embed whose publishable key isn't recognised — a typo, a key from another workspace, or one you rotated out — is forced into **test mode**, never live. A broken staging deploy must not silently become live traffic. The widget logs this to the browser console:

```
INVALID_PUBLISHABLE_KEY — The publishable key on this embed was not recognised
for this organization. Running in TEST mode until it is fixed.
```

Fix it by copying the current key from **Settings → Support → API keys → Publishable keys**.

## Server-to-server API

Set whichever key matches the environment your service is running in:

```bash
# staging
export LIRA_API_KEY=lira_sk_test_…

# production
export LIRA_API_KEY=lira_sk_live_…
```

Read endpoints that return org-wide lists accept an optional `mode` parameter:

```bash
curl "https://api.creovine.com/lira/v1/support/inbox/orgs/org_xxx?mode=test" \
  -H "Authorization: Bearer $LIRA_API_KEY"
```

Omit it and you get everything, which is what integrations written before test/live mode receive.

## Switching modes from your terminal

You do not need the dashboard. The CLI has both switches, and they are
deliberately different commands because they do different things:

```bash
npm i -g @liraintelligence/support

lira status          # org, mode, workspace — "what will my next command do?"
lira mode            # which mode am I in, and which keys are saved?
lira mode live       # switch the mode
lira mode test
```

Save each key once and switching is a single word afterwards — no editing
environment variables, which is the usual way a staging shell ends up pointed at
production:

```bash
lira keys use --api-key=lira_sk_test_...   # mode is read from the prefix
lira keys use --api-key=lira_sk_live_...
lira keys create --mode=live --name="CI deploy"
```

`lira status` is the one to run when in doubt:

```
API        https://api.creovine.com
Org        org-xxxx
CLI mode   LIVE
Key        lira_sk_live_org-x…9f2c
Workspace  LIVE

▶  LIVE: traffic from this key reaches real customers and counts against your plan.
```

### Going live from the terminal

```bash
lira env show        # is the workspace live?
lira env go-live     # asks you to type the organization name, same as the dashboard
lira env sandbox     # go back; asks for confirmation
```

`lira env go-live` is the same commercial switch as the dashboard, so it asks
for the same typed confirmation. If your plan needs a subscription and there
isn't one, the CLI stops and sends you to the dashboard — Paddle checkout needs
a browser.

:::info Two switches, on purpose
`lira mode` changes **which key you use**. `lira env` changes **the workspace**.
Mixing them up is the mistake worth preventing, so they never share a command.
:::

### What stops you shipping the wrong one

- **Test is the default.** A fresh shell is in test mode until you say otherwise.
- **Mode/key mismatch is refused, not guessed.** Using a `lira_sk_live_` key while the CLI is in test mode (or the reverse) fails with the exact command to fix it, instead of quietly doing the opposite of what you meant.
- **Live keys are inert until the workspace is live.** You can create production keys and wire up production config *before* going live and nothing real happens: they behave as test keys, and every surface says so. The day you run `lira env go-live`, they start working — no redeploy.
- **`lira keys list` shows the mode** of every key, so an unlabeled key can't hide.
- **The dashboard agrees with the terminal.** Both read the same workspace state, so `lira status` and the topbar switch can never disagree.

## Going live doesn't disturb your test setup

Taking your workspace live turns on real sends for **live-key** traffic and starts billing. Your test keys keep behaving exactly as they do now: still capped, still suppressed, still out of the live inbox.

Usage you accrued before going live is reclassified as test usage, so your first live month starts with a clean plan quota.

## Related

- [Sandbox and going live](/platform/customer-support/sandbox-and-going-live) — what going live changes commercially
- [Developer API keys & CLI](/platform/customer-support/developer-api) — creating and scoping keys
- [Mobile: the backend part](/platform/customer-support/mobile-backend)
- [Web SDK](/platform/customer-support/web-sdk) · [Widget](/platform/customer-support/widget)
