# Device Calendar Integration

## Overview

MeTodo lets a user add an individual task deadline to the device calendar from the task-detail screen. The feature is **explicit and opt-in**: MeTodo never scans an existing calendar, never syncs tasks automatically, and only writes an event after the user taps **Add to Device Calendar**.

## Supported Platforms

| Platform | Behavior |
|---|---|
| Android | Creates, updates, opens, and removes a linked calendar event after calendar permission is granted. |
| iOS | Creates, updates, opens, and removes a linked calendar event after calendar permission is granted. |
| Web | Shows an availability explanation and performs no calendar API calls. |

The underlying Expo Calendar module is supported on Android and iOS; its availability check returns `true` only on those native platforms.[1]

## Task Link Model

Each task can persist an optional `calendarEvent` link:

| Field | Purpose |
|---|---|
| `eventId` | Identifies the event created on the device. |
| `calendarId` | Identifies the writable device calendar selected for the event. |
| `linkedAt` | Records when MeTodo created the link. |
| `lastSyncedAt` | Records the latest successful user-initiated event update. |

This metadata is stored together with the task in local AsyncStorage. A task without a due date cannot be linked. MeTodo maps date-only deadlines to a one-hour event beginning at 09:00 in the device time zone and adds a 30-minute calendar alarm.

## User Flow

1. Create a task with a due date, or open an existing task with a due date.
2. Open **Device Calendar** in task details and tap **Add to Device Calendar**.
3. Grant calendar permission if the operating system asks for it.
4. MeTodo selects a writable calendar and creates one task event.
5. Use **View in Calendar** to open the operating-system event UI, **Update Calendar Event** to manually refresh task title/details/date, or **Remove Calendar Event** to delete the external event and unlink the task.

> Removing a task in MeTodo does not silently delete a calendar event. Use **Remove Calendar Event** first when the user intends to remove the device event as well.

## Privacy and Permission Behavior

Calendar access is requested only after the user chooses an operation that needs it. MeTodo first checks that the Calendar API is available, then checks or requests calendar permission, and finally selects a calendar that permits modifications. This follows Expo’s guidance to request permission before calendar APIs and to prefer `allowsModifications` calendars.[1]

The CNG configuration includes the Expo Calendar plugin with a purpose-specific iOS permission message and declares Android calendar read/write permissions. No event data is sent to a MeTodo server by this feature.

## Failure Handling

| Condition | User-facing result |
|---|---|
| No due date | The linking action explains that a due date is required. |
| Web browser | The screen explains that the feature is native-only. |
| Permission denied | The screen explains that calendar permission is required. |
| No writable calendar | The screen reports that no editable device calendar is available. |
| Missing or externally deleted event | Update, view, and remove actions show a recoverable error instead of deleting task metadata automatically. |

## References

[1]: https://docs.expo.dev/versions/latest/sdk/calendar/ "Expo Calendar documentation"
