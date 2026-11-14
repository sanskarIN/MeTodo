import { describe, expect, it, vi } from "vitest";
import { LocalBackupCoordinator, RESTORE_JOURNAL_KEY, createLocalBackup,
  parseLocalBackup } from "../lib/local-backup";
import { SerializedStorageState } from "../lib/serialized-storage-state";
import type { Task, Category, AppSettings } from "../types";

const now = new Date("2026-11-14T05:00:00.000Z");
function fakeTask(id = "t1"): Task {
  return { id, title: "Buy groceries", description: "Milk", completed: false, priority: "high",
    category: "work", tags: ["home"], createdAt: now, updatedAt: now,
    dueDate: now, richNotes: "", recurrence: { type: "none" },
    subtasks: [{ id: "sub", title: "List", completed: false, createdAt: now }],
    reminders: [{ id: "rem", time: now, type: "notification" }] };
}
const category: Category = { id: "work", name: "Work", icon: "briefcase", color: "#333333" };
const settings: AppSettings = { theme: "default", customThemes: [], avatar: null,
  categories: [category], notifications: true, darkMode: "auto", language: "en",
  version: "1.0.0", chartAnimationSpeed: "normal", reduceMotion: false,
  preferredCalendarId: null, preferredCalendarTitle: null };
const sample = { tasks: [fakeTask()], categories: [category], settings, avatar: null };
function storage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn(async (key: string): Promise<string | null> => values.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => { values.set(key, value); }),
    removeItem: vi.fn(async (key: string) => { values.delete(key); }),
    raw: (key: string) => values.get(key),
  };
}
function coordinator(s: ReturnType<typeof storage>) {
  return new LocalBackupCoordinator(s, {
    tasks: new SerializedStorageState<Task[]>(s, "metodo_tasks", []),
    categories: new SerializedStorageState<Category[]>(s, "metodo_categories", []),
    settings: new SerializedStorageState<AppSettings>(s, "metodo_settings", settings),
    avatar: new SerializedStorageState<import("../types").AvatarCustomization | null>(s, "metodo_avatar", null),
  });
}

describe("Local backups", () => {
  it("round trips tasks and nested dates without losing other settings", () => {
    const result = parseLocalBackup(createLocalBackup(sample));
    expect(result).toEqual(sample);
    expect(result.tasks[0].dueDate).toBeInstanceOf(Date);
    expect(result.tasks[0].reminders[0].time).toBeInstanceOf(Date);
    expect(result.tasks[0].subtasks[0].createdAt).toBeInstanceOf(Date);
  });

  it("rejects malformed backups, duplicate IDs and non-task data", () => {
    expect(() => parseLocalBackup("not-json")).toThrow(/JSON/);
    expect(() => parseLocalBackup(JSON.stringify({ format: "unknown", data: sample }))).toThrow(/Unsupported/);
    expect(() => createLocalBackup({ ...sample, tasks: [fakeTask(), fakeTask()] })).toThrow(/Duplicate/);
    expect(() => parseLocalBackup(JSON.stringify({ format: "metodo.local.v1", data: { ...sample, tasks: "bad" } })))
      .toThrow(/array/);
  });


  it("exports the latest persisted state rather than a stale React snapshot", async () => {
    const s = storage();
    const c = coordinator(s);
    await c.restore(createLocalBackup(sample));
    const saved = await c.exportCurrent();
    expect(parseLocalBackup(saved).tasks[0].title).toBe("Buy groceries");
    expect(parseLocalBackup(saved).settings.theme).toBe("default");
  });

  it("refuses to export corrupt persisted data instead of producing an empty backup", async () => {
    const s = storage();
    await s.setItem("metodo_tasks", "{bad-json");
    const c = coordinator(s);
    await expect(c.exportCurrent()).rejects.toThrow();
    expect(s.raw("metodo_tasks")).toBe("{bad-json");
  });

  it("restores all four keys and clears the recovery journal", async () => {
    const s = storage();
    const c = coordinator(s);
    expect(await c.restore(createLocalBackup(sample))).toEqual(sample);
    expect(s.raw(RESTORE_JOURNAL_KEY)).toBeUndefined();
    expect(JSON.parse(s.raw("metodo_tasks")!)[0].title).toBe("Buy groceries");
    expect(JSON.parse(s.raw("metodo_settings")!).notifications).toBe(true);
  });

  it("replays interrupted restore after restarting without losing the backup", async () => {
    const s = storage();
    s.setItem.mockRejectedValueOnce(new Error("disk full"));
    const text = createLocalBackup(sample);
    // If the journal itself cannot be written, nothing is modified.
    await expect(coordinator(s).restore(text)).rejects.toThrow("disk full");
    expect(s.raw(RESTORE_JOURNAL_KEY)).toBeUndefined();

    const c = coordinator(s);
    const originalSet = s.setItem.getMockImplementation()!;
    s.setItem.mockImplementationOnce(async (key, value) => {
      await originalSet(key, value);
    });
    // Journal succeeds, but the first data key fails.
    s.setItem.mockImplementationOnce(async () => { throw new Error("disk full"); });
    await expect(c.restore(text)).rejects.toThrow("disk full");
    expect(s.raw(RESTORE_JOURNAL_KEY)).toBe(text);
    const fresh = coordinator(s);
    expect(await fresh.recoverPending()).toEqual(sample);
    expect(s.raw(RESTORE_JOURNAL_KEY)).toBeUndefined();
    expect(JSON.parse(s.raw("metodo_tasks")!)).toHaveLength(1);
    expect(await fresh.recoverPending()).toBeNull();
  });

  it("reads legacy task/settings backup without inventing new data", () => {
    const legacy = JSON.stringify({ version: "1.0.0",
      backupDate: now.toISOString(), data: { tasks: [fakeTask()], settings } });
    const parsed = parseLocalBackup(legacy);
    expect(parsed.tasks[0].createdAt).toBeInstanceOf(Date);
    expect(parsed.categories).toEqual([category]);
    expect(parsed.avatar).toBeNull();
  });

  it("never modifies storage when the backup fails validation", async () => {
    const s = storage();
    await expect(coordinator(s).restore("{invalid")).rejects.toThrow(/JSON/);
    expect(s.setItem).not.toHaveBeenCalled();
  });
});
