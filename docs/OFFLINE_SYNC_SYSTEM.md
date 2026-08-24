// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# MeTodo Offline Sync System Documentation

## Overview

The Offline Sync Queue system ensures that MeTodo maintains data consistency even when users are offline. All task changes are queued and automatically synced when connection is restored.

---

## How It Works

### 1. Queue Operations

When offline, all task operations are queued:

```typescript
import { offlineSyncQueue } from '@/lib/offline-sync-queue';

// Queue a task creation
await offlineSyncQueue.queueOperation('create', {
  title: 'New Task',
  priority: 'high',
  completed: false,
});

// Queue a task update
await offlineSyncQueue.queueOperation('update', {
  title: 'Updated Task',
  priority: 'medium',
}, 'task_123');

// Queue a task deletion
await offlineSyncQueue.queueOperation('delete', {}, 'task_123');
```

### 2. Automatic Sync

When connection is restored, the system automatically syncs all queued operations:

```typescript
// Subscribe to sync status
const unsubscribe = offlineSyncQueue.subscribe((stats) => {
  console.log('Sync stats:', stats);
  // {
  //   totalQueued: 5,
  //   totalSynced: 3,
  //   totalFailed: 0,
  //   lastSyncTime: 1625097600000,
  // }
});
```

### 3. Conflict Resolution

If conflicts occur during sync, the system uses configurable strategies:

```typescript
// Resolve conflict with merge strategy
const resolved = offlineSyncQueue.resolveConflict(
  localData,
  remoteData,
  'merge' // 'local', 'remote', or 'merge'
);
```

---

## API Reference

### offlineSyncQueue.queueOperation()

Queue an operation for sync.

```typescript
const operation = await offlineSyncQueue.queueOperation(
  'create',
  { title: 'Task', priority: 'high' },
  'task_id' // optional
);
```

**Parameters:**
- `type`: Operation type ('create', 'update', 'delete')
- `data`: Operation data
- `taskId`: Optional task ID for update/delete

**Returns:** QueuedOperation object

---

### offlineSyncQueue.syncQueue()

Manually trigger sync.

```typescript
const stats = await offlineSyncQueue.syncQueue();
```

**Returns:** SyncStats object with queue information

---

### offlineSyncQueue.getStats()

Get current queue statistics.

```typescript
const stats = offlineSyncQueue.getStats();
// {
//   totalQueued: 5,
//   totalSynced: 3,
//   totalFailed: 0,
//   lastSyncTime: 1625097600000,
// }
```

---

### offlineSyncQueue.getQueue()

Get all queued operations.

```typescript
const queue = offlineSyncQueue.getQueue();
```

---

### offlineSyncQueue.clearQueue()

Clear all queued operations.

```typescript
await offlineSyncQueue.clearQueue();
```

---

### offlineSyncQueue.retryFailed()

Retry failed operations.

```typescript
const stats = await offlineSyncQueue.retryFailed();
```

---

### offlineSyncQueue.removeOperation()

Remove specific operation from queue.

```typescript
await offlineSyncQueue.removeOperation('op_1625097600000');
```

---

### offlineSyncQueue.subscribe()

Subscribe to sync status changes.

```typescript
const unsubscribe = offlineSyncQueue.subscribe((stats) => {
  console.log('Queue updated:', stats);
});

// Unsubscribe
unsubscribe();
```

---

### offlineSyncQueue.isConnected()

Check if device is online.

```typescript
if (offlineSyncQueue.isConnected()) {
  console.log('Device is online');
}
```

---

### offlineSyncQueue.isSyncingNow()

Check if sync is in progress.

```typescript
if (offlineSyncQueue.isSyncingNow()) {
  console.log('Syncing...');
}
```

---

## Usage Examples

### Example 1: Basic Task Creation with Offline Support

