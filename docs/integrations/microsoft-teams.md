---
slug: /integrations/microsoft-teams
sidebar_position: 3
title: Microsoft Teams
---

# Microsoft Teams Integration

Connect Lira to Microsoft Teams via Azure AD OAuth for message posting, channel management, and member mapping.

## Setup

1. Go to **Organization Settings → Integrations → Microsoft Teams**
2. Click **Connect Teams**
3. Sign in with your Microsoft account and grant permissions
4. Select the default team and channel

## Capabilities

| Feature | Description |
|:---|:---|
| Post messages | Send summaries and updates to Teams channels |
| List channels | Browse teams and channels |
| Member mapping | Map org members to Teams users |
| Inbound webhooks | Receive events from Teams |

## Authentication

Teams uses the **Microsoft Graph API** with Azure AD OAuth. The integration requires `ChannelMessage.Send`, `Channel.ReadBasic.All`, and `User.Read` permissions.
