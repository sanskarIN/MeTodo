import { describe, expect, it, vi } from "vitest";
import { SerializedStorageState } from "../lib/serialized-storage-state";

function memoryStorage(initial: string | null = null) {
  let value = initial;
  return {
    getItem: vi.fn(async (_key: string) => value),
    setItem: vi.fn(async (_key: string, next: string) => {
      value = next;
    }),
    stored: () => value,
  };
}

describe("SerializedStorageState", () => {
  it("hydrates before applying the first mutation", async () => {
    const storage = memoryStorage(JSON.stringify([1]));
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);

    await state.mutate((current) => [...current, 2]);
    expect(await state.load()).toEqual([1, 2]);
    expect(storage.stored()).toBe("[1,2]");
  });

  it("preserves every concurrent mutation in submission order", async () => {
    const storage = memoryStorage();
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);

    await Promise.all([
      state.mutate((current) => [...current, 1]),
      state.mutate((current) => [...current, 2]),
      state.mutate((current) => [...current, 3]),
    ]);

    expect(await state.load()).toEqual([1, 2, 3]);
    expect(storage.setItem).toHaveBeenCalledTimes(3);
  });

  it("rejects failed writes without changing the in-memory snapshot", async () => {
    const storage = memoryStorage(JSON.stringify([1]));
    storage.setItem.mockRejectedValueOnce(new Error("disk full"));
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);

    await expect(state.mutate((current) => [...current, 2])).rejects.toThrow("disk full");
    expect(await state.load()).toEqual([1]);
    await state.mutate((current) => [...current, 3]);
    expect(await state.load()).toEqual([1, 3]);
  });

  it("refuses to overwrite malformed persisted data", async () => {
    const storage = memoryStorage("{invalid");
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);

    await expect(state.mutate(() => [42])).rejects.toThrow();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("revives dates in nested persisted task fields", async () => {
    const storage = memoryStorage(JSON.stringify([
      { dueDate: "2026-11-14T09:00:00.000Z", reminders: [{ time: "2026-11-13T09:00:00.000Z" }] },
    ]));
    const dateFields = new Set(["dueDate", "time"]);
    const revive = (key: string, value: unknown) =>
      dateFields.has(key) && typeof value === "string" ? new Date(value) : value;
    const state = new SerializedStorageState<Array<{ dueDate: Date; reminders: Array<{ time: Date }> }>>(
      storage, "tasks", [], revive,
    );
    const [task] = await state.load();
    expect(task.dueDate).toBeInstanceOf(Date);
    expect(task.reminders[0].time).toBeInstanceOf(Date);
  });

  it("recovers from corrupt saved JSON only when explicitly reset", async () => {
    const storage = memoryStorage("{corrupt");
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);

    await expect(state.load()).rejects.toThrow();
    expect(storage.stored()).toBe("{corrupt");

    expect(await state.reset([])).toEqual([]);
    await state.mutate((previous) => [...previous, 1]);
    expect(await state.load()).toEqual([1]);
    expect(storage.stored()).toBe("[1]");
  });

  it("does not change the in-memory snapshot when reset write fails", async () => {
    const storage = memoryStorage(JSON.stringify([5]));
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);
    expect(await state.load()).toEqual([5]);

    storage.setItem.mockRejectedValueOnce(new Error("disk full"));
    await expect(state.reset([])).rejects.toThrow("disk full");
    expect(await state.load()).toEqual([5]);
  });

  it("supports atomic replacement for bulk updates", async () => {
    const storage = memoryStorage(JSON.stringify([1, 2]));
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);

    expect(await state.replace([5])).toEqual([5]);
    expect(storage.stored()).toBe("[5]");
  });
});
