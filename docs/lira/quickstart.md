---
sidebar_position: 2
title: Quickstart
description: Deploy Lira AI to your first meeting.
---

# Lira AI Quickstart

Deploy Lira to a Google Meet call in under 5 minutes.

## Prerequisites

- A Creovine account with Lira AI access
- A Google Meet link

## 1. Create an Organization

```bash
POST /lira/v1/orgs
Authorization: Bearer <jwt>

{"name": "My Company", "industry": "Technology"}
```

## 2. Deploy a Bot

```bash
POST /lira/v1/bot/deploy
Authorization: Bearer <jwt>

{
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "orgId": "your-org-id",
  "settings": {
    "personality": "supportive",
    "wake_word_enabled": true,
    "ai_name": "Lira"
  }
}
```

Within seconds, **Lira AI** appears as a participant in the meeting.

## 3. Talk to Lira

Say "Hey Lira" followed by your question. Lira responds with natural speech powered by Amazon Nova Sonic.

## 4. Get a Summary

After the meeting ends:

```bash
GET /lira/v1/meetings/:meetingId/summary?mode=short
Authorization: Bearer <jwt>
```

## What Happens Under the Hood

1. `POST /bot/deploy` launches a headless Playwright browser on EC2
2. Bot navigates to Google Meet, joins as "Lira AI"
3. Audio intercepted via `getUserMedia` override → streamed to Nova Sonic
4. Deepgram provides real-time speaker diarization
5. Nova Sonic responds with speech → injected back into meeting audio
6. Transcript streamed to frontend via WebSocket

## Personality Modes

| Mode | Behavior |
|:---|:---|
| `supportive` | Encouraging, affirming, collaborative |
| `challenger` | Direct, questioning, pushes for clarity |
| `facilitator` | Neutral, guides discussion, ensures participation |
| `analyst` | Data-focused, structured, detail-oriented |
