---
sidebar_position: 1
slug: /platform/customer-support/integration-guides
title: Integration guides
description: Step-by-step install instructions for every supported framework.
---

# Integration guides

Pick the guide that matches your stack. Each page walks you through:

- The exact `npm install` (or `<script>` tag) for that framework
- Where to put the support route in your app
- How to sign visitor emails server-side so logged-in users are identified
- Common pitfalls + how to fix them

| Stack | Time | Guide |
|-------|------|-------|
| **Next.js** (App Router) | ~5 min | [→ Next.js guide](/platform/customer-support/integration-guides/nextjs) |
| **Vite + React** | ~5 min | [→ Vite guide](/platform/customer-support/integration-guides/vite) |
| **Remix** | ~10 min | [→ Remix guide](/platform/customer-support/integration-guides/remix) |
| **Ruby on Rails** | ~10 min | [→ Rails guide](/platform/customer-support/integration-guides/rails) |
| **Django** | ~10 min | [→ Django guide](/platform/customer-support/integration-guides/django) |
| **Express + any frontend** | ~10 min | [→ Express guide](/platform/customer-support/integration-guides/express) |
| **Plain HTML (no build step)** | ~2 min | [→ HTML guide](/platform/customer-support/integration-guides/html) |

Stack not listed? Use the [generic Web SDK guide](/platform/customer-support/web-sdk) — the SDK is framework-agnostic.

:::tip Using Claude Code or another AI editor?
Skip the manual steps — install our [Claude Code skill](/platform/customer-support/integration-guides/claude-code-skill) and run `/lira-install` in your editor. The skill detects your framework, asks for your org id, and scaffolds the integration in one command.
:::

:::info Something not working?
See the [Troubleshooting guide](/platform/customer-support/integration-guides/troubleshooting) — symptom-to-fix map for every common integration problem. Or open **Lira dashboard → Settings → Support → Health & audit** to run live diagnostics on your integration.
:::

---

## What you need before starting

Three things — get them from your **Lira dashboard**:

1. **Your `org_id`** — Settings → Organization → Org ID
2. **Your widget secret** — Settings → Support → Get connected → Widget secret (used to sign logged-in visitor emails server-side)
3. **Activated support module** — if you haven't activated yet, the Lira widget will guide you through it first

Each per-framework guide assumes you have these in hand.
