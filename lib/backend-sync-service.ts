// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Backend Sync Service
 * 
 * This service handles real-time synchronization between the local app state
 * and the backend server. It manages task syncing, conflict resolution, and
 * ensures data consistency across devices.
 * 
 * Features:
 * - Real-time task synchronization
 * - Conflict resolution
 * - Offline queue management
 * - Batch sync operations
 * - Sync status tracking
 * - Error handling and retry logic
 */

import { Task, Category, AppSettings, AvatarCustomization } from "@/types";

/**
 * Sync status enum
 */
export enum SyncStatus {
  IDLE = "idle",
  SYNCING = "syncing",
  SUCCESS = "success",
  ERROR = "error",
  CONFLICT = "conflict",
}

/**
 * Sync operation interface
 */
export interface SyncOperation {
  id: string;
  type: "create" | "update" | "delete";
  entity: "task" | "category" | "settings" | "avatar";
  data: any;
  timestamp: number;
  status: SyncStatus;
  retries: number;
  lastError?: string;
}

/**
 * Sync conflict interface
 */
export interface SyncConflict {
  id: string;
  localVersion: any;
  remoteVersion: any;
  timestamp: number;
  resolved: boolean;
  resolution?: "local" | "remote" | "merged";
}

/**
 * Backend Sync Service Class
 */
export class BackendSyncService {
  private static syncQueue: SyncOperation[] = [];
  private static conflicts: SyncConflict[] = [];
  private static syncStatus: SyncStatus = SyncStatus.IDLE;
  private static lastSyncTime: number = 0;
  private static syncInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Initialize sync service
   */
  static async initialize(): Promise<void> {
    try {
      // Load sync queue from storage
      await this.loadSyncQueue();
      
      // Start periodic sync
      this.startPeriodicSync();
      
      console.log("[BackendSync] Service initialized");
    } catch (error) {
      console.error("[BackendSync] Initialization error:", error);
    }
  }

  /**
   * Queue a sync operation
   */
  static async queueOperation(
    type: "create" | "update" | "delete",
    entity: "task" | "category" | "settings" | "avatar",
    data: any
  ): Promise<void> {
    const operation: SyncOperation = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      entity,
      data,
      timestamp: Date.now(),
      status: SyncStatus.IDLE,
      retries: 0,
    };

    this.syncQueue.push(operation);
    await this.saveSyncQueue();
    
