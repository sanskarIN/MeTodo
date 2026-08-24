// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Smart Notifications Service
 * 
 * Intelligent notification system that learns user preferences and
 * sends reminders at optimal times based on completion patterns.
 * 
 * Features:
 * - Intelligent reminder scheduling
 * - User preference learning
 * - Quiet hours support
 * - Notification prioritization
 * - Delivery optimization
 */

/**
 * Notification preference interface
 */
export interface NotificationPreference {
  userId: string;
  enableNotifications: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string;
  preferredNotificationTime: string; // HH:MM format
  notificationFrequency: 'immediate' | 'hourly' | 'daily' | 'custom';
  categories: Record<string, boolean>;
  priorities: Record<string, boolean>;
}

/**
 * Smart notification interface
 */
export interface SmartNotification {
  id: string;
  taskId: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  scheduledTime: Date;
  sent: boolean;
  sentTime?: Date;
  read: boolean;
  readTime?: Date;
  action?: string;
}

/**
 * User learning data interface
 */
export interface UserLearningData {
  userId: string;
  mostProductiveHour: number;
  mostProductiveDay: string;
  averageResponseTime: number; // milliseconds
  preferredNotificationTime: string;
  completionPatterns: Record<string, number>;
  notificationEngagement: number; // 0-1
  lastUpdated: Date;
}

/**
 * Smart Notifications Service Class
 */
export class SmartNotificationsService {
  private notifications: Map<string, SmartNotification> = new Map();
  private preferences: Map<string, NotificationPreference> = new Map();
  private learningData: Map<string, UserLearningData> = new Map();
  private notificationQueue: SmartNotification[] = [];

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Initialize user preferences
   */
  initializePreferences(userId: string, preference?: Partial<NotificationPreference>): NotificationPreference {
    const defaultPreference: NotificationPreference = {
      userId,
      enableNotifications: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      preferredNotificationTime: '09:00',
      notificationFrequency: 'daily',
      categories: {
        work: true,
        personal: true,
        shopping: true,
        health: true,
      },
      priorities: {
        high: true,
        medium: true,
        low: false,
      },
      ...preference,
    };

    this.preferences.set(userId, defaultPreference);
    return defaultPreference;
  }

  /**
   * Get user preferences
   */
  getPreferences(userId: string): NotificationPreference | undefined {
    return this.preferences.get(userId);
  }

  /**
   * Update user preferences
   */
  updatePreferences(userId: string, updates: Partial<NotificationPreference>): NotificationPreference {
    const current = this.preferences.get(userId) || this.initializePreferences(userId);
    const updated = { ...current, ...updates };
    this.preferences.set(userId, updated);
    return updated;
  }

  /**
   * Schedule smart notification
   */
  scheduleSmartNotification(
    taskId: string,
    title: string,
    message: string,
    userId: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): SmartNotification {
    const notification: SmartNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      title,
      message,
      priority,
      scheduledTime: this.calculateOptimalNotificationTime(userId, priority),
      sent: false,
      read: false,
    };

    this.notifications.set(notification.id, notification);
    this.notificationQueue.push(notification);

