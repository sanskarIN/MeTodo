// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Task Template Service Extended
 * 
 * Comprehensive service for managing task templates. Allows users to save,
 * organize, search, and apply task templates for quick task creation.
 * 
 * Features:
 * - Create and manage templates
 * - Template categories and organization
 * - Template search and filtering
 * - Template cloning and versioning
 * - Usage statistics and analytics
 * - Template sharing
 * - Bulk operations
 */

/**
 * Task template interface
 */
export interface TaskTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  
  // Task configuration
  title: string;
  priority: 'low' | 'medium' | 'high';
  taskCategory?: string;
  estimatedTime?: number; // in minutes
  defaultDueOffset?: number; // days from now
  
  // Recurring configuration
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  recurringDays?: number[]; // 0-6 for days of week
  
  // Additional fields
  defaultTags?: string[];
  defaultChecklist?: ChecklistItem[];
  defaultNotes?: string;
  defaultReminders?: ReminderConfig[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date;
  usageCount: number;
  isFavorite: boolean;
  isPublic: boolean;
  version: number;
}

/**
 * Checklist item interface
 */
export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

/**
 * Reminder configuration interface
 */
export interface ReminderConfig {
  type: 'before_due' | 'on_due' | 'after_creation';
  value: number; // minutes/hours/days depending on type
  unit: 'minutes' | 'hours' | 'days';
}

/**
 * Template category interface
 */
export interface TemplateCategory {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  templateCount: number;
  createdAt: Date;
}

/**
 * Template statistics interface
 */
export interface TemplateStatistics {
  totalTemplates: number;
  favoriteTemplates: number;
  totalUsages: number;
  mostUsedTemplate?: TaskTemplate;
  averageUsagePerTemplate: number;
  templatesCreatedThisMonth: number;
  templatesUsedThisMonth: number;
}

/**
 * Task Template Service Extended Class
 */
export class TaskTemplateServiceExtended {
  private templates: Map<string, TaskTemplate> = new Map();
  private categories: Map<string, TemplateCategory> = new Map();
  private userTemplates: Map<string, string[]> = new Map(); // userId -> templateIds

  /**
   * Constructor
   */
  constructor() {
    this.initializeDefaultCategories();
  }

  /**
   * Initialize default categories
   */
  private initializeDefaultCategories(): void {
    const defaultCategories = [
      { name: 'Work', color: '#0a7ea4', icon: '💼' },
      { name: 'Personal', color: '#22c55e', icon: '👤' },
      { name: 'Shopping', color: '#f59e0b', icon: '🛒' },
      { name: 'Health', color: '#ef4444', icon: '❤️' },
      { name: 'Finance', color: '#8b5cf6', icon: '💰' },
      { name: 'Education', color: '#06b6d4', icon: '📚' },
      { name: 'Home', color: '#ec4899', icon: '🏠' },
      { name: 'Travel', color: '#14b8a6', icon: '✈️' },
    ];

    defaultCategories.forEach((cat) => {
      const category: TemplateCategory = {
        id: `cat_${cat.name.toLowerCase()}`,
        userId: 'system',
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        templateCount: 0,
        createdAt: new Date(),
      };
      this.categories.set(category.id, category);
    });
  }

  /**
   * Create new template
   */
  createTemplate(userId: string, templateData: Partial<TaskTemplate>): TaskTemplate {
    const template: TaskTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name: templateData.name || 'Untitled Template',
      description: templateData.description,
      category: templateData.category || 'cat_personal',
      tags: templateData.tags || [],
      title: templateData.title || '',
      priority: templateData.priority || 'medium',
      taskCategory: templateData.taskCategory,
      estimatedTime: templateData.estimatedTime,
      defaultDueOffset: templateData.defaultDueOffset,
      isRecurring: templateData.isRecurring || false,
      recurringPattern: templateData.recurringPattern,
      recurringDays: templateData.recurringDays,
      defaultTags: templateData.defaultTags || [],
      defaultChecklist: templateData.defaultChecklist || [],
      defaultNotes: templateData.defaultNotes,
      defaultReminders: templateData.defaultReminders || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false,
      isPublic: false,
      version: 1,
    };

    this.templates.set(template.id, template);

    // Add to user templates
    if (!this.userTemplates.has(userId)) {
      this.userTemplates.set(userId, []);
    }
    this.userTemplates.get(userId)!.push(template.id);

    // Update category count
    const category = this.categories.get(template.category);
    if (category) {
      category.templateCount++;
    }

