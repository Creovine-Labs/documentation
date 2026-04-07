---
sidebar_position: 3
title: How It Works
description: CVault end-to-end VPN architecture — from registration to connection.
---

# How It Works

## End-to-End Flow

```
1. Tenant registers → receives X-API-Key
2. User registers/logs in via /cvault/v1/auth → receives JWT
3. User registers a device → backend generates WireGuard keypair, assigns VPN IP, writes peer to server config
4. User calls /cvault/v1/vpn/connect → session created, license usage incremented
5. Device downloads .conf via /cvault/v1/devices/:id/config → imports into WireGuard client
6. Device connects directly to WireGuard server (UDP 51820) — kernel-level VPN, no backend involvement
```

## Architecture

```
┌──────────┐     HTTPS      ┌──────────────────┐     SSH      ┌──────────────┐
│  Client  │ ──────────────→ │  Creovine API    │ ──────────→  │  WireGuard   │
│  App/SDK │                 │  (Fastify)       │  (peer mgmt) │  Server      │
└──────────┘                 └──────────────────┘              └──────────────┘
      │                                                              │
      │                      UDP 51820                               │
      └──────────────────────────────────────────────────────────────┘
                          (encrypted VPN tunnel)
```

## WireGuard Configuration

When a device is registered, the backend:

1. Generates a WireGuard keypair (public + private key)
2. Assigns a VPN IP from the `10.8.0.0/16` pool
3. SSHs into the WireGuard server to add the peer
4. Returns a complete `.conf` file to the client

**Generated config format:**

```ini
[Interface]
Address = 10.8.0.X/16
PrivateKey = <device-private-key>
DNS = 1.1.1.1

[Peer]
PublicKey = ugJvPBwy++vfwEl31oGjoio5Vx2T+DLvdPqfcuzyRU8=
Endpoint = 98.92.255.171:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

## License Enforcement

The `/vpn/connect` endpoint runs `licenseCheck` middleware:
- Validates the user's license is `ACTIVE`
- Checks `maxUses` limit (if set)
- Increments `usedCount`
- Returns `402 Payment Required` if no valid license

## Security

| Property | Value |
|:---|:---|
| **Encryption** | WireGuard (ChaCha20-Poly1305, 256-bit) |
| **Key storage** | Device private keys encrypted with `ENCRYPTION_KEY` (AES-256) |
| **IP pool** | `10.8.0.0/16` (65,534 addressable devices) |
| **Zero logs** | No traffic logging — only session metadata (connect/disconnect times) |
