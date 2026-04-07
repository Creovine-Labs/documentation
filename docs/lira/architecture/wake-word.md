---
sidebar_position: 3
title: Wake Word Detection
description: 4-layer wake word activation system.
---

# Wake Word Detection

Lira uses a 4-layer wake word detection system to determine when the user is addressing the AI, preventing the bot from responding to every utterance.

## Detection Layers

The wake word system processes each transcript segment through four detection layers in sequence. A match at any layer triggers activation:

| Layer | Method | Description |
|:---|:---|:---|
| **1. Exact match** | String comparison | Direct name match (case-insensitive) against the bot's display name |
| **2. Fuzzy Levenshtein** | Edit distance | Catches close misspellings and phonetic variations (e.g. "Leera", "Lyra") |
| **3. Soundex phonetic** | Phonetic encoding | Matches words that sound similar to "Lira" regardless of spelling |
| **4. Rolling buffer** | Transcript window | Scans a rolling window of recent transcript for the wake word across phrase boundaries |

## Bypass Conditions

Wake word detection is **bypassed** in certain scenarios:

- **1-on-1 meetings** — When only one other participant is in the call, Lira responds to everything
- **Direct questions** — Certain phrase patterns that clearly address the bot (e.g. "What do you think?")

## Configuration

The bot's display name (used for wake word matching) is configured via:

```
LIRA_BOT_DISPLAY_NAME=Lira AI
```

This value is set in AWS Secrets Manager under `/lira` and loaded at startup.
