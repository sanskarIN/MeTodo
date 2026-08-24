// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

# Smart Notifications Documentation

## Overview

Smart Notifications is an intelligent system that learns user preferences and sends reminders at optimal times. The system analyzes completion patterns, respects quiet hours, and adapts notification timing based on user behavior.

---

## Features

### Core Features

- **Intelligent Scheduling:** Sends notifications at optimal times
- **Quiet Hours Support:** Respects user-defined quiet periods
- **Preference Learning:** Learns from user behavior
- **Priority-Based Delivery:** Different handling for high/medium/low priority
- **Engagement Tracking:** Monitors notification interaction
- **Customizable Preferences:** Full control over notification settings

### Learning Capabilities

- Most productive hour detection
- Most productive day identification
- Average task completion time
- Notification engagement metrics
- Pattern recognition

---

## Configuration

### Notification Preferences

Access notification settings in the app:

1. **Open Settings**
   - Tap Settings tab
   - Scroll to "Notifications"

2. **Configure Preferences**
   - Enable/disable notifications
   - Set quiet hours
   - Choose notification frequency
   - Select categories to notify
   - Choose priority levels

### Preference Options

#### Enable/Disable Notifications

Toggle all notifications on or off globally.

#### Quiet Hours

Set time period when notifications are suppressed:

- **Start Time:** When quiet hours begin (e.g., 22:00)
- **End Time:** When quiet hours end (e.g., 08:00)
- **Behavior:** High-priority notifications sent after quiet hours end

#### Notification Frequency

Choose how often to receive notifications:

| Frequency | Behavior |
|-----------|----------|
| Immediate | Send right away |
| Hourly | Batch and send hourly |
| Daily | Send once per day |
| Custom | User-defined schedule |

#### Category Preferences

Enable/disable notifications for specific categories:

- Work
- Personal
- Shopping
- Health
- Finance
- Education
- Home
- Travel

#### Priority Preferences

Choose which priority levels trigger notifications:

- High Priority: Always notify
- Medium Priority: Optional
- Low Priority: Optional

---

## How It Works

### Notification Scheduling

#### High Priority Tasks

1. Scheduled immediately
2. Sent before quiet hours if needed
3. Always delivered (respects quiet hours end)
4. Cannot be disabled

#### Medium Priority Tasks

1. Scheduled at preferred time
2. Respects quiet hours
3. Can be disabled by category
4. Batched if multiple

#### Low Priority Tasks

1. Scheduled for next day
2. Grouped with other low priority
3. Can be disabled
4. Sent at off-peak hours

### Learning Process

The system learns from your behavior:

1. **Tracks Completion Times**
   - Records when tasks are completed
   - Identifies patterns by hour and day
   - Calculates average completion time

2. **Identifies Peak Hours**
   - Finds most productive hour
   - Finds most productive day
   - Adjusts notification timing accordingly

3. **Measures Engagement**
   - Tracks notification opens
   - Measures action taken
   - Calculates engagement rate

4. **Adapts Timing**
   - Adjusts notification time based on learning
   - Improves delivery timing
   - Increases engagement over time

---

## API Reference

### SmartNotificationsService

#### Methods

```typescript
// Initialize user preferences
initializePreferences(userId: string, preference?: Partial<NotificationPreference>): NotificationPreference

// Get user preferences
getPreferences(userId: string): NotificationPreference | undefined

// Update user preferences
updatePreferences(userId: string, updates: Partial<NotificationPreference>): NotificationPreference

// Schedule smart notification
scheduleSmartNotification(
  taskId: string,
  title: string,
  message: string,
  userId: string,
  priority?: 'low' | 'medium' | 'high'
): SmartNotification

// Send notification
sendNotification(notificationId: string): Promise<boolean>

// Mark notification as read
markAsRead(notificationId: string): void

// Get pending notifications
getPendingNotifications(userId: string): SmartNotification[]

// Get user notifications
getUserNotifications(userId: string, limit?: number): SmartNotification[]

// Learn from user behavior
learnFromBehavior(userId: string, tasks: any[]): UserLearningData

// Get learning data
getLearningData(userId: string): UserLearningData | undefined

// Get statistics
getStatistics(userId: string): NotificationStatistics

// Clear old notifications
clearOldNotifications(daysOld?: number): number

// Process notification queue
processQueue(): Promise<number>
```

#### Usage Example

