import { ScrollView, Text, View, TouchableOpacity, FlatList, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, avatar } = useTaskContext();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const overdueTasks = tasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  const filteredTasks = tasks
    .filter((t) => !t.completed)
    .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const handleTaskPress = (taskId: string) => {
    // Navigate to task detail screen
    router.push(`/task-detail?taskId=${taskId}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View className="flex-row items-center justify-between mb-6 px-4 pt-4">
          <View>
            <Text className="text-3xl font-bold text-foreground">MeTodo</Text>
            <Text className="text-sm text-muted">Stay productive</Text>
          </View>
          {avatar && (
            <Pressable
              onPress={() => router.push("/(tabs)/avatar")}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-xl">👤</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Statistics */}
        <View className="flex-row gap-3 px-4 mb-6">
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl font-bold text-foreground">{completedTasks}</Text>
            <Text className="text-xs text-muted">Completed</Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl font-bold text-foreground">{pendingTasks}</Text>
            <Text className="text-xs text-muted">Pending</Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl font-bold text-error">{overdueTasks}</Text>
            <Text className="text-xs text-muted">Overdue</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-6">
          <View
            className="flex-row items-center rounded-xl px-4 py-3"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-lg text-muted mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-foreground"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search tasks..."
              placeholderTextColor={colors.muted}
              accessibilityLabel="Search pending tasks"
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Tasks List */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Pending Tasks ({filteredTasks.length})
          </Text>

          {filteredTasks.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-4xl mb-2">✨</Text>
              <Text className="text-foreground font-semibold">All caught up!</Text>
              <Text className="text-sm text-muted">No pending tasks match your search</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleTaskPress(item.id)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View
                    className="flex-row items-center p-4 rounded-xl mb-3"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View
                      className="w-5 h-5 rounded-full border-2 mr-3"
                      style={{ borderColor: getPriorityColor(item.priority) }}
                    />
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold">{item.title}</Text>
                      {item.dueDate && (
                        <Text className="text-xs text-muted mt-1">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    <Text className="text-lg">{item.subtasks.length > 0 ? "📋" : ""}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>

        {/* Create Task Button */}
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={() => router.push("/create-task")}
            style={{ backgroundColor: colors.primary }}
            className="rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-white font-semibold text-lg">+ Create New Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
