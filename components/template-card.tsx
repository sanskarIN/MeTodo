// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Template Card Component
 * 
 * Displays a single task template in a card format with quick actions.
 * Shows template name, description, usage count, and action buttons.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface TemplateCardProps {
  id: string;
  name: string;
  description?: string;
  category: string;
  usageCount: number;
  isFavorite: boolean;
  priority: 'low' | 'medium' | 'high';
  onPress?: () => void;
  onFavoritePress?: () => void;
  onMorePress?: () => void;
}

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

export function TemplateCard({
  id,
  name,
  description,
  category,
  usageCount,
  isFavorite,
  priority,
  onPress,
  onFavoritePress,
  onMorePress,
}: TemplateCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {name}
          </Text>
          {description && (
            <Text style={[styles.description, { color: colors.muted }]} numberOfLines={1}>
              {description}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={onFavoritePress}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? '⭐' : '☆'}</Text>
          </Pressable>
          <Pressable
            onPress={onMorePress}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.moreIcon}>⋯</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.stats}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(priority) },
            ]}
          >
            <Text style={styles.priorityText}>{priority.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.usageText, { color: colors.muted }]}>
            Used {usageCount} times
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  moreIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  usageText: {
    fontSize: 12,
  },
});
