---
slug: /api/email
sidebar_position: 11
title: Email API
---

# Email API

Manage email configuration, custom domains, and email threads. Lira can send AI-generated emails on behalf of your organization and handle inbound replies. All routes are under `/lira/v1/email` and require JWT authentication (except the inbound webhook).

## Email Configuration

### Get Config

#### `GET /lira/v1/email/config?orgId=<orgId>`

```bash
curl "https://api.creovine.com/lira/v1/email/config?orgId=org_xyz" \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "from_name": "Lira AI",
    "email_notifications_enabled": true,
    "notify_on": ["task_assigned", "task_completed"],
    "ai_reply_enabled": true
  }
}
```

### Update Config

#### `PUT /lira/v1/email/config`

| Field | Type | Description |
|:---|:---|:---|
| `from_name` | string | Display name for outgoing emails |
| `email_notifications_enabled` | boolean | Enable/disable email notifications |
| `notify_on` | string[] | Events to notify on |
| `ai_reply_enabled` | boolean | Allow AI to auto-reply to inbound emails |

```bash
curl -X PUT https://api.creovine.com/lira/v1/email/config \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "from_name": "Acme AI Assistant",
    "email_notifications_enabled": true,
    "ai_reply_enabled": true
  }'
```

---

## Custom Domain

Configure a custom sending domain so emails come from `your-domain.com` instead of `liraintelligence.com`.

### Register Domain

#### `POST /lira/v1/email/domain`

```json
{ "domain": "acme.com" }
```

Returns DNS records (DKIM, SPF, DMARC) that must be added to your domain's DNS settings.

### Check Domain Status

#### `GET /lira/v1/email/domain/status`

Check whether the DNS records have been verified for your custom domain.

**Response:**

```json
{
  "success": true,
  "data": {
    "domain": "acme.com",
    "verified": false,
    "dkim_verified": true,
    "spf_verified": false,
    "dmarc_verified": true
  }
}
```

---

## Email Threads

### List Threads

#### `GET /lira/v1/email/threads?orgId=<orgId>`

List all email threads for the organization.

### Get Thread

#### `GET /lira/v1/email/threads/:threadId?orgId=<orgId>`

Get the full email thread including all messages and AI replies.

---

## Inbound Email Flow

Inbound emails are received via the [webhook endpoint](/api/webhooks#email-inbound-webhook) at `POST /lira/v1/webhooks/email/inbound`. The flow is:

1. Customer replies to an email from Lira
2. AWS SES receives the email at `reply+<token>@liraintelligence.com`
3. SES stores the raw email in S3 and triggers an SNS notification
4. SNS posts to the webhook endpoint
5. Lira parses the email and extracts context from the reply token
6. If `ai_reply_enabled` is true, Lira generates and sends an AI response
