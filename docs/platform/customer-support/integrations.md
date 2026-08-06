---
slug: /platform/customer-support/integrations
sidebar_position: 12
title: Integrations
description: Every system Lira connects to today — knowledge sources, channels, escalation destinations, and the open paths for everything else.
---

# Integrations

This page lists **what Lira connects to today**. If a system isn't on this page, it isn't supported yet — we'd rather you find that out here than three weeks into an evaluation.

Lira's design bias is deliberate: instead of shipping fifty shallow connectors, we ship a small set of real ones plus two open paths — [MCP](/platform/customer-support/mcp) and the [developer API](/platform/customer-support/developer-api) — that let you connect anything else under your own auth.

## Knowledge sources

Where Lira learns your product from. See [Knowledge Base](/knowledge-base/overview).

| Source | What it does |
| --- | --- |
| **Website crawl** | Point Lira at a URL and it crawls, chunks, and embeds the pages. Re-crawlable. |
| **Document upload** | DOCX, TXT, Markdown, CSV, XLSX. Parsed, chunked, and embedded. PDF is not supported. |
| **Google Drive** | OAuth connection with a folder/file picker. Lira reads only the files you select. |

## Channels

Where customers reach you. All share one agent, one knowledge base, and one inbox.

| Channel | Notes |
| --- | --- |
| **Chat widget** | One `<script>` tag. See [install guides](/platform/customer-support/integration-guides). |
| **Web SDK / full-page embed** | Support surface mounted on your own route. |
| **Hosted portal** | Lira-hosted branded page, optional custom domain. |
| **Email** | A dedicated support address per organization, or forward from your own domain. Inbound parsing and threaded outbound replies. |
| **Voice** | Real-time voice conversations with the AI agent. |
| **WhatsApp Business API** | Your own WABA and number. Available on Scale. |
| **Native mobile** | iOS/Android support session over the REST and realtime APIs, plus push. See [Native mobile](/platform/customer-support/mobile-frontend). |

## Escalation destinations

When a ticket is created, escalated, or resolved, Lira notifies your team. Email always fires. These are additional destinations, configured in **Settings → Support → Escalation**.

| Destination | What happens |
| --- | --- |
| **Slack** | Posts the ticket to a channel you choose. Connected over OAuth. |
| **Linear** | Opens a Linear issue in the team you choose, so engineering picks it up in their own backlog. Connected over OAuth. |
| **Signed webhook** | POSTs the ticket event to an `https://` endpoint you own, signed with HMAC-SHA256 in the `X-Lira-Signature` header, so you can verify it came from us. |

Every delivery is queued, retried with backoff, and logged. **Support → Outbox** shows each attempt, its status, and the resulting external link — so a failed Slack post is visible rather than silent.

Deliveries are deduplicated on `orgId:ticketId:provider:eventType`, so a re-fired event or a retry will not double-post.

### Events that fan out

- `ticket.created`
- `ticket.escalated`
- `ticket.resolved`

## Connect anything else

We don't have a connector for your CRM, your billing system, or your internal admin tool. You have two ways to connect them yourself, and both keep the credentials on your side:

- **[MCP server](/platform/customer-support/mcp)** — if you run a Model Context Protocol server, Lira imports your tools and calls them under your own auth, with OAuth 2.1, per-tool approval, risk tiers, rate limits, and drift detection. This is the recommended path.
- **[Developer API and CLI](/platform/customer-support/developer-api)** — scoped API keys for driving Lira from your own backend.
- **[Agent runtime actions](/platform/customer-support/actions)** — register actions from your own app that the agent can run for a customer, with per-action approval policy and a full audit trail.

## Not supported today

Stated plainly so you can rule us out quickly if one of these is a hard requirement:

- **Slack, Microsoft Teams, Discord and Telegram as two-way customer channels.** Lira posts *to* Slack for escalations, but customers cannot hold a support conversation with the agent inside Slack. Lira is built for support that lives on your own website and inside your own product.
- **CRM connectors** — no native HubSpot, Salesforce, Attio or Pipedrive sync. Connect them through MCP or the API.
- **Jira, GitHub Issues, Asana or Shortcut** as escalation destinations. Linear and signed webhooks are the supported paths; a webhook can drive any of these.
- **Data warehouse connectors** — no Snowflake, BigQuery, Redshift or S3.
- **Call-recording ingestion** — no Gong, Fathom, Grain or Google Meet.
- **Notion, Confluence or Zendesk import** as knowledge sources. Crawl the published site, or upload the exports.
