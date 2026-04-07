---
sidebar_position: 1
title: Overview
description: Creovine production infrastructure — EC2, RDS, nginx, systemd.
---

# Infrastructure Overview

The Creovine platform runs on AWS in `us-east-1`.

## Production Server

| Property | Value |
|:---|:---|
| **Provider** | AWS EC2 |
| **Instance type** | `t3.small` — 2 vCPU, 2 GB RAM |
| **Region** | `us-east-1a` |
| **Elastic IP** | `98.92.255.171` |
| **OS** | Ubuntu 22.04 LTS |
| **App directory** | `/opt/creovine-api/` |
| **Systemd service** | `creovine-api.service` |
| **IAM role** | `creovine-api-profile` |

## Security Group (`creovine-api-sg`)

| Port | Protocol | Purpose |
|:---|:---|:---|
| 22 | TCP | SSH |
| 80 | TCP | HTTP → HTTPS redirect (nginx) |
| 443 | TCP | HTTPS → app:3000 (nginx) |

## Database

| Property | Value |
|:---|:---|
| **Provider** | AWS RDS |
| **Engine** | PostgreSQL 16.6 |
| **Instance class** | `db.t4g.micro` |
| **DB name** | `creovine` |
| **Security group** | `creovine-rds-sg` (port 5432 from EC2 only — not public) |

## Running Services

```bash
creovine-api.service   # Node.js API (systemd, auto-restart)
nginx.service          # Reverse proxy + SSL + WebSocket upgrade
```

## WireGuard Server

| Property | Value |
|:---|:---|
| **Interface** | `wg0` |
| **Subnet** | `10.8.0.0/16` |
| **Listen port** | `51820/UDP` |
| **Server VPN IP** | `10.8.0.1` |

## Domain Routing

| Domain | Target |
|:---|:---|
| `api.creovine.com` | EC2 Elastic IP → nginx → Fastify:3000 |
| `creovine.com` | Vercel |
| `console.creovine.com` | Vercel (same Next.js app, host-based routing) |
| `lira.creovine.com` | Vercel (Lira AI React frontend) |
