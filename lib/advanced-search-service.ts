// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Advanced Search Service
 * 
 * Comprehensive search and filtering service for tasks. Supports full-text search,
 * multi-filter queries, sorting, and advanced search operators.
 */

export interface SearchFilter {
  priority?: ('low' | 'medium' | 'high')[];
  category?: string[];
  tags?: string[];
  status?: ('pending' | 'completed' | 'overdue')[];
  dueDateRange?: { start: Date; end: Date };
  createdDateRange?: { start: Date; end: Date };
  assignee?: string[];
  hasReminder?: boolean;
  isRecurring?: boolean;
  estimatedTimeRange?: { min: number; max: number };
}

export interface SearchResult {
  taskId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  relevanceScore: number;
  matchedFields: string[];
}

export interface SearchQuery {
  text?: string;
  filters?: SearchFilter;
  sortBy?: 'relevance' | 'date' | 'priority' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Advanced Search Service Class
 */
export class AdvancedSearchService {
  private tasks: any[] = [];
  private searchHistory: SearchQuery[] = [];
  private savedSearches: Map<string, SearchQuery> = new Map();

  /**
   * Constructor
   */
  constructor(tasks: any[] = []) {
    this.tasks = tasks;
  }

  /**
   * Update tasks
   */
  updateTasks(tasks: any[]): void {
    this.tasks = tasks;
  }

  /**
   * Parse search query
   */
  parseSearchQuery(queryString: string): SearchQuery {
    const query: SearchQuery = { text: '', filters: {} };
    const parts = queryString.split(/\s+/);
    const textParts: string[] = [];

    for (const part of parts) {
      if (part.startsWith('priority:')) {
        const priority = part.substring(9);
        query.filters!.priority = [priority as any];
      } else if (part.startsWith('category:')) {
        const category = part.substring(9);
        query.filters!.category = [category];
      } else if (part.startsWith('tag:')) {
        const tag = part.substring(4);
        query.filters!.tags = [tag];
      } else if (part.startsWith('status:')) {
        const status = part.substring(7);
        query.filters!.status = [status as any];
      } else if (part.startsWith('before:')) {
        const date = new Date(part.substring(7));
        query.filters!.dueDateRange = {
          start: new Date(0),
          end: date,
        };
      } else if (part.startsWith('after:')) {
        const date = new Date(part.substring(6));
        query.filters!.dueDateRange = {
          start: date,
          end: new Date(),
        };
      } else {
        textParts.push(part);
      }
    }

    query.text = textParts.join(' ');
    return query;
  }

  /**
   * Search tasks
   */
  search(query: SearchQuery): SearchResult[] {
    let results: SearchResult[] = [];

    // Text search
    if (query.text && query.text.trim()) {
      results = this.fullTextSearch(query.text);
    } else {
      results = this.tasks.map((task) => ({
        taskId: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        relevanceScore: 1,
        matchedFields: [],
      }));
    }

    // Apply filters
    if (query.filters) {
      results = this.applyFilters(results, query.filters);
    }

    // Sort results
    if (query.sortBy) {
      results = this.sortResults(results, query.sortBy, query.sortOrder || 'desc');
    }

    // Apply pagination
    if (query.limit || query.offset) {
      const offset = query.offset || 0;
      const limit = query.limit || 20;
      results = results.slice(offset, offset + limit);
    }

    // Add to search history
    this.searchHistory.push(query);
    if (this.searchHistory.length > 50) {
      this.searchHistory.shift();
    }

    return results;
  }

  /**
   * Full text search
   */
  private fullTextSearch(query: string): SearchResult[] {
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);

