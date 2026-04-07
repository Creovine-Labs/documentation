---
slug: /api/authentication
sidebar_position: 2
title: Authentication API
---

# Authentication API

Lira uses JWT-based authentication with a 7-day token expiry. There are two auth paths: **Platform Auth** (for the web app) and **Legacy Auth** (API-key gated, internal use).

## Platform Auth

All platform auth routes are under `/v1/auth`.

### Register

#### `POST /v1/auth/register`

Create a new account with email and password.

| Field | Type | Required | Validation |
|:---|:---|:---|:---|
| `email` | string | Yes | Valid email |
| `password` | string | Yes | 8–128 characters |
| `name` | string | Yes | 1–100 characters |
| `company` | string | No | — |

```bash
curl -X POST https://api.creovine.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@acme.com",
    "password": "securePass123!",
    "name": "Sarah Chen",
    "company": "Acme Corp"
  }'
```

### Login

#### `POST /v1/auth/login`

Authenticate with email and password.

```bash
curl -X POST https://api.creovine.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@acme.com",
    "password": "securePass123!"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "usr_abc123",
      "email": "sarah@acme.com",
      "name": "Sarah Chen"
    }
  }
}
```

### Google Sign-In

#### `POST /v1/auth/google`

Exchange a Google Sign-In ID token for a Lira JWT. No prior registration required — the account is created automatically on first login.

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `credential` | string | Yes | Google Sign-In ID token (minimum 1 character) |

```bash
curl -X POST https://api.creovine.com/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{ "credential": "eyJhbGciOiJSUzI1NiIs..." }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "usr_abc123",
      "email": "sarah@acme.com",
      "name": "Sarah Chen",
      "picture": "https://lh3.googleusercontent.com/..."
    }
  }
}
```

### Get Current User

#### `GET /v1/auth/me`

Returns the authenticated user's profile. Requires JWT in the `Authorization` header.

```bash
curl https://api.creovine.com/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

## JWT Token

The JWT payload contains:

```json
{
  "sub": "usr_abc123",
  "email": "sarah@acme.com",
  "name": "Sarah Chen",
  "orgs": ["org_xyz789"],
  "iat": 1711711200,
  "exp": 1712316000
}
```

Tokens expire after **7 days**. After expiry, the user must re-authenticate.

## Using the Token

Include the JWT in every API request via the `Authorization` header:

```bash
curl -X GET https://api.creovine.com/lira/v1/meetings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

If the token is missing, expired, or invalid, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

## Legacy Auth

These routes require an API key header instead of (or in addition to) JWT. They are used internally and not recommended for new integrations.

| Method | Path | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/register` | API key | Register (email + password, 8–128 chars) |
| `POST` | `/login` | API key | Login (email + password) |
| `GET` | `/me` | JWT + API key | Get current user |
