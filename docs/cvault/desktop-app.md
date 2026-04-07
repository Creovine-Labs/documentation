---
sidebar_position: 8
title: Desktop App
description: CVault Flutter desktop client for macOS and Windows.
---

# Desktop App

The CVault desktop app is a native Flutter application for macOS and Windows.

## Supported Platforms

| Platform | Status |
|:---|:---|
| **macOS** | Available |
| **Windows** | Coming soon |
| **Android** | Coming soon |
| **iOS** | Coming soon |

## macOS Installation

1. Download the latest `.dmg` from the [Creovine Console](https://console.creovine.com/dashboard/downloads)
2. Drag CVault to your Applications folder
3. On first launch, macOS may show "Developer Not Known":
   - Open **System Preferences → Privacy & Security**
   - Click **Open Anyway** next to the CVault warning
   - Alternatively: right-click the app → **Open** → **Open**

## Features

| Feature | Description |
|:---|:---|
| **One-click connect** | Connect to VPN with a single button |
| **Server selection** | Choose from available VPN servers |
| **Session management** | View active sessions and connection time |
| **Device management** | Register/revoke devices from the app |
| **Auto-connect** | Reconnect on startup (configurable) |
| **Kill switch** | Block traffic if VPN drops |

## Architecture

The desktop app communicates with the Creovine API via REST:

```
Flutter App → HTTP → api.creovine.com/cvault/v1 → WireGuard Server
```

WireGuard process management is handled natively on each platform.
