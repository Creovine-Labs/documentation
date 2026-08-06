---
sidebar_position: 6
title: Navigating the App
description: Where everything lives in the Lira dashboard — the exact sidebar sections, page paths, Settings tabs, and the click-path for every common task.
---

# Navigating the App

This is the authoritative map of the Lira dashboard (`app.liraintelligence.com`). It lists the real sidebar structure, the exact page each item opens, and the precise click-path for common tasks. If you're ever unsure "where is that button," find it here.

---

## App layout

The Lira app has a **left sidebar** on every page. Collapse or expand it with the toggle next to the logo. From top to bottom:

| Section | Items | Notes |
|---|---|---|
| **Top** | Home | The dashboard. |
| **Work** | Inbox · Tickets · Customers | The pages you touch daily. |
| **Grow** | Knowledge Base · Proactive · Analytics | The pages you tune weekly. |
| **Admin** | Members · Email · Queues · SLA policies · Tasks | Set-up-once surfaces. |
| **Bottom** | Settings · Docs | Settings opens in-app; Docs opens this site. |

**Work**, **Grow**, and **Admin** are collapsible groups — click the group name to expand it and reveal its items.

Before Customer Support is activated, the Work / Grow / Admin groups are replaced by a single **Customer Support** entry that opens the activation wizard. Once you activate, the full structure appears.

