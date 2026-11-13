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

  it("supports atomic replacement for bulk updates", async () => {
    const storage = memoryStorage(JSON.stringify([1, 2]));
    const state = new SerializedStorageState<number[]>(storage, "tasks", []);

    expect(await state.replace([5])).toEqual([5]);
    expect(storage.stored()).toBe("[5]");
  });
});
