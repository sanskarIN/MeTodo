// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Search & Filtering Utilities
 * 
 * Comprehensive search and filtering utilities for MeTodo including
 * full-text search, advanced filtering, sorting, and query building.
 * 
 * Features:
 * - Full-text search
 * - Advanced filtering
 * - Sorting
 * - Query building
 * - Search highlighting
 */

/**
 * Task interface for search
 */
export interface SearchableTask {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  priority: string;
  status: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Search filter interface
 */
export interface SearchFilter {
  query?: string;
  priority?: string[];
  status?: string[];
  category?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasDescription?: boolean;
  hasSubtasks?: boolean;
  isRecurring?: boolean;
}

/**
 * Search result interface
 */
export interface SearchResult {
  task: SearchableTask;
  score: number;
  highlights: {
    title?: string[];
    description?: string[];
  };
}

/**
 * Search utility class
 */
export class SearchUtil {
  /**
   * Perform full-text search
   */
  static search(tasks: SearchableTask[], query: string): SearchableTask[] {
    if (!query.trim()) return tasks;

    const lowerQuery = query.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.category.toLowerCase().includes(lowerQuery) ||
        task.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Search with ranking
   */
  static searchWithRanking(tasks: SearchableTask[], query: string): SearchResult[] {
    if (!query.trim()) {
      return tasks.map((task) => ({
        task,
        score: 0,
        highlights: {},
      }));
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    tasks.forEach((task) => {
      let score = 0;
      const highlights: SearchResult['highlights'] = {};

      // Title match (highest score)
      if (task.title.toLowerCase().includes(lowerQuery)) {
        score += 100;
        highlights.title = this.highlightMatches(task.title, query);
      }

      // Description match
      if (task.description.toLowerCase().includes(lowerQuery)) {
        score += 50;
        highlights.description = this.highlightMatches(task.description, query);
      }

      // Category match
      if (task.category.toLowerCase().includes(lowerQuery)) {
        score += 30;
      }

      // Tag match
      if (task.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
        score += 20;
      }

      if (score > 0) {
        results.push({
          task,
          score,
          highlights,
        });
      }
    });

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Highlight search matches in text
   */
  static highlightMatches(text: string, query: string): string[] {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).filter((part) => part.length > 0);
  }

  /**
   * Filter tasks by criteria
   */
  static filter(tasks: SearchableTask[], filter: SearchFilter): SearchableTask[] {
    return tasks.filter((task) => {
      // Query filter
      if (filter.query) {
        const lowerQuery = filter.query.toLowerCase();
        const matchesQuery =
          task.title.toLowerCase().includes(lowerQuery) ||
          task.description.toLowerCase().includes(lowerQuery) ||
          task.category.toLowerCase().includes(lowerQuery) ||
          task.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

        if (!matchesQuery) return false;
      }

      // Priority filter
      if (filter.priority && filter.priority.length > 0) {
        if (!filter.priority.includes(task.priority)) return false;
      }

      // Status filter
      if (filter.status && filter.status.length > 0) {
        if (!filter.status.includes(task.status)) return false;
      }

      // Category filter
      if (filter.category && filter.category.length > 0) {
        if (!filter.category.includes(task.category)) return false;
      }

      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        const hasTags = filter.tags.some((tag) => task.tags.includes(tag));
        if (!hasTags) return false;
      }

      // Date range filter
      if (filter.dateRange && task.dueDate) {
        const { start, end } = filter.dateRange;
        if (task.dueDate < start || task.dueDate > end) return false;
      }

      // Has description filter
      if (filter.hasDescription !== undefined) {
        const hasDesc = task.description.trim().length > 0;
        if (hasDesc !== filter.hasDescription) return false;
      }

      return true;
    });
  }

  /**
   * Sort tasks
   */
  static sort(
    tasks: SearchableTask[],
    sortBy: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt',
    order: 'asc' | 'desc' = 'asc'
  ): SearchableTask[] {
    const sorted = [...tasks];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'dueDate':
          aValue = a.dueDate?.getTime() || Infinity;
          bValue = b.dueDate?.getTime() || Infinity;
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  /**
   * Group tasks by key
   */
  static groupBy(
    tasks: SearchableTask[],
    groupBy: 'priority' | 'status' | 'category' | 'dueDate'
  ): Record<string, SearchableTask[]> {
    const groups: Record<string, SearchableTask[]> = {};

    tasks.forEach((task) => {
      let key: string;

      switch (groupBy) {
        case 'priority':
          key = task.priority;
          break;
        case 'status':
          key = task.status;
          break;
        case 'category':
          key = task.category;
          break;
        case 'dueDate':
          if (!task.dueDate) {
            key = 'No due date';
          } else {
            key = task.dueDate.toLocaleDateString();
          }
          break;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
    });

    return groups;
  }

  /**
   * Get search suggestions
   */
  static getSuggestions(
    tasks: SearchableTask[],
    query: string,
    limit: number = 5
  ): string[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = new Set<string>();

    tasks.forEach((task) => {
      // Title suggestions
      if (task.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(task.title);
      }

      // Category suggestions
      if (task.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(task.category);
      }

      // Tag suggestions
      task.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Build complex query
   */
  static buildQuery(filters: SearchFilter): (task: SearchableTask) => boolean {
    return (task: SearchableTask) => {
      if (filters.query) {
        const lowerQuery = filters.query.toLowerCase();
        const matchesQuery =
          task.title.toLowerCase().includes(lowerQuery) ||
          task.description.toLowerCase().includes(lowerQuery);
        if (!matchesQuery) return false;
      }

      if (filters.priority && !filters.priority.includes(task.priority)) {
        return false;
      }

      if (filters.status && !filters.status.includes(task.status)) {
        return false;
      }

      if (filters.category && !filters.category.includes(task.category)) {
        return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        const hasTags = filters.tags.some((tag) => task.tags.includes(tag));
        if (!hasTags) return false;
      }

      if (filters.dateRange && task.dueDate) {
        const { start, end } = filters.dateRange;
        if (task.dueDate < start || task.dueDate > end) return false;
      }

      return true;
    };
  }

  /**
   * Get filter statistics
   */
  static getFilterStats(tasks: SearchableTask[]): {
    totalTasks: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const stats = {
      totalTasks: tasks.length,
      byPriority: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    tasks.forEach((task) => {
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
      stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
      stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
    });

    return stats;
  }
}

export default SearchUtil;
