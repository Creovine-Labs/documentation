---
slug: /api/meetings
sidebar_position: 4
title: Meetings API
---

# Meetings API

CRUD operations for meetings, including AI-generated summaries and live settings. All routes are under `/lira/v1/meetings` and require JWT authentication.

## Create Meeting

### `POST /lira/v1/meetings`

Create a new meeting record. A meeting is typically created automatically when a bot is deployed, but can also be created manually.

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `title` | string | No | Meeting title (auto-generated from transcript if omitted) |
| `ttl_days` | number | No | Days to retain the meeting data |
| `settings` | object | No | Default bot behavior settings |

**Settings Object:**

| Field | Type | Description |
|:---|:---|:---|
| `personality` | string | `supportive`, `challenger`, `facilitator`, `analyst` |
| `participation_level` | string | How actively the bot participates |
| `wake_word_enabled` | boolean | Whether the bot listens for its name |
| `proactive_suggest` | boolean | Proactively offer suggestions |

```bash
curl -X POST https://api.creovine.com/lira/v1/meetings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q2 Sprint Planning",
    "settings": {
      "personality": "facilitator",
      "wake_word_enabled": true
    }
  }'
```

## List Meetings

### `GET /lira/v1/meetings`

List all meetings for the authenticated user. Supports cursor-based pagination.

| Param | Type | Description |
|:---|:---|:---|
| `limit` | number | Max results per page |
| `cursor` | string | Pagination cursor from previous response |

```bash
curl "https://api.creovine.com/lira/v1/meetings?limit=20" \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "meetings": [
      {
        "meeting_id": "mtg_def456",
        "title": "Q2 Sprint Planning",
        "status": "completed",
        "started_at": "2026-03-29T10:00:00Z",
        "ended_at": "2026-03-29T11:00:00Z",
        "participant_count": 4,
        "has_summary": true
      }
    ],
    "cursor": "eyJjdXJzb3IiOiIxNzExNzExMjAw..."
  }
}
```

## Get Meeting

### `GET /lira/v1/meetings/:id`

Get full details for a specific meeting, including transcript, participants, and metadata.

```bash
curl https://api.creovine.com/lira/v1/meetings/mtg_def456 \
  -H "Authorization: Bearer <token>"
```

## Get Summary

### `GET /lira/v1/meetings/:id/summary`

Retrieve or generate an AI-powered meeting summary.

| Param | Type | Default | Description |
|:---|:---|:---|:---|
| `mode` | string | `short` | `short` (4–6 sentences) or `long` (detailed breakdown) |
| `regenerate` | boolean | `false` | Force regeneration of the summary |

```bash
# Get short summary
curl "https://api.creovine.com/lira/v1/meetings/mtg_def456/summary?mode=short" \
  -H "Authorization: Bearer <token>"

# Force regenerate detailed summary
curl "https://api.creovine.com/lira/v1/meetings/mtg_def456/summary?mode=long&regenerate=true" \
  -H "Authorization: Bearer <token>"
```

## Update Meeting Settings

### `PUT /lira/v1/meetings/:id/settings`

Update the bot behavior settings for an active meeting.

```bash
curl -X PUT https://api.creovine.com/lira/v1/meetings/mtg_def456/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "personality": "analyst",
    "wake_word_enabled": false,
    "proactive_suggest": true
  }'
```

## Update Meeting Title

### `PATCH /lira/v1/meetings/:id`

Update the meeting title.

```bash
curl -X PATCH https://api.creovine.com/lira/v1/meetings/mtg_def456 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Q2 Sprint Planning — Finalized" }'
```

## Delete Meeting

### `DELETE /lira/v1/meetings/:id`

Permanently delete a meeting and all associated data (transcript, summary, extracted tasks).

```bash
curl -X DELETE https://api.creovine.com/lira/v1/meetings/mtg_def456 \
  -H "Authorization: Bearer <token>"
```
