// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Collaboration UI Service
 * 
 * This service manages the UI logic for task sharing and real-time collaboration.
 * It handles shared task management, permission controls, activity tracking,
 * and real-time updates for collaborative features.
 * 
 * Features:
 * - Share tasks with team members
 * - Manage permissions (view, edit, delete)
 * - Track activity and changes
 * - Real-time updates
 * - Collaboration notifications
 * - Task assignment
 */

/**
 * Permission levels enum
 */
export enum PermissionLevel {
  VIEW = "view",
  EDIT = "edit",
  ADMIN = "admin",
}

/**
 * Collaboration member interface
 */
export interface CollaborationMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permission: PermissionLevel;
  joinedAt: Date;
  lastActive: Date;
}

/**
 * Shared task interface
 */
export interface SharedTask {
  id: string;
  taskId: string;
  sharedBy: string;
  sharedWith: CollaborationMember[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * Activity log interface
 */
export interface ActivityLog {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: "created" | "updated" | "completed" | "commented" | "assigned";
  details: string;
  timestamp: Date;
}

/**
 * Task assignment interface
 */
export interface TaskAssignment {
  id: string;
  taskId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  status: "pending" | "accepted" | "rejected" | "completed";
}

/**
 * Comment interface
 */
export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: TaskComment[];
}

/**
 * Collaboration UI Service Class
 */
export class CollaborationUIService {
  private static sharedTasks: SharedTask[] = [];
  private static activityLogs: ActivityLog[] = [];
  private static taskAssignments: TaskAssignment[] = [];
  private static taskComments: TaskComment[] = [];
  private static collaborationMembers: Map<string, CollaborationMember[]> = new Map();

