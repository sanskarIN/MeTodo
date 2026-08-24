// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Recurring Task Service
 * 
 * Service for managing recurring tasks in MeTodo including
 * automatic task generation, pattern learning, and scheduling.
 * 
 * Features:
 * - Recurring pattern management
 * - Automatic task generation
 * - Pattern learning
 * - Smart scheduling
 */

/**
 * Recurring pattern interface
 */
export interface RecurringPattern {
  id: string;
  taskId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  endDate?: Date;
  maxOccurrences?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task occurrence interface
 */
export interface TaskOccurrence {
  id: string;
  recurringPatternId: string;
  taskId: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

/**
 * Learning data interface
 */
export interface LearningData {
  patternId: string;
  completionRate: number;
  averageCompletionTime: number;
  preferredCompletionTime: string;
  lastCompletionDate: Date;
  completionTrend: 'improving' | 'declining' | 'stable';
}

/**
 * Recurring Task Service Class
 */
export class RecurringTaskService {
  private patterns: Map<string, RecurringPattern> = new Map();
  private occurrences: Map<string, TaskOccurrence> = new Map();
  private learningData: Map<string, LearningData> = new Map();

  /**
   * Create recurring pattern
   */
  createPattern(pattern: Omit<RecurringPattern, 'id' | 'createdAt' | 'updatedAt'>): RecurringPattern {
    const id = `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const newPattern: RecurringPattern = {
      ...pattern,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.patterns.set(id, newPattern);
    this.initializeLearningData(id);

    return newPattern;
  }

  /**
   * Get pattern by ID
   */
  getPattern(id: string): RecurringPattern | null {
    return this.patterns.get(id) || null;
  }

  /**
   * Update pattern
   */
  updatePattern(id: string, updates: Partial<RecurringPattern>): RecurringPattern | null {
    const pattern = this.patterns.get(id);
    if (!pattern) return null;

    const updated: RecurringPattern = {
      ...pattern,
      ...updates,
      id: pattern.id,
      createdAt: pattern.createdAt,
      updatedAt: new Date(),
    };

    this.patterns.set(id, updated);
    return updated;
  }

  /**
   * Delete pattern
   */
  deletePattern(id: string): boolean {
    return this.patterns.delete(id);
  }

  /**
   * Generate next occurrence
   */
  generateNextOccurrence(patternId: string): TaskOccurrence | null {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return null;

    const nextDueDate = this.calculateNextDueDate(pattern);
    if (!nextDueDate) return null;

    const occurrence: TaskOccurrence = {
      id: `occurrence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recurringPatternId: patternId,
      taskId: pattern.taskId,
      dueDate: nextDueDate,
      completed: false,
      createdAt: new Date(),
    };

    this.occurrences.set(occurrence.id, occurrence);
    return occurrence;
  }

  /**
   * Calculate next due date
   */
  private calculateNextDueDate(pattern: RecurringPattern): Date | null {
    const now = new Date();
    let nextDate = new Date(now);

    switch (pattern.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + pattern.interval);
        break;

      case 'weekly':
        nextDate.setDate(nextDate.getDate() + pattern.interval * 7);
        break;

      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + pattern.interval);
        break;

      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + pattern.interval);
        break;

