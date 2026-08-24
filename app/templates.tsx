// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Templates Screen
 * 
 * Main screen for managing task templates. Displays list of templates,
 * allows creating new templates, editing existing ones, and applying templates.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { TemplateList } from '@/components/template-list';
import { useColors } from '@/hooks/use-colors';

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

export default function TemplatesScreen() {
  const colors = useColors();
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'template_1',
      name: 'Daily Standup',
      description: 'Prepare for daily team standup meeting',
      category: 'work',
      usageCount: 42,
      isFavorite: true,
      priority: 'high',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'template_2',
      name: 'Weekly Review',
      description: 'Review tasks completed this week',
      category: 'personal',
      usageCount: 12,
      isFavorite: false,
      priority: 'medium',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'template_3',
      name: 'Grocery Shopping',
      description: 'Weekly grocery shopping list',
      category: 'shopping',
      usageCount: 28,
      isFavorite: true,
      priority: 'medium',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const handleSaveTemplate = useCallback(() => {
    if (!newTemplateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    if (editingTemplateId) {
      setTemplates((currentTemplates) => currentTemplates.map((template) => (
        template.id === editingTemplateId
          ? { ...template, name: newTemplateName.trim(), description: newTemplateDesc.trim() }
          : template
      )));
      setEditingTemplateId(null);
      setNewTemplateName('');
      setNewTemplateDesc('');
      setShowCreateModal(false);
      Alert.alert('Updated', 'Template updated successfully');
      return;
    }

    const newTemplate: Template = {
      id: `template_${Date.now()}`,
      name: newTemplateName.trim(),
      description: newTemplateDesc.trim(),
      category: 'personal',
      usageCount: 0,
      isFavorite: false,
      priority: 'medium',
      createdAt: new Date(),
    };

    setTemplates((currentTemplates) => [...currentTemplates, newTemplate]);
    setNewTemplateName('');
    setNewTemplateDesc('');
    setShowCreateModal(false);
    Alert.alert('Success', 'Template created successfully');
  }, [editingTemplateId, newTemplateDesc, newTemplateName]);

  const handleToggleFavorite = useCallback((templateId: string) => {
    setTemplates((currentTemplates) => currentTemplates.map((template) => (
      template.id === templateId
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    )));
  }, []);

  const handleSelectTemplate = useCallback((template: Template) => {
    setTemplates((currentTemplates) => currentTemplates.map((item) => (
      item.id === template.id ? { ...item, usageCount: item.usageCount + 1 } : item
    )));
    Alert.alert('Template Selected', `Using template: ${template.name}`);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setEditingTemplateId(null);
    setNewTemplateName('');
    setNewTemplateDesc('');
    setShowCreateModal(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditingTemplateId(null);
    setNewTemplateName('');
    setNewTemplateDesc('');
    setShowCreateModal(false);
  }, []);

  const handleEditTemplate = useCallback((template: Template) => {
    setEditingTemplateId(template.id);
    setNewTemplateName(template.name);
    setNewTemplateDesc(template.description ?? '');
    setShowCreateModal(true);
  }, []);

  const handleDuplicateTemplate = useCallback((template: Template) => {
    const duplicate: Template = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} Copy`,
      usageCount: 0,
      isFavorite: false,
      createdAt: new Date(),
    };
    setTemplates((currentTemplates) => [...currentTemplates, duplicate]);
    Alert.alert('Duplicated', `${template.name} was duplicated successfully`);
  }, []);

  const handleDeleteTemplate = useCallback((templateId: string) => {
    Alert.alert('Delete Template', 'Are you sure you want to delete this template?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTemplates((currentTemplates) => currentTemplates.filter((template) => template.id !== templateId));
          Alert.alert('Deleted', 'Template deleted successfully');
        },
      },
    ]);
  }, []);

  const categories = ['work', 'personal', 'shopping', 'health'];
  const stats = {
    total: templates.length,
    favorites: templates.filter((t) => t.isFavorite).length,
    totalUsages: templates.reduce((sum, t) => sum + t.usageCount, 0),
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Templates</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Save and reuse your favorite task configurations
          </Text>
        </View>

        {/* Statistics */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Templates</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.favorites}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.totalUsages}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Total Uses</Text>
          </View>
        </View>

        {/* Create Button */}
        <Pressable
          onPress={handleOpenCreateModal}
          style={({ pressed }) => [
            styles.createButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.createButtonText}>+ Create New Template</Text>
        </Pressable>

        {/* Templates List */}
        <View style={styles.listContainer}>
          <TemplateList
            templates={templates}
            categories={categories}
            onSelectTemplate={handleSelectTemplate}
            onFavoriteToggle={handleToggleFavorite}
            onMorePress={(template) => {
              Alert.alert('Template Options', 'Choose an action', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit', onPress: () => handleEditTemplate(template) },
                { text: 'Duplicate', onPress: () => handleDuplicateTemplate(template) },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => handleDeleteTemplate(template.id),
                },
              ]);
            }}
            showSearch
            showFilter
            emptyMessage="No templates yet. Create your first template!"
          />
        </View>
      </ScrollView>

      {/* Create Template Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
          onRequestClose={handleCloseEditor}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {editingTemplateId ? 'Edit Template' : 'Create New Template'}
              </Text>
              <Pressable onPress={handleCloseEditor}>
                <Text style={[styles.closeButton, { color: colors.muted }]}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Template Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g., Daily Standup"
                placeholderTextColor={colors.muted}
                value={newTemplateName}
                onChangeText={setNewTemplateName}
              />

              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.surface,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Describe this template..."
                placeholderTextColor={colors.muted}
                value={newTemplateDesc}
                onChangeText={setNewTemplateDesc}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.modalFooter}>
              <Pressable
                onPress={handleCloseEditor}
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSaveTemplate}
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>{editingTemplateId ? 'Save' : 'Create'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  createButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
  },
  modalBody: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
