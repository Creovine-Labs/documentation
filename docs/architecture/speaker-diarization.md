---
slug: /architecture/speaker-diarization
sidebar_position: 5
title: Speaker Diarization
---

# Speaker Diarization

Lira identifies **who is speaking** in real-time using Deepgram Nova-2, combined with DOM-based participant name scraping from Google Meet.

## Why Deepgram?

Google Meet provides a mixed audio stream — all participants' voices are combined. Lira needs to know who said what for:

- Speaker-attributed transcripts ("John: I think we should...")
- Per-person contribution analysis in summaries
- Accurate task assignment ("Sarah mentioned she'd handle the design")

## How It Works

### 1. Deepgram Streaming

Meeting audio is streamed to Deepgram Nova-2 in parallel with Nova Sonic:

```
Audio Bridge → PCM audio → Deepgram WebSocket
  → Real-time transcripts with speaker indices
  → { text: "I think we should...", speaker: 0 }
```

### 2. DOM Participant Scraping

Simultaneously, Lira's browser automation scrapes Google Meet's UI to get participant names:

```
Google Meet DOM → Participant list
  → ["John Smith", "Sarah Chen", "Lira AI"]
```

### 3. Speaker Index → Name Correlation

Deepgram assigns numeric speaker indices (0, 1, 2...). Lira correlates these with real names by:

1. Detecting which participant has the "speaking" indicator in the DOM
2. Mapping the active Deepgram speaker index to that participant
3. Building a correlation table that improves as more people speak

```
Speaker 0 → "John Smith" (correlated after John spoke first)
Speaker 1 → "Sarah Chen" (correlated after Sarah responded)
Speaker 2 → "Lira AI"   (known — it's the bot)
```

### 4. Named Transcripts

Every message stored in DynamoDB includes the speaker's real name:

```json
{
  "speaker": "John Smith",
  "text": "I think we should redesign the homepage",
  "timestamp": "2026-03-29T10:15:32Z",
  "sentiment": "neutral"
}
```

## Deepgram Configuration

```typescript
const deepgramConfig = {
  model: 'nova-2',
  language: 'en',
  smart_format: true,
  diarize: true,
  interim_results: true,
  endpointing: 300,
  sample_rate: 16000,
  channels: 1,
  encoding: 'linear16',
};
```

## Graceful Degradation

If Deepgram is unavailable, Lira falls back to:

1. DOM-only speaker detection (less accurate, polling-based)
2. Generic "Participant" labels if DOM scraping also fails
3. Full transcription still works — just without attribution

## Accuracy & Limitations

- **2-3 speakers**: ~95% accuracy after initial correlation
- **4-6 speakers**: ~85% accuracy
- **7+ speakers**: Accuracy decreases as voices become harder to distinguish
- **Overlapping speech**: May misattribute during crosstalk
