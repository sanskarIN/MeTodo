# MeTodo - Type Definitions Reference

## Table of Contents

1. [Overview](#overview)
2. [Task Types](#task-types)
3. [User Types](#user-types)
4. [Theme Types](#theme-types)
5. [API Types](#api-types)
6. [Utility Types](#utility-types)

---

## Overview

All TypeScript type definitions for MeTodo are centralized in `types/index.ts` for consistency and easy maintenance.

---

## Task Types

### Task Interface

```typescript
/**
 * Main task object representing a single task item.
 * Contains all information about a task including metadata,
 * status, and related items like subtasks and reminders.
 */
interface Task {
  /** Unique identifier for the task */
  id: string;
  
  /** Task title (required) */
  title: string;
  
  /** Detailed task description (optional) */
  description?: string;
  
  /** Task completion status */
  completed: boolean;
  
  /** Task priority level */
  priority: Priority;
  
  /** Category ID this task belongs to */
  category?: string;
  
  /** Array of tag IDs associated with this task */
  tags?: string[];
  
  /** Due date for task completion */
  dueDate?: Date;
  
  /** Task creation timestamp */
  createdAt: Date;
  
  /** Last modification timestamp */
  updatedAt: Date;
  
  /** Array of subtasks */
  subtasks?: Subtask[];
  
  /** Array of reminders for this task */
  reminders?: Reminder[];
  
  /** Rich text notes for the task */
  notes?: string;
  
  /** Recurrence pattern if task repeats */
  recurring?: RecurringPattern;
}

/** Priority levels for tasks */
type Priority = 'low' | 'medium' | 'high';

/** Sort options for task lists */
type TaskSort = 'priority' | 'dueDate' | 'created' | 'alphabetical';

/** Filter options for tasks */
type TaskFilter = 'all' | 'active' | 'completed' | 'overdue';
```

### Subtask Interface

```typescript
/**
 * Represents a subtask within a parent task.
 * Used for breaking down complex tasks into smaller steps.
 */
interface Subtask {
  /** Unique identifier for subtask */
  id: string;
  
  /** Subtask title */
  title: string;
  
  /** Completion status */
  completed: boolean;
  
  /** Display order in list */
  order: number;
  
  /** Creation timestamp */
  createdAt?: Date;
  
  /** Last update timestamp */
  updatedAt?: Date;
}
```

### Reminder Interface

```typescript
/**
 * Represents a reminder notification for a task.
 * Can be triggered at specific times before the due date.
 */
interface Reminder {
  /** Unique identifier for reminder */
  id: string;
  
  /** Type of reminder notification */
  type: 'notification' | 'email' | 'sms';
  
  /** Minutes before due date to trigger reminder */
  timeBeforeDue: number;
  
  /** Whether reminder is active */
  enabled: boolean;
  
  /** Last time reminder was sent */
  lastSent?: Date;
}
```

### RecurringPattern Interface

```typescript
/**
 * Defines how a task should repeat.
 * Supports daily, weekly, monthly, and yearly patterns.
 */
interface RecurringPattern {
  /** Frequency of recurrence */
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  
  /** Interval between occurrences (e.g., every 2 weeks) */
  interval: number;
  
  /** Days of week for weekly recurrence (0-6, Sunday-Saturday) */
  daysOfWeek?: number[];
  
  /** Day of month for monthly recurrence (1-31) */
  dayOfMonth?: number;
  
  /** End date for recurrence (null = infinite) */
  endDate?: Date;
  
  /** Maximum number of occurrences */
  maxOccurrences?: number;
}
```

---

## User Types

### Avatar Interface

```typescript
/**
 * Represents a user's customized avatar.
 * Stores all avatar customization preferences.
 */
interface Avatar {
  /** Unique identifier for avatar */
  id: string;
  
  /** Hair style selection */
  hairStyle: HairStyle;
  
  /** Hair color in hex format */
  hairColor: string;
  
  /** Eye shape selection */
  eyeShape: EyeShape;
  
  /** Eye color in hex format */
  eyeColor: string;
  
  /** Optional accessories */
  accessories?: Accessory;
  
  /** Skin tone selection */
  skinTone: SkinTone;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
}

/** Available hair styles */
type HairStyle = 'short' | 'long' | 'curly' | 'straight' | 'bald';

/** Available eye shapes */
type EyeShape = 'round' | 'almond' | 'wide' | 'narrow';

/** Available accessories */
type Accessory = 'glasses' | 'hat' | 'earrings' | 'none';

/** Available skin tones */
type SkinTone = 'light' | 'light-medium' | 'medium' | 'medium-dark' | 'dark';
```

### Category Interface

```typescript
/**
 * Represents a task category for organization.
 * Categories help organize tasks by type or project.
 */
interface Category {
  /** Unique identifier for category */
  id: string;
  
  /** Category name */
  name: string;
  
  /** Category color in hex format */
  color: string;
  
  /** Optional icon name */
  icon?: string;
  
  /** Number of tasks in this category */
  taskCount: number;
  
  /** Creation timestamp */
  createdAt: Date;
}
```

### Tag Interface

```typescript
/**
 * Represents a tag for flexible task organization.
 * Tags allow cross-categorization of tasks.
 */
interface Tag {
  /** Unique identifier for tag */
  id: string;
  
  /** Tag name */
  name: string;
  
  /** Tag color in hex format */
  color: string;
  
  /** Number of tasks with this tag */
  taskCount: number;
  
  /** Creation timestamp */
  createdAt: Date;
}
```

---

## Theme Types

### Theme Interface

```typescript
/**
 * Represents a complete color theme for the application.
 * Defines all colors used throughout the app.
 */
interface Theme {
  /** Unique identifier for theme */
  id: string;
  
  /** Theme name */
  name: string;
  
  /** Primary accent color (hex) */
  primary: string;
  
  /** Secondary accent color (hex) */
  secondary: string;
  
  /** Main background color (hex) */
  background: string;
  
  /** Surface/card background color (hex) */
  surface: string;
  
  /** Primary text color (hex) */
  foreground: string;
  
  /** Secondary text color (hex) */
  muted: string;
  
  /** Border/divider color (hex) */
  border: string;
  
  /** Success state color (hex) */
  success: string;
  
  /** Warning state color (hex) */
  warning: string;
  
  /** Error state color (hex) */
  error: string;
  
  /** Whether this is a custom user theme */
  isCustom: boolean;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt?: Date;
}

/** Color scheme type */
type ColorScheme = 'light' | 'dark';

/** Theme palette for runtime use */
interface ThemeColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}
```

---

## API Types

### API Response Types

```typescript
/**
 * Generic API response wrapper
 */
interface ApiResponse<T> {
  /** Response data */
  data: T;
  
  /** Response status code */
  status: number;
  
  /** Success indicator */
  success: boolean;
  
  /** Optional error message */
  error?: string;
}

/**
 * Paginated response wrapper
 */
interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  
  /** Current page number */
  page: number;
  
  /** Items per page */
  pageSize: number;
  
  /** Total number of items */
  total: number;
  
  /** Total number of pages */
  totalPages: number;
}
```

### API Request Types

```typescript
/**
 * Task creation request
 */
interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: Priority;
  category?: string;
  dueDate?: Date;
  tags?: string[];
}

/**
 * Task update request
 */
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  category?: string;
  dueDate?: Date;
  tags?: string[];
  completed?: boolean;
}

/**
 * Task filter request
 */
interface TaskFilterRequest {
  category?: string;
  tag?: string;
  priority?: Priority;
  completed?: boolean;
  overdue?: boolean;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
  sort?: TaskSort;
  page?: number;
  pageSize?: number;
}
```

---

## Utility Types

### Common Utility Types

```typescript
/**
 * Generic key-value object
 */
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};

/**
 * Make all properties optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties required
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Make all properties readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Extract keys of a type
 */
type Keys<T> = keyof T;

/**
 * Extract values of a type
 */
type Values<T> = T[keyof T];
```

### Custom Utility Types

```typescript
/**
 * Nullable type - value can be T or null
 */
type Nullable<T> = T | null;

/**
 * Optional type - value can be T or undefined
 */
type Optional<T> = T | undefined;

/**
 * Either type - value can be T or U
 */
type Either<T, U> = T | U;

/**
 * Async function type
 */
type AsyncFunction<T, R> = (arg: T) => Promise<R>;

/**
 * Callback function type
 */
type Callback<T> = (data: T) => void;

/**
 * Event handler type
 */
type EventHandler<T> = (event: T) => void;
```

### State Management Types

```typescript
/**
 * Redux action type
 */
interface Action<T = any> {
  type: string;
  payload?: T;
}

/**
 * Redux reducer type
 */
type Reducer<S, A extends Action> = (state: S, action: A) => S;

/**
 * Context value type
 */
interface ContextValue<T> {
  state: T;
  dispatch: (action: Action) => void;
}
```

---

## Type Guards

### Type Guard Functions

```typescript
/**
 * Check if value is a Task
 */
function isTask(value: any): value is Task {
  return (
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.completed === 'boolean'
  );
}

/**
 * Check if value is an Avatar
 */
function isAvatar(value: any): value is Avatar {
  return (
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    ['short', 'long', 'curly', 'straight', 'bald'].includes(value.hairStyle)
  );
}

/**
 * Check if value is a Theme
 */
function isTheme(value: any): value is Theme {
  return (
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.primary === 'string' &&
    typeof value.background === 'string'
  );
}
```

---

## Generic Types

### Generic Utility Types

```typescript
/**
 * Extract array element type
 */
type ArrayElement<T> = T extends (infer E)[] ? E : never;

/**
 * Extract promise resolution type
 */
type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never;

/**
 * Extract function return type
 */
type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Deep partial type
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly type
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

---

## Best Practices

### Type Definition Guidelines

1. **Use Interfaces for Objects** - Clearer intent than types
2. **Use Types for Unions** - Better for discriminated unions
3. **Avoid `any`** - Use `unknown` if needed
4. **Use Strict Null Checks** - Enable in tsconfig.json
5. **Document Complex Types** - Add JSDoc comments

```typescript
// Good
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

type Priority = 'low' | 'medium' | 'high';

// Avoid
interface Task {
  id: any;
  title: any;
  completed: any;
}
```

### Type Reusability

```typescript
// Create base types
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extend for specific types
interface Task extends BaseEntity {
  title: string;
  completed: boolean;
}

interface Category extends BaseEntity {
  name: string;
  color: string;
}
```

---

## Resources

### Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [DATA_STORAGE.md](./DATA_STORAGE.md) - Storage models
- [COMPONENTS.md](./COMPONENTS.md) - Component types

### External Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
