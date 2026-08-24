// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Notification Service
 * 
 * This service handles all push notification and reminder functionality for MeTodo.
 * Manages scheduling, sending, and handling notifications for task reminders,
 * deadlines, and other important events.
 * 
 * Features:
 * - Schedule task reminders
 * - Send push notifications
 * - Manage notification preferences
 * - Handle notification responses
 * - Quiet hours support
 * - Custom notification sounds
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Notification types
 */
export enum NotificationType {
  TASK_REMINDER = 'task_reminder',
  TASK_DUE = 'task_due',
  TASK_OVERDUE = 'task_overdue',
  DAILY_SUMMARY = 'daily_summary',
  ACHIEVEMENT = 'achievement',
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
  LOW = 'low',
  DEFAULT = 'default',
  HIGH = 'high',
  MAX = 'max',
}

/**
 * Notification configuration interface
 */
export interface NotificationConfig {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  quietHoursStart: number; // 0-23
  quietHoursEnd: number; // 0-23
  reminderTime: number; // minutes before due date
  dailySummaryTime: string; // HH:mm format
}

/**
 * Notification payload interface
 */
export interface NotificationPayload {
  type: NotificationType;
  taskId: string;
  taskTitle: string;
  taskDescription?: string;
  dueDate?: string;
  priority?: string;
  action?: string;
}

/**
 * Notification Service Class
 * 
 * Handles all notification operations including scheduling, sending,
 * and managing notification preferences.
 */
export class NotificationService {
  private static instance: NotificationService;
  private config: NotificationConfig = {
    enabled: true,
    sound: true,
    vibration: true,
    quietHoursStart: 22,
    quietHoursEnd: 8,
    reminderTime: 15,
    dailySummaryTime: '09:00',
  };

  private constructor() {
    if (Platform.OS !== 'web') {
      this.setupNotificationHandler();
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: this.config.sound,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // Request permissions on native platforms only.
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  /**
   * Setup notification handler
   */
  private setupNotificationHandler(): void {
    if (Platform.OS === 'web') {
      return;
    }

    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // Handle notification response (when user taps notification)
    Notifications.addNotificationResponseReceivedListener((response) => {
      this.handleNotificationResponse(response);
    });
  }

  /**
   * Handle notification response
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const { notification } = response;
    const payload = notification.request.content.data as unknown as NotificationPayload;

    console.log('Notification response:', payload);
    // Handle based on notification type
    // Navigate to task detail, mark complete, etc.
  }

  /**
   * Check if currently in quiet hours
   */
  private isInQuietHours(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const { quietHoursStart, quietHoursEnd } = this.config;

    if (quietHoursStart < quietHoursEnd) {
      return currentHour >= quietHoursStart && currentHour < quietHoursEnd;
    } else {
      return currentHour >= quietHoursStart || currentHour < quietHoursEnd;
    }
  }

  /**
   * Schedule task reminder notification
   */
  async scheduleTaskReminder(
    taskId: string,
    taskTitle: string,
    dueDate: Date,
    priority: string = 'medium'
  ): Promise<string | null> {
    if (Platform.OS === 'web' || !this.config.enabled) {
      return null;
    }

    try {
      const reminderTime = new Date(dueDate.getTime() - this.config.reminderTime * 60000);

      // Don't schedule if in the past
      if (reminderTime < new Date()) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `${taskTitle} is due soon`,
          data: {
            type: NotificationType.TASK_REMINDER,
            taskId,
            taskTitle,
            dueDate: dueDate.toISOString(),
            priority,
          },
          sound: this.config.sound && !this.isInQuietHours() ? 'default' : undefined,
          vibrate: this.config.vibration && !this.isInQuietHours() ? [200, 100, 200] : [],
          badge: 1,
        },
        trigger: reminderTime as any,
      });

      console.log(`Scheduled reminder for task ${taskId}:`, notificationId);
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule task reminder:', error);
      return null;
    }
  }

  /**
   * Schedule task due notification
   */
  async scheduleTaskDueNotification(
    taskId: string,
    taskTitle: string,
    dueDate: Date
  ): Promise<string | null> {
    if (Platform.OS === 'web' || !this.config.enabled) {
      return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Due',
          body: `${taskTitle} is due now`,
          data: {
            type: NotificationType.TASK_DUE,
            taskId,
            taskTitle,
            dueDate: dueDate.toISOString(),
          },
          sound: this.config.sound ? 'default' : undefined,
          vibrate: this.config.vibration ? [200, 100, 200] : [],
          badge: 1,
        },
        trigger: dueDate as any,
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule task due notification:', error);
      return null;
    }
  }

  /**
   * Send immediate notification
   */
  async sendNotification(
    title: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<string | null> {
    if (Platform.OS === 'web' || !this.config.enabled) {
      return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: payload,
          sound: this.config.sound && !this.isInQuietHours() ? 'default' : undefined,
          vibrate: this.config.vibration && !this.isInQuietHours() ? [200, 100, 200] : [],
          badge: 1,
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return null;
    }
  }

  /**
   * Cancel notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Cancelled notification: ${notificationId}`);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  /**
   * Update notification configuration
   */
  updateConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Updated notification config:', this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  /**
   * Enable notifications
   */
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * Disable notifications
   */
  disable(): void {
    this.config.enabled = false;
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
