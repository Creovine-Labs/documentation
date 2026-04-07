---
sidebar_position: 3
title: Slack
description: Channel messaging, DMs, and inbound webhooks with Slack.
---

# Slack Integration

Connect Lira to **Slack** for channel messaging, DMs, and receiving event notifications.

## Setup

1. Navigate to **Settings → Integrations → Slack**
2. Click **Connect** — redirects to Slack OAuth V2 consent
3. Select the workspace and authorize
4. Configure channel preferences and member mappings

## Capabilities

| Feature | Description |
|:---|:---|
| **Channel listing** | List all channels in the Slack workspace |
| **Message posting** | Post meeting summaries and updates to channels |
| **DMs** | Send direct messages to mapped members |
| **Inbound webhooks** | Receive Slack events via `POST /lira/v1/webhooks/inbound/slack` |
| **Member mapping** | Map Slack users to Lira org members |

## Meeting Summaries in Slack

After a meeting ends, Lira can automatically post a summary to a configured Slack channel, including:

- Meeting title and duration
- Attendees
- Key discussion points
- Action items with assignees

## OAuth Configuration

| Variable | Description |
|:---|:---|
| `SLACK_CLIENT_ID` | Slack app client ID |
| `SLACK_CLIENT_SECRET` | Slack app client secret |
| `SLACK_SIGNING_SECRET` | Slack signing secret for webhook verification |
