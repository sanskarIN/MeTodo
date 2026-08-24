// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: useExportImport Hook
 * 
 * Custom React hook for export and import functionality in MeTodo
 * including file handling, data transformation, and state management.
 * 
 * Features:
 * - Export management
 * - Import management
 * - File handling
 * - Progress tracking
 */

import { useState, useCallback } from 'react';
import ExportImportService, { ExportFormat, ExportOptions } from '@/lib/export-import-service';

/**
 * useExportImport hook
 */
export function useExportImport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Export tasks
   */
  const exportTasks = useCallback(
    async (tasks: any[], format: ExportFormat = 'json', filename?: string) => {
      setIsExporting(true);
      setError(null);
      setSuccess(null);

      try {
        setExportProgress(25);

        const options: ExportOptions = {
          format,
          includeCompleted: true,
          includeArchived: false,
        };

        setExportProgress(50);

        const blob = await ExportImportService.exportToFile(
          tasks,
          filename || ExportImportService.generateFilename(format),
          options
        );

        setExportProgress(75);

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || ExportImportService.generateFilename(format);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setExportProgress(100);
        setSuccess(`Successfully exported ${tasks.length} tasks`);

        return blob;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Export failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsExporting(false);
        setExportProgress(0);
      }
    },
    []
  );

  /**
   * Import tasks
   */
  const importTasks = useCallback(async (file: File) => {
    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      setImportProgress(25);

      const tasks = await ExportImportService.importFromFile(file);

      setImportProgress(50);

      const validation = ExportImportService.validateTasks(tasks);

      setImportProgress(75);

      if (!validation.valid) {
        setError(`Validation errors: ${validation.errors.join(', ')}`);
        throw new Error('Import validation failed');
      }

      setImportProgress(100);
      setSuccess(`Successfully imported ${tasks.length} tasks`);

      return tasks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Import failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  }, []);

  /**
   * Export to CSV
   */
  const exportToCSV = useCallback(
    async (tasks: any[], filename?: string) => {
      return exportTasks(tasks, 'csv', filename);
    },
    [exportTasks]
  );

  /**
   * Export to JSON
   */
  const exportToJSON = useCallback(
    async (tasks: any[], filename?: string) => {
      return exportTasks(tasks, 'json', filename);
    },
    [exportTasks]
  );

  /**
   * Create backup
   */
  const createBackup = useCallback((tasks: any[], settings: any) => {
    try {
      const backup = ExportImportService.createBackup(tasks, settings);
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `metodo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess('Backup created successfully');
      return backup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Backup creation failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Restore from backup
   */
  const restoreFromBackup = useCallback((backupContent: string) => {
    try {
      const result = ExportImportService.restoreFromBackup(backupContent);
      setSuccess('Backup restored successfully');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Backup restoration failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    isExporting,
    isImporting,
    exportProgress,
    importProgress,
    error,
    success,
    exportTasks,
    importTasks,
    exportToCSV,
    exportToJSON,
    createBackup,
    restoreFromBackup,
    clearMessages,
  };
}

export default useExportImport;
