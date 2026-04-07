---
sidebar_position: 4
title: Concepts
description: Core design principles and key concepts of the Creovine platform.
---

# Concepts

Key design principles that govern the Creovine platform.

## Shared Backend Model

Every product shares a single Fastify backend (`creovine-api`). Products are isolated by their **route prefix**:

```
/v1           → Platform (auth, admin, CMS, products)
/cvault/v1    → CVault VPN
/lira/v1      → Lira AI
```

New products are added by registering a Fastify plugin with a new prefix — no separate server required.

## Multi-Tenancy

Business customers are **tenants**. Each tenant:
- Receives a unique `apiKey` for SDK authentication
- Has configurable limits (bandwidth, users, devices)
- Can white-label their product instance via `whitelabelConfig` (JSON)
- Manages their own end-users through tenant-scoped auth

## Product Lifecycle

Products follow a defined status progression:

```
DRAFT → COMING_SOON → BETA → LIVE → DEPRECATED
```

| Status | Meaning |
|:---|:---|
| `DRAFT` | Internal only, not visible on `creovine.com` |
| `COMING_SOON` | Visible on website, no access |
| `BETA` | Limited access, feedback phase |
| `LIVE` | Generally available |
| `DEPRECATED` | Winding down, migration period |

## License System

Licenses gate product access by tier:

| Plan | Typical Use |
|:---|:---|
| `TRIAL` | Limited uses (e.g. 5 connections) |
| `STARTER` | Small teams, higher caps |
| `PRO` | Unlimited usage |
| `ENTERPRISE` | Custom SLA, dedicated support |

License keys are auto-generated with product-specific prefixes (e.g. `cvlt_trial_abc123`, `ECK-xxx`).

## User Roles

| Role | Access Level |
|:---|:---|
| `USER` | Standard product access |
| `ADMIN` | Manage users, view analytics, CMS admin |
| `SUPER_ADMIN` | Promote/demote admins, full platform control |

## Secrets Management

All secrets load from **AWS Secrets Manager** at startup — never from `.env` in production. Config is lazy: a Proxy in `src/config/index.ts` throws if accessed before `validateConfig()` runs, preventing any service from reading config at module-load time before secrets are populated.

## Adding a New Product

1. Create route files in `src/routes/<product>.routes.ts`
2. Register routes in `src/index.ts` with `{ prefix: '/<product>/v1' }`
3. Add Swagger tag in `openapi.tags`
4. Add Prisma models if needed
5. Add AWS secret path `/creovine/<product>`
6. Create the Product record in the database
7. Create the client repo under `Creovine-Labs`
