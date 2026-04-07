---
sidebar_position: 3
title: Meetings
description: AI meeting participation — real-time voice, transcription, summaries, and task extraction.
---

# Meetings

Lira joins Google Meet calls as a real participant, listens in real-time, and responds with natural speech when addressed by name.

## How It Works

1. **Deploy** — `POST /lira/v1/bot/deploy` with a meeting URL
2. **Join** — Playwright bot navigates to Google Meet, joins the call
3. **Listen** — Audio captured via WebRTC `getUserMedia` override, streamed to Nova Sonic
4. **Identify** — Deepgram provides real-time speaker diarization with name attribution
5. **Respond** — Nova Sonic generates speech responses, injected into meeting audio
6. **Summarize** — GPT-4o-mini generates meeting summaries after the call

## Key Behaviors

| Behavior | Description |
|:---|:---|
| **Wake word** | Only responds when addressed by name (configurable). 4-layer detection. |
| **Speaker ID** | Each transcript line tagged with the speaker's real name |
| **Physical mic** | Voice commands click the actual mic button in Google Meet |
| **Barge-in** | Stops talking immediately when interrupted |
| **Auto-leave** | Leaves after 45 seconds if alone in the meeting |
| **Echo gate** | Prevents Lira from hearing her own output |

## Settings

Update AI settings mid-meeting via:

```bash
PUT /lira/v1/meetings/:id/settings
Authorization: Bearer <jwt>

{
  "personality": "challenger",
  "wake_word_enabled": false,
  "summary_mode": "detailed"
}
```

## Summaries

Two summary modes:

| Mode | Output |
|:---|:---|
| `short` | 4–6 sentence overview |
| `detailed` | 400–700 word breakdown with per-person contributions |

```bash
GET /lira/v1/meetings/:id/summary?mode=detailed
```

## Task Extraction

Lira automatically extracts action items from the meeting and creates tasks. Tasks can be synced to Linear, GitHub, Slack, or email.

See [Tasks API](/api/lira/tasks) for details.
