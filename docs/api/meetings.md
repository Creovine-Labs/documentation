---
slug: /api/meetings
sidebar_position: 4
title: Meetings API
---

# Meetings API

CRUD operations for meetings, including summaries, transcripts, and participant data.

## List Meetings

### `GET /lira/v1/orgs/:orgId/meetings`

List all meetings for an organization.

**Query Parameters:**

| Param | Type | Description |
|:---|:---|:---|
| `limit` | number | Max results (default: 20) |
| `offset` | number | Pagination offset |
| `status` | string | Filter by status |

**Response:**

```json
{
  "success": true,
  "data": {
    "meetings": [
      {
        "meetingId": "mtg_def456",
        "title": "Q2 Planning",
        "status": "completed",
        "startedAt": "2026-03-29T10:00:00Z",
        "endedAt": "2026-03-29T11:00:00Z",
        "participantCount": 4,
        "hasSummary": true
      }
    ],
    "total": 42
  }
}
```

## Get Meeting

### `GET /lira/v1/meetings/:meetingId`

Get details for a specific meeting.

**Response includes:**

- Meeting metadata
- Participant list (with speaker attribution)
- Transcript (full, speaker-attributed)
- Summary (short and detailed)
- Extracted tasks

## Get Transcript

### `GET /lira/v1/meetings/:meetingId/transcript`

Get the full speaker-attributed transcript.

**Response:**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "speaker": "John Smith",
        "text": "Let's discuss the homepage redesign.",
        "timestamp": "2026-03-29T10:02:15Z",
        "role": "user"
      },
      {
        "speaker": "Lira AI",
        "text": "Based on your design guide, the current layout uses...",
        "timestamp": "2026-03-29T10:02:22Z",
        "role": "assistant"
      }
    ]
  }
}
```

## Generate Summary

### `POST /lira/v1/meetings/:meetingId/summary`

Generate or regenerate an AI summary.

**Request Body:**

```json
{
  "type": "detailed"
}
```

| Type | Description |
|:---|:---|
| `short` | 4-6 sentence overview |
| `detailed` | 400-700 word breakdown with per-person contributions |

## Generate Title

### `POST /lira/v1/meetings/:meetingId/title`

Auto-generate a meeting title from the transcript using AI.
