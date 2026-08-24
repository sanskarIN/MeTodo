// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Collaboration Service
 * 
 * Service for managing task collaboration and sharing in MeTodo including
 * task sharing, team management, and collaborative editing.
 * 
 * Features:
 * - Task sharing
 * - Team management
 * - Collaborative editing
 * - Permission management
 */

/**
 * Permission level type
 */
export type PermissionLevel = 'view' | 'edit' | 'manage' | 'admin';

/**
 * Shared task interface
 */
export interface SharedTask {
  id: string;
  taskId: string;
  sharedBy: string;
  sharedWith: string[];
  permissions: Record<string, PermissionLevel>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

/**
 * Team interface
 */
export interface Team {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: TeamMember[];
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team member interface
 */
export interface TeamMember {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  permissions: PermissionLevel[];
}

/**
 * Collaboration activity interface
 */
export interface CollaborationActivity {
  id: string;
  taskId: string;
  userId: string;
  action: 'created' | 'updated' | 'completed' | 'commented' | 'shared';
  details: any;
  timestamp: Date;
}

/**
 * Collaboration Service Class
 */
export class CollaborationService {
  private sharedTasks: Map<string, SharedTask> = new Map();
  private teams: Map<string, Team> = new Map();
  private activities: Map<string, CollaborationActivity> = new Map();

