# MeTodo - Components Showcase & UI Documentation

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
Complete showcase and documentation of all UI components used in MeTodo, including usage examples, props, and best practices.

---

## Table of Contents

1. [Core Components](#core-components)
2. [Task Components](#task-components)
3. [Avatar Components](#avatar-components)
4. [Theme Components](#theme-components)
5. [Settings Components](#settings-components)
6. [Layout Components](#layout-components)
7. [Utility Components](#utility-components)
8. [Best Practices](#best-practices)

---

## Core Components

### ScreenContainer

**Purpose:** Safe area wrapper for all screens

**File:** `components/screen-container.tsx`

**Props:**
```typescript
interface ScreenContainerProps {
  edges?: Edge[];
  className?: string;
  containerClassName?: string;
  safeAreaClassName?: string;
  children: ReactNode;
}
```

**Usage:**
```typescript
import { ScreenContainer } from '@/components/screen-container';

export default function MyScreen() {
  return (
    <ScreenContainer className="p-4">
      <Text className="text-2xl font-bold">Welcome</Text>
    </ScreenContainer>
  );
}
```

**Features:**
- Handles SafeArea automatically
- Extends background to edges
- Prevents content under notch
- Responsive to all devices

---

### ThemedView

**Purpose:** View with theme-aware background

**File:** `components/themed-view.tsx`

**Props:**
```typescript
interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}
```

**Usage:**
```typescript
import { ThemedView } from '@/components/themed-view';

export function MyComponent() {
  return (
    <ThemedView
      lightColor="#FFFFFF"
      darkColor="#151718"
      className="flex-1 p-4"
    >
      <Text>Content</Text>
    </ThemedView>
  );
}
```

**Features:**
- Automatic theme switching
- Light/dark color support
- Tailwind className support

---

### IconSymbol

**Purpose:** Cross-platform icon component

**File:** `components/ui/icon-symbol.tsx`

**Props:**
```typescript
interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}
```

**Usage:**
```typescript
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

export function MyComponent() {
  const colors = useColors();

  return (
    <IconSymbol
      name="house.fill"
      size={24}
      color={colors.primary}
    />
  );
}
```

**Available Icons:**
- `house.fill` - Home
- `paperplane.fill` - Send
- `chevron.left.forwardslash.chevron.right` - Code
- `chevron.right` - Chevron right
- And many more SF Symbols

---

## Task Components

### TaskItem

**Purpose:** Individual task display in list

**File:** `components/TaskItem.tsx`

**Props:**
```typescript
interface TaskItemProps {
  task: Task;
  onPress?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
  showCategory?: boolean;
  showDueDate?: boolean;
}
```

**Usage:**
```typescript
import { TaskItem } from '@/components/TaskItem';

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onPress={() => navigateToDetail(item.id)}
          onComplete={() => completeTask(item.id)}
          onDelete={() => deleteTask(item.id)}
          showCategory
          showDueDate
        />
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

**Features:**
- Shows task title, priority, due date
- Checkbox for completion
- Category and tags display
- Swipe actions (iOS)
- Long-press menu (Android)

---

### TaskDetailView

**Purpose:** Detailed task view with editing

**File:** `components/TaskDetailView.tsx`

**Props:**
```typescript
interface TaskDetailViewProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}
```

**Usage:**
```typescript
import { TaskDetailView } from '@/components/TaskDetailView';

export function TaskDetailScreen({ taskId }: { taskId: string }) {
  const { tasks, updateTask, deleteTask } = useTasks();
  const task = tasks.find(t => t.id === taskId);

  return (
    <TaskDetailView
      task={task}
      onUpdate={updateTask}
      onDelete={() => deleteTask(taskId)}
      onClose={() => router.back()}
    />
  );
}
```

**Features:**
- Edit all task properties
- Add/remove subtasks
- Manage reminders
- Add notes
- View history

---

### SubtaskItem

**Purpose:** Individual subtask display

**File:** `components/SubtaskItem.tsx`

**Props:**
```typescript
interface SubtaskItemProps {
  subtask: Subtask;
  onComplete?: () => void;
  onDelete?: () => void;
  onEdit?: (title: string) => void;
}
```

**Usage:**
```typescript
import { SubtaskItem } from '@/components/SubtaskItem';

export function SubtaskList({ subtasks }: { subtasks: Subtask[] }) {
  return (
    <View>
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask.id}
          subtask={subtask}
          onComplete={() => completeSubtask(subtask.id)}
          onDelete={() => deleteSubtask(subtask.id)}
        />
      ))}
    </View>
  );
}
```

---

## Avatar Components

### AvatarPreview

**Purpose:** Display and preview avatar

**File:** `components/AvatarPreview.tsx`

**Props:**
```typescript
interface AvatarPreviewProps {
  avatar: Avatar;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onPress?: () => void;
}
```

**Usage:**
```typescript
import { AvatarPreview } from '@/components/AvatarPreview';

export function AvatarScreen() {
  const { activeAvatar } = useAvatars();

  return (
    <AvatarPreview
      avatar={activeAvatar}
      size="large"
      interactive
      onPress={() => navigateToEditor()}
    />
  );
}
```

**Features:**
- Displays avatar with all customizations
- Responsive sizing
- Interactive animations
- Tap to edit

---

### HairCustomizer

**Purpose:** Customize avatar hair

**File:** `components/HairCustomizer.tsx`

**Props:**
```typescript
interface HairCustomizerProps {
  hair: HairStyle;
  onChange: (hair: HairStyle) => void;
}
```

**Usage:**
```typescript
import { HairCustomizer } from '@/components/HairCustomizer';

export function AvatarEditor() {
  const [hair, setHair] = useState<HairStyle>(defaultHair);

  return (
    <HairCustomizer
      hair={hair}
      onChange={setHair}
    />
  );
}
```

**Features:**
- 5 hair styles
- 5 hair colors
- Real-time preview
- Color picker

---

### EyeCustomizer

**Purpose:** Customize avatar eyes

**File:** `components/EyeCustomizer.tsx`

**Props:**
```typescript
interface EyeCustomizerProps {
  eyes: EyeStyle;
  onChange: (eyes: EyeStyle) => void;
}
```

**Usage:**
```typescript
import { EyeCustomizer } from '@/components/EyeCustomizer';

export function AvatarEditor() {
  const [eyes, setEyes] = useState<EyeStyle>(defaultEyes);

  return (
    <EyeCustomizer
      eyes={eyes}
      onChange={setEyes}
    />
  );
}
```

**Features:**
- 4 eye shapes
- 4 eye colors
- Real-time preview
- Color picker

---

### AccessoriesCustomizer

**Purpose:** Customize avatar accessories

**File:** `components/AccessoriesCustomizer.tsx`

**Props:**
```typescript
interface AccessoriesCustomizerProps {
  accessories: Accessory[];
  onChange: (accessories: Accessory[]) => void;
}
```

**Usage:**
```typescript
import { AccessoriesCustomizer } from '@/components/AccessoriesCustomizer';

export function AvatarEditor() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);

  return (
    <AccessoriesCustomizer
      accessories={accessories}
      onChange={setAccessories}
    />
  );
}
```

**Features:**
- Glasses, hats, earrings, necklaces
- Color customization
- Add/remove accessories
- Real-time preview

---

## Theme Components

### ThemeSelector

**Purpose:** Select and preview themes

**File:** `components/ThemeSelector.tsx`

**Props:**
```typescript
interface ThemeSelectorProps {
  themes: Theme[];
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  showPreview?: boolean;
}
```

**Usage:**
```typescript
import { ThemeSelector } from '@/components/ThemeSelector';

export function ThemeScreen() {
  const { themes, activeTheme, setActiveTheme } = useThemes();

  return (
    <ThemeSelector
      themes={themes}
      activeTheme={activeTheme}
      onThemeChange={setActiveTheme}
      showPreview
    />
  );
}
```

**Features:**
- Grid or list view
- Theme preview
- Search themes
- Filter by type (light/dark)

---

### ThemePreview

**Purpose:** Preview theme colors

**File:** `components/ThemePreview.tsx`

**Props:**
```typescript
interface ThemePreviewProps {
  theme: Theme;
  size?: 'small' | 'medium' | 'large';
}
```

**Usage:**
```typescript
import { ThemePreview } from '@/components/ThemePreview';

export function ThemeItem({ theme }: { theme: Theme }) {
  return (
    <Pressable>
      <ThemePreview theme={theme} size="medium" />
      <Text>{theme.name}</Text>
    </Pressable>
  );
}
```

**Features:**
- Color palette display
- Size options
- Tap to select

---

### ThemeCreator

**Purpose:** Create custom themes

**File:** `components/ThemeCreator.tsx`

**Props:**
```typescript
interface ThemeCreatorProps {
  onSave: (theme: Theme) => void;
  onCancel: () => void;
  initialTheme?: Theme;
}
```

**Usage:**
```typescript
import { ThemeCreator } from '@/components/ThemeCreator';

export function CreateThemeScreen() {
  const { createCustomTheme } = useThemes();

  return (
    <ThemeCreator
      onSave={createCustomTheme}
      onCancel={() => router.back()}
    />
  );
}
```

**Features:**
- Color picker for each color
- Live preview
- Save/cancel
- Validation

---

## Settings Components

### SettingsSection

**Purpose:** Grouped settings section

**File:** `components/SettingsSection.tsx`

**Props:**
```typescript
interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
}
```

**Usage:**
```typescript
import { SettingsSection } from '@/components/SettingsSection';

