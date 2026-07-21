---
slug: /integrations/overview
sidebar_position: 1
title: Overview
description: The third-party tools Lira connects to — Slack, Teams, Drive, Linear, GitHub, HubSpot, Salesforce — and how the integration plumbing works.
---

# Integrations

Lira connects to seven third-party tools with full OAuth flows, member mapping, and bidirectional sync. Most teams enable Slack + their KB source (Drive or GitHub) on day one and add the rest as workflows demand them.

## Available integrations

| Provider | Auth | What Lira uses it for |
|---|---|---|
| [**Slack**](/integrations/slack) | OAuth V2 | Ticket notifications, escalation alerts, member mapping, two-way DM relay |
| [**Microsoft Teams**](/integrations/microsoft-teams) | Azure AD OAuth | Ticket notifications, channel posts, member mapping |
| [**Google Drive**](/integrations/google-drive) | OAuth 2.0 | KB sync — Lira reads from a chosen Drive folder; new docs auto-index |
| [**Linear**](/integrations/linear) | OAuth 2.0 | Push tickets / tasks to Linear; member mapping; bidirectional issue sync |
| [**GitHub**](/integrations/github) | OAuth App | KB sync from repo Markdown / docs; optional issue creation |
| [**HubSpot**](/integrations/hubspot) | OAuth 2.0 | Pull customer context into Lira (deals, contacts, companies); log activities back |
| [**Salesforce**](/integrations/salesforce) | OAuth 2.0 + PKCE | Pull customer context (accounts, contacts, opportunities); SOQL queries |

## Connect your own systems (actions)

The tools above are for **context and notifications**. To let Lira take **real actions** in your own product — under your own auth, governed by Lira's policy engine — connect your own systems:

| Path | For |
|---|---|
| [**MCP server**](/integrations/mcp) | Expose your own tools over the Model Context Protocol. Recommended for a mature product. |
| [**Developer API keys & CLI**](/integrations/developer-api) | Automate all of the above from your backend or CI, and mint native mobile support sessions. |

## How they work — the four-step pattern

Every integration follows the same shape.

### 1. OAuth setup

Start the flow from **Admin → Integrations** in the sidebar and click **Connect** on the provider you want. For OAuth providers, this opens the provider's consent screen. For API-key providers, the user pastes the key.

### 2. Encrypted token storage

OAuth tokens (access + refresh) are encrypted, stored securely, and scoped to your organization. Tokens are refreshed automatically when they expire.

### 3. Member mapping (optional)

Where it matters, Lira maps your org members to their accounts in the external tool. That enables:

- **Routing** — escalations land with the right person in Slack
- **Assignment** — tickets pushed to Linear get the right owner
- **Attribution** — activities logged in HubSpot / Salesforce show the correct user

### 4. Bidirectional sync

Data flows both ways:

- **Outbound** — Lira pushes ticket events to Slack, tickets to Linear, activities to HubSpot/Salesforce.
- **Inbound** — Webhooks from Slack, Teams, and Linear notify Lira of external changes (an operator replies in Slack → reply lands in the Lira ticket thread).

## External webhooks

Lira receives real-time events from:

| Provider | Events |
|---|---|
| Slack | Message posted, channel join/leave, app mentions |
| Teams | Message posted, channel events |
| Linear | Issue created / updated / deleted |

## Connection states

Each integration has a status visible in **Admin → Integrations**:

- **Pending** — OAuth flow started, awaiting completion
- **Connected** — Active and refreshing tokens automatically
- **Error** — Token revoked / expired beyond refresh; click **Reconnect**

## Per-provider setup

Click any provider in the table above for step-by-step setup, scope details, and what data Lira will and won't pull.
