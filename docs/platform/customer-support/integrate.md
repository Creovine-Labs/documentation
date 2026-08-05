---
sidebar_position: 3
title: Integrate Lira — start here
description: The one page that tells you how to put Lira support inside your product — website, web app, or native mobile app (iOS, Android, Flutter, React Native). Pick your path in 30 seconds.
keywords:
  - integrate
  - integration
  - mobile
  - mobile app
  - ios
  - android
  - flutter
  - react native
  - native
  - sdk
  - mobile sdk
  - widget
  - api
  - mcp
  - embed
  - in-app support
---

# Integrate Lira — start here

**Send this page to your developer.** It answers the only question that matters
at the start: *"how do I put Lira inside my product?"* Pick the row that matches
what you're building — each one links to a complete, copy-paste guide.

| What you're building | What you use | Guide |
|---|---|---|
| A **website** or marketing site | **Chat widget** — one `<script>` tag | [→ Widget install](/platform/customer-support/widget) |
| A **web app** (React, Next.js, Vue, Rails, Django…) | **Web SDK** — `npm i @liraintelligence/support` | [→ Install guides](/platform/customer-support/integration-guides) |
| A **native mobile app** (iOS, Android, Flutter, React Native) | **Chat WebSocket + session token** — you build the UI | [→ Native mobile guide](/platform/customer-support/native-mobile) |
| Letting Lira **do things** in your systems (freeze a card, issue a refund) | **MCP server** or REST actions | [→ MCP](/platform/customer-support/mcp) · [→ Actions](/platform/customer-support/actions) |

---

## Read this before you choose

These four names get mixed up constantly. Here's the difference in one line each:

- **Widget** — Lira's own prebuilt chat UI, dropped onto a web page with one script tag. Fastest path. You don't build any UI.
- **Web SDK** — the same runtime as an npm package, for web apps that want control over mounting, routing, and identity. Still Lira's chat UI.
- **Native mobile** — **you build the chat screen** in your own app (SwiftUI / Kotlin / Flutter / React Native) and talk to Lira's chat WebSocket. Not a WebView. This is how Cash App / Monzo / Revolut-style in-app support works.
- **MCP** — **not a way to embed support.** MCP is how Lira takes *actions* in your backend during a conversation. It's orthogonal: you can use MCP with any of the three channels above, or none of them.

:::tip The one-line rule
**Channel** = where the customer chats (widget / Web SDK / native mobile).
**MCP + Actions** = what Lira can *do* while chatting.
You always pick a channel. MCP is optional.
:::

---

## "I'm on mobile — is there a mobile SDK?"

**Short answer: you do not need one, and you are not blocked.**

There is no drop-in native SDK package yet (a React Native SDK is on the
[roadmap](/platform/customer-support/sdks)). Native mobile integrates a
different — and more flexible — way:

1. **Your backend mints a session token** for the logged-in customer (holds your `LIRA_API_KEY`; never ship the key in the app).
2. **Your app opens Lira's chat WebSocket** with that token.
3. **You render the events** — streaming replies, quick-reply chips, confirm-before-action prompts, human-agent handoff, history.

You own the UI; Lira owns the intelligence and puts everything your UI needs on
the wire. The **[Native mobile guide](/platform/customer-support/native-mobile)**
is the complete contract — every event, every payload, and exactly what to build
for each — plus a **runnable Flutter reference app** that implements 100% of it.

This works for **iOS (Swift/SwiftUI), Android (Kotlin/Compose), Flutter, and
React Native** — it's a WebSocket, so any platform that can open one can do it.

:::info Just need it working today, on any platform?
If your app can host a web view or you're shipping a web-based mobile
experience, the [widget](/platform/customer-support/widget) or the
[hosted support portal](/platform/customer-support/portal) work immediately with
no mobile code. Native gives the best experience; these give you speed.
:::

---

## What you need before you start (all paths)

1. **Your Organization ID** — Lira dashboard → **Settings → Organization → General** (has a Copy button).
2. **Knowledge in the KB** — Lira answers from your content. Add it at **Grow → Knowledge Base** (crawl your site, upload docs, or connect Drive). Without this, Lira has nothing to answer from.
3. **For identified/logged-in customers** — the **signing secret** at **Settings → Support → Get connected → Developer options**, used to sign the customer's email server-side so Lira can trust who they are.
4. **For native mobile or automation** — a **developer API key** at **Settings → Support → Developers** (used as `LIRA_API_KEY`).

---

## Still stuck?

- **Something not working?** → [Troubleshooting](/platform/customer-support/integration-guides/troubleshooting), or run live diagnostics at **Settings → Support → Health & audit → Setup Health**.
- **Using Claude Code or an AI editor?** → install the [Claude Code skill](/platform/customer-support/integration-guides/claude-code-skill) and run `/lira-install`.
- **Want the full API surface?** → [Developer API](/platform/customer-support/developer-api) · [API reference](/platform/customer-support/api-reference).
