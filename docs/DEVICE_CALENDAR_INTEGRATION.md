# Device Calendar Integration

## Overview

MeTodo lets a user add an individual task deadline from the task-detail screen or explicitly bulk-link eligible dated tasks from the Tasks tab. The feature is **explicit and opt-in**: MeTodo never scans an existing calendar, never syncs tasks automatically, and only writes events after the user confirms an individual or bulk action.

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
4. MeTodo lists writable calendars and the user explicitly selects one before the task event is created.
5. Use **View in Calendar** to open the operating-system event UI, **Update Calendar Event** to manually refresh task title/details/date, or **Remove Calendar Event** to delete the external event and unlink the task.

For bulk linking, open the **Tasks** tab, select the desired task filter, review the eligible-task count, choose **Choose Calendar & Link Eligible Tasks**, select a writable calendar, and confirm the batch. The results sheet explains every linked, skipped, and failed task.

> Removing a task in MeTodo does not silently delete a calendar event. Use **Remove Calendar Event** first when the user intends to remove the device event as well.

## Privacy and Permission Behavior

Calendar access is requested only after the user chooses an operation that needs it. MeTodo first checks that the Calendar API is available, then checks or requests calendar permission, and finally lists calendars that permit modifications. The selected calendar becomes the local preferred destination for later task links, but each task still stores its own destination calendar ID. This follows Expo’s guidance to request permission before calendar APIs and to prefer `allowsModifications` calendars.[1]

The CNG configuration includes the Expo Calendar plugin with a purpose-specific iOS permission message and declares Android calendar read/write permissions. No event data is sent to a MeTodo server by this feature.

## Bulk Linking Eligible Tasks

The **Tasks** tab offers an explicit bulk-link action for tasks visible under the current filter. A task is eligible only when it has a valid due date and no existing MeTodo calendar-event link. Tasks that are already linked, undated, or malformed are reported as skipped and are never overwritten. The user selects a writable destination calendar and confirms the batch before MeTodo creates events.

Calendar events are created one task at a time so every task receives a linked or failed outcome. Successful links are persisted together in local task storage, and the results sheet reports linked, skipped, and failed tasks individually. Calendar permission is requested once for the batch, the selected calendar is checked again for write access, and the web app shows a native-only explanation without calling calendar APIs.

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
