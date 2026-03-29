---
slug: /integrations/overview
sidebar_position: 1
title: Overview
---

# Integrations

Lira connects to 9 third-party tools with full OAuth flows, member mapping, and bidirectional data sync.

## Available Integrations

| Provider | Auth Method | Capabilities |
|:---|:---|:---|
| [**Slack**](/integrations/slack) | OAuth V2 | Post messages, list channels, member mapping, webhooks |
| [**Microsoft Teams**](/integrations/microsoft-teams) | Azure AD OAuth | Post messages, list channels, member mapping |
| [**Google Calendar**](/integrations/google-calendar) | OAuth 2.0 | Create/update events, list calendars, set defaults |
| [**Google Drive**](/integrations/google-drive) | OAuth 2.0 | Create folders, list/search/read files, Sheets & Docs |
| [**Linear**](/integrations/linear) | OAuth 2.0 | Issue sync, team/member mapping |
| [**GitHub**](/integrations/github) | OAuth App | Repos, issues, PRs, code search |
| [**HubSpot**](/integrations/hubspot) | OAuth 2.0 | Contacts, companies, deals, pipelines, notes |
| [**Salesforce**](/integrations/salesforce) | OAuth 2.0 + PKCE | Accounts, contacts, opportunities, leads, SOQL |
| [**Greenhouse**](/integrations/greenhouse) | API Key | Candidates, jobs, applications, scorecards |

## Integration Architecture

All integrations follow a consistent pattern:

### 1. OAuth / API Key Setup

The user initiates the connection from **Organization Settings → Integrations**. For OAuth providers, this opens the provider's consent screen. For API key providers (Greenhouse), the user enters their key.

### 2. Token Storage

OAuth tokens (access + refresh) are encrypted and stored in DynamoDB, scoped to the organization. Tokens are automatically refreshed when they expire.

### 3. Member Mapping

After connecting, Lira maps your organization members to their accounts in the external tool. This enables:

- Task assignment (e.g., assign a Linear issue to a specific team member)
- Notification routing (e.g., DM the right person in Slack)
- Attribution (e.g., log a HubSpot note under the correct user)

### 4. Bidirectional Sync

Data flows both ways:

- **Outbound** — Lira pushes meeting summaries to Slack, tasks to Linear, events to Google Calendar
- **Inbound** — Webhooks from Linear, Slack, and Teams notify Lira of external changes

## External Webhooks

Lira receives real-time events from:

| Provider | Events |
|:---|:---|
| Linear | Issue created, updated, deleted |
| Slack | Message posted, channel events |
| Teams | Message posted, channel events |

## Verification & Approval

Each integration connection has a verification status:

- **Pending** — OAuth flow started, awaiting completion
- **Connected** — Active and working
- **Error** — Token expired or revoked, needs re-authentication
