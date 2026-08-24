// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# Task Templates Documentation

## Overview

Task Templates is a powerful feature that allows users to save frequently-used task configurations for quick reuse. Instead of recreating the same task details repeatedly, users can create a template once and apply it multiple times with just a few taps.

---

## Features

### Core Features

- **Template Creation:** Save task configurations as reusable templates
- **Template Management:** Organize, edit, and delete templates
- **Quick Apply:** Apply templates to create tasks instantly
- **Favorites:** Mark frequently-used templates as favorites
- **Search & Filter:** Find templates by name, category, or tags
- **Statistics:** Track template usage and popularity
- **Categorization:** Organize templates by category
- **Duplication:** Clone templates for variations
- **Export/Import:** Share templates between devices

### What Can Be Saved in Templates

- Task title and description
- Priority level (high, medium, low)
- Category/project
- Estimated time
- Default due date offset
- Recurring pattern
- Tags and labels
- Checklist items
- Reminders
- Notes

---

## Getting Started

### Creating Your First Template

#### Method 1: From Scratch

1. **Open Templates Screen**
   - Go to app → Templates tab
   - Or navigate via Settings → Templates

2. **Create New Template**
   - Tap "+ Create New Template" button
   - Enter template name (required)
   - Add description (optional)

3. **Configure Template Details**
   - Set priority level
   - Choose category
   - Add estimated time
   - Set default due date
   - Add tags
   - Create checklist items
   - Add reminders

4. **Save Template**
   - Tap "Save Template" button
   - Template is now available for use

#### Method 2: From Existing Task

1. **Open Task**
   - Select a task you want to save as template
   - Tap "..." (more options)

2. **Save as Template**
   - Choose "Save as Template"
   - Confirm template name
   - Template is created

### Using Templates

#### Quick Apply

1. **Open Templates**
   - Go to Templates screen
   - Find desired template

2. **Apply Template**
   - Tap template card
   - Or tap "Apply" button
   - New task created with template details

3. **Customize (Optional)**
   - Edit task details if needed
   - Adjust due date
   - Add specific notes
   - Save task

#### Apply with Modifications

1. **Open Template**
   - Select template
   - Tap "Apply with Options"

2. **Customize Before Creating**
   - Modify title
   - Change priority
   - Adjust due date
   - Add specific details

3. **Create Task**
   - Tap "Create Task" button
   - Task is created with your modifications

---

## Template Management

### Organizing Templates

#### By Category

Templates are automatically organized by category:

- Work
- Personal
- Shopping
- Health
- Finance
- Education
- Home
- Travel

#### By Favorites

Mark frequently-used templates as favorites:

1. Open Templates
2. Tap star icon on template
3. Template appears in Favorites section

#### By Tags

Add tags to templates for better organization:

