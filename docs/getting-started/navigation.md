---
sidebar_position: 6
title: Navigating the App
description: Where everything lives in the Lira dashboard — sidebar sections, key pages, and common tasks.
---

# Navigating the App

This guide walks you through the Lira dashboard so you know where to find what you need.

---

## App layout

The Lira app has a **left sidebar** that's visible on every page. From top to bottom:

| Section | What's inside |
|---|---|
| **Top** | Home (Dashboard) |
| **Work** | The pages you touch daily — Inbox, Tickets, Customers |
| **Grow** | The pages you tune weekly — Knowledge Base, Proactive, Analytics |
| **Admin** | Set-up-once surfaces — Members, Email, Queues, SLA policies, Tasks |
| **Bottom** | Settings |

If Customer Support isn't activated yet, the Work / Grow / Admin groups are replaced by a single **Customer Support** entry pointing at the activation wizard. Once you activate, the full structure appears.

On mobile, the sidebar collapses into a hamburger menu in the top-left.

A header bar across the top shows your current organization (click to switch), notifications, and your profile menu. While your workspace is in sandbox, the header also shows a **SANDBOX** pill — click-through details are in [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

---

## Home — Dashboard

**Path:** Sidebar → **Home**

The dashboard greets you with the Lira onboarding widget (the same widget you'll embed on your site, but pointed at your setup state) and an at-a-glance view of recent activity — pending tickets, escalation alerts, and quick-access shortcuts.

---

## Work

The daily-driver pages.

### Inbox

**Path:** Sidebar → Work → **Inbox**

The read-only log of every AI conversation across chat, email, and the portal. Use it to QA what Lira told customers, investigate complaints, and learn from edge cases.

See: [Inbox guide](/platform/customer-support/inbox).

### Tickets

**Path:** Sidebar → Work → **Tickets**

The operator's daily queue. Every async piece of work — escalations, tickets opened by Lira, tickets you create manually — appears here. Click a ticket to read the thread, reply, change status, or reassign.

### Customers

**Path:** Sidebar → Work → **Customers**

Every identified visitor that has chatted with Lira. Filter by account, plan, or recent activity. Click a customer to see their conversation history, open tickets, and any identity context the SDK sent.

---

## Grow

The pages that improve answer quality and coverage over time.

### Knowledge Base

**Path:** Sidebar → Grow → **Knowledge Base**

The Knowledge Base is what Lira reads to answer visitor questions. It has four tabs:

- **Documents** — drag-and-drop PDFs, DOCX, MD, CSV (max 50 MB per file).
- **Connected Sources** — link Google Drive; Lira imports approved files directly.
- **Web Sources** — paste a URL; Lira crawls and indexes the site.
- **Query** — ask questions against the KB to verify what Lira will see.

Full reference: [Knowledge Base](/knowledge-base/overview).

### Proactive

**Path:** Sidebar → Grow → **Proactive**

Configure triggers that fire contextual Lira messages when a visitor matches a condition — error state, abandoned step, idle on a high-intent screen.

See: [Proactive guide](/platform/customer-support/proactive).

### Analytics

**Path:** Sidebar → Grow → **Analytics**

Resolution rate, deflection rate, response time, CSAT, top intents, and per-action performance.

---

## Admin

Things you set up once and rarely revisit. The group is collapsed by default.

### Members

**Path:** Sidebar → Admin → **Members**

Manage who has access.

- **Invite a teammate** — enter the email, pick a role (admin / member), Lira generates a one-time invite link.
- **Pending invites** — see active links, copy them again, or revoke.
- **Role change** — admins can promote/demote (owner-only for the owner role).
- **Remove** — admins can remove non-owner members.

To **leave** an org, scroll to the bottom of the Members page (non-owners only). Owners must transfer ownership first.

### Email

**Path:** Sidebar → Admin → **Email**

Configure how Lira sends and receives email — sender identity, custom domain, notifications, auto-reply.

- **Settings tab** — General, Sender Identity, Sending Domain, Notifications, Auto-Reply.
- **Inbox tab** — inbound email threads Lira has handled.

Full reference: [Email settings](/platform/email).

### Queues and SLA policies

**Path:** Sidebar → Admin → **Queues** / **SLA policies**

Route tickets into queues and define response-time policies.

### Tasks

**Path:** Sidebar → Admin → **Tasks**

Internal task tracker. Tasks created from tickets or directly inside your org land here.

---

## Settings

**Path:** Sidebar → **Settings** (bottom)

Tabs along the left of the Settings page:

### Account

- **Profile** — display name, profile picture.
- **Security** — change email, change password.
- **Organizations** — every org you belong to, with a Leave button for non-owners.
- **Danger Zone** — delete your account.

### Organization

Edit your organization's profile — name, logo, website, industry, custom instructions. This profile is read by Lira on every conversation.

### Support

Module-level support settings. An **Environment card** at the top shows whether the workspace is in **SANDBOX** or **LIVE** mode, with the go-live switch. Below it, five grouped tabs:

- **Get connected** — Web SDK snippets (full-page, JavaScript API, NPM, floating widget), widget colour and greeting, the widget secret for signed identity (show / copy / rotate), and mobile SDKs.
- **Channels** — toggle web chat, voice, and email; connect WhatsApp; configure the Lira-hosted page.
- **AI behavior** — auto-reply, confidence threshold, force-escalate intents, volume limits, and the [Capabilities](/platform/customer-support/capabilities) catalog.
- **Escalation** — escalation email and SLA target.
- **Health & audit** — integration diagnostics plus the [agent audit log](/platform/customer-support/audit): every action run the agent made, with policy decision, redacted input/output, and estimated cost.

Full reference: [Settings Reference](/platform/customer-support/settings).

### Subscription

Your current plan and entitlements, live monthly usage, launch status (sandbox or live), billing status, Paddle Checkout access, Paddle customer portal access, plan change requests, and sandbox extension requests. See [Subscription & Billing](/getting-started/plans-and-billing) and [Sandbox and going live](/platform/customer-support/sandbox-and-going-live).

---

## Switching organizations

If you belong to multiple orgs, the **org name at the top of the sidebar** is a dropdown. Click it, pick the other org, you switch.

---

## Common tasks — quick reference

| Task | Where |
|---|---|
| Invite a teammate | Admin → Members → Invite a teammate |
| Remove a teammate | Admin → Members → row → Remove |
| Activate customer support | Customer Support → Activate (one-time wizard) |
| Get the widget snippet | Settings → Support → Get connected |
| Get the widget secret | Settings → Support → Get connected → Widget secret |
| Set up a custom support email | Settings → Support → Channels → Email Support |
| Upload company docs | Grow → Knowledge Base → Documents |
| Crawl your help center | Grow → Knowledge Base → Web Sources |
| Connect Google Drive | Grow → Knowledge Base → Connected Sources |
| Review what Lira said today | Work → Inbox |
| Reply to a ticket | Work → Tickets → click ticket |
| Override a capability's risk or scope | Settings → Support → AI behavior → Capabilities → row → Edit |
| Review every action the agent ran | Settings → Support → Health & audit → Agent audit log |
| Disable a capability for your org | Settings → Support → AI behavior → Capabilities → row → toggle Enabled |
| See deflection / CSAT | Grow → Analytics |
| Check plan, usage, and billing | Settings → Subscription |
| Go live / return to sandbox | Settings → Support → Environment card |
| Request a plan change or sandbox extension | Settings → Subscription |
| Change your display name | Settings → Account → Profile |
| Change your password | Settings → Account → Security |
| Leave an organization | Admin → Members → Leave (non-owner) |
| Switch organization | Click org name at top of sidebar |
