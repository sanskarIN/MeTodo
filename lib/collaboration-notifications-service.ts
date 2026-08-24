/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: lib/collaboration-notifications-service.ts
 * PURPOSE: Real-time notifications for collaboration events
 *
 * DESCRIPTION:
 * This service manages real-time notifications for collaboration events including:
 * - Task sharing notifications
 * - Task assignment notifications
 * - Comment notifications
 * - Activity notifications
 * - Permission change notifications
 * - Team member notifications
 *
 * FEATURES:
 * - Real-time push notifications
 * - In-app notification center
 * - Notification preferences
 * - Notification history
 * - Quiet hours support
 * - Notification batching
 * - Sound and vibration
 * - Custom notification actions
 *
 * DEPENDENCIES:
 * - Expo Notifications
 * - AsyncStorage
 * - React Native
 *
 * =============================================================================
 */

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Notification types
 */
export enum NotificationType {
  TASK_SHARED = "task_shared",
  TASK_ASSIGNED = "task_assigned",
  COMMENT_ADDED = "comment_added",
  COMMENT_REPLIED = "comment_replied",
  PERMISSION_CHANGED = "permission_changed",
  MEMBER_ADDED = "member_added",
  MEMBER_REMOVED = "member_removed",
  ACTIVITY_UPDATE = "activity_update",
  TASK_COMPLETED = "task_completed",
  TASK_UPDATED = "task_updated",
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

/**
 * Notification interface
 */
export interface CollaborationNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any>;
  priority: NotificationPriority;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
  relatedType?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursStart?: string; // HH:MM format
  quietHoursEnd?: string; // HH:MM format
  notificationTypes: {
    [key in NotificationType]?: boolean;
  };
}

/**
 * Collaboration Notifications Service
 *
 * Manages real-time notifications for collaboration events
 */
class CollaborationNotificationsService {
  private static instance: CollaborationNotificationsService;
  private notifications: Map<string, CollaborationNotification> = new Map();
  private preferences: NotificationPreferences = {
    enabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    notificationTypes: {
      [NotificationType.TASK_SHARED]: true,
      [NotificationType.TASK_ASSIGNED]: true,
      [NotificationType.COMMENT_ADDED]: true,
      [NotificationType.COMMENT_REPLIED]: true,
      [NotificationType.PERMISSION_CHANGED]: true,
      [NotificationType.MEMBER_ADDED]: true,
      [NotificationType.MEMBER_REMOVED]: true,
      [NotificationType.ACTIVITY_UPDATE]: true,
      [NotificationType.TASK_COMPLETED]: true,
      [NotificationType.TASK_UPDATED]: true,
    },
  };

  /**
   * Get singleton instance
   */
  public static getInstance(): CollaborationNotificationsService {
    if (!CollaborationNotificationsService.instance) {
      CollaborationNotificationsService.instance =
        new CollaborationNotificationsService();
    }
    return CollaborationNotificationsService.instance;
  }

