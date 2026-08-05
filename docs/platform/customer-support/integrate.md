---
sidebar_position: 3
title: Add Lira to your app — start here
description: Setup steps and integration paths for Lira support. For developers, frontend or backend.
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
  - widget
  - api key
  - org id
  - frontend
  - backend
  - mcp
  - cli
---

# Add Lira to your app — start here

**For developers — frontend or backend.**

Setup is Steps 1–3. Step 4 is the integration path.

---

## STEP 1 — ACTIVATE CUSTOMER SUPPORT

Required. Nothing works until support is on.

Dashboard → sidebar **Customer Support** → **Activate** → complete the 4-step wizard.

Reference: [Activation guide](/platform/customer-support/activation)

---

## STEP 2 — GET CREDENTIALS

**Organization ID** — format `org-...`
Location: **Settings → Organization → General** (Copy button).

**API key** — format `lira_sk_...`. Mobile only. Not needed for website or web app.
Location: **Settings → Support → Developers → New key**. Tick scope **`sessions:mint`**. Shown once.

**API key stays server-side.** Never in app binaries or browser code.

---

## STEP 3 — ADD KNOWLEDGE

Required. Lira answers from your content only.

**Grow → Knowledge Base → Web Sources** → paste site URL → **Crawl**.
Documents and Google Drive are on the adjacent tabs.

Reference: [Knowledge Base](/knowledge-base/overview)

---

## STEP 4 — CHOOSE INTEGRATION PATH

### FOR WEBSITE

One script tag.
→ [Website install](/platform/customer-support/widget)

### FOR WEB APP

React, Next.js, Vue, Rails, Django, Express.
→ [Web app install guides](/platform/customer-support/integration-guides)

### FOR SUPPORT INSIDE MOBILE APP

iOS, Android, Flutter, React Native. Two roles, two pages.

| Role | Task | Page |
|---|---|---|
| **BACKEND** | One endpoint that mints a support session | → [Mobile: the backend part](/platform/customer-support/mobile-backend) |
| **FRONTEND** | Chat screen + WebSocket | → [Mobile: the app part](/platform/customer-support/mobile-frontend) |

Backend first. The app cannot connect until that endpoint exists.

---

## SETUP FROM YOUR EDITOR OR TERMINAL

Available for **website and web app** integration. Not available for mobile.

**AI editor (Claude Code, Codex, Continue):**

```bash
npx @liraintelligence/support install-skill   # once
```
Then `/lira-install` in the editor. Detects framework, installs the package, wires it up.
→ [Claude Code skill](/platform/customer-support/integration-guides/claude-code-skill)

**CLI:**

```bash
npx @liraintelligence/support init
```

Both scaffold code in your project. **Steps 1–3 above are still done in the dashboard** — activation, credentials, and knowledge base are not automated.

---

## ABOUT MCP

MCP is **not** an integration path and is **not** required.

MCP connects Lira **outward to your systems** so it can perform actions during a chat (freeze a card, issue a refund). Configured at **Settings → Support → Actions**.

Integrate chat first using Step 4. Add MCP later if you want actions.
→ [MCP guide](/platform/customer-support/mcp)

---

## TROUBLESHOOTING

Live diagnostics: **Settings → Support → Health & audit → Setup Health**.
→ [Troubleshooting guide](/platform/customer-support/integration-guides/troubleshooting)
