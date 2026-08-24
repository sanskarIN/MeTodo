# MeTodo - API Documentation

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
Complete API documentation for MeTodo, including all available hooks, context APIs, utility functions, and data management interfaces.

---

## Table of Contents

1. [Task API](#task-api)
2. [Avatar API](#avatar-api)
3. [Theme API](#theme-api)
4. [Hooks](#hooks)
5. [Context APIs](#context-apis)
6. [Utility Functions](#utility-functions)
7. [Type Definitions](#type-definitions)
8. [Error Handling](#error-handling)

---

## Task API

### Create Task

```typescript
// Function: createTask
// Purpose: Create a new task
// Parameters:
//   - title: string - Task title
//   - description?: string - Task description
//   - priority?: TaskPriority - Task priority (low, medium, high)
//   - dueDate?: Date - Task due date
//   - category?: string - Task category
//   - tags?: string[] - Task tags

async function createTask(
  title: string,
  options?: {
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
    category?: string;
    tags?: string[];
    estimatedTime?: number;
    recurrence?: RecurrencePattern;
  }
): Promise<Task>

// Example Usage
const task = await createTask('Buy groceries', {
  priority: 'high',
  dueDate: new Date('2026-07-01'),
  category: 'Shopping',
  tags: ['urgent', 'shopping'],
  estimatedTime: 30,
});
```

### Update Task

```typescript
// Function: updateTask
// Purpose: Update an existing task
// Parameters:
//   - id: string - Task ID
//   - updates: Partial<Task> - Task updates

async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task>

// Example Usage
const updated = await updateTask(task.id, {
  title: 'Buy groceries and cook dinner',
  completed: false,
  priority: 'medium',
});
```

### Delete Task

```typescript
// Function: deleteTask
// Purpose: Delete a task
// Parameters:
//   - id: string - Task ID

async function deleteTask(id: string): Promise<void>

// Example Usage
await deleteTask(task.id);
```

### Get Tasks

```typescript
// Function: getTasks
// Purpose: Get all tasks with optional filtering
// Parameters:
//   - filter?: TaskFilter - Filter options

async function getTasks(filter?: {
  completed?: boolean;
  priority?: TaskPriority;
  category?: string;
  tags?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
}): Promise<Task[]>

// Example Usage
const tasks = await getTasks({
  completed: false,
  priority: 'high',
  category: 'Work',
});
```

### Complete Task

```typescript
// Function: completeTask
// Purpose: Mark task as completed
// Parameters:
//   - id: string - Task ID

async function completeTask(id: string): Promise<Task>

// Example Usage
const completed = await completeTask(task.id);
```

### Add Subtask

```typescript
// Function: addSubtask
// Purpose: Add a subtask to a task
// Parameters:
//   - taskId: string - Parent task ID
//   - title: string - Subtask title

async function addSubtask(
  taskId: string,
  title: string
): Promise<Task>

// Example Usage
const task = await addSubtask(parentTask.id, 'Wash dishes');
```

### Complete Subtask

```typescript
// Function: completeSubtask
// Purpose: Mark subtask as completed
// Parameters:
//   - taskId: string - Parent task ID
//   - subtaskId: string - Subtask ID

async function completeSubtask(
  taskId: string,
  subtaskId: string
): Promise<Task>

// Example Usage
await completeSubtask(parentTask.id, subtask.id);
```

---

## Avatar API

### Create Avatar

```typescript
// Function: createAvatar
// Purpose: Create a new avatar
// Parameters:
//   - name: string - Avatar name

async function createAvatar(
  name: string,
  options?: {
    hair?: HairStyle;
    eyes?: EyeStyle;
    accessories?: Accessory[];
    skinTone?: SkinTone;
  }
): Promise<Avatar>

// Example Usage
const avatar = await createAvatar('My Avatar', {
  hair: { style: 'long', color: '#FF6B6B' },
  eyes: { shape: 'round', color: '#4ECDC4' },
  skinTone: 'medium',
});
```

### Update Avatar

```typescript
// Function: updateAvatar
// Purpose: Update an existing avatar
// Parameters:
//   - id: string - Avatar ID
//   - updates: Partial<Avatar> - Avatar updates

async function updateAvatar(
  id: string,
  updates: Partial<Avatar>
): Promise<Avatar>

// Example Usage
const updated = await updateAvatar(avatar.id, {
  hair: { style: 'short', color: '#95E1D3' },
});
```

### Delete Avatar

```typescript
// Function: deleteAvatar
// Purpose: Delete an avatar
// Parameters:
//   - id: string - Avatar ID

async function deleteAvatar(id: string): Promise<void>

// Example Usage
await deleteAvatar(avatar.id);
```

### Get Avatars

```typescript
// Function: getAvatars
// Purpose: Get all avatars

async function getAvatars(): Promise<Avatar[]>

// Example Usage
const avatars = await getAvatars();
```

### Set Active Avatar

```typescript
// Function: setActiveAvatar
// Purpose: Set the active avatar
// Parameters:
//   - id: string - Avatar ID

async function setActiveAvatar(id: string): Promise<Avatar>

// Example Usage
await setActiveAvatar(avatar.id);
```

---

## Theme API

### Get Themes

```typescript
// Function: getThemes
// Purpose: Get all available themes

async function getThemes(): Promise<Theme[]>

// Example Usage
const themes = await getThemes();
```

### Get Theme by ID

```typescript
// Function: getTheme
// Purpose: Get a specific theme
// Parameters:
//   - id: string - Theme ID

async function getTheme(id: string): Promise<Theme>

// Example Usage
const theme = await getTheme('dark-theme');
```

### Create Custom Theme

```typescript
// Function: createCustomTheme
// Purpose: Create a custom theme
// Parameters:
//   - name: string - Theme name
//   - colors: ThemeColors - Theme colors

async function createCustomTheme(
  name: string,
  colors: {
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
): Promise<Theme>

// Example Usage
const customTheme = await createCustomTheme('My Theme', {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  foreground: '#000000',
  muted: '#999999',
  border: '#CCCCCC',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
});
```

### Update Theme

```typescript
// Function: updateTheme
// Purpose: Update a custom theme
// Parameters:
//   - id: string - Theme ID
//   - updates: Partial<Theme> - Theme updates

async function updateTheme(
  id: string,
  updates: Partial<Theme>
): Promise<Theme>

// Example Usage
const updated = await updateTheme(customTheme.id, {
  colors: { primary: '#FF5733' },
});
```

### Delete Theme

```typescript
// Function: deleteTheme
// Purpose: Delete a custom theme
// Parameters:
//   - id: string - Theme ID

async function deleteTheme(id: string): Promise<void>

// Example Usage
await deleteTheme(customTheme.id);
```

### Set Active Theme

```typescript
// Function: setActiveTheme
// Purpose: Set the active theme
// Parameters:
//   - id: string - Theme ID

async function setActiveTheme(id: string): Promise<Theme>

// Example Usage
await setActiveTheme('dark-theme');
```

---

## Hooks

### useTasks

```typescript
// Hook: useTasks
// Purpose: Access task management functionality
// Returns: TaskContextType

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  getTasks: () => Promise<Task[]>;
  addSubtask: (taskId: string, title: string) => Promise<void>;
  completeSubtask: (taskId: string, subtaskId: string) => Promise<void>;
}

// Example Usage
function TaskListScreen() {
  const { tasks, addTask, deleteTask } = useTasks();

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onDelete={() => deleteTask(item.id)}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

### useAvatars

```typescript
// Hook: useAvatars
// Purpose: Access avatar management functionality
// Returns: AvatarContextType

interface AvatarContextType {
  avatars: Avatar[];
  activeAvatar: Avatar | null;
  createAvatar: (name: string, options?: AvatarOptions) => Promise<Avatar>;
  updateAvatar: (id: string, updates: Partial<Avatar>) => Promise<Avatar>;
  deleteAvatar: (id: string) => Promise<void>;
  setActiveAvatar: (id: string) => Promise<Avatar>;
}

// Example Usage
function AvatarScreen() {
  const { avatars, activeAvatar, createAvatar } = useAvatars();

  return (
    <View>
      <AvatarPreview avatar={activeAvatar} />
      <FlatList
        data={avatars}
        renderItem={({ item }) => (
          <AvatarItem avatar={item} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
```

### useThemes

```typescript
// Hook: useThemes
// Purpose: Access theme management functionality
// Returns: ThemeContextType

interface ThemeContextType {
  themes: Theme[];
  activeTheme: Theme;
  createCustomTheme: (name: string, colors: ThemeColors) => Promise<Theme>;
  updateTheme: (id: string, updates: Partial<Theme>) => Promise<Theme>;
  deleteTheme: (id: string) => Promise<void>;
  setActiveTheme: (id: string) => Promise<Theme>;
}

// Example Usage
function ThemeSelector() {
  const { themes, activeTheme, setActiveTheme } = useThemes();

  return (
    <FlatList
      data={themes}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => setActiveTheme(item.id)}
          style={{
            opacity: activeTheme.id === item.id ? 1 : 0.5,
          }}
        >
          <ThemePreview theme={item} />
        </Pressable>
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

### useColors

```typescript
// Hook: useColors
// Purpose: Get current theme colors
// Returns: ThemeColorPalette

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

// Example Usage
function MyComponent() {
  const colors = useColors();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>Hello</Text>
    </View>
  );
}
```

### useColorScheme

```typescript
// Hook: useColorScheme
// Purpose: Get current color scheme (light/dark)
// Returns: 'light' | 'dark' | null

// Example Usage
function MyComponent() {
  const colorScheme = useColorScheme();

  return (
    <View>
      <Text>{colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>
    </View>
  );
}
```

---

## Context APIs

### TaskContext

```typescript
// Context: TaskContext
// Purpose: Manage task state globally

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  // Implementation
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
```

### AvatarContext

```typescript
// Context: AvatarContext
// Purpose: Manage avatar state globally

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: ReactNode }) {
  // Implementation
  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatars() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatars must be used within AvatarProvider');
  }
  return context;
}
```

### ThemeContext

```typescript
// Context: ThemeContext
// Purpose: Manage theme state globally

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Implementation
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemes() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemes must be used within ThemeProvider');
  }
  return context;
}
```

---

## Utility Functions

### Task Utilities

```typescript
// Function: generateTaskId
// Purpose: Generate unique task ID
function generateTaskId(): string

// Function: calculateTaskProgress
// Purpose: Calculate task completion progress
function calculateTaskProgress(task: Task): number

// Function: getTaskStatus
// Purpose: Get task status (pending, completed, overdue)
function getTaskStatus(task: Task): TaskStatus

// Function: sortTasks
// Purpose: Sort tasks by criteria
function sortTasks(
  tasks: Task[],
  sortBy: 'priority' | 'dueDate' | 'created' | 'title'
): Task[]

// Function: filterTasks
// Purpose: Filter tasks by criteria
function filterTasks(
  tasks: Task[],
  filter: TaskFilter
): Task[]

// Function: searchTasks
// Purpose: Search tasks by text
function searchTasks(tasks: Task[], query: string): Task[]
```

### Avatar Utilities

```typescript
// Function: generateAvatarId
// Purpose: Generate unique avatar ID
function generateAvatarId(): string

// Function: createDefaultAvatar
// Purpose: Create default avatar
function createDefaultAvatar(name: string): Avatar

// Function: validateAvatarOptions
// Purpose: Validate avatar customization options
function validateAvatarOptions(options: AvatarOptions): boolean
```

### Theme Utilities

```typescript
// Function: generateThemeId
// Purpose: Generate unique theme ID
function generateThemeId(): string

// Function: validateThemeColors
// Purpose: Validate theme colors
function validateThemeColors(colors: ThemeColors): boolean

// Function: getContrastRatio
// Purpose: Calculate color contrast ratio
function getContrastRatio(color1: string, color2: string): number

// Function: isDarkTheme
// Purpose: Check if theme is dark
function isDarkTheme(theme: Theme): boolean
```

---

## Type Definitions

### Task Types

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number;
  actualTime?: number;
  subtasks: Subtask[];
  recurrence?: RecurrencePattern;
  reminders: Reminder[];
  notes: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: Date;
  skipWeekends: boolean;
}

interface Reminder {
  id: string;
  type: 'notification' | 'sound' | 'vibration';
  minutesBefore: number;
  enabled: boolean;
}

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'completed' | 'overdue';
```

### Avatar Types

```typescript
interface Avatar {
  id: string;
  name: string;
  hair: HairStyle;
  eyes: EyeStyle;
  accessories: Accessory[];
  skinTone: SkinTone;
  createdAt: Date;
  updatedAt: Date;
}

interface HairStyle {
  style: 'short' | 'medium' | 'long' | 'curly' | 'straight';
  color: string;
}

interface EyeStyle {
  shape: 'round' | 'almond' | 'hooded' | 'monolid';
  color: string;
}

interface Accessory {
  type: 'glasses' | 'hat' | 'earrings' | 'necklace';
  color: string;
}

type SkinTone = 'light' | 'medium' | 'tan' | 'dark' | 'deep';
```

### Theme Types

```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  isDark: boolean;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ThemeColors {
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

## Error Handling

### Error Types

```typescript
enum ErrorCode {
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  AVATAR_NOT_FOUND = 'AVATAR_NOT_FOUND',
  THEME_NOT_FOUND = 'THEME_NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}
```

### Error Handling Example

```typescript
async function createTaskSafely(title: string) {
  try {
    const task = await createTask(title);
    return { success: true, data: task };
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`Error [${error.code}]: ${error.message}`);
      return { success: false, error: error.code };
    }
    console.error('Unknown error:', error);
    return { success: false, error: ErrorCode.UNKNOWN_ERROR };
  }
}
```

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
