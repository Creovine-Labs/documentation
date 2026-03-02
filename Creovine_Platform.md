# Creovine Platform — Master Documentation

> **Living document.** Update this file whenever a new product, endpoint, or infrastructure change is made. This document is the single source of truth for the entire Creovine platform and is read by AI agents, developers, and integrations during onboarding and project creation.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Repository Structure](#2-repository-structure)
3. [Backend Architecture](#3-backend-architecture)
   - [Tech Stack](#31-tech-stack)
   - [Route Architecture](#32-route-architecture)
   - [Authentication Model](#33-authentication-model)
   - [Database Models](#34-database-models)
4. [Infrastructure](#4-infrastructure)
   - [Production Server](#41-production-server)
   - [AWS Services](#42-aws-services)
   - [Secrets Management](#43-secrets-management)
5. [Platform API — `/v1`](#5-platform-api--v1)
   - [Health](#51-health)
   - [Platform Auth](#52-platform-auth--v1auth)
   - [Platform Admin](#53-platform-admin--v1platformadmin)
   - [Product Catalog](#54-product-catalog--v1products)
   - [CMS](#55-cms--v1cms)
6. [CVault](#6-cvault)
   - [Product Overview](#61-product-overview)
   - [CVault Auth](#62-cvault-auth--cvaultv1auth)
   - [CVault Devices](#63-cvault-devices--cvaultv1devices)
   - [CVault VPN](#64-cvault-vpn--cvaultv1vpn)
   - [CVault Licenses](#65-cvault-licenses--cvaultv1licenses)
   - [CVault Clients](#66-cvault-clients)
7. [Lira AI](#7-lira-ai)
8. [EditCore](#8-editcore)
9. [Adding a New Product](#9-adding-a-new-product)
10. [Development Setup](#10-development-setup)
11. [Environment Variables Reference](#11-environment-variables-reference)

---

## 1. Platform Overview

**Creovine** is a multi-product software platform built by Creovine Labs. The platform provides a single centralised backend API that all products share, rather than each product operating its own independent backend. Products are isolated by their route prefix and tenant API key.

| Property | Value |
|---|---|
| Company | Creovine Labs |
| Website | https://creovine.com |
| API Base URL | https://api.creovine.com |
| Swagger / API Docs | https://api.creovine.com/docs |
| GitHub Org | https://github.com/Creovine-Labs |

**Current products:**
| Product | Status | Route Prefix | Description |
|---|---|---|---|
| CVault | Live | `/cvault/v1` | Managed WireGuard VPN — white-label VPN-as-a-Service |
| Lira AI | Beta | `/lira/v1` | Voice AI meeting participant — headless browser bot that joins Google Meet / Zoom, captures audio, and speaks AI responses using Amazon Nova Sonic bidirectional streaming. Frontend at https://lira.creovine.com. |
| EditCore | In Development | Flutter plugin (no backend route) | High-performance mobile video editing SDK for Flutter |

**Core design principle:** Every new product gets a route namespace (e.g. `/productname/v1`) inside `creovine-api`. Product-specific clients (desktop app, SDK, web demo) live in the product's own repo. The shared backend handles auth, licensing, devices, and platform infrastructure.

---

## 2. Repository Structure

All repos live under the [`Creovine-Labs`](https://github.com/Creovine-Labs) GitHub organisation.

### `creovine-api` — Shared Backend
```
creovine-api/
├── src/
│   ├── index.ts            # Server entry: plugin registration, route mounting
│   ├── config/             # Environment variable parsing and validation
│   ├── middleware/         # auth.middleware, license.middleware, platform-admin.middleware
│   ├── models/             # Shared TypeScript types
│   │   ├── lira.models.ts              # Meeting, Message, MeetingSettings, SonicSession
│   │   └── lira-bot.models.ts          # BotConfig, BotState, BotInstance, DeployBotRequest
│   ├── routes/
│   │   ├── platform-auth.routes.ts     # /v1/auth
│   │   ├── platform-admin.routes.ts    # /v1/platform/admin
│   │   ├── product.routes.ts           # /v1/products
│   │   ├── cms.routes.ts               # /v1/cms
│   │   ├── admin-cms.routes.ts         # /v1/platform/admin (CMS management)
│   │   ├── auth.routes.ts              # /cvault/v1/auth
│   │   ├── device.routes.ts            # /cvault/v1/devices
│   │   ├── vpn.routes.ts               # /cvault/v1/vpn
│   │   ├── license.routes.ts           # /cvault/v1/licenses
│   │   ├── lira-meetings.routes.ts     # /lira/v1/meetings
│   │   ├── lira-bot.routes.ts          # /lira/v1/bot (deploy, status, terminate, auth)
│   │   └── lira-ws.routes.ts           # /lira/v1/ws (WebSocket — text mode)
│   ├── services/
│   │   ├── lira-ai.service.ts          # Bedrock Nova Lite (summaries + sentiment)
│   │   ├── lira-store.service.ts       # DynamoDB CRUD (meetings + connections)
│   │   ├── lira-s3.service.ts          # S3 audio storage
│   │   ├── lira-sonic.service.ts       # Nova Sonic bidirectional streaming + wake word gating
│   │   ├── lira-wakeword.service.ts    # Wake word detection (exact + Levenshtein + Soundex)
│   │   └── lira-bot/
│   │       ├── index.ts                # Bot service exports + Google auth refresh scheduler
│   │       ├── meeting-bot.ts          # Playwright orchestrator: browser + AudioBridge + driver
│   │       ├── audio-bridge.ts         # Web Audio getUserMedia override, PCM inject/capture
│   │       ├── bot-manager.service.ts  # Bot lifecycle: deploy, terminate, mic toggle
│   │       ├── auth-refresh.ts         # Scheduled refresh of saved Google session cookies
│   │       └── drivers/
│   │           └── google-meet.driver.ts  # GMeet UI: join, leave, muteMic, unmuteMic
│   └── utils/
│       ├── prisma.ts       # Prisma client (lazy singleton)
│       └── secrets.ts      # AWS Secrets Manager loader (all environments)
├── prisma/
│   ├── schema.prisma       # Full database schema
│   └── migrations/         # Prisma migration history
├── .env                    # Local dev environment (not committed)
└── tsconfig.json
```

### `creovine-website` — Platform Website & Admin Console
```
creovine-website/        (Next.js 14, TypeScript, Tailwind)
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Shared UI components
│   └── lib/             # API client, utilities
└── public/
```

### `cvault` — CVault Product Clients
```
cvault/
├── desktop-client/      # Flutter desktop app (macOS, Windows)
├── sdk-js/              # JavaScript/TypeScript SDK (npm package)
└── web-demo/            # Vite + React demo app
```

### `lira` — Lira AI Frontend
```
lira/        (Vite + React + TypeScript, deployed to Vercel at https://lira.creovine.com)
├── src/
│   ├── app/             # Providers, router, store
│   ├── components/      # meeting-room, transcript, common UI components
│   ├── features/        # ai-participant, meeting, participants, settings
│   ├── pages/           # HomePage, MeetingPage
│   └── services/        # api, audio, webrtc, websocket clients
└── public/
```

> The Lira AI **backend** is implemented in `creovine-api` at `/lira/v1`. The `lira` repo is the dedicated React frontend deployed on Vercel.

### `creovine_editcore` — EditCore Flutter SDK
```
creovine_editcore/
├── lib/                 # Dart public API (EditCore, EditCoreConfig, models…)
├── android/             # Kotlin native plugin (MediaCodec, ExoPlayer)
├── ios/                 # Swift native plugin (AVFoundation, CoreImage)
├── example/             # Full working demo app
├── pubspec.yaml
├── README.md
└── editcore_architecture.md
```

### `documentation` — *(this repo)*
Master platform documentation, updated as products are added.

---

## 3. Backend Architecture

### 3.1 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 20 LTS |
| Language | TypeScript | 5.x |
| HTTP Framework | Fastify | 4.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 16 (AWS RDS) |
| Cache / Queues | Redis | 7 (optional, not required) |
| Auth | `@fastify/jwt` (JWT RS/HS256) | — |
| Rate Limiting | `@fastify/rate-limit` | 1000 req / 15 min |
| CORS | `@fastify/cors` | — |
| API Docs | `@fastify/swagger` v8 + `@fastify/swagger-ui` v4 | Fastify 4–compatible |
| VPN | WireGuard | kernel module |
| Validation | Zod | 3.x |
| Process Manager | systemd | `creovine-api.service` |
| Reverse Proxy | nginx | Latest |
| SSL | Let's Encrypt / certbot | Auto-renews |

> **Important:** `@fastify/swagger@9` and `@fastify/swagger-ui@5` require **Fastify 5**. This repo uses Fastify 4 — always pin to `@fastify/swagger@8` and `@fastify/swagger-ui@4`.

---

### 3.2 Route Architecture

```
https://api.creovine.com
│
├── GET  /                          # Root — lists products
├── GET  /health                    # Health check
├── GET  /docs                      # Swagger UI
│
├── /v1  (Platform — no product prefix)
│   ├── /auth                       # Platform user auth
│   ├── /platform/admin             # Admin management + CMS admin
│   ├── /products                   # Public product catalog
│   └── /cms                        # Public CMS content
│
├── /cvault/v1  (CVault product)
│   ├── /auth                       # CVault user auth
│   ├── /devices                    # Device management
│   ├── /vpn                        # VPN session management
│   └── /licenses                   # License management
│
└── /lira/v1  (Lira AI product)
    ├── /meetings                   # Meeting session CRUD + AI summary
    ├── /bot
    │   ├── /deploy                 # Deploy a meeting bot (POST)
    │   ├── /:botId                 # Get bot status (GET)
    │   ├── /:botId/terminate       # Stop a running bot (POST)
    │   ├── /active                 # List all active bots (GET)
    │   ├── /auth-status            # Check Google auth state (GET)
    │   └── /auth-refresh           # Refresh Google session cookies (POST)
    └── /ws                         # WebSocket — text-mode conversation (WSS, legacy)
```

**Adding a new product:** register a new Fastify plugin in `src/index.ts`:
```typescript
await fastify.register(
  async (fastify) => {
    await fastify.register(newProductAuthRoutes,  { prefix: '/auth' });
    await fastify.register(newProductModelsRoutes, { prefix: '/models' });
  },
  { prefix: '/<productname>/v1' }
);
```

---

### 3.3 Authentication Model

There are **three authentication layers**:

#### Tenant API Key (`X-API-Key` header)
- Each business customer (tenant) has a `apiKey` issued at signup.
- Required on all product SDK routes (CVault `/auth`, `/devices`, `/vpn`).
- Middleware: `apiKeyAuth` in `middleware/auth.middleware.ts`.
- Identifies which tenant the request belongs to, injected as `request.tenant`.

#### JWT Bearer Token (`Authorization: Bearer <token>`)
- Issued at login/register by the backend using `fastify.jwt.sign()`.
- Expires: **7 days** (platform users), **no expiry set** (CVault product users — review).
- Payload: `{ userId, tenantId, email, role }`.
- Middleware: `fullAuth` = apiKeyAuth + JWT verify.
- Platform admin middleware: `platformAdminAuth` (role ≥ ADMIN), `superAdminAuth` (role = SUPER_ADMIN).

#### Admin Key (`X-Admin-Key` header)
- Used for license admin operations (create, list, revoke).
- Stored as env var `ADMIN_SECRET_KEY`.
- Middleware: `adminKeyAuth` in `middleware/license.middleware.ts`.

#### Security Scheme Summary
| Header | Used where |
|---|---|
| `X-API-Key` | All CVault product routes |
| `Authorization: Bearer <jwt>` | Authenticated user routes |
| `X-Admin-Key` | License admin endpoints |

---

### 3.4 Database Models

#### Tenant (Business customer)
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Company/tenant name |
| `apiKey` | String (unique) | SDK auth key |
| `apiSecretHash` | String | Hashed API secret |
| `status` | `ACTIVE \| SUSPENDED \| TRIAL` | Account status |
| `bandwidthLimitGb` | Int? | Monthly bandwidth cap |
| `userLimit` | Int? | Max end-users |
| `maxDevicesPerUser` | Int | Default: 5 |
| `whitelabelConfig` | JSON | Custom branding |

#### TenantUser (End user of a tenant's product)
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `tenantId` | UUID | Parent tenant |
| `email` | String? | User email |
| `role` | `USER \| ADMIN \| SUPER_ADMIN` | Role |
| `googleId` | String? | Google OAuth ID |
| `passwordHash` | String? | Bcrypt hash |

#### Device (CVault — WireGuard device)
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `tenantUserId` | UUID | Owner |
| `deviceName` | String | Display name |
| `publicKey` | String (unique) | WireGuard public key |
| `assignedIp` | String (unique) | VPN IP (e.g. `10.8.0.5`) |
| `serverId` | UUID | WireGuard server |
| `status` | `ACTIVE \| REVOKED` | Device status |

#### Session (CVault — active VPN connection)
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `deviceId` | UUID | Connected device |
| `serverId` | UUID | VPN server |
| `connectedAt` | DateTime | Session start |
| `disconnectedAt` | DateTime? | Session end |
| `status` | `ACTIVE \| DISCONNECTED` | Session state |

#### Server (WireGuard VPN server)
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Server name |
| `region` | String | e.g. `us-east-1` |
| `publicIp` | String | Server IP |
| `publicKey` | String | WireGuard public key |
| `endpointPort` | Int | Default: `51820` |
| `capacity` | Int | Max peers |
| `status` | `ACTIVE \| MAINTENANCE \| OFFLINE` | Server state |

#### License
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `key` | String (unique) | e.g. `cvlt_trial_abc123` |
| `tenantId` | UUID | Owner tenant |
| `product` | String | e.g. `cvault-vpn` |
| `plan` | `TRIAL \| STARTER \| PRO \| ENTERPRISE` | License tier |
| `status` | `ACTIVE \| REVOKED \| EXPIRED` | License state |
| `maxUses` | Int? | `null` = unlimited |
| `usedCount` | Int | Connection counter |
| `expiresAt` | DateTime? | `null` = never |

#### Product (Platform product catalog)
| Field | Type | Description |
|---|---|---|
| `slug` | String (unique) | URL key (e.g. `cvault`) |
| `name` | String | Display name |
| `type` | `SDK \| API \| APP` | Product type |
| `status` | `DRAFT \| COMING_SOON \| BETA \| LIVE \| DEPRECATED` | Visibility |
| `isFeatured` | Boolean | Show on homepage |

Related models: `ProductVersion`, `ProductFeature`, `ProductPlan`, `ProductDoc`, `DocSection`, `ProductMedia`, `ProductDownload`.

#### CMS Models
- `HomepageSlot` — sections: `HERO_SLIDE`, `FEATURED_BANNER`, `LOGO_STRIP`, `PORTFOLIO_ITEM`, `CTA_BAND`
- `ContentBlock` — generic key/value page content blocks
- `MediaAsset` — uploaded media library

#### Analytics Models
- `AnalyticsEvent` — raw event log (product views, SDK downloads, etc.)
- `AnalyticsSummary` — daily aggregated metrics
- `UsageMetric` — per-tenant daily bandwidth/connection usage

---

## 4. Infrastructure

### 4.1 Production Server

| Property | Value |
|---|---|
| Provider | AWS EC2 |
| Instance ID | `i-038a4bb6abf311937` |
| Instance type | `t3.small` — 2 vCPU, 2 GB RAM |
| Region | `us-east-1a` |
| Elastic IP | `52.206.83.13` |
| OS | Ubuntu 22.04 LTS |
| SSH user | `ubuntu` |
| SSH key | `~/.ssh/creovine-api-key.pem` |
| App directory | `/opt/creovine-api/` |
| Systemd service | `creovine-api.service` |
| IAM instance profile | `creovine-api-profile` (Secrets Manager + DynamoDB + Bedrock + S3) |

**Open ports (Security Group `creovine-api-sg`):**
| Port | Protocol | Purpose |
|---|---|---|
| 22 | TCP | SSH |
| 80 | TCP | HTTP (nginx → HTTPS redirect) |
| 443 | TCP | HTTPS (nginx → app:3000) |

**Database:**
| Property | Value |
|---|---|
| Provider | AWS RDS |
| Instance ID | `creovine-postgres` |
| Engine | PostgreSQL 16.6 |
| Instance class | `db.t4g.micro` |
| Endpoint | `creovine-postgres.c2f4iicw8b6b.us-east-1.rds.amazonaws.com:5432` |
| DB name | `creovine` |
| Security group | `creovine-rds-sg` (port 5432 from EC2 only — not public) |

**Running services:**
```
creovine-api.service   # Node.js API (systemd, auto-restart)
nginx.service          # Reverse proxy + SSL termination + WebSocket upgrade
```

**WireGuard server details:**
| Property | Value |
|---|---|
| Interface | `wg0` |
| Subnet | `10.8.0.0/16` |
| Listen port | `51820` |
| Server IP (VPN) | `10.8.0.1` |
| Server public key | `ugJvPBwy++vfwEl31oGjoio5Vx2T+DLvdPqfcuzyRU8=` |

---

### 4.2 AWS Services

| Service | Usage |
|---|---|
| EC2 | Production API server (`i-038a4bb6abf311937`, `t3.small`) |
| RDS (PostgreSQL 16) | Managed production database (`creovine-postgres`) |
| Secrets Manager | All production secrets (5 paths) |
| DynamoDB | Lira AI — meetings + connections tables |
| Bedrock `amazon.nova-sonic-v1:0` | Lira AI — bidirectional speech-to-speech streaming (primary AI engine) |
| Bedrock `amazon.nova-lite-v1:0` | Lira AI — meeting summary generation only |
| S3 | Lira AI — audio clip storage (`lira-s3.service.ts`) |
| IAM | User `creovine-admin`; EC2 instance profile `creovine-api-profile` |

**AWS Account:** `814322375061` (`support@creovine.com`)  
**IAM User:** `creovine-admin`  
**Default CLI region:** `us-east-1`  
**EC2 Elastic IP:** `52.206.83.13`

---

### 4.3 Secrets Management

Production secrets are **not stored in `.env` files on the server** — they are loaded from **AWS Secrets Manager** at startup via `src/utils/secrets.ts`. This runs in **all environments** (production and local). A local `.env` file can override any key — values already set in `process.env` are never overwritten.

**Secret paths in AWS Secrets Manager (`us-east-1`):**

| Path | Contains |
|---|---|
| `/creovine/shared` | `JWT_SECRET`, `DATABASE_URL` |
| `/creovine/api` | `NODE_ENV`, `PORT`, `LOG_LEVEL`, `CORS_ORIGIN`, `ADMIN_SECRET`, `ADMIN_ENCRYPTION_KEY`, `API_ENCRYPTION_KEY` |
| `/cvault` | `WG_SERVER_IP`, `WG_SERVER_PORT`, `WG_SERVER_PUBLIC_KEY`, `WG_SERVER_SSH_HOST`, `WG_SERVER_SSH_PORT`, `WG_SERVER_SSH_USER`, `WG_SERVER_SSH_KEY_PATH`, `ADMIN_ENCRYPTION_KEY`, `ENCRYPTION_KEY` |
| `/lira` | `LIRA_DYNAMODB_MEETINGS_TABLE`, `LIRA_DYNAMODB_CONNECTIONS_TABLE`, `LIRA_BEDROCK_REGION`, `LIRA_BEDROCK_MODEL_ID` (Nova Sonic), `LIRA_SUMMARY_MODEL_ID` (Nova Lite), `LIRA_S3_AUDIO_BUCKET`, `LIRA_SESSION_TTL_HOURS`, `LIRA_BOT_GOOGLE_AUTH_STATE`, `LIRA_BOT_HEADLESS`, `LIRA_BOT_DISPLAY_NAME` |
| `/creovine/rds` | `username`, `password`, `dbname` (RDS master credentials — for ops only) |

**Startup sequence:**
```
loadSecretsFromAWS()   →   fills process.env from all 4 secret paths
validateConfig()       →   validates all required vars are present (Zod)
fastify = Fastify()    →   server created after config is valid
```

> **Config is lazy:** `src/config/index.ts` exports a Proxy that throws if accessed before `validateConfig()` runs. This prevents any service file from reading config at module-load time before secrets are populated.

**To update a secret:**
```bash
# Fetch, modify, re-upload
aws secretsmanager get-secret-value --secret-id /cvault --query SecretString --output text > /tmp/s.json
# edit /tmp/s.json
aws secretsmanager put-secret-value --secret-id /cvault --secret-string file:///tmp/s.json
```

---

## 5. Platform API — `/v1`

Base URL: `https://api.creovine.com/v1`

### 5.1 Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | None | Root — returns platform info + product list |
| GET | `/health` | None | Health check → `{ status: "ok", timestamp }` |

---

### 5.2 Platform Auth — `/v1/auth`

These routes authenticate **creovine.com users** (platform-level — developers, admins, console users). No `X-API-Key` required.

JWT issued with `{ userId, tenantId, email, role }`, expires in **7 days**.

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/v1/auth/register` | None | `{ email, password, name, company? }` | Register platform account |
| POST | `/v1/auth/login` | None | `{ email, password }` | Login, returns JWT |
| POST | `/v1/auth/google` | None | `{ credential }` | Google OAuth (ID token) |
| GET | `/v1/auth/me` | Bearer JWT | — | Get current platform user |

**Register / Login response:**
```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "USER",
    "tenantId": "uuid"
  }
}
```

---

### 5.3 Platform Admin — `/v1/platform/admin`

Requires **ADMIN** or **SUPER_ADMIN** role (JWT with `role` claim).

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/v1/platform/admin/users` | ADMIN+ | List all users (supports `?search=`) |
| GET | `/v1/platform/admin/admins` | SUPER_ADMIN | List all admins & super-admins |
| POST | `/v1/platform/admin/users/:id/promote` | SUPER_ADMIN | Promote user → ADMIN |
| POST | `/v1/platform/admin/users/:id/demote` | SUPER_ADMIN | Demote ADMIN → USER |

**CMS Admin** (also mounted at `/v1/platform/admin`, requires ADMIN+):

| Method | Path | Description |
|---|---|---|
| GET | `/v1/platform/admin/products` | List all products (drafts included) |
| POST | `/v1/platform/admin/products` | Create product |
| PUT | `/v1/platform/admin/products/:id` | Update product |
| DELETE | `/v1/platform/admin/products/:id` | Delete product |
| GET | `/v1/platform/admin/homepage-slots` | List homepage CMS slots |
| POST | `/v1/platform/admin/homepage-slots` | Create homepage slot |
| PUT | `/v1/platform/admin/homepage-slots/:id` | Update slot |
| DELETE | `/v1/platform/admin/homepage-slots/:id` | Delete slot |
| GET | `/v1/platform/admin/content-blocks` | List content blocks |
| PUT | `/v1/platform/admin/content-blocks/:page/:key` | Upsert content block |
| GET | `/v1/platform/admin/media` | List media assets |
| DELETE | `/v1/platform/admin/media/:id` | Delete media asset |
| GET | `/v1/platform/admin/analytics` | Dashboard metrics |

---

### 5.4 Product Catalog — `/v1/products`

Public endpoints, no authentication required.

| Method | Path | Query | Description |
|---|---|---|---|
| GET | `/v1/products` | `?type=SDK\|API\|APP` | List published products |
| GET | `/v1/products/:slug` | — | Single product detail (tracks view event) |
| GET | `/v1/products/:slug/docs` | — | Product documentation index |
| GET | `/v1/products/:slug/docs/:docSlug` | — | Specific documentation page |

**Product response shape:**
```json
{
  "id": "uuid",
  "slug": "cvault",
  "name": "CVault",
  "tagline": "...",
  "type": "APP",
  "status": "LIVE",
  "features": [...],
  "plans": [...],
  "downloads": [...],
  "versions": [...]
}
```

---

### 5.5 CMS — `/v1/cms`

Public, cache-friendly (60s client / 300s CDN). No authentication required.

| Method | Path | Cache | Description |
|---|---|---|---|
| GET | `/v1/cms/homepage` | 60s / 300s | All homepage CMS data (hero, banners, portfolio) |
| GET | `/v1/cms/page/:pageId` | 60s / 300s | Content blocks for a specific page |
| GET | `/v1/cms/nav` | 300s / 600s | Navigation items |

---

## 6. CVault

### 6.1 Product Overview

**CVault** is a **WireGuard VPN-as-a-Service** platform. It provides a white-label VPN product — B2B tenants embed CVault into their own apps using the SDK or desktop client. The Creovine backend handles:

- WireGuard key generation (server-side)
- Device registration and peer management
- Session tracking
- License enforcement
- IP pool management

**How it works end-to-end:**
1. Tenant registers → receives `X-API-Key`
2. User registers/logs in via `/cvault/v1/auth` → receives JWT
3. User registers a device → backend generates WireGuard keypair, assigns VPN IP, writes peer to server config
4. User calls `/cvault/v1/vpn/connect` with `deviceId` → session created, license usage incremented
5. Device downloads `.conf` via `/cvault/v1/devices/:id/config` → imports into WireGuard client
6. Device connects directly to WireGuard server (UDP 51820) — from this point it's kernel-level VPN, no backend involvement

**Stack:**
- Backend: Fastify (shared `creovine-api`)
- Desktop client: Flutter (macOS, Windows) — `cvault/desktop-client`
- JS SDK: TypeScript npm package — `cvault/sdk-js`
- Web demo: Vite + React — `cvault/web-demo`

---

### 6.2 CVault Auth — `/cvault/v1/auth`

All routes require `X-API-Key` header (tenant API key).

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/cvault/v1/auth/register` | `X-API-Key` | `{ email, password }` | Register a CVault user under a tenant |
| POST | `/cvault/v1/auth/login` | `X-API-Key` | `{ email, password }` | Login, returns JWT |
| GET | `/cvault/v1/auth/me` | `X-API-Key` + Bearer JWT | — | Get current user |

**Register/Login response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "tenantId": "uuid",
    "createdAt": "2026-01-01T00:00:00Z"
  },
  "accessToken": "<jwt>"
}
```

---

### 6.3 CVault Devices — `/cvault/v1/devices`

All routes require `X-API-Key` + `Authorization: Bearer <jwt>`.

| Method | Path | Body / Params | Description |
|---|---|---|---|
| POST | `/cvault/v1/devices` | `{ deviceName, deviceType? }` | Register new device — generates WireGuard key pair, assigns VPN IP |
| GET | `/cvault/v1/devices` | — | List user's devices |
| GET | `/cvault/v1/devices/:deviceId/config` | — | Download WireGuard `.conf` for device |
| DELETE | `/cvault/v1/devices/:deviceId` | — | Revoke device (removes from VPN server) |

**Supported `deviceType` values:** `iOS`, `Android`, `Windows`, `macOS`, `Linux`

**Device registration response:**
```json
{
  "device": {
    "id": "uuid",
    "deviceName": "My MacBook",
    "assignedIp": "10.8.0.X",
    "publicKey": "...",
    "status": "ACTIVE"
  },
  "config": "[Interface]\nAddress = 10.8.0.X/16\n..."
}
```

**Config file format (WireGuard `.conf`):**
```ini
[Interface]
Address = 10.8.0.X/16
PrivateKey = <device-private-key>
DNS = 1.1.1.1

[Peer]
PublicKey = ugJvPBwy++vfwEl31oGjoio5Vx2T+DLvdPqfcuzyRU8=
Endpoint = 44.208.117.166:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

---

### 6.4 CVault VPN — `/cvault/v1/vpn`

All routes require `X-API-Key` + `Authorization: Bearer <jwt>`.

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/cvault/v1/vpn/connect` | `{ deviceId }` | Start VPN session — requires valid license |
| POST | `/cvault/v1/vpn/disconnect` | `{ deviceId }` | End VPN session |
| GET | `/cvault/v1/vpn/status` | — | Get all active sessions for user |

> **Note:** `/vpn/connect` requires `licenseCheck` middleware — the request must include a valid license or it returns `402 Payment Required`.

**Connect response:**
```json
{
  "sessionId": "uuid",
  "status": "connected",
  "connectedAt": "2026-01-01T00:00:00Z",
  "message": "VPN connection established"
}
```

**Status response:**
```json
{
  "activeSessions": [
    {
      "sessionId": "uuid",
      "connectedAt": "...",
      "device": { "id": "uuid", "deviceName": "...", "assignedIp": "10.8.0.X" },
      "server": { "publicIp": "44.208.117.166", "region": "us-east-1" }
    }
  ],
  "totalActive": 1
}
```

---

### 6.5 CVault Licenses — `/cvault/v1/licenses`

**Admin endpoints** require `X-Admin-Key` header.  
**Public validate** requires `X-API-Key` (tenant key).

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/cvault/v1/licenses` | `X-Admin-Key` | Create a license |
| GET | `/cvault/v1/licenses` | `X-Admin-Key` | List licenses (`?tenantId=&product=&plan=&status=`) |
| GET | `/cvault/v1/licenses/:key` | `X-Admin-Key` | Get single license |
| POST | `/cvault/v1/licenses/:key/revoke` | `X-Admin-Key` | Revoke a license |
| POST | `/cvault/v1/licenses/validate` | `X-API-Key` | Validate a license (used by SDK pre-connect) |

**License plans:**
| Plan | Description |
|---|---|
| `TRIAL` | Limited uses (default: 5 connections) |
| `STARTER` | Higher connection cap |
| `PRO` | Unlimited |
| `ENTERPRISE` | Unlimited + custom config + SLA |

**Create license body:**
```json
{
  "tenantId": "uuid",
  "product": "cvault-vpn",
  "plan": "TRIAL",
  "maxUses": 5,
  "expiresAt": "2026-12-31T00:00:00Z"
}
```

**Validate response:**
```json
{
  "valid": true,
  "plan": "PRO",
  "usesRemaining": null
}
```

---

### 6.6 CVault Clients

#### JavaScript / TypeScript SDK (`cvault/sdk-js`)
```typescript
import { CVaultClient } from '@creovine/cvault-sdk';

const client = new CVaultClient({
  apiKey: 'YOUR_TENANT_API_KEY',
  baseUrl: 'https://api.creovine.com',
});

await client.auth.login({ email, password });
const devices = await client.devices.list();
const config = await client.devices.getConfig(deviceId);
await client.vpn.connect({ deviceId, licenseKey });
```

#### Flutter Desktop App (`cvault/desktop-client`)
- Platforms: macOS, Windows
- Uses the same REST API via `http` package
- Handles WireGuard process management natively

---

## 7. Lira AI

> **Status: Live (Beta) — Frontend on Vercel · Backend in `creovine-api` at `/lira/v1`**

**Lira AI** is a voice-powered AI meeting participant that physically joins Google Meet (and Zoom) calls as a real participant, listens to the conversation, and responds in natural speech when addressed by name. Unlike passive transcription tools, Lira actively participates — answering questions, challenging ideas, and summarising discussions — powered by **Amazon Nova Sonic** (bidirectional speech-to-speech via AWS Bedrock).

> ✅ **Lira AI backend is in `creovine-api`** at `/lira/v1`. The `lira_ai/backend` Go code is legacy and not deployed.

---

### 7.1 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript — deployed to Vercel (`https://lira.creovine.com`) |
| Backend | TypeScript / Fastify 4.x — shared `creovine-api`, route prefix `/lira/v1` |
| AI | Amazon Bedrock — `amazon.nova-sonic-v1:0` (bidirectional speech-to-speech) |
| Browser bot | Playwright Chromium — headless browser that joins and controls the meeting |
| Database | AWS DynamoDB (meeting records, transcripts) |
| Auth | Platform standard — `X-API-Key` + Bearer JWT |

---

### 7.2 How It Works

A REST call to `/lira/v1/bots/deploy` launches a headless Playwright browser on the EC2 server. The bot navigates to the meeting URL, joins as a named participant, and establishes a bidirectional audio stream with Amazon Nova Sonic. Meeting audio captured from other participants is streamed to Nova Sonic for transcription and reasoning; Nova Sonic's audio responses are injected back into the meeting in real time.

Key behaviours:
- **Wake word activation** — Lira only responds when her name is mentioned (3-layer detection: exact match → fuzzy Levenshtein → Soundex phonetic). Stays quiet otherwise.
- **Physical mic mute/unmute** — voice commands ("Lira, mute" / "unmute") click the actual mic button in Google Meet.
- **Auto-leave** — bot leaves automatically after 45 seconds alone in the meeting.
- **Session keepalive** — silent audio keepalive prevents Nova Sonic from timing out in long meetings.

---

### 7.3 REST API (overview)

**Base URL:** `https://api.creovine.com/lira/v1`
**Auth:** `X-API-Key` + `Authorization: Bearer <jwt>`

| Method | Path | Description |
|---|---|---|
| POST | `/lira/v1/bots/deploy` | Launch a bot into a meeting |
| POST | `/lira/v1/bots/:botId/terminate` | Remove the bot from a meeting |
| GET | `/lira/v1/bots` | List active bots |
| GET | `/lira/v1/meetings/:id` | Get meeting details + transcript |
| GET | `/lira/v1/meetings/:id/summary` | AI-generated meeting summary |
| DELETE | `/lira/v1/meetings/:id` | Delete a meeting record |

---

### 7.4 AWS Services Used

| Service | Purpose |
|---|---|
| EC2 / `creovine-api` | Hosts the bot manager and all API routes |
| Bedrock `amazon.nova-sonic-v1:0` | Bidirectional speech — STT + LLM reasoning + TTS in one stream |
| DynamoDB | Meeting records, message transcripts |

---

## 8. EditCore

> **Status: In Development — Flutter plugin (iOS + Android), no backend route.**

**EditCore** is a drop-in Flutter plugin that embeds a professional-grade video editor directly into iOS and Android apps. It exposes a single `EditCore.openEditor()` call that presents a full-screen editor UI with trim, crop, filters, text overlays, watermarks, and hardware-accelerated export. A built-in licensing layer gates features by tier, validated remotely against the Creovine platform.

> ⚠️ **EditCore does NOT add routes to `creovine-api`** at the product level. It communicates with the platform only for license validation (using a `ECK-` prefixed API key).

---

### 8.1 Tech Stack

| Layer | Technology |
|---|---|
| Language | Dart / Flutter 3.10+ |
| iOS native | Swift — AVFoundation, CoreImage |
| Android native | Kotlin — MediaCodec, ExoPlayer |
| State management | Provider |
| License validation | HTTP → Creovine platform API |
| Secure storage | `flutter_secure_storage` (cached license state) |
| Version | `0.1.0` |
| Package name | `creovine_editcore` |

---

### 8.2 Features

| Feature | Description | Status |
|---|---|---|
| **Trim** | Millisecond-level trimming with visual handles | ✅ v0.1 |
| **Crop** | Normalized crop rectangles with live preview | ✅ v0.1 |
| **Filters** | 10 built-in CIFilter/shader effects | ✅ v0.1 |
| **Text Overlays** | Customizable fonts, colors, timing | ✅ v0.1 |
| **Watermarks** | Configurable position, opacity, scale | ✅ v0.1 |
| **Export** | Hardware-accelerated with progress streaming | ✅ v0.1 |
| **Licensing** | Remote validation + tier feature gating | ✅ v0.1 |
| Cloud rendering | — | 🔜 Planned |
| AI tools | Auto-cut, scene detection | 🔜 Planned |
| Auto-captions | — | 🔜 Planned |

**Built-in filters:** None, Mono, Fade, Chrome, Noir, Instant, Vivid, Warmth, Cool, Drama

---

### 8.3 License Tiers

| Tier | Features | Use Case |
|---|---|---|
| **Free** | Trim only, forced watermark | Evaluation / non-commercial |
| **Basic** | Trim, crop, text, filters | Small apps, startups |
| **Pro** | All features, no forced watermark | Commercial apps |
| **Enterprise** | Pro + custom watermark + metering | Large-scale deployments |

API keys are prefixed `ECK-`. Contact **sdk@creovine.com**.

---

### 8.4 Public API

#### Initialize
```dart
await EditCore.initialize(apiKey: 'ECK-YOUR_KEY');
```
Must be called in `main()` before any other SDK call.

#### Open editor
```dart
final result = await EditCore.openEditor(
  context: context,
  videoPath: '/path/to/video.mp4',
  config: EditCoreConfig(
    enableFilters: true,
    enableTextOverlay: true,
    enableTrim: true,
    enableCrop: true,
  ),
);
// result.success, result.outputPath, result.durationMs, result.fileSizeBytes
```

#### Other methods
```dart
LicenseTier tier = await EditCore.getLicenseTier();          // free | basic | pro | enterprise
bool ok       = await EditCore.isFeatureEnabled(feature);   // EditCoreFeature enum
```

#### `EditCoreConfig` options
| Property | Default | Description |
|---|---|---|
| `enableFilters` | `true` | Show filter panel |
| `enableTextOverlay` | `true` | Enable text overlay tool |
| `enableWatermark` | `false` | Show watermark tool |
| `enableTrim` | `true` | Enable trim handles |
| `enableCrop` | `true` | Enable crop tool |
| `allowCancel` | `true` | Show cancel button |
| `exportConfig` | default | Resolution, bitrate, format |

#### `ExportConfig` options
| Property | Options |
|---|---|
| `resolution` | `sd480p`, `hd720p`, `fhd1080p` *(default)*, `uhd4k`, `original` |
| `format` | `mp4` *(default)* |
| `bitrate` | Optional override |

---

### 8.5 Installation

```yaml
# pubspec.yaml
dependencies:
  creovine_editcore:
    git:
      url: https://github.com/creovine/editcore.git
      ref: main
```

**Platform requirements:**
| Platform | Minimum |
|---|---|
| iOS | 13.0+ |
| Android | API 21+ (Android 5.0) |
| Flutter | 3.10+ |
| Dart | 3.0+ |

**iOS** — add to `Info.plist`:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to select videos for editing.</string>
```

---

### 8.6 Architecture

```
┌────────────────────────────────────────────┐
│          HOST APPLICATION                  │
├────────────────────────────────────────────┤
│      PUBLIC API  (EditCore class)          │
├────────────────────────────────────────────┤
│         LICENSING LAYER                    │  ← validates ECK- key against Creovine API
├───────────────┬────────────────────────────┤
│   UI LAYER    │   CORE ENGINE LAYER        │
├───────────────┴────────────────────────────┤
│            EXPORT LAYER                    │
├────────────────────────────────────────────┤
│        PLATFORM CHANNEL BRIDGE             │
├──────────────────┬─────────────────────────┤
│   iOS (Swift)    │   Android (Kotlin)      │
│   AVFoundation   │   MediaCodec            │
│   CoreImage      │   ExoPlayer             │
└──────────────────┴─────────────────────────┘
```

---

## 9. Adding a New Product

Follow this checklist when adding a new product to the Creovine platform:

### 9.1 Backend (in `creovine-api`)

1. **Create route files** in `src/routes/` with prefix convention `<product>.routes.ts`
2. **Register routes** in `src/index.ts`:
   ```typescript
   await fastify.register(
     async (fastify) => {
       await fastify.register(productAuthRoutes, { prefix: '/auth' });
       // ... more routes
     },
     { prefix: '/<productname>/v1' }
   );
   ```
3. **Add Swagger tag** in the `openapi.tags` array in `src/index.ts`
4. **Add Prisma models** if the product needs new tables — run `npx prisma migrate dev`
5. **Add AWS secret path** `/creovine/<productname>` in AWS Secrets Manager and load it in `src/utils/secrets.ts`
6. **Build and deploy:**
   ```bash
   git push   # deploy to production from server
   ```

### 9.2 Product Catalog

1. Create a `Product` record in the database with the new product's `slug`, `name`, `type`, `status`
2. Add features, plans, and docs via admin CMS routes or seed script

### 9.3 Product Client Repo

Create a new repo under `Creovine-Labs`. Structure depends on product type:

- **Shared backend product** (like CVault): add routes to `creovine-api`, create client repo with `desktop-client/`, `sdk-js/`, `web-demo/`
- **Own backend product**: create a separate folder/repo with its own stack. Note: Lira AI was originally planned this way but was migrated to `creovine-api` — prefer the shared backend approach for new products.
- **SDK/plugin product** (like EditCore): Flutter plugin or npm package repo, license validation via Creovine API with `ECK-` key prefix

### 9.4 Update this document

Add a new section to this file (see section 6 as template) covering:
- Product overview
- Auth pattern
- All endpoints (method, path, auth, body, response)
- Client details

---

## 10. Development Setup

### Prerequisites
- Node.js 20+
- Docker Desktop
- AWS CLI (`aws configure` using `creovine-admin` IAM credentials)
- Git

### Local backend setup

```bash
# Clone
git clone https://github.com/Creovine-Labs/creovine-api
cd creovine-api

# Install dependencies
npm install

# Start local PostgreSQL (Docker Desktop must be running)
docker run -d --name local-postgres \
  -e POSTGRES_USER=creovine \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=creovine \
  -p 5433:5432 postgres:16-alpine

# The app loads secrets from AWS Secrets Manager automatically.
# For local dev you can override specific values in .env:
echo 'DATABASE_URL=postgresql://creovine:devpassword@localhost:5433/creovine?schema=public' > .env
echo 'NODE_ENV=development' >> .env

# Run migrations and generate Prisma client
npx prisma migrate dev
npx prisma generate

# Start dev server (with hot-reload)
npm run dev

# API available at http://localhost:3000
# Docs at http://localhost:3000/docs
```

> **Note:** AWS secrets (`JWT_SECRET`, `ADMIN_SECRET`, Lira AI config, etc.) are loaded automatically via `src/utils/secrets.ts` using your local AWS CLI profile (`creovine-admin`). You only need `.env` for `DATABASE_URL` to point at your local Docker Postgres instead of the production RDS instance.

### Deploying to production

```bash
# Build locally
npm run build

# Sync code to server (run from creovine-api directory)
rsync -az \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  -e "ssh -i ~/.ssh/creovine-api-key.pem" \
  ./ ubuntu@52.206.83.13:/opt/creovine-api/

# SSH in and restart
ssh -i ~/.ssh/creovine-api-key.pem ubuntu@52.206.83.13
cd /opt/creovine-api
npm install --production
npx prisma generate
npx prisma migrate deploy   # safe — only runs pending migrations
sudo systemctl restart creovine-api
sudo systemctl status creovine-api
```

> **Secrets on server:** The EC2 instance has the `creovine-api-profile` IAM role attached, so `aws secretsmanager` calls work without any credentials configured. No `.env` needed on the server — only `NODE_ENV=production` and `AWS_DEFAULT_REGION=us-east-1` are in `/opt/creovine-api/.env`.

---

## 11. Environment Variables Reference

These are the variables used by the backend. In **development** they come from `.env`. In **production** they are loaded from AWS Secrets Manager.

| Variable | Source (AWS path) | Description |
|---|---|---|
| `DATABASE_URL` | `/creovine/shared` | PostgreSQL connection string (points to RDS in production) |
| `JWT_SECRET` | `/creovine/shared` | JWT signing secret |
| `NODE_ENV` | `/creovine/api` | `production` |
| `PORT` | `/creovine/api` | Server port (`3000`) |
| `LOG_LEVEL` | `/creovine/api` | `info` |
| `CORS_ORIGIN` | `/creovine/api` | Comma-separated allowed origins |
| `ADMIN_SECRET` | `/creovine/api` | Admin API key for license management |
| `API_ENCRYPTION_KEY` | `/creovine/api` | API key encryption |
| `ADMIN_ENCRYPTION_KEY` | `/creovine/api` | Admin-level encryption key |
| `WG_SERVER_IP` | `/cvault` | WireGuard server public IP |
| `WG_SERVER_PORT` | `/cvault` | WireGuard listen port (51820) |
| `WG_SERVER_PUBLIC_KEY` | `/cvault` | WireGuard server public key |
| `WG_SERVER_SSH_HOST` | `/cvault` | SSH host for WireGuard config management |
| `WG_SERVER_SSH_PORT` | `/cvault` | SSH port (22) |
| `WG_SERVER_SSH_USER` | `/cvault` | SSH user (`ubuntu`) |
| `WG_SERVER_SSH_KEY_PATH` | `/cvault` | SSH key path |
| `ENCRYPTION_KEY` | `/cvault` | Device private key encryption key |
| `LIRA_DYNAMODB_MEETINGS_TABLE` | `/lira` | DynamoDB meetings table name (`lira-meetings`) |
| `LIRA_DYNAMODB_CONNECTIONS_TABLE` | `/lira` | DynamoDB connections table name (`lira-connections`) |
| `LIRA_BEDROCK_REGION` | `/lira` | AWS region for Bedrock calls (`us-east-1`) |
| `LIRA_NOVA_SONIC_MODEL_ID` | `/lira` | Nova Sonic model ID (`amazon.nova-sonic-v1:0`) |
| `LIRA_SESSION_TTL_HOURS` | `/lira` | DynamoDB TTL for sessions (default: 24) |

> **Never commit actual secret values to Git.** Use `.env` locally and AWS Secrets Manager in production. The `.env` file is in `.gitignore`.

---

*Last updated: March 2, 2026*  
*Maintainer: Creovine Labs — support@creovine.com*

---

### Infrastructure Change Log

| Date | Change |
|---|---|
| 2026-02-27 | Migrated production server from AWS Lightsail (`44.208.117.166`) to EC2 `t3.small` (`52.206.83.13`) |
| 2026-02-27 | Replaced Docker PostgreSQL with AWS RDS PostgreSQL 16 (`creovine-postgres.c2f4iicw8b6b.us-east-1.rds.amazonaws.com`) |
| 2026-02-27 | Lira AI backend migrated from Go serverless (Lambda + API Gateway) to TypeScript in `creovine-api` at `/lira/v1` |
| 2026-02-27 | Config architecture changed to lazy Proxy + `validateConfig()` — secrets always loaded from AWS before validation |
| 2026-02-27 | SSL certificates issued for `api.creovine.com` and `cvault.creovine.com` via Let's Encrypt (auto-renews) |
