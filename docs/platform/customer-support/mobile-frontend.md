---
sidebar_position: 10
title: "Mobile: the app part"
description: For the mobile/frontend engineer. Build a native support chat screen in your app — connect, send a message, show the streaming reply. Then add the extras.
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
---

# Mobile: the app part

**Who this page is for:** the **mobile / frontend engineer**.

:::danger Designing the screens? Read the UI/UX spec FIRST
**→ [Mobile chat UI/UX spec — what every screen and state must show](/platform/customer-support/native-mobile#design-spec)**

You build the chat UI, so **your designer needs this before they open Figma.**
Lira sends states a normal chat mockup does not include — a typing indicator,
streaming text that arrives word by word, quick-reply chips, an
approve/deny confirmation card, human-agent avatars, and **markdown that must
render** (bold, lists, and code blocks — the AI does send code).

Design without it and the mockups will not match what the API actually sends.
Hand this link to your designer at the same time you start building.
:::

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
channel.sink.add(jsonEncode({ 'type': 'message', 'body': 'How do I freeze my card?' }));
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
| `welcome` | Sent immediately on connect. Confirms the socket is live — safe to ignore. |
| `status` | Connection/conversation state. Safe to ignore at first. |
| `typing` | Lira is thinking. Show your typing indicator. |
| `reply_start` / `reply_chunk` / `reply_end` | **Required.** Build the streaming bubble (Step 4). A short answer may arrive as a single `reply_chunk`. |
| `history` | On reconnect, past messages. Render them so the chat isn't empty. |
| `confirm` | Lira wants to do something (e.g. freeze a card). Show **Approve / Deny** buttons, then send `confirm_response`. |
| `action_result` | The action finished. Show a small "Card frozen ✓" note. |
| `agent_reply` | A **human** teammate replied. Show their `sender_name` / `sender_avatar`. |
| `proactive` | Lira started the conversation. Show it like a normal message. |
| `handback` | The human handed the chat back to the AI. Optional small note. |
| `error` | Show a friendly retry message. |

---

## WHAT TO BUILD FOR EACH EVENT (UI/UX SPEC)

The **[Native mobile reference](/platform/customer-support/native-mobile)** documents,
for every event above: the exact payload, and **what to render for it** — bubble
layout, typing indicator, quick-reply chips, avatars, the confirm-before-action
card, history replay, and CSAT. Flutter examples throughout.

Use this page to get connected. Use that page while building the screen.

---

## A working reference app

We have a **complete, runnable Flutter app** — a fintech-style app with a native
support screen implementing everything on this page: streaming, typing
indicator, quick-reply chips, avatars, confirm-before-action, history, and CSAT.
It comes with a tiny demo backend so you can run the whole loop on your laptop.

**Ask us for the `lira-mobile-demo` reference app** — it's the fastest way to see
the full flow, and the code maps directly to Swift, Kotlin, and React Native.

📧 [info@liraintelligence.com](mailto:info@liraintelligence.com)

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
