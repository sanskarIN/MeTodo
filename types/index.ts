export type Priority = "low" | "medium" | "high";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  time: Date;
  type: "notification" | "email";
}

export interface TaskCalendarLink {
  eventId: string;
  calendarId: string;
  linkedAt: Date;
  lastSyncedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: Priority;
  completed: boolean;
  category: string;
  tags: string[];
  subtasks: Subtask[];
  reminders: Reminder[];
  recurrence: {
    type: RecurrenceType;
    endDate?: Date;
    customPattern?: string;
  };
  calendarEvent?: TaskCalendarLink;
  richNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface AvatarCustomization {
  id: string;
  name: string;
  hair: {
    style: string;
    color: string;
  };
  eyes: {
    shape: string;
    color: string;
  };
  accessories: string[];
  skinTone: string;
  createdAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  isCustom: boolean;
  createdAt: Date;
}

export type ChartAnimationSpeed = "slow" | "normal" | "fast";

export interface AppSettings {
  theme: string;
  customThemes: Theme[];
  avatar: AvatarCustomization | null;
  categories: Category[];
  notifications: boolean;
  darkMode: "auto" | "light" | "dark";
  language: string;
  version: string;
  chartAnimationSpeed: ChartAnimationSpeed;
  reduceMotion: boolean;
}

export interface DeveloperSettings {
  showLayoutBounds: boolean;
  showPerformanceOverlay: boolean;
  forceDarkMode: boolean;
  networkDelay: number;
  showTouchTargets: boolean;
  showFrameRate: boolean;
  showMemoryMonitor: boolean;
  animationSpeed: number;
  showDebugConsole: boolean;
  showNetworkActivity: boolean;
}
