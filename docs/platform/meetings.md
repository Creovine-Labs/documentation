---
slug: /platform/meetings
sidebar_position: 1
title: Meetings
---

# Meetings

Lira's core product — an AI participant that joins your Google Meet calls, listens in real-time, and responds with natural voice when addressed.

## How It Works

```
1. User pastes a Google Meet link → clicks "Deploy"
2. Backend launches headless Chromium via Playwright
3. Browser joins Google Meet as "Lira AI"
4. Audio Bridge captures all meeting audio (WebRTC → PCM)
5. Audio streams to Amazon Nova Sonic (speech-to-speech)
6. Nova Sonic transcribes, reasons, and generates voice
7. Wake Word Gate checks if Lira was addressed
8. If yes → audio injected back into meeting as Lira's "mic"
9. All participants hear Lira speak naturally
```

## Features

### Real-Time Voice Participation

Lira doesn't type in chat — she **speaks**. Using Amazon Nova Sonic's speech-to-speech model, Lira processes audio in real-time and responds with natural, conversational voice including appropriate pauses and tone.

### Wake Word Activation

Lira only responds when someone says her name. The 4-layer wake word detection system ensures:

- No false positives from similar-sounding words
- Detection works even when "Lira" is split across audio chunks
- Configurable cooldown to prevent rapid-fire triggers

### Speaker Diarization

Using Deepgram Nova-2, Lira identifies **who is speaking** in real-time. Transcripts show real names (e.g., "John: I think we should...") rather than generic labels. This is achieved through:

1. Deepgram assigns speaker indices from the audio stream
2. DOM scraping correlates indices with participant names from Google Meet
3. The correlation improves as more people speak

### Meeting Summaries

After the meeting, Lira generates summaries via GPT-4o-mini:

- **Short summary** — 4-6 sentence overview of the key discussion points
- **Detailed summary** — 400-700 word breakdown including:
  - Key decisions made
  - Per-person contributions (who said what, who drove the discussion)
  - Action items identified
  - Unresolved questions

### Task Extraction

Lira automatically identifies action items from the conversation and creates structured tasks with:

- Title and description
- Assignee (matched to org members)
- Priority level
- Integration sync (pushed to Linear, GitHub, etc.)

### Voice Commands

| Command | Action |
|:---|:---|
| "Lira, mute yourself" | Lira acknowledges and goes silent |
| "Lira, unmute" | Lira resumes listening and responding |
| "Lira, summarize" | Provides a real-time summary of the discussion so far |
| "Lira, create a task for..." | Extracts and creates a task |

### Auto-Leave

If Lira is the only participant remaining, she automatically leaves after 45 seconds.

### Post-Meeting Email

After the meeting ends, Lira can send email notifications via Resend containing:

- Meeting summary
- Task assignments
- Meeting recording link (if enabled)

Recipients can **reply** to Lira's emails — she'll read the reply, search the knowledge base, and respond or escalate.

## Personality Configuration

Each meeting deployment can use a different personality mode:

| Mode | Description |
|:---|:---|
| Supportive | Encouraging, affirming, builds on ideas |
| Challenger | Devil's advocate, questions assumptions, pushes for rigor |
| Facilitator | Keeps discussion on track, ensures all voices are heard |
| Analyst | Data-driven, focuses on metrics, evidence, and outcomes |

## Demo Meeting

For testing without Google Meet, use the **Browser-based Demo Meeting**:

1. Open the demo from your dashboard
2. Grant microphone access
3. Talk to Lira directly via WebSocket
4. Full AI experience without a Google Meet link
