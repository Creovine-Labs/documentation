---
sidebar_position: 2
title: Meetings
description: Lira meeting CRUD and summary API.
---

# Meetings API

**Base URL:** `https://api.creovine.com/lira/v1/meetings`

All routes require `Authorization: Bearer <jwt>`.

## Endpoints

### Create Meeting

```http
POST /lira/v1/meetings
Authorization: Bearer <jwt>

{
  "title": "Team Standup",
  "ttl_days": 7
}
```

### List Meetings

```http
GET /lira/v1/meetings
Authorization: Bearer <jwt>
```

### Get Meeting

Returns the meeting with full transcript.

```http
GET /lira/v1/meetings/:id
Authorization: Bearer <jwt>
```

**Response** `200 OK`:
```json
{
  "id": "uuid",
  "title": "Team Standup",
  "status": "completed",
  "createdAt": "2026-01-01T00:00:00Z",
  "transcript": [
    {
      "speaker": "John Smith",
      "text": "Let's discuss the Q3 roadmap.",
      "timestamp": "00:02:15"
    }
  ],
  "settings": {
    "personality": "supportive",
    "summaryMode": "short"
  }
}
```

### Generate Summary

```http
GET /lira/v1/meetings/:id/summary?mode=short
Authorization: Bearer <jwt>
```

Modes:
- `short` — 4-6 sentence summary
- `detailed` — 400-700 word summary with per-person contribution breakdown

### Update Settings (Mid-Meeting)

```http
PUT /lira/v1/meetings/:id/settings
Authorization: Bearer <jwt>

{
  "personality": "challenger",
  "summaryMode": "detailed"
}
```

### Delete Meeting

```http
DELETE /lira/v1/meetings/:id
Authorization: Bearer <jwt>
```
