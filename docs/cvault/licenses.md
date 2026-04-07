---
sidebar_position: 6
title: Licenses
description: License management — create, validate, and revoke CVault licenses.
---

# Licenses

Licenses gate VPN access by tier. Each license has a plan, usage counter, and optional expiry.

## License Plans

| Plan | Description | Max Uses |
|:---|:---|:---|
| `TRIAL` | Evaluation | 5 connections |
| `STARTER` | Small teams | Higher cap |
| `PRO` | Production | Unlimited |
| `ENTERPRISE` | Custom SLA | Unlimited + custom config |

## Validate License (SDK Use)

```bash
POST /cvault/v1/licenses/validate
```

**Headers**: `X-API-Key`

```json
{"key": "cvlt_pro_abc123"}
```

**Response:**
```json
{
  "valid": true,
  "plan": "PRO",
  "usesRemaining": null
}
```

## Admin Endpoints

Admin endpoints require the `X-Admin-Key` header.

| Method | Path | Description |
|:---|:---|:---|
| POST | `/cvault/v1/licenses` | Create a license |
| GET | `/cvault/v1/licenses` | List licenses (filter by tenantId, product, plan, status) |
| GET | `/cvault/v1/licenses/:key` | Get single license |
| POST | `/cvault/v1/licenses/:key/revoke` | Revoke a license |

**Create license:**
```json
{
  "tenantId": "uuid",
  "product": "cvault-vpn",
  "plan": "TRIAL",
  "maxUses": 5,
  "expiresAt": "2026-12-31T00:00:00Z"
}
```

## License Statuses

| Status | Description |
|:---|:---|
| `ACTIVE` | Valid and usable |
| `REVOKED` | Manually revoked by admin |
| `EXPIRED` | Past `expiresAt` date |

See [Licenses API Reference](/api/cvault/licenses) for full endpoint documentation.
