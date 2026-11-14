import type { Task, Category, AppSettings, AvatarCustomization, Theme } from "@/types";
import { SerializedStorageState } from "@/lib/serialized-storage-state";

export const LOCAL_BACKUP_FORMAT = "metodo.local.v1";
export const RESTORE_JOURNAL_KEY = "metodo_restore_pending_v1";
const MAX_BACKUP_LENGTH = 8 * 1024 * 1024;

export interface LocalBackupData {
  tasks: Task[];
  categories: Category[];
  settings: AppSettings;
  avatar: AvatarCustomization | null;
}

interface LocalBackupStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface LocalBackupStores {
  tasks: SerializedStorageState<Task[]>;
  categories: SerializedStorageState<Category[]>;
  settings: SerializedStorageState<AppSettings>;
  avatar: SerializedStorageState<AvatarCustomization | null>;
}

function object(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requiredText(value: unknown, label: string, max = 1000): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    throw new Error(label + " must be a nonempty string");
  }
  return value;
}

function optionalText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function date(value: unknown, label: string): Date {
  const result = value instanceof Date ? value : new Date(value as string);
  if (!Number.isFinite(result.getTime())) throw new Error("Invalid date in " + label);
  return result;
}

function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value) || value.length > 50000) {
    throw new Error("Backup tasks must be an array");
  }
  const ids = new Set<string>();
  return value.map((item: unknown, index: number): Task => {
    if (!object(item)) throw new Error("Task " + (index + 1) + " is invalid");
    const id = requiredText(item.id, "Task id", 200);
    if (ids.has(id)) throw new Error("Duplicate task id: " + id);
    ids.add(id);
    const title = requiredText(item.title, "Task title", 2000);
    if (item.completed !== true && item.completed !== false) {
      throw new Error("Task " + id + " must have a completion flag");
    }
    if (!["low", "medium", "high"].includes(String(item.priority))) {
      throw new Error("Invalid task priority: " + id);
    }
    const tags = item.tags === undefined ? [] : item.tags;
    if (!Array.isArray(tags) || !tags.every(tag => typeof tag === "string")) {
      throw new Error("Invalid task tags: " + id);
    }
    const subtasks = item.subtasks === undefined ? [] : item.subtasks;
    if (!Array.isArray(subtasks)) throw new Error("Invalid subtasks: " + id);
    const cleanedSubtasks = subtasks.map((sub, subIndex) => {
      if (!object(sub) || typeof sub.completed !== "boolean") {
        throw new Error("Invalid subtask " + subIndex + " in task " + id);
      }
      return {
        id: requiredText(sub.id, "Subtask id", 200),
        title: requiredText(sub.title, "Subtask title", 2000),
        completed: sub.completed,
        createdAt: date(sub.createdAt, "subtask creation date"),
      };
    });
    const reminders = item.reminders === undefined ? [] : item.reminders;
    if (!Array.isArray(reminders)) throw new Error("Invalid reminders: " + id);
    const cleanedReminders = reminders.map((rem, remIndex) => {
      if (!object(rem) || (rem.type !== "notification" && rem.type !== "email")) {
        throw new Error("Invalid reminder " + remIndex + " in task " + id);
      }
      return { id: requiredText(rem.id, "Reminder id", 200),
        type: rem.type as "notification" | "email",
        time: date(rem.time, "reminder date") };
    });
    const rec = object(item.recurrence) ? item.recurrence : { type: "none" };
    if (!["none", "daily", "weekly", "monthly", "yearly", "custom"].includes(String(rec.type))) {
      throw new Error("Invalid recurrence: " + id);
    }
    const recurrence: Task["recurrence"] = {
      type: rec.type as Task["recurrence"]["type"],
      ...(rec.endDate == null ? {} : { endDate: date(rec.endDate, "recurrence end date") }),
      ...(typeof rec.customPattern === "string" ? { customPattern: rec.customPattern } : {}),
    };
    let calendarEvent: Task["calendarEvent"] | undefined;
    if (item.calendarEvent != null) {
      const link = item.calendarEvent;
      if (!object(link)) throw new Error("Invalid linked calendar event: " + id);
      calendarEvent = {
        eventId: requiredText(link.eventId, "Calendar event id", 500),
        calendarId: requiredText(link.calendarId, "Calendar id", 500),
        linkedAt: date(link.linkedAt, "calendar linked date"),
        lastSyncedAt: date(link.lastSyncedAt, "calendar synced date"),
      };
    }
    return {
      id, title,
      description: optionalText(item.description),
      ...(item.dueDate == null ? {} : { dueDate: date(item.dueDate, "task due date") }),
      priority: item.priority as Task["priority"],
      completed: item.completed,
      category: optionalText(item.category),
      tags, subtasks: cleanedSubtasks, reminders: cleanedReminders,
      recurrence, calendarEvent, richNotes: optionalText(item.richNotes),
      createdAt: date(item.createdAt, "task creation date"),
      updatedAt: date(item.updatedAt, "task update date"),
    };
  });
}

function parseCategories(value: unknown): Category[] {
  if (!Array.isArray(value)) throw new Error("Backup categories must be an array");
  const ids = new Set<string>();
  return value.map((item: unknown) => {
    if (!object(item)) throw new Error("Invalid category entry");
    const id = requiredText(item.id, "Category id", 200);
    if (ids.has(id)) throw new Error("Duplicate category id: " + id);
    ids.add(id);
    return {
      id,
      name: requiredText(item.name, "Category name", 1000),
      color: requiredText(item.color, "Category color", 100),
      icon: requiredText(item.icon, "Category icon", 200),
    };
  });
}

