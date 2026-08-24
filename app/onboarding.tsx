/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: app/onboarding.tsx
 * PURPOSE: Comprehensive onboarding tutorial flow for new users
 *
 * DESCRIPTION:
 * Provides an interactive first-launch tutorial showing all key features:
 * - Task creation and management
 * - Avatar customization
 * - Theme selection
 * - Developer options access
 * - Tips and best practices
 *
 * FEATURES:
 * - Step-by-step tutorial
 * - Interactive demonstrations
 * - Skip option
 * - Progress tracking
 * - Completion rewards
 *
 * DEPENDENCIES:
 * - React Native components
 * - Expo Router
 * - Custom hooks and context
 *
 * =============================================================================
 */

import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Tutorial step interface
 */
interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  tips: string[];
  action?: string;
  actionLabel?: string;
}

/**
 * Tutorial steps data
 */
const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to MeTodo",
    description: "Your personal task management companion. Let's get started with a quick tour of the app's key features.",
    icon: "📱",
    tips: [
      "MeTodo helps you stay organized and productive",
      "All your data is stored locally on your device",
      "You can customize everything to match your style",
    ],
  },
  {
    id: 2,
    title: "Create Your First Task",
    description: "Tasks are the core of MeTodo. Create tasks with titles, descriptions, priorities, due dates, and more.",
    icon: "✓",
    tips: [
      "Set priority levels: Low, Medium, High",
      "Add due dates to stay on track",
      "Use categories to organize tasks",
      "Add subtasks to break down complex work",
    ],
    action: "create-task",
    actionLabel: "Create a Task",
  },
  {
    id: 3,
    title: "Customize Your Avatar",
    description: "Create a unique avatar that represents you. Choose from hair styles, eyes, accessories, and skin tones.",
    icon: "👤",
    tips: [
      "Your avatar appears throughout the app",
      "You can change it anytime",
      "Mix and match different styles",
      "Express your personality",
    ],
    action: "avatar",
    actionLabel: "Customize Avatar",
  },
  {
    id: 4,
    title: "Choose Your Theme",
    description: "MeTodo comes with 50+ themes. Pick your favorite or create a custom theme with your own colors.",
    icon: "🎨",
    tips: [
      "50+ pre-installed themes available",
      "Light, dark, and vibrant options",
      "Create custom themes with color picker",
      "Themes sync across all screens",
    ],
    action: "settings",
    actionLabel: "Browse Themes",
  },
  {
    id: 5,
    title: "Manage Your Tasks",
    description: "View all tasks in the Tasks tab. Filter by status, search, and manage your task list efficiently.",
    icon: "📋",
    tips: [
      "Filter tasks: All, Completed, Pending",
      "Search across all tasks",
      "Mark tasks as complete",
      "Edit or delete tasks anytime",
    ],
    action: "tasks",
    actionLabel: "View Tasks",
  },
  {
    id: 6,
    title: "Advanced Features",
    description: "MeTodo includes analytics, voice input, notifications, templates, and much more.",
    icon: "⚡",
    tips: [
      "Voice task creation for hands-free input",
      "Analytics dashboard for productivity insights",
      "Task templates for recurring patterns",
      "Smart notifications with quiet hours",
      "Batch operations for bulk editing",
    ],
  },
  {
    id: 7,
    title: "Developer Options",
    description: "Access 30+ developer tools for debugging, performance monitoring, and advanced features.",
    icon: "🛠️",
    tips: [
      "Performance monitoring tools",
      "Memory and storage tracking",
      "Network activity inspection",
      "Layout debugging utilities",
      "Accessibility checkers",
    ],
    action: "dev-options",
    actionLabel: "Access Developer Options",
  },
  {
    id: 8,
    title: "Tips & Best Practices",
    description: "Follow these tips to get the most out of MeTodo and boost your productivity.",
    icon: "💡",
    tips: [
      "Use categories to organize tasks by type",
      "Set realistic due dates",
      "Review completed tasks regularly",
      "Use subtasks for complex projects",
      "Enable notifications for important tasks",
      "Customize your themes for focus",
    ],
  },
  {
    id: 9,
    title: "You're All Set!",
    description: "You've completed the MeTodo tutorial. Start creating tasks and managing your productivity!",
    icon: "🎉",
    tips: [
      "You can access this tutorial anytime from Settings",
      "Explore all features at your own pace",
      "Customize your experience",
      "Enjoy being productive!",
    ],
  },
];

