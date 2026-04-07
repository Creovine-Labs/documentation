---
sidebar_position: 1
title: Audio Pipeline
description: End-to-end audio processing architecture in Lira AI.
---

# Audio Pipeline

Lira's audio pipeline handles bidirectional real-time audio between the meeting participant and the AI engine.

## Pipeline Flow

```
Meeting Audio (WebRTC)
    │
    ├──► Amazon Nova Sonic (bidirectional speech-to-speech)
    │       ├── Speech-to-Text
    │       ├── LLM Reasoning
    │       └── Text-to-Speech ──► Meeting Audio Out
    │
    └──► Deepgram Nova-2 (parallel)
            └── Real-time Speaker Diarization
```

## How It Works

1. **Playwright bot** joins the meeting via a headless Chromium browser and establishes a WebRTC audio stream
2. Captured audio is sent to **Amazon Bedrock Nova Sonic** (`amazon.nova-sonic-v1:0`) for bidirectional speech processing
3. The same audio stream is sent in parallel to **Deepgram Nova-2** for real-time speaker identification
4. Nova Sonic's audio responses are injected back into the meeting via the browser's audio output

## Key Behaviors

| Behavior | Description |
|:---|:---|
| **Barge-in support** | Stops talking immediately when interrupted |
| **Session keepalive** | Silent audio frames prevent Nova Sonic from timing out |
| **Auto-leave** | Bot leaves after 45 seconds alone in the meeting |
| **Physical mic mute/unmute** | Voice commands click the actual mic button in Google Meet |
| **Screenshot-on-failure** | Saves PNG debug screenshots when join sequence fails |
| **S3 auth backup** | Google session state backed up to S3, auto-restored on fresh instances |
