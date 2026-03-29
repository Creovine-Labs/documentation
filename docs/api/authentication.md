---
slug: /api/authentication
sidebar_position: 2
title: Authentication API
---

# Authentication API

## Google Sign-In

### `POST /auth/google`

Exchange a Google ID token for a Lira JWT.

**Request Body:**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "usr_abc123",
      "email": "user@example.com",
      "name": "John Smith",
      "picture": "https://lh3.googleusercontent.com/..."
    }
  }
}
```

## JWT Structure

The JWT payload contains:

```json
{
  "sub": "usr_abc123",
  "email": "user@example.com",
  "name": "John Smith",
  "orgs": ["org_xyz789"],
  "iat": 1711711200,
  "exp": 1711797600
}
```

## Using the Token

Include in every API request:

```bash
curl -X GET https://api.creovine.com/lira/v1/meetings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```
