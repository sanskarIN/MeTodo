# Backend Sync Integration Guide

## Overview

The Backend Sync Service provides real-time synchronization between the local app state and the backend server. This guide covers the complete implementation, usage, and best practices for integrating backend sync into your MeTodo application.

## Table of Contents

1. [Architecture](#architecture)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Sync Operations](#sync-operations)
6. [Conflict Resolution](#conflict-resolution)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Architecture

### Components

The Backend Sync system consists of three main components:

#### 1. Backend Sync Service (`lib/backend-sync-service.ts`)
- Manages sync queue
- Handles conflict detection and resolution
- Provides sync status tracking
- Implements retry logic

#### 2. Collaboration UI Service (`lib/collaboration-ui-service.ts`)
- Manages shared tasks
- Handles permissions
- Tracks activity logs
- Manages comments and assignments

#### 3. Server Routes (`server/routers.ts`)
- Receives sync operations
- Validates data
- Manages database persistence
- Broadcasts updates to collaborators

### Sync Flow

```
Local Change
    ↓
Queue Operation
    ↓
Check Online Status
    ↓
Send to Backend
    ↓
Backend Validation
    ↓
Database Update
    ↓
Broadcast to Collaborators
    ↓
Update Local State
```

## Installation

### 1. Import Services

```typescript
import BackendSyncService from "@/lib/backend-sync-service";
import CollaborationUIService from "@/lib/collaboration-ui-service";
```

### 2. Initialize Services

In your app's root layout or main component:

```typescript
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Initialize sync service
    BackendSyncService.initialize();

    return () => {
      BackendSyncService.stopPeriodicSync();
    };
  }, []);

  return (
    // Your app components
  );
}
```

## Configuration

### Sync Interval

The default sync interval is 30 seconds. To customize:

```typescript
// Modify the interval in BackendSyncService.startPeriodicSync()
// Change 30000 (milliseconds) to your desired interval
this.syncInterval = setInterval(async () => {
  // sync logic
}, 30000); // Change this value
```

### Batch Size

The default batch size is 10 operations. To customize:

```typescript
// Modify in BackendSyncService.syncNow()
const batchSize = 10; // Change this value
```

### Retry Configuration

The default retry limit is 3 attempts. To customize:

```typescript
// Modify in BackendSyncService.processBatch()
if (operation.retries >= 3) { // Change 3 to desired limit
  operation.status = SyncStatus.ERROR;
}
```

## Usage

### Basic Task Sync

#### Create Task

```typescript
import { useTaskContext } from "@/lib/task-context";
import BackendSyncService from "@/lib/backend-sync-service";

export function CreateTaskScreen() {
  const { addTask } = useTaskContext();

  const handleCreateTask = async (taskData) => {
    // Create task locally
    const task = await addTask(taskData);

    // Queue for backend sync
    await BackendSyncService.queueOperation("create", "task", task);
  };

  return (
    // Your UI
  );
}
```

#### Update Task

```typescript
const handleUpdateTask = async (taskId, updates) => {
  // Update task locally
  const updatedTask = await updateTask(taskId, updates);

  // Queue for backend sync
  await BackendSyncService.queueOperation("update", "task", updatedTask);
};
```

#### Delete Task

```typescript
const handleDeleteTask = async (taskId) => {
  // Delete task locally
  await deleteTask(taskId);

  // Queue for backend sync
  await BackendSyncService.queueOperation("delete", "task", { id: taskId });
};
```

### Task Sharing

#### Share Task

```typescript
import CollaborationUIService from "@/lib/collaboration-ui-service";

const handleShareTask = async (taskId, emails) => {
  const sharedTask = await CollaborationUIService.shareTask(
    taskId,
    emails,
    PermissionLevel.EDIT
  );

  // Queue for backend sync
  await BackendSyncService.queueOperation("create", "task", sharedTask);
};
```

#### Manage Permissions

```typescript
const handleUpdatePermission = async (taskId, memberId, permission) => {
  await CollaborationUIService.updateMemberPermission(
    taskId,
    memberId,
    permission
  );

  // Queue for backend sync
  await BackendSyncService.queueOperation("update", "task", {
    taskId,
    memberId,
    permission,
  });
};
```

#### Remove Member

```typescript
const handleRemoveMember = async (taskId, memberId) => {
  await CollaborationUIService.removeMember(taskId, memberId);

  // Queue for backend sync
  await BackendSyncService.queueOperation("update", "task", {
    taskId,
    memberId,
    action: "remove",
  });
};
```

### Assign Tasks

```typescript
const handleAssignTask = async (taskId, assignToId, dueDate) => {
  const assignment = await CollaborationUIService.assignTask(
    taskId,
    assignToId,
    dueDate
  );

  // Queue for backend sync
  await BackendSyncService.queueOperation("create", "task", assignment);
};
```

### Comments and Activity

#### Add Comment

```typescript
const handleAddComment = async (taskId, content) => {
  const comment = await CollaborationUIService.addComment(
    taskId,
    userId,
    userName,
    content
  );

  // Queue for backend sync
  await BackendSyncService.queueOperation("create", "task", comment);
};
```

#### Get Activity Log

```typescript
const activityLogs = CollaborationUIService.getActivityLog(taskId);
```

## Sync Operations

### Operation Types

#### Create
Creates a new resource on the backend.

```typescript
await BackendSyncService.queueOperation("create", "task", taskData);
```

#### Update
Updates an existing resource on the backend.

```typescript
await BackendSyncService.queueOperation("update", "task", updatedData);
```

#### Delete
Deletes a resource from the backend.

```typescript
await BackendSyncService.queueOperation("delete", "task", { id: taskId });
```

### Entity Types

- `task` - Task operations
- `category` - Category operations
- `settings` - Settings operations
- `avatar` - Avatar operations

### Sync Status

```typescript
enum SyncStatus {
  IDLE = "idle",           // Waiting to be synced
  SYNCING = "syncing",     // Currently syncing
  SUCCESS = "success",     // Successfully synced
  ERROR = "error",         // Error during sync
  CONFLICT = "conflict",   // Conflict detected
}
```

## Conflict Resolution

### Detecting Conflicts

Conflicts occur when the same resource is modified both locally and remotely before sync completes.

```typescript
const conflicts = BackendSyncService.getConflicts();
conflicts.forEach((conflict) => {
  console.log("Conflict detected:", conflict);
});
```

### Resolving Conflicts

```typescript
// Use local version
await BackendSyncService.resolveConflict(conflictId, "local");

// Use remote version
await BackendSyncService.resolveConflict(conflictId, "remote");

// Use merged version
await BackendSyncService.resolveConflict(conflictId, "merged", mergedData);
```

### Conflict UI

Display conflicts to the user:

```typescript
function ConflictResolutionUI({ conflict }) {
  return (
    <View>
      <Text>Conflict Detected</Text>
      <Button
        title="Keep Local"
        onPress={() => resolveConflict(conflict.id, "local")}
      />
      <Button
        title="Use Remote"
        onPress={() => resolveConflict(conflict.id, "remote")}
      />
      <Button
        title="Merge"
        onPress={() => resolveConflict(conflict.id, "merged", mergedData)}
      />
    </View>
  );
}
```

## Error Handling

### Sync Errors

```typescript
const syncStatus = BackendSyncService.getSyncStatus();

if (syncStatus === SyncStatus.ERROR) {
  // Handle sync error
  const stats = BackendSyncService.getSyncStats();
  console.log("Pending operations:", stats.pendingOperations);
  console.log("Success rate:", stats.successRate);
}
```

### Retry Logic

Operations automatically retry up to 3 times:

```typescript
// After 3 failed attempts, operation status becomes ERROR
// User can manually trigger sync again
await BackendSyncService.syncNow();
```

### Network Detection

```typescript
// Sync automatically detects online/offline status
// Operations are queued when offline
// Automatically synced when connection returns
```

## Best Practices

### 1. Queue Operations Immediately

Always queue operations after local changes:

```typescript
// ✅ Good
const task = await addTask(data);
await BackendSyncService.queueOperation("create", "task", task);

// ❌ Bad
const task = await addTask(data);
// Forgot to queue operation
```

### 2. Handle Sync Status

Monitor sync status in your UI:

```typescript
const [syncStatus, setSyncStatus] = useState(SyncStatus.IDLE);

useEffect(() => {
  const interval = setInterval(() => {
    setSyncStatus(BackendSyncService.getSyncStatus());
  }, 1000);

  return () => clearInterval(interval);
}, []);

return (
  <View>
    {syncStatus === SyncStatus.SYNCING && <ActivityIndicator />}
    {syncStatus === SyncStatus.ERROR && <ErrorMessage />}
    {syncStatus === SyncStatus.CONFLICT && <ConflictUI />}
  </View>
);
```

### 3. Provide User Feedback

Show sync status to users:

```typescript
function SyncIndicator() {
  const syncStatus = BackendSyncService.getSyncStatus();
  const stats = BackendSyncService.getSyncStats();

  return (
    <View>
      {syncStatus === SyncStatus.SYNCING && (
        <Text>Syncing {stats.pendingOperations} changes...</Text>
      )}
      {syncStatus === SyncStatus.SUCCESS && (
        <Text>✓ All changes synced</Text>
      )}
      {syncStatus === SyncStatus.ERROR && (
        <Text>⚠ Sync error - will retry</Text>
      )}
    </View>
  );
}
```

### 4. Clean Up Resources

Stop periodic sync when app closes:

```typescript
useEffect(() => {
  return () => {
    BackendSyncService.stopPeriodicSync();
  };
}, []);
```

### 5. Test Offline Scenarios

Test your app's behavior without internet:

```typescript
// Simulate offline
BackendSyncService.stopPeriodicSync();

// Make changes
await addTask(data);

// Verify operation is queued
const stats = BackendSyncService.getSyncStats();
console.log("Pending:", stats.pendingOperations);

// Simulate coming online
await BackendSyncService.syncNow();
```

## Troubleshooting

### Operations Not Syncing

**Problem:** Operations remain in queue without syncing.

**Solutions:**
1. Check internet connection
2. Verify backend is running
3. Check server logs for errors
4. Manually trigger sync: `BackendSyncService.syncNow()`

### Conflicts Not Resolving

**Problem:** Conflicts remain unresolved.

**Solutions:**
1. Ensure conflict resolution is called
2. Verify merged data is valid
3. Check for additional conflicts
4. Clear sync data if necessary: `BackendSyncService.clearSyncData()`

### High Failure Rate

**Problem:** Many operations failing to sync.

**Solutions:**
1. Check backend connectivity
2. Verify data format matches backend expectations
3. Check server logs for validation errors
4. Increase retry limit if needed

### Memory Issues

**Problem:** Sync queue consuming too much memory.

**Solutions:**
1. Reduce batch size
2. Increase sync frequency
3. Clear old operations periodically
4. Monitor with: `BackendSyncService.getSyncStats()`

## Advanced Configuration

### Custom Sync Endpoint

Modify `sendOperation` method:

```typescript
private static async sendOperation(operation: SyncOperation): Promise<void> {
  const baseUrl = "https://your-backend.com";
  const endpoint = `${baseUrl}/api/sync/${operation.entity}`;
  // ... rest of implementation
}
```

### Custom Conflict Resolution

Implement custom merge logic:

```typescript
function customMerge(local, remote) {
  return {
    ...remote,
    localUpdatedAt: local.updatedAt,
    customField: local.customField,
  };
}
```

### Sync Hooks

Add hooks for sync lifecycle:

```typescript
class SyncHooks {
  static onSyncStart: () => void;
  static onSyncComplete: () => void;
  static onSyncError: (error: Error) => void;
  static onConflict: (conflict: SyncConflict) => void;
}
```

## Performance Optimization

### Batch Operations

Group related operations:

```typescript
// Queue multiple operations
await BackendSyncService.queueOperation("create", "task", task1);
await BackendSyncService.queueOperation("create", "task", task2);
await BackendSyncService.queueOperation("create", "task", task3);

// Sync all at once
await BackendSyncService.syncNow();
```

### Selective Sync

Only sync changed fields:

```typescript
const changes = {
  id: taskId,
  title: newTitle, // Only changed field
};

await BackendSyncService.queueOperation("update", "task", changes);
```

### Compression

For large payloads, consider compression:

```typescript
// Implement in sendOperation
const compressed = await compress(JSON.stringify(operation.data));
// Send compressed data
```

## Security Considerations

### Authentication

Ensure backend validates user permissions:

```typescript
// Server-side validation
if (!userHasPermission(userId, taskId)) {
  throw new Error("Unauthorized");
}
```

### Data Validation

Validate all data before syncing:

```typescript
const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

const validated = schema.parse(taskData);
await BackendSyncService.queueOperation("create", "task", validated);
```

### Encryption

For sensitive data, implement encryption:

```typescript
const encrypted = await encryptData(taskData);
await BackendSyncService.queueOperation("create", "task", encrypted);
```

## Monitoring and Analytics

### Sync Statistics

```typescript
const stats = BackendSyncService.getSyncStats();
console.log("Pending operations:", stats.pendingOperations);
console.log("Conflicts:", stats.conflicts);
console.log("Status:", stats.status);
console.log("Last sync:", new Date(stats.lastSyncTime));
console.log("Success rate:", stats.successRate + "%");
```

### Logging

Enable detailed logging:

```typescript
// Add to BackendSyncService
private static log(message: string, data?: any) {
  console.log(`[BackendSync] ${message}`, data || "");
}
```

## Conclusion

The Backend Sync Service provides a robust foundation for real-time synchronization. Follow the best practices and troubleshooting guides to ensure smooth operation in your MeTodo application.

For more information, see:
- [Collaboration UI Service Guide](./COLLABORATION_UI_GUIDE.md)
- [Server Implementation Guide](./server/README.md)
- [API Documentation](./technical/API_DOCUMENTATION.md)
