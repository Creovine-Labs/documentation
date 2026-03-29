---
slug: /api/webhooks
sidebar_position: 10
title: Webhooks
---

# Webhooks

Lira receives inbound webhooks from connected integrations for real-time event processing.

## Inbound Webhook Endpoints

### Linear

#### `POST /lira/v1/webhooks/linear`

Receives events from Linear when issues are created, updated, or deleted.

**Events:**

| Event | Description |
|:---|:---|
| `Issue.create` | New issue created in the mapped team |
| `Issue.update` | Issue status, assignee, or details changed |
| `Issue.delete` | Issue removed |

### Slack

#### `POST /lira/v1/webhooks/slack`

Receives events from Slack including messages and channel activity.

**Events:**

| Event | Description |
|:---|:---|
| `message` | New message posted in a channel |
| `channel_created` | New channel created |

### Microsoft Teams

#### `POST /lira/v1/webhooks/teams`

Receives events from Microsoft Teams.

### Email Reply (SES → SNS)

#### `POST /lira/v1/webhooks/email/inbound`

Receives inbound email notifications from AWS SNS (triggered by SES receipt rules).

**Flow:**

```
Customer replies to Lira's email
  → AWS SES receives at reply+<token>@liraintelligence.com
  → SES stores raw email in S3
  → SES triggers SNS notification
  → SNS posts to this webhook
  → Lira parses email, extracts context from token
  → AI decides: respond or escalate
```

## Webhook Security

All inbound webhooks verify the source:

- **Linear**: Signature verification via `x-linear-signature` header
- **Slack**: Request signing via `x-slack-signature` header
- **Teams**: Azure AD token validation
- **SNS**: AWS signature verification on the notification payload

## Outbound Events

Lira can also push events to your systems via configured webhook URLs in organization settings. Supported events:

| Event | Description |
|:---|:---|
| `meeting.ended` | Meeting concluded, summary available |
| `task.created` | New task extracted from a meeting |
| `interview.completed` | Interview finished, evaluation ready |
