---
slug: /architecture/organization-context
sidebar_position: 2
title: Organization Context System
description: How Lira gathers and injects per-org context into every customer conversation — profile, knowledge base, live product state, identified visitor data.
---

# Organization Context System

The Organization Context System is what makes Lira give grounded, in-your-voice answers instead of generic AI fluff. On every visitor turn, Lira assembles a fresh context bundle from four sources, injects it into the LLM, and only then composes the reply.

## What goes into a turn

### 1. Organization profile

Set once in **Settings → Organization** and read on every turn:

- **Company name + industry** — anchors who Lira is speaking on behalf of
- **Description** — a one-paragraph summary of what your product does
- **Custom instructions** — free-form rules your team writes ("Always recommend Pro for teams >10", "Never quote refunds in chat", etc.)
- **Logo + website** — used for chat header personalization

The profile is injected into the system prompt at the start of every conversation.

### 2. Knowledge base retrieval (RAG)

On every visitor message, Lira:

1. Encodes the message as a 1536-dimension embedding
2. Runs cosine similarity against your org's Qdrant collection
3. Pulls the top-K most relevant chunks (from documents, connected sources, and web crawls)
4. Injects them into the LLM context with citations

```
Visitor message → embedding → Qdrant cosine search
                                              │
                       Top-K relevant chunks ─┘
                                              │
                               LLM context window
```

### 3. Live product context

Identified visitors' SDK pushes a "live context" snapshot to the backend on widget open and on relevant in-app events:

- What page / route / tab they're on
- Their account state (plan, billing status, signed-in user info)
- Recent in-product events ("they just hit a 4xx on /upgrade")
- Anything else you choose to surface via `window.Lira.setContext(...)`

See [Widget identified visitors](/platform/customer-support/widget) for the signing model.

### 4. Conversation history

The previous ~10 messages in the current conversation are appended, so Lira can resolve "what about the second one?", "do the same for this account", and similar references without losing the thread.

## The assembly order

```
System prompt
├── Lira role + tone + non-negotiable rules
├── Organization profile (name, industry, description, custom instructions)
├── Tool definitions (KB search, actions, ticket creation, etc.)
└── Live product context (if signed visitor)

Conversation history (recent N messages)

Per-turn context
├── Retrieved KB chunks (top-K from vector search)
├── Visitor identity blob (signed; only present for identified visitors)
└── Current message
```

This bundle becomes the LLM's input. The LLM either replies with text, calls a tool, or asks for clarification.

## Data model

The DynamoDB single-table layout (selected items relevant to context):

```
PK: ORG#<org_id>     SK: PROFILE                  — organization profile + custom instructions
PK: ORG#<org_id>     SK: MEMBER#<user_id>         — membership
PK: ORG#<org_id>     SK: KB#<page_id>             — KB metadata (full content lives in Qdrant)
PK: ORG#<org_id>     SK: DOC#<doc_id>             — uploaded document record
PK: ORG#<org_id>     SK: CONV#<conversation_id>   — conversation header
PK: ORG#<org_id>     SK: MSG#<conversation_id>#<idx> — individual turn
PK: USER#<user_id>   SK: ORG#<org_id>             — reverse-lookup for "list my orgs"
```

See [Architecture overview](/architecture/overview) for the full backend component map.

## Security & data isolation

- Every KB chunk in Qdrant has the `org_id` baked into its payload; queries are filtered server-side
- Every DynamoDB key starts with the `org_id`; no query escapes a single org
- S3 keys are org-prefixed (`orgs/<org_id>/documents/<doc_id>/...`)
- Cross-organization access requires Lira-team admin credentials (`SUPER_ADMIN` role), never visitor-level auth

## What Lira does *not* include in context

- **Other organizations' data** — guaranteed by org-scoped keys at every layer
- **Visitor PII from email alone** — email is not identity proof; signed identity is required to attach account context
- **Internal credentials** — connected-integration tokens are KMS-encrypted in DynamoDB; they're used server-side for tool calls, never injected as text into the LLM context
