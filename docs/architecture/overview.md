---
slug: /architecture/overview
sidebar_position: 1
title: Architecture Overview
description: How the Lira customer support platform is built — frontend, backend, AI models, storage, and the data flow on every conversation.
---

# Architecture Overview

Lira is a full-stack customer support platform. The dashboard runs on Vercel, the backend runs on AWS EC2 with a Fastify server, and the AI runs on updated frontier language models (Claude + GPT families, plus AWS Bedrock for specialised paths) with Qdrant for semantic search. This page is the high-level map; specific subsystems have their own deep-dive pages.

## Technology stack

### Frontend (the Lira dashboard + the embedded widget)

| Technology | Purpose |
|---|---|
| React 19 | Dashboard UI |
| TypeScript ~5.9 | Type safety |
| Vite 7 | Build tool / dev server |
| Tailwind CSS 3 | Utility-first styling |
| Zustand 5 | State management (per-feature stores) |
| Zod 4 | Runtime schema validation |
| React Router 7 | Client-side routing |
| Shadow-DOM web component | The embeddable chat widget (single IIFE bundle, ~117 kB minified) |

### Backend

| Technology | Purpose |
|---|---|
| Fastify 4.x | Node.js HTTP framework |
| TypeScript 5.x | Type safety |
| Zod | Request body validation on every route |
| @fastify/websocket | Live WebSocket transport for the widget |
| @fastify/jwt | JWT authentication (7-day expiry) |
| @fastify/swagger | OpenAPI documentation |
| Prisma | Postgres ORM (tenants, users, invites, audit) |
| Resend | Transactional email (invites, OTP, password reset, ticket notifications) |
| AWS KMS | OAuth token encryption for connected integrations |

### AI

| Technology | Purpose |
|---|---|
| Frontier LLMs (Claude + GPT families, plus AWS Bedrock for specialised paths) | Conversation, tool selection, summarization. Lira treats the model as a swappable backend — a single adapter routes each request to whichever provider is healthiest and cheapest for that org, with automatic fallback to a second provider on initial-connect failure so visitors never see a half-formed reply. |
| Semantic embedding model (1536 dim) | Encoding every KB chunk and visitor message for vector search. |
| Qdrant | Vector database — every KB chunk and document chunk lives here |

### Storage

| Technology | Purpose |
|---|---|
| Postgres | Tenants, users, invites, audit logs |
| DynamoDB | Lira organizations, memberships, conversations, tickets, KB metadata, employee invites — single-table design |
| Qdrant | 1536-dim embedding vectors |
| S3 | Uploaded documents, conversation attachments |
| CloudFront | Widget CDN (`widget.liraintelligence.com/v1/widget.js`) |

## High-level diagram

```
┌──────────────────────────────────────────────────────────┐
│                CUSTOMER'S SITE / APP                     │
│  ┌──────────────────────────────────────────────────┐    │
│  │ <script src=".../widget.js" data-org-id="...">   │    │
│  │   Shadow-DOM web component                       │    │
│  │   Sends visitor identity (signed) + live context │    │
│  └──────────────────────┬───────────────────────────┘    │
└─────────────────────────┼────────────────────────────────┘
                          │ WSS (chat) + REST (state)
                          ▼
┌──────────────────────────────────────────────────────────┐
│           EC2 BACKEND — api.creovine.com                 │
│                                                          │
│   Fastify server                                         │
│   ├── /lira/v1/support/*       widget + portal traffic   │
│   ├── /lira/v1/orgs/*          org/member/invite mgmt    │
│   ├── /lira/v1/auth/*          login + invite accept     │
│   ├── /v1/platform/admin/*     Lira-team admin           │
│   │                                                      │
│   ├── lira-support-agent       LLM loop, tool calling    │
│   ├── lira-vector-search       Qdrant semantic retrieval │
│   ├── lira-ticket              ticket lifecycle          │
│   ├── lira-employee-invite     per-employee invites      │
│   ├── lira-crawl               KB website crawl          │
│   └── integrations             Slack/Linear/Drive/GH/... │
└─────────────┬────────────────────────┬───────────────────┘
              │                        │
              ▼                        ▼
   ┌──────────────────┐      ┌──────────────────┐
   │   DynamoDB       │      │   Postgres        │
   │   + Qdrant + S3  │      │   (Prisma)        │
   └──────────────────┘      └──────────────────┘
```

