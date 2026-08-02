---
slug: /changelog
sidebar_position: 99
title: Changelog
---

# Changelog

All notable changes to the Lira AI platform are documented here. Dates use **YYYY-MM-DD** format.

:::note Platform focus
Lira is now exclusively a **customer support platform**. The Meetings, Interviews, and Sales Coaching products that appear in earlier entries below have been retired — they were part of an earlier iteration of Lira and are not available on the current platform. Their historical entries are preserved for context.
:::

---

## 2026-07-29 — Escalation routing to Slack, Linear and webhooks

- **Escalation destinations are now configurable** — Settings → Support → Escalation gains a *Also send escalations to your tools* card: connect Slack over OAuth and pick a channel, connect Linear and pick a team, or POST to your own `https://` endpoint signed with HMAC-SHA256.
- **Fixed: the outbox never fired.** The Slack, Linear and webhook adapters have existed since Phase 6, but `outbox_providers`, `outbox_webhook_url` and `outbox_webhook_secret` were missing from the config write schema and had no UI, so no organization could ever enable delivery. All three are now settable and the fan-out works end to end for `ticket.created`, `ticket.escalated` and `ticket.resolved`.
- **New docs** — [Integrations](/platform/customer-support/integrations), [SLA policies](/platform/customer-support/sla), [Routing & assignment](/platform/customer-support/routing), [Roles & permissions](/platform/customer-support/roles), [Automation & rules](/platform/customer-support/automation), and a public [API reference](/platform/customer-support/api-reference). Each states plainly what is *not* supported as well as what is.

---

## 2026-07-29 — Self-serve signup restored

- **Anyone can sign up** — `/signup` is open again. Create an account, verify your email, and the onboarding flow stands up your organization on the Free plan, in sandbox. No invite code, no scoping call, no card.
- **Self-serve plan upgrades** — Pro and Scale are purchased from **Settings → Billing** through Paddle checkout. Enterprise remains a conversation with our team.
- **Concierge invites still work** — a `?invite=…` link pre-fills signup and attaches the new account to the inviting organization, but is no longer required. This supersedes the 2026-05-26 entry below.
- **Docs corrected** — Get an Account, Quickstart, Authentication, and Subscription & Billing no longer describe Lira as invite-only.

---

## 2026-07-20 — Paddle-backed subscription billing

- **Subscription & Billing docs refreshed** — plan, usage, sandbox/live, plan-change, downgrade, and limit behavior now match the current platform.
- **Paddle billing foundation documented** — Pro and Scale checkout, billing status, receipts, invoices, payment-method updates, customer portal access, and verified webhook entitlement rules are now covered.
- **Sandbox-to-live billing language tightened** — going live starts billing only for paid plans, and no organization becomes billable silently.
- **Overage wording corrected** — paid overage is described as available where overage continuation is enabled, instead of promising automatic continuation before that feature is fully live.

---

## 2026-05-26 — Concierge onboarding + per-employee invites

:::note Superseded
The invite-only changes in this entry were reversed on **2026-07-29** — signup is self-serve again. The per-employee invite system below is still current.
:::

- **Self-serve org creation removed** — new organizations are now provisioned by the Lira team after a scoping call. The in-app "New organization" entry opens a contact-team modal instead.
- **Per-employee invite system** — org admins generate one-time, expiring invite links scoped to a specific email + role. Invitees set a password (if new) and land directly in the org. Replaces the static LRA-XXXX shared-code join flow.
- **Resend-powered invite emails** — invite links are now emailed automatically when an admin generates them.
- **Public sign-up disabled** — the marketing site routes prospects through "Speak to an expert" instead of a self-serve form. `/login` is the only public auth path; `/signup?invite=…` works only with a valid concierge invite code.
- **Admin: provision org for existing user** — the Lira-team admin dashboard can now spin up a new organization under an existing user account.

---

## 2026-04-13 — Customer Support Module

- **Full customer support documentation** — 8 new pages covering every aspect of the support module: activation, portal, widget, inbox, actions, proactive outreach, analytics, and settings reference
- **Docs buttons in app** — Docs links added to the Support page header and activation wizard, linking directly to the relevant documentation sections
- **Support Portal** — Branded self-service page at `support.liraintelligence.com/<slug>` where customers can submit tickets, track status, and chat with Lira; can be embedded as an iframe
- **Portal save fix** — Portal enabled/disabled state, portal slug, and SLA hours now correctly persist after saving (backend Zod schema was silently stripping these fields)
- **Porter reorder in Settings** — Support Portal is now listed first in the Channels tab (above Chat Widget, Voice, and Email), with an inline Docs link
- **Voice card update** — Voice Support description updated to "Inbound phone support powered by Lira's voice"; removed outdated Twilio reference

---

## 2026-04-08 — Customer Support AI (Phase 1–5)

