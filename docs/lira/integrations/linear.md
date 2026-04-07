---
sidebar_position: 2
title: Linear
description: Issue sync, team listing, and member mapping with Linear.
---

# Linear Integration

Connect Lira to **Linear** to sync issues, list teams, and map members. Lira creates issues from meeting action items and receives updates via webhooks.

## Setup

1. Navigate to **Settings → Integrations → Linear** in the Lira dashboard
2. Click **Connect** — you'll be redirected to Linear's OAuth consent page
3. Authorize the Lira app
4. Configure member mappings and default team

## Capabilities

| Feature | Description |
|:---|:---|
| **Issue sync** | Create Linear issues from meeting action items |
| **Team listing** | List all teams in the Linear workspace |
| **Member mapping** | Map Linear users to Lira org members |
| **Default team** | Set a default team for new issues |
| **Inbound webhooks** | Receive issue updates via `POST /lira/v1/webhooks/inbound/linear` |

## How Lira Uses Linear

During meetings, when Lira identifies an action item, it can automatically create a Linear issue:

- **Title** — extracted from the action item
- **Description** — includes meeting context and transcript excerpt
- **Assignee** — mapped from speaker to Linear member
- **Team** — uses the configured default team

## OAuth Configuration

| Variable | Description |
|:---|:---|
| `LINEAR_CLIENT_ID` | Linear OAuth app client ID |
| `LINEAR_CLIENT_SECRET` | Linear OAuth app client secret |
