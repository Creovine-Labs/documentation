---
slug: /architecture/audio-pipeline
sidebar_position: 2
title: Audio Pipeline
---

# Audio Pipeline

The bidirectional audio pipeline is the core engineering challenge in Lira — capturing audio from Google Meet, processing it through AI, and injecting the response back into the meeting.

## The Challenge

Google Meet has no API for audio access. Lira runs a **headless Chromium browser** that joins the meeting as a participant. Audio must be captured from the browser's WebRTC streams and injected back as Lira's "microphone."

## Audio Bridge Architecture

The audio bridge (`AudioBridge` class) is a two-layer system — browser-side JavaScript injected into Chromium, and a Node.js orchestration layer.

```
Google Meet (WebRTC)
    │
    ▼ [Capture Path]
RTCPeerConnection.ontrack
    → AudioContext (16 kHz)
    → ScriptProcessorNode (buffer: 1024 samples)
    → Energy gate (RMS < 0.001 = silence → drop)
    → Float32 → Int16 PCM → base64
    → page.exposeFunction('__liraOnAudioCapture')
    → Node.js AudioBridge
    → Echo gate check
    → Nova Sonic input stream

Nova Sonic output
    → PCM audio (24 kHz)
    → base64 → Int16 → Float32 → AudioBuffer
    → AudioBufferSourceNode (gapless scheduling)
    → MediaStreamDestination (48 kHz, auto-resampled)
    → getUserMedia override
    → Google Meet receives as Lira's "mic"
    │
    ▼ [Injection Path]
All participants hear Lira speak
```

## Capture Path (Meeting → Lira)

1. **RTCPeerConnection interception** — Lira overrides `RTCPeerConnection.prototype.ontrack` to intercept audio tracks from other participants before the page loads
2. **AudioContext processing** — Raw audio is resampled to 16 kHz (required by Nova Sonic) via a `ScriptProcessorNode` with a 1024-sample buffer
3. **Energy gate** — Frames with RMS energy below 0.001 are classified as silence and dropped, reducing unnecessary processing
4. **Format conversion** — Float32 samples → Int16 PCM → base64 encoding
5. **Browser-to-Node bridge** — Uses `page.exposeFunction('__liraOnAudioCapture')` and `page.exposeFunction('__liraLog')` to send data from the browser context to Node.js

## Injection Path (Lira → Meeting)

1. **PCM decode** — Nova Sonic's output (24 kHz) is decoded from base64 to Int16 to Float32
2. **Chunk batching** — Audio chunks are batched (default 50ms) to reduce CDP (Chrome DevTools Protocol) calls
3. **AudioBuffer scheduling** — Chunks are scheduled for gapless playback via `AudioBufferSourceNode`
4. **MediaStreamDestination** — The audio context auto-resamples from 24 kHz to 48 kHz for WebRTC compatibility
5. **getUserMedia override** — Lira overrides `navigator.mediaDevices.getUserMedia` to return this custom stream as the "microphone"
6. **WebRTC delivery** — Google Meet sends this stream to all participants

## Echo Gate

A critical component that prevents feedback loops — Lira hearing her own output. The echo gate operates at two levels:

**Browser-side**: An `outputting` flag suppresses audio capture while Lira is speaking.

**Node.js side**: The `AudioBridge.endOutput()` method uses a debounced 250ms check to handle multi-block responses. After the last audio block plays, the browser drains scheduled audio plus a 200ms reverb margin. The Node-side echo gate clears after an additional 400ms safety buffer.

```
AI starts speaking → outputting = true → capture suppressed
AI stops speaking → 250ms debounce → drain audio → 200ms reverb → 400ms safety → capture resumes
```

## RTCPeerConnection Interception

```javascript
// Lira injects this script before Google Meet loads
const originalRTCPeerConnection = window.RTCPeerConnection;
window.RTCPeerConnection = function(...args) {
  const pc = new originalRTCPeerConnection(...args);
  pc.addEventListener('track', (event) => {
    if (event.track.kind === 'audio') {
      // Capture this audio track for processing
      captureAudioTrack(event.streams[0]);
    }
  });
  return pc;
};
```

## getUserMedia Override

```javascript
// Replace the real microphone with Lira's AI audio stream
navigator.mediaDevices.getUserMedia = async (constraints) => {
  if (constraints.audio) {
    return liraAudioStream; // Custom MediaStream from AI output
  }
  return originalGetUserMedia(constraints);
};
```

## Bridge Initialization

The `AudioBridge.setup()` method initializes the system before the page loads:

1. Injects the initialization script before `page.goto()` — this sets up the audio capture and injection pipelines
2. Exposes `__liraOnAudioCapture` — receives base64 PCM from the browser
3. Exposes `__liraLog` — receives debug logs from browser context
4. Overrides `getUserMedia` and `RTCPeerConnection` before Google Meet's code runs
