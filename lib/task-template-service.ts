// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Task Template Service
 * 
 * Service for managing task templates in MeTodo including
 * creating, saving, loading, and applying templates.
 * 
 * Features:
 * - Template creation
 * - Template management
 * - Template application
 * - Preset templates
 */

/**
 * Task template interface
 */
export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  title: string;
  priority: string;
  category: string;
  tags: string[];
  estimatedTime?: number;
  subtasks?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isPreset?: boolean;
}

/**
 * Task Template Service Class
 */
export class TaskTemplateService {
  private static instance: TaskTemplateService;
  private templates: Map<string, TaskTemplate> = new Map();
  private presetTemplates: TaskTemplate[] = [];

  private constructor() {
    this.initializePresetTemplates();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TaskTemplateService {
    if (!TaskTemplateService.instance) {
      TaskTemplateService.instance = new TaskTemplateService();
    }
    return TaskTemplateService.instance;
  }

  /**
   * Initialize preset templates
   */
  private initializePresetTemplates(): void {
    this.presetTemplates = [
      {
        id: 'preset_work_meeting',
        name: 'Work Meeting',
        description: 'Template for work meetings',
        title: 'Meeting: [Topic]',
        priority: 'high',
        category: 'Work',
        tags: ['meeting', 'work'],
        estimatedTime: 60,
        notes: 'Prepare agenda and materials',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPreset: true,
      },
      {
        id: 'preset_project_task',
        name: 'Project Task',
        description: 'Template for project tasks',
        title: 'Task: [Project Name] - [Description]',
        priority: 'medium',
        category: 'Work',
        tags: ['project', 'task'],
        estimatedTime: 120,
        subtasks: ['Research', 'Plan', 'Implement', 'Test', 'Review'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPreset: true,
      },
      {
        id: 'preset_personal_goal',
        name: 'Personal Goal',
        description: 'Template for personal goals',
        title: 'Goal: [Goal Name]',
        priority: 'medium',
        category: 'Personal',
        tags: ['goal', 'personal'],
        estimatedTime: 0,
        subtasks: ['Define', 'Plan', 'Execute', 'Review', 'Celebrate'],
        notes: 'Break down into smaller steps',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPreset: true,
      },
      {
        id: 'preset_shopping',
        name: 'Shopping List',
        description: 'Template for shopping tasks',
        title: 'Shopping: [Store Name]',
        priority: 'low',
        category: 'Shopping',
        tags: ['shopping', 'errands'],
        estimatedTime: 60,
        notes: 'Check pantry before shopping',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPreset: true,
      },
      {
        id: 'preset_health_task',
        name: 'Health Task',
        description: 'Template for health-related tasks',
        title: 'Health: [Activity]',
        priority: 'high',
        category: 'Health',
        tags: ['health', 'fitness'],
        estimatedTime: 45,
        subtasks: ['Warm up', 'Main activity', 'Cool down', 'Log activity'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPreset: true,
      },
      {
        id: 'preset_learning',
        name: 'Learning Task',
        description: 'Template for learning activities',
        title: 'Learn: [Topic]',
        priority: 'medium',
        category: 'Learning',
        tags: ['learning', 'education'],
        estimatedTime: 90,
        subtasks: ['Research', 'Study', 'Practice', 'Review', 'Summarize'],
        notes: 'Take notes during learning',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPreset: true,
      },
    ];

    this.presetTemplates.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Create new template
   */
  createTemplate(template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>): TaskTemplate {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const newTemplate: TaskTemplate = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now,
      isPreset: false,
    };

    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): TaskTemplate | null {
    return this.templates.get(id) || null;
  }

  /**
   * Get all templates
   */
  getAllTemplates(): TaskTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get preset templates
   */
  getPresetTemplates(): TaskTemplate[] {
    return this.presetTemplates;
  }

  /**
   * Get custom templates
   */
  getCustomTemplates(): TaskTemplate[] {
    return Array.from(this.templates.values()).filter((t) => !t.isPreset);
  }

  /**
   * Update template
   */
  updateTemplate(id: string, updates: Partial<TaskTemplate>): TaskTemplate | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const updated: TaskTemplate = {
      ...template,
      ...updates,
      id: template.id,
      createdAt: template.createdAt,
      updatedAt: new Date(),
      isPreset: template.isPreset,
    };

    this.templates.set(id, updated);
    return updated;
  }

  /**
   * Delete template
   */
  deleteTemplate(id: string): boolean {
    const template = this.templates.get(id);
    if (!template || template.isPreset) {
      return false;
    }

    this.templates.delete(id);
    return true;
  }

  /**
   * Apply template to create task
   */
  applyTemplate(templateId: string, overrides?: Partial<TaskTemplate>): any {
    const template = this.templates.get(templateId);
    if (!template) return null;

    return {
      title: overrides?.title || template.title,
      priority: overrides?.priority || template.priority,
      category: overrides?.category || template.category,
      tags: overrides?.tags || template.tags,
      estimatedTime: overrides?.estimatedTime || template.estimatedTime,
      subtasks: overrides?.subtasks || template.subtasks,
      notes: overrides?.notes || template.notes,
      templateId,
    };
  }

  /**
   * Search templates
   */
  searchTemplates(query: string): TaskTemplate[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(
      (template) =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.title.toLowerCase().includes(lowerQuery) ||
        template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): TaskTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.category === category);
  }

  /**
   * Get templates by tag
   */
  getTemplatesByTag(tag: string): TaskTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.tags.includes(tag));
  }

  /**
   * Duplicate template
   */
  duplicateTemplate(id: string): TaskTemplate | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const newTemplate = this.createTemplate({
      name: `${template.name} (Copy)`,
      description: template.description,
      title: template.title,
      priority: template.priority,
      category: template.category,
      tags: template.tags,
      estimatedTime: template.estimatedTime,
      subtasks: template.subtasks,
      notes: template.notes,
    });

    return newTemplate;
  }

  /**
   * Export templates
   */
  exportTemplates(templateIds?: string[]): string {
    const templates = templateIds
      ? templateIds.map((id) => this.templates.get(id)).filter((t) => t !== undefined)
      : Array.from(this.templates.values()).filter((t) => !t.isPreset);

    return JSON.stringify(templates, null, 2);
  }

  /**
   * Import templates
   */
  importTemplates(jsonContent: string): TaskTemplate[] {
    try {
      const templates = JSON.parse(jsonContent) as TaskTemplate[];
      const imported: TaskTemplate[] = [];

      templates.forEach((template) => {
        const newTemplate = this.createTemplate({
          name: template.name,
          description: template.description,
          title: template.title,
          priority: template.priority,
          category: template.category,
          tags: template.tags,
          estimatedTime: template.estimatedTime,
          subtasks: template.subtasks,
          notes: template.notes,
        });

        imported.push(newTemplate);
      });

      return imported;
    } catch (error) {
      throw new Error(`Failed to import templates: ${error}`);
    }
  }

  /**
   * Get template statistics
   */
  getStats(): {
    totalTemplates: number;
    presetTemplates: number;
    customTemplates: number;
    byCategory: Record<string, number>;
    byTag: Record<string, number>;
  } {
    const templates = Array.from(this.templates.values());
    const stats = {
      totalTemplates: templates.length,
      presetTemplates: templates.filter((t) => t.isPreset).length,
      customTemplates: templates.filter((t) => !t.isPreset).length,
      byCategory: {} as Record<string, number>,
      byTag: {} as Record<string, number>,
    };

    templates.forEach((template) => {
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
      template.tags.forEach((tag) => {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      });
    });

    return stats;
  }
}

export const taskTemplateService = TaskTemplateService.getInstance();
export default TaskTemplateService;