- **Inbox** — Unified conversation view across email, chat widget, voice, and portal channels; status filters (all / open / pending / escalated / resolved); full-text search by subject, customer name, email, and intent; sentiment indicators and CSAT scores per conversation
- **Support Portal** — Public self-service page at `support.liraintelligence.com/<slug>`; customers can submit tickets, track status, and chat; embeddable via iframe
- **Chat Widget** — Single `<script>` tag embed; floating chat button with Lira AI responses; customisable colour and greeting message; live animated preview during activation
- **Activation Wizard** — 5-step onboarding: email setup (with custom domain forwarding option), channel selection, integration connections, Knowledge Base seed, and live activation
- **Actions** — Approval queue for autonomous actions Lira proposes; approve or reject with full history log
- **Proactive Outreach** — Event-triggered automated messaging; configurable event type, message template with `{{variables}}`, channel (email/voice), cooldown, and daily cap; activity log
- **Analytics** — CSAT scores, autonomous vs escalated resolution breakdown, average first response time, monthly usage tracking, weekly report with top intents and KB improvement stats
- **Escalation engine** — Confidence threshold slider (0–100%); force-escalate intents list (always escalate regardless of confidence); email alerts; SLA target (hours)
- **Knowledge Base drafts** — Lira creates draft KB entries when it encounters questions it can't answer well; admins approve to improve future responses
- **Support Settings** — Four-tab settings panel (Widget / Channels / Behaviour / Escalation) accessible from the main Settings page

---

## 2026-03-29 — Documentation Site Launch

- Launched **docs.liraintelligence.com** — comprehensive documentation for the Lira AI platform
- 35+ pages covering API reference, customer support, knowledge base, and getting started guides
- Full-text search across all documentation
- Dark mode support

---

## 2026-03-28 — Email System & Custom Domains

- **Email API** — send AI-generated emails on behalf of your organization
- **Custom sending domains** — configure DKIM, SPF, and DMARC for branded email delivery
- **Inbound email processing** — AI reads and replies to customer email threads via SES → SNS pipeline
- Email thread management UI in the dashboard

---

## 2026-03-23 — Interview Platform v2

- **AI Draft** — generate complete interview configurations from a natural language prompt (`POST /interviews/draft`)
- **Question Generation** — AI generates tailored questions based on role, skills, and resume (`POST /interviews/generate-questions`)
- **Two-phase evaluation** — Phase 1 auto-evaluates after interview ends; Phase 2 scoring is on-demand
- **Decision recording** — `hire`, `no_hire`, `next_round`, `undecided` with notes
- **Multi-round support** — link related interviews via `GET /interviews/:id/related`
- Interview modes: `solo`, `copilot`, `shadow`

---

## 2026-03-22 — New Brand Identity

- Updated logo to the trefoil mark across all surfaces
- New `lira_black.png` and `lira_white.png` logos for light/dark modes
- Refreshed favicon site-wide

---

## 2026-03-15 — Task Execution Engine

- **AI task review** — Lira autonomously validates and refines extracted tasks (`POST /tasks/:id/lira-review`)
- **Task execution** — execute approved tasks through the Lira runtime or email (`POST /tasks/:id/execute`)
- **Execution results** — track what was created and where (`GET /tasks/:id/result`)
- Email notifications on task events

---

## 2026-03-10 — Knowledge Base & Semantic Search

- **Document upload** — PDF, DOCX, TXT with automatic parsing and chunking
- **Web crawl** — crawl a website with configurable depth and page limits
- **Semantic search** — natural language queries matched against document chunks so answers stay grounded in approved knowledge
- **Document reprocessing** — re-index existing documents after embedding model upgrades
- Knowledge base context automatically injected into Nova Sonic system prompts

---

## 2026-03-02 — Organization Context System

- **Organization profiles** — company name, industry, products, terminology, and custom AI instructions
- **Culture settings** — define company values and communication style
- AI automatically uses org context for more relevant meeting participation
- **Dynamic context refresh** — optionally refresh org context mid-session

---

## 2026-02-20 — Wake Word System

- **3-layer detection** — exact match, Levenshtein fuzzy match, Soundex phonetic match
- Configurable AI name (default: "Lira")
- Cooldown system: 45s general, 30s during meetings
- Confidence levels: `high`, `medium`, `low`
- Wake word can be disabled per deployment via `wake_word_enabled` setting

---

## 2026-02-15 — Speaker Diarization

- **Deepgram Nova-2** integration for real-time speaker identification
- Speaker-attributed transcripts — each line tagged with the speaker's name
- Participant tracking throughout the meeting
- Diarization data used for per-person meeting summaries

---

## 2026-02-10 — Core Platform Launch

- **Bot deployment** — launch Lira into Google Meet via headless Chromium + Playwright
- **Audio pipeline** — bidirectional PCM streaming via WebRTC interception and `getUserMedia` override
- **Amazon Nova Sonic** — speech-to-speech AI (STT + LLM + TTS in a single stream)
- **Echo gate** — prevents Lira from hearing her own audio output
- **4 personality modes** — supportive, challenger, facilitator, analyst
- **Meeting summaries** — short (4–6 sentences) and long (detailed breakdown) modes
- **Google Drive source** — Drive file access for knowledge documents
- **WebSocket API** — real-time transcript and audio streaming to the frontend
- **Usage tracking** — beta limits per organization
- **JWT authentication** — Google Sign-In + email/password, 7-day token expiry
