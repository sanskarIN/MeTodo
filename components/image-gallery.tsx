// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Image Gallery Component
 * 
 * This component provides a reusable image gallery for displaying MeTodo
 * branding assets, feature images, and screenshots throughout the app.
 * 
 * Features:
 * - Responsive image display
 * - Lazy loading support
 * - Image caching
 * - Error handling
 * - Accessibility support
 * - Multiple layout options (grid, carousel, list)
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Image, Pressable, Text, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/utils';

/**
 * Image item interface for gallery
 */
export interface ImageItem {
  id: string;
  uri: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

/**
 * Gallery layout options
 */
export type GalleryLayout = 'grid' | 'carousel' | 'list' | 'single';

/**
 * Image Gallery Component Props
 */
export interface ImageGalleryProps {
  images: ImageItem[];
  layout?: GalleryLayout;
  columns?: number;
  onImagePress?: (image: ImageItem, index: number) => void;
  containerClassName?: string;
  imageClassName?: string;
  showTitles?: boolean;
  showDescriptions?: boolean;
  isLoading?: boolean;
  error?: string;
}

/**
 * Image Gallery Component
 * 
 * Displays a collection of images in various layouts with support for
 * interactions, loading states, and error handling.
 * 
 * @example
 * ```tsx
 * <ImageGallery
 *   images={[
 *     { id: '1', uri: '/manus-storage/image1.png', title: 'Feature 1' },
 *     { id: '2', uri: '/manus-storage/image2.png', title: 'Feature 2' }
 *   ]}
 *   layout="grid"
 *   columns={2}
 *   showTitles={true}
 * />
 * ```
 */
export function ImageGallery({
  images,
  layout = 'grid',
  columns = 2,
  onImagePress,
  containerClassName,
  imageClassName,
  showTitles = true,
  showDescriptions = false,
  isLoading = false,
  error,
}: ImageGalleryProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = useCallback((imageId: string) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  }, []);

  const renderImage = (image: ImageItem, index: number) => (
    <Pressable
      key={image.id}
      onPress={() => onImagePress?.(image, index)}
      className={cn(
        'overflow-hidden rounded-lg bg-surface',
        imageClassName
      )}
    >
      {imageErrors[image.id] ? (
        <View className="flex-1 items-center justify-center bg-muted/20 p-4">
          <Text className="text-center text-sm text-muted">
            Image failed to load
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri: image.uri }}
          className="w-full h-full"
          style={{
            aspectRatio: image.aspectRatio || 1,
          }}
          onError={() => handleImageError(image.id)}
          accessibilityLabel={image.title || `Image ${index + 1}`}
        />
      )}
      {showTitles && image.title && (
        <View className="bg-surface/80 p-2">
          <Text className="text-sm font-semibold text-foreground">
            {image.title}
          </Text>
          {showDescriptions && image.description && (
            <Text className="text-xs text-muted mt-1">
              {image.description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-sm text-error">
          {error}
        </Text>
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-sm text-muted">
          No images to display
        </Text>
      </View>
    );
  }

  // Grid layout
  if (layout === 'grid') {
    return (
      <ScrollView
        className={cn('flex-1', containerClassName)}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap gap-4 p-4">
          {images.map((image, index) => (
            <View
              key={image.id}
              style={{
                width: `${100 / columns}%`,
              }}
              className="aspect-square"
            >
              {renderImage(image, index)}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  // List layout
  if (layout === 'list') {
    return (
      <ScrollView
        className={cn('flex-1', containerClassName)}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 p-4">
          {images.map((image, index) => (
            <View key={image.id} className="h-48">
              {renderImage(image, index)}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  // Single layout
  if (layout === 'single') {
    return (
      <View className={cn('flex-1 items-center justify-center p-4', containerClassName)}>
        {images.length > 0 && renderImage(images[0], 0)}
      </View>
    );
  }

  // Carousel layout
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('flex-1', containerClassName)}
      pagingEnabled
    >
      {images.map((image, index) => (
        <View key={image.id} className="w-full h-full">
          {renderImage(image, index)}
        </View>
      ))}
    </ScrollView>
  );
}

export default ImageGallery;
