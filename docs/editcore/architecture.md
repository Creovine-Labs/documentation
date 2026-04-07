---
sidebar_position: 5
title: Architecture
description: EditCore internal architecture and platform bridge.
---

# Architecture

EditCore follows a layered architecture with platform-specific native code bridged through Flutter's platform channel system.

## Architecture Diagram

```
┌────────────────────────────────────────────┐
│          HOST APPLICATION                  │
├────────────────────────────────────────────┤
│      PUBLIC API  (EditCore class)          │
├────────────────────────────────────────────┤
│         LICENSING LAYER                    │  ← validates ECK- key
├───────────────┬────────────────────────────┤
│   UI LAYER    │   CORE ENGINE LAYER        │
├───────────────┴────────────────────────────┤
│            EXPORT LAYER                    │
├────────────────────────────────────────────┤
│        PLATFORM CHANNEL BRIDGE             │
├──────────────────┬─────────────────────────┤
│   iOS (Swift)    │   Android (Kotlin)      │
│   AVFoundation   │   MediaCodec            │
│   CoreImage      │   ExoPlayer             │
└──────────────────┴─────────────────────────┘
```

## Layers

### Public API
The `EditCore` class is the single entry point. Exposes `initialize()`, `openEditor()`, `getLicenseTier()`, and `isFeatureEnabled()`.

### Licensing Layer
Validates the `ECK-` prefixed API key against the Creovine platform API. License state is cached locally using `flutter_secure_storage` to reduce network calls.

### UI Layer
Full-screen editor interface built in Flutter with Provider state management. Includes timeline, filter panel, text overlay editor, crop overlay, and export progress indicator.

### Core Engine Layer
Coordinates editing operations — applies filters, manages text overlays, computes crop regions, and prepares the export pipeline.

### Export Layer
Hardware-accelerated video export with real-time progress streaming back to the UI layer.

### Platform Channel Bridge
Bridges Dart code to native platform implementations:

| Platform | Video Decode | Filters | Export |
|:---|:---|:---|:---|
| **iOS** | AVFoundation | CoreImage (CIFilter) | AVAssetExportSession |
| **Android** | ExoPlayer | MediaCodec shaders | MediaCodec encoder |
