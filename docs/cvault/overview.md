---
sidebar_position: 1
title: Overview
description: CVault — white-label WireGuard VPN-as-a-Service.
---

# CVault VPN

**CVault** is a white-label **WireGuard VPN-as-a-Service** platform. B2B tenants embed CVault into their own apps using the SDK, desktop app, or REST API.

## What It Does

- WireGuard key generation (server-side)
- Device registration and peer management
- VPN session tracking with license enforcement
- IP pool management (`10.8.0.0/16` subnet)
- White-label configuration per tenant

## Status

| Property | Value |
|:---|:---|
| **Status** | Live |
| **Route prefix** | `/cvault/v1` |
| **Platforms** | macOS (available), Windows/Android/iOS (coming soon) |
| **Protocol** | WireGuard (ChaCha20-Poly1305, 256-bit encryption) |

## Plans

| Plan | Features |
|:---|:---|
| **Trial** | Free — 5 sessions |
| **Starter** | $9/mo — higher connection cap |
| **Pro** | $29/mo — unlimited connections |
| **Enterprise** | Custom — dedicated support + SLA |

## Clients

| Client | Stack | Description |
|:---|:---|:---|
| **Desktop App** | Flutter (macOS, Windows) | Native WireGuard management |
| **JS/TS SDK** | TypeScript npm package | `@creovine/cvault-sdk` |
| **Web Demo** | Vite + React | Reference implementation |

## Quick Links

- [Quickstart →](/cvault/quickstart)
- [How It Works →](/cvault/how-it-works)
- [API Reference →](/api/cvault/auth)
- [SDK →](/cvault/sdk)
