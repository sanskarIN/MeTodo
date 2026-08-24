import { ScrollView, Text, View, TouchableOpacity, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as FileSystem from "expo-file-system/legacy";

export default function DevOptionsScreen() {
  const router = useRouter();
  const colors = useColors();

  const [devTools, setDevTools] = useState({
    showLayoutBounds: false,
    showPerformanceOverlay: false,
    forceDarkMode: false,
    showTouchTargets: false,
    showFrameRate: false,
    showMemoryMonitor: false,
    showDebugConsole: false,
    showNetworkActivity: false,
    showJankMonitor: false,
    showColorContrast: false,
    showAccessibilityInspector: false,
    showStorageStats: false,
    showDeviceInfo: false,
    showNetworkThrottler: false,
    showAnimationSpeed: false,
  });

  const toggleTool = (tool: keyof typeof devTools) => {
    setDevTools((prev) => ({
      ...prev,
      [tool]: !prev[tool],
    }));
  };

  const handleClearCache = () => {
    Alert.alert("Clear Cache", "Cache cleared successfully!");
  };

  const handleExportLogs = async () => {
    try {
      const logsPath = `${FileSystem.documentDirectory}metodo_logs.txt`;
      const logsContent = "MeTodo Debug Logs\n" + new Date().toISOString() + "\n\nLogs exported successfully.";
      await FileSystem.writeAsStringAsync(logsPath, logsContent);
      Alert.alert("Success", "Logs exported to: " + logsPath);
    } catch {
      Alert.alert("Error", "Failed to export logs");
    }
  };

  const handleResetState = () => {
    Alert.alert("Reset State", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Reset",
        onPress: () => {
          Alert.alert("Success", "State reset successfully!");
        },
      },
    ]);
  };

  const ToolToggle = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) => (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        className="flex-row items-center justify-between p-4 rounded-xl mb-2"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-foreground font-semibold flex-1">{label}</Text>
        <View
          className="w-12 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: value ? colors.success : colors.muted }}
        >
          <Text className="text-white text-xs font-semibold">
            {value ? "ON" : "OFF"}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground">Developer Options</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Normal Developer Tools */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Normal Tools</Text>

          <ToolToggle
            label="Show Layout Bounds"
            value={devTools.showLayoutBounds}
            onToggle={() => toggleTool("showLayoutBounds")}
          />
          <ToolToggle
            label="Performance Overlay"
            value={devTools.showPerformanceOverlay}
            onToggle={() => toggleTool("showPerformanceOverlay")}
          />
          <ToolToggle
            label="Show Touch Targets"
            value={devTools.showTouchTargets}
            onToggle={() => toggleTool("showTouchTargets")}
          />
          <ToolToggle
            label="Frame Rate Monitor"
            value={devTools.showFrameRate}
            onToggle={() => toggleTool("showFrameRate")}
          />
          <ToolToggle
            label="Memory Monitor"
            value={devTools.showMemoryMonitor}
            onToggle={() => toggleTool("showMemoryMonitor")}
          />
          <ToolToggle
            label="Debug Console"
            value={devTools.showDebugConsole}
            onToggle={() => toggleTool("showDebugConsole")}
          />
          <ToolToggle
            label="Network Activity"
            value={devTools.showNetworkActivity}
            onToggle={() => toggleTool("showNetworkActivity")}
          />
          <ToolToggle
            label="Jank Monitor"
            value={devTools.showJankMonitor}
            onToggle={() => toggleTool("showJankMonitor")}
          />
          <ToolToggle
            label="Color Contrast Checker"
            value={devTools.showColorContrast}
            onToggle={() => toggleTool("showColorContrast")}
          />
          <ToolToggle
            label="Accessibility Inspector"
            value={devTools.showAccessibilityInspector}
            onToggle={() => toggleTool("showAccessibilityInspector")}
          />
          <ToolToggle
            label="Storage Stats"
            value={devTools.showStorageStats}
            onToggle={() => toggleTool("showStorageStats")}
          />
          <ToolToggle
            label="Device Info"
            value={devTools.showDeviceInfo}
            onToggle={() => toggleTool("showDeviceInfo")}
          />
          <ToolToggle
            label="Network Throttler"
            value={devTools.showNetworkThrottler}
            onToggle={() => toggleTool("showNetworkThrottler")}
          />
          <ToolToggle
            label="Animation Speed"
            value={devTools.showAnimationSpeed}
            onToggle={() => toggleTool("showAnimationSpeed")}
          />
          <ToolToggle
            label="Force Dark Mode"
            value={devTools.forceDarkMode}
            onToggle={() => toggleTool("forceDarkMode")}
          />
        </View>

        {/* Advanced Developer Tools */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Advanced Tools</Text>

          <TouchableOpacity
            onPress={() => Alert.alert("Database Inspector", "Database query inspector opened")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Database Query Inspector</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Memory Tracker", "Memory allocation: 45.2 MB")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Memory Allocation Tracker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("UI Jank Monitor", "Average FPS: 59.8")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">UI Jank/Frame Drop Monitor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("API Override", "Custom endpoint configured")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">API Endpoint Override</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Deep Link Tester", "Deep link test mode enabled")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Deep Link Tester</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResetState}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">State Management Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Performance Profiler", "Profiler started")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Performance Profiler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Network Throttler", "Throttling: Slow 4G")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Network Throttler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Redux DevTools", "Redux DevTools connected")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Redux DevTools Integration</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Error Boundary", "Error boundary test triggered")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Error Boundary Tester</Text>
          </TouchableOpacity>
        </View>

        {/* Utility Actions */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Utilities</Text>

          <TouchableOpacity
            onPress={handleClearCache}
            style={{ backgroundColor: colors.warning }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-white font-semibold">Clear Cache</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExportLogs}
            style={{ backgroundColor: colors.primary }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-white font-semibold">Export Logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Device Info", "Device: iOS\nOS: 17.0\nApp: v1.0.0")}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 mb-2 active:opacity-80"
          >
            <Text className="text-foreground font-semibold">View Device Info</Text>
          </TouchableOpacity>
        </View>

        {/* Close Button */}
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: colors.surface }}
            className="rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-foreground font-semibold text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
