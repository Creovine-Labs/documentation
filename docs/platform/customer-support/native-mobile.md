---
slug: /platform/customer-support/native-mobile
sidebar_position: 8
title: Native mobile support
description: Add a native, in-app support experience to your mobile app — session-token auth over Lira's chat WebSocket. No WebView.
---

# Native mobile support

Deliver support **inside your mobile app**, native, the way Cash App, Monzo, and
Revolut do it — your own chat UI over Lira's API. **Not** a WebView, and **not**
MCP (MCP is separate — it's how the AI takes *actions*; see [MCP server](/platform/customer-support/mcp)).

The flow is two moving parts:

```
Your app  ──►  Your backend (mints a Lira session token — holds the API key)
   │
   └── native chat screen  ──►  Lira chat WebSocket  ──►  AI (KB answers + actions)
```

## 1. Your backend mints a session token

The app must **never** hold a Lira API key. Your backend does — it mints a
short-lived session token for the logged-in customer using a
[`sessions:mint` developer key](/platform/customer-support/developer-api):

```bash
curl -X POST https://api.creovine.com/lira/v1/support/sessions/orgs/ORG_ID/mint \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "customer": { "email": "customer@example.com", "name": "Ada" }, "ttlSeconds": 3600 }'
```

Response:

```json
{
  "token": "…",
  "session_id": "ssn_…",
  "ws_url": "wss://api.creovine.com/lira/v1/support/chat/ws/ORG_ID?sessionToken=…",
  "rest_base_url": "https://api.creovine.com/lira/v1/support"
}
```

Your app calls **your** endpoint (e.g. `POST /support/session`), which mints and
returns this. The customer identity is baked into the token — the app sends no
signing secret.

## 2. Your app opens the chat WebSocket

Connect to the returned `ws_url` and speak the chat protocol. Minimal client
(Flutter/Dart shown; the shapes are the same in any language):

```dart
final channel = WebSocketChannel.connect(Uri.parse(wsUrl));

// send a message
channel.sink.add(jsonEncode({ 'type': 'message', 'body': 'Where is my transfer?' }));

// receive events
channel.stream.listen((raw) {
  final e = jsonDecode(raw);
  switch (e['type']) {
    case 'welcome':      // greeting on connect
    case 'reply_start':  // AI reply begins (has message_id)
    case 'reply_chunk':  // append e['body'] to the message with this message_id
    case 'reply_end':    // finalize (if e['body'] present, replace the text)
    case 'confirm':      // AI wants to run an action — show Approve / Decline
    case 'card':         // a rich card (ticket opened, etc.)
    case 'action_result':// a tool ran
    case 'error':
  }
});
```

### The events you'll handle

| Event | Meaning |
|---|---|
| `welcome` | Greeting on connect (`body`, optional `conv_id`). |
| `typing` | AI is thinking. |
| `reply_start` / `reply_chunk` / `reply_end` | A streamed AI reply. Accumulate `reply_chunk.body` by `message_id`; finalize on `reply_end` (replace text if it carries `body`). |
| `reply` | A complete (non-streamed) reply. |
| `confirm` | The AI wants to run an action that needs the customer's OK. See below. |
| `step_up` | A higher-risk action needs re-authentication (mint a step-up proof). |
| `card` | A rich card (`title`, `body`, `badge`, `buttons`). |
| `action_result` | A tool ran (`tool_name`, `ok`, `label`). |
| `status` | Conversation status; capture `conv_id` from the first `status` for history/polling. |
| `error` | Show the message. |

## Confirm-before-action

This is what makes actions safe on mobile. When the AI wants to do something that
needs permission (e.g. **freeze a card**), you receive:

```json
{ "type": "confirm", "pending_id": "pend_…", "tool_name": "…",
  "title": "Freeze card", "body": "Freeze your card ending 4291?", "arguments": { … } }
```

Show your own native confirm sheet, then send back:

```json
{ "type": "confirm_response", "pending_id": "pend_…", "approved": true }
```

The AI then runs the action and streams the result. Send `"approved": false` to
decline. For a `step_up` event, re-authenticate the customer (PIN/biometric),
have your backend mint a step-up proof, and reply with
`{ "type": "step_up_response", "pending_id": "…", "step_up_token": "…" }`.

## History & tickets (REST)

For conversation history and tickets, the same session token authenticates the
REST endpoints under `rest_base_url` (`?sessionToken=…`):

- `GET /chat/conversations/ORG_ID` — the customer's conversations
- `GET /chat/conversation/ORG_ID/CONV_ID` — one conversation with messages
- `GET /chat/history/ORG_ID` — most recent conversation as a flat list

## Reference app

A complete, runnable Flutter reference (a fintech-style app with a native support
screen implementing everything above, including confirm-before-action) is
available from the Lira team. It's the fastest way to see the full loop end to
end. WebView remains a documented quick-start fallback, but native is the
recommended experience.
