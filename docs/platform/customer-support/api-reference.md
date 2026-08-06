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

## Knowledge base

The content Lira answers from. Both scopes cover the full lifecycle, so a
workspace can be provisioned *and maintained* from CI.

```
POST   /orgs/{orgId}/documents              upload a file        support:write
GET    /orgs/{orgId}/documents              list                 support:read
GET    /orgs/{orgId}/documents/{docId}      status + details     support:read
PATCH  /orgs/{orgId}/documents/{docId}/segments                 support:write
DELETE /orgs/{orgId}/documents/{docId}      remove               support:write
POST   /orgs/{orgId}/documents/{docId}/reprocess                 support:write
POST   /orgs/{orgId}/crawl                  crawl a website      support:write
GET    /orgs/{orgId}/crawl/status           crawl progress       support:read
PATCH  /orgs/{orgId}/knowledge-base/{pageId}/segments            support:write
POST   /orgs/{orgId}/kb/query               ask what Lira knows  support:read
```

`GET /crawl/status` reports a running crawl and, once it has finished, the last
run's outcome — `source` is `"live"` while a crawl is in progress and
`"last_run"` afterwards. Check it after firing a crawl: a crawl that returns
`pages_found: 0` immediately may still be running, and pages it ingests later
become part of every answer.

Upload is `multipart/form-data` with a `file` field. It returns `201`
immediately and processes asynchronously — poll the document's `status` until it
reads `indexed`.

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xxx/documents \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -F "file=@handbook.md" \
  -F "segments=all,personal"
```

**Supported file types:** DOCX, TXT, MD, CSV, XLSX. **PDF is not supported** —
PDFs are frequently image-based and extract into text too poor to answer from,
so we reject them rather than silently index nonsense. Export to DOCX or
Markdown first.

### Writing a note without a file

The dashboard's **Write a note directly** is not a separate kind of object: it
wraps your text in Markdown and uploads it as a document. To do the same over the
API, upload the text as a `.md` file — the result is identical, and the note is
editable and deletable like any other document.

```bash
printf '# Refunds\n\nRefunds are processed within 14 days.\n' > refunds.md
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xxx/documents \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -F "file=@refunds.md" \
  -F "segments=all"
```

### Segmenting one workspace

If one organization serves multiple products, brands, or regions, tag each
source and pass the matching context when you mint a support session. Retrieval
filters before the AI sees the candidates.

- Tag shared content as `all`, `shared`, `global`, or `common`.
- Tag product-specific content as `personal`, `business`, `corporate`, etc.
- A session with `context.productType = "personal"` searches `personal` plus
  shared tags; it does not search `business` or `corporate`.
- **An untagged source answers every segment by default.** Adopting segmentation
  is therefore additive — existing content keeps working while you tag.

Once everything is tagged, set `kb_segment_strict` to make untagged content
unreachable to any session that names a segment:

```bash
curl -X PUT https://api.creovine.com/lira/v1/support/config/orgs/org_xxx \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"kb_segment_strict":true}'
```

That is the difference between a convention and a control: with it on, a
document someone forgot to tag produces *no* answer instead of quietly
answering the wrong product. Turn it on after tagging — it withdraws every
untagged source at once.

:::caution The segment must come from your backend
Retrieval reads the product from the **signed session token** minted by your
server. A `context_update` sent later by the browser can refine what the AI
knows but cannot widen which documents are searched — otherwise a Personal
customer's page could ask for `corporate` and be answered from Corporate
material. Anonymous visitors have no signed session, so for them the page's
value is the only available signal.

Pass the product at mint time:

```json
{
  "customer": { "email": "ada@customer.com", "externalCustomerId": "user_123" },
  "context": { "productType": "personal" }
}
```
:::

Update a document's tags:

```bash
curl -X PATCH https://api.creovine.com/lira/v1/orgs/org_xxx/documents/doc_xxx/segments \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"segments":["personal","all"]}'
```

When crawling a website, put tags inside `options.segments`:

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xxx/crawl \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/help","options":{"max_pages":25,"segments":["business"]}}'
```

### Source priority

Retrieval ranks on similarity, which alone lets a marketing page outrank a
hand-written policy. Priority is a **precedence**: the highest tier with a
relevant match answers, and lower tiers are not passed to the model at all.

```
PATCH /orgs/{orgId}/documents/{docId}/authority          support:write
PATCH /orgs/{orgId}/knowledge-base/{pageId}/authority    support:write
```

```bash
curl -X PATCH https://api.creovine.com/lira/v1/orgs/org_xxx/documents/doc_xxx/authority \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"authority":"primary"}'
```

