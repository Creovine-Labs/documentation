---
slug: /architecture/nova-sonic
sidebar_position: 3
title: Amazon Nova Sonic
---

# Amazon Nova Sonic

Lira uses **Amazon Nova Sonic** (`amazon.nova-sonic-v1:0`) — a speech-to-speech model that handles STT, reasoning, and TTS in a single bidirectional stream.

## What is Nova Sonic?

Unlike traditional pipelines that chain separate STT → LLM → TTS services, Nova Sonic processes everything end-to-end:

- **Speech-to-Text** — Transcribes what participants are saying
- **LLM Reasoning** — Decides what to respond based on context
- **Text-to-Speech** — Generates natural voice output

All in one streaming API call, with sub-second latency.

## Bidirectional Streaming Protocol

Lira uses `InvokeModelWithBidirectionalStreamCommand` from AWS Bedrock:

```typescript
const response = await bedrockClient.send(
  new InvokeModelWithBidirectionalStreamCommand({
    modelId: 'amazon.nova-sonic-v1:0',
    body: inputStream, // Continuous PCM audio input
  })
);

for await (const event of response.body) {
  // Process output events (transcripts, AI audio, etc.)
}
```

## Event Flow

### Input Events (Lira → Nova Sonic)

| Event | Content |
|:---|:---|
| `sessionStart` | Configuration, system prompt, voice settings |
| `audioInput` | Base64-encoded PCM audio chunks (16 kHz, mono) |
| `keepAlive` | Heartbeat every 10 seconds |
| `sessionEnd` | Graceful session termination |

### Output Events (Nova Sonic → Lira)

| Event | Content |
|:---|:---|
| `textOutput` (role=user) | Transcription of what was said |
| `textOutput` (role=assistant) | AI's response text |
| `audioOutput` | PCM voice data to inject into meeting |
| `completionEnd` | AI finished speaking |

## System Prompt & Personality Engine

Each Nova Sonic session receives a system prompt that defines Lira's behavior:

```
You are Lira, an AI meeting participant.

Organization context:
- Company: {org.name}
- Industry: {org.industry}
- Description: {org.description}

Relevant knowledge base context:
{vectorSearchResults}

Personality: {selectedMode} — {modeDescription}

Meeting participants: {participantList}
Current speaker: {activeSpeaker}

Rules:
- Respond in 1-3 sentences unless asked for detail
- Use natural conversational speech
- Respect turn-taking
```

## Keepalive Mechanism

Nova Sonic sessions timeout after ~30 seconds of no input. Lira sends a keepalive event every 10 seconds to maintain the connection:

```typescript
setInterval(() => {
  novaSonic.sendEvent({ type: 'keepAlive' });
}, 10_000);
```

## Barge-In Detection

If someone starts speaking while Lira is responding, Nova Sonic detects the barge-in and Lira:

1. Immediately stops her audio output
2. Clears the output buffer
3. Listens to what the person is saying
4. Responds to the new input

## Output Gating & Wake Word

Nova Sonic processes **all** audio input and generates responses continuously. However, Lira only sends the audio output to the meeting when the [Wake Word system](/architecture/wake-word) detects that Lira was addressed.

This means Nova Sonic does useful work even in "silent" mode — it maintains context and has ready responses.
