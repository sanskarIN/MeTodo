// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# Advanced Services Documentation

## Overview

MeTodo includes three advanced service layers that provide sophisticated functionality for synchronization, recurring tasks, and collaboration. This document provides comprehensive documentation for each service.

---

## 1. Synchronization Service (sync-utils.ts)

### Purpose

The Synchronization Service manages offline-first sync operations, conflict resolution, and data reconciliation for MeTodo. It maintains a queue of pending operations and handles conflicts when local and remote versions diverge.

### Key Interfaces

#### SyncAction

```typescript
interface SyncAction {
  id: string;                    // Unique action identifier
  type: 'create' | 'update' | 'delete';  // Operation type
  entity: 'task' | 'theme' | 'avatar' | 'settings';  // Entity type
  entityId: string;              // ID of the entity being synced
  data: any;                     // Entity data
  timestamp: number;             // When action was created
  synced: boolean;               // Whether action was synced
  retries: number;               // Number of retry attempts
}
```

#### SyncConflict

```typescript
interface SyncConflict {
  id: string;                    // Unique conflict identifier
  entityId: string;              // ID of conflicting entity
  localVersion: any;             // Local version of data
  remoteVersion: any;            // Remote version of data
  timestamp: number;             // When conflict was detected
  resolved: boolean;             // Whether conflict is resolved
  resolution?: 'local' | 'remote' | 'merged';  // Resolution strategy
}
```

### Core Methods

#### Adding to Sync Queue

```typescript
const syncUtil = SyncUtil.getInstance();

const action = syncUtil.addToQueue({
  type: 'create',
  entity: 'task',
  entityId: 'task_123',
  data: { title: 'New Task', priority: 'high' }
});
```

#### Managing Sync Status

```typescript
// Get pending actions
const pending = syncUtil.getPendingActions();

// Mark as synced
syncUtil.markAsSynced(actionId);

// Mark as failed
syncUtil.markAsFailed(actionId);

// Get sync status
const status = syncUtil.getSyncStatus();
```

#### Conflict Resolution

```typescript
// Detect conflict
const conflict = syncUtil.detectConflict(
  'task_123',
  localVersion,
  remoteVersion
);

// Resolve with local version
syncUtil.resolveConflictLocal(conflictId);

// Resolve with remote version
syncUtil.resolveConflictRemote(conflictId);

// Resolve with merged version
const merged = syncUtil.mergeObjects(localVersion, remoteVersion);
syncUtil.resolveConflictMerged(conflictId, merged);
```

#### Sync Operations

```typescript
// Start sync
syncUtil.startSync();

// Update progress
syncUtil.updateSyncProgress(50);

// Complete sync
syncUtil.completeSync();

// Get statistics
const stats = syncUtil.getStats();
```

### Usage Example

```typescript
import { SyncUtil } from '@/lib/sync-utils';

const syncUtil = SyncUtil.getInstance();

// Add task creation to queue
const action = syncUtil.addToQueue({
  type: 'create',
  entity: 'task',
  entityId: 'task_new_001',
  data: {
    title: 'Complete project documentation',
    priority: 'high',
    dueDate: new Date('2026-07-15')
  }
});

// Start sync process
syncUtil.startSync();

try {
  // Simulate sync operation
  const pending = syncUtil.getPendingActions();
  
  for (const action of pending) {
    // Send to server
    const response = await fetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify(action)
    });

    if (response.ok) {
      syncUtil.markAsSynced(action.id);
      syncUtil.updateSyncProgress(
        (syncUtil.getStats().syncedActions / pending.length) * 100
      );
    } else {
      syncUtil.markAsFailed(action.id);
    }
  }

  syncUtil.completeSync();
} catch (error) {
  console.error('Sync failed:', error);
}
```

---

## 2. Recurring Task Service (recurring-task-service.ts)

### Purpose

The Recurring Task Service manages recurring task patterns, automatic task generation, and learning-based scheduling adjustments. It learns from user behavior to optimize task scheduling.

### Key Interfaces

#### RecurringPattern

```typescript
interface RecurringPattern {
  id: string;                    // Unique pattern identifier
  taskId: string;                // Associated task ID
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;              // Interval multiplier
  daysOfWeek?: number[];         // For weekly patterns (0-6)
  daysOfMonth?: number[];        // For monthly patterns (1-31)
  endDate?: Date;                // When pattern ends
  maxOccurrences?: number;       // Maximum occurrences
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

#### TaskOccurrence

```typescript
interface TaskOccurrence {
  id: string;                    // Unique occurrence identifier
  recurringPatternId: string;    // Associated pattern ID
  taskId: string;                // Associated task ID
  dueDate: Date;                 // When task is due
  completed: boolean;            // Completion status
  completedAt?: Date;            // When task was completed
  createdAt: Date;               // Creation timestamp
}
```

#### LearningData

```typescript
interface LearningData {
  patternId: string;             // Associated pattern ID
  completionRate: number;        // Percentage of tasks completed
  averageCompletionTime: number; // Average time to complete
  preferredCompletionTime: string; // Preferred time (HH:MM)
  lastCompletionDate: Date;      // Last completion date
  completionTrend: 'improving' | 'declining' | 'stable';
}
```

### Core Methods

#### Creating Patterns

```typescript
const service = new RecurringTaskService();

