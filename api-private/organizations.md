---
slug: /api/organizations
sidebar_position: 5
title: Organizations API
---

# Organizations API

Manage organizations, members, documents, knowledge base, and semantic search. All routes are under `/lira/v1/orgs` and require JWT authentication.

## Create Organization

### `POST /lira/v1/orgs`

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `name` | string | Yes | Organization name |
| `profile` | object | No | Organization profile (see below) |

**Profile Object:**

| Field | Type | Description |
|:---|:---|:---|
| `company_name` | string | Company display name |
| `industry` | string | Industry sector |
| `description` | string | Company description |
| `website` | string | Primary website |
| `websites` | string[] | Additional website URLs |
| `size` | string | Company size |
| `culture` | object | Company culture details |
| `products` | string[] | Products/services offered |
| `terminology` | string[] | Domain-specific terms |
| `custom_instructions` | string | Custom instructions for the AI |

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "profile": {
      "company_name": "Acme Corp",
      "industry": "Technology",
      "description": "Cloud infrastructure company",
      "website": "https://acme.com",
      "products": ["Acme Cloud", "Acme Edge"],
      "terminology": ["ACU", "edge node", "cluster"],
      "custom_instructions": "Always refer to our product as Acme Cloud, not just cloud."
    }
  }'
```

## List Organizations

### `GET /lira/v1/orgs`

List all organizations the authenticated user belongs to.

## Get Organization

### `GET /lira/v1/orgs/:orgId`

Get full organization details including profile, member count, and integration status.

## Update Organization

### `PUT /lira/v1/orgs/:orgId`

Update organization name and/or profile fields.

## Delete Organization

### `DELETE /lira/v1/orgs/:orgId`

Permanently delete an organization and all associated data. Only the owner can perform this action.

---

## Members

### List Members

#### `GET /lira/v1/orgs/:orgId/members`

```bash
curl https://api.creovine.com/lira/v1/orgs/org_xyz/members \
  -H "Authorization: Bearer <token>"
```

### Member Contributions

#### `GET /lira/v1/orgs/:orgId/members/:memberId/contributions`

Get activity stats for a specific member (meetings attended, tasks completed, etc.).

### Update Member Role

#### `PUT /lira/v1/orgs/:orgId/members/:userId/role`

| Field | Type | Values |
|:---|:---|:---|
| `role` | string | `admin`, `member` |

```bash
curl -X PUT https://api.creovine.com/lira/v1/orgs/org_xyz/members/usr_abc/role \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "role": "admin" }'
```

### Remove Member

#### `DELETE /lira/v1/orgs/:orgId/members/:userId`

### Transfer Ownership

#### `POST /lira/v1/orgs/:orgId/transfer-ownership`

```json
{ "new_owner_id": "usr_def456" }
```

---

## Invite Codes

### Validate Invite Code

#### `GET /lira/v1/orgs/invite/:code/validate`

Check if an invite code is valid before joining.

### Join Organization

#### `POST /lira/v1/orgs/join`

```json
{ "invite_code": "ACME-2026" }
```

### Regenerate Invite Code

#### `POST /lira/v1/orgs/:orgId/invite-code`

Generate a new invite code (invalidates the previous one).

---

## Knowledge Base

### Web Crawl

#### `POST /lira/v1/orgs/:orgId/crawl`

Crawl a website and ingest content into the organization's knowledge base. Content is chunked, embedded (OpenAI `text-embedding-3-small`, 1536 dimensions), and stored in Qdrant for vector search.

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `url` | string (URL) | Yes | Website URL to crawl |
| `options.max_pages` | number | No | Maximum pages to crawl |
| `options.max_depth` | number | No | Maximum link depth |
| `options.include_urls` | string[] | No | URL patterns to include |

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/crawl \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://acme.com/docs",
    "options": { "max_pages": 50, "max_depth": 3 }
  }'
```

### Crawl Status

#### `GET /lira/v1/orgs/:orgId/crawl/status`

Check the progress of an active web crawl.

---

## Documents

### Upload Document

#### `POST /lira/v1/orgs/:orgId/documents`

Upload a file (PDF, DOCX, TXT) via multipart form data. Documents are parsed, chunked, and indexed for semantic search.

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/documents \
  -H "Authorization: Bearer <token>" \
  -F "file=@product-spec.pdf"
```

### List Documents

#### `GET /lira/v1/orgs/:orgId/documents`

### Get Download URL

#### `GET /lira/v1/orgs/:orgId/documents/:docId/download`

Returns a pre-signed S3 URL for downloading the original file.

### Delete Document

#### `DELETE /lira/v1/orgs/:orgId/documents/:docId`

### Reprocess Document

#### `POST /lira/v1/orgs/:orgId/documents/:docId/reprocess`

Re-parse and re-index an existing document (useful after embedding model upgrades).

---

## Semantic Search

### `POST /lira/v1/orgs/:orgId/search`

Search the knowledge base using natural language. Queries are embedded and matched against document chunks in Qdrant.

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `query` | string | Yes | Natural language search query |
| `limit` | number | No | Max results to return |

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "query": "What is our SLA for enterprise customers?", "limit": 5 }'
```

---

## URL Description

### `POST /lira/v1/orgs/:orgId/describe-url`

Use AI to generate a description of a URL's content (authenticated).

```json
{ "url": "https://acme.com/pricing" }
```

### `POST /lira/v1/orgs/describe-url`

Public version (no authentication required).

---

## Dashboard Stats

### `GET /lira/v1/orgs/:orgId/stats`

Get aggregated dashboard statistics for the organization (total meetings, active interviews, tasks completed, etc.).
