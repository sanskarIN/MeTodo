// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Synchronization Utilities
 * 
 * Comprehensive synchronization utilities for MeTodo including
 * offline-first sync, conflict resolution, and data reconciliation.
 * 
 * Features:
 * - Offline sync queue
 * - Conflict resolution
 * - Data reconciliation
 * - Sync status tracking
 */

/**
 * Sync action interface
 */
export interface SyncAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'task' | 'theme' | 'avatar' | 'settings';
  entityId: string;
  data: any;
  timestamp: number;
  synced: boolean;
  retries: number;
}

/**
 * Sync conflict interface
 */
export interface SyncConflict {
  id: string;
  entityId: string;
  localVersion: any;
  remoteVersion: any;
  timestamp: number;
  resolved: boolean;
  resolution?: 'local' | 'remote' | 'merged';
}

/**
 * Sync status interface
 */
export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime?: number;
  pendingActions: number;
  failedActions: number;
  conflicts: number;
  syncProgress: number;
}

/**
 * Synchronization utility class
 */
export class SyncUtil {
  private static instance: SyncUtil;
  private syncQueue: Map<string, SyncAction> = new Map();
  private conflicts: Map<string, SyncConflict> = new Map();
  private syncStatus: SyncStatus = {
    isSyncing: false,
    pendingActions: 0,
    failedActions: 0,
    conflicts: 0,
    syncProgress: 0,
  };

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): SyncUtil {
    if (!SyncUtil.instance) {
      SyncUtil.instance = new SyncUtil();
    }
    return SyncUtil.instance;
  }

  /**
   * Add action to sync queue
   */
  addToQueue(action: Omit<SyncAction, 'id' | 'timestamp' | 'synced' | 'retries'>): SyncAction {
    const syncAction: SyncAction = {
      ...action,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false,
      retries: 0,
    };

    this.syncQueue.set(syncAction.id, syncAction);
    this.updateSyncStatus();

    return syncAction;
  }

  /**
   * Get pending actions
   */
  getPendingActions(): SyncAction[] {
    return Array.from(this.syncQueue.values()).filter((action) => !action.synced);
  }

  /**
   * Get failed actions
   */
  getFailedActions(): SyncAction[] {
    return Array.from(this.syncQueue.values()).filter((action) => action.retries > 0 && !action.synced);
  }

  /**
   * Mark action as synced
   */
  markAsSynced(actionId: string): boolean {
    const action = this.syncQueue.get(actionId);
    if (!action) return false;

    action.synced = true;
    this.updateSyncStatus();

    return true;
  }

  /**
   * Mark action as failed
   */
  markAsFailed(actionId: string): boolean {
    const action = this.syncQueue.get(actionId);
    if (!action) return false;

    action.retries++;
    this.updateSyncStatus();

    return true;
  }

  /**
   * Remove action from queue
   */
  removeFromQueue(actionId: string): boolean {
    return this.syncQueue.delete(actionId);
  }

  /**
   * Clear sync queue
   */
  clearQueue(): void {
    this.syncQueue.clear();
    this.updateSyncStatus();
  }

  /**
   * Detect conflict
   */
  detectConflict(
    entityId: string,
    localVersion: any,
    remoteVersion: any
  ): SyncConflict {
    const conflict: SyncConflict = {
      id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entityId,
      localVersion,
      remoteVersion,
      timestamp: Date.now(),
      resolved: false,
    };

    this.conflicts.set(conflict.id, conflict);
    this.updateSyncStatus();

    return conflict;
  }

  /**
   * Resolve conflict - local version wins
   */
  resolveConflictLocal(conflictId: string): boolean {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return false;

    conflict.resolved = true;
    conflict.resolution = 'local';
    this.updateSyncStatus();

    return true;
  }

  /**
   * Resolve conflict - remote version wins
   */
  resolveConflictRemote(conflictId: string): boolean {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return false;

    conflict.resolved = true;
    conflict.resolution = 'remote';
    this.updateSyncStatus();

    return true;
  }

  /**
   * Resolve conflict - merge versions
   */
  resolveConflictMerged(conflictId: string, mergedVersion: any): boolean {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return false;

    conflict.resolved = true;
    conflict.resolution = 'merged';
    conflict.localVersion = mergedVersion;
    this.updateSyncStatus();

    return true;
  }

  /**
   * Get unresolved conflicts
   */
  getUnresolvedConflicts(): SyncConflict[] {
    return Array.from(this.conflicts.values()).filter((c) => !c.resolved);
  }

  /**
   * Merge objects
   */
  mergeObjects(local: any, remote: any): any {
    const merged = { ...local };

    Object.keys(remote).forEach((key) => {
      if (typeof remote[key] === 'object' && typeof local[key] === 'object') {
        merged[key] = this.mergeObjects(local[key], remote[key]);
      } else if (remote[key] !== undefined) {
        // Remote version is newer if it has a timestamp
        if (remote[key].timestamp && local[key].timestamp) {
          merged[key] = remote[key].timestamp > local[key].timestamp ? remote[key] : local[key];
        } else {
          merged[key] = remote[key];
        }
      }
    });

    return merged;
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Start sync
   */
  startSync(): void {
    this.syncStatus.isSyncing = true;
    this.syncStatus.syncProgress = 0;
  }

  /**
   * Update sync progress
   */
  updateSyncProgress(progress: number): void {
    this.syncStatus.syncProgress = Math.min(100, Math.max(0, progress));
  }

  /**
   * Complete sync
   */
  completeSync(): void {
    this.syncStatus.isSyncing = false;
    this.syncStatus.lastSyncTime = Date.now();
    this.syncStatus.syncProgress = 100;
  }

  /**
   * Update sync status
   */
  private updateSyncStatus(): void {
    this.syncStatus.pendingActions = this.getPendingActions().length;
    this.syncStatus.failedActions = this.getFailedActions().length;
    this.syncStatus.conflicts = this.getUnresolvedConflicts().length;
  }

  /**
   * Get sync queue size
   */
  getQueueSize(): number {
    return this.syncQueue.size;
  }

  /**
   * Get sync statistics
   */
  getStats(): {
    totalActions: number;
    syncedActions: number;
    pendingActions: number;
    failedActions: number;
    totalConflicts: number;
    resolvedConflicts: number;
    unresolvedConflicts: number;
  } {
    const allActions = Array.from(this.syncQueue.values());
    const allConflicts = Array.from(this.conflicts.values());

    return {
      totalActions: allActions.length,
      syncedActions: allActions.filter((a) => a.synced).length,
      pendingActions: this.getPendingActions().length,
      failedActions: this.getFailedActions().length,
      totalConflicts: allConflicts.length,
      resolvedConflicts: allConflicts.filter((c) => c.resolved).length,
      unresolvedConflicts: this.getUnresolvedConflicts().length,
    };
  }

  /**
   * Export sync queue
   */
  exportQueue(): string {
    const queue = Array.from(this.syncQueue.values());
    return JSON.stringify(queue, null, 2);
  }

  /**
   * Import sync queue
   */
  importQueue(jsonContent: string): void {
    try {
      const queue = JSON.parse(jsonContent) as SyncAction[];
      this.syncQueue.clear();

      queue.forEach((action) => {
        this.syncQueue.set(action.id, action);
      });

      this.updateSyncStatus();
    } catch (error) {
      throw new Error(`Failed to import sync queue: ${error}`);
    }
  }

  /**
   * Clear old sync actions
   */
  clearOldActions(olderThanMs: number = 7 * 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    const cutoff = now - olderThanMs;
    let removed = 0;

    this.syncQueue.forEach((action, id) => {
      if (action.timestamp < cutoff && action.synced) {
        this.syncQueue.delete(id);
        removed++;
      }
    });

    this.updateSyncStatus();
    return removed;
  }
}

export const syncUtil = SyncUtil.getInstance();
export default SyncUtil;
