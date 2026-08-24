// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Template List Component
 * 
 * Displays a list of task templates with filtering and sorting options.
 * Supports search, category filtering, and sort by usage/date.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { TemplateCard } from './template-card';

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  usageCount: number;
  isFavorite: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface TemplateListProps {
  templates: Template[];
  categories?: string[];
  onSelectTemplate?: (template: Template) => void;
  onFavoriteToggle?: (templateId: string) => void;
  onMorePress?: (template: Template) => void;
  showSearch?: boolean;
  showFilter?: boolean;
  emptyMessage?: string;
}

type SortBy = 'name' | 'usage' | 'recent' | 'favorite';

export function TemplateList({
  templates,
  categories = [],
  onSelectTemplate,
  onFavoriteToggle,
  onMorePress,
  showSearch = true,
  showFilter = true,
  emptyMessage = 'No templates found',
}: TemplateListProps) {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('recent');

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = [...templates];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'usage':
        filtered.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'recent':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'favorite':
        filtered.sort((a, b) => {
          if (a.isFavorite === b.isFavorite) {
            return b.usageCount - a.usageCount;
          }
          return a.isFavorite ? -1 : 1;
        });
        break;
    }

    return filtered;
  }, [templates, searchQuery, selectedCategory, sortBy]);

  const renderTemplate = ({ item }: { item: Template }) => (
    <TemplateCard
      {...item}
      onPress={() => onSelectTemplate?.(item)}
      onFavoritePress={() => onFavoriteToggle?.(item.id)}
      onMorePress={() => onMorePress?.(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.muted }]}>{emptyMessage}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
            placeholder="Search templates..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {showFilter && (
        <View style={styles.filterContainer}>
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.foreground }]}>Sort:</Text>
            <View style={styles.sortButtons}>
              {(['recent', 'usage', 'name', 'favorite'] as SortBy[]).map((sort) => (
                <Pressable
                  key={sort}
                  onPress={() => setSortBy(sort)}
                  style={[
                    styles.sortButton,
                    {
                      backgroundColor: sortBy === sort ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      { color: sortBy === sort ? '#ffffff' : colors.foreground },
                    ]}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {categories.length > 0 && (
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.foreground }]}>Category:</Text>
              <View style={styles.categoryButtons}>
                <Pressable
                  onPress={() => setSelectedCategory(null)}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selectedCategory === null ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: selectedCategory === null ? '#ffffff' : colors.foreground },
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: selectedCategory === cat ? colors.primary : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        { color: selectedCategory === cat ? '#ffffff' : colors.foreground },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <FlatList
        data={filteredAndSortedTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingBottom: 12,
  },
  searchInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: 16,
    gap: 12,
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortButton: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryButton: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
