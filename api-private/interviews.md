---
slug: /api/interviews
sidebar_position: 6
title: Interviews API
---

# Interviews API

Create, manage, and evaluate AI-conducted interviews. All routes are under `/lira/v1/orgs/:orgId/interviews` and require JWT authentication.

## Interview Lifecycle

```
draft → scheduled → bot_deployed → in_progress → evaluating → completed
                                                                ↘ cancelled
```

## Interview Modes

| Mode | Description |
|:---|:---|
| `solo` | Lira runs the interview autonomously |
| `copilot` | Lira assists a human interviewer in real-time |
| `shadow` | Lira silently observes and evaluates after |

---

## Draft Interview (AI-generated)

### `POST /lira/v1/orgs/:orgId/interviews/draft`

Use AI to generate a complete interview draft from a natural language prompt.

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/interviews/draft \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "prompt": "Senior React engineer, 5+ years, focus on performance optimization" }'
```

## Generate Questions

### `POST /lira/v1/orgs/:orgId/interviews/generate-questions`

Generate tailored interview questions using AI.

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `title` | string | Yes | Job title |
| `job_description` | string | Yes | Full job description |
| `required_skills` | string[] | Yes | Skills to evaluate |
| `experience_level` | string | Yes | Expected experience level |
| `resume_text` | string | No | Candidate resume text for personalization |
| `question_count` | number | No | Number of questions to generate |
| `categories` | string[] | No | Question categories to cover |

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/interviews/generate-questions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Frontend Engineer",
    "job_description": "Build and maintain React applications...",
    "required_skills": ["React", "TypeScript", "System Design"],
    "experience_level": "senior",
    "question_count": 8,
    "categories": ["technical", "behavioral", "system-design"]
  }'
```

## Create Interview

### `POST /lira/v1/orgs/:orgId/interviews`

Create a new interview record with full configuration.

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/interviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role_title": "Senior Frontend Engineer",
    "skills": ["React", "TypeScript", "System Design"],
    "evaluation_criteria": ["Technical depth", "Communication", "Problem solving"],
    "question_count": 8,
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "scheduled_at": "2026-03-30T14:00:00Z",
    "candidate_email": "jane@email.com",
    "mode": "solo"
  }'
```

## List Interviews

### `GET /lira/v1/orgs/:orgId/interviews`

List all interviews with optional status filter.

| Param | Type | Description |
|:---|:---|:---|
| `status` | string | Filter by status (`draft`, `scheduled`, `in_progress`, `completed`, etc.) |

## Get Interview

### `GET /lira/v1/orgs/:orgId/interviews/:interviewId`

Get full interview details including evaluation results.

**Response:**

```json
{
  "success": true,
  "data": {
    "interview_id": "int_abc123",
    "role_title": "Senior Frontend Engineer",
    "status": "completed",
    "mode": "solo",
    "candidate": {
      "name": "Jane Doe",
      "email": "jane@email.com",
      "resume_parsed": true
    },
    "evaluation": {
      "overall_score": 8.2,
      "criteria": {
        "Technical depth": 9,
        "Communication": 7.5,
        "Problem solving": 8
      },
      "recommendation": "hire",
      "strengths": ["Deep React expertise", "Clear system design thinking"],
      "concerns": ["Could improve on explaining trade-offs"]
    }
  }
}
```

## Get Related Interviews

### `GET /lira/v1/orgs/:orgId/interviews/:interviewId/related`

Fetch related interviews for the same candidate or role (multi-round interviews).

## Update Interview

### `PUT /lira/v1/orgs/:orgId/interviews/:interviewId`

Update interview configuration before it starts.

## Delete Interview

### `DELETE /lira/v1/orgs/:orgId/interviews/:interviewId`

---

## Session Controls

### Start Interview

#### `POST /lira/v1/orgs/:orgId/interviews/:interviewId/start`

Deploy a bot and start the interview session.

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `meeting_link` | string | No | Override the meeting URL |
| `candidate_name` | string | No | Override the candidate name |

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/interviews/int_abc/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "meeting_link": "https://meet.google.com/abc-defg-hij" }'
```

### Cancel Interview

#### `POST /lira/v1/orgs/:orgId/interviews/:interviewId/cancel`

Cancel the interview (terminates the bot if deployed).

### Rejoin Interview

#### `POST /lira/v1/orgs/:orgId/interviews/:interviewId/rejoin`

Rejoin an interview session after a bot disconnect.

---

## Resume Upload

### `POST /lira/v1/orgs/:orgId/interviews/:interviewId/resume`

Upload a candidate resume (PDF). The resume is parsed and used to personalize interview questions.

```bash
curl -X POST https://api.creovine.com/lira/v1/orgs/org_xyz/interviews/int_abc/resume \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

---

## Evaluation

Interview evaluation happens in two phases:

### Phase 1: Auto-Evaluate

#### `POST /lira/v1/orgs/:orgId/interviews/:interviewId/evaluate`

Automatically generates a QA summary from the transcript. Runs immediately after the interview ends.

### Phase 2: Generate Score

#### `POST /lira/v1/orgs/:orgId/interviews/:interviewId/generate-score`

On-demand scoring using the evaluation criteria defined on the interview. Returns numerical scores, strengths, concerns, and a hire/no-hire recommendation.

### Record Decision

#### `PUT /lira/v1/orgs/:orgId/interviews/:interviewId/decision`

Record the final hiring decision.

| Field | Type | Values |
|:---|:---|:---|
| `decision` | string | `hire`, `no_hire`, `next_round`, `undecided` |
| `notes` | string | Optional decision notes |

```bash
curl -X PUT https://api.creovine.com/lira/v1/orgs/org_xyz/interviews/int_abc/decision \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "decision": "next_round", "notes": "Strong technical skills, schedule system design round" }'
```

---

## Interview Statuses

| Status | Description |
|:---|:---|
| `draft` | Interview created but not yet scheduled |
| `scheduled` | Interview scheduled for a future time |
| `bot_deployed` | Bot is launching and joining the meeting |
| `in_progress` | Interview is actively happening |
| `evaluating` | Post-interview evaluation in progress |
| `completed` | Interview finished, evaluation and scores ready |
| `cancelled` | Interview was cancelled |
