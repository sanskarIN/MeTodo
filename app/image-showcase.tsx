// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Image Showcase Screen
 * 
 * This screen displays all MeTodo branding assets, logos, feature images,
 * and promotional materials. It serves as a gallery for visual assets
 * and can be used for documentation, sharing, and marketing purposes.
 * 
 * Features:
 * - Display all branding assets
 * - Feature image showcase
 * - Icon gallery
 * - Image details and descriptions
 * - Share functionality
 * - Download capability
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { ImageGallery, type ImageItem } from '@/components/image-gallery';

/**
 * Image categories for organization
 */
interface ImageCategory {
  id: string;
  title: string;
  description: string;
  images: ImageItem[];
}

/**
 * Image Showcase Screen Component
 * 
 * Displays all MeTodo branding and feature images organized by category.
 * Allows users to view, share, and download images.
 */
export default function ImageShowcaseScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('logos');

  // Define image categories
  const imageCategories: ImageCategory[] = [
    {
      id: 'logos',
      title: 'Logos & Branding',
      description: 'Official MeTodo logos and branding assets',
      images: [
        {
          id: 'logo-main',
          uri: '/manus-storage/metodo-logo-main_fbbce346.png',
          title: 'Main Logo',
          description: 'Official MeTodo app logo - square format',
          aspectRatio: 1,
        },
        {
          id: 'logo-text',
          uri: '/manus-storage/metodo-logo-text_9ebebd2c.png',
          title: 'Logo with Text',
          description: 'MeTodo logo with text - horizontal format',
          aspectRatio: 16 / 9,
        },
        {
          id: 'banner',
          uri: '/manus-storage/metodo-banner_73c4b3eb.png',
          title: 'App Banner',
          description: 'Professional banner for app promotion',
          aspectRatio: 16 / 9,
        },
      ],
    },
    {
      id: 'features',
      title: 'Feature Images',
      description: 'Illustrations showcasing MeTodo features',
      images: [
        {
          id: 'feature-tasks',
          uri: '/manus-storage/metodo-feature-tasks_36440349.png',
          title: 'Task Management',
          description: 'Task management feature showcase',
          aspectRatio: 3 / 4,
        },
        {
          id: 'feature-avatar',
          uri: '/manus-storage/metodo-feature-avatar_e0e366ca.png',
          title: 'Avatar Creator',
          description: 'Avatar customization feature showcase',
          aspectRatio: 3 / 4,
        },
        {
          id: 'feature-themes',
          uri: '/manus-storage/metodo-feature-themes_dd971af3.png',
          title: 'Themes',
          description: 'Theme customization feature showcase',
          aspectRatio: 3 / 4,
        },
        {
          id: 'feature-developer',
          uri: '/manus-storage/metodo-feature-developer_c34d5fbb.png',
          title: 'Developer Options',
          description: 'Developer options feature showcase',
          aspectRatio: 3 / 4,
        },
      ],
    },
    {
      id: 'icons',
      title: 'Icons',
      description: 'Individual feature icons',
      images: [
        {
          id: 'icon-task',
          uri: '/manus-storage/metodo-icon-task_28eae538.png',
          title: 'Task Icon',
          description: 'Task management icon',
          aspectRatio: 1,
        },
        {
          id: 'icon-avatar',
          uri: '/manus-storage/metodo-icon-avatar_ea3735f9.png',
          title: 'Avatar Icon',
          description: 'Avatar creator icon',
          aspectRatio: 1,
        },
        {
          id: 'icon-themes',
          uri: '/manus-storage/metodo-icon-themes_dc961362.png',
          title: 'Themes Icon',
          description: 'Themes customization icon',
          aspectRatio: 1,
        },
      ],
    },
  ];

  const currentCategory = imageCategories.find((cat) => cat.id === selectedCategory);

  return (
    <ScreenContainer className="p-0">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent p-6 gap-2">
          <Text className="text-3xl font-bold text-foreground">
            Image Gallery
          </Text>
          <Text className="text-base text-muted">
            MeTodo branding and feature images
          </Text>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-4 border-b border-border"
        >
          <View className="flex-row gap-3">
            {imageCategories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category.id
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedCategory === category.id
                      ? 'text-background'
                      : 'text-foreground'
                  }`}
                >
                  {category.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Category Description */}
        {currentCategory && (
          <View className="px-6 py-4 gap-2">
            <Text className="text-lg font-semibold text-foreground">
              {currentCategory.title}
            </Text>
            <Text className="text-sm text-muted">
              {currentCategory.description}
            </Text>
          </View>
        )}

        {/* Image Gallery */}
        {currentCategory && (
          <View className="px-4 pb-6">
            <ImageGallery
              images={currentCategory.images}
              layout="grid"
              columns={currentCategory.id === 'icons' ? 3 : 2}
              showTitles={true}
              showDescriptions={true}
              containerClassName="h-auto"
            />
          </View>
        )}

        {/* Image Information */}
        <View className="px-6 py-6 bg-surface rounded-lg mx-4 mb-6 gap-3">
          <Text className="text-lg font-semibold text-foreground">
            About These Images
          </Text>
          <Text className="text-sm text-muted leading-relaxed">
            All images and logos are part of the official MeTodo branding package.
            These assets are designed for use in documentation, marketing materials,
            presentations, and promotional content.
          </Text>
          <Text className="text-sm text-muted leading-relaxed">
            For more information about branding guidelines and usage rights, please
            refer to the documentation or contact us at supportramsandesh@gmail.com.
          </Text>
        </View>

        {/* Usage Guidelines */}
        <View className="px-6 py-6 gap-4 mb-6">
          <Text className="text-lg font-semibold text-foreground">
            Usage Guidelines
          </Text>

          <View className="gap-3">
            <View className="gap-1">
              <Text className="font-semibold text-foreground">
                ✓ Do Use For:
              </Text>
              <Text className="text-sm text-muted">
                • Documentation and guides{'\n'}
                • Marketing materials{'\n'}
                • Presentations{'\n'}
                • Social media{'\n'}
                • Blog posts and articles
              </Text>
            </View>

            <View className="gap-1">
              <Text className="font-semibold text-foreground">
                ✗ Don&apos;t Use For:
              </Text>
              <Text className="text-sm text-muted">
                • Competing products{'\n'}
                • Misleading content{'\n'}
                • Commercial use without permission{'\n'}
                • Trademark violation{'\n'}
                • Defamatory content
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View className="px-6 py-6 bg-primary/10 rounded-lg mx-4 mb-6 gap-2">
          <Text className="text-base font-semibold text-foreground">
            Need Custom Assets?
          </Text>
          <Text className="text-sm text-muted">
            For custom branding, additional assets, or licensing inquiries,
            please contact us at:
          </Text>
          <Pressable className="mt-2">
            <Text className="text-base font-semibold text-primary">
              supportramsandesh@gmail.com
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
