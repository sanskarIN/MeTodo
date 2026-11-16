import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import { appendUniqueTask, replaceExistingTask, removeExistingTask } from "../lib/task-list-updates";

function task(id: string, title = "Task"): Task {
  const now = new Date("2026-11-14T05:00:00.000Z");
  return { id, title, description: "", priority: "medium", completed: false,
    category: "1", tags: [], subtasks: [], reminders: [],
    recurrence: { type: "none" }, richNotes: "", createdAt: now, updatedAt: now };
}

describe("Validated task mutations", () => {
  it("adds unique tasks without changing existing task objects", () => {
    const previous = task("one");
    const result = appendUniqueTask([previous], task("two"));
    expect(result.map(item => item.id)).toEqual(["one", "two"]);
    expect(result[0]).toBe(previous);
  });
  it("rejects duplicate ids and missing titles", () => {
    expect(() => appendUniqueTask([task("one")], task("one"))).toThrow(/already exists/);
    expect(() => appendUniqueTask([], task("one", "  "))).toThrow(/required/);
    expect(() => appendUniqueTask([], task(""))).toThrow(/required/);
  });
  it("updates exactly one existing task and rejects stale edits", () => {
    const previous = [task("one"), task("two")];
    const edited = task("one", "Edited");
    expect(replaceExistingTask(previous, edited)).toEqual([edited, previous[1]]);
    expect(() => replaceExistingTask(previous, task("other"))).toThrow(/no longer exists/);
    expect(() => replaceExistingTask(previous, task("one", ""))).toThrow(/required/);
  });
  it("deletes existing tasks but rejects obsolete deletes", () => {
    const previous = [task("one"), task("two")];
    expect(removeExistingTask(previous, "one").map(item => item.id)).toEqual(["two"]);
    expect(() => removeExistingTask(previous, "other")).toThrow(/no longer exists/);
  });
});
