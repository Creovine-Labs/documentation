---
sidebar_position: 5
title: Integrations
description: Lira integration OAuth and provider-specific API.
---

# Integrations API

**Base URL:** `https://api.creovine.com/lira/v1/integrations`

All routes require `Authorization: Bearer <jwt>`.

## Common Endpoints

These work for all providers: `linear`, `slack`, `teams`, `google`, `github`, `hubspot`, `salesforce`.

### Get OAuth URL

```http
GET /lira/v1/integrations/:provider/auth-url
Authorization: Bearer <jwt>
```

### OAuth Callback

```http
GET /lira/v1/integrations/:provider/callback?code=...&state=...
```

### Check Status

```http
GET /lira/v1/integrations/:provider/status
Authorization: Bearer <jwt>
```

### Disconnect

```http
DELETE /lira/v1/integrations/:provider/disconnect
Authorization: Bearer <jwt>
```

### List Members

```http
GET /lira/v1/integrations/:provider/members
Authorization: Bearer <jwt>
```

### Save Member Mappings

```http
POST /lira/v1/integrations/:provider/member-mappings
Authorization: Bearer <jwt>

{
  "mappings": [
    { "externalId": "ext-123", "liraUserId": "user-uuid" }
  ]
}
```

## Google-Specific

### List Calendars

```http
GET /lira/v1/integrations/google/calendars
Authorization: Bearer <jwt>
```

### Create Calendar Event

```http
POST /lira/v1/integrations/google/events
Authorization: Bearer <jwt>

{
  "summary": "Follow-up meeting",
  "start": "2026-04-01T10:00:00Z",
  "end": "2026-04-01T10:30:00Z",
  "attendees": ["john@example.com"]
}
```

### List Drive Files

```http
GET /lira/v1/integrations/google/drive/files?q=quarterly+report
Authorization: Bearer <jwt>
```

## Greenhouse-Specific

Connect via API key instead of OAuth:

```http
POST /lira/v1/integrations/greenhouse/connect
Authorization: Bearer <jwt>

{
  "apiKey": "your-greenhouse-harvest-api-key"
}
```
