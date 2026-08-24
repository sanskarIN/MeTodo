# Onboarding Tutorial Guide

## Overview

The Onboarding Tutorial provides a comprehensive first-launch experience for new MeTodo users. This guide covers the tutorial implementation, customization, and best practices.

## Table of Contents

1. [Architecture](#architecture)
2. [Tutorial Steps](#tutorial-steps)
3. [Implementation](#implementation)
4. [Customization](#customization)
5. [User Experience](#user-experience)
6. [Analytics](#analytics)
7. [Best Practices](#best-practices)

## Architecture

### Components

The onboarding system consists of:

1. **Onboarding Screen** - Main tutorial interface
2. **Tutorial Steps** - Individual lesson modules
3. **Progress Tracking** - User progress through tutorial
4. **Completion Tracking** - Persist completion status

### Tutorial Flow

```
Start Onboarding
    ↓
Step 1: Welcome
    ↓
Step 2: Create Task
    ↓
Step 3: Customize Avatar
    ↓
Step 4: Choose Theme
    ↓
Step 5: Manage Tasks
    ↓
Step 6: Advanced Features
    ↓
Step 7: Developer Options
    ↓
Step 8: Tips & Best Practices
    ↓
Step 9: Completion
    ↓
Mark as Complete
```

## Tutorial Steps

### Step 1: Welcome to MeTodo

**Purpose:** Introduce the app and its core value proposition

**Content:**
- App name and tagline
- Overview of key features
- Benefits of using MeTodo

**Tips:**
- MeTodo helps you stay organized and productive
- All your data is stored locally on your device
- You can customize everything to match your style

**Action:** None (informational)

### Step 2: Create Your First Task

**Purpose:** Teach task creation

**Content:**
- Task creation interface
- Task components (title, description, priority, due date)
- Categories and tags

**Tips:**
- Set priority levels: Low, Medium, High
- Add due dates to stay on track
- Use categories to organize tasks
- Add subtasks to break down complex work

**Action:** Navigate to Create Task screen

### Step 3: Customize Your Avatar

**Purpose:** Personalize the app experience

**Content:**
- Avatar customization options
- Hair styles and colors
- Eyes, accessories, skin tones

**Tips:**
- Your avatar appears throughout the app
- You can change it anytime
- Mix and match different styles
- Express your personality

**Action:** Navigate to Avatar Customization

### Step 4: Choose Your Theme

**Purpose:** Explore theming options

**Content:**
- 50+ pre-installed themes
- Light, dark, and vibrant options
- Custom theme creation

**Tips:**
- 50+ pre-installed themes available
- Light, dark, and vibrant options
- Create custom themes with color picker
- Themes sync across all screens

**Action:** Navigate to Settings/Themes

### Step 5: Manage Your Tasks

**Purpose:** Introduce task management interface

**Content:**
- Task list view
- Filtering options
- Task completion
- Task editing

**Tips:**
- Filter tasks: All, Completed, Pending
- Search across all tasks
- Mark tasks as complete
- Edit or delete tasks anytime

**Action:** Navigate to Tasks screen

### Step 6: Advanced Features

**Purpose:** Highlight premium features

**Content:**
- Voice task creation
- Analytics dashboard
- Task templates
- Smart notifications
- Batch operations

**Tips:**
- Voice task creation for hands-free input
- Analytics dashboard for productivity insights
- Task templates for recurring patterns
- Smart notifications with quiet hours
- Batch operations for bulk editing

**Action:** None (informational)

### Step 7: Developer Options

**Purpose:** Introduce debugging and monitoring tools

**Content:**
- 30+ developer tools
- Performance monitoring
- Memory tracking
- Network inspection

**Tips:**
- Performance monitoring tools
- Memory and storage tracking
- Network activity inspection
- Layout debugging utilities
- Accessibility checkers

**Action:** Navigate to Developer Options

### Step 8: Tips & Best Practices

**Purpose:** Provide productivity guidance

**Content:**
- Organization strategies
- Best practices
- Productivity tips
- Advanced techniques

**Tips:**
- Use categories to organize tasks by type
- Set realistic due dates
- Review completed tasks regularly
- Use subtasks for complex projects
- Enable notifications for important tasks
- Customize your themes for focus

**Action:** None (informational)

### Step 9: Completion

**Purpose:** Celebrate completion and encourage usage

**Content:**
- Congratulations message
- Next steps
- Encouragement to explore

**Tips:**
- You can access this tutorial anytime from Settings
- Explore all features at your own pace
- Customize your experience
- Enjoy being productive!

**Action:** Complete and return to home

## Implementation

### Checking Completion Status

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

async function checkOnboardingStatus() {
  const completed = await AsyncStorage.getItem("metodo_onboarding_completed");
  return completed === "true";
}
```

### Launching Onboarding

```typescript
import { useRouter } from "expo-router";

export default function AppEntry() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const completed = await checkOnboardingStatus();
      if (!completed) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
      setIsLoading(false);
    }

    checkStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return null;
}
```

### Manual Onboarding Access

```typescript
// In Settings screen
<TouchableOpacity
  onPress={() => router.push("/onboarding")}
>
  <Text>View Tutorial</Text>
</TouchableOpacity>
```

### Progress Tracking

```typescript
const [currentStep, setCurrentStep] = useState(0);
const [completedSteps, setCompletedSteps] = useState<number[]>([]);

useEffect(() => {
  // Mark step as completed
  if (!completedSteps.includes(currentStep)) {
    setCompletedSteps([...completedSteps, currentStep]);
  }
}, [currentStep]);

const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
```

## Customization

### Adding New Steps

```typescript
const TUTORIAL_STEPS: TutorialStep[] = [
  // ... existing steps
  {
    id: 10,
    title: "Custom Feature",
    description: "Learn about your custom feature",
    icon: "✨",
    tips: [
      "Tip 1",
      "Tip 2",
      "Tip 3",
    ],
    action: "custom-screen",
    actionLabel: "Explore Feature",
  },
];
```

### Modifying Step Content

```typescript
// Update existing step
TUTORIAL_STEPS[0] = {
  ...TUTORIAL_STEPS[0],
  title: "New Title",
  description: "New description",
  tips: ["New tip 1", "New tip 2"],
};
```

### Custom Actions

```typescript
const handleAction = () => {
  if (step.action === "custom-action") {
    // Implement custom logic
    performCustomAction();
  }
};
```

### Styling Customization

```typescript
// Modify colors
const colors = useColors();

// Update progress bar color
<View
  style={{
    backgroundColor: colors.primary, // Customize color
    width: `${progress}%`,
  }}
/>

// Update button styles
<TouchableOpacity
  style={{ backgroundColor: colors.primary }}
  // Customize style
/>
```

## User Experience

### Skip Option

Users can skip the tutorial at any time:

```typescript
const handleSkip = () => {
  Alert.alert("Skip Tutorial", "Are you sure?", [
    { text: "Cancel", onPress: () => {} },
    {
      text: "Skip",
      onPress: async () => {
        await AsyncStorage.setItem("metodo_onboarding_completed", "true");
        router.replace("/(tabs)");
      },
    },
  ]);
};
```

### Navigation

- **Next Button:** Move to next step
- **Previous Button:** Go back to previous step
- **Step Indicators:** Jump to specific step
- **Skip Button:** Skip entire tutorial

### Progress Indication

```typescript
// Progress bar
<View className="h-2 rounded-full" style={{ backgroundColor: colors.border }}>
  <View
    className="h-full rounded-full"
    style={{
      backgroundColor: colors.primary,
      width: `${progress}%`,
    }}
  />
</View>

// Step counter
<Text>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</Text>

// Step indicators
{TUTORIAL_STEPS.map((_, index) => (
  <Pressable
    key={index}
    style={{
      backgroundColor:
        index === currentStep
          ? colors.primary
          : index < currentStep
            ? colors.success
            : colors.border,
    }}
  />
))}
```

### Interactive Actions

Each step can include an action button:

```typescript
{step.action && (
  <TouchableOpacity
    onPress={handleAction}
    style={{ backgroundColor: colors.primary }}
  >
    <Text className="text-white font-semibold">
      {step.actionLabel}
    </Text>
  </TouchableOpacity>
)}
```

## Analytics

### Tracking Completion

```typescript
// Log tutorial start
analytics.logEvent("onboarding_started", {
  timestamp: new Date(),
});

// Log step completion
analytics.logEvent("onboarding_step_completed", {
  step: currentStep,
  stepName: step.title,
  timestamp: new Date(),
});

// Log tutorial completion
analytics.logEvent("onboarding_completed", {
  totalSteps: TUTORIAL_STEPS.length,
  completedSteps: completedSteps.length,
  timestamp: new Date(),
});

// Log tutorial skipped
analytics.logEvent("onboarding_skipped", {
  stepsCompleted: currentStep,
  timestamp: new Date(),
});
```

### Metrics to Track

- **Completion Rate:** % of users completing tutorial
- **Dropout Rate:** % of users skipping tutorial
- **Average Steps Completed:** Average steps before skip
- **Time to Complete:** Average time to finish tutorial
- **Step Duration:** Time spent on each step
- **Action Usage:** Which action buttons are used

## Best Practices

### 1. Keep Steps Concise

Each step should focus on one concept:

```typescript
// ✅ Good - Single concept
{
  title: "Create Your First Task",
  description: "Tasks are the core of MeTodo.",
  tips: ["Set priority levels", "Add due dates"],
}

// ❌ Bad - Too much information
{
  title: "Tasks, Subtasks, and Templates",
  description: "Learn about tasks, subtasks, templates, and more...",
}
```

### 2. Provide Clear Actions

Make it easy to try features:

```typescript
// ✅ Good - Clear action
{
  action: "create-task",
  actionLabel: "Create a Task",
}

// ❌ Bad - Vague action
{
  action: "explore",
  actionLabel: "Learn More",
}
```

### 3. Use Visual Hierarchy

```typescript
// Large title
<Text className="text-3xl font-bold">Title</Text>

// Medium description
<Text className="text-base">Description</Text>

// Small tips
<Text className="text-sm">Tips</Text>
```

### 4. Include Helpful Tips

Each step should provide actionable advice:

```typescript
tips: [
  "Specific, actionable tip 1",
  "Specific, actionable tip 2",
  "Specific, actionable tip 3",
]
```

### 5. Allow Easy Navigation

Users should be able to:
- Move forward and backward
- Jump to specific steps
- Skip the tutorial
- Return to tutorial later

### 6. Provide Encouragement

```typescript
// Progress indication
<Text>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</Text>

// Completion celebration
{currentStep === TUTORIAL_STEPS.length - 1 && (
  <Text className="text-2xl">🎉 You're All Set!</Text>
)}
```

### 7. Make It Optional

```typescript
// Allow skip at any time
<Pressable onPress={handleSkip}>
  <Text>Skip</Text>
</Pressable>

// Allow access from settings
<Button
  title="View Tutorial"
  onPress={() => router.push("/onboarding")}
/>
```

### 8. Test with Real Users

- Observe how users navigate
- Identify confusing steps
- Measure completion rates
- Gather feedback

## Advanced Features

### Conditional Steps

```typescript
// Show steps based on user preferences
const getSteps = () => {
  const steps = [...TUTORIAL_STEPS];
  
  if (!userHasTeam()) {
    // Remove collaboration steps
    return steps.filter((s) => s.id !== 7);
  }
  
  return steps;
};
```

### Localization

```typescript
const TUTORIAL_STEPS_ES = [
  {
    title: "Bienvenido a MeTodo",
    description: "Tu compañero de gestión de tareas personal",
    // ... Spanish content
  },
];

const getSteps = () => {
  const locale = i18n.locale;
  return locale === "es" ? TUTORIAL_STEPS_ES : TUTORIAL_STEPS;
};
```

### A/B Testing

```typescript
// Test different tutorial versions
const getTutorialVersion = () => {
  const version = Math.random() > 0.5 ? "A" : "B";
  analytics.logEvent("tutorial_version", { version });
  return version === "A" ? TUTORIAL_STEPS_A : TUTORIAL_STEPS_B;
};
```

## Conclusion

The Onboarding Tutorial provides a smooth introduction to MeTodo for new users. Follow these guidelines to create an effective learning experience that helps users discover and adopt key features.

For more information, see:
- [Main README](./README.md)
- [Feature Documentation](./features/)
- [User Guides](./user-guides/)
