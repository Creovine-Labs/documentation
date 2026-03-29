---
slug: /getting-started/concepts
sidebar_position: 4
title: Core Concepts
---

# Core Concepts

Understanding the key building blocks of the Lira platform.

## Organizations

An **Organization** is the top-level entity in Lira. Everything — meetings, integrations, knowledge base, team members, usage quotas — is scoped to an organization.

- Users create or join organizations after signing in
- An organization has a **profile** (name, industry, description) that Lira uses as context during meetings
- Each org can have its own custom email domain for customer support
- Usage and billing are tracked per organization

## Meetings

A **Meeting** represents a single session where Lira was deployed. Each meeting stores:

- **Transcript** — Speaker-attributed messages with timestamps
- **Summary** — AI-generated short and detailed summaries
- **Tasks** — Extracted action items with assignees and status
- **Recording status** — Audio capture metadata
- **Participants** — Who was in the meeting

## Bot

The **Bot** is the headless Chromium browser instance running on the backend that joins Google Meet as "Lira AI." Each bot deployment:

1. Launches a Playwright browser
2. Navigates to the Google Meet URL
3. Joins as a participant
4. Captures audio bidirectionally
5. Streams to Amazon Nova Sonic for real-time AI

Only one bot can be active per meeting at a time.

## Knowledge Base

The **Knowledge Base** is your organization's context that Lira uses to give informed responses:

- **Website crawl** — Lira can crawl your company website and index the content
- **Document uploads** — Upload PDFs, DOCX files, and other documents
- **Vector search** — Content is embedded via OpenAI and stored in Qdrant for semantic retrieval
- **RAG pipeline** — During meetings, relevant knowledge base content is injected into Lira's context

## Tasks

**Tasks** are action items extracted from meetings by AI. Each task has:

- Title and description
- Assignee (mapped to org members)
- Priority and status
- `lira_review_status` — Lira autonomously validates tasks before execution
- Integration sync — Tasks can be pushed to Linear, GitHub Issues, etc.

## Integrations

**Integrations** connect Lira to your existing tools. Each integration goes through:

1. **OAuth flow** — User grants access
2. **Member mapping** — Lira maps org members to external accounts
3. **Bidirectional sync** — Data flows both ways (e.g., tasks to Linear, Slack messages to Lira)

## Personality Modes

Lira has 4 configurable personality modes that change how she participates in meetings:

| Mode | Behavior |
|:---|:---|
| **Supportive** | Encouraging, affirming, builds on ideas |
| **Challenger** | Devil's advocate, questions assumptions |
| **Facilitator** | Keeps discussion on track, ensures everyone is heard |
| **Analyst** | Data-driven, focuses on metrics and evidence |
