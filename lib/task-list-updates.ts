import type { Task } from "@/types";

/** Pure validated mutations prevent stale UI actions from appearing successful. */
export function appendUniqueTask(current: Task[], task: Task): Task[] {
  if (!task.id?.trim() || !task.title?.trim()) {
    throw new Error("Task id and title are required");
  }
  if (current.some(existing => existing.id === task.id)) {
    throw new Error("A task with that id already exists");
  }
  return [...current, task];
}

export function replaceExistingTask(current: Task[], task: Task): Task[] {
  if (!task.id?.trim() || !task.title?.trim()) {
    throw new Error("Task id and title are required");
  }
  if (!current.some(existing => existing.id === task.id)) {
    throw new Error("Cannot update a task that no longer exists");
  }
  return current.map(existing => existing.id === task.id ? task : existing);
}

export function removeExistingTask(current: Task[], id: string): Task[] {
  if (!current.some(task => task.id === id)) {
    throw new Error("Cannot delete a task that no longer exists");
  }
  return current.filter(task => task.id !== id);
}
