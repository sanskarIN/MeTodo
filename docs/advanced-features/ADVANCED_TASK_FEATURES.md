# MeTodo - Advanced Task Features Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains advanced task management features in MeTodo, including recurring tasks, smart reminders, subtasks, task templates, and advanced filtering.

---

## Table of Contents

1. [Recurring Tasks](#recurring-tasks)
2. [Smart Reminders](#smart-reminders)
3. [Subtasks](#subtasks)
4. [Task Templates](#task-templates)
5. [Advanced Filtering](#advanced-filtering)
6. [Task Dependencies](#task-dependencies)
7. [Bulk Operations](#bulk-operations)

---

## Recurring Tasks

### Creating Recurring Tasks

**Simple Recurrence:**
```typescript
interface RecurringTask extends Task {
  recurrence: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    maxOccurrences?: number;
  };
}
```

**Recurrence Patterns:**
- Daily: Every day
- Weekly: Every X weeks on selected days
- Monthly: Every X months on selected date
- Yearly: Every year on selected date
- Custom: Complex patterns

### Managing Recurring Tasks

**Completing Recurring Task:**
- Mark as complete
- Next occurrence created automatically
- Completion tracked separately
- Statistics updated

**Modifying Recurring Task:**
- Edit current occurrence
- Edit this and future
- Edit all occurrences
- Delete specific occurrence

---

## Smart Reminders

### Reminder Types

**Time-Based Reminders:**
- Specific time
- X minutes before due date
- X hours before due date
- X days before due date

**Smart Reminders:**
- Based on task priority
- Based on due date urgency
- Based on user patterns
- Adaptive timing

### Reminder Configuration

```typescript
interface Reminder {
  id: string;
  taskId: string;
  type: 'time' | 'smart' | 'location';
  time?: Date;
  offset?: number; // minutes before
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  notification: boolean;
}
```

### Quiet Hours

**Configure Quiet Hours:**
- No reminders during quiet hours
- Except for critical tasks
- Customizable per day
- Override option

---

## Subtasks

### Creating Subtasks

**Add Subtask:**
```typescript
interface Subtask {
  id: string;
  parentTaskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date;
  completedAt?: Date;
}
```

**Subtask Features:**
- Unlimited subtasks
- Nested subtasks (up to 3 levels)
- Drag-to-reorder
- Bulk operations
- Progress tracking

### Subtask Progress

**Automatic Calculation:**
- Completion percentage
- Estimated time
- Dependency tracking
- Progress visualization

---

## Task Templates

### Creating Templates

**Template Structure:**
```typescript
interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultPriority: Priority;
  defaultCategory: string;
  defaultTags: string[];
  subtasks: TemplateSubtask[];
  estimatedTime: number;
  notes: string;
}
```

### Using Templates

**Create from Template:**
1. Select template
2. Customize if needed
3. Create task
4. All subtasks added
5. Reminders configured

**Common Templates:**
- Daily standup
- Weekly review
- Project kickoff
- Bug report
- Feature request

---

## Advanced Filtering

### Filter Criteria

**Available Filters:**
- Status: Pending, Completed, Overdue
- Priority: Critical, High, Medium, Low
- Category: Custom categories
- Tags: Multiple tags
- Date range: Custom dates
- Time estimate: Duration range
- Assigned to: User assignment
- Recurring: Yes/No

### Saved Filters

**Create Saved Filter:**
1. Set filter criteria
2. Name the filter
3. Save for later
4. Quick access from home

**Smart Filters:**
- Today's tasks
- This week's tasks
- Overdue tasks
- High priority tasks
- My favorites
- Recently modified

---

## Task Dependencies

### Dependency Types

**Blocking Dependencies:**
- Task A must complete before Task B
- Prevents starting dependent task
- Shows dependency chain

**Related Tasks:**
- Task A related to Task B
- No blocking
- For reference
- Linked for context

### Dependency Visualization

**Dependency Chain:**
- Visual representation
- Shows blocking tasks
- Shows dependent tasks
- Highlights critical path

---

## Bulk Operations

### Batch Actions

**Available Operations:**
- Mark as complete
- Delete multiple
- Change priority
- Add tags
- Change category
- Move to folder
- Set reminder

### Bulk Selection

**Select Multiple:**
1. Long-press first task
2. Tap additional tasks
3. Tap action button
4. Confirm action

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
