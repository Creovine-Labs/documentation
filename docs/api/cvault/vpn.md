---
sidebar_position: 3
title: VPN Sessions
description: CVault VPN connect, disconnect, and status API.
---

# CVault VPN API

**Base URL:** `https://api.creovine.com/cvault/v1/vpn`

All routes require `X-API-Key` + `Authorization: Bearer <jwt>`.

## Endpoints

### Connect

```http
POST /cvault/v1/vpn/connect
Authorization: Bearer <jwt>
X-API-Key: <tenant-api-key>

{
  "deviceId": "uuid"
}
```

:::warning License Required
`/vpn/connect` requires the `licenseCheck` middleware — the user must have a valid license or the request returns `402 Payment Required`.
:::

**Response** `200 OK`:
```json
{
  "sessionId": "uuid",
  "status": "connected",
  "connectedAt": "2026-01-01T00:00:00Z",
  "message": "VPN connection established"
}
```

### Disconnect

```http
POST /cvault/v1/vpn/disconnect
Authorization: Bearer <jwt>
X-API-Key: <tenant-api-key>

{
  "deviceId": "uuid"
}
```

### Status

```http
GET /cvault/v1/vpn/status
Authorization: Bearer <jwt>
X-API-Key: <tenant-api-key>
```

**Response** `200 OK`:
```json
{
  "activeSessions": [
    {
      "sessionId": "uuid",
      "connectedAt": "2026-01-01T00:00:00Z",
      "device": {
        "id": "uuid",
        "deviceName": "My MacBook",
        "assignedIp": "10.8.0.X"
      },
      "server": {
        "publicIp": "44.208.117.166",
        "region": "us-east-1"
      }
    }
  ],
  "totalActive": 1
}
```