    return template;
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): TaskTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get all user templates
   */
  getUserTemplates(userId: string): TaskTemplate[] {
    const templateIds = this.userTemplates.get(userId) || [];
    return templateIds
      .map((id) => this.templates.get(id))
      .filter((t): t is TaskTemplate => t !== undefined);
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(userId: string, categoryId: string): TaskTemplate[] {
    return this.getUserTemplates(userId).filter((t) => t.category === categoryId);
  }

  /**
   * Search templates
   */
  searchTemplates(userId: string, query: string): TaskTemplate[] {
    const lowerQuery = query.toLowerCase();
    return this.getUserTemplates(userId).filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description?.toLowerCase().includes(lowerQuery) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get favorite templates
   */
  getFavoriteTemplates(userId: string): TaskTemplate[] {
    return this.getUserTemplates(userId).filter((t) => t.isFavorite);
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(templateId: string): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.isFavorite = !template.isFavorite;
    template.updatedAt = new Date();
    return template.isFavorite;
  }

  /**
   * Update template
   */
  updateTemplate(templateId: string, updates: Partial<TaskTemplate>): TaskTemplate | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const updated: TaskTemplate = {
      ...template,
      ...updates,
      id: template.id, // Preserve ID
      userId: template.userId, // Preserve user ID
      createdAt: template.createdAt, // Preserve creation date
      updatedAt: new Date(),
      version: template.version + 1,
    };

    this.templates.set(templateId, updated);
    return updated;
  }

  /**
   * Delete template
   */
  deleteTemplate(templateId: string): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    // Remove from user templates
    const userTemplates = this.userTemplates.get(template.userId);
    if (userTemplates) {
      const index = userTemplates.indexOf(templateId);
      if (index > -1) {
        userTemplates.splice(index, 1);
      }
    }

    // Update category count
    const category = this.categories.get(template.category);
    if (category && category.templateCount > 0) {
      category.templateCount--;
    }

    this.templates.delete(templateId);
    return true;
  }

  /**
   * Duplicate template
   */
  duplicateTemplate(templateId: string, userId: string): TaskTemplate | null {
    const original = this.templates.get(templateId);
    if (!original) return null;

    const duplicated = this.createTemplate(userId, {
      ...original,
      name: `${original.name} (Copy)`,
      isFavorite: false,
      usageCount: 0,
      lastUsed: undefined,
    });

    return duplicated;
  }

  /**
   * Apply template (increment usage)
   */
  applyTemplate(templateId: string): TaskTemplate | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    template.usageCount++;
    template.lastUsed = new Date();
    template.updatedAt = new Date();

    return template;
  }

  /**
   * Get template statistics
   */
  getStatistics(userId: string): TemplateStatistics {
    const userTemplates = this.getUserTemplates(userId);
    const favoriteCount = userTemplates.filter((t) => t.isFavorite).length;
    const totalUsages = userTemplates.reduce((sum, t) => sum + t.usageCount, 0);
    const avgUsage = userTemplates.length > 0 ? totalUsages / userTemplates.length : 0;

    let mostUsed: TaskTemplate | undefined;
    let maxUsage = 0;
    userTemplates.forEach((t) => {
      if (t.usageCount > maxUsage) {
        maxUsage = t.usageCount;
        mostUsed = t;
      }
    });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const createdThisMonth = userTemplates.filter((t) => t.createdAt >= monthStart).length;
    const usedThisMonth = userTemplates.filter((t) => t.lastUsed && t.lastUsed >= monthStart).length;

    return {
      totalTemplates: userTemplates.length,
      favoriteTemplates: favoriteCount,
      totalUsages,
      mostUsedTemplate: mostUsed,
      averageUsagePerTemplate: avgUsage,
      templatesCreatedThisMonth: createdThisMonth,
      templatesUsedThisMonth: usedThisMonth,
    };
  }

  /**
   * Get categories
   */
  getCategories(): TemplateCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Create custom category
   */
  createCategory(userId: string, name: string, color?: string, icon?: string): TemplateCategory {
    const category: TemplateCategory = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name,
      color,
      icon,
      templateCount: 0,
      createdAt: new Date(),
    };

    this.categories.set(category.id, category);
    return category;
  }

  /**
   * Delete category
   */
  deleteCategory(categoryId: string): boolean {
    const category = this.categories.get(categoryId);
    if (!category || category.templateCount > 0) {
      return false; // Cannot delete category with templates
    }

    this.categories.delete(categoryId);
    return true;
  }

  /**
   * Bulk create templates
   */
  bulkCreateTemplates(userId: string, templates: Partial<TaskTemplate>[]): TaskTemplate[] {
    return templates.map((t) => this.createTemplate(userId, t));
  }

  /**
   * Bulk delete templates
   */
  bulkDeleteTemplates(templateIds: string[]): number {
    let deleted = 0;
    templateIds.forEach((id) => {
      if (this.deleteTemplate(id)) {
        deleted++;
      }
    });
    return deleted;
  }

  /**
   * Export templates
   */
  exportTemplates(userId: string): string {
    const templates = this.getUserTemplates(userId);
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      templates,
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import templates
   */
  importTemplates(userId: string, jsonData: string): TaskTemplate[] {
    try {
      const data = JSON.parse(jsonData);
      const imported: TaskTemplate[] = [];

      if (Array.isArray(data.templates)) {
        data.templates.forEach((t: Partial<TaskTemplate>) => {
          const template = this.createTemplate(userId, t);
          imported.push(template);
        });
      }

      return imported;
    } catch (error) {
      console.error('Error importing templates:', error);
      return [];
    }
  }

  /**
   * Get most used templates
   */
  getMostUsedTemplates(userId: string, limit: number = 5): TaskTemplate[] {
    return this.getUserTemplates(userId)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * Get recently used templates
   */
  getRecentlyUsedTemplates(userId: string, limit: number = 5): TaskTemplate[] {
    return this.getUserTemplates(userId)
      .filter((t) => t.lastUsed)
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
      .slice(0, limit);
  }

  /**
   * Get recently created templates
   */
  getRecentlyCreatedTemplates(userId: string, limit: number = 5): TaskTemplate[] {
    return this.getUserTemplates(userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Share template
   */
  shareTemplate(templateId: string, withUserIds: string[]): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.isPublic = true;
    template.updatedAt = new Date();

    // In a real app, this would create share records
    // For now, just mark as public
    return true;
  }

  /**
   * Get public templates
   */
  getPublicTemplates(limit: number = 20): TaskTemplate[] {
    return Array.from(this.templates.values())
      .filter((t) => t.isPublic)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * Clear all user templates
   */
  clearUserTemplates(userId: string): number {
    const templateIds = this.userTemplates.get(userId) || [];
    const count = this.bulkDeleteTemplates(templateIds);
    this.userTemplates.delete(userId);
    return count;
  }
}

export const taskTemplateServiceExtended = new TaskTemplateServiceExtended();
export default TaskTemplateServiceExtended;
