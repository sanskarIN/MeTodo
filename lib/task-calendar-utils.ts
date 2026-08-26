import type { Task } from "@/types";

export interface TaskCalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  timeZone: string;
  notes: string;
  alarms: Array<{ relativeOffset: number }>;
}

const CALENDAR_START_HOUR = 9;
const CALENDAR_EVENT_DURATION_MINUTES = 60;
const CALENDAR_ALARM_OFFSET_MINUTES = -30;

function getDeviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function dateAtLocalTime(date: Date, hour: number, minute: number): Date {
  const nextDate = new Date(date);
  nextDate.setHours(hour, minute, 0, 0);
  return nextDate;
}

export function hasTaskCalendarLink(task: Pick<Task, "calendarEvent">): boolean {
  return Boolean(task.calendarEvent?.eventId && task.calendarEvent.calendarId);
}

export function createTaskCalendarEventData(
  task: Pick<Task, "id" | "title" | "description" | "dueDate" | "priority" | "category">,
): TaskCalendarEventData | null {
  if (!task.dueDate) {
    return null;
  }

  const dueDate = new Date(task.dueDate);
  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  const startDate = dateAtLocalTime(dueDate, CALENDAR_START_HOUR, 0);
  const endDate = new Date(startDate.getTime() + CALENDAR_EVENT_DURATION_MINUTES * 60 * 1000);
  const description = task.description.trim();

  return {
    title: task.title.trim() || "MeTodo task",
    startDate,
    endDate,
    timeZone: getDeviceTimeZone(),
    notes: [
      "Created by MeTodo",
      `Task ID: ${task.id}`,
      `Priority: ${task.priority}`,
      task.category ? `Category: ${task.category}` : null,
      description || null,
    ]
      .filter(Boolean)
      .join("\n"),
    alarms: [{ relativeOffset: CALENDAR_ALARM_OFFSET_MINUTES }],
  };
}
