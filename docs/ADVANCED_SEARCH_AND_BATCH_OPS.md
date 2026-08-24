// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# Advanced Search and Batch Operations Documentation

## Overview

MeTodo provides powerful advanced search and batch operations capabilities for efficient task management. Users can search across thousands of tasks with multiple filters, save searches, and perform bulk operations on multiple tasks simultaneously.

---

## Advanced Search Features

### Full-Text Search

Search across all task fields with intelligent relevance scoring:

```
search "meeting"
```

Searches in:
- Task titles (highest weight)
- Descriptions (medium weight)
- Tags (medium weight)
- Notes (low weight)

### Search Operators

Use operators for advanced queries:

```
priority:high category:work tag:urgent before:2026-07-01
status:pending after:2026-06-01 assignee:john
```

#### Supported Operators

| Operator | Format | Example |
|----------|--------|---------|
| Priority | `priority:high/medium/low` | `priority:high` |
| Category | `category:name` | `category:work` |
| Tag | `tag:name` | `tag:urgent` |
| Status | `status:pending/completed/overdue` | `status:overdue` |
| Before Date | `before:YYYY-MM-DD` | `before:2026-07-01` |
| After Date | `after:YYYY-MM-DD` | `after:2026-06-01` |
| Assignee | `assignee:name` | `assignee:john` |

### Multi-Filter Search

Combine multiple filters for precise results:

```typescript
const query: SearchQuery = {
  text: 'project',
  filters: {
    priority: ['high', 'medium'],
    category: ['work'],
    status: ['pending'],
    dueDateRange: {
      start: new Date('2026-06-01'),
      end: new Date('2026-07-01')
    }
  },
  sortBy: 'priority',
  sortOrder: 'desc',
  limit: 20
};

const results = searchService.search(query);
```

### Sorting Options

Sort search results by:

- **Relevance** (default) - Based on match quality
- **Date** - By creation date
- **Priority** - High to low
- **Due Date** - Earliest to latest

### Search Suggestions

Get intelligent suggestions while typing:

```typescript
const suggestions = searchService.getSuggestions('proj');
// Returns: ['category:projects', 'tag:project', 'priority:high']
```

### Save Searches

Save frequently-used searches:

```typescript
// Save search
searchService.saveSearch('My High Priority Work', {
  text: '',
  filters: {
    priority: ['high'],
    category: ['work'],
    status: ['pending']
  }
});

// Use saved search
const query = searchService.getSavedSearch('My High Priority Work');
const results = searchService.search(query);
```

### Search History

Access recent searches:

```typescript
const history = searchService.getSearchHistory(10);
history.forEach(search => {
  console.log(search.text, search.filters);
});
```

---

## Batch Operations

### Change Priority

Update priority for multiple tasks:

```typescript
const stats = batchService.changePriority(
  ['task1', 'task2', 'task3'],
  'high'
);

console.log(`Updated ${stats.successCount} of ${stats.totalTasks} tasks`);
```

### Add Tags

Add tags to multiple tasks:

```typescript
const stats = batchService.addTags(
  ['task1', 'task2'],
  ['urgent', 'review']
);
```

### Remove Tags

Remove tags from multiple tasks:

```typescript
const stats = batchService.removeTags(
  ['task1', 'task2'],
  ['old-tag']
);
```

### Move to Category

Move multiple tasks to a category:

```typescript
const stats = batchService.moveToCategory(
  ['task1', 'task2', 'task3'],
  'completed-projects'
);
```

### Mark as Completed

Mark multiple tasks as completed:

```typescript
const stats = batchService.markCompleted(['task1', 'task2']);
```

### Mark as Pending

Mark multiple tasks as pending:

```typescript
const stats = batchService.markPending(['task1', 'task2']);
```

### Delete Tasks

Delete multiple tasks:

```typescript
const stats = batchService.deleteTasks(['task1', 'task2']);
```

### Add Reminders

Add reminders to multiple tasks:

```typescript
const stats = batchService.addReminders(
  ['task1', 'task2'],
  30 // 30 minutes before due date
);
```

### Update Due Date

Update due date for multiple tasks:

```typescript
const stats = batchService.updateDueDate(
  ['task1', 'task2'],
  new Date('2026-07-15')
);
```

---

## Operation Results

Each batch operation returns detailed statistics:

```typescript
interface BatchOperationStats {
  totalTasks: number;        // Total tasks processed
  successCount: number;      // Successfully updated
  failureCount: number;      // Failed updates
  results: BatchOperationResult[];  // Detailed results
  duration: number;          // Operation time in ms
}
```

### Example Result

