---
slug: /platform/customer-support/developer-api
sidebar_position: 10
title: Developer API keys & CLI
description: Automate Lira from your own backend or CI — create a scoped API key, connect MCP tools, and mint native mobile support sessions.
---

# Developer API keys & CLI

For teams that want to **script Lira** instead of clicking through the dashboard. Any member of the organization can create a scoped API key, and your engineers use it with the Lira CLI or the REST API to connect [MCP tools](/platform/customer-support/mcp), approve them, and mint support sessions for your customers from your backend.

## Test vs live keys

Every Lira key carries a **mode**, and both modes are valid at the same time. One organization, one dashboard, two key sets — so your staging environment and your production environment can point at the same Lira workspace without ever mixing.

| Key | Where it belongs | What it does |
|---|---|---|
| `lira_sk_test_…` | staging / local backend | **Secret.** Test traffic: its own quota, no real emails, Slack, Linear or webhook deliveries. |
| `lira_sk_live_…` | production backend | **Secret.** Real customers: real sends, your plan's limits, billing. |
| `lira_pk_test_…` | staging website / app | **Publishable** — safe in your HTML. Marks that embed's traffic as test. |
| `lira_pk_live_…` | production website / app | **Publishable** — safe in your HTML. Real customer traffic. |

What test mode guarantees:

- **Separate quota.** Test conversations and AI replies never consume the volume your live plan is paying for, and hitting a test cap never throttles real customers.
- **No real-world side effects.** Outbound email, Slack, Linear and webhook deliveries are suppressed and previewed instead.
- **Out of the live inbox.** Test conversations and tickets are only visible when the dashboard is switched to **Sandbox** (topbar switch), so a staging integration never pollutes the queue your team works.
- **Isolated threads.** A test embed cannot resume, read, or hide a live conversation, and vice versa — even for the same customer.

Switch what the dashboard shows with the **SANDBOX / PRODUCTION** control in the topbar.

:::caution Going live does not disturb your test setup
Going live turns on real sends for **live-key** traffic. Your test keys keep behaving exactly as before.
:::

### If a publishable key is wrong

An embed whose publishable key isn't recognised — a typo, the wrong organization, or a key you rotated out — is forced into **test mode**, never live. That is deliberate: a broken staging deploy must not become live traffic. The widget logs an `INVALID_PUBLISHABLE_KEY` warning to the browser console with the fix.

An embed that sends **no** publishable key at all (every embed created before test/live keys existed) keeps following your workspace environment, exactly as it did before. Nothing you already shipped breaks.

## Create a key

**Any member** of the organization can create a key in **Settings → Support → API keys → New key** — you do not need to be an owner or admin. Developers usually aren't org admins, so requiring it only blocked the people doing the integration.

1. Give it a name and pick the **mode** — Test (the default) or Live.
2. Pick only the permissions it needs.
3. Optionally set an expiry (defaults to never).
4. **Copy the key when it is shown** — it is displayed once and cannot be retrieved again (only revoked).
5. Use it as the `LIRA_API_KEY` environment variable. Keep it **server-side**; never ship it in a mobile app or browser.

Publishable keys live in the same place, under **Publishable keys** — copy them straight into your embed, and rotate either mode independently. Rotating the **live** key breaks production embeds until you redeploy.

Keys created before test/live mode shipped are shown as **Legacy**. They keep working and follow your workspace environment. Replace them with explicit test/live keys when convenient.

## Permissions (scopes)

| Scope | Grants |
|---|---|
| `mcp:read` | Read your MCP server config and discovered tools. |
| `mcp:write` | Connect, approve, enable, and remove MCP tools. |
| `sessions:mint` | Start a native support session as any of your customers. **High privilege** — keep this key on your backend only and revoke it if it leaks. |
| `support:read` | Read support configuration, knowledge-base status, and list knowledge-base documents. |
| `support:write` | Activate support, change settings, crawl sites, and **manage** knowledge-base documents — upload, reprocess, import and delete. Enough to provision *and maintain* a workspace entirely from CI. |

Scopes are enforced on every route that declares them: a key holding only
`sessions:mint` is rejected with `401` and
`Developer key is missing required scope: support:write` on knowledge-base and
config endpoints. Grant the narrowest set that works — a session-minting key on
a mobile backend should carry `sessions:mint` alone.

### Managing knowledge-base content from CI

`support:read` and `support:write` cover the full document lifecycle, so content
can be corrected or replaced rather than only added:

