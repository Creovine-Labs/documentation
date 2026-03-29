---
slug: /api/bot
sidebar_position: 3
title: Bot API
---

# Bot API

Deploy, monitor, and terminate Lira bots in Google Meet sessions.

## Deploy Bot

### `POST /lira/v1/bot/deploy`

Deploy Lira to a Google Meet meeting.

**Request Body:**

```json
{
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "orgId": "org_xyz789",
  "personality": "supportive",
  "mode": "meeting"
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `meetingUrl` | string | Yes | Google Meet URL |
| `orgId` | string | Yes | Organization ID |
| `personality` | string | No | `supportive`, `challenger`, `facilitator`, `analyst` |
| `mode` | string | No | `meeting` or `interview` |

**Response:**

```json
{
  "success": true,
  "data": {
    "botId": "bot_abc123",
    "meetingId": "mtg_def456",
    "status": "deploying",
    "meetingUrl": "https://meet.google.com/abc-defg-hij"
  }
}
```

## Bot Status

### `GET /lira/v1/bot/:botId/status`

Check the current status of a deployed bot.

**Response:**

```json
{
  "success": true,
  "data": {
    "botId": "bot_abc123",
    "status": "active",
    "joinedAt": "2026-03-29T10:00:00Z",
    "participantCount": 4,
    "duration": 1800
  }
}
```

### Bot States

| State | Description |
|:---|:---|
| `deploying` | Browser launching, navigating to meeting |
| `joining` | Entering the meeting room |
| `active` | In the meeting, listening and responding |
| `leaving` | Gracefully exiting the meeting |
| `terminated` | Bot has been stopped |
| `error` | Deployment failed |

## Terminate Bot

### `POST /lira/v1/bot/:botId/terminate`

Force-stop a running bot.

**Response:**

```json
{
  "success": true,
  "data": {
    "botId": "bot_abc123",
    "status": "terminated"
  }
}
```

## Auth Session Status

### `GET /lira/v1/bot/auth-status`

Check the health of the Google authentication session used by the bot.

**Response:**

```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "lastRefresh": "2026-03-22T10:00:00Z",
    "nextRefresh": "2026-03-29T10:00:00Z",
    "cookieExpiry": "2026-04-05T10:00:00Z"
  }
}
```
