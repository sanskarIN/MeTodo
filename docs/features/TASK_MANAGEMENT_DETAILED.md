# MeTodo - Task Management - Comprehensive Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This document provides comprehensive, in-depth documentation for the Task Management feature of MeTodo. It covers every aspect of task creation, management, organization, and optimization.

---

## Table of Contents

1. [Overview](#overview)
2. [Task Creation](#task-creation)
3. [Task Properties](#task-properties)
4. [Task Editing](#task-editing)
5. [Task Completion](#task-completion)
6. [Task Deletion](#task-deletion)
7. [Subtasks](#subtasks)
8. [Recurring Tasks](#recurring-tasks)
9. [Task Reminders](#task-reminders)
10. [Categories and Tags](#categories-and-tags)
11. [Task Filtering](#task-filtering)
12. [Task Sorting](#task-sorting)
13. [Task Search](#task-search)
14. [Task Notes](#task-notes)
15. [Task Statistics](#task-statistics)
16. [Best Practices](#best-practices)
17. [Advanced Features](#advanced-features)
18. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Task Management?

Task Management in MeTodo is a comprehensive system for organizing, tracking, and completing your daily tasks. It provides tools for:

- Creating and managing individual tasks
- Organizing tasks into categories
- Setting priorities and due dates
- Breaking down complex tasks into subtasks
- Setting up recurring patterns for repetitive tasks
- Creating reminders for important deadlines
- Adding detailed notes and descriptions
- Filtering and searching tasks
- Tracking task completion statistics

### Core Principles

**1. Simplicity**
- Easy-to-use interface for quick task creation
- Minimal clicks to complete common actions
- Intuitive navigation and organization

**2. Flexibility**
- Support for various task types
- Multiple organization methods
- Customizable workflows

**3. Offline-First**
- All tasks stored locally on device
- No internet connection required
- Complete data ownership

**4. Persistence**
- All changes saved automatically
- No data loss on app restart
- Backup and restore capabilities

---

## Task Creation

### Creating Your First Task

#### Method 1: From Home Screen

1. **Open MeTodo** - Launch the app
2. **Tap "Create New Task"** - Large button on home screen
3. **Enter Task Title** - Required field (max 200 characters)
4. **Add Description** (Optional) - Detailed task information
5. **Set Priority** (Optional) - Low, Medium, or High
6. **Choose Category** (Optional) - Organize by project or area
7. **Set Due Date** (Optional) - When task should be completed
8. **Add Tags** (Optional) - Multiple tags for flexible organization
9. **Tap "Create Task"** - Save and return to home screen

#### Method 2: From Tasks Tab

1. **Go to Tasks Tab** - View all tasks
2. **Tap "+" Button** - Top right corner
3. **Fill in Task Details** - Same as Method 1
4. **Tap "Create Task"** - Save task

#### Method 3: Quick Add (Keyboard Shortcut)

**Web Version:**
- Press `Ctrl+N` to open quick add dialog
- Enter task title
- Press Enter to create

**Mobile Version:**
- Swipe up from bottom to open quick add
- Enter task title
- Tap Create

### Task Creation Form Fields

#### Title (Required)

```
Field: Title
Type: Text input
Max Length: 200 characters
Placeholder: "Enter task title..."
Validation: Cannot be empty
Example: "Complete project report"
```

**Guidelines:**
- Be specific and descriptive
- Use action verbs (Complete, Prepare, Review, etc.)
- Keep concise but clear
- Avoid generic titles like "Work" or "Do something"

#### Description (Optional)

```
Field: Description
Type: Text area
Max Length: 2000 characters
Placeholder: "Add task details..."
Validation: None
Example: "Prepare quarterly report with Q3 metrics and analysis"
```

**Guidelines:**
- Provide context and background
- Include specific requirements
- Add any relevant information
- Use clear, organized formatting

#### Priority (Optional)

```
Field: Priority
Type: Dropdown selection
Options: Low, Medium, High
Default: Medium
```

**Priority Levels:**

| Level | Color | Usage |
|-------|-------|-------|
| Low | Green | Non-urgent tasks, can wait |
| Medium | Orange | Normal priority (default) |
| High | Red | Important, needs attention soon |

**When to Use:**
- **Low:** Reading articles, learning new skills, optional tasks
- **Medium:** Regular work tasks, standard deadlines
- **High:** Critical deadlines, urgent issues, important projects

#### Category (Optional)

```
Field: Category
Type: Dropdown selection
Options: All created categories
Default: None (Uncategorized)
```

**Default Categories:**
- Work - Professional tasks
- Personal - Personal goals
- Shopping - Shopping lists
- Health - Health and wellness
- Other - Miscellaneous

**Creating Custom Categories:**
1. Go to Settings
2. Tap "Manage Categories"
3. Add new category with name and color
4. Use immediately in task creation

#### Due Date (Optional)

```
Field: Due Date
Type: Date picker
Format: MM/DD/YYYY
Default: None (No due date)
```

**How to Set:**
1. Tap "Due Date" field
2. Calendar appears
3. Select date by tapping
4. Confirm selection

**Date Options:**
- Today - Due today
- Tomorrow - Due tomorrow
- Next Week - Due in 7 days
- Next Month - Due in 30 days
- Custom - Pick specific date

#### Tags (Optional)

```
Field: Tags
Type: Multi-select
Max Tags: 10 per task
Options: Existing tags or create new
```

**Adding Tags:**
1. Tap "Add Tags" field
2. Select from existing tags
3. Or type to create new tag
4. Multiple selections allowed
5. Remove tag by tapping X

**Tag Examples:**
- urgent
- review
- important
- follow-up
- waiting-for

#### Notes (Optional)

```
Field: Notes
Type: Rich text editor
Max Length: 5000 characters
Formatting: Bold, Italic, Lists
```

**Supported Formatting:**
- **Bold** - Highlight important text
- *Italic* - Emphasize text
- Lists - Organize information
- Links - Add references

---

## Task Properties

### Complete Task Structure

```typescript
interface Task {
  // Unique Identifiers
  id: string;                          // UUID
  createdAt: Date;                     // Creation timestamp
  updatedAt: Date;                     // Last modification
  
  // Basic Information
  title: string;                       // Task title (required)
  description?: string;                // Detailed description
  
  // Status & Priority
  completed: boolean;                  // Completion status
  priority: 'low' | 'medium' | 'high'; // Priority level
  
  // Organization
  category?: string;                   // Category ID
  tags?: string[];                     // Tag IDs array
  
  // Timing
  dueDate?: Date;                      // Due date
  recurring?: RecurringPattern;        // Recurrence info
  
  // Details
  subtasks?: Subtask[];                // Subtasks array
  reminders?: Reminder[];              // Reminders array
  notes?: string;                      // Rich text notes
  
  // Metadata
  completedAt?: Date;                  // Completion timestamp
  estimatedTime?: number;              // Estimated minutes
  actualTime?: number;                 // Actual time spent
}
```

### Task States

**1. Active (Pending)**
- Not completed
- May or may not have due date
- Appears in task lists
- Can be edited or deleted

**2. Completed**
- Marked as complete
- Moved to completed section
- Can be uncompleted
- Completion timestamp recorded

**3. Overdue**
- Due date has passed
- Not yet completed
- Highlighted in red
- Requires attention

**4. Archived**
- Old completed tasks
- Hidden from main view
- Can be restored
- Kept for history

---

## Task Editing

### Editing an Existing Task

#### Method 1: From Task List

1. **Find Task** - Locate in task list
2. **Tap Task** - Opens task detail view
3. **Tap "Edit"** - Opens edit mode
4. **Modify Fields** - Change any task property
5. **Tap "Save"** - Save changes

#### Method 2: From Task Detail

1. **Open Task** - From any location
2. **Tap "Edit" Button** - Top right corner
3. **Update Information** - Modify as needed
4. **Tap "Save Changes"** - Confirm changes

### Editable Fields

| Field | Editable | Notes |
|-------|----------|-------|
| Title | ✅ Yes | Can be changed anytime |
| Description | ✅ Yes | Can be expanded or reduced |
| Priority | ✅ Yes | Change importance level |
| Category | ✅ Yes | Move to different category |
| Due Date | ✅ Yes | Extend or move deadline |
| Tags | ✅ Yes | Add or remove tags |
| Notes | ✅ Yes | Update or expand notes |
| Subtasks | ✅ Yes | Add, edit, or remove |
| Reminders | ✅ Yes | Add, modify, or delete |

### Non-Editable Fields

| Field | Reason |
|-------|--------|
| Task ID | Unique identifier |
| Created At | Historical record |
| Updated At | Automatically updated |
| Completed At | Automatically set |

### Bulk Editing

**Edit Multiple Tasks:**
1. Go to Tasks tab
2. Tap "Select Multiple" mode
3. Check tasks to edit
4. Tap "Edit Selected"
5. Choose field to modify
6. Apply to all selected

**Bulk Edit Options:**
- Change priority for multiple tasks
- Move tasks to different category
- Add tags to multiple tasks
- Set due date for group
- Delete multiple tasks

---

## Task Completion

### Marking Tasks Complete

#### Method 1: From Task List

1. **Find Task** - Locate in list
2. **Tap Checkbox** - Left side of task
3. **Task Marked Complete** - Moves to completed section
4. **Completion Recorded** - Timestamp saved

#### Method 2: From Task Detail

1. **Open Task** - Tap to view details
2. **Tap "Mark Complete"** - Button at bottom
3. **Confirm Action** - Optional confirmation
4. **Task Completed** - Status updated

#### Method 3: Swipe Action

1. **Find Task** - In task list
2. **Swipe Right** - Gesture on task
3. **Task Marked Complete** - Automatic action
4. **Undo Available** - Swipe left to undo

### Completion Statistics

**Track Your Progress:**
- Daily completion count
- Weekly completion rate
- Monthly completion goals
- Category-wise completion
- Time-based analytics

**View Statistics:**
1. Go to Home screen
2. See statistics at top
3. Tap for detailed breakdown
4. View charts and graphs

### Uncompleting Tasks

**If You Need to Undo Completion:**

1. **Find Completed Task** - In completed section
2. **Tap Task** - Open detail view
3. **Tap "Mark Incomplete"** - Revert to pending
4. **Task Restored** - Back to active tasks

---

## Task Deletion

### Deleting a Task

#### Method 1: From Task List

1. **Find Task** - Locate in list
2. **Swipe Left** - Gesture on task
3. **Tap Delete** - Confirm deletion
4. **Task Removed** - Permanently deleted

#### Method 2: From Task Detail

1. **Open Task** - Tap to view
2. **Tap Menu** - Three dots (⋮)
3. **Select "Delete"** - From menu
4. **Confirm** - Verify deletion
5. **Task Removed** - Permanently deleted

#### Method 3: Long Press

1. **Find Task** - In list
2. **Long Press** - Hold on task
3. **Tap Delete** - From context menu
4. **Confirm** - Verify deletion

### Delete Confirmation

**Confirmation Dialog:**
```
Are you sure you want to delete this task?

"Complete project report"

This action cannot be undone.

[Cancel] [Delete]
```

**Warning:** Deletion is permanent and cannot be undone.

### Undo Deletion

**Undo Recent Deletion:**
1. Tap "Undo" notification (appears briefly)
2. Task is restored
3. All properties preserved

**Note:** Undo only available for ~5 seconds after deletion.

### Bulk Deletion

**Delete Multiple Tasks:**
1. Go to Tasks tab
2. Tap "Select Multiple"
3. Check tasks to delete
4. Tap "Delete Selected"
5. Confirm deletion
6. All selected tasks removed

---

## Subtasks

### Understanding Subtasks

Subtasks are smaller, related tasks that break down a larger task into manageable steps.

**Example:**
```
Main Task: "Complete Project Report"
├── Subtask 1: "Gather Q3 data"
├── Subtask 2: "Analyze metrics"
├── Subtask 3: "Write summary"
└── Subtask 4: "Review and proofread"
```

### Creating Subtasks

#### Method 1: During Task Creation

1. **Create Main Task** - Fill in basic details
2. **Tap "Add Subtask"** - Below main fields
3. **Enter Subtask Title** - Required
4. **Tap Add** - Add to list
5. **Repeat** - Add more subtasks
6. **Save Task** - Main task with subtasks

#### Method 2: Edit Existing Task

1. **Open Task** - Tap to view
2. **Tap "Edit"** - Enter edit mode
3. **Scroll to Subtasks** - Section below
4. **Tap "Add Subtask"** - New subtask field
5. **Enter Title** - Subtask name
6. **Tap Add** - Add to list
7. **Save Changes** - Update task

### Subtask Management

#### Completing Subtasks

1. **Open Task** - View task details
2. **Find Subtask** - In subtasks list
3. **Tap Checkbox** - Mark complete
4. **Subtask Marked** - Shows as done
5. **Progress Updated** - Main task progress increases

#### Editing Subtasks

1. **Open Task** - View details
2. **Tap Subtask** - Select to edit
3. **Modify Title** - Change name
4. **Tap Save** - Update subtask
5. **Changes Saved** - Reflected immediately

#### Deleting Subtasks

1. **Open Task** - View details
2. **Find Subtask** - In list
3. **Tap Delete** - Remove button
4. **Confirm** - Verify deletion
5. **Subtask Removed** - Deleted from task

### Subtask Progress

**Progress Tracking:**
- Shows completion percentage
- Example: "2 of 4 subtasks complete (50%)"
- Visual progress bar
- Updates in real-time

**Progress Calculation:**
```
Progress = (Completed Subtasks / Total Subtasks) × 100%

Example:
- Total Subtasks: 4
- Completed: 2
- Progress: (2/4) × 100 = 50%
```

### Subtask Ordering

**Reorder Subtasks:**
1. Open task detail
2. Long press subtask
3. Drag to new position
4. Release to drop
5. Order saved

**Automatic Ordering:**
- Completed subtasks move to bottom
- Pending subtasks stay on top
- Can be manually reordered

---

## Recurring Tasks

### Understanding Recurring Tasks

Recurring tasks automatically repeat on a schedule, perfect for:
- Daily habits (exercise, meditation)
- Weekly meetings (team standup)
- Monthly bills (rent, utilities)
- Yearly events (birthdays, anniversaries)

### Setting Up Recurrence

#### Method 1: During Task Creation

1. **Create Task** - Fill in basic details
2. **Tap "Make Recurring"** - Below due date
3. **Choose Frequency:**
   - Daily
   - Weekly
   - Monthly
   - Yearly
   - Custom
4. **Set Interval** - Every 1, 2, 3... days/weeks/months
5. **Configure Options** - See below
6. **Save Task** - Recurring task created

#### Method 2: Edit Existing Task

1. **Open Task** - View details
2. **Tap "Edit"** - Enter edit mode
3. **Scroll to Recurrence** - Section below
4. **Tap "Add Recurrence"** - Enable recurring
5. **Configure Pattern** - Set frequency and options
6. **Save Changes** - Update task

### Recurrence Patterns

#### Daily Recurrence

```
Pattern: Daily
Interval: Every 1 day (or more)
Example: Every day at 9:00 AM

Configuration:
- Frequency: Daily
- Interval: 1 (every day)
- Time: 9:00 AM
- End Date: Optional
```

**Use Cases:**
- Morning exercise
- Daily standup meetings
- Medication reminders
- Habit tracking

#### Weekly Recurrence

```
Pattern: Weekly
Interval: Every 1 week (or more)
Days: Select specific days

Configuration:
- Frequency: Weekly
- Interval: 1 (every week)
- Days: Mon, Wed, Fri
- Time: 10:00 AM
- End Date: Optional
```

**Use Cases:**
- Weekly team meetings
- Gym sessions
- Laundry day
- Weekly review

#### Monthly Recurrence

```
Pattern: Monthly
Interval: Every 1 month (or more)
Day: Specific day of month

Configuration:
- Frequency: Monthly
- Interval: 1 (every month)
- Day: 15th of month
- Time: 2:00 PM
- End Date: Optional
```

**Use Cases:**
- Monthly bills
- Performance reviews
- Project reviews
- Monthly reports

#### Yearly Recurrence

```
Pattern: Yearly
Interval: Every 1 year (or more)
Date: Specific month and day

Configuration:
- Frequency: Yearly
- Interval: 1 (every year)
- Date: June 15
- Time: 10:00 AM
- End Date: Optional
```

**Use Cases:**
- Birthdays
- Anniversaries
- Annual reviews
- Yearly events

#### Custom Recurrence

```
Pattern: Custom
Interval: Flexible configuration
Options: Complex patterns

Example: Every 2 weeks on Monday and Wednesday
- Frequency: Weekly
- Interval: 2
- Days: Mon, Wed
```

### Recurrence Configuration

#### End Date

**Set When Recurrence Stops:**
1. Tap "End Date" field
2. Select date from calendar
3. Recurrence ends on that date
4. No more instances created

**Options:**
- No end date (infinite)
- End on specific date
- End after X occurrences

#### Maximum Occurrences

**Limit Number of Instances:**
1. Tap "Max Occurrences"
2. Enter number
3. Recurrence stops after that many
4. Example: 12 occurrences = 12 months

#### Skip Weekends

**Automatically Skip Weekends:**
1. Enable "Skip Weekends" toggle
2. Weekdays only for recurrence
3. Useful for work tasks

#### Skip Holidays

**Automatically Skip Holidays:**
1. Enable "Skip Holidays" toggle
2. Holidays automatically skipped
3. Configure holiday list in settings

### Managing Recurring Tasks

#### Completing an Instance

1. **Find Task Instance** - In task list
2. **Mark Complete** - Tap checkbox
3. **Next Instance Created** - Automatically
4. **Original Preserved** - Pattern continues

#### Editing Recurring Tasks

**Edit Single Instance:**
1. Open specific instance
2. Tap "Edit This Instance"
3. Modify details
4. Save changes
5. Only this instance affected

**Edit All Instances:**
1. Open recurring task
2. Tap "Edit Series"
3. Modify pattern
4. Save changes
5. All instances updated

#### Deleting Recurring Tasks

**Delete Single Instance:**
1. Open instance
2. Tap "Delete"
3. Only this instance removed
4. Series continues

**Delete Entire Series:**
1. Open recurring task
2. Tap "Delete Series"
3. Confirm deletion
4. All instances removed

---

## Task Reminders

### Understanding Reminders

Reminders notify you about upcoming tasks at specified times.

**Reminder Types:**
- Notification - App notification
- Email - Email reminder
- SMS - Text message (if enabled)

### Setting Reminders

#### Method 1: During Task Creation

1. **Create Task** - Fill in basic details
2. **Tap "Add Reminder"** - Below due date
3. **Choose Time Before Due:**
   - 5 minutes
   - 15 minutes
   - 1 hour
   - 1 day
   - Custom
4. **Select Reminder Type** - Notification, Email, SMS
5. **Enable Reminder** - Toggle on
6. **Save Task** - Reminder set

#### Method 2: Edit Existing Task

1. **Open Task** - View details
2. **Tap "Edit"** - Enter edit mode
3. **Scroll to Reminders** - Section below
4. **Tap "Add Reminder"** - New reminder
5. **Configure Details** - Time and type
6. **Save Changes** - Reminder added

### Reminder Timing

**Pre-Due Reminders:**

| Timing | Use Case |
|--------|----------|
| 5 minutes | Quick tasks, immediate action |
| 15 minutes | Short prep time needed |
| 1 hour | Moderate prep time |
| 1 day | Major tasks, planning needed |
| 2 days | Complex tasks, research needed |
| 1 week | Long-term projects, planning |
| Custom | Any specific time |

**Custom Reminder Times:**
1. Tap "Custom" option
2. Enter specific time
3. Example: "3 days before"
4. Set exact time if needed

### Multiple Reminders

**Add Multiple Reminders to One Task:**
1. Open task
2. Tap "Add Reminder"
3. Set first reminder (e.g., 1 day before)
4. Tap "Add Another"
5. Set second reminder (e.g., 1 hour before)
6. Can add up to 5 reminders per task

**Example Multi-Reminder Setup:**
```
Task: "Project Deadline"
├── Reminder 1: 1 week before (planning)
├── Reminder 2: 3 days before (preparation)
├── Reminder 3: 1 day before (final review)
└── Reminder 4: 1 hour before (last check)
```

### Managing Reminders

#### Editing Reminders

1. **Open Task** - View details
2. **Find Reminder** - In reminders list
3. **Tap to Edit** - Modify reminder
4. **Change Time** - Adjust timing
5. **Save Changes** - Update reminder

#### Disabling Reminders

1. **Open Task** - View details
2. **Find Reminder** - In list
3. **Toggle Off** - Disable reminder
4. **Reminder Disabled** - Won't notify

#### Deleting Reminders

1. **Open Task** - View details
2. **Find Reminder** - In list
3. **Tap Delete** - Remove reminder
4. **Confirm** - Verify deletion
5. **Reminder Removed** - Deleted

### Notification Settings

**Configure Notification Behavior:**
1. Go to Settings
2. Tap "Notifications"
3. Enable/disable notifications
4. Set notification sound
5. Enable vibration
6. Set quiet hours (optional)

**Notification Preferences:**
- Sound: On/Off
- Vibration: On/Off
- LED: On/Off
- Quiet Hours: Specify time range
- Do Not Disturb: Integration

---

## Categories and Tags

### Understanding Categories

Categories organize tasks by project, area, or type.

**Default Categories:**
- Work - Professional tasks
- Personal - Personal goals
- Shopping - Shopping lists
- Health - Health and wellness

**Benefits:**
- Visual organization
- Easy filtering
- Quick navigation
- Better overview

### Creating Categories

#### Method 1: From Settings

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Categories"** - In task section
3. **Tap "Add Category"** - New category button
4. **Enter Name** - Category name
5. **Choose Color** - Pick from palette
6. **Save Category** - Category created

#### Method 2: During Task Creation

1. **Create Task** - Fill in basic details
2. **Tap Category Field** - Dropdown
3. **Tap "Create New"** - At bottom
4. **Enter Name** - Category name
5. **Choose Color** - Pick color
6. **Save** - Category created and assigned

### Category Properties

```
Category {
  id: string;              // Unique identifier
  name: string;            // Category name
  color: string;           // Hex color code
  icon?: string;           // Optional icon
  taskCount: number;       // Number of tasks
  createdAt: Date;         // Creation date
}
```

### Managing Categories

#### Editing Categories

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Categories"** - In task section
3. **Find Category** - In list
4. **Tap to Edit** - Open edit dialog
5. **Change Name/Color** - Modify details
6. **Save Changes** - Update category

#### Deleting Categories

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Categories"** - In task section
3. **Find Category** - In list
4. **Swipe Left** - Delete gesture
5. **Confirm Deletion** - Verify action
6. **Category Deleted** - Removed from system

**Note:** Tasks in deleted category become uncategorized.

#### Merging Categories

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Categories"** - In task section
3. **Select Source Category** - To merge from
4. **Tap "Merge"** - Merge option
5. **Select Target Category** - Merge to
6. **Confirm** - All tasks moved

### Understanding Tags

Tags provide flexible, cross-cutting organization.

**Differences from Categories:**
- Multiple tags per task
- Not hierarchical
- More flexible
- Better for cross-project organization

**Tag Examples:**
- urgent
- review
- important
- follow-up
- waiting-for
- blocked
- research

### Creating Tags

#### Method 1: During Task Creation

1. **Create Task** - Fill in basic details
2. **Tap "Add Tags"** - Below category
3. **Type Tag Name** - Or select existing
4. **Tap Add** - Add to task
5. **Repeat** - Add more tags
6. **Save Task** - Tags saved

#### Method 2: From Tag Manager

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Tags"** - In task section
3. **Tap "Add Tag"** - New tag button
4. **Enter Name** - Tag name
5. **Choose Color** - Pick color
6. **Save Tag** - Tag created

### Managing Tags

#### Editing Tags

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Tags"** - In task section
3. **Find Tag** - In list
4. **Tap to Edit** - Open edit dialog
5. **Change Name/Color** - Modify details
6. **Save Changes** - Update tag

#### Deleting Tags

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Tags"** - In task section
3. **Find Tag** - In list
4. **Swipe Left** - Delete gesture
5. **Confirm Deletion** - Verify action
6. **Tag Deleted** - Removed from system

**Note:** Tag removed from all tasks.

#### Merging Tags

1. **Go to Settings** - Bottom tab
2. **Tap "Manage Tags"** - In task section
3. **Select Source Tag** - To merge from
4. **Tap "Merge"** - Merge option
5. **Select Target Tag** - Merge to
6. **Confirm** - All tasks updated

---

## Task Filtering

### Understanding Filters

Filters help you view specific subsets of tasks based on criteria.

**Filter Types:**
- By Category
- By Priority
- By Status (Complete/Pending)
- By Due Date
- By Tags
- By Combination

### Applying Filters

#### Method 1: From Tasks Tab

1. **Go to Tasks** - Tab at bottom
2. **Tap Filter Icon** - Top right corner
3. **Select Criteria** - Choose filters
4. **Apply** - View filtered results

#### Method 2: Quick Filters

1. **Go to Tasks** - Tab at bottom
2. **Tap Quick Filter** - Predefined options
3. **Options:**
   - All Tasks
   - Active (Pending)
   - Completed
   - Overdue
   - Today
   - This Week
   - This Month

#### Method 3: Advanced Filters

1. **Go to Tasks** - Tab at bottom
2. **Tap "Advanced"** - Filter button
3. **Multiple Criteria** - Combine filters
4. **Set Conditions** - AND/OR logic
5. **Apply** - View results

### Filter Options

#### By Category

**Filter by Single Category:**
1. Open filter dialog
2. Tap "Category"
3. Select category
4. Apply filter

**Filter by Multiple Categories:**
1. Open advanced filter
2. Tap "Category"
3. Select multiple categories
4. Set logic: "Any" or "All"
5. Apply filter

#### By Priority

**Filter by Priority Level:**
1. Open filter dialog
2. Tap "Priority"
3. Select: Low, Medium, High
4. Can select multiple
5. Apply filter

#### By Status

**Filter by Completion Status:**
1. Open filter dialog
2. Tap "Status"
3. Options:
   - All
   - Pending (Not Complete)
   - Completed
4. Select option
5. Apply filter

#### By Due Date

**Filter by Due Date Range:**
1. Open advanced filter
2. Tap "Due Date"
3. Select range:
   - Overdue
   - Today
   - Tomorrow
   - This Week
   - This Month
   - Custom Range
4. Apply filter

#### By Tags

**Filter by Tags:**
1. Open filter dialog
2. Tap "Tags"
3. Select tags
4. Set logic: "Any" or "All"
5. Apply filter

### Saved Filters

**Save Custom Filters:**
1. Create filter with criteria
2. Tap "Save Filter"
3. Enter filter name
4. Save

**Using Saved Filters:**
1. Tap "Saved Filters"
2. Select filter
3. Automatically applied

**Managing Saved Filters:**
1. Tap "Manage Filters"
2. Edit or delete filters
3. Reorder filters

---

## Task Sorting

### Understanding Sorting

Sorting arranges tasks in a specific order.

**Sort Options:**
- By Priority (High to Low)
- By Due Date (Earliest First)
- By Created Date (Newest First)
- By Alphabetical (A-Z)
- By Completion (Pending First)

### Applying Sorts

#### Method 1: From Tasks Tab

1. **Go to Tasks** - Tab at bottom
2. **Tap Sort Icon** - Top right corner
3. **Select Sort Option** - Choose order
4. **Applied Immediately** - Tasks reordered

#### Method 2: Settings Default

1. **Go to Settings** - Bottom tab
2. **Tap "Task Preferences"** - In task section
3. **Select Default Sort** - Choose order
4. **Save** - Applied to all views

### Sort Options

#### By Priority

**Order: High → Medium → Low**
```
High Priority Tasks
├── Task 1
├── Task 2
└── Task 3

Medium Priority Tasks
├── Task 4
├── Task 5
└── Task 6

Low Priority Tasks
├── Task 7
└── Task 8
```

#### By Due Date

**Order: Earliest → Latest**
```
Overdue
├── Task 1 (Due: Yesterday)
└── Task 2 (Due: 2 days ago)

Today
├── Task 3 (Due: Today)
└── Task 4 (Due: Today)

Upcoming
├── Task 5 (Due: Tomorrow)
└── Task 6 (Due: Next Week)
```

#### By Created Date

**Order: Newest → Oldest**
```
Created Today
├── Task 1
└── Task 2

Created Yesterday
├── Task 3
└── Task 4

Created Last Week
├── Task 5
└── Task 6
```

#### By Alphabetical

**Order: A-Z**
```
A
├── Analyze data
└── Approve report

B
├── Build feature
└── Buy groceries

C
├── Complete project
└── Create presentation
```

#### By Completion Status

**Order: Pending → Completed**
```
Pending Tasks
├── Task 1
├── Task 2
└── Task 3

Completed Tasks
├── Task 4
├── Task 5
└── Task 6
```

---

## Task Search

### Understanding Search

Search helps you quickly find specific tasks by keywords.

**Search Scope:**
- Task title
- Task description
- Task notes
- Category name
- Tag names

### Performing Search

#### Method 1: From Tasks Tab

1. **Go to Tasks** - Tab at bottom
2. **Tap Search Icon** - Top right corner
3. **Enter Search Term** - Type keyword
4. **Results Update** - In real-time
5. **Tap Result** - Open task

#### Method 2: Quick Search

1. **Press Ctrl+F** - Web version
2. **Or Swipe Down** - Mobile version
3. **Enter Search Term** - Type keyword
4. **Results Appear** - Matching tasks
5. **Tap Result** - Open task

### Search Features

#### Basic Search

**Simple Keyword Search:**
1. Enter single word
2. Searches all fields
3. Case-insensitive
4. Partial matches included

**Example:**
- Search: "report"
- Finds: "Complete report", "Monthly report", "Report analysis"

#### Advanced Search

**Complex Search Queries:**

```
Syntax: field:value

Examples:
- category:work
- priority:high
- tag:urgent
- due:today
- status:pending
```

#### Search Operators

**Boolean Operators:**

| Operator | Meaning | Example |
|----------|---------|---------|
| AND | Both terms | "report AND analysis" |
| OR | Either term | "report OR presentation" |
| NOT | Exclude term | "report NOT draft" |
| "" | Exact phrase | "project report" |

#### Search History

**View Recent Searches:**
1. Tap search field
2. Previous searches appear
3. Tap to repeat search
4. Clear history if needed

---

## Task Notes

### Understanding Notes

Notes provide detailed information about tasks.

**Note Features:**
- Rich text formatting
- Up to 5000 characters
- Bold, italic, lists
- Auto-save
- Search-indexed

### Adding Notes

#### Method 1: During Task Creation

1. **Create Task** - Fill in basic details
2. **Scroll to Notes** - Section below
3. **Tap Notes Field** - Opens editor
4. **Type Content** - Enter note text
5. **Format Text** - Use toolbar
6. **Save Task** - Notes saved

#### Method 2: Edit Existing Task

1. **Open Task** - View details
2. **Tap "Edit"** - Enter edit mode
3. **Scroll to Notes** - Section below
4. **Tap Notes Field** - Opens editor
5. **Add/Modify Content** - Update notes
6. **Save Changes** - Notes updated

### Note Formatting

#### Text Formatting

**Bold Text:**
1. Select text
2. Tap Bold button (B)
3. Text becomes bold
4. Example: **Important**

**Italic Text:**
1. Select text
2. Tap Italic button (I)
3. Text becomes italic
4. Example: *Emphasized*

**Underline:**
1. Select text
2. Tap Underline button (U)
3. Text becomes underlined
4. Example: <u>Underlined</u>

#### Lists

**Bullet List:**
1. Tap bullet list button
2. Type item
3. Press Enter for next item
4. Press Backspace to end list

**Example:**
```
• Item 1
• Item 2
• Item 3
```

**Numbered List:**
1. Tap numbered list button
2. Type item
3. Press Enter for next item
4. Press Backspace to end list

**Example:**
```
1. First item
2. Second item
3. Third item
```

#### Links

**Add Links:**
1. Select text
2. Tap link button
3. Enter URL
4. Tap add
5. Text becomes link

**Example:**
```
[Project Documentation](https://docs.example.com)
```

### Managing Notes

#### Editing Notes

1. **Open Task** - View details
2. **Tap Notes Section** - Opens editor
3. **Modify Content** - Edit text
4. **Auto-Save** - Changes saved automatically

#### Copying Notes

1. **Open Task** - View details
2. **Tap Notes Section** - Highlights text
3. **Tap Copy** - Copies to clipboard
4. **Paste** - Use elsewhere

#### Sharing Notes

1. **Open Task** - View details
2. **Tap Share** - Share options
3. **Select Method** - Email, message, etc.
4. **Share** - Sends note content

---

## Task Statistics

### Understanding Statistics

Statistics provide insights into your task management and productivity.

**Tracked Metrics:**
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Completion rate
- Average completion time

### Viewing Statistics

#### Method 1: Home Screen

1. **Go to Home** - First tab
2. **View Statistics** - At top of screen
3. **Shows:**
   - Completed today
   - Pending tasks
   - Overdue tasks
   - Weekly completion rate

#### Method 2: Statistics Screen

1. **Go to Settings** - Bottom tab
2. **Tap "Statistics"** - In task section
3. **Detailed Breakdown** - Charts and graphs
4. **Time Periods** - Daily, weekly, monthly

### Statistics Metrics

#### Completion Rate

**Percentage of Tasks Completed:**
```
Completion Rate = (Completed Tasks / Total Tasks) × 100%

Example:
- Total Tasks: 20
- Completed: 15
- Rate: (15/20) × 100 = 75%
```

#### Daily Statistics

**Daily Task Completion:**
- Tasks completed today
- Tasks pending
- Tasks overdue
- Average time per task

#### Weekly Statistics

**Weekly Overview:**
- Total tasks created
- Total tasks completed
- Completion rate
- Most productive day
- Average tasks per day

#### Monthly Statistics

**Monthly Overview:**
- Total tasks created
- Total tasks completed
- Completion rate
- Most productive week
- Trend analysis

#### Category Statistics

**Tasks by Category:**
- Total tasks per category
- Completion rate per category
- Average time per category
- Most used category

#### Priority Statistics

**Tasks by Priority:**
- High priority tasks
- Medium priority tasks
- Low priority tasks
- Completion rate by priority

### Charts and Graphs

#### Completion Trend

**Line Chart:**
- X-axis: Time (days, weeks, months)
- Y-axis: Completion count
- Shows productivity trend
- Helps identify patterns

#### Category Breakdown

**Pie Chart:**
- Shows task distribution
- By category
- By priority
- By status

#### Weekly Heatmap

**Heatmap:**
- Days of week (X-axis)
- Weeks (Y-axis)
- Color intensity = task completion
- Identifies patterns

---

## Best Practices

### Task Creation Best Practices

**1. Be Specific**
- ✅ "Complete Q3 financial report"
- ❌ "Work on report"

**2. Use Action Verbs**
- ✅ "Review project proposal"
- ❌ "Project proposal"

**3. Set Realistic Deadlines**
- ✅ Due date based on actual need
- ❌ Arbitrary or too far in future

**4. Add Context**
- ✅ Include relevant details in description
- ❌ Vague task with no context

**5. Use Categories**
- ✅ Organize by project or area
- ❌ Leave all uncategorized

### Task Organization Best Practices

**1. Regular Review**
- Review tasks daily
- Update status regularly
- Remove completed tasks

**2. Prioritize Effectively**
- Use priority levels appropriately
- Focus on high-priority tasks
- Avoid marking everything high

**3. Use Categories Wisely**
- Create meaningful categories
- Don't over-categorize
- Keep category count manageable

**4. Tag Strategically**
- Use tags for cross-cutting concerns
- Keep tag list organized
- Regular tag cleanup

**5. Set Realistic Reminders**
- Reminder timing based on task complexity
- Multiple reminders for important tasks
- Avoid reminder fatigue

### Task Completion Best Practices

**1. Complete Regularly**
- Mark tasks complete as soon as done
- Don't wait to batch complete
- Maintain accurate status

**2. Review Completed Tasks**
- Acknowledge accomplishments
- Learn from completed tasks
- Archive old completed tasks

**3. Handle Overdue Tasks**
- Address overdue tasks promptly
- Reschedule if needed
- Identify why tasks became overdue

**4. Maintain Data Quality**
- Keep task information current
- Remove obsolete tasks
- Archive old tasks

---

## Advanced Features

### Task Templates

**Create Task Templates:**
1. Create task with standard details
2. Tap "Save as Template"
3. Enter template name
4. Save

**Using Templates:**
1. Tap "Create Task"
2. Tap "From Template"
3. Select template
4. Customize if needed
5. Save task

### Task Duplication

**Duplicate Existing Task:**
1. Open task
2. Tap Menu (⋮)
3. Select "Duplicate"
4. Modify if needed
5. Save

### Task Scheduling

**Schedule Task for Later:**
1. Create task
2. Tap "Schedule"
3. Select date/time
4. Task appears at scheduled time
5. Notification sent

### Task Dependencies

**Mark Task as Dependent:**
1. Create main task
2. Create dependent task
3. In dependent task, tap "Depends On"
4. Select main task
5. Dependent task blocked until main complete

---

## Troubleshooting

### Common Issues

#### Task Not Saving

**Problem:** Task created but not saved

**Solutions:**
1. Check device storage space
2. Restart app
3. Try creating again
4. Check for error messages

#### Task Disappeared

**Problem:** Task was visible but now gone

**Solutions:**
1. Check if task was deleted
2. Check if filtered out
3. Search for task
4. Check completed section
5. Restore from backup if needed

#### Reminders Not Working

**Problem:** Reminders not triggering

**Solutions:**
1. Check if notifications enabled
2. Check system notification settings
3. Verify reminder time is correct
4. Check if task due date is set
5. Restart app

#### Recurring Task Issues

**Problem:** Recurring task not repeating

**Solutions:**
1. Check recurrence pattern
2. Verify end date not reached
3. Check max occurrences
4. Restart app
5. Edit and resave recurrence

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
