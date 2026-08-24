// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Export & Import Service
 * 
 * Comprehensive export and import service for MeTodo including
 * CSV export, JSON export, task import, and data backup/restore.
 * 
 * Features:
 * - CSV export
 * - JSON export
 * - Task import
 * - Data backup
 * - Data restore
 */

/**
 * Export format type
 */
export type ExportFormat = 'csv' | 'json';

/**
 * Export options interface
 */
export interface ExportOptions {
  format: ExportFormat;
  includeCompleted?: boolean;
  includeArchived?: boolean;
  dateFormat?: string;
}

/**
 * Import options interface
 */
export interface ImportOptions {
  merge?: boolean;
  overwrite?: boolean;
  validateData?: boolean;
}

/**
 * Export/Import Service Class
 */
export class ExportImportService {
  /**
   * Export tasks to CSV
   */
  static exportToCSV(tasks: any[]): string {
    if (tasks.length === 0) {
      return 'No tasks to export';
    }

    // Get all unique keys from tasks
    const keys = new Set<string>();
    tasks.forEach((task) => {
      Object.keys(task).forEach((key) => keys.add(key));
    });

    const headers = Array.from(keys);
    const rows: string[] = [];

    // Add header row
    rows.push(headers.map((h) => this.escapeCSV(h)).join(','));

    // Add data rows
    tasks.forEach((task) => {
      const row = headers.map((header) => {
        const value = task[header];
        return this.escapeCSV(this.formatValue(value));
      });
      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  /**
   * Export tasks to JSON
   */
  static exportToJSON(tasks: any[], pretty: boolean = true): string {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      taskCount: tasks.length,
      tasks,
    };

    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  /**
   * Export tasks to file
   */
  static async exportToFile(
    tasks: any[],
    filename: string,
    options: ExportOptions
  ): Promise<Blob> {
    let content: string;

    if (options.format === 'csv') {
      content = this.exportToCSV(tasks);
    } else {
      content = this.exportToJSON(tasks);
    }

    return new Blob([content], {
      type: options.format === 'csv' ? 'text/csv' : 'application/json',
    });
  }

  /**
   * Import tasks from CSV
   */
  static importFromCSV(csvContent: string): any[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Invalid CSV format');
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const tasks: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        continue;
      }

      const task: any = {};
      headers.forEach((header, index) => {
        task[header] = values[index];
      });

      tasks.push(task);
    }

    return tasks;
  }

  /**
   * Import tasks from JSON
   */
  static importFromJSON(jsonContent: string): any[] {
    try {
      const data = JSON.parse(jsonContent);

      if (Array.isArray(data)) {
        return data;
      }

      if (data.tasks && Array.isArray(data.tasks)) {
        return data.tasks;
      }

      throw new Error('Invalid JSON format');
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }

  /**
   * Import tasks from file
   */
  static async importFromFile(file: File, options?: ImportOptions): Promise<any[]> {
    const content = await file.text();

    if (file.name.endsWith('.csv')) {
      return this.importFromCSV(content);
    } else if (file.name.endsWith('.json')) {
      return this.importFromJSON(content);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  /**
   * Validate imported tasks
   */
  static validateTasks(tasks: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    tasks.forEach((task, index) => {
      if (!task.title || typeof task.title !== 'string') {
        errors.push(`Task ${index + 1}: Missing or invalid title`);
      }

      if (task.priority && !['low', 'medium', 'high', 'urgent'].includes(task.priority)) {
        errors.push(`Task ${index + 1}: Invalid priority`);
      }

      if (task.status && !['pending', 'in-progress', 'completed', 'cancelled'].includes(task.status)) {
        errors.push(`Task ${index + 1}: Invalid status`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create backup
   */
  static createBackup(tasks: any[], settings: any): string {
    const backup = {
      version: '1.0.0',
      backupDate: new Date().toISOString(),
      data: {
        tasks,
        settings,
      },
    };

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Restore from backup
   */
  static restoreFromBackup(backupContent: string): {
    tasks: any[];
    settings: any;
  } {
    try {
      const backup = JSON.parse(backupContent);

      if (!backup.data || !backup.data.tasks) {
        throw new Error('Invalid backup format');
      }

      return {
        tasks: backup.data.tasks || [],
        settings: backup.data.settings || {},
      };
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error}`);
    }
  }

  /**
   * Merge tasks
   */
  static mergeTasks(existing: any[], imported: any[]): any[] {
    const merged = [...existing];
    const existingIds = new Set(existing.map((t) => t.id));

    imported.forEach((task) => {
      if (!existingIds.has(task.id)) {
        merged.push(task);
      }
    });

    return merged;
  }

  /**
   * Escape CSV value
   */
  private static escapeCSV(value: string): string {
    if (!value) return '';

    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }

  /**
   * Parse CSV line
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  /**
   * Format value for export
   */
  private static formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.join('; ');
      }

      if (value instanceof Date) {
        return value.toISOString();
      }

      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Generate filename with timestamp
   */
  static generateFilename(format: ExportFormat, prefix: string = 'metodo'): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const extension = format === 'csv' ? 'csv' : 'json';
    return `${prefix}-${timestamp}.${extension}`;
  }

  /**
   * Get export statistics
   */
  static getExportStats(tasks: any[]): {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const stats = {
      totalTasks: tasks.length,
      completedTasks: 0,
      pendingTasks: 0,
      byPriority: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    tasks.forEach((task) => {
      if (task.status === 'completed') {
        stats.completedTasks++;
      } else if (task.status === 'pending') {
        stats.pendingTasks++;
      }

      if (task.priority) {
        stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
      }

      if (task.category) {
        stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
      }
    });

    return stats;
  }
}

export default ExportImportService;