    return this.tasks
      .map((task) => {
        let score = 0;
        const matchedFields: string[] = [];

        // Title search (highest weight)
        if (task.title.toLowerCase().includes(queryLower)) {
          score += 10;
          matchedFields.push('title');
        }
        words.forEach((word) => {
          if (task.title.toLowerCase().includes(word)) {
            score += 3;
          }
        });

        // Description search (medium weight)
        if (task.description?.toLowerCase().includes(queryLower)) {
          score += 5;
          matchedFields.push('description');
        }
        words.forEach((word) => {
          if (task.description?.toLowerCase().includes(word)) {
            score += 1.5;
          }
        });

        // Tags search (medium weight)
        if (task.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
          score += 4;
          matchedFields.push('tags');
        }

        // Notes search (low weight)
        if (task.notes?.toLowerCase().includes(queryLower)) {
          score += 2;
          matchedFields.push('notes');
        }

        return {
          taskId: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          relevanceScore: score,
          matchedFields,
        };
      })
      .filter((result) => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Apply filters
   */
  private applyFilters(results: SearchResult[], filters: SearchFilter): SearchResult[] {
    return results.filter((result) => {
      const task = this.tasks.find((t) => t.id === result.taskId);
      if (!task) return false;

      // Priority filter
      if (filters.priority && !filters.priority.includes(task.priority)) {
        return false;
      }

      // Category filter
      if (filters.category && !filters.category.includes(task.category)) {
        return false;
      }

      // Tags filter
      if (filters.tags) {
        const hasAllTags = filters.tags.every((tag) => task.tags?.includes(tag));
        if (!hasAllTags) return false;
      }

      // Status filter
      if (filters.status) {
        const taskStatus = this.getTaskStatus(task);
        if (!filters.status.includes(taskStatus)) {
          return false;
        }
      }

      // Due date range filter
      if (filters.dueDateRange) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < filters.dueDateRange.start || dueDate > filters.dueDateRange.end) {
          return false;
        }
      }

      // Created date range filter
      if (filters.createdDateRange) {
        const createdDate = new Date(task.createdAt);
        if (
          createdDate < filters.createdDateRange.start ||
          createdDate > filters.createdDateRange.end
        ) {
          return false;
        }
      }

      // Assignee filter
      if (filters.assignee && !filters.assignee.includes(task.assignee)) {
        return false;
      }

      // Reminder filter
      if (filters.hasReminder !== undefined) {
        const hasReminder = (task.reminders?.length || 0) > 0;
        if (hasReminder !== filters.hasReminder) {
          return false;
        }
      }

      // Recurring filter
      if (filters.isRecurring !== undefined) {
        if (task.isRecurring !== filters.isRecurring) {
          return false;
        }
      }

      // Estimated time filter
      if (filters.estimatedTimeRange) {
        const time = task.estimatedTime || 0;
        if (time < filters.estimatedTimeRange.min || time > filters.estimatedTimeRange.max) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get task status
   */
  private getTaskStatus(task: any): 'pending' | 'completed' | 'overdue' {
    if (task.completed) return 'completed';
    if (task.dueDate && new Date(task.dueDate) < new Date()) return 'overdue';
    return 'pending';
  }

  /**
   * Sort results
   */
  private sortResults(
    results: SearchResult[],
    sortBy: string,
    sortOrder: string
  ): SearchResult[] {
    const sorted = [...results];

    switch (sortBy) {
      case 'relevance':
        sorted.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
      case 'date':
        sorted.sort((a, b) => {
          const taskA = this.tasks.find((t) => t.id === a.taskId);
          const taskB = this.tasks.find((t) => t.id === b.taskId);
          return new Date(taskB?.createdAt).getTime() - new Date(taskA?.createdAt).getTime();
        });
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        sorted.sort((a, b) => priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]);
        break;
      case 'dueDate':
        sorted.sort((a, b) => {
          const taskA = this.tasks.find((t) => t.id === a.taskId);
          const taskB = this.tasks.find((t) => t.id === b.taskId);
          return new Date(taskA?.dueDate).getTime() - new Date(taskB?.dueDate).getTime();
        });
        break;
    }

    if (sortOrder === 'asc') {
      sorted.reverse();
    }

    return sorted;
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Category suggestions
    const categories = [...new Set(this.tasks.map((t) => t.category))];
    categories.forEach((cat) => {
      if (cat.toLowerCase().includes(queryLower)) {
        suggestions.push(`category:${cat}`);
      }
    });

    // Tag suggestions
    const allTags = new Set<string>();
    this.tasks.forEach((t) => {
      t.tags?.forEach((tag: string) => allTags.add(tag));
    });
    allTags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.push(`tag:${tag}`);
      }
    });

    // Priority suggestions
    ['high', 'medium', 'low'].forEach((p) => {
      if (p.includes(queryLower)) {
        suggestions.push(`priority:${p}`);
      }
    });

    return suggestions.slice(0, 5);
  }

  /**
   * Save search
   */
  saveSearch(name: string, query: SearchQuery): void {
    this.savedSearches.set(name, query);
  }

  /**
   * Get saved search
   */
  getSavedSearch(name: string): SearchQuery | undefined {
    return this.savedSearches.get(name);
  }

  /**
   * Get all saved searches
   */
  getAllSavedSearches(): Map<string, SearchQuery> {
    return this.savedSearches;
  }

  /**
   * Delete saved search
   */
  deleteSavedSearch(name: string): boolean {
    return this.savedSearches.delete(name);
  }

  /**
   * Get search history
   */
  getSearchHistory(limit: number = 10): SearchQuery[] {
    return this.searchHistory.slice(-limit).reverse();
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
  }

  /**
   * Advanced search with complex queries
   */
  advancedSearch(query: string): SearchResult[] {
    const parsed = this.parseSearchQuery(query);
    return this.search(parsed);
  }

  /**
   * Get search statistics
   */
  getSearchStatistics(): {
    totalSearches: number;
    uniqueSearches: number;
    savedSearches: number;
    mostCommonFilter: string | null;
  } {
    const uniqueSearches = new Set(this.searchHistory.map((q) => q.text)).size;
    const filterCounts: Record<string, number> = {};

    this.searchHistory.forEach((q) => {
      if (q.filters?.priority) filterCounts['priority'] = (filterCounts['priority'] || 0) + 1;
      if (q.filters?.category) filterCounts['category'] = (filterCounts['category'] || 0) + 1;
      if (q.filters?.tags) filterCounts['tags'] = (filterCounts['tags'] || 0) + 1;
      if (q.filters?.status) filterCounts['status'] = (filterCounts['status'] || 0) + 1;
    });

    let mostCommonFilter: string | null = null;
    let maxCount = 0;
    Object.entries(filterCounts).forEach(([filter, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonFilter = filter;
      }
    });

    return {
      totalSearches: this.searchHistory.length,
      uniqueSearches,
      savedSearches: this.savedSearches.size,
      mostCommonFilter,
    };
  }
}

export const advancedSearchService = new AdvancedSearchService();
export default AdvancedSearchService;