```bash
# list what is there
curl "https://api.creovine.com/lira/v1/orgs/$ORG/documents" \
  -H "Authorization: Bearer $LIRA_API_KEY"

# replace a document
curl -X DELETE "https://api.creovine.com/lira/v1/orgs/$ORG/documents/$DOC_ID" \
  -H "Authorization: Bearer $LIRA_API_KEY"
curl -X POST "https://api.creovine.com/lira/v1/orgs/$ORG/documents" \
  -H "Authorization: Bearer $LIRA_API_KEY" -F "file=@handbook.md"
```

Deleting a document that no longer exists returns `404`, so a re-run of a
cleanup job is safe.

A session minted with a test key is a **test session for its whole life**, no matter what your workspace environment says. That is how your staging backend produces test traffic while production runs live on the same organization.

## Use the CLI

The CLI can switch between test and live itself — you never have to open the
dashboard to change which mode you're working in.

```bash
npm i -g @liraintelligence/support

lira keys use --api-key=lira_sk_test_…   # save each key once
lira keys use --api-key=lira_sk_live_…
lira mode test        # switch mode
lira mode live
lira status           # org, mode, workspace, and what that means

lira env go-live      # the workspace switch (real sends + billing), from the terminal
lira env sandbox
```

Using a live key while the CLI is in test mode (or the reverse) is **refused**
with the command to fix it, and a live key does nothing real until the workspace
itself has gone live. Full detail: [Test and live mode](/platform/customer-support/test-and-live-mode#switching-modes-from-your-terminal).

`LIRA_API_KEY` still works and overrides the saved key, for CI:

```bash
# Staging
export LIRA_API_KEY=lira_sk_test_…

# Production
# export LIRA_API_KEY=lira_sk_live_…

# Connect and govern an MCP server
lira mcp connect --org-id=org_xxx --endpoint=https://mcp.yourcompany.com/mcp
lira mcp discover --org-id=org_xxx
lira mcp approve --org-id=org_xxx --source-name=order.cancel --risk=customer_confirm
lira mcp enable --org-id=org_xxx

# From your backend, right after the customer authenticated:
lira sessions mint --org-id=org_xxx --email=customer@example.com
```

## Or call the API

Every CLI action maps to a REST endpoint. Authenticate with your key as a bearer token.

```bash
curl -X POST https://api.creovine.com/lira/v1/support/sessions/orgs/org_xxx/mint \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "customer": { "email": "customer@example.com" }, "ttlSeconds": 900 }'
```

The response includes a short-lived session token plus the `ws_url` and `rest_base_url` your native client uses to open support.

## How session minting stays safe

- **Your backend is the trusted party** — it vouches for its own logged-in customer, the same way the widget verifies [identified visitors](/platform/customer-support/web-sdk).
- Tokens are **short-lived** (up to one hour) and can be revoked.
- For a high-risk action, mint a **step-up proof** right after the customer re-authenticates (PIN, biometric, or OTP).
- Requests are **rate-limited per key**, and each signed request can only be used once (**replay-protected**).
- Keys are stored **hashed**, scoped to one org, and rejected if used against a different org.

## Three ways to integrate

| Surface | For |
|---|---|
| **Dashboard** | Human admins — click-through setup in Settings → Support. |
| **CLI** | Your engineers — one-off and scripted setup from a terminal. |
| **API** | Your servers / CI — programmatic automation with `LIRA_API_KEY`. |

## What each scope unlocks

Every scope below is enforced by the API — a key only does what its scopes allow.

| Scope | Lets the key… |
|---|---|
| `support:read` | Read support configuration and knowledge-base status |
| `support:write` | Activate support, update settings, crawl a site, upload documents |
| `mcp:read` | Read the MCP server config and discover tools |
| `mcp:write` | Connect, update or remove an MCP server and approve tools |
| `sessions:mint` | Mint a support session token for a logged-in customer |

### Set up an org from CI, no dashboard

`support:write` exists so provisioning can live in your pipeline:

```bash
ORG=org-xxxx; KEY=lira_sk_...

# 1. activate support
curl -X POST https://api.creovine.com/lira/v1/support/config/orgs/$ORG/activate \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{}'

# 2. configure it
curl -X PUT https://api.creovine.com/lira/v1/support/config/orgs/$ORG \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"greeting_message":"Hi! How can we help?","auto_reply_enabled":true}'

# 3. seed the knowledge base
curl -X POST https://api.creovine.com/lira/v1/orgs/$ORG/crawl \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"url":"https://yourcompany.com"}'
```

A key without the scope gets `401` — a `support:read` key cannot write.
