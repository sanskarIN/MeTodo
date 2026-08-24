// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE: lib/offline-sync-queue.ts
 * PURPOSE: Offline-first synchronization queue system
 *
 * DESCRIPTION:
 * Manages task changes while offline and syncs when connection returns.
 * Ensures data consistency and prevents data loss.
 *
 * FEATURES:
 * - Queue operations while offline
 * - Automatic sync on reconnection
 * - Conflict resolution
 * - Retry logic
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  taskId?: string;
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
  synced: boolean;
}

export interface SyncStats {
  totalQueued: number;
  totalSynced: number;
  totalFailed: number;
  lastSyncTime?: number;
  nextSyncTime?: number;
}

export class OfflineSyncQueue {
  private queue: QueuedOperation[] = [];
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(stats: SyncStats) => void> = [];

  constructor() {
    this.loadQueue();
    this.setupConnectionListener();
  }

  /**
   * Load queue from storage
   */
  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('metodo_sync_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem('metodo_sync_queue', JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  /**
   * Setup connection listener
   */
  private setupConnectionListener(): void {
    // Check connection periodically
    setInterval(() => {
      this.checkConnection();
    }, 5000);
  }

  /**
   * Check connection status
   */
  private async checkConnection(): Promise<void> {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors',
      });
      const wasOffline = !this.isOnline;
      this.isOnline = true;

      if (wasOffline) {
        console.log('Connection restored, syncing...');
        await this.syncQueue();
      }
    } catch (error) {
      this.isOnline = false;
    }
  }

  /**
   * Add operation to queue
   */
  async queueOperation(
    type: 'create' | 'update' | 'delete',
    data: any,
    taskId?: string
  ): Promise<QueuedOperation> {
    const operation: QueuedOperation = {
      id: `op_${Date.now()}`,
      type,
      taskId,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
      synced: false,
    };

    this.queue.push(operation);
    await this.saveQueue();

    if (this.isOnline && !this.isSyncing) {
      await this.syncQueue();
    }

    return operation;
  }

  /**
   * Sync queue with server
   */
  async syncQueue(): Promise<SyncStats> {
    if (this.isSyncing || !this.isOnline) {
      return this.getStats();
    }

    this.isSyncing = true;

    try {
      const unsyncedOps = this.queue.filter(op => !op.synced);

      for (const op of unsyncedOps) {
        try {
          await this.syncOperation(op);
          op.synced = true;
          op.retries = 0;
        } catch (error) {
          op.retries++;
          if (op.retries >= op.maxRetries) {
            console.error(`Operation ${op.id} failed after ${op.maxRetries} retries`);
          }
        }
      }

      // Remove synced operations
      this.queue = this.queue.filter(op => !op.synced || op.retries > 0);
      await this.saveQueue();
    } finally {
      this.isSyncing = false;
    }

    return this.getStats();
  }

  /**
   * Sync single operation
   */
  private async syncOperation(op: QueuedOperation): Promise<void> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // 90% success rate
          resolve();
        } else {
          reject(new Error('Sync failed'));
        }
      }, 1000);
    });
  }

  /**
   * Get queue statistics
   */
  getStats(): SyncStats {
    const synced = this.queue.filter(op => op.synced).length;
    const failed = this.queue.filter(op => op.retries >= op.maxRetries).length;

    return {
      totalQueued: this.queue.length,
      totalSynced: synced,
      totalFailed: failed,
      lastSyncTime: this.queue.length > 0 ? this.queue[this.queue.length - 1].timestamp : undefined,
    };
  }

  /**
   * Get queue
   */
  getQueue(): QueuedOperation[] {
    return [...this.queue];
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await AsyncStorage.removeItem('metodo_sync_queue');
    this.notifyListeners();
  }

  /**
   * Retry failed operations
   */
  async retryFailed(): Promise<SyncStats> {
    const failed = this.queue.filter(op => op.retries > 0 && op.retries < op.maxRetries);
    failed.forEach(op => {
      op.retries = 0;
    });
    await this.saveQueue();
    return this.syncQueue();
  }

  /**
   * Remove operation from queue
   */
  async removeOperation(opId: string): Promise<void> {
    this.queue = this.queue.filter(op => op.id !== opId);
    await this.saveQueue();
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: (stats: SyncStats) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    const stats = this.getStats();
    this.listeners.forEach(listener => listener(stats));
  }

  /**
   * Get online status
   */
  isConnected(): boolean {
    return this.isOnline;
  }

  /**
   * Get sync status
   */
  isSyncingNow(): boolean {
    return this.isSyncing;
  }

  /**
   * Merge conflicts
   */
  resolveConflict(
    local: any,
    remote: any,
    strategy: 'local' | 'remote' | 'merge' = 'merge'
  ): any {
    switch (strategy) {
      case 'local':
        return local;
      case 'remote':
        return remote;
      case 'merge':
        return {
          ...remote,
          ...local,
          updatedAt: Math.max(
            new Date(local.updatedAt).getTime(),
            new Date(remote.updatedAt).getTime()
          ),
        };
      default:
        return local;
    }
  }

  /**
   * Get pending operations for task
   */
  getPendingOperations(taskId: string): QueuedOperation[] {
    return this.queue.filter(op => op.taskId === taskId && !op.synced);
  }

  /**
   * Get operation history
   */
  getOperationHistory(limit: number = 50): QueuedOperation[] {
    return this.queue.slice(-limit).reverse();
  }

  /**
   * Export queue for debugging
   */
  exportQueue(): string {
    return JSON.stringify(this.queue, null, 2);
  }

  /**
   * Import queue from backup
   */
  async importQueue(data: string): Promise<void> {
    try {
      this.queue = JSON.parse(data);
      await this.saveQueue();
    } catch (error) {
      console.error('Error importing queue:', error);
      throw error;
    }
  }
}

export const offlineSyncQueue = new OfflineSyncQueue();
export default OfflineSyncQueue;
