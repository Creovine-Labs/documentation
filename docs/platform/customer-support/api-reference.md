---
slug: /platform/customer-support/api-reference
sidebar_position: 16
title: API reference
description: Every endpoint a Lira API key can call — authentication, scopes, request and response shapes, and errors.
---

# API reference

The Lira REST API lets you drive support from your own backend: mint a signed support session for a logged-in customer, connect and govern an MCP server, and read the tool-call audit trail.

This page documents the **customer-facing API surface** — the endpoints your API key can reach. Internal platform and admin endpoints are not part of the public API and are not documented here.

**Base URL**

```
https://api.creovine.com/lira/v1
```

## Authentication

Send your API key as a bearer token:

```
Authorization: Bearer lira_sk_test_...   # staging
Authorization: Bearer lira_sk_live_...   # production
```

Keys are created by **any member** of the organization in **Settings → Support → API keys → New key**, shown once, and scoped to a single organization. Keep them server-side — a secret Lira API key must never reach a browser or a mobile binary. See [Developer API keys & CLI](/platform/customer-support/developer-api).

## Test and live mode

Every key carries a mode, and **both are valid at the same time** against the same organization:

| Prefix | Kind | Mode |
| --- | --- | --- |
| `lira_sk_test_` | secret | Test — own quota, outbound sends suppressed |
| `lira_sk_live_` | secret | Live — real sends, plan limits, billing |
| `lira_pk_test_` | publishable (browser/mobile embeds) | Test |
| `lira_pk_live_` | publishable (browser/mobile embeds) | Live |

The key decides the mode, not the organization — so a staging backend can hold a test key while production holds a live one. Test traffic gets its own quota, never triggers real outbound delivery, and stays out of the live inbox.

Keys minted before test/live mode have no mode segment (`lira_sk_…`). They keep working and follow the organization's environment.

**Live keys require a live workspace.** A `lira_sk_live_` / `lira_pk_live_` credential used before the organization has gone live is downgraded to test — the request succeeds, but nothing real is sent or billed, and the response carries:

```json
{
  "mode": "test",
  "warning": {
    "code": "LIVE_KEY_NOT_ACTIVE",
    "message": "This workspace has not gone live yet, so live keys still behave as test keys."
  }
}
```

This makes it safe to provision production keys ahead of your go-live date. Take the workspace live from the dashboard, or with `lira env go-live`.

Org-wide read endpoints accept an optional `mode` (or `environment`) query parameter:

```bash
curl "https://api.creovine.com/lira/v1/support/inbox/orgs/org_xxx?mode=test" \
  -H "Authorization: Bearer $LIRA_API_KEY"
```

Omit it and you get everything, which is what clients written before test/live mode receive.

## Scopes

A key carries an explicit scope set. A call missing the required scope fails with `403`.

| Scope | Grants |
| --- | --- |
| `mcp:read` | Read your MCP server config and the tool-call audit trail. |
| `mcp:write` | Create, update or delete your MCP server config; run tool discovery. |
| `support:read` | Read support configuration and knowledge-base status. |
| `support:write` | Activate support, change settings, crawl sites, upload knowledge-base documents. |
| `sessions:mint` | Mint and revoke customer support sessions. |

New keys default to `mcp:read` and `mcp:write`, and to **test** mode. Grant only what the integration needs.

---

## Sessions

A **support session** is a short-lived, signed token that authorizes one identified customer to talk to Lira. Your backend mints it after *you* have authenticated the user — Lira never sees your passwords or session cookies.

### Mint a session

```
POST /support/sessions/orgs/{orgId}/mint
```

Requires `sessions:mint`.

```bash
curl -X POST https://api.creovine.com/lira/v1/support/sessions/orgs/org_xxx/mint \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "email": "ada@customer.com",
      "name": "Ada Okafor",
      "externalCustomerId": "user_123"
    },
    "ttlSeconds": 3600
  }'
```

Returns a session token, its expiry, and the `mode` (`"test"` or `"live"`) the session was minted in — inherited from the key and fixed for the session's whole life. Pass the token to your frontend or mobile client and hand it to the SDK — the customer is then treated as verified, which unlocks account-scoped answers and any actions gated behind `verified_customer`.

