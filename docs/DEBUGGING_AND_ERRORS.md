// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# MeTodo Debugging and Error Handling Guide

## Overview

This guide provides comprehensive information about debugging MeTodo, understanding errors, and resolving common issues.

---

## Common Errors and Solutions

### 1. Tasks Not Loading

**Error:** Tasks list appears empty even though tasks were created

**Causes:**
- AsyncStorage not initialized
- Tasks not properly saved
- Data corruption

**Solutions:**
```typescript
// Check if tasks exist
const { tasks } = useTaskContext();
console.log('Tasks:', tasks);

// Force reload
await AsyncStorage.removeItem('metodo_tasks');
// App will reload with empty state

// Check storage
const stored = await AsyncStorage.getItem('metodo_tasks');
console.log('Stored tasks:', stored);
```

### 2. Theme Not Applying

**Error:** Selected theme doesn't apply to app

**Causes:**
- Theme not in allThemes array
- Theme context not updated
- CSS variables not set

**Solutions:**
```typescript
// Verify theme exists
import { getThemeById } from '@/constants/themes-extended';
const theme = getThemeById('light_default');
console.log('Theme found:', !!theme);

// Force theme update
const { settings, updateSettings } = useTaskContext();
await updateSettings({ theme: 'light_default' });
```

### 3. Avatar Not Saving

**Error:** Avatar customization doesn't persist

**Causes:**
- Avatar data not serializable
- Storage quota exceeded
- Context not updated

**Solutions:**
```typescript
// Check avatar data
const { avatar } = useTaskContext();
console.log('Avatar:', avatar);

// Verify data is JSON serializable
try {
  JSON.stringify(avatar);
  console.log('Avatar is serializable');
} catch (e) {
  console.error('Avatar not serializable:', e);
}
```

### 4. Notifications Not Working

**Error:** Reminders don't trigger notifications

**Causes:**
- Notifications not initialized
- Permissions not granted
- Reminder time in past

**Solutions:**
```typescript
// Check notification permissions
import * as Notifications from 'expo-notifications';

const permission = await Notifications.getPermissionsAsync();
console.log('Notification permission:', permission.granted);

// Request permission if needed
if (!permission.granted) {
  await Notifications.requestPermissionsAsync();
}

// Schedule test notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Test',
    body: 'This is a test notification',
  },
  trigger: { seconds: 5 },
});
```

### 5. Search Not Finding Tasks

**Error:** Search returns no results

**Causes:**
- Search query syntax incorrect
- Tasks not indexed
- Filter too restrictive

**Solutions:**
```typescript
// Test search directly
import { AdvancedSearchService } from '@/lib/advanced-search-service';

const searchService = new AdvancedSearchService(tasks);
const results = searchService.search({
  text: 'test',
  filters: {},
});
console.log('Search results:', results);

// Check if tasks exist
console.log('Total tasks:', tasks.length);
```

### 6. Batch Operations Failing

**Error:** Bulk task operations don't complete

**Causes:**
- Invalid task IDs
- Permission issues
- Data validation errors

**Solutions:**
```typescript
// Verify task IDs exist
const taskIds = ['task_123', 'task_456'];
const { getTasks } = useTaskContext();
const allTasks = getTasks();

const validIds = taskIds.filter(id =>
  allTasks.some(t => t.id === id)
);
console.log('Valid IDs:', validIds);

// Check operation result
const stats = batchService.changePriority(validIds, 'high');
console.log('Operation stats:', stats);
```

---

## Debugging Tools

### 1. Enable Debug Logging

```typescript
// In app/_layout.tsx
import { enableDebugLogging } from '@/lib/error-handler';

enableDebugLogging(true);
```

### 2. Check Storage

```typescript
// View all stored data
const keys = await AsyncStorage.getAllKeys();
console.log('Storage keys:', keys);

// Get specific item
const tasks = await AsyncStorage.getItem('metodo_tasks');
console.log('Stored tasks:', JSON.parse(tasks || '[]'));
```

### 3. Monitor Performance

```typescript
// Measure operation time
const start = performance.now();
// ... operation ...
const end = performance.now();
console.log(`Operation took ${end - start}ms`);
```

### 4. Test Components

```typescript
// Test task context
const TestComponent = () => {
  const { tasks, addTask } = useTaskContext();
  
  return (
    <View>
      <Text>Tasks: {tasks.length}</Text>
      <Button
        title="Add Test Task"
        onPress={() => addTask({
          title: 'Test',
          priority: 'high',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })}
      />
    </View>
  );
};
```

---

## Error Handling Best Practices

### 1. Try-Catch Blocks

```typescript
try {
  const task = await addTask(newTask);
  console.log('Task added:', task);
} catch (error) {
  console.error('Failed to add task:', error);
  // Show user-friendly error message
}
```

### 2. Validation

```typescript
// Validate before operations
const validateTask = (task: Partial<Task>): boolean => {
  if (!task.title || task.title.trim() === '') {
    console.error('Task title is required');
    return false;
  }
  
  if (!task.priority || !['low', 'medium', 'high'].includes(task.priority)) {
    console.error('Invalid priority');
    return false;
  }
  
  return true;
};
```

### 3. Error Recovery

```typescript
// Implement recovery logic
const loadTasksWithFallback = async () => {
  try {
    const stored = await AsyncStorage.getItem('metodo_tasks');
    return JSON.parse(stored || '[]');
  } catch (error) {
    console.error('Failed to load tasks, using empty array:', error);
    return [];
  }
};
```

---

## Performance Debugging

### 1. Monitor Render Performance

```typescript
// Use React DevTools Profiler
import { Profiler } from 'react';

<Profiler id="TaskList" onRender={onRenderCallback}>
  <TaskList />
</Profiler>
```

### 2. Check Memory Usage

```typescript
// Monitor memory
if (Platform.OS !== 'web') {
  const memory = await TaskManager.getTaskAsync('memory-monitor');
  console.log('Memory:', memory);
}
```

### 3. Optimize Lists

```typescript
// Use FlatList for better performance
<FlatList
  data={tasks}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <TaskCard task={item} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

---

## Testing

### 1. Unit Tests

```typescript
// tests/task-context.test.ts
describe('TaskContext', () => {
  it('should add task', async () => {
    const { addTask } = useTaskContext();
    const task = await addTask({
      title: 'Test',
      priority: 'high',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
// Test full workflow
describe('Task Workflow', () => {
  it('should create, update, and delete task', async () => {
    const { addTask, updateTask, deleteTask } = useTaskContext();
    
    const task = await addTask({ /* ... */ });
    await updateTask(task.id, { title: 'Updated' });
    await deleteTask(task.id);
  });
});
```

---

## Support

For debugging help:

**Email:** supportramsandesh@gmail.com  
**Response Time:** 24-48 hours

Include:
- Error message
- Steps to reproduce
- Device/platform info
- App version

---

**Last Updated:** June 30, 2026  
**Version:** 1.0.0
