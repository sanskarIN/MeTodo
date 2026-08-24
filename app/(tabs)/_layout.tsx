/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: app/(tabs)/_layout.tsx
 * PURPOSE: Tab navigation layout for the main app interface.
 *
 * DESCRIPTION:
 * Configures the bottom tab bar navigation with four main screens:
 * - Home: Main task overview and statistics
 * - Tasks: Complete task list with filtering
 * - Avatar: Avatar customization screen
 * - Settings: App settings and preferences
 *
 * FEATURES:
 * - Bottom tab bar with icons
 * - Haptic feedback on tab press
 * - Responsive tab bar styling
 * - Safe area handling for notches and home indicators
 * - Color-coded tab icons
 *
 * DEPENDENCIES:
 * - Expo Router (Tabs)
 * - React Native Safe Area Context
 * - Custom components (HapticTab, IconSymbol)
 * - Custom hooks (useColors)
 *
 * =============================================================================
 */

import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

/**
 * TabLayout Component
 *
 * Manages the bottom tab bar navigation structure.
 * Provides navigation between the four main sections of the app.
 *
 * Tab Configuration:
 * 1. Home - Primary dashboard with task overview
 * 2. Tasks - Detailed task management
 * 3. Avatar - User avatar customization
 * 4. Settings - App configuration and preferences
 *
 * @returns {JSX.Element} Tab navigation layout
 */
export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="avatar"
        options={{
          title: "Avatar",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