      case 'custom':
        if (pattern.daysOfWeek) {
          nextDate = this.getNextDateByDaysOfWeek(pattern.daysOfWeek);
        } else if (pattern.daysOfMonth) {
          nextDate = this.getNextDateByDaysOfMonth(pattern.daysOfMonth);
        }
        break;
    }

    // Check if exceeds end date
    if (pattern.endDate && nextDate > pattern.endDate) {
      return null;
    }

    return nextDate;
  }

  /**
   * Get next date by days of week
   */
  private getNextDateByDaysOfWeek(daysOfWeek: number[]): Date {
    const date = new Date();
    let daysToAdd = 1;

    while (daysToAdd <= 7) {
      date.setDate(date.getDate() + 1);
      if (daysOfWeek.includes(date.getDay())) {
        return date;
      }
      daysToAdd++;
    }

    return date;
  }

  /**
   * Get next date by days of month
   */
  private getNextDateByDaysOfMonth(daysOfMonth: number[]): Date {
    const date = new Date();
    const currentDay = date.getDate();
    const nextDay = daysOfMonth.find((d) => d > currentDay);

    if (nextDay) {
      date.setDate(nextDay);
      return date;
    }

    // Move to next month
    date.setMonth(date.getMonth() + 1);
    date.setDate(daysOfMonth[0]);
    return date;
  }

  /**
   * Mark occurrence as completed
   */
  markOccurrenceCompleted(occurrenceId: string): TaskOccurrence | null {
    const occurrence = this.occurrences.get(occurrenceId);
    if (!occurrence) return null;

    occurrence.completed = true;
    occurrence.completedAt = new Date();

    // Update learning data
    this.updateLearningData(occurrence);

    return occurrence;
  }

  /**
   * Initialize learning data
   */
  private initializeLearningData(patternId: string): void {
    this.learningData.set(patternId, {
      patternId,
      completionRate: 0,
      averageCompletionTime: 0,
      preferredCompletionTime: '09:00',
      lastCompletionDate: new Date(),
      completionTrend: 'stable',
    });
  }

  /**
   * Update learning data
   */
  private updateLearningData(occurrence: TaskOccurrence): void {
    const learning = this.learningData.get(occurrence.recurringPatternId);
    if (!learning) return;

    const completionTime = occurrence.completedAt ? occurrence.completedAt.getHours() : 9;
    learning.lastCompletionDate = occurrence.completedAt || new Date();
    learning.preferredCompletionTime = `${String(completionTime).padStart(2, '0')}:00`;

    // Calculate completion rate
    const allOccurrences = Array.from(this.occurrences.values()).filter(
      (o) => o.recurringPatternId === occurrence.recurringPatternId
    );
    const completed = allOccurrences.filter((o) => o.completed).length;
    learning.completionRate = allOccurrences.length > 0 ? completed / allOccurrences.length : 0;

    // Calculate average completion time
    const completionTimes = allOccurrences
      .filter((o) => o.completedAt)
      .map((o) => o.completedAt!.getTime() - o.dueDate.getTime());

    if (completionTimes.length > 0) {
      learning.averageCompletionTime = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
    }

    // Determine trend
    if (learning.completionRate > 0.8) {
      learning.completionTrend = 'improving';
    } else if (learning.completionRate < 0.5) {
      learning.completionTrend = 'declining';
    } else {
      learning.completionTrend = 'stable';
    }
  }

  /**
   * Get learning data
   */
  getLearningData(patternId: string): LearningData | null {
    return this.learningData.get(patternId) || null;
  }

  /**
   * Get occurrences for pattern
   */
  getOccurrencesForPattern(patternId: string): TaskOccurrence[] {
    return Array.from(this.occurrences.values()).filter(
      (o) => o.recurringPatternId === patternId
    );
  }

  /**
   * Get overdue occurrences
   */
  getOverdueOccurrences(): TaskOccurrence[] {
    const now = new Date();
    return Array.from(this.occurrences.values()).filter(
      (o) => !o.completed && o.dueDate < now
    );
  }

  /**
   * Get upcoming occurrences
   */
  getUpcomingOccurrences(days: number = 7): TaskOccurrence[] {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return Array.from(this.occurrences.values())
      .filter((o) => !o.completed && o.dueDate >= now && o.dueDate <= futureDate)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  /**
   * Get completion statistics
   */
  getCompletionStats(patternId?: string): {
    totalOccurrences: number;
    completedOccurrences: number;
    completionRate: number;
    overdueCount: number;
  } {
    let occurrences = Array.from(this.occurrences.values());

    if (patternId) {
      occurrences = occurrences.filter((o) => o.recurringPatternId === patternId);
    }

    const completed = occurrences.filter((o) => o.completed).length;
    const overdue = this.getOverdueOccurrences().length;

    return {
      totalOccurrences: occurrences.length,
      completedOccurrences: completed,
      completionRate: occurrences.length > 0 ? completed / occurrences.length : 0,
      overdueCount: overdue,
    };
  }

  /**
   * Suggest pattern adjustment
   */
  suggestPatternAdjustment(patternId: string): string | null {
    const learning = this.learningData.get(patternId);
    if (!learning) return null;

    if (learning.completionTrend === 'declining') {
      return `Consider reducing frequency - completion rate is ${(learning.completionRate * 100).toFixed(0)}%`;
    }

    if (learning.completionTrend === 'improving' && learning.completionRate > 0.9) {
      return 'Great job! Consider increasing frequency for more challenges';
    }

    return null;
  }

  /**
   * Export patterns
   */
  exportPatterns(): string {
    const patterns = Array.from(this.patterns.values());
    return JSON.stringify(patterns, null, 2);
  }

  /**
   * Import patterns
   */
  importPatterns(jsonContent: string): RecurringPattern[] {
    try {
      const patterns = JSON.parse(jsonContent) as RecurringPattern[];
      const imported: RecurringPattern[] = [];

      patterns.forEach((pattern) => {
        this.patterns.set(pattern.id, pattern);
        this.initializeLearningData(pattern.id);
        imported.push(pattern);
      });

      return imported;
    } catch (error) {
      throw new Error(`Failed to import patterns: ${error}`);
    }
  }
}

export const recurringTaskService = new RecurringTaskService();
export default RecurringTaskService;
