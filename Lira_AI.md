# Lira AI — Complete Project Documentation

> **An AI-powered voice participant that joins Google Meet and Zoom meetings in real-time, listens to conversations, and responds intelligently when addressed by name.**

*Last updated: March 2026*

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
  - [1.1 What is Lira AI?](#11-what-is-lira-ai)
  - [1.2 The Problem It Solves](#12-the-problem-it-solves)
  - [1.3 Key Capabilities](#13-key-capabilities)
- [2. Technology Stack](#2-technology-stack)
  - [2.1 Frontend](#21-frontend)
  - [2.2 Backend](#22-backend)
  - [2.3 AI & Audio](#23-ai--audio)
  - [2.4 Infrastructure](#24-infrastructure)
- [3. Architecture Overview](#3-architecture-overview)
  - [3.1 High-Level Architecture](#31-high-level-architecture)
  - [3.2 Data Flow — From Meeting Audio to AI Response](#32-data-flow--from-meeting-audio-to-ai-response)
  - [3.3 Component Map](#33-component-map)
- [4. Google Meet Integration — The Hard Part](#4-google-meet-integration--the-hard-part)
  - [4.1 Why Browser Automation?](#41-why-browser-automation)
  - [4.2 Creating the Bot's Google Account](#42-creating-the-bots-google-account)
  - [4.3 Capturing Authentication State](#43-capturing-authentication-state)
  - [4.4 Silent Auth Refresh](#44-silent-auth-refresh)
  - [4.5 The Google Meet Driver](#45-the-google-meet-driver)
  - [4.6 Chromium Launch Configuration](#46-chromium-launch-configuration)
- [5. The Audio Pipeline — Bidirectional Audio in a Headless Browser](#5-the-audio-pipeline--bidirectional-audio-in-a-headless-browser)
  - [5.1 The Challenge](#51-the-challenge)
  - [5.2 Audio Bridge Architecture](#52-audio-bridge-architecture)
  - [5.3 Capture Path (Meeting → Lira)](#53-capture-path-meeting--lira)
  - [5.4 Injection Path (Lira → Meeting)](#54-injection-path-lira--meeting)
  - [5.5 The Echo Gate](#55-the-echo-gate)
  - [5.6 getUserMedia Override](#56-getusermedia-override)
  - [5.7 RTCPeerConnection Interception](#57-rtcpeerconnection-interception)
- [6. Amazon Nova Sonic — Speech-to-Speech AI](#6-amazon-nova-sonic--speech-to-speech-ai)
  - [6.1 What is Nova Sonic?](#61-what-is-nova-sonic)
  - [6.2 Bidirectional Streaming Protocol](#62-bidirectional-streaming-protocol)
  - [6.3 Event Flow](#63-event-flow)
  - [6.4 System Prompt & Personality Engine](#64-system-prompt--personality-engine)
  - [6.5 Keepalive Mechanism](#65-keepalive-mechanism)
  - [6.6 Barge-In Detection](#66-barge-in-detection)
  - [6.7 Output Gating & Wake Word Integration](#67-output-gating--wake-word-integration)
  - [6.8 Mute / Unmute via Voice Commands](#68-mute--unmute-via-voice-commands)
- [7. Wake Word Detection System](#7-wake-word-detection-system)
  - [7.1 The Problem with Speech-to-Text](#71-the-problem-with-speech-to-text)
  - [7.2 Four-Layer Detection Architecture](#72-four-layer-detection-architecture)
  - [7.3 Rolling Transcript Buffer](#73-rolling-transcript-buffer)
  - [7.4 Cooldown Window](#74-cooldown-window)
- [8. Backend Architecture](#8-backend-architecture)
  - [8.1 Server & Framework](#81-server--framework)
  - [8.2 Bot Manager — The Orchestrator](#82-bot-manager--the-orchestrator)
  - [8.3 Meeting Bot — Browser Lifecycle](#83-meeting-bot--browser-lifecycle)
  - [8.4 REST API Routes](#84-rest-api-routes)
  - [8.5 WebSocket Routes](#85-websocket-routes)
  - [8.6 DynamoDB Store](#86-dynamodb-store)
  - [8.7 Data Models](#87-data-models)
- [9. Frontend Architecture](#9-frontend-architecture)
  - [9.1 Project Structure](#91-project-structure)
  - [9.2 Authentication Flow](#92-authentication-flow)
  - [9.3 Bot Deploy Panel — The Main Feature](#93-bot-deploy-panel--the-main-feature)
  - [9.4 Browser-Based Demo Meeting](#94-browser-based-demo-meeting)
  - [9.5 State Management](#95-state-management)
  - [9.6 API Service Layer](#96-api-service-layer)
- [10. Infrastructure & Deployment](#10-infrastructure--deployment)
  - [10.1 AWS Resources](#101-aws-resources)
  - [10.2 EC2 Server Setup](#102-ec2-server-setup)
  - [10.3 Vercel Frontend Deployment](#103-vercel-frontend-deployment)
  - [10.4 DNS Configuration](#104-dns-configuration)
  - [10.5 Deployment Script](#105-deployment-script)
  - [10.6 Environment Variables](#106-environment-variables)
- [11. Challenges & Solutions](#11-challenges--solutions)
  - [11.1 Echo — Lira Hearing Herself](#111-echo--lira-hearing-herself)
  - [11.2 Wake Word Splitting Across STT Chunks](#112-wake-word-splitting-across-stt-chunks)
  - [11.3 Getting Stuck on Mute](#113-getting-stuck-on-mute)
  - [11.4 Double Voice Output](#114-double-voice-output)
  - [11.5 Nova Sonic Session Timeouts](#115-nova-sonic-session-timeouts)
  - [11.6 Auto-Leaving Empty Meetings](#116-auto-leaving-empty-meetings)
  - [11.7 Google Meet UI Selector Fragility](#117-google-meet-ui-selector-fragility)
  - [11.8 Multi-Turn Echo Gate — Nova Sonic Splitting Long Responses](#118-multi-turn-echo-gate--nova-sonic-splitting-long-responses)
  - [11.9 Speaker Identification Without Per-Stream Access](#119-speaker-identification-without-per-stream-access)
- [12. How It All Connects — End-to-End Walkthrough](#12-how-it-all-connects--end-to-end-walkthrough)
- [13. Repository Structure](#13-repository-structure)
- [14. Running Locally](#14-running-locally)
- [15. Known Limitations & Future Work](#15-known-limitations--future-work)
  - [15.1 Single Bot Account](#151-single-bot-account)
  - [15.2 EC2 Sizing](#152-ec2-sizing)
  - [15.3 ScriptProcessorNode Deprecation](#153-scriptprocessornode-deprecation)
  - [15.4 Rolling Wake Word Buffer — Cross-Speaker Context](#154-rolling-wake-word-buffer--cross-speaker-context)
  - [15.5 Zoom Support](#155-zoom-support)
  - [15.6 Two Audio Code Paths](#156-two-audio-code-paths)
  - [15.7 Speaker Identification Accuracy](#157-speaker-identification-accuracy)
- [16. Speaker Identification System](#16-speaker-identification-system)
  - [16.1 Overview](#161-overview)
  - [16.2 Architecture](#162-architecture)
  - [16.3 Participant Name Scraping](#163-participant-name-scraping)
  - [16.4 Active Speaker Detection](#164-active-speaker-detection)
  - [16.5 System Prompt Enrichment](#165-system-prompt-enrichment)
  - [16.6 Polling Strategy](#166-polling-strategy)
  - [16.7 Speaker-Attributed Transcripts](#167-speaker-attributed-transcripts)
  - [16.8 Accuracy & Limitations](#168-accuracy--limitations)

---

## 1. Project Overview

### 1.1 What is Lira AI?

Lira AI is an intelligent voice participant for video conference meetings. You paste a Google Meet link into the Lira dashboard, press "Send Lira to Meeting," and within seconds a new participant named **"Lira AI"** appears in the meeting. Lira listens to the entire conversation in real-time, and when someone says her name — "Hey Lira, what do you think?" — she responds with a natural, conversational voice.

Lira is not a transcription tool or a post-meeting summary bot. She is a **live participant** who hears, understands, and speaks — in real-time, during the meeting itself.

### 1.2 The Problem It Solves

Meetings are where decisions happen, but they often lack structure, context recall, and follow-through. Lira acts as an always-attentive participant who:

- **Never misses context** — she listens to 100% of the conversation, not just when you're paying attention
- **Responds on demand** — say her name and she'll summarise, challenge, suggest, or facilitate
- **Participates naturally** — uses voice (not chat), speaks in 1–3 sentences, and respects conversational flow
- **Adapts personality** — can be supportive, a devil's advocate, a facilitator, or analytical
- **Mutes on command** — "Lira, mute yourself" → she acknowledges and goes silent until unmuted

### 1.3 Key Capabilities

| Capability | Description |
|---|---|
| **Real-time voice participation** | Joins as a named participant, listens and speaks via WebRTC audio |
| **Wake word activation** | Only responds when addressed by name (configurable) |
| **4 personality modes** | Supportive, Challenger, Facilitator, Analyst |
| **Voice mute/unmute** | Physical mic toggle in Google Meet via voice commands |
| **Barge-in support** | Stops talking immediately when interrupted |
| **Auto-leave** | Leaves after 45 seconds alone in an empty meeting |
| **Transcript storage** | All conversation is stored in DynamoDB with sentiment tags |
| **Meeting summaries** | AI-generated summaries of any meeting session |
| **Auth session management** | Auto-refreshes Google login cookies every 7 days |
| **Multi-platform** | Architecture supports Google Meet and Zoom |

---

## 2. Technology Stack

### 2.1 Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript ~5.9** | Type safety |
| **Vite 7** | Build tool and dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Zustand 5** | Lightweight state management |
| **Zod 4** | Runtime schema validation |
| **React Router 7** | Client-side routing |
| **@react-oauth/google** | Google Sign-In integration |
| **Lucide React** | Icon library |
| **Radix UI** | Accessible primitives (dialog, tabs, tooltip, etc.) |

### 2.2 Backend

| Technology | Purpose |
|---|---|
| **Fastify 4** | High-performance Node.js HTTP framework |
| **TypeScript 5.3** | Type safety |
| **Playwright 1.58** | Headless Chromium browser automation |
| **Zod 3** | Request validation |
| **@fastify/websocket** | WebSocket support for real-time audio |
| **@fastify/jwt** | JWT authentication |
| **@fastify/swagger** | OpenAPI documentation |
| **Prisma 5** | Database ORM (PostgreSQL for platform data) |
| **uuid** | Session/bot ID generation |

### 2.3 AI & Audio

| Technology | Purpose |
|---|---|
| **Amazon Nova Sonic** (`amazon.nova-sonic-v1:0`) | Speech-to-speech model — STT + LLM + TTS in one bidirectional stream |
| **AWS Bedrock** (`InvokeModelWithBidirectionalStreamCommand`) | Streaming inference API |
| **Web Audio API** | In-browser audio capture and injection |
| **WebRTC** | Meeting audio transport (intercepted, not implemented) |

### 2.4 Infrastructure

| Resource | Purpose |
|---|---|
| **AWS EC2** (`t3.small`, `52.206.83.13`) | Backend server (Ubuntu 22.04) |
| **AWS DynamoDB** | Meeting sessions + transcripts (`lira-meetings`, `lira-connections`) |
| **AWS S3** | Audio recording storage |
| **AWS Secrets Manager** | Database credentials |
| **Vercel** | Frontend hosting (`lira.creovine.com`) |
| **Namecheap DNS** | Domain management |
| **systemd** | Process management (`creovine-api.service`) |

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                                  │
│                                                                          │
│   lira.creovine.com (Vercel)                                            │
│   ┌────────────────────────────────────────┐                            │
│   │  React SPA                             │                            │
│   │  ┌──────────────────┐  ┌────────────┐  │                            │
│   │  │  Bot Deploy Panel │  │ Demo Meeting│  │                            │
│   │  │  Paste Meet link  │  │ Browser mic │  │                            │
│   │  │  → Deploy bot     │  │ → WebSocket │  │                            │
│   │  └────────┬─────────┘  └──────┬─────┘  │                            │
│   └───────────┼───────────────────┼────────┘                            │
│               │ REST              │ WSS                                   │
└───────────────┼───────────────────┼──────────────────────────────────────┘
                │                   │
                ▼                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   EC2 BACKEND (api.creovine.com)                         │
│                                                                          │
│   Fastify Server                                                         │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │  /lira/v1/bot/deploy  ──────► Bot Manager                       │   │
│   │                                    │                             │   │
│   │                         ┌──────────▼──────────┐                  │   │
│   │                         │    Meeting Bot       │                  │   │
│   │                         │  ┌────────────────┐  │                  │   │
│   │                         │  │  Playwright     │  │                  │   │
│   │                         │  │  Chromium       │  │                  │   │
│   │                         │  │  (headless)     │  │                  │   │
│   │                         │  │                 │  │                  │   │
│   │                         │  │  Google Meet    │─────► Google Meet  │   │
│   │                         │  │  Driver         │  │    servers      │   │
│   │                         │  │                 │  │                  │   │
│   │                         │  │  Audio Bridge   │  │                  │   │
│   │                         │  └───────┬─────────┘  │                  │   │
│   │                         └──────────┼────────────┘                  │   │
│   │                                    │ PCM audio                     │   │
│   │                         ┌──────────▼──────────┐                    │   │
│   │                         │  Nova Sonic Service  │                    │   │
│   │                         │  (Bedrock streaming) │──────► AWS Bedrock│   │
│   │                         │                      │                    │   │
│   │                         │  Wake Word Service   │                    │   │
│   │                         └──────────────────────┘                    │   │
│   │                                                                      │   │
│   │  /lira/v1/meetings  ──────► DynamoDB Store                          │   │
│   │  /lira/v1/ws         ──────► WebSocket Handler                      │   │
│   └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow — From Meeting Audio to AI Response

Here is exactly what happens when a meeting participant speaks and Lira responds:

```
1. Participant speaks in Google Meet
        │
        ▼
2. WebRTC delivers audio to all participants
   (including Lira's headless Chromium browser)
        │
        ▼
3. RTCPeerConnection.ontrack fires in Lira's browser
   Audio Bridge intercepts the remote audio stream
        │
        ▼
4. AudioContext (16 kHz) → ScriptProcessorNode
   Float32 samples → Int16 PCM → base64 encoding
        │
        ▼
5. page.exposeFunction('__liraOnAudioCapture')
   Bridges from browser context to Node.js
        │
        ▼
6. Echo Gate check: is Lira currently outputting audio?
   YES → drop the frame (prevents feedback loop)
   NO  → forward to Nova Sonic
        │
        ▼
7. Nova Sonic Service pushes PCM into the bidirectional stream
   (aws bedrock InvokeModelWithBidirectionalStreamCommand)
        │
        ▼
8. Nova Sonic processes in real-time:
   - Speech-to-Text (transcribes what was said)
   - LLM reasoning (decides what to say)
   - Text-to-Speech (generates voice response)
        │
        ▼
9. Output stream delivers events:
   - textOutput (role=user) → transcript
   - textOutput (role=assistant) → AI response text
   - audioOutput → PCM voice data
        │
        ▼
10. Wake Word Gate: was Lira's name mentioned?
    NO  → discard AI audio output (stay silent)
    YES → forward audio to the meeting
        │
        ▼
11. Audio Bridge receives PCM (24 kHz)
    base64 → Int16 → Float32 → AudioBuffer
        │
        ▼
12. AudioBufferSourceNode → MediaStreamDestination (48 kHz)
    Scheduled for gapless playback
        │
        ▼
13. getUserMedia override returns this custom stream
    as Lira's "microphone" to Google Meet's WebRTC
        │
        ▼
14. All meeting participants hear Lira speak
```

### 3.3 Component Map

```
Backend (creovine-api)
├── src/routes/
│   ├── lira-bot.routes.ts        — REST API for bot deploy/status/terminate
│   └── lira-meetings.routes.ts   — REST API for meeting CRUD + summaries
├── src/services/
│   ├── lira-bot/
│   │   ├── bot-manager.service.ts — Orchestrator: deploys bots, wires audio
│   │   ├── meeting-bot.ts         — Browser lifecycle (launch → join → capture)
│   │   ├── audio-bridge.ts        — Bidirectional audio pipe (browser ↔ Node.js)
│   │   ├── auth-refresh.ts        — Silent Google session renewal
│   │   └── drivers/
│   │       ├── google-meet.driver.ts — Google Meet UI automation
│   │       └── zoom.driver.ts        — Zoom UI automation (Phase 2)
│   ├── lira-sonic.service.ts      — Nova Sonic bidirectional streaming
│   ├── lira-wakeword.service.ts   — 4-layer wake word detection
│   ├── lira-store.service.ts      — DynamoDB persistence
│   └── lira-ai.service.ts         — Meeting summaries (Nova Lite)
├── src/models/
│   ├── lira.models.ts             — Meeting, Message, SonicSession types
│   └── lira-bot.models.ts         — BotConfig, BotState, platform detection
└── deploy-auto.sh                 — One-command production deployment

Frontend (lira_ai)
├── src/pages/
│   ├── HomePage.tsx               — Login + Bot Deploy + Demo meeting start
│   └── MeetingPage.tsx            — Browser-based demo meeting UI
├── src/components/
│   └── bot-deploy/
│       ├── BotDeployPanel.tsx     — Paste link → deploy → status tracking
│       └── AuthStatusCard.tsx     — Google session health indicator
├── src/services/
│   └── api/index.ts               — REST + bot deploy + auth status API client
├── src/features/
│   └── meeting/use-audio-meeting.ts — Full audio meeting lifecycle hook
├── src/app/
│   └── store/index.ts             — Zustand stores (auth, meeting, bot)
└── src/env.ts                      — Runtime environment config (Zod validated)
```

---

## 4. Google Meet Integration — The Hard Part

### 4.1 Why Browser Automation?

Google Meet has no public API for joining meetings programmatically. There is no SDK, no REST endpoint, no WebSocket you can connect to. The only way to join a Google Meet meeting is the same way a human does: open a browser, navigate to the meeting URL, enter a name, and click "Join now."

This means Lira literally runs a **headless Chromium browser** (via Playwright) that:
1. Navigates to `https://meet.google.com/xxx-yyy-zzz`
2. Dismisses popups
3. Turns off the camera
4. Enters the name "Lira AI"
5. Clicks the "Join now" button
6. Waits to be admitted (if there's a waiting room)
7. Once inside, intercepts all audio via WebRTC hooks

This is not a hack or workaround — it's the **only** way to build a meeting bot for Google Meet without being Google.

### 4.2 Creating the Bot's Google Account

Lira needs a Google account to join meetings as an authenticated participant (avoiding guest restrictions and CAPTCHA challenges). We created:

- **Email**: `lira.ai.creovine@gmail.com`
- **Display name**: Lira AI
- **Profile picture**: Custom Lira avatar

This account is used solely by the bot. The account's session cookies are saved and reused for every meeting join.

### 4.3 Capturing Authentication State

Playwright can save and restore browser sessions via `storageState`. We wrote a setup script (`scripts/setup-bot-auth.ts`) that:

1. Launches a **visible** Chromium browser (not headless)
2. Navigates to `https://accounts.google.com`
3. Pauses and waits for you to manually log in
4. After login, saves the full session (cookies + localStorage) to `.lira-bot-auth/google-state.json`

This file is then used by the bot every time it launches:

```typescript
contextOptions.storageState = this.config.authStatePath;
```

The session cookies last approximately 30 days. After that, they expire and the bot can't join meetings.

### 4.4 Silent Auth Refresh

To prevent the 30-day expiry from breaking the bot, we built an **automatic silent refresh** system:

- Every **7 days**, the backend opens a headless Chromium instance
- Loads the saved session state
- Navigates to `meet.google.com` (which triggers Google to refresh the cookies)
- Saves the updated session state back to disk
- **Backs up the updated state to S3** for disaster recovery

**S3 auth state backup:** After every successful refresh, the auth state JSON is uploaded to S3 (`s3://<bucket>/lira-bot/auth-state/google-state.json`). On server startup, if the local auth state file is missing (e.g. fresh instance, EBS replacement), the system automatically restores it from S3. This ensures a new EC2 instance can start serving immediately without manual re-authentication. Configured via `LIRA_BOT_AUTH_S3_BUCKET` and `LIRA_BOT_AUTH_S3_PREFIX` environment variables.

The frontend displays the session health via the `AuthStatusCard` component:
- **Green**: Session is healthy (auto-refreshes)
- **Amber**: Expiring soon (< 7 days)
- **Red**: Expired (needs manual re-login)

The auth refresh is also available as an on-demand API endpoint: `POST /lira/v1/bot/auth-refresh`.

### 4.5 The Google Meet Driver

The `GoogleMeetDriver` class (560 lines) handles all UI automation. It uses **multiple fallback CSS selectors** for every element because Google Meet frequently changes its DOM structure:

```typescript
const SELECTORS = {
  joinButton: [
    'button[data-mdc-dialog-action="join"]',
    'button[jsname="Qx7uuf"]',
  ],
  joinButtonText: ['Ask to join', 'Join now', 'Join'],
  
  micMuteButton: [
    'button[aria-label="Turn off microphone"]',
    'button[data-tooltip="Turn off microphone"]',
    'button[aria-label="Turn off microphone (ctrl + d)"]',
    'button[data-tooltip="Turn off microphone (ctrl + d)"]',
  ],
  // ... 4 variants for each button
};
```

**Join flow:**
1. `page.goto(meetingUrl)` — navigate to the meeting
2. `dismissPopups()` — click "Got it", "Dismiss", "OK" on any info dialogs
3. `turnOffCamera()` — the bot doesn't need video
4. `enterName()` — triple-click to select all, then `fill("Lira AI")`
5. `clickJoinButton()` — try CSS selectors, then text matching, then brute-force scan
6. `waitForEntry()` — poll for in-meeting indicators vs. lobby vs. meeting ended
7. `startMeetingEndMonitor()` — 5-second polling interval to detect meeting end

**Screenshot-on-failure:** When the join sequence fails — join button not found, timeout, or an unexpected exception — the driver saves a full-page PNG screenshot to `debug-screenshots/` with a timestamped filename (e.g. `2026-03-02T10-30-00-000Z_join-button-not-found.png`). This provides immediate visual context for debugging DOM changes without needing to reproduce the failure. The directory is configurable via `LIRA_BOT_SCREENSHOT_DIR`.

**Meeting end detection checks for:**
- Text like "You were removed from the meeting" or "The meeting has ended"
- Loss of in-meeting indicators (leave button disappears)
- Bot is alone: counts remote audio streams via the Audio Bridge. If zero other participants for 45 seconds, auto-leaves.

### 4.6 Chromium Launch Configuration

The headless browser is configured with specific Chrome flags for performance and compatibility on a server:

```typescript
const CHROME_ARGS = [
  '--use-fake-ui-for-media-stream',              // Auto-accept mic/camera prompts
  '--disable-notifications',                       // No Google Meet popups
  '--disable-gpu',                                 // No GPU in headless mode
  '--disable-background-timer-throttling',         // Keep audio processing smooth
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--no-sandbox',                                  // Required for running as root
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',                       // Prevent /dev/shm issues
  '--disable-extensions',
  '--disable-default-apps',
  '--no-first-run',
  '--disable-translate',
  '--disable-infobars',
];
```

The browser context is created with:
- **Permissions**: microphone, camera, notifications (granted for `meet.google.com`)
- **Viewport**: 1280×720 (realistic for Google Meet)
- **User agent**: Chrome 131 on Linux
- **Storage state**: Saved Google session cookies

---

## 5. The Audio Pipeline — Bidirectional Audio in a Headless Browser

### 5.1 The Challenge

A headless browser has no microphone and no speakers. Google Meet expects `getUserMedia()` to return a valid audio stream, and it sends audio to participants via WebRTC. We needed to:

1. **Intercept** all incoming audio from meeting participants
2. **Pipe** that audio to Nova Sonic for processing
3. **Inject** Nova Sonic's voice response back as Lira's "microphone"
4. **Prevent** Lira from hearing her own voice (echo cancellation)

All of this happens inside a browser page that runs JavaScript before any Google Meet code loads.

### 5.2 Audio Bridge Architecture

The Audio Bridge is a 534-line TypeScript file that operates on two sides:

**Browser side** (runs as `addInitScript` before page load):
- Overrides `navigator.mediaDevices.getUserMedia`
- Overrides `navigator.mediaDevices.enumerateDevices`
- Intercepts `RTCPeerConnection` to capture remote audio tracks
- Manages audio contexts for capture (16 kHz) and injection (48 kHz)
- Exposes control functions (`__liraStartCapture`, `__liraInjectAudio`, etc.)

**Node.js side** (the `AudioBridge` class):
- Calls `page.exposeFunction()` to bridge data from browser to Node.js
- Receives captured PCM audio via callback
- Batches outbound audio chunks (50ms flush interval) to reduce CDP overhead
- Manages the echo gate flag

### 5.3 Capture Path (Meeting → Lira)

```
Google Meet sends audio via WebRTC
    │
    ▼
RTCPeerConnection.ontrack (intercepted)
    │
    ▼
MediaStreamSource → GainNode (mixer) → ScriptProcessorNode
    │                                         │
    │                              ┌──────────┘
    │                              │
    ▼                              ▼
AudioContext at 16 kHz     Buffer size: 2048 samples
                           = 128 ms per callback
                                   │
                                   ▼
                           Check: outputting? → drop (echo gate)
                           Check: energy < 0.001? → drop (silence gate)
                                   │
                                   ▼
                           Float32 → Int16 PCM → base64
                                   │
                                   ▼
                           window.__liraOnAudioCapture(base64)
                                   │
                                   ▼
                           Node.js: Buffer.from(base64, 'base64')
                                   │
                                   ▼
                           bot.emit('audio', pcm) → sonic.sendAudio()
```

The capture `AudioContext` runs at **16 kHz** because that's what Nova Sonic expects for input. The `ScriptProcessorNode` uses a buffer size of 2048 samples, producing one callback every 128 ms.

An **energy gate** skips near-silent frames (RMS < 0.001) so we don't waste bandwidth sending silence to Nova Sonic.

### 5.4 Injection Path (Lira → Meeting)

```
Nova Sonic sends audio response (24 kHz PCM)
    │
    ▼
bot-manager: meetingBot.injectAudio(pcm)
    │
    ▼
AudioBridge.injectAudio(pcmChunk)
    │ (chunks are batched for 50ms)
    ▼
flushInjectBuffer() → Buffer.concat → base64
    │
    ▼
page.evaluate(__liraInjectAudio, base64)
    │
    ▼ (inside browser)
base64 → Uint8 → Int16 → Float32
    │
    ▼
AudioBuffer at 24 kHz (the browser's 48 kHz context auto-resamples)
    │
    ▼
AudioBufferSourceNode.start(nextPlayTime)
    │  (scheduled for gapless playback)
    ▼
MediaStreamDestination → custom MediaStream
    │
    ▼
getUserMedia override returns this stream
    │
    ▼
Google Meet uses it as Lira's "microphone"
    │
    ▼
All participants hear Lira speak via WebRTC
```

The injection context runs at **48 kHz** (Google Meet's expected sample rate) but the `AudioBuffer` is created at **24 kHz** (Nova Sonic's output rate). The `AudioContext` handles the resampling automatically.

Audio chunks are **scheduled for gapless playback** using `nextPlayTime`:
```javascript
const now = injectCtx.currentTime;
if (nextPlayTime < now) nextPlayTime = now + 0.01; // 10 ms initial buffer
source.start(nextPlayTime);
nextPlayTime += audioBuffer.duration;
```

### 5.5 The Echo Gate

Without echo prevention, Lira would hear her own voice being played back through WebRTC, creating a feedback loop where she responds to herself. The echo gate is a simple boolean flag:

```javascript
// Set to true when audio injection starts
processorNode.onaudioprocess = function(e) {
  if (!capturing || outputting) return;  // ← echo gate
  // ... capture audio
};
```

When Lira finishes speaking, the echo gate isn't cleared immediately — there's a **drain delay**:

```javascript
window.__liraEndOutput = function endOutput() {
  var drainMs = 0;
  if (injectCtx && nextPlayTime > injectCtx.currentTime) {
    drainMs = (nextPlayTime - injectCtx.currentTime) * 1000;
  }
  var delay = Math.max(drainMs, 200) + 500; // pipeline buffer + short safety margin
  setTimeout(function() {
    outputting = false;
    nextPlayTime = 0;
  }, delay);
};
```

This ensures all scheduled audio has finished playing and Google Meet's internal audio pipeline has drained before capture resumes. The 500 ms margin (reduced from 1200 ms) accounts for pipeline buffering. On the Node side, an additional 800 ms safety buffer ensures the capture callback won't forward stale audio.

### 5.6 getUserMedia Override

The most critical override. Google Meet calls `getUserMedia({ audio: true })` to get the user's microphone. We intercept this and return our custom stream instead:

```javascript
navigator.mediaDevices.getUserMedia = async function(constraints) {
  ensureInjectContext();
  
  const stream = new MediaStream();
  // Add our custom audio tracks (connected to MediaStreamDestination)
  for (const track of customStream.getAudioTracks()) {
    stream.addTrack(track);
  }
  
  // If video was requested, provide a black canvas
  if (constraints?.video) {
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 640, 480);
    const videoStream = canvas.captureStream(1);
    for (const vt of videoStream.getVideoTracks()) {
      stream.addTrack(vt);
    }
  }
  
  return stream;
};
```

We also override `enumerateDevices` to ensure at least one `audioinput` device is reported (some Google Meet code paths check for available devices):

```javascript
navigator.mediaDevices.enumerateDevices = async function() {
  const devices = await _origEnumerateDevices();
  if (!devices.some(d => d.kind === 'audioinput')) {
    devices.push({
      deviceId: 'lira-virtual-mic',
      kind: 'audioinput',
      label: 'Lira AI Microphone',
    });
  }
  return devices;
};
```

### 5.7 RTCPeerConnection Interception

To capture audio from other meeting participants, we wrap `RTCPeerConnection`:

```javascript
const OrigRTCPC = window.RTCPeerConnection;

window.RTCPeerConnection = function LiraRTCPeerConnection(...args) {
  const pc = new OrigRTCPC(...args);
  
  pc.addEventListener('track', (event) => {
    if (event.track?.kind === 'audio') {
      const stream = event.streams?.[0] ?? new MediaStream([event.track]);
      onRemoteAudioStream(stream);  // Connect to capture pipeline
    }
  });
  
  return pc;
};

// Preserve prototype chain for instanceof checks
window.RTCPeerConnection.prototype = OrigRTCPC.prototype;
```

Each new remote audio stream is connected to the capture mixer via `MediaStreamSource → mixerNode`, enabling Lira to hear all participants mixed together.

---

## 6. Amazon Nova Sonic — Speech-to-Speech AI

### 6.1 What is Nova Sonic?

Amazon Nova Sonic is a **speech-to-speech foundation model** available through AWS Bedrock. Unlike traditional pipelines that chain separate STT → LLM → TTS services, Nova Sonic handles all three in a **single bidirectional stream**:

- **Input**: Raw PCM audio (16 kHz, 16-bit, mono)
- **Processing**: Simultaneous transcription, reasoning, and speech synthesis
- **Output**: Text transcripts + PCM audio (24 kHz, 16-bit, mono)

This means lower latency (no round-trips between services), more natural conversation flow, and the ability to handle interruptions natively.

### 6.2 Bidirectional Streaming Protocol

Nova Sonic uses AWS Bedrock's `InvokeModelWithBidirectionalStreamCommand`. The connection is an async generator that yields input events and receives output events simultaneously.

**Input side** (what we send):
```
sessionStart → promptStart → systemPrompt (TEXT) → audioContentStart → [audioInput...] → contentEnd → promptEnd
```

**Output side** (what we receive):
```
contentStart (role, type) → [textOutput | audioOutput]... → contentEnd → [repeat for each turn]
```

### 6.3 Event Flow

The input stream generator creates events in a specific order:

1. **`sessionStart`** — inference configuration (maxTokens: 1024, temperature: 0.7, topP: 0.9)
2. **`promptStart`** — output configs (text/plain, audio at 24 kHz via voice "tiffany") + empty tool config
3. **`contentStart`** (TEXT, SYSTEM) → **`textInput`** (system prompt) → **`contentEnd`** — sets personality and behaviour
4. **`contentStart`** (AUDIO, USER) — opens the interactive audio stream
5. **`audioInput`** events — pushed continuously as meeting audio arrives
6. **`contentEnd`** + **`promptEnd`** — sent when ending the session

The output stream processes events:
- **`contentStart`** with `role=USER` → incoming user transcript
- **`textOutput`** with `role=user` → speech-to-text transcript of what the user said
- **`contentStart`** with `role=ASSISTANT` → AI starting to respond
- **`textOutput`** with `role=assistant` → text of what the AI is saying
- **`audioOutput`** → PCM audio of the AI speaking
- **`contentEnd`** → content block finished
- **Barge-in**: `contentStart` with `type=INTERRUPTION` or new `role=USER` while `ASSISTANT` is active

### 6.4 System Prompt & Personality Engine

The system prompt is dynamically built by `buildSystemPrompt(settings)`. It establishes Lira's **core identity as a meeting participant** — not an AI assistant, chatbot, or help desk.

**Core identity block** (~30 lines):
- Establishes that Lira is a colleague sitting in the meeting, not a service
- Explicitly bans generic assistant phrases: "How can I help you?", "What can I assist you with?", "I'd be happy to help with that"
- Instructs Lira to reference the ongoing discussion when first addressed ("What are we covering today?", "Sounds like the main blocker is the API integration, right?")
- Adapts to meeting energy: casual in standups, thoughtful in strategy discussions, creative in brainstorms
- Lira has opinions — she flags concerns and gaps in reasoning, not just agrees
- Responses are concise (1–3 sentences) unless more detail is explicitly requested

**Anti-patterns (explicitly banned):**
- Never introduce herself as an "AI assistant" or "virtual assistant"
- Never offer generic help like "What would you like to know?"
- Never list capabilities or treat a greeting as a command to start assisting
- Never say "Sure! I'd be happy to help with that."

**Proactive behaviours:**
- Build context about who is in the meeting, what's being discussed, what decisions are pending
- Offer quick summaries when asked "where are we at?" or "recap"
- Note action items naturally ("So it sounds like Sarah is handling the API docs and we're reconvening Thursday?")
- Adapt style to meeting type — bullet-point updates for standups, creative contributions for brainstorms

**Four personality modes** (layered on top of the core identity):

| Mode | Behaviour |
|---|---|
| **Supportive** | Encourages others, validates good ideas, asks clarifying questions. Makes everyone feel heard but still flags concerns. |
| **Challenger** | Pushes back on assumptions, surfaces blind spots. "Wait, have we considered…?" Rigorous but collegial. |
| **Facilitator** | Keeps conversation on track. Surfaces action items, prompts quieter voices, helps the group reach conclusions. |
| **Analyst** | Structured thinking, data-oriented. Breaks complex topics into concrete components, thinks about trade-offs and dependencies. |

**Wake word instructions:**
- "Your name is 'Lira'. People may pronounce it differently (Lyra, Leera, Lara, etc.). Treat ALL of these as your name."
- "When nobody has mentioned your name, stay quiet and listen. You are paying attention the entire time."
- "When someone says your name, respond using the full context of everything you've heard so far."
- Mute acknowledgement: "Got it, going on mute. Just say 'Lira, unmute' when you want me back."
- Unmute acknowledgement: "I'm back — what'd I miss?" (not "What can I help with?")

### 6.5 Keepalive Mechanism

Nova Sonic sessions timeout if no audio input is received for too long. To prevent this, we send **silent PCM every 5 seconds**:

```typescript
const KEEPALIVE_INTERVAL_MS = 5_000;
const SILENT_PCM = Buffer.alloc(5120); // 160 ms of silence at 16 kHz

session.keepaliveTimer = setInterval(() => {
  if (!session.active) return;
  pushEvent(buildAudioInputEvent(promptName, audioContentName, SILENT_PCM));
}, KEEPALIVE_INTERVAL_MS);
```

### 6.6 Barge-In Detection

When a user starts speaking while Lira is responding, Nova Sonic signals an interruption. We detect this in two ways:

1. **New `contentStart` with `role=USER` while assistant was outputting** — the user started talking
2. **`contentStart` with `type=INTERRUPTION`** — explicit interruption signal from Nova Sonic

On barge-in:
- Discard any partial assistant text
- Call `onInterruption` callback → `meetingBot.endAudioOutput()` → clear echo gate immediately
- Stop forwarding assistant audio

### 6.7 Output Gating & Wake Word Integration

Not all Nova Sonic output should reach the meeting. When wake word mode is enabled (the default), the `shouldForwardAssistantOutput()` function gates all assistant responses:

```typescript
function shouldForwardAssistantOutput(session: SonicSession): boolean {
  if (!session.wakeWordEnabled) return true;

  // 1-on-1 mode: when only 1 other participant, bypass wake word entirely
  if (session.participantCount === 1 && !session.muted) return true;
  
  // If muted, block all output (except the mute acknowledgement)
  if (session.muted) return session.wakeWordActive;
  
  // Forward only if wake word was recently detected
  if (session.wakeWordActive) return true;
  return isWithinCooldown(session.lastWakeWordTime, false);
}
```

This means Nova Sonic is **always listening and generating responses**, but those responses are silently discarded unless:
- Someone said Lira's name recently (within the 45-second cooldown window), OR
- Only one other participant is in the meeting (1-on-1 mode — obviously talking to Lira)

### 6.8 Mute / Unmute via Voice Commands

Voice-triggered mute/unmute physically clicks the Google Meet mic button. The detection uses regex patterns checked against both current transcription and the rolling transcript buffer:

**Mute triggers** (requires wake word + keyword):
- "Lira, mute yourself", "Lira, be quiet", "Lira, go on mute", "Lira, shut up", "Lira, stop talking"

**Unmute triggers** (does NOT require wake word when muted):
- "unmute", "come back", "start listening", "speak again", "wake up", "you can talk"

When muting:
1. Set `session.muted = true`
2. Let the mute command's response through (so Lira can say "Okay, I'll go on mute")
3. After a 4-second delay (enough for the acknowledgement), call `onMicMute` callback
4. Bot Manager calls `meetingBot.muteMic()` → Google Meet Driver clicks the "Turn off microphone" button
5. Participants see Lira's mic icon as muted in Google Meet

When unmuting:
1. Any "unmute" keyword triggers, **no wake word required** (prevents getting stuck on mute)
2. Set `session.muted = false`, `session.wakeWordActive = true`
3. Call `onMicUnmute` callback immediately
4. Bot Manager calls `meetingBot.unmuteMic()` → Google Meet Driver clicks "Turn on microphone"

---

## 7. Wake Word Detection System

### 7.1 The Problem with Speech-to-Text

When someone says "Hey Lira, what do you think?", the speech-to-text engine (inside Nova Sonic) might transcribe it as:
- "Hey **Lyra**, what do you think?" (common variant)
- "Hey **Leera**, what do you think?" (phonetic spelling)
- "Hey **Lara**, what do you think?" (wrong vowel)
- "Hey **Leila**, what do you think?" (completely different but similar sound)

Worse, the name might be **split across chunks**: Nova Sonic sends transcript in fragments, so "Lira" might arrive as "Li" in one chunk and "ra" in the next.

We built a 4-layer detection system to handle all of this.

### 7.2 Four-Layer Detection Architecture

**Layer 0 — Hardcoded STT Variants** (fastest, highest confidence):

A lookup table of 17 known mispellings of "Lira" that STT engines commonly produce:

```typescript
const COMMON_VARIANTS = {
  lira: ['lyra', 'leera', 'lara', 'leara', 'leela', 'liera', 'liara',
         'leyra', 'leila', 'lura', 'lera', 'lirra', 'leerah', 'lyrah',
         'laira', 'lehera', 'leira'],
};
```

Each variant is checked with word-boundary regex: `/\blyra\b/i`.

**Layer 1 — Exact Match** (fast, high confidence):

Regex word-boundary match of the exact AI name:
```typescript
const exactRegex = new RegExp(`\\b${escapedName}\\b`, 'i');
```

**Layer 2 — Fuzzy Match via Levenshtein Distance** (medium, handles typos):

Tokenises the transcript and checks each word's edit distance against the AI name. For short names (≤ 4 characters like "Lira"), allows a distance of **2** — meaning up to 2 character insertions, deletions, or substitutions:

```
"leera" vs "lira" → distance 2 → MATCH
"laura" vs "lira" → distance 2 → MATCH
"michael" vs "lira" → distance 5 → NO MATCH
```

**Layer 3 — Phonetic Match via Soundex** (catches sounds-alike words):

Soundex encodes words by how they sound in English. "Lira", "Lyra", and "Lura" all produce the Soundex code **L600**. Any word with the same Soundex code is a potential match, subject to a Levenshtein distance guard (≤ maxDist + 2) to prevent over-matching.

```
soundex("Lira")  → "L600"
soundex("Lyra")  → "L600" → MATCH
soundex("Laura") → "L600" → MATCH (with distance check)
soundex("Luna")  → "L500" → NO MATCH
```

### 7.3 Rolling Transcript Buffer

Nova Sonic sends transcripts in small chunks. The name "Lira" might be split:
- Chunk 1: "Hey Li"
- Chunk 2: "ra, what do you think?"

To handle this, we maintain an **8-second rolling buffer** of recently received transcript chunks:

```typescript
const TRANSCRIPT_BUFFER_WINDOW_MS = 8_000;
const recentUserChunks: { text: string; time: number }[] = [];

function getRecentUserText(): string {
  const cutoff = Date.now() - TRANSCRIPT_BUFFER_WINDOW_MS;
  while (recentUserChunks.length > 0 && recentUserChunks[0].time < cutoff) {
    recentUserChunks.shift();
  }
  return recentUserChunks.map(c => c.text).join(' ');
}
```

Wake word detection runs against **both** the current chunk and the buffered text. So even if "Lira" is split across chunks, combining the last 8 seconds of text will capture the full name.

### 7.4 Cooldown Window

After detecting the wake word, Lira stays "addressed" for **45 seconds**. This enables natural conversation flow. Crucially, the timer **refreshes after each Lira response** — so the 45-second window restarts from when Lira finishes speaking, not from the original wake word.

```
User: "Hey Lira, what happened last quarter?"     ← wake word detected (t=0)
Lira: "Revenue was up 15%..."                      ← responds (t=5s), timer refreshed → t=0
User: "Can you break that down by region?"          ← no wake word, within 45s → responds
Lira: "Sure, EMEA was..."                           ← responds (t=10s), timer refreshed → t=0
User: "And compare it to Q1?"                       ← still within 45s → responds
[... 45 seconds of silence ...]
User: "What about marketing spend?"                 ← no wake word, cooldown expired → silent
```

### 7.5 1-on-1 Auto-Respond Mode

When only **one other participant** is in the meeting (a 1-on-1 call), Lira bypasses the wake word entirely. The logic: if it's just the user and Lira, there's nobody else the user could be talking to.

**Implementation**:
- `MeetingBot.getParticipantCount()` queries the audio bridge's `connectedSources.length`
- Bot Manager polls this every 5 seconds and calls `sonic.setParticipantCount(sessionId, count)`
- `shouldForwardAssistantOutput()` checks `session.participantCount === 1` — if true, always forward
- When a third person joins, the count changes to 2+ and wake word gating re-engages

This covers the most common use case: a user calling Lira into a private meeting for a 1-on-1 chat.

---

## 8. Backend Architecture

### 8.1 Server & Framework

The backend runs as a **Fastify 4** server on EC2. It serves the Creovine platform (CVault VPN, CMS, etc.) and Lira AI from the same process.

**Route groups:**
- `/v1/auth/*` — Platform authentication (JWT)
- `/lira/v1/meetings/*` — Meeting CRUD
- `/lira/v1/bot/*` — Bot deployment and management
- `/lira/v1/ws` — WebSocket for real-time audio (demo mode)

The server starts on port 3000 (behind Nginx on EC2 for TLS termination) and registers Swagger/OpenAPI documentation at `/docs`.

### 8.2 Bot Manager — The Orchestrator

`bot-manager.service.ts` (338 lines) is the central orchestrator that ties everything together. It's a module with state managed in a `Map<string, ManagedBot>` (not a class — simple and effective).

**Constants:**
```typescript
const MAX_ACTIVE_BOTS = parseInt(process.env.LIRA_BOT_MAX_ACTIVE ?? '3', 10);
const MAX_BOTS_PER_USER = parseInt(process.env.LIRA_BOT_MAX_PER_USER ?? '2', 10);
const DEFAULT_TTL_DAYS = parseInt(process.env.LIRA_MEETING_TTL_DAYS ?? '7', 10);
const GOOGLE_AUTH_STATE_PATH = process.env.LIRA_BOT_GOOGLE_AUTH_STATE || '';
const BOT_HEADLESS = process.env.LIRA_BOT_HEADLESS !== 'false';
const DEFAULT_DISPLAY_NAME = process.env.LIRA_BOT_DISPLAY_NAME || 'Lira AI';
```

The default `MAX_ACTIVE_BOTS` is 3 (calibrated for the `t3.small` instance — each Chromium consumes ~200–400MB RAM on a 2GB machine). `MAX_BOTS_PER_USER` prevents a single user from monopolising capacity.

Each deploy logs memory usage (`rss`, `heapUsed`, active bot count) for capacity monitoring.

**Deploy flow** (`deployBot(request, userId)`):
1. Validate meeting URL
2. Detect platform — **Zoom returns a clear `PLATFORM_NOT_SUPPORTED` error** (Phase 2)
3. Check global capacity (`MAX_ACTIVE_BOTS`) and per-user limit (`MAX_BOTS_PER_USER`)
4. Generate unique `botId` and `sessionId`
5. Merge user settings with defaults
6. Create `Meeting` record in DynamoDB (TTL = `DEFAULT_TTL_DAYS`)
7. Construct `BotConfig` (URL, platform, auth path, headless flag, timeouts)
8. Create `MeetingBot` instance
9. Wire all event handlers (see below)
10. Call `meetingBot.launch()` (async — returns immediately)
11. Return `{ bot_id, session_id, state: 'launching' }`

**Event wiring:**

```
meetingBot.on('state')  → update BotInstance state
meetingBot.on('joined') → start Nova Sonic session with callbacks:
    sonic.onAudioOutput  → meetingBot.injectAudio(pcm)
    sonic.onTextOutput   → store.appendMessage() + console log
    sonic.onAudioOutputEnd → meetingBot.endAudioOutput()
    sonic.onInterruption → meetingBot.endAudioOutput()
    sonic.onMicMute      → meetingBot.muteMic()
    sonic.onMicUnmute    → meetingBot.unmuteMic()
meetingBot.on('audio')  → sonic.sendAudio(sessionId, pcm)
meetingBot.on('ended')  → sonic.endSession() + cleanup
```

### 8.3 Meeting Bot — Browser Lifecycle

`MeetingBot` extends `EventEmitter` and manages the complete lifecycle:

**States**: `launching` → `navigating` → `joining` → `active` → `leaving` → `terminated`

**Launch sequence:**
1. Launch Chromium with `CHROME_ARGS`
2. Create browser context with auth state + permissions
3. Create page
4. Set up `AudioBridge` (inject init script before page load)
5. Register audio capture callback
6. Create platform-specific driver (`GoogleMeetDriver`)
7. Register meeting-end callback
8. Call `driver.join()` (handles navigation, popups, name entry, join click, lobby wait)
9. Start audio capture
10. Emit `'joined'` event
11. Set meeting duration timeout (4 hours max)

**Terminate sequence:**
1. Stop audio capture
2. Destroy audio bridge
3. Call `driver.leave()` (click leave button)
4. Close page → close context → close browser
5. Emit `'ended'` event

### 8.4 REST API Routes

#### Bot Routes (`/lira/v1/bot`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/deploy` | Deploy a bot to join a meeting. Body: `{ meeting_url, display_name?, settings? }`. Returns 429 if global capacity or per-user limit exceeded. Returns 400 `PLATFORM_NOT_SUPPORTED` for Zoom. |
| `GET` | `/:botId` | Get bot status (state, platform, errors, timestamps) |
| `POST` | `/:botId/terminate` | Gracefully terminate a bot |
| `GET` | `/active` | List all active bots with count |
| `GET` | `/auth-status` | Get Google/Zoom session health (days remaining, urgency) |
| `POST` | `/auth-refresh` | Trigger silent Google session refresh |

#### Meeting Routes (`/lira/v1/meetings`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Create a meeting session. Optional `ttl_days` (1–90, default 7). |
| `GET` | `/` | List all meetings for the authenticated user |
| `GET` | `/:id` | Get a single meeting with full transcript |
| `GET` | `/:id/summary` | Generate AI summary of the meeting |
| `PUT` | `/:id/settings` | Update AI settings mid-meeting |
| `DELETE` | `/:id` | Delete a meeting |

All routes require JWT authentication via `jwtWithTenantAuth` middleware.

### 8.5 WebSocket Routes

The `/lira/v1/ws` endpoint supports a browser-based demo mode where the user's microphone audio is sent directly to the backend (bypassing the browser bot). The protocol uses:

- **Text frames**: JSON messages with `{ action, session_id?, payload }`
  - Actions: `join`, `text`, `audio_start`, `audio_stop`, `settings`, `leave`
- **Binary frames**: Raw PCM audio (16 kHz Int16 mono)

Server responses:
- `joined` — successfully joined a session
- `transcript` — user or AI speech transcript
- `ai_response` — AI text response
- `ai_response_end` — AI finished speaking
- `interruption` — user interrupted the AI
- `audio_ready` — S3 recording URL available
- `error` — error message

### 8.6 DynamoDB Store

`lira-store.service.ts` provides a clean CRUD layer over two DynamoDB tables:

**`lira-meetings`** (partition key: `session_id`):
- Stores meeting metadata, settings, transcript messages, AI state
- **7-day default TTL** (`ttl` attribute, configurable per meeting via `ttl_days` or globally via `LIRA_MEETING_TTL_DAYS`)
- Messages are appended via `list_append` UpdateExpression

**`lira-connections`** (partition key: `connection_id`):
- Tracks active WebSocket connections
- Links connections to sessions and users

Both tables use PAY_PER_REQUEST billing and the AWS SDK v3 `DynamoDBDocumentClient` for clean JSON marshalling.

### 8.7 Data Models

**`MeetingSettings`**:
```typescript
{
  personality: 'supportive' | 'challenger' | 'facilitator' | 'analyst',
  participation_level: 0.0 – 1.0,
  wake_word_enabled: boolean,
  proactive_suggest: boolean,
  ai_name: string,        // default: "Lira"
  voice_id?: string,       // default: "tiffany"
  language?: string,       // default: "en-US"
}
```

**`Meeting`**:
```typescript
{
  session_id: string,      // "mtg-<uuid>"
  title: string,
  user_id: string,
  created_at: string,      // ISO-8601
  updated_at: string,
  ttl: number,             // Unix epoch seconds (default: 7 days)
  settings: MeetingSettings,
  messages: Message[],
  participants: string[],
  ai_state: { last_response_time, response_count },
  audio_url?: string,      // S3 presigned URL
}
```

**`Message`**:
```typescript
{
  id: string,
  speaker: string,         // "participant" or "lira"
  text: string,
  timestamp: string,
  is_ai: boolean,
  sentiment?: string,      // "positive", "negative", "neutral"
}
```

**`SonicSession`** (runtime, not persisted):
```typescript
{
  sessionId, connectionId, active, recordingChunks,
  promptCounter, aiName, wakeWordEnabled, wakeWordActive,
  lastWakeWordTime, conversationContext, muted, participantCount,
  keepaliveTimer, pushAudio(pcm), endAudio()
}
```

| Field | Purpose |
|-------|---------|
| `participantCount` | Number of other participants. When `1`, wake word is bypassed (1-on-1 mode). Updated by bot-manager polling every 5 seconds. |

**`BotConfig`**:
```typescript
{
  meetingUrl: string,
  platform: 'google_meet' | 'zoom',
  displayName: string,
  sessionId: string,
  settings: MeetingSettings,
  authStatePath?: string,
  headless: boolean,
  timeouts: { joinMs: 120_000, meetingMs: 14_400_000, lobbyMs: 300_000 }
}
```

**Bot states**: `launching` → `navigating` → `in_lobby` → `joining` → `active` → `leaving` → `terminated` | `error`

---

## 9. Frontend Architecture

### 9.1 Project Structure

The frontend is a **React 19 + TypeScript SPA** built with Vite 7, deployed on Vercel at `https://lira.creovine.com`.

```
src/
├── pages/
│   ├── HomePage.tsx         — Login/home screen with bot deploy
│   └── MeetingPage.tsx      — Browser-based demo meeting
├── components/
│   ├── bot-deploy/
│   │   ├── BotDeployPanel.tsx   — Main feature: paste link → deploy bot
│   │   └── AuthStatusCard.tsx   — Google session health display
│   ├── common/                   — Reusable UI components
│   └── ui/                       — Radix/shadcn primitives
├── services/
│   └── api/index.ts              — All REST API calls
├── features/
│   └── meeting/use-audio-meeting.ts — Audio meeting lifecycle hook
├── app/
│   ├── store/index.ts            — Zustand stores (auth, meeting, bot)
│   └── router/index.ts           — Route definitions
├── lib/
│   ├── audio.ts                  — Browser mic capture + AI audio playback
│   └── utils.ts                  — Tailwind class merge utilities
└── env.ts                         — Zod-validated environment config
```

### 9.2 Authentication Flow

The frontend uses Creovine platform authentication:

1. **Google Sign-In** (primary): Uses `@react-oauth/google` to get a Google ID token, sends it to `POST /v1/auth/google`, receives a JWT
2. **Email/password** (fallback): `POST /v1/auth/login`

The JWT is stored in `localStorage` via a Zustand store with `persist` middleware and sent as `Authorization: Bearer <token>` on all API requests.

### 9.3 Bot Deploy Panel — The Main Feature

The `BotDeployPanel` component is the core user-facing feature. It provides a simple flow:

1. **Paste a meeting link** — validates as Google Meet (`meet.google.com/xxx-yyy-zzz`) or Zoom
2. **Click "Send Lira to Meeting"** — calls `POST /lira/v1/bot/deploy`
3. **Status tracking** — polls `GET /lira/v1/bot/:botId` every 2 seconds
4. **Live status display** — shows animated state indicators:
   - `launching` → amber, spinning loader
   - `navigating` → amber, spinning loader
   - `in_lobby` → blue, with "Admit her from your meeting" hint
   - `joining` → blue, spinning loader
   - `active` → green, pulsing radio icon, with "Say Lira to get her attention" hint
   - `terminated` / `error` → grey/red, with "Deploy to Another Meeting" button
5. **Terminate button** — "Remove Lira from Meeting" calls `POST /lira/v1/bot/:botId/terminate`

The `AuthStatusCard` component shows the Google session health below the deploy panel, with a manual refresh button.

### 9.4 Browser-Based Demo Meeting

The `MeetingPage` provides an alternative mode where the user's browser microphone is used directly (no Google Meet bot involved):

1. User enters a meeting title and clicks "Start Meeting"
2. `useAudioMeeting` hook creates a meeting via REST, then opens a WebSocket
3. User clicks the mic button to start capturing
4. Browser mic audio (16 kHz PCM) is sent as binary WebSocket frames
5. Server forwards audio to Nova Sonic
6. Nova Sonic responses come back as binary frames (24 kHz PCM) + JSON transcript
7. Audio is played in the browser via `playPcmChunk()`
8. Transcript appears in real-time

This mode is useful for demos and testing without needing a real Google Meet call.

### 9.5 State Management

Three Zustand stores manage the frontend state:

**`useAuthStore`** (persisted to localStorage):
- `token`, `userEmail`, `userName`, `userPicture`
- `setCredentials()`, `clearCredentials()`

**`useMeetingStore`** (in-memory):
- `meetingId`, `meetingTitle`, `isConnected`, `aiStatus`
- `transcript[]` (last 200 lines, deduplicated)
- `addTranscriptLine()`, `setAiStatus()`, `setLastAiResponse()`

**`useBotStore`** (in-memory):
- `botId`, `meetingUrl`, `platform`, `botState`, `error`
- `setBotDeployed()`, `setBotState()`, `setBotError()`, `clearBot()`

### 9.6 API Service Layer

`src/services/api/index.ts` provides a typed wrapper around all backend endpoints:

- `apiFetch<T>()` — generic fetch wrapper that auto-injects JWT and handles errors
- **JWT expiry handling**: `apiFetch` intercepts 401 responses, clears `localStorage` credentials, and dispatches a `lira:auth-expired` custom event. The `AuthExpiryGuard` component in `App.tsx` listens for this event and redirects the user to the login screen.
- `googleLogin()`, `login()` — authentication
- `createMeeting()`, `listMeetings()`, `getMeeting()`, `getMeetingSummary()`, etc.
- `deployBot()`, `getBotStatus()`, `terminateBot()`, `listActiveBots()`
- `getBotAuthStatus()`, `refreshBotAuth()`
- `buildWsUrl()` — constructs WebSocket URL with token

The `BotDeployPanel` polling loop also detects JWT expiry gracefully — it stops polling, sets an error message ("Session expired — please sign in again."), and relies on `AuthExpiryGuard` to handle the redirect.

---

## 10. Infrastructure & Deployment

### 10.1 AWS Resources

| Service | Resource | Purpose |
|---|---|---|
| **EC2** | `t3.small` (i-038a4bb6abf311937) | Backend server — Fastify + Playwright |
| **Elastic IP** | `52.206.83.13` | Static IP for the backend |
| **DynamoDB** | `lira-meetings` table | Meeting sessions, transcripts, settings |
| **DynamoDB** | `lira-connections` table | WebSocket connection tracking |
| **S3** | Audio recording bucket | Meeting audio recordings |
| **Secrets Manager** | `/creovine/shared` | DATABASE_URL + other secrets |
| **Bedrock** | `amazon.nova-sonic-v1:0` | Speech-to-speech AI model |
| **IAM** | EC2 instance role | Bedrock, DynamoDB, S3, Secrets Manager access |

### 10.2 EC2 Server Setup

The EC2 instance runs Ubuntu 22.04 with:

- **Node.js 20+** (required for Playwright)
- **Playwright Chromium** browsers installed (`npx playwright install chromium`)
- **Chromium system dependencies** (`npx playwright install-deps`)
- **systemd service**: `creovine-api.service` manages the Node.js process
- **Nginx** (optional) for TLS termination and reverse proxy
- **Code location**: `/opt/creovine-api`

systemd ensures the server restarts automatically on crash:
```bash
sudo systemctl restart creovine-api
sudo journalctl -u creovine-api -f  # tail logs
```

### 10.3 Vercel Frontend Deployment

The frontend is deployed on Vercel:

- **Project**: `lira-creovine`
- **Domain**: `lira.creovine.com`
- **Framework**: Vite (auto-detected)
- **Build command**: `npm run build` → `tsc -b && vite build`
- **SPA routing**: `vercel.json` rewrites all paths to `index.html`

Environment variables on Vercel:
```
VITE_API_URL=https://api.creovine.com
VITE_WS_URL=wss://api.creovine.com/lira/v1/ws
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

### 10.4 DNS Configuration

DNS records on Namecheap:

| Type | Name | Value | Purpose |
|---|---|---|---|
| `A` | `api` | `52.206.83.13` | Backend API |
| `CNAME` | `lira` | `cname.vercel-dns.com` | Frontend |

- `https://api.creovine.com` → EC2 backend
- `https://lira.creovine.com` → Vercel frontend

### 10.5 Deployment Script

`deploy-auto.sh` provides one-command deployment from the local machine:

```bash
./deploy-auto.sh
```

**What it does:**
1. `npm run build` — compiles TypeScript to `dist/` locally
2. `rsync` — syncs all files to EC2 (excludes `node_modules`, `.env`, `.git`)
3. SSH to server: `npm install --production`, `prisma generate`, `prisma migrate deploy`
4. `sudo systemctl restart creovine-api` — restarts the service
5. Verifies the service is active

**Requirements:**
- SSH key at `~/.ssh/creovine-api-key.pem`
- SSH access to `ubuntu@52.206.83.13`

### 10.6 Environment Variables

**Backend (`.env` on EC2):**

```bash
# Server
PORT=3000
NODE_ENV=production
HOST=0.0.0.0

# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="..."
JWT_EXPIRES_IN=15m

# AWS (via instance role, but region needed)
AWS_REGION=us-east-1

# Lira AI Bot
LIRA_BOT_GOOGLE_AUTH_STATE=.lira-bot-auth/google-state.json
LIRA_BOT_DISPLAY_NAME=Lira AI
LIRA_BOT_MAX_ACTIVE=3
LIRA_BOT_MAX_PER_USER=2
LIRA_BOT_HEADLESS=true
LIRA_BOT_SCREENSHOT_DIR=./debug-screenshots
LIRA_BOT_AUTH_S3_BUCKET=                  # S3 bucket for auth state backup (optional)
LIRA_BOT_AUTH_S3_PREFIX=lira-bot/auth-state
LIRA_MEETING_TTL_DAYS=7
LIRA_BEDROCK_REGION=us-east-1
LIRA_NOVA_SONIC_MODEL_ID=amazon.nova-sonic-v1:0
LIRA_DYNAMODB_MEETINGS_TABLE=lira-meetings
LIRA_DYNAMODB_CONNECTIONS_TABLE=lira-connections
```

**Frontend (Vercel environment):**

```bash
VITE_API_URL=https://api.creovine.com
VITE_WS_URL=wss://api.creovine.com/lira/v1/ws
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

---

## 11. Challenges & Solutions

### 11.1 Echo — Lira Hearing Herself

**Problem**: When Lira speaks, her voice is played through WebRTC, which means her own capture pipeline picks it up. Nova Sonic then processes Lira's voice as if a participant said something, causing Lira to respond to herself in an infinite loop.

**Solution**: The **echo gate** — a boolean flag (`outputting`) in the Audio Bridge. When Lira is injecting audio, all captured frames are dropped. After injection ends, a drain delay (remaining scheduled audio time + 500 ms margin) ensures all audio has finished playing before capture resumes. The Node-side safety buffer adds another 800 ms. Total echo gate overhead is ~1.3 seconds (down from ~3.2 seconds in earlier versions).

### 11.2 Wake Word Splitting Across STT Chunks

**Problem**: Nova Sonic sends transcripts as small fragments. When someone says "Hey Lira," the name might arrive as "Li" in one chunk and "ra" in the next. No single chunk contains "Lira", so wake word detection fails.

**Solution**: An **8-second rolling transcript buffer** combines recently received chunks. Wake word detection runs against both the current chunk AND the combined buffer text, so even split names are caught.

### 11.3 Getting Stuck on Mute

**Problem**: When Lira is muted, she can't hear anything (mic button is physically muted in Google Meet). If the unmute command required saying "Lira, unmute" — but Lira can't hear you because she's muted — you're trapped.

**Solution**: When muted, the unmute command does **NOT require the wake word**. Any occurrence of "unmute", "come back", "start listening", etc. triggers unmute, even without saying "Lira" first. The mute command still requires the wake word to prevent accidental muting.

> **Design principle**: False-positive unmute is harmless (Lira just starts listening again). False-negative unmute is a trap (user can't get Lira back). So we bias toward unmuting.

### 11.4 Double Voice Output

**Problem (v1 — text)**: Nova Sonic sends both a TEXT content block and an AUDIO content block for each assistant turn. Both contain `textOutput` events with identical text, causing duplicated transcript entries.

**Solution (v1)**: Track `currentContentBlockType` ('TEXT' vs 'AUDIO'). Only buffer assistant text from TEXT-type blocks. When contentEnd fires for AUDIO blocks, discard any buffered text (it's a duplicate of what TEXT already flushed).

**Problem (v2 — audio)**: Some Nova Sonic stream chunks failed JSON parsing and were treated as raw PCM audio via a fallback path. This meant the same audio was forwarded TWICE: once through the proper `audioOutput` JSON event and once as "raw PCM". Additionally, `audioOutput` events were not gated by content block type, so audio could be forwarded from both TEXT and AUDIO blocks.

**Solution (v2)**: (a) Removed the raw PCM fallback entirely — all output from the SDK is well-formed JSON events; non-JSON chunks are logged and skipped. (b) Added `currentContentBlockType === 'AUDIO'` guard on the `audioOutput` handler so audio is only forwarded from AUDIO-type content blocks.

### 11.5 Nova Sonic Session Timeouts

**Problem**: If no audio input is received for more than ~30 seconds (e.g., during a silent moment in the meeting), Nova Sonic closes the bidirectional stream, ending the session.

**Solution**: Send **silent PCM every 5 seconds** via a keepalive timer. The 5120-byte buffer represents 160 ms of silence at 16 kHz — enough to keep the stream alive without triggering any response.

### 11.6 Auto-Leaving Empty Meetings

**Problem**: If all participants leave a meeting, the bot sits alone indefinitely, consuming server resources.

**Solution**: The Google Meet Driver counts other participants by checking audio bridge `connectedSources`. When zero other participants are detected, a 45-second timer starts. If no one rejoins within 45 seconds, the bot auto-leaves. If someone rejoins, the timer resets.

### 11.7 Google Meet UI Selector Fragility

**Problem**: Google Meet frequently changes its DOM structure, class names, and `aria-label` values. A single CSS selector for the "Join now" button would break every few weeks.

**Solution**: Every UI element has **multiple fallback selectors**. The driver iterates through them and uses the first one that finds a visible element:

```typescript
joinButton: [
  'button[data-mdc-dialog-action="join"]',  // Primary
  'button[jsname="Qx7uuf"]',                 // Fallback
],
joinButtonText: ['Ask to join', 'Join now', 'Join'],  // Text fallback
```

If all selectors fail, a brute-force scan checks every visible button for matching text content.

When all strategies fail, a **debug screenshot** is saved automatically (see section 4.5). This captures the exact DOM state at the moment of failure, making it straightforward to update selectors without reproducing the issue.

### 11.8 Multi-Turn Echo Gate — Nova Sonic Splitting Long Responses

**Problem**: Nova Sonic splits long AI responses into multiple consecutive TEXT+AUDIO content block pairs (observed up to 4 pairs for a single answer). Each AUDIO block end fires `onAudioOutputEnd` → `endOutput()` on the Audio Bridge. The original implementation cleared the echo gate after each block — but the next block's audio arrived milliseconds later, after the gate had already opened. This created windows where Lira's own voice leaked into the capture pipeline. Nova Sonic heard the echo, interpreted it as the user speaking, and generated a duplicate response. Observed browser audio drain times exploded from 700 ms → 4,784 ms → 13,077 ms across blocks of the same response.

**Root cause trace** (from live session logs):
```
16:23:33  AUDIO block 1 starts
16:23:36  endOutput() called — Node-side gate clears after 800ms
16:23:36  AUDIO block 2 starts immediately (next sub-turn)
16:23:37  Node-side echo gate cleared ← LEAK WINDOW (browser drain was 4784ms)
16:23:40  AUDIO block 3 → browser drain 2237ms
16:23:42  AUDIO block 4 → browser drain explodes to 13,077ms
16:23:59  Lira repeats herself verbatim — echoed her own voice
```

**Solution**: Three coordinated fixes in `audio-bridge.ts`:

1. **Node-side debounce** — `endOutput()` now waits **600 ms** before acting. If `injectAudio()` is called during that window (next sub-turn audio arrived), the debounce timer resets. The echo gate only clears after all consecutive AUDIO blocks in the response are done. The `injectAudio()` method actively cancels both the debounce timer and any pending Node-side gate timer when new audio arrives.

2. **Browser-side recheck** — When the drain `setTimeout` fires, the browser rechecks `nextPlayTime`. If new audio was scheduled while waiting, it re-calculates the drain and re-waits rather than clearing the gate prematurely. Overlapping drain timers are cancelled on re-entry via a tracked `endOutputTimer`.

3. **Restored safe margins** — Browser drain: `max(drainMs, 300) + 1200 ms` (previously reduced to `200 + 500`). Node safety buffer: 2000 ms (previously 800 ms).

```typescript
// Node-side: debounce — only clear gate if no new audio for 600ms
async endOutput(): Promise<void> {
  if (this.endOutputDebounce) clearTimeout(this.endOutputDebounce);
  this.endOutputDebounce = setTimeout(async () => {
    await this.flushInjectBuffer();
    await this.page.evaluate(() => (globalThis as any).__liraEndOutput?.());
    this.nodeSideGateTimer = setTimeout(() => {
      this.outputting = false; // Node echo gate clears after 2s
    }, 2000);
  }, 600); // Wait 600ms — if new audio arrives, this resets
}

// injectAudio() cancels any pending clear when new audio arrives
injectAudio(pcmChunk: Buffer): void {
  this.outputting = true;
  if (this.endOutputDebounce) { clearTimeout(this.endOutputDebounce); this.endOutputDebounce = null; }
  if (this.nodeSideGateTimer) { clearTimeout(this.nodeSideGateTimer); this.nodeSideGateTimer = null; }
  // ... batch and flush
}
```

> **Commit**: `3da9ee3` — *fix: debounce echo gate for multi-turn Nova Sonic responses*

### 11.9 Speaker Identification Without Per-Stream Access

**Problem**: A meeting AI that can identify who is speaking and address people by name would be a significant differentiator. However, the WebRTC audio capture pipeline receives a **single mixed PCM stream** — all participants' voices are combined into one audio feed before they reach the Audio Bridge. There is no standard API to demix a merged WebRTC audio stream or to map individual `MediaStreamTrack` objects to participant display names in a headless browser context.

**Solution**: Rather than trying to identify speakers from audio (which would require per-track access and a separate speaker diarization model), the system uses **two complementary approaches**:

1. **DOM scraping for names** — Google Meet renders participant tiles (`[data-participant-id]`) with names embedded as `img[alt]` attributes, `aria-label` values, or text overlays. Three fallback strategies ensure maximum coverage across Google Meet UI versions.

2. **DOM-based active speaker detection** — Google Meet applies a coloured border or `box-shadow` to the active speaker's tile. Polling the computed styles of all participant tiles every 2 seconds identifies the current speaker.

See **Section 16** for full architecture, implementation details, and accuracy characteristics.

---

## 12. How It All Connects — End-to-End Walkthrough

Here is the complete journey from a user clicking "Send Lira to Meeting" to Lira responding in a Google Meet call:

**Step 1 — User deploys Lira**
- User pastes `https://meet.google.com/abc-defg-hij` into the BotDeployPanel
- Frontend validates the URL, detects "google_meet" platform
- Frontend calls `POST /lira/v1/bot/deploy` with the URL

**Step 2 — Backend creates the bot**
- Bot Manager generates `botId` (UUID) and `sessionId` ("mtg-UUID")
- Creates a DynamoDB meeting record
- Constructs `BotConfig` with auth state path, headless=true, Lira AI name
- Creates `MeetingBot` instance and wires event handlers
- Calls `meetingBot.launch()` (non-blocking)
- Returns `{ bot_id, session_id, state: "launching" }` to frontend

**Step 3 — Frontend starts polling**
- Frontend sets `botState = "launching"` and starts polling every 2s
- Shows amber spinner with "Launching browser…"

**Step 4 — Chromium launches**
- Playwright launches Chromium with 14 Chrome flags for headless operation
- Creates context with saved Google session cookies
- Grants microphone + camera permissions for `meet.google.com`
- Creates page and injects Audio Bridge init script

**Step 5 — Joining the meeting**
- Google Meet Driver navigates to the meeting URL
- Dismisses any "Got it" popups
- Turns off camera
- Enters "Lira AI" as display name
- Clicks "Join now" (tries CSS selectors, then text match, then brute force)
- Waits for in-meeting indicators (leave button visible) or lobby
- If lobby: waits up to 5 minutes to be admitted

**Step 6 — Audio bridge activates**
- Bot state → `active`
- Audio capture starts: `__liraStartCapture()` enables the ScriptProcessorNode
- Any pending remote streams are connected to the capture mixer
- Bot emits `'joined'` event

**Step 7 — Nova Sonic session starts**
- Bot Manager receives `'joined'` event
- Calls `sonic.startSession()` with callbacks
- Nova Sonic opens bidirectional Bedrock stream
- Sends session config → system prompt (personality + wake word instructions) → opens audio content
- Starts 5-second keepalive timer

**Step 8 — Meeting audio flows**
- Participants speak → WebRTC delivers audio to all
- Audio Bridge captures via ScriptProcessorNode (16 kHz)
- Echo gate checks: not outputting → forward
- Energy gate checks: above 0.001 → forward
- PCM → base64 → Node.js callback → `sonic.sendAudio(sessionId, pcm)`
- Nova Sonic receives audio in real-time

**Step 9 — Nova Sonic processes**
- Speech-to-Text: generates transcript in fragments
- Sends `textOutput` with `role=user` → transcript stored in DynamoDB
- Wake word service checks transcript against 4 layers
- If name detected: `wakeWordActive = true`

**Step 10 — Lira responds (if addressed)**
- Nova Sonic generates response
- `shouldForwardAssistantOutput()` checks: wake word active? → YES
- Assistant text → buffered → flushed to DynamoDB on contentEnd
- Assistant audio → `meetingBot.injectAudio(pcm)`
- Audio Bridge: batch (50ms) → `__liraInjectAudio(base64)`
- Browser: base64 → AudioBuffer → scheduled playback → MediaStreamDestination
- Google Meet uses this as Lira's "microphone"
- All participants hear Lira speak

**Step 11 — Lira finishes speaking**
- Nova Sonic sends `contentEnd` for AUDIO block
- `onAudioOutputEnd` callback fires
- `meetingBot.endAudioOutput()` → Audio Bridge drain delay
- Echo gate clears after all scheduled audio finishes + 500ms (+ 800ms Node-side)
- Capture resumes

**Step 12 — Meeting ends**
- Participant clicks "End meeting" or all leave
- Google Meet Driver detects meeting-end indicator or 45s alone timeout
- Bot terminates: stops capture → leaves meeting → closes browser
- Nova Sonic session ends
- Bot Manager cleans up
- Frontend polling sees `state: "terminated"`

---

## 13. Repository Structure

**Backend** — `Creovine-Labs/creovine-api` (private):
```
creovine-api/
├── src/
│   ├── index.ts                    — Fastify server + Swagger + route registration
│   ├── routes/
│   │   ├── lira-bot.routes.ts      — Bot deploy/status/terminate REST API
│   │   └── lira-meetings.routes.ts — Meeting CRUD + summaries REST API
│   ├── services/
│   │   ├── lira-bot/
│   │   │   ├── index.ts            — Barrel exports
│   │   │   ├── bot-manager.service.ts — Orchestrator
│   │   │   ├── meeting-bot.ts      — Browser lifecycle
│   │   │   ├── audio-bridge.ts     — Audio capture/injection
│   │   │   ├── auth-refresh.ts     — Google session renewal
│   │   │   └── drivers/
│   │   │       ├── google-meet.driver.ts
│   │   │       └── zoom.driver.ts
│   │   ├── lira-sonic.service.ts   — Nova Sonic + wake word gating
│   │   ├── lira-wakeword.service.ts — 4-layer wake word detection
│   │   ├── lira-store.service.ts   — DynamoDB persistence
│   │   └── lira-ai.service.ts      — Meeting summaries
│   ├── models/
│   │   ├── lira.models.ts          — Meeting, Message, SonicSession
│   │   └── lira-bot.models.ts      — BotConfig, BotState
│   └── middleware/
│       └── auth.middleware.ts       — JWT authentication
├── deploy-auto.sh                   — One-command deployment
├── .lira-bot-auth/
│   └── google-state.json           — Saved Google session (not in git)
└── package.json
```

**Frontend** — `Creovine-Labs/lira` (private):
```
lira_ai/
├── src/
│   ├── App.tsx                     — Root component with providers
│   ├── main.tsx                    — Entry point
│   ├── env.ts                      — Zod-validated environment config
│   ├── pages/
│   │   ├── HomePage.tsx            — Login + Bot Deploy
│   │   └── MeetingPage.tsx         — Browser demo meeting
│   ├── components/
│   │   ├── bot-deploy/
│   │   │   ├── BotDeployPanel.tsx  — Paste link → deploy → track
│   │   │   └── AuthStatusCard.tsx  — Session health
│   │   ├── common/                 — Reusable UI components
│   │   └── ui/                     — Radix primitives
│   ├── services/
│   │   └── api/index.ts            — API client
│   ├── features/
│   │   └── meeting/
│   │       └── use-audio-meeting.ts — Audio meeting hook
│   ├── app/
│   │   ├── store/index.ts          — Zustand stores
│   │   └── router/index.ts         — Routes
│   └── lib/
│       ├── audio.ts                — Mic capture + audio playback
│       └── utils.ts                — Tailwind utilities
├── vite.config.ts
├── vercel.json                     — SPA routing
└── package.json
```

---

## 14. Running Locally

### Prerequisites
- **Node.js 20+**
- **Playwright Chromium**: `npx playwright install chromium && npx playwright install-deps`
- **AWS credentials**: configured via `~/.aws/credentials` or environment variables (need Bedrock, DynamoDB, S3 access)
- **Google auth state**: run `npx tsx scripts/setup-bot-auth.ts --google` to capture session

### Backend

```bash
cd creovine-api

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
# Edit .env with your database URL, JWT secret, AWS config, etc.

# Run database migrations
npx prisma migrate dev

# Start development server (with hot reload)
npm run dev
```

The server starts at `http://localhost:3000`. Visit `http://localhost:3000/docs` for the API reference.

### Frontend

```bash
cd lira_ai

# Install dependencies
npm install

# Create .env.local
echo 'VITE_API_URL=http://localhost:3000' > .env.local
echo 'VITE_WS_URL=ws://localhost:3000/lira/v1/ws' >> .env.local

# Start development server
npm run dev
```

The frontend starts at `http://localhost:5173`.

### Testing the Bot Locally

1. Start the backend: `npm run dev` in `creovine-api/`
2. Start the frontend: `npm run dev` in `lira_ai/`
3. Open `http://localhost:5173`
4. Sign in with your Creovine account
5. Create a Google Meet meeting at `meet.google.com`
6. Paste the meeting link into the "Meeting link" field
7. Click "Send Lira to Meeting"
8. Admit "Lira AI" from the Google Meet waiting room
9. Say "Hey Lira, introduce yourself" — Lira responds via voice

Set `LIRA_BOT_HEADLESS=false` in `.env` to see the Chromium browser window during development.

---

---

## 15. Known Limitations & Future Work

This section documents known constraints and planned improvements, informed by a thorough engineering review of the system.

### 15.1 Single Bot Account

Currently, all bots share a single Google account (`lira.ai.creovine@gmail.com`). If Google flags or suspends this account, every customer's bot stops simultaneously. The 7-day silent refresh strategy extends the session window but doesn't address this single point of failure.

**Planned fix**: A pool of bot accounts with session state sharded by bot instance and round-robin assignment. This is the highest-priority scaling item.

### 15.2 EC2 Sizing

Each Playwright Chromium instance consumes ~200–400MB of RAM. The `t3.small` (2GB RAM) realistically supports 3 concurrent bots — reflected in the `LIRA_BOT_MAX_ACTIVE=3` default. For higher concurrency, upgrade to `t3.medium` (4GB) or larger. Per-deploy memory logging is now in place for capacity planning.

### 15.3 ScriptProcessorNode Deprecation

The Audio Bridge uses `ScriptProcessorNode` for audio capture, which is deprecated in favour of `AudioWorkletProcessor`. In a headless browser (no rendering), the main-thread contention argument is weaker than in a visible browser, so this is not urgent. However, Google could increase deprecation pressure. The migration to AudioWorklet is non-trivial (separate worklet file, MessagePort communication model) and would touch the most sensitive part of the system.

**Status**: Planned but not urgent. The current approach works reliably.

### 15.4 Rolling Wake Word Buffer — Cross-Speaker Context

The 8-second rolling transcript buffer concatenates all speech regardless of speaker. In theory, if participant A says "Hey Lira" and 7 seconds later participant B says something unrelated, the buffer could create a false-positive wake context. In practice this is extremely unlikely because the wake word check requires the name to appear in the output, and the transcription text from two speakers would not accidentally form "Lira."

**Future improvement**: Tag chunks with speaker-change detection or only run the combined-buffer check when the current chunk contains a partial name match.

### 15.5 Zoom Support

The Zoom driver (`zoom.driver.ts`) exists but is Phase 2. The API currently accepts Zoom URLs in the schema but returns a clear `PLATFORM_NOT_SUPPORTED` error at deployment time. The Zoom web client has additional challenges vs. Google Meet: explicit "Join from Your Browser" click, separate audio connection dialog, shorter cookie lifetimes, and some hosts disable the web client entirely.

### 15.6 Two Audio Code Paths

The browser-based demo meeting (WebSocket + mic in browser) and the headless bot meeting use different audio code paths. Both handle PCM encoding/decoding and audio playback but are implemented independently. They can drift over time.

**Mitigation**: Both code paths are explicitly cross-referenced in comments.

### 15.7 Speaker Identification Accuracy

The DOM-based speaker identification system (Section 16) works well for normal conversation but has inherent limitations:

- **Active speaker poll latency**: The 2-second polling interval means speakers who talk for less than 2 seconds may not be detected. Rapid back-and-forth cross-talk may result in incorrect attribution.
- **Google Meet UI dependency**: The speaking indicator detection relies on computed `border-color` and `box-shadow` styles on participant tiles. Google can change these styles in a UI update, breaking detection until selectors are updated.
- **Names not available at first session start**: Participants' names are scraped 3 seconds after Lira joins. The very first Nova Sonic session starts before names are known. On any subsequent session restart (auto-reconnect), the names are passed to the new session's system prompt.
- **No voice fingerprinting**: The system cannot reliably attribute a specific voice to a specific name without access to individual per-participant audio tracks and a diarization model. Attribution relies entirely on timing correlation between the Google Meet speaking indicator and when speech arrives.
- **Mid-sentence attribution errors**: If the active speaker poll captures a different participant's name during a long sentence, that sentence may be attributed incorrectly in the transcript.

**Future improvement**: Use the `ontrack` event's `streams[0].id` to correlate each incoming `MediaStream` with its participant tile in the DOM at the moment the track arrives, creating a stable stream-to-name map that doesn't depend on polling.

---

## 16. Speaker Identification System

Lira can detect who is in the meeting, who is currently speaking, address participants by name in conversation, and attribute transcript messages to the correct speaker.

### 16.1 Overview

| Capability | Implementation | Reliability |
|-----------|---------------|-------------|
| Count participants | `connectedSources.length` in Audio Bridge | High |
| Get participant names | DOM scraping — 3 strategies | Medium-High |
| Detect active speaker | Computed style polling on tiles | Medium |
| Address by name in responses | System prompt instruction | High |
| Speaker-attributed transcript | Poll correlation at transcript flush | Medium |
| Names in session on restart | Passed to `startSession()` on reconnect | High |

### 16.2 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Google Meet Browser (Playwright page)                          │
│                                                                 │
│  DOM: [data-participant-id] tiles                               │
│       └─ img[alt] / aria-label / text nodes  → names           │
│       └─ border-color / box-shadow           → active speaker  │
│                                                                 │
└──────────────────────┬────────────────────────┬────────────────┘
                       │ page.evaluate()        │ page.evaluate()
                       ▼ every 15s             ▼ every 2s
┌─────────────────────────────────────────────────────────────────┐
│  GoogleMeetDriver                                               │
│  getParticipantNames() → string[]                               │
│  getActiveSpeaker()    → string | null                          │
└──────────────────────┬────────────────────────┬────────────────┘
                       │                        │
                       ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  BotManager (polling timers)                                    │
│  participantNamePollTimer  — setInterval 15s                    │
│  activeSpeakerPollTimer    — setInterval 2s                     │
│                                                                 │
│  sonic.setParticipantNames(sessionId, names)                    │
│  sonic.setActiveSpeaker(sessionId, speaker)                     │
└──────────────────────┬────────────────────────┬────────────────┘
                       │                        │
                       ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  SonicSession                                                   │
│  .participantNames: string[]    used in system prompt           │
│  .activeSpeaker: string | null  used for transcript attribution │
└─────────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Nova Sonic — system prompt includes participant list           │
│  "There are 3 people in this meeting: John, Peter, James"       │
│  → Lira can address them by name in responses                   │
└─────────────────────────────────────────────────────────────────┘
```

### 16.3 Participant Name Scraping

`GoogleMeetDriver.getParticipantNames()` runs inside the browser via `page.evaluate()` using a string-based eval (to avoid TypeScript DOM type requirements in the Node.js process). It applies three strategies in order, deduplicating results:

**Strategy 1 — Participant tiles** (`[data-participant-id]`)

Each tile is checked in order:
- `img[alt]` — Avatar images carry the participant's name as the `alt` attribute. Most reliable.
- `aria-label` — Tile container often has `aria-label="John Smith, microphone off, camera off"`. The name is the first comma-separated segment.
- Text node walker — Iterates text nodes in the tile, taking the first string that looks like a name (2–40 characters, not purely numeric).

The bot's own tile is excluded by checking for a `[data-self-name]` child element.

**Strategy 2 — Sidebar participant list**

If the People panel is open, `[role="list"] [role="listitem"]` elements contain participant names as the first line of their text content.

**Strategy 3 — Hovercard elements**

`[data-hovercard-id]` elements (name chips/badges) are extracted directly.

All detected names are filtered to remove the bot's own name, "You", and common non-name strings ("presentation", "screen sharing", etc.).

### 16.4 Active Speaker Detection

`GoogleMeetDriver.getActiveSpeaker()` queries computed styles of all participant tiles every 2 seconds.

Google Meet highlights the active speaker with a **coloured border** (typically blue, ~`#1a73e8`) or `box-shadow`. The detector:

1. Skips the bot's own tile (`[data-self-name]`).
2. Checks `borderColor`, `outlineColor`, and `boxShadow` via `getComputedStyle()`.
3. Filters out the default dark background borders (`rgb(32, 33, 36)`, `rgb(60, 64, 67)`) and `borderWidth: 0px`.
4. If a non-default border is found on a tile or its immediate child, that tile's participant is the active speaker.
5. Falls back to `[aria-live]` regions — Google Meet sometimes announces `"X is now talking"`.

Once the speaking tile is identified, the name is extracted using the same priority order as Strategy 1 above (img alt → aria-label → text walker).

### 16.5 System Prompt Enrichment

When participant names are known (`participantNames.length > 0`), `buildSystemPrompt()` appends a participant awareness block:

```
Participant awareness:
There are 3 other people in this meeting: John, Peter, James.
You can hear everyone's voice but the audio arrives as a single mixed stream,
so you may not always be able to tell exactly who is speaking.

How to use participant names:
- When you CAN identify who is speaking (from context, their topic, or because
  they introduced themselves), address them by name.
  e.g. "Good point, John." or "Peter, to answer your question…"
- Never guess a name if you're uncertain.
- When giving a summary, attribute contributions to the right people.
```

This is passed as part of the `buildSystemPromptEvents()` → `createInputStreamGenerator()` chain, which means it's embedded in the Nova Sonic session's SYSTEM content block at session start.

On **auto-reconnect** (Sonic session restart after a Bedrock error), `sonic.getParticipantNames(sessionId)` retrieves the current names and passes them to the new `startSession()` call, so the restarted session also has full participant awareness.

### 16.6 Polling Strategy

Three separate timers run from Bot Manager after the bot joins:

| Timer | Interval | Purpose |
|-------|----------|---------|
| `participantPollTimer` | 5 s | Count (for 1-on-1 wake word bypass) |
| `participantNamePollTimer` | 15 s (+ initial 3 s) | Update participant names |
| `activeSpeakerPollTimer` | 2 s | Track who is currently talking |

The name poller runs an initial poll 3 seconds after joining (allowing the DOM to fully render before the first scrape), then every 15 seconds thereafter. Names rarely change mid-meeting, so 15 seconds is sufficient.

The active speaker poller runs every 2 seconds. This is a balance between responsiveness and `page.evaluate()` overhead.

All timers are cleaned up when the bot ends or when `terminateAll()` is called.

### 16.7 Speaker-Attributed Transcripts

When Nova Sonic emits a user speech transcript (`onTextOutput`, `role = 'user'`), Bot Manager checks `sonic.getActiveSpeaker(sessionId)` at that moment. If a speaker is identified, the message is stored in DynamoDB with `speaker: "John"` instead of the generic `speaker: "participant"`.

```typescript
// In bot-manager.service.ts — onTextOutput callback
let speakerLabel = isAI ? aiName.toLowerCase() : 'participant';
if (!isAI) {
  const activeSpeaker = sonic.getActiveSpeaker(sessionId);
  if (activeSpeaker) speakerLabel = activeSpeaker;
}
const msg: Message = {
  id: uuidv4(),
  speaker: speakerLabel, // e.g. "John" or "participant"
  text,
  is_ai: false,
  ...
};
```

This enables the transcript view in the frontend to show named speakers in the meeting history.

### 16.8 Accuracy & Limitations

See **Section 15.7** for a complete listing of known limitations. In summary:

- Name detection via `img[alt]` and `aria-label` is **reliable** for meetings where Google renders participant tiles (typically 2+ participants, any modern Google Meet UI version).
- Active speaker detection is **medium reliability** — works well for conversations where people take clear turns, less reliable for rapid cross-talk or very short utterances (< 2 s).
- System prompt enrichment is **highly effective** — once Lira knows participants' names from the DOM, Nova Sonic naturally incorporates them into responses through the instruction in the system prompt.

---

*Built by the Creovine Labs team. Powered by Amazon Nova Sonic on AWS Bedrock.*
