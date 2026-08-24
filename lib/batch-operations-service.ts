// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Batch Task Operations Service
 * 
 * Service for performing bulk operations on multiple tasks.
 * Supports changing priority, adding tags, moving categories, and deletion.
 */

export interface BatchOperationResult {
  taskId: string;
  success: boolean;
  message: string;
  previousValue?: any;
  newValue?: any;
}

export interface BatchOperationStats {
  totalTasks: number;
  successCount: number;
  failureCount: number;
  results: BatchOperationResult[];
  duration: number;
}

/**
 * Batch Operations Service Class
 */
export class BatchOperationsService {
  private tasks: Map<string, any> = new Map();
  private operationHistory: Array<{
    operation: string;
    taskIds: string[];
    timestamp: Date;
    stats: BatchOperationStats;
  }> = [];

  /**
   * Constructor
   */
  constructor(tasks: any[] = []) {
    tasks.forEach((task) => {
      this.tasks.set(task.id, task);
    });
  }

  /**
   * Update tasks
   */
  updateTasks(tasks: any[]): void {
    this.tasks.clear();
    tasks.forEach((task) => {
      this.tasks.set(task.id, task);
    });
  }

  /**
   * Change priority for multiple tasks
   */
  changePriority(
    taskIds: string[],
    newPriority: 'low' | 'medium' | 'high'
  ): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = task.priority;
        task.priority = newPriority;
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: 'Priority updated',
          previousValue,
          newValue: newPriority,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('changePriority', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'changePriority',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Add tags to multiple tasks
   */
  addTags(taskIds: string[], tags: string[]): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = [...(task.tags || [])];
        task.tags = [...new Set([...(task.tags || []), ...tags])];
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: `Added ${tags.length} tags`,
          previousValue,
          newValue: task.tags,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('addTags', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'addTags',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Remove tags from multiple tasks
   */
  removeTags(taskIds: string[], tags: string[]): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = [...(task.tags || [])];
        task.tags = (task.tags || []).filter((tag: string) => !tags.includes(tag));
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: `Removed ${tags.length} tags`,
          previousValue,
          newValue: task.tags,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('removeTags', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'removeTags',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Move tasks to category
   */
  moveToCategory(taskIds: string[], category: string): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = task.category;
        task.category = category;
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: 'Category updated',
          previousValue,
          newValue: category,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('moveToCategory', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'moveToCategory',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Mark tasks as completed
   */
  markCompleted(taskIds: string[]): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = task.completed;
        task.completed = true;
        task.completedAt = new Date();
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: 'Task marked as completed',
          previousValue,
          newValue: true,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('markCompleted', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'markCompleted',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Mark tasks as pending
   */
  markPending(taskIds: string[]): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = task.completed;
        task.completed = false;
        task.completedAt = undefined;
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: 'Task marked as pending',
          previousValue,
          newValue: false,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('markPending', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'markPending',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Delete multiple tasks
   */
  deleteTasks(taskIds: string[]): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        this.tasks.delete(taskId);
        results.push({
          taskId,
          success: true,
          message: 'Task deleted',
          previousValue: task,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('deleteTasks', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'deleteTasks',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Add reminder to multiple tasks
   */
  addReminders(taskIds: string[], reminderTime: number): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = [...(task.reminders || [])];
        task.reminders = task.reminders || [];
        task.reminders.push({
          id: `reminder_${Date.now()}`,
          type: 'before_due',
          value: reminderTime,
          unit: 'minutes',
        });
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: 'Reminder added',
          previousValue,
          newValue: task.reminders,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('addReminders', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'addReminders',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Update due date for multiple tasks
   */
  updateDueDate(taskIds: string[], dueDate: Date): BatchOperationStats {
    const startTime = Date.now();
    const results: BatchOperationResult[] = [];

    taskIds.forEach((taskId) => {
      const task = this.tasks.get(taskId);
      if (!task) {
        results.push({
          taskId,
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try {
        const previousValue = task.dueDate;
        task.dueDate = dueDate;
        task.updatedAt = new Date();

        results.push({
          taskId,
          success: true,
          message: 'Due date updated',
          previousValue,
          newValue: dueDate,
        });
      } catch (error) {
        results.push({
          taskId,
          success: false,
          message: `Error: ${error}`,
        });
      }
    });

    const stats = this.createStats('updateDueDate', taskIds, results, startTime);
    this.operationHistory.push({
      operation: 'updateDueDate',
      taskIds,
      timestamp: new Date(),
      stats,
    });

    return stats;
  }

  /**
   * Create statistics object
   */
  private createStats(
    operation: string,
    taskIds: string[],
    results: BatchOperationResult[],
    startTime: number
  ): BatchOperationStats {
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return {
      totalTasks: taskIds.length,
      successCount,
      failureCount,
      results,
      duration: Date.now() - startTime,
    };
  }

  /**
   * Get operation history
   */
  getOperationHistory(limit: number = 20): Array<{
    operation: string;
    taskIds: string[];
    timestamp: Date;
    stats: BatchOperationStats;
  }> {
    return this.operationHistory.slice(-limit).reverse();
  }

  /**
   * Undo last operation
   */
  undoLastOperation(): boolean {
    if (this.operationHistory.length === 0) return false;

    const lastOp = this.operationHistory.pop();
    if (!lastOp) return false;

    // In a real app, this would restore previous values
    // For now, just log it
    console.log('Undid operation:', lastOp.operation);
    return true;
  }

  /**
   * Get batch operation statistics
   */
  getBatchStatistics(): {
    totalOperations: number;
    totalTasksAffected: number;
    successRate: number;
    mostCommonOperation: string | null;
  } {
    const totalOperations = this.operationHistory.length;
    let totalTasksAffected = 0;
    let totalSuccesses = 0;
    const operationCounts: Record<string, number> = {};

    this.operationHistory.forEach((op) => {
      totalTasksAffected += op.taskIds.length;
      totalSuccesses += op.stats.successCount;
      operationCounts[op.operation] = (operationCounts[op.operation] || 0) + 1;
    });

    let mostCommonOperation: string | null = null;
    let maxCount = 0;
    Object.entries(operationCounts).forEach(([op, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonOperation = op;
      }
    });

    const successRate = totalOperations > 0 ? (totalSuccesses / totalTasksAffected) * 100 : 0;

    return {
      totalOperations,
      totalTasksAffected,
      successRate,
      mostCommonOperation,
    };
  }
}

export const batchOperationsService = new BatchOperationsService();
export default BatchOperationsService;