    return notification;
  }

  /**
   * Calculate optimal notification time
   */
  private calculateOptimalNotificationTime(userId: string, priority: string): Date {
    const preferences = this.preferences.get(userId);
    const learning = this.learningData.get(userId);

    if (!preferences) {
      return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    }

    let scheduledTime = new Date();

    // High priority: send immediately if not in quiet hours
    if (priority === 'high') {
      if (this.isInQuietHours(scheduledTime, preferences)) {
        scheduledTime = this.getNextQuietHourEnd(scheduledTime, preferences);
      }
      return scheduledTime;
    }

    // Use learning data if available
    if (learning) {
      const preferredHour = parseInt(learning.preferredNotificationTime.split(':')[0]);
      scheduledTime.setHours(preferredHour, 0, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
    } else {
      // Use preference
      const [hour, minute] = preferences.preferredNotificationTime.split(':').map(Number);
      scheduledTime.setHours(hour, minute, 0, 0);

      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
    }

    // Adjust if in quiet hours
    if (this.isInQuietHours(scheduledTime, preferences)) {
      scheduledTime = this.getNextQuietHourEnd(scheduledTime, preferences);
    }

    return scheduledTime;
  }

  /**
   * Check if time is in quiet hours
   */
  private isInQuietHours(time: Date, preferences: NotificationPreference): boolean {
    const [quietStart, quietEnd] = [
      preferences.quietHoursStart.split(':').map(Number),
      preferences.quietHoursEnd.split(':').map(Number),
    ];

    const currentHour = time.getHours();
    const currentMinute = time.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const startTime = quietStart[0] * 60 + quietStart[1];
    const endTime = quietEnd[0] * 60 + quietEnd[1];

    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime < endTime;
    } else {
      return currentTime >= startTime && currentTime < endTime;
    }
  }

  /**
   * Get next quiet hour end time
   */
  private getNextQuietHourEnd(time: Date, preferences: NotificationPreference): Date {
    const [, quietEnd] = preferences.quietHoursEnd.split(':').map(Number);
    const result = new Date(time);
    result.setHours(quietEnd, 0, 0, 0);

    if (result <= time) {
      result.setDate(result.getDate() + 1);
    }

    return result;
  }

  /**
   * Send notification
   */
  async sendNotification(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);

    if (!notification) {
      return false;
    }

    notification.sent = true;
    notification.sentTime = new Date();

    return true;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.get(notificationId);

    if (notification) {
      notification.read = true;
      notification.readTime = new Date();
    }
  }

  /**
   * Get pending notifications
   */
  getPendingNotifications(userId: string): SmartNotification[] {
    const now = new Date();
    const pending: SmartNotification[] = [];

    this.notifications.forEach((notif) => {
      if (!notif.sent && notif.scheduledTime <= now) {
        pending.push(notif);
      }
    });

    return pending;
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId: string, limit: number = 10): SmartNotification[] {
    const userNotifications = Array.from(this.notifications.values())
      .sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime())
      .slice(0, limit);

    return userNotifications;
  }

  /**
   * Learn from user behavior
   */
  learnFromBehavior(userId: string, tasks: any[]): UserLearningData {
    const completedTasks = tasks.filter((t) => t.completed);
    const completionTimes = completedTasks
      .filter((t) => t.completedAt)
      .map((t) => new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime());

    const averageResponseTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;

    // Find most productive hour
    const hourCounts = new Map<number, number>();
    completedTasks.forEach((t) => {
      if (t.completedAt) {
        const hour = new Date(t.completedAt).getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      }
    });

    let mostProductiveHour = 9;
    let maxCount = 0;
    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        mostProductiveHour = hour;
      }
    });

    // Find most productive day
    const dayCounts = new Map<string, number>();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    completedTasks.forEach((t) => {
      if (t.completedAt) {
        const day = days[new Date(t.completedAt).getDay()];
        dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
      }
    });

    let mostProductiveDay = 'Monday';
    maxCount = 0;
    dayCounts.forEach((count, day) => {
      if (count > maxCount) {
        maxCount = count;
        mostProductiveDay = day;
      }
    });

    // Calculate notification engagement
    const sentNotifications = Array.from(this.notifications.values()).filter((n) => n.sent).length;
    const readNotifications = Array.from(this.notifications.values()).filter((n) => n.read).length;
    const engagement = sentNotifications > 0 ? readNotifications / sentNotifications : 0;

    const learning: UserLearningData = {
      userId,
      mostProductiveHour,
      mostProductiveDay,
      averageResponseTime,
      preferredNotificationTime: `${mostProductiveHour}:00`,
      completionPatterns: Object.fromEntries(dayCounts),
      notificationEngagement: engagement,
      lastUpdated: new Date(),
    };

    this.learningData.set(userId, learning);
    return learning;
  }

  /**
   * Get learning data
   */
  getLearningData(userId: string): UserLearningData | undefined {
    return this.learningData.get(userId);
  }

  /**
   * Get notification statistics
   */
  getStatistics(userId: string): {
    totalNotifications: number;
    sentNotifications: number;
    readNotifications: number;
    engagementRate: number;
  } {
    const userNotifications = Array.from(this.notifications.values());
    const sent = userNotifications.filter((n) => n.sent).length;
    const read = userNotifications.filter((n) => n.read).length;

    return {
      totalNotifications: userNotifications.length,
      sentNotifications: sent,
      readNotifications: read,
      engagementRate: sent > 0 ? read / sent : 0,
    };
  }

  /**
   * Clear old notifications
   */
  clearOldNotifications(daysOld: number = 30): number {
    const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    let cleared = 0;

    this.notifications.forEach((notif, id) => {
      if (notif.sentTime && notif.sentTime < cutoff) {
        this.notifications.delete(id);
        cleared++;
      }
    });

    return cleared;
  }

  /**
   * Process notification queue
   */
  async processQueue(): Promise<number> {
    const now = new Date();
    let processed = 0;

    for (const notification of this.notificationQueue) {
      if (notification.scheduledTime <= now && !notification.sent) {
        await this.sendNotification(notification.id);
        processed++;
      }
    }

    return processed;
  }
}

export const smartNotificationsService = new SmartNotificationsService();
export default SmartNotificationsService;