  /**
   * Share task with user
   */
  shareTask(
    taskId: string,
    sharedBy: string,
    sharedWith: string[],
    permission: PermissionLevel = 'view'
  ): SharedTask {
    const id = `shared_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const permissions: Record<string, PermissionLevel> = {};

    sharedWith.forEach((user) => {
      permissions[user] = permission;
    });

    const sharedTask: SharedTask = {
      id,
      taskId,
      sharedBy,
      sharedWith,
      permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sharedTasks.set(id, sharedTask);
    this.logActivity(taskId, sharedBy, 'shared', { sharedWith, permission });

    return sharedTask;
  }

  /**
   * Update share permissions
   */
  updateSharePermissions(
    sharedTaskId: string,
    userId: string,
    permission: PermissionLevel
  ): SharedTask | null {
    const sharedTask = this.sharedTasks.get(sharedTaskId);
    if (!sharedTask) return null;

    sharedTask.permissions[userId] = permission;
    sharedTask.updatedAt = new Date();

    return sharedTask;
  }

  /**
   * Revoke share
   */
  revokeShare(sharedTaskId: string, userId?: string): boolean {
    const sharedTask = this.sharedTasks.get(sharedTaskId);
    if (!sharedTask) return false;

    if (userId) {
      delete sharedTask.permissions[userId];
      sharedTask.sharedWith = sharedTask.sharedWith.filter((u) => u !== userId);
    } else {
      this.sharedTasks.delete(sharedTaskId);
    }

    return true;
  }

  /**
   * Get shared tasks for user
   */
  getSharedTasksForUser(userId: string): SharedTask[] {
    return Array.from(this.sharedTasks.values()).filter((st) =>
      st.sharedWith.includes(userId)
    );
  }

  /**
   * Check permission
   */
  checkPermission(sharedTaskId: string, userId: string, requiredPermission: PermissionLevel): boolean {
    const sharedTask = this.sharedTasks.get(sharedTaskId);
    if (!sharedTask) return false;

    const userPermission = sharedTask.permissions[userId];
    if (!userPermission) return false;

    const permissionHierarchy: Record<PermissionLevel, number> = {
      view: 1,
      edit: 2,
      manage: 3,
      admin: 4,
    };

    return permissionHierarchy[userPermission] >= permissionHierarchy[requiredPermission];
  }

  /**
   * Create team
   */
  createTeam(name: string, description: string, owner: string): Team {
    const id = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const team: Team = {
      id,
      name,
      description,
      owner,
      members: [
        {
          userId: owner,
          email: owner,
          role: 'owner',
          joinedAt: new Date(),
          permissions: ['view', 'edit', 'manage', 'admin'],
        },
      ],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.teams.set(id, team);
    return team;
  }

  /**
   * Add team member
   */
  addTeamMember(teamId: string, userId: string, email: string, role: 'admin' | 'member' = 'member'): Team | null {
    const team = this.teams.get(teamId);
    if (!team) return null;

    const permissions: PermissionLevel[] = role === 'admin' ? ['view', 'edit', 'manage'] : ['view', 'edit'];

    team.members.push({
      userId,
      email,
      role,
      joinedAt: new Date(),
      permissions,
    });

    team.updatedAt = new Date();
    return team;
  }

  /**
   * Remove team member
   */
  removeTeamMember(teamId: string, userId: string): Team | null {
    const team = this.teams.get(teamId);
    if (!team) return null;

    if (team.owner === userId) return null; // Can't remove owner

    team.members = team.members.filter((m) => m.userId !== userId);
    team.updatedAt = new Date();

    return team;
  }

  /**
   * Add task to team
   */
  addTaskToTeam(teamId: string, taskId: string): Team | null {
    const team = this.teams.get(teamId);
    if (!team) return null;

    if (!team.tasks.includes(taskId)) {
      team.tasks.push(taskId);
      team.updatedAt = new Date();
    }

    return team;
  }

  /**
   * Remove task from team
   */
  removeTaskFromTeam(teamId: string, taskId: string): Team | null {
    const team = this.teams.get(teamId);
    if (!team) return null;

    team.tasks = team.tasks.filter((t) => t !== taskId);
    team.updatedAt = new Date();

    return team;
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): Team | null {
    return this.teams.get(teamId) || null;
  }

  /**
   * Get user's teams
   */
  getUserTeams(userId: string): Team[] {
    return Array.from(this.teams.values()).filter((team) =>
      team.members.some((m) => m.userId === userId)
    );
  }

  /**
   * Log activity
   */
  private logActivity(
    taskId: string,
    userId: string,
    action: CollaborationActivity['action'],
    details: any
  ): void {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const activity: CollaborationActivity = {
      id,
      taskId,
      userId,
      action,
      details,
      timestamp: new Date(),
    };

    this.activities.set(id, activity);
  }

  /**
   * Get task activity
   */
  getTaskActivity(taskId: string): CollaborationActivity[] {
    return Array.from(this.activities.values())
      .filter((a) => a.taskId === taskId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get team activity
   */
  getTeamActivity(teamId: string): CollaborationActivity[] {
    const team = this.teams.get(teamId);
    if (!team) return [];

    return Array.from(this.activities.values())
      .filter((a) => team.tasks.includes(a.taskId))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get collaboration statistics
   */
  getStats(): {
    totalSharedTasks: number;
    totalTeams: number;
    totalMembers: number;
    totalActivities: number;
  } {
    const allMembers = new Set<string>();
    this.teams.forEach((team) => {
      team.members.forEach((m) => allMembers.add(m.userId));
    });

    return {
      totalSharedTasks: this.sharedTasks.size,
      totalTeams: this.teams.size,
      totalMembers: allMembers.size,
      totalActivities: this.activities.size,
    };
  }

  /**
   * Export team data
   */
  exportTeam(teamId: string): string {
    const team = this.teams.get(teamId);
    if (!team) throw new Error('Team not found');

    return JSON.stringify(team, null, 2);
  }

  /**
   * Generate share link
   */
  generateShareLink(sharedTaskId: string, expiresInDays: number = 7): string {
    const sharedTask = this.sharedTasks.get(sharedTaskId);
    if (!sharedTask) throw new Error('Shared task not found');

    sharedTask.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    return `metodo://share/${sharedTaskId}?expires=${sharedTask.expiresAt.toISOString()}`;
  }

  /**
   * Check if share link is valid
   */
  isShareLinkValid(sharedTaskId: string): boolean {
    const sharedTask = this.sharedTasks.get(sharedTaskId);
    if (!sharedTask) return false;

    if (!sharedTask.expiresAt) return true;

    return new Date() < sharedTask.expiresAt;
  }
}

export const collaborationService = new CollaborationService();
export default CollaborationService;
