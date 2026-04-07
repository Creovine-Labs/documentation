---
slug: /api/webhooks
sidebar_position: 10
title: Webhooks
---

# Webhooks

Lira receives inbound webhooks from connected integrations and AWS services for real-time event processing. All webhook endpoints are under `/lira/v1/webhooks`.

## Inbound Webhook Endpoints

### Linear

#### `POST /lira/v1/webhooks/linear`

Receives events from Linear when issues are created, updated, or deleted. Used to sync task status back to Lira.

**Verification**: Signature check via `x-linear-signature` header (HMAC-SHA256).

**Events:**

| Event | Description |
|:---|:---|
| `Issue.create` | New issue created in the mapped team |
| `Issue.update` | Issue status, assignee, or details changed |
| `Issue.delete` | Issue removed |

### Slack

#### `POST /lira/v1/webhooks/slack`

Receives events from Slack including messages and slash commands.

**Verification**: Request signing via `x-slack-signature` header.

### Microsoft Teams

#### `POST /lira/v1/webhooks/teams`

Receives events from Microsoft Teams.

**Verification**: Azure AD token validation.

---

## Email Inbound Webhook

### `POST /lira/v1/webhooks/email/inbound`

Receives inbound email notifications from AWS SNS (triggered by SES receipt rules). No authentication required — the endpoint validates the SNS message signature.

**Flow:**

```
Customer replies to Lira email
  → AWS SES receives at reply+<token>@liraintelligence.com
  → SES stores raw email in S3
  → SES triggers SNS notification
  → SNS posts to this webhook endpoint
  → Lira parses email, extracts context from token
  → AI decides: respond or escalate
```

**Verification**: AWS SNS signature validation on the notification payload.

---

## Webhook Security

All inbound webhooks verify the request source before processing:

| Provider | Verification Method |
|:---|:---|
| **Linear** | HMAC-SHA256 via `x-linear-signature` header |
| **Slack** | Request signing via `x-slack-signature` header |
| **Microsoft Teams** | Azure AD token validation |
| **AWS SNS (Email)** | SNS message signature verification |

Requests that fail verification are rejected with `401 Unauthorized`.

---

## Organization Webhook Configuration

Organizations can also configure outbound webhooks to receive Lira events. See [Tasks API — Webhook Configuration](/api/tasks#webhook-configuration) for details on setting up:

- Slack incoming webhook URL
- Email notifications
- Custom notification triggers
