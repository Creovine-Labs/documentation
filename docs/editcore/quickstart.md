---
sidebar_position: 2
title: Quick Start
description: Install and use EditCore in your Flutter app.
---

# Quick Start

Get EditCore running in your Flutter app in under 5 minutes.

## Installation

Add EditCore to your `pubspec.yaml`:

```yaml
dependencies:
  creovine_editcore:
    git:
      url: https://github.com/creovine/editcore.git
      ref: main
```

Run `flutter pub get`.

### iOS Setup

Add to `ios/Runner/Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to select videos for editing.</string>
```

### Android Setup

No additional configuration required. Minimum API level 21 (Android 5.0).

## Initialize

Call `EditCore.initialize()` in your `main()` before any other SDK call:

```dart
import 'package:creovine_editcore/editcore.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EditCore.initialize(apiKey: 'ECK-YOUR_KEY');
  runApp(MyApp());
}
```

## Open the Editor

Present the full-screen editor with a single call:

```dart
final result = await EditCore.openEditor(
  context: context,
  videoPath: '/path/to/video.mp4',
  config: EditCoreConfig(
    enableFilters: true,
    enableTextOverlay: true,
    enableTrim: true,
    enableCrop: true,
  ),
);

if (result.success) {
  print('Output: ${result.outputPath}');
  print('Duration: ${result.durationMs}ms');
  print('Size: ${result.fileSizeBytes} bytes');
}
```

## Check License Tier

```dart
LicenseTier tier = await EditCore.getLicenseTier();
// free | basic | pro | enterprise

bool canUseFilters = await EditCore.isFeatureEnabled(EditCoreFeature.filters);
```

## Get an API Key

API keys are prefixed `ECK-`. Contact **sdk@creovine.com** or visit the [Creovine Console](https://creovine.com/console).
