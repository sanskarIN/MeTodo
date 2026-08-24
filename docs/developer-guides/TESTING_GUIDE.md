# MeTodo - Testing Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains testing strategies, tools, and best practices for MeTodo. It covers unit tests, integration tests, and end-to-end testing.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Testing Strategy](#testing-strategy)
3. [Unit Testing](#unit-testing)
4. [Component Testing](#component-testing)
5. [Integration Testing](#integration-testing)
6. [Testing Best Practices](#testing-best-practices)
7. [Running Tests](#running-tests)
8. [CI/CD Integration](#cicd-integration)

---

## Introduction

### Testing Overview

MeTodo uses Vitest for testing:
- Fast test execution
- TypeScript support
- React component testing
- Mock support
- Coverage reporting

### Testing Pyramid

```
        E2E Tests (10%)
      /                \
    Integration Tests (30%)
   /                      \
Unit Tests (60%)
```

---

## Testing Strategy

### Test Coverage Goals

**Target Coverage:**
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

**Priority Areas:**
- Core business logic
- Utility functions
- Hooks
- Components

---

## Unit Testing

### Testing Utilities

**Example Utility Test:**
```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });
  
  it('should handle conditional classes', () => {
    expect(cn('px-4', true && 'py-2')).toBe('px-4 py-2');
  });
  
  it('should override Tailwind classes', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8');
  });
});
```

### Testing Functions

**Example Function Test:**
```typescript
// lib/task-utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTaskStats, filterTasks } from '@/lib/task-utils';

describe('Task Utilities', () => {
  describe('calculateTaskStats', () => {
    it('should calculate completion rate', () => {
      const tasks = [
        { id: '1', completed: true },
        { id: '2', completed: true },
        { id: '3', completed: false },
      ];
      
      const stats = calculateTaskStats(tasks);
      expect(stats.completionRate).toBe(0.67);
    });
  });
  
  describe('filterTasks', () => {
    it('should filter by status', () => {
      const tasks = [
        { id: '1', status: 'completed' },
        { id: '2', status: 'pending' },
      ];
      
      const filtered = filterTasks(tasks, { status: 'completed' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });
});
```

---

## Component Testing

### Testing Components

**Example Component Test:**
```typescript
// components/TaskCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '@/components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    completed: false,
    priority: 'high',
  };
  
  it('should render task title', () => {
    render(<TaskCard task={mockTask} onPress={() => {}} />);
    expect(screen.getByText('Test Task')).toBeTruthy();
  });
  
  it('should call onPress when tapped', () => {
    const onPress = vi.fn();
    render(<TaskCard task={mockTask} onPress={onPress} />);
    
    fireEvent.press(screen.getByText('Test Task'));
    expect(onPress).toHaveBeenCalledWith('1');
  });
  
  it('should show completed state', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskCard task={completedTask} onPress={() => {}} />);
    
    const checkbox = screen.getByTestId('task-checkbox');
    expect(checkbox).toHaveProperty('checked', true);
  });
});
```

### Testing Hooks

**Example Hook Test:**
```typescript
// hooks/useTasks.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '@/hooks/useTasks';

describe('useTasks', () => {
  it('should initialize with empty tasks', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });
  
  it('should add task', async () => {
    const { result } = renderHook(() => useTasks());
    
    const newTask = { id: '1', title: 'New Task' };
    await act(async () => {
      await result.current.addTask(newTask);
    });
    
    expect(result.current.tasks).toContainEqual(newTask);
  });
  
  it('should delete task', async () => {
    const { result } = renderHook(() => useTasks());
    
    const task = { id: '1', title: 'Task' };
    await act(async () => {
      await result.current.addTask(task);
      await result.current.deleteTask('1');
    });
    
    expect(result.current.tasks).toHaveLength(0);
  });
});
```

---

## Integration Testing

### Testing Context

**Example Context Test:**
```typescript
// lib/task-context.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { TaskProvider, useTask } from '@/lib/task-context';

function TestComponent() {
  const { tasks, addTask } = useTask();
  
  return (
    <View>
      <Text testID="task-count">{tasks.length}</Text>
      <Pressable
        testID="add-button"
        onPress={() => addTask({ id: '1', title: 'Test' })}
      >
        <Text>Add</Text>
      </Pressable>
    </View>
  );
}

describe('TaskContext', () => {
  it('should provide tasks', () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    expect(screen.getByTestId('task-count')).toHaveTextContent('0');
  });
  
  it('should add task', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    fireEvent.press(screen.getByTestId('add-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });
  });
});
```

---

## Testing Best Practices

### Test Structure

**Organize Tests:**
```typescript
describe('Component Name', () => {
  // Setup
  beforeEach(() => {
    // Reset state
  });
  
  // Group related tests
  describe('rendering', () => {
    it('should render correctly', () => {});
  });
  
  describe('interactions', () => {
    it('should handle press', () => {});
  });
  
  describe('edge cases', () => {
    it('should handle null props', () => {});
  });
});
```

### Naming Conventions

**Clear Test Names:**
```typescript
// ✅ Good
it('should display error message when task creation fails', () => {});
it('should disable submit button while loading', () => {});
it('should call onPress with correct task ID', () => {});

// ❌ Bad
it('works', () => {});
it('test button', () => {});
it('error handling', () => {});
```

### Mocking

**Mock External Dependencies:**
```typescript
import { vi } from 'vitest';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

// Mock API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;
```

---

## Running Tests

### Commands

**Run All Tests:**
```bash
npm run test
```

**Run Specific Test:**
```bash
npm run test -- TaskCard.test.ts
```

**Run Tests in Watch Mode:**
```bash
npm run test -- --watch
```

**Generate Coverage Report:**
```bash
npm run test -- --coverage
```

### Coverage Report

**View Coverage:**
```bash
npm run test -- --coverage

# Output:
# ======= Coverage summary =======
# Statements   : 82.5% ( 100/121 )
# Branches     : 78.3% ( 36/46 )
# Functions    : 85.0% ( 17/20 )
# Lines        : 82.5% ( 100/121 )
```

---

## CI/CD Integration

### GitHub Actions

**Example Workflow:**
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run test -- --coverage
      
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/coverage-final.json
```

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
