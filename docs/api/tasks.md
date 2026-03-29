---
slug: /api/tasks
sidebar_position: 8
title: Tasks API
---

# Tasks API

Manage tasks extracted from meetings, including AI review and integration sync.

## List Tasks

### `GET /lira/v1/orgs/:orgId/tasks`

List all tasks across meetings.

**Query Parameters:**

| Param | Type | Description |
|:---|:---|:---|
| `meetingId` | string | Filter by meeting |
| `assignee` | string | Filter by assignee member ID |
| `status` | string | `pending`, `in-progress`, `completed` |
| `reviewStatus` | string | `reviewing`, `needs_info`, `approved` |

## Get Task

### `GET /lira/v1/tasks/:taskId`

## Create Task

### `POST /lira/v1/orgs/:orgId/tasks`

```json
{
  "title": "Redesign the homepage hero section",
  "description": "Update the hero section with new branding",
  "assignee": "mem_abc123",
  "priority": "high",
  "meetingId": "mtg_def456",
  "dueDate": "2026-04-05"
}
```

## Update Task

### `PATCH /lira/v1/tasks/:taskId`

Update task fields including status, assignee, description, and priority.

## AI Review Status

Tasks extracted by AI go through a review pipeline:

| Status | Description |
|:---|:---|
| `reviewing` | Lira is validating the task details |
| `needs_info` | Task requires clarification before execution |
| `approved` | Task validated and ready for integration sync |

### `PATCH /lira/v1/tasks/:taskId/review`

```json
{
  "reviewStatus": "approved"
}
```

## Integration Sync

When a task is approved and an integration is connected:

- **Linear**: Creates a Linear issue in the mapped team
- **GitHub**: Creates a GitHub issue in the selected repo
- **Slack**: Notifies the assignee via DM

The sync status is tracked on the task:

```json
{
  "integrationSync": {
    "linear": {
      "issueId": "LIN-123",
      "url": "https://linear.app/team/LIN-123",
      "syncedAt": "2026-03-29T10:30:00Z"
    }
  }
}
```
