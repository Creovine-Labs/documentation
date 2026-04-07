---
sidebar_position: 2
title: Quickstart
description: Get started with CVault VPN in 5 minutes.
---

# CVault Quickstart

Connect your first VPN session in 5 minutes.

## Prerequisites

- A Creovine account with a tenant API key
- A valid CVault license key

## 1. Register a User

```bash
curl -X POST https://api.creovine.com/cvault/v1/auth/register \
  -H "X-API-Key: YOUR_TENANT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword"}'
```

## 2. Login

```bash
curl -X POST https://api.creovine.com/cvault/v1/auth/login \
  -H "X-API-Key: YOUR_TENANT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword"}'
```

Save the `accessToken` from the response.

## 3. Register a Device

```bash
curl -X POST https://api.creovine.com/cvault/v1/devices \
  -H "X-API-Key: YOUR_TENANT_KEY" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deviceName":"My MacBook","deviceType":"macOS"}'
```

Response includes the WireGuard config and assigned VPN IP.

## 4. Download Config

```bash
curl https://api.creovine.com/cvault/v1/devices/DEVICE_ID/config \
  -H "X-API-Key: YOUR_TENANT_KEY" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Import the `.conf` file into your WireGuard client.

## 5. Connect

```bash
curl -X POST https://api.creovine.com/cvault/v1/vpn/connect \
  -H "X-API-Key: YOUR_TENANT_KEY" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"DEVICE_ID"}'
```

Your VPN session is now active.

## Next Steps

- [How It Works →](/cvault/how-it-works) — end-to-end architecture
- [SDK →](/cvault/sdk) — JavaScript/TypeScript integration
- [Desktop App →](/cvault/desktop-app) — Flutter desktop client
