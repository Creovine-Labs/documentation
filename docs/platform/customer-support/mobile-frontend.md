---
sidebar_position: 10
title: "Mobile: the app part"
description: "The complete mobile guide for the frontend engineer — connect to Lira, then build the chat screen: every event, every screen state, markdown, chips, confirm-before-action, avatars, and accessibility."
keywords:
  - mobile frontend
  - mobile app
  - ios
  - android
  - flutter
  - react native
  - swift
  - kotlin
  - websocket
  - chat ui
  - native
  - ui
  - ux
  - design
  - chat screen
---

# Mobile: the app part

**Who this page is for:** the **mobile / frontend engineer**.

**What you're building:** a support chat screen inside your app. You design the
screen (it's your app, your styling). Lira sends you the words to put in it.

:::warning Before you start
Your **backend engineer must finish [their part](/platform/customer-support/mobile-backend) first.**
You need one thing from them: **the URL of your app's `/support/session` endpoint.**
Without it you can't connect. Go ask them for it now.
:::

---

## How it works (30 seconds)

```
1. Your app  ──►  YOUR backend /support/session   →  returns  ws_url
2. Your app  ──►  opens a WebSocket at that ws_url
3. Your app  ──►  sends  {"type":"message","body":"hi"}
4. Lira      ──►  streams the reply back, word by word
```

That's the whole thing. It's a WebSocket and JSON messages — so **any platform
works**: Swift, Kotlin, Flutter, React Native.

You never touch the API key. Your backend already handled that.

:::note Staging vs production — nothing to do on your side
Lira supports test and live mode, and the mode is decided by the key **your
backend** mints with. Your staging builds automatically produce test traffic
(no real emails or Slack alerts, separate quota, kept out of the live inbox)
purely because they point at your staging backend. Your app code is identical
in both.

The only optional thing: the session response includes `"mode": "test" | "live"`.
Show a small "Test mode" banner in internal builds if you find that useful.
See [Test and live mode](/platform/customer-support/test-and-live-mode).
:::

---

## Step 1 — Get the session

Call your own backend (with your app's normal login). You get back a `ws_url`.

```dart
final res = await http.post(
  Uri.parse('$yourBackendUrl/support/session'),
  headers: { 'Authorization': 'Bearer $yourUserToken' },
);
final wsUrl = jsonDecode(res.body)['ws_url'];
```

## Step 2 — Open the socket

```dart
final channel = WebSocketChannel.connect(Uri.parse(wsUrl));
```

Nothing else to authenticate — the `ws_url` already carries the session.

## Step 3 — Send what the user types

```dart
channel.sink.add(jsonEncode({ 'type': 'message', 'body': 'Where is my order?' }));
```

## Step 4 — Show the reply as it streams in

Replies arrive in **three** messages: a start, many chunks, then an end.

```dart
channel.stream.listen((raw) {
  final msg = jsonDecode(raw);
  switch (msg['type']) {
    case 'reply_start':                       // Lira began answering
      startNewBubble();                       //  → add an empty bubble
      break;
    case 'reply_chunk':                       // a piece of the answer
      appendToBubble(msg['body']);            //  → append text (this is the typing effect)
      break;
    case 'reply_end':                         // finished
      finishBubble();                         //  → stop the typing indicator
      break;
  }
});
```

**That's a working support chat.** Ship this, then add the extras below.

:::note Verified
This exact sequence — mint, connect, send, stream — was tested against the live
API on 5 August 2026 and returned a streaming reply. If it fails for you, see
[Common problems](#common-problems) at the bottom.
:::

---

## Everything you can send

| Send this | When |
|---|---|
| `{"type":"message","body":"..."}` | User sends a message |
| `{"type":"typing"}` | User is typing (optional, shows the agent they're active) |
| `{"type":"confirm_response","pending_id":"...","approved":true}` | User tapped Approve/Deny on a confirmation |
| `{"type":"end","body":"5"}` | User closed the chat (optional CSAT score 1–5) |

## Everything you can receive

Handle the first three; the rest are optional upgrades.

| You receive | What to do |
|---|---|
| `welcome` | Sent immediately on connect. Carries `conv_id` and `status` when a conversation resumed, and `previous_conversation` when there is nothing to resume but the customer has a settled thread (see [Conversations across visits](#lifecycle)). |
| `status` | **Handle `status: "resolved"`.** A teammate closed the chat from the dashboard, or the chat ended. `body` carries the closing message — show it, stop the composer, and offer "Start a new chat". This is how a human takeover ends. Other status values are informational. |
| `typing` | Lira is thinking. Show your typing indicator. |
| `reply_start` / `reply_chunk` / `reply_end` | **Required.** Build the streaming bubble (Step 4). A short answer may arrive as a single `reply_chunk`. `message_id` is the **same id the message has in `history`** — key your bubble on it and reconnects reconcile with no matching on text. |
| `history` | On reconnect, past messages. Render them so the chat isn't empty. Each `id` matches the `message_id` you saw while the message streamed. |
| `confirm` | Lira wants to run an action and needs the customer's OK. Show **Approve / Deny** buttons, then send `confirm_response`. |
| `action_result` | An internal step finished. **Safe to ignore — our own web widget ignores it.** Not limited to MCP or registered actions: built-in steps such as a knowledge-base lookup emit it too, so you will see it on ordinary chats in a workspace with no actions configured. Render it only if you deliberately want to show the customer what Lira is doing. |
| `agent_reply` | A **human** teammate replied. Show their `sender_name` / `sender_avatar`. |
| `proactive` | Lira started the conversation. Show it like a normal message. |
| `handback` | The human handed the chat back to the AI. Optional small note. |
| `error` | Show a friendly retry message. `code` identifies the reason (e.g. `INVALID_CSAT_SCORE`) and `message` is human-readable. |

### Message ids

The id in `reply_start` / `reply_chunk` / `reply_end` **is** the id the message
carries in `history`. Key your bubble on `message_id` and a reconnect replays
the same message under the same id, so you can de-duplicate on identity rather
than on body text.

```jsonc
// while it arrives
{ "type": "reply_start", "message_id": "msg-542443ab-e55a-4658-8931-dafdb51e900c" }
{ "type": "reply_end",   "message_id": "msg-542443ab-e55a-4658-8931-dafdb51e900c" }

// after reconnect
{ "type": "history", "messages": [
  { "id": "msg-542443ab-e55a-4658-8931-dafdb51e900c", "role": "lira", "body": "…" }
]}
```

:::note Older builds
Before August 2026 the streaming frames used an ephemeral `lira_<timestamp>_<n>`
id that never appeared in history. If you are reading this against an older
deployment, that is the behaviour you will see.
:::

---

## Conversations across visits {#lifecycle}

### What we recommend for a native app

**One conversation per visit, with past threads reachable behind a list.** On
connect, Lira resumes the customer's **open** conversation if there is one, so a
customer who backgrounds the app and returns an hour later lands back in the
same thread. A conversation that has been resolved is not resumed: the next
message starts a fresh one.

That is deliberate. A support thread has an end, and reopening a settled
question weeks later gives the model stale context to answer from. Show previous
threads in a "Previous chats" list and let the customer tap into one.

| You want | Do this |
| --- | --- |
| Continue where they left off | Connect normally. The open conversation resumes automatically. |
| Show past threads | `GET /support/chat/conversations/{orgId}` with the session token. |
| Reopen a specific past thread | Connect with `&convId=<conv_id>` — this works for a resolved conversation too. |
| Always start fresh | Connect with `&forceNewCase=true`. |

Both mechanisms are supported and neither is going away.

:::caution Do not send `end` on backgrounding
`{"type":"end"}` **resolves** the conversation — it means "the customer is
finished", not "the socket is closing". An app that sends it when it
backgrounds, loses the network or tears down the socket resolves the thread
every session, and the customer starts empty every launch.

Just close the socket. Nothing needs to be sent, and the conversation stays
open for the next connect.
:::

### When a teammate closes the chat

This is the normal end of a human takeover, and it needs no polling.

**If the app is open**, the socket receives a push the moment your teammate hits
Resolve in the dashboard:

```json
{
  "type": "status",
  "status": "resolved",
  "body": "This conversation has been resolved. Thanks for reaching out! Start a new chat if you need more help."
}
```

Show `body`, disable the composer, and offer **Start a new chat** — the next
message opens a fresh conversation automatically. (Our web widget does exactly
this, then shows a rating prompt.)

**If the app was closed** — the common case, since teammates usually resolve
after the customer has gone — there is no socket to push to. The next connect
tells you instead: `welcome` carries `previous_conversation`.

```json
{
  "type": "welcome",
  "body": "Hi! How can we help you today?",
  "previous_conversation": {
    "conv_id": "conv-22482636-…",
    "status": "resolved",
    "resolved_at": "2026-08-07T14:14:28.555Z",
    "resolution_type": "human",
    "message_count": 4
  }
}
```

`resolution_type` is `human` when a teammate resolved it and `autonomous` when
Lira or the customer did. Use it to show something honest — "Your last chat was
resolved by our team" — with a tap to reopen it via `&convId=`. Without this a
returning customer sees an empty screen and assumes their history is gone.

### Conversation states

A conversation is always exactly one of four states. **There is no `closed`
state for conversations** — `closed` is a *ticket* status, so if you are seeing
it, you are looking at a ticket.

| State | Set when | Set by |
| --- | --- | --- |
| `open` | Created, or reopened from the inbox or the support portal | Lira, your team |
| `pending` | An action chain stopped on a failure and is waiting | Lira |
| `escalated` | Handed to a human teammate | Lira, your team |
| `resolved` | The client sent `{"type":"end"}`; a voice call ended; a teammate resolved it in the inbox | Your app, Lira, your team |

Nothing resolves a conversation on a timer — inactivity alone never changes the
state. A thread stays `open` until something explicitly resolves it, and only
`open` conversations are auto-resumed on connect.

### Ending a chat and collecting CSAT

```jsonc
{ "type": "end", "body": "5" }   // optional CSAT: a whole number, 1 to 5
```

The score is stored against the conversation and the conversation resolves. If
`body` is present but is not a whole number from 1 to 5, the conversation still
resolves — refusing to end a chat over a bad rating would be worse — and you
get an error frame naming the problem:

```json
{
  "type": "error",
  "code": "INVALID_CSAT_SCORE",
  "message": "CSAT score must be a whole number from 1 to 5. Received \"9\" — the conversation was ended without a rating."
}
```

Omit `body` entirely to end without a rating.

---

## Voice calls — the mic button {#voice}

Your app can also **talk** to Lira, the same way the web widget does. Same
session token, a different socket, and raw audio instead of text.

```
Your app  ──►  YOUR backend /support/session   →  same token as chat
Your app  ──►  opens  wss://…/support/chat/voice/{orgId}?sessionToken=…
Your app  ──►  streams mic audio as BINARY frames
Lira      ──►  streams speech back as BINARY frames + JSON events
```

Turn it on first — dashboard or terminal, whichever suits you:

```bash
lira channels enable voice
```

or **Settings → Support → Channels → Voice**. If voice is off, the socket closes
with code `4004`.

### The socket

```
wss://api.creovine.com/lira/v1/support/chat/voice/{orgId}?sessionToken=<token>
```

Reuse the token your backend already mints — no second call, no extra scope.
The caller is identified exactly as in chat, so Lira greets them by name and
account-scoped actions work.

### Audio format

This is the part to get right — it is raw PCM, not a container format, so there
is no WAV/MP3 header:

| Direction | Frame | Format |
|---|---|---|
| App → Lira (mic) | binary | PCM **16 kHz**, 16-bit signed, mono, little-endian |
| Lira → App (speech) | binary | PCM **24 kHz**, 16-bit signed, mono, little-endian |

Note the rates differ — capture at 16 kHz, play back at 24 kHz. Send small
chunks continuously (~20–100 ms each) as the mic produces them; don't buffer the
whole utterance. Barge-in works: keep streaming mic audio while Lira is talking
and it will stop to listen.

- **iOS** — `AVAudioEngine` with an `AVAudioFormat` of 16 kHz / 1 channel / Int16, plus `AVAudioSession` in `.playAndRecord` with `.voiceChat` mode for echo cancellation.
- **Android** — `AudioRecord` at 16 kHz `ENCODING_PCM_16BIT` mono with `VOICE_COMMUNICATION` source, and `AudioTrack` at 24 kHz for playback.
- **Flutter / React Native** — any mic-stream package that yields raw PCM16 frames works; the socket is plain WebSocket.

### JSON events on the same socket

Text frames are JSON. Binary frames are audio. Branch on the frame type.

**Lira → your app**

| Event | What to do |
|---|---|
| `call_started` | The call is live. Carries `session_id`, `logical_call_id` and `conversation_id` — the last one is the conversation this call belongs to in your inbox. Switch the UI into its in-call state. |
| `transcript` | Live transcript — `{ role, text }`. Show it as a caption so the call is followable in a noisy place, and for accessibility. |
| `interruption` | The caller barged in. **Stop playback immediately and drop any queued audio**, or Lira's old sentence talks over the new one. |
| `confirm` | Lira wants approval before doing something real. Show an approve/deny sheet. |
| `confirm_ack` | Your approval was recorded. Carries `action_id` and `status`. |
| `call_ended` | Tear down audio and close the call UI. |
| `error` | Something failed while starting the call. Show a friendly message and end. |

**Your app → Lira**

| Send | When |
|---|---|
| binary PCM frames | continuously, while the mic is open |
| `{"action":"confirm_response","action_id":"…","approved":true}` | the caller tapped approve or deny |
| `{"action":"end_call"}` | the caller hung up |

Note voice uses `action` where the chat socket uses `type` — they are separate
sockets with separate protocols.

### What you build

- a **mic button** on the chat screen that opens the voice socket
- an **in-call state**: who is speaking, live transcript, a mute control, and a clear **End call** button
- **microphone permission** handling with a graceful denial path — ask only when the mic button is first tapped, never on app launch

:::tip It is one conversation, not two
A voice call continues the customer's open conversation rather than starting a
parallel one. If John chatted this morning and calls this afternoon, Lira has
that context, the transcript lands in the same thread in your team's inbox, and
it answers from the same knowledge base. Your team sees one customer with one
history — not a chat log and a separate call log.
:::

---

## What you build — UX checklist {#design-spec}

Everything below is **yours to render** (it's your app), and every item is fed
by an event Lira already sends. This table is the spec.

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

## Screen states to design

The events above cover a working conversation. These are the states around it —
design them or the screen feels broken in normal use.

| State | When | What to show |
|---|---|---|
| **Connecting** | Minting the session and opening the socket | A spinner in the message area. Keep the input visible but disabled. |
| **Empty** | First open, no history | A one-line greeting and 2–3 starter chips ("Track my order", "Talk to a human"). Never a blank screen. |
| **Resuming** | `history` arrives | Render past messages instantly, scrolled to the newest. No animation — it isn't new. |
| **Sending** | User tapped send | Show the bubble immediately with a subtle "sending" tick. Don't wait for the server. |
| **Send failed** | Socket dropped mid-send | Keep the bubble, mark it failed, offer **Retry**. Never silently drop a message. |
| **Disconnected** | Socket closed | A thin bar: "Reconnecting…". Reconnect automatically; a human agent may still reply. |
| **Session expired** | Token past its TTL (default 1h) | Mint a new session and reconnect silently. The user should not see this. |
| **Action running** | After the user approves a `confirm` | Disable the approve button and show progress until `action_result`. |
| **Resolved** | `status: "resolved"` | Show the CSAT prompt, then a "Start a new chat" button. |

### Layout rules

- **Auto-scroll to the newest message**, but stop if the user has scrolled up — show a "jump to latest" button instead. Yanking the view is the most common chat-UI complaint.
- **Keyboard and safe area** — the input must sit above the keyboard and the home indicator. Test on a notched device.
- **Timestamps** — group by time and show one per group, not per bubble.
- **Long content** — code blocks scroll horizontally rather than wrapping; links are tappable.
- **Tap targets** at least 44×44pt. Chips and the confirm buttons are the ones people miss.

### Accessibility

Label the send button, the chips, and the approve/deny buttons for screen readers.
Announce a new AI reply politely so it isn't read mid-stream. Respect the OS text
size — bubbles must grow with it, never clip. Don't rely on colour alone to show a
failed message; add an icon or text.

## Render markdown

AI replies come back as **markdown** — `**bold**`, `` `code` ``, fenced code
blocks, lists, links. Render it, don't print it raw, or customers see literal
asterisks and backticks. This is a UI responsibility you can't skip:

- **Flutter** — `flutter_markdown` (`MarkdownBody`).
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

:::note The actions are yours, not ours
Lira has no built-in actions. Whatever your organization connects under
**Settings → Support → Actions** is what the AI can run — cancelling an order,
changing a booking, updating a subscription, whatever your product does. The
`confirm` event is the same shape regardless; only `title`, `body`, and
`tool_name` differ. Design the sheet generically and render what arrives.
:::

This is what makes actions safe on mobile. When the AI wants to do something that
needs permission, you receive:

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

**Minting the step-up proof** is the same session-mint call your backend already
makes — just add `"stepUp": true`. It returns a short-lived proof token you pass
straight back as `step_up_token`:

```bash
curl -X POST https://api.creovine.com/lira/v1/support/sessions/orgs/ORG_ID/mint \
  -H "Authorization: Bearer $LIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "customer": { "email": "customer@example.com" }, "stepUp": true, "ttlSeconds": 300 }'
```

Do this only *after* the customer passes a fresh re-auth (PIN/biometric) on the
device, so the proof genuinely represents a second factor.

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

---

## Checklist

- [ ] Got the `/support/session` URL from your backend engineer
- [ ] `POST` to it returns a `ws_url`
- [ ] WebSocket opens without error
- [ ] Sending `{"type":"message"}` produces `reply_chunk` messages
- [ ] Text appears in the UI as it streams
- [ ] *(Then)* handle `history`, `confirm`, and `agent_reply`

---

## Common problems

| What you see | Fix |
|---|---|
| Socket closes immediately | The session expired (default 1 hour). Call `/support/session` again for a fresh `ws_url`. |
| `/support/session` returns 401 | Your app isn't sending its own login token — that endpoint is behind your normal auth. |
| Connects, but replies are empty | The knowledge base is empty. Dashboard → **Grow → Knowledge Base** → add your content. |
| No `ws_url` in the response | Backend issue — send your backend engineer to [their page](/platform/customer-support/mobile-backend). |

