---
sidebar_position: 7
title: Greenhouse
description: ATS integration for candidates, jobs, and scorecards.
---

# Greenhouse Integration

Connect Lira to **Greenhouse** via API key for candidate tracking, job listings, and interview scorecards.

## Setup

Unlike other integrations that use OAuth, Greenhouse uses an **API key**:

```bash
POST /lira/v1/integrations/greenhouse/connect
Authorization: Bearer <jwt>

{
  "apiKey": "your-greenhouse-harvest-api-key"
}
```

## Capabilities

| Feature | Description |
|:---|:---|
| **Candidates** | List and view candidate profiles |
| **Jobs** | List open jobs and job details |
| **Applications** | Track candidate applications |
| **Scorecards** | Submit interview scorecards |

## Interview Integration

When conducting AI interviews through Lira, Greenhouse integration enables:

- **Pre-interview** — Pull candidate profile and application details from Greenhouse
- **Post-interview** — Push evaluation scores and feedback as Greenhouse scorecards
- **Candidate tracking** — Link Lira interview records to Greenhouse candidates

## API Key Setup

1. In Greenhouse, go to **Configure → Dev Center → API Credential Management**
2. Create a new **Harvest API** credential
3. Assign the required permissions (candidates, jobs, applications, scorecards)
4. Copy the API key and connect via the Lira dashboard or API
