---
sidebar_position: 5
title: VPN Sessions
description: Managing VPN connections — connect, disconnect, and status.
---

# VPN Sessions

## Connect

```bash
POST /cvault/v1/vpn/connect
```

**Headers**: `X-API-Key`, `Authorization: Bearer <jwt>`

```json
{"deviceId": "uuid"}
```

:::warning License Required
This endpoint requires `licenseCheck` middleware. The user must have a valid, non-expired license with remaining uses. Returns `402 Payment Required` if no valid license exists.
:::

**Response:**
```json
{
  "sessionId": "uuid",
  "status": "connected",
  "connectedAt": "2026-03-29T10:00:00Z",
  "message": "VPN connection established"
}
```

## Disconnect

```bash
POST /cvault/v1/vpn/disconnect
```

```json
{"deviceId": "uuid"}
```

## Status

```bash
GET /cvault/v1/vpn/status
```

Returns all active sessions for the authenticated user:

```json
{
  "activeSessions": [
    {
      "sessionId": "uuid",
      "connectedAt": "2026-03-29T10:00:00Z",
      "device": {
        "id": "uuid",
        "deviceName": "My MacBook",
        "assignedIp": "10.8.0.5"
      },
      "server": {
        "publicIp": "98.92.255.171",
        "region": "us-east-1"
      }
    }
  ],
  "totalActive": 1
}
```
