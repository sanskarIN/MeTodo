// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# Team Collaboration Documentation

## Overview

Team Collaboration features enable users to work together on shared tasks and projects. Users can create teams, invite members, share tasks with specific permissions, and track team activity in real-time.

---

## Features

### Core Features

- **Team Management:** Create and manage teams
- **Member Management:** Add, remove, and manage team members
- **Task Sharing:** Share tasks with teams or individuals
- **Permission Control:** Fine-grained permission management
- **Activity Tracking:** Monitor team activity and changes
- **Role-Based Access:** Owner, Admin, Member, Viewer roles
- **Real-Time Updates:** Live synchronization of changes

### Team Roles

| Role | Permissions |
|------|-------------|
| Owner | Full control, manage members, delete team |
| Admin | Manage members, share tasks, view activity |
| Member | Create tasks, share, comment, view |
| Viewer | View only, no modifications |

---

## Getting Started

### Creating a Team

1. **Open Team Section**
   - Go to Settings → Teams
   - Tap "Create New Team"

2. **Enter Team Details**
   - Team name (required)
   - Description (optional)
   - Configure settings

3. **Configure Settings**
   - Allow public sharing
   - Require approval for join
   - Notification preferences
   - Comment and attachment settings

4. **Create Team**
   - Tap "Create" button
   - Team is created with you as owner

### Inviting Members

1. **Open Team**
   - Select team from list
   - Tap "Members" tab

2. **Add Member**
   - Tap "Add Member" button
   - Enter member email
   - Select role (Admin, Member, Viewer)

3. **Send Invitation**
   - Tap "Invite" button
   - Member receives invitation
   - They accept to join

4. **Member Joins**
   - Member accepts invitation
   - Added to team
   - Can now access shared tasks

### Sharing Tasks

1. **Open Task**
   - Select task to share
   - Tap "Share" button

2. **Select Recipients**
   - Choose team or members
   - Select permission level

3. **Set Permissions**
   - View only
   - View and comment
   - View and edit
   - Full control

4. **Share Task**
   - Tap "Share" button
   - Task is shared
   - Recipients notified

---

## Team Management

### Managing Members

#### View Members

```
Team Settings → Members → View All
```

Shows all team members with:
- Name and email
- Role
- Join date
- Status (active/inactive/pending)

#### Change Member Role

1. Select member
2. Tap "Change Role"
3. Choose new role
4. Confirm change

#### Remove Member

1. Select member
2. Tap "Remove"
3. Confirm removal
4. Member loses access

### Team Settings

#### Basic Settings

- Team name
- Description
- Team icon/avatar

#### Sharing Settings

- Allow public sharing
- Require approval for join
- Default permissions for new shares

#### Notification Settings

- Notify on task updates
- Notify on member changes
- Notify on comments

#### Feature Settings

- Allow comments
- Allow attachments
- Allow task editing
- Allow task deletion

---

## Task Sharing

### Permission Levels

#### View Only
- Can view task
- Cannot modify
- Cannot comment
- Cannot share

#### View and Comment
- Can view task
- Can add comments
- Cannot modify task
- Cannot share

#### View and Edit
- Can view task
- Can edit task
- Can add comments
- Cannot delete task

#### Full Control
- Can view task
- Can edit task
- Can delete task
- Can share with others

### Sharing with Teams

Share task with entire team:

1. Open task
2. Tap "Share" → "Share with Team"
3. Select team
4. Set permissions
5. Confirm

All team members get access with specified permissions.

### Sharing with Individuals

Share task with specific person:

1. Open task
2. Tap "Share" → "Share with Person"
3. Enter email
4. Set permissions
5. Confirm

Only specified person gets access.

### Expiring Shares

Set expiration for shared access:

1. Open shared task
2. Tap "Edit Share"
3. Set expiration date
4. Confirm

Access automatically revoked on expiration date.

---

## Activity Tracking

### Team Activity Log

View all team activity:

```
Team → Activity → View All
```

Shows:
- Action performed
- Who performed it
- When it happened
- Task involved (if applicable)

### Activity Types

| Activity | Description |
|----------|-------------|
| created_team | Team was created |
| added_member | Member added to team |
| removed_member | Member removed from team |
| updated_member_role | Member role changed |
| shared_task | Task was shared |
| updated_share | Share permissions changed |
| unshared_task | Task sharing removed |
| completed_task | Task marked complete |
| commented | Comment added |

### Filtering Activity

Filter activity by:
- Date range
- Activity type
- Member
- Task

### Exporting Activity

Export activity log as:
- CSV
- JSON
- PDF report

---

## Collaboration Workflows

### Project Collaboration

**Scenario:** Team working on project

1. Create team for project
2. Add team members
3. Create tasks for project
4. Share tasks with team
5. Members update task status
6. Track progress in activity log
7. Export final report

### Task Review Process

**Scenario:** Task requires review before completion

1. Create task
2. Share with reviewer (View and Comment)
3. Reviewer adds comments
4. Task creator updates based on feedback
5. Reviewer approves
6. Task marked complete

### Cross-Team Collaboration

**Scenario:** Multiple teams working together

