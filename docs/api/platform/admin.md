---
sidebar_position: 2
title: Admin
description: Platform admin API — tenants, API keys, and user management.
---

# Admin API

**Base URL:** `https://api.creovine.com/admin`

All admin endpoints require `X-Admin-Key` header.

## Tenant Management

### Create Tenant

```http
POST /admin/tenants
X-Admin-Key: <admin-secret>

{
  "name": "Acme Corp",
  "slug": "acme",
  "contactEmail": "admin@acme.com"
}
```

### List Tenants

```http
GET /admin/tenants
X-Admin-Key: <admin-secret>
```

### Get Tenant

```http
GET /admin/tenants/:tenantId
X-Admin-Key: <admin-secret>
```

## API Key Management

### Generate API Key

```http
POST /admin/tenants/:tenantId/api-keys
X-Admin-Key: <admin-secret>

{
  "name": "Production Key",
  "products": ["cvault-vpn", "lira-ai"]
}
```

**Response**:
```json
{
  "apiKey": {
    "id": "uuid",
    "key": "crv_...",
    "name": "Production Key",
    "products": ["cvault-vpn", "lira-ai"],
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

### List API Keys

```http
GET /admin/tenants/:tenantId/api-keys
X-Admin-Key: <admin-secret>
```

### Revoke API Key

```http
DELETE /admin/tenants/:tenantId/api-keys/:keyId
X-Admin-Key: <admin-secret>
```

## User Management

### List Users

```http
GET /admin/users
X-Admin-Key: <admin-secret>
```

Query parameters: `?tenantId=`, `?email=`, `?page=`, `?limit=`
