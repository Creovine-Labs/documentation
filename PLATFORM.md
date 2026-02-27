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
7. [Lyra AI](#7-lyra-ai) *(Planned)*
8. [Adding a New Product](#8-adding-a-new-product)
9. [Development Setup](#9-development-setup)
10. [Environment Variables Reference](#10-environment-variables-reference)

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
| Lyra AI | Planned | `/lyra/v1` | AI voice/language platform |

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
│   ├── routes/
│   │   ├── platform-auth.routes.ts     # /v1/auth
│   │   ├── platform-admin.routes.ts    # /v1/platform/admin
│   │   ├── product.routes.ts           # /v1/products
│   │   ├── cms.routes.ts               # /v1/cms
│   │   ├── admin-cms.routes.ts         # /v1/platform/admin (CMS management)
│   │   ├── auth.routes.ts              # /cvault/v1/auth
│   │   ├── device.routes.ts            # /cvault/v1/devices
│   │   ├── vpn.routes.ts               # /cvault/v1/vpn
│   │   └── license.routes.ts           # /cvault/v1/licenses
│   ├── services/           # Business logic (auth, device, wireguard, license, cms…)
│   └── utils/
│       ├── prisma.ts       # Prisma client singleton
│       └── secrets.ts      # AWS Secrets Manager loader (production only)
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
| Database | PostgreSQL | 16 (Docker) |
| Cache / Queues | Redis | 7 (Docker) |
| Auth | `@fastify/jwt` (JWT RS/HS256) | — |
| Rate Limiting | `@fastify/rate-limit` | 1000 req / 15 min |
| CORS | `@fastify/cors` | — |
| API Docs | `@fastify/swagger` v8 + `@fastify/swagger-ui` v4 | Fastify 4–compatible |
| VPN | WireGuard | kernel module |
| Validation | Zod | 3.x |
| Process Manager | systemd | `cvault-backend.service` |
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
└── /cvault/v1  (CVault product)
    ├── /auth                       # CVault user auth
    ├── /devices                    # Device management
    ├── /vpn                        # VPN session management
    └── /licenses                   # License management
```

**Adding a new product:** register a new Fastify plugin in `src/index.ts`:
```typescript
await fastify.register(
  async (fastify) => {
    await fastify.register(lyraAuthRoutes,   { prefix: '/auth' });
    await fastify.register(lyraModelsRoutes, { prefix: '/models' });
  },
  { prefix: '/lyra/v1' }
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
| Provider | AWS Lightsail |
| Instance | `creovine-api-server` |
| Plan | `small_3_0` — 2 vCPU, 2 GB RAM, $12/mo |
| Region | `us-east-1a` |
| Static IP | `44.208.117.166` |
| OS | Ubuntu 24.04 LTS |
| SSH user | `ubuntu` |
| SSH key | `~/.ssh/creovine_lightsail` |
| App directory | `/opt/cvault-backend/` |
| Systemd service | `cvault-backend.service` |

**Open ports (Lightsail firewall):**
| Port | Protocol | Purpose |
|---|---|---|
| 22 | TCP | SSH |
| 80 | TCP | HTTP (nginx → HTTPS redirect) |
| 443 | TCP | HTTPS (nginx → app:3000) |
| 3000 | TCP | App direct (internal only) |
| 51820 | UDP | WireGuard VPN |

**Running services:**
```
cvault-backend.service    # Node.js API (systemd, auto-restart)
wg-quick@wg0.service      # WireGuard VPN server
nginx.service             # Reverse proxy + SSL termination
cvault-postgres (Docker)  # PostgreSQL 16
cvault-redis    (Docker)  # Redis 7
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
| Lightsail | Production API server |
| Secrets Manager | Stores all production secrets (3 paths) |
| IAM | User `creovine-admin`, policies for Secrets Manager |

**AWS Account:** `814322375061` (`support@creovine.com`)  
**IAM User:** `creovine-admin`  
**Default CLI region:** `us-east-1`

---

### 4.3 Secrets Management

Production secrets are **not stored in `.env` files on the server** — they are loaded from **AWS Secrets Manager** at startup via `src/utils/secrets.ts`. In local development this is a no-op and a local `.env` file is used instead.

**Secret paths in AWS Secrets Manager (`us-east-1`):**

| Path | Contains |
|---|---|
| `/creovine/shared` | `JWT_SECRET`, `DATABASE_URL` |
| `/creovine/api` | `CORS_ORIGIN`, `ADMIN_SECRET_KEY`, `GOOGLE_CLIENT_ID`, `SENDGRID_API_KEY`, `STRIPE_SECRET_KEY` |
| `/cvault` | `WG_SERVER_IP`, `WG_SERVER_PORT`, `WG_SERVER_PUBLIC_KEY`, `WG_SERVER_SSH_HOST`, `WG_SERVER_SSH_PORT`, `WG_SERVER_SSH_USER`, `WG_SERVER_SSH_KEY_PATH`, `ADMIN_ENCRYPTION_KEY`, `ENCRYPTION_KEY` |

**Startup sequence:**
```
loadSecretsFromAWS()   →   AWS Secrets Manager (production)
                       →   no-op, uses .env          (development)
```

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

## 7. Lyra AI

> **Status: Planned — not yet built.**

Lyra AI will be a Creovine platform product focused on voice and language AI.

**Planned route prefix:** `/lyra/v1`

**Known requirements so far:**
- Separate product route group in `creovine-api`
- Tenant API key auth (same pattern as CVault)
- Will share the platform auth, license, and product catalog systems

*This section will be fully expanded when Lyra AI development begins.*

---

## 8. Adding a New Product

Follow this checklist when adding a new product to the Creovine platform:

### 8.1 Backend (in `creovine-api`)

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

### 8.2 Product Catalog

1. Create a `Product` record in the database with the new product's `slug`, `name`, `type`, `status`
2. Add features, plans, and docs via admin CMS routes or seed script

### 8.3 Product Client Repo

Create a new repo under `Creovine-Labs` (e.g. `Creovine-Labs/lyra`).  
Structure it similar to `cvault/`:
```
lyra/
├── desktop-client/   (or mobile, extension, etc.)
├── sdk-js/
└── web-demo/
```

### 8.4 Update this document

Add a new section to this file (see section 6 as template) covering:
- Product overview
- Auth pattern
- All endpoints (method, path, auth, body, response)
- Client details

---

## 9. Development Setup

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

# Start local PostgreSQL and Redis
docker run -d --name local-postgres \
  -e POSTGRES_USER=cvault \
  -e POSTGRES_PASSWORD=cvault_secure_pass_2024 \
  -e POSTGRES_DB=cvault_db \
  -p 5432:5432 postgres:16-alpine

docker run -d --name local-redis -p 6379:6379 redis:7-alpine

# Create .env (copy from a team member or AWS Secrets in dev)
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, etc.

# Run migrations and generate Prisma client
npx prisma migrate dev
npx prisma generate

# Start dev server (with hot-reload)
npm run dev

# API available at http://localhost:3000
# Docs at http://localhost:3000/docs
```

### Deploying to production

```bash
# On your local machine — sync code to server
rsync -az --exclude='node_modules' --exclude='.git' --exclude='dist' \
  -e "ssh -i ~/.ssh/creovine_lightsail" \
  ./ ubuntu@44.208.117.166:/opt/cvault-backend/

# On the server
ssh -i ~/.ssh/creovine_lightsail ubuntu@44.208.117.166
cd /opt/cvault-backend
npm install
npx prisma generate
npm run build
sudo systemctl restart cvault-backend
```

---

## 10. Environment Variables Reference

These are the variables used by the backend. In **development** they come from `.env`. In **production** they are loaded from AWS Secrets Manager.

| Variable | Source (AWS path) | Description |
|---|---|---|
| `DATABASE_URL` | `/creovine/shared` | PostgreSQL connection string |
| `JWT_SECRET` | `/creovine/shared` | JWT signing secret |
| `CORS_ORIGIN` | `/creovine/api` | Comma-separated allowed origins |
| `ADMIN_SECRET_KEY` | `/creovine/api` | Admin API key for license management |
| `GOOGLE_CLIENT_ID` | `/creovine/api` | Google OAuth client ID |
| `SENDGRID_API_KEY` | `/creovine/api` | Email delivery |
| `STRIPE_SECRET_KEY` | `/creovine/api` | Payments (planned) |
| `WG_SERVER_IP` | `/cvault` | WireGuard server public IP |
| `WG_SERVER_PORT` | `/cvault` | WireGuard listen port (51820) |
| `WG_SERVER_PUBLIC_KEY` | `/cvault` | WireGuard server public key |
| `WG_SERVER_SSH_HOST` | `/cvault` | SSH host for WireGuard config management (127.0.0.1 on server itself) |
| `WG_SERVER_SSH_PORT` | `/cvault` | SSH port (22) |
| `WG_SERVER_SSH_USER` | `/cvault` | SSH user (`ubuntu`) |
| `WG_SERVER_SSH_KEY_PATH` | `/cvault` | SSH key path (`/home/ubuntu/.ssh/id_rsa`) |
| `ENCRYPTION_KEY` | `/cvault` | Device private key encryption key |
| `ADMIN_ENCRYPTION_KEY` | `/cvault` | Admin-level encryption key |
| `PORT` | `.env` only | Server port (default: 3000) |
| `NODE_ENV` | `.env` only | `development` or `production` |

> **Never commit actual secret values to Git.** Use `.env` locally and AWS Secrets Manager in production. The `.env` file is in `.gitignore`.

---

*Last updated: February 27, 2026*  
*Maintainer: Creovine Labs — support@creovine.com*