At the **top of the sidebar** is your current **organization** (click it to switch orgs). A **header bar** across the top shows the org, a notifications bell, and your profile menu. While the workspace is in sandbox, the header also shows a **SANDBOX** pill — see [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

On mobile the sidebar collapses into a hamburger menu in the top-left.

---

## Exact page paths

Every sidebar destination, with the URL it opens:

| Sidebar item | Group | Path |
|---|---|---|
| Home | — | `/dashboard` |
| Inbox | Work | `/support/inbox` |
| Tickets | Work | `/support/tickets` |
| Customers | Work | `/support/customers` |
| Knowledge Base | Grow | `/org/knowledge` |
| Proactive | Grow | `/support/proactive` |
| Analytics | Grow | `/support/analytics` |
| Members | Admin | `/org/members` |
| Email | Admin | `/org/email` |
| Queues | Admin | `/support/queues` |
| SLA policies | Admin | `/support/sla-policies` |
| Tasks | Admin | `/org/tasks` |
| Settings | — | `/settings` |

---

## Home — Dashboard

**Path:** Sidebar → **Home** (`/dashboard`)

The dashboard greets you with recent activity — open conversations, escalations needing a human, AI-resolved count, average response time — plus a **Launch checklist** (activate support, install the widget, teach Lira about your product, configure support email, invite teammates) and **Quick actions** shortcuts.

---

## Work

### Inbox

**Path:** Sidebar → Work → **Inbox** (`/support/inbox`)

The unified conversation queue across chat, email, voice, and the portal. Down the left it filters by:

- **Assignment** — My inbox, Unassigned.
- **Status** — All, Open, Pending, Escalated, Resolved.
- **Teams** — your defined teams (e.g. Support, Billing, Engineering), plus **Manage teams**.
- **Channels** — All channels, Chat, Email, Voice, Portal.

**Compose** starts a new conversation; **CSV** exports the current list; the search box filters by text. Click any conversation to read and reply on the right.

See: [Inbox guide](/platform/customer-support/inbox).

### Tickets

**Path:** Sidebar → Work → **Tickets** (`/support/tickets`)

The operator's daily queue for async work — escalations, tickets Lira opened, and tickets you create. Click a ticket to read the thread, reply, change status, or reassign.

### Customers

**Path:** Sidebar → Work → **Customers** (`/support/customers`)

Every identified visitor that has chatted with Lira. Click a customer for their conversation history, open tickets, and identity context the SDK sent.

---

## Grow

### Knowledge Base

**Path:** Sidebar → Grow → **Knowledge Base** (`/org/knowledge`)

What Lira reads to answer questions. Four tabs:

- **Documents** — drag-and-drop files, or **Write a note directly**. Supported: **DOCX, TXT, MD, CSV, XLSX**, up to **25 MB** per file.
- **Connected Sources** — link Google Drive; Lira imports approved files.
- **Web Sources** — paste a URL; Lira crawls and indexes the site.
- **Query** — ask questions against the KB to verify what Lira will see.

Full reference: [Knowledge Base](/knowledge-base/overview).

### Proactive

**Path:** Sidebar → Grow → **Proactive** (`/support/proactive`)

Set up automated outreach that fires when something happens in your product (trial expiring, payment declined, feature launch, renewal). It's a short wizard: **How it works → Connect your product → Create a rule**.

See: [Proactive guide](/platform/customer-support/proactive).

### Analytics

**Path:** Sidebar → Grow → **Analytics** (`/support/analytics`)

Resolution and deflection rates, response time, CSAT, top intents, and per-action performance.

---

## Admin

Set-up-once surfaces. The group is collapsed until you click **Admin**.

### Members

**Path:** Sidebar → Admin → **Members** (`/org/members`)

Manage who has access. This is where you **add a teammate** — not under Settings.

- **Invite a teammate** — at the top of the page, enter the person's **email**, pick a **Role** (Member or Admin), and click **Generate invite link**. It's a one-time, expiring link tied to that email; the invitee sets a password and lands directly in your org.
- **Team Members** — the list below shows everyone, their role, and join date.
- **Role / remove** — admins manage non-owner members from their row.
- **Leave** — non-owners can leave from the bottom of the page. The owner must transfer ownership first.

Roles: **Owner**, **Admin**, **Member** — see [Roles & permissions](/platform/customer-support/roles).

### Email

**Path:** Sidebar → Admin → **Email** (`/org/email`)

Configure how Lira sends and receives email — sender identity, custom domain, notifications, auto-reply — plus an inbox of email threads Lira has handled. Full reference: [Email settings](/platform/email).

### Queues and SLA policies

**Path:** Sidebar → Admin → **Queues** (`/support/queues`) / **SLA policies** (`/support/sla-policies`)

Route tickets into queues and define response-time policies.

### Tasks

**Path:** Sidebar → Admin → **Tasks** (`/org/tasks`)

Internal task tracker. Tasks created from tickets or directly in your org land here.

---

## Settings

**Path:** Sidebar → **Settings** (`/settings`)

Settings has **five top tabs** down the left: **Account**, **Organization**, **Support**, **Subscription**, **Billing**.

### Account tab

Your personal account (not the org):

- **Profile** — display name, profile picture.
- **Security** — change email, change password.
- **Organizations** — every org you belong to, with a **Leave** button for non-owner orgs.
- **Danger Zone** — delete your account.

### Organization tab

Your org's profile (read by Lira on every conversation). Four sub-tabs:

- **General** — Organization ID, name, company name, logo, industry, company size, website, description; plus the org **Danger Zone** (delete organization).
- **Culture** — tone and cultural context for replies.
- **Products & Services** — what you sell, so Lira can speak to it.
- **Instructions** — custom standing instructions for the agent.

### Support tab

The Customer Support module. At the top, an **Environment** card shows **SANDBOX** or **LIVE** with a **Sandbox / Production** toggle (the go-live switch). Below it, **seven** sub-tabs:

- **Get connected** — install Lira: **Web widget** / **Full page** / **JavaScript** / **npm** snippets and **Appearance & greeting** (brand color, greeting message). Credentials live under **API keys**.
- **Channels** — turn on **Web chat**, **Voice**, and **Email** (with your `support-…@liraintelligence.com` address and optional forwarding); set up **WhatsApp Business**; set up the **Lira-hosted page**.
- **Behavior** — **Auto-reply** on/off, **Confidence to answer** slider (Cautious / Balanced / Strict), this-month usage, and Advanced: **Always escalate certain topics** and **Compliance guardrails** (fintech).
- **Actions** — let Lira take real actions in your systems: connect an **MCP server** (recommended), a **REST adapter** with **Agent tool packs** (e.g. the Banking / Fintech pack), or declare **manually registered actions** (SDK). Money-moving actions auto-require customer step-up.
- **API keys** — every credential in one place: **publishable keys** (`lira_pk_test_` / `lira_pk_live_`, safe in your HTML), **secret keys** (`lira_sk_test_` / `lira_sk_live_`, server-side, used as `LIRA_API_KEY`), and the **signing secret** for logged-in customers — plus a CLI / API quickstart for MCP and native mobile sessions.
- **Escalation** — where escalations go: alert email, **response-time target**, automatic-handoff triggers, and extra destinations (**Slack**, **Linear**, **Webhook**).
- **Health & audit** — **Setup Health** on-demand diagnostics (widget, identity, notifications) and the **[Agent audit log](/platform/customer-support/audit)** — every action the agent ran, with policy decision, redacted input/output, and estimated cost.

Full reference: [Settings Reference](/platform/customer-support/settings).

### Subscription tab

Your plan and entitlements, live monthly usage, launch status (sandbox / live), plan-change requests, and sandbox-extension requests. See [Subscription & Billing](/getting-started/plans-and-billing).

### Billing tab

Invoices, payment methods, and (for Enterprise) license management — **Invoices**, **Payment Methods**, **Enterprise License**, **License Key**.

---

## Activating Customer Support

**Path:** Customer Support entry (before activation) → **Activate** — a **4-step wizard** (starting with **Email Setup**). Full guide: [Activation](/platform/customer-support/activation).

---

## Switching organizations

If you belong to multiple orgs, the **organization name at the top of the sidebar** is a dropdown. Click it and pick the other org to switch.

---

## Common tasks — quick reference

| Task | Where |
|---|---|
| Add / invite a teammate | **Admin → Members → Invite a teammate** (email + role → Generate invite link) |
| Remove a teammate | Admin → Members → member's row |
| Change a teammate's role | Admin → Members → member's row |
| Leave an organization | Admin → Members → Leave (non-owner) — or Settings → Account → Organizations |
| Switch organization | Click the org name at the top of the sidebar |
| Activate customer support | Customer Support → Activate (4-step wizard) |
| Get the widget snippet | Settings → Support → Get connected → Web widget |
| Get the signing secret (logged-in customers) | Settings → Support → API keys → Signing secret |
| Get a publishable or secret API key | Settings → Support → API keys |
| Switch between sandbox and production | Topbar → **SANDBOX / PRODUCTION** |
| Move to production (real sends + billing) | Topbar → **Production**, or Settings → Support → Environment |
| Change widget color or greeting | Settings → Support → Get connected → Appearance & greeting |
| Turn a channel on/off (chat, voice, email) | Settings → Support → Channels |
| Set up a custom support email | Settings → Support → Channels → Email |
| Connect WhatsApp | Settings → Support → Channels → WhatsApp Business |
| Set up the hosted support page | Settings → Support → Channels → Lira-hosted page |
| Turn auto-reply on/off | Settings → Support → Behavior → Auto-reply |
| Adjust the confidence threshold | Settings → Support → Behavior → Confidence to answer |
| Always escalate a topic | Settings → Support → Behavior → Always escalate certain topics |
| Connect an MCP server / tools | Settings → Support → Actions |
| Enable the Banking / Fintech actions | Settings → Support → Actions → Agent tool packs |
| Create a developer API key | Settings → Support → API keys → New key |
| Set the escalation email / SLA target | Settings → Support → Escalation |
| Send escalations to Slack / Linear / a webhook | Settings → Support → Escalation |
| Run setup diagnostics | Settings → Support → Health & audit → Setup Health |
| Review every action the agent ran | Settings → Support → Health & audit → Agent audit log |
| Upload company docs | Grow → Knowledge Base → Documents |
| Crawl your help center | Grow → Knowledge Base → Web Sources |
| Connect Google Drive | Grow → Knowledge Base → Connected Sources |
| Set up proactive outreach | Grow → Proactive |
| Review what Lira said | Work → Inbox |
| Reply to a ticket | Work → Tickets → click ticket |
| See deflection / CSAT | Grow → Analytics |
| Check plan, usage, and launch status | Settings → Subscription |
| See invoices / payment methods | Settings → Billing |
| Go live / return to sandbox | Settings → Support → Environment card |
| Edit the org profile Lira reads | Settings → Organization |
| Change your display name | Settings → Account → Profile |
| Change your password | Settings → Account → Security |
