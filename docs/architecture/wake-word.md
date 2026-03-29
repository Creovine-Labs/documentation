---
slug: /architecture/wake-word
sidebar_position: 4
title: Wake Word Detection
---

# Wake Word Detection

Lira uses a 4-layer detection architecture to determine when she's been addressed by name. This ensures she only speaks when invited, with minimal false positives.

## The Problem with Speech-to-Text

A naive approach would be: transcribe everything → search for "Lira" → respond. But this fails because:

- STT chunks often split words across boundaries (e.g., "Li" in one chunk, "ra" in the next)
- Similar-sounding words trigger false positives
- Latency between speech and transcription causes delayed responses

## Four-Layer Detection Architecture

### Layer 1: Rolling Transcript Buffer

Maintains a sliding window of the last N transcript chunks. Instead of checking each chunk individually, the system searches the **combined** recent text:

```
Chunk 1: "...and that's what I think, Li"
Chunk 2: "ra can you weigh in?"
Combined: "...and that's what I think, Lira can you weigh in?"
→ MATCH
```

### Layer 2: Phonetic Fuzzy Match

Handles pronunciation variations and transcription errors:

- "Lira" ✅
- "Leera" ✅
- "Lyra" ✅
- "Mirror" ❌
- "Liar" ❌

### Layer 3: Context Scoring

Evaluates whether the mention is actually addressing Lira vs. just mentioning the name:

- "Lira, what do you think?" → High confidence (direct address)
- "I used Lira yesterday" → Low confidence (not addressing)
- "Hey Lira" → High confidence (greeting)

### Layer 4: Cooldown Window

After Lira responds, a cooldown period prevents:

- Re-triggering from her own name in the response
- Rapid-fire triggers from echoed audio
- Double activations from repeated calls

```
Detection → Response → 3-second cooldown → Listening again
```

## Configuration

Wake word behavior can be tuned per deployment:

| Parameter | Default | Description |
|:---|:---|:---|
| Wake word | "Lira" | The trigger word |
| Buffer size | 5 chunks | Rolling window size |
| Cooldown | 3 seconds | Minimum time between activations |
| Confidence threshold | 0.7 | Minimum detection confidence |
