---
slug: /api/overview
sidebar_position: 1
title: API Overview
---

# API Overview

The Lira API is a RESTful API built on **Fastify 4** with **Zod** schema validation. All endpoints use JSON request/response bodies (except file uploads which use multipart form-data).

## Base URL

```
https://api.creovine.com
```

Most endpoints are prefixed with `/lira/v1/`. Authentication routes use `/v1/auth/`.

## Authentication

All API calls (except public routes) require a JWT token in the `Authorization` header:

```bash
Authorization: Bearer <jwt_token>
```

Tokens are obtained via [Platform Auth](/api/authentication) (Google Sign-In or email/password) and expire after **7 days**.

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

API calls are rate-limited per organization based on beta limits. When a limit is reached, the API returns `429` with a `BETA_LIMIT_REACHED` error code. See [Usage & Limits](/api/usage) for details.

## Endpoint Groups

| Group | Base Path | Description |
|:---|:---|:---|
| [Authentication](/api/authentication) | `/v1/auth` | Register, login, Google Sign-In |
| [Bot](/api/bot) | `/lira/v1/bot` | Deploy, monitor, terminate bots |
| [Meetings](/api/meetings) | `/lira/v1/meetings` | Meeting CRUD, summaries, settings |
| [Organizations](/api/organizations) | `/lira/v1/orgs` | Orgs, members, documents, knowledge base |
| [Interviews](/api/interviews) | `/lira/v1/orgs/:orgId/interviews` | Interview lifecycle, evaluation, scoring |
| [Integrations](/api/integrations) | `/lira/v1/integrations` | OAuth flows, provider-specific endpoints |
| [Tasks](/api/tasks) | `/lira/v1/orgs/:orgId/tasks` | Task CRUD, AI extraction, execution |
| [WebSocket](/api/websocket) | `/lira/v1/ws` | Real-time audio + transcript streaming |
| [Webhooks](/api/webhooks) | `/lira/v1/webhooks` | Inbound event receivers |
| [Email](/api/email) | `/lira/v1/email` | Email config, custom domains, threads |
| [Usage & Limits](/api/usage) | `/lira/v1/usage` | Organization usage tracking |

## Tech Stack

| Component | Technology |
|:---|:---|
| Framework | Fastify 4.29.1 |
| Language | TypeScript 5.3.3 (Node.js 20+) |
| Validation | Zod schemas on all request bodies |
| Database | DynamoDB (single-table design) |
| Vector DB | Qdrant (1536-dim, `text-embedding-3-small`) |
| Storage | S3 (documents, recordings) |
| Encryption | AWS KMS (OAuth token encryption) |
| AI | Amazon Nova Sonic, OpenAI GPT-4o |
| Hosting | EC2 t3.small |