  /**
   * Share a task with team members
   */
  static async shareTask(
    taskId: string,
    emails: string[],
    permission: PermissionLevel = PermissionLevel.EDIT
  ): Promise<SharedTask> {
    const sharedMembers: CollaborationMember[] = emails.map((email) => ({
      id: `user_${Date.now()}_${Math.random()}`,
      name: email.split("@")[0],
      email,
      permission,
      joinedAt: new Date(),
      lastActive: new Date(),
    }));

    const sharedTask: SharedTask = {
      id: `shared_${Date.now()}`,
      taskId,
      sharedBy: "current_user",
      sharedWith: sharedMembers,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    this.sharedTasks.push(sharedTask);
    this.collaborationMembers.set(taskId, sharedMembers);

    // Log activity
    await this.logActivity(taskId, "current_user", "created", `Shared task with ${emails.length} members`);

    return sharedTask;
  }

  /**
   * Update member permission
   */
  static async updateMemberPermission(
    taskId: string,
    memberId: string,
    permission: PermissionLevel
  ): Promise<void> {
    const members = this.collaborationMembers.get(taskId);
    if (!members) {
      throw new Error("Task not shared");
    }

    const member = members.find((m) => m.id === memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    member.permission = permission;
    member.lastActive = new Date();

    // Update shared task
    const sharedTask = this.sharedTasks.find((st) => st.taskId === taskId);
    if (sharedTask) {
      sharedTask.updatedAt = new Date();
    }

    await this.logActivity(
      taskId,
      "current_user",
      "updated",
      `Updated ${member.name}'s permission to ${permission}`
    );
  }

  /**
   * Remove member from shared task
   */
  static async removeMember(taskId: string, memberId: string): Promise<void> {
    const members = this.collaborationMembers.get(taskId);
    if (!members) {
      throw new Error("Task not shared");
    }

    const memberIndex = members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new Error("Member not found");
    }

    const removedMember = members[memberIndex];
    members.splice(memberIndex, 1);

    // Update shared task
    const sharedTask = this.sharedTasks.find((st) => st.taskId === taskId);
    if (sharedTask) {
      sharedTask.sharedWith = members;
      sharedTask.updatedAt = new Date();
    }

    await this.logActivity(
      taskId,
      "current_user",
      "updated",
      `Removed ${removedMember.name} from shared task`
    );
  }

  /**
   * Get shared task members
   */
  static getSharedTaskMembers(taskId: string): CollaborationMember[] {
    return this.collaborationMembers.get(taskId) || [];
  }

  /**
   * Assign task to member
   */
  static async assignTask(
    taskId: string,
    assignToId: string,
    dueDate?: Date
  ): Promise<TaskAssignment> {
    const assignment: TaskAssignment = {
      id: `assignment_${Date.now()}`,
      taskId,
      assignedTo: assignToId,
      assignedBy: "current_user",
      assignedAt: new Date(),
      dueDate,
      status: "pending",
    };

    this.taskAssignments.push(assignment);

    const member = this.getSharedTaskMembers(taskId).find(
      (m) => m.id === assignToId
    );
    if (member) {
      await this.logActivity(
        taskId,
        "current_user",
        "assigned",
        `Assigned task to ${member.name}`
      );
    }

    return assignment;
  }

  /**
   * Accept task assignment
   */
  static async acceptAssignment(assignmentId: string): Promise<void> {
    const assignment = this.taskAssignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    assignment.status = "accepted";

    await this.logActivity(
      assignment.taskId,
      assignment.assignedTo,
      "updated",
      "Accepted task assignment"
    );
  }

  /**
   * Reject task assignment
   */
  static async rejectAssignment(assignmentId: string): Promise<void> {
    const assignment = this.taskAssignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    assignment.status = "rejected";

    await this.logActivity(
      assignment.taskId,
      assignment.assignedTo,
      "updated",
      "Rejected task assignment"
    );
  }

  /**
   * Add comment to task
   */
  static async addComment(
    taskId: string,
    userId: string,
    userName: string,
    content: string
  ): Promise<TaskComment> {
    const comment: TaskComment = {
      id: `comment_${Date.now()}`,
      taskId,
      userId,
      userName,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      replies: [],
    };

    this.taskComments.push(comment);

    await this.logActivity(taskId, userId, "commented", `Added comment: ${content.substring(0, 50)}...`);

    return comment;
  }

  /**
   * Reply to comment
   */
  static async replyToComment(
    taskId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string
  ): Promise<TaskComment> {
    const comment = this.taskComments.find((c) => c.id === commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const reply: TaskComment = {
      id: `comment_${Date.now()}`,
      taskId,
      userId,
      userName,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      replies: [],
    };

    comment.replies.push(reply);

    await this.logActivity(taskId, userId, "commented", `Replied to comment`);

    return reply;
  }

  /**
   * Like comment
   */
  static async likeComment(commentId: string): Promise<void> {
    const comment = this.taskComments.find((c) => c.id === commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    comment.likes++;
  }

  /**
   * Get task comments
   */
  static getTaskComments(taskId: string): TaskComment[] {
    return this.taskComments.filter((c) => c.taskId === taskId);
  }

  /**
   * Get activity log
   */
  static getActivityLog(taskId: string, limit: number = 50): ActivityLog[] {
    return this.activityLogs
      .filter((log) => log.taskId === taskId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Log activity
   */
  private static async logActivity(
    taskId: string,
    userId: string,
    action: ActivityLog["action"],
    details: string
  ): Promise<void> {
    const log: ActivityLog = {
      id: `log_${Date.now()}`,
      taskId,
      userId,
      userName: "User",
      action,
      details,
      timestamp: new Date(),
    };

    this.activityLogs.push(log);
  }

  /**
   * Get all shared tasks
   */
  static getSharedTasks(): SharedTask[] {
    return this.sharedTasks.filter((st) => st.isActive);
  }

  /**
   * Get task assignments
   */
  static getTaskAssignments(taskId: string): TaskAssignment[] {
    return this.taskAssignments.filter((a) => a.taskId === taskId);
  }

  /**
   * Get pending assignments for user
   */
  static getPendingAssignments(userId: string): TaskAssignment[] {
    return this.taskAssignments.filter(
      (a) => a.assignedTo === userId && a.status === "pending"
    );
  }

  /**
   * Stop sharing task
   */
  static async stopSharing(taskId: string): Promise<void> {
    const sharedTask = this.sharedTasks.find((st) => st.taskId === taskId);
    if (sharedTask) {
      sharedTask.isActive = false;
      sharedTask.updatedAt = new Date();
    }

    this.collaborationMembers.delete(taskId);

    await this.logActivity(
      taskId,
      "current_user",
      "updated",
      "Stopped sharing task"
    );
  }

  /**
   * Get collaboration statistics
   */
  static getCollaborationStats(): {
    totalSharedTasks: number;
    totalMembers: number;
    totalComments: number;
    totalAssignments: number;
    pendingAssignments: number;
  } {
    const allMembers = Array.from(this.collaborationMembers.values()).flat();

    return {
      totalSharedTasks: this.sharedTasks.filter((st) => st.isActive).length,
      totalMembers: new Set(allMembers.map((m) => m.id)).size,
      totalComments: this.taskComments.length,
      totalAssignments: this.taskAssignments.length,
      pendingAssignments: this.taskAssignments.filter(
        (a) => a.status === "pending"
      ).length,
    };
  }

  /**
   * Clear collaboration data
   */
  static async clearCollaborationData(): Promise<void> {
    this.sharedTasks = [];
    this.activityLogs = [];
    this.taskAssignments = [];
    this.taskComments = [];
    this.collaborationMembers.clear();
  }
}

export default CollaborationUIService;
