---
sidebar_position: 4
title: Interviews
description: Lira AI interview CRUD, evaluation, and scheduling API.
---

# Interviews API

**Base URL:** `https://api.creovine.com/lira/v1/orgs/:orgId/interviews`

All routes require `Authorization: Bearer <jwt>`.

## Endpoints

### Create Interview

Admin role required.

```http
POST /lira/v1/orgs/:orgId/interviews
Authorization: Bearer <jwt>

{
  "title": "Senior Frontend Engineer",
  "candidateName": "Jane Smith",
  "candidateEmail": "jane@example.com",
  "mode": "solo",
  "jobDescription": "We're looking for a senior frontend engineer...",
  "questions": [...],
  "scheduledAt": "2026-04-01T14:00:00Z"
}
```

### List Interviews

```http
GET /lira/v1/orgs/:orgId/interviews?status=scheduled&title=frontend
Authorization: Bearer <jwt>
```

### Get Interview

Returns interview with questions and evaluation.

```http
GET /lira/v1/orgs/:orgId/interviews/:interviewId
Authorization: Bearer <jwt>
```

### Start Interview

Deploy bot to conduct the interview.

```http
POST /lira/v1/orgs/:orgId/interviews/:interviewId/start
Authorization: Bearer <jwt>
```

### Cancel Interview

```http
POST /lira/v1/orgs/:orgId/interviews/:interviewId/cancel
Authorization: Bearer <jwt>
```

### Upload Resume

Upload and parse candidate resume PDF.

```http
POST /lira/v1/orgs/:orgId/interviews/:interviewId/resume
Authorization: Bearer <jwt>
Content-Type: multipart/form-data
```

### Re-run Evaluation

Re-run Phase 2 evaluation (max 3 attempts).

```http
POST /lira/v1/orgs/:orgId/interviews/:interviewId/evaluate
Authorization: Bearer <jwt>
```

### Record Decision

```http
PUT /lira/v1/orgs/:orgId/interviews/:interviewId/decision
Authorization: Bearer <jwt>

{
  "decision": "next_round",
  "notes": "Strong technical skills, schedule second round"
}
```

Decisions: `hire`, `no_hire`, `next_round`

### Generate Questions

AI-generated questions from a job description.

```http
POST /lira/v1/orgs/:orgId/interviews/generate-questions
Authorization: Bearer <jwt>

{
  "jobDescription": "Senior Frontend Engineer...",
  "skills": ["React", "TypeScript", "System Design"]
}
```

### AI Interview Draft

Generate a complete interview draft.

```http
POST /lira/v1/orgs/:orgId/interviews/draft
Authorization: Bearer <jwt>

{
  "jobDescription": "...",
  "candidateResume": "..."
}
```
