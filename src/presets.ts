import type { CompressionOptions } from './NativeVideoProcessing';

/**
 * Predefined compression presets for common use cases
 */
export const COMPRESSION_PRESETS: Record<string, Partial<CompressionOptions>> = {
  /**
   * High quality - minimal compression
   * Best for: Archiving, professional use
   * File size: Large
   */
  HIGH_QUALITY: {
    resolution: { width: 1920, height: 1080 },
    bitrate: '4M',
    crf: 20,
    preset: 'medium',
    audioBitrate: '192k',
  },

  /**
   * Medium quality - balanced compression
   * Best for: General use, sharing
   * File size: Medium
   */
  MEDIUM_QUALITY: {
    resolution: { width: 1280, height: 720 },
    bitrate: '2M',
    crf: 23,
    preset: 'medium',
    audioBitrate: '128k',
  },

  /**
   * Low quality - maximum compression
   * Best for: Quick sharing, limited storage
   * File size: Small
   */
  LOW_QUALITY: {
    resolution: { width: 854, height: 480 },
    bitrate: '1M',
    crf: 28,
    preset: 'fast',
    audioBitrate: '96k',
  },

  /**
   * Social media optimized (9:16 for stories)
   * Best for: Instagram, TikTok, Snapchat stories
   * File size: Medium
   */
  SOCIAL_MEDIA: {
    resolution: { width: 1280, height: 720 },
    bitrate: '2.5M',
    crf: 23,
    preset: 'medium',
    audioBitrate: '128k',
    fps: 30,
  },

  /**
   * Web optimized (16:9)
   * Best for: YouTube, Vimeo, web players
   * File size: Medium
   */
  WEB_OPTIMIZED: {
    resolution: { width: 1920, height: 1080 },
    bitrate: '3M',
    crf: 23,
    preset: 'medium',
    audioBitrate: '128k',
    fps: 30,
  },

  /**
   * Mobile optimized
   * Best for: Mobile playback, WhatsApp
   * File size: Small
   */
  MOBILE_OPTIMIZED: {
    resolution: { width: 720, height: 1280 },
    bitrate: '1.5M',
    crf: 25,
    preset: 'fast',
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
