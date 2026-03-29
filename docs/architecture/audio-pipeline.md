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

```
Google Meet (WebRTC)
    │
    ▼ [Capture Path]
RTCPeerConnection.ontrack
    → AudioContext (16 kHz)
    → ScriptProcessorNode
    → Float32 → Int16 PCM → base64
    → page.exposeFunction('__liraOnAudioCapture')
    → Node.js
    → Echo Gate check
    → Nova Sonic input stream

Nova Sonic output
    → PCM audio (24 kHz)
    → base64 → Int16 → Float32 → AudioBuffer
    → AudioBufferSourceNode
    → MediaStreamDestination (48 kHz, resampled)
    → getUserMedia override
    → Google Meet receives as Lira's "mic"
    │
    ▼ [Injection Path]
All participants hear Lira speak
```

## Capture Path (Meeting → Lira)

1. **RTCPeerConnection interception** — Lira hooks into the browser's `RTCPeerConnection` to intercept audio tracks from other participants
2. **AudioContext processing** — Raw audio is resampled to 16 kHz (required by Nova Sonic)
3. **ScriptProcessorNode** — Converts Float32 samples to Int16 PCM
4. **Browser-to-Node bridge** — Uses `page.exposeFunction` to send base64-encoded PCM from the browser context to Node.js

## Injection Path (Lira → Meeting)

1. **PCM decode** — Nova Sonic's output (24 kHz) is decoded from base64 to Int16 to Float32
2. **AudioBuffer scheduling** — Audio chunks are scheduled for gapless playback
3. **MediaStreamDestination** — The audio buffer feeds a MediaStream at 48 kHz
4. **getUserMedia override** — Lira overrides the browser's `getUserMedia` API to return this custom stream as the "microphone"
5. **WebRTC delivery** — Google Meet sends this stream to all participants

## Echo Gate

A critical component that prevents feedback loops — Lira hearing her own output:

```javascript
// Simplified echo gate logic
if (isLiraCurrentlyOutputting) {
  // Drop captured audio frame — it's Lira's own voice
  return;
}
// Forward to Nova Sonic for processing
novaSonic.pushAudio(pcmData);
```

The Echo Gate must handle multi-turn responses where Nova Sonic splits a long answer into multiple audio chunks.

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
