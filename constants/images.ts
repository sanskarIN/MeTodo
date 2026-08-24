// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Image Constants
 * 
 * This file contains all image asset URLs and constants for MeTodo branding,
 * feature images, and icons. Centralized image management for easy updates
 * and consistent usage throughout the application.
 * 
 * Features:
 * - Centralized image URL management
 * - Type-safe image references
 * - Easy updates when URLs change
 * - Organized by category
 */

/**
 * Logo Assets
 * Official MeTodo logos and branding assets
 */
export const LOGO_ASSETS = {
  /** Main MeTodo logo - square format (512x512px) */
  main: '/manus-storage/metodo-logo-main_31adc223.png',
  
  /** App icon for launcher (256x256px) */
  icon: '/manus-storage/metodo-icon_a1a34a6e.png',
  
  /** Logo with text - horizontal format (2048x512px) */
  text: '/manus-storage/metodo-logo-text_9ebebd2c.png',
  
  /** App promotional banner (2560x1440px) */
  banner: '/manus-storage/metodo-banner_73c4b3eb.png',
} as const;

/**
 * Feature Images
 * Illustrations showcasing MeTodo features
 */
export const FEATURE_IMAGES = {
  /** Task management feature showcase */
  tasks: '/manus-storage/metodo-feature-tasks_36440349.png',
  
  /** Avatar creator feature showcase */
  avatar: '/manus-storage/metodo-feature-avatar_e0e366ca.png',
  
  /** Themes customization feature showcase */
  themes: '/manus-storage/metodo-feature-themes_dd971af3.png',
  
  /** Developer options feature showcase */
  developer: '/manus-storage/metodo-feature-developer_c34d5fbb.png',
} as const;

/**
 * Icon Assets
 * Individual feature icons for UI elements
 */
export const ICON_ASSETS = {
  /** Task management icon */
  task: '/manus-storage/metodo-icon-task_28eae538.png',
  
  /** Avatar creator icon */
  avatar: '/manus-storage/metodo-icon-avatar_ea3735f9.png',
  
  /** Themes customization icon */
  themes: '/manus-storage/metodo-icon-themes_dc961362.png',
} as const;

/**
 * All Image Assets
 * Combined object containing all image assets for easy access
 */
export const IMAGE_ASSETS = {
  logos: LOGO_ASSETS,
  features: FEATURE_IMAGES,
  icons: ICON_ASSETS,
} as const;

/**
 * Image Dimensions
 * Standard dimensions for different image types
 */
export const IMAGE_DIMENSIONS = {
  logo: {
    width: 1024,
    height: 1024,
    aspectRatio: 1,
  },
  logoText: {
    width: 2048,
    height: 512,
    aspectRatio: 4,
  },
  banner: {
    width: 2560,
    height: 1440,
    aspectRatio: 16 / 9,
  },
  feature: {
    width: 1200,
    height: 1600,
    aspectRatio: 3 / 4,
  },
  icon: {
    width: 512,
    height: 512,
    aspectRatio: 1,
  },
} as const;

/**
 * Image Categories
 * Organized categories for image gallery
 */
export const IMAGE_CATEGORIES = {
  LOGOS: 'logos',
  FEATURES: 'features',
  ICONS: 'icons',
} as const;

/**
 * Branding Colors
 * Official MeTodo color palette
 */
export const BRANDING_COLORS = {
  primary: '#0a7ea4',
  secondary: '#0066cc',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  light: '#ffffff',
  dark: '#151718',
  surface: '#f5f5f5',
} as const;

/**
 * Get image URL by category and key
 * 
 * @example
 * ```tsx
 * const logoUrl = getImageUrl('logos', 'main');
 * const featureUrl = getImageUrl('features', 'tasks');
 * ```
 */
export function getImageUrl(
  category: keyof typeof IMAGE_ASSETS,
  key: string
): string {
  const categoryAssets = IMAGE_ASSETS[category];
  return categoryAssets[key as keyof typeof categoryAssets] || '';
}

/**
 * Get image dimensions by type
 * 
 * @example
 * ```tsx
 * const logoDimensions = getImageDimensions('logo');
 * ```
 */
export function getImageDimensions(
  type: keyof typeof IMAGE_DIMENSIONS
): typeof IMAGE_DIMENSIONS[typeof type] {
  return IMAGE_DIMENSIONS[type];
}

/**
 * Type definitions for image assets
 */
export type LogoAsset = keyof typeof LOGO_ASSETS;

/**
 * Get logo URL by asset name
 * 
 * @example
 * ```tsx
 * const logoUrl = getLogoUrl('main');
 * const iconUrl = getLogoUrl('icon');
 * ```
 */
export function getLogoUrl(asset: LogoAsset): string {
  return LOGO_ASSETS[asset];
}
export type FeatureImage = keyof typeof FEATURE_IMAGES;
export type IconAsset = keyof typeof ICON_ASSETS;
export type ImageCategory = keyof typeof IMAGE_ASSETS;
export type ImageDimensionType = keyof typeof IMAGE_DIMENSIONS;
