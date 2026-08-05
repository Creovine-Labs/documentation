---
slug: /platform/customer-support/developer-api
sidebar_position: 10
title: Developer API keys & CLI
description: Automate Lira from your own backend or CI — create a scoped API key, connect MCP tools, and mint native mobile support sessions.
---

# Developer API keys & CLI

For teams that want to **script Lira** instead of clicking through the dashboard. Any member of the organization can create a scoped API key, and your engineers use it with the Lira CLI or the REST API to connect [MCP tools](/platform/customer-support/mcp), approve them, and mint support sessions for your customers from your backend.

## Create a key

**Any member** of the organization can create a key in **Settings → Support → Developers → New key** — you do not need to be an owner or admin. Developers usually aren't org admins, so requiring it only blocked the people doing the integration.

1. Give it a name and pick only the permissions it needs.
2. Optionally set an expiry (defaults to never).
3. **Copy the key when it is shown** — it is displayed once and cannot be retrieved again (only revoked).
4. Use it as the `LIRA_API_KEY` environment variable. Keep it **server-side**; never ship it in a mobile app or browser.

## Permissions (scopes)

| Scope | Grants |
|---|---|
| `mcp:read` | Read your MCP server config and discovered tools. |
| `mcp:write` | Connect, approve, enable, and remove MCP tools. |
| `sessions:mint` | Start a native support session as any of your customers. **High privilege** — keep this key on your backend only and revoke it if it leaks. |
| `support:read` / `support:write` | *Reserved.* Support **config, tickets, and inbox** are managed in the dashboard today — these scopes exist for a future config-over-API surface and don't grant anything yet. |

## Use the CLI

```bash
npm i -g @liraintelligence/support
export LIRA_API_KEY=lira_sk_…

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
