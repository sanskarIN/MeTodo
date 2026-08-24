/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: app/_layout.tsx
 * PURPOSE: Root layout component for the entire MeTodo application.
 *
 * DESCRIPTION:
 * This is the main entry point for the app's navigation structure. It sets up:
 * - GestureHandlerRootView for gesture handling across the app
 * - CustomThemeProvider for theme management and color system
 * - TaskProvider for global task state management
 * - ThemeProvider from React Navigation for navigation theming
 * - Stack Navigator for screen routing
 *
 * FEATURES:
 * - Initializes all global providers
 * - Manages app-wide theme switching
 * - Handles task context initialization
 * - Sets up navigation stack with all screens
 * - Manages splash screen visibility
 *
 * DEPENDENCIES:
 * - React Navigation (ThemeProvider, Stack)
 * - Expo (SplashScreen)
 * - React Native Gesture Handler
 * - Custom providers (ThemeProvider, TaskProvider)
 *
 * =============================================================================
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider as CustomThemeProvider } from "@/lib/theme-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TaskProvider } from "@/lib/task-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * RootLayout Component
 *
 * Main app layout component that wraps the entire application with necessary providers.
 * Manages:
 * - Gesture handling for swipe gestures and animations
 * - Theme switching (light/dark mode)
 * - Global task state
 * - Navigation structure
 * - Splash screen lifecycle
 *
 * @returns {JSX.Element} The root layout with all providers and navigation
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomThemeProvider>
        <TaskProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="task-detail"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="create-task"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="theme-creator"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="dev-options"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="image-showcase"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="productivity-dashboard"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="templates"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="onboarding"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="collaboration"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="team-management"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="downloads"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="update-settings"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="release-management"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </ThemeProvider>
        </TaskProvider>
      </CustomThemeProvider>
    </GestureHandlerRootView>
  );
}
