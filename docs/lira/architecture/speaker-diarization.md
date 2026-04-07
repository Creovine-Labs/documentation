---
sidebar_position: 4
title: Speaker Diarization
description: Real-time speaker identification with Deepgram Nova-2.
---

# Speaker Diarization

Lira uses **Deepgram Nova-2** for real-time speaker diarization — identifying who is speaking at any moment during the meeting.

## How It Works

1. Meeting audio is sent to Deepgram in parallel with the Nova Sonic stream
2. Deepgram returns speaker indices (Speaker 0, Speaker 1, etc.) in real-time
3. Lira correlates these indices with **participant names scraped from the meeting DOM**
4. The correlation uses a **4-second alignment window** to match Deepgram's speaker change events with visible participant highlights in Google Meet

## Name Resolution

```
Deepgram Speaker Index  ←→  DOM Participant Name
        (4s window)
```

| Step | Action |
|:---|:---|
| 1 | Deepgram reports a speaker change (e.g. "Speaker 2 started talking") |
| 2 | Playwright scrapes the Google Meet participant list DOM within a 4-second window |
| 3 | The active speaker highlight in the DOM is matched to the Deepgram speaker index |
| 4 | Once a mapping is established, it persists for the duration of the meeting |

## Fallback

If Deepgram is unavailable (e.g. API key not configured or service error), Lira falls back to **DOM-only polling** — periodically scraping the active speaker indicator from the meeting UI. This provides speaker attribution but with lower accuracy than the Deepgram-based approach.

## Configuration

| Variable | Description |
|:---|:---|
| `DEEPGRAM_API_KEY` | Deepgram API key (optional — falls back to DOM-only if not set) |

## Transcript Output

With diarization enabled, transcripts include speaker names:

```json
{
  "segments": [
    { "speaker": "John Smith", "text": "Let's discuss the Q3 roadmap.", "timestamp": "00:02:15" },
    { "speaker": "Sarah Chen", "text": "I think we should prioritize the API redesign.", "timestamp": "00:02:22" },
    { "speaker": "Lira AI", "text": "Based on Linear, the API redesign has 3 open issues.", "timestamp": "00:02:30" }
  ]
}
```
