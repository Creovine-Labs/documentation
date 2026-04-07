---
sidebar_position: 4
title: Configuration
description: EditCoreConfig and ExportConfig options reference.
---

# Configuration

EditCore is configured through `EditCoreConfig` and `ExportConfig` objects passed to `openEditor()`.

## EditCoreConfig

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `enableFilters` | `bool` | `true` | Show filter panel |
| `enableTextOverlay` | `bool` | `true` | Enable text overlay tool |
| `enableWatermark` | `bool` | `false` | Show watermark tool |
| `enableTrim` | `bool` | `true` | Enable trim handles |
| `enableCrop` | `bool` | `true` | Enable crop tool |
| `allowCancel` | `bool` | `true` | Show cancel button |
| `exportConfig` | `ExportConfig` | default | Export settings |

### Example

```dart
EditCoreConfig(
  enableFilters: true,
  enableTextOverlay: true,
  enableWatermark: false,
  enableTrim: true,
  enableCrop: true,
  allowCancel: true,
  exportConfig: ExportConfig(
    resolution: ExportResolution.fhd1080p,
    format: ExportFormat.mp4,
  ),
)
```

## ExportConfig

| Property | Type | Options |
|:---|:---|:---|
| `resolution` | `ExportResolution` | `sd480p`, `hd720p`, `fhd1080p` (default), `uhd4k`, `original` |
| `format` | `ExportFormat` | `mp4` (default) |
| `bitrate` | `int?` | Optional bitrate override in bps |

## EditResult

The result returned from `openEditor()`:

| Property | Type | Description |
|:---|:---|:---|
| `success` | `bool` | Whether export completed successfully |
| `outputPath` | `String?` | Path to the exported video file |
| `durationMs` | `int?` | Duration of the exported video in milliseconds |
| `fileSizeBytes` | `int?` | File size of the exported video |

## Feature Gating

Features are gated by license tier. Check availability at runtime:

```dart
bool enabled = await EditCore.isFeatureEnabled(EditCoreFeature.filters);
```

See [Licensing](/editcore/licensing) for tier details.
