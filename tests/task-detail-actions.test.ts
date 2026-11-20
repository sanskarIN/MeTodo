import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// Guard the web/Tauri task-detail implementation against silent changes
// to the edit and delete actions. Native UI behavior is verified separately.
const source = readFileSync("app/task-detail.tsx", "utf8");

describe("task detail action reliability", () => {
  it("saves from the header checkmark instead of dismissing unsaved edits", () => {
    expect(source).toContain('accessibilityLabel={isEditing ? "Save task changes" : "Edit task"}');
    expect(source).toContain('if (isEditing) { void handleSave(); } else { startEditing(); }');
    expect(source).not.toContain("setIsEditing(!isEditing)");
    expect(source).toContain("await updateTask(next);");
    expect(source).toContain("setIsEditing(false);");
  });

  it("refuses empty titles before writing", () => {
    expect(source).toContain("const title = editedTask.title.trim();");
    expect(source).toContain('setTaskActionError("Task title cannot be empty.");');
    expect(source).toContain("const next = { ...editedTask, title, updatedAt: new Date() };");
    expect(source.indexOf('setTaskActionError("Task title cannot be empty.");')).toBeLessThan(
      source.indexOf("await updateTask(next);")
    );
  });

  it("requires an explicit in-app confirmation before any task deletion", () => {
    expect(source).toContain("setDeleteConfirmationVisible(true);");
    expect(source).toContain("visible={deleteConfirmationVisible}");
    expect(source).toContain('accessibilityLabel="Cancel task deletion"');
    expect(source).toContain('accessibilityLabel="Confirm delete task"');
    expect(source).toContain("disabled={isDeleting}");
    expect(source).toContain("if (!task || isDeleting) return;");
    expect(source).toContain("await deleteTask(task.id);");
    expect(source).toContain("onPress={() => { void confirmDelete(); }}");
    expect(source).not.toContain('Alert.alert("Delete Task"');
  });

  it("preserves task data and shows an error if deletion fails", () => {
    expect(source).toContain('setTaskActionError("Unable to delete task. Your task was not deleted; please try again.");');
    const confirmStart = source.indexOf("const confirmDelete = async () => {");
    const confirmEnd = source.indexOf("const handleToggleComplete", confirmStart);
    const handler = source.slice(confirmStart, confirmEnd);
    expect(handler.indexOf("await deleteTask(task.id);")).toBeLessThan(
      handler.indexOf("setDeleteConfirmationVisible(false);")
    );
    expect(handler.indexOf("await deleteTask(task.id);")).toBeLessThan(
      handler.indexOf("router.back();")
    );
    expect(handler).toContain("finally {");
    expect(handler).toContain("setIsDeleting(false);");
  });
});
