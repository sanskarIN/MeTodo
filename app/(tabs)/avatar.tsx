import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState } from "react";

const HAIR_STYLES = ["short", "long", "curly", "straight", "bald"];
const HAIR_COLORS = ["#000000", "#8B4513", "#FFD700", "#FF6347", "#4169E1"];
const EYE_SHAPES = ["round", "almond", "wide", "narrow"];
const EYE_COLORS = ["#8B4513", "#000000", "#4169E1", "#228B22"];
const ACCESSORIES = ["glasses", "hat", "earrings", "none"];
const SKIN_TONES = ["#FDBCB4", "#E8B4A8", "#D4A574", "#A0826D", "#6B4423"];

export default function AvatarScreen() {
  const router = useRouter();
  const { avatar, saveAvatar } = useTaskContext();
  const colors = useColors();

  const [hair, setHair] = useState(avatar?.hair || { style: "short", color: "#000000" });
  const [eyes, setEyes] = useState(avatar?.eyes || { shape: "round", color: "#8B4513" });
  const [accessories, setAccessories] = useState(avatar?.accessories || ["none"]);
  const [skinTone, setSkinTone] = useState(avatar?.skinTone || "#FDBCB4");

  const handleSaveAvatar = async () => {
    const newAvatar = {
      id: avatar?.id || Date.now().toString(),
      name: "My Avatar",
      hair,
      eyes,
      accessories,
      skinTone,
      createdAt: avatar?.createdAt || new Date(),
    };
    await saveAvatar(newAvatar);
    router.back();
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-3xl font-bold text-foreground">Avatar Creator</Text>
          <Text className="text-sm text-muted">Customize your profile</Text>
        </View>

        {/* Avatar Preview */}
        <View className="items-center mb-8">
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: skinTone }}
          >
            <Text className="text-6xl">😊</Text>
          </View>
          <Text className="text-sm text-muted">Preview</Text>
        </View>

        {/* Hair Customization */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Hair Style</Text>
          <View className="flex-row gap-2 flex-wrap">
            {HAIR_STYLES.map((style) => (
              <Pressable
                key={style}
                onPress={() => setHair({ ...hair, style })}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: hair.style === style ? colors.primary : colors.surface,
                  },
                ]}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  className="capitalize font-semibold"
                  style={{ color: hair.style === style ? "#fff" : colors.foreground }}
                >
                  {style}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Hair Color */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Hair Color</Text>
          <View className="flex-row gap-3">
            {HAIR_COLORS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setHair({ ...hair, color })}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: color,
                    borderWidth: hair.color === color ? 3 : 0,
                    borderColor: colors.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Eyes */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Eye Shape</Text>
          <View className="flex-row gap-2 flex-wrap">
            {EYE_SHAPES.map((shape) => (
              <Pressable
                key={shape}
                onPress={() => setEyes({ ...eyes, shape })}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: eyes.shape === shape ? colors.primary : colors.surface,
                  },
                ]}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  className="capitalize font-semibold"
                  style={{ color: eyes.shape === shape ? "#fff" : colors.foreground }}
                >
                  {shape}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Eye Color */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Eye Color</Text>
          <View className="flex-row gap-3">
            {EYE_COLORS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setEyes({ ...eyes, color })}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: color,
                    borderWidth: eyes.color === color ? 3 : 0,
                    borderColor: colors.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Accessories */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Accessories</Text>
          <View className="flex-row gap-2 flex-wrap">
            {ACCESSORIES.map((acc) => (
              <Pressable
                key={acc}
                onPress={() => setAccessories([acc])}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: accessories.includes(acc) ? colors.primary : colors.surface,
                  },
                ]}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  className="capitalize font-semibold"
                  style={{ color: accessories.includes(acc) ? "#fff" : colors.foreground }}
                >
                  {acc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Skin Tone */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-3">Skin Tone</Text>
          <View className="flex-row gap-3">
            {SKIN_TONES.map((tone) => (
              <Pressable
                key={tone}
                onPress={() => setSkinTone(tone)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: tone,
                    borderWidth: skinTone === tone ? 3 : 0,
                    borderColor: colors.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Save Button */}
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={handleSaveAvatar}
            style={{ backgroundColor: colors.primary }}
            className="rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-white font-semibold text-lg">Save Avatar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