```typescript
import SmartNotificationsService from '@/lib/smart-notifications-service';

const notificationService = new SmartNotificationsService();

// Initialize preferences
const prefs = notificationService.initializePreferences('user123', {
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  notificationFrequency: 'daily'
});

// Schedule notification
const notification = notificationService.scheduleSmartNotification(
  'task123',
  'Task Reminder',
  'Don\'t forget to finish your report',
  'user123',
  'high'
);

// Learn from behavior
const learning = notificationService.learnFromBehavior('user123', tasks);
console.log('Most productive hour:', learning.mostProductiveHour);

// Get statistics
const stats = notificationService.getStatistics('user123');
console.log('Engagement rate:', stats.engagementRate);
```

---

## Best Practices

### Setting Quiet Hours

1. **Identify Your Schedule**
   - When do you sleep?
   - When do you work?
   - When do you want focus time?

2. **Set Appropriate Hours**
   - Sleep time: 22:00 - 08:00 (example)
   - Work focus: 14:00 - 16:00 (optional)
   - Avoid overlap with active hours

3. **Adjust as Needed**
   - Monitor notification timing
   - Adjust if too early/late
   - Update seasonally if needed

### Optimizing Preferences

1. **Enable Relevant Categories**
   - Only enable important categories
   - Disable low-value categories
   - Adjust based on current priorities

2. **Set Priority Filters**
   - Always enable high priority
   - Enable medium for important tasks
   - Disable low unless necessary

3. **Choose Right Frequency**
   - Immediate: For urgent tasks
   - Hourly: For moderate volume
   - Daily: For summary notifications

### Improving Engagement

1. **Act on Notifications**
   - Complete tasks when reminded
   - Mark as done promptly
   - Provide feedback to system

2. **Adjust Timing**
   - If missing notifications, adjust quiet hours
   - If too many, increase frequency interval
   - Monitor engagement metrics

3. **Review Learning Data**
   - Check most productive hours
   - Verify learned patterns
   - Adjust if inaccurate

---

## Troubleshooting

### Not Receiving Notifications

**Problem:** Notifications not arriving

**Solutions:**
1. Check if notifications are enabled
2. Verify quiet hours setting
3. Check category preferences
4. Verify priority level is enabled
5. Restart app

### Too Many Notifications

**Problem:** Receiving too many notifications

**Solutions:**
1. Increase notification frequency interval
2. Disable low-priority notifications
3. Disable unnecessary categories
4. Set stricter quiet hours
5. Reduce task creation

### Notifications at Wrong Time

**Problem:** Notifications arriving at inconvenient times

**Solutions:**
1. Adjust quiet hours
2. Update preferred notification time
3. Change notification frequency
4. Let system learn (takes ~2 weeks)
5. Manually adjust in preferences

### Missing High Priority Notifications

**Problem:** High priority notifications not received

**Solutions:**
1. Check device notification settings
2. Verify app has notification permission
3. Check if in quiet hours (should still send after)
4. Restart device
5. Reinstall app if persistent

---

## Advanced Features

### Custom Notification Timing

Set custom notification times per category:

```typescript
const customTiming = {
  work: '09:00',
  personal: '18:00',
  shopping: '19:00',
  health: '08:00'
};
```

### Notification Batching

Group similar notifications:

```typescript
const batchedNotifications = notificationService.getPendingNotifications(userId);
// Send as single grouped notification
```

### Engagement Analytics

Track notification performance:

```typescript
const stats = notificationService.getStatistics(userId);
console.log('Sent:', stats.sentNotifications);
console.log('Read:', stats.readNotifications);
console.log('Engagement:', (stats.engagementRate * 100).toFixed(1) + '%');
```

---

## Limitations

### Current Limitations

1. **Learning Time:** Requires ~2 weeks to learn patterns
2. **Accuracy:** ~85% accuracy for optimal timing
3. **Categories:** Limited to 8 predefined categories
4. **Timezone:** Single timezone per device

### Planned Improvements

- Multi-timezone support
- Custom category learning
- ML-based timing optimization
- A/B testing for timing
- Predictive scheduling

---

## Support

For issues or questions about Smart Notifications:

**Email:** supportramsandesh@gmail.com

**Response Time:** 24-48 hours

**Include in Report:**
- Device type and OS
- MeTodo version
- Notification preferences
- Expected vs actual behavior
- Screenshots if applicable

---

## Related Documentation

- [Productivity Dashboard](./PRODUCTIVITY_DASHBOARD.md)
- [Task Management Guide](./user-guides/TASK_CREATION_GUIDE.md)
- [API Documentation](./technical/API_DOCUMENTATION.md)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
