---
slug: /getting-started/concepts
sidebar_position: 5
title: Core Concepts
description: The handful of building blocks you'll see across the Lira dashboard and API — organizations, members, knowledge base, conversations, tickets, actions, and developer access.
---

# Core Concepts

A short tour of the building blocks you'll see across the Lira dashboard and API.

## Organization

An **Organization** is the top-level entity. Everything — knowledge base, team members, conversations, tickets, usage quotas, billing, and developer access — is scoped to an organization.

- You're provisioned with an organization when your account is set up (see [Get an Account](/getting-started/get-an-account)).
- An organization has a **profile** (name, industry, description, custom instructions, optional logo) that Lira reads on every conversation as context.
- Each org can have its own Lira-hosted support email address and/or forward from a custom domain.
- Usage and billing are tracked per organization.

## Members

A **Member** is a person on your team with access to an organization. Members have roles:

- **Owner** — Created the org. Can transfer ownership, change billing, manage everything.
- **Admin** — Manage knowledge base, members, and support settings.
- **Member** — Read-only access to the dashboard, can review conversations and tickets.

Add a teammate from the **Members** page → **Invite a teammate**. Each invite is a one-time, expiring link tied to the invitee's email.

## Knowledge Base

The **Knowledge Base** is the content Lira reads to answer questions in your visitors' words. Sources:

- **Web crawl** — Point Lira at a help center / docs / marketing site. It crawls, summarizes, and stores each page; re-runs on demand.
- **Documents** — Upload DOCX, Markdown, TXT, CSV, XLSX. (PDF is not supported — see [Documents](/knowledge-base/documents).)
- **Connected sources** — Connect Google Drive when your support docs live there; Lira imports approved files into the KB.

Content is prepared for semantic search so Lira can retrieve the most relevant snippets for each visitor question. That grounding is what keeps answers tied to your approved docs instead of generic AI guesses.

## Conversation

A **Conversation** is one chat session between a visitor and Lira. Each conversation stores:

- **Messages** — every visitor message + Lira reply, with timestamps and attribution
- **Visitor profile** — identified visitor's name/email/account info (or anonymous)
- **Live product context** — what page / tab / state the visitor was on while chatting
- **Tool calls** — any actions Lira ran on the visitor's behalf, with results

All conversations land in the **Inbox** for your team to audit and learn from.

## Ticket

A **Ticket** is an async piece of work that doesn't get resolved inside the live chat. Tickets are opened automatically by Lira when:

- The visitor explicitly asks to talk to a human
- The question is product-specific and Lira's confidence is low
- The visitor's request requires action your team hasn't given Lira permission to run

Tickets have a number (e.g. `LIRA-1234`), an owner, a state (open / pending / resolved), and a thread that continues by email and inside the Lira dashboard.

## Capability

A **Capability** is anything Lira's AI agent is allowed to invoke during a conversation. There are two kinds:

- **Resource** — a structured read (e.g. customer profile, current ticket, or account status).
- **Action** — a write (e.g. open a ticket, cancel a subscription, retry a payment).

Every capability carries two pieces of policy metadata:

- A **risk tier** (`read_public` → `read_private` → `safe_write` → `customer_confirm` → `step_up` → `admin_approve` → `human_only`).
- An **auth scope** (`public` → `verified_visitor` → `verified_customer`).

Capabilities come from built-in packs, MCP/API tools, the SDK, or admin-registered server-side definitions. You configure them (connect MCP servers, enable tool packs, register actions) in **Settings → Support → Actions**.

See [Customer Support → Agent Runtime](/platform/customer-support/agent-runtime) and [Capabilities](/platform/customer-support/capabilities).

## Action

An **Action** in the approval sense is the specific subset of capability calls the policy engine routed to a teammate for human sign-off. It is not the only way Lira runs an action — most action capabilities auto-execute (for verified customers at low risk) or confirm directly with the customer in chat. Only `admin_approve` runs pause for teammate review; they are visible in the agent audit log with status Pending approval.

See [Actions](/platform/customer-support/actions).

## Policy Engine

The **Policy Engine** is the central decision step that runs before every capability call. It takes the capability's risk tier and the visitor's runtime context (auth scope, identity verification, org) and returns one of: `execute`, `confirm` (ask the customer in chat), `human` (queue for a teammate), or `block`. Admin overrides may only tighten this decision, never loosen it.

The model never gets to declare which org it is acting for; the runtime injects `orgId` from the authenticated session. Cross-tenant calls are impossible by construction.

## Audit Trail

Every capability call — whether it ran, was confirmed, was blocked, or was queued for a teammate — becomes an **AgentActionRun** record. Records carry redacted input and output summaries (emails masked, secret-named fields stripped), the full policy decision, conversation/visitor/ticket IDs, and estimated model cost. Admins read them in **Settings → Support → Health & audit → Agent audit log**.

See [Customer Support → Audit](/platform/customer-support/audit).

## Proactive trigger

A **Proactive trigger** is a rule that fires a contextual Lira message when a visitor matches a condition — error page, abandoned onboarding step, idle on a high-intent screen, etc. You define the condition (using the live product context Lira receives from your SDK); Lira composes the message in your tone.

See [Customer Support → Proactive](/platform/customer-support/proactive).

## Developer access

Developer access is how your engineering team connects Lira to your product without using dashboard clicks for everything:

1. **API keys** let your backend automate support setup and mint native support sessions.
2. **CLI commands** let engineers configure Lira from a terminal.
3. **MCP tools** let Lira call approved, governed product actions under your own auth.

See [Developer API keys & CLI](/platform/customer-support/developer-api) and [MCP server](/platform/customer-support/mcp).