  /**
   * Initialize notification service
   */
  public async initialize(): Promise<void> {
    if (Platform.OS === "web") {
      await this.loadPreferences();
      return;
    }

    try {
      // Load preferences from storage
      await this.loadPreferences();

      // Set up notification handler
      Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
          // Handle notification when app is in foreground
          await this.handleForegroundNotification(notification);
          return {
            shouldShowAlert: true,
            shouldPlaySound: this.preferences.soundEnabled,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          };
        },
      });

      // Listen for notification responses
      this.setupNotificationListeners();
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
    }
  }

  /**
   * Send task shared notification
   */
  public async notifyTaskShared(
    taskId: string,
    taskTitle: string,
    sharedBy: string,
    sharedByName: string,
    recipients: string[],
    permission: string
  ): Promise<void> {
    const notification: CollaborationNotification = {
      id: `task_shared_${taskId}_${Date.now()}`,
      type: NotificationType.TASK_SHARED,
      title: `Task Shared by ${sharedByName}`,
      body: `"${taskTitle}" has been shared with you (${permission} permission)`,
      data: {
        taskId,
        taskTitle,
        sharedBy,
        sharedByName,
        recipients,
        permission,
      },
      priority: NotificationPriority.NORMAL,
      timestamp: Date.now(),
      read: false,
      actionUrl: `/task-detail?taskId=${taskId}`,
      relatedId: taskId,
      relatedType: "task",
      sender: {
        id: sharedBy,
        name: sharedByName,
      },
    };

    await this.sendNotification(notification);
  }

  /**
   * Send task assigned notification
   */
  public async notifyTaskAssigned(
    taskId: string,
    taskTitle: string,
    assignedBy: string,
    assignedByName: string,
    dueDate?: Date
  ): Promise<void> {
    const notification: CollaborationNotification = {
      id: `task_assigned_${taskId}_${Date.now()}`,
      type: NotificationType.TASK_ASSIGNED,
      title: `Task Assigned by ${assignedByName}`,
      body: `You have been assigned: "${taskTitle}"${
        dueDate ? ` (Due: ${dueDate.toLocaleDateString()})` : ""
      }`,
      data: {
        taskId,
        taskTitle,
        assignedBy,
        assignedByName,
        dueDate: dueDate?.getTime(),
      },
      priority: NotificationPriority.HIGH,
      timestamp: Date.now(),
      read: false,
      actionUrl: `/task-detail?taskId=${taskId}`,
      relatedId: taskId,
      relatedType: "task",
      sender: {
        id: assignedBy,
        name: assignedByName,
      },
    };

    await this.sendNotification(notification);
  }

  /**
   * Send comment notification
   */
  public async notifyCommentAdded(
    taskId: string,
    taskTitle: string,
    commentAuthor: string,
    commentAuthorName: string,
    commentContent: string
  ): Promise<void> {
    const notification: CollaborationNotification = {
      id: `comment_${taskId}_${Date.now()}`,
      type: NotificationType.COMMENT_ADDED,
      title: `${commentAuthorName} commented on "${taskTitle}"`,
      body: commentContent.substring(0, 100),
      data: {
        taskId,
        taskTitle,
        commentAuthor,
        commentAuthorName,
        commentContent,
      },
      priority: NotificationPriority.NORMAL,
      timestamp: Date.now(),
      read: false,
      actionUrl: `/task-detail?taskId=${taskId}`,
      relatedId: taskId,
      relatedType: "task",
      sender: {
        id: commentAuthor,
        name: commentAuthorName,
      },
    };

    await this.sendNotification(notification);
  }

  /**
   * Send permission changed notification
   */
  public async notifyPermissionChanged(
    taskId: string,
    taskTitle: string,
    changedBy: string,
    changedByName: string,
    newPermission: string
  ): Promise<void> {
    const notification: CollaborationNotification = {
      id: `permission_${taskId}_${Date.now()}`,
      type: NotificationType.PERMISSION_CHANGED,
      title: `Permission Updated for "${taskTitle}"`,
      body: `Your permission has been changed to: ${newPermission}`,
      data: {
        taskId,
        taskTitle,
        changedBy,
        changedByName,
        newPermission,
      },
      priority: NotificationPriority.NORMAL,
      timestamp: Date.now(),
      read: false,
      actionUrl: `/task-detail?taskId=${taskId}`,
      relatedId: taskId,
      relatedType: "task",
      sender: {
        id: changedBy,
        name: changedByName,
      },
    };

    await this.sendNotification(notification);
  }

  /**
   * Send member added notification
   */
  public async notifyMemberAdded(
    taskId: string,
    taskTitle: string,
    memberName: string,
    addedBy: string,
    addedByName: string
  ): Promise<void> {
    const notification: CollaborationNotification = {
      id: `member_added_${taskId}_${Date.now()}`,
      type: NotificationType.MEMBER_ADDED,
      title: `${memberName} joined "${taskTitle}"`,
      body: `Added by ${addedByName}`,
      data: {
        taskId,
        taskTitle,
        memberName,
        addedBy,
        addedByName,
      },
      priority: NotificationPriority.NORMAL,
      timestamp: Date.now(),
      read: false,
      actionUrl: `/task-detail?taskId=${taskId}`,
      relatedId: taskId,
      relatedType: "task",
      sender: {
        id: addedBy,
        name: addedByName,
      },
    };

    await this.sendNotification(notification);
  }

  /**
   * Send activity notification
   */
  public async notifyActivity(
    taskId: string,
    taskTitle: string,
    activityType: string,
    activityDescription: string,
    actor: string,
    actorName: string
  ): Promise<void> {
    const notification: CollaborationNotification = {
      id: `activity_${taskId}_${Date.now()}`,
      type: NotificationType.ACTIVITY_UPDATE,
      title: `Activity on "${taskTitle}"`,
      body: activityDescription,
      data: {
        taskId,
        taskTitle,
        activityType,
        activityDescription,
        actor,
        actorName,
      },
      priority: NotificationPriority.LOW,
      timestamp: Date.now(),
      read: false,
      actionUrl: `/task-detail?taskId=${taskId}`,
      relatedId: taskId,
      relatedType: "task",
      sender: {
        id: actor,
        name: actorName,
      },
    };

    await this.sendNotification(notification);
  }

  /**
   * Send notification
   */
  private async sendNotification(
    notification: CollaborationNotification
  ): Promise<void> {
    try {
      // Check if notification type is enabled
      if (
        !this.preferences.notificationTypes[notification.type] ||
        !this.preferences.enabled
      ) {
        return;
      }

      // Check quiet hours
      if (this.isInQuietHours()) {
        // Store notification but don't send alert
        this.notifications.set(notification.id, notification);
        await this.saveNotifications();
        return;
      }

      // Store notification
      this.notifications.set(notification.id, notification);
      await this.saveNotifications();

      // Send push notification on native platforms only.
      if (Platform.OS === "web") {
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: this.preferences.soundEnabled ? "default" : undefined,
          vibrate: this.preferences.vibrationEnabled ? [0, 250, 250, 250] : undefined,
        },
        trigger: null as any, // Send immediately
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  /**
   * Get all notifications
   */
  public getNotifications(): CollaborationNotification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }

  /**
   * Get unread notifications
   */
  public getUnreadNotifications(): CollaborationNotification[] {
    return this.getNotifications().filter((n) => !n.read);
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
      await this.saveNotifications();
    }
  }

  /**
   * Mark all as read
   */
  public async markAllAsRead(): Promise<void> {
    this.notifications.forEach((notification) => {
      notification.read = true;
    });
    await this.saveNotifications();
  }

  /**
   * Delete notification
   */
  public async deleteNotification(notificationId: string): Promise<void> {
    this.notifications.delete(notificationId);
    await this.saveNotifications();
  }

  /**
   * Clear all notifications
   */
  public async clearAll(): Promise<void> {
    this.notifications.clear();
    await AsyncStorage.removeItem("collaboration_notifications");
  }

  /**
   * Get notification preferences
   */
  public getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  /**
   * Update notification preferences
   */
  public async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    await this.savePreferences();
  }

  /**
   * Check if in quiet hours
   */
  private isInQuietHours(): boolean {
    if (!this.preferences.quietHoursStart || !this.preferences.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const start = this.preferences.quietHoursStart;
    const end = this.preferences.quietHoursEnd;

    if (start < end) {
      return currentTime >= start && currentTime < end;
    } else {
      return currentTime >= start || currentTime < end;
    }
  }

  /**
   * Handle foreground notification
   */
  private async handleForegroundNotification(notification: any): Promise<void> {
    // Handle notification when app is in foreground
    const data = notification.request.content.data;
    if (data.taskId) {
      // Could trigger navigation or UI update
      console.log("Foreground notification:", data);
    }
  }

  /**
   * Setup notification listeners
   */
  private setupNotificationListeners(): void {
    if (Platform.OS === "web") {
      return;
    }

    // Listen for notification responses
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data.actionUrl) {
        // Navigate to action URL
        console.log("Notification action:", data.actionUrl);
      }
    });
  }

  /**
   * Save notifications to storage
   */
  private async saveNotifications(): Promise<void> {
    try {
      const data = Array.from(this.notifications.values());
      await AsyncStorage.setItem(
        "collaboration_notifications",
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Failed to save notifications:", error);
    }
  }

  /**
   * Load notifications from storage
   */
  private async loadNotifications(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem("collaboration_notifications");
      if (data) {
        const notifications = JSON.parse(data) as CollaborationNotification[];
        notifications.forEach((n) => this.notifications.set(n.id, n));
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }

  /**
   * Save preferences to storage
   */
  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "notification_preferences",
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  }

  /**
   * Load preferences from storage
   */
  private async loadPreferences(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem("notification_preferences");
      if (data) {
        this.preferences = JSON.parse(data);
      }
      // Also load notifications
      await this.loadNotifications();
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  }

  /**
   * Get notification count
   */
  public getNotificationCount(): number {
    return this.notifications.size;
  }

  /**
   * Get unread count
   */
  public getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  /**
   * Get notifications by type
   */
  public getNotificationsByType(type: NotificationType): CollaborationNotification[] {
    return this.getNotifications().filter((n) => n.type === type);
  }

  /**
   * Get notifications by related ID
   */
  public getNotificationsByRelatedId(
    relatedId: string
  ): CollaborationNotification[] {
    return this.getNotifications().filter((n) => n.relatedId === relatedId);
  }

  /**
   * Get notifications by sender
   */
  public getNotificationsBySender(senderId: string): CollaborationNotification[] {
    return this.getNotifications().filter((n) => n.sender?.id === senderId);
  }

  /**
   * Get recent notifications
   */
  public getRecentNotifications(limit: number = 10): CollaborationNotification[] {
    return this.getNotifications().slice(0, limit);
  }
}

export default CollaborationNotificationsService.getInstance();
