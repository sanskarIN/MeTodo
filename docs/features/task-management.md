# Task Management Guide

## Overview

MeTodo's task management system provides a comprehensive platform for organizing, tracking, and completing tasks. Whether you're managing personal projects or daily to-do lists, MeTodo offers the tools you need.

## Creating Tasks

### Basic Task Creation

1. Navigate to the **Home** tab
2. Tap the **+ Create New Task** button
3. Enter the task title (required)
4. Add optional description
5. Set priority level (Low, Medium, High)
6. Select a category
7. Tap **Create Task**

### Task Properties

Each task can include:

| Property | Description | Required |
|----------|-------------|----------|
| Title | Main task name | Yes |
| Description | Detailed task information | No |
| Priority | Low, Medium, or High | No (defaults to Medium) |
| Category | Organize tasks by type | No |
| Due Date | Target completion date | No |
| Tags | Multiple labels for filtering | No |
| Subtasks | Break tasks into smaller items | No |
| Reminders | Notifications before due date | No |
| Recurring | Repeat patterns (daily, weekly, etc.) | No |
| Rich Notes | Formatted text with styling | No |

## Viewing & Editing Tasks

### Task Detail Screen

Access task details by:
1. Tapping a task from the task list
2. Viewing all task information
3. Editing any property
4. Marking as complete
5. Deleting if needed

### Quick Actions

- **Mark Complete:** Tap the checkbox to mark a task as done
- **Edit:** Tap the edit icon to modify task details
- **Delete:** Tap the delete button to remove the task
- **Archive:** Completed tasks can be hidden from view

## Task Organization

### Categories

MeTodo includes default categories:
- **Work** - Professional tasks and projects
- **Personal** - Personal goals and activities
- **Shopping** - Shopping lists and errands
- **Health** - Health and wellness tasks

Create custom categories in Settings to match your workflow.

### Tags

Add multiple tags to tasks for flexible filtering:
- Use tags to cross-categorize tasks
- Filter by tag from the task list
- Combine tags for advanced filtering

### Filtering & Sorting

**Filter Options:**
- By category
- By tag
- By priority
- By completion status
- By due date

**Sort Options:**
- Priority (High → Low)
- Due date (Nearest first)
- Creation date (Newest first)
- Alphabetical (A → Z)

## Advanced Features

### Subtasks

Break complex tasks into manageable steps:

1. Open task detail screen
2. Tap "Add Subtask"
3. Enter subtask title
4. Mark subtasks complete individually
5. Task completion shows subtask progress

### Recurring Tasks

Set tasks to repeat automatically:

**Recurrence Patterns:**
- Daily - Every day
- Weekly - Same day each week
- Monthly - Same date each month
- Yearly - Annual recurrence
- Custom - Define your own pattern

When a recurring task is completed, the next instance is automatically created.

### Smart Reminders

Get notified before important deadlines:

1. Open task detail
2. Add reminder time (e.g., 1 day before, 1 hour before)
3. Choose notification type (in-app or system notification)
4. Multiple reminders per task supported

### Rich Text Notes

Format task descriptions with:
- **Bold** text
- *Italic* text
- ~~Strikethrough~~
- Lists (bullet and numbered)
- Links
- Code blocks

## Task Statistics

The home screen displays:

| Stat | Description |
|------|-------------|
| Completed | Total tasks marked as done |
| Pending | Active tasks awaiting completion |
| Overdue | Tasks past their due date |

## Best Practices

### Effective Task Creation

1. **Be Specific** - Use clear, actionable titles
2. **Set Priorities** - Mark important tasks as high priority
3. **Use Categories** - Organize by project or area
4. **Add Deadlines** - Set realistic due dates
5. **Break It Down** - Use subtasks for complex projects

### Task Management Workflow

1. **Morning Review** - Check pending tasks and priorities
2. **Daily Planning** - Identify top 3 tasks for the day
3. **Progress Tracking** - Update task status throughout the day
4. **End-of-Day Review** - Complete or reschedule tasks
5. **Weekly Review** - Analyze completed tasks and plan ahead

### Productivity Tips

- Use the search feature to find tasks quickly
- Archive completed tasks to keep lists clean
- Set recurring tasks for routine activities
- Use reminders for time-sensitive items
- Review statistics to track productivity

## Troubleshooting

### Task Not Saving

- Ensure title is not empty
- Check device storage space
- Restart the app if needed

### Reminders Not Working

- Verify notifications are enabled in Settings
- Check system notification permissions
- Ensure app has notification access

### Subtasks Not Showing

- Verify subtasks were added successfully
- Check task detail screen
- Refresh the task list

## Data Storage

All tasks are stored locally on your device using AsyncStorage. This ensures:
- Complete offline functionality
- Fast access to task data
- Privacy of your information
- No cloud sync required (unless enabled in future updates)

---

**Need Help?** Check the [Getting Started Guide](../guides/getting-started.md) or [Tips & Tricks](../guides/tips-tricks.md) for more information.
