---
sidebar_position: 1
title: Authentication
description: Platform authentication API — register, login, refresh tokens.
---

# Authentication API

**Base URL:** `https://api.creovine.com/auth`

All endpoints require `X-API-Key` header (tenant API key) unless noted otherwise.

## Endpoints

### Register

```http
POST /auth/register
X-API-Key: <tenant-api-key>

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** `201 Created`:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "<jwt>",
  "refreshToken": "<refresh-token>"
}
```

### Login

```http
POST /auth/login
X-API-Key: <tenant-api-key>

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** `200 OK`:
```json
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "accessToken": "<jwt>",
  "refreshToken": "<refresh-token>"
}
```

### Google OAuth Login

```http
POST /auth/google
X-API-Key: <tenant-api-key>

{
  "idToken": "<google-id-token>"
}
```

### Refresh Token

```http
POST /auth/refresh
X-API-Key: <tenant-api-key>

{
  "refreshToken": "<refresh-token>"
}
```

**Response** `200 OK`:
```json
{
  "accessToken": "<jwt>"
}
```

## Authentication Headers

All authenticated requests require:

| Header | Description |
|:---|:---|
| `X-API-Key` | Tenant API key (identifies the product/tenant) |
| `Authorization` | `Bearer <jwt>` (obtained from login/register) |
