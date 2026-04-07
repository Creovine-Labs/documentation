---
sidebar_position: 7
title: SDK
description: CVault JavaScript/TypeScript SDK for programmatic VPN management.
---

# CVault SDK

The JavaScript/TypeScript SDK provides a high-level client for the CVault API.

## Installation

```bash
npm install @creovine/cvault-sdk
```

## Usage

```typescript
import { CVaultClient } from '@creovine/cvault-sdk';

const client = new CVaultClient({
  apiKey: 'YOUR_TENANT_API_KEY',
  baseUrl: 'https://api.creovine.com',
});

// Authenticate
await client.auth.login({ email: 'user@example.com', password: 'secret' });

// List devices
const devices = await client.devices.list();

// Get WireGuard config
const config = await client.devices.getConfig(deviceId);

// Connect VPN
await client.vpn.connect({ deviceId, licenseKey: 'cvlt_pro_abc123' });

// Check status
const status = await client.vpn.status();

// Disconnect
await client.vpn.disconnect({ deviceId });
```

## SDK Methods

### `client.auth`

| Method | Description |
|:---|:---|
| `.register({ email, password })` | Register a new user |
| `.login({ email, password })` | Login and store token |
| `.me()` | Get current user profile |

### `client.devices`

| Method | Description |
|:---|:---|
| `.create({ deviceName, deviceType? })` | Register a new device |
| `.list()` | List user's devices |
| `.getConfig(deviceId)` | Download WireGuard config |
| `.delete(deviceId)` | Revoke a device |

### `client.vpn`

| Method | Description |
|:---|:---|
| `.connect({ deviceId, licenseKey? })` | Start VPN session |
| `.disconnect({ deviceId })` | End VPN session |
| `.status()` | Get active sessions |

## Flutter SDK

For the Flutter desktop client, CVault uses direct REST calls via the `http` package. See the [Desktop App](/cvault/desktop-app) docs.