function parseAvatar(value: unknown): AvatarCustomization | null {
  if (value == null) return null;
  if (!object(value) || !object(value.hair) || !object(value.eyes) ||
      !Array.isArray(value.accessories) || !value.accessories.every(x => typeof x === "string")) {
    throw new Error("Invalid avatar in backup");
  }
  return {
    id: requiredText(value.id, "Avatar id"),
    name: requiredText(value.name, "Avatar name"),
    hair: { style: requiredText(value.hair.style, "Hair style"),
      color: requiredText(value.hair.color, "Hair color") },
    eyes: { shape: requiredText(value.eyes.shape, "Eye shape"),
      color: requiredText(value.eyes.color, "Eye color") },
    accessories: value.accessories,
    skinTone: requiredText(value.skinTone, "Skin tone"),
    createdAt: date(value.createdAt, "avatar creation date"),
  };
}

function parseThemes(value: unknown): Theme[] {
  if (!Array.isArray(value)) return [];
  const fields = ["primary", "secondary", "background", "surface",
    "foreground", "muted", "border", "success", "warning", "error"] as const;
  return value.map((item: unknown) => {
    if (!object(item)) throw new Error("Invalid theme in backup");
    const colors = Object.fromEntries(
      fields.map(field => [field, requiredText(item[field], field, 100)]),
    ) as Pick<Theme, typeof fields[number]>;
    return { id: requiredText(item.id, "Theme id"),
      name: requiredText(item.name, "Theme name"), ...colors,
      isCustom: item.isCustom === true, createdAt: date(item.createdAt, "theme creation date") };
  });
}

export function parseLocalBackup(content: string): LocalBackupData {
  if (!content || content.length > MAX_BACKUP_LENGTH) {
    throw new Error("Backup is empty or exceeds the 8 MiB safety limit");
  }
  let parsed: unknown;
  try { parsed = JSON.parse(content); }
  catch { throw new Error("Backup is not valid JSON"); }
  if (!object(parsed)) throw new Error("Invalid backup document");
  // Also accept the original v1.0.0 backup shape (tasks + settings).
  if (parsed.format !== LOCAL_BACKUP_FORMAT && parsed.version !== "1.0.0") {
    throw new Error("Unsupported MeTodo backup format");
  }
  if (!object(parsed.data)) throw new Error("Backup data is missing");
  const raw = parsed.data;
  const tasks = parseTasks(raw.tasks);
  if (!object(raw.settings)) throw new Error("Backup settings are missing");
  const st = raw.settings;
  const categories = parseCategories(raw.categories ?? st.categories ?? []);
  const avatar = parseAvatar(raw.avatar ?? st.avatar ?? null);
  const settings: AppSettings = {
    theme: optionalText(st.theme, "default"),
    customThemes: parseThemes(st.customThemes ?? []),
    avatar,
    categories,
    notifications: st.notifications !== false,
    darkMode: st.darkMode === "light" || st.darkMode === "dark" ? st.darkMode : "auto",
    language: optionalText(st.language, "en"),
    version: "1.0.0",
    chartAnimationSpeed: st.chartAnimationSpeed === "slow" || st.chartAnimationSpeed === "fast"
      ? st.chartAnimationSpeed : "normal",
    reduceMotion: st.reduceMotion === true,
    preferredCalendarId: typeof st.preferredCalendarId === "string" ? st.preferredCalendarId : null,
    preferredCalendarTitle: typeof st.preferredCalendarTitle === "string" ? st.preferredCalendarTitle : null,
  };
  return { tasks, categories, settings, avatar };
}

export function createLocalBackup(data: LocalBackupData): string {
  const document = JSON.stringify({
    format: LOCAL_BACKUP_FORMAT, createdAt: new Date().toISOString(), data,
  }, null, 2);
  // Validate the same format that restoration accepts.
  parseLocalBackup(document);
  return document;
}

/**
 * Crash-safe replay: write a complete valid backup journal before the first
 * key is changed; replay the whole document after a crash or failed write.
 * This does not claim to provide an ACID multi-key transaction.
 */
export class LocalBackupCoordinator {
  constructor(
    private readonly storage: LocalBackupStorage,
    private readonly stores: LocalBackupStores,
  ) {}

  private async apply(data: LocalBackupData): Promise<void> {
    await this.stores.tasks.reset(data.tasks);
    await this.stores.categories.reset(data.categories);
    await this.stores.settings.reset(data.settings);
    await this.stores.avatar.reset(data.avatar);
  }

  async restore(content: string): Promise<LocalBackupData> {
    const data = parseLocalBackup(content);
    await this.storage.setItem(RESTORE_JOURNAL_KEY, content);
    await this.apply(data);
    await this.storage.removeItem(RESTORE_JOURNAL_KEY);
    return data;
  }

  async recoverPending(): Promise<LocalBackupData | null> {
    const pending = await this.storage.getItem(RESTORE_JOURNAL_KEY);
    if (pending === null) return null;
    const data = parseLocalBackup(pending);
    await this.apply(data);
    await this.storage.removeItem(RESTORE_JOURNAL_KEY);
    return data;
  }
}
