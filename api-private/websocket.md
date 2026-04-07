---
slug: /api/websocket
sidebar_position: 9
title: WebSocket API
---

# WebSocket API

Real-time bidirectional communication for audio streaming and live meeting updates. The WebSocket handles both JSON control messages and raw binary PCM audio.

## Connection

```
wss://api.creovine.com/lira/v1/ws?token=<jwt_token>
```

Authentication is via JWT in the query string. The connection upgrades from HTTP to WebSocket on success.

```javascript
const ws = new WebSocket(`wss://api.creovine.com/lira/v1/ws?token=${token}`);
```

---

## Message Types

The protocol uses two channels:

- **JSON messages** — control signals, transcripts, and metadata
- **Binary frames** — raw PCM audio data

### Client → Server (JSON)

| Type | Description | Payload |
|:---|:---|:---|
| `join` | Join a meeting session | `{ meetingId }` |
| `text` | Send a text message | `{ text }` |
| `audio_start` | Begin audio streaming | `{}` |
| `audio_stop` | Stop audio streaming | `{}` |
| `settings` | Update bot settings mid-session | `{ personality?, wake_word_enabled?, ... }` |
| `leave` | Leave the meeting | `{}` |

**Example — Join a meeting:**

```json
{
  "type": "join",
  "meetingId": "mtg_def456"
}
```

### Client → Server (Binary)

Stream raw PCM audio from the client microphone:

- **Format**: 16-bit signed integer, little-endian
- **Sample rate**: 16,000 Hz
- **Channels**: Mono (1 channel)

```javascript
// Capture audio from microphone and send as binary PCM
mediaRecorder.ondataavailable = (event) => {
  const pcmData = convertToPCM16(event.data); // Int16Array
  ws.send(pcmData.buffer);
};
```

### Server → Client (JSON)

| Type | Description | Payload |
|:---|:---|:---|
| `joined` | Successfully joined session | `{ sessionId, participants }` |
| `participant_event` | Participant joined/left | `{ participant, action }` |
| `transcript` | Real-time transcript update | `{ speaker, text, timestamp, role }` |
| `ai_response` | AI text response | `{ text, timestamp }` |
| `ai_response_end` | AI finished responding | `{}` |
| `audio_ready` | Audio chunk available | `{ duration }` |
| `settings_updated` | Settings change confirmed | `{ settings }` |
| `interruption` | Barge-in detected — AI stopped | `{}` |
| `task_created` | AI extracted a task mid-meeting | `{ task }` |
| `error` | Error message | `{ code, message }` |

**Example — Transcript update:**

```json
{
  "type": "transcript",
  "data": {
    "speaker": "Sarah Chen",
    "text": "I think we should refactor the API layer",
    "timestamp": "2026-03-29T10:15:32Z",
    "role": "user"
  }
}
```

**Example — AI response:**

```json
{
  "type": "ai_response",
  "data": {
    "text": "Based on your codebase, refactoring the API layer would improve...",
    "timestamp": "2026-03-29T10:15:38Z"
  }
}
```

### Server → Client (Binary)

Raw PCM audio from the AI response:

- **Format**: 16-bit signed integer, little-endian
- **Sample rate**: 24,000 Hz
- **Channels**: Mono (1 channel)

```javascript
ws.onmessage = (event) => {
  if (event.data instanceof ArrayBuffer) {
    // Binary audio from AI — play through speakers
    const pcm = new Int16Array(event.data);
    playAudio(pcm, 24000);
  } else {
    // JSON control message
    const msg = JSON.parse(event.data);
    handleMessage(msg);
  }
};
```

---

## Connection Lifecycle

```
1. Client connects with JWT token
2. Client sends { type: "join", meetingId: "..." }
3. Server responds with { type: "joined", ... }
4. Client sends { type: "audio_start" }
5. Client streams binary PCM → Server
6. Server streams transcript + AI response JSON
7. Server streams binary AI audio
8. Meeting ends → connection closes
```

## Barge-In (Interruption)

If a participant starts speaking while the AI is responding:

1. Server sends `{ type: "interruption" }`
2. AI audio output stops immediately
3. Client should clear any queued audio buffers
4. AI begins listening to the new speaker

## Error Handling

```json
{
  "type": "error",
  "data": {
    "code": "SESSION_NOT_FOUND",
    "message": "Meeting session not found or has ended"
  }
}
```

Common error codes:

| Code | Description |
|:---|:---|
| `SESSION_NOT_FOUND` | Meeting session doesn't exist |
| `UNAUTHORIZED` | Invalid or expired token |
| `ALREADY_JOINED` | Client already in a session |
| `RATE_LIMITED` | Too many messages |
