# MeTodo - Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Design Patterns](#design-patterns)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Component Architecture](#component-architecture)
8. [Navigation Structure](#navigation-structure)

---

## Overview

MeTodo is a React Native mobile application built with Expo, designed to provide a comprehensive task management experience across iOS, Android, and web platforms.

### Core Principles

- **Offline-First:** All data stored locally, no internet required
- **Type-Safe:** Full TypeScript implementation
- **Responsive:** Adapts to all screen sizes
- **Accessible:** WCAG compliant design
- **Performant:** Optimized rendering and state management

---

## Project Structure

```
metodo/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout with providers
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home screen
│   │   ├── tasks.tsx            # Tasks list screen
│   │   ├── avatar.tsx           # Avatar creator screen
│   │   └── settings.tsx         # Settings screen
│   ├── create-task.tsx          # Task creation modal
│   ├── task-detail.tsx          # Task detail modal
│   ├── theme-creator.tsx        # Theme creation modal
│   ├── avatar-creator.tsx       # Avatar creation modal
│   ├── dev-options.tsx          # Developer options modal
│   └── oauth/                   # OAuth callback
│
├── components/                   # Reusable UI components
│   ├── screen-container.tsx     # SafeArea wrapper
│   ├── themed-view.tsx          # Theme-aware view
│   ├── haptic-tab.tsx           # Tab with haptic feedback
│   ├── hello-wave.tsx           # Wave animation
│   ├── parallax-scroll-view.tsx # Parallax scroll
│   ├── external-link.tsx        # External link handler
│   └── ui/                      # UI primitives
│       ├── icon-symbol.tsx      # Icon component
│       └── collapsible.tsx      # Collapsible section
│
├── lib/                          # Utility libraries
│   ├── _core/
│   │   ├── theme.ts             # Theme system
│   │   ├── auth.ts              # Authentication
│   │   ├── api.ts               # API client
│   │   └── nativewind-pressable.ts
│   ├── theme-provider.tsx       # Theme context provider
│   ├── task-context.tsx         # Task state context
│   ├── trpc.ts                  # tRPC client
│   └── utils.ts                 # Utility functions
│
├── hooks/                        # Custom React hooks
│   ├── use-colors.ts            # Theme colors hook
│   ├── use-color-scheme.ts      # Color scheme detection
│   └── use-auth.ts              # Authentication hook
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All type definitions
│
├── constants/                    # App constants
│   ├── theme.ts                 # Theme constants
│   ├── oauth.ts                 # OAuth constants
│   └── const.ts                 # General constants
│
├── docs/                         # Documentation
│   ├── README.md                # Main docs hub
│   ├── features/                # Feature documentation
│   ├── technical/               # Technical documentation
│   ├── guides/                  # User guides
│   ├── requirements/            # System requirements
│   ├── how-to-run/              # Setup guides
│   └── make_executable-files/   # Build guides
│
├── server/                       # Backend server
│   ├── _core/
│   │   ├── index.ts             # Server entry point
│   │   ├── trpc.ts              # tRPC router
│   │   ├── context.ts           # Request context
│   │   ├── auth.ts              # Authentication
│   │   ├── dataApi.ts           # Data API
│   │   └── ...
│   ├── routers.ts               # API routers
│   ├── db.ts                    # Database setup
│   └── storage.ts               # Storage setup
│
├── shared/                       # Shared code
│   ├── _core/
│   │   └── errors.ts            # Error definitions
│   ├── const.ts                 # Shared constants
│   └── types.ts                 # Shared types
│
├── assets/                       # Static assets
│   └── images/                  # App images and icons
│
├── drizzle/                      # Database migrations
│   ├── schema.ts                # Database schema
│   ├── relations.ts             # Database relations
│   └── migrations/              # Migration files
│
├── tests/                        # Test files
│   └── auth.logout.test.ts      # Example test
│
├── app.config.ts                # Expo configuration
├── tailwind.config.js           # Tailwind configuration
├── theme.config.js              # Theme configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # Project README
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.81 | Cross-platform UI |
| Expo | 54 | Development platform |
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| NativeWind | 4 | Tailwind CSS for React Native |
| Expo Router | 6 | Navigation |
| React Navigation | 7 | Navigation library |
| Reanimated | 4 | Animations |
| Gesture Handler | 2 | Gesture support |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4 | Web framework |
| tRPC | 11 | Type-safe API |
| Drizzle | 0.44 | ORM |
| PostgreSQL | 14+ | Database |

### Development

| Tool | Version | Purpose |
|------|---------|---------|
| pnpm | 9.12 | Package manager |
| TypeScript | 5.9 | Type checking |
| Vitest | 2 | Testing |
| ESLint | 9 | Linting |
| Prettier | 3 | Code formatting |

---

## Design Patterns

### 1. Provider Pattern

Used for global state management:

```typescript
// Theme Provider
<CustomThemeProvider>
  <TaskProvider>
    <App />
  </TaskProvider>
</CustomThemeProvider>
```

### 2. Hook Pattern

Custom hooks for logic reuse:

```typescript
// useColors hook
const colors = useColors();

// useTaskContext hook
const { tasks, addTask } = useTaskContext();
```

### 3. Component Composition

Breaking UI into reusable components:

```typescript
<ScreenContainer>
  <TaskCard task={task} />
  <TaskActions taskId={task.id} />
</ScreenContainer>
```

### 4. Context API

For state management:

```typescript
const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  
  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}
