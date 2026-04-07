---
sidebar_position: 6
title: Email
description: Lira email configuration, domain, and thread management API.
---

# Email API

**Base URL:** `https://api.creovine.com/lira/v1/email`

## Endpoints

### Inbound Email Webhook

Receives emails from SES → SNS. Authenticated via SNS signature verification.

```http
POST /lira/v1/email/inbound
```

### Get Email Config

```http
GET /lira/v1/email/config
Authorization: Bearer <jwt>
```

### Update Email Config

```http
PUT /lira/v1/email/config
Authorization: Bearer <jwt>

{
  "aiReplyEnabled": true,
  "escalationEmail": "team@yourcompany.com",
  "notificationPrefs": {
    "summaryEmail": true,
    "taskAssignment": true
  }
}
```

### Register Custom Domain

Register a custom sending domain via Resend.

```http
POST /lira/v1/email/domain
Authorization: Bearer <jwt>

{
  "domain": "yourcompany.com"
}
```

Returns DNS records to add for domain verification.

### Check Domain Status

```http
GET /lira/v1/email/domain/status
Authorization: Bearer <jwt>
```

### List Email Threads

```http
GET /lira/v1/email/threads
Authorization: Bearer <jwt>
```

### Get Thread

```http
GET /lira/v1/email/threads/:threadId
Authorization: Bearer <jwt>
```

Returns the thread with full message history.
