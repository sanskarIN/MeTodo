// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Team Collaboration Service
 * 
 * Service for managing team collaboration features including task sharing,
 * team management, activity tracking, and real-time updates.
 * 
 * Features:
 * - Task sharing with team members
 * - Team management
 * - Activity tracking
 * - Real-time updates
 * - Permission management
 */

/**
 * Team member interface
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  status: 'active' | 'inactive' | 'pending';
}

/**
 * Team interface
 */
export interface Team {
  id: string;
  name: string;
  description?: string;
  owner: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
  settings: TeamSettings;
}

/**
 * Team settings interface
 */
export interface TeamSettings {
  allowPublicSharing: boolean;
  requireApprovalForJoin: boolean;
  notifyOnTaskUpdate: boolean;
  allowComments: boolean;
  allowAttachments: boolean;
}

/**
 * Shared task interface
 */
export interface SharedTask {
  taskId: string;
  sharedBy: string;
  sharedWith: string[]; // Team IDs or user IDs
  sharedAt: Date;
  permissions: TaskPermissions;
  expiresAt?: Date;
}

/**
 * Task permissions interface
 */
export interface TaskPermissions {
  canView: boolean;
  canEdit: boolean;
  canComment: boolean;
  canDelete: boolean;
  canShare: boolean;
}

/**
 * Activity log interface
 */
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  taskId?: string;
  timestamp: Date;
  details?: Record<string, any>;
}

/**
 * Team Collaboration Service Class
 */
export class TeamCollaborationService {
  private teams: Map<string, Team> = new Map();
  private sharedTasks: Map<string, SharedTask[]> = new Map();
  private activityLogs: ActivityLog[] = [];
  private teamMembers: Map<string, TeamMember[]> = new Map();

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Create a new team
   */
  createTeam(
    name: string,
    ownerId: string,
    description?: string,
    settings?: Partial<TeamSettings>
  ): Team {
    const team: Team = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      owner: ownerId,
      members: [
        {
          id: ownerId,
          name: 'Owner',
          email: 'owner@team.com',
          role: 'owner',
          joinedAt: new Date(),
          status: 'active',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        allowPublicSharing: false,
        requireApprovalForJoin: true,
        notifyOnTaskUpdate: true,
        allowComments: true,
        allowAttachments: true,
        ...settings,
      },
    };

    this.teams.set(team.id, team);
    this.logActivity({
      id: `log_${Date.now()}`,
      userId: ownerId,
      userName: 'Owner',
      action: 'created_team',
      timestamp: new Date(),
      details: { teamId: team.id, teamName: name },
    });

    return team;
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): Team | undefined {
    return this.teams.get(teamId);
  }

  /**
   * Add member to team
   */
  addTeamMember(
    teamId: string,
    memberId: string,
    memberName: string,
    memberEmail: string,
    role: 'admin' | 'member' | 'viewer' = 'member'
  ): TeamMember | null {
    const team = this.teams.get(teamId);
    if (!team) return null;

    const newMember: TeamMember = {
      id: memberId,
      name: memberName,
      email: memberEmail,
      role,
      joinedAt: new Date(),
      status: 'pending',
    };

    team.members.push(newMember);
    team.updatedAt = new Date();

    this.logActivity({
      id: `log_${Date.now()}`,
      userId: team.owner,
      userName: 'Team Owner',
      action: 'added_member',
      timestamp: new Date(),
      details: { teamId, memberId, memberName },
    });

    return newMember;
  }

  /**
   * Remove member from team
   */
  removeTeamMember(teamId: string, memberId: string): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    const initialLength = team.members.length;
    team.members = team.members.filter((m) => m.id !== memberId);
    team.updatedAt = new Date();

    if (team.members.length < initialLength) {
      this.logActivity({
        id: `log_${Date.now()}`,
        userId: team.owner,
        userName: 'Team Owner',
        action: 'removed_member',
        timestamp: new Date(),
        details: { teamId, memberId },
      });
      return true;
    }

