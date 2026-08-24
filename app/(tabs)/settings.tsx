import { Animated, ScrollView, Text, View, TouchableOpacity, Pressable, Linking, Alert, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useChartAnimationSettings } from "@/hooks/use-chart-animation-settings";
import { isChartAnimationSettingsSection } from "@/lib/settings-navigation";

const CHART_SPEED_OPTIONS = [
  { value: "slow" as const, label: "Slow", description: "Relaxed transitions" },
  { value: "normal" as const, label: "Normal", description: "Balanced motion" },
  { value: "fast" as const, label: "Fast", description: "Quick transitions" },
];

const PREVIEW_BARS = [0.42, 0.78, 0.58, 0.9, 0.66];

function LiveChartAnimationPreview() {
  const colors = useColors();
  const { animationSpeed, reducedMotion, getDuration } = useChartAnimationSettings();
  const progress = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    progress.stopAnimation();
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }

    progress.setValue(0);
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: getDuration(520), useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0.45, duration: getDuration(280), useNativeDriver: false }),
        Animated.delay(getDuration(240)),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [getDuration, progress, reducedMotion]);

  return (
    <View
      className="rounded-lg p-3 mb-4 border border-border"
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Live chart animation preview at ${animationSpeed} speed${reducedMotion ? ". Reduced motion is active." : "."}`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-semibold text-foreground">Live preview</Text>
        <Text className="text-[10px] text-muted">{reducedMotion ? "Motion reduced" : `${animationSpeed} speed`}</Text>
      </View>
      <View className="h-20 flex-row items-end gap-2 px-2" accessible={false}>
        {PREVIEW_BARS.map((ratio, index) => (
          <View key={`preview-bar-${index}`} className="flex-1 h-full justify-end items-center">
            <Animated.View
              className="w-full rounded-t-md"
              style={{
                height: progress.interpolate({ inputRange: [0, 1], outputRange: [8, Math.max(8, Math.round(68 * ratio))] }),
                backgroundColor: colors.primary,
                opacity: 0.72 + ratio * 0.28,
              }}
            />
          </View>
        ))}
      </View>
      <View className="h-px bg-border mt-2" />
      <Text className="text-[10px] text-muted mt-2">Change a speed option above to replay this transition.</Text>
    </View>
  );
}

const PRESET_THEMES = [
  { name: "Default", primary: "#0a7ea4", secondary: "#6366f1", background: "#ffffff" },
  { name: "Dark AMOLED", primary: "#00d4ff", secondary: "#ff006e", background: "#000000" },
  { name: "Pastel", primary: "#ff9999", secondary: "#ffcc99", background: "#ffe6e6" },
  { name: "Neon", primary: "#00ff00", secondary: "#ff00ff", background: "#0a0a0a" },
  { name: "Ocean", primary: "#006994", secondary: "#00bcd4", background: "#e0f7fa" },
  { name: "Sunset", primary: "#ff6b6b", secondary: "#ffa500", background: "#fff5e1" },
  { name: "Forest", primary: "#2d5016", secondary: "#6ba547", background: "#f1f5e8" },
  { name: "Lavender", primary: "#9370db", secondary: "#dda0dd", background: "#f0e6ff" },
  { name: "Mint", primary: "#00b894", secondary: "#55efc4", background: "#e8f8f5" },
  { name: "Coral", primary: "#ff7675", secondary: "#fab1a0", background: "#ffe5e3" },
  { name: "Cyberpunk", primary: "#00ffff", secondary: "#ff00ff", background: "#1a1a2e" },
  { name: "Minimalist", primary: "#333333", secondary: "#666666", background: "#ffffff" },
  { name: "Berry", primary: "#c2185b", secondary: "#e91e63", background: "#fce4ec" },
  { name: "Teal", primary: "#00897b", secondary: "#26a69a", background: "#e0f2f1" },
  { name: "Amber", primary: "#ff6f00", secondary: "#ffb300", background: "#fff3e0" },
  { name: "Deep Purple", primary: "#512da8", secondary: "#7e57c2", background: "#f3e5f5" },
  { name: "Indigo", primary: "#283593", secondary: "#5c6bc0", background: "#e8eaf6" },
  { name: "Cyan", primary: "#0097a7", secondary: "#00bcd4", background: "#e0f7fa" },
  { name: "Pink", primary: "#c2185b", secondary: "#f06292", background: "#fce4ec" },
  { name: "Red", primary: "#c62828", secondary: "#e53935", background: "#ffebee" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [chartAnimationSectionY, setChartAnimationSectionY] = useState<number | null>(null);
  const { settings, updateSettings, clearAllData } = useTaskContext();
  const colors = useColors();
  const systemReducedMotion = useReducedMotion();
  const [versionTaps, setVersionTaps] = useState(0);

  useEffect(() => {
    if (!isChartAnimationSettingsSection(section) || chartAnimationSectionY === null) {
      return;
    }

    const timeoutId = setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(chartAnimationSectionY - 16, 0),
        animated: true,
      });
    }, 80);

    return () => clearTimeout(timeoutId);
  }, [chartAnimationSectionY, section]);

  const handleVersionTap = () => {
    const newTaps = versionTaps + 1;
    setVersionTaps(newTaps);
      if (newTaps >= 10) {
        router.push("/dev-options");
        setVersionTaps(0);
      }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open link");
    });
  };

  const handleCopyEmail = async () => {
    try {
      await Clipboard.setStringAsync("supportramsandesh@gmail.com");
      Alert.alert("Email", "supportramsandesh@gmail.com\n\nCopied to clipboard!");
    } catch (error) {
      console.error("Failed to copy support email:", error);
      Alert.alert("Email", "Could not copy the support email. Please copy it manually.");
    }
  };

  const handleThemeChange = async (theme: any) => {
    await updateSettings({
      theme: theme.name,
    });
  };

  const handleClearData = () => {
    Alert.alert("Clear All Data", "Are you sure? This cannot be undone.", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Clear",
        onPress: async () => {
          try {
            await clearAllData();
            Alert.alert("Success", "All data cleared");
          } catch (error) {
            console.error("Failed to clear data:", error);
            Alert.alert("Unable to clear data", "Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
          <Text className="text-sm text-muted">Customize your experience</Text>
        </View>

        {/* Theme Selection */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Themes</Text>
          <View className="flex-row flex-wrap gap-2">
            {PRESET_THEMES.slice(0, 12).map((theme, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleThemeChange(theme)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    width: "48%",
                  },
                ]}
              >
                <View
                  className="rounded-xl p-4 items-center"
                  style={{ backgroundColor: theme.background }}
                >
                  <View
                    className="w-8 h-8 rounded-full mb-2"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <Text
                    className="text-xs font-semibold text-center"
                    style={{ color: theme.primary }}
                  >
                    {theme.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => router.push("/theme-creator")}
            style={{ backgroundColor: colors.primary }}
            className="rounded-xl py-3 items-center mt-4 active:opacity-80"
          >
            <Text className="text-white font-semibold">+ Create Custom Theme</Text>
          </TouchableOpacity>
        </View>

        {/* Dark Mode */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Dark Mode</Text>
          <View className="flex-row gap-2">
            {(["auto", "light", "dark"] as const).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => updateSettings({ darkMode: mode })}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: settings.darkMode === mode ? colors.primary : colors.surface,
                  },
                ]}
                className="flex-1 py-3 rounded-lg items-center"
              >
                <Text
                  className="font-semibold capitalize"
                  style={{ color: settings.darkMode === mode ? "#fff" : colors.foreground }}
                >
                  {mode}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View className="px-4 mb-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">Notifications</Text>
            <Pressable
              onPress={() => updateSettings({ notifications: !settings.notifications })}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className="w-12 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: settings.notifications ? colors.success : colors.muted }}
              >
                <Text className="text-white text-sm">
                  {settings.notifications ? "ON" : "OFF"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Chart Animation */}
        <View
          className="px-4 mb-8"
          testID="chart-animation-settings-section"
          onLayout={(event) => setChartAnimationSectionY(event.nativeEvent.layout.y)}
        >
          <Text className="text-lg font-semibold text-foreground mb-4">Chart Animation</Text>
          <View className="rounded-xl p-4" style={{ backgroundColor: colors.surface }}>
            <Text className="font-semibold text-foreground">Animation speed</Text>
            <Text className="text-sm text-muted mt-1 mb-3">Choose how quickly analytics charts enter and update.</Text>
            <View className="flex-row gap-2">
              {CHART_SPEED_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => updateSettings({ chartAnimationSpeed: option.value })}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: settings.chartAnimationSpeed === option.value ? colors.primary : colors.background,
                    },
                  ]}
                  className="flex-1 rounded-lg p-3 items-center"
                  accessibilityRole="button"
                  accessibilityState={{ selected: settings.chartAnimationSpeed === option.value }}
                  accessibilityLabel={`Set chart animation speed to ${option.label}`}
                >
                  <Text
                    className="font-semibold"
                    style={{ color: settings.chartAnimationSpeed === option.value ? "#fff" : colors.foreground }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    className="text-[10px] text-center mt-1"
                    style={{ color: settings.chartAnimationSpeed === option.value ? "#E0F2FE" : colors.muted }}
                  >
                    {option.description}
                  </Text>
                </Pressable>
              ))}
            </View>

            <LiveChartAnimationPreview />

            <View className="flex-row items-center justify-between mt-5 pt-4 border-t border-border">
              <View className="flex-1 pr-4">
                <Text className="font-semibold text-foreground">Reduce chart motion</Text>
                <Text className="text-sm text-muted mt-1">
                  {systemReducedMotion
                    ? "Your device Reduce Motion setting is active."
                    : "Use instant chart and tooltip transitions for accessibility."}
                </Text>
              </View>
              <Switch
                value={Boolean(settings.reduceMotion)}
                onValueChange={(value) => updateSettings({ reduceMotion: value })}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor={settings.reduceMotion ? "#fff" : colors.surface}
                accessibilityLabel="Reduce chart motion"
                accessibilityHint="Disables chart and tooltip animations in MeTodo"
              />
            </View>
          </View>
        </View>

        {/* App Version */}
        <View className="px-4 mb-8">
          <Pressable onPress={handleVersionTap} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View
              className="rounded-xl p-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted">App Version</Text>
              <Text className="text-lg font-semibold text-foreground">MeTodo v1.0.0</Text>
              {versionTaps > 0 && versionTaps < 10 && (
                <Text className="text-xs text-muted mt-2">
                  Developer mode: {10 - versionTaps} taps remaining
                </Text>
              )}
            </View>
          </Pressable>
        </View>

        {/* Image Gallery */}
        <View className="px-4 mb-8">
          <TouchableOpacity
            onPress={() => router.push("/image-showcase")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 active:opacity-80"
          >
            <Text className="text-sm text-muted mb-2">Media</Text>
            <Text className="font-semibold text-foreground">🖼️ Image Gallery</Text>
            <Text className="text-xs text-muted mt-2">View branding and feature images</Text>
          </TouchableOpacity>
        </View>

        {/* Creator Social Links */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Follow Creator on:</Text>
          <TouchableOpacity
            onPress={() => handleOpenLink("https://www.github.com/Sanskar-in")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-3 flex-row items-center active:opacity-80"
          >
            <Text className="text-2xl mr-3">🐙</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">GitHub</Text>
              <Text className="text-sm text-muted">github.com/Sanskar-in</Text>
            </View>
            <Text className="text-lg">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenLink("https://www.linkedin.com/in/sanskar-in")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-3 flex-row items-center active:opacity-80"
          >
            <Text className="text-2xl mr-3">💼</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">LinkedIn</Text>
              <Text className="text-sm text-muted">linkedin.com/in/sanskar-in</Text>
            </View>
            <Text className="text-lg">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenLink("https://www.x.com/SanskarCode")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-3 flex-row items-center active:opacity-80"
          >
            <Text className="text-2xl mr-3">𝕏</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">X (Twitter)</Text>
              <Text className="text-sm text-muted">x.com/SanskarCode</Text>
            </View>
            <Text className="text-lg">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenLink("https://www.buymeacoffee.com/sanskarIN")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-3 flex-row items-center active:opacity-80"
            accessibilityRole="link"
            accessibilityLabel="Buy Me a Coffee for SanskarIN"
          >
            <Text className="text-2xl mr-3">☕</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">Buy Me a Coffee</Text>
              <Text className="text-sm text-muted">buymeacoffee.com/sanskarIN</Text>
            </View>
            <Text className="text-lg">→</Text>
          </TouchableOpacity>
        </View>

        {/* Contact/Hire Me */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Contact</Text>
          <TouchableOpacity
            onPress={handleCopyEmail}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 active:opacity-80"
          >
            <Text className="text-sm text-muted mb-2">For support, feedback, or inquiries:</Text>
            <Text className="font-semibold text-foreground">supportramsandesh@gmail.com</Text>
          </TouchableOpacity>
        </View>

        {/* Open Source Info */}
        <View className="px-4 mb-8">
          <TouchableOpacity
            onPress={() => handleOpenLink("https://www.github.com/Sanskar-in/MeTodo")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 active:opacity-80"
          >
            <Text className="text-sm text-muted mb-2">Open Source</Text>
            <Text className="font-semibold text-foreground">Source Code available at</Text>
            <Text className="text-primary mt-1">github.com/Sanskar-in/MeTodo</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-error mb-4">Danger Zone</Text>
          <TouchableOpacity
            onPress={handleClearData}
            style={{ backgroundColor: colors.error }}
            className="rounded-xl py-3 items-center active:opacity-80"
          >
            <Text className="text-white font-semibold">Clear All Data</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-4 pb-8 items-center">
          <Text className="text-xs text-muted">Made with ❤️ by Sanskar</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