/**
 * OnboardingScreen Component
 *
 * Displays interactive tutorial with step-by-step guidance
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);

  const step = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    Alert.alert("Skip Tutorial", "Are you sure you want to skip the tutorial?", [
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

  const handleComplete = async () => {
    await AsyncStorage.setItem("metodo_onboarding_completed", "true");
    Alert.alert("Tutorial Complete", "Great job! You're ready to use MeTodo.", [
      {
        text: "Start Using MeTodo",
        onPress: () => router.replace("/(tabs)"),
      },
    ]);
  };

  const handleAction = () => {
    if (step.action) {
      if (step.action === "create-task") {
        router.push("/create-task");
      } else if (step.action === "avatar") {
        router.push("/(tabs)/avatar");
      } else if (step.action === "settings") {
        router.push("/(tabs)/settings");
      } else if (step.action === "tasks") {
        router.push("/(tabs)/tasks");
      } else if (step.action === "dev-options") {
        router.push("/dev-options");
      }
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground">MeTodo Tutorial</Text>
          <Pressable onPress={handleSkip}>
            <Text className="text-lg text-muted">Skip</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View className="px-4 mb-6">
          <View
            className="h-2 rounded-full"
            style={{
              backgroundColor: colors.border,
              overflow: "hidden",
            }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: colors.primary,
                width: `${progress}%`,
              }}
            />
          </View>
          <Text className="text-sm text-muted mt-2">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </Text>
        </View>

        {/* Step Content */}
        <View className="px-4 mb-8">
          {/* Icon */}
          <View className="items-center mb-6">
            <Text className="text-6xl">{step.icon}</Text>
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-foreground mb-3 text-center">{step.title}</Text>

          {/* Description */}
          <Text className="text-base text-muted text-center mb-8 leading-relaxed">
            {step.description}
          </Text>

          {/* Tips */}
          <View
            className="rounded-xl p-4 mb-8"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-lg font-semibold text-foreground mb-3">Tips:</Text>
            {step.tips.map((tip, index) => (
              <View key={index} className="flex-row mb-2">
                <Text className="text-primary font-bold mr-2">•</Text>
                <Text className="flex-1 text-foreground text-sm">{tip}</Text>
              </View>
            ))}
          </View>

          {/* Action Button */}
          {step.action && (
            <TouchableOpacity
              onPress={handleAction}
              style={{ backgroundColor: colors.primary }}
              className="rounded-2xl py-3 items-center mb-4 active:opacity-80"
            >
              <Text className="text-white font-semibold text-base">
                {step.actionLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation Buttons */}
        <View className="px-4 pb-6 gap-3">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentStep === 0}
              style={{
                backgroundColor: currentStep === 0 ? colors.border : colors.surface,
                flex: 1,
              }}
              className="rounded-2xl py-3 items-center active:opacity-80"
            >
              <Text
                className="font-semibold text-base"
                style={{
                  color: currentStep === 0 ? colors.muted : colors.foreground,
                }}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              style={{ backgroundColor: colors.primary, flex: 1 }}
              className="rounded-2xl py-3 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold text-base">
                {currentStep === TUTORIAL_STEPS.length - 1 ? "Finish" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Step Indicators */}
          <View className="flex-row justify-center gap-2 mt-4">
            {TUTORIAL_STEPS.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => setCurrentStep(index)}
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor:
                    index === currentStep
                      ? colors.primary
                      : index < currentStep
                        ? colors.success
                        : colors.border,
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