export function SettingsScreen() {
  return (
    <SettingsSection title="Notifications">
      <SettingToggle label="Enable Notifications" />
      <SettingToggle label="Sound" />
      <SettingToggle label="Vibration" />
    </SettingsSection>
  );
}
```

---

### SettingToggle

**Purpose:** Toggle setting

**File:** `components/SettingToggle.tsx`

**Props:**
```typescript
interface SettingToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}
```

**Usage:**
```typescript
import { SettingToggle } from '@/components/SettingToggle';

export function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SettingToggle
      label="Enable Notifications"
      value={notificationsEnabled}
      onChange={setNotificationsEnabled}
      description="Receive task reminders"
    />
  );
}
```

---

## Layout Components

### TabBar

**Purpose:** Bottom tab navigation

**File:** `components/TabBar.tsx` (via Expo Router)

**Features:**
- 4 tabs: Home, Tasks, Avatar, Settings
- Active tab highlighting
- Icon display
- Haptic feedback on tap

---

### Modal

**Purpose:** Modal dialog

**File:** `components/Modal.tsx`

**Props:**
```typescript
interface ModalProps {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

**Usage:**
```typescript
import { Modal } from '@/components/Modal';

export function MyComponent() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <Text>Open Modal</Text>
      </Pressable>

      <Modal
        visible={visible}
        title="Confirm Action"
        onClose={() => setVisible(false)}
        onConfirm={() => {
          // Handle confirm
          setVisible(false);
        }}
      >
        <Text>Are you sure?</Text>
      </Modal>
    </>
  );
}
```

---

## Utility Components

### LoadingSpinner

**Purpose:** Show loading state

**File:** `components/LoadingSpinner.tsx`

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
```

**Usage:**
```typescript
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function MyComponent() {
  const [loading, setLoading] = useState(true);

  return loading ? <LoadingSpinner size="large" /> : <Content />;
}
```

---

### EmptyState

**Purpose:** Show empty state message

**File:** `components/EmptyState.tsx`

**Props:**
```typescript
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}
```

**Usage:**
```typescript
import { EmptyState } from '@/components/EmptyState';

