---
sidebar_position: 2
title: Devices
description: CVault device registration and management API.
---

# CVault Devices API

**Base URL:** `https://api.creovine.com/cvault/v1/devices`

All routes require `X-API-Key` + `Authorization: Bearer <jwt>`.

## Endpoints

### Register Device

```http
POST /cvault/v1/devices
Authorization: Bearer <jwt>
X-API-Key: <tenant-api-key>

{
  "deviceName": "My MacBook",
  "deviceType": "macOS"
}
```

Generates a WireGuard key pair and assigns a VPN IP address.

**Supported `deviceType` values:** `iOS`, `Android`, `Windows`, `macOS`, `Linux`

**Response** `201 Created`:
```json
{
  "device": {
    "id": "uuid",
    "deviceName": "My MacBook",
    "assignedIp": "10.8.0.X",
    "publicKey": "...",
    "status": "ACTIVE"
  },
  "config": "[Interface]\nAddress = 10.8.0.X/16\n..."
}
```

### List Devices

```http
GET /cvault/v1/devices
Authorization: Bearer <jwt>
X-API-Key: <tenant-api-key>
```

### Download WireGuard Config

```http
GET /cvault/v1/devices/:deviceId/config
Authorization: Bearer <jwt>
X-API-Key: <tenant-api-key>
```

**Response** — WireGuard `.conf` format:
```ini
[Interface]
Address = 10.8.0.X/16
PrivateKey = <device-private-key>
DNS = 1.1.1.1

[Peer]
PublicKey = ugJvPBwy++vfwEl31oGjoio5Vx2T+DLvdPqfcuzyRU8=
Endpoint = 44.208.117.166:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

### Revoke Device

```http
DELETE /cvault/v1/devices/:deviceId
Authorization: Bearer <jwt>
X-API-Key: <tenant-api-key>
```

Removes the device from the VPN server and revokes access.
