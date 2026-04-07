---
sidebar_position: 4
title: Licenses
description: CVault license management API.
---

# CVault Licenses API

**Base URL:** `https://api.creovine.com/cvault/v1/licenses`

Admin endpoints require `X-Admin-Key`. Public validate requires `X-API-Key`.

## Admin Endpoints

### Create License

```http
POST /cvault/v1/licenses
X-Admin-Key: <admin-secret>

{
  "tenantId": "uuid",
  "product": "cvault-vpn",
  "plan": "TRIAL",
  "maxUses": 5,
  "expiresAt": "2026-12-31T00:00:00Z"
}
```

### List Licenses

```http
GET /cvault/v1/licenses?tenantId=&product=&plan=&status=
X-Admin-Key: <admin-secret>
```

### Get License

```http
GET /cvault/v1/licenses/:key
X-Admin-Key: <admin-secret>
```

### Revoke License

```http
POST /cvault/v1/licenses/:key/revoke
X-Admin-Key: <admin-secret>
```

## Public Endpoints

### Validate License

Used by the SDK before establishing a VPN connection.

```http
POST /cvault/v1/licenses/validate
X-API-Key: <tenant-api-key>

{
  "licenseKey": "cvault-xxxxx-xxxxx"
}
```

**Response** `200 OK`:
```json
{
  "valid": true,
  "plan": "PRO",
  "usesRemaining": null
}
```

## License Plans

| Plan | Description |
|:---|:---|
| `TRIAL` | Limited uses (default: 5 connections) |
| `STARTER` | Higher connection cap |
| `PRO` | Unlimited connections |
| `ENTERPRISE` | Unlimited + custom config + SLA |
