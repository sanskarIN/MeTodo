# MeTodo - State Management Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains state management in MeTodo. It covers React Context, AsyncStorage, and best practices for managing application state.

---

## Table of Contents

1. [Introduction](#introduction)
2. [State Management Architecture](#state-management-architecture)
3. [React Context](#react-context)
4. [Local Storage](#local-storage)
5. [Task Context](#task-context)
6. [Theme Context](#theme-context)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)

---

## Introduction

### State Management Overview

MeTodo uses a simple but effective state management approach:
- React Context for global state
- AsyncStorage for persistence
- Local component state for UI state
- Custom hooks for reusable logic

### Why This Approach?

**Simplicity:**
- Easy to understand
- Minimal boilerplate
- No external dependencies
- Easy to debug

**Scalability:**
- Works for small apps
- Scales to medium apps
- Easy to migrate to Redux if needed
- Flexible architecture

**Performance:**
- Optimized re-renders
- Selective subscriptions
- Memoization support
- No unnecessary updates

---

## State Management Architecture

### State Hierarchy

```
App State
├── Theme State
│   ├── Current theme
│   ├── Dark mode
│   └── Theme preferences
├── Task State
│   ├── All tasks
│   ├── Selected task
│   └── Task filters
├── Avatar State
│   ├── Current avatar
│   ├── Avatar list
│   └── Avatar preferences
└── UI State
    ├── Navigation state
    ├── Modal visibility
    └── Loading states
```

### Context Structure

```typescript
// Each context has:
// 1. Type definitions
// 2. Context creation
// 3. Provider component
// 4. Custom hook
```

---

## React Context

### Creating Context

**Step 1: Define Types**
```typescript
// types/theme.ts
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
```

**Step 2: Create Context**
```typescript
// lib/theme-context.tsx
import { createContext } from 'react';

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
```

**Step 3: Create Provider**
```typescript
// lib/theme-context.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  const value: ThemeContextType = {
    theme,
    setTheme,
    isDarkMode,
    toggleDarkMode,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 4: Create Hook**
```typescript
// lib/theme-context.tsx
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Using Context

**In Components:**
```typescript
function SettingsScreen() {
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <View>
      <Text>Current Theme: {theme}</Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleDarkMode}
      />
    </View>
  );
}
```

---

## Local Storage

### AsyncStorage Basics

**Writing Data:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveTheme(theme: Theme) {
  try {
    await AsyncStorage.setItem('theme', JSON.stringify(theme));
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}
```

**Reading Data:**
```typescript
async function loadTheme(): Promise<Theme> {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return theme ? JSON.parse(theme) : 'light';
  } catch (error) {
    console.error('Failed to load theme:', error);
    return 'light';
  }
}
```

**Deleting Data:**
```typescript
async function clearTheme() {
  try {
    await AsyncStorage.removeItem('theme');
  } catch (error) {
    console.error('Failed to clear theme:', error);
  }
}
```

### Persisting State

**Save on Change:**
```typescript
useEffect(() => {
  saveTheme(theme);
}, [theme]);
```

**Load on Mount:**
```typescript
useEffect(() => {
  loadTheme().then(setTheme);
}, []);
```

---

## Task Context

### Task State Structure

```typescript
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasks: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
```

### Task Provider Implementation

```typescript
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load tasks on mount
  useEffect(() => {
    getTasks();
  }, []);
  
  const getTasks = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem('tasks');
      setTasks(stored ? JSON.parse(stored) : []);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const addTask = useCallback(async (task: Task) => {
    try {
      const updated = [...tasks, task];
      setTasks(updated);
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    } catch (err) {
      setError('Failed to add task');
    }
  }, [tasks]);
  
  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const updated = tasks.map(t => 
        t.id === id ? { ...t, ...updates } : t
      );
      setTasks(updated);
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    } catch (err) {
      setError('Failed to update task');
    }
  }, [tasks]);
  
  const deleteTask = useCallback(async (id: string) => {
    try {
      const updated = tasks.filter(t => t.id !== id);
      setTasks(updated);
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    } catch (err) {
      setError('Failed to delete task');
    }
  }, [tasks]);
  
  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasks,
    loading,
    error,
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}
```

---

## Theme Context

### Theme State Structure

```typescript
interface ThemeContextType {
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => Promise<void>;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => Promise<void>;
  customThemes: CustomTheme[];
  addCustomTheme: (theme: CustomTheme) => Promise<void>;
  deleteCustomTheme: (id: string) => Promise<void>;
}
```

### Theme Provider Implementation

```typescript
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  
  // Load theme on mount
  useEffect(() => {
    loadTheme();
  }, []);
  
  const loadTheme = useCallback(async () => {
    try {
      const theme = await AsyncStorage.getItem('currentTheme');
      const dark = await AsyncStorage.getItem('isDarkMode');
      const custom = await AsyncStorage.getItem('customThemes');
      
      if (theme) setCurrentTheme(JSON.parse(theme));
      if (dark) setIsDarkMode(JSON.parse(dark));
      if (custom) setCustomThemes(JSON.parse(custom));
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  }, []);
  
  const updateCurrentTheme = useCallback(async (theme: Theme) => {
    setCurrentTheme(theme);
    await AsyncStorage.setItem('currentTheme', JSON.stringify(theme));
  }, []);
  
  const updateDarkMode = useCallback(async (dark: boolean) => {
    setIsDarkMode(dark);
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(dark));
  }, []);
  
  const addCustomTheme = useCallback(async (theme: CustomTheme) => {
    const updated = [...customThemes, theme];
    setCustomThemes(updated);
    await AsyncStorage.setItem('customThemes', JSON.stringify(updated));
  }, [customThemes]);
  
  const deleteCustomTheme = useCallback(async (id: string) => {
    const updated = customThemes.filter(t => t.id !== id);
    setCustomThemes(updated);
    await AsyncStorage.setItem('customThemes', JSON.stringify(updated));
  }, [customThemes]);
  
  const value: ThemeContextType = {
    currentTheme,
    setCurrentTheme: updateCurrentTheme,
    isDarkMode,
    setIsDarkMode: updateDarkMode,
    customThemes,
    addCustomTheme,
    deleteCustomTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## Best Practices

### Context Organization

**Do:**
- ✅ One context per domain
- ✅ Keep contexts focused
- ✅ Use custom hooks
- ✅ Provide error handling
- ✅ Persist important state

**Don't:**
- ❌ Create mega contexts
- ❌ Mix concerns
- ❌ Expose context directly
- ❌ Ignore errors
- ❌ Lose state on refresh

### Performance Optimization

**Memoize Context Value:**
```typescript
const value = useMemo(() => ({
  theme,
  setTheme,
  isDarkMode,
  toggleDarkMode,
}), [theme, isDarkMode]);

return (
  <ThemeContext.Provider value={value}>
    {children}
  </ThemeContext.Provider>
);
```

**Split Contexts:**
```typescript
// Instead of one large context
<AppContext.Provider>

// Use multiple focused contexts
<ThemeProvider>
  <TaskProvider>
    <AvatarProvider>
      {children}
    </AvatarProvider>
  </TaskProvider>
</ThemeProvider>
```

---

## Common Patterns

### Loading State

```typescript
const { tasks, loading, error } = useTasks();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return <TaskList tasks={tasks} />;
```

### Async Operations

```typescript
const { addTask } = useTasks();

const handleAddTask = async (task: Task) => {
  try {
    await addTask(task);
    showSuccessMessage('Task added');
  } catch (error) {
    showErrorMessage('Failed to add task');
  }
};
```

### Conditional Rendering

```typescript
const { isDarkMode } = useTheme();

return (
  <View className={isDarkMode ? 'bg-black' : 'bg-white'}>
    {/* ... */}
  </View>
);
```

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
