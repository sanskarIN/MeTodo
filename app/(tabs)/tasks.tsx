import { Alert, FlatList, Modal, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { useColors } from "@/hooks/use-colors";
import { taskCalendarService, type TaskCalendarBulkResult, type WritableCalendarOption } from "@/lib/task-calendar-service";
import { getTaskCalendarBulkEligibility } from "@/lib/task-calendar-utils";
import { type Task } from "@/types";

type BulkCalendarAction = "loading-calendars" | "linking" | null;

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, updateTask, updateTasks, updateSettings } = useTaskContext();
  const colors = useColors();
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("pending");
  const [bulkAction, setBulkAction] = useState<BulkCalendarAction>(null);
  const [calendarOptions, setCalendarOptions] = useState<WritableCalendarOption[]>([]);
  const [isCalendarPickerVisible, setCalendarPickerVisible] = useState(false);
  const [bulkResult, setBulkResult] = useState<TaskCalendarBulkResult | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });
  const bulkEligibility = getTaskCalendarBulkEligibility(filteredTasks);

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

  const openBulkCalendarPicker = async () => {
    if (bulkEligibility.eligibleTasks.length === 0) return;
    setBulkAction("loading-calendars");
    const result = await taskCalendarService.getWritableCalendars();
    setBulkAction(null);

    if (!result.success || !result.calendars) {
      Alert.alert("Calendar unavailable", result.message);
      return;
    }

    setCalendarOptions(result.calendars);
    setCalendarPickerVisible(true);
  };

  const runBulkCalendarLink = async (calendar: WritableCalendarOption) => {
    setCalendarPickerVisible(false);
    setBulkAction("linking");
    await updateSettings({ preferredCalendarId: calendar.id, preferredCalendarTitle: calendar.title });
    const result = await taskCalendarService.bulkLinkTasks(filteredTasks, calendar.id);

    const linksByTaskId = new Map(
      result.results
        .filter((item) => item.status === "linked" && item.link)
        .map((item) => [item.taskId, item.link] as const),
    );
    if (linksByTaskId.size > 0) {
      const updatedAt = new Date();
      await updateTasks(tasks.map((task) => {
        const link = linksByTaskId.get(task.id);
        return link ? { ...task, calendarEvent: link, updatedAt } : task;
      }));
    }

    setBulkAction(null);
    setBulkResult(result);
  };

  const confirmBulkCalendarLink = (calendar: WritableCalendarOption) => {
    const eligibleCount = bulkEligibility.eligibleTasks.length;
    Alert.alert(
      "Link eligible tasks",
      `Add ${eligibleCount} dated task${eligibleCount === 1 ? "" : "s"} to ${calendar.title}? Tasks without due dates and tasks already linked to a calendar will be left unchanged.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Link tasks", onPress: () => { void runBulkCalendarLink(calendar); } },
      ],
    );
  };

  const statusColor = (status: TaskCalendarBulkResult["results"][number]["status"]) => {
    if (status === "linked") return colors.success;
    if (status === "failed") return colors.error;
    return colors.muted;
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-6">
          <Text className="text-3xl font-bold text-foreground">All Tasks</Text>
          <Text className="text-sm text-muted">Manage your tasks</Text>
        </View>

        <View className="flex-row gap-2 px-4 mb-4">
          {(["all", "pending", "completed"] as const).map((nextFilter) => (
            <Pressable
              key={nextFilter}
              onPress={() => setFilter(nextFilter)}
              style={({ pressed }) => [{
                opacity: pressed ? 0.7 : 1,
                backgroundColor: filter === nextFilter ? colors.primary : colors.surface,
                borderRadius: 999,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }]}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === nextFilter }}
            >
              <Text className="font-semibold capitalize" style={{ color: filter === nextFilter ? "#fff" : colors.foreground }}>
                {nextFilter}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="px-4 mb-6">
          <View className="rounded-2xl p-4" style={{ backgroundColor: colors.surface }}>
            <Text className="text-base font-semibold text-foreground">Bulk Device Calendar Linking</Text>
            {Platform.OS === "web" ? (
              <Text className="text-sm text-muted mt-2">Bulk calendar linking is available in the Android and iOS apps.</Text>
            ) : (
              <>
                <Text className="text-sm text-muted mt-2">
                  {bulkEligibility.eligibleTasks.length} eligible dated task{bulkEligibility.eligibleTasks.length === 1 ? "" : "s"} in the current filter. {bulkEligibility.ineligibleTasks.length} task{bulkEligibility.ineligibleTasks.length === 1 ? "" : "s"} will be left unchanged.
                </Text>
                <TouchableOpacity
                  onPress={openBulkCalendarPicker}
                  disabled={bulkAction !== null || bulkEligibility.eligibleTasks.length === 0}
                  style={{ backgroundColor: colors.primary, opacity: bulkAction || bulkEligibility.eligibleTasks.length === 0 ? 0.55 : 1 }}
                  className="rounded-xl py-3 items-center mt-4 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={`Choose a calendar and link ${bulkEligibility.eligibleTasks.length} eligible tasks`}
                >
                  <Text className="text-white font-semibold">
                    {bulkAction === "loading-calendars"
                      ? "Loading calendars…"
                      : bulkAction === "linking"
                        ? "Linking tasks…"
                        : bulkEligibility.eligibleTasks.length === 0
                          ? "No Eligible Tasks to Link"
                          : "Choose Calendar & Link Eligible Tasks"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View className="px-4 pb-6">
          {filteredTasks.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-foreground font-semibold text-lg">No tasks</Text>
              <Text className="text-sm text-muted">Create a new task to get started</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable onPress={() => router.push(`/task-detail?taskId=${item.id}`)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                  <View className="flex-row items-center p-4 rounded-xl mb-3" style={{ backgroundColor: colors.surface }}>
                    <Pressable onPress={() => { void handleToggleTask(item); }} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                      <View className="w-6 h-6 rounded-full border-2 mr-3 items-center justify-center" style={{ borderColor: getPriorityColor(item.priority), backgroundColor: item.completed ? getPriorityColor(item.priority) : "transparent" }}>
                        {item.completed && <Text className="text-white text-sm">✓</Text>}
                      </View>
                    </Pressable>
                    <View className="flex-1">
                      <Text className="font-semibold" style={{ color: colors.foreground, textDecorationLine: item.completed ? "line-through" : "none" }}>{item.title}</Text>
                      {item.dueDate && <Text className="text-xs text-muted mt-1">Due: {new Date(item.dueDate).toLocaleDateString()}</Text>}
                      {item.calendarEvent && <Text className="text-xs text-muted mt-1">Linked to device calendar</Text>}
                    </View>
                    <Text className="text-lg ml-2">{item.priority === "high" ? "High" : item.priority === "medium" ? "Medium" : "Low"}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>

      <Modal visible={isCalendarPickerVisible} transparent animationType="slide" onRequestClose={() => setCalendarPickerVisible(false)}>
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}>
          <View className="rounded-t-3xl p-5" style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xl font-bold text-foreground">Choose Calendar</Text>
              <Pressable onPress={() => setCalendarPickerVisible(false)} accessibilityRole="button" accessibilityLabel="Close calendar chooser">
                <Text className="text-xl text-muted">✕</Text>
              </Pressable>
            </View>
            <Text className="text-sm text-muted mb-4">Choose where the {bulkEligibility.eligibleTasks.length} eligible task events should be created.</Text>
            <FlatList
              data={calendarOptions}
              keyExtractor={(calendar) => calendar.id}
              style={{ maxHeight: 300 }}
              renderItem={({ item: calendar }) => (
                <TouchableOpacity
                  onPress={() => confirmBulkCalendarLink(calendar)}
                  style={{ backgroundColor: colors.surface, borderLeftColor: calendar.color || colors.primary, borderLeftWidth: 4 }}
                  className="rounded-xl px-4 py-4 mb-2 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={`Link eligible tasks to ${calendar.title}`}
                >
                  <Text className="text-foreground font-semibold">{calendar.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={Boolean(bulkResult)} transparent animationType="slide" onRequestClose={() => setBulkResult(null)}>
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}>
          <View className="rounded-t-3xl p-5" style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xl font-bold text-foreground">Bulk Linking Results</Text>
              <Pressable onPress={() => setBulkResult(null)} accessibilityRole="button" accessibilityLabel="Close bulk linking results">
                <Text className="text-xl text-muted">✕</Text>
              </Pressable>
            </View>
            {bulkResult && (
              <>
                <Text className="text-sm text-muted mb-3">{bulkResult.message}</Text>
                <View className="flex-row gap-2 mb-4">
                  <Text className="text-sm font-semibold" style={{ color: colors.success }}>{bulkResult.linkedTaskCount} linked</Text>
                  <Text className="text-sm font-semibold text-muted">{bulkResult.skippedTaskCount} skipped</Text>
                  <Text className="text-sm font-semibold" style={{ color: colors.error }}>{bulkResult.failedTaskCount} failed</Text>
                </View>
                <FlatList
                  data={bulkResult.results}
                  keyExtractor={(item) => item.taskId}
                  style={{ maxHeight: 360 }}
                  renderItem={({ item }) => (
                    <View className="rounded-xl p-3 mb-2" style={{ backgroundColor: colors.surface }}>
                      <Text className="font-semibold" style={{ color: statusColor(item.status) }}>{item.taskTitle}</Text>
                      <Text className="text-sm text-muted mt-1">{item.message}</Text>
                    </View>
                  )}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
