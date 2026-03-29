---
slug: /api/websocket
sidebar_position: 9
title: WebSocket API
---

# WebSocket API

Real-time bidirectional communication for audio streaming and live meeting updates.

## Connection

### `GET /lira/v1/ws`

Upgrade to WebSocket connection. Requires JWT authentication via query parameter:

```
wss://api.creovine.com/lira/v1/ws?token=<jwt_token>
```

## Message Types

### Client → Server

#### Audio Data

Stream microphone audio to Lira (for demo meetings):

```json
{
  "type": "audio",
  "data": "<base64_encoded_pcm>",
  "sampleRate": 16000
}
```

#### Join Meeting

```json
{
  "type": "join",
  "meetingId": "mtg_def456"
}
```

### Server → Client

#### Transcript Update

```json
{
  "type": "transcript",
  "data": {
    "speaker": "John Smith",
    "text": "I think we should refactor the API",
    "timestamp": "2026-03-29T10:15:32Z",
    "role": "user"
  }
}
```

#### AI Response

```json
{
  "type": "ai_response",
  "data": {
    "text": "Based on your codebase, refactoring the API would...",
    "audio": "<base64_encoded_pcm>",
    "timestamp": "2026-03-29T10:15:38Z"
  }
}
```

#### Bot Status Update

```json
{
  "type": "bot_status",
  "data": {
    "botId": "bot_abc123",
    "status": "active",
    "participantCount": 4
  }
}
```

#### Meeting Ended

```json
{
  "type": "meeting_ended",
  "data": {
    "meetingId": "mtg_def456",
    "duration": 3600,
    "summaryAvailable": true
  }
}
```

## Connection Lifecycle

1. Client connects with JWT token
2. Client sends `join` message with meeting ID
3. Server streams real-time transcript and status updates
4. For demo meetings, client also streams audio data
5. Connection closes when meeting ends or client disconnects

## Heartbeat

Clients should send a ping every 30 seconds to keep the connection alive:

```json
{
  "type": "ping"
}
```
