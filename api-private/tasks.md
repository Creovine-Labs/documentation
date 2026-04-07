---
slug: /api/tasks
sidebar_position: 8
title: Tasks API
---

# Tasks API

Create, manage, and execute tasks — either manually or extracted from meeting transcripts by AI. All routes require JWT authentication.

## Create Task

### `POST /lira/v1/orgs/:orgId/tasks`

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `title` | string | Yes | Task title |
| `description` | string | No | Task details |
| `assigned_to` | string | No | Member ID of the assignee |
| `priority` | string | No | `low`, `medium`, `high`, `urgent` |
| `task_type` | string | No | Type of task |
| `due_date` | string | No | ISO 8601 date |
| `session_id` | string | No | Meeting session to link to |

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Redesign the homepage hero section",
    "description": "Update the hero section with new branding guidelines",
    "assigned_to": "usr_abc123",
    "priority": "high",
    "due_date": "2026-04-05"
  }'
```

## List Tasks

### `GET /lira/v1/orgs/:orgId/tasks`

| Param | Type | Description |
|:---|:---|:---|
| `status` | string | Filter by status |
| `assigned_to` | string | Filter by assignee user ID |
| `session_id` | string | Filter by meeting session |

## Get Task

### `GET /lira/v1/orgs/:orgId/tasks/:taskId`

## Update Task

### `PUT /lira/v1/orgs/:orgId/tasks/:taskId`

| Field | Type | Description |
|:---|:---|:---|
| `status` | string | Task status |
| `assigned_to` | string | Assignee user ID |
| `assignee_email` | string | Assignee email (for external assignment) |
| `priority` | string | Priority level |
| `title` | string | Task title |
| `description` | string | Task description |
| `due_date` | string | Due date |
| `email_execution_enabled` | boolean | Allow email-based execution |

## Delete Task

### `DELETE /lira/v1/orgs/:orgId/tasks/:taskId`

---

## AI Task Extraction

### Extract Tasks from Meeting

#### `POST /lira/v1/meetings/:sessionId/extract-tasks`

Use AI to analyze a meeting transcript and extract actionable tasks with assignees, priorities, and due dates.

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `org_id` | string | Yes | Organization ID |

```bash
curl -X POST https://api.creovine.com/lira/v1/meetings/ses_def456/extract-tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "org_id": "org_xyz" }'
```

### List Meeting Tasks

#### `GET /lira/v1/meetings/:sessionId/tasks`

| Param | Type | Description |
|:---|:---|:---|
| `org_id` | string | Organization ID |

---

## AI Review & Execution

### AI Review

#### `POST /lira/v1/orgs/:orgId/tasks/:taskId/lira-review`

Have Lira autonomously review the task — validate details, suggest improvements, and prepare it for execution.

### Execute Task

#### `POST /lira/v1/orgs/:orgId/tasks/:taskId/execute`

Execute the task through connected integrations. Depending on configuration, this can:

- Create a **Linear issue** in the mapped team
- Create a **GitHub issue** in the selected repo
- Send a **Slack notification** to the assignee
- Send an **email** to the assignee

### Get Execution Result

#### `GET /lira/v1/orgs/:orgId/tasks/:taskId/result`

Check the result of task execution (links to created issues, delivery status, etc.).

---

## Webhook Configuration

### `PUT /lira/v1/orgs/:orgId/webhooks`

Configure task notification webhooks for the organization.

| Field | Type | Description |
|:---|:---|:---|
| `slack_webhook_url` | string | Slack incoming webhook URL |
| `email_notifications` | boolean | Enable email notifications |
| `notify_on` | string[] | Events to notify on |

### `GET /lira/v1/orgs/:orgId/webhooks`

Get current webhook configuration.

---

## User Notifications

### `GET /lira/v1/me/notifications`

List notifications for the authenticated user (task assignments, completions, etc.).

### `PUT /lira/v1/me/notifications/:notifId/read`

Mark a notification as read.

---

## User Profile

### `GET /lira/v1/me`

Get the authenticated user's profile.

### `PUT /lira/v1/me/picture`

Update the user's profile picture.

```json
{ "picture": "https://example.com/avatar.jpg" }
```
