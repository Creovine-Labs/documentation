---
sidebar_position: 2
title: Nova Sonic
description: Amazon Bedrock Nova Sonic — bidirectional speech AI engine.
---

# Nova Sonic

Lira uses **Amazon Bedrock Nova Sonic** (`amazon.nova-sonic-v1:0`) as the core speech AI engine providing bidirectional speech-to-speech processing.

## Capabilities

Nova Sonic combines three operations in a single bidirectional stream:

1. **Speech-to-Text** — Transcribes incoming audio in real-time
2. **LLM Reasoning** — Processes the transcription with context (system prompt, org knowledge base, meeting history)
3. **Text-to-Speech** — Generates natural-sounding voice responses

## Configuration

| Variable | Value | Description |
|:---|:---|:---|
| `LIRA_BEDROCK_REGION` | `us-east-1` | AWS region for Bedrock API calls |
| `LIRA_NOVA_SONIC_MODEL_ID` | `amazon.nova-sonic-v1:0` | Model identifier |

## Context Injection

Before Nova Sonic processes a response, `lira-context-builder.service.ts` assembles relevant context:

1. **Organization knowledge base** — Vector search results from Qdrant
2. **Meeting transcript** — Recent conversation history with speaker attribution
3. **Personality mode** — System prompt variation (Supportive, Challenger, Facilitator, Analyst)
4. **Integration data** — Relevant data from connected tools (Linear issues, calendar events, etc.)

## Session Management

- **Keepalive** — Silent audio frames are sent periodically to prevent session timeout
- **Barge-in** — Nova Sonic stops generating audio when new input is detected mid-response
- **Error recovery** — On connection failure, the bot logs the error and attempts to re-establish the stream
