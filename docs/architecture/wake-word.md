---
slug: /architecture/wake-word
sidebar_position: 4
title: Wake Word Detection
---

# Wake Word Detection

Lira uses a **3-layer detection architecture** (`lira-wakeword.service.ts`, 261 lines) to determine when she's been addressed by name. This ensures she only speaks when invited, with minimal false positives.

## The Problem with Speech-to-Text

A naive approach would be: transcribe everything → search for "Lira" → respond. But this fails because:

- STT chunks often split words across boundaries (e.g., "Li" in one chunk, "ra" in the next)
- Similar-sounding words trigger false positives
- Latency between speech and transcription causes delayed responses

## Three-Layer Detection

### Layer 1: Exact Match

Case-insensitive word boundary regex matching against the configured name plus a set of hardcoded STT variants (common misheard versions of "Lira"):

- "Lira" ✅
- "Leera" ✅ (known STT variant)
- "Lyra" ✅ (known STT variant)
- "Mirror" ❌
- "Liar" ❌

### Layer 2: Levenshtein (Fuzzy Match)

For words that don't exact-match, a Levenshtein distance calculation with a threshold based on word length. Shorter words require closer matches to avoid false positives.

### Layer 3: Soundex (Phonetic Match)

Phonetic matching using the Soundex algorithm — catches pronunciation variations that may differ in spelling but sound similar.

### Detection Result

```typescript
{
  detected: boolean,
  confidence: 'high' | 'medium' | 'low',
  matchedWord: string
}
```

| Confidence | Triggered By |
|:---|:---|
| `high` | Exact match |
| `medium` | Levenshtein match |
| `low` | Soundex match |

## Cooldown System

After Lira responds, a cooldown period prevents re-triggering:

| Cooldown | Duration | Purpose |
|:---|:---|:---|
| General | **45 seconds** | Prevents rapid-fire triggers |
| Meeting | **30 seconds** | Shorter cooldown during active meeting discussion |

The `isWithinCooldown()` method checks elapsed time since last activation.

```
Detection → Response → 30–45s cooldown → Listening again
```

## Configuration

Wake word behavior is configured per bot deployment via the `settings` object:

| Parameter | Default | Description |
|:---|:---|:---|
| `wake_word_enabled` | `true` | Enable/disable wake word detection |
| `ai_name` | `"Lira"` | The trigger word to listen for |
