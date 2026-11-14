import { Alert, Platform, ScrollView, Text, View, TextInput, TouchableOpacity, Pressable } from "react-native";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Task, Priority } from "@/types";

export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask, categories, dataReadiness } = useTaskContext();
  const colors = useColors();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState(categories[0]?.id || "");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Persisted categories may hydrate after the first render. Never assign
  // an old default category to a task after the user loads custom categories.
  useEffect(() => {
    if (dataReadiness !== "ready") return;
    if (!categories.some(item => item.id === category)) {
      setCategory(categories[0]?.id || "");
    }
  }, [categories, category, dataReadiness]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "dismissed" || !selectedDate) {
      return;
    }
    setDueDate(selectedDate);
  };

  const handleCreateTask = async () => {
    if (dataReadiness !== "ready") {
      Alert.alert("Local data not ready", "Please finish loading saved tasks before creating another task.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a task title");
      return;
    }

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title: title.trim(),
      description,
      priority,
      category,
      dueDate,
      completed: false,
      tags: [],
      subtasks: [],
      reminders: [],
      richNotes: "",
      recurrence: { type: "none" },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await addTask(newTask);
      router.back();
    } catch (error) {
      console.error("Failed to create task:", error);
      Alert.alert("Unable to create task", "Please try again.");
    }
  };

  if (dataReadiness !== "ready") {
    return (
      <ScreenContainer className="bg-background">
        <View className="p-6">
          <Text className="text-xl font-bold text-foreground">
            {dataReadiness === "loading" ? "Loading local categories…" : "Local data needs recovery"}
          </Text>
          <Text className="text-muted mt-3">
            {dataReadiness === "loading"
              ? "Reading saved data before a new task can be created."
              : "Cannot safely create tasks while saved data is unreadable."}
          </Text>
          {dataReadiness === "error" && (
            <Pressable onPress={() => router.push("/backup-restore")}
              accessibilityRole="button" className="bg-primary rounded-lg p-3 mt-4">
              <Text className="text-white font-semibold">Open backup recovery</Text>
            </Pressable>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground">Create Task</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Title Input */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Task Title</Text>
          <TextInput
            placeholder="Enter task title..."
            value={title}
            onChangeText={setTitle}
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

        {/* Description Input */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Description</Text>
          <TextInput
            placeholder="Add details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: colors.surface,
              color: colors.foreground,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              textAlignVertical: "top",
            }}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Priority */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Priority</Text>
          <View className="flex-row gap-2">
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: priority === p ? colors.primary : colors.surface,
                  },
                ]}
                className="flex-1 py-3 rounded-lg items-center"
              >
                <Text
                  className="font-semibold capitalize"
                  style={{ color: priority === p ? "#fff" : colors.foreground }}
                >
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Category */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Category</Text>
          <View className="flex-row gap-2 flex-wrap">
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: category === cat.id ? cat.color : colors.surface,
                  },
                ]}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  className="font-semibold"
                  style={{ color: category === cat.id ? "#fff" : colors.foreground }}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Due Date */}
        <View className="px-4 mb-8">
          <Text className="text-sm font-semibold text-muted mb-2">Due Date (Optional)</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker((visible) => !visible)}
            style={{ backgroundColor: colors.surface }}
            className="rounded-xl p-4 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={dueDate ? `Due date ${dueDate.toLocaleDateString()}` : "Set due date"}
          >
            <Text className="text-foreground font-semibold">
              {dueDate ? dueDate.toLocaleDateString() : "Set due date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
          {dueDate && (
            <TouchableOpacity onPress={() => setDueDate(undefined)} className="mt-2">
              <Text className="text-sm text-primary">Clear due date</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View className="px-4 pb-6 gap-3">
          <TouchableOpacity
            onPress={handleCreateTask}
            style={{ backgroundColor: colors.primary }}
            className="rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-white font-semibold text-lg">Create Task</Text>
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
