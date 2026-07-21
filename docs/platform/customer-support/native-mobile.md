---
slug: /platform/customer-support/native-mobile
sidebar_position: 8
title: Native mobile support
description: Build a native, in-app support experience on Lira's chat WebSocket — the full event catalogue and the exact UX you build. No WebView.
---

# Native mobile support

Deliver support **inside your mobile app**, native, the way Cash App, Monzo, and
Revolut do it — your own chat UI over Lira's API. **Not** a WebView, and **not**
MCP (MCP is separate — it's how the AI takes *actions*; see [MCP server](/platform/customer-support/mcp)).

On native, **you own the UI** — it's your app, your design system, your screen.
Lira owns the intelligence and puts everything the UI needs **on the wire**:
streaming replies, quick-reply chips, confirm-before-action, human-agent
identity, history. This page is the complete contract: every event, every
payload, and exactly **what you build** for each one.

There's a runnable Flutter reference that implements 100% of this — see
[Reference app](#reference-app).

```
Your app  ──►  Your backend (mints a Lira session token — holds the API key)
   │
   └── native chat screen  ──►  Lira chat WebSocket  ──►  AI (KB answers + actions + human handoff)
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
signing secret. Because the conversation is keyed to the customer, reopening
support **resumes their thread** (you'll receive a `history` event — see below).

## 2. Your app opens the chat WebSocket

Connect to the returned `ws_url` and speak the chat protocol. Minimal client
(Flutter/Dart shown; the shapes are identical in any language):

```dart
final channel = WebSocketChannel.connect(Uri.parse(wsUrl));

// send a message
channel.sink.add(jsonEncode({ 'type': 'message', 'body': 'Where is my transfer?' }));

// receive events
channel.stream.listen((raw) {
  final e = jsonDecode(raw);
  switch (e['type']) { /* handle every event below */ }
});
```

## Message protocol

### Messages you send (client → server)

| `type` | Payload | When |
|---|---|---|
| `message` | `{ type, body }` | The customer sent a message. |
| `typing` | `{ type }` | The customer is typing (so a human agent sees the indicator in the inbox). Optional. |
| `confirm_response` | `{ type, pending_id, approved }` | Answer a `confirm` prompt (`approved: true/false`). |
| `step_up_response` | `{ type, pending_id, step_up_token }` | Proof from your backend after re-authenticating the customer (answers a `step_up`). |
| `end` | `{ type, body? }` | End the conversation. `body` may be a CSAT score `"1"`–`"5"`. |

### Events you receive (server → client)

| `type` | Payload | What it is |
|---|---|---|
| `welcome` | `{ body, conv_id?, status? }` | Greeting on connect. |
| `history` | `{ conv_id, status, messages: [ { id, role, body, timestamp, sender_name?, sender_avatar? } ] }` | The existing thread, replayed on resume. `role` is `customer` \| `lira` \| `agent`. |
| `status` | `{ status, conv_id?, body? }` | Conversation status. Capture `conv_id` on the first one. `status: "resolved"` closes the loop. |
| `typing` | `{ }` | The AI is thinking — show an animated indicator. |
| `reply_start` | `{ message_id }` | A streamed AI reply begins. |
| `reply_chunk` | `{ message_id, body }` | Append `body` to the bubble with this `message_id`. |
| `reply_end` | `{ message_id, body? }` | Finalize. If `body` is present, replace the accumulated text with it. |
| `reply` | `{ conv_id?, body }` | A complete (non-streamed) AI reply. |
| `suggestions` | `{ suggestions: [ "…", "…" ] }` | Quick-reply chips. Tapping one sends its text as the next message. |
| `confirm` | `{ pending_id, tool_name, title, body, arguments }` | The AI wants to run an action that needs the customer's OK. |
| `step_up` | `{ pending_id, tool_name, title, body, arguments }` | A higher-risk action needs re-authentication first. |
| `card` | `{ title?, body?, fields?: [{label,value}], badge?: {text,tone}, buttons?: [{label,action,style}] }` | A rich card (ticket opened, status, etc.). |
| `action_result` | `{ tool_name, ok, label }` | A tool ran — show a result line. |
| `agent_reply` | `{ body, sender_name?, sender_avatar? }` | A **human teammate** has replied. |
| `proactive` | `{ conv_id, body, sender_name?, sender_avatar? }` | A proactive outreach (agent/automation reaches out first). |
| `handback` | `{ body }` | Lira has taken the conversation back from a human. |
| `error` | `{ body }` | Show the message. |

:::note Web-SDK-only events
`navigate`, `lira_action`, and `demo_action_executed` drive actions on a **web
host page** (DOM navigation, prefilling inputs). They don't apply to a native
app — ignore them unless you deliberately implement host-side actions.
:::

## What you build — UX checklist

Everything below is **yours to render** (it's your app), and every item is fed
by an event Lira already sends. This table is the spec — copy the reference app
to see each one implemented.

| UX element | Who supplies it | Driven by |
|---|---|---|
| **Customer avatar** | You (your logged-in user) | your app |
| **Assistant name + avatar** | You (brand the assistant however you like) | your app / your [support settings](/platform/customer-support/settings) |
| **Org logo in the header** | You (your brand) | your app |
| **Typing indicator (animated)** | You render the animation | `typing` |
| **Streaming reply** | You render incremental text | `reply_start` / `reply_chunk` / `reply_end` |
| **Quick-reply chips** | Lira sends them; you render tappable chips | `suggestions` |
| **Confirm-before-action sheet** | You render a native sheet | `confirm` → `confirm_response` |
| **Step-up (PIN/biometric)** | You re-auth + your backend mints a proof | `step_up` → `step_up_response` |
| **Rich card** | You render the card | `card` |
| **Action result** | You show a result line/toast | `action_result` |
| **Human-agent identity (name + avatar)** | Lira supplies the identity; you render it | `agent_reply`, and `role: "agent"` in `history` |
| **Proactive message** | You render it | `proactive` |
| **Handback note** | You render a system line | `handback` |
| **History on resume** | You replay the thread | `history` |
| **Resolved + CSAT** | You render a closing state and rating | `status: "resolved"`; send `end` with a score |

## Render markdown

AI replies come back as **markdown** — `**bold**`, `` `code` ``, fenced code
blocks, lists, links. Render it, don't print it raw, or customers see literal
asterisks and backticks. This is a UI responsibility you can't skip:

- **Flutter** — `flutter_markdown` (`MarkdownBody`), as in the reference app.
- **Swift** — `AttributedString(markdown:)` or a markdown view.
- **Kotlin/Compose** — a markdown renderer (e.g. `compose-markdown`).
- **React Native** — `react-native-markdown-display`.

Render markdown only for **AI / agent** messages; the customer's own text is
plain. Style code blocks with a monospace font and, ideally, a copy button —
Lira often returns copyable snippets (IDs, commands, config).

## Streaming replies

Accumulate `reply_chunk.body` into the bubble keyed by `message_id`; finalize on
`reply_end` (replace the text if `reply_end` carries a `body`). Between the
customer's message and `reply_start`, show the `typing` indicator — **animated**,
not a static "typing…" label (a frozen label reads as a hang):

```dart
case 'typing':      setState(() => typing = true); break;
case 'reply_start': typing = false; addBubble(role: 'lira', id: e['message_id'], streaming: true); break;
case 'reply_chunk': byId(e['message_id']).text += e['body']; break;
case 'reply_end':   final m = byId(e['message_id']); if (e['body'] != null) m.text = e['body']; m.streaming = false; break;
```

## Quick-reply chips

Lira offers chips in guided moments (e.g. "Open a ticket" / "Keep chatting" /
"Connect me with a teammate"). Render the latest `suggestions` set below the
thread; tapping a chip sends its text as a normal `message`, and you clear the
chips when the customer sends anything.

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

The `title` and `body` are already customer-friendly (e.g. **"Are you sure you
want to proceed with card freeze? Confirm to proceed."**) — never the raw tool
name. Render them as-is, or substitute your own copy keyed off `tool_name` if
you want a more branded prompt (e.g. "Freeze your card ending 4291?").

## Human takeover — identity & avatars

When a teammate steps into the conversation from the Lira inbox, the customer's
socket receives `agent_reply` events carrying the teammate's **name and avatar**:

```json
{ "type": "agent_reply", "body": "Hi Ada, I've got this from here.",
  "sender_name": "Sam Rivera", "sender_avatar": "https://…/sam.png" }
```

Render the teammate's avatar and name on their bubbles (and, if you like, a
"You're now chatting with Sam" system line). When Lira resumes, you get a
`handback` event — clear the human identity and continue. Resumed threads carry
the same identity: `history` messages with `role: "agent"` include
`sender_name` / `sender_avatar`.

Avatars overall:

- **Customer** — from your logged-in user (your app).
- **Assistant** — your brand. Lira is the engine; the *face* the customer sees
  is your choice (name it, give it your logo).
- **Human agent** — comes from Lira on `agent_reply` / `history` (`sender_avatar`,
  `sender_name`). Render it; fall back to initials if there's no image.

:::tip Require support agents to set a profile photo
`sender_avatar` may be an `http(s)` URL **or** a base64 `data:` URI (that's how
uploaded photos are stored) — make sure your image widget handles **both** (e.g.
decode `data:` URIs), or a real photo will silently fall back to initials.

Strongly encourage — or require — every teammate who answers customers to set a
profile picture in the dashboard. A real face on the human's replies is a big
authenticity signal for the customer; initials read as a bot.
:::

## History on resume

Because the session is keyed to the customer, reopening support **resumes the
same conversation** and Lira replays it as one `history` event. Render its
`messages` (respecting each `role`) so the customer sees their thread instead of
a blank screen — don't rely on the `welcome` line alone.

## Resolving & CSAT

On `status: "resolved"`, show a closing state. To collect satisfaction, send an
`end` with the score:

```json
{ "type": "end", "body": "5" }
```

### Wipe the local thread on close

When a conversation resolves, **clear the customer's local transcript** (after
CSAT). The organization keeps the full record on their dashboard; the customer
starts fresh on their next issue, so history stays organized and trackable per
issue rather than one endless thread. Wiping is a **client** action — you own
the on-device store — Lira never asks you to keep it.

### Clearing the chat (optional)

You may also offer the customer a manual **"Clear chat"** that wipes only their
on-device thread. It does **not** delete anything on the organization's side —
the dashboard retains the conversation. Purely a local convenience; include it
or not.

## Human takeover — the AI pauses

When a teammate **takes over** from the dashboard, Lira **pauses**: the AI stops
auto-replying and the teammate answers directly (you receive `agent_reply` with
their name + avatar). Any teammate reply — from the inbox or a ticket —
automatically triggers takeover. When the teammate **hands back**, you receive
`handback` and the AI resumes. From the app's side there's nothing special to
implement beyond rendering `agent_reply` and `handback` (already in the event
catalogue) — the pause/resume is enforced server-side.

**Notifying the customer.** While the AI is answering, replies are instant and
the customer is watching — no notification needed. Once a **human** is handling,
replies can arrive minutes later, so Lira also emails the customer on a human
reply (production; suppressed in sandbox) as a "come back to the chat" nudge.
For a true mobile push when the app is backgrounded, wire your own
FCM/APNs off your backend — Lira delivers the message over the socket and by
email; the push channel is yours.

## History & tickets (REST)

For conversation history and tickets outside the socket, the same session token
authenticates the REST endpoints under `rest_base_url` (`?sessionToken=…`):

- `GET /chat/conversations/ORG_ID` — the customer's conversations
- `GET /chat/conversation/ORG_ID/CONV_ID` — one conversation with messages
- `GET /chat/history/ORG_ID` — most recent conversation as a flat list

## Reference app

A complete, runnable Flutter reference — a fintech-style app with a native
support screen — implements **everything on this page**: streaming, an animated
typing indicator, quick-reply chips, avatars for the customer / assistant /
human agent, the org logo in the header, confirm-before-action, history replay,
proactive + handback, and CSAT. It's the fastest way to see the full loop, and
the mapping copies directly to Swift, Kotlin, or React Native. Ask the Lira team
for it. WebView remains a documented quick-start fallback, but native is the
recommended experience.
