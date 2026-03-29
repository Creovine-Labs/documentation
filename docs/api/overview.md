---
slug: /api/overview
sidebar_position: 1
title: API Overview
---

# API Overview

The Lira API is a RESTful API served by Fastify at `https://api.creovine.com`. All endpoints are prefixed with `/lira/v1/`.

## Base URL

```
https://api.creovine.com/lira/v1
```

## Authentication

All API calls require a JWT token in the `Authorization` header:

```bash
Authorization: Bearer <jwt_token>
```

Obtain a token by authenticating via Google Sign-In. See [Authentication](/getting-started/authentication) for details.

## Common Response Format

### Success

```json
{
  "success": true,
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Meeting not found"
  }
}
```

## Rate Limiting

API calls are rate-limited per organization based on the pricing tier. See [Usage Tracking](/getting-started/concepts#organizations) for limits.

## Endpoint Groups

| Group | Base Path | Description |
|:---|:---|:---|
| [Bot](/api/bot) | `/lira/v1/bot` | Deploy, status, terminate bots |
| [Meetings](/api/meetings) | `/lira/v1/meetings` | Meeting CRUD, summaries, transcripts |
| [Organizations](/api/organizations) | `/lira/v1/orgs` | Org management, members, settings |
| [Interviews](/api/interviews) | `/lira/v1/interviews` | Interview management, evaluations |
| [Integrations](/api/integrations) | `/lira/v1/integrations` | OAuth flows, connection management |
| [Tasks](/api/tasks) | `/lira/v1/tasks` | Task CRUD, assignment, sync |
| [WebSocket](/api/websocket) | `/lira/v1/ws` | Real-time audio streaming |
| [Webhooks](/api/webhooks) | `/lira/v1/webhooks` | Inbound event receivers |

## OpenAPI / Swagger

The API includes auto-generated Swagger documentation via `@fastify/swagger`, available at:

```
https://api.creovine.com/documentation
```
