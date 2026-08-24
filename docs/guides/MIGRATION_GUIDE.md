# MeTodo - Migration & Upgrade Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains how to migrate data to MeTodo and upgrade from previous versions.

---

## Table of Contents

1. [Migrating to MeTodo](#migrating-to-metodo)
2. [Importing Data](#importing-data)
3. [Version Upgrades](#version-upgrades)
4. [Breaking Changes](#breaking-changes)
5. [Data Backup](#data-backup)

---

## Migrating to MeTodo

### From Other Apps

**Supported Formats:**
- CSV files
- JSON files
- Excel files
- iCal files

**Migration Steps:**
1. Export data from old app
2. Convert to supported format if needed
3. Open MeTodo
4. Settings → Data & Privacy → Import
5. Select file
6. Map fields
7. Confirm import

---

## Importing Data

### CSV Import

**CSV Format:**
```
title,description,priority,dueDate,category,tags
Task 1,Description,High,2026-06-30,Work,urgent;important
Task 2,Description,Medium,2026-07-01,Personal,home
```

**Import Process:**
1. Prepare CSV file
2. Settings → Import
3. Select CSV file
4. Map columns
5. Confirm import

### JSON Import

**JSON Format:**
```json
{
  "tasks": [
    {
      "id": "1",
      "title": "Task 1",
      "description": "Description",
      "priority": "high",
      "dueDate": "2026-06-30",
      "category": "Work",
      "tags": ["urgent", "important"],
      "completed": false
    }
  ]
}
```

**Import Process:**
1. Prepare JSON file
2. Settings → Import
3. Select JSON file
4. Verify structure
5. Confirm import

---

## Version Upgrades

### From v0.x to v1.0

**New Features:**
- Avatar creator
- 50+ themes
- Developer options
- Advanced filtering
- Recurring tasks

**Migration:**
1. Backup current data
2. Update app
3. Data automatically migrated
4. Review new features
5. Adjust settings

### From v1.0 to v1.1

**New Features:**
- Cloud sync
- Collaboration
- Advanced analytics
- Mobile optimization

**Migration:**
1. Backup data
2. Update app
3. Enable cloud sync (optional)
4. Invite collaborators (optional)
5. Review analytics

---

## Breaking Changes

### v1.0 to v1.1

**API Changes:**
- Task structure updated
- New fields added
- Old fields deprecated
- Migration automatic

**UI Changes:**
- New navigation structure
- Redesigned settings
- New icons
- New color scheme

**Data Changes:**
- Automatic migration
- No data loss
- Backward compatible
- Rollback available

---

## Data Backup

### Automatic Backups

**Enable Auto Backup:**
1. Settings → Data & Privacy
2. Toggle "Auto Backup"
3. Select frequency
4. Backups created automatically

**Backup Frequency:**
- Daily (default)
- Weekly
- Monthly

### Manual Backups

**Create Backup:**
1. Settings → Data & Privacy
2. Tap "Backup Now"
3. Backup created
4. Can be exported

**Export Backup:**
1. Settings → Data & Privacy
2. Tap "View Backups"
3. Select backup
4. Tap "Export"
5. File saved

### Restore Backup

**Restore Data:**
1. Settings → Data & Privacy
2. Tap "Restore"
3. Select backup file
4. Confirm restoration
5. Data restored

**Warning:**
- Restoring overwrites current data
- Backup current data first
- Cannot undo restoration
- Confirm before proceeding

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
