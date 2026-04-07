---
sidebar_position: 4
title: Devices
description: Device registration and management for CVault VPN.
---

# Devices

Each CVault user can register up to `maxDevicesPerUser` (default: 5) devices. Each device gets a unique WireGuard keypair and VPN IP.

## Register a Device

```bash
POST /cvault/v1/devices
```

**Headers**: `X-API-Key`, `Authorization: Bearer <jwt>`

```json
{
  "deviceName": "My MacBook",
  "deviceType": "macOS"
}
```

**Supported device types**: `iOS`, `Android`, `Windows`, `macOS`, `Linux`

**Response:**
```json
{
  "device": {
    "id": "uuid",
    "deviceName": "My MacBook",
    "assignedIp": "10.8.0.5",
    "publicKey": "...",
    "status": "ACTIVE"
  },
  "config": "[Interface]\nAddress = 10.8.0.5/16\n..."
}
```

## List Devices

```bash
GET /cvault/v1/devices
```

Returns all devices for the authenticated user.

## Download Config

```bash
GET /cvault/v1/devices/:deviceId/config
```

Returns the WireGuard `.conf` file for the specified device.

## Revoke Device

```bash
DELETE /cvault/v1/devices/:deviceId
```

Removes the device from the WireGuard server and marks it as `REVOKED`.

## Device Lifecycle

```
ACTIVE → REVOKED (on delete)
```

Revoked devices cannot reconnect. A new device must be registered to replace it.
