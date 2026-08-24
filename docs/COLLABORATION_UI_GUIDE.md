# Collaboration UI Service Guide

## Overview

The Collaboration UI Service manages task sharing, permissions, assignments, and real-time collaboration features in MeTodo. This guide provides complete documentation for implementing and using collaboration features.

## Table of Contents

1. [Architecture](#architecture)
2. [Core Features](#core-features)
3. [API Reference](#api-reference)
4. [Usage Examples](#usage-examples)
5. [Permission System](#permission-system)
6. [Activity Tracking](#activity-tracking)
7. [Comments System](#comments-system)
8. [Best Practices](#best-practices)

## Architecture

### Components

The Collaboration UI Service consists of:

1. **Shared Tasks** - Track which tasks are shared with whom
2. **Collaboration Members** - Manage team members and permissions
3. **Activity Logs** - Track all changes and actions
4. **Task Assignments** - Manage task assignments to team members
5. **Comments** - Enable discussion on tasks

### Data Models

```typescript
interface SharedTask {
  id: string;
  taskId: string;
  sharedBy: string;
  sharedWith: CollaborationMember[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface CollaborationMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permission: PermissionLevel;
  joinedAt: Date;
  lastActive: Date;
}

interface ActivityLog {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: "created" | "updated" | "completed" | "commented" | "assigned";
  details: string;
  timestamp: Date;
}

interface TaskAssignment {
  id: string;
  taskId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  status: "pending" | "accepted" | "rejected" | "completed";
}

interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: TaskComment[];
}
```

## Core Features

### 1. Task Sharing

Share tasks with team members with specific permissions.

```typescript
// Share task with single member
await CollaborationUIService.shareTask(
  taskId,
  ["member@example.com"],
  PermissionLevel.EDIT
);

// Share with multiple members
await CollaborationUIService.shareTask(
  taskId,
  ["member1@example.com", "member2@example.com"],
  PermissionLevel.VIEW
);
```

### 2. Permission Management

Control what actions team members can perform.

```typescript
// Update member permission
await CollaborationUIService.updateMemberPermission(
  taskId,
  memberId,
  PermissionLevel.ADMIN
);

// Remove member access
await CollaborationUIService.removeMember(taskId, memberId);
```

### 3. Task Assignment

Assign tasks to specific team members.

```typescript
// Assign task with due date
const assignment = await CollaborationUIService.assignTask(
  taskId,
  assigneeId,
  new Date("2024-12-31")
);

// Accept assignment
await CollaborationUIService.acceptAssignment(assignmentId);

// Reject assignment
await CollaborationUIService.rejectAssignment(assignmentId);
```

### 4. Comments and Discussion

Enable team communication on tasks.

```typescript
// Add comment
const comment = await CollaborationUIService.addComment(
  taskId,
  userId,
  userName,
  "This task needs urgent attention"
);

// Reply to comment
const reply = await CollaborationUIService.replyToComment(
  taskId,
  commentId,
  userId,
  userName,
  "I'll handle it right away"
);

// Like comment
await CollaborationUIService.likeComment(commentId);
```

### 5. Activity Tracking

Monitor all changes and actions on shared tasks.

```typescript
// Get activity log
const logs = CollaborationUIService.getActivityLog(taskId, 50);

logs.forEach((log) => {
  console.log(`${log.userName} ${log.action}: ${log.details}`);
});
```

## API Reference

### Sharing Methods

#### `shareTask(taskId, emails, permission)`

Share a task with team members.

**Parameters:**
- `taskId` (string) - ID of task to share
- `emails` (string[]) - Array of email addresses
- `permission` (PermissionLevel) - Permission level (default: EDIT)

**Returns:** `Promise<SharedTask>`

**Example:**
```typescript
const shared = await CollaborationUIService.shareTask(
  "task123",
  ["alice@example.com", "bob@example.com"],
  PermissionLevel.EDIT
);
```

#### `updateMemberPermission(taskId, memberId, permission)`

Update a member's permission level.

**Parameters:**
- `taskId` (string) - ID of shared task
- `memberId` (string) - ID of team member
- `permission` (PermissionLevel) - New permission level

**Returns:** `Promise<void>`

**Example:**
```typescript
await CollaborationUIService.updateMemberPermission(
  "task123",
  "member456",
  PermissionLevel.ADMIN
);
```

#### `removeMember(taskId, memberId)`

Remove a member from shared task.

**Parameters:**
- `taskId` (string) - ID of shared task
- `memberId` (string) - ID of team member

**Returns:** `Promise<void>`

**Example:**
```typescript
await CollaborationUIService.removeMember("task123", "member456");
```

#### `stopSharing(taskId)`

Stop sharing a task completely.

**Parameters:**
- `taskId` (string) - ID of shared task

**Returns:** `Promise<void>`

**Example:**
```typescript
await CollaborationUIService.stopSharing("task123");
```

### Assignment Methods

#### `assignTask(taskId, assignToId, dueDate)`

Assign task to a team member.

**Parameters:**
- `taskId` (string) - ID of task
- `assignToId` (string) - ID of assignee
- `dueDate` (Date, optional) - Due date for assignment

**Returns:** `Promise<TaskAssignment>`

**Example:**
```typescript
const assignment = await CollaborationUIService.assignTask(
  "task123",
  "member456",
  new Date("2024-12-31")
);
```

#### `acceptAssignment(assignmentId)`

Accept a task assignment.

**Parameters:**
- `assignmentId` (string) - ID of assignment

**Returns:** `Promise<void>`

**Example:**
```typescript
await CollaborationUIService.acceptAssignment("assignment789");
```

#### `rejectAssignment(assignmentId)`

Reject a task assignment.

**Parameters:**
- `assignmentId` (string) - ID of assignment

**Returns:** `Promise<void>`

**Example:**
```typescript
await CollaborationUIService.rejectAssignment("assignment789");
```

### Comment Methods

#### `addComment(taskId, userId, userName, content)`

Add a comment to a task.

**Parameters:**
- `taskId` (string) - ID of task
- `userId` (string) - ID of commenter
- `userName` (string) - Name of commenter
- `content` (string) - Comment text

**Returns:** `Promise<TaskComment>`

**Example:**
```typescript
const comment = await CollaborationUIService.addComment(
  "task123",
  "user456",
  "Alice",
  "Great progress on this task!"
);
```

#### `replyToComment(taskId, commentId, userId, userName, content)`

Reply to a comment.

**Parameters:**
- `taskId` (string) - ID of task
- `commentId` (string) - ID of comment to reply to
- `userId` (string) - ID of replier
- `userName` (string) - Name of replier
- `content` (string) - Reply text

**Returns:** `Promise<TaskComment>`

**Example:**
```typescript
const reply = await CollaborationUIService.replyToComment(
  "task123",
  "comment789",
  "user456",
  "Bob",
  "Thanks for the feedback!"
);
```

#### `likeComment(commentId)`

Like a comment.

**Parameters:**
- `commentId` (string) - ID of comment

**Returns:** `Promise<void>`

**Example:**
```typescript
await CollaborationUIService.likeComment("comment789");
```

### Query Methods

#### `getSharedTaskMembers(taskId)`

Get all members a task is shared with.

**Parameters:**
- `taskId` (string) - ID of task

**Returns:** `CollaborationMember[]`

**Example:**
```typescript
const members = CollaborationUIService.getSharedTaskMembers("task123");
members.forEach((member) => {
  console.log(`${member.name} (${member.permission})`);
});
```

#### `getActivityLog(taskId, limit)`

Get activity log for a task.

**Parameters:**
- `taskId` (string) - ID of task
- `limit` (number, optional) - Max results (default: 50)

**Returns:** `ActivityLog[]`

**Example:**
```typescript
const logs = CollaborationUIService.getActivityLog("task123", 100);
```

#### `getTaskComments(taskId)`

Get all comments on a task.

**Parameters:**
- `taskId` (string) - ID of task

**Returns:** `TaskComment[]`

**Example:**
```typescript
const comments = CollaborationUIService.getTaskComments("task123");
```

#### `getTaskAssignments(taskId)`

Get all assignments for a task.

**Parameters:**
- `taskId` (string) - ID of task

**Returns:** `TaskAssignment[]`

**Example:**
```typescript
const assignments = CollaborationUIService.getTaskAssignments("task123");
```

#### `getPendingAssignments(userId)`

Get all pending assignments for a user.

**Parameters:**
- `userId` (string) - ID of user

**Returns:** `TaskAssignment[]`

**Example:**
```typescript
const pending = CollaborationUIService.getPendingAssignments("user456");
```

#### `getSharedTasks()`

Get all active shared tasks.

**Returns:** `SharedTask[]`

**Example:**
```typescript
const shared = CollaborationUIService.getSharedTasks();
```

#### `getCollaborationStats()`

Get collaboration statistics.

**Returns:** Object with stats

**Example:**
```typescript
const stats = CollaborationUIService.getCollaborationStats();
console.log(`Total shared tasks: ${stats.totalSharedTasks}`);
console.log(`Total members: ${stats.totalMembers}`);
console.log(`Total comments: ${stats.totalComments}`);
```

## Usage Examples

### Complete Sharing Workflow

```typescript
// 1. Share task
const shared = await CollaborationUIService.shareTask(
  "task123",
  ["alice@example.com"],
  PermissionLevel.EDIT
);

// 2. Get members
const members = CollaborationUIService.getSharedTaskMembers("task123");

// 3. Update permission
await CollaborationUIService.updateMemberPermission(
  "task123",
  members[0].id,
  PermissionLevel.ADMIN
);

// 4. Add comment
await CollaborationUIService.addComment(
  "task123",
  "user456",
  "Bob",
  "Assigned to Alice for implementation"
);

// 5. Assign task
await CollaborationUIService.assignTask(
  "task123",
  members[0].id,
  new Date("2024-12-31")
);
```

### Monitoring Collaboration

```typescript
// Get all activity
const logs = CollaborationUIService.getActivityLog("task123");

// Display activity feed
logs.forEach((log) => {
  console.log(`[${log.timestamp}] ${log.userName}: ${log.action}`);
  console.log(`  ${log.details}`);
});

// Get statistics
const stats = CollaborationUIService.getCollaborationStats();
console.log(`Active collaborations: ${stats.totalSharedTasks}`);
console.log(`Team members: ${stats.totalMembers}`);
console.log(`Pending assignments: ${stats.pendingAssignments}`);
```

### React Component Example

```typescript
function TaskCollaborationPanel({ taskId }) {
  const [members, setMembers] = useState<CollaborationMember[]>([]);
  const [shareEmail, setShareEmail] = useState("");

  const handleShare = async () => {
    await CollaborationUIService.shareTask(
      taskId,
      [shareEmail],
      PermissionLevel.EDIT
    );
    setMembers(CollaborationUIService.getSharedTaskMembers(taskId));
    setShareEmail("");
  };

  useEffect(() => {
    setMembers(CollaborationUIService.getSharedTaskMembers(taskId));
  }, [taskId]);

  return (
    <View>
      <TextInput
        placeholder="Email to share with"
        value={shareEmail}
        onChangeText={setShareEmail}
      />
      <Button title="Share" onPress={handleShare} />

      <Text>Shared with:</Text>
      {members.map((member) => (
        <View key={member.id}>
          <Text>{member.name} ({member.permission})</Text>
        </View>
      ))}
    </View>
  );
}
```

## Permission System

### Permission Levels

| Level | Description | Actions |
|-------|-------------|---------|
| VIEW | Read-only access | View task, view comments |
| EDIT | Edit access | View, edit, comment, assign |
| ADMIN | Full access | All actions, manage permissions |

### Permission Checks

```typescript
function canEdit(member: CollaborationMember): boolean {
  return (
    member.permission === PermissionLevel.EDIT ||
    member.permission === PermissionLevel.ADMIN
  );
}

function canManagePermissions(member: CollaborationMember): boolean {
  return member.permission === PermissionLevel.ADMIN;
}
```

## Activity Tracking

### Action Types

- `created` - Task or resource created
- `updated` - Task or resource updated
- `completed` - Task marked as complete
- `commented` - Comment added
- `assigned` - Task assigned to member

### Activity Log Example

```typescript
const logs = CollaborationUIService.getActivityLog("task123");

logs.forEach((log) => {
  switch (log.action) {
    case "created":
      console.log(`${log.userName} created the task`);
      break;
    case "updated":
      console.log(`${log.userName} updated: ${log.details}`);
      break;
    case "completed":
      console.log(`${log.userName} completed the task`);
      break;
    case "commented":
      console.log(`${log.userName} commented: ${log.details}`);
      break;
    case "assigned":
      console.log(`${log.userName} assigned: ${log.details}`);
      break;
  }
});
```

## Comments System

### Nested Comments

Comments support replies:

```typescript
const comment = await CollaborationUIService.addComment(
  taskId,
  userId,
  userName,
  "Main comment"
);

const reply = await CollaborationUIService.replyToComment(
  taskId,
  comment.id,
  userId2,
  userName2,
  "Reply to comment"
);

// Access replies
console.log(comment.replies); // Contains all replies
```

### Comment Interactions

```typescript
// Like a comment
await CollaborationUIService.likeComment(commentId);

// Get comments with likes
const comments = CollaborationUIService.getTaskComments(taskId);
comments.forEach((comment) => {
  console.log(`${comment.content} (${comment.likes} likes)`);
});
```

## Best Practices

### 1. Always Update UI After Changes

```typescript
// ✅ Good
await CollaborationUIService.shareTask(taskId, emails, permission);
setMembers(CollaborationUIService.getSharedTaskMembers(taskId));

// ❌ Bad
await CollaborationUIService.shareTask(taskId, emails, permission);
// Forgot to update UI
```

### 2. Handle Errors Gracefully

```typescript
try {
  await CollaborationUIService.shareTask(taskId, emails, permission);
} catch (error) {
  Alert.alert("Error", "Failed to share task");
}
```

### 3. Validate Permissions

```typescript
const member = members.find((m) => m.id === memberId);
if (!canEdit(member)) {
  Alert.alert("Error", "You don't have permission to edit");
  return;
}
```

### 4. Optimize Activity Queries

```typescript
// ✅ Good - Limit results
const logs = CollaborationUIService.getActivityLog(taskId, 50);

// ❌ Bad - Load all logs
const logs = CollaborationUIService.getActivityLog(taskId);
```

### 5. Clean Up Resources

```typescript
useEffect(() => {
  return () => {
    CollaborationUIService.clearCollaborationData();
  };
}, []);
```

## Conclusion

The Collaboration UI Service provides comprehensive task sharing and team collaboration features. Use this guide to implement robust collaboration workflows in your MeTodo application.
