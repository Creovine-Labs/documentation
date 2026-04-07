---
sidebar_position: 1
title: Architecture
description: Creovine platform backend architecture — Fastify, PostgreSQL, Prisma.
---

# Platform Architecture

## Tech Stack

| Layer | Technology | Version |
|:---|:---|:---|
| Runtime | Node.js | 20 LTS |
| Language | TypeScript | 5.x |
| HTTP Framework | Fastify | 4.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 16 (AWS RDS) |
| Auth | `@fastify/jwt` (HS256) | — |
| Rate Limiting | `@fastify/rate-limit` | 1000 req / 15 min |
| CORS | `@fastify/cors` | — |
| API Docs | `@fastify/swagger` v8 + `@fastify/swagger-ui` v4 | Fastify 4–compatible |
| Validation | Zod | 3.x |
| Process Manager | systemd | `creovine-api.service` |
| Reverse Proxy | nginx | Latest |
| SSL | Let's Encrypt / certbot | Auto-renews |

:::warning Swagger Version Pinning
`@fastify/swagger@9` and `@fastify/swagger-ui@5` require **Fastify 5**. This repo uses Fastify 4 — always pin to `@fastify/swagger@8` and `@fastify/swagger-ui@4`.
:::

## Route Architecture

```
https://api.creovine.com
│
├── GET  /                          # Root — lists products
├── GET  /health                    # Health check
├── GET  /docs                      # Swagger UI
│
├── /v1  (Platform)
│   ├── /auth                       # Platform user auth
│   ├── /platform/admin             # Admin management + CMS admin
│   ├── /products                   # Public product catalog
│   └── /cms                        # Public CMS content
│
├── /cvault/v1  (CVault VPN)
│   ├── /auth                       # CVault user auth
│   ├── /devices                    # Device management
│   ├── /vpn                        # VPN session management
│   └── /licenses                   # License management
│
└── /lira/v1  (Lira AI)
    ├── /meetings                   # Meeting session CRUD + AI summary
    ├── /bot                        # Bot deployment + management
    ├── /orgs                       # Organizations, KB, documents, tasks
    ├── /integrations               # 9 OAuth providers
    ├── /email                      # Email config + inbound reply engine
    ├── /usage                      # Usage tracking & quotas
    ├── /webhooks/inbound           # External webhooks
    └── /ws                         # WebSocket (legacy text mode)
```

## Database Models

### Core Entities

| Model | Description |
|:---|:---|
| **Tenant** | Business customer (apiKey, status, limits, whitelabelConfig) |
| **TenantUser** | End user (email, role, googleId, passwordHash) |
| **Product** | Platform product catalog (slug, type, status, features, plans) |
| **License** | Product license (key, plan, maxUses, expiresAt) |

### CVault Entities

| Model | Description |
|:---|:---|
| **Device** | WireGuard device (publicKey, assignedIp, status) |
| **Session** | Active VPN connection (connectedAt, disconnectedAt) |
| **Server** | WireGuard server (region, publicIp, capacity) |

### CMS & Analytics

| Model | Description |
|:---|:---|
| **HomepageSlot** | CMS sections (HERO_SLIDE, FEATURED_BANNER, LOGO_STRIP, etc.) |
| **ContentBlock** | Generic key/value page content |
| **MediaAsset** | Uploaded media library |
| **AnalyticsEvent** | Raw event log (product views, SDK downloads) |
| **AnalyticsSummary** | Daily aggregated metrics |
| **UsageMetric** | Per-tenant daily bandwidth/connection usage |

### Lira AI Entities (DynamoDB)

| Table | Key Structure | Contains |
|:---|:---|:---|
| `lira-meetings` | `PK: USER#<userId>` | Meeting sessions, transcripts, settings |
| `lira-connections` | — | WebSocket connection tracking |
| `lira-organizations` | `PK: ORG#<orgId>, SK: <type>#<id>` | Orgs, members, KB entries, docs, tasks, email config |
| `lira-interviews` | `PK: ORG#<orgId>, SK: INT#<id>` | Interviews, questions, evaluations |
