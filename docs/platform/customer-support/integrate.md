---
sidebar_position: 3
title: Add Lira to your app — start here
description: The starting point for putting Lira support in your product. Do two setup steps, then pick your path — website, web app, or mobile app (frontend and backend each get their own page).
keywords:
  - integrate
  - integration
  - getting started
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
  - api key
  - org id
  - frontend
  - backend
  - embed
  - in-app support
---

# Add Lira to your app — start here

**This is the page to send your developer.**

Everyone does the same **two setup steps** first. Then you pick **one** path
depending on what you're building. Each path is its own page with complete,
copy-paste instructions — you won't need to read anything else.

---

## Step 1 — Turn on Customer Support

Nothing works until support is switched on for your organization. Do this once.

1. Log in at **[app.liraintelligence.com](https://app.liraintelligence.com)**.
2. In the left sidebar, click **Customer Support**.
3. Click **Activate** and follow the 4-step wizard (it starts with your support email address).

Done? You'll now see **Work**, **Grow**, and **Admin** in the sidebar.

📖 Details: [Activation guide](/platform/customer-support/activation)

---

## Step 2 — Copy your two credentials

Keep these somewhere handy — every path below needs them.

### Your Organization ID

Looks like `org-556fc4d1-9f29-4114-bb0e-da83ddab6c70`.

> **Settings** (bottom of sidebar) → **Organization** tab → **General**
> It's at the top, with a **Copy** button.

### Your API key *(only for mobile apps — skip if you're doing a website)*

Looks like `lira_sk_...`.

> **Settings** → **Support** tab → **Developers** → **New key**
> Tick the **`sessions:mint`** scope, create it, and **copy it now** — it's shown once.

:::danger Keep the API key on your server
The API key must **never** ship inside a mobile app or browser code. Anyone who
extracts it could impersonate your support. It lives on your backend only. (This
is exactly why mobile has a separate backend step — see below.)
:::

---

## Step 3 — Teach Lira about your product

Lira answers from **your** content. If you skip this, it has nothing to say.

> **Grow** → **Knowledge Base** → **Web Sources** → paste your website URL → **Crawl**

You can also upload documents or connect Google Drive on the other tabs.

📖 Details: [Knowledge Base](/knowledge-base/overview)

---

## Step 4 — Pick your path

Choose the one row that matches you. **Click it. That page has everything.**

### 🌐 I want Lira on my website

One line of HTML. No coding beyond copy-paste. ~2 minutes.

**→ [Website install guide](/platform/customer-support/widget)**

### ⚛️ I'm building a web app (React, Next.js, Vue, Rails, Django, Express…)

Install the npm package and mount it in your app.

**→ [Web app install guides](/platform/customer-support/integration-guides)**

### 📱 We're adding support inside our mobile app (iOS, Android, Flutter, React Native)

This one is a **two-person job** — a backend engineer and a frontend engineer.
Each has their own page. Send each person **their** link:

| Who | What they do | Send them this |
|---|---|---|
| **Backend engineer** | Adds **one endpoint** that hands the app a support session. ~20 lines of code. | **→ [Mobile: the backend part](/platform/customer-support/mobile-backend)** |
| **Frontend / mobile engineer** | Builds the chat screen and connects it. | **→ [Mobile: the app part](/platform/customer-support/mobile-frontend)** |

:::tip Do the backend part first
The app can't connect until the backend endpoint exists. Backend takes ~30
minutes; then the app developer is unblocked.
:::

---

## A quick word on "MCP"

You'll see **MCP** mentioned around the dashboard and docs. **You do not need it
to add support to your app.** MCP is a separate, optional feature for letting
Lira *do things* in your systems later (freeze a card, issue a refund).

Get chat working first with the path above. Add MCP when you want actions.
📖 [MCP guide](/platform/customer-support/mcp) when you're ready.

---

## Something not working?

- Run live diagnostics: **Settings → Support → Health & audit → Setup Health**. Every failed check tells you what's wrong and how to fix it.
- [Troubleshooting guide](/platform/customer-support/integration-guides/troubleshooting) — symptom-to-fix map.