## Data flow — visitor message to Lira reply

```
Visitor types a message in the widget
  → Widget posts to WebSocket /lira/v1/support/chat
  → Backend lira-support-agent receives, attaches:
    · org profile (name, industry, custom instructions)
    · live product context (page, account, plan, …)
    · visitor identity if signed
    · last ~10 messages in this conversation
  → Agent retrieves KB context:
    · embed the visitor's message
    · Qdrant similarity search → top N snippets
  → Agent calls the LLM through the provider-agnostic adapter with:
    · system prompt (per-org)
    · tools (KB search, action runners, ticket creation, …)
    · the gathered context above
    · The adapter picks an updated frontier model (Claude or GPT family)
      based on per-org configuration, with automatic fallback to a
      secondary provider if the primary fails before the first token.
  → LLM either:
    · replies with text (+ a lira_suggest_next_actions tool call)
    · calls an action tool (cancel sub, retry payment, …)
    · creates a ticket (lira_create_support_ticket)
  → Each event is streamed back to the widget:
    · message text (token-by-token where supported)
    · action chips
    · navigate / lira_action side-effects
    · ticket open/closed
  → The full turn is persisted to DynamoDB for chat history
```

## Component map (backend)

```
creovine-backend/src/
├── routes/
│   ├── lira-org.routes.ts           CRUD on orgs + members + employee invites
│   ├── lira-admin.routes.ts         Lira-team admin (provision orgs, etc.)
│   ├── lira-support-*.routes.ts     Widget + portal traffic
│   ├── lira-ticket.routes.ts        Ticket lifecycle
│   ├── lira-integration.routes.ts   Per-provider OAuth flows
│   └── platform-auth.routes.ts      Login, register, OTP, password reset
├── services/
│   ├── lira-support-agent.service   LLM loop, tool calling, prompt assembly
│   ├── lira-employee-invite.service Per-employee invite mgmt
│   ├── lira-org.service             Org CRUD + role checks
│   ├── lira-org-store.service       DynamoDB single-table persistence
│   ├── lira-embedding.service       OpenAI embeddings
│   ├── lira-vector-search.service   Qdrant semantic search
│   ├── lira-crawl.service           KB website crawl
│   ├── lira-document.service        Doc upload + chunking
│   ├── lira-ticket.service          Ticket state machine
│   ├── platform-email.service       Resend wrapper (invites, OTP, etc.)
│   └── integrations/                One file per provider
└── models/
    └── lira-org.models.ts           DynamoDB record shapes
```

## Component map (frontend)

```
lira-ai/src/
├── pages/
│   ├── HomePage.tsx                 Public sign-in
│   ├── AcceptInvitePage.tsx         Per-employee invite accept
│   ├── DashboardPage.tsx            Authenticated home
│   ├── OnboardingPage.tsx           Post-signup org setup
│   ├── OrgMembersPage.tsx           Members + invites mgmt
│   ├── support/*                    Tickets / customers / actions / proactive / analytics / inbox
│   └── admin/*                      Lira-team admin
├── components/
│   ├── shell/AppShell.tsx           Sidebar + header + routing
│   └── support-widget/widget.ts     The embeddable widget IIFE bundle
├── services/api/                    Typed API client
└── app/store/                       Zustand stores (auth, org, …)
```

See the deep-dive pages for specific subsystems:

- [Organization Context System](/architecture/organization-context)
