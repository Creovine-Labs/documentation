---
sidebar_position: 1
title: Overview
description: EditCore — professional video editing plugin for Flutter.
---

# EditCore

<span class="badge badge--dev">In Development</span>

**EditCore** is a drop-in Flutter plugin that embeds a professional-grade video editor directly into iOS and Android apps. A single `EditCore.openEditor()` call presents a full-screen editor UI with trim, crop, filters, text overlays, watermarks, and hardware-accelerated export.

## Key Features

| Feature | Description | Status |
|:---|:---|:---|
| **Trim** | Millisecond-level trimming with visual handles | ✅ v0.1 |
| **Crop** | Normalized crop rectangles with live preview | ✅ v0.1 |
| **Filters** | 10 built-in CIFilter/shader effects | ✅ v0.1 |
| **Text Overlays** | Customizable fonts, colors, timing | ✅ v0.1 |
| **Watermarks** | Configurable position, opacity, scale | ✅ v0.1 |
| **Export** | Hardware-accelerated with progress streaming | ✅ v0.1 |
| **Licensing** | Remote validation + tier feature gating | ✅ v0.1 |
| Cloud rendering | — | 🔜 Planned |
| AI tools | Auto-cut, scene detection | 🔜 Planned |
| Auto-captions | — | 🔜 Planned |

**Built-in filters:** None, Mono, Fade, Chrome, Noir, Instant, Vivid, Warmth, Cool, Drama

## Tech Stack

| Layer | Technology |
|:---|:---|
| Language | Dart / Flutter 3.10+ |
| iOS native | Swift — AVFoundation, CoreImage |
| Android native | Kotlin — MediaCodec, ExoPlayer |
| State management | Provider |
| License validation | HTTP → Creovine platform API |
| Secure storage | `flutter_secure_storage` |
| Version | `0.1.0` |
| Package name | `creovine_editcore` |

## Platform Requirements

| Platform | Minimum |
|:---|:---|
| iOS | 13.0+ |
| Android | API 21+ (Android 5.0) |
| Flutter | 3.10+ |
| Dart | 3.0+ |

:::info No Backend Routes
EditCore does **not** add routes to `creovine-api`. It communicates with the platform only for license validation using an `ECK-` prefixed API key.
:::
