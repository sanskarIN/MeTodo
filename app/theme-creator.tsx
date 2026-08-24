import { ScrollView, Text, View, TouchableOpacity, TextInput, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Theme } from "@/types";

const PRESET_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B88B", "#52C9A3",
  "#FF8C94", "#A8E6CF", "#FFD3B6", "#FFAAA5", "#FF8B94",
];

export default function ThemeCreatorScreen() {
  const router = useRouter();
  const { addCustomTheme } = useTaskContext();
  const colors = useColors();

  const [themeName, setThemeName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0a7ea4");
  const [secondaryColor, setSecondaryColor] = useState("#6366f1");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState<"primary" | "secondary" | "background" | null>(null);

  const handleSaveTheme = async () => {
    if (!themeName.trim()) {
      alert("Please enter a theme name");
      return;
    }

    const newTheme: Theme = {
      id: Date.now().toString(),
      name: themeName,
      primary: primaryColor,
      secondary: secondaryColor,
      background: backgroundColor,
      surface: "#f5f5f5",
      foreground: "#11181C",
      muted: "#687076",
      border: "#E5E7EB",
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#EF4444",
      isCustom: true,
      createdAt: new Date(),
    };

    await addCustomTheme(newTheme);
    router.back();
  };

  const ColorPicker = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
    <View>
      <View className="flex-row gap-2 flex-wrap mb-4">
        {PRESET_COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: c,
                borderWidth: color === c ? 3 : 0,
                borderColor: colors.primary,
              },
            ]}
          />
        ))}
      </View>
      <View
        className="rounded-xl p-4 flex-row items-center"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-sm text-muted mr-3">Hex:</Text>
        <TextInput
          value={color}
          onChangeText={onChange}
          style={{
            flex: 1,
            backgroundColor: colors.background,
            color: colors.foreground,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 14,
            fontFamily: "monospace",
          }}
          placeholder="#000000"
          placeholderTextColor={colors.muted}
        />
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground">Create Theme</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Theme Name */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Theme Name</Text>
          <TextInput
            placeholder="e.g., My Custom Theme"
            value={themeName}
            onChangeText={setThemeName}
            style={{
              backgroundColor: colors.surface,
              color: colors.foreground,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Preview */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-3">Preview</Text>
          <View
            className="rounded-xl p-6 items-center"
            style={{ backgroundColor }}
          >
            <View className="flex-row gap-2 mb-4">
              <View
                className="w-12 h-12 rounded-lg"
                style={{ backgroundColor: primaryColor }}
              />
              <View
                className="w-12 h-12 rounded-lg"
                style={{ backgroundColor: secondaryColor }}
              />
            </View>
            <Text style={{ color: primaryColor }} className="font-semibold">
              Primary
            </Text>
          </View>
        </View>

        {/* Primary Color */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={() => setShowColorPicker(showColorPicker === "primary" ? null : "primary")}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className="flex-row items-center p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <View
                className="w-10 h-10 rounded-lg mr-3"
                style={{ backgroundColor: primaryColor }}
              />
              <Text className="text-foreground font-semibold flex-1">Primary Color</Text>
              <Text className="text-lg">{showColorPicker === "primary" ? "▼" : "▶"}</Text>
            </View>
          </Pressable>
          {showColorPicker === "primary" && (
            <View className="mt-3">
              <ColorPicker color={primaryColor} onChange={setPrimaryColor} />
            </View>
          )}
        </View>

        {/* Secondary Color */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={() => setShowColorPicker(showColorPicker === "secondary" ? null : "secondary")}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className="flex-row items-center p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <View
                className="w-10 h-10 rounded-lg mr-3"
                style={{ backgroundColor: secondaryColor }}
              />
              <Text className="text-foreground font-semibold flex-1">Secondary Color</Text>
              <Text className="text-lg">{showColorPicker === "secondary" ? "▼" : "▶"}</Text>
            </View>
          </Pressable>
          {showColorPicker === "secondary" && (
            <View className="mt-3">
              <ColorPicker color={secondaryColor} onChange={setSecondaryColor} />
            </View>
          )}
        </View>

        {/* Background Color */}
        <View className="px-4 mb-8">
          <Pressable
            onPress={() => setShowColorPicker(showColorPicker === "background" ? null : "background")}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className="flex-row items-center p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <View
                className="w-10 h-10 rounded-lg mr-3 border-2"
                style={{ backgroundColor, borderColor: colors.border }}
              />
              <Text className="text-foreground font-semibold flex-1">Background Color</Text>
              <Text className="text-lg">{showColorPicker === "background" ? "▼" : "▶"}</Text>
            </View>
          </Pressable>
          {showColorPicker === "background" && (
            <View className="mt-3">
              <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="px-4 pb-6 gap-3">
          <TouchableOpacity
            onPress={handleSaveTheme}
            style={{ backgroundColor: colors.primary }}
            className="rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-white font-semibold text-lg">Save Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: colors.surface }}
            className="rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-foreground font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
