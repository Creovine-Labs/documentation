---
slug: /api/usage
sidebar_position: 12
title: Usage & Limits
---

# Usage & Limits API

Track organization-level usage metrics against beta limits. All routes require JWT authentication.

## Get Organization Usage

### `GET /lira/v1/usage/orgs/:orgId`

Returns current usage metrics and the beta limits for the organization.

```bash
curl https://api.creovine.com/lira/v1/usage/orgs/org_xyz \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "usage": {
      "meetings": 42,
      "meeting_minutes": 1260,
      "interviews": 8,
      "interview_evaluations": 6,
      "ai_tasks": 150,
      "documents": 15,
      "knowledge_pages": 230
    },
    "limits": {
      "meetings": 100,
      "meeting_minutes": 5000,
      "interviews": 20,
      "interview_evaluations": 20,
      "ai_tasks": 500,
      "documents": 50,
      "knowledge_pages": 1000
    }
  }
}
```

## Beta Limits

During the beta period, each organization has the following resource limits:

| Resource | Limit | Description |
|:---|:---|:---|
| `meetings` | 100 | Total meetings per billing period |
| `meeting_minutes` | 5,000 | Total minutes of bot participation |
| `interviews` | 20 | AI-conducted interviews |
| `interview_evaluations` | 20 | Evaluation reports generated |
| `ai_tasks` | 500 | Tasks created or executed by AI |
| `documents` | 50 | Documents uploaded to knowledge base |
| `knowledge_pages` | 1,000 | Web pages crawled for knowledge base |

:::note
These limits are for the beta period and subject to change. Contact [support@liraintelligence.com](mailto:support@liraintelligence.com) if you need higher limits.
:::

## Rate Limiting

When a limit is reached, the API returns a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": {
    "code": "BETA_LIMIT_REACHED",
    "message": "You have reached the meeting minutes limit for this billing period",
    "limit_feature": "meeting_minutes",
    "current": 5000,
    "limit": 5000
  }
}
```

The frontend client intercepts these errors via a custom `lira:beta-limit` event and displays an appropriate message to the user.
