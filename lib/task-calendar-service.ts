import { Platform } from "react-native";
import * as Calendar from "expo-calendar";

import type { Task, TaskCalendarLink } from "@/types";
import {
  createTaskCalendarEventData,
  getTaskCalendarBulkEligibility,
  hasTaskCalendarLink,
  type WritableCalendarOption,
} from "@/lib/task-calendar-utils";

export type { WritableCalendarOption } from "@/lib/task-calendar-utils";

export interface TaskCalendarOperationResult {
  success: boolean;
  message: string;
  link?: TaskCalendarLink;
}

export interface WritableCalendarResult extends TaskCalendarOperationResult {
  calendars?: WritableCalendarOption[];
}

export type TaskCalendarBulkResultStatus = "linked" | "skipped" | "failed";

export interface TaskCalendarBulkResultItem {
  taskId: string;
  taskTitle: string;
  status: TaskCalendarBulkResultStatus;
  message: string;
  link?: TaskCalendarLink;
}

export interface TaskCalendarBulkResult {
  success: boolean;
  message: string;
  calendarId?: string;
  totalTaskCount: number;
  eligibleTaskCount: number;
  linkedTaskCount: number;
  skippedTaskCount: number;
  failedTaskCount: number;
  results: TaskCalendarBulkResultItem[];
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

  private async getWritableCalendar(calendarId: string): Promise<Calendar.Calendar | null> {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    return calendars.find((calendar) => calendar.id === calendarId && calendar.allowsModifications) ?? null;
  }

  async getWritableCalendars(): Promise<WritableCalendarResult> {
    const access = await this.ensureCalendarAccess();
    if (!access.success) {
      return access;
    }

    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const writableCalendars = calendars
        .filter((calendar) => calendar.allowsModifications)
        .map((calendar) => ({ id: calendar.id, title: calendar.title, color: calendar.color }));

      if (writableCalendars.length === 0) {
        return failed("No writable calendar was found on this device.");
      }

      return {
        success: true,
        message: "Choose the calendar that should receive this task event.",
        calendars: writableCalendars,
      };
    } catch {
      return failed("Writable calendars could not be loaded. Please try again.");
    }
  }

  async linkTask(task: Task, calendarId: string): Promise<TaskCalendarOperationResult> {
    const eventData = createTaskCalendarEventData(task);
    if (!eventData) {
      return failed("Add a valid due date before linking this task to your calendar.");
    }

    const access = await this.ensureCalendarAccess();
    if (!access.success) {
      return access;
    }

    try {
      const calendar = await this.getWritableCalendar(calendarId);
      if (!calendar) {
        return failed("The selected calendar is no longer writable. Choose another calendar and try again.");
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

  async bulkLinkTasks(tasks: Task[], calendarId: string): Promise<TaskCalendarBulkResult> {
    const eligibility = getTaskCalendarBulkEligibility(tasks);
    const skippedResults: TaskCalendarBulkResultItem[] = eligibility.ineligibleTasks.map((task) => ({
      taskId: task.taskId,
      taskTitle: task.taskTitle,
      status: "skipped",
      message: task.message,
    }));
    const resultBase = {
      totalTaskCount: tasks.length,
      eligibleTaskCount: eligibility.eligibleTasks.length,
      skippedTaskCount: skippedResults.length,
    };

    if (eligibility.eligibleTasks.length === 0) {
      return {
        success: true,
        message: "No eligible dated tasks need a calendar link.",
        ...resultBase,
        linkedTaskCount: 0,
        failedTaskCount: 0,
        results: skippedResults,
      };
    }

    const access = await this.ensureCalendarAccess();
    if (!access.success) {
      const failedResults = eligibility.eligibleTasks.map((task) => ({
        taskId: task.id,
        taskTitle: task.title,
        status: "failed" as const,
        message: access.message,
      }));
      return {
        success: false,
        message: access.message,
        ...resultBase,
        linkedTaskCount: 0,
        failedTaskCount: failedResults.length,
        results: [...skippedResults, ...failedResults],
      };
    }

    try {
      const calendar = await this.getWritableCalendar(calendarId);
      if (!calendar) {
        const failedResults = eligibility.eligibleTasks.map((task) => ({
          taskId: task.id,
          taskTitle: task.title,
          status: "failed" as const,
          message: "The selected calendar is no longer writable. Choose another calendar and try again.",
        }));
        return {
          success: false,
          message: "The selected calendar is no longer writable. Choose another calendar and try again.",
          ...resultBase,
          linkedTaskCount: 0,
          failedTaskCount: failedResults.length,
          results: [...skippedResults, ...failedResults],
        };
      }

      const linkedResults: TaskCalendarBulkResultItem[] = [];
      for (const task of eligibility.eligibleTasks) {
        const eventData = createTaskCalendarEventData(task);
        if (!eventData) {
          linkedResults.push({
            taskId: task.id,
            taskTitle: task.title,
            status: "failed",
            message: "The task event could not be prepared from its due date.",
          });
          continue;
        }

        try {
          const eventId = await Calendar.createEventAsync(calendar.id, eventData);
          const syncedAt = new Date();
          linkedResults.push({
            taskId: task.id,
            taskTitle: task.title,
            status: "linked",
            message: "Added to the selected device calendar.",
            link: {
              eventId,
              calendarId: calendar.id,
              linkedAt: syncedAt,
              lastSyncedAt: syncedAt,
            },
          });
        } catch {
          linkedResults.push({
            taskId: task.id,
            taskTitle: task.title,
            status: "failed",
            message: "The calendar event could not be created for this task.",
          });
        }
      }

      const linkedTaskCount = linkedResults.filter((result) => result.status === "linked").length;
      const failedTaskCount = linkedResults.filter((result) => result.status === "failed").length;
      return {
        success: failedTaskCount === 0,
        message: `${linkedTaskCount} task${linkedTaskCount === 1 ? "" : "s"} linked; ${skippedResults.length} skipped; ${failedTaskCount} failed.`,
        calendarId: calendar.id,
        ...resultBase,
        linkedTaskCount,
        failedTaskCount,
        results: [...linkedResults, ...skippedResults],
      };
    } catch {
      const failedResults = eligibility.eligibleTasks.map((task) => ({
        taskId: task.id,
        taskTitle: task.title,
        status: "failed" as const,
        message: "Bulk calendar linking could not be completed. Please try again.",
      }));
      return {
        success: false,
        message: "Bulk calendar linking could not be completed. Please try again.",
        ...resultBase,
        linkedTaskCount: 0,
        failedTaskCount: failedResults.length,
        results: [...skippedResults, ...failedResults],
      };
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
