---
sidebar_position: 8
title: Usage
description: Lira per-org usage tracking and quotas API.
---

# Usage API

**Base URL:** `https://api.creovine.com/lira/v1/usage`

## Get Usage Stats

```http
GET /lira/v1/usage?orgId=<org-uuid>
Authorization: Bearer <jwt>
```

**Response** `200 OK`:
```json
{
  "orgId": "uuid",
  "period": "2026-04",
  "usage": {
    "meetings": {
      "total": 45,
      "limit": 100,
      "remaining": 55
    },
    "bots": {
      "totalDeployments": 42,
      "activeNow": 1,
      "maxConcurrent": 3
    },
    "interviews": {
      "total": 12,
      "limit": 50,
      "remaining": 38
    },
    "documents": {
      "total": 8,
      "storageMb": 24.5
    },
    "apiCalls": {
      "total": 1250
    }
  }
}
```

## Beta Limits

During beta, usage is subject to limits:

| Resource | Beta Limit |
|:---|:---|
| Meetings per month | 100 |
| Concurrent bots | 3 (`LIRA_BOT_MAX_ACTIVE`) |
| Bots per user | 2 (`LIRA_BOT_MAX_PER_USER`) |
| Interviews per month | 50 |
| Documents | Unlimited (storage-based) |