    return false;
  }

  /**
   * Update member role
   */
  updateMemberRole(teamId: string, memberId: string, newRole: 'admin' | 'member' | 'viewer'): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    const member = team.members.find((m) => m.id === memberId);
    if (!member) return false;

    const oldRole = member.role;
    member.role = newRole;
    team.updatedAt = new Date();

    this.logActivity({
      id: `log_${Date.now()}`,
      userId: team.owner,
      userName: 'Team Owner',
      action: 'updated_member_role',
      timestamp: new Date(),
      details: { teamId, memberId, oldRole, newRole },
    });

    return true;
  }

  /**
   * Share task with team
   */
  shareTaskWithTeam(
    taskId: string,
    sharedBy: string,
    teamId: string,
    permissions: Partial<TaskPermissions> = {}
  ): SharedTask {
    const defaultPermissions: TaskPermissions = {
      canView: true,
      canEdit: false,
      canComment: true,
      canDelete: false,
      canShare: false,
      ...permissions,
    };

    const sharedTask: SharedTask = {
      taskId,
      sharedBy,
      sharedWith: [teamId],
      sharedAt: new Date(),
      permissions: defaultPermissions,
    };

    if (!this.sharedTasks.has(taskId)) {
      this.sharedTasks.set(taskId, []);
    }

    this.sharedTasks.get(taskId)!.push(sharedTask);

    this.logActivity({
      id: `log_${Date.now()}`,
      userId: sharedBy,
      userName: 'User',
      action: 'shared_task',
      taskId,
      timestamp: new Date(),
      details: { teamId, permissions: defaultPermissions },
    });

    return sharedTask;
  }

  /**
   * Get shared tasks
   */
  getSharedTasks(taskId: string): SharedTask[] {
    return this.sharedTasks.get(taskId) || [];
  }

  /**
   * Update task permissions
   */
  updateTaskPermissions(taskId: string, teamId: string, permissions: Partial<TaskPermissions>): boolean {
    const sharedTasks = this.sharedTasks.get(taskId);
    if (!sharedTasks) return false;

    const sharedTask = sharedTasks.find((st) => st.sharedWith.includes(teamId));
    if (!sharedTask) return false;

    sharedTask.permissions = { ...sharedTask.permissions, ...permissions };
    return true;
  }

  /**
   * Unshare task
   */
  unshareTask(taskId: string, teamId: string): boolean {
    const sharedTasks = this.sharedTasks.get(taskId);
    if (!sharedTasks) return false;

    const initialLength = sharedTasks.length;
    const filtered = sharedTasks.filter((st) => !st.sharedWith.includes(teamId));

    if (filtered.length < initialLength) {
      this.sharedTasks.set(taskId, filtered);
      return true;
    }

    return false;
  }

  /**
   * Log activity
   */
  private logActivity(activity: ActivityLog): void {
    this.activityLogs.push(activity);

    // Keep only last 1000 activities
    if (this.activityLogs.length > 1000) {
      this.activityLogs = this.activityLogs.slice(-1000);
    }
  }

  /**
   * Get team activity
   */
  getTeamActivity(teamId: string, limit: number = 50): ActivityLog[] {
    return this.activityLogs
      .filter((log) => log.details?.teamId === teamId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get user activity
   */
  getUserActivity(userId: string, limit: number = 50): ActivityLog[] {
    return this.activityLogs
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get team members
   */
  getTeamMembers(teamId: string): TeamMember[] {
    const team = this.teams.get(teamId);
    return team ? team.members : [];
  }

  /**
   * Get team statistics
   */
  getTeamStatistics(teamId: string): {
    totalMembers: number;
    activeMembers: number;
    sharedTasks: number;
    recentActivity: number;
  } {
    const team = this.teams.get(teamId);
    if (!team) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        sharedTasks: 0,
        recentActivity: 0,
      };
    }

    const activeMembers = team.members.filter((m) => m.status === 'active').length;
    const sharedTasksCount = Array.from(this.sharedTasks.values()).filter((tasks) =>
      tasks.some((t) => t.sharedWith.includes(teamId))
    ).length;

    const recentActivity = this.getTeamActivity(teamId, 24).length;

    return {
      totalMembers: team.members.length,
      activeMembers,
      sharedTasks: sharedTasksCount,
      recentActivity,
    };
  }

  /**
   * Update team settings
   */
  updateTeamSettings(teamId: string, settings: Partial<TeamSettings>): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    team.settings = { ...team.settings, ...settings };
    team.updatedAt = new Date();

    return true;
  }

  /**
   * Get all teams for user
   */
  getUserTeams(userId: string): Team[] {
    const userTeams: Team[] = [];

    this.teams.forEach((team) => {
      if (team.owner === userId || team.members.some((m) => m.id === userId)) {
        userTeams.push(team);
      }
    });

    return userTeams;
  }

  /**
   * Check permission
   */
  checkPermission(taskId: string, userId: string, permission: keyof TaskPermissions): boolean {
    const sharedTasks = this.sharedTasks.get(taskId);
    if (!sharedTasks) return false;

    for (const sharedTask of sharedTasks) {
      if (sharedTask.sharedWith.length > 0) {
        const perms = sharedTask.permissions;
        if (perms[permission]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Delete team
   */
  deleteTeam(teamId: string): boolean {
    if (this.teams.delete(teamId)) {
      // Remove all shared tasks for this team
      this.sharedTasks.forEach((tasks, taskId) => {
        this.sharedTasks.set(
          taskId,
          tasks.filter((t) => !t.sharedWith.includes(teamId))
        );
      });

      return true;
    }

    return false;
  }
}

export const teamCollaborationService = new TeamCollaborationService();
export default TeamCollaborationService;