```typescript
import { useTaskContext } from '@/lib/task-context';
import { offlineSyncQueue } from '@/lib/offline-sync-queue';

export function TaskCreationScreen() {
  const { addTask } = useTaskContext();

  const handleCreateTask = async (taskData) => {
    try {
      // Queue operation for sync
      await offlineSyncQueue.queueOperation('create', taskData);
      
      // Add to local state
      await addTask(taskData);
      
      console.log('Task created and queued for sync');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    // UI components
  );
}
```

### Example 2: Monitor Sync Status

```typescript
import { useEffect, useState } from 'react';
import { offlineSyncQueue } from '@/lib/offline-sync-queue';

export function SyncStatusIndicator() {
  const [stats, setStats] = useState(offlineSyncQueue.getStats());
  const [isOnline, setIsOnline] = useState(offlineSyncQueue.isConnected());

  useEffect(() => {
    const unsubscribe = offlineSyncQueue.subscribe(setStats);
    return unsubscribe;
  }, []);

  return (
    <View>
      <Text>
        {isOnline ? '🟢 Online' : '🔴 Offline'}
      </Text>
      <Text>
        Queued: {stats.totalQueued} | Synced: {stats.totalSynced}
      </Text>
    </View>
  );
}
```

### Example 3: Retry Failed Syncs

```typescript
import { offlineSyncQueue } from '@/lib/offline-sync-queue';

export async function retryFailedOperations() {
  try {
    const stats = await offlineSyncQueue.retryFailed();
    console.log('Retry complete:', stats);
  } catch (error) {
    console.error('Retry failed:', error);
  }
}
```

### Example 4: Export Queue for Debugging

```typescript
import { offlineSyncQueue } from '@/lib/offline-sync-queue';

export function debugQueue() {
  const queueData = offlineSyncQueue.exportQueue();
  console.log('Queue data:', queueData);
  
  // Can be used for bug reports
  return queueData;
}
```

---

## Configuration

### Retry Settings

Modify retry behavior in `OfflineSyncQueue`:

```typescript
// In lib/offline-sync-queue.ts
const operation: QueuedOperation = {
  // ...
  maxRetries: 3, // Change retry count
  // ...
};
```

### Sync Interval

Change sync check interval:

```typescript
// In setupConnectionListener()
setInterval(() => {
  this.checkConnection();
}, 5000); // Change interval (ms)
```

---

## Best Practices

1. **Always Queue Before Local Update**
   ```typescript
   await offlineSyncQueue.queueOperation('create', data);
   await addTask(data);
   ```

2. **Monitor Sync Status**
   ```typescript
   offlineSyncQueue.subscribe((stats) => {
     if (stats.totalFailed > 0) {
       showErrorNotification('Some changes failed to sync');
     }
   });
   ```

3. **Handle Conflicts Gracefully**
   ```typescript
   const resolved = offlineSyncQueue.resolveConflict(
     local,
     remote,
     'merge'
   );
   ```

4. **Clear Old Operations**
   ```typescript
   // Periodically clear synced operations
   const queue = offlineSyncQueue.getQueue();
   const old = queue.filter(op => 
     op.synced && 
     Date.now() - op.timestamp > 86400000 // 24 hours
   );
   ```

---

## Troubleshooting

### Queue Not Syncing

**Problem:** Operations remain in queue after connection restored

**Solutions:**
1. Check connection status: `offlineSyncQueue.isConnected()`
2. Manually trigger sync: `await offlineSyncQueue.syncQueue()`
3. Check for failed operations: `offlineSyncQueue.getStats()`

### Sync Conflicts

**Problem:** Data conflicts when syncing

**Solutions:**
1. Use merge strategy: `resolveConflict(local, remote, 'merge')`
2. Implement custom conflict resolution
3. Use timestamps for conflict detection

### Memory Issues

**Problem:** Queue grows too large

**Solutions:**
1. Periodically clear old operations
2. Reduce max retries
3. Implement queue size limits

---

## Support

For issues with offline sync:

**Email:** supportramsandesh@gmail.com  
**Response Time:** 24-48 hours

Include:
- Queue export data
- Connection status
- Device/platform info
- Steps to reproduce

---

**Last Updated:** June 30, 2026  
**Version:** 1.0.0