```json
{
  "token": "…",
  "session_id": "ssn_…",
  "expires_at": "2026-08-05T21:00:00.000Z",
  "ws_url": "wss://api.creovine.com/lira/v1/support/chat/ws/org_xxx?sessionToken=…",
  "rest_base_url": "https://api.creovine.com/lira/v1/support",
  "mode": "test"
}
```

This is how a mobile app separates staging from production: your staging server mints with the test key, production mints with the live key, and the app code is identical.

### Revoke a session

```
POST /support/sessions/orgs/{orgId}/{sessionId}/revoke
```

Requires a dashboard login (JWT) — developer API keys are **not** accepted on this endpoint. Use this on logout or when you suspend an account, so an issued token cannot outlive the user's access.

---

## MCP server

Connect your own Model Context Protocol server so Lira can call your systems under your own auth. Conceptual guide: [MCP server](/platform/customer-support/mcp).

### Get your MCP server config

```
GET /support/mcp/orgs/{orgId}/server
```

Requires `mcp:read`. Returns the connected server, its auth mode, and the approved tool list with each tool's risk tier and auth scope.

### Create or update the MCP server

```
PUT /support/mcp/orgs/{orgId}/server
```

Requires `mcp:write`. Sets the server URL, the auth mode (OAuth 2.1 or a bearer credential), and the approved tools. A tool the agent is allowed to call must be explicitly approved here — discovery alone does not enable anything.

Each approved tool carries:

| Field | Meaning |
| --- | --- |
| `risk_tier` | `read_public`, `read_private`, `safe_write`, `customer_confirm`, `step_up`, `admin_approve`, `human_only` |
| `auth_scope` | `public`, `verified_visitor`, `verified_customer` |

### Delete the MCP server

```
DELETE /support/mcp/orgs/{orgId}/server
```

Requires `mcp:write`. Disconnects the server and disables every tool it provided.

### Discover tools

```
POST /support/mcp/orgs/{orgId}/discover
```

Requires `mcp:read`. Asks your MCP server for its current tool list and returns it alongside what you have already approved, so you can see additions, removals and changed signatures. Discovery never auto-approves — drift is surfaced for a human to accept.

### Read the tool-call audit trail

```
GET /support/mcp/orgs/{orgId}/audit
```

Requires `mcp:read`. Returns MCP configuration and invocation events: which tool ran, for which conversation, under which auth scope, and what the outcome was.

---

## Developer keys

Key management is deliberately **not** callable with an API key — a leaked key must not be able to mint more keys. These endpoints require a dashboard session (JWT); **any member** of the organization may use them, since the engineers doing the integration are usually not org admins.

Publishable keys live alongside them:

```
GET    /support/developer-keys/orgs/{orgId}/publishable-keys
POST   /support/developer-keys/orgs/{orgId}/publishable-keys/{mode}/rotate
```

They are returned in full (public by design) and provisioned on first read. Rotating `live` breaks production embeds until you redeploy; rotating `test` only affects staging.

```
GET    /support/developer-keys/orgs/{orgId}/keys
POST   /support/developer-keys/orgs/{orgId}/keys
DELETE /support/developer-keys/orgs/{orgId}/keys/{keyId}
```

Keys are stored hashed. The plaintext value is returned once at creation and cannot be retrieved again — only revoked.

---

## Errors

Errors return a JSON body with an `error` field, and `details` on validation failures.

| Status | Meaning |
| --- | --- |
| `400` | Validation error — check `details` for the offending fields. |
| `401` | Missing, malformed, expired or revoked key. |
| `403` | Key is valid but missing a required scope, or the caller lacks the role. |
| `404` | Organization or resource not found. |
| `429` | Rate limited. |
| `500` | Unexpected server error. |

## Rate limits

MCP tool invocation is rate limited per organization. Sustained excess returns `429`; retry with exponential backoff.

## Related

- [Developer API keys & CLI](/platform/customer-support/developer-api)
- [MCP server](/platform/customer-support/mcp)
- [Web SDK](/platform/customer-support/web-sdk) — the browser-side counterpart to a minted session
- [Native mobile](/platform/customer-support/mobile-frontend)
- [Security & actions governance](/platform/customer-support/security)
