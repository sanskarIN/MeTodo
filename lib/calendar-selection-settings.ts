export interface CalendarSelectionSettings {
  preferredCalendarId: string | null;
  preferredCalendarTitle: string | null;
}

export const DEFAULT_CALENDAR_SELECTION_SETTINGS: CalendarSelectionSettings = {
  preferredCalendarId: null,
  preferredCalendarTitle: null,
};

export function normalizeCalendarSelectionSettings(value: unknown): CalendarSelectionSettings {
  const candidate = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const preferredCalendarId = typeof candidate.preferredCalendarId === "string" && candidate.preferredCalendarId.trim()
    ? candidate.preferredCalendarId
    : null;
  const preferredCalendarTitle = typeof candidate.preferredCalendarTitle === "string" && candidate.preferredCalendarTitle.trim()
    ? candidate.preferredCalendarTitle
    : null;

  return { preferredCalendarId, preferredCalendarTitle };
}
