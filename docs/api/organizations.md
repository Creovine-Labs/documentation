---
slug: /api/organizations
sidebar_position: 5
title: Organizations API
---

# Organizations API

Manage organizations, members, profiles, and knowledge base.

## Create Organization

### `POST /lira/v1/orgs`

```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "description": "Cloud infrastructure company",
  "website": "https://acme.com"
}
```

## Get Organization

### `GET /lira/v1/orgs/:orgId`

Returns org profile, member list, integration status, and usage stats.

## Update Organization

### `PATCH /lira/v1/orgs/:orgId`

Update organization profile fields.

## Members

### `GET /lira/v1/orgs/:orgId/members`

List all members in the organization.

### `POST /lira/v1/orgs/:orgId/members/invite`

Invite a new member by email.

```json
{
  "email": "sarah@acme.com",
  "role": "member"
}
```

### `PATCH /lira/v1/orgs/:orgId/members/:memberId`

Update member role (`admin`, `member`, `viewer`).

## Knowledge Base

### `GET /lira/v1/orgs/:orgId/knowledge`

List all knowledge base documents.

### `POST /lira/v1/orgs/:orgId/knowledge/upload`

Upload a document (PDF, DOCX, TXT). Multipart form-data, max 50 MB.

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/knowledge/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf"
```

### `POST /lira/v1/orgs/:orgId/knowledge/crawl`

Crawl a website and add content to the knowledge base.

```json
{
  "url": "https://acme.com",
  "maxPages": 50
}
```

### `DELETE /lira/v1/orgs/:orgId/knowledge/:documentId`

Remove a document from the knowledge base.

## Usage

### `GET /lira/v1/orgs/:orgId/usage`

Get current usage metrics and quota status.

```json
{
  "success": true,
  "data": {
    "meetingsUsed": 42,
    "meetingsLimit": 100,
    "minutesUsed": 1260,
    "minutesLimit": 5000,
    "documentsUsed": 15,
    "documentsLimit": 50,
    "period": "2026-03"
  }
}
```
