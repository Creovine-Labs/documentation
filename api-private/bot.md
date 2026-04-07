---
slug: /api/bot
sidebar_position: 3
title: Bot API
---

# Bot API

Deploy, monitor, and terminate Lira bots in Google Meet sessions. All routes are under `/lira/v1/bot` and require JWT authentication.

:::info Limits
- **Max active bots globally**: 3
- **Max bots per user**: 2

Exceeding these limits returns a `429` error.
:::

## Deploy Bot

### `POST /lira/v1/bot/deploy`

Launch a Lira bot into a Google Meet meeting. The bot takes approximately 16 seconds to start (Chromium launch + Nova Sonic warm-up).

**Request Body:**

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `meeting_url` | string (URL) | Yes | Google Meet URL |
| `session_id` | string | No | Existing meeting session ID to rejoin |
| `display_name` | string | No | Bot display name in the meeting |
| `org_id` | string | No | Organization ID for context |
| `meeting_topic` | string | No | Meeting topic for AI context |
| `meeting_type` | string | No | Type of meeting |
| `interview_id` | string | No | Link to an interview record |
| `settings` | object | No | Bot behavior configuration (see below) |

**Settings Object:**

| Field | Type | Default | Description |
|:---|:---|:---|:---|
| `personality` | string | `"supportive"` | `supportive`, `challenger`, `facilitator`, `analyst` |
| `participation_level` | string | — | How actively the bot participates |
| `wake_word_enabled` | boolean | `true` | Whether the bot listens for its name |
| `proactive_suggest` | boolean | — | Proactively offer suggestions |
| `ai_name` | string | `"Lira"` | Custom name for the bot |
| `voice_id` | string | — | Voice selection for TTS |
| `dynamic_context_refresh` | boolean | — | Refresh org context mid-session |

```bash
curl -X POST https://api.creovine.com/lira/v1/bot/deploy \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "org_id": "org_xyz789",
    "settings": {
      "personality": "facilitator",
      "wake_word_enabled": true,
      "ai_name": "Lira"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bot_id": "bot_abc123",
    "session_id": "ses_def456",
    "state": "launching",
    "platform": "google_meet",
    "display_name": "Lira AI"
  }
}
```

## Get Bot Status

### `GET /lira/v1/bot/:botId`

Check the current status of a deployed bot.

```bash
curl https://api.creovine.com/lira/v1/bot/bot_abc123 \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bot_id": "bot_abc123",
    "state": "active",
    "platform": "google_meet",
    "display_name": "Lira AI",
    "session_id": "ses_def456",
    "deployed_at": "2026-03-29T10:00:00Z"
  }
}
```

## Bot States

The bot transitions through these states during its lifecycle:

| State | Description |
|:---|:---|
| `launching` | Chromium browser starting, Nova Sonic warming up (~16s) |
| `navigating` | Browser navigating to the Google Meet URL |
| `in_lobby` | Bot is in the meeting lobby waiting to be admitted |
| `joining` | Bot is entering the meeting room |
| `active` | In the meeting — listening, transcribing, and responding |
| `leaving` | Gracefully exiting the meeting (post-meeting summary in progress) |
| `terminated` | Bot has been stopped |
| `error` | Deployment or session failure |

```
launching → navigating → in_lobby → joining → active → leaving → terminated
                                                                    ↘ error
```

## Terminate Bot

### `POST /lira/v1/bot/:botId/terminate`

Force-stop a running bot. Triggers the post-meeting flow (summary generation, task extraction).

```bash
curl -X POST https://api.creovine.com/lira/v1/bot/bot_abc123/terminate \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true
}
```

## List Active Bots

### `GET /lira/v1/bot/active`

List all currently active bots for the authenticated user.

```bash
curl https://api.creovine.com/lira/v1/bot/active \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "bot_id": "bot_abc123",
      "state": "active",
      "platform": "google_meet",
      "session_id": "ses_def456"
    }
  ]
}
```

## Terminate All Bots

### `POST /lira/v1/bot/terminate-all`

Terminate all active bots for the authenticated user.

**Response:**

```json
{
  "success": true,
  "data": {
    "terminated": 2
  }
}
```

## Auth Session Status

### `GET /lira/v1/bot/auth-status`

Check the health of the Google authentication session used by the bot to join meetings.

```bash
curl https://api.creovine.com/lira/v1/bot/auth-status \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "google_authenticated": true,
    "google_email": "lira-bot@creovine.com"
  }
}
```

## Refresh Auth

### `POST /lira/v1/bot/auth-refresh`

Refresh the Google authentication session.

**Response:**

```json
{
  "success": true
}
```
