# MeTodo - Coding Standards & Best Practices

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide establishes coding standards, best practices, and conventions for MeTodo development. It ensures code consistency, maintainability, and quality across the entire project.

---

## Table of Contents

1. [Introduction](#introduction)
2. [TypeScript Standards](#typescript-standards)
3. [React/React Native Standards](#reactreact-native-standards)
4. [Component Guidelines](#component-guidelines)
5. [Naming Conventions](#naming-conventions)
6. [File Organization](#file-organization)
7. [Code Style](#code-style)
8. [Comments & Documentation](#comments--documentation)
9. [Error Handling](#error-handling)
10. [Testing Standards](#testing-standards)
11. [Performance Guidelines](#performance-guidelines)
12. [Accessibility Standards](#accessibility-standards)

---

## Introduction

### Purpose

These standards ensure:
- Consistent code quality
- Easy maintenance
- Better collaboration
- Fewer bugs
- Improved performance

### Scope

These standards apply to:
- All TypeScript files
- All React components
- All utility functions
- All hooks
- All tests

### Enforcement

Standards are enforced through:
- ESLint configuration
- TypeScript compiler
- Prettier formatter
- Code review process
- Automated testing

---

## TypeScript Standards

### Type Definitions

**Always Define Types:**
```typescript
// ✅ Good
interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

function createTask(task: Task): void {
  // ...
}

// ❌ Bad
function createTask(task: any): void {
  // ...
}
```

**Use Strict Mode:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

**Avoid `any` Type:**
```typescript
// ✅ Good
const data: Record<string, unknown> = {};

// ❌ Bad
const data: any = {};
```

### Interfaces vs Types

**Use Interfaces for Objects:**
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
type User = {
  id: string;
  name: string;
  email: string;
};
```

**Use Types for Unions:**
```typescript
// ✅ Good
type Status = 'pending' | 'completed' | 'failed';

// ❌ Bad
interface Status {
  value: 'pending' | 'completed' | 'failed';
}
```

---

## React/React Native Standards

### Functional Components

**Always Use Functional Components:**
```typescript
// ✅ Good
export function TaskCard({ task }: { task: Task }) {
  return <View>{/* ... */}</View>;
}

// ❌ Bad
export class TaskCard extends React.Component {
  render() {
    return <View>{/* ... */}</View>;
  }
}
```

### Hooks Usage

**Use Hooks for State & Effects:**
```typescript
// ✅ Good
function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  return <View>{/* ... */}</View>;
}

// ❌ Bad
function TaskList() {
  const [tasks, setTasks] = useState();
  // No type
}
```

**Custom Hooks:**
```typescript
// ✅ Good
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, []);
  
  return { tasks, addTask };
}

// ❌ Bad
function getTasks() {
  // Not a hook (doesn't use hooks)
}
```

---

## Component Guidelines

### Component Structure

**Organize Components Logically:**
```typescript
// ✅ Good
export function TaskCard({ task, onPress }: Props) {
  // 1. State
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3. Callbacks
  const handlePress = useCallback(() => {
    onPress(task.id);
  }, [task.id, onPress]);
  
  // 4. Render
  return (
    <Pressable onPress={handlePress}>
      {/* ... */}
    </Pressable>
  );
}
```

### Component Props

**Define Props Interface:**
```typescript
// ✅ Good
interface TaskCardProps {
  task: Task;
  onPress: (id: string) => void;
  isSelected?: boolean;
}

export function TaskCard({ task, onPress, isSelected }: TaskCardProps) {
  // ...
}

// ❌ Bad
export function TaskCard(props: any) {
  // ...
}
```

**Use Destructuring:**
```typescript
// ✅ Good
function TaskCard({ task, onPress }: TaskCardProps) {
  return <View>{task.title}</View>;
}

// ❌ Bad
function TaskCard(props: TaskCardProps) {
  return <View>{props.task.title}</View>;
}
```

---

## Naming Conventions

### Components

**PascalCase for Components:**
```typescript
// ✅ Good
export function TaskCard() {}
export function AvatarCreator() {}
export function SettingsScreen() {}

// ❌ Bad
export function taskCard() {}
export function avatar_creator() {}
export function settings-screen() {}
```

### Functions & Variables

**camelCase for Functions & Variables:**
```typescript
// ✅ Good
function calculateTaskStats() {}
const isCompleted = true;
const taskList: Task[] = [];

// ❌ Bad
function CalculateTaskStats() {}
const IsCompleted = true;
const task_list: Task[] = [];
```

### Constants

**UPPER_SNAKE_CASE for Constants:**
```typescript
// ✅ Good
const MAX_TASKS = 1000;
const DEFAULT_PRIORITY = 'medium';
const API_TIMEOUT = 30000;

// ❌ Bad
const maxTasks = 1000;
const default_priority = 'medium';
const apiTimeout = 30000;
```

### Booleans

**Use `is`, `has`, `can` Prefix:**
```typescript
// ✅ Good
const isCompleted = true;
const hasSubtasks = false;
const canEdit = true;

// ❌ Bad
const completed = true;
const subtasks = false;
const edit = true;
```

---

## File Organization

### File Structure

**One Component Per File:**
```typescript
// ✅ Good: TaskCard.tsx
export function TaskCard() {}

// ❌ Bad: Components.tsx
export function TaskCard() {}
export function TaskList() {}
export function TaskDetail() {}
```

**Logical Grouping:**
```
components/
├── TaskCard.tsx
├── TaskList.tsx
├── TaskDetail.tsx
└── index.ts  // Export all
```

### Import Organization

**Organize Imports:**
```typescript
// ✅ Good
// 1. React imports
import { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

// 2. Third-party imports
import { useQuery } from '@tanstack/react-query';

// 3. Local imports
import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';

// ❌ Bad
import { useTasks } from '@/hooks/useTasks';
import { useState } from 'react';
import { Task } from '@/types';
import { View } from 'react-native';
```

---

## Code Style

### Formatting

**Use Prettier:**
```bash
# Format code
npm run format

# Check formatting
npm run format -- --check
```

**Prettier Configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Line Length

**Keep Lines Under 100 Characters:**
```typescript
// ✅ Good
const result = calculateComplexValue(
  param1,
  param2,
  param3
);

// ❌ Bad
const result = calculateComplexValue(param1, param2, param3, param4, param5, param6);
```

### Indentation

**Use 2 Spaces:**
```typescript
// ✅ Good
function example() {
  if (condition) {
    doSomething();
  }
}

// ❌ Bad
function example() {
    if (condition) {
        doSomething();
    }
}
```

---

## Comments & Documentation

### File Headers

**Add File Header:**
```typescript
// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE
 * This file contains the TaskCard component which displays a single task
 * in the task list. It handles task display, editing, and deletion.
 */

import { View, Text } from 'react-native';
```

### Function Documentation

**Document Complex Functions:**
```typescript
/**
 * Calculates task statistics for the given tasks.
 * 
 * @param tasks - Array of tasks to analyze
 * @param period - Time period for statistics ('day', 'week', 'month')
 * @returns Object containing completion rate, average time, etc.
 * 
 * @example
 * const stats = calculateTaskStats(tasks, 'week');
 * console.log(stats.completionRate); // 0.75
 */
function calculateTaskStats(
  tasks: Task[],
  period: 'day' | 'week' | 'month'
): TaskStats {
  // ...
}
```

### Inline Comments

**Use Sparingly:**
```typescript
// ✅ Good
// Filter completed tasks
const completedTasks = tasks.filter(t => t.completed);

// ❌ Bad
// Loop through tasks
for (let i = 0; i < tasks.length; i++) {
  // Check if task is completed
  if (tasks[i].completed) {
    // Add to array
    completed.push(tasks[i]);
  }
}
```

### TODO Comments

**Mark Incomplete Work:**
```typescript
// TODO: Implement task filtering
// TODO: Add error handling for API calls
// TODO: Optimize performance for large lists

// FIXME: Bug in date calculation
// FIXME: Memory leak in useEffect
```

---

## Error Handling

### Try-Catch Blocks

**Always Handle Errors:**
```typescript
// ✅ Good
async function loadTasks() {
  try {
    const tasks = await fetchTasks();
    setTasks(tasks);
  } catch (error) {
    console.error('Failed to load tasks:', error);
    showErrorMessage('Failed to load tasks');
  }
}

// ❌ Bad
async function loadTasks() {
  const tasks = await fetchTasks();
  setTasks(tasks);
}
```

### Error Messages

**Provide Clear Error Messages:**
```typescript
// ✅ Good
throw new Error('Failed to create task: Invalid title');

// ❌ Bad
throw new Error('Error');
```

---

## Testing Standards

### Test File Naming

**Name Tests Appropriately:**
```
TaskCard.test.ts
TaskCard.spec.ts
__tests__/TaskCard.ts
```

### Test Structure

**Organize Tests:**
```typescript
describe('TaskCard', () => {
  describe('rendering', () => {
    it('should render task title', () => {
      // ...
    });
  });
  
  describe('interactions', () => {
    it('should call onPress when tapped', () => {
      // ...
    });
  });
});
```

---

## Performance Guidelines

### Memoization

**Use Memoization When Needed:**
```typescript
// ✅ Good
const MemoizedTaskCard = memo(TaskCard);

const handlePress = useCallback(() => {
  onPress(task.id);
}, [task.id, onPress]);

// ❌ Bad
const handlePress = () => {
  onPress(task.id);
};
```

### Lists

**Use FlatList:**
```typescript
// ✅ Good
<FlatList
  data={tasks}
  renderItem={({ item }) => <TaskCard task={item} />}
  keyExtractor={item => item.id}
/>

// ❌ Bad
<ScrollView>
  {tasks.map(task => (
    <TaskCard key={task.id} task={task} />
  ))}
</ScrollView>
```

---

## Accessibility Standards

### Semantic HTML

**Use Accessible Components:**
```typescript
// ✅ Good
<Pressable
  accessible={true}
  accessibilityLabel="Complete task"
  accessibilityRole="button"
  onPress={handlePress}
>
  <Text>Complete</Text>
</Pressable>

// ❌ Bad
<View onPress={handlePress}>
  <Text>Complete</Text>
</View>
```

### Color Contrast

**Ensure Sufficient Contrast:**
```typescript
// ✅ Good
<Text className="text-foreground">High contrast text</Text>

// ❌ Bad
<Text className="text-gray-300">Low contrast text</Text>
```

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