1. Create main team
2. Add team leads from other teams
3. Share key tasks with leads
4. Leads share with their teams
5. Coordinate through activity log

---

## API Reference

### TeamCollaborationService

#### Methods

```typescript
// Create team
createTeam(name: string, ownerId: string, description?: string): Team

// Get team
getTeam(teamId: string): Team | undefined

// Add member
addTeamMember(teamId: string, memberId: string, memberName: string, memberEmail: string, role?: string): TeamMember

// Remove member
removeTeamMember(teamId: string, memberId: string): boolean

// Update member role
updateMemberRole(teamId: string, memberId: string, newRole: string): boolean

// Share task
shareTaskWithTeam(taskId: string, sharedBy: string, teamId: string, permissions?: Partial<TaskPermissions>): SharedTask

// Get shared tasks
getSharedTasks(taskId: string): SharedTask[]

// Update permissions
updateTaskPermissions(taskId: string, teamId: string, permissions: Partial<TaskPermissions>): boolean

// Unshare task
unshareTask(taskId: string, teamId: string): boolean

// Get team activity
getTeamActivity(teamId: string, limit?: number): ActivityLog[]

// Get team statistics
getTeamStatistics(teamId: string): TeamStatistics

// Update team settings
updateTeamSettings(teamId: string, settings: Partial<TeamSettings>): boolean

// Get user teams
getUserTeams(userId: string): Team[]

// Check permission
checkPermission(taskId: string, userId: string, permission: string): boolean

// Delete team
deleteTeam(teamId: string): boolean
```

#### Usage Example

```typescript
import TeamCollaborationService from '@/lib/team-collaboration-service';

const collaborationService = new TeamCollaborationService();

// Create team
const team = collaborationService.createTeam('Project Alpha', 'user123', 'Q3 Project');

// Add members
collaborationService.addTeamMember(team.id, 'user456', 'John', 'john@example.com', 'admin');
collaborationService.addTeamMember(team.id, 'user789', 'Jane', 'jane@example.com', 'member');

// Share task
const shared = collaborationService.shareTaskWithTeam('task123', 'user123', team.id, {
  canView: true,
  canEdit: true,
  canComment: true
});

// Get team activity
const activity = collaborationService.getTeamActivity(team.id, 50);

// Get statistics
const stats = collaborationService.getTeamStatistics(team.id);
console.log('Team members:', stats.totalMembers);
console.log('Shared tasks:', stats.sharedTasks);
```

---

## Best Practices

### Team Organization

1. **Clear Team Purpose**
   - Define team goals
   - Document team scope
   - Communicate to members

2. **Appropriate Member Roles**
   - Use role based on responsibility
   - Review roles regularly
   - Update as needed

3. **Consistent Naming**
   - Use clear team names
   - Include project/context
   - Avoid abbreviations

### Task Sharing

1. **Right Permissions**
   - Only grant needed permissions
   - Use View for read-only
   - Use Edit for collaborators

2. **Clear Communication**
   - Explain why task is shared
   - Set clear expectations
   - Provide context

3. **Regular Updates**
   - Keep task status current
   - Add comments for updates
   - Notify when changes made

### Activity Management

1. **Monitor Activity**
   - Review team activity regularly
   - Identify issues early
   - Celebrate accomplishments

2. **Archive Old Activity**
   - Clean up old logs
   - Keep recent activity
   - Export for records

3. **Use for Accountability**
   - Track who did what
   - Document decisions
   - Maintain audit trail

---

## Troubleshooting

### Member Can't Access Shared Task

**Problem:** Member doesn't see shared task

**Solutions:**
1. Verify member is in team
2. Check share permissions
3. Verify share hasn't expired
4. Ask member to refresh app
5. Reshare task if needed

### Permission Denied Error

**Problem:** Getting permission denied when trying to edit

**Solutions:**
1. Check your role in team
2. Verify task permissions
3. Ask team owner to update permissions
4. Try again after refresh

### Activity Not Showing

**Problem:** Activity log is empty or incomplete

**Solutions:**
1. Check date filter
2. Adjust activity type filter
3. Refresh activity log
4. Check team settings

### Can't Add Member

**Problem:** Unable to add member to team

**Solutions:**
1. Verify you're team owner/admin
2. Check member email is correct
3. Verify member not already in team
4. Check team member limit

---

## Limitations

### Current Limitations

1. **Team Size:** Max 100 members per team
2. **Shared Tasks:** Max 50 shares per task
3. **Activity Log:** Last 1000 activities stored
4. **Roles:** 4 predefined roles only

### Planned Improvements

- Unlimited team size
- Custom roles
- Activity archiving
- Advanced permissions
- Team analytics

---

## Support

For issues or questions about Team Collaboration:

**Email:** supportramsandesh@gmail.com

**Response Time:** 24-48 hours

**Include in Report:**
- Team ID
- Member emails
- Task IDs
- Expected vs actual behavior
- Screenshots if applicable

---

## Related Documentation

- [Task Management Guide](./user-guides/TASK_CREATION_GUIDE.md)
- [API Documentation](./technical/API_DOCUMENTATION.md)
- [Advanced Services](./technical/ADVANCED_SERVICES.md)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
