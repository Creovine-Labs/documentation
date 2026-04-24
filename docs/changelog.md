---
slug: /changelog
sidebar_position: 99
title: Changelog
---

# Changelog

All notable changes to the Lira AI platform are documented here. Dates use **YYYY-MM-DD** format.

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
- **Actions** — Approval queue for autonomous actions Lira proposes (e.g. create Linear issue, update HubSpot contact); approve or reject with full history log
- **Proactive Outreach** — Event-triggered automated messaging; configurable event type, message template with `{{variables}}`, channel (email/voice), cooldown, and daily cap; activity log
- **Analytics** — CSAT scores, autonomous vs escalated resolution breakdown, average first response time, monthly usage tracking, weekly report with top intents and KB improvement stats
- **Escalation engine** — Confidence threshold slider (0–100%); force-escalate intents list (always escalate regardless of confidence); Slack channel alerts; Linear issue creation; SLA target (hours)
- **Knowledge Base drafts** — Lira creates draft KB entries when it encounters questions it can't answer well; admins approve to improve future responses
- **Support Settings** — Four-tab settings panel (Widget / Channels / Behaviour / Escalation) accessible from the main Settings page

---

## 2026-03-29 — Documentation Site Launch

- Launched **docs.liraintelligence.com** — comprehensive documentation for the Lira AI platform
- 35+ pages covering API reference, architecture deep-dives, integrations, and getting started guides
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

## 2026-03-18 — Salesforce & HubSpot Integrations

- **Salesforce** — OAuth (PKCE), contacts, accounts, opportunities, leads
- **HubSpot** — OAuth, contacts, companies, deals, pipelines, owners, notes
- Token auto-refresh for both providers
- CRM data available to AI during meetings for real-time sales context

---

## 2026-03-15 — Task Execution Engine

- **AI task review** — Lira autonomously validates and refines extracted tasks (`POST /tasks/:id/lira-review`)
- **Task execution** — execute tasks through connected integrations: create Linear issues, GitHub issues, send Slack DMs, or email (`POST /tasks/:id/execute`)
- **Execution results** — track what was created and where (`GET /tasks/:id/result`)
- Webhook notifications on task events (Slack incoming webhook, email)

---

## 2026-03-10 — Knowledge Base & Semantic Search

- **Document upload** — PDF, DOCX, TXT with automatic parsing and chunking
- **Web crawl** — crawl a website with configurable depth and page limits
- **Semantic search** — natural language queries matched against document chunks via OpenAI `text-embedding-3-small` + Qdrant (1536-dim vectors)
- **Document reprocessing** — re-index existing documents after embedding model upgrades
- Knowledge base context automatically injected into Nova Sonic system prompts

---

## 2026-03-05 — GitHub Integration

- OAuth connection with repository access
- List repos, branches, files; read file content
- Create and update files, create branches
- List and create issues and pull requests
- Code search across repositories
- AI can reference code context during meetings

---

## 2026-03-02 — Organization Context System

- **Organization profiles** — company name, industry, products, terminology, and custom AI instructions
- **Culture settings** — define company values and communication style
- AI automatically uses org context for more relevant meeting participation
- **Dynamic context refresh** — optionally refresh org context mid-session

---

## 2026-02-27 — Microsoft Teams Integration

- OAuth connection for Teams
- List teams, channels, and members
- Auto member mapping by email on OAuth callback
- Set default team and channel for task notifications
- Teams webhook support for inbound events

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
- **Linear & Slack integrations** — OAuth connection, member mapping, task sync
- **Google Calendar & Drive** — calendar events, Drive file access
- **WebSocket API** — real-time transcript and audio streaming to the frontend
- **Greenhouse integration** — API key auth, jobs, candidates, applications, scorecards
- **Usage tracking** — beta limits per organization
- **JWT authentication** — Google Sign-In + email/password, 7-day token expiry
