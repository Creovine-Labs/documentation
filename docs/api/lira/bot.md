---
sidebar_position: 1
title: Bot
description: Lira bot deployment and management API.
---

# Bot API

**Base URL:** `https://api.creovine.com/lira/v1/bot`

All routes require `Authorization: Bearer <jwt>`.

## Endpoints

### Deploy Bot

Deploy a bot to join a meeting.

```http
POST /lira/v1/bot/deploy
Authorization: Bearer <jwt>

{
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "orgId": "org-uuid",
  "settings": {
    "personality": "supportive",
    "summaryMode": "short"
  }
}
```

**Response** `200 OK`:
```json
{
  "botId": "uuid",
  "status": "deploying",
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "deployedAt": "2026-01-01T00:00:00Z"
}
```

Returns `429 Too Many Requests` if bot capacity is exceeded (`LIRA_BOT_MAX_ACTIVE`).

### Get Bot Status

```http
GET /lira/v1/bot/:botId
Authorization: Bearer <jwt>
```

**Response**: bot state, platform, errors, timestamps.

### Terminate Bot

```http
POST /lira/v1/bot/:botId/terminate
Authorization: Bearer <jwt>
```

Gracefully terminates the bot and closes the browser session.

### List Active Bots

```http
GET /lira/v1/bot/active
Authorization: Bearer <jwt>
```

### Auth Status

Check Google/Zoom session health.

```http
GET /lira/v1/bot/auth-status
Authorization: Bearer <jwt>
```

**Response**: days remaining, urgency level.

### Refresh Auth

Trigger silent Google session refresh.

```http
POST /lira/v1/bot/auth-refresh
Authorization: Bearer <jwt>
```
