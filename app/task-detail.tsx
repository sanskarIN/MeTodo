import { ScrollView, Text, View, TouchableOpacity, TextInput, Pressable, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Task } from "@/types";
import { taskCalendarService } from "@/lib/task-calendar-service";

export default function TaskDetailScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const { tasks, updateTask, deleteTask } = useTaskContext();
  const colors = useColors();

  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [calendarAction, setCalendarAction] = useState<"link" | "sync" | "open" | "unlink" | null>(null);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setEditedTask(foundTask);
    }
  }, [taskId, tasks]);

  const handleSave = async () => {
    if (editedTask) {
      await updateTask({
        ...editedTask,
        updatedAt: new Date(),
      });
      setTask(editedTask);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          if (task) {
            await deleteTask(task.id);
            router.back();
          }
        },
      },
    ]);
  };

  const handleToggleComplete = async () => {
    if (task) {
      await updateTask({
        ...task,
        completed: !task.completed,
        updatedAt: new Date(),
      });
      setTask({ ...task, completed: !task.completed });
    }
  };

  const persistTask = async (nextTask: Task) => {
    await updateTask(nextTask);
    setTask(nextTask);
    setEditedTask(nextTask);
  };

  const handleCalendarLink = async () => {
    if (!task) return;
    setCalendarAction("link");
    const result = await taskCalendarService.linkTask(task);
    if (result.success && result.link) {
      await persistTask({ ...task, calendarEvent: result.link, updatedAt: new Date() });
    }
    setCalendarAction(null);
    Alert.alert(result.success ? "Calendar updated" : "Calendar unavailable", result.message);
  };

  const handleCalendarSync = async () => {
    if (!task) return;
    setCalendarAction("sync");
    const result = await taskCalendarService.syncTask(task);
    if (result.success && result.link) {
      await persistTask({ ...task, calendarEvent: result.link, updatedAt: new Date() });
    }
    setCalendarAction(null);
    Alert.alert(result.success ? "Calendar updated" : "Calendar unavailable", result.message);
  };

  const handleCalendarOpen = async () => {
    if (!task) return;
    setCalendarAction("open");
    const result = await taskCalendarService.openTaskEvent(task);
    setCalendarAction(null);
    if (!result.success) {
      Alert.alert("Calendar unavailable", result.message);
    }
  };

  const handleCalendarUnlink = () => {
    if (!task) return;
    Alert.alert("Remove calendar event", "This removes the linked event from your device calendar and unlinks the task.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setCalendarAction("unlink");
          const result = await taskCalendarService.unlinkTask(task);
          if (result.success) {
            const { calendarEvent: _calendarEvent, ...taskWithoutCalendarEvent } = task;
            await persistTask({ ...taskWithoutCalendarEvent, updatedAt: new Date() });
          }
          setCalendarAction(null);
          Alert.alert(result.success ? "Calendar updated" : "Calendar unavailable", result.message);
        },
      },
    ]);
  };

  if (!task) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-foreground">Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Task Details</Text>
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Text className="text-2xl">{isEditing ? "✓" : "✎"}</Text>
          </Pressable>
        </View>

        {/* Completion Status */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={handleToggleComplete}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className="flex-row items-center p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <View
                className="w-8 h-8 rounded-full border-2 mr-3 items-center justify-center"
                style={{
                  borderColor: colors.primary,
                  backgroundColor: task.completed ? colors.primary : "transparent",
                }}
              >
                {task.completed && <Text className="text-white">✓</Text>}
              </View>
              <Text className="text-lg font-semibold text-foreground flex-1">
                {task.completed ? "Completed" : "Mark as Complete"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Title */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Title</Text>
          {isEditing ? (
            <TextInput
              value={editedTask?.title || ""}
              onChangeText={(text) => setEditedTask({ ...editedTask!, title: text })}
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
            />
          ) : (
            <Text className="text-2xl font-bold text-foreground">{task.title}</Text>
          )}
        </View>

        {/* Description */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Description</Text>
          {isEditing ? (
            <TextInput
              value={editedTask?.description || ""}
              onChangeText={(text) => setEditedTask({ ...editedTask!, description: text })}
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
            />
          ) : (
            <Text className="text-foreground">{task.description || "No description"}</Text>
          )}
        </View>

        {/* Priority */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Priority</Text>
          {isEditing ? (
            <View className="flex-row gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setEditedTask({ ...editedTask!, priority: p })}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: editedTask?.priority === p ? colors.primary : colors.surface,
                    },
                  ]}
                  className="flex-1 py-2 rounded-lg items-center"
                >
                  <Text
                    className="font-semibold capitalize"
                    style={{ color: editedTask?.priority === p ? "#fff" : colors.foreground }}
                  >
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text className="text-foreground font-semibold capitalize">{task.priority}</Text>
          )}
        </View>

        {/* Due Date */}
        {task.dueDate && (
          <View className="px-4 mb-6">
            <Text className="text-sm font-semibold text-muted mb-2">Due Date</Text>
            <Text className="text-foreground">
              {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Device Calendar */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">Device Calendar</Text>
          {!task.dueDate ? (
            <View className="rounded-xl p-4" style={{ backgroundColor: colors.surface }}>
              <Text className="text-foreground">Add a due date to create a calendar event for this task.</Text>
            </View>
          ) : Platform.OS === "web" ? (
            <View className="rounded-xl p-4" style={{ backgroundColor: colors.surface }}>
              <Text className="text-foreground">Calendar links are available in the Android and iOS apps.</Text>
            </View>
          ) : task.calendarEvent ? (
            <View className="gap-2">
              <Text className="text-sm text-muted">This task is linked to a device calendar event.</Text>
              <TouchableOpacity
                onPress={handleCalendarOpen}
                disabled={calendarAction !== null}
                style={{ backgroundColor: colors.surface, opacity: calendarAction ? 0.6 : 1 }}
                className="rounded-xl py-3 items-center active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="View linked calendar event"
              >
                <Text className="text-foreground font-semibold">{calendarAction === "open" ? "Opening calendar…" : "View in Calendar"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCalendarSync}
                disabled={calendarAction !== null}
                style={{ backgroundColor: colors.primary, opacity: calendarAction ? 0.6 : 1 }}
                className="rounded-xl py-3 items-center active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="Update linked calendar event"
              >
                <Text className="text-white font-semibold">{calendarAction === "sync" ? "Updating calendar…" : "Update Calendar Event"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCalendarUnlink}
                disabled={calendarAction !== null}
                style={{ backgroundColor: colors.surface, opacity: calendarAction ? 0.6 : 1 }}
                className="rounded-xl py-3 items-center active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="Remove linked calendar event"
              >
                <Text style={{ color: colors.error }} className="font-semibold">{calendarAction === "unlink" ? "Removing calendar event…" : "Remove Calendar Event"}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleCalendarLink}
              disabled={calendarAction !== null}
              style={{ backgroundColor: colors.primary, opacity: calendarAction ? 0.6 : 1 }}
              className="rounded-xl py-3 items-center active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Add task deadline to device calendar"
            >
              <Text className="text-white font-semibold">{calendarAction === "link" ? "Adding to calendar…" : "Add to Device Calendar"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-sm font-semibold text-muted mb-3">Subtasks</Text>
            {task.subtasks.map((subtask) => (
              <View
                key={subtask.id}
                className="flex-row items-center p-3 rounded-lg mb-2"
                style={{ backgroundColor: colors.surface }}
              >
                <View
                  className="w-5 h-5 rounded border-2 mr-3"
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: subtask.completed ? colors.primary : "transparent",
                  }}
                />
                <Text
                  className="flex-1 text-foreground"
                  style={{
                    textDecorationLine: subtask.completed ? "line-through" : "none",
                  }}
                >
                  {subtask.title}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View className="px-4 pb-6 gap-3">
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={handleSave}
                style={{ backgroundColor: colors.primary }}
                className="rounded-2xl py-4 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold text-lg">Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setEditedTask(task);
                }}
                style={{ backgroundColor: colors.surface }}
                className="rounded-2xl py-4 items-center active:opacity-80"
              >
                <Text className="text-foreground font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={{ backgroundColor: colors.primary }}
                className="rounded-2xl py-4 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold text-lg">Edit Task</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={{ backgroundColor: colors.error }}
                className="rounded-2xl py-4 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold text-lg">Delete Task</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