// Daily pattern
const dailyPattern = service.createPattern({
  taskId: 'task_123',
  frequency: 'daily',
  interval: 1
});

// Weekly pattern (Monday, Wednesday, Friday)
const weeklyPattern = service.createPattern({
  taskId: 'task_456',
  frequency: 'weekly',
  interval: 1,
  daysOfWeek: [1, 3, 5]
});

// Monthly pattern (1st and 15th)
const monthlyPattern = service.createPattern({
  taskId: 'task_789',
  frequency: 'monthly',
  interval: 1,
  daysOfMonth: [1, 15]
});
```

#### Managing Occurrences

```typescript
// Generate next occurrence
const occurrence = service.generateNextOccurrence(patternId);

// Mark as completed
service.markOccurrenceCompleted(occurrenceId);

// Get upcoming occurrences
const upcoming = service.getUpcomingOccurrences(7); // Next 7 days

// Get overdue occurrences
const overdue = service.getOverdueOccurrences();
```

#### Learning & Analytics

```typescript
// Get learning data
const learning = service.getLearningData(patternId);
console.log(`Completion rate: ${learning.completionRate * 100}%`);
console.log(`Preferred time: ${learning.preferredCompletionTime}`);
console.log(`Trend: ${learning.completionTrend}`);

// Get completion statistics
const stats = service.getCompletionStats(patternId);
console.log(`Total: ${stats.totalOccurrences}`);
console.log(`Completed: ${stats.completedOccurrences}`);
console.log(`Overdue: ${stats.overdueCount}`);

// Get pattern adjustment suggestions
const suggestion = service.suggestPatternAdjustment(patternId);
if (suggestion) {
  console.log(suggestion);
}
```

### Usage Example

```typescript
import { RecurringTaskService } from '@/lib/recurring-task-service';

const service = new RecurringTaskService();

// Create a daily meditation task
const pattern = service.createPattern({
  taskId: 'meditation_001',
  frequency: 'daily',
  interval: 1
});

// Generate occurrences for the next 30 days
for (let i = 0; i < 30; i++) {
  service.generateNextOccurrence(pattern.id);
}

// Get upcoming tasks
const upcoming = service.getUpcomingOccurrences(7);
console.log(`Tasks for next 7 days: ${upcoming.length}`);

// Simulate completing tasks
upcoming.forEach((occurrence) => {
  service.markOccurrenceCompleted(occurrence.id);
});

// Get learning insights
const learning = service.getLearningData(pattern.id);
console.log(`Completion rate: ${(learning.completionRate * 100).toFixed(0)}%`);
console.log(`Most productive time: ${learning.preferredCompletionTime}`);

