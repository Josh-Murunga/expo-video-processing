# Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  * [showEditor()](#showeditor)
  * [trim()](#trim)
  * [compress()](#compress)
  * [Compression Presets](#compression-presets)
  * [File Management](#file-management)
- [Configuration Options](#configuration-options)
  * [Basic Options](#basic-options)
  * [UI Customization](#ui-customization)
  * [Behavior Options](#behavior-options)
- [Platform Setup](#platform-setup)
- [Advanced Features](#advanced-features)
  * [Audio Trimming](#audio-trimming)
  * [Video Compression](#video-compression)
  * [Remote Files (HTTPS)](#remote-files-https)
  * [Video Rotation](#video-rotation)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

# Expo Video Processing 

<div align="center">
  <h2>📱 Professional video processing for React Native apps</h2>
  
  <img src="images/android.gif" width="300" />
  <img src="images/ios.gif" width="300" />
  
  <p>
    <strong>✅ iOS & Android</strong> • 
    <strong>✅ New & Old Architecture</strong> • 
    <strong>✅ Expo Compatible</strong>
  </p>
</div>

## Overview

A powerful, easy-to-use video and audio trimming and compression library for React Native applications.

### ✨ Key Features

- **📹 Video & Audio Support** - Trim and compress both video and audio files
- **🗜️ Video Compression** - Reduce file size with customizable quality settings
- **🎯 Smart Presets** - Pre-configured compression settings for common use cases
- **🌐 Local & Remote Files** - Support for local storage and HTTPS URLs
- **💾 Multiple Save Options** - Photos, Documents, or Share to other apps
- **✅ File Validation** - Built-in validation for media files
- **🗂️ File Management** - List, clean up, and delete specific files
- **🔄 Universal Architecture** - Works with both New and Old React Native architectures

### 🎛️ Core Capabilities

| Feature | Description |
|---------|-------------|
| **Trimming** | Precise video/audio trimming with visual controls |
| **Compression** | Reduce video file size with quality control |
| **Validation** | Check if files are valid video/audio before processing |
| **Save Options** | Photos, Documents, Share sheet integration |
| **File Management** | Complete file lifecycle management |
| **Customization** | Extensive UI and behavior customization |

<div align="center">
  <img src="images/document_picker.png" width="250" />
  <img src="images/share_sheet.png" width="250" />
</div>

## Installation

```bash
npm install expo-video-processing
# or
yarn add expo-video-processing
```

### Platform Setup

<details>
<summary><strong>📱 iOS Setup (React Native CLI)</strong></summary>

```bash
npx pod-install ios
```

**Permissions Required:**
- For saving to Photos: Add `NSPhotoLibraryUsageDescription` to `Info.plist`
</details>

<details>
<summary><strong>🤖 Android Setup (React Native CLI)</strong></summary>

**For New Architecture:**
```bash
cd android && ./gradlew generateCodegenArtifactsFromSchema
```

**Permissions Required:**
- For saving to Photos: Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

**For Share Sheet functionality**, add to `AndroidManifest.xml`:
```xml
<application>
  <!-- your other configs -->
  
  <provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.provider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
      android:name="android.support.FILE_PROVIDER_PATHS"
      android:resource="@xml/file_paths" />
  </provider>
</application>
```

Create `android/app/src/main/res/xml/file_paths.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
  <files-path name="internal_files" path="." />
  <external-path name="external_files" path="." />
</paths>
```
</details>

<details>
<summary><strong>🔧 Expo Setup</strong></summary>

```bash
npx expo prebuild
```

Then rebuild your app. **Note:** Expo Go may not work due to native dependencies - use development builds or `expo run:ios`/`expo run:android`.
</details>

## Quick Start

Get up and running in 3 simple steps:

```javascript
import { showEditor } from 'expo-video-processing';

// 1. Basic usage - open video editor
showEditor(videoUrl);

// 2. With duration limit
showEditor(videoUrl, {
  maxDuration: 20,
});

// 3. With save options
showEditor(videoUrl, {
  maxDuration: 30,
  saveToPhoto: true,
  openShareSheetOnFinish: true,
});
```

### Complete Example with File Picker

```javascript
import { showEditor } from 'expo-video-processing';
import { launchImageLibrary } from 'react-native-image-picker';

const trimVideo = () => {
  // Pick a video
  launchImageLibrary({ mediaType: 'video' }, (response) => {
    if (response.assets && response.assets[0]) {
      const videoUri = response.assets[0].uri;
      
      // Open editor
      showEditor(videoUri, {
        maxDuration: 60, // 60 seconds max
        saveToPhoto: true,
      });
    }
  });
};
```

> 💡 **More Examples:** Check the [example folder](./example/src/) for complete implementation details with event listeners for both New and Old architectures.

## API Reference

### showEditor()

Opens the video trimmer interface.

```typescript
showEditor(videoPath: string, config?: EditorConfig): void
```

**Parameters:**
- `videoPath` (string): Path to video file (local or remote HTTPS URL)
- `config` (EditorConfig, optional): Configuration options (see [Configuration Options](#configuration-options))

**Example:**
```javascript
showEditor('/path/to/video.mp4', {
  maxDuration: 30,
  saveToPhoto: true,
});
```

### trim()

Programmatically trim a video without showing the UI.

```typescript
trim(url: string, options: TrimOptions): Promise<string>
```

**Returns:** Promise resolving to the output file path

**Example:**
```javascript
const outputPath = await trim('/path/to/video.mp4', {
  startTime: 5000,  // 5 seconds
  endTime: 25000,   // 25 seconds
});
```

### compress()

Compress a video to reduce file size with customizable quality settings.

```typescript
compress(options: CompressionOptions): Promise<CompressionResult>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `inputPath` | `string` | ✅ Yes | Path to input video file |
| `resolution` | `object` | No | Target resolution `{width?, height?}` |
| `bitrate` | `string` | No | Video bitrate (e.g., "1M", "2M", "4M") |
| `fps` | `number` | No | Target frame rate |
| `audioBitrate` | `string` | No | Audio bitrate (e.g., "128k", "192k") |
| `outputExt` | `string` | No | Output file extension (default: "mp4") |
| `saveToPhoto` | `boolean` | No | Save to photo library |
| `removeAfterSavedToPhoto` | `boolean` | No | Delete after saving |
| `removeAfterFailedToSavePhoto` | `boolean` | No | Delete if save fails |

**Returns:** Promise resolving to:

```typescript
{
  outputPath: string;           // Path to compressed video
  originalSize: number;         // Original file size (bytes)
  compressedSize: number;       // Compressed file size (bytes)
  compressionRatio: number;     // Percentage saved (0-100)
  duration: number;             // Video duration (milliseconds)
}
```

**Examples:**

```javascript
// Basic compression
const result = await compress({
  inputPath: '/path/to/video.mp4',
  bitrate: '2M',
});

console.log(`Reduced from ${result.originalSize} to ${result.compressedSize}`);
console.log(`Saved ${result.compressionRatio}% space`);

// With resolution (maintain aspect ratio)
const result = await compress({
  inputPath: videoUri,
  resolution: { height: 720 },  // Width auto-calculated
  bitrate: '2M',
});

// High quality compression
const result = await compress({
  inputPath: videoUri,
  resolution: { width: 1920, height: 1080 },
  audioBitrate: '192k',
});

// Maximum compression
const result = await compress({
  inputPath: videoUri,
  resolution: { width: 640, height: 480 },
  audioBitrate: '96k',
});

// Save to gallery
const result = await compress({
  inputPath: videoUri,
  resolution: { height: 720 },
  bitrate: '2M',
  saveToPhoto: true,
  removeAfterSavedToPhoto: true,
});
```

### Compression Presets

Use pre-configured presets for common scenarios:

```javascript
import { compress, COMPRESSION_PRESETS } from 'expo-video-processing';

// Available presets
COMPRESSION_PRESETS.HIGH_QUALITY      // 1080p, high quality
COMPRESSION_PRESETS.MEDIUM_QUALITY    // 720p, balanced
COMPRESSION_PRESETS.LOW_QUALITY       // 480p, smaller size
COMPRESSION_PRESETS.SOCIAL_MEDIA      // 1080x1920, vertical video
COMPRESSION_PRESETS.WEB_OPTIMIZED     // 1080p, web streaming
COMPRESSION_PRESETS.MOBILE_OPTIMIZED  // 720p, mobile playback

// Usage
const result = await compress({
  inputPath: videoUri,
  ...COMPRESSION_PRESETS.MEDIUM_QUALITY,
});

// Override preset values
const result = await compress({
  inputPath: videoUri,
  ...COMPRESSION_PRESETS.MEDIUM_QUALITY,
  fps: 24,  // Override FPS
});
```

**Preset Details:**

| Preset | Resolution | Bitrate | CRF | Use Case |
|--------|-----------|---------|-----|----------|
| `HIGH_QUALITY` | 1080p | 4M | 20 | High quality archival |
| `MEDIUM_QUALITY` | 720p | 2M | 23 | Balanced quality/size |
| `LOW_QUALITY` | 480p | 1M | 28 | Maximum compression |
| `SOCIAL_MEDIA` | 1080x1920 | 2.5M | 23 | Vertical social media |
| `WEB_OPTIMIZED` | 1080p | 3M | 23 | Web streaming |
| `MOBILE_OPTIMIZED` | 720p | 1.5M | 25 | Mobile playback |

### File Management

| Method | Description | Returns |
|--------|-------------|---------|
| `isValidFile(videoPath)` | Check if file is valid video/audio | `Promise<boolean>` |
| `listFiles()` | List all generated output files | `Promise<string[]>` |
| `cleanFiles()` | Delete all generated files | `Promise<number>` |
| `deleteFile(filePath)` | Delete specific file | `Promise<boolean>` |
| `closeEditor()` | Close the editor interface | `void` |

**Examples:**
```javascript
// Validate file before processing
const isValid = await isValidFile('/path/to/video.mp4');
if (!isValid) {
  console.log('Invalid video file');
  return;
}

// Clean up generated files
const deletedCount = await cleanFiles();
console.log(`Deleted ${deletedCount} files`);
```

## Configuration Options

All configuration options are optional. Here are the most commonly used ones:

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `'video' \| 'audio'` | `'video'` | Media type to trim |
| `outputExt` | `string` | `'mp4'` | Output file extension |
| `maxDuration` | `number` | `video duration` | Maximum duration in milliseconds |
| `minDuration` | `number` | `1000` | Minimum duration in milliseconds |
| `autoplay` | `boolean` | `false` | Auto-play media on load |
| `jumpToPositionOnLoad` | `number` | - | Initial position in milliseconds |

### Save & Share Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `saveToPhoto` | `boolean` | `false` | Save to photo gallery (requires permissions) |
| `openDocumentsOnFinish` | `boolean` | `false` | Open document picker when done |
| `openShareSheetOnFinish` | `boolean` | `false` | Open share sheet when done |
| `removeAfterSavedToPhoto` | `boolean` | `false` | Delete file after saving to photos |
| `removeAfterFailedToSavePhoto` | `boolean` | `false` | Delete file if saving to photos fails |
| `removeAfterSavedToDocuments` | `boolean` | `false` | Delete file after saving to documents |
| `removeAfterFailedToSaveDocuments` | `boolean` | `false` | Delete file if saving to documents fails |
| `removeAfterShared` | `boolean` | `false` | Delete file after sharing (iOS only) |
| `removeAfterFailedToShare` | `boolean` | `false` | Delete file if sharing fails (iOS only) |

### UI Customization

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cancelButtonText` | `string` | `"Cancel"` | Cancel button text |
| `saveButtonText` | `string` | `"Save"` | Save button text |
| `trimmingText` | `string` | `"Trimming video..."` | Progress dialog text |
| `headerText` | `string` | - | Header text |
| `headerTextSize` | `number` | `16` | Header text size |
| `headerTextColor` | `string` | - | Header text color |
| `trimmerColor` | `string` | - | Trimmer bar color |
| `handleIconColor` | `string` | - | Trimmer left/right handles color |
| `fullScreenModalIOS` | `boolean` | `false` | Use fullscreen modal on iOS |

### Dialog Options

<details>
<summary><strong>Cancel Dialog</strong></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableCancelDialog` | `boolean` | `true` | Show confirmation dialog on cancel |
| `cancelDialogTitle` | `string` | `"Warning!"` | Cancel dialog title |
| `cancelDialogMessage` | `string` | `"Are you sure want to cancel?"` | Cancel dialog message |
| `cancelDialogCancelText` | `string` | `"Close"` | Cancel dialog cancel button text |
| `cancelDialogConfirmText` | `string` | `"Proceed"` | Cancel dialog confirm button text |
</details>

<details>
<summary><strong>Save Dialog</strong></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableSaveDialog` | `boolean` | `true` | Show confirmation dialog on save |
| `saveDialogTitle` | `string` | `"Confirmation!"` | Save dialog title |
| `saveDialogMessage` | `string` | `"Are you sure want to save?"` | Save dialog message |
| `saveDialogCancelText` | `string` | `"Close"` | Save dialog cancel button text |
| `saveDialogConfirmText` | `string` | `"Proceed"` | Save dialog confirm button text |
</details>

<details>
<summary><strong>Trimming Cancel Dialog</strong></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableCancelTrimming` | `boolean` | `true` | Enable cancel during trimming |
| `cancelTrimmingButtonText` | `string` | `"Cancel"` | Cancel trimming button text |
| `enableCancelTrimmingDialog` | `boolean` | `true` | Show cancel trimming confirmation |
| `cancelTrimmingDialogTitle` | `string` | `"Warning!"` | Cancel trimming dialog title |
| `cancelTrimmingDialogMessage` | `string` | `"Are you sure want to cancel trimming?"` | Cancel trimming dialog message |
| `cancelTrimmingDialogCancelText` | `string` | `"Close"` | Cancel trimming dialog cancel button |
| `cancelTrimmingDialogConfirmText` | `string` | `"Proceed"` | Cancel trimming dialog confirm button |
</details>

<details>
<summary><strong>Error Dialog</strong></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `alertOnFailToLoad` | `boolean` | `true` | Show alert dialog on load failure |
| `alertOnFailTitle` | `string` | `"Error"` | Error dialog title |
| `alertOnFailMessage` | `string` | `"Fail to load media..."` | Error dialog message |
| `alertOnFailCloseText` | `string` | `"Close"` | Error dialog close button text |
</details>

### Advanced Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableHapticFeedback` | `boolean` | `true` | Enable haptic feedback |
| `closeWhenFinish` | `boolean` | `true` | Close editor when done |
| `enableRotation` | `boolean` | `false` | Enable video rotation |
| `rotationAngle` | `number` | `0` | Rotation angle in degrees |
| `changeStatusBarColorOnOpen` | `boolean` | `false` | Change status bar color (Android only) |
| `zoomOnWaitingDuration` | `number` | `5000` | Duration for zoom-on-waiting feature in milliseconds (default: 5000) |

### Example Configuration

```javascript
showEditor(videoPath, {
  // Basic settings
  maxDuration: 60000,
  minDuration: 3000,
  
  // Save options
  saveToPhoto: true,
  openShareSheetOnFinish: true,
  removeAfterSavedToPhoto: true,
  
  // UI customization
  headerText: "Trim Your Video",
  cancelButtonText: "Back",
  saveButtonText: "Done",
  trimmerColor: "#007AFF",
  
  // Behavior
  autoplay: true,
  enableCancelTrimming: true,
});
```

## Platform Setup

### Android SDK Customization

You can override SDK versions in `android/build.gradle`:

```gradle
buildscript {
    ext {
        VideoTrim_kotlinVersion = '2.0.21'
        VideoTrim_minSdkVersion = 24
        VideoTrim_targetSdkVersion = 34
        VideoTrim_compileSdkVersion = 35
        VideoTrim_ndkVersion = '27.1.12297006'
    }
}
```

## Advanced Features

### Audio Trimming

<div align="center">
  <img src="images/audio_android.jpg" width="200" />
  <img src="images/audio_ios.jpg" width="200" />
</div>

For audio-only trimming, specify the media type and output format:

```javascript
showEditor(audioUrl, {
  type: 'audio',        // Enable audio mode
  outputExt: 'wav',     // Output format (mp3, wav, m4a, etc.)
  maxDuration: 30000,   // 30 seconds max
});
```

### Video Compression

Reduce video file sizes while maintaining quality:

#### Quick Start

```javascript
import { compress, COMPRESSION_PRESETS } from 'expo-video-processing';

// Use a preset
const result = await compress({
  inputPath: videoUri,
  ...COMPRESSION_PRESETS.MEDIUM_QUALITY,
});

console.log(`Saved ${result.compressionRatio}% space!`);
```

#### Resolution Control

**Maintain Aspect Ratio:**
```javascript
// Scale by height (recommended)
await compress({
  inputPath: videoUri,
  resolution: { height: 720 },  // Width auto-calculated
});

// Scale by width
await compress({
  inputPath: videoUri,
  resolution: { width: 1280 },  // Height auto-calculated
});
```

**Force Specific Aspect Ratio:**
```javascript
// Force 16:9
await compress({
  inputPath: videoUri,
  resolution: { width: 1280, height: 720 },
});

// Force 9:16 (vertical)
await compress({
  inputPath: videoUri,
  resolution: { width: 1080, height: 1920 },
});

// Force 1:1 (square)
await compress({
  inputPath: videoUri,
  resolution: { width: 1080, height: 1080 },
});
```

#### Quality vs Size Trade-offs

**CRF (Constant Rate Factor):**
- Range: 0-51 (lower = better quality)
- `18` - Visually lossless
- `23` - Default (recommended)
- `28` - Lower quality, smaller file

**Bitrate:**
- `"500k"` - Low quality
- `"1M"` - Medium quality
- `"2M"` - Good quality
- `"4M"` - High quality
- `"8M"` - Very high quality

**Preset (encoding speed):**
- `"ultrafast"` - Fastest, largest file
- `"fast"` - Fast, larger file
- `"medium"` - Balanced (recommended)
- `"slow"` - Slow, smaller file
- `"veryslow"` - Slowest, smallest file

#### Common Use Cases

**Social Media Upload:**
```javascript
await compress({
  inputPath: videoUri,
  ...COMPRESSION_PRESETS.SOCIAL_MEDIA,
});
```

**Email Attachment:**
```javascript
await compress({
  inputPath: videoUri,
  resolution: { width: 640, height: 480 },
  bitrate: '500k',
  crf: 28,
});
```

**Web Streaming:**
```javascript
await compress({
  inputPath: videoUri,
  ...COMPRESSION_PRESETS.WEB_OPTIMIZED,
});
```

**Mobile Playback:**
```javascript
await compress({
  inputPath: videoUri,
  ...COMPRESSION_PRESETS.MOBILE_OPTIMIZED,
});
```

#### Performance Notes

Compression time varies based on:
- **Video length**: Longer videos take more time
- **Input resolution**: Higher resolution = more processing
- **Output settings**: Lower CRF/higher quality = slower
- **Preset**: Slower presets take more time but produce smaller files
- **Device**: Newer devices compress faster

**Typical times** (1 minute video, medium preset):
- High-end devices: 10-20 seconds
- Mid-range devices: 20-40 seconds
- Older devices: 40-90 seconds

#### Tips

1. **Start with presets** - Use `COMPRESSION_PRESETS` for common scenarios
2. **CRF vs Bitrate** - Use CRF for quality-based encoding, bitrate for size control
3. **Preset selection** - Use "medium" for balanced speed/quality
4. **Aspect ratio** - Specify only width or height to maintain aspect ratio
5. **Test first** - Try different settings on a sample video
6. **File size** - Lower resolution and higher CRF = smaller files
7. **Quality** - Lower CRF and higher bitrate = better quality

### Remote Files (HTTPS)

To trim remote files, you need the HTTPS-enabled version of FFmpeg:

**Android:**
```gradle
// android/build.gradle
buildscript {
    ext {
        VideoTrim_ffmpeg_package = 'https'
        // Optional: VideoTrim_ffmpeg_version = '6.0.1'
    }
}
```

**iOS:**
```bash
FFMPEGKIT_PACKAGE=https FFMPEG_KIT_PACKAGE_VERSION=6.0 pod install
```

**Usage:**
```javascript
showEditor('https://example.com/video.mp4', {
  maxDuration: 60000,
});
```

### Video Rotation

Rotate videos during trimming using metadata (doesn't re-encode):

```javascript
showEditor(videoUrl, {
  enableRotation: true,
  rotationAngle: 90,    // 90, 180, 270 degrees
});
```

**Note:** Uses `display_rotation` metadata - playback may vary by platform/player.

### Trimming Progress & Cancellation

<div align="center">
  <img src="images/progress.jpg" width="200" />
  <img src="images/cancel_confirm.jpg" width="200" />
</div>

Users can cancel trimming while in progress:

```javascript
showEditor(videoUrl, {
  enableCancelTrimming: true,
  cancelTrimmingButtonText: "Stop",
  trimmingText: "Processing video...",
});
```

### Error Handling

<img src="images/fail_to_load_media.jpg" width="200" />

Handle loading errors gracefully:

```javascript
showEditor(videoUrl, {
  alertOnFailToLoad: true,
  alertOnFailTitle: "Oops!",
  alertOnFailMessage: "Cannot load this video file",
  alertOnFailCloseText: "OK",
});
```

## Examples

### Video Compression Example

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { compress, COMPRESSION_PRESETS } from 'expo-video-processing';
import { launchImageLibrary } from 'react-native-image-picker';

export default function VideoCompressor() {
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState(null);

  const compressVideo = async () => {
    const pickerResult = await launchImageLibrary({
      mediaType: 'video',
      quality: 1,
    });

    if (pickerResult.assets?.[0]?.uri) {
      setCompressing(true);
      
      try {
        const compressionResult = await compress({
          inputPath: pickerResult.assets[0].uri,
          ...COMPRESSION_PRESETS.MEDIUM_QUALITY,
          saveToPhoto: true,
        });
        
        setResult(compressionResult);
        console.log('Compression complete:', compressionResult);
      } catch (error) {
        console.error('Compression failed:', error);
      } finally {
        setCompressing(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <TouchableOpacity 
        onPress={compressVideo}
        disabled={compressing}
        style={{ 
          backgroundColor: compressing ? '#ccc' : '#007AFF', 
          padding: 15, 
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>
          {compressing ? 'Compressing...' : 'Select & Compress Video'}
        </Text>
      </TouchableOpacity>

      {compressing && <ActivityIndicator size="large" color="#007AFF" />}

      {result && (
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Compression Results:</Text>
          <Text>Original: {(result.originalSize / 1024 / 1024).toFixed(2)} MB</Text>
          <Text>Compressed: {(result.compressedSize / 1024 / 1024).toFixed(2)} MB</Text>
          <Text>Saved: {result.compressionRatio.toFixed(1)}%</Text>
          <Text>Duration: {(result.duration / 1000).toFixed(1)}s</Text>
          <Text style={{ marginTop: 10, fontSize: 12 }}>Output: {result.outputPath}</Text>
        </View>
      )}
    </View>
  );
}
```

### Complete Implementation (New Architecture)

```javascript
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { showEditor, isValidFile, type Spec } from 'expo-video-processing';
import { launchImageLibrary } from 'react-native-image-picker';

export default function VideoTrimmer() {
  const listeners = useRef({});

  useEffect(() => {
    // Set up event listeners
    listeners.current.onFinishTrimming = (NativeVideoTrim as Spec)
      .onFinishTrimming(({ outputPath, startTime, endTime, duration }) => {
        console.log('Trimming completed:', {
          outputPath,
          startTime,
          endTime,
          duration
        });
      });

    listeners.current.onError = (NativeVideoTrim as Spec)
      .onError(({ message, errorCode }) => {
        console.error('Trimming error:', message, errorCode);
      });

    return () => {
      // Cleanup listeners
      Object.values(listeners.current).forEach(listener => 
        listener?.remove()
      );
    };
  }, []);

  const selectAndTrimVideo = async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      quality: 1,
    });

    if (result.assets?.[0]?.uri) {
      const videoUri = result.assets[0].uri;
      
      // Validate file first
      const isValid = await isValidFile(videoUri);
      if (!isValid) {
        console.log('Invalid video file');
        return;
      }

      // Open editor
      showEditor(videoUri, {
        maxDuration: 60000,        // 1 minute max
        saveToPhoto: true,         // Save to gallery
        openShareSheetOnFinish: true,
        headerText: "Trim Video",
        trimmerColor: "#007AFF",
      });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={selectAndTrimVideo}
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 15, 
          borderRadius: 8 
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>
          Select & Trim Video
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Old Architecture Implementation

```javascript
import React, { useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { showEditor } from 'expo-video-processing';

export default function VideoTrimmer() {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    
    const subscription = eventEmitter.addListener('VideoTrim', (event) => {
      switch (event.name) {
        case 'onFinishTrimming':
          console.log('Video trimmed:', event.outputPath);
          break;
        case 'onError':
          console.error('Trimming failed:', event.message);
          break;
        // Handle other events...
      }
    });

    return () => subscription.remove();
  }, []);

  // Rest of implementation...
}
```

## Troubleshooting

### Common Issues

**Android Build Errors:**
- Ensure `file_paths.xml` exists for share functionality
- Check SDK versions match your project requirements
- Verify permissions in `AndroidManifest.xml`
- For New Architecture: Run `./gradlew generateCodegenArtifactsFromSchema`

**iOS Build Errors:**
- Run `pod install` after installation
- Check Info.plist permissions for photo access
- Use development builds with Expo (not Expo Go)
- Ensure AVFoundation framework is linked (automatic in most cases)

**Runtime Issues:**
- Validate files with `isValidFile()` before processing
- Use HTTPS version for remote files
- Check network connectivity for remote files
- Ensure proper permissions for save operations

**Compression Issues:**

*Compression fails immediately:*
- Check input file path is valid and file exists
- Verify file is a valid video format
- Ensure sufficient storage space for output
- Check console logs for detailed error messages

*Compression is too slow:*
- Use faster preset: `preset: "fast"` or `"ultrafast"`
- Reduce output resolution
- Increase CRF value (lower quality, faster encoding)
- Test on a shorter video first

*Output file is too large:*
- Increase CRF value (e.g., 28)
- Reduce bitrate
- Lower resolution
- Use slower preset for better compression

*Output quality is too low:*
- Decrease CRF value (e.g., 20)
- Increase bitrate
- Use slower preset
- Increase resolution (if source allows)

*Aspect ratio is wrong:*
- Specify only width OR height to maintain aspect ratio
- Use `{ height: 720 }` instead of `{ width: 1280, height: 720 }`
- Or intentionally set both for specific aspect ratio

*Save to photo library fails:*
- Check photo library permissions are granted
- Verify `NSPhotoLibraryAddUsageDescription` in Info.plist (iOS)
- Check `WRITE_EXTERNAL_STORAGE` permission (Android)
- Check console for permission error messages

### Performance Tips

**Trimming:**
- Use `trim()` for batch processing without UI
- Clean up generated files regularly with `cleanFiles()`
- Trimming is fast (uses copy codec, no re-encoding)

**Compression:**
- Start with presets for optimal settings
- Use `"medium"` preset for balanced speed/quality
- Test settings on short videos first
- Consider device capabilities when choosing settings
- Clean up compressed files after use
- Show progress indicator for better UX

**General:**
- Validate files before processing to avoid errors
- Use appropriate output formats for your use case
- Monitor storage space for large video operations
- Handle errors gracefully with try/catch blocks

## Credits

- **Android:** Based on [Android-Video-Trimmer](https://github.com/iknow4/Android-Video-Trimmer) and [React-Native-Video-Trim](https://github.com/maitrungduc1410/react-native-video-trim)
- **iOS:** UI from [VideoTrimmerControl](https://github.com/AndreasVerhoeven/VideoTrimmerControl)