---
slug: /api/interviews
sidebar_position: 6
title: Interviews API
---

# Interviews API

Create, manage, and evaluate AI-conducted interviews.

## Create Interview

### `POST /lira/v1/orgs/:orgId/interviews`

```json
{
  "roleTitle": "Senior Frontend Engineer",
  "skills": ["React", "TypeScript", "System Design"],
  "evaluationCriteria": ["Technical depth", "Communication", "Problem solving"],
  "questionCount": 8,
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "scheduledAt": "2026-03-30T14:00:00Z",
  "candidateEmail": "candidate@email.com"
}
```

## List Interviews

### `GET /lira/v1/orgs/:orgId/interviews`

List all interviews with filtering and pagination.

## Get Interview

### `GET /lira/v1/interviews/:interviewId`

Get full interview details including evaluation results.

**Response:**

```json
{
  "success": true,
  "data": {
    "interviewId": "int_abc123",
    "roleTitle": "Senior Frontend Engineer",
    "status": "completed",
    "candidate": {
      "name": "Jane Doe",
      "email": "jane@email.com",
      "resumeParsed": true
    },
    "evaluation": {
      "overallScore": 8.2,
      "criteria": {
        "Technical depth": 9,
        "Communication": 7.5,
        "Problem solving": 8
      },
      "recommendation": "hire",
      "strengths": ["Deep React expertise", "Clear system design thinking"],
      "concerns": ["Could improve on explaining trade-offs"],
      "transcript": "..."
    }
  }
}
```

## Upload Resume

### `POST /lira/v1/interviews/:interviewId/resume`

Upload a candidate resume (PDF, max 50 MB).

```bash
curl -X POST https://api.creovine.com/lira/v1/interviews/int_abc/resume \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

## Interview States

| State | Description |
|:---|:---|
| `scheduled` | Interview scheduled for future time |
| `deploying` | Bot is being deployed |
| `in-progress` | Interview is actively happening |
| `completed` | Interview finished, evaluation ready |
| `cancelled` | Interview was cancelled |
| `failed` | Deployment or session error |