// Get suggestion
const suggestion = service.suggestPatternAdjustment(pattern.id);
if (suggestion) {
  console.log(`Suggestion: ${suggestion}`);
}
```

---

## 3. Collaboration Service (collaboration-service.ts)

### Purpose

The Collaboration Service enables task sharing, team management, and collaborative editing in MeTodo. It handles permissions, team membership, and activity tracking.

### Key Interfaces

#### SharedTask

```typescript
interface SharedTask {
  id: string;                    // Unique share identifier
  taskId: string;                // Task being shared
  sharedBy: string;              // User who shared
  sharedWith: string[];          // Users task is shared with
  permissions: Record<string, PermissionLevel>;  // Per-user permissions
  createdAt: Date;               // When shared
  updatedAt: Date;               // Last update
  expiresAt?: Date;              // When share expires
}
```

#### Team

```typescript
interface Team {
  id: string;                    // Unique team identifier
  name: string;                  // Team name
  description: string;           // Team description
  owner: string;                 // Team owner
  members: TeamMember[];         // Team members
  tasks: string[];               // Shared tasks
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

#### TeamMember

```typescript
interface TeamMember {
  userId: string;                // User identifier
  email: string;                 // User email
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;                // When joined
  permissions: PermissionLevel[];  // Available permissions
}
```

### Core Methods

#### Task Sharing

```typescript
const service = new CollaborationService();

// Share task with specific permission
const shared = service.shareTask(
  'task_123',
  'user_owner',
  ['user_alice', 'user_bob'],
  'edit'
);

// Update permissions
service.updateSharePermissions(shared.id, 'user_alice', 'manage');

// Check permission
const canEdit = service.checkPermission(shared.id, 'user_alice', 'edit');

// Revoke share from specific user
service.revokeShare(shared.id, 'user_bob');

// Get shared tasks for user
const sharedWithMe = service.getSharedTasksForUser('user_alice');
```

#### Team Management

```typescript
// Create team
const team = service.createTeam(
  'Project Alpha',
  'Q3 product development',
  'user_owner'
);

// Add members
service.addTeamMember(team.id, 'user_alice', 'alice@example.com', 'admin');
service.addTeamMember(team.id, 'user_bob', 'bob@example.com', 'member');

// Add task to team
service.addTaskToTeam(team.id, 'task_123');
service.addTaskToTeam(team.id, 'task_456');

// Get user's teams
const userTeams = service.getUserTeams('user_alice');

// Remove member
service.removeTeamMember(team.id, 'user_bob');
```

#### Activity Tracking

```typescript
// Get task activity
const taskActivity = service.getTaskActivity('task_123');
taskActivity.forEach((activity) => {
  console.log(`${activity.userId} ${activity.action} at ${activity.timestamp}`);
});

// Get team activity
const teamActivity = service.getTeamActivity(team.id);

// Get statistics
const stats = service.getStats();
console.log(`Shared tasks: ${stats.totalSharedTasks}`);
console.log(`Teams: ${stats.totalTeams}`);
console.log(`Members: ${stats.totalMembers}`);
```

#### Share Links

```typescript
// Generate share link (expires in 7 days)
const shareLink = service.generateShareLink(shared.id, 7);
console.log(`Share link: ${shareLink}`);

// Check if link is valid
const isValid = service.isShareLinkValid(shared.id);
```

### Usage Example

```typescript
import { CollaborationService } from '@/lib/collaboration-service';

const service = new CollaborationService();

// Create a team for project
const team = service.createTeam(
  'Summer Project',
  'Building new features',
  'user_owner'
);

// Add team members
service.addTeamMember(team.id, 'user_alice', 'alice@example.com', 'admin');
service.addTeamMember(team.id, 'user_bob', 'bob@example.com', 'member');
service.addTeamMember(team.id, 'user_carol', 'carol@example.com', 'member');

// Create and share tasks
const task1 = { id: 'task_001', title: 'Design UI' };
const task2 = { id: 'task_002', title: 'Implement API' };

service.addTaskToTeam(team.id, task1.id);
service.addTaskToTeam(team.id, task2.id);

// Share specific task with edit permission
const shared = service.shareTask(
  task1.id,
  'user_owner',
  ['user_alice', 'user_bob'],
  'edit'
);

// Generate share link
const shareLink = service.generateShareLink(shared.id, 14);

// Get team activity
const activity = service.getTeamActivity(team.id);
console.log(`Team has ${activity.length} activities`);

// Get collaboration statistics
const stats = service.getStats();
console.log(`Total teams: ${stats.totalTeams}`);
console.log(`Total members: ${stats.totalMembers}`);
```

---

## Integration Guide

### Using All Three Services Together

```typescript
import { SyncUtil } from '@/lib/sync-utils';
import { RecurringTaskService } from '@/lib/recurring-task-service';
import { CollaborationService } from '@/lib/collaboration-service';

const syncUtil = SyncUtil.getInstance();
const recurringService = new RecurringTaskService();
const collaborationService = new CollaborationService();

// Create a recurring team task
const pattern = recurringService.createPattern({
  taskId: 'team_task_001',
  frequency: 'weekly',
  interval: 1,
  daysOfWeek: [1, 3, 5]
});

// Share with team
const team = collaborationService.createTeam('Dev Team', 'Development', 'owner');
collaborationService.addTaskToTeam(team.id, 'team_task_001');

// Queue for sync
syncUtil.addToQueue({
  type: 'create',
  entity: 'task',
  entityId: 'team_task_001',
  data: { recurring: true, teamId: team.id }
});

// Start sync
syncUtil.startSync();
```

---

## Best Practices

1. **Sync Management:** Always check sync status before performing critical operations
2. **Conflict Resolution:** Implement user-friendly conflict resolution UI
3. **Recurring Tasks:** Monitor completion trends and adjust patterns accordingly
4. **Collaboration:** Use permission levels appropriately for security
5. **Activity Tracking:** Archive old activities to maintain performance

---

## Support

For questions or issues with advanced services:

**Email:** supportramsandesh@gmail.com

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