```typescript
{
  totalTasks: 5,
  successCount: 5,
  failureCount: 0,
  results: [
    {
      taskId: 'task1',
      success: true,
      message: 'Priority updated',
      previousValue: 'medium',
      newValue: 'high'
    },
    // ... more results
  ],
  duration: 45
}
```

---

## Best Practices

### Efficient Searching

1. **Use Specific Filters**
   - Combine filters to narrow results
   - Use date ranges for time-sensitive searches
   - Filter by category first

2. **Optimize Search Queries**
   - Use operators for complex searches
   - Save frequently-used searches
   - Use suggestions to refine queries

3. **Search Performance**
   - Limit results with `limit` parameter
   - Use pagination with `offset`
   - Clear old search history regularly

### Batch Operations

1. **Verify Before Executing**
   - Review selected tasks
   - Confirm operation type
   - Check for unintended consequences

2. **Use Undo Feature**
   - Keep operation history
   - Undo recent operations if needed
   - Review operation logs

3. **Batch Size Considerations**
   - Process large batches in chunks
   - Monitor operation performance
   - Use progress indicators

---

## Advanced Examples

### Find All Overdue High-Priority Tasks

```typescript
const query: SearchQuery = {
  filters: {
    priority: ['high'],
    status: ['overdue']
  },
  sortBy: 'dueDate',
  sortOrder: 'asc'
};

const results = searchService.search(query);
```

### Update All Tasks in a Project

```typescript
// Find tasks
const results = searchService.search({
  filters: { category: ['project-x'] }
});

const taskIds = results.map(r => r.taskId);

// Update priority
batchService.changePriority(taskIds, 'high');

// Add tag
batchService.addTags(taskIds, ['project-x-final']);
```

### Archive Completed Tasks

```typescript
const results = searchService.search({
  filters: { status: ['completed'] }
});

const taskIds = results.map(r => r.taskId);
batchService.moveToCategory(taskIds, 'archive');
```

### Bulk Update Due Dates

```typescript
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const results = searchService.search({
  filters: { status: ['pending'] }
});

const taskIds = results.map(r => r.taskId);
batchService.updateDueDate(taskIds, nextWeek);
```

---

## API Reference

### AdvancedSearchService

```typescript
// Search
search(query: SearchQuery): SearchResult[]

// Parse query string
parseSearchQuery(queryString: string): SearchQuery

// Get suggestions
getSuggestions(query: string): string[]

// Save search
saveSearch(name: string, query: SearchQuery): void

// Get saved search
getSavedSearch(name: string): SearchQuery | undefined

// Get all saved searches
getAllSavedSearches(): Map<string, SearchQuery>

// Delete saved search
deleteSavedSearch(name: string): boolean

// Get search history
getSearchHistory(limit?: number): SearchQuery[]

// Clear history
clearSearchHistory(): void

// Advanced search
advancedSearch(query: string): SearchResult[]

// Get statistics
getSearchStatistics(): SearchStatistics
```

### BatchOperationsService

```typescript
// Change priority
changePriority(taskIds: string[], priority: string): BatchOperationStats

// Add tags
addTags(taskIds: string[], tags: string[]): BatchOperationStats

// Remove tags
removeTags(taskIds: string[], tags: string[]): BatchOperationStats

// Move to category
moveToCategory(taskIds: string[], category: string): BatchOperationStats

// Mark completed
markCompleted(taskIds: string[]): BatchOperationStats

// Mark pending
markPending(taskIds: string[]): BatchOperationStats

// Delete tasks
deleteTasks(taskIds: string[]): BatchOperationStats

// Add reminders
addReminders(taskIds: string[], reminderTime: number): BatchOperationStats

// Update due date
updateDueDate(taskIds: string[], dueDate: Date): BatchOperationStats

// Get operation history
getOperationHistory(limit?: number): OperationRecord[]

// Undo last operation
undoLastOperation(): boolean

// Get statistics
getBatchStatistics(): BatchStatistics
```

---

## Troubleshooting

### Search Not Returning Results

**Problem:** Search returns empty results

**Solutions:**
1. Check search syntax
2. Verify filters are correct
3. Try simpler search terms
4. Check if tasks exist in database

### Batch Operation Failed

**Problem:** Batch operation shows failures

**Solutions:**
1. Check task IDs are valid
2. Verify permissions
3. Review operation results
4. Try smaller batch size

### Performance Issues

**Problem:** Search or batch operations are slow

**Solutions:**
1. Use more specific filters
2. Limit result set size
3. Break large batches into smaller chunks
4. Clear search history

---

## Support

For issues or questions:

**Email:** supportramsandesh@gmail.com

**Response Time:** 24-48 hours

---

## Related Documentation

- [Task Management Guide](./user-guides/TASK_CREATION_GUIDE.md)
- [API Documentation](./technical/API_DOCUMENTATION.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
