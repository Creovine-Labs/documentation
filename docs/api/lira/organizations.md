---
sidebar_position: 3
title: Organizations
description: Lira organization management, knowledge base, documents, and tasks API.
---

# Organizations API

**Base URL:** `https://api.creovine.com/lira/v1/orgs`

All routes require `Authorization: Bearer <jwt>`.

## Organization CRUD

### Create Organization

```http
POST /lira/v1/orgs
Authorization: Bearer <jwt>

{
  "name": "Acme Corp",
  "website": "https://acme.com"
}
```

### List Organizations

```http
GET /lira/v1/orgs
Authorization: Bearer <jwt>
```

### Get Organization

```http
GET /lira/v1/orgs/:orgId
Authorization: Bearer <jwt>
```

### Update Organization

```http
PATCH /lira/v1/orgs/:orgId
Authorization: Bearer <jwt>

{
  "name": "Acme Corporation"
}
```

### Delete Organization

Owner only.

```http
DELETE /lira/v1/orgs/:orgId
Authorization: Bearer <jwt>
```

## Members

### Join via Invite Code

```http
POST /lira/v1/orgs/join
Authorization: Bearer <jwt>

{
  "inviteCode": "ABC123"
}
```

### Generate Invite Code

```http
POST /lira/v1/orgs/:orgId/invite
Authorization: Bearer <jwt>
```

### List Members

```http
GET /lira/v1/orgs/:orgId/members
Authorization: Bearer <jwt>
```

### Remove Member

```http
DELETE /lira/v1/orgs/:orgId/members/:userId
Authorization: Bearer <jwt>
```

## Knowledge Base

### Trigger Website Crawl

```http
POST /lira/v1/orgs/:orgId/kb/crawl
Authorization: Bearer <jwt>

{
  "url": "https://acme.com"
}
```

### List Knowledge Base Entries

```http
GET /lira/v1/orgs/:orgId/kb
Authorization: Bearer <jwt>
```

## Documents

### Upload Document

```http
POST /lira/v1/orgs/:orgId/documents
Authorization: Bearer <jwt>
Content-Type: multipart/form-data
```

Supports PDF and DOCX files.

### List Documents

```http
GET /lira/v1/orgs/:orgId/documents
Authorization: Bearer <jwt>
```

## Tasks

### Create Task

```http
POST /lira/v1/orgs/:orgId/tasks
Authorization: Bearer <jwt>

{
  "title": "Follow up with client",
  "assignee": "user-uuid"
}
```

### List Tasks

```http
GET /lira/v1/orgs/:orgId/tasks?status=open&assignee=user-uuid
Authorization: Bearer <jwt>
```
