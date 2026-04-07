---
sidebar_position: 1
title: Authentication
description: CVault authentication API.
---

# CVault Authentication API

**Base URL:** `https://api.creovine.com/cvault/v1/auth`

CVault uses the shared platform authentication system. All endpoints require `X-API-Key`.

## Endpoints

### Register

```http
POST /cvault/v1/auth/register
X-API-Key: <tenant-api-key>

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Login

```http
POST /cvault/v1/auth/login
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
  "accessToken": "<jwt>"
}
```

### Google OAuth

```http
POST /cvault/v1/auth/google
X-API-Key: <tenant-api-key>

{
  "idToken": "<google-id-token>"
}
```

## Authentication Flow

1. Register or login to receive a JWT `accessToken`
2. Include both `X-API-Key` and `Authorization: Bearer <jwt>` in subsequent requests
3. Use refresh tokens to obtain new access tokens when expired
