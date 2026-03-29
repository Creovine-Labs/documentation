---
slug: /integrations/slack
sidebar_position: 2
title: Slack
---

# Slack Integration

Connect Lira to Slack to automatically post meeting summaries, task updates, and notifications to your channels.

## Setup

1. Go to **Organization Settings → Integrations → Slack**
2. Click **Connect Slack**
3. Authorize Lira in the Slack OAuth consent screen
4. Select the default channel for notifications

## Capabilities

| Feature | Description |
|:---|:---|
| Post messages | Send meeting summaries and task updates to channels |
| List channels | Browse available public and private channels |
| Member mapping | Map org members to Slack users for mentions |
| Inbound webhooks | Receive events from Slack in real-time |

## What Gets Posted

- **Meeting summaries** — Posted to the configured channel when a meeting ends
- **Task assignments** — Notifies the assignee via DM or channel mention
- **Integration alerts** — Connection status changes

## Member Mapping

After connecting, Lira automatically attempts to match org members by email. You can manually adjust mappings in the integration settings.

## Webhook Events

Lira listens for inbound Slack events including message posts and channel activity, enabling bidirectional communication.
