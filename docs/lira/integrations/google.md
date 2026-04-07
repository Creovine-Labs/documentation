---
sidebar_position: 5
title: Google (Calendar & Drive)
description: Google Calendar and Drive integration with dual OAuth.
---

# Google Integration

Lira integrates with **Google Calendar** and **Google Drive** using a dedicated OAuth client (separate from Lira app login).

## Dual Google OAuth

Lira uses two separate Google OAuth client IDs:

| Client | Purpose | Scopes |
|:---|:---|:---|
| `GOOGLE_LOGIN_CLIENT_ID` | Lira app login (sign-in with Google) | `openid`, `email`, `profile` |
| `GOOGLE_CLIENT_ID` | Calendar & Drive integration | Calendar read/write, Drive read |

`getAllowedAudiences()` in `platform-auth.service.ts` accepts tokens from both clients.

## Google Calendar

| Feature | Description |
|:---|:---|
| **List calendars** | `GET /lira/v1/integrations/google/calendars` |
| **Create events** | `POST /lira/v1/integrations/google/events` |
| **Read events** | View upcoming meetings for scheduling |

```bash
# List calendars
GET /lira/v1/integrations/google/calendars

# Create a calendar event
POST /lira/v1/integrations/google/events
{
  "summary": "Follow-up with client",
  "start": "2026-04-01T10:00:00Z",
  "end": "2026-04-01T10:30:00Z",
  "attendees": ["john@example.com"]
}
```

## Google Drive

| Feature | Description |
|:---|:---|
| **List files** | `GET /lira/v1/integrations/google/drive/files` |
| **Search files** | Full-text search across Drive |
| **Read files** | Docs, Sheets, and raw file content |
| **Create folders** | Organize meeting artifacts |

```bash
# List/search Drive files
GET /lira/v1/integrations/google/drive/files?q=quarterly+report
```

## OAuth Configuration

| Variable | Description |
|:---|:---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for integrations |
| `GOOGLE_INTEGRATIONS_CLIENT_SECRET` | Google OAuth client secret |
