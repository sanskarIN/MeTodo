import { describe, expect, it, vi } from "vitest";
import { SerializedStorageState } from "../lib/serialized-storage-state";

function multiKeyStorage(seed: Record<string, string> = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: vi.fn(async (key: string): Promise<string | null> => values.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => { values.set(key, value); }),
    read: (key: string): string | undefined => values.get(key),
  };
}

describe("Local data persistence across keys", () => {
  it("serializes concurrent settings and theme writes", async () => {
    const storage = multiKeyStorage({ settings: JSON.stringify({ notifications: true, themes: [] }) });
    const state = new SerializedStorageState<{ notifications: boolean; themes: string[] }>(
      storage, "settings", { notifications: true, themes: [] },
    );
    await Promise.all([
      state.mutate(current => ({ ...current, notifications: false })),
      state.mutate(current => ({ ...current, themes: [...current.themes, "ocean"] })),
      state.mutate(current => ({ ...current, themes: [...current.themes, "forest"] })),
    ]);
    expect(await state.load()).toEqual({ notifications: false, themes: ["ocean", "forest"] });
    expect(JSON.parse(storage.read("settings")!)).toEqual(await state.load());
  });
  it("allows tasks to hydrate when categories have malformed JSON", async () => {
    const storage = multiKeyStorage({
      tasks: JSON.stringify([{ id: "one" }]), categories: "{corrupt",
      settings: JSON.stringify({ theme: "dark" }),
    });
    const tasks = new SerializedStorageState(storage, "tasks", []);
    const categories = new SerializedStorageState<Array<{ id: string }>>(storage, "categories", []);
    const settings = new SerializedStorageState(storage, "settings", {});
    await expect(categories.load()).rejects.toThrow();
    expect(await tasks.load()).toEqual([{ id: "one" }]);
    expect(await settings.load()).toEqual({ theme: "dark" });
    await categories.reset([{ id: "work" }]);
    expect(await categories.load()).toEqual([{ id: "work" }]);
  });
  it("recovers after a failed write without claiming it succeeded", async () => {
    const storage = multiKeyStorage({ settings: JSON.stringify({ mode: "auto" }) });
    const state = new SerializedStorageState(storage, "settings", { mode: "auto" });
    await state.load();
    storage.setItem.mockRejectedValueOnce(new Error("quota exceeded"));
    await expect(state.mutate(current => ({ ...current, mode: "dark" }))).rejects.toThrow("quota exceeded");
    expect(await state.load()).toEqual({ mode: "auto" });
    expect(JSON.parse(storage.read("settings")!)).toEqual({ mode: "auto" });
  });
  it("ensures a user reset and following mutation remain serialized", async () => {
    const storage = multiKeyStorage({ settings: JSON.stringify({ themes: ["old"] }) });
    const state = new SerializedStorageState(storage, "settings", { themes: [] as string[] });
    await Promise.all([
      state.reset({ themes: [] }),
      state.mutate(current => ({ themes: [...current.themes, "new"] })),
    ]);
    expect(await state.load()).toEqual({ themes: ["new"] });
  });
});
