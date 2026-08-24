# MeTodo - Data Storage Documentation

## Table of Contents

1. [Overview](#overview)
2. [Storage Mechanisms](#storage-mechanisms)
3. [Data Models](#data-models)
4. [Storage Operations](#storage-operations)
5. [Data Persistence](#data-persistence)
6. [Best Practices](#best-practices)

---

## Overview

MeTodo uses local storage for all data, ensuring complete offline functionality. All data is stored on the user's device with no cloud synchronization in the current version.

### Storage Strategy

- **Primary:** AsyncStorage for key-value data
- **Backup:** Local file system for large data
- **Encryption:** Optional for sensitive data
- **Sync:** Manual backup/restore

---

## Storage Mechanisms

### AsyncStorage

**Purpose:** Store app state and user data

**Location:** Device-specific
- iOS: NSUserDefaults
- Android: SharedPreferences
- Web: LocalStorage

**Capacity:** 5-10MB per app

**Example:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

// Load data
const tasks = JSON.parse(await AsyncStorage.getItem('tasks') || '[]');

// Remove data
await AsyncStorage.removeItem('tasks');

// Clear all
await AsyncStorage.clear();
```

### File System Storage

**Purpose:** Store large files and media

**Location:** App documents directory

**Example:**
```typescript
import * as FileSystem from 'expo-file-system/legacy';

// Save file
const filePath = FileSystem.documentDirectory + 'data.json';
await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data));

// Read file
const content = await FileSystem.readAsStringAsync(filePath);

// Delete file
await FileSystem.deleteAsync(filePath);
```

### Secure Storage

**Purpose:** Store sensitive data

**Location:** Device keychain/keystore

**Example:**
```typescript
import * as SecureStore from 'expo-secure-store';

// Save secure data
await SecureStore.setItemAsync('auth_token', token);

// Retrieve secure data
const token = await SecureStore.getItemAsync('auth_token');

// Delete secure data
await SecureStore.deleteItemAsync('auth_token');
```

---

## Data Models

### Task Model

```typescript
interface Task {
  id: string;                    // Unique identifier
  title: string;                 // Task title
  description?: string;          // Detailed description
  completed: boolean;            // Completion status
  priority: 'low' | 'medium' | 'high';
  category?: string;             // Category ID
  tags?: string[];               // Tag IDs
  dueDate?: Date;                // Due date
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  subtasks?: Subtask[];          // Subtasks array
  reminders?: Reminder[];        // Reminders array
  notes?: string;                // Rich text notes
  recurring?: RecurringPattern;  // Recurrence pattern
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

interface Reminder {
  id: string;
  type: 'notification' | 'email';
  timeBeforeDue: number;         // Minutes before due date
  enabled: boolean;
}

interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
}
```

### Avatar Model

```typescript
interface Avatar {
  id: string;
  hairStyle: 'short' | 'long' | 'curly' | 'straight' | 'bald';
  hairColor: string;             // Hex color
  eyeShape: 'round' | 'almond' | 'wide' | 'narrow';
  eyeColor: string;              // Hex color
  accessories?: 'glasses' | 'hat' | 'earrings' | 'none';
  skinTone: 'light' | 'light-medium' | 'medium' | 'medium-dark' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}
```

### Theme Model

```typescript
interface Theme {
  id: string;
  name: string;
  primary: string;               // Hex color
  secondary: string;             // Hex color
  background: string;            // Hex color
  surface: string;               // Hex color
  foreground: string;            // Hex color
  muted: string;                 // Hex color
  border: string;                // Hex color
  success: string;               // Hex color
  warning: string;               // Hex color
  error: string;                 // Hex color
  isCustom: boolean;
  createdAt: Date;
}
```

### Category Model

```typescript
interface Category {
  id: string;
  name: string;
  color: string;                 // Hex color
  icon?: string;                 // Icon name
  taskCount: number;
  createdAt: Date;
}
```

### Settings Model

```typescript
interface AppSettings {
  theme: Theme;
  avatar: Avatar;
  categories: Category[];
  customThemes: Theme[];
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  preferences: {
    defaultPriority: 'low' | 'medium' | 'high';
    defaultCategory: string;
    sortBy: 'priority' | 'dueDate' | 'created';
    filterBy: 'all' | 'active' | 'completed';
  };
}
```

---

## Storage Operations

### Initialize Storage

```typescript
// Initialize app data on first launch
async function initializeStorage() {
  try {
    const existingData = await AsyncStorage.getItem('app_initialized');
    
    if (!existingData) {
      // Create default data
      const defaultSettings: AppSettings = {
        theme: DEFAULT_THEME,
        avatar: DEFAULT_AVATAR,
        categories: DEFAULT_CATEGORIES,
        customThemes: [],
        notifications: {
          enabled: true,
          sound: true,
          vibration: true,
        },
        preferences: {
          defaultPriority: 'medium',
          defaultCategory: 'general',
          sortBy: 'priority',
          filterBy: 'all',
        },
      };
      
      await AsyncStorage.setItem(
        'app_settings',
        JSON.stringify(defaultSettings)
      );
      await AsyncStorage.setItem('app_initialized', 'true');
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
}
```

### Save Tasks

```typescript
async function saveTasks(tasks: Task[]) {
  try {
    const serialized = JSON.stringify(tasks);
    await AsyncStorage.setItem('tasks', serialized);
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
}
```

### Load Tasks

```typescript
async function loadTasks(): Promise<Task[]> {
  try {
    const data = await AsyncStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}
```

### Update Task

```typescript
async function updateTask(taskId: string, updates: Partial<Task>) {
  try {
    const tasks = await loadTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date(),
      };
      
      await saveTasks(tasks);
      return tasks[index];
    }
    
    throw new Error('Task not found');
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}
```

### Delete Task

```typescript
async function deleteTask(taskId: string) {
  try {
    const tasks = await loadTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    await saveTasks(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}
```

### Search Tasks

```typescript
async function searchTasks(query: string): Promise<Task[]> {
  try {
    const tasks = await loadTasks();
    const lowerQuery = query.toLowerCase();
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching tasks:', error);
    return [];
  }
}
```

### Filter Tasks

```typescript
async function filterTasks(
  category?: string,
  priority?: string,
  completed?: boolean
): Promise<Task[]> {
  try {
    const tasks = await loadTasks();
    
    return tasks.filter(task => {
      if (category && task.category !== category) return false;
      if (priority && task.priority !== priority) return false;
      if (completed !== undefined && task.completed !== completed) return false;
      return true;
    });
  } catch (error) {
    console.error('Error filtering tasks:', error);
    return [];
  }
}
```

---

## Data Persistence

### Auto-Save Pattern

```typescript
// Save data whenever it changes
useEffect(() => {
  const saveData = async () => {
    await saveTasks(tasks);
  };
  
  saveData();
}, [tasks]);
```

### Backup & Restore

```typescript
// Backup data to file
async function backupData() {
  try {
    const tasks = await loadTasks();
    const settings = await AsyncStorage.getItem('app_settings');
    
    const backup = {
      tasks,
      settings: JSON.parse(settings || '{}'),
      timestamp: new Date().toISOString(),
    };
    
    const filePath = FileSystem.documentDirectory + 'metodo_backup.json';
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(backup, null, 2)
    );
    
    return filePath;
  } catch (error) {
    console.error('Backup error:', error);
    throw error;
  }
}

// Restore data from backup
async function restoreData(filePath: string) {
  try {
    const content = await FileSystem.readAsStringAsync(filePath);
    const backup = JSON.parse(content);
    
    await AsyncStorage.setItem('tasks', JSON.stringify(backup.tasks));
    await AsyncStorage.setItem('app_settings', JSON.stringify(backup.settings));
    
    return true;
  } catch (error) {
    console.error('Restore error:', error);
    return false;
  }
}
```

### Data Migration

```typescript
// Migrate data to new format
async function migrateData() {
  try {
    const version = await AsyncStorage.getItem('data_version');
    
    if (!version || version < '1.1.0') {
      const tasks = await loadTasks();
      
      // Add new fields to existing tasks
      const migratedTasks = tasks.map(task => ({
        ...task,
        recurring: null,  // New field
        notes: '',        // New field
      }));
      
      await saveTasks(migratedTasks);
      await AsyncStorage.setItem('data_version', '1.1.0');
    }
  } catch (error) {
    console.error('Migration error:', error);
  }
}
```

---

## Best Practices

### Performance

1. **Batch Operations** - Save multiple items together
2. **Lazy Loading** - Load data only when needed
3. **Caching** - Cache frequently accessed data
4. **Compression** - Compress large data before storage

```typescript
// Good: Batch save
await Promise.all([
  AsyncStorage.setItem('tasks', JSON.stringify(tasks)),
  AsyncStorage.setItem('settings', JSON.stringify(settings)),
]);

// Bad: Individual saves
await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
await AsyncStorage.setItem('settings', JSON.stringify(settings));
```

### Error Handling

1. **Try-Catch** - Wrap all storage operations
2. **Fallback** - Provide default values
3. **Logging** - Log errors for debugging
4. **Recovery** - Implement data recovery

```typescript
async function safeLoadTasks(): Promise<Task[]> {
  try {
    return await loadTasks();
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];  // Fallback to empty array
  }
}
```

### Data Validation

1. **Type Checking** - Validate data types
2. **Schema Validation** - Use Zod or similar
3. **Sanitization** - Clean user input
4. **Constraints** - Enforce data constraints

```typescript
// Validate task data
function validateTask(task: any): task is Task {
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.completed === 'boolean' &&
    ['low', 'medium', 'high'].includes(task.priority)
  );
}
```

### Security

1. **Sensitive Data** - Use SecureStore
2. **No Passwords** - Never store passwords
3. **Encryption** - Encrypt sensitive data
4. **Permissions** - Request necessary permissions

```typescript
// Store sensitive data securely
async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync('auth_token', token);
}

// Regular data
async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
}
```

---

## Storage Limits

### AsyncStorage Limits

| Platform | Limit |
|----------|-------|
| iOS | 5-10MB |
| Android | 5-10MB |
| Web | 5-10MB |

### File System Limits

| Platform | Limit |
|----------|-------|
| iOS | Device storage |
| Android | Device storage |
| Web | Browser storage |

### Optimization Tips

1. Remove old/archived data
2. Compress large data structures
3. Use pagination for large lists
4. Archive old tasks

---

## Troubleshooting

### Data Not Saving

```typescript
// Check AsyncStorage availability
try {
  await AsyncStorage.setItem('test', 'test');
  await AsyncStorage.removeItem('test');
  console.log('AsyncStorage available');
} catch (error) {
  console.error('AsyncStorage not available:', error);
}
```

### Data Corruption

```typescript
// Validate and repair data
async function repairData() {
  const tasks = await loadTasks();
  const validTasks = tasks.filter(validateTask);
  
  if (validTasks.length < tasks.length) {
    console.warn('Removed corrupted tasks');
    await saveTasks(validTasks);
  }
}
```

### Storage Full

```typescript
// Check storage usage
async function checkStorageUsage() {
  const keys = await AsyncStorage.getAllKeys();
  let totalSize = 0;
  
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    totalSize += value?.length || 0;
  }
  
  console.log('Storage used:', totalSize, 'bytes');
}
```

---

## Resources

### Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture
- [TYPES.md](./TYPES.md) - Type definitions
- [COMPONENTS.md](./COMPONENTS.md) - Component reference

### External Resources

- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
