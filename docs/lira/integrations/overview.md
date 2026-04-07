---
sidebar_position: 1
title: Integrations Overview
description: Overview of Lira's 9 third-party integrations.
---

# Integrations Overview

Lira connects to **9 third-party platforms** — all with OAuth flows, member mapping, and bidirectional data sync. Integration credentials are **encrypted at rest** in DynamoDB using AES-256.

## Supported Integrations

| Provider | Auth Method | Key Features |
|:---|:---|:---|
| [Linear](/lira/integrations/linear) | OAuth2 | Issue sync, team listing, member mapping |
| [Slack](/lira/integrations/slack) | OAuth V2 | Channel listing, DMs, message posting |
| [Microsoft Teams](/lira/integrations/microsoft-teams) | Azure AD OAuth | Team/channel listing, message posting |
| [Google Calendar & Drive](/lira/integrations/google) | OAuth2 (dual client) | Calendar CRUD, file list/search/read |
| [GitHub](/lira/integrations/github) | OAuth | Repos, issues, PRs, code search |
| [Greenhouse](/lira/integrations/greenhouse) | API Key | Candidates, jobs, applications, scorecards |
| [HubSpot](/lira/integrations/hubspot) | OAuth2 | Contacts, companies, deals, pipelines |
| [Salesforce](/lira/integrations/salesforce) | OAuth2 + PKCE | Contacts, accounts, opportunities, leads |

## Consistent Adapter Interface

All integrations implement a consistent adapter interface (`adapter.interface.ts`) that standardises:

- **Connect** — OAuth flow initiation
- **Disconnect** — Token revocation and cleanup
- **Status check** — Connection health verification
- **Member listing** — Retrieve members from the connected platform

## Common API Endpoints

```bash
# Get OAuth URL for any provider
GET /lira/v1/integrations/:provider/auth-url

# OAuth callback handler
GET /lira/v1/integrations/:provider/callback

# Check connection status
GET /lira/v1/integrations/:provider/status

# Disconnect integration
DELETE /lira/v1/integrations/:provider/disconnect

# List members from connected platform
GET /lira/v1/integrations/:provider/members

# Save member mapping (maps external IDs to Lira org members)
POST /lira/v1/integrations/:provider/member-mappings
```

## Member Mapping

Each integration supports **member mapping** — linking external platform users to Lira org members. This enables:

- Attributing meeting action items to the correct team member
- Syncing tasks to the right person's inbox
- Proper name resolution in transcripts and summaries
