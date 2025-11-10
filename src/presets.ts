import type { CompressionOptions } from './NativeVideoProcessing';

/**
 * Predefined compression presets for common use cases
 * Note: preset field removed - not supported in minimal FFmpeg builds
 */
export const COMPRESSION_PRESETS: Record<string, Partial<CompressionOptions>> = {
  /**
   * High quality - minimal compression
   * Best for: Archiving, professional use
   * File size: Large
   * Note: Only height specified to maintain aspect ratio
   */
  HIGH_QUALITY: {
    resolution: { height: 1080 },
    bitrate: '4M',
    crf: 20,
    audioBitrate: '192k',
  },

  /**
   * Medium quality - balanced compression
   * Best for: General use, sharing
   * File size: Medium
   * Note: Only height specified to maintain aspect ratio
   */
  MEDIUM_QUALITY: {
    resolution: { height: 720 },
    bitrate: '2M',
    crf: 23,
    audioBitrate: '128k',
  },

  /**
   * Low quality - maximum compression
   * Best for: Quick sharing, limited storage
   * File size: Small
   * Note: Only height specified to maintain aspect ratio
   */
  LOW_QUALITY: {
    resolution: { height: 480 },
    bitrate: '1M',
    crf: 28,
    audioBitrate: '96k',
  },

  /**
   * Social media optimized (9:16 for stories)
   * Best for: Instagram, TikTok, Snapchat stories
   * File size: Medium
   * Note: Fixed aspect ratio for vertical video
   */
  SOCIAL_MEDIA: {
    resolution: { width: 1080, height: 1920 },
    bitrate: '2.5M',
    crf: 23,
    audioBitrate: '128k',
    fps: 30,
  },

  /**
   * Web optimized (16:9)
   * Best for: YouTube, Vimeo, web players
   * File size: Medium
   * Note: Only height specified to maintain aspect ratio
   */
  WEB_OPTIMIZED: {
    resolution: { height: 1080 },
    bitrate: '3M',
    crf: 23,
    audioBitrate: '128k',
    fps: 30,
  },

  /**
   * Mobile optimized
   * Best for: Mobile playback, WhatsApp
   * File size: Small
   * Note: Only height specified to maintain aspect ratio
   */
  MOBILE_OPTIMIZED: {
    resolution: { height: 720 },
    bitrate: '1.5M',
    crf: 25,
    audioBitrate: '96k',
    fps: 30,
  },
};

/**
 * Helper function to merge preset with custom options
 */
export function applyPreset(
  presetName: keyof typeof COMPRESSION_PRESETS,
  customOptions: Partial<CompressionOptions> = {}
): Partial<CompressionOptions> {
  const preset = COMPRESSION_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }
  return { ...preset, ...customOptions };
}
