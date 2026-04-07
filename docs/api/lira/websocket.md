---
sidebar_position: 10
title: WebSocket
description: Lira real-time WebSocket connection tracking.
---

# WebSocket

Lira uses WebSocket connections for real-time communication between the frontend and active bot sessions.

## Connection Tracking

Active WebSocket connections are tracked in the `lira-connections` DynamoDB table.

## How It Works

1. When a user opens a meeting page in the Lira frontend, a WebSocket connection is established
2. The connection is authenticated using the same JWT token
3. Real-time updates are pushed to the client:
   - Transcript segments as they arrive
   - Speaker identification updates
   - Bot status changes (joining, active, leaving)
   - Summary generation progress

## DynamoDB Schema

| Attribute | Description |
|:---|:---|
| `connectionId` | WebSocket connection identifier |
| `userId` | Authenticated user ID |
| `meetingId` | Associated meeting session |
| `connectedAt` | Connection timestamp |
| `ttl` | Auto-cleanup timestamp |

Connections are automatically cleaned up when the WebSocket disconnects or the TTL expires.
