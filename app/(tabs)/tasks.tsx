import { ScrollView, Text, View, FlatList, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Task } from "@/types";

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, updateTask } = useTaskContext();
  const colors = useColors();
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("pending");

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

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

  const handleToggleTask = async (task: Task) => {
    await updateTask({
      ...task,
      completed: !task.completed,
      updatedAt: new Date(),
    });
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-3xl font-bold text-foreground">All Tasks</Text>
          <Text className="text-sm text-muted">Manage your tasks</Text>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row gap-2 px-4 mb-6">
          {(["all", "pending", "completed"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: filter === f ? colors.primary : colors.surface,
                },
              ]}
              className="px-4 py-2 rounded-full"
            >
              <Text
                className="font-semibold capitalize"
                style={{ color: filter === f ? "#fff" : colors.foreground }}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tasks List */}
        <View className="px-4 pb-6">
          {filteredTasks.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-5xl mb-3">📭</Text>
              <Text className="text-foreground font-semibold text-lg">No tasks</Text>
              <Text className="text-sm text-muted">Create a new task to get started</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push(`/task-detail?taskId=${item.id}`)
                  }
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View
                    className="flex-row items-center p-4 rounded-xl mb-3"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Pressable
                      onPress={() => handleToggleTask(item)}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <View
                        className="w-6 h-6 rounded-full border-2 mr-3 items-center justify-center"
                        style={{
                          borderColor: getPriorityColor(item.priority),
                          backgroundColor: item.completed ? getPriorityColor(item.priority) : "transparent",
                        }}
                      >
                        {item.completed && <Text className="text-white text-sm">✓</Text>}
                      </View>
                    </Pressable>
                    <View className="flex-1">
                      <Text
                        className="font-semibold"
                        style={{
                          color: colors.foreground,
                          textDecorationLine: item.completed ? "line-through" : "none",
                        }}
                      >
                        {item.title}
                      </Text>
                      {item.dueDate && (
                        <Text className="text-xs text-muted mt-1">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    <Text className="text-lg ml-2">
                      {item.priority === "high" ? "🔴" : item.priority === "medium" ? "🟡" : "🟢"}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
