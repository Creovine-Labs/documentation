---
sidebar_position: 4
title: Interviews
description: AI-conducted interviews — autonomous questioning, evaluation, and scoring.
---

# AI-Conducted Interviews

Lira conducts interviews autonomously — deploying a bot to Google Meet, asking structured questions, evaluating candidates, and producing scored reports.

## Interview Modes

| Mode | Description |
|:---|:---|
| **Solo** | Fully autonomous — Lira conducts the entire interview |
| **Copilot** | Coaches a human interviewer with suggested questions and real-time feedback |
| **Shadow** | Observes silently and generates a scored evaluation afterward |

## Lifecycle

```
draft → scheduled → bot_deployed → in_progress → evaluating → completed
```

## Create an Interview

```bash
POST /lira/v1/orgs/:orgId/interviews
Authorization: Bearer <jwt>

{
  "title": "Senior Frontend Engineer",
  "mode": "solo",
  "scheduled_at": "2026-03-30T14:00:00Z",
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "job_description": "We're looking for a senior frontend engineer...",
  "skills": ["React", "TypeScript", "System Design"],
  "questions": [...]
}
```

## AI Features

### Question Generation

Generate tailored questions from a job description:

```bash
POST /lira/v1/orgs/:orgId/interviews/generate-questions

{"job_description": "...", "skills": ["React", "TypeScript"], "count": 8}
```

### AI Draft

Generate a complete interview configuration from natural language:

```bash
POST /lira/v1/orgs/:orgId/interviews/draft

{"prompt": "Create a technical interview for a senior backend engineer with Go and PostgreSQL experience"}
```

### Resume Parsing

Upload and parse a candidate's resume:

```bash
POST /lira/v1/orgs/:orgId/interviews/:id/resume
Content-Type: multipart/form-data
```

PDF → `pdf-parse` → GPT-4o-mini structured extraction → stored in S3.

## Evaluation

### Phase 1 (Automatic)

Runs automatically after the interview ends. Extracts Q&A summary from the transcript.

### Phase 2 (Admin-triggered)

Scores each criterion 0–100. Maximum 3 re-evaluations allowed.

```bash
POST /lira/v1/orgs/:orgId/interviews/:id/evaluate
```

### Decision Recording

```bash
PUT /lira/v1/orgs/:orgId/interviews/:id/decision

{"decision": "hire", "notes": "Strong technical skills, great culture fit"}
```

Decisions: `hire`, `no_hire`, `next_round`, `undecided`

## Auto-Scheduler

The backend polls DynamoDB every 30 seconds for interviews with `scheduled_at` due and auto-deploys the bot. No manual intervention needed.

## Multi-Round

Link successive interview rounds via `parent_interview_id` and `round` field:

```bash
GET /lira/v1/orgs/:orgId/interviews/:id/related
```