| Value | Behaviour | Default for |
| --- | --- | --- |
| `primary` | Answers whenever relevant, ahead of everything else | — |
| `normal` | The ordinary pool | documents |
| `background` | Used only when nothing above it matched | crawled pages |

Nothing needs migrating: a source with no stored value behaves as its type
implies. Set it at ingestion too — `authority` as a form field on upload, or
`options.authority` on a crawl.

A high-priority source that is only marginally relevant does **not** suppress a
strongly relevant one below it, so a single mistaken `primary` cannot quietly
degrade every answer.

### Removing crawled pages

```
DELETE /orgs/{orgId}/knowledge-base/{pageId}    support:write
POST   /orgs/{orgId}/knowledge-base/prune       support:write
```

Deleting a page removes its indexed chunks as well as its record. `prune`
reconciles the index against the pages that actually exist and reports what it
would remove; pass `{"apply": true}` to delete. Worth running once if you have
been crawling for a while: crawls used to replace the entire crawled knowledge
base and leave the replaced pages' chunks in the index, where they kept
answering while appearing in no list.

### Re-crawling

A crawl **upserts by URL**. Pages it fetches are refreshed — carrying their tags
and priority across, whatever internal id they land on — and pages it does not
touch are left alone. So refreshing three pages of a two-hundred page knowledge
base costs you nothing else.

Pass `options.replace: true` for the old behaviour: wipe every crawled page
first, then rebuild. Use it when pages have been removed from the site and you
want them gone from Lira too.

Explicit `options.segments` or `options.authority` override what a page carried
before — that is you saying "these pages are X now".

### Checking what Lira learned

`POST /orgs/{orgId}/kb/query` answers a question from the knowledge base and
returns the sources it used — the fastest way to confirm an upload actually took,
without opening the dashboard.

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xxx/kb/query \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"How long do refunds take?","context":{"productType":"personal"}}'
```

```json
{
  "answer": "Refunds are processed within 14 days (Source: refunds.md).",
  "sources": [{ "type": "document", "id": "…", "name": "refunds.md", "score": 0.83 }],
  "has_context": true
}
```

Deleting a document that is already gone returns `404`, so a re-run of a cleanup
job is safe. Deleting **does** free the slot it occupied.

:::caution Knowledge-base volume limits
Uploads and crawls are capped, and a `403` can come from either of two limits:

- `{"code":"SANDBOX_LIMIT"}` — the sandbox allowance. Going live unlocks your
  plan's volume, and we can raise the sandbox limits if you need more room while
  still testing.
- `{"code":"BETA_LIMIT_REACHED"}` — your plan's own limit for that feature. The
  response includes `feature` so you know which one you hit.

Both are cumulative against current usage, so deleting documents you no longer
need genuinely gives the room back.
:::

## Developer keys

Key management is deliberately **not** callable with an API key — a leaked key must not be able to mint more keys. These endpoints require a dashboard session (JWT); **any member** of the organization may use them, since the engineers doing the integration are usually not org admins.

Publishable keys live alongside them:

```
GET    /support/developer-keys/orgs/{orgId}/publishable-keys
POST   /support/developer-keys/orgs/{orgId}/publishable-keys/{mode}/rotate
```

They are returned in full (public by design) and provisioned on first read. Rotating `live` breaks production embeds until you redeploy; rotating `test` only affects staging.

```
GET    /support/developer-keys/orgs/{orgId}/keys            list
POST   /support/developer-keys/orgs/{orgId}/keys            create
PATCH  /support/developer-keys/orgs/{orgId}/keys/{keyId}    rename / change scopes
DELETE /support/developer-keys/orgs/{orgId}/keys/{keyId}    revoke
```

`PATCH` takes `{ "scopes": [...] }`, `{ "name": "..." }` and/or
`{ "expires_at": null }`. The key itself does not change, so tightening an
over-scoped key needs no redeploy. The environment is immutable — it is part of
the token your services already hold — and editing a revoked key returns `409`.

**One endpoint does not need a dashboard login:** a key can describe itself.

```
GET /support/developer-keys/self        (authenticated by the key itself)
```

```bash
curl https://api.creovine.com/lira/v1/support/developer-keys/self \
  -H "Authorization: Bearer $LIRA_API_KEY"
```

Returns the org, name, **scopes**, environment and status held for that key —
the same record enforcement reads. Use it to confirm a key is scoped the way you
intended, or as a connectivity check in CI. It never returns a secret.

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
