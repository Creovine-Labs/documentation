---
slug: /architecture/overview
sidebar_position: 1
title: Architecture Overview
---

# Architecture Overview

Lira AI is a full-stack platform with a React frontend hosted on Vercel, a Fastify backend on AWS EC2, and deep integrations with AWS Bedrock, Deepgram, and OpenAI.

## Technology Stack

### Frontend

| Technology | Purpose |
|:---|:---|
| React 19 | UI framework |
| TypeScript ~5.9 | Type safety |
| Vite 7 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| Zustand 5 | State management |
| Zod 4 | Runtime schema validation |
| React Router 7 | Client-side routing |

### Backend

| Technology | Purpose |
|:---|:---|
| Fastify 4 | Node.js HTTP framework |
| TypeScript 5.3 | Type safety |
| Playwright 1.58 | Headless Chromium browser automation |
| @fastify/websocket | Real-time audio streaming |
| @fastify/jwt | JWT authentication |
| @fastify/swagger | OpenAPI documentation |
| Resend | Transactional email delivery |

### AI & Audio

| Technology | Purpose |
|:---|:---|
| Amazon Nova Sonic | Speech-to-speech model (STT + LLM + TTS) |
| AWS Bedrock | Streaming inference API |
| OpenAI GPT-4o-mini | Summaries, titles, evaluations, resume parsing |
| Deepgram Nova-2 | Real-time speaker diarization |
| Web Audio API | Browser audio capture and injection |
| WebRTC | Meeting audio transport |

## High-Level Architecture

```
┌─────────────────────────────────────────────┐
│              USER'S BROWSER                 │
│                                             │
│   liraintelligence.com (Vercel)             │
│   ┌─────────────────────────────────────┐   │
│   │  React SPA                          │   │
│   │  Bot Deploy Panel | Demo Meeting    │   │
│   └──────────┬──────────────┬───────────┘   │
│              │ REST          │ WSS           │
└──────────────┼──────────────┼───────────────┘
               │              │
               ▼              ▼
┌─────────────────────────────────────────────┐
│      EC2 BACKEND (api.creovine.com)         │
│                                             │
│   Fastify Server                            │
│   ├── Bot Manager → Meeting Bot             │
│   │   ├── Playwright (headless Chromium)    │
│   │   ├── Google Meet Driver                │
│   │   └── Audio Bridge (PCM ↔ WebRTC)      │
│   ├── Nova Sonic Service (AWS Bedrock)      │
│   ├── Wake Word Service (4-layer detection) │
│   ├── Deepgram Service (speaker diarization)│
│   ├── DynamoDB Store                        │
│   └── Integration Services (9 providers)    │
└─────────────────────────────────────────────┘
```

## Data Flow — Meeting Audio to AI Response

```
Participant speaks in Google Meet
  → WebRTC delivers audio to Lira's headless browser
  → Audio Bridge captures via RTCPeerConnection.ontrack
  → AudioContext (16 kHz) → ScriptProcessorNode → PCM → base64
  → page.exposeFunction bridges to Node.js
  → Echo Gate: is Lira outputting? YES → drop, NO → forward
  → Nova Sonic processes: STT → LLM → TTS
  → Wake Word Gate: was Lira addressed? NO → discard, YES → forward
  → Audio Bridge injects PCM → AudioBuffer → MediaStreamDestination
  → getUserMedia override returns stream as Lira's "mic"
  → All participants hear Lira respond
```

## Component Map

```
Backend (creovine-api/src/)
├── routes/
│   ├── lira-bot.routes.ts          — Bot deploy/status/terminate
│   ├── lira-meetings.routes.ts     — Meeting CRUD + summaries
│   ├── lira-organizations.routes.ts — Org management
│   ├── lira-interviews.routes.ts   — Interview management
│   └── lira-integrations.routes.ts — Integration OAuth flows
├── services/
│   ├── lira-bot/
│   │   ├── bot-manager.service.ts  — Orchestrator
│   │   ├── meeting-bot.ts          — Browser lifecycle
│   │   ├── audio-bridge.ts         — Bidirectional audio
│   │   └── drivers/
│   │       └── google-meet.driver.ts
│   ├── lira-sonic.service.ts       — Nova Sonic streaming
│   ├── lira-wakeword.service.ts    — Wake word detection
│   ├── lira-store.service.ts       — DynamoDB persistence
│   ├── lira-ai.service.ts          — GPT-4o-mini summaries
│   ├── lira-embedding.service.ts   — OpenAI embeddings
│   └── lira-vector-search.service.ts — Qdrant search
└── models/
    ├── lira.models.ts              — Core data types
    └── lira-bot.models.ts          — Bot config types

Frontend (lira_ai/src/)
├── pages/                          — Route pages
├── components/
│   ├── bot-deploy/                 — Bot deployment UI
│   ├── meeting-room/               — Live meeting UI
│   ├── ai/                         — AI interaction components
│   └── org/                        — Organization management
├── features/
│   ├── meeting/                    — Meeting state & hooks
│   ├── interview/                  — Interview management
│   └── participants/               — Participant management
├── services/                       — API client layer
└── app/store/                      — Zustand stores
```

See the deep-dive pages for each subsystem:

- [Audio Pipeline](/architecture/audio-pipeline)
- [Nova Sonic](/architecture/nova-sonic)
- [Wake Word Detection](/architecture/wake-word)
- [Speaker Diarization](/architecture/speaker-diarization)
- [Organization Context System](/architecture/organization-context)
