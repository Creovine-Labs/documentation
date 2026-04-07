---
sidebar_position: 4
title: Microsoft Teams
description: Team and channel integration with Microsoft Teams.
---

# Microsoft Teams Integration

Connect Lira to **Microsoft Teams** via Azure AD OAuth for team/channel listing, message posting, and inbound webhooks.

## Setup

1. Navigate to **Settings → Integrations → Microsoft Teams**
2. Click **Connect** — redirects to Azure AD OAuth consent
3. Authorize the Lira app for your tenant
4. Configure channel preferences and member mappings

## Capabilities

| Feature | Description |
|:---|:---|
| **Team listing** | List all teams in the M365 tenant |
| **Channel listing** | List channels within a team |
| **Message posting** | Post meeting summaries and updates to channels |
| **Inbound webhooks** | Receive Teams events via `POST /lira/v1/webhooks/inbound/teams` |
| **Member mapping** | Map Teams users to Lira org members |

## OAuth Configuration

| Variable | Description |
|:---|:---|
| `TEAMS_CLIENT_ID` | Azure AD app client ID |
| `TEAMS_CLIENT_SECRET` | Azure AD app client secret |
| `TEAMS_TENANT_ID` | Azure AD tenant ID |
