---
sidebar_position: 3
title: Authentication
description: Three-layer authentication model — API keys, JWT tokens, and admin keys.
---

# Authentication

The Creovine platform uses **three authentication layers** depending on the request context.

## 1. Tenant API Key (`X-API-Key`)

Each business customer (tenant) receives a unique `apiKey` at signup. This key is required on all CVault product routes and identifies which tenant the request belongs to.

```bash
curl -H "X-API-Key: YOUR_TENANT_KEY" \
  https://api.creovine.com/cvault/v1/auth/login \
  -d '{"email":"user@example.com","password":"secret"}'
```

**Middleware**: `apiKeyAuth` in `middleware/auth.middleware.ts` — validates the key and injects `request.tenant`.

## 2. JWT Bearer Token (`Authorization: Bearer`)

Issued at login/register and required on all authenticated user routes.

```bash
curl -H "Authorization: Bearer <jwt>" \
  https://api.creovine.com/lira/v1/meetings
```

| Property | Value |
|:---|:---|
| **Payload** | `{ userId, tenantId, email, role }` |
| **Expiry** | 7 days (platform users) |
| **Signing** | `@fastify/jwt` with `JWT_SECRET` from Secrets Manager |

**Role-based middleware**:
- `fullAuth` — API key + JWT verify
- `platformAdminAuth` — requires `role >= ADMIN`
- `superAdminAuth` — requires `role = SUPER_ADMIN`

## 3. Admin Key (`X-Admin-Key`)

Used for license administration (create, list, revoke). Stored as `ADMIN_SECRET_KEY` environment variable.

```bash
curl -H "X-Admin-Key: YOUR_ADMIN_KEY" \
  https://api.creovine.com/cvault/v1/licenses
```

## Authentication by Product

| Product | Required Headers |
|:---|:---|
| **Platform Auth** (`/v1/auth`) | None (public) |
| **Platform Admin** (`/v1/platform/admin`) | `Bearer JWT` (ADMIN+ role) |
| **CVault** (`/cvault/v1`) | `X-API-Key` + `Bearer JWT` |
| **CVault Licenses** (admin) | `X-Admin-Key` |
| **Lira AI** (`/lira/v1`) | `Bearer JWT` |
| **EditCore** | `ECK-` prefixed API key (license validation only) |

## Google OAuth

The platform supports Google Sign-In via ID token verification:

```bash
POST /v1/auth/google
Content-Type: application/json

{"credential": "<google-id-token>"}
```

:::info Dual Google OAuth (Lira AI)
Lira AI uses **two separate Google client IDs**: one for app login (`GOOGLE_LOGIN_CLIENT_ID`) and one for Calendar/Drive integration scopes (`GOOGLE_CLIENT_ID`). `getAllowedAudiences()` accepts tokens from both.
:::

## Security Summary

| Header | Purpose |
|:---|:---|
| `X-API-Key` | Tenant identification (CVault routes) |
| `Authorization: Bearer <jwt>` | User authentication (all protected routes) |
| `X-Admin-Key` | License admin operations |