```

### 5. Async Storage Pattern

For persistent local data:

```typescript
// Save data
await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

// Load data
const tasks = JSON.parse(await AsyncStorage.getItem('tasks'));
```

---

## Data Flow

### User Interaction Flow

```
User Action
    ↓
Component Event Handler
    ↓
Context Update / State Change
    ↓
AsyncStorage Update
    ↓
Component Re-render
    ↓
UI Update
```

### Task Management Flow

```
Create Task
    ↓
Validate Input
    ↓
Add to Context
    ↓
Save to AsyncStorage
    ↓
Update Task List
    ↓
Show Success Message
```

### Theme Switching Flow

```
User Selects Theme
    ↓
Update Theme Context
    ↓
CSS Variables Update
    ↓
Component Re-render with New Colors
    ↓
Save Theme to AsyncStorage
```

---

## State Management

### Global State

Managed via React Context:

```typescript
// Task Context
- tasks: Task[]
- addTask: (task: Task) => void
- updateTask: (id: string, task: Partial<Task>) => void
- deleteTask: (id: string) => void
- getTasks: () => Task[]

// Theme Context
- currentTheme: Theme
- setTheme: (theme: Theme) => void
- themes: Theme[]
- addCustomTheme: (theme: Theme) => void

// Avatar Context
- avatar: Avatar
- setAvatar: (avatar: Avatar) => void
```

### Local Component State

```typescript
// Example: Task creation form
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [priority, setPriority] = useState('medium');
```

---

## Component Architecture

### Screen Components

Located in `app/` and `app/(tabs)/`:

```typescript
// Example: Home Screen
export default function HomeScreen() {
  const { tasks } = useTaskContext();
  const colors = useColors();
  
  return (
    <ScreenContainer>
      {/* Content */}
    </ScreenContainer>
  );
}
```

### Reusable Components

Located in `components/`:

```typescript
// Example: Task Card
export function TaskCard({ task, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View>
        <Text>{task.title}</Text>
      </View>
    </Pressable>
  );
}
```

### UI Primitives

Located in `components/ui/`:

```typescript
// Example: Icon Symbol
export function IconSymbol({ name, size, color }) {
  return <MaterialIcons name={MAPPING[name]} size={size} color={color} />;
}
```

---

## Navigation Structure

### Tab Navigation

```
Root
├── (tabs)
│   ├── index (Home)
│   ├── tasks (Tasks)
│   ├── avatar (Avatar)
│   └── settings (Settings)
```

### Modal Navigation

```
Root
├── create-task (Modal)
├── task-detail (Modal)
├── theme-creator (Modal)
├── avatar-creator (Modal)
└── dev-options (Modal)
```

### Navigation Flow

```
Home Screen
    ↓
[Tap Create Task]
    ↓
Create Task Modal
    ↓
[Save Task]
    ↓
Home Screen (Updated)
    ↓
[Tap Task]
    ↓
Task Detail Modal
```

---

## Styling Architecture

### Theme System

```typescript
// theme.config.js
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  // ... more colors
};

// Runtime theme
const Colors = {
  light: { primary: '#0a7ea4', ... },
  dark: { primary: '#0a7ea4', ... },
};
```

### Tailwind Integration

```typescript
// Using Tailwind classes
<View className="flex-1 bg-background p-4">
  <Text className="text-lg font-bold text-foreground">
    Title
  </Text>
</View>
```

### Color Hook

```typescript
// Accessing colors in components
const colors = useColors();

<View style={{ backgroundColor: colors.primary }} />
```

---

## Error Handling

### Error Types

```typescript
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

### Error Handling Pattern

```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else if (error instanceof StorageError) {
    // Handle storage error
  } else {
    // Handle unknown error
  }
}
```

---

## Performance Optimization

### Code Splitting

- Each screen is a separate bundle
- Lazy loading via Expo Router
- Dynamic imports for heavy components

### Rendering Optimization

- useMemo for expensive computations
- useCallback for event handlers
- FlatList for long lists (not ScrollView)

### Memory Management

- Cleanup in useEffect
- Proper context usage
- Avoid unnecessary re-renders

---

## Security Considerations

### Data Storage

- Local AsyncStorage for sensitive data
- No hardcoded credentials
- Secure keystore for sensitive info

### API Communication

- HTTPS only
- Input validation
- Output sanitization

### Code Security

- No console logs in production
- Secure error messages
- No sensitive data in logs

---

## Testing Strategy

### Unit Tests

```typescript
// Test individual functions
describe('TaskContext', () => {
  it('should add task', () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// Test component integration
describe('Home Screen', () => {
  it('should display tasks', () => {
    // Test implementation
  });
});
```

### E2E Tests

```typescript
// Test user flows
describe('Task Creation Flow', () => {
  it('should create task and display in list', () => {
    // Test implementation
  });
});
```

---

## Deployment Architecture

### Development

```
Local Machine
    ↓
Metro Bundler (Port 8081)
    ↓
Expo Dev Server
    ↓
Device/Simulator
```

### Production

```
GitHub Repository
    ↓
CI/CD Pipeline
    ↓
Build Artifacts
    ↓
App Store / Google Play / Web Server
```

---

## Resources

### Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Related Files

- [COMPONENTS.md](./COMPONENTS.md) - Component reference
- [DATA_STORAGE.md](./DATA_STORAGE.md) - Storage details
- [TYPES.md](./TYPES.md) - Type definitions

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
