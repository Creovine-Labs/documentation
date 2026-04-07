---
sidebar_position: 6
title: Licensing
description: EditCore license tiers and feature gating.
---

# Licensing

EditCore uses a tiered licensing model. API keys are validated remotely against the Creovine platform with local caching for offline resilience.

## License Tiers

| Tier | Features | Use Case |
|:---|:---|:---|
| **Free** | Trim only, forced watermark | Evaluation / non-commercial |
| **Basic** | Trim, crop, text, filters | Small apps, startups |
| **Pro** | All features, no forced watermark | Commercial apps |
| **Enterprise** | Pro + custom watermark + metering | Large-scale deployments |

## Feature Availability by Tier

| Feature | Free | Basic | Pro | Enterprise |
|:---|:---:|:---:|:---:|:---:|
| Trim | ✅ | ✅ | ✅ | ✅ |
| Crop | ❌ | ✅ | ✅ | ✅ |
| Filters | ❌ | ✅ | ✅ | ✅ |
| Text Overlays | ❌ | ✅ | ✅ | ✅ |
| Watermark Tool | ❌ | ❌ | ✅ | ✅ |
| Custom Watermark | ❌ | ❌ | ❌ | ✅ |
| No Forced Watermark | ❌ | ❌ | ✅ | ✅ |
| Usage Metering | ❌ | ❌ | ❌ | ✅ |

## API Key Format

All EditCore API keys are prefixed with `ECK-`:

```
ECK-abc123def456...
```

## Runtime Validation

```dart
// Check current tier
LicenseTier tier = await EditCore.getLicenseTier();

// Check specific feature
bool canCrop = await EditCore.isFeatureEnabled(EditCoreFeature.crop);
```

## Caching

License state is cached locally using `flutter_secure_storage`. The SDK validates against the Creovine API on first launch and periodically thereafter. Cached state allows the SDK to work temporarily offline.

## Getting a Key

Contact **sdk@creovine.com** or visit the [Creovine Console](https://creovine.com/console) to obtain an API key.