1. Edit template
2. Add tags (e.g., #urgent, #weekly)
3. Search by tags

### Editing Templates

1. **Open Template**
   - Find template in list
   - Tap "..." (more options)

2. **Edit Template**
   - Choose "Edit"
   - Modify details
   - Save changes

3. **Changes Apply**
   - Future tasks use updated template
   - Existing tasks unchanged

### Deleting Templates

1. **Select Template**
   - Find template to delete
   - Tap "..." (more options)

2. **Delete**
   - Choose "Delete"
   - Confirm deletion
   - Template removed

### Duplicating Templates

Create variations of existing templates:

1. **Open Template**
   - Find template to duplicate
   - Tap "..." (more options)

2. **Duplicate**
   - Choose "Duplicate"
   - New template created with "(Copy)" suffix
   - Modify as needed

---

## Template Statistics

### View Template Stats

Access statistics for all templates:

1. **Open Templates Screen**
   - Statistics shown in header

2. **View Metrics**
   - Total templates created
   - Favorite templates count
   - Total uses across all templates

### Individual Template Stats

Each template shows:

- **Usage Count:** How many times applied
- **Last Used:** When template was last applied
- **Created Date:** When template was created
- **Popularity:** Relative usage compared to others

---

## Best Practices

### Creating Effective Templates

1. **Clear Naming**
   - Use descriptive names
   - Include context (e.g., "Weekly Team Meeting")
   - Avoid generic names

2. **Detailed Description**
   - Explain template purpose
   - Note when to use
   - Include any special instructions

3. **Complete Configuration**
   - Set all relevant details
   - Include default reminders
   - Add standard checklist items
   - Set appropriate priority

4. **Consistent Tags**
   - Use consistent tag naming
   - Create tag system
   - Apply tags consistently

### Organizing Templates

1. **Categorize Properly**
   - Use correct category
   - Consider creating custom categories
   - Keep categories organized

2. **Use Favorites**
   - Mark most-used templates
   - Keep favorites updated
   - Review occasionally

3. **Archive Old Templates**
   - Delete unused templates
   - Keep library clean
   - Maintain only relevant templates

### Maintaining Templates

1. **Regular Review**
   - Review templates monthly
   - Update outdated templates
   - Delete unused templates

2. **Version Control**
   - Track template versions
   - Document changes
   - Keep history if needed

3. **Backup Important Templates**
   - Export critical templates
   - Keep backup copies
   - Share with team if needed

---

## Advanced Features

### Template Scheduling

Set templates to auto-create tasks:

```typescript
// Create recurring task from template
const recurringTask = {
  templateId: 'template_123',
  frequency: 'weekly',
  dayOfWeek: 'Monday',
  time: '09:00'
};
```

### Template Sharing

Share templates with team members:

1. Open template
2. Tap "Share"
3. Select recipients
4. Recipients can use template

### Template Analytics

View detailed template analytics:

- Most used templates
- Usage trends over time
- Template effectiveness
- Team template usage

### Bulk Operations

Perform operations on multiple templates:

1. **Select Multiple**
   - Long-press template
   - Tap additional templates
   - Tap "Select All" to select all

2. **Bulk Actions**
   - Delete multiple templates
   - Add tags to multiple
   - Move to category
   - Export selected

---

## API Reference

### TaskTemplateServiceExtended

#### Methods

```typescript
// Create template
createTemplate(userId: string, templateData: Partial<TaskTemplate>): TaskTemplate

// Get template
getTemplate(templateId: string): TaskTemplate | undefined

// Get all user templates
getUserTemplates(userId: string): TaskTemplate[]

// Get templates by category
getTemplatesByCategory(userId: string, categoryId: string): TaskTemplate[]

// Search templates
searchTemplates(userId: string, query: string): TaskTemplate[]

// Get favorite templates
getFavoriteTemplates(userId: string): TaskTemplate[]

// Toggle favorite
toggleFavorite(templateId: string): boolean

// Update template
updateTemplate(templateId: string, updates: Partial<TaskTemplate>): TaskTemplate | null

// Delete template
deleteTemplate(templateId: string): boolean

// Duplicate template
duplicateTemplate(templateId: string, userId: string): TaskTemplate | null

// Apply template
applyTemplate(templateId: string): TaskTemplate | null

// Get statistics
getStatistics(userId: string): TemplateStatistics

// Export templates
exportTemplates(userId: string): string

// Import templates
importTemplates(userId: string, jsonData: string): TaskTemplate[]
```

#### Usage Example

```typescript
import TaskTemplateServiceExtended from '@/lib/task-template-service-extended';

const templateService = new TaskTemplateServiceExtended();

// Create template
const template = templateService.createTemplate('user123', {
  name: 'Daily Standup',
  description: 'Prepare for daily team standup',
  priority: 'high',
  estimatedTime: 15,
  defaultTags: ['standup', 'meeting'],
  defaultReminders: [
    { type: 'before_due', value: 30, unit: 'minutes' }
  ]
});

// Get all templates
const allTemplates = templateService.getUserTemplates('user123');

// Apply template
const applied = templateService.applyTemplate(template.id);

// Get statistics
const stats = templateService.getStatistics('user123');
console.log('Total templates:', stats.totalTemplates);
console.log('Most used:', stats.mostUsedTemplate?.name);
```

---

## Troubleshooting

### Template Not Appearing

**Problem:** Created template doesn't appear in list

**Solutions:**
1. Refresh templates screen
2. Check category filter
3. Search for template name
4. Verify template was saved

### Can't Apply Template

**Problem:** Unable to apply template to create task

**Solutions:**
1. Check template is not deleted
2. Verify you have permission
3. Try applying from template detail
4. Restart app if needed

### Template Data Lost

**Problem:** Template details disappeared

**Solutions:**
1. Check if template was deleted
2. Look in trash/deleted items
3. Restore from backup if available
4. Contact support if data corrupted

### Performance Issues

**Problem:** Templates screen is slow

**Solutions:**
1. Delete unused templates
2. Clear search filters
3. Restart app
4. Check device storage

---

## Limitations

### Current Limitations

1. **Template Size:** Max 50 items per checklist
2. **Storage:** Max 1000 templates per user
3. **Sharing:** Limited to team members
4. **Categories:** 8 default + custom categories

### Planned Improvements

- Unlimited checklist items
- Advanced scheduling
- AI-powered template suggestions
- Template marketplace
- Team template library

---

## Support

For issues or questions about Task Templates:

**Email:** supportramsandesh@gmail.com

**Response Time:** 24-48 hours

**Include in Report:**
- Template name
- Steps to reproduce issue
- Expected vs actual behavior
- Screenshots if applicable

---

## Related Documentation

- [Task Management Guide](./user-guides/TASK_CREATION_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [API Documentation](./technical/API_DOCUMENTATION.md)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
