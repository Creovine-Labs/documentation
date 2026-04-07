---
sidebar_position: 7
title: Tasks
description: Lira task management API.
---

# Tasks API

Tasks are managed within an organization context. See [Organizations API](/api/lira/organizations#tasks) for the full task endpoints.

**Base URL:** `https://api.creovine.com/lira/v1/orgs/:orgId/tasks`

## Endpoints

### Create Task

```http
POST /lira/v1/orgs/:orgId/tasks
Authorization: Bearer <jwt>

{
  "title": "Follow up with client about proposal",
  "description": "Discussed in standup meeting — needs response by Friday",
  "assignee": "user-uuid",
  "dueDate": "2026-04-04T17:00:00Z",
  "priority": "high"
}
```

### List Tasks

```http
GET /lira/v1/orgs/:orgId/tasks?status=open&assignee=user-uuid
Authorization: Bearer <jwt>
```

Filter parameters:
- `status` — `open`, `in_progress`, `completed`
- `assignee` — user UUID
- `priority` — `low`, `medium`, `high`

## Meeting-Generated Tasks

During meetings, Lira automatically extracts action items and creates tasks. These tasks include:

- The original transcript excerpt as context
- Auto-assigned to the correct org member (via speaker identification + member mapping)
- Synced to connected tools (Linear, Slack, etc.) if integrations are configured
