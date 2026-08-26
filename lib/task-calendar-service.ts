import { Platform } from "react-native";
import * as Calendar from "expo-calendar";

import type { Task, TaskCalendarLink } from "@/types";
import { createTaskCalendarEventData, hasTaskCalendarLink } from "@/lib/task-calendar-utils";

export interface TaskCalendarOperationResult {
  success: boolean;
  message: string;
  link?: TaskCalendarLink;
}

function failed(message: string): TaskCalendarOperationResult {
  return { success: false, message };
}

class TaskCalendarService {
  private async ensureCalendarAccess(): Promise<TaskCalendarOperationResult> {
    if (Platform.OS === "web") {
      return failed("Calendar integration is available in the Android and iOS apps.");
    }

    try {
      const available = await Calendar.isAvailableAsync();
      if (!available) {
        return failed("The device calendar is not available on this device.");
      }

      const existingPermission = await Calendar.getCalendarPermissionsAsync();
      const permission =
        existingPermission.status === Calendar.PermissionStatus.GRANTED
          ? existingPermission
          : await Calendar.requestCalendarPermissionsAsync();

      if (permission.status !== Calendar.PermissionStatus.GRANTED) {
        return failed("Calendar permission is required to manage linked task events.");
      }

      return { success: true, message: "Calendar access granted." };
    } catch {
      return failed("Calendar access could not be initialized on this device.");
    }
  }

  private async getWritableCalendar(): Promise<Calendar.Calendar | null> {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    return calendars.find((calendar) => calendar.allowsModifications) ?? null;
  }

  async linkTask(task: Task): Promise<TaskCalendarOperationResult> {
    const eventData = createTaskCalendarEventData(task);
    if (!eventData) {
      return failed("Add a valid due date before linking this task to your calendar.");
    }

    const access = await this.ensureCalendarAccess();
    if (!access.success) {
      return access;
    }

    try {
      const calendar = await this.getWritableCalendar();
      if (!calendar) {
        return failed("No writable calendar was found on this device.");
      }

      const eventId = await Calendar.createEventAsync(calendar.id, eventData);
      const syncedAt = new Date();
      return {
        success: true,
        message: "The task was added to your device calendar.",
        link: {
          eventId,
          calendarId: calendar.id,
          linkedAt: syncedAt,
          lastSyncedAt: syncedAt,
        },
      };
    } catch {
      return failed("The calendar event could not be created. Please try again.");
    }
  }

  async syncTask(task: Task): Promise<TaskCalendarOperationResult> {
    if (!hasTaskCalendarLink(task)) {
      return failed("Link this task to a calendar before syncing it.");
    }

    const eventData = createTaskCalendarEventData(task);
    if (!eventData) {
      return failed("Add a valid due date before syncing this task.");
    }

    const access = await this.ensureCalendarAccess();
    if (!access.success) {
      return access;
    }

    try {
      await Calendar.updateEventAsync(task.calendarEvent!.eventId, eventData);
      return {
        success: true,
        message: "The linked calendar event was updated.",
        link: {
          ...task.calendarEvent!,
          lastSyncedAt: new Date(),
        },
      };
    } catch {
      return failed("The linked event could not be updated. It may have been removed from your calendar.");
    }
  }

  async unlinkTask(task: Task): Promise<TaskCalendarOperationResult> {
    if (!hasTaskCalendarLink(task)) {
      return failed("This task is not linked to a calendar event.");
    }

    const access = await this.ensureCalendarAccess();
    if (!access.success) {
      return access;
    }

    try {
      await Calendar.deleteEventAsync(task.calendarEvent!.eventId);
      return { success: true, message: "The calendar event was removed and the task was unlinked." };
    } catch {
      return failed("The calendar event could not be removed. It may have already been deleted.");
    }
  }

  async openTaskEvent(task: Task): Promise<TaskCalendarOperationResult> {
    if (!hasTaskCalendarLink(task)) {
      return failed("This task is not linked to a calendar event.");
    }

    if (Platform.OS === "web") {
      return failed("Calendar integration is available in the Android and iOS apps.");
    }

    try {
      await Calendar.openEventInCalendarAsync({ id: task.calendarEvent!.eventId }, { allowsEditing: true });
      return { success: true, message: "Opened the linked calendar event." };
    } catch {
      return failed("The linked calendar event could not be opened. It may have been removed.");
    }
  }
}

export const taskCalendarService = new TaskCalendarService();
