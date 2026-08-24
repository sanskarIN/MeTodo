# MeTodo - Components Reference

## Table of Contents

1. [Screen Components](#screen-components)
2. [Reusable Components](#reusable-components)
3. [UI Primitives](#ui-primitives)
4. [Component Usage Examples](#component-usage-examples)
5. [Component Props](#component-props)

---

## Screen Components

### Home Screen (`app/(tabs)/index.tsx`)

**Purpose:** Main dashboard displaying task overview and statistics.

**Features:**
- Task statistics (completed, pending, overdue)
- Recent tasks list
- Quick task creation button
- Avatar display
- Search functionality

**Props:** None (uses context)

**Example:**
```typescript
import HomeScreen from '@/app/(tabs)/index';

// Automatically rendered by router
```

### Tasks Screen (`app/(tabs)/tasks.tsx`)

**Purpose:** Comprehensive task management interface.

**Features:**
- Full task list with filtering
- Priority-based sorting
- Category filtering
- Task search
- Task completion toggle

**Props:** None (uses context)

**Example:**
```typescript
import TasksScreen from '@/app/(tabs)/tasks';

// Automatically rendered by router
```

### Avatar Screen (`app/(tabs)/avatar.tsx`)

**Purpose:** Avatar customization interface.

**Features:**
- Hair style selection
- Hair color picker
- Eye shape selection
- Eye color picker
- Accessories selection
- Skin tone selection
- Real-time preview
- Save functionality

**Props:** None (uses context)

**Example:**
```typescript
import AvatarScreen from '@/app/(tabs)/avatar';

// Automatically rendered by router
```

### Settings Screen (`app/(tabs)/settings.tsx`)

**Purpose:** App configuration and preferences.

**Features:**
- Theme selection (50+ themes)
- Custom theme creator
- Social links
- App version
- Developer options access
- Contact information

**Props:** None (uses context)

**Example:**
```typescript
import SettingsScreen from '@/app/(tabs)/settings';

// Automatically rendered by router
```

### Task Detail Screen (`task-detail.tsx`)

**Purpose:** View and edit individual task details.

**Features:**
- Task title and description
- Priority level
- Due date
- Subtasks
- Reminders
- Category/tags
- Rich notes
- Edit/delete actions

**Props:**
```typescript
interface TaskDetailProps {
  taskId: string;
}
```

### Create Task Screen (`create-task.tsx`)

**Purpose:** Create new tasks with full details.

**Features:**
- Task title input
- Description editor
- Priority selection
- Category selection
- Due date picker
- Subtask creation
- Reminder setup
- Save/cancel actions

**Props:** None (uses navigation params)

---

## Reusable Components

### ScreenContainer

**Location:** `components/screen-container.tsx`

**Purpose:** SafeArea wrapper for all screens.

**Features:**
- Handles notches and home indicators
- Manages background colors
- Proper padding and insets
- Theme-aware styling

**Props:**
```typescript
interface ScreenContainerProps extends ViewProps {
  edges?: Edge[];
  className?: string;
  containerClassName?: string;
  safeAreaClassName?: string;
}
```

**Example:**
```typescript
<ScreenContainer className="p-4">
  <Text>Screen content</Text>
</ScreenContainer>
```

### ThemedView

**Location:** `components/themed-view.tsx`

**Purpose:** View component with theme awareness.

**Features:**
- Automatic color switching
- Theme-aware styling
- Consistent theming

**Props:**
```typescript
interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}
```

**Example:**
```typescript
<ThemedView lightColor="#fff" darkColor="#000">
  <Text>Themed content</Text>
</ThemedView>
```

### HapticTab

**Location:** `components/haptic-tab.tsx`

**Purpose:** Tab button with haptic feedback.

**Features:**
- Haptic feedback on press
- Accessibility support
- Visual feedback

**Props:**
```typescript
interface HapticTabProps {
  onPress: () => void;
  onLongPress?: () => void;
  children: ReactNode;
}
```

**Example:**
```typescript
<HapticTab onPress={handlePress}>
  <IconSymbol name="house.fill" />
</HapticTab>
```

### ExternalLink

**Location:** `components/external-link.tsx`

**Purpose:** Link to external URLs.

**Features:**
- Opens in system browser
- Accessibility support
- Styled as link

**Props:**
```typescript
interface ExternalLinkProps extends TextProps {
  href: string;
  children: ReactNode;
}
```

**Example:**
```typescript
<ExternalLink href="https://github.com/Sanskar-in">
  Visit GitHub
</ExternalLink>
```

### ParallaxScrollView

**Location:** `components/parallax-scroll-view.tsx`

**Purpose:** Scroll view with parallax effect.

**Features:**
- Parallax header
- Smooth scrolling
- Performance optimized

**Props:**
```typescript
interface ParallaxScrollViewProps {
  headerBackgroundColor?: string;
  headerImage?: ReactNode;
  children: ReactNode;
}
```

**Example:**
```typescript
<ParallaxScrollView
  headerImage={<Image source={require('./header.png')} />}
>
  <Text>Scrollable content</Text>
</ParallaxScrollView>
```

### HelloWave

**Location:** `components/hello-wave.tsx`

**Purpose:** Animated wave greeting.

**Features:**
- Wave animation
- Smooth transitions
- Lightweight

**Props:** None

**Example:**
```typescript
<HelloWave />
```

### Collapsible

**Location:** `components/ui/collapsible.tsx`

**Purpose:** Expandable/collapsible section.

**Features:**
- Toggle expand/collapse
- Smooth animation
- Icon indicator

**Props:**
```typescript
interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}
```

**Example:**
```typescript
<Collapsible title="Advanced Options">
  <Text>Hidden content</Text>
</Collapsible>
```

---

## UI Primitives

### IconSymbol

**Location:** `components/ui/icon-symbol.tsx`

**Purpose:** Icon component with platform support.

**Features:**
- SF Symbols on iOS
- Material Icons on Android/Web
- Consistent interface

**Props:**
```typescript
interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}
```

**Example:**
```typescript
<IconSymbol
  name="house.fill"
  size={28}
  color="#0a7ea4"
/>
```

### TaskCard

**Purpose:** Display individual task in list.

**Features:**
- Task title and description
- Priority indicator
- Completion checkbox
- Category badge
- Due date display

**Props:**
```typescript
interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete: (completed: boolean) => void;
}
```

**Example:**
```typescript
<TaskCard
  task={task}
  onPress={() => navigateToDetail(task.id)}
  onComplete={(completed) => updateTask(task.id, { completed })}
/>
```

### ThemeCard

**Purpose:** Display theme option.

**Features:**
- Color preview
- Theme name
- Selection indicator
- Tap to select

**Props:**
```typescript
interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}
```

**Example:**
```typescript
<ThemeCard
  theme={theme}
  isSelected={currentTheme.id === theme.id}
  onSelect={() => setTheme(theme)}
/>
```

---

## Component Usage Examples

### Creating a New Screen

```typescript
/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: app/my-screen.tsx
 * PURPOSE: Description of this screen's purpose
 */

import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function MyScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-foreground">
          My Screen
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
```

### Creating a New Component

```typescript
/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: components/my-component.tsx
 * PURPOSE: Description of this component's purpose
 */

import { View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        className="p-4 rounded-xl"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-foreground font-semibold">
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
```

### Using Context in Components

```typescript
import { useTaskContext } from "@/lib/task-context";

export function MyComponent() {
  const { tasks, addTask, updateTask } = useTaskContext();

  const handleAddTask = async (task: Task) => {
    await addTask(task);
    // Task is now available in tasks array
  };

  return (
    <View>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </View>
  );
}
```

### Using Hooks

```typescript
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function MyComponent() {
  const colors = useColors();
  const colorScheme = useColorScheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>
        Current scheme: {colorScheme}
      </Text>
    </View>
  );
}
```

---

## Component Props Reference

### Common Props

| Prop | Type | Description |
|------|------|-------------|
| className | string | Tailwind CSS classes |
| style | StyleProp | Inline styles |
| onPress | () => void | Press handler |
| disabled | boolean | Disable interaction |
| children | ReactNode | Child elements |

### Theme-Related Props

| Prop | Type | Description |
|------|------|-------------|
| lightColor | string | Light mode color |
| darkColor | string | Dark mode color |
| backgroundColor | string | Background color |
| textColor | string | Text color |

### Task-Related Props

| Prop | Type | Description |
|------|------|-------------|
| task | Task | Task object |
| taskId | string | Task identifier |
| onComplete | (completed: boolean) => void | Completion handler |
| onDelete | () => void | Delete handler |

---

## Best Practices

### Component Organization

1. **Keep components small** - Single responsibility
2. **Use composition** - Combine components
3. **Extract logic to hooks** - Reusable logic
4. **Type all props** - TypeScript interfaces

### Performance

1. **Memoize components** - React.memo for pure components
2. **Use FlatList** - For long lists
3. **Optimize re-renders** - useMemo, useCallback
4. **Lazy load** - Code splitting

### Accessibility

1. **Semantic HTML** - Proper structure
2. **ARIA labels** - Screen reader support
3. **Keyboard navigation** - Proper focus
4. **Color contrast** - WCAG compliance

---

## Resources

### Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture
- [DATA_STORAGE.md](./DATA_STORAGE.md) - Storage implementation
- [TYPES.md](./TYPES.md) - Type definitions

### External Resources

- [React Native Docs](https://reactnative.dev/docs/components-and-apis)
- [Expo Components](https://docs.expo.dev/ui/components/)
- [NativeWind Docs](https://www.nativewind.dev/)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