    // Trigger immediate sync if online
    if (await this.isOnline()) {
      await this.syncNow();
    }
  }

  /**
   * Sync all queued operations
   */
  static async syncNow(): Promise<void> {
    if (this.syncStatus === SyncStatus.SYNCING) {
      console.log("[BackendSync] Sync already in progress");
      return;
    }

    this.syncStatus = SyncStatus.SYNCING;

    try {
      const operationsToSync = this.syncQueue.filter(
        (op) => op.status === SyncStatus.IDLE || op.status === SyncStatus.ERROR
      );

      if (operationsToSync.length === 0) {
        this.syncStatus = SyncStatus.SUCCESS;
        return;
      }

      // Process operations in batches
      const batchSize = 10;
      for (let i = 0; i < operationsToSync.length; i += batchSize) {
        const batch = operationsToSync.slice(i, i + batchSize);
        await this.processBatch(batch);
      }

      this.lastSyncTime = Date.now();
      this.syncStatus = SyncStatus.SUCCESS;
      
      console.log("[BackendSync] Sync completed successfully");
    } catch (error) {
      this.syncStatus = SyncStatus.ERROR;
      console.error("[BackendSync] Sync error:", error);
    }
  }

  /**
   * Process a batch of sync operations
   */
  private static async processBatch(operations: SyncOperation[]): Promise<void> {
    for (const operation of operations) {
      try {
        operation.status = SyncStatus.SYNCING;
        await this.sendOperation(operation);
        operation.status = SyncStatus.SUCCESS;
      } catch (error) {
        operation.retries++;
        if (operation.retries >= 3) {
          operation.status = SyncStatus.ERROR;
          operation.lastError = String(error);
        } else {
          operation.status = SyncStatus.IDLE;
        }
      }
    }

    // Remove successful operations from queue
    this.syncQueue = this.syncQueue.filter(
      (op) => op.status !== SyncStatus.SUCCESS
    );
    await this.saveSyncQueue();
  }

  /**
   * Send operation to backend
   */
  private static async sendOperation(operation: SyncOperation): Promise<void> {
    const endpoint = `/api/sync/${operation.entity}`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: operation.type,
        data: operation.data,
        timestamp: operation.timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Handle conflicts
    if (result.conflict) {
      await this.handleConflict(operation, result.remoteVersion);
    }
  }

  /**
   * Handle sync conflicts
   */
  private static async handleConflict(
    operation: SyncOperation,
    remoteVersion: any
  ): Promise<void> {
    const conflict: SyncConflict = {
      id: operation.id,
      localVersion: operation.data,
      remoteVersion,
      timestamp: Date.now(),
      resolved: false,
    };

    this.conflicts.push(conflict);
    this.syncStatus = SyncStatus.CONFLICT;
    
    console.log("[BackendSync] Conflict detected:", conflict);
  }

  /**
   * Resolve a conflict
   */
  static async resolveConflict(
    conflictId: string,
    resolution: "local" | "remote" | "merged",
    mergedData?: any
  ): Promise<void> {
    const conflict = this.conflicts.find((c) => c.id === conflictId);
    if (!conflict) {
      throw new Error("Conflict not found");
    }

    conflict.resolved = true;
    conflict.resolution = resolution;

    let dataToSync: any;
    if (resolution === "local") {
      dataToSync = conflict.localVersion;
    } else if (resolution === "remote") {
      dataToSync = conflict.remoteVersion;
    } else {
      dataToSync = mergedData || conflict.localVersion;
    }

    // Re-queue operation with resolved data
    const operation = this.syncQueue.find((op) => op.id === conflictId);
    if (operation) {
      operation.data = dataToSync;
      operation.status = SyncStatus.IDLE;
      await this.saveSyncQueue();
      await this.syncNow();
    }
  }

  /**
   * Get all conflicts
   */
  static getConflicts(): SyncConflict[] {
    return this.conflicts.filter((c) => !c.resolved);
  }

  /**
   * Get sync status
   */
  static getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  /**
   * Get pending operations count
   */
  static getPendingOperationsCount(): number {
    return this.syncQueue.filter(
      (op) => op.status === SyncStatus.IDLE || op.status === SyncStatus.ERROR
    ).length;
  }

  /**
   * Get last sync time
   */
  static getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  /**
   * Check if online
   */
  private static async isOnline(): Promise<boolean> {
    try {
      const response = await fetch("https://www.google.com", {
        method: "HEAD",
        mode: "no-cors",
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Start periodic sync
   */
  private static startPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync every 30 seconds
    this.syncInterval = setInterval(async () => {
      if (await this.isOnline() && this.syncStatus !== SyncStatus.SYNCING) {
        await this.syncNow();
      }
    }, 30000);
  }

  /**
   * Stop periodic sync
   */
  static stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Save sync queue to storage
   */
  private static async saveSyncQueue(): Promise<void> {
    try {
      // This would be saved to AsyncStorage or backend
      console.log("[BackendSync] Queue saved:", this.syncQueue.length);
    } catch (error) {
      console.error("[BackendSync] Error saving queue:", error);
    }
  }

  /**
   * Load sync queue from storage
   */
  private static async loadSyncQueue(): Promise<void> {
    try {
      // This would be loaded from AsyncStorage or backend
      console.log("[BackendSync] Queue loaded");
    } catch (error) {
      console.error("[BackendSync] Error loading queue:", error);
    }
  }

  /**
   * Clear all sync data
   */
  static async clearSyncData(): Promise<void> {
    this.syncQueue = [];
    this.conflicts = [];
    this.syncStatus = SyncStatus.IDLE;
    this.lastSyncTime = 0;
    await this.saveSyncQueue();
    console.log("[BackendSync] Sync data cleared");
  }

  /**
   * Get sync statistics
   */
  static getSyncStats(): {
    pendingOperations: number;
    conflicts: number;
    status: SyncStatus;
    lastSyncTime: number;
    successRate: number;
  } {
    const totalOperations = this.syncQueue.length;
    const successfulOperations = this.syncQueue.filter(
      (op) => op.status === SyncStatus.SUCCESS
    ).length;
    const successRate =
      totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 100;

    return {
      pendingOperations: this.getPendingOperationsCount(),
      conflicts: this.getConflicts().length,
      status: this.syncStatus,
      lastSyncTime: this.lastSyncTime,
      successRate,
    };
  }
}

export default BackendSyncService;
