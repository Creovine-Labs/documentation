---
slug: /integrations/linear
sidebar_position: 6
title: Linear
---

# Linear Integration

Sync tasks and issues between Lira and Linear — automatically push meeting action items to your project board.

## Setup

1. Go to **Organization Settings → Integrations → Linear**
2. Click **Connect Linear**
3. Authorize via Linear's OAuth2 flow
4. Select the default team for issue creation

## Capabilities

| Feature | Description |
|:---|:---|
| Create issues | Push meeting tasks as Linear issues |
| Sync issues | Keep task status in sync bidirectionally |
| Team mapping | Map Lira org teams to Linear teams |
| Member mapping | Map org members to Linear users for assignment |
| Webhooks | Receive real-time updates when issues change |

## Task → Issue Flow

When Lira extracts a task from a meeting:

1. Task is created in Lira with title, description, and assignee
2. If Linear is connected → Issue is created in the mapped Linear team
3. Linear issue link is stored on the Lira task
4. Status changes in Linear are reflected back in Lira via webhooks