export function TaskList({ tasks }: { tasks: Task[] }) {
  return tasks.length === 0 ? (
    <EmptyState
      icon="checkmark.circle"
      title="No Tasks"
      description="Create your first task to get started"
      action={{
        label: "Create Task",
        onPress: () => navigateToCreate(),
      }}
    />
  ) : (
    <TaskListContent tasks={tasks} />
  );
}
```

---

### ErrorBoundary

**Purpose:** Catch and display errors

**File:** `components/ErrorBoundary.tsx`

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}
```

**Usage:**
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <View>
          <Text>Something went wrong: {error.message}</Text>
        </View>
      )}
    >
      <MainApp />
    </ErrorBoundary>
  );
}
```

---

## Best Practices

### Component Organization

**1. Keep Components Small**
- Single responsibility
- Easy to test
- Easy to reuse

**2. Use TypeScript**
- Define prop interfaces
- Export types
- Avoid `any`

**3. Memoize When Needed**
```typescript
export default memo(MyComponent);
```

**4. Use Hooks for State**
```typescript
const [state, setState] = useState(initialValue);
const memoizedValue = useMemo(() => computation(), [deps]);
const memoizedCallback = useCallback(() => { /* ... */ }, [deps]);
```

**5. Styling**
- Use Tailwind classes
- Use `cn()` for conditional classes
- Avoid inline styles

**6. Accessibility**
- Add accessibility labels
- Ensure touch targets are 48x48 dp
- Test with screen readers

**7. Performance**
- Avoid unnecessary renders
- Use FlatList for lists
- Optimize images

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
