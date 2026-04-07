---
sidebar_position: 3
title: Features
description: Detailed guide to EditCore's editing features.
---

# Features

EditCore provides a complete set of video editing tools accessible through a single full-screen editor UI.

## Trim

Millisecond-level trimming with visual drag handles. Users can precisely set in/out points on the video timeline.

## Crop

Normalized crop rectangles with live preview. Supports freeform cropping with real-time visual feedback.

## Filters

10 built-in filter effects powered by CIFilter (iOS) and shader effects (Android):

| Filter | Description |
|:---|:---|
| None | No effect (original) |
| Mono | Black and white |
| Fade | Faded vintage look |
| Chrome | High-contrast chrome |
| Noir | Film noir |
| Instant | Instant camera look |
| Vivid | Boosted saturation |
| Warmth | Warm color cast |
| Cool | Cool color cast |
| Drama | High-contrast dramatic |

## Text Overlays

Add customizable text overlays with:

- Font selection
- Color picker
- Size adjustment
- Timing control (start/end time)
- Position dragging

## Watermarks

Configure watermarks with:

- **Position** — corner placement or custom coordinates
- **Opacity** — 0.0 to 1.0
- **Scale** — relative to video dimensions

:::note
On the **Free** tier, a forced "EditCore" watermark is applied. **Pro** and **Enterprise** tiers can customize or remove the watermark entirely.
:::

## Export

Hardware-accelerated export with real-time progress streaming:

```dart
final result = await EditCore.openEditor(
  context: context,
  videoPath: videoPath,
  config: EditCoreConfig(
    exportConfig: ExportConfig(
      resolution: ExportResolution.fhd1080p,
      format: ExportFormat.mp4,
    ),
  ),
);
```

### Export Resolutions

| Resolution | Value |
|:---|:---|
| 480p | `sd480p` |
| 720p | `hd720p` |
| 1080p (default) | `fhd1080p` |
| 4K | `uhd4k` |
| Original | `original` |

### Export Format

Currently supports **MP4** (`mp4`). Additional formats planned.
